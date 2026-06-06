/**
 * app/cookie-policy/page.tsx — Cookie Policy (SSG)
 */
import type { Metadata } from 'next';
import CookieClient from './cookie-client';

export const metadata: Metadata = {
  title: 'Cookie Policy — Calculators Point',
  description: 'Learn how Calculators Point uses cookies and local storage. We use minimal cookies — only Google Analytics and AdSense. See how to manage or opt out.',
  alternates: { canonical: 'https://calculatorspoint.com/cookie-policy' },
  openGraph: {
    title: 'Cookie Policy — Calculators Point',
    description: 'Learn how Calculators Point uses cookies and local storage. Minimal cookies, full transparency.',
    url: 'https://calculatorspoint.com/cookie-policy',
    type: 'website',
    siteName: 'Calculators Point',
    images: [{
      url: 'https://calculatorspoint.com/api/og?title=Cookie%20Policy%20%E2%80%94%20Calculators%20Point&icon=%F0%9F%8D%AA&cat=Legal',
      width: 1200,
      height: 630,
      alt: 'Cookie Policy — Calculators Point',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cookie Policy — Calculators Point',
    description: 'Learn how Calculators Point uses cookies and local storage. Minimal cookies, full transparency.',
    images: ['https://calculatorspoint.com/api/og?title=Cookie%20Policy%20%E2%80%94%20Calculators%20Point&icon=%F0%9F%8D%AA&cat=Legal'],
  },
};

export default function CookiePolicyPage() {
  return <CookieClient />;
}
