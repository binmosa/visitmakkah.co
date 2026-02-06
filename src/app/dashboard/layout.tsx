'use client'

import NotifyDropdown from '@/components/Header/NotifyDropdown'
import Avatar from '@/shared/Avatar'
import Logo from '@/shared/Logo'
import { Divider } from '@/shared/divider'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/shared/dropdown'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

const navigation = [
    { name: 'Profile', href: '/dashboard/edit-profile' },
    { name: 'Saved Items', href: '/dashboard/posts' },
]

export default function Layout({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const { user, isLoading, isAuthenticated, signOut } = useAuth()

    const isActive = (href: string) => pathname === href
    const pageTitle = navigation.find((item) => isActive(item.href))?.name ?? 'Dashboard'

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login')
        }
    }, [isLoading, isAuthenticated, router])

    const handleSignOut = async () => {
        await signOut()
        router.push('/')
    }

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
            </div>
        )
    }

    // Don't render dashboard if not authenticated
    if (!isAuthenticated) {
        return null
    }

    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
    const userEmail = user?.email || ''
    const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || ''

    return (
        <>
            <div className="min-h-screen">
                <Disclosure as="nav">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-20 justify-between">
                            <div className="flex">
                                <div className="flex shrink-0 items-center">
                                    <Logo variant="icon" />
                                </div>
                                <div className="hidden sm:-my-px sm:ms-6 sm:flex sm:gap-x-8">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            aria-current={isActive(item.href) ? 'page' : undefined}
                                            className={clsx(
                                                isActive(item.href)
                                                    ? 'border-primary-500'
                                                    : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-neutral-200',
                                                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                                            )}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <div className="hidden gap-x-4 sm:ms-6 sm:flex sm:items-center">
                                <NotifyDropdown />

                                {/* Profile dropdown */}
                                <Dropdown>
                                    <DropdownButton as={'button'} className="rounded-full">
                                        {userAvatar ? (
                                            <Avatar
                                                alt={userName}
                                                src={userAvatar}
                                                className="size-8"
                                                width={32}
                                                height={32}
                                                sizes="32px"
                                            />
                                        ) : (
                                            <div className="flex size-8 items-center justify-center rounded-full bg-primary-500 text-sm font-medium text-white">
                                                {userName.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </DropdownButton>
                                    <DropdownMenu>
                                        <DropdownItem href="/dashboard/edit-profile">Profile</DropdownItem>
                                        <DropdownItem onClick={handleSignOut}>Sign out</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                            <div className="-me-2 flex items-center sm:hidden">
                                {/* Mobile menu button */}
                                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-white p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-hidden dark:bg-neutral-900">
                                    <span className="absolute -inset-0.5" />
                                    <span className="sr-only">Open main menu</span>
                                    <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                                    <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                                </DisclosureButton>
                            </div>
                        </div>

                        <Divider />
                    </div>

                    <DisclosurePanel className="sm:hidden">
                        <div className="space-y-1 pt-2 pb-3">
                            {navigation.map((item) => (
                                <DisclosureButton
                                    key={item.name}
                                    as={Link}
                                    href={item.href}
                                    aria-current={isActive(item.href) ? 'page' : undefined}
                                    className={clsx(
                                        isActive(item.href)
                                            ? 'border-primary-500 bg-neutral-50 dark:bg-white/10'
                                            : 'border-transparent text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200',
                                        'block border-s-4 py-2 ps-3 pe-4 text-base font-medium'
                                    )}
                                >
                                    {item.name}
                                </DisclosureButton>
                            ))}
                        </div>
                        <div className="border-t border-neutral-200 pt-4 pb-3 dark:border-neutral-700">
                            <div className="flex items-center px-4">
                                <div className="shrink-0">
                                    {userAvatar ? (
                                        <Avatar src={userAvatar} className="size-10" width={40} height={40} sizes="40px" />
                                    ) : (
                                        <div className="flex size-10 items-center justify-center rounded-full bg-primary-500 text-lg font-medium text-white">
                                            {userName.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="ms-3">
                                    <div className="text-base font-medium">{userName}</div>
                                    <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                        {userEmail}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 space-y-1">
                                <DisclosureButton
                                    as={Link}
                                    href="/dashboard/edit-profile"
                                    className="block px-4 py-2 text-base font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
                                >
                                    Profile
                                </DisclosureButton>
                                <DisclosureButton
                                    as="button"
                                    onClick={handleSignOut}
                                    className="block w-full px-4 py-2 text-left text-base font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
                                >
                                    Sign out
                                </DisclosureButton>
                            </div>
                        </div>
                    </DisclosurePanel>
                </Disclosure>

                <div className="py-12">
                    <header>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
                        </div>
                    </header>
                    <main>
                        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">{children}</div>
                    </main>
                </div>
            </div>
        </>
    )
}
