import { readFileSync, writeFileSync } from 'fs';
const existing = readFileSync('src/components/calculator-core/forms/CoreFinanceForms.jsx', 'utf8');

const TAX_FORM = `// ── Tax Calculator ───────────────────────────────────────────────────
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

`;

const GST_FORM = `// ── GST / VAT Calculator ─────────────────────────────────────────────
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

`;

const TIP_FORM = `// ── Tip Calculator ───────────────────────────────────────────────────
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

`;

const PPF_FORM = `// ── PPF Calculator ───────────────────────────────────────────────────
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

`;

const FD_FORM = `// ── Fixed Deposit Calculator ─────────────────────────────────────────
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

`;

const LOAN_COMPARE_FORM = `// ── Loan Comparison Calculator ───────────────────────────────────────
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
`;

writeFileSync('src/components/calculator-core/forms/CoreFinanceForms.jsx', existing + TAX_FORM + GST_FORM + TIP_FORM + PPF_FORM + FD_FORM + LOAN_COMPARE_FORM, 'utf8');
const totalLines = (existing + TAX_FORM + GST_FORM + TIP_FORM + PPF_FORM + FD_FORM + LOAN_COMPARE_FORM).split('\n').length;
console.log('Part 3 appended. Total lines now:', totalLines);
