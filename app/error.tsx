'use client';
/**
 * app/error.tsx — Root-level error boundary for Next.js App Router.
 *
 * Next.js App Router requires a Client Component 'error.tsx' at each
 * route segment to catch server component errors. Without this, any
 * server component throw propagates all the way up to the nearest
 * error.tsx — if none exists, Next.js shows an unformatted error page.
 *
 * Q7 fix: This root error.tsx catches errors from all app routes.
 * Additional error.tsx files in /calculator/[slug] and /category/[catId]
 * provide more specific recovery for those routes.
 */
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      console.error('[RootError]', error.digest, error.message);
    }
  }, [error]);

  return (
    <div
      style={{
        minHeight: '70vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '40px 20px',
      }}
      role="alert"
      aria-live="assertive"
    >
      <div style={{
        background: 'var(--surface)', border: '1.5px solid var(--border)',
        borderRadius: 20, padding: '40px 32px', maxWidth: 520, width: '100%',
        textAlign: 'center', boxShadow: '0 8px 32px rgba(15,23,42,.08)',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h1 style={{
          fontSize: 20, fontWeight: 800, color: 'var(--text)',
          marginBottom: 10, fontFamily: 'var(--font)',
        }}>
          Something went wrong
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
          This page encountered an unexpected error. Try again or return to the homepage.
        </p>
        {error.digest && (
          <p style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 20, fontFamily: 'var(--font-mono)' }}>
            Error ID: {error.digest}
          </p>
        )}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: '10px 24px', borderRadius: 12, background: 'var(--brand)',
              color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              border: 'none', fontFamily: 'var(--font)',
              boxShadow: '0 4px 14px rgba(37,99,235,.3)',
            }}
          >
            🔄 Try Again
          </button>
          <a
            href="/"
            style={{
              padding: '10px 24px', borderRadius: 12, background: 'var(--surface)',
              border: '1.5px solid var(--border)', color: 'var(--text2)',
              fontWeight: 700, fontSize: 14, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: 'var(--font)',
            }}
          >
            🏠 Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
