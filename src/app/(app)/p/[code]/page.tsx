'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUserJourney } from '@/context/UserJourneyContext'
import { loadSharedPlan } from '@/utils/shareable-plan'
import { HugeiconsIcon } from '@hugeicons/react'
import {
    Loading03Icon,
    CheckmarkCircle01Icon,
    AlertCircleIcon,
} from '@hugeicons/core-free-icons'

export default function SharedPlanByCodePage() {
    const params = useParams()
    const router = useRouter()
    const { updateUser } = useUserJourney()
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [errorMessage, setErrorMessage] = useState('')

    const shareCode = params.code as string

    useEffect(() => {
        if (!shareCode) {
            setStatus('error')
            setErrorMessage('No share code provided')
            return
        }

        const loadPlan = async () => {
            try {
                const planData = await loadSharedPlan(shareCode)

                if (!planData) {
                    setStatus('error')
                    setErrorMessage('Plan not found. The link may have expired or be invalid.')
                    return
                }

                // Load the plan into context
                updateUser(planData)
                setStatus('success')

                // Redirect to dashboard after a brief delay
                setTimeout(() => {
                    router.push('/')
                }, 1500)
            } catch (error) {
                console.error('Error loading shared plan:', error)
                setStatus('error')
                setErrorMessage('Failed to load the plan. Please try again.')
            }
        }

        loadPlan()
    }, [shareCode, updateUser, router])

    return (
        <div className="flex min-h-[60vh] items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-900">
                {status === 'loading' && (
                    <>
                        <HugeiconsIcon
                            icon={Loading03Icon}
                            className="mx-auto size-12 animate-spin text-primary-500"
                        />
                        <h2 className="mt-4 text-xl font-semibold text-neutral-900 dark:text-white">
                            Loading Your Plan
                        </h2>
                        <p className="mt-2 text-neutral-500 dark:text-neutral-400">
                            Please wait while we restore your journey details...
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                            <HugeiconsIcon
                                icon={CheckmarkCircle01Icon}
                                className="size-8 text-green-600 dark:text-green-400"
                            />
                        </div>
                        <h2 className="mt-4 text-xl font-semibold text-neutral-900 dark:text-white">
                            Plan Loaded Successfully!
                        </h2>
                        <p className="mt-2 text-neutral-500 dark:text-neutral-400">
                            Redirecting you to your personalized dashboard...
                        </p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                            <HugeiconsIcon
                                icon={AlertCircleIcon}
                                className="size-8 text-red-600 dark:text-red-400"
                            />
                        </div>
                        <h2 className="mt-4 text-xl font-semibold text-neutral-900 dark:text-white">
                            Unable to Load Plan
                        </h2>
                        <p className="mt-2 text-neutral-500 dark:text-neutral-400">
                            {errorMessage}
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="mt-6 rounded-xl bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-700"
                        >
                            Start Fresh
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}
