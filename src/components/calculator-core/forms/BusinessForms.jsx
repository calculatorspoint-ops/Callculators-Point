import { useState, useEffect } from "react";
import { L, N, Sl, Sel, Tabs, Row2, Row3, Panel, buildResult, useCurrency } from "./SharedComponents.jsx";

// ── Markup Calculator ─────────────────────────────────────────────────
export function MarkupForm() {
  const { fm, sym } = useCurrency();
  const [mode, setMode] = useState("Cost → Selling Price");
  const [cost, setCost] = useState("100");
  const [markup, setMarkup] = useState("50");
  const [selling, setSelling] = useState("150");
  const [res, setRes] = useState(null);

  useEffect(() => {
    if (mode === "Cost → Selling Price") {
      const c = +cost, m = +markup / 100;
      const s = c * (1 + m);
      const margin = (s - c) / s * 100;
      setRes(buildResult("Selling Price", fm(Math.round(s * 100) / 100),
        [
          { label: "Cost Price", value: fm(+cost) },
          { label: "Markup (%)", value: markup + "%" },
          { label: "Gross Profit", value: fm(Math.round((s - c) * 100) / 100), highlight: true },
          { label: "Profit Margin", value: margin.toFixed(2) + "%" },
        ],
        [{ type: "tip", msg: `A ${markup}% markup gives a ${margin.toFixed(2)}% profit margin. Note: markup and margin are different!` }],
        null, []));
    } else {
      const s = +selling, c = +cost;
      const mu = (s - c) / c * 100;
      const margin = (s - c) / s * 100;
      setRes(buildResult("Markup %", mu.toFixed(2) + "%",
        [
          { label: "Cost Price", value: fm(c) },
          { label: "Selling Price", value: fm(s) },
          { label: "Markup (%)", value: mu.toFixed(2) + "%", highlight: true },
          { label: "Profit Margin", value: margin.toFixed(2) + "%" },
        ],
        [{ type: "tip", msg: `Profit: ${fm(s - c)} (${mu.toFixed(1)}% markup = ${margin.toFixed(1)}% margin)` }],
        null, []));
    }
  }, [mode, cost, markup, selling]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Tabs tabs={["Cost → Selling Price", "Reverse Markup"]} active={mode} onChange={setMode} />
        <N label="Cost Price" id="mkc" value={cost} onChange={setCost} unit={sym} />
        {mode === "Cost → Selling Price"
          ? <N label="Markup (%)" id="mkm" value={markup} onChange={setMarkup} unit="%" />
          : <N label="Selling Price" id="mks" value={selling} onChange={setSelling} unit={sym} />}
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Markup" /></div>
    </div>
  );
}

// ── Inventory Turnover Calculator ─────────────────────────────────────
export function InventoryTurnoverForm() {
  const { fm, sym } = useCurrency();
  const [cogs, setCogs] = useState("500000");
  const [beginInv, setBeginInv] = useState("80000");
  const [endInv, setEndInv] = useState("60000");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const c = +cogs, b = +beginInv, e = +endInv;
    const avgInv = (b + e) / 2;
    const turnover = c / avgInv;
    const daysInInv = 365 / turnover;
    setRes(buildResult("Inventory Turnover", turnover.toFixed(2) + "×",
      [
        { label: "COGS", value: fm(c) },
        { label: "Average Inventory", value: fm(Math.round(avgInv)) },
        { label: "Turnover Ratio", value: turnover.toFixed(2) + "×", highlight: turnover > 4 },
        { label: "Days in Inventory", value: daysInInv.toFixed(0) + " days", warn: daysInInv > 90 },
      ],
      [{ type: turnover < 4 ? "warn" : "tip", msg: `Inventory turns over every ${daysInInv.toFixed(0)} days. Industry averages vary: retail 8-12×, manufacturing 4-8×, grocery 15-20×.` }],
      null, []));
  }, [cogs, beginInv, endInv]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <N label="Annual COGS" id="itcogs" value={cogs} onChange={setCogs} unit={sym} hint="Cost of Goods Sold for the period" />
        <Row2>
          <N label="Beginning Inventory" id="itbi" value={beginInv} onChange={setBeginInv} unit={sym} />
          <N label="Ending Inventory" id="itei" value={endInv} onChange={setEndInv} unit={sym} />
        </Row2>
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Inventory Turnover" /></div>
    </div>
  );
}

// ── EOQ Calculator ────────────────────────────────────────────────────
export function EOQForm() {
  const { fm, sym } = useCurrency();
  const [demand, setDemand] = useState("5000");
  const [orderCost, setOrderCost] = useState("50");
  const [holdingCost, setHoldingCost] = useState("2");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const D = +demand, S = +orderCost, H = +holdingCost;
    if (!D || !S || !H) { setRes(null); return; }
    const eoq = Math.sqrt((2 * D * S) / H);
    const ordersPerYear = D / eoq;
    const avgInventory = eoq / 2;
    const totalOrderCost = ordersPerYear * S;
    const totalHoldingCost = avgInventory * H;
    const totalCost = totalOrderCost + totalHoldingCost;
    const reorderPoint = D / 52; // weekly demand as reorder trigger (simplified)
    setRes(buildResult("EOQ", Math.round(eoq) + " units",
      [
        { label: "Optimal Order Qty", value: Math.round(eoq) + " units", highlight: true },
        { label: "Orders per Year", value: ordersPerYear.toFixed(1) },
        { label: "Total Annual Cost", value: fm(Math.round(totalCost)) },
        { label: "Reorder Point", value: Math.round(reorderPoint) + " units" },
      ],
      [{ type: "tip", msg: `Order ${Math.round(eoq)} units at a time to minimize combined ordering and holding costs (${fm(Math.round(totalCost))}/year).` }],
      null, [
        { label: "Order Frequency", value: `Every ${(365 / ordersPerYear).toFixed(0)} days` },
        { label: "Ordering Costs/yr", value: fm(Math.round(totalOrderCost)) },
        { label: "Holding Costs/yr", value: fm(Math.round(totalHoldingCost)) },
      ]));
  }, [demand, orderCost, holdingCost]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <N label="Annual Demand (units)" id="eoqd" value={demand} onChange={setDemand} unit="units" />
        <N label="Order Cost (per order)" id="eoqs" value={orderCost} onChange={setOrderCost} unit={sym} hint="Cost to place one order" />
        <N label="Holding Cost (per unit/year)" id="eoqh" value={holdingCost} onChange={setHoldingCost} unit={sym} hint="Storage cost per unit per year" />
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="EOQ" /></div>
    </div>
  );
}

// ── Time Card Calculator ──────────────────────────────────────────────
export function TimeCardForm() {
  const { fm, sym } = useCurrency();
  const [days, setDays] = useState([
    { day: "Monday", clockIn: "09:00", clockOut: "17:30", breakMin: "30" },
    { day: "Tuesday", clockIn: "09:00", clockOut: "17:30", breakMin: "30" },
    { day: "Wednesday", clockIn: "09:00", clockOut: "17:30", breakMin: "30" },
    { day: "Thursday", clockIn: "09:00", clockOut: "17:30", breakMin: "30" },
    { day: "Friday", clockIn: "09:00", clockOut: "17:00", breakMin: "30" },
  ]);
  const [hourlyRate, setHourlyRate] = useState("25");
  const [otThreshold, setOtThreshold] = useState("40");
  const [res, setRes] = useState(null);

  const updateDay = (i, k, v) => setDays(p => p.map((d, idx) => idx === i ? { ...d, [k]: v } : d));

  useEffect(() => {
    const parseTime = t => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + (m || 0);
    };
    const hoursPerDay = days.map(d => {
      const start = parseTime(d.clockIn), end = parseTime(d.clockOut);
      const worked = Math.max(0, end - start - +d.breakMin) / 60;
      return worked;
    });
    const totalHours = hoursPerDay.reduce((s, v) => s + v, 0);
    const otHours = Math.max(0, totalHours - +otThreshold);
    const regHours = totalHours - otHours;
    const rate = +hourlyRate;
    const regPay = regHours * rate;
    const otPay = otHours * rate * 1.5;
    const totalPay = regPay + otPay;
    setRes(buildResult("Total Hours", totalHours.toFixed(2) + " hrs",
      [
        { label: "Regular Hours", value: regHours.toFixed(2) + " hrs" },
        { label: "Overtime Hours", value: otHours.toFixed(2) + " hrs", warn: otHours > 0 },
        { label: "Regular Pay", value: fm(Math.round(regPay)) },
        { label: "Total Pay", value: fm(Math.round(totalPay)), highlight: true },
      ],
      [{ type: "tip", msg: otHours > 0 ? `${otHours.toFixed(1)} overtime hours at 1.5× rate adds ${fm(Math.round(otPay))} to your pay.` : `No overtime this week. ${totalHours.toFixed(1)} hours at ${fm(rate)}/hr.` }],
      null, days.map((d, i) => ({ label: d.day, value: hoursPerDay[i].toFixed(2) + " hrs → " + fm(Math.round(hoursPerDay[i] * rate)) }))));
  }, [days, hourlyRate, otThreshold]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Row2>
          <N label="Hourly Rate" id="tcrate" value={hourlyRate} onChange={setHourlyRate} unit={sym} />
          <N label="OT Threshold (hrs/week)" id="tcot" value={otThreshold} onChange={setOtThreshold} unit="hrs" />
        </Row2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                {["Day", "Clock In", "Clock Out", "Break (min)"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "6px 8px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--text3)", borderBottom: "1px solid var(--border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((d, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "6px 8px", fontWeight: 600, color: "var(--text)", fontSize: 12 }}>{d.day}</td>
                  {["clockIn", "clockOut"].map(k => (
                    <td key={k} style={{ padding: "4px 6px" }}>
                      <input type="time" value={d[k]} onChange={e => updateDay(i, k, e.target.value)}
                        style={{ height: 32, padding: "0 6px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 12, color: "var(--text)", fontFamily: "var(--font-mono)", outline: "none" }} />
                    </td>
                  ))}
                  <td style={{ padding: "4px 6px" }}>
                    <input type="number" value={d.breakMin} onChange={e => updateDay(i, "breakMin", e.target.value)}
                      style={{ width: 60, height: 32, padding: "0 6px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 12, color: "var(--text)", fontFamily: "var(--font)", outline: "none" }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Time Card" /></div>
    </div>
  );
}

// ── Overtime Calculator ───────────────────────────────────────────────
export function OvertimeForm() {
  const { fm, sym } = useCurrency();
  const [hourlyRate, setHourlyRate] = useState("20");
  const [regHours, setRegHours] = useState("40");
  const [otHours, setOtHours] = useState("10");
  const [doubleHours, setDoubleHours] = useState("0");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const rate = +hourlyRate, reg = +regHours, ot = +otHours, dbl = +doubleHours;
    const regPay = reg * rate;
    const otPay = ot * rate * 1.5;
    const dblPay = dbl * rate * 2;
    const totalPay = regPay + otPay + dblPay;
    const totalHours = reg + ot + dbl;
    const effectiveRate = totalPay / totalHours;
    setRes(buildResult("Total Weekly Pay", fm(Math.round(totalPay)),
      [
        { label: "Regular Pay", value: fm(Math.round(regPay)) + ` (${reg}h × ${fm(rate)})` },
        { label: "Overtime Pay (1.5×)", value: fm(Math.round(otPay)) + ` (${ot}h × ${fm(rate * 1.5)})` },
        { label: "Double Time (2×)", value: fm(Math.round(dblPay)) + ` (${dbl}h × ${fm(rate * 2)})` },
        { label: "Effective Hourly Rate", value: fm(effectiveRate.toFixed(2)) + "/hr", highlight: true },
      ],
      [{ type: "tip", msg: `Working ${totalHours} hours gives an effective rate of ${fm(effectiveRate.toFixed(2))}/hr vs your base rate of ${fm(rate)}/hr.` }],
      null, []));
  }, [hourlyRate, regHours, otHours, doubleHours]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <N label="Hourly Rate" id="ovrate" value={hourlyRate} onChange={setHourlyRate} unit={sym} />
        <N label="Regular Hours" id="ovreg" value={regHours} onChange={setRegHours} unit="hrs" hint="Usually 40 hrs/week" />
        <N label="Overtime Hours (1.5×)" id="ovot" value={otHours} onChange={setOtHours} unit="hrs" />
        <N label="Double Time Hours (2×)" id="ovdbl" value={doubleHours} onChange={setDoubleHours} unit="hrs" placeholder="0" />
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Overtime Pay" /></div>
    </div>
  );
}

// ── Salary to Hourly Calculator ───────────────────────────────────────
export function SalaryToHourlyForm() {
  const { fm, sym } = useCurrency();
  const [amount, setAmount] = useState("60000");
  const [period, setPeriod] = useState("annual");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");
  const [weeksPerYear, setWeeksPerYear] = useState("50");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const amt = +amount, h = +hoursPerWeek, w = +weeksPerYear;
    const annualFactor = { hourly: h * w, daily: w * 5, weekly: w, biweekly: w / 2, monthly: 12, annual: 1 };
    const annual = amt * (annualFactor[period] || 1);
    const weekly = annual / w;
    const daily = weekly / 5;
    const hourly = daily / (h / 5);
    setRes(buildResult("Hourly Rate", fm(Math.round(hourly * 100) / 100),
      [
        { label: "Hourly", value: fm(Math.round(hourly * 100) / 100), highlight: true },
        { label: "Daily (8hr day)", value: fm(Math.round(daily)) },
        { label: "Weekly", value: fm(Math.round(weekly)) },
        { label: "Monthly", value: fm(Math.round(annual / 12)) },
        { label: "Annual", value: fm(Math.round(annual)) },
      ],
      [], null, []));
  }, [amount, period, hoursPerWeek, weeksPerYear]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <N label="Salary Amount" id="s2ha" value={amount} onChange={setAmount} unit={sym} />
        <Sel label="Pay Period" id="s2hp" value={period} onChange={setPeriod} opts={[
          { v: "hourly", l: "Hourly" }, { v: "daily", l: "Daily" }, { v: "weekly", l: "Weekly" },
          { v: "biweekly", l: "Bi-Weekly" }, { v: "monthly", l: "Monthly" }, { v: "annual", l: "Annual" },
        ]} />
        <Row2>
          <N label="Hours per Week" id="s2hh" value={hoursPerWeek} onChange={setHoursPerWeek} unit="hrs" />
          <N label="Weeks per Year" id="s2hw" value={weeksPerYear} onChange={setWeeksPerYear} unit="wks" hint="Typically 50 (excl. 2 wks vacation)" />
        </Row2>
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Salary to Hourly" /></div>
    </div>
  );
}

// ── Meeting Cost Calculator ───────────────────────────────────────────
export function MeetingCostForm() {
  const { fm, sym } = useCurrency();
  const [attendees, setAttendees] = useState(8);
  const [avgSalary, setAvgSalary] = useState("80000");
  const [duration, setDuration] = useState(60);
  const [res, setRes] = useState(null);

  useEffect(() => {
    const hourlyPerPerson = +avgSalary / 2080; // 52 wks × 40 hrs
    const totalHourly = hourlyPerPerson * attendees;
    const totalCost = totalHourly * (duration / 60);
    const yearlyIfRecurring = totalCost * 52;
    setRes(buildResult("Meeting Cost", fm(Math.round(totalCost)),
      [
        { label: "Attendees", value: attendees + " people" },
        { label: "Cost per Minute", value: fm((totalCost / duration).toFixed(2)) + "/min" },
        { label: "If Weekly (52×/yr)", value: fm(Math.round(yearlyIfRecurring)), warn: true },
        { label: "Per Person", value: fm(Math.round(totalCost / attendees)) },
      ],
      [{ type: "warn", msg: `This ${duration}-minute meeting costs ${fm(Math.round(totalCost))}. If held weekly, that's ${fm(Math.round(yearlyIfRecurring))} per year. Consider if it could be an email!` }],
      null, []));
  }, [attendees, avgSalary, duration]);

  return (
    <div>
      <Sl label="Number of Attendees" id="mca" min={2} max={50} value={attendees} onChange={setAttendees} fmt={v => `${v} people`} />
      <N label="Average Annual Salary" id="mcs" value={avgSalary} onChange={setAvgSalary} unit={sym} hint="Average across all attendees" />
      <Sl label="Meeting Duration" id="mcd" min={5} max={480} step={5} value={duration} onChange={setDuration} fmt={v => v >= 60 ? `${Math.floor(v / 60)}h ${v % 60}m` : `${v} min`} />
      {attendees > 0 && <Panel result={{ primary: { label: "Meeting Cost", value: fm(Math.round((+avgSalary / 2080) * attendees * (duration / 60))) }, stats: [{ label: "Per Minute", value: fm(((+avgSalary / 2080) * attendees / 60).toFixed(2)) }, { label: "Hourly Rate", value: fm(Math.round((+avgSalary / 2080) * attendees)) }, { label: "If Weekly/yr", value: fm(Math.round((+avgSalary / 2080) * attendees * (duration / 60) * 52)) }], insights: [{ type: "warn", msg: `This meeting costs ${fm(Math.round((+avgSalary / 2080) * attendees / 60 * duration))}.` }], chart: null, breakdowns: [] }} loading={null} label="Meeting Cost" />}
    </div>
  );
}

// ── Conversion Rate Calculator ────────────────────────────────────────
export function ConversionRateForm() {
  const { fm, sym } = useCurrency();
  const [visitors, setVisitors] = useState("10000");
  const [conversions, setConversions] = useState("250");
  const [avgValue, setAvgValue] = useState("50");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const v = +visitors, c = +conversions, val = +avgValue;
    const rate = (c / v * 100);
    const revenue = c * val;
    const revenueIfDoubled = (c * 2) * val;
    setRes(buildResult("Conversion Rate", rate.toFixed(2) + "%",
      [
        { label: "Total Visitors", value: v.toLocaleString() },
        { label: "Conversions", value: c.toLocaleString() },
        { label: "Revenue", value: fm(Math.round(revenue)), highlight: true },
        { label: "Revenue if 2× CVR", value: fm(Math.round(revenueIfDoubled)) },
      ],
      [{ type: rate < 2 ? "warn" : "tip", msg: `${rate.toFixed(2)}% CVR. ${rate < 2 ? "Below average! Industry average is 2-4%. Even a 0.5% improvement could add " + fm(Math.round(v * 0.005 * val)) + "/period." : "Good! Improving by 1% would add " + fm(Math.round(v * 0.01 * val)) + "/period."}` }],
      null, []));
  }, [visitors, conversions, avgValue]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <N label="Total Visitors" id="crv" value={visitors} onChange={setVisitors} unit="visitors" />
        <N label="Conversions (Sales/Leads)" id="crc" value={conversions} onChange={setConversions} unit="conversions" />
        <N label="Average Conversion Value" id="crval" value={avgValue} onChange={setAvgValue} unit={sym} />
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Conversion Rate" /></div>
    </div>
  );
}

// ── Customer Lifetime Value Calculator ────────────────────────────────
export function CLVForm() {
  const { fm, sym } = useCurrency();
  const [avgPurchase, setAvgPurchase] = useState("100");
  const [frequency, setFrequency] = useState("4");
  const [lifespan, setLifespan] = useState("5");
  const [margin, setMargin] = useState("30");
  const [cac, setCac] = useState("50");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const ap = +avgPurchase, f = +frequency, l = +lifespan, m = +margin / 100, c = +cac;
    const clv = ap * f * l;
    const clvMargin = clv * m;
    const ltv_cac = clvMargin / Math.max(c, 0.01);
    setRes(buildResult("Customer Lifetime Value", fm(Math.round(clv)),
      [
        { label: "CLV (Revenue)", value: fm(Math.round(clv)) },
        { label: "CLV (Margin)", value: fm(Math.round(clvMargin)), highlight: true },
        { label: "Customer Acquisition Cost", value: fm(c) },
        { label: "LTV:CAC Ratio", value: ltv_cac.toFixed(2) + ":1", highlight: ltv_cac >= 3, warn: ltv_cac < 1 },
      ],
      [{ type: ltv_cac >= 3 ? "tip" : ltv_cac < 1 ? "warn" : "tip", msg: ltv_cac >= 3 ? `Excellent LTV:CAC ratio of ${ltv_cac.toFixed(2)}:1! Target is 3:1 or higher.` : ltv_cac < 1 ? `LTV:CAC below 1 — you are spending more to acquire customers than they're worth. Improve retention or reduce acquisition costs.` : `LTV:CAC of ${ltv_cac.toFixed(2)}:1 is below target of 3:1. Focus on increasing retention or purchase frequency.` }],
      null, [
        { label: "Annual Value per Customer", value: fm(Math.round(ap * f)) },
        { label: "Margin per Customer/yr", value: fm(Math.round(ap * f * m)) },
        { label: "Payback Period", value: (c / (ap * f * m / 12)).toFixed(1) + " months" },
      ]));
  }, [avgPurchase, frequency, lifespan, margin, cac]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <N label="Average Purchase Value" id="clvap" value={avgPurchase} onChange={setAvgPurchase} unit={sym} />
        <N label="Purchase Frequency (per year)" id="clvf" value={frequency} onChange={setFrequency} unit="×/yr" />
        <N label="Customer Lifespan (years)" id="clvl" value={lifespan} onChange={setLifespan} unit="yrs" />
        <Row2>
          <N label="Gross Margin (%)" id="clvm" value={margin} onChange={setMargin} unit="%" />
          <N label="Customer Acquisition Cost" id="clvcac" value={cac} onChange={setCac} unit={sym} />
        </Row2>
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Customer LTV" /></div>
    </div>
  );
}

// ── CPC / CPA Calculator ──────────────────────────────────────────────
export function CPCCPAForm() {
  const { fm, sym } = useCurrency();
  const [adSpend, setAdSpend] = useState("5000");
  const [clicks, setClicks] = useState("2500");
  const [conversions, setConversions] = useState("50");
  const [revenue, setRevenue] = useState("15000");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const spend = +adSpend, c = +clicks, conv = +conversions, rev = +revenue;
    const cpc = spend / Math.max(c, 1);
    const cpa = spend / Math.max(conv, 1);
    const ctr = conv / Math.max(c, 1) * 100;
    const roas = rev / Math.max(spend, 1);
    setRes(buildResult("ROAS", roas.toFixed(2) + "×",
      [
        { label: "CPC (Cost per Click)", value: fm(cpc.toFixed(2)) },
        { label: "CPA (Cost per Acquisition)", value: fm(cpa.toFixed(2)), highlight: true },
        { label: "Conversion Rate", value: ctr.toFixed(2) + "%" },
        { label: "ROAS", value: roas.toFixed(2) + "×", highlight: roas >= 4, warn: roas < 2 },
      ],
      [{ type: roas >= 4 ? "tip" : "warn", msg: `ROAS of ${roas.toFixed(2)}× means you earn ${fm(roas.toFixed(2))} for every ${fm(1)} spent. Target is typically 4× or higher.` }],
      null, [
        { label: "Ad Spend", value: fm(spend) },
        { label: "Total Revenue", value: fm(rev) },
        { label: "Net Profit from Ads", value: fm(rev - spend), },
      ]));
  }, [adSpend, clicks, conversions, revenue]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <N label="Total Ad Spend" id="cpcspend" value={adSpend} onChange={setAdSpend} unit={sym} />
        <N label="Total Clicks" id="cpcclicks" value={clicks} onChange={setClicks} unit="clicks" />
        <N label="Total Conversions" id="cpcconv" value={conversions} onChange={setConversions} unit="sales" />
        <N label="Total Revenue Generated" id="cpcrev" value={revenue} onChange={setRevenue} unit={sym} />
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="CPC / CPA / ROAS" /></div>
    </div>
  );
}

// ── Employee Cost Calculator ──────────────────────────────────────────
export function EmployeeCostForm() {
  const { fm, sym } = useCurrency();
  const [salary, setSalary] = useState("60000");
  const [benefits, setBenefits] = useState("15");
  const [payrollTax, setPayrollTax] = useState("7.65");
  const [overhead, setOverhead] = useState("10");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const s = +salary, b = +benefits / 100, p = +payrollTax / 100, o = +overhead / 100;
    const benefitsAmt = s * b;
    const payrollAmt = s * p;
    const overheadAmt = s * o;
    const totalCost = s + benefitsAmt + payrollAmt + overheadAmt;
    const ratio = totalCost / s;
    const chart = { type: "donut", data: [
      { name: "Base Salary", value: s, color: "var(--brand)" },
      { name: "Benefits", value: benefitsAmt, color: "#f59e0b" },
      { name: "Payroll Tax", value: payrollAmt, color: "#ef4444" },
      { name: "Overhead", value: overheadAmt, color: "#8b5cf6" },
    ]};
    setRes(buildResult("True Employee Cost", fm(Math.round(totalCost)),
      [
        { label: "Base Salary", value: fm(Math.round(s)) },
        { label: "Benefits (" + benefits + "%)", value: fm(Math.round(benefitsAmt)) },
        { label: "Payroll Tax (" + payrollTax + "%)", value: fm(Math.round(payrollAmt)), warn: true },
        { label: "Cost Multiplier", value: ratio.toFixed(2) + "×", highlight: true },
      ],
      [{ type: "tip", msg: `A ${fm(Math.round(s))} salary actually costs you ${fm(Math.round(totalCost))}/year — ${((ratio - 1) * 100).toFixed(0)}% more than the base salary.` }],
      chart, [
        { label: "Hourly Cost", value: fm((totalCost / 2080).toFixed(2)) },
        { label: "Monthly Cost", value: fm(Math.round(totalCost / 12)) },
      ]));
  }, [salary, benefits, payrollTax, overhead]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <N label="Base Annual Salary" id="ecsal" value={salary} onChange={setSalary} unit={sym} />
        <N label="Benefits (% of salary)" id="ecben" value={benefits} onChange={setBenefits} unit="%" hint="Health, dental, retirement match etc." />
        <N label="Employer Payroll Tax (%)" id="ecptax" value={payrollTax} onChange={setPayrollTax} unit="%" hint="US: 7.65% (Social Security + Medicare)" />
        <N label="Overhead (% of salary)" id="ecoh" value={overhead} onChange={setOverhead} unit="%" hint="Office space, equipment, software etc." />
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Employee Cost" /></div>
    </div>
  );
}
