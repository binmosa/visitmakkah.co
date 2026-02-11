'use client'

/**
 * WidgetRenderer Component
 *
 * Dynamically renders the appropriate widget component based on type.
 * Uses dynamic imports for code splitting.
 * Normalizes data before passing to widgets for consistent structure.
 * Includes save button for users to save widgets to their collection.
 */

import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import type { WidgetType } from '@/types/widgets'
import { normalizeWidgetData, validateWidgetData } from '@/lib/widget-normalizer'
import { SaveWidgetButton } from '@/components/Widgets/SaveWidgetButton'

// Loading placeholder for widgets
function WidgetLoading() {
  return (
    <div className="animate-pulse rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
      <div className="h-4 w-1/3 rounded bg-neutral-200 dark:bg-neutral-700" />
      <div className="mt-3 h-20 rounded bg-neutral-200 dark:bg-neutral-700" />
    </div>
  )
}

// Error placeholder for widgets
function WidgetError({ type }: { type: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
      <p className="text-sm text-red-600 dark:text-red-400">
        Failed to load {type} widget
      </p>
    </div>
  )
}

// Dynamic imports for each widget type
const widgetComponents: Record<WidgetType, React.ComponentType<{ data: unknown; contextAction?: string }>> = {
  itinerary: dynamic(() => import('../Widgets/ItineraryWidget').then(mod => mod.default), {
    loading: () => <WidgetLoading />,
  }),
  checklist: dynamic(() => import('../Widgets/ChecklistWidget').then(mod => mod.default), {
    loading: () => <WidgetLoading />,
  }),
  budget: dynamic(() => import('../Widgets/BudgetWidget').then(mod => mod.default), {
    loading: () => <WidgetLoading />,
  }),
  guide: dynamic(() => import('../Widgets/GuideWidget').then(mod => mod.default), {
    loading: () => <WidgetLoading />,
  }),
  dua: dynamic(() => import('../Widgets/DuaWidget').then(mod => mod.default), {
    loading: () => <WidgetLoading />,
  }),
  ritual: dynamic(() => import('../Widgets/RitualWidget').then(mod => mod.default), {
    loading: () => <WidgetLoading />,
  }),
  places: dynamic(() => import('../Widgets/PlacesWidget').then(mod => mod.default), {
    loading: () => <WidgetLoading />,
  }),
  navigation: dynamic(() => import('../Widgets/NavigationWidget').then(mod => mod.default), {
    loading: () => <WidgetLoading />,
  }),
  tips: dynamic(() => import('../Widgets/TipsWidget').then(mod => mod.default), {
    loading: () => <WidgetLoading />,
  }),
}

interface WidgetRendererProps {
  type: WidgetType | string
  data: unknown
  className?: string
  contextAction?: string
  showSaveButton?: boolean // Show save button (default: true for chat, false for Saved page)
}

export function WidgetRenderer({ type, data, className = '', contextAction, showSaveButton = true }: WidgetRendererProps) {
  // Memoize normalized data to prevent re-normalization on every render
  // This ensures widget state (like activeStep in RitualWidget) persists
  const normalizedData = useMemo(
    () => normalizeWidgetData(type as WidgetType, data),
    [type, data]
  )

  // Memoize validation to prevent recalculation
  const isValid = useMemo(
    () => validateWidgetData(type as WidgetType, normalizedData),
    [type, normalizedData]
  )

  // Check if this is a valid widget type
  const WidgetComponent = widgetComponents[type as WidgetType]

  if (!WidgetComponent) {
    return <WidgetError type={type} />
  }

  // Validate the normalized data
  if (!isValid) {
    return <WidgetError type={type} />
  }

  // Extract title for save button and stable key
  const widgetTitle = (normalizedData as Record<string, unknown>).title as string || `${type} widget`
  const widgetDescription = (normalizedData as Record<string, unknown>).description as string | undefined

  // Generate a stable key based on widget type and title to prevent re-mounting
  // This ensures stateful widgets (like RitualWidget with step navigation) persist their state
  const widgetKey = useMemo(
    () => `${type}-${widgetTitle.replace(/\s+/g, '-').toLowerCase()}`,
    [type, widgetTitle]
  )

  return (
    <div className={`my-4 ${className}`}>
      {/* Save button header */}
      {showSaveButton && (
        <div className="mb-2 flex justify-end">
          <SaveWidgetButton
            widgetType={type}
            title={widgetTitle}
            description={widgetDescription}
            widgetData={normalizedData as Record<string, unknown>}
            sourceContext={contextAction}
            size="sm"
          />
        </div>
      )}
      <WidgetComponent key={widgetKey} data={normalizedData} contextAction={contextAction} />
    </div>
  )
}

export default WidgetRenderer
