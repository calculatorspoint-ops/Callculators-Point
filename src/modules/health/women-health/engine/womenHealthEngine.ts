/**
 * Women's Health Calculation Engine
 * Covers: Period, Ovulation, Fertility Window, Implantation, Due Date
 */

export interface CycleInput {
  lastPeriodDate: Date;
  cycleLength: number;       // days, default 28
  periodDuration: number;    // days, default 5
  pastCycles?: number[];     // optional past cycle lengths for AI averaging
}

export interface PeriodPrediction {
  nextPeriodDate: Date;
  ovulationDate: Date;
  fertileStart: Date;
  fertileEnd: Date;
  implantationStart: Date;
  implantationEnd: Date;
  lutealPhaseStart: Date;
  cyclePhase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  daysUntilNextPeriod: number;
  daysUntilOvulation: number;
  isInFertileWindow: boolean;
  confidence: 'high' | 'medium' | 'low';
  predictions: PeriodCycle[];
}

export interface PeriodCycle {
  cycleNumber: number;
  periodStart: Date;
  periodEnd: Date;
  ovulationDate: Date;
  fertileStart: Date;
  fertileEnd: Date;
}

export interface OvulationInput {
  lastPeriodDate: Date;
  cycleLength: number;
}

export interface FertilityInsight {
  type: 'info' | 'tip' | 'warning';
  title: string;
  message: string;
}

/**
 * Calculate average cycle length from past cycles
 */
export function calcAverageCycle(pastCycles: number[]): number {
  if (!pastCycles.length) return 28;
  const valid = pastCycles.filter(c => c >= 21 && c <= 35);
  if (!valid.length) return 28;
  return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length);
}

/**
 * Determine if cycle is irregular (std dev > 3 days)
 */
export function isIrregularCycle(pastCycles: number[]): boolean {
  if (pastCycles.length < 3) return false;
  const avg = calcAverageCycle(pastCycles);
  const stdDev = Math.sqrt(
    pastCycles.reduce((sum, c) => sum + Math.pow(c - avg, 2), 0) / pastCycles.length
  );
  return stdDev > 3;
}

/**
 * Add days to a date
 */
function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Calculate days between two dates
 */
function daysBetween(d1: Date, d2: Date): number {
  return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Determine current cycle phase
 */
function getCyclePhase(
  lastPeriod: Date,
  cycleLength: number,
  periodDuration: number,
  today: Date
): 'menstrual' | 'follicular' | 'ovulation' | 'luteal' {
  const dayOfCycle = daysBetween(lastPeriod, today) % cycleLength;
  const ovulationDay = cycleLength - 14;

  if (dayOfCycle < periodDuration) return 'menstrual';
  if (dayOfCycle < ovulationDay - 5) return 'follicular';
  if (dayOfCycle >= ovulationDay - 2 && dayOfCycle <= ovulationDay + 1) return 'ovulation';
  return 'luteal';
}

/**
 * Core prediction engine
 */
export function predictCycles(input: CycleInput, numCycles = 6): PeriodPrediction {
  const {
    lastPeriodDate,
    cycleLength,
    periodDuration,
    pastCycles = [],
  } = input;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lmp = new Date(lastPeriodDate);
  lmp.setHours(0, 0, 0, 0);

  // Use AI-averaged cycle if past cycles provided
  const effectiveCycle = pastCycles.length >= 3
    ? calcAverageCycle(pastCycles)
    : cycleLength;

  // Ovulation is typically 14 days before next period
  const ovulationDay = effectiveCycle - 14;

  // Next period
  const nextPeriodDate = addDays(lmp, effectiveCycle);
  const ovulationDate = addDays(lmp, ovulationDay);
  const fertileStart = addDays(ovulationDate, -5);
  const fertileEnd = addDays(ovulationDate, 1);
  const implantationStart = addDays(ovulationDate, 6);
  const implantationEnd = addDays(ovulationDate, 12);
  const lutealPhaseStart = addDays(ovulationDate, 2);

  const daysUntilNextPeriod = daysBetween(today, nextPeriodDate);
  const daysUntilOvulation = daysBetween(today, ovulationDate);

  const isInFertileWindow = today >= fertileStart && today <= fertileEnd;
  const cyclePhase = getCyclePhase(lmp, effectiveCycle, periodDuration, today);

  // Confidence based on available data
  const confidence: 'high' | 'medium' | 'low' =
    pastCycles.length >= 6 ? 'high' :
    pastCycles.length >= 3 ? 'medium' : 'low';

  // Generate multiple cycles
  const predictions: PeriodCycle[] = [];
  for (let i = 0; i < numCycles; i++) {
    const pStart = addDays(lmp, effectiveCycle * i);
    predictions.push({
      cycleNumber: i + 1,
      periodStart: pStart,
      periodEnd: addDays(pStart, periodDuration - 1),
      ovulationDate: addDays(pStart, ovulationDay),
      fertileStart: addDays(pStart, ovulationDay - 5),
      fertileEnd: addDays(pStart, ovulationDay + 1),
    });
  }

  return {
    nextPeriodDate,
    ovulationDate,
    fertileStart,
    fertileEnd,
    implantationStart,
    implantationEnd,
    lutealPhaseStart,
    cyclePhase,
    daysUntilNextPeriod,
    daysUntilOvulation,
    isInFertileWindow,
    confidence,
    predictions,
  };
}

/**
 * Generate smart health insights
 */
export function generateFertilityInsights(
  input: CycleInput,
  result: PeriodPrediction
): FertilityInsight[] {
  const insights: FertilityInsight[] = [];
  const { pastCycles = [], cycleLength } = input;

  if (result.isInFertileWindow) {
    insights.push({
      type: 'tip',
      title: '🌸 You are in your fertile window',
      message: 'This is the period with the highest chance of conception. Ovulation is expected within 1–2 days.',
    });
  }

  if (result.daysUntilNextPeriod >= 0 && result.daysUntilNextPeriod <= 5) {
    insights.push({
      type: 'warning',
      title: '📅 Period approaching',
      message: `Your next period is expected in ${result.daysUntilNextPeriod} day${result.daysUntilNextPeriod !== 1 ? 's' : ''}. You may start experiencing PMS symptoms.`,
    });
  }

  if (isIrregularCycle(pastCycles) && pastCycles.length >= 3) {
    insights.push({
      type: 'warning',
      title: '⚡ Irregular cycle detected',
      message: 'Your cycle length varies significantly. Predictions are based on your average. Consider consulting a gynecologist for a comprehensive evaluation.',
    });
  }

  if (cycleLength < 21 || cycleLength > 35) {
    insights.push({
      type: 'warning',
      title: '⚠️ Cycle length outside normal range',
      message: 'A typical cycle is 21–35 days. Cycles outside this range may benefit from medical evaluation.',
    });
  }

  if (result.confidence === 'high') {
    insights.push({
      type: 'info',
      title: '✅ High prediction accuracy',
      message: 'With 6+ tracked cycles, your predictions are highly personalized and accurate.',
    });
  } else if (result.confidence === 'low') {
    insights.push({
      type: 'info',
      title: '💡 Improve accuracy by tracking more cycles',
      message: 'Add 3–6 past cycle lengths for AI-powered personalized predictions with much higher accuracy.',
    });
  }

  insights.push({
    type: 'info',
    title: '🔒 Privacy protected',
    message: 'All calculations are done entirely in your browser. Your health data is never sent to any server.',
  });

  return insights;
}

/**
 * Format date for display
 */
export function formatCycleDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get phase info for UI display
 */
export function getPhaseInfo(phase: PeriodPrediction['cyclePhase']) {
  const map = {
    menstrual: {
      label: 'Menstrual Phase',
      color: '#dc2626',
      bg: '#fef2f2',
      icon: '🩸',
      desc: 'Your period is here. Rest, stay hydrated, and use gentle exercise.',
    },
    follicular: {
      label: 'Follicular Phase',
      color: '#2563eb',
      bg: '#eff6ff',
      icon: '🌱',
      desc: 'Energy levels rise. A great time for new projects and high-intensity workouts.',
    },
    ovulation: {
      label: 'Ovulation Phase',
      color: '#16a34a',
      bg: '#f0fdf4',
      icon: '🌸',
      desc: 'Peak fertility window. Energy and libido are highest during this phase.',
    },
    luteal: {
      label: 'Luteal Phase',
      color: '#7c3aed',
      bg: '#f5f3ff',
      icon: '🌙',
      desc: 'Progesterone rises. You may feel calmer, or experience PMS symptoms closer to your period.',
    },
  };
  return map[phase];
}
