'use client'

/**
 * GuideWidget Component
 *
 * Displays step-by-step instructional guides.
 * Expects normalized data from widget-normalizer.
 */

import { Clock01Icon, AlertCircleIcon, InformationCircleIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

// Normalized step type (from widget-normalizer)
interface NormalizedStep {
  id: string
  number: number
  title: string
  description: string
  duration?: string
  tips?: string[]
  warnings?: string[]
}

// Normalized guide data type
interface NormalizedGuideData {
  title: string
  description: string
  category: string
  difficulty?: 'easy' | 'moderate' | 'challenging' | 'beginner'
  duration?: string
  steps: NormalizedStep[]
  prerequisites?: string[]
  tips?: string[]
}

interface GuideWidgetProps {
  data: unknown
}

export default function GuideWidget({ data }: GuideWidgetProps) {
  const guide = data as NormalizedGuideData

  if (!guide?.steps?.length) {
    return null
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      {/* Header */}
      <div className="border-b border-neutral-200 px-4 py-4 dark:border-neutral-700">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              {guide.title}
            </h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              {guide.description}
            </p>
          </div>
        </div>

        {/* Meta info */}
        <div className="mt-3 flex flex-wrap gap-3">
          {guide.duration && (
            <span className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
              <HugeiconsIcon icon={Clock01Icon} className="size-3.5" strokeWidth={1.5} />
              {guide.duration}
            </span>
          )}
          {guide.difficulty && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                guide.difficulty === 'easy'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : guide.difficulty === 'moderate'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}
            >
              {guide.difficulty.charAt(0).toUpperCase() + guide.difficulty.slice(1)}
            </span>
          )}
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
            {guide.steps.length} steps
          </span>
        </div>
      </div>

      {/* Prerequisites */}
      {guide.prerequisites && guide.prerequisites.length > 0 && (
        <div className="border-b border-neutral-200 bg-amber-50 px-4 py-3 dark:border-neutral-700 dark:bg-amber-900/10">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
            Before you begin
          </p>
          <ul className="space-y-1">
            {guide.prerequisites.map((prereq, i) => (
              <li key={i} className="text-sm text-amber-800 dark:text-amber-300">
                • {prereq}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Steps */}
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {guide.steps.map((step) => (
          <StepCard key={step.id} step={step} />
        ))}
      </div>

      {/* Tips */}
      {guide.tips && guide.tips.length > 0 && (
        <div className="border-t border-neutral-200 bg-blue-50 px-4 py-3 dark:border-neutral-700 dark:bg-blue-900/10">
          <div className="flex gap-2">
            <HugeiconsIcon
              icon={InformationCircleIcon}
              className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400"
              strokeWidth={1.5}
            />
            <div>
              <p className="mb-1 text-xs font-semibold text-blue-700 dark:text-blue-400">Tips</p>
              <ul className="space-y-1">
                {guide.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-blue-800 dark:text-blue-300">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface StepCardProps {
  step: NormalizedStep
}

function StepCard({ step }: StepCardProps) {
  return (
    <div className="px-4 py-4">
      <div className="flex gap-3">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
          {step.number}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-neutral-900 dark:text-white">{step.title}</h4>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{step.description}</p>

          {step.duration && (
            <p className="mt-2 flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
              <HugeiconsIcon icon={Clock01Icon} className="size-3" strokeWidth={1.5} />
              {step.duration}
            </p>
          )}

          {/* Tips for this step */}
          {step.tips && step.tips.length > 0 && (
            <div className="mt-2 rounded-lg bg-neutral-50 px-3 py-2 dark:bg-neutral-800/50">
              {step.tips.map((tip, i) => (
                <p key={i} className="text-xs text-neutral-600 dark:text-neutral-400">
                  💡 {tip}
                </p>
              ))}
            </div>
          )}

          {/* Warnings */}
          {step.warnings && step.warnings.length > 0 && (
            <div className="mt-2 rounded-lg bg-red-50 px-3 py-2 dark:bg-red-900/20">
              <div className="flex gap-2">
                <HugeiconsIcon
                  icon={AlertCircleIcon}
                  className="mt-0.5 size-3.5 shrink-0 text-red-500"
                  strokeWidth={1.5}
                />
                <div>
                  {step.warnings.map((warning, i) => (
                    <p key={i} className="text-xs text-red-700 dark:text-red-400">
                      {warning}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
