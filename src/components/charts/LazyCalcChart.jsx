import React, { lazy, Suspense } from "react";

const AsyncCalcChart = lazy(() => 
  import("./CalcChart.jsx").then((module) => ({ default: module.CalcChart }))
);

export function CalcChart(props) {
  if (!props.chartData) return null;
  return (
    <Suspense fallback={<div style={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text3)", fontSize: 12, background: "var(--surface2)", borderRadius: "var(--r-xl)", border: "2px dashed var(--border)" }}>Loading Chart Data...</div>}>
      <AsyncCalcChart {...props} />
    </Suspense>
  );
}
