import React, { Suspense } from 'react';
import { NormalizedDataset } from '../types/dataset';

// Lazy load the adapter to split Recharts completely out of the main bundle
const LazyRechartsAdapter = React.lazy(() => 
  import('../adapters/RechartsAdapter').then(module => ({ default: module.RechartsAdapter }))
);

interface Props {
  dataset: NormalizedDataset;
  isExportMode?: boolean;
}

export function ProjectionChart({ dataset, isExportMode = false }: Props) {
  if (!dataset || dataset.points.length === 0) {
    return (
      <div className="w-full h-[350px] flex items-center justify-center bg-[var(--surface2)] rounded-lg border border-dashed border-[var(--border)]">
        <p className="text-[var(--text3)] text-sm">No visualization data available</p>
      </div>
    );
  }

  // Suspense acts as the lazy rendering boundary and performance barrier
  return (
    <Suspense fallback={
      <div className="w-full h-[350px] animate-pulse bg-[var(--surface2)] rounded-lg"></div>
    }>
      <LazyRechartsAdapter dataset={dataset} isExportMode={isExportMode} />
    </Suspense>
  );
}
