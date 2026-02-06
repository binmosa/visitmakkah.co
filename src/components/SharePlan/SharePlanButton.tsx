'use client'

import { useState } from 'react'
import { useUserJourney } from '@/context/UserJourneyContext'
import { getShareableLink, generateShareableUrl, copyToClipboard } from '@/utils/shareable-plan'
import { HugeiconsIcon } from '@hugeicons/react'
import {
    Share01Icon,
    Copy01Icon,
    CheckmarkCircle01Icon,
    Cancel01Icon,
    Loading03Icon,
} from '@hugeicons/core-free-icons'

interface SharePlanButtonProps {
    variant?: 'button' | 'icon'
    className?: string
}

export default function SharePlanButton({
    variant = 'button',
    className = '',
}: SharePlanButtonProps) {
    const { user } = useUserJourney()
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [shareUrl, setShareUrl] = useState('')

    const handleShare = async () => {
        setIsLoading(true)
        setIsOpen(true)
        setCopied(false)

        try {
            // Try database-based sharing first
            const dbUrl = await getShareableLink()

            if (dbUrl) {
                setShareUrl(dbUrl)
            } else {
                // Fallback to URL-encoded sharing
                const fallbackUrl = generateShareableUrl(user)
                setShareUrl(fallbackUrl)
            }
        } catch (error) {
            // Fallback to URL-encoded sharing
            const fallbackUrl = generateShareableUrl(user)
            setShareUrl(fallbackUrl)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCopy = async () => {
        const success = await copyToClipboard(shareUrl)
        if (success) {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My Makkah Journey Plan',
                    text: 'Check out my pilgrimage plan for Makkah!',
                    url: shareUrl,
                })
            } catch {
                console.log('Share cancelled')
            }
        }
    }

    // Check if user has completed onboarding
    if (!user.hasCompletedOnboarding) {
        return null
    }

    if (variant === 'icon') {
        return (
            <>
                <button
                    onClick={handleShare}
                    className={`rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300 ${className}`}
                    title="Share your plan"
                >
                    <HugeiconsIcon icon={Share01Icon} className="size-5" />
                </button>
                {isOpen && (
                    <ShareModal
                        shareUrl={shareUrl}
                        isLoading={isLoading}
                        copied={copied}
                        onCopy={handleCopy}
                        onNativeShare={handleNativeShare}
                        onClose={() => setIsOpen(false)}
                    />
                )}
            </>
        )
    }

    return (
        <>
            <button
                onClick={handleShare}
                className={`inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 ${className}`}
            >
                <HugeiconsIcon icon={Share01Icon} className="size-4" />
                Save & Share Plan
            </button>
            {isOpen && (
                <ShareModal
                    shareUrl={shareUrl}
                    isLoading={isLoading}
                    copied={copied}
                    onCopy={handleCopy}
                    onNativeShare={handleNativeShare}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    )
}

// Modal component for sharing
function ShareModal({
    shareUrl,
    isLoading,
    copied,
    onCopy,
    onNativeShare,
    onClose,
}: {
    shareUrl: string
    isLoading: boolean
    copied: boolean
    onCopy: () => void
    onNativeShare: () => void
    onClose: () => void
}) {
    const supportsNativeShare = typeof navigator !== 'undefined' && !!navigator.share

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                >
                    <HugeiconsIcon icon={Cancel01Icon} className="size-5" />
                </button>

                {/* Header */}
                <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-xl bg-primary-100 p-3 dark:bg-primary-900/30">
                        <HugeiconsIcon
                            icon={Share01Icon}
                            className="size-6 text-primary-600 dark:text-primary-400"
                        />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                            Share Your Plan
                        </h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Save this link to access your plan later
                        </p>
                    </div>
                </div>

                {/* URL Display */}
                <div className="mb-4 rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-2">
                            <HugeiconsIcon
                                icon={Loading03Icon}
                                className="size-5 animate-spin text-primary-500"
                            />
                            <span className="ml-2 text-sm text-neutral-500">
                                Generating link...
                            </span>
                        </div>
                    ) : (
                        <p className="break-all text-sm text-neutral-600 dark:text-neutral-400">
                            {shareUrl}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onCopy}
                        disabled={isLoading || !shareUrl}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                            copied
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-primary-600 text-white hover:bg-primary-700'
                        }`}
                    >
                        <HugeiconsIcon
                            icon={copied ? CheckmarkCircle01Icon : Copy01Icon}
                            className="size-4"
                        />
                        {copied ? 'Copied!' : 'Copy Link'}
                    </button>

                    {supportsNativeShare && (
                        <button
                            onClick={onNativeShare}
                            disabled={isLoading || !shareUrl}
                            className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                        >
                            <HugeiconsIcon icon={Share01Icon} className="size-4" />
                            Share
                        </button>
                    )}
                </div>

                {/* Help text */}
                <p className="mt-4 text-center text-xs text-neutral-400 dark:text-neutral-500">
                    Bookmark this link or share it with your travel companions
                </p>
            </div>
        </div>
    )
}
