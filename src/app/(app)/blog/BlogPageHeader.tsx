'use client'

import { TCategory } from '@/data/categories'
import { Badge } from '@/shared/Badge'
import ButtonCircle from '@/shared/ButtonCircle'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/shared/dropdown'
import {
    CopyLinkIcon,
    Facebook01Icon,
    Mail01Icon,
    NewTwitterIcon,
    Share03Icon,
    Mosque01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'

const BlogPageHeader = ({
    category,
    className,
}: {
    category: TCategory
    className?: string
}) => {
    const { name, description, count } = category

    return (
        <div className={clsx('w-full', className)}>
            {/* Gradient background with pattern */}
            <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 md:h-56">
                {/* Subtle pattern overlay */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            <div className="container -mt-20 md:-mt-24">
                <div className="relative flex flex-col items-start gap-6 rounded-3xl border border-transparent bg-white p-5 shadow-xl md:flex-row md:rounded-4xl lg:p-8 lg:px-9 dark:border-neutral-700 dark:bg-neutral-900">
                    {/* ICON */}
                    <div className="flex size-28 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl ring-4 ring-white lg:size-36 dark:ring-neutral-800">
                        <HugeiconsIcon
                            icon={Mosque01Icon}
                            className="size-14 text-white lg:size-16"
                        />
                    </div>

                    {/* INFO */}
                    <div className="flex-1 lg:ps-4">
                        <div className="max-w-(--breakpoint-sm) space-y-3.5">
                            <div>
                                <Badge color="emerald">Local Insights</Badge>
                                <h1 className="mt-2 text-2xl font-bold lg:text-3xl">
                                    Visit Makkah Blog
                                </h1>
                            </div>
                            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                                {description}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                <p className="flex items-center gap-x-1.5">
                                    <span className="inline-flex size-2 rounded-full bg-emerald-500" />
                                    <span className="font-medium">{count} articles</span>
                                </p>
                                <p className="text-neutral-500 dark:text-neutral-400">
                                    Written by locals, for pilgrims
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-x-2 self-start">
                        <ShareDropdown />
                    </div>
                </div>
            </div>
        </div>
    )
}

function ShareDropdown() {
    const socialsShare = [
        {
            name: 'Facebook',
            href: 'https://www.facebook.com/sharer/sharer.php?u=' + (typeof window !== 'undefined' ? window.location.href : ''),
            icon: Facebook01Icon,
        },
        {
            name: 'Email',
            href: 'mailto:?subject=Visit Makkah Blog&body=Check out these local insights: ' + (typeof window !== 'undefined' ? window.location.href : ''),
            icon: Mail01Icon,
        },
        {
            name: 'Twitter',
            href: 'https://twitter.com/intent/tweet?url=' + (typeof window !== 'undefined' ? window.location.href : '') + '&text=Local insights from Visit Makkah',
            icon: NewTwitterIcon,
        },
        {
            name: 'Copy link',
            href: '#',
            icon: CopyLinkIcon,
            onClick: () => {
                if (typeof navigator !== 'undefined') {
                    navigator.clipboard.writeText(window.location.href)
                }
            },
        },
    ]

    return (
        <Dropdown>
            <DropdownButton as={ButtonCircle} outline className="size-10">
                <HugeiconsIcon icon={Share03Icon} size={20} />
            </DropdownButton>
            <DropdownMenu>
                {socialsShare.map((item, index) => (
                    <DropdownItem
                        key={index}
                        href={item.onClick ? undefined : item.href}
                        onClick={item.onClick}
                    >
                        <HugeiconsIcon icon={item.icon} size={20} data-slot="icon" />
                        {item.name}
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    )
}

export default BlogPageHeader
