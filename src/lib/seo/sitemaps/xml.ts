import { NextResponse } from 'next/server'

export type SitemapUrl = {
  loc: string
  lastmod?: Date
  changefreq?: string
  priority?: number
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function fmtDate(d: Date) {
  // ISO-8601
  return d.toISOString()
}

export function sitemapXml(urls: SitemapUrl[]) {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => {
    const parts = [
      `  <url>`,
      `    <loc>${escapeXml(u.loc)}</loc>`,
      u.lastmod ? `    <lastmod>${fmtDate(u.lastmod)}</lastmod>` : null,
      u.changefreq ? `    <changefreq>${escapeXml(u.changefreq)}</changefreq>` : null,
      typeof u.priority === 'number' ? `    <priority>${u.priority.toFixed(1)}</priority>` : null,
      `  </url>`,
    ].filter(Boolean)
    return parts.join('\n')
  })
  .join('\n')}
</urlset>
`

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      // Sitemaps can be cached; keep shortish since content changes.
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}

export function sitemapIndexXml(entries: { loc: string; lastmod?: Date }[]) {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map((e) => {
    const parts = [
      `  <sitemap>`,
      `    <loc>${escapeXml(e.loc)}</loc>`,
      e.lastmod ? `    <lastmod>${fmtDate(e.lastmod)}</lastmod>` : null,
      `  </sitemap>`,
    ].filter(Boolean)
    return parts.join('\n')
  })
  .join('\n')}
</sitemapindex>
`

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
