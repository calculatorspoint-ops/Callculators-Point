/**
 * app/layout.tsx — Root Layout (Next.js App Router)
 *
 * - Renders the shell: Navbar, main content, Footer
 * - Imports all global CSS from src/styles/
 * - Provides i18n, Toaster, analytics
 * - All child pages render inside {children}
 */
import type { Viewport, Metadata } from 'next';
import './globals.css';
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
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jbmono',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jakarta.variable} ${mono.variable}`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
