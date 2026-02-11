import Link from 'next/link'
import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-neutral-100 py-4 dark:border-neutral-800">
      <div className="container flex flex-col gap-2 text-[10px] text-neutral-400 sm:flex-row sm:items-center sm:justify-between dark:text-neutral-500">
        <span>© {new Date().getFullYear()} Visit Makkah · v1.0</span>
        <div className="flex items-center gap-3">
          <Link
            href="/terms-and-conditions"
            className="hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            Terms
          </Link>
          <span className="text-neutral-300 dark:text-neutral-600">·</span>
          <Link
            href="/privacy-and-policy"
            className="hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            Privacy
          </Link>
          <span className="text-neutral-300 dark:text-neutral-600">·</span>
          <a
            href="mailto:info@visitmakkah.co"
            className="hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
