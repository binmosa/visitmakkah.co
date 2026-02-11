import { getNavigation } from '@/data/navigation'
import Logo from '@/shared/Logo'
import clsx from 'clsx'
import { FC } from 'react'
import AvatarDropdown from './AvatarDropdown'
import HamburgerBtnMenu from './HamburgerBtnMenu'
import Navigation from './Navigation/Navigation'
import SearchModal from './SearchModal'

interface HeaderProps {
  bottomBorder?: boolean
  className?: string
}

const Header: FC<HeaderProps> = async ({ bottomBorder, className }) => {
  const navigation = await getNavigation()

  return (
    <div className={clsx('relative z-20', className)}>
      <div className="container">
        <div
          className={clsx(
            'flex h-20 justify-between gap-x-2.5 border-neutral-200 dark:border-neutral-700',
            bottomBorder && 'border-b'
          )}
        >
          <div className="flex items-center gap-x-4 sm:gap-x-5 lg:gap-x-7">
            <Logo />
            <div className="hidden h-8 border-l lg:block" />
            <Navigation menu={navigation} className="hidden lg:flex" />
          </div>

          <div className="ms-auto flex items-center justify-end gap-x-1">
            <div className="hidden md:block md:w-48 lg:w-56 xl:w-64">
              <SearchModal type="type2" />
            </div>
            <div className="hidden h-8 border-l md:block mx-3" />
            <AvatarDropdown />
            <div className="ms-2.5 flex lg:hidden">
              <HamburgerBtnMenu />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
