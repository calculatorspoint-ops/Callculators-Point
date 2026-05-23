/**
 * app/home-client.tsx
 *
 * Wraps the existing Home.jsx as a client component.
 * All hooks (useState, useEffect, etc.) live in Home.jsx, so we
 * need 'use client' here.
 */
'use client';

import dynamic from 'next/dynamic';

// Lazy-load the existing Home page (heavy component)
const Home = dynamic(() => import('@/views/Home'), { ssr: false });

export default function HomePageClient() {
  return <Home />;
}
