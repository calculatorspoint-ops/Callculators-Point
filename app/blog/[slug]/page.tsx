/**
 * app/blog/[slug]/page.tsx — Individual Blog Article Page (SSG)
 *
 * DRAFT HANDLING:
 * - Draft posts: accessible at URL, get robots noindex, show a draft banner.
 * - Draft posts: NOT in generateStaticParams (not pre-rendered at build time).
 *   They are accessible via on-demand rendering (dynamic fallback) for previewing.
 *
 * SEO FOR PUBLISHED POSTS:
 * - Full metadata (title, description, OG, Twitter)
 * - Article schema (JSON-LD)
 * - BreadcrumbList schema
 * - Canonical URL
 * - Internal links to related calculators
 *
 * ADDING REAL ARTICLES:
 * Set draft: false on the post in src/data/blogPosts.ts.
 * The page will be pre-rendered at build time and fully indexed.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getPublishedPosts, getCategoryMeta, calcReadingTime, BLOG_POSTS } from '@/data/blogPosts';
import { getCalcBySlug } from '@/data/calculatorConfigs';
import { SITE_URL } from '@/config/site';
import { JsonLd } from '@/components/JsonLd';

// Pre-render only PUBLISHED posts at build time.
// Draft posts are excluded — they fall back to on-demand rendering for preview.
export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return { title: 'Article Not Found' };

  const readingTime = post.readingTime ?? calcReadingTime(post.content);
  const catMeta = getCategoryMeta(post.category);

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    authors: [{ name: post.author }],
    // CRITICAL: Draft posts must not be indexed by Google
    robots: post.draft
      ? { index: false, follow: false, noarchive: true }
      : { index: true, follow: true },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: 'article',
      siteName: 'Calculators Point',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      section: catMeta?.name,
      images: [{
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: post.title,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [`${SITE_URL}/og-image.png`],
    },
    // Extra metadata for article structured data consumers
    other: {
      'article:published_time': post.publishedAt,
      'article:modified_time': post.updatedAt ?? post.publishedAt,
      'article:author': post.author,
      'article:section': catMeta?.name ?? post.category,
      'article:tag': post.tags.join(','),
      'reading-time': String(readingTime),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  // Return 404 if slug doesn't exist at all
  if (!post) notFound();

  const catMeta = getCategoryMeta(post.category);
  const readingTime = post.readingTime ?? calcReadingTime(post.content);

  // Resolve related calculator data for internal links
  const relatedCalcs = post.relatedCalculators
    .map((s) => getCalcBySlug(s))
    .filter(Boolean);

  // JSON-LD schemas (only emit for published posts)
  const articleSchema = !post.draft ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${SITE_URL}/blog/${post.slug}#article`,
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}#webpage`,
    },
    isPartOf: { '@id': `${SITE_URL}/#website` },
    keywords: post.tags.join(', '),
    articleSection: catMeta?.name,
    inLanguage: 'en-US',
    url: `${SITE_URL}/blog/${post.slug}`,
  } : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${SITE_URL}/blog/${post.slug}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
    ],
  };

  // Extract FAQ pairs from article content (h3 + following p inside an h2 FAQ section)
  // This powers the FAQPage schema that Google displays as rich results in SERPs.
  function extractFaqs(html: string): Array<{ q: string; a: string }> {
    const faqStart = html.indexOf('<h2>Frequently Asked Questions</h2>');
    if (faqStart === -1) return [];
    const faqSection = html.slice(faqStart);
    const pairs: Array<{ q: string; a: string }> = [];
    const h3Regex = /<h3>(.*?)<\/h3>\s*<p>(.*?)<\/p>/gs;
    let m;
    while ((m = h3Regex.exec(faqSection)) !== null) {
      pairs.push({
        q: m[1].replace(/<[^>]+>/g, '').trim(),
        a: m[2].replace(/<[^>]+>/g, '').trim(),
      });
    }
    return pairs;
  }

  const faqs = extractFaqs(post.content);
  const faqSchema = faqs.length > 0 && !post.draft ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/blog/${post.slug}#faq`,
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  } : null;

  return (
    <>
      {/*
        JSON-LD — server-rendered at build time, zero JS cost.
        JsonLd escapes `<` as `\u003c` preventing HTML-parser from
        prematurely closing the <script> block.
      */}
      <JsonLd data={[breadcrumbSchema, articleSchema, faqSchema].filter(Boolean) as object[]} idPrefix={`blog-${post.slug}`} />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(24px, 5vw, 60px) clamp(16px, 4vw, 32px)' }}>

        {/* ── DRAFT BANNER (only visible for draft posts) ── */}
        {post.draft && (
          <div style={{ background: '#fef3c7', border: '2px solid #f59e0b', borderRadius: 12, padding: '12px 18px', marginBottom: 28, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
            <div>
              <strong style={{ fontSize: 13, fontWeight: 800, color: '#92400e', display: 'block', marginBottom: 2 }}>
                DRAFT — Not Published
              </strong>
              <span style={{ fontSize: 12, color: '#78350f', lineHeight: 1.5 }}>
                This article is a draft placeholder. Content is not final. This page has <code>noindex</code> and will not appear in Google search results.
              </span>
            </div>
          </div>
        )}

        {/* ── Breadcrumb ── */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: 24 }}>
          <ol style={{ display: 'flex', gap: 6, alignItems: 'center', listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: 'var(--text3)', flexWrap: 'wrap' }}>
            <li><Link href="/" style={{ color: 'var(--brand)', textDecoration: 'none', fontWeight: 600 }}>Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/blog" style={{ color: 'var(--brand)', textDecoration: 'none', fontWeight: 600 }}>Blog</Link></li>
            <li aria-hidden="true">/</li>
            <li style={{ color: 'var(--text2)' }} aria-current="page">{post.title}</li>
          </ol>
        </nav>

        {/* ── Article Header ── */}
        <header style={{ marginBottom: 36 }}>
          {/* Category badge */}
          {catMeta && (
            <div style={{ marginBottom: 14 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand)', background: 'var(--brand-l)', padding: '4px 12px', borderRadius: 100 }}>
                {catMeta.icon} {catMeta.name}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 style={{ fontFamily: 'var(--font-hd)', fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 900, color: 'var(--text)', lineHeight: 1.25, letterSpacing: '-.03em', marginBottom: 16 }}>
            {post.title}
          </h1>

          {/* Meta row */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', fontSize: 13, color: 'var(--text3)' }}>
            <span>By <strong style={{ color: 'var(--text2)' }}>{post.author}</strong></span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </time>
            <span aria-hidden="true">·</span>
            <span>{readingTime} min read</span>
            {post.updatedAt && post.updatedAt !== post.publishedAt && (
              <>
                <span aria-hidden="true">·</span>
                <span>Updated <time dateTime={post.updatedAt}>{new Date(post.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time></span>
              </>
            )}
          </div>
        </header>

        {/* ── Article Body ── */}
        <article
          className="blog-content"
          style={{
            fontSize: 16,
            lineHeight: 1.75,
            color: 'var(--text)',
            marginBottom: 48,
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* ── Tags ── */}
        {post.tags.length > 0 && (
          <div style={{ marginBottom: 40, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginRight: 10 }}>Tags:</span>
            {post.tags.map((tag) => (
              <span key={tag} style={{ display: 'inline-block', fontSize: 12, padding: '3px 10px', borderRadius: 100, background: 'var(--surf2)', border: '1px solid var(--border)', color: 'var(--text2)', marginRight: 6, marginBottom: 6 }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* ── Related Calculators (Internal Links) ── */}
        {relatedCalcs.length > 0 && (
          <section aria-label="Related calculators" style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-hd)', fontSize: 18, fontWeight: 800, color: 'var(--text)', letterSpacing: '-.02em', marginBottom: 16 }}>
              🧮 Try These Free Calculators
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {relatedCalcs.map((calc) => calc && (
                <Link
                  key={calc.slug}
                  href={`/calculator/${calc.slug}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                    background: 'var(--surface)', border: '1.5px solid var(--border)',
                    borderRadius: 14, textDecoration: 'none', color: 'inherit',
                    transition: 'border-color .15s, transform .15s',
                  }}
                >
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{calc.icon ?? '🧮'}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>{calc.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--brand)', fontWeight: 600, marginTop: 2 }}>Free Calculator →</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Navigation ── */}
        <div style={{ paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/blog" style={{ padding: '10px 20px', background: 'var(--surf2)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-lg)', fontWeight: 700, fontSize: 14, color: 'var(--text)', textDecoration: 'none' }}>
            ← Back to Blog
          </Link>
          <Link href="/calculators" style={{ padding: '10px 20px', background: 'var(--brand)', color: '#fff', borderRadius: 'var(--r-lg)', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
            All Calculators →
          </Link>
        </div>
      </div>
    </>
  );
}
