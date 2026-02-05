'use client'

import { useUserJourney } from '@/context/UserJourneyContext'
import { TaskDone01Icon, Backpack03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'

interface ProgressBarProps {
    label: string
    progress: number
    icon: typeof TaskDone01Icon
    href: string
    color?: 'primary' | 'secondary'
}

function ProgressBar({ label, progress, icon, href, color = 'primary' }: ProgressBarProps) {
    const colorClasses = {
        primary: {
            bg: 'bg-primary-100 dark:bg-primary-800/50',
            icon: 'text-primary-600 dark:text-primary-400',
            bar: 'bg-primary-500',
        },
        secondary: {
            bg: 'bg-secondary-100 dark:bg-secondary-800/50',
            icon: 'text-secondary-600 dark:text-secondary-400',
            bar: 'bg-secondary-500',
        },
    }

    const colors = colorClasses[color]

    return (
        <Link href={href} className="block">
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 transition-all hover:border-primary-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-primary-600">
                <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`rounded-lg p-2 ${colors.bg}`}>
                            <HugeiconsIcon icon={icon} className={`size-4 ${colors.icon}`} />
                        </div>
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</span>
                    </div>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">{progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </Link>
    )
}

export default function ProgressWidget() {
    const { user } = useUserJourney()

    return (
        <div className="grid gap-3 sm:grid-cols-2">
            <ProgressBar
                label="Preparation"
                progress={user.preparationProgress}
                icon={TaskDone01Icon}
                href="/smart-tools/trip-planner"
                color="primary"
            />
            <ProgressBar
                label="Packing"
                progress={user.packingProgress}
                icon={Backpack03Icon}
                href="/smart-tools/packing-list"
                color="secondary"
            />
        </div>
    )
}
