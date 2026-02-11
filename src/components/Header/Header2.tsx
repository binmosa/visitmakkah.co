import Logo from '@/shared/Logo'
import SwitchDarkMode from '@/shared/SwitchDarkMode'
import clsx from 'clsx'
import { FC } from 'react'
import AvatarDropdown from './AvatarDropdown'
import ClientNavigation from './Navigation/ClientNavigation'
import MobileNavTabs from './Navigation/MobileNavTabs'

interface Props {
  bottomBorder?: boolean
  className?: string
}

const Header2: FC<Props> = ({ bottomBorder, className }) => {
  return (
    // Sticky wrapper for mobile - header and nav stay fixed while scrolling
    <div className="sticky top-0 z-40 shadow-sm lg:relative lg:z-20 lg:shadow-none">
      <div
        className={clsx(
          'header-2 relative border-neutral-200 bg-white dark:border-neutral-700 dark:bg-[#134e4a]',
          bottomBorder && 'border-b lg:border-b',
          !bottomBorder && 'lg:border-b-0',
          className
        )}
      >
        <div className="container flex h-14 justify-between sm:h-16 lg:h-20">
          <div className="flex flex-1 items-center gap-x-4 sm:gap-x-5 lg:gap-x-7">
            <Logo />
          </div>

          <div className="mx-4 hidden flex-2 justify-center lg:flex">
            <ClientNavigation />
          </div>

          <div className="flex flex-1 items-center justify-end gap-x-1">
            <AvatarDropdown />
            <SwitchDarkMode className="bg-neutral-100 lg:hidden dark:bg-neutral-800" />
          </div>
        </div>
      </div>
      {/* Mobile Navigation Tabs - visible only on mobile */}
      <MobileNavTabs />
    </div>
  )
}

export default Header2
