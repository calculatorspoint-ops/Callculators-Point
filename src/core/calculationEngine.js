// ═══════════════════════════════════════════════════════════════════════
// Calculators Point CORE ENGINE v2.0
// Pure functions — testable, no side effects
// ═══════════════════════════════════════════════════════════════════════
import Decimal from "decimal.js";
import { Parser } from "expr-eval";

// ── Formatters ────────────────────────────────────────────────────────
export const round  = (n, dp = 2) => Math.round(n * 10 ** dp) / 10 ** dp;
export const fmt    = (n, dp = 0) => Number(round(n, dp)).toLocaleString();
export const fmtC   = (n, sym = "") => {
  if (!isFinite(n)) return sym + "0";
  const abs = Math.abs(n), sign = n < 0 ? "-" : "";
  if (abs >= 1_000_000_000) return `${sign}${sym}${round(abs/1_000_000_000, 2)}B`;
  if (abs >= 1_000_000)     return `${sign}${sym}${round(abs/1_000_000, 2)}M`;
  if (abs >= 1_000)         return `${sign}${sym}${Math.round(abs).toLocaleString()}`;
  return `${sign}${sym}${round(abs, 2)}`;
};
export const pct    = (n, dp = 1) => round(n, dp) + "%";
export const clamp  = (n, min, max) => Math.min(Math.max(n, min), max);

// ── EMI / Loan Engine ─────────────────────────────────────────────────
export function calcEMI({ principal, interestRate, tenure, extraPayment = 0, compareRate = null, balloonPayment = 0, interestOnly = false }) {
  const P_val = +principal || 0;
  const r_val = (+interestRate || 0) / 1200;
  const n_val = (+tenure || 1) * 12;
  const ex_val = +extraPayment || 0;
  const B_val = +balloonPayment || 0;
  if (!P_val || !n_val) return null;

  const P = new Decimal(P_val);
  const r = new Decimal(r_val);
  const n = new Decimal(n_val);
  const ex = new Decimal(ex_val);
  const B = new Decimal(B_val);

  let emiDec;
  if (r.isZero()) {
    emiDec = interestOnly ? new Decimal(0) : P.minus(B).dividedBy(n);
  } else if (interestOnly) {
    emiDec = P.times(r);
  } else {
    const onePlusRToN = new Decimal(1).plus(r).pow(n);
    const pvOfBalloon = B.dividedBy(onePlusRToN);
    const adjustedP = P.minus(pvOfBalloon);
    emiDec = adjustedP.times(r).times(onePlusRToN).dividedBy(onePlusRToN.minus(1));
  }

  const emi = emiDec.toNumber();

  const schedule = [];
  const fullSchedule = [];
  let bal = P;
  let cumP = new Decimal(0);
  let cumI = new Decimal(0);
  let actualMonths = n_val;

  for (let i = 1; i <= n_val; i++) {
    const ip = bal.times(r);
    let maxPP;
    if (interestOnly) {
      maxPP = ex; 
    } else {
      maxPP = emiDec.plus(ex).minus(ip);
    }
    
    let pp = Decimal.max(0, Decimal.min(maxPP, bal));
    
    if (i === n_val && !interestOnly) {
      pp = bal; 
    } else if (i === n_val && interestOnly) {
      pp = bal; 
    }

    bal = Decimal.max(0, bal.minus(pp));
    cumP = cumP.plus(pp);
    cumI = cumI.plus(ip);
    
    const emiPayment = ip.plus(pp);
    
    fullSchedule.push({ 
      month: i, 
      principal: round(pp.toNumber()), 
      interest: round(ip.toNumber()), 
      balance: round(bal.toNumber()), 
      emi: round(emiPayment.toNumber()) 
    });
    
    const step = Math.max(1, Math.floor(n_val / 24));
    if (i % step === 0 || i === n_val || bal.isZero()) {
      schedule.push({ month: `M${i}`, principal: round(cumP.toNumber()), interest: round(cumI.toNumber()), balance: round(bal.toNumber()), emi: round(emiPayment.toNumber()) });
    }
    if (bal.isZero() && ex_val > 0 && i < n_val) { actualMonths = i; break; }
  }

  const total = cumP.plus(cumI).toNumber();
  const interest = cumI.toNumber();
  let savedInterest = 0;

  if (ex_val > 0) {
    let baselineBalance = P;
    let baselineInterest = new Decimal(0);

    for (let i = 1; i <= n_val; i++) {
      const interestPayment = baselineBalance.times(r);
      let principalPayment = interestOnly
        ? new Decimal(0)
        : Decimal.max(0, Decimal.min(emiDec.minus(interestPayment), baselineBalance));

      if (i === n_val) principalPayment = baselineBalance;

      baselineBalance = Decimal.max(0, baselineBalance.minus(principalPayment));
      baselineInterest = baselineInterest.plus(interestPayment);
      if (baselineBalance.isZero()) break;
    }

    savedInterest = Decimal.max(0, baselineInterest.minus(cumI)).toNumber();
  }

  let compareResult = null;
  if (compareRate && +compareRate !== +interestRate) {
    const r2 = new Decimal(+compareRate).dividedBy(1200);
    const onePlusR2ToN = new Decimal(1).plus(r2).pow(n);
    let emi2Dec;
    if (r2.isZero()) {
      emi2Dec = interestOnly ? new Decimal(0) : P.minus(B).dividedBy(n);
    } else if (interestOnly) {
      emi2Dec = P.times(r2);
    } else {
      const pvB2 = B.dividedBy(onePlusR2ToN);
      emi2Dec = P.minus(pvB2).times(r2).times(onePlusR2ToN).dividedBy(onePlusR2ToN.minus(1));
    }
    const emi2 = emi2Dec.toNumber();
    const total2 = interestOnly ? (emi2 * n_val + P_val) : (emi2 * n_val + B_val);
    compareResult = { rate: +compareRate, emi: round(emi2), total: round(total2), interest: round(total2 - P_val) };
  }

  const affordEMI40 = round(emi * 100 / 40);
  const affordEMI50 = round(emi * 100 / 50);

  return {
    emi: round(emi), total: round(total), interest: round(interest),
    interestRatio: round(interest/total*100, 1),
    principalRatio: round(P_val/total*100, 1),
    actualMonths, savedMonths: n_val - actualMonths,
    savedInterest: round(savedInterest),
    schedule, fullSchedule, compareResult,
    affordIncome40: affordEMI40, affordIncome50: affordEMI50,
    breakdowns: [
      { label: "Principal (P)",         value: fmtC(P_val) },
      { label: "Monthly Rate (r)",      value: round(+interestRate/12, 4) + "%" },
      { label: "Payments (n)",          value: n_val + " months" },
      ...(interestOnly ? [{ label: "Mode", value: "Interest-Only", bold: true }] : []),
      ...(B_val > 0 ? [{ label: "Balloon Payment", value: fmtC(B_val), bold: true }] : []),
      { label: interestOnly ? "Interest EMI" : "Calculated EMI", value: fmtC(emi), bold: true },
      { label: "Total Payable",         value: fmtC(total), bold: true },
      { label: "Total Interest",        value: fmtC(interest) },
      { label: "Interest % of Total",   value: round(interest/total*100,1) + "%" },
      ...(ex_val > 0 ? [{ label: "Interest saved with extra payment", value: fmtC(savedInterest), bold: true }] : []),
    ],
    insights: [
      interest/P_val > 0.5 && { type:"warn", msg:`You'll pay ${round(interest/P_val*100,0)}% extra as interest. Consider shorter tenure.` },
      ex_val > 0 && { type:"good", msg:`Extra ${fmtC(ex_val)}/month saves ${fmtC(savedInterest)} in interest based on the amortization schedule.` },
      +interestRate > 15 && { type:"bad",  msg:`${interestRate}% is very high. Try to negotiate or refinance.` },
      +interestRate < 9  && { type:"good", msg:`Great rate! This is below market average.` },
      interestOnly && { type:"warn", msg:`Interest-only: Entire principal ${fmtC(P_val)} is due at the end of the term.` },
    ].filter(Boolean),
  };
}

// ── Compound Interest ─────────────────────────────────────────────────
export function calcCompound({ principal, rate, years, frequency="12", contribution=0, inflationRate=0, taxRate=0 }) {
  const P_val = +principal||0, r_val = (+rate||0)/100, y_val = +years||1;
  const n_val = +frequency||12, c_val = +contribution||0;
  const inf_val = (+inflationRate||0)/100, tax_val = (+taxRate||0)/100;
  if (!P_val) return null;

  const P = new Decimal(P_val);
  const r = new Decimal(r_val);
  const n = new Decimal(n_val);
  const c = new Decimal(c_val);

  const pts = [];
  const onePlusRByN = new Decimal(1).plus(r.dividedBy(n));
  const monthlyGrowth = onePlusRByN.pow(n.dividedBy(12));
  const monthlyRate = monthlyGrowth.minus(1);

  for (let yr = 0; yr <= y_val; yr++) {
    const ny = n.times(yr);
    const pGrowth = P.times(onePlusRByN.pow(ny));
    
    let cGrowth = new Decimal(0);
    if (!c.isZero()) {
      if (r.isZero()) {
        cGrowth = c.times(12).times(yr);
      } else {
        const months = new Decimal(yr * 12);
        cGrowth = c.times(monthlyGrowth.pow(months).minus(1)).dividedBy(monthlyRate);
      }
    }
    
    const nominalDec = pGrowth.plus(cGrowth);
    const investedDec = P.plus(c.times(12).times(yr));
    const gainsDec = nominalDec.minus(investedDec);
    const afterTaxDec = investedDec.plus(gainsDec.times(new Decimal(1).minus(tax_val)));
    
    let realDec = afterTaxDec;
    if (inf_val > 0) {
      realDec = afterTaxDec.dividedBy(new Decimal(1).plus(inf_val).pow(yr));
    }
    
    pts.push({ 
      year:`Y${yr}`, 
      nominal: round(nominalDec.toNumber()), 
      invested: round(investedDec.toNumber()), 
      real: round(realDec.toNumber()), 
      afterTax: round(afterTaxDec.toNumber()) 
    });
  }

  const final = pts[y_val].nominal;
  const invested = P_val + c_val*12*y_val;
  const gains = final - invested;
  const afterTax = pts[y_val].afterTax;
  const real  = pts[y_val].real;
  const mult  = round(final/P_val, 2);

  // Goal seeking: how much to invest to reach a target?
  const goalSeek = (target) => {
    if (!target || !r_val) return null;
    const tgt = new Decimal(target);
    const ny = n.times(y_val);
    const pGrowth = P.times(onePlusRByN.pow(ny));
    const months = new Decimal(y_val * 12);

    const neededDec = tgt.minus(pGrowth).dividedBy(
      r_val > 0 ? monthlyGrowth.pow(months).minus(1).dividedBy(monthlyRate) : new Decimal(12 * y_val)
    );
    return Math.max(0, round(neededDec.toNumber()));
  };

  return {
    final: round(final), invested: round(invested), gains: round(gains),
    afterTax: round(afterTax), real: round(real), mult,
    realReturn: round((real/P_val-1)*100, 1),
    pts, goalSeek,
    breakdowns: [
      { label:"Principal",          value:fmtC(P_val) },
      { label:"Monthly Contribution",value:fmtC(c_val) },
      { label:"Annual Rate",        value:rate+"%" },
      { label:"Compounding",        value:{1:"Annually",4:"Quarterly",12:"Monthly",365:"Daily"}[frequency]||"Monthly" },
      { label:"Duration",           value:y_val+" years" },
      { label:"Total Invested",     value:fmtC(invested) },
      { label:"Interest Earned",    value:fmtC(gains), bold:true },
      ...(tax_val>0?[{ label:"After Tax ("+taxRate+"%)", value:fmtC(afterTax), bold:true }]:[]),
      ...(inf_val>0?[{ label:"Real Value (inflation-adj)", value:fmtC(real), bold:true }]:[]),
      { label:"Final Amount",       value:fmtC(final), bold:true },
      { label:"Wealth Multiplier",  value:mult+"×" },
    ],
    insights: [
      { type:"good", msg:`${fmtC(P_val)} grows to ${fmtC(final)} — a ${mult}× return in ${y_val} years!` },
      inf_val>0 && { type:"info", msg:`Inflation-adjusted real value: ${fmtC(real)} (${inflationRate}% annual inflation)` },
      tax_val>0 && { type:"warn", msg:`After ${taxRate}% tax on gains: ${fmtC(afterTax)}` },
      r_val>0.18 && { type:"warn", msg:"Returns above 18% are optimistic. Plan at 10-12% for realism." },
    ].filter(Boolean),
  };
}

// ── SIP Engine ────────────────────────────────────────────────────────
export function calcSIP({ monthlyAmount, annualReturn, duration, stepUp=0 }) {
  const m_val = +monthlyAmount||0, r_val = (+annualReturn||0)/1200, y_val = +duration||1, su_val = (+stepUp||0)/100;
  const n_val = y_val * 12;
  if (!m_val) return null;

  const m = new Decimal(m_val);
  const r = new Decimal(r_val);
  const n = new Decimal(n_val);
  const su = new Decimal(su_val);

  // Regular SIP
  let fvRegularDec, invRegularDec;
  if (r.isZero()) {
    fvRegularDec = m.times(n);
    invRegularDec = m.times(n);
  } else {
    const onePlusR = new Decimal(1).plus(r);
    const onePlusRToN = onePlusR.pow(n);
    fvRegularDec = m.times(onePlusRToN.minus(1)).dividedBy(r).times(onePlusR);
    invRegularDec = m.times(n);
  }

  const fvRegular = fvRegularDec.toNumber();
  const invRegular = invRegularDec.toNumber();

  // Step-up SIP (annual increase)
  let fvStepUp = new Decimal(0);
  let invStepUp = new Decimal(0);
  let monthlyNow = m;
  const stepPts = [];
  
  for (let yr = 1; yr <= y_val; yr++) {
    if (yr > 1) monthlyNow = monthlyNow.times(new Decimal(1).plus(su));
    let fvYearEnd;
    if (r.isZero()) {
      fvYearEnd = monthlyNow.times(12);
    } else {
      const months = new Decimal(12);
      const onePlusRTo12 = new Decimal(1).plus(r).pow(months);
      const fvYear = monthlyNow.times(onePlusRTo12.minus(1)).dividedBy(r).times(new Decimal(1).plus(r));
      const remMonths = new Decimal((y_val - yr) * 12);
      fvYearEnd = fvYear.times(new Decimal(1).plus(r).pow(remMonths));
    }
    
    fvStepUp = fvStepUp.plus(fvYearEnd);
    invStepUp = invStepUp.plus(monthlyNow.times(12));
    stepPts.push({ year:`Y${yr}`, corpus:round(fvStepUp.toNumber()), invested:round(invStepUp.toNumber()), monthly:round(monthlyNow.toNumber()) });
  }

  const fvStepUpNum = fvStepUp.toNumber();
  const invStepUpNum = invStepUp.toNumber();

  // 3 scenarios
  const scenarios = [
    { label:"🐻 Worst (6%)",  r:6/1200, color:"#ef4444" },
    { label:"📊 Average (12%)",r:r_val, color:"#f59e0b" },
    { label:"🚀 Best (18%)",  r:18/1200,color:"#22c55e" },
  ].map(s => {
    const s_r = new Decimal(s.r);
    const fv = s_r.isZero() ? m.times(n).toNumber() : m.times(new Decimal(1).plus(s_r).pow(n).minus(1)).dividedBy(s_r).times(new Decimal(1).plus(s_r)).toNumber();
    return { ...s, fv:round(fv), gains:round(fv-invRegular) };
  });

  const pts = Array.from({length:y_val+1},(_,i) => {
    const months = new Decimal(i*12);
    let corpus = 0;
    if (i > 0) {
      corpus = r.isZero() ? m.times(months).toNumber() : m.times(new Decimal(1).plus(r).pow(months).minus(1)).dividedBy(r).times(new Decimal(1).plus(r)).toNumber();
    }
    return { year:`Y${i}`, corpus:round(corpus), invested:round(m_val*i*12) };
  });

  // XIRR approximation
  const xirr = round((Math.pow(fvRegular/invRegular, 1/y_val)-1)*100, 2);

  return {
    corpus:round(fvRegular), invested:round(invRegular), gains:round(fvRegular-invRegular),
    returnPct:round((fvRegular-invRegular)/invRegular*100, 1), xirr,
    stepUpCorpus:round(fvStepUpNum), stepUpInvested:round(invStepUpNum),
    pts, stepPts, scenarios,
    breakdowns:[
      {label:"Monthly SIP",       value:fmtC(m_val)},
      {label:"Annual Return",     value:annualReturn+"%"},
      {label:"Duration",          value:y_val+" years"},
      ...(su_val>0?[{label:"Annual Step-up",value:stepUp+"%"}]:[]),
      {label:"Total Invested",    value:fmtC(invRegular)},
      {label:"Est. XIRR",         value:xirr+"%"},
      {label:"Gains",             value:fmtC(fvRegular-invRegular),bold:true},
      {label:"Final Corpus",      value:fmtC(fvRegular),bold:true},
      ...(su_val>0?[{label:"With Step-up",value:fmtC(fvStepUpNum),bold:true}]:[]),
    ],
    insights:[
      {type:"good",msg:`${fmtC(m_val)}/month for ${y_val}yr → ${fmtC(fvRegular)} (${round((fvRegular-invRegular)/invRegular*100,0)}% total return)`},
      su_val>0 && {type:"good",msg:`Step-up SIP grows to ${fmtC(fvStepUpNum)} — ${fmtC(fvStepUpNum-fvRegular)} more than regular SIP!`},
      r_val*1200>18 && {type:"warn",msg:"Equity funds historically return 12-15%. 18%+ is optimistic."},
    ].filter(Boolean),
  };
}

// ── BMI Engine ────────────────────────────────────────────────────────
export function calcBMI({ weight, height, gender, age=30, unit="metric" }) {
  let wKg = +weight, hM = +height/100;
  if (unit === "imperial") { wKg = wKg*0.453592; hM = hM*0.3048; }
  if (!wKg || !hM) return null;

  const bmi = round(wKg/(hM*hM), 1);
  const CATS = [
    {max:16,   label:"Severely Underweight",color:"#1e40af",risk:"Very High",tip:"Immediate medical attention needed. Consult a doctor."},
    {max:18.5, label:"Underweight",         color:"#3b82f6",risk:"High",    tip:"Consider a nutrition plan to gain healthy weight."},
    {max:25,   label:"Normal Weight",       color:"#22c55e",risk:"Low",     tip:"Great! Maintain with balanced diet and regular exercise."},
    {max:30,   label:"Overweight",          color:"#f59e0b",risk:"Moderate",tip:"Light exercise and dietary changes can help."},
    {max:35,   label:"Obese Class I",       color:"#f97316",risk:"High",    tip:"Structured weight loss program recommended."},
    {max:40,   label:"Obese Class II",      color:"#ef4444",risk:"Very High",tip:"Medical supervision strongly advised."},
    {max:Infinity,label:"Obese Class III",  color:"#991b1b",risk:"Extreme", tip:"Immediate medical intervention recommended."},
  ];
  const cat = CATS.find(c => bmi < c.max);
  const idealMin = round(18.5*hM*hM, 1);
  const idealMax = round(24.9*hM*hM, 1);
  const toIdeal   = bmi > 25 ? round(wKg - idealMax, 1) : bmi < 18.5 ? round(idealMin - wKg, 1) : 0;
  const gauge     = clamp((bmi-10)/35*100, 2, 98);

  // Approx body fat (Deurenberg formula) — uses actual age
  const ageVal = clamp(+age || 30, 10, 100);
  const bfPct = round(1.2*bmi + 0.23*ageVal - 10.8*(gender==="male"?1:0) - 5.4, 1);

  return {
    bmi, category:cat.label, risk:cat.risk, color:cat.color,
    idealMin, idealMax, toIdeal, gauge, bfPct,
    breakdowns:[
      {label:"Weight",       value:wKg+"kg"},
      {label:"Height",       value:hM*100+"cm"},
      {label:"Formula",      value:"kg/m²"},
      {label:"BMI",          value:bmi.toString(),bold:true},
      {label:"Category",     value:cat.label,bold:true},
      {label:"Health Risk",  value:cat.risk},
      {label:"Ideal Weight", value:idealMin+"–"+idealMax+" kg"},
      ...(toIdeal>0?[{label:bmi>25?"Weight to lose":"Weight to gain",value:toIdeal+" kg",bold:true}]:[]),
    ],
    insights:[
      {type:cat.label==="Normal Weight"?"good":"warn",msg:cat.tip},
      {type:"info",msg:`Ideal weight for your height: ${idealMin}–${idealMax} kg`},
      toIdeal>0&&{type:bmi>25?"bad":"info",msg:`${bmi>25?"Lose":"Gain"} approx ${Math.abs(toIdeal)} kg to reach normal range`},
    ].filter(Boolean),
  };
}

// ── Calorie / TDEE Engine ─────────────────────────────────────────────
export function calcCalorie({ weight, height, age, gender, activityLevel, goal="maintain", formula="mifflin" }) {
  const w=+weight,h=+height,a=+age;
  if(!w||!h||!a) return null;

  // Mifflin-St Jeor
  const bmrMifflin = gender==="male" ? 10*w+6.25*h-5*a+5 : 10*w+6.25*h-5*a-161;
  // Harris-Benedict
  const bmrHarris  = gender==="male" ? 88.362+13.397*w+4.799*h-5.677*a : 447.593+9.247*w+3.098*h-4.330*a;
  const bmr = formula==="harris" ? bmrHarris : bmrMifflin;

  const MULT={sedentary:1.2,light:1.375,moderate:1.55,active:1.725,veryActive:1.9};
  const mult=MULT[activityLevel]||1.55;
  const tdee=round(bmr*mult);

  const goals={
    loseFast:   {cal:round(tdee-1000),label:"Lose Fast (−1kg/wk)",   color:"#dc2626"},
    lose:       {cal:round(tdee-500), label:"Lose (−0.5kg/wk)",       color:"#ef4444"},
    maintain:   {cal:tdee,            label:"Maintain",                color:"#16a34a"},
    lean:       {cal:round(tdee+200), label:"Lean Bulk (+200kcal)",    color:"#3b82f6"},
    bulk:       {cal:round(tdee+500), label:"Bulk (+500kcal)",         color:"#6366f1"},
  };

  const macros=(cal)=>({
    protein:round(cal*0.30/4),
    carbs:  round(cal*0.40/4),
    fat:    round(cal*0.30/9),
  });

  const goalCal = goals[goal]?.cal || tdee;
  const mac     = macros(goalCal);
  const weekPts = Array.from({length:13},(_,i)=>({week:`W${i}`,weight:round(w-(goalCal<tdee?(tdee-goalCal)*i*7/7700:-(goalCal-tdee)*i*7/7700),1)}));

  return {
    bmr:round(bmr), tdee, goalCal,
    bmrMifflin:round(bmrMifflin), bmrHarris:round(bmrHarris),
    goals:Object.values(goals), macros:mac, weekPts,
    breakdowns:[
      {label:"Weight",        value:w+"kg"},
      {label:"Height",        value:h+"cm"},
      {label:"Age",           value:a+" years"},
      {label:"Gender",        value:gender},
      {label:"Formula",       value:formula==="harris"?"Harris-Benedict":"Mifflin-St Jeor"},
      {label:"BMR",           value:round(bmr)+" kcal",bold:true},
      {label:"Activity Mult", value:mult+"×"},
      {label:"TDEE",          value:tdee+" kcal",bold:true},
      {label:"Goal Calories", value:goalCal+" kcal",bold:true},
      {label:"Protein",       value:mac.protein+"g"},
      {label:"Carbs",         value:mac.carbs+"g"},
      {label:"Fat",           value:mac.fat+"g"},
    ],
    insights:[
      {type:"info",msg:`Your BMR is ${round(bmr)} kcal — calories burned at complete rest.`},
      {type:"good",msg:`TDEE = ${tdee} kcal · Goal = ${goalCal} kcal/day`},
      goalCal<tdee && {type:"info",msg:`At ${goalCal} kcal, expect ~${round((tdee-goalCal)*7/7700,2)}kg/week loss.`},
      goalCal>tdee && {type:"info",msg:`At ${goalCal} kcal, expect ~${round((goalCal-tdee)*7/7700,2)}kg/week gain.`},
    ].filter(Boolean),
  };
}

// ── Salary Engine ─────────────────────────────────────────────────────
export function calcSalary({ amount, period, region="global", taxSlab="pk2024", allowances=0, deductions=0 }) {
  const v = +amount||0;
  if (!v) return null;
  const annual={hourly:v*2080,daily:v*260,weekly:v*52,monthly:v*12,annual:v}[period]||v*12;

  let annualTax;
  let regionLabel = "Global (Flat 10% est.)";

  if (region === "pk" || taxSlab.startsWith("pk")) {
    // Pakistan FBR 2024-25 tax slabs
    const PK_SLABS=[
      {min:0,       max:600000,   rate:0,     fixed:0},
      {min:600000,  max:1200000,  rate:0.05,  fixed:0},
      {min:1200000, max:2400000,  rate:0.15,  fixed:30000},
      {min:2400000, max:3600000,  rate:0.25,  fixed:210000},
      {min:3600000, max:6000000,  rate:0.30,  fixed:510000},
      {min:6000000, max:Infinity, rate:0.35,  fixed:1230000},
    ];
    const slab = PK_SLABS.find(s=>annual>=s.min&&annual<s.max)||PK_SLABS[0];
    annualTax = slab.fixed + (annual - slab.min) * slab.rate;
    regionLabel = "Pakistan FBR 2024-25";
  } else {
    // Global generic flat tax approximation
    annualTax = annual * 0.10; 
  }

  const monthlyTax = round(annualTax/12);
  const allw = +allowances||0, dedu = +deductions||0;
  const netMonthly = round(annual/12 + allw - annualTax/12 - dedu);
  const effRate    = annual > 0 ? round(annualTax/annual*100, 2) : 0;

  return {
    annual:round(annual), monthly:round(annual/12), weekly:round(annual/52),
    daily:round(annual/260), hourly:round(annual/2080),
    annualTax:round(annualTax), monthlyTax, effRate,
    netMonthly, grossMonthly:round(annual/12),
    savingsRate:netMonthly>0?round((netMonthly-dedu)/netMonthly*100,1):0,
    breakdowns:[
      {label:"Annual Gross",    value:fmtC(annual)},
      {label:"Monthly Gross",   value:fmtC(annual/12)},
      {label:"Annual Tax",      value:fmtC(annualTax)},
      {label:"Monthly Tax",     value:fmtC(monthlyTax)},
      {label:"Effective Rate",  value:effRate+"%"},
      ...(allw?[{label:"Monthly Allowances",value:fmtC(allw)}]:[]),
      ...(dedu?[{label:"Monthly Deductions", value:fmtC(dedu)}]:[]),
      {label:"Net Monthly",     value:fmtC(netMonthly),bold:true},
    ],
    insights:[
      {type:"info",msg:`Effective tax rate: ${effRate}% (${regionLabel})`},
      netMonthly>0&&{type:"good",msg:`Take-home: ${fmtC(netMonthly)}/month after tax & deductions`},
    ].filter(Boolean),
  };
}

// ── Percentage Engine ─────────────────────────────────────────────────
export function calcPercentage({ x, y }) {
  const xv=+x||0, yv=+y||0;
  return {
    results:[
      {q:`What is ${x}% of ${y}?`,           a:round(xv/100*yv,4)},
      {q:`${x} is what % of ${y}?`,          a:xv&&yv?round(xv/yv*100,4):0, unit:"%"},
      {q:`% change from ${x} to ${y}?`,      a:xv?round((yv-xv)/xv*100,4):0, unit:"%", signed:true},
      {q:`${y}% of ${x}?`,                   a:round(yv/100*xv,4)},
      {q:`${x} increased by ${y}%?`,         a:round(xv*(1+yv/100),4)},
      {q:`${x} decreased by ${y}%?`,         a:round(xv*(1-yv/100),4)},
    ],
    insights:[{type:"info",msg:"All 6 percentage modes calculated simultaneously."}],
    steps: [
      {title:"1. What is X% of Y?", desc:`(${xv} / 100) * ${yv} = ${round(xv/100*yv,4)}`},
      {title:"2. X is what % of Y?", desc:`(${xv} / ${yv}) * 100 = ${xv&&yv?round(xv/yv*100,4):0}%`},
      {title:"3. % change from X to Y", desc:`((${yv} - ${xv}) / ${xv}) * 100 = ${xv?round((yv-xv)/xv*100,4):0}%`},
      {title:"4. Y% of X", desc:`(${yv} / 100) * ${xv} = ${round(yv/100*xv,4)}`},
      {title:"5. X increased by Y%", desc:`${xv} + (${yv}% of ${xv}) = ${round(xv*(1+yv/100),4)}`},
      {title:"6. X decreased by Y%", desc:`${xv} - (${yv}% of ${xv}) = ${round(xv*(1-yv/100),4)}`}
    ]
  };
}

// ── Discount Engine ───────────────────────────────────────────────────
export function calcDiscount({ originalPrice, discountPct, taxRate=0, extraDiscount=0 }) {
  const P=+originalPrice||0, D=+discountPct||0, T=+taxRate||0, E=+extraDiscount||0;
  if(!P) return null;
  const d1=P*D/100, afterD1=P-d1;
  const d2=afterD1*E/100, afterD2=afterD1-d2;
  const taxAmt=afterD2*T/100;
  const final=round(afterD2+taxAmt);
  const totalSaved=round(P-afterD2);

  return {
    original:P, discountAmt:round(d1), salePrice:round(afterD1),
    extraDiscountAmt:round(d2), priceAfterBothDiscounts:round(afterD2),
    taxAmount:round(taxAmt), final, totalSaved,
    savingsPct:round(totalSaved/P*100,1),
    breakdowns:[
      {label:"Original Price",      value:fmtC(P)},
      {label:`Discount (${D}%)`,    value:"−"+fmtC(d1)},
      {label:"After Discount",      value:fmtC(afterD1)},
      ...(E?[{label:`Extra Discount (${E}%)`,value:"−"+fmtC(d2)},{label:"After Both",value:fmtC(afterD2)}]:[]),
      ...(T?[{label:`Tax (${T}%)`,  value:"+"+fmtC(taxAmt)}]:[]),
      {label:"Final Price",         value:fmtC(final),bold:true},
      {label:"Total Saved",         value:fmtC(totalSaved),bold:true},
    ],
    insights:[
      {type:"good",msg:`Save ${fmtC(totalSaved)} (${round(totalSaved/P*100,1)}% off)!`},
      D+E>50&&{type:"info",msg:"Great deal! Over 50% total discount."},
    ].filter(Boolean),
  };
}

// ── Profit Margin Engine ──────────────────────────────────────────────
export function calcProfitMargin({ cost, price, units=1, fixedCosts=0 }) {
  const c=+cost||0, p=+price||0, u=+units||1, fc=+fixedCosts||0;
  if(!c||!p) return null;
  const profit=p-c, margin=round(profit/p*100,2), markup=round(profit/c*100,2);
  const revenueTotal=round(p*u), costTotal=round(c*u+fc);
  const profitTotal=round(revenueTotal-costTotal);
  const breakEvenUnits=fc>0?Math.ceil(fc/profit):0;
  const health=margin>=50?"Excellent":margin>=30?"Healthy":margin>=15?"Acceptable":"Thin";
  const healthColor=margin>=50?"#16a34a":margin>=30?"#22c55e":margin>=15?"#f59e0b":"#ef4444";

  return {
    profit:round(profit), margin, markup, health, healthColor,
    revenueTotal, costTotal, profitTotal, breakEvenUnits,
    targetPrice:(targetMargin)=>round(c/(1-targetMargin/100)),
    breakdowns:[
      {label:"Cost Price",      value:fmtC(c)},
      {label:"Selling Price",   value:fmtC(p)},
      {label:"Profit/Unit",     value:fmtC(profit),bold:true},
      {label:"Gross Margin",    value:margin+"%",bold:true},
      {label:"Markup",          value:markup+"%"},
      {label:"Margin Health",   value:health},
      ...(u>1?[{label:"Units",value:u+""},{label:"Total Revenue",value:fmtC(revenueTotal)},{label:"Total Profit",value:fmtC(profitTotal),bold:true}]:[]),
      ...(fc>0?[{label:"Fixed Costs",value:fmtC(fc)},{label:"Break-even Units",value:breakEvenUnits+""}]:[]),
    ],
    insights:[
      {type:margin>=30?"good":margin>=15?"warn":"bad",msg:`Margin is ${health} at ${margin}%. ${margin<15?"Consider raising prices or cutting costs.":margin>=50?"Excellent profitability!":""}`},
      fc>0&&breakEvenUnits>0&&{type:"info",msg:`You need to sell ${breakEvenUnits} units to cover fixed costs.`},
    ].filter(Boolean),
  };
}

// ── Age Engine ────────────────────────────────────────────────────────
export function calcAge({ dob, targetDate=null }) {
  const d=new Date(dob), now=targetDate?new Date(targetDate):new Date();
  if(!dob||d>now) return null;
  let y=now.getFullYear()-d.getFullYear(), m=now.getMonth()-d.getMonth(), days=now.getDate()-d.getDate();
  if(days<0){m--;days+=new Date(now.getFullYear(),now.getMonth(),0).getDate();}
  if(m<0){y--;m+=12;}
  const totalDays=Math.floor((now-d)/86400000);
  const nextBday=new Date(now.getFullYear(),d.getMonth(),d.getDate());
  if(nextBday<=now) nextBday.setFullYear(now.getFullYear()+1);
  const daysToNext=Math.ceil((nextBday-now)/86400000);
  const ZODIAC=[{s:"Capricorn",e:20},{s:"Aquarius",e:50},{s:"Pisces",e:80},{s:"Aries",e:110},{s:"Taurus",e:141},{s:"Gemini",e:172},{s:"Cancer",e:203},{s:"Leo",e:234},{s:"Virgo",e:266},{s:"Libra",e:296},{s:"Scorpio",e:326},{s:"Sagittarius",e:357},{s:"Capricorn",e:366}];
  const doy=Math.floor((d-new Date(d.getFullYear(),0,0))/86400000);
  const zodiac=ZODIAC.find(z=>doy<=z.e)?.s||"Capricorn";

  return {
    years:y, months:m, days, totalDays, totalWeeks:Math.floor(totalDays/7),
    totalHours:totalDays*24, daysToNextBirthday:daysToNext, zodiac,
    breakdowns:[
      {label:"Date of Birth",    value:d.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})},
      {label:"Age",              value:`${y} years, ${m} months, ${days} days`,bold:true},
      {label:"Total Days",       value:totalDays.toLocaleString()},
      {label:"Total Weeks",      value:Math.floor(totalDays/7).toLocaleString()},
      {label:"Total Hours",      value:(totalDays*24).toLocaleString()},
      {label:"Next Birthday",    value:`In ${daysToNext} days`},
      {label:"Zodiac Sign",      value:zodiac},
    ],
    insights:[
      {type:"good",msg:`You have lived ${totalDays.toLocaleString()} days. Next birthday in ${daysToNext} days! 🎂`},
      {type:"info",msg:`Zodiac sign: ${zodiac}`},
    ],
  };
}

// ── Password Engine ───────────────────────────────────────────────────
export function calcPassword({ length, upper, numbers, symbols, passphrase=false }) {
  const len=clamp(+length||16,6,128);
  let chars="abcdefghijklmnopqrstuvwxyz";
  if(upper)   chars+="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if(numbers) chars+="0123456789";
  if(symbols) chars+="!@#$%^&*()_+-=[]{}|;:,.<>?";

  let pwd="";
  // Ensure at least 1 of each required type
  if(upper)   pwd+=pick("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  if(numbers) pwd+=pick("0123456789");
  if(symbols) pwd+=pick("!@#$%^&*()_+-=");
  while(pwd.length<len) pwd+=chars[secureRandom(chars.length)];
  pwd=shuffle(pwd);

  const entropy=round(len*Math.log2(chars.length));
  const strength=entropy>=80?"Very Strong":entropy>=60?"Strong":entropy>=40?"Good":"Weak";
  const crackTime=entropy>=128?"Centuries":entropy>=80?"Billions of years":entropy>=60?"Years":entropy>=40?"Hours":"Seconds";

  // Cryptographically secure random index
  function secureRandom(max) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % max;
  }
  function pick(s) { return s[secureRandom(s.length)]; }
  // Fisher-Yates shuffle (unbiased)
  function shuffle(s) {
    const a = s.split("");
    for (let i = a.length - 1; i > 0; i--) {
      const j = secureRandom(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a.join("");
  }

  return {
    password:pwd, entropy, strength, crackTime,
    charsetSize:chars.length, length:len,
    breakdowns:[
      {label:"Length",      value:len+" characters"},
      {label:"Charset",     value:chars.length+" unique chars"},
      {label:"Entropy",     value:entropy+" bits"},
      {label:"Strength",    value:strength,bold:true},
      {label:"Crack Time",  value:crackTime},
    ],
    insights:[
      {type:entropy>=60?"good":entropy>=40?"warn":"bad",msg:`${strength} password — estimated crack time: ${crackTime}`},
      len<12&&{type:"warn",msg:"Use at least 12 characters for better security."},
      !symbols&&{type:"info",msg:"Adding symbols significantly increases security."},
    ].filter(Boolean),
  };
}

// ── Fuel Engine ───────────────────────────────────────────────────────
export function calcFuel({ distance, fuelPrice, efficiency, passengers=1, trips=1 }) {
  const d=+distance||0, p=+fuelPrice||0, e=+efficiency||0, pa=+passengers||1, t=+trips||1;
  if(!d||!p||!e) return null;
  const litres=round(d/e,2), total=round(litres*p), perKm=round(total/d,2);
  const perPerson=round(total/pa,2), roundTrip=round(total*2);
  const monthly=round(total*t);

  return {
    litres, total, perKm, perPerson, roundTrip, monthly,
    breakdowns:[
      {label:"Distance",       value:d+" km"},
      {label:"Efficiency",     value:e+" km/L"},
      {label:"Fuel Needed",    value:litres+" L"},
      {label:"Price/Litre",    value:fmtC(p)},
      {label:"One-way Cost",   value:fmtC(total),bold:true},
      ...(pa>1?[{label:`Per Person (${pa})`,value:fmtC(perPerson)}]:[]),
      {label:"Round Trip",     value:fmtC(roundTrip)},
      ...(t>1?[{label:`Monthly (${t} trips)`,value:fmtC(monthly),bold:true}]:[]),
    ],
    insights:[
      {type:"info",msg:`${litres}L needed · ${fmtC(perKm)}/km`},
      pa>1&&{type:"good",msg:`Split among ${pa} people: ${fmtC(perPerson)} each`},
    ].filter(Boolean),
  };
}

// ── Date Diff Engine ──────────────────────────────────────────────────
export function calcDateDiff({ date1, date2, excludeWeekends=false, holidays=[], includeEndDate=false }) {
  const d1=new Date(date1), d2=new Date(date2);
  if(!date1||!date2) return null;
  let totalDays=Math.abs(Math.floor((d2-d1)/86400000));
  if (includeEndDate) totalDays++;

  let businessDays=0;
  let holidaysHit = 0;
  if(excludeWeekends){
    const cur=new Date(Math.min(d1,d2));
    const end=new Date(Math.max(d1,d2));
    const holidayStrs = holidays.filter(Boolean).map(h => {
      try { return new Date(h).toISOString().split('T')[0]; } catch(e) { return null; }
    }).filter(Boolean);

    while(includeEndDate ? cur <= end : cur < end){
      const day=cur.getDay();
      const curStr = cur.toISOString().split('T')[0];
      const isWeekend = day === 0 || day === 6;
      const isHoliday = holidayStrs.includes(curStr);
      
      if (!isWeekend && isHoliday) holidaysHit++;
      if (!isWeekend && !isHoliday) businessDays++;
      
      cur.setDate(cur.getDate()+1);
    }
  }

  return {
    days:totalDays, weeks:round(totalDays/7,1), months:round(totalDays/30.44,1),
    years:round(totalDays/365.25,2), hours:totalDays*24, businessDays, holidaysHit,
    breakdowns:[
      {label:"Start",       value:d1.toLocaleDateString("en-GB")},
      {label:"End",         value:d2.toLocaleDateString("en-GB")},
      {label:"Days",        value:totalDays.toLocaleString(),bold:true},
      {label:"Weeks",       value:round(totalDays/7,1).toLocaleString()},
      {label:"Months",      value:round(totalDays/30.44,1)},
      {label:"Years",       value:round(totalDays/365.25,2)},
      ...(excludeWeekends?[{label:"Business Days",value:businessDays.toLocaleString(),bold:true}]:[]),
      ...(excludeWeekends && holidaysHit > 0?[{label:"Holidays Excluded",value:holidaysHit.toLocaleString()}]:[]),
    ],
    insights:[{type:"info",msg:`${totalDays} calendar days${excludeWeekends?` · ${businessDays} business days`:""}${holidaysHit > 0 ? ` (excluded ${holidaysHit} holidays)` : ""}`}],
  };
}

// ── GPA Engine ────────────────────────────────────────────────────────
export function calcGPA({ courses, scale="4.0" }) {
  if(!courses?.length) return null;
  const totalCr=courses.reduce((s,c)=>s+(+c.credits||0),0);
  const gpa=totalCr>0?round(courses.reduce((s,c)=>s+(+c.grade||0)*(+c.credits||0),0)/totalCr,2):0;
  const LETTER=[[3.7,"A"],[3.3,"A−"],[3.0,"B+"],[2.7,"B"],[2.3,"B−"],[2.0,"C+"],[1.7,"C"],[0,"F"]];
  const letter=LETTER.find(([g])=>gpa>=g)?.[1]||"F";
  const status=gpa>=3.7?"Dean's List":gpa>=3.5?"Honors":gpa>=2.0?"Good Standing":"Academic Warning";

  // What-if: what grade needed in remaining course?
  const whatIf=(targetGPA,extraCredits)=>{
    if(!extraCredits||!targetGPA) return null;
    const needed=(targetGPA*totalCr+targetGPA*extraCredits-gpa*totalCr)/(extraCredits);
    return round(clamp(needed,0,4),2);
  };

  return {
    gpa, letter, status, totalCredits:totalCr,
    breakdown:courses.map(c=>({label:c.name||"Course",value:`${c.grade} × ${c.credits} = ${round(+c.grade*+c.credits,2)}`})),
    insights:[
      gpa>=3.7&&{type:"good",msg:"Dean's List! Excellent academic performance. 🎓"},
      gpa>=3.0&&gpa<3.7&&{type:"info",msg:"Good standing. Keep pushing toward Dean's List!"},
      gpa<2.0&&{type:"bad",msg:"Academic warning zone. Seek counseling and improve immediately."},
      {type:"info",msg:`Status: ${status}`},
    ].filter(Boolean),
    whatIf,
  };
}

// ── Statistics Engine ─────────────────────────────────────────────────
export function calcStatistics({ dataset }) {
  const nums=dataset.split(/[\s,;]+/).map(Number).filter(n=>!isNaN(n)&&isFinite(n));
  if(nums.length<2) return null;
  const sorted=[...nums].sort((a,b)=>a-b);
  const n=nums.length, sum=nums.reduce((a,b)=>a+b,0), mean=round(sum/n,4);
  const median=n%2===0?(sorted[n/2-1]+sorted[n/2])/2:sorted[Math.floor(n/2)];
  const variance=nums.reduce((a,b)=>a+(b-mean)**2,0)/n;
  const stdDev=round(Math.sqrt(variance),4);
  const q1=sorted[Math.floor(n/4)], q3=sorted[Math.floor(3*n/4)];
  const iqr=round(q3-q1,4);
  // Mode
  const freq={}; nums.forEach(n=>{freq[n]=(freq[n]||0)+1;});
  const maxF=Math.max(...Object.values(freq));
  const mode=Object.entries(freq).filter(([,f])=>f===maxF).map(([v])=>+v);

  // Histogram bins
  const bins=Math.min(10,Math.ceil(Math.sqrt(n)));
  const binW=(sorted[n-1]-sorted[0])/bins;
  const histogram=Array.from({length:bins},(_,i)=>{
    const lo=sorted[0]+i*binW, hi=lo+binW;
    const count=nums.filter(x=>x>=lo&&(i===bins-1?x<=hi:x<hi)).length;
    return {range:`${round(lo,1)}–${round(hi,1)}`,count};
  });

  return {
    count:n, sum:round(sum,4), mean, median:round(median,4),
    mode, stdDev, variance:round(variance,4), q1, q3, iqr,
    min:sorted[0], max:sorted[n-1], range:round(sorted[n-1]-sorted[0],4),
    histogram,
    breakdowns:[
      {label:"Count",      value:n},
      {label:"Sum",        value:round(sum,4)},
      {label:"Mean",       value:mean,bold:true},
      {label:"Median",     value:round(median,4),bold:true},
      {label:"Mode",       value:mode.join(", ")},
      {label:"Std Dev",    value:stdDev},
      {label:"Variance",   value:round(variance,4)},
      {label:"Q1",         value:q1},
      {label:"Q3",         value:q3},
      {label:"IQR",        value:iqr},
      {label:"Min",        value:sorted[0]},
      {label:"Max",        value:sorted[n-1]},
      {label:"Range",      value:round(sorted[n-1]-sorted[0],4)},
    ],
    insights:[
      {type:"info",msg:`Dataset: ${n} values from ${sorted[0]} to ${sorted[n-1]}`},
      {type:"info",msg:`Mean (${mean}) ${Math.abs(mean-round(median,4))>stdDev?"differs significantly from":"≈"} Median (${round(median,4)})`},
    ],
  };
}

// ── Break-Even Engine ─────────────────────────────────────────────────
export function calcBreakEven({ fixedCosts, variableCost, sellingPrice }) {
  const fc=+fixedCosts||0, vc=+variableCost||0, sp=+sellingPrice||0;
  if(!fc||sp<=vc) return null;
  const contribution=sp-vc;
  const beUnits=round(fc/contribution,2);
  const beRevenue=round(beUnits*sp);
  const marginOfSafety=(revenue)=>round((revenue-beRevenue)/revenue*100,1);

  const pts=Array.from({length:11},(_,i)=>{
    const units=Math.round(beUnits*i/5);
    return {units,revenue:round(units*sp),cost:round(fc+units*vc),profit:round(units*sp-fc-units*vc)};
  });

  return {
    beUnits:Math.ceil(beUnits), beRevenue, contribution,
    contributionMargin:round(contribution/sp*100,1),
    pts, marginOfSafety,
    breakdowns:[
      {label:"Fixed Costs",      value:fmtC(fc)},
      {label:"Variable Cost/Unit",value:fmtC(vc)},
      {label:"Selling Price/Unit",value:fmtC(sp)},
      {label:"Contribution/Unit", value:fmtC(contribution)},
      {label:"Contribution Margin",value:round(contribution/sp*100,1)+"%"},
      {label:"Break-Even Units",  value:Math.ceil(beUnits)+"",bold:true},
      {label:"Break-Even Revenue",value:fmtC(beRevenue),bold:true},
    ],
    insights:[
      {type:"info",msg:`Sell ${Math.ceil(beUnits)} units to cover all costs.`},
      {type:"good",msg:`Every unit after ${Math.ceil(beUnits)} = ${fmtC(contribution)} pure profit!`},
      contribution/sp<0.2&&{type:"warn",msg:"Low contribution margin. Consider raising price or cutting variable costs."},
    ].filter(Boolean),
  };
}

// ── Unit Converters ───────────────────────────────────────────────────
export const UNIT_DEFS = {
  length:   {name:"Length",   units:["mm","cm","m","km","in","ft","yd","mile","nautical mi"],factors:[0.001,0.01,1,1000,0.0254,0.3048,0.9144,1609.344,1852]},
  weight:   {name:"Weight",   units:["mg","g","kg","tonne","oz","lb","stone","carat"],       factors:[1e-6,0.001,1,1000,0.0283495,0.453592,6.35029,0.0002]},
  speed:    {name:"Speed",    units:["m/s","km/h","mph","knot","ft/s","Mach"],               factors:[1,1/3.6,0.44704,0.514444,0.3048,340.29]},
  data:     {name:"Data",     units:["B","KB","MB","GB","TB","PB"],                          factors:[1,1024,1048576,1073741824,1099511627776,1125899906842624]},
  area:     {name:"Area",     units:["cm²","m²","km²","ft²","acre","hectare","mile²"],       factors:[0.0001,1,1e6,0.092903,4046.86,10000,2589988]},
  volume:   {name:"Volume",   units:["mL","L","m³","fl oz","cup","pint","gallon"],           factors:[0.001,1,1000,0.0295735,0.236588,0.473176,3.78541]},
  temp:     {name:"Temperature"},
  pressure: {name:"Pressure", units:["Pa","kPa","MPa","bar","psi","atm","mmHg"],            factors:[1,1000,1000000,100000,6894.76,101325,133.322]},
  energy:   {name:"Energy",   units:["J","kJ","cal","kcal","Wh","kWh","BTU"],               factors:[1,1000,4.184,4184,3600,3600000,1055.06]},
};

export function convertUnit(value, fromIdx, toIdx, type) {
  const def=UNIT_DEFS[type];
  if(!def||type==="temp") return value;
  return (value*def.factors[fromIdx])/def.factors[toIdx];
}

export function convertTemp(value, from, to) {
  const toC={C:v=>v,F:v=>(v-32)*5/9,K:v=>v-273.15};
  const fromC={C:v=>v,F:v=>v*9/5+32,K:v=>v+273.15};
  return round(fromC[to](toC[from](+value)),4);
}

// ── Tax Engine (Pakistan FBR) ─────────────────────────────────────────
export function calcTax({ income, region="global", type="salary", period="annual" }) {
  const multiplier={monthly:12,annual:1}[period]||1;
  const annual=(+income||0)*multiplier;

  let tax;
  let slabLabel;
  let slabBreakdown;
  let regionName = "Global";

  if (region === "pk") {
    regionName = "Pakistan";
    const SLABS=[
      {min:0,       max:600000,   rate:0,    fixed:0,      label:"Up to 600K"},
      {min:600000,  max:1200000,  rate:0.05, fixed:0,      label:"600K–1.2M"},
      {min:1200000, max:2400000,  rate:0.15, fixed:30000,  label:"1.2M–2.4M"},
      {min:2400000, max:3600000,  rate:0.25, fixed:210000, label:"2.4M–3.6M"},
      {min:3600000, max:6000000,  rate:0.30, fixed:510000, label:"3.6M–6M"},
      {min:6000000, max:Infinity, rate:0.35, fixed:1230000,label:"Above 6M"},
    ];
    const slab=SLABS.find(s=>annual>=s.min&&annual<s.max)||SLABS[0];
    tax=slab.fixed+(annual-slab.min)*slab.rate;
    slabLabel = slab.label;
    slabBreakdown=SLABS.map(s=>{
      const taxable=Math.max(0,Math.min(annual,s.max)-s.min);
      const t=round(taxable*s.rate);
      return {label:`${s.label} @ ${s.rate*100}%`,value:fmtC(t),bold:t>0&&slab.min===s.min};
    });
  } else {
    tax = annual * 0.10;
    slabLabel = "Flat 10% (Global Estimate)";
    slabBreakdown = [{label: "Income Tax", value: fmtC(tax), bold: true}];
  }

  const effRate=annual>0?round(tax/annual*100,2):0;
  const netAnnual=round(annual-tax);

  return {
    grossAnnual:annual, tax:round(tax), netAnnual,
    monthlyTax:round(tax/12), netMonthly:round(netAnnual/12),
    effRate, slabLabel,
    slabBreakdown,
    breakdowns:[
      {label:"Annual Income",   value:fmtC(annual)},
      {label:"Tax Slab",        value:slabLabel},
      {label:"Annual Tax",      value:fmtC(tax),bold:true},
      {label:"Effective Rate",  value:effRate+"%"},
      {label:"Monthly Tax",     value:fmtC(tax/12)},
      {label:"Net Monthly",     value:fmtC(netAnnual/12),bold:true},
      {label:"Net Annual",      value:fmtC(netAnnual),bold:true},
    ],
    insights:[
      {type:"info",msg:`${regionName} Tax Slab: ${slabLabel} at ${effRate}%`},
      {type:effRate<10?"good":effRate<25?"info":"warn",msg:`Effective tax rate: ${effRate}%`},
      (region === "pk" && annual<=600000)&&{type:"good",msg:"Your income is below the taxable threshold (600K). Zero tax!"},
    ].filter(Boolean),
  };
}

// ── Tip Engine ────────────────────────────────────────────────────────
export function calcTip({ bill, tipPct, people=1, roundUp=false }) {
  const b=+bill||0, t=+tipPct||0, p=+people||1;
  if(!b) return null;
  const tipAmt=round(b*t/100);
  const total=round(b+tipAmt);
  const perPerson=round(total/p);
  const perPersonRounded=roundUp?Math.ceil(total/p):round(total/p);
  const tipPerPerson=round(tipAmt/p);

  return {
    bill:b, tipAmt, total, perPerson, perPersonRounded, tipPerPerson,
    breakdowns:[
      {label:"Bill Amount",     value:fmtC(b)},
      {label:`Tip (${t}%)`,     value:fmtC(tipAmt)},
      {label:"Total",           value:fmtC(total),bold:true},
      ...(p>1?[{label:`Per Person (${p})`,value:fmtC(perPerson),bold:true},{label:"Tip/Person",value:fmtC(tipPerPerson)}]:[]),
      ...(roundUp?[{label:"Rounded Up",value:fmtC(perPersonRounded)}]:[]),
    ],
    insights:[
      p>1&&{type:"info",msg:`Each person pays ${fmtC(perPersonRounded)} (including ${t}% tip)`},
      t>=20&&{type:"good",msg:"Generous tip! The service team will appreciate it."},
    ].filter(Boolean),
  };
}

// ── BMR Engine ────────────────────────────────────────────────────────
export function calcBMR({ weight, height, age, gender }) {
  const w=+weight,h=+height,a=+age;
  if(!w||!h||!a) return null;
  const mifflin=gender==="male"?10*w+6.25*h-5*a+5:10*w+6.25*h-5*a-161;
  const harris=gender==="male"?88.362+13.397*w+4.799*h-5.677*a:447.593+9.247*w+3.098*h-4.330*a;
  const katch=370+21.6*(w*(1-0.2)); // approximate lean mass estimate
  const LEVELS=[
    {label:"Sedentary",val:1.2,desc:"Desk job, little exercise"},
    {label:"Light",val:1.375,desc:"1–3 workouts/week"},
    {label:"Moderate",val:1.55,desc:"3–5 workouts/week"},
    {label:"Active",val:1.725,desc:"6–7 workouts/week"},
    {label:"Very Active",val:1.9,desc:"Athletes, 2× day"},
  ];
  return {
    mifflin:round(mifflin), harris:round(harris), katch:round(katch),
    tdeeByLevel:LEVELS.map(l=>({...l,tdee:round(mifflin*l.val)})),
    breakdowns:[
      {label:"Mifflin-St Jeor", value:round(mifflin)+" kcal",bold:true},
      {label:"Harris-Benedict", value:round(harris)+" kcal"},
      {label:"Difference",      value:round(Math.abs(mifflin-harris))+" kcal"},
    ],
    insights:[
      {type:"info",msg:"Mifflin-St Jeor is the most clinically accurate formula."},
      {type:"good",msg:`Your BMR: ${round(mifflin)} kcal/day (Mifflin) · ${round(harris)} kcal/day (Harris)`},
    ],
  };
}

// ── Macro Calculator ──────────────────────────────────────────────────
export function calcMacro({ calories, goal="maintain", bodyWeight=70 }) {
  const cal=+calories||2000, bw=+bodyWeight||70;
  const adj={lose:cal-500,maintain:cal,gain:cal+300,aggressive:cal+500}[goal]||cal;
  const GOALS={
    lose:      {p:0.35,c:0.35,f:0.30,label:"Weight Loss"},
    maintain:  {p:0.30,c:0.40,f:0.30,label:"Maintain"},
    gain:      {p:0.30,c:0.45,f:0.25,label:"Lean Gain"},
    aggressive:{p:0.35,c:0.45,f:0.20,label:"Aggressive Bulk"},
  };
  const m=GOALS[goal]||GOALS.maintain;
  return {
    calories:adj, protein:round(adj*m.p/4), carbs:round(adj*m.c/4), fat:round(adj*m.f/9),
    proteinPerKg:round(adj*m.p/4/bw,1),
    pieData:[{name:"Protein",value:round(m.p*100),color:"#3b82f6"},{name:"Carbs",value:round(m.c*100),color:"#f59e0b"},{name:"Fat",value:round(m.f*100),color:"#ef4444"}],
    breakdowns:[
      {label:"Goal",         value:m.label},
      {label:"Target Calories",value:adj+" kcal",bold:true},
      {label:"Protein",      value:round(adj*m.p/4)+"g ("+round(m.p*100)+"%)"},
      {label:"Carbs",        value:round(adj*m.c/4)+"g ("+round(m.c*100)+"%)"},
      {label:"Fat",          value:round(adj*m.f/9)+"g ("+round(m.f*100)+"%)"},
      {label:"Protein/kg BW",value:round(adj*m.p/4/bw,1)+"g/kg"},
    ],
    insights:[
      {type:"info",msg:`${m.label}: ${adj} kcal with ${round(m.p*100)}% protein, ${round(m.c*100)}% carbs, ${round(m.f*100)}% fat`},
      {type:"good",msg:`Target ${round(adj*m.p/4/bw,1)}g protein per kg bodyweight`},
    ],
  };
}

// ── Quadratic Engine ──────────────────────────────────────────────────
export function calcQuadratic({ a, b, c }) {
  const av=+a,bv=+b,cv=+c;
  if(!av) return null;
  const disc=bv*bv-4*av*cv;
  const vertex={x:round(-bv/(2*av),4),y:round(cv-bv*bv/(4*av),4)};
  const x_intercepts=disc>=0?[round((-bv+Math.sqrt(disc))/(2*av),4),round((-bv-Math.sqrt(disc))/(2*av),4)]:[];
  const pts=Array.from({length:21},(_,i)=>{const x=vertex.x-5+i;return {x:round(x,1),y:round(av*x*x+bv*x+cv,2)};});

  const steps = [
    { title: "1. Identify Coefficients", desc: `a = ${av}, b = ${bv}, c = ${cv}` },
    { title: "2. Quadratic Formula", desc: `x = (-b ± √(b² - 4ac)) / 2a` },
    { title: "3. Calculate Discriminant (Δ)", desc: `Δ = (${bv})² - 4(${av})(${cv}) = ${bv*bv} - ${4*av*cv} = ${disc}` },
    { title: "4. Evaluate Roots", desc: disc > 0 ? `Δ > 0, so there are two real roots.` : disc === 0 ? `Δ = 0, so there is one real root.` : `Δ < 0, so roots are complex (no real roots).` },
  ];
  if (disc >= 0) {
    steps.push({ title: "5. Solve for x", desc: `x = (-(${bv}) ± √${round(disc,4)}) / ${2*av}` });
    steps.push({ title: "6. Final Roots", desc: `x₁ = ${x_intercepts[0]}${disc>0?`, x₂ = ${x_intercepts[1]}`:""}` });
  }

  return {
    discriminant:round(disc,4), roots:x_intercepts, vertex, pts, steps,
    rootType:disc>0?"Two real roots":disc===0?"One real root (repeated)":"No real roots (complex)",
    breakdowns:[
      {label:"Equation",       value:`${a}x² + ${b}x + ${c} = 0`},
      {label:"Discriminant",   value:round(disc,4)},
      {label:"Root Type",      value:disc>0?"Two Real":disc===0?"One (Repeated)":"Complex"},
      ...(x_intercepts.length?[{label:"Root 1",value:x_intercepts[0]},{label:"Root 2",value:x_intercepts[1]}]:[]),
      {label:"Vertex",         value:`(${vertex.x}, ${vertex.y})`},
    ],
    insights:[
      disc<0&&{type:"warn",msg:"No real roots — discriminant is negative (complex roots exist)"},
      disc>=0&&{type:"good",msg:`${disc===0?"One repeated":"Two real"} root${disc===0?"":"s"}: ${x_intercepts.join(" and ")}`},
    ].filter(Boolean),
  };
}

// ── Water Intake ──────────────────────────────────────────────────────
export function calcWater({ weight, activity, climate }) {
  const w=+weight||70;
  const base=round(w*35/1000,2); // 35ml/kg
  const activityExtra={sedentary:0,light:0.3,moderate:0.5,active:0.7,veryActive:1}[activity]||0;
  const climateExtra={cool:0,moderate:0,warm:0.3,hot:0.5}[climate]||0;
  const total=round(base+activityExtra+climateExtra,2);
  const glasses=Math.ceil(total*1000/250);

  return {
    base, total, glasses, ml:round(total*1000),
    breakdowns:[
      {label:"Base (35ml/kg)",   value:base+"L"},
      {label:"Activity extra",   value:activityExtra+"L"},
      {label:"Climate extra",    value:climateExtra+"L"},
      {label:"Daily Total",      value:total+"L",bold:true},
      {label:"In Glasses (250ml)",value:glasses+""},
    ],
    insights:[
      {type:"info",msg:`Drink ${total}L (${glasses} glasses) of water daily.`},
      {type:"good",msg:"Tip: Start with 1–2 glasses in the morning before breakfast."},
    ],
  };
}

// ── Heart Rate Zones ──────────────────────────────────────────────────
export function calcHeartRate({ age, restingHR=60 }) {
  const a=+age||25, rhr=+restingHR||60;
  const maxHR=220-a;
  const hrr=maxHR-rhr; // Heart Rate Reserve (Karvonen)
  const zones=[
    {zone:1,label:"Recovery",    min:0.50,max:0.60,color:"#3b82f6",desc:"Very light — warm up, cool down"},
    {zone:2,label:"Fat Burn",    min:0.60,max:0.70,color:"#22c55e",desc:"Light — fat oxidation, endurance base"},
    {zone:3,label:"Aerobic",     min:0.70,max:0.80,color:"#f59e0b",desc:"Moderate — cardio fitness, tempo runs"},
    {zone:4,label:"Threshold",   min:0.80,max:0.90,color:"#f97316",desc:"Hard — lactate threshold, intervals"},
    {zone:5,label:"Maximum",     min:0.90,max:1.00,color:"#ef4444",desc:"Max — VO₂ max, sprint intervals"},
  ].map(z=>({...z,minBPM:Math.round(rhr+z.min*hrr),maxBPM:Math.round(rhr+z.max*hrr)}));
  return {
    maxHR, zones,
    breakdowns:[{label:"Age",value:a},{label:"Max HR",value:maxHR+" bpm",bold:true},{label:"Resting HR",value:rhr+" bpm"},{label:"HRR",value:hrr+" bpm"}],
    insights:[{type:"info",msg:`Max HR: ${maxHR} bpm. Train in Zone 2 for fat loss, Zone 4 for performance.`}],
  };
}

// ── Body Fat (Navy Method) ─────────────────────────────────────────────
export function calcBodyFat({ height, neck, waist, hip, gender }) {
  const h=+height,n=+neck,w=+waist,hi=+hip;
  if(!h||!n||!w) return null;
  if(gender!=="male" && !hi) return { error: "Hip measurement is required for female body-fat calculation." };
  let bf;
  if(gender==="male")   bf=495/(1.0324-0.19077*Math.log10(w-n)+0.15456*Math.log10(h))-450;
  else                  bf=495/(1.29579-0.35004*Math.log10(w+hi-n)+0.221*Math.log10(h))-450;
  bf=round(bf,1);
  const CATS=gender==="male"
    ?[{max:6,l:"Essential"},{max:14,l:"Athletic"},{max:18,l:"Fitness"},{max:25,l:"Acceptable"},{max:Infinity,l:"Obese"}]
    :[{max:14,l:"Essential"},{max:21,l:"Athletic"},{max:25,l:"Fitness"},{max:32,l:"Acceptable"},{max:Infinity,l:"Obese"}];
  const cat=CATS.find(c=>bf<c.max)||CATS[CATS.length-1];
  return {
    bf, category:cat.l,
    leanMass:round(+((h/100)**2*22-bf/100*((h/100)**2*22)),1),
    breakdowns:[{label:"Body Fat %",value:bf+"%",bold:true},{label:"Category",value:cat.l,bold:true}],
    insights:[{type:cat.l==="Athletic"||cat.l==="Fitness"?"good":"info",msg:`${cat.l} category — ${bf}% body fat`}],
  };
}

// ── Ideal Weight ──────────────────────────────────────────────────────
export function calcIdealWeight({ height, gender }) {
  const h=+height, hIn=(h-152.4)/2.54;
  if(!h) return null;
  const devine=gender==="male"?round(50+2.3*hIn,1):round(45.5+2.3*hIn,1);
  const miller=gender==="male"?round(56.2+1.41*hIn,1):round(53.1+1.36*hIn,1);
  const robinson=gender==="male"?round(52+1.9*hIn,1):round(49+1.7*hIn,1);
  const hamwi=gender==="male"?round(48+2.7*hIn,1):round(45.5+2.3*hIn,1);
  const avg=round((devine+miller+robinson+hamwi)/4,1);
  return {
    devine, miller, robinson, hamwi, avg,
    bmiMin:round(18.5*(h/100)**2,1), bmiMax:round(24.9*(h/100)**2,1),
    breakdowns:[
      {label:"Devine Formula",  value:devine+" kg"},
      {label:"Miller Formula",  value:miller+" kg"},
      {label:"Robinson Formula",value:robinson+" kg"},
      {label:"Hamwi Formula",   value:hamwi+" kg"},
      {label:"Average",         value:avg+" kg",bold:true},
      {label:"BMI 18.5–24.9",   value:`${round(18.5*(h/100)**2,1)}–${round(24.9*(h/100)**2,1)} kg`,bold:true},
    ],
    insights:[{type:"info",msg:`Ideal weight range: ${round(18.5*(h/100)**2,1)}–${round(24.9*(h/100)**2,1)} kg (BMI-based)`}],
  };
}

// ── One Rep Max ───────────────────────────────────────────────────────
export function calcOneRepMax({ weight, reps }) {
  const w=+weight,r=+reps;
  if(!w||r<1) return null;
  if(r>=37) return { error: "Reps must be below 37 for Brzycki formula." };
  const epley=round(w*(1+r/30),1);
  const brzycki=round(w*(36/(37-r)),1);
  const lander=round(w*100/(101.3-2.67123*r),1);
  const avg=round((epley+brzycki+lander)/3,1);
  const pcts=[100,95,90,85,80,75,70,65,60].map(p=>({pct:p,weight:round(avg*p/100,1)}));
  return {
    epley, brzycki, lander, avg, pcts,
    breakdowns:[
      {label:"Epley Formula",  value:epley+" kg"},
      {label:"Brzycki Formula",value:brzycki+" kg"},
      {label:"Lander Formula", value:lander+" kg"},
      {label:"Average 1RM",    value:avg+" kg",bold:true},
    ],
    insights:[{type:"good",msg:`Estimated 1RM: ${avg} kg (average of 3 formulas)`}],
  };
}

// ── GST Calculator ────────────────────────────────────────────────────
export function calcGST({ amount, gstRate, type="exclusive" }) {
  const a=+amount||0, g=+gstRate||0;
  if(!a) return null;
  let base,gstAmt,total;
  if(type==="exclusive"){ base=a; gstAmt=round(a*g/100); total=round(a+gstAmt); }
  else                  { total=a; base=round(a*100/(100+g)); gstAmt=round(a-base); }
  return {
    base, gstAmt, total,
    breakdowns:[
      {label:"Base Amount",  value:fmtC(base)},
      {label:`GST (${g}%)`, value:fmtC(gstAmt)},
      {label:"Total",        value:fmtC(total),bold:true},
    ],
    insights:[{type:"info",msg:type==="exclusive"?`Add ${fmtC(gstAmt)} GST to ${fmtC(base)}`:`GST component: ${fmtC(gstAmt)} of ${fmtC(total)}`}],
  };
}

// ── PPF Calculator ────────────────────────────────────────────────────
export function calcPPF({ annual, years=15, rate=7.1 }) {
  const a=+annual||0, y=+years||15, r=+rate||7.1;
  if(!a) return null;
  let balance=0;
  const pts=[];
  for(let i=1;i<=y;i++){
    balance=(balance+a)*(1+r/100);
    pts.push({year:`Y${i}`,balance:round(balance),invested:round(a*i)});
  }
  const total=a*y, interest=round(balance-total);
  return {
    maturity:round(balance), total, interest, pts,
    breakdowns:[
      {label:"Annual Contribution",value:fmtC(a)},
      {label:"Duration",           value:y+" years"},
      {label:"Interest Rate",      value:r+"%"},
      {label:"Total Invested",     value:fmtC(total)},
      {label:"Interest Earned",    value:fmtC(interest),bold:true},
      {label:"Maturity Amount",    value:fmtC(round(balance)),bold:true},
    ],
    insights:[
      {type:"good",msg:`₹${fmt(a)}/year for ${y} years grows to ${fmtC(round(balance))} at ${r}%`},
      {type:"info",msg:"PPF is 100% tax-free under EEE status — best safe investment in India/Pakistan"},
    ],
  };
}

// ── Fraction Calculator ───────────────────────────────────────────────
export function calcFraction({ n1, d1, n2, d2, op }) {
  const gcd=(a,b)=>b===0?a:gcd(b,a%b);
  const n1v=+n1,d1v=+d1,n2v=+n2,d2v=+d2;
  if(!d1v||!d2v) return null;
  let rn,rd;
  if(op==="+"){ rn=n1v*d2v+n2v*d1v; rd=d1v*d2v; }
  else if(op==="-"){ rn=n1v*d2v-n2v*d1v; rd=d1v*d2v; }
  else if(op==="×"){ rn=n1v*n2v; rd=d1v*d2v; }
  else { rn=n1v*d2v; rd=d1v*n2v; }
  const g=gcd(Math.abs(rn),Math.abs(rd));
  const srn=rn/g, srd=rd/g;

  const steps = [];
  if (op === "+" || op === "-") {
    steps.push({ title: "1. Find Common Denominator", desc: `${d1v} × ${d2v} = ${d1v*d2v}` });
    steps.push({ title: "2. Adjust Numerators", desc: `${n1v}×${d2v} ${op} ${n2v}×${d1v} = ${n1v*d2v} ${op} ${n2v*d1v}` });
    steps.push({ title: "3. Combine", desc: `${rn} / ${rd}` });
  } else if (op === "×") {
    steps.push({ title: "1. Multiply Numerators", desc: `${n1v} × ${n2v} = ${rn}` });
    steps.push({ title: "2. Multiply Denominators", desc: `${d1v} × ${d2v} = ${rd}` });
  } else {
    steps.push({ title: "1. Invert Second Fraction", desc: `${n2v}/${d2v} → ${d2v}/${n2v}` });
    steps.push({ title: "2. Multiply Numerators", desc: `${n1v} × ${d2v} = ${rn}` });
    steps.push({ title: "3. Multiply Denominators", desc: `${d1v} × ${n2v} = ${rd}` });
  }
  if (g > 1) steps.push({ title: "4. Simplify", desc: `Divide by GCD (${g}) → ${srn}/${srd}` });

  return {
    result:`${srn}/${srd}`, decimal:round(srn/srd,6), steps,
    mixed:Math.abs(srn)>Math.abs(srd)?`${Math.trunc(srn/srd)} ${Math.abs(srn%srd)}/${Math.abs(srd)}`:"",
    breakdowns:[
      {label:"Operation",value:`${n1}/${d1} ${op} ${n2}/${d2}`},
      {label:"Raw Result",value:`${rn}/${rd}`},
      {label:"Simplified", value:`${srn}/${srd}`,bold:true},
      {label:"Decimal",    value:round(srn/srd,6)},
      ...(Math.abs(srn)>Math.abs(srd)?[{label:"Mixed",value:`${Math.trunc(srn/srd)} ${Math.abs(srn%srd)}/${Math.abs(srd)}`}]:[]),
    ],
    insights:[{type:"info",msg:`${n1}/${d1} ${op} ${n2}/${d2} = ${srn}/${srd} ≈ ${round(srn/srd,4)}`}],
  };
}

// ── Simple Interest (with flat vs reducing) ────────────────────────────
export function calcSimpleInterest({ principal, rate, time, unit="years" }) {
  const P=+principal||0, r=+rate||0, tRaw=+time||0;
  if(!P || !tRaw) return null;
  const t=unit==="months"?tRaw/12:unit==="days"?tRaw/365:tRaw;
  const si=round(P*r*t/100);
  const total=round(P+si);
  // Reducing balance comparison
  const rMonthly=r/1200, nMonths=Math.round(t*12);
  const emi=rMonthly === 0 ? P / (nMonths || 1) : (P*rMonthly*Math.pow(1+rMonthly,nMonths))/(Math.pow(1+rMonthly,nMonths)-1);
  const riTotal=round(emi*nMonths);
  const riInterest=round(riTotal-P);
  return {
    si, total, effectiveRate:round(si/P/t*100,2),
    reduceInterest:riInterest, reduceTotalPaid:riTotal,
    savings:round(si-riInterest),
    breakdowns:[
      {label:"Principal",          value:fmtC(P)},
      {label:"Rate",               value:r+"%"},
      {label:"Time",               value:tRaw+" "+unit},
      {label:"Simple Interest",    value:fmtC(si),bold:true},
      {label:"Total Payable",      value:fmtC(total),bold:true},
      {label:"vs Reducing Balance",value:fmtC(riInterest)+" interest"},
    ],
    insights:[
      {type:"info",msg:`SI: ${fmtC(si)} · Total: ${fmtC(total)}`},
      {type:"warn",msg:`Flat rate costs ${fmtC(si-riInterest)} MORE than reducing balance!`},
    ],
  };
}

// ── Pregnancy Due Date ────────────────────────────────────────────────
export function calcPregnancy({ lmp }) {
  if(!lmp) return null;
  const start=new Date(lmp);
  const edd=new Date(start.getTime()+280*86400000);
  const now=new Date();
  const daysPregnant=Math.max(0,Math.floor((now-start)/86400000));
  const weeksPregnant=Math.floor(daysPregnant/7);
  const daysLeft=Math.max(0,Math.round((edd-now)/86400000));
  const trimester=weeksPregnant<14?"1st":weeksPregnant<28?"2nd":"3rd";
  const milestones=[
    {week:8,label:"First ultrasound possible"},{week:12,label:"End of 1st trimester"},
    {week:20,label:"Anatomy scan"},{week:28,label:"3rd trimester begins"},
    {week:37,label:"Full term"},{week:40,label:"Due date"},
  ];
  return {
    edd:edd.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"}),
    weeksPregnant, daysLeft, trimester, milestones,
    breakdowns:[
      {label:"LMP",         value:start.toLocaleDateString("en-GB")},
      {label:"Due Date",    value:edd.toLocaleDateString("en-GB"),bold:true},
      {label:"Weeks",       value:weeksPregnant+" weeks pregnant"},
      {label:"Trimester",   value:trimester},
      {label:"Days Left",   value:daysLeft},
    ],
    insights:[
      weeksPregnant>0&&weeksPregnant<=42&&{type:"info",msg:`${weeksPregnant} weeks pregnant · ${daysLeft} days until due date · ${trimester} trimester`},
      {type:"good",msg:"Schedule regular prenatal checkups every 4 weeks until week 28."},
    ].filter(Boolean),
  };
}

// ── Roman Numerals ────────────────────────────────────────────────────
export function toRoman(n) {
  if(n<1||n>3999) return "Invalid";
  const map=[[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];
  let r="";
  for(const [v,s] of map){ while(n>=v){r+=s;n-=v;} }
  return r;
}
export function fromRoman(s) {
  const map={I:1,V:5,X:10,L:50,C:100,D:500,M:1000};
  let r=0,prev=0;
  for(const c of s.toUpperCase().split("").reverse()){const v=map[c]||0;r+=v<prev?-v:v;prev=v;}
  return r;
}

// ── Word Counter ──────────────────────────────────────────────────────
export function calcWordCount({ text }) {
  if(!text) return null;
  const words=text.trim()?text.trim().split(/\s+/).length:0;
  const chars=text.length, noSpace=text.replace(/\s/g,"").length;
  const sentences=text.split(/[.!?]+/).filter(s=>s.trim()).length;
  const paragraphs=text.split(/\n\n+/).filter(p=>p.trim()).length;
  const readTime=Math.max(1,Math.ceil(words/200));
  const speakTime=Math.max(1,Math.ceil(words/130));
  return {
    words, chars, noSpace, sentences, paragraphs, readTime, speakTime,
    breakdowns:[
      {label:"Words",         value:words.toLocaleString(),bold:true},
      {label:"Characters",    value:chars.toLocaleString()},
      {label:"No Spaces",     value:noSpace.toLocaleString()},
      {label:"Sentences",     value:sentences},
      {label:"Paragraphs",    value:paragraphs},
      {label:"Read Time",     value:readTime+" min"},
      {label:"Speak Time",    value:speakTime+" min"},
    ],
    insights:[{type:"info",msg:`${words} words · ${readTime} min read · ${speakTime} min to speak`}],
  };
}

// ── CGPA to Percentage ────────────────────────────────────────────────
export function calcCGPA({ cgpa, scale="10", university="standard" }) {
  const c=+cgpa;
  const presets={
    standard: {f:v=>v*9.5, label:"Standard (×9.5)"},
    vtu:      {f:v=>v*10-5,label:"VTU (×10-5)"},
    mu:       {f:v=>v*9.5, label:"Mumbai University"},
    anna:     {f:v=>v*10,  label:"Anna University"},
    hec:      {f:v=>v*10,  label:"HEC Pakistan (×10)"},
  };
  const conv=presets[university]||presets.standard;
  const pctAmt=round(clamp(conv.f(c),0,100),2);
  const grade=pctAmt>=90?"A+":pctAmt>=80?"A":pctAmt>=70?"B":pctAmt>=60?"C":pctAmt>=50?"D":"F";
  return {
    percentage:pctAmt, grade, formula:conv.label,
    allFormulas:Object.entries(presets).map(([k,v])=>({key:k,label:v.label,pct:round(clamp(v.f(c),0,100),2)})),
    breakdowns:[
      {label:"CGPA",       value:c},
      {label:"Formula",    value:conv.label},
      {label:"Percentage", value:pctAmt+"%",bold:true},
      {label:"Grade",      value:grade,bold:true},
    ],
    insights:[{type:"info",msg:`${c} CGPA = ${pctAmt}% using ${conv.label}`}],
  };
}

// ── Base64 ────────────────────────────────────────────────────────────
export function calcBase64({ text, mode }) {
  try {
    const result=mode==="encode"?btoa(unescape(encodeURIComponent(text))):decodeURIComponent(escape(atob(text)));
    return { result, length:result.length, inputLength:text.length, ratio:round(result.length/text.length,2) };
  } catch(e) { return { error:"Invalid input for "+mode }; }
}

// ── Random Number ─────────────────────────────────────────────────────
export function calcRandom({ min=1, max=100, count=1, type="integer" }) {
  const mn=+min,mx=+max,cnt=Math.min(+count,50);
  const secureRandom = () => {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] / (0xFFFFFFFF + 1);
  };
  const gen=()=>type==="decimal.js"?round(secureRandom()*(mx-mn)+mn,4):Math.floor(secureRandom()*(mx-mn+1))+mn;
  const nums=Array.from({length:cnt},gen);
  return { numbers:nums, sum:round(nums.reduce((a,b)=>a+b,0),4), avg:round(nums.reduce((a,b)=>a+b,0)/cnt,4) };
}

// ── Countdown ─────────────────────────────────────────────────────────
export function calcCountdown({ targetDate, eventName="" }) {
  const target=new Date(targetDate), now=new Date();
  if(!targetDate) return null;
  const diff=target-now;
  const past=diff<0;
  const abs=Math.abs(diff);
  const days=Math.floor(abs/86400000);
  const hours=Math.floor((abs%86400000)/3600000);
  const mins=Math.floor((abs%3600000)/60000);
  const secs=Math.floor((abs%60000)/1000);
  return {
    past, days, hours, mins, secs,
    total:{ days, hours:days*24+hours, minutes:days*1440+hours*60+mins },
    breakdowns:[
      {label:"Days",    value:days},
      {label:"Hours",   value:days*24+hours},
      {label:"Minutes", value:days*1440+hours*60+mins},
    ],
    insights:[{type:past?"bad":"good",msg:past?`${eventName||"Event"} was ${days} days ago.`:`${days}d ${hours}h ${mins}m until ${eventName||"the event"}!`}],
  };
}

// ── Work Hours ────────────────────────────────────────────────────────
export function calcWorkHours({ start, end, breakMins=60, daysPerWeek=5, hourlyRate=0 }) {
  const toM=t=>{const [h,m]=t.split(":").map(Number);return h*60+m;};
  const daily=Math.max(0,toM(end)-toM(start)-(+breakMins||0));
  const weekly=daily*(+daysPerWeek||5);
  const monthly=round(weekly*52/12,1);
  const pay=+hourlyRate;
  return {
    dailyHours:round(daily/60,2), weeklyHours:round(weekly/60,2), monthlyHours:round(monthly/60,1),
    dailyPay:pay?round(daily/60*pay):0, weeklyPay:pay?round(weekly/60*pay):0, monthlyPay:pay?round(monthly/60*pay):0,
    breakdowns:[
      {label:"Daily Hours",    value:round(daily/60,2)+"h",bold:true},
      {label:"Weekly Hours",   value:round(weekly/60,2)+"h"},
      {label:"Monthly Hours",  value:round(monthly/60,1)+"h"},
      ...(pay?[{label:"Daily Pay",value:fmtC(daily/60*pay)},{label:"Monthly Pay",value:fmtC(monthly/60*pay),bold:true}]:[]),
    ],
    insights:[{type:"info",msg:`${round(daily/60,2)}h/day · ${round(weekly/60,2)}h/week · ${round(monthly/60,1)}h/month`}],
  };
}

// ── Pythagorean ───────────────────────────────────────────────────────
export function calcPythagorean({ a, b, c, solve="c" }) {
  const av=+a,bv=+b,cv=+c;
  let result,formula;
  if(solve==="c"&&av&&bv){result=round(Math.sqrt(av**2+bv**2),6);formula=`c = √(${av}²+${bv}²) = ${result}`;}
  else if(solve==="a"&&bv&&cv){result=round(Math.sqrt(cv**2-bv**2),6);formula=`a = √(${cv}²-${bv}²) = ${result}`;}
  else if(solve==="b"&&av&&cv){result=round(Math.sqrt(cv**2-av**2),6);formula=`b = √(${cv}²-${av}²) = ${result}`;}
  if(!result) return null;
  const sides=solve==="c"?{a:av,b:bv,c:result}:solve==="a"?{a:result,b:bv,c:cv}:{a:av,b:result,c:cv};
  const area=round(0.5*sides.a*sides.b,4);
  const perimeter=round(sides.a+sides.b+sides.c,4);
  const steps = [];
  if (solve === "c") {
    steps.push({ title: "1. Pythagorean Theorem", desc: "c² = a² + b²" });
    steps.push({ title: "2. Substitute Values", desc: `c² = ${av}² + ${bv}²` });
    steps.push({ title: "3. Square Values", desc: `c² = ${av**2} + ${bv**2} = ${av**2 + bv**2}` });
    steps.push({ title: "4. Take Square Root", desc: `c = √${av**2 + bv**2} = ${result}` });
  } else if (solve === "a") {
    steps.push({ title: "1. Pythagorean Theorem", desc: "a² = c² - b²" });
    steps.push({ title: "2. Substitute Values", desc: `a² = ${cv}² - ${bv}²` });
    steps.push({ title: "3. Square Values", desc: `a² = ${cv**2} - ${bv**2} = ${cv**2 - bv**2}` });
    steps.push({ title: "4. Take Square Root", desc: `a = √${cv**2 - bv**2} = ${result}` });
  } else if (solve === "b") {
    steps.push({ title: "1. Pythagorean Theorem", desc: "b² = c² - a²" });
    steps.push({ title: "2. Substitute Values", desc: `b² = ${cv}² - ${av}²` });
    steps.push({ title: "3. Square Values", desc: `b² = ${cv**2} - ${av**2} = ${cv**2 - av**2}` });
    steps.push({ title: "4. Take Square Root", desc: `b = √${cv**2 - av**2} = ${result}` });
  }

  return {
    result, formula, sides, area, perimeter, steps,
    breakdowns:[
      {label:"Formula",    value:formula},
      {label:`Side ${solve.toUpperCase()}`, value:result,bold:true},
      {label:"Area",       value:area},
      {label:"Perimeter",  value:perimeter},
    ],
    insights:[{type:"good",msg:formula}],
  };
}

// ── Scientific Calculator ─────────────────────────────────────────────
export function calcScientific({ expr, degMode=true }) {
  try {
    const parser = new Parser();
    const toRad = v => degMode ? v * Math.PI / 180 : v;
    
    // Configure parser with custom functions
    parser.functions.sin = (x) => Math.sin(toRad(x));
    parser.functions.cos = (x) => Math.cos(toRad(x));
    parser.functions.tan = (x) => Math.tan(toRad(x));
    parser.functions.ln = (x) => Math.log(x);
    parser.functions.log = (x) => Math.log10(x);
    
    // Map greek letters or symbols if needed
    const safeExpr = expr.replace(/π/g, 'PI');
    
    const result = parser.evaluate(safeExpr);
    return {result:round(result,8), expression:expr, valid:true};
  } catch(e) {
    return {result:null,expression:expr,valid:false,error:"Invalid expression"};
  }
}

// ── ROI Calculator ────────────────────────────────────────────────────
export function calcROI({ investment, returns, years=1, inflationRate=0 }) {
  const inv=+investment||0, ret=+returns||0, y=+years||1, inf=(+inflationRate||0)/100;
  if(!inv) return null;
  const profit=ret-inv, roi=round(profit/inv*100,2);
  const annualROI=round((Math.pow(ret/inv,1/y)-1)*100,2);
  const realROI=round(((1+annualROI/100)/(1+inf)-1)*100,2);
  const pts=Array.from({length:y+1},(_,i)=>({year:`Y${i}`,value:round(inv*Math.pow(1+annualROI/100,i))}));
  return {
    profit:round(profit), roi, annualROI, realROI,
    pts, multiple:round(ret/inv,2),
    breakdowns:[
      {label:"Investment",   value:fmtC(inv)},
      {label:"Total Return", value:fmtC(ret)},
      {label:"Profit",       value:fmtC(profit),bold:true},
      {label:"Total ROI",    value:roi+"%",bold:true},
      {label:"Annual ROI",   value:annualROI+"%"},
      ...(inf>0?[{label:"Real ROI (inflation-adj)",value:realROI+"%"}]:[]),
      {label:"Multiple",     value:round(ret/inv,2)+"×"},
    ],
    insights:[
      {type:roi>0?"good":"bad",msg:`${roi>0?"Profit":"Loss"}: ${fmtC(Math.abs(profit))} (${annualROI}% annually)`},
      inf>0&&{type:"info",msg:`Real return after ${inflationRate}% inflation: ${realROI}%`},
    ].filter(Boolean),
  };
}

// ── Currency Converter (static rates) ─────────────────────────────────
export const CURRENCIES = {
  USD:{symbol:"$",name:"US Dollar",flag:"🇺🇸",rate:1},
  EUR:{symbol:"€",name:"Euro",flag:"🇪🇺",rate:0.92},
  GBP:{symbol:"£",name:"British Pound",flag:"🇬🇧",rate:0.79},
  PKR:{symbol:"₨",name:"Pakistani Rupee",flag:"🇵🇰",rate:278.5},
  INR:{symbol:"₹",name:"Indian Rupee",flag:"🇮🇳",rate:83.2},
  AED:{symbol:"د.إ",name:"UAE Dirham",flag:"🇦🇪",rate:3.67},
  SAR:{symbol:"﷼",name:"Saudi Riyal",flag:"🇸🇦",rate:3.75},
  CAD:{symbol:"C$",name:"Canadian Dollar",flag:"🇨🇦",rate:1.36},
  AUD:{symbol:"A$",name:"Australian Dollar",flag:"🇦🇺",rate:1.52},
  CNY:{symbol:"¥",name:"Chinese Yuan",flag:"🇨🇳",rate:7.24},
  JPY:{symbol:"¥",name:"Japanese Yen",flag:"🇯🇵",rate:149.5},
  CHF:{symbol:"Fr",name:"Swiss Franc",flag:"🇨🇭",rate:0.90},
  BDT:{symbol:"৳",name:"Bangladeshi Taka",flag:"🇧🇩",rate:110},
  MYR:{symbol:"RM",name:"Malaysian Ringgit",flag:"🇲🇾",rate:4.72},
  SGD:{symbol:"S$",name:"Singapore Dollar",flag:"🇸🇬",rate:1.34},
};
export function convertCurrency(amount, from, to) {
  const a=+amount||0;
  const usd=a/(CURRENCIES[from]?.rate||1);
  return round(usd*(CURRENCIES[to]?.rate||1),4);
}

// ── FD / Fixed Deposit Calculator ────────────────────────────────────
export function calcFD({ principal, rate, tenure, frequency = "4", taxRate = 0 }) {
  const P = +principal || 0, r = (+rate || 0) / 100, y = +tenure || 1, n = +frequency || 4, tax = (+taxRate || 0) / 100;
  if (!P || !r) return null;
  const maturity = round(P * Math.pow(1 + r / n, n * y));
  const interest = round(maturity - P);
  const taxAmt = round(interest * tax);
  const netInterest = round(interest - taxAmt);
  const netMaturity = round(P + netInterest);
  const effectiveYield = round((Math.pow(1 + r / n, n) - 1) * 100, 3);
  const pts = Array.from({ length: y + 1 }, (_, i) => ({
    year: `Y${i}`,
    balance: round(P * Math.pow(1 + r / n, n * i)),
    invested: P,
  }));
  return {
    maturity, interest, taxAmt, netInterest, netMaturity, effectiveYield, pts,
    breakdowns: [
      { label: "Principal", value: fmtC(P) },
      { label: "Annual Rate", value: rate + "%" },
      { label: "Tenure", value: y + " years" },
      { label: "Compounding", value: { 1: "Annually", 2: "Half-Yearly", 4: "Quarterly", 12: "Monthly" }[n] || "Quarterly" },
      { label: "Gross Maturity", value: fmtC(maturity), bold: true },
      { label: "Interest Earned", value: fmtC(interest), bold: true },
      ...(tax > 0 ? [{ label: `Tax (${taxRate}%)`, value: fmtC(taxAmt) }, { label: "Net Maturity", value: fmtC(netMaturity), bold: true }] : []),
      { label: "Effective Yield", value: effectiveYield + "% p.a." },
    ],
    insights: [
      { type: "good", msg: `${fmtC(P)} grows to ${fmtC(maturity)} in ${y} years at ${rate}%` },
      { type: "info", msg: `Effective annual yield: ${effectiveYield}% (with ${{ 1: "annual", 2: "half-yearly", 4: "quarterly", 12: "monthly" }[n] || "quarterly"} compounding)` },
      tax > 0 && { type: "warn", msg: `After ${taxRate}% tax on interest: net maturity = ${fmtC(netMaturity)}` },
    ].filter(Boolean),
  };
}

// ── Loan Comparison Calculator ────────────────────────────────────────
export function calcLoanCompare({ loans }) {
  if (!loans?.length) return null;
  const results = loans.map((l, i) => {
    const P = +l.principal || 0, r = (+l.rate || 0) / 1200, n = (+l.tenure || 1) * 12;
    if (!P || !r || !n) return null;
    const emi = round(P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
    const total = round(emi * n);
    const interest = round(total - P);
    return { label: l.label || `Loan ${i + 1}`, principal: P, rate: +l.rate, tenure: +l.tenure, emi, total, interest, interestRatio: round(interest / total * 100, 1) };
  }).filter(Boolean);
  if (!results.length) return null;
  const best = results.reduce((a, b) => a.total < b.total ? a : b);
  return {
    results, best,
    breakdowns: results.flatMap(r => [
      { label: `${r.label} — EMI`, value: fmtC(r.emi), bold: true },
      { label: `${r.label} — Total`, value: fmtC(r.total) },
      { label: `${r.label} — Interest`, value: fmtC(r.interest) },
    ]),
    insights: [
      { type: "good", msg: `Best deal: ${best.label} saves most — lowest total cost of ${fmtC(best.total)}` },
      results.length > 1 && { type: "info", msg: `Interest difference: ${fmtC(Math.max(...results.map(r => r.interest)) - Math.min(...results.map(r => r.interest)))}` },
    ].filter(Boolean),
  };
}

// ── Calories Burned Calculator ────────────────────────────────────────
export const MET_ACTIVITIES = [
  { label: "Walking (moderate, 5km/h)", met: 3.5 },
  { label: "Running (8km/h)", met: 8.0 },
  { label: "Running (10km/h)", met: 10.0 },
  { label: "Cycling (leisure)", met: 4.0 },
  { label: "Cycling (vigorous)", met: 8.0 },
  { label: "Swimming (moderate)", met: 6.0 },
  { label: "Jump Rope", met: 11.0 },
  { label: "Weight Training", met: 3.5 },
  { label: "HIIT", met: 9.0 },
  { label: "Yoga", met: 2.5 },
  { label: "Dancing", met: 5.0 },
  { label: "Soccer", met: 7.0 },
  { label: "Basketball", met: 6.5 },
  { label: "Tennis", met: 7.3 },
  { label: "Badminton", met: 5.5 },
  { label: "Hiking", met: 6.0 },
  { label: "Elliptical (moderate)", met: 5.0 },
  { label: "Rowing (moderate)", met: 7.0 },
  { label: "Rock Climbing", met: 8.0 },
  { label: "Stair Climbing", met: 9.0 },
  { label: "Pilates", met: 3.0 },
  { label: "Martial Arts", met: 10.0 },
  { label: "Gardening", met: 3.5 },
  { label: "Housework", met: 3.0 },
  { label: "Sleeping", met: 0.9 },
];
export function calcCaloriesBurned({ weight, duration, met }) {
  const w = +weight || 70, d = +duration || 30, m = +met || 5;
  const calories = round(m * w * (d / 60));
  const fatGrams = round(calories / 9);
  const top5 = [...MET_ACTIVITIES].sort((a, b) => b.met - a.met).slice(0, 5);
  return {
    calories, fatGrams,
    equivalents: {
      walkMins: round(calories / (3.5 * w / 60)),
      bigMacs: round(calories / 550, 1),
      apples: round(calories / 95, 1),
    },
    breakdowns: [
      { label: "Body Weight", value: w + " kg" },
      { label: "Duration", value: d + " min" },
      { label: "MET Value", value: m },
      { label: "Calories Burned", value: calories + " kcal", bold: true },
      { label: "Fat Burned (est.)", value: fatGrams + "g" },
    ],
    insights: [
      { type: "good", msg: `Burned ${calories} kcal — equivalent to ~${round(calories / 95, 1)} apples or ${round(calories / 550, 1)} Big Macs` },
      { type: "info", msg: `At this rate, you'd burn 1kg of fat in ${round(7700 / calories * (d / 60), 1)} hours of exercise` },
    ],
  };
}

// ── Sleep Calculator ──────────────────────────────────────────────────
export function calcSleep({ mode, time }) {
  const CYCLE = 90, ONSET = 14; // minutes
  const parseTime = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const addMins = (base, add) => {
    const total = (base + add + 1440) % 1440;
    const h = Math.floor(total / 60), m = total % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };
  const baseMin = parseTime(time || "22:00");
  const cycles = [4, 5, 6];
  let results;
  if (mode === "bedtime") {
    // Given wake time, find bedtimes
    results = cycles.map(c => {
      const sleepMin = c * CYCLE + ONSET;
      const bed = addMins(baseMin, -sleepMin);
      return { cycles: c, hours: round(c * CYCLE / 60, 1), bedtime: bed, wakeup: time };
    });
  } else {
    // Given bedtime, find wake times
    results = cycles.map(c => {
      const sleepMin = c * CYCLE + ONSET;
      const wake = addMins(baseMin, sleepMin);
      return { cycles: c, hours: round(c * CYCLE / 60, 1), bedtime: time, wakeup: wake };
    });
  }
  const recommended = results.find(r => r.cycles === 5) || results[1];
  return {
    results, recommended, onsetMins: ONSET,
    breakdowns: results.map(r => ({
      label: `${r.cycles} cycles (${r.hours}h)`,
      value: mode === "bedtime" ? `Bed at ${r.bedtime}` : `Wake at ${r.wakeup}`,
      bold: r.cycles === 5,
    })),
    insights: [
      { type: "good", msg: `Optimal: ${recommended.cycles} cycles = ${recommended.hours}h of sleep` },
      { type: "info", msg: "Each sleep cycle is ~90 min. Waking mid-cycle causes grogginess." },
      { type: "info", msg: "Adults need 5–6 cycles (7.5–9 hours) for full restoration." },
    ],
  };
}

// ── Logarithm Calculator ──────────────────────────────────────────────
export function calcLog({ value, base = "10" }) {
  const v = +value;
  if (v <= 0) return null;
  const b = base === "e" ? Math.E : base === "2" ? 2 : +base || 10;
  const result = base === "e" ? Math.log(v) : Math.log(v) / Math.log(b);
  const log10 = Math.log10(v), log2 = Math.log2(v), ln = Math.log(v);
  return {
    result: round(result, 8),
    log10: round(log10, 8), log2: round(log2, 8), ln: round(ln, 8),
    antilog: round(Math.pow(b, result), 6),
    breakdowns: [
      { label: `log${base === "e" ? "ₑ" : base === "10" ? "₁₀" : `(${base})`}(${v})`, value: round(result, 8), bold: true },
      { label: "log₁₀(" + v + ")", value: round(log10, 8) },
      { label: "log₂(" + v + ")", value: round(log2, 8) },
      { label: "ln(" + v + ")", value: round(ln, 8) },
      { label: `Antilog (${b}^result)`, value: round(Math.pow(b, result), 4) },
    ],
    insights: [
      { type: "info", msg: `log${base === "e" ? "ₑ" : base}(${v}) = ${round(result, 6)}` },
      { type: "info", msg: `Change of base: ln(${v}) / ln(${b}) = ${round(result, 6)}` },
    ],
  };
}

// ── Ratio Calculator ──────────────────────────────────────────────────
export function calcRatio({ a, b, c, d, mode = "simplify" }) {
  const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);
  const av = +a || 0, bv = +b || 1, cv = +c || 0, dv = +d || 0;
  if (mode === "simplify") {
    if (!av || !bv) return null;
    const g = gcd(Math.abs(av), Math.abs(bv));
    const sa = av / g, sb = bv / g;
    const decimal = round(av / bv, 6);
    return {
      simplified: `${sa} : ${sb}`, decimal, percentage: round(av / bv * 100, 2),
      parts: { a: sa, b: sb, total: sa + sb },
      breakdowns: [
        { label: "Original Ratio", value: `${av} : ${bv}` },
        { label: "Simplified", value: `${sa} : ${sb}`, bold: true },
        { label: "Decimal", value: decimal },
        { label: "Percentage A", value: round(sa / (sa + sb) * 100, 2) + "%" },
        { label: "Percentage B", value: round(sb / (sa + sb) * 100, 2) + "%" },
      ],
      insights: [{ type: "good", msg: `${av}:${bv} simplifies to ${sa}:${sb}` }],
    };
  } else if (mode === "missing") {
    // a:b = c:? → d = b*c/a
    if (!av || !bv || !cv) return null;
    const missing = round(bv * cv / av, 6);
    return {
      result: missing,
      breakdowns: [
        { label: "Ratio", value: `${av} : ${bv}` },
        { label: "Given", value: cv },
        { label: "Missing Value", value: missing, bold: true },
      ],
      insights: [{ type: "good", msg: `${av}:${bv} = ${cv}:${missing}` }],
    };
  }
  return null;
}

// ── Reading Time Calculator ────────────────────────────────────────────
export function calcReadingTime({ wordCount, wpm = 200 }) {
  const w = +wordCount || 0, speed = +wpm || 200;
  if (!w) return null;
  const minutes = w / speed;
  const fast = round(w / 300, 1), avg = round(w / 200, 1), slow = round(w / 130, 1);
  const speakMins = round(w / 130, 1);
  const pages = round(w / 250, 1); // avg page = 250 words
  return {
    minutes: round(minutes, 1), fast, avg, slow, speakMins, pages,
    formatted: minutes < 1 ? "< 1 min" : `${Math.floor(minutes)}m ${Math.round((minutes % 1) * 60)}s`,
    breakdowns: [
      { label: "Word Count", value: w.toLocaleString() },
      { label: "Your WPM", value: speed },
      { label: "Reading Time", value: round(minutes, 1) + " min", bold: true },
      { label: "Fast Reader (300 WPM)", value: fast + " min" },
      { label: "Average (200 WPM)", value: avg + " min" },
      { label: "Slow Reader (130 WPM)", value: slow + " min" },
      { label: "Speaking Time", value: speakMins + " min" },
      { label: "Approx. Pages", value: pages + " pages" },
    ],
    insights: [
      { type: "info", msg: `At ${speed} WPM, ${w.toLocaleString()} words takes ${round(minutes, 1)} minutes` },
      { type: "info", msg: `Equivalent to ~${pages} pages of a book` },
    ],
  };
}

// Re-export helpers for backward compat
export { fmtC as formatC, round as roundN };
