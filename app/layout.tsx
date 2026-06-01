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
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import '../src/styles/index.css';
import '../src/styles/mobile.css';
import '../src/styles/mobile-overflow-killer.css';
// NOTE: all-calculators.css is imported inside AllCalculators.jsx (page-scoped)
// Do NOT import it here — that would load 8.9KB on every page globally.
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
    // Issue 1 fix: root default title matches the brand-consistent format
    default: 'Calculators Point — 180+ Free Online Calculators',
    template: '%s | Calculators Point',
  },
  description:
    '180+ free online calculators for finance, health, math, education, and everyday life. Fast, accurate, and always free.',

  authors: [{ name: 'Calculators Point' }],
  creator: 'Calculators Point',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://calculatorspoint.com',
    siteName: 'Calculators Point',
    title: 'Calculators Point — 180+ Free Online Calculators',
    description: '180+ free online calculators for finance, health, math, and everyday life.',
    images: [{
      url: 'https://calculatorspoint.com/api/og?title=Calculators+Point&icon=🧮&cat=180%2B+Free+Calculators',
      width: 1200,
      height: 630,
      alt: 'Calculators Point — 180+ Free Online Calculators',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculators Point — 180+ Free Online Calculators',
    description: '180+ free online calculators for finance, health, math, and everyday life.',
    images: ['https://calculatorspoint.com/api/og?title=Calculators+Point&icon=🧮&cat=180%2B+Free+Calculators'],
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

        {/* ── Resource hints: resolve connections before browser discovers resources ── */}
        {/* preconnect: establishes TCP+TLS to our CDN before CSS/JS requests start */}
        <link rel="preconnect" href="https://calculatorspoint.com" />
      </head>
      <body className={`${inter.variable} ${jakarta.variable} ${mono.variable}`} suppressHydrationWarning>
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

        {/* ── Vercel Speed Insights — monitors real-user performance metrics ── */}
        <SpeedInsights />
      </body>
    </html>
  );
}
