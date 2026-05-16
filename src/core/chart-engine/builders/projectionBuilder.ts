import { NormalizedDataset, DataPoint } from '../types/dataset';

interface ProjectionParams {
  id: string;
  schedule: Array<{ period: string | number, primary: number, secondary?: number, tertiary?: number, balance?: number }>;
  labels: { primary: string, secondary?: string, tertiary?: string, balance?: string };
  colors: { primary: string, secondary?: string, tertiary?: string, balance?: string };
}

export function buildProjectionChart({ id, schedule, labels, colors }: ProjectionParams): NormalizedDataset {
  // Downsample logic to prevent rendering blockages if array > 300 points
  const MAX_POINTS = 300;
  const step = schedule.length > MAX_POINTS ? Math.ceil(schedule.length / MAX_POINTS) : 1;
  
  const sampled = schedule.filter((_, i) => i % step === 0 || i === schedule.length - 1);

  const points: DataPoint[] = sampled.map(item => ({
    x: item.period,
    yValues: {
      primary: item.primary,
      ...(item.secondary !== undefined && { secondary: item.secondary }),
      ...(item.tertiary !== undefined && { tertiary: item.tertiary }),
      ...(item.balance !== undefined && { balance: item.balance })
    }
  }));

  const startBal = schedule[0]?.balance || schedule[0]?.primary || 0;
  const endBal = schedule[schedule.length - 1]?.balance || schedule[schedule.length - 1]?.primary || 0;
  const trend = endBal > startBal ? "grows" : "decreases";

  return {
    id,
    type: 'projection',
    points,
    metadata: {
      xAxisLabel: "Time Period",
      yAxisLabel: "Amount",
      seriesSpecs: {
        primary: { name: labels.primary, color: colors.primary, type: 'area', stackId: 'stack' },
        ...(labels.secondary && { secondary: { name: labels.secondary, color: colors.secondary || '#94a3b8', type: 'area', stackId: 'stack' } }),
        ...(labels.tertiary && { tertiary: { name: labels.tertiary, color: colors.tertiary || '#f87171', type: 'area', stackId: 'stack' } }),
        ...(labels.balance && { balance: { name: labels.balance, color: colors.balance || '#cbd5e1', type: 'line', isOverlay: true } })
      },
      formatters: {
        y: (val: number) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(val)
      },
      semanticSummary: `Projection chart from period ${schedule[0]?.period} to ${schedule[schedule.length - 1]?.period}. The total value ${trend} from ${startBal} to ${endBal}.`
    }
  };
}
