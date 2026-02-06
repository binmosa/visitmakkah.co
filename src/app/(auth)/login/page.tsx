'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import Logo from '@/shared/Logo'
import Link from 'next/link'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Loading03Icon, CheckmarkCircle02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

// Google icon
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
        <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
    </svg>
)

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    // Handle email magic link login
    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email) {
            setMessage({ type: 'error', text: 'Please enter your email address' })
            return
        }

        if (!isSupabaseConfigured || !supabase) {
            setMessage({ type: 'error', text: 'Authentication is not configured' })
            return
        }

        setIsLoading(true)
        setMessage(null)

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        setIsLoading(false)

        if (error) {
            setMessage({ type: 'error', text: error.message })
        } else {
            setMessage({
                type: 'success',
                text: 'Check your email for the magic link!',
            })
        }
    }

    // Handle Google OAuth login
    const handleGoogleLogin = async () => {
        if (!isSupabaseConfigured || !supabase) {
            setMessage({ type: 'error', text: 'Authentication is not configured' })
            return
        }

        setIsGoogleLoading(true)
        setMessage(null)

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) {
            setIsGoogleLoading(false)
            setMessage({ type: 'error', text: error.message })
        }
        // If successful, user will be redirected to Google
    }

    return (
        <div className="container">
            <div className="my-16 flex justify-center">
                <Logo />
            </div>

            <div className="mx-auto max-w-md space-y-6">
                {/* Google Sign In */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3.5 text-sm font-medium text-neutral-700 shadow-sm ring-1 ring-neutral-200 transition-all hover:bg-neutral-50 disabled:opacity-50 dark:bg-neutral-800 dark:text-neutral-200 dark:ring-neutral-700 dark:hover:bg-neutral-700"
                >
                    {isGoogleLoading ? (
                        <HugeiconsIcon icon={Loading03Icon} className="size-5 animate-spin" />
                    ) : (
                        <GoogleIcon className="size-5" />
                    )}
                    Continue with Google
                </button>

                {/* OR Divider */}
                <div className="relative text-center">
                    <span className="relative z-10 inline-block bg-white px-4 text-sm font-medium text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
                        OR
                    </span>
                    <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 border border-neutral-200 dark:border-neutral-700"></div>
                </div>

                {/* Email Magic Link Form */}
                <form onSubmit={handleEmailLogin} className="space-y-5">
                    <Field className="block">
                        <Label className="text-neutral-800 dark:text-neutral-200">
                            Email address
                        </Label>
                        <Input
                            type="email"
                            placeholder="you@example.com"
                            className="mt-1.5"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                        <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                            We&apos;ll send you a magic link to sign in - no password needed
                        </p>
                    </Field>

                    {/* Message */}
                    {message && (
                        <div
                            className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
                                message.type === 'success'
                                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                    : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                            }`}
                        >
                            {message.type === 'success' && (
                                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-5" />
                            )}
                            {message.text}
                        </div>
                    )}

                    <ButtonPrimary type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <HugeiconsIcon icon={Loading03Icon} className="size-5 animate-spin" />
                                Sending link...
                            </>
                        ) : (
                            'Send Magic Link'
                        )}
                    </ButtonPrimary>
                </form>

                {/* Sign up link */}
                <div className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                        Sign up
                    </Link>
                </div>

                {/* Back to home */}
                <div className="text-center">
                    <Link
                        href="/"
                        className="text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
                    >
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    )
}
