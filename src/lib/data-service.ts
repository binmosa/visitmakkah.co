/**
 * Data Service - Gold Data Collection
 * Focus: Chat topics, messages, popular questions for AI training
 * Analytics: Handled by Google Analytics (not here)
 */

// @ts-nocheck - Supabase doesn't have types for custom tables
import { supabase, isSupabaseConfigured } from './supabase'

// ============================================
// TYPES
// ============================================

interface AnonymousVisitor {
    id: string
    device_id: string
    share_code: string
    journey_type?: string
    is_first_time?: boolean
    travel_group?: string
    travel_dates?: unknown
    preferences?: unknown
    last_seen?: string
    created_at?: string
}

interface ChatTopic {
    id: string
    profile_id?: string
    anonymous_id?: string
    context: string
    context_label?: string
    created_at?: string
    ended_at?: string
}

interface ChatMessage {
    id: string
    topic_id: string
    role: 'user' | 'assistant'
    content: string
    context?: string
    created_at?: string
}

// ============================================
// ANONYMOUS VISITOR MANAGEMENT
// ============================================

/**
 * Get or create anonymous visitor (for non-logged-in users)
 */
export async function getOrCreateAnonymousVisitor(deviceId: string): Promise<AnonymousVisitor | null> {
    if (!isSupabaseConfigured || !supabase) {
        return null
    }

    // Try to find existing
    const { data: existing } = await supabase
        .from('anonymous_visitors')
        .select('*')
        .eq('device_id', deviceId)
        .single()

    if (existing) {
        // Update last_seen
        await supabase
            .from('anonymous_visitors')
            .update({ last_seen: new Date().toISOString() })
            .eq('id', existing.id)
        return existing
    }

    // Create new
    const { data: newVisitor, error } = await supabase
        .from('anonymous_visitors')
        .insert({
            device_id: deviceId,
            share_code: generateShareCode(),
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating anonymous visitor:', error)
        return null
    }

    return newVisitor
}

/**
 * Update anonymous visitor's journey preferences
 */
export async function updateAnonymousVisitor(deviceId: string, data: {
    journey_type?: string
    is_first_time?: boolean
    travel_group?: string
    travel_dates?: unknown
    preferences?: unknown
}) {
    if (!isSupabaseConfigured || !supabase) {
        return null
    }

    const { data: updated, error } = await supabase
        .from('anonymous_visitors')
        .update({
            ...data,
            last_seen: new Date().toISOString(),
        })
        .eq('device_id', deviceId)
        .select()
        .single()

    if (error) {
        console.error('Error updating anonymous visitor:', error)
        return null
    }

    return updated
}

// ============================================
// CHAT TOPIC TRACKING (GOLD DATA)
// ============================================

/**
 * Create a chat topic when user starts a conversation
 */
export async function createChatTopic(data: {
    profileId?: string
    anonymousId?: string
    context: string
    contextLabel?: string
}): Promise<ChatTopic | null> {
    if (!isSupabaseConfigured || !supabase) {
        return null
    }

    const { data: topic, error } = await supabase
        .from('chat_topics')
        .insert({
            profile_id: data.profileId,
            anonymous_id: data.anonymousId,
            context: data.context,
            context_label: data.contextLabel,
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating chat topic:', error)
        return null
    }

    return topic
}

/**
 * End a chat topic (when user leaves)
 */
export async function endChatTopic(topicId: string) {
    if (!isSupabaseConfigured || !supabase) {
        return
    }

    await supabase
        .from('chat_topics')
        .update({ ended_at: new Date().toISOString() })
        .eq('id', topicId)
}

/**
 * Rate a chat topic (user feedback)
 */
export async function rateChatTopic(topicId: string, rating: {
    userRating?: number
    wasHelpful?: boolean
    feedbackText?: string
}) {
    if (!isSupabaseConfigured || !supabase) {
        return
    }

    await supabase
        .from('chat_topics')
        .update({
            user_rating: rating.userRating,
            was_helpful: rating.wasHelpful,
            feedback_text: rating.feedbackText,
        })
        .eq('id', topicId)
}

// ============================================
// CHAT MESSAGE TRACKING (GOLD DATA)
// ============================================

/**
 * Save a chat message (for AI training)
 */
export async function saveChatMessage(data: {
    topicId: string
    role: 'user' | 'assistant'
    content: string
    context?: string
}) {
    if (!isSupabaseConfigured || !supabase) {
        return null
    }

    const { data: message, error } = await supabase
        .from('chat_messages')
        .insert({
            topic_id: data.topicId,
            role: data.role,
            content: data.content,
            context: data.context,
        })
        .select()
        .single()

    if (error) {
        console.error('Error saving chat message:', error)
        return null
    }

    // Track popular questions (user messages only)
    if (data.role === 'user') {
        await trackPopularQuestion(data.content, data.context || 'general')
    }

    return message
}

/**
 * Rate a message (thumbs up/down)
 */
export async function rateMessage(messageId: string, thumbsUp: boolean) {
    if (!isSupabaseConfigured || !supabase) {
        return
    }

    await supabase
        .from('chat_messages')
        .update({ thumbs_up: thumbsUp })
        .eq('id', messageId)
}

// ============================================
// POPULAR QUESTIONS TRACKING (GOLD DATA)
// ============================================

/**
 * Track a question for aggregation
 */
async function trackPopularQuestion(question: string, context: string) {
    if (!isSupabaseConfigured || !supabase) {
        return
    }

    // Normalize
    const normalized = question.toLowerCase().trim()

    // Skip very short or very long
    if (normalized.length < 10 || normalized.length > 200) {
        return
    }

    // Upsert: increment if exists, insert if not
    const { data: existing } = await supabase
        .from('popular_questions')
        .select('id, ask_count')
        .eq('question', normalized)
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
                question: normalized,
                context,
                ask_count: 1,
            })
    }
}

/**
 * Get featured/popular questions for a context
 */
export async function getPopularQuestions(context: string, limit = 5) {
    if (!isSupabaseConfigured || !supabase) {
        return []
    }

    const { data, error } = await supabase
        .from('popular_questions')
        .select('question, ask_count, is_featured')
        .eq('context', context)
        .order('is_featured', { ascending: false })
        .order('ask_count', { ascending: false })
        .limit(limit)

    if (error) {
        console.error('Error fetching popular questions:', error)
        return []
    }

    return data
}

// ============================================
// SHAREABLE LINKS
// ============================================

/**
 * Get profile by share code
 */
export async function getByShareCode(shareCode: string) {
    if (!isSupabaseConfigured || !supabase) {
        return null
    }

    // Try profiles first (logged-in users)
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('share_code', shareCode)
        .single()

    if (profile) {
        return { type: 'profile' as const, data: profile }
    }

    // Try anonymous visitors
    const { data: visitor } = await supabase
        .from('anonymous_visitors')
        .select('*')
        .eq('share_code', shareCode)
        .single()

    if (visitor) {
        return { type: 'anonymous' as const, data: visitor }
    }

    return null
}

// ============================================
// UTILITIES
// ============================================

/**
 * Generate random share code
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
