import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'App Name Generator — Creative App Name Ideas Free',
  description:
    'Generate catchy app names for any category. Get taglines, descriptions & icon ideas. Free app name generator — instant results.',
  keywords: 'app name generator, app name ideas, mobile app name generator, app naming',
  openGraph: {
    title: 'App Name Generator — Name Your App for Success',
    description:
      'Get creative app name ideas with taglines, descriptions, and branding suggestions. Free and instant.',
    url: 'https://calculatorspoint.com/name-generators/app-name-generator',
    type: 'website',
  },
  alternates: {
    canonical: 'https://calculatorspoint.com/name-generators/app-name-generator',
  },
};

export { default } from './AppNameClient';
