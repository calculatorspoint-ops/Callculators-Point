'use client';
/**
 * app/offline/page.tsx
 * PWA offline fallback page — shown when user has no network.
 */
export default function OfflinePage() {
  return (
    <main
      id="main-content"
      style={{
        minHeight: '80vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '40px 20px', textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 480 }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>📡</div>
        <h1 style={{
          fontSize: 'clamp(1.5rem,4vw,2.2rem)', fontWeight: 900,
          color: 'var(--text)', marginBottom: 12, letterSpacing: '-.03em',
        }}>
          You&apos;re Offline
        </h1>
        <p style={{ fontSize: 16, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 32 }}>
          No internet connection detected. Some calculators may still work from cache —
          try navigating to recently visited pages.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="/"
            style={{
              padding: '12px 28px', borderRadius: 12, background: 'var(--brand)',
              color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: 14,
              boxShadow: '0 4px 14px rgba(37,99,235,.35)',
            }}
          >
            Try Homepage
          </a>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 28px', borderRadius: 12,
              border: '1.5px solid var(--border)', background: 'var(--surface)',
              color: 'var(--text)', fontWeight: 700, cursor: 'pointer',
              fontSize: 14, fontFamily: 'var(--font)',
            }}
          >
            Retry Connection
          </button>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 32 }}>
          Popular calculators like EMI, BMI, and SIP are cached for offline use.
        </p>
      </div>
    </main>
  );
}
