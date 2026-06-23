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
import HeroCalcWidget from './hero-calc-widget';
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
      url: `${SITE_URL}/og-image.png`,
      width: 1200,
      height: 630,
      alt: `Calculators Point — ${CALC_COUNT_LABEL} Free Online Calculators`,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Calculators Point — ${CALC_COUNT_LABEL} Free Online Calculators`,
    description: `Free EMI, BMI, SIP, mortgage, tax, and ${CALC_COUNT_LABEL} more calculators.`,
    images: [`${SITE_URL}/og-image.png`],
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
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'contact@calculatorspoint.com',
        contactType: 'customer support',
        availableLanguage: 'English',
      },
      // sameAs: Only add verified, active social profiles.
      // Removed placeholder Twitter/Facebook/LinkedIn links — unverified sameAs
      // entries cause Google's Knowledge Graph to distrust the Organization entity.
      // Add real profile URLs here once accounts are established.
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
      // dateModified is STATIC — do not use new Date() here. Dynamic dates that change
      // on every build mislead Googlebot into treating unchanged pages as freshly updated,
      // which erodes crawl trust over time. Update this date manually after real content changes.
      '@type': 'WebPage',
      '@id': `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: `Calculators Point — ${CALC_COUNT_LABEL} Free Online Calculators`,
      description: `${CALC_COUNT_LABEL} free online calculators for finance, health, math, education & everyday life.`,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@type': 'Thing', name: 'Online Calculators' },
      inLanguage: 'en-US',
      dateModified: '2026-06-22',
      datePublished: '2025-01-01',
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
  numberOfItems: Math.min(POPULAR.length, 10),
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
              Free Online{' '}
              <br />
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

          {/* Right column — interactive QuickCalc widget */}
          <div className="hero-widget-col">
            <div className="hero-widget-label">⚡ Quick Calculator</div>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <HeroCalcWidget />
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
      id="server-popular-strip"
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

// ── Home Page FAQ — server-rendered, fully indexed ──────────────────────────
const HOME_FAQS = [
  {
    q: 'Are all calculators on Calculators Point completely free?',
    a: 'Yes. Every calculator on Calculators Point is 100% free with no signup, no subscription, and no hidden fees. All calculations run locally in your browser, so your data is never sent to our servers.',
  },
  {
    q: 'How accurate are your finance calculators?',
    a: 'Our finance calculators (EMI, mortgage, SIP, compound interest) use standard mathematical formulas — the same formulas used by banks and financial institutions. EMI is calculated using the standard reducing-balance method. Results are highly accurate for planning purposes, though actual loan terms may vary slightly by lender.',
  },
  {
    q: 'Do the health calculators (BMI, BMR, calorie) use clinically validated formulas?',
    a: 'Yes. BMI uses the WHO standard formula (weight ÷ height²). BMR uses the Mifflin-St Jeor equation (1990), which is the most clinically validated formula for estimating resting metabolic rate. Results are for informational purposes — always consult a healthcare professional for medical decisions.',
  },
  {
    q: 'Does the site work offline?',
    a: 'Calculators Point is a Progressive Web App (PWA). Once you visit the site, the core pages and popular calculators are cached by your browser\'s service worker, allowing them to work without an internet connection.',
  },
  {
    q: 'Can I use these calculators on my mobile phone?',
    a: 'Absolutely. Every calculator is fully responsive and optimized for mobile devices. Sliders, inputs, and result charts all adapt to small screens. You can also add the site to your home screen for quick access.',
  },
];

const homeFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: HOME_FAQS.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

/** Reusable card styles for the homepage content sections */
const CARD_BASE = {
  display: 'block',
  padding: '16px 18px',
  borderRadius: 12,
  textDecoration: 'none',
  border: '1px solid',
  transition: 'transform .15s, box-shadow .15s',
} as const;

/** Finance calculators section — server-rendered H2 with direct links */
function FinanceSection() {
  const items = [
    { href: '/calculator/loan-emi-calculator',      icon: '🏦', name: 'EMI Calculator',        desc: 'Monthly loan repayment with full amortization schedule' },
    { href: '/calculator/mortgage-calculator',       icon: '🏠', name: 'Mortgage Calculator',   desc: 'Home loan payments, total interest, and payoff timeline' },
    { href: '/calculator/sip-calculator',            icon: '📈', name: 'SIP Calculator',        desc: 'Systematic investment returns with step-up contributions' },
    { href: '/calculator/compound-interest-calculator', icon: '💰', name: 'Compound Interest', desc: 'Grow your savings with compounding over time' },
    { href: '/calculator/fd-calculator',             icon: '🏛️', name: 'FD Calculator',        desc: 'Fixed deposit maturity amount and interest earned' },
    { href: '/calculator/gst-calculator',            icon: '🧾', name: 'GST Calculator',        desc: 'Add or remove GST/VAT from any amount instantly' },
  ];
  return (
    <section style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px clamp(16px,4vw,24px)' }}>
        <h2 style={{ fontSize: 'clamp(1.25rem,3vw,1.75rem)', fontWeight: 800, color: 'var(--text)', marginBottom: 8, letterSpacing: '-.03em' }}>
          Finance Calculators
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 24, maxWidth: 640 }}>
          Plan loans, investments, taxes, and savings with precision. Our finance calculators use bank-standard reducing-balance and compound-interest formulas.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
          {items.map(c => (
            <Link key={c.href} href={c.href} style={{ ...CARD_BASE, background: '#eff6ff', borderColor: '#bfdbfe' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 22 }} aria-hidden="true">{c.icon}</span>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#1e40af' }}>{c.name}</span>
              </div>
              <p style={{ fontSize: 12, color: '#374151', margin: 0, lineHeight: 1.5 }}>{c.desc}</p>
            </Link>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <Link href="/category/finance" style={{ fontSize: 13, fontWeight: 700, color: '#2563eb' }}>
            View all finance calculators →
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Health calculators section */
function HealthSection() {
  const items = [
    { href: '/calculator/bmi-calculator',           icon: '⚖️', name: 'BMI Calculator',         desc: 'Body Mass Index using WHO standard formula' },
    { href: '/calculator/bmr-calculator',           icon: '🔥', name: 'BMR Calculator',         desc: 'Basal metabolic rate via Mifflin-St Jeor equation' },
    { href: '/calculator/calorie-calculator',       icon: '🥗', name: 'Calorie Calculator',     desc: 'Daily calorie needs based on your activity level' },
    { href: '/calculator/ideal-weight-calculator',  icon: '💪', name: 'Ideal Weight',           desc: 'Healthy weight range for your height and gender' },
    { href: '/calculator/body-fat-calculator',      icon: '📏', name: 'Body Fat Calculator',    desc: 'Estimate body fat percentage using skinfold method' },
    { href: '/calculator/pregnancy-calculator',     icon: '🤰', name: 'Pregnancy Calculator',   desc: 'Due date, trimester, and gestational age tracker' },
  ];
  return (
    <section style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px clamp(16px,4vw,24px)' }}>
        <h2 style={{ fontSize: 'clamp(1.25rem,3vw,1.75rem)', fontWeight: 800, color: 'var(--text)', marginBottom: 8, letterSpacing: '-.03em' }}>
          Health &amp; Fitness Calculators
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 24, maxWidth: 640 }}>
          Evidence-based health tools that use clinically validated formulas — WHO BMI standards, Mifflin-St Jeor BMR, and more. For informational use only.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
          {items.map(c => (
            <Link key={c.href} href={c.href} style={{ ...CARD_BASE, background: '#f0fdf4', borderColor: '#bbf7d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 22 }} aria-hidden="true">{c.icon}</span>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#166534' }}>{c.name}</span>
              </div>
              <p style={{ fontSize: 12, color: '#374151', margin: 0, lineHeight: 1.5 }}>{c.desc}</p>
            </Link>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <Link href="/category/health" style={{ fontSize: 13, fontWeight: 700, color: '#16a34a' }}>
            View all health calculators →
          </Link>
        </div>
      </div>
    </section>
  );
}

/** How It Works — methodology, accuracy, privacy */
function HowItWorksSection() {
  const pillars = [
    { icon: '🔢', title: 'Verified Formulas', body: 'Every calculator uses peer-reviewed or industry-standard formulas. Finance calculators follow RBI/bank reducing-balance standards. Health calculators use WHO and Mifflin-St Jeor methods.' },
    { icon: '🔒', title: 'Your Data Stays Local', body: 'All calculations run entirely in your browser using JavaScript. No input data is ever sent to our servers, stored in a database, or shared with third parties.' },
    { icon: '⚡', title: 'Instant Results', body: 'Results appear as you type — no page reloads, no waiting. Interactive charts update live, and step-by-step formulas explain every result.' },
    { icon: '📱', title: 'Works on Any Device', body: 'Every calculator is responsive and tested on mobile, tablet, and desktop. The site is also a PWA — add it to your home screen for offline access.' },
  ];
  return (
    <section style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px clamp(16px,4vw,24px)' }}>
        <h2 style={{ fontSize: 'clamp(1.25rem,3vw,1.75rem)', fontWeight: 800, color: 'var(--text)', marginBottom: 8, letterSpacing: '-.03em' }}>
          How Our Calculators Work
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 24, maxWidth: 640 }}>
          Built for accuracy, transparency, and privacy. Here&apos;s what makes Calculators Point different from generic tool sites.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }}>
          {pillars.map(p => (
            <div key={p.title} style={{ padding: '20px 18px', background: 'var(--bg)', borderRadius: 12, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }} aria-hidden="true">{p.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>{p.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text2)', margin: 0, lineHeight: 1.6 }}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** FAQ section — server-rendered, fully accessible, with FAQPage schema */
function HomeFAQSection() {
  return (
    <section style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px clamp(16px,4vw,24px)' }}>
        <h2 style={{ fontSize: 'clamp(1.25rem,3vw,1.75rem)', fontWeight: 800, color: 'var(--text)', marginBottom: 24, letterSpacing: '-.03em' }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {HOME_FAQS.map((f, i) => (
            <details
              key={i}
              style={{ borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', overflow: 'hidden' }}
            >
              <summary
                style={{ padding: '14px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 14, color: 'var(--text)', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}
              >
                {f.q}
                <span aria-hidden="true" style={{ fontSize: 18, color: 'var(--brand)', flexShrink: 0 }}>+</span>
              </summary>
              <div style={{ padding: '0 18px 16px', fontSize: 14, color: 'var(--text2)', lineHeight: 1.7 }}>
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
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
      <JsonLd data={[siteSchema, popularItemListSchema, homeFaqSchema]} idPrefix="home" />

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

      {/* ── SERVER-RENDERED TOPICAL DEPTH SECTIONS ──
          These sections are pure static HTML — zero JS, fully crawlable.
          They add H2 headings, topical keyword coverage, and E-E-A-T signals
          that the dynamic HomePageClient content cannot provide to crawlers. */}
      <FinanceSection />
      <HealthSection />
      <HowItWorksSection />
      <HomeFAQSection />
    </>
  );
}

