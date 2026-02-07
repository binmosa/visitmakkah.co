'use client'

import { usePersonalizedNavigation } from '@/components/Providers/PersonalizedNavigationProvider'
import SidebarNavigation from './Header/Navigation/SidebarNavigation'
import Aside from './aside'

interface Props {
  className?: string
}

const AsideSidebarNavigation = ({ className }: Props) => {
  const { navigation, isLoading } = usePersonalizedNavigation()

  return (
    <Aside openFrom="right" type="sidebar-navigation" logoOnHeading contentMaxWidthClassName="max-w-md">
      <div className="flex h-full flex-col">
        <div className="hidden-scrollbar flex-1 overflow-x-hidden overflow-y-auto py-6">
          {isLoading ? (
            <div className="space-y-3 px-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-700" />
              ))}
            </div>
          ) : (
            <SidebarNavigation data={navigation} />
          )}
        </div>
      </div>
    </Aside>
  )
}

export default AsideSidebarNavigation
