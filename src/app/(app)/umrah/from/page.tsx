import Link from 'next/link'
import { countries } from '@/data/countries'

export const metadata = {
  title: 'Umrah from your country | Visit Makkah',
  description:
    'Browse Umrah planning guides by country. Visa notes, flight considerations, cost ranges, and practical tips for pilgrims traveling to Makkah.',
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-')
}

export default function UmrahFromIndexPage() {
  // Keep hub page useful and not a mega wall-of-links.
  const topCountries = countries.slice(0, 20)
  const allCountries = countries

  return (
    <main className="container mx-auto px-4 py-10 max-w-5xl">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">Umrah from your country</h1>
        <p className="text-neutral-600 dark:text-neutral-300 mt-3">
          Country-specific Umrah planning: visa notes, flight considerations, cost ranges, and practical tips.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">Top countries</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {topCountries.map((c) => (
            <Link
              key={c.code}
              href={`/umrah/from/${toSlug(c.name)}`}
              className="flex items-center gap-3 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <span className="text-2xl">{c.flag}</span>
              <span className="font-medium text-neutral-900 dark:text-white">Umrah from {c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-neutral-200 dark:border-neutral-800 pt-8">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">All countries</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
          Tip: Use your browser find (Ctrl/⌘+F) to jump to your country.
        </p>

        <div className="columns-2 md:columns-3 gap-6">
          {allCountries.map((c) => (
            <div key={c.code} className="break-inside-avoid mb-2">
              <Link href={`/umrah/from/${toSlug(c.name)}`} className="text-neutral-800 dark:text-neutral-200 hover:underline">
                {c.name}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
