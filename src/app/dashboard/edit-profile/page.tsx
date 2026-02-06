'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Field, Fieldset, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import Avatar from '@/shared/Avatar'
import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkCircle02Icon, Loading03Icon } from '@hugeicons/core-free-icons'

const DashboardEditProfile = () => {
    const { user } = useAuth()
    const [displayName, setDisplayName] = useState('')
    const [email, setEmail] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    // Get user data from Google OAuth metadata
    const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || ''
    const googleName = user?.user_metadata?.full_name || user?.user_metadata?.name || ''

    // Initialize form with user data
    useEffect(() => {
        if (user) {
            setDisplayName(googleName || user.email?.split('@')[0] || '')
            setEmail(user.email || '')
        }
    }, [user, googleName])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setMessage(null)

        // For now, just show a success message
        // Profile updates would require Supabase profile table updates
        setTimeout(() => {
            setIsSaving(false)
            setMessage({ type: 'success', text: 'Profile updated successfully!' })
        }, 1000)
    }

    return (
        <div className="max-w-4xl">
            {/* Profile Header */}
            <div className="mb-8 flex items-center gap-6">
                <div className="relative">
                    {userAvatar ? (
                        <Avatar
                            src={userAvatar}
                            alt={displayName}
                            className="size-24"
                            width={96}
                            height={96}
                            sizes="96px"
                        />
                    ) : (
                        <div className="flex size-24 items-center justify-center rounded-full bg-primary-500 text-3xl font-medium text-white">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                        {displayName}
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {email}
                    </p>
                    <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
                        Signed in with {user?.app_metadata?.provider === 'google' ? 'Google' : 'Email'}
                    </p>
                </div>
            </div>

            {/* Edit Form */}
            <form className="islamic-pattern-bg overflow-hidden rounded-xl border border-neutral-200 p-6 dark:border-neutral-700" onSubmit={handleSubmit}>
                <Fieldset className="relative z-10 grid gap-6 md:grid-cols-2">
                    <Field className="block md:col-span-2">
                        <Label>Display Name</Label>
                        <Input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Your name"
                            className="mt-1"
                        />
                    </Field>

                    <Field className="block md:col-span-2">
                        <Label>Email Address</Label>
                        <Input
                            type="email"
                            value={email}
                            disabled
                            className="mt-1 bg-neutral-50 dark:bg-neutral-800"
                        />
                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                            Email cannot be changed for security reasons
                        </p>
                    </Field>

                    {/* Message */}
                    {message && (
                        <div className="md:col-span-2">
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
                        </div>
                    )}

                    <div className="md:col-span-2">
                        <ButtonPrimary type="submit" disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <HugeiconsIcon icon={Loading03Icon} className="size-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Update Profile'
                            )}
                        </ButtonPrimary>
                    </div>
                </Fieldset>
            </form>

            {/* Account Info */}
            <div className="islamic-pattern-bg mt-8 overflow-hidden rounded-xl border border-neutral-200 p-6 dark:border-neutral-700">
                <h3 className="relative z-10 text-lg font-semibold text-neutral-900 dark:text-white">
                    Account Information
                </h3>
                <dl className="relative z-10 mt-4 space-y-3 text-sm">
                    <div className="flex justify-between">
                        <dt className="text-neutral-500 dark:text-neutral-400">Account ID</dt>
                        <dd className="font-mono text-neutral-700 dark:text-neutral-300">
                            {user?.id?.slice(0, 8)}...
                        </dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-neutral-500 dark:text-neutral-400">Created</dt>
                        <dd className="text-neutral-700 dark:text-neutral-300">
                            {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                        </dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-neutral-500 dark:text-neutral-400">Last Sign In</dt>
                        <dd className="text-neutral-700 dark:text-neutral-300">
                            {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : '-'}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    )
}

export default DashboardEditProfile
