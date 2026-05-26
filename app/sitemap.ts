/**
 * app/sitemap.ts — Next.js XML Sitemap (Auto-generated at build time)
 *
 * Produces /sitemap.xml with all URLs in the site:
 *  - 1  homepage
 *  - 1  /calculators (directory)
 *  - 9  category pages  (/category/[id])
 *  - 180+ calculator pages  (/calculator/[slug])
 *  - 12  SEO landing pages  (/tools/[slug])
 *  - 3  ecosystem hub pages  (/ecosystem/[id])
 *  - 6  static pages  (about, contact, privacy, terms, disclaimer, sitemap)
 *
 * Priorities follow Google's guidance:
 *  1.0  homepage
 *  0.9  /calculators index + popular calculators
 *  0.8  category pages
 *  0.75 regular calculators
 *  0.7  SEO landing pages + ecosystem hubs
 *  0.4–0.5 legal / static pages
 */
import type { MetadataRoute } from 'next';
import { ALL_CALCULATORS, CATEGORIES } from '@/data/calculatorConfigs';
import { SEO_LANDING_PAGES } from '@/data/seoLandingData';

const BASE_URL = 'https://calculatorspoint.com';

// Hardcoded base date to prevent 'lastmod' thrashing on every build.
// Update this date manually when deploying major content overhauls.
const BUILD_DATE = new Date();
// Popular calculators get a slightly more recent date to signal freshness
const RECENT_DATE = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  // ── 1. Homepage ──────────────────────────────────────────────────────
  const homepage: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: BUILD_DATE,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // ── 2. Calculator index page ─────────────────────────────────────────
  const indexPage: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/calculators`,
      lastModified: BUILD_DATE,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // ── 3. Category pages ────────────────────────────────────────────────
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/category/${cat.id}`,
    lastModified: BUILD_DATE,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // ── 4. All calculator pages (highest-value content) ──────────────────
  //    Popular calculators: 0.9 priority
  //    New calculators:     0.85 priority
  //    Standard:            0.75 priority
  const calculatorPages: MetadataRoute.Sitemap = ALL_CALCULATORS
    .filter((calc) => calc.status !== 'coming-soon' && calc.status !== 'draft')
    .map((calc) => ({
      url: `${BASE_URL}/calculator/${calc.slug}`,
      lastModified: calc.popular || calc.isNew ? RECENT_DATE : BUILD_DATE,
      changeFrequency: (calc.popular ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority: calc.popular ? 0.9 : calc.isNew ? 0.85 : 0.75,
    }));

  // ── 5. SEO landing pages (/tools/[slug]) ─────────────────────────────
  const toolPages: MetadataRoute.Sitemap = SEO_LANDING_PAGES.map((page) => ({
    url: `${BASE_URL}/tools/${page.slug}`,
    lastModified: BUILD_DATE,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // ── 6. Ecosystem hub pages (/ecosystem/[id]) ─────────────────────────
  const ecosystemPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/ecosystem/finance`, lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/ecosystem/fitness`, lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/ecosystem/education`, lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.7 },
  ] as MetadataRoute.Sitemap;

  // ── 7. Static / legal pages ──────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/about`, lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/sitemap`, lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: BUILD_DATE, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms-of-service`, lastModified: BUILD_DATE, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/disclaimer`, lastModified: BUILD_DATE, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // ── 8. Name Generator pages ──────────────────────────────────────────
  const nameGeneratorPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/name-generators`, lastModified: BUILD_DATE, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/name-generators/baby-name-generator`, lastModified: BUILD_DATE, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/name-generators/islamic-baby-names`, lastModified: BUILD_DATE, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/name-generators/business-name-generator`, lastModified: BUILD_DATE, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/name-generators/brand-name-generator`, lastModified: BUILD_DATE, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/name-generators/youtube-channel-name-generator`, lastModified: BUILD_DATE, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/name-generators/instagram-username-generator`, lastModified: BUILD_DATE, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/name-generators/domain-name-generator`, lastModified: BUILD_DATE, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/name-generators/app-name-generator`, lastModified: BUILD_DATE, changeFrequency: 'weekly', priority: 0.85 },
  ];

  return [
    ...homepage,
    ...indexPage,
    ...categoryPages,
    ...calculatorPages,
    ...toolPages,
    ...ecosystemPages,
    ...staticPages,
    ...nameGeneratorPages,
  ];
}
