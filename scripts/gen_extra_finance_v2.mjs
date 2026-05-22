import { writeFileSync } from 'fs';

const EXTRA = `import { useState, useEffect } from "react";
import {
  N, Sl, Sel, Tabs, Row2, Row3, Presets,
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

// ─── APR Calculator ─────────────────────────────────────────────────────────
export function APRForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [loanAmt, setLoanAmt] = useState(500000);
  const [nomRate, setNomRate] = useState(12);
  const [fees, setFees] = useState("5000");
  const [termYrs, setTermYrs] = useState(3);
  const [res, setRes] = useState(null);

  useEffect(() => {
    const feeAmt = +fees;
    const n = termYrs * 12;
    const r = nomRate / 100 / 12;
    const emi = r > 0 ? (loanAmt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : loanAmt / n;
    const totalPaid = emi * n;
    const totalCost = totalPaid + feeAmt;
    const netLoan = loanAmt - feeAmt;

    // APR: IRR of net cashflows
    let lo = 0.001, hi = 2;
    for (let i = 0; i < 100; i++) {
      const mid = (lo + hi) / 2;
      const pv = emi * (1 - Math.pow(1 + mid, -n)) / mid;
      if (Math.abs(pv - netLoan) < 1) { lo = hi = mid; break; }
      if (pv > netLoan) lo = mid; else hi = mid;
    }
    const apr = (lo + hi) / 2 * 12 * 100;

    setRes(buildResult("Effective APR", apr.toFixed(2) + "%",
      [
        { label: "Loan Amount", value: fm(loanAmt) },
        { label: "Nominal Rate", value: nomRate + "%" },
        { label: "Fees/Processing", value: fm(feeAmt) },
        { label: "Effective APR", value: apr.toFixed(2) + "%", warn: apr - nomRate > 1 },
        { label: "APR vs Nominal Difference", value: "+" + (apr - nomRate).toFixed(2) + "%", warn: true },
        { label: "Monthly EMI", value: fm(Math.round(emi)) },
        { label: "Total Cost of Loan", value: fm(Math.round(totalCost)) },
      ],
      [{ type: apr - nomRate > 2 ? "warn" : "tip", msg: "The stated " + nomRate + "% rate actually costs " + apr.toFixed(2) + "% APR after fees. Always compare APRs — not just interest rates — when evaluating loan offers." }],
      null, []
    ));
  }, [loanAmt, nomRate, fees, termYrs]);

  const inputs = (
    <>
      <Presets items={[
        { label: "Home Loan 20yr", v: { a: 3000000, r: 8.5, f: "15000", t: 20 } },
        { label: "Personal 3yr", v: { a: 500000, r: 14, f: "5000", t: 3 } },
        { label: "Car Loan 5yr", v: { a: 800000, r: 9.5, f: "8000", t: 5 } },
      ]} onApply={pr => { setLoanAmt(pr.v.a); setNomRate(pr.v.r); setFees(pr.v.f); setTermYrs(pr.v.t); }} />
      <div className="calc-inputs-grid">
        <InputSection title="Loan Details" icon="🏦" gradient="linear-gradient(135deg,#0891b2,#0369a1)">
          <Sl label="Loan Amount" id="apr_a" min={10000} max={20000000} step={10000} value={loanAmt} onChange={setLoanAmt} fmt={v => fmSlider(v)} />
          <Sl label="Nominal Interest Rate (%)" id="apr_r" min={5} max={30} step={0.25} value={nomRate} onChange={setNomRate} fmt={v => v + "%"} />
          <N label="Processing Fee / Upfront Costs" id="apr_f" value={fees} onChange={setFees} unit={sym} placeholder="5000" hint="Processing fee, origination charges, etc." />
          <Sl label="Loan Term (Years)" id="apr_t" min={1} max={30} value={termYrs} onChange={setTermYrs} fmt={v => v + " years"} />
        </InputSection>
      </div>
    </>
  );
  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="APR" />
      <SEOSection title="APR vs Interest Rate — What's the Real Cost?">
        <p>APR (Annual Percentage Rate) includes all costs — interest AND fees. A loan advertised at 10% with ₹10,000 in fees on a ₹5L, 3-year loan actually costs ~12% APR. Always demand the APR figure when comparing loans. RBI mandates lenders disclose APR on retail loans. The difference can amount to lakhs on large loans.</p>
      </SEOSection>
    </>
  );
}

// ─── Budget Calculator ──────────────────────────────────────────────────────
export function BudgetForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [income, setIncome] = useState(100000);
  const [rule, setRule] = useState("50-30-20");
  const [expenses, setExpenses] = useState([
    { id: 1, name: "Rent", amount: 25000, cat: "needs" },
    { id: 2, name: "Groceries", amount: 8000, cat: "needs" },
    { id: 3, name: "Utilities", amount: 3000, cat: "needs" },
    { id: 4, name: "Entertainment", amount: 5000, cat: "wants" },
    { id: 5, name: "Dining Out", amount: 4000, cat: "wants" },
    { id: 6, name: "SIP / Savings", amount: 15000, cat: "savings" },
  ]);
  const [res, setRes] = useState(null);

  const ruleTargets = {
    "50-30-20": { needs: 50, wants: 30, savings: 20 },
    "70-20-10": { needs: 70, wants: 20, savings: 10 },
    "60-30-10": { needs: 60, wants: 30, savings: 10 },
  };

  useEffect(() => {
    const targets = ruleTargets[rule];
    const totals = { needs: 0, wants: 0, savings: 0 };
    expenses.forEach(e => { if (totals[e.cat] !== undefined) totals[e.cat] += e.amount; });
    const totalSpend = Object.values(totals).reduce((s, v) => s + v, 0);
    const surplus = income - totalSpend;

    setRes(buildResult("Monthly Surplus", fm(Math.round(surplus)),
      [
        { label: "Income", value: fm(income) },
        { label: "Needs (" + targets.needs + "% target)", value: fm(totals.needs) + " (" + (totals.needs / income * 100).toFixed(0) + "%)", warn: totals.needs / income > targets.needs / 100 + 0.05 },
        { label: "Wants (" + targets.wants + "% target)", value: fm(totals.wants) + " (" + (totals.wants / income * 100).toFixed(0) + "%)", warn: totals.wants / income > targets.wants / 100 + 0.05 },
        { label: "Savings (" + targets.savings + "% target)", value: fm(totals.savings) + " (" + (totals.savings / income * 100).toFixed(0) + "%)", highlight: totals.savings / income >= targets.savings / 100 },
        { label: "Total Expenses", value: fm(totalSpend) },
        { label: "Surplus / Deficit", value: fm(Math.round(surplus)), highlight: surplus > 0, warn: surplus < 0 },
      ],
      [{ type: surplus < 0 ? "bad" : totals.savings / income < targets.savings / 100 ? "warn" : "tip", msg: surplus < 0 ? "Monthly deficit of " + fm(Math.abs(surplus)) + "! Reduce needs or wants." : totals.savings / income < targets.savings / 100 ? "Savings (" + (totals.savings / income * 100).toFixed(0) + "%) below " + rule + " target (" + targets.savings + "%). Increase SIP or savings." : "Great budget! Saving " + (totals.savings / income * 100).toFixed(0) + "% — above the " + targets.savings + "% target." }],
      { type: "donut", data: [{ name: "Needs", value: totals.needs }, { name: "Wants", value: totals.wants }, { name: "Savings", value: totals.savings }, { name: "Surplus", value: Math.max(0, surplus) }], keys: ["value"] },
      expenses.map(e => ({ label: e.name + " (" + e.cat + ")", value: fm(e.amount) }))
    ));
  }, [income, expenses, rule]);

  const updateExpense = (id, field, value) =>
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, [field]: field === "amount" ? +value : value } : e));
  const addExpense = () => setExpenses(prev => [...prev, { id: Date.now(), name: "New Expense", amount: 0, cat: "wants" }]);
  const removeExpense = (id) => setExpenses(prev => prev.filter(e => e.id !== id));

  const inputs = (
    <div className="calc-inputs-grid">
      <InputSection title="Income & Budget Rule" icon="📊" gradient="linear-gradient(135deg,#0891b2,#0369a1)">
        <Sl label="Monthly Take-Home Income" id="bud_inc" min={10000} max={1000000} step={5000} value={income} onChange={setIncome} fmt={v => fmSlider(v)} />
        <Sel label="Budget Rule" id="bud_rule" value={rule} onChange={setRule} opts={[{ v: "50-30-20", l: "50/30/20 (Standard)" }, { v: "70-20-10", l: "70/20/10 (Aggressive save)" }, { v: "60-30-10", l: "60/30/10 (Balanced)" }]} />
      </InputSection>
      <InputSection title="Monthly Expenses" icon="💸" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
        {expenses.map(e => (
          <div key={e.id} style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <input value={e.name} onChange={ev => updateExpense(e.id, "name", ev.target.value)}
                style={{ fontSize: 11, fontWeight: 700, color: "var(--text)", background: "transparent", border: "none", outline: "none", width: "100%", marginBottom: 4 }} />
              <Row2>
                <N label="" id={"bud_a" + e.id} value={String(e.amount)} onChange={v => updateExpense(e.id, "amount", v)} unit={sym} placeholder="0" hint="" />
                <Sel label="" id={"bud_c" + e.id} value={e.cat} onChange={v => updateExpense(e.id, "cat", v)} opts={[{ v: "needs", l: "Needs" }, { v: "wants", l: "Wants" }, { v: "savings", l: "Savings" }]} />
              </Row2>
            </div>
            <button onClick={() => removeExpense(e.id)} style={{ padding: "6px 8px", background: "none", border: "1px solid var(--border)", borderRadius: 6, cursor: "pointer", color: "var(--text3)", fontSize: 14, flexShrink: 0, marginTop: 16 }}>×</button>
          </div>
        ))}
        <button onClick={addExpense} style={{ width: "100%", padding: "9px", borderRadius: "var(--r-md)", border: "1.5px dashed var(--brand)", color: "var(--brand)", background: "var(--brand-l)", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "var(--font)" }}>
          + Add Expense
        </button>
      </InputSection>
    </div>
  );
  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="Budget Planner" />
      <SEOSection title="Personal Budget Calculator — 50/30/20 Rule">
        <p>The 50/30/20 rule: 50% on needs (housing, utilities, food), 30% on wants (entertainment, dining, subscriptions), 20% on savings and debt payoff. If you're in debt, temporarily shift to 50/30/20 but apply the "wants" money to debt payoff. Track expenses for 3 months to find categories where you overspend.</p>
      </SEOSection>
    </>
  );
}

// ─── Mortgage Payoff ─────────────────────────────────────────────────────────
export function MortgagePayoffForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [balance, setBalance] = useState(2500000);
  const [rate, setRate] = useState(8.5);
  const [remainMonths, setRemainMonths] = useState(180);
  const [extraPayment, setExtraPayment] = useState(10000);
  const [lumpSum, setLumpSum] = useState("0");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const r = rate / 100 / 12;
    const emi = r > 0 ? (balance * r * Math.pow(1 + r, remainMonths)) / (Math.pow(1 + r, remainMonths) - 1) : balance / remainMonths;
    const totalInterestBase = emi * remainMonths - balance;

    // With extra payment + lump sum
    let bal = balance - +lumpSum;
    let months = 0, interestPaid = 0;
    while (bal > 0.01 && months < remainMonths * 2) {
      const int = bal * r;
      const pay = Math.min(emi + extraPayment, bal + int);
      interestPaid += int;
      bal -= (pay - int);
      months++;
    }
    const interestSaved = totalInterestBase - interestPaid;
    const monthsSaved = remainMonths - months;

    // Scenario comparison
    const scenarios = [1000, 5000, 10000, 25000].map(ep => {
      let b = balance - +lumpSum, mo = 0;
      while (b > 0.01 && mo < remainMonths * 2) {
        const int = b * r;
        const pay = Math.min(emi + ep, b + int);
        b -= (pay - int); mo++;
      }
      return { extra: ep, months: mo, saved: remainMonths - mo };
    });

    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + months);

    setRes(buildResult("Time Saved", monthsSaved + " months",
      [
        { label: "Current EMI", value: fm(Math.round(emi)) },
        { label: "Extra Payment", value: fm(extraPayment) + "/mo" },
        { label: "Lump Sum Applied", value: fm(+lumpSum) },
        { label: "Months Saved", value: monthsSaved + " months (" + (monthsSaved / 12).toFixed(1) + " yrs)", highlight: true },
        { label: "Interest Saved", value: fm(Math.round(interestSaved)), highlight: true },
        { label: "New Payoff Date", value: payoffDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }) },
        { label: "New Total Interest", value: fm(Math.round(interestPaid)) },
      ],
      [{ type: "tip", msg: "Paying " + fm(extraPayment) + " extra/month saves " + fm(Math.round(interestSaved)) + " in interest and " + monthsSaved + " months on your mortgage!" }],
      { type: "bar", data: scenarios.map(s => ({ extra: "+" + fm(s.extra), "Months Saved": s.saved })), keys: ["Months Saved"] },
      scenarios.map(s => ({ label: "Extra " + fm(s.extra) + "/mo", value: "Saves " + s.saved + " months = " + fm(Math.round(s.saved * emi * (rate / 100 / 12))) + " in interest" }))
    ));
  }, [balance, rate, remainMonths, extraPayment, lumpSum]);

  const inputs = (
    <div className="calc-inputs-grid">
      <InputSection title="Current Loan" icon="🏠" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
        <Sl label="Remaining Balance" id="mpo_b" min={100000} max={20000000} step={100000} value={balance} onChange={setBalance} fmt={v => fmSlider(v)} />
        <Sl label="Interest Rate (%)" id="mpo_r" min={6} max={14} step={0.05} value={rate} onChange={setRate} fmt={v => v + "%"} />
        <Sl label="Remaining Months" id="mpo_rm" min={12} max={360} step={12} value={remainMonths} onChange={setRemainMonths} fmt={v => v + " months (" + (v / 12).toFixed(1) + " yrs)"} />
      </InputSection>
      <InputSection title="Payoff Strategy" icon="⚡" gradient="linear-gradient(135deg,#4361ee,#3451c7)">
        <Sl label="Extra Monthly Payment" id="mpo_ep" min={0} max={100000} step={1000} value={extraPayment} onChange={setExtraPayment} fmt={v => fm(v) + "/mo"} />
        <N label="One-Time Lump Sum" id="mpo_ls" value={lumpSum} onChange={setLumpSum} unit={sym} placeholder="0" hint="One-time prepayment (bonus, gift, etc.)" />
      </InputSection>
    </div>
  );
  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="Mortgage Payoff" />
      <SEOSection title="Pay Off Your Home Loan Early — How Much Do You Save?">
        <p>Prepaying a home loan is one of the best guaranteed returns — you save interest at your loan rate (8–9%), which is better than FD rates. Banks cannot charge prepayment penalties on floating-rate home loans (RBI rule). Strategy: apply every bonus and windfall to principal prepayment. Even ₹5,000/month extra can save 3–5 years and ₹3–5L on a ₹30L loan.</p>
      </SEOSection>
    </>
  );
}

// ─── Present Value ────────────────────────────────────────────────────────────
export function PresentValueForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [futureValue, setFutureValue] = useState(10000000);
  const [years, setYears] = useState(20);
  const [discountRate, setDiscountRate] = useState(10);
  const [inflationRate, setInflationRate] = useState(6);
  const [res, setRes] = useState(null);

  useEffect(() => {
    const pvNominal = futureValue / Math.pow(1 + discountRate / 100, years);
    const pvReal = futureValue / Math.pow(1 + inflationRate / 100, years);
    const rule72disc = Math.round(72 / discountRate);
    const rule72inf = Math.round(72 / inflationRate);
    const todaysEquiv = pvReal;

    setRes(buildResult("Present Value", fm(Math.round(pvNominal)),
      [
        { label: "Future Target", value: fm(futureValue) },
        { label: "In Today's Money (PV nominal)", value: fm(Math.round(pvNominal)), highlight: true },
        { label: "Real Value (after inflation)", value: fm(Math.round(pvReal)), warn: true },
        { label: "Years", value: years + " years" },
        { label: "Discount Rate", value: discountRate + "%" },
        { label: "Today's Purchasing Power Equiv", value: fm(Math.round(todaysEquiv)) },
        { label: "Money doubles every (@ discount rate)", value: rule72disc + " years (Rule of 72)" },
        { label: "Prices double every (@ inflation)", value: rule72inf + " years" },
      ],
      [{ type: "info", msg: fm(futureValue) + " in " + years + " years is only worth " + fm(Math.round(pvNominal)) + " in today's money at " + discountRate + "% discount rate. Inflation at " + inflationRate + "% further erodes to " + fm(Math.round(pvReal)) + " real value." }],
      null, []
    ));
  }, [futureValue, years, discountRate, inflationRate]);

  const inputs = (
    <div className="calc-inputs-grid">
      <InputSection title="Future Value" icon="🔮" gradient="linear-gradient(135deg,#0891b2,#0369a1)">
        <Sl label="Target Future Amount" id="pv_fv" min={10000} max={100000000} step={100000} value={futureValue} onChange={setFutureValue} fmt={v => fmSlider(v)} />
        <Sl label="Years from Now" id="pv_y" min={1} max={40} value={years} onChange={setYears} fmt={v => v + " years"} />
      </InputSection>
      <InputSection title="Rates" icon="📉" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
        <Sl label="Discount Rate (opportunity cost %)" id="pv_dr" min={4} max={20} step={0.5} value={discountRate} onChange={setDiscountRate} fmt={v => v + "%"} />
        <Sl label="Expected Inflation (%)" id="pv_inf" min={2} max={12} step={0.5} value={inflationRate} onChange={setInflationRate} fmt={v => v + "%"} />
      </InputSection>
    </div>
  );
  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="Present Value" />
      <SEOSection title="Time Value of Money — Present Value Calculator">
        <p>A rupee today is worth more than a rupee tomorrow because it can be invested and grow. PV = FV ÷ (1 + r)^n. The Rule of 72: divide 72 by the interest rate to find how many years to double your money. At 12%, money doubles every 6 years. At 6% inflation, prices double every 12 years — so your savings must outpace inflation to preserve real wealth.</p>
      </SEOSection>
    </>
  );
}

// ─── Down Payment ────────────────────────────────────────────────────────────
export function DownPaymentForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [homePrice, setHomePrice] = useState(5000000);
  const [targetPct, setTargetPct] = useState(20);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [monthlySaving, setMonthlySaving] = useState(20000);
  const [growthRate, setGrowthRate] = useState(7);
  const [res, setRes] = useState(null);

  useEffect(() => {
    const targetAmt = homePrice * (targetPct / 100);
    const gap = Math.max(0, targetAmt - currentSavings);
    const r = growthRate / 100 / 12;

    // Months to reach target with monthly saving + growth
    let savings = currentSavings, months = 0;
    while (savings < targetAmt && months < 600) {
      savings = savings * (1 + r) + monthlySaving;
      months++;
    }

    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + months);

    // LTV milestones
    const milestones = [10, 15, 20, 25, 30].map(pct => {
      const target = homePrice * (pct / 100);
      const gap2 = Math.max(0, target - currentSavings);
      let sav = currentSavings, mo = 0;
      while (sav < target && mo < 600) { sav = sav * (1 + r) + monthlySaving; mo++; }
      return { pct, months: mo, date: new Date(Date.now() + mo * 30 * 24 * 3600000).toLocaleDateString("en-US", { month: "short", year: "numeric" }) };
    });

    // Scenarios
    const scenarios = [0, targetPct - 5, targetPct, targetPct + 5].filter(p => p > 0 && p <= 40);
    const scenarioData = scenarios.map(p => {
      const dp = homePrice * (p / 100);
      const loan = homePrice - dp;
      const r2 = 8.5 / 100 / 12; const n = 20 * 12;
      const emi = r2 > 0 ? (loan * r2 * Math.pow(1 + r2, n)) / (Math.pow(1 + r2, n) - 1) : loan / n;
      return { pct: p + "%", EMI: Math.round(emi), "Down Payment": Math.round(dp) };
    });

    setRes(buildResult("Months to Goal", months + " months",
      [
        { label: "Target Down Payment (" + targetPct + "%)", value: fm(Math.round(targetAmt)), highlight: true },
        { label: "Current Savings", value: fm(currentSavings) },
        { label: "Savings Gap", value: fm(Math.round(gap)), warn: gap > 0 },
        { label: "Target Date", value: targetDate.toLocaleDateString("en-US", { month: "long", year: "numeric" }) },
        { label: "Monthly Saving", value: fm(monthlySaving) },
        { label: "Saving Growth Rate", value: growthRate + "%" },
      ],
      [{ type: months > 60 ? "warn" : "tip", msg: "Saving " + fm(monthlySaving) + "/month at " + growthRate + "% return, you'll hit your " + targetPct + "% down payment target (" + fm(Math.round(targetAmt)) + ") in " + months + " months (" + (months / 12).toFixed(1) + " years)." }],
      { type: "bar", data: scenarioData.map(s => ({ "Down %": s.pct, EMI: s.EMI })), keys: ["EMI"] },
      milestones.map(m => ({ label: m.pct + "% down payment (" + fm(homePrice * m.pct / 100) + ")", value: m.months + " months → " + m.date }))
    ));
  }, [homePrice, targetPct, currentSavings, monthlySaving, growthRate]);

  const inputs = (
    <div className="calc-inputs-grid">
      <InputSection title="Home & Target" icon="🏠" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
        <Sl label="Target Home Price" id="dp_hp" min={500000} max={50000000} step={250000} value={homePrice} onChange={setHomePrice} fmt={v => fmSlider(v)} />
        <Sl label="Down Payment Target %" id="dp_tp" min={5} max={40} step={5} value={targetPct} onChange={setTargetPct} fmt={v => v + "% = " + fmSlider(homePrice * v / 100)} />
      </InputSection>
      <InputSection title="Your Savings Plan" icon="💰" gradient="linear-gradient(135deg,#059669,#047857)">
        <Sl label="Current Savings" id="dp_cs" min={0} max={5000000} step={25000} value={currentSavings} onChange={setCurrentSavings} fmt={v => fmSlider(v)} />
        <Sl label="Monthly Saving" id="dp_ms" min={1000} max={200000} step={1000} value={monthlySaving} onChange={setMonthlySaving} fmt={v => fmSlider(v)} />
        <Sl label="Savings Growth Rate (%)" id="dp_gr" min={4} max={15} step={0.5} value={growthRate} onChange={setGrowthRate} fmt={v => v + "%"} />
      </InputSection>
    </div>
  );
  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="Down Payment" />
      <SEOSection title="Home Down Payment Savings Calculator">
        <p>A 20% down payment eliminates PMI, reduces your EMI, and gives you instant equity. A 10% down payment is the minimum for most home loans. For PMAY (Pradhan Mantri Awas Yojana) beneficiaries, subsidized interest reduces effective rates. Park your down payment savings in a liquid mutual fund or FD — never in equity, as the timeframe is short.</p>
      </SEOSection>
    </>
  );
}

// ─── Commission ───────────────────────────────────────────────────────────────
export function CommissionForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [salesAmount, setSalesAmount] = useState(1000000);
  const [baseSalary, setBaseSalary] = useState(40000);
  const [type, setType] = useState("Percentage");
  const [flatCommission, setFlatCommission] = useState("5000");
  const [pct, setPct] = useState(5);
  const [tiers, setTiers] = useState([
    { upto: 500000, rate: 3 },
    { upto: 1000000, rate: 5 },
    { upto: Infinity, rate: 8 },
  ]);
  const [res, setRes] = useState(null);

  useEffect(() => {
    let commission = 0;
    if (type === "Flat") {
      commission = +flatCommission;
    } else if (type === "Percentage") {
      commission = salesAmount * (pct / 100);
    } else {
      let remaining = salesAmount, prev = 0;
      for (const t of tiers) {
        const slabAmount = Math.min(remaining, t.upto - prev);
        if (slabAmount <= 0) break;
        commission += slabAmount * (t.rate / 100);
        remaining -= slabAmount;
        prev = t.upto;
        if (remaining <= 0) break;
      }
    }
    const totalPay = baseSalary + commission;
    const effectiveRate = salesAmount > 0 ? (commission / salesAmount) * 100 : 0;
    const annualBase = baseSalary * 12;
    const annualCommission = commission * 12;
    const annualTotal = annualBase + annualCommission;

    setRes(buildResult("Commission Earned", fm(Math.round(commission)),
      [
        { label: "Sales Amount", value: fm(salesAmount) },
        { label: "Base Salary", value: fm(baseSalary) + "/mo" },
        { label: "Commission", value: fm(Math.round(commission)), highlight: true },
        { label: "Total Monthly Pay", value: fm(Math.round(totalPay)), highlight: true },
        { label: "Effective Commission Rate", value: effectiveRate.toFixed(2) + "%" },
        { label: "Annual Base", value: fm(annualBase) },
        { label: "Annual Commission (est.)", value: fm(Math.round(annualCommission)) },
        { label: "Annual Total Earnings", value: fm(Math.round(annualTotal)) },
      ],
      [{ type: "tip", msg: "At " + fm(salesAmount) + " in sales, you earn " + fm(Math.round(commission)) + " commission (" + effectiveRate.toFixed(1) + "% effective rate). Total monthly: " + fm(Math.round(totalPay)) + " | Annual: " + fm(Math.round(annualTotal)) + "." }],
      { type: "donut", data: [{ name: "Base Salary", value: baseSalary * 12 }, { name: "Commission", value: Math.round(annualCommission) }], keys: ["value"] },
      []
    ));
  }, [salesAmount, baseSalary, type, flatCommission, pct, tiers]);

  const inputs = (
    <div className="calc-inputs-grid">
      <InputSection title="Sales & Salary" icon="💼" gradient="linear-gradient(135deg,#0891b2,#0369a1)">
        <Sl label="Sales Amount" id="com_s" min={10000} max={10000000} step={10000} value={salesAmount} onChange={setSalesAmount} fmt={v => fmSlider(v)} />
        <Sl label="Base Salary" id="com_bs" min={0} max={200000} step={5000} value={baseSalary} onChange={setBaseSalary} fmt={v => fmSlider(v)} />
      </InputSection>
      <InputSection title="Commission Structure" icon="⚙️" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
        <Tabs tabs={["Flat", "Percentage", "Tiered"]} active={type} onChange={setType} />
        {type === "Flat" && <N label="Flat Commission Amount" id="com_fc" value={flatCommission} onChange={setFlatCommission} unit={sym} placeholder="5000" hint="Fixed commission per sale" />}
        {type === "Percentage" && <Sl label="Commission %" id="com_pct" min={0.5} max={20} step={0.5} value={pct} onChange={setPct} fmt={v => v + "%"} />}
        {type === "Tiered" && (
          <div>
            {tiers.filter(t => t.upto !== Infinity).map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-end" }}>
                <N label={"Slab " + (i + 1) + " up to"} id={"com_t" + i} value={String(t.upto)} onChange={v => { const n = [...tiers]; n[i] = { ...n[i], upto: +v }; setTiers(n); }} unit={sym} placeholder="500000" hint="" />
                <N label={"Rate %"} id={"com_tr" + i} value={String(t.rate)} onChange={v => { const n = [...tiers]; n[i] = { ...n[i], rate: +v }; setTiers(n); }} unit="%" placeholder="5" hint="" />
              </div>
            ))}
            <N label="Final Slab Rate %" id="com_tlast" value={String(tiers[tiers.length - 1].rate)} onChange={v => { const n = [...tiers]; n[n.length - 1] = { ...n[n.length - 1], rate: +v }; setTiers(n); }} unit="%" placeholder="8" hint="Rate for all sales above last slab" />
          </div>
        )}
      </InputSection>
    </div>
  );
  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="Commission" />
      <SEOSection title="Sales Commission Calculator — Flat, Percentage & Tiered">
        <p>Commission structures vary widely. Flat commission is simple but doesn't incentivize larger sales. Percentage commission scales with performance. Tiered commission (accelerators) rewards high performers most — once reps cross thresholds, each extra rupee in sales pays a higher rate, creating strong motivation to exceed quota.</p>
      </SEOSection>
    </>
  );
}
`;

writeFileSync('src/components/calculator-core/forms/ExtraFinanceForms.jsx', EXTRA, 'utf8');
console.log('ExtraFinanceForms.jsx written:', EXTRA.split('\n').length, 'lines');
