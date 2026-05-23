/**
 * app/disclaimer/page.tsx — Disclaimer (SSG)
 */
import type { Metadata } from 'next';
import DisclaimerClient from './disclaimer-client';

export const metadata: Metadata = {
  title: 'Disclaimer — CalculatorsPoint',
  description: 'CalculatorsPoint Disclaimer — calculator results are for informational purposes only.',
  alternates: { canonical: 'https://calculatorspoint.com/disclaimer' },
};

export default function DisclaimerPage() {
  return <DisclaimerClient />;
}
