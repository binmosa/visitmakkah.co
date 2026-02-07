// Navigation Structure - AI-First with Journey Stages
// Optimized for action-driven, context-aware pilgrimage platform

export type JourneyStage = 'planning' | 'booked' | 'in_makkah' | 'returned'

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
        },
        {
          id: 'learn-hajj',
          href: '/learn/hajj-guide',
          name: 'Hajj Guide',
          description: 'Day-by-day Hajj guide',
          icon: 'FaMosque',
          actionVerb: 'perform',
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
          id: 'explore-crowds',
          href: '/explore/check-crowds',
          name: 'Check Crowds',
          description: 'Best times for Tawaf',
          icon: 'FaUsers',
          actionVerb: 'avoid',
        },
        {
          id: 'explore-navigate',
          href: '/explore/navigate',
          name: 'Navigate to Haram',
          description: 'Gates, routes & shortcuts',
          icon: 'FaCompass',
          actionVerb: 'navigate to',
        },
      ],
    },
    {
      id: 'tips',
      href: '/tips',
      name: 'Tips',
      description: 'Insider knowledge & local advice',
      type: 'dropdown',
      icon: 'FaLightbulb',
      relevantStages: ['planning', 'booked', 'in_makkah'],
      priority: 4,
      actionVerb: 'get tips about',
      children: [
        {
          id: 'tips-first-timers',
          href: '/tips/first-timers',
          name: 'First-Timer Guide',
          description: 'Essential tips for beginners',
          icon: 'FaStar',
          actionVerb: 'read',
        },
        {
          id: 'tips-women',
          href: '/tips/for-women',
          name: 'For Women',
          description: 'Women-specific guidance',
          icon: 'FaFemale',
          actionVerb: 'read',
        },
        {
          id: 'tips-ramadan',
          href: '/tips/ramadan',
          name: 'Ramadan Visit',
          description: 'Special Ramadan advice',
          icon: 'FaMoon',
          actionVerb: 'prepare for',
        },
        {
          id: 'tips-shortcuts',
          href: '/tips/shortcuts',
          name: 'Secret Shortcuts',
          description: 'Insider routes & hacks',
          icon: 'FaMapSigns',
          actionVerb: 'discover',
        },
      ],
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
export function getSuggestedActions(journeyStage: JourneyStage): { label: string; href: string; description: string }[] {
  const suggestions: Record<JourneyStage, { label: string; href: string; description: string }[]> = {
    planning: [
      { label: 'Build My Itinerary', href: '/prepare/build-itinerary', description: 'Let AI create your perfect trip plan' },
      { label: 'Learn Umrah Steps', href: '/learn/umrah-guide', description: 'Understand the rituals before you go' },
      { label: 'Calculate Budget', href: '/prepare/calculate-budget', description: 'Know how much you need' },
    ],
    booked: [
      { label: 'Pack My Bag', href: '/prepare/pack-my-bag', description: 'Don\'t forget anything important' },
      { label: 'Get My Visa', href: '/prepare/get-visa', description: 'Complete your documentation' },
      { label: 'Learn the Rituals', href: '/learn/step-by-step', description: 'Practice before you arrive' },
    ],
    in_makkah: [
      { label: 'Check Crowds', href: '/explore/check-crowds', description: 'Best time for Tawaf now' },
      { label: 'Find Food', href: '/explore/find-food', description: 'Restaurants open near you' },
      { label: 'Navigate to Haram', href: '/explore/navigate', description: 'Fastest route from your hotel' },
    ],
    returned: [
      { label: 'Share My Journey', href: '/my-journey/share', description: 'Create a shareable memory' },
      { label: 'Leave a Tip', href: '/tips/contribute', description: 'Help future pilgrims' },
      { label: 'Plan Next Visit', href: '/prepare/build-itinerary', description: 'Start planning again' },
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
      'When is Haram least crowded?',
      'How to get to King Abdul Aziz Gate?',
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
    'check-crowds': [
      'Best time for Tawaf today?',
      'How crowded is it now?',
      'Least crowded days of the week',
      'Tips to avoid rush hours',
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
      'How crowded is Ramadan?',
      'Last 10 nights guide',
    ],
    'shortcuts': [
      'Secret entrances to Haram',
      'Fastest routes to avoid crowds',
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
