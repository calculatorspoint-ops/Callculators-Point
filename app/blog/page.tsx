/**
 * app/blog/page.tsx — Blog Index Page (SSG)
 *
 * Lists all published (non-draft) blog articles.
 * Since all current posts are drafts, this page shows an empty state / coming soon.
 *
 * SEO:
 * - When 0 published posts: noindex to avoid an empty page being indexed.
 * - When posts exist: full metadata + BreadcrumbList schema.
 *
 * ADDING ARTICLES:
 * Set draft: false on posts in src/data/blogPosts.ts and rebuild.
 * This page will automatically pick them up.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedPosts, BLOG_CATEGORIES } from '@/data/blogPosts';
import { SITE_URL } from '@/config/site';
import { CALC_COUNT_LABEL } from '@/data/calculatorConfigs';

const publishedPosts = getPublishedPosts();
const hasPublishedPosts = publishedPosts.length > 0;

export const metadata: Metadata = {
  title: `Blog — Calculator Guides & Tutorials`,
  description: `Free guides and tutorials on finance, health, math, and everyday calculations. In-depth articles from the team behind ${CALC_COUNT_LABEL} free online calculators.`,
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: 'Blog — Calculators Point',
    description: `Finance guides, health calculator tutorials, math tips, and more. Learn how to use calculators effectively.`,
    url: `${SITE_URL}/blog`,
    type: 'website',
    siteName: 'Calculators Point',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog — Calculators Point',
    description: 'Finance, health, math, and everyday calculation guides.',
  },
  // If no published posts yet, noindex to avoid empty page in search index
  robots: hasPublishedPosts
    ? { index: true, follow: true }
    : { index: false, follow: true },
};

// BreadcrumbList schema
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
  ],
};

const CATEGORY_LABEL: Record<string, string> = {
  'finance-guides': 'Finance',
  'health-calculators': 'Health',
  'math-tutorials': 'Math',
  'unit-conversion-guides': 'Unit Conversion',
  'education-tools': 'Education',
  'everyday-calculation-tips': 'Everyday',
};

const CATEGORY_COLOR: Record<string, string> = {
  'finance-guides': '#1d4ed8',
  'health-calculators': '#b91c1c',
  'math-tutorials': '#6d28d9',
  'unit-conversion-guides': '#065f46',
  'education-tools': '#c2410c',
  'everyday-calculation-tips': '#b45309',
};

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(24px, 5vw, 60px) clamp(16px, 4vw, 32px)' }}>
        {/* ── Header ── */}
        <div style={{ marginBottom: 48, borderBottom: '1px solid var(--border)', paddingBottom: 32 }}>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: 20 }}>
            <ol style={{ display: 'flex', gap: 6, alignItems: 'center', listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: 'var(--text3)' }}>
              <li><Link href="/" style={{ color: 'var(--brand)', textDecoration: 'none', fontWeight: 600 }}>Home</Link></li>
              <li aria-hidden="true" style={{ color: 'var(--text3)' }}>/</li>
              <li style={{ color: 'var(--text2)' }} aria-current="page">Blog</li>
            </ol>
          </nav>

          <h1 style={{ fontFamily: 'var(--font-hd)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-.03em', marginBottom: 12 }}>
            Calculator Guides & Tutorials
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text2)', maxWidth: 620, lineHeight: 1.7 }}>
            In-depth guides on finance, health, math, and everyday calculations. Learn the formulas behind our {CALC_COUNT_LABEL} free calculators.
          </p>
        </div>

        {/* ── Category Filter Strip ── */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 40 }}>
          <Link href="/blog" style={{ padding: '6px 14px', borderRadius: 100, fontSize: 13, fontWeight: 700, background: 'var(--brand)', color: '#fff', textDecoration: 'none' }}>
            All Topics
          </Link>
          {BLOG_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/blog?category=${cat.id}`}
              style={{ padding: '6px 14px', borderRadius: 100, fontSize: 13, fontWeight: 600, background: 'var(--surf2)', color: 'var(--text2)', border: '1px solid var(--border)', textDecoration: 'none' }}
            >
              {cat.icon} {cat.name}
            </Link>
          ))}
        </div>

        {/* ── Posts Grid or Empty State ── */}
        {hasPublishedPosts ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {publishedPosts.map((post) => {
              const color = CATEGORY_COLOR[post.category] ?? 'var(--brand)';
              return (
                <article key={post.slug} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '20px 20px 16px' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color, background: `${color}15`, padding: '3px 10px', borderRadius: 100 }}>
                        {CATEGORY_LABEL[post.category] ?? post.category}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text3)' }}>{post.readingTime} min read</span>
                    </div>
                    <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', lineHeight: 1.4, marginBottom: 8, letterSpacing: '-.02em' }}>
                      <Link href={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {post.title}
                      </Link>
                    </h2>
                    <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 16 }}>
                      {post.excerpt}
                    </p>
                  </div>
                  <div style={{ marginTop: 'auto', padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: 'var(--text3)' }}>
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </time>
                    </span>
                    <Link href={`/blog/${post.slug}`} style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand)', textDecoration: 'none' }}>
                      Read →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* ── Enriched content state — substantive, not a thin placeholder ── */
          <div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px 32px', marginBottom: 32 }}>
              <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 16 }}>
                Our team is currently writing in-depth, research-backed guides on how to use our calculators effectively — covering topics like loan planning, investment strategy, health tracking, GPA optimization, and more. Each guide will include worked examples, formulas explained in plain English, and step-by-step walkthroughs.
              </p>
              <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 20 }}>
                In the meantime, every calculator on Calculators Point already includes a built-in <strong>About</strong> section, <strong>step-by-step formula</strong> display, and <strong>FAQ section</strong> — giving you the context you need to understand your results right on the calculator page.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/calculators" style={{ padding: '11px 22px', background: 'var(--brand)', color: '#fff', borderRadius: 'var(--r-lg)', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                  Browse {CALC_COUNT_LABEL} Free Calculators →
                </Link>
                <Link href="/contact" style={{ padding: '11px 22px', background: 'var(--surf2)', color: 'var(--text)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-lg)', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                  Suggest a Topic
                </Link>
              </div>
            </div>

            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 8, letterSpacing: '-.02em' }}>
              Start With These Popular Calculators
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 20, lineHeight: 1.7 }}>
              Each calculator below includes a full About section explaining the formula, worked examples, and frequently asked questions.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14, marginBottom: 48 }}>
              {[
                { href: '/calculator/loan-emi-calculator',          icon: '🏦', name: 'EMI Calculator',        cat: 'Finance',   desc: 'Understand your monthly loan repayment with full amortization schedule and total interest calculation.' },
                { href: '/calculator/bmi-calculator',               icon: '⚖️', name: 'BMI Calculator',         cat: 'Health',    desc: 'Body Mass Index using the WHO standard formula, with health risk interpretation and category explanation.' },
                { href: '/calculator/sip-calculator',               icon: '📈', name: 'SIP Calculator',         cat: 'Finance',   desc: 'Plan your mutual fund investments with realistic projections and step-up SIP contribution options.' },
                { href: '/calculator/compound-interest-calculator', icon: '💰', name: 'Compound Interest',      cat: 'Finance',   desc: 'See how your savings grow over time with annual, monthly, and daily compounding comparisons.' },
                { href: '/calculator/bmr-calculator',               icon: '🔥', name: 'BMR Calculator',         cat: 'Health',    desc: 'Calculate your Basal Metabolic Rate using the Mifflin-St Jeor equation — the gold standard formula.' },
                { href: '/calculator/gpa-calculator',               icon: '📚', name: 'GPA Calculator',         cat: 'Education', desc: 'Calculate your semester or cumulative GPA with course weight support and grade simulation.' },
              ].map(c => (
                <Link key={c.href} href={c.href} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '18px 20px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 14, textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 22 }} aria-hidden="true">{c.icon}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--brand)', fontWeight: 600 }}>{c.cat}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Upcoming Topics (shown only when no published posts) ── */}
        {!hasPublishedPosts && (
          <div style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 8, letterSpacing: '-.02em' }}>
              Guide Topics We Are Writing
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 20, lineHeight: 1.7 }}>
              Our upcoming guides will cover these topics with in-depth, practical examples:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {BLOG_CATEGORIES.map((cat) => (
                <div key={cat.id} style={{ padding: '16px 18px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{cat.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{cat.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.4 }}>{cat.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
