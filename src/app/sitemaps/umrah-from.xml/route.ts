import { SITE_CONFIG } from '@/data/site-config'
import { getPriorityUmrahCountries } from '@/lib/seo/umrahPriorityCountries'
import { UMRAH_FROM_TEMPLATE_LASTMOD } from '@/lib/seo/sitemapDates'
import { sitemapXml } from '@/lib/seo/sitemaps/xml'

export const runtime = 'nodejs'

const PAGE_SIZE = 25

export async function GET() {
  const base = SITE_CONFIG.url
  const countries = getPriorityUmrahCountries(50)
  const pageCount = Math.ceil(countries.length / PAGE_SIZE)

  const hubPages = [
    { loc: `${base}/umrah/from`, lastmod: UMRAH_FROM_TEMPLATE_LASTMOD, changefreq: 'weekly', priority: 0.8 },
    ...Array.from({ length: Math.max(0, pageCount - 1) }).map((_, i) => ({
      loc: `${base}/umrah/from/page/${i + 2}`,
      lastmod: UMRAH_FROM_TEMPLATE_LASTMOD,
      changefreq: 'weekly',
      priority: 0.6,
    })),
  ]

  const countryPages = countries.map((c) => ({
    loc: `${base}/umrah/from/${c.name.toLowerCase().replace(/\s+/g, '-')}`,
    lastmod: UMRAH_FROM_TEMPLATE_LASTMOD,
    changefreq: 'monthly',
    priority: 0.7,
  }))

  return sitemapXml([...hubPages, ...countryPages])
}
