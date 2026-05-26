/**
 * app/category/[catId]/category-client.tsx — Client component for Category pages
 *
 * SSR is now ENABLED (ssr: true is the default) so Googlebot can crawl and
 * index the full category page content including H1, calculator list, and intro.
 */
'use client';

import dynamic from 'next/dynamic';

// ssr: true (default) — Googlebot sees the full rendered HTML
const Category = dynamic(() => import('@/views/Category'));

export function CategoryPageClient({ catId }: { catId: string }) {
  return <Category />;
}
