/**
 * app/calculator/[slug]/calculator-client.tsx
 *
 * Client component that renders the existing Calculator.tsx page logic.
 * We keep the calculator engine client-side (as designed by the migration plan).
 */
'use client';

import { Suspense, lazy, useEffect, useState } from 'react';
import { incrementCalcViews } from '@/lib/firebase/firestore';
import { useAppStore } from '@/store/useAppStore';
import { getCalcBySlug, getRelated, getRelatedCalcs, CATEGORIES, ALL_CALCULATORS } from '@/data/calculatorConfigs';
import { BASE_FAQS, CALC_FAQS } from '@/data/faqData';
import { getLandingsByCalc } from '@/data/seoLandingData';
import { Share2, Bookmark, BookmarkCheck } from 'lucide-react';
import Link from 'next/link';
import { CrossCalcRecommendations } from '@/components/calculator-core/CrossRecommendations';
import { FAQSection } from '@/components/calculator-core/FAQSection';
import { FeedbackWidget } from '@/components/calculator-core/FeedbackWidget';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

const CalculatorWidget = lazy(() =>
  import('@/components/calculator-core/CalculatorWidget').then(m => ({ default: m.CalculatorWidget }))
);
const CurrencyBanner = lazy(() => import('@/components/ui/CurrencyBanner'));
const ExportToolbar = lazy(() =>
  import('@/core/export-engine/ExportToolbar').then(m => ({ default: m.ExportToolbar }))
);

function FormFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Calculator loading"
      style={{ minHeight: 360, padding: '22px' }}
    >
      {/* Screen-reader announcement */}
      <span className="sr-only">Loading calculator, please wait…</span>

      {/* Skeleton header row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <div className="skeleton" style={{ width: 80, height: 32, borderRadius: 8 }} />
        <div className="skeleton" style={{ width: 120, height: 32, borderRadius: 8 }} />
        <div className="skeleton" style={{ width: 100, height: 32, borderRadius: 8, marginLeft: 'auto' }} />
      </div>

      {/* Skeleton input rows × 3 */}
      {[1, 2, 3].map(i => (
        <div key={i} style={{ marginBottom: 20 }}>
          <div className="skeleton" style={{ width: `${55 + i * 8}%`, height: 14, borderRadius: 4, marginBottom: 8 }} />
          <div className="skeleton" style={{ width: '100%', height: 50, borderRadius: 12 }} />
        </div>
      ))}

      {/* Skeleton calculate button */}
      <div className="skeleton" style={{ width: '100%', height: 48, borderRadius: 12, marginTop: 8 }} />

      {/* Skeleton result area */}
      <div style={{ marginTop: 24, background: 'var(--surf2)', borderRadius: 16, padding: 20 }}>
        <div className="skeleton" style={{ width: 110, height: 14, borderRadius: 4, margin: '0 auto 14px' }} />
        <div className="skeleton" style={{ width: 180, height: 48, borderRadius: 8, margin: '0 auto' }} />
      </div>

      <style>{`
        .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
        @keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}
      `}</style>
    </div>
  );
}

export function CalculatorPageClient({ slug }: { slug: string }) {
  const calc = getCalcBySlug(slug);
  const { toggleFavorite, favorites, addRecent } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (calc?.id) addRecent(calc.id);
    // Track calculator page view in Firestore (silently, never blocks UI)
    if (calc?.slug) incrementCalcViews(calc.slug);
  }, [calc?.id, calc?.slug, addRecent]);

  if (!calc) return null;

  // Use false on server/pre-mount so SSR and client initial render match
  const isFav = mounted && favorites.includes(calc.id);
  const related = getRelated(calc, 7);
  const cat     = CATEGORIES.find(c => c.id === calc.cat);
  const faqs    = [...((CALC_FAQS as Record<string, { q: string; a: string }[]>)[slug] ?? []), ...BASE_FAQS];
  const popular = ALL_CALCULATORS.filter(c => c.cat === calc.cat && c.id !== calc.id && c.popular).slice(0, 6);
  // Issue 7: get /tools/ deep-dive landing pages linked to this calculator
  const toolGuides = getLandingsByCalc(calc.slug);

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: calc.name, text: `Free ${calc.name} — ${calc.desc}`, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  };

  const calculatorName = calc.name.trim();
  // W5 fix: append 'Online' to H1 — searchers phrase queries as "EMI Calculator Online",
  // "BMI Calculator Online" etc. This directly aligns our H1 with primary search intent.
  const pageH1 = /calculator/i.test(calculatorName)
    ? `Free ${calculatorName} Online`
    : `Free ${calculatorName} Calculator Online`;

  return (
    <>
      {/* ── Page Header ── */}
      <div className="calc-page-head">
        <div className="cph-inner">
          <nav className="cph-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="cph-breadcrumb-sep">›</span>
            {cat && <Link href={`/category/${cat.id}`}>{cat.icon} {cat.name}</Link>}
            <span className="cph-breadcrumb-sep">›</span>
            <span style={{ color: 'rgba(255,255,255,.72)' }}>{calc.name}</span>
          </nav>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            {/* Left side: Icon + Texts */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: '1 1 300px', minWidth: 0 }}>
              <div style={{ fontSize: 34, lineHeight: 1, flexShrink: 0 }}>{calc.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h1 className="cph-title">{pageH1}</h1>
                {calc.desc && (
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,.55)', lineHeight: 1.6, marginBottom: 12 }}>
                    {calc.desc}
                  </p>
                )}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {calc.popular && <span className="badge badge-amber">🔥 Popular</span>}
                  {calc.isNew && <span className="badge badge-green">✨ New</span>}
                  {calc.hasChart && <span className="badge badge-blue">📊 Chart</span>}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button
                onClick={() => toggleFavorite(calc.id)}
                className="nav-icon-btn"
                aria-label={isFav ? 'Remove from favorites' : 'Save to favorites'}
                style={{ background: 'rgba(255,255,255,.08)', borderColor: 'rgba(255,255,255,.15)', color: '#fff' }}
              >
                {isFav ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              </button>
              <button
                onClick={share}
                className="nav-icon-btn"
                aria-label="Share calculator"
                style={{ background: 'rgba(255,255,255,.08)', borderColor: 'rgba(255,255,255,.15)', color: '#fff' }}
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="calc-layout">
        {/* Left column: calculator */}
        <div style={{ minWidth: 0 }}>
          {/* Currency banner for finance calculators */}
          {calc.cat === 'finance' && (
            <Suspense fallback={null}>
              <CurrencyBanner />
            </Suspense>
          )}

          {/* Intro paragraph — unique 2–3 sentence context shown above the calculator */}
          {calc.intro && (
            <p className="calc-intro-para">{calc.intro}</p>
          )}

          {/* Calculator form — min-height reserves space to prevent CLS while skeleton is shown */}
          <div className="calc-card" style={{ marginBottom: 16, minHeight: 360 }}>
            <ErrorBoundary>
              <Suspense fallback={<FormFallback />}>
                <CalculatorWidget calc={calc} />
              </Suspense>
            </ErrorBoundary>
          </div>

          {/* Export toolbar */}
          <Suspense fallback={null}>
            <ExportToolbar filenamePrefix={calc.name} />
          </Suspense>

          {/* Feedback */}
          <FeedbackWidget calcName={calc.name} calcSlug={calc.slug} />

          {/* FAQ */}
          {faqs.length > 0 && <FAQSection faqs={faqs} />}
        </div>

        {/* Right sidebar */}
        <aside style={{ minWidth: 0 }}>
          {/* Cross-recommendations */}
          <CrossCalcRecommendations slug={slug} />

          {/* Popular in category */}
          {popular.length > 0 && (
            <div className="side-card" style={{ marginTop: 16 }}>
              <div className="sec-head" style={{ background: 'var(--surf2)' }}>
                <span>🔥</span>
                <span>Popular in {cat?.name}</span>
              </div>
              {popular.map(c => (
                <Link
                  key={c.id}
                  href={`/calculator/${c.slug}`}
                  className="calc-row"
                >
                  <span className="calc-row-icon">{c.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.name}
                  </span>
                  <span className="calc-row-arrow">›</span>
                </Link>
              ))}
            </div>
          )}

          {/* Issue 7: Deep Dive Guides — contextual internal links to /tools/ landing pages.
              These pass PageRank from the high-traffic calculator page to the long-tail /tools/ pages. */}
          {toolGuides.length > 0 && (
            <div className="side-card" style={{ marginTop: 16 }}>
              <div className="sec-head" style={{ background: 'var(--surf2)' }}>
                <span>📖</span>
                <span>In-Depth Guides</span>
              </div>
              {toolGuides.map(guide => (
                <Link
                  key={guide.slug}
                  href={`/tools/${guide.slug}`}
                  className="calc-row"
                >
                  <span className="calc-row-icon">📌</span>
                  <span style={{ fontSize: 13, fontWeight: 600, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {guide.h1}
                  </span>
                  <span className="calc-row-arrow">›</span>
                </Link>
              ))}
            </div>
          )}

          {/* Related calculators — uses cross-category links if calc.relatedCalculators is set */}
          {(() => {
            const sidebarRelated = getRelatedCalcs(calc, 7);
            return sidebarRelated.length > 0 ? (
              <div className="side-card" style={{ marginTop: 16 }}>
                <div className="sec-head" style={{ background: 'var(--surf2)' }}>
                  <span>🔗</span>
                  <span>Related Tools</span>
                </div>
                {sidebarRelated.map(c => (
                  <Link
                    key={c.id}
                    href={`/calculator/${c.slug}`}
                    className="calc-row"
                  >
                    <span className="calc-row-icon">{c.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.name}
                    </span>
                    <span className="calc-row-arrow">›</span>
                  </Link>
                ))}
              </div>
            ) : null;
          })()}
        </aside>
      </div>
    </>
  );
}
