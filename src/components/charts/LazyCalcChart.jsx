'use client';
/**
 * LazyCalcChart.jsx
 *
 * PERFORMANCE: Recharts + core-js = 388KB. We only need charts on calculator
 * pages, never on the home page. Use React.lazy so the 388KB chunk is only
 * downloaded when a calculator with charts is first rendered.
 */
import { Suspense, lazy } from 'react';

const CalcChartInner = lazy(() =>
  import('./CalcChart').then(m => ({ default: m.CalcChart }))
);

function ChartSkeleton() {
  return (
    <div style={{
      height: 260,
      borderRadius: 12,
      background: 'var(--surf2)',
      border: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text3)',
      fontSize: 13,
      fontWeight: 600,
    }}>
      Loading chart…
    </div>
  );
}

export function LazyCalcChart({ chartData }) {
  if (!chartData) return null;
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <CalcChartInner chartData={chartData} />
    </Suspense>
  );
}

// Backward-compatible alias — existing code imports { CalcChart } from this file
export const CalcChart = LazyCalcChart;
