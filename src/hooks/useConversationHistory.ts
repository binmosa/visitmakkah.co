/**
 * useConversationHistory Hook
 *
 * Fetches and manages conversation history for the user.
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { getDeviceId } from '@/lib/data-service'

export interface ConversationPreview {
  id: string
  context: string
  contextLabel: string | null
  startedAt: string
  messageCount: number
  lastMessage: string | null
  lastMessageAt: string | null
}

interface UseConversationHistoryReturn {
  conversations: ConversationPreview[]
  isLoading: boolean
  error: Error | null
  refresh: () => void
}

export function useConversationHistory(limit = 10): UseConversationHistoryReturn {
  const [conversations, setConversations] = useState<ConversationPreview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchHistory = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const deviceId = getDeviceId()
      const response = await fetch(`/api/user/history?deviceId=${deviceId}&limit=${limit}`)

      if (!response.ok) {
        throw new Error('Failed to fetch history')
      }

      const data = await response.json()
      setConversations(data.conversations || [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return {
    conversations,
    isLoading,
    error,
    refresh: fetchHistory,
  }
}

export default useConversationHistory
