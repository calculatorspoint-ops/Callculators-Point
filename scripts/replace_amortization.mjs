import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/components/calculator-core/forms/FinanceFormsNew.jsx';
const content = readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Find start and end line indices (0-based)
const startIdx = lines.findIndex(l => l.includes('export function AmortizationForm()'));
// Find the end: the line with '// ── TVM Finance Calculator' after the amort form
const endIdx = lines.findIndex((l, i) => i > startIdx && l.includes('// ── TVM Finance Calculator'));

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find AmortizationForm boundaries. startIdx=', startIdx, 'endIdx=', endIdx);
  process.exit(1);
}

console.log(`Replacing lines ${startIdx + 1} to ${endIdx} (0-based: ${startIdx} to ${endIdx - 1})`);

const newCode = `export function AmortizationForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [principal, setPrincipal] = useState(300000);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);
  const [extra, setExtra] = useState("0");
  const [viewMode, setViewMode] = useState("yearly");
  const [showAll, setShowAll] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState("");
  const [scenarios, setScenarios] = useState([]);
  const [res, setRes] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [yearlySchedule, setYearlySchedule] = useState([]);
  const [summary, setSummary] = useState(null);

  function buildSchedule(P, annualRate, termYears, extraPmt) {
    const r = annualRate / 100 / 12;
    const n = termYears * 12;
    if (!P || !annualRate || !termYears || r <= 0) return null;
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    let bal = P;
    let totalInterest = 0;
    let months = 0;
    const rows = [];
    while (bal > 0.005 && months < n + 1) {
      months++;
      const interestPmt = bal * r;
      let principalPmt = Math.min(emi - interestPmt + extraPmt, bal);
      if (principalPmt < 0) principalPmt = 0;
      bal = Math.max(0, bal - principalPmt);
      totalInterest += interestPmt;
      rows.push({
        month: months,
        year: Math.ceil(months / 12),
        payment: emi + extraPmt,
        principal: principalPmt,
        interest: interestPmt,
        balance: bal,
        cumInterest: totalInterest,
        cumPrincipal: P - bal,
      });
      if (bal < 0.005) break;
    }
    const byYear = {};
    rows.forEach(r => {
      if (!byYear[r.year]) byYear[r.year] = { year: r.year, payment: 0, principal: 0, interest: 0, balance: r.balance, months: 0 };
      byYear[r.year].payment += r.payment;
      byYear[r.year].principal += r.principal;
      byYear[r.year].interest += r.interest;
      byYear[r.year].balance = r.balance;
      byYear[r.year].months++;
    });
    const yearly = Object.values(byYear).map(y => ({
      ...y,
      payment: Math.round(y.payment),
      principal: Math.round(y.principal),
      interest: Math.round(y.interest),
      balance: Math.round(y.balance),
    }));
    const originalInterest = emi * n - P;
    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + months);
    return { rows, yearly, emi, totalMonths: months, totalInterest, originalInterest, payoffDate, n };
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const extraPmt = +extra || 0;
      const data = buildSchedule(principal, rate, term, extraPmt);
      if (!data) { setRes(null); setSchedule([]); setYearlySchedule([]); setSummary(null); return; }
      const { rows, yearly, emi, totalMonths, totalInterest, originalInterest, payoffDate, n } = data;
      setSchedule(rows);
      setYearlySchedule(yearly);
      const originalData = extraPmt > 0 ? buildSchedule(principal, rate, term, 0) : null;
      const monthsSaved = originalData ? originalData.totalMonths - totalMonths : 0;
      const interestSaved = originalData ? originalData.totalInterest - totalInterest : 0;
      setSummary({ emi, totalMonths, totalInterest, originalInterest, payoffDate, n, monthsSaved, interestSaved, extraPmt });
      const chartData = yearly.filter((_, i) => i % Math.max(1, Math.floor(yearly.length / 15)) === 0).map(y => ({
        year: "Yr " + y.year,
        "Principal": Math.round(y.principal),
        "Interest": Math.round(y.interest),
      }));
      const chart = { type: "area", data: chartData, keys: ["Principal", "Interest"] };
      const stats = [
        { label: "Base Monthly Payment", value: fm(Math.round(emi)) },
        { label: "Total Interest Paid", value: fm(Math.round(totalInterest)), warn: true },
        { label: "Total Cost of Loan", value: fm(Math.round(totalInterest + principal)) },
        { label: "Payoff Date", value: payoffDate.toLocaleDateString("en-US", { month: "long", year: "numeric" }) },
        extraPmt > 0 ? { label: "Interest Saved", value: fm(Math.round(interestSaved)), highlight: true } : null,
        extraPmt > 0 ? { label: "Time Saved", value: monthsSaved + " months (" + (monthsSaved / 12).toFixed(1) + " yrs)", highlight: true } : null,
      ].filter(Boolean);
      const insights = extraPmt > 0
        ? [{ type: "tip", msg: "Extra " + fm(extraPmt) + "/mo saves " + fm(Math.round(interestSaved)) + " in interest and pays off " + (monthsSaved / 12).toFixed(1) + " years early!" }]
        : [{ type: "tip", msg: "Try adding an extra payment above to instantly see how much interest and time you save. Even $100/mo can save tens of thousands!" }];
      const breakdowns = [
        { label: "Loan Amount", value: fm(principal) },
        { label: "Annual Rate", value: rate + "%" },
        { label: "Term", value: term + " years (" + n + " months)" },
        { label: "Interest-to-Principal Ratio", value: (totalInterest / principal * 100).toFixed(0) + "%" },
      ];
      setRes(buildResult("Monthly Payment", fm(Math.round(emi + extraPmt)), stats, insights, chart, breakdowns));
    }, 100);
    return () => clearTimeout(timer);
  }, [principal, rate, term, extra]);

  const exportCSV = (mode) => {
    let csv, filename;
    if (mode === "monthly") {
      csv = "Month,Year,Payment,Principal,Interest,Balance,Cumulative Interest\\n" +
        schedule.map(r => [r.month, r.year, r.payment.toFixed(2), r.principal.toFixed(2), r.interest.toFixed(2), r.balance.toFixed(2), r.cumInterest.toFixed(2)].join(",")).join("\\n");
      filename = "amortization-monthly.csv";
    } else {
      csv = "Year,Total Payment,Principal Paid,Interest Paid,Ending Balance\\n" +
        yearlySchedule.map(y => [y.year, y.payment, y.principal, y.interest, y.balance].join(",")).join("\\n");
      filename = "amortization-yearly.csv";
    }
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const copyCSV = () => {
    const csv = "Month,Payment,Principal,Interest,Balance\\n" +
      schedule.map(r => r.month + "," + r.payment.toFixed(2) + "," + r.principal.toFixed(2) + "," + r.interest.toFixed(2) + "," + r.balance.toFixed(2)).join("\\n");
    navigator.clipboard.writeText(csv).then(() => {
      setCopiedMsg("Copied!");
      setTimeout(() => setCopiedMsg(""), 2000);
    });
  };

  const saveScenario = () => {
    if (!summary) return;
    const s = {
      id: Date.now(),
      label: sym + (principal / 1000).toFixed(0) + "K @ " + rate + "% / " + term + "yr" + (summary.extraPmt > 0 ? " +" + sym + summary.extraPmt + "/mo" : ""),
      principal, rate, term, extra: summary.extraPmt,
      emi: Math.round(summary.emi),
      totalInterest: Math.round(summary.totalInterest),
      months: summary.totalMonths,
    };
    setScenarios(prev => [...prev.slice(-2), s]);
  };

  const displayRows = viewMode === "yearly" ? yearlySchedule : schedule;
  const visibleRows = showAll ? displayRows : displayRows.slice(0, viewMode === "yearly" ? 10 : 12);
  const pct = summary && summary.extraPmt > 0 ? (summary.totalInterest / summary.originalInterest * 100).toFixed(0) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Presets items={[
            { label: "Home 30yr", v: { p: 350000, r: 6.75, y: 30, e: 0 } },
            { label: "Home 15yr", v: { p: 350000, r: 6.25, y: 15, e: 0 } },
            { label: "Car Loan", v: { p: 35000, r: 7.5, y: 5, e: 0 } },
            { label: "Personal", v: { p: 15000, r: 10.5, y: 3, e: 100 } },
          ]} onApply={p => { setPrincipal(p.v.p); setRate(p.v.r); setTerm(p.v.y); setExtra(String(p.v.e)); setShowAll(false); }} />
          <Sl label="Loan Amount" id="am_p" min={5000} max={2000000} step={5000} value={principal} onChange={v => { setPrincipal(v); setShowAll(false); }} fmt={v => fmSlider(v)} />
          <Sl label="Annual Interest Rate" id="am_r" min={1} max={20} step={0.05} value={rate} onChange={v => { setRate(v); setShowAll(false); }} fmt={v => v + "%"} />
          <Sl label="Loan Term" id="am_t" min={1} max={40} value={term} onChange={v => { setTerm(v); setShowAll(false); }} fmt={v => v + " yr" + (v > 1 ? "s" : "")} />
          <N label="Extra Monthly Payment" id="am_ex" value={extra} onChange={v => { setExtra(v); setShowAll(false); }} unit={sym} placeholder="0" hint="Every extra dollar goes 100% to principal" />

          {summary && summary.extraPmt > 0 && (
            <div style={{ marginTop: 14, padding: "12px 14px", background: "linear-gradient(135deg,rgba(34,197,94,0.08),rgba(16,185,129,0.05))", borderRadius: "var(--r-lg)", border: "1px solid rgba(34,197,94,0.25)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--success)" }}>Extra Payment Impact</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--success)" }}>{pct}% of original interest</span>
              </div>
              <div style={{ height: 6, borderRadius: 99, background: "var(--border)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: pct + "%", background: "linear-gradient(90deg,var(--success),var(--brand))", borderRadius: 99, transition: "width .4s" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: "var(--text3)" }}>
                <span>Saved: <strong style={{ color: "var(--success)" }}>{fm(Math.round(summary.interestSaved))}</strong></span>
                <span>Payoff {(summary.monthsSaved / 12).toFixed(1)} yrs early</span>
              </div>
            </div>
          )}

          <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
            <button onClick={saveScenario} style={{ flex: 1, padding: "9px 14px", borderRadius: "var(--r-md)", background: "var(--surface2)", border: "1.5px solid var(--border)", fontSize: 12, fontWeight: 700, color: "var(--brand)", cursor: "pointer" }}>
              Save Scenario
            </button>
            {scenarios.length > 0 && (
              <button onClick={() => setScenarios([])} style={{ padding: "9px 14px", borderRadius: "var(--r-md)", background: "var(--surface2)", border: "1.5px solid var(--border)", fontSize: 12, fontWeight: 700, color: "var(--text3)", cursor: "pointer" }}>
                Clear
              </button>
            )}
          </div>

          {scenarios.length > 0 && (
            <div style={{ marginTop: 10, borderRadius: "var(--r-lg)", border: "1.5px solid var(--border)", overflow: "hidden" }}>
              <div style={{ padding: "9px 14px", background: "var(--surface2)", borderBottom: "1px solid var(--border)", fontSize: 12, fontWeight: 700, color: "var(--text2)" }}>
                Saved Scenarios ({scenarios.length}/3)
              </div>
              {scenarios.map((s, i) => (
                <div key={s.id} style={{ padding: "10px 14px", borderBottom: i < scenarios.length - 1 ? "1px solid var(--border)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>{s.label}</p>
                    <p style={{ fontSize: 11, color: "var(--text3)" }}>{sym}{s.emi}/mo · Interest: {fm(s.totalInterest)} · {s.months} months</p>
                  </div>
                  <button onClick={() => { setPrincipal(s.principal); setRate(s.rate); setTerm(s.term); setExtra(String(s.extra)); }}
                    style={{ fontSize: 11, padding: "4px 10px", borderRadius: "var(--r-md)", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--brand)", cursor: "pointer", fontWeight: 700 }}>
                    Load
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sticky-res">
          <Panel result={res} loading={null} label="Amortization" />
        </div>
      </div>

      {displayRows.length > 0 && (
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "var(--r-xl)", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderBottom: "1px solid var(--border)", background: "var(--surface2)", flexWrap: "wrap", gap: 10 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Amortization Schedule</p>
              <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>
                {schedule.length} months · {yearlySchedule.length} years · Payoff: {summary && summary.payoffDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", border: "1.5px solid var(--border)", borderRadius: "var(--r-md)", overflow: "hidden" }}>
                {["yearly", "monthly"].map(v => (
                  <button key={v} onClick={() => { setViewMode(v); setShowAll(false); }}
                    style={{ padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", border: "none", background: viewMode === v ? "var(--brand)" : "transparent", color: viewMode === v ? "#fff" : "var(--text2)" }}>
                    {v === "yearly" ? "Yearly" : "Monthly"}
                  </button>
                ))}
              </div>
              <button onClick={copyCSV} style={{ fontSize: 11, fontWeight: 700, padding: "6px 12px", borderRadius: "var(--r-md)", border: "1.5px solid var(--border)", background: "var(--surface)", color: copiedMsg ? "var(--success)" : "var(--brand)", cursor: "pointer", minWidth: 90 }}>
                {copiedMsg ? copiedMsg : "Copy CSV"}
              </button>
              <button onClick={() => exportCSV(viewMode)} style={{ fontSize: 11, fontWeight: 700, padding: "6px 12px", borderRadius: "var(--r-md)", border: "1.5px solid var(--border)", background: "var(--surface)", color: "var(--text2)", cursor: "pointer" }}>
                Download CSV
              </button>
            </div>
          </div>

          {summary && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", borderBottom: "1px solid var(--border)" }}>
              {[
                { label: "Monthly Payment", value: fm(Math.round(summary.emi + summary.extraPmt)), color: "var(--brand)" },
                { label: "Total Principal", value: fm(principal), color: "var(--success)" },
                { label: "Total Interest", value: fm(Math.round(summary.totalInterest)), color: "#ef4444" },
                { label: "Total Cost", value: fm(Math.round(principal + summary.totalInterest)), color: "var(--text)" },
              ].map((s, i) => (
                <div key={i} style={{ padding: "10px 16px", borderRight: i < 3 ? "1px solid var(--border)" : "none", textAlign: "center" }}>
                  <p style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 600, marginBottom: 4 }}>{s.label}</p>
                  <p style={{ fontSize: 15, fontWeight: 800, color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>
          )}

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--surface2)" }}>
                  {(viewMode === "yearly"
                    ? ["Year", "Annual Payment", "Principal", "Interest", "Balance", "Principal %"]
                    : ["Month", "Payment", "Principal", "Interest", "Balance"]
                  ).map((h, hi) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: hi === 0 ? "center" : "right", fontWeight: 700, color: "var(--text2)", fontSize: 11, textTransform: "uppercase", letterSpacing: ".05em", whiteSpace: "nowrap", borderBottom: "2px solid var(--border)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row, i) => {
                  const principalPct = row.principal / (row.interest + row.principal) * 100;
                  return (
                    <tr key={viewMode === "yearly" ? row.year : row.month}
                      style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.015)" }}>
                      <td style={{ padding: "9px 16px", textAlign: "center", color: "var(--text3)", fontWeight: 700, fontSize: 12 }}>
                        {viewMode === "yearly" ? "Yr " + row.year : row.month}
                      </td>
                      <td style={{ padding: "9px 16px", textAlign: "right", color: "var(--text)", fontWeight: 600 }}>
                        {fm(viewMode === "yearly" ? row.payment : Math.round(row.payment))}
                      </td>
                      <td style={{ padding: "9px 16px", textAlign: "right", color: "var(--success)", fontWeight: 700 }}>
                        {fm(viewMode === "yearly" ? row.principal : Math.round(row.principal))}
                      </td>
                      <td style={{ padding: "9px 16px", textAlign: "right", color: "#ef4444", fontWeight: 700 }}>
                        {fm(viewMode === "yearly" ? row.interest : Math.round(row.interest))}
                      </td>
                      <td style={{ padding: "9px 16px", textAlign: "right", color: "var(--text)", fontWeight: 600 }}>
                        {fm(viewMode === "yearly" ? row.balance : Math.round(row.balance))}
                      </td>
                      {viewMode === "yearly" && (
                        <td style={{ padding: "9px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ flex: 1, height: 6, borderRadius: 99, background: "rgba(239,68,68,0.15)", overflow: "hidden" }}>
                              <div style={{ height: "100%", width: principalPct.toFixed(0) + "%", background: "var(--success)", borderRadius: 99 }} />
                            </div>
                            <span style={{ fontSize: 10, color: "var(--text3)", minWidth: 28, fontWeight: 700 }}>{principalPct.toFixed(0)}%</span>
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
            <div style={{ padding: "14px", textAlign: "center", borderTop: "1px solid var(--border)", background: "var(--surface2)" }}>
              <button onClick={() => setShowAll(!showAll)} style={{ fontSize: 13, fontWeight: 700, color: "var(--brand)", background: "transparent", border: "1.5px solid var(--brand)", borderRadius: "var(--r-md)", padding: "8px 22px", cursor: "pointer" }}>
                {showAll ? "Collapse Table" : "Show All " + displayRows.length + (viewMode === "yearly" ? " Years" : " Months")}
              </button>
            </div>
          )}
        </div>
      )}

      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "28px 24px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 16 }}>What Is an Amortization Schedule?</h2>
        <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.75, marginBottom: 18 }}>
          An <strong>amortization schedule</strong> is a complete table showing each loan payment broken down into principal and interest portions. While your monthly payment stays constant, the split shifts dramatically over time — early payments are mostly interest, while late payments are mostly principal.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: 20 }}>
          {[
            { icon: "📐", title: "The EMI Formula", desc: "EMI = P x r x (1+r)^n / [(1+r)^n - 1] — where P = principal, r = monthly rate, n = total payments." },
            { icon: "💡", title: "Early vs Late", desc: "In year 1 of a 30-year mortgage, ~80% of each payment is interest. By year 25, ~80% goes to principal." },
            { icon: "⚡", title: "Extra Payment Power", desc: "Extra payments go 100% to principal. $200/mo extra on a $300K loan saves $60,000+ in interest." },
            { icon: "📅", title: "Yearly vs Monthly", desc: "Use yearly view for a big-picture overview. Switch to monthly to see the exact breakdown of every payment." },
          ].map((item, i) => (
            <div key={i} style={{ padding: "14px 16px", background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>{item.title}</p>
              <p style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 18px", background: "rgba(99,102,241,0.06)", borderRadius: "var(--r-lg)", border: "1px solid rgba(99,102,241,0.2)" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--brand)", marginBottom: 8 }}>Pro Tips to Save on Your Loan</p>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {["Bi-weekly payments (26/year instead of 12) add one extra monthly payment per year — shaving years off your loan.",
              "Round up your payment to the nearest $50 or $100 — a tiny change with massive long-term savings.",
              "Apply tax refunds or bonuses as lump-sum principal payments for the fastest interest reduction.",
              "Refinancing to a lower rate when rates drop can save thousands — compare with our Mortgage Payoff calculator."
            ].map((tip, i) => (
              <li key={i} style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.7, marginBottom: 4 }}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

`;

// Replace lines startIdx to endIdx (exclusive) with new code
const before = lines.slice(0, startIdx).join('\n');
const after = lines.slice(endIdx).join('\n');
const result = before + '\n' + newCode + after;

writeFileSync(filePath, result, 'utf8');
console.log('AmortizationForm replaced successfully. File lines:', result.split('\n').length);
