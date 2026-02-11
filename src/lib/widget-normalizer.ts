/**
 * Widget Data Normalizer
 *
 * Transforms raw LLM output into consistent widget data structures.
 * This ensures widgets receive data in the expected format regardless
 * of how the LLM structures its response.
 */

import type { WidgetType } from '@/types/widgets'

/**
 * Generate a unique ID for array items
 */
function generateId(prefix: string, index: number): string {
  return `${prefix}-${index}-${Date.now()}`
}

/**
 * Normalize guide widget data
 */
function normalizeGuide(data: Record<string, unknown>): Record<string, unknown> {
  const steps = Array.isArray(data.steps) ? data.steps : []

  return {
    title: data.title || 'Guide',
    description: data.description || '',
    category: data.category || 'general',
    difficulty: data.difficulty || 'beginner',
    duration: data.duration || data.estimatedTime || '',
    steps: steps.map((step: Record<string, unknown>, index: number) => ({
      id: step.id || generateId('step', index),
      number: step.number ?? step.stepNumber ?? index + 1,
      title: step.title || `Step ${index + 1}`,
      description: step.description || step.content || '',
      duration: step.duration || '',
      tips: Array.isArray(step.tips) ? step.tips : [],
      warnings: Array.isArray(step.warnings) ? step.warnings : [],
    })),
    prerequisites: Array.isArray(data.prerequisites) ? data.prerequisites : [],
    tips: Array.isArray(data.tips) ? data.tips : [],
  }
}

/**
 * Normalize tips widget data
 */
function normalizeTips(data: Record<string, unknown>): Record<string, unknown> {
  const tips = Array.isArray(data.tips) ? data.tips : []

  return {
    title: data.title || 'Tips',
    description: data.description || '',
    audience: data.audience || 'all',
    tips: tips.map((tip: Record<string, unknown>, index: number) => ({
      id: tip.id || generateId('tip', index),
      title: tip.title || `Tip ${index + 1}`,
      content: tip.content || tip.description || tip.text || '',
      category: tip.category || 'general',
      icon: tip.icon || '💡',
      priority: tip.priority || 'helpful',
    })),
    categories: Array.isArray(data.categories) ? data.categories : [],
  }
}

/**
 * Normalize checklist widget data
 */
function normalizeChecklist(data: Record<string, unknown>): Record<string, unknown> {
  const categories = Array.isArray(data.categories) ? data.categories : []

  return {
    title: data.title || 'Checklist',
    description: data.description || '',
    categories: categories.map((cat: Record<string, unknown>, catIndex: number) => ({
      id: cat.id || generateId('cat', catIndex),
      name: cat.name || cat.title || `Category ${catIndex + 1}`,
      icon: cat.icon || '📋',
      items: Array.isArray(cat.items) ? cat.items.map((item: Record<string, unknown>, itemIndex: number) => ({
        id: item.id || generateId('item', catIndex * 100 + itemIndex),
        text: item.text || item.title || item.name || '',
        checked: item.checked ?? false,
        priority: item.priority || item.required ? 'essential' : 'recommended',
        notes: item.notes || item.description || '',
      })) : [],
    })),
    totalItems: 0, // Will be calculated
    checkedItems: 0,
  }
}

/**
 * Normalize itinerary widget data
 */
function normalizeItinerary(data: Record<string, unknown>): Record<string, unknown> {
  const days = Array.isArray(data.days) ? data.days : []

  return {
    title: data.title || 'Itinerary',
    summary: data.summary || data.description || '',
    duration: data.duration || {
      nights: data.totalDays ? (data.totalDays as number) - 1 : days.length - 1,
      days: data.totalDays || days.length,
    },
    journeyType: data.journeyType || 'umrah',
    days: days.map((day: Record<string, unknown>, dayIndex: number) => ({
      id: day.id || generateId('day', dayIndex),
      day: day.day ?? day.dayNumber ?? dayIndex + 1,
      title: day.title || `Day ${dayIndex + 1}`,
      date: day.date || '',
      location: day.location || '',
      summary: day.summary || '',
      activities: Array.isArray(day.activities) ? day.activities.map((act: Record<string, unknown>, actIndex: number) => ({
        id: act.id || generateId('act', dayIndex * 100 + actIndex),
        time: act.time || '',
        title: act.title || act.name || '',
        description: act.description || '',
        location: act.location || '',
        type: act.type || 'visit',
        tips: Array.isArray(act.tips) ? act.tips : [],
      })) : [],
    })),
    tips: Array.isArray(data.tips) ? data.tips : [],
    estimatedBudget: data.estimatedBudget || data.budget || null,
  }
}

/**
 * Normalize budget widget data
 */
function normalizeBudget(data: Record<string, unknown>): Record<string, unknown> {
  const breakdown = Array.isArray(data.breakdown) ? data.breakdown : []

  return {
    title: data.title || 'Budget',
    currency: data.currency || 'USD',
    total: data.total || breakdown.reduce((sum: number, item: Record<string, unknown>) =>
      sum + (typeof item.amount === 'number' ? item.amount : 0), 0),
    breakdown: breakdown.map((item: Record<string, unknown>, index: number) => ({
      id: item.id || generateId('budget', index),
      category: item.category || item.name || `Item ${index + 1}`,
      description: item.description || '',
      amount: typeof item.amount === 'number' ? item.amount : 0,
      currency: item.currency || data.currency || 'USD',
      isOptional: item.isOptional ?? false,
      notes: item.notes || '',
    })),
    savingsTips: Array.isArray(data.savingsTips) ? data.savingsTips : [],
    notes: data.notes || '',
  }
}

/**
 * Normalize dua widget data
 */
function normalizeDua(data: Record<string, unknown>): Record<string, unknown> {
  return {
    id: data.id || generateId('dua', 0),
    title: data.title || 'Dua',
    arabic: data.arabic || '',
    transliteration: data.transliteration || '',
    translation: data.translation || '',
    context: data.context || data.occasion || data.notes || '',
    source: data.source || '',
    benefits: Array.isArray(data.benefits) ? data.benefits : [],
    whenToRecite: Array.isArray(data.whenToRecite) ? data.whenToRecite : [],
  }
}

/**
 * Normalize ritual widget data
 */
function normalizeRitual(data: Record<string, unknown>): Record<string, unknown> {
  const steps = Array.isArray(data.steps) ? data.steps : []

  return {
    title: data.title || data.ritualName || 'Ritual',
    arabicTitle: data.arabicTitle || '',
    description: data.description || '',
    type: data.type || 'umrah',
    isFard: data.isFard ?? true,
    steps: steps.map((step: Record<string, unknown>, index: number) => ({
      id: step.id || generateId('rstep', index),
      number: step.number ?? step.stepNumber ?? index + 1,
      title: step.title || `Step ${index + 1}`,
      arabicTitle: step.arabicTitle || '',
      description: step.description || step.content || '',
      dua: step.dua ? {
        arabic: (step.dua as Record<string, unknown>).arabic || '',
        transliteration: (step.dua as Record<string, unknown>).transliteration || '',
        translation: (step.dua as Record<string, unknown>).translation || '',
      } : null,
      location: step.location || '',
      duration: step.duration || '',
      tips: Array.isArray(step.tips) ? step.tips : [],
      commonMistakes: Array.isArray(step.commonMistakes) ? step.commonMistakes : [],
    })),
    prerequisites: Array.isArray(data.prerequisites) ? data.prerequisites : [],
    tips: Array.isArray(data.tips) ? data.tips : [],
    commonMistakes: Array.isArray(data.commonMistakes) ? data.commonMistakes : [],
  }
}

/**
 * Normalize places widget data
 */
function normalizePlaces(data: Record<string, unknown>): Record<string, unknown> {
  const places = Array.isArray(data.places) ? data.places : []

  return {
    title: data.title || 'Places',
    description: data.description || '',
    places: places.map((place: Record<string, unknown>, index: number) => ({
      id: place.id || generateId('place', index),
      name: place.name || `Place ${index + 1}`,
      arabicName: place.arabicName || '',
      description: place.description || '',
      category: place.category || 'landmark',
      location: {
        area: (place.location as Record<string, unknown>)?.area || place.area || '',
        distanceToHaram: (place.location as Record<string, unknown>)?.distanceToHaram || place.distanceToHaram || '',
        coordinates: (place.location as Record<string, unknown>)?.coordinates || null,
      },
      rating: typeof place.rating === 'number' ? place.rating : null,
      priceRange: place.priceRange || null,
      amenities: Array.isArray(place.amenities) ? place.amenities : [],
      tips: Array.isArray(place.tips) ? place.tips : [],
      contact: place.contact || null,
    })),
  }
}

/**
 * Normalize navigation widget data
 */
function normalizeNavigation(data: Record<string, unknown>): Record<string, unknown> {
  const steps = Array.isArray(data.steps) ? data.steps : []

  return {
    title: data.title || 'Navigation',
    from: data.from || '',
    to: data.to || '',
    totalDistance: data.totalDistance || '',
    totalDuration: data.totalDuration || '',
    mode: data.mode || 'walk',
    steps: steps.map((step: Record<string, unknown>, index: number) => ({
      id: step.id || generateId('nav', index),
      number: step.number ?? index + 1,
      instruction: step.instruction || step.description || '',
      distance: step.distance || '',
      duration: step.duration || '',
      landmark: step.landmark || '',
      mode: step.mode || 'walk',
    })),
    alternatives: Array.isArray(data.alternatives) ? data.alternatives : [],
    tips: Array.isArray(data.tips) ? data.tips : [],
  }
}

/**
 * Main normalizer function
 * Takes raw widget data and normalizes it based on widget type
 */
export function normalizeWidgetData(type: WidgetType, rawData: unknown): Record<string, unknown> {
  // Ensure we have an object to work with
  const data = (typeof rawData === 'object' && rawData !== null)
    ? rawData as Record<string, unknown>
    : {}

  switch (type) {
    case 'guide':
      return normalizeGuide(data)
    case 'tips':
      return normalizeTips(data)
    case 'checklist':
      return normalizeChecklist(data)
    case 'itinerary':
      return normalizeItinerary(data)
    case 'budget':
      return normalizeBudget(data)
    case 'dua':
      return normalizeDua(data)
    case 'ritual':
      return normalizeRitual(data)
    case 'places':
      return normalizePlaces(data)
    case 'navigation':
      return normalizeNavigation(data)
    default:
      console.warn(`[widget-normalizer] Unknown widget type: ${type}`)
      return data
  }
}

/**
 * Validate that normalized data has minimum required fields
 */
export function validateWidgetData(type: WidgetType, data: Record<string, unknown>): boolean {
  switch (type) {
    case 'guide':
      return !!(data.title && Array.isArray(data.steps))
    case 'tips':
      return !!(data.title && Array.isArray(data.tips))
    case 'checklist':
      return !!(data.title && Array.isArray(data.categories))
    case 'itinerary':
      return !!(data.title && Array.isArray(data.days))
    case 'budget':
      return !!(data.title && Array.isArray(data.breakdown))
    case 'dua':
      return !!(data.title && data.arabic)
    case 'ritual':
      return !!(data.title && Array.isArray(data.steps))
    case 'places':
      return !!(data.title && Array.isArray(data.places))
    case 'navigation':
      return !!(data.from && data.to)
    default:
      return false
  }
}
