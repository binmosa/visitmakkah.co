import { ApplicationLayout } from '@/app/(app)/application-layout'
import React from 'react'

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return (
        <ApplicationLayout headerHasBorder>
            {children}
        </ApplicationLayout>
    )
}
