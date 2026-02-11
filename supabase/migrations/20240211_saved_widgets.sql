-- =============================================
-- Saved Widgets Table
-- =============================================
-- Store AI-generated widgets that users want to keep
-- Supports both anonymous and authenticated users

CREATE TABLE IF NOT EXISTS public.saved_widgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Link to user (authenticated or anonymous)
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    anonymous_id UUID REFERENCES public.anonymous_visitors(id) ON DELETE CASCADE,
    -- Widget metadata
    widget_type TEXT NOT NULL, -- 'checklist', 'itinerary', 'dua', 'guide', 'budget', 'tips', 'places', 'ritual'
    title TEXT NOT NULL,
    description TEXT,
    -- Widget data (the actual JSON content)
    widget_data JSONB NOT NULL,
    -- Source context
    source_context TEXT, -- 'build-itinerary', 'learn-umrah', etc.
    source_topic_id UUID REFERENCES public.chat_topics(id) ON DELETE SET NULL,
    -- User customization
    custom_title TEXT, -- User can rename
    notes TEXT, -- Personal notes
    is_pinned BOOLEAN DEFAULT false,
    -- Widget state (for checklists, etc.)
    widget_state JSONB, -- { checkedItems: {...}, expandedSections: [...] }
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_accessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_saved_widgets_profile ON saved_widgets(profile_id);
CREATE INDEX IF NOT EXISTS idx_saved_widgets_anonymous ON saved_widgets(anonymous_id);
CREATE INDEX IF NOT EXISTS idx_saved_widgets_type ON saved_widgets(widget_type);
CREATE INDEX IF NOT EXISTS idx_saved_widgets_pinned ON saved_widgets(is_pinned DESC, updated_at DESC);

-- RLS policies
ALTER TABLE public.saved_widgets ENABLE ROW LEVEL SECURITY;

-- Anonymous users can manage their widgets (via device_id lookup)
CREATE POLICY "Manage saved widgets" ON public.saved_widgets
    FOR ALL USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_saved_widget_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_saved_widget_update ON saved_widgets;
CREATE TRIGGER on_saved_widget_update
    BEFORE UPDATE ON saved_widgets
    FOR EACH ROW EXECUTE FUNCTION update_saved_widget_timestamp();
