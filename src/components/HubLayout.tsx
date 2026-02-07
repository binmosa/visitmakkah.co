'use client'

import HubNavMenu from '@/components/HubNavSlider'
import AIChatPanel from '@/components/AIPanel/AIChatPanel'
import { TNavigationItem, getAISuggestions } from '@/data/navigation'
import { useUserJourney } from '@/context/UserJourneyContext'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
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
    // Tips
    'first-timers': StarIcon,
    'for-women': UserLove01Icon,
    'ramadan': Moon02Icon,
    'shortcuts': Location01Icon,
}

const HubLayout = ({
    title,
    subtitle,
    navItems,
    aiContext,
    aiSuggestedQuestions,
    categoryId,
}: HubLayoutProps) => {
    const pathname = usePathname()
    const { user } = useUserJourney()
    const [activeItemId, setActiveItemId] = useState<string | null>(null)
    const [activeItem, setActiveItem] = useState<TNavigationItem | null>(null)

    // Determine context from pathname
    const contextFromPath = pathname.split('/')[1] || 'prepare'
    const context = aiContext || contextFromPath
    const CategoryIcon = categoryIcons[context] || ClipboardIcon

    // Find active item based on current pathname
    useEffect(() => {
        const current = navItems.find((item) => item.href === pathname)
        if (current) {
            setActiveItemId(current.id || null)
            setActiveItem(current)
        } else if (navItems.length > 0) {
            setActiveItemId(navItems[0].id || null)
            setActiveItem(navItems[0])
        }
    }, [pathname, navItems])

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
                <AIChatPanel
                    key={activeItemId || context}
                    context={subTopic || context}
                    contextLabel={activeItem?.name || title}
                    contextDescription={activeItem?.description}
                    contextIcon={ActiveItemIcon}
                    placeholder={`Ask about ${activeItem?.name || title}...`}
                    suggestedQuestions={suggestedQuestions}
                />
            </div>
        </div>
    )
}

export default HubLayout
