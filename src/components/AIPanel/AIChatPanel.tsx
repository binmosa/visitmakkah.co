'use client'

import { useEffect, useState, useId } from 'react'
import { ChatKit, useChatKit } from '@openai/chatkit-react'
import { useUserJourney } from '@/context/UserJourneyContext'
import { SparklesIcon, Loading03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

interface AIChatPanelProps {
    context: string
    contextLabel: string
    placeholder?: string
    suggestedQuestions?: string[]
}

export default function AIChatPanel({
    context,
    contextLabel,
    placeholder = 'Ask me anything...',
    suggestedQuestions = [],
}: AIChatPanelProps) {
    const { user } = useUserJourney()
    const visitorId = useId()
    const [isReady, setIsReady] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Generate a stable user ID for the session
    const [userId] = useState(() => {
        if (typeof window !== 'undefined') {
            let storedId = localStorage.getItem('visitmakkah_user_id')
            if (!storedId) {
                storedId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
                localStorage.setItem('visitmakkah_user_id', storedId)
            }
            return storedId
        }
        return `user_${visitorId}`
    })

    // Initialize ChatKit
    const { control, status } = useChatKit({
        api: {
            async getClientSecret(existing) {
                // If we have an existing secret that's still valid, we could reuse it
                // For now, always get a fresh one
                try {
                    const res = await fetch('/api/chatkit/session', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            context,
                            userId,
                            userProfile: {
                                journeyStage: user.journeyStage,
                                journeyType: user.journeyType,
                                isFirstTime: user.isFirstTime,
                                travelGroup: user.travelGroup,
                            },
                        }),
                    })

                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({}))
                        console.error('Session error:', errorData)
                        throw new Error(errorData.error || 'Failed to get session token')
                    }

                    const data = await res.json()
                    setError(null)
                    return data.client_secret
                } catch (err) {
                    console.error('Error getting client secret:', err)
                    setError(err instanceof Error ? err.message : 'Failed to connect to AI assistant')
                    throw err
                }
            },
        },
    })

    // Track ChatKit ready state
    useEffect(() => {
        if (status === 'connected') {
            setIsReady(true)
            setError(null)
        } else if (status === 'error') {
            setError('Connection error. Please refresh the page.')
        }
    }, [status])

    // Loading state
    if (status === 'connecting' || status === 'idle') {
        return (
            <div className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
                <ChatKitHeader contextLabel={contextLabel} />
                <div className="flex flex-1 items-center justify-center">
                    <div className="text-center">
                        <HugeiconsIcon
                            icon={Loading03Icon}
                            className="mx-auto size-8 animate-spin text-primary-500"
                        />
                        <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
                            Connecting to AI assistant...
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    // Error state
    if (error || status === 'error') {
        return (
            <div className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
                <ChatKitHeader contextLabel={contextLabel} />
                <div className="flex flex-1 items-center justify-center p-4">
                    <div className="text-center">
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {error || 'Connection error'}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-3 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
            <ChatKitHeader contextLabel={contextLabel} />

            {/* ChatKit Component - Full chat UI with input */}
            <div className="flex-1 overflow-hidden">
                <ChatKit
                    control={control}
                    className="h-full w-full"
                />
            </div>
        </div>
    )
}

// Shared header component
function ChatKitHeader({ contextLabel }: { contextLabel: string }) {
    return (
        <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-3 dark:border-neutral-700">
            <div className="rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 p-2">
                <HugeiconsIcon icon={SparklesIcon} className="size-4 text-white" />
            </div>
            <div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    AI {contextLabel} Guide
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Powered by OpenAI
                </p>
            </div>
        </div>
    )
}
