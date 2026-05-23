/**
 * app/page.tsx — Home Page (SSG)
 *
 * Rendered at build time. Imports the existing Home component
 * which renders the full homepage with hero, calculator grid, etc.
 */
import type { Metadata } from 'next';
import HomePageClient from './home-client';

export const metadata: Metadata = {
  title: 'Free Online Calculators — Finance, Health, Math & More',
  description:
    '180+ free online calculators for finance, health, math, education & everyday life. EMI, BMI, SIP, GPA, tax, mortgage calculators — all fast, accurate, and free.',
  alternates: { canonical: 'https://calculatorspoint.com' },
  openGraph: {
    title: 'CalculatorsPoint — 180+ Free Online Calculators',
    description: 'Free EMI, BMI, SIP, mortgage, tax, and 180+ more calculators.',
    url: 'https://calculatorspoint.com',
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
