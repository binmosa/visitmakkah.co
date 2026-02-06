import { ApplicationLayout } from '@/app/(app)/application-layout'
import HubLayout from '@/components/HubLayout'
import { getNavigation } from '@/data/navigation'
import React from 'react'

export default async function Layout({ children }: { children: React.ReactNode }) {
    const nav = await getNavigation()
    const learnNav = nav.find((n) => n.id === 'learn')

    return (
        <ApplicationLayout headerHasBorder>
            <HubLayout
                title="Learn the Rituals"
                subtitle="Guides, duas, and spiritual preparation"
                navItems={learnNav?.children || []}
                categoryId="learn"
            >
                {children}
            </HubLayout>
        </ApplicationLayout>
    )
}
