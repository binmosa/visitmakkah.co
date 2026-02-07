'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { TNavigationItem, getNavigation, getPersonalizedNavigation } from '@/data/navigation'
import { useUserJourney } from '@/context/UserJourneyContext'

interface NavigationContextType {
    navigation: TNavigationItem[]
    isLoading: boolean
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function PersonalizedNavigationProvider({ children }: { children: ReactNode }) {
    const { user, isLoading: userLoading } = useUserJourney()
    const [navigation, setNavigation] = useState<TNavigationItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadNavigation = async () => {
            if (userLoading) return

            try {
                const nav = user.completedOnboarding
                    ? await getPersonalizedNavigation(user)
                    : await getNavigation()
                setNavigation(nav)
            } catch (error) {
                console.error('Error loading navigation:', error)
                const fallback = await getNavigation()
                setNavigation(fallback)
            } finally {
                setIsLoading(false)
            }
        }

        loadNavigation()
    }, [user, userLoading])

    return (
        <NavigationContext.Provider value={{ navigation, isLoading }}>
            {children}
        </NavigationContext.Provider>
    )
}

export function usePersonalizedNavigation() {
    const context = useContext(NavigationContext)
    if (context === undefined) {
        throw new Error('usePersonalizedNavigation must be used within PersonalizedNavigationProvider')
    }
    return context
}
