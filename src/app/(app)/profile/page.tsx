'use client'

import { useAuth } from '@/context/AuthContext'
import { useUserJourney } from '@/context/UserJourneyContext'
import Avatar from '@/shared/Avatar'
import { UserCircleIcon, Mail01Icon, Calendar03Icon, Passport01Icon, Location01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth()
  const { user: journeyUser } = useUserJourney()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="mx-auto max-w-lg animate-pulse">
          <div className="h-8 w-32 rounded bg-neutral-200 dark:bg-neutral-700" />
          <div className="mt-6 h-64 rounded-xl bg-neutral-200 dark:bg-neutral-700" />
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User'
  const userEmail = user.email || ''
  const userAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || ''
  const createdAt = user.created_at ? new Date(user.created_at).toLocaleDateString() : null

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  // Journey info
  const journeyTypeLabel = journeyUser.journeyType === 'hajj' ? 'Hajj' : journeyUser.journeyType === 'umrah' ? 'Umrah' : journeyUser.journeyType === 'both' ? 'Hajj & Umrah' : null
  const journeyStageLabel = journeyUser.journeyStage === 'planning' ? 'Planning' : journeyUser.journeyStage === 'booked' ? 'Booked' : journeyUser.journeyStage === 'in_makkah' ? 'In Makkah' : journeyUser.journeyStage === 'returned' ? 'Returned' : null

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-lg">
        <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Profile</h1>

        {/* Profile Card */}
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900">
          {/* Avatar & Name */}
          <div className="flex items-center gap-4">
            {userAvatar ? (
              <Avatar alt={userName} src={userAvatar} width={64} height={64} className="size-16 rounded-full object-cover" />
            ) : (
              <div className="flex size-16 items-center justify-center rounded-full bg-primary-500 text-2xl font-medium text-white">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">{userName}</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{userEmail}</p>
            </div>
          </div>

          {/* Info List */}
          <div className="mt-6 space-y-4">
            <InfoRow icon={Mail01Icon} label="Email" value={userEmail} />
            {createdAt && <InfoRow icon={Calendar03Icon} label="Member since" value={createdAt} />}
            {journeyTypeLabel && <InfoRow icon={Passport01Icon} label="Journey type" value={journeyTypeLabel} />}
            {journeyStageLabel && <InfoRow icon={Location01Icon} label="Current stage" value={journeyStageLabel} />}
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="mt-8 w-full rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value }: { icon: typeof UserCircleIcon; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <HugeiconsIcon icon={icon} className="size-4" strokeWidth={1.5} />
        <span>{label}</span>
      </div>
      <span className="text-sm font-medium text-neutral-900 dark:text-white">{value}</span>
    </div>
  )
}
