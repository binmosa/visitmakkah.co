'use client'

/**
 * RitualWidget Component
 *
 * Displays ritual instructions with steps and duas.
 * Expects normalized data from widget-normalizer.
 */

import { useState } from 'react'
import { Mosque01Icon, Location01Icon, Clock01Icon, AlertCircleIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

// Normalized types from widget-normalizer
interface NormalizedDua {
  arabic: string
  transliteration: string
  translation: string
}

interface NormalizedRitualStep {
  id: string
  number: number
  title: string
  arabicTitle?: string
  description: string
  dua?: NormalizedDua | null
  location?: string
  duration?: string
  tips?: string[]
  commonMistakes?: string[]
}

interface NormalizedRitual {
  title: string
  arabicTitle?: string
  description: string
  type?: string
  isFard?: boolean
  steps: NormalizedRitualStep[]
  prerequisites?: string[]
  tips?: string[]
  commonMistakes?: string[]
}

interface RitualWidgetProps {
  data: unknown
}

export default function RitualWidget({ data }: RitualWidgetProps) {
  const ritual = data as NormalizedRitual
  const [activeStep, setActiveStep] = useState(0)

  if (!ritual?.steps?.length) {
    return null
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-gradient-to-r from-violet-50 to-purple-50 px-4 py-4 dark:border-neutral-700 dark:from-violet-900/20 dark:to-purple-900/20">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-violet-100 p-2 dark:bg-violet-900/30">
              <HugeiconsIcon
                icon={Mosque01Icon}
                className="size-5 text-violet-600 dark:text-violet-400"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                {ritual.title}
              </h3>
              {ritual.arabicTitle && (
                <p className="font-arabic text-sm text-neutral-600 dark:text-neutral-400" dir="rtl">
                  {ritual.arabicTitle}
                </p>
              )}
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                {ritual.description}
              </p>
            </div>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              ritual.isFard
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            }`}
          >
            {ritual.isFard ? 'Obligatory' : 'Sunnah'}
          </span>
        </div>
      </div>

      {/* Prerequisites */}
      {ritual.prerequisites && ritual.prerequisites.length > 0 && (
        <div className="border-b border-neutral-200 bg-amber-50 px-4 py-3 dark:border-neutral-700 dark:bg-amber-900/10">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
            Prerequisites
          </p>
          <ul className="space-y-1">
            {ritual.prerequisites.map((prereq, i) => (
              <li key={i} className="text-sm text-amber-800 dark:text-amber-300">
                • {prereq}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Step Progress */}
      <div className="border-b border-neutral-200 px-4 py-3 dark:border-neutral-700">
        <div className="flex items-center gap-2">
          {ritual.steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(index)}
              className={`flex size-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                index === activeStep
                  ? 'bg-violet-600 text-white'
                  : index < activeStep
                    ? 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400'
                    : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Active Step */}
      <div className="px-4 py-4">
        <RitualStepCard step={ritual.steps[activeStep]} />
      </div>

      {/* Navigation */}
      <div className="flex justify-between border-t border-neutral-200 px-4 py-3 dark:border-neutral-700">
        <button
          onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
          disabled={activeStep === 0}
          className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 disabled:opacity-50 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          Previous
        </button>
        <button
          onClick={() => setActiveStep(Math.min(ritual.steps.length - 1, activeStep + 1))}
          disabled={activeStep === ritual.steps.length - 1}
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:opacity-50"
        >
          Next Step
        </button>
      </div>

      {/* Common Mistakes */}
      {ritual.commonMistakes && ritual.commonMistakes.length > 0 && (
        <div className="border-t border-neutral-200 bg-red-50 px-4 py-3 dark:border-neutral-700 dark:bg-red-900/10">
          <div className="flex gap-2">
            <HugeiconsIcon
              icon={AlertCircleIcon}
              className="mt-0.5 size-4 shrink-0 text-red-500"
              strokeWidth={1.5}
            />
            <div>
              <p className="mb-1 text-xs font-semibold text-red-700 dark:text-red-400">
                Common Mistakes to Avoid
              </p>
              <ul className="space-y-1">
                {ritual.commonMistakes.map((mistake, i) => (
                  <li key={i} className="text-sm text-red-800 dark:text-red-300">
                    • {mistake}
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

interface RitualStepCardProps {
  step: NormalizedRitualStep
}

function RitualStepCard({ step }: RitualStepCardProps) {
  return (
    <div>
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h4 className="text-lg font-semibold text-neutral-900 dark:text-white">{step.title}</h4>
          {step.arabicTitle && (
            <p className="font-arabic text-neutral-600 dark:text-neutral-400" dir="rtl">
              {step.arabicTitle}
            </p>
          )}
        </div>
        <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
          Step {step.number}
        </span>
      </div>

      <p className="text-neutral-700 dark:text-neutral-300">{step.description}</p>

      {/* Meta */}
      <div className="mt-3 flex flex-wrap gap-3">
        {step.location && (
          <span className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
            <HugeiconsIcon icon={Location01Icon} className="size-4" strokeWidth={1.5} />
            {step.location}
          </span>
        )}
        {step.duration && (
          <span className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
            <HugeiconsIcon icon={Clock01Icon} className="size-4" strokeWidth={1.5} />
            {step.duration}
          </span>
        )}
      </div>

      {/* Dua for this step */}
      {step.dua && (
        <div className="mt-4 rounded-xl border border-teal-200 bg-teal-50 p-4 dark:border-teal-800 dark:bg-teal-900/20">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-400">
            Dua for this step
          </p>
          <p className="text-right font-arabic text-lg leading-loose text-neutral-900 dark:text-white" dir="rtl">
            {step.dua.arabic}
          </p>
          <p className="mt-2 text-sm italic text-teal-700 dark:text-teal-300">
            {step.dua.transliteration}
          </p>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            {step.dua.translation}
          </p>
        </div>
      )}

      {/* Tips */}
      {step.tips && step.tips.length > 0 && (
        <div className="mt-4 rounded-lg bg-blue-50 px-3 py-2 dark:bg-blue-900/20">
          <p className="mb-1 text-xs font-semibold text-blue-700 dark:text-blue-400">💡 Tips</p>
          <ul className="space-y-1">
            {step.tips.map((tip, i) => (
              <li key={i} className="text-sm text-blue-800 dark:text-blue-300">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
