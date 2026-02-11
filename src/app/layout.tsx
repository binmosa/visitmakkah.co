import '@/styles/tailwind.css'
import { Metadata } from 'next'
import { Inter, Noto_Sans_Arabic, Plus_Jakarta_Sans } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import ThemeProvider from './theme-provider'
import { AuthProvider } from '@/context/AuthContext'
import { SITE_CONFIG } from '@/data/site-config'

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

// ============================================
// METADATA - Enhanced SEO Configuration
// ============================================
export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    template: `%s | ${SITE_CONFIG.name}`,
    default: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: 'Visit Makkah Team', url: SITE_CONFIG.url }],
  creator: 'Visit Makkah',
  publisher: 'Visit Makkah',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logos/icon.svg',
    shortcut: '/logos/icon.svg',
    apple: '/logos/icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: SITE_CONFIG.twitterHandle,
    creator: SITE_CONFIG.twitterHandle,
    title: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage],
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  category: 'travel',
}

// ============================================
// ROOT LAYOUT
// ============================================
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakartaSans.variable} ${notoSansArabic.variable}`}
    >
      <head>
        {/* DNS prefetch for external domains - improves connection time */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        {/* Preload critical assets */}
        <link rel="preload" href="/images/islamic-pattern.svg" as="image" type="image/svg+xml" />
      </head>
      <body className="font-body bg-white text-base text-neutral-900 dark:bg-neutral-900 dark:text-neutral-200">
        {/* ============================================
            Google Analytics 4 (GA4) - Deferred for performance
            Measurement ID: G-W8M2508LHE
            ============================================ */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-W8M2508LHE"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W8M2508LHE', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `}
        </Script>

        {/* OpenAI ChatKit Script - Lazy loaded for performance */}
        <Script
          src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
          strategy="lazyOnload"
        />

        {/* ============================================
            JSON-LD Structured Data - Organization
            ============================================ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: SITE_CONFIG.name,
              url: SITE_CONFIG.url,
              logo: `${SITE_CONFIG.url}/logos/icon.svg`,
              description: SITE_CONFIG.description,
              sameAs: [
                'https://twitter.com/visitmakkah',
                'https://instagram.com/visitmakkah',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                availableLanguage: ['English', 'Arabic'],
              },
            }),
          }}
        />

        {/* JSON-LD Structured Data - WebSite with Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: SITE_CONFIG.name,
              url: SITE_CONFIG.url,
              description: SITE_CONFIG.description,
              publisher: {
                '@type': 'Organization',
                name: SITE_CONFIG.name,
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />

        <ThemeProvider>
          <AuthProvider>
            <div>{children}</div>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
