import { InsightCardProps } from '../../../../core/ui-system';
import { MortgageResult } from '../engine/mortgageEngine';

export function generateMortgageInsights(result: MortgageResult): InsightCardProps[] {
  const insights: InsightCardProps[] = [];
  if (result.schedule.length === 0 || result.principal <= 0) return insights;

  const interestRatio = result.totalInterest / result.principal;

  if (interestRatio >= 1) {
    insights.push({
      type: 'bad',
      message: `Critical Warning: You are paying more in interest ($${result.totalInterest.toLocaleString(undefined, {maximumFractionDigits:0})}) than the actual loan amount ($${result.principal.toLocaleString()}). You must shorten the loan term or increase the down payment to prevent severe wealth erosion.`
    });
  } else if (interestRatio > 0.5) {
    insights.push({
      type: 'warn',
      message: `High Interest Burden: Your total interest is over 50% of the initial loan amount. Consider making one extra principal payment per year to drastically reduce the amortization schedule.`
    });
  } else {
    insights.push({
      type: 'good',
      message: `Efficient Loan Structure: Your interest payments are kept relatively low compared to the principal, protecting your long-term equity.`
    });
  }

  return insights;
}
