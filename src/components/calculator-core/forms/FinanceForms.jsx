import { useState, useEffect } from "react";
import { 
  calcEMI, calcCompound, calcSIP, calcSalary, calcGST, calcPPF, 
  calcSimpleInterest, calcProfitMargin, calcBreakEven, calcDiscount, 
  calcTip, calcTax, calcROI, convertCurrency, round, fmtC, fmt 
} from "@/core/calculationEngine.js";
import { 
  L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency, formatMoney 
} from "./SharedComponents.jsx";
import { ResultBox } from "@/components/ui/ResultBox.jsx";
import { StatsGrid } from "@/components/ui/StatsGrid.jsx";
import { InsightBox } from "@/components/ui/InsightBox.jsx";
import { Breakdown } from "@/components/ui/Breakdown.jsx";
import { CalcChart } from "@/components/charts/LazyCalcChart.jsx";
import { readCalcParams } from "@/utils/urlParams.js";
import { ScenarioCompare } from "@/components/calculator-core/ScenarioCompare.jsx";

// ── EMI & Mortgage Calculator (Enterprise Grade) ─────────────────────
export function EMIForm(){
  const { fm, fmSlider, sym, currency } = useCurrency();
  const init = readCalcParams({ p: 5000000, r: 8.5, y: 20 });
  const [p,setP]=useState(init.p);
  const [r,setR]=useState(init.r);
  const [y,setY]=useState(init.y);
  const [ex,setEx]=useState("");
  const [cr,setCr]=useState("");
  const [balloon,setBalloon]=useState("");
  const [interestOnly,setInterestOnly]=useState(false);
  
  const [res,setRes]=useState(null),[load,setLoad]=useState(false);
  const fmtM=v=>fmSlider(v);

  useEffect(()=>{
    setLoad(true);
    const t=setTimeout(()=>{
      const d=calcEMI({
        principal:p, interestRate:r, tenure:y, 
        extraPayment:+ex||0, compareRate:cr||null, 
        balloonPayment:+balloon||0, interestOnly
      });
      if(!d){setRes(null);setLoad(false);return;}
      const chart={type:"area",data:d.schedule,keys:["principal","interest","balance"]};
      
      const stats = [
        {label:"Total Payable",value:fm(d.total),highlight:true},
        {label:"Total Interest",value:fm(d.interest),warn:d.interest/d.total>0.5},
        {label:"Interest %",value:d.interestRatio+"%"},
        {label:"Affordable If Income",value:fm(d.affordIncome40)+"/mo"}
      ];

      setRes(buildResult("Monthly EMI",fm(d.emi), stats, d.insights, chart, d.breakdowns));
      setLoad(false);
    },150); // slight debounce for smooth slider feel
    return()=>clearTimeout(t);
  },[p,r,y,ex,cr,balloon,interestOnly]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Presets items={[
          {label:"🏠 Home Loan",v:{p:5000000,r:8.5,y:20,b:0,io:false}},
          {label:"🚗 Car Loan",v:{p:1200000,r:10.5,y:5,b:0,io:false}},
          {label:"💼 Interest-Only",v:{p:2000000,r:12,y:3,b:0,io:true}}
        ]} onApply={pr=>{setP(pr.v.p);setR(pr.v.r);setY(pr.v.y);setBalloon(pr.v.b||"");setInterestOnly(pr.v.io||false);}}/>
        
        <Sl label="Loan Amount" id="ep" min={100000} max={50000000} step={100000} value={p} onChange={setP} fmt={fmtM}/>
        <Sl label="Interest Rate (% p.a.)" id="er" min={1} max={30} step={0.1} value={r} onChange={setR} fmt={v=>`${v}%`}/>
        <Sl label="Loan Tenure" id="ey" min={1} max={30} value={y} onChange={setY} fmt={v=>`${v} yr${v>1?"s":""}`}/>
        
        <div style={{display:"flex",gap:12,marginTop:16,marginBottom:16,padding:"14px",background:"var(--surface2)",borderRadius:"var(--r-lg)",border:"1px solid var(--border)",alignItems:"center"}}>
          <div style={{flex:1}}>
            <p style={{fontSize:13,fontWeight:700,color:"var(--text)"}}>Interest-Only Repayment</p>
            <p style={{fontSize:12,color:"var(--text3)",marginTop:2}}>Pay only interest during the loan tenure.</p>
          </div>
          <div className="toggle-switch">
            <input type="checkbox" id="io_toggle" checked={interestOnly} onChange={e=>setInterestOnly(e.target.checked)} style={{width:18,height:18,accentColor:"var(--brand)",cursor:"pointer"}}/>
          </div>
        </div>

        <Row2>
          <N label="Extra Monthly Payment" id="ex" value={ex} onChange={setEx} unit={sym} placeholder="0" hint="Reduces tenure and total interest"/>
          <N label="Balloon Payment (End)" id="bal" value={balloon} onChange={setBalloon} unit={sym} placeholder="0" hint="Lump sum at end of tenure" disabled={interestOnly}/>
        </Row2>
        
        <div style={{marginTop:12}}>
          <N label="Refinance Compare Rate" id="cr" value={cr} onChange={setCr} unit="%" placeholder="e.g. 7.5" hint="Compare EMI at a different rate"/>
        </div>
      </div>
      
      <div className="sticky-res">
        <Panel result={res} loading={load} label="Monthly EMI" shareParams={{p,r,y,ex:ex||undefined,cr:cr||undefined}}/>
        {res?.primary && res?.chart && (
          <div style={{marginTop:14,padding:"14px",background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"var(--r-lg)"}}>
            <p style={{fontSize:11,fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:8}}>Income Affordability Guidelines</p>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13,paddingBottom:8,borderBottom:"1px solid var(--border)",marginBottom:8}}>
              <span style={{color:"var(--text2)"}}>Safe Limit (40% of Income)</span>
              <strong style={{color:"var(--brand)"}}>{formatMoney(p/12*100/40)}/mo</strong>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
              <span style={{color:"var(--text2)"}}>Max Stretch (50% of Income)</span>
              <strong style={{color:"var(--brand)"}}>{formatMoney(p/12*100/50)}/mo</strong>
            </div>
          </div>
        )}
        <ScenarioCompare
          currentResult={res}
          currentParams={{p,r,y,ex,balloon,interestOnly}}
          calcLabel="Monthly EMI"
          onRestoreParams={(params)=>{setP(params.p);setR(params.r);setY(params.y);setEx(params.ex||"");setBalloon(params.balloon||"");setInterestOnly(params.interestOnly||false);}}
        />
      </div>
    </div>
  );
}

// ── Compound Interest ────────────────────────────────────────────────
export function CompoundForm(){
  const { fm, fmSlider, sym, vatLabel, taxRate, cur, currency } = useCurrency();
  const init = readCalcParams({ p: 100000, r: 8, y: 10 });
  const [p,setP]=useState(init.p),[r,setR]=useState(init.r),[y,setY]=useState(init.y),[f,setF]=useState("12"),[c,setC]=useState("0"),[inf,setInf]=useState("0"),[tax,setTax]=useState("0"),[goalMode,setGoalMode]=useState(false),[target,setTarget]=useState("1000000");
  const [res,setRes]=useState(null),[load,setLoad]=useState(false);
  const fmtM=v=>fmSlider(v);
  useEffect(()=>{
    setLoad(true);
    const t=setTimeout(()=>{
      const d=calcCompound({principal:p,rate:r,years:y,frequency:f,contribution:+c||0,inflationRate:+inf||0,taxRate:+tax||0});
      if(!d){setRes(null);setLoad(false);return;}
      const goalNeeded=goalMode&&target?d.goalSeek(+target):null;
      const chart={type:"area",data:d.pts,keys:["nominal","invested","real"]};
      setRes(buildResult("Final Amount",fm(d.final),
        [{label:"Total Invested",value:fm(d.invested)},{label:"Gains",value:fm(d.gains),highlight:true},{label:"Multiplier",value:d.mult+"×"},{label:"Real Value",value:fm(d.real)}],
        [...d.insights,...(goalNeeded!=null?[{type:"info",msg:`To reach ${formatMoney(+target)}: invest ${formatMoney(goalNeeded)}/month`}]:[])],
        chart,d.breakdowns));
      setLoad(false);
    },80);
    return()=>clearTimeout(t);
  },[p,r,y,f,c,inf,tax,goalMode,target]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Sl label="Principal Amount" id="cp" min={1000} max={5000000} step={1000} value={p} onChange={setP} fmt={fmtM}/>
        <Sl label="Annual Interest Rate" id="cr" min={1} max={25} step={0.25} value={r} onChange={setR} fmt={v=>`${v}%`}/>
        <Sl label="Time Period" id="cy" min={1} max={40} value={y} onChange={setY} fmt={v=>`${v} years`}/>
        <Sel label="Compounding Frequency" id="cf" value={f} onChange={setF} opts={[{v:"1",l:"Annually"},{v:"4",l:"Quarterly"},{v:"12",l:"Monthly"},{v:"365",l:"Daily"}]}/>
        <Row2>
          <N label="Monthly Contribution" id="cc" value={c} onChange={setC} unit={sym} placeholder="0"/>
          <N label="Inflation Rate" id="ci" value={inf} onChange={setInf} unit="%" placeholder="0" hint="Adj for real value"/>
        </Row2>
        <N label="Tax on Gains" id="ct" value={tax} onChange={setTax} unit="%" placeholder="0"/>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <input type="checkbox" checked={goalMode} onChange={e=>setGoalMode(e.target.checked)} style={{accentColor:"var(--brand)",width:14,height:14}}/>
          <span style={{fontSize:13,fontWeight:600,color:"var(--text2)"}}>Goal Mode: Find required monthly investment</span>
        </div>
        {goalMode&&<N label="Target Amount" id="ctg" value={target} onChange={setTarget} unit={sym} placeholder="1000000"/>}
      </div>
      <div className="sticky-res">
        <Panel result={res} loading={load} label="Final Amount" shareParams={{p,r,y,f,c:c||undefined}}/>
        <ScenarioCompare
          currentResult={res}
          currentParams={{p,r,y,f,c,inf,tax}}
          calcLabel="Final Amount"
          onRestoreParams={(params)=>{setP(params.p);setR(params.r);setY(params.y);setF(params.f);setC(params.c||"0");setInf(params.inf||"0");setTax(params.tax||"0");}}
        />
      </div>
    </div>
  );
}

// ── SIP Calculator ───────────────────────────────────────────────────
export function SIPForm(){
  const { fm, fmSlider, sym, vatLabel, taxRate, cur, currency } = useCurrency();
  const init = readCalcParams({ amt: 5000, r: 12, y: 10 });
  const [amt,setAmt]=useState(init.amt),[r,setR]=useState(init.r),[y,setY]=useState(init.y),[su,setSu]=useState("0");
  const [res,setRes]=useState(null),[load,setLoad]=useState(false);
  const fmtM=v=>fmSlider(v);
  useEffect(()=>{
    setLoad(true);
    const t=setTimeout(()=>{
      const d=calcSIP({monthlyAmount:amt,annualReturn:r,duration:y,stepUp:su});
      if(!d){setRes(null);setLoad(false);return;}
      const chart={type:"area",data:d.pts,keys:["corpus","invested"]};
      setRes(buildResult("Future Wealth",fm(d.corpus),
        [{label:"Invested",value:fm(d.invested)},{label:"Wealth Gained",value:fm(d.gains),highlight:true},{label:"Total Return",value:d.returnPct+"%"},{label:"Est. XIRR",value:d.xirr+"%"}],
        d.insights,chart,d.breakdowns));
      setLoad(false);
    },80);
    return()=>clearTimeout(t);
  },[amt,r,y,su]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Presets items={[{label:"🌱 Beginner",v:{amt:2000,r:12,y:10}},{label:"📈 Wealth Builder",v:{amt:15000,r:13,y:15}},{label:"🚀 Aggressive",v:{amt:50000,r:15,y:20}}]}
          onApply={p=>{setAmt(p.v.amt);setR(p.v.r);setY(p.v.y);}}/>
        <Sl label="Monthly SIP Amount" id="sa" min={500} max={200000} step={500} value={amt} onChange={setAmt} fmt={fmtM}/>
        <Sl label="Expected Annual Return" id="sr" min={1} max={30} step={0.5} value={r} onChange={setR} fmt={v=>`${v}%`}/>
        <Sl label="Time Period" id="sy" min={1} max={40} value={y} onChange={setY} fmt={v=>`${v} years`}/>
        <N label="Annual Step-up (%)" id="ssu" value={su} onChange={setSu} unit="%" placeholder="0" hint="💡 Increase SIP every year to beat inflation"/>
      </div>
      <div className="sticky-res">
        <Panel result={res} loading={load} label="Future Wealth" shareParams={{amt,r,y,su:su||undefined}}/>
        <ScenarioCompare
          currentResult={res}
          currentParams={{amt,r,y,su}}
          calcLabel="Future Wealth"
          onRestoreParams={(params)=>{setAmt(params.amt);setR(params.r);setY(params.y);setSu(params.su||"0");}}
        />
      </div>
    </div>
  );
}

// ── ROI Calculator ───────────────────────────────────────────────────
export function ROIForm(){
  const { fm, fmSlider, sym, vatLabel, taxRate, cur, currency } = useCurrency();
  const init = readCalcParams({ inv: 100000, ret: 150000, y: 2 });
  const [inv,setInv]=useState(String(init.inv)),[ret,setRet]=useState(String(init.ret)),[y,setY]=useState(init.y),[inf,setInf]=useState("0");
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const t=setTimeout(()=>{
      const d=calcROI({investment:inv,returns:ret,years:y,inflationRate:inf});
      if(!d){setRes(null);return;}
      const chart={type:"area",data:d.pts,keys:["value"],xKey:"year"};
      setRes(buildResult("Total ROI",d.roi+"%",
        [{label:"Profit",value:fm(d.profit),highlight:d.profit>0,warn:d.profit<0},{label:"Annual ROI",value:d.annualROI+"%"},{label:"Real ROI",value:d.realROI+"%"},{label:"Multiple",value:d.multiple+"×"}],
        d.insights,chart,d.breakdowns));
    },80);
    return()=>clearTimeout(t);
  },[inv,ret,y,inf]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <N label="Total Investment" id="ri" value={inv} onChange={setInv} unit={sym}/>
        <N label="Total Return (exit value)" id="rr" value={ret} onChange={setRet} unit={sym}/>
        <Sl label="Time Period" id="ry" min={1} max={20} value={y} onChange={setY} fmt={v=>`${v} years`}/>
        <N label="Inflation Rate" id="rinf" value={inf} onChange={setInf} unit="%" placeholder="0" hint="For inflation-adjusted real return"/>
      </div>
      <div className="sticky-res">
        <Panel result={res} loading={null} label="Total ROI" shareParams={{inv,ret,y}}/>
        <ScenarioCompare
          currentResult={res}
          currentParams={{inv,ret,y,inf}}
          calcLabel="Total ROI"
          onRestoreParams={(params)=>{setInv(String(params.inv));setRet(String(params.ret));setY(params.y);setInf(params.inf||"0");}}
        />
      </div>
    </div>
  );
}

// ── Salary ───────────────────────────────────────────────────────────
export function SalaryForm(){
  const { fm, fmSlider, sym, vatLabel, taxRate, cur, currency, countryCode } = useCurrency();
  const [amt,setAmt]=useState("50000"),[period,setPeriod]=useState("monthly"),[allw,setAllw]=useState("0"),[dedu,setDedu]=useState("0");
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const t=setTimeout(()=>{
      // Map country code to salary region: PK → pk, IN → in, US → us, otherwise → global
      const regionMap = { PK:'pk', IN:'in', US:'us', GB:'uk', CA:'ca', AU:'au' };
      const region = regionMap[countryCode] || 'global';
      const d=calcSalary({amount:amt,period,region,allowances:+allw||0,deductions:+dedu||0});
      if(!d){setRes(null);return;}
      const chart = { type: "donut", data: [
        { name: "Take Home", value: d.netMonthly, color: "var(--brand)" },
        { name: "Tax", value: d.monthlyTax, color: "#f87171" },
        { name: "Deductions", value: +dedu || 0, color: "#94a3b8" }
      ]};
      setRes(buildResult("Net Monthly Income",fm(d.netMonthly),
        [{label:"Gross Monthly",value:fm(d.monthly)},{label:"Annual Tax",value:fm(d.annualTax),warn:true},{label:"Effective Rate",value:d.effRate+"%"},{label:"Net Annual",value:fm(d.netMonthly*12)}],
        d.insights,chart,d.breakdowns));
    },80);
    return()=>clearTimeout(t);
  },[amt,period,allw,dedu,currency]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <N label="Salary Amount" id="samt" value={amt} onChange={setAmt} unit={sym}/>
        <Sel label="Pay Period" id="spd" value={period} onChange={setPeriod} opts={[{v:"hourly",l:"Hourly"},{v:"daily",l:"Daily"},{v:"weekly",l:"Weekly"},{v:"monthly",l:"Monthly"},{v:"annual",l:"Annual"}]}/>
        <Row2>
          <N label="Monthly Allowances" id="sa" value={allw} onChange={setAllw} unit={sym} placeholder="0"/>
          <N label="Monthly Deductions" id="sd" value={dedu} onChange={setDedu} unit={sym} placeholder="0"/>
        </Row2>
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Net Salary" shareParams={{amt,period}}/></div>
    </div>
  );
}

// ── Income Tax ───────────────────────────────────────────────────────
export function TaxForm(){
  const { fm, fmSlider, sym, vatLabel, taxRate, cur, currency, countryCode } = useCurrency();
  const [income,setIncome]=useState("1200000"),[period,setPeriod]=useState("annual");
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const t=setTimeout(()=>{
      // Map country code to tax region
      const regionMap = { PK:'pk', IN:'in', US:'us', GB:'uk', CA:'ca', AU:'au' };
      const region = regionMap[countryCode] || 'global';
      const d=calcTax({income,period,region});
      if(!d){setRes(null);return;}
      const chart={type:"pie",data:[{name:vatLabel,value:d.tax,color:"#ef4444"},{name:"Net Income",value:d.grossAnnual-d.tax,color:"var(--brand)"}]};
      setRes(buildResult("Income Tax",fm(d.tax),
        [{label:"Effective Rate",value:d.effRate+"%",highlight:true},{label:"Monthly Tax",value:fm(d.monthlyTax)},{label:"Net Annual",value:fm(d.netAnnual)},{label:"Current Slab",value:d.slabLabel}],
        d.insights,chart,d.slabBreakdown));
    },80);
    return()=>clearTimeout(t);
  },[income,period,countryCode]);

  // Generate country-specific notes
  const taxNotes = {
    PK: "Tax is calculated using official FBR Salary Slabs for 2024-2025.",
    IN: "Tax is calculated using India Income Tax slabs for 2024-2025.",
    US: "US Federal income tax estimated. State taxes vary.",
    GB: "UK income tax estimated using HMRC bands for 2024-2025.",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <N label="Total Income" id="ti" value={income} onChange={setIncome} unit={sym}/>
        <Tabs tabs={["Annual","Monthly"]} active={period==="annual"?"Annual":"Monthly"} onChange={v=>setPeriod(v.toLowerCase())}/>
        <div style={{marginTop:24,padding:16,background:"var(--surface2)",borderRadius:"var(--r-lg)",border:"1.5px solid var(--border)"}}>
          <p style={{fontSize:12,color:"var(--text2)",lineHeight:1.6}}>
            <strong>Note:</strong> {taxNotes[countryCode] || `${vatLabel} is calculated using a global estimated flat rate. Actual rates vary by jurisdiction.`}
          </p>
        </div>
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Income Tax" shareParams={{income,period}}/></div>
    </div>
  );
}

// ── GST / VAT ────────────────────────────────────────────────────────
export function GSTForm(){
  const { fm, sym, vatLabel, taxRate: regionRate, cur } = useCurrency();
  // Default rate comes from the detected region, fallback to 18
  const defaultRate = regionRate > 0 ? regionRate : 18;
  const [amt,setAmt]=useState("10000");
  const [rate,setRate]=useState(defaultRate);
  const [type,setType]=useState("inclusive");
  const [res,setRes]=useState(null);

  // Reset rate when region changes
  useEffect(()=>{ setRate(regionRate > 0 ? regionRate : 18); },[regionRate]);

  useEffect(()=>{
    const d=calcGST({amount:amt,gstRate:rate,type});
    if(!d){setRes(null);return;}
    setRes(buildResult(vatLabel+" Amount",fm(d.gstAmt),
      [{label:"Base Amount",value:fm(d.base)},{label:"Final Total",value:fm(d.total),highlight:true},{label:vatLabel+" Rate",value:rate+"%"}],
      d.insights,null,d.breakdowns));
  },[amt,rate,type,vatLabel]);

  // Show 4 common preset rates — include the region default
  const presetRates = [...new Set([regionRate > 0 ? regionRate : 18, 5, 10, 15, 20].filter(Boolean))].sort((a,b)=>a-b).slice(0,5);

  return (
    <div>
      <Tabs tabs={[`${vatLabel} Exclusive`,`${vatLabel} Inclusive`]} active={type==="exclusive"?`${vatLabel} Exclusive` : `${vatLabel} Inclusive`} onChange={v=>setType(v.toLowerCase().includes("exclusive")?"exclusive":"inclusive")}/>
      <N label="Amount" id="ga" value={amt} onChange={setAmt} unit={sym}/>
      <L t={vatLabel + " Rate"} id="gr"/>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        {presetRates.map(r=>(
          <button key={r} onClick={()=>setRate(r)} style={{padding:"8px 16px",borderRadius:"var(--r-md)",border:rate===r?"2px solid var(--brand)":"1px solid var(--border)",background:rate===r?"var(--p50)":"var(--surface)",color:rate===r?"var(--brand)":"var(--text2)",fontWeight:700,fontSize:13,cursor:"pointer"}}>{r}%{r===regionRate&&regionRate>0?" ✓":""}</button>
        ))}
        <input type="number" value={rate} onChange={e=>setRate(e.target.value)} style={{width:70,height:38,padding:"0 10px",borderRadius:"var(--r-md)",border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",fontSize:13}} placeholder="Custom"/>
      </div>
      {regionRate > 0 && (
        <p style={{fontSize:11,color:"var(--text3)",marginBottom:12}}>✅ Default {vatLabel} rate for your region: <strong>{regionRate}%</strong></p>
      )}
      {res&&<Panel result={res} loading={null} label={vatLabel}/>}
    </div>
  );
}

// ── PPF Calculator ───────────────────────────────────────────────────
export function PPFForm(){
  const { fm, fmSlider, sym } = useCurrency();
  const [amt,setAmt]=useState(150000),[y,setY]=useState(15),[r,setR]=useState(7.1);
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const d=calcPPF({annual:amt,years:y,rate:r});
    if(!d){setRes(null);return;}
    const chart={type:"area",data:d.pts,keys:["balance","invested"]};
    setRes(buildResult("Maturity Value",fm(d.maturity),
      [{label:"Total Invested",value:fm(d.total)},{label:"Interest Earned",value:fm(d.interest),highlight:true},{label:"Maturity",value:fm(d.maturity),highlight:true}],
      d.insights,chart,d.breakdowns));
  },[amt,y,r]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Sl label="Annual Investment" id="pa" min={500} max={150000} step={500} value={amt} onChange={setAmt} fmt={v=>fmSlider(v)}/>
        <Sl label="Time Period" id="py" min={15} max={50} value={y} onChange={setY} fmt={v=>`${v} years`}/>
        <N label="Interest Rate (%)" id="pr" value={r} onChange={setR} unit="%" placeholder="7.1"/>
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Maturity Value"/></div>
    </div>
  );
}

// ── Simple Interest (Upgraded — Sliders + Area Chart) ────────────────
export function SimpleInterestForm(){
  const { fm, fmSlider, sym } = useCurrency();
  const init = readCalcParams({ p: 500000, r: 10, t: 5 });
  const [p,setP]=useState(init.p);
  const [r,setR]=useState(init.r);
  const [t,setT]=useState(init.t);
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const timer=setTimeout(()=>{
      const d=calcSimpleInterest({principal:p,rate:r,time:t});
      if(!d){setRes(null);return;}
      // Generate growth comparison data (SI vs CI)
      const chartData = [];
      for (let yr = 0; yr <= t; yr++) {
        const siVal = +p + (+p * +r * yr / 100);
        const ciVal = +p * Math.pow(1 + +r / 100, yr);
        chartData.push({ year: `Year ${yr}`, simple: Math.round(siVal), compound: Math.round(ciVal) });
      }
      const P = +p, R = +r, T = +t;
      const chart = { type: "area", data: chartData, keys: ["simple", "compound"], xKey: "year" };
      const ciTotal = Math.round(P * Math.pow(1 + R / 100, T));
      const ciInterest = ciTotal - P;
      setRes(buildResult("Total Amount",fm(d.total),
        [{label:"Principal",value:fm(P)},{label:"SI Earned",value:fm(d.si),highlight:true},{label:"CI Would Be",value:fm(ciInterest)},{label:"CI Advantage",value:fm(ciInterest - d.si),warn:true}],
        d.insights,chart,d.breakdowns));
    },120);
    return()=>clearTimeout(timer);
  },[p,r,t]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Sl label="Principal Amount" id="sip" min={10000} max={10000000} step={10000} value={p} onChange={setP} fmt={v=>fmSlider(v)}/>
        <Sl label="Interest Rate (% p.a.)" id="sir" min={1} max={30} step={0.5} value={r} onChange={setR} fmt={v=>`${v}%`}/>
        <Sl label="Time Period" id="sit" min={1} max={30} value={t} onChange={setT} fmt={v=>`${v} year${v>1?"s":""}`}/>
        <div style={{marginTop:14,padding:"12px 14px",background:"var(--surface2)",borderRadius:"var(--r-lg)",border:"1px solid var(--border)",fontSize:12,color:"var(--text3)"}}>
          💡 <strong>Chart shows SI vs CI comparison</strong> — see how compounding outperforms simple interest over time.
        </div>
      </div>
      <div className="sticky-res">
        <Panel result={res} loading={null} label="Total Amount" shareParams={{p,r,t}}/>
      </div>
    </div>
  );
}

// ── Profit Margin (Upgraded — Donut Chart + Slider) ──────────────────
export function ProfitMarginForm(){
  const { fm, fmSlider, sym } = useCurrency();
  const init = readCalcParams({ cost: 10000, rev: 15000 });
  const [cost,setCost]=useState(init.cost);
  const [rev,setRev]=useState(init.rev);
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const timer=setTimeout(()=>{
      const d=calcProfitMargin({cost,price:rev});
      if(!d){setRes(null);return;}
      const chart = {type:"donut",data:[
        {name:"Cost",value:+cost,color:"#dc2626"},
        {name:"Profit",value:Math.max(0,+rev - +cost),color:"#16a34a"},
      ]};
      setRes(buildResult("Net Profit",fm(d.profit),
        [{label:"Gross Margin",value:d.margin+"%",highlight:d.margin>=20,warn:d.margin<10},{label:"Markup",value:d.markup+"%"},{label:"Health",value:d.health},{label:"Revenue",value:fm(+rev)}],
        d.insights,chart,d.breakdowns));
    },100);
    return()=>clearTimeout(timer);
  },[cost,rev]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Sl label="Cost Price" id="pmc" min={100} max={1000000} step={100} value={cost} onChange={setCost} fmt={v=>fmSlider(v)}/>
        <Sl label="Selling Price" id="pmr" min={100} max={1500000} step={100} value={rev} onChange={setRev} fmt={v=>fmSlider(v)}/>
        <div style={{marginTop:14,padding:"14px",background:rev>cost?"#f0fdf4":"#fef2f2",borderRadius:"var(--r-lg)",border:`1.5px solid ${rev>cost?"#86efac":"#fca5a5"}`,textAlign:"center"}}>
          <p style={{fontSize:11,fontWeight:700,color:rev>cost?"#16a34a":"#dc2626",textTransform:"uppercase",letterSpacing:".06em"}}>{rev>cost?"✅ Profitable":"❌ Loss"}</p>
          <p style={{fontSize:20,fontWeight:900,color:rev>cost?"#16a34a":"#dc2626",fontFamily:"var(--font-display)"}}>{((rev-cost)/Math.max(rev,1)*100).toFixed(1)}% margin</p>
        </div>
      </div>
      <div className="sticky-res">
        <Panel result={res} loading={null} label="Profit Margin" shareParams={{cost,rev}}/>
      </div>
    </div>
  );
}

// ── Break Even (Upgraded — Line Chart + Slider) ─────────────────────
export function BreakEvenForm(){
  const { fm, fmSlider, sym } = useCurrency();
  const init = readCalcParams({ fixed: 50000, price: 100, vCost: 60 });
  const [fixed,setFixed]=useState(init.fixed);
  const [price,setPrice]=useState(init.price);
  const [vCost,setVCost]=useState(init.vCost);
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const timer=setTimeout(()=>{
      const d=calcBreakEven({fixedCosts:fixed,sellingPrice:price,variableCost:vCost});
      if(!d){setRes(null);return;}
      // Generate revenue vs cost line chart data
      const beUnits = +d.beUnits || 100;
      const maxUnits = Math.ceil(beUnits * 2.5);
      const step = Math.max(1, Math.ceil(maxUnits / 12));
      const chartData = [];
      for (let u = 0; u <= maxUnits; u += step) {
        chartData.push({ label: `${u}`, revenue: u * +price, cost: +fixed + u * +vCost, profit: u * +price - (+fixed + u * +vCost) });
      }
      const chart = { type: "line", data: chartData, keys: ["revenue", "cost", "profit"], xKey: "label" };
      setRes(buildResult("Break-Even Units",d.beUnits+" units",
        [{label:"Break-Even Revenue",value:fm(d.beRevenue)},{label:"Contribution/Unit",value:fm(d.contribution)},{label:"Contrib Margin",value:d.contributionMargin+"%",highlight:true},{label:"Fixed Costs",value:fm(+fixed)}],
        d.insights,chart,d.breakdowns));
    },120);
    return()=>clearTimeout(timer);
  },[fixed,price,vCost]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Sl label="Total Fixed Costs" id="bef" min={1000} max={5000000} step={1000} value={fixed} onChange={setFixed} fmt={v=>fmSlider(v)}/>
        <Sl label="Price Per Unit" id="bep" min={1} max={10000} step={1} value={price} onChange={setPrice} fmt={v=>fmSlider(v)}/>
        <Sl label="Variable Cost Per Unit" id="bev" min={0} max={9999} step={1} value={vCost} onChange={setVCost} fmt={v=>fmSlider(v)}/>
        {+price > +vCost && (
          <div style={{marginTop:14,padding:"12px 14px",background:"var(--surface2)",borderRadius:"var(--r-lg)",border:"1px solid var(--border)",fontSize:12,color:"var(--text3)"}}>
            📊 Chart shows <strong>Revenue vs Total Cost</strong> intersection — the break-even point where profit begins.
          </div>
        )}
        {+price <= +vCost && (
          <div style={{marginTop:14,padding:"12px 14px",background:"#fef2f2",borderRadius:"var(--r-lg)",border:"1.5px solid #fca5a5",fontSize:12,color:"#dc2626",fontWeight:600}}>
            ⚠️ Price must exceed variable cost to ever break even.
          </div>
        )}
      </div>
      <div className="sticky-res">
        <Panel result={res} loading={null} label="Break-Even Point" shareParams={{fixed,price,vCost}}/>
      </div>
    </div>
  );
}

// ── Discount (Upgraded — Donut Chart + Slider) ──────────────────────
export function DiscountForm(){
  const { fm, fmSlider, sym } = useCurrency();
  const init = readCalcParams({ price: 5000, disc: 25, tax: 0 });
  const [price,setPrice]=useState(init.price);
  const [disc,setDisc]=useState(init.disc);
  const [tax,setTax]=useState(init.tax);
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const timer=setTimeout(()=>{
      const d=calcDiscount({originalPrice:price,discountPct:disc,taxRate:tax});
      if(!d){setRes(null);return;}
      const chart = {type:"donut",data:[
        {name:"You Pay",value:+d.final,color:"#2563eb"},
        {name:"You Save",value:+d.totalSaved,color:"#16a34a"},
        ...(+tax > 0 ? [{name:"Tax",value:Math.round(+d.final * +tax / 100),color:"#f59e0b"}] : []),
      ]};
      setRes(buildResult("Final Price",fm(d.final),
        [{label:"You Save",value:fm(d.totalSaved),highlight:true},{label:"Savings %",value:d.savingsPct+"%"},{label:"Original",value:fm(d.original)},{label:"Discount Amt",value:fm(Math.round(+price * +disc / 100))}],
        d.insights,chart,d.breakdowns));
    },100);
    return()=>clearTimeout(timer);
  },[price,disc,tax]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Sl label="Original Price" id="dp" min={100} max={500000} step={100} value={price} onChange={setPrice} fmt={v=>fmSlider(v)}/>
        <Sl label="Discount (%)" id="dd" min={1} max={90} step={1} value={disc} onChange={setDisc} fmt={v=>`${v}%`}/>
        <Sl label="Tax / GST (%)" id="dt" min={0} max={30} step={0.5} value={tax} onChange={setTax} fmt={v=>`${v}%`}/>
        {/* Visual price comparison */}
        <div style={{marginTop:16,padding:"16px",background:"var(--surface2)",borderRadius:"var(--r-lg)",border:"1px solid var(--border)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{fontSize:12,fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:".05em"}}>Price Comparison</span>
            <span style={{fontSize:11,fontWeight:800,color:"#16a34a",background:"#f0fdf4",padding:"2px 10px",borderRadius:100,border:"1px solid #86efac"}}>{disc}% OFF</span>
          </div>
          <div style={{display:"flex",gap:12}}>
            <div style={{flex:1,textAlign:"center",padding:"10px",borderRadius:"var(--r-md)",background:"var(--surface)",border:"1px solid var(--border)"}}>
              <p style={{fontSize:10,color:"var(--text3)",fontWeight:700,textTransform:"uppercase"}}>Original</p>
              <p style={{fontSize:18,fontWeight:800,color:"var(--text3)",textDecoration:"line-through"}}>{fm(+price)}</p>
            </div>
            <div style={{display:"flex",alignItems:"center",fontSize:18,color:"var(--text3)"}}>→</div>
            <div style={{flex:1,textAlign:"center",padding:"10px",borderRadius:"var(--r-md)",background:"#eff6ff",border:"1.5px solid #93c5fd"}}>
              <p style={{fontSize:10,color:"#2563eb",fontWeight:700,textTransform:"uppercase"}}>Final</p>
              <p style={{fontSize:18,fontWeight:800,color:"#2563eb"}}>{fm(Math.round(+price * (1 - +disc/100) * (1 + +tax/100)))}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="sticky-res">
        <Panel result={res} loading={null} label="Discount Price" shareParams={{price,disc,tax}}/>
      </div>
    </div>
  );
}

// ── Tip Calculator ───────────────────────────────────────────────────
export function TipForm(){
  const { fm, sym } = useCurrency();
  const [bill,setBill]=useState("1500"),[pct,setPct]=useState(15),[split,setSplit]=useState(1);
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const d=calcTip({bill,tipPct:pct,people:split});
    if(!d){setRes(null);return;}
    setRes(buildResult("Total Bill",fm(d.total),
      [{label:"Tip Amount",value:fm(d.tipAmt)},{label:"Per Person",value:fm(d.perPerson),highlight:split>1},{label:"Tip/Person",value:fm(d.tipPerPerson)}],
      d.insights,null,d.breakdowns));
  },[bill,pct,split]);
  return (
    <div>
      <N label="Bill Amount" id="tb" value={bill} onChange={setBill} unit={sym}/>
      <Sl label="Tip Percentage" id="tp" min={0} max={50} value={pct} onChange={setPct} fmt={v=>`${v}%`}/>
      <Sl label="Split (People)" id="ts" min={1} max={20} value={split} onChange={setSplit} fmt={v=>v}/>
      {res&&<Panel result={res} loading={null} label="Tip Total"/>}
    </div>
  );
}
