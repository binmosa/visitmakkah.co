'use client'

import Avatar from '@/shared/Avatar'
import ButtonCircle from '@/shared/ButtonCircle'
import { Divider } from '@/shared/divider'
import { Link } from '@/shared/link'
import SwitchDarkMode2 from '@/shared/SwitchDarkMode2'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import {
  BulbChargingIcon,
  Idea01Icon,
  Login01Icon,
  Logout01Icon,
  UserIcon,
  UserCircleIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

interface Props {
  className?: string
}

export default function AvatarDropdown({ className }: Props) {
  const { user, isAuthenticated, isLoading, signOut } = useAuth()
  const router = useRouter()

  // Get user info from auth
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'
  const userEmail = user?.email || ''
  const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || ''

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className={className}>
        <ButtonCircle className="relative" plain>
          <div className="size-8 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-700" />
        </ButtonCircle>
      </div>
    )
  }

  // Non-authenticated user view
  if (!isAuthenticated) {
    return (
      <div className={className}>
        <Popover>
          <PopoverButton as={ButtonCircle} className="relative" plain>
            <HugeiconsIcon
              icon={UserCircleIcon}
              className="size-8 text-neutral-400 transition-colors hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
              strokeWidth={1.5}
            />
          </PopoverButton>

          <PopoverPanel
            transition
            anchor={{
              to: 'bottom end',
              gap: 16,
            }}
            className="z-40 w-72 rounded-3xl shadow-lg ring-1 ring-black/5 transition duration-200 ease-in-out data-closed:translate-y-1 data-closed:opacity-0"
          >
            <div className="relative flex flex-col gap-y-5 bg-white px-6 py-6 dark:bg-neutral-800">
              {/* Dark theme toggle */}
              <div className="focus-visible:ring-opacity-50 -m-3 flex items-center justify-between rounded-lg p-2 hover:bg-neutral-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 dark:hover:bg-neutral-700">
                <div className="flex items-center">
                  <div className="flex flex-shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                    <HugeiconsIcon icon={Idea01Icon} size={24} strokeWidth={1.5} />
                  </div>
                  <p className="ms-4 text-sm font-medium">Dark theme</p>
                </div>
                <SwitchDarkMode2 />
              </div>

              {/* Help */}
              <Link
                href={'/contact'}
                className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-orange-500/50 dark:hover:bg-neutral-700"
              >
                <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                  <HugeiconsIcon icon={BulbChargingIcon} size={24} strokeWidth={1.5} />
                </div>
                <p className="ms-4 text-sm font-medium">Help</p>
              </Link>

              <Divider />

              {/* Login */}
              <Link
                href={'/login'}
                className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-orange-500/50 dark:hover:bg-neutral-700"
              >
                <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                  <HugeiconsIcon icon={Login01Icon} size={24} strokeWidth={1.5} />
                </div>
                <p className="ms-4 text-sm font-medium">Login</p>
              </Link>
            </div>
          </PopoverPanel>
        </Popover>
      </div>
    )
  }

  // Authenticated user view
  return (
    <div className={className}>
      <Popover>
        <PopoverButton as={ButtonCircle} className="relative" plain>
          {userAvatar ? (
            <Avatar alt={userName} src={userAvatar} width={32} height={32} className="size-8 rounded-full object-cover" />
          ) : (
            <div className="flex size-8 items-center justify-center rounded-full bg-primary-500 text-sm font-medium text-white">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
        </PopoverButton>

        <PopoverPanel
          transition
          anchor={{
            to: 'bottom end',
            gap: 16,
          }}
          className="z-40 w-80 rounded-3xl shadow-lg ring-1 ring-black/5 transition duration-200 ease-in-out data-closed:translate-y-1 data-closed:opacity-0"
        >
          <div className="relative flex flex-col gap-y-5 bg-white px-6 py-6 dark:bg-neutral-800">
            {/* User info header */}
            <div className="relative flex items-center gap-x-3">
              {userAvatar ? (
                <Avatar
                  alt={userName}
                  src={userAvatar}
                  width={48}
                  height={48}
                  className="size-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-12 items-center justify-center rounded-full bg-primary-500 text-lg font-medium text-white">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="grow">
                <h4 className="font-semibold">{userName}</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{userEmail}</p>
              </div>
            </div>

            <Divider />

            {/* My Account */}
            <Link
              href={'/dashboard/edit-profile'}
              className="-m-3 flex items-center gap-x-4 rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-orange-500/50 dark:hover:bg-neutral-700"
            >
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon icon={UserIcon} size={24} strokeWidth={1.5} />
              </div>
              <p className="text-sm font-medium">My Account</p>
            </Link>

            <Divider />

            {/* Dark theme toggle */}
            <div className="focus-visible:ring-opacity-50 -m-3 flex items-center justify-between rounded-lg p-2 hover:bg-neutral-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 dark:hover:bg-neutral-700">
              <div className="flex items-center">
                <div className="flex flex-shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                  <HugeiconsIcon icon={Idea01Icon} size={24} strokeWidth={1.5} />
                </div>
                <p className="ms-4 text-sm font-medium">Dark theme</p>
              </div>
              <SwitchDarkMode2 />
            </div>

            {/* Help */}
            <Link
              href={'/contact'}
              className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-orange-500/50 dark:hover:bg-neutral-700"
            >
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon icon={BulbChargingIcon} size={24} strokeWidth={1.5} />
              </div>
              <p className="ms-4 text-sm font-medium">Help</p>
            </Link>

            <Divider />

            {/* Log out */}
            <button
              onClick={handleSignOut}
              className="-m-3 flex w-full items-center rounded-lg p-2 text-left transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-orange-500/50 dark:hover:bg-neutral-700"
            >
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon icon={Logout01Icon} size={24} strokeWidth={1.5} />
              </div>
              <p className="ms-4 text-sm font-medium">Log out</p>
            </button>
          </div>
        </PopoverPanel>
      </Popover>
    </div>
  )
}
