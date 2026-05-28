/**
 * app/disclaimer/page.tsx — Disclaimer (SSG)
 */
import type { Metadata } from 'next';
import DisclaimerClient from './disclaimer-client';

export const metadata: Metadata = {
  title: 'Disclaimer — Calculators Point',
  description: 'Calculators Point Disclaimer — calculator results are for informational purposes only and should not replace professional financial or medical advice.',
  alternates: { canonical: 'https://calculatorspoint.com/disclaimer' },
  openGraph: {
    title: 'Disclaimer — Calculators Point',
    description: 'Calculators Point Disclaimer — calculator results are for informational purposes only and should not replace professional financial or medical advice.',
    url: 'https://calculatorspoint.com/disclaimer',
    type: 'website',
    siteName: 'Calculators Point',
    images: [{
      url: 'https://calculatorspoint.com/api/og?title=Disclaimer%20%E2%80%94%20Calculators%20Point&icon=%E2%9A%A0%EF%B8%8F&cat=Legal',
      width: 1200,
      height: 630,
      alt: 'Disclaimer — Calculators Point',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Disclaimer — Calculators Point',
    description: 'Calculators Point Disclaimer — calculator results are for informational purposes only and should not replace professional financial or medical advice.',
    images: ['https://calculatorspoint.com/api/og?title=Disclaimer%20%E2%80%94%20Calculators%20Point&icon=%E2%9A%A0%EF%B8%8F&cat=Legal'],
  },
};

export default function DisclaimerPage() {
  return <DisclaimerClient />;
}
