import React, { useEffect, lazy, Suspense } from "react";
import { CalculatorConfig } from "@/data/calculatorConfigs.js";

type FormsRegistry = Record<string, React.LazyExoticComponent<React.ComponentType<any>>>;
import { useAppStore } from "@/store/useAppStore.js";

// Lazy-loaded Components
const Finance = {
  EMIForm: lazy(() => import("./forms/CoreFinanceForms.jsx").then((m: any) => ({ default: m.EMIForm }))),
  CompoundForm: lazy(() => import("./forms/CoreFinanceForms.jsx").then((m: any) => ({ default: m.CompoundForm }))),
  SIPForm: lazy(() => import("./forms/CoreFinanceForms.jsx").then((m: any) => ({ default: m.SIPForm }))),
  SimpleInterestForm: lazy(() => import("./forms/CoreFinanceForms.jsx").then((m: any) => ({ default: m.SimpleInterestForm }))),
  ROIForm: lazy(() => import("./forms/CoreFinanceForms.jsx").then((m: any) => ({ default: m.ROIForm }))),
  SalaryForm: lazy(() => import("../../modules/finance/salary/SalaryCalculator.tsx").then((m: any) => ({ default: m.SalaryCalculator }))),
  TaxForm: lazy(() => import("./forms/CoreFinanceForms.jsx").then((m: any) => ({ default: m.TaxForm }))),
  DiscountForm: lazy(() => import("./forms/CoreFinanceForms.jsx").then((m: any) => ({ default: m.DiscountForm }))),
  ProfitMarginForm: lazy(() => import("./forms/CoreFinanceForms.jsx").then((m: any) => ({ default: m.ProfitMarginForm }))),
  BreakEvenForm: lazy(() => import("./forms/CoreFinanceForms.jsx").then((m: any) => ({ default: m.BreakEvenForm }))),
  GSTForm: lazy(() => import("./forms/CoreFinanceForms.jsx").then((m: any) => ({ default: m.GSTForm }))),
  PPFForm: lazy(() => import("./forms/CoreFinanceForms.jsx").then((m: any) => ({ default: m.PPFForm }))),
  TipForm: lazy(() => import("./forms/CoreFinanceForms.jsx").then((m: any) => ({ default: m.TipForm }))),
  MortgageForm: lazy(() => import("./forms/MortgageForms.jsx").then((m: any) => ({ default: m.MortgageForm }))),
  RetirementForm: lazy(() => import("./forms/RetirementForms.jsx").then((m: any) => ({ default: m.RetirementPlanForm }))),
  NPSForm: lazy(() => import("./forms/RetirementForms.jsx").then((m: any) => ({ default: m.NPSForm }))),
  EPFForm: lazy(() => import("./forms/RetirementForms.jsx").then((m: any) => ({ default: m.EPFForm }))),
  FDForm: lazy(() => import("./forms/CoreFinanceForms.jsx").then((m: any) => ({ default: m.FDForm }))),
  LoanCompareForm: lazy(() => import("./forms/CoreFinanceForms.jsx").then((m: any) => ({ default: m.LoanCompareForm }))),
  StockReturnForm: lazy(() => import("./forms/InvestmentForms.jsx").then((m: any) => ({ default: m.StockReturnForm }))),
  NPVForm: lazy(() => import("./forms/InvestmentForms.jsx").then((m: any) => ({ default: m.NPVForm }))),
  PortfolioRebalanceForm: lazy(() => import("./forms/InvestmentForms.jsx").then((m: any) => ({ default: m.PortfolioRebalanceForm }))),
  DividendYieldForm: lazy(() => import("./forms/InvestmentForms.jsx").then((m: any) => ({ default: m.DividendYieldForm }))),
  // New Finance Forms
  MortgagePayoffForm: lazy(() => import("./forms/ExtraFinanceForms.jsx").then((m: any) => ({ default: m.MortgagePayoffForm }))),
  HouseAffordabilityForm: lazy(() => import("./forms/MortgageForms.jsx").then((m: any) => ({ default: m.HouseAffordabilityForm }))),
  RentVsBuyForm: lazy(() => import("./forms/MortgageForms.jsx").then((m: any) => ({ default: m.RentVsBuyForm }))),
  APRForm: lazy(() => import("./forms/ExtraFinanceForms.jsx").then((m: any) => ({ default: m.APRForm }))),
  AutoLoanForm: lazy(() => import("./forms/LoanDebtForms.jsx").then((m: any) => ({ default: m.AutoLoanForm }))),
  PersonalLoanForm: lazy(() => import("./forms/LoanDebtForms.jsx").then((m: any) => ({ default: m.PersonalLoanForm }))),
  StudentLoanForm: lazy(() => import("./forms/LoanDebtForms.jsx").then((m: any) => ({ default: m.StudentLoanForm }))),
  CreditCardForm: lazy(() => import("./forms/LoanDebtForms.jsx").then((m: any) => ({ default: m.CreditCardForm }))),
  DebtPayoffForm: lazy(() => import("./forms/LoanDebtForms.jsx").then((m: any) => ({ default: m.DebtPayoffForm }))),
  Calculator401kForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then((m: any) => ({ default: m.Calculator401kForm }))),
  CommissionForm: lazy(() => import("./forms/ExtraFinanceForms.jsx").then((m: any) => ({ default: m.CommissionForm }))),
  DepreciationForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then((m: any) => ({ default: m.DepreciationForm }))),
  BudgetForm: lazy(() => import("./forms/ExtraFinanceForms.jsx").then((m: any) => ({ default: m.BudgetForm }))),
  PresentValueForm: lazy(() => import("./forms/ExtraFinanceForms.jsx").then((m: any) => ({ default: m.PresentValueForm }))),
  IRRForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then((m: any) => ({ default: m.IRRForm }))),
  DownPaymentForm: lazy(() => import("./forms/ExtraFinanceForms.jsx").then((m: any) => ({ default: m.DownPaymentForm }))),
  CollegeCostForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then((m: any) => ({ default: m.CollegeCostForm }))),
  // New Finance forms
  HELOCForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then((m: any) => ({ default: m.HELOCForm }))),
  AutoLeaseForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then((m: any) => ({ default: m.AutoLeaseForm }))),
  BondForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then((m: any) => ({ default: m.BondForm }))),
  CDForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then((m: any) => ({ default: m.CDForm }))),
  RothIRAForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then((m: any) => ({ default: m.RothIRAForm }))),
  AnnuityForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then((m: any) => ({ default: m.AnnuityForm }))),
  PensionForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then((m: any) => ({ default: m.PensionForm }))),
  SocialSecurityForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then((m: any) => ({ default: m.SocialSecurityForm }))),
  RMDForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then((m: any) => ({ default: m.RMDForm }))),
  EstateTaxForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then((m: any) => ({ default: m.EstateTaxForm }))),
  MarriageTaxForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then((m: any) => ({ default: m.MarriageTaxForm }))),
  BoatLoanForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then((m: any) => ({ default: m.BoatLoanForm }))),
  DebtConsolidationForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then((m: any) => ({ default: m.DebtConsolidationForm }))),
  FutureValueForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then((m: any) => ({ default: m.FutureValueForm }))),
  AverageReturnForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then((m: any) => ({ default: m.AverageReturnForm }))),
  AmortizationForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then((m: any) => ({ default: m.AmortizationForm }))),
  TVMForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then((m: any) => ({ default: m.TVMForm }))),
  InvestmentCalcForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then((m: any) => ({ default: m.InvestmentCalcForm }))),
  GenericLoanForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then((m: any) => ({ default: m.GenericLoanForm }))),
};

const Health = {
  BMIForm: lazy(() => import("../../modules/health/bmi/BMICalculator.tsx").then((m: any) => ({ default: m.BMICalculator }))),
  CalorieForm: lazy(() => import("./forms/HealthForms.jsx").then((m: any) => ({ default: m.CalorieForm }))),
  BMRForm: lazy(() => import("../../modules/health/bmr/BMRCalculator.tsx").then((m: any) => ({ default: m.BMRCalculator }))),
  BodyFatForm: lazy(() => import("./forms/HealthForms.jsx").then((m: any) => ({ default: m.BodyFatForm }))),
  IdealWeightForm: lazy(() => import("./forms/HealthForms.jsx").then((m: any) => ({ default: m.IdealWeightForm }))),
  MacroForm: lazy(() => import("./forms/HealthForms.jsx").then((m: any) => ({ default: m.MacroForm }))),
  WaterForm: lazy(() => import("./forms/HealthForms.jsx").then((m: any) => ({ default: m.WaterForm }))),
  HeartRateForm: lazy(() => import("./forms/HealthForms.jsx").then((m: any) => ({ default: m.HeartRateForm }))),
  PregnancyForm: lazy(() => import("./forms/HealthForms.jsx").then((m: any) => ({ default: m.PregnancyForm }))),
  OneRMForm: lazy(() => import("./forms/HealthForms.jsx").then((m: any) => ({ default: m.OneRMForm }))),
  CaloriesBurnedForm: lazy(() => import("./forms/HealthForms.jsx").then((m: any) => ({ default: m.CaloriesBurnedForm }))),
  SleepForm: lazy(() => import("./forms/HealthForms.jsx").then((m: any) => ({ default: m.SleepForm }))),
  PeriodCalc: lazy(() => import("../../modules/health/women-health/PeriodCalculator.jsx") as Promise<{default: React.ComponentType<any>}>),
  
};

const MathCalcs = {
  PercentageForm: lazy(() => import("../../modules/math/percentage/PercentageCalculator.tsx").then((m: any) => ({ default: m.PercentageCalculator }))),
  ScientificForm: lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.ScientificForm }))),
  StatsForm: lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.StatsForm }))),
  QuadraticForm: lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.QuadraticForm }))),
  PythagoreanForm: lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.PythagoreanForm }))),
  FractionForm: lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.FractionForm }))),
  GPAForm: lazy(() => import("../../modules/education/gpa/GPACalculator.tsx").then((m: any) => ({ default: m.GPACalculator }))),
  CGPAForm: lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.CGPAForm }))),
  PrimeForm: lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.PrimeForm }))),
  LogForm: lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.LogForm }))),
  RatioForm: lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.RatioForm }))),
  ReadingTimeForm: lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.ReadingTimeForm }))),
  
};

const Education = {
  MarksPercentage: lazy(() => import("../../modules/education/marks-percentage/MarksPercentageCalculator.tsx").then((m: any) => ({ default: m.MarksPercentageCalculator }))),
  Attendance: lazy(() => import("../../modules/education/attendance/AttendanceCalculator.tsx").then((m: any) => ({ default: m.AttendanceCalculator }))),
  IELTS: lazy(() => import("../../modules/education/ielts/IELTSBandCalculator.tsx").then((m: any) => ({ default: m.IELTSBandCalculator }))),
  SAT: lazy(() => import("../../modules/education/sat/SATScoreCalculator.tsx").then((m: any) => ({ default: m.SATScoreCalculator }))),
  StudyTimer: lazy(() => import("../../modules/education/study-timer/StudyTimer.tsx").then((m: any) => ({ default: m.StudyTimer }))),
  TargetGPA: lazy(() => import("../../modules/education/target-gpa/TargetGPACalculator.tsx").then((m: any) => ({ default: m.TargetGPACalculator }))),
  RequiredGrade: lazy(() => import("../../modules/education/required-grade/RequiredGradeCalculator.tsx").then((m: any) => ({ default: m.RequiredGradeCalculator }))),
  FinalGrade: lazy(() => import("../../modules/education/required-grade/RequiredGradeCalculator.tsx").then((m: any) => ({ default: m.RequiredGradeCalculator }))),
};

const Utility = {
  UnitForm: lazy(() => import("./forms/UtilityForms.jsx").then((m: any) => ({ default: m.UnitForm }))),
  AreaForm: lazy(() => import("./forms/UtilityForms.jsx").then((m: any) => ({ default: m.AreaForm }))),
  TemperatureForm: lazy(() => import("./forms/UtilityForms.jsx").then((m: any) => ({ default: m.TemperatureForm }))),
  AgeForm: lazy(() => import("./forms/UtilityForms.jsx").then((m: any) => ({ default: m.AgeForm }))),
  DateDiffForm: lazy(() => import("./forms/UtilityForms.jsx").then((m: any) => ({ default: m.DateDiffForm }))),
  CountdownForm: lazy(() => import("./forms/UtilityForms.jsx").then((m: any) => ({ default: m.CountdownForm }))),
  WorkHoursForm: lazy(() => import("./forms/UtilityForms.jsx").then((m: any) => ({ default: m.WorkHoursForm }))),
  FuelForm: lazy(() => import("./forms/UtilityForms.jsx").then((m: any) => ({ default: m.FuelForm }))),
  RandomForm: lazy(() => import("../../modules/everyday/random/RandomGenerator.tsx").then((m: any) => ({ default: m.RandomGenerator }))),
  PasswordForm: lazy(() => import("./forms/UtilityForms.jsx").then((m: any) => ({ default: m.PasswordForm }))),
  RomanForm: lazy(() => import("../../modules/conversion/roman/RomanConverter.tsx").then((m: any) => ({ default: m.RomanConverter }))),
  WordCountForm: lazy(() => import("../../modules/everyday/word-count/WordCountCalculator.tsx").then((m: any) => ({ default: m.WordCountCalculator }))),
  Base64Form: lazy(() => import("../../modules/everyday/base64/Base64Encoder.tsx").then((m: any) => ({ default: m.Base64Encoder }))),
  PeriodForm: lazy(() => import("./forms/PeriodForm.jsx").then((m: any) => ({ default: m.PeriodForm }))),
  EVChargingForm: lazy(() => import("../../modules/everyday/ev-charging/EVChargingCalculator.tsx").then((m: any) => ({ default: m.EVChargingCalculator }))),
  LengthConverter: lazy(() => import("../../modules/conversion/length/LengthConverter.tsx").then((m: any) => ({ default: m.LengthConverter }))),
  // Typed unit converters as proper named lazy components
  LengthUnitForm: lazy(() => import("./forms/UtilityForms.jsx").then((m: any) => ({ default: () => m.UnitForm({ type: "length" }) }))),
  WeightUnitForm: lazy(() => import("./forms/UtilityForms.jsx").then((m: any) => ({ default: () => m.UnitForm({ type: "weight" }) }))),
  SpeedUnitForm:  lazy(() => import("./forms/UtilityForms.jsx").then((m: any) => ({ default: () => m.UnitForm({ type: "speed" }) }))),
  DataUnitForm:   lazy(() => import("./forms/UtilityForms.jsx").then((m: any) => ({ default: () => m.UnitForm({ type: "data" }) }))),
  AreaUnitForm:   lazy(() => import("./forms/UtilityForms.jsx").then((m: any) => ({ default: () => m.UnitForm({ type: "area" }) }))),
};

// Construction forms
const Construction = {
  ConcreteForm: lazy(() => import("./forms/ConstructionForms.jsx").then((m: any) => ({ default: m.ConcreteForm }))),
  PaintForm: lazy(() => import("./forms/ConstructionForms.jsx").then((m: any) => ({ default: m.PaintForm }))),
  SquareFootageForm: lazy(() => import("./forms/ConstructionForms.jsx").then((m: any) => ({ default: m.SquareFootageForm }))),
  ConstructionCostForm: lazy(() => import("./forms/ConstructionForms.jsx").then((m: any) => ({ default: m.ConstructionCostForm }))),
  ElectricalLoadForm: lazy(() => import("./forms/ConstructionForms.jsx").then((m: any) => ({ default: m.ElectricalLoadForm }))),
  DensityForm: lazy(() => import("./forms/ConstructionForms.jsx").then((m: any) => ({ default: m.DensityForm }))),
  PressureForm: lazy(() => import("./forms/ConstructionForms.jsx").then((m: any) => ({ default: m.PressureForm }))),
  PipeVolumeForm: lazy(() => import("./forms/ConstructionForms.jsx").then((m: any) => ({ default: m.PipeVolumeForm }))),
  MaterialForm: lazy(() => import("./forms/ConstructionForms.jsx").then((m: any) => ({ default: m.MaterialForm }))),
  CubicYardForm: lazy(() => import("./forms/ConstructionForms.jsx").then((m: any) => ({ default: m.CubicYardForm }))),
  RoofingForm: lazy(() => import("./forms/ConstructionForms.jsx").then((m: any) => ({ default: m.RoofingForm }))),
  // Typed material forms as proper named lazy components
  SandForm:    lazy(() => import("./forms/ConstructionForms.jsx").then((m: any) => ({ default: () => m.MaterialForm({ type: "sand" }) }))),
  GravelForm:  lazy(() => import("./forms/ConstructionForms.jsx").then((m: any) => ({ default: () => m.MaterialForm({ type: "gravel" }) }))),
  CementForm:  lazy(() => import("./forms/ConstructionForms.jsx").then((m: any) => ({ default: () => m.MaterialForm({ type: "cement" }) }))),
  AsphaltForm: lazy(() => import("./forms/ConstructionForms.jsx").then((m: any) => ({ default: () => m.MaterialForm({ type: "asphalt" }) }))),
};

// Technology forms
const Tech = {
  SubnetForm: lazy(() => import("./forms/TechForms.jsx").then((m: any) => ({ default: m.SubnetForm }))),
  NumberBaseForm: lazy(() => import("./forms/TechForms.jsx").then((m: any) => ({ default: m.NumberBaseForm }))),
  ASCIIForm: lazy(() => import("./forms/TechForms.jsx").then((m: any) => ({ default: m.ASCIIForm }))),
  DataTransferForm: lazy(() => import("./forms/TechForms.jsx").then((m: any) => ({ default: m.DataTransferForm }))),
  PasswordStrengthForm: lazy(() => import("./forms/TechForms.jsx").then((m: any) => ({ default: m.PasswordStrengthForm }))),
  HashGeneratorForm: lazy(() => import("./forms/TechForms.jsx").then((m: any) => ({ default: m.HashGeneratorForm }))),
  RandomStringForm: lazy(() => import("./forms/TechForms.jsx").then((m: any) => ({ default: m.RandomStringForm }))),
  BandwidthForm: lazy(() => import("./forms/TechForms.jsx").then((m: any) => ({ default: m.BandwidthForm }))),
  IPRangeForm: lazy(() => import("./forms/TechForms.jsx").then((m: any) => ({ default: m.IPRangeForm }))),
  HexForm: lazy(() => import("./forms/TechForms.jsx").then((m: any) => ({ default: m.HexForm }))),
};

// Business forms
const Business = {
  MarkupForm: lazy(() => import("./forms/BusinessForms.jsx").then((m: any) => ({ default: m.MarkupForm }))),
  InventoryTurnoverForm: lazy(() => import("./forms/BusinessForms.jsx").then((m: any) => ({ default: m.InventoryTurnoverForm }))),
  EOQForm: lazy(() => import("./forms/BusinessForms.jsx").then((m: any) => ({ default: m.EOQForm }))),
  TimeCardForm: lazy(() => import("./forms/BusinessForms.jsx").then((m: any) => ({ default: m.TimeCardForm }))),
  OvertimeForm: lazy(() => import("./forms/BusinessForms.jsx").then((m: any) => ({ default: m.OvertimeForm }))),
  SalaryToHourlyForm: lazy(() => import("./forms/BusinessForms.jsx").then((m: any) => ({ default: m.SalaryToHourlyForm }))),
  MeetingCostForm: lazy(() => import("./forms/BusinessForms.jsx").then((m: any) => ({ default: m.MeetingCostForm }))),
  ConversionRateForm: lazy(() => import("./forms/BusinessForms.jsx").then((m: any) => ({ default: m.ConversionRateForm }))),
  CLVForm: lazy(() => import("./forms/BusinessForms.jsx").then((m: any) => ({ default: m.CLVForm }))),
  CPCCPAForm: lazy(() => import("./forms/BusinessForms.jsx").then((m: any) => ({ default: m.CPCCPAForm }))),
  EmployeeCostForm: lazy(() => import("./forms/BusinessForms.jsx").then((m: any) => ({ default: m.EmployeeCostForm }))),
};

function FormLoader() {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:300, flexDirection:"column", gap:12 }}>
      <div style={{ width:28, height:28, border:"2.5px solid var(--border)", borderTopColor:"var(--brand)", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
      <p style={{ fontSize:12, fontWeight:600, color:"var(--text3)" }}>Loading Tool...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export const FORMS: FormsRegistry = {
  // ── Finance (existing) ────────────────────────────────────────────
  "loan-emi-calculator":               Finance.EMIForm,
  "mortgage-calculator":               Finance.MortgageForm,
  "compound-interest-calculator":      Finance.CompoundForm,
  "sip-calculator":                    Finance.SIPForm,
  "simple-interest-calculator":        Finance.SimpleInterestForm,
  "roi-calculator":                    Finance.ROIForm,
  "salary-calculator":                 Finance.SalaryForm,
  "discount-calculator":               Finance.DiscountForm,
  "profit-margin-calculator":          Finance.ProfitMarginForm,
  "break-even-calculator":             Finance.BreakEvenForm,
  "tax-calculator":                    Finance.TaxForm,
  "tip-calculator":                    Finance.TipForm,
  "gst-calculator":                    Finance.GSTForm,
  "ppf-calculator":                    Finance.PPFForm,
  "retirement-calculator":             Finance.RetirementForm,
  "nps-calculator":                    Finance.NPSForm,
  "epf-calculator":                    Finance.EPFForm,
  "fd-calculator":                     Finance.FDForm,
  "loan-comparison-calculator":        Finance.LoanCompareForm,
  "stock-return-calculator":           Finance.StockReturnForm,
  "npv-calculator":                    Finance.NPVForm,
  "portfolio-rebalance-calculator":    Finance.PortfolioRebalanceForm,
  "dividend-yield-calculator":         Finance.DividendYieldForm,

  // ── Finance (new) ─────────────────────────────────────────────────
  "mortgage-payoff-calculator":        Finance.MortgagePayoffForm,
  "house-affordability-calculator":    Finance.HouseAffordabilityForm,
  "rent-vs-buy-calculator":            Finance.RentVsBuyForm,
  "apr-calculator":                    Finance.APRForm,
  "auto-loan-calculator":              Finance.AutoLoanForm,
  "personal-loan-calculator":          Finance.PersonalLoanForm,
  "student-loan-calculator":           Finance.StudentLoanForm,
  "credit-card-calculator":            Finance.CreditCardForm,
  "debt-payoff-calculator":            Finance.DebtPayoffForm,
  "401k-calculator":                   Finance.Calculator401kForm,
  "commission-calculator":             Finance.CommissionForm,
  "depreciation-calculator":           Finance.DepreciationForm,
  "budget-calculator":                 Finance.BudgetForm,
  "present-value-calculator":          Finance.PresentValueForm,
  "irr-calculator":                    Finance.IRRForm,
  "down-payment-calculator":           Finance.DownPaymentForm,
  "college-cost-calculator":           Finance.CollegeCostForm,

  // ── Health (existing) ─────────────────────────────────────────────
  "bmi-calculator":                    Health.BMIForm,
  "calorie-calculator":                Health.CalorieForm,
  "bmr-calculator":                    Health.BMRForm,
  "body-fat-calculator":               Health.BodyFatForm,
  "ideal-weight-calculator":           Health.IdealWeightForm,
  "macro-calculator":                  Health.MacroForm,
  "water-intake-calculator":           Health.WaterForm,
  "heart-rate-calculator":             Health.HeartRateForm,
  "pregnancy-due-date":                Health.PregnancyForm,
  "one-rep-max-calculator":            Health.OneRMForm,
  "calories-burned-calculator":        Health.CaloriesBurnedForm,
  "sleep-calculator":                  Health.SleepForm,

  // ── Math (existing) ───────────────────────────────────────────────
  "percentage-calculator":             MathCalcs.PercentageForm,
  "scientific-calculator":             MathCalcs.ScientificForm,
  "statistics-calculator":             MathCalcs.StatsForm,
  "quadratic-calculator":              MathCalcs.QuadraticForm,
  "pythagorean-calculator":            MathCalcs.PythagoreanForm,
  "fraction-calculator":               MathCalcs.FractionForm,
  "prime-number-checker":              MathCalcs.PrimeForm,
  "logarithm-calculator":              MathCalcs.LogForm,
  "ratio-calculator":                  MathCalcs.RatioForm,
  "reading-time-calculator":           MathCalcs.ReadingTimeForm,

  // ── Education ─────────────────────────────────────────────────────
  "gpa-calculator":                    MathCalcs.GPAForm,
  "marks-percentage-calculator":       Education.MarksPercentage,
  "attendance-calculator":             Education.Attendance,
  "final-grade-calculator":            Education.FinalGrade,
  "cgpa-percentage-calculator":        MathCalcs.CGPAForm,
  "ielts-band-calculator":             Education.IELTS,
  "sat-score-calculator":              Education.SAT,
  "study-timer":                       Education.StudyTimer,
  "target-gpa-calculator":             Education.TargetGPA,
  "required-grade-calculator":         Education.RequiredGrade,

  // ── Utility / Everyday ────────────────────────────────────────────
  "area-calculator":                   Utility.AreaForm,
  "length-converter":                  Utility.LengthUnitForm,
  "weight-converter":                  Utility.WeightUnitForm,
  "temperature-converter":             Utility.TemperatureForm,
  "speed-converter":                   Utility.SpeedUnitForm,
  "data-storage-converter":            Utility.DataUnitForm,
  "area-converter":                    Utility.AreaUnitForm,
  "age-calculator":                    Utility.AgeForm,
  "date-difference-calculator":        Utility.DateDiffForm,
  "countdown-calculator":              Utility.CountdownForm,
  "work-hours-calculator":             Utility.WorkHoursForm,
  "fuel-cost-calculator":              Utility.FuelForm,
  "random-number-generator":           Utility.RandomForm,
  "password-generator":                Utility.PasswordForm,
  "roman-numeral-converter":           Utility.RomanForm,
  "word-counter":                      Utility.WordCountForm,
  "base64-encoder":                    Utility.Base64Form,
  "period-calculator":                 Health.PeriodCalc,
  "ovulation-calculator":              Health.PeriodCalc,
  "fertility-window-calculator":       Health.PeriodCalc,
  "implantation-calculator":           Health.PeriodCalc,
  "time-zone-converter":               lazy(() => import("./forms/UtilityForms.jsx").then((m: any) => ({ default: m.TimeZoneForm }))),
  "ev-charging-calculator":            Utility.EVChargingForm,

  // ── Construction & Engineering ────────────────────────────────────
  "concrete-calculator":               Construction.ConcreteForm,
  "paint-calculator":                  Construction.PaintForm,
  "square-footage-calculator":         Construction.SquareFootageForm,
  "construction-cost-calculator":      Construction.ConstructionCostForm,
  "electrical-load-calculator":        Construction.ElectricalLoadForm,
  "density-calculator":                Construction.DensityForm,
  "pressure-calculator":               Construction.PressureForm,
  "pipe-volume-calculator":            Construction.PipeVolumeForm,
  "sand-calculator":                   Construction.SandForm,
  "gravel-calculator":                 Construction.GravelForm,
  "cement-calculator":                 Construction.CementForm,
  "asphalt-calculator":                Construction.AsphaltForm,
  "cubic-yard-calculator":             Construction.CubicYardForm,
  "roofing-calculator":                Construction.RoofingForm,

  // ── Technology / Network ──────────────────────────────────────────
  "subnet-calculator":                 Tech.SubnetForm,
  "number-base-converter":             Tech.NumberBaseForm,
  "ascii-converter":                   Tech.ASCIIForm,
  "data-transfer-calculator":          Tech.DataTransferForm,
  "password-strength-calculator":      Tech.PasswordStrengthForm,
  "hash-generator":                    Tech.HashGeneratorForm,
  "random-string-generator":           Tech.RandomStringForm,
  "bandwidth-calculator":              Tech.BandwidthForm,
  "ip-range-calculator":               Tech.IPRangeForm,
  "hexadecimal-calculator":            Tech.HexForm,

  // ── Business & Productivity ───────────────────────────────────────
  "markup-calculator":                 Business.MarkupForm,
  "inventory-turnover-calculator":     Business.InventoryTurnoverForm,
  "eoq-calculator":                    Business.EOQForm,
  "time-card-calculator":              Business.TimeCardForm,
  "overtime-calculator":               Business.OvertimeForm,
  "salary-to-hourly-calculator":       Business.SalaryToHourlyForm,
  "meeting-cost-calculator":           Business.MeetingCostForm,
  "conversion-rate-calculator":        Business.ConversionRateForm,
  "customer-lifetime-value-calculator": Business.CLVForm,
  "cpc-cpa-calculator":                Business.CPCCPAForm,
  "employee-cost-calculator":          Business.EmployeeCostForm,

  // ── Math (new) ────────────────────────────────────────────────────
  "lcm-gcf-calculator":                lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.LCMGCFForm }))),
  "factor-calculator":                 lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.FactorForm }))),
  "exponent-calculator":               lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.ExponentForm }))),
  "root-calculator":                   lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.RootForm }))),
  "triangle-calculator":               lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.TriangleForm }))),
  "circle-calculator":                 lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.CircleForm }))),
  "volume-calculator":                 lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.VolumeForm }))),
  "surface-area-calculator":           lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.SurfaceAreaForm }))),
  "z-score-calculator":                lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.ZScoreForm }))),
  "confidence-interval-calculator":    lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.ConfidenceIntervalForm }))),
  "sample-size-calculator":            lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.SampleSizeForm }))),
  "permutation-combination-calculator": lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.PermCombForm }))),
  "probability-calculator":            lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.ProbabilityForm }))),
  "binary-calculator":                 lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.BinaryForm }))),
  "number-sequence-calculator":        lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.NumberSequenceForm }))),
  "average-calculator":                lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.AverageForm }))),
  "matrix-calculator":                 lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.MatrixForm }))),
  "linear-equation-solver":            lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.LinearEquationForm }))),
  "random-number-generator-adv":       lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.RandomNumberForm }))),
  "percent-error-calculator":          lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.PercentErrorForm }))),
  "distance-calculator":               lazy(() => import("./forms/MathForms.jsx").then((m: any) => ({ default: m.DistanceForm }))),

  // ── Health (new) ──────────────────────────────────────────────────
  "bsa-calculator":                    lazy(() => import("./forms/HealthForms.jsx").then((m: any) => ({ default: m.BSAForm }))),
  "bac-calculator":                    lazy(() => import("./forms/HealthForms.jsx").then((m: any) => ({ default: m.BACForm }))),
  "lean-body-mass-calculator":         lazy(() => import("./forms/HealthForms.jsx").then((m: any) => ({ default: m.LeanBodyMassForm }))),
  "protein-calculator":                lazy(() => import("./forms/HealthForms.jsx").then((m: any) => ({ default: m.ProteinForm }))),
  "healthy-weight-calculator":         lazy(() => import("./forms/HealthForms.jsx").then((m: any) => ({ default: m.HealthyWeightForm }))),
  "fat-intake-calculator":             lazy(() => import("./forms/HealthForms.jsx").then((m: any) => ({ default: m.FatIntakeForm }))),
  "army-body-fat-calculator":          lazy(() => import("./forms/HealthForms.jsx").then((m: any) => ({ default: m.ArmyBodyFatForm }))),
  "conception-calculator":             lazy(() => import("./forms/HealthForms").then((m: any) => ({ default: m.ConceptionForm }))),
  "body-type-calculator":              lazy(() => import("./forms/HealthForms").then((m: any) => ({ default: m.BodyTypeForm }))),
  "gfr-calculator":                    lazy(() => import("./forms/HealthForms").then((m: any) => ({ default: m.GFRForm }))),

  // ── Finance (new additional) ───────────────────────────────────────
  "heloc-calculator":                  Finance.HELOCForm,
  "auto-lease-calculator":             Finance.AutoLeaseForm,
  "bond-calculator":                   Finance.BondForm,
  "cd-calculator":                     Finance.CDForm,
  "roth-ira-calculator":               Finance.RothIRAForm,
  "annuity-calculator":                Finance.AnnuityForm,
  "pension-calculator":                Finance.PensionForm,
  "social-security-calculator":        Finance.SocialSecurityForm,
  "rmd-calculator":                    Finance.RMDForm,
  "estate-tax-calculator":             Finance.EstateTaxForm,
  "marriage-tax-calculator":           Finance.MarriageTaxForm,
  "boat-loan-calculator":              Finance.BoatLoanForm,
  "debt-consolidation-calculator":     Finance.DebtConsolidationForm,
  "future-value-calculator":           Finance.FutureValueForm,
  "average-return-calculator":         Finance.AverageReturnForm,

  // ── New Calculators from spec ──────────────────────────────────────
  "amortization-calculator":           Finance.AmortizationForm,
  "tvm-calculator":                    Finance.TVMForm,
  "investment-calculator":             Finance.InvestmentCalcForm,
  "loan-calculator":                   Finance.GenericLoanForm,
};
export function CalculatorWidget({ calc }: { calc: CalculatorConfig | null }) {
  const { setActiveCalc } = useAppStore();
  
  useEffect(() => { 
    if (calc) setActiveCalc(calc);
  }, [calc, setActiveCalc]);

  const FormComponent = calc?.slug ? FORMS[calc.slug] : undefined;

  if (!FormComponent) return (
    <div style={{textAlign:"center",padding:"48px 20px",border:"2px dashed var(--border)",borderRadius:"var(--r-xl)",background:"var(--surface2)"}}>
      <div style={{fontSize:48,marginBottom:14}}>{calc?.icon || "🚀"}</div>
      <h3 style={{fontSize:17,fontWeight:700,color:"var(--text)",marginBottom:8}}>{calc?.name || "Calculator"}</h3>
      <p style={{fontSize:14,color:"var(--text3)",marginBottom:16}}>This calculator is coming soon!</p>
      <span style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 16px",borderRadius:100,background:"var(--surface)",border:"1.5px solid var(--border)",fontSize:12,fontWeight:700,color:"var(--text3)"}}>🚀 Coming Soon</span>
    </div>
  );

  return (
    <Suspense fallback={<FormLoader />}>
      <FormComponent />
    </Suspense>
  );
}
