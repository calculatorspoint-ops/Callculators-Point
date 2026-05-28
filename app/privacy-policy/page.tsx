/**
 * app/privacy-policy/page.tsx — Privacy Policy (SSG)
 */
import type { Metadata } from 'next';
import PrivacyClient from './privacy-client';

export const metadata: Metadata = {
  title: 'Privacy Policy — Calculators Point',
  description: 'Calculators Point Privacy Policy — how we collect, use, and protect your data. We never sell personal data. See our full data practices.',
  alternates: { canonical: 'https://calculatorspoint.com/privacy-policy' },
  openGraph: {
    title: 'Privacy Policy — Calculators Point',
    description: 'Calculators Point Privacy Policy — how we collect, use, and protect your data. We never sell personal data. See our full data practices.',
    url: 'https://calculatorspoint.com/privacy-policy',
    type: 'website',
    siteName: 'Calculators Point',
    images: [{
      url: 'https://calculatorspoint.com/api/og?title=Privacy%20Policy%20%E2%80%94%20Calculators%20Point&icon=%F0%9F%94%92&cat=Legal',
      width: 1200,
      height: 630,
      alt: 'Privacy Policy — Calculators Point',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy — Calculators Point',
    description: 'Calculators Point Privacy Policy — how we collect, use, and protect your data. We never sell personal data. See our full data practices.',
    images: ['https://calculatorspoint.com/api/og?title=Privacy%20Policy%20%E2%80%94%20Calculators%20Point&icon=%F0%9F%94%92&cat=Legal'],
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyClient />;
}
