import { writeFileSync } from 'fs';

const CONTENT = `import { useState, useEffect } from "react";
import { L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency } from "./SharedComponents.jsx";

// ── Retirement Planning Calculator ───────────────────────────────────
export function RetirementPlanForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [monthlyContrib, setMonthlyContrib] = useState(15000);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [inflation, setInflation] = useState(6);
  const [monthlyExpense, setMonthlyExpense] = useState(50000);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [tab, setTab] = useState("Plan");
  const [res, setRes] = useState(null);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const yearsToRetire = retirementAge - currentAge;
    const yearsInRetirement = lifeExpectancy - retirementAge;
    if (yearsToRetire <= 0 || yearsInRetirement <= 0) return;

    const realReturn = (1 + expectedReturn / 100) / (1 + inflation / 100) - 1;
    const r = expectedReturn / 100 / 12;
    const n = yearsToRetire * 12;
    const futureCurrentSavings = currentSavings * Math.pow(1 + r, n);
    const futureContrib = monthlyContrib * (Math.pow(1 + r, n) - 1) / r;
    const corpus = futureCurrentSavings + futureContrib;

    const inflatedExpense = monthlyExpense * Math.pow(1 + inflation / 100, yearsToRetire);
    const annualExpense = inflatedExpense * 12;
    const rRetire = realReturn / 12;
    const nRetire = yearsInRetirement * 12;
    const corpusNeeded = rRetire > 0 ? annualExpense / 12 * (1 - Math.pow(1 + rRetire, -nRetire)) / rRetire : annualExpense * yearsInRetirement;
    const corpusGap = corpusNeeded - corpus;
    const additionalMonthly = corpusGap > 0 && r > 0 ? corpusGap * r / (Math.pow(1 + r, n) - 1) : 0;
    const replacementRatio = (corpus / corpusNeeded) * 100;

    let yearlyCorpus = currentSavings;
    const rows = [];
    for (let yr = 1; yr <= Math.min(yearsToRetire, 30); yr++) {
      for (let mo = 0; mo < 12; mo++) {
        const interest = yearlyCorpus * r;
        yearlyCorpus += interest + monthlyContrib;
      }
      rows.push({ year: currentAge + yr, corpus: Math.round(yearlyCorpus), target: Math.round(corpusNeeded * (yr / yearsToRetire)) });
    }
    setSchedule(rows);
    const chart = { type: "area", data: rows.filter((_, i) => i % Math.max(1, Math.floor(rows.length / 10)) === 0).map(r => ({ age: r.year, Corpus: r.corpus, Target: r.target })), keys: ["Corpus", "Target"] };
    const onTrack = corpus >= corpusNeeded;
    setRes(buildResult("Retirement Corpus", fm(Math.round(corpus)),
      [
        { label: "Years to Retire", value: yearsToRetire + " years" },
        { label: "Corpus at Retirement", value: fm(Math.round(corpus)), highlight: onTrack, warn: !onTrack },
        { label: "Corpus Needed", value: fm(Math.round(corpusNeeded)) },
        { label: "Funding Ratio", value: replacementRatio.toFixed(0) + "%", highlight: replacementRatio >= 100, warn: replacementRatio < 80 },
        corpusGap > 0 ? { label: "Funding Gap", value: fm(Math.round(corpusGap)), warn: true } : { label: "Surplus", value: fm(Math.round(-corpusGap)), highlight: true },
        corpusGap > 0 ? { label: "Additional Monthly Needed", value: fm(Math.round(additionalMonthly)), warn: true } : null,
        { label: "Monthly Expense at Retirement (Inflation adj.)", value: fm(Math.round(inflatedExpense)) },
        { label: "Retirement Duration", value: yearsInRetirement + " years" },
      ].filter(Boolean),
      [{ type: onTrack ? "tip" : "warn", msg: onTrack ? "You are ON TRACK! Your " + fm(Math.round(corpus)) + " corpus is " + replacementRatio.toFixed(0) + "% of your retirement need. " + (corpus > corpusNeeded ? "Surplus of " + fm(Math.round(corpus - corpusNeeded)) + "!" : "") : "You have a funding gap of " + fm(Math.round(corpusGap)) + ". Increase SIP by " + fm(Math.round(additionalMonthly)) + "/mo to close the gap." }],
      chart,
      [{ label: "Real Return (after inflation)", value: (realReturn * 100).toFixed(2) + "%" }, { label: "Future Savings Value", value: fm(Math.round(futureCurrentSavings)) }, { label: "Future SIP Value", value: fm(Math.round(futureContrib)) }]
    ));
  }, [currentAge, retirementAge, currentSavings, monthlyContrib, expectedReturn, inflation, monthlyExpense, lifeExpectancy]);

  const exportCSV = () => {
    const csv = "Age,Corpus (Projected),Target\\n" + schedule.map(r => [r.year, r.corpus, r.target].join(",")).join("\\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "retirement-plan.csv"; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Presets items={[
            { label: "Young Starter (25yr)", v: { ca: 25, ra: 60, cs: 100000, mc: 5000, er: 12, inf: 6, me: 40000, le: 85 } },
            { label: "Mid Career (35yr)", v: { ca: 35, ra: 60, cs: 1000000, mc: 25000, er: 10, inf: 6, me: 60000, le: 85 } },
            { label: "Late Start (45yr)", v: { ca: 45, ra: 65, cs: 2000000, mc: 50000, er: 9, inf: 6, me: 80000, le: 90 } },
          ]} onApply={pr => { setCurrentAge(pr.v.ca); setRetirementAge(pr.v.ra); setCurrentSavings(pr.v.cs); setMonthlyContrib(pr.v.mc); setExpectedReturn(pr.v.er); setInflation(pr.v.inf); setMonthlyExpense(pr.v.me); setLifeExpectancy(pr.v.le); }} />
          <Row2>
            <Sl label="Current Age" id="rp_ca" min={18} max={60} value={currentAge} onChange={setCurrentAge} fmt={v => v + " yrs"} />
            <Sl label="Retirement Age" id="rp_ra" min={45} max={75} value={retirementAge} onChange={setRetirementAge} fmt={v => v + " yrs"} />
          </Row2>
          <Sl label="Current Savings / Investments" id="rp_cs" min={0} max={50000000} step={50000} value={currentSavings} onChange={setCurrentSavings} fmt={v => fmSlider(v)} />
          <Sl label="Monthly SIP / Contribution" id="rp_mc" min={500} max={500000} step={500} value={monthlyContrib} onChange={setMonthlyContrib} fmt={v => fmSlider(v)} />
          <Sl label="Expected Annual Return (%)" id="rp_er" min={6} max={18} step={0.5} value={expectedReturn} onChange={setExpectedReturn} fmt={v => v + "%"} />
          <Sl label="Expected Inflation (%)" id="rp_inf" min={3} max={10} step={0.5} value={inflation} onChange={setInflation} fmt={v => v + "%"} />
          <Sl label="Monthly Expenses (Today's value)" id="rp_me" min={10000} max={500000} step={1000} value={monthlyExpense} onChange={setMonthlyExpense} fmt={v => fmSlider(v)} />
          <Sl label="Life Expectancy" id="rp_le" min={70} max={100} value={lifeExpectancy} onChange={setLifeExpectancy} fmt={v => v + " yrs"} />
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="Retirement" /></div>
      </div>
      {schedule.length > 0 && (
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "var(--r-xl)", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: "1px solid var(--border)", background: "var(--surface2)" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Corpus Growth Projection</p>
            <button onClick={exportCSV} style={{ fontSize: 11, fontWeight: 700, padding: "6px 12px", borderRadius: "var(--r-md)", border: "1.5px solid var(--border)", background: "var(--surface)", color: "var(--text2)", cursor: "pointer" }}>Export CSV</button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--surface2)" }}>
                  {["Age", "Projected Corpus", "Target Corpus", "Status"].map((h, hi) => <th key={h} style={{ padding: "9px 14px", textAlign: hi === 0 ? "center" : "right", fontWeight: 700, color: "var(--text2)", fontSize: 11, textTransform: "uppercase", borderBottom: "2px solid var(--border)" }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {schedule.filter((_, i) => i % 5 === 0 || i === schedule.length - 1).map((row, i) => {
                  const onTrack = row.corpus >= row.target;
                  return (
                    <tr key={row.year} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.015)" }}>
                      <td style={{ padding: "8px 14px", textAlign: "center", color: "var(--text3)", fontWeight: 700 }}>Age {row.year}</td>
                      <td style={{ padding: "8px 14px", textAlign: "right", color: "var(--brand)", fontWeight: 800 }}>{fm(row.corpus)}</td>
                      <td style={{ padding: "8px 14px", textAlign: "right", color: "var(--text3)", fontWeight: 600 }}>{fm(row.target)}</td>
                      <td style={{ padding: "8px 14px", textAlign: "right" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: onTrack ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.1)", color: onTrack ? "var(--success)" : "#ef4444" }}>{onTrack ? "On Track" : "Gap"}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>Retirement Planning Fundamentals</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75 }}>Use the <strong>25x Rule</strong> as a quick benchmark: you need 25 times your annual retirement expenses as corpus (assumes 4% safe withdrawal rate). For Indian conditions with higher inflation, consider 30x-35x. Start early — investing for 30 years vs 20 years nearly triples your corpus due to compounding!</p>
      </div>
    </div>
  );
}

// ── NPS Calculator ────────────────────────────────────────────────────
export function NPSForm() {
  const fm = v => "₹" + Math.round(v).toLocaleString("en-IN");
  const [monthlyContrib, setMonthlyContrib] = useState(5000);
  const [currentAge, setCurrentAge] = useState(30);
  const [currentCorpus, setCurrentCorpus] = useState(0);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [annuityPct, setAnnuityPct] = useState(40);
  const [annuityRate, setAnnuityRate] = useState(6);
  const [tab, setTab] = useState("Tier 1");
  const [res, setRes] = useState(null);

  const retirementAge = 60;

  useEffect(() => {
    const yearsToRetire = retirementAge - currentAge;
    if (yearsToRetire <= 0) return;
    const r = expectedReturn / 100 / 12;
    const n = yearsToRetire * 12;
    const futureCurrentCorpus = currentCorpus * Math.pow(1 + r, n);
    const futureContrib = monthlyContrib * (Math.pow(1 + r, n) - 1) / r;
    const totalCorpus = futureCurrentCorpus + futureContrib;
    const annuityAmount = totalCorpus * (annuityPct / 100);
    const lumpsum = totalCorpus - annuityAmount;
    const monthlyPension = annuityAmount * (annuityRate / 100) / 12;
    const tax80ccd1 = Math.min(monthlyContrib * 12, 150000);
    const tax80ccd2 = Math.min(monthlyContrib * 12 * 0.1, 50000);
    const totalTaxBenefit = tab === "Tier 1" ? tax80ccd1 + tax80ccd2 : 0;
    const vsEPF = monthlyContrib * (Math.pow(1 + 8.25 / 100 / 12, n) - 1) / (8.25 / 100 / 12);
    const chart = { type: "donut", data: [{ name: "Annuity (Pension)", value: Math.round(annuityAmount) }, { name: "Lumpsum (Tax-free)", value: Math.round(lumpsum) }], keys: ["value"] };
    setRes(buildResult("Retirement Corpus", fm(Math.round(totalCorpus)),
      [
        { label: "Total Contributions", value: fm(Math.round(monthlyContrib * n)) },
        { label: "Returns Earned", value: fm(Math.round(totalCorpus - monthlyContrib * n - currentCorpus)), highlight: true },
        { label: "Annuity (" + annuityPct + "% → Pension)", value: fm(Math.round(annuityAmount)) },
        { label: "Lumpsum (60% Tax-free)", value: fm(Math.round(lumpsum)) },
        { label: "Monthly Pension (est.)", value: fm(Math.round(monthlyPension)), highlight: true },
        tab === "Tier 1" ? { label: "Tax Deduction (80CCD1)", value: fm(tax80ccd1) + "/yr", highlight: true } : null,
        tab === "Tier 1" ? { label: "Extra Deduction (80CCD2)", value: fm(tax80ccd2) + "/yr", highlight: true } : null,
        { label: "vs EPF Corpus (8.25%)", value: fm(Math.round(vsEPF)) },
      ].filter(Boolean),
      [{ type: "tip", msg: "NPS gives monthly pension of " + fm(Math.round(monthlyPension)) + " plus " + fm(Math.round(lumpsum)) + " tax-free lumpsum. Tax deductions of " + fm(Math.round(totalTaxBenefit)) + "/yr make NPS highly efficient." }],
      chart,
      [{ label: "Investment Period", value: yearsToRetire + " years" }, { label: "Total Invested", value: fm(Math.round(monthlyContrib * n)) }]
    ));
  }, [monthlyContrib, currentAge, currentCorpus, expectedReturn, annuityPct, annuityRate, tab]);

  return (
    <div className="space-y-6">
      <Tabs tabs={["Tier 1", "Tier 2"]} active={tab} onChange={setTab} />
      <div style={{ padding: "10px 14px", background: "rgba(99,102,241,0.06)", border: "1.5px solid rgba(99,102,241,0.2)", borderRadius: "var(--r-lg)", marginBottom: 8 }}>
        <p style={{ fontSize: 12, color: "var(--text2)" }}>{tab === "Tier 1" ? "Tier 1: Mandatory retirement account. Lock-in until 60. Tax benefits under 80CCD(1) + 80CCD(1B) + 80CCD(2)." : "Tier 2: Voluntary savings account. No lock-in. No tax benefit but flexible withdrawal."}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Presets items={[
            { label: "Govt Employee (₹5K/mo)", v: { mc: 5000, ca: 30, cc: 0, er: 10, ap: 40, ar: 6 } },
            { label: "Corporate (₹15K/mo)", v: { mc: 15000, ca: 35, cc: 500000, er: 10, ap: 40, ar: 6 } },
            { label: "Max Tax Saver", v: { mc: 20833, ca: 28, cc: 0, er: 11, ap: 40, ar: 7 } },
          ]} onApply={pr => { setMonthlyContrib(pr.v.mc); setCurrentAge(pr.v.ca); setCurrentCorpus(pr.v.cc); setExpectedReturn(pr.v.er); setAnnuityPct(pr.v.ap); setAnnuityRate(pr.v.ar); }} />
          <Sl label="Monthly Contribution" id="nps_mc" min={500} max={100000} step={500} value={monthlyContrib} onChange={setMonthlyContrib} fmt={v => "₹" + v.toLocaleString("en-IN")} />
          <Sl label="Current Age" id="nps_ca" min={18} max={59} value={currentAge} onChange={setCurrentAge} fmt={v => v + " yrs (Retire at 60)"} />
          <Sl label="Expected Annual Return (%)" id="nps_er" min={7} max={14} step={0.5} value={expectedReturn} onChange={setExpectedReturn} fmt={v => v + "% p.a."} />
          <Sl label="Annuity Percentage (%)" id="nps_ap" min={40} max={100} step={5} value={annuityPct} onChange={setAnnuityPct} fmt={v => v + "% → Pension (min 40%)"} />
          <N label="Annuity Rate (% p.a.)" id="nps_ar" value={String(annuityRate)} onChange={v => setAnnuityRate(+v)} unit="%" placeholder="6" hint="Rate offered by annuity provider" />
          <N label="Current NPS Corpus" id="nps_cc" value={String(currentCorpus)} onChange={v => setCurrentCorpus(+v)} unit="₹" placeholder="0" hint="Existing NPS balance" />
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="NPS" /></div>
      </div>
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>NPS Tax Benefits</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10 }}>
          {[{ sec: "80CCD(1)", limit: "₹1.5L/yr", note: "Under 80C umbrella, 10% of salary" }, { sec: "80CCD(1B)", limit: "₹50K/yr", note: "Additional deduction over 80C" }, { sec: "80CCD(2)", limit: "14% of basic", note: "Employer contribution (Govt: 14%, Others: 10%)" }, { sec: "Maturity", limit: "60% Tax-free", note: "40% must go to annuity (pension)" }].map((t, i) => (
            <div key={i} style={{ padding: "12px", background: "var(--surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)" }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: "var(--brand)", marginBottom: 3 }}>{t.sec}</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 3 }}>{t.limit}</p>
              <p style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.6 }}>{t.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── EPF Calculator ────────────────────────────────────────────────────
export function EPFForm() {
  const fm = v => "₹" + Math.round(v).toLocaleString("en-IN");
  const [basicSalary, setBasicSalary] = useState(30000);
  const [currentAge, setCurrentAge] = useState(28);
  const [currentEPF, setCurrentEPF] = useState(200000);
  const [vpfRate, setVpfRate] = useState("0");
  const [salaryGrowth, setSalaryGrowth] = useState(8);
  const [epfRate] = useState(8.25);
  const retirementAge = 58;
  const [res, setRes] = useState(null);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const yearsToRetire = retirementAge - currentAge;
    if (yearsToRetire <= 0 || basicSalary <= 0) return;
    let balance = currentEPF;
    let salary = basicSalary;
    const rows = [];
    let totalContrib = 0;
    for (let yr = 1; yr <= yearsToRetire; yr++) {
      const monthly = salary * 12 * 0.12;
      const employerVPS = salary * 12 * 0.0367;
      const vpf = salary * 12 * (+vpfRate / 100);
      const yearContrib = monthly + employerVPS + vpf;
      totalContrib += yearContrib;
      const interest = (balance + yearContrib / 2) * (epfRate / 100);
      balance = balance + yearContrib + interest;
      rows.push({ year: currentAge + yr, balance: Math.round(balance), contrib: Math.round(yearContrib), interest: Math.round(interest) });
      salary = salary * (1 + salaryGrowth / 100);
    }
    setSchedule(rows);
    const taxSaving = Math.min(basicSalary * 12 * 0.12, 150000) * 0.3;
    const vsNPSReturn = currentEPF * Math.pow(1.10, yearsToRetire);
    const chart = { type: "area", data: rows.filter((_, i) => i % 5 === 0 || i === rows.length - 1).map(r => ({ age: r.year, "EPF Balance": r.balance })), keys: ["EPF Balance"] };
    setRes(buildResult("EPF at Retirement", fm(Math.round(balance)),
      [
        { label: "Current Basic Salary", value: fm(basicSalary) + "/mo" },
        { label: "Employee Contribution (12%)", value: fm(Math.round(basicSalary * 0.12)) + "/mo" },
        { label: "Employer Contribution (3.67%)", value: fm(Math.round(basicSalary * 0.0367)) + "/mo (EPS goes to pension)" },
        vpfRate !== "0" ? { label: "VPF Extra (" + vpfRate + "%)", value: fm(Math.round(basicSalary * +vpfRate / 100)) + "/mo", highlight: true } : null,
        { label: "Total Invested (Estimated)", value: fm(Math.round(totalContrib)) },
        { label: "Interest Earned (8.25%)", value: fm(Math.round(balance - totalContrib - currentEPF)), highlight: true },
        { label: "Tax Saving (80C)", value: fm(Math.round(taxSaving)) + "/yr" },
        { label: "EPF Interest Rate", value: epfRate + "% (Tax-free)" },
      ].filter(Boolean),
      [{ type: "tip", msg: "EPF is a fully government-backed tax-free instrument. Adding VPF gives extra tax-free returns above FD/debt rates. EPF is the safest cornerstone of retirement." }],
      chart, rows.filter((_, i) => i % 5 === 0).map(r => ({ label: "Age " + r.year, value: fm(r.balance) }))
    ));
  }, [basicSalary, currentAge, currentEPF, vpfRate, salaryGrowth]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Presets items={[
            { label: "Entry Level ₹20K", v: { bs: 20000, ca: 22, ce: 0, vpf: 0, sg: 10 } },
            { label: "Mid-Senior ₹50K", v: { bs: 50000, ca: 35, ce: 1000000, vpf: 10, sg: 8 } },
            { label: "Senior ₹1L Basic", v: { bs: 100000, ca: 45, ce: 5000000, vpf: 12, sg: 6 } },
          ]} onApply={pr => { setBasicSalary(pr.v.bs); setCurrentAge(pr.v.ca); setCurrentEPF(pr.v.ce); setVpfRate(String(pr.v.vpf)); setSalaryGrowth(pr.v.sg); }} />
          <Sl label="Basic Salary (Monthly)" id="epf_bs" min={5000} max={500000} step={1000} value={basicSalary} onChange={setBasicSalary} fmt={v => "₹" + v.toLocaleString("en-IN")} />
          <Sl label="Current Age" id="epf_ca" min={18} max={57} value={currentAge} onChange={setCurrentAge} fmt={v => v + " yrs (Retire at 58)"} />
          <N label="Current EPF Balance" id="epf_ce" value={String(currentEPF)} onChange={v => setCurrentEPF(+v)} unit="₹" placeholder="0" hint="Check your passbook / UAN portal" />
          <N label="VPF Rate (% of basic)" id="epf_vpf" value={vpfRate} onChange={setVpfRate} unit="%" placeholder="0" hint="Voluntary PF: extra contribution above mandatory 12%" />
          <Sl label="Expected Annual Salary Growth (%)" id="epf_sg" min={3} max={20} step={0.5} value={salaryGrowth} onChange={setSalaryGrowth} fmt={v => v + "%"} />
        </div>
        <div className="sticky-res"><Panel result={res} loading={null} label="EPF" /></div>
      </div>
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "24px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>EPF vs VPF: Smart Strategy</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75 }}>Standard EPF: Employee contributes 12% of basic, Employer contributes 12% (3.67% to EPF + 8.33% to EPS). <strong>VPF (Voluntary PF):</strong> You can contribute any amount over 12% at the same 8.25% tax-free rate — better than most debt funds! EPS gives pension of ₹1,000-9,999/mo based on 10+ years service.</p>
      </div>
    </div>
  );
}
`;

writeFileSync('src/components/calculator-core/forms/RetirementForms.jsx', CONTENT, 'utf8');
const lines = CONTENT.split('\n').length;
console.log('RetirementForms.jsx written. Lines:', lines);
