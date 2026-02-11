'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ClipboardIcon,
  BookOpen01Icon,
  MapsIcon,
  FolderLibraryIcon,
  News01Icon,
} from '@hugeicons/core-free-icons'
import { TNavigationItem, getNavigation } from '@/data/navigation'

// Icon mapping for main navigation
const navIcons: Record<string, typeof ClipboardIcon> = {
  'prepare': ClipboardIcon,
  'learn': BookOpen01Icon,
  'explore': MapsIcon,
  'saved': FolderLibraryIcon,
  'blog': News01Icon,
}

export default function MobileNavTabs() {
  const pathname = usePathname()
  const [navItems, setNavItems] = useState<TNavigationItem[]>([])

  useEffect(() => {
    getNavigation().then(setNavItems)
  }, [])

  const isActive = (item: TNavigationItem) => {
    if (!item.href || item.href === '#') return false
    return pathname === item.href || pathname.startsWith(item.href + '/')
  }

  if (navItems.length === 0) return null

  return (
    <div className="relative bg-white dark:bg-neutral-900 lg:hidden">
      {/* Fade edge indicators */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-4 bg-gradient-to-r from-white to-transparent dark:from-neutral-900" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-4 bg-gradient-to-l from-white to-transparent dark:from-neutral-900" />

      {/* Scrollable tabs container */}
      <div
        className="hidden-scrollbar flex gap-1.5 overflow-x-auto overscroll-x-contain px-4 py-2.5"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {navItems.map((item) => {
          const IconComponent = navIcons[item.id] || ClipboardIcon
          const active = isActive(item)

          return (
            <Link
              key={item.id}
              href={item.href || '#'}
              className={clsx(
                'flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-95',
                active
                  ? 'bg-primary-600 text-white shadow-sm dark:bg-primary-700'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
              )}
            >
              <HugeiconsIcon
                icon={IconComponent}
                className={clsx(
                  'size-4',
                  active
                    ? 'text-white'
                    : 'text-neutral-500 dark:text-neutral-400'
                )}
                strokeWidth={1.5}
              />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
