/**
 * app/manifest.ts — Dynamic PWA Manifest (Next.js App Router)
 *
 * Replaces static public/manifest.json with a Next.js-generated manifest
 * so CALC_COUNT_LABEL stays in sync automatically on every build.
 * Next.js serves this at /manifest.webmanifest (the standard PWA filename).
 *
 * Note: Keep public/manifest.json for backward compat with any cached
 * service workers that reference /manifest.json directly.
 */
import type { MetadataRoute } from 'next';
import { CALC_COUNT_LABEL } from '@/data/calculatorConfigs';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Calculators Point — Free Online Calculators',
    short_name: 'Calculators Point',
    description: `${CALC_COUNT_LABEL} free online calculators for finance, health, math, education, and everyday life. Fast, accurate, and always free.`,
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    theme_color: '#0f172a',
    background_color: '#020617',
    lang: 'en',
    categories: ['utilities', 'finance', 'education'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'EMI Calculator',
        short_name: 'EMI',
        description: 'Calculate loan EMI instantly',
        url: '/calculator/loan-emi-calculator',
        icons: [{ src: '/favicon.svg', sizes: 'any' }],
      },
      {
        name: 'BMI Calculator',
        short_name: 'BMI',
        description: 'Calculate your Body Mass Index',
        url: '/calculator/bmi-calculator',
        icons: [{ src: '/favicon.svg', sizes: 'any' }],
      },
      {
        name: 'Scientific Calculator',
        short_name: 'Sci Calc',
        description: 'Free scientific calculator online',
        url: '/calculator/scientific-calculator',
        icons: [{ src: '/favicon.svg', sizes: 'any' }],
      },
    ],
    screenshots: [
      {
        src: '/og-image.png',
        sizes: '1200x630',
        type: 'image/png',
        // @ts-ignore — form_factor is valid per PWA spec but not yet in TS types
        form_factor: 'wide',
        label: 'Calculators Point homepage with popular calculator tools',
      },
    ],
  };
}
