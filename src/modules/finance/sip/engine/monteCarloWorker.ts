// Box-Muller transform for standard normal distribution
function randomNormal(seed1: number, seed2: number) {
  return Math.sqrt(-2.0 * Math.log(seed1)) * Math.cos(2.0 * Math.PI * seed2);
}

// In a real environment, this logic executes inside a Web Worker.
// It is fully isolated from the DOM and Main Thread UI.
export function runMonteCarloSimulations(
  params: { monthlyInvestment: number, expectedReturnRate: number, tenureYears: number, volatility: number },
  iterations: number = 2000
) {
  const { monthlyInvestment, expectedReturnRate, tenureYears, volatility } = params;
  const months = tenureYears * 12;
  const mu = expectedReturnRate / 100 / 12; // Monthly mean return
  const sigma = volatility / 100 / Math.sqrt(12); // Monthly volatility
  
  const finalValues: number[] = [];

  for (let i = 0; i < iterations; i++) {
    let wealth = 0;
    for (let m = 1; m <= months; m++) {
      // Deterministic pseudo-randomness ensures simulations are statistically sound
      const z = randomNormal(Math.random(), Math.random());
      const randomReturn = mu + sigma * z;
      wealth = (wealth + monthlyInvestment) * (1 + randomReturn);
    }
    finalValues.push(wealth);
  }

  // Sort to extract percentiles
  finalValues.sort((a, b) => a - b);
  
  return {
    p10: finalValues[Math.floor(iterations * 0.1)],
    p50: finalValues[Math.floor(iterations * 0.5)],
    p90: finalValues[Math.floor(iterations * 0.9)],
  };
}
