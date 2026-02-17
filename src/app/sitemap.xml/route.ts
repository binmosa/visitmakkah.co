import { SITE_CONFIG } from '@/data/site-config'
import { STATIC_PAGES_LASTMOD, UMRAH_FROM_TEMPLATE_LASTMOD } from '@/lib/seo/sitemapDates'
import { sitemapIndexXml } from '@/lib/seo/sitemaps/xml'

export const runtime = 'nodejs'

export async function GET() {
  const base = SITE_CONFIG.url

  return sitemapIndexXml([
    { loc: `${base}/sitemaps/static.xml`, lastmod: STATIC_PAGES_LASTMOD },
    { loc: `${base}/sitemaps/sanity.xml`, lastmod: STATIC_PAGES_LASTMOD },
    { loc: `${base}/sitemaps/umrah-from.xml`, lastmod: UMRAH_FROM_TEMPLATE_LASTMOD },
  ])
}
