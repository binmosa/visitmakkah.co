import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-neutral-100 py-4 dark:border-neutral-800">
      <div className="container flex items-center justify-between text-[10px] text-neutral-400 dark:text-neutral-500">
        <span>© {new Date().getFullYear()} Visit Makkah</span>
        <a href="mailto:info@visitmakkah.co" className="hover:text-neutral-600 dark:hover:text-neutral-300">
          info@visitmakkah.co
        </a>
      </div>
    </footer>
  )
}

export default Footer
