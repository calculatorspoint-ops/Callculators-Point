// @ts-nocheck
import { useState, useEffect } from "react";
import { L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency, formatMoney } from './SharedComponents';
import { ScenarioCompare } from '@/components/calculator-core/ScenarioCompare';
import { useAmortizationWorker } from '@/hooks/useAmortizationWorker';

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
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
        <Sl label="Remaining Balance" id="mpb" min={10000} max={2000000} step={5000} value={balance} onChange={setBalance} fmt={v => fmSlider(v)} />
        <Sl label="Interest Rate (% p.a.)" id="mpr" min={1} max={20} step={0.1} value={rate} onChange={setRate} fmt={v => `${v}%`} />
        <Sl label="Remaining Term (Years)" id="mpt" min={1} max={30} value={term} onChange={setTerm} fmt={v => `${v} yrs`} />
        <Row2>
          <N label="Extra Monthly Payment" id="mpex" value={extra} onChange={setExtra} unit={sym} placeholder="0" hint="Reduces principal faster" />
          <N label="Lump Sum Payment" id="mplump" value={lump} onChange={setLump} unit={sym} placeholder="0" hint="One-time extra payment" />
        </Row2>
      </div>
      <Panel result={res} loading={null} label="Mortgage Payoff" />
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
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
        <N label="Gross Monthly Income" id="hai" value={income} onChange={setIncome} unit={sym} />
        <N label="Existing Monthly Debts" id="had" value={debts} onChange={setDebts} unit={sym} hint="Car loan, student loan, credit cards etc." />
        <Sl label="Down Payment (%)" id="hadp" min={3} max={40} step={0.5} value={+down} onChange={v => setDown(String(v))} fmt={v => `${v}%`} />
        <Sl label="Interest Rate (% p.a.)" id="har" min={2} max={15} step={0.1} value={rate} onChange={setRate} fmt={v => `${v}%`} />
        <Sel label="Loan Term" id="hat" value={String(term)} onChange={v => setTerm(+v)} opts={[{ v: "15", l: "15 Years" }, { v: "20", l: "20 Years" }, { v: "25", l: "25 Years" }, { v: "30", l: "30 Years" }]} />
      </div>
      <Panel result={res} loading={null} label="House Affordability" />
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
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
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
      <Panel result={res} loading={null} label="Rent vs Buy" />
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
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
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
      <Panel result={res} loading={null} label="APR" />
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
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
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
      <Panel result={res} loading={null} label="Auto Loan" />
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
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
        <Sl label="Loan Amount" id="pla" min={1000} max={500000} step={1000} value={amount} onChange={setAmount} fmt={v => fmSlider(v)} />
        <Sl label="Interest Rate (% p.a.)" id="plr" min={1} max={40} step={0.5} value={rate} onChange={setRate} fmt={v => `${v}%`} />
        <Sel label="Loan Term" id="plt" value={String(term)} onChange={v => setTerm(+v)} opts={[
          { v: "12", l: "12 Months" }, { v: "24", l: "24 Months" }, { v: "36", l: "36 Months" },
          { v: "48", l: "48 Months" }, { v: "60", l: "60 Months" }, { v: "84", l: "7 Years" },
        ]} />
      </div>
      <Panel result={res} loading={null} label="Personal Loan" />
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
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
        <Tabs tabs={["Standard", "Income-Based"]} active={mode} onChange={setMode} />
        <Sl label="Loan Balance" id="slb" min={1000} max={200000} step={1000} value={balance} onChange={setBalance} fmt={v => fmSlider(v)} />
        <Sl label="Interest Rate (%)" id="slr" min={1} max={15} step={0.1} value={rate} onChange={setRate} fmt={v => `${v}%`} />
        <Sel label="Repayment Term" id="slt" value={String(term)} onChange={v => setTerm(+v)} opts={[
          { v: "60", l: "5 Years" }, { v: "120", l: "10 Years" },
          { v: "180", l: "15 Years" }, { v: "240", l: "20 Years" },
        ]} />
        {mode === "Income-Based" && <N label="Annual Income" id="sli" value={income} onChange={setIncome} unit={sym} />}
      </div>
      <Panel result={res} loading={null} label="Student Loan" />
    </div>
  );
}

// ── Credit Card Calculator ────────────────────────────────────────────
export function CreditCardForm() {
  const { fm, sym } = useCurrency();
  const [balance, setBalance] = useState(5000);
  const [apr, setApr] = useState(20);
  const [payment, setPayment] = useState("150");
  const [res, setRes] = useState(null);
  const [trapData, setTrapData] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const r = apr / 100 / 12;
      const minPct = 0.02;
      const fixedPmt = +payment > 0 ? +payment : Math.max(balance * minPct, 25);

      // Simulate fixed payment
      let bal = balance, months = 0, totalInterest = 0;
      const schedule = [];
      while (bal > 0.01 && months < 600) {
        months++;
        const interest = bal * r;
        totalInterest += interest;
        const pmt = Math.min(fixedPmt, bal + interest);
        bal = Math.max(0, bal + interest - pmt);
        if (months <= 12) schedule.push({ month: months, payment: Math.round(pmt), interest: Math.round(interest), principal: Math.round(pmt - interest), balance: Math.round(bal) });
      }

      // Simulate minimum-only
      let balMin = balance, monthsMin = 0, interestMin = 0;
      while (balMin > 0.01 && monthsMin < 600) {
        monthsMin++;
        const interest = balMin * r;
        interestMin += interest;
        const pmt = Math.max(balMin * minPct, 25);
        balMin = Math.max(0, balMin + interest - pmt);
      }

      setTrapData(schedule);

      // Chart: balance over time for both strategies
      const chartData = [];
      let b1 = balance, b2 = balance;
      for (let m = 0; m <= Math.min(monthsMin, 120); m += 3) {
        chartData.push({ month: "M" + m, "Your Payment": Math.round(b2), "Min Only": Math.round(b1) });
        for (let x = 0; x < 3 && b1 > 0; x++) b1 = Math.max(0, b1 + b1 * r - Math.max(b1 * minPct, 25));
        for (let x = 0; x < 3 && b2 > 0; x++) b2 = Math.max(0, b2 + b2 * r - fixedPmt);
      }
      const chart = { type: "area", data: chartData, keys: ["Your Payment", "Min Only"] };
      const yrs = Math.floor(months / 12), mos = months % 12;
      const yrsMin = Math.floor(monthsMin / 12), mosMin = monthsMin % 12;
      setRes(buildResult("Payoff Time", (yrs > 0 ? yrs + "y " : "") + mos + "m",
        [
          { label: "Monthly Payment", value: fm(Math.round(fixedPmt)) },
          { label: "Total Interest Paid", value: fm(Math.round(totalInterest)), warn: true },
          { label: "Total Amount Paid", value: fm(Math.round(totalInterest + balance)) },
          { label: "Min-Only Interest Cost", value: fm(Math.round(interestMin)), warn: true },
          { label: "Interest Saved vs Min-Only", value: fm(Math.round(interestMin - totalInterest)), highlight: true },
          { label: "Time Saved vs Min-Only", value: (monthsMin - months) + " months", highlight: true },
        ],
        [{ type: monthsMin > 60 ? "warn" : "tip", msg: "Minimum payment trap: paying only minimums takes " + yrsMin + "y " + mosMin + "m and costs " + fm(Math.round(interestMin)) + " in interest! Paying " + fm(Math.round(fixedPmt)) + "/mo saves " + fm(Math.round(interestMin - totalInterest)) + "." }],
        chart, schedule.slice(0, 6).map(s => ({ label: "Month " + s.month, value: "Int: " + fm(s.interest) + " | Prin: " + fm(s.principal) }))
      ));
    }, 150);
    return () => clearTimeout(timer);
  }, [balance, apr, payment]);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
        <Presets items={[
          { label: "Low Balance", v: { b: 2000, a: 18, p: "75" } },
          { label: "Medium Balance", v: { b: 8000, a: 22, p: "200" } },
          { label: "High Balance", v: { b: 20000, a: 25, p: "500" } },
        ]} onApply={p => { setBalance(p.v.b); setApr(p.v.a); setPayment(p.v.p); }} />
        <Sl label="Credit Card Balance" id="ccb" min={100} max={50000} step={100} value={balance} onChange={setBalance} fmt={v => sym + v.toLocaleString()} />
        <Sl label="APR (%)" id="cca" min={5} max={40} step={0.5} value={apr} onChange={setApr} fmt={v => v + "%"} />
        <N label="Monthly Payment" id="ccp" value={payment} onChange={setPayment} unit={sym} hint="vs. minimum payment trap" />
        <div style={{ padding: "12px 14px", background: "rgba(239,68,68,0.08)", borderRadius: "var(--r-lg)", border: "1px solid rgba(239,68,68,0.2)", marginTop: 12 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#dc2626" }}>⚠️ Minimum Payment Trap</p>
          <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>Credit card companies set minimums low (~2%) to maximize interest. The chart compares your payment vs minimum-only payoff.</p>
        </div>
      </div>
      <Panel result={res} loading={null} label="Credit Card Payoff" />
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
  const [strategy, setStrategy] = useState("Compare Both");
  const [res, setRes] = useState(null);

  const updateDebt = (i, k, v) => setDebts(prev => prev.map((d, idx) => idx === i ? { ...d, [k]: v } : d));
  const addDebt = () => setDebts(prev => [...prev, { name: "New Debt", balance: "0", rate: "0", min: "0" }]);
  const removeDebt = (i) => setDebts(prev => prev.filter((_, idx) => idx !== i));

  function simulate(ds, sortFn, extraAmt) {
    const sorted = [...ds].sort(sortFn);
    let months = 0, totalInterest = 0;
    const bals = sorted.map(d => d.balance);
    while (bals.some(b => b > 0) && months < 600) {
      months++;
      let freeExtra = extraAmt;
      for (let i = 0; i < sorted.length; i++) {
        if (bals[i] <= 0) continue;
        totalInterest += bals[i] * sorted[i].rate;
        bals[i] += bals[i] * sorted[i].rate;
        const pmt = Math.min(sorted[i].min, bals[i]);
        bals[i] -= pmt;
      }
      for (let i = 0; i < sorted.length; i++) {
        if (bals[i] <= 0) continue;
        const apply = Math.min(freeExtra, bals[i]);
        bals[i] -= apply;
        freeExtra -= apply;
        if (freeExtra <= 0) break;
      }
    }
    return { months, totalInterest };
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const ds = debts.map(d => ({ name: d.name, balance: +d.balance, rate: +d.rate / 100 / 12, min: +d.min })).filter(d => d.balance > 0);
      if (!ds.length) { setRes(null); return; }
      const extraAmt = +extra || 0;
      const totalDebt = debts.reduce((s, d) => s + (+d.balance || 0), 0);
      const avalanche = simulate(ds, (a, b) => b.rate - a.rate, extraAmt);
      const snowball = simulate(ds, (a, b) => a.balance - b.balance, extraAmt);
      const avSaves = snowball.totalInterest - avalanche.totalInterest;
      const avFaster = snowball.months - avalanche.months;
      const preferred = strategy === "Avalanche" ? avalanche : strategy === "Snowball" ? snowball : avalanche;
      const chart = { type: "bar", data: [
        { strategy: "Avalanche", Months: avalanche.months, Interest: Math.round(avalanche.totalInterest) },
        { strategy: "Snowball", Months: snowball.months, Interest: Math.round(snowball.totalInterest) },
      ], keys: ["Months"] };
      setRes(buildResult("Debt-Free In", Math.floor(preferred.months / 12) + "y " + (preferred.months % 12) + "m",
        [
          { label: "Total Debt", value: fm(Math.round(totalDebt)) },
          { label: "Avalanche Interest", value: fm(Math.round(avalanche.totalInterest)), highlight: true },
          { label: "Snowball Interest", value: fm(Math.round(snowball.totalInterest)) },
          { label: "Avalanche saves vs Snowball", value: avSaves >= 0 ? fm(Math.round(avSaves)) + " + " + avFaster + " months" : "Snowball is faster by " + Math.abs(avFaster) + " mo", highlight: avSaves > 0 },
        ],
        [{ type: "tip", msg: avSaves > 0
          ? "Avalanche saves " + fm(Math.round(avSaves)) + " more interest and pays off " + Math.abs(avFaster) + " months faster. Choose Snowball for psychological wins on small debts."
          : "Both strategies are similar for your debts. Snowball gives quicker wins by eliminating small debts first." }],
        chart, debts.filter(d => +d.balance > 0).sort((a, b) => +b.rate - +a.rate).map(d => ({ label: d.name, value: fm(+d.balance) + " @ " + d.rate + "%" }))
      ));
    }, 200);
    return () => clearTimeout(timer);
  }, [debts, extra, strategy]);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
        <Tabs tabs={["Compare Both", "Avalanche", "Snowball"]} active={strategy} onChange={setStrategy} />
        <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 14 }}>
          {strategy === "Avalanche" ? "⚡ Highest interest rate first — mathematically optimal, saves the most money."
          : strategy === "Snowball" ? "❄️ Smallest balance first — psychological wins, builds momentum."
          : "📊 Comparing both strategies side-by-side to find your best approach."}
        </p>
        {debts.map((d, i) => (
          <div key={i} style={{ marginBottom: 12, padding: 12, background: "var(--surface2)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <input value={d.name} onChange={e => updateDebt(i, "name", e.target.value)}
                style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", background: "transparent", border: "none", outline: "none", flex: 1 }} />
              {debts.length > 1 && <button onClick={() => removeDebt(i)} style={{ color: "var(--text3)", background: "none", border: "none", cursor: "pointer", fontSize: 16 }}>×</button>}
            </div>
            <Row3>
              <N label="Balance" id={"dpb" + i} value={d.balance} onChange={v => updateDebt(i, "balance", v)} unit={sym} />
              <N label="Rate %" id={"dpr" + i} value={d.rate} onChange={v => updateDebt(i, "rate", v)} unit="%" />
              <N label="Min Pmt" id={"dpm" + i} value={d.min} onChange={v => updateDebt(i, "min", v)} unit={sym} />
            </Row3>
          </div>
        ))}
        <button onClick={addDebt} style={{ width: "100%", padding: "10px", borderRadius: "var(--r-md)", border: "2px dashed var(--border)", background: "transparent", color: "var(--brand)", fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: 8 }}>
          + Add Another Debt
        </button>
        <N label="Extra Monthly Payment" id="dpex" value={extra} onChange={setExtra} unit={sym} hint="Extra cash applied to focus debt each month" />
      </div>
      <Panel result={res} loading={null} label="Debt Payoff" />
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
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
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
      <Panel result={res} loading={null} label="401(k) Balance" />
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
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
        <N label="Total Sales Amount" id="cms" value={sales} onChange={setSales} unit={sym} />
        <N label="Commission Rate (%)" id="cmr" value={rate} onChange={setRate} unit="%" />
        <N label="Base Salary (Monthly)" id="cmb" value={base} onChange={setBase} unit={sym} placeholder="0" hint="Optional fixed salary" />
      </div>
      <Panel result={res} loading={null} label="Commission" />
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
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
        <Sel label="Depreciation Method" id="dpm" value={method} onChange={setMethod} opts={[
          { v: "SL", l: "Straight-Line (SL)" },
          { v: "DB", l: "Double Declining Balance (DDB)" },
          { v: "SYD", l: "Sum-of-Years-Digits (SYD)" },
        ]} />
        <Sl label="Asset Cost" id="dpc" min={1000} max={1000000} step={1000} value={cost} onChange={setCost} fmt={v => fmSlider(v)} />
        <Sl label="Salvage Value" id="dps" min={0} max={500000} step={500} value={salvage} onChange={setSalvage} fmt={v => fmSlider(v)} />
        <Sl label="Useful Life (Years)" id="dpl" min={1} max={40} value={life} onChange={setLife} fmt={v => `${v} yrs`} />
      </div>
      <Panel result={res} loading={null} label="Depreciation" />
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
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
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
      <Panel result={res} loading={null} label="Budget Planner" />
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
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
        <N label="Future Value" id="pvfv" value={fv} onChange={setFv} unit={sym} />
        <N label="Discount Rate (% p.a.)" id="pvr" value={rate} onChange={setRate} unit="%" />
        <N label="Number of Years" id="pvn" value={years} onChange={setYears} unit="yrs" />
        <N label="Annual Payment (Optional)" id="pvpmt" value={pmt} onChange={setPmt} unit={sym} placeholder="0" hint="For annuity streams" />
      </div>
      <Panel result={res} loading={null} label="Present Value" />
    </div>
  );
}

// ── IRR Calculator ────────────────────────────────────────────────────
export function IRRForm() {
  const { fm, sym } = useCurrency();
  const [initial, setInitial] = useState("-50000");
  const [cashflows, setCashflows] = useState("15000\n18000\n20000\n22000\n25000");
  const [hurdleRate, setHurdleRate] = useState("10");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const flows = [+initial, ...cashflows.split("\n").map(v => +v.trim()).filter(v => !isNaN(v) && v !== 0)];
      if (flows.length < 2) { setRes(null); return; }

      // Count sign changes (Descartes' rule — warns of multiple IRR solutions)
      let signChanges = 0;
      for (let i = 1; i < flows.length; i++) {
        if (flows[i] * flows[i - 1] < 0) signChanges++;
      }

      // Newton-Raphson IRR with multiple starting points for robustness
      function tryIRR(guess: number): number | null {
        let r = guess;
        for (let iter = 0; iter < 500; iter++) {
          const npv = flows.reduce((s, cf, t) => s + cf / Math.pow(1 + r, t), 0);
          const dnpv = flows.reduce((s, cf, t) => s - t * cf / Math.pow(1 + r, t + 1), 0);
          if (Math.abs(dnpv) < 1e-12) break;
          const nr = r - npv / dnpv;
          if (!isFinite(nr)) return null;
          if (Math.abs(nr - r) < 1e-9) return nr;
          r = Math.max(-0.9999, nr);
        }
        return r;
      }

      let bestR: number | null = null;
      for (const guess of [0.1, 0.01, 0.5, -0.05, 2.0]) {
        const c = tryIRR(guess);
        if (c !== null && isFinite(c) && c > -0.9999) {
          const verify = flows.reduce((s, cf, t) => s + cf / Math.pow(1 + c, t), 0);
          if (Math.abs(verify) < 1.0) { bestR = c; break; }
        }
      }

      const hurdle = Math.max(0, +hurdleRate || 10);
      const hurdleDec = hurdle / 100;
      const npvAtHurdle = flows.reduce((s, cf, t) => s + cf / Math.pow(1 + hurdleDec, t), 0);
      const chartData = flows.slice(1).map((cf, i) => ({ period: `Year ${i + 1}`, "Cash Flow": cf }));
      const chart = { type: "bar", data: chartData, keys: ["Cash Flow"] };

      if (bestR === null) {
        setRes(buildResult("IRR", "No Solution",
          [
            { label: "Initial Investment", value: fm(Math.abs(+initial)) },
            { label: "IRR", value: "Cannot be determined", warn: true },
            { label: `NPV @ ${hurdle}%`, value: fm(Math.round(npvAtHurdle)), highlight: npvAtHurdle > 0 },
          ],
          [{ type: "warn", msg: "No IRR solution found. This may occur when all cashflows are the same sign, or the investment never breaks even." }],
          chart, flows.map((cf, i) => ({ label: i === 0 ? "Initial Investment" : `Year ${i}`, value: fm(cf) }))));
        return;
      }

      const irr = (bestR * 100).toFixed(2);
      const insights: any[] = [];
      if (signChanges > 1) {
        insights.push({ type: "warn", msg: `⚠️ ${signChanges} sign changes detected — multiple IRR solutions may exist. Verify using NPV analysis.` });
      }
      insights.push({ type: +irr > hurdle ? "tip" : "warn", msg: +irr > hurdle ? `IRR of ${irr}% exceeds your ${hurdle}% hurdle rate — this investment creates value.` : `IRR of ${irr}% is below your ${hurdle}% hurdle rate — review the investment case.` });
      if (npvAtHurdle > 0) insights.push({ type: "tip", msg: `Positive NPV of ${fm(Math.round(npvAtHurdle))} at ${hurdle}% confirms value creation.` });

      setRes(buildResult("IRR", irr + "%",
        [
          { label: "Initial Investment", value: fm(Math.abs(+initial)) },
          { label: "IRR", value: irr + "%", highlight: +irr > hurdle },
          { label: `NPV @ ${hurdle}%`, value: fm(Math.round(npvAtHurdle)), highlight: npvAtHurdle > 0 },
          { label: "Total Cash Inflow", value: fm(flows.slice(1).reduce((s, v) => s + v, 0)) },
          { label: "Sign Changes", value: signChanges + (signChanges > 1 ? " ⚠️" : "") },
        ],
        insights,
        chart, flows.map((cf, i) => ({ label: i === 0 ? "Initial Investment" : `Year ${i}`, value: fm(cf) }))));
    }, 200);
    return () => clearTimeout(timer);
  }, [initial, cashflows, hurdleRate]);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
        <N label="Initial Investment (negative)" id="irrinit" value={initial} onChange={setInitial} unit={sym} hint="Enter as negative number e.g. -50000" />
        <N label="Hurdle Rate (%)" id="irrhurdle" value={hurdleRate} onChange={setHurdleRate} unit="%" hint="Your minimum required return (used for NPV & IRR comparison)" />
        <div style={{ marginBottom: 16 }}>
          <L t="Annual Cash Flows (one per line)" id="irrflows" />
          <textarea id="irrflows" value={cashflows} onChange={e => setCashflows(e.target.value)}
            rows={6} style={{ width: "100%", padding: "12px 14px", background: "var(--surface2)", border: "1.5px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 14, color: "var(--text)", fontFamily: "var(--font-mono)", resize: "vertical", outline: "none" }} />
          <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>One cash flow per line. Positive = inflow, negative = outflow.</p>
        </div>
      </div>
      <Panel result={res} loading={null} label="IRR" />
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
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
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
      <Panel result={res} loading={null} label="Down Payment" />
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
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
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
      <Panel result={res} loading={null} label="College Cost" />
    </div>
  );
}


// ── HELOC Calculator ──────────────────────────────────────────────────
export function HELOCForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [homeValue, setHomeValue] = useState(450000);
  const [mortgage, setMortgage] = useState(200000);
  const [creditPct, setCreditPct] = useState(85);
  const [drawYears, setDrawYears] = useState(10);
  const [repayYears, setRepayYears] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [res, setRes] = useState(null);

  useEffect(() => {
    const equity = homeValue - mortgage;
    if (equity <= 0) { setRes(null); return; }
    const creditLimit = equity * creditPct / 100;
    const r = rate / 100 / 12;
    const drawPayment = creditLimit * r;
    const n = repayYears * 12;
    const repayPayment = n > 0 ? (creditLimit * r * Math.pow(1+r,n)) / (Math.pow(1+r,n)-1) : 0;
    const totalCost = drawPayment * drawYears * 12 + repayPayment * n;
    const chart = { type: "bar", data: [
      { phase: "Draw Period", Monthly: Math.round(drawPayment) },
      { phase: "Repayment", Monthly: Math.round(repayPayment) },
    ], keys: ["Monthly"] };
    setRes(buildResult("Credit Limit", fm(Math.round(creditLimit)),
      [
        { label: "Home Equity", value: fm(Math.round(equity)), highlight: true },
        { label: "Draw Payment", value: fm(Math.round(drawPayment)) + "/mo" },
        { label: "Repayment Payment", value: fm(Math.round(repayPayment)) + "/mo" },
        { label: "Total Interest", value: fm(Math.round(totalCost - creditLimit)), warn: true },
      ],
      [{ type: "tip", msg: "Your " + creditPct + "% LTV HELOC gives access to " + fm(Math.round(creditLimit)) + ". Draw period: " + fm(Math.round(drawPayment)) + "/mo interest only." }],
      chart, []));
  }, [homeValue, mortgage, creditPct, drawYears, repayYears, rate]);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
        <Presets items={[
          { label: "Starter Home", v: { hv: 300000, m: 150000, r: 8.5 } },
          { label: "Mid-Range", v: { hv: 500000, m: 200000, r: 8 } },
          { label: "High Value", v: { hv: 800000, m: 300000, r: 7.5 } },
        ]} onApply={p => { setHomeValue(p.v.hv); setMortgage(p.v.m); setRate(p.v.r); }} />
        <Sl label="Home Value" id="helv" min={100000} max={2000000} step={10000} value={homeValue} onChange={setHomeValue} fmt={v => fmSlider(v)} />
        <Sl label="Mortgage Balance" id="helm" min={0} max={1500000} step={10000} value={mortgage} onChange={setMortgage} fmt={v => fmSlider(v)} />
        <Sl label="Credit Limit % of Equity" id="helcp" min={60} max={90} step={1} value={creditPct} onChange={setCreditPct} fmt={v => v + "%"} />
        <Sl label="Interest Rate (%)" id="helr" min={3} max={20} step={0.1} value={rate} onChange={setRate} fmt={v => v + "%"} />
        <Row2>
          <N label="Draw Period (yrs)" id="heldy" value={String(drawYears)} onChange={v => setDrawYears(+v)} unit="yrs" />
          <N label="Repayment (yrs)" id="helry" value={String(repayYears)} onChange={v => setRepayYears(+v)} unit="yrs" />
        </Row2>
      </div>
      <Panel result={res} loading={null} label="HELOC" />
    </div>
  );
}

// ── Auto Lease Calculator ─────────────────────────────────────────────
export function AutoLeaseForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [msrp, setMsrp] = useState(40000);
  const [negotiated, setNegotiated] = useState(38000);
  const [residualPct, setResidualPct] = useState(55);
  const [moneyFactor, setMoneyFactor] = useState("0.00150");
  const [term, setTerm] = useState(36);
  const [down, setDown] = useState(2000);
  const [fees, setFees] = useState("800");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const residual = msrp * residualPct / 100;
    const mf = +moneyFactor || 0;
    const adjCap = negotiated + (+fees || 0) - down;
    const depreciation = (adjCap - residual) / term;
    const financeCharge = (adjCap + residual) * mf;
    const monthly = depreciation + financeCharge;
    const totalLease = monthly * term + down;
    const aprEquiv = (mf * 2400).toFixed(2);
    const chart = { type: "bar", data: [
      { name: "Depreciation", value: Math.round(depreciation) },
      { name: "Finance Charge", value: Math.round(financeCharge) },
    ], keys: ["value"] };
    setRes(buildResult("Monthly Payment", fm(Math.round(monthly)),
      [
        { label: "Residual Value", value: fm(Math.round(residual)) },
        { label: "Depreciation/mo", value: fm(Math.round(depreciation)) },
        { label: "Finance Charge/mo", value: fm(Math.round(financeCharge)) },
        { label: "Total Lease Cost", value: fm(Math.round(totalLease)), highlight: true },
      ],
      [{ type: "tip", msg: "Money Factor " + moneyFactor + " = " + aprEquiv + "% APR. Total over " + term + " months: " + fm(Math.round(totalLease)) }],
      chart, []));
  }, [msrp, negotiated, residualPct, moneyFactor, term, down, fees]);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
        <Presets items={[
          { label: "Budget", v: { msrp: 25000, neg: 23500, res: 55, mf: "0.00200", t: 36, dn: 0 } },
          { label: "Mid-range", v: { msrp: 45000, neg: 43000, res: 52, mf: "0.00150", t: 36, dn: 2000 } },
          { label: "Luxury", v: { msrp: 80000, neg: 77000, res: 50, mf: "0.00125", t: 39, dn: 5000 } },
        ]} onApply={p => { setMsrp(p.v.msrp); setNegotiated(p.v.neg); setResidualPct(p.v.res); setMoneyFactor(p.v.mf); setTerm(p.v.t); setDown(p.v.dn); }} />
        <Sl label="MSRP" id="almsrp" min={10000} max={200000} step={500} value={msrp} onChange={setMsrp} fmt={v => fmSlider(v)} />
        <Sl label="Negotiated Price" id="alneg" min={10000} max={200000} step={500} value={negotiated} onChange={setNegotiated} fmt={v => fmSlider(v)} />
        <Sl label="Residual % of MSRP" id="alres" min={30} max={75} step={1} value={residualPct} onChange={setResidualPct} fmt={v => v + "%"} />
        <Row2>
          <N label="Money Factor" id="almf" value={moneyFactor} onChange={setMoneyFactor} hint={"APR " + (+moneyFactor * 2400).toFixed(2) + "%"} />
          <Sel label="Term" id="alterm" value={String(term)} onChange={v => setTerm(+v)} opts={[{v:"24",l:"24 mo"},{v:"36",l:"36 mo"},{v:"39",l:"39 mo"},{v:"48",l:"48 mo"}]} />
        </Row2>
        <Row2>
          <N label="Down Payment" id="aldown" value={String(down)} onChange={v => setDown(+v)} unit={sym} />
          <N label="Fees" id="alfees" value={fees} onChange={setFees} unit={sym} placeholder="800" />
        </Row2>
      </div>
      <Panel result={res} loading={null} label="Auto Lease" />
    </div>
  );
}

// ── Bond Calculator ───────────────────────────────────────────────────
export function BondForm() {
  const { fm, sym } = useCurrency();
  const [faceValue, setFaceValue] = useState("1000");
  const [couponRate, setCouponRate] = useState("5");
  const [ytm, setYtm] = useState("6");
  const [years, setYears] = useState("10");
  const [freq, setFreq] = useState("2");
  const [dayCount, setDayCount] = useState("30/360");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const F = +faceValue, c = +couponRate / 100, y = +ytm / 100, n = +years, f = +freq;
    if (!F || !n || !f) { setRes(null); return; }
    const periodicCoupon = (F * c) / f;
    const periodicRate = y / f;
    const periods = n * f;
    const priceCoupons = periodicCoupon * (1 - Math.pow(1 + periodicRate, -periods)) / periodicRate;
    const priceFace = F / Math.pow(1 + periodicRate, periods);
    const price = priceCoupons + priceFace;
    const currentYield = (periodicCoupon * f) / price * 100;
    const status = price > F + 0.5 ? "Premium" : price < F - 0.5 ? "Discount" : "Par";
    const freqLabel = freq === "1" ? "Annual" : freq === "2" ? "Semi-Annual" : "Quarterly";
    const chartData = [];
    for (let i = 1; i <= 15; i++) {
      const r = i / 100 / f;
      const p = periodicCoupon * (1 - Math.pow(1+r,-periods)) / r + F / Math.pow(1+r,periods);
      chartData.push({ yield: i + "%", Price: Math.round(p) });
    }
    const chart = { type: "line", data: chartData, keys: ["Price"] };
    setRes(buildResult("Bond Price", fm(Math.round(price)),
      [
        { label: "Status", value: status, highlight: status === "Par" },
        { label: "Annual Coupon", value: fm(periodicCoupon * f) },
        { label: "Current Yield", value: currentYield.toFixed(2) + "%" },
        { label: "Price vs Par", value: ((price / F - 1) * 100).toFixed(2) + "%" },
      ],
      [{ type: "tip", msg: "Bond at " + status + ". When YTM > coupon rate, bond trades at discount. Chart shows inverse price-yield relationship. Day-count: " + dayCount + "." }],
      chart, [
        { label: "Day Count Convention", value: dayCount },
        { label: "Coupon Frequency", value: freqLabel },
        { label: "Periods to Maturity", value: String(+years * +freq) },
      ]));
  }, [faceValue, couponRate, ytm, years, freq, dayCount]);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
        <N label="Face Value" id="bfv" value={faceValue} onChange={setFaceValue} unit={sym} />
        <Row2>
          <N label="Coupon Rate (%)" id="bcr" value={couponRate} onChange={setCouponRate} unit="%" />
          <N label="Yield to Maturity (%)" id="bytm" value={ytm} onChange={setYtm} unit="%" />
        </Row2>
        <Row2>
          <N label="Years to Maturity" id="byr" value={years} onChange={setYears} unit="yrs" />
          <Sel label="Coupon Frequency" id="bfreq" value={freq} onChange={setFreq} opts={[{v:"1",l:"Annual"},{v:"2",l:"Semi-Annual"},{v:"4",l:"Quarterly"}]} />
        </Row2>
        <Sel label="Day Count Convention" id="bdaycount" value={dayCount} onChange={setDayCount} opts={[
          { v: "30/360",  l: "30/360 (US Corporate, Municipal)" },
          { v: "Act/360", l: "Act/360 (Money Market, USD LIBOR)" },
          { v: "Act/365", l: "Act/365 (UK Gilts, AUD bonds)" },
          { v: "Act/Act", l: "Act/Act (US Treasuries, Eurozone govts)" },
        ]} />
      </div>
      <Panel result={res} loading={null} label="Bond Price" />
    </div>
  );
}

// ── CD Calculator ─────────────────────────────────────────────────────
export function CDForm() {
  const { fm, fmSlider } = useCurrency();
  const [principal, setPrincipal] = useState(10000);
  const [apy, setApy] = useState(5);
  const [term, setTerm] = useState(12);
  const [res, setRes] = useState(null);

  useEffect(() => {
    const r = apy / 100;
    const maturity = principal * Math.pow(1 + r, term / 12);
    const interest = maturity - principal;
    const chartData = [3,6,12,24,36,60].map(t => ({
      term: t + "mo",
      Maturity: Math.round(principal * Math.pow(1 + r, t / 12)),
    }));
    const chart = { type: "bar", data: chartData, keys: ["Maturity"] };
    setRes(buildResult("Maturity Value", fm(Math.round(maturity)),
      [
        { label: "Principal", value: fm(principal) },
        { label: "Interest Earned", value: fm(Math.round(interest)), highlight: true },
        { label: "Total Return", value: (interest / principal * 100).toFixed(2) + "%" },
        { label: "APY", value: apy + "%" },
      ],
      [{ type: "tip", msg: fm(principal) + " at " + apy + "% APY for " + term + " months earns " + fm(Math.round(interest)) + " in interest." }],
      chart, []));
  }, [principal, apy, term]);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
        <Sl label="Principal" id="cdp" min={1000} max={500000} step={1000} value={principal} onChange={setPrincipal} fmt={v => fmSlider(v)} />
        <Sl label="APY (%)" id="cdapy" min={0.5} max={8} step={0.05} value={apy} onChange={setApy} fmt={v => v + "%"} />
        <Sel label="Term" id="cdterm" value={String(term)} onChange={v => setTerm(+v)} opts={[{v:"3",l:"3 Months"},{v:"6",l:"6 Months"},{v:"12",l:"12 Months"},{v:"24",l:"24 Months"},{v:"36",l:"36 Months"},{v:"60",l:"5 Years"}]} />
      </div>
      <Panel result={res} loading={null} label="CD Calculator" />
    </div>
  );
}

// ── Roth IRA Calculator ───────────────────────────────────────────────
export function RothIRAForm() {
  const { fm, fmSlider, sym } = useCurrency();
  const [contribution, setContribution] = useState(6000);
  const [currentAge, setCurrentAge] = useState(30);
  const [retireAge, setRetireAge] = useState(65);
  const [rate, setRate] = useState(7);
  const [currentBalance, setCurrentBalance] = useState("0");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const years = retireAge - currentAge;
    if (years <= 0) { setRes(null); return; }
    const r = rate / 100;
    const existing = +currentBalance || 0;
    const fv = existing * Math.pow(1+r, years) + contribution * ((Math.pow(1+r,years)-1)/r);
    const totalContrib = contribution * years + existing;
    const gains = fv - totalContrib;
    const step = Math.max(1, Math.floor(years/10));
    const chartData = Array.from({length: Math.floor(years/step)+1}, (_,i) => {
      const y = i * step;
      return {
        age: currentAge + y,
        Balance: Math.round(existing * Math.pow(1+r,y) + contribution * ((Math.pow(1+r,y)-1)/r)),
        Contributed: Math.round(contribution * y + existing),
      };
    });
    const chart = { type: "area", data: chartData, keys: ["Balance","Contributed"] };
    setRes(buildResult("Roth IRA Balance", fm(Math.round(fv)),
      [
        { label: "Total Contributed", value: fm(Math.round(totalContrib)) },
        { label: "Tax-Free Gains", value: fm(Math.round(gains)), highlight: true },
        { label: "Monthly Income (4%)", value: fm(Math.round(fv * 0.04 / 12)), highlight: true },
        { label: "Investment Years", value: years + " years" },
      ],
      [{ type: "tip", msg: fm(Math.round(gains)) + " in tax-FREE gains! 2024 limit: $7,000/yr ($8,000 if 50+). All qualified withdrawals are completely tax-free." }],
      chart, []));
  }, [contribution, currentAge, retireAge, rate, currentBalance]);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
        <Sl label="Annual Contribution" id="rira_c" min={500} max={7000} step={500} value={contribution} onChange={setContribution} fmt={v => fmSlider(v)} />
        <Row2>
          <N label="Current Age" id="rira_ca" value={String(currentAge)} onChange={v => setCurrentAge(+v)} unit="yrs" />
          <N label="Retirement Age" id="rira_ra" value={String(retireAge)} onChange={v => setRetireAge(+v)} unit="yrs" />
        </Row2>
        <Sl label="Expected Annual Return (%)" id="rira_r" min={1} max={15} step={0.5} value={rate} onChange={setRate} fmt={v => v + "%"} />
        <N label="Current Balance" id="rira_bal" value={currentBalance} onChange={setCurrentBalance} unit={sym} placeholder="0" />
      </div>
      <Panel result={res} loading={null} label="Roth IRA" />
    </div>
  );
}

// ── Annuity Calculator ────────────────────────────────────────────────
export function AnnuityForm() {
  const { fm, sym } = useCurrency();
  const [payment, setPayment] = useState("1000");
  const [rate, setRate] = useState("6");
  const [periods, setPeriods] = useState("20");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const pmt = +payment, r = +rate / 100, n = +periods;
    if (!pmt || !r || !n) { setRes(null); return; }
    const pv = pmt * (1 - Math.pow(1+r,-n)) / r;
    const fv = pmt * (Math.pow(1+r,n) - 1) / r;
    const step = Math.max(1, Math.floor(n/10));
    const chartData = Array.from({length: Math.floor(n/step)+1}, (_,i) => {
      const y = i * step;
      return {
        period: "Yr " + y,
        "Cumulative Payments": Math.round(pmt * y),
        "FV Growth": Math.round(pmt * ((Math.pow(1+r,y)-1)/r)),
      };
    });
    const chart = { type: "area", data: chartData, keys: ["Cumulative Payments","FV Growth"] };
    setRes(buildResult("Future Value", fm(Math.round(fv)),
      [
        { label: "Present Value", value: fm(Math.round(pv)) },
        { label: "Future Value", value: fm(Math.round(fv)), highlight: true },
        { label: "Total Payments", value: fm(Math.round(pmt * n)) },
        { label: "Total Interest Earned", value: fm(Math.round(fv - pmt*n)), highlight: true },
      ],
      [{ type: "tip", msg: "Annual " + fm(pmt) + " payments at " + rate + "% for " + n + " years: PV = " + fm(Math.round(pv)) + ", FV = " + fm(Math.round(fv)) }],
      chart, []));
  }, [payment, rate, periods]);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
        <N label="Annual Payment" id="ann_pmt" value={payment} onChange={setPayment} unit={sym} />
        <Row2>
          <N label="Annual Rate (%)" id="ann_r" value={rate} onChange={setRate} unit="%" />
          <N label="Periods (Years)" id="ann_n" value={periods} onChange={setPeriods} unit="yrs" />
        </Row2>
      </div>
      <Panel result={res} loading={null} label="Annuity" />
    </div>
  );
}

// ── Pension Calculator ────────────────────────────────────────────────
export function PensionForm() {
  const { fm, fmSlider } = useCurrency();
  const [yearsService, setYearsService] = useState(25);
  const [finalSalary, setFinalSalary] = useState(80000);
  const [multiplier, setMultiplier] = useState(2);
  const [res, setRes] = useState(null);

  useEffect(() => {
    const annualPension = yearsService * finalSalary * multiplier / 100;
    const monthly = annualPension / 12;
    const contribAmt = finalSalary * multiplier / 100;
    const fv401k = contribAmt * ((Math.pow(1.07, yearsService)-1)/0.07);
    const monthly401k = fv401k * 0.04 / 12;
    const chart = { type: "bar", data: [
      { type: "Pension Income", Monthly: Math.round(monthly) },
      { type: "401k Equiv.", Monthly: Math.round(monthly401k) },
    ], keys: ["Monthly"] };
    setRes(buildResult("Annual Pension", fm(Math.round(annualPension)),
      [
        { label: "Monthly Income", value: fm(Math.round(monthly)), highlight: true },
        { label: "Years of Service", value: yearsService + " yrs" },
        { label: "Benefit Multiplier", value: multiplier + "%/yr" },
        { label: "Equiv. 401k Income", value: fm(Math.round(monthly401k)) + "/mo" },
      ],
      [{ type: "tip", msg: yearsService + " yrs x " + multiplier + "% x " + fm(finalSalary) + " = " + fm(Math.round(annualPension)) + "/yr pension income for life." }],
      chart, []));
  }, [yearsService, finalSalary, multiplier]);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
        <Sl label="Years of Service" id="pen_y" min={1} max={40} value={yearsService} onChange={setYearsService} fmt={v => v + " yrs"} />
        <Sl label="Final Salary" id="pen_s" min={20000} max={500000} step={5000} value={finalSalary} onChange={setFinalSalary} fmt={v => fmSlider(v)} />
        <Sl label="Benefit Multiplier (% per year)" id="pen_m" min={1} max={3} step={0.1} value={multiplier} onChange={setMultiplier} fmt={v => v + "%/yr"} />
      </div>
      <Panel result={res} loading={null} label="Pension" />
    </div>
  );
}

// ── Social Security Calculator ────────────────────────────────────────
export function SocialSecurityForm() {
  const { fm } = useCurrency();
  const [benefitAt67, setBenefitAt67] = useState(2000);
  const [claimAge, setClaimAge] = useState(67);
  const [res, setRes] = useState(null);

  useEffect(() => {
    const factor = claimAge < 67 ? 1-(67-claimAge)*0.05 : 1+(claimAge-67)*0.08;
    const adjustedFactor = Math.max(0.70, Math.min(1.24, factor));
    const monthly = Math.round(benefitAt67 * adjustedFactor);
    const chartData = [62,63,64,65,66,67,68,69,70].map(a => {
      const f = a < 67 ? 1-(67-a)*0.05 : 1+(a-67)*0.08;
      return { age: "Age " + a, Monthly: Math.round(benefitAt67 * Math.max(0.70, Math.min(1.24,f))) };
    });
    const chart = { type: "bar", data: chartData, keys: ["Monthly"] };
    setRes(buildResult("Monthly Benefit", fm(monthly),
      [
        { label: "Base Benefit (age 67)", value: fm(benefitAt67) },
        { label: "Your Benefit (age " + claimAge + ")", value: fm(monthly), highlight: true },
        { label: "Adjustment", value: ((adjustedFactor-1)*100).toFixed(0) + "%" },
        { label: "Annual Benefit", value: fm(monthly*12) },
      ],
      [{ type: claimAge >= 67 ? "tip" : "warn", msg: claimAge >= 67
        ? "Delaying to " + claimAge + " gives " + fm(monthly) + "/mo — " + fm((monthly-benefitAt67)*12) + "/yr more than at age 67."
        : "Claiming at " + claimAge + " permanently reduces your benefit by " + fm(benefitAt67-monthly) + "/mo." }],
      chart, []));
  }, [benefitAt67, claimAge]);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
        <Sl label="Estimated Benefit at Age 67" id="ss_b" min={500} max={4000} step={50} value={benefitAt67} onChange={setBenefitAt67} fmt={v => "$" + v + "/mo"} />
        <Sl label="Claiming Age" id="ss_age" min={62} max={70} step={1} value={claimAge} onChange={setClaimAge} fmt={v => "Age " + v} />
      </div>
      <Panel result={res} loading={null} label="Social Security" />
      <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 0, padding: '10px 14px', background: 'var(--surface2)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', lineHeight: 1.6 }}>
          🏛️ <strong>Disclaimer:</strong> This is a simplified estimate. Actual Social Security benefits depend on your full earnings history, AIME (Average Indexed Monthly Earnings), and prevailing SSA benefit formulas. For your official benefit projection, visit <strong>ssa.gov/myaccount</strong> or call SSA at 1-800-772-1213.
        </p>
    </div>
  );
}

// ── RMD Calculator ────────────────────────────────────────────────────
export function RMDForm() {
  const { fm, fmSlider } = useCurrency();
  const [balance, setBalance] = useState(500000);
  const [age, setAge] = useState(75);
  const [growthRate, setGrowthRate] = useState(6);
  const [res, setRes] = useState(null);

  const lifeTable = {73:26.5,74:25.5,75:24.6,76:23.7,77:22.9,78:22.0,79:21.1,80:20.2,81:19.4,82:18.5,83:17.7,84:16.8,85:16.0,86:15.2,87:14.4,88:13.7,89:12.9,90:12.2};

  useEffect(() => {
    const safeAge = Math.min(Math.max(age, 73), 90);
    const factor = lifeTable[safeAge] || 12.2;
    const rmd = balance / factor;
    let bal = balance;
    const chartData = [];
    for (let y = 0; y <= 10; y++) {
      const a = Math.min(age+y, 90);
      const f = lifeTable[a] || 10;
      const r = bal / f;
      chartData.push({ age: "Age " + (age+y), RMD: Math.round(r) });
      bal = (bal - r) * (1 + growthRate / 100);
    }
    const chart = { type: "bar", data: chartData, keys: ["RMD"] };
    setRes(buildResult("This Year RMD", fm(Math.round(rmd)),
      [
        { label: "Account Balance", value: fm(balance) },
        { label: "Life Expectancy Factor", value: factor + " years" },
        { label: "RMD This Year", value: fm(Math.round(rmd)), highlight: true },
        { label: "Withdrawal Rate", value: (rmd/balance*100).toFixed(2) + "%" },
      ],
      [{ type: "warn", msg: "RMD of " + fm(Math.round(rmd)) + " must be withdrawn by Dec 31. Missing an RMD incurs a 25% penalty on the undistributed amount." }],
      chart, []));
  }, [balance, age, growthRate]);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
        <Sl label="Account Balance" id="rmd_b" min={10000} max={5000000} step={10000} value={balance} onChange={setBalance} fmt={v => fmSlider(v)} />
        <Sl label="Your Age" id="rmd_age" min={73} max={90} value={age} onChange={setAge} fmt={v => "Age " + v} />
        <Sl label="Expected Growth Rate (%)" id="rmd_g" min={0} max={12} step={0.5} value={growthRate} onChange={setGrowthRate} fmt={v => v + "%"} />
      </div>
      <Panel result={res} loading={null} label="RMD Calculator" />
    </div>
  );
}

// ── Estate Tax Calculator ─────────────────────────────────────────────
export function EstateTaxForm() {
  const { fm, fmSlider } = useCurrency();
  const [grossEstate, setGrossEstate] = useState(5000000);
  const [debts, setDebts] = useState("200000");
  const [charitable, setCharitable] = useState("0");
  const [marital, setMarital] = useState("0");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const EXEMPTION = 13610000;
    const taxable = Math.max(0, grossEstate - (+debts||0) - (+charitable||0) - (+marital||0));
    const aboveExemption = Math.max(0, taxable - EXEMPTION);
    const tax = aboveExemption * 0.40;
    const effectiveRate = grossEstate > 0 ? tax/grossEstate*100 : 0;
    setRes(buildResult("Estate Tax Owed", fm(Math.round(tax)),
      [
        { label: "Gross Estate", value: fm(grossEstate) },
        { label: "Taxable Estate", value: fm(Math.round(taxable)) },
        { label: "Above Exemption", value: fm(Math.round(aboveExemption)), warn: aboveExemption > 0 },
        { label: "Effective Rate", value: effectiveRate.toFixed(2) + "%" },
      ],
      [{ type: tax > 0 ? "warn" : "tip", msg: tax > 0
        ? "Estate tax of " + fm(Math.round(tax)) + " is due. Consider trusts or gifting strategies to reduce taxable estate."
        : "Your estate is below the 2024 federal exemption of $13.61M. No federal estate tax owed." }],
      null, [
        { label: "2024 Federal Exemption", value: "$13,610,000" },
        { label: "Tax Rate Above Exemption", value: "40%" },
      ]));
  }, [grossEstate, debts, charitable, marital]);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
        <Sl label="Gross Estate Value" id="et_ge" min={100000} max={50000000} step={100000} value={grossEstate} onChange={setGrossEstate} fmt={v => fmSlider(v)} />
        <N label="Debts and Mortgages" id="et_d" value={debts} onChange={setDebts} unit="$" placeholder="0" />
        <Row2>
          <N label="Charitable Deductions" id="et_c" value={charitable} onChange={setCharitable} unit="$" placeholder="0" />
          <N label="Marital Deduction" id="et_m" value={marital} onChange={setMarital} unit="$" placeholder="0" />
        </Row2>
      </div>
      <Panel result={res} loading={null} label="Estate Tax" />
    </div>
  );
}

// ── Marriage Tax Calculator ───────────────────────────────────────────
export function MarriageTaxForm() {
  const { fm } = useCurrency();
  const [income1, setIncome1] = useState("80000");
  const [income2, setIncome2] = useState("70000");
  const [res, setRes] = useState(null);

  function calcTax2024(income, filing) {
    const single = [[11600,0.10],[47150,0.12],[100525,0.22],[191950,0.24],[243725,0.32],[609350,0.35],[Infinity,0.37]];
    const married = [[23200,0.10],[94300,0.12],[201050,0.22],[383900,0.24],[487450,0.32],[731200,0.35],[Infinity,0.37]];
    const brackets = filing === "single" ? single : married;
    let tax = 0, prev = 0;
    for (const [limit, rate] of brackets) {
      if (income <= prev) break;
      tax += (Math.min(income, limit) - prev) * rate;
      prev = limit;
    }
    return Math.round(tax);
  }

  useEffect(() => {
    const i1 = +income1||0, i2 = +income2||0;
    if (!i1) { setRes(null); return; }
    const t1 = calcTax2024(i1,"single"), t2 = calcTax2024(i2,"single");
    const totalSingle = t1 + t2;
    const marriedTax = calcTax2024(i1+i2,"married");
    const diff = marriedTax - totalSingle;
    const isBonus = diff < 0;
    setRes(buildResult(isBonus ? "Marriage Bonus" : "Marriage Penalty", fm(Math.abs(diff)),
      [
        { label: "Tax Filing Single (combined)", value: fm(totalSingle) },
        { label: "Tax Filing Jointly", value: fm(marriedTax) },
        { label: "Net Difference", value: (isBonus?"Save ":"Pay More ") + fm(Math.abs(diff)), highlight: isBonus, warn: !isBonus },
        { label: "Combined Income", value: fm(i1+i2) },
      ],
      [{ type: isBonus ? "tip" : "warn", msg: isBonus
        ? "You save " + fm(Math.abs(diff)) + " by filing jointly! Bonus typically occurs when incomes differ significantly."
        : "Filing jointly costs " + fm(diff) + " more (marriage penalty). Occurs when both spouses have similar incomes." }],
      null, [
        { label: "Person 1 Tax (Single)", value: fm(t1) },
        { label: "Person 2 Tax (Single)", value: fm(t2) },
        { label: "Joint Tax", value: fm(marriedTax) },
      ]));
  }, [income1, income2]);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
        <N label="Person 1 Annual Income" id="mt1" value={income1} onChange={setIncome1} unit="$" />
        <N label="Person 2 Annual Income" id="mt2" value={income2} onChange={setIncome2} unit="$" />
        <div style={{padding:"12px",background:"var(--surface2)",borderRadius:"var(--r-lg)",border:"1px solid var(--border)",marginTop:12,fontSize:12,color:"var(--text3)"}}>
          Based on 2024 US Federal Tax Brackets. State taxes not included.
        </div>
      </div>
      <Panel result={res} loading={null} label="Marriage Tax" />
    </div>
  );
}

// ── Boat Loan Calculator ──────────────────────────────────────────────
export function BoatLoanForm() {
  const { fm, fmSlider } = useCurrency();
  const [price, setPrice] = useState(50000);
  const [down, setDown] = useState(10000);
  const [rate, setRate] = useState(8.5);
  const [term, setTerm] = useState(120);
  const [res, setRes] = useState(null);

  useEffect(() => {
    const loan = price - down;
    const r = rate / 100 / 12, n = term;
    if (!loan||loan<=0||!r||!n) { setRes(null); return; }
    const emi = (loan*r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);
    const totalPaid = emi*n+down;
    const interest = totalPaid-price;
    const chart = { type: "donut", data: [
      { name: "Principal", value: Math.round(loan) },
      { name: "Interest", value: Math.round(interest) },
      { name: "Down Payment", value: Math.round(down) },
    ]};
    setRes(buildResult("Monthly Payment", fm(Math.round(emi)),
      [
        { label: "Loan Amount", value: fm(Math.round(loan)) },
        { label: "Total Interest", value: fm(Math.round(interest)), warn: true },
        { label: "Maintenance Est./yr", value: fm(Math.round(price*0.10)) },
        { label: "Insurance Est./yr", value: fm(Math.round(price*0.015)) },
      ],
      [{ type: "tip", msg: "Total loan cost: " + fm(Math.round(totalPaid)) + ". Budget " + fm(Math.round((price*0.10+price*0.015)/12)) + "/mo extra for ownership costs." }],
      chart, []));
  }, [price, down, rate, term]);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
        <Presets items={[
          { label: "Starter Boat", v: { p: 25000, d: 5000, r: 9, t: 84 } },
          { label: "Cruiser", v: { p: 100000, d: 20000, r: 8, t: 120 } },
          { label: "Luxury", v: { p: 500000, d: 100000, r: 7, t: 180 } },
        ]} onApply={p => { setPrice(p.v.p); setDown(p.v.d); setRate(p.v.r); setTerm(p.v.t); }} />
        <Sl label="Boat Price" id="bl_p" min={5000} max={1000000} step={5000} value={price} onChange={setPrice} fmt={v => fmSlider(v)} />
        <Sl label="Down Payment" id="bl_d" min={0} max={500000} step={1000} value={down} onChange={setDown} fmt={v => fmSlider(v)} />
        <Sl label="Interest Rate (%)" id="bl_r" min={4} max={18} step={0.25} value={rate} onChange={setRate} fmt={v => v + "%"} />
        <Sel label="Loan Term" id="bl_t" value={String(term)} onChange={v => setTerm(+v)} opts={[{v:"60",l:"5 Years"},{v:"84",l:"7 Years"},{v:"120",l:"10 Years"},{v:"180",l:"15 Years"},{v:"240",l:"20 Years"}]} />
      </div>
      <Panel result={res} loading={null} label="Boat Loan" />
    </div>
  );
}

// ── Debt Consolidation Calculator ─────────────────────────────────────
export function DebtConsolidationForm() {
  const { fm } = useCurrency();
  const [debts, setDebts] = useState([
    { name: "Credit Card", balance: "8000", rate: "22", min: "200" },
    { name: "Personal Loan", balance: "12000", rate: "14", min: "280" },
    { name: "Medical Bill", balance: "5000", rate: "8", min: "150" },
  ]);
  const [newRate, setNewRate] = useState("9");
  const [newTerm, setNewTerm] = useState("60");
  const [res, setRes] = useState(null);

  const updateDebt = (i, k, v) => setDebts(prev => prev.map((d, idx) => idx === i ? { ...d, [k]: v } : d));

  useEffect(() => {
    const totalBalance = debts.reduce((s,d)=>s+(+d.balance||0),0);
    const currentMin = debts.reduce((s,d)=>s+(+d.min||0),0);
    if (!totalBalance||!+newRate||!+newTerm) { setRes(null); return; }
    const r = +newRate/100/12, n = +newTerm;
    const newPayment = (totalBalance*r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);
    const newInterest = newPayment*n - totalBalance;
    const monthlySavings = currentMin - newPayment;
    const chart = { type: "bar", data: [
      { name: "Current Monthly", value: Math.round(currentMin) },
      { name: "Consolidated", value: Math.round(newPayment) },
    ], keys: ["value"] };
    setRes(buildResult("New Monthly Payment", fm(Math.round(newPayment)),
      [
        { label: "Total Debt", value: fm(Math.round(totalBalance)) },
        { label: "Current Monthly Total", value: fm(Math.round(currentMin)) },
        { label: "Monthly Savings", value: fm(Math.round(monthlySavings)), highlight: monthlySavings>0, warn: monthlySavings<0 },
        { label: "New Total Interest", value: fm(Math.round(newInterest)), warn: true },
      ],
      [{ type: monthlySavings > 0 ? "tip" : "warn", msg: monthlySavings > 0
        ? "Consolidation saves " + fm(Math.round(monthlySavings)) + "/mo! Ensure the " + newRate + "% rate beats your weighted average existing rate."
        : "Higher monthly payment — review if simplification justifies the extra cost." }],
      chart, debts.map(d => ({ label: d.name, value: fm(+d.balance||0) + " @ " + d.rate + "%" }))));
  }, [debts, newRate, newTerm]);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
        {debts.map((d,i) => (
          <div key={i} style={{marginBottom:10,padding:12,background:"var(--surface2)",borderRadius:"var(--r-lg)",border:"1px solid var(--border)"}}>
            <input value={d.name} onChange={e=>updateDebt(i,"name",e.target.value)} style={{fontSize:13,fontWeight:700,color:"var(--text)",background:"transparent",border:"none",outline:"none",width:"100%",marginBottom:6}} />
            <Row3>
              <N label="Balance" id={"dcb"+i} value={d.balance} onChange={v=>updateDebt(i,"balance",v)} unit="$" />
              <N label="Rate %" id={"dcr"+i} value={d.rate} onChange={v=>updateDebt(i,"rate",v)} unit="%" />
              <N label="Min Pmt" id={"dcm"+i} value={d.min} onChange={v=>updateDebt(i,"min",v)} unit="$" />
            </Row3>
          </div>
        ))}
        <button onClick={()=>setDebts(p=>[...p,{name:"New Debt",balance:"0",rate:"0",min:"0"}])}
          style={{width:"100%",padding:"8px",borderRadius:"var(--r-md)",border:"2px dashed var(--border)",background:"transparent",color:"var(--brand)",fontWeight:700,fontSize:12,cursor:"pointer",marginBottom:14}}>
          + Add Debt
        </button>
        <Row2>
          <N label="Consolidation Rate (%)" id="dc_nr" value={newRate} onChange={setNewRate} unit="%" />
          <Sel label="New Term" id="dc_nt" value={newTerm} onChange={setNewTerm} opts={[{v:"36",l:"3 Yrs"},{v:"48",l:"4 Yrs"},{v:"60",l:"5 Yrs"},{v:"84",l:"7 Yrs"},{v:"120",l:"10 Yrs"}]} />
        </Row2>
      </div>
      <Panel result={res} loading={null} label="Debt Consolidation" />
    </div>
  );
}

// ── Future Value Calculator ───────────────────────────────────────────
export function FutureValueForm() {
  const { fm, fmSlider } = useCurrency();
  const [initial, setInitial] = useState(10000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(20);
  const [res, setRes] = useState(null);

  useEffect(() => {
    const r = rate/100, rm = rate/100/12, n = years;
    const fvInitial = initial * Math.pow(1+r, n);
    const fvMonthly = monthly * ((Math.pow(1+rm, n*12)-1)/rm);
    const fv = fvInitial + fvMonthly;
    const totalContrib = initial + monthly*n*12;
    const gains = fv - totalContrib;
    const step = Math.max(1, Math.floor(n/10));
    const chartData = Array.from({length: Math.floor(n/step)+1}, (_,i) => {
      const y = i * step;
      return {
        year: "Yr " + y,
        Balance: Math.round(initial*Math.pow(1+r,y) + monthly*((Math.pow(1+rm,y*12)-1)/rm)),
        Contributed: Math.round(initial + monthly*y*12),
      };
    });
    const chart = { type: "area", data: chartData, keys: ["Balance","Contributed"] };
    setRes(buildResult("Future Value", fm(Math.round(fv)),
      [
        { label: "Total Invested", value: fm(Math.round(totalContrib)) },
        { label: "Investment Gains", value: fm(Math.round(gains)), highlight: true },
        { label: "Return on Investment", value: (gains/totalContrib*100).toFixed(1) + "%" },
        { label: "Monthly Income (4%)", value: fm(Math.round(fv*0.04/12)) },
      ],
      [{ type: "tip", msg: fm(Math.round(totalContrib)) + " invested grows to " + fm(Math.round(fv)) + " — " + fm(Math.round(gains)) + " in compound gains!" }],
      chart, []));
  }, [initial, monthly, rate, years]);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
        <Presets items={[
          { label: "Emergency Fund", v: { i: 1000, m: 300, r: 5, y: 3 } },
          { label: "House Down Payment", v: { i: 5000, m: 1000, r: 6, y: 5 } },
          { label: "Retirement", v: { i: 10000, m: 500, r: 8, y: 30 } },
        ]} onApply={p => { setInitial(p.v.i); setMonthly(p.v.m); setRate(p.v.r); setYears(p.v.y); }} />
        <Sl label="Initial Investment" id="fv_i" min={0} max={500000} step={1000} value={initial} onChange={setInitial} fmt={v => fmSlider(v)} />
        <Sl label="Monthly Contribution" id="fv_m" min={0} max={10000} step={50} value={monthly} onChange={setMonthly} fmt={v => fmSlider(v)} />
        <Sl label="Annual Return (%)" id="fv_r" min={1} max={20} step={0.5} value={rate} onChange={setRate} fmt={v => v + "%"} />
        <Sl label="Time Horizon" id="fv_y" min={1} max={50} value={years} onChange={setYears} fmt={v => v + " yrs"} />
      </div>
      <Panel result={res} loading={null} label="Future Value" />
    </div>
  );
}

// ── Average Return / CAGR Calculator ─────────────────────────────────
export function AverageReturnForm() {
  const { fm } = useCurrency();
  const [startVal, setStartVal] = useState("10000");
  const [endVal, setEndVal] = useState("25000");
  const [years, setYears] = useState("10");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const sv = +startVal, ev = +endVal, n = +years;
    if (!sv||!ev||!n||sv<=0) { setRes(null); return; }
    const cagr = (Math.pow(ev/sv, 1/n)-1)*100;
    const arith = ((ev-sv)/sv*100)/n;
    const step = Math.max(1, Math.floor(n/10));
    const chartData = Array.from({length: Math.floor(n/step)+1}, (_,i) => {
      const y = i * step;
      return {
        year: "Yr " + y,
        "At CAGR": Math.round(sv * Math.pow(1+cagr/100, y)),
        "At Arith Avg": Math.round(sv * Math.pow(1+arith/100, y)),
      };
    });
    const chart = { type: "line", data: chartData, keys: ["At CAGR","At Arith Avg"] };
    setRes(buildResult("CAGR", cagr.toFixed(2) + "%",
      [
        { label: "Start Value", value: fm(sv) },
        { label: "End Value", value: fm(ev) },
        { label: "CAGR (Geometric)", value: cagr.toFixed(2) + "%", highlight: true },
        { label: "Arithmetic Average", value: arith.toFixed(2) + "%" },
      ],
      [{ type: "tip", msg: "CAGR of " + cagr.toFixed(2) + "% vs arithmetic avg of " + arith.toFixed(2) + "%. Always use CAGR for realistic investment projections — it accounts for compounding effects." }],
      chart, []));
  }, [startVal, endVal, years]);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
        <Row2>
          <N label="Start Value" id="cr_sv" value={startVal} onChange={setStartVal} unit="$" />
          <N label="End Value" id="cr_ev" value={endVal} onChange={setEndVal} unit="$" />
        </Row2>
        <N label="Number of Years" id="cr_y" value={years} onChange={setYears} unit="yrs" />
      </div>
      <Panel result={res} loading={null} label="CAGR" />
    </div>
  );
}


// ── Amortization Calculator ───────────────────────────────────────────
export function AmortizationForm() {
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

  // ── Web Worker: off-main-thread amortization math ──────────────────────
  const { calculate, terminate } = useAmortizationWorker();

  // Terminate worker when this component unmounts to free memory
  useEffect(() => {
    return () => { terminate(); };
  }, [terminate]);

  useEffect(() => {
    // 100ms debounce — avoids thrashing the worker on every keystroke
    const timer = setTimeout(async () => {
      const extraPmt = +extra || 0;

      // Run the heavy schedule math in the Worker thread
      const data = await calculate({ P: principal, annualRate: rate, termYears: term, extraPmt });
      if (!data) { setRes(null); setSchedule([]); setYearlySchedule([]); setSummary(null); return; }

      // payoffDate arrives as ISO string from the Worker (structured clone)
      const payoffDate = new Date(data.payoffDateISO);
      const { rows, yearly, emi, totalMonths, totalInterest, originalInterest, n } = data;
      setSchedule(rows);
      setYearlySchedule(yearly);

      // If extra payment is set, run a second Worker call to get the base scenario
      let monthsSaved = 0, interestSaved = 0;
      if (extraPmt > 0) {
        const originalData = await calculate({ P: principal, annualRate: rate, termYears: term, extraPmt: 0 });
        if (originalData) {
          monthsSaved = originalData.totalMonths - totalMonths;
          interestSaved = originalData.totalInterest - totalInterest;
        }
      }
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
  }, [principal, rate, term, extra, calculate]);

  const exportCSV = (mode) => {
    let csv, filename;
    if (mode === "monthly") {
      csv = "Month,Year,Payment,Principal,Interest,Balance,Cumulative Interest\n" +
        schedule.map(r => [r.month, r.year, r.payment.toFixed(2), r.principal.toFixed(2), r.interest.toFixed(2), r.balance.toFixed(2), r.cumInterest.toFixed(2)].join(",")).join("\n");
      filename = "amortization-monthly.csv";
    } else {
      csv = "Year,Total Payment,Principal Paid,Interest Paid,Ending Balance\n" +
        yearlySchedule.map(y => [y.year, y.payment, y.principal, y.interest, y.balance].join(",")).join("\n");
      filename = "amortization-yearly.csv";
    }
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const copyCSV = () => {
    const csv = "Month,Payment,Principal,Interest,Balance\n" +
      schedule.map(r => r.month + "," + r.payment.toFixed(2) + "," + r.principal.toFixed(2) + "," + r.interest.toFixed(2) + "," + r.balance.toFixed(2)).join("\n");
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
      <div style={{display:"flex",flexDirection:"column",gap:20}}>
        <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
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

        <Panel result={res} loading={null} label="Amortization" />
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
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
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
      <Panel result={res} loading={null} label="TVM Calculator" />
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
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
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
      <Panel result={res} loading={null} label="Investment Calculator" />
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
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
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
      <Panel result={res} loading={null} label="Loan Calculator" />
    </div>
  );
}


