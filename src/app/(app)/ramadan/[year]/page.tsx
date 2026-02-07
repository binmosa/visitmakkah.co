import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SITE_CONFIG } from '@/data/site-config'
import { EventSchema, FAQSchema, BreadcrumbSchema } from '@/components/SEO/JsonLd'

// ============================================
// RAMADAN HUB PAGE - Programmatic SEO
// /ramadan/2026, /ramadan/2027, etc.
// ============================================

interface PageProps {
  params: Promise<{ year: string }>
}

// Valid years for Ramadan pages
const VALID_YEARS = ['2026', '2027', '2028', '2029', '2030']

// Ramadan dates (approximate - will need updating)
const RAMADAN_DATES: Record<string, { start: string; end: string }> = {
  '2026': { start: '2026-02-28', end: '2026-03-29' },
  '2027': { start: '2027-02-17', end: '2027-03-18' },
  '2028': { start: '2028-02-06', end: '2028-03-06' },
  '2029': { start: '2029-01-26', end: '2029-02-24' },
  '2030': { start: '2030-01-15', end: '2030-02-13' },
}

export async function generateStaticParams() {
  return VALID_YEARS.map((year) => ({ year }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year } = await params

  if (!VALID_YEARS.includes(year)) {
    return { title: 'Not Found' }
  }

  const title = `Ramadan ${year} in Makkah: Complete Guide for Pilgrims`
  const description = `Everything you need to know about Ramadan ${year} in Makkah. Umrah during Ramadan, prayer times, Taraweeh at Masjid al-Haram, iftar spots, and tips for the blessed month.`

  return {
    title,
    description,
    keywords: [
      `Ramadan ${year}`,
      `Ramadan ${year} Makkah`,
      `Umrah Ramadan ${year}`,
      'Ramadan in Makkah',
      'Taraweeh Masjid al-Haram',
      'Umrah during Ramadan',
      'Last 10 nights Makkah',
      'Laylatul Qadr Makkah',
    ],
    openGraph: {
      title,
      description,
      url: `${SITE_CONFIG.url}/ramadan/${year}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/ramadan/${year}`,
    },
  }
}

export default async function RamadanYearPage({ params }: PageProps) {
  const { year } = await params

  if (!VALID_YEARS.includes(year)) {
    notFound()
  }

  const dates = RAMADAN_DATES[year]

  // FAQs for schema
  const faqs = [
    {
      question: `When does Ramadan ${year} start?`,
      answer: `Ramadan ${year} is expected to begin on ${new Date(dates.start).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. The exact date depends on moon sighting.`,
    },
    {
      question: `Is Umrah during Ramadan ${year} worth it?`,
      answer: `Yes! According to Hadith, performing Umrah during Ramadan is equivalent to the reward of Hajj. It's one of the most spiritually rewarding times to visit Makkah.`,
    },
    {
      question: 'What is Taraweeh at Masjid al-Haram like?',
      answer: 'Taraweeh prayers at Masjid al-Haram are led by renowned Qaris and attended by millions. The atmosphere is deeply spiritual. Prayers typically last 2-3 hours.',
    },
    {
      question: 'How crowded is Makkah during Ramadan?',
      answer: 'Makkah is significantly more crowded during Ramadan, especially in the last 10 nights. Plan ahead, book early, and be prepared for longer wait times for Tawaf.',
    },
    {
      question: 'Where can I have iftar near the Haram?',
      answer: 'Free iftar is distributed inside Masjid al-Haram. Many hotels and restaurants in the area also serve iftar. The Clock Tower mall has multiple dining options.',
    },
  ]

  return (
    <>
      {/* Structured Data */}
      <EventSchema
        name={`Ramadan ${year} in Makkah`}
        description={`The blessed month of Ramadan ${year} in Makkah, Saudi Arabia. Join millions of Muslims for prayers, fasting, and worship at Masjid al-Haram.`}
        url={`${SITE_CONFIG.url}/ramadan/${year}`}
        startDate={dates.start}
        endDate={dates.end}
        location="Masjid al-Haram, Makkah, Saudi Arabia"
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_CONFIG.url },
          { name: 'Ramadan', url: `${SITE_CONFIG.url}/ramadan` },
          { name: `Ramadan ${year}`, url: `${SITE_CONFIG.url}/ramadan/${year}` },
        ]}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-neutral-500 mb-6">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-900 dark:text-white">Ramadan {year}</span>
        </nav>

        {/* Hero */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Ramadan {year} in Makkah
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-6">
            Your complete guide to experiencing the blessed month in the holiest city
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              📅 {new Date(dates.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(dates.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
              🕌 30 Days of Blessing
            </span>
          </div>
        </header>

        {/* Quick Links */}
        <section className="grid md:grid-cols-2 gap-4 mb-12">
          <Link
            href={`/ramadan/${year}/umrah`}
            className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
              🕋 Umrah During Ramadan
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Perform Umrah for the reward of Hajj. Step-by-step guide.
            </p>
          </Link>

          <Link
            href={`/ramadan/${year}/last-10-nights`}
            className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-purple-800 dark:text-purple-300 mb-2">
              ✨ Last 10 Nights Guide
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Seek Laylatul Qadr in the most blessed nights of the year.
            </p>
          </Link>

          <Link
            href={`/ramadan/${year}/taraweeh`}
            className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-2">
              🌙 Taraweeh at Haram
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Experience Taraweeh prayers at Masjid al-Haram.
            </p>
          </Link>

          <Link
            href={`/ramadan/${year}/iftar`}
            className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-xl hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-orange-800 dark:text-orange-300 mb-2">
              🍽️ Iftar Near Haram
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Where to break your fast near Masjid al-Haram.
            </p>
          </Link>
        </section>

        {/* Main Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <h2>Why Ramadan in Makkah is Special</h2>
          <p>
            Ramadan in Makkah is unlike anywhere else on Earth. The Prophet Muhammad (PBUH) said: 
            <strong>"Umrah during Ramadan is equal to Hajj"</strong> (Bukhari and Muslim). 
            This makes Ramadan the most sought-after time for pilgrims.
          </p>

          <h2>What to Expect</h2>
          <ul>
            <li><strong>Crowds:</strong> Expect significant crowds, especially during the last 10 nights. The Haram can accommodate over 2 million worshippers.</li>
            <li><strong>Weather:</strong> Ramadan {year} falls in {new Date(dates.start).toLocaleDateString('en-US', { month: 'long' })}, expect temperatures around 25-35°C.</li>
            <li><strong>Prayer Times:</strong> Fajr around 5:30 AM, Maghrib around 6:15 PM (varies by date).</li>
            <li><strong>Taraweeh:</strong> Begins after Isha, lasts approximately 2-3 hours.</li>
          </ul>

          <h2>Planning Your Visit</h2>
          <p>
            If you're planning to visit Makkah during Ramadan {year}, we recommend:
          </p>
          <ol>
            <li>Book accommodation at least 3-4 months in advance</li>
            <li>Choose a hotel within walking distance of the Haram</li>
            <li>Apply for your Umrah visa early</li>
            <li>Pack light, comfortable clothing</li>
            <li>Prepare physically and spiritually</li>
          </ol>

          <h2>Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-lg font-semibold">{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </article>

        {/* CTA */}
        <div className="mt-12 p-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Plan Your Ramadan Journey?</h2>
          <p className="mb-6 opacity-90">
            Use our AI-powered trip planner to create your personalized Ramadan itinerary.
          </p>
          <Link
            href="/smart-tools"
            className="inline-block bg-white text-emerald-600 font-semibold px-6 py-3 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            Start Planning →
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
