import Decimal from "decimal.js";
import { MortgageForm } from '../schemas/mortgageSchema';

export interface MortgageSchedulePoint {
  month: number;
  year: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
  cumulativeInterest: number;
}

export interface MortgageResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  principal: number;
  payoffDate: string;
  schedule: MortgageSchedulePoint[];
}

export function calculateMortgage(params: MortgageForm): MortgageResult {
  const principal = new Decimal(params.homePrice).minus(new Decimal(params.downPayment || 0));
  if (principal.lte(0)) {
    return { monthlyPayment: 0, totalInterest: 0, totalPayment: 0, principal: 0, payoffDate: "", schedule: [] };
  }

  const monthlyRate = new Decimal(params.interestRate).div(100).div(12);
  const totalMonths = params.loanTerm * 12;

  // EMI Formula: M = P [ r(1 + r)^n ] / [ (1 + r)^n - 1 ]
  const onePlusRToN = new Decimal(1).plus(monthlyRate).pow(totalMonths);
  const emi = principal.times(monthlyRate.times(onePlusRToN)).div(onePlusRToN.minus(1));

  let balance = principal;
  let cumulativeInterest = new Decimal(0);
  const schedule: MortgageSchedulePoint[] = [];

  for (let m = 1; m <= totalMonths; m++) {
    const interestPayment = balance.times(monthlyRate);
    const principalPayment = emi.minus(interestPayment);
    balance = balance.minus(principalPayment);
    cumulativeInterest = cumulativeInterest.plus(interestPayment);

    // Save annual points to prevent massive arrays locking the render thread
    if (m % 12 === 0 || m === totalMonths) {
      schedule.push({
        month: m,
        year: Math.ceil(m / 12),
        principalPaid: principalPayment.toNumber(),
        interestPaid: interestPayment.toNumber(),
        remainingBalance: balance.isNegative() ? 0 : balance.toNumber(),
        cumulativeInterest: cumulativeInterest.toNumber()
      });
    }
  }

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() + totalMonths);
  const payoffDate = startDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });

  // Add monthly property tax and insurance
  const taxMonthly = new Decimal(params.propertyTax || 0).div(12);
  const insMonthly = new Decimal(params.homeInsurance || 0).div(12);
  const finalMonthly = emi.plus(taxMonthly).plus(insMonthly);

  return {
    monthlyPayment: finalMonthly.toDecimalPlaces(2).toNumber(),
    totalInterest: cumulativeInterest.toDecimalPlaces(2).toNumber(),
    totalPayment: principal.plus(cumulativeInterest).toDecimalPlaces(2).toNumber(),
    principal: principal.toNumber(),
    payoffDate,
    schedule
  };
}
