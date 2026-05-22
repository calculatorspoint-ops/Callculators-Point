import { appendFileSync } from 'fs';

const code = `

// ── Amortization Calculator ───────────────────────────────────────────
export function AmortizationForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [principal, setPrincipal] = useState(300000);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);
  const [extra, setExtra] = useState("0");
  const [showAll, setShowAll] = useState(false);
  const [res, setRes] = useState(null);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const r = rate / 100 / 12;
    const n = term * 12;
    if (!principal || !rate || !term || !r) { setRes(null); return; }
    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const extraPmt = +extra || 0;
    let bal = principal;
    let totalInterest = 0;
    let months = 0;
    const rows = [];
    while (bal > 0.01 && months < n + 1) {
      months++;
      const interestPmt = bal * r;
      let principalPmt = emi - interestPmt + extraPmt;
      if (principalPmt > bal) principalPmt = bal;
      bal = Math.max(0, bal - principalPmt);
      totalInterest += interestPmt;
      rows.push({
        month: months,
        payment: Math.round(emi + extraPmt),
        principal: Math.round(principalPmt),
        interest: Math.round(interestPmt),
        balance: Math.round(bal),
      });
      if (bal <= 0.01) break;
    }
    setSchedule(rows);
    const originalMonths = n;
    const monthsSaved = originalMonths - months;
    const originalInterest = emi * n - principal;
    const interestSaved = originalInterest - totalInterest;
    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + months);
    const chartData = rows.filter((_, i) => i % Math.max(1, Math.floor(rows.length / 24)) === 0).map(r => ({
      month: "Mo " + r.month,
      Principal: r.principal,
      Interest: r.interest,
      Balance: Math.round(r.balance / 1000),
    }));
    const chart = { type: "area", data: chartData, keys: ["Principal", "Interest"] };
    setRes(buildResult("Monthly Payment", fm(Math.round(emi + (+extra || 0))),
      [
        { label: "Total Interest Paid", value: fm(Math.round(totalInterest)), warn: true },
        { label: "Total Amount Paid", value: fm(Math.round(totalInterest + principal)) },
        { label: "Payoff Date", value: payoffDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }) },
        extraPmt > 0 ? { label: "Interest Saved", value: fm(Math.round(interestSaved)), highlight: true } : null,
        extraPmt > 0 ? { label: "Months Saved", value: monthsSaved + " months (" + (monthsSaved / 12).toFixed(1) + " yrs)", highlight: true } : null,
      ].filter(Boolean),
      [{ type: extraPmt > 0 ? "tip" : "tip", msg: extraPmt > 0
        ? "Extra " + fm(extraPmt) + "/mo saves " + fm(Math.round(interestSaved)) + " in interest and pays off " + (monthsSaved / 12).toFixed(1) + " years early!"
        : "Add an extra monthly payment above to see how much interest and time you save." }],
      chart, [
        { label: "Loan Amount", value: fm(principal) },
        { label: "Interest Rate", value: rate + "%" },
        { label: "Loan Term", value: term + " years (" + n + " months)" },
        { label: "Base Monthly Payment", value: fm(Math.round(emi)) },
      ]));
  }, [principal, rate, term, extra]);

  const visibleRows = showAll ? schedule : schedule.slice(0, 12);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Presets items={[
            { label: "Home Loan 30yr", v: { p: 300000, r: 6.5, y: 30, e: 0 } },
            { label: "Home Loan 15yr", v: { p: 300000, r: 6.0, y: 15, e: 0 } },
            { label: "Car Loan 5yr", v: { p: 35000, r: 7.5, y: 5, e: 0 } },
          ]} onApply={p => { setPrincipal(p.v.p); setRate(p.v.r); setTerm(p.v.y); setExtra(String(p.v.e)); }} />
          <Sl label="Loan Amount" id="am_p" min={10000} max={2000000} step={5000} value={principal} onChange={setPrincipal} fmt={v => fmSlider(v)} />
          <Sl label="Interest Rate (% p.a.)" id="am_r" min={1} max={20} step={0.1} value={rate} onChange={setRate} fmt={v => v + "%"} />
          <Sl label="Loan Term" id="am_t" min={1} max={40} value={term} onChange={setTerm} fmt={v => v + " yrs"} />
          <N label="Extra Monthly Payment (optional)" id="am_ex" value={extra} onChange={setExtra} unit={sym} placeholder="0" hint="Accelerates payoff, reduces interest" />
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="Amortization" /></div>
      </div>
      {schedule.length > 0 && (
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "var(--r-xl)", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderBottom: "1px solid var(--border)", background: "var(--surface2)" }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Amortization Schedule</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => {
                const csv = "Month,Payment,Principal,Interest,Balance\\n" + schedule.map(r => r.month + "," + r.payment + "," + r.principal + "," + r.interest + "," + r.balance).join("\\n");
                navigator.clipboard.writeText(csv);
              }} style={{ fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: "var(--r-md)", border: "1.5px solid var(--border)", background: "var(--surface)", color: "var(--brand)", cursor: "pointer" }}>
                📋 Copy CSV
              </button>
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--surface2)" }}>
                  {["Month", "Payment", "Principal", "Interest", "Balance"].map(h => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: "var(--text2)", fontSize: 12, textTransform: "uppercase", letterSpacing: ".04em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row, i) => (
                  <tr key={row.month} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "var(--surface2)" }}>
                    <td style={{ padding: "9px 14px", textAlign: "right", color: "var(--text3)", fontWeight: 600 }}>{row.month}</td>
                    <td style={{ padding: "9px 14px", textAlign: "right", color: "var(--text)", fontWeight: 600 }}>{fm(row.payment)}</td>
                    <td style={{ padding: "9px 14px", textAlign: "right", color: "var(--success)", fontWeight: 600 }}>{fm(row.principal)}</td>
                    <td style={{ padding: "9px 14px", textAlign: "right", color: "#ef4444", fontWeight: 600 }}>{fm(row.interest)}</td>
                    <td style={{ padding: "9px 14px", textAlign: "right", color: "var(--text)", fontWeight: 600 }}>{fm(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {schedule.length > 12 && (
            <div style={{ padding: "12px", textAlign: "center", borderTop: "1px solid var(--border)" }}>
              <button onClick={() => setShowAll(!showAll)} style={{ fontSize: 13, fontWeight: 700, color: "var(--brand)", background: "transparent", border: "none", cursor: "pointer" }}>
                {showAll ? "▲ Show Less" : "▼ Show All " + schedule.length + " Months"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── TVM Finance Calculator ────────────────────────────────────────────
export function TVMForm() {
  const { fm, sym } = useCurrency();
  const [solveFor, setSolveFor] = useState("FV");
  const [pv, setPV] = useState("10000");
  const [fv, setFV] = useState("");
  const [pmt, setPMT] = useState("0");
  const [rateVal, setRateVal] = useState("7");
  const [nper, setNper] = useState("10");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const PV = +pv || 0, PMT = +pmt || 0, r = +rateVal / 100, N = +nper;
    try {
      if (solveFor === "FV") {
        if (!r || !N) { setRes(null); return; }
        const fvCalc = PV * Math.pow(1 + r, N) + PMT * ((Math.pow(1 + r, N) - 1) / r);
        setRes(buildResult("Future Value", fm(Math.round(fvCalc)),
          [
            { label: "Present Value", value: fm(PV) },
            { label: "Annual Rate", value: rateVal + "%" },
            { label: "Periods", value: N + " years" },
            { label: "Total Contributions", value: fm(Math.round(PV + PMT * N)) },
          ],
          [{ type: "tip", msg: fm(PV) + " growing at " + rateVal + "% for " + N + " years becomes " + fm(Math.round(fvCalc)) + "." }],
          null, []));
      } else if (solveFor === "PV") {
        const FV = +fv || 0;
        if (!r || !N || !FV) { setRes(null); return; }
        const pvCalc = (FV - PMT * ((Math.pow(1 + r, N) - 1) / r)) / Math.pow(1 + r, N);
        setRes(buildResult("Present Value", fm(Math.round(pvCalc)),
          [
            { label: "Future Value", value: fm(FV) },
            { label: "Discount Rate", value: rateVal + "%" },
            { label: "Periods", value: N + " years" },
            { label: "Discount Factor", value: (1 / Math.pow(1 + r, N)).toFixed(4) },
          ],
          [{ type: "tip", msg: fm(FV) + " in " + N + " years at " + rateVal + "% is worth " + fm(Math.round(pvCalc)) + " today." }],
          null, []));
      } else if (solveFor === "PMT") {
        const FV = +fv || 0;
        if (!r || !N) { setRes(null); return; }
        const pmtCalc = (FV - PV * Math.pow(1 + r, N)) * r / (Math.pow(1 + r, N) - 1);
        setRes(buildResult("Required Payment", fm(Math.round(Math.abs(pmtCalc))),
          [
            { label: "Present Value", value: fm(PV) },
            { label: "Target Future Value", value: fm(FV) },
            { label: "Annual Rate", value: rateVal + "%" },
            { label: "Periods", value: N + " years" },
          ],
          [{ type: "tip", msg: "You need " + fm(Math.round(Math.abs(pmtCalc))) + "/year to reach " + fm(FV) + " in " + N + " years at " + rateVal + "%." }],
          null, []));
      } else if (solveFor === "Rate") {
        const FV = +fv || 0;
        if (!N || !PV || !FV) { setRes(null); return; }
        let r2 = 0.08;
        for (let i = 0; i < 1000; i++) {
          const fvTest = PV * Math.pow(1 + r2, N) + PMT * ((Math.pow(1 + r2, N) - 1) / r2);
          const diff = fvTest - FV;
          if (Math.abs(diff) < 0.01) break;
          r2 += diff > 0 ? -0.0001 : 0.0001;
        }
        const rateResult = (r2 * 100).toFixed(3);
        setRes(buildResult("Required Rate", rateResult + "%",
          [
            { label: "Present Value", value: fm(PV) },
            { label: "Future Value", value: fm(FV) },
            { label: "Periods", value: N + " years" },
            { label: "Solved Rate", value: rateResult + "% p.a.", highlight: true },
          ],
          [{ type: "tip", msg: "To grow " + fm(PV) + " to " + fm(FV) + " in " + N + " years requires " + rateResult + "% annual return." }],
          null, []));
      } else if (solveFor === "N") {
        const FV = +fv || 0;
        if (!r || !PV || !FV) { setRes(null); return; }
        const nCalc = PMT !== 0
          ? Math.log((FV * r + PMT) / (PV * r + PMT)) / Math.log(1 + r)
          : Math.log(FV / PV) / Math.log(1 + r);
        setRes(buildResult("Periods Required", Math.ceil(nCalc) + " years",
          [
            { label: "Present Value", value: fm(PV) },
            { label: "Future Value", value: fm(FV) },
            { label: "Annual Rate", value: rateVal + "%" },
            { label: "Exact Periods", value: nCalc.toFixed(2) + " years" },
          ],
          [{ type: "tip", msg: "At " + rateVal + "%, it takes " + Math.ceil(nCalc) + " years to grow " + fm(PV) + " to " + fm(FV) + "." }],
          null, []));
      }
    } catch { setRes(null); }
  }, [solveFor, pv, fv, pmt, rateVal, nper]);

  const inputs = {
    PV: <N label="Present Value (PV)" id="tvm_pv" value={pv} onChange={setPV} unit={sym} />,
    FV: <N label="Future Value (FV)" id="tvm_fv" value={fv} onChange={setFV} unit={sym} placeholder="Calculated" />,
    PMT: <N label="Annual Payment (PMT)" id="tvm_pmt" value={pmt} onChange={setPMT} unit={sym} placeholder="0" hint="Periodic contribution (+ = inflow)" />,
    Rate: <N label="Annual Rate (%)" id="tvm_r" value={rateVal} onChange={setRateVal} unit="%" />,
    N: <N label="Periods (years)" id="tvm_n" value={nper} onChange={setNper} unit="yrs" />,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text3)", marginBottom: 8 }}>Solve For</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["FV", "PV", "PMT", "Rate", "N"].map(v => (
              <button key={v} onClick={() => setSolveFor(v)} style={{
                padding: "8px 16px", borderRadius: "var(--r-md)", fontWeight: 700, fontSize: 13, cursor: "pointer",
                background: solveFor === v ? "var(--brand)" : "var(--surface2)",
                color: solveFor === v ? "#fff" : "var(--text2)",
                border: "1.5px solid " + (solveFor === v ? "var(--brand)" : "var(--border)"),
              }}>{v === "N" ? "Periods (N)" : v === "Rate" ? "Rate" : v}</button>
            ))}
          </div>
        </div>
        {Object.entries(inputs).filter(([k]) => k !== solveFor).map(([k, el]) => (
          <div key={k}>{el}</div>
        ))}
        <Presets items={[
          { label: "Loan (Solve PMT)", v: { sf: "PMT", p: "200000", f: "0", pm: "0", r: "6.5", n: "30" } },
          { label: "Savings (Solve FV)", v: { sf: "FV", p: "10000", f: "", pm: "500", r: "7", n: "20" } },
          { label: "Retirement (Solve N)", v: { sf: "N", p: "50000", f: "1000000", pm: "1000", r: "8", n: "25" } },
        ]} onApply={p => { setSolveFor(p.v.sf); setPV(p.v.p); setFV(p.v.f); setPMT(p.v.pm); setRateVal(p.v.r); setNper(p.v.n); }} />
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="TVM Calculator" /></div>
    </div>
  );
}

// ── Investment Calculator (Enhanced) ─────────────────────────────────
export function InvestmentCalcForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [initial, setInitial] = useState(10000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(20);
  const [stepUp, setStepUp] = useState(0);
  const [inflation, setInflation] = useState(3);
  const [taxRate, setTaxRate] = useState(0);
  const [res, setRes] = useState(null);

  useEffect(() => {
    let balance = initial;
    let totalContrib = initial;
    let currentMonthly = monthly;
    const chartData = [];
    const rm = rate / 100 / 12;
    const inflRate = inflation / 100;

    for (let y = 0; y <= years; y++) {
      if (y > 0) {
        for (let m = 0; m < 12; m++) {
          balance = balance * (1 + rm) + currentMonthly;
          totalContrib += currentMonthly;
        }
        currentMonthly *= (1 + stepUp / 100);
      }
      const realBalance = balance / Math.pow(1 + inflRate, y);
      chartData.push({
        year: "Yr " + y,
        "Nominal Balance": Math.round(balance),
        "Real Balance": Math.round(realBalance),
        Contributed: Math.round(totalContrib),
      });
    }

    const gains = balance - totalContrib;
    const taxOnGains = gains * (taxRate / 100);
    const afterTax = balance - taxOnGains;
    const realBalance = balance / Math.pow(1 + inflRate, years);
    const realGains = realBalance - totalContrib;

    const chart = { type: "area", data: chartData.filter((_, i) => i % Math.max(1, Math.floor(years / 10)) === 0), keys: ["Nominal Balance", "Real Balance", "Contributed"] };

    setRes(buildResult("Portfolio Value", fm(Math.round(afterTax)),
      [
        { label: "Total Invested", value: fm(Math.round(totalContrib)) },
        { label: "Nominal Gains", value: fm(Math.round(gains)), highlight: true },
        { label: "Real Value (inflation-adj)", value: fm(Math.round(realBalance)) },
        taxRate > 0 ? { label: "After-Tax Value", value: fm(Math.round(afterTax)), highlight: true } : null,
        { label: "Real Purchasing Power Gain", value: fm(Math.round(realGains)), highlight: realGains > 0, warn: realGains < 0 },
      ].filter(Boolean),
      [{ type: "tip", msg: fm(Math.round(totalContrib)) + " invested grows to " + fm(Math.round(balance)) + " nominally, but only " + fm(Math.round(realBalance)) + " in today's purchasing power after " + inflation + "% inflation." }],
      chart, [
        { label: "Initial Investment", value: fm(initial) },
        { label: "Monthly Contribution", value: fm(monthly) },
        { label: "Annual Step-Up", value: stepUp + "%" },
        { label: "Inflation Rate", value: inflation + "%" },
      ]));
  }, [initial, monthly, rate, years, stepUp, inflation, taxRate]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Presets items={[
          { label: "Conservative", v: { i: 10000, m: 300, r: 5, y: 20, s: 2, inf: 3, t: 15 } },
          { label: "Moderate", v: { i: 10000, m: 500, r: 8, y: 20, s: 3, inf: 3, t: 20 } },
          { label: "Aggressive", v: { i: 25000, m: 1000, r: 12, y: 25, s: 5, inf: 3, t: 20 } },
        ]} onApply={p => { setInitial(p.v.i); setMonthly(p.v.m); setRate(p.v.r); setYears(p.v.y); setStepUp(p.v.s); setInflation(p.v.inf); setTaxRate(p.v.t); }} />
        <Sl label="Initial Investment" id="ic_i" min={0} max={500000} step={1000} value={initial} onChange={setInitial} fmt={v => fmSlider(v)} />
        <Sl label="Monthly Contribution" id="ic_m" min={0} max={10000} step={50} value={monthly} onChange={setMonthly} fmt={v => fmSlider(v)} />
        <Sl label="Expected Annual Return (%)" id="ic_r" min={1} max={20} step={0.5} value={rate} onChange={setRate} fmt={v => v + "%"} />
        <Sl label="Investment Horizon" id="ic_y" min={1} max={50} value={years} onChange={setYears} fmt={v => v + " yrs"} />
        <Row2>
          <Sl label="Annual Step-Up (%)" id="ic_s" min={0} max={15} step={0.5} value={stepUp} onChange={setStepUp} fmt={v => v + "%"} />
          <Sl label="Inflation Rate (%)" id="ic_inf" min={0} max={10} step={0.5} value={inflation} onChange={setInflation} fmt={v => v + "%"} />
        </Row2>
        <Sl label="Tax Rate on Gains (%)" id="ic_tax" min={0} max={40} step={1} value={taxRate} onChange={setTaxRate} fmt={v => v + "%"} />
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Investment Calculator" /></div>
    </div>
  );
}

// ── Generic Loan Calculator ───────────────────────────────────────────
export function GenericLoanForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [loanType, setLoanType] = useState("Personal Loan");
  const [principal, setPrincipal] = useState(25000);
  const [rate, setRate] = useState(9.5);
  const [term, setTerm] = useState(36);
  const [res, setRes] = useState(null);

  const loanTypes = {
    "Personal Loan": { rate: 9.5, term: 36, presets: [{ label: "Small $5K", v: { p: 5000, r: 12, t: 24 } }, { label: "Medium $25K", v: { p: 25000, r: 9.5, t: 36 } }, { label: "Large $50K", v: { p: 50000, r: 8, t: 60 } }] },
    "Business Loan": { rate: 7.5, term: 60, presets: [{ label: "Startup $50K", v: { p: 50000, r: 8.5, t: 60 } }, { label: "Growth $250K", v: { p: 250000, r: 7, t: 84 } }, { label: "Expansion $500K", v: { p: 500000, r: 6.5, t: 120 } }] },
    "Student Loan": { rate: 5.5, term: 120, presets: [{ label: "Undergrad", v: { p: 30000, r: 5.5, t: 120 } }, { label: "Graduate", v: { p: 75000, r: 6.5, t: 120 } }, { label: "Professional", v: { p: 150000, r: 7, t: 120 } }] },
    "Auto Loan": { rate: 7, term: 60, presets: [{ label: "Used Car", v: { p: 15000, r: 8, t: 48 } }, { label: "New Car", v: { p: 35000, r: 6.5, t: 60 } }, { label: "Luxury Car", v: { p: 80000, r: 5.5, t: 72 } }] },
  };

  useEffect(() => {
    const r = rate / 100 / 12, n = term;
    if (!principal || !rate || !term || !r) { setRes(null); return; }
    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    const interest = total - principal;
    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + n);
    const chart = { type: "donut", data: [
      { name: "Principal", value: Math.round(principal) },
      { name: "Interest", value: Math.round(interest) },
    ]};
    setRes(buildResult("Monthly Payment", fm(Math.round(emi)),
      [
        { label: "Loan Amount", value: fm(principal) },
        { label: "Total Interest", value: fm(Math.round(interest)), warn: true },
        { label: "Total Amount Paid", value: fm(Math.round(total)) },
        { label: "Payoff Date", value: payoffDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }) },
      ],
      [{ type: "tip", msg: "You pay " + fm(Math.round(interest)) + " in interest (" + (interest / principal * 100).toFixed(0) + "% of principal). Paying " + fm(Math.round(emi * 1.1)) + "/mo (10% extra) saves " + fm(Math.round(interest * 0.08)) + " in interest." }],
      chart, [
        { label: "Loan Type", value: loanType },
        { label: "APR", value: rate + "%" },
        { label: "Term", value: term + " months (" + (term / 12).toFixed(1) + " years)" },
        { label: "Interest Rate Ratio", value: (interest / total * 100).toFixed(1) + "% of total cost" },
      ]));
  }, [principal, rate, term, loanType]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text3)", marginBottom: 8 }}>Loan Type</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {Object.keys(loanTypes).map(t => (
              <button key={t} onClick={() => { setLoanType(t); setRate(loanTypes[t].rate); setTerm(loanTypes[t].term); }} style={{
                padding: "7px 14px", borderRadius: "var(--r-md)", fontWeight: 700, fontSize: 12, cursor: "pointer",
                background: loanType === t ? "var(--brand)" : "var(--surface2)",
                color: loanType === t ? "#fff" : "var(--text2)",
                border: "1.5px solid " + (loanType === t ? "var(--brand)" : "var(--border)"),
              }}>{t}</button>
            ))}
          </div>
        </div>
        <Presets items={loanTypes[loanType].presets} onApply={p => { setPrincipal(p.v.p); setRate(p.v.r); setTerm(p.v.t); }} />
        <Sl label="Loan Amount" id="gl_p" min={1000} max={1000000} step={1000} value={principal} onChange={setPrincipal} fmt={v => fmSlider(v)} />
        <Sl label="Interest Rate (APR %)" id="gl_r" min={1} max={30} step={0.25} value={rate} onChange={setRate} fmt={v => v + "%"} />
        <Sel label="Loan Term" id="gl_t" value={String(term)} onChange={v => setTerm(+v)} opts={[
          {v:"12",l:"12 months (1 yr)"},{v:"24",l:"24 months (2 yr)"},{v:"36",l:"36 months (3 yr)"},
          {v:"48",l:"48 months (4 yr)"},{v:"60",l:"60 months (5 yr)"},{v:"72",l:"72 months (6 yr)"},
          {v:"84",l:"84 months (7 yr)"},{v:"120",l:"120 months (10 yr)"},{v:"180",l:"180 months (15 yr)"},
          {v:"240",l:"240 months (20 yr)"},{v:"360",l:"360 months (30 yr)"},
        ]} />
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Loan Calculator" /></div>
    </div>
  );
}
`;

appendFileSync('src/components/calculator-core/forms/FinanceFormsNew.jsx', code, 'utf8');
console.log('Done! Appended 4 new calculator forms: Amortization, TVM, Investment, GenericLoan.');
