'use client'

/**
 * ItineraryWidget Component
 *
 * Displays multi-day travel itineraries with activities, times, and tips.
 * Expects normalized data from widget-normalizer.
 */

import { useState } from 'react'
import { Calendar03Icon, Location01Icon, ArrowDown01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

// Normalized types from widget-normalizer
interface NormalizedActivity {
  id: string
  time: string
  title: string
  description: string
  location?: string
  type?: string
  tips?: string[]
}

interface NormalizedDay {
  id: string
  day: number
  title: string
  date?: string
  location: string
  summary?: string
  activities: NormalizedActivity[]
}

interface NormalizedItinerary {
  title: string
  summary?: string
  duration: { nights: number; days: number }
  journeyType?: string
  days: NormalizedDay[]
  tips?: string[]
  estimatedBudget?: { currency: string; min: number; max: number }
}

interface ItineraryWidgetProps {
  data: unknown
}

export default function ItineraryWidget({ data }: ItineraryWidgetProps) {
  const itinerary = data as NormalizedItinerary
  const [expandedDay, setExpandedDay] = useState<string | null>(itinerary?.days?.[0]?.id || null)

  if (!itinerary?.days?.length) {
    return null
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-primary-100 px-4 py-4 dark:border-neutral-700 dark:from-primary-900/20 dark:to-primary-800/20">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              {itinerary.title}
            </h3>
            {itinerary.summary && (
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                {itinerary.summary}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-white/80 px-2 py-1 text-xs font-medium text-primary-700 dark:bg-neutral-800/80 dark:text-primary-400">
            <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" strokeWidth={1.5} />
            {itinerary.duration.days} days, {itinerary.duration.nights} nights
          </div>
        </div>
      </div>

      {/* Days */}
      <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
        {itinerary.days.map((day) => (
          <DayAccordion
            key={day.id}
            day={day}
            isExpanded={expandedDay === day.id}
            onToggle={() => setExpandedDay(expandedDay === day.id ? null : day.id)}
          />
        ))}
      </div>

      {/* Footer with budget estimate */}
      {itinerary.estimatedBudget && (
        <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800/50">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Estimated budget:{' '}
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
              {itinerary.estimatedBudget.currency} {itinerary.estimatedBudget.min.toLocaleString()} -{' '}
              {itinerary.estimatedBudget.max.toLocaleString()}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}

interface DayAccordionProps {
  day: NormalizedDay
  isExpanded: boolean
  onToggle: () => void
}

function DayAccordion({ day, isExpanded, onToggle }: DayAccordionProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
            {day.day}
          </span>
          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-white">{day.title}</h4>
            <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
              <HugeiconsIcon icon={Location01Icon} className="size-3" strokeWidth={1.5} />
              {day.location}
            </div>
          </div>
        </div>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          className={`size-5 text-neutral-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          strokeWidth={1.5}
        />
      </button>

      {isExpanded && (
        <div className="border-t border-neutral-100 bg-neutral-50/50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/30">
          {day.summary && (
            <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-400">{day.summary}</p>
          )}
          <div className="space-y-3">
            {day.activities.map((activity, index) => (
              <div key={activity.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                    {activity.time}
                  </span>
                  {index < day.activities.length - 1 && (
                    <div className="mt-1 h-full w-px bg-neutral-200 dark:bg-neutral-700" />
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <h5 className="font-medium text-neutral-900 dark:text-white">{activity.title}</h5>
                  <p className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-400">
                    {activity.description}
                  </p>
                  {activity.location && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
                      <HugeiconsIcon icon={Location01Icon} className="size-3" strokeWidth={1.5} />
                      {activity.location}
                    </p>
                  )}
                  {activity.tips && activity.tips.length > 0 && (
                    <div className="mt-2 rounded-lg bg-amber-50 px-2 py-1.5 dark:bg-amber-900/20">
                      <p className="text-xs text-amber-700 dark:text-amber-400">
                        💡 {activity.tips[0]}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
