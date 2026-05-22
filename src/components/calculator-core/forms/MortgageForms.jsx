import { useState, useEffect } from "react";
import { L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency } from "./SharedComponents.jsx";

// ── Mortgage Calculator ───────────────────────────────────────────────
export function MortgageForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [homePrice, setHomePrice] = useState(4000000);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [term, setTerm] = useState(20);
  const [propTaxPct, setPropTaxPct] = useState("1.2");
  const [insurance, setInsurance] = useState("15000");
  const [pmi, setPmi] = useState("0");
  const [includeExtras, setIncludeExtras] = useState(true);
  const [tab, setTab] = useState("Monthly");
  const [startDate] = useState(() => { const d = new Date(); return d.toISOString().slice(0, 7); });
  const [res, setRes] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [showAll, setShowAll] = useState(false);

  function buildSched(loanAmt, annRate, termYrs) {
    const r = annRate / 100 / 12, n = termYrs * 12;
    if (!loanAmt || !annRate || !termYrs || r <= 0) return null;
    const emi = (loanAmt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    let bal = loanAmt, totalInt = 0;
    const rows = [];
    for (let mo = 1; mo <= n; mo++) {
      const intPmt = bal * r;
      const prinPmt = Math.min(emi - intPmt, bal);
      bal = Math.max(0, bal - prinPmt);
      totalInt += intPmt;
      rows.push({ month: mo, year: Math.ceil(mo / 12), emi, principal: prinPmt, interest: intPmt, balance: bal, cumInt: totalInt });
    }
    const byYear = {};
    rows.forEach(row => {
      if (!byYear[row.year]) byYear[row.year] = { year: row.year, payment: 0, principal: 0, interest: 0, balance: row.balance };
      byYear[row.year].payment += row.emi;
      byYear[row.year].principal += row.principal;
      byYear[row.year].interest += row.interest;
      byYear[row.year].balance = row.balance;
    });
    return { emi, totalInterest: totalInt, yearly: Object.values(byYear), monthly: rows };
  }

  useEffect(() => {
    const downAmt = homePrice * (downPct / 100);
    const loanAmt = homePrice - downAmt;
    const ltv = (loanAmt / homePrice) * 100;
    const data = buildSched(loanAmt, rate, term);
    if (!data) return;
    const { emi, totalInterest, yearly, monthly } = data;
    setSchedule(yearly);

    const monthlyPropTax = (+propTaxPct || 0) * homePrice / 100 / 12;
    const monthlyInsurance = (+insurance || 0) / 12;
    const monthlyPMI = ltv > 80 ? (+pmi || 0) / 12 : 0;
    const totalMonthly = emi + (includeExtras ? monthlyPropTax + monthlyInsurance + monthlyPMI : 0);
    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + term * 12);

    const donut = { type: "donut", data: [{ name: "Principal", value: Math.round(loanAmt) }, { name: "Interest", value: Math.round(totalInterest) }, ...(includeExtras ? [{ name: "Taxes+Ins", value: Math.round((monthlyPropTax + monthlyInsurance) * term * 12) }] : [])], keys: ["value"] };

    setRes(buildResult("Monthly Payment", fm(Math.round(emi)),
      [
        { label: "Home Price", value: fm(homePrice) },
        { label: "Down Payment (" + downPct + "%)", value: fm(Math.round(downAmt)) },
        { label: "Loan Amount", value: fm(Math.round(loanAmt)) },
        { label: "Principal + Interest", value: fm(Math.round(emi)) },
        includeExtras && monthlyPropTax > 0 ? { label: "Property Tax/mo", value: fm(Math.round(monthlyPropTax)) } : null,
        includeExtras && monthlyInsurance > 0 ? { label: "Insurance/mo", value: fm(Math.round(monthlyInsurance)) } : null,
        ltv > 80 && monthlyPMI > 0 ? { label: "PMI/mo (LTV " + ltv.toFixed(0) + "%)", value: fm(Math.round(monthlyPMI)), warn: true } : null,
        includeExtras ? { label: "Total Monthly Cost", value: fm(Math.round(totalMonthly)), highlight: true } : null,
        { label: "Total Interest Paid", value: fm(Math.round(totalInterest)), warn: true },
        { label: "LTV Ratio", value: ltv.toFixed(1) + "%" + (ltv > 80 ? " (PMI required)" : " (No PMI)") },
        { label: "Payoff Date", value: payoffDate.toLocaleDateString("en-US", { month: "long", year: "numeric" }) },
      ].filter(Boolean),
      [{ type: ltv > 80 ? "warn" : "tip", msg: ltv > 80 ? "LTV of " + ltv.toFixed(0) + "% triggers PMI. Increase down payment to 20%+ to remove PMI and save " + fm(Math.round(monthlyPMI * 12)) + "/yr." : "Excellent! 20%+ down payment means no PMI. Total interest over " + term + " yrs: " + fm(Math.round(totalInterest)) + "." }],
      donut,
      [{ label: "LTV", value: ltv.toFixed(1) + "%" }, { label: "Amortization", value: term + " years (" + (term * 12) + " months)" }]
    ));
  }, [homePrice, downPct, rate, term, propTaxPct, insurance, pmi, includeExtras]);

  const exportCSV = () => {
    const csv = "Year,Payment,Principal,Interest,Balance\n" + schedule.map(r => [r.year, r.payment.toFixed(0), r.principal.toFixed(0), r.interest.toFixed(0), r.balance.toFixed(0)].join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "mortgage-schedule.csv"; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Presets items={[
            { label: "Starter Home", v: { hp: 3000000, dp: 20, r: 8.5, t: 20 } },
            { label: "Mid Range", v: { hp: 6000000, dp: 25, r: 8.2, t: 15 } },
            { label: "Luxury", v: { hp: 15000000, dp: 30, r: 8.0, t: 10 } },
          ]} onApply={pr => { setHomePrice(pr.v.hp); setDownPct(pr.v.dp); setRate(pr.v.r); setTerm(pr.v.t); }} />
          <Sl label="Home Price" id="mort_hp" min={500000} max={50000000} step={100000} value={homePrice} onChange={setHomePrice} fmt={v => fmSlider(v)} />
          <Sl label="Down Payment (%)" id="mort_dp" min={3} max={50} step={1} value={downPct} onChange={setDownPct} fmt={v => v + "% (" + fmSlider(homePrice * v / 100) + ")"} />
          <Sl label="Interest Rate (APR)" id="mort_r" min={5} max={18} step={0.05} value={rate} onChange={setRate} fmt={v => v + "% p.a."} />
          <Sel label="Loan Term" id="mort_t" value={String(term)} onChange={v => setTerm(+v)} opts={[{ v: "10", l: "10 Years" }, { v: "15", l: "15 Years" }, { v: "20", l: "20 Years" }, { v: "25", l: "25 Years" }, { v: "30", l: "30 Years" }]} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0", padding: "10px 14px", background: "var(--surface2)", borderRadius: "var(--r-md)", border: "1px solid var(--border)" }}>
            <input type="checkbox" id="mort_extras" checked={includeExtras} onChange={e => setIncludeExtras(e.target.checked)} />
            <label htmlFor="mort_extras" style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", cursor: "pointer" }}>Include Taxes & Insurance</label>
          </div>
          {includeExtras && (
            <>
              <N label="Property Tax Rate (%/yr)" id="mort_ptax" value={propTaxPct} onChange={setPropTaxPct} unit="%" placeholder="1.2" hint="Annual property tax as % of home value" />
              <N label="Home Insurance (yearly)" id="mort_ins" value={insurance} onChange={setInsurance} unit={sym} placeholder="15000" hint="Annual homeowner's insurance premium" />
              {homePrice * (1 - downPct / 100) / homePrice * 100 > 80 && (
                <N label="PMI (yearly)" id="mort_pmi" value={pmi} onChange={setPmi} unit={sym} placeholder="12000" hint="Required when LTV > 80%; typically 0.3–1.5%" />
              )}
            </>
          )}
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="Mortgage" /></div>
      </div>
      {schedule.length > 0 && (
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "var(--r-xl)", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: "1px solid var(--border)", background: "var(--surface2)" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Amortization Schedule (Yearly)</p>
            <button onClick={exportCSV} style={{ fontSize: 11, fontWeight: 700, padding: "6px 12px", borderRadius: "var(--r-md)", border: "1.5px solid var(--border)", background: "var(--surface)", color: "var(--text2)", cursor: "pointer" }}>Download CSV</button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--surface2)" }}>
                  {["Year", "Annual Payment", "Principal", "Interest", "Balance", "Prin %"].map((h, hi) => <th key={h} style={{ padding: "9px 14px", textAlign: hi === 0 ? "center" : "right", fontWeight: 700, color: "var(--text2)", fontSize: 11, textTransform: "uppercase", borderBottom: "2px solid var(--border)" }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {(showAll ? schedule : schedule.slice(0, 10)).map((row, i) => {
                  const prinPct = row.principal / (row.interest + row.principal) * 100;
                  return (
                    <tr key={row.year} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.015)" }}>
                      <td style={{ padding: "8px 14px", textAlign: "center", color: "var(--text3)", fontWeight: 700 }}>Yr {row.year}</td>
                      <td style={{ padding: "8px 14px", textAlign: "right", color: "var(--text)", fontWeight: 600 }}>{fm(Math.round(row.payment))}</td>
                      <td style={{ padding: "8px 14px", textAlign: "right", color: "var(--success)", fontWeight: 700 }}>{fm(Math.round(row.principal))}</td>
                      <td style={{ padding: "8px 14px", textAlign: "right", color: "#ef4444", fontWeight: 700 }}>{fm(Math.round(row.interest))}</td>
                      <td style={{ padding: "8px 14px", textAlign: "right", color: "var(--text)", fontWeight: 600 }}>{fm(Math.round(row.balance))}</td>
                      <td style={{ padding: "8px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <div style={{ flex: 1, height: 5, background: "rgba(239,68,68,0.15)", borderRadius: 99, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: prinPct.toFixed(0) + "%", background: "var(--success)", borderRadius: 99 }} />
                          </div>
                          <span style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700 }}>{prinPct.toFixed(0)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {schedule.length > 10 && (
            <div style={{ padding: "12px", textAlign: "center", borderTop: "1px solid var(--border)", background: "var(--surface2)" }}>
              <button onClick={() => setShowAll(!showAll)} style={{ fontSize: 13, fontWeight: 700, color: "var(--brand)", background: "transparent", border: "1.5px solid var(--brand)", borderRadius: "var(--r-md)", padding: "7px 20px", cursor: "pointer" }}>
                {showAll ? "Collapse" : "Show All " + schedule.length + " Years"}
              </button>
            </div>
          )}
        </div>
      )}
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>Understanding Your Mortgage</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75, marginBottom: 14 }}>Your monthly mortgage payment is calculated using: <strong>M = P × r(1+r)^n / [(1+r)^n - 1]</strong>. PMI (Private Mortgage Insurance) is required when your LTV exceeds 80% and automatically drops off once you've built 20% equity. Consider making extra payments to reduce interest significantly.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10 }}>
          {[{ icon: "🏠", title: "LTV Ratio", desc: "Keep below 80% to avoid PMI" }, { icon: "💰", title: "Down Payment", desc: "Higher down = lower rate offers" }, { icon: "📅", title: "Term Length", desc: "Shorter term = higher EMI, less interest" }, { icon: "📉", title: "Rate Type", desc: "Fixed rate protects from rate hikes" }].map((c, i) => (
            <div key={i} style={{ padding: "12px", background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{c.icon}</div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 3 }}>{c.title}</p>
              <p style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.6 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── House Affordability Calculator ───────────────────────────────────
export function HouseAffordabilityForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [income, setIncome] = useState(120000);
  const [monthlyDebts, setMonthlyDebts] = useState(5000);
  const [downPayment, setDownPayment] = useState(500000);
  const [rate, setRate] = useState(8.5);
  const [term, setTerm] = useState(20);
  const [propertyTaxPct, setPropertyTaxPct] = useState("1.2");
  const [insurancePct, setInsurancePct] = useState("0.5");
  const [res, setRes] = useState(null);

  useEffect(() => {
    if (!income || !downPayment || !rate || !term) return;
    const monthlyIncome = income / 12;
    const maxPITI = monthlyIncome * 0.28;
    const maxDTI = monthlyIncome * 0.43 - monthlyDebts;
    const maxMonthly = Math.min(maxPITI, maxDTI);
    const r = rate / 100 / 12, n = term * 12;
    const loanFactor = r > 0 ? (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)) : n;
    const maxLoan = maxMonthly * loanFactor;
    const maxHomePrice = maxLoan + downPayment;
    const conservativePrice = maxHomePrice * 0.85;
    const aggressivePrice = maxHomePrice * 1.1;
    const monthlyTax = maxHomePrice * (+propertyTaxPct || 1.2) / 100 / 12;
    const monthlyInsurance = maxHomePrice * (+insurancePct || 0.5) / 100 / 12;
    const emi = (maxLoan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalMonthly = emi + monthlyTax + monthlyInsurance;
    const dtiRatio = (totalMonthly + monthlyDebts) / monthlyIncome * 100;
    const chart = { type: "bar", data: [{ name: "Conservative", value: Math.round(conservativePrice) }, { name: "Recommended", value: Math.round(maxHomePrice) }, { name: "Aggressive", value: Math.round(aggressivePrice) }], keys: ["value"] };
    setRes(buildResult("Max Home Price", fm(Math.round(maxHomePrice)),
      [
        { label: "Max Loan Amount", value: fm(Math.round(maxLoan)) },
        { label: "Down Payment", value: fm(downPayment) },
        { label: "Max Monthly EMI", value: fm(Math.round(maxMonthly)) },
        { label: "DTI Ratio", value: dtiRatio.toFixed(1) + "%", warn: dtiRatio > 36 },
        { label: "Conservative Target", value: fm(Math.round(conservativePrice)) },
        { label: "Front-end Limit (28%)", value: fm(Math.round(maxPITI)) + "/mo" },
        { label: "Back-end Limit (43%)", value: fm(Math.round(maxDTI)) + "/mo" },
        { label: "Total Monthly Cost", value: fm(Math.round(totalMonthly)) },
      ],
      [{ type: dtiRatio > 43 ? "warn" : "tip", msg: dtiRatio > 43 ? "DTI of " + dtiRatio.toFixed(0) + "% is above lender limit (43%). Reduce debts or increase income first." : "Based on 28/43 rule: keep housing costs under 28% and total debts under 43% of gross income." }],
      chart,
      [{ label: "Monthly Income", value: fm(Math.round(monthlyIncome)) }, { label: "Existing Debts/mo", value: fm(monthlyDebts) }]
    ));
  }, [income, monthlyDebts, downPayment, rate, term, propertyTaxPct, insurancePct]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Presets items={[
            { label: "First-time Buyer", v: { inc: 1200000, debts: 10000, dp: 200000, r: 8.5, t: 20 } },
            { label: "Upgrader", v: { inc: 2400000, debts: 20000, dp: 1000000, r: 8.0, t: 15 } },
            { label: "High Income", v: { inc: 5000000, debts: 50000, dp: 3000000, r: 7.5, t: 10 } },
          ]} onApply={pr => { setIncome(pr.v.inc); setMonthlyDebts(pr.v.debts); setDownPayment(pr.v.dp); setRate(pr.v.r); setTerm(pr.v.t); }} />
          <Sl label="Annual Gross Income" id="aff_inc" min={100000} max={10000000} step={50000} value={income} onChange={setIncome} fmt={v => fmSlider(v)} />
          <Sl label="Monthly Existing Debts" id="aff_debt" min={0} max={100000} step={1000} value={monthlyDebts} onChange={setMonthlyDebts} fmt={v => fmSlider(v)} />
          <Sl label="Available Down Payment" id="aff_dp" min={10000} max={5000000} step={10000} value={downPayment} onChange={setDownPayment} fmt={v => fmSlider(v)} />
          <Sl label="Expected Rate (% p.a.)" id="aff_r" min={5} max={18} step={0.05} value={rate} onChange={setRate} fmt={v => v + "%"} />
          <Sel label="Loan Term" id="aff_t" value={String(term)} onChange={v => setTerm(+v)} opts={[{ v: "10", l: "10 Years" }, { v: "15", l: "15 Years" }, { v: "20", l: "20 Years" }, { v: "25", l: "25 Years" }, { v: "30", l: "30 Years" }]} />
          <N label="Property Tax Rate (%/yr)" id="aff_ptax" value={propertyTaxPct} onChange={setPropertyTaxPct} unit="%" placeholder="1.2" hint="Annual property tax" />
          <N label="Insurance Rate (%/yr)" id="aff_ins" value={insurancePct} onChange={setInsurancePct} unit="%" placeholder="0.5" hint="Annual homeowner's insurance" />
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="Affordability" /></div>
      </div>
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>The 28/43 Rule for Home Buying</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75 }}>Lenders use two key ratios: <strong>Front-end ratio (28%)</strong> — monthly housing costs should not exceed 28% of gross monthly income. <strong>Back-end ratio (43%)</strong> — total monthly debts (housing + all debts) should not exceed 43% of gross income. These are guidelines; individual lenders may vary.</p>
      </div>
    </div>
  );
}

// ── Rent vs Buy Calculator ────────────────────────────────────────────
export function RentVsBuyForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [homePrice, setHomePrice] = useState(4000000);
  const [downPct, setDownPct] = useState(20);
  const [mortgageRate, setMortgageRate] = useState(8.5);
  const [mortgageTerm, setMortgageTerm] = useState(20);
  const [propAppreciation, setPropAppreciation] = useState(5);
  const [monthlyRent, setMonthlyRent] = useState(15000);
  const [rentIncrease, setRentIncrease] = useState(5);
  const [investReturn, setInvestReturn] = useState(10);
  const [years, setYears] = useState(10);
  const [res, setRes] = useState(null);

  useEffect(() => {
    if (!homePrice || !monthlyRent || !years) return;
    const downAmt = homePrice * (downPct / 100);
    const loanAmt = homePrice - downAmt;
    const r = mortgageRate / 100 / 12, n = mortgageTerm * 12;
    const emi = r > 0 ? (loanAmt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : loanAmt / n;
    let buyBal = loanAmt, totalMortgagePaid = 0, totalIntPaid = 0;
    for (let mo = 0; mo < years * 12; mo++) {
      const intPmt = buyBal * r;
      buyBal = Math.max(0, buyBal - (emi - intPmt));
      totalMortgagePaid += emi;
      totalIntPaid += intPmt;
    }
    const futureHomeValue = homePrice * Math.pow(1 + propAppreciation / 100, years);
    const equity = futureHomeValue - buyBal;
    const maintenanceCost = homePrice * 0.01 * years;
    const totalBuyCost = totalMortgagePaid + maintenanceCost - (equity - downAmt);
    let totalRentPaid = 0, currRent = monthlyRent;
    for (let yr = 0; yr < years; yr++) { totalRentPaid += currRent * 12; currRent *= (1 + rentIncrease / 100); }
    const investedDown = downAmt * Math.pow(1 + investReturn / 100, years);
    const rentOpportunityCost = investedDown - downAmt;
    const totalRentCost = totalRentPaid - rentOpportunityCost;
    const buyWins = totalBuyCost < totalRentCost;
    const diff = Math.abs(totalBuyCost - totalRentCost);
    const chart = { type: "bar", data: [{ name: "Buy (Net Cost)", value: Math.round(totalBuyCost) }, { name: "Rent (Net Cost)", value: Math.round(totalRentCost) }], keys: ["value"] };
    setRes(buildResult(buyWins ? "Buying is Better" : "Renting is Better", "Saves " + fm(Math.round(diff)),
      [
        { label: "Total Buy Cost (net)", value: fm(Math.round(totalBuyCost)), highlight: buyWins },
        { label: "Total Rent Cost (net)", value: fm(Math.round(totalRentCost)), highlight: !buyWins },
        { label: "Home Value After " + years + "yr", value: fm(Math.round(futureHomeValue)) },
        { label: "Equity Built", value: fm(Math.round(equity)), highlight: true },
        { label: "Total Mortgage Paid", value: fm(Math.round(totalMortgagePaid)) },
        { label: "Interest Paid", value: fm(Math.round(totalIntPaid)) },
        { label: "Rent Paid Total", value: fm(Math.round(totalRentPaid)) },
        { label: "Opportunity Cost (investing down)", value: fm(Math.round(rentOpportunityCost)) },
      ],
      [{ type: "tip", msg: buyWins ? "Over " + years + " years, buying saves " + fm(diff) + " vs renting. Property appreciation and equity building make ownership a better wealth vehicle." : "Over " + years + " years, renting saves " + fm(diff) + " vs buying. The invested down payment return of " + investReturn + "% outpaces property gains of " + propAppreciation + "%." }],
      chart, []
    ));
  }, [homePrice, downPct, mortgageRate, mortgageTerm, propAppreciation, monthlyRent, rentIncrease, investReturn, years]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Presets items={[
            { label: "Metro City", v: { hp: 8000000, dp: 20, mr: 8.5, rent: 35000, ri: 7, pa: 6, ir: 10, y: 10 } },
            { label: "Mid-size City", v: { hp: 4000000, dp: 20, mr: 8.5, rent: 15000, ri: 5, pa: 5, ir: 10, y: 7 } },
            { label: "Tier-2 City", v: { hp: 2000000, dp: 20, mr: 8.5, rent: 7000, ri: 4, pa: 4, ir: 10, y: 5 } },
          ]} onApply={pr => { setHomePrice(pr.v.hp); setDownPct(pr.v.dp); setMortgageRate(pr.v.mr); setMonthlyRent(pr.v.rent); setRentIncrease(pr.v.ri); setPropAppreciation(pr.v.pa); setInvestReturn(pr.v.ir); setYears(pr.v.y); }} />
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)", marginTop: 12, marginBottom: 4 }}>Buying</p>
          <Sl label="Home Price" id="rvb_hp" min={500000} max={30000000} step={100000} value={homePrice} onChange={setHomePrice} fmt={v => fmSlider(v)} />
          <Sl label="Down Payment (%)" id="rvb_dp" min={10} max={50} value={downPct} onChange={setDownPct} fmt={v => v + "% (" + fmSlider(homePrice * v / 100) + ")"} />
          <N label="Mortgage Rate (%)" id="rvb_mr" value={String(mortgageRate)} onChange={v => setMortgageRate(+v)} unit="%" placeholder="8.5" hint="" />
          <N label="Property Appreciation (%/yr)" id="rvb_pa" value={String(propAppreciation)} onChange={v => setPropAppreciation(+v)} unit="%" placeholder="5" hint="Annual home value appreciation" />
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)", marginTop: 12, marginBottom: 4 }}>Renting</p>
          <Sl label="Monthly Rent" id="rvb_rent" min={3000} max={200000} step={500} value={monthlyRent} onChange={setMonthlyRent} fmt={v => fmSlider(v)} />
          <N label="Rent Annual Increase (%)" id="rvb_ri" value={String(rentIncrease)} onChange={v => setRentIncrease(+v)} unit="%" placeholder="5" hint="Expected rent increase per year" />
          <N label="Investment Return (%)" id="rvb_ir" value={String(investReturn)} onChange={v => setInvestReturn(+v)} unit="%" placeholder="10" hint="Return if down payment was invested instead" />
          <Sl label="Comparison Period (Years)" id="rvb_y" min={1} max={30} value={years} onChange={setYears} fmt={v => v + " yrs"} />
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="Rent vs Buy" /></div>
      </div>
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>Factors Beyond the Numbers</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ padding: "12px", background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)" }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: "var(--success)", marginBottom: 6 }}>✅ Reasons to Buy</p>
            {["Building equity over time", "Stability and control", "Tax deductions on interest", "Protection from rent hikes"].map((r, i) => <p key={i} style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.7 }}>{r}</p>)}
          </div>
          <div style={{ padding: "12px", background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)" }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: "var(--brand)", marginBottom: 6 }}>✅ Reasons to Rent</p>
            {["Flexibility to relocate", "No maintenance costs", "Lower upfront capital", "Invest savings elsewhere"].map((r, i) => <p key={i} style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.7 }}>{r}</p>)}
          </div>
        </div>
      </div>
    </div>
  );
}
