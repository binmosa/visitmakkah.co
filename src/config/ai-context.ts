/**
 * AI Context Configuration
 *
 * Defines context hints for each navigation action.
 * These are HINTS, not constraints - the AI can query any vector store
 * and render any widget based on the user's actual question.
 */

import type { WidgetType } from '@/types/widgets'

export interface ContextConfig {
  page: 'prepare' | 'learn' | 'explore' | 'blog' | 'general'
  action: string
  actionLabel: string
  vectorStoreId: string
  primaryWidget: WidgetType
  systemPromptAddition: string
  suggestedPrompts: string[]
}

/**
 * Context configurations for each navigation action
 */
export const contextConfigs: Record<string, ContextConfig> = {
  // === PREPARE ===
  'build-itinerary': {
    page: 'prepare',
    action: 'build-itinerary',
    actionLabel: 'Build My Itinerary',
    vectorStoreId: process.env.VECTOR_STORE_ITINERARY || 'vs_itinerary',
    primaryWidget: 'itinerary',
    systemPromptAddition: `
      Focus on creating personalized travel itineraries for Umrah or Hajj.
      Consider the user's travel dates, group size, and preferences.
      Include practical timing, transportation, and accommodation suggestions.
    `,
    suggestedPrompts: [
      'Create a 7-day Umrah itinerary for me',
      'Plan my Hajj journey for a family of 4',
      'What should I do on my first day in Makkah?',
      'Create a budget-friendly Umrah plan',
    ],
  },
  'get-visa': {
    page: 'prepare',
    action: 'get-visa',
    actionLabel: 'Visa Guide',
    vectorStoreId: process.env.VECTOR_STORE_VISA || 'vs_visa',
    primaryWidget: 'guide',
    systemPromptAddition: `
      Help users understand visa requirements for Saudi Arabia.
      Provide country-specific guidance when the user's country is known.
      Include document checklists and processing time estimates.
    `,
    suggestedPrompts: [
      'What documents do I need for an Umrah visa?',
      'How long does visa processing take?',
      'Can I get a visa on arrival?',
      'What are the visa requirements for my country?',
    ],
  },
  'pack-my-bag': {
    page: 'prepare',
    action: 'pack-my-bag',
    actionLabel: 'Pack My Bag',
    vectorStoreId: process.env.VECTOR_STORE_PACKING || 'vs_packing',
    primaryWidget: 'checklist',
    systemPromptAddition: `
      Help users pack appropriately for their pilgrimage.
      Consider weather, gender-specific items, and journey type (Umrah/Hajj).
      Provide interactive checklists they can track.
    `,
    suggestedPrompts: [
      'What should I pack for Umrah?',
      'Create a packing checklist for Hajj',
      'What clothes are appropriate for women?',
      'What essential items should I not forget?',
    ],
  },
  'calculate-budget': {
    page: 'prepare',
    action: 'calculate-budget',
    actionLabel: 'Budget Calculator',
    vectorStoreId: process.env.VECTOR_STORE_ITINERARY || 'vs_itinerary',
    primaryWidget: 'budget',
    systemPromptAddition: `
      Help users estimate and plan their pilgrimage budget.
      Include flights, accommodation, food, transportation, and extras.
      Provide budget-saving tips when appropriate.
    `,
    suggestedPrompts: [
      'How much does Umrah cost?',
      'Create a budget breakdown for my trip',
      'What are the cheapest months to go?',
      'How can I save money on my pilgrimage?',
    ],
  },

  // === LEARN ===
  'umrah-guide': {
    page: 'learn',
    action: 'umrah-guide',
    actionLabel: 'Umrah Guide',
    vectorStoreId: process.env.VECTOR_STORE_UMRAH || 'vs_umrah',
    primaryWidget: 'ritual',
    systemPromptAddition: `
      Provide comprehensive guidance on Umrah rituals and practices.
      Explain each step clearly with duas and their meanings.
      Be sensitive to different schools of thought (madhabs).
    `,
    suggestedPrompts: [
      'Explain the steps of Umrah',
      'What duas should I recite during Tawaf?',
      'How do I perform Sa\'i correctly?',
      'What are common mistakes to avoid?',
    ],
  },
  'hajj-guide': {
    page: 'learn',
    action: 'hajj-guide',
    actionLabel: 'Hajj Guide',
    vectorStoreId: process.env.VECTOR_STORE_HAJJ || 'vs_hajj',
    primaryWidget: 'ritual',
    systemPromptAddition: `
      Provide comprehensive guidance on Hajj rituals and practices.
      Cover all five days of Hajj with detailed explanations.
      Include both Fard and Sunnah actions.
    `,
    suggestedPrompts: [
      'Explain the days of Hajj',
      'What is the difference between Hajj types?',
      'What happens on the Day of Arafah?',
      'How do I perform Rami correctly?',
    ],
  },
  'step-by-step': {
    page: 'learn',
    action: 'step-by-step',
    actionLabel: 'Step by Step',
    vectorStoreId: process.env.VECTOR_STORE_UMRAH || 'vs_umrah',
    primaryWidget: 'guide',
    systemPromptAddition: `
      Provide clear, step-by-step instructions for rituals.
      Use numbered steps with visual guidance when possible.
      Include timing and location details.
    `,
    suggestedPrompts: [
      'Walk me through Tawaf step by step',
      'How do I enter Ihram?',
      'Guide me through Sa\'i',
      'What is the sequence of Hajj rituals?',
    ],
  },
  'duas-prayers': {
    page: 'learn',
    action: 'duas-prayers',
    actionLabel: 'Duas & Prayers',
    vectorStoreId: process.env.VECTOR_STORE_UMRAH || 'vs_umrah',
    primaryWidget: 'dua',
    systemPromptAddition: `
      Provide duas and prayers with Arabic text, transliteration, and translation.
      Include context for when each dua is recited.
      Offer both essential and recommended duas.
    `,
    suggestedPrompts: [
      'What dua should I recite when seeing the Kaaba?',
      'Show me the Tawaf duas',
      'What prayers are recommended at Multazam?',
      'Teach me the dua for Safa and Marwa',
    ],
  },

  // === EXPLORE ===
  'find-hotels': {
    page: 'explore',
    action: 'find-hotels',
    actionLabel: 'Find Hotels',
    vectorStoreId: process.env.VECTOR_STORE_HOTELS || 'vs_hotels',
    primaryWidget: 'places',
    systemPromptAddition: `
      Help users find suitable accommodation in Makkah and Madinah.
      Consider proximity to Haram, budget, and amenities.
      Provide honest recommendations based on user preferences.
    `,
    suggestedPrompts: [
      'Recommend hotels near Haram',
      'What are budget-friendly options?',
      'Which hotels are best for families?',
      'How far are hotels from the mosque?',
    ],
  },
  'find-food': {
    page: 'explore',
    action: 'find-food',
    actionLabel: 'Find Food',
    vectorStoreId: process.env.VECTOR_STORE_FOOD || 'vs_food',
    primaryWidget: 'places',
    systemPromptAddition: `
      Help users find restaurants and food options.
      All food in Saudi Arabia is halal.
      Consider budget, cuisine preferences, and location.
    `,
    suggestedPrompts: [
      'Where can I find good food near Haram?',
      'Recommend budget restaurants',
      'What local dishes should I try?',
      'Where can I find international cuisine?',
    ],
  },
  'navigate': {
    page: 'explore',
    action: 'navigate',
    actionLabel: 'Navigate',
    vectorStoreId: process.env.VECTOR_STORE_TIPS || 'vs_tips',
    primaryWidget: 'navigation',
    systemPromptAddition: `
      Help users navigate around Makkah and Madinah.
      Provide directions, transportation options, and landmarks.
      Include walking routes and public transport guidance.
    `,
    suggestedPrompts: [
      'How do I get from hotel to Haram?',
      'What transportation options are available?',
      'Guide me to Jabal al-Nour',
      'How do I get to Madinah from Makkah?',
    ],
  },
  'local-tips': {
    page: 'explore',
    action: 'local-tips',
    actionLabel: 'Local Tips',
    vectorStoreId: process.env.VECTOR_STORE_TIPS || 'vs_tips',
    primaryWidget: 'tips',
    systemPromptAddition: `
      Share practical tips and local knowledge.
      Include first-timer advice, women-specific guidance, and insider tips.
      Be culturally sensitive and accurate.
    `,
    suggestedPrompts: [
      'Tips for first-time pilgrims',
      'What should women know?',
      'Local customs I should be aware of',
      'Money-saving tips for my trip',
    ],
  },

  // === DEFAULT/GENERAL ===
  'general': {
    page: 'general',
    action: 'general',
    actionLabel: 'AI Assistant',
    vectorStoreId: process.env.VECTOR_STORE_UMRAH || 'vs_umrah',
    primaryWidget: 'guide',
    systemPromptAddition: `
      Provide helpful guidance on any pilgrimage-related topic.
      Route to appropriate knowledge bases based on the question.
    `,
    suggestedPrompts: [
      'Help me plan my Umrah',
      'What do I need to know as a first-timer?',
      'Explain the significance of Hajj',
      'What should I prepare before traveling?',
    ],
  },
}

/**
 * All available vector stores
 * The AI can query any of these based on the user's question
 */
export const vectorStores = {
  itinerary: process.env.VECTOR_STORE_ITINERARY || 'vs_itinerary',
  visa: process.env.VECTOR_STORE_VISA || 'vs_visa',
  packing: process.env.VECTOR_STORE_PACKING || 'vs_packing',
  umrah: process.env.VECTOR_STORE_UMRAH || 'vs_umrah',
  hajj: process.env.VECTOR_STORE_HAJJ || 'vs_hajj',
  hotels: process.env.VECTOR_STORE_HOTELS || 'vs_hotels',
  food: process.env.VECTOR_STORE_FOOD || 'vs_food',
  tips: process.env.VECTOR_STORE_TIPS || 'vs_tips',
} as const

/**
 * Get context config by action, with fallback to general
 */
export function getContextConfig(action: string): ContextConfig {
  return contextConfigs[action] || contextConfigs['general']
}

/**
 * Get all vector store IDs as an array
 */
export function getAllVectorStoreIds(): string[] {
  return Object.values(vectorStores)
}
