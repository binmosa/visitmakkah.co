'use client'

import { TNavigationItem } from '@/data/navigation'
import { usePathname } from 'next/navigation'
import { FC, useRef, useEffect } from 'react'
import {
    // Prepare icons
    ClipboardIcon,
    Route01Icon,
    Passport01Icon,
    Backpack03Icon,
    Calculator01Icon,
    // Learn icons
    BookOpen01Icon,
    Kaaba02Icon,
    Mosque01Icon,
    CheckListIcon,
    PrayerRugIcon,
    // Explore icons
    MapsIcon,
    Building03Icon,
    Restaurant01Icon,
    UserGroup03Icon,
    CompassIcon,
    Idea01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

// Icon mapping for navigation items based on href slug
const iconMap: Record<string, typeof ClipboardIcon> = {
    // Prepare category
    'prepare': ClipboardIcon,
    'build-itinerary': Route01Icon,
    'get-visa': Passport01Icon,
    'pack-my-bag': Backpack03Icon,
    'calculate-budget': Calculator01Icon,
    // Learn category
    'learn': BookOpen01Icon,
    'umrah-guide': Kaaba02Icon,
    'hajj-guide': Mosque01Icon,
    'step-by-step': CheckListIcon,
    'duas-prayers': PrayerRugIcon,
    // Explore category
    'explore': MapsIcon,
    'find-hotels': Building03Icon,
    'find-food': Restaurant01Icon,
    'check-crowds': UserGroup03Icon,
    'navigate': CompassIcon,
    'local-tips': Idea01Icon,
}

interface HubNavCardProps {
    item: TNavigationItem
    isActive?: boolean
    isCurrentPage?: boolean
    onClick?: () => void
}

// Pill-style navigation item for horizontal scroll on mobile
const HubNavPill: FC<HubNavCardProps> = ({ item, isActive, isCurrentPage, onClick }) => {
    const hrefKey = item.href?.split('/').pop() || ''
    const IconComponent = iconMap[hrefKey] || ClipboardIcon
    const isHighlighted = isActive || isCurrentPage

    return (
        <button
            onClick={onClick}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${isHighlighted
                ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm dark:border-primary-400 dark:bg-primary-900/30 dark:text-primary-300'
                : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary-300 hover:bg-primary-50/50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-primary-600'
                }`}
        >
            <HugeiconsIcon
                icon={IconComponent}
                className={`size-4 ${isHighlighted
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-neutral-500 dark:text-neutral-400'
                    }`}
            />
            <span className="whitespace-nowrap">{item.name}</span>
        </button>
    )
}

// Card-style navigation item for grid on desktop
const HubNavCard: FC<HubNavCardProps> = ({ item, isActive, isCurrentPage, onClick }) => {
    const hrefKey = item.href?.split('/').pop() || ''
    const IconComponent = iconMap[hrefKey] || ClipboardIcon
    const isHighlighted = isActive || isCurrentPage

    return (
        <button
            onClick={onClick}
            className={`group relative flex w-full flex-col items-center overflow-hidden rounded-xl border p-3 text-center transition-all duration-200 ${isHighlighted
                ? 'border-primary-500 bg-primary-50 shadow-sm dark:border-primary-400 dark:bg-primary-900/30'
                : 'border-neutral-200 bg-white hover:border-primary-300 hover:bg-primary-50/50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-primary-600'
                }`}
        >
            {/* Islamic pattern background */}
            <div
                className="pointer-events-none absolute inset-0 opacity-100"
                style={{
                    backgroundImage: 'url(/images/islamic-pattern.png)',
                    backgroundPosition: 'left center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'auto 100%',
                }}
            />
            {/* Icon */}
            <div
                className={`relative z-10 mb-2 flex size-12 items-center justify-center rounded-lg ${isHighlighted
                    ? 'bg-primary-100 dark:bg-primary-800/50'
                    : 'bg-neutral-100 group-hover:bg-primary-100/50 dark:bg-neutral-700 dark:group-hover:bg-primary-800/30'
                    }`}
            >
                <HugeiconsIcon
                    icon={IconComponent}
                    className={`size-6 transition-transform duration-200 group-hover:scale-110 ${isHighlighted
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-neutral-600 group-hover:text-primary-600 dark:text-neutral-400 dark:group-hover:text-primary-400'
                        }`}
                />
            </div>

            {/* Title */}
            <p
                className={`relative z-10 text-xs font-medium leading-tight ${isHighlighted
                    ? 'text-primary-700 dark:text-primary-300'
                    : 'text-neutral-700 dark:text-neutral-300'
                    }`}
            >
                {item.name}
            </p>

            {/* Description (if available) */}
            {item.description && (
                <p className="relative z-10 mt-0.5 line-clamp-1 text-[10px] text-neutral-500 dark:text-neutral-400">
                    {item.description}
                </p>
            )}
        </button>
    )
}

interface HubNavMenuProps {
    items: TNavigationItem[]
    activeId?: string | null
    onItemClick?: (id: string) => void
    categoryId?: string
}

const HubNavMenu: FC<HubNavMenuProps> = ({ items, activeId, onItemClick, categoryId }) => {
    const pathname = usePathname()
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    // Scroll to active item on mount
    useEffect(() => {
        if (scrollContainerRef.current && activeId) {
            const activeButton = scrollContainerRef.current.querySelector(`[data-id="${activeId}"]`)
            if (activeButton) {
                activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
            }
        }
    }, [activeId])

    if (!items || items.length === 0) {
        return null
    }

    return (
        <div className="hub-nav-menu">
            {/* Mobile: Horizontal scrolling pills */}
            <div
                ref={scrollContainerRef}
                className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 hidden-scrollbar sm:hidden"
            >
                {items.map((item, index) => (
                    <div key={item.id || index} data-id={item.id}>
                        <HubNavPill
                            item={item}
                            isActive={activeId === item.id}
                            isCurrentPage={pathname === item.href}
                            onClick={() => onItemClick?.(item.id || '')}
                        />
                    </div>
                ))}
            </div>

            {/* Desktop: Grid of cards */}
            <div className="hidden gap-3 sm:grid sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4">
                {items.map((item, index) => (
                    <HubNavCard
                        key={item.id || index}
                        item={item}
                        isActive={activeId === item.id}
                        isCurrentPage={pathname === item.href}
                        onClick={() => onItemClick?.(item.id || '')}
                    />
                ))}
            </div>
        </div>
    )
}

export default HubNavMenu
