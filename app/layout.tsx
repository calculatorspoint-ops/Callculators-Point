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
 *
 * ADSENSE: Loaded via next/script with strategy="lazyOnload" — fires during
 * browser idle time after the page is fully loaded. This is the least-impactful
 * loading strategy for Core Web Vitals while still loading the ad script globally.
 */
import type { Viewport, Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import '../src/styles/index.css';
import '../src/styles/mobile.css';
import '../src/styles/mobile-overflow-killer.css';
// NOTE: all-calculators.css is imported inside AllCalculators.jsx (page-scoped)
// Do NOT import it here — that would load 8.9KB on every page globally.
import { ClientProviders } from './client-providers';
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { CALC_COUNT_LABEL } from '@/data/calculatorConfigs';

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
    // Root default title — uses CALC_COUNT_LABEL (single source of truth, no hardcoding)
    default: `Calculators Point — ${CALC_COUNT_LABEL} Free Online Calculators`,
    template: '%s | Calculators Point',
  },
  description:
    `${CALC_COUNT_LABEL} free online calculators for finance, health, math, education, and everyday life. Fast, accurate, and always free.`,

  authors: [{ name: 'Calculators Point' }],
  creator: 'Calculators Point',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://calculatorspoint.com',
    siteName: 'Calculators Point',
    title: `Calculators Point — ${CALC_COUNT_LABEL} Free Online Calculators`,
    description: `${CALC_COUNT_LABEL} free online calculators for finance, health, math, and everyday life.`,
    images: [{
      url: 'https://calculatorspoint.com/api/og?title=Calculators+Point&icon=🧮&cat=180%2B+Free+Calculators',
      width: 1200,
      height: 630,
      alt: `Calculators Point — ${CALC_COUNT_LABEL} Free Online Calculators`,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Calculators Point — ${CALC_COUNT_LABEL} Free Online Calculators`,
    description: `${CALC_COUNT_LABEL} free online calculators for finance, health, math, and everyday life.`,
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

        {/* ── AdSense preconnect hints (reduces latency when the script loads) ── */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
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

        {/* ── Google AdSense — sitewide script, loaded once here ──────────────────────
            strategy="lazyOnload": fires during browser idle time after full page load.
            This is LESS impactful on INP/LCP than afterInteractive.
            The script auto-discovers all <ins class="adsbygoogle"> elements on the page.
            Publisher ID: ca-pub-5164672592255197
        ─────────────────────────────────────────────────────────────────────────── */}
        <Script
          id="adsense-loader"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5164672592255197"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
