import { useState, useEffect, useRef } from "react";
import { L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency } from "./SharedComponents.jsx";
import { ScenarioCompare } from "@/components/calculator-core/ScenarioCompare.jsx";

// ── EMI Calculator ──────────────────────────────────────────────────
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
    const csv = "Month,Year,Payment,Principal,Interest,Balance\n" + schedule.map(row => [row.month, row.year, row.payment.toFixed(2), row.principal.toFixed(2), row.interest.toFixed(2), row.balance.toFixed(2)].join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "emi-schedule.csv"; a.click(); URL.revokeObjectURL(url);
  };
  const copyCSV = () => {
    const csv = schedule.slice(0, 12).map(row => row.month + "," + row.payment.toFixed(0) + "," + row.principal.toFixed(0) + "," + row.interest.toFixed(0) + "," + row.balance.toFixed(0)).join("\n");
    navigator.clipboard.writeText("Month,Payment,Principal,Interest,Balance\n" + csv).then(() => { setCopiedMsg("Copied!"); setTimeout(() => setCopiedMsg(""), 2000); });
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

// ── Compound Interest Calculator ─────────────────────────────────────
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

// ── SIP Calculator ───────────────────────────────────────────────────
export function SIPForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [sip, setSip] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [stepUp, setStepUp] = useState("0");
  const [lumpSum, setLumpSum] = useState("0");
  const [inflation, setInflation] = useState("0");
  const [pauseMonths, setPauseMonths] = useState("0");
  const [tab, setTab] = useState("SIP");
  const [res, setRes] = useState(null);
  const [tableRows, setTableRows] = useState([]);

  useEffect(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    const stepPct = +stepUp / 100;
    const LS = +lumpSum || 0;
    const inf = +inflation / 100;
    const pause = +pauseMonths || 0;
    if (!sip || !rate || !years) return;
    let bal = LS, totalInvested = LS, currentSip = sip;
    const rows = [];
    for (let yr = 1; yr <= years; yr++) {
      const yearStart = bal;
      for (let mo = 1; mo <= 12; mo++) {
        const globalMo = (yr - 1) * 12 + mo;
        const isPaused = pause > 0 && globalMo > years * 12 - pause * 12;
        if (!isPaused) { bal = bal * (1 + r) + currentSip; totalInvested += currentSip; }
        else { bal = bal * (1 + r); }
      }
      if (stepPct > 0) currentSip = currentSip * (1 + stepPct);
      rows.push({ year: yr, balance: Math.round(bal), invested: Math.round(totalInvested), growth: Math.round(bal - totalInvested) });
    }
    setTableRows(rows);
    const maturity = Math.round(bal);
    const invested = Math.round(totalInvested);
    const wealthGained = maturity - invested;
    const realValue = inf > 0 ? Math.round(maturity / Math.pow(1 + inf, years)) : maturity;
    const benchmarks = [
      { name: "Equity (12%)", value: Math.round(computeSIP(sip, 12, years, LS)) },
      { name: "Balanced (9%)", value: Math.round(computeSIP(sip, 9, years, LS)) },
      { name: "Debt (6.5%)", value: Math.round(computeSIP(sip, 6.5, years, LS)) },
    ];
    function computeSIP(s, rt, y, ls) {
      const rv = rt / 100 / 12, nn = y * 12; let b = ls;
      for (let i = 0; i < nn; i++) b = b * (1 + rv) + s; return b;
    }
    const chart = { type: "area", data: rows.map(row => ({ year: "Yr " + row.year, Invested: row.invested, Balance: row.balance })), keys: ["Invested", "Balance"] };
    setRes(buildResult("Maturity Value", fm(maturity),
      [
        { label: "Total Invested", value: fm(invested) },
        { label: "Wealth Gained", value: fm(wealthGained), highlight: true },
        { label: "Return Multiple", value: (maturity / invested).toFixed(2) + "x" },
        inf > 0 ? { label: "Inflation-Adjusted Value", value: fm(realValue) } : null,
        stepPct > 0 ? { label: "Final Monthly SIP", value: fm(Math.round(sip * Math.pow(1 + stepPct, years - 1))) } : null,
        pause > 0 ? { label: "Pause Impact", value: "Last " + pause + " yrs paused" } : null,
      ].filter(Boolean),
      [{ type: "tip", msg: "Starting with " + fm(sip) + "/mo at " + rate + "%, your " + fm(invested) + " invested grows to " + fm(maturity) + " — a " + (wealthGained / invested * 100).toFixed(0) + "% gain! Step-up annually to grow faster." }],
      chart,
      [{ label: "Benchmark Equity (12%)", value: fm(benchmarks[0].value) }, { label: "Benchmark Balanced (9%)", value: fm(benchmarks[1].value) }, { label: "Benchmark Debt (6.5%)", value: fm(benchmarks[2].value) }]
    ));
  }, [sip, rate, years, stepUp, lumpSum, inflation, pauseMonths]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Presets items={[
            { label: "Starter 3K×10yr", v: { s: 3000, r: 12, y: 10, st: 0, ls: 0 } },
            { label: "Mid 10K×15yr", v: { s: 10000, r: 11, y: 15, st: 10, ls: 50000 } },
            { label: "Aggressive 25K×20yr", v: { s: 25000, r: 13, y: 20, st: 15, ls: 100000 } },
          ]} onApply={pr => { setSip(pr.v.s); setRate(pr.v.r); setYears(pr.v.y); setStepUp(String(pr.v.st)); setLumpSum(String(pr.v.ls)); }} />
          <Sl label="Monthly SIP Amount" id="sip_s" min={500} max={200000} step={500} value={sip} onChange={setSip} fmt={v => fmSlider(v)} />
          <Sl label="Expected Return (% p.a.)" id="sip_r" min={5} max={25} step={0.5} value={rate} onChange={setRate} fmt={v => v + "%"} />
          <Sl label="Investment Duration" id="sip_y" min={1} max={40} value={years} onChange={setYears} fmt={v => v + " yrs"} />
          <N label="Lump Sum Investment" id="sip_ls" value={lumpSum} onChange={setLumpSum} unit={sym} placeholder="0" hint="One-time initial investment" />
          <N label="Annual Step-Up (%)" id="sip_su" value={stepUp} onChange={setStepUp} unit="%" placeholder="0" hint="Increase SIP by this % each year" />
          <N label="Inflation Rate (%)" id="sip_inf" value={inflation} onChange={setInflation} unit="%" placeholder="0" hint="Show real inflation-adjusted value" />
          <N label="Pause Duration (years)" id="sip_pause" value={pauseMonths} onChange={setPauseMonths} unit="yrs" placeholder="0" hint="Simulate SIP pause at end of term" />
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="SIP" /></div>
      </div>
      {tableRows.length > 0 && (
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "var(--r-xl)", overflow: "hidden" }}>
          <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", background: "var(--surface2)" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Year-wise SIP Growth</p>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--surface2)" }}>
                  {["Year", "Balance", "Total Invested", "Wealth Gained", "Returns %"].map((h, hi) => <th key={h} style={{ padding: "9px 14px", textAlign: hi === 0 ? "center" : "right", fontWeight: 700, color: "var(--text2)", fontSize: 11, textTransform: "uppercase", borderBottom: "2px solid var(--border)" }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr key={row.year} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.015)" }}>
                    <td style={{ padding: "8px 14px", textAlign: "center", color: "var(--text3)", fontWeight: 700 }}>Yr {row.year}</td>
                    <td style={{ padding: "8px 14px", textAlign: "right", color: "var(--brand)", fontWeight: 700 }}>{fm(row.balance)}</td>
                    <td style={{ padding: "8px 14px", textAlign: "right", color: "var(--text)", fontWeight: 600 }}>{fm(row.invested)}</td>
                    <td style={{ padding: "8px 14px", textAlign: "right", color: "var(--success)", fontWeight: 700 }}>{fm(row.growth)}</td>
                    <td style={{ padding: "8px 14px", textAlign: "right", color: "var(--text3)", fontWeight: 600 }}>{(row.growth / row.invested * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>What Is a SIP?</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75, marginBottom: 14 }}>A Systematic Investment Plan (SIP) lets you invest a fixed amount in mutual funds every month. It leverages rupee-cost averaging and compound interest to build long-term wealth. Formula: <strong>M = P × [(1+r)^n - 1] / r × (1+r)</strong></p>
        <div style={{ padding: "12px 16px", background: "rgba(99,102,241,0.06)", borderRadius: "var(--r-lg)", border: "1px solid rgba(99,102,241,0.2)" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--brand)", marginBottom: 6 }}>SIP Pro Tips</p>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {["Step-up your SIP by 10-15% every year to match salary growth.", "Never stop SIP during market downturns — you buy more units at lower prices.", "Lump sum + monthly SIP combo gives the best of both worlds.", "Start early — even 5 years earlier can double your corpus."].map((t, i) => <li key={i} style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.7, marginBottom: 3 }}>{t}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ── Simple Interest Calculator ───────────────────────────────────────
export function SimpleInterestForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [principal, setPrincipal] = useState(50000);
  const [rate, setRate] = useState(10);
  const [time, setTime] = useState(2);
  const [unit, setUnit] = useState("years");
  const [tab, setTab] = useState("SI");
  const [targetSI, setTargetSI] = useState("");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const years = unit === "years" ? time : unit === "months" ? time / 12 : time / 365;
    if (tab === "RateFinder") {
      if (!principal || !targetSI || !years) return;
      const requiredRate = (+targetSI / (principal * years)) * 100;
      setRes(buildResult("Required Rate", requiredRate.toFixed(2) + "%",
        [{ label: "Principal", value: fm(principal) }, { label: "Target SI", value: fm(+targetSI) }, { label: "Duration", value: time + " " + unit }, { label: "Total Amount", value: fm(principal + +targetSI) }],
        [{ type: "tip", msg: "To earn " + fm(+targetSI) + " in SI over " + time + " " + unit + " on " + fm(principal) + ", you need a " + requiredRate.toFixed(2) + "% annual rate." }],
        null, []));
      return;
    }
    if (!principal || !rate || !time) return;
    const si = (principal * rate * years) / 100;
    const total = principal + si;
    const compoundTotal = principal * Math.pow(1 + rate / 100, years);
    const diffVsCompound = compoundTotal - total;
    const emiEquivalent = total / (years * 12);
    const chart = { type: "bar", data: [{ name: "Principal", value: Math.round(principal) }, { name: "Simple Interest", value: Math.round(si) }, { name: "Compound Interest", value: Math.round(compoundTotal - principal) }], keys: ["value"] };
    setRes(buildResult("Simple Interest", fm(Math.round(si)),
      [
        { label: "Total Amount", value: fm(Math.round(total)) },
        { label: "Interest Rate", value: rate + "% p.a." },
        { label: "Duration", value: time + " " + unit },
        { label: "CI would earn extra", value: fm(Math.round(diffVsCompound)), warn: true },
        { label: "EMI Equivalent", value: fm(Math.round(emiEquivalent)) + "/mo" },
      ],
      [{ type: "tip", msg: "Using Compound Interest instead of Simple Interest, you would earn " + fm(Math.round(diffVsCompound)) + " more over " + time + " " + unit + "." }],
      chart,
      [{ label: "Principal", value: fm(principal) }, { label: "Rate p.a.", value: rate + "%" }, { label: "Time", value: time + " " + unit }]
    ));
  }, [principal, rate, time, unit, tab, targetSI]);

  return (
    <div className="space-y-6">
      <Tabs tabs={["SI Calculator", "Rate Finder"]} active={tab} onChange={setTab} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Presets items={[
            { label: "Short-term 6mo", v: { p: 10000, r: 8, t: 6, u: "months" } },
            { label: "Medium 2yr", v: { p: 50000, r: 10, t: 2, u: "years" } },
            { label: "Long-term 5yr", v: { p: 200000, r: 7, t: 5, u: "years" } },
          ]} onApply={pr => { setPrincipal(pr.v.p); setRate(pr.v.r); setTime(pr.v.t); setUnit(pr.v.u); }} />
          <Sl label="Principal Amount" id="si_p" min={1000} max={5000000} step={1000} value={principal} onChange={setPrincipal} fmt={v => fmSlider(v)} />
          {tab !== "RateFinder" && <Sl label="Interest Rate (% p.a.)" id="si_r" min={1} max={30} step={0.25} value={rate} onChange={setRate} fmt={v => v + "%"} />}
          <Sl label={"Time Period (" + unit + ")"} id="si_t" min={1} max={unit === "years" ? 30 : unit === "months" ? 360 : 3650} value={time} onChange={setTime} fmt={v => v + " " + unit} />
          <Sel label="Time Unit" id="si_u" value={unit} onChange={setUnit} opts={[{ v: "years", l: "Years" }, { v: "months", l: "Months" }, { v: "days", l: "Days" }]} />
          {tab === "RateFinder" && <N label="Target Simple Interest" id="si_tgt" value={targetSI} onChange={setTargetSI} unit={sym} placeholder="5000" hint="Interest amount you want to earn" />}
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="Simple Interest" /></div>
      </div>
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>Simple vs Compound Interest</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75 }}>Simple Interest: <strong>SI = (P × R × T) / 100</strong> — interest is only on the principal. Compound Interest grows exponentially since you earn interest on interest too. For borrowers, simple interest is better. For investors, compound interest builds wealth faster.</p>
      </div>
    </div>
  );
}

// ── ROI Calculator ───────────────────────────────────────────────────
export function ROIForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [initial, setInitial] = useState(100000);
  const [finalVal, setFinalVal] = useState(145000);
  const [years, setYears] = useState(3);
  const [tab, setTab] = useState("Single");
  const [investments, setInvestments] = useState([
    { id: 1, name: "Stock A", initial: 50000, final: 75000, years: 2 },
    { id: 2, name: "Real Estate", initial: 500000, final: 650000, years: 4 },
  ]);
  const [res, setRes] = useState(null);

  useEffect(() => {
    if (tab === "Portfolio") {
      const total = investments.reduce((acc, inv) => {
        const roi = (inv.final - inv.initial) / inv.initial * 100;
        const cagr = inv.years > 0 ? (Math.pow(inv.final / inv.initial, 1 / inv.years) - 1) * 100 : 0;
        return { totalInitial: acc.totalInitial + inv.initial, totalFinal: acc.totalFinal + inv.final, roiSum: acc.roiSum + roi, count: acc.count + 1 };
      }, { totalInitial: 0, totalFinal: 0, roiSum: 0, count: 0 });
      const blendedROI = (total.totalFinal - total.totalInitial) / total.totalInitial * 100;
      const chartData = investments.map(inv => ({ name: inv.name, ROI: +((inv.final - inv.initial) / inv.initial * 100).toFixed(1) }));
      setRes(buildResult("Portfolio ROI", blendedROI.toFixed(2) + "%",
        [{ label: "Total Invested", value: fm(total.totalInitial) }, { label: "Total Final Value", value: fm(total.totalFinal) }, { label: "Net Profit", value: fm(total.totalFinal - total.totalInitial), highlight: true }, { label: "Blended ROI", value: blendedROI.toFixed(2) + "%" }],
        [{ type: "tip", msg: "Your blended portfolio ROI is " + blendedROI.toFixed(1) + "%. Diversification across assets reduces risk while maintaining returns." }],
        { type: "bar", data: chartData, keys: ["ROI"] }, []));
      return;
    }
    if (!initial || !finalVal) return;
    const profit = finalVal - initial;
    const roi = profit / initial * 100;
    const cagr = years > 0 ? (Math.pow(finalVal / initial, 1 / years) - 1) * 100 : roi;
    const doubleTime = roi > 0 ? 72 / cagr : null;
    const benchmarks = [{ name: "Your ROI", value: +roi.toFixed(1) }, { name: "S&P 500 (10%)", value: +(((Math.pow(1.1, years) - 1) * 100)).toFixed(1) }, { name: "Gold (7%)", value: +(((Math.pow(1.07, years) - 1) * 100)).toFixed(1) }, { name: "FD (6.5%)", value: +(((Math.pow(1.065, years) - 1) * 100)).toFixed(1) }];
    const chart = { type: "bar", data: benchmarks, keys: ["value"] };
    setRes(buildResult(profit >= 0 ? "Net Profit" : "Net Loss", fm(Math.abs(profit)),
      [
        { label: "ROI", value: roi.toFixed(2) + "%", highlight: profit > 0 },
        { label: "Annualized CAGR", value: cagr.toFixed(2) + "% p.a." },
        { label: "Initial Investment", value: fm(initial) },
        { label: "Final Value", value: fm(finalVal) },
        doubleTime ? { label: "Break-even to Double", value: doubleTime.toFixed(1) + " yrs at this rate" } : null,
      ].filter(Boolean),
      [{ type: profit > 0 ? "tip" : "warn", msg: profit > 0 ? "Your " + years + "-year CAGR of " + cagr.toFixed(2) + "% " + (cagr > 10 ? "beats the S&P 500 average! Outstanding performance." : "is steady. S&P 500 averages ~10% annually.") : "This investment resulted in a loss of " + roi.toFixed(1) + "%. Consider diversifying." }],
      chart, [{ label: "Investment Period", value: years + " years" }, { label: "Return Multiple", value: (finalVal / initial).toFixed(2) + "x" }]
    ));
  }, [initial, finalVal, years, tab, investments]);

  const updateInvestment = (id, field, value) => setInvestments(prev => prev.map(inv => inv.id === id ? { ...inv, [field]: field === "name" ? value : +value } : inv));
  const addInvestment = () => setInvestments(prev => [...prev, { id: Date.now(), name: "Investment " + (prev.length + 1), initial: 50000, final: 60000, years: 2 }]);
  const removeInvestment = (id) => setInvestments(prev => prev.filter(inv => inv.id !== id));

  return (
    <div className="space-y-6">
      <Tabs tabs={["Single Investment", "Portfolio"]} active={tab} onChange={setTab} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {tab === "Single" ? (
            <>
              <Presets items={[
                { label: "Stock Trade", v: { i: 100000, f: 145000, y: 2 } },
                { label: "Real Estate", v: { i: 5000000, f: 7500000, y: 5 } },
                { label: "FD 3yr", v: { i: 100000, f: 130000, y: 3 } },
              ]} onApply={pr => { setInitial(pr.v.i); setFinalVal(pr.v.f); setYears(pr.v.y); }} />
              <Sl label="Initial Investment" id="roi_i" min={1000} max={10000000} step={1000} value={initial} onChange={setInitial} fmt={v => fmSlider(v)} />
              <Sl label="Final Value" id="roi_f" min={1000} max={20000000} step={1000} value={finalVal} onChange={setFinalVal} fmt={v => fmSlider(v)} />
              <Sl label="Investment Period" id="roi_y" min={1} max={30} value={years} onChange={setYears} fmt={v => v + " yrs"} />
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {investments.map((inv, i) => (
                <div key={inv.id} style={{ padding: "14px", background: "var(--surface2)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <input value={inv.name} onChange={e => updateInvestment(inv.id, "name", e.target.value)} style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", background: "transparent", border: "none", outline: "none" }} />
                    {investments.length > 1 && <button onClick={() => removeInvestment(inv.id)} style={{ fontSize: 11, color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>Remove</button>}
                  </div>
                  <Row3>
                    <N label="Initial" id={"roi_pi" + inv.id} value={String(inv.initial)} onChange={v => updateInvestment(inv.id, "initial", v)} unit={sym} placeholder="50000" hint="" />
                    <N label="Final Value" id={"roi_pf" + inv.id} value={String(inv.final)} onChange={v => updateInvestment(inv.id, "final", v)} unit={sym} placeholder="70000" hint="" />
                    <N label="Years" id={"roi_py" + inv.id} value={String(inv.years)} onChange={v => updateInvestment(inv.id, "years", v)} unit="yr" placeholder="3" hint="" />
                  </Row3>
                </div>
              ))}
              {investments.length < 5 && <button onClick={addInvestment} style={{ padding: "9px", borderRadius: "var(--r-md)", border: "2px dashed var(--border)", background: "transparent", color: "var(--brand)", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>+ Add Investment</button>}
            </div>
          )}
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="ROI" /></div>
      </div>
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>ROI vs CAGR — What's the Difference?</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75 }}><strong>ROI</strong> (Return on Investment) = (Final - Initial) / Initial × 100. It's simple but ignores time. <strong>CAGR</strong> (Compound Annual Growth Rate) = (Final/Initial)^(1/years) - 1, showing the steady annual rate that would produce the same result. CAGR is better for comparing investments over different time periods.</p>
      </div>
    </div>
  );
}

// ── Discount Calculator ──────────────────────────────────────────────
export function DiscountForm() {
  const { fm, sym } = useCurrency();
  const [price, setPrice] = useState(5000);
  const [disc, setDisc] = useState(30);
  const [disc2, setDisc2] = useState("0");
  const [cost, setCost] = useState("");
  const [qty, setQty] = useState("1");
  const [tab, setTab] = useState("Discount");
  const [finalPrice, setFinalPrice] = useState("3500");
  const [res, setRes] = useState(null);

  useEffect(() => {
    if (tab === "Reverse") {
      const fp = +finalPrice;
      if (!fp || !disc) return;
      const original = fp / (1 - disc / 100);
      setRes(buildResult("Original Price", fm(Math.round(original)),
        [{ label: "Final Price", value: fm(fp) }, { label: "Discount Applied", value: disc + "%" }, { label: "Amount Saved", value: fm(Math.round(original - fp)) }],
        [{ type: "tip", msg: "If the discounted price is " + fm(fp) + " after a " + disc + "% discount, the original price was " + fm(Math.round(original)) + "." }],
        null, []));
      return;
    }
    if (!price || !disc) return;
    const d1 = disc / 100;
    const d2 = +disc2 / 100;
    const afterFirst = price * (1 - d1);
    const afterSecond = d2 > 0 ? afterFirst * (1 - d2) : afterFirst;
    const totalSaved = price - afterSecond;
    const effectiveDisc = (totalSaved / price) * 100;
    const perUnit = afterSecond;
    const totalForQty = perUnit * (+qty || 1);
    const margin = cost ? (afterSecond - +cost) / afterSecond * 100 : null;
    const chart = { type: "bar", data: [{ name: "Original", value: Math.round(price) }, { name: "After Discount", value: Math.round(afterSecond) }, { name: "Saved", value: Math.round(totalSaved) }], keys: ["value"] };
    setRes(buildResult("Discounted Price", fm(Math.round(afterSecond)),
      [
        { label: "Amount Saved", value: fm(Math.round(totalSaved)), highlight: true },
        { label: "Effective Discount", value: effectiveDisc.toFixed(1) + "%" },
        { label: "1st Discount", value: disc + "% → " + fm(Math.round(afterFirst)) },
        d2 > 0 ? { label: "2nd Discount", value: disc2 + "% → " + fm(Math.round(afterSecond)) } : null,
        qty > 1 ? { label: "Total for " + qty + " units", value: fm(Math.round(totalForQty)) } : null,
        margin !== null ? { label: "Profit Margin After Discount", value: margin.toFixed(1) + "%", warn: margin < 10 } : null,
      ].filter(Boolean),
      [{ type: margin !== null && margin < 10 ? "warn" : "tip", msg: margin !== null && margin < 10 ? "Warning: Margin is only " + margin.toFixed(1) + "% after discount. Consider a lower discount." : "You save " + fm(Math.round(totalSaved)) + " (" + effectiveDisc.toFixed(1) + "%) on this purchase!" }],
      chart,
      [{ label: "Original Price", value: fm(price) }, { label: "Stacked Discount", value: disc + "% + " + (disc2 || "0") + "%" }]
    ));
  }, [price, disc, disc2, cost, qty, tab, finalPrice]);

  return (
    <div className="space-y-6">
      <Tabs tabs={["Discount", "Reverse"]} active={tab} onChange={setTab} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Presets items={[
            { label: "Flash Sale 40%", v: { p: 5000, d: 40, d2: 0, q: 1, c: "" } },
            { label: "Seasonal 25%+10%", v: { p: 12000, d: 25, d2: 10, q: 1, c: "" } },
            { label: "Bulk 15%", v: { p: 8000, d: 15, d2: 0, q: 5, c: 5000 } },
          ]} onApply={pr => { setPrice(pr.v.p); setDisc(pr.v.d); setDisc2(String(pr.v.d2)); setQty(String(pr.v.q)); setCost(String(pr.v.c)); }} />
          {tab === "Reverse" ? (
            <>
              <Sl label="Final (Discounted) Price" id="disc_fp" min={100} max={100000} step={100} value={+finalPrice || 3500} onChange={v => setFinalPrice(String(v))} fmt={v => fmSlider(v)} />
              <Sl label="Discount Applied (%)" id="disc_d_rev" min={1} max={90} value={disc} onChange={setDisc} fmt={v => v + "%"} />
            </>
          ) : (
            <>
              <Sl label="Original Price" id="disc_p" min={100} max={500000} step={100} value={price} onChange={setPrice} fmt={v => fmSlider(v)} />
              <Sl label="Discount %" id="disc_d" min={1} max={90} value={disc} onChange={setDisc} fmt={v => v + "%"} />
              <N label="2nd Stacked Discount (%)" id="disc_d2" value={disc2} onChange={setDisc2} unit="%" placeholder="0" hint="Applied after 1st discount" />
              <N label="Quantity" id="disc_q" value={qty} onChange={setQty} unit="units" placeholder="1" hint="Calculate total for multiple units" />
              <N label="Your Cost Price" id="disc_c" value={cost} onChange={setCost} unit={sym} placeholder="Optional" hint="Check profit margin after discount" />
            </>
          )}
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="Discount" /></div>
      </div>
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>Stacked Discounts Explained</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75 }}>A 30% + 20% stacked discount is NOT 50% off. The second discount is applied to the already-reduced price. Example: $100 → 30% off = $70 → 20% off = $56. Effective discount = 44%, not 50%. Always use the effective discount to compare offers.</p>
      </div>
    </div>
  );
}

// ── Profit Margin Calculator ─────────────────────────────────────────
export function ProfitMarginForm() {
  const { fm, sym } = useCurrency();
  const [revenue, setRevenue] = useState(100000);
  const [cost, setCost] = useState(65000);
  const [tab, setTab] = useState("Margin");
  const [sellPrice, setSellPrice] = useState("149");
  const [markupPct, setMarkupPct] = useState("50");
  const [res, setRes] = useState(null);

  useEffect(() => {
    if (tab === "Markup") {
      const cp = +sellPrice ? sellPrice - sellPrice * (markupPct / 100 / (1 + markupPct / 100)) : cost;
      const sp = +sellPrice || cost * (1 + +markupPct / 100);
      const gm = ((sp - cost) / sp * 100);
      const mu = ((sp - cost) / cost * 100);
      setRes(buildResult("Selling Price", fm(Math.round(sp)),
        [{ label: "Gross Margin", value: gm.toFixed(1) + "%" }, { label: "Markup", value: mu.toFixed(1) + "%" }, { label: "Cost", value: fm(cost) }, { label: "Profit", value: fm(Math.round(sp - cost)) }],
        [{ type: gm < 20 ? "warn" : "tip", msg: gm < 20 ? "Margin of " + gm.toFixed(1) + "% is below typical healthy range (>20%). Review pricing." : "Healthy margin of " + gm.toFixed(1) + "%. Industry varies: Retail 25%, SaaS 70%, Restaurant 15%." }],
        null, []));
      return;
    }
    if (!revenue || !cost) return;
    const grossProfit = revenue - cost;
    const grossMargin = (grossProfit / revenue) * 100;
    const markup = (grossProfit / cost) * 100;
    const breakEvenUnits = cost / (grossProfit / (revenue / cost));
    const benchmarks = [{ name: "You", value: +grossMargin.toFixed(1) }, { name: "Retail avg", value: 25 }, { name: "SaaS avg", value: 70 }, { name: "Restaurant", value: 15 }];
    const chart = { type: "bar", data: benchmarks, keys: ["value"] };
    const sensitivity = [-20, -10, 0, 10, 20].map(change => {
      const newRev = revenue * (1 + change / 100);
      return { change: (change >= 0 ? "+" : "") + change + "%", margin: ((newRev - cost) / newRev * 100).toFixed(1) + "%" };
    });
    setRes(buildResult("Gross Margin", grossMargin.toFixed(2) + "%",
      [
        { label: "Revenue", value: fm(revenue) },
        { label: "Cost of Goods", value: fm(cost) },
        { label: "Gross Profit", value: fm(grossProfit), highlight: true },
        { label: "Markup %", value: markup.toFixed(2) + "%" },
        { label: "Break-even Revenue", value: fm(Math.round(cost)) },
      ],
      [{ type: grossMargin < 15 ? "warn" : "tip", msg: grossMargin < 15 ? "Margin of " + grossMargin.toFixed(1) + "% is low. Industry benchmarks: Retail 25%, SaaS 70%, Restaurant 15%." : "Solid margin of " + grossMargin.toFixed(1) + "%. Each 1% improvement on " + fm(revenue) + " revenue = " + fm(Math.round(revenue * 0.01)) + " extra profit." }],
      chart,
      sensitivity.map(s => ({ label: "Price " + s.change, value: s.margin }))
    ));
  }, [revenue, cost, tab, sellPrice, markupPct]);

  return (
    <div className="space-y-6">
      <Tabs tabs={["Margin", "Markup"]} active={tab} onChange={setTab} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Presets items={[
            { label: "Retail Product", v: { rev: 149, cost: 100 } },
            { label: "SaaS ($99/mo)", v: { rev: 99, cost: 20 } },
            { label: "Service Business", v: { rev: 1500, cost: 600 } },
          ]} onApply={pr => { setRevenue(pr.v.rev); setCost(pr.v.cost); }} />
          <Sl label="Revenue / Selling Price" id="pm_rev" min={100} max={10000000} step={100} value={revenue} onChange={setRevenue} fmt={v => fm(v)} />
          <Sl label="Cost of Goods Sold" id="pm_cost" min={100} max={10000000} step={100} value={cost} onChange={setCost} fmt={v => fm(v)} />
          {tab === "Markup" && <N label="Target Markup %" id="pm_mu" value={markupPct} onChange={setMarkupPct} unit="%" placeholder="50" hint="% above cost" />}
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="Profit Margin" /></div>
      </div>
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>Margin vs Markup — Key Difference</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75 }}><strong>Gross Margin</strong> = (Revenue - Cost) / Revenue × 100 — expressed as % of selling price. <strong>Markup</strong> = (Revenue - Cost) / Cost × 100 — expressed as % of cost. A 50% markup results in only a 33% margin. Always know which one you mean when pricing!</p>
      </div>
    </div>
  );
}

// ── Break-Even Calculator ────────────────────────────────────────────
export function BreakEvenForm() {
  const { fm, sym } = useCurrency();
  const [fixed, setFixed] = useState(10000);
  const [varCost, setVarCost] = useState(25);
  const [sellPrice, setSellPrice] = useState(50);
  const [targetProfit, setTargetProfit] = useState("0");
  const [res, setRes] = useState(null);
  const [tableRows, setTableRows] = useState([]);

  useEffect(() => {
    if (!fixed || !varCost || !sellPrice || sellPrice <= varCost) return;
    const contribution = sellPrice - varCost;
    const cmRatio = contribution / sellPrice;
    const bepUnits = fixed / contribution;
    const bepRevenue = fixed / cmRatio;
    const marginOfSafety = targetProfit ? ((+targetProfit + fixed) / cmRatio - bepRevenue) / ((+targetProfit + fixed) / cmRatio) * 100 : 0;
    const targetUnits = targetProfit ? Math.ceil((fixed + +targetProfit) / contribution) : 0;
    const rows = [0.5, 1, 1.5, 2, 2.5, 3].map(mult => {
      const units = Math.round(bepUnits * mult);
      const rev = units * sellPrice;
      const totalCost = fixed + units * varCost;
      return { units, rev: Math.round(rev), cost: Math.round(totalCost), profit: Math.round(rev - totalCost) };
    });
    setTableRows(rows);
    const chart = { type: "line", data: rows.map(r => ({ units: r.units + " units", Revenue: r.rev, "Total Cost": r.cost })), keys: ["Revenue", "Total Cost"] };
    setRes(buildResult("Break-Even Units", Math.ceil(bepUnits) + " units",
      [
        { label: "Break-Even Revenue", value: fm(Math.round(bepRevenue)) },
        { label: "Contribution Margin", value: fm(contribution) + "/unit" },
        { label: "CM Ratio", value: (cmRatio * 100).toFixed(1) + "%" },
        { label: "Fixed Costs", value: fm(fixed) },
        targetProfit > 0 ? { label: "Units for Target Profit", value: targetUnits + " units", highlight: true } : null,
        targetProfit > 0 ? { label: "Revenue for Target Profit", value: fm(Math.round(targetUnits * sellPrice)), highlight: true } : null,
      ].filter(Boolean),
      [{ type: "tip", msg: "At " + fm(sellPrice) + " selling price with " + fm(varCost) + " variable cost, you need to sell " + Math.ceil(bepUnits) + " units to cover " + fm(fixed) + " in fixed costs." }],
      chart,
      [{ label: "Price per Unit", value: fm(sellPrice) }, { label: "Variable Cost/Unit", value: fm(varCost) }, { label: "Fixed Costs", value: fm(fixed) }]
    ));
  }, [fixed, varCost, sellPrice, targetProfit]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Presets items={[
            { label: "Startup", v: { f: 10000, vc: 25, sp: 50, tp: 5000 } },
            { label: "Restaurant", v: { f: 5000, vc: 8, sp: 20, tp: 2000 } },
            { label: "SaaS Product", v: { f: 3000, vc: 2, sp: 30, tp: 10000 } },
          ]} onApply={pr => { setFixed(pr.v.f); setVarCost(pr.v.vc); setSellPrice(pr.v.sp); setTargetProfit(String(pr.v.tp)); }} />
          <Sl label="Fixed Costs (Monthly)" id="be_f" min={500} max={500000} step={500} value={fixed} onChange={setFixed} fmt={v => fm(v)} />
          <Sl label="Variable Cost per Unit" id="be_vc" min={1} max={10000} step={1} value={varCost} onChange={setVarCost} fmt={v => fm(v)} />
          <Sl label="Selling Price per Unit" id="be_sp" min={2} max={50000} step={1} value={sellPrice} onChange={setSellPrice} fmt={v => fm(v)} />
          <N label="Target Monthly Profit" id="be_tp" value={targetProfit} onChange={setTargetProfit} unit={sym} placeholder="0" hint="Units needed to hit this profit goal" />
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="Break-Even" /></div>
      </div>
      {tableRows.length > 0 && (
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "var(--r-xl)", overflow: "hidden" }}>
          <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", background: "var(--surface2)" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Profit/Loss at Different Sales Volumes</p>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--surface2)" }}>
                  {["Units Sold", "Revenue", "Total Cost", "Profit/Loss", "Status"].map((h, hi) => <th key={h} style={{ padding: "9px 14px", textAlign: hi === 0 ? "center" : "right", fontWeight: 700, color: "var(--text2)", fontSize: 11, textTransform: "uppercase", borderBottom: "2px solid var(--border)" }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)", background: row.profit >= 0 ? "rgba(34,197,94,0.03)" : "rgba(239,68,68,0.03)" }}>
                    <td style={{ padding: "8px 14px", textAlign: "center", fontWeight: 700, color: "var(--text3)" }}>{row.units.toLocaleString()}</td>
                    <td style={{ padding: "8px 14px", textAlign: "right", color: "var(--text)", fontWeight: 600 }}>{fm(row.rev)}</td>
                    <td style={{ padding: "8px 14px", textAlign: "right", color: "var(--text)", fontWeight: 600 }}>{fm(row.cost)}</td>
                    <td style={{ padding: "8px 14px", textAlign: "right", color: row.profit >= 0 ? "var(--success)" : "#ef4444", fontWeight: 700 }}>{fm(Math.abs(row.profit))}</td>
                    <td style={{ padding: "8px 14px", textAlign: "right" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: row.profit >= 0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: row.profit >= 0 ? "var(--success)" : "#ef4444" }}>{row.profit >= 0 ? "Profit" : "Loss"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>Understanding Break-Even Analysis</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75 }}>The break-even point is where total revenue equals total costs — no profit, no loss. <strong>Break-Even Units = Fixed Costs ÷ (Price - Variable Cost)</strong>. The contribution margin (Price - Variable Cost) tells you how much each unit sold contributes to covering fixed costs and then generating profit.</p>
      </div>
    </div>
  );
}

// ── Tax Calculator ───────────────────────────────────────────────────
export function TaxForm() {
  const { fm, sym } = useCurrency();
  const [income, setIncome] = useState(60000);
  const [country, setCountry] = useState("US");
  const [filingStatus, setFilingStatus] = useState("single");
  const [deductions, setDeductions] = useState("14600");
  const [tab, setTab] = useState("Tax");
  const [res, setRes] = useState(null);

  const US_BRACKETS_2024 = {
    single: [[11600, 0.10], [47150, 0.12], [100525, 0.22], [191950, 0.24], [243725, 0.32], [609350, 0.35], [Infinity, 0.37]],
    married: [[23200, 0.10], [94300, 0.12], [201050, 0.22], [383900, 0.24], [487450, 0.32], [731200, 0.35], [Infinity, 0.37]],
  };
  const IN_BRACKETS_NEW = [[300000, 0], [600000, 0.05], [900000, 0.10], [1200000, 0.15], [1500000, 0.20], [Infinity, 0.30]];
  const IN_BRACKETS_OLD = [[250000, 0], [500000, 0.05], [1000000, 0.20], [Infinity, 0.30]];

  function calcUSFederal(taxableIncome, status) {
    const brackets = US_BRACKETS_2024[status] || US_BRACKETS_2024.single;
    let tax = 0, prev = 0;
    const waterfall = [];
    for (const [limit, rate] of brackets) {
      if (taxableIncome <= prev) break;
      const amt = Math.min(taxableIncome, limit) - prev;
      const t = amt * rate;
      waterfall.push({ range: fm(prev) + " - " + (limit === Infinity ? "+" : fm(limit)), rate: (rate * 100) + "%", tax: fm(Math.round(t)) });
      tax += t; prev = limit;
    }
    return { tax: Math.round(tax), waterfall };
  }
  function calcINTax(grossIncome, regime) {
    const brackets = regime === "new" ? IN_BRACKETS_NEW : IN_BRACKETS_OLD;
    const deductionAmt = regime === "old" ? Math.min(150000, grossIncome) + 50000 : 75000;
    const taxableIncome = Math.max(0, grossIncome - deductionAmt);
    let tax = 0, prev = 0;
    const waterfall = [];
    for (const [limit, rate] of brackets) {
      if (taxableIncome <= prev) break;
      const amt = Math.min(taxableIncome, limit) - prev;
      const t = amt * rate;
      waterfall.push({ range: "₹" + prev.toLocaleString() + " - " + (limit === Infinity ? "+" : "₹" + limit.toLocaleString()), rate: (rate * 100) + "%", tax: "₹" + Math.round(t).toLocaleString() });
      tax += t; prev = limit;
    }
    return { tax: Math.round(tax + tax * 0.04), waterfall, taxableIncome }; // +4% cess
  }

  useEffect(() => {
    if (!income) return;
    let result;
    if (country === "US") {
      const deductAmt = +deductions || 14600;
      const taxableIncome = Math.max(0, income - deductAmt);
      const { tax, waterfall } = calcUSFederal(taxableIncome, filingStatus);
      const effectiveRate = (tax / income) * 100;
      const marginalRate = tax > 0 ? waterfall[waterfall.length - 1]?.rate : "0%";
      const quarterly = Math.round(tax / 4);
      const chartData = waterfall.map(w => ({ bracket: w.range.substring(0, 10), Tax: parseFloat(w.tax.replace(/[$,]/g, "")) || 0 }));
      result = buildResult("Federal Tax", fm(tax),
        [
          { label: "Gross Income", value: fm(income) },
          { label: "Deductions", value: fm(deductAmt) },
          { label: "Taxable Income", value: fm(taxableIncome) },
          { label: "Effective Rate", value: effectiveRate.toFixed(2) + "%", warn: effectiveRate > 25 },
          { label: "Marginal Rate", value: marginalRate },
          { label: "Quarterly Estimated Tax", value: fm(quarterly) },
          { label: "Monthly Tax Equivalent", value: fm(Math.round(tax / 12)) },
        ],
        [{ type: "tip", msg: "Your effective tax rate of " + effectiveRate.toFixed(1) + "% means you keep " + fm(income - tax) + " after federal taxes. Consider maxing 401k ($23,000) to reduce taxable income." }],
        { type: "bar", data: chartData, keys: ["Tax"] },
        waterfall.map(w => ({ label: w.range + " @ " + w.rate, value: w.tax }))
      );
    } else if (country === "IN") {
      const newRegime = calcINTax(income, "new");
      const oldRegime = calcINTax(income, "old");
      const better = newRegime.tax <= oldRegime.tax ? "New" : "Old";
      const savings = Math.abs(newRegime.tax - oldRegime.tax);
      result = buildResult("Recommended Regime", better + " Regime",
        [
          { label: "Gross Income", value: "₹" + income.toLocaleString() },
          { label: "Tax (New Regime)", value: "₹" + newRegime.tax.toLocaleString(), highlight: newRegime.tax <= oldRegime.tax },
          { label: "Tax (Old Regime)", value: "₹" + oldRegime.tax.toLocaleString(), highlight: oldRegime.tax < newRegime.tax },
          { label: "Regime Savings", value: "₹" + savings.toLocaleString(), highlight: true },
          { label: "Effective Rate (New)", value: (newRegime.tax / income * 100).toFixed(2) + "%" },
          { label: "Quarterly Advance Tax", value: "₹" + Math.round(newRegime.tax / 4).toLocaleString() },
        ],
        [{ type: "tip", msg: "The " + better + " Regime saves you ₹" + savings.toLocaleString() + " in taxes. " + (better === "New" ? "New regime has lower rates but fewer deductions." : "Old regime benefits those with high 80C investments.") }],
        { type: "bar", data: [{ name: "New Regime", value: newRegime.tax }, { name: "Old Regime", value: oldRegime.tax }], keys: ["value"] },
        []
      );
    } else {
      result = buildResult("Tax Estimate", fm(Math.round(income * 0.2)),
        [{ label: "Income", value: fm(income) }, { label: "Country", value: country }, { label: "Note", value: "Consult a local tax advisor for exact figures." }],
        [{ type: "tip", msg: "For accurate " + country + " tax calculation, please consult a qualified tax professional as rates depend on many factors." }],
        null, []
      );
    }
    setRes(result);
  }, [income, country, filingStatus, deductions, tab]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Presets items={[
            { label: "US Single $60K", v: { inc: 60000, c: "US", fs: "single", ded: 14600 } },
            { label: "US Married $120K", v: { inc: 120000, c: "US", fs: "married", ded: 29200 } },
            { label: "India ₹12L", v: { inc: 1200000, c: "IN", fs: "single", ded: 0 } },
          ]} onApply={pr => { setIncome(pr.v.inc); setCountry(pr.v.c); setFilingStatus(pr.v.fs); setDeductions(String(pr.v.ded)); }} />
          <Sel label="Country" id="tax_c" value={country} onChange={setCountry} opts={[{ v: "US", l: "United States" }, { v: "IN", l: "India" }, { v: "UK", l: "United Kingdom" }, { v: "CA", l: "Canada" }, { v: "AU", l: "Australia" }]} />
          <Sl label={country === "IN" ? "Annual Income (₹)" : "Gross Annual Income"} id="tax_inc" min={10000} max={country === "IN" ? 10000000 : 500000} step={country === "IN" ? 10000 : 1000} value={income} onChange={setIncome} fmt={v => country === "IN" ? "₹" + (v / 100000).toFixed(1) + "L" : fm(v)} />
          {country === "US" && (
            <>
              <Sel label="Filing Status" id="tax_fs" value={filingStatus} onChange={setFilingStatus} opts={[{ v: "single", l: "Single" }, { v: "married", l: "Married Filing Jointly" }]} />
              <N label="Deductions" id="tax_ded" value={deductions} onChange={setDeductions} unit={sym} placeholder="14600" hint="Standard deduction 2024: $14,600 (single)" />
            </>
          )}
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="Tax" /></div>
      </div>
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>Understanding Marginal vs Effective Tax Rate</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75 }}>The <strong>marginal tax rate</strong> is the rate on the last dollar earned. The <strong>effective tax rate</strong> is the actual average rate on all income. Due to progressive brackets, earning more doesn't mean all income gets taxed at the higher rate — only the portion above each threshold.</p>
      </div>
    </div>
  );
}

// ── GST / VAT Calculator ─────────────────────────────────────────────
export function GSTForm() {
  const { fm } = useCurrency();
  const [amount, setAmount] = useState(10000);
  const [gstRate, setGstRate] = useState(18);
  const [mode, setMode] = useState("exclusive");
  const [country, setCountry] = useState("IN");
  const [tab, setTab] = useState("GST");
  const [items, setItems] = useState([{ id: 1, name: "Item 1", amount: 5000, rate: 18 }]);
  const [res, setRes] = useState(null);

  const GST_RATES = { IN: [0, 5, 12, 18, 28], US: [0, 6, 7, 8, 10], EU: [0, 5, 10, 20], UK: [0, 5, 20], AU: [0, 10], CA: [0, 5, 13, 15] };
  const RATE_PRESETS = [{ v: 5, l: "5% - Food, Books" }, { v: 12, l: "12% - Processed Food" }, { v: 18, l: "18% - Standard" }, { v: 28, l: "28% - Luxury" }];

  useEffect(() => {
    if (tab === "Invoice") {
      const totalGST = items.reduce((sum, item) => sum + item.amount * (item.rate / 100), 0);
      const totalBase = items.reduce((sum, item) => sum + item.amount, 0);
      setRes(buildResult("Total GST", fm(Math.round(totalGST)),
        [{ label: "Total Base Amount", value: fm(Math.round(totalBase)) }, { label: "Total GST", value: fm(Math.round(totalGST)), warn: true }, { label: "Total Invoice Value", value: fm(Math.round(totalBase + totalGST)) }, { label: "No. of Items", value: items.length }],
        [{ type: "tip", msg: "Invoice total: " + fm(Math.round(totalBase + totalGST)) + ". Download this summary for your records." }],
        null, items.map(item => ({ label: item.name + " (GST " + item.rate + "%)", value: fm(Math.round(item.amount * item.rate / 100)) }))
      ));
      return;
    }
    if (!amount || !gstRate) return;
    let baseAmount, gstAmount, totalAmount;
    if (mode === "exclusive") {
      baseAmount = amount;
      gstAmount = amount * (gstRate / 100);
      totalAmount = amount + gstAmount;
    } else {
      totalAmount = amount;
      gstAmount = amount * (gstRate / (100 + gstRate));
      baseAmount = amount - gstAmount;
    }
    const cgst = country === "IN" ? gstAmount / 2 : 0;
    const sgst = country === "IN" ? gstAmount / 2 : 0;
    const chart = { type: "donut", data: [{ name: "Base Amount", value: Math.round(baseAmount) }, { name: "GST", value: Math.round(gstAmount) }], keys: ["value"] };
    setRes(buildResult(mode === "exclusive" ? "Total with GST" : "Base Amount (ex-GST)", fm(Math.round(mode === "exclusive" ? totalAmount : baseAmount)),
      [
        { label: "Base Amount", value: fm(Math.round(baseAmount)) },
        { label: "GST Amount (" + gstRate + "%)", value: fm(Math.round(gstAmount)), warn: true },
        { label: "Total Amount", value: fm(Math.round(totalAmount)) },
        country === "IN" ? { label: "CGST (" + (gstRate / 2) + "%)", value: fm(Math.round(cgst)) } : null,
        country === "IN" ? { label: "SGST (" + (gstRate / 2) + "%)", value: fm(Math.round(sgst)) } : null,
      ].filter(Boolean),
      [{ type: "tip", msg: "GST of " + gstRate + "% on " + fm(Math.round(baseAmount)) + " = " + fm(Math.round(gstAmount)) + ". " + (country === "IN" ? "Split as CGST " + fm(Math.round(cgst)) + " + SGST " + fm(Math.round(sgst)) + "." : "") }],
      chart, []
    ));
  }, [amount, gstRate, mode, country, tab, items]);

  const addItem = () => setItems(prev => [...prev, { id: Date.now(), name: "Item " + (prev.length + 1), amount: 1000, rate: 18 }]);
  const updateItem = (id, field, value) => setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: field === "name" ? value : +value } : item));
  const removeItem = (id) => setItems(prev => prev.filter(item => item.id !== id));

  return (
    <div className="space-y-6">
      <Tabs tabs={["GST/VAT", "Invoice Builder"]} active={tab} onChange={setTab} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Presets items={[
            { label: "Electronics 18%", v: { a: 10000, r: 18, m: "exclusive", c: "IN" } },
            { label: "Food 5%", v: { a: 500, r: 5, m: "exclusive", c: "IN" } },
            { label: "Luxury 28%", v: { a: 50000, r: 28, m: "exclusive", c: "IN" } },
          ]} onApply={pr => { setAmount(pr.v.a); setGstRate(pr.v.r); setMode(pr.v.m); setCountry(pr.v.c); }} />
          <Sel label="Country / Tax Type" id="gst_c" value={country} onChange={setCountry} opts={[{ v: "IN", l: "India (GST)" }, { v: "US", l: "US (Sales Tax)" }, { v: "EU", l: "EU (VAT)" }, { v: "UK", l: "UK (VAT)" }, { v: "AU", l: "Australia (GST)" }, { v: "CA", l: "Canada (HST)" }]} />
          <Sl label="Amount" id="gst_a" min={100} max={1000000} step={100} value={amount} onChange={setAmount} fmt={v => fm(v)} />
          <Sel label="GST Rate" id="gst_r" value={String(gstRate)} onChange={v => setGstRate(+v)} opts={(GST_RATES[country] || [5, 10, 15, 20]).map(r => ({ v: String(r), l: r + "%" }))} />
          <Sel label="Mode" id="gst_m" value={mode} onChange={setMode} opts={[{ v: "exclusive", l: "Add GST (Price excludes tax)" }, { v: "inclusive", l: "Remove GST (Price includes tax)" }]} />
          {tab === "Invoice Builder" && (
            <div style={{ marginTop: 14 }}>
              {items.map((item, i) => (
                <div key={item.id} style={{ padding: "12px", background: "var(--surface2)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <input value={item.name} onChange={e => updateItem(item.id, "name", e.target.value)} style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", background: "transparent", border: "none", outline: "none" }} />
                    {items.length > 1 && <button onClick={() => removeItem(item.id)} style={{ fontSize: 11, color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>×</button>}
                  </div>
                  <Row2>
                    <N label="Amount" id={"gst_ia" + item.id} value={String(item.amount)} onChange={v => updateItem(item.id, "amount", v)} unit="" placeholder="1000" hint="" />
                    <Sel label="Rate" id={"gst_ir" + item.id} value={String(item.rate)} onChange={v => updateItem(item.id, "rate", v)} opts={[5, 12, 18, 28].map(r => ({ v: String(r), l: r + "%" }))} />
                  </Row2>
                </div>
              ))}
              {items.length < 5 && <button onClick={addItem} style={{ width: "100%", padding: "8px", borderRadius: "var(--r-md)", border: "2px dashed var(--border)", background: "transparent", color: "var(--brand)", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>+ Add Item</button>}
            </div>
          )}
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="GST" /></div>
      </div>
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>GST Inclusive vs Exclusive — What's the Difference?</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75 }}><strong>Exclusive (Add GST):</strong> The displayed price does NOT include tax. GST is added on top. Common in B2B. <strong>Inclusive (Remove GST):</strong> The price already includes tax. Use "Remove GST" to find the base price. Common in retail. Always check which mode applies before calculating!</p>
      </div>
    </div>
  );
}

// ── Tip Calculator ───────────────────────────────────────────────────
export function TipForm() {
  const { fm, sym } = useCurrency();
  const [bill, setBill] = useState(85);
  const [tipPct, setTipPct] = useState(18);
  const [people, setPeople] = useState(1);
  const [tab, setTab] = useState("Tip");
  const [items, setItems] = useState([{ id: 1, name: "Person 1", amount: 45 }, { id: 2, name: "Person 2", amount: 40 }]);
  const [res, setRes] = useState(null);

  const QUICK_TIPS = [10, 15, 18, 20, 25];
  const SERVICE_TIPS = { Poor: 10, OK: 15, Good: 18, Excellent: 25 };

  useEffect(() => {
    if (tab === "Split") {
      const totalBill = items.reduce((sum, item) => sum + item.amount, 0);
      const tipForEach = items.map(item => ({ ...item, tip: Math.round(item.amount * tipPct / 100), total: Math.round(item.amount * (1 + tipPct / 100)) }));
      setRes(buildResult("Bill Split",
        fm(Math.round(totalBill * (1 + tipPct / 100))),
        [
          { label: "Total Bill", value: fm(Math.round(totalBill)) },
          { label: "Total Tip (" + tipPct + "%)", value: fm(Math.round(totalBill * tipPct / 100)) },
          { label: "Grand Total", value: fm(Math.round(totalBill * (1 + tipPct / 100))) },
          { label: "People", value: items.length },
        ],
        [{ type: "tip", msg: "Each person's share is itemized below based on their individual order amounts." }],
        null,
        tipForEach.map(item => ({ label: item.name + " (Order: " + fm(item.amount) + ")", value: "Total: " + fm(item.total) + " (Tip: " + fm(item.tip) + ")" }))
      ));
      return;
    }
    if (!bill) return;
    const tipAmount = bill * (tipPct / 100);
    const total = bill + tipAmount;
    const perPerson = total / people;
    const tipPerPerson = tipAmount / people;
    setRes(buildResult("Tip Amount", fm(Math.round(tipAmount)),
      [
        { label: "Bill Amount", value: fm(bill) },
        { label: "Tip (" + tipPct + "%)", value: fm(Math.round(tipAmount)) },
        { label: "Total to Pay", value: fm(Math.round(total)) },
        people > 1 ? { label: "Per Person (Total)", value: fm(Math.round(perPerson)) } : null,
        people > 1 ? { label: "Per Person (Tip)", value: fm(Math.round(tipPerPerson)) } : null,
      ].filter(Boolean),
      [{ type: "tip", msg: tipPct >= 20 ? "Generous tip! 20%+ is greatly appreciated by service staff." : tipPct < 15 ? "Standard minimum is 15-18% for good service." : "Good tip! " + tipPct + "% reflects quality service." }],
      null,
      QUICK_TIPS.map(t => ({ label: t + "% tip", value: fm(Math.round(bill * t / 100)) + " → Total: " + fm(Math.round(bill * (1 + t / 100))) }))
    ));
  }, [bill, tipPct, people, tab, items]);

  const addPerson = () => setItems(prev => [...prev, { id: Date.now(), name: "Person " + (prev.length + 1), amount: 0 }]);
  const updateItem = (id, field, value) => setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: field === "name" ? value : +value } : item));
  const removeItem = (id) => setItems(prev => prev.filter(item => item.id !== id));

  return (
    <div className="space-y-6">
      <Tabs tabs={["Tip", "Split Bill"]} active={tab} onChange={setTab} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Presets items={[
            { label: "Coffee $12.50", v: { b: 12.5, t: 18, p: 1 } },
            { label: "Restaurant $85", v: { b: 85, t: 20, p: 2 } },
            { label: "Group $240", v: { b: 240, t: 18, p: 6 } },
          ]} onApply={pr => { setBill(pr.v.b); setTipPct(pr.v.t); setPeople(pr.v.p); }} />
          <Sl label="Bill Amount" id="tip_b" min={1} max={5000} step={0.5} value={bill} onChange={setBill} fmt={v => fm(v)} />
          <Sl label="Tip Percentage" id="tip_t" min={0} max={50} step={1} value={tipPct} onChange={setTipPct} fmt={v => v + "%"} />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "8px 0" }}>
            {QUICK_TIPS.map(t => <button key={t} onClick={() => setTipPct(t)} style={{ padding: "5px 14px", borderRadius: 99, fontSize: 12, fontWeight: 700, border: "1.5px solid " + (tipPct === t ? "var(--brand)" : "var(--border)"), background: tipPct === t ? "var(--brand)" : "transparent", color: tipPct === t ? "#fff" : "var(--text2)", cursor: "pointer" }}>{t}%</button>)}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "8px 0" }}>
            <span style={{ fontSize: 11, color: "var(--text3)", alignSelf: "center" }}>Service:</span>
            {Object.entries(SERVICE_TIPS).map(([label, pct]) => <button key={label} onClick={() => setTipPct(pct)} style={{ padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700, border: "1.5px solid var(--border)", background: "var(--surface2)", color: "var(--text2)", cursor: "pointer" }}>{label}</button>)}
          </div>
          {tab !== "Split" && <Sl label="Number of People" id="tip_p" min={1} max={20} value={people} onChange={setPeople} fmt={v => v + " people"} />}
          {tab === "Split" && (
            <div style={{ marginTop: 10 }}>
              {items.map(item => (
                <div key={item.id} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <input value={item.name} onChange={e => updateItem(item.id, "name", e.target.value)} style={{ flex: 1, fontSize: 12, fontWeight: 600, color: "var(--text)", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: "6px 10px", outline: "none" }} />
                  <input type="number" value={item.amount} onChange={e => updateItem(item.id, "amount", e.target.value)} style={{ width: 80, fontSize: 12, color: "var(--text)", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: "6px 10px", outline: "none", textAlign: "right" }} />
                  {items.length > 1 && <button onClick={() => removeItem(item.id)} style={{ fontSize: 16, color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>×</button>}
                </div>
              ))}
              {items.length < 8 && <button onClick={addPerson} style={{ width: "100%", padding: "7px", borderRadius: "var(--r-md)", border: "2px dashed var(--border)", background: "transparent", color: "var(--brand)", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>+ Add Person</button>}
            </div>
          )}
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="Tip" /></div>
      </div>
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>Tipping Guide by Service Type</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10 }}>
          {[{ type: "Restaurant", range: "15-20%", note: "Based on pre-tax bill" }, { type: "Food Delivery", range: "15-20%", note: "Plus gas tip appreciated" }, { type: "Bartender", range: "$1-2/drink", note: "20% on tab" }, { type: "Hotel Housekeeping", range: "$2-5/night", note: "Leave daily" }].map((g, i) => (
            <div key={i} style={{ padding: "12px", background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{g.type}</p>
              <p style={{ fontSize: 14, fontWeight: 800, color: "var(--brand)", marginBottom: 3 }}>{g.range}</p>
              <p style={{ fontSize: 11, color: "var(--text3)" }}>{g.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── PPF Calculator ───────────────────────────────────────────────────
export function PPFForm() {
  const [deposit, setDeposit] = useState(50000);
  const [rate, setRate] = useState(7.1);
  const [years, setYears] = useState(15);
  const [tab, setTab] = useState("PPF");
  const [partialYr, setPartialYr] = useState("7");
  const [partialAmt, setPartialAmt] = useState("50000");
  const [res, setRes] = useState(null);
  const [tableRows, setTableRows] = useState([]);
  const fm = v => "₹" + Math.round(v).toLocaleString("en-IN");

  function computePPF(dep, rt, yrs, partialWithdrawal = null) {
    let bal = 0, totalInt = 0, totalDep = 0;
    const rows = [];
    for (let yr = 1; yr <= yrs; yr++) {
      const yearDep = dep;
      const interest = (bal + yearDep) * (rt / 100);
      bal = bal + yearDep + interest;
      totalInt += interest;
      totalDep += yearDep;
      if (partialWithdrawal && yr === +partialWithdrawal.year) {
        bal = Math.max(0, bal - partialWithdrawal.amount);
      }
      rows.push({ year: yr, deposit: Math.round(yearDep), interest: Math.round(interest), balance: Math.round(bal), totalDep: Math.round(totalDep), totalInt: Math.round(totalInt) });
    }
    return { maturity: Math.round(bal), totalInt: Math.round(totalInt), totalDep: Math.round(totalDep), rows };
  }

  useEffect(() => {
    if (!deposit || !rate || !years) return;
    const partial = tab === "Withdrawal" && partialYr && partialAmt ? { year: partialYr, amount: +partialAmt } : null;
    const { maturity, totalInt, totalDep, rows } = computePPF(deposit, rate, years, partial);
    setTableRows(rows);
    const vsElss = Math.round(deposit * years * Math.pow(1 + 0.12, years) / years * (Math.pow(1 + 0.12, years) - 1) / 0.12);
    const vsFd = Math.round(deposit * (Math.pow(1 + 7.5 / 100, years) - 1) / (7.5 / 100) * (1 + 7.5 / 100));
    const chart = { type: "area", data: rows.filter((_, i) => i % Math.max(1, Math.floor(rows.length / 10)) === 0).map(r => ({ year: "Yr " + r.year, Deposits: r.totalDep, Balance: r.balance })), keys: ["Deposits", "Balance"] };
    setRes(buildResult("Maturity Amount", fm(maturity),
      [
        { label: "Total Deposited", value: fm(totalDep) },
        { label: "Total Interest Earned", value: fm(totalInt), highlight: true },
        { label: "EEE Tax Benefit", value: "Exempt-Exempt-Exempt" },
        { label: "ELSS (12% est.)", value: fm(vsElss) },
        { label: "Fixed Deposit (7.5%)", value: fm(vsFd) },
        partial ? { label: "After Partial Withdrawal", value: "Yr " + partialYr + ": -" + fm(+partialAmt), warn: true } : null,
      ].filter(Boolean),
      [{ type: "tip", msg: "PPF is fully tax-exempt (EEE): deduction on deposit, tax-free interest, and tax-free maturity. Ideal for risk-free long-term wealth." }],
      chart,
      [{ label: "Lock-in Period", value: "15 years (extendable in 5yr blocks)" }, { label: "Max Deposit/yr", value: "₹1,50,000" }, { label: "Partial Withdrawal", value: "From Year 7 onwards" }]
    ));
  }, [deposit, rate, years, tab, partialYr, partialAmt]);

  return (
    <div className="space-y-6">
      <Tabs tabs={["PPF", "Withdrawal Sim"]} active={tab} onChange={setTab} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Presets items={[
            { label: "Basic ₹10K/yr", v: { d: 10000, r: 7.1, y: 15 } },
            { label: "Mid ₹50K/yr", v: { d: 50000, r: 7.1, y: 20 } },
            { label: "Max ₹1.5L/yr", v: { d: 150000, r: 7.1, y: 25 } },
          ]} onApply={pr => { setDeposit(pr.v.d); setRate(pr.v.r); setYears(pr.v.y); }} />
          <Sl label="Annual Deposit (₹)" id="ppf_d" min={500} max={150000} step={500} value={deposit} onChange={setDeposit} fmt={v => "₹" + v.toLocaleString("en-IN")} />
          <Sl label="Interest Rate (% p.a.)" id="ppf_r" min={6} max={9} step={0.05} value={rate} onChange={setRate} fmt={v => v + "%"} />
          <Sl label="Investment Period (Years)" id="ppf_y" min={15} max={35} step={5} value={years} onChange={setYears} fmt={v => v + " yrs"} />
          {tab === "Withdrawal Sim" && (
            <>
              <N label="Withdrawal Year (7+)" id="ppf_wy" value={partialYr} onChange={setPartialYr} unit="yr" placeholder="7" hint="PPF allows withdrawal from Year 7" />
              <N label="Withdrawal Amount (₹)" id="ppf_wa" value={partialAmt} onChange={setPartialAmt} unit="₹" placeholder="50000" hint="Up to 50% of balance at end of Year 4" />
            </>
          )}
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="PPF" /></div>
      </div>
      {tableRows.length > 0 && (
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "var(--r-xl)", overflow: "hidden" }}>
          <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", background: "var(--surface2)" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Year-wise PPF Balance</p>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--surface2)" }}>
                  {["Year", "Deposit", "Interest", "Balance", "Total Deposited"].map((h, hi) => <th key={h} style={{ padding: "9px 14px", textAlign: hi === 0 ? "center" : "right", fontWeight: 700, color: "var(--text2)", fontSize: 11, textTransform: "uppercase", borderBottom: "2px solid var(--border)" }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr key={row.year} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.015)" }}>
                    <td style={{ padding: "8px 14px", textAlign: "center", color: "var(--text3)", fontWeight: 700 }}>Year {row.year}</td>
                    <td style={{ padding: "8px 14px", textAlign: "right", color: "var(--text)", fontWeight: 600 }}>{fm(row.deposit)}</td>
                    <td style={{ padding: "8px 14px", textAlign: "right", color: "var(--success)", fontWeight: 700 }}>{fm(row.interest)}</td>
                    <td style={{ padding: "8px 14px", textAlign: "right", color: "var(--brand)", fontWeight: 800 }}>{fm(row.balance)}</td>
                    <td style={{ padding: "8px 14px", textAlign: "right", color: "var(--text3)", fontWeight: 600 }}>{fm(row.totalDep)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>Why PPF is the Best Tax-Free Investment in India</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75 }}>PPF (Public Provident Fund) offers triple tax exemption (EEE): invest up to ₹1.5L/year under Section 80C, earn interest tax-free, and receive maturity amount tax-free. With government-backed security and 15-year lock-in (extendable in 5-year blocks), it's the gold standard for risk-free wealth creation in India.</p>
      </div>
    </div>
  );
}

// ── Fixed Deposit Calculator ─────────────────────────────────────────
export function FDForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7.0);
  const [months, setMonths] = useState(12);
  const [freq, setFreq] = useState("4");
  const [seniorCitizen, setSeniorCitizen] = useState(false);
  const [tds, setTds] = useState(false);
  const [tab, setTab] = useState("Single");
  const [penalty, setPenalty] = useState("0");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const effectiveRate = rate + (seniorCitizen ? 0.5 : 0);
    const years = months / 12;
    const n = +freq;
    const maturity = principal * Math.pow(1 + (effectiveRate / 100) / n, n * years);
    const interest = maturity - principal;
    const tdsAmount = tds ? interest * 0.1 : 0;
    const netInterest = interest - tdsAmount;
    const penaltyAmt = +penalty > 0 ? principal * (+penalty / 100) : 0;
    const earlyMaturity = maturity - penaltyAmt - tdsAmount;
    const BANKS = [
      { name: "SBI", rate: 6.5 + (seniorCitizen ? 0.5 : 0) },
      { name: "HDFC", rate: 7.0 + (seniorCitizen ? 0.5 : 0) },
      { name: "ICICI", rate: 7.25 + (seniorCitizen ? 0.5 : 0) },
    ];
    const bankComparison = BANKS.map(b => {
      const m = principal * Math.pow(1 + (b.rate / 100) / n, n * years);
      return { name: b.name + " (" + b.rate + "%)", value: Math.round(m) };
    });
    const chart = { type: "bar", data: [...bankComparison, { name: "Your FD (" + effectiveRate + "%)", value: Math.round(maturity) }], keys: ["value"] };
    setRes(buildResult("Maturity Value", fm(Math.round(maturity - tdsAmount)),
      [
        { label: "Principal", value: fm(principal) },
        { label: "Interest Rate", value: effectiveRate + "% p.a." + (seniorCitizen ? " (Senior Citizen)" : "") },
        { label: "Interest Earned", value: fm(Math.round(interest)), highlight: true },
        tds ? { label: "TDS Deducted (10%)", value: fm(Math.round(tdsAmount)), warn: true } : null,
        tds ? { label: "Net Interest", value: fm(Math.round(netInterest)) } : null,
        +penalty > 0 ? { label: "Early Withdrawal Value", value: fm(Math.round(earlyMaturity)), warn: true } : null,
      ].filter(Boolean),
      [{ type: "tip", msg: "At " + effectiveRate + "% for " + months + " months, " + fm(principal) + " grows to " + fm(Math.round(maturity)) + ". " + (seniorCitizen ? "Senior citizen bonus (+0.5%) applied!" : "Senior citizens get +0.5% extra rate!") }],
      chart,
      [{ label: "Tenure", value: months + " months (" + (months / 12).toFixed(1) + " years)" }, { label: "Compounding", value: freq === "1" ? "Annually" : freq === "4" ? "Quarterly" : freq === "12" ? "Monthly" : "Quarterly" }]
    ));
  }, [principal, rate, months, freq, seniorCitizen, tds, penalty]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Presets items={[
            { label: "1 Year FD", v: { p: 100000, r: 7.0, m: 12, f: "4" } },
            { label: "3 Year FD", v: { p: 250000, r: 7.25, m: 36, f: "4" } },
            { label: "5 Year Tax Saver", v: { p: 150000, r: 7.5, m: 60, f: "4" } },
          ]} onApply={pr => { setPrincipal(pr.v.p); setRate(pr.v.r); setMonths(pr.v.m); setFreq(pr.v.f); }} />
          <Sl label="Principal Amount" id="fd_p" min={1000} max={5000000} step={1000} value={principal} onChange={setPrincipal} fmt={v => fmSlider(v)} />
          <Sl label="Interest Rate (% p.a.)" id="fd_r" min={4} max={10} step={0.05} value={rate} onChange={setRate} fmt={v => v + "%"} />
          <Sl label="Tenure (Months)" id="fd_m" min={1} max={120} value={months} onChange={setMonths} fmt={v => v + " mo (" + (v / 12).toFixed(1) + " yr)"} />
          <Sel label="Compounding Frequency" id="fd_f" value={freq} onChange={setFreq} opts={[{ v: "4", l: "Quarterly" }, { v: "12", l: "Monthly" }, { v: "1", l: "Annually" }, { v: "2", l: "Half-Yearly" }]} />
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, color: "var(--text2)" }}>
              <input type="checkbox" checked={seniorCitizen} onChange={e => setSeniorCitizen(e.target.checked)} />
              Senior Citizen (+0.5%)
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, color: "var(--text2)" }}>
              <input type="checkbox" checked={tds} onChange={e => setTds(e.target.checked)} />
              Deduct TDS (10%)
            </label>
          </div>
          <N label="Early Withdrawal Penalty (%)" id="fd_pen" value={penalty} onChange={setPenalty} unit="%" placeholder="0" hint="Penalty for premature withdrawal (usually 0.5-1%)" />
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="FD" /></div>
      </div>
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>Fixed Deposit Tips</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75 }}>FDs offer guaranteed returns and capital protection. Use an FD ladder strategy — split across multiple FDs with different maturities (e.g., 1yr, 2yr, 3yr) for liquidity without sacrificing returns. Senior citizens always get 0.25-0.75% extra rate. Compare bank rates regularly as RBI rate changes affect FD rates.</p>
      </div>
    </div>
  );
}

// ── Loan Comparison Calculator ───────────────────────────────────────
export function LoanCompareForm() {
  const { fm, sym } = useCurrency();
  const [loans, setLoans] = useState([
    { id: 1, name: "Bank A", amount: 3000000, rate: 8.0, term: 20, fee: 0 },
    { id: 2, name: "Bank B", amount: 3000000, rate: 7.5, term: 20, fee: 20000 },
    { id: 3, name: "Bank C", amount: 3000000, rate: 8.5, term: 15, fee: 0 },
  ]);
  const [res, setRes] = useState(null);
  const [comparisonTable, setComparisonTable] = useState([]);

  function calcLoan(amount, annRate, termYears, fee) {
    const r = annRate / 100 / 12, n = termYears * 12;
    if (!r || !n) return null;
    const emi = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalInterest = emi * n - amount;
    const totalCost = totalInterest + fee;
    const aprNumerator = (totalInterest + fee) * 2 * 12 / (amount * (n + 1));
    const effectiveAPR = aprNumerator * 100;
    return { emi: Math.round(emi), totalInterest: Math.round(totalInterest), totalCost: Math.round(totalCost), totalRepay: Math.round(emi * n + fee), effectiveAPR: effectiveAPR.toFixed(2) };
  }

  useEffect(() => {
    const results = loans.map(loan => ({ ...loan, ...calcLoan(loan.amount, loan.rate, loan.term, loan.fee) })).filter(l => l.emi);
    setComparisonTable(results);
    if (results.length === 0) return;
    const best = results.reduce((a, b) => a.totalRepay < b.totalRepay ? a : b);
    const worst = results.reduce((a, b) => a.totalRepay > b.totalRepay ? a : b);
    const maxSavings = worst.totalRepay - best.totalRepay;
    const chart = { type: "bar", data: results.map(l => ({ name: l.name, "Total Cost": l.totalRepay })), keys: ["Total Cost"] };
    setRes(buildResult("Best Option", best.name,
      [
        { label: "Best EMI", value: fm(best.emi) + "/mo", highlight: true },
        { label: "Best Total Cost", value: fm(best.totalRepay), highlight: true },
        { label: "Max Savings vs Others", value: fm(maxSavings), highlight: true },
        { label: "Best Effective APR", value: best.effectiveAPR + "%" },
        ...results.map(l => ({ label: l.name + " EMI", value: fm(l.emi) + "/mo" })),
      ],
      [{ type: "tip", msg: best.name + " offers the lowest total cost of " + fm(best.totalRepay) + ". Choosing it over the most expensive saves you " + fm(maxSavings) + "!" }],
      chart,
      results.map(l => ({ label: l.name + " APR", value: l.effectiveAPR + "%" }))
    ));
  }, [loans]);

  const updateLoan = (id, field, value) => setLoans(prev => prev.map(l => l.id === id ? { ...l, [field]: field === "name" ? value : +value } : l));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div style={{ marginBottom: 14 }}>
            {loans.map((loan, i) => (
              <div key={loan.id} style={{ marginBottom: 12, padding: "14px", background: "var(--surface2)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <input value={loan.name} onChange={e => updateLoan(loan.id, "name", e.target.value)} style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", background: "transparent", border: "none", outline: "none" }} />
                  <span style={{ fontSize: 11, color: "var(--brand)", fontWeight: 700 }}>Loan {i + 1}</span>
                </div>
                <Row2>
                  <N label="Rate (%)" id={"lc_r" + loan.id} value={String(loan.rate)} onChange={v => updateLoan(loan.id, "rate", v)} unit="%" placeholder="8.0" hint="" />
                  <N label="Term (yrs)" id={"lc_t" + loan.id} value={String(loan.term)} onChange={v => updateLoan(loan.id, "term", v)} unit="yr" placeholder="20" hint="" />
                </Row2>
                <Row2>
                  <N label="Amount" id={"lc_a" + loan.id} value={String(loan.amount)} onChange={v => updateLoan(loan.id, "amount", v)} unit={sym} placeholder="300000" hint="" />
                  <N label="Processing Fee" id={"lc_f" + loan.id} value={String(loan.fee)} onChange={v => updateLoan(loan.id, "fee", v)} unit={sym} placeholder="0" hint="One-time fee" />
                </Row2>
              </div>
            ))}
          </div>
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="Loan Compare" /></div>
      </div>
      {comparisonTable.length > 0 && (
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "var(--r-xl)", overflow: "hidden" }}>
          <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", background: "var(--surface2)" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Side-by-Side Comparison</p>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--surface2)" }}>
                  {["Lender", "Monthly EMI", "Total Interest", "Total Cost", "Effective APR", "Best?"].map((h, hi) => <th key={h} style={{ padding: "9px 14px", textAlign: hi === 0 ? "left" : "right", fontWeight: 700, color: "var(--text2)", fontSize: 11, textTransform: "uppercase", borderBottom: "2px solid var(--border)" }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {comparisonTable.sort((a, b) => a.totalRepay - b.totalRepay).map((loan, i) => (
                  <tr key={loan.id} style={{ borderBottom: "1px solid var(--border)", background: i === 0 ? "rgba(34,197,94,0.04)" : "transparent" }}>
                    <td style={{ padding: "9px 14px", fontWeight: 700, color: "var(--text)" }}>{loan.name}</td>
                    <td style={{ padding: "9px 14px", textAlign: "right", color: "var(--brand)", fontWeight: 700 }}>{fm(loan.emi)}</td>
                    <td style={{ padding: "9px 14px", textAlign: "right", color: "#ef4444", fontWeight: 600 }}>{fm(loan.totalInterest)}</td>
                    <td style={{ padding: "9px 14px", textAlign: "right", color: "var(--text)", fontWeight: 700 }}>{fm(loan.totalRepay)}</td>
                    <td style={{ padding: "9px 14px", textAlign: "right", color: "var(--text2)", fontWeight: 600 }}>{loan.effectiveAPR}%</td>
                    <td style={{ padding: "9px 14px", textAlign: "right" }}>
                      {i === 0 && <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "rgba(34,197,94,0.12)", color: "var(--success)" }}>Best</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>Why APR Matters More Than Interest Rate</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75 }}>The nominal interest rate doesn't include processing fees, insurance, and other charges. Always compare loans by their <strong>Effective APR</strong> (Annual Percentage Rate), which includes all costs. A lower rate with high fees can cost more than a slightly higher rate with no fees — especially for shorter loans.</p>
      </div>
    </div>
  );
}
