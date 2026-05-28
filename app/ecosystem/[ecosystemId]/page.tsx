/**
 * app/ecosystem/[ecosystemId]/page.tsx — Ecosystem Hub page (SSG)
 *
 * W8 fix: Each ecosystem page now gets proper per-page metadata with canonical URL,
 * og:url, og:title, og:description, and twitter tags — consistent with all other pages.
 * The ecosystem IS in sitemap.ts (lines 84-88) so no sitemap change needed.
 */
import type { Metadata } from 'next';
import EcosystemClient from './ecosystem-client';
import { SITE_URL } from '@/config/site';

const ECOSYSTEM_META: Record<string, { title: string; description: string; icon: string }> = {
  finance: {
    title: 'Finance Calculator Suite',
    description: 'Your complete personal finance toolkit — EMI, SIP, compound interest, retirement, tax, and 40+ more finance calculators. All interconnected with guided journeys.',
    icon: '💰',
  },
  fitness: {
    title: 'Fitness & Health Calculator Suite',
    description: 'Complete health and fitness toolkit — BMI, TDEE, body fat, macros, heart rate zones, and 20+ more health calculators. Medically validated formulas.',
    icon: '💪',
  },
  education: {
    title: 'Education Calculator Suite',
    description: 'Academic tools for students — GPA calculator, attendance tracker, IELTS band estimator, and SAT score predictor. All in one guided education suite.',
    icon: '🎓',
  },
};

export async function generateMetadata(
  { params }: { params: Promise<{ ecosystemId: string }> }
): Promise<Metadata> {
  const { ecosystemId } = await params;
  const meta = ECOSYSTEM_META[ecosystemId];

  if (!meta) {
    return {
      title: 'Calculator Suite | Calculators Point',
      description: 'Interconnected calculator suites for finance, health, education and more.',
    };
  }

  const canonicalUrl = `${SITE_URL}/ecosystem/${ecosystemId}`;
  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(meta.title)}&icon=${encodeURIComponent(meta.icon)}&cat=${encodeURIComponent('Suite')}`;

  return {
    // W8 fix: per-page title uses template ('Finance Calculator Suite | Calculators Point')
    title: meta.title,
    description: meta.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${meta.title} | Calculators Point`,
      description: meta.description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'Calculators Point',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${meta.title} | Calculators Point`,
      description: meta.description,
      images: [ogImageUrl],
    },
  };
}

export default async function EcosystemPage({
  params,
}: {
  params: Promise<{ ecosystemId: string }>;
}) {
  const { ecosystemId } = await params;
  return <EcosystemClient ecosystemId={ecosystemId} />;
}
