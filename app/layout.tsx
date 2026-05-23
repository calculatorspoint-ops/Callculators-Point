/**
 * app/layout.tsx — Root Layout (Next.js App Router)
 *
 * - Renders the shell: Navbar, main content, Footer
 * - Imports all global CSS from src/styles/
 * - Provides i18n, Toaster, analytics
 * - All child pages render inside {children}
 */
import type { Metadata } from 'next';
import './globals.css';
import '../src/styles/index.css';
import '../src/styles/mobile.css';
import '../src/styles/mobile-overflow-killer.css';
import '../src/styles/all-calculators.css';
import { ClientProviders } from './client-providers';

export const metadata: Metadata = {
  metadataBase: new URL('https://calculatorspoint.com'),
  title: {
    default: 'CalculatorsPoint — Free Online Calculators',
    template: '%s | CalculatorsPoint',
  },
  description:
    '180+ free online calculators for finance, health, math, education, and everyday life. Fast, accurate, and always free.',
  keywords: ['calculator', 'free calculator', 'online calculator', 'finance calculator', 'health calculator'],
  authors: [{ name: 'CalculatorsPoint' }],
  creator: 'CalculatorsPoint',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://calculatorspoint.com',
    siteName: 'CalculatorsPoint',
    title: 'CalculatorsPoint — Free Online Calculators',
    description: '180+ free online calculators for finance, health, math, and everyday life.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CalculatorsPoint — Free Online Calculators',
    description: '180+ free online calculators for finance, health, math, and everyday life.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Fonts — non-blocking, preconnect first */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@700;800;900&family=JetBrains+Mono:wght@400;600&display=swap"
          media="print"
          // @ts-expect-error - onload trick for non-blocking font load
          onLoad="this.media='all'"
        />
        {/* Canonical tag is handled per-page via generateMetadata */}
      </head>
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
