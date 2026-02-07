# VisitMakkah.co - API Integration Plan

**Version:** 1.0
**Last Updated:** 2026-02-04

---

## Essential APIs (Must Have)

### 1. Prayer Times & Islamic Calendar
**API:** Aladhan (https://aladhan.com/prayer-times-api)
**Cost:** FREE (unlimited)
**Use For:**
- Daily prayer times for Makkah
- Hijri calendar
- Ramadan dates
- Eid dates
- Qibla direction

```typescript
// Prayer times
GET https://api.aladhan.com/v1/timingsByCity?city=Makkah&country=Saudi%20Arabia&method=4

// Hijri date
GET https://api.aladhan.com/v1/gToH?date=04-02-2026

// Ramadan calendar
GET https://api.aladhan.com/v1/hijriCalendar?month=9&year=1447
```

---

### 2. Weather
**API:** Open-Meteo (https://open-meteo.com)
**Cost:** FREE (unlimited, no API key)
**Use For:**
- Current weather in Makkah
- 7-day forecast
- Historical averages (best time to visit)

```typescript
// Makkah weather
GET https://api.open-meteo.com/v1/forecast?latitude=21.4225&longitude=39.8262&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Riyadh

// Historical averages
GET https://archive-api.open-meteo.com/v1/era5?latitude=21.4225&longitude=39.8262&start_date=2020-01-01&end_date=2020-12-31&daily=temperature_2m_mean
```

---

### 3. Currency Exchange
**API:** ExchangeRate-API (https://exchangerate-api.com)
**Cost:** FREE (1,500 calls/month)
**Use For:**
- SAR to user's currency
- Budget calculator
- Price displays

```typescript
// SAR exchange rates
GET https://api.exchangerate-api.com/v4/latest/SAR

// Response includes: USD, EUR, GBP, INR, PKR, MYR, IDR, etc.
```

---

### 4. Maps & Geocoding
**APIs:** 
- Mapbox (https://mapbox.com) - FREE (100k requests/month)
- Nominatim/OSM - FREE (unlimited, fair use)

**Use For:**
- Interactive Haram map
- Hotel locations
- Walking distances
- Directions

```typescript
// Mapbox map tile
mapboxgl.Map({ container: 'map', style: 'mapbox://styles/mapbox/streets-v11' })

// Nominatim geocoding
GET https://nominatim.openstreetmap.org/search?q=Masjid+al+Haram&format=json
```

---

## Important APIs (High Value)

### 5. Hotels
**API:** Booking.com Affiliate API
**Cost:** FREE (affiliate program)
**Use For:**
- Hotel listings
- Prices
- Availability
- Affiliate revenue

**Alternative:** Foursquare Places API for basic hotel data

---

### 6. Flights
**API:** Skyscanner Affiliate API
**Cost:** FREE (affiliate program)
**Use For:**
- Flight search widget
- Price comparisons
- Affiliate revenue

---

### 7. Places & Restaurants
**API:** Foursquare Places API (https://foursquare.com/developers)
**Cost:** FREE (950 calls/day)
**Use For:**
- Restaurant data
- Points of interest
- Ratings
- Photos

```typescript
// Restaurants near Haram
GET https://api.foursquare.com/v3/places/search?ll=21.4225,39.8262&categories=13065&radius=2000
Headers: { 'Authorization': 'fsq3...' }
```

---

### 8. Translation
**API:** DeepL API (https://deepl.com/pro-api)
**Cost:** FREE (500k chars/month)
**Use For:**
- English ↔ Arabic translations
- Content localization

```typescript
POST https://api-free.deepl.com/v2/translate
Body: { text: "Welcome to Makkah", target_lang: "AR" }
```

---

## Nice to Have APIs

### 9. Travel Advisories
**API:** Travel Advisory (https://www.travel-advisory.info)
**Cost:** FREE
**Use For:**
- Safety information
- Travel warnings

```typescript
GET https://www.travel-advisory.info/api?countrycode=SA
```

---

### 10. Country Data
**API:** REST Countries (https://restcountries.com)
**Cost:** FREE
**Use For:**
- Country flags
- Currencies
- Languages
- Seeding country pages

```typescript
GET https://restcountries.com/v3.1/all?fields=name,cca2,currencies,flags,languages
```

---

### 11. IP Geolocation
**API:** ip-api (http://ip-api.com)
**Cost:** FREE (45 calls/min)
**Use For:**
- Auto-detect user country
- Show relevant currency
- Personalize content

```typescript
GET http://ip-api.com/json/{ip}
```

---

## Data Seeding Strategy

### One-Time Seed (Initial Data)
```bash
npm run seed:countries   # REST Countries API
npm run seed:gates       # Manual JSON (fixed data)
npm run seed:hotels      # Foursquare + manual curation
npm run seed:restaurants # Foursquare + manual curation
npm run seed:embeddings  # Generate vector embeddings
```

### Periodic Sync (Cron Jobs)
| Data | Frequency | API |
|------|-----------|-----|
| Weather | Every 6 hours | Open-Meteo |
| Currency | Daily | ExchangeRate-API |
| Prayer times | Monthly | Aladhan |
| Hotel prices | Weekly | Booking.com |

### Real-Time (On Request)
| Data | Trigger | API |
|------|---------|-----|
| Prayer times | Page load | Aladhan (cached) |
| Flight search | User search | Skyscanner |
| Currency convert | Calculator use | Cached rates |

---

## API Environment Variables

```env
# Maps
NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx

# Places
FOURSQUARE_API_KEY=fsq3xxx

# Translation
DEEPL_API_KEY=xxx

# Hotels (Affiliate)
BOOKING_AFFILIATE_ID=xxx

# Flights (Affiliate)
SKYSCANNER_API_KEY=xxx

# AI (for embeddings)
OPENAI_API_KEY=sk-xxx
```

---

## Cost Summary

| API | Monthly Limit | Expected Use | Cost |
|-----|---------------|--------------|------|
| Aladhan | Unlimited | 50k calls | FREE |
| Open-Meteo | Unlimited | 10k calls | FREE |
| ExchangeRate | 1,500 | 1k calls | FREE |
| Mapbox | 100k | 50k calls | FREE |
| Foursquare | 28k | 20k calls | FREE |
| DeepL | 500k chars | 200k chars | FREE |
| REST Countries | Unlimited | 1 call (seed) | FREE |
| **TOTAL** | | | **$0/month** |

---

## Integration Priority

### Phase 1 (Week 1-2)
1. ✅ Aladhan (prayer times)
2. ✅ Open-Meteo (weather)
3. ✅ Mapbox (maps)

### Phase 2 (Week 3-4)
4. ✅ ExchangeRate-API (currency)
5. ✅ Foursquare (places)
6. ✅ REST Countries (seed data)

### Phase 3 (Week 5-6)
7. ✅ Booking.com affiliate
8. ✅ Skyscanner affiliate
9. ✅ DeepL (translation)

---

*All APIs selected for free tiers and Makkah/Saudi Arabia data availability.*
