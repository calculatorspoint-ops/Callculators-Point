export interface SIPParams {
  monthlyInvestment: number;
  expectedReturnRate: number; // annual mean return
  tenureYears: number;
  stepUpRate?: number; // annual % increase in SIP
  inflationRate?: number;
  volatility?: number; // annual standard deviation
  currentSalary?: number;
  salaryGrowthRate?: number;
}

export interface SIPSchedulePoint {
  month: number;
  year: number;
  invested: number;
  wealth: number; // P50
  inflationAdjusted: number;
  p10Wealth: number;
  p90Wealth: number;
}

export interface SIPResult {
  totalInvestment: number;
  expectedWealth: number; // P50
  p10Wealth: number;
  p90Wealth: number;
  inflationAdjustedWealth: number;
  schedule: SIPSchedulePoint[];
  sustainability: {
    maxSIPRatio: number;
    warningYear: number | null;
  }
}
