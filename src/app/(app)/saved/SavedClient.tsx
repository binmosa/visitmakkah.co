'use client'

/**
 * Saved Client Component
 *
 * Interactive hub for saved widgets and conversation history.
 */

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  FolderLibraryIcon,
  MessageMultiple01Icon,
  CheckListIcon,
  Route01Icon,
  PrayerRugIcon,
  BookOpen01Icon,
  Calculator01Icon,
  Idea01Icon,
  Building03Icon,
  Kaaba02Icon,
  Clock01Icon,
  Delete02Icon,
  PinIcon,
  ArrowRight01Icon,
  SadIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useSavedWidgets, type SavedWidget } from '@/hooks/useSavedWidgets'
import { useConversationHistory, type ConversationPreview } from '@/hooks/useConversationHistory'
import { WidgetRenderer } from '@/components/Chat/WidgetRenderer'
import type { WidgetType } from '@/types/widgets'

// Widget type metadata
const widgetTypeInfo: Record<string, { icon: typeof CheckListIcon; label: string; color: string }> = {
  checklist: { icon: CheckListIcon, label: 'Checklists', color: 'text-emerald-600' },
  itinerary: { icon: Route01Icon, label: 'Itineraries', color: 'text-blue-600' },
  dua: { icon: PrayerRugIcon, label: 'Duas & Prayers', color: 'text-purple-600' },
  guide: { icon: BookOpen01Icon, label: 'Guides', color: 'text-amber-600' },
  budget: { icon: Calculator01Icon, label: 'Budgets', color: 'text-green-600' },
  tips: { icon: Idea01Icon, label: 'Tips', color: 'text-orange-600' },
  places: { icon: Building03Icon, label: 'Places', color: 'text-cyan-600' },
  ritual: { icon: Kaaba02Icon, label: 'Rituals', color: 'text-rose-600' },
}

// Context labels for display
const contextLabels: Record<string, string> = {
  'build-itinerary': 'Build Itinerary',
  'get-visa': 'Get Visa',
  'pack-bag': 'Pack Bag',
  'calculate-budget': 'Calculate Budget',
  'learn-umrah': 'Umrah Guide',
  'learn-hajj': 'Hajj Guide',
  'find-hotels': 'Find Hotels',
  'local-tips': 'Local Tips',
}

type TabType = 'all' | 'history' | WidgetType

export default function MyJourneyClient() {
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [expandedWidget, setExpandedWidget] = useState<string | null>(null)

  const { widgets, isLoading: widgetsLoading, deleteWidget } = useSavedWidgets()
  const { conversations, isLoading: historyLoading } = useConversationHistory(20)

  // Group widgets by type
  const widgetsByType = useMemo(() => {
    const grouped: Record<string, SavedWidget[]> = {}
    widgets.forEach((widget) => {
      if (!grouped[widget.widgetType]) {
        grouped[widget.widgetType] = []
      }
      grouped[widget.widgetType].push(widget)
    })
    return grouped
  }, [widgets])

  // Get widgets for current tab
  const displayedWidgets = useMemo(() => {
    if (activeTab === 'all' || activeTab === 'history') {
      return widgets
    }
    return widgetsByType[activeTab] || []
  }, [activeTab, widgets, widgetsByType])

  // Tabs with counts
  const tabs = useMemo(() => {
    const tabList: Array<{ id: TabType; label: string; icon: typeof FolderLibraryIcon; count: number }> = [
      { id: 'all', label: 'All Saved', icon: FolderLibraryIcon, count: widgets.length },
      { id: 'history', label: 'History', icon: MessageMultiple01Icon, count: conversations.length },
    ]

    // Add widget type tabs that have items
    Object.entries(widgetsByType).forEach(([type, items]) => {
      const info = widgetTypeInfo[type]
      if (info && items.length > 0) {
        tabList.push({
          id: type as TabType,
          label: info.label,
          icon: info.icon,
          count: items.length,
        })
      }
    })

    return tabList
  }, [widgets.length, conversations.length, widgetsByType])

  const handleDelete = async (widgetId: string) => {
    if (confirm('Are you sure you want to remove this saved item?')) {
      await deleteWidget(widgetId)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header & Tabs */}
      <div className="container py-3 sm:py-6">
        {/* Header - Compact like other pages */}
        <div className="mb-3 sm:mb-6">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 p-2 shadow-md shadow-primary-500/20 sm:rounded-xl sm:p-3">
              <HugeiconsIcon icon={FolderLibraryIcon} className="size-5 text-white sm:size-6" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-base font-bold text-neutral-900 sm:text-xl dark:text-white">
                Saved
              </h1>
              <p className="text-xs text-neutral-500 sm:mt-0.5 sm:text-sm dark:text-neutral-400">
                Your saved guides and history
              </p>
            </div>
          </div>
        </div>

        {/* Tabs - Light teal with dark teal border (matching sub-menu style) */}
        <div className="relative mb-4 sm:mb-6">
          {/* Left fade gradient */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-6 bg-gradient-to-r from-neutral-50 to-transparent dark:from-neutral-950" />
          {/* Right fade gradient with swipe hint */}
          <div className="pointer-events-none absolute right-0 top-0 z-10 flex h-full w-10 items-center justify-end bg-gradient-to-l from-neutral-50 via-neutral-50/80 to-transparent pr-1 dark:from-neutral-950 dark:via-neutral-950/80">
            <div className="flex items-center gap-0.5 text-neutral-300 dark:text-neutral-600">
              <span className="text-[8px]">›</span>
              <span className="text-[10px]">›</span>
            </div>
          </div>
          <div className="hidden-scrollbar flex gap-1.5 overflow-x-auto px-6 py-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all active:scale-95 ${
                  activeTab === tab.id
                    ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-primary-300 hover:bg-primary-50/50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-primary-600'
                }`}
              >
                <HugeiconsIcon
                  icon={tab.icon}
                  className={`size-3.5 ${
                    activeTab === tab.id
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-neutral-400 dark:text-neutral-500'
                  }`}
                  strokeWidth={1.5}
                />
                <span>{tab.label}</span>
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-600 dark:bg-primary-800/50 dark:text-primary-300'
                    : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {historyLoading ? (
              <LoadingState />
            ) : conversations.length === 0 ? (
              <EmptyState
                icon={MessageMultiple01Icon}
                title="No conversations yet"
                description="Start chatting with our AI assistant to see your history here."
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {conversations.map((conv) => (
                  <ConversationCard key={conv.id} conversation={conv} formatTimeAgo={formatTimeAgo} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Widgets Tab */}
        {activeTab !== 'history' && (
          <div className="space-y-4">
            {widgetsLoading ? (
              <LoadingState />
            ) : displayedWidgets.length === 0 ? (
              <EmptyState
                icon={FolderLibraryIcon}
                title="No saved items yet"
                description="Save widgets from your AI conversations to access them here anytime."
              />
            ) : (
              <div className="space-y-4">
                {displayedWidgets.map((widget) => (
                  <SavedWidgetCard
                    key={widget.id}
                    widget={widget}
                    isExpanded={expandedWidget === widget.id}
                    onToggle={() => setExpandedWidget(expandedWidget === widget.id ? null : widget.id)}
                    onDelete={() => handleDelete(widget.id)}
                    formatTimeAgo={formatTimeAgo}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Strip widget markers from message for preview display
function stripWidgetMarkers(text: string): string {
  let cleaned = text
  // Remove complete widget blocks: <<<WIDGET:type>>>...<<<END_WIDGET>>>
  cleaned = cleaned.replace(/<<<WIDGET:\w+>>>[\s\S]*?<<<END_WIDGET>>>/g, '')
  // Remove partial widget blocks (truncated before END_WIDGET): <<<WIDGET:type>>>...
  cleaned = cleaned.replace(/<<<WIDGET:\w+>>>[\s\S]*/g, '')
  // Remove any remaining partial markers: <<<WIDGET... or <<<END_WIDGET>>>
  cleaned = cleaned.replace(/<<<WIDGET[^>]*>?>?/g, '')
  cleaned = cleaned.replace(/<<<END_WIDGET>>>/g, '')
  // Remove any standalone <<< or >>> markers
  cleaned = cleaned.replace(/<<<|>>>/g, '')
  // Clean up multiple spaces/newlines
  return cleaned.replace(/\s+/g, ' ').trim()
}

// Conversation Card Component
function ConversationCard({
  conversation,
  formatTimeAgo,
}: {
  conversation: ConversationPreview
  formatTimeAgo: (date: string) => string
}) {
  const contextLabel = contextLabels[conversation.context] || conversation.contextLabel || conversation.context

  // Determine the route based on context, with conversation ID for history loading
  const getRouteForContext = (context: string, conversationId: string) => {
    const contextRoutes: Record<string, string> = {
      'build-itinerary': '/prepare',
      'get-visa': '/prepare',
      'pack-bag': '/prepare',
      'pack-my-bag': '/prepare',
      'calculate-budget': '/prepare',
      'learn-umrah': '/learn',
      'umrah-guide': '/learn',
      'learn-hajj': '/learn',
      'hajj-guide': '/learn',
      'step-by-step': '/learn',
      'duas-prayers': '/learn',
      'find-hotels': '/explore',
      'find-food': '/explore',
      'navigate': '/explore',
      'local-tips': '/explore/local-tips',
    }
    const basePath = contextRoutes[context] || '/prepare'
    // Add conversation ID to continue the chat
    return `${basePath}?action=${context}&conversation=${conversationId}`
  }

  return (
    <Link
      href={getRouteForContext(conversation.context, conversation.id)}
      className="group block rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-primary-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-primary-700"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={MessageMultiple01Icon}
            className="size-5 text-primary-600 dark:text-primary-400"
            strokeWidth={1.5}
          />
          <span className="font-medium text-neutral-900 dark:text-white">
            {contextLabel}
          </span>
        </div>
        <span className="text-xs text-neutral-500">{formatTimeAgo(conversation.startedAt)}</span>
      </div>

      {conversation.lastMessage && stripWidgetMarkers(conversation.lastMessage) && (
        <p className="mt-2 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
          {stripWidgetMarkers(conversation.lastMessage)}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-neutral-500">
          {conversation.messageCount} message{conversation.messageCount !== 1 ? 's' : ''}
        </span>
        <span className="flex items-center gap-1 text-xs font-medium text-primary-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-primary-400">
          Continue
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" strokeWidth={2} />
        </span>
      </div>
    </Link>
  )
}

// Saved Widget Card Component
function SavedWidgetCard({
  widget,
  isExpanded,
  onToggle,
  onDelete,
  formatTimeAgo,
}: {
  widget: SavedWidget
  isExpanded: boolean
  onToggle: () => void
  onDelete: () => void
  formatTimeAgo: (date: string) => string
}) {
  const typeInfo = widgetTypeInfo[widget.widgetType] || {
    icon: FolderLibraryIcon,
    label: widget.widgetType,
    color: 'text-neutral-600',
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      {/* Header */}
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => e.key === 'Enter' && onToggle()}
        className="flex w-full cursor-pointer items-center justify-between p-4 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
      >
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 ${typeInfo.color}`}>
            <HugeiconsIcon icon={typeInfo.icon} className="size-5" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white">
              {widget.customTitle || widget.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span>{typeInfo.label}</span>
              <span>•</span>
              <span>{formatTimeAgo(widget.updatedAt)}</span>
              {widget.isPinned && (
                <>
                  <span>•</span>
                  <HugeiconsIcon icon={PinIcon} className="size-3 text-primary-500" strokeWidth={1.5} />
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
          >
            <HugeiconsIcon icon={Delete02Icon} className="size-4" strokeWidth={1.5} />
          </button>
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className={`size-5 text-neutral-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            strokeWidth={1.5}
          />
        </div>
      </div>

      {/* Expanded Widget Content */}
      {isExpanded && (
        <div className="border-t border-neutral-200 p-4 dark:border-neutral-700">
          <WidgetRenderer
            type={widget.widgetType as WidgetType}
            data={widget.widgetData}
            contextAction={widget.sourceContext || 'saved'}
            showSaveButton={false}
          />
        </div>
      )}
    </div>
  )
}

// Loading State
function LoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
            <div className="flex-1">
              <div className="h-4 w-1/3 rounded bg-neutral-200 dark:bg-neutral-700" />
              <div className="mt-2 h-3 w-1/4 rounded bg-neutral-200 dark:bg-neutral-700" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Empty State
function EmptyState({
  icon,
  title,
  description,
}: {
  icon: typeof SadIcon
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 py-16 dark:border-neutral-700 dark:bg-neutral-900/50">
      <HugeiconsIcon icon={icon} className="size-12 text-neutral-400" strokeWidth={1} />
      <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-white">{title}</h3>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
      <Link
        href="/prepare"
        className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
      >
        Start Planning
      </Link>
    </div>
  )
}
