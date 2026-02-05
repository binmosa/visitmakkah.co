'use client'

import { TNavigationItem } from '@/data/navigation'
import { Divider } from '@/shared/divider'
import { Link } from '@/shared/link'
import SocialsList from '@/shared/SocialsList'
import { useClose } from '@headlessui/react'
import { Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import { redirect, usePathname } from 'next/navigation'
import React from 'react'

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

  const _renderItem = (menu: TNavigationItem, index: number) => {
    const isActive = isMenuItemActive(menu)
    return (
      <li key={index} className="text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 last:border-0">
        <Link
          href={menu.href || '#'}
          className={clsx(
            "flex w-full cursor-pointer rounded-lg px-3 py-3 text-start text-sm font-semibold tracking-wide uppercase transition-colors",
            isActive
              ? "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
              : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
          )}
          onClick={handleClose}
        >
          {menu.name}
        </Link>
      </li>
    )
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
            placeholder="Type and press enter"
            className="w-full border-none bg-transparent focus:ring-0 focus:outline-hidden sm:text-sm"
          />
        </div>
        <input type="submit" hidden value="" />
      </form>
    )
  }

  return (
    <div>
      <p className="text-sm/relaxed">
        Discover the most outstanding articles on all topics of life. Write your stories and share them
      </p>
      <div className="mt-5 flex items-center justify-between">
        <SocialsList />
      </div>
      <div className="mt-5">{renderSearchForm()}</div>
      <ul className="flex flex-col gap-y-1 px-2 py-6">{data?.map(_renderItem)}</ul>
      <Divider className="mb-6" />

    </div>
  )
}

export default SidebarNavigation
