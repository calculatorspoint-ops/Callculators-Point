/**
 * app/page.tsx — Home Page (SSG)
 *
 * Rendered at build time with full SSR.
 * Includes: WebSite schema (sitelinks search box), Organization schema.
 */
import type { Metadata } from 'next';
import HomePageClient from './home-client';

const BASE_URL = 'https://calculatorspoint.com';

export const metadata: Metadata = {
  title: 'Free Online Calculators — Finance, Health, Math & More',
  description:
    '180+ free online calculators for finance, health, math, education & everyday life. EMI, BMI, SIP, GPA, tax, mortgage calculators — all fast, accurate, and free.',
  alternates: { canonical: BASE_URL },
  keywords: [
    'free online calculators',
    'finance calculator',
    'health calculator',
    'math calculator',
    'EMI calculator',
    'BMI calculator',
    'SIP calculator',
    'loan calculator',
    'tax calculator',
    'GPA calculator',
    'Calculators Point',
  ],
  openGraph: {
    title: 'Calculators Point — 180+ Free Online Calculators',
    description: 'Free EMI, BMI, SIP, mortgage, tax, and 180+ more calculators. All fast, accurate, and always free.',
    url: BASE_URL,
    type: 'website',
    siteName: 'Calculators Point',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculators Point — 180+ Free Online Calculators',
    description: 'Free EMI, BMI, SIP, mortgage, tax, and 180+ more calculators.',
  },
};

// WebSite schema — enables Google Sitelinks Searchbox
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Calculators Point',
  alternateName: 'CalculatorsPoint',
  url: BASE_URL,
  description: '180+ free online calculators for finance, health, math, education and everyday life.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/calculators?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

// Organization schema — helps Google understand the brand
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Calculators Point',
  alternateName: 'CalculatorsPoint',
  url: BASE_URL,
  logo: `${BASE_URL}/icon-192.png`,
  description: 'Free online calculators for finance, health, math, education and everyday life.',
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    url: `${BASE_URL}/contact`,
  },
};

export default function HomePage() {
  return (
    <>
      {/* WebSite + Organization JSON-LD — server-rendered, zero JS cost */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <HomePageClient />
    </>
  );
}
