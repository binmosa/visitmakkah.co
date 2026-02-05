import { ApplicationLayout } from '@/app/(app)/application-layout'
import HubLayout from '@/components/HubLayout'
import { getNavigation } from '@/data/navigation'
import React from 'react'

export default async function Layout({ children }: { children: React.ReactNode }) {
    const nav = await getNavigation()
    const planNav = nav.find((n) => n.name === 'Plan')

    return (
        <ApplicationLayout headerHasBorder>
            <HubLayout
                title="Plan Your Journey"
                subtitle="Step-by-step guides for a spiritual journey"
                navItems={planNav?.children || []}
            >
                {children}
            </HubLayout>
        </ApplicationLayout>
    )
}
