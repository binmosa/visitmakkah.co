import { ApplicationLayout } from '@/app/(app)/application-layout'
import HubLayout from '@/components/HubLayout'
import { getNavigation } from '@/data/navigation'
import React from 'react'

export default async function Layout({ children }: { children: React.ReactNode }) {
    const nav = await getNavigation()
    const tipsNav = nav.find((n) => n.id === 'tips')

    return (
        <ApplicationLayout headerHasBorder>
            <HubLayout
                title="Insider Tips"
                subtitle="Local knowledge and expert advice"
                navItems={tipsNav?.children || []}
                categoryId="tips"
            />
            {/* Children are rendered but HubLayout now contains the full ChatKit experience */}
            <div className="hidden">{children}</div>
        </ApplicationLayout>
    )
}
