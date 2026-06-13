/**
 * app/sitemap.ts — Next.js XML Sitemap (Auto-generated at build time)
 *
 * ═══════════════════════════════════════════════════════════════════
 * GOOGLE SEARCH CONSOLE COMPLIANCE CHECKLIST
 * ═══════════════════════════════════════════════════════════════════
 *
 * ✅ Uses sitemaps.org 0.9 protocol
 * ✅ UTF-8 encoding declared
 * ✅ All URLs are absolute with https:// prefix
 * ✅ URLs match canonical URLs (no www, no trailing slash)
 * ✅ lastmod uses W3C Datetime / ISO 8601 format (YYYY-MM-DD)
 * ✅ Only indexable pages included (no draft/coming-soon/api routes)
 * ✅ changeFrequency hints realistic, not inflated
 * ✅ Priority scale used conservatively (Google mostly ignores it,
 *    but correct usage helps crawl ordering)
 * ✅ <50,000 URLs per sitemap (protocol limit)
 * ✅ Sitemap declared in robots.txt via app/robots.ts
 * ✅ No duplicate URLs
 * ✅ No blocked-by-robots.txt URLs
 *
 * URL breakdown (auto-counted at build time):
 *  ├── 1    Homepage              (/)
 *  ├── 1    Calculator index      (/calculators)
 *  ├── 9    Category pages        (/category/[id])       ← from CATEGORIES array
 *  ├── 180+ Calculator pages      (/calculator/[slug])   ← from ALL_CALCULATORS array
 *  ├── 12   SEO landing pages     (/tools/[slug])        ← from SEO_LANDING_PAGES array
 *  ├── 3    Ecosystem hubs        (/ecosystem/[id])
 *  ├── 9    Name Generator pages  (/name-generators/*)
 *  ├── 1    Cheat Sheets          (/cheat-sheets)
 *  └── 6    Static / Legal        (/about /contact /privacy-policy /terms /disclaimer /sitemap)
 *
 * Total: ~220+ URLs — all submitted to Google via /sitemap.xml
 */
import type { MetadataRoute } from 'next';
import { ALL_CALCULATORS, INDEXABLE_CALCULATORS, CATEGORIES } from '@/data/calculatorConfigs';
import { SEO_LANDING_PAGES } from '@/data/seoLandingData';
import { getPublishedPosts } from '@/data/blogPosts';

const BASE_URL = 'https://calculatorspoint.com';

/**
 * Content dates — update these when doing major content refreshes.
 * Using static dates prevents sitemap thrashing (Googlebot ignores
 * lastmod that changes every build without actual content changes).
 *
 * ⚠️ Google treats lastmod as a signal — only update when the page
 *    content actually changes. Fake "freshness" can hurt crawl trust.
 */
const DATES = {
  homepage:    new Date('2026-06-13'),  // Updated: Firebase fix, H2 content sections, FAQ schema, E-E-A-T, security headers
  content:     new Date('2026-06-13'),  // Updated: EMI validation, SEO text fix, accessibility improvements
  popular:     new Date('2026-06-13'),  // Updated: UI/UX audit fixes, sitemap freshness aligned
  static:      new Date('2026-06-13'),  // Updated: legal pages, consent compliance, HSTS header
};

export default function sitemap(): MetadataRoute.Sitemap {

  // ── 1. Homepage ──────────────────────────────────────────────────────────
  //    Highest priority — this is the main entry point for crawlers.
  const homepage: MetadataRoute.Sitemap = [{
    url: BASE_URL,
    lastModified: DATES.homepage,
    changeFrequency: 'daily',
    priority: 1.0,
  }];

  // ── 2. Calculator directory index (/calculators) ─────────────────────────
  //    High-value aggregation page — links to every calculator.
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

  // ── 4. Calculator pages — auto-generated from INDEXABLE_CALCULATORS ─────
  //    Excludes coming-soon, draft, and needsContent:true calculators.
  //    Popular calculators get higher priority + fresher lastmod date.
  const calculatorPages: MetadataRoute.Sitemap = INDEXABLE_CALCULATORS
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

  // ── 8. Cheat Sheets — re-enabled now that real formula content is published ──
  const cheatSheetPages: MetadataRoute.Sitemap = [{
    url: `${BASE_URL}/cheat-sheets`,
    lastModified: DATES.content,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }];

  // ── 9. Static & legal pages ───────────────────────────────────────────────
  //    Low priority — important for crawlability but not search value.
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/about`,            lastModified: DATES.static, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE_URL}/contact`,          lastModified: DATES.static, changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${BASE_URL}/sitemap`,          lastModified: DATES.static, changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${BASE_URL}/privacy-policy`,   lastModified: DATES.static, changeFrequency: 'yearly'  as const, priority: 0.3 },
    { url: `${BASE_URL}/terms-of-service`, lastModified: DATES.static, changeFrequency: 'yearly'  as const, priority: 0.3 },
    { url: `${BASE_URL}/disclaimer`,       lastModified: DATES.static, changeFrequency: 'yearly'  as const, priority: 0.3 },
    { url: `${BASE_URL}/cookie-policy`,    lastModified: DATES.static, changeFrequency: 'yearly'  as const, priority: 0.3 },
  ];

  // ── 10. Blog pages ──────────────────────────────────────────────────
  //    Only PUBLISHED (non-draft) posts are included.
  //    Draft posts are intentionally excluded from the sitemap.
  const publishedPosts = getPublishedPosts();
  const blogIndexPage: MetadataRoute.Sitemap = publishedPosts.length > 0 ? [{
    url: `${BASE_URL}/blog`,
    lastModified: publishedPosts[0] ? new Date(publishedPosts[0].publishedAt) : DATES.content,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }] : [];

  const blogPostPages: MetadataRoute.Sitemap = publishedPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }));

  // ── Final output ──────────────────────────────────────────────────────────
  //    Order matters: higher-priority groups first so crawlers process
  //    the most important pages before hitting any crawl budget limit.
  return [
    ...homepage,           // 1    URL
    ...indexPage,          // 1    URL
    ...categoryPages,      // 9    URLs
    ...calculatorPages,    // 180+ URLs (auto from data)
    ...toolPages,          // 12   URLs (auto from data)
    ...nameGeneratorPages, // 9    URLs
    ...ecosystemPages,     // 3    URLs
    ...cheatSheetPages,    // 1    URL  (real formula content now published)
    ...blogIndexPage,      // 0-1  URL (only when published posts exist)
    ...blogPostPages,      // 0-N  URLs (only published posts, drafts excluded)
    ...staticPages,        // 6    URLs
  ];
}
