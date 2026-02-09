'use client'

/**
 * DuaWidget Component
 *
 * Displays duas/prayers with Arabic text, transliteration, and translation.
 */

import { useState } from 'react'
import { BookOpen01Icon, VolumeHighIcon, Copy01Icon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { DuaWidgetData } from '@/types/widgets'

interface DuaWidgetProps {
  data: unknown
}

export default function DuaWidget({ data }: DuaWidgetProps) {
  const dua = data as DuaWidgetData
  const [copied, setCopied] = useState(false)

  if (!dua?.arabic) {
    return null
  }

  const handleCopy = async () => {
    const text = `${dua.arabic}\n\n${dua.transliteration}\n\n${dua.translation}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-gradient-to-r from-teal-50 to-emerald-50 px-4 py-3 dark:border-neutral-700 dark:from-teal-900/20 dark:to-emerald-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={BookOpen01Icon}
              className="size-5 text-teal-600 dark:text-teal-400"
              strokeWidth={1.5}
            />
            <h3 className="font-bold text-neutral-900 dark:text-white">{dua.title}</h3>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-neutral-500 transition-colors hover:bg-white/50 dark:hover:bg-neutral-800/50"
          >
            <HugeiconsIcon
              icon={copied ? CheckmarkCircle01Icon : Copy01Icon}
              className={`size-4 ${copied ? 'text-green-500' : ''}`}
              strokeWidth={1.5}
            />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        {dua.context && (
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{dua.context}</p>
        )}
      </div>

      {/* Arabic */}
      <div className="border-b border-neutral-200 px-4 py-5 dark:border-neutral-700">
        <p className="text-right font-arabic text-2xl leading-loose text-neutral-900 dark:text-white" dir="rtl">
          {dua.arabic}
        </p>
      </div>

      {/* Transliteration */}
      <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800/50">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Transliteration
        </p>
        <p className="text-sm italic text-neutral-700 dark:text-neutral-300">{dua.transliteration}</p>
      </div>

      {/* Translation */}
      <div className="px-4 py-3">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Translation
        </p>
        <p className="text-sm text-neutral-700 dark:text-neutral-300">{dua.translation}</p>
      </div>

      {/* When to recite */}
      {dua.whenToRecite && dua.whenToRecite.length > 0 && (
        <div className="border-t border-neutral-200 px-4 py-3 dark:border-neutral-700">
          <p className="mb-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
            When to recite:
          </p>
          <div className="flex flex-wrap gap-2">
            {dua.whenToRecite.map((when, i) => (
              <span
                key={i}
                className="rounded-full bg-teal-100 px-2.5 py-1 text-xs text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"
              >
                {when}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Benefits */}
      {dua.benefits && dua.benefits.length > 0 && (
        <div className="border-t border-neutral-200 bg-amber-50 px-4 py-3 dark:border-neutral-700 dark:bg-amber-900/10">
          <p className="mb-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
            ✨ Benefits
          </p>
          <ul className="space-y-1">
            {dua.benefits.map((benefit, i) => (
              <li key={i} className="text-sm text-amber-800 dark:text-amber-300">
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Source */}
      {dua.source && (
        <div className="border-t border-neutral-200 px-4 py-2 dark:border-neutral-700">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Source: <span className="italic">{dua.source}</span>
          </p>
        </div>
      )}
    </div>
  )
}
