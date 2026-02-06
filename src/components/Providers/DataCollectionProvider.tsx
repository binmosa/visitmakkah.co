'use client'

import { useEffect, ReactNode } from 'react'
import { useDataCollection } from '@/hooks/useDataCollection'

interface DataCollectionProviderProps {
    children: ReactNode
}

/**
 * Provider component that initializes data collection
 * Wrap your app with this to automatically track page views and sync user data
 */
export function DataCollectionProvider({ children }: DataCollectionProviderProps) {
    // Initialize data collection hooks
    const { visitorId } = useDataCollection()

    // Log when visitor is identified (for debugging)
    useEffect(() => {
        if (visitorId && process.env.NODE_ENV === 'development') {
            console.log('[Analytics] Visitor identified:', visitorId)
        }
    }, [visitorId])

    return <>{children}</>
}
