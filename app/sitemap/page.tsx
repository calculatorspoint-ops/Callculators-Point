/**
 * app/sitemap/page.tsx — Sitemap (SSG)
 */
import type { Metadata } from 'next';
import SitemapClient from './sitemap-client';

export const metadata: Metadata = {
  title: 'Sitemap — CalculatorsPoint',
  description: 'Full sitemap of all CalculatorsPoint calculators and pages.',
  alternates: { canonical: 'https://calculatorspoint.com/sitemap' },
};

export default function SitemapPage() {
  return <SitemapClient />;
}
