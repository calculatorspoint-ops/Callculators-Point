import { writeFileSync } from 'fs';

const HEADER = `import { useState, useEffect, useRef } from "react";
import { L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency } from "./SharedComponents.jsx";
import { ScenarioCompare } from "@/components/calculator-core/ScenarioCompare.jsx";

`;

const EMI_FORM = `// ── EMI Calculator ──────────────────────────────────────────────────
export function EMIForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [p, setP] = useState(500000);
  const [r, setR] = useState(8.5);
  const [y, setY] = useState(20);
  const [extra, setExtra] = useState("0");
  const [compareRate, setCompareRate] = useState("");
  const [viewMode, setViewMode] = useState("yearly");
  const [showAll, setShowAll] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState("");
  const [tab, setTab] = useState("EMI");
  const [res, setRes] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [yearlySchedule, setYearlySchedule] = useState([]);
  const [summary, setSummary] = useState(null);

  function buildSched(principal, annRate, termYrs, extraPmt) {
    const r = annRate / 100 / 12;
    const n = termYrs * 12;
    if (!principal || !annRate || !termYrs || r <= 0) return null;
    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    let bal = principal, totalInt = 0, months = 0;
    const rows = [];
    while (bal > 0.005 && months < n + 1) {
      months++;
      const intPmt = bal * r;
      let prinPmt = Math.min(emi - intPmt + extraPmt, bal);
      if (prinPmt < 0) prinPmt = 0;
      bal = Math.max(0, bal - prinPmt);
      totalInt += intPmt;
      rows.push({ month: months, year: Math.ceil(months / 12), payment: emi + extraPmt, principal: prinPmt, interest: intPmt, balance: bal, cumInt: totalInt });
      if (bal < 0.005) break;
    }
    const byYear = {};
    rows.forEach(row => {
      if (!byYear[row.year]) byYear[row.year] = { year: row.year, payment: 0, principal: 0, interest: 0, balance: row.balance };
      byYear[row.year].payment += row.payment;
      byYear[row.year].principal += row.principal;
      byYear[row.year].interest += row.interest;
      byYear[row.year].balance = row.balance;
    });
    const yearly = Object.values(byYear).map(yr => ({ ...yr, payment: Math.round(yr.payment), principal: Math.round(yr.principal), interest: Math.round(yr.interest), balance: Math.round(yr.balance) }));
    const payoffDate = new Date(); payoffDate.setMonth(payoffDate.getMonth() + months);
    return { rows, yearly, emi, totalMonths: months, totalInterest: totalInt, originalInterest: emi * n - principal, payoffDate, n };
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const extraPmt = +extra || 0;
      const data = buildSched(p, r, y, extraPmt);
      if (!data) { setRes(null); setSchedule([]); setYearlySchedule([]); setSummary(null); return; }
      const { rows, yearly, emi, totalMonths, totalInterest, originalInterest, payoffDate, n } = data;
      setSchedule(rows); setYearlySchedule(yearly);
      const origData = extraPmt > 0 ? buildSched(p, r, y, 0) : null;
      const monthsSaved = origData ? origData.totalMonths - totalMonths : 0;
      const intSaved = origData ? origData.totalInterest - totalInterest : 0;
      setSummary({ emi, totalMonths, totalInterest, payoffDate, monthsSaved, intSaved, extraPmt, n });
      const compareEMI = compareRate ? (p * (compareRate / 100 / 12) * Math.pow(1 + compareRate / 100 / 12, n)) / (Math.pow(1 + compareRate / 100 / 12, n) - 1) : 0;
      const chartData = yearly.filter((_, i) => i % Math.max(1, Math.floor(yearly.length / 12)) === 0).map(yr => ({ year: "Yr " + yr.year, Principal: Math.round(yr.principal), Interest: Math.round(yr.interest) }));
      const donut = { type: "donut", data: [{ name: "Principal", value: p }, { name: "Interest", value: Math.round(totalInterest) }], keys: ["value"] };
      const stats = [
        { label: "Monthly EMI", value: fm(Math.round(emi + extraPmt)) },
        { label: "Total Interest", value: fm(Math.round(totalInterest)), warn: true },
        { label: "Total Amount", value: fm(Math.round(totalInterest + p)) },
        { label: "Payoff Date", value: payoffDate.toLocaleDateString("en-US", { month: "long", year: "numeric" }) },
        extraPmt > 0 ? { label: "Interest Saved", value: fm(Math.round(intSaved)), highlight: true } : null,
        extraPmt > 0 ? { label: "Months Saved", value: monthsSaved + " months", highlight: true } : null,
        compareRate ? { label: "EMI @ " + compareRate + "%", value: fm(Math.round(compareEMI)) } : null,
        compareRate ? { label: "Monthly Savings", value: fm(Math.round(compareEMI - emi)), highlight: true } : null,
      ].filter(Boolean);
      const tips = extraPmt > 0
        ? [{ type: "tip", msg: "Extra " + fm(extraPmt) + "/mo saves " + fm(Math.round(intSaved)) + " and pays off " + (monthsSaved / 12).toFixed(1) + " years early!" }]
        : [{ type: "tip", msg: "Add an extra payment to see how much interest you can save. Even small amounts make a big difference!" }];
      setRes(buildResult("Monthly EMI", fm(Math.round(emi + extraPmt)), stats, tips, donut, [
        { label: "Loan Amount", value: fm(p) },
        { label: "Annual Rate", value: r + "%" },
        { label: "Term", value: y + " years (" + n + " months)" },
        { label: "Interest-to-Principal Ratio", value: (totalInterest / p * 100).toFixed(0) + "%" },
      ]));
    }, 100);
    return () => clearTimeout(timer);
  }, [p, r, y, extra, compareRate]);

  const exportCSV = () => {
    const csv = "Month,Year,Payment,Principal,Interest,Balance\\n" + schedule.map(row => [row.month, row.year, row.payment.toFixed(2), row.principal.toFixed(2), row.interest.toFixed(2), row.balance.toFixed(2)].join(",")).join("\\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "emi-schedule.csv"; a.click(); URL.revokeObjectURL(url);
  };
  const copyCSV = () => {
    const csv = schedule.slice(0, 12).map(row => row.month + "," + row.payment.toFixed(0) + "," + row.principal.toFixed(0) + "," + row.interest.toFixed(0) + "," + row.balance.toFixed(0)).join("\\n");
    navigator.clipboard.writeText("Month,Payment,Principal,Interest,Balance\\n" + csv).then(() => { setCopiedMsg("Copied!"); setTimeout(() => setCopiedMsg(""), 2000); });
  };
  const displayRows = viewMode === "yearly" ? yearlySchedule : schedule;
  const visibleRows = showAll ? displayRows : displayRows.slice(0, viewMode === "yearly" ? 10 : 12);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Presets items={[
            { label: "Home Loan 20yr", v: { p: 5000000, r: 8.5, y: 20, e: 0 } },
            { label: "Car Loan 5yr", v: { p: 800000, r: 9.0, y: 5, e: 0 } },
            { label: "Personal 3yr", v: { p: 200000, r: 14.0, y: 3, e: 0 } },
          ]} onApply={pr => { setP(pr.v.p); setR(pr.v.r); setY(pr.v.y); setExtra(String(pr.v.e)); setShowAll(false); }} />
          <Sl label="Loan Amount" id="emi_p" min={10000} max={10000000} step={10000} value={p} onChange={v => { setP(v); setShowAll(false); }} fmt={v => fmSlider(v)} />
          <Sl label="Annual Interest Rate" id="emi_r" min={5} max={25} step={0.1} value={r} onChange={setR} fmt={v => v + "%"} />
          <Sl label="Loan Term" id="emi_y" min={1} max={30} value={y} onChange={v => { setY(v); setShowAll(false); }} fmt={v => v + " yrs"} />
          <N label="Extra Monthly Payment" id="emi_ex" value={extra} onChange={v => { setExtra(v); setShowAll(false); }} unit={sym} placeholder="0" hint="Goes 100% to principal" />
          <N label="Compare at Rate (%)" id="emi_cr" value={compareRate} onChange={setCompareRate} unit="%" placeholder="e.g. 7.5" hint="See EMI at a different rate" />
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="EMI" /></div>
      </div>
      {schedule.length > 0 && (
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "var(--r-xl)", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderBottom: "1px solid var(--border)", background: "var(--surface2)", flexWrap: "wrap", gap: 8 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Repayment Schedule</p>
              <p style={{ fontSize: 12, color: "var(--text3)" }}>{schedule.length} months · Payoff: {summary && summary.payoffDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })}</p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <div style={{ display: "flex", border: "1.5px solid var(--border)", borderRadius: "var(--r-md)", overflow: "hidden" }}>
                {["yearly", "monthly"].map(v => (
                  <button key={v} onClick={() => { setViewMode(v); setShowAll(false); }} style={{ padding: "6px 12px", fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", background: viewMode === v ? "var(--brand)" : "transparent", color: viewMode === v ? "#fff" : "var(--text2)" }}>{v === "yearly" ? "Yearly" : "Monthly"}</button>
                ))}
              </div>
              <button onClick={copyCSV} style={{ fontSize: 11, fontWeight: 700, padding: "6px 12px", borderRadius: "var(--r-md)", border: "1.5px solid var(--border)", background: "var(--surface)", color: copiedMsg ? "var(--success)" : "var(--brand)", cursor: "pointer" }}>{copiedMsg || "Copy CSV"}</button>
              <button onClick={exportCSV} style={{ fontSize: 11, fontWeight: 700, padding: "6px 12px", borderRadius: "var(--r-md)", border: "1.5px solid var(--border)", background: "var(--surface)", color: "var(--text2)", cursor: "pointer" }}>Download CSV</button>
            </div>
          </div>
          {summary && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", borderBottom: "1px solid var(--border)" }}>
              {[{ label: "Monthly EMI", value: fm(Math.round(summary.emi + summary.extraPmt)), color: "var(--brand)" }, { label: "Principal", value: fm(p), color: "var(--success)" }, { label: "Total Interest", value: fm(Math.round(summary.totalInterest)), color: "#ef4444" }, { label: "Total Payable", value: fm(Math.round(p + summary.totalInterest)), color: "var(--text)" }].map((s, i) => (
                <div key={i} style={{ padding: "10px 14px", borderRight: i < 3 ? "1px solid var(--border)" : "none", textAlign: "center" }}>
                  <p style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>{s.label}</p>
                  <p style={{ fontSize: 14, fontWeight: 800, color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>
          )}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--surface2)" }}>
                  {(viewMode === "yearly" ? ["Year", "Payment", "Principal", "Interest", "Balance", "Prin %"] : ["Month", "Payment", "Principal", "Interest", "Balance"]).map((h, hi) => (
                    <th key={h} style={{ padding: "9px 14px", textAlign: hi === 0 ? "center" : "right", fontWeight: 700, color: "var(--text2)", fontSize: 11, textTransform: "uppercase", borderBottom: "2px solid var(--border)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row, i) => {
                  const prinPct = row.principal / (row.interest + row.principal) * 100;
                  return (
                    <tr key={viewMode === "yearly" ? row.year : row.month} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.015)" }}>
                      <td style={{ padding: "8px 14px", textAlign: "center", color: "var(--text3)", fontWeight: 700, fontSize: 12 }}>{viewMode === "yearly" ? "Yr " + row.year : row.month}</td>
                      <td style={{ padding: "8px 14px", textAlign: "right", color: "var(--text)", fontWeight: 600 }}>{fm(viewMode === "yearly" ? row.payment : Math.round(row.payment))}</td>
                      <td style={{ padding: "8px 14px", textAlign: "right", color: "var(--success)", fontWeight: 700 }}>{fm(viewMode === "yearly" ? row.principal : Math.round(row.principal))}</td>
                      <td style={{ padding: "8px 14px", textAlign: "right", color: "#ef4444", fontWeight: 700 }}>{fm(viewMode === "yearly" ? row.interest : Math.round(row.interest))}</td>
                      <td style={{ padding: "8px 14px", textAlign: "right", color: "var(--text)", fontWeight: 600 }}>{fm(viewMode === "yearly" ? row.balance : Math.round(row.balance))}</td>
                      {viewMode === "yearly" && (
                        <td style={{ padding: "8px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ flex: 1, height: 5, borderRadius: 99, background: "rgba(239,68,68,0.15)", overflow: "hidden" }}>
                              <div style={{ height: "100%", width: prinPct.toFixed(0) + "%", background: "var(--success)", borderRadius: 99 }} />
                            </div>
                            <span style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700 }}>{prinPct.toFixed(0)}%</span>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {displayRows.length > (viewMode === "yearly" ? 10 : 12) && (
            <div style={{ padding: "12px", textAlign: "center", borderTop: "1px solid var(--border)", background: "var(--surface2)" }}>
              <button onClick={() => setShowAll(!showAll)} style={{ fontSize: 13, fontWeight: 700, color: "var(--brand)", background: "transparent", border: "1.5px solid var(--brand)", borderRadius: "var(--r-md)", padding: "7px 20px", cursor: "pointer" }}>
                {showAll ? "Collapse" : "Show All " + displayRows.length + (viewMode === "yearly" ? " Years" : " Months")}
              </button>
            </div>
          )}
        </div>
      )}
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>How EMI is Calculated</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75, marginBottom: 16 }}>EMI (Equated Monthly Instalment) is the fixed monthly payment you make to repay a loan over a specified period. The formula is: <strong>EMI = P × r × (1+r)^n / [(1+r)^n - 1]</strong> where P = principal, r = monthly interest rate, n = total months.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 12 }}>
          {[{ icon: "📉", title: "Front-loaded Interest", desc: "In early months, most of EMI goes to interest. As loan matures, principal portion grows significantly." }, { icon: "⚡", title: "Extra Payment Power", desc: "Extra payments go directly to principal, saving thousands in interest and months off your loan." }, { icon: "📊", title: "Rate Comparison", desc: "Use the Compare Rate field to see how much you save if you refinance to a lower interest rate." }, { icon: "📤", title: "Export Schedule", desc: "Download the full repayment schedule as CSV for your records, budgeting, or tax filing purposes." }].map((c, i) => (
            <div key={i} style={{ padding: "12px", background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{c.icon}</div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{c.title}</p>
              <p style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.6 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

`;

const COMPOUND_FORM = `// ── Compound Interest Calculator ─────────────────────────────────────
export function CompoundForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);
  const [freq, setFreq] = useState("12");
  const [monthly, setMonthly] = useState("0");
  const [inflation, setInflation] = useState("0");
  const [taxRate, setTaxRate] = useState("0");
  const [tab, setTab] = useState("Compound");
  const [cagr_start, setCagrStart] = useState("100000");
  const [cagr_end, setCagrEnd] = useState("200000");
  const [cagr_yrs, setCagrYrs] = useState("10");
  const [res, setRes] = useState(null);
  const [tableRows, setTableRows] = useState([]);

  useEffect(() => {
    if (tab === "CAGR") {
      const s = +cagr_start, e = +cagr_end, y = +cagr_yrs;
      if (!s || !e || !y) return;
      const cagr = (Math.pow(e / s, 1 / y) - 1) * 100;
      setRes(buildResult("CAGR", cagr.toFixed(2) + "%",
        [{ label: "Start Value", value: fm(s) }, { label: "End Value", value: fm(e) }, { label: "Years", value: y }, { label: "Total Growth", value: ((e - s) / s * 100).toFixed(1) + "%" }],
        [{ type: "tip", msg: "A CAGR of " + cagr.toFixed(2) + "% means your investment doubled every " + (72 / cagr).toFixed(1) + " years (Rule of 72)." }],
        null, []));
      return;
    }
    const n = +freq, P = principal, r = rate / 100, mon = +monthly || 0;
    if (!P || !rate || !years) return;
    const rows = [];
    let bal = P, totalContrib = P, totalInt = 0;
    for (let yr = 1; yr <= years; yr++) {
      const prevBal = bal;
      for (let mo = 1; mo <= 12; mo++) {
        bal = bal * (1 + r / n) + mon;
      }
      const yearInt = bal - prevBal - mon * 12;
      totalInt += yearInt;
      totalContrib += mon * 12;
      rows.push({ year: yr, balance: Math.round(bal), interest: Math.round(yearInt), contributions: Math.round(totalContrib), totalInt: Math.round(totalInt) });
    }
    setTableRows(rows);
    const afterTax = taxRate ? bal - (bal - P - mon * 12 * years) * (+taxRate / 100) : bal;
    const realValue = inflation ? afterTax / Math.pow(1 + +inflation / 100, years) : afterTax;
    const freqLabels = { "1": "Annual", "4": "Quarterly", "12": "Monthly", "365": "Daily" };
    const freqComp = ["1", "4", "12", "365"].map(f => {
      let b = P;
      for (let yr = 0; yr < years; yr++) for (let mo = 0; mo < +f; mo++) { b = b * (1 + r / +f) + mon * (12 / +f); }
      return { name: freqLabels[f] || f, value: Math.round(b) };
    });
    const chart = { type: "area", data: rows.map(row => ({ year: "Yr " + row.year, Invested: row.contributions, Balance: row.balance })), keys: ["Invested", "Balance"] };
    setRes(buildResult("Final Amount", fm(Math.round(afterTax)),
      [
        { label: "Initial Principal", value: fm(P) },
        { label: "Total Contributed", value: fm(Math.round(P + mon * 12 * years)) },
        { label: "Total Interest Earned", value: fm(Math.round(totalInt)), highlight: true },
        { label: "Effective Multiplier", value: (afterTax / P).toFixed(2) + "x" },
        inflation ? { label: "Inflation-Adjusted Real Value", value: fm(Math.round(realValue)) } : null,
        taxRate ? { label: "After-Tax Amount", value: fm(Math.round(afterTax)) } : null,
      ].filter(Boolean),
      [{ type: "tip", msg: "At " + rate + "% compounded " + (freqLabels[freq] || "").toLowerCase() + ", your money grows " + (afterTax / P).toFixed(1) + "x in " + years + " years. Start early — time is your biggest advantage!" }],
      chart,
      [{ label: "Compounding", value: freqLabels[freq] || freq + "x/yr" }, { label: "Monthly Addition", value: fm(mon) }, { label: "Frequency Comparison", value: "Annual=" + fm(freqComp[0].value) + " vs Daily=" + fm(freqComp[3].value) }]
    ));
  }, [principal, rate, years, freq, monthly, inflation, taxRate, tab, cagr_start, cagr_end, cagr_yrs]);

  return (
    <div className="space-y-6">
      <Tabs tabs={["Compound", "CAGR Solver"]} active={tab} onChange={setTab} />
      {tab === "CAGR" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <N label="Start Value" id="ci_cs" value={cagr_start} onChange={setCagrStart} unit={sym} placeholder="100000" hint="Initial investment value" />
            <N label="End Value" id="ci_ce" value={cagr_end} onChange={setCagrEnd} unit={sym} placeholder="200000" hint="Final value after growth" />
            <N label="Number of Years" id="ci_cy" value={cagr_yrs} onChange={setCagrYrs} unit="yrs" placeholder="10" hint="Duration of investment" />
          </div>
          <div className="sticky-res"><Panel result={res} loading={null} label="CAGR" /></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Presets items={[
              { label: "Conservative 5%", v: { p: 100000, r: 5, y: 10, f: "12", m: 0 } },
              { label: "Moderate 8%", v: { p: 100000, r: 8, y: 15, f: "12", m: 5000 } },
              { label: "Aggressive 12%", v: { p: 50000, r: 12, y: 20, f: "12", m: 10000 } },
            ]} onApply={pr => { setPrincipal(pr.v.p); setRate(pr.v.r); setYears(pr.v.y); setFreq(pr.v.f); setMonthly(String(pr.v.m)); }} />
            <Sl label="Principal Amount" id="ci_p" min={1000} max={5000000} step={1000} value={principal} onChange={setPrincipal} fmt={v => fmSlider(v)} />
            <Sl label="Annual Interest Rate" id="ci_r" min={1} max={25} step={0.25} value={rate} onChange={setRate} fmt={v => v + "%"} />
            <Sl label="Time Period" id="ci_y" min={1} max={40} value={years} onChange={setYears} fmt={v => v + " yrs"} />
            <Sel label="Compounding Frequency" id="ci_f" value={freq} onChange={setFreq} opts={[{ v: "1", l: "Annually" }, { v: "4", l: "Quarterly" }, { v: "12", l: "Monthly" }, { v: "365", l: "Daily" }]} />
            <N label="Monthly Contribution" id="ci_m" value={monthly} onChange={setMonthly} unit={sym} placeholder="0" hint="Added each month to principal" />
            <N label="Inflation Rate (%)" id="ci_inf" value={inflation} onChange={setInflation} unit="%" placeholder="0" hint="Show real inflation-adjusted value" />
            <N label="Tax on Gains (%)" id="ci_tax" value={taxRate} onChange={setTaxRate} unit="%" placeholder="0" hint="Capital gains tax rate" />
          </div>
          <div className="sticky-res"><Panel result={res} loading={null} label="Compound Interest" /></div>
        </div>
      )}
      {tableRows.length > 0 && tab !== "CAGR" && (
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "var(--r-xl)", overflow: "hidden" }}>
          <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", background: "var(--surface2)" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Year-by-Year Breakdown</p>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--surface2)" }}>
                  {["Year", "Balance", "Interest Earned", "Total Invested", "Total Interest"].map((h, hi) => (
                    <th key={h} style={{ padding: "9px 14px", textAlign: hi === 0 ? "center" : "right", fontWeight: 700, color: "var(--text2)", fontSize: 11, textTransform: "uppercase", borderBottom: "2px solid var(--border)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr key={row.year} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.015)" }}>
                    <td style={{ padding: "8px 14px", textAlign: "center", color: "var(--text3)", fontWeight: 700 }}>Year {row.year}</td>
                    <td style={{ padding: "8px 14px", textAlign: "right", color: "var(--brand)", fontWeight: 700 }}>{fm(row.balance)}</td>
                    <td style={{ padding: "8px 14px", textAlign: "right", color: "var(--success)", fontWeight: 600 }}>{fm(row.interest)}</td>
                    <td style={{ padding: "8px 14px", textAlign: "right", color: "var(--text)", fontWeight: 600 }}>{fm(row.contributions)}</td>
                    <td style={{ padding: "8px 14px", textAlign: "right", color: "#ef4444", fontWeight: 600 }}>{fm(row.totalInt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>The Power of Compound Interest</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75, marginBottom: 14 }}>Compound interest means you earn interest on your interest. Over time, this creates exponential growth. Einstein reportedly called it the "eighth wonder of the world." Formula: <strong>A = P(1 + r/n)^(nt)</strong> where P = principal, r = annual rate, n = compounds per year, t = years.</p>
        <div style={{ padding: "12px 16px", background: "rgba(99,102,241,0.06)", borderRadius: "var(--r-lg)", border: "1px solid rgba(99,102,241,0.2)" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--brand)", marginBottom: 6 }}>Rule of 72: Quick Doubling Estimation</p>
          <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>Divide 72 by your interest rate to estimate how many years it takes to double your money. At 8% → 9 years. At 12% → 6 years. The more frequently compounding occurs, the faster your money grows.</p>
        </div>
      </div>
    </div>
  );
}

`;

const content = HEADER + EMI_FORM + COMPOUND_FORM;
writeFileSync('src/components/calculator-core/forms/CoreFinanceForms.jsx', content, 'utf8');
console.log('Part 1 written. Lines:', content.split('\\n').length);
