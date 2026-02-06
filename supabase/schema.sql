-- Visit Makkah Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- VISITORS TABLE
-- Anonymous visitors identified by device ID
-- ============================================
CREATE TABLE IF NOT EXISTS visitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id TEXT UNIQUE NOT NULL,
    first_seen TIMESTAMPTZ DEFAULT NOW(),
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    user_agent TEXT,
    country TEXT,
    language TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick device lookups
CREATE INDEX IF NOT EXISTS idx_visitors_device_id ON visitors(device_id);

-- ============================================
-- JOURNEY PROFILES TABLE
-- User's journey preferences and onboarding data
-- ============================================
CREATE TABLE IF NOT EXISTS journey_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visitor_id UUID REFERENCES visitors(id) ON DELETE CASCADE,
    journey_stage TEXT, -- 'exploring', 'planning', 'booked', 'traveling', 'completed'
    journey_type TEXT, -- 'hajj', 'umrah', 'both'
    is_first_time BOOLEAN DEFAULT TRUE,
    travel_group TEXT, -- 'solo', 'couple', 'family', 'group'
    travel_dates JSONB, -- { startDate, endDate }
    preferences JSONB, -- any custom preferences
    completed_steps TEXT[], -- onboarding steps completed
    share_code TEXT UNIQUE, -- short code for shareable links
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_journey_profiles_visitor ON journey_profiles(visitor_id);
CREATE INDEX IF NOT EXISTS idx_journey_profiles_share_code ON journey_profiles(share_code);

-- ============================================
-- CHAT SESSIONS TABLE
-- Groups chat messages into sessions by context
-- ============================================
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visitor_id UUID REFERENCES visitors(id) ON DELETE CASCADE,
    context TEXT NOT NULL, -- 'hajj', 'umrah', 'hotels', etc.
    context_label TEXT, -- 'Hajj Guide', 'Hotels', etc.
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    message_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for visitor sessions
CREATE INDEX IF NOT EXISTS idx_chat_sessions_visitor ON chat_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_context ON chat_sessions(context);

-- ============================================
-- CHAT MESSAGES TABLE
-- Individual messages for training data
-- ============================================
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    visitor_id UUID REFERENCES visitors(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    context TEXT, -- redundant but useful for quick queries
    tokens_used INTEGER,
    response_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for message queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_visitor ON chat_messages(visitor_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_role ON chat_messages(role);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at DESC);

-- ============================================
-- ANALYTICS EVENTS TABLE
-- Track user actions and page views
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visitor_id UUID REFERENCES visitors(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'page_view', 'onboarding_complete', 'share_plan', etc.
    event_data JSONB, -- any additional event data
    page_path TEXT,
    referrer TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_analytics_visitor ON analytics_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at DESC);

-- ============================================
-- POPULAR QUESTIONS TABLE
-- Aggregated frequently asked questions
-- ============================================
CREATE TABLE IF NOT EXISTS popular_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    context TEXT NOT NULL,
    ask_count INTEGER DEFAULT 1,
    last_asked TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(question, context)
);

-- Index for popular questions
CREATE INDEX IF NOT EXISTS idx_popular_questions_context ON popular_questions(context);
CREATE INDEX IF NOT EXISTS idx_popular_questions_count ON popular_questions(ask_count DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE popular_questions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts and updates for visitors (via anon key)
CREATE POLICY "Allow anonymous visitor access" ON visitors
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous journey profile access" ON journey_profiles
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous chat session access" ON chat_sessions
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous chat message access" ON chat_messages
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous analytics access" ON analytics_events
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow read-only popular questions" ON popular_questions
    FOR SELECT USING (true);

CREATE POLICY "Allow service role to manage popular questions" ON popular_questions
    FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to generate short share codes
CREATE OR REPLACE FUNCTION generate_share_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'abcdefghijklmnopqrstuvwxyz0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to update last_seen on visitor activity
CREATE OR REPLACE FUNCTION update_visitor_last_seen()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE visitors SET last_seen = NOW() WHERE id = NEW.visitor_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update last_seen when new events are created
CREATE TRIGGER update_visitor_on_event
    AFTER INSERT ON analytics_events
    FOR EACH ROW
    EXECUTE FUNCTION update_visitor_last_seen();

-- Function to increment message count in chat sessions
CREATE OR REPLACE FUNCTION increment_session_message_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chat_sessions
    SET message_count = message_count + 1
    WHERE id = NEW.session_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for message count
CREATE TRIGGER increment_message_count
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION increment_session_message_count();

-- ============================================
-- USEFUL VIEWS FOR ANALYTICS
-- ============================================

-- Daily active visitors
CREATE OR REPLACE VIEW daily_active_visitors AS
SELECT
    DATE(created_at) as date,
    COUNT(DISTINCT visitor_id) as unique_visitors,
    COUNT(*) as total_events
FROM analytics_events
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Popular contexts (what people ask about most)
CREATE OR REPLACE VIEW popular_contexts AS
SELECT
    context,
    COUNT(*) as session_count,
    SUM(message_count) as total_messages
FROM chat_sessions
GROUP BY context
ORDER BY session_count DESC;

-- Journey type distribution
CREATE OR REPLACE VIEW journey_distribution AS
SELECT
    journey_type,
    travel_group,
    COUNT(*) as count
FROM journey_profiles
WHERE journey_type IS NOT NULL
GROUP BY journey_type, travel_group
ORDER BY count DESC;

-- ============================================
-- SAMPLE QUERIES FOR TRAINING DATA EXPORT
-- ============================================

-- Export all Q&A pairs for training:
-- SELECT
--     m1.content as question,
--     m2.content as answer,
--     m1.context
-- FROM chat_messages m1
-- JOIN chat_messages m2 ON m1.session_id = m2.session_id
-- WHERE m1.role = 'user'
--   AND m2.role = 'assistant'
--   AND m2.created_at > m1.created_at
-- ORDER BY m1.created_at;
