'use client';
/**
 * LazyCalcChart.jsx
 *
 * PERFORMANCE: Recharts + d3 sub-packages ≈ 60–120 KB gzipped.
 * Strategy:
 *   1. next/dynamic with ssr:false → chart chunk is never included in the SSR bundle.
 *   2. IntersectionObserver → chart is only *requested* once the container enters the
 *      viewport (or after results render), so users on mobile never download it unless
 *      they scroll to the chart area.
 *   3. Animated skeleton → stable reserved height prevents CLS while chart loads.
 */
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

/* ── Dynamic import: SSR disabled, Recharts is never in the server bundle ── */
const CalcChartInner = dynamic(
  () => import('./CalcChart').then(m => ({ default: m.CalcChart })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

/* ── Animated skeleton — matches chart height, prevents CLS ─────────────── */
function ChartSkeleton() {
  return (
    <div
      role="status"
      aria-label="Chart loading"
      style={{
        height: 260,
        borderRadius: 12,
        background: 'var(--surf2, #f1f5f9)',
        border: '1px solid var(--border, #e2e8f0)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Shimmer sweep */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
          animation: 'chartShimmer 1.6s ease-in-out infinite',
        }}
      />
      {/* Bar placeholders */}
      <div aria-hidden="true" style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100 }}>
        {[60, 85, 45, 95, 70, 55, 80, 65, 90, 50].map((h, i) => (
          <div
            key={i}
            style={{
              width: 18,
              height: h,
              borderRadius: '4px 4px 0 0',
              background: `rgba(67,97,238,${0.12 + i * 0.025})`,
            }}
          />
        ))}
      </div>
      <span style={{ color: 'var(--text3, #94a3b8)', fontSize: 12, fontWeight: 600, position: 'relative' }}>
        Loading chart…
      </span>
      <style>{`
        @keyframes chartShimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}

/**
 * LazyCalcChart
 *
 * Renders nothing until the container enters the viewport (rootMargin 300px).
 * This means Recharts is only downloaded when the user can actually see the chart
 * — or is about to. Calculator inputs/results above the chart remain fast.
 *
 * @param {object} chartData  — same shape as CalcChart expects
 * @param {boolean} [eager]   — set true to skip the IntersectionObserver and load immediately
 */
export function LazyCalcChart({ chartData, eager = false }) {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(eager);

  useEffect(() => {
    if (eager || !chartData) return;

    // Already visible — nothing to observe
    if (visible) return;

    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px' } // trigger 300 px before entering viewport
    );

    io.observe(el);
    return () => io.disconnect();
  }, [eager, chartData, visible]);

  if (!chartData) return null;

  return (
    <div ref={containerRef}>
      {visible ? (
        <CalcChartInner chartData={chartData} />
      ) : (
        <ChartSkeleton />
      )}
    </div>
  );
}

// Backward-compatible alias — existing code that does `import { CalcChart } from './LazyCalcChart'`
// continues to work without any changes.
export const CalcChart = LazyCalcChart;
