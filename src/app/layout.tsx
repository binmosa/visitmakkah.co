import '@/styles/tailwind.css'
import { Metadata } from 'next'
import { Inter, Noto_Sans_Arabic, Plus_Jakarta_Sans } from 'next/font/google'
import Script from 'next/script'
import ThemeProvider from './theme-provider'
import { AuthProvider } from '@/context/AuthContext'

// Body font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
})

// Headings font
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta-sans',
  weight: ['400', '500', '600', '700', '800'],
})

// Arabic font
const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-noto-sans-arabic',
  weight: ['300', '400', '500', '600', '700'],
})

import { SITE_CONFIG } from '@/data/site-config'

export const metadata: Metadata = {
  title: {
    template: `%s - ${SITE_CONFIG.name}`,
    default: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  icons: {
    icon: '/logos/icon.svg',
    shortcut: '/logos/icon.svg',
    apple: '/logos/icon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakartaSans.variable} ${notoSansArabic.variable}`}
    >
      <body className="font-body bg-white text-base text-neutral-900 dark:bg-neutral-900 dark:text-neutral-200">
        {/* OpenAI ChatKit Script - Required for AI chat widgets */}
        <Script
          src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
          strategy="afterInteractive"
        />
        <ThemeProvider>
          <AuthProvider>
            <div>{children}</div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
