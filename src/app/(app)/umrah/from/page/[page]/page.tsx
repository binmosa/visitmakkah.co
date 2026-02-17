import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SITE_CONFIG } from '@/data/site-config'
import { getPriorityUmrahCountries } from '@/lib/seo/umrahPriorityCountries'

const PAGE_SIZE = 25

function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-')
}

interface PageProps {
  params: Promise<{ page: string }>
}

export async function generateStaticParams() {
  const countries = getPriorityUmrahCountries(50)
  const pageCount = Math.ceil(countries.length / PAGE_SIZE)

  // We don't generate page 1 here; that's /umrah/from
  return Array.from({ length: Math.max(0, pageCount - 1) }).map((_, i) => ({
    page: String(i + 2),
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { page } = await params
  const pageNum = Number(page)

  if (!Number.isFinite(pageNum) || pageNum < 2) {
    return { title: 'Not Found' }
  }

  return {
    title: `Umrah Guides by Country — Page ${pageNum}`,
    description: 'Browse more country-specific Umrah planning guides.',
    alternates: {
      canonical: `${SITE_CONFIG.url}/umrah/from/page/${pageNum}`,
    },
  }
}

export default async function UmrahFromIndexPaged({ params }: PageProps) {
  const { page } = await params
  const pageNum = Number(page)

  const allCountries = getPriorityUmrahCountries(50)
  const pageCount = Math.ceil(allCountries.length / PAGE_SIZE)

  if (!Number.isFinite(pageNum) || pageNum < 2 || pageNum > pageCount) {
    notFound()
  }

  const start = (pageNum - 1) * PAGE_SIZE
  const pageCountries = allCountries.slice(start, start + PAGE_SIZE)

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
          Umrah guides by country
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-300">
          Page {pageNum} of {pageCount}
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

      <nav className="mt-8 flex items-center gap-2 text-sm">
        <Link
          href="/umrah/from"
          className="px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
        >
          Page 1
        </Link>
        {Array.from({ length: pageCount - 1 }).map((_, i) => {
          const p = i + 2
          const active = p === pageNum
          return (
            <Link
              key={p}
              href={`/umrah/from/page/${p}`}
              className={
                'px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 ' +
                (active ? 'bg-neutral-100 dark:bg-neutral-800' : '')
              }
            >
              {p}
            </Link>
          )
        })}
      </nav>

      <p className="mt-10 text-xs text-neutral-500">
        Sitemap: <Link className="underline" href={`${SITE_CONFIG.url}/sitemap.xml`}>{`${SITE_CONFIG.url}/sitemap.xml`}</Link>
      </p>
    </div>
  )
}
