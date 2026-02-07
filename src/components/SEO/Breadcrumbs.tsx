'use client'

import Link from 'next/link'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'
import { BreadcrumbSchema } from './JsonLd'
import { SITE_CONFIG } from '@/data/site-config'

// ============================================
// BREADCRUMBS COMPONENT
// Visual breadcrumbs with JSON-LD schema
// ============================================

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  // Add home as first item
  const allItems = [{ label: 'Home', href: '/' }, ...items]

  // Convert to schema format
  const schemaItems = allItems.map((item) => ({
    name: item.label,
    url: `${SITE_CONFIG.url}${item.href}`,
  }))

  return (
    <>
      {/* JSON-LD Schema */}
      <BreadcrumbSchema items={schemaItems} />

      {/* Visual Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center text-sm text-neutral-500 dark:text-neutral-400 ${className}`}
      >
        <ol className="flex items-center flex-wrap gap-1">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1

            return (
              <li key={item.href} className="flex items-center">
                {index === 0 ? (
                  // Home icon for first item
                  <Link
                    href={item.href}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    aria-label="Home"
                  >
                    <HomeIcon className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <ChevronRightIcon className="w-4 h-4 mx-1 text-neutral-400" />
                    {isLast ? (
                      <span
                        className="text-neutral-900 dark:text-neutral-100 font-medium"
                        aria-current="page"
                      >
                        {item.label}
                      </span>
                    ) : (
                      <Link
                        href={item.href}
                        className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}

export default Breadcrumbs
