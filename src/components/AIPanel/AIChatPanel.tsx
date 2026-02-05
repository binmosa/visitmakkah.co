'use client'

import { useEffect, useState } from 'react'
import { ChatKit, useChatKit } from '@openai/chatkit-react'
import { useUserJourney } from '@/context/UserJourneyContext'
import { SparklesIcon, Loading03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

interface AIChatPanelProps {
    context: string // e.g., "hajj", "umrah", "hotels", etc.
    contextLabel: string // e.g., "Hajj Guide", "Hotels"
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
    const [isReady, setIsReady] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Initialize ChatKit with our backend
    const { control, status } = useChatKit({
        api: {
            async getClientSecret() {
                try {
                    const res = await fetch('/api/chatkit/session', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            context,
                            userProfile: {
                                journeyStage: user.journeyStage,
                                journeyType: user.journeyType,
                                isFirstTime: user.isFirstTime,
                                travelGroup: user.travelGroup,
                                travelDates: user.travelDates,
                            },
                        }),
                    })

                    if (!res.ok) {
                        throw new Error('Failed to get session token')
                    }

                    const data = await res.json()
                    return data.client_secret
                } catch (err) {
                    console.error('Error getting client secret:', err)
                    setError('Failed to connect to AI assistant')
                    throw err
                }
            },
        },
        // ChatKit configuration
        config: {
            // Customize the chat appearance
            theme: 'auto', // Follows system dark/light mode
            // Initial message placeholder
            inputPlaceholder: placeholder,
        },
        // Event handlers
        events: {
            onReady: () => {
                setIsReady(true)
                setError(null)
            },
            onError: (err) => {
                console.error('ChatKit error:', err)
                setError('Connection error. Please try again.')
            },
        },
    })

    // Check if ChatKit script is loaded
    useEffect(() => {
        const checkChatKit = () => {
            if (typeof window !== 'undefined' && 'customElements' in window) {
                const isDefined = customElements.get('openai-chatkit')
                if (isDefined) {
                    setIsReady(true)
                }
            }
        }

        // Check immediately and also after a delay
        checkChatKit()
        const timer = setTimeout(checkChatKit, 1000)

        return () => clearTimeout(timer)
    }, [])

    // Loading state
    if (status === 'connecting' || !isReady) {
        return (
            <div className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
                {/* Header */}
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

                {/* Loading */}
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
    if (error) {
        return (
            <div className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
                {/* Header */}
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

                {/* Error */}
                <div className="flex flex-1 items-center justify-center p-4">
                    <div className="text-center">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
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
            {/* Custom Header */}
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

            {/* Suggested Questions (shown before first message) */}
            {suggestedQuestions.length > 0 && (
                <div className="border-b border-neutral-200 px-4 py-3 dark:border-neutral-700">
                    <p className="mb-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                        SUGGESTED QUESTIONS
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedQuestions.map((question, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    // Send the suggested question to ChatKit
                                    control?.sendMessage?.(question)
                                }}
                                className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-700 transition-colors hover:border-primary-300 hover:bg-primary-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-primary-600 dark:hover:bg-primary-900/20"
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ChatKit Component */}
            <div className="flex-1 overflow-hidden">
                <ChatKit
                    control={control}
                    className="h-full w-full"
                    style={{
                        // Custom CSS variables to match your theme
                        '--chatkit-primary-color': 'var(--color-primary-600)',
                        '--chatkit-border-radius': '0.75rem',
                    } as React.CSSProperties}
                />
            </div>
        </div>
    )
}
