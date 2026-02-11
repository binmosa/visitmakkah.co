'use client'

/**
 * AIChatPanelV2 Component
 *
 * New chat panel using Vercel AI SDK.
 * Features:
 * - Context-aware based on navigation action
 * - User profile personalization
 * - Inline widget rendering
 * - Welcome screen with suggested prompts
 * - Streaming responses
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { SparklesIcon, Message01Icon, SentIcon, Loading03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon, type HugeiconsProps } from '@hugeicons/react'
import { useAIChat } from '@/hooks/useAIChat'
import { MessageRenderer } from '@/components/Chat/MessageRenderer'
import { getContextConfig } from '@/config/ai-context'

interface AIChatPanelV2Props {
  contextAction: string
  contextLabel?: string
  contextDescription?: string
  contextIcon?: HugeiconsProps['icon']
  suggestedQuestions?: string[]
  conversationId?: string | null // Load specific conversation from history
}

export default function AIChatPanelV2({
  contextAction,
  contextLabel,
  contextDescription,
  contextIcon,
  suggestedQuestions,
  conversationId,
}: AIChatPanelV2Props) {
  const [chatStarted, setChatStarted] = useState(false)
  const [initialQuestion, setInitialQuestion] = useState<string | undefined>()

  // Get config for this action
  const config = getContextConfig(contextAction)
  const label = contextLabel || config.actionLabel
  const description = contextDescription || `Get personalized AI guidance for ${label.toLowerCase()}`
  const questions = suggestedQuestions || config.suggestedPrompts

  const handleStartChat = useCallback((question?: string) => {
    setInitialQuestion(question)
    setChatStarted(true)
  }, [])

  // Skip welcome screen if loading from conversation history
  const shouldShowChat = chatStarted || !!conversationId

  if (!shouldShowChat) {
    return (
      <WelcomeScreen
        contextLabel={label}
        contextDescription={description}
        contextIcon={contextIcon}
        suggestedQuestions={questions}
        onStartChat={handleStartChat}
      />
    )
  }

  return (
    <ActiveChat
      contextAction={contextAction}
      contextLabel={label}
      contextIcon={contextIcon}
      suggestedQuestions={questions}
      initialQuestion={initialQuestion}
      conversationId={conversationId}
    />
  )
}

// Welcome Screen Component
interface WelcomeScreenProps {
  contextLabel: string
  contextDescription: string
  contextIcon?: HugeiconsProps['icon']
  suggestedQuestions: string[]
  onStartChat: (question?: string) => void
}

function WelcomeScreen({
  contextLabel,
  contextDescription,
  contextIcon,
  suggestedQuestions,
  onStartChat,
}: WelcomeScreenProps) {
  const IconComponent = contextIcon || Message01Icon

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      <ChatHeader contextLabel={contextLabel} contextIcon={contextIcon} />

      <div className="relative flex flex-1 flex-col items-center justify-center p-4 sm:p-6">
        {/* Icon - Smaller on mobile */}
        <div className="relative z-10 rounded-xl bg-primary-100 p-3 sm:rounded-2xl sm:p-4 dark:bg-primary-900/30">
          <HugeiconsIcon
            icon={IconComponent}
            className="size-6 text-primary-600 sm:size-8 dark:text-primary-400"
            strokeWidth={1.5}
          />
        </div>

        {/* Title - Smaller on mobile */}
        <h3 className="relative z-10 mt-3 text-base font-bold text-neutral-900 sm:mt-4 sm:text-lg dark:text-white">
          {contextLabel}
        </h3>

        {/* Description - Hidden on mobile to save space */}
        <p className="relative z-10 mt-1 hidden max-w-md text-center text-xs leading-relaxed text-neutral-500 sm:mt-2 sm:block sm:text-sm dark:text-neutral-400">
          {contextDescription}
        </p>

        {/* Suggested Questions - Compact */}
        {suggestedQuestions.length > 0 && (
          <div className="relative z-10 mt-4 w-full max-w-lg sm:mt-6">
            <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-wide text-neutral-400 sm:mb-3 sm:text-xs dark:text-neutral-500">
              Quick Actions
            </p>
            <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-2">
              {suggestedQuestions.slice(0, 4).map((question, index) => (
                <button
                  key={index}
                  onClick={() => onStartChat(question)}
                  className="group flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-left text-xs text-neutral-700 transition-all hover:border-primary-300 hover:bg-primary-50 sm:gap-3 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-primary-600 dark:hover:bg-primary-900/20"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-500 transition-colors group-hover:bg-primary-100 group-hover:text-primary-600 sm:size-7 sm:rounded-lg dark:bg-neutral-700 dark:group-hover:bg-primary-900/30 dark:group-hover:text-primary-400">
                    <HugeiconsIcon icon={SparklesIcon} className="size-3 sm:size-3.5" strokeWidth={1.5} />
                  </span>
                  <span className="line-clamp-2">{question}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Start Button - Compact on mobile */}
        <button
          onClick={() => onStartChat()}
          className="relative z-10 mt-4 rounded-lg bg-primary-600 px-6 py-2 text-xs font-semibold text-white transition-all hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/25 sm:mt-6 sm:rounded-xl sm:px-8 sm:py-2.5 sm:text-sm"
        >
          Start Conversation
        </button>

        {/* Background Pattern - Hidden on mobile */}
        <div
          className="pointer-events-none absolute inset-0 z-0 hidden opacity-30 sm:block"
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

// Active Chat Component
interface ActiveChatProps {
  contextAction: string
  contextLabel: string
  contextIcon?: HugeiconsProps['icon']
  suggestedQuestions: string[]
  initialQuestion?: string
  conversationId?: string | null
}

function ActiveChat({
  contextAction,
  contextLabel,
  contextIcon,
  suggestedQuestions,
  initialQuestion,
  conversationId,
}: ActiveChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const initialQuestionSent = useRef(false)

  const {
    messages,
    input,
    setInput,
    handleSubmit,
    sendMessage,
    isLoading,
    error,
    hasLoadedHistory,
  } = useAIChat({
    contextAction,
    conversationId,
  })

  // Send initial question on mount (only once)
  useEffect(() => {
    if (initialQuestion && !initialQuestionSent.current) {
      initialQuestionSent.current = true
      sendMessage(initialQuestion)
    }
  }, [initialQuestion, sendMessage])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle keyboard submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Handle suggested question click
  const handleSuggestionClick = (question: string) => {
    sendMessage(question)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      <ChatHeader contextLabel={contextLabel} contextIcon={contextIcon} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && !initialQuestion && !isLoading && !conversationId ? (
          <EmptyState
            suggestions={suggestedQuestions}
            onSuggestionClick={handleSuggestionClick}
          />
        ) : messages.length === 0 && conversationId && !hasLoadedHistory ? (
          /* Show loading state when loading from history */
          <div className="flex h-full items-center justify-center">
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
              <HugeiconsIcon icon={Loading03Icon} className="size-5 animate-spin" strokeWidth={2} />
              <span className="text-sm">Loading conversation...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => {
              const isLastMessage = index === messages.length - 1
              const isStreamingMessage = isLastMessage && isLoading && msg.role === 'assistant'

              return (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'user' ? (
                    <div className="max-w-[85%] rounded-2xl bg-primary-600 px-4 py-3 text-white">
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  ) : (
                    <div className="max-w-[85%]">
                      <MessageRenderer content={msg.content} isStreaming={isStreamingMessage} contextAction={contextAction} />
                    </div>
                  )}
                </div>
              )
            })}

            {/* Loading indicator - only show when waiting for first response */}
            {isLoading && (messages.length === 0 || messages[messages.length - 1]?.role === 'user') && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl bg-neutral-100 px-4 py-3 dark:bg-neutral-800">
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    className="size-4 animate-spin text-primary-600 dark:text-primary-400"
                    strokeWidth={2}
                  />
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    Thinking...
                  </span>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                {error.message || 'Something went wrong. Please try again.'}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-neutral-200 p-4 dark:border-neutral-700">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="relative flex-1">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask about ${contextLabel.toLowerCase()}...`}
              rows={1}
              className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-4 py-3 pr-12 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500"
              style={{ maxHeight: '120px' }}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex size-11 items-center justify-center rounded-xl bg-primary-600 text-white transition-all hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <HugeiconsIcon icon={Loading03Icon} className="size-5 animate-spin" strokeWidth={2} />
            ) : (
              <HugeiconsIcon icon={SentIcon} className="size-5" strokeWidth={2} />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

// Empty State with Suggestions
interface EmptyStateProps {
  suggestions: string[]
  onSuggestionClick: (question: string) => void
}

function EmptyState({ suggestions, onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <HugeiconsIcon
        icon={SparklesIcon}
        className="size-12 text-neutral-300 dark:text-neutral-600"
        strokeWidth={1}
      />
      <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
        Start a conversation or try one of these:
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {suggestions.slice(0, 3).map((question, i) => (
          <button
            key={i}
            onClick={() => onSuggestionClick(question)}
            className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-600 transition-colors hover:border-primary-300 hover:bg-primary-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-primary-600 dark:hover:bg-primary-900/20"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  )
}

// Shared Header Component - Compact
interface ChatHeaderProps {
  contextLabel: string
  contextIcon?: HugeiconsProps['icon']
}

function ChatHeader({ contextLabel, contextIcon }: ChatHeaderProps) {
  const IconComponent = contextIcon || SparklesIcon

  return (
    <div className="relative z-10 flex items-center gap-2 border-b border-neutral-200 px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5 dark:border-neutral-700">
      <div className="rounded-md bg-primary-100 p-1.5 sm:rounded-lg sm:p-2 dark:bg-primary-900/30">
        <HugeiconsIcon
          icon={IconComponent}
          className="size-3.5 text-primary-600 sm:size-4 dark:text-primary-400"
          strokeWidth={1.5}
        />
      </div>
      <p className="text-xs font-semibold text-neutral-900 sm:text-sm dark:text-white">
        {contextLabel}
      </p>
    </div>
  )
}
