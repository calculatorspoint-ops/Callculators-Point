import { writeFileSync } from 'fs';

const CONTENT = `import { useState, useEffect } from "react";
import {
  L, N, Sl, Sel, Tabs, Row2, Row3, Presets,
  Panel, buildResult, useCurrency,
  InputSection, Toggle, SEOSection
} from "./SharedComponents.jsx";

// ── Shared layout wrapper: inputs above, result full-width below ──
function CalcLayout({ inputs, result, label }) {
  return (
    <div className="calc-form-stack">
      <div>{inputs}</div>
      <Panel result={result} loading={null} label={label} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// EMI Calculator
// ─────────────────────────────────────────────────────────────────
export function EMIForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [rate, setRate] = useState(10.5);
  const [tenure, setTenure] = useState(240);
  const [extraPayment, setExtraPayment] = useState("0");
  const [stepUp, setStepUp] = useState("0");
  const [mode, setMode] = useState("Basic");
  const [res, setRes] = useState(null);

  useEffect(() => {
    if (!loanAmount || !rate || !tenure) return;
    const r = rate / 100 / 12;
    const n = tenure;
    const emi = r > 0 ? (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : loanAmount / n;
    const totalPayable = emi * n;
    const totalInterest = totalPayable - loanAmount;
    const ep = +extraPayment || 0;

    // With extra payment
    let bal = loanAmount, mo = 0, intWithExtra = 0;
    if (ep > 0) {
      while (bal > 0 && mo < n * 2) {
        const i = bal * r; intWithExtra += i;
        const p = Math.min(emi + ep - i, bal); bal -= p; mo++;
      }
    }
    const interestSaved = ep > 0 ? totalInterest - intWithExtra : 0;

    // Amortization (first year)
    const amTable = [];
    let b = loanAmount;
    for (let i = 1; i <= Math.min(n, 12); i++) {
      const int = b * r; const prin = emi - int; b -= prin;
      amTable.push({ label: "Month " + i, value: "EMI " + fm(Math.round(emi)) + " | Principal " + fm(Math.round(prin)) + " | Balance " + fm(Math.max(0, Math.round(b))) });
    }

    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + (ep > 0 ? mo : n));

    setRes(buildResult("Monthly EMI", fm(Math.round(emi)),
      [
        { label: "Loan Amount", value: fm(loanAmount) },
        { label: "Total Interest", value: fm(Math.round(totalInterest)), warn: true },
        { label: "Total Payable", value: fm(Math.round(totalPayable)) },
        { label: "Tenure", value: (tenure / 12).toFixed(1) + " years" },
        ep > 0 ? { label: "Interest Saved", value: fm(Math.round(interestSaved)), highlight: true } : null,
        ep > 0 ? { label: "Payoff Date (with extra)", value: payoffDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }) } : null,
      ].filter(Boolean),
      [{ type: totalInterest > loanAmount ? "warn" : "tip", msg: "Total interest (" + fm(Math.round(totalInterest)) + ") is " + (totalInterest / loanAmount * 100).toFixed(0) + "% of your loan amount." + (ep > 0 ? " Extra payment of " + fm(ep) + "/mo saves " + fm(Math.round(interestSaved)) + "!" : " Consider making extra payments to reduce this.") }],
      { type: "donut", data: [{ name: "Principal", value: loanAmount }, { name: "Interest", value: Math.round(totalInterest) }], keys: ["value"] },
      amTable
    ));
  }, [loanAmount, rate, tenure, extraPayment, mode]);

  const inputs = (
    <>
      <Presets items={[
        { label: "Home Loan 20yr", v: { a: 3000000, r: 8.5, t: 240, ep: "0" } },
        { label: "Car Loan 5yr", v: { a: 800000, r: 9.5, t: 60, ep: "0" } },
        { label: "Personal 3yr", v: { a: 200000, r: 14, t: 36, ep: "0" } },
      ]} onApply={pr => { setLoanAmount(pr.v.a); setRate(pr.v.r); setTenure(pr.v.t); setExtraPayment(pr.v.ep); }} />

      <div className="calc-inputs-grid">
        <InputSection title="Loan Details" icon="🏦" gradient="linear-gradient(135deg,#4361ee,#3451c7)">
          <Sl label="Loan Amount" id="emi_a" min={10000} max={20000000} step={10000} value={loanAmount} onChange={setLoanAmount} fmt={v => fmSlider(v)} />
          <Sl label="Interest Rate (% p.a.)" id="emi_r" min={4} max={30} step={0.05} value={rate} onChange={setRate} fmt={v => v + "%"} />
          <Sl label="Tenure (months)" id="emi_t" min={6} max={360} step={6} value={tenure} onChange={setTenure} fmt={v => v + " mo (" + (v / 12).toFixed(1) + " yr)"} />
        </InputSection>
        <InputSection title="Advanced Options" icon="⚡" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
          <N label="Extra Monthly Payment" id="emi_ep" value={extraPayment} onChange={setExtraPayment} unit={sym} placeholder="0" hint="Additional payment above your regular EMI" />
          <N label="Annual Step-Up %" id="emi_su" value={stepUp} onChange={setStepUp} unit="%" placeholder="0" hint="Increase EMI by this % each year" />
        </InputSection>
      </div>
    </>
  );
  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="EMI" />
      <SEOSection title="How is EMI Calculated?">
        <p>EMI = P × r × (1+r)^n ÷ ((1+r)^n − 1), where P = principal, r = monthly rate, n = tenure in months.</p>
        <p style={{marginTop:8}}>Making even small extra payments dramatically reduces total interest — paying ₹5,000 extra/month on a ₹30L loan can save ₹5–7 lakhs in interest and cut years off your loan.</p>
      </SEOSection>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// Compound Interest Calculator
// ─────────────────────────────────────────────────────────────────
export function CompoundForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [freq, setFreq] = useState("12");
  const [monthlyContrib, setMonthlyContrib] = useState("0");
  const [inflationRate, setInflationRate] = useState("6");
  const [res, setRes] = useState(null);

  const freqOpts = [
    { v: "1", l: "Annually" }, { v: "4", l: "Quarterly" },
    { v: "12", l: "Monthly" }, { v: "365", l: "Daily" },
  ];

  useEffect(() => {
    const n = +freq, mc = +monthlyContrib || 0, inf = +inflationRate || 0;
    const r = rate / 100 / n;
    const periods = years * n;
    let amount = principal * Math.pow(1 + r, periods);
    if (mc > 0) {
      const monthlyR = rate / 100 / 12;
      amount = principal * Math.pow(1 + monthlyR, years * 12);
      for (let i = 1; i <= years * 12; i++) {
        amount += mc * Math.pow(1 + monthlyR, years * 12 - i);
      }
    }
    const totalInvested = principal + mc * years * 12;
    const totalInterest = amount - totalInvested;
    const realAmount = amount / Math.pow(1 + inf / 100, years);
    const cagr = (Math.pow(amount / principal, 1 / years) - 1) * 100;

    const yearlyData = [];
    for (let y = 1; y <= Math.min(years, 20); y++) {
      let a = principal * Math.pow(1 + rate / 100 / n, y * n);
      if (mc > 0) {
        const mr = rate / 100 / 12;
        a = principal * Math.pow(1 + mr, y * 12);
        for (let i = 1; i <= y * 12; i++) a += mc * Math.pow(1 + mr, y * 12 - i);
      }
      yearlyData.push({ label: "Year " + y, value: fm(Math.round(a)) });
    }

    setRes(buildResult("Final Amount", fm(Math.round(amount)),
      [
        { label: "Principal Invested", value: fm(Math.round(totalInvested)) },
        { label: "Total Returns", value: fm(Math.round(totalInterest)), highlight: true },
        { label: "Real Value (after inflation)", value: fm(Math.round(realAmount)), warn: inf > 0 },
        { label: "CAGR", value: cagr.toFixed(2) + "%" },
        { label: "Wealth Multiple", value: (amount / totalInvested).toFixed(2) + "x" },
        mc > 0 ? { label: "Total Invested (with SIP)", value: fm(Math.round(totalInvested)) } : null,
      ].filter(Boolean),
      [{ type: "tip", msg: fm(Math.round(totalInvested)) + " invested at " + rate + "% for " + years + " years grows to " + fm(Math.round(amount)) + " — a " + (amount / totalInvested).toFixed(1) + "x wealth multiple!" }],
      { type: "bar", data: yearlyData.slice(0, 10).map(y => ({ year: y.label.replace("Year ", "Yr "), value: Math.round(amount * (yearlyData.indexOf(y) + 1) / yearlyData.length) })), keys: ["value"] },
      yearlyData
    ));
  }, [principal, rate, years, freq, monthlyContrib, inflationRate]);

  const inputs = (
    <>
      <Presets items={[
        { label: "Aggressive 15yr", v: { p: 500000, r: 15, y: 15, f: "12", mc: "0", inf: "6" } },
        { label: "FD @ 7% 5yr", v: { p: 100000, r: 7, y: 5, f: "4", mc: "0", inf: "6" } },
        { label: "SIP Mode 20yr", v: { p: 100000, r: 12, y: 20, f: "12", mc: "10000", inf: "6" } },
      ]} onApply={pr => { setPrincipal(pr.v.p); setRate(pr.v.r); setYears(pr.v.y); setFreq(pr.v.f); setMonthlyContrib(pr.v.mc); setInflationRate(pr.v.inf); }} />

      <div className="calc-inputs-grid">
        <InputSection title="Investment Details" icon="📈" gradient="linear-gradient(135deg,#059669,#047857)">
          <Sl label="Principal Amount" id="ci_p" min={1000} max={10000000} step={1000} value={principal} onChange={setPrincipal} fmt={v => fmSlider(v)} />
          <Sl label="Annual Interest Rate (%)" id="ci_r" min={1} max={30} step={0.25} value={rate} onChange={setRate} fmt={v => v + "%"} />
          <Sl label="Time Period (Years)" id="ci_y" min={1} max={40} value={years} onChange={setYears} fmt={v => v + " years"} />
          <Sel label="Compounding Frequency" id="ci_f" value={freq} onChange={setFreq} opts={freqOpts} />
        </InputSection>
        <InputSection title="Extra Options" icon="⚙️" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
          <N label="Monthly Contribution (SIP)" id="ci_mc" value={monthlyContrib} onChange={setMonthlyContrib} unit={sym} placeholder="0" hint="Add recurring monthly investment" />
          <N label="Expected Inflation (%)" id="ci_inf" value={inflationRate} onChange={setInflationRate} unit="%" placeholder="6" hint="For calculating real (inflation-adjusted) returns" />
        </InputSection>
      </div>
    </>
  );
  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="Compound Interest" />
      <SEOSection title="The Magic of Compounding">
        <p>Compound interest earns interest on both the principal AND previously earned interest. Albert Einstein reportedly called it "the eighth wonder of the world." Even a 1% difference in return rate compounds dramatically over decades — start early and invest regularly.</p>
      </SEOSection>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// SIP Calculator
// ─────────────────────────────────────────────────────────────────
export function SIPForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [sipAmount, setSipAmount] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(15);
  const [stepUpRate, setStepUpRate] = useState("10");
  const [mode, setMode] = useState("SIP");
  const [targetAmount, setTargetAmount] = useState("10000000");
  const [res, setRes] = useState(null);

  useEffect(() => {
    if (mode === "Reverse") {
      const target = +targetAmount;
      if (!target) return;
      const r = rate / 100 / 12; const n = years * 12;
      const sip = target * r / (Math.pow(1 + r, n) - 1);
      const invested = Math.round(sip) * n;
      setRes(buildResult("Required SIP", fm(Math.round(sip)),
        [
          { label: "Target Amount", value: fm(target) },
          { label: "Duration", value: years + " years" },
          { label: "Expected Return", value: rate + "% p.a." },
          { label: "Total to be Invested", value: fm(invested) },
          { label: "Returns Expected", value: fm(target - invested), highlight: true },
        ],
        [{ type: "tip", msg: "To reach " + fm(target) + " in " + years + " years at " + rate + "%, you need to invest " + fm(Math.round(sip)) + " every month." }],
        null, []
      ));
      return;
    }
    const r = rate / 100 / 12; const n = years * 12;
    const futureValue = sipAmount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const totalInvested = sipAmount * n;
    const estReturns = futureValue - totalInvested;

    // Step-up SIP
    const su = +stepUpRate || 0;
    let stepUpFV = 0, yearSip = sipAmount;
    for (let y = 0; y < years; y++) {
      const mr = rate / 100 / 12;
      const monthsLeft = (years - y) * 12;
      stepUpFV += yearSip * 12 * Math.pow(1 + mr, monthsLeft);
      yearSip *= (1 + su / 100);
    }

    const yearlyData = [];
    for (let y = 1; y <= Math.min(years, 20); y++) {
      const nn = y * 12;
      const fv = sipAmount * ((Math.pow(1 + r, nn) - 1) / r) * (1 + r);
      yearlyData.push({ label: "Year " + y, value: fm(Math.round(fv)) });
    }

    setRes(buildResult("Maturity Value", fm(Math.round(futureValue)),
      [
        { label: "Monthly SIP", value: fm(sipAmount) },
        { label: "Total Invested", value: fm(totalInvested) },
        { label: "Estimated Returns", value: fm(Math.round(estReturns)), highlight: true },
        { label: "Wealth Ratio", value: (futureValue / totalInvested).toFixed(2) + "x" },
        su > 0 ? { label: "Step-Up SIP Value", value: fm(Math.round(stepUpFV)) } : null,
        su > 0 ? { label: "Extra from Step-Up", value: fm(Math.round(stepUpFV - futureValue)), highlight: true } : null,
      ].filter(Boolean),
      [{ type: "tip", msg: fm(sipAmount) + "/month at " + rate + "% for " + years + " years = " + fm(Math.round(futureValue)) + ". Your money grows " + (futureValue / totalInvested).toFixed(1) + "x!" + (su > 0 ? " With " + su + "% annual step-up, you get " + fm(Math.round(stepUpFV)) + "!" : "") }],
      { type: "bar", data: yearlyData.map(y => ({ year: y.label.replace("Year ", "Yr "), value: Math.round(sipAmount * ((Math.pow(1 + r, +y.label.replace("Year ", "") * 12) - 1) / r)) })), keys: ["value"] },
      yearlyData
    ));
  }, [sipAmount, rate, years, stepUpRate, mode, targetAmount]);

  const inputs = (
    <>
      <Tabs tabs={["SIP", "Reverse SIP"]} active={mode} onChange={setMode} />
      <Presets items={[
        { label: "Crorepati 20yr", v: { s: 15000, r: 12, y: 20, su: "10" } },
        { label: "Conservative 10yr", v: { s: 5000, r: 8, y: 10, su: "0" } },
        { label: "Aggressive 25yr", v: { s: 20000, r: 15, y: 25, su: "15" } },
      ]} onApply={pr => { setSipAmount(pr.v.s); setRate(pr.v.r); setYears(pr.v.y); setStepUpRate(pr.v.su); setMode("SIP"); }} />

      <div className="calc-inputs-grid">
        <InputSection title={mode === "SIP" ? "SIP Parameters" : "Target Parameters"} icon="💹" gradient="linear-gradient(135deg,#4361ee,#3451c7)">
          {mode === "Reverse" ? (
            <N label="Target Maturity Amount" id="sip_ta" value={targetAmount} onChange={setTargetAmount} unit={sym} placeholder="10000000" hint="How much you want to accumulate" />
          ) : (
            <Sl label="Monthly SIP Amount" id="sip_s" min={500} max={200000} step={500} value={sipAmount} onChange={setSipAmount} fmt={v => fmSlider(v)} />
          )}
          <Sl label="Expected Return (% p.a.)" id="sip_r" min={4} max={30} step={0.5} value={rate} onChange={setRate} fmt={v => v + "%"} />
          <Sl label="Investment Duration (Years)" id="sip_y" min={1} max={40} value={years} onChange={setYears} fmt={v => v + " years"} />
        </InputSection>
        <InputSection title="Step-Up SIP" icon="📶" gradient="linear-gradient(135deg,#059669,#047857)">
          <N label="Annual Step-Up Rate (%)" id="sip_su" value={stepUpRate} onChange={setStepUpRate} unit="%" placeholder="0" hint="Increase SIP by this % each year (e.g. annual appraisal)" />
        </InputSection>
      </div>
    </>
  );
  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="SIP" />
      <SEOSection title="SIP — Systematic Investment Plan">
        <p>SIP investing uses Rupee Cost Averaging — you buy more units when prices fall and fewer when prices rise, reducing average cost over time. Consistency beats timing. Starting a SIP of ₹10,000/month at 25 vs. 35 years of age can mean the difference of ₹3-4 crore in final corpus.</p>
      </SEOSection>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// Simple Interest
// ─────────────────────────────────────────────────────────────────
export function SimpleInterestForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(5);
  const [res, setRes] = useState(null);

  useEffect(() => {
    const si = (principal * rate * years) / 100;
    const total = principal + si;
    setRes(buildResult("Simple Interest", fm(Math.round(si)),
      [
        { label: "Principal", value: fm(principal) },
        { label: "Total Amount", value: fm(Math.round(total)), highlight: true },
        { label: "Rate", value: rate + "% p.a." },
        { label: "Period", value: years + " years" },
        { label: "Monthly Interest", value: fm(Math.round(si / (years * 12))) },
      ],
      [{ type: "tip", msg: "Simple Interest of " + fm(Math.round(si)) + " means your money earns " + fm(Math.round(si / years)) + " every year. For wealth creation, compound interest is far more powerful." }],
      null, []
    ));
  }, [principal, rate, years]);

  const inputs = (
    <div className="calc-inputs-grid">
      <InputSection title="Investment Details" icon="💰" gradient="linear-gradient(135deg,#4361ee,#3451c7)">
        <Sl label="Principal Amount" id="si_p" min={1000} max={10000000} step={1000} value={principal} onChange={setPrincipal} fmt={v => fmSlider(v)} />
        <Sl label="Interest Rate (% p.a.)" id="si_r" min={1} max={30} step={0.25} value={rate} onChange={setRate} fmt={v => v + "%"} />
        <Sl label="Time Period (Years)" id="si_y" min={1} max={40} value={years} onChange={setYears} fmt={v => v + " years"} />
      </InputSection>
    </div>
  );
  return <CalcLayout inputs={inputs} result={res} label="Simple Interest" />;
}

// ─────────────────────────────────────────────────────────────────
// ROI Calculator
// ─────────────────────────────────────────────────────────────────
export function ROIForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [invested, setInvested] = useState(500000);
  const [currentValue, setCurrentValue] = useState(750000);
  const [years, setYears] = useState(3);
  const [res, setRes] = useState(null);

  useEffect(() => {
    const gain = currentValue - invested;
    const roi = (gain / invested) * 100;
    const cagr = (Math.pow(currentValue / invested, 1 / years) - 1) * 100;
    setRes(buildResult("ROI", roi.toFixed(2) + "%",
      [
        { label: "Amount Invested", value: fm(invested) },
        { label: "Current Value", value: fm(currentValue) },
        { label: "Net Gain / Loss", value: fm(Math.round(gain)), highlight: gain > 0, warn: gain < 0 },
        { label: "Absolute ROI", value: roi.toFixed(2) + "%" },
        { label: "Annualized CAGR", value: cagr.toFixed(2) + "%" },
        { label: "Period", value: years + " years" },
      ],
      [{ type: gain > 0 ? "tip" : "warn", msg: gain > 0 ? "Your investment grew by " + roi.toFixed(1) + "% (" + cagr.toFixed(1) + "% CAGR). " + (cagr > 12 ? "Excellent returns!" : cagr > 8 ? "Good returns." : "Moderate returns.") : "Your investment is down " + Math.abs(roi).toFixed(1) + "%. " }],
      null, []
    ));
  }, [invested, currentValue, years]);

  const inputs = (
    <div className="calc-inputs-grid">
      <InputSection title="Investment Values" icon="📊" gradient="linear-gradient(135deg,#059669,#047857)">
        <Sl label="Amount Invested" id="roi_inv" min={1000} max={50000000} step={1000} value={invested} onChange={setInvested} fmt={v => fmSlider(v)} />
        <Sl label="Current / Final Value" id="roi_cv" min={1000} max={50000000} step={1000} value={currentValue} onChange={setCurrentValue} fmt={v => fmSlider(v)} />
        <Sl label="Investment Period (Years)" id="roi_y" min={1} max={30} value={years} onChange={setYears} fmt={v => v + " years"} />
      </InputSection>
    </div>
  );
  return <CalcLayout inputs={inputs} result={res} label="ROI" />;
}

// ─────────────────────────────────────────────────────────────────
// Income Tax Calculator (India)
// ─────────────────────────────────────────────────────────────────
export function TaxForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [income, setIncome] = useState(1200000);
  const [regime, setRegime] = useState("new");
  const [ageGroup, setAgeGroup] = useState("below60");
  const [deductions, setDeductions] = useState("150000");
  const [res, setRes] = useState(null);

  function calcNewRegime(income) {
    const slabs = [
      [400000, 0], [400000, 0.05], [400000, 0.10],
      [400000, 0.15], [400000, 0.20], [Infinity, 0.30]
    ];
    let tax = 0, base = 0;
    for (const [limit, rate] of slabs) {
      if (income <= base) break;
      const slab = Math.min(income - base, limit);
      tax += slab * rate; base += limit;
    }
    if (income <= 700000) tax = 0; // Rebate u/s 87A
    return tax;
  }

  function calcOldRegime(taxable, age) {
    const exempt = age === "below60" ? 250000 : age === "60to80" ? 300000 : 500000;
    const ti = Math.max(0, taxable - exempt);
    let tax = 0;
    if (ti <= 250000) tax = 0;
    else if (ti <= 500000) tax = (ti - 250000) * 0.05;
    else if (ti <= 1000000) tax = 12500 + (ti - 500000) * 0.20;
    else tax = 112500 + (ti - 1000000) * 0.30;
    if (taxable <= 500000) tax = Math.min(tax, 12500);
    return tax;
  }

  useEffect(() => {
    const ded = +deductions || 0;
    const taxableNew = income;
    const taxableOld = Math.max(0, income - ded - 50000); // standard deduction
    const newTax = calcNewRegime(taxableNew);
    const oldTax = calcOldRegime(taxableOld, ageGroup);
    const surcharge = income > 5000000 ? (income <= 10000000 ? 0.10 : income <= 20000000 ? 0.15 : 0.25) : 0;
    const activeTax = regime === "new" ? newTax : oldTax;
    const cess = activeTax * (1 + surcharge) * 0.04;
    const totalTax = activeTax * (1 + surcharge) + cess;
    const takeHome = income - totalTax;
    setRes(buildResult("Tax Payable", fm(Math.round(totalTax)),
      [
        { label: "Gross Income", value: fm(income) },
        { label: "Base Tax", value: fm(Math.round(activeTax)) },
        { label: "Surcharge", value: (surcharge * 100).toFixed(0) + "%" },
        { label: "Cess (4%)", value: fm(Math.round(cess)) },
        { label: "Total Tax", value: fm(Math.round(totalTax)), warn: true },
        { label: "Take-Home Income", value: fm(Math.round(takeHome)), highlight: true },
        { label: "Effective Tax Rate", value: (totalTax / income * 100).toFixed(2) + "%" },
        { label: "New vs Old Regime", value: newTax < oldTax ? "New saves " + fm(Math.round(oldTax - newTax)) : "Old saves " + fm(Math.round(newTax - oldTax)) },
      ],
      [{ type: newTax < oldTax ? "tip" : "tip", msg: (newTax < oldTax ? "New Regime saves you " + fm(Math.round(oldTax - newTax)) + " in taxes." : "Old Regime saves " + fm(Math.round(newTax - oldTax)) + " vs New Regime.") + " Effective rate: " + (totalTax / income * 100).toFixed(1) + "%." }],
      { type: "donut", data: [{ name: "Take-Home", value: Math.round(takeHome) }, { name: "Income Tax", value: Math.round(totalTax) }], keys: ["value"] },
      [
        { label: "New Regime Tax", value: fm(Math.round(newTax + newTax * surcharge + newTax * (1 + surcharge) * 0.04)), bold: regime === "new" },
        { label: "Old Regime Tax", value: fm(Math.round(oldTax + oldTax * surcharge + oldTax * (1 + surcharge) * 0.04)), bold: regime === "old" },
      ]
    ));
  }, [income, regime, ageGroup, deductions]);

  const inputs = (
    <>
      <div className="calc-inputs-grid">
        <InputSection title="Income & Profile" icon="💼" gradient="linear-gradient(135deg,#4361ee,#3451c7)">
          <Sl label="Annual Gross Income" id="tax_inc" min={100000} max={10000000} step={50000} value={income} onChange={setIncome} fmt={v => fmSlider(v)} />
          <Sel label="Tax Regime" id="tax_reg" value={regime} onChange={setRegime} opts={[{ v: "new", l: "New Tax Regime (2024-25)" }, { v: "old", l: "Old Tax Regime" }]} />
          <Sel label="Age Group" id="tax_age" value={ageGroup} onChange={setAgeGroup} opts={[{ v: "below60", l: "Below 60 years" }, { v: "60to80", l: "60–80 years (Senior)" }, { v: "above80", l: "Above 80 (Super Senior)" }]} />
        </InputSection>
        <InputSection title="Deductions (Old Regime)" icon="🧾" gradient="linear-gradient(135deg,#d97706,#b45309)">
          <N label="80C Deductions" id="tax_ded" value={deductions} onChange={setDeductions} unit={sym} placeholder="150000" hint="ELSS, LIC, PF, PPF, etc. Max ₹1.5L" />
        </InputSection>
      </div>
    </>
  );
  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="Income Tax" />
      <SEOSection title="New vs Old Tax Regime (FY 2024-25)">
        <p>New Regime: No deductions but lower slabs. Better for those with few investments. Old Regime: Allows 80C, HRA, home loan deductions. Better for those maxing all deductions. If your deductions exceed ₹3.5L, Old Regime is usually better.</p>
      </SEOSection>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// GST Calculator
// ─────────────────────────────────────────────────────────────────
export function GSTForm() {
  const { fm, sym } = useCurrency();
  const [amount, setAmount] = useState(10000);
  const [gstRate, setGstRate] = useState("18");
  const [mode, setMode] = useState("Add GST");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const r = +gstRate / 100;
    let base, gst, total;
    if (mode === "Add GST") {
      base = amount; gst = base * r; total = base + gst;
    } else {
      total = amount; base = total / (1 + r); gst = total - base;
    }
    const cgst = gst / 2, sgst = gst / 2;
    setRes(buildResult(mode === "Add GST" ? "GST Amount" : "Pre-GST Amount", fm(Math.round(mode === "Add GST" ? gst : base)),
      [
        { label: "Base / Pre-GST Amount", value: fm(Math.round(base)) },
        { label: "GST @ " + gstRate + "%", value: fm(Math.round(gst)), warn: true },
        { label: "CGST (" + (+gstRate / 2) + "%)", value: fm(Math.round(cgst)) },
        { label: "SGST (" + (+gstRate / 2) + "%)", value: fm(Math.round(sgst)) },
        { label: "Total (Inclusive)", value: fm(Math.round(total)), highlight: true },
      ],
      [{ type: "info", msg: "GST of " + gstRate + "% = CGST " + (+gstRate / 2) + "% + SGST " + (+gstRate / 2) + "% (for intra-state) or IGST " + gstRate + "% (for inter-state supply)." }],
      null, []
    ));
  }, [amount, gstRate, mode]);

  const inputs = (
    <div className="calc-inputs-grid">
      <InputSection title="GST Details" icon="🧾" gradient="linear-gradient(135deg,#dc2626,#b91c1c)">
        <Tabs tabs={["Add GST", "Remove GST"]} active={mode} onChange={setMode} />
        <N label={mode === "Add GST" ? "Base Amount (excl. GST)" : "Total Amount (incl. GST)"} id="gst_a" value={String(amount)} onChange={v => setAmount(+v)} unit={sym} placeholder="10000" hint="" />
        <Sel label="GST Rate" id="gst_r" value={gstRate} onChange={setGstRate} opts={[{ v: "5", l: "5% (Essential goods)" }, { v: "12", l: "12% (Standard)" }, { v: "18", l: "18% (Standard services)" }, { v: "28", l: "28% (Luxury / Sin)" }]} />
      </InputSection>
    </div>
  );
  return <CalcLayout inputs={inputs} result={res} label="GST" />;
}

// ─────────────────────────────────────────────────────────────────
// Discount Calculator
// ─────────────────────────────────────────────────────────────────
export function DiscountForm() {
  const { fm, sym } = useCurrency();
  const [originalPrice, setOriginalPrice] = useState(5000);
  const [discountPct, setDiscountPct] = useState(20);
  const [res, setRes] = useState(null);

  useEffect(() => {
    const discountAmt = originalPrice * (discountPct / 100);
    const finalPrice = originalPrice - discountAmt;
    const savings = discountAmt;
    setRes(buildResult("You Pay", fm(Math.round(finalPrice)),
      [
        { label: "Original Price", value: fm(originalPrice) },
        { label: "Discount", value: discountPct + "% = " + fm(Math.round(discountAmt)), warn: true },
        { label: "Final Price", value: fm(Math.round(finalPrice)), highlight: true },
        { label: "You Save", value: fm(Math.round(savings)) },
      ],
      [{ type: "tip", msg: "You save " + fm(Math.round(savings)) + " (" + discountPct + "%) on this purchase. Price: " + fm(originalPrice) + " → " + fm(Math.round(finalPrice)) + "." }],
      { type: "donut", data: [{ name: "You Pay", value: Math.round(finalPrice) }, { name: "Discount", value: Math.round(discountAmt) }], keys: ["value"] },
      []
    ));
  }, [originalPrice, discountPct]);

  const inputs = (
    <div className="calc-inputs-grid">
      <InputSection title="Pricing Details" icon="🏷️" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
        <Sl label="Original Price" id="disc_p" min={100} max={1000000} step={100} value={originalPrice} onChange={setOriginalPrice} fmt={v => fm(v)} />
        <Sl label="Discount Percentage" id="disc_d" min={1} max={99} value={discountPct} onChange={setDiscountPct} fmt={v => v + "% off"} />
      </InputSection>
    </div>
  );
  return <CalcLayout inputs={inputs} result={res} label="Discount" />;
}

// ─────────────────────────────────────────────────────────────────
// Profit Margin Calculator
// ─────────────────────────────────────────────────────────────────
export function ProfitMarginForm() {
  const { fm, sym } = useCurrency();
  const [revenue, setRevenue] = useState(100000);
  const [cost, setCost] = useState(70000);
  const [res, setRes] = useState(null);

  useEffect(() => {
    const profit = revenue - cost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const markup = cost > 0 ? (profit / cost) * 100 : 0;
    const breakEven = profit < 0 ? "Loss — increase revenue or cut costs" : "Profitable";
    setRes(buildResult("Profit Margin", margin.toFixed(2) + "%",
      [
        { label: "Revenue", value: fm(revenue) },
        { label: "Total Cost", value: fm(cost) },
        { label: "Net Profit", value: fm(Math.round(profit)), highlight: profit > 0, warn: profit < 0 },
        { label: "Margin %", value: margin.toFixed(2) + "%" },
        { label: "Markup %", value: markup.toFixed(2) + "%" },
        { label: "Cost Ratio", value: (cost / revenue * 100).toFixed(1) + "%" },
      ],
      [{ type: profit > 0 ? "tip" : "warn", msg: profit > 0 ? "Margin of " + margin.toFixed(1) + "% means you keep " + fm(Math.round(profit)) + " for every " + fm(revenue) + " in revenue." : "You are losing " + fm(Math.abs(profit)) + ". Raise prices or reduce costs by " + fm(Math.abs(profit)) + " to break even." }],
      { type: "donut", data: [{ name: "Cost", value: cost }, { name: "Profit", value: Math.max(0, profit) }], keys: ["value"] },
      []
    ));
  }, [revenue, cost]);

  const inputs = (
    <div className="calc-inputs-grid">
      <InputSection title="Revenue & Costs" icon="💹" gradient="linear-gradient(135deg,#059669,#047857)">
        <Sl label="Revenue / Selling Price" id="pm_rev" min={1000} max={10000000} step={1000} value={revenue} onChange={setRevenue} fmt={v => fm(v)} />
        <Sl label="Total Cost / COGS" id="pm_cost" min={100} max={10000000} step={1000} value={cost} onChange={setCost} fmt={v => fm(v)} />
      </InputSection>
    </div>
  );
  return <CalcLayout inputs={inputs} result={res} label="Profit Margin" />;
}

// ─────────────────────────────────────────────────────────────────
// Break-Even Calculator
// ─────────────────────────────────────────────────────────────────
export function BreakEvenForm() {
  const { fm, sym } = useCurrency();
  const [fixedCosts, setFixedCosts] = useState(500000);
  const [pricePerUnit, setPricePerUnit] = useState(1500);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState(800);
  const [targetProfit, setTargetProfit] = useState("0");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const cm = pricePerUnit - variableCostPerUnit;
    if (cm <= 0) { setRes(null); return; }
    const beu = fixedCosts / cm;
    const beRevenue = beu * pricePerUnit;
    const targetUnits = cm > 0 ? (fixedCosts + (+targetProfit || 0)) / cm : Infinity;
    const marginOfSafety = beu > 0 ? ((targetUnits - beu) / targetUnits * 100) : 0;
    setRes(buildResult("Break-Even Units", Math.ceil(beu) + " units",
      [
        { label: "Fixed Costs", value: fm(fixedCosts) },
        { label: "Price per Unit", value: fm(pricePerUnit) },
        { label: "Variable Cost / Unit", value: fm(variableCostPerUnit) },
        { label: "Contribution Margin", value: fm(cm) + "/unit (" + (cm / pricePerUnit * 100).toFixed(1) + "%)" },
        { label: "Break-Even Revenue", value: fm(Math.round(beRevenue)) },
        +targetProfit > 0 ? { label: "Units for Target Profit", value: Math.ceil(targetUnits) + " units", highlight: true } : null,
      ].filter(Boolean),
      [{ type: "tip", msg: "At " + Math.ceil(beu) + " units sold (" + fm(Math.round(beRevenue)) + " revenue), you cover all costs. Every unit beyond that earns " + fm(cm) + " profit." }],
      null, []
    ));
  }, [fixedCosts, pricePerUnit, variableCostPerUnit, targetProfit]);

  const inputs = (
    <div className="calc-inputs-grid">
      <InputSection title="Cost Structure" icon="🏭" gradient="linear-gradient(135deg,#dc2626,#b91c1c)">
        <Sl label="Total Fixed Costs" id="be_fc" min={10000} max={10000000} step={10000} value={fixedCosts} onChange={setFixedCosts} fmt={v => fm(v)} />
        <Sl label="Selling Price per Unit" id="be_p" min={100} max={100000} step={100} value={pricePerUnit} onChange={setPricePerUnit} fmt={v => fm(v)} />
        <Sl label="Variable Cost per Unit" id="be_vc" min={10} max={100000} step={10} value={variableCostPerUnit} onChange={setVariableCostPerUnit} fmt={v => fm(v)} />
      </InputSection>
      <InputSection title="Profit Target" icon="🎯" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
        <N label="Target Profit Amount" id="be_tp" value={targetProfit} onChange={setTargetProfit} unit={sym} placeholder="0" hint="How much profit do you want to make?" />
      </InputSection>
    </div>
  );
  return <CalcLayout inputs={inputs} result={res} label="Break-Even" />;
}

// ─────────────────────────────────────────────────────────────────
// Tip Calculator
// ─────────────────────────────────────────────────────────────────
export function TipForm() {
  const { fm, sym } = useCurrency();
  const [billAmount, setBillAmount] = useState(2000);
  const [tipPct, setTipPct] = useState(15);
  const [people, setPeople] = useState(4);
  const [res, setRes] = useState(null);

  useEffect(() => {
    const tip = billAmount * (tipPct / 100);
    const total = billAmount + tip;
    const perPerson = total / people;
    const tipPerPerson = tip / people;
    setRes(buildResult("Tip Amount", fm(Math.round(tip)),
      [
        { label: "Bill Amount", value: fm(billAmount) },
        { label: "Tip (" + tipPct + "%)", value: fm(Math.round(tip)) },
        { label: "Total", value: fm(Math.round(total)), highlight: true },
        { label: "People", value: String(people) },
        { label: "Each Pays (tip+bill)", value: fm(Math.round(perPerson)) },
        { label: "Tip per Person", value: fm(Math.round(tipPerPerson)) },
      ],
      [{ type: "tip", msg: people + " people → each pays " + fm(Math.round(perPerson)) + " (including " + fm(Math.round(tipPerPerson)) + " tip)." }],
      null, []
    ));
  }, [billAmount, tipPct, people]);

  const inputs = (
    <div className="calc-inputs-grid">
      <InputSection title="Bill Details" icon="🍽️" gradient="linear-gradient(135deg,#d97706,#b45309)">
        <Sl label="Bill Amount" id="tip_b" min={100} max={100000} step={100} value={billAmount} onChange={setBillAmount} fmt={v => fm(v)} />
        <Sl label="Tip Percentage" id="tip_p" min={0} max={30} value={tipPct} onChange={setTipPct} fmt={v => v + "%"} />
        <Sl label="Number of People" id="tip_n" min={1} max={20} value={people} onChange={setPeople} fmt={v => v + " people"} />
      </InputSection>
    </div>
  );
  return <CalcLayout inputs={inputs} result={res} label="Tip" />;
}

// ─────────────────────────────────────────────────────────────────
// PPF Calculator
// ─────────────────────────────────────────────────────────────────
export function PPFForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [yearlyDeposit, setYearlyDeposit] = useState(150000);
  const [rate, setRate] = useState(7.1);
  const [years, setYears] = useState(15);
  const [res, setRes] = useState(null);

  useEffect(() => {
    let balance = 0;
    const yearlyData = [];
    for (let y = 1; y <= years; y++) {
      const interest = (balance + yearlyDeposit) * (rate / 100);
      balance = balance + yearlyDeposit + interest;
      yearlyData.push({ label: "Year " + y, value: fm(Math.round(balance)) });
    }
    const totalDeposited = yearlyDeposit * years;
    const totalInterest = balance - totalDeposited;
    setRes(buildResult("Maturity Value", fm(Math.round(balance)),
      [
        { label: "Yearly Deposit", value: fm(yearlyDeposit) },
        { label: "Total Deposited", value: fm(totalDeposited) },
        { label: "Total Interest Earned", value: fm(Math.round(totalInterest)), highlight: true },
        { label: "Maturity Value", value: fm(Math.round(balance)) },
        { label: "Wealth Multiple", value: (balance / totalDeposited).toFixed(2) + "x" },
        { label: "Tax Status", value: "EEE — Tax-Free" },
      ],
      [{ type: "tip", msg: "PPF has EEE tax status — deposit, interest, and maturity are all tax-free. " + fm(yearlyDeposit) + "/year at " + rate + "% = " + fm(Math.round(balance)) + " in " + years + " years!" }],
      { type: "bar", data: yearlyData.map((y, i) => ({ year: "Yr " + (i + 1), balance: Math.round(yearlyDeposit * (i + 1) + totalInterest * (i + 1) / years) })), keys: ["balance"] },
      yearlyData
    ));
  }, [yearlyDeposit, rate, years]);

  const inputs = (
    <div className="calc-inputs-grid">
      <InputSection title="PPF Details" icon="🏛️" gradient="linear-gradient(135deg,#d97706,#b45309)">
        <Sl label="Yearly Deposit Amount" id="ppf_d" min={500} max={150000} step={500} value={yearlyDeposit} onChange={setYearlyDeposit} fmt={v => fmSlider(v)} />
        <Sl label="Interest Rate (% p.a.)" id="ppf_r" min={6} max={9} step={0.1} value={rate} onChange={setRate} fmt={v => v + "%"} />
        <Sl label="Investment Period (Years)" id="ppf_y" min={15} max={50} value={years} onChange={setYears} fmt={v => v + " years"} />
      </InputSection>
    </div>
  );
  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="PPF" />
      <SEOSection title="PPF — Public Provident Fund">
        <p>PPF is a government-backed, 15-year lock-in savings scheme with EEE tax status (Exempt-Exempt-Exempt). Current interest rate: 7.1% p.a. Maximum deposit: ₹1.5L/year. It qualifies for 80C deduction. Partial withdrawals allowed from Year 7. After maturity, can be extended in 5-year blocks.</p>
      </SEOSection>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// FD Calculator
// ─────────────────────────────────────────────────────────────────
export function FDForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(7.5);
  const [months, setMonths] = useState(12);
  const [compFreq, setCompFreq] = useState("4");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const n = +compFreq;
    const r = rate / 100 / n;
    const periods = months / 12 * n;
    const maturity = principal * Math.pow(1 + r, periods);
    const interest = maturity - principal;
    const tds = rate > 4 ? interest * 0.1 : 0;
    const netInterest = interest - tds;

    // Bank comparison
    const banks = [
      { name: "SBI", rate: 6.8 }, { name: "HDFC", rate: 7.0 },
      { name: "ICICI", rate: 7.1 }, { name: "Current", rate },
    ];
    const bankData = banks.map(b => {
      const br = b.rate / 100 / n;
      const bm = principal * Math.pow(1 + br, periods);
      return { label: b.name, value: fm(Math.round(bm)) };
    });

    setRes(buildResult("FD Maturity", fm(Math.round(maturity)),
      [
        { label: "Principal", value: fm(principal) },
        { label: "Interest Earned", value: fm(Math.round(interest)), highlight: true },
        { label: "TDS Deducted (10%)", value: fm(Math.round(tds)), warn: tds > 0 },
        { label: "Net Interest", value: fm(Math.round(netInterest)) },
        { label: "Net Maturity", value: fm(Math.round(principal + netInterest)) },
        { label: "Effective Annual Rate", value: ((Math.pow(1 + rate / 100 / n, n) - 1) * 100).toFixed(2) + "%" },
      ],
      [{ type: "tip", msg: "FD of " + fm(principal) + " at " + rate + "% for " + months + " months = " + fm(Math.round(maturity)) + ". Submit Form 15G/15H to avoid TDS if income is below taxable limit." }],
      null, bankData
    ));
  }, [principal, rate, months, compFreq]);

  const inputs = (
    <div className="calc-inputs-grid">
      <InputSection title="FD Parameters" icon="🏦" gradient="linear-gradient(135deg,#4361ee,#3451c7)">
        <Sl label="Principal Amount" id="fd_p" min={10000} max={10000000} step={10000} value={principal} onChange={setPrincipal} fmt={v => fmSlider(v)} />
        <Sl label="Interest Rate (% p.a.)" id="fd_r" min={4} max={9.5} step={0.05} value={rate} onChange={setRate} fmt={v => v + "%"} />
        <Sl label="Tenure (Months)" id="fd_m" min={3} max={120} step={3} value={months} onChange={setMonths} fmt={v => v + " months"} />
        <Sel label="Compounding Frequency" id="fd_cf" value={compFreq} onChange={setCompFreq} opts={[{ v: "4", l: "Quarterly" }, { v: "12", l: "Monthly" }, { v: "2", l: "Half-Yearly" }, { v: "1", l: "Annually" }]} />
      </InputSection>
    </div>
  );
  return <CalcLayout inputs={inputs} result={res} label="FD" />;
}

// ─────────────────────────────────────────────────────────────────
// Loan Comparison Calculator
// ─────────────────────────────────────────────────────────────────
export function LoanCompareForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [loans, setLoans] = useState([
    { id: 1, name: "SBI Home Loan", rate: 8.4, term: 20 },
    { id: 2, name: "HDFC Home Loan", rate: 8.75, term: 20 },
    { id: 3, name: "ICICI Home Loan", rate: 8.6, term: 20 },
  ]);
  const [res, setRes] = useState(null);

  function calcLoan(amt, rate, termYrs) {
    const r = rate / 100 / 12, n = termYrs * 12;
    const emi = r > 0 ? (amt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : amt / n;
    return { emi: Math.round(emi), totalPayable: Math.round(emi * n), totalInterest: Math.round(emi * n - amt) };
  }

  useEffect(() => {
    const results = loans.map(l => ({ ...l, ...calcLoan(loanAmount, l.rate, l.term) }));
    const best = results.reduce((a, b) => a.totalInterest < b.totalInterest ? a : b);
    const worst = results.reduce((a, b) => a.totalInterest > b.totalInterest ? a : b);
    setRes(buildResult("Best Pick", best.name,
      [
        ...results.map(r => ({ label: r.name + " EMI", value: fm(r.emi) + "/mo", highlight: r.id === best.id, warn: r.id === worst.id })),
        { label: "Savings vs Worst", value: fm(worst.totalInterest - best.totalInterest), highlight: true },
        { label: "Best Total Interest", value: fm(best.totalInterest) },
        { label: "Worst Total Interest", value: fm(worst.totalInterest), warn: true },
      ],
      [{ type: "tip", msg: best.name + " at " + best.rate + "% saves " + fm(worst.totalInterest - best.totalInterest) + " vs " + worst.name + " over the loan tenure. Always compare total interest, not just EMI!" }],
      { type: "bar", data: results.map(r => ({ name: r.name.split(" ")[0], "Total Interest": r.totalInterest })), keys: ["Total Interest"] },
      results.map(r => ({ label: r.name, value: "EMI " + fm(r.emi) + " | Interest " + fm(r.totalInterest), bold: r.id === best.id }))
    ));
  }, [loanAmount, loans]);

  const updateLoan = (id, field, value) =>
    setLoans(prev => prev.map(l => l.id === id ? { ...l, [field]: field === "name" ? value : +value } : l));

  const inputs = (
    <div className="calc-inputs-grid">
      <InputSection title="Loan Amount" icon="🏦" gradient="linear-gradient(135deg,#dc2626,#b91c1c)">
        <Sl label="Compare for Loan Amount" id="lc_amt" min={100000} max={10000000} step={50000} value={loanAmount} onChange={setLoanAmount} fmt={v => fmSlider(v)} />
      </InputSection>
      <InputSection title="Lender Options" icon="🏛️" gradient="linear-gradient(135deg,#4361ee,#3451c7)">
        {loans.map(loan => (
          <div key={loan.id} style={{ marginBottom: 12, padding: "10px 12px", background: "var(--surface2)", borderRadius: "var(--r-md)", border: "1.5px solid var(--border)" }}>
            <input value={loan.name} onChange={e => updateLoan(loan.id, "name", e.target.value)}
              style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", background: "transparent", border: "none", outline: "none", width: "100%", marginBottom: 8 }} />
            <Row2>
              <N label="Rate %" id={"lc_r" + loan.id} value={String(loan.rate)} onChange={v => updateLoan(loan.id, "rate", v)} unit="%" placeholder="8.5" hint="" />
              <N label="Term (yr)" id={"lc_t" + loan.id} value={String(loan.term)} onChange={v => updateLoan(loan.id, "term", v)} unit="yr" placeholder="20" hint="" />
            </Row2>
          </div>
        ))}
      </InputSection>
    </div>
  );
  return <CalcLayout inputs={inputs} result={res} label="Loan Comparison" />;
}
`;

writeFileSync('src/components/calculator-core/forms/CoreFinanceForms.jsx', CONTENT, 'utf8');
console.log('CoreFinanceForms.jsx written. Lines:', CONTENT.split('\n').length);
