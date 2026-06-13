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
import '../src/styles/calculator-layout-fix.css';
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
      url: `https://calculatorspoint.com/api/og?title=Calculators+Point&icon=🧮&cat=${encodeURIComponent(`${CALC_COUNT_LABEL} Free Calculators`)}`,
      width: 1200,
      height: 630,
      alt: `Calculators Point — ${CALC_COUNT_LABEL} Free Online Calculators`,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Calculators Point — ${CALC_COUNT_LABEL} Free Online Calculators`,
    description: `${CALC_COUNT_LABEL} free online calculators for finance, health, math, and everyday life.`,
    images: [`https://calculatorspoint.com/api/og?title=Calculators+Point&icon=🧮&cat=${encodeURIComponent(`${CALC_COUNT_LABEL} Free Calculators`)}`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  manifest: '/manifest.json',
};

// ── Font Loading — Optimized for LCP ─────────────────────────────────────────
// Inter: reduced from 5 weights to 3 → removes 2 font requests from critical path.
// 500 rounds up to 600 visually. 800 is only used in display headings handled by Jakarta.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  weight: ['400', '600', '700'],
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

        {/* ── Google Analytics Consent Mode v2 — MUST run before gtag.js loads ────
            Setting consent defaults BEFORE the gtag.js script fires ensures
            GA4 never collects data before the user has made a choice.
            This is required for Consent Mode v2 (Google's enforcement from 2024).
        ──────────────────────────────────────────────────────────────────────── */}
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500
          });
        ` }} />

        {/* ── AdSense site ownership verification ─────────────────────────────────
            Required by Google for AdSense review. Must be in <head> on every page.
        ─────────────────────────────────────────────────────────────────── */}
        <meta name="google-adsense-account" content="ca-pub-5164672592255197" />

        {/* ── Resource hints ────────────────────────────────────────────────────
            REMOVED: self-preconnect to calculatorspoint.com was a no-op that
            Lighthouse flagged as an unnecessary resource hint error.

            preconnect: establishes TCP+TLS to external origins before the
            browser discovers the resource, eliminating connection setup latency.
        ─────────────────────────────────────────────────────────────────── */}

        {/* Google Fonts CDN — preconnect so font files start downloading sooner */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

        {/* AdSense — dns-prefetch only; preconnect removed because lazyOnload
            fires during idle time — a preconnect that early wastes a TCP slot */}
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />

        {/* Google Analytics */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body className={`${inter.variable} ${jakarta.variable} ${mono.variable}`} suppressHydrationWarning>
        <ClientProviders>
          {children}
        </ClientProviders>

        {/* ── Google AdSense ────────────────────────────────────────────────────
            strategy="lazyOnload": fires during browser idle time AFTER LCP is
            already painted. This is the least impactful strategy for Core Web
            Vitals — the ad script never competes with LCP or FID.

            WHY lazyOnload over afterInteractive:
            afterInteractive fires immediately after hydration, which can still
            compete with TTI. lazyOnload waits for idle time, giving the page
            full rendering priority before any ad scripts run.

            Google's own PageSpeed team recommends lazyOnload for AdSense.
        ──────────────────────────────────────────────────────────────────── */}
        <Script
          id="adsense-script"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5164672592255197"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />

        {/* ── Google Analytics — Consent Mode v2 (GDPR/PECR compliant) ────────────────
            1. Consent defaults are set in <head> BEFORE this script loads (above)
            2. gtag.js loads after page is interactive (afterInteractive — no render blocking)
            3. CookieConsent component calls window.gtag('consent','update',{...}) on Accept
            4. This is fully compliant with EU ePrivacy Directive (PECR) and GDPR
        ─────────────────────────────────────────────────────────────────────── */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RZ1T9JVXMV"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', 'G-RZ1T9JVXMV', { send_page_view: true });
          `}
        </Script>

      </body>
    </html>
  );
}
