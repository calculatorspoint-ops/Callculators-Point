export interface NormalizedDataset {
  id: string;
  type: 'time-series' | 'distribution' | 'comparison' | 'projection';
  points: DataPoint[];
  metadata: DatasetMetadata;
}

export interface DataPoint {
  x: string | number;
  yValues: Record<string, number>;
  confidenceIntervals?: Record<string, [number, number]>;
  annotations?: string[];
}

export interface DatasetMetadata {
  xAxisLabel: string;
  yAxisLabel: string;
  seriesSpecs: Record<string, SeriesSpec>;
  formatters: {
    x?: (val: any) => string;
    y?: (val: any) => string;
  };
  semanticSummary: string;
}

export interface SeriesSpec {
  name: string;
  color: string;
  type: 'line' | 'bar' | 'area' | 'scatter';
  stackId?: string;
  isOverlay?: boolean;
}
