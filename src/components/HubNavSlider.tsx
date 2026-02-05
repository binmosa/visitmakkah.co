'use client'

import { TNavigationItem } from '@/data/navigation'
import { usePathname } from 'next/navigation'
import { FC, useRef, useEffect } from 'react'
import {
    Calendar03Icon,
    Passport01Icon,
    Backpack03Icon,
    AirplaneTakeOff01Icon,
    Building03Icon,
    Restaurant01Icon,
    UserLove01Icon,
    Moon02Icon,
    Route01Icon,
    Calculator01Icon,
    CheckListIcon,
    RulerIcon,
    SunCloudAngledRain01Icon,
    MoonIcon,
    UserGroup03Icon,
    CompassIcon,
    // Your Journey
    Book02Icon,
    BookOpen01Icon,
    RotateClockwiseIcon,
    PrayerRugIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

// Icon mapping for navigation items
const iconMap: Record<string, typeof Calendar03Icon> = {
    // Plan
    'timeline-builder': Calendar03Icon,
    'visa-steps': Passport01Icon,
    'packing': Backpack03Icon,
    'transport': AirplaneTakeOff01Icon,
    // Your Journey
    'hajj': Book02Icon,
    'umrah': BookOpen01Icon,
    'rituals': RotateClockwiseIcon,
    'spiritual': PrayerRugIcon,
    // Stay & Food
    'hotels': Building03Icon,
    'restaurants': Restaurant01Icon,
    'women-friendly': UserLove01Icon,
    'late-night': Moon02Icon,
    // Smart Tools
    'trip-planner': Route01Icon,
    'budget-tool': Calculator01Icon,
    'packing-list': CheckListIcon,
    'distance-calculator': RulerIcon,
    // Local Tips
    'seasonal-hacks': SunCloudAngledRain01Icon,
    'ramadan-advice': MoonIcon,
    'hajj-crowd-flow': UserGroup03Icon,
    'insider-routes': CompassIcon,
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
    const IconComponent = iconMap[hrefKey] || Calendar03Icon
    const isHighlighted = isActive || isCurrentPage

    return (
        <button
            onClick={onClick}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                isHighlighted
                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm dark:border-primary-400 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary-300 hover:bg-primary-50/50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-primary-600'
            }`}
        >
            <HugeiconsIcon
                icon={IconComponent}
                className={`size-4 ${
                    isHighlighted
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
    const IconComponent = iconMap[hrefKey] || Calendar03Icon
    const isHighlighted = isActive || isCurrentPage

    return (
        <button
            onClick={onClick}
            className={`group flex w-full flex-col items-center rounded-xl border p-3 text-center transition-all duration-200 ${
                isHighlighted
                    ? 'border-primary-500 bg-primary-50 shadow-sm dark:border-primary-400 dark:bg-primary-900/30'
                    : 'border-neutral-200 bg-white hover:border-primary-300 hover:bg-primary-50/50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-primary-600'
            }`}
        >
            {/* Icon with pattern background */}
            <div
                className={`relative mb-2 flex size-12 items-center justify-center overflow-hidden rounded-lg ${
                    isHighlighted
                        ? 'bg-primary-100 dark:bg-primary-800/50'
                        : 'bg-neutral-100 group-hover:bg-primary-100/50 dark:bg-neutral-700 dark:group-hover:bg-primary-800/30'
                }`}
            >
                {/* Subtle pattern overlay */}
                <img
                    src="/images/pattern.svg"
                    alt=""
                    className="absolute inset-0 size-full object-cover opacity-30"
                />
                <HugeiconsIcon
                    icon={IconComponent}
                    className={`relative size-6 transition-transform duration-200 group-hover:scale-110 ${
                        isHighlighted
                            ? 'text-primary-600 dark:text-primary-400'
                            : 'text-neutral-600 group-hover:text-primary-600 dark:text-neutral-400 dark:group-hover:text-primary-400'
                    }`}
                />
            </div>

            {/* Title */}
            <p
                className={`text-xs font-medium leading-tight ${
                    isHighlighted
                        ? 'text-primary-700 dark:text-primary-300'
                        : 'text-neutral-700 dark:text-neutral-300'
                }`}
            >
                {item.name}
            </p>
        </button>
    )
}

interface HubNavMenuProps {
    items: TNavigationItem[]
    activeId?: string | null
    onItemClick?: (id: string) => void
}

const HubNavMenu: FC<HubNavMenuProps> = ({ items, activeId, onItemClick }) => {
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
            <div className="hidden gap-3 sm:grid sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
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
