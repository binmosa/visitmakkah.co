# Visit Makkah - AI Agent & Generative UI Plan

## Overview

Merge the widget area with ChatKit to create a unified, seamless AI experience. The ChatKit UI will display dynamic, context-aware content based on the selected sub-menu, with rich widgets rendered inline and client tools enabling app interactions.

---

## Step 1: Simplify HubLayout - Merge Widget Area with ChatKit

### Current State
```
┌─────────────────────┬──────────────────────────┐
│ ChatKit (2 cols)    │ Widget Area (3 cols)     │
│ - Static welcome    │ - Dynamic header         │
│ - Suggested Qs      │ - Context info           │
└─────────────────────┴──────────────────────────┘
```

### Target State
```
┌────────────────────────────────────────────────┐
│           ChatKit (Full Width - 5 cols)        │
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │ Dynamic Welcome (from current widget)    │  │
│  │ - Icon + Title (e.g., "Build Itinerary") │  │
│  │ - Description                            │  │
│  │ - Suggested Actions (context-aware)      │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│  [Chat input...]                               │
└────────────────────────────────────────────────┘
```

### Changes Required

#### 1.1 HubLayout.tsx
- Remove the separate widget area (lg:col-span-3)
- Make ChatKit full width (lg:col-span-5)
- Pass dynamic context to ChatKit:
  - `activeItem.name` → Title
  - `activeItem.description` → Subtitle
  - `activeItem.icon` → Icon
  - `suggestedQuestions` → Action buttons

#### 1.2 AIChatPanel.tsx
- Update ChatKit configuration to use `startScreen` option:
  ```tsx
  startScreen: {
    greeting: activeItem.description,
    prompts: suggestedQuestions.map(q => ({
      title: q,
      prompt: q
    }))
  }
  ```
- Pass context-specific header configuration

#### 1.3 API Route Updates
- Pass sub-menu context to agent for personalized responses
- Include user journey stage for better suggestions

---

## Step 2: Widget Designs Per Sub-Menu

### Prepare Section

| Sub-Menu | Widget Type | Widget Design | Reusable? |
|----------|-------------|---------------|-----------|
| **Build My Itinerary** | `itinerary_widget` | Timeline/list with days, activities, times | Yes |
| **Get My Visa** | `checklist_widget` | Step-by-step checklist with status indicators | Yes |
| **Pack My Bag** | `checklist_widget` | Categorized checklist (clothing, docs, etc.) | Yes |
| **Calculate Budget** | `budget_widget` | Table breakdown + total + pie chart | Unique |

#### Itinerary Widget
```json
{
  "type": "itinerary",
  "data": {
    "title": "7-Day Umrah Itinerary",
    "totalDays": 7,
    "days": [
      {
        "day": 1,
        "date": "2024-03-15",
        "title": "Arrival Day",
        "activities": [
          { "time": "14:00", "activity": "Arrive at Jeddah Airport", "icon": "plane" },
          { "time": "16:00", "activity": "Transfer to Makkah", "icon": "car" },
          { "time": "19:00", "activity": "Check into hotel", "icon": "hotel" }
        ]
      }
    ]
  },
  "actions": ["save", "regenerate"]
}
```

#### Checklist Widget (Reusable)
```json
{
  "type": "checklist",
  "data": {
    "title": "Visa Requirements",
    "categories": [
      {
        "name": "Documents",
        "items": [
          { "id": 1, "text": "Valid passport (6+ months)", "checked": false, "required": true },
          { "id": 2, "text": "Passport photos (white background)", "checked": false, "required": true }
        ]
      }
    ],
    "progress": { "completed": 0, "total": 10 }
  },
  "actions": ["save", "mark_all", "reset"]
}
```

#### Budget Widget
```json
{
  "type": "budget",
  "data": {
    "title": "10-Day Umrah Budget",
    "currency": "USD",
    "total": 4500,
    "breakdown": [
      { "category": "Flights", "amount": 1200, "icon": "plane", "percentage": 27 },
      { "category": "Hotel", "amount": 1500, "icon": "hotel", "percentage": 33 },
      { "category": "Food", "amount": 500, "icon": "food", "percentage": 11 },
      { "category": "Transport", "amount": 300, "icon": "car", "percentage": 7 },
      { "category": "Misc", "amount": 1000, "icon": "misc", "percentage": 22 }
    ],
    "perDay": 450
  },
  "actions": ["save", "adjust", "share"]
}
```

---

### Learn Section

| Sub-Menu | Widget Type | Widget Design | Reusable? |
|----------|-------------|---------------|-----------|
| **Umrah Guide** | `guide_widget` | Step-by-step guide with expandable sections | Yes |
| **Hajj Guide** | `guide_widget` | Multi-day guide with phases | Yes |
| **Step-by-Step Rituals** | `ritual_widget` | Visual steps with illustrations | Unique |
| **Duas & Prayers** | `dua_widget` | Arabic + transliteration + translation | Unique |

#### Guide Widget (Reusable)
```json
{
  "type": "guide",
  "data": {
    "title": "Complete Umrah Guide",
    "sections": [
      {
        "id": "ihram",
        "title": "1. Entering Ihram",
        "summary": "The sacred state of pilgrimage",
        "content": "...",
        "tips": ["Tip 1", "Tip 2"],
        "warnings": ["Warning 1"]
      }
    ],
    "currentStep": 1,
    "totalSteps": 4
  },
  "actions": ["bookmark", "share", "read_aloud"]
}
```

#### Dua Widget
```json
{
  "type": "dua",
  "data": {
    "title": "Dua for Tawaf",
    "occasion": "While performing Tawaf",
    "arabic": "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً...",
    "transliteration": "Rabbana atina fid-dunya hasanatan...",
    "translation": "Our Lord, give us good in this world...",
    "audioUrl": "/audio/dua-tawaf.mp3",
    "reference": "Quran 2:201"
  },
  "actions": ["play_audio", "bookmark", "share", "copy"]
}
```

#### Ritual Widget
```json
{
  "type": "ritual",
  "data": {
    "title": "How to Perform Tawaf",
    "steps": [
      {
        "step": 1,
        "title": "Start at Black Stone",
        "description": "Begin at Hajar al-Aswad corner",
        "image": "/images/rituals/tawaf-start.jpg",
        "dua": "Bismillah, Allahu Akbar"
      }
    ],
    "totalRounds": 7,
    "duration": "45-60 minutes"
  },
  "actions": ["start_guided_mode", "bookmark", "share"]
}
```

---

### Explore Section

| Sub-Menu | Widget Type | Widget Design | Reusable? |
|----------|-------------|---------------|-----------|
| **Find Hotels** | `places_widget` | Card grid with map option | Yes |
| **Find Food** | `places_widget` | Card grid with filters | Yes |
| **Check Crowds** | `crowd_widget` | Real-time indicator + best times | Unique |
| **Navigate to Haram** | `navigation_widget` | Route with gates + walking time | Unique |

#### Places Widget (Reusable for Hotels/Restaurants)
```json
{
  "type": "places",
  "data": {
    "title": "Hotels Near King Fahd Gate",
    "category": "hotels",
    "items": [
      {
        "id": "hotel-1",
        "name": "Hilton Suites Makkah",
        "rating": 4.5,
        "reviews": 1250,
        "price": { "amount": 250, "currency": "USD", "per": "night" },
        "distance": "50m from Gate",
        "image": "/images/hotels/hilton.jpg",
        "amenities": ["wifi", "breakfast", "gym"],
        "coordinates": { "lat": 21.4225, "lng": 39.8262 }
      }
    ],
    "filters": ["price", "rating", "distance"]
  },
  "actions": ["show_map", "filter", "book", "save"]
}
```

#### Crowd Widget
```json
{
  "type": "crowd",
  "data": {
    "title": "Current Crowd Level",
    "current": {
      "level": "moderate",
      "percentage": 65,
      "description": "Expect 30-45 min for Tawaf"
    },
    "forecast": [
      { "time": "Fajr", "level": "low", "percentage": 25 },
      { "time": "Dhuhr", "level": "high", "percentage": 85 },
      { "time": "Asr", "level": "moderate", "percentage": 55 },
      { "time": "Maghrib", "level": "very_high", "percentage": 95 },
      { "time": "Isha", "level": "high", "percentage": 80 }
    ],
    "bestTimes": ["After Fajr", "2-4 PM"],
    "lastUpdated": "2024-03-15T10:30:00Z"
  },
  "actions": ["set_reminder", "refresh", "share"]
}
```

#### Navigation Widget
```json
{
  "type": "navigation",
  "data": {
    "title": "Route to King Fahd Gate",
    "from": { "name": "Your Hotel", "coordinates": null },
    "to": {
      "name": "King Fahd Gate (Gate 79)",
      "coordinates": { "lat": 21.4225, "lng": 39.8262 }
    },
    "distance": "450m",
    "walkingTime": "6 minutes",
    "steps": [
      { "instruction": "Exit hotel, turn right", "distance": "50m" },
      { "instruction": "Continue on Ibrahim Al-Khalil St", "distance": "300m" },
      { "instruction": "Gate 79 on your left", "distance": "100m" }
    ],
    "gates": [
      { "name": "King Fahd Gate", "number": 79, "accessibility": true },
      { "name": "King Abdul Aziz Gate", "number": 1, "accessibility": true }
    ]
  },
  "actions": ["open_maps", "share", "save_route"]
}
```

---

### Tips Section

| Sub-Menu | Widget Type | Widget Design | Reusable? |
|----------|-------------|---------------|-----------|
| **First-Timer Guide** | `tips_widget` | Categorized tips with priorities | Yes |
| **For Women** | `tips_widget` | Women-specific guidance | Yes |
| **Ramadan Visit** | `tips_widget` | Ramadan-specific tips + schedule | Yes |
| **Secret Shortcuts** | `map_tips_widget` | Insider routes with map | Unique |

#### Tips Widget (Reusable)
```json
{
  "type": "tips",
  "data": {
    "title": "First-Timer Essential Tips",
    "categories": [
      {
        "name": "Before You Go",
        "icon": "preparation",
        "tips": [
          { "id": 1, "text": "Book hotel closest to your preferred gate", "priority": "high" },
          { "id": 2, "text": "Download offline maps of Makkah", "priority": "medium" }
        ]
      },
      {
        "name": "At Haram",
        "icon": "mosque",
        "tips": [
          { "id": 3, "text": "Perform Tawaf on upper floors for less crowds", "priority": "high" }
        ]
      }
    ]
  },
  "actions": ["save_all", "share", "ask_more"]
}
```

---

## Step 3: Client Tools - Function Mapping

### Tool Categories

#### 3.1 Data Persistence Tools

| Tool Name | Description | Parameters | App Function |
|-----------|-------------|------------|--------------|
| `save_itinerary` | Save generated itinerary to user profile | `{ itinerary: object }` | `saveItinerary(userId, itinerary)` |
| `save_checklist` | Save packing/visa checklist | `{ type: string, items: array }` | `saveChecklist(userId, type, items)` |
| `save_budget` | Save budget calculation | `{ budget: object }` | `saveBudget(userId, budget)` |
| `bookmark_dua` | Bookmark a dua/prayer | `{ dua: object }` | `bookmarkDua(userId, dua)` |
| `save_place` | Save hotel/restaurant | `{ place: object }` | `savePlace(userId, place)` |
| `save_route` | Save navigation route | `{ route: object }` | `saveRoute(userId, route)` |

#### 3.2 User Profile Tools

| Tool Name | Description | Parameters | App Function |
|-----------|-------------|------------|--------------|
| `get_user_profile` | Retrieve user profile/preferences | `{}` | `getUserProfile(userId)` |
| `update_journey_stage` | Update user's journey stage | `{ stage: string }` | `updateJourneyStage(userId, stage)` |
| `get_saved_items` | Retrieve user's saved items | `{ type: string }` | `getSavedItems(userId, type)` |

#### 3.3 External Integration Tools

| Tool Name | Description | Parameters | App Function |
|-----------|-------------|------------|--------------|
| `open_maps` | Open location in maps app | `{ coordinates: object, label: string }` | `openExternalMaps(coords, label)` |
| `share_content` | Share via native share API | `{ title: string, text: string, url: string }` | `shareContent(data)` |
| `export_pdf` | Export content as PDF | `{ type: string, data: object }` | `exportToPdf(type, data)` |
| `play_audio` | Play audio (dua recitation) | `{ audioUrl: string }` | `playAudio(url)` |

#### 3.4 UI Interaction Tools

| Tool Name | Description | Parameters | App Function |
|-----------|-------------|------------|--------------|
| `show_map_modal` | Display locations on map modal | `{ locations: array }` | `openMapModal(locations)` |
| `show_gallery` | Display image gallery | `{ images: array }` | `openGallery(images)` |
| `set_reminder` | Set reminder notification | `{ title: string, time: string }` | `scheduleReminder(title, time)` |
| `navigate_to` | Navigate to app route | `{ path: string }` | `router.push(path)` |

#### 3.5 Checklist Tools

| Tool Name | Description | Parameters | App Function |
|-----------|-------------|------------|--------------|
| `toggle_checklist_item` | Toggle item checked state | `{ itemId: string, checked: boolean }` | `toggleChecklistItem(itemId, checked)` |
| `add_checklist_item` | Add custom item to list | `{ listType: string, item: object }` | `addChecklistItem(type, item)` |
| `reset_checklist` | Reset all items to unchecked | `{ listType: string }` | `resetChecklist(type)` |

---

## Step 4: Implement onClientTool Callback

### 4.1 Create Client Tools Handler

**File:** `src/lib/client-tools.ts`

```typescript
import { createClient } from '@/lib/supabase/client'

export type ClientToolResult = {
  success: boolean
  message?: string
  data?: any
  error?: string
}

export type ClientToolHandler = (
  params: Record<string, unknown>,
  userId: string | null
) => Promise<ClientToolResult>

// Tool implementations
export const clientTools: Record<string, ClientToolHandler> = {
  // Data Persistence
  save_itinerary: async (params, userId) => { /* ... */ },
  save_checklist: async (params, userId) => { /* ... */ },
  save_budget: async (params, userId) => { /* ... */ },
  bookmark_dua: async (params, userId) => { /* ... */ },
  save_place: async (params, userId) => { /* ... */ },

  // User Profile
  get_user_profile: async (params, userId) => { /* ... */ },
  update_journey_stage: async (params, userId) => { /* ... */ },

  // External Integrations
  open_maps: async (params) => { /* ... */ },
  share_content: async (params) => { /* ... */ },
  export_pdf: async (params) => { /* ... */ },
  play_audio: async (params) => { /* ... */ },

  // UI Interactions
  show_map_modal: async (params) => { /* ... */ },
  set_reminder: async (params) => { /* ... */ },

  // Checklist
  toggle_checklist_item: async (params, userId) => { /* ... */ },
  add_checklist_item: async (params, userId) => { /* ... */ },
}
```

### 4.2 Update AIChatPanel with onClientTool

**File:** `src/components/AIPanel/AIChatPanel.tsx`

```typescript
import { clientTools } from '@/lib/client-tools'
import { useAuth } from '@/context/AuthContext'

function ActiveChatPanel({ context, contextLabel, initialQuestion }) {
  const { user } = useAuth()

  const { control } = useChatKit({
    api: {
      async getClientSecret() { /* ... */ },
    },
    onClientTool: async (toolCall) => {
      const handler = clientTools[toolCall.name]

      if (!handler) {
        console.warn(`Unknown tool: ${toolCall.name}`)
        return { success: false, error: 'Unknown tool' }
      }

      try {
        const result = await handler(toolCall.params, user?.id || null)
        return result
      } catch (error) {
        console.error(`Tool error (${toolCall.name}):`, error)
        return { success: false, error: error.message }
      }
    },
  })

  return <ChatKit control={control} />
}
```

### 4.3 Agent Builder Tool Definitions

For each tool, define in OpenAI Agent Builder:

```yaml
# Example: save_itinerary
name: save_itinerary
description: Save the generated itinerary to the user's profile for later access
type: client
parameters:
  type: object
  properties:
    itinerary:
      type: object
      description: The complete itinerary object
      properties:
        title:
          type: string
        totalDays:
          type: number
        days:
          type: array
          items:
            type: object
            properties:
              day: { type: number }
              title: { type: string }
              activities: { type: array }
  required: [itinerary]
```

---

## Implementation Order

### Phase 1: Layout Simplification
1. [ ] Update HubLayout.tsx - Remove widget area
2. [ ] Update AIChatPanel.tsx - Full width, dynamic start screen
3. [ ] Configure ChatKit startScreen with context data
4. [ ] Test navigation and context switching

### Phase 2: Widget Design (Agent Builder)
1. [ ] Design `itinerary_widget` in Agent Builder
2. [ ] Design `checklist_widget` (reusable)
3. [ ] Design `budget_widget`
4. [ ] Design `guide_widget` (reusable)
5. [ ] Design `dua_widget`
6. [ ] Design `places_widget` (reusable)
7. [ ] Design `crowd_widget`
8. [ ] Design `navigation_widget`
9. [ ] Design `tips_widget` (reusable)

### Phase 3: Client Tools Implementation
1. [ ] Create `src/lib/client-tools.ts` with all handlers
2. [ ] Create Supabase tables for saved items
3. [ ] Implement data persistence tools
4. [ ] Implement UI interaction tools
5. [ ] Implement external integration tools
6. [ ] Update AIChatPanel with onClientTool

### Phase 4: Agent Builder Configuration
1. [ ] Configure tools in Agent Builder
2. [ ] Update system prompts for widget usage
3. [ ] Test tool invocations
4. [ ] Fine-tune responses

### Phase 5: Testing & Polish
1. [ ] Test all sub-menu contexts
2. [ ] Test all widget renders
3. [ ] Test all client tools
4. [ ] Add animations/transitions
5. [ ] Mobile responsiveness

---

## Files to Modify/Create

### Modify
- `src/components/HubLayout.tsx` - Remove widget area
- `src/components/AIPanel/AIChatPanel.tsx` - Full width + onClientTool
- `src/app/api/chatkit/session/route.ts` - Enhanced context passing

### Create
- `src/lib/client-tools.ts` - Client tool handlers
- `src/lib/client-tools/persistence.ts` - Data save functions
- `src/lib/client-tools/integrations.ts` - External integrations
- `src/lib/client-tools/ui.ts` - UI interaction functions

### Database (Supabase)
- `saved_itineraries` table
- `saved_checklists` table
- `saved_budgets` table
- `bookmarked_duas` table
- `saved_places` table
- `saved_routes` table

---

## Notes

- Widgets are designed in OpenAI Agent Builder, not coded in React
- Client tools enable two-way communication (AI → App)
- Context from HubLayout drives personalization
- User authentication optional but enhances save functionality
- All saved data syncs to Supabase for persistence
