import { ApplicationLayout } from '@/app/(app)/application-layout'
import HubLayout from '@/components/HubLayout'
import { getNavigation } from '@/data/navigation'
import React from 'react'

export default async function Layout({ children }: { children: React.ReactNode }) {
    const nav = await getNavigation()
    const currentNav = nav.find((n) => n.name === 'Grand Mosque')

    return (
        <ApplicationLayout headerHasBorder>
            <HubLayout
                title="The Grand Mosque"
                subtitle="Detailed guides for the Haram"
                navItems={currentNav?.children || []}
            >
                {children}
            </HubLayout>
        </ApplicationLayout>
    )
}
