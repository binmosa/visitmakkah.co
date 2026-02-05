'use client'

import { useUserJourney } from '@/context/UserJourneyContext'
import CountdownWidget from './widgets/CountdownWidget'
import ProgressWidget from './widgets/ProgressWidget'
import ProactiveAIWidget from './widgets/ProactiveAIWidget'
import QuickActionsWidget from './widgets/QuickActionsWidget'
import JourneyStatusWidget from './widgets/JourneyStatusWidget'

export default function PersonalizedDashboard() {
    const { user } = useUserJourney()

    return (
        <div className="container py-6 sm:py-8 lg:py-12">
            {/* Header with Journey Status */}
            <div className="mb-6 sm:mb-8">
                <JourneyStatusWidget />
            </div>

            {/* Main Grid */}
            <div className="space-y-6">
                {/* Top Row: Countdown + Progress */}
                {(user.journeyStage === 'planning' || user.journeyStage === 'booked') && (
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="md:col-span-1">
                            <CountdownWidget />
                        </div>
                        <div className="md:col-span-2">
                            <ProgressWidget />
                        </div>
                    </div>
                )}

                {/* Proactive AI Suggestions */}
                <ProactiveAIWidget />

                {/* Quick Actions / Navigation */}
                <QuickActionsWidget />
            </div>
        </div>
    )
}
