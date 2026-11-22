/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { APPS_PORTFOLIO, FAQ_ITEMS, SITE_CONFIG } from '@/lib/site-config';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#060a14' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.domain),
  title: {
    default: SITE_CONFIG.seo.title,
    template: `%s | ${SITE_CONFIG.companyName}`,
  },
  description: SITE_CONFIG.seo.description,
  applicationName: SITE_CONFIG.companyName,
  authors: [{ name: SITE_CONFIG.owner.name, url: SITE_CONFIG.domain }],
  creator: SITE_CONFIG.companyName,
  publisher: SITE_CONFIG.companyName,
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: SITE_CONFIG.logo.primaryPath, type: 'image/png' },
      { url: SITE_CONFIG.logo.fallbackPath, type: 'image/svg+xml' },
    ],
    shortcut: SITE_CONFIG.logo.fallbackPath,
    apple: SITE_CONFIG.logo.primaryPath,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.domain,
    siteName: SITE_CONFIG.companyName,
    title: SITE_CONFIG.seo.title,
    description: SITE_CONFIG.seo.description,
    images: [
      {
        url: SITE_CONFIG.seo.ogImage,
        width: 512,
        height: 512,
        alt: `${SITE_CONFIG.companyName} brand mark`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.seo.title,
    description: SITE_CONFIG.seo.description,
    images: [SITE_CONFIG.seo.ogImage],
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_CONFIG.domain}/#organization`,
      name: SITE_CONFIG.companyName,
      url: SITE_CONFIG.domain,
      logo: `${SITE_CONFIG.domain}${SITE_CONFIG.logo.primaryPath}`,
      founder: {
        '@type': 'Person',
        name: SITE_CONFIG.owner.name,
      },
      contactPoint: {
        '@type': 'ContactPoint',
        email: SITE_CONFIG.contact.email,
        contactType: 'customer support',
      },
      sameAs: [
        SITE_CONFIG.contact.googlePlayDeveloperUrl,
        SITE_CONFIG.contact.instagramUrl,
        SITE_CONFIG.contact.whatsappChannelUrl,
        SITE_CONFIG.contact.googleGroupUrl,
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_CONFIG.domain}/#website`,
      url: SITE_CONFIG.domain,
      name: SITE_CONFIG.companyName,
      description: SITE_CONFIG.seo.description,
      publisher: { '@id': `${SITE_CONFIG.domain}/#organization` },
    },
    {
      '@type': 'ItemList',
      name: 'Rahmani International Mobile Applications',
      itemListElement: APPS_PORTFOLIO.map((app, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: app.name,
          applicationCategory: app.categoryLabel,
          operatingSystem: 'Android',
          description: app.description,
          url: app.playStoreUrl,
          image: app.logo,
          publisher: { '@id': `${SITE_CONFIG.domain}/#organization` },
        },
      })),
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_CONFIG.domain}/#faq`,
      mainEntity: FAQ_ITEMS.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ],
};

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('rahmani-theme-preference');
    if (stored === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Manrope:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap"
        />
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)] antialiased selection:bg-blue-600/20 selection:text-blue-900 dark:selection:text-blue-100"
      >
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
          >
            Skip to main content
          </a>
          <SiteHeader />
          <div id="main-content" className="flex-1">
            {children}
          </div>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
