import Logo from '@/shared/Logo'
import React from 'react'

const Footer: React.FC = () => {
  return (
    <div className="nc-Footer relative border-t border-neutral-200 py-8 dark:border-neutral-700">
      <div className="container flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          <Logo variant="icon" className="h-8 w-8" />
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
            © {new Date().getFullYear()} Visit Makkah. All rights reserved.
          </span>
        </div>
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          <a href="mailto:info@visitmakkah.co" className="hover:text-primary-600 dark:hover:text-primary-500">
            info@visitmakkah.co
          </a>
        </div>
      </div>
    </div>
  )
}

export default Footer
