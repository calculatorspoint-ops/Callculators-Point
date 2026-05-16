import Decimal from "decimal.js";
import { SalaryForm } from '../schemas/salarySchema';

// ── Tax Slab Types ────────────────────────────────────────────────────
interface TaxSlab {
  min: number;
  max: number;
  rate: number;   // marginal rate (0–1)
  fixed: number;  // base tax already computed on income below min
}

export interface CountryTaxConfig {
  name: string;
  currency: string;
  currencySymbol: string;
  slabs: TaxSlab[];
  notes: string;
  socialSecurity?: number;  // flat % on top (e.g. FICA, NI, PF)
  socialSecurityLabel?: string;
}

// ── Country Tax Databases ─────────────────────────────────────────────
export const COUNTRY_TAX_CONFIGS: Record<string, CountryTaxConfig> = {

  // ── Pakistan (FBR 2024-25) ─────────────────────────────────────────
  pk: {
    name: 'Pakistan', currency: 'PKR', currencySymbol: '₨',
    notes: 'FBR Income Tax 2024-25. No social security contribution modelled separately.',
    slabs: [
      { min: 0,        max: 600_000,   rate: 0,    fixed: 0 },
      { min: 600_000,  max: 1_200_000, rate: 0.05, fixed: 0 },
      { min: 1_200_000,max: 2_400_000, rate: 0.15, fixed: 30_000 },
      { min: 2_400_000,max: 3_600_000, rate: 0.25, fixed: 210_000 },
      { min: 3_600_000,max: 6_000_000, rate: 0.30, fixed: 510_000 },
      { min: 6_000_000,max: Infinity,  rate: 0.35, fixed: 1_230_000 },
    ],
  },

  // ── India (New Tax Regime FY 2024-25) ─────────────────────────────
  in: {
    name: 'India', currency: 'INR', currencySymbol: '₹',
    notes: 'New Tax Regime (FY 2024-25). Standard deduction of ₹75,000 applied automatically. PF @ 12% of basic (estimated as 50% of CTC).',
    socialSecurity: 0.12, socialSecurityLabel: 'PF (12% of basic)',
    slabs: [
      { min: 0,          max: 300_000,    rate: 0,    fixed: 0 },
      { min: 300_000,    max: 700_000,    rate: 0.05, fixed: 0 },
      { min: 700_000,    max: 1_000_000,  rate: 0.10, fixed: 20_000 },
      { min: 1_000_000,  max: 1_200_000,  rate: 0.15, fixed: 50_000 },
      { min: 1_200_000,  max: 1_500_000,  rate: 0.20, fixed: 80_000 },
      { min: 1_500_000,  max: Infinity,   rate: 0.30, fixed: 140_000 },
    ],
  },

  // ── USA (Federal, Single filer 2024) ──────────────────────────────
  us: {
    name: 'USA', currency: 'USD', currencySymbol: '$',
    notes: 'Federal income tax (single filer 2024). FICA: Social Security 6.2% (up to $168,600) + Medicare 1.45%. State taxes not included.',
    socialSecurity: 0.0765, socialSecurityLabel: 'FICA (SS 6.2% + Medicare 1.45%)',
    slabs: [
      { min: 0,        max: 11_600,   rate: 0.10, fixed: 0 },
      { min: 11_600,   max: 47_150,   rate: 0.12, fixed: 1_160 },
      { min: 47_150,   max: 100_525,  rate: 0.22, fixed: 5_426 },
      { min: 100_525,  max: 191_950,  rate: 0.24, fixed: 17_168.50 },
      { min: 191_950,  max: 243_725,  rate: 0.32, fixed: 39_110.50 },
      { min: 243_725,  max: 609_350,  rate: 0.35, fixed: 55_678.50 },
      { min: 609_350,  max: Infinity, rate: 0.37, fixed: 183_647.25 },
    ],
  },

  // ── United Kingdom (2024-25) ──────────────────────────────────────
  uk: {
    name: 'United Kingdom', currency: 'GBP', currencySymbol: '£',
    notes: 'UK income tax 2024-25. Personal allowance: £12,570. National Insurance Class 1: 8% on £12,570–£50,270, 2% above.',
    socialSecurity: 0.08, socialSecurityLabel: 'National Insurance (Class 1)',
    slabs: [
      { min: 0,       max: 12_570,  rate: 0,    fixed: 0 },
      { min: 12_570,  max: 50_270,  rate: 0.20, fixed: 0 },
      { min: 50_270,  max: 125_140, rate: 0.40, fixed: 7_540 },
      { min: 125_140, max: Infinity,rate: 0.45, fixed: 37_796 },
    ],
  },

  // ── Canada (Federal 2024) ─────────────────────────────────────────
  ca: {
    name: 'Canada', currency: 'CAD', currencySymbol: 'C$',
    notes: 'Federal income tax only (2024). Provincial taxes not included. CPP: 5.95% (up to ~$73,200 earnings). EI: 1.66%.',
    socialSecurity: 0.0761, socialSecurityLabel: 'CPP (5.95%) + EI (1.66%)',
    slabs: [
      { min: 0,        max: 55_867,   rate: 0.15, fixed: 0 },
      { min: 55_867,   max: 111_733,  rate: 0.205, fixed: 8_380.05 },
      { min: 111_733,  max: 154_906,  rate: 0.26,  fixed: 19_831.86 },
      { min: 154_906,  max: 220_000,  rate: 0.29,  fixed: 31_048.74 },
      { min: 220_000,  max: Infinity, rate: 0.33,  fixed: 49_973.24 },
    ],
  },

  // ── Australia (FY 2024-25) ────────────────────────────────────────
  au: {
    name: 'Australia', currency: 'AUD', currencySymbol: 'A$',
    notes: 'Australian income tax FY 2024-25 (Stage 3 cuts applied). Medicare Levy 2% included.',
    socialSecurity: 0.02, socialSecurityLabel: 'Medicare Levy (2%)',
    slabs: [
      { min: 0,        max: 18_200,   rate: 0,    fixed: 0 },
      { min: 18_200,   max: 45_000,   rate: 0.16, fixed: 0 },
      { min: 45_000,   max: 120_000,  rate: 0.30, fixed: 4_288 },
      { min: 120_000,  max: 180_000,  rate: 0.37, fixed: 26_788 },
      { min: 180_000,  max: Infinity, rate: 0.45, fixed: 49_000 },
    ],
  },

  // ── Germany (2024) ────────────────────────────────────────────────
  de: {
    name: 'Germany', currency: 'EUR', currencySymbol: '€',
    notes: 'Simplified German income tax 2024. Social contributions ~20.5% employee share (pension, health, unemployment, care insurance).',
    socialSecurity: 0.205, socialSecurityLabel: 'Social Contributions (~20.5%)',
    slabs: [
      { min: 0,        max: 11_604,   rate: 0,    fixed: 0 },
      { min: 11_604,   max: 17_005,   rate: 0.14, fixed: 0 },
      { min: 17_005,   max: 66_760,   rate: 0.24, fixed: 756.28 },
      { min: 66_760,   max: 277_825,  rate: 0.42, fixed: 12_690 },
      { min: 277_825,  max: Infinity, rate: 0.45, fixed: 101_197 },
    ],
  },

  // ── UAE (0% tax) ──────────────────────────────────────────────────
  ae: {
    name: 'UAE', currency: 'AED', currencySymbol: 'AED',
    notes: 'No personal income tax in UAE. Expatriates have no social security obligation. Nationals contribute 5% GPSSA.',
    slabs: [{ min: 0, max: Infinity, rate: 0, fixed: 0 }],
  },

  // ── Saudi Arabia ──────────────────────────────────────────────────
  sa: {
    name: 'Saudi Arabia', currency: 'SAR', currencySymbol: 'SAR',
    notes: 'No personal income tax for residents/expats on employment income. GOSI social insurance for Saudis only (10% employee share).',
    slabs: [{ min: 0, max: Infinity, rate: 0, fixed: 0 }],
  },

  // ── Singapore ────────────────────────────────────────────────────
  sg: {
    name: 'Singapore', currency: 'SGD', currencySymbol: 'S$',
    notes: 'Singapore resident tax YA 2024. CPF (Central Provident Fund): 20% employee contribution (capped).',
    socialSecurity: 0.20, socialSecurityLabel: 'CPF Employee (20%)',
    slabs: [
      { min: 0,        max: 20_000,   rate: 0,    fixed: 0 },
      { min: 20_000,   max: 30_000,   rate: 0.02, fixed: 0 },
      { min: 30_000,   max: 40_000,   rate: 0.035,fixed: 200 },
      { min: 40_000,   max: 80_000,   rate: 0.07, fixed: 550 },
      { min: 80_000,   max: 120_000,  rate: 0.115,fixed: 3_350 },
      { min: 120_000,  max: 160_000,  rate: 0.15, fixed: 7_950 },
      { min: 160_000,  max: 200_000,  rate: 0.18, fixed: 13_950 },
      { min: 200_000,  max: 240_000,  rate: 0.19, fixed: 21_150 },
      { min: 240_000,  max: 280_000,  rate: 0.195,fixed: 28_750 },
      { min: 280_000,  max: 320_000,  rate: 0.20, fixed: 36_550 },
      { min: 320_000,  max: 500_000,  rate: 0.22, fixed: 44_550 },
      { min: 500_000,  max: 1_000_000,rate: 0.23, fixed: 84_150 },
      { min: 1_000_000,max: Infinity, rate: 0.24, fixed: 199_150 },
    ],
  },

  // ── Bangladesh ────────────────────────────────────────────────────
  bd: {
    name: 'Bangladesh', currency: 'BDT', currencySymbol: '৳',
    notes: 'Bangladesh income tax FY 2023-24. Minimum tax applies.',
    slabs: [
      { min: 0,          max: 350_000,    rate: 0,    fixed: 0 },
      { min: 350_000,    max: 450_000,    rate: 0.05, fixed: 0 },
      { min: 450_000,    max: 750_000,    rate: 0.10, fixed: 5_000 },
      { min: 750_000,    max: 1_150_000,  rate: 0.15, fixed: 35_000 },
      { min: 1_150_000,  max: 1_650_000,  rate: 0.20, fixed: 95_000 },
      { min: 1_650_000,  max: Infinity,   rate: 0.25, fixed: 195_000 },
    ],
  },

  // ── Custom (manual override) ──────────────────────────────────────
  custom: {
    name: 'Custom / Other',
    currency: 'USD', currencySymbol: '$',
    notes: 'Enter your own flat effective tax rate below.',
    slabs: [],
  },
};

// ── Engine ────────────────────────────────────────────────────────────
export interface TaxBreakdownSlab {
  label: string;
  taxable: number;
  rate: number;
  tax: number;
}

export interface SalaryPeriod {
  gross: number;
  tax: number;
  socialSecurity: number;
  deductions: number;
  net: number;
}

export interface SalaryResult {
  annual:         SalaryPeriod;
  monthly:        SalaryPeriod;
  biweekly:       SalaryPeriod;
  weekly:         SalaryPeriod;
  effectiveTaxRate: number;
  marginalRate:    number;
  slabBreakdown:   TaxBreakdownSlab[];
  countryConfig:   CountryTaxConfig;
  currencySymbol:  string;
}

function computeSlabTax(annual: number, slabs: TaxSlab[]): { tax: number; marginalRate: number; breakdown: TaxBreakdownSlab[] } {
  if (!slabs.length) return { tax: 0, marginalRate: 0, breakdown: [] };

  const slab = slabs.find(s => annual >= s.min && annual < s.max) ?? slabs[slabs.length - 1];
  const tax  = slab.fixed + Math.max(0, annual - slab.min) * slab.rate;

  const breakdown: TaxBreakdownSlab[] = slabs
    .filter(s => s.rate > 0 && annual > s.min)
    .map(s => {
      const taxable = Math.min(annual, s.max) - s.min;
      return {
        label:   `${(s.rate * 100).toFixed(0)}% on ${s.min === 0 ? 'first' : 'income'} up to ${s.max === Infinity ? '∞' : s.max.toLocaleString()}`,
        taxable: Math.max(0, taxable),
        rate:    s.rate,
        tax:     Math.max(0, taxable) * s.rate,
      };
    });

  return { tax, marginalRate: slab.rate, breakdown };
}

export function calculateSalary(params: SalaryForm): SalaryResult {
  // Annualise gross
  let annualGross = new Decimal(params.grossSalary || 0);
  if (params.payFrequency === 'monthly')  annualGross = annualGross.times(12);
  if (params.payFrequency === 'biweekly') annualGross = annualGross.times(26);
  if (params.payFrequency === 'weekly')   annualGross = annualGross.times(52);

  const gross = annualGross.toNumber();
  const config = COUNTRY_TAX_CONFIGS[params.country ?? 'us'] ?? COUNTRY_TAX_CONFIGS['us'];

  // Compute income tax via slabs (or custom flat rate)
  let incomeTax = 0;
  let marginalRate = 0;
  let slabBreakdown: TaxBreakdownSlab[] = [];

  if (params.country === 'custom') {
    const flatRate = (params.customTaxRate ?? 20) / 100;
    incomeTax    = gross * flatRate;
    marginalRate = flatRate;
    slabBreakdown = [{ label: `Flat ${params.customTaxRate ?? 20}% tax`, taxable: gross, rate: flatRate, tax: incomeTax }];
  } else {
    // India: apply standard deduction ₹75,000 first
    const taxableIncome = params.country === 'in' ? Math.max(0, gross - 75_000) : gross;
    const result = computeSlabTax(taxableIncome, config.slabs);
    incomeTax    = result.tax;
    marginalRate = result.marginalRate;
    slabBreakdown = result.breakdown;
  }

  // Social security / contributions
  const ssRate = config.socialSecurity ?? 0;
  // USA: SS capped at $168,600
  const ssBase   = params.country === 'us' ? Math.min(gross, 168_600) : gross;
  const ssTax    = ssBase * ssRate;

  const totalTax = incomeTax + ssTax;
  const effectiveTaxRate = gross > 0 ? ((totalTax / gross) * 100) : 0;

  // Annualise deductions
  let annualDeductions = new Decimal(params.deductions || 0);
  if (params.payFrequency === 'monthly')  annualDeductions = annualDeductions.times(12);
  if (params.payFrequency === 'biweekly') annualDeductions = annualDeductions.times(26);
  if (params.payFrequency === 'weekly')   annualDeductions = annualDeductions.times(52);
  const dedNum = annualDeductions.toNumber();

  const annualNet = gross - totalTax - dedNum;

  const buildPeriod = (divisor: number): SalaryPeriod => ({
    gross:          +( gross          / divisor).toFixed(2),
    tax:            +( incomeTax      / divisor).toFixed(2),
    socialSecurity: +( ssTax          / divisor).toFixed(2),
    deductions:     +( dedNum         / divisor).toFixed(2),
    net:            +( annualNet      / divisor).toFixed(2),
  });

  return {
    annual:          buildPeriod(1),
    monthly:         buildPeriod(12),
    biweekly:        buildPeriod(26),
    weekly:          buildPeriod(52),
    effectiveTaxRate: +effectiveTaxRate.toFixed(2),
    marginalRate:    +(marginalRate * 100).toFixed(1),
    slabBreakdown,
    countryConfig:   config,
    currencySymbol:  config.currencySymbol,
  };
}
