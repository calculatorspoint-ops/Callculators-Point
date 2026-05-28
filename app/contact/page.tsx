/**
 * app/contact/page.tsx — Contact page (client)
 */
import type { Metadata } from 'next';
import ContactClient from './contact-client';

export const metadata: Metadata = {
  title: 'Contact Calculators Point',
  description: 'Get in touch with the Calculators Point team. Report bugs, suggest new calculators, ask questions, or give feedback.',
  alternates: { canonical: 'https://calculatorspoint.com/contact' },
  openGraph: {
    title: 'Contact Calculators Point',
    description: 'Get in touch with the Calculators Point team. Report bugs, suggest new calculators, ask questions, or give feedback.',
    url: 'https://calculatorspoint.com/contact',
    type: 'website',
    siteName: 'Calculators Point',
    images: [{
      url: 'https://calculatorspoint.com/api/og?title=Contact%20Calculators%20Point&icon=%E2%9C%89%EF%B8%8F&cat=Contact',
      width: 1200,
      height: 630,
      alt: 'Contact Calculators Point',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Calculators Point',
    description: 'Get in touch with the Calculators Point team. Report bugs, suggest new calculators, ask questions, or give feedback.',
    images: ['https://calculatorspoint.com/api/og?title=Contact%20Calculators%20Point&icon=%E2%9C%89%EF%B8%8F&cat=Contact'],
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
