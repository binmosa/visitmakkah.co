import { ApplicationLayout } from '@/app/(app)/application-layout'
import HubLayout from '@/components/HubLayout'
import { getNavigation } from '@/data/navigation'
import React from 'react'

export default async function Layout({ children }: { children: React.ReactNode }) {
    const nav = await getNavigation()
    const currentNav = nav.find((n) => n.name === 'Local Tips')

    return (
        <ApplicationLayout headerHasBorder>
            <HubLayout
                title="Local Tips"
                subtitle="Navigate the city like a local"
                navItems={currentNav?.children || []}
            />
            <div className="hidden">{children}</div>
        </ApplicationLayout>
    )
}
