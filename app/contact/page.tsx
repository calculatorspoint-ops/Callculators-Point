/**
 * app/contact/page.tsx — Contact page (client)
 */
import type { Metadata } from 'next';
import ContactClient from './contact-client';

export const metadata: Metadata = {
  title: 'Contact Us — CalculatorsPoint',
  description: 'Get in touch with the CalculatorsPoint team. Report issues, suggest calculators, or ask questions.',
  alternates: { canonical: 'https://calculatorspoint.com/contact' },
};

export default function ContactPage() {
  return <ContactClient />;
}
