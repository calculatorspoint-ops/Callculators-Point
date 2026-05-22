import { useState, useEffect } from "react";
import { L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency, formatMoney } from "./SharedComponents.jsx";
import { ScenarioCompare } from "@/components/calculator-core/ScenarioCompare.jsx";

// ── Mortgage Payoff Calculator ────────────────────────────────────────
export function MortgagePayoffForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [balance, setBalance] = useState(300000);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(25);
  const [extra, setExtra] = useState("0");
  const [lump, setLump] = useState("0");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const P = +balance, r = +rate / 100 / 12, n = +term * 12;
      if (!P || !r || !n) { setRes(null); return; }
      const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      // Original total
      const origTotal = emi * n;
      const origInterest = origTotal - P;
      // With extra payment
      const extraMonthly = +extra || 0;
      const lumpSum = +lump || 0;
      let bal = P - lumpSum, months = 0, extraInterest = 0;
      while (bal > 0 && months < n * 2) {
        const interest = bal * r;
        extraInterest += interest;
        const principal = Math.min(emi + extraMonthly - interest, bal);
        bal -= principal;
        months++;
      }
      const interestSaved = origInterest - extraInterest;
      const yearsSaved = ((n - months) / 12).toFixed(1);
      const chart = { type: "bar", data: [
        { name: "Original", Interest: Math.round(origInterest), Principal: Math.round(P) },
        { name: "With Extra", Interest: Math.round(extraInterest), Principal: Math.round(P) },
      ], keys: ["Principal", "Interest"] };
      setRes(buildResult("Months to Payoff", months + " months",
        [
          { label: "Original Term", value: n + " months" },
          { label: "Time Saved", value: yearsSaved + " years", highlight: +yearsSaved > 0 },
          { label: "Interest Saved", value: fm(Math.max(0, interestSaved)), highlight: interestSaved > 0 },
          { label: "New Payoff Date", value: new Date(Date.now() + months * 30 * 24 * 3600000).toLocaleDateString("en-US", { month: "short", year: "numeric" }) },
        ],
        [{ type: "tip", msg: interestSaved > 0 ? `Extra payments save ${fm(Math.round(interestSaved))} in interest and pay off ${yearsSaved} years early!` : "Add extra payments to see savings." }],
        chart, []));
    }, 150);
    return () => clearTimeout(timer);
  }, [balance, rate, term, extra, lump]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Sl label="Remaining Balance" id="mpb" min={10000} max={2000000} step={5000} value={balance} onChange={setBalance} fmt={v => fmSlider(v)} />
        <Sl label="Interest Rate (% p.a.)" id="mpr" min={1} max={20} step={0.1} value={rate} onChange={setRate} fmt={v => `${v}%`} />
        <Sl label="Remaining Term (Years)" id="mpt" min={1} max={30} value={term} onChange={setTerm} fmt={v => `${v} yrs`} />
        <Row2>
          <N label="Extra Monthly Payment" id="mpex" value={extra} onChange={setExtra} unit={sym} placeholder="0" hint="Reduces principal faster" />
          <N label="Lump Sum Payment" id="mplump" value={lump} onChange={setLump} unit={sym} placeholder="0" hint="One-time extra payment" />
        </Row2>
      </div>
      <div className="sticky-res">
        <Panel result={res} loading={null} label="Mortgage Payoff" />
      </div>
    </div>
  );
}

// ── House Affordability Calculator ───────────────────────────────────
export function HouseAffordabilityForm() {
  const { fm, sym } = useCurrency();
  const [income, setIncome] = useState("8000");
  const [debts, setDebts] = useState("500");
  const [down, setDown] = useState("20");
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);
  const [res, setRes] = useState(null);

  useEffect(() => {
    const mo = +income, d = +debts, dp = +down / 100, r = +rate / 100 / 12, n = +term * 12;
    if (!mo || !r || !n) { setRes(null); return; }
    const maxPITI_front = mo * 0.28;
    const maxPITI_back = mo * 0.36 - d;
    const maxMonthly = Math.min(maxPITI_front, maxPITI_back);
    if (maxMonthly <= 0) { setRes(null); return; }
    // Reverse mortgage: find loan amount that gives maxMonthly payment
    const maxLoan = maxMonthly * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
    const maxHome = maxLoan / (1 - dp);
    const downAmt = maxHome * dp;
    setRes(buildResult("Max Home Price", fm(Math.round(maxHome)),
      [
        { label: "Max Loan Amount", value: fm(Math.round(maxLoan)) },
        { label: "Down Payment Needed", value: fm(Math.round(downAmt)), highlight: true },
        { label: "Monthly Payment", value: fm(Math.round(maxMonthly)) },
        { label: "DTI Ratio", value: ((d + maxMonthly) / mo * 100).toFixed(1) + "%" },
      ],
      [{ type: "tip", msg: `With ${+down}% down and a ${rate}% rate, you can afford up to ${fm(Math.round(maxHome))}. Your monthly payment would be ${fm(Math.round(maxMonthly))}.` }],
      null, [
        { label: "Front-end DTI (housing)", value: "≤ 28%" },
        { label: "Back-end DTI (all debt)", value: "≤ 36%" },
        { label: "Gross Monthly Income", value: fm(mo) },
        { label: "Existing Monthly Debt", value: fm(d) },
      ]));
  }, [income, debts, down, rate, term]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <N label="Gross Monthly Income" id="hai" value={income} onChange={setIncome} unit={sym} />
        <N label="Existing Monthly Debts" id="had" value={debts} onChange={setDebts} unit={sym} hint="Car loan, student loan, credit cards etc." />
        <Sl label="Down Payment (%)" id="hadp" min={3} max={40} step={0.5} value={+down} onChange={v => setDown(String(v))} fmt={v => `${v}%`} />
        <Sl label="Interest Rate (% p.a.)" id="har" min={2} max={15} step={0.1} value={rate} onChange={setRate} fmt={v => `${v}%`} />
        <Sel label="Loan Term" id="hat" value={String(term)} onChange={v => setTerm(+v)} opts={[{ v: "15", l: "15 Years" }, { v: "20", l: "20 Years" }, { v: "25", l: "25 Years" }, { v: "30", l: "30 Years" }]} />
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="House Affordability" /></div>
    </div>
  );
}

// ── Rent vs Buy Calculator ────────────────────────────────────────────
export function RentVsBuyForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [rent, setRent] = useState(2000);
  const [homePrice, setHomePrice] = useState(400000);
  const [down, setDown] = useState(20);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(10);
  const [appreciation, setAppreciation] = useState(3);
  const [rentIncrease, setRentIncrease] = useState(3);
  const [res, setRes] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const downAmt = homePrice * down / 100;
      const loan = homePrice - downAmt;
      const r = rate / 100 / 12, n = years * 12;
      const fullTerm = 30 * 12;
      const emi = (loan * r * Math.pow(1 + r, fullTerm)) / (Math.pow(1 + r, fullTerm) - 1);
      // Buying costs
      let buyInterest = 0, buyPrincipal = 0, bal = loan;
      for (let m = 0; m < n; m++) {
        const interest = bal * r;
        const principal = emi - interest;
        buyInterest += interest;
        buyPrincipal += principal;
        bal -= principal;
      }
      const homeValue = homePrice * Math.pow(1 + appreciation / 100, years);
      const equity = homeValue - bal;
      const totalBuyCost = downAmt + emi * n - equity + homePrice * 0.025 * years; // with maintenance
      // Renting costs
      let totalRentCost = 0, curRent = rent;
      for (let y = 0; y < years; y++) {
        totalRentCost += curRent * 12;
        curRent *= (1 + rentIncrease / 100);
      }
      const breakEvenYear = Math.round(totalBuyCost / (totalBuyCost / years));
      const chart = { type: "area", data: Array.from({ length: years + 1 }, (_, y) => {
        const bc = downAmt + emi * y * 12;
        const rc = rent * 12 * ((Math.pow(1 + rentIncrease / 100, y) - 1) / (rentIncrease / 100));
        return { year: `Yr ${y}`, Buying: Math.round(bc), Renting: Math.round(rc) };
      }), keys: ["Buying", "Renting"] };
      setRes(buildResult(totalBuyCost < totalRentCost ? "Buy Wins" : "Rent Wins",
        totalBuyCost < totalRentCost ? `Save ${fm(Math.round(totalRentCost - totalBuyCost))}` : `Save ${fm(Math.round(totalBuyCost - totalRentCost))}`,
        [
          { label: "Total Buying Cost", value: fm(Math.round(totalBuyCost)) },
          { label: "Total Renting Cost", value: fm(Math.round(totalRentCost)) },
          { label: "Home Value in " + years + " yrs", value: fm(Math.round(homeValue)), highlight: true },
          { label: "Net Equity Built", value: fm(Math.round(equity)), highlight: true },
        ],
        [{ type: "tip", msg: `After ${years} years, ${totalBuyCost < totalRentCost ? "buying" : "renting"} is cheaper by ${fm(Math.abs(Math.round(totalBuyCost - totalRentCost)))}.` }],
        chart, []));
    }, 150);
    return () => clearTimeout(timer);
  }, [rent, homePrice, down, rate, years, appreciation, rentIncrease]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Presets items={[
          { label: "🏙️ Urban Renter", v: { rent: 3000, homePrice: 600000, down: 20, rate: 6.5, years: 7 } },
          { label: "🏡 Suburban Buyer", v: { rent: 1800, homePrice: 350000, down: 10, rate: 6.5, years: 10 } },
        ]} onApply={p => { setRent(p.v.rent); setHomePrice(p.v.homePrice); setDown(p.v.down); setRate(p.v.rate); setYears(p.v.years); }} />
        <Sl label="Monthly Rent" id="rvbr" min={500} max={10000} step={100} value={rent} onChange={setRent} fmt={v => fmSlider(v)} />
        <Sl label="Home Purchase Price" id="rvbhp" min={50000} max={2000000} step={5000} value={homePrice} onChange={setHomePrice} fmt={v => fmSlider(v)} />
        <Row2>
          <N label="Down Payment (%)" id="rvbdp" value={String(down)} onChange={v => setDown(+v)} unit="%" />
          <N label="Interest Rate (%)" id="rvbrate" value={String(rate)} onChange={v => setRate(+v)} unit="%" />
        </Row2>
        <Sl label="Years to Compare" id="rvby" min={1} max={30} value={years} onChange={setYears} fmt={v => `${v} yrs`} />
        <Row2>
          <N label="Home Appreciation (%)" id="rvba" value={String(appreciation)} onChange={v => setAppreciation(+v)} unit="% /yr" />
          <N label="Rent Increase (%)" id="rvbri" value={String(rentIncrease)} onChange={v => setRentIncrease(+v)} unit="% /yr" />
        </Row2>
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Rent vs Buy" /></div>
    </div>
  );
}

// ── APR Calculator ────────────────────────────────────────────────────
export function APRForm() {
  const { fm, sym } = useCurrency();
  const [loan, setLoan] = useState("200000");
  const [rate, setRate] = useState("6.5");
  const [term, setTerm] = useState("30");
  const [fees, setFees] = useState("3000");
  const [points, setPoints] = useState("0");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const P = +loan, r = +rate / 100 / 12, n = +term * 12;
    const feeTotal = +fees + (+points / 100) * P;
    if (!P || !r || !n) { setRes(null); return; }
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    // APR: find rate that equates P-fees to EMI stream
    const netLoan = P - feeTotal;
    let aprGuess = +rate / 100 / 12;
    for (let i = 0; i < 200; i++) {
      const pv = emi * (1 - Math.pow(1 + aprGuess, -n)) / aprGuess;
      const diff = pv - netLoan;
      if (Math.abs(diff) < 0.01) break;
      aprGuess += diff / (n * 1000);
    }
    const apr = (aprGuess * 12 * 100).toFixed(3);
    setRes(buildResult("APR", apr + "%",
      [
        { label: "Nominal Rate", value: rate + "%" },
        { label: "APR (Effective)", value: apr + "%", highlight: true },
        { label: "Total Fees", value: fm(feeTotal) },
        { label: "Monthly Payment", value: fm(Math.round(emi)) },
      ],
      [{ type: "tip", msg: `The APR is ${apr}% vs your nominal rate of ${rate}% — fees add ${(+apr - +rate).toFixed(3)}% to your effective rate.` }],
      null, [
        { label: "Loan Amount", value: fm(P) },
        { label: "Origination Fees", value: fm(+fees) },
        { label: "Points", value: `${points} (${fm((+points / 100) * P)})` },
      ]));
  }, [loan, rate, term, fees, points]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <N label="Loan Amount" id="aprl" value={loan} onChange={setLoan} unit={sym} />
        <Row2>
          <N label="Interest Rate (%)" id="aprr" value={rate} onChange={setRate} unit="%" />
          <N label="Loan Term (Years)" id="aprt" value={term} onChange={setTerm} unit="yrs" />
        </Row2>
        <Row2>
          <N label="Total Fees" id="aprf" value={fees} onChange={setFees} unit={sym} hint="Origination, closing, etc." />
          <N label="Discount Points" id="aprp" value={points} onChange={setPoints} unit="pts" hint="1 point = 1% of loan" />
        </Row2>
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="APR" /></div>
    </div>
  );
}

// ── Auto Loan Calculator ─────────────────────────────────────────────
export function AutoLoanForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [price, setPrice] = useState(35000);
  const [down, setDown] = useState(5000);
  const [rate, setRate] = useState(7.5);
  const [term, setTerm] = useState(60);
  const [tradeIn, setTradeIn] = useState("0");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const loan = price - down - (+tradeIn || 0);
      const r = rate / 100 / 12, n = term;
      if (!loan || loan <= 0 || !r || !n) { setRes(null); return; }
      const emi = (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const total = emi * n;
      const interest = total - loan;
      // Depreciation curve (straight line approximation)
      const depData = Array.from({ length: Math.ceil(n / 12) + 1 }, (_, y) => ({
        year: `Yr ${y}`, "Car Value": Math.round(price * Math.pow(0.82, y)),
        "Loan Balance": Math.max(0, Math.round(loan - (loan / n) * y * 12)),
      }));
      const chart = { type: "line", data: depData, keys: ["Car Value", "Loan Balance"] };
      setRes(buildResult("Monthly Payment", fm(Math.round(emi)),
        [
          { label: "Total Loan Amount", value: fm(Math.round(loan)) },
          { label: "Total Interest", value: fm(Math.round(interest)), warn: true },
          { label: "Total Cost", value: fm(Math.round(total + down + (+tradeIn || 0))), highlight: true },
          { label: "Loan Term", value: term + " months" },
        ],
        [{ type: "tip", msg: `Chart shows car value vs remaining loan balance — the gap is your equity position at any time.` }],
        chart, []));
    }, 120);
    return () => clearTimeout(timer);
  }, [price, down, rate, term, tradeIn]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Presets items={[
          { label: "🚗 Budget Car", v: { price: 20000, down: 3000, rate: 8, term: 60 } },
          { label: "🚙 Mid-range", v: { price: 40000, down: 8000, rate: 6.5, term: 60 } },
          { label: "🏎️ Luxury", v: { price: 80000, down: 20000, rate: 5.5, term: 72 } },
        ]} onApply={p => { setPrice(p.v.price); setDown(p.v.down); setRate(p.v.rate); setTerm(p.v.term); }} />
        <Sl label="Vehicle Price" id="alp" min={5000} max={200000} step={500} value={price} onChange={setPrice} fmt={v => fmSlider(v)} />
        <Sl label="Down Payment" id="ald" min={0} max={50000} step={500} value={down} onChange={setDown} fmt={v => fmSlider(v)} />
        <Sl label="Interest Rate (%)" id="alr" min={1} max={25} step={0.1} value={rate} onChange={setRate} fmt={v => `${v}%`} />
        <Sel label="Loan Term" id="alt" value={String(term)} onChange={v => setTerm(+v)} opts={[
          { v: "24", l: "24 Months" }, { v: "36", l: "36 Months" }, { v: "48", l: "48 Months" },
          { v: "60", l: "60 Months" }, { v: "72", l: "72 Months" }, { v: "84", l: "84 Months" },
        ]} />
        <N label="Trade-In Value" id="alti" value={tradeIn} onChange={setTradeIn} unit={sym} placeholder="0" />
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Auto Loan" /></div>
    </div>
  );
}

// ── Personal Loan Calculator ─────────────────────────────────────────
export function PersonalLoanForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [amount, setAmount] = useState(25000);
  const [rate, setRate] = useState(12);
  const [term, setTerm] = useState(36);
  const [res, setRes] = useState(null);

  useEffect(() => {
    const r = rate / 100 / 12, n = term;
    const emi = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n, interest = total - amount;
    const chart = { type: "area", data: Array.from({ length: n + 1 }, (_, m) => {
      const bal = m === 0 ? amount : Math.max(0, amount * Math.pow(1 + r, m) - emi * (Math.pow(1 + r, m) - 1) / r);
      return { month: `M${m}`, Balance: Math.round(bal), Paid: Math.round(emi * m) };
    }).filter((_, i) => i % 3 === 0), keys: ["Balance", "Paid"] };
    setRes(buildResult("Monthly EMI", fm(Math.round(emi)),
      [
        { label: "Total Amount Paid", value: fm(Math.round(total)) },
        { label: "Total Interest", value: fm(Math.round(interest)), warn: true },
        { label: "Interest Ratio", value: (interest / total * 100).toFixed(1) + "%" },
        { label: "Payoff Date", value: new Date(Date.now() + n * 30 * 24 * 3600000).toLocaleDateString("en-US", { month: "short", year: "numeric" }) },
      ],
      [{ type: "tip", msg: `You will pay ${fm(Math.round(interest))} in interest. Consider paying extra each month to reduce this significantly.` }],
      chart, []));
  }, [amount, rate, term]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Sl label="Loan Amount" id="pla" min={1000} max={500000} step={1000} value={amount} onChange={setAmount} fmt={v => fmSlider(v)} />
        <Sl label="Interest Rate (% p.a.)" id="plr" min={1} max={40} step={0.5} value={rate} onChange={setRate} fmt={v => `${v}%`} />
        <Sel label="Loan Term" id="plt" value={String(term)} onChange={v => setTerm(+v)} opts={[
          { v: "12", l: "12 Months" }, { v: "24", l: "24 Months" }, { v: "36", l: "36 Months" },
          { v: "48", l: "48 Months" }, { v: "60", l: "60 Months" }, { v: "84", l: "7 Years" },
        ]} />
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Personal Loan" /></div>
    </div>
  );
}

// ── Student Loan Calculator ───────────────────────────────────────────
export function StudentLoanForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [balance, setBalance] = useState(30000);
  const [rate, setRate] = useState(5.5);
  const [term, setTerm] = useState(120);
  const [income, setIncome] = useState("50000");
  const [mode, setMode] = useState("Standard");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const r = rate / 100 / 12, n = term;
      const stdEMI = (balance * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const stdTotal = stdEMI * n, stdInterest = stdTotal - balance;
      // Income-based: 10% of discretionary income (income - poverty ~$15k)
      const annualDiscretionary = Math.max(0, +income - 15000);
      const ibrPayment = annualDiscretionary * 0.1 / 12;
      const ibrYears = 20;
      setRes(buildResult(mode === "Standard" ? "Monthly Payment" : "IBR Payment",
        fm(Math.round(mode === "Standard" ? stdEMI : ibrPayment)),
        [
          { label: "Standard Monthly", value: fm(Math.round(stdEMI)) },
          { label: "IBR Monthly", value: fm(Math.round(ibrPayment)) },
          { label: "Total Interest (Std)", value: fm(Math.round(stdInterest)), warn: true },
          { label: "IBR Forgiveness Year", value: ibrYears + " yrs" },
        ],
        [{ type: "tip", msg: `Income-Based Repayment caps your payment at ${fm(Math.round(ibrPayment))}/month and forgives remaining balance after ${ibrYears} years.` }],
        null, [
          { label: "Loan Balance", value: fm(balance) },
          { label: "Interest Rate", value: rate + "%" },
          { label: "Standard Term", value: (term / 12) + " years" },
        ]));
    }, 120);
    return () => clearTimeout(timer);
  }, [balance, rate, term, income, mode]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Tabs tabs={["Standard", "Income-Based"]} active={mode} onChange={setMode} />
        <Sl label="Loan Balance" id="slb" min={1000} max={200000} step={1000} value={balance} onChange={setBalance} fmt={v => fmSlider(v)} />
        <Sl label="Interest Rate (%)" id="slr" min={1} max={15} step={0.1} value={rate} onChange={setRate} fmt={v => `${v}%`} />
        <Sel label="Repayment Term" id="slt" value={String(term)} onChange={v => setTerm(+v)} opts={[
          { v: "60", l: "5 Years" }, { v: "120", l: "10 Years" },
          { v: "180", l: "15 Years" }, { v: "240", l: "20 Years" },
        ]} />
        {mode === "Income-Based" && <N label="Annual Income" id="sli" value={income} onChange={setIncome} unit={sym} />}
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Student Loan" /></div>
    </div>
  );
}

// ── Credit Card Calculator ────────────────────────────────────────────
export function CreditCardForm() {
  const { fm, sym } = useCurrency();
  const [balance, setBalance] = useState(5000);
  const [apr, setApr] = useState(20);
  const [payment, setPayment] = useState("0");
  const [mode, setMode] = useState("Fixed");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const r = apr / 100 / 12;
      let bal = balance, months = 0, totalInterest = 0;
      const minPct = 0.02; // 2% minimum
      const fixedPmt = +payment > 0 ? +payment : Math.max(balance * minPct, 25);
      while (bal > 0 && months < 600) {
        const interest = bal * r;
        totalInterest += interest;
        const pmt = mode === "Minimum" ? Math.max(bal * minPct, 25) : fixedPmt;
        bal = Math.max(0, bal + interest - pmt);
        months++;
      }
      const years = Math.floor(months / 12), mos = months % 12;
      // chart: min vs fixed payment
      const chartData = [];
      let b1 = balance, b2 = balance;
      for (let m = 0; m <= Math.min(months, 120); m += 3) {
        chartData.push({ month: `M${m}`, "Fixed": Math.round(b2), "Min Only": Math.round(b1) });
        for (let x = 0; x < 3 && b1 > 0; x++) {
          b1 = Math.max(0, b1 + b1 * r - Math.max(b1 * minPct, 25));
        }
        for (let x = 0; x < 3 && b2 > 0; x++) {
          b2 = Math.max(0, b2 + b2 * r - fixedPmt);
        }
      }
      const chart = { type: "area", data: chartData, keys: ["Fixed", "Min Only"] };
      setRes(buildResult("Payoff Time", `${years > 0 ? years + "y " : ""}${mos}m`,
        [
          { label: "Total Interest Paid", value: fm(Math.round(totalInterest)), warn: true },
          { label: "Total Paid", value: fm(Math.round(totalInterest + balance)) },
          { label: "Monthly Payment", value: fm(Math.round(fixedPmt)) },
          { label: "Months to Payoff", value: months + " months" },
        ],
        [{ type: "warn", msg: `Paying only minimums on ${fm(balance)} at ${apr}% APR takes ${years > 0 ? years + " years " : ""}${mos} months and costs ${fm(Math.round(totalInterest))} in interest!` }],
        chart, []));
    }, 150);
    return () => clearTimeout(timer);
  }, [balance, apr, payment, mode]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Tabs tabs={["Fixed Payment", "Minimum Only"]} active={mode === "Fixed" ? "Fixed Payment" : "Minimum Only"} onChange={v => setMode(v === "Fixed Payment" ? "Fixed" : "Minimum")} />
        <Sl label="Credit Card Balance" id="ccb" min={100} max={50000} step={100} value={balance} onChange={setBalance} fmt={v => `${sym}${v.toLocaleString()}`} />
        <Sl label="APR (%)" id="cca" min={5} max={40} step={0.5} value={apr} onChange={setApr} fmt={v => `${v}%`} />
        {mode === "Fixed" && <N label="Monthly Payment" id="ccp" value={payment} onChange={setPayment} unit={sym} placeholder="e.g. 200" hint="Leave 0 to use minimum payment" />}
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Credit Card Payoff" /></div>
    </div>
  );
}

// ── Debt Payoff Calculator (Snowball vs Avalanche) ────────────────────
export function DebtPayoffForm() {
  const { fm, sym } = useCurrency();
  const [debts, setDebts] = useState([
    { name: "Credit Card", balance: "5000", rate: "20", min: "100" },
    { name: "Car Loan", balance: "12000", rate: "7", min: "250" },
    { name: "Personal Loan", balance: "8000", rate: "12", min: "200" },
  ]);
  const [extra, setExtra] = useState("200");
  const [strategy, setStrategy] = useState("Avalanche");
  const [res, setRes] = useState(null);

  const updateDebt = (i, k, v) => setDebts(prev => prev.map((d, idx) => idx === i ? { ...d, [k]: v } : d));
  const addDebt = () => setDebts(prev => [...prev, { name: "New Debt", balance: "0", rate: "0", min: "0" }]);
  const removeDebt = (i) => setDebts(prev => prev.filter((_, idx) => idx !== i));

  useEffect(() => {
    const timer = setTimeout(() => {
      const ds = debts.map(d => ({ ...d, balance: +d.balance, rate: +d.rate / 100 / 12, min: +d.min })).filter(d => d.balance > 0);
      if (!ds.length) { setRes(null); return; }
      const sorted = strategy === "Avalanche"
        ? [...ds].sort((a, b) => b.rate - a.rate)
        : [...ds].sort((a, b) => a.balance - b.balance);
      let months = 0, totalInterest = 0;
      const bals = sorted.map(d => d.balance);
      const extraAmt = +extra || 0;
      while (bals.some(b => b > 0) && months < 600) {
        months++;
        // Apply interest and minimums
        let freeExtra = extraAmt;
        for (let i = 0; i < sorted.length; i++) {
          if (bals[i] <= 0) continue;
          totalInterest += bals[i] * sorted[i].rate;
          bals[i] += bals[i] * sorted[i].rate;
          const pmt = Math.min(sorted[i].min, bals[i]);
          bals[i] -= pmt;
        }
        // Apply extra to focus debt
        for (let i = 0; i < sorted.length; i++) {
          if (bals[i] <= 0) continue;
          const apply = Math.min(freeExtra, bals[i]);
          bals[i] -= apply;
          freeExtra -= apply;
          if (freeExtra <= 0) break;
        }
      }
      const totalDebt = debts.reduce((s, d) => s + +d.balance, 0);
      setRes(buildResult(strategy + " Strategy", months + " months",
        [
          { label: "Total Debt", value: fm(Math.round(totalDebt)) },
          { label: "Total Interest Paid", value: fm(Math.round(totalInterest)), warn: true },
          { label: "Months to Debt Free", value: months, highlight: true },
          { label: "Extra Monthly Payment", value: fm(extraAmt) },
        ],
        [{ type: "tip", msg: `${strategy} strategy: debt-free in ${Math.floor(months / 12)}y ${months % 12}m paying ${fm(Math.round(totalInterest))} in interest.` }],
        null, sorted.map((d, i) => ({ label: d.name || `Debt ${i + 1}`, value: fm(+debts.find(x => +x.balance === d.balance)?.balance || 0) }))));
    }, 200);
    return () => clearTimeout(timer);
  }, [debts, extra, strategy]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Tabs tabs={["Avalanche", "Snowball"]} active={strategy} onChange={setStrategy} />
        <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 16 }}>
          {strategy === "Avalanche" ? "⚡ Avalanche: Highest interest rate first — saves most money." : "❄️ Snowball: Smallest balance first — builds motivation."}
        </p>
        {debts.map((d, i) => (
          <div key={i} style={{ marginBottom: 16, padding: 14, background: "var(--surface2)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <input value={d.name} onChange={e => updateDebt(i, "name", e.target.value)}
                style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", background: "transparent", border: "none", outline: "none", flex: 1 }} />
              {debts.length > 1 && <button onClick={() => removeDebt(i)} style={{ color: "var(--text3)", background: "none", border: "none", cursor: "pointer", fontSize: 16 }}>×</button>}
            </div>
            <Row3>
              <N label="Balance" id={`dpb${i}`} value={d.balance} onChange={v => updateDebt(i, "balance", v)} unit={sym} />
              <N label="Rate %" id={`dpr${i}`} value={d.rate} onChange={v => updateDebt(i, "rate", v)} unit="%" />
              <N label="Min Pmt" id={`dpm${i}`} value={d.min} onChange={v => updateDebt(i, "min", v)} unit={sym} />
            </Row3>
          </div>
        ))}
        <button onClick={addDebt} style={{ width: "100%", padding: "10px", borderRadius: "var(--r-md)", border: "2px dashed var(--border)", background: "transparent", color: "var(--brand)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          + Add Another Debt
        </button>
        <N label="Extra Monthly Payment" id="dpex" value={extra} onChange={setExtra} unit={sym} hint="Applied to focus debt after minimums" />
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Debt Payoff" /></div>
    </div>
  );
}

// ── 401k Calculator ───────────────────────────────────────────────────
export function Calculator401kForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [salary, setSalary] = useState(60000);
  const [contrib, setContrib] = useState(10);
  const [match, setMatch] = useState(5);
  const [matchPct, setMatchPct] = useState(100);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(30);
  const [current, setCurrent] = useState("0");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const annual = salary * contrib / 100;
      const employerMatch = salary * Math.min(contrib, match) / 100 * (matchPct / 100);
      const totalAnnual = annual + employerMatch;
      const r = rate / 100;
      const existing = +current || 0;
      // FV with contributions
      const fv = existing * Math.pow(1 + r, years) + totalAnnual * (Math.pow(1 + r, years) - 1) / r;
      const totalContrib = totalAnnual * years + existing;
      const gains = fv - totalContrib;
      const chartData = Array.from({ length: years + 1 }, (_, y) => ({
        year: `Yr ${y}`,
        Balance: Math.round(existing * Math.pow(1 + r, y) + totalAnnual * (Math.pow(1 + r, y) - 1) / r),
        Contributed: Math.round(totalAnnual * y + existing),
      }));
      const chart = { type: "area", data: chartData.filter((_, i) => i % 3 === 0), keys: ["Balance", "Contributed"] };
      setRes(buildResult("401(k) Balance", fm(Math.round(fv)),
        [
          { label: "Your Contribution", value: fm(Math.round(annual)) + "/yr" },
          { label: "Employer Match", value: fm(Math.round(employerMatch)) + "/yr", highlight: true },
          { label: "Total Gains", value: fm(Math.round(gains)), highlight: true },
          { label: "Monthly Retirement Income (4%)", value: fm(Math.round(fv * 0.04 / 12)) },
        ],
        [{ type: "tip", msg: `Your employer matches ${fm(Math.round(employerMatch))}/year — that's ${fm(Math.round(employerMatch * years))} in free money over ${years} years!` }],
        chart, []));
    }, 150);
    return () => clearTimeout(timer);
  }, [salary, contrib, match, matchPct, rate, years, current]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Sl label="Annual Salary" id="401s" min={20000} max={500000} step={1000} value={salary} onChange={setSalary} fmt={v => fmSlider(v)} />
        <Sl label="Your Contribution (%)" id="401c" min={1} max={50} step={0.5} value={contrib} onChange={setContrib} fmt={v => `${v}%`} />
        <Row2>
          <N label="Employer Match (%)" id="401m" value={String(match)} onChange={v => setMatch(+v)} unit="%" hint="Up to this % of salary" />
          <N label="Match Rate (%)" id="401mp" value={String(matchPct)} onChange={v => setMatchPct(+v)} unit="%" hint="100% = dollar for dollar" />
        </Row2>
        <Sl label="Expected Annual Return (%)" id="401r" min={1} max={15} step={0.5} value={rate} onChange={setRate} fmt={v => `${v}%`} />
        <Sl label="Years to Retirement" id="401y" min={1} max={45} value={years} onChange={setYears} fmt={v => `${v} yrs`} />
        <N label="Current Balance" id="401cur" value={current} onChange={setCurrent} unit={sym} placeholder="0" />
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="401(k) Balance" /></div>
    </div>
  );
}

// ── Commission Calculator ─────────────────────────────────────────────
export function CommissionForm() {
  const { fm, sym } = useCurrency();
  const [sales, setSales] = useState("100000");
  const [rate, setRate] = useState("5");
  const [base, setBase] = useState("3000");
  const [mode, setMode] = useState("Flat");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const s = +sales, r = +rate / 100, b = +base || 0;
    if (!s || !r) { setRes(null); return; }
    const commission = s * r;
    const total = commission + b;
    setRes(buildResult("Total Earnings", fm(Math.round(total)),
      [
        { label: "Base Salary", value: fm(Math.round(b)) },
        { label: "Commission Earned", value: fm(Math.round(commission)), highlight: true },
        { label: "Commission Rate", value: rate + "%" },
        { label: "Total Sales", value: fm(Math.round(s)) },
      ],
      [{ type: "tip", msg: `Commission is ${(commission / total * 100).toFixed(1)}% of your total earnings.` }],
      null, []));
  }, [sales, rate, base, mode]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <N label="Total Sales Amount" id="cms" value={sales} onChange={setSales} unit={sym} />
        <N label="Commission Rate (%)" id="cmr" value={rate} onChange={setRate} unit="%" />
        <N label="Base Salary (Monthly)" id="cmb" value={base} onChange={setBase} unit={sym} placeholder="0" hint="Optional fixed salary" />
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Commission" /></div>
    </div>
  );
}

// ── Depreciation Calculator ───────────────────────────────────────────
export function DepreciationForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [cost, setCost] = useState(50000);
  const [salvage, setSalvage] = useState(5000);
  const [life, setLife] = useState(5);
  const [method, setMethod] = useState("SL");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const depData = [];
    let bookValue = cost;
    let totalDep = 0;
    for (let y = 1; y <= life; y++) {
      let dep;
      if (method === "SL") {
        dep = (cost - salvage) / life;
      } else if (method === "DB") {
        dep = Math.min(bookValue - salvage, bookValue * (2 / life));
      } else {
        // Sum of years digits
        const syd = (life * (life + 1)) / 2;
        dep = (cost - salvage) * (life - y + 1) / syd;
      }
      dep = Math.max(0, Math.round(dep));
      bookValue = Math.max(salvage, bookValue - dep);
      totalDep += dep;
      depData.push({ year: `Year ${y}`, Depreciation: dep, "Book Value": Math.round(bookValue) });
    }
    const chart = { type: "bar", data: depData, keys: ["Depreciation", "Book Value"] };
    setRes(buildResult("Annual Depreciation (Yr 1)", fm(depData[0]?.Depreciation || 0),
      [
        { label: "Asset Cost", value: fm(cost) },
        { label: "Salvage Value", value: fm(salvage) },
        { label: "Total Depreciation", value: fm(totalDep), highlight: true },
        { label: "Useful Life", value: life + " years" },
      ],
      [{ type: "tip", msg: `${method === "DB" ? "Double Declining Balance gives higher deductions in early years." : method === "SYD" ? "Sum-of-Years-Digits accelerates depreciation similarly to DB." : "Straight-Line gives equal deductions each year — simplest method."}` }],
      chart, depData.map(d => ({ label: d.year, value: fm(d.Depreciation) }))));
  }, [cost, salvage, life, method]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Sel label="Depreciation Method" id="dpm" value={method} onChange={setMethod} opts={[
          { v: "SL", l: "Straight-Line (SL)" },
          { v: "DB", l: "Double Declining Balance (DDB)" },
          { v: "SYD", l: "Sum-of-Years-Digits (SYD)" },
        ]} />
        <Sl label="Asset Cost" id="dpc" min={1000} max={1000000} step={1000} value={cost} onChange={setCost} fmt={v => fmSlider(v)} />
        <Sl label="Salvage Value" id="dps" min={0} max={500000} step={500} value={salvage} onChange={setSalvage} fmt={v => fmSlider(v)} />
        <Sl label="Useful Life (Years)" id="dpl" min={1} max={40} value={life} onChange={setLife} fmt={v => `${v} yrs`} />
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Depreciation" /></div>
    </div>
  );
}

// ── Budget Calculator ─────────────────────────────────────────────────
export function BudgetForm() {
  const { fm, sym } = useCurrency();
  const [income, setIncome] = useState("5000");
  const [categories, setCategories] = useState([
    { name: "Housing", amount: "1500", type: "need" },
    { name: "Food & Groceries", amount: "600", type: "need" },
    { name: "Transportation", amount: "400", type: "need" },
    { name: "Utilities", amount: "200", type: "need" },
    { name: "Entertainment", amount: "300", type: "want" },
    { name: "Dining Out", amount: "200", type: "want" },
    { name: "Shopping", amount: "300", type: "want" },
    { name: "Savings", amount: "500", type: "save" },
    { name: "Investments", amount: "500", type: "save" },
  ]);
  const [res, setRes] = useState(null);

  const updateCat = (i, k, v) => setCategories(prev => prev.map((c, idx) => idx === i ? { ...c, [k]: v } : c));

  useEffect(() => {
    const inc = +income || 0;
    const needs = categories.filter(c => c.type === "need").reduce((s, c) => s + (+c.amount || 0), 0);
    const wants = categories.filter(c => c.type === "want").reduce((s, c) => s + (+c.amount || 0), 0);
    const saves = categories.filter(c => c.type === "save").reduce((s, c) => s + (+c.amount || 0), 0);
    const total = needs + wants + saves;
    const remaining = inc - total;
    const chart = { type: "donut", data: [
      { name: "Needs", value: needs, color: "#3b82f6" },
      { name: "Wants", value: wants, color: "#f59e0b" },
      { name: "Savings", value: saves, color: "#22c55e" },
      ...(remaining > 0 ? [{ name: "Unallocated", value: remaining, color: "#94a3b8" }] : []),
    ]};
    setRes(buildResult("Monthly Savings Rate", ((saves / inc) * 100).toFixed(1) + "%",
      [
        { label: "Income", value: fm(inc) },
        { label: "Needs (50% rule)", value: fm(needs) + " (" + (needs / inc * 100).toFixed(0) + "%)", warn: needs / inc > 0.5 },
        { label: "Wants (30% rule)", value: fm(wants) + " (" + (wants / inc * 100).toFixed(0) + "%)", warn: wants / inc > 0.3 },
        { label: "Savings (20% rule)", value: fm(saves) + " (" + (saves / inc * 100).toFixed(0) + "%)", highlight: saves / inc >= 0.2 },
        { label: "Remaining", value: fm(remaining), warn: remaining < 0 },
      ],
      [{ type: remaining < 0 ? "warn" : "tip", msg: remaining < 0 ? `You are over budget by ${fm(Math.abs(remaining))}! Reduce expenses.` : `50/30/20 Rule: Needs ${(needs / inc * 100).toFixed(0)}% | Wants ${(wants / inc * 100).toFixed(0)}% | Savings ${(saves / inc * 100).toFixed(0)}%` }],
      chart, []));
  }, [income, categories]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <N label="Monthly Income" id="budi" value={income} onChange={setIncome} unit={sym} />
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text3)", marginBottom: 10 }}>Expense Categories</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {categories.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.type === "need" ? "#3b82f6" : c.type === "want" ? "#f59e0b" : "#22c55e", flexShrink: 0 }} />
              <input value={c.name} onChange={e => updateCat(i, "name", e.target.value)}
                style={{ flex: 1, height: 36, padding: "0 10px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 13, color: "var(--text)", fontFamily: "var(--font)" }} />
              <input value={c.amount} onChange={e => updateCat(i, "amount", e.target.value)} type="number"
                style={{ width: 90, height: 36, padding: "0 10px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 13, color: "var(--text)", fontFamily: "var(--font)" }} />
              <select value={c.type} onChange={e => updateCat(i, "type", e.target.value)}
                style={{ height: 36, padding: "0 6px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 12, color: "var(--text)", fontFamily: "var(--font)" }}>
                <option value="need">Need</option>
                <option value="want">Want</option>
                <option value="save">Save</option>
              </select>
            </div>
          ))}
          <button onClick={() => setCategories(p => [...p, { name: "New Item", amount: "0", type: "want" }])}
            style={{ padding: "8px", borderRadius: "var(--r-md)", border: "2px dashed var(--border)", background: "transparent", color: "var(--brand)", fontWeight: 700, fontSize: 12, cursor: "pointer", marginTop: 4 }}>
            + Add Category
          </button>
        </div>
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Budget Planner" /></div>
    </div>
  );
}

// ── Present Value Calculator ──────────────────────────────────────────
export function PresentValueForm() {
  const { fm, sym } = useCurrency();
  const [fv, setFv] = useState("100000");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("10");
  const [pmt, setPmt] = useState("0");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const r = +rate / 100, n = +years, FV = +fv, PMT = +pmt || 0;
    if (!r || !n || !FV) { setRes(null); return; }
    const pv = FV / Math.pow(1 + r, n);
    const pvAnnuity = PMT > 0 ? PMT * (1 - Math.pow(1 + r, -n)) / r : 0;
    const totalPV = pv + pvAnnuity;
    setRes(buildResult("Present Value", fm(Math.round(totalPV)),
      [
        { label: "PV of Future Sum", value: fm(Math.round(pv)) },
        { label: "PV of Annuity", value: fm(Math.round(pvAnnuity)) },
        { label: "Discount Rate", value: rate + "%" },
        { label: "Inflation Adjusted", value: fm(Math.round(totalPV * Math.pow(0.97, n))) },
      ],
      [{ type: "tip", msg: `${fm(Math.round(totalPV))} today at ${rate}% will grow to ${fm(FV)} in ${years} years.` }],
      null, []));
  }, [fv, rate, years, pmt]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <N label="Future Value" id="pvfv" value={fv} onChange={setFv} unit={sym} />
        <N label="Discount Rate (% p.a.)" id="pvr" value={rate} onChange={setRate} unit="%" />
        <N label="Number of Years" id="pvn" value={years} onChange={setYears} unit="yrs" />
        <N label="Annual Payment (Optional)" id="pvpmt" value={pmt} onChange={setPmt} unit={sym} placeholder="0" hint="For annuity streams" />
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Present Value" /></div>
    </div>
  );
}

// ── IRR Calculator ────────────────────────────────────────────────────
export function IRRForm() {
  const { fm, sym } = useCurrency();
  const [initial, setInitial] = useState("-50000");
  const [cashflows, setCashflows] = useState("15000\n18000\n20000\n22000\n25000");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const flows = [+initial, ...cashflows.split("\n").map(v => +v.trim()).filter(v => !isNaN(v) && v !== 0)];
      if (flows.length < 2) { setRes(null); return; }
      // Newton-Raphson IRR
      let r = 0.1;
      for (let iter = 0; iter < 1000; iter++) {
        const npv = flows.reduce((s, cf, t) => s + cf / Math.pow(1 + r, t), 0);
        const dnpv = flows.reduce((s, cf, t) => s - t * cf / Math.pow(1 + r, t + 1), 0);
        if (Math.abs(dnpv) < 1e-10) break;
        const newR = r - npv / dnpv;
        if (Math.abs(newR - r) < 1e-8) { r = newR; break; }
        r = newR;
      }
      const irr = (r * 100).toFixed(2);
      const npvAt10 = flows.reduce((s, cf, t) => s + cf / Math.pow(1.1, t), 0);
      const chartData = flows.slice(1).map((cf, i) => ({ period: `Year ${i + 1}`, "Cash Flow": cf }));
      const chart = { type: "bar", data: chartData, keys: ["Cash Flow"] };
      setRes(buildResult("IRR", irr + "%",
        [
          { label: "Initial Investment", value: fm(Math.abs(+initial)) },
          { label: "IRR", value: irr + "%", highlight: +irr > 10 },
          { label: "NPV @ 10%", value: fm(Math.round(npvAt10)), highlight: npvAt10 > 0 },
          { label: "Total Cash Inflow", value: fm(flows.slice(1).reduce((s, v) => s + v, 0)) },
        ],
        [{ type: +irr > 10 ? "tip" : "warn", msg: +irr > 10 ? `IRR of ${irr}% exceeds 10% hurdle rate — this investment is profitable.` : `IRR of ${irr}% is below 10% threshold — consider alternatives.` }],
        chart, flows.map((cf, i) => ({ label: i === 0 ? "Initial Investment" : `Year ${i}`, value: fm(cf) }))));
    }, 200);
    return () => clearTimeout(timer);
  }, [initial, cashflows]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <N label="Initial Investment (negative)" id="irrinit" value={initial} onChange={setInitial} unit={sym} hint="Enter as negative number e.g. -50000" />
        <div style={{ marginBottom: 16 }}>
          <L t="Annual Cash Flows (one per line)" id="irrflows" />
          <textarea id="irrflows" value={cashflows} onChange={e => setCashflows(e.target.value)}
            rows={6} style={{ width: "100%", padding: "12px 14px", background: "var(--surface2)", border: "1.5px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 14, color: "var(--text)", fontFamily: "var(--font-mono)", resize: "vertical", outline: "none" }} />
          <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>One cash flow per line. Positive = inflow, negative = outflow.</p>
        </div>
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="IRR" /></div>
    </div>
  );
}

// ── Down Payment Calculator ───────────────────────────────────────────
export function DownPaymentForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [price, setPrice] = useState(400000);
  const [pct, setPct] = useState(20);
  const [savings, setSavings] = useState("500");
  const [rate, setRate] = useState("4");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const downAmt = price * pct / 100;
    const monthly = +savings || 0;
    const r = +rate / 100 / 12;
    const months = r > 0
      ? Math.log(1 + downAmt * r / monthly) / Math.log(1 + r)
      : downAmt / monthly;
    const pmi = pct < 20 ? (price - downAmt) * 0.01 / 12 : 0;
    setRes(buildResult("Down Payment", fm(Math.round(downAmt)),
      [
        { label: "Down Payment Amount", value: fm(Math.round(downAmt)) },
        { label: "Loan Amount", value: fm(Math.round(price - downAmt)) },
        { label: "Months to Save", value: Math.round(months) + " months", highlight: true },
        { label: "PMI (if < 20%)", value: pmi > 0 ? fm(Math.round(pmi)) + "/mo" : "None ✅", warn: pmi > 0 },
      ],
      [{ type: "tip", msg: `${pct}% down requires ${fm(Math.round(downAmt))}. Saving ${fm(monthly)}/month${+rate > 0 ? ` at ${rate}% return` : ""}, you'll reach your goal in ${Math.ceil(months)} months (${(months / 12).toFixed(1)} years).` }],
      null, []));
  }, [price, pct, savings, rate]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Sl label="Home Price" id="dphp" min={50000} max={2000000} step={5000} value={price} onChange={setPrice} fmt={v => fmSlider(v)} />
        <Sl label="Down Payment (%)" id="dppct" min={3} max={40} step={0.5} value={pct} onChange={setPct} fmt={v => `${v}%`} />
        <Row2>
          <N label="Monthly Savings" id="dpms" value={savings} onChange={setSavings} unit={sym} />
          <N label="Savings Return (%)" id="dpsr" value={rate} onChange={setRate} unit="% /yr" placeholder="4" />
        </Row2>
        {pct < 20 && (
          <div style={{ padding: "12px 14px", background: "#fef2f2", borderRadius: "var(--r-lg)", border: "1.5px solid #fca5a5", fontSize: 12, color: "#dc2626", fontWeight: 600, marginTop: 8 }}>
            ⚠️ Below 20% down payment requires PMI (Private Mortgage Insurance).
          </div>
        )}
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Down Payment" /></div>
    </div>
  );
}

// ── College Cost Calculator ───────────────────────────────────────────
export function CollegeCostForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [annual, setAnnual] = useState(25000);
  const [years, setYears] = useState(4);
  const [inflation, setInflation] = useState(5);
  const [yrsAway, setYrsAway] = useState(10);
  const [savings, setSavings] = useState("200");
  const [returnRate, setReturnRate] = useState("6");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const inflatedAnnual = annual * Math.pow(1 + inflation / 100, yrsAway);
    const totalCost = Array.from({ length: years }, (_, y) =>
      inflatedAnnual * Math.pow(1 + inflation / 100, y)).reduce((s, v) => s + v, 0);
    const r = +returnRate / 100 / 12, n = yrsAway * 12;
    const projectedSavings = +savings * ((Math.pow(1 + r, n) - 1) / r);
    const gap = Math.max(0, totalCost - projectedSavings);
    const chart = { type: "bar", data: Array.from({ length: years }, (_, y) => ({
      year: `Year ${y + 1}`, Cost: Math.round(inflatedAnnual * Math.pow(1 + inflation / 100, y)),
    })), keys: ["Cost"] };
    setRes(buildResult("Total College Cost", fm(Math.round(totalCost)),
      [
        { label: "Current Annual Tuition", value: fm(annual) },
        { label: "Future Annual (Year 1)", value: fm(Math.round(inflatedAnnual)), warn: true },
        { label: "Projected Savings", value: fm(Math.round(projectedSavings)), highlight: projectedSavings >= totalCost },
        { label: "Funding Gap", value: fm(Math.round(gap)), warn: gap > 0 },
      ],
      [{ type: gap > 0 ? "warn" : "tip", msg: gap > 0 ? `You have a ${fm(Math.round(gap))} gap. Consider increasing monthly savings or applying for scholarships.` : `Great! Your savings plan fully covers projected college costs.` }],
      chart, []));
  }, [annual, years, inflation, yrsAway, savings, returnRate]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Sl label="Current Annual Cost" id="cca" min={5000} max={100000} step={1000} value={annual} onChange={setAnnual} fmt={v => fmSlider(v)} />
        <Sel label="College Duration" id="ccyrs" value={String(years)} onChange={v => setYears(+v)} opts={[{ v: "2", l: "2 Years" }, { v: "4", l: "4 Years" }, { v: "6", l: "6 Years" }]} />
        <Row2>
          <N label="Tuition Inflation (%)" id="cci" value={String(inflation)} onChange={v => setInflation(+v)} unit="% /yr" />
          <N label="Years Until College" id="ccya" value={String(yrsAway)} onChange={v => setYrsAway(+v)} unit="yrs" />
        </Row2>
        <Row2>
          <N label="Monthly Savings" id="ccms" value={savings} onChange={setSavings} unit={sym} />
          <N label="Return Rate (%)" id="ccr" value={returnRate} onChange={setReturnRate} unit="% /yr" />
        </Row2>
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="College Cost" /></div>
    </div>
  );
}
