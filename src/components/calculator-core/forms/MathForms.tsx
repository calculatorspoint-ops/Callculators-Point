// @ts-nocheck
import { useState, useEffect, useCallback } from "react";
import { 
  calcPercentage, calcStatistics, calcQuadratic, calcPythagorean, 
  calcFraction, calcGPA, calcCGPA, calcScientific, calcLog, calcRatio, calcReadingTime, round, fmtC, fmt 
} from "@/core/calculationEngine";
import { 
  L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency, formatMoney, FinanceLayout 
} from './SharedComponents';
import { ResultBox } from '@/components/ui/ResultBox';
import { StatsGrid } from '@/components/ui/StatsGrid';
import { InsightBox } from '@/components/ui/InsightBox';
import { Breakdown } from '@/components/ui/Breakdown';
import { CalcChart } from '@/components/charts/LazyCalcChart';
import { CalcToolbar } from '@/components/calculator-core/CalcShell';

// ── Percentage ───────────────────────────────────────────────────────
export function PercentageForm(){
  const [x,setX]=useState("25"),[y,setY]=useState("200");
  const [res,setRes]=useState(null);
  useEffect(()=>{const t=setTimeout(()=>{const d=calcPercentage({x,y});setRes(d);},60);return()=>clearTimeout(t);},[x,y]);
  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Values"
      resultContent={<>
        {res?.results&&(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {res.results.map((r,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"var(--r-lg)"}}>
              <span style={{fontSize:13,color:"var(--text2)"}}>{r.q}</span>
              <span style={{fontSize:18,fontWeight:800,color:"var(--brand)",fontFamily:"var(--font-display)"}}>{r.signed&&r.a>0?"+":""}{r.a}{r.unit||""}</span>
            </div>
          ))}
          {res.steps?.length > 0 && (
            <div style={{ marginTop: 14, textAlign: "left" }}>
              <details style={{ background: "var(--surface2)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)", padding: "2px 16px" }}>
                <summary style={{ fontSize: 12, fontWeight: 800, color: "var(--brand)", textTransform: "uppercase", letterSpacing: ".05em", cursor: "pointer", padding: "10px 0", outline: "none", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Step-by-Step Explanation</span>
                  <span style={{fontSize: 14}}>▾</span>
                </summary>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingBottom: 16 }}>
                  {res.steps.map((step, i) => (
                    <div key={i} style={{ padding: "10px 14px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", marginBottom: 4 }}>{step.title}</div>
                      <div style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--text)" }}>{step.desc}</div>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}
        </div>
      )}
      </>}
      inputContent={<>
        <p style={{fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'.09em', color:'var(--text3)', margin:'0 0 18px'}}>🔢 Your Inputs</p>
        <Row2><N label="Value X" id="px" value={x} onChange={setX} placeholder="25"/><N label="Value Y" id="py" value={y} onChange={setY} placeholder="200"/></Row2>
      </>}
    />
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
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Numbers"
      resultContent={<>
        {res&&<><ResultBox label={res.primary.label} value={res.primary.value}/><StatsGrid items={res.stats}/><InsightBox insights={res.insights}/><CalcChart chartData={res.chart}/><Breakdown rows={res.breakdowns}/></>}
      </>}
      inputContent={<>
        <p style={{fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'.09em', color:'var(--text3)', margin:'0 0 18px'}}>📊 Your Inputs</p>
        <L t="Dataset (comma or space separated)"/>
        <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Enter numbers: 12, 34, 56, 78..."
          style={{width:"100%",minHeight:90,padding:14,background:"var(--surface2)",border:"1.5px solid var(--border)",borderRadius:"var(--r-md)",fontSize:14,fontFamily:"var(--font-mono)",color:"var(--text)",outline:"none",resize:"vertical",marginBottom:0}}
          onFocus={e=>{e.target.style.borderColor="var(--brand)";}} onBlur={e=>{e.target.style.borderColor="var(--border)";}}/>
      </>}
    />
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
        d.insights,chart,d.breakdowns, null, d.steps);
      resultObj.raw = d;
      setRes(resultObj);
    },80);
    return()=>clearTimeout(t);
  },[a,b,c]);
  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Equation"
      result={res}
      loading={null}
      label="Quadratic"
      inputContent={<>
        <p style={{fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'.09em', color:'var(--text3)', margin:'0 0 18px'}}>📐 Your Equation</p>
        <div style={{textAlign:"center",fontFamily:"var(--font-mono)",fontSize:18,fontWeight:700,padding:"14px",background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"var(--r-md)",color:"var(--text)",marginBottom:18}}>
          {a}x² + ({b})x + ({c}) = 0
        </div>
        <Row3><N label="a (x²)" id="qa" value={a} onChange={setA}/><N label="b (x)" id="qb" value={b} onChange={setB}/><N label="c (constant)" id="qc" value={c} onChange={setC}/></Row3>
      </>}
    />
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
        d.insights,null,d.breakdowns, null, d.steps));
    },80);
    return()=>clearTimeout(t);
  },[a,b,solve]);
  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Triangle"
      result={res}
      loading={null}
      label="Pythagorean"
      inputContent={<>
        <p style={{fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'.09em', color:'var(--text3)', margin:'0 0 18px'}}>📐 Your Inputs</p>
        <Tabs tabs={["Find c","Find a","Find b"]} active={`Find ${solve}`} onChange={v=>setSolve(v.split(" ")[1])}/>
        <Row2><N label="Side a" id="pa" value={a} onChange={setA}/><N label="Side b" id="pb" value={b} onChange={setB}/></Row2>
      </>}
    />
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
      setRes(buildResult("Result",d.result,[{label:"Decimal",value:d.decimal},{label:"Simplified",value:d.simplified}],d.insights,null,d.breakdowns));
    },80);
    return()=>clearTimeout(t);
  },[n1,d1,n2,d2,op]);
  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Fractions"
      resultContent={<>
        {res&&<><ResultBox label={res.primary.label} value={res.primary.value}/><StatsGrid items={res.stats}/><Breakdown rows={res.breakdowns}/></>}
      </>}
      inputContent={<>
        <p style={{fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'.09em', color:'var(--text3)', margin:'0 0 18px'}}>½ Your Inputs</p>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:0,flexWrap:"wrap"}}>
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
      </>}
    />
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

  const accent = "#0891b2";
  const gpa = res ? parseFloat(res.primary.value) : 0;

  // GPA grade color
  const getGPAColor = (g) => g >= 3.7 ? "#059669" : g >= 3.0 ? "#0891b2" : g >= 2.0 ? "#d97706" : "#ef4444";
  const getLetter = (g) => g >= 3.7 ? "A" : g >= 3.3 ? "A−" : g >= 3.0 ? "B+" : g >= 2.7 ? "B" : g >= 2.3 ? "B−" : g >= 2.0 ? "C+" : g >= 1.7 ? "C" : "F";
  const getStatus = (g) => g >= 3.7 ? "Dean's List 🏆" : g >= 3.5 ? "Honors 🌟" : g >= 2.0 ? "Good Standing ✅" : "Academic Warning ⚠️";
  const gpaPct = Math.min(100, (gpa / 4.0) * 100);

  const inp = {padding:"7px 10px",background:"var(--surface2)",border:"1.5px solid var(--border)",borderRadius:8,fontSize:13,color:"var(--text)",outline:"none",width:"100%",fontFamily:"var(--font)",boxSizing:"border-box"};

  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Courses"
      resultContent={<>
        {res && (
          <div style={{display:"flex",flexDirection:"column",gap:14}}>

            {/* HERO */}
            <div style={{background:`linear-gradient(135deg,${getGPAColor(gpa)}18,${getGPAColor(gpa)}06)`,border:`2px solid ${getGPAColor(gpa)}35`,borderRadius:20,padding:"28px 24px",textAlign:"center",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-50,left:"50%",transform:"translateX(-50%)",width:220,height:220,background:`radial-gradient(circle,${getGPAColor(gpa)}20,transparent 70%)`,pointerEvents:"none"}}/>
              <div style={{position:"relative",zIndex:1}}>
                <p style={{fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:".1em",color:getGPAColor(gpa),marginBottom:8}}>📊 Your GPA</p>
                <div style={{display:"flex",alignItems:"baseline",justifyContent:"center",gap:10,marginBottom:10}}>
                  <p style={{fontSize:"clamp(36px,8vw,64px)",fontWeight:900,color:"var(--text)",lineHeight:1,margin:0,letterSpacing:"-.03em"}}>{gpa.toFixed(2)}</p>
                  <span style={{fontSize:18,fontWeight:700,color:"var(--text3)"}}>/ 4.0</span>
                </div>
                <div style={{display:"flex",justifyContent:"center",gap:10,flexWrap:"wrap"}}>
                  <span style={{padding:"5px 16px",background:getGPAColor(gpa),color:"#fff",borderRadius:100,fontSize:15,fontWeight:800}}>{getLetter(gpa)}</span>
                  <span style={{padding:"5px 16px",background:`${getGPAColor(gpa)}18`,color:getGPAColor(gpa),borderRadius:100,fontSize:12,fontWeight:700,border:`1px solid ${getGPAColor(gpa)}40`}}>{getStatus(gpa)}</span>
                </div>
              </div>
            </div>

            {/* GPA SCALE BAR */}
            <div style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:14,padding:"16px 20px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                <span style={{fontSize:13,fontWeight:700,color:"var(--text2)"}}>GPA Scale</span>
                <span style={{fontSize:13,fontWeight:800,color:getGPAColor(gpa)}}>{gpa.toFixed(2)} / 4.0</span>
              </div>
              <div style={{display:"flex",borderRadius:100,overflow:"hidden",height:12,marginBottom:8}}>
                {[{label:"F",w:50,c:"#ef4444"},{label:"C",w:12.5,c:"#f59e0b"},{label:"B",w:25,c:"#0891b2"},{label:"A",w:12.5,c:"#059669"}].map(z=>(
                  <div key={z.label} style={{width:`${z.w}%`,background:z.c,opacity:gpa>=(z.label==="F"?0:z.label==="C"?2:z.label==="B"?3:3.7)?1:0.25,transition:"opacity .3s"}}/>
                ))}
              </div>
              <div style={{position:"relative",height:8}}>
                <div style={{position:"absolute",left:`${gpaPct}%`,transform:"translateX(-50%)",width:3,height:16,background:getGPAColor(gpa),borderRadius:100,top:-4,transition:"left .4s"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                {["0.0","1.0","2.0","3.0","4.0"].map(v=><span key={v} style={{fontSize:10,color:"var(--text3)",fontWeight:600}}>{v}</span>)}
              </div>
            </div>

            <StatsGrid items={res.stats}/>
            <InsightBox insights={res.insights}/>

            {res.breakdowns?.length>0&&(
              <div style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:14,overflow:"hidden"}}>
                <div style={{padding:"12px 20px",borderBottom:"1px solid var(--border)",background:"var(--surf2,var(--surface2))"}}>
                  <p style={{fontSize:12,fontWeight:800,textTransform:"uppercase",letterSpacing:".06em",color:"var(--text3)",margin:0}}>📋 Course Breakdown</p>
                </div>
                {res.breakdowns.map((r,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 20px",borderBottom:i<res.breakdowns.length-1?"1px solid var(--border)":"none"}}>
                    <span style={{fontSize:13,color:"var(--text3)",fontWeight:600}}>{r.label}</span>
                    <span style={{fontSize:13,color:r.bold?"var(--brand)":"var(--text)",fontWeight:r.bold?800:600}}>{r.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </>}
      inputContent={<>
        {/* ─── COURSE TABLE CARD ─── */}
        <div style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:16,overflow:"hidden",marginBottom:16}}>
          <div style={{padding:"12px 20px",borderBottom:"1px solid var(--border)",background:`linear-gradient(135deg,${accent}18,${accent}08)`,display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:16}}>📚</span>
            <p style={{fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:".09em",color:accent,margin:0}}>Your Courses</p>
            <span style={{marginLeft:"auto",fontSize:11,fontWeight:700,color:"var(--text3)"}}>GPA Scale: 0.0 – 4.0</span>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 36px",gap:0,padding:"8px 16px",background:`linear-gradient(135deg,${accent}cc,${accent})`, }}>
            {["Course Name","Grade (0–4.0)","Credits",""].map(h=>(
              <span key={h} style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,.8)",textTransform:"uppercase",letterSpacing:".06em"}}>{h}</span>
            ))}
          </div>

          {courses.map((c,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 36px",gap:8,padding:"10px 16px",borderBottom:"1px solid var(--border)",alignItems:"center",background:i%2===0?"var(--surface)":"var(--surface2)"}}>
              <input style={inp} value={c.name} onChange={e=>upd(i,"name",e.target.value)} placeholder="Course name"/>
              <input type="number" style={{...inp,textAlign:"center",color:getGPAColor(+c.grade),fontWeight:700}} value={c.grade} onChange={e=>upd(i,"grade",e.target.value)} step="0.1" min="0" max="4"/>
              <input type="number" style={{...inp,textAlign:"center"}} value={c.credits} onChange={e=>upd(i,"credits",e.target.value)} min="1"/>
              <button onClick={()=>setCourses(courses.filter((_,j)=>j!==i))}
                style={{color:"#ef4444",fontSize:16,padding:"2px 6px",borderRadius:8,background:"rgba(239,68,68,.1)",border:"none",cursor:"pointer",lineHeight:1}}
                aria-label="Remove course">✕</button>
            </div>
          ))}

          <button onClick={()=>setCourses([...courses,{name:"New Course",grade:"3.0",credits:"3"}])}
            style={{width:"100%",padding:"11px",fontSize:13,fontWeight:700,color:accent,background:"var(--surface2)",border:"none",borderTop:"1px solid var(--border)",cursor:"pointer",fontFamily:"var(--font)"}}>
            + Add Course
          </button>
        </div>

        {/* ─── WHAT-IF CARD ─── */}
        <div style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:14,padding:"16px 20px"}}>
          <p style={{fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:".06em",color:"var(--text3)",margin:"0 0 14px"}}>🎯 What-If Simulator</p>
          <Row2>
            <N label="Target GPA" id="wgpa" value={whatIf} onChange={setWhatIf} placeholder="3.7"/>
            <N label="Next Course Credits" id="wcr" value={wCr} onChange={setWCr} placeholder="3"/>
          </Row2>
        </div>
      </>}
    />
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
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Semesters"
      resultContent={<>
        {res&&<><ResultBox label={res.primary.label} value={res.primary.value}/><StatsGrid items={res.stats}/><InsightBox insights={res.insights}/><Breakdown rows={res.breakdowns}/></>}
      </>}
      inputContent={<>
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
            <N label="Credits" id={`scr-${s.id}`} value={s.credits} onChange={v=>upd(s.id,"credits",v)} placeholder="20"/>
          </Row2>
        </div>
      ))}
      <button onClick={()=>setSemesters([...semesters,{id:Date.now(),sgpa:"",credits:""}])}
        style={{width:"100%",padding:"10px",background:"var(--p50)",border:"1px dashed var(--brand)",borderRadius:"var(--r-md)",color:"var(--brand)",fontWeight:700,fontSize:13,cursor:"pointer",marginTop:4}}>
        + Add Semester
      </button>
      </>}
    />
  );
}

// ── Scientific Calculator ─────────────────────────────────────────────
export function ScientificForm(){
  const [expr,setExpr]=useState(""),[res,setRes]=useState(null),[deg,setDeg]=useState(true),[history,setHistory]=useState([]);
  const calculate=()=>{
    if(!expr.trim()){setRes(null);return;}
    try{
      let e=expr.replace(/π/g,"Math.PI").replace(/e(?![a-z])/g,"Math.E")
        .replace(/sin\(/g,deg?"Math.sin(Math.PI/180*":"Math.sin(")
        .replace(/cos\(/g,deg?"Math.cos(Math.PI/180*":"Math.cos(")
        .replace(/tan\(/g,deg?"Math.tan(Math.PI/180*":"Math.tan(")
        .replace(/log\(/g,"Math.log10(").replace(/ln\(/g,"Math.log(")
        .replace(/√\(/g,"Math.sqrt(").replace(/x²/g,"**2").replace(/\|([^|]+)\|/g,"Math.abs($1)");
      // eslint-disable-next-line no-new-func
      const result=Function('"use strict";return ('+e+')')();
      const r={valid:true,result:typeof result==="number"?+result.toFixed(10):result,expr};
      setRes(r);
      setHistory(h=>[{expr,result:r.result},...h.slice(0,9)]);
    }catch(err){setRes({valid:false,error:"Invalid expression"});}
  };
  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Expression"
      resultContent={<>
        {res&&(res.valid?<div style={{padding:"14px 18px",background:"linear-gradient(135deg,var(--brand),var(--p800))",borderRadius:"var(--r-lg)",textAlign:"center",marginBottom:12}}>
          <p style={{fontSize:11,color:"rgba(255,255,255,.5)",marginBottom:4}}>{expr} =</p>
          <p style={{fontSize:28,fontWeight:800,color:"#fff",fontFamily:"var(--font-mono)"}}>{res.result}</p>
        </div>:<div style={{padding:"12px 16px",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"var(--r-md)",color:"#b91c1c",fontSize:13}}>⚠️ {res.error}</div>)}
        {history.length>0&&(<div style={{marginTop:10}}><L t="History"/>{history.map((h,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 12px",fontSize:12,fontFamily:"var(--font-mono)",borderBottom:"1px solid var(--border2)",cursor:"pointer"}} onClick={()=>setExpr(h.expr)}>
            <span style={{color:"var(--text2)"}}>{h.expr}</span><span style={{fontWeight:700,color:"var(--brand)"}}>{h.result}</span>
          </div>
        ))}</div>)}
      </>}
      inputContent={<>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          <input value={expr} onChange={e=>setExpr(e.target.value)} onKeyDown={e=>e.key==="Enter"&&calculate()}
            placeholder="Type expression or use buttons…"
            style={{flex:1,padding:"10px 14px",background:"var(--surface2)",border:"1.5px solid var(--border)",borderRadius:"var(--r-md)",fontSize:15,fontFamily:"var(--font-mono)",color:"var(--text)",outline:"none"}}
            onFocus={e=>e.target.style.borderColor="var(--brand)"} onBlur={e=>e.target.style.borderColor="var(--border)"}/>          <Tabs tabs={["DEG","RAD"]} active={deg?"DEG":"RAD"} onChange={v=>setDeg(v==="DEG")}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:5,marginBottom:14}}>
          {["sin","cos","tan","log","ln","√","x²","1/x","|x|","π","e"].map(fn=>(
            <button key={fn} onClick={()=>setExpr(e=>e+fn+"(")}
              style={{padding:"9px 4px",borderRadius:"var(--r-sm)",background:"var(--p50)",border:"1px solid var(--p100)",fontSize:12,fontWeight:700,color:"var(--brand)",cursor:"pointer",fontFamily:"var(--font-mono)"}}>
              {fn}
            </button>
          ))}
        </div>
        <button onClick={calculate} style={{width:"100%",padding:"12px",marginTop:14,background:"var(--brand)",color:"#fff",borderRadius:"var(--r-lg)",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"var(--font)"}}>
          Calculate =
        </button>
      </>}
    />
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
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Number"
      resultContent={<>
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
      </>}
      inputContent={<>
        <N label="Enter a Number" id="pn" value={n} onChange={setN} placeholder="e.g. 97"/>
      </>}
    />
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
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Values"
      result={res}
      loading={null}
      label="Logarithm Result"
      inputContent={<>
        <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
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
      </>}
    />
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
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Values"
      result={res}
      loading={null}
      label="Ratio Result"
      inputContent={<>
        <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
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
      </>}
    />
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
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Text"
      result={res}
      loading={null}
      label="Reading Time"
      inputContent={<>
        <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
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
      </>}
    />
  );
}

// ── LCM & GCF Calculator ──────────────────────────────────────────────
export function LCMGCFForm() {
  const [a, setA] = useState("12");
  const [b, setB] = useState("18");
  const [res, setRes] = useState(null);

  const gcd = (x, y) => !y ? Math.abs(x) : gcd(y, x % y);

  useEffect(() => {
    const numA = Math.abs(Math.round(+a)), numB = Math.abs(Math.round(+b));
    if (!numA || !numB) { setRes(null); return; }
    const g = gcd(numA, numB);
    const l = (numA * numB) / g;
    const steps = [];
    let x = numA, y = numB;
    while (y !== 0) { steps.push({ a: x, b: y, q: Math.floor(x / y), r: x % y }); [x, y] = [y, x % y]; }
    setRes(buildResult("LCM", l.toLocaleString(),
      [
        { label: "GCF / GCD", value: g.toLocaleString(), highlight: true },
        { label: "LCM", value: l.toLocaleString(), highlight: true },
        { label: "Numbers", value: `${numA} and ${numB}` },
        { label: "GCF × LCM", value: (g * l).toLocaleString() + " = " + numA + " × " + numB },
      ],
      [{ type: "tip", msg: `GCF(${numA}, ${numB}) = ${g} (Euclidean algorithm). LCM = ${numA} × ${numB} / GCF = ${l}.` }],
      null, steps.map((s, i) => ({ label: `Step ${i + 1}`, value: `${s.a} = ${s.b} × ${s.q} + ${s.r}` }))));
  }, [a, b]);

  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Numbers"
      result={res}
      loading={null}
      label="LCM & GCF"
      inputContent={<>
        <Row2>
        <N label="First Number" id="lcma" value={a} onChange={setA} placeholder="e.g. 12" />
        <N label="Second Number" id="lcmb" value={b} onChange={setB} placeholder="e.g. 18" />
      </Row2>
      </>}
    />
  );
}

// ── Factor Calculator ─────────────────────────────────────────────────
export function FactorForm() {
  const [num, setNum] = useState("360");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const n = Math.abs(Math.round(+num));
    if (!n || n > 1e9) { setRes(null); return; }
    const factors = [];
    for (let i = 1; i <= Math.sqrt(n); i++) {
      if (n % i === 0) { factors.push(i); if (i !== n / i) factors.push(n / i); }
    }
    factors.sort((a, b) => a - b);
    // Prime factorization
    let x = n;
    const primeFactors = {};
    for (let p = 2; p * p <= x; p++) {
      while (x % p === 0) { primeFactors[p] = (primeFactors[p] || 0) + 1; x /= p; }
    }
    if (x > 1) primeFactors[x] = (primeFactors[x] || 0) + 1;
    const primeFacStr = Object.entries(primeFactors).map(([p, e]) => e > 1 ? `${p}^${e}` : p).join(" × ");
    setRes(buildResult("Factor Count", factors.length + " factors",
      [
        { label: "Number", value: n.toLocaleString() },
        { label: "All Factors", value: factors.join(", ") },
        { label: "Prime Factorization", value: primeFacStr, highlight: true },
        { label: "Is Prime", value: factors.length === 2 ? "✅ Yes" : "❌ No" },
      ],
      [], null, factors.map(f => ({ label: `${f} × ${n / f}`, value: String(n) }))));
  }, [num]);

  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Number"
      result={res}
      loading={null}
      label="Factor Calculator"
      inputContent={<>
        <N label="Enter a Number" id="facnum" value={num} onChange={setNum} placeholder="e.g. 360" hint="Find all factors and prime factorization" />
      </>}
    />
  );
}

// ── Triangle Calculator ───────────────────────────────────────────────
export function TriangleForm() {
  const [mode, setMode] = useState("SSS");
  const [a, setA] = useState("3");
  const [b, setB] = useState("4");
  const [c, setC] = useState("5");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const A = +a, B = +b, C = +c;
    if (!A || !B || !C) { setRes(null); return; }
    const cosA = (B * B + C * C - A * A) / (2 * B * C);
    const cosB = (A * A + C * C - B * B) / (2 * A * C);
    const cosC = (A * A + B * B - C * C) / (2 * A * B);
    if (Math.abs(cosA) > 1 || Math.abs(cosB) > 1 || Math.abs(cosC) > 1) { setRes(null); return; }
    const angA = Math.acos(cosA) * 180 / Math.PI;
    const angB = Math.acos(cosB) * 180 / Math.PI;
    const angC = Math.acos(cosC) * 180 / Math.PI;
    const s = (A + B + C) / 2;
    const area = Math.sqrt(s * (s - A) * (s - B) * (s - C));
    const perimeter = A + B + C;
    const circumR = (A * B * C) / (4 * area);
    const inR = area / s;
    setRes(buildResult("Area", area.toFixed(4),
      [
        { label: "Area", value: area.toFixed(4) + " sq units", highlight: true },
        { label: "Perimeter", value: perimeter.toFixed(4) },
        { label: "Angle A", value: angA.toFixed(2) + "°" },
        { label: "Angle B", value: angB.toFixed(2) + "°" },
        { label: "Angle C", value: angC.toFixed(2) + "°" },
      ],
      [{ type: "tip", msg: `${angA < 90 && angB < 90 && angC < 90 ? "Acute" : angA === 90 || angB === 90 || angC === 90 ? "Right" : "Obtuse"} triangle. Circumradius: ${circumR.toFixed(3)}, Inradius: ${inR.toFixed(3)}.` }],
      null, []));
  }, [a, b, c, mode]);

  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Triangle"
      result={res}
      loading={null}
      label="Triangle"
      inputContent={<>
        <Tabs tabs={["SSS (3 Sides)", "SAS", "ASA"]} active={mode === "SSS" ? "SSS (3 Sides)" : mode} onChange={v => setMode(v.split(" ")[0])} />
      <Row3>
        <N label="Side a" id="tri_a" value={a} onChange={setA} unit="units" />
        <N label="Side b" id="tri_b" value={b} onChange={setB} unit="units" />
        <N label="Side c" id="tri_c" value={c} onChange={setC} unit="units" />
      </Row3>
      </>}
    />
  );
}

// ── Circle Calculator ─────────────────────────────────────────────────
export function CircleForm() {
  const [input, setInput] = useState("5");
  const [inputType, setInputType] = useState("radius");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const v = +input;
    if (!v) { setRes(null); return; }
    const r = inputType === "radius" ? v : inputType === "diameter" ? v / 2 : inputType === "circumference" ? v / (2 * Math.PI) : Math.sqrt(v / Math.PI);
    const d = 2 * r;
    const circumference = 2 * Math.PI * r;
    const area = Math.PI * r * r;
    setRes(buildResult("Area", area.toFixed(4),
      [
        { label: "Radius", value: r.toFixed(4), highlight: true },
        { label: "Diameter", value: d.toFixed(4) },
        { label: "Circumference", value: circumference.toFixed(4) },
        { label: "Area", value: area.toFixed(4), highlight: true },
      ],
      [], null, [
        { label: "Semi-circle Area", value: (area / 2).toFixed(4) },
        { label: "Quarter-circle Area", value: (area / 4).toFixed(4) },
        { label: "Area / Circumference", value: (area / circumference).toFixed(4) + " = r/2" },
      ]));
  }, [input, inputType]);

  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Circle"
      result={res}
      loading={null}
      label="Circle"
      inputContent={<>
        <Sel label="Known Value" id="cirinput" value={inputType} onChange={setInputType} opts={[
        { v: "radius", l: "Radius" }, { v: "diameter", l: "Diameter" },
        { v: "circumference", l: "Circumference" }, { v: "area", l: "Area" },
      ]} />
      <N label={inputType.charAt(0).toUpperCase() + inputType.slice(1)} id="cirval" value={input} onChange={setInput} unit="units" />
      </>}
    />
  );
}

// ── Volume Calculator ─────────────────────────────────────────────────
export function VolumeForm() {
  const [shape, setShape] = useState("sphere");
  const [r, setR] = useState("5");
  const [h, setH] = useState("10");
  const [l, setL] = useState("5");
  const [w, setW] = useState("4");
  const [res, setRes] = useState(null);

  useEffect(() => {
    let vol, formula;
    const R = +r, H = +h, L = +l, W = +w;
    if (shape === "sphere") { vol = (4 / 3) * Math.PI * R ** 3; formula = `V = (4/3)π × r³ = (4/3)π × ${R}³`; }
    else if (shape === "cylinder") { vol = Math.PI * R ** 2 * H; formula = `V = π × r² × h = π × ${R}² × ${H}`; }
    else if (shape === "cone") { vol = (1 / 3) * Math.PI * R ** 2 * H; formula = `V = (1/3)π × r² × h`; }
    else if (shape === "cube") { vol = L ** 3; formula = `V = l³ = ${L}³`; }
    else if (shape === "cuboid") { vol = L * W * H; formula = `V = l × w × h = ${L} × ${W} × ${H}`; }
    else if (shape === "pyramid") { vol = (1 / 3) * L * W * H; formula = `V = (1/3) × l × w × h`; }
    if (!vol || !isFinite(vol)) { setRes(null); return; }
    setRes(buildResult("Volume", vol.toFixed(4) + " cu units",
      [
        { label: "Volume", value: vol.toFixed(4) + " cu units", highlight: true },
        { label: "Formula", value: formula },
        { label: "In Liters (if units = cm)", value: (vol / 1000).toFixed(4) + " L" },
      ],
      [], null, []));
  }, [shape, r, h, l, w]);

  const needsRadius = ["sphere", "cylinder", "cone"].includes(shape);
  const needsHeight = ["cylinder", "cone", "cuboid", "pyramid"].includes(shape);
  const needsLength = ["cube", "cuboid", "pyramid"].includes(shape);
  const needsWidth = ["cuboid", "pyramid"].includes(shape);

  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Shape"
      result={res}
      loading={null}
      label="Volume"
      inputContent={<>
        <Sel label="Shape" id="vshape" value={shape} onChange={setShape} opts={[
        { v: "sphere", l: "Sphere" }, { v: "cylinder", l: "Cylinder" }, { v: "cone", l: "Cone" },
        { v: "cube", l: "Cube" }, { v: "cuboid", l: "Rectangular Prism (Cuboid)" }, { v: "pyramid", l: "Pyramid" },
      ]} />
      <Row2>
        {needsRadius && <N label="Radius (r)" id="vr" value={r} onChange={setR} unit="units" />}
        {needsHeight && <N label="Height (h)" id="vh" value={h} onChange={setH} unit="units" />}
        {needsLength && <N label={shape === "cube" ? "Side (l)" : "Length (l)"} id="vl" value={l} onChange={setL} unit="units" />}
        {needsWidth && <N label="Width (w)" id="vw" value={w} onChange={setW} unit="units" />}
      </Row2>
      </>}
    />
  );
}

// ── Z-Score Calculator ────────────────────────────────────────────────
export function ZScoreForm() {
  const [x, setX] = useState("75");
  const [mean, setMean] = useState("70");
  const [std, setStd] = useState("10");
  const [res, setRes] = useState(null);

  // Error function approximation
  const erf = z => {
    const t = 1 / (1 + 0.5 * Math.abs(z));
    const tau = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087294)))))))));
    return z >= 0 ? 1 - tau : tau - 1;
  };

  useEffect(() => {
    const X = +x, mu = +mean, sigma = +std;
    if (!sigma || sigma <= 0) { setRes(null); return; }
    const z = (X - mu) / sigma;
    const percentile = (0.5 * (1 + erf(z / Math.sqrt(2))) * 100).toFixed(2);
    setRes(buildResult("Z-Score", z.toFixed(4),
      [
        { label: "Z-Score", value: z.toFixed(4), highlight: true },
        { label: "Percentile", value: percentile + "%", highlight: true },
        { label: "Values Above", value: (100 - +percentile).toFixed(2) + "%" },
        { label: "Interpretation", value: Math.abs(z) < 1 ? "Within 1σ (68%)" : Math.abs(z) < 2 ? "Within 2σ (95%)" : Math.abs(z) < 3 ? "Within 3σ (99.7%)" : "Extreme outlier" },
      ],
      [{ type: "tip", msg: `Z = ${z.toFixed(2)}: the value ${X} is ${Math.abs(z).toFixed(2)} standard deviations ${z >= 0 ? "above" : "below"} the mean of ${mu}.` }],
      null, []));
  }, [x, mean, std]);

  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Values"
      result={res}
      loading={null}
      label="Z-Score"
      inputContent={<>
        <Row3>
        <N label="Value (X)" id="zsx" value={x} onChange={setX} />
        <N label="Mean (μ)" id="zsmu" value={mean} onChange={setMean} />
        <N label="Std Dev (σ)" id="zssig" value={std} onChange={setStd} hint="Must be > 0" />
      </Row3>
      </>}
    />
  );
}

// ── Permutation & Combination Calculator ─────────────────────────────
export function PermCombForm() {
  const [n, setN] = useState("10");
  const [r, setR] = useState("3");
  const [res, setRes] = useState(null);

  const fact = x => x <= 1 ? 1 : x * fact(x - 1);

  useEffect(() => {
    const N = Math.round(+n), R = Math.round(+r);
    if (!N || !R || R > N || N > 20) { setRes(null); return; }
    const perm = fact(N) / fact(N - R);
    const comb = fact(N) / (fact(R) * fact(N - R));
    setRes(buildResult("Combinations C(n,r)", comb.toLocaleString(),
      [
        { label: "P(n,r) — Permutations", value: perm.toLocaleString(), highlight: true },
        { label: "C(n,r) — Combinations", value: comb.toLocaleString(), highlight: true },
        { label: "n! = " + N + "!", value: fact(N).toLocaleString() },
        { label: "r! = " + R + "!", value: fact(R).toLocaleString() },
      ],
      [{ type: "tip", msg: `P(${N},${R}) = ${perm.toLocaleString()} (order matters). C(${N},${R}) = ${comb.toLocaleString()} (order doesn't matter).` }],
      null, [
        { label: "P(n,r) Formula", value: `${N}! / (${N}-${R})! = ${perm.toLocaleString()}` },
        { label: "C(n,r) Formula", value: `${N}! / (${R}! × ${N - R}!) = ${comb.toLocaleString()}` },
      ]));
  }, [n, r]);

  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Values"
      result={res}
      loading={null}
      label="Permutation & Combination"
      inputContent={<>
        <Row2>
        <N label="n (Total Items)" id="pcn" value={n} onChange={setN} hint="Max 20 (factorial overflow above)" />
        <N label="r (Choose)" id="pcr" value={r} onChange={setR} hint="Must be ≤ n" />
      </Row2>
      </>}
    />
  );
}

// ── Average Calculator ────────────────────────────────────────────────
export function AverageForm() {
  const [data, setData] = useState("10, 20, 30, 40, 50");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const nums = data.split(/[,\s\n]+/).map(Number).filter(n => !isNaN(n));
    if (nums.length === 0) { setRes(null); return; }
    const sorted = [...nums].sort((a, b) => a - b);
    const mean = nums.reduce((s, v) => s + v, 0) / nums.length;
    const median = nums.length % 2 === 0
      ? (sorted[nums.length / 2 - 1] + sorted[nums.length / 2]) / 2
      : sorted[Math.floor(nums.length / 2)];
    const freq = {};
    nums.forEach(v => freq[v] = (freq[v] || 0) + 1);
    const maxFreq = Math.max(...Object.values(freq));
    const modes = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);
    const variance = nums.reduce((s, v) => s + (v - mean) ** 2, 0) / nums.length;
    const stdDev = Math.sqrt(variance);
    setRes(buildResult("Mean", mean.toFixed(4),
      [
        { label: "Mean (Average)", value: mean.toFixed(4), highlight: true },
        { label: "Median", value: median.toFixed(4) },
        { label: "Mode", value: modes.join(", ") },
        { label: "Std Deviation", value: stdDev.toFixed(4) },
        { label: "Range", value: `${sorted[0]} – ${sorted[sorted.length - 1]}` },
        { label: "Count", value: nums.length },
      ],
      [], null, []));
  }, [data]);

  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Numbers"
      result={res}
      loading={null}
      label="Average"
      inputContent={<>
        <div style={{ marginBottom: 16 }}>
        <L t="Enter Numbers (comma or space separated)" id="avgdata" />
        <textarea id="avgdata" value={data} onChange={e => setData(e.target.value)} rows={4}
          style={{ width: "100%", padding: "12px 14px", background: "var(--surface2)", border: "1.5px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 14, color: "var(--text)", fontFamily: "var(--font-mono)", resize: "vertical", outline: "none" }} />
      </div>
      </>}
    />
  );
}

// ── Percent Error Calculator ──────────────────────────────────────────
export function PercentErrorForm() {
  const [experimental, setExperimental] = useState("9.8");
  const [theoretical, setTheoretical] = useState("10");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const exp = +experimental, theo = +theoretical;
    if (!theo) { setRes(null); return; }
    const error = Math.abs(exp - theo) / Math.abs(theo) * 100;
    const absError = Math.abs(exp - theo);
    const relError = absError / Math.abs(theo);
    setRes(buildResult("Percent Error", error.toFixed(4) + "%",
      [
        { label: "Percent Error", value: error.toFixed(4) + "%", highlight: true, warn: error > 10 },
        { label: "Absolute Error", value: absError.toFixed(4) },
        { label: "Relative Error", value: relError.toFixed(6) },
        { label: "Accuracy", value: (100 - error).toFixed(4) + "%" },
      ],
      [{ type: error <= 5 ? "tip" : "warn", msg: `${error.toFixed(2)}% error. ${error <= 1 ? "Excellent accuracy!" : error <= 5 ? "Good accuracy." : error <= 10 ? "Moderate error — check measurement technique." : "High error — significant deviation from expected value."}` }],
      null, [
        { label: "Experimental Value", value: String(exp) },
        { label: "Theoretical Value", value: String(theo) },
        { label: "Difference", value: (exp - theo).toFixed(4) + (exp > theo ? " (over)" : " (under)") },
      ]));
  }, [experimental, theoretical]);

  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Values"
      result={res}
      loading={null}
      label="Percent Error"
      inputContent={<>
        <Row2>
        <N label="Experimental Value" id="pee" value={experimental} onChange={setExperimental} hint="Your measured result" />
        <N label="Theoretical Value" id="pet" value={theoretical} onChange={setTheoretical} hint="The accepted/expected value" />
      </Row2>
      </>}
    />
  );
}

// ── Linear Equation Solver ────────────────────────────────────────────
export function LinearEquationForm() {
  const [a, setA] = useState("2");
  const [b, setB] = useState("6");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const A = +a, B = +b;
    if (!A) { setRes(null); return; }
    const x = -B / A;
    setRes(buildResult("Solution", `x = ${x.toFixed(6)}`,
      [
        { label: "Equation", value: `${A}x + ${B} = 0` },
        { label: "Solution", value: `x = ${x}`, highlight: true },
        { label: "Verification", value: `${A}(${x}) + ${B} = ${(A * x + B).toFixed(6)}` },
      ],
      [], null, [
        { label: "Step 1", value: `${A}x = -${B}` },
        { label: "Step 2", value: `x = ${-B} / ${A}` },
        { label: "Step 3", value: `x = ${x}` },
      ]));
  }, [a, b]);

  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Equation"
      result={res}
      loading={null}
      label="Linear Equation"
      inputContent={<>
        <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 14 }}>Solve for x in: <strong>ax + b = 0</strong></p>
      <Row2>
        <N label="Coefficient a (of x)" id="lea" value={a} onChange={setA} hint="Must not be 0" />
        <N label="Constant b" id="leb" value={b} onChange={setB} />
      </Row2>
      </>}
    />
  );
}

// ── Distance Calculator ───────────────────────────────────────────────
export function DistanceForm() {
  const [x1, setX1] = useState("0");
  const [y1, setY1] = useState("0");
  const [x2, setX2] = useState("3");
  const [y2, setY2] = useState("4");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const X1 = +x1, Y1 = +y1, X2 = +x2, Y2 = +y2;
    const dist = Math.sqrt((X2 - X1) ** 2 + (Y2 - Y1) ** 2);
    const midX = (X1 + X2) / 2, midY = (Y1 + Y2) / 2;
    const slope = X2 !== X1 ? (Y2 - Y1) / (X2 - X1) : Infinity;
    setRes(buildResult("Distance", dist.toFixed(6),
      [
        { label: "Distance", value: dist.toFixed(6), highlight: true },
        { label: "Midpoint", value: `(${midX}, ${midY})` },
        { label: "Slope", value: isFinite(slope) ? slope.toFixed(4) : "Undefined (vertical)" },
        { label: "Δx, Δy", value: `${X2 - X1}, ${Y2 - Y1}` },
      ],
      [{ type: "tip", msg: `Formula: √((${X2}-${X1})² + (${Y2}-${Y1})²) = √(${(X2 - X1) ** 2} + ${(Y2 - Y1) ** 2}) = ${dist.toFixed(4)}` }],
      null, []));
  }, [x1, y1, x2, y2]);

  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Points"
      result={res}
      loading={null}
      label="Distance"
      inputContent={<>
        <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 14 }}>Enter coordinates of two points to calculate distance, midpoint, and slope.</p>
      <Row2>
        <N label="Point 1 — X₁" id="dstx1" value={x1} onChange={setX1} />
        <N label="Point 1 — Y₁" id="dsty1" value={y1} onChange={setY1} />
      </Row2>
      <Row2>
        <N label="Point 2 — X₂" id="dstx2" value={x2} onChange={setX2} />
        <N label="Point 2 — Y₂" id="dsty2" value={y2} onChange={setY2} />
      </Row2>
      </>}
    />
  );
}

// Default export

