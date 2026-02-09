/**
 * Widget Type Definitions
 *
 * Based on widgets_contract.md
 * These define the structure of data rendered by each widget component.
 */

// All available widget types
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

// ============================================
// ITINERARY WIDGET
// ============================================
export interface ItineraryActivity {
  time: string
  title: string
  description: string
  location?: string
  tips?: string[]
  type?: 'ritual' | 'travel' | 'rest' | 'meal' | 'visit' | 'free'
}

export interface ItineraryDay {
  day: number
  title: string
  date?: string
  location: string
  summary?: string
  activities: ItineraryActivity[]
}

export interface ItineraryWidgetData {
  title: string
  summary: string
  duration: {
    nights: number
    days: number
  }
  journeyType: 'umrah' | 'hajj' | 'both'
  days: ItineraryDay[]
  tips?: string[]
  estimatedBudget?: {
    currency: string
    min: number
    max: number
  }
}

// ============================================
// CHECKLIST WIDGET
// ============================================
export interface ChecklistItem {
  id: string
  text: string
  checked: boolean
  category?: string
  priority?: 'essential' | 'recommended' | 'optional'
  notes?: string
}

export interface ChecklistCategory {
  name: string
  icon?: string
  items: ChecklistItem[]
}

export interface ChecklistWidgetData {
  title: string
  description?: string
  categories: ChecklistCategory[]
  totalItems: number
  checkedItems: number
}

// ============================================
// BUDGET WIDGET
// ============================================
export interface BudgetItem {
  category: string
  description: string
  amount: number
  currency: string
  isOptional?: boolean
  notes?: string
}

export interface BudgetWidgetData {
  title: string
  currency: string
  total: number
  breakdown: BudgetItem[]
  savingsTips?: string[]
  notes?: string
}

// ============================================
// GUIDE WIDGET
// ============================================
export interface GuideStep {
  number: number
  title: string
  description: string
  duration?: string
  tips?: string[]
  warnings?: string[]
  image?: string
}

export interface GuideWidgetData {
  title: string
  description: string
  category: string
  difficulty?: 'easy' | 'moderate' | 'challenging'
  duration?: string
  steps: GuideStep[]
  prerequisites?: string[]
  tips?: string[]
}

// ============================================
// DUA WIDGET
// ============================================
export interface DuaWidgetData {
  title: string
  arabic: string
  transliteration: string
  translation: string
  context: string
  source?: string
  benefits?: string[]
  whenToRecite?: string[]
  audioUrl?: string
}

// ============================================
// RITUAL WIDGET
// ============================================
export interface RitualStep {
  number: number
  title: string
  arabicTitle?: string
  description: string
  dua?: {
    arabic: string
    transliteration: string
    translation: string
  }
  location?: string
  duration?: string
  tips?: string[]
  commonMistakes?: string[]
}

export interface RitualWidgetData {
  title: string
  arabicTitle?: string
  description: string
  type: 'umrah' | 'hajj' | 'both'
  isFard: boolean
  steps: RitualStep[]
  prerequisites?: string[]
  tips?: string[]
  commonMistakes?: string[]
}

// ============================================
// PLACES WIDGET
// ============================================
export interface PlaceItem {
  name: string
  arabicName?: string
  description: string
  category: 'hotel' | 'restaurant' | 'landmark' | 'service' | 'transport'
  location: {
    area: string
    distanceToHaram?: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  rating?: number
  priceRange?: '$' | '$$' | '$$$' | '$$$$'
  amenities?: string[]
  tips?: string[]
  images?: string[]
  contact?: {
    phone?: string
    website?: string
  }
}

export interface PlacesWidgetData {
  title: string
  description?: string
  places: PlaceItem[]
  filters?: {
    categories: string[]
    priceRanges: string[]
    areas: string[]
  }
}

// ============================================
// CROWD WIDGET
// ============================================
export interface CrowdPeriod {
  time: string
  level: 'low' | 'moderate' | 'high' | 'very-high'
  description?: string
  recommendation?: string
}

export interface CrowdWidgetData {
  title: string
  location: string
  currentLevel?: 'low' | 'moderate' | 'high' | 'very-high'
  lastUpdated?: string
  forecast: CrowdPeriod[]
  bestTimes: string[]
  tips: string[]
  seasonalNote?: string
}

// ============================================
// NAVIGATION WIDGET
// ============================================
export interface NavigationStep {
  number: number
  instruction: string
  distance?: string
  duration?: string
  landmark?: string
  mode?: 'walk' | 'drive' | 'bus' | 'train'
}

export interface NavigationWidgetData {
  title: string
  from: string
  to: string
  totalDistance: string
  totalDuration: string
  mode: 'walk' | 'drive' | 'public' | 'mixed'
  steps: NavigationStep[]
  alternatives?: {
    mode: string
    duration: string
    cost?: string
  }[]
  tips?: string[]
}

// ============================================
// TIPS WIDGET
// ============================================
export interface TipItem {
  title: string
  content: string
  category: string
  icon?: string
  priority?: 'must-know' | 'helpful' | 'bonus'
}

export interface TipsWidgetData {
  title: string
  description?: string
  tips: TipItem[]
  categories?: string[]
  audience?: 'all' | 'first-timers' | 'women' | 'elderly' | 'families'
}

// ============================================
// UNION TYPE FOR ALL WIDGET DATA
// ============================================
export type WidgetData =
  | { type: 'itinerary'; data: ItineraryWidgetData }
  | { type: 'checklist'; data: ChecklistWidgetData }
  | { type: 'budget'; data: BudgetWidgetData }
  | { type: 'guide'; data: GuideWidgetData }
  | { type: 'dua'; data: DuaWidgetData }
  | { type: 'ritual'; data: RitualWidgetData }
  | { type: 'places'; data: PlacesWidgetData }
  | { type: 'crowd'; data: CrowdWidgetData }
  | { type: 'navigation'; data: NavigationWidgetData }
  | { type: 'tips'; data: TipsWidgetData }

// Type guard functions
export function isItineraryWidget(data: WidgetData): data is { type: 'itinerary'; data: ItineraryWidgetData } {
  return data.type === 'itinerary'
}

export function isChecklistWidget(data: WidgetData): data is { type: 'checklist'; data: ChecklistWidgetData } {
  return data.type === 'checklist'
}

export function isBudgetWidget(data: WidgetData): data is { type: 'budget'; data: BudgetWidgetData } {
  return data.type === 'budget'
}

export function isGuideWidget(data: WidgetData): data is { type: 'guide'; data: GuideWidgetData } {
  return data.type === 'guide'
}

export function isDuaWidget(data: WidgetData): data is { type: 'dua'; data: DuaWidgetData } {
  return data.type === 'dua'
}

export function isRitualWidget(data: WidgetData): data is { type: 'ritual'; data: RitualWidgetData } {
  return data.type === 'ritual'
}

export function isPlacesWidget(data: WidgetData): data is { type: 'places'; data: PlacesWidgetData } {
  return data.type === 'places'
}

export function isCrowdWidget(data: WidgetData): data is { type: 'crowd'; data: CrowdWidgetData } {
  return data.type === 'crowd'
}

export function isNavigationWidget(data: WidgetData): data is { type: 'navigation'; data: NavigationWidgetData } {
  return data.type === 'navigation'
}

export function isTipsWidget(data: WidgetData): data is { type: 'tips'; data: TipsWidgetData } {
  return data.type === 'tips'
}
