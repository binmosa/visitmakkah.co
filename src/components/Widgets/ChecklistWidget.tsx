'use client'

/**
 * ChecklistWidget Component
 *
 * Displays interactive checklists with categories and progress tracking.
 * Persists checked state across page refreshes using useWidgetState.
 */

import { useState, useMemo } from 'react'
import { CheckmarkSquare01Icon, Square01Icon, ArrowDown01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useWidgetState } from '@/hooks/useWidgetState'
import type { ChecklistWidgetData, ChecklistCategory, ChecklistItem } from '@/types/widgets'

interface ChecklistWidgetProps {
  data: unknown
  contextAction?: string
}

export default function ChecklistWidget({ data, contextAction }: ChecklistWidgetProps) {
  const checklist = data as ChecklistWidgetData

  // Add IDs to items if missing
  const categoriesWithIds = useMemo(() => checklist?.categories?.map((cat, catIndex) => ({
    ...cat,
    items: cat.items?.map((item, itemIndex) => ({
      ...item,
      id: item.id || `${catIndex}-${itemIndex}`,
    })) || []
  })) || [], [checklist?.categories])

  // Generate a unique widget ID based on the checklist title
  const widgetId = useMemo(() => {
    const title = checklist?.title || 'checklist'
    return `checklist-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  }, [checklist?.title])

  // Use persistent state for checked items when contextAction is available
  const [persistedItems, setPersistedItems] = useWidgetState<Record<string, boolean>>({
    contextAction: contextAction || 'default',
    widgetId,
    initialState: {},
  })

  // For expanded categories, use regular state (no need to persist)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set([categoriesWithIds[0]?.name]))

  // Use persisted items if contextAction is provided
  const items = persistedItems
  const setItems = setPersistedItems

  if (!categoriesWithIds.length) {
    return null
  }

  const toggleItem = (itemId: string) => {
    setItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }))
  }

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(categoryName)) {
        next.delete(categoryName)
      } else {
        next.add(categoryName)
      }
      return next
    })
  }

  // Calculate progress
  const totalItems = categoriesWithIds.reduce((sum, cat) => sum + cat.items.length, 0)
  const checkedItems = Object.values(items).filter(Boolean).length
  const progress = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      {/* Header */}
      <div className="border-b border-neutral-200 px-4 py-4 dark:border-neutral-700">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              {checklist.title}
            </h3>
            {checklist.description && (
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                {checklist.description}
              </p>
            )}
          </div>
          <span className="rounded-full bg-primary-100 px-2.5 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
            {checkedItems}/{totalItems}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
            <div
              className="h-full rounded-full bg-primary-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            {progress}% complete
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
        {categoriesWithIds.map((category) => (
          <CategorySection
            key={category.name}
            category={category}
            isExpanded={expandedCategories.has(category.name)}
            onToggle={() => toggleCategory(category.name)}
            itemStates={items}
            onToggleItem={toggleItem}
          />
        ))}
      </div>
    </div>
  )
}

interface CategorySectionProps {
  category: ChecklistCategory
  isExpanded: boolean
  onToggle: () => void
  itemStates: Record<string, boolean>
  onToggleItem: (itemId: string) => void
}

function CategorySection({
  category,
  isExpanded,
  onToggle,
  itemStates,
  onToggleItem,
}: CategorySectionProps) {
  const checkedCount = category.items.filter((item) => itemStates[item.id]).length

  return (
    <div>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{category.icon || '📋'}</span>
          <span className="font-semibold text-neutral-900 dark:text-white">{category.name}</span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            ({checkedCount}/{category.items.length})
          </span>
        </div>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          className={`size-5 text-neutral-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          strokeWidth={1.5}
        />
      </button>

      {isExpanded && (
        <div className="border-t border-neutral-100 bg-neutral-50/50 px-4 py-2 dark:border-neutral-800 dark:bg-neutral-800/30">
          {category.items.map((item) => (
            <ChecklistItemRow
              key={item.id}
              item={item}
              isChecked={itemStates[item.id] || false}
              onToggle={() => onToggleItem(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface ChecklistItemRowProps {
  item: ChecklistItem
  isChecked: boolean
  onToggle: () => void
}

function ChecklistItemRow({ item, isChecked, onToggle }: ChecklistItemRowProps) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-start gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
    >
      <HugeiconsIcon
        icon={isChecked ? CheckmarkSquare01Icon : Square01Icon}
        className={`mt-0.5 size-5 shrink-0 ${
          isChecked ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-400'
        }`}
        strokeWidth={1.5}
      />
      <div className="flex-1">
        <span
          className={`text-sm ${
            isChecked
              ? 'text-neutral-400 line-through dark:text-neutral-500'
              : 'text-neutral-700 dark:text-neutral-300'
          }`}
        >
          {item.text}
        </span>
        {item.notes && !isChecked && (
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{item.notes}</p>
        )}
      </div>
      {item.priority === 'essential' && !isChecked && (
        <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
          Essential
        </span>
      )}
    </button>
  )
}
