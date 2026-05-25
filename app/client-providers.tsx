/**
 * app/client-providers.tsx
 *
 * Bundles all client-side providers and the app shell (Navbar, Footer, ScrollToTop)
 * into a single 'use client' component. This keeps the root layout a Server Component
 * while delegating all interactive global logic here.
 */
'use client';

import { Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { ScrollToTop } from '@/components/ui/ScrollToTop';

// Defer Analytics — loads after page is interactive, doesn't affect LCP/FCP
const Analytics = lazy(() =>
  import('@vercel/analytics/react').then(m => ({ default: m.Analytics }))
);


export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main style={{ minHeight: '100vh' }}>
        <Suspense>
          {children}
        </Suspense>
      </main>
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 600,
          },
        }}
      />
      {/* Analytics deferred — doesn't affect performance scores */}
      <Suspense fallback={null}>
        <Analytics />
      </Suspense>
    </>
  );
}
