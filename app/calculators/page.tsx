/**
 * app/calculators/page.tsx — All Calculators (SSG + SSR)
 *
 * SSR FIX: The calculator list is now server-rendered as static HTML at build
 * time. The search/filter bar is the only client-side interactive part.
 *
 * This means Google's crawler sees ALL calculator cards in the initial HTML —
 * not an empty page that requires JavaScript execution.
 *
 * Architecture:
 *  - Server: renders the full calculator grid as static HTML
 *  - Client (AllCalculatorsClient): adds search/filter interactivity on top
 *
 * Schema: CollectionPage + BreadcrumbList
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ALL_CALCULATORS,
  CATEGORIES,
  CALC_COUNT_LABEL,
  LIVE_CALC_COUNT,
  INDEXABLE_CALCULATORS,
} from '@/data/calculatorConfigs';
import { SITE_URL } from '@/config/site';
import AllCalculatorsClient from './all-calculators-client';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: `All ${CALC_COUNT_LABEL} Free Online Calculators`,
  description: `Browse all ${CALC_COUNT_LABEL} free online calculators — finance, health, math, education, converters, and everyday tools. Instant results, step-by-step formulas, no sign-up.`,
  alternates: { canonical: `${SITE_URL}/calculators` },
  openGraph: {
    title: `All ${CALC_COUNT_LABEL} Free Online Calculators | Calculators Point`,
    description: `${CALC_COUNT_LABEL} free calculators for finance, health, math, education, and everyday life.`,
    url: `${SITE_URL}/calculators`,
    type: 'website',
    siteName: 'Calculators Point',
    images: [{
      url: `${SITE_URL}/api/og?title=${encodeURIComponent(`All ${CALC_COUNT_LABEL} Free Calculators`)}&icon=${encodeURIComponent('🧮')}&cat=${encodeURIComponent('All Calculators')}`,
      width: 1200,
      height: 630,
      alt: `All ${CALC_COUNT_LABEL} Free Online Calculators`,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `All ${CALC_COUNT_LABEL} Free Online Calculators | Calculators Point`,
    description: `${CALC_COUNT_LABEL} free calculators for finance, health, math, education, and everyday life.`,
  },
};

// BreadcrumbList schema
const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': `${SITE_URL}/calculators#breadcrumb`,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'All Calculators', item: `${SITE_URL}/calculators` },
  ],
};

// CollectionPage schema — tells Google this page is a collection of tools
const collectionPage = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${SITE_URL}/calculators#webpage`,
  name: `All ${CALC_COUNT_LABEL} Free Online Calculators`,
  description: `A comprehensive collection of ${LIVE_CALC_COUNT} free online calculators covering finance, health, math, education, converters, and everyday tools.`,
  url: `${SITE_URL}/calculators`,
  isPartOf: { '@id': `${SITE_URL}/#website` },
  breadcrumb: { '@id': `${SITE_URL}/calculators#breadcrumb` },
  inLanguage: 'en-US',
  dateModified: new Date().toISOString().slice(0, 10),
  numberOfItems: LIVE_CALC_COUNT,
  hasPart: INDEXABLE_CALCULATORS.slice(0, 50).map((c) => ({
    '@type': 'WebApplication',
    name: c.name,
    url: `${SITE_URL}/calculator/${c.slug}`,
    description: c.desc,
    isAccessibleForFree: true,
    applicationCategory: 'UtilitiesApplication',
  })),
};

export default function AllCalculatorsPage() {
  return (
    <>
      {/*
        JSON-LD Structured Data — server-rendered at build time.
        JsonLd safely escapes `<` as `\u003c` preventing HTML-parser breakage.
      */}
      <JsonLd data={[breadcrumb, collectionPage]} />

      {/*
        AllCalculatorsClient handles search/filter interactivity.
        The full calculator list is pre-rendered inside it at build time
        via its own SSR-compatible static rendering.
      */}
      <AllCalculatorsClient />
    </>
  );
}
