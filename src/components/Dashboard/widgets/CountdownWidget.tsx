'use client'

import { useUserJourney } from '@/context/UserJourneyContext'
import { Airplane01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

export default function CountdownWidget() {
    const { daysUntilDeparture, user } = useUserJourney()

    if (!user.travelDates.departure || daysUntilDeparture === null) {
        return (
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-neutral-100 p-3 dark:bg-neutral-800">
                        <HugeiconsIcon icon={Airplane01Icon} className="size-6 text-neutral-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Departure</p>
                        <p className="text-sm text-neutral-400 dark:text-neutral-500">Not set</p>
                    </div>
                </div>
            </div>
        )
    }

    const departureDate = new Date(user.travelDates.departure)
    const formattedDate = departureDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })

    return (
        <div className="rounded-2xl border border-neutral-200 bg-gradient-to-br from-primary-50 to-white p-5 dark:border-neutral-700 dark:from-primary-900/20 dark:to-neutral-900">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-primary-100 p-3 dark:bg-primary-800/50">
                        <HugeiconsIcon icon={Airplane01Icon} className="size-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Departure</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-300">{formattedDate}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{daysUntilDeparture}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">days left</p>
                </div>
            </div>
        </div>
    )
}
