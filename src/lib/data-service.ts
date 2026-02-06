/**
 * Data Service
 * Handles all database operations for analytics and user data collection
 */

import { supabase } from './supabase'
import { UserJourneyProfile } from '@/context/UserJourneyContext'

// ============================================
// VISITOR MANAGEMENT
// ============================================

/**
 * Get or create a visitor record based on device ID
 */
export async function getOrCreateVisitor(deviceId: string, metadata?: {
    userAgent?: string
    country?: string
    language?: string
}) {
    // Try to find existing visitor
    const { data: existing } = await supabase
        .from('visitors')
        .select('*')
        .eq('device_id', deviceId)
        .single()

    if (existing) {
        // Update last_seen
        await supabase
            .from('visitors')
            .update({ last_seen: new Date().toISOString() })
            .eq('id', existing.id)
        return existing
    }

    // Create new visitor
    const { data: newVisitor, error } = await supabase
        .from('visitors')
        .insert({
            device_id: deviceId,
            user_agent: metadata?.userAgent,
            country: metadata?.country,
            language: metadata?.language,
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating visitor:', error)
        return null
    }

    return newVisitor
}

// ============================================
// JOURNEY PROFILE MANAGEMENT
// ============================================

/**
 * Save or update a user's journey profile
 */
export async function saveJourneyProfile(
    visitorId: string,
    profile: Partial<UserJourneyProfile>
) {
    // Check if profile exists
    const { data: existing } = await supabase
        .from('journey_profiles')
        .select('id, share_code')
        .eq('visitor_id', visitorId)
        .single()

    const profileData = {
        visitor_id: visitorId,
        journey_stage: profile.journeyStage,
        journey_type: profile.journeyType,
        is_first_time: profile.isFirstTime,
        travel_group: profile.travelGroup,
        travel_dates: profile.travelDates,
        preferences: profile.preferences,
        completed_steps: profile.completedSteps,
        updated_at: new Date().toISOString(),
    }

    if (existing) {
        // Update existing profile
        const { data, error } = await supabase
            .from('journey_profiles')
            .update(profileData)
            .eq('id', existing.id)
            .select()
            .single()

        if (error) {
            console.error('Error updating profile:', error)
            return null
        }
        return data
    }

    // Create new profile with share code
    const shareCode = generateShareCode()
    const { data, error } = await supabase
        .from('journey_profiles')
        .insert({
            ...profileData,
            share_code: shareCode,
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating profile:', error)
        return null
    }

    return data
}

/**
 * Get a journey profile by share code (for shareable links)
 */
export async function getProfileByShareCode(shareCode: string) {
    const { data, error } = await supabase
        .from('journey_profiles')
        .select('*')
        .eq('share_code', shareCode)
        .single()

    if (error) {
        console.error('Error fetching profile by share code:', error)
        return null
    }

    return data
}

/**
 * Get share code for a visitor's profile
 */
export async function getShareCode(visitorId: string): Promise<string | null> {
    const { data, error } = await supabase
        .from('journey_profiles')
        .select('share_code')
        .eq('visitor_id', visitorId)
        .single()

    if (error || !data?.share_code) {
        // Generate one if it doesn't exist
        const shareCode = generateShareCode()
        await supabase
            .from('journey_profiles')
            .update({ share_code: shareCode })
            .eq('visitor_id', visitorId)
        return shareCode
    }

    return data.share_code
}

// ============================================
// CHAT SESSION & MESSAGE TRACKING
// ============================================

/**
 * Create a new chat session
 */
export async function createChatSession(
    visitorId: string,
    context: string,
    contextLabel?: string
) {
    const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
            visitor_id: visitorId,
            context,
            context_label: contextLabel,
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating chat session:', error)
        return null
    }

    return data
}

/**
 * Save a chat message
 */
export async function saveChatMessage(
    sessionId: string,
    visitorId: string,
    role: 'user' | 'assistant',
    content: string,
    context?: string,
    metadata?: {
        tokensUsed?: number
        responseTimeMs?: number
    }
) {
    const { data, error } = await supabase
        .from('chat_messages')
        .insert({
            session_id: sessionId,
            visitor_id: visitorId,
            role,
            content,
            context,
            tokens_used: metadata?.tokensUsed,
            response_time_ms: metadata?.responseTimeMs,
        })
        .select()
        .single()

    if (error) {
        console.error('Error saving chat message:', error)
        return null
    }

    // Track popular questions
    if (role === 'user') {
        await trackPopularQuestion(content, context || 'general')
    }

    return data
}

/**
 * End a chat session
 */
export async function endChatSession(sessionId: string) {
    const { error } = await supabase
        .from('chat_sessions')
        .update({ ended_at: new Date().toISOString() })
        .eq('id', sessionId)

    if (error) {
        console.error('Error ending chat session:', error)
    }
}

// ============================================
// ANALYTICS EVENT TRACKING
// ============================================

/**
 * Track an analytics event
 */
export async function trackEvent(
    visitorId: string,
    eventType: string,
    eventData?: Record<string, unknown>,
    pagePath?: string,
    referrer?: string
) {
    const { error } = await supabase
        .from('analytics_events')
        .insert({
            visitor_id: visitorId,
            event_type: eventType,
            event_data: eventData,
            page_path: pagePath,
            referrer: referrer,
        })

    if (error) {
        console.error('Error tracking event:', error)
    }
}

// Common event types
export const EventTypes = {
    PAGE_VIEW: 'page_view',
    ONBOARDING_START: 'onboarding_start',
    ONBOARDING_COMPLETE: 'onboarding_complete',
    ONBOARDING_STEP: 'onboarding_step',
    CHAT_START: 'chat_start',
    CHAT_MESSAGE: 'chat_message',
    SHARE_PLAN: 'share_plan',
    LOAD_SHARED_PLAN: 'load_shared_plan',
    NAV_CLICK: 'nav_click',
    SUGGESTED_QUESTION_CLICK: 'suggested_question_click',
} as const

// ============================================
// POPULAR QUESTIONS TRACKING
// ============================================

/**
 * Track a question for popular questions aggregation
 */
async function trackPopularQuestion(question: string, context: string) {
    // Normalize the question (lowercase, trim)
    const normalizedQuestion = question.toLowerCase().trim()

    // Skip very short or very long questions
    if (normalizedQuestion.length < 10 || normalizedQuestion.length > 200) {
        return
    }

    // Upsert: increment count if exists, insert if not
    const { error } = await supabase.rpc('upsert_popular_question', {
        p_question: normalizedQuestion,
        p_context: context,
    })

    // If the RPC doesn't exist, fall back to manual upsert
    if (error) {
        // Try to update existing
        const { data: existing } = await supabase
            .from('popular_questions')
            .select('id, ask_count')
            .eq('question', normalizedQuestion)
            .eq('context', context)
            .single()

        if (existing) {
            await supabase
                .from('popular_questions')
                .update({
                    ask_count: existing.ask_count + 1,
                    last_asked: new Date().toISOString(),
                })
                .eq('id', existing.id)
        } else {
            await supabase
                .from('popular_questions')
                .insert({
                    question: normalizedQuestion,
                    context,
                    ask_count: 1,
                })
        }
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Generate a random share code
 */
function generateShareCode(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let code = ''
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
}

/**
 * Get or create device ID (stored in localStorage)
 */
export function getDeviceId(): string {
    if (typeof window === 'undefined') {
        return `server_${Date.now()}`
    }

    let deviceId = localStorage.getItem('visitmakkah_device_id')
    if (!deviceId) {
        deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
        localStorage.setItem('visitmakkah_device_id', deviceId)
    }
    return deviceId
}
