/**
 * app/not-found.tsx — Custom 404 Page
 */
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found | CalculatorsPoint',
  description: "Sorry, this page doesn't exist. Browse our 180+ free calculators.",
};

export default function NotFound() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 80, marginBottom: 16 }}>🧮</div>
      <h1 style={{
        fontFamily: 'var(--font-hd)',
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 900,
        color: 'var(--text)',
        letterSpacing: '-.03em',
        marginBottom: 12,
      }}>
        Page Not Found
      </h1>
      <p style={{ fontSize: 16, color: 'var(--text2)', marginBottom: 28, maxWidth: 420 }}>
        The page you&apos;re looking for doesn&apos;t exist. Maybe you were searching for a calculator?
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '11px 22px',
            background: 'var(--brand)',
            color: '#fff',
            borderRadius: 'var(--r-lg)',
            fontWeight: 700,
            fontSize: 14,
            textDecoration: 'none',
          }}
        >
          🏠 Go Home
        </Link>
        <Link
          href="/calculators"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '11px 22px',
            background: 'var(--surf2)',
            color: 'var(--text)',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--r-lg)',
            fontWeight: 700,
            fontSize: 14,
            textDecoration: 'none',
          }}
        >
          📊 All Calculators
        </Link>
      </div>
    </div>
  );
}
