/**
 * app/home-client.tsx
 *
 * SSR-enabled home page shell.
 *
 * LCP FIX: When `skipHero` is true, the Home component skips rendering
 * the hero section (it's already server-rendered in page.tsx for instant LCP).
 */
'use client';

import Home from '@/views/Home';

export default function HomePageClient({ skipHero }: { skipHero?: boolean }) {
  // @ts-expect-error - Home is a .jsx file without prop types
  return <Home skipHero={skipHero} />;
}
