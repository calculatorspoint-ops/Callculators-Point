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

  // SEO title format per guide: "[Name] - Free Online Calculator | Calculators Point"
  // Root layout template appends " | CalculatorsPoint" automatically
  const title = `${calc.name} - Free Online Calculator`;

  // Action-driven description, ~140-160 chars
  // Pattern: "Use our free [Name] to [action]. Formula, examples & step-by-step results. 100% free."
  const calcNameLower = calc.name.toLowerCase().replace(/ calculator$/i, '');
  const action = `${calc.desc.charAt(0).toLowerCase()}${calc.desc.slice(1)}`;
  const descBase = `Use our free ${calc.name} to ${action}`;
  const descTrimmed = descBase.length > 110
    ? descBase.slice(0, 107).replace(/[,.]?\s+\S+$/, '') + '…'
    : descBase;
  const description = `${descTrimmed} Formula, examples and step-by-step results. 100% free.`;

  const keywords = [
    `${calc.name} calculator`,
    `free ${calcNameLower} calculator`,
    `online ${calcNameLower} calculator`,
    `how to calculate ${calcNameLower}`,
    `${calcNameLower} formula`,
    catName,
    calc.name,
    'free calculator',
    'CalculatorsPoint',
    ...(calc.keywords ?? []),
    ...(calc.tags ?? []),
  ];

  const fullTitle = `${calc.name} - Free Online Calculator | Calculators Point`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://calculatorspoint.com/calculator/${slug}`,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: `https://calculatorspoint.com/calculator/${slug}`,
      type: 'website',
      siteName: 'Calculators Point',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
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
