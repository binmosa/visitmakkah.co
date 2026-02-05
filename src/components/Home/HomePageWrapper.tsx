'use client'

import { useUserJourney } from '@/context/UserJourneyContext'
import JourneyOnboarding from '@/components/Onboarding/JourneyOnboarding'
import PersonalizedDashboard from '@/components/Dashboard/PersonalizedDashboard'
import { Loading03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

export default function HomePageWrapper() {
    const { isLoading, hasCompletedOnboarding } = useUserJourney()

    // Show loading state while checking localStorage
    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <HugeiconsIcon icon={Loading03Icon} className="size-8 animate-spin text-primary-500" />
            </div>
        )
    }

    // Show onboarding if user hasn't completed it
    if (!hasCompletedOnboarding) {
        return <JourneyOnboarding />
    }

    // Show personalized dashboard
    return <PersonalizedDashboard />
}
