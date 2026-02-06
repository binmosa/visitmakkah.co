import { ApplicationLayout } from '@/app/(app)/application-layout'
import HubLayout from '@/components/HubLayout'
import { getNavigation } from '@/data/navigation'
import React from 'react'

export default async function Layout({ children }: { children: React.ReactNode }) {
    const nav = await getNavigation()
    const exploreNav = nav.find((n) => n.id === 'explore')

    return (
        <ApplicationLayout headerHasBorder>
            <HubLayout
                title="Explore Makkah"
                subtitle="Find places and navigate the Holy City"
                navItems={exploreNav?.children || []}
                categoryId="explore"
            >
                {children}
            </HubLayout>
        </ApplicationLayout>
    )
}
