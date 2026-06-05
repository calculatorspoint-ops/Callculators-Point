/**
 * app/page.tsx — Home Page (SSG)
 *
 * LCP OPTIMIZATION: The hero section (including <p class="hero-sub"> which is
 * the LCP element) is rendered as a SERVER component directly in this file.
 * This means it ships as raw HTML in the initial response — no JavaScript needed
 * to render it. The browser paints it immediately after CSS loads.
 *
 * The rest of the homepage (below-fold content, interactive widgets) is still
 * rendered by HomePageClient (client component, hydrated after initial paint).
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { CATEGORIES, CALC_COUNT_LABEL } from '@/data/calculatorConfigs';
import HomePageClient from './home-client';
import { SITE_URL } from '@/config/site';
import { QuickCalc } from '@/components/ui/QuickCalc';

export const metadata: Metadata = {
  // Title: use `absolute` to bypass the root layout template ('%s | Calculators Point').
  // Without `absolute`, Next.js would render "Calculators Point — 180+ Free Online Calculators | Calculators Point"
  // while og:title stays clean — creating the exact mismatch the audit flagged.
  // `absolute` guarantees <title> === og:title === "Calculators Point — {COUNT}+ Free Online Calculators".
  title: {
    absolute: `Calculators Point — ${CALC_COUNT_LABEL} Free Online Calculators`,
  },
  description:
    `${CALC_COUNT_LABEL} free online calculators for finance, health, math, education & everyday life. EMI, BMI, SIP, GPA, tax, mortgage calculators — all fast, accurate, and free.`,
  // canonical uses SITE_URL (https://calculatorspoint.com — non-www),
  // consistent with the 301 redirect from www and metadataBase in layout.tsx.
  alternates: { canonical: SITE_URL },

  openGraph: {
    title: `Calculators Point — ${CALC_COUNT_LABEL} Free Online Calculators`,
    description: `Free EMI, BMI, SIP, mortgage, tax, and ${CALC_COUNT_LABEL} more calculators. All fast, accurate, and always free.`,
    url: SITE_URL,
    type: 'website',
    siteName: 'Calculators Point',
    images: [{
      url: `${SITE_URL}/api/og?title=${encodeURIComponent('Calculators Point')}&icon=${encodeURIComponent('🧮')}&cat=${encodeURIComponent('180%2B Free Calculators')}`,
      width: 1200,
      height: 630,
      alt: `Calculators Point — ${CALC_COUNT_LABEL} Free Online Calculators`,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Calculators Point — ${CALC_COUNT_LABEL} Free Online Calculators`,
    description: `Free EMI, BMI, SIP, mortgage, tax, and ${CALC_COUNT_LABEL} more calculators.`,
    images: [`${SITE_URL}/api/og?title=${encodeURIComponent('Calculators Point')}&icon=${encodeURIComponent('🧮')}&cat=${encodeURIComponent('180%2B Free Calculators')}`],
  },
};

// Organization + WebSite + SiteLinksSearchBox schema.
// SiteLinksSearchBox tells Google to show a search box in the SERP sitelinks.
// The search-terms-url must match the URL format used by our /calculators search route.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Calculators Point',
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      sameAs: [
        'https://twitter.com/CalculatorsPt',
        'https://www.facebook.com/calculatorspoint',
        'https://www.linkedin.com/company/calculatorspoint'
      ]
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Calculators Point',
      publisher: {
        '@id': `${SITE_URL}/#organization`,
      },
      // SiteLinksSearchBox — renders a search field inside Google's sitelinks panel
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/calculators?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

/**
 * Server-rendered hero section — this is the LCP element.
 * Rendered as static HTML at build time. Zero JavaScript needed to display it.
 * The browser can paint <p class="hero-sub"> immediately after CSS loads.
 */
function HeroSection() {
  return (
    <section className="hero" aria-label="Hero section">
      <div className="hero-inner">
        <div className="hero-layout">
          {/* Left column — entirely static, no interactivity needed */}
          <div className="hero-content">
            <div className="hero-badge">
              ✨ {CALC_COUNT_LABEL} Free Tools · No Signup · Instant Results
            </div>

            <h1 className="hero-title">
              Free Online<br />
              <span className="hero-accent">Calculators</span>
            </h1>

            {/* THIS IS THE LCP ELEMENT — now server-rendered, zero JS delay */}
            <p className="hero-sub">
              Access {CALC_COUNT_LABEL} free online calculators for finance, health, math, and everyday life. Calculate BMI, EMI, mortgages, percentages, and GPA instantly with live charts and step-by-step formulas. 100% free, with calculations processed locally in your browser.
            </p>

            <div className="hero-actions">
              <Link href="/calculators" className="btn-primary" aria-label="Browse all calculators">
                Explore All Tools →
              </Link>
              <Link href="/calculator/loan-emi-calculator" className="btn-ghost">
                Try EMI Calculator
              </Link>
            </div>

            {/* Feature pills — static text, no interactivity */}
            <div className="hero-features">
              {[
                { icon: '⚡', label: 'Instant Results' },
                { icon: '📊', label: 'Live Charts' },
                { icon: '🛡️', label: 'Local Calculations' },
                { icon: '📈', label: 'Smart Insights' },
              ].map(({ icon, label }) => (
                <div key={label} className="hero-feature-pill">
                  <span aria-hidden="true">{icon}</span> {label}
                </div>
              ))}
            </div>
          </div>

          {/* Right column — QuickCalc client component, hydrated on the client */}
          <div className="hero-widget-col">
            <div className="hero-widget-label">⚡ Quick Calculator</div>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              {/* Suspense fallback = skeleton (same size, prevents CLS).
                  After hydration the real interactive QuickCalc replaces it. */}
              <Suspense fallback={
                <div
                  style={{
                    width: 300,
                    height: 400,
                    borderRadius: 20,
                    background: 'rgba(15,23,42,.92)',
                    border: '1.5px solid rgba(255,255,255,.1)',
                  }}
                  aria-hidden="true"
                />
              }>
                <QuickCalc />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Category pills — links, fully functional without JS */}
        <div className="hero-pills" role="navigation" aria-label="Calculator categories">
          {CATEGORIES.map(cat => (
            <Link key={cat.id} href={`/category/${cat.id}`} className="hero-pill">
              <span>{cat.icon}</span> {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      {/* WebSite + Organization JSON-LD — server-rendered, zero JS cost */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── SERVER-RENDERED HERO (LCP element) ──
          This HTML is in the initial response — browser paints it before any JS loads.
          The client component below will hydrate the hero and replace the skeleton
          with the real QuickCalc widget. */}
      <HeroSection />

      {/* ── CLIENT COMPONENT (everything below the hero) ──
          Hydrated after the hero is already painted on screen. */}
      <HomePageClient skipHero />
    </>
  );
}
