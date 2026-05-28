/**
 * app/sitemap.ts — Next.js XML Sitemap (Auto-generated at build time)
 *
 * This is a Next.js App Router project — NOT Vite. The sitemap is
 * auto-generated here using Next.js's built-in MetadataRoute.Sitemap API,
 * which is the correct approach (no vite-plugin-sitemap needed).
 *
 * All URL sets are driven from the same data sources as the actual routes,
 * so the sitemap stays 100% in sync with the site's pages automatically.
 *
 * Current URL breakdown (auto-counted at build time):
 *  ├── 1    Homepage              (/)
 *  ├── 1    Calculator index      (/calculators)
 *  ├── 9    Category pages        (/category/[id])       ← from CATEGORIES array
 *  ├── 180+ Calculator pages      (/calculator/[slug])   ← from ALL_CALCULATORS array
 *  ├── 28   SEO landing pages     (/tools/[slug])        ← from SEO_LANDING_PAGES array
 *  ├── 3    Ecosystem hubs        (/ecosystem/[id])
 *  ├── 9    Name Generator pages  (/name-generators/*)
 *  ├── 1    Cheat Sheets          (/cheat-sheets)
 *  └── 6    Static / Legal        (/about /contact /privacy-policy /terms /disclaimer /sitemap)
 *
 * Total: ~240+ URLs at build time — all submitted to Google via sitemap.xml
 *
 * Priority scale (Google ignores priority >0.9 if overused — use sparingly):
 *  1.0   Homepage
 *  0.9   /calculators index + popular individual calculators
 *  0.85  New calculators + name-generator hub
 *  0.8   Category pages
 *  0.75  Standard calculators
 *  0.7   SEO /tools/ landing pages + ecosystem hubs
 *  0.6   /cheat-sheets, /name-generators sub-pages
 *  0.4   About, contact
 *  0.3   Legal pages, human sitemap page
 */
import type { MetadataRoute } from 'next';
import { ALL_CALCULATORS, CATEGORIES } from '@/data/calculatorConfigs';
import { SEO_LANDING_PAGES } from '@/data/seoLandingData';

const BASE_URL = 'https://calculatorspoint.com';

/**
 * Content dates — update these when doing major content refreshes.
 * Using static dates prevents sitemap thrashing (Googlebot ignores
 * lastmod that changes every build without actual content changes).
 */
const DATES = {
  homepage:    new Date('2026-05-28'),  // Update when homepage content changes
  content:     new Date('2026-05-28'),  // Update when adding new calculators
  popular:     new Date('2026-05-28'),  // Update when popular calc content updates
  static:      new Date('2026-05-26'),  // Update when legal/about pages change
};

export default function sitemap(): MetadataRoute.Sitemap {

  // ── 1. Homepage ──────────────────────────────────────────────────────────
  const homepage: MetadataRoute.Sitemap = [{
    url: BASE_URL,
    lastModified: DATES.homepage,
    changeFrequency: 'daily',
    priority: 1.0,
  }];

  // ── 2. Calculator directory index (/calculators) ─────────────────────────
  const indexPage: MetadataRoute.Sitemap = [{
    url: `${BASE_URL}/calculators`,
    lastModified: DATES.content,
    changeFrequency: 'weekly',
    priority: 0.9,
  }];

  // ── 3. Category pages — auto-generated from CATEGORIES data ─────────────
  //    Any new category added to calculatorConfigs.ts is automatically included.
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/category/${cat.id}`,
    lastModified: DATES.content,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // ── 4. Calculator pages — auto-generated from ALL_CALCULATORS data ───────
  //    Excludes coming-soon and draft calculators (no indexable content yet).
  //    Popular calculators get higher priority + fresher lastmod date.
  const calculatorPages: MetadataRoute.Sitemap = ALL_CALCULATORS
    .filter((calc) => calc.status !== 'coming-soon' && calc.status !== 'draft')
    .map((calc) => ({
      url: `${BASE_URL}/calculator/${calc.slug}`,
      lastModified: (calc.popular || calc.isNew) ? DATES.popular : DATES.content,
      changeFrequency: (calc.popular ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority: calc.popular ? 0.9 : calc.isNew ? 0.85 : 0.75,
    }));

  // ── 5. SEO long-tail landing pages — auto-generated from SEO_LANDING_PAGES ─
  //    These are the /tools/[slug] programmatic SEO pages.
  //    Auto-included: any new entry in seoLandingData.ts is automatically included.
  const toolPages: MetadataRoute.Sitemap = SEO_LANDING_PAGES.map((page) => ({
    url: `${BASE_URL}/tools/${page.slug}`,
    lastModified: DATES.content,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // ── 6. Ecosystem hub pages (/ecosystem/[id]) ──────────────────────────────
  //    Interconnected calculator suite landing pages.
  const ecosystemPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/ecosystem/finance`,   lastModified: DATES.content, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/ecosystem/fitness`,   lastModified: DATES.content, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/ecosystem/education`, lastModified: DATES.content, changeFrequency: 'monthly' as const, priority: 0.7 },
  ];

  // ── 7. Name Generator pages (/name-generators/*) ──────────────────────────
  //    The hub page + 8 individual generator pages.
  //    Higher priority (0.85) because name generators attract different intent traffic.
  const nameGeneratorPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/name-generators`,                                            lastModified: DATES.content, changeFrequency: 'weekly'  as const, priority: 0.85 },
    { url: `${BASE_URL}/name-generators/baby-name-generator`,                        lastModified: DATES.content, changeFrequency: 'weekly'  as const, priority: 0.8  },
    { url: `${BASE_URL}/name-generators/islamic-baby-names`,                         lastModified: DATES.content, changeFrequency: 'weekly'  as const, priority: 0.8  },
    { url: `${BASE_URL}/name-generators/business-name-generator`,                    lastModified: DATES.content, changeFrequency: 'weekly'  as const, priority: 0.8  },
    { url: `${BASE_URL}/name-generators/brand-name-generator`,                       lastModified: DATES.content, changeFrequency: 'weekly'  as const, priority: 0.8  },
    { url: `${BASE_URL}/name-generators/youtube-channel-name-generator`,             lastModified: DATES.content, changeFrequency: 'weekly'  as const, priority: 0.8  },
    { url: `${BASE_URL}/name-generators/instagram-username-generator`,               lastModified: DATES.content, changeFrequency: 'weekly'  as const, priority: 0.8  },
    { url: `${BASE_URL}/name-generators/domain-name-generator`,                      lastModified: DATES.content, changeFrequency: 'weekly'  as const, priority: 0.8  },
    { url: `${BASE_URL}/name-generators/app-name-generator`,                         lastModified: DATES.content, changeFrequency: 'weekly'  as const, priority: 0.8  },
  ];

  // ── 8. Cheat Sheets (/cheat-sheets) ──────────────────────────────────────
  //    Single aggregation page for formula reference guides.
  const cheatSheetPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/cheat-sheets`, lastModified: DATES.content, changeFrequency: 'monthly' as const, priority: 0.6 },
  ];

  // ── 9. Static & legal pages ───────────────────────────────────────────────
  //    Low priority — important for crawlability but not search value.
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/about`,          lastModified: DATES.static, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE_URL}/contact`,        lastModified: DATES.static, changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${BASE_URL}/sitemap`,        lastModified: DATES.static, changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: DATES.static, changeFrequency: 'yearly'  as const, priority: 0.3 },
    { url: `${BASE_URL}/terms-of-service`, lastModified: DATES.static, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${BASE_URL}/disclaimer`,     lastModified: DATES.static, changeFrequency: 'yearly'  as const, priority: 0.3 },
  ];

  // ── Final output ──────────────────────────────────────────────────────────
  //    Order matters: higher-priority groups first so crawlers process
  //    the most important pages before hitting any crawl budget limit.
  return [
    ...homepage,           // 1    URL
    ...indexPage,          // 1    URL
    ...categoryPages,      // 9    URLs
    ...calculatorPages,    // 180+ URLs (auto from data)
    ...toolPages,          // 28   URLs (auto from data)
    ...nameGeneratorPages, // 9    URLs
    ...ecosystemPages,     // 3    URLs
    ...cheatSheetPages,    // 1    URL
    ...staticPages,        // 6    URLs
  ];
}
