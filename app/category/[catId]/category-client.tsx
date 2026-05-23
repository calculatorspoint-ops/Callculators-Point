/**
 * app/category/[catId]/category-client.tsx — Client component for Category pages
 */
'use client';

import dynamic from 'next/dynamic';

const Category = dynamic(() => import('@/views/Category'), { ssr: false });

export function CategoryPageClient({ catId }: { catId: string }) {
  // The existing Category.jsx page uses useParams() internally.
  // We render it as a client component; it will read its own URL params.
  return <Category />;
}
