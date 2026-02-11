'use client'

import { useState, useId, useCallback, useMemo, useEffect } from 'react'
import { ChatKit, useChatKit } from '@openai/chatkit-react'
import { SparklesIcon, Message01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon, type HugeiconsProps } from '@hugeicons/react'
import { useUserJourney } from '@/context/UserJourneyContext'
import { setSessionContext, setUserProfileGetter, handleClientTool } from '@/lib/client-tools'

interface AIChatPanelProps {
    context: string
    contextLabel: string
    contextDescription?: string
    contextIcon?: HugeiconsProps['icon']
    placeholder?: string
    suggestedQuestions?: string[]
    // Classification metadata for agent routing
    classification?: 'prepare' | 'learn' | 'explore' | 'blog'
    action?: string // The sub-menu action (e.g., 'build-itinerary', 'find-food')
}

export default function AIChatPanel({
    context,
    contextLabel,
    contextDescription,
    contextIcon,
    placeholder = 'Ask me anything...',
    suggestedQuestions = [],
    classification,
    action,
}: AIChatPanelProps) {
    // Track whether user has chosen to start chatting
    const [chatStarted, setChatStarted] = useState(false)
    const [initialQuestion, setInitialQuestion] = useState<string | null>(null)

    // Auto-derive classification from context if not provided
    const derivedClassification = classification || deriveClassification(context)
    // Auto-derive action from context if not provided
    const derivedAction = action || context

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
            classification={derivedClassification}
            action={derivedAction}
            actionLabel={contextLabel}
        />
    )
}

// Derive classification from context/action
function deriveClassification(context: string): 'prepare' | 'learn' | 'explore' | 'blog' {
    const prepareActions = ['prepare', 'build-itinerary', 'get-visa', 'pack-my-bag', 'calculate-budget']
    const learnActions = ['learn', 'umrah-guide', 'hajj-guide', 'step-by-step', 'duas-prayers']
    const exploreActions = ['explore', 'find-hotels', 'find-food', 'check-crowds', 'navigate', 'local-tips']

    if (prepareActions.includes(context)) return 'prepare'
    if (learnActions.includes(context)) return 'learn'
    if (exploreActions.includes(context)) return 'explore'
    if (context === 'blog') return 'blog'

    // Default to prepare if unknown
    return 'prepare'
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
                        backgroundImage: 'url(/images/islamic-pattern.svg)',
                        backgroundPosition: 'left center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'auto 100%',
                    }}
                />
            </div>
        </div>
    )
}

// Context metadata for agent routing (not shown to user)
interface SessionContext {
    page: string           // e.g., 'prepare', 'learn', 'explore'
    action: string         // e.g., 'find-hotels', 'build-itinerary'
    actionLabel: string    // e.g., 'Find Hotels', 'Build My Itinerary'
}

// Create a client secret fetcher that caches the secret
function createClientSecretFetcher(userId: string, context?: SessionContext) {
    return async (currentSecret: string | null): Promise<string> => {
        // Return cached secret if it exists
        if (currentSecret) return currentSecret

        const res = await fetch('/api/chatkit/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                // Send context metadata (agent receives this, user doesn't see it)
                context: context ? {
                    page: context.page,
                    action: context.action,
                    actionLabel: context.actionLabel,
                } : undefined,
            }),
        })

        const payload = await res.json().catch(() => ({})) as {
            client_secret?: string
            error?: string
        }

        if (!res.ok) {
            throw new Error(payload.error ?? 'Failed to create session')
        }

        if (!payload.client_secret) {
            throw new Error('Missing client secret in response')
        }

        return payload.client_secret
    }
}

// Active chat - only created when user starts chatting
function ActiveChatPanel({
    context,
    contextLabel,
    contextIcon,
    initialQuestion,
    classification,
    action,
    actionLabel,
}: {
    context: string
    contextLabel: string
    contextIcon?: HugeiconsProps['icon']
    initialQuestion: string | null
    classification?: string
    action?: string
    actionLabel?: string
}) {
    const visitorId = useId()
    const { user, daysUntilDeparture } = useUserJourney()

    // Generate a stable user ID for the session
    const userId = useMemo(() => {
        if (typeof window !== 'undefined') {
            let storedId = localStorage.getItem('visitmakkah_user_id')
            if (!storedId) {
                storedId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
                localStorage.setItem('visitmakkah_user_id', storedId)
            }
            return storedId
        }
        return `user_${visitorId}`
    }, [visitorId])

    // Set up session context for client tools (page, action, actionLabel)
    useEffect(() => {
        setSessionContext({
            page: classification || 'general',
            action: action || context,
            actionLabel: actionLabel || contextLabel,
        })
    }, [classification, action, context, actionLabel, contextLabel])

    // Set up user profile getter for client tools
    useEffect(() => {
        setUserProfileGetter(() => ({
            journeyStage: user.journeyStage,
            journeyType: user.journeyType,
            isFirstTime: user.isFirstTime,
            gender: user.gender,
            country: user.country,
            travelGroup: user.travelGroup,
            departureDate: user.travelDates.departure,
            returnDate: user.travelDates.return,
            completedOnboarding: user.completedOnboarding,
            preparationProgress: user.preparationProgress,
            packingProgress: user.packingProgress,
            daysUntilDeparture: daysUntilDeparture,
        }))
    }, [user, daysUntilDeparture])

    // Create memoized fetcher with context metadata (sent to agent, hidden from user)
    const getClientSecret = useMemo(
        () => createClientSecretFetcher(userId, {
            page: classification || 'general',
            action: action || context,
            actionLabel: actionLabel || contextLabel,
        }),
        [userId, classification, action, context, actionLabel, contextLabel]
    )

    // Handle client tool calls from the agent
    const onClientTool = useCallback(async (tool: { name: string; params: Record<string, unknown> }) => {
        console.log('[ChatKit] Client tool called:', tool.name, tool.params)
        const result = await handleClientTool(tool.name, tool.params)
        return result.data as Record<string, unknown>
    }, [])

    // Initialize ChatKit with client tool support
    const chatkit = useChatKit({
        api: { getClientSecret },
        onClientTool,
        startScreen: {
            greeting: initialQuestion || `Ask me anything about ${contextLabel}`,
            prompts: initialQuestion ? [
                { label: initialQuestion, prompt: initialQuestion, icon: 'sparkle' },
            ] : undefined,
        },
        composer: {
            placeholder: `Ask about ${contextLabel}...`,
        },
    })

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
            <ChatKitHeader contextLabel={contextLabel} contextIcon={contextIcon} />

            {/* ChatKit Component - Full chat UI with input */}
            <div className="relative z-10 flex-1 overflow-hidden">
                <ChatKit
                    control={chatkit.control}
                    className="h-full w-full"
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
