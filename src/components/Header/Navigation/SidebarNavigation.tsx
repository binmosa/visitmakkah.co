'use client'

import { TNavigationItem } from '@/data/navigation'
import { Disclosure, DisclosureButton, DisclosurePanel, useClose } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import {
  Search01Icon,
  ClipboardIcon,
  BookOpen01Icon,
  MapsIcon,
  Idea01Icon,
  Route01Icon,
  Passport01Icon,
  Backpack03Icon,
  Calculator01Icon,
  Kaaba02Icon,
  Mosque01Icon,
  CheckListIcon,
  PrayerRugIcon,
  Building03Icon,
  Restaurant01Icon,
  UserGroup03Icon,
  CompassIcon,
  StarIcon,
  UserLove01Icon,
  Moon02Icon,
  Location01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import Link from 'next/link'
import { redirect, usePathname } from 'next/navigation'
import React from 'react'

// Icon mapping for navigation items
const navIcons: Record<string, typeof ClipboardIcon> = {
  // Main categories
  'prepare': ClipboardIcon,
  'learn': BookOpen01Icon,
  'explore': MapsIcon,
  'tips': Idea01Icon,
  // Prepare children
  'prepare-itinerary': Route01Icon,
  'prepare-visa': Passport01Icon,
  'prepare-packing': Backpack03Icon,
  'prepare-budget': Calculator01Icon,
  // Learn children
  'learn-umrah': Kaaba02Icon,
  'learn-hajj': Mosque01Icon,
  'learn-rituals': CheckListIcon,
  'learn-duas': PrayerRugIcon,
  // Explore children
  'explore-hotels': Building03Icon,
  'explore-food': Restaurant01Icon,
  'explore-crowds': UserGroup03Icon,
  'explore-navigate': CompassIcon,
  // Tips children
  'tips-first-timers': StarIcon,
  'tips-women': UserLove01Icon,
  'tips-ramadan': Moon02Icon,
  'tips-shortcuts': Location01Icon,
}

interface Props {
  data: TNavigationItem[]
}

const SidebarNavigation: React.FC<Props> = ({ data }) => {
  const handleClose = useClose()
  const pathname = usePathname()

  const isMenuItemActive = (menu: TNavigationItem) => {
    if (!menu.href || menu.href === '#') return false
    return pathname === menu.href || pathname.startsWith(menu.href + '/')
  }

  const renderSearchForm = () => {
    return (
      <form
        action="#"
        method="POST"
        className="flex-1 text-neutral-900 dark:text-neutral-200"
        onSubmit={(e) => {
          e.preventDefault()
          handleClose()
          redirect('/search')
        }}
      >
        <div className="flex h-full items-center gap-x-2.5 rounded-xl bg-neutral-50 px-3 py-3 dark:bg-neutral-800">
          <HugeiconsIcon icon={Search01Icon} size={24} color="currentColor" strokeWidth={1.5} />
          <input
            type="search"
            placeholder="Search..."
            className="w-full border-none bg-transparent focus:ring-0 focus:outline-hidden sm:text-sm"
          />
        </div>
        <input type="submit" hidden value="" />
      </form>
    )
  }

  const renderCategory = (category: TNavigationItem) => {
    const isActive = isMenuItemActive(category)
    const CategoryIcon = navIcons[category.id] || ClipboardIcon
    const hasChildren = category.children && category.children.length > 0

    if (!hasChildren) {
      return (
        <Link
          key={category.id}
          href={category.href || '#'}
          onClick={handleClose}
          className={clsx(
            "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition-colors",
            isActive
              ? "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
              : "text-neutral-900 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800"
          )}
        >
          <HugeiconsIcon icon={CategoryIcon} size={20} className="flex-shrink-0" />
          {category.name}
        </Link>
      )
    }

    return (
      <Disclosure key={category.id} defaultOpen={isActive}>
        {({ open }) => (
          <div className="border-b border-neutral-100 dark:border-neutral-800 last:border-0">
            <DisclosureButton
              className={clsx(
                "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition-colors",
                isActive
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-neutral-900 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800"
              )}
            >
              <span className="flex items-center gap-3">
                <HugeiconsIcon
                  icon={CategoryIcon}
                  size={20}
                  className={clsx(
                    "flex-shrink-0",
                    isActive ? "text-primary-600 dark:text-primary-400" : "text-neutral-500"
                  )}
                />
                {category.name}
              </span>
              <ChevronDownIcon
                className={clsx(
                  "size-4 transition-transform duration-200",
                  open && "rotate-180"
                )}
              />
            </DisclosureButton>

            <DisclosurePanel className="pb-2">
              <div className="ml-8 space-y-1">
                {category.children?.map((child) => {
                  const ChildIcon = navIcons[child.id]
                  const childActive = isMenuItemActive(child)

                  return (
                    <Link
                      key={child.id}
                      href={child.href || '#'}
                      onClick={handleClose}
                      className={clsx(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                        childActive
                          ? "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                      )}
                    >
                      {ChildIcon && (
                        <HugeiconsIcon
                          icon={ChildIcon}
                          size={18}
                          className={clsx(
                            "flex-shrink-0",
                            childActive ? "text-primary-600 dark:text-primary-400" : "text-neutral-400"
                          )}
                        />
                      )}
                      <span>{child.name}</span>
                    </Link>
                  )
                })}
              </div>
            </DisclosurePanel>
          </div>
        )}
      </Disclosure>
    )
  }

  return (
    <div>
      <p className="text-sm/relaxed text-neutral-600 dark:text-neutral-400">
        Your AI-powered guide to Makkah for Umrah and Hajj
      </p>
      <div className="mt-5">{renderSearchForm()}</div>
      <div className="mt-6 space-y-1">
        {data?.map(renderCategory)}
      </div>
    </div>
  )
}

export default SidebarNavigation
