'use client'

import { useState, useId, useCallback } from 'react'
import { ChatKit, useChatKit } from '@openai/chatkit-react'
import { useUserJourney } from '@/context/UserJourneyContext'
import { SparklesIcon, Message01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon, type HugeiconsProps } from '@hugeicons/react'

interface AIChatPanelProps {
    context: string
    contextLabel: string
    contextDescription?: string
    contextIcon?: HugeiconsProps['icon']
    placeholder?: string
    suggestedQuestions?: string[]
}

export default function AIChatPanel({
    context,
    contextLabel,
    contextDescription,
    contextIcon,
    placeholder = 'Ask me anything...',
    suggestedQuestions = [],
}: AIChatPanelProps) {
    // Track whether user has chosen to start chatting
    const [chatStarted, setChatStarted] = useState(false)
    const [initialQuestion, setInitialQuestion] = useState<string | null>(null)

    // Handle starting chat
    const handleStartChat = useCallback((question?: string) => {
        if (question) {
            setInitialQuestion(question)
        }
        setChatStarted(true)
    }, [])

    // Show welcome screen until user decides to chat
    if (!chatStarted) {
        return (
            <ChatWelcomeScreen
                contextLabel={contextLabel}
                contextDescription={contextDescription}
                contextIcon={contextIcon}
                suggestedQuestions={suggestedQuestions}
                onStartChat={handleStartChat}
            />
        )
    }

    // Only render ChatKit after user starts chatting
    return (
        <ActiveChatPanel
            context={context}
            contextLabel={contextLabel}
            contextIcon={contextIcon}
            initialQuestion={initialQuestion}
        />
    )
}

// Welcome screen - no API calls, just UI
function ChatWelcomeScreen({
    contextLabel,
    contextDescription,
    contextIcon,
    suggestedQuestions,
    onStartChat,
}: {
    contextLabel: string
    contextDescription?: string
    contextIcon?: HugeiconsProps['icon']
    suggestedQuestions: string[]
    onStartChat: (question?: string) => void
}) {
    const IconComponent = contextIcon || Message01Icon

    return (
        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
            <ChatKitHeader contextLabel={contextLabel} contextIcon={contextIcon} />

            <div className="relative flex flex-1 flex-col items-center justify-center p-6">
                {/* Dynamic Icon */}
                <div className="relative z-10 rounded-2xl bg-primary-100 p-5 dark:bg-primary-900/30">
                    <HugeiconsIcon icon={IconComponent} className="size-10 text-primary-600 dark:text-primary-400" strokeWidth={1.5} />
                </div>

                {/* Dynamic Title */}
                <h3 className="relative z-10 mt-5 text-xl font-bold text-neutral-900 dark:text-white">
                    {contextLabel}
                </h3>

                {/* Dynamic Description */}
                <p className="relative z-10 mt-2 max-w-md text-center text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {contextDescription || 'Get personalized AI guidance and answers to your questions'}
                </p>

                {/* Suggested questions as action buttons */}
                {suggestedQuestions.length > 0 && (
                    <div className="relative z-10 mt-8 w-full max-w-lg">
                        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                            Quick Actions
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2">
                            {suggestedQuestions.slice(0, 4).map((question, index) => (
                                <button
                                    key={index}
                                    onClick={() => onStartChat(question)}
                                    className="group flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-left text-sm text-neutral-700 transition-all hover:border-primary-300 hover:bg-primary-50 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-primary-600 dark:hover:bg-primary-900/20"
                                >
                                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 transition-colors group-hover:bg-primary-100 group-hover:text-primary-600 dark:bg-neutral-700 dark:group-hover:bg-primary-900/30 dark:group-hover:text-primary-400">
                                        <HugeiconsIcon icon={SparklesIcon} className="size-4" strokeWidth={1.5} />
                                    </span>
                                    <span className="line-clamp-2">{question}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Start chat button */}
                <button
                    onClick={() => onStartChat()}
                    className="relative z-10 mt-8 rounded-xl bg-primary-600 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/25"
                >
                    Start Conversation
                </button>

                {/* Islamic pattern overlay - left side only */}
                <div
                    className="pointer-events-none absolute inset-0 z-0 opacity-30"
                    style={{
                        backgroundImage: 'url(/images/islamic-pattern.png)',
                        backgroundPosition: 'left center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'auto 100%',
                    }}
                />
            </div>
        </div>
    )
}

// Active chat - only created when user starts chatting
function ActiveChatPanel({
    context,
    contextLabel,
    contextIcon,
    initialQuestion,
}: {
    context: string
    contextLabel: string
    contextIcon?: HugeiconsProps['icon']
    initialQuestion: string | null
}) {
    const { user } = useUserJourney()
    const visitorId = useId()
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

    // Initialize ChatKit - only happens when this component mounts (user started chat)
    const { control } = useChatKit({
        api: {
            async getClientSecret() {
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
                            initialQuestion, // Pass initial question to potentially include in context
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

    // Error state
    if (error) {
        return (
            <div className="islamic-pattern-bg flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
                <ChatKitHeader contextLabel={contextLabel} contextIcon={contextIcon} />
                <div className="relative z-10 flex flex-1 items-center justify-center p-4">
                    <div className="text-center">
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {error}
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
        <div className="islamic-pattern-bg flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
            <ChatKitHeader contextLabel={contextLabel} contextIcon={contextIcon} />

            {/* ChatKit Component - Full chat UI with input */}
            <div className="relative z-10 flex-1 overflow-hidden">
                <ChatKit
                    control={control}
                    className="h-full w-full"
                />
                {/* Islamic pattern overlay for chat area */}
                <div
                    className="pointer-events-none absolute inset-0 z-20"
                    style={{
                        backgroundImage: 'url(/images/islamic-pattern.png)',
                        backgroundPosition: 'left top',
                        backgroundRepeat: 'repeat-y',
                        backgroundSize: 'auto 300px',
                    }}
                />
            </div>
        </div>
    )
}

// Shared header component
function ChatKitHeader({
    contextLabel,
    contextIcon,
}: {
    contextLabel: string
    contextIcon?: HugeiconsProps['icon']
}) {
    const IconComponent = contextIcon || SparklesIcon

    return (
        <div className="relative z-10 flex items-center gap-3 border-b border-neutral-200 px-4 py-3 dark:border-neutral-700">
            <div className="rounded-lg bg-primary-100 p-2 dark:bg-primary-900/30">
                <HugeiconsIcon icon={IconComponent} className="size-4 text-primary-600 dark:text-primary-400" strokeWidth={1.5} />
            </div>
            <div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {contextLabel}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    AI-Powered Guide
                </p>
            </div>
        </div>
    )
}
