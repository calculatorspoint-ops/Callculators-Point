// @ts-nocheck
import { useState, useEffect } from "react";
import {
  N, Sl, Sel, Tabs, Row2, Row3, Presets,
  Panel, buildResult, useCurrency,
  InputSection, SEOSection, FinanceLayout
} from './SharedComponents';

// ─── Stock Return ────────────────────────────────────────────────────────────
export function StockReturnForm() {
  const { fm, sym } = useCurrency();
  const [buyPrice, setBuyPrice] = useState(1000);
  const [sellPrice, setSellPrice] = useState(1500);
  const [shares, setShares] = useState(100);
  const [holdMonths, setHoldMonths] = useState(18);
  const [brokerage, setBrokerage] = useState("0.5");
  const [taxRate, setTaxRate] = useState("15");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const invested = buyPrice * shares;
    const proceeds = sellPrice * shares;
    const grossGain = proceeds - invested;
    const brokerageAmt = (invested + proceeds) * (+brokerage / 100);
    const taxAmt = grossGain > 0 ? grossGain * (+taxRate / 100) : 0;
    const netGain = grossGain - brokerageAmt - taxAmt;
    const roi = (grossGain / invested) * 100;
    const netRoi = (netGain / invested) * 100;
    const cagr = holdMonths > 0 ? (Math.pow(proceeds / invested, 12 / holdMonths) - 1) * 100 : 0;
    const niftyReturn = holdMonths / 12 * 12; // ~12% Nifty annual

    setRes(buildResult("Net Return", fm(Math.round(netGain)),
      [
        { label: "Amount Invested", value: fm(Math.round(invested)) },
        { label: "Gross Gain", value: fm(Math.round(grossGain)), highlight: grossGain > 0, warn: grossGain < 0 },
        { label: "Brokerage + Taxes", value: fm(Math.round(brokerageAmt + taxAmt)), warn: true },
        { label: "Net Gain (after costs)", value: fm(Math.round(netGain)), highlight: netGain > 0 },
        { label: "Gross ROI", value: roi.toFixed(2) + "%" },
        { label: "Annualized CAGR", value: cagr.toFixed(2) + "%" },
        { label: "Tax Rate Applied", value: holdMonths >= 12 ? "LTCG (" + taxRate + "%)" : "STCG (" + taxRate + "%)" },
        { label: "Effective tax", value: fm(Math.round(taxAmt)) },
      ],
      [{ type: netGain > 0 ? "tip" : "warn", msg: netGain > 0 ? "Net profit of " + fm(Math.round(netGain)) + " (" + netRoi.toFixed(1) + "% net ROI, " + cagr.toFixed(1) + "% CAGR). " + (cagr > niftyReturn ? "Beats Nifty 50 benchmark!" : "Underperforms Nifty 50 benchmark of ~" + niftyReturn.toFixed(0) + "%.") : "Loss of " + fm(Math.abs(Math.round(netGain))) + ". Consider tax-loss harvesting to offset other gains." }],
      { type: "donut", data: [{ name: "Net Gain", value: Math.max(0, Math.round(netGain)) }, { name: "Brokerage+Tax", value: Math.round(brokerageAmt + taxAmt) }, { name: "Principal", value: Math.round(invested) }], keys: ["value"] },
      []
    ));
  }, [buyPrice, sellPrice, shares, holdMonths, brokerage, taxRate]);

  const inputs = (
    <div className="calc-inputs-grid">
      <InputSection title="Trade Details" icon="📈" gradient="linear-gradient(135deg,#059669,#047857)">
        <Sl label="Buy Price per Share" id="sr_bp" min={10} max={100000} step={10} value={buyPrice} onChange={setBuyPrice} fmt={v => fm(v)} />
        <Sl label="Sell Price per Share" id="sr_sp" min={10} max={200000} step={10} value={sellPrice} onChange={setSellPrice} fmt={v => fm(v)} />
        <Sl label="Number of Shares" id="sr_sh" min={1} max={10000} step={10} value={shares} onChange={setShares} fmt={v => v + " shares"} />
        <Sl label="Holding Period (Months)" id="sr_hm" min={1} max={120} value={holdMonths} onChange={setHoldMonths} fmt={v => v + " months" + (v >= 12 ? " (LTCG)" : " (STCG)")} />
      </InputSection>
      <InputSection title="Costs & Tax" icon="🧾" gradient="linear-gradient(135deg,#7c3aed,#5b21b6)">
        <N label="Brokerage % (buy+sell)" id="sr_br" value={brokerage} onChange={setBrokerage} unit="%" placeholder="0.5" hint="Total brokerage + STT + other charges" />
        <Sel label="Tax Rate" id="sr_tx" value={taxRate} onChange={setTaxRate} opts={[{ v: "15", l: "15% STCG (< 12 months)" }, { v: "10", l: "10% LTCG (> 12 months)" }, { v: "30", l: "30% Speculative" }, { v: "0", l: "No Tax" }]} />
      </InputSection>
    </div>
  );
  return (
    <>
      <FinanceLayout
        accentClass="accent-invest"
        inputTitle="Stock Return"
        inputIcon="📈"
        inputContent={inputs}
        result={res}
        label="Stock Return"
      />
      <SEOSection title="Stock Return Calculator — CAGR, STCG & LTCG">
        <p>Equity STCG (Short Term Capital Gains, held &lt;12 months) is taxed at 15%. LTCG (Long Term, &gt;12 months) above ₹1L is taxed at 10% without indexation. Brokerage, STT, GST, and exchange fees eat into returns — always calculate net returns. Compare your CAGR vs Nifty 50 to assess if stock picking is adding value.</p>
      </SEOSection>
    </>
  );
}

// ─── NPV / IRR ───────────────────────────────────────────────────────────────
export function NPVForm() {
  const { fm, sym } = useCurrency();
  const [discountRate, setDiscountRate] = useState(10);
  const [initialInvestment, setInitialInvestment] = useState(1000000);
  const [cashFlows, setCashFlows] = useState(["300000", "400000", "400000", "350000", "300000"]);
  const [mode, setMode] = useState("NPV");
  const [res, setRes] = useState(null);

  function calcNPV(flows, rate, init) {
    let npv = -init;
    flows.forEach((cf, i) => { npv += +cf / Math.pow(1 + rate / 100, i + 1); });
    return npv;
  }

  function calcIRR(flows, init) {
    let lo = -50, hi = 500;
    for (let i = 0; i < 100; i++) {
      const mid = (lo + hi) / 2;
      const npv = calcNPV(flows, mid, init);
      if (Math.abs(npv) < 1) return mid;
      if (npv > 0) lo = mid; else hi = mid;
    }
    return (lo + hi) / 2;
  }

  useEffect(() => {
    const npv = calcNPV(cashFlows, discountRate, initialInvestment);
    const irr = calcIRR(cashFlows, initialInvestment);
    const totalInflows = cashFlows.reduce((s, c) => s + +c, 0);
    let cumulCF = -initialInvestment, paybackYr = null;
    cashFlows.forEach((cf, i) => {
      cumulCF += +cf;
      if (cumulCF >= 0 && paybackYr === null) paybackYr = i + 1;
    });
    const pi = totalInflows > 0 ? (npv + initialInvestment) / initialInvestment : 0;

    setRes(buildResult(mode === "NPV" ? "Net Present Value" : "Internal Rate of Return",
      mode === "NPV" ? fm(Math.round(npv)) : irr.toFixed(2) + "%",
      [
        { label: "Initial Investment", value: fm(initialInvestment) },
        { label: "NPV", value: fm(Math.round(npv)), highlight: npv > 0, warn: npv < 0 },
        { label: "IRR", value: irr.toFixed(2) + "%", highlight: irr > discountRate },
        { label: "Payback Period", value: paybackYr ? paybackYr + " years" : "Beyond " + cashFlows.length + " years", warn: !paybackYr },
        { label: "Profitability Index", value: pi.toFixed(3), highlight: pi > 1 },
        { label: "Decision", value: npv > 0 ? "✅ Accept (NPV > 0)" : "❌ Reject (NPV < 0)", highlight: npv > 0, warn: npv < 0 },
        { label: "Total Cash Inflows", value: fm(Math.round(totalInflows)) },
      ],
      [{ type: npv > 0 ? "tip" : "warn", msg: npv > 0 ? "NPV of " + fm(Math.round(npv)) + " means this investment creates value. IRR of " + irr.toFixed(1) + "% exceeds the hurdle rate of " + discountRate + "%." : "Negative NPV of " + fm(Math.round(npv)) + " — this project destroys value at a " + discountRate + "% discount rate." }],
      { type: "bar", data: cashFlows.map((cf, i) => ({ year: "Y" + (i + 1), "Cash Flow": +cf })), keys: ["Cash Flow"] },
      cashFlows.map((cf, i) => ({ label: "Year " + (i + 1) + " Cash Flow", value: fm(+cf) + " → PV: " + fm(Math.round(+cf / Math.pow(1 + discountRate / 100, i + 1))) }))
    ));
  }, [discountRate, initialInvestment, cashFlows, mode]);

  const inputs = (
    <div className="calc-inputs-grid">
      <InputSection title="Investment Parameters" icon="💰" gradient="linear-gradient(135deg,#059669,#047857)">
        <Tabs tabs={["NPV", "IRR"]} active={mode} onChange={setMode} />
        <Sl label="Initial Investment" id="npv_init" min={10000} max={100000000} step={10000} value={initialInvestment} onChange={setInitialInvestment} fmt={v => fm(v)} />
        <Sl label="Discount / Hurdle Rate (%)" id="npv_dr" min={1} max={30} step={0.5} value={discountRate} onChange={setDiscountRate} fmt={v => v + "% p.a."} />
      </InputSection>
      <InputSection title="Annual Cash Flows" icon="📊" gradient="linear-gradient(135deg,#4361ee,#3451c7)">
        {cashFlows.map((cf, i) => (
          <N key={i} label={"Year " + (i + 1) + " Cash Flow"} id={"npv_cf" + i} value={cf}
            onChange={v => { const n = [...cashFlows]; n[i] = String(v); setCashFlows(n); }}
            unit={sym} placeholder="0" hint="" />
        ))}
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setCashFlows(prev => [...prev, "0"])}
            style={{ flex: 1, padding: "8px", borderRadius: "var(--r-md)", border: "1.5px solid var(--brand)", color: "var(--brand)", background: "transparent", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "var(--font)" }}>
            + Add Year
          </button>
          {cashFlows.length > 1 && (
            <button onClick={() => setCashFlows(prev => prev.slice(0, -1))}
              style={{ flex: 1, padding: "8px", borderRadius: "var(--r-md)", border: "1.5px solid var(--border)", color: "var(--text3)", background: "transparent", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "var(--font)" }}>
              − Remove Year
            </button>
          )}
        </div>
      </InputSection>
    </div>
  );
  return (
    <>
      <FinanceLayout
        accentClass="accent-invest"
        inputTitle="NPV / IRR"
        inputIcon="💰"
        inputContent={inputs}
        result={res}
        label="NPV / IRR"
      />
      <SEOSection title="NPV & IRR — Capital Budgeting for Investment Decisions">
        <p>NPV (Net Present Value) discounts future cash flows to today's value. A positive NPV means the project earns more than the cost of capital — accept it. IRR is the rate that makes NPV = 0; if IRR &gt; your hurdle rate, the project is viable. Profitability Index &gt; 1 means the project creates value per rupee invested.</p>
      </SEOSection>
    </>
  );
}

// ─── Portfolio Rebalance ────────────────────────────────────────────────────
export function PortfolioRebalanceForm() {
  const { fm, sym } = useCurrency();
  const [assets, setAssets] = useState([
    { id: 1, name: "Equity", current: 600000, target: 60 },
    { id: 2, name: "Debt / Bonds", current: 200000, target: 25 },
    { id: 3, name: "Gold", current: 100000, target: 10 },
    { id: 4, name: "Cash", current: 100000, target: 5 },
  ]);
  const [res, setRes] = useState(null);

  const totalValue = assets.reduce((s, a) => s + a.current, 0);

  useEffect(() => {
    if (totalValue <= 0) return;
    const rebalanced = assets.map(a => {
      const currentPct = (a.current / totalValue) * 100;
      const targetAmt = totalValue * (a.target / 100);
      const drift = currentPct - a.target;
      const action = drift > 0 ? "Sell " + fm(Math.abs(Math.round(a.current - targetAmt))) : "Buy " + fm(Math.abs(Math.round(targetAmt - a.current)));
      return { ...a, currentPct, drift, action, targetAmt: Math.round(targetAmt) };
    });

    const totalTarget = assets.reduce((s, a) => s + a.target, 0);
    const isValid = Math.abs(totalTarget - 100) < 1;

    setRes(buildResult("Portfolio Value", fm(Math.round(totalValue)),
      rebalanced.map(a => ({
        label: a.name,
        value: a.currentPct.toFixed(1) + "% (target " + a.target + "%)",
        highlight: Math.abs(a.drift) < 2,
        warn: Math.abs(a.drift) > 5
      })),
      [{ type: Math.max(...rebalanced.map(a => Math.abs(a.drift))) > 5 ? "warn" : "tip", msg: "Largest drift: " + rebalanced.reduce((max, a) => Math.abs(a.drift) > Math.abs(max.drift) ? a : max, rebalanced[0]).name + " at " + rebalanced.reduce((max, a) => Math.abs(a.drift) > Math.abs(max.drift) ? a : max, rebalanced[0]).drift.toFixed(1) + "%. " + (Math.max(...rebalanced.map(a => Math.abs(a.drift))) > 5 ? "Portfolio needs rebalancing!" : "Portfolio is well balanced.") }],
      { type: "donut", data: rebalanced.map(a => ({ name: a.name, value: a.current })), keys: ["value"] },
      rebalanced.map(a => ({ label: a.name, value: a.action + " (currently " + a.currentPct.toFixed(1) + "% → target " + a.target + "%)", bold: Math.abs(a.drift) > 5 }))
    ));
  }, [assets]);

  const updateAsset = (id, field, value) =>
    setAssets(prev => prev.map(a => a.id === id ? { ...a, [field]: field === "name" ? value : +value } : a));

  const inputs = (
    <InputSection title="Asset Allocation" icon="🥧" gradient="linear-gradient(135deg,#059669,#047857)">
      <p style={{ fontSize: 11, color: "var(--text3)", marginBottom: 12, fontWeight: 600 }}>
        Total target must sum to 100% (currently: {assets.reduce((s, a) => s + a.target, 0)}%)
      </p>
      {assets.map(a => (
        <div key={a.id} style={{ marginBottom: 12, padding: "10px 12px", background: "var(--surface2)", borderRadius: "var(--r-md)", border: "1.5px solid var(--border)" }}>
          <input value={a.name} onChange={e => updateAsset(a.id, "name", e.target.value)}
            style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", background: "transparent", border: "none", outline: "none", width: "100%", marginBottom: 8 }} />
          <Row2>
            <N label="Current Value" id={"pr_cv" + a.id} value={String(a.current)} onChange={v => updateAsset(a.id, "current", v)} unit={sym} placeholder="0" hint="" />
            <N label="Target %" id={"pr_tp" + a.id} value={String(a.target)} onChange={v => updateAsset(a.id, "target", v)} unit="%" placeholder="25" hint="" />
          </Row2>
        </div>
      ))}
    </InputSection>
  );
  return (
    <>
      <FinanceLayout
        accentClass="accent-invest"
        inputTitle="Portfolio Rebalance"
        inputIcon="🥧"
        inputContent={inputs}
        result={res}
        label="Portfolio Rebalance"
      />
      <SEOSection title="Portfolio Rebalancing — When and How">
        <p>Rebalance annually or when any asset class drifts more than 5% from target. In a rising equity market, equities often overshoot — selling them to buy debt/gold locks in gains and reduces risk. Tax-efficient rebalancing: use new contributions to buy underweight assets first, then sell overweight assets if needed.</p>
      </SEOSection>
    </>
  );
}

// ─── Dividend Yield ──────────────────────────────────────────────────────────
export function DividendYieldForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [stockPrice, setStockPrice] = useState(500);
  const [annualDividend, setAnnualDividend] = useState(25);
  const [shares, setShares] = useState(500);
  const [growthRate, setGrowthRate] = useState(8);
  const [years, setYears] = useState(10);
  const [res, setRes] = useState(null);

  useEffect(() => {
    const invested = stockPrice * shares;
    const yieldPct = (annualDividend / stockPrice) * 100;
    const annualIncome = annualDividend * shares;
    const monthlyIncome = annualIncome / 12;

    let totalDividends = 0, dividend = annualDividend;
    for (let y = 0; y < years; y++) {
      totalDividends += dividend * shares;
      dividend *= (1 + growthRate / 100);
    }
    const yieldOnCost = (dividend / stockPrice) * 100;
    const futureAnnualIncome = dividend * shares;

    const yearlyData = [];
    let div = annualDividend;
    for (let y = 1; y <= years; y++) {
      yearlyData.push({ label: "Year " + y, value: fm(Math.round(div * shares)) });
      div *= (1 + growthRate / 100);
    }

    setRes(buildResult("Dividend Yield", yieldPct.toFixed(2) + "%",
      [
        { label: "Amount Invested", value: fm(Math.round(invested)) },
        { label: "Annual Dividend Income", value: fm(Math.round(annualIncome)), highlight: true },
        { label: "Monthly Income", value: fm(Math.round(monthlyIncome)) },
        { label: "Dividend Growth Rate", value: growthRate + "% p.a." },
        { label: "Yield-on-Cost after " + years + " yrs", value: yieldOnCost.toFixed(2) + "%", highlight: yieldOnCost > 5 },
        { label: "Future Annual Income", value: fm(Math.round(futureAnnualIncome)) },
        { label: "Total Dividends over " + years + " yrs", value: fm(Math.round(totalDividends)) },
      ],
      [{ type: "tip", msg: "Dividend yield: " + yieldPct.toFixed(1) + "%. With " + growthRate + "% annual dividend growth, your yield-on-cost rises to " + yieldOnCost.toFixed(1) + "% in " + years + " years. Total dividends: " + fm(Math.round(totalDividends)) + " — " + (totalDividends > invested ? "full capital recovery!" : (totalDividends / invested * 100).toFixed(0) + "% of capital recovered.") }],
      null, yearlyData
    ));
  }, [stockPrice, annualDividend, shares, growthRate, years]);

  const inputs = (
    <div className="calc-inputs-grid">
      <InputSection title="Stock Details" icon="📊" gradient="linear-gradient(135deg,#059669,#047857)">
        <Sl label="Stock Price" id="dy_sp" min={10} max={10000} step={10} value={stockPrice} onChange={setStockPrice} fmt={v => fm(v)} />
        <Sl label="Annual Dividend per Share" id="dy_adps" min={0.5} max={500} step={0.5} value={annualDividend} onChange={setAnnualDividend} fmt={v => fm(v) + "/share"} />
        <Sl label="Number of Shares" id="dy_sh" min={10} max={10000} step={10} value={shares} onChange={setShares} fmt={v => v + " shares"} />
      </InputSection>
      <InputSection title="Growth Assumptions" icon="📈" gradient="linear-gradient(135deg,#4361ee,#3451c7)">
        <Sl label="Dividend Growth Rate %" id="dy_gr" min={0} max={25} step={0.5} value={growthRate} onChange={setGrowthRate} fmt={v => v + "% p.a."} />
        <Sl label="Years to Project" id="dy_y" min={1} max={30} value={years} onChange={setYears} fmt={v => v + " years"} />
      </InputSection>
    </div>
  );
  return (
    <>
      <FinanceLayout
        accentClass="accent-invest"
        inputTitle="Dividend Yield"
        inputIcon="📊"
        inputContent={inputs}
        result={res}
        label="Dividend Yield"
      />
      <SEOSection title="Dividend Investing — Building Passive Income">
        <p>Dividend yield = Annual Dividend ÷ Stock Price × 100. Indian stocks yield 1–4% typically; high-yield stocks (PSU banks, coal, metals) yield 5–8%. Dividend growth investing means buying companies that consistently raise dividends — a 10% annual dividend growth doubles your income in 7 years. DDT (Dividend Distribution Tax) was abolished; dividends are now taxed at your slab rate.</p>
      </SEOSection>
    </>
  );
}
