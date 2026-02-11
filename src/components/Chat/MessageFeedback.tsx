'use client'

import { useState } from 'react'

interface MessageFeedbackProps {
  messageId: string
  contextAction: string
}

type FeedbackType = 'positive' | 'negative' | null

// Simple thumbs up SVG
const ThumbsUp = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 10v12" />
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
  </svg>
)

// Simple thumbs down SVG
const ThumbsDown = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 14V2" />
    <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
  </svg>
)

export function MessageFeedback({ messageId, contextAction }: MessageFeedbackProps) {
  const [feedback, setFeedback] = useState<FeedbackType>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFeedback = async (type: FeedbackType) => {
    if (isSubmitting) return

    // Toggle off if clicking same button
    const newFeedback = feedback === type ? null : type

    setIsSubmitting(true)
    setFeedback(newFeedback)

    try {
      await fetch('/api/chat/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          contextAction,
          feedback: newFeedback,
        }),
      })
    } catch (error) {
      console.error('Failed to submit feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-3 flex items-center gap-2 border-t border-neutral-100 pt-3 dark:border-neutral-800">
      <span className="text-xs text-neutral-400 dark:text-neutral-500">Was this helpful?</span>
      <button
        onClick={() => handleFeedback('positive')}
        disabled={isSubmitting}
        className={`rounded-md p-1.5 transition-all ${
          feedback === 'positive'
            ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
            : 'text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300'
        }`}
        title="Yes, helpful"
      >
        <ThumbsUp className="size-4" />
      </button>
      <button
        onClick={() => handleFeedback('negative')}
        disabled={isSubmitting}
        className={`rounded-md p-1.5 transition-all ${
          feedback === 'negative'
            ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
            : 'text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300'
        }`}
        title="No, not helpful"
      >
        <ThumbsDown className="size-4" />
      </button>
    </div>
  )
}
