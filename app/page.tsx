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
import { CATEGORIES, CALC_COUNT_LABEL, POPULAR } from '@/data/calculatorConfigs';
import HomePageClient from './home-client';
import { SITE_URL } from '@/config/site';
import { JsonLd } from '@/components/JsonLd';

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
      url: `${SITE_URL}/api/og?title=${encodeURIComponent('Calculators Point')}&icon=${encodeURIComponent('🧮')}&cat=${encodeURIComponent(`${CALC_COUNT_LABEL} Free Calculators`)}`,
      width: 1200,
      height: 630,
      alt: `Calculators Point — ${CALC_COUNT_LABEL} Free Online Calculators`,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Calculators Point — ${CALC_COUNT_LABEL} Free Online Calculators`,
    description: `Free EMI, BMI, SIP, mortgage, tax, and ${CALC_COUNT_LABEL} more calculators.`,
    images: [`${SITE_URL}/api/og?title=${encodeURIComponent('Calculators Point')}&icon=${encodeURIComponent('🧮')}&cat=${encodeURIComponent(`${CALC_COUNT_LABEL} Free Calculators`)}`],
  },
};

// ── JSON-LD Schemas ──────────────────────────────────────────────────────────
//
// 1. Organization + WebSite + SiteLinksSearchBox
//    SiteLinksSearchBox tells Google to show a search box in the SERP sitelinks.
//    The search-terms-url must match the URL format used by our /calculators search route.
//
//    IMPORTANT: The WebSite '@id' (${SITE_URL}/#website) is referenced by every
//    calculator page's WebPage schema via 'isPartOf'. These MUST match.
//
const siteSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Calculators Point',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
        width: 512,
        height: 512,
      },
      sameAs: [
        'https://twitter.com/CalculatorsPt',
        'https://www.facebook.com/calculatorspoint',
        'https://www.linkedin.com/company/calculatorspoint'
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Calculators Point',
      description: `${CALC_COUNT_LABEL} free online calculators for finance, health, math, education, and everyday life.`,
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
    {
      // WebPage for homepage itself — signals freshness and links to WebSite entity
      '@type': 'WebPage',
      '@id': `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: `Calculators Point — ${CALC_COUNT_LABEL} Free Online Calculators`,
      description: `${CALC_COUNT_LABEL} free online calculators for finance, health, math, education & everyday life.`,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@type': 'Thing', name: 'Online Calculators' },
      inLanguage: 'en-US',
      dateModified: new Date().toISOString().slice(0, 10),
    },
  ],
};

// 2. ItemList schema — surfaces popular calculators directly in SERPs.
//    Google can render these as a list carousel from the homepage.
const popularItemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: `Popular Free Online Calculators`,
  description: `Top-rated free calculators on Calculators Point for finance, health, and math.`,
  url: SITE_URL,
  numberOfItems: POPULAR.length,
  itemListElement: POPULAR.slice(0, 10).map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    description: c.desc,
    url: `${SITE_URL}/calculator/${c.slug}`,
  })),
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

          {/* Right column — static placeholder replaces interactive QuickCalc in hero.
              Keeps the visual footprint (prevents CLS) with ZERO JS cost.
              The interactive QuickCalc loads below the fold via HomePageClient. */}
          <div className="hero-widget-col" aria-hidden="true">
            <div className="hero-widget-label">⚡ Quick Calculator</div>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              {/* Static skeleton that matches QuickCalc dimensions exactly */}
              <div
                className="hero-calc-placeholder"
                role="img"
                aria-label="Interactive calculator widget — loads after page"
              >
                <div className="hero-calc-display">
                  <span className="hero-calc-display-hint">0</span>
                </div>
                <div className="hero-calc-btns">
                  {['C', '±', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '0', '.', '='].map((btn) => (
                    <div
                      key={btn}
                      className={`hero-calc-btn${btn === '=' ? ' hero-calc-btn--eq' : btn === '0' ? ' hero-calc-btn--zero' : ['C', '±', '%', '÷', '×', '−', '+'].includes(btn) ? ' hero-calc-btn--op' : ''}`}
                    >
                      {btn}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category pills — semantic nav for screen readers */}
        <nav className="hero-pills" aria-label="Calculator categories">
          {CATEGORIES.map(cat => (
            <Link key={cat.id} href={`/category/${cat.id}`} className="hero-pill">
              <span aria-hidden="true">{cat.icon}</span> {cat.name}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}

/**
 * PopularSection — server-rendered crawlable popular calculator links.
 *
 * WHY SERVER-RENDERED:
 *   The Home.jsx "Trending Now" section is gated behind requestIdleCallback
 *   + belowFoldReady state — Googlebot sees NONE of those links in the initial
 *   HTML. This server component emits all popular calculator links in the
 *   first-byte HTML response so they are 100% crawlable.
 *
 *   Hover effects are CSS-only (:hover) to avoid any JS dependency.
 */
function PopularSection() {
  const popular = POPULAR.slice(0, 10);
  return (
    <div
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        overflowX: 'hidden',
      }}
      aria-label="Popular calculators"
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px clamp(12px,4vw,20px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span aria-hidden="true">🔥</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>Trending Now</span>
          </div>
          <Link
            href="/calculators"
            style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand)', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            View All →
          </Link>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 10,
            overflowX: 'auto',
            paddingBottom: 4,
            scrollbarWidth: 'none',
          }}
        >
          {popular.map((c, i) => {
            const cat = CATEGORIES.find(x => x.id === c.cat);
            return (
              <Link
                key={c.id}
                href={`/calculator/${c.slug}`}
                aria-label={`${c.name} — rank #${i + 1}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  padding: '12px 14px',
                  background: cat?.bg ?? 'var(--surf2)',
                  border: `1.5px solid ${cat?.color ?? 'var(--border)'}20`,
                  borderRadius: 'var(--r-xl)',
                  textDecoration: 'none',
                  minWidth: 130,
                  flexShrink: 0,
                  transition: 'all .15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 22 }} aria-hidden="true">{c.icon}</span>
                  <span
                    style={{
                      fontSize: 10, fontWeight: 800, color: '#92400e',
                      background: '#fef3c7', padding: '1px 6px', borderRadius: 100,
                    }}
                    aria-label={`Rank ${i + 1}`}
                  >
                    #{i + 1}
                  </span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', lineHeight: 1.4 }}>
                  {c.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/*
        JSON-LD Structured Data — server-rendered at build time, zero JS cost.
        Uses JsonLd component which safely escapes `<` as `\u003c` to prevent
        the browser HTML parser from closing the <script> tag early.
      */}
      <JsonLd data={[siteSchema, popularItemListSchema]} />

      {/* ── SERVER-RENDERED HERO (LCP element) ──
          This HTML is in the initial response — browser paints it before any JS loads.
          The client component below will hydrate the hero and replace the skeleton
          with the real QuickCalc widget. */}
      <HeroSection />

      {/*
        ── SERVER-RENDERED POPULAR SECTION ──
        All popular calculator links are in the first-byte HTML.
        Googlebot and other crawlers can follow these links without running JS.
        The interactive client component below will hide this section and replace
        it with its own version once hydrated (both render the same data).
      */}
      <PopularSection />

      {/* ── CLIENT COMPONENT (everything below the hero) ──
          Hydrated after the hero is already painted on screen. */}
      <HomePageClient skipHero />
    </>
  );
}
