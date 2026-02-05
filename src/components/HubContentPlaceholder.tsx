'use client'

import { SparklesIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

interface HubContentPlaceholderProps {
    title?: string
    message?: string
}

export default function HubContentPlaceholder({
    title = 'AI-Powered Content',
    message = 'Ask the AI assistant on the left to get personalized information, or select a topic above to explore.',
}: HubContentPlaceholderProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 p-4 dark:from-primary-900/30 dark:to-secondary-900/30">
                <HugeiconsIcon
                    icon={SparklesIcon}
                    className="size-8 text-primary-600 dark:text-primary-400"
                />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
                {title}
            </h3>
            <p className="max-w-md text-sm text-neutral-500 dark:text-neutral-400">
                {message}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
                <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                    Personalized guidance
                </span>
                <span className="rounded-full bg-secondary-50 px-3 py-1 text-xs font-medium text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300">
                    Real-time answers
                </span>
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                    Expert knowledge
                </span>
            </div>
        </div>
    )
}
