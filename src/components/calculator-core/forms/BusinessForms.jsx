import { useState, useEffect, useRef } from "react";
import { L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency, formatMoney } from "./SharedComponents.jsx";
import { ScenarioCompare } from "@/components/calculator-core/ScenarioCompare.jsx";

// ─────────────────────────────────────────────────────────────────────────────
// 1. MARKUP CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────
export function MarkupForm() {
  const { fm, sym } = useCurrency();
  const [tab, setTab] = useState("Markup → Price");
  const [cost, setCost] = useState("100");
  const [markup, setMarkup] = useState("50");
  const [margin, setMargin] = useState("33.33");
  const [selling, setSelling] = useState("150");
  const [res, setRes] = useState(null);
  const [params, setParams] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      const c = Math.max(0.01, +cost);

      if (tab === "Markup → Price") {
        const mu = Math.max(0, +markup) / 100;
        const sp = c * (1 + mu);
        const mg = ((sp - c) / sp) * 100;
        const profit = sp - c;
        const chartData = [25, 50, 75, 100, 150, 200].map(pct => ({
          name: pct + "%",
          "Profit": Math.round(c * pct / 100),
          "Selling Price": Math.round(c * (1 + pct / 100)),
        }));
        const r = buildResult(
          "Selling Price", fm(sp),
          [
            { label: "Cost Price", value: fm(c) },
            { label: "Gross Profit", value: fm(profit), highlight: true },
            { label: "Profit Margin", value: mg.toFixed(2) + "%" },
            { label: "Markup %", value: markup + "%" },
          ],
          [
            { type: "tip", msg: `A ${markup}% markup yields a ${mg.toFixed(2)}% profit margin. Markup is always higher than margin for the same profit.` },
            { type: "info", msg: `Common confusion: 50% markup ≠ 50% margin. 50% markup = 33.3% margin.` },
          ],
          { type: "line", data: chartData, keys: ["Profit", "Selling Price"] },
          [
            { label: "Formula", value: `SP = Cost × (1 + Markup%)` },
            { label: "Selling Price", value: fm(sp) },
            { label: "Profit", value: fm(profit) },
            { label: "Margin", value: mg.toFixed(2) + "%" },
          ]
        );
        setRes(r);
        setParams({ cost, markup, tab });

      } else if (tab === "Margin → Markup") {
        const mg = Math.min(99.99, Math.max(0, +margin)) / 100;
        const mu = mg / (1 - mg);
        const sp = c / (1 - mg);
        const profit = sp - c;
        const r = buildResult(
          "Markup %", (mu * 100).toFixed(2) + "%",
          [
            { label: "Cost Price", value: fm(c) },
            { label: "Selling Price", value: fm(sp), highlight: true },
            { label: "Gross Profit", value: fm(profit) },
            { label: "Margin %", value: margin + "%" },
          ],
          [
            { type: "tip", msg: `A ${margin}% margin requires a ${(mu * 100).toFixed(2)}% markup on cost.` },
            { type: "info", msg: `Formula: Markup = Margin / (1 − Margin)` },
          ],
          null,
          [
            { label: "Markup Formula", value: `Markup = Margin ÷ (1 - Margin)` },
            { label: "Markup %", value: (mu * 100).toFixed(2) + "%" },
            { label: "Selling Price", value: fm(sp) },
          ]
        );
        setRes(r);
        setParams({ cost, margin, tab });

      } else {
        // Price → Margin
        const sp = Math.max(0.01, +selling);
        const mu = ((sp - c) / c) * 100;
        const mg = ((sp - c) / sp) * 100;
        const profit = sp - c;
        const r = buildResult(
          "Profit Margin", mg.toFixed(2) + "%",
          [
            { label: "Cost Price", value: fm(c) },
            { label: "Selling Price", value: fm(sp) },
            { label: "Markup %", value: mu.toFixed(2) + "%", highlight: true },
            { label: "Gross Profit", value: fm(profit) },
          ],
          [
            { type: sp > c ? "tip" : "warn", msg: sp > c ? `Profit: ${fm(profit)} — ${mg.toFixed(2)}% margin (${mu.toFixed(2)}% markup).` : `Selling below cost! You are losing ${fm(c - sp)} per unit.` },
          ],
          null,
          [
            { label: "Margin Formula", value: `Margin = (SP − Cost) ÷ SP` },
            { label: "Markup Formula", value: `Markup = (SP − Cost) ÷ Cost` },
            { label: "Profit per unit", value: fm(profit) },
          ]
        );
        setRes(r);
        setParams({ cost, selling, tab });
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [tab, cost, markup, margin, selling]);

  // Markup vs Margin reference table
  const refTable = [
    { mu: 25, mg: 20 }, { mu: 50, mg: 33.3 }, { mu: 100, mg: 50 },
    { mu: 200, mg: 66.7 }, { mu: 300, mg: 75 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Presets
          items={[
            { label: "Retail 50%", v: { tab: "Markup → Price", cost: "50", markup: "50", margin: "33.33", selling: "75" } },
            { label: "Wholesale 25%", v: { tab: "Markup → Price", cost: "200", markup: "25", margin: "20", selling: "250" } },
            { label: "Services 100%", v: { tab: "Markup → Price", cost: "150", markup: "100", margin: "50", selling: "300" } },
            { label: "Target 40% Margin", v: { tab: "Margin → Markup", cost: "80", markup: "66.67", margin: "40", selling: "133.33" } },
          ]}
          onApply={p => { setTab(p.v.tab); setCost(p.v.cost); setMarkup(p.v.markup); setMargin(p.v.margin); setSelling(p.v.selling); }}
        />
        <Tabs tabs={["Markup → Price", "Margin → Markup", "Price → Margin"]} active={tab} onChange={setTab} />
        <N label="Cost Price" id="mk-cost" value={cost} onChange={setCost} unit={sym} hint="Your cost to produce or buy this item" />
        {tab === "Markup → Price" && (
          <N label="Markup %" id="mk-markup" value={markup} onChange={setMarkup} unit="%" hint="Percentage added on top of cost" />
        )}
        {tab === "Margin → Markup" && (
          <N label="Target Margin %" id="mk-margin" value={margin} onChange={setMargin} unit="%" hint="Desired profit margin (max 99.99%)" />
        )}
        {tab === "Price → Margin" && (
          <N label="Selling Price" id="mk-selling" value={selling} onChange={setSelling} unit={sym} hint="Your final selling price" />
        )}

        {/* Markup vs Margin reference table */}
        <div style={{ marginTop: 16, padding: "12px 14px", background: "var(--surface2)", borderRadius: "var(--r-md)", border: "1px solid var(--border)" }}>
          <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text3)", marginBottom: 8 }}>
            📊 Markup vs Margin Reference
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0 }}>
            {["Markup %", "Margin %", "Example (Cost $100)"].map(h => (
              <span key={h} style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", padding: "4px 8px", borderBottom: "1px solid var(--border)" }}>{h}</span>
            ))}
            {refTable.map((r, i) => (
              [
                <span key={`mu-${i}`} style={{ fontSize: 12, fontWeight: 600, color: "var(--brand)", padding: "4px 8px", borderBottom: "1px solid var(--border)" }}>{r.mu}%</span>,
                <span key={`mg-${i}`} style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", padding: "4px 8px", borderBottom: "1px solid var(--border)" }}>{r.mg}%</span>,
                <span key={`ex-${i}`} style={{ fontSize: 12, fontWeight: 500, color: "var(--text3)", padding: "4px 8px", borderBottom: "1px solid var(--border)" }}>Sell {fm(100 * (1 + r.mu / 100))}</span>,
              ]
            ))}
          </div>
        </div>
      </div>
      <div className="sticky-res">
        <Panel result={res} loading={null} label="Markup" />
        <ScenarioCompare currentResult={res} currentParams={params} calcLabel="Markup" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. INVENTORY TURNOVER CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────
export function InventoryTurnoverForm() {
  const { fm, sym } = useCurrency();
  const [cogs, setCogs] = useState("500000");
  const [beginInv, setBeginInv] = useState("80000");
  const [endInv, setEndInv] = useState("60000");
  const [industry, setIndustry] = useState("retail");
  const [res, setRes] = useState(null);

  const BENCHMARKS = {
    retail:        { label: "Retail",        low: 8,  high: 12, ideal: 10 },
    grocery:       { label: "Grocery",       low: 15, high: 25, ideal: 20 },
    manufacturing: { label: "Manufacturing", low: 4,  high: 8,  ideal: 6  },
    ecommerce:     { label: "E-Commerce",    low: 6,  high: 10, ideal: 8  },
    wholesale:     { label: "Wholesale",     low: 5,  high: 9,  ideal: 7  },
    automotive:    { label: "Automotive",    low: 5,  high: 10, ideal: 7  },
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const c = +cogs, b = +beginInv, e = +endInv;
      if (!c || (b + e) === 0) { setRes(null); return; }
      const avgInv = (b + e) / 2;
      const turnover = c / avgInv;
      const daysInInv = 365 / turnover;
      const weeksOfSupply = 52 / turnover;
      const bench = BENCHMARKS[industry];
      const isGood = turnover >= bench.low;
      const isBad = turnover < bench.low * 0.7;

      const chartData = Object.entries(BENCHMARKS).map(([key, bm]) => ({
        name: bm.label,
        "Ideal": bm.ideal,
        "Your Rate": key === industry ? +turnover.toFixed(2) : null,
      }));

      const r = buildResult(
        "Inventory Turnover", turnover.toFixed(2) + "×",
        [
          { label: "Average Inventory", value: fm(Math.round(avgInv)) },
          { label: "Days in Inventory", value: Math.round(daysInInv) + " days", warn: daysInInv > 90 },
          { label: "Weeks of Supply", value: weeksOfSupply.toFixed(1) + " weeks" },
          { label: `${bench.label} Benchmark`, value: `${bench.low}–${bench.high}×`, highlight: isGood },
        ],
        [
          { type: isBad ? "warn" : isGood ? "tip" : "info", msg: isBad ? `Low turnover (${turnover.toFixed(2)}×) — stock is sitting ${Math.round(daysInInv)} days. Risk of obsolescence and high holding costs.` : isGood ? `Good turnover! ${turnover.toFixed(2)}× is within ${bench.label} benchmark (${bench.low}–${bench.high}×). Stock refreshes every ${Math.round(daysInInv)} days.` : `Turnover of ${turnover.toFixed(2)}× is below the ${bench.label} ideal of ${bench.ideal}×. Consider promotions or tighter purchasing.` },
          { type: "info", msg: `Weeks of Supply: ${weeksOfSupply.toFixed(1)} — how long your current inventory would last at this sales rate.` },
        ],
        { type: "bar", data: chartData, keys: ["Ideal"] },
        [
          { label: "COGS", value: fm(c) },
          { label: "Beginning Inventory", value: fm(b) },
          { label: "Ending Inventory", value: fm(e) },
          { label: "Average Inventory", value: fm(Math.round(avgInv)) },
          { label: "Turnover Ratio", value: turnover.toFixed(2) + "×" },
          { label: "Days in Inventory", value: Math.round(daysInInv) + " days" },
          { label: "Weeks of Supply", value: weeksOfSupply.toFixed(1) + " wks" },
        ]
      );
      setRes(r);
    }, 150);
    return () => clearTimeout(timer);
  }, [cogs, beginInv, endInv, industry]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Presets
          items={[
            { label: "Retail Store", v: { cogs: "500000", beginInv: "80000", endInv: "60000", industry: "retail" } },
            { label: "Grocery", v: { cogs: "2000000", beginInv: "120000", endInv: "100000", industry: "grocery" } },
            { label: "Manufacturer", v: { cogs: "1000000", beginInv: "200000", endInv: "180000", industry: "manufacturing" } },
            { label: "E-Commerce", v: { cogs: "300000", beginInv: "50000", endInv: "40000", industry: "ecommerce" } },
          ]}
          onApply={p => { setCogs(p.v.cogs); setBeginInv(p.v.beginInv); setEndInv(p.v.endInv); setIndustry(p.v.industry); }}
        />
        <N label="Annual COGS" id="it-cogs" value={cogs} onChange={setCogs} unit={sym} hint="Cost of Goods Sold for the period" />
        <Row2>
          <N label="Beginning Inventory" id="it-bi" value={beginInv} onChange={setBeginInv} unit={sym} />
          <N label="Ending Inventory" id="it-ei" value={endInv} onChange={setEndInv} unit={sym} />
        </Row2>
        <Sel
          label="Industry Benchmark"
          id="it-industry"
          value={industry}
          onChange={setIndustry}
          opts={[
            { v: "retail", l: "Retail (8–12×)" },
            { v: "grocery", l: "Grocery (15–25×)" },
            { v: "manufacturing", l: "Manufacturing (4–8×)" },
            { v: "ecommerce", l: "E-Commerce (6–10×)" },
            { v: "wholesale", l: "Wholesale (5–9×)" },
            { v: "automotive", l: "Automotive (5–10×)" },
          ]}
        />
      </div>
      <div className="sticky-res">
        <Panel result={res} loading={null} label="Inventory Turnover" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. EOQ CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────
export function EOQForm() {
  const { fm, sym } = useCurrency();
  const [demand, setDemand] = useState("5000");
  const [orderCost, setOrderCost] = useState("50");
  const [holdingCost, setHoldingCost] = useState("2");
  const [leadTimeDays, setLeadTimeDays] = useState("7");
  const [safetyStock, setSafetyStock] = useState("50");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const D = +demand, S = +orderCost, H = +holdingCost, lt = +leadTimeDays, ss = +safetyStock;
      if (!D || !S || !H) { setRes(null); return; }
      const eoq = Math.sqrt((2 * D * S) / H);
      const ordersPerYear = D / eoq;
      const avgInventory = eoq / 2 + ss;
      const totalOrderCost = ordersPerYear * S;
      const totalHoldingCost = avgInventory * H;
      const totalCost = totalOrderCost + totalHoldingCost;
      const dailyDemand = D / 365;
      const reorderPoint = dailyDemand * lt + ss;
      const orderFreqDays = 365 / ordersPerYear;

      // Chart: total cost at different order quantities
      const qtyRange = [eoq * 0.25, eoq * 0.5, eoq * 0.75, eoq, eoq * 1.5, eoq * 2].map(q => ({
        name: Math.round(q) + " units",
        "Order Cost": Math.round((D / q) * S),
        "Holding Cost": Math.round((q / 2 + ss) * H),
        "Total Cost": Math.round((D / q) * S + (q / 2 + ss) * H),
      }));

      const r = buildResult(
        "Optimal Order Quantity", Math.round(eoq) + " units",
        [
          { label: "Orders per Year", value: ordersPerYear.toFixed(1) + " orders" },
          { label: "Reorder Point", value: Math.round(reorderPoint) + " units", highlight: true },
          { label: "Total Annual Cost", value: fm(Math.round(totalCost)) },
          { label: "Order Frequency", value: "Every " + Math.round(orderFreqDays) + " days" },
        ],
        [
          { type: "tip", msg: `Order ${Math.round(eoq)} units, ${ordersPerYear.toFixed(1)} times per year. Reorder when stock hits ${Math.round(reorderPoint)} units (with ${lt}-day lead time).` },
          { type: "info", msg: `At EOQ, ordering costs (${fm(Math.round(totalOrderCost))}) = holding costs (${fm(Math.round(totalHoldingCost))}) — minimizing total cost.` },
        ],
        { type: "line", data: qtyRange, keys: ["Order Cost", "Holding Cost", "Total Cost"] },
        [
          { label: "Step 1: EOQ Formula", value: `√(2 × D × S ÷ H)` },
          { label: "Step 2: Annual Demand (D)", value: D.toLocaleString() + " units" },
          { label: "Step 3: Order Cost (S)", value: fm(S) + " per order" },
          { label: "Step 4: Holding Cost (H)", value: fm(H) + " per unit/yr" },
          { label: "Step 5: EOQ Result", value: Math.round(eoq) + " units" },
          { label: "Annual Ordering Cost", value: fm(Math.round(totalOrderCost)) },
          { label: "Annual Holding Cost", value: fm(Math.round(totalHoldingCost)) },
          { label: "Total Annual Cost", value: fm(Math.round(totalCost)) },
          { label: "Reorder Point", value: Math.round(reorderPoint) + " units" },
          { label: "Safety Stock", value: ss + " units" },
        ]
      );
      setRes(r);
    }, 150);
    return () => clearTimeout(timer);
  }, [demand, orderCost, holdingCost, leadTimeDays, safetyStock]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Presets
          items={[
            { label: "Small Retailer", v: { demand: "5000", orderCost: "50", holdingCost: "2", leadTimeDays: "7", safetyStock: "50" } },
            { label: "Mid Manufacturer", v: { demand: "50000", orderCost: "200", holdingCost: "5", leadTimeDays: "14", safetyStock: "500" } },
            { label: "Large Distributor", v: { demand: "200000", orderCost: "500", holdingCost: "3", leadTimeDays: "21", safetyStock: "2000" } },
          ]}
          onApply={p => { setDemand(p.v.demand); setOrderCost(p.v.orderCost); setHoldingCost(p.v.holdingCost); setLeadTimeDays(p.v.leadTimeDays); setSafetyStock(p.v.safetyStock); }}
        />
        <N label="Annual Demand (units)" id="eoq-d" value={demand} onChange={setDemand} unit="units" hint="Total units demanded per year" />
        <N label="Order Cost (per order)" id="eoq-s" value={orderCost} onChange={setOrderCost} unit={sym} hint="Fixed cost to place one purchase order" />
        <N label="Holding Cost (per unit/year)" id="eoq-h" value={holdingCost} onChange={setHoldingCost} unit={sym} hint="Storage, insurance, obsolescence cost per unit per year" />
        <Row2>
          <N label="Lead Time (days)" id="eoq-lt" value={leadTimeDays} onChange={setLeadTimeDays} unit="days" hint="Days from order to delivery" />
          <N label="Safety Stock (units)" id="eoq-ss" value={safetyStock} onChange={setSafetyStock} unit="units" hint="Buffer stock against demand variability" />
        </Row2>
      </div>
      <div className="sticky-res">
        <Panel result={res} loading={null} label="EOQ" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TIME CARD CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────
const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function TimeCardForm() {
  const { fm, sym } = useCurrency();
  const [days, setDays] = useState([
    { day: "Monday",    clockIn: "09:00", clockOut: "17:30", breakMin: "30", active: true },
    { day: "Tuesday",   clockIn: "09:00", clockOut: "17:30", breakMin: "30", active: true },
    { day: "Wednesday", clockIn: "09:00", clockOut: "17:30", breakMin: "30", active: true },
    { day: "Thursday",  clockIn: "09:00", clockOut: "17:30", breakMin: "30", active: true },
    { day: "Friday",    clockIn: "09:00", clockOut: "17:00", breakMin: "30", active: true },
    { day: "Saturday",  clockIn: "09:00", clockOut: "13:00", breakMin: "0",  active: false },
    { day: "Sunday",    clockIn: "09:00", clockOut: "13:00", breakMin: "0",  active: false },
  ]);
  const [hourlyRate, setHourlyRate] = useState("25");
  const [otMode, setOtMode] = useState("weekly");  // "weekly" | "daily"
  const [otThreshold, setOtThreshold] = useState("40");
  const [dailyOtThreshold, setDailyOtThreshold] = useState("8");
  const [res, setRes] = useState(null);

  const updateDay = (i, k, v) => setDays(p => p.map((d, idx) => idx === i ? { ...d, [k]: v } : d));

  const parseTime = t => { const [h, m] = t.split(":").map(Number); return h * 60 + (m || 0); };

  useEffect(() => {
    const timer = setTimeout(() => {
      const rate = +hourlyRate;
      const hoursPerDay = days.map(d => {
        if (!d.active) return 0;
        const start = parseTime(d.clockIn), end = parseTime(d.clockOut);
        return Math.max(0, end - start - +d.breakMin) / 60;
      });

      let regHours = 0, otHours = 0;
      if (otMode === "daily") {
        const dly = +dailyOtThreshold;
        hoursPerDay.forEach(h => { regHours += Math.min(h, dly); otHours += Math.max(0, h - dly); });
      } else {
        const totalH = hoursPerDay.reduce((s, v) => s + v, 0);
        const wkOt = +otThreshold;
        regHours = Math.min(totalH, wkOt);
        otHours = Math.max(0, totalH - wkOt);
      }

      const totalHours = regHours + otHours;
      const regPay = regHours * rate;
      const otPay = otHours * rate * 1.5;
      const totalPay = regPay + otPay;

      const chartData = days.map((d, i) => ({
        name: d.day.slice(0, 3),
        "Hours": +hoursPerDay[i].toFixed(2),
        "Pay": +(hoursPerDay[i] * rate).toFixed(2),
      }));

      const r = buildResult(
        "Total Weekly Pay", fm(totalPay),
        [
          { label: "Total Hours", value: totalHours.toFixed(2) + " hrs" },
          { label: "Regular Hours", value: regHours.toFixed(2) + " hrs" },
          { label: "Overtime Hours (1.5×)", value: otHours.toFixed(2) + " hrs", warn: otHours > 0 },
          { label: "Overtime Pay", value: fm(otPay), highlight: otHours > 0 },
        ],
        [
          otHours > 0
            ? { type: "warn", msg: `${otHours.toFixed(1)} OT hours at 1.5× adds ${fm(otPay)} to your weekly pay.` }
            : { type: "tip", msg: `${totalHours.toFixed(1)} regular hours at ${fm(rate)}/hr = ${fm(totalPay)}.` },
          { type: "info", msg: `Daily average: ${(totalHours / Math.max(1, days.filter(d => d.active).length)).toFixed(2)} hrs/day worked.` },
        ],
        { type: "bar", data: chartData, keys: ["Hours", "Pay"] },
        days.filter(d => d.active).map((d, i) => {
          const idx = days.indexOf(d);
          const h = hoursPerDay[idx];
          return { label: d.day, value: h.toFixed(2) + " hrs → " + fm(h * rate) };
        }).concat([
          { label: "Regular Pay", value: fm(regPay) },
          { label: "Overtime Pay (1.5×)", value: fm(otPay) },
          { label: "Total Weekly Pay", value: fm(totalPay) },
        ])
      );
      setRes(r);
    }, 150);
    return () => clearTimeout(timer);
  }, [days, hourlyRate, otMode, otThreshold, dailyOtThreshold]);

  const inputStyle = { height: 32, padding: "0 6px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 12, color: "var(--text)", outline: "none", fontFamily: "var(--font)" };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Presets
          items={[
            { label: "Standard 9–5", v: { hourlyRate: "25", otMode: "weekly", otThreshold: "40", dailyOtThreshold: "8" } },
            { label: "Heavy OT Week", v: { hourlyRate: "30", otMode: "weekly", otThreshold: "40", dailyOtThreshold: "8" } },
            { label: "Daily OT Rule (8h/day)", v: { hourlyRate: "25", otMode: "daily", otThreshold: "40", dailyOtThreshold: "8" } },
          ]}
          onApply={p => { setHourlyRate(p.v.hourlyRate); setOtMode(p.v.otMode); setOtThreshold(p.v.otThreshold); setDailyOtThreshold(p.v.dailyOtThreshold); }}
        />
        <Row2>
          <N label="Hourly Rate" id="tc-rate" value={hourlyRate} onChange={setHourlyRate} unit={sym} />
          <Sel label="OT Rule" id="tc-otmode" value={otMode} onChange={setOtMode} opts={[
            { v: "weekly", l: "After 40 hrs/week" },
            { v: "daily", l: "After 8 hrs/day" },
          ]} />
        </Row2>
        {otMode === "weekly"
          ? <N label="OT Threshold (hrs/week)" id="tc-ot" value={otThreshold} onChange={setOtThreshold} unit="hrs" />
          : <N label="Daily OT Threshold (hrs/day)" id="tc-dot" value={dailyOtThreshold} onChange={setDailyOtThreshold} unit="hrs" />
        }
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                {["Active", "Day", "Clock In", "Clock Out", "Break (min)"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "6px 8px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--text3)", borderBottom: "1px solid var(--border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((d, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border)", opacity: d.active ? 1 : 0.45 }}>
                  <td style={{ padding: "6px 8px" }}>
                    <input type="checkbox" checked={d.active} onChange={e => updateDay(i, "active", e.target.checked)} style={{ cursor: "pointer", accentColor: "var(--brand)", width: 16, height: 16 }} />
                  </td>
                  <td style={{ padding: "6px 8px", fontWeight: 600, color: "var(--text)", fontSize: 12 }}>{d.day}</td>
                  {["clockIn", "clockOut"].map(k => (
                    <td key={k} style={{ padding: "4px 6px" }}>
                      <input type="time" value={d[k]} disabled={!d.active} onChange={e => updateDay(i, k, e.target.value)} style={{ ...inputStyle, width: 96 }} />
                    </td>
                  ))}
                  <td style={{ padding: "4px 6px" }}>
                    <input type="number" value={d.breakMin} disabled={!d.active} onChange={e => updateDay(i, "breakMin", e.target.value)} style={{ ...inputStyle, width: 60 }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="sticky-res">
        <Panel result={res} loading={null} label="Time Card" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. OVERTIME CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────
export function OvertimeForm() {
  const { fm, sym } = useCurrency();
  const [hourlyRate, setHourlyRate] = useState("20");
  const [regHours, setRegHours] = useState("40");
  const [otHours, setOtHours] = useState("10");
  const [doubleHours, setDoubleHours] = useState("0");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const rate = +hourlyRate, reg = +regHours, ot = +otHours, dbl = +doubleHours;
      const regPay = reg * rate;
      const otPay = ot * rate * 1.5;
      const dblPay = dbl * rate * 2;
      const totalPay = regPay + otPay + dblPay;
      const totalHours = reg + ot + dbl;
      const effectiveRate = totalHours > 0 ? totalPay / totalHours : 0;
      const annualEstimate = totalPay * 52;

      const chartData = [
        { name: "Regular", "Pay": Math.round(regPay), "Hours": reg },
        { name: "Overtime (1.5×)", "Pay": Math.round(otPay), "Hours": ot },
        { name: "Double Time (2×)", "Pay": Math.round(dblPay), "Hours": dbl },
      ].filter(d => d.Hours > 0);

      const r = buildResult(
        "Total Weekly Pay", fm(totalPay),
        [
          { label: "Regular Pay", value: `${fm(regPay)} (${reg}h × ${fm(rate)})` },
          { label: "Overtime Pay (1.5×)", value: `${fm(otPay)} (${ot}h × ${fm(rate * 1.5)})`, highlight: ot > 0 },
          { label: "Double Time (2×)", value: `${fm(dblPay)} (${dbl}h × ${fm(rate * 2)})`, highlight: dbl > 0 },
          { label: "Effective Hourly Rate", value: fm(effectiveRate) + "/hr", highlight: true },
        ],
        [
          { type: "tip", msg: `Working ${totalHours} total hours gives an effective rate of ${fm(effectiveRate)}/hr (vs base ${fm(rate)}/hr).` },
          { type: "info", msg: `Annualized (52 weeks): ${fm(annualEstimate)} — overtime adds ${fm(annualEstimate - reg * rate * 52)} over base salary.` },
        ],
        chartData.length > 0 ? { type: "bar", data: chartData, keys: ["Pay"] } : null,
        [
          { label: "Regular Hours", value: reg + " hrs" },
          { label: "Regular Pay", value: fm(regPay) },
          { label: "Overtime Hours", value: ot + " hrs" },
          { label: "Overtime Pay", value: fm(otPay) },
          { label: "Double Time Hours", value: dbl + " hrs" },
          { label: "Double Time Pay", value: fm(dblPay) },
          { label: "Total Hours", value: totalHours + " hrs" },
          { label: "Total Weekly Pay", value: fm(totalPay) },
          { label: "Effective Rate", value: fm(effectiveRate) + "/hr" },
          { label: "Annual Estimate", value: fm(annualEstimate) },
        ]
      );
      setRes(r);
    }, 150);
    return () => clearTimeout(timer);
  }, [hourlyRate, regHours, otHours, doubleHours]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Presets
          items={[
            { label: "Standard Week", v: { hourlyRate: "20", regHours: "40", otHours: "0", doubleHours: "0" } },
            { label: "10 hrs OT", v: { hourlyRate: "25", regHours: "40", otHours: "10", doubleHours: "0" } },
            { label: "Weekend Double", v: { hourlyRate: "30", regHours: "40", otHours: "8", doubleHours: "8" } },
            { label: "Heavy OT", v: { hourlyRate: "20", regHours: "40", otHours: "20", doubleHours: "4" } },
          ]}
          onApply={p => { setHourlyRate(p.v.hourlyRate); setRegHours(p.v.regHours); setOtHours(p.v.otHours); setDoubleHours(p.v.doubleHours); }}
        />
        <N label="Base Hourly Rate" id="ov-rate" value={hourlyRate} onChange={setHourlyRate} unit={sym} />
        <N label="Regular Hours" id="ov-reg" value={regHours} onChange={setRegHours} unit="hrs" hint="Typically 40 hrs/week" />
        <N label="Overtime Hours (1.5×)" id="ov-ot" value={otHours} onChange={setOtHours} unit="hrs" hint="Hours paid at 1.5× base rate" />
        <N label="Double Time Hours (2×)" id="ov-dbl" value={doubleHours} onChange={setDoubleHours} unit="hrs" hint="Holiday or extended overtime at 2× base rate" placeholder="0" />
      </div>
      <div className="sticky-res">
        <Panel result={res} loading={null} label="Overtime Pay" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. SALARY TO HOURLY CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────
export function SalaryToHourlyForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [tab, setTab] = useState("Salary → Hourly");
  const [salary, setSalary] = useState("60000");
  const [hourly, setHourly] = useState("28.85");
  const [period, setPeriod] = useState("annual");
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [weeksPerYear, setWeeksPerYear] = useState(50);
  const [res, setRes] = useState(null);
  const [params, setParams] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      const h = hoursPerWeek, w = weeksPerYear;
      const totalHoursYear = h * w;

      if (tab === "Salary → Hourly") {
        const amt = +salary;
        const annualFactor = { hourly: totalHoursYear, daily: w * 5, weekly: w, biweekly: w / 2, monthly: 12, annual: 1 };
        const annual = amt * (annualFactor[period] || 1);
        const weekly = annual / w;
        const daily = weekly / 5;
        const hrRate = annual / totalHoursYear;
        const biweekly = annual / 26;
        const monthly = annual / 12;

        const chartData = [
          { name: "Hourly", value: +hrRate.toFixed(2) },
          { name: "Daily", value: +daily.toFixed(2) },
          { name: "Weekly", value: +weekly.toFixed(2) },
          { name: "Bi-Weekly", value: +biweekly.toFixed(2) },
          { name: "Monthly", value: +monthly.toFixed(2) },
        ];

        const r = buildResult(
          "Hourly Rate", fm(hrRate),
          [
            { label: "Hourly", value: fm(hrRate), highlight: true },
            { label: "Daily (5h avg)", value: fm(daily) },
            { label: "Weekly", value: fm(weekly) },
            { label: "Bi-Weekly", value: fm(biweekly) },
            { label: "Monthly", value: fm(monthly) },
          ],
          [
            { type: "tip", msg: `Based on ${h} hrs/week × ${w} weeks/year = ${totalHoursYear.toLocaleString()} total hours.` },
            { type: "info", msg: `Cost per productive minute: ${fm(hrRate / 60)} — useful for billing or project estimates.` },
          ],
          { type: "bar", data: chartData, keys: ["value"] },
          [
            { label: "Annual Salary", value: fm(annual) },
            { label: "Hours per Week", value: h + " hrs" },
            { label: "Weeks per Year", value: w + " weeks" },
            { label: "Total Annual Hours", value: totalHoursYear.toLocaleString() + " hrs" },
            { label: "Hourly Rate", value: fm(hrRate) },
            { label: "Daily Rate", value: fm(daily) },
            { label: "Weekly Rate", value: fm(weekly) },
            { label: "Bi-Weekly Rate", value: fm(biweekly) },
            { label: "Monthly Rate", value: fm(monthly) },
          ]
        );
        setRes(r);
        setParams({ tab, salary, period, hoursPerWeek, weeksPerYear });

      } else {
        // Hourly → Salary
        const hr = +hourly;
        const annual = hr * totalHoursYear;
        const weekly = hr * h;
        const daily = hr * (h / 5);
        const biweekly = weekly * 2;
        const monthly = annual / 12;

        const r = buildResult(
          "Annual Salary", fm(annual),
          [
            { label: "Annual", value: fm(annual), highlight: true },
            { label: "Monthly", value: fm(monthly) },
            { label: "Bi-Weekly", value: fm(biweekly) },
            { label: "Weekly", value: fm(weekly) },
            { label: "Daily", value: fm(daily) },
          ],
          [
            { type: "tip", msg: `At ${fm(hr)}/hr × ${totalHoursYear.toLocaleString()} hours/year = ${fm(annual)} annual salary.` },
            { type: "info", msg: `Want to compare offers? Use Scenario Compare to save different hourly rates side by side.` },
          ],
          null,
          [
            { label: "Hourly Rate", value: fm(hr) },
            { label: "Hours/Week", value: h + " hrs" },
            { label: "Weeks/Year", value: w + " weeks" },
            { label: "Annual Total Hours", value: totalHoursYear.toLocaleString() },
            { label: "Annual Salary", value: fm(annual) },
            { label: "Monthly Pay", value: fm(monthly) },
            { label: "Bi-Weekly Pay", value: fm(biweekly) },
            { label: "Weekly Pay", value: fm(weekly) },
          ]
        );
        setRes(r);
        setParams({ tab, hourly, hoursPerWeek, weeksPerYear });
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [tab, salary, hourly, period, hoursPerWeek, weeksPerYear]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Presets
          items={[
            { label: "Entry Level $45k", v: { tab: "Salary → Hourly", salary: "45000", period: "annual", hourly: "21.63", hoursPerWeek: 40, weeksPerYear: 52 } },
            { label: "Mid-Level $80k", v: { tab: "Salary → Hourly", salary: "80000", period: "annual", hourly: "38.46", hoursPerWeek: 40, weeksPerYear: 50 } },
            { label: "Senior $120k", v: { tab: "Salary → Hourly", salary: "120000", period: "annual", hourly: "57.69", hoursPerWeek: 40, weeksPerYear: 50 } },
            { label: "$50/hr Contractor", v: { tab: "Hourly → Salary", salary: "60000", period: "annual", hourly: "50", hoursPerWeek: 40, weeksPerYear: 50 } },
          ]}
          onApply={p => { setTab(p.v.tab); setSalary(p.v.salary); setPeriod(p.v.period); setHourly(p.v.hourly); setHoursPerWeek(p.v.hoursPerWeek); setWeeksPerYear(p.v.weeksPerYear); }}
        />
        <Tabs tabs={["Salary → Hourly", "Hourly → Salary"]} active={tab} onChange={setTab} />
        {tab === "Salary → Hourly" ? (
          <>
            <N label="Salary Amount" id="s2h-amt" value={salary} onChange={setSalary} unit={sym} />
            <Sel label="Pay Period" id="s2h-period" value={period} onChange={setPeriod} opts={[
              { v: "hourly", l: "Hourly" }, { v: "daily", l: "Daily" }, { v: "weekly", l: "Weekly" },
              { v: "biweekly", l: "Bi-Weekly" }, { v: "monthly", l: "Monthly" }, { v: "annual", l: "Annual" },
            ]} />
          </>
        ) : (
          <N label="Hourly Rate" id="h2s-rate" value={hourly} onChange={setHourly} unit={sym} hint="Your hourly wage or billing rate" />
        )}
        <Sl label="Hours per Week" id="s2h-hpw" min={1} max={80} step={0.5} value={hoursPerWeek} onChange={setHoursPerWeek} fmt={v => `${v} hrs/week`} />
        <Sl label="Weeks per Year" id="s2h-wpy" min={40} max={52} step={1} value={weeksPerYear} onChange={setWeeksPerYear} fmt={v => `${v} weeks/yr`} />
      </div>
      <div className="sticky-res">
        <Panel result={res} loading={null} label="Salary to Hourly" />
        <ScenarioCompare currentResult={res} currentParams={params} calcLabel="Salary" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. MEETING COST CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────
export function MeetingCostForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [attendees, setAttendees] = useState(8);
  const [avgSalary, setAvgSalary] = useState("80000");
  const [duration, setDuration] = useState(60);
  const [recurringFreq, setRecurringFreq] = useState("weekly");
  const [isLive, setIsLive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);
  const [res, setRes] = useState(null);

  // Live ticker
  useEffect(() => {
    if (isLive) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isLive]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hourlyPerPerson = +avgSalary / 2080;
      const totalHourly = hourlyPerPerson * attendees;
      const displayDuration = isLive ? elapsed / 60 : duration;
      const totalCost = totalHourly * (displayDuration / 60);
      const costPerMin = totalHourly / 60;

      const freqMap = { daily: 260, weekly: 52, biweekly: 26, monthly: 12 };
      const occurrences = freqMap[recurringFreq] || 52;
      const annualCost = totalCost * occurrences;

      const chartData = [
        { name: "Daily (260×/yr)", "Annual Cost": Math.round(totalCost * 260) },
        { name: "Weekly (52×/yr)", "Annual Cost": Math.round(totalCost * 52) },
        { name: "Bi-Weekly (26×/yr)", "Annual Cost": Math.round(totalCost * 26) },
        { name: "Monthly (12×/yr)", "Annual Cost": Math.round(totalCost * 12) },
      ];

      const r = buildResult(
        isLive ? "Live Meeting Cost" : "Meeting Cost",
        fm(totalCost),
        [
          { label: "Cost per Minute", value: fm(costPerMin) + "/min" },
          { label: "Per Person", value: fm(totalCost / Math.max(attendees, 1)) },
          { label: `If ${recurringFreq.charAt(0).toUpperCase() + recurringFreq.slice(1)} (Annualized)`, value: fm(annualCost), warn: true },
          { label: "Attendees", value: attendees + " people" },
        ],
        [
          { type: "warn", msg: `This ${isLive ? Math.round(elapsed / 60) : duration}-minute meeting costs ${fm(totalCost)}. At this cadence (${recurringFreq}), that's ${fm(annualCost)}/year!` },
          { type: "tip", msg: `Reduce meeting duration by 15 minutes → save ${fm(costPerMin * 15)} per meeting, ${fm(costPerMin * 15 * occurrences)} per year.` },
        ],
        { type: "bar", data: chartData, keys: ["Annual Cost"] },
        [
          { label: "Attendees", value: attendees },
          { label: "Avg Annual Salary", value: fm(+avgSalary) },
          { label: "Hourly Cost per Person", value: fm(hourlyPerPerson) },
          { label: "Total Hourly Rate (all)", value: fm(totalHourly) },
          { label: "Meeting Duration", value: isLive ? Math.round(elapsed) + " sec" : duration + " min" },
          { label: "Meeting Cost", value: fm(totalCost) },
          { label: "Cost per Minute", value: fm(costPerMin) },
          { label: "Annual Cost (if " + recurringFreq + ")", value: fm(annualCost) },
        ]
      );
      setRes(r);
    }, 150);
    return () => clearTimeout(timer);
  }, [attendees, avgSalary, duration, recurringFreq, elapsed, isLive]);

  const toggleLive = () => {
    if (isLive) { setIsLive(false); setElapsed(0); }
    else { setElapsed(0); setIsLive(true); }
  };

  const liveMin = Math.floor(elapsed / 60), liveSec = elapsed % 60;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Presets
          items={[
            { label: "Quick Standup", v: { attendees: 6, avgSalary: "70000", duration: 15, recurringFreq: "daily" } },
            { label: "Team Meeting", v: { attendees: 10, avgSalary: "85000", duration: 60, recurringFreq: "weekly" } },
            { label: "All-Hands", v: { attendees: 50, avgSalary: "90000", duration: 90, recurringFreq: "monthly" } },
            { label: "Board Meeting", v: { attendees: 12, avgSalary: "200000", duration: 180, recurringFreq: "monthly" } },
          ]}
          onApply={p => { setAttendees(p.v.attendees); setAvgSalary(p.v.avgSalary); setDuration(p.v.duration); setRecurringFreq(p.v.recurringFreq); }}
        />

        {/* Live ticker */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: isLive ? "var(--p50)" : "var(--surface2)", border: `1.5px solid ${isLive ? "var(--brand)" : "var(--border)"}`, borderRadius: "var(--r-md)", marginBottom: 16, transition: "all .3s" }}>
          <button
            onClick={toggleLive}
            style={{ padding: "8px 18px", borderRadius: 100, fontSize: 12, fontWeight: 800, background: isLive ? "#ef4444" : "var(--brand)", color: "#fff", border: "none", cursor: "pointer", fontFamily: "var(--font)", transition: "all .2s" }}
          >
            {isLive ? "⏹ Stop" : "▶ Live Mode"}
          </button>
          {isLive && (
            <div style={{ fontSize: 18, fontWeight: 900, color: "var(--brand)", fontFamily: "var(--font-mono)" }}>
              {String(liveMin).padStart(2, "0")}:{String(liveSec).padStart(2, "0")}
            </div>
          )}
          {!isLive && <span style={{ fontSize: 11, color: "var(--text3)" }}>Start for a real-time cost ticker</span>}
        </div>

        <Sl label="Number of Attendees" id="mc-att" min={2} max={100} value={attendees} onChange={setAttendees} fmt={v => `${v} people`} />
        <N label="Average Annual Salary" id="mc-sal" value={avgSalary} onChange={setAvgSalary} unit={sym} hint="Average salary across all attendees" />
        {!isLive && (
          <Sl label="Meeting Duration" id="mc-dur" min={5} max={480} step={5} value={duration} onChange={setDuration} fmt={v => v >= 60 ? `${Math.floor(v / 60)}h ${v % 60}m` : `${v} min`} />
        )}
        <Sel label="Recurring Frequency" id="mc-freq" value={recurringFreq} onChange={setRecurringFreq} opts={[
          { v: "daily", l: "Daily (260×/yr)" },
          { v: "weekly", l: "Weekly (52×/yr)" },
          { v: "biweekly", l: "Bi-Weekly (26×/yr)" },
          { v: "monthly", l: "Monthly (12×/yr)" },
        ]} />
      </div>
      <div className="sticky-res">
        <Panel result={res} loading={null} label="Meeting Cost" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. CONVERSION RATE CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────
export function ConversionRateForm() {
  const { fm, sym } = useCurrency();
  const [visitors, setVisitors] = useState("10000");
  const [conversions, setConversions] = useState("250");
  const [avgValue, setAvgValue] = useState("50");
  const [improveBy, setImproveBy] = useState(0.5);
  const [confidenceLevel, setConfidenceLevel] = useState("95");
  const [minEffect, setMinEffect] = useState("20");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const v = Math.max(1, +visitors), c = Math.max(0, +conversions), val = +avgValue;
      const rate = (c / v) * 100;
      const revenue = c * val;
      const improvedRate = rate + improveBy;
      const improvedConversions = (improvedRate / 100) * v;
      const revenueUplift = (improvedConversions - c) * val;

      // A/B test sample size (simplified Cochran formula at 95% CI, 80% power)
      const zAlpha = +confidenceLevel === 99 ? 2.576 : +confidenceLevel === 90 ? 1.645 : 1.96;
      const p = rate / 100;
      const mde = +minEffect / 100;
      const p2 = p * (1 + mde);
      const pBar = (p + p2) / 2;
      const sampleSize = Math.ceil(2 * pBar * (1 - pBar) * ((zAlpha + 0.842) ** 2) / ((p2 - p) ** 2));

      const whatIfData = [0.5, 1, 1.5, 2, 3].map(delta => ({
        name: "+" + delta + "%",
        "Extra Revenue": Math.round(((rate + delta) / 100 * v - c) * val),
        "New Conversions": Math.round((rate + delta) / 100 * v),
      }));

      const r = buildResult(
        "Conversion Rate", rate.toFixed(2) + "%",
        [
          { label: "Total Conversions", value: c.toLocaleString() },
          { label: "Revenue Generated", value: fm(revenue), highlight: true },
          { label: `If CVR +${improveBy}%`, value: `${fm(Math.round(revenueUplift))} uplift`, highlight: true },
          { label: "A/B Test Sample Size", value: sampleSize.toLocaleString() + " per variant" },
        ],
        [
          { type: rate < 1 ? "warn" : rate < 3 ? "info" : "tip", msg: rate < 1 ? `CVR of ${rate.toFixed(2)}% is very low. Industry average is 2–4%. Even +0.5% would generate ${fm(Math.round(v * 0.005 * val))} more revenue.` : rate < 3 ? `CVR of ${rate.toFixed(2)}% is below average. Focus on improving landing page copy, social proof, and checkout friction.` : `Strong CVR of ${rate.toFixed(2)}%! Well above industry average. Focus on increasing traffic to amplify gains.` },
          { type: "info", msg: `A/B test: You need at least ${sampleSize.toLocaleString()} visitors per variant to detect a ${minEffect}% improvement with ${confidenceLevel}% confidence.` },
        ],
        { type: "bar", data: whatIfData, keys: ["Extra Revenue"] },
        [
          { label: "Visitors", value: v.toLocaleString() },
          { label: "Conversions", value: c.toLocaleString() },
          { label: "Conversion Rate", value: rate.toFixed(2) + "%" },
          { label: "Revenue", value: fm(revenue) },
          { label: `Revenue if +${improveBy}%`, value: fm(Math.round(revenue + revenueUplift)) },
          { label: "Revenue Uplift", value: fm(Math.round(revenueUplift)) },
          { label: "A/B Sample Size", value: sampleSize.toLocaleString() + " per variant" },
        ]
      );
      setRes(r);
    }, 150);
    return () => clearTimeout(timer);
  }, [visitors, conversions, avgValue, improveBy, confidenceLevel, minEffect]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Presets
          items={[
            { label: "E-Commerce (2.5%)", v: { visitors: "10000", conversions: "250", avgValue: "65", improveBy: 0.5, confidenceLevel: "95", minEffect: "20" } },
            { label: "SaaS Trial (5%)", v: { visitors: "5000", conversions: "250", avgValue: "120", improveBy: 1, confidenceLevel: "95", minEffect: "15" } },
            { label: "Landing Page (1%)", v: { visitors: "20000", conversions: "200", avgValue: "50", improveBy: 0.5, confidenceLevel: "95", minEffect: "20" } },
            { label: "High Traffic (3%)", v: { visitors: "100000", conversions: "3000", avgValue: "40", improveBy: 0.25, confidenceLevel: "95", minEffect: "10" } },
          ]}
          onApply={p => { setVisitors(p.v.visitors); setConversions(p.v.conversions); setAvgValue(p.v.avgValue); setImproveBy(p.v.improveBy); setConfidenceLevel(p.v.confidenceLevel); setMinEffect(p.v.minEffect); }}
        />
        <N label="Total Visitors / Traffic" id="cr-vis" value={visitors} onChange={setVisitors} unit="visitors" />
        <N label="Total Conversions" id="cr-conv" value={conversions} onChange={setConversions} unit="converts" hint="Sales, sign-ups, leads, etc." />
        <N label="Average Conversion Value" id="cr-val" value={avgValue} onChange={setAvgValue} unit={sym} hint="Revenue per conversion" />
        <Sl label="What-if: CVR improves by" id="cr-imp" min={0.1} max={5} step={0.1} value={improveBy} onChange={setImproveBy} fmt={v => `+${v.toFixed(1)}%`} />
        <div style={{ marginTop: 8 }}>
          <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text3)", marginBottom: 8 }}>A/B Test Calculator</p>
          <Row2>
            <Sel label="Confidence Level" id="cr-ci" value={confidenceLevel} onChange={setConfidenceLevel} opts={[
              { v: "90", l: "90%" }, { v: "95", l: "95% (standard)" }, { v: "99", l: "99%" },
            ]} />
            <N label="Min. Detectable Effect" id="cr-mde" value={minEffect} onChange={setMinEffect} unit="%" hint="Min % improvement to detect" />
          </Row2>
        </div>
      </div>
      <div className="sticky-res">
        <Panel result={res} loading={null} label="Conversion Rate" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. CUSTOMER LIFETIME VALUE (CLV)
// ─────────────────────────────────────────────────────────────────────────────
export function CLVForm() {
  const { fm, sym } = useCurrency();
  const [avgPurchase, setAvgPurchase] = useState("100");
  const [frequency, setFrequency] = useState("4");
  const [lifespan, setLifespan] = useState("5");
  const [margin, setMargin] = useState("30");
  const [cac, setCac] = useState("50");
  const [discountRate, setDiscountRate] = useState("10");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const ap = +avgPurchase, f = +frequency, l = Math.max(1, +lifespan);
      const m = +margin / 100, c = +cac, r = +discountRate / 100;
      const annualRevenue = ap * f;
      const annualMargin = annualRevenue * m;
      const clvRevenue = annualRevenue * l;
      const clvMargin = annualMargin * l;

      // Discounted CLV
      const discountedCLV = r > 0
        ? annualMargin * ((1 - Math.pow(1 + r, -l)) / r)
        : clvMargin;

      const ltv_cac = discountedCLV / Math.max(c, 0.01);
      const paybackMonths = c / (annualMargin / 12);

      // Year-by-year CLV growth
      const chartData = Array.from({ length: Math.min(Math.ceil(l), 10) }, (_, i) => ({
        name: `Yr ${i + 1}`,
        "CLV (Revenue)": Math.round(annualRevenue * (i + 1)),
        "CLV (Margin)": Math.round(annualMargin * (i + 1)),
      }));

      const r3yr = annualMargin * Math.min(3, l);
      const r5yr = annualMargin * Math.min(5, l);

      const result = buildResult(
        "Customer Lifetime Value", fm(Math.round(discountedCLV)),
        [
          { label: "3-Year CLV (Margin)", value: fm(Math.round(r3yr)) },
          { label: "5-Year CLV (Margin)", value: fm(Math.round(r5yr)) },
          { label: "LTV:CAC Ratio", value: ltv_cac.toFixed(2) + ":1", highlight: ltv_cac >= 3, warn: ltv_cac < 1 },
          { label: "CAC Payback Period", value: paybackMonths.toFixed(1) + " months", warn: paybackMonths > 18 },
        ],
        [
          {
            type: ltv_cac >= 3 ? "tip" : ltv_cac < 1 ? "warn" : "info",
            msg: ltv_cac >= 3 ? `Excellent LTV:CAC of ${ltv_cac.toFixed(2)}:1! Target is 3:1+. You recover acquisition cost in ${paybackMonths.toFixed(1)} months.` : ltv_cac < 1 ? `Danger: LTV:CAC below 1. You spend more acquiring customers than they're worth. Cut CAC or improve retention urgently.` : `LTV:CAC of ${ltv_cac.toFixed(2)}:1 is below the 3:1 target. Improve retention, purchase frequency, or reduce CAC.`,
          },
          { type: "info", msg: `Annual value per customer: ${fm(Math.round(annualRevenue))} revenue / ${fm(Math.round(annualMargin))} margin.` },
        ],
        { type: "area", data: chartData, keys: ["CLV (Revenue)", "CLV (Margin)"] },
        [
          { label: "Avg Purchase Value", value: fm(ap) },
          { label: "Purchase Frequency", value: f + "×/year" },
          { label: "Customer Lifespan", value: l + " years" },
          { label: "Gross Margin", value: margin + "%" },
          { label: "Annual Revenue/Customer", value: fm(Math.round(annualRevenue)) },
          { label: "Annual Margin/Customer", value: fm(Math.round(annualMargin)) },
          { label: "Lifetime Revenue", value: fm(Math.round(clvRevenue)) },
          { label: "Lifetime Margin (CLV)", value: fm(Math.round(clvMargin)) },
          { label: "Discounted CLV", value: fm(Math.round(discountedCLV)) },
          { label: "Customer Acquisition Cost", value: fm(c) },
          { label: "LTV:CAC Ratio", value: ltv_cac.toFixed(2) + ":1" },
          { label: "CAC Payback", value: paybackMonths.toFixed(1) + " months" },
        ]
      );
      setRes(result);
    }, 150);
    return () => clearTimeout(timer);
  }, [avgPurchase, frequency, lifespan, margin, cac, discountRate]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Presets
          items={[
            { label: "SaaS Monthly", v: { avgPurchase: "49", frequency: "12", lifespan: "3", margin: "80", cac: "200", discountRate: "10" } },
            { label: "E-Commerce", v: { avgPurchase: "75", frequency: "4", lifespan: "5", margin: "40", cac: "30", discountRate: "10" } },
            { label: "B2B Service", v: { avgPurchase: "5000", frequency: "2", lifespan: "7", margin: "60", cac: "2000", discountRate: "8" } },
            { label: "Retail Store", v: { avgPurchase: "55", frequency: "6", lifespan: "4", margin: "35", cac: "25", discountRate: "10" } },
          ]}
          onApply={p => { setAvgPurchase(p.v.avgPurchase); setFrequency(p.v.frequency); setLifespan(p.v.lifespan); setMargin(p.v.margin); setCac(p.v.cac); setDiscountRate(p.v.discountRate); }}
        />
        <N label="Average Purchase Value" id="clv-ap" value={avgPurchase} onChange={setAvgPurchase} unit={sym} />
        <N label="Purchase Frequency (per year)" id="clv-f" value={frequency} onChange={setFrequency} unit="×/yr" />
        <N label="Customer Lifespan (years)" id="clv-l" value={lifespan} onChange={setLifespan} unit="yrs" />
        <Row2>
          <N label="Gross Margin %" id="clv-m" value={margin} onChange={setMargin} unit="%" />
          <N label="Customer Acquisition Cost" id="clv-cac" value={cac} onChange={setCac} unit={sym} />
        </Row2>
        <N label="Discount Rate %" id="clv-dr" value={discountRate} onChange={setDiscountRate} unit="%" hint="Discount rate for future cash flows (WACC or cost of capital)" />
      </div>
      <div className="sticky-res">
        <Panel result={res} loading={null} label="Customer Lifetime Value" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. CPC / CPA / ROAS CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────
export function CPCCPAForm() {
  const { fm, sym } = useCurrency();
  const [adSpend, setAdSpend] = useState("5000");
  const [impressions, setImpressions] = useState("100000");
  const [clicks, setClicks] = useState("2500");
  const [conversions, setConversions] = useState("50");
  const [revenue, setRevenue] = useState("15000");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const spend = +adSpend, imp = +impressions, c = +clicks, conv = +conversions, rev = +revenue;
      const cpc = spend / Math.max(c, 1);
      const cpm = (spend / Math.max(imp, 1)) * 1000;
      const cpa = spend / Math.max(conv, 1);
      const ctr = (c / Math.max(imp, 1)) * 100;
      const cvr = (conv / Math.max(c, 1)) * 100;
      const roas = rev / Math.max(spend, 1);
      const roi = ((rev - spend) / Math.max(spend, 1)) * 100;
      const netProfit = rev - spend;

      // ROAS benchmark comparison
      const roasData = [
        { name: "Search", "ROAS": 4.2 },
        { name: "Shopping", "ROAS": 5.1 },
        { name: "Display", "ROAS": 2.1 },
        { name: "Social", "ROAS": 3.0 },
        { name: "Your ROAS", "ROAS": +roas.toFixed(2) },
      ];

      const r = buildResult(
        "ROAS", roas.toFixed(2) + "×",
        [
          { label: "CPC (Cost per Click)", value: fm(cpc) },
          { label: "CPM (per 1,000 impr.)", value: fm(cpm) },
          { label: "CPA (Cost per Acq.)", value: fm(cpa), highlight: true },
          { label: "ROI", value: roi.toFixed(1) + "%", highlight: roas >= 4, warn: roas < 2 },
        ],
        [
          { type: roas >= 4 ? "tip" : roas < 2 ? "warn" : "info", msg: `ROAS of ${roas.toFixed(2)}× — you earn ${fm(roas.toFixed(2))} for every ${fm(1)} spent. Target is typically 4× (400%) for profitability.` },
          { type: roi >= 0 ? "tip" : "warn", msg: `Net profit from ads: ${fm(netProfit)} (ROI: ${roi.toFixed(1)}%). CTR: ${ctr.toFixed(2)}% | CVR: ${cvr.toFixed(2)}%.` },
        ],
        { type: "bar", data: roasData, keys: ["ROAS"] },
        [
          { label: "Ad Spend", value: fm(spend) },
          { label: "Impressions", value: imp.toLocaleString() },
          { label: "Clicks", value: c.toLocaleString() },
          { label: "CTR", value: ctr.toFixed(2) + "%" },
          { label: "CPC", value: fm(cpc) },
          { label: "CPM", value: fm(cpm) },
          { label: "Conversions", value: conv.toLocaleString() },
          { label: "CVR", value: cvr.toFixed(2) + "%" },
          { label: "CPA", value: fm(cpa) },
          { label: "Revenue", value: fm(rev) },
          { label: "Net Profit", value: fm(netProfit) },
          { label: "ROAS", value: roas.toFixed(2) + "×" },
          { label: "ROI", value: roi.toFixed(1) + "%" },
        ]
      );
      setRes(r);
    }, 150);
    return () => clearTimeout(timer);
  }, [adSpend, impressions, clicks, conversions, revenue]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Presets
          items={[
            { label: "Google Search", v: { adSpend: "5000", impressions: "50000", clicks: "2500", conversions: "75", revenue: "22500" } },
            { label: "Facebook Ads", v: { adSpend: "3000", impressions: "150000", clicks: "3000", conversions: "45", revenue: "9000" } },
            { label: "Display Campaign", v: { adSpend: "2000", impressions: "500000", clicks: "1000", conversions: "20", revenue: "4200" } },
            { label: "High ROAS Search", v: { adSpend: "10000", impressions: "80000", clicks: "4800", conversions: "240", revenue: "48000" } },
          ]}
          onApply={p => { setAdSpend(p.v.adSpend); setImpressions(p.v.impressions); setClicks(p.v.clicks); setConversions(p.v.conversions); setRevenue(p.v.revenue); }}
        />
        <N label="Total Ad Spend" id="cpc-spend" value={adSpend} onChange={setAdSpend} unit={sym} />
        <N label="Total Impressions" id="cpc-imp" value={impressions} onChange={setImpressions} unit="impr." hint="Total times your ad was shown" />
        <N label="Total Clicks" id="cpc-clicks" value={clicks} onChange={setClicks} unit="clicks" />
        <N label="Total Conversions" id="cpc-conv" value={conversions} onChange={setConversions} unit="sales" hint="Sales, sign-ups, or desired actions" />
        <N label="Total Revenue Generated" id="cpc-rev" value={revenue} onChange={setRevenue} unit={sym} hint="Total revenue attributed to this campaign" />
      </div>
      <div className="sticky-res">
        <Panel result={res} loading={null} label="CPC / CPA / ROAS" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. EMPLOYEE COST CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────
export function EmployeeCostForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [salary, setSalary] = useState("60000");
  const [benefits, setBenefits] = useState(15);
  const [payrollTax, setPayrollTax] = useState(7.65);
  const [overhead, setOverhead] = useState(10);
  const [productiveHours, setProductiveHours] = useState(1600);
  const [res, setRes] = useState(null);
  const [params, setParams] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      const s = +salary;
      const benefitsAmt  = s * benefits  / 100;
      const payrollAmt   = s * payrollTax / 100;
      const overheadAmt  = s * overhead  / 100;
      const totalCost    = s + benefitsAmt + payrollAmt + overheadAmt;
      const ratio        = totalCost / s;
      const costPerHour  = totalCost / 2080;
      const costPerProductiveHour = totalCost / Math.max(productiveHours, 1);
      const costPerMonth = totalCost / 12;
      const costPerDay   = totalCost / 260;

      const chart = {
        type: "donut",
        data: [
          { name: "Base Salary",   value: Math.round(s),           color: "var(--brand)" },
          { name: "Benefits",      value: Math.round(benefitsAmt), color: "#f59e0b" },
          { name: "Payroll Tax",   value: Math.round(payrollAmt),  color: "#ef4444" },
          { name: "Overhead",      value: Math.round(overheadAmt), color: "#8b5cf6" },
        ],
      };

      const r = buildResult(
        "True Employee Cost", fm(Math.round(totalCost)),
        [
          { label: "Base Salary", value: fm(Math.round(s)) },
          { label: "Total Overhead Additions", value: fm(Math.round(benefitsAmt + payrollAmt + overheadAmt)) },
          { label: "Cost Multiplier", value: ratio.toFixed(2) + "×", highlight: true },
          { label: "Cost per Productive Hour", value: fm(costPerProductiveHour.toFixed(2)), highlight: true },
        ],
        [
          { type: "tip", msg: `A ${fm(Math.round(s))} salary actually costs ${fm(Math.round(totalCost))}/year — ${((ratio - 1) * 100).toFixed(0)}% more than the base.` },
          { type: "info", msg: `With ${productiveHours.toLocaleString()} productive hours/year, the fully-loaded cost is ${fm(costPerProductiveHour.toFixed(2))}/hr vs standard ${fm(costPerHour.toFixed(2))}/hr.` },
        ],
        chart,
        [
          { label: "Base Salary", value: fm(Math.round(s)) },
          { label: `Benefits (${benefits}%)`, value: fm(Math.round(benefitsAmt)) },
          { label: `Payroll Tax (${payrollTax}%)`, value: fm(Math.round(payrollAmt)) },
          { label: `Overhead (${overhead}%)`, value: fm(Math.round(overheadAmt)) },
          { label: "Total Annual Cost", value: fm(Math.round(totalCost)) },
          { label: "Cost Multiplier", value: ratio.toFixed(2) + "×" },
          { label: "Monthly Cost", value: fm(Math.round(costPerMonth)) },
          { label: "Daily Cost (260 days)", value: fm(Math.round(costPerDay)) },
          { label: "Cost per Hour (2,080 hrs)", value: fm(costPerHour.toFixed(2)) },
          { label: "Cost per Productive Hour", value: fm(costPerProductiveHour.toFixed(2)) },
        ]
      );
      setRes(r);
      setParams({ salary, benefits, payrollTax, overhead, productiveHours });
    }, 150);
    return () => clearTimeout(timer);
  }, [salary, benefits, payrollTax, overhead, productiveHours]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Presets
          items={[
            { label: "US Entry Level", v: { salary: "45000", benefits: 20, payrollTax: 7.65, overhead: 10, productiveHours: 1600 } },
            { label: "US Mid-Level",   v: { salary: "80000", benefits: 25, payrollTax: 7.65, overhead: 15, productiveHours: 1600 } },
            { label: "UK Employee",    v: { salary: "50000", benefits: 12, payrollTax: 13.8, overhead: 10, productiveHours: 1664 } },
            { label: "Senior Engineer",v: { salary: "130000", benefits: 30, payrollTax: 7.65, overhead: 20, productiveHours: 1500 } },
          ]}
          onApply={p => { setSalary(p.v.salary); setBenefits(p.v.benefits); setPayrollTax(p.v.payrollTax); setOverhead(p.v.overhead); setProductiveHours(p.v.productiveHours); }}
        />
        <N label="Base Annual Salary" id="ec-sal" value={salary} onChange={setSalary} unit={sym} />
        <Sl label="Benefits %" id="ec-ben" min={0} max={50} step={0.5} value={benefits} onChange={setBenefits} fmt={v => `${v}% (${fmSlider(+salary * v / 100)})`} />
        <Sl label="Employer Payroll Tax %" id="ec-ptax" min={0} max={30} step={0.05} value={payrollTax} onChange={setPayrollTax} fmt={v => `${v.toFixed(2)}% (${fmSlider(+salary * v / 100)})`} />
        <Sl label="Overhead %" id="ec-oh" min={0} max={50} step={0.5} value={overhead} onChange={setOverhead} fmt={v => `${v}% (${fmSlider(+salary * v / 100)})`} />
        <Sl label="Productive Hours / Year" id="ec-ph" min={800} max={2080} step={40} value={productiveHours} onChange={setProductiveHours} fmt={v => `${v.toLocaleString()} hrs/yr`} />
        <div style={{ padding: "10px 14px", background: "var(--surface2)", borderRadius: "var(--r-md)", border: "1px solid var(--border)", fontSize: 11, color: "var(--text3)", lineHeight: 1.5 }}>
          💡 <strong>Tip:</strong> US payroll tax = 7.65% (FICA). UK National Insurance = 13.8%. Benefits include health, dental, retirement match. Overhead = office, equipment, software.
        </div>
      </div>
      <div className="sticky-res">
        <Panel result={res} loading={null} label="Employee Cost" />
        <ScenarioCompare currentResult={res} currentParams={params} calcLabel="Employee Cost" />
      </div>
    </div>
  );
}
