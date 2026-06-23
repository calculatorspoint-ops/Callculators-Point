/**
 * app/category/[catId]/loading.tsx
 * Skeleton shown while a category page loads.
 */
export default function CategoryLoading() {
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(20px,3vw,40px) 20px' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg,#0a0e25,#1e2d6e)',
        borderRadius: 20, padding: 'clamp(24px,4vw,36px)', marginBottom: 28,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="skeleton" style={{ width: 54, height: 54, borderRadius: 16, flexShrink: 0, background: 'rgba(255,255,255,.15)' }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ height: 26, width: '40%', borderRadius: 8, marginBottom: 10, background: 'rgba(255,255,255,.15)' }} />
            <div className="skeleton" style={{ height: 14, width: '62%', borderRadius: 6, background: 'rgba(255,255,255,.1)' }} />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 14 }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 16, padding: 18, display: 'flex', gap: 12 }}
          >
            <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: 14, width: '72%', borderRadius: 6, marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 11, width: '88%', borderRadius: 5 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
