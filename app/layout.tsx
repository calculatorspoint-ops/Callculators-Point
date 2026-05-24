/**
 * app/layout.tsx — Root Layout (Next.js App Router)
 *
 * CSS IMPORT STRATEGY (critical for performance):
 * - All CSS is imported HERE as top-level ES module imports
 * - Next.js bundles these into a SINGLE CSS chunk per route
 * - Previously they were loaded via CSS @import in globals.css which created
 *   a serial waterfall: browser had to fetch globals.css FIRST, then discover
 *   and fetch each @import — adding 550ms of render-blocking delay per Lighthouse
 *
 * By importing directly in layout.tsx, Next.js can:
 * 1. Bundle all CSS into 1–2 chunks (vs 4 separate requests)
 * 2. Emit correct <link rel="stylesheet"> tags in the initial HTML head
 * 3. Allow the browser to start downloading CSS in parallel with HTML parsing
 */
import type { Viewport, Metadata } from 'next';
import './globals.css';
import '../src/styles/index.css';
import '../src/styles/mobile.css';
import '../src/styles/mobile-overflow-killer.css';
import '../src/styles/all-calculators.css';
import { ClientProviders } from './client-providers';

export const viewport: Viewport = {
  themeColor: '#0f172a',
};

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
  manifest: '/manifest.json',
};

import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  preload: true,
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jbmono',
  display: 'swap',
  preload: false, // monospace is not used above-the-fold, skip preloading
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          DNS prefetch for commonly-used external resources.
          Google Fonts is handled automatically by next/font, but we can
          hint the browser to prefetch Vercel's edge network.
        */}
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body className={`${inter.variable} ${jakarta.variable} ${mono.variable}`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
