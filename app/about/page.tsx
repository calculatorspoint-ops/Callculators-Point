/**
 * app/about/page.tsx — About page (SSG)
 */
import type { Metadata } from 'next';
import AboutClient from './about-client';

export const metadata: Metadata = {
  title: 'About Us — Calculators Point',
  description: 'Learn about Calculators Point — building free, accurate, and privacy-first online calculators for everyone. Our mission, story, and values.',
  alternates: { canonical: 'https://calculatorspoint.com/about' },
  openGraph: {
    title: 'About Us — Calculators Point',
    description: 'Learn about Calculators Point — building free, accurate, and privacy-first online calculators for everyone. Our mission, story, and values.',
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
    description: 'Learn about Calculators Point — building free, accurate, and privacy-first online calculators for everyone. Our mission, story, and values.',
    images: ['https://calculatorspoint.com/api/og?title=About%20Us%20%E2%80%94%20Calculators%20Point&icon=%E2%84%B9%EF%B8%8F&cat=About'],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
