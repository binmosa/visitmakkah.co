'use client'

import { useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { useUserJourney } from '@/context/UserJourneyContext'
import {
    getOrCreateVisitor,
    saveJourneyProfile,
    trackEvent,
    EventTypes,
    getDeviceId,
} from '@/lib/data-service'

/**
 * Hook for automatic data collection and analytics
 * Place this in your root layout or app provider
 */
export function useDataCollection() {
    const pathname = usePathname()
    const { user } = useUserJourney()
    const visitorIdRef = useRef<string | null>(null)
    const hasTrackedPageView = useRef<string | null>(null)
    const lastSavedProfile = useRef<string>('')

    // Initialize visitor on mount
    useEffect(() => {
        const initVisitor = async () => {
            const deviceId = getDeviceId()
            const visitor = await getOrCreateVisitor(deviceId, {
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
                language: typeof navigator !== 'undefined' ? navigator.language : undefined,
            })

            if (visitor) {
                visitorIdRef.current = visitor.id
            }
        }

        initVisitor()
    }, [])

    // Track page views
    useEffect(() => {
        if (!visitorIdRef.current || hasTrackedPageView.current === pathname) {
            return
        }

        hasTrackedPageView.current = pathname
        trackEvent(
            visitorIdRef.current,
            EventTypes.PAGE_VIEW,
            { path: pathname },
            pathname,
            typeof document !== 'undefined' ? document.referrer : undefined
        )
    }, [pathname])

    // Sync journey profile when it changes
    useEffect(() => {
        if (!visitorIdRef.current || !user.hasCompletedOnboarding) {
            return
        }

        // Create a hash of the profile to detect changes
        const profileHash = JSON.stringify({
            journeyStage: user.journeyStage,
            journeyType: user.journeyType,
            isFirstTime: user.isFirstTime,
            travelGroup: user.travelGroup,
            travelDates: user.travelDates,
        })

        // Only save if changed
        if (profileHash !== lastSavedProfile.current) {
            lastSavedProfile.current = profileHash
            saveJourneyProfile(visitorIdRef.current, user)
        }
    }, [user])

    // Return the visitor ID and track function for manual tracking
    const track = useCallback((eventType: string, eventData?: Record<string, unknown>) => {
        if (visitorIdRef.current) {
            trackEvent(visitorIdRef.current, eventType, eventData, pathname)
        }
    }, [pathname])

    return {
        visitorId: visitorIdRef.current,
        track,
        EventTypes,
    }
}

/**
 * Hook for tracking chat messages
 */
export function useChatTracking(context: string, contextLabel?: string) {
    const sessionIdRef = useRef<string | null>(null)
    const visitorIdRef = useRef<string | null>(null)

    // Initialize session
    useEffect(() => {
        const initSession = async () => {
            const deviceId = getDeviceId()
            const visitor = await getOrCreateVisitor(deviceId)

            if (visitor) {
                visitorIdRef.current = visitor.id

                // Import dynamically to avoid circular deps
                const { createChatSession } = await import('@/lib/data-service')
                const session = await createChatSession(visitor.id, context, contextLabel)

                if (session) {
                    sessionIdRef.current = session.id
                }
            }
        }

        initSession()

        // End session on unmount
        return () => {
            if (sessionIdRef.current) {
                import('@/lib/data-service').then(({ endChatSession }) => {
                    endChatSession(sessionIdRef.current!)
                })
            }
        }
    }, [context, contextLabel])

    // Track a message
    const trackMessage = useCallback(async (
        role: 'user' | 'assistant',
        content: string,
        metadata?: { tokensUsed?: number; responseTimeMs?: number }
    ) => {
        if (!sessionIdRef.current || !visitorIdRef.current) {
            return
        }

        const { saveChatMessage } = await import('@/lib/data-service')
        await saveChatMessage(
            sessionIdRef.current,
            visitorIdRef.current,
            role,
            content,
            context,
            metadata
        )
    }, [context])

    return {
        sessionId: sessionIdRef.current,
        visitorId: visitorIdRef.current,
        trackMessage,
    }
}
