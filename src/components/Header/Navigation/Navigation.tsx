'use client'

import { TNavigationItem } from '@/data/navigation'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import {
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
import { usePathname } from 'next/navigation'
import { FC } from 'react'

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

const NavDropdown = ({ menuItem, isActive }: { menuItem: TNavigationItem; isActive: boolean }) => {
  const pathname = usePathname()
  const IconComponent = navIcons[menuItem.id] || ClipboardIcon

  const isChildActive = (child: TNavigationItem) => {
    if (!child.href || child.href === '#') return false
    return pathname === child.href || pathname.startsWith(child.href + '/')
  }

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <PopoverButton
            className={clsx(
              "group flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium whitespace-nowrap focus:outline-none lg:text-[15px] xl:px-5",
              isActive || open
                ? "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
                : "text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-primary-500"
            )}
          >
            <HugeiconsIcon
              icon={IconComponent}
              size={18}
              className={clsx(
                "flex-shrink-0",
                isActive || open
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-neutral-500 group-hover:text-primary-600 dark:text-neutral-400"
              )}
            />
            {menuItem.name}
            <ChevronDownIcon
              className={clsx(
                "size-3.5 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </PopoverButton>

          <PopoverPanel
            transition
            className="absolute left-0 top-full z-50 mt-2 w-64 origin-top-left rounded-xl bg-white p-2 shadow-lg ring-1 ring-neutral-200 transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 dark:bg-neutral-900 dark:ring-neutral-700"
          >
            <div className="space-y-1">
              {menuItem.children?.map((child) => {
                const ChildIcon = navIcons[child.id]
                const childActive = isChildActive(child)

                return (
                  <Link
                    key={child.id}
                    href={child.href || '#'}
                    className={clsx(
                      "flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors",
                      childActive
                        ? "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
                        : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    )}
                  >
                    {ChildIcon && (
                      <HugeiconsIcon
                        icon={ChildIcon}
                        size={18}
                        className={clsx(
                          "mt-0.5 flex-shrink-0",
                          childActive
                            ? "text-primary-600 dark:text-primary-400"
                            : "text-neutral-400 dark:text-neutral-500"
                        )}
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium">{child.name}</div>
                      {child.description && (
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          {child.description}
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </PopoverPanel>
        </>
      )}
    </Popover>
  )
}

export interface Props {
  menu: TNavigationItem[]
  className?: string
}

const Navigation: FC<Props> = ({ menu, className }) => {
  const pathname = usePathname()

  const isMenuItemActive = (menuItem: TNavigationItem) => {
    if (!menuItem.href || menuItem.href === '#') return false
    return pathname === menuItem.href || pathname.startsWith(menuItem.href + '/')
  }

  return (
    <nav className={clsx('flex items-center gap-1', className)}>
      {menu.map((menuItem) => (
        <NavDropdown
          key={menuItem.id}
          menuItem={menuItem}
          isActive={isMenuItemActive(menuItem)}
        />
      ))}
    </nav>
  )
}

export default Navigation
