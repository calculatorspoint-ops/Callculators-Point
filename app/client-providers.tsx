/**
 * app/client-providers.tsx
 *
 * Bundles all client-side providers and the app shell (Navbar, Footer, ScrollToTop)
 * into a single 'use client' component. This keeps the root layout a Server Component
 * while delegating all interactive global logic here.
 */
'use client';

import { Suspense, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { useAppStore } from '@/store/useAppStore';
import '@/i18n'; // Initialise i18next
import { Analytics } from '@vercel/analytics/react';

function ThemeSync() {
  const { theme } = useAppStore();
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  return null;
}

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeSync />
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
      <Analytics />
    </>
  );
}
