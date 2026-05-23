import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { Navbar } from './components/ui/Navbar';
import { Footer } from './components/ui/Footer';
import { PWAInstallPrompt } from './core/pwa-engine/PWAInstallPrompt';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { initGeoDetection } from './core/geo-engine/geoStore.js';
import { FloatingRegionSwitcher } from './core/geo-engine/FloatingRegionSwitcher';
import { Analytics } from '@vercel/analytics/react';

// ── Lazily-loaded pages (code splitting per route) ────────────────────
const Home           = lazy(() => import('./pages/Home'));
const AllCalculators = lazy(() => import('./pages/AllCalculators'));
const Calculator     = lazy(() => import('./pages/Calculator'));
const Category       = lazy(() => import('./pages/Category'));
const About          = lazy(() => import('./pages/About'));
const Contact        = lazy(() => import('./pages/Contact'));
const PrivacyPolicy  = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Disclaimer     = lazy(() => import('./pages/Disclaimer'));
const Sitemap        = lazy(() => import('./pages/Sitemap'));
const SEOLandingPage = lazy(() => import('./pages/SEOLandingPage'));
const EcosystemHub   = lazy(() => import('./pages/EcosystemHub'));

// ── Inline page loader (avoids importing a heavy component) ───────────
function PageLoader() {
  return (
    <div
      aria-label="Loading page"
      role="status"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh', flexDirection: 'column', gap: 16,
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        border: '3px solid var(--border)',
        borderTopColor: 'var(--brand)',
        animation: 'spin 0.7s linear infinite',
      }} />
      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text3)', margin: 0 }}>
        Loading…
      </p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export default function App() {
  // Bootstrap geo-localisation once on mount
  useEffect(() => {
    // Migrate: clear the old v2 key so users aren't stuck on stale data
    try { localStorage.removeItem('CalcPoint-geo-v2'); } catch { /* ignore */ }
    // Start geo detection
    initGeoDetection();
  }, []);

  return (
    <div className="app-root" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }} id="main-content">
        <ScrollToTop />
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/"                     element={<Home />} />
              <Route path="/calculators"           element={<AllCalculators />} />
              <Route path="/calculator/:slug"      element={<Calculator />} />
              <Route path="/category/:catId"       element={<Category />} />
              <Route path="/about"                 element={<About />} />
              <Route path="/contact"               element={<Contact />} />
              <Route path="/privacy-policy"        element={<PrivacyPolicy />} />
              <Route path="/terms-of-service"      element={<TermsOfService />} />
              <Route path="/disclaimer"            element={<Disclaimer />} />
              <Route path="/sitemap"               element={<Sitemap />} />
              <Route path="/tools/:slug"            element={<SEOLandingPage />} />
              <Route path="/ecosystem/:id"          element={<EcosystemHub />} />
              <Route path="*"                      element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <PWAInstallPrompt />
      <FloatingRegionSwitcher position="bottom-left" />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--surface)',
              color: 'var(--text)',
              border: '1.5px solid var(--border)',
              borderRadius: 'var(--r-lg)',
              fontSize: 13,
              fontWeight: 600,
            },
          }}
        />
        <Analytics />
      </div>
    );
  }
