'use client';

/**
 * app/hero-calc-widget.tsx
 *
 * Client boundary wrapper for the QuickCalc widget used inside the
 * server-rendered HeroSection. Using a separate file keeps page.tsx as a
 * pure server component while still allowing the interactive calculator to
 * be embedded in the hero.
 */

import { Suspense, lazy } from 'react';

const QuickCalc = lazy(() =>
  import('@/components/ui/QuickCalc').then(m => ({ default: m.QuickCalc }))
);

function CalcSkeleton() {
  return (
    <div
      style={{
        width: 300,
        height: 420,
        borderRadius: 20,
        background: 'rgba(15,23,42,.92)',
        border: '1.5px solid rgba(255,255,255,.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: '3px solid rgba(255,255,255,.1)',
          borderTopColor: '#6366f1',
          borderRadius: '50%',
          animation: '_spin .7s linear infinite',
        }}
      />
    </div>
  );
}

export default function HeroCalcWidget() {
  return (
    <Suspense fallback={<CalcSkeleton />}>
      <QuickCalc />
    </Suspense>
  );
}
