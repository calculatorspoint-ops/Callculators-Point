import { useState, useEffect } from "react";
import { L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency } from "./SharedComponents.jsx";

// ── Auto Loan Calculator ──────────────────────────────────────────────
export function AutoLoanForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [carPrice, setCarPrice] = useState(800000);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(9.0);
  const [term, setTerm] = useState(5);
  const [tradeIn, setTradeIn] = useState("0");
  const [salesTax, setSalesTax] = useState("0");
  const [fees, setFees] = useState("0");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const downAmt = carPrice * (downPct / 100);
    const taxAmt = carPrice * (+salesTax / 100);
    const loanAmt = carPrice - downAmt - (+tradeIn || 0) + taxAmt + (+fees || 0);
    if (loanAmt <= 0 || !rate || !term) return;
    const r = rate / 100 / 12, n = term * 12;
    const emi = r > 0 ? (loanAmt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : loanAmt / n;
    const totalInterest = emi * n - loanAmt;
    const totalCost = carPrice + taxAmt + (+fees || 0) + totalInterest - (+tradeIn || 0);
    const depreciation = carPrice * 0.15;
    const firstYearValue = carPrice - depreciation;
    const fiveYearValue = carPrice * Math.pow(0.85, 5);
    const chart = { type: "bar", data: [{ name: "Car Price", value: Math.round(carPrice) }, { name: "Down Pmt", value: Math.round(downAmt) }, { name: "Loan Amt", value: Math.round(loanAmt) }, { name: "Total Interest", value: Math.round(totalInterest) }], keys: ["value"] };
    setRes(buildResult("Monthly EMI", fm(Math.round(emi)),
      [
        { label: "Car Price", value: fm(carPrice) },
        { label: "Down Payment (" + downPct + "%)", value: fm(Math.round(downAmt)) },
        { label: "Trade-In Credit", value: fm(+tradeIn || 0) },
        { label: "Loan Amount", value: fm(Math.round(loanAmt)) },
        { label: "Total Interest Paid", value: fm(Math.round(totalInterest)), warn: true },
        { label: "Total Cost of Car", value: fm(Math.round(totalCost)) },
        { label: "5-Year Resale Value", value: fm(Math.round(fiveYearValue)), warn: true },
        { label: "True Cost After Depreciation", value: fm(Math.round(totalCost - fiveYearValue)) },
      ],
      [{ type: "warn", msg: "Cars lose ~15% value per year. Your " + fm(carPrice) + " car will be worth ~" + fm(Math.round(fiveYearValue)) + " after 5 years. Total cost including depreciation: " + fm(Math.round(totalCost - fiveYearValue)) + "." }],
      chart,
      [{ label: "Loan Term", value: term + " years (" + n + " months)" }, { label: "Interest Rate", value: rate + "% p.a." }]
    ));
  }, [carPrice, downPct, rate, term, tradeIn, salesTax, fees]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Presets items={[
            { label: "Economy Car", v: { cp: 500000, dp: 20, r: 9.5, t: 5 } },
            { label: "Mid-Range SUV", v: { cp: 1500000, dp: 25, r: 9.0, t: 7 } },
            { label: "Luxury Sedan", v: { cp: 4000000, dp: 30, r: 8.5, t: 5 } },
          ]} onApply={pr => { setCarPrice(pr.v.cp); setDownPct(pr.v.dp); setRate(pr.v.r); setTerm(pr.v.t); }} />
          <Sl label="Car Price" id="al_cp" min={100000} max={20000000} step={50000} value={carPrice} onChange={setCarPrice} fmt={v => fmSlider(v)} />
          <Sl label="Down Payment (%)" id="al_dp" min={0} max={50} value={downPct} onChange={setDownPct} fmt={v => v + "% (" + fmSlider(carPrice * v / 100) + ")"} />
          <Sl label="Interest Rate" id="al_r" min={5} max={20} step={0.25} value={rate} onChange={setRate} fmt={v => v + "% p.a."} />
          <Sel label="Loan Term" id="al_t" value={String(term)} onChange={v => setTerm(+v)} opts={[{ v: "1", l: "1 Year" }, { v: "2", l: "2 Years" }, { v: "3", l: "3 Years" }, { v: "5", l: "5 Years" }, { v: "7", l: "7 Years" }]} />
          <N label="Trade-In Value" id="al_ti" value={tradeIn} onChange={setTradeIn} unit={sym} placeholder="0" hint="Credit for your existing car" />
          <N label="Sales Tax (%)" id="al_tax" value={salesTax} onChange={setSalesTax} unit="%" placeholder="0" hint="State/local sales tax on vehicle" />
          <N label="Registration & Fees" id="al_fee" value={fees} onChange={setFees} unit={sym} placeholder="0" hint="Road tax, registration, dealer fees" />
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="Auto Loan" /></div>
      </div>
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>True Cost of Car Ownership</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75 }}>The sticker price is just the beginning. Consider: <strong>Depreciation</strong> (15%/yr avg), fuel, insurance, maintenance, registration. A ₹10L car can cost ₹18-22L over 5 years including all these. Rule of thumb: keep total car expenses under 15% of take-home pay.</p>
      </div>
    </div>
  );
}

// ── Personal Loan Calculator ──────────────────────────────────────────
export function PersonalLoanForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [amount, setAmount] = useState(200000);
  const [rate, setRate] = useState(14);
  const [term, setTerm] = useState(3);
  const [tab, setTab] = useState("Calculator");
  const [income, setIncome] = useState("60000");
  const [existingDebts, setExistingDebts] = useState("5000");
  const [res, setRes] = useState(null);

  useEffect(() => {
    if (tab === "Eligibility") {
      const monthlyIncome = +income;
      const maxEMI = monthlyIncome * 0.4 - (+existingDebts || 0);
      const r = rate / 100 / 12, n = term * 12;
      const maxLoan = r > 0 ? maxEMI * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)) : maxEMI * n;
      const eligible = maxLoan > 0;
      setRes(buildResult("Max Eligible Loan", eligible ? fm(Math.round(maxLoan)) : "Not Eligible",
        [{ label: "Monthly Income", value: fm(monthlyIncome) }, { label: "Max EMI (40% income)", value: fm(Math.round(monthlyIncome * 0.4)) }, { label: "Existing Debts/mo", value: fm(+existingDebts || 0) }, { label: "Available for Loan EMI", value: fm(Math.round(maxEMI)) }, { label: "Max Loan at " + rate + "% for " + term + "yr", value: eligible ? fm(Math.round(maxLoan)) : "₹0 - Reduce debts first" }],
        [{ type: eligible ? "tip" : "warn", msg: eligible ? "You can borrow up to " + fm(Math.round(maxLoan)) + " based on 40% income rule. FOIR (Fixed Obligation to Income Ratio) should stay under 50%." : "Your existing EMIs exceed 40% of income. Pay down debt before applying." }],
        null, []));
      return;
    }
    const r = rate / 100 / 12, n = term * 12;
    if (!amount || !rate || !term || r <= 0) return;
    const emi = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalInterest = emi * n - amount;
    const costOfCredit = totalInterest / amount * 100;
    let bal = amount, rows = [];
    for (let yr = 1; yr <= Math.ceil(term); yr++) {
      let yearInt = 0, yearPrin = 0;
      for (let mo = 0; mo < 12 && bal > 0; mo++) {
        const intPmt = bal * r;
        const prinPmt = Math.min(emi - intPmt, bal);
        yearInt += intPmt; yearPrin += prinPmt;
        bal = Math.max(0, bal - prinPmt);
      }
      rows.push({ year: yr, interest: Math.round(yearInt), principal: Math.round(yearPrin), balance: Math.round(bal) });
    }
    const chart = { type: "donut", data: [{ name: "Principal", value: amount }, { name: "Interest", value: Math.round(totalInterest) }], keys: ["value"] };
    setRes(buildResult("Monthly EMI", fm(Math.round(emi)),
      [
        { label: "Loan Amount", value: fm(amount) },
        { label: "Interest Rate", value: rate + "% p.a." },
        { label: "Tenure", value: term + " years" },
        { label: "Total Interest", value: fm(Math.round(totalInterest)), warn: true },
        { label: "Total Repayment", value: fm(Math.round(emi * n)) },
        { label: "Cost of Credit", value: costOfCredit.toFixed(1) + "% extra" },
      ],
      [{ type: costOfCredit > 50 ? "warn" : "tip", msg: costOfCredit > 50 ? "You'll pay " + costOfCredit.toFixed(0) + "% extra as interest! Consider paying off early or negotiating a lower rate." : "Total interest of " + fm(Math.round(totalInterest)) + " is " + costOfCredit.toFixed(0) + "% of loan amount. Shorter tenure = less interest." }],
      chart, rows.map(r => ({ label: "Year " + r.year, value: "Int: " + fm(r.interest) + " | Prin: " + fm(r.principal) + " | Bal: " + fm(r.balance) }))
    ));
  }, [amount, rate, term, tab, income, existingDebts]);

  return (
    <div className="space-y-6">
      <Tabs tabs={["Calculator", "Eligibility"]} active={tab} onChange={setTab} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Presets items={[
            { label: "Medical Emergency", v: { a: 50000, r: 14, t: 1 } },
            { label: "Home Renovation", v: { a: 300000, r: 12, t: 3 } },
            { label: "Wedding", v: { a: 500000, r: 13.5, t: 5 } },
          ]} onApply={pr => { setAmount(pr.v.a); setRate(pr.v.r); setTerm(pr.v.t); }} />
          <Sl label="Loan Amount" id="pl_a" min={10000} max={5000000} step={10000} value={amount} onChange={setAmount} fmt={v => fmSlider(v)} />
          <Sl label="Interest Rate (% p.a.)" id="pl_r" min={8} max={30} step={0.25} value={rate} onChange={setRate} fmt={v => v + "%"} />
          <Sel label="Tenure" id="pl_t" value={String(term)} onChange={v => setTerm(+v)} opts={[{ v: "1", l: "1 Year" }, { v: "2", l: "2 Years" }, { v: "3", l: "3 Years" }, { v: "4", l: "4 Years" }, { v: "5", l: "5 Years" }]} />
          {tab === "Eligibility" && (
            <>
              <N label="Monthly Income" id="pl_inc" value={income} onChange={setIncome} unit={sym} placeholder="60000" hint="Gross monthly salary/income" />
              <N label="Existing Monthly EMIs" id="pl_debt" value={existingDebts} onChange={setExistingDebts} unit={sym} placeholder="5000" hint="All existing loan payments" />
            </>
          )}
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="Personal Loan" /></div>
      </div>
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>Personal Loan Tips</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75 }}>Personal loans (14-24% p.a.) are the most expensive type of borrowing. Alternatives: Gold loan (8-12%), loan against FD (1-2% above FD rate), top-up on home loan. Always compare Total Cost of Credit (principal + all interest + fees). Pre-payment reduces interest significantly — check foreclosure charges.</p>
      </div>
    </div>
  );
}

// ── Student Loan Calculator ───────────────────────────────────────────
export function StudentLoanForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(10.5);
  const [term, setTerm] = useState(10);
  const [gracePeriod, setGracePeriod] = useState("6");
  const [expectedSalary, setExpectedSalary] = useState("40000");
  const [repaymentPlan, setRepaymentPlan] = useState("standard");
  const [res, setRes] = useState(null);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const r = rate / 100 / 12, n = term * 12;
    const grace = +gracePeriod || 0;
    if (!amount || !rate || !term) return;
    const accrued = amount * Math.pow(1 + r, grace);
    const loanWithAccrued = repaymentPlan === "standard" ? accrued : amount;
    const emi = r > 0 ? (loanWithAccrued * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : loanWithAccrued / n;
    const totalInterest = emi * n - amount;
    const accrualInterest = accrued - amount;
    const salaryMonth = +expectedSalary || 0;
    const loanToIncomePct = salaryMonth > 0 ? (emi / salaryMonth * 100) : 0;
    let bal = loanWithAccrued, rows = [];
    for (let yr = 1; yr <= Math.min(term, 10); yr++) {
      let yInt = 0, yPrin = 0;
      for (let mo = 0; mo < 12 && bal > 0; mo++) { const ip = bal * r; const pp = Math.min(emi - ip, bal); yInt += ip; yPrin += pp; bal = Math.max(0, bal - pp); }
      rows.push({ year: yr, interest: Math.round(yInt), principal: Math.round(yPrin), balance: Math.round(bal) });
    }
    setSchedule(rows);
    const chart = { type: "bar", data: rows.map(r => ({ year: "Yr " + r.year, Interest: r.interest, Principal: r.principal })), keys: ["Interest", "Principal"] };
    setRes(buildResult("Monthly EMI", fm(Math.round(emi)),
      [
        { label: "Original Loan Amount", value: fm(amount) },
        { label: "After Grace Period Accrual", value: fm(Math.round(accrued)), warn: grace > 0 },
        grace > 0 ? { label: "Interest During Grace", value: fm(Math.round(accrualInterest)), warn: true } : null,
        { label: "Total Interest to Pay", value: fm(Math.round(totalInterest)), warn: true },
        { label: "Total Repayment", value: fm(Math.round(emi * n)) },
        salaryMonth > 0 ? { label: "EMI as % of Salary", value: loanToIncomePct.toFixed(1) + "%", warn: loanToIncomePct > 20 } : null,
        salaryMonth > 0 ? { label: "Monthly Take-home After EMI", value: fm(Math.round(salaryMonth - emi)) } : null,
      ].filter(Boolean),
      [{ type: loanToIncomePct > 20 ? "warn" : "tip", msg: loanToIncomePct > 20 ? "EMI is " + loanToIncomePct.toFixed(0) + "% of your expected salary — quite high! Consider income-driven repayment or a longer term." : "Your EMI of " + fm(Math.round(emi)) + " is " + loanToIncomePct.toFixed(0) + "% of salary — manageable. Aim to repay early to save interest." }],
      chart, []
    ));
  }, [amount, rate, term, gracePeriod, expectedSalary, repaymentPlan]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Presets items={[
            { label: "Engineering/Medical (5yr)", v: { a: 500000, r: 10.5, t: 10, gp: 6 } },
            { label: "MBA Program", v: { a: 2000000, r: 11.0, t: 15, gp: 12 } },
            { label: "Abroad Education", v: { a: 4000000, r: 9.5, t: 20, gp: 12 } },
          ]} onApply={pr => { setAmount(pr.v.a); setRate(pr.v.r); setTerm(pr.v.t); setGracePeriod(String(pr.v.gp)); }} />
          <Sl label="Education Loan Amount" id="sl_a" min={50000} max={10000000} step={50000} value={amount} onChange={setAmount} fmt={v => fmSlider(v)} />
          <Sl label="Interest Rate (% p.a.)" id="sl_r" min={7} max={16} step={0.25} value={rate} onChange={setRate} fmt={v => v + "%"} />
          <Sel label="Repayment Term" id="sl_t" value={String(term)} onChange={v => setTerm(+v)} opts={[{ v: "5", l: "5 Years" }, { v: "7", l: "7 Years" }, { v: "10", l: "10 Years" }, { v: "15", l: "15 Years" }, { v: "20", l: "20 Years" }]} />
          <N label="Grace/Moratorium Period (months)" id="sl_gp" value={gracePeriod} onChange={setGracePeriod} unit="mo" placeholder="6" hint="Period before repayment begins; interest accrues" />
          <Sel label="Repayment Plan" id="sl_plan" value={repaymentPlan} onChange={setRepaymentPlan} opts={[{ v: "standard", l: "Standard (Pay accrued interest)" }, { v: "subsidized", l: "Subsidized (No accrual during grace)" }]} />
          <N label="Expected Starting Salary" id="sl_sal" value={expectedSalary} onChange={setExpectedSalary} unit={sym} placeholder="40000" hint="Monthly salary after graduation" />
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="Student Loan" /></div>
      </div>
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>Education Loan Guide</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75 }}>Education loans have a moratorium period (course duration + 6-12 months) during which you don't pay EMI, but interest continues to accrue. On unsubsidized loans, this accrued interest is added to principal. <strong>Tip:</strong> Pay interest during the moratorium to keep total debt manageable. ROI is key — choose courses with strong placement records.</p>
      </div>
    </div>
  );
}

// ── Credit Card Payoff Calculator ─────────────────────────────────────
export function CreditCardForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [balance, setBalance] = useState(50000);
  const [apr, setApr] = useState(42);
  const [paymentMode, setPaymentMode] = useState("monthly");
  const [monthlyPayment, setMonthlyPayment] = useState("2000");
  const [targetMonths, setTargetMonths] = useState("24");
  const [tab, setTab] = useState("Payoff");
  const [cards, setCards] = useState([
    { id: 1, name: "Chase Sapphire", balance: 30000, apr: 42 },
    { id: 2, name: "HDFC Regalia", balance: 20000, apr: 38 },
  ]);
  const [strategy, setStrategy] = useState("avalanche");
  const [res, setRes] = useState(null);

  const MONTHLY_RATE = apr / 100 / 12;
  const minPayment = balance * 0.02;

  useEffect(() => {
    if (tab === "DebtStrategy") {
      const totalBalance = cards.reduce((s, c) => s + c.balance, 0);
      const sorted = [...cards].sort((a, b) => strategy === "avalanche" ? b.apr - a.apr : a.balance - b.balance);
      const minTotal = cards.reduce((s, c) => s + c.balance * 0.02, 0);
      const minMonths = Math.max(...cards.map(card => {
        const r = card.apr / 100 / 12; let b = card.balance, mo = 0;
        while (b > 0 && mo < 360) { const ip = b * r; const pp = card.balance * 0.02 - ip; b -= pp; mo++; }
        return mo;
      }));
      setRes(buildResult("Strategy: " + (strategy === "avalanche" ? "Avalanche" : "Snowball"), fm(Math.round(totalBalance)),
        [
          { label: "Total Debt", value: fm(Math.round(totalBalance)) },
          { label: "Minimum Payment/mo", value: fm(Math.round(minTotal)) },
          { label: "Recommended Strategy", value: strategy === "avalanche" ? "Highest APR First" : "Lowest Balance First" },
          { label: "Strategy Priority", value: sorted.map(c => c.name).join(" → ") },
        ],
        [{ type: "tip", msg: strategy === "avalanche" ? "Avalanche method saves the most interest by attacking highest APR debts first. Mathematically optimal." : "Snowball method builds momentum with quick wins by paying off small balances first. Better for motivation." }],
        null, sorted.map(c => ({ label: c.name + " - APR: " + c.apr + "%", value: "Balance: " + fm(c.balance) }))
      ));
      return;
    }
    if (!balance || !apr) return;
    const r = MONTHLY_RATE;
    if (paymentMode === "monthly") {
      const pmt = +monthlyPayment || 0;
      if (pmt <= balance * r) { setRes(buildResult("Payoff", "Never!", [{ label: "Minimum to cover interest", value: fm(Math.round(balance * r + 1)) }, { label: "Your payment", value: fm(pmt) }], [{ type: "warn", msg: "Your payment doesn't cover interest! Increase to at least " + fm(Math.round(balance * r + 100)) + " to make progress." }], null, [])); return; }
      let bal = balance, months = 0, totalInt = 0;
      while (bal > 0 && months < 360) { const ip = bal * r; const pp = Math.min(pmt - ip, bal); totalInt += ip; bal -= pp; months++; }
      const chart = { type: "donut", data: [{ name: "Principal", value: balance }, { name: "Interest", value: Math.round(totalInt) }], keys: ["value"] };
      setRes(buildResult("Payoff", months + " months",
        [{ label: "Current Balance", value: fm(balance) }, { label: "Monthly Payment", value: fm(pmt) }, { label: "Payoff Date", value: (() => { const d = new Date(); d.setMonth(d.getMonth() + months); return d.toLocaleDateString("en-US", { month: "short", year: "numeric" }); })() }, { label: "Total Interest", value: fm(Math.round(totalInt)), warn: true }, { label: "Total Cost", value: fm(Math.round(totalInt + balance)) }, { label: "Min Payment (2%) would take", value: Math.min(360, Math.round(balance / (balance * 0.02 - balance * r + 0.01))) + " months" }],
        [{ type: "tip", msg: "Paying " + fm(pmt) + "/mo clears " + fm(balance) + " in " + months + " months. Doubling your payment saves " + Math.round(months * 0.4) + " months!" }],
        chart, []
      ));
    } else {
      const targetMo = +targetMonths;
      const required = r > 0 ? (balance * r * Math.pow(1 + r, targetMo)) / (Math.pow(1 + r, targetMo) - 1) : balance / targetMo;
      const totalInterest = required * targetMo - balance;
      setRes(buildResult("Required Payment", fm(Math.round(required)),
        [{ label: "Balance", value: fm(balance) }, { label: "Target Payoff", value: targetMo + " months" }, { label: "Total Interest", value: fm(Math.round(totalInterest)), warn: true }, { label: "Total Cost", value: fm(Math.round(required * targetMo)) }],
        [{ type: "tip", msg: "Pay " + fm(Math.round(required)) + "/mo to clear in " + targetMo + " months. Lower APR by transferring to 0% balance transfer card first!" }],
        null, []
      ));
    }
  }, [balance, apr, paymentMode, monthlyPayment, targetMonths, tab, cards, strategy]);

  const updateCard = (id, field, value) => setCards(prev => prev.map(c => c.id === id ? { ...c, [field]: field === "name" ? value : +value } : c));
  const addCard = () => setCards(prev => [...prev, { id: Date.now(), name: "Card " + (prev.length + 1), balance: 10000, apr: 42 }]);

  return (
    <div className="space-y-6">
      <Tabs tabs={["Payoff Calc", "Debt Strategy"]} active={tab} onChange={setTab} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {tab !== "DebtStrategy" ? (
            <>
              <Presets items={[
                { label: "Small balance", v: { b: 20000, apr: 42, pm: "monthly", mp: 2000 } },
                { label: "Mid balance", v: { b: 50000, apr: 38, pm: "monthly", mp: 5000 } },
                { label: "High balance", v: { b: 150000, apr: 36, pm: "target", tm: 24 } },
              ]} onApply={pr => { setBalance(pr.v.b); setApr(pr.v.apr); setPaymentMode(pr.v.pm); setMonthlyPayment(String(pr.v.mp || "")); setTargetMonths(String(pr.v.tm || "24")); }} />
              <Sl label="Credit Card Balance" id="cc_b" min={1000} max={1000000} step={1000} value={balance} onChange={setBalance} fmt={v => fmSlider(v)} />
              <Sl label="APR (%)" id="cc_apr" min={12} max={48} step={0.5} value={apr} onChange={setApr} fmt={v => v + "% p.a."} />
              <p style={{ fontSize: 11, color: "var(--text3)", marginBottom: 8 }}>Minimum payment (2%): {fm(Math.round(minPayment))}/mo</p>
              <Sel label="Payoff Method" id="cc_pm" value={paymentMode} onChange={setPaymentMode} opts={[{ v: "monthly", l: "Fixed Monthly Payment" }, { v: "target", l: "Target Months to Pay Off" }]} />
              {paymentMode === "monthly" ? <N label="Monthly Payment" id="cc_mp" value={monthlyPayment} onChange={setMonthlyPayment} unit={sym} placeholder="2000" hint="Must exceed minimum payment" /> : <N label="Target Payoff (months)" id="cc_tm" value={targetMonths} onChange={setTargetMonths} unit="mo" placeholder="24" hint="When do you want to be debt-free?" />}
            </>
          ) : (
            <>
              <Sel label="Strategy" id="cc_strat" value={strategy} onChange={setStrategy} opts={[{ v: "avalanche", l: "Avalanche (Highest APR First)" }, { v: "snowball", l: "Snowball (Lowest Balance First)" }]} />
              {cards.map(card => (
                <div key={card.id} style={{ padding: "12px", background: "var(--surface2)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", marginBottom: 8 }}>
                  <input value={card.name} onChange={e => updateCard(card.id, "name", e.target.value)} style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", background: "transparent", border: "none", outline: "none", width: "100%", marginBottom: 8 }} />
                  <Row2>
                    <N label="Balance" id={"cc_cb" + card.id} value={String(card.balance)} onChange={v => updateCard(card.id, "balance", v)} unit={sym} placeholder="0" hint="" />
                    <N label="APR %" id={"cc_ca" + card.id} value={String(card.apr)} onChange={v => updateCard(card.id, "apr", v)} unit="%" placeholder="42" hint="" />
                  </Row2>
                </div>
              ))}
              {cards.length < 5 && <button onClick={addCard} style={{ width: "100%", padding: "8px", borderRadius: "var(--r-md)", border: "2px dashed var(--border)", background: "transparent", color: "var(--brand)", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>+ Add Card</button>}
            </>
          )}
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="Credit Card" /></div>
      </div>
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>Credit Card Debt Warning</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75 }}>At 42% APR, a ₹50,000 balance paying only minimum (₹1,000/mo) would take <strong>over 15 years</strong> to pay off and cost ₹1.5L+ in interest! Always pay more than the minimum. Consider balance transfers to 0% APR cards, or take a personal loan at 12-15% to consolidate high-APR credit card debt.</p>
      </div>
    </div>
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
    let remaining = debtList.map(d => ({ ...d, balance: d.balance }));
    let totalInterest = 0, months = 0;
    while (remaining.some(d => d.balance > 0) && months < 480) {
      months++;
      let extraLeft = extra;
      remaining.forEach(d => {
        if (d.balance <= 0) return;
        const interest = d.balance * (d.rate / 100 / 12);
        totalInterest += interest;
        d.balance = Math.max(0, d.balance - (d.minPayment - interest));
      });
      const active = remaining.filter(d => d.balance > 0);
      if (active.length > 0 && extraLeft > 0) {
        const target = strat === "avalanche"
          ? active.reduce((a, b) => a.rate > b.rate ? a : b)
          : active.reduce((a, b) => a.balance < b.balance ? a : b);
        target.balance = Math.max(0, target.balance - extraLeft);
      }
    }
    return { months, totalInterest };
  }

  useEffect(() => {
    if (debts.every(d => d.balance <= 0)) return;
    const extra = +extraPayment || 0;
    const result = simulatePayoff(debts, extra, strategy);
    const baseResult = simulatePayoff(debts, 0, strategy);
    const interestSaved = baseResult.totalInterest - result.totalInterest;
    const monthsSaved = baseResult.months - result.months;
    const totalDebt = debts.reduce((s, d) => s + d.balance, 0);
    const totalMinPayments = debts.reduce((s, d) => s + d.minPayment, 0);
    const sortedOrder = [...debts].sort((a, b) => strategy === "avalanche" ? b.rate - a.rate : a.balance - b.balance);
    setRes(buildResult("Debt-Free In", result.months + " months",
      [
        { label: "Total Debt", value: fm(Math.round(totalDebt)) },
        { label: "Min Payments/mo", value: fm(Math.round(totalMinPayments)) },
        extra > 0 ? { label: "Extra Payment/mo", value: fm(extra), highlight: true } : null,
        { label: "Total Interest (w/ extra)", value: fm(Math.round(result.totalInterest)), warn: true },
        extra > 0 ? { label: "Interest Saved", value: fm(Math.round(interestSaved)), highlight: true } : null,
        extra > 0 ? { label: "Months Saved", value: monthsSaved + " months", highlight: true } : null,
        { label: "Strategy", value: strategy === "avalanche" ? "Avalanche (Best ROI)" : "Snowball (Motivational)" },
        { label: "Attack Order", value: sortedOrder.map(d => d.name).join(" → ") },
      ].filter(Boolean),
      [{ type: "tip", msg: extra > 0 ? "Extra " + fm(extra) + "/mo saves " + fm(Math.round(interestSaved)) + " and " + monthsSaved + " months! You'll be debt-free " + (monthsSaved / 12).toFixed(1) + " years earlier." : "Add even " + fm(1000) + " extra/month to drastically cut interest. Run the numbers!" }],
      { type: "bar", data: [...debts].sort((a, b) => strategy === "avalanche" ? b.rate - a.rate : a.balance - b.balance).map(d => ({ name: d.name, Balance: d.balance })), keys: ["Balance"] },
      []
    ));
  }, [debts, extraPayment, strategy]);

  const updateDebt = (id, field, value) => setDebts(prev => prev.map(d => d.id === id ? { ...d, [field]: field === "name" ? value : +value } : d));
  const addDebt = () => setDebts(prev => [...prev, { id: Date.now(), name: "Debt " + (prev.length + 1), balance: 50000, rate: 15, minPayment: 1000 }]);
  const removeDebt = (id) => setDebts(prev => prev.filter(d => d.id !== id));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Sel label="Payoff Strategy" id="dp_strat" value={strategy} onChange={setStrategy} opts={[{ v: "avalanche", l: "Avalanche - Highest Rate First (Saves Most ₹)" }, { v: "snowball", l: "Snowball - Smallest Balance First (Most Motivating)" }]} />
          <N label="Extra Monthly Payment" id="dp_extra" value={extraPayment} onChange={setExtraPayment} unit={sym} placeholder="3000" hint="Applied to priority debt after all minimums" />
          <div style={{ marginTop: 12 }}>
            {debts.map((debt, i) => (
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
          </div>
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="Debt Payoff" /></div>
      </div>
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>Avalanche vs Snowball</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75 }}><strong>Avalanche:</strong> Pay minimums on all debts, throw extra money at highest-APR debt. Mathematically saves the most money. <strong>Snowball:</strong> Pay off smallest balance first for quick wins that build psychological momentum. Research shows snowball has better adherence rates despite costing slightly more interest. Choose whichever keeps you motivated!</p>
      </div>
    </div>
  );
}
