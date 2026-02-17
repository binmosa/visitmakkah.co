import { MetadataRoute } from 'next'
import { getAllSlugsForSitemap } from '@/lib/sanity'
import { getPriorityUmrahCountries } from '@/lib/seo/umrahPriorityCountries'

const BASE_URL = 'https://visitmakkah.co'

/**
 * Legacy Next.js metadata sitemap (src/app/sitemap.ts).
 *
 * NOTE: This branch later replaces it with a sitemap index + section sitemaps.
 * During rebase conflict resolution we keep this file coherent so the rebase can continue.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let sanitySlugs = { posts: [], guides: [], faqs: [], categories: [] }
  try {
    sanitySlugs = await getAllSlugsForSitemap()
  } catch (error) {
    console.error('Error fetching Sanity slugs for sitemap:', error)
  }

  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/learn`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/prepare`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/explore`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/saved`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/prayer-times`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
  ]

  const blogPosts: MetadataRoute.Sitemap = (sanitySlugs.posts || []).map((slug: string) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const guides: MetadataRoute.Sitemap = (sanitySlugs.guides || []).map((slug: string) => ({
    url: `${BASE_URL}/guides/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const categoryPages: MetadataRoute.Sitemap = (sanitySlugs.categories || []).map((slug: string) => ({
    url: `${BASE_URL}/category/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const priorityCountries = getPriorityUmrahCountries(50)
  const UMRAH_FROM_PAGE_SIZE = 25
  const umrahFromPageCount = Math.ceil(priorityCountries.length / UMRAH_FROM_PAGE_SIZE)

  const umrahFromHubPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/umrah/from`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...Array.from({ length: Math.max(0, umrahFromPageCount - 1) }).map((_, i) => ({
      url: `${BASE_URL}/umrah/from/page/${i + 2}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ]

  const countryPages: MetadataRoute.Sitemap = priorityCountries.map((country) => ({
    url: `${BASE_URL}/umrah/from/${country.name.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const ramadanPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/ramadan/2026`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${BASE_URL}/ramadan/2026/umrah`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${BASE_URL}/ramadan/2026/last-10-nights`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/ramadan/2026/taraweeh`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/ramadan/2026/iftar`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ]

  return [...staticPages, ...ramadanPages, ...blogPosts, ...guides, ...categoryPages, ...umrahFromHubPages, ...countryPages]
}
