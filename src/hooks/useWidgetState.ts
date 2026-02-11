/**
 * useWidgetState Hook
 *
 * Provides persistent state for widgets that survives page refreshes.
 * Uses localStorage for persistence.
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { saveWidgetState, loadWidgetState } from '@/lib/widget-state-storage'

interface UseWidgetStateOptions<T> {
  contextAction: string
  widgetId: string
  initialState: T
}

export function useWidgetState<T>({
  contextAction,
  widgetId,
  initialState,
}: UseWidgetStateOptions<T>): [T, (newState: T | ((prev: T) => T)) => void] {
  const [state, setStateInternal] = useState<T>(initialState)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = loadWidgetState<T>(contextAction, widgetId)
    if (savedState !== null) {
      setStateInternal(savedState)
    }
    setIsHydrated(true)
  }, [contextAction, widgetId])

  // Save state to localStorage whenever it changes (after hydration)
  useEffect(() => {
    if (isHydrated) {
      saveWidgetState(contextAction, widgetId, state)
    }
  }, [contextAction, widgetId, state, isHydrated])

  // Wrapped setState that also persists
  const setState = useCallback((newState: T | ((prev: T) => T)) => {
    setStateInternal(prev => {
      const nextState = typeof newState === 'function'
        ? (newState as (prev: T) => T)(prev)
        : newState
      return nextState
    })
  }, [])

  return [state, setState]
}

export default useWidgetState
