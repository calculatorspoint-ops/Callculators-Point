// @ts-nocheck
import { useState, useEffect } from "react";
import {
  N, Sl, Sel, Tabs, Row2, Presets,
  Panel, buildResult, useCurrency,
  InputSection, SEOSection
} from './SharedComponents';

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

  const accent = "#4361ee";

  // Derive display values for premium UI
  const down = homePrice * (downPct / 100);
  const loan = homePrice - down;
  const r = rate / 100 / 12;
  const n = termYrs * 12;
  const emi = r > 0 ? (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : loan / n;
  const totalPI = emi * n;
  const totalInterest = totalPI - loan;
  const monthlyTax = homePrice * (propTax / 100) / 12;
  const monthlyIns = insurance / 12;
  const pmi = (loan / homePrice) * 100 > 80 ? loan * 0.005 / 12 : 0;
  const totalMonthly = emi + monthlyTax + monthlyIns + pmi;
  const ltv = (loan / homePrice) * 100;
  const principalPct = Math.round((loan / (loan + totalInterest)) * 100);
  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + n);

  const amTable = [];
  let bal2 = loan;
  for (let i = 1; i <= Math.min(n, view === "Monthly" ? 12 : termYrs); i++) {
    const int = bal2 * r;
    const prin = emi - int;
    bal2 -= prin;
    if (view === "Yearly") {
      if (i % 12 === 0) amTable.push({ label: "Year " + (i / 12), value: "Principal " + fm(Math.round(prin * 12)) + " | Balance " + fm(Math.max(0, Math.round(bal2))) });
    } else {
      amTable.push({ label: "Month " + i, value: "P " + fm(Math.round(prin)) + " | I " + fm(Math.round(int)) + " | Bal " + fm(Math.max(0, Math.round(bal2))) });
    }
  }

  return (
    <>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "4px 0", fontFamily: "var(--font)" }}>

        {/* INPUT CARD */}
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 16, padding: "24px 28px 20px", marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".09em", color: "var(--text3)", margin: "0 0 18px" }}>
            🏠 Mortgage Details
          </p>
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
        </div>

        {/* RESULTS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* HERO */}
          <div style={{ background: `linear-gradient(135deg,${accent}18,${accent}06)`, border: `2px solid ${accent}30`, borderRadius: 20, padding: "28px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -50, left: "50%", transform: "translateX(-50%)", width: 220, height: 220, background: `radial-gradient(circle,${accent}20,transparent 70%)`, pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em", color: accent, marginBottom: 8 }}>
                🏦 MONTHLY PAYMENT (P&I)
              </p>
              <p style={{ fontSize: "clamp(26px,6vw,44px)", fontWeight: 900, color: "var(--text)", lineHeight: 1.1, margin: "0 0 6px" }}>
                {fm(Math.round(emi))}
              </p>
              <p style={{ fontSize: 13, color: "var(--text3)", margin: 0, fontWeight: 600 }}>
                Total Monthly (incl. tax + ins{pmi > 0 ? " + PMI" : ""}): <strong style={{ color: accent }}>{fm(Math.round(totalMonthly))}</strong>
              </p>
            </div>
          </div>

          {/* 4-METRIC GRID */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
            {[
              { icon: "💳", label: "Principal & Interest", val: fm(Math.round(emi)) },
              { icon: "🏛️", label: "Property Tax /mo", val: fm(Math.round(monthlyTax)) },
              { icon: "🛡️", label: "Insurance /mo", val: fm(Math.round(monthlyIns)) },
              { icon: "📅", label: "Total Monthly", val: fm(Math.round(totalMonthly)) },
            ].map(m => (
              <div key={m.label} style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 14, padding: "16px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{m.icon}</div>
                <div style={{ fontSize: "clamp(14px,3vw,20px)", fontWeight: 900, color: "var(--text)", lineHeight: 1 }}>{m.val}</div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 6, fontWeight: 600 }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* PRINCIPAL vs INTEREST SPLIT BAR */}
          <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 14, padding: "18px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text2)" }}>Principal vs Interest Split</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: accent }}>{principalPct}% Principal</span>
            </div>
            <div style={{ height: 10, background: "var(--surf2)", borderRadius: 100, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${principalPct}%`, background: `linear-gradient(90deg,${accent}88,${accent})`, borderRadius: 100, transition: "width .6s" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600 }}>Principal: {fm(Math.round(loan))}</span>
              <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600 }}>Interest: {fm(Math.round(totalInterest))}</span>
            </div>
          </div>

          {/* LOAN SUMMARY TABLE */}
          <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", background: "var(--surf2)" }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: "var(--text)", margin: 0 }}>📋 Loan Summary</p>
            </div>
            {[
              { label: "Home Price", value: fm(Math.round(homePrice)) },
              { label: "Down Payment", value: fm(Math.round(down)) + " (" + downPct + "%)" },
              { label: "Loan Amount", value: fm(Math.round(loan)) },
              { label: "LTV Ratio", value: ltv.toFixed(1) + "%" + (pmi > 0 ? " (PMI applies)" : "") },
              { label: "Total Interest Paid", value: fm(Math.round(totalInterest)), bold: true },
              { label: "Total Paid over Life", value: fm(Math.round(totalPI)), bold: true },
              { label: "Payoff Date", value: payoffDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }) },
              ...(pmi > 0 ? [{ label: "PMI /mo", value: fm(Math.round(pmi)), bold: true }] : []),
            ].map((row, i, arr) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 20px", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
                <span style={{ fontSize: 13, color: "var(--text3)", fontWeight: 600 }}>{row.label}</span>
                <span style={{ fontSize: 13, color: row.bold ? accent : "var(--text)", fontWeight: row.bold ? 800 : 600 }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* AMORTIZATION TABLE */}
          {amTable.length > 0 && (
            <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", background: "var(--surf2)" }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: "var(--text)", margin: 0 }}>📆 Amortization ({view === "Monthly" ? "First 12 Months" : `${termYrs} Years`})</p>
              </div>
              {amTable.map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", borderBottom: i < amTable.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <span style={{ fontSize: 13, color: "var(--text3)", fontWeight: 600 }}>{row.label}</span>
                  <span style={{ fontSize: 12, color: "var(--text)", fontWeight: 600, textAlign: "right" }}>{row.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* INSIGHT */}
          <div style={{ display: "flex", gap: 12, padding: "12px 16px", borderRadius: 12, background: ltv > 80 ? "rgba(239,68,68,.08)" : "rgba(67,97,238,.07)", border: `1px solid ${ltv > 80 ? "rgba(239,68,68,.25)" : "rgba(67,97,238,.2)"}` }}>
            <span>{ltv > 80 ? "⚠️" : "✅"}</span>
            <p style={{ fontSize: 13, color: "var(--text2)", margin: 0, lineHeight: 1.6 }}>
              {ltv > 80
                ? `LTV is ${ltv.toFixed(0)}% — PMI of ${fm(Math.round(pmi))}/mo applies until balance drops below 80%. Consider a larger down payment.`
                : `Your LTV of ${ltv.toFixed(0)}% is below 80% — no PMI required! Total interest over ${termYrs} years: ${fm(Math.round(totalInterest))}.`}
            </p>
          </div>

          {/* DISCLAIMER */}
          <p style={{ fontSize: 11.5, color: "var(--text3)", lineHeight: 1.7, padding: "12px 16px", background: "var(--surf2)", borderRadius: 12, border: "1px solid var(--border)", margin: 0 }}>
            🏦 <strong>Disclaimer:</strong> This calculator provides estimates based on the inputs provided. Actual EMI may vary based on lender terms, processing fees, and applicable taxes. Consult a financial advisor before making any home-buying decisions.
          </p>
        </div>
      </div>
      <SEOSection title="How Home Loan EMI is Calculated">
        <p>EMI = P × r × (1+r)^n ÷ ((1+r)^n − 1). A 20-year home loan at 8.5% on ₹50L means EMI of ~₹43,000. Down payment below 20% triggers PMI (Private Mortgage Insurance) — typically 0.5% of loan value per year. Property tax and insurance add 20–35% on top of your P&amp;I payment. Use the amortization table to understand how much goes to principal vs interest each month.</p>
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
    let cumRent = 0, cumBuy = down;
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
