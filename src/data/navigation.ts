// Navigation Structure - AI-First with Journey Stages
// Optimized for action-driven, context-aware pilgrimage platform

import { UserProfile } from '@/context/UserJourneyContext'

export type JourneyStage = 'planning' | 'booked' | 'in_makkah' | 'returned'

// Conditional display based on user profile
export type ShowIfCondition = {
  isFirstTime?: boolean
  gender?: 'male' | 'female'
  countries?: string[]  // ISO country codes
  journeyStages?: JourneyStage[]
  journeyType?: ('hajj' | 'umrah' | 'both')[]  // Filter by trip type
}

export type TNavigationItem = {
  id: string
  href: string
  name: string
  description?: string
  type?: 'dropdown' | 'mega-menu'
  isNew?: boolean
  children?: TNavigationItem[]
  icon?: string
  // Context-awareness: which journey stages this item is most relevant for
  relevantStages?: JourneyStage[]
  // Priority for display (higher = more prominent)
  priority?: number
  // Action verb for AI suggestions
  actionVerb?: string
  // Conditional display based on user profile
  showIf?: ShowIfCondition
  // Badge to show (e.g., "First-Timer")
  badge?: string
}

// Main navigation structure - 4 core categories
export async function getNavigation(): Promise<TNavigationItem[]> {
  return [
    {
      id: 'prepare',
      href: '/prepare',
      name: 'Prepare',
      description: 'Plan your journey before you go',
      type: 'dropdown',
      icon: 'FaClipboardList',
      relevantStages: ['planning', 'booked'],
      priority: 1,
      actionVerb: 'prepare for',
      children: [
        {
          id: 'prepare-itinerary',
          href: '/prepare/build-itinerary',
          name: 'Build My Itinerary',
          description: 'AI-powered trip planner',
          icon: 'FaRoute',
          actionVerb: 'create',
        },
        {
          id: 'prepare-visa',
          href: '/prepare/get-visa',
          name: 'Get My Visa',
          description: 'Step-by-step visa guide',
          icon: 'FaPassport',
          actionVerb: 'apply for',
        },
        {
          id: 'prepare-packing',
          href: '/prepare/pack-my-bag',
          name: 'Pack My Bag',
          description: 'Smart packing checklist',
          icon: 'FaSuitcase',
          actionVerb: 'pack',
        },
        {
          id: 'prepare-budget',
          href: '/prepare/calculate-budget',
          name: 'Calculate Budget',
          description: 'Estimate your costs',
          icon: 'FaCalculator',
          actionVerb: 'calculate',
        },
      ],
    },
    {
      id: 'learn',
      href: '/learn',
      name: 'Learn',
      description: 'Rituals, guides & spiritual preparation',
      type: 'dropdown',
      icon: 'FaBookOpen',
      relevantStages: ['planning', 'booked', 'in_makkah'],
      priority: 2,
      actionVerb: 'learn about',
      children: [
        {
          id: 'learn-umrah',
          href: '/learn/umrah-guide',
          name: 'Umrah Guide',
          description: 'Complete Umrah walkthrough',
          icon: 'FaKaaba',
          actionVerb: 'perform',
          showIf: { journeyType: ['umrah', 'both'] },
        },
        {
          id: 'learn-hajj',
          href: '/learn/hajj-guide',
          name: 'Hajj Guide',
          description: 'Day-by-day Hajj guide',
          icon: 'FaMosque',
          actionVerb: 'perform',
          showIf: { journeyType: ['hajj', 'both'] },
        },
        {
          id: 'learn-rituals',
          href: '/learn/step-by-step',
          name: 'Step-by-Step Rituals',
          description: 'Tawaf, Sai, and more',
          icon: 'FaListOl',
          actionVerb: 'follow',
        },
        {
          id: 'learn-duas',
          href: '/learn/duas-prayers',
          name: 'Duas & Prayers',
          description: 'Essential supplications',
          icon: 'FaPrayingHands',
          actionVerb: 'recite',
        },
      ],
    },
    {
      id: 'explore',
      href: '/explore',
      name: 'Explore',
      description: 'Find places & navigate Makkah',
      type: 'dropdown',
      icon: 'FaMapMarkedAlt',
      relevantStages: ['booked', 'in_makkah'],
      priority: 3,
      actionVerb: 'find',
      children: [
        {
          id: 'explore-hotels',
          href: '/explore/find-hotels',
          name: 'Find Hotels',
          description: 'By gate, price & amenities',
          icon: 'FaHotel',
          actionVerb: 'book',
        },
        {
          id: 'explore-food',
          href: '/explore/find-food',
          name: 'Find Food',
          description: 'Restaurants & cafes nearby',
          icon: 'FaUtensils',
          actionVerb: 'eat at',
        },
        {
          id: 'explore-navigate',
          href: '/explore/navigate',
          name: 'Navigate to Haram',
          description: 'Gates, routes & shortcuts',
          icon: 'FaCompass',
          actionVerb: 'navigate to',
        },
        {
          id: 'explore-local-tips',
          href: '/explore/local-tips',
          name: 'Local Tips',
          description: 'Insider knowledge & advice',
          icon: 'FaLightbulb',
          actionVerb: 'discover',
        },
      ],
    },
    {
      id: 'saved',
      href: '/saved',
      name: 'Saved',
      description: 'Your saved guides & history',
      icon: 'FaFolderOpen',
      relevantStages: ['planning', 'booked', 'in_makkah', 'returned'],
      priority: 4,
      actionVerb: 'access',
    },
    {
      id: 'blog',
      href: '/blog',
      name: 'Blog',
      description: 'Articles, stories & guides',
      icon: 'FaNewspaper',
      relevantStages: ['planning', 'booked', 'in_makkah', 'returned'],
      priority: 5,
      actionVerb: 'read',
    },
  ]
}

// Get navigation items for a specific category
export async function getNavItemsByCategory(categoryId: string): Promise<TNavigationItem[]> {
  const navigation = await getNavigation()
  const category = navigation.find((item) => item.id === categoryId)
  return category?.children || []
}

// Get context-aware navigation (prioritized based on journey stage)
export async function getContextAwareNavigation(journeyStage: JourneyStage): Promise<TNavigationItem[]> {
  const navigation = await getNavigation()

  // Sort by relevance to current journey stage
  return navigation.sort((a, b) => {
    const aRelevant = a.relevantStages?.includes(journeyStage) ? 1 : 0
    const bRelevant = b.relevantStages?.includes(journeyStage) ? 1 : 0

    if (aRelevant !== bRelevant) {
      return bRelevant - aRelevant // Relevant items first
    }

    return (a.priority || 99) - (b.priority || 99) // Then by priority
  })
}

// Get suggested actions based on journey stage
// Using query parameters to pre-select sub-menu items on hub pages
export function getSuggestedActions(journeyStage: JourneyStage): { label: string; href: string; description: string }[] {
  const suggestions: Record<JourneyStage, { label: string; href: string; description: string }[]> = {
    planning: [
      { label: 'Build My Itinerary', href: '/prepare?action=build-itinerary', description: 'Let AI create your perfect trip plan' },
      { label: 'Learn Umrah Steps', href: '/learn?action=umrah-guide', description: 'Understand the rituals before you go' },
      { label: 'Calculate Budget', href: '/prepare?action=calculate-budget', description: 'Know how much you need' },
    ],
    booked: [
      { label: 'Pack My Bag', href: '/prepare?action=pack-my-bag', description: 'Don\'t forget anything important' },
      { label: 'Get My Visa', href: '/prepare?action=get-visa', description: 'Complete your documentation' },
      { label: 'Learn the Rituals', href: '/learn?action=step-by-step', description: 'Practice before you arrive' },
    ],
    in_makkah: [
      { label: 'Find Food', href: '/explore?action=find-food', description: 'Restaurants open near you' },
      { label: 'Navigate to Haram', href: '/explore?action=navigate', description: 'Fastest route from your hotel' },
      { label: 'Local Tips', href: '/explore?action=local-tips', description: 'Insider knowledge for your visit' },
    ],
    returned: [
      { label: 'Share My Journey', href: '/learn', description: 'Create a shareable memory' },
      { label: 'Leave a Tip', href: '/explore?action=local-tips', description: 'Help future pilgrims' },
      { label: 'Plan Next Visit', href: '/prepare?action=build-itinerary', description: 'Start planning again' },
    ],
  }

  return suggestions[journeyStage] || suggestions.planning
}

// AI Guide suggested questions by context
export function getAISuggestions(context: string, journeyStage?: JourneyStage): string[] {
  const contextSuggestions: Record<string, string[]> = {
    // Prepare section
    'prepare': [
      'Help me plan my trip',
      'What documents do I need?',
      'Create a packing list for me',
      'How much will my trip cost?',
    ],
    'build-itinerary': [
      'Create a 7-day Umrah itinerary',
      'Best itinerary for family with kids',
      'How many days do I need?',
      'When should I visit Madinah?',
    ],
    'get-visa': [
      'What visa do I need for Umrah?',
      'How long does visa processing take?',
      'What documents are required?',
      'Can I get visa on arrival?',
    ],
    'pack-my-bag': [
      'What should I pack for Umrah?',
      'Ihram clothing requirements',
      'What medications should I bring?',
      'Electronics and adapters needed',
    ],
    'calculate-budget': [
      'How much does Umrah cost?',
      'Budget breakdown for 10 days',
      'How to save money on my trip',
      'Currency exchange tips',
    ],

    // Learn section
    'learn': [
      'Explain Umrah step by step',
      'What are the 5 days of Hajj?',
      'How to perform Tawaf correctly?',
      'Most important duas to memorize',
    ],
    'umrah-guide': [
      'Walk me through Umrah',
      'How long does Umrah take?',
      'What invalidates Umrah?',
      'Best time to perform Umrah?',
    ],
    'hajj-guide': [
      'Explain the days of Hajj',
      'What happens on Arafat day?',
      'Difference between Hajj types',
      'How to prepare for Hajj?',
    ],
    'step-by-step': [
      'How to do Tawaf properly?',
      'Explain Sai between Safa and Marwa',
      'Rules of Ihram',
      'What breaks my Ihram?',
    ],
    'duas-prayers': [
      'Duas for Tawaf',
      'What to say at Safa and Marwa?',
      'Duas for entering Masjid al-Haram',
      'Best times for dua acceptance',
    ],

    // Explore section
    'explore': [
      'Hotels near King Fahd Gate',
      'Best restaurants for families',
      'How to get to King Abdul Aziz Gate?',
      'Local tips for visiting Haram',
    ],
    'find-hotels': [
      'Hotels with Haram view',
      'Budget hotels near Haram',
      'Best area to stay in Makkah',
      'Hotels good for elderly',
    ],
    'find-food': [
      'Restaurants open after Fajr',
      'Best biryani near Haram',
      'Where to eat at 3am?',
      'Family-friendly restaurants',
    ],
    'navigate': [
      'Shortest route to King Fahd Gate',
      'How to find Gate 79?',
      'Walking time from my hotel',
      'Best gate for wheelchair access',
    ],

    // Tips section
    'tips': [
      'Top tips for first-timers',
      'What should I know before going?',
      'Common mistakes to avoid',
      'Best advice from experienced pilgrims',
    ],
    'first-timers': [
      'What I wish I knew before Umrah',
      'Biggest mistakes first-timers make',
      'How to prepare mentally',
      'What surprised me most',
    ],
    'for-women': [
      'Tips for women traveling alone',
      'Where is the women\'s prayer area?',
      'What to wear as a woman',
      'Women-friendly services in Makkah',
    ],
    'ramadan': [
      'Umrah during Ramadan tips',
      'Where to have Iftar near Haram?',
      'Last 10 nights guide',
      'Taraweeh prayer at Haram',
    ],
    'shortcuts': [
      'Secret entrances to Haram',
      'Best routes to the Haram',
      'Local tips only residents know',
      'Hidden gems in Makkah',
    ],
  }

  // Get context-specific suggestions
  let suggestions = contextSuggestions[context] || contextSuggestions['prepare']

  // Add journey-stage specific suggestions
  if (journeyStage === 'in_makkah') {
    suggestions = [
      'What should I do right now?',
      ...suggestions.slice(0, 3),
    ]
  }

  return suggestions
}

// Legacy support - get navigation in old format
export async function getNavMegaMenu(): Promise<TNavigationItem> {
  const navigation = await getNavigation()
  return navigation.find((item) => item.type === 'mega-menu') || ({} as TNavigationItem)
}

// Language options
export const getLanguages = async () => {
  return [
    { id: 'English', name: 'English', description: 'United States', href: '#', active: true },
    { id: 'Arabic', name: 'العربية', description: 'Arabic', href: '#' },
    { id: 'Urdu', name: 'اردو', description: 'Urdu', href: '#' },
    { id: 'Indonesian', name: 'Bahasa', description: 'Indonesian', href: '#' },
    { id: 'Turkish', name: 'Türkçe', description: 'Turkish', href: '#' },
    { id: 'French', name: 'Français', description: 'French', href: '#' },
  ]
}

// Currency options
export const getCurrencies = async () => {
  return [
    { id: 'SAR', name: 'SAR', description: 'Saudi Riyal', href: '#', active: true },
    { id: 'USD', name: 'USD', description: 'US Dollar', href: '#' },
    { id: 'EUR', name: 'EUR', description: 'Euro', href: '#' },
    { id: 'GBP', name: 'GBP', description: 'British Pound', href: '#' },
    { id: 'AED', name: 'AED', description: 'UAE Dirham', href: '#' },
    { id: 'MYR', name: 'MYR', description: 'Malaysian Ringgit', href: '#' },
  ]
}

// ============================================
// Tips Topics - Used for AI Chat Suggestions
// (Merged from standalone Tips category)
// ============================================

export interface TipTopic {
  id: string
  name: string
  description: string
  showIf?: ShowIfCondition
  aiSuggestions: string[]
}

export const tipsTopics: TipTopic[] = [
  {
    id: 'first-timers',
    name: 'First-Timer Guide',
    description: 'Essential tips for beginners',
    showIf: { isFirstTime: true },
    aiSuggestions: [
      'What I wish I knew before Umrah',
      'Biggest mistakes first-timers make',
      'How to prepare mentally for my first pilgrimage',
    ],
  },
  {
    id: 'for-women',
    name: 'For Women',
    description: 'Women-specific guidance',
    showIf: { gender: 'female' },
    aiSuggestions: [
      'Tips for women traveling alone',
      'Where is the women\'s prayer area?',
      'What to wear as a woman in Makkah',
    ],
  },
  {
    id: 'ramadan',
    name: 'Ramadan Visit',
    description: 'Special Ramadan advice',
    aiSuggestions: [
      'Umrah during Ramadan tips',
      'Where to have Iftar near Haram?',
      'Last 10 nights guide',
    ],
  },
  {
    id: 'shortcuts',
    name: 'Secret Shortcuts',
    description: 'Insider routes & hacks',
    aiSuggestions: [
      'Secret entrances to Haram',
      'Best routes to the Haram',
      'Local tips only residents know',
    ],
  },
]

// ============================================
// Personalized Navigation Functions
// ============================================

// Check if an item matches the showIf conditions
function matchesShowIfCondition(showIf: ShowIfCondition | undefined, profile: UserProfile | null): boolean {
  if (!showIf) return true // No condition means always show
  if (!profile) return true // No profile means show all

  // Check isFirstTime condition
  if (showIf.isFirstTime !== undefined && profile.isFirstTime !== showIf.isFirstTime) {
    return false
  }

  // Check gender condition
  if (showIf.gender && profile.gender !== showIf.gender) {
    return false
  }

  // Check country condition
  if (showIf.countries && profile.country && !showIf.countries.includes(profile.country)) {
    return false
  }

  // Check journey stage condition
  if (showIf.journeyStages && profile.journeyStage && !showIf.journeyStages.includes(profile.journeyStage)) {
    return false
  }

  // Check journey type condition (umrah, hajj, both)
  if (showIf.journeyType && profile.journeyType) {
    // 'both' matches everything, otherwise check if user's type is in the allowed list
    if (profile.journeyType === 'both') {
      // User doing both - show all items
      return true
    }
    if (!showIf.journeyType.includes(profile.journeyType)) {
      return false
    }
  }

  return true
}

// Apply personalization badges/prefixes
function applyPersonalization(item: TNavigationItem, profile: UserProfile | null): TNavigationItem {
  if (!profile) return item

  const result = { ...item }

  // Add "First-Timer" badge for first-time users on relevant items
  if (profile.isFirstTime && item.id.includes('first-timer')) {
    result.badge = 'For You'
  }

  return result
}

// Get personalized navigation based on user profile
export async function getPersonalizedNavigation(userProfile: UserProfile | null): Promise<TNavigationItem[]> {
  const navigation = await getNavigation()

  if (!userProfile || !userProfile.completedOnboarding) {
    return navigation
  }

  // Filter and transform navigation items
  return navigation
    .filter((category) => matchesShowIfCondition(category.showIf, userProfile))
    .map((category) => {
      if (!category.children) {
        return applyPersonalization(category, userProfile)
      }

      // Filter children based on showIf conditions
      const filteredChildren = category.children
        .filter((child) => matchesShowIfCondition(child.showIf, userProfile))
        .map((child) => applyPersonalization(child, userProfile))

      return {
        ...applyPersonalization(category, userProfile),
        children: filteredChildren,
      }
    })
}

// Get personalized AI suggestions based on user profile
export function getPersonalizedAISuggestions(context: string, profile: UserProfile | null): string[] {
  const baseSuggestions = getAISuggestions(context, profile?.journeyStage || 'planning')

  if (!profile || !profile.completedOnboarding) return baseSuggestions

  // Get personalized suggestions from tips topics
  const personalizedTips = tipsTopics
    .filter((topic) => matchesShowIfCondition(topic.showIf, profile))
    .flatMap((topic) => topic.aiSuggestions.slice(0, 1)) // Get first suggestion from each matching topic

  // For local-tips context, show all relevant tips
  if (context === 'local-tips' || context === 'explore-local-tips') {
    const allTips = tipsTopics
      .filter((topic) => matchesShowIfCondition(topic.showIf, profile))
      .flatMap((topic) => topic.aiSuggestions)
    return allTips.slice(0, 4)
  }

  // Combine personalized tips with base suggestions
  return [...personalizedTips, ...baseSuggestions].slice(0, 4)
}
