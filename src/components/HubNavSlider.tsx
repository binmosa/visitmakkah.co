'use client'

import { TNavigationItem } from '@/data/navigation'
import { usePathname } from 'next/navigation'
import { FC } from 'react'
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

const HubNavCard: FC<HubNavCardProps> = ({ item, isActive, isCurrentPage, onClick }) => {
    const hrefKey = item.href?.split('/').pop() || ''
    const IconComponent = iconMap[hrefKey] || Calendar03Icon
    const isHighlighted = isActive || isCurrentPage

    return (
        <button
            onClick={onClick}
            className="group relative flex w-full flex-col text-left"
        >
            <div className={`relative aspect-square w-full overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-200 ${isHighlighted ? 'ring-2 ring-primary-500 scale-[1.02] shadow-lg shadow-primary-500/20' : 'hover:scale-[1.02] hover:shadow-md'}`}>
                {/* Pattern Background */}
                <img
                    src="/images/pattern.svg"
                    alt=""
                    className="absolute inset-0 size-full object-cover"
                />

                {/* Highlight overlay for current page */}
                {isHighlighted && (
                    <div className="absolute inset-0 bg-primary-500/10" />
                )}

                {/* Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <HugeiconsIcon
                        icon={IconComponent}
                        className={`size-8 sm:size-12 transition-all duration-200 ${isHighlighted ? 'text-primary-700 scale-110 dark:text-primary-300' : 'text-primary-600 group-hover:text-primary-700 group-hover:scale-110 dark:text-primary-400'}`}
                    />
                </div>

                {/* Active/Current indicator */}
                {isHighlighted && (
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-primary-500" />
                )}
            </div>

            {/* Title below card */}
            <p className={`mt-1.5 text-center text-[10px] font-medium leading-tight sm:text-xs ${isHighlighted ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-700 dark:text-neutral-300'}`}>
                {item.name}
            </p>
        </button>
    )
}

interface HubNavMenuProps {
    heading?: string
    subHeading?: string
    items: TNavigationItem[]
    activeId?: string | null
    onItemClick?: (id: string) => void
}

const HubNavMenu: FC<HubNavMenuProps> = ({
    heading,
    subHeading,
    items,
    activeId,
    onItemClick,
}) => {
    const pathname = usePathname()

    if (!items || items.length === 0) {
        return null
    }

    return (
        <div className="hub-nav-menu">
            {/* Compact Header */}
            {heading && (
                <div className="mb-4 sm:mb-6">
                    <h1 className="text-lg font-semibold text-neutral-900 sm:text-2xl lg:text-3xl dark:text-white">
                        {heading}
                    </h1>
                    {subHeading && (
                        <p className="mt-0.5 text-xs text-neutral-500 sm:mt-1 sm:text-sm dark:text-neutral-400">
                            {subHeading}
                        </p>
                    )}
                </div>
            )}

            {/* Grid Menu */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4 md:grid-cols-5 lg:grid-cols-6">
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
