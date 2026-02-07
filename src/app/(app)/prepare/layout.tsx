import { ApplicationLayout } from '@/app/(app)/application-layout'
import HubLayout from '@/components/HubLayout'
import { getNavigation } from '@/data/navigation'
import React from 'react'

export default async function Layout({ children }: { children: React.ReactNode }) {
    const nav = await getNavigation()
    const prepareNav = nav.find((n) => n.id === 'prepare')

    return (
        <ApplicationLayout headerHasBorder>
            <HubLayout
                title="Prepare Your Journey"
                subtitle="Plan, pack, and get ready before you go"
                navItems={prepareNav?.children || []}
                categoryId="prepare"
            />
            {/* Children are rendered but HubLayout now contains the full ChatKit experience */}
            <div className="hidden">{children}</div>
        </ApplicationLayout>
    )
}
