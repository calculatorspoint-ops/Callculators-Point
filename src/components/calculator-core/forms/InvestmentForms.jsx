import { useState, useEffect } from "react";
import { L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency } from "./SharedComponents.jsx";

// ── Stock Return Calculator ───────────────────────────────────────────
export function StockReturnForm() {
  const { fm, sym } = useCurrency();
  const [buyPrice, setBuyPrice] = useState(100);
  const [sellPrice, setSellPrice] = useState(145);
  const [shares, setShares] = useState(100);
  const [buyDate, setBuyDate] = useState("2022-01-01");
  const [sellDate, setSellDate] = useState("2023-01-01");
  const [dividends, setDividends] = useState("0");
  const [brokerage, setBrokerage] = useState("0");
  const [taxes, setTaxes] = useState("0");
  const [res, setRes] = useState(null);

  useEffect(() => {
    if (!buyPrice || !sellPrice || !shares) return;
    const investment = buyPrice * shares;
    const grossReturn = (sellPrice - buyPrice) * shares;
    const divIncome = (+dividends || 0) * shares;
    const totalGross = grossReturn + divIncome;
    const brokerageAmt = +brokerage || 0;
    const taxAmt = totalGross > 0 ? totalGross * (+taxes / 100) : 0;
    const netProfit = totalGross - brokerageAmt - taxAmt;
    const roi = (netProfit / investment) * 100;
    const datesDiff = buyDate && sellDate ? (new Date(sellDate) - new Date(buyDate)) / (1000 * 60 * 60 * 24 * 365) : 1;
    const cagr = datesDiff > 0 ? (Math.pow((sellPrice + (+dividends || 0)) / buyPrice, 1 / datesDiff) - 1) * 100 : roi;
    const breakeven = buyPrice + brokerageAmt / shares;
    const vs500 = investment * Math.pow(1.10, datesDiff) - investment;
    const chart = { type: "bar", data: [{ name: "Your Gain", value: Math.round(netProfit) }, { name: "S&P 500 Est.", value: Math.round(vs500) }, { name: "Investment", value: Math.round(investment) }], keys: ["value"] };
    setRes(buildResult(netProfit >= 0 ? "Net Profit" : "Net Loss", fm(Math.abs(Math.round(netProfit))),
      [
        { label: "Investment (Cost)", value: fm(Math.round(investment)) },
        { label: "Gross Capital Gain", value: fm(Math.round(grossReturn)), highlight: grossReturn > 0, warn: grossReturn < 0 },
        { label: "Dividend Income", value: fm(Math.round(divIncome)) },
        { label: "Brokerage Fees", value: fm(brokerageAmt), warn: brokerageAmt > 0 },
        { label: "Tax on Gains", value: fm(Math.round(taxAmt)), warn: taxAmt > 0 },
        { label: "Net Profit/Loss", value: fm(Math.round(netProfit)), highlight: netProfit > 0, warn: netProfit < 0 },
        { label: "Total ROI", value: roi.toFixed(2) + "%" },
        { label: "Annualized CAGR", value: cagr.toFixed(2) + "% p.a." },
        { label: "Break-even Price", value: fm(Math.round(breakeven)) },
        { label: "vs S&P 500 (10%/yr)", value: fm(Math.round(vs500)) },
      ],
      [{ type: netProfit > vs500 ? "tip" : "warn", msg: netProfit > 0 ? "CAGR of " + cagr.toFixed(1) + "% " + (cagr > 10 ? "beats the S&P 500 average! Great stock pick." : "is below S&P 500 average (10%). Index funds may serve better.") : "This trade resulted in a loss. Average down or cut losses based on your conviction." }],
      chart,
      [{ label: "Holding Period", value: datesDiff.toFixed(1) + " years" }, { label: "Return per Share", value: fm(Math.round(netProfit / shares)) }]
    ));
  }, [buyPrice, sellPrice, shares, buyDate, sellDate, dividends, brokerage, taxes]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Presets items={[
            { label: "Quick Trade", v: { bp: 100, sp: 130, sh: 50, div: 0, brok: 100, tax: 15 } },
            { label: "Dividend Stock", v: { bp: 500, sp: 600, sh: 100, div: 20, brok: 500, tax: 15 } },
            { label: "Long-term Hold", v: { bp: 200, sp: 450, sh: 500, div: 10, brok: 1000, tax: 10 } },
          ]} onApply={pr => { setBuyPrice(pr.v.bp); setSellPrice(pr.v.sp); setShares(pr.v.sh); setDividends(String(pr.v.div)); setBrokerage(String(pr.v.brok)); setTaxes(String(pr.v.tax)); }} />
          <Row2>
            <N label="Buy Price/Share" id="sr_bp" value={String(buyPrice)} onChange={v => setBuyPrice(+v)} unit={sym} placeholder="100" hint="Cost per share" />
            <N label="Sell Price/Share" id="sr_sp" value={String(sellPrice)} onChange={v => setSellPrice(+v)} unit={sym} placeholder="145" hint="Exit price per share" />
          </Row2>
          <Sl label="Number of Shares" id="sr_sh" min={1} max={100000} step={1} value={shares} onChange={setShares} fmt={v => v + " shares"} />
          <Row2>
            <N label="Buy Date" id="sr_bd" value={buyDate} onChange={setBuyDate} unit="" placeholder="YYYY-MM-DD" hint="Entry date" />
            <N label="Sell Date" id="sr_sd" value={sellDate} onChange={setSellDate} unit="" placeholder="YYYY-MM-DD" hint="Exit date" />
          </Row2>
          <N label="Annual Dividend/Share" id="sr_div" value={dividends} onChange={setDividends} unit={sym} placeholder="0" hint="Per share dividend received yearly" />
          <N label="Total Brokerage Fees" id="sr_brok" value={brokerage} onChange={setBrokerage} unit={sym} placeholder="0" hint="Entry + exit brokerage charges" />
          <N label="Tax on Gains (%)" id="sr_tax" value={taxes} onChange={setTaxes} unit="%" placeholder="0" hint="Capital gains tax rate (LTCG/STCG)" />
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="Stock Return" /></div>
      </div>
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>Stock Return Breakdown</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75 }}>Total stock return includes capital appreciation (price change) + dividends received - brokerage fees - taxes. In India: STCG (< 1 year) = 15%, LTCG (> 1 year, above ₹1L) = 10%. Always calculate net returns after all costs to compare investments fairly.</p>
      </div>
    </div>
  );
}

// ── NPV / IRR Calculator ──────────────────────────────────────────────
export function NPVForm() {
  const { fm, sym } = useCurrency();
  const [initialInvestment, setInitialInvestment] = useState(500000);
  const [discountRate, setDiscountRate] = useState(10);
  const [cashflows, setCashflows] = useState(["100000", "150000", "200000", "250000", "300000"]);
  const [tab, setTab] = useState("NPV");
  const [res, setRes] = useState(null);

  function calcNPV(flows, rate, initial) {
    const r = rate / 100;
    let npv = -initial;
    for (let i = 0; i < flows.length; i++) {
      npv += +flows[i] / Math.pow(1 + r, i + 1);
    }
    return npv;
  }

  function calcIRR(flows, initial) {
    let lo = -0.99, hi = 10, irr = 0.1;
    for (let iter = 0; iter < 1000; iter++) {
      const mid = (lo + hi) / 2;
      const npv = calcNPV(flows, mid * 100, initial);
      if (Math.abs(npv) < 0.01) { irr = mid; break; }
      if (npv > 0) lo = mid; else hi = mid;
      irr = mid;
    }
    return irr * 100;
  }

  useEffect(() => {
    const validFlows = cashflows.filter(f => f !== "" && !isNaN(+f));
    if (!initialInvestment || validFlows.length === 0) return;
    const npv = calcNPV(validFlows, discountRate, initialInvestment);
    const irr = calcIRR(validFlows, initialInvestment);
    const pi = (npv + initialInvestment) / initialInvestment;
    let cumFlow = 0, paybackYears = 0;
    for (let i = 0; i < validFlows.length; i++) {
      cumFlow += +validFlows[i];
      if (cumFlow >= initialInvestment && !paybackYears) { paybackYears = i + 1 - (cumFlow - initialInvestment) / +validFlows[i]; }
    }
    const totalCashIn = validFlows.reduce((s, f) => s + +f, 0);
    const table = validFlows.map((f, i) => {
      const pv = +f / Math.pow(1 + discountRate / 100, i + 1);
      return { year: i + 1, cashflow: +f, pv: Math.round(pv) };
    });
    const chart = { type: "bar", data: table.map(t => ({ year: "Yr " + t.year, "Cash Flow": t.cashflow, "PV": t.pv })), keys: ["Cash Flow", "PV"] };
    setRes(buildResult(tab === "NPV" ? "Net Present Value" : "IRR", tab === "NPV" ? fm(Math.round(npv)) : irr.toFixed(2) + "%",
      [
        { label: "Initial Investment", value: fm(initialInvestment) },
        { label: "NPV", value: fm(Math.round(npv)), highlight: npv > 0, warn: npv < 0 },
        { label: "IRR", value: irr.toFixed(2) + "%" + (irr > discountRate ? " (Exceeds hurdle rate ✓)" : " (Below hurdle rate ✗)") },
        { label: "Profitability Index", value: pi.toFixed(3) + (pi > 1 ? " (Viable)" : " (Not viable)"), highlight: pi > 1 },
        { label: "Payback Period", value: paybackYears.toFixed(1) + " years" },
        { label: "Total Cash Inflows", value: fm(Math.round(totalCashIn)) },
      ],
      [{ type: npv > 0 ? "tip" : "warn", msg: npv > 0 ? "Positive NPV of " + fm(Math.round(npv)) + " means this investment creates value. IRR of " + irr.toFixed(1) + "% " + (irr > discountRate ? "exceeds your " + discountRate + "% hurdle rate." : "is below hurdle rate — reconsider.") : "Negative NPV of " + fm(Math.round(npv)) + " means this project destroys value at a " + discountRate + "% discount rate." }],
      chart,
      table.map(t => ({ label: "Year " + t.year + " PV", value: fm(t.pv) }))
    ));
  }, [initialInvestment, discountRate, cashflows, tab]);

  const updateCashflow = (index, value) => setCashflows(prev => prev.map((f, i) => i === index ? value : f));
  const addYear = () => setCashflows(prev => [...prev, ""]);
  const removeYear = () => setCashflows(prev => prev.slice(0, -1));

  return (
    <div className="space-y-6">
      <Tabs tabs={["NPV", "IRR"]} active={tab} onChange={setTab} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Presets items={[
            { label: "5yr Project", v: { inv: 500000, dr: 10, cfs: ["100000", "150000", "200000", "250000", "300000"] } },
            { label: "Risky Venture", v: { inv: 200000, dr: 15, cfs: ["0", "50000", "100000", "200000", "150000"] } },
            { label: "Real Estate", v: { inv: 5000000, dr: 8, cfs: ["400000", "420000", "441000", "463000", "486000"] } },
          ]} onApply={pr => { setInitialInvestment(pr.v.inv); setDiscountRate(pr.v.dr); setCashflows(pr.v.cfs); }} />
          <Sl label="Initial Investment" id="npv_inv" min={10000} max={10000000} step={10000} value={initialInvestment} onChange={setInitialInvestment} fmt={v => fm(v)} />
          <Sl label="Discount Rate / Hurdle Rate (%)" id="npv_dr" min={1} max={30} step={0.5} value={discountRate} onChange={setDiscountRate} fmt={v => v + "%"} />
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)", margin: "14px 0 6px" }}>Annual Cash Flows</p>
          {cashflows.map((cf, i) => (
            <N key={i} label={"Year " + (i + 1)} id={"npv_cf" + i} value={cf} onChange={v => updateCashflow(i, v)} unit={sym} placeholder="0" hint="" />
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={addYear} style={{ flex: 1, padding: "7px", borderRadius: "var(--r-md)", border: "1.5px solid var(--brand)", background: "transparent", color: "var(--brand)", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>+ Add Year</button>
            {cashflows.length > 1 && <button onClick={removeYear} style={{ flex: 1, padding: "7px", borderRadius: "var(--r-md)", border: "1.5px solid #ef4444", background: "transparent", color: "#ef4444", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>- Remove Year</button>}
          </div>
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="NPV/IRR" /></div>
      </div>
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>NPV & IRR Decision Rules</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75 }}><strong>NPV &gt; 0:</strong> Project adds value — accept. <strong>IRR &gt; Hurdle Rate:</strong> Returns exceed cost of capital — accept. <strong>Profitability Index &gt; 1:</strong> For every rupee invested, you get more than ₹1 in present value. NPV is generally preferred over IRR for capital budgeting decisions.</p>
      </div>
    </div>
  );
}

// ── Portfolio Rebalancing Calculator ─────────────────────────────────
export function PortfolioRebalanceForm() {
  const { fm, sym } = useCurrency();
  const [total, setTotal] = useState(1000000);
  const [assets, setAssets] = useState([
    { id: 1, name: "Equity", target: 60, current: 70 },
    { id: 2, name: "Debt", target: 25, current: 18 },
    { id: 3, name: "Gold", target: 10, current: 8 },
    { id: 4, name: "Cash", target: 5, current: 4 },
  ]);
  const [res, setRes] = useState(null);
  const [rebalanceTable, setRebalanceTable] = useState([]);

  useEffect(() => {
    const totalTarget = assets.reduce((s, a) => s + a.target, 0);
    if (Math.abs(totalTarget - 100) > 0.5) { setRes(buildResult("Error", "Targets must sum to 100%", [{ label: "Current Sum", value: totalTarget.toFixed(1) + "%" }], [{ type: "warn", msg: "Target allocations must sum to exactly 100%. Current sum: " + totalTarget.toFixed(1) + "%" }], null, [])); return; }
    const rows = assets.map(asset => {
      const currentValue = total * (asset.current / 100);
      const targetValue = total * (asset.target / 100);
      const diff = targetValue - currentValue;
      return { ...asset, currentValue: Math.round(currentValue), targetValue: Math.round(targetValue), diff: Math.round(diff), action: diff > 0 ? "Buy" : diff < 0 ? "Sell" : "Hold" };
    });
    setRebalanceTable(rows);
    const totalDrift = rows.reduce((s, r) => s + Math.abs(r.current - r.target), 0) / 2;
    const chart = { type: "donut", data: rows.map(r => ({ name: r.name + " (Target " + r.target + "%)", value: r.current })), keys: ["value"] };
    setRes(buildResult("Portfolio Drift", totalDrift.toFixed(1) + "%",
      [
        { label: "Total Portfolio", value: fm(total) },
        { label: "Rebalancing Needed", value: totalDrift > 5 ? "Yes (Drift: " + totalDrift.toFixed(1) + "%)" : "Minor adjustment only" },
        ...rows.map(r => ({ label: r.name + " → " + r.action, value: r.action !== "Hold" ? fm(Math.abs(r.diff)) : "No change", highlight: r.action === "Buy", warn: r.action === "Sell" })),
      ],
      [{ type: totalDrift > 5 ? "warn" : "tip", msg: totalDrift > 5 ? "Portfolio has drifted " + totalDrift.toFixed(0) + "% from targets. Rebalancing is recommended to maintain your risk profile." : "Portfolio is well-balanced. Only minor adjustments needed. Consider rebalancing annually." }],
      chart, []
    ));
  }, [total, assets]);

  const updateAsset = (id, field, value) => setAssets(prev => prev.map(a => a.id === id ? { ...a, [field]: field === "name" ? value : +value } : a));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Presets items={[
            { label: "Aggressive (80/20)", v: { assets: [{ id: 1, name: "Equity", target: 80, current: 75 }, { id: 2, name: "Debt", target: 15, current: 20 }, { id: 3, name: "Gold", target: 5, current: 5 }] } },
            { label: "Balanced (60/40)", v: { assets: [{ id: 1, name: "Equity", target: 60, current: 70 }, { id: 2, name: "Debt", target: 30, current: 22 }, { id: 3, name: "Gold", target: 10, current: 8 }] } },
            { label: "Conservative (40/60)", v: { assets: [{ id: 1, name: "Equity", target: 40, current: 45 }, { id: 2, name: "Debt", target: 50, current: 45 }, { id: 3, name: "Gold", target: 10, current: 10 }] } },
          ]} onApply={pr => setAssets(pr.v.assets)} />
          <Sl label="Total Portfolio Value" id="pr_total" min={10000} max={50000000} step={10000} value={total} onChange={setTotal} fmt={v => fm(v)} />
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)", margin: "12px 0 6px" }}>Asset Allocation (Target % / Current %)</p>
          {assets.map(asset => (
            <div key={asset.id} style={{ padding: "10px 12px", background: "var(--surface2)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", marginBottom: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>{asset.name}</p>
              <Row2>
                <N label="Target %" id={"pr_t" + asset.id} value={String(asset.target)} onChange={v => updateAsset(asset.id, "target", v)} unit="%" placeholder="25" hint="Desired allocation" />
                <N label="Current %" id={"pr_c" + asset.id} value={String(asset.current)} onChange={v => updateAsset(asset.id, "current", v)} unit="%" placeholder="30" hint="Actual current allocation" />
              </Row2>
            </div>
          ))}
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="Portfolio" /></div>
      </div>
      {rebalanceTable.length > 0 && (
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "var(--r-xl)", overflow: "hidden" }}>
          <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", background: "var(--surface2)" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Rebalancing Actions Required</p>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--surface2)" }}>
                {["Asset", "Current Value", "Target Value", "Difference", "Action"].map((h, hi) => <th key={h} style={{ padding: "9px 14px", textAlign: hi === 0 ? "left" : "right", fontWeight: 700, color: "var(--text2)", fontSize: 11, textTransform: "uppercase", borderBottom: "2px solid var(--border)" }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rebalanceTable.map((row, i) => (
                <tr key={row.id} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.015)" }}>
                  <td style={{ padding: "9px 14px", fontWeight: 700, color: "var(--text)" }}>{row.name}</td>
                  <td style={{ padding: "9px 14px", textAlign: "right", color: "var(--text)", fontWeight: 600 }}>{fm(row.currentValue)}</td>
                  <td style={{ padding: "9px 14px", textAlign: "right", color: "var(--text)", fontWeight: 600 }}>{fm(row.targetValue)}</td>
                  <td style={{ padding: "9px 14px", textAlign: "right", color: row.diff > 0 ? "var(--success)" : row.diff < 0 ? "#ef4444" : "var(--text3)", fontWeight: 700 }}>{row.diff > 0 ? "+" : ""}{fm(row.diff)}</td>
                  <td style={{ padding: "9px 14px", textAlign: "right" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 99, background: row.action === "Buy" ? "rgba(34,197,94,0.12)" : row.action === "Sell" ? "rgba(239,68,68,0.1)" : "rgba(99,102,241,0.1)", color: row.action === "Buy" ? "var(--success)" : row.action === "Sell" ? "#ef4444" : "var(--brand)" }}>{row.action}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>Why Rebalance Your Portfolio?</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75 }}>Over time, asset classes drift from target allocations due to differential performance. A stock rally can push equity from 60% to 70%, increasing your risk exposure. Rebalancing restores your intended risk-return profile. Common triggers: quarterly/annual review, or when any asset drifts &gt;5% from target.</p>
      </div>
    </div>
  );
}

// ── Dividend Yield Calculator ─────────────────────────────────────────
export function DividendYieldForm() {
  const { fm, sym } = useCurrency();
  const [stockPrice, setStockPrice] = useState(500);
  const [annualDividend, setAnnualDividend] = useState(20);
  const [shares, setShares] = useState(200);
  const [growthRate, setGrowthRate] = useState(5);
  const [years, setYears] = useState(10);
  const [taxRate, setTaxRate] = useState("10");
  const [res, setRes] = useState(null);

  useEffect(() => {
    if (!stockPrice || !annualDividend) return;
    const yield_ = (annualDividend / stockPrice) * 100;
    const totalInvestment = stockPrice * shares;
    const annualIncome = annualDividend * shares;
    const futureDiv = annualDividend * Math.pow(1 + growthRate / 100, years);
    const yieldOnCost = (futureDiv / stockPrice) * 100;
    let totalDivReceived = 0;
    const table = Array.from({ length: Math.min(years, 15) }, (_, i) => {
      const yr = i + 1;
      const divPerShare = annualDividend * Math.pow(1 + growthRate / 100, yr);
      const income = divPerShare * shares;
      const afterTax = income * (1 - +taxRate / 100);
      totalDivReceived += afterTax;
      return { year: yr, divPerShare: Math.round(divPerShare * 100) / 100, income: Math.round(income), afterTax: Math.round(afterTax), cumulative: Math.round(totalDivReceived) };
    });
    const chart = { type: "bar", data: table.filter((_, i) => i % 2 === 0).map(t => ({ year: "Yr " + t.year, "Dividend Income": t.income })), keys: ["Dividend Income"] };
    const paybackYears = table.findIndex(t => t.cumulative >= totalInvestment);
    setRes(buildResult("Dividend Yield", yield_.toFixed(2) + "%",
      [
        { label: "Annual Dividend Income", value: fm(Math.round(annualIncome)), highlight: true },
        { label: "After-Tax Annual Income", value: fm(Math.round(annualIncome * (1 - +taxRate / 100))) },
        { label: "Yield on Cost (" + years + " yrs)", value: yieldOnCost.toFixed(2) + "%", highlight: true },
        { label: "Total Investment", value: fm(Math.round(totalInvestment)) },
        { label: "Total Dividends (" + years + " yrs after tax)", value: fm(Math.round(totalDivReceived)) },
        paybackYears >= 0 ? { label: "Payback via Dividends", value: "Year " + (paybackYears + 1) } : null,
      ].filter(Boolean),
      [{ type: "tip", msg: "At " + growthRate + "% dividend growth, yield-on-cost rises from " + yield_.toFixed(1) + "% today to " + yieldOnCost.toFixed(1) + "% in " + years + " years. Dividend compounding is powerful for passive income!" }],
      chart,
      [{ label: "Price", value: fm(stockPrice) }, { label: "Dividend/yr", value: fm(annualDividend) }, { label: "Shares", value: shares }]
    ));
  }, [stockPrice, annualDividend, shares, growthRate, years, taxRate]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Presets items={[
            { label: "Blue Chip (3% yield)", v: { sp: 1000, div: 30, sh: 100, gr: 5, y: 10 } },
            { label: "High Yield (6%)", v: { sp: 500, div: 30, sh: 200, gr: 3, y: 15 } },
            { label: "REIT (8%)", v: { sp: 300, div: 24, sh: 500, gr: 2, y: 20 } },
          ]} onApply={pr => { setStockPrice(pr.v.sp); setAnnualDividend(pr.v.div); setShares(pr.v.sh); setGrowthRate(pr.v.gr); setYears(pr.v.y); }} />
          <Sl label="Stock Price" id="dy_sp" min={1} max={50000} step={1} value={stockPrice} onChange={setStockPrice} fmt={v => fm(v)} />
          <Sl label="Annual Dividend per Share" id="dy_div" min={0.1} max={500} step={0.1} value={annualDividend} onChange={setAnnualDividend} fmt={v => fm(v) + "/share"} />
          <Sl label="Number of Shares" id="dy_sh" min={1} max={10000} step={1} value={shares} onChange={setShares} fmt={v => v + " shares"} />
          <Sl label="Dividend Growth Rate (%/yr)" id="dy_gr" min={0} max={20} step={0.5} value={growthRate} onChange={setGrowthRate} fmt={v => v + "%"} />
          <Sl label="Investment Horizon (Years)" id="dy_y" min={1} max={30} value={years} onChange={setYears} fmt={v => v + " yrs"} />
          <N label="Dividend Tax Rate (%)" id="dy_tax" value={taxRate} onChange={setTaxRate} unit="%" placeholder="10" hint="Tax on dividend income" />
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="Dividend Yield" /></div>
      </div>
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>Yield on Cost: The Power of Growing Dividends</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75 }}>Yield on Cost (YOC) is the dividend yield based on your original purchase price. A stock bought at ₹500 with ₹20 dividend has 4% yield. After 10 years of 8% dividend growth, the dividend is ₹43 — a YOC of 8.6% on your original investment. This is why long-term dividend investors build enormous passive income streams.</p>
      </div>
    </div>
  );
}
