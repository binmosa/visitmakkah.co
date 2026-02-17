import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_CONFIG } from '@/data/site-config'
import { getPriorityUmrahCountries } from '@/lib/seo/umrahPriorityCountries'

export const metadata: Metadata = {
  title: `Umrah Guides by Country: Visa, Flights & Cost (${new Date().getFullYear()})`,
  description:
    'Choose your country to see a complete Umrah planning guide: visa requirements, flight routes, estimated costs, and practical tips for pilgrims.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/umrah/from`,
  },
}

const PAGE_SIZE = 25

function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-')
}

export default async function UmrahFromIndexPage() {
  const countries = getPriorityUmrahCountries(50)
  const pageCount = Math.ceil(countries.length / PAGE_SIZE)
  const pageCountries = countries.slice(0, PAGE_SIZE)

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
          Umrah guides by country
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-300">
          Pick your country to see visa guidance, flight options, estimated cost ranges, and a step-by-step Umrah checklist.
        </p>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {pageCountries.map((c) => (
          <Link
            key={c.code}
            href={`/umrah/from/${toSlug(c.name)}`}
            className="flex items-center justify-between rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <span aria-hidden>{c.flag}</span>
              <span className="font-medium text-neutral-900 dark:text-white">{c.name}</span>
            </span>
            <span className="text-sm text-neutral-500">→</span>
          </Link>
        ))}
      </section>

      {pageCount > 1 && (
        <nav className="mt-8 flex items-center gap-2 text-sm">
          <span className="text-neutral-500">More:</span>
          {Array.from({ length: pageCount - 1 }).map((_, i) => {
            const page = i + 2
            return (
              <Link
                key={page}
                href={`/umrah/from/page/${page}`}
                className="px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                Page {page}
              </Link>
            )
          })}
        </nav>
      )}

      <p className="mt-10 text-xs text-neutral-500">
        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
    </div>
  )
}
