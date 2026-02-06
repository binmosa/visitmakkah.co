export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            // User profiles (linked to Supabase Auth)
            profiles: {
                Row: {
                    id: string
                    email: string | null
                    phone: string | null
                    display_name: string | null
                    avatar_url: string | null
                    journey_type: string | null
                    is_first_time: boolean
                    travel_group: string | null
                    travel_dates: Json | null
                    home_country: string | null
                    preferred_language: string
                    share_code: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    phone?: string | null
                    display_name?: string | null
                    avatar_url?: string | null
                    journey_type?: string | null
                    is_first_time?: boolean
                    travel_group?: string | null
                    travel_dates?: Json | null
                    home_country?: string | null
                    preferred_language?: string
                    share_code?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    phone?: string | null
                    display_name?: string | null
                    avatar_url?: string | null
                    journey_type?: string | null
                    is_first_time?: boolean
                    travel_group?: string | null
                    travel_dates?: Json | null
                    home_country?: string | null
                    preferred_language?: string
                    share_code?: string | null
                    updated_at?: string
                }
            }

            // Anonymous visitors (pre-signup)
            anonymous_visitors: {
                Row: {
                    id: string
                    device_id: string
                    journey_type: string | null
                    is_first_time: boolean | null
                    travel_group: string | null
                    travel_dates: Json | null
                    preferences: Json | null
                    share_code: string | null
                    linked_profile_id: string | null
                    first_seen: string
                    last_seen: string
                }
                Insert: {
                    id?: string
                    device_id: string
                    journey_type?: string | null
                    is_first_time?: boolean | null
                    travel_group?: string | null
                    travel_dates?: Json | null
                    preferences?: Json | null
                    share_code?: string | null
                    linked_profile_id?: string | null
                    first_seen?: string
                    last_seen?: string
                }
                Update: {
                    device_id?: string
                    journey_type?: string | null
                    is_first_time?: boolean | null
                    travel_group?: string | null
                    travel_dates?: Json | null
                    preferences?: Json | null
                    share_code?: string | null
                    linked_profile_id?: string | null
                    last_seen?: string
                }
            }

            // Chat topics (what users discuss)
            chat_topics: {
                Row: {
                    id: string
                    profile_id: string | null
                    anonymous_id: string | null
                    context: string
                    context_label: string | null
                    started_at: string
                    ended_at: string | null
                    message_count: number
                    user_rating: number | null
                    was_helpful: boolean | null
                    feedback_text: string | null
                }
                Insert: {
                    id?: string
                    profile_id?: string | null
                    anonymous_id?: string | null
                    context: string
                    context_label?: string | null
                    started_at?: string
                    ended_at?: string | null
                    message_count?: number
                    user_rating?: number | null
                    was_helpful?: boolean | null
                    feedback_text?: string | null
                }
                Update: {
                    profile_id?: string | null
                    anonymous_id?: string | null
                    context?: string
                    context_label?: string | null
                    ended_at?: string | null
                    message_count?: number
                    user_rating?: number | null
                    was_helpful?: boolean | null
                    feedback_text?: string | null
                }
            }

            // Chat messages (AI training data)
            chat_messages: {
                Row: {
                    id: string
                    topic_id: string
                    role: 'user' | 'assistant'
                    content: string
                    context: string | null
                    was_edited: boolean
                    thumbs_up: boolean | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    topic_id: string
                    role: 'user' | 'assistant'
                    content: string
                    context?: string | null
                    was_edited?: boolean
                    thumbs_up?: boolean | null
                    created_at?: string
                }
                Update: {
                    topic_id?: string
                    role?: 'user' | 'assistant'
                    content?: string
                    context?: string | null
                    was_edited?: boolean
                    thumbs_up?: boolean | null
                }
            }

            // Popular questions
            popular_questions: {
                Row: {
                    id: string
                    question: string
                    context: string
                    ask_count: number
                    last_asked: string
                    is_featured: boolean
                    curated_answer: string | null
                }
                Insert: {
                    id?: string
                    question: string
                    context: string
                    ask_count?: number
                    last_asked?: string
                    is_featured?: boolean
                    curated_answer?: string | null
                }
                Update: {
                    question?: string
                    context?: string
                    ask_count?: number
                    last_asked?: string
                    is_featured?: boolean
                    curated_answer?: string | null
                }
            }

            // Waitlist / Newsletter
            waitlist: {
                Row: {
                    id: string
                    email: string
                    phone: string | null
                    name: string | null
                    interests: string[] | null
                    journey_type: string | null
                    source: string | null
                    utm_source: string | null
                    utm_campaign: string | null
                    verified: boolean
                    subscribed: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    email: string
                    phone?: string | null
                    name?: string | null
                    interests?: string[] | null
                    journey_type?: string | null
                    source?: string | null
                    utm_source?: string | null
                    utm_campaign?: string | null
                    verified?: boolean
                    subscribed?: boolean
                    created_at?: string
                }
                Update: {
                    email?: string
                    phone?: string | null
                    name?: string | null
                    interests?: string[] | null
                    journey_type?: string | null
                    source?: string | null
                    verified?: boolean
                    subscribed?: boolean
                }
            }

            // Saved items
            saved_items: {
                Row: {
                    id: string
                    profile_id: string
                    item_type: string
                    item_id: string
                    item_data: Json | null
                    notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    profile_id: string
                    item_type: string
                    item_id: string
                    item_data?: Json | null
                    notes?: string | null
                    created_at?: string
                }
                Update: {
                    item_type?: string
                    item_id?: string
                    item_data?: Json | null
                    notes?: string | null
                }
            }
        }
    }
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type AnonymousVisitor = Database['public']['Tables']['anonymous_visitors']['Row']
export type ChatTopic = Database['public']['Tables']['chat_topics']['Row']
export type ChatMessage = Database['public']['Tables']['chat_messages']['Row']
export type PopularQuestion = Database['public']['Tables']['popular_questions']['Row']
export type WaitlistEntry = Database['public']['Tables']['waitlist']['Row']
export type SavedItem = Database['public']['Tables']['saved_items']['Row']
