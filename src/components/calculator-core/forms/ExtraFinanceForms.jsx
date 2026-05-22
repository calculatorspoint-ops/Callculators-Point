import { useState, useEffect } from "react";
import { L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency } from "./SharedComponents.jsx";

// ── APR Calculator ────────────────────────────────────────────────────
export function APRForm() {
  const { fm, sym } = useCurrency();
  const [loanAmount, setLoanAmount] = useState(500000);
  const [nominalRate, setNominalRate] = useState(8.5);
  const [fees, setFees] = useState("5000");
  const [term, setTerm] = useState(5);
  const [tab, setTab] = useState("APR");
  const [loans, setLoans] = useState([
    { id: 1, name: "Bank A", rate: 8.5, fees: 5000, term: 5 },
    { id: 2, name: "Bank B", rate: 8.0, fees: 15000, term: 5 },
    { id: 3, name: "NBFC C", rate: 9.0, fees: 0, term: 5 },
  ]);
  const [res, setRes] = useState(null);

  function calcAPR(principal, rate, feesAmt, termYrs) {
    const r = rate / 100 / 12, n = termYrs * 12;
    const emi = r > 0 ? (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : principal / n;
    const totalRepay = emi * n + feesAmt;
    const totalInterest = totalRepay - principal;
    const aprApprox = (totalInterest * 2 * 12) / (principal * (n + 1));
    return { emi: Math.round(emi), totalRepay: Math.round(totalRepay), totalInterest: Math.round(totalInterest), apr: (aprApprox * 100).toFixed(2) };
  }

  useEffect(() => {
    if (tab === "Compare") {
      const results = loans.map(l => ({ ...l, ...calcAPR(loanAmount, l.rate, l.fees, l.term) }));
      const best = results.reduce((a, b) => +a.apr < +b.apr ? a : b);
      const worst = results.reduce((a, b) => +a.apr > +b.apr ? a : b);
      setRes(buildResult("Best APR", best.name + " @ " + best.apr + "%",
        [
          ...results.map(r => ({ label: r.name + " APR", value: r.apr + "%", highlight: r.id === best.id, warn: r.id === worst.id })),
          { label: "Best Total Cost", value: fm(best.totalRepay) },
          { label: "Worst Total Cost", value: fm(worst.totalRepay) },
          { label: "Savings vs Worst", value: fm(worst.totalRepay - best.totalRepay), highlight: true },
        ],
        [{ type: "tip", msg: best.name + " at APR " + best.apr + "% is the cheapest option. Never compare just nominal rates — always look at APR including all fees!" }],
        { type: "bar", data: results.map(r => ({ name: r.name, "Total Cost": r.totalRepay })), keys: ["Total Cost"] },
        results.map(r => ({ label: r.name + " EMI", value: fm(r.emi) + "/mo" }))
      ));
      return;
    }
    if (!loanAmount || !nominalRate || !term) return;
    const { emi, totalRepay, totalInterest, apr } = calcAPR(loanAmount, nominalRate, +fees || 0, term);
    const extraCostDueToFees = +fees || 0;
    setRes(buildResult("Effective APR", apr + "%",
      [
        { label: "Loan Amount", value: fm(loanAmount) },
        { label: "Nominal Rate", value: nominalRate + "%" },
        { label: "Processing Fees", value: fm(+fees || 0) },
        { label: "Monthly EMI", value: fm(emi) },
        { label: "Total Interest", value: fm(totalInterest), warn: true },
        { label: "Total Repayment (incl. fees)", value: fm(totalRepay) },
        { label: "Extra Cost Due to Fees", value: fm(extraCostDueToFees) },
        { label: "Effective APR", value: apr + "%", warn: +apr > nominalRate + 0.5 },
      ],
      [{ type: +apr > nominalRate + 1 ? "warn" : "tip", msg: "Your effective APR of " + apr + "% is " + (+apr - nominalRate).toFixed(2) + "% higher than the nominal rate due to fees. Always compare APR, not just interest rate!" }],
      { type: "donut", data: [{ name: "Principal", value: loanAmount }, { name: "Interest", value: totalInterest }, { name: "Fees", value: +fees || 0 }], keys: ["value"] },
      [{ label: "Nominal Rate", value: nominalRate + "%" }, { label: "APR", value: apr + "%" }, { label: "Fee Impact", value: (+apr - nominalRate).toFixed(2) + "% extra" }]
    ));
  }, [loanAmount, nominalRate, fees, term, tab, loans]);

  const updateLoan = (id, field, value) => setLoans(prev => prev.map(l => l.id === id ? { ...l, [field]: field === "name" ? value : +value } : l));

  return (
    <div className="space-y-6">
      <Tabs tabs={["APR", "Compare Loans"]} active={tab} onChange={setTab} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {tab === "APR" ? (
            <>
              <Presets items={[
                { label: "Home Loan", v: { a: 3000000, r: 8.5, f: 15000, t: 20 } },
                { label: "Car Loan", v: { a: 800000, r: 9.5, f: 8000, t: 5 } },
                { label: "Personal Loan", v: { a: 200000, r: 14, f: 2000, t: 3 } },
              ]} onApply={pr => { setLoanAmount(pr.v.a); setNominalRate(pr.v.r); setFees(String(pr.v.f)); setTerm(pr.v.t); }} />
              <Sl label="Loan Amount" id="apr_a" min={10000} max={10000000} step={10000} value={loanAmount} onChange={setLoanAmount} fmt={v => fm(v)} />
              <Sl label="Nominal Interest Rate (%)" id="apr_r" min={4} max={30} step={0.25} value={nominalRate} onChange={setNominalRate} fmt={v => v + "%"} />
              <N label="Processing/Origination Fee" id="apr_f" value={fees} onChange={setFees} unit={sym} placeholder="0" hint="One-time upfront fees charged by lender" />
              <Sel label="Loan Term" id="apr_t" value={String(term)} onChange={v => setTerm(+v)} opts={[{ v: "1", l: "1 Year" }, { v: "3", l: "3 Years" }, { v: "5", l: "5 Years" }, { v: "10", l: "10 Years" }, { v: "20", l: "20 Years" }]} />
            </>
          ) : (
            <>
              <Sl label="Loan Amount (all)" id="apr_ca" min={10000} max={10000000} step={10000} value={loanAmount} onChange={setLoanAmount} fmt={v => fm(v)} />
              {loans.map(loan => (
                <div key={loan.id} style={{ padding: "12px", background: "var(--surface2)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", marginBottom: 8 }}>
                  <input value={loan.name} onChange={e => updateLoan(loan.id, "name", e.target.value)} style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", background: "transparent", border: "none", outline: "none", width: "100%", marginBottom: 8 }} />
                  <Row2>
                    <N label="Rate %" id={"apr_lr" + loan.id} value={String(loan.rate)} onChange={v => updateLoan(loan.id, "rate", v)} unit="%" placeholder="8.5" hint="" />
                    <N label="Fees" id={"apr_lf" + loan.id} value={String(loan.fees)} onChange={v => updateLoan(loan.id, "fees", v)} unit={sym} placeholder="0" hint="" />
                  </Row2>
                </div>
              ))}
            </>
          )}
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="APR" /></div>
      </div>
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>APR vs Interest Rate: The Real Cost</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75 }}>The Annual Percentage Rate (APR) is the true cost of borrowing — it includes the interest rate PLUS all fees (processing, origination, insurance). A loan with 8% rate and ₹15,000 in fees can have an effective APR of 8.5%+. Always compare APR across lenders, not just advertised rates.</p>
      </div>
    </div>
  );
}

// ── Budget Calculator ─────────────────────────────────────────────────
export function BudgetForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [income, setIncome] = useState(80000);
  const [budgetMode, setBudgetMode] = useState("503020");
  const [tab, setTab] = useState("Budget");
  const [expenses, setExpenses] = useState([
    { id: 1, name: "Rent/Housing", amount: 20000, category: "needs" },
    { id: 2, name: "Groceries", amount: 8000, category: "needs" },
    { id: 3, name: "Transport", amount: 5000, category: "needs" },
    { id: 4, name: "Utilities", amount: 3000, category: "needs" },
    { id: 5, name: "Dining Out", amount: 4000, category: "wants" },
    { id: 6, name: "Entertainment", amount: 3000, category: "wants" },
    { id: 7, name: "Savings/SIP", amount: 15000, category: "savings" },
    { id: 8, name: "Emergency Fund", amount: 5000, category: "savings" },
  ]);
  const [res, setRes] = useState(null);

  const MODES = {
    "503020": { needs: 50, wants: 30, savings: 20, label: "50/30/20 Rule" },
    "702010": { needs: 70, wants: 20, savings: 10, label: "70/20/10 Rule" },
    "603010": { needs: 60, wants: 30, savings: 10, label: "60/30/10 Rule" },
  };

  useEffect(() => {
    const rule = MODES[budgetMode] || MODES["503020"];
    const needsAmt = income * rule.needs / 100;
    const wantsAmt = income * rule.wants / 100;
    const savingsAmt = income * rule.savings / 100;
    const actualNeeds = expenses.filter(e => e.category === "needs").reduce((s, e) => s + e.amount, 0);
    const actualWants = expenses.filter(e => e.category === "wants").reduce((s, e) => s + e.amount, 0);
    const actualSavings = expenses.filter(e => e.category === "savings").reduce((s, e) => s + e.amount, 0);
    const totalSpent = actualNeeds + actualWants + actualSavings;
    const surplus = income - totalSpent;
    const chart = { type: "donut", data: [{ name: "Needs", value: actualNeeds }, { name: "Wants", value: actualWants }, { name: "Savings", value: actualSavings }, ...(surplus > 0 ? [{ name: "Unallocated", value: surplus }] : [])], keys: ["value"] };
    setRes(buildResult("Monthly Surplus", fm(Math.round(surplus)),
      [
        { label: "Net Income", value: fm(income) },
        { label: "Needs Spent (Target " + rule.needs + "%)", value: fm(actualNeeds) + " / " + fm(Math.round(needsAmt)), warn: actualNeeds > needsAmt },
        { label: "Wants Spent (Target " + rule.wants + "%)", value: fm(actualWants) + " / " + fm(Math.round(wantsAmt)), warn: actualWants > wantsAmt },
        { label: "Savings (Target " + rule.savings + "%)", value: fm(actualSavings) + " / " + fm(Math.round(savingsAmt)), warn: actualSavings < savingsAmt, highlight: actualSavings >= savingsAmt },
        { label: "Total Allocated", value: fm(totalSpent) },
        { label: "Surplus / Deficit", value: fm(Math.round(surplus)), highlight: surplus > 0, warn: surplus < 0 },
        { label: "Savings Rate", value: (actualSavings / income * 100).toFixed(1) + "%" },
      ],
      [{ type: surplus < 0 ? "warn" : actualSavings / income < rule.savings / 100 ? "warn" : "tip", msg: surplus < 0 ? "You are spending more than you earn by " + fm(-surplus) + "! Cut Wants category first." : "Savings rate is " + (actualSavings / income * 100).toFixed(0) + "%. Target: " + rule.savings + "%. " + (actualSavings / income >= rule.savings / 100 ? "Great discipline!" : "Increase SIP by " + fm(Math.round(savingsAmt - actualSavings)) + ".") }],
      chart, []
    ));
  }, [income, budgetMode, expenses]);

  const updateExpense = (id, field, value) => setExpenses(prev => prev.map(e => e.id === id ? { ...e, [field]: field === "amount" ? +value : value } : e));
  const addExpense = () => setExpenses(prev => [...prev, { id: Date.now(), name: "New Expense", amount: 0, category: "needs" }]);
  const removeExpense = (id) => setExpenses(prev => prev.filter(e => e.id !== id));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Sl label="Monthly Net Income" id="bud_inc" min={10000} max={1000000} step={1000} value={income} onChange={setIncome} fmt={v => fmSlider(v)} />
          <Sel label="Budgeting Rule" id="bud_mode" value={budgetMode} onChange={setBudgetMode} opts={[{ v: "503020", l: "50/30/20 (Needs/Wants/Savings)" }, { v: "702010", l: "70/20/10 (Conservative)" }, { v: "603010", l: "60/30/10 (Moderate)" }]} />
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)", margin: "14px 0 6px" }}>Monthly Expenses</p>
          {expenses.map(exp => (
            <div key={exp.id} style={{ display: "grid", gridTemplateColumns: "1fr 90px 90px auto", gap: 6, marginBottom: 6, alignItems: "center" }}>
              <input value={exp.name} onChange={e => updateExpense(exp.id, "name", e.target.value)} style={{ fontSize: 12, color: "var(--text)", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", padding: "6px 8px", outline: "none" }} />
              <input type="number" value={exp.amount} onChange={e => updateExpense(exp.id, "amount", e.target.value)} style={{ fontSize: 12, textAlign: "right", color: "var(--text)", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", padding: "6px 8px", outline: "none" }} />
              <select value={exp.category} onChange={e => updateExpense(exp.id, "category", e.target.value)} style={{ fontSize: 11, color: "var(--text)", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", padding: "5px 4px" }}>
                <option value="needs">Needs</option>
                <option value="wants">Wants</option>
                <option value="savings">Savings</option>
              </select>
              <button onClick={() => removeExpense(exp.id)} style={{ fontSize: 14, color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>×</button>
            </div>
          ))}
          <button onClick={addExpense} style={{ width: "100%", padding: "7px", borderRadius: "var(--r-md)", border: "2px dashed var(--border)", background: "transparent", color: "var(--brand)", fontWeight: 700, cursor: "pointer", fontSize: 12, marginTop: 8 }}>+ Add Expense</button>
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="Budget" /></div>
      </div>
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>The 50/30/20 Budgeting Rule</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75 }}>The 50/30/20 rule is a simple framework: 50% on Needs (rent, food, utilities, transport), 30% on Wants (dining, entertainment, hobbies), 20% on Savings and debt repayment. For high-income earners or those with financial goals, consider the 70/20/10 or 60/30/10 variants. The key is paying yourself first — automate savings on payday.</p>
      </div>
    </div>
  );
}

// ── Mortgage Payoff Calculator ────────────────────────────────────────
export function MortgagePayoffForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [loanBalance, setLoanBalance] = useState(2500000);
  const [rate, setRate] = useState(8.5);
  const [remainingMonths, setRemainingMonths] = useState(240);
  const [extraPayment, setExtraPayment] = useState("5000");
  const [lumpsum, setLumpsum] = useState("0");
  const [tab, setTab] = useState("Extra EMI");
  const [res, setRes] = useState(null);

  function simulate(balance, annRate, months, extra, lump) {
    const r = annRate / 100 / 12;
    const baseEMI = r > 0 ? (balance * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1) : balance / months;
    let bal = balance - lump, mo = 0, totalInt = 0;
    while (bal > 0 && mo < months * 2) {
      const int = bal * r; const prin = Math.min(baseEMI + extra - int, bal); totalInt += int; bal -= prin; mo++;
    }
    return { months: mo, totalInterest: Math.round(totalInt), baseEMI: Math.round(baseEMI) };
  }

  useEffect(() => {
    if (!loanBalance || !rate || !remainingMonths) return;
    const base = simulate(loanBalance, rate, remainingMonths, 0, 0);
    const withExtra = simulate(loanBalance, rate, remainingMonths, +extraPayment || 0, +lumpsum || 0);
    const interestSaved = base.totalInterest - withExtra.totalInterest;
    const monthsSaved = base.months - withExtra.months;
    const payoffDate = new Date(); payoffDate.setMonth(payoffDate.getMonth() + withExtra.months);
    const scenarios = [1000, 3000, 5000, 10000].map(ep => {
      const s = simulate(loanBalance, rate, remainingMonths, ep, 0);
      return { extra: ep, saved: base.totalInterest - s.totalInterest, months: base.months - s.months };
    });
    const chart = { type: "bar", data: scenarios.map(s => ({ name: "+" + fm(s.extra), "Interest Saved": s.saved })), keys: ["Interest Saved"] };
    setRes(buildResult("Payoff In", withExtra.months + " months",
      [
        { label: "Loan Balance", value: fm(loanBalance) },
        { label: "Base EMI", value: fm(base.baseEMI) + "/mo" },
        { label: "Extra Payment", value: fm(+extraPayment || 0) + "/mo" },
        lumpsum !== "0" ? { label: "Lump Sum Payment", value: fm(+lumpsum) } : null,
        { label: "Payoff Date", value: payoffDate.toLocaleDateString("en-US", { month: "long", year: "numeric" }) },
        { label: "Interest Saved", value: fm(Math.round(interestSaved)), highlight: true },
        { label: "Months Saved", value: monthsSaved + " months (" + (monthsSaved / 12).toFixed(1) + " years)", highlight: true },
        { label: "Original Payoff (no extra)", value: base.months + " months" },
      ].filter(Boolean),
      [{ type: "tip", msg: "Extra " + fm(+extraPayment || 0) + "/mo saves " + fm(Math.round(interestSaved)) + " in interest and pays off " + (monthsSaved / 12).toFixed(1) + " years early! Small extra payments have enormous impact." }],
      chart, scenarios.map(s => ({ label: "Extra " + fm(s.extra) + "/mo", value: "Saves " + fm(s.saved) + " (" + s.months + " mo early)" }))
    ));
  }, [loanBalance, rate, remainingMonths, extraPayment, lumpsum]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Presets items={[
            { label: "Early Stage Loan", v: { lb: 2500000, r: 8.5, rm: 240, ep: 5000, ls: 0 } },
            { label: "Mid-way Loan", v: { lb: 1200000, r: 8.5, rm: 120, ep: 10000, ls: 50000 } },
            { label: "Bonus Lump Sum", v: { lb: 1800000, r: 8.5, rm: 180, ep: 0, ls: 200000 } },
          ]} onApply={pr => { setLoanBalance(pr.v.lb); setRate(pr.v.r); setRemainingMonths(pr.v.rm); setExtraPayment(String(pr.v.ep)); setLumpsum(String(pr.v.ls)); }} />
          <Sl label="Remaining Loan Balance" id="mpo_lb" min={100000} max={20000000} step={50000} value={loanBalance} onChange={setLoanBalance} fmt={v => fmSlider(v)} />
          <Sl label="Interest Rate (% p.a.)" id="mpo_r" min={5} max={18} step={0.05} value={rate} onChange={setRate} fmt={v => v + "%"} />
          <Sl label="Remaining Months" id="mpo_rm" min={12} max={360} step={6} value={remainingMonths} onChange={setRemainingMonths} fmt={v => v + " mo (" + (v / 12).toFixed(1) + " yr)"} />
          <N label="Extra Monthly Payment" id="mpo_ep" value={extraPayment} onChange={setExtraPayment} unit={sym} placeholder="0" hint="Additional amount above regular EMI each month" />
          <N label="One-time Lump Sum Payment" id="mpo_ls" value={lumpsum} onChange={setLumpsum} unit={sym} placeholder="0" hint="Bonus/windfall applied immediately to principal" />
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="Payoff" /></div>
      </div>
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>Pay Off Mortgage Early: Strategies</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10 }}>
          {[{ title: "Bi-weekly Payments", desc: "Make half-EMI every 2 weeks = 13 full payments/year vs 12" }, { title: "Annual Lump Sum", desc: "Apply year-end bonus directly to principal" }, { title: "Round Up EMI", desc: "Round EMI up to nearest ₹1,000 — low pain, big impact" }, { title: "Refinance", desc: "Lower rate = lower interest burden" }].map((s, i) => (
            <div key={i} style={{ padding: "12px", background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--brand)", marginBottom: 4 }}>{s.title}</p>
              <p style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Present Value Calculator ──────────────────────────────────────────
export function PresentValueForm() {
  const { fm, sym } = useCurrency();
  const [futureValue, setFutureValue] = useState(1000000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);
  const [inflationRate, setInflationRate] = useState("6");
  const [tab, setTab] = useState("PV");
  const [cashflows, setCashflows] = useState(["100000", "100000", "150000", "150000", "200000"]);
  const [res, setRes] = useState(null);

  useEffect(() => {
    if (tab === "NPV (Multi-Year)") {
      const r = rate / 100;
      let totalPV = 0;
      const pvs = cashflows.map((cf, i) => {
        const pv = +cf / Math.pow(1 + r, i + 1);
        totalPV += pv;
        return { year: i + 1, cf: +cf, pv: Math.round(pv) };
      });
      setRes(buildResult("Total Present Value", fm(Math.round(totalPV)),
        [{ label: "Discount Rate", value: rate + "%" }, { label: "Total Future Cash", value: fm(cashflows.reduce((s, c) => s + +c, 0)) }, { label: "Total PV (Discounted)", value: fm(Math.round(totalPV)) }, { label: "Value Eroded by Discounting", value: fm(Math.round(cashflows.reduce((s, c) => s + +c, 0) - totalPV)) }],
        [{ type: "tip", msg: "Money received in future is worth less than money today. At " + rate + "%, these cash flows are worth only " + fm(Math.round(totalPV)) + " today." }],
        { type: "bar", data: pvs.map(p => ({ year: "Yr " + p.year, "Cash Flow": p.cf, "PV": p.pv })), keys: ["Cash Flow", "PV"] },
        pvs.map(p => ({ label: "Year " + p.year + " PV", value: fm(p.pv) }))
      ));
      return;
    }
    if (!futureValue || !rate || !years) return;
    const r = rate / 100;
    const pv = futureValue / Math.pow(1 + r, years);
    const realRate = (1 + r) / (1 + (+inflationRate || 0) / 100) - 1;
    const realPV = futureValue / Math.pow(1 + realRate, years);
    const inflation = +inflationRate || 0;
    const inflationAdjusted = futureValue / Math.pow(1 + inflation / 100, years);
    const rules = [72, 114, 144].map(rule => ({ rule, doublingYears: (rule / rate).toFixed(1) }));
    setRes(buildResult("Present Value", fm(Math.round(pv)),
      [
        { label: "Future Amount", value: fm(futureValue) },
        { label: "Discount Rate", value: rate + "% p.a." },
        { label: "Time Period", value: years + " years" },
        { label: "Present Value (Nominal)", value: fm(Math.round(pv)) },
        { label: "PV (Inflation-adjusted)", value: fm(Math.round(realPV)), warn: true },
        { label: "Future Value in Today's Money", value: fm(Math.round(inflationAdjusted)) },
        { label: "Value Lost to Inflation", value: fm(Math.round(futureValue - inflationAdjusted)), warn: true },
      ],
      [{ type: "tip", msg: fm(futureValue) + " after " + years + " years is worth only " + fm(Math.round(pv)) + " today at " + rate + "% discount rate. After accounting for " + inflation + "% inflation, it's worth " + fm(Math.round(realPV)) + " in real terms." }],
      null,
      [{ label: "Rule of 72 (doubles in)", value: (72 / rate).toFixed(1) + " years" }, { label: "Rule of 114 (triples)", value: (114 / rate).toFixed(1) + " years" }, { label: "Rule of 144 (4x)", value: (144 / rate).toFixed(1) + " years" }]
    ));
  }, [futureValue, rate, years, inflationRate, tab, cashflows]);

  return (
    <div className="space-y-6">
      <Tabs tabs={["PV", "NPV (Multi-Year)"]} active={tab} onChange={setTab} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {tab === "PV" ? (
            <>
              <Presets items={[
                { label: "Retirement Goal 25yr", v: { fv: 10000000, r: 8, y: 25, inf: 6 } },
                { label: "Education Fund 15yr", v: { fv: 5000000, r: 8, y: 15, inf: 6 } },
                { label: "Home Down Pmt 5yr", v: { fv: 2000000, r: 8, y: 5, inf: 6 } },
              ]} onApply={pr => { setFutureValue(pr.v.fv); setRate(pr.v.r); setYears(pr.v.y); setInflationRate(String(pr.v.inf)); }} />
              <Sl label="Future Value / Target Amount" id="pv_fv" min={10000} max={50000000} step={10000} value={futureValue} onChange={setFutureValue} fmt={v => fm(v)} />
              <Sl label="Discount / Investment Rate (%)" id="pv_r" min={1} max={20} step={0.5} value={rate} onChange={setRate} fmt={v => v + "%"} />
              <Sl label="Time Period (Years)" id="pv_y" min={1} max={40} value={years} onChange={setYears} fmt={v => v + " years"} />
              <N label="Inflation Rate (%)" id="pv_inf" value={inflationRate} onChange={setInflationRate} unit="%" placeholder="6" hint="For real return calculation" />
            </>
          ) : (
            <>
              <Sl label="Discount Rate (%)" id="pv_dr" min={1} max={30} step={0.5} value={rate} onChange={setRate} fmt={v => v + "%"} />
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)", margin: "12px 0 6px" }}>Annual Cash Flows</p>
              {cashflows.map((cf, i) => (
                <N key={i} label={"Year " + (i + 1)} id={"pv_cf" + i} value={cf} onChange={v => setCashflows(prev => prev.map((c, j) => j === i ? v : c))} unit={sym} placeholder="0" hint="" />
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button onClick={() => setCashflows(prev => [...prev, ""])} style={{ flex: 1, padding: "6px", borderRadius: "var(--r-md)", border: "1.5px solid var(--brand)", background: "transparent", color: "var(--brand)", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>+ Year</button>
                {cashflows.length > 1 && <button onClick={() => setCashflows(prev => prev.slice(0, -1))} style={{ flex: 1, padding: "6px", borderRadius: "var(--r-md)", border: "1.5px solid #ef4444", background: "transparent", color: "#ef4444", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>- Year</button>}
              </div>
            </>
          )}
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="PV" /></div>
      </div>
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>Time Value of Money</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75 }}>₹1 today is worth more than ₹1 tomorrow because of earning potential. Present Value (PV) answers: "How much should I invest TODAY to reach my future goal?" The higher the discount rate and the longer the time, the smaller the PV. Use PV to evaluate whether a future payment is worth waiting for vs. getting money now.</p>
      </div>
    </div>
  );
}

// ── Down Payment Calculator ───────────────────────────────────────────
export function DownPaymentForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [homePrice, setHomePrice] = useState(5000000);
  const [targetPct, setTargetPct] = useState(20);
  const [currentSavings, setCurrentSavings] = useState(200000);
  const [monthlySaving, setMonthlySaving] = useState(20000);
  const [savingsRate, setSavingsRate] = useState(7);
  const [res, setRes] = useState(null);

  useEffect(() => {
    const targetDown = homePrice * (targetPct / 100);
    const gap = Math.max(0, targetDown - currentSavings);
    const r = savingsRate / 100 / 12;
    let months = 0;
    if (gap <= 0) {
      months = 0;
    } else if (r > 0 && monthlySaving > 0) {
      months = Math.log(1 + gap * r / monthlySaving) / Math.log(1 + r);
    } else if (monthlySaving > 0) {
      months = gap / monthlySaving;
    } else {
      months = 999;
    }
    months = Math.ceil(months);
    const targetDate = new Date(); targetDate.setMonth(targetDate.getMonth() + months);
    const atLtv90 = homePrice * 0.10;
    const atLtv80 = homePrice * 0.20;
    const atLtv75 = homePrice * 0.25;
    const loanNeeded = homePrice - targetDown;
    const emiIfBuyNow = r > 0 ? (loanNeeded * r * Math.pow(1 + r, 240)) / (Math.pow(1 + r, 240) - 1) : loanNeeded / 240;
    const chart = { type: "bar", data: [{ name: "10% Down", value: Math.round(atLtv90) }, { name: "20% Down (Ideal)", value: Math.round(atLtv80) }, { name: "25% Down", value: Math.round(atLtv75) }], keys: ["value"] };
    setRes(buildResult("Down Payment Target", fm(Math.round(targetDown)),
      [
        { label: "Home Price", value: fm(homePrice) },
        { label: "Target Down (" + targetPct + "%)", value: fm(Math.round(targetDown)) },
        { label: "Current Savings", value: fm(currentSavings) },
        { label: "Gap to Fill", value: fm(Math.round(gap)), warn: gap > 0 },
        { label: "Monthly Savings", value: fm(monthlySaving) + "/mo" },
        gap <= 0 ? { label: "Status", value: "Ready to Buy Now!", highlight: true } : { label: "Months to Goal", value: months + " months (" + (months / 12).toFixed(1) + " yrs)" },
        gap <= 0 ? null : { label: "Target Date", value: targetDate.toLocaleDateString("en-US", { month: "long", year: "numeric" }) },
        { label: "Loan Required", value: fm(Math.round(loanNeeded)) },
        { label: "EMI (20yr @ current rate)", value: fm(Math.round(emiIfBuyNow)) + "/mo" },
      ].filter(Boolean),
      [{ type: gap <= 0 ? "tip" : "tip", msg: gap <= 0 ? "You already have enough for " + targetPct + "% down! Consider applying for your home loan now." : "Save " + fm(monthlySaving) + "/mo for " + months + " months to reach your " + targetPct + "% down payment of " + fm(Math.round(targetDown)) + " by " + targetDate.toLocaleDateString("en-US", { month: "long", year: "numeric" }) + "." }],
      chart, []
    ));
  }, [homePrice, targetPct, currentSavings, monthlySaving, savingsRate]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Presets items={[
            { label: "Budget Home 10% down", v: { hp: 3000000, tp: 10, cs: 50000, ms: 15000, sr: 6 } },
            { label: "Starter Home 20% down", v: { hp: 5000000, tp: 20, cs: 200000, ms: 25000, sr: 7 } },
            { label: "Premium 25% down", v: { hp: 15000000, tp: 25, cs: 1000000, ms: 80000, sr: 7 } },
          ]} onApply={pr => { setHomePrice(pr.v.hp); setTargetPct(pr.v.tp); setCurrentSavings(pr.v.cs); setMonthlySaving(pr.v.ms); setSavingsRate(pr.v.sr); }} />
          <Sl label="Home Price" id="dp_hp" min={500000} max={50000000} step={100000} value={homePrice} onChange={setHomePrice} fmt={v => fmSlider(v)} />
          <Sl label="Down Payment Target (%)" id="dp_tp" min={5} max={50} value={targetPct} onChange={setTargetPct} fmt={v => v + "% = " + fmSlider(homePrice * v / 100)} />
          <Sl label="Current Savings" id="dp_cs" min={0} max={5000000} step={10000} value={currentSavings} onChange={setCurrentSavings} fmt={v => fmSlider(v)} />
          <Sl label="Monthly Savings" id="dp_ms" min={1000} max={200000} step={1000} value={monthlySaving} onChange={setMonthlySaving} fmt={v => fmSlider(v)} />
          <N label="Savings Growth Rate (%)" id="dp_sr" value={String(savingsRate)} onChange={v => setSavingsRate(+v)} unit="%" placeholder="7" hint="Annual return on your savings" />
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="Down Payment" /></div>
      </div>
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>Down Payment Strategy Guide</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10 }}>
          {[{ pct: "10%", label: "Minimum (PMI required)", note: "Gets you in sooner but higher total cost" }, { pct: "20%", label: "Ideal", note: "No PMI, lower rate, significant savings" }, { pct: "25%+", label: "Optimal", note: "Best rates, no PMI, strong equity from day 1" }].map((d, i) => (
            <div key={i} style={{ padding: "12px", background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)" }}>
              <p style={{ fontSize: 18, fontWeight: 900, color: "var(--brand)", marginBottom: 3 }}>{d.pct}</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 3 }}>{d.label}</p>
              <p style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.6 }}>{d.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Commission Calculator ─────────────────────────────────────────────
export function CommissionForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [salesAmount, setSalesAmount] = useState(500000);
  const [commissionType, setCommissionType] = useState("percent");
  const [commissionRate, setCommissionRate] = useState(5);
  const [baseSalary, setBaseSalary] = useState("30000");
  const [tiered, setTiered] = useState(false);
  const [tiers, setTiers] = useState([
    { id: 1, upTo: 200000, rate: 3 },
    { id: 2, upTo: 500000, rate: 5 },
    { id: 3, upTo: 9999999, rate: 8 },
  ]);
  const [res, setRes] = useState(null);

  useEffect(() => {
    let commission = 0;
    const base = +baseSalary || 0;
    if (tiered) {
      let prev = 0;
      for (const tier of tiers) {
        const slab = Math.min(salesAmount, tier.upTo) - prev;
        if (slab <= 0) break;
        commission += slab * (tier.rate / 100);
        prev = tier.upTo;
      }
    } else {
      commission = commissionType === "percent" ? salesAmount * (commissionRate / 100) : commissionRate;
    }
    const total = base + commission;
    const effectiveRate = (commission / salesAmount) * 100;
    const commissionPct = (commission / total) * 100;
    const annualComm = commission * 12;
    const annualTotal = total * 12;
    setRes(buildResult("Monthly Commission", fm(Math.round(commission)),
      [
        { label: "Sales Amount", value: fm(salesAmount) },
        { label: "Base Salary", value: fm(base) },
        { label: "Commission", value: fm(Math.round(commission)), highlight: true },
        { label: "Total Monthly Pay", value: fm(Math.round(total)) },
        { label: "Effective Commission Rate", value: effectiveRate.toFixed(2) + "%" },
        { label: "Commission as % of Pay", value: commissionPct.toFixed(1) + "%" },
        { label: "Annual Commission", value: fm(Math.round(annualComm)) },
        { label: "Annual Total", value: fm(Math.round(annualTotal)) },
      ],
      [{ type: "tip", msg: "To earn " + fm(Math.round(commission * 2)) + " commission, you need to close " + fm(salesAmount * 2) + " in sales. Your current rate: " + effectiveRate.toFixed(1) + "%." }],
      { type: "donut", data: [{ name: "Base", value: base }, { name: "Commission", value: Math.round(commission) }], keys: ["value"] },
      tiered ? tiers.map(t => ({ label: "Up to " + fm(t.upTo) + " @ " + t.rate + "%", value: fm(Math.round(Math.min(salesAmount, t.upTo) * t.rate / 100)) })) : []
    ));
  }, [salesAmount, commissionType, commissionRate, baseSalary, tiered, tiers]);

  const updateTier = (id, field, value) => setTiers(prev => prev.map(t => t.id === id ? { ...t, [field]: +value } : t));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Presets items={[
            { label: "Real Estate (2%)", v: { sa: 5000000, ct: "percent", cr: 2, bs: "0" } },
            { label: "Sales Rep (5%+base)", v: { sa: 500000, ct: "percent", cr: 5, bs: "30000" } },
            { label: "Insurance (10%)", v: { sa: 200000, ct: "percent", cr: 10, bs: "20000" } },
          ]} onApply={pr => { setSalesAmount(pr.v.sa); setCommissionType(pr.v.ct); setCommissionRate(pr.v.cr); setBaseSalary(pr.v.bs); }} />
          <Sl label="Sales Amount" id="com_sa" min={10000} max={20000000} step={10000} value={salesAmount} onChange={setSalesAmount} fmt={v => fmSlider(v)} />
          <N label="Base Salary (monthly)" id="com_bs" value={baseSalary} onChange={setBaseSalary} unit={sym} placeholder="0" hint="Fixed monthly salary (0 if pure commission)" />
          <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "10px 0" }}>
            <input type="checkbox" id="com_tiered" checked={tiered} onChange={e => setTiered(e.target.checked)} />
            <label htmlFor="com_tiered" style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", cursor: "pointer" }}>Tiered Commission Structure</label>
          </div>
          {!tiered ? (
            <>
              <Sel label="Commission Type" id="com_ct" value={commissionType} onChange={setCommissionType} opts={[{ v: "percent", l: "Percentage of Sales" }, { v: "flat", l: "Flat Amount" }]} />
              {commissionType === "percent" ? <Sl label="Commission Rate (%)" id="com_cr" min={0.1} max={30} step={0.1} value={commissionRate} onChange={setCommissionRate} fmt={v => v + "%"} /> : <N label="Flat Commission Amount" id="com_flat" value={String(commissionRate)} onChange={v => setCommissionRate(+v)} unit={sym} placeholder="5000" hint="Fixed amount per deal" />}
            </>
          ) : (
            <div>
              {tiers.map(tier => (
                <div key={tier.id} style={{ display: "grid", gridTemplateColumns: "1fr 70px", gap: 8, marginBottom: 6 }}>
                  <N label={"Slab " + tier.id + " up to"} id={"com_t" + tier.id} value={String(tier.upTo)} onChange={v => updateTier(tier.id, "upTo", v)} unit={sym} placeholder="200000" hint="" />
                  <N label="Rate %" id={"com_tr" + tier.id} value={String(tier.rate)} onChange={v => updateTier(tier.id, "rate", v)} unit="%" placeholder="5" hint="" />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="Commission" /></div>
      </div>
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>Commission Models Explained</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75 }}><strong>Straight Commission:</strong> 100% pay from sales. High risk, high reward. <strong>Base + Commission:</strong> Stability plus upside. Most common in B2B sales. <strong>Tiered Commission:</strong> Higher rate on larger deals incentivizes pushing through targets. <strong>Draw Against Commission:</strong> Advance against future commissions, clawed back if targets missed.</p>
      </div>
    </div>
  );
}
