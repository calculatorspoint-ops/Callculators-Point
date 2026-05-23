/**
 * app/terms-of-service/page.tsx — Terms of Service (SSG)
 */
import type { Metadata } from 'next';
import TermsClient from './terms-client';

export const metadata: Metadata = {
  title: 'Terms of Service — CalculatorsPoint',
  description: 'CalculatorsPoint Terms of Service — rules for using our free online calculators.',
  alternates: { canonical: 'https://calculatorspoint.com/terms-of-service' },
};

export default function TermsOfServicePage() {
  return <TermsClient />;
}
