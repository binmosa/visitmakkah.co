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
 * - Conversation persistence to Supabase with localStorage cache
 */

'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { parseWidgets, type ContentSegment } from '@/lib/widget-parser'
import type { WidgetData, WidgetType } from '@/types/widgets'
import { useUserJourney } from '@/context/UserJourneyContext'
import {
  loadConversation,
  addMessageToConversation,
  updateLastAssistantMessage,
  clearConversation,
  saveConversation,
} from '@/lib/conversation-storage'
import { getDeviceId } from '@/lib/data-service'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface UseAIChatOptions {
  contextAction: string
  contextLabel?: string
  onWidgetRendered?: (widget: WidgetData) => void
  persistConversation?: boolean // Enable/disable persistence (default: true)
  conversationId?: string | null // Optional: Load specific conversation by ID (from history)
}

// Storage key for topic IDs
const TOPIC_STORAGE_PREFIX = 'vm_topic_'

function getTopicStorageKey(contextAction: string): string {
  return `${TOPIC_STORAGE_PREFIX}${contextAction}`
}

function loadTopicId(contextAction: string): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(getTopicStorageKey(contextAction))
}

function saveTopicId(contextAction: string, topicId: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(getTopicStorageKey(contextAction), topicId)
}

function clearTopicId(contextAction: string): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(getTopicStorageKey(contextAction))
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

  // History loading state
  hasLoadedHistory: boolean // True if conversation was loaded from history
}

// Generate unique ID
function generateId() {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

export function useAIChat({
  contextAction,
  contextLabel,
  onWidgetRendered,
  persistConversation = true,
  conversationId,
}: UseAIChatOptions): UseAIChatReturn {
  const { user, daysUntilDeparture } = useUserJourney()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>(undefined)
  const [topicId, setTopicId] = useState<string | null>(null)
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const isHydrated = useRef(false)
  const isLoadingConversation = useRef(false)

  // Load conversation ONLY when explicitly requested via conversationId (from saved/history page)
  // For normal action item clicks, always start a fresh conversation
  useEffect(() => {
    if (!persistConversation || isLoadingConversation.current) return

    // Only load history if conversationId is explicitly provided (from saved/history page)
    if (!conversationId) {
      // Fresh conversation - clear any old topic ID for this context
      clearTopicId(contextAction)
      isHydrated.current = true
      return
    }

    isLoadingConversation.current = true

    async function loadFromSupabase() {
      try {
        // Load specific conversation from history
        const params = new URLSearchParams()
        params.set('topicId', conversationId!)

        const response = await fetch(`/api/chat/conversation?${params}`)
        if (response.ok) {
          const data = await response.json()
          if (data.topicId) {
            setTopicId(data.topicId)
            saveTopicId(contextAction, data.topicId)
          }
          if (data.messages && data.messages.length > 0) {
            const loadedMessages: Message[] = data.messages.map((m: { id: string; role: 'user' | 'assistant'; content: string }) => ({
              id: m.id,
              role: m.role,
              content: m.content,
            }))
            setMessages(loadedMessages)

            // Mark as loaded from history
            setHasLoadedHistory(true)

            // Also update localStorage cache
            saveConversation({
              id: data.topicId || `local_${contextAction}`,
              contextAction,
              messages: loadedMessages.map((m) => ({
                id: m.id,
                role: m.role,
                content: m.content,
                timestamp: Date.now(),
              })),
              createdAt: Date.now(),
              updatedAt: Date.now(),
            })
          }
        }
      } catch (e) {
        console.warn('Failed to load conversation from history:', e)
      }
      isHydrated.current = true
    }

    loadFromSupabase()
  }, [contextAction, persistConversation, conversationId])

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

  // Create a new topic in Supabase
  const createNewTopic = useCallback(async (): Promise<string | null> => {
    try {
      const deviceId = getDeviceId()
      const response = await fetch('/api/chat/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contextAction,
          contextLabel,
          deviceId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.topic?.id) {
          setTopicId(data.topic.id)
          saveTopicId(contextAction, data.topic.id)
          return data.topic.id
        }
      }
    } catch (e) {
      console.warn('Failed to create topic:', e)
    }
    return null
  }, [contextAction, contextLabel])

  // Send message to API with streaming
  const sendToAPI = useCallback(
    async (messagesToSend: Message[]) => {
      setIsLoading(true)
      setError(undefined)

      // Create abort controller
      const abortController = new AbortController()
      abortControllerRef.current = abortController

      // Create topic if needed (first message)
      let currentTopicId = topicId
      if (!currentTopicId && persistConversation) {
        currentTopicId = await createNewTopic()
      }

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
            topicId: currentTopicId,
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

          // Persist to localStorage
          if (persistConversation) {
            addMessageToConversation(contextAction, {
              id: assistantMessage.id,
              role: 'assistant',
              content: assistantMessage.content,
            })
          }

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

        // Add placeholder to storage (will be updated)
        if (persistConversation) {
          addMessageToConversation(contextAction, {
            id: assistantId,
            role: 'assistant',
            content: '',
          })
        }

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

        // Final persist of complete message
        if (persistConversation) {
          updateLastAssistantMessage(contextAction, assistantContent)
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
    [contextAction, userProfile, topicId, persistConversation, createNewTopic]
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

      // Persist user message
      if (persistConversation) {
        addMessageToConversation(contextAction, {
          id: userMessage.id,
          role: 'user',
          content: userMessage.content,
        })
      }

      sendToAPI(newMessages)
    },
    [input, isLoading, messages, sendToAPI, persistConversation, contextAction]
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

      // Persist user message
      if (persistConversation) {
        addMessageToConversation(contextAction, {
          id: userMessage.id,
          role: 'user',
          content: userMessage.content,
        })
      }

      sendToAPI(newMessages)
    },
    [isLoading, messages, sendToAPI, persistConversation, contextAction]
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
    setTopicId(null)
    // Also clear from storage
    if (persistConversation) {
      clearConversation(contextAction)
      clearTopicId(contextAction)
    }
  }, [persistConversation, contextAction])

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
    hasLoadedHistory,
  }
}
