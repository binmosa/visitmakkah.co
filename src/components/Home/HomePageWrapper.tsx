'use client'

import dynamic from 'next/dynamic'
import { useUserJourney } from '@/context/UserJourneyContext'

// Skeleton loader - matches dashboard layout for no layout shift
const DashboardSkeleton = () => (
    <div className="container py-6 sm:py-8 lg:py-12 animate-pulse">
        {/* Header skeleton */}
        <div className="mb-6 sm:mb-8">
            <div className="h-24 rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
        </div>
        {/* Grid skeleton */}
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <div className="h-32 rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
                <div className="md:col-span-2 h-32 rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
            </div>
            <div className="h-40 rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
            <div className="h-48 rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
        </div>
    </div>
)

// Dynamic imports for code splitting - reduces initial bundle size
const JourneyOnboarding = dynamic(
    () => import('@/components/Onboarding/JourneyOnboarding'),
    {
        loading: () => <DashboardSkeleton />,
        ssr: false // Onboarding depends on localStorage
    }
)

const PersonalizedDashboard = dynamic(
    () => import('@/components/Dashboard/PersonalizedDashboard'),
    {
        loading: () => <DashboardSkeleton />,
        ssr: false // Dashboard depends on localStorage
    }
)

export default function HomePageWrapper() {
    const { isLoading, hasCompletedOnboarding } = useUserJourney()

    // Show skeleton while checking localStorage
    if (isLoading) {
        return <DashboardSkeleton />
    }

    // Show onboarding if user hasn't completed it
    if (!hasCompletedOnboarding) {
        return <JourneyOnboarding />
    }

    // Show personalized dashboard
    return <PersonalizedDashboard />
}
