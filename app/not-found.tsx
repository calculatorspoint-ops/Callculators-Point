/**
 * app/not-found.tsx — Custom 404 Page
 * #10 audit fix: Full branded 404 with popular calculator suggestions
 * so users never land on a dead end — they're guided to useful tools.
 */
import Link from 'next/link';
import type { Metadata } from 'next';
import { CALC_COUNT_LABEL, POPULAR } from '@/data/calculatorConfigs';

export const metadata: Metadata = {
  title: '404 — Page Not Found | Calculators Point',
  description: `Sorry, this page doesn't exist. Browse our ${CALC_COUNT_LABEL} free calculators — finance, health, math, and more.`,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const suggestions = POPULAR.slice(0, 6);

  return (
    <main
      id="main-content"
      style={{
        minHeight: '80vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(40px, 8vw, 80px) 20px', textAlign: 'center',
      }}
    >
      {/* Big 404 number */}
      <div style={{
        fontSize: 'clamp(6rem, 20vw, 12rem)', fontWeight: 900, lineHeight: 1,
        fontFamily: 'var(--font-hd)', letterSpacing: '-.05em',
        background: 'linear-gradient(135deg, var(--brand), #7c3aed)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        backgroundClip: 'text', marginBottom: 8, userSelect: 'none',
      }}>
        404
      </div>

      <div style={{ fontSize: 52, marginBottom: 16 }}>🧮</div>

      <h1 style={{
        fontFamily: 'var(--font-hd)', fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
        fontWeight: 900, color: 'var(--text)', letterSpacing: '-.03em', marginBottom: 12,
      }}>
        Page Not Found
      </h1>

      <p style={{
        fontSize: 16, color: 'var(--text2)', marginBottom: 32,
        maxWidth: 480, lineHeight: 1.7,
      }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Maybe you were looking for one of our free calculators?
      </p>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 48 }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', background: 'var(--brand)', color: '#fff',
            borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(37,99,235,.35)', transition: 'all .15s',
          }}
        >
          🏠 Go Home
        </Link>
        <Link
          href="/calculators"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', background: 'var(--surface)',
            border: '1.5px solid var(--border)', color: 'var(--text)',
            borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: 'none',
          }}
        >
          📊 All Calculators
        </Link>
      </div>

      {/* Popular calculator suggestions */}
      {suggestions.length > 0 && (
        <div style={{ maxWidth: 680, width: '100%' }}>
          <p style={{
            fontSize: 12, fontWeight: 700, color: 'var(--text3)',
            textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14,
          }}>
            Popular Calculators
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 10,
          }}>
            {suggestions.map((calc) => (
              <Link
                key={calc.id}
                href={`/calculator/${calc.slug}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px',
                  background: 'var(--surface)', border: '1.5px solid var(--border)',
                  borderRadius: 12, textDecoration: 'none', transition: 'all .15s',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 20, flexShrink: 0 }}>{calc.icon || '🧮'}</span>
                <span style={{
                  fontSize: 12, fontWeight: 700, color: 'var(--text)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {calc.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
