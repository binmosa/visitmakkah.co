/**
 * useAIChat Hook
 *
 * Custom hook for AI chat functionality.
 * Uses a simple fetch-based approach for streaming responses.
 *
 * Features:
 * - Context-aware chat based on navigation action
 * - User profile personalization
 * - Widget parsing and state management
 * - Streaming text responses
 */

'use client'

import { useState, useCallback, useMemo, useRef } from 'react'
import { parseWidgets, type ContentSegment } from '@/lib/widget-parser'
import type { WidgetData, WidgetType } from '@/types/widgets'
import { useUserJourney } from '@/context/UserJourneyContext'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface UseAIChatOptions {
  contextAction: string
  topicId?: string
  onWidgetRendered?: (widget: WidgetData) => void
}

interface UseAIChatReturn {
  // Message state
  messages: Message[]
  input: string
  setInput: (value: string) => void

  // Actions
  handleSubmit: (e?: React.FormEvent) => void
  sendMessage: (content: string) => void
  reload: () => void
  stop: () => void

  // Status
  isLoading: boolean
  error: Error | undefined

  // Parsed content
  parsedMessages: Array<{
    id: string
    role: string
    segments: ContentSegment[]
    widgets: WidgetData[]
  }>

  // Widget state
  allWidgets: WidgetData[]
  widgetsByType: Record<WidgetType, WidgetData[]>

  // Conversation management
  clearMessages: () => void
}

// Generate unique ID
function generateId() {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

export function useAIChat({
  contextAction,
  topicId,
  onWidgetRendered,
}: UseAIChatOptions): UseAIChatReturn {
  const { user, daysUntilDeparture } = useUserJourney()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>(undefined)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Build user profile for API
  const userProfile = useMemo(
    () => ({
      journeyStage: user.journeyStage,
      journeyType: user.journeyType,
      isFirstTime: user.isFirstTime,
      gender: user.gender,
      country: user.country,
      travelGroup: user.travelGroup,
      departureDate: user.travelDates.departure,
      returnDate: user.travelDates.return,
      daysUntilDeparture,
    }),
    [user, daysUntilDeparture]
  )

  // Send message to API with streaming
  const sendToAPI = useCallback(
    async (messagesToSend: Message[]) => {
      setIsLoading(true)
      setError(undefined)

      // Create abort controller
      const abortController = new AbortController()
      abortControllerRef.current = abortController

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: messagesToSend.map((m) => ({ role: m.role, content: m.content })),
            contextAction,
            userProfile,
            topicId,
          }),
          signal: abortController.signal,
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || 'Failed to get response')
        }

        // Check if it's a refinement response (non-streaming JSON)
        const contentType = response.headers.get('content-type')
        if (contentType?.includes('application/json')) {
          const data = await response.json()
          const assistantMessage: Message = {
            id: generateId(),
            role: 'assistant',
            content: data.content,
          }
          setMessages((prev) => [...prev, assistantMessage])
          setIsLoading(false)
          return
        }

        // Handle streaming response
        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error('No response body')
        }

        const decoder = new TextDecoder()
        let assistantContent = ''
        const assistantId = generateId()

        // Add empty assistant message
        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: 'assistant', content: '' },
        ])

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          assistantContent += chunk

          // Update the assistant message with accumulated content
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: assistantContent } : m
            )
          )
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Request was aborted, don't set error
        } else {
          setError(err instanceof Error ? err : new Error('Unknown error'))
        }
      } finally {
        setIsLoading(false)
        abortControllerRef.current = null
      }
    },
    [contextAction, userProfile, topicId]
  )

  // Handle form submit
  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault()
      }
      if (!input.trim() || isLoading) return

      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: input.trim(),
      }

      const newMessages = [...messages, userMessage]
      setMessages(newMessages)
      setInput('')

      sendToAPI(newMessages)
    },
    [input, isLoading, messages, sendToAPI]
  )

  // Send message programmatically
  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim() || isLoading) return

      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
      }

      const newMessages = [...messages, userMessage]
      setMessages(newMessages)

      sendToAPI(newMessages)
    },
    [isLoading, messages, sendToAPI]
  )

  // Reload last response
  const reload = useCallback(() => {
    // Find last user message
    const lastUserIndex = messages.map((m) => m.role).lastIndexOf('user')
    if (lastUserIndex === -1) return

    // Remove assistant messages after last user message
    const newMessages = messages.slice(0, lastUserIndex + 1)
    setMessages(newMessages)
    sendToAPI(newMessages)
  }, [messages, sendToAPI])

  // Stop streaming
  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [])

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([])
    setError(undefined)
  }, [])

  // Parse messages to extract widgets
  const parsedMessages = useMemo(() => {
    return messages.map((msg) => {
      if (msg.role === 'user') {
        return {
          id: msg.id,
          role: 'user' as const,
          segments: [{ type: 'text' as const, content: msg.content }],
          widgets: [],
        }
      }

      const parsed = parseWidgets(msg.content)
      return {
        id: msg.id,
        role: 'assistant' as const,
        segments: parsed.segments,
        widgets: parsed.widgets,
      }
    })
  }, [messages])

  // Collect all widgets
  const allWidgets = useMemo(() => {
    const widgets: WidgetData[] = []
    messages.forEach((msg) => {
      if (msg.role === 'assistant') {
        const parsed = parseWidgets(msg.content)
        widgets.push(...parsed.widgets)
      }
    })

    // Notify about widgets
    if (onWidgetRendered) {
      widgets.forEach((widget) => onWidgetRendered(widget))
    }

    return widgets
  }, [messages, onWidgetRendered])

  // Group widgets by type
  const widgetsByType = useMemo(() => {
    const grouped: Record<WidgetType, WidgetData[]> = {
      itinerary: [],
      checklist: [],
      budget: [],
      guide: [],
      dua: [],
      ritual: [],
      places: [],
      crowd: [],
      navigation: [],
      tips: [],
    }

    allWidgets.forEach((widget) => {
      if (grouped[widget.type]) {
        grouped[widget.type].push(widget)
      }
    })

    return grouped
  }, [allWidgets])

  return {
    messages,
    input,
    setInput,
    handleSubmit,
    sendMessage,
    reload,
    stop,
    isLoading,
    error,
    parsedMessages,
    allWidgets,
    widgetsByType,
    clearMessages,
  }
}
