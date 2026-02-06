'use client'

import { useUserJourney } from '@/context/UserJourneyContext'
import { SparklesIcon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useState, useEffect } from 'react'

interface Suggestion {
    id: string
    message: string
    actions: {
        label: string
        href?: string
        onClick?: () => void
    }[]
}

export default function ProactiveAIWidget() {
    const { user, daysUntilDeparture } = useUserJourney()
    const [currentSuggestion, setCurrentSuggestion] = useState<Suggestion | null>(null)

    useEffect(() => {
        // Generate contextual suggestions based on user state
        const suggestions: Suggestion[] = []

        // Days-based suggestions
        if (daysUntilDeparture !== null) {
            if (daysUntilDeparture <= 7 && user.packingProgress < 100) {
                suggestions.push({
                    id: 'packing-urgent',
                    message: `Your departure is in ${daysUntilDeparture} days. Your packing list is ${user.packingProgress}% complete. Would you like help finishing it?`,
                    actions: [
                        { label: 'Complete Packing List', href: '/smart-tools/packing-list' },
                        { label: 'Remind Later' },
                    ],
                })
            } else if (daysUntilDeparture <= 30 && user.preparationProgress < 50) {
                suggestions.push({
                    id: 'prep-reminder',
                    message: `${daysUntilDeparture} days until departure. Have you completed your visa requirements and vaccinations?`,
                    actions: [
                        { label: 'Check Requirements', href: '/plan/visa-steps' },
                        { label: 'Already Done' },
                    ],
                })
            }
        }

        // First-time visitor suggestions
        if (user.isFirstTime) {
            suggestions.push({
                id: 'first-time-guide',
                message: `As a first-time visitor, I recommend familiarizing yourself with the ${user.journeyType === 'hajj' ? 'Hajj' : 'Umrah'} rituals. Would you like a step-by-step guide?`,
                actions: [
                    { label: 'View Guide', href: `/your-journey/${user.journeyType || 'umrah'}` },
                    { label: 'Maybe Later' },
                ],
            })
        }

        // Stage-based suggestions
        if (user.journeyStage === 'planning') {
            suggestions.push({
                id: 'planning-help',
                message: 'Would you like help creating a personalized trip timeline based on your preferences?',
                actions: [
                    { label: 'Create Timeline', href: '/plan/timeline-builder' },
                    { label: 'Not Now' },
                ],
            })
        } else if (user.journeyStage === 'in_makkah') {
            suggestions.push({
                id: 'in-makkah-help',
                message: 'You\'re in Makkah! Would you like real-time crowd information and the best times for Tawaf today?',
                actions: [
                    { label: 'Check Crowd Levels', href: '/local-tips/hajj-crowd-flow' },
                    { label: 'View Prayer Times' },
                ],
            })
        }

        // Default suggestion
        if (suggestions.length === 0) {
            suggestions.push({
                id: 'default',
                message: 'Assalamu Alaikum! How can I help you prepare for your journey today?',
                actions: [
                    { label: 'Explore Guides', href: '/your-journey' },
                    { label: 'Ask a Question' },
                ],
            })
        }

        // Pick a relevant suggestion (could be randomized or prioritized)
        setCurrentSuggestion(suggestions[0])
    }, [user, daysUntilDeparture])

    if (!currentSuggestion) return null

    return (
        <div className="relative overflow-hidden rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-5 dark:border-primary-800 dark:from-primary-900/30 dark:via-neutral-900 dark:to-secondary-900/20">
            <div className="relative z-10 mb-4 flex items-start gap-3">
                <div className="rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 p-2.5 shadow-lg shadow-primary-500/20">
                    <HugeiconsIcon icon={SparklesIcon} className="size-5 text-white" />
                </div>
                <div className="flex-1">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400">
                        AI Guide
                    </p>
                    <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                        {currentSuggestion.message}
                    </p>
                </div>
            </div>
            <div className="relative z-10 flex flex-wrap gap-2">
                {currentSuggestion.actions.map((action, index) => (
                    action.href ? (
                        <a
                            key={index}
                            href={action.href}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                index === 0
                                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                                    : 'bg-white text-neutral-600 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                            }`}
                        >
                            {action.label}
                            {index === 0 && <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />}
                        </a>
                    ) : (
                        <button
                            key={index}
                            onClick={action.onClick}
                            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                        >
                            {action.label}
                        </button>
                    )
                ))}
            </div>
            {/* Islamic pattern overlay */}
            <div
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                    backgroundImage: 'url(/images/islamic-pattern.png)',
                    backgroundPosition: 'left top',
                    backgroundRepeat: 'repeat-y',
                    backgroundSize: 'auto 300px',
                }}
            />
        </div>
    )
}
