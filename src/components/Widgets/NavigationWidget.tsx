'use client'

/**
 * NavigationWidget Component
 *
 * Displays directions and navigation routes.
 * Expects normalized data from widget-normalizer.
 */

import { Navigation02Icon, Clock01Icon, Location01Icon, Route01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

// Normalized types
interface NormalizedNavStep {
  id: string
  number: number
  instruction: string
  distance?: string
  duration?: string
  landmark?: string
  mode?: 'walk' | 'drive' | 'bus' | 'train'
}

interface NormalizedNavigation {
  title: string
  from: string
  to: string
  totalDistance?: string
  totalDuration?: string
  mode: 'walk' | 'drive' | 'public' | 'mixed'
  steps: NormalizedNavStep[]
  alternatives?: { mode: string; duration: string; cost?: string }[]
  tips?: string[]
}

interface NavigationWidgetProps {
  data: unknown
}

export default function NavigationWidget({ data }: NavigationWidgetProps) {
  const nav = data as NormalizedNavigation

  if (!nav?.steps?.length) {
    return null
  }

  const modeIcons = {
    walk: '🚶',
    drive: '🚗',
    bus: '🚌',
    train: '🚇',
    public: '🚌',
    mixed: '🔄',
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-4 dark:border-neutral-700 dark:from-blue-900/20 dark:to-cyan-900/20">
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={Navigation02Icon}
            className="size-5 text-blue-600 dark:text-blue-400"
            strokeWidth={1.5}
          />
          <h3 className="font-bold text-neutral-900 dark:text-white">{nav.title}</h3>
        </div>

        {/* From/To */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              From
            </p>
            <p className="font-medium text-neutral-900 dark:text-white">{nav.from}</p>
          </div>
          <HugeiconsIcon
            icon={Route01Icon}
            className="size-5 text-neutral-400"
            strokeWidth={1.5}
          />
          <div className="flex-1 text-right">
            <p className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              To
            </p>
            <p className="font-medium text-neutral-900 dark:text-white">{nav.to}</p>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-3 flex items-center gap-4">
          <span className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400">
            <span className="text-lg">{modeIcons[nav.mode]}</span>
            {nav.mode.charAt(0).toUpperCase() + nav.mode.slice(1)}
          </span>
          <span className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400">
            <HugeiconsIcon icon={Location01Icon} className="size-4" strokeWidth={1.5} />
            {nav.totalDistance}
          </span>
          <span className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400">
            <HugeiconsIcon icon={Clock01Icon} className="size-4" strokeWidth={1.5} />
            {nav.totalDuration}
          </span>
        </div>
      </div>

      {/* Steps */}
      <div className="px-4 py-3">
        <div className="relative">
          {nav.steps.map((step, index) => (
            <NavigationStepRow
              key={step.id}
              step={step}
              isLast={index === nav.steps.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Alternatives */}
      {nav.alternatives && nav.alternatives.length > 0 && (
        <div className="border-t border-neutral-200 px-4 py-3 dark:border-neutral-700">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Alternative Routes
          </p>
          <div className="flex flex-wrap gap-2">
            {nav.alternatives.map((alt, i) => (
              <div
                key={i}
                className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800"
              >
                <span className="text-sm font-medium text-neutral-900 dark:text-white">
                  {alt.mode}
                </span>
                <span className="mx-2 text-neutral-300 dark:text-neutral-600">•</span>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  {alt.duration}
                </span>
                {alt.cost && (
                  <>
                    <span className="mx-2 text-neutral-300 dark:text-neutral-600">•</span>
                    <span className="text-sm text-green-600 dark:text-green-400">{alt.cost}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      {nav.tips && nav.tips.length > 0 && (
        <div className="border-t border-neutral-200 bg-amber-50 px-4 py-3 dark:border-neutral-700 dark:bg-amber-900/10">
          <p className="mb-1 text-xs font-semibold text-amber-700 dark:text-amber-400">💡 Tips</p>
          <ul className="space-y-1">
            {nav.tips.map((tip, i) => (
              <li key={i} className="text-sm text-amber-800 dark:text-amber-300">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

interface NavigationStepRowProps {
  step: NormalizedNavStep
  isLast: boolean
}

function NavigationStepRow({ step, isLast }: NavigationStepRowProps) {
  const modeIcons = {
    walk: '🚶',
    drive: '🚗',
    bus: '🚌',
    train: '🚇',
  }

  return (
    <div className="relative flex gap-3 pb-4">
      {/* Timeline */}
      <div className="flex flex-col items-center">
        <div className="flex size-7 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          {step.number}
        </div>
        {!isLast && (
          <div className="mt-1 h-full w-0.5 bg-blue-200 dark:bg-blue-800" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-2">
        <p className="font-medium text-neutral-900 dark:text-white">{step.instruction}</p>

        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          {step.mode && (
            <span className="flex items-center gap-1">
              <span>{modeIcons[step.mode] || '📍'}</span>
              {step.mode.charAt(0).toUpperCase() + step.mode.slice(1)}
            </span>
          )}
          {step.distance && (
            <span className="flex items-center gap-1">
              <HugeiconsIcon icon={Location01Icon} className="size-3" strokeWidth={1.5} />
              {step.distance}
            </span>
          )}
          {step.duration && (
            <span className="flex items-center gap-1">
              <HugeiconsIcon icon={Clock01Icon} className="size-3" strokeWidth={1.5} />
              {step.duration}
            </span>
          )}
        </div>

        {step.landmark && (
          <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
            📍 Landmark: {step.landmark}
          </p>
        )}
      </div>
    </div>
  )
}
