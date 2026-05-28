'use client';
import dynamic from 'next/dynamic';
const SEOLandingPage = dynamic(() => import('@/views/SEOLandingPage'));
export default function SEOLandingClient({ slug }: { slug: string }) {
  return <SEOLandingPage slug={slug} />;
}
