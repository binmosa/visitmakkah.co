'use client'

/**
 * SaveWidgetButton Component
 *
 * Button to save a widget to user's Saved collection.
 * Shows saved state and handles the save/unsave operation.
 */

import { useState, useCallback } from 'react'
import { BookmarkAdd01Icon, BookmarkCheck01Icon, Loading03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { getDeviceId } from '@/lib/data-service'

interface SaveWidgetButtonProps {
  widgetType: string
  title: string
  description?: string
  widgetData: Record<string, unknown>
  sourceContext?: string
  widgetState?: Record<string, unknown>
  className?: string
  size?: 'sm' | 'md'
}

export function SaveWidgetButton({
  widgetType,
  title,
  description,
  widgetData,
  sourceContext,
  widgetState,
  className = '',
  size = 'md',
}: SaveWidgetButtonProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  const handleSave = useCallback(async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const deviceId = getDeviceId()
      const response = await fetch('/api/user/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          widgetType,
          title,
          description,
          widgetData,
          sourceContext,
          widgetState,
        }),
      })

      if (response.ok) {
        setIsSaved(true)
        setShowFeedback(true)
        setTimeout(() => setShowFeedback(false), 2000)
      }
    } catch (err) {
      console.error('Error saving widget:', err)
    } finally {
      setIsLoading(false)
    }
  }, [widgetType, title, description, widgetData, sourceContext, widgetState, isLoading])

  const iconSize = size === 'sm' ? 'size-4' : 'size-5'
  const buttonPadding = size === 'sm' ? 'px-2 py-1.5' : 'px-3 py-2'

  return (
    <div className="relative">
      <button
        onClick={handleSave}
        disabled={isLoading || isSaved}
        className={`flex items-center gap-1.5 rounded-lg border transition-all ${
          isSaved
            ? 'border-primary-300 bg-primary-50 text-primary-700 dark:border-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
            : 'border-neutral-200 bg-white text-neutral-600 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-primary-700 dark:hover:bg-primary-900/30 dark:hover:text-primary-400'
        } ${buttonPadding} ${className}`}
      >
        {isLoading ? (
          <HugeiconsIcon icon={Loading03Icon} className={`${iconSize} animate-spin`} strokeWidth={1.5} />
        ) : isSaved ? (
          <HugeiconsIcon icon={BookmarkCheck01Icon} className={iconSize} strokeWidth={1.5} />
        ) : (
          <HugeiconsIcon icon={BookmarkAdd01Icon} className={iconSize} strokeWidth={1.5} />
        )}
        <span className={`font-medium ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          {isSaved ? 'Saved' : 'Save'}
        </span>
      </button>

      {/* Feedback toast */}
      {showFeedback && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-white dark:text-neutral-900">
          Added to Saved
        </div>
      )}
    </div>
  )
}

export default SaveWidgetButton
