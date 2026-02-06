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
            // Anonymous visitors
            visitors: {
                Row: {
                    id: string
                    device_id: string
                    first_seen: string
                    last_seen: string
                    user_agent: string | null
                    country: string | null
                    language: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    device_id: string
                    first_seen?: string
                    last_seen?: string
                    user_agent?: string | null
                    country?: string | null
                    language?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    device_id?: string
                    first_seen?: string
                    last_seen?: string
                    user_agent?: string | null
                    country?: string | null
                    language?: string | null
                    created_at?: string
                }
            }

            // Journey profiles (onboarding data)
            journey_profiles: {
                Row: {
                    id: string
                    visitor_id: string
                    journey_stage: string | null
                    journey_type: string | null
                    is_first_time: boolean | null
                    travel_group: string | null
                    travel_dates: Json | null
                    preferences: Json | null
                    completed_steps: string[] | null
                    share_code: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    visitor_id: string
                    journey_stage?: string | null
                    journey_type?: string | null
                    is_first_time?: boolean | null
                    travel_group?: string | null
                    travel_dates?: Json | null
                    preferences?: Json | null
                    completed_steps?: string[] | null
                    share_code?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    visitor_id?: string
                    journey_stage?: string | null
                    journey_type?: string | null
                    is_first_time?: boolean | null
                    travel_group?: string | null
                    travel_dates?: Json | null
                    preferences?: Json | null
                    completed_steps?: string[] | null
                    share_code?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }

            // Chat sessions
            chat_sessions: {
                Row: {
                    id: string
                    visitor_id: string
                    context: string
                    context_label: string | null
                    started_at: string
                    ended_at: string | null
                    message_count: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    visitor_id: string
                    context: string
                    context_label?: string | null
                    started_at?: string
                    ended_at?: string | null
                    message_count?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    visitor_id?: string
                    context?: string
                    context_label?: string | null
                    started_at?: string
                    ended_at?: string | null
                    message_count?: number
                    created_at?: string
                }
            }

            // Chat messages (for training data)
            chat_messages: {
                Row: {
                    id: string
                    session_id: string
                    visitor_id: string
                    role: 'user' | 'assistant'
                    content: string
                    context: string | null
                    tokens_used: number | null
                    response_time_ms: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    session_id: string
                    visitor_id: string
                    role: 'user' | 'assistant'
                    content: string
                    context?: string | null
                    tokens_used?: number | null
                    response_time_ms?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    session_id?: string
                    visitor_id?: string
                    role?: 'user' | 'assistant'
                    content?: string
                    context?: string | null
                    tokens_used?: number | null
                    response_time_ms?: number | null
                    created_at?: string
                }
            }

            // Analytics events
            analytics_events: {
                Row: {
                    id: string
                    visitor_id: string
                    event_type: string
                    event_data: Json | null
                    page_path: string | null
                    referrer: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    visitor_id: string
                    event_type: string
                    event_data?: Json | null
                    page_path?: string | null
                    referrer?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    visitor_id?: string
                    event_type?: string
                    event_data?: Json | null
                    page_path?: string | null
                    referrer?: string | null
                    created_at?: string
                }
            }

            // Popular questions (aggregated for insights)
            popular_questions: {
                Row: {
                    id: string
                    question: string
                    context: string
                    ask_count: number
                    last_asked: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    question: string
                    context: string
                    ask_count?: number
                    last_asked?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    question?: string
                    context?: string
                    ask_count?: number
                    last_asked?: string
                    created_at?: string
                }
            }
        }
    }
}

// Helper types
export type Visitor = Database['public']['Tables']['visitors']['Row']
export type JourneyProfile = Database['public']['Tables']['journey_profiles']['Row']
export type ChatSession = Database['public']['Tables']['chat_sessions']['Row']
export type ChatMessage = Database['public']['Tables']['chat_messages']['Row']
export type AnalyticsEvent = Database['public']['Tables']['analytics_events']['Row']
export type PopularQuestion = Database['public']['Tables']['popular_questions']['Row']
