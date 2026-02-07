import { ApplicationLayout } from '@/app/(app)/application-layout'
import HubLayout from '@/components/HubLayout'
import { getNavigation } from '@/data/navigation'
import React from 'react'

export default async function Layout({ children }: { children: React.ReactNode }) {
    const nav = await getNavigation()
    const currentNav = nav.find((n) => n.name === 'Stay & Food')

    return (
        <ApplicationLayout headerHasBorder>
            <HubLayout
                title="Stay & Food"
                subtitle="Find the best hotels and dining"
                navItems={currentNav?.children || []}
            />
            <div className="hidden">{children}</div>
        </ApplicationLayout>
    )
}
