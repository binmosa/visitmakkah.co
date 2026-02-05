'use client'

import HubNavMenu from '@/components/HubNavSlider'
import AIChatPanel from '@/components/AIPanel/AIChatPanel'
import { TNavigationItem } from '@/data/navigation'
import { usePathname } from 'next/navigation'
import React, { ReactNode, useState, useEffect } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
    Calendar03Icon,
    Mosque01Icon,
    Building03Icon,
    Settings03Icon,
    Idea01Icon,
} from '@hugeicons/core-free-icons'

interface HubLayoutProps {
    children: ReactNode
    title: string
    subtitle?: string
    navItems: TNavigationItem[]
    aiContext?: string
    aiSuggestedQuestions?: string[]
}

// Icons for each main category
const categoryIcons: Record<string, typeof Calendar03Icon> = {
    'plan': Calendar03Icon,
    'your-journey': Mosque01Icon,
    'stay-and-food': Building03Icon,
    'smart-tools': Settings03Icon,
    'local-tips': Idea01Icon,
}

// Get suggested questions based on context (supports both category and sub-topic)
const getDefaultSuggestions = (context: string): string[] => {
    const suggestions: Record<string, string[]> = {
        // Main categories
        'your-journey': [
            'What are the steps for Umrah?',
            'How many days do I need for Hajj?',
            'Explain Tawaf step by step',
            'Best time to perform rituals?',
        ],
        'plan': [
            'Help me create a timeline',
            'What visa do I need?',
            'What should I pack?',
            'How to get from Jeddah to Makkah?',
        ],
        'stay-and-food': [
            'Hotels near King Fahd Gate',
            'Best restaurants for families',
            'Late night food options',
            'Women-friendly areas',
        ],
        'smart-tools': [
            'Help me plan my trip',
            'Calculate my budget',
            'Create a packing list',
            'Distance to key locations',
        ],
        'local-tips': [
            'Best time to avoid crowds',
            'Tips for Ramadan visit',
            'Insider routes to Haram',
            'Seasonal weather advice',
        ],
        // Sub-topics - Your Journey
        'hajj': [
            'What are the 5 days of Hajj?',
            'What is required before Hajj?',
            'Explain Arafat day',
            'What to do at Mina?',
        ],
        'umrah': [
            'Step-by-step Umrah guide',
            'How long does Umrah take?',
            'Best time for Umrah?',
            'Umrah for first-timers',
        ],
        'rituals': [
            'How to perform Tawaf?',
            "Explain Sa'i between Safa and Marwa",
            'What duas to recite?',
            'Rules of Ihram',
        ],
        'spiritual': [
            'Duas for Tawaf',
            'How to prepare spiritually?',
            'Best places for reflection',
            'Recommended reading',
        ],
        // Sub-topics - Plan
        'timeline-builder': [
            'Create a 7-day Umrah plan',
            'Best itinerary for families',
            'How many days in Makkah?',
            'When to visit Madinah?',
        ],
        'visa-steps': [
            'Saudi visa requirements',
            'How to apply for Umrah visa?',
            'Visa processing time?',
            'Required documents',
        ],
        'packing': [
            'Essential packing list',
            'What to wear for Ihram?',
            'Electronics to bring',
            'Medications to pack',
        ],
        'transport': [
            'Jeddah to Makkah options',
            'Getting around Makkah',
            'Taxi vs bus vs train',
            'Airport transfer tips',
        ],
        // Sub-topics - Stay & Food
        'hotels': [
            'Hotels near King Fahd Gate',
            'Budget-friendly options',
            'Hotels with Haram view',
            'Family-friendly hotels',
        ],
        'restaurants': [
            'Best biryani in Makkah',
            'Halal fast food options',
            'Restaurants near Haram',
            'Where to eat after Fajr?',
        ],
        'women-friendly': [
            'Women-only prayer areas',
            'Safe areas for women',
            'Women-friendly cafes',
            'Tips for solo women',
        ],
        'late-night': [
            'Restaurants open after Isha',
            '24-hour food options',
            'Late night cafes',
            'Where to eat at 3am?',
        ],
        // Sub-topics - Smart Tools
        'trip-planner': [
            'Plan my Umrah trip',
            'Create daily schedule',
            'Optimize my itinerary',
            'Time management tips',
        ],
        'budget-tool': [
            'Estimate trip cost',
            'Budget breakdown',
            'Money saving tips',
            'Currency exchange advice',
        ],
        'packing-list': [
            'Generate packing list',
            'Ihram essentials',
            'What NOT to bring',
            'Carry-on vs checked bag',
        ],
        'distance-calculator': [
            'Hotel to Haram distance',
            'Walking times to gates',
            'Makkah to Madinah',
            'Key landmarks distances',
        ],
        // Sub-topics - Local Tips
        'seasonal-hacks': [
            'Summer visit tips',
            'Winter in Makkah',
            'Best months to visit',
            'Weather preparation',
        ],
        'ramadan-advice': [
            'Umrah during Ramadan',
            'Iftar near Haram',
            'Tarawih prayer tips',
            'Last 10 nights guide',
        ],
        'hajj-crowd-flow': [
            'Best Tawaf times',
            'Avoiding peak crowds',
            'Crowd patterns by day',
            'Less crowded gates',
        ],
        'insider-routes': [
            'Shortcuts to Haram',
            'Secret entrances',
            'Fast walking routes',
            'Avoiding construction',
        ],
    }
    return suggestions[context] || suggestions['your-journey']
}

const HubLayout = ({
    children,
    title,
    subtitle,
    navItems,
    aiContext,
    aiSuggestedQuestions,
}: HubLayoutProps) => {
    const pathname = usePathname()
    const [activeItemId, setActiveItemId] = useState<string | null>(null)
    const [activeItem, setActiveItem] = useState<TNavigationItem | null>(null)

    // Determine context from pathname
    const contextFromPath = pathname.split('/')[1] || 'your-journey'
    const context = aiContext || contextFromPath
    const CategoryIcon = categoryIcons[context] || Mosque01Icon

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

        // Scroll to the AI chat panel for better UX
        const chatPanel = document.querySelector('.lg\\:col-span-2')
        if (chatPanel) {
            chatPanel.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    const suggestedQuestions = aiSuggestedQuestions || getDefaultSuggestions(context)

    return (
        <div className="container py-6 sm:py-8 lg:py-12">
            {/* Header Card - Consistent with Dashboard */}
            <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3">
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
            </div>

            {/* Nav Menu Card */}
            <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 dark:border-neutral-700 dark:bg-neutral-900">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    Select a topic
                </p>
                <HubNavMenu
                    items={navItems || []}
                    activeId={activeItemId}
                    onItemClick={handleItemClick}
                />
            </div>

            {/* Main Content Area - Responsive Layout */}
            <div className="space-y-6 lg:grid lg:grid-cols-5 lg:gap-6 lg:space-y-0">
                {/* AI Chat Panel - Full width on mobile, sidebar on desktop */}
                <div className="lg:col-span-2">
                    <div className="lg:sticky lg:top-24">
                        <div className="h-[450px] sm:h-[500px] lg:h-[600px]">
                            <AIChatPanel
                                key={activeItemId || context} // Force re-render when topic changes
                                context={activeItem?.href?.split('/').pop() || context}
                                contextLabel={activeItem?.name || title}
                                placeholder={`Ask about ${activeItem?.name || title}...`}
                                suggestedQuestions={suggestedQuestions}
                            />
                        </div>
                    </div>
                </div>

                {/* Content / Widgets Area */}
                <div className="lg:col-span-3">
                    <div
                        id="hub-content-area"
                        className="scroll-mt-16 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 dark:border-neutral-700 dark:bg-neutral-900"
                    >
                        {/* Dynamic content header */}
                        {activeItem && (
                            <div className="mb-5 flex items-center gap-3 border-b border-neutral-200 pb-5 dark:border-neutral-700">
                                <div className="rounded-lg bg-primary-100 p-2 dark:bg-primary-900/30">
                                    <HugeiconsIcon
                                        icon={CategoryIcon}
                                        className="size-5 text-primary-600 dark:text-primary-400"
                                    />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-neutral-900 dark:text-white">
                                        {activeItem.name}
                                    </h2>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                        Ask the AI guide or explore below
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Children content (widgets, etc.) */}
                        <div className="min-h-[200px]">
                            {children || (
                                <div className="flex h-[200px] items-center justify-center text-center">
                                    <div>
                                        <p className="text-neutral-500 dark:text-neutral-400">
                                            Select a topic above or ask the AI assistant
                                        </p>
                                        <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-500">
                                            Content will appear here
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HubLayout
