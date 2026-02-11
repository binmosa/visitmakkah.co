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
        <div className="container py-3 sm:py-6 lg:py-10">
            {/* Header - Compact */}
            <div className="mb-3 sm:mb-6">
                <div className="relative z-10 flex items-center gap-2.5">
                    <div className="rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 p-2 shadow-md shadow-primary-500/20 sm:rounded-xl sm:p-3">
                        <HugeiconsIcon icon={CategoryIcon} className="size-5 text-white sm:size-6" />
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-neutral-900 sm:text-xl dark:text-white">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-xs text-neutral-500 sm:mt-0.5 sm:text-sm dark:text-neutral-400">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Nav Menu - Compact */}
            <div className="mb-3 sm:mb-6">
                <HubNavMenu
                    items={navItems || []}
                    activeId={activeItemId}
                    onItemClick={handleItemClick}
                    categoryId={categoryId}
                />
            </div>

            {/* AI Chat Panel - Full Width */}
            <div className="h-[calc(100vh-220px)] min-h-[400px] sm:h-[500px] lg:h-[600px]">
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
        <div className="container py-3 sm:py-6 lg:py-10">
            <div className="mb-3 sm:mb-6">
                <div className="relative z-10 flex items-center gap-2.5">
                    <div className="rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 p-2 shadow-md shadow-primary-500/20 sm:rounded-xl sm:p-3">
                        <div className="size-5 animate-pulse rounded bg-white/30 sm:size-6" />
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-neutral-900 sm:text-xl dark:text-white">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-xs text-neutral-500 sm:mt-0.5 sm:text-sm dark:text-neutral-400">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <div className="mb-3 h-12 animate-pulse rounded-full bg-neutral-100 sm:mb-6 dark:bg-neutral-800" />
            <div className="h-[calc(100vh-220px)] min-h-[400px] animate-pulse rounded-2xl bg-neutral-100 sm:h-[500px] lg:h-[600px] dark:bg-neutral-800" />
        </div>
    )
}

export default HubLayout
