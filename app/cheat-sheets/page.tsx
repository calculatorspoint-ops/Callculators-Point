/**
 * app/cheat-sheets/page.tsx
 *
 * STATUS: DRAFT — all three cheat sheets are Coming Soon.
 *
 * SEO rules applied:
 *  - noindex + nofollow: prevents Google from indexing this page while drafts are active.
 *  - Page is excluded from sitemap.xml (see app/sitemap.ts — cheatSheetPages commented out).
 *  - Page is removed from Footer and Sitemap.jsx CORE_LINKS.
 *  - Route is kept for future development — re-enable indexing once real content is published.
 *
 * TO PUBLISH: Change `robots` to { index: true, follow: true } and re-add to sitemap.ts.
 */
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cheat Sheets (Coming Soon) — Calculators Point',
  description: 'Free printable cheat sheets for finance formulas, student grading, and health metrics. Coming soon from Calculators Point.',
  // ── noindex: this page has no published content yet ──────────────────────────
  // Must NOT appear in sitemap.xml while noindexed (per Google guidelines).
  // Remove this block and re-add to sitemap.ts when content is ready.
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  alternates: {
    // Self-canonical still set — good practice even for noindexed pages
    canonical: 'https://calculatorspoint.com/cheat-sheets',
  },
};

const SHEETS = [
  {
    emoji: '💰',
    title: 'Finance Formula Master Sheet',
    desc: 'The exact mathematical formulas banks use to calculate your EMI, Compound Interest, SIP returns, and loan amortization.',
    bullets: [
      'EMI Formula (Equated Monthly Installment)',
      'Compound Interest (Daily / Monthly / Annual)',
      'SIP Future Value & Step-Up SIP',
      'Real vs Nominal ROI',
    ],
    status: 'draft' as const,
    relatedHref: '/category/finance',
    relatedLabel: 'Finance Calculators',
  },
  {
    emoji: '🎓',
    title: 'Student Grading Pack',
    desc: 'A complete reference for GPA calculation, grading scales, aggregate formulas (MDCAT/ECAT), and percentage conversions.',
    bullets: [
      '4.0 GPA Weighted Scale',
      'Pakistani University CGPA Matrix',
      'MDCAT & ECAT Aggregate Formula',
      'Percentage to Grade conversions',
    ],
    status: 'draft' as const,
    relatedHref: '/category/education',
    relatedLabel: 'Education Calculators',
  },
  {
    emoji: '💪',
    title: 'Health & Fitness Metrics',
    desc: 'The clinical formulas used to determine BMR, TDEE, Body Fat Percentage, and daily macro targets.',
    bullets: [
      'Mifflin-St Jeor BMR Formula',
      'US Navy Body Fat Method',
      'Macronutrient Ratios',
      'Target Heart Rate (Karvonen)',
    ],
    status: 'draft' as const,
    relatedHref: '/category/health',
    relatedLabel: 'Health Calculators',
  },
];

export default function CheatSheetsPage() {
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', paddingTop: 40, paddingBottom: 80, paddingLeft: 16, paddingRight: 16 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 14 }}>📋</div>
        <h1 style={{ fontSize: 34, fontWeight: 800, marginBottom: 12, color: 'var(--text)' }}>
          Cheat Sheets & Formula Guides
        </h1>
        <p style={{ fontSize: 16, color: 'var(--text3)', maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>
          Free, beautifully formatted formula reference guides. Bookmark these pages or print them as PDFs.
        </p>
        {/* Honest status banner */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          marginTop: 18, padding: '8px 16px',
          background: 'var(--amber-l, #fffbeb)',
          border: '1px solid #fde68a',
          borderRadius: 'var(--r-lg, 12px)',
          fontSize: 13, color: 'var(--amber, #b45309)', fontWeight: 600,
        }}>
          <span>🚧</span>
          <span>All cheat sheets are currently in development. Check back soon!</span>
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 24 }}>
        {SHEETS.map((sheet) => (
          <div key={sheet.title} style={{
            background: 'var(--surface)',
            borderRadius: 'var(--r-xl, 16px)',
            padding: 24,
            border: '1px solid var(--border)',
            boxShadow: 'var(--sh1)',
            display: 'flex',
            flexDirection: 'column',
            opacity: 0.85,
          }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>{sheet.emoji}</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10, color: 'var(--text)' }}>
              {sheet.title}
            </h2>
            <p style={{ color: 'var(--text3)', fontSize: 13, marginBottom: 16, lineHeight: 1.65, flexGrow: 1 }}>
              {sheet.desc}
            </p>
            <ul style={{ paddingLeft: 18, marginBottom: 20, color: 'var(--text2)', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {sheet.bullets.map((b) => <li key={b}>{b}</li>)}
            </ul>

            {/* Coming soon — disabled button, not a link */}
            <button
              disabled
              aria-disabled="true"
              style={{
                width: '100%', padding: '11px',
                background: 'var(--surf2, #f1f5f9)',
                color: 'var(--text3)',
                borderRadius: 'var(--r-md, 8px)',
                fontWeight: 600, fontSize: 14,
                border: '1px dashed var(--border)',
                cursor: 'not-allowed',
                marginBottom: 10,
              }}
            >
              🚧 Coming Soon
            </button>

            {/* Point users to working calculators in the meantime */}
            <Link
              href={sheet.relatedHref}
              style={{
                display: 'block', textAlign: 'center',
                fontSize: 13, color: 'var(--brand)',
                textDecoration: 'none', fontWeight: 600,
                padding: '8px',
                borderRadius: 'var(--r-md, 8px)',
                border: '1px solid var(--brand-ll, #dbeafe)',
                background: 'var(--brand-l, #eff6ff)',
                transition: 'background .15s',
              }}
            >
              Use {sheet.relatedLabel} →
            </Link>
          </div>
        ))}
      </div>

      {/* CTA — redirect useful traffic to working calculators */}
      <div style={{
        marginTop: 52, padding: '28px 24px',
        background: 'linear-gradient(135deg, var(--brand-l, #eff6ff), var(--brand-ll, #dbeafe))',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-xl, 16px)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 28, marginBottom: 10 }}>🧮</div>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--brand)', marginBottom: 8 }}>
          Need answers right now?
        </h3>
        <p style={{ color: 'var(--text2)', fontSize: 14, maxWidth: 480, margin: '0 auto 16px' }}>
          While the cheat sheets are being prepared, all the formulas behind them are already powering our free calculators. Use them instantly.
        </p>
        <Link href="/calculators" style={{
          display: 'inline-block',
          padding: '10px 24px',
          background: 'var(--brand)',
          color: '#fff',
          borderRadius: 'var(--r-lg, 12px)',
          fontWeight: 700, fontSize: 14,
          textDecoration: 'none',
        }}>
          Browse All Calculators →
        </Link>
      </div>
    </div>
  );
}
