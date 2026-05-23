/**
 * app/sitemap.ts — Next.js Auto-Generated Sitemap
 *
 * Generates /sitemap.xml at build time with all calculator, category,
 * and static page URLs. Next.js handles all caching and headers automatically.
 *
 * Replaces: manual /public/sitemap.xml or any Vite sitemap plugin
 */
import type { MetadataRoute } from 'next';
import { ALL_CALCULATORS, CATEGORIES } from '@/data/calculatorConfigs';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://calculatorspoint.com';
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/calculators`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/category/${cat.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // All calculator pages (highest value — 180+ pages)
  const calculatorPages: MetadataRoute.Sitemap = ALL_CALCULATORS.map((calc) => ({
    url: `${baseUrl}/calculator/${calc.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: calc.popular ? 0.9 : 0.7,
  }));

  return [...staticPages, ...categoryPages, ...calculatorPages];
}
