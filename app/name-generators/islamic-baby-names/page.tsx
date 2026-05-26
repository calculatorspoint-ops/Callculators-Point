import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Islamic Baby Names Generator — Muslim Boy & Girl Names with Meanings',
  description:
    'Discover meaningful Islamic baby names with Arabic spelling, English & Urdu meanings. Filter Quranic names, Sahaba names. Free Islamic name generator.',
  keywords:
    'islamic baby names, muslim baby names, islamic names, arabic baby names, quranic names, sahaba names',
  openGraph: {
    title: 'Islamic Baby Names — Find Beautiful Muslim Names with Meanings',
    description:
      'Browse 400+ Islamic baby names with Arabic spelling, English and Urdu meanings, and pronunciation guides.',
    url: 'https://calculatorspoint.com/name-generators/islamic-baby-names',
    type: 'website',
  },
  alternates: {
    canonical: 'https://calculatorspoint.com/name-generators/islamic-baby-names',
  },
};

export { default } from './IslamicNamesClient';
