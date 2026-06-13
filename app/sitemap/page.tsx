/**
 * app/sitemap/page.tsx — HTML Sitemap Page (SSG)
 *
 * Human-readable HTML sitemap for users and search engines.
 * The XML machine-readable sitemap is auto-generated at /sitemap.xml via app/sitemap.ts.
 *
 * SEO: This page helps search engines discover deep pages via internal linking,
 * and improves crawl efficiency by providing a flat link structure.
 */
import type { Metadata } from 'next';
import SitemapClient from './sitemap-client';
import { CALC_COUNT_LABEL, CATEGORIES } from '@/data/calculatorConfigs';
import { SITE_URL } from '@/config/site';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Sitemap',
  description:
    `Complete sitemap of Calculators Point — browse all ${CALC_COUNT_LABEL} free online calculators, category pages, name generators, cheat sheets, and SEO tool guides. Easy navigation for users & search engines.`,
  alternates: { canonical: 'https://calculatorspoint.com/sitemap' },
  openGraph: {
    title: 'Sitemap | Calculators Point',
    description:
      `Browse the full sitemap of Calculators Point with ${CALC_COUNT_LABEL} calculators across 9 categories. Find every tool, generator, and guide.`,
    url: 'https://calculatorspoint.com/sitemap',
    type: 'website',
    siteName: 'Calculators Point',
    images: [
      {
        url: 'https://calculatorspoint.com/api/og?title=Sitemap%20%E2%80%94%20Calculators%20Point&icon=%F0%9F%97%BA%EF%B8%8F&cat=Navigation',
        width: 1200,
        height: 630,
        alt: 'Sitemap — Calculators Point',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sitemap | Calculators Point',
    description:
      `Browse the full sitemap of Calculators Point with ${CALC_COUNT_LABEL} calculators across 9 categories.`,
    images: [
      'https://calculatorspoint.com/api/og?title=Sitemap%20%E2%80%94%20Calculators%20Point&icon=%F0%9F%97%BA%EF%B8%8F&cat=Navigation',
    ],
  },
};

const SITEMAP_URL = `${SITE_URL}/sitemap`;

// BreadcrumbList: Home → Sitemap
const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': `${SITEMAP_URL}#breadcrumb`,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Sitemap', item: SITEMAP_URL },
  ],
};

// WebPage schema — links this page to the site's WebSite entity
const webPage = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITEMAP_URL}#webpage`,
  url: SITEMAP_URL,
  name: 'Sitemap | Calculators Point',
  description: `Complete sitemap of Calculators Point — ${CALC_COUNT_LABEL} free online calculators across 9 categories.`,
  isPartOf: { '@id': `${SITE_URL}/#website` },
  breadcrumb: { '@id': `${SITEMAP_URL}#breadcrumb` },
  inLanguage: 'en-US',
  about: { '@type': 'Thing', name: 'Online Calculators' },
};

// ItemList of all calculator categories — helps Google understand site structure
const categoryList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Calculator Categories on Calculators Point',
  description: `Browse all ${CALC_COUNT_LABEL} free online calculators by category.`,
  url: SITEMAP_URL,
  numberOfItems: CATEGORIES.length,
  itemListElement: CATEGORIES.map((cat, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: `${cat.name} Calculators`,
    url: `${SITE_URL}/category/${cat.id}`,
  })),
};

export default function SitemapPage() {
  return (
    <>
      {/* JSON-LD Structured Data — server-rendered, zero JS cost */}
      <JsonLd data={[breadcrumb, webPage, categoryList]} idPrefix="sitemap" />
      <SitemapClient />
    </>
  );
}
