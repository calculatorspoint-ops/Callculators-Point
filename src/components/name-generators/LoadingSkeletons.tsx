'use client';

export function LoadingSkeletons({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="ng-skeleton-card" aria-hidden="true">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="ng-skeleton ng-skeleton-title" />
            <div className="ng-skeleton ng-skeleton-badge" />
          </div>
          <div className="ng-skeleton ng-skeleton-line" />
          <div className="ng-skeleton ng-skeleton-line-sm" />
          <div className="ng-skeleton ng-skeleton-line" style={{ width: '80%' }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <div className="ng-skeleton ng-skeleton-actions" style={{ flex: 1 }} />
            <div className="ng-skeleton ng-skeleton-actions" style={{ flex: 1 }} />
            <div className="ng-skeleton ng-skeleton-actions" style={{ flex: 1 }} />
          </div>
        </div>
      ))}
    </>
  );
}
