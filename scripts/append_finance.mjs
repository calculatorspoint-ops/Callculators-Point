import { appendFileSync } from 'fs';

const code = `

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
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
      <div className="sticky-res"><Panel result={res} loading={null} label="HELOC" /></div>
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
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
      <div className="sticky-res"><Panel result={res} loading={null} label="Auto Lease" /></div>
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
      [{ type: "tip", msg: "Bond at " + status + ". When YTM > coupon rate, bond trades at discount. Chart shows inverse price-yield relationship." }],
      chart, []));
  }, [faceValue, couponRate, ytm, years, freq]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <N label="Face Value" id="bfv" value={faceValue} onChange={setFaceValue} unit={sym} />
        <Row2>
          <N label="Coupon Rate (%)" id="bcr" value={couponRate} onChange={setCouponRate} unit="%" />
          <N label="Yield to Maturity (%)" id="bytm" value={ytm} onChange={setYtm} unit="%" />
        </Row2>
        <Row2>
          <N label="Years to Maturity" id="byr" value={years} onChange={setYears} unit="yrs" />
          <Sel label="Coupon Frequency" id="bfreq" value={freq} onChange={setFreq} opts={[{v:"1",l:"Annual"},{v:"2",l:"Semi-Annual"},{v:"4",l:"Quarterly"}]} />
        </Row2>
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Bond Price" /></div>
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Sl label="Principal" id="cdp" min={1000} max={500000} step={1000} value={principal} onChange={setPrincipal} fmt={v => fmSlider(v)} />
        <Sl label="APY (%)" id="cdapy" min={0.5} max={8} step={0.05} value={apy} onChange={setApy} fmt={v => v + "%"} />
        <Sel label="Term" id="cdterm" value={String(term)} onChange={v => setTerm(+v)} opts={[{v:"3",l:"3 Months"},{v:"6",l:"6 Months"},{v:"12",l:"12 Months"},{v:"24",l:"24 Months"},{v:"36",l:"36 Months"},{v:"60",l:"5 Years"}]} />
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="CD Calculator" /></div>
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Sl label="Annual Contribution" id="rira_c" min={500} max={7000} step={500} value={contribution} onChange={setContribution} fmt={v => fmSlider(v)} />
        <Row2>
          <N label="Current Age" id="rira_ca" value={String(currentAge)} onChange={v => setCurrentAge(+v)} unit="yrs" />
          <N label="Retirement Age" id="rira_ra" value={String(retireAge)} onChange={v => setRetireAge(+v)} unit="yrs" />
        </Row2>
        <Sl label="Expected Annual Return (%)" id="rira_r" min={1} max={15} step={0.5} value={rate} onChange={setRate} fmt={v => v + "%"} />
        <N label="Current Balance" id="rira_bal" value={currentBalance} onChange={setCurrentBalance} unit={sym} placeholder="0" />
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Roth IRA" /></div>
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <N label="Annual Payment" id="ann_pmt" value={payment} onChange={setPayment} unit={sym} />
        <Row2>
          <N label="Annual Rate (%)" id="ann_r" value={rate} onChange={setRate} unit="%" />
          <N label="Periods (Years)" id="ann_n" value={periods} onChange={setPeriods} unit="yrs" />
        </Row2>
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Annuity" /></div>
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Sl label="Years of Service" id="pen_y" min={1} max={40} value={yearsService} onChange={setYearsService} fmt={v => v + " yrs"} />
        <Sl label="Final Salary" id="pen_s" min={20000} max={500000} step={5000} value={finalSalary} onChange={setFinalSalary} fmt={v => fmSlider(v)} />
        <Sl label="Benefit Multiplier (% per year)" id="pen_m" min={1} max={3} step={0.1} value={multiplier} onChange={setMultiplier} fmt={v => v + "%/yr"} />
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Pension" /></div>
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Sl label="Estimated Benefit at Age 67" id="ss_b" min={500} max={4000} step={50} value={benefitAt67} onChange={setBenefitAt67} fmt={v => "$" + v + "/mo"} />
        <Sl label="Claiming Age" id="ss_age" min={62} max={70} step={1} value={claimAge} onChange={setClaimAge} fmt={v => "Age " + v} />
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Social Security" /></div>
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Sl label="Account Balance" id="rmd_b" min={10000} max={5000000} step={10000} value={balance} onChange={setBalance} fmt={v => fmSlider(v)} />
        <Sl label="Your Age" id="rmd_age" min={73} max={90} value={age} onChange={setAge} fmt={v => "Age " + v} />
        <Sl label="Expected Growth Rate (%)" id="rmd_g" min={0} max={12} step={0.5} value={growthRate} onChange={setGrowthRate} fmt={v => v + "%"} />
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="RMD Calculator" /></div>
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Sl label="Gross Estate Value" id="et_ge" min={100000} max={50000000} step={100000} value={grossEstate} onChange={setGrossEstate} fmt={v => fmSlider(v)} />
        <N label="Debts and Mortgages" id="et_d" value={debts} onChange={setDebts} unit="$" placeholder="0" />
        <Row2>
          <N label="Charitable Deductions" id="et_c" value={charitable} onChange={setCharitable} unit="$" placeholder="0" />
          <N label="Marital Deduction" id="et_m" value={marital} onChange={setMarital} unit="$" placeholder="0" />
        </Row2>
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Estate Tax" /></div>
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <N label="Person 1 Annual Income" id="mt1" value={income1} onChange={setIncome1} unit="$" />
        <N label="Person 2 Annual Income" id="mt2" value={income2} onChange={setIncome2} unit="$" />
        <div style={{padding:"12px",background:"var(--surface2)",borderRadius:"var(--r-lg)",border:"1px solid var(--border)",marginTop:12,fontSize:12,color:"var(--text3)"}}>
          Based on 2024 US Federal Tax Brackets. State taxes not included.
        </div>
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Marriage Tax" /></div>
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
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
      <div className="sticky-res"><Panel result={res} loading={null} label="Boat Loan" /></div>
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
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
      <div className="sticky-res"><Panel result={res} loading={null} label="Debt Consolidation" /></div>
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
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
      <div className="sticky-res"><Panel result={res} loading={null} label="Future Value" /></div>
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Row2>
          <N label="Start Value" id="cr_sv" value={startVal} onChange={setStartVal} unit="$" />
          <N label="End Value" id="cr_ev" value={endVal} onChange={setEndVal} unit="$" />
        </Row2>
        <N label="Number of Years" id="cr_y" value={years} onChange={setYears} unit="yrs" />
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="CAGR" /></div>
    </div>
  );
}
`;

appendFileSync('src/components/calculator-core/forms/FinanceFormsNew.jsx', code, 'utf8');
console.log('Done! Appended 15 new finance calculator forms.');
