'use client'

/**
 * StreamingWidgetPlaceholder Component
 *
 * Shows a nice loading state while a widget is being generated.
 * Displays contextual messages based on widget type.
 */

import { Loading03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { WidgetType } from '@/types/widgets'

interface StreamingWidgetPlaceholderProps {
  widgetType?: WidgetType | string
}

const widgetMessages: Record<string, { title: string; steps: string[] }> = {
  itinerary: {
    title: 'Building Your Itinerary',
    steps: ['Planning your journey...', 'Organizing daily activities...', 'Adding helpful tips...'],
  },
  checklist: {
    title: 'Creating Your Checklist',
    steps: ['Gathering essential items...', 'Organizing by category...', 'Prioritizing items...'],
  },
  budget: {
    title: 'Calculating Your Budget',
    steps: ['Estimating costs...', 'Breaking down expenses...', 'Finding savings tips...'],
  },
  guide: {
    title: 'Preparing Your Guide',
    steps: ['Outlining the steps...', 'Adding detailed instructions...', 'Including helpful tips...'],
  },
  dua: {
    title: 'Finding the Dua',
    steps: ['Retrieving Arabic text...', 'Adding transliteration...', 'Preparing translation...'],
  },
  ritual: {
    title: 'Preparing Ritual Guide',
    steps: ['Outlining the steps...', 'Adding duas for each step...', 'Including important notes...'],
  },
  places: {
    title: 'Finding Places',
    steps: ['Searching nearby locations...', 'Gathering details...', 'Adding recommendations...'],
  },
  crowd: {
    title: 'Checking Crowd Levels',
    steps: ['Analyzing current data...', 'Preparing forecast...', 'Finding best times...'],
  },
  navigation: {
    title: 'Planning Your Route',
    steps: ['Finding the best path...', 'Calculating distance...', 'Adding landmarks...'],
  },
  tips: {
    title: 'Gathering Tips',
    steps: ['Collecting advice...', 'Organizing by priority...', 'Adding helpful details...'],
  },
  default: {
    title: 'Preparing Response',
    steps: ['Processing your request...', 'Building content...', 'Almost ready...'],
  },
}

export function StreamingWidgetPlaceholder({ widgetType }: StreamingWidgetPlaceholderProps) {
  const config = widgetMessages[widgetType || 'default'] || widgetMessages.default

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:border-neutral-700 dark:from-neutral-800 dark:to-neutral-900">
      <div className="px-4 py-6">
        <div className="flex items-center justify-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary-400 opacity-20" />
            <div className="relative rounded-full bg-primary-100 p-3 dark:bg-primary-900/30">
              <HugeiconsIcon
                icon={Loading03Icon}
                className="size-6 animate-spin text-primary-600 dark:text-primary-400"
                strokeWidth={2}
              />
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-white">
              {config.title}
            </h4>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {config.steps[Math.floor(Math.random() * config.steps.length)]}
            </p>
          </div>
        </div>

        {/* Animated dots */}
        <div className="mt-4 flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="size-2 animate-bounce rounded-full bg-primary-400"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default StreamingWidgetPlaceholder
