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

const BASE_URL = 'https://calculatorspoint.com';

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

  // Title: "[Category] Calculators - Free Online Tools | Calculators Point"
  const title = `${cat.name} Calculators - ${count} Free Online Tools`;

  // Description: 140-160 chars, action-driven with keywords
  const description = `Explore ${count} free ${cat.name.toLowerCase()} calculators. ${cat.desc} All tools are 100% free, mobile-friendly, with formulas and step-by-step results.`;

  const keywords = [
    `${cat.name.toLowerCase()} calculator`,
    `free ${cat.name.toLowerCase()} calculators`,
    `online ${cat.name.toLowerCase()} tools`,
    cat.name,
    'free calculators',
    'online calculator',
    'Calculators Point',
  ];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `${BASE_URL}/category/${catId}` },
    openGraph: {
      title: `${cat.name} Calculators | Calculators Point`,
      description,
      url: `${BASE_URL}/category/${catId}`,
      type: 'website',
      siteName: 'Calculators Point',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cat.name} Calculators | Calculators Point`,
      description,
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
  const pageUrl = `${BASE_URL}/category/${catId}`;

  // BreadcrumbList schema
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: `${BASE_URL}/calculators` },
      { '@type': 'ListItem', position: 3, name: `${cat.name} Calculators`, item: pageUrl },
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
      url: `${BASE_URL}/calculator/${c.slug}`,
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
