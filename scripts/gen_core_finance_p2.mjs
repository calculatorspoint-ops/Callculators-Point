import { readFileSync, writeFileSync } from 'fs';
const existing = readFileSync('src/components/calculator-core/forms/CoreFinanceForms.jsx', 'utf8');

const SIP_FORM = `// ── SIP Calculator ───────────────────────────────────────────────────
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

`;

const SI_FORM = `// ── Simple Interest Calculator ───────────────────────────────────────
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

`;

const ROI_FORM = `// ── ROI Calculator ───────────────────────────────────────────────────
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

`;

const DISCOUNT_FORM = `// ── Discount Calculator ──────────────────────────────────────────────
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

`;

const PM_FORM = `// ── Profit Margin Calculator ─────────────────────────────────────────
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

`;

const BE_FORM = `// ── Break-Even Calculator ────────────────────────────────────────────
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

`;

writeFileSync('src/components/calculator-core/forms/CoreFinanceForms.jsx', existing + SIP_FORM + SI_FORM + ROI_FORM + DISCOUNT_FORM + PM_FORM + BE_FORM, 'utf8');
const totalLines = (existing + SIP_FORM + SI_FORM + ROI_FORM + DISCOUNT_FORM + PM_FORM + BE_FORM).split('\n').length;
console.log('Part 2 appended. Total lines now:', totalLines);
