/**
 * app/category/[catId]/page.tsx — Category Pages (SSG)
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATEGORIES, ALL_CALCULATORS } from '@/data/calculatorConfigs';
import { CategoryPageClient } from './category-client';

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ catId: cat.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ catId: string }> }
): Promise<Metadata> {
  const { catId } = await params;
  const cat = CATEGORIES.find(c => c.id === catId);
  if (!cat) return { title: 'Category Not Found' };

  const count = ALL_CALCULATORS.filter(c => c.cat === catId).length;
  const title = `${cat.name} Calculators — ${count} Free Tools`;
  const description = `${count} free ${cat.name.toLowerCase()} calculators. Fast, accurate, and always free.`;

  return {
    title,
    description,
    alternates: { canonical: `https://calculatorspoint.com/category/${catId}` },
    openGraph: { title, description, url: `https://calculatorspoint.com/category/${catId}` },
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
  return <CategoryPageClient catId={catId} />;
}
