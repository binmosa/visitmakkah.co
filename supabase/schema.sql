-- =============================================
-- Visit Makkah Database Schema v2
-- Focus: User Accounts + AI Training Data
-- Analytics: Google Analytics (not here)
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. USER PROFILES (Extends Supabase Auth)
-- =============================================
-- Automatically created when user signs up via Supabase Auth
-- Supports: Email magic link, Phone OTP, Google OAuth

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    -- Contact info (from auth or manually added)
    email TEXT,
    phone TEXT,
    display_name TEXT,
    avatar_url TEXT,
    -- Journey preferences (from onboarding)
    journey_type TEXT, -- 'hajj', 'umrah', 'both', 'exploring'
    is_first_time BOOLEAN DEFAULT true,
    travel_group TEXT, -- 'solo', 'couple', 'family', 'group'
    travel_dates JSONB, -- { startDate, endDate }
    home_country TEXT,
    preferred_language TEXT DEFAULT 'en',
    -- For shareable plans
    share_code TEXT UNIQUE,
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, phone, share_code)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.phone,
        -- Generate random share code
        lower(substr(md5(random()::text), 1, 8))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 2. ANONYMOUS VISITORS (Pre-signup tracking)
-- =============================================
-- Track anonymous users until they create an account
-- Can be linked to profile later

CREATE TABLE IF NOT EXISTS public.anonymous_visitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id TEXT UNIQUE NOT NULL,
    -- Journey data (pre-signup)
    journey_type TEXT,
    is_first_time BOOLEAN,
    travel_group TEXT,
    travel_dates JSONB,
    preferences JSONB,
    share_code TEXT UNIQUE,
    -- Link to profile if they sign up later
    linked_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    -- Timestamps
    first_seen TIMESTAMPTZ DEFAULT NOW(),
    last_seen TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_anon_device ON anonymous_visitors(device_id);
CREATE INDEX IF NOT EXISTS idx_anon_share_code ON anonymous_visitors(share_code);

-- =============================================
-- 3. CHAT TOPICS (What users discuss)
-- =============================================
-- GOLD DATA: Track which topics users are interested in

CREATE TABLE IF NOT EXISTS public.chat_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Link to user (authenticated or anonymous)
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    anonymous_id UUID REFERENCES public.anonymous_visitors(id) ON DELETE SET NULL,
    -- Topic details
    context TEXT NOT NULL, -- 'hajj', 'hotels', 'visa', etc.
    context_label TEXT, -- 'Hajj Guide', 'Hotels', etc.
    -- Session info
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    message_count INTEGER DEFAULT 0,
    -- Feedback
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    was_helpful BOOLEAN,
    feedback_text TEXT
);

CREATE INDEX IF NOT EXISTS idx_topics_context ON chat_topics(context);
CREATE INDEX IF NOT EXISTS idx_topics_profile ON chat_topics(profile_id);

-- =============================================
-- 4. CHAT MESSAGES (AI Training Data)
-- =============================================
-- GOLD DATA: Actual Q&A pairs for training your AI

CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID REFERENCES public.chat_topics(id) ON DELETE CASCADE,
    -- Message
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    -- Context for training
    context TEXT,
    -- Quality signals
    was_edited BOOLEAN DEFAULT false, -- If user rephrased
    thumbs_up BOOLEAN, -- User feedback on response
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_topic ON chat_messages(topic_id);
CREATE INDEX IF NOT EXISTS idx_messages_role ON chat_messages(role);
CREATE INDEX IF NOT EXISTS idx_messages_context ON chat_messages(context);

-- Trigger to increment message count
CREATE OR REPLACE FUNCTION increment_topic_message_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chat_topics SET message_count = message_count + 1 WHERE id = NEW.topic_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_message_insert ON chat_messages;
CREATE TRIGGER on_message_insert
    AFTER INSERT ON chat_messages
    FOR EACH ROW EXECUTE FUNCTION increment_topic_message_count();

-- =============================================
-- 5. POPULAR QUESTIONS (Aggregated Insights)
-- =============================================
-- GOLD DATA: Most asked questions by topic
-- Use to improve suggested questions & identify content gaps

CREATE TABLE IF NOT EXISTS public.popular_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    context TEXT NOT NULL,
    -- Stats
    ask_count INTEGER DEFAULT 1,
    last_asked TIMESTAMPTZ DEFAULT NOW(),
    -- Curation
    is_featured BOOLEAN DEFAULT false, -- Show as suggested question
    curated_answer TEXT, -- Optional: pre-written answer
    -- Unique constraint
    UNIQUE(question, context)
);

CREATE INDEX IF NOT EXISTS idx_popular_context ON popular_questions(context);
CREATE INDEX IF NOT EXISTS idx_popular_count ON popular_questions(ask_count DESC);

-- =============================================
-- 6. WAITLIST / NEWSLETTER
-- =============================================
-- Collect emails for marketing, updates, deals

CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    phone TEXT,
    name TEXT,
    -- Preferences
    interests TEXT[], -- ['hajj_packages', 'umrah_deals', 'tips', 'new_features']
    journey_type TEXT, -- What they're planning
    -- Source tracking
    source TEXT, -- 'homepage', 'blog', 'chat', etc.
    utm_source TEXT,
    utm_campaign TEXT,
    -- Status
    verified BOOLEAN DEFAULT false,
    subscribed BOOLEAN DEFAULT true,
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Allow same email with different sources for tracking
    UNIQUE(email)
);

CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- =============================================
-- 7. SAVED ITEMS (Future: Bookmarks)
-- =============================================
-- For future features: save hotels, itineraries, blog posts

CREATE TABLE IF NOT EXISTS public.saved_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    -- What they saved
    item_type TEXT NOT NULL, -- 'hotel', 'restaurant', 'blog_post', 'itinerary'
    item_id TEXT NOT NULL, -- External reference
    item_data JSONB, -- Cached data
    notes TEXT, -- Personal notes
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- One save per item per user
    UNIQUE(profile_id, item_type, item_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_profile ON saved_items(profile_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anonymous_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.popular_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own
CREATE POLICY "Users read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Anonymous visitors: Public access (for pre-login tracking)
CREATE POLICY "Anon visitor access" ON public.anonymous_visitors
    FOR ALL USING (true);

-- Chat topics: Allow creation, users see their own
CREATE POLICY "Create chat topics" ON public.chat_topics
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Read own topics" ON public.chat_topics
    FOR SELECT USING (profile_id = auth.uid() OR anonymous_id IS NOT NULL);
CREATE POLICY "Update topics" ON public.chat_topics
    FOR UPDATE USING (true);

-- Chat messages: Linked to topics
CREATE POLICY "Chat message access" ON public.chat_messages
    FOR ALL USING (true);

-- Popular questions: Public read
CREATE POLICY "Read popular questions" ON public.popular_questions
    FOR SELECT USING (true);
CREATE POLICY "Manage popular questions" ON public.popular_questions
    FOR ALL USING (true);

-- Waitlist: Anyone can join
CREATE POLICY "Join waitlist" ON public.waitlist
    FOR INSERT WITH CHECK (true);

-- Saved items: Users manage their own
CREATE POLICY "Manage saved items" ON public.saved_items
    FOR ALL USING (profile_id = auth.uid());

-- =============================================
-- VIEWS FOR INSIGHTS
-- =============================================

-- Topic popularity (for improving AI focus areas)
CREATE OR REPLACE VIEW public.topic_insights AS
SELECT
    context,
    context_label,
    COUNT(*) as sessions,
    SUM(message_count) as total_messages,
    ROUND(AVG(user_rating), 1) as avg_rating,
    COUNT(CASE WHEN was_helpful = true THEN 1 END) as helpful_count
FROM public.chat_topics
WHERE started_at > NOW() - INTERVAL '30 days'
GROUP BY context, context_label
ORDER BY sessions DESC;

-- Top questions by topic (for suggested questions)
CREATE OR REPLACE VIEW public.top_questions_by_topic AS
SELECT
    context,
    question,
    ask_count,
    is_featured
FROM public.popular_questions
WHERE ask_count >= 2
ORDER BY context, ask_count DESC;

-- =============================================
-- TRAINING DATA EXPORT QUERIES
-- =============================================

-- Export Q&A pairs for fine-tuning:
/*
SELECT
    m1.content as user_question,
    m2.content as assistant_response,
    m1.context as topic,
    t.context_label as topic_label,
    CASE WHEN m2.thumbs_up = true THEN 'good' ELSE 'unknown' END as quality
FROM chat_messages m1
JOIN chat_messages m2 ON m1.topic_id = m2.topic_id
    AND m2.role = 'assistant'
    AND m2.created_at > m1.created_at
JOIN chat_topics t ON m1.topic_id = t.id
WHERE m1.role = 'user'
ORDER BY m1.created_at;
*/

-- Export popular questions for suggested prompts:
/*
SELECT context, question, ask_count
FROM popular_questions
WHERE ask_count >= 5
ORDER BY context, ask_count DESC;
*/
