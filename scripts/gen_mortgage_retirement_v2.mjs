import { writeFileSync } from 'fs';

// ── MortgageForms.jsx ────────────────────────────────────────────────────────
const MORTGAGE = `import { useState, useEffect } from "react";
import {
  N, Sl, Sel, Tabs, Row2, Presets,
  Panel, buildResult, useCurrency,
  InputSection, SEOSection
} from "./SharedComponents.jsx";

function CalcLayout({ inputs, result, label }) {
  return (
    <div className="calc-form-stack">
      <div>{inputs}</div>
      <Panel result={result} loading={null} label={label} />
    </div>
  );
}

// ─── Mortgage Calculator ────────────────────────────────────────────────────
export function MortgageForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [homePrice, setHomePrice] = useState(5000000);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [termYrs, setTermYrs] = useState(20);
  const [propTax, setPropTax] = useState(1.2);
  const [insurance, setInsurance] = useState(12000);
  const [view, setView] = useState("Monthly");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const down = homePrice * (downPct / 100);
    const loan = homePrice - down;
    const r = rate / 100 / 12;
    const n = termYrs * 12;
    const emi = r > 0
      ? (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      : loan / n;
    const totalPI = emi * n;
    const totalInterest = totalPI - loan;
    const monthlyTax = homePrice * (propTax / 100) / 12;
    const monthlyIns = insurance / 12;
    const totalMonthly = emi + monthlyTax + monthlyIns;
    const ltv = (loan / homePrice) * 100;
    const pmi = ltv > 80 ? loan * 0.005 / 12 : 0;

    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + n);

    // Amortization (first 12 months)
    const amTable = [];
    let bal = loan;
    for (let i = 1; i <= Math.min(n, view === "Monthly" ? 12 : termYrs); i++) {
      const int = bal * r;
      const prin = emi - int;
      bal -= prin;
      if (view === "Yearly") {
        if (i % 12 === 0) amTable.push({ label: "Year " + (i / 12), value: "Principal " + fm(Math.round(prin * 12)) + " | Balance " + fm(Math.max(0, Math.round(bal))) });
      } else {
        amTable.push({ label: "Month " + i, value: "P " + fm(Math.round(prin)) + " | I " + fm(Math.round(int)) + " | Bal " + fm(Math.max(0, Math.round(bal))) });
      }
    }

    setRes(buildResult(
      "Monthly Payment (P&I)", fm(Math.round(emi)),
      [
        { label: "Down Payment", value: fm(Math.round(down)) + " (" + downPct + "%)" },
        { label: "Loan Amount", value: fm(Math.round(loan)) },
        { label: "Total Monthly Cost", value: fm(Math.round(totalMonthly + pmi)), highlight: true },
        { label: "Total Interest Paid", value: fm(Math.round(totalInterest)), warn: true },
        { label: "LTV Ratio", value: ltv.toFixed(1) + "%" + (pmi > 0 ? " (PMI applies)" : "") },
        { label: "Payoff Date", value: payoffDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }) },
        { label: "Property Tax /mo", value: fm(Math.round(monthlyTax)) },
        { label: "Insurance /mo", value: fm(Math.round(monthlyIns)) },
        pmi > 0 ? { label: "PMI /mo", value: fm(Math.round(pmi)), warn: true } : null,
      ].filter(Boolean),
      [
        { type: ltv > 80 ? "warn" : "tip", msg: ltv > 80 ? "LTV is " + ltv.toFixed(0) + "% — PMI of " + fm(Math.round(pmi)) + "/mo applies until balance drops below 80%. Consider a larger down payment." : "Your LTV of " + ltv.toFixed(0) + "% is below 80% — no PMI required! Total interest over " + termYrs + " years: " + fm(Math.round(totalInterest)) + "." }
      ],
      { type: "donut", data: [{ name: "Principal", value: Math.round(loan) }, { name: "Interest", value: Math.round(totalInterest) }], keys: ["value"] },
      amTable
    ));
  }, [homePrice, downPct, rate, termYrs, propTax, insurance, view]);

  const inputs = (
    <>
      <Presets items={[
        { label: "Mumbai 50L Home", v: { hp: 5000000, dp: 20, r: 8.5, t: 20 } },
        { label: "Affordable 25L", v: { hp: 2500000, dp: 10, r: 8.75, t: 30 } },
        { label: "Luxury 2Cr", v: { hp: 20000000, dp: 25, r: 8.4, t: 15 } },
      ]} onApply={pr => { setHomePrice(pr.v.hp); setDownPct(pr.v.dp); setRate(pr.v.r); setTermYrs(pr.v.t); }} />
      <div className="calc-inputs-grid">
        <InputSection title="Loan Details" icon="🏠" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
          <Sl label="Home Price" id="m_hp" min={500000} max={100000000} step={100000} value={homePrice} onChange={setHomePrice} fmt={v => fmSlider(v)} />
          <Sl label="Down Payment %" id="m_dp" min={5} max={50} value={downPct} onChange={setDownPct} fmt={v => v + "% = " + fmSlider(homePrice * v / 100)} />
          <Sl label="Interest Rate (% p.a.)" id="m_r" min={6} max={15} step={0.05} value={rate} onChange={setRate} fmt={v => v + "%"} />
          <Sl label="Loan Term (Years)" id="m_t" min={5} max={30} step={5} value={termYrs} onChange={setTermYrs} fmt={v => v + " years"} />
        </InputSection>
        <InputSection title="Monthly Costs" icon="📋" gradient="linear-gradient(135deg,#4361ee,#3451c7)">
          <Sl label="Property Tax (% per year)" id="m_pt" min={0.5} max={3} step={0.1} value={propTax} onChange={setPropTax} fmt={v => v + "% = " + fmSlider(homePrice * v / 100 / 12) + "/mo"} />
          <N label="Home Insurance (yearly)" id="m_ins" value={String(insurance)} onChange={v => setInsurance(+v)} unit={sym} placeholder="12000" hint="Annual home insurance premium" />
          <Tabs tabs={["Monthly", "Yearly"]} active={view} onChange={setView} />
        </InputSection>
      </div>
    </>
  );
  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="Mortgage" />
      <SEOSection title="How Home Loan EMI is Calculated">
        <p>EMI = P × r × (1+r)^n ÷ ((1+r)^n − 1). A 20-year home loan at 8.5% on ₹50L means EMI of ~₹43,000. Down payment below 20% triggers PMI (Private Mortgage Insurance) — typically 0.5% of loan value per year. Property tax and insurance add 20–35% on top of your P&I payment. Use the amortization table to understand how much goes to principal vs interest each month.</p>
      </SEOSection>
    </>
  );
}

// ─── House Affordability ─────────────────────────────────────────────────────
export function HouseAffordabilityForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [monthlyIncome, setMonthlyIncome] = useState(150000);
  const [monthlyDebts, setMonthlyDebts] = useState(20000);
  const [rate, setRate] = useState(8.5);
  const [termYrs, setTermYrs] = useState(20);
  const [downPct, setDownPct] = useState(20);
  const [res, setRes] = useState(null);

  useEffect(() => {
    // 28% front-end limit, 36% back-end limit
    const maxFront = monthlyIncome * 0.28;
    const maxBack = monthlyIncome * 0.36 - monthlyDebts;
    const maxEMI = Math.min(maxFront, Math.max(0, maxBack));
    const r = rate / 100 / 12;
    const n = termYrs * 12;
    const maxLoan = maxEMI > 0 && r > 0
      ? maxEMI * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n))
      : 0;
    const maxHome = maxLoan / (1 - downPct / 100);
    const frontRatio = (maxEMI / monthlyIncome) * 100;
    const backRatio = ((maxEMI + monthlyDebts) / monthlyIncome) * 100;
    const dti = ((monthlyDebts) / monthlyIncome) * 100;

    setRes(buildResult(
      "Max Home Price", fm(Math.round(maxHome)),
      [
        { label: "Max Loan Amount", value: fm(Math.round(maxLoan)), highlight: true },
        { label: "Max Monthly EMI", value: fm(Math.round(maxEMI)) },
        { label: "Front-End Ratio", value: frontRatio.toFixed(1) + "% (target ≤28%)", warn: frontRatio > 28 },
        { label: "Back-End Ratio (DTI)", value: backRatio.toFixed(1) + "% (target ≤36%)", warn: backRatio > 36 },
        { label: "Current Debt Burden", value: dti.toFixed(1) + "% of income", warn: dti > 20 },
        { label: "Down Payment Needed", value: fm(Math.round(maxHome * downPct / 100)) },
      ],
      [{ type: backRatio > 43 ? "bad" : backRatio > 36 ? "warn" : "tip", msg: backRatio > 43 ? "DTI of " + backRatio.toFixed(0) + "% exceeds 43% — most lenders will reject the application. Reduce existing debts or increase income." : backRatio > 36 ? "DTI is slightly high (" + backRatio.toFixed(0) + "%). Some lenders accept up to 43% but it limits your options." : "Good DTI of " + backRatio.toFixed(0) + "%. You can comfortably afford a home up to " + fm(Math.round(maxHome)) + "." }],
      null, []
    ));
  }, [monthlyIncome, monthlyDebts, rate, termYrs, downPct]);

  const inputs = (
    <div className="calc-inputs-grid">
      <InputSection title="Your Finances" icon="💼" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
        <Sl label="Gross Monthly Income" id="ha_inc" min={30000} max={1000000} step={5000} value={monthlyIncome} onChange={setMonthlyIncome} fmt={v => fmSlider(v)} />
        <Sl label="Existing Monthly Debts (EMIs)" id="ha_dbt" min={0} max={200000} step={2000} value={monthlyDebts} onChange={setMonthlyDebts} fmt={v => fmSlider(v)} />
      </InputSection>
      <InputSection title="Loan Parameters" icon="🏦" gradient="linear-gradient(135deg,#4361ee,#3451c7)">
        <Sl label="Interest Rate (%)" id="ha_r" min={6} max={14} step={0.25} value={rate} onChange={setRate} fmt={v => v + "%"} />
        <Sl label="Loan Term (Years)" id="ha_t" min={5} max={30} step={5} value={termYrs} onChange={setTermYrs} fmt={v => v + " years"} />
        <Sl label="Down Payment %" id="ha_dp" min={5} max={50} step={5} value={downPct} onChange={setDownPct} fmt={v => v + "%"} />
      </InputSection>
    </div>
  );
  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="House Affordability" />
      <SEOSection title="How Much House Can You Afford?">
        <p>Banks use the 28/36 rule: housing costs ≤ 28% of gross income (front-end), total debt ≤ 36% (back-end). Some lenders allow up to 43% DTI. This calculator gives you the maximum — but buy at 80–90% of the max to keep financial breathing room.</p>
      </SEOSection>
    </>
  );
}

// ─── Rent vs Buy ─────────────────────────────────────────────────────────────
export function RentVsBuyForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [monthlyRent, setMonthlyRent] = useState(25000);
  const [rentIncrease, setRentIncrease] = useState(5);
  const [homePrice, setHomePrice] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [downPct, setDownPct] = useState(20);
  const [propTax, setPropTax] = useState(1.2);
  const [hoa, setHoa] = useState(3000);
  const [maintenance, setMaintenance] = useState(1);
  const [years, setYears] = useState(5);
  const [res, setRes] = useState(null);

  useEffect(() => {
    // Renting cost
    let rentTotal = 0, rent = monthlyRent;
    for (let y = 0; y < years; y++) {
      rentTotal += rent * 12;
      rent *= (1 + rentIncrease / 100);
    }

    // Buying cost
    const down = homePrice * (downPct / 100);
    const loan = homePrice - down;
    const r = rate / 100 / 12;
    const n = 20 * 12;
    const emi = r > 0 ? (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : loan / n;
    const monthlyTax = homePrice * (propTax / 100) / 12;
    const monthlyMaint = homePrice * (maintenance / 100) / 12;
    const monthlyTotal = emi + monthlyTax + hoa + monthlyMaint;
    const buyTotal = down + monthlyTotal * years * 12;

    // Equity built
    let bal = loan;
    for (let i = 0; i < years * 12; i++) {
      const int = bal * r;
      const prin = emi - int;
      bal -= prin;
    }
    const equity = loan - bal;
    const appreciatedValue = homePrice * Math.pow(1.05, years);
    const totalEquity = equity + (appreciatedValue - homePrice);

    const breakEvenYr = Math.round((down / (monthlyRent * 12 - emi * 12)) * 10) / 10;

    const yearlyData = [];
    let cumRent = 0, cumBuy = down, rb = loan;
    for (let y = 1; y <= years; y++) {
      cumRent += monthlyRent * 12 * Math.pow(1 + rentIncrease / 100, y - 1);
      cumBuy += monthlyTotal * 12;
      yearlyData.push({ year: "Y" + y, Renting: Math.round(cumRent), Buying: Math.round(cumBuy) });
    }

    setRes(buildResult(
      "5-Year Rent Cost", fm(Math.round(rentTotal)),
      [
        { label: "Total Rent (" + years + " yrs)", value: fm(Math.round(rentTotal)), warn: true },
        { label: "Total Buy Cost (" + years + " yrs)", value: fm(Math.round(buyTotal)), warn: true },
        { label: "Equity Built", value: fm(Math.round(totalEquity)), highlight: buyTotal < rentTotal },
        { label: "Net Buy Advantage", value: buyTotal < rentTotal ? fm(Math.round(rentTotal - buyTotal + totalEquity)) : "Renting saves " + fm(Math.round(buyTotal - rentTotal)), highlight: buyTotal < rentTotal },
        { label: "Monthly Rent", value: fm(Math.round(monthlyRent)) },
        { label: "Monthly Buy Cost", value: fm(Math.round(monthlyTotal)) },
        { label: "Down Payment", value: fm(Math.round(down)) },
      ],
      [{ type: buyTotal - totalEquity < rentTotal ? "tip" : "info", msg: buyTotal - totalEquity < rentTotal ? "Buying wins over " + years + " years after accounting for equity. Break-even at ~year " + Math.max(1, Math.round(breakEvenYr)) + "." : "Renting is cheaper over " + years + " years. Consider buying if you plan to stay 7+ years." }],
      { type: "bar", data: yearlyData, keys: ["Renting", "Buying"] },
      [
        { label: "Rent: " + years + "-yr total", value: fm(Math.round(rentTotal)), bold: false },
        { label: "Buy: Down Payment", value: fm(Math.round(down)) },
        { label: "Buy: Monthly (EMI+Tax+HOA)", value: fm(Math.round(monthlyTotal)) + "/mo" },
        { label: "Equity after " + years + " yrs", value: fm(Math.round(totalEquity)), bold: true },
        { label: "Net Cost of Buying", value: fm(Math.round(buyTotal - totalEquity)), bold: true },
      ]
    ));
  }, [monthlyRent, rentIncrease, homePrice, rate, downPct, propTax, hoa, maintenance, years]);

  const inputs = (
    <>
      <Presets items={[
        { label: "Metro City 5yr", v: { mr: 35000, ri: 6, hp: 8000000, r: 8.5, dp: 20 } },
        { label: "Tier-2 City 5yr", v: { mr: 15000, ri: 5, hp: 3500000, r: 8.75, dp: 15 } },
        { label: "10yr Compare", v: { mr: 25000, ri: 5, hp: 5000000, r: 8.5, dp: 20 } },
      ]} onApply={pr => { setMonthlyRent(pr.v.mr); setRentIncrease(pr.v.ri); setHomePrice(pr.v.hp); setRate(pr.v.r); setDownPct(pr.v.dp); }} />
      <div className="calc-inputs-grid">
        <InputSection title="Renting Costs" icon="🏢" gradient="linear-gradient(135deg,#4361ee,#3451c7)">
          <Sl label="Monthly Rent" id="rvb_mr" min={5000} max={200000} step={1000} value={monthlyRent} onChange={setMonthlyRent} fmt={v => fmSlider(v)} />
          <Sl label="Annual Rent Increase %" id="rvb_ri" min={0} max={15} step={0.5} value={rentIncrease} onChange={setRentIncrease} fmt={v => v + "%"} />
          <Sl label="Comparison Period (Years)" id="rvb_y" min={1} max={15} value={years} onChange={setYears} fmt={v => v + " years"} />
        </InputSection>
        <InputSection title="Buying Costs" icon="🏠" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
          <Sl label="Home Price" id="rvb_hp" min={1000000} max={50000000} step={500000} value={homePrice} onChange={setHomePrice} fmt={v => fmSlider(v)} />
          <Sl label="Down Payment %" id="rvb_dp" min={5} max={40} step={5} value={downPct} onChange={setDownPct} fmt={v => v + "%"} />
          <Sl label="Mortgage Rate %" id="rvb_r" min={6} max={14} step={0.25} value={rate} onChange={setRate} fmt={v => v + "%"} />
          <Sl label="Property Tax % / yr" id="rvb_pt" min={0.5} max={3} step={0.1} value={propTax} onChange={setPropTax} fmt={v => v + "%"} />
          <N label="HOA / Society Maintenance /mo" id="rvb_hoa" value={String(hoa)} onChange={v => setHoa(+v)} unit={sym} placeholder="3000" hint="Monthly society charges / HOA fees" />
        </InputSection>
      </div>
    </>
  );
  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="Rent vs Buy" />
      <SEOSection title="Rent vs Buy — Which Makes More Financial Sense?">
        <p>The answer depends on your timeline, city, and interest rates. Buying wins when you plan to stay 7+ years and the mortgage payment is close to rent. Renting wins short-term due to the opportunity cost of the down payment. This calculator accounts for rent inflation, home appreciation (~5%/yr assumed), equity buildup, and total buy costs to give you the full picture.</p>
      </SEOSection>
    </>
  );
}
`;

// ── RetirementForms.jsx ──────────────────────────────────────────────────────
const RETIREMENT = `import { useState, useEffect } from "react";
import {
  N, Sl, Sel, Row2, Presets,
  Panel, buildResult, useCurrency,
  InputSection, SEOSection
} from "./SharedComponents.jsx";

function CalcLayout({ inputs, result, label }) {
  return (
    <div className="calc-form-stack">
      <div>{inputs}</div>
      <Panel result={result} loading={null} label={label} />
    </div>
  );
}

// ─── Retirement Plan ─────────────────────────────────────────────────────────
export function RetirementPlanForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [currentAge, setCurrentAge] = useState(30);
  const [retireAge, setRetireAge] = useState(60);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [returnRate, setReturnRate] = useState(12);
  const [inflationRate, setInflationRate] = useState(6);
  const [monthlyExpenses, setMonthlyExpenses] = useState(50000);
  const [withdrawRate, setWithdrawRate] = useState(4);
  const [res, setRes] = useState(null);

  useEffect(() => {
    const yearsToRetire = retireAge - currentAge;
    if (yearsToRetire <= 0) return;

    // Corpus needed at retirement (inflation-adjusted expenses, 4% withdraw rule)
    const inflatedMonthly = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRetire);
    const annualNeeded = inflatedMonthly * 12;
    const corpusNeeded = annualNeeded / (withdrawRate / 100);

    // Projected corpus from existing savings
    const projectedFromSavings = currentSavings * Math.pow(1 + returnRate / 100, yearsToRetire);

    // Shortfall
    const shortfall = Math.max(0, corpusNeeded - projectedFromSavings);

    // Monthly SIP needed to cover shortfall
    const r = returnRate / 100 / 12;
    const n = yearsToRetire * 12;
    const sipNeeded = shortfall > 0 && r > 0
      ? shortfall * r / (Math.pow(1 + r, n) - 1)
      : 0;

    // Yearly growth chart (projected corpus)
    const yearlyData = [];
    for (let y = 5; y <= yearsToRetire; y += 5) {
      const proj = currentSavings * Math.pow(1 + returnRate / 100, y);
      yearlyData.push({ label: "Age " + (currentAge + y), value: fm(Math.round(proj)) });
    }

    const surplus = projectedFromSavings - corpusNeeded;

    setRes(buildResult(
      "Required Retirement Corpus", fm(Math.round(corpusNeeded)),
      [
        { label: "Years to Retire", value: yearsToRetire + " years" },
        { label: "Projected Corpus (savings only)", value: fm(Math.round(projectedFromSavings)), highlight: surplus > 0, warn: surplus < 0 },
        { label: surplus > 0 ? "Corpus Surplus" : "Corpus Shortfall", value: fm(Math.round(Math.abs(surplus))), highlight: surplus > 0, warn: surplus < 0 },
        { label: "Monthly SIP Needed (extra)", value: sipNeeded > 0 ? fm(Math.round(sipNeeded)) : "On Track! ✅", highlight: sipNeeded === 0 },
        { label: "Inflation-Adj Monthly Need at " + retireAge, value: fm(Math.round(inflatedMonthly)) },
        { label: "Post-Retirement Annual Income", value: fm(Math.round(annualNeeded)) },
      ],
      [{ type: surplus > 0 ? "tip" : "warn", msg: surplus > 0 ? "Great news! Your current savings of " + fm(currentSavings) + " will grow to " + fm(Math.round(projectedFromSavings)) + " — exceeding your target of " + fm(Math.round(corpusNeeded)) + "." : "You need an additional SIP of " + fm(Math.round(sipNeeded)) + "/month to bridge the gap of " + fm(Math.round(Math.abs(surplus))) + ". Start now — every year of delay increases the required SIP." }],
      { type: "bar", data: yearlyData.map(y => ({ year: y.label, Corpus: Math.round(currentSavings * Math.pow(1 + returnRate / 100, currentAge + parseInt(y.label.replace("Age ", "")) - currentAge)) })), keys: ["Corpus"] },
      yearlyData
    ));
  }, [currentAge, retireAge, currentSavings, returnRate, inflationRate, monthlyExpenses, withdrawRate]);

  const inputs = (
    <>
      <Presets items={[
        { label: "Early Retire 45", v: { ca: 28, ra: 45, cs: 1000000, ret: 14, inf: 6, me: 80000, wr: 4 } },
        { label: "Standard 60", v: { ca: 30, ra: 60, cs: 500000, ret: 12, inf: 6, me: 50000, wr: 4 } },
        { label: "Conservative", v: { ca: 35, ra: 60, cs: 2000000, ret: 10, inf: 6, me: 60000, wr: 3.5 } },
      ]} onApply={pr => { setCurrentAge(pr.v.ca); setRetireAge(pr.v.ra); setCurrentSavings(pr.v.cs); setReturnRate(pr.v.ret); setInflationRate(pr.v.inf); setMonthlyExpenses(pr.v.me); setWithdrawRate(pr.v.wr); }} />
      <div className="calc-inputs-grid">
        <InputSection title="Current Status" icon="👤" gradient="linear-gradient(135deg,#d97706,#b45309)">
          <Sl label="Current Age" id="rp_ca" min={20} max={55} value={currentAge} onChange={setCurrentAge} fmt={v => v + " years"} />
          <Sl label="Retirement Age" id="rp_ra" min={40} max={70} value={retireAge} onChange={setRetireAge} fmt={v => v + " years"} />
          <Sl label="Current Savings / Investments" id="rp_cs" min={0} max={50000000} step={50000} value={currentSavings} onChange={setCurrentSavings} fmt={v => fmSlider(v)} />
        </InputSection>
        <InputSection title="Growth & Needs" icon="📈" gradient="linear-gradient(135deg,#059669,#047857)">
          <Sl label="Expected Return (% p.a.)" id="rp_ret" min={6} max={20} step={0.5} value={returnRate} onChange={setReturnRate} fmt={v => v + "%"} />
          <Sl label="Expected Inflation (% p.a.)" id="rp_inf" min={3} max={10} step={0.5} value={inflationRate} onChange={setInflationRate} fmt={v => v + "%"} />
          <Sl label="Monthly Expenses Needed (today's value)" id="rp_me" min={10000} max={500000} step={5000} value={monthlyExpenses} onChange={setMonthlyExpenses} fmt={v => fmSlider(v)} />
          <Sl label="Withdrawal Rate (%)" id="rp_wr" min={2} max={6} step={0.5} value={withdrawRate} onChange={setWithdrawRate} fmt={v => v + "%"} />
        </InputSection>
      </div>
    </>
  );
  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="Retirement Plan" />
      <SEOSection title="How Much Do You Need to Retire?">
        <p>The 4% rule: a 4% withdrawal rate from a diversified portfolio is historically sustainable for 30+ years. Multiply your annual expenses by 25 to get your corpus target. Inflation doubles prices every 12 years at 6% — so ₹50,000 today will feel like ₹25,000 in purchasing power 12 years later. Start saving early and increase your SIP annually by your salary hike rate.</p>
      </SEOSection>
    </>
  );
}

// ─── NPS Calculator ───────────────────────────────────────────────────────────
export function NPSForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [monthlyContrib, setMonthlyContrib] = useState(10000);
  const [currentAge, setCurrentAge] = useState(30);
  const [retireAge, setRetireAge] = useState(60);
  const [returnRate, setReturnRate] = useState(10);
  const [annuityRate, setAnnuityRate] = useState(6);
  const [annuityPct, setAnnuityPct] = useState(40);
  const [employerContrib, setEmployerContrib] = useState("10");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const years = retireAge - currentAge;
    if (years <= 0) return;
    const r = returnRate / 100 / 12;
    const n = years * 12;
    const totalMonthly = monthlyContrib * (1 + +employerContrib / 100);
    const maturity = totalMonthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const lumpsum = maturity * 0.60;
    const annuityCorpus = maturity * (annuityPct / 100);
    const monthlyPension = (annuityCorpus * annuityRate / 100) / 12;
    const totalInvested = monthlyContrib * n;
    const returns = maturity - totalInvested * (1 + +employerContrib / 100);

    // Tax savings
    const taxSaving80C = Math.min(monthlyContrib * 12, 150000) * 0.30;
    const taxSaving80CCD1B = 50000 * 0.30;
    const totalTaxSaving = taxSaving80C + taxSaving80CCD1B;

    const yearlyData = [];
    for (let y = 5; y <= years; y += 5) {
      const nn = y * 12;
      const fv = totalMonthly * ((Math.pow(1 + r, nn) - 1) / r) * (1 + r);
      yearlyData.push({ label: "Age " + (currentAge + y), value: fm(Math.round(fv)) });
    }

    setRes(buildResult(
      "NPS Maturity Corpus", fm(Math.round(maturity)),
      [
        { label: "Your Contribution", value: fm(monthlyContrib) + "/mo" },
        { label: "Employer Contribution", value: fm(Math.round(monthlyContrib * +employerContrib / 100)) + "/mo" },
        { label: "Lump Sum (60%)", value: fm(Math.round(lumpsum)), highlight: true },
        { label: "Annuity Corpus (" + annuityPct + "%)", value: fm(Math.round(annuityCorpus)) },
        { label: "Monthly Pension", value: fm(Math.round(monthlyPension)), highlight: true },
        { label: "Total Tax Saving (est.)", value: fm(Math.round(totalTaxSaving)) + "/yr", highlight: true },
        { label: "80C Deduction", value: "up to ₹1,50,000" },
        { label: "80CCD(1B) Extra", value: "₹50,000 additional" },
      ],
      [{ type: "tip", msg: "NPS gives triple tax benefit: deduction on contribution (80C + 80CCD1B), tax-free growth, and 60% tax-free lump sum at retirement. Annual tax saving: ~" + fm(Math.round(totalTaxSaving)) + " (at 30% bracket)." }],
      { type: "donut", data: [{ name: "Lump Sum", value: Math.round(lumpsum) }, { name: "Annuity", value: Math.round(annuityCorpus) }], keys: ["value"] },
      yearlyData
    ));
  }, [monthlyContrib, currentAge, retireAge, returnRate, annuityRate, annuityPct, employerContrib]);

  const inputs = (
    <div className="calc-inputs-grid">
      <InputSection title="NPS Contributions" icon="🏛️" gradient="linear-gradient(135deg,#d97706,#b45309)">
        <Sl label="Monthly Contribution (Tier I)" id="nps_mc" min={500} max={100000} step={500} value={monthlyContrib} onChange={setMonthlyContrib} fmt={v => fmSlider(v)} />
        <Sl label="Current Age" id="nps_ca" min={18} max={60} value={currentAge} onChange={setCurrentAge} fmt={v => v + " years"} />
        <Sl label="Retirement Age" id="nps_ra" min={55} max={70} value={retireAge} onChange={setRetireAge} fmt={v => v + " years"} />
        <N label="Employer Contribution %" id="nps_ec" value={employerContrib} onChange={setEmployerContrib} unit="%" placeholder="10" hint="Govt employees: 14%, Private: typically 10%" />
      </InputSection>
      <InputSection title="Return & Annuity Settings" icon="⚙️" gradient="linear-gradient(135deg,#4361ee,#3451c7)">
        <Sl label="Expected Return (% p.a.)" id="nps_ret" min={6} max={14} step={0.5} value={returnRate} onChange={setReturnRate} fmt={v => v + "%"} />
        <Sl label="Annuity Rate (% p.a.)" id="nps_ar" min={4} max={8} step={0.25} value={annuityRate} onChange={setAnnuityRate} fmt={v => v + "%"} />
        <Sl label="Annuity Allocation %" id="nps_ap" min={40} max={100} step={10} value={annuityPct} onChange={setAnnuityPct} fmt={v => v + "% (min 40% required)"} />
      </InputSection>
    </div>
  );
  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="NPS" />
      <SEOSection title="National Pension System (NPS) — Tax Benefits & Maturity">
        <p>NPS is a government-regulated pension scheme with three tax advantages: 80C (up to ₹1.5L), 80CCD(1B) (extra ₹50K — exclusive to NPS), and 80CCD(2) (employer contribution). At retirement (60), 60% can be withdrawn tax-free as lump sum; 40% must buy an annuity. NPS returns have historically been 9–12% in equity-heavy schemes (E tier). Ideal for those in the 30% tax bracket.</p>
      </SEOSection>
    </>
  );
}

// ─── EPF Calculator ──────────────────────────────────────────────────────────
export function EPFForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [basicSalary, setBasicSalary] = useState(50000);
  const [da, setDa] = useState(0);
  const [epfRate, setEpfRate] = useState(12);
  const [returnRate, setReturnRate] = useState(8.15);
  const [years, setYears] = useState(25);
  const [salaryGrowth, setSalaryGrowth] = useState(8);
  const [res, setRes] = useState(null);

  useEffect(() => {
    const base = basicSalary + da;
    let totalCorpus = 0, salary = base, totalInvested = 0;
    const yearlyData = [];

    for (let y = 1; y <= years; y++) {
      const empContrib = salary * (epfRate / 100) * 12;
      const emplrContrib = salary * (epfRate / 100) * 12;
      const yearContrib = empContrib + emplrContrib;
      totalInvested += yearContrib;
      totalCorpus = (totalCorpus + yearContrib) * (1 + returnRate / 100);
      salary *= (1 + salaryGrowth / 100);
      yearlyData.push({ label: "Year " + y, value: fm(Math.round(totalCorpus)) });
    }

    const monthlyContrib = base * (epfRate / 100);
    const emplrMonthly = Math.min(base * 0.12, 1800);
    const pensionContrib = Math.min(base * 0.0833, 1250);
    const pfContrib = emplrMonthly - pensionContrib;

    setRes(buildResult(
      "EPF Corpus at Retirement", fm(Math.round(totalCorpus)),
      [
        { label: "Monthly EPF (Employee)", value: fm(Math.round(monthlyContrib)) },
        { label: "Monthly EPF (Employer)", value: fm(Math.round(emplrMonthly)) },
        { label: "EPS Pension Contrib", value: fm(Math.round(pensionContrib)) + "/mo" },
        { label: "Total Invested", value: fm(Math.round(totalInvested)), highlight: false },
        { label: "Interest Earned", value: fm(Math.round(totalCorpus - totalInvested)), highlight: true },
        { label: "Current EPF Rate", value: returnRate + "% p.a. (tax-free)" },
        { label: "Wealth Multiple", value: (totalCorpus / totalInvested).toFixed(2) + "x" },
      ],
      [{ type: "tip", msg: "EPF earns " + returnRate + "% tax-free — one of India's best guaranteed returns. Your " + years + "-year corpus: " + fm(Math.round(totalCorpus)) + ". Avoid premature withdrawals as they attract TDS and reset the EPS pension clock." }],
      { type: "bar", data: yearlyData.filter((_, i) => i % 5 === 4).map(y => ({ year: y.label.replace("Year ", "Yr "), Corpus: Math.round(totalCorpus * ((parseInt(y.label.replace("Year ", "")) / years))) })), keys: ["Corpus"] },
      yearlyData
    ));
  }, [basicSalary, da, epfRate, returnRate, years, salaryGrowth]);

  const inputs = (
    <div className="calc-inputs-grid">
      <InputSection title="Salary Details" icon="💰" gradient="linear-gradient(135deg,#d97706,#b45309)">
        <Sl label="Basic Salary" id="epf_bs" min={10000} max={500000} step={5000} value={basicSalary} onChange={setBasicSalary} fmt={v => fmSlider(v)} />
        <Sl label="Dearness Allowance (DA)" id="epf_da" min={0} max={100000} step={1000} value={da} onChange={setDa} fmt={v => fmSlider(v)} />
        <Sl label="EPF Contribution Rate %" id="epf_r" min={12} max={20} value={epfRate} onChange={setEpfRate} fmt={v => v + "%"} />
      </InputSection>
      <InputSection title="Growth Assumptions" icon="📈" gradient="linear-gradient(135deg,#059669,#047857)">
        <Sl label="EPF Interest Rate (%)" id="epf_ret" min={7} max={9} step={0.05} value={returnRate} onChange={setReturnRate} fmt={v => v + "% p.a."} />
        <Sl label="Years to Retirement" id="epf_y" min={5} max={40} value={years} onChange={setYears} fmt={v => v + " years"} />
        <Sl label="Annual Salary Growth %" id="epf_sg" min={0} max={20} step={0.5} value={salaryGrowth} onChange={setSalaryGrowth} fmt={v => v + "%"} />
      </InputSection>
    </div>
  );
  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="EPF" />
      <SEOSection title="EPF — Employee Provident Fund Calculator">
        <p>EPF deducts 12% of Basic+DA from your salary (employee share) and employer matches it. Of the employer's 12%, 8.33% (capped at ₹1,250) goes to EPS (pension fund) and the rest to EPF. Current EPF interest rate: 8.15% p.a. — fully tax-exempt under EEE status. Voluntary contributions (VPF) can be up to 100% of Basic+DA for higher returns.</p>
      </SEOSection>
    </>
  );
}
`;

writeFileSync('src/components/calculator-core/forms/MortgageForms.jsx', MORTGAGE, 'utf8');
writeFileSync('src/components/calculator-core/forms/RetirementForms.jsx', RETIREMENT, 'utf8');

console.log('MortgageForms.jsx written:', MORTGAGE.split('\n').length, 'lines');
console.log('RetirementForms.jsx written:', RETIREMENT.split('\n').length, 'lines');
