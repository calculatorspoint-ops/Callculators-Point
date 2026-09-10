/**
 * app/pt-br/calculator/[slug]/page.tsx
 *
 * Brazilian Portuguese calculator pages.
 * URL pattern: /pt-br/calculator/[slug]
 *
 * - Reads English config + merges pt-BR overrides
 * - Falls back to English if no pt-BR translation exists yet
 * - Generates proper hreflang tags (pt-BR ↔ en + x-default)
 * - Renders the same CalculatorPageClient (logic is locale-agnostic)
 * - SEO content section uses pt-BR strings
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCalcBySlug, ALL_CALCULATORS, CATEGORIES, INDEXABLE_CALCULATORS } from '@/data/calculatorConfigs';
import { CalculatorPageClient } from '@/components/calculator-core/CalculatorPageClient';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { SEOContentSectionPtBr } from '@/components/calculator-core/SEOContentSectionPtBr';
import { CALC_FAQS_PT_BR, BASE_FAQS_PT_BR } from '@/data/pt-br/faqs';
import { SITE_URL } from '@/config/site';
import { UI_PT_BR } from '@/data/pt-br/ui';

const PT_BR_BASE = `${SITE_URL}/pt-br`;

/** Pre-render all calculator slugs at build time */
export function generateStaticParams() {
  return ALL_CALCULATORS.map((calc) => ({ slug: calc.slug }));
}

/** Rich pt-BR per-calculator metadata */
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const calc = getCalcBySlug(slug);
  if (!calc) return { title: 'Calculadora não encontrada' };

  // Try to load pt-BR override
  let ptBrName = calc.name;
  let ptBrDesc = calc.metaDescription ?? calc.desc;
  let ptBrTitle = calc.metaTitle ?? calc.name;

  try {
    // Dynamic import of the registry — only loads translations needed for this slug
    const { getPtBrCalcAsync } = await import('@/data/pt-br/index');
    const override = await getPtBrCalcAsync(slug);
    if (override) {
      ptBrName = override.name;
      ptBrDesc = override.metaDescription ?? override.desc;
      ptBrTitle = override.metaTitle ?? override.name;
    }
  } catch {
    // Fall back to English if pt-BR translation not available
  }

  const cat = CATEGORIES.find(c => c.id === calc.cat);
  const catNamePtBr = cat ? UI_PT_BR.categories[cat.id as keyof typeof UI_PT_BR.categories] ?? cat.name : '';

  const fullTitle = `${ptBrTitle} | Calculators Point`;
  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(ptBrTitle)}&icon=${encodeURIComponent(calc.icon || '🧮')}&cat=${encodeURIComponent(catNamePtBr)}`;

  return {
    title: ptBrTitle,
    description: ptBrDesc,
    alternates: {
      canonical: `${PT_BR_BASE}/calculator/${slug}`,
      languages: {
        'en': `${SITE_URL}/calculator/${slug}`,
        'pt-BR': `${PT_BR_BASE}/calculator/${slug}`,
        'x-default': `${SITE_URL}/calculator/${slug}`,
      },
    },
    openGraph: {
      title: fullTitle,
      description: ptBrDesc,
      url: `${PT_BR_BASE}/calculator/${slug}`,
      locale: 'pt_BR',
      type: 'website',
      siteName: 'Calculators Point',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: ptBrTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: ptBrDesc,
      images: [ogImageUrl],
    },
  };
}

/** Page header in Portuguese */
async function CalcPageHeaderPtBr({
  calc,
  cat,
  ptBrName,
}: {
  calc: NonNullable<ReturnType<typeof getCalcBySlug>>;
  cat: { id: string; name: string; icon: string } | undefined;
  ptBrName: string;
}) {
  const catNamePtBr = cat ? UI_PT_BR.categories[cat.id as keyof typeof UI_PT_BR.categories] ?? cat.name : '';
  const pageH1 = /calculadora/i.test(ptBrName) || /calculador/i.test(ptBrName) || /conversor/i.test(ptBrName) || /simulador/i.test(ptBrName)
    ? `${ptBrName} Online Grátis`
    : `${ptBrName} — Calculadora Online Grátis`;

  return (
    <div className="calc-page-head">
      <div className="cph-inner">
        <nav className="cph-breadcrumb" aria-label="Breadcrumb"
          itemScope itemType="https://schema.org/BreadcrumbList">
          <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/pt-br" itemProp="item"><span itemProp="name">Início</span></Link>
            <meta itemProp="position" content="1" />
          </span>
          <span className="cph-breadcrumb-sep" aria-hidden="true">›</span>
          {cat && (
            <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href={`/pt-br/category/${cat.id}`} itemProp="item">
                <span itemProp="name">{cat.icon} {catNamePtBr}</span>
              </Link>
              <meta itemProp="position" content="2" />
            </span>
          )}
          <span className="cph-breadcrumb-sep" aria-hidden="true">›</span>
          <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name" style={{ color: 'rgba(255,255,255,.72)' }} aria-current="page">
              {ptBrName}
            </span>
            <meta itemProp="position" content={cat ? '3' : '2'} />
          </span>
        </nav>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
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
                {calc.popular && <span className="badge badge-amber">{UI_PT_BR.badges.popular}</span>}
                {calc.isNew && <span className="badge badge-green">{UI_PT_BR.badges.new}</span>}
                {calc.hasChart && <span className="badge badge-blue">{UI_PT_BR.badges.chart}</span>}
              </div>
            </div>
          </div>
          {/* Action buttons placeholder — hydrated by CalculatorPageClient */}
          <div aria-hidden="true" style={{ display: 'flex', gap: 8, flexShrink: 0, minWidth: 80, minHeight: 36 }} />
        </div>
      </div>
    </div>
  );
}

/** Page component */
export default async function PtBrCalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const calc = getCalcBySlug(slug);
  if (!calc) notFound();

  const cat = CATEGORIES.find(c => c.id === calc.cat);

  // Load pt-BR override (graceful fallback to English)
  let ptBrName = calc.name;
  let ptBrCalc = calc;

  try {
    const { getPtBrCalcAsync, mergePtBrCalc } = await import('@/data/pt-br/index');
    const override = await getPtBrCalcAsync(slug);
    if (override) {
      ptBrName = override.name;
      ptBrCalc = mergePtBrCalc(calc, override);
    }
  } catch {
    // Silently fall back to English
  }

  const faqs = [
    ...((CALC_FAQS_PT_BR)[slug] ?? []),
    ...BASE_FAQS_PT_BR,
  ];

  return (
    <article id="calculator-content" aria-label={`${ptBrName} — calculadora online grátis`}>
      {/* Schema markup (English data is fine for structured data) */}
      <SchemaMarkup calc={calc} cat={cat} faqs={faqs} />

      {/* Portuguese page header */}
      <CalcPageHeaderPtBr calc={calc} cat={cat} ptBrName={ptBrName} />

      {/* Calculator form — same client component, locale-agnostic logic */}
      <CalculatorPageClient slug={slug} headerAlreadyRendered />

      {/* Portuguese SEO content section */}
      <div className="seo-content-wrapper">
        <SEOContentSectionPtBr calc={ptBrCalc} />
      </div>
    </article>
  );
}
