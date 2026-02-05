'use client'

import HubNavMenu from '@/components/HubNavSlider'
import { TNavigationItem } from '@/data/navigation'
import React, { ReactNode, useState } from 'react'

interface HubLayoutProps {
    children: ReactNode
    title: string
    subtitle?: string
    navItems: TNavigationItem[]
}

const HubLayout = ({ children, title, subtitle, navItems }: HubLayoutProps) => {
    const [activeItemId, setActiveItemId] = useState<string | null>(navItems?.[0]?.id || null)

    const handleItemClick = (id: string) => {
        setActiveItemId(id)
        const contentArea = document.getElementById('hub-content-area')
        if (contentArea) {
            contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    return (
        <div className="container relative py-4 sm:py-8 lg:py-12">
            <HubNavMenu
                heading={title}
                subHeading={subtitle}
                items={navItems || []}
                activeId={activeItemId}
                onItemClick={handleItemClick}
            />

            <div
                id="hub-content-area"
                className="mt-4 scroll-mt-16 rounded-lg border border-neutral-200 bg-neutral-50/50 p-3 sm:mt-6 sm:rounded-xl sm:p-5 dark:border-neutral-800 dark:bg-neutral-900/50 lg:p-6"
            >
                {children}
            </div>
        </div>
    )
}

export default HubLayout
