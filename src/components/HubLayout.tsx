'use client'

import HubNavMenu from '@/components/HubNavSlider'
import AIChatPanelV2 from '@/components/AIPanel/AIChatPanelV2'
import { TNavigationItem, getAISuggestions } from '@/data/navigation'
import { useUserJourney } from '@/context/UserJourneyContext'
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useState, useEffect, Suspense } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
    // Prepare icons
    ClipboardIcon,
    Route01Icon,
    Passport01Icon,
    Backpack03Icon,
    Calculator01Icon,
    // Learn icons
    BookOpen01Icon,
    Kaaba02Icon,
    Mosque01Icon,
    CheckListIcon,
    PrayerRugIcon,
    // Explore icons
    MapsIcon,
    Building03Icon,
    Restaurant01Icon,
    UserGroup03Icon,
    CompassIcon,
    // Tips icons
    Idea01Icon,
    StarIcon,
    UserLove01Icon,
    Moon02Icon,
    Location01Icon,
} from '@hugeicons/core-free-icons'

interface HubLayoutProps {
    title: string
    subtitle?: string
    navItems: TNavigationItem[]
    aiContext?: string
    aiSuggestedQuestions?: string[]
    categoryId?: string
}

// Icons for each main category
const categoryIcons: Record<string, typeof ClipboardIcon> = {
    'prepare': ClipboardIcon,
    'learn': BookOpen01Icon,
    'explore': MapsIcon,
    'tips': Idea01Icon,
}

// Icons for sub-items
const subItemIcons: Record<string, typeof ClipboardIcon> = {
    // Prepare
    'build-itinerary': Route01Icon,
    'get-visa': Passport01Icon,
    'pack-my-bag': Backpack03Icon,
    'calculate-budget': Calculator01Icon,
    // Learn
    'umrah-guide': Kaaba02Icon,
    'hajj-guide': Mosque01Icon,
    'step-by-step': CheckListIcon,
    'duas-prayers': PrayerRugIcon,
    // Explore
    'find-hotels': Building03Icon,
    'find-food': Restaurant01Icon,
    'check-crowds': UserGroup03Icon,
    'navigate': CompassIcon,
    'local-tips': Idea01Icon,
    // Tips
    'first-timers': StarIcon,
    'for-women': UserLove01Icon,
    'ramadan': Moon02Icon,
    'shortcuts': Location01Icon,
}

// Inner component that uses useSearchParams (needs Suspense boundary)
const HubLayoutInner = ({
    title,
    subtitle,
    navItems,
    aiContext,
    aiSuggestedQuestions,
    categoryId,
}: HubLayoutProps) => {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { user } = useUserJourney()
    const [activeItemId, setActiveItemId] = useState<string | null>(null)
    const [activeItem, setActiveItem] = useState<TNavigationItem | null>(null)

    // Determine context from pathname
    const contextFromPath = pathname.split('/')[1] || 'prepare'
    const context = aiContext || contextFromPath
    const CategoryIcon = categoryIcons[context] || ClipboardIcon

    // Get conversation ID from URL params (for continuing from history)
    const conversationId = searchParams.get('conversation')

    // Find active item based on action query param or pathname
    useEffect(() => {
        const actionParam = searchParams.get('action')

        // First, try to match by action query parameter (e.g., ?action=find-food)
        if (actionParam) {
            const matchByAction = navItems.find((item) => {
                const hrefSlug = item.href?.split('/').pop() || ''
                return hrefSlug === actionParam
            })
            if (matchByAction) {
                setActiveItemId(matchByAction.id || null)
                setActiveItem(matchByAction)
                return
            }
        }

        // Fallback: match by pathname
        const current = navItems.find((item) => item.href === pathname)
        if (current) {
            setActiveItemId(current.id || null)
            setActiveItem(current)
        } else if (navItems.length > 0) {
            setActiveItemId(navItems[0].id || null)
            setActiveItem(navItems[0])
        }
    }, [pathname, searchParams, navItems])

    const handleItemClick = (id: string) => {
        const item = navItems.find((n) => n.id === id)
        setActiveItemId(id)
        setActiveItem(item || null)
    }

    // Get the sub-topic key from the active item's href
    const subTopic = activeItem?.href?.split('/').pop() || ''

    // Get context-aware suggestions based on journey stage
    const journeyStage = user?.journeyStage || 'planning'
    const suggestedQuestions = aiSuggestedQuestions || getAISuggestions(subTopic || context, journeyStage)

    // Get the appropriate icon for the active item
    const getActiveItemIcon = () => {
        if (activeItem?.href) {
            const key = activeItem.href.split('/').pop() || ''
            return subItemIcons[key] || CategoryIcon
        }
        return CategoryIcon
    }

    const ActiveItemIcon = getActiveItemIcon()

    return (
        <div className="container py-6 sm:py-8 lg:py-12">
            {/* Header Card - With Journey Stage Context */}
            <div className="mb-6 sm:mb-8">
                <div className="relative z-10 flex items-center gap-3">
                    <div className="rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 p-3 shadow-lg shadow-primary-500/20">
                        <HugeiconsIcon icon={CategoryIcon} className="size-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {/* Journey Stage Indicator */}
                {journeyStage && (
                    <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs text-neutral-400 dark:text-neutral-500">Your stage:</span>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            journeyStage === 'in_makkah'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : journeyStage === 'booked'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                : journeyStage === 'returned'
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                            {journeyStage === 'planning' && 'Planning'}
                            {journeyStage === 'booked' && 'Booked & Preparing'}
                            {journeyStage === 'in_makkah' && 'In Makkah Now'}
                            {journeyStage === 'returned' && 'Returned'}
                        </span>
                    </div>
                )}
            </div>

            {/* Nav Menu Card */}
            <div className="islamic-pattern-bg mb-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 dark:border-neutral-700 dark:bg-neutral-900">
                <p className="relative z-10 mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    What do you want to do?
                </p>
                <div className="relative z-10">
                    <HubNavMenu
                        items={navItems || []}
                        activeId={activeItemId}
                        onItemClick={handleItemClick}
                        categoryId={categoryId}
                    />
                </div>
            </div>

            {/* AI Chat Panel - Full Width */}
            <div className="h-[500px] sm:h-[550px] lg:h-[650px]">
                <AIChatPanelV2
                    key={conversationId || activeItemId || context}
                    contextAction={subTopic || context}
                    contextLabel={activeItem?.name || title}
                    contextDescription={activeItem?.description}
                    contextIcon={ActiveItemIcon}
                    suggestedQuestions={suggestedQuestions}
                    conversationId={conversationId}
                />
            </div>
        </div>
    )
}

// Wrapper component with Suspense boundary for useSearchParams
const HubLayout = (props: HubLayoutProps) => {
    return (
        <Suspense fallback={<HubLayoutSkeleton title={props.title} subtitle={props.subtitle} />}>
            <HubLayoutInner {...props} />
        </Suspense>
    )
}

// Loading skeleton while search params are being read
const HubLayoutSkeleton = ({ title, subtitle }: { title: string; subtitle?: string }) => {
    return (
        <div className="container py-6 sm:py-8 lg:py-12">
            <div className="mb-6 sm:mb-8">
                <div className="relative z-10 flex items-center gap-3">
                    <div className="rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 p-3 shadow-lg shadow-primary-500/20">
                        <div className="size-6 animate-pulse rounded bg-white/30" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <div className="mb-6 h-32 animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
            <div className="h-[500px] animate-pulse rounded-2xl bg-neutral-100 sm:h-[550px] lg:h-[650px] dark:bg-neutral-800" />
        </div>
    )
}

export default HubLayout
