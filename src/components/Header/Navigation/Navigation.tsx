'use client'

import { TNavigationItem } from '@/data/navigation'
import {
  ClipboardIcon,
  BookOpen01Icon,
  MapsIcon,
  News01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FC } from 'react'

// Icon mapping for top-level navigation items
const navIcons: Record<string, typeof ClipboardIcon> = {
  'prepare': ClipboardIcon,
  'learn': BookOpen01Icon,
  'explore': MapsIcon,
  'blog': News01Icon,
}

const NavLink = ({ menuItem, isActive }: { menuItem: TNavigationItem; isActive: boolean }) => {
  const IconComponent = navIcons[menuItem.id] || ClipboardIcon

  return (
    <Link
      href={menuItem.href || '#'}
      className={clsx(
        "group flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors lg:text-[15px] xl:px-5",
        isActive
          ? "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
          : "text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-primary-500"
      )}
    >
      <HugeiconsIcon
        icon={IconComponent}
        size={18}
        className={clsx(
          "flex-shrink-0",
          isActive
            ? "text-primary-600 dark:text-primary-400"
            : "text-neutral-500 group-hover:text-primary-600 dark:text-neutral-400"
        )}
      />
      {menuItem.name}
      {menuItem.badge && (
        <span className="ml-1 rounded-full bg-primary-100 px-1.5 py-0.5 text-[10px] font-semibold text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
          {menuItem.badge}
        </span>
      )}
    </Link>
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
        <NavLink
          key={menuItem.id}
          menuItem={menuItem}
          isActive={isMenuItemActive(menuItem)}
        />
      ))}
    </nav>
  )
}

export default Navigation
