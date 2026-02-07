import Logo from '@/shared/Logo'
import SwitchDarkMode from '@/shared/SwitchDarkMode'
import clsx from 'clsx'
import { FC } from 'react'
import AvatarDropdown from './AvatarDropdown'
import HamburgerBtnMenu from './HamburgerBtnMenu'
import ClientNavigation from './Navigation/ClientNavigation'
import NotifyDropdown from './NotifyDropdown'

interface Props {
  bottomBorder?: boolean
  className?: string
}

const Header2: FC<Props> = ({ bottomBorder, className }) => {
  return (
    <div
      className={clsx(
        'header-2 relative z-20 border-neutral-200 bg-white dark:border-neutral-700 dark:bg-[#134e4a]',
        bottomBorder && 'border-b',
        className
      )}
    >
      <div className="container flex h-20 justify-between">
        <div className="flex flex-1 items-center gap-x-4 sm:gap-x-5 lg:gap-x-7">
          <Logo />
        </div>

        <div className="mx-4 hidden flex-2 justify-center lg:flex">
          <ClientNavigation />
        </div>

        <div className="flex flex-1 items-center justify-end gap-x-0.5">

          <NotifyDropdown className="me-3" />
          <AvatarDropdown />
          <div className="ms-2 flex lg:hidden">
            <SwitchDarkMode className="bg-neutral-100 dark:bg-neutral-800" />
            <HamburgerBtnMenu className="ms-2" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header2
