/**
 * src/data/blogPosts.ts — Blog Content Data Source
 *
 * ═══════════════════════════════════════════════════════════════════
 * SINGLE SOURCE OF TRUTH for all blog post content, metadata, and
 * internal linking to related calculators.
 *
 * DRAFT SYSTEM:
 * ─────────────
 * Posts with `draft: true` are:
 *   ✗ NOT shown in the public blog listing
 *   ✗ NOT included in sitemap.xml
 *   ✗ NOT indexed by Google (noindex metadata applied in the page)
 *   ✓ Accessible at their URL for development/preview
 *   ✓ Clearly labeled as drafts in the UI
 *
 * ADDING REAL ARTICLES:
 * ─────────────────────
 * 1. Copy a draft entry and replace all placeholder values
 * 2. Set `draft: false` only when the article has polished, original content
 * 3. Set `publishedAt` to the actual publication date (ISO 8601)
 * 4. Add real `relatedCalculators` slugs from ALL_CALCULATORS
 * 5. Write the `content` field in HTML (or switch to MDX for richer authoring)
 *
 * SEO BEST PRACTICES (for when you write real content):
 * ──────────────────────────────────────────────────────
 * - Title: 50–60 chars, includes primary keyword
 * - Description: 140–160 chars, unique per post, includes CTA
 * - Excerpt: 100–160 chars, shown in listing card
 * - Content: 1500+ words for topical authority, original writing only
 * - Tags: 3–5 specific tags (not generic)
 * - relatedCalculators: link to 2–4 directly relevant calculator slugs
 * ═══════════════════════════════════════════════════════════════════
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type BlogCategory =
  | 'finance-guides'
  | 'health-calculators'
  | 'math-tutorials'
  | 'unit-conversion-guides'
  | 'education-tools'
  | 'everyday-calculation-tips';

export interface BlogPost {
  /** URL slug — must be URL-safe (lowercase, hyphens only) */
  slug: string;
  /** SEO title — 50-60 chars, includes primary keyword */
  title: string;
  /** Meta description — 140-160 chars, unique per post */
  description: string;
  /** Short preview shown in listing cards — 100-160 chars */
  excerpt: string;
  /**
   * Full article content in HTML.
   * For richer authoring, consider switching to MDX.
   * Keep all headings structured (h2 → h3 → h4).
   * Include internal links to relatedCalculators.
   */
  content: string;
  /** One of the defined categories above */
  category: BlogCategory;
  /** Display name of the author */
  author: string;
  /** ISO 8601 date string — used in <time> element and schema.org */
  publishedAt: string;
  /** ISO 8601 date string for last content update */
  updatedAt?: string;
  /** 3–5 specific tags for filtering */
  tags: string[];
  /**
   * Slugs of related calculators from ALL_CALCULATORS.
   * These generate internal links at the bottom of each article.
   * Drives link equity from blog → calculator pages.
   */
  relatedCalculators: string[];
  /**
   * Estimated reading time in minutes.
   * Will be auto-calculated from content length if not provided.
   */
  readingTime?: number;
  /**
   * Set to true while article is being drafted.
   * Drafts: hidden from listing, noindex, not in sitemap.
   * Set to false ONLY when content is polished and ready to publish.
   */
  draft: boolean;
  /** Featured image URL (relative to /public or absolute) */
  coverImage?: string;
}

// ── Category metadata ─────────────────────────────────────────────────────────

export interface BlogCategoryMeta {
  id: BlogCategory;
  name: string;
  description: string;
  icon: string;
}

export const BLOG_CATEGORIES: BlogCategoryMeta[] = [
  {
    id: 'finance-guides',
    name: 'Finance Guides',
    description: 'EMI, SIP, mortgage, tax, and investment calculation guides.',
    icon: '💰',
  },
  {
    id: 'health-calculators',
    name: 'Health Calculators',
    description: 'BMI, TDEE, body fat, calorie, and fitness calculation guides.',
    icon: '❤️',
  },
  {
    id: 'math-tutorials',
    name: 'Math Tutorials',
    description: 'Percentage, algebra, geometry, and statistics explained simply.',
    icon: '📐',
  },
  {
    id: 'unit-conversion-guides',
    name: 'Unit Conversion Guides',
    description: 'How to convert length, weight, temperature, speed, and more.',
    icon: '🔄',
  },
  {
    id: 'education-tools',
    name: 'Education Tools',
    description: 'GPA, CGPA, attendance, and academic planning guides.',
    icon: '🎓',
  },
  {
    id: 'everyday-calculation-tips',
    name: 'Everyday Calculation Tips',
    description: 'Age, date, fuel cost, tip, and daily calculation guides.',
    icon: '🏠',
  },
];

// ── Blog post data ─────────────────────────────────────────────────────────────
//
// ⚠️  ALL POSTS BELOW ARE DRAFT PLACEHOLDERS.
// ⚠️  Do NOT set draft: false until real, original content is written.
// ⚠️  The content field contains minimal placeholder text only.

export const BLOG_POSTS: BlogPost[] = [
  // ── Draft 1 ──────────────────────────────────────────────────────────────
  {
    slug: 'how-to-calculate-emi-for-home-loan',
    title: 'How to Calculate EMI for a Home Loan: Complete Guide',
    description: 'Learn exactly how home loan EMI is calculated using the PMT formula. Understand principal, interest rate, and tenure — with worked examples and a free EMI calculator.',
    excerpt: 'Everything you need to know about calculating your home loan EMI — formula breakdown, worked examples, and how tenure affects your monthly payment.',
    draft: true,
    author: 'Calculators Point',
    publishedAt: '2026-06-01',
    updatedAt: '2026-06-01',
    category: 'finance-guides',
    tags: ['home loan', 'EMI', 'mortgage', 'finance', 'interest rate'],
    readingTime: 8,
    relatedCalculators: [
      'loan-emi-calculator',
      'mortgage-calculator',
      'home-loan-eligibility-calculator',
      'sip-calculator',
    ],
    // ⚠️ PLACEHOLDER CONTENT — Replace with original, well-researched article before publishing.
    content: `
      <p><strong>[DRAFT — PLACEHOLDER CONTENT. DO NOT PUBLISH AS-IS.]</strong></p>
      <h2>What is Home Loan EMI?</h2>
      <p>Placeholder paragraph about home loan EMI definition...</p>
      <h2>The EMI Formula</h2>
      <p>Placeholder paragraph about the PMT formula...</p>
      <h2>Step-by-Step Calculation Example</h2>
      <p>Placeholder worked example...</p>
      <h2>How Tenure Affects Your EMI</h2>
      <p>Placeholder paragraph about tenure impact...</p>
      <h2>Use Our Free EMI Calculator</h2>
      <p>Placeholder CTA to the EMI calculator...</p>
    `,
  },

  // ── Draft 2 ──────────────────────────────────────────────────────────────
  {
    slug: 'bmi-calculator-guide-what-does-it-mean',
    title: 'BMI Calculator Guide: What Your BMI Number Actually Means',
    description: 'Understand what your BMI score means for your health. Learn WHO classification ranges, BMI limitations, and what to do with your result. Free online BMI calculator included.',
    excerpt: 'Your BMI number is just the start. Learn what it actually means, where it falls on the WHO scale, and what health professionals recommend based on your score.',
    draft: true,
    author: 'Calculators Point',
    publishedAt: '2026-06-02',
    updatedAt: '2026-06-02',
    category: 'health-calculators',
    tags: ['BMI', 'body mass index', 'health', 'weight', 'WHO'],
    readingTime: 6,
    relatedCalculators: [
      'bmi-calculator',
      'ideal-body-weight-calculator',
      'body-fat-percentage-calculator',
      'calorie-calculator',
    ],
    // ⚠️ PLACEHOLDER CONTENT — Replace with original, well-researched article before publishing.
    content: `
      <p><strong>[DRAFT — PLACEHOLDER CONTENT. DO NOT PUBLISH AS-IS.]</strong></p>
      <h2>What is BMI?</h2>
      <p>Placeholder paragraph about BMI definition...</p>
      <h2>How BMI is Calculated</h2>
      <p>Placeholder paragraph about the formula...</p>
      <h2>WHO BMI Classification Ranges</h2>
      <p>Placeholder table of BMI ranges...</p>
      <h2>Limitations of BMI</h2>
      <p>Placeholder about BMI not accounting for muscle mass etc...</p>
      <h2>Calculate Your BMI Now</h2>
      <p>Placeholder CTA...</p>
    `,
  },

  // ── Draft 3 ──────────────────────────────────────────────────────────────
  {
    slug: 'percentage-calculator-guide-how-to-calculate-percentage',
    title: 'How to Calculate Percentage: 5 Methods with Examples',
    description: 'Master percentage calculations with 5 clear methods: percentage of a number, percentage change, reverse percentage, and more. Examples, formulas, and a free calculator.',
    excerpt: 'Five essential percentage calculation methods explained clearly — with real-world examples and formulas you can apply immediately.',
    draft: true,
    author: 'Calculators Point',
    publishedAt: '2026-06-03',
    updatedAt: '2026-06-03',
    category: 'math-tutorials',
    tags: ['percentage', 'math', 'calculation', 'formula', 'percentage change'],
    readingTime: 5,
    relatedCalculators: [
      'percentage-calculator',
      'percentage-change-calculator',
      'discount-calculator',
      'tip-calculator',
    ],
    // ⚠️ PLACEHOLDER CONTENT — Replace with original, well-researched article before publishing.
    content: `
      <p><strong>[DRAFT — PLACEHOLDER CONTENT. DO NOT PUBLISH AS-IS.]</strong></p>
      <h2>What is a Percentage?</h2>
      <p>Placeholder paragraph...</p>
      <h2>Method 1: Percentage of a Number</h2>
      <p>Placeholder with formula and example...</p>
      <h2>Method 2: Percentage Change (Increase/Decrease)</h2>
      <p>Placeholder with formula and example...</p>
      <h2>Method 3: What Percentage is X of Y?</h2>
      <p>Placeholder with formula and example...</p>
      <h2>Method 4: Reverse Percentage</h2>
      <p>Placeholder with formula and example...</p>
      <h2>Method 5: Compound Percentage</h2>
      <p>Placeholder with formula and example...</p>
    `,
  },

  // ── Draft 4 ──────────────────────────────────────────────────────────────
  {
    slug: 'gpa-to-percentage-conversion-guide',
    title: 'GPA to Percentage Conversion: Complete Guide for Students',
    description: 'Convert your GPA to percentage and vice versa. Covers 4.0 scale, 10-point scale, CGPA, and university-specific formulas. Includes a free GPA calculator.',
    excerpt: 'How to convert GPA to percentage for college applications, job applications, and academic records — with formulas for 4.0, 10.0, and CGPA scales.',
    draft: true,
    author: 'Calculators Point',
    publishedAt: '2026-06-04',
    updatedAt: '2026-06-04',
    category: 'education-tools',
    tags: ['GPA', 'CGPA', 'percentage', 'grades', 'college'],
    readingTime: 7,
    relatedCalculators: [
      'gpa-calculator',
      'cgpa-to-percentage-calculator',
      'grade-calculator',
      'college-gpa-calculator',
    ],
    // ⚠️ PLACEHOLDER CONTENT — Replace with original, well-researched article before publishing.
    content: `
      <p><strong>[DRAFT — PLACEHOLDER CONTENT. DO NOT PUBLISH AS-IS.]</strong></p>
      <h2>Understanding GPA Scales</h2>
      <p>Placeholder paragraph about 4.0 vs 10.0 scale...</p>
      <h2>GPA to Percentage Formula (4.0 Scale)</h2>
      <p>Placeholder formula with examples...</p>
      <h2>CGPA to Percentage Conversion</h2>
      <p>Placeholder with university formulas...</p>
      <h2>Percentage to GPA Conversion</h2>
      <p>Placeholder reverse conversion...</p>
      <h2>Free GPA Calculator</h2>
      <p>Placeholder CTA...</p>
    `,
  },

  // ── Draft 5 ──────────────────────────────────────────────────────────────
  {
    slug: 'celsius-to-fahrenheit-conversion-guide',
    title: 'Celsius to Fahrenheit Conversion: Formula, Chart & Calculator',
    description: 'Convert Celsius to Fahrenheit instantly. Learn the exact formula, see a quick reference chart for common temperatures, and use our free temperature converter.',
    excerpt: 'The exact formula to convert Celsius to Fahrenheit, a printable reference chart, and common conversions you\'ll actually use every day.',
    draft: true,
    author: 'Calculators Point',
    publishedAt: '2026-06-05',
    updatedAt: '2026-06-05',
    category: 'unit-conversion-guides',
    tags: ['Celsius', 'Fahrenheit', 'temperature', 'unit conversion', 'formula'],
    readingTime: 4,
    relatedCalculators: [
      'temperature-converter',
      'length-converter',
      'weight-converter',
    ],
    // ⚠️ PLACEHOLDER CONTENT — Replace with original, well-researched article before publishing.
    content: `
      <p><strong>[DRAFT — PLACEHOLDER CONTENT. DO NOT PUBLISH AS-IS.]</strong></p>
      <h2>The Celsius to Fahrenheit Formula</h2>
      <p>Placeholder formula °F = (°C × 9/5) + 32...</p>
      <h2>Step-by-Step Conversion Example</h2>
      <p>Placeholder worked example...</p>
      <h2>Common Temperature Conversions Chart</h2>
      <p>Placeholder table (0°C, 20°C, 37°C, 100°C, etc.)...</p>
      <h2>Fahrenheit to Celsius Formula</h2>
      <p>Placeholder reverse formula...</p>
      <h2>Use Our Free Temperature Converter</h2>
      <p>Placeholder CTA...</p>
    `,
  },
];

// ── Utility functions ─────────────────────────────────────────────────────────

/** Returns only published (non-draft) posts, sorted newest first. */
export function getPublishedPosts(): BlogPost[] {
  return BLOG_POSTS
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

/** Returns a single post by slug. Returns null if not found. */
export function getPostBySlug(slug: string): BlogPost | null {
  return BLOG_POSTS.find((p) => p.slug === slug) ?? null;
}

/** Returns all posts by category (published only). */
export function getPostsByCategory(category: BlogCategory): BlogPost[] {
  return getPublishedPosts().filter((p) => p.category === category);
}

/** Returns category metadata by category ID. */
export function getCategoryMeta(id: BlogCategory): BlogCategoryMeta | null {
  return BLOG_CATEGORIES.find((c) => c.id === id) ?? null;
}

/**
 * Auto-calculates reading time from content length.
 * Average adult reading speed: ~200 words per minute.
 */
export function calcReadingTime(content: string): number {
  const wordCount = content.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / 200));
}
