# Widgets Contract

> Widget definitions for OpenAI Agent Builder generative UI components.
> Each widget has a `type`, `data` schema, and available `actions`.

---

## Widget Names (10 Total)

| # | Widget Name | Type Key | Reusable | Used For |
|---|-------------|----------|----------|----------|
| 1 | Itinerary | `itinerary` | Yes | Trip planning, day-by-day schedule |
| 2 | Checklist | `checklist` | Yes | Visa requirements, packing lists |
| 3 | Budget | `budget` | No | Cost breakdown, budget calculation |
| 4 | Guide | `guide` | Yes | Umrah guide, Hajj guide |
| 5 | Dua | `dua` | No | Prayers, supplications |
| 6 | Ritual | `ritual` | No | Step-by-step ritual instructions |
| 7 | Places | `places` | Yes | Hotels, restaurants, locations |
| 8 | Crowd | `crowd` | No | Haram crowd levels, best times |
| 9 | Navigation | `navigation` | No | Routes, directions to gates |
| 10 | Tips | `tips` | Yes | First-timer tips, women tips, etc. |

---

## 1. Itinerary Widget

**Type:** `itinerary`

### Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | ✅ | Always `"itinerary"` |
| `data.title` | string | ✅ | Itinerary title |
| `data.totalDays` | number | ✅ | Total number of days |
| `data.days` | array | ✅ | Array of day objects |
| `data.days[].day` | number | ✅ | Day number |
| `data.days[].date` | string | ❌ | Date (YYYY-MM-DD) |
| `data.days[].title` | string | ✅ | Day title |
| `data.days[].activities` | array | ✅ | Array of activities |
| `data.days[].activities[].time` | string | ✅ | Time (HH:MM) |
| `data.days[].activities[].activity` | string | ✅ | Activity description |
| `data.days[].activities[].icon` | string | ❌ | Icon name |
| `actions` | array | ❌ | Available actions |

### Example Payload

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
          { "time": "19:00", "activity": "Check into hotel", "icon": "hotel" },
          { "time": "21:00", "activity": "First Umrah - Enter Ihram", "icon": "ihram" }
        ]
      },
      {
        "day": 2,
        "date": "2024-03-16",
        "title": "Complete Umrah",
        "activities": [
          { "time": "05:00", "activity": "Fajr prayer at Haram", "icon": "prayer" },
          { "time": "06:00", "activity": "Tawaf (7 rounds)", "icon": "kaaba" },
          { "time": "08:00", "activity": "Sa'i between Safa and Marwa", "icon": "walking" },
          { "time": "10:00", "activity": "Halq/Taqsir - Exit Ihram", "icon": "scissors" }
        ]
      }
    ]
  },
  "actions": ["save", "regenerate", "share", "export_pdf"]
}
```

---

## 2. Checklist Widget

**Type:** `checklist`

### Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | ✅ | Always `"checklist"` |
| `data.title` | string | ✅ | Checklist title |
| `data.categories` | array | ✅ | Array of category objects |
| `data.categories[].name` | string | ✅ | Category name |
| `data.categories[].icon` | string | ❌ | Category icon |
| `data.categories[].items` | array | ✅ | Array of checklist items |
| `data.categories[].items[].id` | number | ✅ | Unique item ID |
| `data.categories[].items[].text` | string | ✅ | Item description |
| `data.categories[].items[].checked` | boolean | ✅ | Checked state |
| `data.categories[].items[].required` | boolean | ❌ | Is item required |
| `data.progress` | object | ❌ | Progress tracking |
| `data.progress.completed` | number | ❌ | Completed count |
| `data.progress.total` | number | ❌ | Total items |
| `actions` | array | ❌ | Available actions |

### Example Payload

```json
{
  "type": "checklist",
  "data": {
    "title": "Umrah Packing Checklist",
    "categories": [
      {
        "name": "Documents",
        "icon": "document",
        "items": [
          { "id": 1, "text": "Valid passport (6+ months validity)", "checked": false, "required": true },
          { "id": 2, "text": "Visa printout", "checked": false, "required": true },
          { "id": 3, "text": "Hotel booking confirmation", "checked": false, "required": true },
          { "id": 4, "text": "Flight tickets", "checked": false, "required": true },
          { "id": 5, "text": "Passport photos (4x)", "checked": false, "required": false }
        ]
      },
      {
        "name": "Ihram & Clothing",
        "icon": "clothing",
        "items": [
          { "id": 6, "text": "Ihram (2 white sheets) - Men", "checked": false, "required": true },
          { "id": 7, "text": "Ihram belt", "checked": false, "required": false },
          { "id": 8, "text": "Comfortable sandals", "checked": false, "required": true },
          { "id": 9, "text": "Modest loose clothing", "checked": false, "required": true }
        ]
      },
      {
        "name": "Health & Toiletries",
        "icon": "health",
        "items": [
          { "id": 10, "text": "Prescription medications", "checked": false, "required": true },
          { "id": 11, "text": "Unscented soap/shampoo", "checked": false, "required": true },
          { "id": 12, "text": "Sunscreen (unscented)", "checked": false, "required": false },
          { "id": 13, "text": "First aid kit", "checked": false, "required": false }
        ]
      }
    ],
    "progress": { "completed": 0, "total": 13 }
  },
  "actions": ["save", "mark_all", "reset", "share"]
}
```

---

## 3. Budget Widget

**Type:** `budget`

### Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | ✅ | Always `"budget"` |
| `data.title` | string | ✅ | Budget title |
| `data.currency` | string | ✅ | Currency code (USD, SAR, etc.) |
| `data.total` | number | ✅ | Total amount |
| `data.breakdown` | array | ✅ | Cost breakdown |
| `data.breakdown[].category` | string | ✅ | Category name |
| `data.breakdown[].amount` | number | ✅ | Amount |
| `data.breakdown[].icon` | string | ❌ | Category icon |
| `data.breakdown[].percentage` | number | ❌ | Percentage of total |
| `data.breakdown[].notes` | string | ❌ | Additional notes |
| `data.perDay` | number | ❌ | Daily average cost |
| `data.perPerson` | number | ❌ | Per person cost |
| `data.numTravelers` | number | ❌ | Number of travelers |
| `actions` | array | ❌ | Available actions |

### Example Payload

```json
{
  "type": "budget",
  "data": {
    "title": "10-Day Umrah Budget (2 Adults)",
    "currency": "USD",
    "total": 6500,
    "numTravelers": 2,
    "perPerson": 3250,
    "perDay": 650,
    "breakdown": [
      { "category": "Flights", "amount": 2400, "icon": "plane", "percentage": 37, "notes": "Round trip from USA" },
      { "category": "Hotel (Makkah)", "amount": 1800, "icon": "hotel", "percentage": 28, "notes": "7 nights, 5-min walk to Haram" },
      { "category": "Hotel (Madinah)", "amount": 600, "icon": "hotel", "percentage": 9, "notes": "3 nights near Masjid Nabawi" },
      { "category": "Food & Drinks", "amount": 700, "icon": "food", "percentage": 11, "notes": "~$35/day per person" },
      { "category": "Transport", "amount": 400, "icon": "car", "percentage": 6, "notes": "Airport transfers + local" },
      { "category": "Miscellaneous", "amount": 600, "icon": "misc", "percentage": 9, "notes": "Shopping, tips, emergencies" }
    ]
  },
  "actions": ["save", "adjust", "share", "export_pdf"]
}
```

---

## 4. Guide Widget

**Type:** `guide`

### Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | ✅ | Always `"guide"` |
| `data.title` | string | ✅ | Guide title |
| `data.description` | string | ❌ | Brief description |
| `data.sections` | array | ✅ | Guide sections |
| `data.sections[].id` | string | ✅ | Section ID |
| `data.sections[].title` | string | ✅ | Section title |
| `data.sections[].summary` | string | ✅ | Brief summary |
| `data.sections[].content` | string | ✅ | Full content (markdown) |
| `data.sections[].tips` | array | ❌ | Array of tip strings |
| `data.sections[].warnings` | array | ❌ | Array of warning strings |
| `data.sections[].image` | string | ❌ | Image URL |
| `data.currentStep` | number | ❌ | Current step index |
| `data.totalSteps` | number | ❌ | Total steps |
| `actions` | array | ❌ | Available actions |

### Example Payload

```json
{
  "type": "guide",
  "data": {
    "title": "Complete Umrah Guide",
    "description": "Step-by-step guide to performing Umrah",
    "currentStep": 1,
    "totalSteps": 4,
    "sections": [
      {
        "id": "ihram",
        "title": "1. Entering Ihram",
        "summary": "The sacred state of pilgrimage",
        "content": "Ihram is the sacred state a Muslim enters before performing Umrah. For men, it consists of two white unstitched cloths. For women, regular modest clothing.\n\n**Steps:**\n1. Perform ghusl (full body wash)\n2. Wear ihram garments\n3. Pray 2 rakah\n4. Make niyyah (intention)\n5. Recite Talbiyah",
        "tips": [
          "Wear comfortable sandals that don't cover ankles",
          "Use unscented soap before entering ihram"
        ],
        "warnings": [
          "Do not use perfume after entering ihram",
          "Men must not cover their head"
        ]
      },
      {
        "id": "tawaf",
        "title": "2. Performing Tawaf",
        "summary": "Circling the Kaaba seven times",
        "content": "Tawaf is the ritual of walking around the Kaaba seven times in a counter-clockwise direction.\n\n**Steps:**\n1. Start at the Black Stone corner\n2. Keep Kaaba on your left\n3. Complete 7 rounds\n4. Pray 2 rakah at Maqam Ibrahim",
        "tips": [
          "Upper floors are less crowded",
          "Rooftop is air-conditioned"
        ],
        "warnings": [
          "Stay hydrated - it can take 45-90 minutes"
        ]
      }
    ]
  },
  "actions": ["bookmark", "share", "read_aloud", "next_step"]
}
```

---

## 5. Dua Widget

**Type:** `dua`

### Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | ✅ | Always `"dua"` |
| `data.title` | string | ✅ | Dua title |
| `data.occasion` | string | ✅ | When to recite |
| `data.arabic` | string | ✅ | Arabic text |
| `data.transliteration` | string | ✅ | Transliteration |
| `data.translation` | string | ✅ | English translation |
| `data.audioUrl` | string | ❌ | Audio file URL |
| `data.reference` | string | ❌ | Source reference |
| `data.benefits` | string | ❌ | Benefits of dua |
| `data.repetitions` | number | ❌ | Recommended repetitions |
| `actions` | array | ❌ | Available actions |

### Example Payload

```json
{
  "type": "dua",
  "data": {
    "title": "Dua for Tawaf",
    "occasion": "Recite during each round of Tawaf",
    "arabic": "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    "transliteration": "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar",
    "translation": "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
    "audioUrl": "/audio/duas/tawaf-dua.mp3",
    "reference": "Quran 2:201",
    "benefits": "This comprehensive dua asks for goodness in both worlds",
    "repetitions": 7
  },
  "actions": ["play_audio", "bookmark", "share", "copy"]
}
```

---

## 6. Ritual Widget

**Type:** `ritual`

### Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | ✅ | Always `"ritual"` |
| `data.title` | string | ✅ | Ritual title |
| `data.description` | string | ❌ | Brief description |
| `data.steps` | array | ✅ | Ritual steps |
| `data.steps[].step` | number | ✅ | Step number |
| `data.steps[].title` | string | ✅ | Step title |
| `data.steps[].description` | string | ✅ | Step description |
| `data.steps[].image` | string | ❌ | Step image URL |
| `data.steps[].dua` | string | ❌ | Dua for this step |
| `data.steps[].duration` | string | ❌ | Estimated duration |
| `data.totalRounds` | number | ❌ | Total rounds (for Tawaf/Sai) |
| `data.duration` | string | ❌ | Total duration estimate |
| `actions` | array | ❌ | Available actions |

### Example Payload

```json
{
  "type": "ritual",
  "data": {
    "title": "How to Perform Tawaf",
    "description": "Complete guide to circumambulating the Kaaba",
    "totalRounds": 7,
    "duration": "45-90 minutes",
    "steps": [
      {
        "step": 1,
        "title": "Start at Black Stone (Hajar al-Aswad)",
        "description": "Position yourself in line with the Black Stone corner. If possible, touch or kiss it. If crowded, simply point towards it with your right hand and say 'Bismillah, Allahu Akbar'.",
        "image": "/images/rituals/black-stone.jpg",
        "dua": "بِسْمِ اللهِ، اللهُ أَكْبَرُ"
      },
      {
        "step": 2,
        "title": "Walk Counter-Clockwise",
        "description": "Keep the Kaaba on your left side. Walk at a moderate pace. Men should do Raml (brisk walking) in the first 3 rounds.",
        "image": "/images/rituals/tawaf-direction.jpg",
        "duration": "5-10 minutes per round"
      },
      {
        "step": 3,
        "title": "Yemeni Corner",
        "description": "When you reach the Yemeni corner (Rukn al-Yamani), touch it if possible. Recite the dua between Yemeni corner and Black Stone.",
        "dua": "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ"
      },
      {
        "step": 4,
        "title": "Complete 7 Rounds",
        "description": "Each round starts and ends at the Black Stone. After completing 7 rounds, proceed to Maqam Ibrahim.",
        "image": "/images/rituals/tawaf-complete.jpg"
      },
      {
        "step": 5,
        "title": "Pray 2 Rakah at Maqam Ibrahim",
        "description": "After Tawaf, pray 2 rakah behind Maqam Ibrahim if space allows. If crowded, pray anywhere in the mosque.",
        "image": "/images/rituals/maqam-ibrahim.jpg"
      }
    ]
  },
  "actions": ["start_guided_mode", "bookmark", "share", "play_audio"]
}
```

---

## 7. Places Widget

**Type:** `places`

### Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | ✅ | Always `"places"` |
| `data.title` | string | ✅ | Results title |
| `data.category` | string | ✅ | Category: `hotels`, `restaurants`, `landmarks` |
| `data.items` | array | ✅ | Array of place items |
| `data.items[].id` | string | ✅ | Unique place ID |
| `data.items[].name` | string | ✅ | Place name |
| `data.items[].rating` | number | ❌ | Rating (0-5) |
| `data.items[].reviews` | number | ❌ | Number of reviews |
| `data.items[].price` | object | ❌ | Price info |
| `data.items[].price.amount` | number | ✅ | Price amount |
| `data.items[].price.currency` | string | ✅ | Currency code |
| `data.items[].price.per` | string | ❌ | Per unit (night, meal) |
| `data.items[].distance` | string | ❌ | Distance from Haram |
| `data.items[].image` | string | ❌ | Image URL |
| `data.items[].amenities` | array | ❌ | List of amenities |
| `data.items[].coordinates` | object | ❌ | Lat/lng |
| `data.items[].description` | string | ❌ | Brief description |
| `data.filters` | array | ❌ | Available filter options |
| `actions` | array | ❌ | Available actions |

### Example Payload

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
        "reviews": 2450,
        "price": { "amount": 280, "currency": "USD", "per": "night" },
        "distance": "50m from Haram",
        "image": "/images/hotels/hilton-makkah.jpg",
        "amenities": ["wifi", "breakfast", "gym", "haram_view", "wheelchair"],
        "coordinates": { "lat": 21.4225, "lng": 39.8262 },
        "description": "5-star hotel with direct Haram view, ideal for families"
      },
      {
        "id": "hotel-2",
        "name": "Swissotel Makkah",
        "rating": 4.7,
        "reviews": 3200,
        "price": { "amount": 350, "currency": "USD", "per": "night" },
        "distance": "Connected to Haram",
        "image": "/images/hotels/swissotel-makkah.jpg",
        "amenities": ["wifi", "breakfast", "gym", "haram_view", "direct_access"],
        "coordinates": { "lat": 21.4220, "lng": 39.8260 },
        "description": "Premium hotel with direct access to Haram via tunnel"
      },
      {
        "id": "hotel-3",
        "name": "Al Safwah Royale Orchid",
        "rating": 4.2,
        "reviews": 1800,
        "price": { "amount": 150, "currency": "USD", "per": "night" },
        "distance": "200m from Haram",
        "image": "/images/hotels/safwah-makkah.jpg",
        "amenities": ["wifi", "breakfast", "laundry"],
        "coordinates": { "lat": 21.4230, "lng": 39.8270 },
        "description": "Budget-friendly option with excellent service"
      }
    ],
    "filters": ["price", "rating", "distance", "amenities"]
  },
  "actions": ["show_map", "filter", "book", "save", "compare"]
}
```

---

## 8. Crowd Widget

**Type:** `crowd`

### Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | ✅ | Always `"crowd"` |
| `data.title` | string | ✅ | Widget title |
| `data.current` | object | ✅ | Current crowd status |
| `data.current.level` | string | ✅ | Level: `low`, `moderate`, `high`, `very_high` |
| `data.current.percentage` | number | ✅ | Crowd percentage (0-100) |
| `data.current.description` | string | ❌ | Human-readable description |
| `data.current.waitTime` | string | ❌ | Estimated wait time |
| `data.forecast` | array | ✅ | Forecast by prayer time |
| `data.forecast[].time` | string | ✅ | Prayer time name |
| `data.forecast[].level` | string | ✅ | Crowd level |
| `data.forecast[].percentage` | number | ✅ | Crowd percentage |
| `data.bestTimes` | array | ❌ | Recommended times |
| `data.lastUpdated` | string | ❌ | ISO timestamp |
| `actions` | array | ❌ | Available actions |

### Example Payload

```json
{
  "type": "crowd",
  "data": {
    "title": "Masjid al-Haram Crowd Level",
    "current": {
      "level": "moderate",
      "percentage": 55,
      "description": "Moderate crowds - good time for Tawaf",
      "waitTime": "30-45 minutes for Tawaf"
    },
    "forecast": [
      { "time": "Fajr", "level": "low", "percentage": 25 },
      { "time": "Sunrise", "level": "low", "percentage": 20 },
      { "time": "Dhuhr", "level": "high", "percentage": 75 },
      { "time": "Asr", "level": "moderate", "percentage": 55 },
      { "time": "Maghrib", "level": "very_high", "percentage": 90 },
      { "time": "Isha", "level": "high", "percentage": 80 },
      { "time": "Tahajjud", "level": "low", "percentage": 30 }
    ],
    "bestTimes": [
      "After Fajr (5:30-7:00 AM)",
      "Between Dhuhr and Asr (2:00-4:00 PM)",
      "Late night after Isha (11:00 PM - 2:00 AM)"
    ],
    "lastUpdated": "2024-03-15T10:30:00Z"
  },
  "actions": ["set_reminder", "refresh", "share"]
}
```

---

## 9. Navigation Widget

**Type:** `navigation`

### Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | ✅ | Always `"navigation"` |
| `data.title` | string | ✅ | Route title |
| `data.from` | object | ✅ | Starting point |
| `data.from.name` | string | ✅ | Start location name |
| `data.from.coordinates` | object | ❌ | Lat/lng (if known) |
| `data.to` | object | ✅ | Destination |
| `data.to.name` | string | ✅ | Destination name |
| `data.to.coordinates` | object | ❌ | Lat/lng |
| `data.distance` | string | ✅ | Total distance |
| `data.walkingTime` | string | ✅ | Estimated walking time |
| `data.steps` | array | ✅ | Navigation steps |
| `data.steps[].instruction` | string | ✅ | Step instruction |
| `data.steps[].distance` | string | ❌ | Step distance |
| `data.steps[].landmark` | string | ❌ | Nearby landmark |
| `data.gates` | array | ❌ | Nearby Haram gates |
| `data.gates[].name` | string | ✅ | Gate name |
| `data.gates[].number` | number | ❌ | Gate number |
| `data.gates[].accessibility` | boolean | ❌ | Wheelchair accessible |
| `data.alternatives` | array | ❌ | Alternative routes |
| `actions` | array | ❌ | Available actions |

### Example Payload

```json
{
  "type": "navigation",
  "data": {
    "title": "Route to King Fahd Gate",
    "from": {
      "name": "Hilton Suites Makkah",
      "coordinates": { "lat": 21.4230, "lng": 39.8270 }
    },
    "to": {
      "name": "King Fahd Gate (Gate 79)",
      "coordinates": { "lat": 21.4225, "lng": 39.8262 }
    },
    "distance": "450m",
    "walkingTime": "6 minutes",
    "steps": [
      { "instruction": "Exit hotel main entrance", "distance": "0m", "landmark": "Hotel lobby" },
      { "instruction": "Turn right onto Ibrahim Al-Khalil Street", "distance": "50m" },
      { "instruction": "Continue straight past Hilton parking", "distance": "200m", "landmark": "Clock Tower on your right" },
      { "instruction": "Turn left at the pedestrian crossing", "distance": "100m" },
      { "instruction": "King Fahd Gate (79) entrance on your left", "distance": "100m", "landmark": "Large arched entrance" }
    ],
    "gates": [
      { "name": "King Fahd Gate", "number": 79, "accessibility": true },
      { "name": "King Abdul Aziz Gate", "number": 1, "accessibility": true },
      { "name": "Umrah Gate", "number": 45, "accessibility": false }
    ],
    "alternatives": [
      { "route": "Via Ajyad Street", "distance": "550m", "time": "8 minutes", "note": "Less crowded" }
    ]
  },
  "actions": ["open_maps", "share", "save_route", "find_alternative"]
}
```

---

## 10. Tips Widget

**Type:** `tips`

### Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | ✅ | Always `"tips"` |
| `data.title` | string | ✅ | Tips title |
| `data.description` | string | ❌ | Brief intro |
| `data.categories` | array | ✅ | Tip categories |
| `data.categories[].name` | string | ✅ | Category name |
| `data.categories[].icon` | string | ❌ | Category icon |
| `data.categories[].tips` | array | ✅ | Array of tips |
| `data.categories[].tips[].id` | number | ✅ | Unique tip ID |
| `data.categories[].tips[].text` | string | ✅ | Tip text |
| `data.categories[].tips[].priority` | string | ❌ | Priority: `high`, `medium`, `low` |
| `data.categories[].tips[].source` | string | ❌ | Tip source |
| `actions` | array | ❌ | Available actions |

### Example Payload

```json
{
  "type": "tips",
  "data": {
    "title": "First-Timer Essential Tips",
    "description": "Top advice from experienced pilgrims for your first Umrah",
    "categories": [
      {
        "name": "Before You Go",
        "icon": "preparation",
        "tips": [
          { "id": 1, "text": "Book hotel as close to your preferred Haram gate as possible - you'll thank yourself later", "priority": "high" },
          { "id": 2, "text": "Download offline maps of Makkah - mobile data can be unreliable inside Haram", "priority": "high" },
          { "id": 3, "text": "Break in your sandals before the trip to avoid blisters", "priority": "medium" },
          { "id": 4, "text": "Learn basic Arabic phrases for directions and shopping", "priority": "low" }
        ]
      },
      {
        "name": "At Haram",
        "icon": "mosque",
        "tips": [
          { "id": 5, "text": "Perform Tawaf on upper floors (2nd or rooftop) for less crowds", "priority": "high" },
          { "id": 6, "text": "Rooftop is air-conditioned and perfect for hot days", "priority": "medium" },
          { "id": 7, "text": "Use Gate 79 (King Fahd) for wheelchair access", "priority": "medium" },
          { "id": 8, "text": "Zamzam water stations are everywhere - stay hydrated", "priority": "high" }
        ]
      },
      {
        "name": "Money & Shopping",
        "icon": "money",
        "tips": [
          { "id": 9, "text": "Exchange money at banks, not hotel counters - better rates", "priority": "medium" },
          { "id": 10, "text": "Negotiate at local shops - first price is rarely final", "priority": "low" },
          { "id": 11, "text": "Bring a small bag for shopping - souvenirs add up quickly", "priority": "low" }
        ]
      }
    ]
  },
  "actions": ["save_all", "share", "ask_more"]
}
```

---

## Quick Reference

### Widget Type Summary

```
itinerary  → Trip planning, schedules
checklist  → Visa docs, packing lists
budget     → Cost breakdowns
guide      → Umrah/Hajj step guides
dua        → Prayers with Arabic/translation
ritual     → Visual ritual steps
places     → Hotels, restaurants, POIs
crowd      → Real-time crowd levels
navigation → Routes and directions
tips       → Categorized advice
```

### Common Actions

| Action | Description |
|--------|-------------|
| `save` | Save to user profile |
| `share` | Share via native share |
| `bookmark` | Bookmark for later |
| `export_pdf` | Export as PDF |
| `play_audio` | Play audio file |
| `open_maps` | Open in maps app |
| `refresh` | Refresh data |
| `regenerate` | Generate new content |
