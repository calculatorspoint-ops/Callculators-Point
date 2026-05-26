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
    rules: [
      {
        // All crawlers: allow everything except internal Next.js routes
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        // Block high-volume scraper bots that waste crawl budget
        userAgent: 'MJ12bot',
        disallow: ['/'],
      },
    ],
    sitemap: 'https://calculatorspoint.com/sitemap.xml',
    // No "host:" — it is not a Google standard and causes Search Console warnings
  };
}
