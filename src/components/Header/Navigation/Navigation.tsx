'use client'

import Card20 from '@/components/PostCards/Card20'
import { TNavigationItem } from '@/data/navigation'
import { TPost } from '@/data/posts'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FC } from 'react'

import { getIcon } from '@/utils/get-icon'

const Lv1MenuItem = ({ menuItem, isActive }: { menuItem: TNavigationItem; isActive?: boolean }) => {
  return (
    <Link
      className={clsx(
        "group flex items-center self-center rounded-full px-4 py-2.5 text-sm font-medium whitespace-nowrap lg:text-[15px] xl:px-5",
        isActive
          ? "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
          : "text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-primary-500"
      )}
      href={menuItem.href || '#'}
    >
      {menuItem.icon && (() => {
        const IconComponent = getIcon(menuItem.icon)
        return IconComponent ? (
          <IconComponent
            className={clsx(
              "me-2.5 text-xl flex-shrink-0",
              isActive
                ? "text-primary-600 dark:text-primary-400"
                : "text-neutral-500 group-hover:text-primary-600 dark:text-neutral-400 dark:group-hover:text-primary-500"
            )}
          />
        ) : null
      })()}
      {menuItem.name}
    </Link>
  )
}

export interface Props {
  menu: TNavigationItem[]
  className?: string
  featuredPosts: TPost[]
}
const Navigation: FC<Props> = ({ menu, className, featuredPosts }) => {
  const pathname = usePathname()

  const isMenuItemActive = (menuItem: TNavigationItem) => {
    if (!menuItem.href || menuItem.href === '#') return false
    // Check if current path starts with the menu item's href
    return pathname === menuItem.href || pathname.startsWith(menuItem.href + '/')
  }

  return (
    <ul className={clsx('flex', className)}>
      {menu.map((menuItem) => (
        <li key={menuItem.id} className="relative menu-item flex">
          <Lv1MenuItem key={menuItem.id} menuItem={menuItem} isActive={isMenuItemActive(menuItem)} />
        </li>
      ))}
    </ul>
  )
}

export default Navigation
