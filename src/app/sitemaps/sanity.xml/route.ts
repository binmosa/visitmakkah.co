import { SITE_CONFIG } from '@/data/site-config'
import { getAllSlugsForSitemap, type SitemapSanityItem } from '@/lib/sanity'
import { sitemapXml } from '@/lib/seo/sitemaps/xml'

export const runtime = 'nodejs'

function toLastMod(item: SitemapSanityItem) {
  const raw = item.updatedAt || item.publishedAt
  const d = raw ? new Date(raw) : new Date()
  return Number.isFinite(d.getTime()) ? d : new Date()
}

export async function GET() {
  const base = SITE_CONFIG.url

  const sanitySlugs = await getAllSlugsForSitemap().catch(() => ({ posts: [], guides: [], faqs: [], categories: [] }))

  const posts = (sanitySlugs.posts || []).map((i: SitemapSanityItem) => ({
    loc: `${base}/blog/${i.slug}`,
    lastmod: toLastMod(i),
    changefreq: 'weekly',
    priority: 0.8,
  }))

  const guides = (sanitySlugs.guides || []).map((i: SitemapSanityItem) => ({
    loc: `${base}/guides/${i.slug}`,
    lastmod: toLastMod(i),
    changefreq: 'weekly',
    priority: 0.9,
  }))

  const categories = (sanitySlugs.categories || []).map((i: SitemapSanityItem) => ({
    loc: `${base}/category/${i.slug}`,
    lastmod: toLastMod(i),
    changefreq: 'weekly',
    priority: 0.7,
  }))

  return sitemapXml([...posts, ...guides, ...categories])
}
