/**
 * app/calculator/[slug]/page.tsx
 *
 * SSG calculator page — prerendered at build time for all 180+ calculators.
 * Includes: rich metadata, JSON-LD schema, SEO content section.
 *
 * SEO title format: "[Calculator Name] - Free Online Calculator | Calculators Point"
 * Meta description: action-driven, 140-160 chars, mentions formula + examples
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCalcBySlug, ALL_CALCULATORS, CATEGORIES, INDEXABLE_CALCULATORS } from '@/data/calculatorConfigs';
import { CalculatorPageClient } from './calculator-client';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { SEOContentSection } from '@/components/calculator-core/SEOContentSection';
import { CALC_FAQS, BASE_FAQS } from '@/data/faqData';
import { SITE_URL } from '@/config/site';

/** SSG: pre-render all calculator slugs at build time.
 * Includes needsContent calcs too (page still renders) — just noindexed. */
export function generateStaticParams() {
  return ALL_CALCULATORS.map((calc) => ({ slug: calc.slug }));
}

/** Rich per-calculator metadata */
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const calc = getCalcBySlug(slug);
  if (!calc) return { title: 'Calculator Not Found' };

  const cat = CATEGORIES.find(c => c.id === calc.cat);
  const catName = cat?.name ?? 'Online';

  const cleanName = calc.name.trim();
  const titleName = /calculator/i.test(cleanName)
    ? cleanName
    : `${cleanName} Calculator`;

  const calcNameLower = cleanName.toLowerCase().replace(/ calculator$/i, '');

  // Per-slug meta description overrides — for cases where the template produces awkward grammar.
  // Issue 6 fix: EMI calculator had self-referential auto-description.
  const DESC_OVERRIDES: Record<string, string> = {
    'loan-emi-calculator': 'Calculate your monthly loan EMI instantly. Get full amortization schedule, prepayment savings, and compare rates for home, car, and personal loans. Free.',
    'mortgage-calculator': 'Calculate your monthly mortgage payment, total interest, and amortization schedule. Compare fixed vs floating rates. Free online home loan calculator.',
    'bmi-calculator': 'Calculate your BMI instantly with WHO health risk classification, ideal weight range, and personalized insights. Free online Body Mass Index calculator.',
    'sip-calculator': 'Calculate SIP returns with step-up, XIRR, and wealth projections. See how monthly investments grow over 5, 10, 20, or 30 years. Free mutual fund SIP calculator.',
  };

  // Safer description generation to avoid awkward grammar from string concatenation
  const descTrimmed = calc.desc.length > 80
    ? calc.desc.slice(0, 77).replace(/[,.]?\s+\S+$/, '') + '…'
    : calc.desc;
    
  const descTemplates = [
    `Free ${cleanName}: ${descTrimmed} Get step-by-step results and formulas instantly. 100% free and accurate.`,
    `Calculate ${calcNameLower} online for free. ${descTrimmed} Instant, accurate results and step-by-step formulas.`,
    `Use our free ${cleanName}. ${descTrimmed} Explore formulas and get instant, accurate results every time.`,
    `Need a ${cleanName}? ${descTrimmed} 100% free online calculator with step-by-step guides.`,
    `Quickly calculate ${calcNameLower} online. ${descTrimmed} Free tool with complete formulas and accurate results.`
  ];
  const templateIndex = slug.length % descTemplates.length;

  // Use calc.metaTitle override if present (full custom page title)
  const title = calc.metaTitle ?? `Free ${titleName} Online`;

  // Use calc.metaDescription override if present
  const description = calc.metaDescription ?? (DESC_OVERRIDES[slug] ?? descTemplates[templateIndex]);

  const fullTitle = `${title} | Calculators Point`;

  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&icon=${encodeURIComponent(calc.icon || '🧭')}&cat=${encodeURIComponent(catName)}`;

  return {
    title,
    description,

    // noindex for incomplete/draft calculator pages
    ...(calc.needsContent ? {
      robots: { index: false, follow: false },
    } : {}),

    alternates: {
      canonical: `${SITE_URL}/calculator/${slug}`,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: `${SITE_URL}/calculator/${slug}`,
      type: 'website',
      siteName: 'Calculators Point',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImageUrl],
    },
    other: {
      'application-name': 'Calculators Point',
      'category': catName,
    },
  };
}

/**
 * CalcPageHeader — server-rendered above-the-fold shell.
 *
 * WHY SERVER-RENDERED:
 *   The breadcrumb, H1, description, and badges are pure static data
 *   derived from the calculator config. Rendering them in a Server
 *   Component means they appear in the initial HTML byte — no JS or
 *   hydration needed. This:
 *     1. Eliminates the blank-header flash on slow JS execution
 *     2. Removes CLS from the header area popping in after hydration
 *     3. Makes H1 available to crawlers before any client JS runs
 *
 *   The interactive buttons (favorite, share) live in CalculatorPageClient
 *   and hydrate separately without blocking above-the-fold paint.
 */
function CalcPageHeader({ calc, cat }: {
  calc: NonNullable<ReturnType<typeof getCalcBySlug>>;
  cat: { id: string; name: string; icon: string } | undefined;
}) {
  const calculatorName = calc.name.trim();
  const pageH1 = /calculator/i.test(calculatorName)
    ? `Free ${calculatorName} Online`
    : `Free ${calculatorName} Calculator Online`;

  return (
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
          {/* Left side: Icon + Texts — static, server-rendered */}
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
                {calc.isNew   && <span className="badge badge-green">✨ New</span>}
                {calc.hasChart && <span className="badge badge-blue">📊 Chart</span>}
              </div>
            </div>
          </div>

          {/*
            Action buttons (favorite toggle, share) are client-only.
            We reserve their space here with a min-width placeholder so
            the layout doesn't shift when they hydrate.
            CalculatorPageClient renders the real buttons into this area.
          */}
          <div
            aria-hidden="true"
            style={{ display: 'flex', gap: 8, flexShrink: 0, minWidth: 80, minHeight: 36 }}
          />
        </div>
      </div>
    </div>
  );
}

/** Page component */
export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const calc = getCalcBySlug(slug);
  if (!calc) notFound();

  const cat = CATEGORIES.find(c => c.id === calc.cat);
  const faqs = [
    ...((CALC_FAQS as Record<string, { q: string; a: string }[]>)[slug] ?? []),
    ...BASE_FAQS,
  ];

  return (
    <>
      {/* JSON-LD Schema — server-rendered, zero JS cost */}
      <SchemaMarkup calc={calc} cat={cat} faqs={faqs} />

      {/*
        Static above-the-fold shell — server HTML, paints with first byte.
        Breadcrumb, H1, description, and badges are visible before any JS.
      */}
      <CalcPageHeader calc={calc} cat={cat} />

      {/* Calculator form — client component (hydrates lazily) */}
      <CalculatorPageClient slug={slug} headerAlreadyRendered />

      {/* SEO content — server-rendered at build time, fully indexed by Google */}
      <div className="seo-content-wrapper">
        <SEOContentSection calc={calc} />
      </div>
    </>
  );
}
