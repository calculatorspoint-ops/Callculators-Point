/**
 * app/calculator/[slug]/loading.tsx
 * Skeleton shown while a calculator page loads.
 */
export default function CalculatorLoading() {
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(16px,3vw,36px) 20px' }}>
      {/* Page hero */}
      <div style={{
        background: 'linear-gradient(135deg,#0a0e25,#1e2d6e)',
        borderRadius: 20, padding: 'clamp(20px,4vw,36px)', marginBottom: 24,
      }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div className="skeleton" style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0, background: 'rgba(255,255,255,.15)' }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ height: 26, width: '48%', borderRadius: 8, marginBottom: 12, background: 'rgba(255,255,255,.15)' }} />
            <div className="skeleton" style={{ height: 14, width: '75%', borderRadius: 6, background: 'rgba(255,255,255,.1)' }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        {/* Calculator card */}
        <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 20, padding: 28 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <div className="skeleton" style={{ height: 13, width: 110, borderRadius: 6, marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 46, width: '100%', borderRadius: 10 }} />
            </div>
          ))}
          <div className="skeleton" style={{ height: 50, width: '100%', borderRadius: 12, marginTop: 8 }} />
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 16, padding: 20 }}>
            <div className="skeleton" style={{ height: 14, width: '60%', borderRadius: 6, marginBottom: 14 }} />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 36, borderRadius: 8, marginBottom: 8 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
