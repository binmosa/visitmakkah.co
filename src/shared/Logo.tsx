import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface Props {
  className?: string
  /** Use 'icon' for icon-only version, 'full' for full logo with text */
  variant?: 'full' | 'icon'
  /** Size classes for the logo container */
  size?: string
}

const Logo: React.FC<Props> = ({ className, variant = 'full', size }) => {
  const defaultSize = variant === 'icon' ? 'h-10 w-10' : 'h-10 w-auto'

  if (variant === 'icon') {
    return (
      <Link href="/" className={clsx('inline-block shrink-0', className, size || defaultSize)}>
        <Image
          src="/logos/icon.svg"
          alt="visitMakkah"
          width={40}
          height={40}
          className="h-full w-auto"
          priority
        />
      </Link>
    )
  }

  return (
    <Link href="/" className={clsx('inline-block shrink-0', className, size || defaultSize)}>
      {/* Light mode logo */}
      <Image
        src="/logos/primary-logo.svg"
        alt="visitMakkah"
        width={200}
        height={50}
        className="h-full w-auto dark:hidden"
        priority
      />
      {/* Dark mode logo */}
      <Image
        src="/logos/dark-logo.svg"
        alt="visitMakkah"
        width={200}
        height={50}
        className="hidden h-full w-auto dark:block"
        priority
      />
    </Link>
  )
}

export default Logo

