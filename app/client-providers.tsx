/**
 * app/client-providers.tsx
 *
 * Bundles all client-side providers and the app shell (Navbar, Footer, ScrollToTop)
 * into a single 'use client' component. This keeps the root layout a Server Component
 * while delegating all interactive global logic here.
 *
 * HYDRATION FIX: useAppStore uses skipHydration:true so Zustand does NOT read
 * localStorage during SSR. We call rehydrate() here after mount so both the
 * initial server HTML and client first render use the same default values.
 */
'use client';

import { Suspense, lazy, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navbar } from '@/components/ui/Navbar';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useAppStore } from '@/store/useAppStore';

// Defer below-fold components until after the page is interactive.
// This removes them from the critical JS parse path, improving TBT and TTI.
const Footer = lazy(() =>
  import('@/components/ui/Footer').then(m => ({ default: m.Footer }))
);
const CookieConsent = lazy(() =>
  import('@/components/ui/CookieConsent').then(m => ({ default: m.CookieConsent }))
);
const ScrollToTop = lazy(() =>
  import('@/components/ui/ScrollToTop').then(m => ({ default: m.ScrollToTop }))
);

// Defer Analytics — loads after page is interactive, doesn't affect LCP/FCP
const Analytics = lazy(() =>
  import('@vercel/analytics/react').then(m => ({ default: m.Analytics }))
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Rehydrate Zustand from localStorage AFTER mount.
    // Since skipHydration:true, the store starts with defaults on both server
    // and client — no mismatch. This call reads localStorage and triggers a
    // re-render with the persisted values (theme, currency, favorites, etc.)
    useAppStore.persist.rehydrate();

    // Subscribe to sync dark class after rehydration
    const unsub = useAppStore.subscribe(state => {
      document.documentElement.classList.toggle('dark', state.theme === 'dark');
    });

    // Apply immediately after rehydrate
    const theme = useAppStore.getState().theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');

    return unsub;
  }, []);

  return (
    <>
      {/* ScrollToTop: lazy — no visual impact until user scrolls */}
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
      <Navbar />
      <main style={{ minHeight: '100vh' }}>
        <ErrorBoundary>
          <Suspense>
            {children}
          </Suspense>
        </ErrorBoundary>
      </main>
      {/* Footer: lazy — always below fold, no impact on FCP/LCP */}
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      {/* CookieConsent: lazy — non-critical UI, can load after paint */}
      <Suspense fallback={null}>
        <CookieConsent />
      </Suspense>
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
