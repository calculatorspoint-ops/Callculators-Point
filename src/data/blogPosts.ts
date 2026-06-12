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
    draft: false,
    author: 'Calculators Point',
    publishedAt: '2026-06-01',
    updatedAt: '2026-06-13',
    category: 'finance-guides',
    tags: ['home loan', 'EMI', 'mortgage', 'finance', 'interest rate'],
    readingTime: 8,
    relatedCalculators: [
      'loan-emi-calculator',
      'mortgage-calculator',
      'home-loan-eligibility-calculator',
      'sip-calculator',
    ],
    // EMI article — published
    content: `
<p>Buying a home is the biggest financial decision most people ever make. Before you sign any loan agreement, you need to understand one number above all others: your <strong>EMI (Equated Monthly Installment)</strong>. This guide breaks down exactly how EMI is calculated, why the formula works the way it does, and how to use it to compare loan offers intelligently.</p>
<h2>What is an EMI?</h2>
<p>An EMI is a fixed monthly payment you make to your lender for the entire duration of your loan. Every payment covers two components: <strong>Interest</strong> (the cost of borrowing) and <strong>Principal</strong> (repayment of the original loan amount). The split shifts every month — early payments are mostly interest; later payments are mostly principal.</p>
<h2>The EMI Formula</h2>
<pre><code>EMI = P × r × (1 + r)ⁿ ÷ [(1 + r)ⁿ − 1]</code></pre>
<p>Where: <strong>P</strong> = Principal loan amount, <strong>r</strong> = Monthly interest rate (annual rate ÷ 12 ÷ 100), <strong>n</strong> = Total monthly installments (years × 12). This is identical to Excel’s <code>=PMT(r, n, -P)</code> function.</p>
<h2>Worked Example: ₹50 Lakh Home Loan at 8.5% for 20 Years</h2>
<pre><code>r = 8.5 ÷ 12 ÷ 100 = 0.007083
n = 20 × 12 = 240
EMI = 50,00,000 × 0.007083 × (1.007083)^²⁴⁰ ÷ [(1.007083)^²⁴⁰ − 1]
    ≈ ₹43,391 per month</code></pre>
<p>Total paid: ₹1,04,13,840. Total interest: <strong>₹54,13,840</strong> — you borrow ₹50 lakhs and repay ₹1.04 crores.</p>
<h2>How Tenure Affects Your EMI and Total Interest</h2>
<table><thead><tr><th>Tenure</th><th>Monthly EMI</th><th>Total Interest</th></tr></thead><tbody><tr><td>10 years</td><td>₹61,993</td><td>₹24,39,160</td></tr><tr><td>15 years</td><td>₹49,240</td><td>₹38,63,200</td></tr><tr><td>20 years</td><td>₹43,391</td><td>₹54,13,840</td></tr><tr><td>25 years</td><td>₹40,261</td><td>₹70,78,300</td></tr><tr><td>30 years</td><td>₹38,446</td><td>₹88,40,560</td></tr></tbody></table>
<p>A 10-year loan vs a 30-year loan: paying only ₹23,547 more per month saves <strong>₹64 lakhs in interest</strong>.</p>
<h2>The EMI-to-Income Rule</h2>
<p>Financial advisors recommend keeping total monthly EMIs below <strong>40–50% of your net monthly income</strong>. If you earn ₹1,20,000/month net, your total EMI burden should not exceed ₹48,000–60,000.</p>
<h2>Prepayment: The EMI Superpower</h2>
<p>On a ₹50L loan at 8.5% for 20 years, paying just <strong>₹5,000 extra per month</strong> saves approximately <strong>₹16 lakhs in interest</strong> and closes the loan in ~15 years instead of 20.</p>
<h2>Calculate Your EMI</h2>
<p>Use our free <a href="/calculator/loan-emi-calculator">Home Loan EMI Calculator</a> to instantly calculate your monthly payment, see the complete amortization schedule, and compare different rates and tenures. Also see the <a href="/tools/home-loan-emi-calculator">Home Loan EMI Guide</a> for pre-filled examples.</p>
    `,
  },

  // ── Draft 2 ──────────────────────────────────────────────────────────────
  {
    slug: 'bmi-calculator-guide-what-does-it-mean',
    title: 'BMI Calculator Guide: What Your BMI Number Actually Means',
    description: 'Understand what your BMI score means for your health. Learn WHO classification ranges, BMI limitations, and what to do with your result. Free online BMI calculator included.',
    excerpt: 'Your BMI number is just the start. Learn what it actually means, where it falls on the WHO scale, and what health professionals recommend based on your score.',
    draft: false,
    author: 'Calculators Point',
    publishedAt: '2026-06-02',
    updatedAt: '2026-06-13',
    category: 'health-calculators',
    tags: ['BMI', 'body mass index', 'health', 'weight', 'WHO'],
    readingTime: 7,
    relatedCalculators: [
      'bmi-calculator',
      'calorie-calculator',
    ],
    content: `
<p>Your doctor orders a BMI check. The number comes back: 27.4. Is that good? Should you be worried? This guide explains exactly what Body Mass Index is, how it’s calculated, what the WHO classification ranges mean, and — crucially — what BMI <em>can’t</em> tell you.</p>
<h2>What is BMI?</h2>
<p>Body Mass Index (BMI) is a number derived from your height and weight, developed as a population statistics tool in the 1830s. It is best understood as a <em>first-pass screening tool</em> — a high BMI raises a flag for further investigation; it doesn’t diagnose anything on its own.</p>
<h2>The BMI Formula</h2>
<pre><code>BMI = Weight (kg) ÷ Height² (m²)</code></pre>
<p>Example: 75 kg, 1.75 m tall: BMI = 75 ÷ (1.75²) = 75 ÷ 3.0625 ≈ <strong>24.5</strong></p>
<h2>WHO BMI Classification Ranges</h2>
<table><thead><tr><th>BMI Range</th><th>Category</th><th>Health Risk</th></tr></thead><tbody><tr><td>Below 18.5</td><td>Underweight</td><td>Malnutrition risk</td></tr><tr><td>18.5 – 24.9</td><td>Normal weight</td><td>Lowest risk</td></tr><tr><td>25.0 – 29.9</td><td>Overweight</td><td>Moderately elevated</td></tr><tr><td>30.0 – 34.9</td><td>Obese Class I</td><td>High risk</td></tr><tr><td>35.0 – 39.9</td><td>Obese Class II</td><td>Very high risk</td></tr><tr><td>40.0+</td><td>Obese Class III</td><td>Extremely high risk</td></tr></tbody></table>
<h2>Adjusted Thresholds for South Asian Populations</h2>
<p>Research shows that people of South Asian origin develop metabolic complications at lower BMI values than Western populations. Many Indian and Pakistani health organizations use these thresholds: Normal: 18.5–22.9 | Overweight: 23.0–27.4 | Obese: 27.5+</p>
<h2>The Major Limitations of BMI</h2>
<ul><li><strong>Ignores body composition:</strong> A muscular athlete and an obese person can have identical BMIs — muscle is denser than fat.</li><li><strong>Ignores fat distribution:</strong> Abdominal fat is far more dangerous than subcutaneous fat. Waist circumference is a better metabolic risk predictor.</li><li><strong>Age and sex differences:</strong> Older adults lose muscle and gain fat while weight stays constant, masking true health risk.</li></ul>
<h2>What To Do With Your Result</h2>
<p>If BMI is in normal range: continue routine check-ups. If overweight/obese: request a metabolic panel (blood glucose, HbA1c, lipid profile). Complement BMI with waist circumference (under 90 cm for South Asian men, 80 cm for women) and consider a body fat percentage measurement.</p>
<p>Calculate your BMI now with our free <a href="/calculator/bmi-calculator">BMI Calculator</a> — it provides category interpretation, health recommendations, and population distribution charts.</p>
    `,
  },

  // ── Draft 3 ──────────────────────────────────────────────────────────────
  {
    slug: 'percentage-calculator-guide-how-to-calculate-percentage',
    title: 'Compound Interest Explained: Formula, Examples & The Rule of 72',
    description: 'Understand compound interest deeply. Learn the formula, see worked examples, discover why compounding frequency matters, and master the Rule of 72 shortcut.',
    excerpt: 'Compound interest is the most powerful force in personal finance. Here is how the formula works, why frequency matters, and the Rule of 72 shortcut every investor should know.',
    draft: false,
    author: 'Calculators Point',
    publishedAt: '2026-06-03',
    updatedAt: '2026-06-13',
    category: 'finance-guides',
    tags: ['compound interest', 'investing', 'formula', 'Rule of 72', 'wealth'],
    readingTime: 7,
    relatedCalculators: [
      'compound-interest-calculator',
      'sip-calculator',
      'simple-interest-calculator',
    ],
    content: `
<p>Compound interest is the engine behind every successful long-term investment — and the engine behind most debt disasters. Understanding it is non-negotiable for financial literacy.</p>
<h2>Simple vs Compound Interest: The Core Difference</h2>
<p><strong>Simple interest</strong> earns only on original principal. <strong>Compound interest</strong> earns on principal <em>and</em> on accumulated interest. Example: ₹1,00,000 at 10% for 10 years:</p>
<ul><li>Simple interest: ₹2,00,000</li><li>Compound (annual): ₹2,59,374</li></ul>
<p>The ₹59,374 difference is pure compounding — 30% more wealth from the exact same investment.</p>
<h2>The Compound Interest Formula</h2>
<pre><code>A = P × (1 + r/n)^(n×t)</code></pre>
<p>Where: <strong>P</strong> = Principal, <strong>r</strong> = Annual rate (decimal), <strong>n</strong> = Compounding frequency/year, <strong>t</strong> = Time in years.</p>
<h2>Worked Example: ₹2 Lakh for 15 Years at 12%</h2>
<pre><code>A = 2,00,000 × (1 + 0.12/12)^(12×15)
  = 2,00,000 × (1.01)^180
  ≈ ₹11,99,159</code></pre>
<p>Your ₹2 lakhs becomes almost ₹12 lakhs. Total interest earned: ₹9,99,159 — nearly 5× your original investment.</p>
<h2>Why Compounding Frequency Matters</h2>
<table><thead><tr><th>Frequency</th><th>n</th><th>₹1L after 10 years at 10%</th></tr></thead><tbody><tr><td>Annual</td><td>1</td><td>₹2,59,374</td></tr><tr><td>Monthly</td><td>12</td><td>₹2,70,704</td></tr><tr><td>Daily</td><td>365</td><td>₹2,71,791</td></tr></tbody></table>
<h2>The Rule of 72</h2>
<blockquote><strong>Years to double = 72 ÷ Annual interest rate</strong></blockquote>
<p>At 8%: doubles in 9 years. At 12%: doubles in 6 years. At 15%: doubles in 4.8 years.</p>
<h2>Starting Early vs Starting Late</h2>
<p>Investor A invests ₹5,000/month from age 25–35 (10 years = ₹6L total) then stops. Investor B invests ₹5,000/month from age 35–60 (25 years = ₹15L total). At 12% compounded monthly: <strong>Investor A has ₹1.76 crore vs Investor B’s ₹94 lakh</strong>. Starting 10 years earlier, investing less than half the money, results in nearly double the wealth.</p>
<p>Use our free <a href="/calculator/compound-interest-calculator">Compound Interest Calculator</a> to model any scenario, or the <a href="/calculator/sip-calculator">SIP Calculator</a> for regular monthly investment projections.</p>
    `,
  },

  // ── Draft 4 ──────────────────────────────────────────────────────────────
  {
    slug: 'gpa-to-percentage-conversion-guide',
    title: 'SIP vs Lump Sum: Which Investment Strategy Wins Over 20 Years?',
    description: 'Compare SIP vs lump sum investment strategies with data. Discover when each approach wins, how rupee cost averaging works, and which suits your financial situation.',
    excerpt: 'SIP or lump sum — which builds more wealth? The answer depends on market conditions, your timeline, and your risk tolerance. Here is the data.',
    draft: false,
    author: 'Calculators Point',
    publishedAt: '2026-06-04',
    updatedAt: '2026-06-13',
    category: 'finance-guides',
    tags: ['SIP', 'lump sum', 'mutual funds', 'investing', 'rupee cost averaging'],
    readingTime: 8,
    relatedCalculators: [
      'sip-calculator',
      'compound-interest-calculator',
      'roi-calculator',
    ],
    content: `
<p>You have ₹10 lakhs to invest. Should you put it all in at once (lump sum) or spread it over time through monthly SIPs? The answer is more nuanced than most financial articles admit.</p>
<h2>What is a SIP (Systematic Investment Plan)?</h2>
<p>A SIP means committing to invest a fixed amount into a mutual fund every month, regardless of market conditions. Amount is fixed; units purchased vary with price. SIPs benefit from <strong>rupee cost averaging</strong> and remove the need to “time the market.”</p>
<h2>What is Lump Sum Investing?</h2>
<p>Lump sum means investing a large amount at a single point in time. All money works from day one — returns are higher when markets rise after investment, but risk is higher if markets fall immediately after.</p>
<h2>Rupee Cost Averaging: How SIP Manages Risk</h2>
<p>When you invest ₹10,000/month: at ₹100/unit you get 100 units; at ₹80/unit you get 125 units; at ₹120/unit you get 83 units. You automatically buy more units when prices are cheap. Your average cost per unit ends up lower than the average price.</p>
<h2>The Maths: ₹24 Lakhs Over 20 Years at 12%</h2>
<table><thead><tr><th></th><th>Lump Sum</th><th>SIP (₹10K/month)</th></tr></thead><tbody><tr><td>Total invested</td><td>₹24,00,000</td><td>₹24,00,000</td></tr><tr><td>Final value at 12%</td><td>₹2,31,53,420</td><td>₹99,91,479</td></tr><tr><td>Total returns</td><td>₹2,07,53,420</td><td>₹75,91,479</td></tr></tbody></table>
<p>Lump sum wins by ₹1.31 crore in a steady 12% market — because money invested earlier compounds more. <strong>But real markets are not steady.</strong></p>
<h2>When SIP Wins: Volatile Markets</h2>
<p>In volatile markets with the same average return but significant ups and downs, SIP outperforms lump sum through rupee cost averaging. Historical Nifty 50 data shows SIPs consistently outperformed lump sums made near market peaks (Jan 2008, Jan 2018) over 3–5 year windows.</p>
<h2>The Psychological Reality</h2>
<p>Theory says lump sum wins in trending markets. Practice shows most investors cannot execute it. When markets are high, they fear investing at the top. When markets crash, they’re too fearful to commit. SIP removes this decision entirely — you invest regardless. Research on behavioral finance (Thaler, Kahneman) shows average investor returns are significantly below fund returns due to poorly timed entries and exits. SIP solves this mechanically.</p>
<h2>The Best Strategy: A Combination</h2>
<ol><li><strong>Lump sum immediately</strong> when you have windfall money — time in the market beats timing the market.</li><li><strong>Monthly SIP</strong> from salary income — builds discipline regardless of market levels.</li><li><strong>During corrections (&gt;20% fall):</strong> Consider increasing SIP or making an additional lump sum if your emergency fund is intact.</li></ol>
<p>Use our free <a href="/calculator/sip-calculator">SIP Calculator</a> to model your returns, or compare strategies side-by-side with the <a href="/calculator/compound-interest-calculator">Compound Interest Calculator</a>.</p>
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
