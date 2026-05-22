import { useState, useEffect, useCallback } from "react";
import { 
  calcPercentage, calcStatistics, calcQuadratic, calcPythagorean, 
  calcFraction, calcGPA, calcCGPA, calcScientific, calcLog, calcRatio, calcReadingTime, round, fmtC, fmt 
} from "@/core/calculationEngine.js";
import { 
  L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency, formatMoney 
} from "./SharedComponents.jsx";
import { ResultBox } from "@/components/ui/ResultBox.jsx";
import { StatsGrid } from "@/components/ui/StatsGrid.jsx";
import { InsightBox } from "@/components/ui/InsightBox.jsx";
import { Breakdown } from "@/components/ui/Breakdown.jsx";
import { CalcChart } from "@/components/charts/LazyCalcChart.jsx";
import { CalcToolbar } from "@/components/calculator-core/CalcShell.jsx";

// ── Percentage ───────────────────────────────────────────────────────
export function PercentageForm(){
  const [x,setX]=useState("25"),[y,setY]=useState("200");
  const [res,setRes]=useState(null);
  useEffect(()=>{const t=setTimeout(()=>{const d=calcPercentage({x,y});setRes(d);},60);return()=>clearTimeout(t);},[x,y]);
  return (
    <div>
      <Row2><N label="Value X" id="px" value={x} onChange={setX} placeholder="25"/><N label="Value Y" id="py" value={y} onChange={setY} placeholder="200"/></Row2>
      {res?.results&&(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {res.results.map((r,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"var(--r-lg)"}}>
              <span style={{fontSize:13,color:"var(--text2)"}}>{r.q}</span>
              <span style={{fontSize:18,fontWeight:800,color:"var(--brand)",fontFamily:"var(--font-display)"}}>{r.signed&&r.a>0?"+":""}{r.a}{r.unit||""}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Statistics ───────────────────────────────────────────────────────
export function StatsForm(){
  const [input,setInput]=useState("12,18,24,15,30,22,19,27,14,35");
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const t=setTimeout(()=>{
      const d=calcStatistics({dataset:input});
      if(!d){setRes(null);return;}
      const chart={type:"bar",data:d.histogram.map(b=>({label:b.range,value:b.count,color:"var(--brand)"})),xKey:"label",dataKey:"value"};
      setRes(buildResult("Mean",d.mean.toString(),
        [{label:"Median",value:d.median},{label:"Std Dev",value:d.stdDev},{label:"Min",value:d.min},{label:"Max",value:d.max},{label:"Count",value:d.count},{label:"IQR",value:d.iqr}],
        d.insights,chart,d.breakdowns));
    },100);
    return()=>clearTimeout(t);
  },[input]);
  return (
    <div>
      <L t="Dataset (comma or space separated)"/>
      <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Enter numbers: 12, 34, 56, 78..."
        style={{width:"100%",minHeight:90,padding:14,background:"var(--surface2)",border:"1.5px solid var(--border)",borderRadius:"var(--r-md)",fontSize:14,fontFamily:"var(--font-mono)",color:"var(--text)",outline:"none",resize:"vertical",marginBottom:16}}
        onFocus={e=>{e.target.style.borderColor="var(--brand)";}} onBlur={e=>{e.target.style.borderColor="var(--border)";}}/>
      {res&&<><ResultBox label={res.primary.label} value={res.primary.value}/><StatsGrid items={res.stats}/><InsightBox insights={res.insights}/><CalcChart chartData={res.chart}/><Breakdown rows={res.breakdowns}/></>}
    </div>
  );
}

// ── Quadratic Equation ───────────────────────────────────────────────
export function QuadraticForm(){
  const [a,setA]=useState("1"),[b,setB]=useState("-5"),[c,setC]=useState("6");
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const t=setTimeout(()=>{
      const d=calcQuadratic({a,b,c});
      if(!d){setRes(null);return;}
      const chart=d.pts?{type:"line",data:d.pts,xKey:"x",keys:["y"]}:null;
      const resultObj = buildResult("Roots",d.roots.length?d.roots.join(", "):d.rootType,
        [{label:"Discriminant",value:d.discriminant},{label:"Root Type",value:d.rootType},{label:"Vertex X",value:d.vertex.x},{label:"Vertex Y",value:d.vertex.y}],
        d.insights,chart,d.breakdowns);
      resultObj.raw = d;
      setRes(resultObj);
    },80);
    return()=>clearTimeout(t);
  },[a,b,c]);
  return (
    <div>
      <div style={{textAlign:"center",fontFamily:"var(--font-mono)",fontSize:18,fontWeight:700,padding:"14px",background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"var(--r-md)",color:"var(--text)",marginBottom:18}}>
        {a}x² + ({b})x + ({c}) = 0
      </div>
      <Row3><N label="a (x²)" id="qa" value={a} onChange={setA}/><N label="b (x)" id="qb" value={b} onChange={setB}/><N label="c (constant)" id="qc" value={c} onChange={setC}/></Row3>
      {res&&(
        <>
          <ResultBox label={res.primary.label} value={res.primary.value}/>
          <StatsGrid items={res.stats}/>
          
          {res.raw?.steps && (
            <div style={{marginTop: 16, marginBottom: 16}}>
              <p style={{fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:".08em",color:"var(--text3)",marginBottom:8}}>Step-by-Step Explanation</p>
              <div style={{display: "flex", flexDirection: "column", gap: 8}}>
                {res.raw.steps.map((step, i) => (
                  <div key={i} style={{padding: "12px 16px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-md)"}}>
                    <div style={{fontSize: 11, fontWeight: 700, color: "var(--brand)", textTransform: "uppercase", marginBottom: 4}}>{step.title}</div>
                    <div style={{fontSize: 14, fontFamily: "var(--font-mono)", color: "var(--text)"}}>{step.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <InsightBox insights={res.insights}/>
          <CalcChart chartData={res.chart}/>
          <Breakdown rows={res.breakdowns}/>
        </>
      )}
    </div>
  );
}

// ── Pythagorean Theorem ──────────────────────────────────────────────
export function PythagoreanForm(){
  const [a,setA]=useState("3"),[b,setB]=useState("4"),[solve,setSolve]=useState("c");
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const t=setTimeout(()=>{
      const av=Number(a)||0, bv=Number(b)||0;
      // For "Find c": pass a and b; For "Find a": pass b and c; For "Find b": pass a and c
      const cForCalc = solve==="c" ? round(Math.sqrt(av*av+bv*bv),4) : (solve==="a" ? round(Math.sqrt(bv*bv+av*av),4) : round(Math.sqrt(bv*bv+av*av),4));
      const d=calcPythagorean(
        solve==="c"?{a,b,c:round(Math.sqrt(av*av+bv*bv),6).toString(),solve}:
        solve==="a"?{a:"0",b,c:a,solve}:
        {a,b:"0",c:b,solve}
      );
      if(!d){setRes(null);return;}
      setRes(buildResult(`Side ${solve.toUpperCase()}`,d.result.toString(),
        [{label:"Perimeter",value:d.perimeter},{label:"Area",value:d.area},{label:"All Sides",value:`${d.sides.a}, ${d.sides.b}, ${d.sides.c}`}],
        d.insights,null,d.breakdowns));
    },80);
    return()=>clearTimeout(t);
  },[a,b,solve]);
  return (
    <div>
      <Tabs tabs={["Find c","Find a","Find b"]} active={`Find ${solve}`} onChange={v=>setSolve(v.split(" ")[1])}/>
      <Row2><N label="Side a" id="pa" value={a} onChange={setA}/><N label="Side b" id="pb" value={b} onChange={setB}/></Row2>
      {res&&<><ResultBox label={res.primary.label} value={res.primary.value}/><StatsGrid items={res.stats}/><InsightBox insights={res.insights}/><Breakdown rows={res.breakdowns}/></>}
    </div>
  );
}

// ── Fractions ────────────────────────────────────────────────────────
export function FractionForm(){
  const [n1,setN1]=useState("1"),[d1,setD1]=useState("2"),[n2,setN2]=useState("1"),[d2,setD2]=useState("3"),[op,setOp]=useState("+");
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const t=setTimeout(()=>{
      const d=calcFraction({n1,d1,n2,d2,op});
      if(!d){setRes(null);return;}
      setRes(buildResult("Result",d.result,[{label:"Decimal",value:d.decimal},{label:"Mixed",value:d.mixed||"N/A"}],d.insights,null,d.breakdowns));
    },80);
    return()=>clearTimeout(t);
  },[n1,d1,n2,d2,op]);
  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18,flexWrap:"wrap"}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <N label="" id="fn1" value={n1} onChange={setN1} placeholder="1"/>
          <div style={{height:2,background:"var(--border)",width:60}}/>
          <N label="" id="fd1" value={d1} onChange={setD1} placeholder="2"/>
        </div>
        <Sel label="" id="fop" value={op} onChange={setOp} opts={[{v:"+",l:"+"},{v:"-",l:"−"},{v:"×",l:"×"},{v:"÷",l:"÷"}]}/>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <N label="" id="fn2" value={n2} onChange={setN2} placeholder="1"/>
          <div style={{height:2,background:"var(--border)",width:60}}/>
          <N label="" id="fd2" value={d2} onChange={setD2} placeholder="3"/>
        </div>
      </div>
      {res&&<><ResultBox label={res.primary.label} value={res.primary.value}/><StatsGrid items={res.stats}/><Breakdown rows={res.breakdowns}/></>}
    </div>
  );
}

// ── GPA Calculator ───────────────────────────────────────────────────
export function GPAForm(){
  const [courses,setCourses]=useState([{name:"Mathematics",grade:"4.0",credits:"4"},{name:"Physics",grade:"3.7",credits:"4"},{name:"English",grade:"3.3",credits:"3"}]);
  const [whatIf,setWhatIf]=useState(""),[wCr,setWCr]=useState("3");
  const upd=(i,f,v)=>{const a=[...courses];a[i]={...a[i],[f]:v};setCourses(a);};
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const t=setTimeout(()=>{
      const d=calcGPA({courses});
      if(!d){setRes(null);return;}
      const needed=whatIf&&wCr?d.whatIf(+whatIf,+wCr):null;
      setRes(buildResult("Current GPA",d.gpa.toFixed(2),
        [{label:"Letter Grade",value:d.letter},{label:"Status",value:d.status,highlight:d.status==="Dean's List"},{label:"Credits",value:d.totalCredits},...(needed!=null?[{label:`For ${whatIf} GPA (+${wCr} cr)`,value:needed+"needed",highlight:true}]:[])],
        d.insights,null,d.breakdown));
    },80);
    return()=>clearTimeout(t);
  },[courses,whatIf,wCr]);

  const inp={padding:"7px 10px",background:"var(--surface2)",border:"1.5px solid var(--border)",borderRadius:"var(--r-sm)",fontSize:13,color:"var(--text)",outline:"none",width:"100%"};
  return (
    <div>
      <div style={{border:"1px solid var(--border)",borderRadius:"var(--r-xl)",overflow:"hidden",marginBottom:14}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr auto",gap:0,padding:"8px 14px",background:"linear-gradient(135deg,var(--p900),var(--p800))"}}>
          {["Course","Grade","Credits",""].map(h=><span key={h} style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,.6)",textTransform:"uppercase",letterSpacing:".06em"}}>{h}</span>)}
        </div>
        {courses.map((c,i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr auto",gap:8,padding:"8px 14px",borderBottom:"1px solid var(--border2)",alignItems:"center",background:"var(--surface)"}}>
            <input style={inp} value={c.name} onChange={e=>upd(i,"name",e.target.value)}/>
            <input type="number" style={{...inp,textAlign:"center"}} value={c.grade} onChange={e=>upd(i,"grade",e.target.value)} step="0.1" min="0" max="4"/>
            <input type="number" style={{...inp,textAlign:"center"}} value={c.credits} onChange={e=>upd(i,"credits",e.target.value)} min="1"/>
            <button onClick={()=>setCourses(courses.filter((_,j)=>j!==i))} style={{color:"var(--text3)",fontSize:16,padding:"2px 8px",borderRadius:"var(--r-sm)"}}>✕</button>
          </div>
        ))}
        <button onClick={()=>setCourses([...courses,{name:"New Course",grade:"3.0",credits:"3"}])}
          style={{width:"100%",padding:"9px",fontSize:12,fontWeight:700,color:"var(--brand)",background:"var(--surface2)",border:"none",borderTop:"1px solid var(--border2)",cursor:"pointer"}}>
          + Add Course
        </button>
      </div>
      <div style={{padding:"12px 14px",background:"var(--surface2)",border:"1px solid var(--border2)",borderRadius:"var(--r-md)",marginBottom:14}}>
        <p style={{fontSize:11,fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:8}}>What-If Simulator</p>
        <Row2>
          <N label="Target GPA" id="wgpa" value={whatIf} onChange={setWhatIf} placeholder="3.7"/>
          <N label="Next Course Credits" id="wcr" value={wCr} onChange={setWCr} placeholder="3"/>
        </Row2>
      </div>
      {res&&<><ResultBox label={res.primary.label} value={res.primary.value}/><StatsGrid items={res.stats}/><InsightBox insights={res.insights}/><Breakdown rows={res.breakdowns}/></>}
    </div>
  );
}

// ── CGPA Calculator ──────────────────────────────────────────────────
export function CGPAForm(){
  const [semesters,setSemesters]=useState([{id:1,sgpa:"3.5",credits:"18"},{id:2,sgpa:"3.7",credits:"20"}]);
  const [university,setUniversity]=useState("standard");
  const [res,setRes]=useState(null);
  const upd=(id,f,v)=>{setSemesters(semesters.map(s=>s.id===id?{...s,[f]:v}:s));};
  useEffect(()=>{
    const t=setTimeout(()=>{
      const valid=semesters.filter(s=>+s.sgpa>0&&+s.credits>0);
      if(!valid.length){setRes(null);return;}
      const totalCr=valid.reduce((s,c)=>s+(+c.credits||0),0);
      const cgpa=totalCr>0?round(valid.reduce((s,c)=>s+(+c.sgpa||0)*(+c.credits||0),0)/totalCr,2):0;
      const d=calcCGPA({cgpa,university});
      if(!d){setRes(null);return;}
      const LETTER=[[3.7,"A"],[3.3,"A−"],[3.0,"B+"],[2.7,"B"],[2.3,"B−"],[2.0,"C+"],[1.7,"C"],[0,"F"]];
      const letter=LETTER.find(([g])=>cgpa>=g)?.[1]||"F";
      const status=cgpa>=3.7?"Dean's List":cgpa>=3.5?"Honors":cgpa>=2.0?"Good Standing":"Academic Warning";
      setRes(buildResult("CGPA",cgpa.toFixed(2)+" / 4.0",
        [{label:"Percentage ("+d.formula+")",value:d.percentage+"%",highlight:true},{label:"Grade",value:letter},{label:"Status",value:status},{label:"Total Credits",value:totalCr}],
        [{type:"info",msg:`CGPA ${cgpa.toFixed(2)} = ${d.percentage}% (${d.formula})`},{type:cgpa>=3.5?"good":cgpa>=2.0?"info":"bad",msg:status}],
        null,[
          ...semesters.map((s,i)=>({label:`Sem ${i+1} SGPA`,value:`${s.sgpa} × ${s.credits}cr`})),
          {label:"Weighted CGPA",value:cgpa.toFixed(2),bold:true},
          {label:"Percentage",value:d.percentage+"%",bold:true},
        ]));
    },80);
    return()=>clearTimeout(t);
  },[semesters,university]);

  return (
    <div>
      <Sel label="University Formula" id="cuniv" value={university} onChange={setUniversity} opts={[
        {v:"standard",l:"Standard (CGPA × 9.5)"},{v:"vtu",l:"VTU (×10 − 5)"},{v:"anna",l:"Anna University (×10)"},{v:"hec",l:"HEC Pakistan (×10)"},{v:"mu",l:"Mumbai University"}
      ]}/>
      {semesters.map((s,i)=>(
        <div key={s.id} style={{padding:"12px 14px",background:"var(--surface2)",border:"1px solid var(--border2)",borderRadius:"var(--r-md)",marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <span style={{fontSize:11,fontWeight:800,color:"var(--text3)",textTransform:"uppercase"}}>Semester {i+1}</span>
            {semesters.length>1&&<button onClick={()=>setSemesters(semesters.filter(x=>x.id!==s.id))} style={{color:"#ef4444",fontSize:10,fontWeight:700}}>Remove</button>}
          </div>
          <Row2>
            <N label="SGPA (0–4.0)" id={`sgpa-${s.id}`} value={s.sgpa} onChange={v=>upd(s.id,"sgpa",v)} placeholder="3.5"/>
            <N label="Credits" id={`scr-${s.id}`} value={s.credits} onChange={v=>upd(s.id,"credits",v)} placeholder="18"/>
          </Row2>
        </div>
      ))}
      <button onClick={()=>setSemesters([...semesters,{id:Date.now(),sgpa:"3.0",credits:"18"}])}
        style={{width:"100%",padding:"12px",borderRadius:"var(--r-lg)",border:"1.5px dashed var(--border)",color:"var(--text2)",fontSize:13,fontWeight:600,cursor:"pointer",marginBottom:16}}>
        + Add Another Semester
      </button>
      {res&&<><ResultBox label={res.primary.label} value={res.primary.value}/><StatsGrid items={res.stats}/><InsightBox insights={res.insights}/><Breakdown rows={res.breakdowns}/></>}
    </div>
  );
}

// ── Scientific Calculator ───────────────────────────────────────────
export function ScientificForm(){
  const [expr,setExpr]=useState(""),[deg,setDeg]=useState(true),[history,setHistory]=useState([]);
  const [res,setRes]=useState(null);
  const calculate=()=>{
    const d=calcScientific({expr,degMode:deg});
    setRes(d);
    if(d.valid) setHistory(h=>[{expr,result:d.result},...h].slice(0,8));
  };
  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <input value={expr} onChange={e=>setExpr(e.target.value)} onKeyDown={e=>e.key==="Enter"&&calculate()}
          placeholder="Type expression or use buttons…"
          style={{flex:1,padding:"10px 14px",background:"var(--surface2)",border:"1.5px solid var(--border)",borderRadius:"var(--r-md)",fontSize:15,fontFamily:"var(--font-mono)",color:"var(--text)",outline:"none"}}
          onFocus={e=>e.target.style.borderColor="var(--brand)"} onBlur={e=>e.target.style.borderColor="var(--border)"}/>
        <Tabs tabs={["DEG","RAD"]} active={deg?"DEG":"RAD"} onChange={v=>setDeg(v==="DEG")}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:5,marginBottom:14}}>
        {["sin","cos","tan","log","ln","√","x²","1/x","|x|","π","e"].map(fn=>(
          <button key={fn} onClick={()=>setExpr(e=>e+fn+"(")}
            style={{padding:"9px 4px",borderRadius:"var(--r-sm)",background:"var(--p50)",border:"1px solid var(--p100)",fontSize:12,fontWeight:700,color:"var(--brand)",cursor:"pointer",fontFamily:"var(--font-mono)"}}>
            {fn}
          </button>
        ))}
      </div>
      {res&&(res.valid?<div style={{padding:"14px 18px",background:"linear-gradient(135deg,var(--brand),var(--p800))",borderRadius:"var(--r-lg)",textAlign:"center",marginBottom:12}}>
        <p style={{fontSize:11,color:"rgba(255,255,255,.5)",marginBottom:4}}>{expr} =</p>
        <p style={{fontSize:28,fontWeight:800,color:"#fff",fontFamily:"var(--font-mono)"}}>{res.result}</p>
      </div>:<div style={{padding:"12px 16px",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"var(--r-md)",color:"#b91c1c",fontSize:13}}>⚠️ {res.error}</div>)}
      {history.length>0&&(<div style={{marginTop:10}}><L t="History"/>{history.map((h,i)=>(
        <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 12px",fontSize:12,fontFamily:"var(--font-mono)",borderBottom:"1px solid var(--border2)",cursor:"pointer"}} onClick={()=>setExpr(h.expr)}>
          <span style={{color:"var(--text2)"}}>{h.expr}</span><span style={{fontWeight:700,color:"var(--brand)"}}>{h.result}</span>
        </div>
      ))}</div>)}
      <button onClick={calculate} style={{width:"100%",padding:"12px",marginTop:14,background:"var(--brand)",color:"#fff",borderRadius:"var(--r-lg)",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"var(--font)"}}>
        Calculate =
      </button>
    </div>
  );
}

// ── Prime Number Checker ─────────────────────────────────────────────
export function PrimeForm(){
  const [n,setN]=useState("97");
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const t=setTimeout(()=>{
      const num=Math.abs(Math.floor(+n));
      if(!num||num<1){setRes(null);return;}
      // Primality check
      const isPrime=(n)=>{
        if(n<2) return false;
        if(n===2) return true;
        if(n%2===0) return false;
        for(let i=3;i<=Math.sqrt(n);i+=2){if(n%i===0) return false;}
        return true;
      };
      const prime=isPrime(num);
      // Get factors
      const factors=[];
      for(let i=1;i<=Math.sqrt(num);i++){if(num%i===0){factors.push(i);if(i!==num/i)factors.push(num/i);}}
      factors.sort((a,b)=>a-b);
      // First 25 primes
      const first25=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97];
      // Next prime after n
      let nextP=num+1;
      while(!isPrime(nextP))nextP++;
      setRes({prime,num,factors,first25,nextP,prevP:num>2?factors.filter(isPrime).slice(-1)[0]:null});
    },80);
    return()=>clearTimeout(t);
  },[n]);
  return (
    <div>
      <N label="Enter a Number" id="pn" value={n} onChange={setN} placeholder="e.g. 97"/>
      {res&&(
        <>
          <div style={{textAlign:"center",padding:"20px",background:res.prime?"linear-gradient(135deg,#16a34a,#15803d)":"linear-gradient(135deg,#dc2626,#b91c1c)",borderRadius:"var(--r-xl)",marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,.6)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>Is {res.num} Prime?</div>
            <div style={{fontSize:32,fontWeight:900,color:"#fff"}}>{res.prime?"✅ YES — PRIME":"❌ NO — COMPOSITE"}</div>
            {!res.prime&&<div style={{fontSize:13,color:"rgba(255,255,255,.75)",marginTop:6}}>Factors: {res.factors.join(", ")}</div>}
          </div>
          <div style={{padding:"12px 16px",background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"var(--r-lg)",marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--text3)",textTransform:"uppercase",marginBottom:8}}>Next Prime After {res.num}: <strong style={{color:"var(--brand)",fontSize:15}}>{res.nextP}</strong></div>
            {res.factors.length>1&&<div style={{fontSize:11,fontWeight:700,color:"var(--text3)",textTransform:"uppercase",marginBottom:8}}>All Factors: {res.factors.join(", ")}</div>}
          </div>
          <div style={{padding:"12px 16px",background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"var(--r-lg)"}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--text3)",textTransform:"uppercase",marginBottom:8}}>First 25 Primes Reference</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {res.first25.map(p=>(
                <span key={p} style={{padding:"4px 10px",borderRadius:100,fontSize:12,fontWeight:700,background:p===res.num?"var(--brand)":"var(--surface)",color:p===res.num?"#fff":"var(--text2)",border:"1px solid var(--border)"}}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Logarithm Calculator ──────────────────────────────────────────────
export function LogForm() {
  const [value, setValue] = useState("100");
  const [base, setBase] = useState("10");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      const d = calcLog({ value, base });
      if (!d) { setRes(null); return; }
      setRes(buildResult(
        "Logarithm Result",
        d.result.toString(),
        [
          { label: "log10", value: d.log10.toString() },
          { label: "log2", value: d.log2.toString() },
          { label: "ln (natural)", value: d.ln.toString(), highlight: true },
          { label: "Antilog", value: d.antilog.toString() },
        ],
        d.insights, null, d.breakdowns
      ));
    }, 80);
    return () => clearTimeout(t);
  }, [value, base]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Tabs
          tabs={["Base 10", "Base 2", "Natural (e)", "Custom"]}
          active={{ "10": "Base 10", "2": "Base 2", "e": "Natural (e)" }[base] || "Custom"}
          onChange={v => setBase({ "Base 10": "10", "Base 2": "2", "Natural (e)": "e" }[v] || base)}
        />
        <N label="Number (x)" id="log-val" value={value} onChange={setValue} hint="Enter a positive number" placeholder="e.g. 100"/>
        {!["10","2","e"].includes(base) && (
          <N label="Custom Base" id="log-base" value={base} onChange={setBase} hint="Any positive number except 1" placeholder="e.g. 3"/>
        )}
        <div style={{ marginTop: 16, padding: "14px 16px", background: "var(--surface2)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 8, fontWeight: 600 }}>Quick Reference</div>
          {[
            { label: "log10(10) = 1", desc: "Base 10 log of 10" },
            { label: "log2(8) = 3", desc: "Base 2 log of 8" },
            { label: "ln(e) = 1", desc: "Natural log of e" },
            { label: "log(1) = 0", desc: "Log of 1 is always 0" },
          ].map((q, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: i < 3 ? "1px solid var(--border2)" : "none", fontSize: 12 }}>
              <span style={{ color: "var(--brand)", fontWeight: 700 }}>{q.label}</span>
              <span style={{ color: "var(--text3)" }}>{q.desc}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="sticky-res">
        <Panel result={res} loading={null} label="Logarithm Result" />
      </div>
    </div>
  );
}

// ── Ratio Calculator ──────────────────────────────────────────────────
export function RatioForm() {
  const [mode, setMode] = useState("simplify");
  const [a, setA] = useState("6");
  const [b, setB] = useState("9");
  const [c, setC] = useState("4");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      const d = calcRatio({ a, b, c, mode });
      if (!d) { setRes(null); return; }
      if (mode === "simplify") {
        setRes(buildResult("Simplified Ratio", d.simplified,
          [
            { label: "Decimal", value: d.decimal.toString() },
            { label: "Part A %", value: round(d.parts.a / d.parts.total * 100, 2) + "%" },
            { label: "Part B %", value: round(d.parts.b / d.parts.total * 100, 2) + "%" },
            { label: "Total Parts", value: d.parts.total.toString(), highlight: true },
          ],
          d.insights, null, d.breakdowns
        ));
      } else {
        setRes(buildResult("Missing Value", d.result.toString(),
          [
            { label: "Ratio", value: `${a} : ${b}` },
            { label: "Given (c)", value: c },
            { label: "Missing (d)", value: d.result.toString(), highlight: true },
          ],
          d.insights, null, d.breakdowns
        ));
      }
    }, 80);
    return () => clearTimeout(t);
  }, [a, b, c, mode]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Tabs
          tabs={["Simplify Ratio", "Find Missing Value"]}
          active={mode === "simplify" ? "Simplify Ratio" : "Find Missing Value"}
          onChange={v => setMode(v === "Simplify Ratio" ? "simplify" : "missing")}
        />
        {mode === "simplify" ? (
          <>
            <Row2>
              <N label="A" id="ra" value={a} onChange={setA} placeholder="e.g. 6" />
              <N label="B" id="rb" value={b} onChange={setB} placeholder="e.g. 9" />
            </Row2>
            <div style={{ padding: "12px 14px", background: "var(--surface2)", borderRadius: "var(--r-md)", border: "1px solid var(--border)", fontSize: 12, color: "var(--text3)", marginTop: 8 }}>
              Enter any two numbers to simplify A:B to its lowest terms.
            </div>
          </>
        ) : (
          <>
            <div style={{ padding: "12px 14px", background: "var(--surface2)", borderRadius: "var(--r-md)", border: "1px solid var(--border)", fontSize: 13, color: "var(--text)", marginBottom: 12 }}>
              Solve: <strong style={{ color: "var(--brand)" }}>A : B = C : ?</strong>
            </div>
            <Row3>
              <N label="A" id="rma" value={a} onChange={setA} placeholder="e.g. 3" />
              <N label="B" id="rmb" value={b} onChange={setB} placeholder="e.g. 5" />
              <N label="C" id="rmc" value={c} onChange={setC} placeholder="e.g. 9" />
            </Row3>
          </>
        )}
      </div>
      <div className="sticky-res">
        <Panel result={res} loading={null} label="Ratio Result" />
      </div>
    </div>
  );
}

// ── Reading Time Calculator ────────────────────────────────────────────
export function ReadingTimeForm() {
  const [wordCount, setWordCount] = useState("1000");
  const [wpm, setWpm] = useState(200);
  const [res, setRes] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      const d = calcReadingTime({ wordCount, wpm });
      if (!d) { setRes(null); return; }
      setRes(buildResult(
        "Reading Time",
        d.formatted,
        [
          { label: "Fast Reader (300 WPM)", value: d.fast + " min" },
          { label: "Average (200 WPM)", value: d.avg + " min" },
          { label: "Slow Reader (130 WPM)", value: d.slow + " min" },
          { label: "Speaking Time", value: d.speakMins + " min" },
          { label: "Approx. Pages", value: d.pages + " pages", highlight: true },
        ],
        d.insights, null, d.breakdowns
      ));
    }, 80);
    return () => clearTimeout(t);
  }, [wordCount, wpm]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <N label="Word Count" id="rt-words" value={wordCount} onChange={setWordCount} hint="Number of words in your text" placeholder="e.g. 1000"/>
        <Sl label="Your Reading Speed (WPM)" id="rt-wpm" min={50} max={600} step={10} value={wpm} onChange={setWpm} fmt={v => `${v} WPM`}/>
        <div style={{ marginTop: 16, padding: "14px 16px", background: "var(--surface2)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600, marginBottom: 8 }}>Average Reading Speeds</div>
          {[
            { label: "Child reader", wpm: "100-150 WPM" },
            { label: "Average adult", wpm: "200-250 WPM" },
            { label: "Fast reader", wpm: "300-400 WPM" },
            { label: "Speed reader", wpm: "500-700 WPM" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 0", borderBottom: i < 3 ? "1px solid var(--border2)" : "none" }}>
              <span style={{ color: "var(--text2)" }}>{s.label}</span>
              <span style={{ color: "var(--brand)", fontWeight: 700 }}>{s.wpm}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="sticky-res">
        <Panel result={res} loading={null} label="Reading Time" />
      </div>
    </div>
  );
}
