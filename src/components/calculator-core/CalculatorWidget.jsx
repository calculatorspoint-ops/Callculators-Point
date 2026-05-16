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
  // Finance
  "loan-emi-calculator":          Finance.EMIForm,
  "mortgage-calculator":          Finance.EMIForm,
  "compound-interest-calculator": Finance.CompoundForm,
  "sip-calculator":               Finance.SIPForm,
  "simple-interest-calculator":   Finance.SimpleInterestForm,
  "roi-calculator":               Finance.ROIForm,
  "salary-calculator":            Finance.SalaryForm,
  "discount-calculator":          Finance.DiscountForm,
  "profit-margin-calculator":     Finance.ProfitMarginForm,
  "break-even-calculator":        Finance.BreakEvenForm,
  "tax-calculator":               Finance.TaxForm,
  "tip-calculator":               Finance.TipForm,
  "gst-calculator":               Finance.GSTForm,
  "ppf-calculator":               Finance.PPFForm,

  // Health
  "bmi-calculator":               Health.BMIForm,
  "calorie-calculator":           Health.CalorieForm,
  "bmr-calculator":               Health.BMRForm,
  "body-fat-calculator":          Health.BodyFatForm,
  "ideal-weight-calculator":      Health.IdealWeightForm,
  "macro-calculator":             Health.MacroForm,
  "water-intake-calculator":      Health.WaterForm,
  "heart-rate-calculator":        Health.HeartRateForm,
  "pregnancy-due-date":           Health.PregnancyForm,
  "one-rep-max-calculator":       Health.OneRMForm,

  // Math
  "percentage-calculator":        MathCalcs.PercentageForm,
  "scientific-calculator":        MathCalcs.ScientificForm,
  "statistics-calculator":        MathCalcs.StatsForm,
  "quadratic-calculator":         MathCalcs.QuadraticForm,
  "pythagorean-calculator":       MathCalcs.PythagoreanForm,
  "fraction-calculator":          MathCalcs.FractionForm,
  "gpa-calculator":               MathCalcs.GPAForm,
  "grade-calculator":             MathCalcs.GPAForm,
  "final-grade-calculator":       MathCalcs.GPAForm,
  "cgpa-percentage-calculator":   MathCalcs.CGPAForm,
  "prime-number-checker":         MathCalcs.PrimeForm,

  // Utility
  "area-calculator":               Utility.AreaForm,
  "length-converter":             () => <Utility.UnitForm type="length" />,
  "weight-converter":             () => <Utility.UnitForm type="weight" />,
  "temperature-converter":        Utility.TemperatureForm,
  "speed-converter":              () => <Utility.UnitForm type="speed" />,
  "data-storage-converter":       () => <Utility.UnitForm type="data" />,
  "area-converter":               () => <Utility.UnitForm type="area" />,
  "age-calculator":               Utility.AgeForm,
  "date-difference-calculator":   Utility.DateDiffForm,
  "countdown-calculator":         Utility.CountdownForm,
  "work-hours-calculator":        Utility.WorkHoursForm,
  "fuel-cost-calculator":         Utility.FuelForm,
  "random-number-generator":      Utility.RandomForm,
  "password-generator":           Utility.PasswordForm,
  "roman-numeral-converter":      Utility.RomanForm,
  "word-counter":                 Utility.WordCountForm,
  "base64-encoder":               Utility.Base64Form,
  "period-calculator":            Utility.PeriodForm,
  "ev-charging-calculator":       Utility.EVChargingForm,
};

export function CalculatorWidget({ calc }) {
  const { addRecent, setActiveCalc } = useAppStore();
  
  useEffect(() => { 
    if (calc) {
      addRecent(calc.id); 
      setActiveCalc(calc);
    }
  }, [calc, addRecent, setActiveCalc]);

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
