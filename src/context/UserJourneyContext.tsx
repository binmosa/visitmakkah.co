'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

// Types for user journey
export type JourneyStage = 'planning' | 'booked' | 'in_makkah' | 'returned' | null
export type JourneyType = 'hajj' | 'umrah' | 'both' | null
export type TravelGroup = 'solo' | 'couple' | 'family' | 'group' | null
export type Gender = 'male' | 'female' | null

export interface UserProfile {
    // Onboarding data
    journeyStage: JourneyStage
    journeyType: JourneyType
    isFirstTime: boolean | null
    gender: Gender
    country: string | null  // ISO country code (e.g., 'US', 'SA', 'PK')
    travelGroup: TravelGroup
    travelDates: {
        departure: string | null
        return: string | null
    }
    // Progress tracking
    completedOnboarding: boolean
    // Checklist & progress
    preparationProgress: number
    packingProgress: number
    // Preferences
    preferences: {
        notifications: boolean
        proactiveAI: boolean
    }
    // Metadata
    createdAt: string | null
    updatedAt: string | null
}

interface UserJourneyContextType {
    user: UserProfile
    isLoading: boolean
    hasCompletedOnboarding: boolean
    // Actions
    updateUser: (updates: Partial<UserProfile>) => void
    completeOnboarding: (data: Partial<UserProfile>) => void
    resetUser: () => void
    // Computed
    daysUntilDeparture: number | null
    journeyStageLabel: string
}

const defaultUser: UserProfile = {
    journeyStage: null,
    journeyType: null,
    isFirstTime: null,
    gender: null,
    country: null,
    travelGroup: null,
    travelDates: {
        departure: null,
        return: null,
    },
    completedOnboarding: false,
    preparationProgress: 0,
    packingProgress: 0,
    preferences: {
        notifications: true,
        proactiveAI: true,
    },
    createdAt: null,
    updatedAt: null,
}

const STORAGE_KEY = 'visitmakkah_user_journey'

const UserJourneyContext = createContext<UserJourneyContextType | undefined>(undefined)

export function UserJourneyProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile>(defaultUser)
    const [isLoading, setIsLoading] = useState(true)

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                const parsed = JSON.parse(stored)
                setUser({ ...defaultUser, ...parsed })
            }
        } catch (error) {
            console.error('Error loading user journey from localStorage:', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Save to localStorage on changes
    useEffect(() => {
        if (!isLoading && user.createdAt) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
            } catch (error) {
                console.error('Error saving user journey to localStorage:', error)
            }
        }
    }, [user, isLoading])

    const updateUser = (updates: Partial<UserProfile>) => {
        setUser((prev) => ({
            ...prev,
            ...updates,
            updatedAt: new Date().toISOString(),
        }))
    }

    const completeOnboarding = (data: Partial<UserProfile>) => {
        const now = new Date().toISOString()
        setUser((prev) => ({
            ...prev,
            ...data,
            completedOnboarding: true,
            createdAt: prev.createdAt || now,
            updatedAt: now,
        }))
    }

    const resetUser = () => {
        localStorage.removeItem(STORAGE_KEY)
        setUser(defaultUser)
    }

    // Computed values
    const daysUntilDeparture = (() => {
        if (!user.travelDates.departure) return null
        const departure = new Date(user.travelDates.departure)
        const today = new Date()
        const diffTime = departure.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays > 0 ? diffDays : 0
    })()

    const journeyStageLabel = (() => {
        switch (user.journeyStage) {
            case 'planning':
                return 'Planning Stage'
            case 'booked':
                return 'Booked & Preparing'
            case 'in_makkah':
                return 'In Makkah'
            case 'returned':
                return 'Journey Complete'
            default:
                return 'Not Started'
        }
    })()

    return (
        <UserJourneyContext.Provider
            value={{
                user,
                isLoading,
                hasCompletedOnboarding: user.completedOnboarding,
                updateUser,
                completeOnboarding,
                resetUser,
                daysUntilDeparture,
                journeyStageLabel,
            }}
        >
            {children}
        </UserJourneyContext.Provider>
    )
}

export function useUserJourney() {
    const context = useContext(UserJourneyContext)
    if (context === undefined) {
        throw new Error('useUserJourney must be used within a UserJourneyProvider')
    }
    return context
}
