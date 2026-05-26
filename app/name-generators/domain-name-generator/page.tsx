import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Domain Name Generator — Find Available Domain Names Free',
  description:
    'Generate short, brandable domain name ideas. Filter by extension (.com, .io, .ai). Free domain name generator — instant results.',
  keywords: 'domain name generator, domain name ideas, website name generator, domain generator',
  openGraph: {
    title: 'Domain Name Generator — Find Your Perfect Domain',
    description:
      'Get brandable domain name ideas with multiple extension options. Free and instant.',
    url: 'https://calculatorspoint.com/name-generators/domain-name-generator',
    type: 'website',
  },
  alternates: {
    canonical: 'https://calculatorspoint.com/name-generators/domain-name-generator',
  },
};

export { default } from './DomainNameClient';
