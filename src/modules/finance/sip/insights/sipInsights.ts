import { InsightCardProps } from '../../../../core/ui-system';
import { SIPResult, SIPParams } from '../types';

export function generateSIPInsights(result: SIPResult, params: SIPParams): InsightCardProps[] {
  const insights: InsightCardProps[] = [];
  
  if (params.expectedReturnRate > 15) {
    insights.push({
      type: 'warn',
      message: `A ${params.expectedReturnRate}% expected annual return is historically aggressive. Your projection may carry significant downside risk, as shown in the pessimistic (P10) path.`
    });
  }

  if (result.sustainability.warningYear !== null) {
    insights.push({
      type: 'bad',
      message: `Sustainability Warning: Your SIP amount exceeds 40% of your projected salary starting around Year ${result.sustainability.warningYear}. Consider lowering your Step-Up rate or assuming higher salary growth.`
    });
  }

  if (result.inflationAdjustedWealth < result.totalInvestment) {
    insights.push({
      type: 'bad',
      message: "Warning: Your inflation-adjusted wealth is lower than your total investment. Your purchasing power is declining. Consider increasing your return rate or step-up percentage."
    });
  } else if (result.inflationAdjustedWealth < result.expectedWealth * 0.5) {
    insights.push({
      type: 'warn',
      message: "Inflation is eroding over 50% of your nominal gains over this tenure. Focus on the inflation-adjusted value for realistic goal planning."
    });
  }

  const gain = result.expectedWealth - result.totalInvestment;
  if (gain > result.totalInvestment * 2 && result.inflationAdjustedWealth > result.totalInvestment) {
    insights.push({
      type: 'good',
      message: "Excellent compounding! The median wealth generated purely from returns is more than double your invested capital, easily outpacing inflation."
    });
  }

  return insights;
}
