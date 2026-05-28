/**
 * app/terms-of-service/page.tsx — Terms of Service (SSG)
 */
import type { Metadata } from 'next';
import TermsClient from './terms-client';

export const metadata: Metadata = {
  title: 'Terms of Service — Calculators Point',
  description: 'Calculators Point Terms of Service — understand your rights and responsibilities when using our free online calculators and tools.',
  alternates: { canonical: 'https://calculatorspoint.com/terms-of-service' },
  openGraph: {
    title: 'Terms of Service — Calculators Point',
    description: 'Calculators Point Terms of Service — understand your rights and responsibilities when using our free online calculators and tools.',
    url: 'https://calculatorspoint.com/terms-of-service',
    type: 'website',
    siteName: 'Calculators Point',
    images: [{
      url: 'https://calculatorspoint.com/api/og?title=Terms%20of%20Service%20%E2%80%94%20Calculators%20Point&icon=%F0%9F%93%9C&cat=Legal',
      width: 1200,
      height: 630,
      alt: 'Terms of Service — Calculators Point',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service — Calculators Point',
    description: 'Calculators Point Terms of Service — understand your rights and responsibilities when using our free online calculators and tools.',
    images: ['https://calculatorspoint.com/api/og?title=Terms%20of%20Service%20%E2%80%94%20Calculators%20Point&icon=%F0%9F%93%9C&cat=Legal'],
  },
};

export default function TermsOfServicePage() {
  return <TermsClient />;
}
