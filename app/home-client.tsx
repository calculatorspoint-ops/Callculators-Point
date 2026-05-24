/**
 * app/home-client.tsx
 *
 * SSR-enabled home page shell.
 *
 * WHY: Previously used `dynamic(..., { ssr: false })` which made the entire
 * page blank until JavaScript hydrated (causing 2,380ms LCP element delay).
 * Now we import Home directly so Next.js can server-render the full HTML,
 * including the hero with <p class="hero-sub"> which is the LCP element.
 */
'use client';

import Home from '@/views/Home';

export default function HomePageClient() {
  return <Home />;
}
