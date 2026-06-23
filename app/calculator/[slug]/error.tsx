'use client';
/**
 * app/calculator/[slug]/error.tsx
 * Route-specific error boundary for individual calculator pages.
 * Shows a targeted recovery UI if a calculator fails to render.
 */
interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CalculatorError({ error, reset }: ErrorProps) {
  return (
    <div style={{
      maxWidth: 600, margin: '80px auto', padding: '0 20px', textAlign: 'center',
    }} role="alert">
      <div style={{ fontSize: 48, marginBottom: 16 }}>🧮</div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 10 }}>
        Calculator failed to load
      </h1>
      <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
        This calculator encountered an error. You can try again or browse other tools.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={reset}
          style={{
            padding: '10px 24px', borderRadius: 12, background: 'var(--brand)',
            color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer',
            fontSize: 14, fontFamily: 'var(--font)',
          }}
        >
          🔄 Try Again
        </button>
        <a
          href="/calculators"
          style={{
            padding: '10px 24px', borderRadius: 12, background: 'var(--surface)',
            border: '1.5px solid var(--border)', color: 'var(--text2)',
            fontWeight: 700, fontSize: 14, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', fontFamily: 'var(--font)',
          }}
        >
          Browse All Tools
        </a>
      </div>
      {error.digest && (
        <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 20, fontFamily: 'var(--font-mono)' }}>
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}
