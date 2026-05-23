// @ts-nocheck
import { useState, useEffect } from "react";
import {
  N, Sl, Sel, Tabs, Row2, Row3, Presets,
  Panel, buildResult, useCurrency,
  InputSection, SEOSection, Toggle
} from './SharedComponents';

function CalcLayout({ inputs, result, label }) {
  return (
    <div className="calc-form-stack">
      <div>{inputs}</div>
      <Panel result={result} loading={null} label={label} />
    </div>
  );
}

// ─── Auto Loan ───────────────────────────────────────────────────────────────
export function AutoLoanForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [carPrice, setCarPrice] = useState(1200000);
  const [downPayment, setDownPayment] = useState(200000);
  const [term, setTerm] = useState(60);
  const [rate, setRate] = useState(9.5);
  const [salesTax, setSalesTax] = useState(0);
  const [regFee, setRegFee] = useState("15000");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const taxAmt = carPrice * (salesTax / 100);
    const totalCost = carPrice + taxAmt + +regFee;
    const loanAmt = totalCost - downPayment;
    if (loanAmt <= 0) return;
    const r = rate / 100 / 12;
    const emi = r > 0 ? (loanAmt * r * Math.pow(1 + r, term)) / (Math.pow(1 + r, term) - 1) : loanAmt / term;
    const totalPaid = emi * term;
    const totalInterest = totalPaid - loanAmt;
    const ltv = (loanAmt / carPrice) * 100;
    const depreciation1yr = carPrice * 0.15;
    const valueAfter1yr = carPrice - depreciation1yr;

    setRes(buildResult("Monthly Payment", fm(Math.round(emi)),
      [
        { label: "Car Price", value: fm(carPrice) },
        { label: "Loan Amount", value: fm(Math.round(loanAmt)) },
        { label: "Total Paid (all EMIs)", value: fm(Math.round(totalPaid)) },
        { label: "Total Interest", value: fm(Math.round(totalInterest)), warn: true },
        { label: "LTV Ratio", value: ltv.toFixed(1) + "%" },
        { label: "1-Year Depreciation (est.)", value: fm(Math.round(depreciation1yr)) + " (" + (depreciation1yr / carPrice * 100).toFixed(0) + "%)", warn: true },
        { label: "Car Value after 1 Year", value: fm(Math.round(valueAfter1yr)) },
      ],
      [{ type: ltv > 85 ? "warn" : "tip", msg: "Total interest over " + (term / 12) + " years: " + fm(Math.round(totalInterest)) + ". Cars depreciate ~15% in year 1, ~50% in 5 years. " + (ltv > 85 ? "High LTV — consider a larger down payment." : "Healthy LTV of " + ltv.toFixed(0) + "%.") }],
      { type: "donut", data: [{ name: "Principal", value: Math.round(loanAmt) }, { name: "Interest", value: Math.round(totalInterest) }], keys: ["value"] },
      []
    ));
  }, [carPrice, downPayment, term, rate, salesTax, regFee]);

  const inputs = (
    <>
      <Presets items={[
        { label: "Maruti Swift 5yr", v: { cp: 800000, dp: 150000, t: 60, r: 9.5 } },
        { label: "Honda City 5yr", v: { cp: 1500000, dp: 300000, t: 60, r: 9.25 } },
        { label: "Fortuner 7yr", v: { cp: 4500000, dp: 1000000, t: 84, r: 9.0 } },
      ]} onApply={pr => { setCarPrice(pr.v.cp); setDownPayment(pr.v.dp); setTerm(pr.v.t); setRate(pr.v.r); }} />
      <div className="calc-inputs-grid">
        <InputSection title="Vehicle & Loan" icon="🚗" gradient="linear-gradient(135deg,#dc2626,#b91c1c)">
          <Sl label="Car Price" id="al_cp" min={200000} max={10000000} step={50000} value={carPrice} onChange={setCarPrice} fmt={v => fmSlider(v)} />
          <Sl label="Down Payment" id="al_dp" min={0} max={carPrice} step={10000} value={downPayment} onChange={setDownPayment} fmt={v => fmSlider(v)} />
          <Sl label="Loan Term (months)" id="al_t" min={12} max={84} step={12} value={term} onChange={setTerm} fmt={v => v + " months (" + (v / 12).toFixed(1) + " yr)"} />
          <Sl label="Interest Rate (%)" id="al_r" min={7} max={16} step={0.25} value={rate} onChange={setRate} fmt={v => v + "%"} />
        </InputSection>
        <InputSection title="Additional Costs" icon="📋" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
          <Sl label="Road Tax / GST %" id="al_st" min={0} max={30} step={0.5} value={salesTax} onChange={setSalesTax} fmt={v => v + "%"} />
          <N label="Registration & RTO Fee" id="al_rf" value={regFee} onChange={setRegFee} unit={sym} placeholder="15000" hint="Registration, RTO, insurance, accessories" />
        </InputSection>
      </div>
    </>
  );
  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="Auto Loan" />
      <SEOSection title="Car Loan Calculator — EMI, Total Cost & Depreciation">
        <p>Car loans in India range from 9–12% interest. A shorter tenure means higher EMI but lower total interest. A longer tenure is more affordable monthly but costs significantly more overall. Also factor in: cars depreciate ~50% in 5 years, so your asset value drops faster than your loan balance. A down payment of 20–30% keeps you above water.</p>
      </SEOSection>
    </>
  );
}

// ─── Personal Loan ───────────────────────────────────────────────────────────
export function PersonalLoanForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(14);
  const [termMonths, setTermMonths] = useState(36);
  const [purpose, setPurpose] = useState("personal");
  const [res, setRes] = useState(null);

  const purposes = [
    { v: "wedding", l: "Wedding" }, { v: "medical", l: "Medical Emergency" },
    { v: "travel", l: "Travel" }, { v: "home", l: "Home Renovation" },
    { v: "personal", l: "Personal Use" },
  ];

  useEffect(() => {
    const r = rate / 100 / 12;
    const emi = r > 0 ? (amount * r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1) : amount / termMonths;
    const totalPaid = emi * termMonths;
    const totalInterest = totalPaid - amount;
    const emiAsIncomePct = (emi / 100000) * 100;

    setRes(buildResult("Monthly EMI", fm(Math.round(emi)),
      [
        { label: "Loan Amount", value: fm(amount) },
        { label: "Total Interest", value: fm(Math.round(totalInterest)), warn: true },
        { label: "Total Payable", value: fm(Math.round(totalPaid)) },
        { label: "Loan Tenure", value: termMonths + " months" },
        { label: "EMI as % of ₹1L salary", value: emiAsIncomePct.toFixed(1) + "%" },
        { label: "Cost of Credit", value: (totalInterest / amount * 100).toFixed(1) + "% of loan" },
      ],
      [{ type: totalInterest > amount * 0.3 ? "warn" : "tip", msg: "This personal loan costs " + fm(Math.round(totalInterest)) + " in interest over " + termMonths + " months. " + (totalInterest > amount * 0.3 ? "Consider a shorter tenure or lower rate." : "Interest-to-principal ratio is acceptable.") }],
      { type: "donut", data: [{ name: "Principal", value: amount }, { name: "Interest", value: Math.round(totalInterest) }], keys: ["value"] },
      []
    ));
  }, [amount, rate, termMonths, purpose]);

  const inputs = (
    <>
      <Presets items={[
        { label: "Medical 2yr", v: { a: 300000, r: 12, t: 24 } },
        { label: "Wedding 3yr", v: { a: 1000000, r: 13, t: 36 } },
        { label: "Renovation 4yr", v: { a: 500000, r: 11, t: 48 } },
      ]} onApply={pr => { setAmount(pr.v.a); setRate(pr.v.r); setTermMonths(pr.v.t); }} />
      <div className="calc-inputs-grid">
        <InputSection title="Loan Details" icon="💳" gradient="linear-gradient(135deg,#dc2626,#b91c1c)">
          <Sl label="Loan Amount" id="pl_a" min={25000} max={5000000} step={25000} value={amount} onChange={setAmount} fmt={v => fmSlider(v)} />
          <Sl label="Interest Rate (%)" id="pl_r" min={8} max={24} step={0.25} value={rate} onChange={setRate} fmt={v => v + "%"} />
          <Sl label="Tenure (Months)" id="pl_t" min={6} max={60} step={6} value={termMonths} onChange={setTermMonths} fmt={v => v + " months"} />
        </InputSection>
        <InputSection title="Loan Purpose" icon="🎯" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
          <Sel label="Purpose of Loan" id="pl_p" value={purpose} onChange={setPurpose} opts={purposes} />
        </InputSection>
      </div>
    </>
  );
  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="Personal Loan" />
      <SEOSection title="Personal Loan EMI Calculator">
        <p>Personal loans are unsecured (no collateral) so rates are higher (11–24%). Keep EMI below 40% of take-home pay. Banks check CIBIL score (750+ recommended), income stability, and existing obligations. Prepayment can save significantly — most banks allow it after 6–12 months with a 2–4% foreclosure charge.</p>
      </SEOSection>
    </>
  );
}

// ─── Student Loan ───────────────────────────────────────────────────────────
export function StudentLoanForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [rate, setRate] = useState(11);
  const [moratoriumMonths, setMoratoriumMonths] = useState(18);
  const [repayMonths, setRepayMonths] = useState(84);
  const [expectedSalary, setExpectedSalary] = useState(60000);
  const [salaryPct, setSalaryPct] = useState(20);
  const [res, setRes] = useState(null);

  useEffect(() => {
    const r = rate / 100 / 12;
    // Interest capitalizes during moratorium
    const capitalizedBalance = loanAmount * Math.pow(1 + r, moratoriumMonths);
    const emi = r > 0
      ? (capitalizedBalance * r * Math.pow(1 + r, repayMonths)) / (Math.pow(1 + r, repayMonths) - 1)
      : capitalizedBalance / repayMonths;
    const totalPaid = emi * repayMonths;
    const totalInterest = totalPaid - loanAmount;
    const moratoriumInterest = capitalizedBalance - loanAmount;
    const burdenPct = (emi / expectedSalary) * 100;
    const canAfford = emi <= expectedSalary * (salaryPct / 100);

    setRes(buildResult("EMI after Moratorium", fm(Math.round(emi)),
      [
        { label: "Loan Amount", value: fm(loanAmount) },
        { label: "Moratorium Interest Capitalised", value: fm(Math.round(moratoriumInterest)), warn: true },
        { label: "Effective Loan after Moratorium", value: fm(Math.round(capitalizedBalance)) },
        { label: "Total Interest Paid", value: fm(Math.round(totalInterest)), warn: true },
        { label: "EMI as % of Salary", value: burdenPct.toFixed(1) + "% (target ≤" + salaryPct + "%)", warn: burdenPct > salaryPct },
        { label: "Monthly Salary", value: fm(expectedSalary) },
        { label: "Affordability", value: canAfford ? "✅ Affordable" : "⚠️ Tight — explore IBR options", highlight: canAfford, warn: !canAfford },
      ],
      [{ type: burdenPct > salaryPct ? "warn" : "tip", msg: "EMI of " + fm(Math.round(emi)) + " = " + burdenPct.toFixed(1) + "% of your ₹" + Math.round(expectedSalary / 1000) + "K salary. " + (moratoriumInterest > 0 ? "The moratorium adds " + fm(Math.round(moratoriumInterest)) + " to your debt — consider paying interest during moratorium to avoid capitalization." : "") }],
      null, []
    ));
  }, [loanAmount, rate, moratoriumMonths, repayMonths, expectedSalary, salaryPct]);

  const inputs = (
    <div className="calc-inputs-grid">
      <InputSection title="Education Loan" icon="🎓" gradient="linear-gradient(135deg,#4361ee,#3451c7)">
        <Sl label="Loan Amount" id="sl_a" min={100000} max={10000000} step={50000} value={loanAmount} onChange={setLoanAmount} fmt={v => fmSlider(v)} />
        <Sl label="Interest Rate (%)" id="sl_r" min={8} max={15} step={0.25} value={rate} onChange={setRate} fmt={v => v + "%"} />
        <Sl label="Moratorium Period (months)" id="sl_m" min={0} max={24} step={6} value={moratoriumMonths} onChange={setMoratoriumMonths} fmt={v => v + " months (course + 6mo)"} />
        <Sl label="Repayment Tenure (months)" id="sl_t" min={12} max={180} step={12} value={repayMonths} onChange={setRepayMonths} fmt={v => v + " months"} />
      </InputSection>
      <InputSection title="Income-Based Repayment" icon="💼" gradient="linear-gradient(135deg,#059669,#047857)">
        <Sl label="Expected Starting Salary" id="sl_sal" min={20000} max={500000} step={5000} value={expectedSalary} onChange={setExpectedSalary} fmt={v => fmSlider(v)} />
        <Sl label="Max EMI as % of Salary" id="sl_pct" min={10} max={50} value={salaryPct} onChange={setSalaryPct} fmt={v => v + "% of salary"} />
      </InputSection>
    </div>
  );
  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="Student Loan" />
      <SEOSection title="Education Loan — Moratorium, EMI & Repayment Planning">
        <p>Education loans in India carry 10.5–12% interest. The moratorium period (course duration + 6 months) defers repayment but interest accrues and capitalizes — increasing your principal significantly. Paying at least the interest during moratorium saves tens of thousands. Loans up to ₹4L need no collateral; above ₹7.5L requires collateral. 80E tax deduction on interest is available for 8 years.</p>
      </SEOSection>
    </>
  );
}

// ─── Credit Card Calculator ─────────────────────────────────────────────────
export function CreditCardForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [balance, setBalance] = useState(100000);
  const [apr, setApr] = useState(36);
  const [minPct, setMinPct] = useState(5);
  const [extraPayment, setExtraPayment] = useState("5000");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const r = apr / 100 / 12;
    // Minimum payment only — calculate months
    let balMin = balance, monthsMin = 0, interestMin = 0;
    while (balMin > 0.01 && monthsMin < 1200) {
      const int = balMin * r;
      const minPay = Math.max(balMin * (minPct / 100), 500);
      const prin = Math.min(minPay - int, balMin);
      interestMin += int; balMin -= prin; monthsMin++;
    }

    // With extra payment
    const extraTotal = balance * (minPct / 100) + +extraPayment;
    let balExtra = balance, monthsExtra = 0, interestExtra = 0;
    while (balExtra > 0.01 && monthsExtra < monthsMin) {
      const int = balExtra * r;
      const pay = Math.max(extraTotal, balExtra + int);
      const prin = Math.min(pay - int, balExtra);
      interestExtra += int; balExtra -= prin; monthsExtra++;
    }

    const interestSaved = interestMin - interestExtra;
    const monthsSaved = monthsMin - monthsExtra;

    setRes(buildResult("Minimum-Only Interest", fm(Math.round(interestMin)),
      [
        { label: "Months (min payment only)", value: monthsMin + " months (" + (monthsMin / 12).toFixed(1) + " yrs)", warn: true },
        { label: "Interest (min only)", value: fm(Math.round(interestMin)), warn: true },
        { label: "Months (with extra payment)", value: monthsExtra + " months", highlight: true },
        { label: "Interest (with extra)", value: fm(Math.round(interestExtra)), highlight: true },
        { label: "Interest Saved", value: fm(Math.round(interestSaved)), highlight: true },
        { label: "Months Saved", value: monthsSaved + " months (" + (monthsSaved / 12).toFixed(1) + " yrs)" },
      ],
      [{ type: "warn", msg: "At " + apr + "% APR, minimum payments on " + fm(balance) + " cost " + fm(Math.round(interestMin)) + " over " + monthsMin + " months. Adding " + fm(+extraPayment) + "/mo extra saves " + fm(Math.round(interestSaved)) + " and pays off " + monthsSaved + " months sooner!" }],
      { type: "bar", data: [{ strategy: "Min Only", months: monthsMin, interest: Math.round(interestMin) }, { strategy: "With Extra", months: monthsExtra, interest: Math.round(interestExtra) }], keys: ["months", "interest"] },
      []
    ));
  }, [balance, apr, minPct, extraPayment]);

  const inputs = (
    <div className="calc-inputs-grid">
      <InputSection title="Card Balance" icon="💳" gradient="linear-gradient(135deg,#dc2626,#b91c1c)">
        <Sl label="Outstanding Balance" id="cc_b" min={5000} max={1000000} step={5000} value={balance} onChange={setBalance} fmt={v => fmSlider(v)} />
        <Sl label="Annual Interest Rate (APR %)" id="cc_r" min={18} max={48} step={0.5} value={apr} onChange={setApr} fmt={v => v + "% = " + (v / 12).toFixed(2) + "%/mo"} />
        <Sl label="Minimum Payment %" id="cc_mp" min={2} max={10} step={0.5} value={minPct} onChange={setMinPct} fmt={v => v + "% of balance"} />
      </InputSection>
      <InputSection title="Payoff Strategy" icon="⚡" gradient="linear-gradient(135deg,#059669,#047857)">
        <N label="Extra Monthly Payment" id="cc_ep" value={extraPayment} onChange={setExtraPayment} unit={sym} placeholder="5000" hint="Amount above minimum to pay each month" />
      </InputSection>
    </div>
  );
  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="Credit Card" />
      <SEOSection title="Credit Card Debt Payoff Calculator">
        <p>Credit cards in India charge 36–42% APR — among the highest interest rates available. Paying minimum only on ₹1L balance at 36% takes 6+ years and costs ₹1.8L extra in interest! Always pay more than minimum. The debt avalanche (highest rate first) saves the most money; snowball (smallest balance first) gives psychological wins. Consider a balance transfer at 0% introductory APR.</p>
      </SEOSection>
    </>
  );
}

// ─── Debt Payoff ────────────────────────────────────────────────────────────
export function DebtPayoffForm() {
  const { fm, sym } = useCurrency();
  const [strategy, setStrategy] = useState("Avalanche");
  const [debts, setDebts] = useState([
    { id: 1, name: "Credit Card", balance: 100000, rate: 36, minPay: 5000 },
    { id: 2, name: "Personal Loan", balance: 300000, rate: 14, minPay: 8000 },
    { id: 3, name: "Car Loan", balance: 500000, rate: 10, minPay: 12000 },
  ]);
  const [extraBudget, setExtraBudget] = useState(10000);
  const [res, setRes] = useState(null);

  function simulatePayoff(debtList, strategy, extraBudget) {
    const dList = debtList.map(d => ({ ...d, balance: d.balance }));
    const sorted = strategy === "Avalanche"
      ? [...dList].sort((a, b) => b.rate - a.rate)
      : [...dList].sort((a, b) => a.balance - b.balance);

    let months = 0, totalInterest = 0;
    while (dList.some(d => d.balance > 0) && months < 600) {
      const extra = extraBudget;
      // Pay minimums on all
      for (const d of dList) {
        if (d.balance <= 0) continue;
        const int = d.balance * (d.rate / 100 / 12);
        totalInterest += int;
        const pay = Math.min(d.minPay, d.balance + int);
        d.balance = Math.max(0, d.balance + int - pay);
      }
      // Apply extra to priority debt
      for (const s of sorted) {
        const d = dList.find(x => x.id === s.id);
        if (d && d.balance > 0) {
          d.balance = Math.max(0, d.balance - extra);
          break;
        }
      }
      months++;
    }
    return { months, totalInterest };
  }

  useEffect(() => {
    const result = simulatePayoff(debts, strategy, extraBudget);
    const minOnly = simulatePayoff(debts, strategy, 0);
    const saved = minOnly.totalInterest - result.totalInterest;
    const totalBalance = debts.reduce((s, d) => s + d.balance, 0);

    const payoffOrder = strategy === "Avalanche"
      ? [...debts].sort((a, b) => b.rate - a.rate)
      : [...debts].sort((a, b) => a.balance - b.balance);

    setRes(buildResult("Debt-Free In", result.months + " months",
      [
        { label: "Total Debt", value: fm(totalBalance) },
        { label: "Strategy", value: strategy },
        { label: "Payoff Time", value: result.months + " months (" + (result.months / 12).toFixed(1) + " yrs)", highlight: true },
        { label: "Total Interest", value: fm(Math.round(result.totalInterest)), warn: true },
        { label: "Interest Saved vs Min-Only", value: fm(Math.round(saved)), highlight: true },
        { label: "Monthly Extra Payment", value: fm(extraBudget) },
        { label: "Payoff Order", value: payoffOrder.map(d => d.name).join(" → ") },
      ],
      [{ type: "tip", msg: strategy + " strategy: payoff in " + result.months + " months, saving " + fm(Math.round(saved)) + " vs paying minimums only. " + (strategy === "Avalanche" ? "Avalanche saves the most interest." : "Snowball gives faster psychological wins.") }],
      null,
      payoffOrder.map(d => ({ label: d.name, value: "Balance " + fm(d.balance) + " @ " + d.rate + "% | Min " + fm(d.minPay), bold: false }))
    ));
  }, [debts, strategy, extraBudget]);

  const updateDebt = (id, field, value) =>
    setDebts(prev => prev.map(d => d.id === id ? { ...d, [field]: field === "name" ? value : +value } : d));

  const inputs = (
    <div className="calc-inputs-grid">
      <InputSection title="Debt Accounts" icon="💸" gradient="linear-gradient(135deg,#dc2626,#b91c1c)">
        <Tabs tabs={["Avalanche", "Snowball"]} active={strategy} onChange={setStrategy} />
        {debts.map(d => (
          <div key={d.id} style={{ marginBottom: 10, padding: "10px 12px", background: "var(--surface2)", borderRadius: "var(--r-md)", border: "1.5px solid var(--border)" }}>
            <input value={d.name} onChange={e => updateDebt(d.id, "name", e.target.value)}
              style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", background: "transparent", border: "none", outline: "none", width: "100%", marginBottom: 8 }} />
            <Row3>
              <N label="Balance" id={"dp_b" + d.id} value={String(d.balance)} onChange={v => updateDebt(d.id, "balance", v)} unit={sym} placeholder="0" hint="" />
              <N label="Rate %" id={"dp_r" + d.id} value={String(d.rate)} onChange={v => updateDebt(d.id, "rate", v)} unit="%" placeholder="10" hint="" />
              <N label="Min Pay" id={"dp_m" + d.id} value={String(d.minPay)} onChange={v => updateDebt(d.id, "minPay", v)} unit={sym} placeholder="0" hint="" />
            </Row3>
          </div>
        ))}
      </InputSection>
      <InputSection title="Extra Budget" icon="🚀" gradient="linear-gradient(135deg,#059669,#047857)">
        <Sl label="Extra Monthly Payment" id="dp_extra" min={0} max={100000} step={1000} value={extraBudget} onChange={setExtraBudget} fmt={v => fm(v) + "/mo"} />
      </InputSection>
    </div>
  );
  return (
    <>
      <CalcLayout inputs={inputs} result={res} label="Debt Payoff" />
      <SEOSection title="Debt Snowball vs Avalanche — Which Strategy Wins?">
        <p>Avalanche (highest rate first) minimizes total interest paid — mathematically optimal. Snowball (smallest balance first) gives quick psychological wins that keep you motivated. Research shows many people succeed more with Snowball despite the higher cost. This calculator shows both strategies so you can choose what works for you.</p>
      </SEOSection>
    </>
  );
}
