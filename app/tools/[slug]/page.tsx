/**
 * app/tools/[slug]/page.tsx — SEO Landing Pages (SSG)
 *
 * These are pre-filled calculator landing pages targeting specific long-tail keywords.
 * e.g., /tools/emi-calculator-for-car-loan
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SEOLandingPage from '@/views/SEOLandingPage';

// Lazy-load landing data to avoid bundle bloat
async function getLandingData(slug: string) {
  const { getLandingBySlug, SEO_LANDING_PAGES } = await import('@/data/seoLandingData');
  return { landing: getLandingBySlug(slug), all: SEO_LANDING_PAGES };
}

export async function generateStaticParams() {
  try {
    const { SEO_LANDING_PAGES } = await import('@/data/seoLandingData');
    return (SEO_LANDING_PAGES || []).map((l: { slug: string }) => ({ slug: l.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { landing } = await getLandingData(slug);
  if (!landing) return { title: 'Page Not Found' };

  return {
    // Issue 9 fix: 'Calculators Point' (two words) — canonical brand form matching the domain
    title: `${landing.title} | Calculators Point`,
    description: landing.description,

    alternates: { canonical: `https://calculatorspoint.com/tools/${slug}` },
    openGraph: {
      title: landing.title,
      description: landing.description,
      url: `https://calculatorspoint.com/tools/${slug}`,
      type: 'website',
      siteName: 'Calculators Point',
    },
    twitter: {
      card: 'summary_large_image',
      title: landing.title,
      description: landing.description,
    },
  };
}

export default async function ToolsLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { landing } = await getLandingData(slug);
  if (!landing) notFound();
  return <SEOLandingPage slug={slug} />;
}
