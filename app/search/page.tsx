/**
 * app/search/page.tsx
 * Dedicated search results page — shareable, bookmarkable, crawlable.
 */
import type { Metadata } from 'next';
import SearchClient from './search-client';

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const q = params?.q || '';
  return {
    title: q ? `"${q}" — Calculator Search` : 'Search Calculators',
    description: q
      ? `Search results for "${q}" — find the right free calculator from 200+ tools on Calculators Point.`
      : 'Search 200+ free online calculators for finance, health, math, and everyday use.',
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialQuery = params?.q || '';
  return (
    <main id="main-content">
      <SearchClient initialQuery={initialQuery} />
    </main>
  );
}
