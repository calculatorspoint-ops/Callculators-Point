/**
 * app/about/page.tsx — About page (SSG)
 */
import type { Metadata } from 'next';
import AboutClient from './about-client';

export const metadata: Metadata = {
  title: 'About Us — Calculators Point',
  description: 'Calculators Point is built by M. Khurram, a software engineer with fintech experience. Learn about our mission: free, accurate, privacy-first calculators for everyone.',
  authors: [{ name: 'M. Khurram', url: 'https://calculatorspoint.com/about' }],
  alternates: { canonical: 'https://calculatorspoint.com/about' },
  openGraph: {
    title: 'About Us — Calculators Point',
    description: 'Calculators Point is built by M. Khurram, a software engineer with fintech experience. Free, accurate, privacy-first calculators for everyone.',
    url: 'https://calculatorspoint.com/about',
    type: 'website',
    siteName: 'Calculators Point',
    images: [{
      url: 'https://calculatorspoint.com/api/og?title=About%20Us%20%E2%80%94%20Calculators%20Point&icon=%E2%84%B9%EF%B8%8F&cat=About',
      width: 1200,
      height: 630,
      alt: 'About Us — Calculators Point',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us — Calculators Point',
    description: 'Calculators Point is built by M. Khurram, a software engineer with fintech experience. Free, accurate, privacy-first calculators for everyone.',
    images: ['https://calculatorspoint.com/api/og?title=About%20Us%20%E2%80%94%20Calculators%20Point&icon=%E2%84%B9%EF%B8%8F&cat=About'],
  },
};

/** JSON-LD Person schema — tells Google's Knowledge Graph who built this site.
 *  Critical for E-E-A-T on YMYL (finance/health) content. */
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'M. Khurram',
  jobTitle: 'Software Engineer & Founder',
  description: 'Software engineer with fintech experience. Built Calculators Point to give everyone free access to professional-grade financial and health calculation tools.',
  url: 'https://calculatorspoint.com/about',
  email: 'contact@calculatorspoint.com',
  sameAs: [
    'https://linkedin.com/in/m-khurram',
    'https://calculatorspoint.com/about',
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'Calculators Point',
    url: 'https://calculatorspoint.com',
  },
  knowsAbout: [
    'Financial Calculators',
    'EMI Calculation',
    'Body Mass Index',
    'SIP Returns',
    'Tax Calculation',
    'Fintech Software Development',
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <AboutClient />
    </>
  );
}
