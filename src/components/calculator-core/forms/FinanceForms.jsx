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

// ── EMI & Mortgage Calculator (Enterprise Grade) ─────────────────────
export function EMIForm(){
  const { fm, fmSlider, sym, currency } = useCurrency();
  const [p,setP]=useState(5000000);
  const [r,setR]=useState(8.5);
  const [y,setY]=useState(20);
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
        <Panel result={res} loading={load} label="Monthly EMI"/>
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
      </div>
    </div>
  );
}

// ── Compound Interest ────────────────────────────────────────────────
export function CompoundForm(){
  const { fm, fmSlider, sym, vatLabel, taxRate, cur, currency } = useCurrency();
  const [p,setP]=useState(100000),[r,setR]=useState(8),[y,setY]=useState(10),[f,setF]=useState("12"),[c,setC]=useState("0"),[inf,setInf]=useState("0"),[tax,setTax]=useState("0"),[goalMode,setGoalMode]=useState(false),[target,setTarget]=useState("1000000");
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
      <div className="sticky-res"><Panel result={res} loading={load} label="Final Amount"/></div>
    </div>
  );
}

// ── SIP Calculator ───────────────────────────────────────────────────
export function SIPForm(){
  const { fm, fmSlider, sym, vatLabel, taxRate, cur, currency } = useCurrency();
  const [amt,setAmt]=useState(5000),[r,setR]=useState(12),[y,setY]=useState(10),[su,setSu]=useState("0");
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
      <div className="sticky-res"><Panel result={res} loading={load} label="Future Wealth"/></div>
    </div>
  );
}

// ── ROI Calculator ───────────────────────────────────────────────────
export function ROIForm(){
  const { fm, fmSlider, sym, vatLabel, taxRate, cur, currency } = useCurrency();
  const [inv,setInv]=useState("100000"),[ret,setRet]=useState("150000"),[y,setY]=useState(2),[inf,setInf]=useState("0");
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
      <div className="sticky-res"><Panel result={res} loading={null} label="Total ROI"/></div>
    </div>
  );
}

// ── Salary ───────────────────────────────────────────────────────────
export function SalaryForm(){
  const { fm, fmSlider, sym, vatLabel, taxRate, cur, currency } = useCurrency();
  const [amt,setAmt]=useState("50000"),[period,setPeriod]=useState("monthly"),[allw,setAllw]=useState("0"),[dedu,setDedu]=useState("0");
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const t=setTimeout(()=>{
      const d=calcSalary({amount:amt,period,region:currency==="PKR"?"pk":"global",allowances:+allw||0,deductions:+dedu||0});
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
      <div className="sticky-res"><Panel result={res} loading={null} label="Net Salary"/></div>
    </div>
  );
}

// ── Income Tax ───────────────────────────────────────────────────────
export function TaxForm(){
  const { fm, fmSlider, sym, vatLabel, taxRate, cur, currency } = useCurrency();
  const [income,setIncome]=useState("1200000"),[period,setPeriod]=useState("annual");
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const t=setTimeout(()=>{
      const d=calcTax({income,period,region:currency==="PKR"?"pk":"global"});
      if(!d){setRes(null);return;}
      const chart={type:"pie",data:[{name:"Tax",value:d.tax,color:"#ef4444"},{name:"Net Income",value:d.grossAnnual-d.tax,color:"var(--brand)"}]};
      setRes(buildResult("Income Tax",fm(d.tax),
        [{label:"Effective Rate",value:d.effRate+"%",highlight:true},{label:"Monthly Tax",value:fm(d.monthlyTax)},{label:"Net Annual",value:fm(d.netAnnual)},{label:"Current Slab",value:d.slabLabel}],
        d.insights,chart,d.slabBreakdown));
    },80);
    return()=>clearTimeout(t);
  },[income,period,currency]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <N label="Total Income" id="ti" value={income} onChange={setIncome} unit={sym}/>
        <Tabs tabs={["Annual","Monthly"]} active={period==="annual"?"Annual":"Monthly"} onChange={v=>setPeriod(v.toLowerCase())}/>
        <div style={{marginTop:24,padding:16,background:"var(--surface2)",borderRadius:"var(--r-lg)",border:"1.5px solid var(--border)"}}>
          <p style={{fontSize:12,color:"var(--text2)",lineHeight:1.6}}>
            <strong>Note:</strong> {currency === "PKR" ? "Tax is calculated using official FBR Salary Slabs for 2024-2025." : "Tax is calculated using a global estimated flat rate."}
          </p>
        </div>
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Income Tax"/></div>
    </div>
  );
}

// ── GST / VAT ────────────────────────────────────────────────────────
export function GSTForm(){
  const { fm, sym, vatLabel, cur } = useCurrency();
  const [amt,setAmt]=useState("10000"),[rate,setRate]=useState(18),[type,setType]=useState("inclusive");
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const d=calcGST({amount:amt,gstRate:rate,type});
    if(!d){setRes(null);return;}
    setRes(buildResult(vatLabel+" Amount",fm(d.gstAmt),
      [{label:"Base Amount",value:fm(d.base)},{label:"Final Total",value:fm(d.total),highlight:true},{label:"Rate",value:rate+"%"}],
      d.insights,null,d.breakdowns));
  },[amt,rate,type]);

  return (
    <div>
      <Tabs tabs={[`${vatLabel} Exclusive`,`${vatLabel} Inclusive`]} active={type==="exclusive"?`${vatLabel} Exclusive` : `${vatLabel} Inclusive`} onChange={v=>setType(v.toLowerCase().includes("exclusive")?"exclusive":"inclusive")}/>
      <N label="Amount" id="ga" value={amt} onChange={setAmt} unit={sym}/>
      <L t={vatLabel + " Rate"} id="gr"/>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        {[5,12,18,28].map(r=>(
          <button key={r} onClick={()=>setRate(r)} style={{padding:"8px 16px",borderRadius:"var(--r-md)",border:rate===r?"2px solid var(--brand)":"1px solid var(--border)",background:rate===r?"var(--p50)":"var(--surface)",color:rate===r?"var(--brand)":"var(--text2)",fontWeight:700,fontSize:13,cursor:"pointer"}}>{r}%</button>
        ))}
        <input type="number" value={rate} onChange={e=>setRate(e.target.value)} style={{width:70,height:38,padding:"0 10px",borderRadius:"var(--r-md)",border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",fontSize:13}} placeholder="Custom"/>
      </div>
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

// ── Simple Interest ──────────────────────────────────────────────────
export function SimpleInterestForm(){
  const { fm, fmSlider, sym } = useCurrency();
  const [p,setP]=useState("100000"),[r,setR]=useState("10"),[t,setT]=useState("1");
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const d=calcSimpleInterest({principal:p,rate:r,time:t});
    if(!d){setRes(null);return;}
    setRes(buildResult("Total Amount",fm(d.total),
      [{label:"Principal",value:fm(d.principal)},{label:"Interest",value:fm(d.interest),highlight:true}],
      d.insights,null,d.breakdowns));
  },[p,r,t]);
  return (
    <div>
      <N label="Principal" id="sip" value={p} onChange={setP} unit={sym}/>
      <Row2><N label="Interest Rate (%)" id="sir" value={r} onChange={setR} unit="%"/><N label="Time (Years)" id="sit" value={t} onChange={setT} unit="yr"/></Row2>
      {res&&<Panel result={res} loading={null} label="Total Amount"/>}
    </div>
  );
}

// ── Profit Margin ────────────────────────────────────────────────────
export function ProfitMarginForm(){
  const { fm, sym } = useCurrency();
  const [cost,setCost]=useState("1000"),[rev,setRev]=useState("1250");
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const d=calcProfitMargin({cost,price:rev});
    if(!d){setRes(null);return;}
    setRes(buildResult("Net Profit",fm(d.profit),
      [{label:"Gross Margin",value:d.margin+"%",highlight:d.margin>=20,warn:d.margin<10},{label:"Markup",value:d.markup+"%"},{label:"Health",value:d.health}],
      d.insights,null,d.breakdowns));
  },[cost,rev]);
  return (
    <div>
      <Row2><N label="Cost Price" id="pmc" value={cost} onChange={setCost} unit={sym}/><N label="Selling Price" id="pmr" value={rev} onChange={setRev} unit={sym}/></Row2>
      {res&&<Panel result={res} loading={null} label="Profit Margin"/>}
    </div>
  );
}

// ── Break Even ───────────────────────────────────────────────────────
export function BreakEvenForm(){
  const { fm, sym } = useCurrency();
  const [fixed,setFixed]=useState("50000"),[price,setPrice]=useState("100"),[vCost,setVCost]=useState("60");
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const d=calcBreakEven({fixedCosts:fixed,sellingPrice:price,variableCost:vCost});
    if(!d){setRes(null);return;}
    setRes(buildResult("Break-Even Units",d.beUnits+" units",
      [{label:"Break-Even Revenue",value:fm(d.beRevenue)},{label:"Contribution/Unit",value:fm(d.contribution)},{label:"Contrib Margin",value:d.contributionMargin+"%",highlight:true}],
      d.insights,null,d.breakdowns));
  },[fixed,price,vCost]);
  return (
    <div>
      <N label="Total Fixed Costs" id="bef" value={fixed} onChange={setFixed} unit={sym}/>
      <Row2><N label="Price Per Unit" id="bep" value={price} onChange={setPrice} unit={sym}/><N label="Variable Cost Per Unit" id="bev" value={vCost} onChange={setVCost} unit={sym}/></Row2>
      {res&&<Panel result={res} loading={null} label="Break-Even Point"/>}
    </div>
  );
}

// ── Discount ─────────────────────────────────────────────────────────
export function DiscountForm(){
  const { fm, sym } = useCurrency();
  const [price,setPrice]=useState("2000"),[disc,setDisc]=useState("15"),[tax,setTax]=useState("0");
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const d=calcDiscount({originalPrice:price,discountPct:disc,taxRate:tax});
    if(!d){setRes(null);return;}
    setRes(buildResult("Final Price",fm(d.final),
      [{label:"You Save",value:fm(d.totalSaved),highlight:true},{label:"Savings %",value:d.savingsPct+"%"},{label:"Original Price",value:fm(d.original)}],
      d.insights,null,d.breakdowns));
  },[price,disc,tax]);
  return (
    <div>
      <N label="Original Price" id="dp" value={price} onChange={setPrice} unit={sym}/>
      <Row2><N label="Discount (%)" id="dd" value={disc} onChange={setDisc} unit="%"/><N label="Tax (%)" id="dt" value={tax} onChange={setTax} unit="%"/></Row2>
      {res&&<Panel result={res} loading={null} label="Discount Price"/>}
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
