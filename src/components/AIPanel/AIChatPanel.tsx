'use client'

import { useEffect, useState, useId, useCallback } from 'react'
import { ChatKit, useChatKit } from '@openai/chatkit-react'
import { useUserJourney } from '@/context/UserJourneyContext'
import { SparklesIcon, Loading03Icon, Message01Icon } from '@hugeicons/core-free-icons'
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
            initialQuestion={initialQuestion}
        />
    )
}

// Welcome screen - no API calls, just UI
function ChatWelcomeScreen({
    contextLabel,
    suggestedQuestions,
    onStartChat,
}: {
    contextLabel: string
    suggestedQuestions: string[]
    onStartChat: (question?: string) => void
}) {
    return (
        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
            <ChatKitHeader contextLabel={contextLabel} />

            <div className="relative flex flex-1 flex-col items-center justify-center p-6">
                <div className="relative z-10 rounded-full bg-primary-100 p-4 dark:bg-primary-900/30">
                    <HugeiconsIcon icon={Message01Icon} className="size-8 text-primary-600 dark:text-primary-400" />
                </div>

                <h3 className="relative z-10 mt-4 text-lg font-semibold text-neutral-900 dark:text-white">
                    AI {contextLabel} Assistant
                </h3>
                <p className="relative z-10 mt-2 max-w-xs text-center text-sm text-neutral-500 dark:text-neutral-400">
                    Get personalized guidance and answers to your questions
                </p>

                {/* Suggested questions */}
                {suggestedQuestions.length > 0 && (
                    <div className="relative z-10 mt-6 w-full max-w-sm space-y-2">
                        <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                            Suggested questions:
                        </p>
                        {suggestedQuestions.slice(0, 3).map((question, index) => (
                            <button
                                key={index}
                                onClick={() => onStartChat(question)}
                                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                )}

                {/* Start chat button */}
                <button
                    onClick={() => onStartChat()}
                    className="relative z-10 mt-6 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                >
                    Start Conversation
                </button>

                {/* Islamic pattern overlay */}
                <div
                    className="pointer-events-none absolute inset-0 z-0"
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

// Active chat - only created when user starts chatting
function ActiveChatPanel({
    context,
    contextLabel,
    initialQuestion,
}: {
    context: string
    contextLabel: string
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
                <ChatKitHeader contextLabel={contextLabel} />
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
            <ChatKitHeader contextLabel={contextLabel} />

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
function ChatKitHeader({ contextLabel }: { contextLabel: string }) {
    return (
        <div className="relative z-10 flex items-center gap-3 border-b border-neutral-200 px-4 py-3 dark:border-neutral-700">
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
