/**
 * app/layout.tsx — Root Layout (Next.js App Router)
 *
 * CSS STRATEGY: All CSS imported here as ES module imports so Next.js
 * bundles them and emits parallel <link> tags in the HTML head.
 * CSS @import in globals.css creates serial waterfall; direct imports don't.
 *
 * PERFORMANCE:
 * - Inter + Jakarta preloaded (above-fold text). JetBrains Mono NOT preloaded
 *   (only used in QuickCalc widget, which is lazy-loaded).
 * - Inline <script> in <head> sets dark/light theme before first paint (no FOUC).
 */
import type { Viewport, Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import '../src/styles/index.css';
import '../src/styles/mobile.css';
import '../src/styles/mobile-overflow-killer.css';
import '../src/styles/all-calculators.css';
import { ClientProviders } from './client-providers';
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
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

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  // Only load the weights we actually use
  weight: ['400', '500', '600', '700', '800'],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  preload: true,
  weight: ['700', '800'],
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jbmono',
  display: 'swap',
  preload: false, // Only used in QuickCalc (lazy-loaded), skip preloading
});

// Inline theme script — runs synchronously before first paint to prevent FOUC
// Must be a plain string to avoid React serialization overhead
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('CalculatorsPoint-v3');var s=t&&JSON.parse(t);var theme=s&&s.state&&s.state.theme;if(theme==='dark'||(!theme&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline theme script: sets dark/light class BEFORE paint — eliminates FOUC */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {/* DNS prefetch for Google Fonts CDN (used by next/font) */}
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body className={`${inter.variable} ${jakarta.variable} ${mono.variable}`}>
        <ClientProviders>
          {children}
        </ClientProviders>

        {/* ── Google Analytics — loaded after page is interactive (doesn't block render) ── */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RZ1T9JVXMV"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RZ1T9JVXMV');
          `}
        </Script>
      </body>
    </html>
  );
}
