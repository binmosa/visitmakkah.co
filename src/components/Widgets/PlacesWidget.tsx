'use client'

/**
 * PlacesWidget Component
 *
 * Displays location cards for hotels, restaurants, and landmarks.
 * Expects normalized data from widget-normalizer.
 */

import { Location01Icon, StarIcon, Navigation02Icon, Call02Icon, Globe02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

// Normalized types
interface NormalizedPlace {
  id: string
  name: string
  arabicName?: string
  description: string
  category: 'hotel' | 'restaurant' | 'landmark' | 'service' | 'transport'
  location: {
    area: string
    distanceToHaram?: string
    coordinates?: { lat: number; lng: number } | null
  }
  rating?: number | null
  priceRange?: string | null
  amenities?: string[]
  tips?: string[]
  contact?: { phone?: string; website?: string } | null
}

interface NormalizedPlaces {
  title: string
  description?: string
  places: NormalizedPlace[]
}

interface PlacesWidgetProps {
  data: unknown
}

export default function PlacesWidget({ data }: PlacesWidgetProps) {
  const places = data as NormalizedPlaces

  if (!places?.places?.length) {
    return null
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      {/* Header */}
      <div className="border-b border-neutral-200 px-4 py-3 dark:border-neutral-700">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{places.title}</h3>
        {places.description && (
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            {places.description}
          </p>
        )}
      </div>

      {/* Places Grid */}
      <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
        {places.places.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>
    </div>
  )
}

interface PlaceCardProps {
  place: NormalizedPlace
}

function PlaceCard({ place }: PlaceCardProps) {
  const categoryColors = {
    hotel: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    restaurant: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    landmark: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    service: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    transport: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  }

  const categoryIcons = {
    hotel: '🏨',
    restaurant: '🍽️',
    landmark: '🕌',
    service: '🏪',
    transport: '🚌',
  }

  return (
    <div className="p-4">
      <div className="flex gap-4">
        {/* Icon/Image placeholder */}
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-2xl dark:bg-neutral-800">
          {categoryIcons[place.category] || '📍'}
        </div>

        <div className="flex-1">
          {/* Name and Category */}
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white">{place.name}</h4>
              {place.arabicName && (
                <p className="font-arabic text-sm text-neutral-500 dark:text-neutral-400" dir="rtl">
                  {place.arabicName}
                </p>
              )}
            </div>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${categoryColors[place.category]}`}>
              {place.category.charAt(0).toUpperCase() + place.category.slice(1)}
            </span>
          </div>

          {/* Description */}
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{place.description}</p>

          {/* Location & Distance */}
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
              <HugeiconsIcon icon={Location01Icon} className="size-3.5" strokeWidth={1.5} />
              {place.location.area}
            </span>
            {place.location.distanceToHaram && (
              <span className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400">
                <HugeiconsIcon icon={Navigation02Icon} className="size-3.5" strokeWidth={1.5} />
                {place.location.distanceToHaram} from Haram
              </span>
            )}
          </div>

          {/* Rating & Price */}
          <div className="mt-2 flex items-center gap-3">
            {place.rating && (
              <span className="flex items-center gap-1 text-sm">
                <HugeiconsIcon icon={StarIcon} className="size-4 text-amber-500" strokeWidth={1.5} />
                <span className="font-medium text-neutral-900 dark:text-white">{place.rating}</span>
              </span>
            )}
            {place.priceRange && (
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {place.priceRange}
              </span>
            )}
          </div>

          {/* Amenities */}
          {place.amenities && place.amenities.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {place.amenities.slice(0, 5).map((amenity, i) => (
                <span
                  key={i}
                  className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                >
                  {amenity}
                </span>
              ))}
              {place.amenities.length > 5 && (
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                  +{place.amenities.length - 5} more
                </span>
              )}
            </div>
          )}

          {/* Contact */}
          {place.contact && (
            <div className="mt-2 flex gap-3">
              {place.contact.phone && (
                <a
                  href={`tel:${place.contact.phone}`}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-400"
                >
                  <HugeiconsIcon icon={Call02Icon} className="size-3.5" strokeWidth={1.5} />
                  Call
                </a>
              )}
              {place.contact.website && (
                <a
                  href={place.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-400"
                >
                  <HugeiconsIcon icon={Globe02Icon} className="size-3.5" strokeWidth={1.5} />
                  Website
                </a>
              )}
            </div>
          )}

          {/* Tips */}
          {place.tips && place.tips.length > 0 && (
            <div className="mt-2 rounded-lg bg-amber-50 px-2 py-1.5 dark:bg-amber-900/20">
              <p className="text-xs text-amber-700 dark:text-amber-400">💡 {place.tips[0]}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
