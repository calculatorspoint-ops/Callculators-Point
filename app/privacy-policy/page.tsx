/**
 * app/privacy-policy/page.tsx — Privacy Policy (SSG)
 */
import type { Metadata } from 'next';
import PrivacyClient from './privacy-client';

export const metadata: Metadata = {
  title: 'Privacy Policy — CalculatorsPoint',
  description: 'CalculatorsPoint Privacy Policy — how we collect, use, and protect your data.',
  alternates: { canonical: 'https://calculatorspoint.com/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return <PrivacyClient />;
}
