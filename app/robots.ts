/**
 * app/robots.ts — Next.js Auto-Generated robots.txt
 *
 * Generates /robots.txt at build time.
 * Allows all crawlers, points to sitemap.
 */
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: 'https://calculatorspoint.com/sitemap.xml',
    host: 'https://calculatorspoint.com',
  };
}
