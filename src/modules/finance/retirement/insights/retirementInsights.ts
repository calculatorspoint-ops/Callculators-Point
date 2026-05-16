import { InsightCardProps } from '../../../../core/ui-system';
import { RetirementResult } from '../engine/retirementEngine';

export function generateRetirementInsights(result: RetirementResult): InsightCardProps[] {
  const insights: InsightCardProps[] = [];

  if (result.successRate >= 95) {
    insights.push({ 
        type: 'good', 
        message: `Excellent! Your portfolio has a ${result.successRate.toFixed(1)}% chance of surviving your retirement. Your withdrawal strategy is highly robust against severe market volatility and prolonged bear markets.` 
    });
  } else if (result.successRate >= 80) {
    insights.push({ 
        type: 'warn', 
        message: `Moderate Risk: Your portfolio survival rate is ${result.successRate.toFixed(1)}%. While acceptable, consider slightly reducing your initial withdrawal to increase your safety buffer during sudden market downturns.` 
    });
  } else {
    insights.push({ 
        type: 'bad', 
        message: `High Risk of Depletion: Your portfolio only has a ${result.successRate.toFixed(1)}% survival rate. It is mathematically likely you will outlive your money. You must significantly reduce your withdrawals or delay your retirement horizon.` 
    });
  }

  if (result.safeWithdrawalRate > 4) {
    insights.push({ 
        type: 'warn', 
        message: `Your initial withdrawal rate is ${result.safeWithdrawalRate.toFixed(1)}%. The historical standard "Safe Withdrawal Rate" (SWR) is 4.0%. Exceeding this severely increases sequence-of-returns risk.` 
    });
  }

  return insights;
}
