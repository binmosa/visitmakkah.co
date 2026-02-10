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
}

export default function AIChatPanelV2({
  contextAction,
  contextLabel,
  contextDescription,
  contextIcon,
  suggestedQuestions,
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

  if (!chatStarted) {
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

      <div className="relative flex flex-1 flex-col items-center justify-center p-6">
        {/* Icon */}
        <div className="relative z-10 rounded-2xl bg-primary-100 p-5 dark:bg-primary-900/30">
          <HugeiconsIcon
            icon={IconComponent}
            className="size-10 text-primary-600 dark:text-primary-400"
            strokeWidth={1.5}
          />
        </div>

        {/* Title */}
        <h3 className="relative z-10 mt-5 text-xl font-bold text-neutral-900 dark:text-white">
          {contextLabel}
        </h3>

        {/* Description */}
        <p className="relative z-10 mt-2 max-w-md text-center text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
          {contextDescription}
        </p>

        {/* Suggested Questions */}
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

        {/* Start Button */}
        <button
          onClick={() => onStartChat()}
          className="relative z-10 mt-8 rounded-xl bg-primary-600 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/25"
        >
          Start Conversation
        </button>

        {/* Background Pattern */}
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

// Active Chat Component
interface ActiveChatProps {
  contextAction: string
  contextLabel: string
  contextIcon?: HugeiconsProps['icon']
  suggestedQuestions: string[]
  initialQuestion?: string
}

function ActiveChat({
  contextAction,
  contextLabel,
  contextIcon,
  suggestedQuestions,
  initialQuestion,
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
  } = useAIChat({
    contextAction,
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
        {messages.length === 0 && !initialQuestion && !isLoading ? (
          <EmptyState
            suggestions={suggestedQuestions}
            onSuggestionClick={handleSuggestionClick}
          />
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
                      <MessageRenderer content={msg.content} isStreaming={isStreamingMessage} />
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

// Shared Header Component
interface ChatHeaderProps {
  contextLabel: string
  contextIcon?: HugeiconsProps['icon']
}

function ChatHeader({ contextLabel, contextIcon }: ChatHeaderProps) {
  const IconComponent = contextIcon || SparklesIcon

  return (
    <div className="relative z-10 flex items-center gap-3 border-b border-neutral-200 px-4 py-3 dark:border-neutral-700">
      <div className="rounded-lg bg-primary-100 p-2 dark:bg-primary-900/30">
        <HugeiconsIcon
          icon={IconComponent}
          className="size-4 text-primary-600 dark:text-primary-400"
          strokeWidth={1.5}
        />
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
