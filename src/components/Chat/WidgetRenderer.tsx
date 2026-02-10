'use client'

/**
 * WidgetRenderer Component
 *
 * Dynamically renders the appropriate widget component based on type.
 * Uses dynamic imports for code splitting.
 * Normalizes data before passing to widgets for consistent structure.
 */

import dynamic from 'next/dynamic'
import type { WidgetType } from '@/types/widgets'
import { normalizeWidgetData, validateWidgetData } from '@/lib/widget-normalizer'

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
const widgetComponents: Record<WidgetType, React.ComponentType<{ data: unknown }>> = {
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
  crowd: dynamic(() => import('../Widgets/CrowdWidget').then(mod => mod.default), {
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
}

export function WidgetRenderer({ type, data, className = '' }: WidgetRendererProps) {
  // Normalize the data to ensure consistent structure
  const normalizedData = normalizeWidgetData(type as WidgetType, data)

  // Check if this is a valid widget type
  const WidgetComponent = widgetComponents[type as WidgetType]

  if (!WidgetComponent) {
    return <WidgetError type={type} />
  }

  // Validate the normalized data
  if (!validateWidgetData(type as WidgetType, normalizedData)) {
    return <WidgetError type={type} />
  }

  return (
    <div className={`my-4 ${className}`}>
      <WidgetComponent data={normalizedData} />
    </div>
  )
}

export default WidgetRenderer
