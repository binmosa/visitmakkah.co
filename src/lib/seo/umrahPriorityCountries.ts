import type { Country } from '@/data/countries'
import { countries } from '@/data/countries'

/**
 * Priority countries for Umrah pSEO rollout (Option B).
 *
 * Goal: focus on high-volume, Muslim-majority / high-pilgrim-origin countries
 * first, instead of generating every country at once.
 *
 * NOTE: We intentionally include a few non-majority countries (e.g. UK/US)
 * because they are high search volume sources for Umrah planning.
 */
export const UMRAH_PRIORITY_COUNTRY_CODES: string[] = [
  // Gulf / Saudi region
  'SA', 'AE', 'QA', 'KW', 'BH', 'OM',

  // South Asia
  'PK', 'IN', 'BD', 'LK',

  // Southeast Asia
  'ID', 'MY', 'SG', 'BN',

  // MENA (high pilgrim volume)
  'EG', 'TR', 'IQ', 'JO', 'SY', 'YE', 'PS',
  'MA', 'DZ', 'TN', 'LY', 'SD',

  // Africa (high pilgrim volume)
  'NG', 'SN', 'GH', 'ET', 'SO', 'ZA', 'KE', 'UG', 'TZ',

  // Central Asia / Caucasus
  'KZ', 'UZ', 'KG', 'TJ', 'AZ',

  // Europe / diaspora markets
  'GB', 'FR', 'DE', 'NL',

  // Americas / diaspora markets
  'US', 'CA',
]

export function getPriorityUmrahCountries(limit = 50): Country[] {
  const byCode = new Map(countries.map((c) => [c.code, c]))

  const prioritized: Country[] = []
  for (const code of UMRAH_PRIORITY_COUNTRY_CODES) {
    const c = byCode.get(code)
    if (c) prioritized.push(c)
    if (prioritized.length >= limit) return prioritized
  }

  // Fallback: if our curated list is shorter than limit, fill from the global list.
  for (const c of countries) {
    if (prioritized.length >= limit) break
    if (prioritized.some((p) => p.code === c.code)) continue
    prioritized.push(c)
  }

  return prioritized
}
