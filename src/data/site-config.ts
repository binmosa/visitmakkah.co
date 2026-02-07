// ============================================
// SITE CONFIGURATION
// Central config for SEO, branding, and metadata
// ============================================

export const SITE_CONFIG = {
  // Brand
  name: 'Visit Makkah',
  tagline: 'Local Wisdom. Intelligent Guidance.',
  subtagline: 'Your AI-powered guide for Hajj and Umrah',
  
  // URLs
  url: 'https://visitmakkah.co',
  ogImage: 'https://visitmakkah.co/og/default.jpg',
  
  // SEO
  description:
    'Your comprehensive AI-powered guide for Hajj and Umrah. Plan your pilgrimage with local expertise, step-by-step guides, prayer times, hotel recommendations, and personalized AI assistance. Trusted by pilgrims worldwide.',
  
  keywords: [
    'Visit Makkah',
    'Umrah guide',
    'Hajj guide',
    'Makkah travel',
    'Umrah 2026',
    'Hajj 2026',
    'how to perform Umrah',
    'Umrah step by step',
    'Makkah hotels',
    'Masjid al-Haram',
    'Kaaba',
    'pilgrimage guide',
    'Umrah tips',
    'Ramadan Umrah',
    'Islamic travel',
    'Saudi Arabia visa',
    'Umrah visa',
    'Makkah prayer times',
    'Tawaf guide',
    'Sai guide',
  ],
  
  // Social
  twitterHandle: '@visitmakkah',
  instagramHandle: '@visitmakkah',
  
  // Location (for local business schema)
  location: {
    city: 'Makkah',
    country: 'Saudi Arabia',
    coordinates: {
      latitude: 21.4225,
      longitude: 39.8262,
    },
  },
  
  // Contact
  email: 'hello@visitmakkah.co',
  
  // Analytics IDs (for reference)
  analytics: {
    ga4: 'G-W8M2508LHE',
    clarity: '', // Add when available
  },
}

// ============================================
// SEO HELPERS
// ============================================

/**
 * Generate page title with site name
 */
export function getPageTitle(title: string): string {
  return `${title} | ${SITE_CONFIG.name}`
}

/**
 * Generate canonical URL
 */
export function getCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${SITE_CONFIG.url}${cleanPath}`
}

/**
 * Generate OG image URL with fallback
 */
export function getOgImage(image?: string): string {
  return image || SITE_CONFIG.ogImage
}
