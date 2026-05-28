/**
 * app/category/[catId]/page.tsx — Category Pages (SSG)
 *
 * SEO improvements:
 * - Richer meta descriptions (140-160 chars, keyword-rich)
 * - Twitter card metadata
 * - Keywords
 * - BreadcrumbList + ItemList JSON-LD schema
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATEGORIES, ALL_CALCULATORS, BY_CATEGORY } from '@/data/calculatorConfigs';
import { CategoryPageClient } from './category-client';
import { SITE_URL } from '@/config/site';

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ catId: cat.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ catId: string }> }
): Promise<Metadata> {
  const { catId } = await params;
  const cat = CATEGORIES.find(c => c.id === catId);
  if (!cat) return { title: 'Category Not Found' };

  const count = ALL_CALCULATORS.filter(c => c.cat === catId && c.status !== 'coming-soon').length;

  // W3 fix: Stronger title with count signal — "20+ Free Finance Calculators Online"
  // The count adds specificity and intent signals Google rewards over generic titles.
  const title = `${count}+ Free ${cat.name} Calculators Online`;

  // Description: 140-160 chars, action-driven with keywords
  const description = `Use our ${count}+ free online ${cat.name.toLowerCase()} calculators for instant, accurate results. Interactive charts and step-by-step formulas. 100% free, no signup.`;


  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&icon=${encodeURIComponent(cat.icon)}&cat=Category`;

  return {
    title,
    description,

    alternates: { canonical: `${SITE_URL}/category/${catId}` },
    openGraph: {
      title: `${cat.name} Calculators | Calculators Point`,
      description,
      url: `${SITE_URL}/category/${catId}`,
      type: 'website',
      siteName: 'Calculators Point',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cat.name} Calculators | Calculators Point`,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ catId: string }>;
}) {
  const { catId } = await params;
  const cat = CATEGORIES.find(c => c.id === catId);
  if (!cat) notFound();

  const calcs = (BY_CATEGORY[catId] ?? []).filter(c => c.status !== 'coming-soon');
  const pageUrl = `${SITE_URL}/category/${catId}`;

  // BreadcrumbList schema
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${SITE_URL}/calculators` },
      { '@type': 'ListItem', position: 3, name: cat.name, item: pageUrl },
    ],
  };

  // ItemList schema — lists every calculator in this category for Google
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${cat.name} Calculators`,
    description: cat.desc,
    url: pageUrl,
    numberOfItems: calcs.length,
    itemListElement: calcs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      description: c.desc,
      url: `${SITE_URL}/calculator/${c.slug}`,
    })),
  };

  return (
    <>
      {/* JSON-LD Schema — server-rendered for Googlebot */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />

      {/* Category page content */}
      <CategoryPageClient catId={catId} />
    </>
  );
}
