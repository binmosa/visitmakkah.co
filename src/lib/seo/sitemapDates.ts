/**
 * Keep sitemaps stable.
 *
 * Avoid using `new Date()` for every URL on every deploy: it makes Google think
 * the entire site changed daily and wastes crawl budget.
 */

// Update this when you make a meaningful template/content change.
export const UMRAH_FROM_TEMPLATE_LASTMOD = new Date('2026-02-17T00:00:00.000Z')

// Static pages can share a stable lastmod (bump when you change core pages).
export const STATIC_PAGES_LASTMOD = new Date('2026-02-17T00:00:00.000Z')
