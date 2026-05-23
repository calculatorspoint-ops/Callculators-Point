
import { SIPParams, SIPResult, SIPSchedulePoint } from "../types";

export function calculateDeterministicSIP(params: SIPParams): SIPResult {
  const { monthlyInvestment, expectedReturnRate, tenureYears, stepUpRate = 0, inflationRate = 0, volatility = 15, currentSalary = 0, salaryGrowthRate = 0 } = params;
  
  const totalMonths = tenureYears * 12;
  const muAnnual = expectedReturnRate / 100;
  const sigmaAnnual = volatility / 100;
  const inflationMonthly = inflationRate / 100 / 12;
  
  // Convert annual mu and sigma to monthly for geometric brownian motion approximation
  const muMonthly = muAnnual / 12;
  const sigmaMonthly = sigmaAnnual / Math.sqrt(12);

  const iterations = 500;
  let paths = new Float64Array(iterations);
  
  let totalInvested = 0;
  let currentSIP = monthlyInvestment;
  let currentSal = currentSalary;
  
  const schedule: SIPSchedulePoint[] = [];

  let maxSIPRatio = 0;
  let warningYear: number | null = null;

  for (let m = 1; m <= totalMonths; m++) {
    const isNewYear = m > 1 && (m - 1) % 12 === 0;
    if (isNewYear) {
      currentSIP = currentSIP * (1 + stepUpRate / 100);
      currentSal = currentSal * (1 + salaryGrowthRate / 100);
    }
    
    totalInvested += currentSIP;
    
    if (currentSal > 0) {
      const ratio = currentSIP / currentSal;
      if (ratio > maxSIPRatio) maxSIPRatio = ratio;
      if (ratio > 0.4 && warningYear === null) {
        warningYear = Math.ceil(m / 12);
      }
    }

    for (let i = 0; i < iterations; i++) {
      paths[i] += currentSIP;
      
      let u = 0, v = 0;
      while(u === 0) u = Math.random();
      while(v === 0) v = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      
      const randomReturn = muMonthly - (sigmaMonthly * sigmaMonthly) / 2 + sigmaMonthly * z;
      paths[i] = paths[i] * Math.exp(randomReturn);
    }

    if (m % 12 === 0 || m === totalMonths) {
      const sortedPaths = Float64Array.from(paths).sort();
      const p10 = sortedPaths[Math.floor(iterations * 0.10)];
      const p50 = sortedPaths[Math.floor(iterations * 0.50)];
      const p90 = sortedPaths[Math.floor(iterations * 0.90)];
      
      const discountFactor = Math.pow(1 + inflationMonthly, m);

      schedule.push({
        month: m,
        year: Math.ceil(m / 12),
        invested: totalInvested,
        wealth: p50,
        p10Wealth: p10,
        p90Wealth: p90,
        inflationAdjusted: p50 / discountFactor
      });
    }
  }

  const finalSchedule = schedule[schedule.length - 1];

  return {
    totalInvestment: totalInvested,
    expectedWealth: finalSchedule.wealth,
    p10Wealth: finalSchedule.p10Wealth,
    p90Wealth: finalSchedule.p90Wealth,
    inflationAdjustedWealth: finalSchedule.inflationAdjusted,
    schedule,
    sustainability: {
      maxSIPRatio: maxSIPRatio,
      warningYear
    }
  };
}


// Alias for backwards compatibility
export const calculateProbabilisticSIP = calculateDeterministicSIP;

