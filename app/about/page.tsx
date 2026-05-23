/**
 * app/about/page.tsx — About page (SSG)
 */
import type { Metadata } from 'next';
import AboutClient from './about-client';

export const metadata: Metadata = {
  title: 'About CalculatorsPoint — Our Mission & Story',
  description: 'Learn about CalculatorsPoint — free, accurate, and ad-light calculators for everyone. Our mission, team, and values.',
  alternates: { canonical: 'https://calculatorspoint.com/about' },
};

export default function AboutPage() {
  return <AboutClient />;
}
