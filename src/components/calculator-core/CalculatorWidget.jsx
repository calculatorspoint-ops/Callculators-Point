import { useEffect, lazy, Suspense } from "react";
import { useAppStore } from "@/store/useAppStore.js";

// Lazy-loaded Components
const Finance = {
  EMIForm: lazy(() => import("./forms/FinanceForms.jsx").then(m => ({ default: m.EMIForm }))),
  CompoundForm: lazy(() => import("./forms/FinanceForms.jsx").then(m => ({ default: m.CompoundForm }))),
  SIPForm: lazy(() => import("../../modules/finance/sip/SIPCalculator.tsx").then(m => ({ default: m.SIPCalculator }))),
  SimpleInterestForm: lazy(() => import("./forms/FinanceForms.jsx").then(m => ({ default: m.SimpleInterestForm }))),
  ROIForm: lazy(() => import("./forms/FinanceForms.jsx").then(m => ({ default: m.ROIForm }))),
  SalaryForm: lazy(() => import("../../modules/finance/salary/SalaryCalculator.tsx").then(m => ({ default: m.SalaryCalculator }))),
  TaxForm: lazy(() => import("./forms/FinanceForms.jsx").then(m => ({ default: m.TaxForm }))),
  DiscountForm: lazy(() => import("./forms/FinanceForms.jsx").then(m => ({ default: m.DiscountForm }))),
  ProfitMarginForm: lazy(() => import("./forms/FinanceForms.jsx").then(m => ({ default: m.ProfitMarginForm }))),
  BreakEvenForm: lazy(() => import("./forms/FinanceForms.jsx").then(m => ({ default: m.BreakEvenForm }))),
  GSTForm: lazy(() => import("./forms/FinanceForms.jsx").then(m => ({ default: m.GSTForm }))),
  PPFForm: lazy(() => import("./forms/FinanceForms.jsx").then(m => ({ default: m.PPFForm }))),
  TipForm: lazy(() => import("../../modules/everyday/tip/TipCalculator.tsx").then(m => ({ default: m.TipCalculator }))),
  MortgageForm: lazy(() => import("../../modules/finance/mortgage/MortgageCalculator.tsx").then(m => ({ default: m.MortgageCalculator }))),
  RetirementForm: lazy(() => import("../../modules/finance/retirement/RetirementCalculator.tsx").then(m => ({ default: m.RetirementCalculator }))),
  FDForm: lazy(() => import("./forms/FinanceForms.jsx").then(m => ({ default: m.FDForm }))),
  LoanCompareForm: lazy(() => import("./forms/FinanceForms.jsx").then(m => ({ default: m.LoanCompareForm }))),
  // New Finance Forms
  MortgagePayoffForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then(m => ({ default: m.MortgagePayoffForm }))),
  HouseAffordabilityForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then(m => ({ default: m.HouseAffordabilityForm }))),
  RentVsBuyForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then(m => ({ default: m.RentVsBuyForm }))),
  APRForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then(m => ({ default: m.APRForm }))),
  AutoLoanForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then(m => ({ default: m.AutoLoanForm }))),
  PersonalLoanForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then(m => ({ default: m.PersonalLoanForm }))),
  StudentLoanForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then(m => ({ default: m.StudentLoanForm }))),
  CreditCardForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then(m => ({ default: m.CreditCardForm }))),
  DebtPayoffForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then(m => ({ default: m.DebtPayoffForm }))),
  Calculator401kForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then(m => ({ default: m.Calculator401kForm }))),
  CommissionForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then(m => ({ default: m.CommissionForm }))),
  DepreciationForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then(m => ({ default: m.DepreciationForm }))),
  BudgetForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then(m => ({ default: m.BudgetForm }))),
  PresentValueForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then(m => ({ default: m.PresentValueForm }))),
  IRRForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then(m => ({ default: m.IRRForm }))),
  DownPaymentForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then(m => ({ default: m.DownPaymentForm }))),
  CollegeCostForm: lazy(() => import("./forms/FinanceFormsNew.jsx").then(m => ({ default: m.CollegeCostForm }))),
};

const Health = {
  BMIForm: lazy(() => import("../../modules/health/bmi/BMICalculator.tsx").then(m => ({ default: m.BMICalculator }))),
  CalorieForm: lazy(() => import("./forms/HealthForms.jsx").then(m => ({ default: m.CalorieForm }))),
  BMRForm: lazy(() => import("../../modules/health/bmr/BMRCalculator.tsx").then(m => ({ default: m.BMRCalculator }))),
  BodyFatForm: lazy(() => import("./forms/HealthForms.jsx").then(m => ({ default: m.BodyFatForm }))),
  IdealWeightForm: lazy(() => import("./forms/HealthForms.jsx").then(m => ({ default: m.IdealWeightForm }))),
  MacroForm: lazy(() => import("./forms/HealthForms.jsx").then(m => ({ default: m.MacroForm }))),
  WaterForm: lazy(() => import("./forms/HealthForms.jsx").then(m => ({ default: m.WaterForm }))),
  HeartRateForm: lazy(() => import("./forms/HealthForms.jsx").then(m => ({ default: m.HeartRateForm }))),
  PregnancyForm: lazy(() => import("./forms/HealthForms.jsx").then(m => ({ default: m.PregnancyForm }))),
  OneRMForm: lazy(() => import("./forms/HealthForms.jsx").then(m => ({ default: m.OneRMForm }))),
  CaloriesBurnedForm: lazy(() => import("./forms/HealthForms.jsx").then(m => ({ default: m.CaloriesBurnedForm }))),
  SleepForm: lazy(() => import("./forms/HealthForms.jsx").then(m => ({ default: m.SleepForm }))),
  PeriodCalc: lazy(() => import("../../modules/health/women-health/PeriodCalculator.jsx")),
  // New Health Forms
  HealthFormsNew: lazy(() => import("./forms/HealthFormsNew.jsx")),
};

const MathCalcs = {
  PercentageForm: lazy(() => import("../../modules/math/percentage/PercentageCalculator.tsx").then(m => ({ default: m.PercentageCalculator }))),
  ScientificForm: lazy(() => import("./forms/MathForms.jsx").then(m => ({ default: m.ScientificForm }))),
  StatsForm: lazy(() => import("./forms/MathForms.jsx").then(m => ({ default: m.StatsForm }))),
  QuadraticForm: lazy(() => import("./forms/MathForms.jsx").then(m => ({ default: m.QuadraticForm }))),
  PythagoreanForm: lazy(() => import("./forms/MathForms.jsx").then(m => ({ default: m.PythagoreanForm }))),
  FractionForm: lazy(() => import("./forms/MathForms.jsx").then(m => ({ default: m.FractionForm }))),
  GPAForm: lazy(() => import("../../modules/education/gpa/GPACalculator.tsx").then(m => ({ default: m.GPACalculator }))),
  CGPAForm: lazy(() => import("./forms/MathForms.jsx").then(m => ({ default: m.CGPAForm }))),
  PrimeForm: lazy(() => import("./forms/MathForms.jsx").then(m => ({ default: m.PrimeForm }))),
  LogForm: lazy(() => import("./forms/MathForms.jsx").then(m => ({ default: m.LogForm }))),
  RatioForm: lazy(() => import("./forms/MathForms.jsx").then(m => ({ default: m.RatioForm }))),
  ReadingTimeForm: lazy(() => import("./forms/MathForms.jsx").then(m => ({ default: m.ReadingTimeForm }))),
  // New Math Forms
  MathFormsNew: lazy(() => import("./forms/MathFormsNew.jsx")),
};

const Education = {
  MarksPercentage: lazy(() => import("../../modules/education/marks-percentage/MarksPercentageCalculator.tsx").then(m => ({ default: m.MarksPercentageCalculator }))),
  Attendance: lazy(() => import("../../modules/education/attendance/AttendanceCalculator.tsx").then(m => ({ default: m.AttendanceCalculator }))),
  IELTS: lazy(() => import("../../modules/education/ielts/IELTSBandCalculator.tsx").then(m => ({ default: m.IELTSBandCalculator }))),
  SAT: lazy(() => import("../../modules/education/sat/SATScoreCalculator.tsx").then(m => ({ default: m.SATScoreCalculator }))),
  StudyTimer: lazy(() => import("../../modules/education/study-timer/StudyTimer.tsx").then(m => ({ default: m.StudyTimer }))),
  TargetGPA: lazy(() => import("../../modules/education/target-gpa/TargetGPACalculator.tsx").then(m => ({ default: m.TargetGPACalculator }))),
  RequiredGrade: lazy(() => import("../../modules/education/required-grade/RequiredGradeCalculator.tsx").then(m => ({ default: m.RequiredGradeCalculator }))),
  FinalGrade: lazy(() => import("../../modules/education/required-grade/RequiredGradeCalculator.tsx").then(m => ({ default: m.RequiredGradeCalculator }))),
};

const Utility = {
  UnitForm: lazy(() => import("./forms/UtilityForms.jsx").then(m => ({ default: m.UnitForm }))),
  AreaForm: lazy(() => import("./forms/UtilityForms.jsx").then(m => ({ default: m.AreaForm }))),
  TemperatureForm: lazy(() => import("./forms/UtilityForms.jsx").then(m => ({ default: m.TemperatureForm }))),
  AgeForm: lazy(() => import("./forms/UtilityForms.jsx").then(m => ({ default: m.AgeForm }))),
  DateDiffForm: lazy(() => import("./forms/UtilityForms.jsx").then(m => ({ default: m.DateDiffForm }))),
  CountdownForm: lazy(() => import("./forms/UtilityForms.jsx").then(m => ({ default: m.CountdownForm }))),
  WorkHoursForm: lazy(() => import("./forms/UtilityForms.jsx").then(m => ({ default: m.WorkHoursForm }))),
  FuelForm: lazy(() => import("./forms/UtilityForms.jsx").then(m => ({ default: m.FuelForm }))),
  RandomForm: lazy(() => import("../../modules/everyday/random/RandomGenerator.tsx").then(m => ({ default: m.RandomGenerator }))),
  PasswordForm: lazy(() => import("./forms/UtilityForms.jsx").then(m => ({ default: m.PasswordForm }))),
  RomanForm: lazy(() => import("../../modules/conversion/roman/RomanConverter.tsx").then(m => ({ default: m.RomanConverter }))),
  WordCountForm: lazy(() => import("../../modules/everyday/word-count/WordCountCalculator.tsx").then(m => ({ default: m.WordCountCalculator }))),
  Base64Form: lazy(() => import("../../modules/everyday/base64/Base64Encoder.tsx").then(m => ({ default: m.Base64Encoder }))),
  PeriodForm: lazy(() => import("./forms/PeriodForm.jsx").then(m => ({ default: m.PeriodForm }))),
  EVChargingForm: lazy(() => import("../../modules/everyday/ev-charging/EVChargingCalculator.tsx").then(m => ({ default: m.EVChargingCalculator }))),
  LengthConverter: lazy(() => import("../../modules/conversion/length/LengthConverter.tsx").then(m => ({ default: m.LengthConverter }))),
};

// Construction forms
const Construction = {
  ConcreteForm: lazy(() => import("./forms/ConstructionForms.jsx").then(m => ({ default: m.ConcreteForm }))),
  PaintForm: lazy(() => import("./forms/ConstructionForms.jsx").then(m => ({ default: m.PaintForm }))),
  SquareFootageForm: lazy(() => import("./forms/ConstructionForms.jsx").then(m => ({ default: m.SquareFootageForm }))),
  ConstructionCostForm: lazy(() => import("./forms/ConstructionForms.jsx").then(m => ({ default: m.ConstructionCostForm }))),
  ElectricalLoadForm: lazy(() => import("./forms/ConstructionForms.jsx").then(m => ({ default: m.ElectricalLoadForm }))),
  DensityForm: lazy(() => import("./forms/ConstructionForms.jsx").then(m => ({ default: m.DensityForm }))),
  PressureForm: lazy(() => import("./forms/ConstructionForms.jsx").then(m => ({ default: m.PressureForm }))),
  PipeVolumeForm: lazy(() => import("./forms/ConstructionForms.jsx").then(m => ({ default: m.PipeVolumeForm }))),
  MaterialForm: lazy(() => import("./forms/ConstructionForms.jsx").then(m => ({ default: m.MaterialForm }))),
  CubicYardForm: lazy(() => import("./forms/ConstructionForms.jsx").then(m => ({ default: m.CubicYardForm }))),
  RoofingForm: lazy(() => import("./forms/ConstructionForms.jsx").then(m => ({ default: m.RoofingForm }))),
};

// Technology forms
const Tech = {
  SubnetForm: lazy(() => import("./forms/TechForms.jsx").then(m => ({ default: m.SubnetForm }))),
  NumberBaseForm: lazy(() => import("./forms/TechForms.jsx").then(m => ({ default: m.NumberBaseForm }))),
  ASCIIForm: lazy(() => import("./forms/TechForms.jsx").then(m => ({ default: m.ASCIIForm }))),
  DataTransferForm: lazy(() => import("./forms/TechForms.jsx").then(m => ({ default: m.DataTransferForm }))),
  PasswordStrengthForm: lazy(() => import("./forms/TechForms.jsx").then(m => ({ default: m.PasswordStrengthForm }))),
  HashGeneratorForm: lazy(() => import("./forms/TechForms.jsx").then(m => ({ default: m.HashGeneratorForm }))),
  RandomStringForm: lazy(() => import("./forms/TechForms.jsx").then(m => ({ default: m.RandomStringForm }))),
  BandwidthForm: lazy(() => import("./forms/TechForms.jsx").then(m => ({ default: m.BandwidthForm }))),
  IPRangeForm: lazy(() => import("./forms/TechForms.jsx").then(m => ({ default: m.IPRangeForm }))),
  HexForm: lazy(() => import("./forms/TechForms.jsx").then(m => ({ default: m.HexForm }))),
};

// Business forms
const Business = {
  MarkupForm: lazy(() => import("./forms/BusinessForms.jsx").then(m => ({ default: m.MarkupForm }))),
  InventoryTurnoverForm: lazy(() => import("./forms/BusinessForms.jsx").then(m => ({ default: m.InventoryTurnoverForm }))),
  EOQForm: lazy(() => import("./forms/BusinessForms.jsx").then(m => ({ default: m.EOQForm }))),
  TimeCardForm: lazy(() => import("./forms/BusinessForms.jsx").then(m => ({ default: m.TimeCardForm }))),
  OvertimeForm: lazy(() => import("./forms/BusinessForms.jsx").then(m => ({ default: m.OvertimeForm }))),
  SalaryToHourlyForm: lazy(() => import("./forms/BusinessForms.jsx").then(m => ({ default: m.SalaryToHourlyForm }))),
  MeetingCostForm: lazy(() => import("./forms/BusinessForms.jsx").then(m => ({ default: m.MeetingCostForm }))),
  ConversionRateForm: lazy(() => import("./forms/BusinessForms.jsx").then(m => ({ default: m.ConversionRateForm }))),
  CLVForm: lazy(() => import("./forms/BusinessForms.jsx").then(m => ({ default: m.CLVForm }))),
  CPCCPAForm: lazy(() => import("./forms/BusinessForms.jsx").then(m => ({ default: m.CPCCPAForm }))),
  EmployeeCostForm: lazy(() => import("./forms/BusinessForms.jsx").then(m => ({ default: m.EmployeeCostForm }))),
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

const FORMS = {
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
  "fd-calculator":                     Finance.FDForm,
  "loan-comparison-calculator":        Finance.LoanCompareForm,

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
  "length-converter":                  () => <Utility.UnitForm type="length" />,
  "weight-converter":                  () => <Utility.UnitForm type="weight" />,
  "temperature-converter":             Utility.TemperatureForm,
  "speed-converter":                   () => <Utility.UnitForm type="speed" />,
  "data-storage-converter":            () => <Utility.UnitForm type="data" />,
  "area-converter":                    () => <Utility.UnitForm type="area" />,
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
  "sand-calculator":                   () => <Construction.MaterialForm type="sand" />,
  "gravel-calculator":                 () => <Construction.MaterialForm type="gravel" />,
  "cement-calculator":                 () => <Construction.MaterialForm type="cement" />,
  "asphalt-calculator":                () => <Construction.MaterialForm type="asphalt" />,
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

  // ── Health (new) ──────────────────────────────────────────────────
  "bsa-calculator":                    lazy(() => import("./forms/HealthFormsNew.jsx").then(m => ({ default: m.BSAForm }))),
  "bac-calculator":                    lazy(() => import("./forms/HealthFormsNew.jsx").then(m => ({ default: m.BACForm }))),
  "lean-body-mass-calculator":         lazy(() => import("./forms/HealthFormsNew.jsx").then(m => ({ default: m.LeanBodyMassForm }))),
  "protein-calculator":                lazy(() => import("./forms/HealthFormsNew.jsx").then(m => ({ default: m.ProteinForm }))),
  "healthy-weight-calculator":         lazy(() => import("./forms/HealthFormsNew.jsx").then(m => ({ default: m.HealthyWeightForm }))),
  "fat-intake-calculator":             lazy(() => import("./forms/HealthFormsNew.jsx").then(m => ({ default: m.FatIntakeForm }))),
  "army-body-fat-calculator":          lazy(() => import("./forms/HealthFormsNew.jsx").then(m => ({ default: m.ArmyBodyFatForm }))),

  // ── Math (new) ────────────────────────────────────────────────────
  "lcm-gcf-calculator":                lazy(() => import("./forms/MathFormsNew.jsx").then(m => ({ default: m.LCMGCFForm }))),
  "factor-calculator":                 lazy(() => import("./forms/MathFormsNew.jsx").then(m => ({ default: m.FactorForm }))),
  "triangle-calculator":               lazy(() => import("./forms/MathFormsNew.jsx").then(m => ({ default: m.TriangleForm }))),
  "circle-calculator":                 lazy(() => import("./forms/MathFormsNew.jsx").then(m => ({ default: m.CircleForm }))),
  "volume-calculator":                 lazy(() => import("./forms/MathFormsNew.jsx").then(m => ({ default: m.VolumeForm }))),
  "z-score-calculator":                lazy(() => import("./forms/MathFormsNew.jsx").then(m => ({ default: m.ZScoreForm }))),
  "permutation-combination-calculator": lazy(() => import("./forms/MathFormsNew.jsx").then(m => ({ default: m.PermCombForm }))),
  "average-calculator":                lazy(() => import("./forms/MathFormsNew.jsx").then(m => ({ default: m.AverageForm }))),
  "percent-error-calculator":          lazy(() => import("./forms/MathFormsNew.jsx").then(m => ({ default: m.PercentErrorForm }))),
  "linear-equation-solver":            lazy(() => import("./forms/MathFormsNew.jsx").then(m => ({ default: m.LinearEquationForm }))),
  "distance-calculator":               lazy(() => import("./forms/MathFormsNew.jsx").then(m => ({ default: m.DistanceForm }))),
};

export function CalculatorWidget({ calc }) {
  const { setActiveCalc } = useAppStore();
  
  useEffect(() => { 
    if (calc) setActiveCalc(calc);
  }, [calc, setActiveCalc]);

  const FormComponent = FORMS[calc?.slug];

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
