import { writeFileSync } from "fs";

// ═══════════════════════════════════════════════════════════════
// FILE 1: LoanDebtForms.jsx  (5 calculators)
// ═══════════════════════════════════════════════════════════════

const loanDebtForms = `import { useState, useEffect } from "react";
import { L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency, InputSection, Toggle, SEOSection } from "./SharedComponents.jsx";

function CalcLayout({ inputs, result, label }) {
  return (
    <div className="calc-form-stack">
      <div>{inputs}</div>
      <Panel result={result} loading={null} label={label} />
    </div>
  );
}

// ── Auto Loan Calculator ──────────────────────────────────────────────
export function AutoLoanForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [carPrice, setCarPrice] = useState(800000);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(9.0);
  const [term, setTerm] = useState(5);
  const [salesTax, setSalesTax] = useState("0");
  const [regFee, setRegFee] = useState("5000");
  const [insurance, setInsurance] = useState("15000");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const downAmt = carPrice * (downPct / 100);
    const taxAmt = carPrice * (+salesTax / 100);
    const loanAmt = carPrice - downAmt + taxAmt + (+regFee || 0);
    if (loanAmt <= 0 || !rate || !term) return;
    const r = rate / 100 / 12, n = term * 12;
    const emi = r > 0 ? (loanAmt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : loanAmt / n;
    const totalInterest = emi * n - loanAmt;
    const totalCost = carPrice + taxAmt + (+regFee || 0) + totalInterest;
    const ltv = (loanAmt / carPrice) * 100;
    const depr1yr = carPrice * 0.15;
    const val1yr = carPrice - depr1yr;
    const val5yr = carPrice * Math.pow(0.85, 5);
    const annualInsurance = +insurance || 0;
    const chart = { type: "bar", data: [
      { name: "Car Price", value: Math.round(carPrice) },
      { name: "Down Pmt", value: Math.round(downAmt) },
      { name: "Loan Amt", value: Math.round(loanAmt) },
      { name: "Total Interest", value: Math.round(totalInterest) }
    ], keys: ["value"] };
    setRes(buildResult("Monthly EMI", fm(Math.round(emi)),
      [
        { label: "Car Price", value: fm(carPrice) },
        { label: "Down Payment (" + downPct + "%)", value: fm(Math.round(downAmt)) },
        { label: "Loan Amount", value: fm(Math.round(loanAmt)) },
        { label: "Loan-to-Value Ratio", value: ltv.toFixed(1) + "%", warn: ltv > 80 },
        { label: "Total Interest Paid", value: fm(Math.round(totalInterest)), warn: true },
        { label: "Total Cost (incl. fees)", value: fm(Math.round(totalCost)) },
        { label: "1-Year Depreciation (15%)", value: fm(Math.round(depr1yr)), warn: true },
        { label: "Value After 1 Year", value: fm(Math.round(val1yr)) },
        { label: "Value After 5 Years", value: fm(Math.round(val5yr)) },
        { label: "Annual Insurance Est.", value: fm(annualInsurance) },
      ],
      [{ type: "warn", msg: "Cars lose ~15% value per year. Your " + fm(carPrice) + " car will be worth ~" + fm(Math.round(val5yr)) + " after 5 years. LTV of " + ltv.toFixed(0) + "% — lenders prefer under 80%." }],
      chart,
      [{ label: "Loan Term", value: term + " years (" + n + " months)" }, { label: "Interest Rate", value: rate + "% p.a." }]
    ));
  }, [carPrice, downPct, rate, term, salesTax, regFee, insurance]);

  const applyPreset = (p) => {
    setCarPrice(p.cp); setDownPct(p.dp); setRate(p.r); setTerm(p.t);
    setSalesTax(p.tax || "0"); setRegFee(p.reg || "5000"); setInsurance(p.ins || "15000");
  };

  const inputs = (
    <div className="calc-inputs-grid">
      <Presets items={[
        { label: "Economy Car", v: { cp: 500000, dp: 20, r: 9.5, t: 5, tax: "0", reg: "3000", ins: "10000" } },
        { label: "Mid-Range SUV", v: { cp: 1500000, dp: 25, r: 9.0, t: 7, tax: "0", reg: "8000", ins: "25000" } },
        { label: "Luxury Sedan", v: { cp: 4000000, dp: 30, r: 8.5, t: 5, tax: "0", reg: "15000", ins: "60000" } },
      ]} onApply={p => applyPreset(p.v)} />
      <InputSection title="Vehicle & Loan" icon="🚗" gradient="linear-gradient(135deg,#dc2626,#b91c1c)">
        <Sl label="Car Price" id="al_cp" min={100000} max={20000000} step={50000} value={carPrice} onChange={setCarPrice} fmt={v => fmSlider(v)} />
        <Sl label="Down Payment (%)" id="al_dp" min={0} max={50} value={downPct} onChange={setDownPct} fmt={v => v + "% (" + fmSlider(carPrice * v / 100) + ")"} />
        <Sl label="Interest Rate (% p.a.)" id="al_r" min={5} max={20} step={0.25} value={rate} onChange={setRate} fmt={v => v + "%"} />
        <Sel label="Loan Term" id="al_t" value={String(term)} onChange={v => setTerm(+v)} opts={[
          { v: "1", l: "1 Year" }, { v: "2", l: "2 Years" }, { v: "3", l: "3 Years" },
          { v: "5", l: "5 Years" }, { v: "7", l: "7 Years" }
        ]} />
      </InputSection>
      <InputSection title="Costs & Taxes" icon="💰" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
        <N label="Sales Tax (%)" id="al_tax" value={salesTax} onChange={setSalesTax} unit="%" placeholder="0" hint="State/local sales tax on vehicle" />
        <N label="Registration Fee" id="al_reg" value={regFee} onChange={setRegFee} unit={sym} placeholder="5000" hint="Road tax, RTO, dealer fees" />
        <N label="Annual Insurance Estimate" id="al_ins" value={insurance} onChange={setInsurance} unit={sym} placeholder="15000" hint="Comprehensive insurance per year" />
      </InputSection>
    </div>
  );

  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="Auto Loan" />
      <SEOSection title="Auto Loan Calculator — True Cost of Car Ownership">
        <p>This auto loan calculator helps you understand the real cost of buying a car including EMI, total interest, depreciation, and insurance. A vehicle depreciates ~15% in year one and typically loses 50% of its value in 5 years. Keep total car expenses (EMI + insurance + fuel) under 15% of your monthly take-home pay. A higher down payment reduces the Loan-to-Value ratio and can get you better interest rates from lenders.</p>
      </SEOSection>
    </>
  );
}

// ── Personal Loan Calculator ──────────────────────────────────────────
export function PersonalLoanForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [amount, setAmount] = useState(200000);
  const [rate, setRate] = useState(14);
  const [termMonths, setTermMonths] = useState(36);
  const [purpose, setPurpose] = useState("home");
  const [income, setIncome] = useState("60000");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const r = rate / 100 / 12, n = termMonths;
    if (!amount || !rate || !n || r <= 0) return;
    const emi = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalInterest = emi * n - amount;
    const totalPayable = emi * n;
    const costOfCredit = (totalInterest / amount) * 100;
    const inc = +income || 60000;
    const emiPct = (emi / inc) * 100;
    const chart = { type: "donut", data: [
      { name: "Principal", value: Math.round(amount) },
      { name: "Interest", value: Math.round(totalInterest) }
    ], keys: ["value"] };
    setRes(buildResult("Monthly EMI", fm(Math.round(emi)),
      [
        { label: "Loan Amount", value: fm(amount) },
        { label: "Interest Rate", value: rate + "% p.a." },
        { label: "Tenure", value: termMonths + " months" },
        { label: "Total Interest", value: fm(Math.round(totalInterest)), warn: true },
        { label: "Total Payable", value: fm(Math.round(totalPayable)) },
        { label: "Cost of Credit", value: costOfCredit.toFixed(1) + "% extra" },
        { label: "EMI as % of Income", value: emiPct.toFixed(1) + "%", warn: emiPct > 40 },
        { label: "Purpose", value: purpose.charAt(0).toUpperCase() + purpose.slice(1) + " Loan" },
      ],
      [{ type: emiPct > 40 ? "warn" : "tip", msg: emiPct > 40 ? "EMI of " + fm(Math.round(emi)) + " is " + emiPct.toFixed(0) + "% of your income — exceeds the 40% FOIR limit! Reduce loan amount or extend tenure." : "EMI is " + emiPct.toFixed(0) + "% of income — healthy. Total interest: " + fm(Math.round(totalInterest)) + " over " + termMonths + " months." }],
      chart,
      [{ label: "Principal", value: fm(amount) }, { label: "Interest", value: fm(Math.round(totalInterest)) }]
    ));
  }, [amount, rate, termMonths, purpose, income]);

  const inputs = (
    <div className="calc-inputs-grid">
      <Presets items={[
        { label: "Medical Emergency", v: { a: 50000, r: 14, t: 12, p: "medical" } },
        { label: "Home Renovation", v: { a: 300000, r: 12, t: 36, p: "home" } },
        { label: "Wedding", v: { a: 500000, r: 13.5, t: 48, p: "wedding" } },
      ]} onApply={p => { setAmount(p.v.a); setRate(p.v.r); setTermMonths(p.v.t); setPurpose(p.v.p); }} />
      <InputSection title="Loan Details" icon="📋" gradient="linear-gradient(135deg,#dc2626,#b91c1c)">
        <Sl label="Loan Amount" id="pl_a" min={10000} max={5000000} step={10000} value={amount} onChange={setAmount} fmt={v => fmSlider(v)} />
        <Sl label="Interest Rate (% p.a.)" id="pl_r" min={8} max={30} step={0.25} value={rate} onChange={setRate} fmt={v => v + "%"} />
        <N label="Tenure (Months)" id="pl_t" value={String(termMonths)} onChange={v => setTermMonths(+v || 12)} unit="mo" placeholder="36" hint="Repayment period in months" />
      </InputSection>
      <InputSection title="Purpose & Affordability" icon="🎯" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
        <Sel label="Loan Purpose" id="pl_purpose" value={purpose} onChange={setPurpose} opts={[
          { v: "wedding", l: "Wedding" }, { v: "medical", l: "Medical" }, { v: "travel", l: "Travel" },
          { v: "home", l: "Home Renovation" }, { v: "other", l: "Other" }
        ]} />
        <N label="Monthly Income" id="pl_inc" value={income} onChange={setIncome} unit={sym} placeholder="60000" hint="Used to calculate EMI affordability (FOIR)" />
      </InputSection>
    </div>
  );

  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="Personal Loan" />
      <SEOSection title="Personal Loan EMI Calculator">
        <p>Personal loans are unsecured credit at 10–24% p.a. Use this calculator to find your EMI, total interest, and affordability ratio (FOIR). The Fixed Obligation to Income Ratio (FOIR) should stay below 40–50% for most banks. Compare alternatives: gold loans (8–12%), loan against FD (1–2% above FD rate), or top-up home loans are cheaper. Always check processing fees and foreclosure charges before signing.</p>
      </SEOSection>
    </>
  );
}

// ── Student Loan Calculator ───────────────────────────────────────────
export function StudentLoanForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(10.5);
  const [term, setTerm] = useState(10);
  const [moratorium, setMoratorium] = useState("6");
  const [salary, setSalary] = useState("40000");
  const [salaryPct, setSalaryPct] = useState(20);
  const [res, setRes] = useState(null);

  useEffect(() => {
    const r = rate / 100 / 12, n = term * 12;
    const grace = +moratorium || 0;
    if (!amount || !rate || !term) return;
    const accrued = amount * Math.pow(1 + r, grace);
    const capitalizedInterest = accrued - amount;
    const emi = r > 0 ? (accrued * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : accrued / n;
    const totalRepayment = emi * n;
    const totalInterest = totalRepayment - amount;
    const salaryMonth = +salary || 0;
    const burden = salaryMonth > 0 ? (emi / salaryMonth) * 100 : 0;
    const maxAffordEMI = salaryMonth * (salaryPct / 100);
    const affordable = emi <= maxAffordEMI;
    const chart = { type: "donut", data: [
      { name: "Principal", value: Math.round(amount) },
      { name: "Capitalized Interest", value: Math.round(capitalizedInterest) },
      { name: "Repayment Interest", value: Math.round(totalInterest - capitalizedInterest) }
    ], keys: ["value"] };
    setRes(buildResult("EMI After Moratorium", fm(Math.round(emi)),
      [
        { label: "Original Loan", value: fm(amount) },
        { label: "Moratorium Period", value: grace + " months" },
        { label: "Interest Capitalized During Moratorium", value: fm(Math.round(capitalizedInterest)), warn: capitalizedInterest > 0 },
        { label: "Loan After Moratorium", value: fm(Math.round(accrued)) },
        { label: "Total Interest (all)", value: fm(Math.round(totalInterest)), warn: true },
        { label: "Total Repayment", value: fm(Math.round(totalRepayment)) },
        salaryMonth > 0 ? { label: "EMI Burden (% of Salary)", value: burden.toFixed(1) + "%", warn: burden > salaryPct } : null,
        salaryMonth > 0 ? { label: "Salary After EMI", value: fm(Math.round(salaryMonth - emi)) } : null,
        { label: "Affordability", value: affordable ? "Manageable ✓" : "Stretched — Consider longer term", warn: !affordable },
      ].filter(Boolean),
      [{ type: burden > salaryPct ? "warn" : "tip", msg: burden > 0 ? "EMI of " + fm(Math.round(emi)) + " is " + burden.toFixed(0) + "% of salary. " + (burden > salaryPct ? "Exceeds your " + salaryPct + "% target. Consider a longer repayment term." : "Within your " + salaryPct + "% target. Pay extra when salary grows!") : "Enter expected salary to check affordability." }],
      chart, []
    ));
  }, [amount, rate, term, moratorium, salary, salaryPct]);

  const inputs = (
    <div className="calc-inputs-grid">
      <Presets items={[
        { label: "Engineering/Medical", v: { a: 500000, r: 10.5, t: 10, m: "6", sal: "40000", sp: 20 } },
        { label: "MBA Program", v: { a: 2000000, r: 11.0, t: 15, m: "12", sal: "80000", sp: 20 } },
        { label: "Abroad Education", v: { a: 4000000, r: 9.5, t: 20, m: "12", sal: "120000", sp: 25 } },
      ]} onApply={p => { setAmount(p.v.a); setRate(p.v.r); setTerm(p.v.t); setMoratorium(p.v.m); setSalary(p.v.sal); setSalaryPct(p.v.sp); }} />
      <InputSection title="Education Loan" icon="🎓" gradient="linear-gradient(135deg,#dc2626,#b91c1c)">
        <Sl label="Loan Amount" id="sl_a" min={50000} max={10000000} step={50000} value={amount} onChange={setAmount} fmt={v => fmSlider(v)} />
        <Sl label="Interest Rate (% p.a.)" id="sl_r" min={7} max={16} step={0.25} value={rate} onChange={setRate} fmt={v => v + "%"} />
        <Sel label="Repayment Term" id="sl_t" value={String(term)} onChange={v => setTerm(+v)} opts={[
          { v: "5", l: "5 Years" }, { v: "7", l: "7 Years" }, { v: "10", l: "10 Years" },
          { v: "15", l: "15 Years" }, { v: "20", l: "20 Years" }
        ]} />
        <N label="Moratorium Period (months)" id="sl_m" value={moratorium} onChange={setMoratorium} unit="mo" placeholder="6" hint="Course duration + 6–12 months before EMIs begin" />
      </InputSection>
      <InputSection title="Repayment Planning" icon="💼" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
        <N label="Expected Starting Salary" id="sl_sal" value={salary} onChange={setSalary} unit={sym} placeholder="40000" hint="Monthly salary after graduation" />
        <Sl label="Max EMI (% of Salary)" id="sl_sp" min={10} max={50} value={salaryPct} onChange={setSalaryPct} fmt={v => v + "%"} />
      </InputSection>
    </div>
  );

  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="Student Loan" />
      <SEOSection title="Education Loan Calculator — India">
        <p>Education loans in India have a moratorium period (course duration + 6–12 months) during which interest accrues on the principal. On unsubsidized loans (most private bank loans), this capitalized interest increases your principal significantly. Example: A ₹5L loan at 10.5% with 18-month moratorium becomes ~₹5.82L by the time EMIs start. Always try to pay interest during the moratorium period. Under Section 80E, interest paid on education loans is fully deductible from income tax.</p>
      </SEOSection>
    </>
  );
}

// ── Credit Card Payoff Calculator ─────────────────────────────────────
export function CreditCardForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [balance, setBalance] = useState(50000);
  const [apr, setApr] = useState(42);
  const [minPct, setMinPct] = useState(2);
  const [extraPayment, setExtraPayment] = useState("2000");
  const [tab, setTab] = useState("Minimum Only");
  const [res, setRes] = useState(null);

  useEffect(() => {
    if (!balance || !apr) return;
    const r = apr / 100 / 12;
    const minPmt = balance * (minPct / 100);

    // Simulate minimum-only payoff
    let balMin = balance, moMin = 0, intMin = 0;
    while (balMin > 0 && moMin < 600) {
      const ip = balMin * r;
      const pmt = Math.max(balMin * (minPct / 100), 100);
      const pp = Math.min(pmt - ip, balMin);
      if (pp <= 0) { moMin = 600; break; }
      intMin += ip; balMin -= pp; moMin++;
    }

    // Simulate with extra payment
    const extraAmt = +extraPayment || 0;
    let balExtra = balance, moExtra = 0, intExtra = 0;
    while (balExtra > 0 && moExtra < 600) {
      const ip = balExtra * r;
      const pmt = Math.max(balExtra * (minPct / 100), 100) + extraAmt;
      const pp = Math.min(pmt - ip, balExtra);
      if (pp <= 0) { moExtra = 600; break; }
      intExtra += ip; balExtra -= pp; moExtra++;
    }

    const intSaved = intMin - intExtra;
    const moSaved = moMin - moExtra;

    const chart = { type: "bar", data: [
      { name: "Min Only", value: moMin },
      { name: "With Extra " + fm(extraAmt), value: moExtra }
    ], keys: ["value"] };

    const primaryLabel = tab === "Minimum Only" ? "Payoff Time (Min Only)" : "Payoff Time (With Extra)";
    const primaryVal = tab === "Minimum Only" ? (moMin >= 600 ? "Never!" : moMin + " months") : moExtra + " months";

    setRes(buildResult(primaryLabel, primaryVal,
      [
        { label: "Balance", value: fm(balance) },
        { label: "APR", value: apr + "%" },
        { label: "Min Payment (" + minPct + "%)", value: fm(Math.round(minPmt)) },
        { label: "Months (Min Only)", value: moMin >= 600 ? "Never!" : moMin + " months", warn: true },
        { label: "Total Interest (Min Only)", value: fm(Math.round(intMin)), warn: true },
        extraAmt > 0 ? { label: "Months (With Extra " + fm(extraAmt) + ")", value: moExtra + " months", highlight: true } : null,
        extraAmt > 0 ? { label: "Total Interest (With Extra)", value: fm(Math.round(intExtra)), highlight: true } : null,
        extraAmt > 0 ? { label: "Interest Saved", value: fm(Math.round(intSaved)), highlight: true } : null,
        extraAmt > 0 ? { label: "Months Saved", value: moSaved + " months", highlight: true } : null,
      ].filter(Boolean),
      [{ type: moMin >= 600 ? "warn" : "tip", msg: moMin >= 600 ? "Your minimum payment doesn't keep up with interest! Increase payment immediately." : extraAmt > 0 ? "Extra " + fm(extraAmt) + "/mo saves " + fm(Math.round(intSaved)) + " and " + moSaved + " months of debt!" : "Add extra payments to drastically cut interest. Even " + fm(1000) + "/mo extra helps enormously." }],
      chart, []
    ));
  }, [balance, apr, minPct, extraPayment, tab]);

  const inputs = (
    <div className="calc-inputs-grid">
      <Presets items={[
        { label: "Small Balance", v: { b: 20000, apr: 42, mp: 2, extra: "1000" } },
        { label: "Mid Balance", v: { b: 75000, apr: 38, mp: 2, extra: "3000" } },
        { label: "High Balance", v: { b: 200000, apr: 36, mp: 2, extra: "10000" } },
      ]} onApply={p => { setBalance(p.v.b); setApr(p.v.apr); setMinPct(p.v.mp); setExtraPayment(p.v.extra); }} />
      <Tabs tabs={["Minimum Only", "With Extra Payment"]} active={tab} onChange={setTab} />
      <InputSection title="Card Balance" icon="💳" gradient="linear-gradient(135deg,#dc2626,#b91c1c)">
        <Sl label="Credit Card Balance" id="cc_b" min={1000} max={1000000} step={1000} value={balance} onChange={setBalance} fmt={v => fmSlider(v)} />
        <Sl label="APR (%)" id="cc_apr" min={12} max={48} step={0.5} value={apr} onChange={setApr} fmt={v => v + "% p.a."} />
        <Sl label="Minimum Payment (%)" id="cc_mp" min={1} max={10} step={0.5} value={minPct} onChange={setMinPct} fmt={v => v + "% of balance"} />
      </InputSection>
      <InputSection title="Extra Payment Strategy" icon="⚡" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
        <N label="Extra Monthly Payment" id="cc_extra" value={extraPayment} onChange={setExtraPayment} unit={sym} placeholder="2000" hint="Additional amount on top of minimum payment" />
      </InputSection>
    </div>
  );

  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="Credit Card" />
      <SEOSection title="Credit Card Payoff Calculator — Escape Debt Faster">
        <p>Credit card debt at 36–42% APR is the most expensive consumer debt available. Paying only 2% minimum on ₹50,000 at 42% APR takes over 10 years and costs ₹1.5L+ in interest! Our calculator shows you exactly how much time and money you save by making extra payments. Strategy: Consider balance transfer to a 0% promotional APR card, or take a personal loan at 12–15% to consolidate high-interest card debt.</p>
      </SEOSection>
    </>
  );
}

// ── Debt Payoff Calculator ────────────────────────────────────────────
export function DebtPayoffForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [debts, setDebts] = useState([
    { id: 1, name: "Credit Card", balance: 50000, rate: 42, minPayment: 1000 },
    { id: 2, name: "Personal Loan", balance: 100000, rate: 14, minPayment: 2000 },
    { id: 3, name: "Car Loan", balance: 200000, rate: 9, minPayment: 4500 },
  ]);
  const [extraPayment, setExtraPayment] = useState("3000");
  const [strategy, setStrategy] = useState("avalanche");
  const [res, setRes] = useState(null);

  function simulatePayoff(debtList, extra, strat) {
    let remaining = debtList.map(d => ({ ...d }));
    let totalInterest = 0, months = 0;
    while (remaining.some(d => d.balance > 0.01) && months < 480) {
      months++;
      remaining.forEach(d => {
        if (d.balance <= 0) return;
        const ip = d.balance * (d.rate / 100 / 12);
        totalInterest += ip;
        const pp = d.minPayment - ip;
        if (pp > 0) d.balance = Math.max(0, d.balance - pp);
      });
      const active = remaining.filter(d => d.balance > 0.01);
      if (active.length > 0 && extra > 0) {
        const target = strat === "avalanche"
          ? active.reduce((a, b) => a.rate > b.rate ? a : b)
          : active.reduce((a, b) => a.balance < b.balance ? a : b);
        target.balance = Math.max(0, target.balance - extra);
      }
    }
    return { months, totalInterest };
  }

  useEffect(() => {
    if (!debts.some(d => d.balance > 0)) return;
    const extra = +extraPayment || 0;
    const result = simulatePayoff(debts, extra, strategy);
    const baseResult = simulatePayoff(debts, 0, strategy);
    const interestSaved = baseResult.totalInterest - result.totalInterest;
    const monthsSaved = baseResult.months - result.months;
    const totalDebt = debts.reduce((s, d) => s + d.balance, 0);
    const totalMin = debts.reduce((s, d) => s + d.minPayment, 0);
    const sortedOrder = [...debts].sort((a, b) => strategy === "avalanche" ? b.rate - a.rate : a.balance - b.balance);
    const chart = { type: "bar", data: sortedOrder.map(d => ({ name: d.name, Balance: d.balance })), keys: ["Balance"] };
    setRes(buildResult("Debt-Free In", result.months + " months",
      [
        { label: "Total Debt", value: fm(Math.round(totalDebt)) },
        { label: "Min Payments/mo", value: fm(Math.round(totalMin)) },
        extra > 0 ? { label: "Extra Payment/mo", value: fm(extra), highlight: true } : null,
        { label: "Total Interest (min only)", value: fm(Math.round(baseResult.totalInterest)), warn: true },
        extra > 0 ? { label: "Total Interest (with extra)", value: fm(Math.round(result.totalInterest)) } : null,
        extra > 0 ? { label: "Interest Saved", value: fm(Math.round(interestSaved)), highlight: true } : null,
        extra > 0 ? { label: "Months Saved", value: monthsSaved + " months", highlight: true } : null,
        { label: "Strategy", value: strategy === "avalanche" ? "Avalanche (Best ROI)" : "Snowball (Motivational)" },
        { label: "Attack Order", value: sortedOrder.map(d => d.name).join(" → ") },
      ].filter(Boolean),
      [{ type: "tip", msg: extra > 0 ? "Extra " + fm(extra) + "/mo saves " + fm(Math.round(interestSaved)) + " in interest and " + monthsSaved + " months of debt!" : "Add even " + fm(1000) + " extra/month to drastically reduce interest. Enter an extra payment above!" }],
      chart, []
    ));
  }, [debts, extraPayment, strategy]);

  const updateDebt = (id, field, value) => setDebts(prev => prev.map(d => d.id === id ? { ...d, [field]: field === "name" ? value : +value } : d));
  const addDebt = () => setDebts(prev => [...prev, { id: Date.now(), name: "Debt " + (prev.length + 1), balance: 50000, rate: 15, minPayment: 1000 }]);
  const removeDebt = (id) => setDebts(prev => prev.filter(d => d.id !== id));

  const inputs = (
    <div className="calc-inputs-grid">
      <Presets items={[
        { label: "3 Debts (Avalanche)", v: { strategy: "avalanche", extra: "3000" } },
        { label: "3 Debts (Snowball)", v: { strategy: "snowball", extra: "3000" } },
        { label: "Aggressive Payoff", v: { strategy: "avalanche", extra: "10000" } },
      ]} onApply={p => { setStrategy(p.v.strategy); setExtraPayment(p.v.extra); }} />
      <Tabs tabs={["Avalanche", "Snowball"]} active={strategy === "avalanche" ? "Avalanche" : "Snowball"} onChange={t => setStrategy(t === "Avalanche" ? "avalanche" : "snowball")} />
      <InputSection title="Extra Payment" icon="💪" gradient="linear-gradient(135deg,#dc2626,#b91c1c)">
        <N label="Extra Monthly Payment" id="dp_extra" value={extraPayment} onChange={setExtraPayment} unit={sym} placeholder="3000" hint="Applied to priority debt after all minimums" />
      </InputSection>
      <InputSection title="Your Debts" icon="📊" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
        {debts.map((debt) => (
          <div key={debt.id} style={{ padding: "12px", background: "var(--surface2)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <input value={debt.name} onChange={e => updateDebt(debt.id, "name", e.target.value)} style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", background: "transparent", border: "none", outline: "none" }} />
              {debts.length > 1 && <button onClick={() => removeDebt(debt.id)} style={{ fontSize: 11, color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>Remove</button>}
            </div>
            <Row3>
              <N label="Balance" id={"dp_b" + debt.id} value={String(debt.balance)} onChange={v => updateDebt(debt.id, "balance", v)} unit={sym} placeholder="50000" hint="" />
              <N label="Rate %" id={"dp_r" + debt.id} value={String(debt.rate)} onChange={v => updateDebt(debt.id, "rate", v)} unit="%" placeholder="14" hint="" />
              <N label="Min Pmt" id={"dp_m" + debt.id} value={String(debt.minPayment)} onChange={v => updateDebt(debt.id, "minPayment", v)} unit={sym} placeholder="1000" hint="" />
            </Row3>
          </div>
        ))}
        {debts.length < 6 && <button onClick={addDebt} style={{ width: "100%", padding: "8px", borderRadius: "var(--r-md)", border: "2px dashed var(--border)", background: "transparent", color: "var(--brand)", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>+ Add Debt</button>}
      </InputSection>
    </div>
  );

  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="Debt Payoff" />
      <SEOSection title="Debt Payoff Calculator — Avalanche vs Snowball">
        <p><strong>Avalanche Method:</strong> Pay minimums on all debts, put extra money toward the highest-APR debt first. Mathematically optimal — saves the most interest. <strong>Snowball Method:</strong> Pay off the smallest balance first for quick psychological wins. Research shows snowball improves adherence despite slightly higher interest costs. The best method is whichever keeps you motivated to stick with the plan!</p>
      </SEOSection>
    </>
  );
}
`;

// ═══════════════════════════════════════════════════════════════
// FILE 2: InvestmentForms.jsx  (4 calculators)
// ═══════════════════════════════════════════════════════════════

const investmentForms = `import { useState, useEffect } from "react";
import { L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency, InputSection, Toggle, SEOSection } from "./SharedComponents.jsx";

function CalcLayout({ inputs, result, label }) {
  return (
    <div className="calc-form-stack">
      <div>{inputs}</div>
      <Panel result={result} loading={null} label={label} />
    </div>
  );
}

// ── Stock Return Calculator ───────────────────────────────────────────
export function StockReturnForm() {
  const { fm, sym } = useCurrency();
  const [buyPrice, setBuyPrice] = useState(100);
  const [sellPrice, setSellPrice] = useState(145);
  const [shares, setShares] = useState(100);
  const [buyDate, setBuyDate] = useState("2022-01-01");
  const [sellDate, setSellDate] = useState("2023-01-01");
  const [brokeragePct, setBrokeragePct] = useState("0.5");
  const [taxPct, setTaxPct] = useState("10");
  const [res, setRes] = useState(null);

  useEffect(() => {
    if (!buyPrice || !sellPrice || !shares) return;
    const investment = buyPrice * shares;
    const grossReturn = (sellPrice - buyPrice) * shares;
    const brokerageAmt = investment * (+brokeragePct / 100) + (sellPrice * shares) * (+brokeragePct / 100);
    const taxAmt = grossReturn > 0 ? grossReturn * (+taxPct / 100) : 0;
    const netProfit = grossReturn - brokerageAmt - taxAmt;
    const roi = (netProfit / investment) * 100;
    const datesDiff = buyDate && sellDate ? Math.max((new Date(sellDate) - new Date(buyDate)) / (1000 * 60 * 60 * 24 * 365), 0.001) : 1;
    const cagr = datesDiff > 0 ? (Math.pow(Math.abs(sellPrice / buyPrice), 1 / datesDiff) - 1) * 100 * (sellPrice >= buyPrice ? 1 : -1) : roi;
    // Nifty 50 benchmark (~12% CAGR)
    const niftyReturn = investment * (Math.pow(1.12, datesDiff) - 1);
    const chart = { type: "bar", data: [
      { name: "Your Net Gain", value: Math.round(netProfit) },
      { name: "Nifty 50 Est.", value: Math.round(niftyReturn) },
      { name: "Investment Cost", value: Math.round(investment) }
    ], keys: ["value"] };
    setRes(buildResult(netProfit >= 0 ? "Net Profit" : "Net Loss", fm(Math.abs(Math.round(netProfit))),
      [
        { label: "Investment (Cost Basis)", value: fm(Math.round(investment)) },
        { label: "Gross Capital Gain", value: fm(Math.round(grossReturn)), highlight: grossReturn > 0, warn: grossReturn < 0 },
        { label: "Brokerage (" + brokeragePct + "% each way)", value: fm(Math.round(brokerageAmt)), warn: true },
        { label: "Tax on Gains (" + taxPct + "%)", value: fm(Math.round(taxAmt)), warn: true },
        { label: "Net Profit/Loss", value: fm(Math.round(netProfit)), highlight: netProfit > 0, warn: netProfit < 0 },
        { label: "ROI", value: roi.toFixed(2) + "%" },
        { label: "Annualized CAGR", value: cagr.toFixed(2) + "% p.a." },
        { label: "vs Nifty 50 (12%/yr est.)", value: fm(Math.round(niftyReturn)), warn: netProfit < niftyReturn },
        { label: "Holding Period", value: datesDiff.toFixed(1) + " years" },
      ],
      [{ type: netProfit > niftyReturn ? "tip" : "warn", msg: netProfit > 0 ? "CAGR of " + cagr.toFixed(1) + "% " + (cagr > 12 ? "beats Nifty 50 benchmark! Great stock pick." : "is below Nifty 50 average (12%). Index funds may serve better long-term.") : "This trade resulted in a loss. Review your thesis before averaging down." }],
      chart,
      [{ label: "Per Share Return", value: fm(Math.round(netProfit / shares)) }, { label: "Tax Type", value: datesDiff >= 1 ? "LTCG (10% above ₹1L)" : "STCG (15%)" }]
    ));
  }, [buyPrice, sellPrice, shares, buyDate, sellDate, brokeragePct, taxPct]);

  const inputs = (
    <div className="calc-inputs-grid">
      <Presets items={[
        { label: "Quick Trade", v: { bp: 100, sp: 130, sh: 50, brok: "0.5", tax: "15" } },
        { label: "Dividend Stock", v: { bp: 500, sp: 620, sh: 100, brok: "0.3", tax: "10" } },
        { label: "Long-term HDFC", v: { bp: 1200, sp: 1680, sh: 500, brok: "0.2", tax: "10" } },
      ]} onApply={p => { setBuyPrice(p.v.bp); setSellPrice(p.v.sp); setShares(p.v.sh); setBrokeragePct(p.v.brok); setTaxPct(p.v.tax); }} />
      <InputSection title="Investment Details" icon="📈" gradient="linear-gradient(135deg,#059669,#047857)">
        <Row2>
          <N label="Buy Price/Share" id="sr_bp" value={String(buyPrice)} onChange={v => setBuyPrice(+v)} unit={sym} placeholder="100" hint="Cost per share at entry" />
          <N label="Sell Price/Share" id="sr_sp" value={String(sellPrice)} onChange={v => setSellPrice(+v)} unit={sym} placeholder="145" hint="Exit price per share" />
        </Row2>
        <Sl label="Number of Shares" id="sr_sh" min={1} max={100000} step={1} value={shares} onChange={setShares} fmt={v => v + " shares"} />
        <Row2>
          <N label="Buy Date" id="sr_bd" value={buyDate} onChange={setBuyDate} type="text" placeholder="YYYY-MM-DD" hint="Entry date" />
          <N label="Sell Date" id="sr_sd" value={sellDate} onChange={setSellDate} type="text" placeholder="YYYY-MM-DD" hint="Exit date" />
        </Row2>
      </InputSection>
      <InputSection title="Costs & Taxes" icon="🧾" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
        <N label="Brokerage (% each way)" id="sr_brok" value={brokeragePct} onChange={setBrokeragePct} unit="%" placeholder="0.5" hint="Entry + exit brokerage as % of trade value" />
        <N label="Capital Gains Tax (%)" id="sr_tax" value={taxPct} onChange={setTaxPct} unit="%" placeholder="10" hint="STCG 15% (under 1yr) | LTCG 10% (over 1yr)" />
      </InputSection>
    </div>
  );

  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="Stock Return" />
      <SEOSection title="Stock Return Calculator — CAGR, ROI & Tax">
        <p>This stock return calculator computes net profit after brokerage fees and capital gains tax, plus annualized CAGR to compare against benchmarks like Nifty 50. In India: Short-Term Capital Gains (STCG) under 1 year = 15%; Long-Term Capital Gains (LTCG) over 1 year = 10% above ₹1 lakh exemption. Always calculate net returns after all costs — brokerage, STT, GST on brokerage — to make fair investment comparisons.</p>
      </SEOSection>
    </>
  );
}

// ── NPV / IRR Calculator ──────────────────────────────────────────────
export function NPVForm() {
  const { fm, sym } = useCurrency();
  const [initialInvestment, setInitialInvestment] = useState(500000);
  const [discountRate, setDiscountRate] = useState(10);
  const [cashflows, setCashflows] = useState(["100000", "150000", "200000", "250000", "300000"]);
  const [tab, setTab] = useState("NPV");
  const [res, setRes] = useState(null);

  function calcNPV(flows, rate, initial) {
    const r = rate / 100;
    let npv = -initial;
    for (let i = 0; i < flows.length; i++) { npv += +flows[i] / Math.pow(1 + r, i + 1); }
    return npv;
  }

  function calcIRR(flows, initial) {
    let lo = -0.99, hi = 10, irr = 0.1;
    for (let iter = 0; iter < 1000; iter++) {
      const mid = (lo + hi) / 2;
      const npv = calcNPV(flows, mid * 100, initial);
      if (Math.abs(npv) < 0.01) { irr = mid; break; }
      if (npv > 0) lo = mid; else hi = mid;
      irr = mid;
    }
    return irr * 100;
  }

  useEffect(() => {
    const validFlows = cashflows.filter(f => f !== "" && !isNaN(+f));
    if (!initialInvestment || validFlows.length === 0) return;
    const npv = calcNPV(validFlows, discountRate, initialInvestment);
    const irr = calcIRR(validFlows, initialInvestment);
    const pi = (npv + initialInvestment) / initialInvestment;
    let cumFlow = 0, paybackYears = 0;
    for (let i = 0; i < validFlows.length; i++) {
      cumFlow += +validFlows[i];
      if (cumFlow >= initialInvestment && !paybackYears) { paybackYears = i + 1 - (cumFlow - initialInvestment) / +validFlows[i]; }
    }
    const totalCashIn = validFlows.reduce((s, f) => s + +f, 0);
    const table = validFlows.map((f, i) => {
      const pv = +f / Math.pow(1 + discountRate / 100, i + 1);
      return { year: i + 1, cashflow: +f, pv: Math.round(pv) };
    });
    const chart = { type: "bar", data: table.map(t => ({ year: "Yr " + t.year, "Cash Flow": t.cashflow, "PV": t.pv })), keys: ["Cash Flow", "PV"] };
    setRes(buildResult(tab === "NPV" ? "Net Present Value" : "IRR", tab === "NPV" ? fm(Math.round(npv)) : irr.toFixed(2) + "%",
      [
        { label: "Initial Investment", value: fm(initialInvestment) },
        { label: "NPV", value: fm(Math.round(npv)), highlight: npv > 0, warn: npv < 0 },
        { label: "IRR", value: irr.toFixed(2) + "% " + (irr > discountRate ? "(Exceeds hurdle ✓)" : "(Below hurdle ✗)"), highlight: irr > discountRate, warn: irr <= discountRate },
        { label: "Profitability Index", value: pi.toFixed(3) + (pi > 1 ? " (Viable)" : " (Not viable)"), highlight: pi > 1, warn: pi <= 1 },
        { label: "Payback Period", value: paybackYears > 0 ? paybackYears.toFixed(1) + " years" : "Not within projection" },
        { label: "Total Cash Inflows", value: fm(Math.round(totalCashIn)) },
        { label: "Net Gain (undiscounted)", value: fm(Math.round(totalCashIn - initialInvestment)), highlight: totalCashIn > initialInvestment },
      ],
      [{ type: npv > 0 ? "tip" : "warn", msg: npv > 0 ? "Positive NPV of " + fm(Math.round(npv)) + " — project creates value! IRR of " + irr.toFixed(1) + "% " + (irr > discountRate ? "exceeds your " + discountRate + "% hurdle rate." : "is below hurdle — consider renegotiating terms.") : "Negative NPV of " + fm(Math.round(Math.abs(npv))) + " — project destroys value at " + discountRate + "% discount rate. Increase revenues or reduce costs." }],
      chart,
      table.map(t => ({ label: "Year " + t.year + " Discounted PV", value: fm(t.pv) }))
    ));
  }, [initialInvestment, discountRate, cashflows, tab]);

  const updateCashflow = (index, value) => setCashflows(prev => prev.map((f, i) => i === index ? value : f));
  const addYear = () => setCashflows(prev => [...prev, ""]);
  const removeYear = () => setCashflows(prev => prev.slice(0, -1));

  const inputs = (
    <div className="calc-inputs-grid">
      <Presets items={[
        { label: "5yr Project", v: { inv: 500000, dr: 10, cfs: ["100000", "150000", "200000", "250000", "300000"] } },
        { label: "Risky Venture", v: { inv: 200000, dr: 15, cfs: ["0", "50000", "100000", "200000", "150000"] } },
        { label: "Real Estate", v: { inv: 5000000, dr: 8, cfs: ["400000", "420000", "441000", "463000", "486000"] } },
      ]} onApply={p => { setInitialInvestment(p.v.inv); setDiscountRate(p.v.dr); setCashflows(p.v.cfs); }} />
      <Tabs tabs={["NPV", "IRR"]} active={tab} onChange={setTab} />
      <InputSection title="Project Parameters" icon="🏭" gradient="linear-gradient(135deg,#059669,#047857)">
        <Sl label="Initial Investment" id="npv_inv" min={10000} max={10000000} step={10000} value={initialInvestment} onChange={setInitialInvestment} fmt={v => fm(v)} />
        <Sl label="Discount / Hurdle Rate (%)" id="npv_dr" min={1} max={30} step={0.5} value={discountRate} onChange={setDiscountRate} fmt={v => v + "%"} />
      </InputSection>
      <InputSection title="Annual Cash Flows" icon="💸" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
        {cashflows.map((cf, i) => (
          <N key={i} label={"Year " + (i + 1)} id={"npv_cf" + i} value={cf} onChange={v => updateCashflow(i, v)} unit={sym} placeholder="0" hint="" />
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button onClick={addYear} style={{ flex: 1, padding: "7px", borderRadius: "var(--r-md)", border: "1.5px solid var(--brand)", background: "transparent", color: "var(--brand)", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>+ Add Year</button>
          {cashflows.length > 1 && <button onClick={removeYear} style={{ flex: 1, padding: "7px", borderRadius: "var(--r-md)", border: "1.5px solid #ef4444", background: "transparent", color: "#ef4444", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>- Remove Year</button>}
        </div>
      </InputSection>
    </div>
  );

  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="NPV/IRR" />
      <SEOSection title="NPV & IRR Calculator — Capital Budgeting">
        <p><strong>NPV &gt; 0:</strong> Project adds value — accept. <strong>IRR &gt; Hurdle Rate:</strong> Returns exceed cost of capital — accept. <strong>Profitability Index &gt; 1:</strong> For every rupee invested, you receive more than ₹1 in present value. NPV is generally preferred over IRR for capital budgeting because IRR can give misleading results for non-conventional cash flows. Use the bisection method IRR shown here for unconventional cash flow patterns.</p>
      </SEOSection>
    </>
  );
}

// ── Portfolio Rebalancing Calculator ─────────────────────────────────
export function PortfolioRebalanceForm() {
  const { fm, fmSlider } = useCurrency();
  const [total, setTotal] = useState(1000000);
  const [assets, setAssets] = useState([
    { id: 1, name: "Equity", target: 60, current: 70 },
    { id: 2, name: "Debt", target: 25, current: 18 },
    { id: 3, name: "Gold", target: 10, current: 8 },
    { id: 4, name: "Cash", target: 5, current: 4 },
  ]);
  const [res, setRes] = useState(null);
  const [rebalTable, setRebalTable] = useState([]);

  useEffect(() => {
    const totalTarget = assets.reduce((s, a) => s + a.target, 0);
    if (Math.abs(totalTarget - 100) > 0.5) {
      setRes(buildResult("Error", "Targets must sum to 100%",
        [{ label: "Current Sum", value: totalTarget.toFixed(1) + "%" }],
        [{ type: "warn", msg: "Target allocations must sum to exactly 100%. Current sum: " + totalTarget.toFixed(1) + "%" }],
        null, []));
      return;
    }
    const rows = assets.map(asset => {
      const currentValue = total * (asset.current / 100);
      const targetValue = total * (asset.target / 100);
      const diff = targetValue - currentValue;
      return { ...asset, currentValue: Math.round(currentValue), targetValue: Math.round(targetValue), diff: Math.round(diff), action: diff > 0 ? "Buy" : diff < 0 ? "Sell" : "Hold" };
    });
    setRebalTable(rows);
    const totalDrift = rows.reduce((s, r) => s + Math.abs(r.current - r.target), 0) / 2;
    const chart = { type: "donut", data: rows.map(r => ({ name: r.name + " (" + r.current + "%)", value: r.current })), keys: ["value"] };
    setRes(buildResult("Portfolio Drift", totalDrift.toFixed(1) + "%",
      [
        { label: "Total Portfolio Value", value: fm(total) },
        { label: "Rebalancing Needed", value: totalDrift > 5 ? "Yes — Drift: " + totalDrift.toFixed(1) + "%" : "Minor adjustments only", warn: totalDrift > 5 },
        ...rows.map(r => ({ label: r.name + " → " + r.action, value: r.action !== "Hold" ? fm(Math.abs(r.diff)) : "No change", highlight: r.action === "Buy", warn: r.action === "Sell" })),
      ],
      [{ type: totalDrift > 5 ? "warn" : "tip", msg: totalDrift > 5 ? "Portfolio has drifted " + totalDrift.toFixed(0) + "% from targets. Rebalancing recommended to restore intended risk profile." : "Portfolio is well-balanced. Minor adjustments only. Review annually or when any asset drifts >5%." }],
      chart, []
    ));
  }, [total, assets]);

  const updateAsset = (id, field, value) => setAssets(prev => prev.map(a => a.id === id ? { ...a, [field]: field === "name" ? value : +value } : a));

  const inputs = (
    <div className="calc-inputs-grid">
      <Presets items={[
        { label: "Aggressive (80/20)", v: { assets: [{ id: 1, name: "Equity", target: 80, current: 75 }, { id: 2, name: "Debt", target: 15, current: 20 }, { id: 3, name: "Gold", target: 5, current: 5 }] } },
        { label: "Balanced (60/40)", v: { assets: [{ id: 1, name: "Equity", target: 60, current: 70 }, { id: 2, name: "Debt", target: 30, current: 22 }, { id: 3, name: "Gold", target: 10, current: 8 }] } },
        { label: "Conservative (40/60)", v: { assets: [{ id: 1, name: "Equity", target: 40, current: 45 }, { id: 2, name: "Debt", target: 50, current: 45 }, { id: 3, name: "Gold", target: 10, current: 10 }] } },
      ]} onApply={p => setAssets(p.v.assets)} />
      <InputSection title="Portfolio Value" icon="💼" gradient="linear-gradient(135deg,#059669,#047857)">
        <Sl label="Total Portfolio Value" id="pr_total" min={10000} max={50000000} step={10000} value={total} onChange={setTotal} fmt={v => fmSlider(v)} />
      </InputSection>
      <InputSection title="Asset Allocation (Target % / Current %)" icon="🎯" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
        {assets.map(asset => (
          <div key={asset.id} style={{ padding: "10px 12px", background: "var(--surface2)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", marginBottom: 8 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>{asset.name}</p>
            <Row2>
              <N label="Target %" id={"pr_t" + asset.id} value={String(asset.target)} onChange={v => updateAsset(asset.id, "target", v)} unit="%" placeholder="25" hint="Desired allocation" />
              <N label="Current %" id={"pr_c" + asset.id} value={String(asset.current)} onChange={v => updateAsset(asset.id, "current", v)} unit="%" placeholder="30" hint="Actual current allocation" />
            </Row2>
          </div>
        ))}
      </InputSection>
      {rebalTable.length > 0 && (
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "var(--r-xl)", overflow: "hidden", marginTop: 4 }}>
          <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", background: "var(--surface2)" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Rebalancing Actions</p>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--surface2)" }}>
                {["Asset", "Current", "Target", "Trade", "Action"].map((h, hi) => (
                  <th key={h} style={{ padding: "9px 14px", textAlign: hi === 0 ? "left" : "right", fontWeight: 700, color: "var(--text2)", fontSize: 11, textTransform: "uppercase", borderBottom: "2px solid var(--border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rebalTable.map((row, i) => (
                <tr key={row.id} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.015)" }}>
                  <td style={{ padding: "9px 14px", fontWeight: 700, color: "var(--text)" }}>{row.name}</td>
                  <td style={{ padding: "9px 14px", textAlign: "right", color: "var(--text)", fontWeight: 600 }}>{fm(row.currentValue)}</td>
                  <td style={{ padding: "9px 14px", textAlign: "right", color: "var(--text)", fontWeight: 600 }}>{fm(row.targetValue)}</td>
                  <td style={{ padding: "9px 14px", textAlign: "right", color: row.diff > 0 ? "var(--success)" : row.diff < 0 ? "#ef4444" : "var(--text3)", fontWeight: 700 }}>{row.diff > 0 ? "+" : ""}{fm(row.diff)}</td>
                  <td style={{ padding: "9px 14px", textAlign: "right" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 99, background: row.action === "Buy" ? "rgba(34,197,94,0.12)" : row.action === "Sell" ? "rgba(239,68,68,0.1)" : "rgba(99,102,241,0.1)", color: row.action === "Buy" ? "var(--success)" : row.action === "Sell" ? "#ef4444" : "var(--brand)" }}>{row.action}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="Portfolio Rebalance" />
      <SEOSection title="Portfolio Rebalancing Calculator — Asset Allocation">
        <p>Portfolio rebalancing restores your target asset allocation when market movements cause drift. A 5% drift threshold is commonly used — rebalance when any asset class deviates more than 5% from its target. For Indian investors, a common balanced portfolio is 60% equity (mutual funds/stocks), 25% debt (FDs/bonds), 10% gold (SGBs/Gold ETFs), and 5% cash. Rebalance annually or after significant market moves to maintain your intended risk profile.</p>
      </SEOSection>
    </>
  );
}

// ── Dividend Yield Calculator ─────────────────────────────────────────
export function DividendYieldForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [stockPrice, setStockPrice] = useState(500);
  const [annualDividend, setAnnualDividend] = useState(20);
  const [shares, setShares] = useState(200);
  const [growthRate, setGrowthRate] = useState(5);
  const [years, setYears] = useState(10);
  const [taxRate, setTaxRate] = useState("10");
  const [res, setRes] = useState(null);

  useEffect(() => {
    if (!stockPrice || !annualDividend) return;
    const yield_ = (annualDividend / stockPrice) * 100;
    const totalInvestment = stockPrice * shares;
    const annualIncome = annualDividend * shares;
    const monthlyIncome = annualIncome / 12;
    const futureDiv = annualDividend * Math.pow(1 + growthRate / 100, years);
    const yieldOnCost = (futureDiv / stockPrice) * 100;
    let totalDivReceived = 0;
    const table = Array.from({ length: Math.min(years, 15) }, (_, i) => {
      const yr = i + 1;
      const divPerShare = annualDividend * Math.pow(1 + growthRate / 100, yr);
      const income = divPerShare * shares;
      const afterTax = income * (1 - +taxRate / 100);
      totalDivReceived += afterTax;
      return { year: yr, divPerShare: Math.round(divPerShare * 100) / 100, income: Math.round(income), afterTax: Math.round(afterTax), cumulative: Math.round(totalDivReceived) };
    });
    const chart = { type: "bar", data: table.filter((_, i) => i % 2 === 0).map(t => ({ year: "Yr " + t.year, "Dividend Income": t.income })), keys: ["Dividend Income"] };
    const paybackYears = table.findIndex(t => t.cumulative >= totalInvestment);
    setRes(buildResult("Dividend Yield", yield_.toFixed(2) + "%",
      [
        { label: "Annual Dividend Income", value: fm(Math.round(annualIncome)), highlight: true },
        { label: "Monthly Dividend Income", value: fm(Math.round(monthlyIncome)), highlight: true },
        { label: "After-Tax Annual Income", value: fm(Math.round(annualIncome * (1 - +taxRate / 100))) },
        { label: "Total Investment", value: fm(Math.round(totalInvestment)) },
        { label: "Yield on Cost (" + years + " yrs)", value: yieldOnCost.toFixed(2) + "%", highlight: true },
        { label: "Total Dividends (" + years + " yrs, after tax)", value: fm(Math.round(totalDivReceived)) },
        paybackYears >= 0 ? { label: "Dividend Payback Period", value: "Year " + (paybackYears + 1) } : null,
      ].filter(Boolean),
      [{ type: "tip", msg: "At " + growthRate + "% dividend growth, yield-on-cost rises from " + yield_.toFixed(1) + "% today to " + yieldOnCost.toFixed(1) + "% in " + years + " years. Monthly income of " + fm(Math.round(monthlyIncome)) + " grows to " + fm(Math.round(futureDiv * shares / 12)) + " per month!" }],
      chart,
      [{ label: "Price", value: fm(stockPrice) }, { label: "Dividend/yr", value: fm(annualDividend) + "/share" }, { label: "Shares", value: String(shares) }]
    ));
  }, [stockPrice, annualDividend, shares, growthRate, years, taxRate]);

  const inputs = (
    <div className="calc-inputs-grid">
      <Presets items={[
        { label: "Blue Chip (3% yield)", v: { sp: 1000, div: 30, sh: 100, gr: 5, y: 10, tax: "10" } },
        { label: "High Yield (6%)", v: { sp: 500, div: 30, sh: 200, gr: 3, y: 15, tax: "10" } },
        { label: "REIT (8%)", v: { sp: 300, div: 24, sh: 500, gr: 2, y: 20, tax: "10" } },
      ]} onApply={p => { setStockPrice(p.v.sp); setAnnualDividend(p.v.div); setShares(p.v.sh); setGrowthRate(p.v.gr); setYears(p.v.y); setTaxRate(p.v.tax); }} />
      <InputSection title="Stock Details" icon="📊" gradient="linear-gradient(135deg,#059669,#047857)">
        <Sl label="Stock Price" id="dy_sp" min={1} max={50000} step={1} value={stockPrice} onChange={setStockPrice} fmt={v => fm(v)} />
        <Sl label="Annual Dividend per Share" id="dy_div" min={0.1} max={500} step={0.1} value={annualDividend} onChange={setAnnualDividend} fmt={v => fm(v) + "/share"} />
        <Sl label="Number of Shares Owned" id="dy_sh" min={1} max={10000} step={1} value={shares} onChange={setShares} fmt={v => v + " shares"} />
      </InputSection>
      <InputSection title="Growth Projection" icon="🌱" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
        <Sl label="Dividend Growth Rate (%/yr)" id="dy_gr" min={0} max={20} step={0.5} value={growthRate} onChange={setGrowthRate} fmt={v => v + "%"} />
        <Sl label="Investment Horizon (Years)" id="dy_y" min={1} max={30} value={years} onChange={setYears} fmt={v => v + " years"} />
        <N label="Dividend Tax Rate (%)" id="dy_tax" value={taxRate} onChange={setTaxRate} unit="%" placeholder="10" hint="Dividend tax rate on income received" />
      </InputSection>
    </div>
  );

  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="Dividend Yield" />
      <SEOSection title="Dividend Yield Calculator — Passive Income Planning">
        <p>Yield on Cost (YOC) is the dividend yield based on your original purchase price. A stock bought at ₹500 with ₹20 annual dividend has 4% yield today. After 10 years at 8% dividend growth, the annual dividend becomes ₹43 — a YOC of 8.6% on your original investment! This calculator helps you project dividend income, yield-on-cost growth, and payback period through dividends alone. Ideal for planning FIRE (Financial Independence, Retire Early) using dividend investing strategy.</p>
      </SEOSection>
    </>
  );
}
`;

// ═══════════════════════════════════════════════════════════════
// FILE 3: ExtraFinanceForms.jsx  (6 calculators)
// ═══════════════════════════════════════════════════════════════

const extraFinanceForms = `import { useState, useEffect } from "react";
import { L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency, InputSection, Toggle, SEOSection } from "./SharedComponents.jsx";

function CalcLayout({ inputs, result, label }) {
  return (
    <div className="calc-form-stack">
      <div>{inputs}</div>
      <Panel result={result} loading={null} label={label} />
    </div>
  );
}

// ── APR Calculator ────────────────────────────────────────────────────
export function APRForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [amount, setAmount] = useState(500000);
  const [nominalRate, setNominalRate] = useState(10);
  const [fees, setFees] = useState("15000");
  const [term, setTerm] = useState(5);
  const [tab, setTab] = useState("Single Loan");
  const [lenders, setLenders] = useState([
    { id: 1, name: "Bank A", rate: 10, fees: "15000" },
    { id: 2, name: "Bank B", rate: 10.5, fees: "5000" },
    { id: 3, name: "NBFC C", rate: 9.5, fees: "25000" },
  ]);
  const [res, setRes] = useState(null);

  function calcAPR(loanAmt, rate, feeAmt, termYrs) {
    const n = termYrs * 12;
    const r = rate / 100 / 12;
    const emi = r > 0 ? (loanAmt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : loanAmt / n;
    const netProceeds = loanAmt - feeAmt;
    // APR via Newton's method
    let aprRate = r;
    for (let i = 0; i < 100; i++) {
      const f = aprRate > 0
        ? emi * (1 - Math.pow(1 + aprRate, -n)) / aprRate - netProceeds
        : emi * n - netProceeds;
      const df = aprRate > 0
        ? emi * (n * Math.pow(1 + aprRate, -n - 1) / aprRate - (1 - Math.pow(1 + aprRate, -n)) / (aprRate * aprRate))
        : -n;
      aprRate -= f / df;
    }
    const aprPct = aprRate * 12 * 100;
    return { emi, aprPct, totalCost: emi * n + feeAmt, totalInterest: emi * n - loanAmt };
  }

  useEffect(() => {
    if (tab === "Compare Lenders") {
      const results = lenders.map(l => ({ ...l, ...calcAPR(amount, l.rate, +l.fees || 0, term) }));
      const best = results.reduce((a, b) => a.aprPct < b.aprPct ? a : b);
      const chart = { type: "bar", data: results.map(l => ({ name: l.name, "Total Cost": Math.round(l.totalCost) })), keys: ["Total Cost"] };
      setRes(buildResult("Best APR", best.name + " (" + best.aprPct.toFixed(2) + "%)",
        [
          ...results.map(l => ({ label: l.name + " APR", value: l.aprPct.toFixed(2) + "% (" + (l === best ? "Best ✓" : "+" + (l.aprPct - best.aprPct).toFixed(2) + "% vs best") + ")", highlight: l === best })),
          ...results.map(l => ({ label: l.name + " Total Cost", value: fm(Math.round(l.totalCost)) })),
        ],
        [{ type: "tip", msg: best.name + " offers the best deal at " + best.aprPct.toFixed(2) + "% APR. Total savings vs worst option: " + fm(Math.round(Math.max(...results.map(r => r.totalCost)) - best.totalCost)) }],
        chart, []
      ));
      return;
    }
    if (!amount || !nominalRate || !term) return;
    const { emi, aprPct, totalCost, totalInterest } = calcAPR(amount, nominalRate, +fees || 0, term);
    const aprVsNominal = aprPct - nominalRate;
    setRes(buildResult("Effective APR", aprPct.toFixed(2) + "%",
      [
        { label: "Loan Amount", value: fm(amount) },
        { label: "Nominal Interest Rate", value: nominalRate + "%" },
        { label: "Processing Fees", value: fm(+fees || 0) },
        { label: "Effective APR", value: aprPct.toFixed(2) + "%", warn: aprVsNominal > 1 },
        { label: "APR vs Nominal Rate", value: "+" + aprVsNominal.toFixed(2) + "%", warn: true },
        { label: "Monthly EMI", value: fm(Math.round(emi)) },
        { label: "Total Interest", value: fm(Math.round(totalInterest)), warn: true },
        { label: "Total Cost (incl. fees)", value: fm(Math.round(totalCost)) },
      ],
      [{ type: aprVsNominal > 1.5 ? "warn" : "tip", msg: "Processing fees increase your effective APR by " + aprVsNominal.toFixed(2) + "%. Always compare APR (not nominal rate) when choosing between loans. Lower fees can offset a higher interest rate!" }],
      null, []
    ));
  }, [amount, nominalRate, fees, term, tab, lenders]);

  const inputs = (
    <div className="calc-inputs-grid">
      <Presets items={[
        { label: "Home Loan", v: { a: 5000000, r: 8.5, f: "25000", t: 20 } },
        { label: "Personal Loan", v: { a: 200000, r: 14, f: "3000", t: 3 } },
        { label: "Car Loan", v: { a: 800000, r: 9, f: "8000", t: 5 } },
      ]} onApply={p => { setAmount(p.v.a); setNominalRate(p.v.r); setFees(p.v.f); setTerm(p.v.t); }} />
      <Tabs tabs={["Single Loan", "Compare Lenders"]} active={tab} onChange={setTab} />
      <InputSection title="Loan Details" icon="📋" gradient="linear-gradient(135deg,#4361ee,#3451c7)">
        <Sl label="Loan Amount" id="apr_a" min={10000} max={20000000} step={10000} value={amount} onChange={setAmount} fmt={v => fmSlider(v)} />
        <Sl label="Nominal Interest Rate (%)" id="apr_r" min={5} max={30} step={0.25} value={nominalRate} onChange={setNominalRate} fmt={v => v + "%"} />
        <Sel label="Loan Term" id="apr_t" value={String(term)} onChange={v => setTerm(+v)} opts={[
          { v: "1", l: "1 Year" }, { v: "2", l: "2 Years" }, { v: "3", l: "3 Years" },
          { v: "5", l: "5 Years" }, { v: "10", l: "10 Years" }, { v: "20", l: "20 Years" }
        ]} />
        {tab !== "Compare Lenders" && (
          <N label="Processing Fees / Charges" id="apr_f" value={fees} onChange={setFees} unit={sym} placeholder="15000" hint="All upfront fees reduce net loan proceeds" />
        )}
      </InputSection>
      {tab === "Compare Lenders" && (
        <InputSection title="Lender Comparison" icon="🏦" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
          {lenders.map(l => (
            <div key={l.id} style={{ padding: "10px 12px", background: "var(--surface2)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", marginBottom: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>{l.name}</p>
              <Row2>
                <N label="Rate %" id={"apr_lr" + l.id} value={String(l.rate)} onChange={v => setLenders(prev => prev.map(x => x.id === l.id ? { ...x, rate: +v } : x))} unit="%" placeholder="10" hint="" />
                <N label="Fees" id={"apr_lf" + l.id} value={l.fees} onChange={v => setLenders(prev => prev.map(x => x.id === l.id ? { ...x, fees: v } : x))} unit={sym} placeholder="10000" hint="" />
              </Row2>
            </div>
          ))}
        </InputSection>
      )}
    </div>
  );

  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="APR Calculator" />
      <SEOSection title="APR Calculator — True Cost of Borrowing">
        <p>Annual Percentage Rate (APR) is the true cost of a loan including both the interest rate and all fees. A loan advertised at 10% with ₹15,000 processing fee has a higher effective APR because you receive less money but pay the same EMI. Use our Compare Lenders tab to find the best deal — sometimes a higher rate with lower fees is cheaper overall. RBI mandates banks to disclose APR for transparency.</p>
      </SEOSection>
    </>
  );
}

// ── Budget Planner ────────────────────────────────────────────────────
export function BudgetForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [income, setIncome] = useState(80000);
  const [expenses, setExpenses] = useState([
    { id: 1, name: "Rent", amount: "20000", category: "needs" },
    { id: 2, name: "Groceries", amount: "8000", category: "needs" },
    { id: 3, name: "Transport", amount: "5000", category: "needs" },
    { id: 4, name: "Dining Out", amount: "6000", category: "wants" },
    { id: 5, name: "Entertainment", amount: "4000", category: "wants" },
    { id: 6, name: "SIP Investment", amount: "10000", category: "savings" },
  ]);
  const [rule, setRule] = useState("50-30-20");
  const [res, setRes] = useState(null);

  const RULES = {
    "50-30-20": { needs: 50, wants: 30, savings: 20, label: "50/30/20 Rule" },
    "70-20-10": { needs: 70, wants: 20, savings: 10, label: "70/20/10 Rule" },
    "60-30-10": { needs: 60, wants: 30, savings: 10, label: "60/30/10 Rule" },
  };

  useEffect(() => {
    const totalExp = expenses.reduce((s, e) => s + (+e.amount || 0), 0);
    const needs = expenses.filter(e => e.category === "needs").reduce((s, e) => s + (+e.amount || 0), 0);
    const wants = expenses.filter(e => e.category === "wants").reduce((s, e) => s + (+e.amount || 0), 0);
    const savings = expenses.filter(e => e.category === "savings").reduce((s, e) => s + (+e.amount || 0), 0);
    const surplus = income - totalExp;
    const r = RULES[rule];
    const needsPct = (needs / income) * 100;
    const wantsPct = (wants / income) * 100;
    const savingsPct = (savings / income) * 100;
    const chart = { type: "donut", data: [
      { name: "Needs (" + needsPct.toFixed(0) + "%)", value: Math.round(needs) },
      { name: "Wants (" + wantsPct.toFixed(0) + "%)", value: Math.round(wants) },
      { name: "Savings (" + savingsPct.toFixed(0) + "%)", value: Math.round(savings) },
      surplus > 0 ? { name: "Unallocated", value: Math.round(surplus) } : null
    ].filter(Boolean), keys: ["value"] };
    setRes(buildResult(surplus >= 0 ? "Monthly Surplus" : "Monthly Deficit", fm(Math.abs(Math.round(surplus))),
      [
        { label: "Monthly Income", value: fm(income) },
        { label: "Total Expenses", value: fm(Math.round(totalExp)) },
        { label: "Needs (" + needsPct.toFixed(0) + "% vs target " + r.needs + "%)", value: fm(Math.round(needs)), warn: needsPct > r.needs + 5 },
        { label: "Wants (" + wantsPct.toFixed(0) + "% vs target " + r.wants + "%)", value: fm(Math.round(wants)), warn: wantsPct > r.wants + 5 },
        { label: "Savings (" + savingsPct.toFixed(0) + "% vs target " + r.savings + "%)", value: fm(Math.round(savings)), warn: savingsPct < r.savings - 5, highlight: savingsPct >= r.savings },
        { label: "Surplus / Deficit", value: fm(Math.round(Math.abs(surplus))), highlight: surplus >= 0, warn: surplus < 0 },
      ],
      [{ type: surplus >= 0 ? "tip" : "warn", msg: surplus >= 0 ? "You have " + fm(Math.round(surplus)) + " unallocated each month. Put it into SIP or emergency fund!" : "You're spending " + fm(Math.abs(Math.round(surplus))) + " more than you earn. Review your " + (wantsPct > r.wants ? "wants" : "needs") + " category first." }],
      chart, []
    ));
  }, [income, expenses, rule]);

  const updateExpense = (id, field, value) => setExpenses(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  const addExpense = () => setExpenses(prev => [...prev, { id: Date.now(), name: "Expense " + (prev.length + 1), amount: "0", category: "needs" }]);
  const removeExpense = (id) => setExpenses(prev => prev.filter(e => e.id !== id));

  const inputs = (
    <div className="calc-inputs-grid">
      <Presets items={[
        { label: "Fresher Budget", v: { income: 40000, rule: "50-30-20" } },
        { label: "Mid-Level Professional", v: { income: 80000, rule: "50-30-20" } },
        { label: "Senior Professional", v: { income: 200000, rule: "60-30-10" } },
      ]} onApply={p => { setIncome(p.v.income); setRule(p.v.rule); }} />
      <InputSection title="Income & Budget Rule" icon="💰" gradient="linear-gradient(135deg,#4361ee,#3451c7)">
        <Sl label="Monthly Income" id="bud_inc" min={5000} max={500000} step={5000} value={income} onChange={setIncome} fmt={v => fmSlider(v)} />
        <Sel label="Budget Rule" id="bud_rule" value={rule} onChange={setRule} opts={[
          { v: "50-30-20", l: "50/30/20 — Needs/Wants/Savings" },
          { v: "70-20-10", l: "70/20/10 — Needs/Savings/Debt" },
          { v: "60-30-10", l: "60/30/10 — Needs/Wants/Savings" },
        ]} />
      </InputSection>
      <InputSection title="Monthly Expenses" icon="🧾" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
        {expenses.map(exp => (
          <div key={exp.id} style={{ padding: "10px 12px", background: "var(--surface2)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <input value={exp.name} onChange={e => updateExpense(exp.id, "name", e.target.value)} style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", background: "transparent", border: "none", outline: "none", flex: 1 }} />
              <button onClick={() => removeExpense(exp.id)} style={{ fontSize: 11, color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>×</button>
            </div>
            <Row2>
              <N label="Amount" id={"bud_a" + exp.id} value={exp.amount} onChange={v => updateExpense(exp.id, "amount", v)} unit={sym} placeholder="0" hint="" />
              <Sel label="Category" id={"bud_c" + exp.id} value={exp.category} onChange={v => updateExpense(exp.id, "category", v)} opts={[
                { v: "needs", l: "Needs" }, { v: "wants", l: "Wants" }, { v: "savings", l: "Savings" }
              ]} />
            </Row2>
          </div>
        ))}
        <button onClick={addExpense} style={{ width: "100%", padding: "8px", borderRadius: "var(--r-md)", border: "2px dashed var(--border)", background: "transparent", color: "var(--brand)", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>+ Add Expense</button>
      </InputSection>
    </div>
  );

  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="Budget Planner" />
      <SEOSection title="Monthly Budget Planner — 50/30/20 Rule">
        <p>The 50/30/20 rule allocates 50% of after-tax income to needs (rent, food, utilities), 30% to wants (dining, entertainment, subscriptions), and 20% to savings and debt repayment. Adjust based on your situation — high-cost cities may need 60% for needs. The key is tracking every rupee. Start with any savings rate, even 5%, and increase by 1% every month. Automate savings via SIP on salary day before you can spend it.</p>
      </SEOSection>
    </>
  );
}

// ── Mortgage Payoff Accelerator ───────────────────────────────────────
export function MortgagePayoffForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [balance, setBalance] = useState(3000000);
  const [rate, setRate] = useState(8.5);
  const [remainingMonths, setRemainingMonths] = useState(240);
  const [extraPayment, setExtraPayment] = useState(10000);
  const [lumpSum, setLumpSum] = useState("0");
  const [res, setRes] = useState(null);

  function simulate(bal, r, months, extra, lump) {
    let b = bal - lump, mo = 0, totalInt = 0;
    const monthlyRate = r / 100 / 12;
    const origEMI = monthlyRate > 0 ? (bal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1) : bal / months;
    const pmt = origEMI + extra;
    while (b > 0.01 && mo < months + 1) {
      const ip = b * monthlyRate;
      totalInt += ip;
      const pp = Math.min(pmt - ip, b);
      if (pp <= 0) break;
      b -= pp;
      mo++;
    }
    return { months: mo, totalInterest: Math.round(totalInt), emi: Math.round(origEMI) };
  }

  useEffect(() => {
    if (!balance || !rate || !remainingMonths) return;
    const base = simulate(balance, rate, remainingMonths, 0, 0);
    const withExtra = simulate(balance, rate, remainingMonths, extraPayment, +lumpSum || 0);
    const scenarios = [1000, 3000, 5000, 10000].map(ep => ({ extra: ep, ...simulate(balance, rate, remainingMonths, ep, 0) }));
    const moSaved = base.months - withExtra.months;
    const intSaved = base.totalInterest - withExtra.totalInterest;
    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + withExtra.months);
    const chart = { type: "bar", data: [
      { name: "Min Only", value: base.months },
      ...scenarios.map(s => ({ name: "+" + fm(s.extra) + "/mo", value: s.months }))
    ], keys: ["value"] };
    setRes(buildResult("Months Saved", moSaved + " months",
      [
        { label: "Remaining Balance", value: fm(balance) },
        { label: "Interest Rate", value: rate + "% p.a." },
        { label: "Current EMI", value: fm(base.emi) },
        { label: "Extra Payment/mo", value: extraPayment > 0 ? fm(extraPayment) : "None", highlight: extraPayment > 0 },
        { label: "Lump Sum Payment", value: +lumpSum > 0 ? fm(+lumpSum) : "None", highlight: +lumpSum > 0 },
        { label: "Original Payoff", value: base.months + " months" },
        { label: "New Payoff", value: withExtra.months + " months", highlight: true },
        { label: "Months Saved", value: moSaved + " months", highlight: true },
        { label: "Interest Saved", value: fm(intSaved), highlight: true },
        { label: "New Payoff Date", value: payoffDate.toLocaleDateString("en-IN", { month: "short", year: "numeric" }) },
      ],
      [{ type: "tip", msg: intSaved > 0 ? "Extra " + fm(extraPayment) + "/mo saves " + fm(intSaved) + " in interest and " + moSaved + " months! That's " + (moSaved / 12).toFixed(1) + " years of freedom." : "Add an extra monthly payment to see how much time and interest you can save!" }],
      chart, []
    ));
  }, [balance, rate, remainingMonths, extraPayment, lumpSum]);

  const inputs = (
    <div className="calc-inputs-grid">
      <Presets items={[
        { label: "New Home Loan", v: { b: 5000000, r: 8.5, rm: 240, ep: 5000, ls: "0" } },
        { label: "Mid-way (10 yrs left)", v: { b: 2500000, r: 8.0, rm: 120, ep: 10000, ls: "100000" } },
        { label: "Small Loan (5 yrs left)", v: { b: 800000, r: 9.0, rm: 60, ep: 3000, ls: "0" } },
      ]} onApply={p => { setBalance(p.v.b); setRate(p.v.r); setRemainingMonths(p.v.rm); setExtraPayment(p.v.ep); setLumpSum(p.v.ls); }} />
      <InputSection title="Current Loan Status" icon="🏠" gradient="linear-gradient(135deg,#4361ee,#3451c7)">
        <Sl label="Outstanding Balance" id="mp_b" min={100000} max={20000000} step={100000} value={balance} onChange={setBalance} fmt={v => fmSlider(v)} />
        <Sl label="Interest Rate (% p.a.)" id="mp_r" min={6} max={16} step={0.25} value={rate} onChange={setRate} fmt={v => v + "%"} />
        <N label="Remaining Months" id="mp_rm" value={String(remainingMonths)} onChange={v => setRemainingMonths(+v || 12)} unit="mo" placeholder="240" hint="How many EMIs remain on your loan" />
      </InputSection>
      <InputSection title="Payoff Strategy" icon="⚡" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
        <Sl label="Extra Monthly Payment" id="mp_ep" min={0} max={100000} step={1000} value={extraPayment} onChange={setExtraPayment} fmt={v => fmSlider(v)} />
        <N label="One-time Lump Sum Payment" id="mp_ls" value={lumpSum} onChange={setLumpSum} unit={sym} placeholder="0" hint="Bonus/windfall applied to principal immediately" />
      </InputSection>
    </div>
  );

  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="Mortgage Payoff" />
      <SEOSection title="Mortgage Payoff Accelerator — Pay Off Home Loan Early">
        <p>Prepaying your home loan even partially can save lakhs in interest. Indian banks allow partial prepayment without penalty on floating-rate home loans (RBI directive). Fixed-rate loans may have a 2–4% prepayment charge. Rule of thumb: every ₹10,000 extra per month on a ₹50L, 8.5% loan with 20 years remaining saves ~₹18L in interest and cuts 6 years off! Use bonuses, salary increments, and annual windfalls to accelerate prepayment.</p>
      </SEOSection>
    </>
  );
}

// ── Present Value Calculator ──────────────────────────────────────────
export function PresentValueForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [futureValue, setFutureValue] = useState(1000000);
  const [years, setYears] = useState(10);
  const [discountRate, setDiscountRate] = useState(10);
  const [inflationRate, setInflationRate] = useState(6);
  const [tab, setTab] = useState("Single Goal");
  const [cashflows, setCashflows] = useState(["100000", "120000", "150000", "200000", "250000"]);
  const [res, setRes] = useState(null);

  useEffect(() => {
    if (tab === "Multi-year NPV") {
      const validFlows = cashflows.filter(f => f !== "" && !isNaN(+f));
      if (validFlows.length === 0) return;
      const r = discountRate / 100;
      let npvNominal = 0, npvReal = 0;
      const realRate = (1 + discountRate / 100) / (1 + inflationRate / 100) - 1;
      validFlows.forEach((f, i) => {
        npvNominal += +f / Math.pow(1 + r, i + 1);
        npvReal += +f / Math.pow(1 + realRate, i + 1);
      });
      const chart = { type: "bar", data: validFlows.map((f, i) => ({ year: "Yr " + (i + 1), "Nominal": Math.round(+f / Math.pow(1 + r, i + 1)), "Real": Math.round(+f / Math.pow(1 + realRate, i + 1)) })), keys: ["Nominal", "Real"] };
      setRes(buildResult("NPV (Nominal)", fm(Math.round(npvNominal)),
        [
          { label: "Discount Rate", value: discountRate + "%" },
          { label: "Inflation Rate", value: inflationRate + "%" },
          { label: "Real Discount Rate", value: (realRate * 100).toFixed(2) + "%" },
          { label: "NPV (Nominal)", value: fm(Math.round(npvNominal)), highlight: npvNominal > 0 },
          { label: "NPV (Inflation-Adjusted)", value: fm(Math.round(npvReal)), highlight: npvReal > 0 },
          { label: "Inflation Impact on NPV", value: fm(Math.round(npvNominal - npvReal)), warn: true },
        ],
        [{ type: "tip", msg: "Inflation at " + inflationRate + "% reduces real NPV by " + fm(Math.round(npvNominal - npvReal)) + ". Always account for inflation in long-term financial projections!" }],
        chart, []
      ));
      return;
    }
    if (!futureValue || !years || !discountRate) return;
    const pvNominal = futureValue / Math.pow(1 + discountRate / 100, years);
    const realRate = (1 + discountRate / 100) / (1 + inflationRate / 100) - 1;
    const pvReal = futureValue / Math.pow(1 + realRate, years);
    const rule72 = 72 / discountRate;
    const rule72inflation = 72 / inflationRate;
    setRes(buildResult("Present Value", fm(Math.round(pvNominal)),
      [
        { label: "Future Goal Amount", value: fm(futureValue) },
        { label: "Years Away", value: years + " years" },
        { label: "Discount Rate", value: discountRate + "%" },
        { label: "Inflation Rate", value: inflationRate + "%" },
        { label: "PV (Nominal, at " + discountRate + "%)", value: fm(Math.round(pvNominal)), highlight: true },
        { label: "PV (Real, inflation-adjusted)", value: fm(Math.round(pvReal)), warn: true },
        { label: "Inflation Erosion over " + years + "yr", value: fm(Math.round(pvNominal - pvReal)), warn: true },
        { label: "Rule of 72 (money doubles at " + discountRate + "%)", value: "Every " + rule72.toFixed(1) + " years" },
        { label: "Rule of 72 (inflation halves at " + inflationRate + "%)", value: "Purchasing power halves in " + rule72inflation.toFixed(1) + " years" },
      ],
      [{ type: "tip", msg: "To have " + fm(futureValue) + " in " + years + " years, you need " + fm(Math.round(pvNominal)) + " today at " + discountRate + "% return. Inflation at " + inflationRate + "% means real purchasing power equivalent is " + fm(Math.round(pvReal)) + "." }],
      null, []
    ));
  }, [futureValue, years, discountRate, inflationRate, tab, cashflows]);

  const inputs = (
    <div className="calc-inputs-grid">
      <Presets items={[
        { label: "₹1 Cr Retirement (10yr)", v: { fv: 10000000, y: 10, dr: 10, ir: 6 } },
        { label: "Child Education (15yr)", v: { fv: 3000000, y: 15, dr: 10, ir: 7 } },
        { label: "House Down Payment (5yr)", v: { fv: 1000000, y: 5, dr: 8, ir: 5 } },
      ]} onApply={p => { setFutureValue(p.v.fv); setYears(p.v.y); setDiscountRate(p.v.dr); setInflationRate(p.v.ir); }} />
      <Tabs tabs={["Single Goal", "Multi-year NPV"]} active={tab} onChange={setTab} />
      <InputSection title="Future Value Goal" icon="🎯" gradient="linear-gradient(135deg,#4361ee,#3451c7)">
        {tab === "Single Goal" ? (
          <>
            <Sl label="Target Future Amount" id="pv_fv" min={10000} max={50000000} step={10000} value={futureValue} onChange={setFutureValue} fmt={v => fmSlider(v)} />
            <Sl label="Years Until Goal" id="pv_y" min={1} max={40} value={years} onChange={setYears} fmt={v => v + " years"} />
          </>
        ) : (
          <>
            {cashflows.map((cf, i) => (
              <N key={i} label={"Year " + (i + 1) + " Cash Flow"} id={"pv_cf" + i} value={cf} onChange={v => setCashflows(prev => prev.map((f, idx) => idx === i ? v : f))} unit={sym} placeholder="0" hint="" />
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button onClick={() => setCashflows(p => [...p, ""])} style={{ flex: 1, padding: "7px", borderRadius: "var(--r-md)", border: "1.5px solid var(--brand)", background: "transparent", color: "var(--brand)", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>+ Year</button>
              {cashflows.length > 1 && <button onClick={() => setCashflows(p => p.slice(0, -1))} style={{ flex: 1, padding: "7px", borderRadius: "var(--r-md)", border: "1.5px solid #ef4444", background: "transparent", color: "#ef4444", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>- Year</button>}
            </div>
          </>
        )}
      </InputSection>
      <InputSection title="Discount & Inflation Rates" icon="📉" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
        <Sl label="Discount Rate (% p.a.)" id="pv_dr" min={1} max={20} step={0.5} value={discountRate} onChange={setDiscountRate} fmt={v => v + "%"} />
        <Sl label="Expected Inflation Rate (% p.a.)" id="pv_ir" min={0} max={15} step={0.5} value={inflationRate} onChange={setInflationRate} fmt={v => v + "%"} />
      </InputSection>
    </div>
  );

  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="Present Value" />
      <SEOSection title="Present Value Calculator — Time Value of Money">
        <p>The time value of money states that ₹1 today is worth more than ₹1 in the future. Present Value (PV) discounts future cash flows to their today-equivalent. Rule of 72: divide 72 by interest rate to find years for money to double (e.g., at 10%, money doubles every 7.2 years). Inflation works the same in reverse — at 6% inflation, purchasing power halves in 12 years. Use PV to plan for retirement, education, or any future financial goal.</p>
      </SEOSection>
    </>
  );
}

// ── Down Payment Savings Calculator ──────────────────────────────────
export function DownPaymentForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [homePrice, setHomePrice] = useState(8000000);
  const [targetPct, setTargetPct] = useState(20);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [monthlyAdding, setMonthlyAdding] = useState(20000);
  const [growthRate, setGrowthRate] = useState(7);
  const [res, setRes] = useState(null);

  useEffect(() => {
    const target = homePrice * (targetPct / 100);
    const gap = target - currentSavings;
    if (!homePrice || gap <= 0) {
      setRes(buildResult("Already Saved!", "Goal Met ✓",
        [{ label: "Target Down Payment", value: fm(Math.round(target)) }, { label: "Current Savings", value: fm(currentSavings) }, { label: "Surplus", value: fm(Math.round(currentSavings - target)), highlight: true }],
        [{ type: "tip", msg: "Congratulations! You have already saved enough for a " + targetPct + "% down payment." }],
        null, []
      ));
      return;
    }
    const r = growthRate / 100 / 12;
    let months = 0;
    let savings = currentSavings;
    while (savings < target && months < 600) {
      savings = savings * (1 + r) + monthlyAdding;
      months++;
    }
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + months);
    const ltv10 = homePrice * 0.10;
    const ltv20 = homePrice * 0.20;
    const ltv25 = homePrice * 0.25;
    const scenarios = [10, 20, 25].map(pct => {
      const t = homePrice * (pct / 100);
      const g = t - currentSavings;
      let m = 0, s = currentSavings;
      while (s < t && m < 600) { s = s * (1 + r) + monthlyAdding; m++; }
      return { pct, target: t, months: m };
    });
    const chart = { type: "bar", data: scenarios.map(s => ({ name: s.pct + "% DP", value: s.months })), keys: ["value"] };
    setRes(buildResult("Months to Goal", months + " months",
      [
        { label: "Home Price", value: fm(homePrice) },
        { label: "Target Down Payment (" + targetPct + "%)", value: fm(Math.round(target)), highlight: true },
        { label: "Current Savings", value: fm(currentSavings) },
        { label: "Gap to Goal", value: fm(Math.round(gap)), warn: true },
        { label: "Monthly Savings", value: fm(monthlyAdding) },
        { label: "Expected Return on Savings", value: growthRate + "% p.a." },
        { label: "Months to Goal", value: months + " months", highlight: true },
        { label: "Target Date", value: targetDate.toLocaleDateString("en-IN", { month: "short", year: "numeric" }), highlight: true },
        { label: "10% DP Milestone", value: scenarios[0].months + " months" },
        { label: "20% DP Milestone", value: scenarios[1].months + " months" },
        { label: "25% DP Milestone", value: scenarios[2].months + " months" },
      ],
      [{ type: "tip", msg: "At " + fm(monthlyAdding) + "/mo with " + growthRate + "% returns, you'll reach your " + targetPct + "% down payment goal by " + targetDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" }) + ". Reach 20% to avoid PMI/LMI charges!" }],
      chart, []
    ));
  }, [homePrice, targetPct, currentSavings, monthlyAdding, growthRate]);

  const inputs = (
    <div className="calc-inputs-grid">
      <Presets items={[
        { label: "Starter Home 20% DP", v: { hp: 5000000, tp: 20, cs: 200000, ma: 15000, gr: 7 } },
        { label: "Premium Flat 25% DP", v: { hp: 12000000, tp: 25, cs: 1000000, ma: 40000, gr: 8 } },
        { label: "Luxury Villa 30% DP", v: { hp: 30000000, tp: 30, cs: 2000000, ma: 100000, gr: 8 } },
      ]} onApply={p => { setHomePrice(p.v.hp); setTargetPct(p.v.tp); setCurrentSavings(p.v.cs); setMonthlyAdding(p.v.ma); setGrowthRate(p.v.gr); }} />
      <InputSection title="Home & Down Payment Target" icon="🏠" gradient="linear-gradient(135deg,#4361ee,#3451c7)">
        <Sl label="Target Home Price" id="dp_hp" min={500000} max={100000000} step={100000} value={homePrice} onChange={setHomePrice} fmt={v => fmSlider(v)} />
        <Sl label="Down Payment Target (%)" id="dp_tp" min={5} max={50} value={targetPct} onChange={setTargetPct} fmt={v => v + "% (" + fmSlider(homePrice * v / 100) + ")"} />
      </InputSection>
      <InputSection title="Your Savings Plan" icon="💰" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
        <N label="Current Savings" id="dp_cs" value={String(currentSavings)} onChange={v => setCurrentSavings(+v || 0)} unit={sym} placeholder="500000" hint="Amount already saved toward down payment" />
        <Sl label="Monthly Savings Contribution" id="dp_ma" min={1000} max={200000} step={1000} value={monthlyAdding} onChange={setMonthlyAdding} fmt={v => fmSlider(v)} />
        <Sl label="Expected Return on Savings (%)" id="dp_gr" min={3} max={15} step={0.5} value={growthRate} onChange={setGrowthRate} fmt={v => v + "% p.a."} />
      </InputSection>
    </div>
  );

  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="Down Payment Savings" />
      <SEOSection title="Down Payment Savings Calculator — Home Buying Goal">
        <p>A larger down payment reduces your home loan burden and gets you better interest rates. At 20%+ down payment, you typically avoid mortgage insurance premiums. In India, banks finance up to 90% for loans under ₹30L, 80% for ₹30–75L, and 75% for above ₹75L (RBI guidelines). LTV milestones: 10% DP = you're in the game; 20% DP = no insurance premium; 25% DP = best interest rates. Keep your down payment savings in liquid instruments: FDs, liquid mutual funds, or savings accounts.</p>
      </SEOSection>
    </>
  );
}

// ── Commission Calculator ─────────────────────────────────────────────
export function CommissionForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [salesAmount, setSalesAmount] = useState(1000000);
  const [baseSalary, setBaseSalary] = useState(30000);
  const [commType, setCommType] = useState("percentage");
  const [flatComm, setFlatComm] = useState("5000");
  const [pctComm, setPctComm] = useState(5);
  const [slabs, setSlabs] = useState([
    { id: 1, upto: "500000", rate: 3 },
    { id: 2, upto: "1000000", rate: 5 },
    { id: 3, upto: "Unlimited", rate: 8 },
  ]);
  const [res, setRes] = useState(null);

  function calcTieredComm(sales, slabList) {
    let commission = 0, prev = 0;
    for (let i = 0; i < slabList.length; i++) {
      const limit = slabList[i].upto === "Unlimited" ? sales : Math.min(sales, +slabList[i].upto);
      if (limit > prev) {
        commission += (limit - prev) * (slabList[i].rate / 100);
        prev = limit;
      }
      if (prev >= sales) break;
    }
    return commission;
  }

  useEffect(() => {
    if (!salesAmount) return;
    let commission = 0;
    if (commType === "flat") {
      commission = +flatComm || 0;
    } else if (commType === "percentage") {
      commission = salesAmount * (pctComm / 100);
    } else {
      commission = calcTieredComm(salesAmount, slabs);
    }
    const totalPay = baseSalary + commission;
    const effectiveRate = salesAmount > 0 ? (commission / salesAmount) * 100 : 0;
    const annualSales = salesAmount * 12;
    const annualComm = commission * 12;
    const annualTotal = totalPay * 12;
    const chart = { type: "donut", data: [
      { name: "Base Salary", value: Math.round(baseSalary) },
      { name: "Commission", value: Math.round(commission) }
    ], keys: ["value"] };
    setRes(buildResult("Total Monthly Pay", fm(Math.round(totalPay)),
      [
        { label: "Monthly Sales", value: fm(salesAmount) },
        { label: "Base Salary", value: fm(baseSalary) },
        { label: "Commission Earned", value: fm(Math.round(commission)), highlight: true },
        { label: "Total Monthly Pay", value: fm(Math.round(totalPay)), highlight: true },
        { label: "Effective Commission Rate", value: effectiveRate.toFixed(2) + "%" },
        { label: "Commission Type", value: commType === "flat" ? "Flat Fee" : commType === "percentage" ? "Percentage (" + pctComm + "%)" : "Tiered" },
        { label: "Annual Sales Target", value: fm(Math.round(annualSales)) },
        { label: "Annual Commission", value: fm(Math.round(annualComm)), highlight: true },
        { label: "Annual Total Earnings", value: fm(Math.round(annualTotal)), highlight: true },
      ],
      [{ type: "tip", msg: "Commission of " + fm(Math.round(commission)) + " is " + ((commission / totalPay) * 100).toFixed(0) + "% of your total pay. " + (commType === "tiered" ? "Tiered structure rewards exceeding targets — push to the next slab!" : "Scale up sales to " + fm(salesAmount * 1.5) + " to earn " + fm(Math.round(commission * 1.5)) + " commission!") }],
      chart, []
    ));
  }, [salesAmount, baseSalary, commType, flatComm, pctComm, slabs]);

  const inputs = (
    <div className="calc-inputs-grid">
      <Presets items={[
        { label: "Real Estate Agent", v: { sa: 5000000, bs: 30000, ct: "percentage", pc: 2 } },
        { label: "Sales Executive", v: { sa: 500000, bs: 25000, ct: "tiered", pc: 5 } },
        { label: "Insurance Agent", v: { sa: 200000, bs: 15000, ct: "percentage", pc: 15 } },
      ]} onApply={p => { setSalesAmount(p.v.sa); setBaseSalary(p.v.bs); setCommType(p.v.ct); setPctComm(p.v.pc || 5); }} />
      <InputSection title="Sales & Base Pay" icon="💼" gradient="linear-gradient(135deg,#4361ee,#3451c7)">
        <Sl label="Monthly Sales Amount" id="cm_sa" min={10000} max={50000000} step={10000} value={salesAmount} onChange={setSalesAmount} fmt={v => fmSlider(v)} />
        <Sl label="Monthly Base Salary" id="cm_bs" min={0} max={200000} step={1000} value={baseSalary} onChange={setBaseSalary} fmt={v => fmSlider(v)} />
      </InputSection>
      <InputSection title="Commission Structure" icon="📊" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
        <Sel label="Commission Type" id="cm_ct" value={commType} onChange={setCommType} opts={[
          { v: "flat", l: "Flat Fee" },
          { v: "percentage", l: "Percentage of Sales" },
          { v: "tiered", l: "Tiered / Slab-based" },
        ]} />
        {commType === "flat" && <N label="Flat Commission Amount" id="cm_flat" value={flatComm} onChange={setFlatComm} unit={sym} placeholder="5000" hint="Fixed commission regardless of sales volume" />}
        {commType === "percentage" && <Sl label="Commission Rate (%)" id="cm_pct" min={0.5} max={50} step={0.5} value={pctComm} onChange={setPctComm} fmt={v => v + "% of sales"} />}
        {commType === "tiered" && (
          <div>
            {slabs.map((slab, i) => (
              <div key={slab.id} style={{ padding: "8px 10px", background: "var(--surface2)", borderRadius: "var(--r-md)", border: "1px solid var(--border)", marginBottom: 6 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", marginBottom: 4 }}>Slab {i + 1}{i < slabs.length - 1 ? " (up to )" : " (unlimited)"}</p>
                <Row2>
                  {i < slabs.length - 1 && (
                    <N label="Up To" id={"cm_su" + slab.id} value={slab.upto} onChange={v => setSlabs(prev => prev.map(s => s.id === slab.id ? { ...s, upto: v } : s))} unit={sym} placeholder="500000" hint="" />
                  )}
                  <N label="Rate %" id={"cm_sr" + slab.id} value={String(slab.rate)} onChange={v => setSlabs(prev => prev.map(s => s.id === slab.id ? { ...s, rate: +v } : s))} unit="%" placeholder="5" hint="" />
                </Row2>
              </div>
            ))}
          </div>
        )}
      </InputSection>
    </div>
  );

  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="Commission Calculator" />
      <SEOSection title="Commission Calculator — Sales Compensation Models">
        <p>Sales commissions motivate performance and align employee incentives with company revenue. Common models: <strong>Flat fee</strong> — simple, predictable. <strong>Percentage</strong> — scales directly with sales, widely used in real estate (1–3%) and insurance (10–20%). <strong>Tiered/Slab</strong> — accelerates rewards for over-performance, creating powerful incentives to exceed targets. Best practice: keep base salary at 50–70% of OTE (On-Target Earnings) to balance security with motivation.</p>
      </SEOSection>
    </>
  );
}
`;

// Write files
writeFileSync(
  "src/components/calculator-core/forms/LoanDebtForms.jsx",
  loanDebtForms,
  "utf8"
);
console.log("✅ LoanDebtForms.jsx written (" + loanDebtForms.length + " bytes)");

writeFileSync(
  "src/components/calculator-core/forms/InvestmentForms.jsx",
  investmentForms,
  "utf8"
);
console.log("✅ InvestmentForms.jsx written (" + investmentForms.length + " bytes)");

writeFileSync(
  "src/components/calculator-core/forms/ExtraFinanceForms.jsx",
  extraFinanceForms,
  "utf8"
);
console.log("✅ ExtraFinanceForms.jsx written (" + extraFinanceForms.length + " bytes)");

console.log("\n🎉 All 3 files generated successfully!");
console.log("   LoanDebtForms: 5 calculators (AutoLoan, PersonalLoan, StudentLoan, CreditCard, DebtPayoff)");
console.log("   InvestmentForms: 4 calculators (StockReturn, NPV/IRR, PortfolioRebalance, DividendYield)");
console.log("   ExtraFinanceForms: 6 calculators (APR, Budget, MortgagePayoff, PresentValue, DownPayment, Commission)");
