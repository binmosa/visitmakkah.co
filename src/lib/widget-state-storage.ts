/**
 * Widget State Storage
 *
 * Persists widget interaction state (checked items, expanded sections, etc.)
 * to localStorage. Each widget instance is keyed by contextAction + widgetId.
 */

const STORAGE_KEY_PREFIX = 'vm_widget_state_'

/**
 * Get storage key for a widget
 */
function getStorageKey(contextAction: string, widgetId: string): string {
  return `${STORAGE_KEY_PREFIX}${contextAction}_${widgetId}`
}

/**
 * Save widget state
 */
export function saveWidgetState<T>(
  contextAction: string,
  widgetId: string,
  state: T
): void {
  if (typeof window === 'undefined') return

  try {
    const key = getStorageKey(contextAction, widgetId)
    localStorage.setItem(key, JSON.stringify({
      state,
      updatedAt: Date.now(),
    }))
  } catch (e) {
    console.error('[widget-state-storage] Failed to save:', e)
  }
}

/**
 * Load widget state
 */
export function loadWidgetState<T>(
  contextAction: string,
  widgetId: string
): T | null {
  if (typeof window === 'undefined') return null

  try {
    const key = getStorageKey(contextAction, widgetId)
    const data = localStorage.getItem(key)
    if (!data) return null

    const parsed = JSON.parse(data)
    return parsed.state as T
  } catch (e) {
    console.error('[widget-state-storage] Failed to load:', e)
    return null
  }
}

/**
 * Clear widget state for a specific context
 */
export function clearWidgetStatesForContext(contextAction: string): void {
  if (typeof window === 'undefined') return

  try {
    const prefix = `${STORAGE_KEY_PREFIX}${contextAction}_`
    const keysToRemove: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key)
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key))
  } catch (e) {
    console.error('[widget-state-storage] Failed to clear:', e)
  }
}

/**
 * Clear all widget states
 */
export function clearAllWidgetStates(): void {
  if (typeof window === 'undefined') return

  try {
    const keysToRemove: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        keysToRemove.push(key)
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key))
  } catch (e) {
    console.error('[widget-state-storage] Failed to clear all:', e)
  }
}
