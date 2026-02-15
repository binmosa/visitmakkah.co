export type IndexingPolicy = {
  allowIndex: boolean
  reason: string
}

// Staged indexing for programmatic pages.
// Goal: launch at full coverage, but keep indexing conservative until crawl + quality signals stabilize.
//
// For /umrah/from/[country]:
// - Index top N countries (highest demand) immediately.
// - Noindex the rest, but allow crawling (follow=true) so internal discovery works.

const INDEX_TOP_COUNTRIES = 50

export function getUmrahFromCountryIndexingPolicy(countryRank: number | null): IndexingPolicy {
  if (countryRank == null) return { allowIndex: false, reason: 'unknown_country_rank' }

  const allowIndex = countryRank < INDEX_TOP_COUNTRIES
  return {
    allowIndex,
    reason: allowIndex ? `top_${INDEX_TOP_COUNTRIES}` : 'staged_noindex',
  }
}
