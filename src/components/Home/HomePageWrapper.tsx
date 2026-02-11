'use client'

import dynamic from 'next/dynamic'
import { useUserJourney } from '@/context/UserJourneyContext'
import { Loading03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

// Loading spinner component
const LoadingSpinner = () => (
    <div className="flex min-h-[60vh] items-center justify-center">
        <HugeiconsIcon icon={Loading03Icon} className="size-8 animate-spin text-primary-500" />
    </div>
)

// Dynamic imports for code splitting - reduces initial bundle size
const JourneyOnboarding = dynamic(
    () => import('@/components/Onboarding/JourneyOnboarding'),
    { loading: () => <LoadingSpinner /> }
)

const PersonalizedDashboard = dynamic(
    () => import('@/components/Dashboard/PersonalizedDashboard'),
    { loading: () => <LoadingSpinner /> }
)

export default function HomePageWrapper() {
    const { isLoading, hasCompletedOnboarding } = useUserJourney()

    // Show loading state while checking localStorage
    if (isLoading) {
        return <LoadingSpinner />
    }

    // Show onboarding if user hasn't completed it
    if (!hasCompletedOnboarding) {
        return <JourneyOnboarding />
    }

    // Show personalized dashboard
    return <PersonalizedDashboard />
}
