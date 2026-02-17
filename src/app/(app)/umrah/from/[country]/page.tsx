import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SITE_CONFIG } from '@/data/site-config'
import { countries } from '@/data/countries'
import { getPriorityUmrahCountries } from '@/lib/seo/umrahPriorityCountries'
import { FAQSchema, BreadcrumbSchema } from '@/components/SEO/JsonLd'

// ============================================
// COUNTRY-SPECIFIC UMRAH PAGE - Programmatic SEO
// /umrah/from/united-kingdom, /umrah/from/pakistan, etc.
// Generates 195+ pages automatically
// ============================================

interface PageProps {
  params: Promise<{ country: string }>
}

// Convert country name to URL slug
function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-')
}

// Find country by slug
function findCountryBySlug(slug: string) {
  return countries.find((c) => toSlug(c.name) === slug)
}

// Country-specific data (expandable)
const COUNTRY_DATA: Record<string, {
  visaRequired: boolean
  visaInfo: string
  directFlights: string[]
  currency: string
  avgCost: string
  embassy?: string
}> = {
  GB: {
    visaRequired: true,
    visaInfo: 'UK citizens can apply for Umrah e-visa online or through authorized travel agents.',
    directFlights: ['London Heathrow (LHR) to Jeddah', 'Manchester (MAN) to Jeddah', 'Birmingham (BHX) to Jeddah'],
    currency: 'GBP',
    avgCost: '£1,500 - £3,500',
    embassy: 'Royal Embassy of Saudi Arabia, London',
  },
  US: {
    visaRequired: true,
    visaInfo: 'US citizens can apply for Umrah e-visa through the Saudi eVisa portal or authorized agents.',
    directFlights: ['New York JFK to Jeddah (Saudia)', 'Washington IAD to Jeddah'],
    currency: 'USD',
    avgCost: '$2,500 - $5,000',
    embassy: 'Royal Embassy of Saudi Arabia, Washington D.C.',
  },
  PK: {
    visaRequired: true,
    visaInfo: 'Pakistani citizens require Umrah visa through authorized Hajj/Umrah operators.',
    directFlights: ['Karachi to Jeddah', 'Lahore to Jeddah', 'Islamabad to Jeddah', 'Peshawar to Madinah'],
    currency: 'PKR',
    avgCost: 'PKR 250,000 - 500,000',
  },
  IN: {
    visaRequired: true,
    visaInfo: 'Indian citizens apply through authorized Umrah tour operators registered with the Hajj Committee of India.',
    directFlights: ['Mumbai to Jeddah', 'Delhi to Jeddah', 'Hyderabad to Jeddah', 'Chennai to Jeddah'],
    currency: 'INR',
    avgCost: '₹1,50,000 - ₹3,00,000',
  },
  MY: {
    visaRequired: true,
    visaInfo: 'Malaysian citizens can apply through Tabung Haji or authorized Umrah operators.',
    directFlights: ['Kuala Lumpur (KUL) to Jeddah', 'Kuala Lumpur to Madinah'],
    currency: 'MYR',
    avgCost: 'RM 8,000 - RM 15,000',
  },
  ID: {
    visaRequired: true,
    visaInfo: 'Indonesian citizens apply through Ministry of Religious Affairs approved operators.',
    directFlights: ['Jakarta to Jeddah', 'Surabaya to Jeddah'],
    currency: 'IDR',
    avgCost: 'IDR 35,000,000 - 60,000,000',
  },
  // Add more countries as needed
}

// Default data for countries without specific info
const DEFAULT_COUNTRY_DATA = {
  visaRequired: true,
  visaInfo: 'Check with your local Saudi embassy or authorized Umrah travel agents for visa requirements.',
  directFlights: ['Check with local airlines for routes to Jeddah or Madinah'],
  currency: 'Local currency',
  avgCost: 'Varies by country',
}

export async function generateStaticParams() {
  // Option B rollout: generate static params only for priority countries
  return getPriorityUmrahCountries(50).map((country) => ({
    country: toSlug(country.name),
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country: countrySlug } = await params
  const country = findCountryBySlug(countrySlug)

  if (!country) {
    return { title: 'Not Found' }
  }

  const title = `Umrah from ${country.name}: Complete Guide ${new Date().getFullYear()}`
  const description = `Planning Umrah from ${country.name}? Complete guide including visa requirements, flights, costs, and tips for ${country.name} pilgrims visiting Makkah.`

  return {
    title,
    description,
    keywords: [
      `Umrah from ${country.name}`,
      `${country.name} Umrah visa`,
      `${country.name} to Makkah`,
      `Umrah packages ${country.name}`,
      `${country.name} pilgrims`,
      'Umrah guide',
      'How to perform Umrah',
    ],
    openGraph: {
      title,
      description,
      url: `${SITE_CONFIG.url}/umrah/from/${countrySlug}`,
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/umrah/from/${countrySlug}`,
    },
  }
}

export default async function UmrahFromCountryPage({ params }: PageProps) {
  const { country: countrySlug } = await params
  const country = findCountryBySlug(countrySlug)

  if (!country) {
    notFound()
  }

  const data = COUNTRY_DATA[country.code] || DEFAULT_COUNTRY_DATA

  // FAQs for schema
  const faqs = [
    {
      question: `Do ${country.name} citizens need a visa for Umrah?`,
      answer: data.visaRequired
        ? `Yes, ${country.name} citizens need an Umrah visa. ${data.visaInfo}`
        : `${country.name} citizens may be eligible for visa-free entry or e-visa. Check current requirements.`,
    },
    {
      question: `How much does Umrah cost from ${country.name}?`,
      answer: `The average cost of Umrah from ${country.name} is approximately ${data.avgCost}, including flights, accommodation, and visa fees. Costs vary based on season and hotel choice.`,
    },
    {
      question: `Are there direct flights from ${country.name} to Makkah?`,
      answer: `${data.directFlights.join('. ')}. Note: You fly to Jeddah (JED) or Madinah (MED), then travel to Makkah by road.`,
    },
    {
      question: `What's the best time for ${country.name} pilgrims to perform Umrah?`,
      answer: `Umrah can be performed year-round. Ramadan offers the greatest rewards but is crowded. Shoulder seasons (Spring/Fall) offer a balance of good weather and manageable crowds.`,
    },
  ]

  return (
    <>
      {/* Structured Data */}
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_CONFIG.url },
          { name: 'Umrah', url: `${SITE_CONFIG.url}/umrah` },
          { name: `From ${country.name}`, url: `${SITE_CONFIG.url}/umrah/from/${countrySlug}` },
        ]}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-neutral-500 mb-6">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/learn" className="hover:text-emerald-600">Umrah</Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-900 dark:text-white">From {country.name}</span>
        </nav>

        {/* Hero */}
        <header className="mb-12">
          <div className="text-6xl mb-4">{country.flag}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Umrah from {country.name}
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-300">
            Complete guide for {country.name} pilgrims planning their sacred journey to Makkah
          </p>
        </header>

        {/* Quick Info Cards */}
        <section className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">💰 Estimated Cost</h3>
            <p className="text-neutral-600 dark:text-neutral-400">{data.avgCost}</p>
          </div>
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">🛂 Visa Required</h3>
            <p className="text-neutral-600 dark:text-neutral-400">{data.visaRequired ? 'Yes' : 'Check requirements'}</p>
          </div>
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">💵 Currency</h3>
            <p className="text-neutral-600 dark:text-neutral-400">{data.currency} → SAR</p>
          </div>
        </section>

        {/* Main Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <h2>Umrah Visa for {country.name} Citizens</h2>
          <p>{data.visaInfo}</p>
          <p>
            <strong>Documents typically required:</strong>
          </p>
          <ul>
            <li>Valid passport (6+ months validity)</li>
            <li>Passport-size photos (white background)</li>
            <li>Completed visa application form</li>
            <li>Proof of accommodation in Saudi Arabia</li>
            <li>Return flight tickets</li>
            <li>Meningitis (ACWY) vaccination certificate</li>
          </ul>

          <h2>Flights from {country.name}</h2>
          <p>Major flight routes to Saudi Arabia:</p>
          <ul>
            {data.directFlights.map((flight, index) => (
              <li key={index}>{flight}</li>
            ))}
          </ul>
          <p>
            <strong>Tip:</strong> Fly into Jeddah for the closest airport to Makkah (80km), 
            or Madinah if you want to visit the Prophet's Mosque first.
          </p>

          <h2>Estimated Costs from {country.name}</h2>
          <p>
            Budget for your Umrah trip: <strong>{data.avgCost}</strong>
          </p>
          <p>This typically includes:</p>
          <ul>
            <li>Return flights</li>
            <li>Accommodation (5-7 nights)</li>
            <li>Umrah visa fees</li>
            <li>Transportation (airport transfers)</li>
            <li>Food and incidentals</li>
          </ul>

          <h2>Step-by-Step: Umrah from {country.name}</h2>
          <ol>
            <li><strong>Choose your dates</strong> — Consider Ramadan for extra blessings, or off-peak for fewer crowds</li>
            <li><strong>Book with an authorized agent</strong> — Use registered Umrah operators</li>
            <li><strong>Apply for visa</strong> — Through your operator or Saudi eVisa portal</li>
            <li><strong>Get vaccinated</strong> — Meningitis ACWY is mandatory</li>
            <li><strong>Book flights</strong> — To Jeddah or Madinah</li>
            <li><strong>Prepare spiritually</strong> — Learn the rituals, duas, and etiquette</li>
            <li><strong>Pack appropriately</strong> — Ihram, comfortable shoes, essentials</li>
          </ol>

          <h2>Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-lg font-semibold">{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </article>

        {/* Related Countries */}
        <section className="mt-12 p-6 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
            Umrah Guides for Other Countries
          </h2>
          <div className="flex flex-wrap gap-2">
            {countries.slice(0, 20).filter(c => c.code !== country.code).map((c) => (
              <Link
                key={c.code}
                href={`/umrah/from/${toSlug(c.name)}`}
                className="text-sm px-3 py-1 bg-white dark:bg-neutral-700 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
              >
                {c.flag} {c.name}
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-12 p-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Plan Your Umrah from {country.name}</h2>
          <p className="mb-6 opacity-90">
            Get personalized guidance from our AI assistant. Visa help, itinerary planning, budget tips — all tailored for {country.name} pilgrims.
          </p>
          <Link
            href={`/?from=${countrySlug}`}
            className="inline-block bg-white text-emerald-600 font-semibold px-6 py-3 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            Start Planning with AI →
          </Link>
        </div>

        {/* Last Updated */}
        <p className="text-sm text-neutral-500 mt-8">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>
    </>
  )
}
