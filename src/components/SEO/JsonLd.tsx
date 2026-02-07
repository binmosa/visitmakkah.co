import { SITE_CONFIG } from '@/data/site-config'

// ============================================
// JSON-LD STRUCTURED DATA COMPONENTS
// Use these components to add schema.org markup
// ============================================

interface JsonLdProps {
  data: Record<string, unknown>
}

/**
 * Base JSON-LD component
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// ============================================
// ARTICLE SCHEMA - For blog posts
// ============================================
interface ArticleSchemaProps {
  title: string
  description: string
  url: string
  image?: string
  datePublished: string
  dateModified?: string
  authorName?: string
  authorUrl?: string
}

export function ArticleSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName = 'Visit Makkah Team',
  authorUrl = SITE_CONFIG.url,
}: ArticleSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: url,
    image: image || SITE_CONFIG.ogImage,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: authorName,
      url: authorUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logos/icon.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }

  return <JsonLd data={data} />
}

// ============================================
// HOWTO SCHEMA - For step-by-step guides
// ============================================
interface HowToStep {
  name: string
  text: string
  image?: string
}

interface HowToSchemaProps {
  name: string
  description: string
  url: string
  image?: string
  totalTime?: string // ISO 8601 duration, e.g., "PT2H" for 2 hours
  steps: HowToStep[]
}

export function HowToSchema({
  name,
  description,
  url,
  image,
  totalTime,
  steps,
}: HowToSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: name,
    description: description,
    url: url,
    image: image || SITE_CONFIG.ogImage,
    totalTime: totalTime,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image,
    })),
  }

  return <JsonLd data={data} />
}

// ============================================
// FAQ SCHEMA - For FAQ sections
// ============================================
interface FAQItem {
  question: string
  answer: string
}

interface FAQSchemaProps {
  faqs: FAQItem[]
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return <JsonLd data={data} />
}

// ============================================
// BREADCRUMB SCHEMA
// ============================================
interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return <JsonLd data={data} />
}

// ============================================
// PLACE SCHEMA - For holy sites
// ============================================
interface PlaceSchemaProps {
  name: string
  description: string
  url: string
  image?: string
  address?: {
    city: string
    country: string
  }
  geo?: {
    latitude: number
    longitude: number
  }
}

export function PlaceSchema({
  name,
  description,
  url,
  image,
  address,
  geo,
}: PlaceSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: name,
    description: description,
    url: url,
    image: image,
    address: address
      ? {
          '@type': 'PostalAddress',
          addressLocality: address.city,
          addressCountry: address.country,
        }
      : undefined,
    geo: geo
      ? {
          '@type': 'GeoCoordinates',
          latitude: geo.latitude,
          longitude: geo.longitude,
        }
      : undefined,
  }

  return <JsonLd data={data} />
}

// ============================================
// LOCAL BUSINESS SCHEMA - For Visit Makkah as a guide service
// ============================================
export function LocalBusinessSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logos/icon.svg`,
    image: SITE_CONFIG.ogImage,
    priceRange: 'Free',
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE_CONFIG.location.city,
      addressCountry: SITE_CONFIG.location.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE_CONFIG.location.coordinates.latitude,
      longitude: SITE_CONFIG.location.coordinates.longitude,
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: SITE_CONFIG.location.coordinates.latitude,
        longitude: SITE_CONFIG.location.coordinates.longitude,
      },
      geoRadius: '50000', // 50km radius
    },
    serviceType: ['Pilgrimage Guide', 'Travel Information', 'Umrah Guide', 'Hajj Guide'],
  }

  return <JsonLd data={data} />
}

// ============================================
// EVENT SCHEMA - For Ramadan/Hajj dates
// ============================================
interface EventSchemaProps {
  name: string
  description: string
  url: string
  startDate: string
  endDate: string
  location?: string
  image?: string
}

export function EventSchema({
  name,
  description,
  url,
  startDate,
  endDate,
  location = 'Makkah, Saudi Arabia',
  image,
}: EventSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: name,
    description: description,
    url: url,
    startDate: startDate,
    endDate: endDate,
    image: image || SITE_CONFIG.ogImage,
    location: {
      '@type': 'Place',
      name: location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Makkah',
        addressCountry: 'Saudi Arabia',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
  }

  return <JsonLd data={data} />
}
