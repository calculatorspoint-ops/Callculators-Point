import React from 'react';
import { 
  ResponsiveContainer, ComposedChart, Area, Line, Bar, 
  XAxis, YAxis, Tooltip, CartesianGrid, Legend 
} from 'recharts';
import { NormalizedDataset } from '../types/dataset';

interface AdapterProps {
  dataset: NormalizedDataset;
  isExportMode?: boolean;
}

export function RechartsAdapter({ dataset, isExportMode = false }: AdapterProps) {
  const { points, metadata } = dataset;
  
  // Formatters
  const formatX = metadata.formatters.x || ((v: any) => String(v));
  const formatY = metadata.formatters.y || ((v: any) => String(v));

  // If exporting to PDF/PNG, disable responsive wrapper to prevent DOM layout issues
  const width = isExportMode ? 800 : "100%";
  const height = isExportMode ? 400 : 350;

  const ChartBody = (
    <ComposedChart data={points} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
      <XAxis 
        dataKey="x" 
        tickFormatter={formatX} 
        tick={{ fontSize: 12, fill: "var(--text3)" }}
        axisLine={false}
        tickLine={false}
      />
      <YAxis 
        tickFormatter={formatY} 
        tick={{ fontSize: 12, fill: "var(--text3)" }}
        axisLine={false}
        tickLine={false}
        width={60}
      />
      {!isExportMode && (
        <Tooltip 
          formatter={(value: any) => [formatY(value), '']}
          labelFormatter={formatX}
          contentStyle={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", borderRadius: "8px", color: "var(--text)" }}
          itemStyle={{ fontWeight: 600 }}
        />
      )}
      <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px", color: "var(--text2)" }} />
      
      {Object.entries(metadata.seriesSpecs).map(([key, spec]) => {
        const dataKey = `yValues.${key}`;
        if (spec.type === 'area') {
          return (
            <Area 
              key={key} 
              type="monotone" 
              dataKey={dataKey} 
              name={spec.name} 
              stroke={spec.color} 
              fill={spec.color} 
              fillOpacity={0.2}
              stackId={spec.stackId}
              isAnimationActive={!isExportMode}
            />
          );
        }
        if (spec.type === 'line') {
          return (
            <Line 
              key={key} 
              type="monotone" 
              dataKey={dataKey} 
              name={spec.name} 
              stroke={spec.color} 
              strokeWidth={2}
              dot={false}
              isAnimationActive={!isExportMode}
            />
          );
        }
        if (spec.type === 'bar') {
          return (
            <Bar 
              key={key} 
              dataKey={dataKey} 
              name={spec.name} 
              fill={spec.color} 
              stackId={spec.stackId}
              isAnimationActive={!isExportMode}
            />
          );
        }
        return null;
      })}
    </ComposedChart>
  );

  return (
    <div className="relative w-full chart-engine-container">
      {/* Semantic Summary for Screen Readers (A11y) */}
      <div className="sr-only" aria-live="polite">
        {metadata.semanticSummary}
      </div>
      
      {isExportMode ? (
        <div style={{ width: width as number, height: height as number }}>{ChartBody}</div>
      ) : (
        <div aria-hidden="true">
          <ResponsiveContainer width={width} height={height}>
            {ChartBody}
          </ResponsiveContainer>
        </div>
      )}

      {/* Full Data Table for Screen Readers (A11y WCAG Compliance) */}
      <table className="sr-only" aria-label="Chart Data">
        <thead>
          <tr>
            <th scope="col">{metadata.xAxisLabel || 'X-Axis'}</th>
            {Object.values(metadata.seriesSpecs).map(spec => (
              <th key={spec.name} scope="col">{spec.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {points.map((pt, i) => (
            <tr key={i}>
              <td>{formatX(pt.x)}</td>
              {Object.keys(metadata.seriesSpecs).map(key => (
                <td key={key}>{formatY((pt.yValues as any)[key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
