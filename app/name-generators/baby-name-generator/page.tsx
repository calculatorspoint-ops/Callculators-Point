import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Baby Name Generator — Find Perfect Baby Names with Meanings',
  description:
    'Generate beautiful baby names by gender, origin, style & meaning. Browse 500+ names with pronunciations. Free baby name generator — instant results.',
  keywords:
    'baby name generator, baby names, baby girl names, baby boy names, unique baby names',
  openGraph: {
    title: 'Baby Name Generator — Find the Perfect Name for Your Baby',
    description:
      'Browse 500+ baby names filtered by gender, origin, style, and meaning. Free and instant.',
    url: 'https://calculatorspoint.com/name-generators/baby-name-generator',
    type: 'website',
  },
  alternates: {
    canonical: 'https://calculatorspoint.com/name-generators/baby-name-generator',
  },
};

export { default } from './BabyNameGeneratorClient';
