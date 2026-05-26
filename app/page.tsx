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
import { CATEGORIES } from '@/data/calculatorConfigs';
import HomePageClient from './home-client';

const BASE_URL = 'https://calculatorspoint.com';

export const metadata: Metadata = {
  title: 'Free Online Calculators — Finance, Health, Math & More',
  description:
    '180+ free online calculators for finance, health, math, education & everyday life. EMI, BMI, SIP, GPA, tax, mortgage calculators — all fast, accurate, and free.',
  alternates: { canonical: BASE_URL },
  keywords: [
    'free online calculators',
    'finance calculator',
    'health calculator',
    'math calculator',
    'EMI calculator',
    'BMI calculator',
    'SIP calculator',
    'loan calculator',
    'tax calculator',
    'GPA calculator',
    'Calculators Point',
  ],
  openGraph: {
    title: 'Calculators Point — 180+ Free Online Calculators',
    description: 'Free EMI, BMI, SIP, mortgage, tax, and 180+ more calculators. All fast, accurate, and always free.',
    url: BASE_URL,
    type: 'website',
    siteName: 'Calculators Point',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculators Point — 180+ Free Online Calculators',
    description: 'Free EMI, BMI, SIP, mortgage, tax, and 180+ more calculators.',
  },
};

// WebSite schema — enables Google Sitelinks Searchbox
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Calculators Point',
  alternateName: 'CalculatorsPoint',
  url: BASE_URL,
  description: '180+ free online calculators for finance, health, math, education and everyday life.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/calculators?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

// Organization schema — helps Google understand the brand
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Calculators Point',
  alternateName: 'CalculatorsPoint',
  url: BASE_URL,
  logo: `${BASE_URL}/icon-192.png`,
  description: 'Free online calculators for finance, health, math, education and everyday life.',
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    url: `${BASE_URL}/contact`,
  },
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
              ✨ 180+ Free Tools · No Signup · Instant Results
            </div>

            <h1 className="hero-title">
              Your All-in-One<br />
              <span className="hero-accent">Calculator Suite</span>
            </h1>

            {/* THIS IS THE LCP ELEMENT — now server-rendered, zero JS delay */}
            <p className="hero-sub">
              Finance, health, math and everyday tools — with live charts, step-by-step breakdowns, and smart insights. 100% free, works offline, completely private.
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
                { icon: '🛡️', label: '100% Private' },
                { icon: '📈', label: 'Smart Insights' },
              ].map(({ icon, label }) => (
                <div key={label} className="hero-feature-pill">
                  <span aria-hidden="true">{icon}</span> {label}
                </div>
              ))}
            </div>
          </div>

          {/* Right column — placeholder for QuickCalc (hydrated by client component) */}
          <div className="hero-widget-col">
            <div className="hero-widget-label">⚡ Quick Calculator</div>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              {/* Skeleton placeholder — exact same size as QuickCalc widget.
                  Rendered server-side so it's visible immediately, preventing CLS. */}
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
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
