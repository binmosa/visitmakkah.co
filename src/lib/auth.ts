/**
 * Supabase Authentication Utilities
 * Simple email/phone authentication with magic links and OTP
 */

// @ts-nocheck - Supabase doesn't have types for custom tables
import { supabase, isSupabaseConfigured } from './supabase'

// ============================================
// EMAIL AUTHENTICATION (Magic Link)
// ============================================

/**
 * Send magic link to email for passwordless login
 */
export async function signInWithEmail(email: string) {
    if (!isSupabaseConfigured || !supabase) {
        return { error: 'Authentication not configured' }
    }

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
    })

    if (error) {
        console.error('Email sign in error:', error)
        return { error: error.message }
    }

    return { success: true, message: 'Check your email for the login link!' }
}

// ============================================
// PHONE AUTHENTICATION (OTP)
// ============================================

/**
 * Send OTP to phone number
 */
export async function signInWithPhone(phone: string) {
    if (!isSupabaseConfigured || !supabase) {
        return { error: 'Authentication not configured' }
    }

    const { error } = await supabase.auth.signInWithOtp({
        phone,
    })

    if (error) {
        console.error('Phone sign in error:', error)
        return { error: error.message }
    }

    return { success: true, message: 'Check your phone for the OTP code!' }
}

/**
 * Verify phone OTP
 */
export async function verifyPhoneOtp(phone: string, token: string) {
    if (!isSupabaseConfigured || !supabase) {
        return { error: 'Authentication not configured' }
    }

    const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
    })

    if (error) {
        console.error('OTP verification error:', error)
        return { error: error.message }
    }

    return { success: true, user: data.user }
}

// ============================================
// GOOGLE OAUTH (Optional)
// ============================================

/**
 * Sign in with Google
 */
export async function signInWithGoogle() {
    if (!isSupabaseConfigured || !supabase) {
        return { error: 'Authentication not configured' }
    }

    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
        },
    })

    if (error) {
        console.error('Google sign in error:', error)
        return { error: error.message }
    }

    return { success: true }
}

// ============================================
// SESSION MANAGEMENT
// ============================================

/**
 * Get current user
 */
export async function getCurrentUser() {
    if (!isSupabaseConfigured || !supabase) {
        return null
    }

    const { data: { user } } = await supabase.auth.getUser()
    return user
}

/**
 * Get current session
 */
export async function getSession() {
    if (!isSupabaseConfigured || !supabase) {
        return null
    }

    const { data: { session } } = await supabase.auth.getSession()
    return session
}

/**
 * Sign out
 */
export async function signOut() {
    if (!isSupabaseConfigured || !supabase) {
        return { error: 'Authentication not configured' }
    }

    const { error } = await supabase.auth.signOut()

    if (error) {
        console.error('Sign out error:', error)
        return { error: error.message }
    }

    return { success: true }
}

// ============================================
// PROFILE MANAGEMENT
// ============================================

/**
 * Get user profile from database
 */
export async function getProfile(userId: string) {
    if (!isSupabaseConfigured || !supabase) {
        return null
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

    if (error) {
        console.error('Get profile error:', error)
        return null
    }

    return data
}

/**
 * Update user profile
 */
export async function updateProfile(userId: string, updates: {
    display_name?: string
    journey_type?: string
    is_first_time?: boolean
    travel_group?: string
    travel_dates?: { startDate?: string; endDate?: string }
    home_country?: string
    preferred_language?: string
}) {
    if (!isSupabaseConfigured || !supabase) {
        return { error: 'Database not configured' }
    }

    const { data, error } = await supabase
        .from('profiles')
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single()

    if (error) {
        console.error('Update profile error:', error)
        return { error: error.message }
    }

    return { success: true, profile: data }
}

// ============================================
// WAITLIST / NEWSLETTER
// ============================================

/**
 * Add email to waitlist/newsletter
 */
export async function joinWaitlist(data: {
    email: string
    phone?: string
    name?: string
    interests?: string[]
    journey_type?: string
    source?: string
}) {
    if (!isSupabaseConfigured || !supabase) {
        return { error: 'Database not configured' }
    }

    const { error } = await supabase
        .from('waitlist')
        .upsert({
            email: data.email,
            phone: data.phone,
            name: data.name,
            interests: data.interests,
            journey_type: data.journey_type,
            source: data.source || 'website',
        }, {
            onConflict: 'email',
        })

    if (error) {
        console.error('Join waitlist error:', error)
        return { error: error.message }
    }

    return { success: true, message: 'Successfully joined!' }
}
