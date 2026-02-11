import '@/styles/tailwind.css'
import { Metadata } from 'next'
import { Inter, Noto_Sans_Arabic, Plus_Jakarta_Sans } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import ThemeProvider from './theme-provider'
import { AuthProvider } from '@/context/AuthContext'
import { SITE_CONFIG } from '@/data/site-config'

// Body font - reduced weights for performance
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600'],
  preload: true,
})

// Headings font - reduced weights for performance
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta-sans',
  weight: ['600', '700'],
  preload: true,
})

// Arabic font - reduced weights, loaded only when needed
const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-noto-sans-arabic',
  weight: ['400', '600'],
  preload: false, // Don't preload Arabic - not critical path
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
        {/* Preconnect to critical domains - establishes early connections */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.sanity.io" />
        {/* DNS prefetch for analytics (non-critical) */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body className="font-body bg-white text-base text-neutral-900 dark:bg-neutral-900 dark:text-neutral-200">
        {/* Prevent dark mode flash - runs before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (localStorage.getItem('theme') === 'dark-mode') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* ============================================
            Google Analytics 4 (GA4) - Load after page interactive
            Only loads after hydration to not block LCP
            ============================================ */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-W8M2508LHE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W8M2508LHE', {
              page_title: document.title,
              page_location: window.location.href,
              send_page_view: false
            });
          `}
        </Script>

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
