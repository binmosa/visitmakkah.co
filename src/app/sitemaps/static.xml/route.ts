import { SITE_CONFIG } from '@/data/site-config'
import { STATIC_PAGES_LASTMOD } from '@/lib/seo/sitemapDates'
import { sitemapXml } from '@/lib/seo/sitemaps/xml'

export const runtime = 'nodejs'

export async function GET() {
  const base = SITE_CONFIG.url

  // Keep these stable; bump STATIC_PAGES_LASTMOD when you materially update them.
  return sitemapXml([
    { loc: base, lastmod: STATIC_PAGES_LASTMOD, changefreq: 'daily', priority: 1.0 },

    { loc: `${base}/about`, lastmod: STATIC_PAGES_LASTMOD, changefreq: 'monthly', priority: 0.7 },
    { loc: `${base}/blog`, lastmod: STATIC_PAGES_LASTMOD, changefreq: 'daily', priority: 0.9 },
    { loc: `${base}/learn`, lastmod: STATIC_PAGES_LASTMOD, changefreq: 'weekly', priority: 0.8 },
    { loc: `${base}/prepare`, lastmod: STATIC_PAGES_LASTMOD, changefreq: 'weekly', priority: 0.8 },
    { loc: `${base}/explore`, lastmod: STATIC_PAGES_LASTMOD, changefreq: 'weekly', priority: 0.7 },
    { loc: `${base}/saved`, lastmod: STATIC_PAGES_LASTMOD, changefreq: 'weekly', priority: 0.6 },
    { loc: `${base}/prayer-times`, lastmod: STATIC_PAGES_LASTMOD, changefreq: 'daily', priority: 0.9 },

    // Ramadan (time sensitive, but stable URLs)
    { loc: `${base}/ramadan/2026`, lastmod: STATIC_PAGES_LASTMOD, changefreq: 'daily', priority: 1.0 },
    { loc: `${base}/ramadan/2026/umrah`, lastmod: STATIC_PAGES_LASTMOD, changefreq: 'daily', priority: 1.0 },
    { loc: `${base}/ramadan/2026/last-10-nights`, lastmod: STATIC_PAGES_LASTMOD, changefreq: 'daily', priority: 0.9 },
    { loc: `${base}/ramadan/2026/taraweeh`, lastmod: STATIC_PAGES_LASTMOD, changefreq: 'weekly', priority: 0.8 },
    { loc: `${base}/ramadan/2026/iftar`, lastmod: STATIC_PAGES_LASTMOD, changefreq: 'weekly', priority: 0.8 },
  ])
}
