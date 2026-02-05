import { ApplicationLayout } from '@/app/(app)/application-layout'
import HubLayout from '@/components/HubLayout'
import { getNavigation } from '@/data/navigation'
import React from 'react'

export default async function Layout({ children }: { children: React.ReactNode }) {
    const nav = await getNavigation()
    const currentNav = nav.find((n) => n.name === 'Your Journey')

    return (
        <ApplicationLayout headerHasBorder>
            <HubLayout
                title="Your Journey"
                subtitle="Complete guides for Hajj, Umrah, rituals and spiritual preparation"
                navItems={currentNav?.children || []}
            >
                {children}
            </HubLayout>
        </ApplicationLayout>
    )
}
