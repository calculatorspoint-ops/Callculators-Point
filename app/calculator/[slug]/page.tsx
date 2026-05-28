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
import { getCalcBySlug, ALL_CALCULATORS, CATEGORIES } from '@/data/calculatorConfigs';
import { CalculatorPageClient } from './calculator-client';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { SEOContentSection } from '@/components/calculator-core/SEOContentSection';
import { CALC_FAQS, BASE_FAQS } from '@/data/faqData';
import { SITE_URL } from '@/config/site';

/** SSG: pre-render all calculator slugs at build time */
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

  const title = `Free ${titleName} Online`;

  const calcNameLower = cleanName.toLowerCase().replace(/ calculator$/i, '');

  // Per-slug meta description overrides — for cases where the template produces awkward grammar.
  // Issue 6 fix: EMI calculator had self-referential auto-description.
  const DESC_OVERRIDES: Record<string, string> = {
    'loan-emi-calculator': 'Calculate your monthly loan EMI instantly. See full amortization schedule, prepayment savings, and rate comparison for home, car, and personal loans. 100% free.',
    'bmi-calculator': 'Calculate your BMI instantly with WHO health risk classification, ideal weight range, and personalized insights. Free online Body Mass Index calculator.',
    'sip-calculator': 'Calculate SIP returns with step-up, XIRR, and wealth projections. See how monthly investments grow over 5, 10, 20, or 30 years. Free mutual fund SIP calculator.',
  };

  // Safer description generation to avoid awkward grammar from string concatenation
  const descTrimmed = calc.desc.length > 80
    ? calc.desc.slice(0, 77).replace(/[,.]?\s+\S+$/, '') + '…'
    : calc.desc;
  const descTemplates = [
    `Free ${cleanName}: ${descTrimmed} Get step-by-step results and formulas instantly. 100% free and accurate.`,
    `Calculate ${cleanName} online for free. ${descTrimmed} Instant, accurate results and step-by-step formulas.`,
    `Use our free ${cleanName}. ${descTrimmed} Explore formulas and get instant, accurate results every time.`,
    `Need a ${cleanName}? ${descTrimmed} 100% free online calculator with step-by-step guides.`,
    `Estimate your ${cleanName} quickly and accurately. ${descTrimmed} Free online tool with complete formulas.`
  ];
  const templateIndex = slug.length % descTemplates.length;
  const description = DESC_OVERRIDES[slug] ?? descTemplates[templateIndex];


  const fullTitle = `${title} | Calculators Point`;

  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&icon=${encodeURIComponent(calc.icon || '🧮')}&cat=${encodeURIComponent(catName)}`;

  return {
    title,
    description,

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

      {/* Calculator form — client component */}
      <CalculatorPageClient slug={slug} />

      {/* SEO content — server-rendered at build time, fully indexed by Google */}
      <div className="seo-content-wrapper">
        <SEOContentSection calc={calc} />
      </div>
    </>
  );
}
