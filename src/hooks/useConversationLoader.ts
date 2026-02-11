/**
 * useConversationLoader Hook
 *
 * Loads a specific conversation by ID for continuing a previous chat.
 */

'use client'

import { useState, useEffect, useCallback } from 'react'

export interface ConversationMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

interface UseConversationLoaderReturn {
  messages: ConversationMessage[]
  isLoading: boolean
  error: Error | null
  reload: () => void
}

export function useConversationLoader(conversationId: string | null): UseConversationLoaderReturn {
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const loadConversation = useCallback(async () => {
    if (!conversationId) {
      setMessages([])
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/chat/conversation?topicId=${conversationId}`)

      if (!response.ok) {
        throw new Error('Failed to load conversation')
      }

      const data = await response.json()
      setMessages(data.messages || [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
      setMessages([])
    } finally {
      setIsLoading(false)
    }
  }, [conversationId])

  useEffect(() => {
    loadConversation()
  }, [loadConversation])

  return {
    messages,
    isLoading,
    error,
    reload: loadConversation,
  }
}

export default useConversationLoader
