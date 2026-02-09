'use client'

/**
 * BudgetWidget Component
 *
 * Displays budget breakdowns with categories and totals.
 */

import { DollarCircleIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { BudgetWidgetData, BudgetItem } from '@/types/widgets'

interface BudgetWidgetProps {
  data: unknown
}

export default function BudgetWidget({ data }: BudgetWidgetProps) {
  const budget = data as BudgetWidgetData

  if (!budget?.breakdown?.length) {
    return null
  }

  const requiredTotal = budget.breakdown
    .filter((item) => !item.isOptional)
    .reduce((sum, item) => sum + item.amount, 0)

  const optionalTotal = budget.breakdown
    .filter((item) => item.isOptional)
    .reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-gradient-to-r from-emerald-50 to-emerald-100 px-4 py-4 dark:border-neutral-700 dark:from-emerald-900/20 dark:to-emerald-800/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              {budget.title}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              {budget.currency} {budget.total.toLocaleString()}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Estimated total</p>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {budget.breakdown.map((item, index) => (
          <BudgetRow key={index} item={item} currency={budget.currency} />
        ))}
      </div>

      {/* Summary */}
      <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800/50">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">Required expenses</span>
          <span className="font-semibold text-neutral-900 dark:text-white">
            {budget.currency} {requiredTotal.toLocaleString()}
          </span>
        </div>
        {optionalTotal > 0 && (
          <div className="mt-1 flex justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">Optional expenses</span>
            <span className="text-neutral-500 dark:text-neutral-400">
              {budget.currency} {optionalTotal.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Savings Tips */}
      {budget.savingsTips && budget.savingsTips.length > 0 && (
        <div className="border-t border-neutral-200 px-4 py-3 dark:border-neutral-700">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            💡 Money-Saving Tips
          </p>
          <ul className="space-y-1">
            {budget.savingsTips.map((tip, i) => (
              <li key={i} className="text-sm text-neutral-600 dark:text-neutral-400">
                • {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

interface BudgetRowProps {
  item: BudgetItem
  currency: string
}

function BudgetRow({ item, currency }: BudgetRowProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <div
          className={`flex size-8 items-center justify-center rounded-lg ${
            item.isOptional
              ? 'bg-neutral-100 dark:bg-neutral-800'
              : 'bg-emerald-100 dark:bg-emerald-900/30'
          }`}
        >
          <HugeiconsIcon
            icon={DollarCircleIcon}
            className={`size-4 ${
              item.isOptional
                ? 'text-neutral-500 dark:text-neutral-400'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}
            strokeWidth={1.5}
          />
        </div>
        <div>
          <p className="font-medium text-neutral-900 dark:text-white">{item.category}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.description}</p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`font-semibold ${
            item.isOptional
              ? 'text-neutral-500 dark:text-neutral-400'
              : 'text-neutral-900 dark:text-white'
          }`}
        >
          {currency} {item.amount.toLocaleString()}
        </p>
        {item.isOptional && (
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500">Optional</span>
        )}
      </div>
    </div>
  )
}
