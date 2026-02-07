import { Metadata } from 'next'
import Link from 'next/link'
import { SITE_CONFIG } from '@/data/site-config'
import { FAQSchema, BreadcrumbSchema, PlaceSchema } from '@/components/SEO/JsonLd'

// ============================================
// MAKKAH PRAYER TIMES PAGE
// High-value SEO page for "makkah prayer times"
// ============================================

export const metadata: Metadata = {
  title: 'Makkah Prayer Times Today | Accurate Salah Schedule',
  description:
    'Get accurate prayer times for Makkah, Saudi Arabia. Fajr, Dhuhr, Asr, Maghrib, and Isha times updated daily. Includes Qibla direction and Islamic date.',
  keywords: [
    'Makkah prayer times',
    'Mecca prayer times',
    'prayer times Saudi Arabia',
    'Fajr time Makkah',
    'salah times Makkah',
    'namaz time Makkah',
    'Masjid al-Haram prayer times',
  ],
  openGraph: {
    title: 'Makkah Prayer Times Today | Visit Makkah',
    description: 'Accurate daily prayer times for Makkah, Saudi Arabia.',
    url: `${SITE_CONFIG.url}/prayer-times`,
  },
  alternates: {
    canonical: `${SITE_CONFIG.url}/prayer-times`,
  },
}

// Makkah coordinates
const MAKKAH_COORDS = {
  latitude: 21.4225,
  longitude: 39.8262,
}

// Fetch prayer times from Aladhan API
async function getPrayerTimes() {
  try {
    const today = new Date()
    const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`

    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${MAKKAH_COORDS.latitude}&longitude=${MAKKAH_COORDS.longitude}&method=4`,
      { next: { revalidate: 3600 } } // Revalidate every hour
    )

    if (!response.ok) throw new Error('Failed to fetch prayer times')

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching prayer times:', error)
    return null
  }
}

export default async function PrayerTimesPage() {
  const prayerData = await getPrayerTimes()
  const timings = prayerData?.timings
  const hijriDate = prayerData?.date?.hijri
  const gregorianDate = prayerData?.date?.gregorian

  // FAQs
  const faqs = [
    {
      question: 'What prayer method is used for Makkah?',
      answer:
        'We use the Umm al-Qura calculation method (Method 4), which is the official method used in Saudi Arabia.',
    },
    {
      question: 'Are these the same times used at Masjid al-Haram?',
      answer:
        'Yes, these times align with the official prayer times announced at Masjid al-Haram, as they use the same Umm al-Qura calculation.',
    },
    {
      question: 'What time is Tahajjud at Masjid al-Haram?',
      answer:
        'Tahajjud prayers are held in the last third of the night. During Ramadan, Tahajjud is prayed after Taraweeh, typically starting around 1:00-1:30 AM.',
    },
  ]

  return (
    <>
      {/* Structured Data */}
      <PlaceSchema
        name="Masjid al-Haram"
        description="The Sacred Mosque in Makkah, the holiest site in Islam and the direction of prayer (Qibla) for Muslims worldwide."
        url={`${SITE_CONFIG.url}/prayer-times`}
        address={{ city: 'Makkah', country: 'Saudi Arabia' }}
        geo={MAKKAH_COORDS}
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_CONFIG.url },
          { name: 'Prayer Times', url: `${SITE_CONFIG.url}/prayer-times` },
        ]}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-neutral-500 mb-6">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-900 dark:text-white">Prayer Times</span>
        </nav>

        {/* Hero */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            🕌 Makkah Prayer Times
          </h1>
          {gregorianDate && hijriDate && (
            <p className="text-lg text-neutral-600 dark:text-neutral-300">
              {gregorianDate.weekday.en}, {gregorianDate.day} {gregorianDate.month.en} {gregorianDate.year}
              <span className="mx-2">|</span>
              {hijriDate.day} {hijriDate.month.en} {hijriDate.year} AH
            </p>
          )}
        </header>

        {/* Prayer Times Card */}
        {timings ? (
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white mb-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div className="p-4 bg-white/10 rounded-xl">
                <p className="text-sm opacity-80">Fajr</p>
                <p className="text-2xl font-bold">{timings.Fajr}</p>
              </div>
              <div className="p-4 bg-white/10 rounded-xl">
                <p className="text-sm opacity-80">Dhuhr</p>
                <p className="text-2xl font-bold">{timings.Dhuhr}</p>
              </div>
              <div className="p-4 bg-white/10 rounded-xl">
                <p className="text-sm opacity-80">Asr</p>
                <p className="text-2xl font-bold">{timings.Asr}</p>
              </div>
              <div className="p-4 bg-white/10 rounded-xl">
                <p className="text-sm opacity-80">Maghrib</p>
                <p className="text-2xl font-bold">{timings.Maghrib}</p>
              </div>
              <div className="p-4 bg-white/10 rounded-xl col-span-2 md:col-span-1">
                <p className="text-sm opacity-80">Isha</p>
                <p className="text-2xl font-bold">{timings.Isha}</p>
              </div>
            </div>

            {/* Additional times */}
            <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <p className="opacity-70">Sunrise</p>
                <p className="font-semibold">{timings.Sunrise}</p>
              </div>
              <div>
                <p className="opacity-70">Sunset</p>
                <p className="font-semibold">{timings.Sunset}</p>
              </div>
              <div>
                <p className="opacity-70">Midnight</p>
                <p className="font-semibold">{timings.Midnight}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-8 text-center mb-8">
            <p className="text-neutral-600 dark:text-neutral-400">
              Unable to load prayer times. Please try again later.
            </p>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          <div className="p-6 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
            <h2 className="font-semibold text-neutral-900 dark:text-white mb-2">
              📍 Location
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Masjid al-Haram, Makkah<br />
              Saudi Arabia
            </p>
          </div>
          <div className="p-6 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
            <h2 className="font-semibold text-neutral-900 dark:text-white mb-2">
              🧭 Calculation Method
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Umm al-Qura University, Makkah<br />
              (Official Saudi method)
            </p>
          </div>
        </div>

        {/* Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <h2>Prayer Times in Makkah</h2>
          <p>
            Makkah, the holiest city in Islam, is home to <strong>Masjid al-Haram</strong> and the 
            <strong> Kaaba</strong> — the direction (Qibla) that Muslims face during prayer. 
            The prayer times above are calculated using the official <strong>Umm al-Qura</strong> method 
            used throughout Saudi Arabia.
          </p>

          <h2>About Prayer at Masjid al-Haram</h2>
          <p>
            Prayer at Masjid al-Haram holds special significance. The Prophet Muhammad (PBUH) said: 
            "One prayer in this mosque of mine (Masjid an-Nabawi) is better than a thousand prayers 
            elsewhere except Masjid al-Haram, and one prayer in Masjid al-Haram is better than a 
            hundred thousand prayers elsewhere." (Ahmad)
          </p>

          <h2>Tips for Praying at the Haram</h2>
          <ul>
            <li>Arrive early, especially for Fajr, Maghrib, and Friday prayers</li>
            <li>The rooftop level is less crowded during peak times</li>
            <li>Women's sections are clearly marked on each level</li>
            <li>Zamzam water is freely available throughout the mosque</li>
            <li>Air conditioning keeps the indoor areas comfortable year-round</li>
          </ul>

          <h2>Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-lg font-semibold">{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </article>

        {/* CTA */}
        <div className="mt-12 p-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Planning to Visit Makkah?</h2>
          <p className="mb-6 opacity-90">
            Get our complete guide to Umrah and make the most of your pilgrimage.
          </p>
          <Link
            href="/learn"
            className="inline-block bg-white text-amber-600 font-semibold px-6 py-3 rounded-lg hover:bg-amber-50 transition-colors"
          >
            Read Umrah Guide →
          </Link>
        </div>

        {/* Last Updated */}
        <p className="text-sm text-neutral-500 mt-8 text-center">
          Prayer times updated hourly using Aladhan API • Umm al-Qura calculation method
        </p>
      </div>
    </>
  )
}
