/**
 * app/calculator/[slug]/page.tsx
 *
 * SSG calculator page — prerendered at build time for all 214 calculators.
 * Includes: rich metadata, JSON-LD schema, SEO content section.
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
  const title = `${calc.name} | Free ${catName} Calculator`;
  const description = `${calc.desc} — Free online ${calc.name.toLowerCase()} with step-by-step results. No signup required. Works on all devices.`;
  const keywords = [
    calc.name,
    `${calc.name} calculator`,
    `free ${calc.name.toLowerCase()}`,
    `online ${calc.name.toLowerCase()}`,
    `how to calculate ${calc.name.toLowerCase().replace(/ calculator$/, '')}`,
    `${calc.name} formula`,
    catName,
    'free calculator',
    'CalculatorsPoint',
    ...(calc.keywords ?? []),
    ...(calc.tags ?? []),
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://calculatorspoint.com/calculator/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://calculatorspoint.com/calculator/${slug}`,
      type: 'website',
      siteName: 'CalculatorsPoint',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    other: {
      'application-name': 'CalculatorsPoint',
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
