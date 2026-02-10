'use client'

/**
 * TipsWidget Component
 *
 * Displays tips and advice cards.
 * Expects normalized data from widget-normalizer.
 */

import { BulbIcon, AlertCircleIcon, StarIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

// Normalized types
interface NormalizedTip {
  id: string
  title: string
  content: string
  category: string
  icon?: string
  priority?: 'must-know' | 'helpful' | 'bonus'
}

interface NormalizedTipsData {
  title: string
  description?: string
  audience?: 'all' | 'first-timers' | 'women' | 'elderly' | 'families'
  tips: NormalizedTip[]
  categories?: string[]
}

interface TipsWidgetProps {
  data: unknown
}

export default function TipsWidget({ data }: TipsWidgetProps) {
  const tips = data as NormalizedTipsData

  if (!tips?.tips?.length) {
    return null
  }

  const audienceLabels = {
    all: 'Everyone',
    'first-timers': 'First-Time Pilgrims',
    women: 'Women',
    elderly: 'Elderly Pilgrims',
    families: 'Families',
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-3 dark:border-neutral-700 dark:from-amber-900/20 dark:to-yellow-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={BulbIcon}
              className="size-5 text-amber-600 dark:text-amber-400"
              strokeWidth={1.5}
            />
            <h3 className="font-bold text-neutral-900 dark:text-white">{tips.title}</h3>
          </div>
          {tips.audience && tips.audience !== 'all' && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              For {audienceLabels[tips.audience]}
            </span>
          )}
        </div>
        {tips.description && (
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{tips.description}</p>
        )}
      </div>

      {/* Tips List */}
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {tips.tips.map((tip) => (
          <TipCard key={tip.id} tip={tip} />
        ))}
      </div>
    </div>
  )
}

interface TipCardProps {
  tip: NormalizedTip
}

function TipCard({ tip }: TipCardProps) {
  const priorityStyles = {
    'must-know': {
      icon: AlertCircleIcon,
      bg: 'bg-red-50 dark:bg-red-900/10',
      iconColor: 'text-red-500',
      badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
    helpful: {
      icon: BulbIcon,
      bg: 'bg-amber-50 dark:bg-amber-900/10',
      iconColor: 'text-amber-500',
      badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    },
    bonus: {
      icon: StarIcon,
      bg: 'bg-blue-50 dark:bg-blue-900/10',
      iconColor: 'text-blue-500',
      badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
  }

  const priority = tip.priority || 'helpful'
  const styles = priorityStyles[priority]
  const Icon = styles.icon

  return (
    <div className={`px-4 py-3 ${priority === 'must-know' ? styles.bg : ''}`}>
      <div className="flex gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-xl shadow-sm dark:bg-neutral-800">
          {tip.icon || '💡'}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-neutral-900 dark:text-white">{tip.title}</h4>
            {tip.priority && (
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${styles.badge}`}>
                {tip.priority === 'must-know' ? 'Must Know' : tip.priority.charAt(0).toUpperCase() + tip.priority.slice(1)}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{tip.content}</p>
          {tip.category && (
            <span className="mt-2 inline-block rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
              {tip.category}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
