/**
 * app/calculators/loading.tsx
 * Skeleton shown while the All Calculators page hydrates.
 */
export default function CalculatorsLoading() {
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(20px,3vw,40px) 20px' }}>
      {/* Header skeleton */}
      <div className="skeleton" style={{ height: 44, width: '38%', borderRadius: 12, marginBottom: 16 }} />
      <div className="skeleton" style={{ height: 18, width: '55%', borderRadius: 8, marginBottom: 32 }} />

      {/* Search bar skeleton */}
      <div className="skeleton" style={{ height: 52, width: '100%', borderRadius: 14, marginBottom: 28 }} />

      {/* Grid skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 16, padding: 18 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <div className="skeleton" style={{ width: 46, height: 46, borderRadius: 12, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ height: 14, width: '70%', borderRadius: 6, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 11, width: '90%', borderRadius: 5 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
