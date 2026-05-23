/**
 * app/calculator/[slug]/page.tsx
 *
 * Phase 2: Calculator pages — SSG (Static Site Generation)
 *
 * - generateStaticParams: pre-renders all 180 calculator pages at build time
 * - generateMetadata: unique <title> and <meta> per calculator (Phase 4)
 * - The actual UI is a client component (CalculatorPageClient) because
 *   calculator forms use hooks, lazy loading, and browser APIs
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCalcBySlug, ALL_CALCULATORS } from '@/data/calculatorConfigs';
import { CalculatorPageClient } from './calculator-client';

/** SSG: tell Next.js which slugs to pre-render at build time */
export function generateStaticParams() {
  return ALL_CALCULATORS.map((calc) => ({ slug: calc.slug }));
}

/** Phase 4: Per-calculator metadata — replaces react-helmet-async */
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const calc = getCalcBySlug(slug);

  if (!calc) return { title: 'Calculator Not Found' };

  const title = `${calc.name} — Free Online Calculator`;
  const description =
    calc.desc ||
    `Use our free ${calc.name} online. Fast, accurate, and easy to use.`;

  return {
    title,
    description,
    keywords: [calc.name, `${calc.name} calculator`, calc.cat, 'free calculator'],
    alternates: {
      canonical: `https://calculatorspoint.com/calculator/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://calculatorspoint.com/calculator/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

/** Page component — delegates rendering to the client component */
export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const calc = getCalcBySlug(slug);

  // Show 404 for unknown slugs
  if (!calc) notFound();

  return <CalculatorPageClient slug={slug} />;
}
