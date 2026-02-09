# Visit Makkah AI Architecture Plan

## Overview

Migrate from OpenAI ChatKit to a custom architecture using:
- **Vercel AI SDK** for chat UI and streaming
- **OpenAI Vector Stores + File Search** for RAG (via Responses API)
- **OpenAI Chat Completions** with structured outputs
- **Custom React Widget Components** for rich UI rendering
- **Supabase** for conversation history persistence

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Frontend                                    │
├─────────────────────────────────────────────────────────────────────────┤
│  Navigation Menu                    │  AI Chat Panel                    │
│  ┌─────────────────────────┐       │  ┌─────────────────────────────┐  │
│  │ Prepare                 │       │  │ Chat Messages               │  │
│  │  ├─ Build Itinerary    │───────│  │  ├─ User Message            │  │
│  │  ├─ Visa Guide         │ ctx   │  │  ├─ AI Text                 │  │
│  │  └─ Pack My Bag        │ hints │  │  ├─ <ItineraryWidget/>      │  │
│  │ Learn                   │       │  │  ├─ AI Text                 │  │
│  │  ├─ Umrah Guide        │       │  │  └─ <ChecklistWidget/>      │  │
│  │  └─ Hajj Guide         │       │  ├─────────────────────────────┤  │
│  │ Explore                 │       │  │ Composer Input              │  │
│  │  ├─ Find Hotels        │       │  └─────────────────────────────┘  │
│  │  └─ Local Tips         │       │                                    │
│  └─────────────────────────┘       │                                    │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         API Route: /api/chat                            │
├─────────────────────────────────────────────────────────────────────────┤
│  1. Receive message + context hints                                      │
│  2. Load conversation history from Supabase                              │
│  3. Stage 1: Refiner Agent (optional)                                    │
│     - Check if question needs clarification                              │
│     - If incomplete → return clarifying question                         │
│  4. Stage 2: Main Agent                                                  │
│     - System prompt with context hints + available tools                 │
│     - OpenAI Chat Completions with file_search tool                      │
│     - AI decides which vector stores to query                            │
│     - AI decides which widgets to render                                 │
│  5. Stream response with widget markers                                  │
│  6. Save to Supabase                                                     │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         OpenAI Services                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  Vector Stores (RAG)              │  Chat Completions                   │
│  ┌─────────────────────────┐      │  ┌─────────────────────────────┐   │
│  │ vs_prepare_itinerary   │      │  │ Model: gpt-4o               │   │
│  │ vs_prepare_visa        │      │  │ Tools: file_search,         │   │
│  │ vs_prepare_packing     │      │  │        render_widget        │   │
│  │ vs_learn_umrah         │      │  │ Response: streaming text    │   │
│  │ vs_learn_hajj          │      │  │           + widget markers  │   │
│  │ vs_explore_hotels      │      │  └─────────────────────────────┘   │
│  │ vs_explore_food        │      │                                     │
│  │ vs_explore_tips        │      │                                     │
│  └─────────────────────────┘      │                                     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Key Design Decisions

### 1. Context Hints (Not Constraints)

The navigation provides **hints** to help the AI, but doesn't restrict it:

```typescript
interface ContextHints {
  page: 'prepare' | 'learn' | 'explore' | 'blog'
  action: string                    // e.g., 'build-itinerary'
  actionLabel: string               // e.g., 'Build My Itinerary'
  primaryVectorStore: string        // Suggested vector store
  primaryWidget: string             // Suggested widget type
  suggestedPrompts: string[]        // Quick action suggestions
}
```

The AI system prompt will say:
> "User is on the '{actionLabel}' page. The primary knowledge base is '{primaryVectorStore}'
> and the expected widget is '{primaryWidget}'. However, if the user's question spans
> multiple topics, you may query other vector stores and render multiple widgets as needed."

### 2. AI Flexibility

The AI can:
- Query **multiple vector stores** in one response
- Render **multiple widgets** inline with text
- Ignore context hints if the user asks something different

Example query: "Show me umrah steps and where to go after finishing umrah"
- AI queries: `vs_learn_umrah` + `vs_explore_places`
- AI renders: `<RitualWidget/>` + `<PlacesWidget/>`

### 3. Two-Stage Flow (Refiner → Main)

```
User Input
    │
    ▼
┌───────────────────────────────────────┐
│  Stage 1: Refiner Agent (gpt-4o-mini) │
│  - Is the question complete?          │
│  - Does it need clarification?        │
│  - If yes → ask clarifying question   │
│  - If no → pass to Main Agent         │
└───────────────────────────────────────┘
    │
    ▼ (if complete)
┌───────────────────────────────────────┐
│  Stage 2: Main Agent (gpt-4o)         │
│  - RAG via file_search                │
│  - Generate response with widgets     │
│  - Stream to client                   │
└───────────────────────────────────────┘
```

### 4. Widget Streaming Format

Widgets are embedded inline using markers:

```
Here's your personalized Umrah itinerary:

<<<WIDGET:itinerary>>>
{
  "title": "7-Day Umrah Journey",
  "days": [...]
}
<<<END_WIDGET>>>

The first day focuses on arrival and rest. Here are the key rituals:

<<<WIDGET:ritual>>>
{
  "title": "Tawaf",
  "steps": [...]
}
<<<END_WIDGET>>>

Let me know if you'd like to adjust any part of this plan.
```

---

## Implementation Plan

### Phase 1: Foundation (Files 1-5)

#### 1.1 Create Context Configuration
**File:** `src/config/ai-context.ts`

```typescript
export interface ContextConfig {
  page: string
  action: string
  actionLabel: string
  vectorStoreId: string
  primaryWidget: WidgetType
  systemPromptAddition: string
  suggestedPrompts: string[]
}

export const contextConfigs: Record<string, ContextConfig> = {
  'build-itinerary': {
    page: 'prepare',
    action: 'build-itinerary',
    actionLabel: 'Build My Itinerary',
    vectorStoreId: 'vs_xxxx_itinerary',
    primaryWidget: 'itinerary',
    systemPromptAddition: 'Focus on creating personalized travel itineraries...',
    suggestedPrompts: [
      'Create a 7-day Umrah itinerary',
      'Plan my Hajj journey for a family of 4',
    ],
  },
  // ... more configs
}

// All available vector stores (AI can query any)
export const vectorStores = {
  itinerary: 'vs_xxxx_itinerary',
  visa: 'vs_xxxx_visa',
  packing: 'vs_xxxx_packing',
  umrah: 'vs_xxxx_umrah',
  hajj: 'vs_xxxx_hajj',
  hotels: 'vs_xxxx_hotels',
  food: 'vs_xxxx_food',
  tips: 'vs_xxxx_tips',
}
```

#### 1.2 Create Widget Types
**File:** `src/types/widgets.ts`

```typescript
export type WidgetType =
  | 'itinerary'
  | 'checklist'
  | 'budget'
  | 'guide'
  | 'dua'
  | 'ritual'
  | 'places'
  | 'crowd'
  | 'navigation'
  | 'tips'

export interface WidgetData {
  type: WidgetType
  data: unknown
}

// Individual widget schemas (from widgets_contract.md)
export interface ItineraryWidget {
  type: 'itinerary'
  data: {
    title: string
    summary: string
    duration: { nights: number; days: number }
    days: Array<{
      day: number
      title: string
      location: string
      activities: Array<{
        time: string
        title: string
        description: string
        location?: string
        tips?: string[]
      }>
    }>
  }
}

// ... more widget interfaces
```

#### 1.3 Create API Route
**File:** `src/app/api/chat/route.ts`

```typescript
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { contextConfigs, vectorStores } from '@/config/ai-context'

export async function POST(req: Request) {
  const { messages, contextAction, userProfile, topicId } = await req.json()

  // Get context hints (not constraints)
  const contextHints = contextConfigs[contextAction] || contextConfigs['general']

  // Build system prompt with flexibility
  const systemPrompt = buildSystemPrompt(contextHints, userProfile)

  // Stage 1: Check if refinement needed (optional)
  const needsRefinement = await checkRefinement(messages)
  if (needsRefinement) {
    return streamRefinementQuestion(needsRefinement)
  }

  // Stage 2: Main response with RAG
  const result = await streamText({
    model: openai('gpt-4o'),
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    tools: {
      file_search: {
        // OpenAI's built-in file search across vector stores
        vectorStoreIds: Object.values(vectorStores),
      },
    },
  })

  // Save to Supabase (async, don't block response)
  saveToSupabase(topicId, messages, result)

  return result.toDataStreamResponse()
}
```

#### 1.4 Create Chat Hook
**File:** `src/hooks/useAIChat.ts`

```typescript
import { useChat } from 'ai/react'
import { useCallback, useState } from 'react'
import { parseWidgets } from '@/lib/widget-parser'

export function useAIChat(contextAction: string) {
  const [widgets, setWidgets] = useState<WidgetData[]>([])

  const { messages, input, handleSubmit, isLoading, setInput } = useChat({
    api: '/api/chat',
    body: {
      contextAction,
      userProfile: getUserProfile(),
    },
    onFinish: (message) => {
      // Parse widgets from completed message
      const parsed = parseWidgets(message.content)
      setWidgets(parsed.widgets)
    },
  })

  return {
    messages,
    input,
    setInput,
    handleSubmit,
    isLoading,
    widgets,
  }
}
```

#### 1.5 Create Widget Parser
**File:** `src/lib/widget-parser.ts`

```typescript
const WIDGET_REGEX = /<<<WIDGET:(\w+)>>>([\s\S]*?)<<<END_WIDGET>>>/g

export interface ParsedContent {
  segments: Array<
    | { type: 'text'; content: string }
    | { type: 'widget'; widgetType: string; data: unknown }
  >
  widgets: WidgetData[]
}

export function parseWidgets(content: string): ParsedContent {
  const segments: ParsedContent['segments'] = []
  const widgets: WidgetData[] = []

  let lastIndex = 0
  let match

  while ((match = WIDGET_REGEX.exec(content)) !== null) {
    // Add text before widget
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: content.slice(lastIndex, match.index),
      })
    }

    // Parse widget
    const widgetType = match[1]
    const widgetJson = match[2].trim()

    try {
      const data = JSON.parse(widgetJson)
      segments.push({ type: 'widget', widgetType, data })
      widgets.push({ type: widgetType as WidgetType, data })
    } catch (e) {
      // Invalid JSON, treat as text
      segments.push({ type: 'text', content: match[0] })
    }

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < content.length) {
    segments.push({ type: 'text', content: content.slice(lastIndex) })
  }

  return { segments, widgets }
}
```

---

### Phase 2: Widget Components (Files 6-15)

Create 10 widget components in `src/components/Widgets/`:

| File | Widget |
|------|--------|
| `ItineraryWidget.tsx` | Multi-day travel plans |
| `ChecklistWidget.tsx` | Interactive checklists |
| `BudgetWidget.tsx` | Cost breakdowns |
| `GuideWidget.tsx` | Step-by-step guides |
| `DuaWidget.tsx` | Prayers with Arabic/translation |
| `RitualWidget.tsx` | Ritual instructions |
| `PlacesWidget.tsx` | Location cards |
| `CrowdWidget.tsx` | Crowd indicators |
| `NavigationWidget.tsx` | Directions/routes |
| `TipsWidget.tsx` | Tips and advice |

Each widget follows the schema in `widgets_contract.md`.

---

### Phase 3: Chat UI (Files 16-18)

#### 3.1 Create Message Renderer
**File:** `src/components/Chat/MessageRenderer.tsx`

```typescript
import { parseWidgets } from '@/lib/widget-parser'
import { WidgetRenderer } from './WidgetRenderer'

export function MessageRenderer({ content }: { content: string }) {
  const { segments } = parseWidgets(content)

  return (
    <div className="space-y-4">
      {segments.map((segment, i) => (
        segment.type === 'text' ? (
          <div key={i} className="prose dark:prose-invert">
            <Markdown>{segment.content}</Markdown>
          </div>
        ) : (
          <WidgetRenderer
            key={i}
            type={segment.widgetType}
            data={segment.data}
          />
        )
      ))}
    </div>
  )
}
```

#### 3.2 Create Widget Renderer
**File:** `src/components/Chat/WidgetRenderer.tsx`

```typescript
import dynamic from 'next/dynamic'

const widgets = {
  itinerary: dynamic(() => import('../Widgets/ItineraryWidget')),
  checklist: dynamic(() => import('../Widgets/ChecklistWidget')),
  budget: dynamic(() => import('../Widgets/BudgetWidget')),
  // ... more widgets
}

export function WidgetRenderer({ type, data }: { type: string; data: unknown }) {
  const Widget = widgets[type]
  if (!Widget) return null
  return <Widget data={data} />
}
```

#### 3.3 Create New Chat Panel
**File:** `src/components/AIPanel/AIChatPanelV2.tsx`

```typescript
'use client'

import { useAIChat } from '@/hooks/useAIChat'
import { MessageRenderer } from '../Chat/MessageRenderer'

export function AIChatPanelV2({ contextAction }: { contextAction: string }) {
  const { messages, input, setInput, handleSubmit, isLoading } = useAIChat(contextAction)

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={msg.role === 'user' ? 'ml-auto' : ''}>
            <MessageRenderer content={msg.content} />
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t p-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="w-full rounded-lg border p-3"
        />
      </form>
    </div>
  )
}
```

---

### Phase 4: Supabase Integration (Files 19-20)

#### 4.1 Create Chat Service
**File:** `src/lib/chat-service.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function createTopic(userId: string, title: string) {
  const { data } = await supabase
    .from('chat_topics')
    .insert({ user_id: userId, title })
    .select()
    .single()
  return data
}

export async function saveMessage(topicId: string, role: string, content: string) {
  await supabase
    .from('chat_messages')
    .insert({ topic_id: topicId, role, content })
}

export async function getConversationHistory(topicId: string) {
  const { data } = await supabase
    .from('chat_messages')
    .select('role, content')
    .eq('topic_id', topicId)
    .order('created_at', { ascending: true })
  return data || []
}
```

---

### Phase 5: Vector Stores Setup

#### 5.1 Create Vector Stores in OpenAI Dashboard

1. Go to OpenAI Platform → Storage → Vector Stores
2. Create stores:
   - `vs_visitmakkah_itinerary`
   - `vs_visitmakkah_visa`
   - `vs_visitmakkah_packing`
   - `vs_visitmakkah_umrah`
   - `vs_visitmakkah_hajj`
   - `vs_visitmakkah_hotels`
   - `vs_visitmakkah_food`
   - `vs_visitmakkah_tips`

3. Upload knowledge files to each store

#### 5.2 Create Knowledge Files

Prepare markdown/text files for each domain:

```
knowledge/
├── itinerary/
│   ├── umrah-7-day-plan.md
│   ├── hajj-5-day-plan.md
│   └── family-itinerary-tips.md
├── visa/
│   ├── saudi-visa-requirements.md
│   ├── country-specific-rules.md
│   └── visa-faq.md
├── packing/
│   ├── umrah-packing-list.md
│   ├── hajj-packing-list.md
│   └── weather-guide.md
└── ...
```

---

## File Structure Summary

```
src/
├── app/
│   └── api/
│       └── chat/
│           └── route.ts          # Main chat API
├── components/
│   ├── AIPanel/
│   │   └── AIChatPanelV2.tsx     # New chat panel
│   ├── Chat/
│   │   ├── MessageRenderer.tsx   # Renders text + widgets
│   │   └── WidgetRenderer.tsx    # Dynamic widget loader
│   └── Widgets/
│       ├── ItineraryWidget.tsx
│       ├── ChecklistWidget.tsx
│       ├── BudgetWidget.tsx
│       ├── GuideWidget.tsx
│       ├── DuaWidget.tsx
│       ├── RitualWidget.tsx
│       ├── PlacesWidget.tsx
│       ├── CrowdWidget.tsx
│       ├── NavigationWidget.tsx
│       └── TipsWidget.tsx
├── config/
│   └── ai-context.ts             # Context configurations
├── hooks/
│   └── useAIChat.ts              # Chat hook
├── lib/
│   ├── chat-service.ts           # Supabase chat operations
│   └── widget-parser.ts          # Parse widget markers
└── types/
    └── widgets.ts                # Widget type definitions
```

---

## Migration Checklist

- [ ] Create `src/config/ai-context.ts`
- [ ] Create `src/types/widgets.ts`
- [ ] Create `src/lib/widget-parser.ts`
- [ ] Create `src/app/api/chat/route.ts`
- [ ] Create `src/hooks/useAIChat.ts`
- [ ] Create `src/lib/chat-service.ts`
- [ ] Create `src/components/Chat/MessageRenderer.tsx`
- [ ] Create `src/components/Chat/WidgetRenderer.tsx`
- [ ] Create `src/components/AIPanel/AIChatPanelV2.tsx`
- [ ] Create 10 widget components
- [ ] Set up OpenAI Vector Stores
- [ ] Upload knowledge files
- [ ] Update environment variables
- [ ] Replace old AIChatPanel with AIChatPanelV2
- [ ] Test all widgets
- [ ] Test multi-widget responses
- [ ] Test conversation persistence

---

## Environment Variables

```env
# OpenAI
OPENAI_API_KEY=sk-...

# Vector Store IDs
VECTOR_STORE_ITINERARY=vs_xxxx
VECTOR_STORE_VISA=vs_xxxx
VECTOR_STORE_PACKING=vs_xxxx
VECTOR_STORE_UMRAH=vs_xxxx
VECTOR_STORE_HAJJ=vs_xxxx
VECTOR_STORE_HOTELS=vs_xxxx
VECTOR_STORE_FOOD=vs_xxxx
VECTOR_STORE_TIPS=vs_xxxx

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
```
