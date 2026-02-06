import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Client-side Supabase client (uses anon key)
// Note: Will have empty URL/key if not configured, but functions check isSupabaseConfigured first
export const supabase = createClient<Database>(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
)

// Server-side Supabase client (uses service role key for admin operations)
// Only create if service key is available
export const supabaseAdmin = supabaseServiceKey
    ? createClient<Database>(supabaseUrl || 'https://placeholder.supabase.co', supabaseServiceKey)
    : null
