import { ApplicationLayout } from '@/app/(app)/application-layout'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ApplicationLayout headerHasBorder>
      {children}
    </ApplicationLayout>
  )
}
