import { RetirementForm } from '../schemas/retirementSchema';

export interface RetirementResult {
  successRate: number; 
  medianEndingBalance: number;
  worstCaseEndingBalance: number;
  safeWithdrawalRate: number; 
}

// Pseudo-Random normal distribution using Box-Muller transform
function randomNormal(mean: number, stdDev: number) {
  const u = 1 - Math.random(); 
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdDev + mean;
}

/**
 * Asynchronous mathematical engine proving the Factory's ability to handle heavy compute loads.
 * This runs 5,000 iterations of market volatility paths to calculate portfolio survival probability.
 */
export async function calculateRetirementSimulation(params: RetirementForm): Promise<RetirementResult> {
  // Simulate heavy compute latency (800ms) to trigger the Render Isolation blur effect in the UI
  await new Promise(resolve => setTimeout(resolve, 800));

  const iterations = 5000;
  const { currentPortfolio, annualWithdrawal, inflationRate, expectedReturn, volatility, yearsInRetirement } = params;
  
  const mu = expectedReturn / 100;
  const sigma = volatility / 100;
  const infl = inflationRate / 100;

  let successCount = 0;
  const endingBalances: number[] = [];

  for (let i = 0; i < iterations; i++) {
    let balance = currentPortfolio;
    let withdrawal = annualWithdrawal;

    for (let y = 1; y <= yearsInRetirement; y++) {
      // 1. Market returns
      const returnRate = randomNormal(mu, sigma);
      balance = balance * (1 + returnRate);
      
      // 2. End of year withdrawal
      balance -= withdrawal;

      if (balance <= 0) {
        balance = 0;
        break;
      }
      
      // 3. Inflation adjustment for next year's withdrawal
      withdrawal *= (1 + infl);
    }

    if (balance > 0) {
      successCount++;
    }
    endingBalances.push(balance);
  }

  endingBalances.sort((a, b) => a - b);

  return {
    successRate: (successCount / iterations) * 100,
    medianEndingBalance: endingBalances[Math.floor(iterations * 0.5)],
    worstCaseEndingBalance: endingBalances[Math.floor(iterations * 0.05)], // 5th percentile
    safeWithdrawalRate: (annualWithdrawal / currentPortfolio) * 100
  };
}
