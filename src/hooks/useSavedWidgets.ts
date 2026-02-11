/**
 * useSavedWidgets Hook
 *
 * Manages saved widgets - fetch, save, delete operations.
 * Uses Supabase for persistence.
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { getDeviceId } from '@/lib/data-service'
import type { WidgetType } from '@/types/widgets'

export interface SavedWidget {
  id: string
  widgetType: WidgetType
  title: string
  description: string | null
  widgetData: Record<string, unknown>
  sourceContext: string | null
  customTitle: string | null
  notes: string | null
  isPinned: boolean
  widgetState: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}

interface UseSavedWidgetsReturn {
  widgets: SavedWidget[]
  isLoading: boolean
  error: Error | null
  saveWidget: (params: SaveWidgetParams) => Promise<boolean>
  deleteWidget: (widgetId: string) => Promise<boolean>
  isWidgetSaved: (widgetType: string, title: string) => boolean
  refresh: () => void
}

interface SaveWidgetParams {
  widgetType: string
  title: string
  description?: string
  widgetData: Record<string, unknown>
  sourceContext?: string
  sourceTopicId?: string
  widgetState?: Record<string, unknown>
}

export function useSavedWidgets(): UseSavedWidgetsReturn {
  const [widgets, setWidgets] = useState<SavedWidget[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Fetch all saved widgets
  const fetchWidgets = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const deviceId = getDeviceId()
      const response = await fetch(`/api/user/widgets?deviceId=${deviceId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch widgets')
      }

      const data = await response.json()
      setWidgets(data.widgets || [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load on mount
  useEffect(() => {
    fetchWidgets()
  }, [fetchWidgets])

  // Save a widget
  const saveWidget = useCallback(async (params: SaveWidgetParams): Promise<boolean> => {
    try {
      const deviceId = getDeviceId()
      const response = await fetch('/api/user/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          ...params,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save widget')
      }

      // Refresh the list
      await fetchWidgets()
      return true
    } catch (err) {
      console.error('Error saving widget:', err)
      return false
    }
  }, [fetchWidgets])

  // Delete a widget
  const deleteWidget = useCallback(async (widgetId: string): Promise<boolean> => {
    try {
      const deviceId = getDeviceId()
      const response = await fetch(
        `/api/user/widgets?id=${widgetId}&deviceId=${deviceId}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        throw new Error('Failed to delete widget')
      }

      // Remove from local state
      setWidgets((prev) => prev.filter((w) => w.id !== widgetId))
      return true
    } catch (err) {
      console.error('Error deleting widget:', err)
      return false
    }
  }, [])

  // Check if a widget is already saved
  const isWidgetSaved = useCallback((widgetType: string, title: string): boolean => {
    return widgets.some(
      (w) => w.widgetType === widgetType && w.title === title
    )
  }, [widgets])

  return {
    widgets,
    isLoading,
    error,
    saveWidget,
    deleteWidget,
    isWidgetSaved,
    refresh: fetchWidgets,
  }
}

export default useSavedWidgets
