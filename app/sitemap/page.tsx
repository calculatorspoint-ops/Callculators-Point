/**
 * app/sitemap/page.tsx — Sitemap (SSG)
 */
import type { Metadata } from 'next';
import SitemapClient from './sitemap-client';

export const metadata: Metadata = {
  // W1 fix: using short title so template produces 'Sitemap | Calculators Point' (no duplication)
  title: 'Sitemap',
  description: 'Full sitemap of all Calculators Point pages — 180+ calculators, category pages, SEO guides, name generators, and more.',
  alternates: { canonical: 'https://calculatorspoint.com/sitemap' },
  openGraph: {
    title: 'Sitemap | Calculators Point',
    description: 'Full sitemap of all Calculators Point pages — 180+ calculators, category pages, SEO guides, name generators, and more.',
    url: 'https://calculatorspoint.com/sitemap',
    type: 'website',
    siteName: 'Calculators Point',
    images: [{
      url: 'https://calculatorspoint.com/api/og?title=Sitemap%20%E2%80%94%20Calculators%20Point&icon=%F0%9F%97%BA%EF%B8%8F&cat=Navigation',
      width: 1200,
      height: 630,
      alt: 'Sitemap — Calculators Point',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sitemap | Calculators Point',
    description: 'Full sitemap of all Calculators Point pages — 180+ calculators, category pages, SEO guides, name generators, and more.',
    images: ['https://calculatorspoint.com/api/og?title=Sitemap%20%E2%80%94%20Calculators%20Point&icon=%F0%9F%97%BA%EF%B8%8F&cat=Navigation'],
  },
};

export default function SitemapPage() {
  return <SitemapClient />;
}
