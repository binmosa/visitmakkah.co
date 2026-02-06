'use client'

import { ReactNode } from 'react'

interface DataCollectionProviderProps {
    children: ReactNode
}

/**
 * Data Collection Provider
 * Previously handled analytics - now just a pass-through
 * Analytics are handled by Google Analytics
 * Chat data collection happens in the chat components
 */
export function DataCollectionProvider({ children }: DataCollectionProviderProps) {
    return <>{children}</>
}
