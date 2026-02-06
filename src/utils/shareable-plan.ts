/**
 * Shareable Plan Utilities
 *
 * Supports two modes:
 * 1. Database mode (preferred): Short codes stored in Supabase
 * 2. URL mode (fallback): Data encoded in URL
 */

import { UserJourneyProfile } from '@/context/UserJourneyContext'
import { getShareCode, getProfileByShareCode, getDeviceId, getOrCreateVisitor, trackEvent, EventTypes } from '@/lib/data-service'

// ============================================
// DATABASE-BASED SHARING (Preferred)
// ============================================

/**
 * Get or create a shareable link using database short code
 */
export async function getShareableLink(): Promise<string | null> {
    try {
        const deviceId = getDeviceId()
        const visitor = await getOrCreateVisitor(deviceId)

        if (!visitor) {
            console.error('Failed to get visitor')
            return null
        }

        const shareCode = await getShareCode(visitor.id)

        if (!shareCode) {
            console.error('Failed to get share code')
            return null
        }

        // Track the share event
        await trackEvent(visitor.id, EventTypes.SHARE_PLAN, { shareCode })

        const origin = typeof window !== 'undefined'
            ? window.location.origin
            : 'https://visitmakkah.com'

        return `${origin}/p/${shareCode}`
    } catch (error) {
        console.error('Error getting shareable link:', error)
        return null
    }
}

/**
 * Load a shared plan from database by share code
 */
export async function loadSharedPlan(shareCode: string): Promise<Partial<UserJourneyProfile> | null> {
    try {
        const profile = await getProfileByShareCode(shareCode)

        if (!profile) {
            return null
        }

        // Track the load event
        const deviceId = getDeviceId()
        const visitor = await getOrCreateVisitor(deviceId)
        if (visitor) {
            await trackEvent(visitor.id, EventTypes.LOAD_SHARED_PLAN, { shareCode })
        }

        // Convert database profile to UserJourneyProfile format
        return {
            journeyStage: profile.journey_stage as UserJourneyProfile['journeyStage'],
            journeyType: profile.journey_type as UserJourneyProfile['journeyType'],
            isFirstTime: profile.is_first_time ?? undefined,
            travelGroup: profile.travel_group as UserJourneyProfile['travelGroup'],
            travelDates: profile.travel_dates as UserJourneyProfile['travelDates'],
            preferences: profile.preferences as UserJourneyProfile['preferences'],
            completedSteps: profile.completed_steps ?? undefined,
            hasCompletedOnboarding: true,
        }
    } catch (error) {
        console.error('Error loading shared plan:', error)
        return null
    }
}

// ============================================
// URL-BASED SHARING (Fallback)
// ============================================

/**
 * Compress and encode journey data to URL-safe string
 * Used as fallback when database is not available
 */
export function encodePlanData(profile: UserJourneyProfile): string {
    try {
        const minimalData = {
            s: profile.journeyStage,
            t: profile.journeyType,
            f: profile.isFirstTime,
            g: profile.travelGroup,
            d: profile.travelDates,
            p: profile.preferences,
            c: profile.completedSteps,
        }

        const jsonString = JSON.stringify(minimalData)
        const encoded = btoa(jsonString)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '')

        return encoded
    } catch (error) {
        console.error('Error encoding plan data:', error)
        return ''
    }
}

/**
 * Decode URL string back to journey profile
 */
export function decodePlanData(encoded: string): Partial<UserJourneyProfile> | null {
    try {
        let base64 = encoded
            .replace(/-/g, '+')
            .replace(/_/g, '/')

        while (base64.length % 4) {
            base64 += '='
        }

        const jsonString = atob(base64)
        const minimalData = JSON.parse(jsonString)

        return {
            journeyStage: minimalData.s,
            journeyType: minimalData.t,
            isFirstTime: minimalData.f,
            travelGroup: minimalData.g,
            travelDates: minimalData.d,
            preferences: minimalData.p,
            completedSteps: minimalData.c || [],
            hasCompletedOnboarding: true,
        }
    } catch (error) {
        console.error('Error decoding plan data:', error)
        return null
    }
}

/**
 * Generate a shareable URL with encoded data (fallback)
 */
export function generateShareableUrl(profile: UserJourneyProfile): string {
    const encoded = encodePlanData(profile)
    if (!encoded) return ''

    const origin = typeof window !== 'undefined'
        ? window.location.origin
        : 'https://visitmakkah.com'

    return `${origin}/p?d=${encoded}`
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text)
        return true
    } catch {
        try {
            const textArea = document.createElement('textarea')
            textArea.value = text
            textArea.style.position = 'fixed'
            textArea.style.left = '-999999px'
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)
            return true
        } catch (error) {
            console.error('Failed to copy to clipboard:', error)
            return false
        }
    }
}

/**
 * Check if a string looks like a share code vs encoded data
 */
export function isShareCode(value: string): boolean {
    // Share codes are 8 alphanumeric characters
    return /^[a-z0-9]{8}$/i.test(value)
}
