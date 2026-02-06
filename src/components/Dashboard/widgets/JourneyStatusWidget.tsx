'use client'

import { useUserJourney } from '@/context/UserJourneyContext'
import { Settings02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import SharePlanButton from '@/components/SharePlan/SharePlanButton'

export default function JourneyStatusWidget() {
    const { user, journeyStageLabel, resetUser } = useUserJourney()

    const getJourneyTypeLabel = () => {
        switch (user.journeyType) {
            case 'hajj':
                return 'Hajj'
            case 'umrah':
                return 'Umrah'
            case 'both':
                return 'Hajj & Umrah'
            default:
                return 'Journey'
        }
    }

    const getTravelGroupLabel = () => {
        switch (user.travelGroup) {
            case 'solo':
                return 'Solo Traveler'
            case 'couple':
                return 'Traveling as Couple'
            case 'family':
                return 'Family Trip'
            case 'group':
                return 'Group Travel'
            default:
                return ''
        }
    }

    return (
        <div className="flex items-center justify-between">
            <div>
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">
                        Your {getJourneyTypeLabel()} Journey
                    </h1>
                    {user.isFirstTime && (
                        <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
                            First Time
                        </span>
                    )}
                </div>
                <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                    {journeyStageLabel} {getTravelGroupLabel() && `• ${getTravelGroupLabel()}`}
                </p>
            </div>
            <div className="flex items-center gap-1">
                {/* Share Plan Button */}
                <SharePlanButton variant="icon" />

                {/* Settings/Reset Button */}
                <button
                    onClick={() => {
                        if (confirm('Reset your journey preferences? This will clear all saved data.')) {
                            resetUser()
                        }
                    }}
                    className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                    title="Settings"
                >
                    <HugeiconsIcon icon={Settings02Icon} className="size-5" />
                </button>
            </div>
        </div>
    )
}
