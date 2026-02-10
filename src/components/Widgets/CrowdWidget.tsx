'use client'

/**
 * CrowdWidget Component
 *
 * Displays crowd level indicators and forecasts.
 * Expects normalized data from widget-normalizer.
 */

import { UserGroupIcon, Clock01Icon, AlertCircleIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

// Normalized types
interface NormalizedCrowdPeriod {
  id: string
  time: string
  level: 'low' | 'moderate' | 'high' | 'very-high'
  description?: string
  recommendation?: string
}

interface NormalizedCrowd {
  title: string
  location: string
  currentLevel?: 'low' | 'moderate' | 'high' | 'very-high'
  lastUpdated?: string
  forecast: NormalizedCrowdPeriod[]
  bestTimes?: string[]
  tips?: string[]
  seasonalNote?: string
}

interface CrowdWidgetProps {
  data: unknown
}

export default function CrowdWidget({ data }: CrowdWidgetProps) {
  const crowd = data as NormalizedCrowd

  if (!crowd?.forecast?.length) {
    return null
  }

  const levelColors = {
    low: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-700 dark:text-green-400',
      bar: 'bg-green-500',
    },
    moderate: {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-700 dark:text-amber-400',
      bar: 'bg-amber-500',
    },
    high: {
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      text: 'text-orange-700 dark:text-orange-400',
      bar: 'bg-orange-500',
    },
    'very-high': {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-400',
      bar: 'bg-red-500',
    },
  }

  const levelWidth = {
    low: '25%',
    moderate: '50%',
    high: '75%',
    'very-high': '100%',
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      {/* Header */}
      <div className="border-b border-neutral-200 px-4 py-3 dark:border-neutral-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={UserGroupIcon}
              className="size-5 text-neutral-600 dark:text-neutral-400"
              strokeWidth={1.5}
            />
            <h3 className="font-bold text-neutral-900 dark:text-white">{crowd.title}</h3>
          </div>
          {crowd.currentLevel && (
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${levelColors[crowd.currentLevel].bg} ${levelColors[crowd.currentLevel].text}`}
            >
              Currently: {crowd.currentLevel.replace('-', ' ')}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{crowd.location}</p>
        {crowd.lastUpdated && (
          <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
            Last updated: {crowd.lastUpdated}
          </p>
        )}
      </div>

      {/* Forecast */}
      <div className="px-4 py-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          Crowd Forecast
        </p>
        <div className="space-y-3">
          {crowd.forecast.map((period) => (
            <CrowdPeriodRow key={period.id} period={period} />
          ))}
        </div>
      </div>

      {/* Best Times */}
      {crowd.bestTimes && crowd.bestTimes.length > 0 && (
        <div className="border-t border-neutral-200 bg-green-50 px-4 py-3 dark:border-neutral-700 dark:bg-green-900/10">
          <div className="flex gap-2">
            <HugeiconsIcon
              icon={Clock01Icon}
              className="mt-0.5 size-4 shrink-0 text-green-600 dark:text-green-400"
              strokeWidth={1.5}
            />
            <div>
              <p className="mb-1 text-xs font-semibold text-green-700 dark:text-green-400">
                Best Times to Visit
              </p>
              <div className="flex flex-wrap gap-2">
                {crowd.bestTimes.map((time, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  >
                    {time}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      {crowd.tips && crowd.tips.length > 0 && (
        <div className="border-t border-neutral-200 px-4 py-3 dark:border-neutral-700">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            💡 Tips
          </p>
          <ul className="space-y-1">
            {crowd.tips.map((tip, i) => (
              <li key={i} className="text-sm text-neutral-600 dark:text-neutral-400">
                • {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Seasonal Note */}
      {crowd.seasonalNote && (
        <div className="border-t border-neutral-200 bg-amber-50 px-4 py-2 dark:border-neutral-700 dark:bg-amber-900/10">
          <div className="flex gap-2">
            <HugeiconsIcon
              icon={AlertCircleIcon}
              className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400"
              strokeWidth={1.5}
            />
            <p className="text-xs text-amber-700 dark:text-amber-400">{crowd.seasonalNote}</p>
          </div>
        </div>
      )}
    </div>
  )
}

interface CrowdPeriodRowProps {
  period: NormalizedCrowdPeriod
}

function CrowdPeriodRow({ period }: CrowdPeriodRowProps) {
  const levelColors = {
    low: 'bg-green-500',
    moderate: 'bg-amber-500',
    high: 'bg-orange-500',
    'very-high': 'bg-red-500',
  }

  const levelWidth = {
    low: '25%',
    moderate: '50%',
    high: '75%',
    'very-high': '100%',
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-900 dark:text-white">{period.time}</span>
        <span className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">
          {period.level.replace('-', ' ')}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
        <div
          className={`h-full rounded-full transition-all ${levelColors[period.level]}`}
          style={{ width: levelWidth[period.level] }}
        />
      </div>
      {period.recommendation && (
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{period.recommendation}</p>
      )}
    </div>
  )
}
