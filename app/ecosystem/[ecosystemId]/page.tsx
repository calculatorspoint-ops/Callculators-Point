/**
 * app/ecosystem/[ecosystemId]/page.tsx — Ecosystem Hub pages (SSG)
 *
 * SSR FIX: Added generateStaticParams() so Next.js pre-renders all ecosystem
 * pages at build time. EcosystemHub now receives ecosystemId as a prop
 * (not via useParams()) so it can render server-side.
 *
 * Schema added:
 *  - BreadcrumbList (Home › Calculators › Ecosystem name)
 *  - WebApplication (the suite itself)
 *  - FAQPage (FAQ accordion rich result)
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EcosystemClient from './ecosystem-client';
import { SITE_URL } from '@/config/site';

const ECOSYSTEM_META: Record<string, {
  title: string;
  description: string;
  icon: string;
  faq: { q: string; a: string }[];
}> = {
  finance: {
    title: 'Finance Calculator Suite',
    description:
      'Your complete personal finance toolkit — EMI, SIP, compound interest, retirement, tax, and 40+ more finance calculators. All interconnected with guided journeys.',
    icon: '💰',
    faq: [
      {
        q: 'What is the difference between EMI and mortgage?',
        a: 'An EMI (Equated Monthly Installment) is a generic term for any loan repayment. A Mortgage specifically refers to a home loan. Both use the same reducing-balance formula.',
      },
      {
        q: 'How does SIP compounding work?',
        a: 'With SIP, you invest a fixed amount monthly. Each installment earns compound returns, so money invested early grows the most over time.',
      },
      {
        q: 'Are these finance calculators accurate?',
        a: 'Yes. We use the standard reducing-balance method for EMI, future-value annuity for SIP, and official FBR slabs for Pakistan tax — all verified against published formulas.',
      },
    ],
  },
  fitness: {
    title: 'Fitness & Health Calculator Suite',
    description:
      'Complete health and fitness toolkit — BMI, TDEE, body fat, macros, heart rate zones, and 20+ more health calculators. Medically validated formulas.',
    icon: '💪',
    faq: [
      {
        q: 'What should I calculate first in the fitness suite?',
        a: 'Start with BMI for a baseline, then use the Calorie Calculator to set your daily target, and finally the Macro Calculator for your protein/carb/fat split.',
      },
      {
        q: 'Which calorie formula is most accurate?',
        a: 'The Mifflin-St Jeor formula is the most clinically validated for most adults. Our BMR Calculator compares both Mifflin and Harris-Benedict so you can see the difference.',
      },
    ],
  },
  education: {
    title: 'Education Calculator Suite',
    description:
      'Academic tools for students — GPA calculator, attendance tracker, IELTS band estimator, and SAT score predictor. All in one guided education suite.',
    icon: '🎓',
    faq: [
      {
        q: 'How do I raise my CGPA quickly?',
        a: 'Focus on high-credit courses first. Use our Target GPA Calculator to simulate exactly what grades you need each semester to hit your goal.',
      },
      {
        q: 'What IELTS score do I need for UK universities?',
        a: 'Most UK universities require IELTS 6.0–7.0 overall. Use our IELTS Band Calculator to see your current score and gap to target.',
      },
      {
        q: 'How does the attendance calculator work?',
        a: 'Enter your attended and total classes. The calculator tells you how many more classes you can miss while staying above the minimum threshold (usually 75%).',
      },
    ],
  },
};

/** SSG: pre-render all ecosystem slugs at build time */
export function generateStaticParams() {
  return Object.keys(ECOSYSTEM_META).map((ecosystemId) => ({ ecosystemId }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ ecosystemId: string }> }
): Promise<Metadata> {
  const { ecosystemId } = await params;
  const meta = ECOSYSTEM_META[ecosystemId];

  if (!meta) {
    return {
      title: 'Calculator Suite | Calculators Point',
      description: 'Interconnected calculator suites for finance, health, education and more.',
      robots: { index: false, follow: false },
    };
  }

  const canonicalUrl = `${SITE_URL}/ecosystem/${ecosystemId}`;
  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(meta.title)}&icon=${encodeURIComponent(meta.icon)}&cat=${encodeURIComponent('Suite')}`;

  return {
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
  const meta = ECOSYSTEM_META[ecosystemId];

  // Return 404 for unknown ecosystem IDs
  if (!meta) notFound();

  const pageUrl = `${SITE_URL}/ecosystem/${ecosystemId}`;

  // BreadcrumbList schema
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${SITE_URL}/calculators` },
      { '@type': 'ListItem', position: 3, name: meta.title, item: pageUrl },
    ],
  };

  // WebApplication schema — this suite is a free web app
  const webApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${meta.title} — Free Online`,
    url: pageUrl,
    description: meta.description,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    provider: { '@type': 'Organization', name: 'Calculators Point', url: SITE_URL },
  };

  // FAQPage schema
  const faqSchema = meta.faq.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: meta.faq.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      }
    : null;

  return (
    <>
      {/* JSON-LD — server-rendered, zero JS cost */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      {/* EcosystemClient is now a pure server component (no dynamic import) */}
      <EcosystemClient ecosystemId={ecosystemId} />
    </>
  );
}
