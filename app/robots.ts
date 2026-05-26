/**
 * app/robots.ts — Next.js Auto-Generated robots.txt
 *
 * Generates /robots.txt at build time.
 * Allows all major search engine crawlers.
 * Blocks known scraper/SEO tool bots to save crawl budget.
 *
 * NOTE: "Host:" is a Yandex-only extension and is flagged as invalid
 * by Google Search Console — intentionally omitted.
 */
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: 'https://calculatorspoint.com/sitemap.xml',
  };
}
