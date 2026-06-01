/**
 * app/sitemap/page.tsx — Sitemap (SSG)
 *
 * Human-readable HTML sitemap for users and search engines.
 * The XML machine-readable sitemap is auto-generated at /sitemap.xml via app/sitemap.ts.
 *
 * SEO: This page helps search engines discover deep pages via internal linking,
 * and improves crawl efficiency by providing a flat link structure.
 */
import type { Metadata } from 'next';
import SitemapClient from './sitemap-client';

export const metadata: Metadata = {
  title: 'Sitemap',
  description:
    'Complete sitemap of Calculators Point — browse all 220+ free online calculators, category pages, name generators, cheat sheets, and SEO tool guides. Easy navigation for users & search engines.',
  alternates: { canonical: 'https://calculatorspoint.com/sitemap' },
  openGraph: {
    title: 'Sitemap | Calculators Point',
    description:
      'Browse the full sitemap of Calculators Point with 220+ calculators across 9 categories. Find every tool, generator, and guide.',
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
      'Browse the full sitemap of Calculators Point with 220+ calculators across 9 categories.',
    images: [
      'https://calculatorspoint.com/api/og?title=Sitemap%20%E2%80%94%20Calculators%20Point&icon=%F0%9F%97%BA%EF%B8%8F&cat=Navigation',
    ],
  },
};

export default function SitemapPage() {
  return <SitemapClient />;
}
