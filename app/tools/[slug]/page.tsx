/**
 * app/tools/[slug]/page.tsx — SEO Landing Pages (SSG)
 *
 * These are pre-filled calculator landing pages targeting specific long-tail keywords.
 * e.g., /tools/emi-calculator-for-car-loan
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SEOLandingPage from '@/views/SEOLandingPage';
import { JsonLd } from '@/components/JsonLd';
import {
  generateBreadcrumbSchema,
  generateWebApplicationSchema,
  generateFAQSchema,
} from '@/lib/schema';
import { SITE_URL, SITE_NAME } from '@/config/site';

// Lazy-load landing data to avoid bundle bloat
async function getLandingData(slug: string) {
  const { getLandingBySlug, SEO_LANDING_PAGES } = await import('@/data/seoLandingData');
  return { landing: getLandingBySlug(slug), all: SEO_LANDING_PAGES };
}

async function getCalcData(calcSlug: string) {
  const { getCalcBySlug, CATEGORIES } = await import('@/data/calculatorConfigs');
  const calc = getCalcBySlug(calcSlug);
  const cat = calc ? CATEGORIES.find(c => c.id === calc.cat) : undefined;
  return { calc, cat };
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

  // Resolve calc for og:image (icon + category)
  const { calc, cat } = await getCalcData(landing.calcSlug);
  const icon    = calc?.icon  ?? '🧮';
  const catName = cat?.name   ?? 'Calculator';

  // Dynamic OG image — same /api/og route used by calculator pages
  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(landing.h1)}&icon=${encodeURIComponent(icon)}&cat=${encodeURIComponent(catName)}`;

  return {
    title: `${landing.title} | ${SITE_NAME}`,
    description: landing.description,

    alternates: { canonical: `${SITE_URL}/tools/${slug}` },
    openGraph: {
      title: landing.h1,
      description: landing.description,
      url: `${SITE_URL}/tools/${slug}`,
      type: 'website',
      siteName: SITE_NAME,
      // og:image — previously missing, causes blank social share previews
      images: [{
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: landing.h1,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: landing.h1,
      description: landing.description,
      // twitter:image — previously missing
      images: [ogImageUrl],
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

  // ── Resolve data for JSON-LD ─────────────────────────────────────────────
  const { calc, cat } = await getCalcData(landing.calcSlug);
  const pageUrl = `${SITE_URL}/tools/${slug}`;

  // BreadcrumbList: Home → All Calculators → [Landing page H1]
  const breadcrumb = generateBreadcrumbSchema([
    { name: 'Home',            item: SITE_URL },
    { name: 'All Calculators', item: `${SITE_URL}/calculators` },
    { name: landing.h1,        item: pageUrl },
  ]);

  // WebApplication — points to the embedded calculator (only when calc is resolved)
  const webApp = calc
    ? generateWebApplicationSchema(calc, cat, `${SITE_URL}/calculator/${calc.slug}`)
    : null;

  // FAQPage — only when the landing page has FAQ data
  const faqSchema = landing.faq && landing.faq.length > 0
    ? generateFAQSchema(landing.faq, 7)
    : null;

  return (
    <>
      {/*
        JSON-LD structured data — server-rendered, zero JS cost.
        - BreadcrumbList:  always emitted → enables breadcrumb rich results
        - FAQPage:         emitted when the page has FAQ data → FAQ rich results
        - WebApplication:  emitted when the embedded calculator resolves
      */}
      <JsonLd data={[breadcrumb, webApp, faqSchema]} />

      <SEOLandingPage slug={slug} />
    </>
  );
}

