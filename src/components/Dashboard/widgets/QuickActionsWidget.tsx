'use client'

import Link from 'next/link'
import { useUserJourney } from '@/context/UserJourneyContext'
import {
    // Prepare icons
    ClipboardIcon,
    Route01Icon,
    // Learn icons
    BookOpen01Icon,
    Kaaba02Icon,
    // Explore icons
    MapsIcon,
    Building03Icon,
    Restaurant01Icon,
    // Tips icons
    Idea01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

interface QuickAction {
    label: string
    description: string
    href: string
    icon: typeof ClipboardIcon
    color: string
    relevantStages: ('planning' | 'booked' | 'in_makkah' | 'returned')[]
}

// All available quick actions with context-awareness
// Using query parameters to pre-select sub-menu items on hub pages
const allQuickActions: QuickAction[] = [
    // Prepare actions
    {
        label: 'Build Itinerary',
        description: 'AI trip planner',
        href: '/prepare?action=build-itinerary',
        icon: Route01Icon,
        color: 'from-blue-500 to-blue-600',
        relevantStages: ['planning', 'booked'],
    },
    {
        label: 'Pack My Bag',
        description: 'Smart checklist',
        href: '/prepare?action=pack-my-bag',
        icon: ClipboardIcon,
        color: 'from-indigo-500 to-indigo-600',
        relevantStages: ['planning', 'booked'],
    },
    // Learn actions
    {
        label: 'Umrah Guide',
        description: 'Step-by-step',
        href: '/learn?action=umrah-guide',
        icon: Kaaba02Icon,
        color: 'from-primary-500 to-primary-600',
        relevantStages: ['planning', 'booked', 'in_makkah'],
    },
    {
        label: 'Learn Rituals',
        description: 'Tawaf, Sai & more',
        href: '/learn?action=step-by-step',
        icon: BookOpen01Icon,
        color: 'from-emerald-500 to-emerald-600',
        relevantStages: ['planning', 'booked', 'in_makkah'],
    },
    // Explore actions
    {
        label: 'Find Hotels',
        description: 'Near Haram gates',
        href: '/explore?action=find-hotels',
        icon: Building03Icon,
        color: 'from-orange-500 to-orange-600',
        relevantStages: ['planning', 'booked'],
    },
    {
        label: 'Find Food',
        description: 'Restaurants nearby',
        href: '/explore?action=find-food',
        icon: Restaurant01Icon,
        color: 'from-red-500 to-red-600',
        relevantStages: ['booked', 'in_makkah'],
    },
    {
        label: 'Navigate',
        description: 'Routes & gates',
        href: '/explore?action=navigate',
        icon: MapsIcon,
        color: 'from-cyan-500 to-cyan-600',
        relevantStages: ['in_makkah'],
    },
    // Tips
    {
        label: 'Get Tips',
        description: 'Insider advice',
        href: '/explore?action=local-tips',
        icon: Idea01Icon,
        color: 'from-amber-500 to-amber-600',
        relevantStages: ['planning', 'booked', 'in_makkah', 'returned'],
    },
]

// Get prioritized actions based on journey stage
function getPrioritizedActions(journeyStage: string | null): QuickAction[] {
    const stage = (journeyStage || 'planning') as 'planning' | 'booked' | 'in_makkah' | 'returned'

    // Filter and sort actions by relevance
    const relevantActions = allQuickActions.filter((action) =>
        action.relevantStages.includes(stage)
    )

    // Sort so that most relevant actions (those with fewer stages = more specific) come first
    relevantActions.sort((a, b) => {
        const aRelevance = a.relevantStages.length
        const bRelevance = b.relevantStages.length
        return aRelevance - bRelevance // Fewer stages = more specific = higher priority
    })

    // Return top 5 actions
    return relevantActions.slice(0, 5)
}

// Get stage-specific title
function getStageTitle(journeyStage: string | null): string {
    switch (journeyStage) {
        case 'in_makkah':
            return 'QUICK ACTIONS'
        case 'booked':
            return 'PREPARE NOW'
        case 'returned':
            return 'EXPLORE MORE'
        default:
            return 'START HERE'
    }
}

export default function QuickActionsWidget() {
    const { user } = useUserJourney()
    const journeyStage = user?.journeyStage || 'planning'
    const quickActions = getPrioritizedActions(journeyStage)
    const sectionTitle = getStageTitle(journeyStage)

    return (
        <div>
            <h3 className="mb-3 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                {sectionTitle}
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {quickActions.map((action) => (
                    <Link
                        key={action.href}
                        href={action.href}
                        className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 transition-all hover:border-primary-300 hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-primary-600"
                    >
                        <div className={`relative z-10 mb-3 inline-flex rounded-xl bg-gradient-to-br ${action.color} p-2.5 shadow-lg`}>
                            <HugeiconsIcon icon={action.icon} className="size-5 text-white" />
                        </div>
                        <p className="relative z-10 font-semibold text-neutral-900 dark:text-white">{action.label}</p>
                        <p className="relative z-10 text-xs text-neutral-500 dark:text-neutral-400">{action.description}</p>
                        {/* Islamic pattern overlay */}
                        <div
                            className="pointer-events-none absolute inset-0 z-0"
                            style={{
                                backgroundImage: 'url(/images/islamic-pattern.svg)',
                                backgroundPosition: 'left top',
                                backgroundRepeat: 'repeat-y',
                                backgroundSize: 'auto 200px',
                            }}
                        />
                    </Link>
                ))}
            </div>
        </div>
    )
}
