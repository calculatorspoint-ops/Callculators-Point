import { useState, useEffect } from "react";
import { 
  calcBMI, calcCalorie, calcBMR, calcMacro, calcWater, 
  calcHeartRate, calcBodyFat, calcIdealWeight, calcOneRepMax, calcPregnancy,
  calcCaloriesBurned, calcSleep, MET_ACTIVITIES, round, fmtC, fmt 
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

// ── BMI ──────────────────────────────────────────────────────────────
export function BMIForm(){
  const init = readCalcParams({ w: 70, h: 170, age: 30 });
  const [sex,setSex]=useState("male"),[w,setW]=useState(init.w),[h,setH]=useState(init.h),[age,setAge]=useState(init.age),[unit,setUnit]=useState("metric");
  const [res,setRes]=useState(null),[load,setLoad]=useState(false);
  useEffect(()=>{
    setLoad(true);
    const t=setTimeout(()=>{
      const d=calcBMI({weight:w,height:h,gender:sex,age,unit});
      if(!d){setRes(null);setLoad(false);return;}
      setRes(buildResult("Your BMI",d.bmi.toString(),
        [{label:"Category",value:d.category,highlight:d.category==="Normal Weight"},{label:"Health Risk",value:d.risk},{label:"Ideal Weight",value:d.idealMin+"–"+d.idealMax+" kg"},{label:"Est. Body Fat",value:d.bfPct+"%"}],
        d.insights,{type:"gauge",pct:d.gauge,color:d.color},d.breakdowns));
      setLoad(false);
    },80);
    return()=>clearTimeout(t);
  },[sex,w,h,age,unit]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Tabs tabs={["Metric","Imperial"]} active={unit==="metric"?"Metric":"Imperial"} onChange={v=>setUnit(v==="Metric"?"metric":"imperial")}/>
        <Tabs tabs={["Male","Female"]} active={sex==="male"?"Male":"Female"} onChange={v=>setSex(v==="Male"?"male":"female")}/>
        <Sl label={unit==="metric"?"Weight (kg)":"Weight (lbs)"} id="bw" min={30} max={unit==="metric"?300:660} step={0.5} value={w} onChange={setW} fmt={v=>`${v} ${unit==="metric"?"kg":"lbs"}`}/>
        <Sl label={unit==="metric"?"Height (cm)":"Height (ft)"} id="bh" min={unit==="metric"?100:3} max={unit==="metric"?250:8} step={unit==="metric"?0.5:0.1} value={h} onChange={setH} fmt={v=>`${v} ${unit==="metric"?"cm":"ft"}`}/>
        <Sl label="Age" id="bage" min={10} max={100} value={age} onChange={setAge} fmt={v=>`${v} years`}/>
      </div>
      <div className="sticky-res"><Panel result={res} loading={load} label="Your BMI" shareParams={{w,h,age,sex}}/></div>
    </div>
  );
}

// ── Calorie / TDEE ───────────────────────────────────────────────────
export function CalorieForm(){
  const [sex,setSex]=useState("male"),[w,setW]=useState(70),[h,setH]=useState(170),[a,setA]=useState(30),[act,setAct]=useState("moderate"),[goal,setGoal]=useState("maintain"),[formula,setFormula]=useState("mifflin");
  const [res,setRes]=useState(null),[load,setLoad]=useState(false);
  useEffect(()=>{
    setLoad(true);
    const t=setTimeout(()=>{
      const d=calcCalorie({weight:w,height:h,age:a,gender:sex,activityLevel:act,goal,formula});
      if(!d){setRes(null);setLoad(false);return;}
      const chart={type:"bar",data:d.goals.map(g=>({label:g.label,value:g.cal,color:g.color})),xKey:"label",dataKey:"value"};
      setRes(buildResult("Daily Calories (TDEE)",d.tdee+" kcal",
        [{label:"BMR",value:d.bmr+" kcal"},{label:"Goal Cal",value:d.goalCal+" kcal",highlight:true},{label:"Protein",value:d.macros.protein+"g"},{label:"Carbs",value:d.macros.carbs+"g"}],
        d.insights,chart,d.breakdowns));
      setLoad(false);
    },80);
    return()=>clearTimeout(t);
  },[sex,w,h,a,act,goal,formula]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Tabs tabs={["Male","Female"]} active={sex==="male"?"Male":"Female"} onChange={v=>setSex(v==="Male"?"male":"female")}/>
        <Row2><Sl label="Weight (kg)" id="cw" min={30} max={200} step={0.5} value={w} onChange={setW} fmt={v=>`${v}kg`}/><Sl label="Height (cm)" id="ch" min={100} max={250} step={0.5} value={h} onChange={setH} fmt={v=>`${v}cm`}/></Row2>
        <Sl label="Age" id="ca" min={10} max={100} value={a} onChange={setA} fmt={v=>`${v} years`}/>
        <Sel label="Activity Level" id="cact" value={act} onChange={setAct} opts={[{v:"sedentary",l:"Sedentary (desk job)"},{v:"light",l:"Light (1–3 workouts/wk)"},{v:"moderate",l:"Moderate (3–5 workouts/wk)"},{v:"active",l:"Active (6–7 workouts/wk)"},{v:"veryActive",l:"Very Active (athlete)"}]}/>
        <Row2>
          <Sel label="Goal" id="cg" value={goal} onChange={setGoal} opts={[{v:"loseFast",l:"Lose Fast (−1kg/wk)"},{v:"lose",l:"Lose (−0.5kg/wk)"},{v:"maintain",l:"Maintain Weight"},{v:"lean",l:"Lean Bulk"},{v:"bulk",l:"Bulk (+500kcal)"}]}/>
          <Sel label="Formula" id="cf2" value={formula} onChange={setFormula} opts={[{v:"mifflin",l:"Mifflin-St Jeor"},{v:"harris",l:"Harris-Benedict"}]}/>
        </Row2>
      </div>
      <div className="sticky-res"><Panel result={res} loading={load} label="Daily Calories" shareParams={{w,h,a:a,sex,act,goal}}/></div>
    </div>
  );
}

// ── BMR ──────────────────────────────────────────────────────────────
export function BMRForm(){
  const [sex,setSex]=useState("male"),[w,setW]=useState(70),[h,setH]=useState(170),[a,setA]=useState(30);
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const t=setTimeout(()=>{
      const d=calcBMR({weight:w,height:h,age:a,gender:sex});
      if(!d){setRes(null);return;}
      setRes({
        ...buildResult("BMR (Mifflin)",d.mifflin+" kcal",
          [{label:"Mifflin",value:d.mifflin+" kcal",highlight:true},{label:"Harris",value:d.harris+" kcal"},{label:"Difference",value:Math.abs(d.mifflin-d.harris)+" kcal"}],
          d.insights,null,d.breakdowns),
        tdeeByLevel: d.tdeeByLevel
      });
    },80);
    return()=>clearTimeout(t);
  },[sex,w,h,a]);

  return (
    <div>
      <Tabs tabs={["Male","Female"]} active={sex==="male"?"Male":"Female"} onChange={v=>setSex(v==="Male"?"male":"female")}/>
      <Row2>
        <Sl label="Weight (kg)" id="bmw" min={30} max={200} step={0.5} value={w} onChange={setW} fmt={v=>`${v}kg`}/>
        <Sl label="Height (cm)" id="bmh" min={100} max={250} step={0.5} value={h} onChange={setH} fmt={v=>`${v}cm`}/>
      </Row2>
      <Sl label="Age" id="bma" min={10} max={100} value={a} onChange={setA} fmt={v=>`${v} years`}/>
      {res&&<>
        <ResultBox label={res.primary.label} value={res.primary.value}/>
        <StatsGrid items={res.stats}/>
        <InsightBox insights={res.insights}/>
        <div style={{marginTop:14}}>
          <L t="TDEE by Activity Level"/>
          {res.tdeeByLevel?.map(l=>(
            <div key={l.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 14px",borderBottom:"1px solid var(--border2)",fontSize:13}}>
              <span style={{color:"var(--text2)"}}>{l.label} <span style={{fontSize:11,color:"var(--text3)"}}>({l.desc})</span></span>
              <span style={{fontWeight:700,color:"var(--brand)"}}>{l.tdee} kcal</span>
            </div>
          ))}
        </div>
      </>}
    </div>
  );
}

// ── Body Fat (Upgraded — Sliders + Gauge + 2-col) ─────────────────
export function BodyFatForm(){
  const [sex,setSex]=useState("male"),[h,setH]=useState(170),[neck,setNeck]=useState(38),[waist,setWaist]=useState(85),[hip,setHip]=useState(95);
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const t=setTimeout(()=>{
      const d=calcBodyFat({height:h,neck,waist,hip,gender:sex});
      if(!d){setRes(null);return;}
      // Build a gauge chart to visualize body fat position
      const bfNum = parseFloat(d.bf) || 20;
      const gaugePos = Math.min(Math.max((bfNum / 45) * 100, 2), 98);
      const chart = {type:"gauge",pct:gaugePos,color:
        d.category==="Athletic"||d.category==="Fitness"?"#16a34a":
        d.category==="Average"?"#f59e0b":"#dc2626"};
      setRes(buildResult("Body Fat %",d.bf+"%",
        [{label:"Category",value:d.category,highlight:d.category==="Fitness"||d.category==="Athletic"},
         {label:"Fat Mass",value:Math.round(+h/100*+h/100*(bfNum/100)*70)+" kg (est)"},
         {label:"Lean Mass",value:Math.round(70-70*(bfNum/100))+" kg (est)"}],
        d.insights,chart,d.breakdowns));
    },80);
    return()=>clearTimeout(t);
  },[sex,h,neck,waist,hip]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Tabs tabs={["Male","Female"]} active={sex==="male"?"Male":"Female"} onChange={v=>setSex(v==="Male"?"male":"female")}/>
        <Sl label="Height" id="bfh" min={120} max={220} step={1} value={h} onChange={setH} fmt={v=>`${v} cm`}/>
        <Sl label="Neck Circumference" id="bfn" min={25} max={60} step={0.5} value={neck} onChange={setNeck} fmt={v=>`${v} cm`}/>
        <Sl label="Waist Circumference" id="bfw" min={50} max={150} step={0.5} value={waist} onChange={setWaist} fmt={v=>`${v} cm`}/>
        {sex==="female"&&<Sl label="Hip Circumference" id="bfhip" min={60} max={160} step={0.5} value={hip} onChange={setHip} fmt={v=>`${v} cm`}/>}
      </div>
      <div className="sticky-res">
        <Panel result={res} loading={null} label="Body Fat %"/>
      </div>
    </div>
  );
}

// ── Ideal Weight (Upgraded — Bar Chart comparison) ─────────────────
export function IdealWeightForm(){
  const [sex,setSex]=useState("male"),[h,setH]=useState(170);
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const t=setTimeout(()=>{
      const d=calcIdealWeight({height:h,gender:sex});
      if(!d){setRes(null);return;}
      const chart = {type:"bar",data:[
        {label:"Devine",value:+d.devine,color:"#2563eb"},
        {label:"Miller",value:+d.miller,color:"#16a34a"},
        {label:"Robinson",value:+d.robinson||+d.avg,color:"#f59e0b"},
        {label:"BMI Min",value:+d.bmiMin,color:"#7c3aed"},
        {label:"BMI Max",value:+d.bmiMax,color:"#dc2626"},
      ]};
      setRes(buildResult("Ideal Weight (avg)",d.avg+" kg",
        [{label:"Devine",value:d.devine+" kg"},{label:"Miller",value:d.miller+" kg"},{label:"BMI Range",value:d.bmiMin+"–"+d.bmiMax+" kg",highlight:true},{label:"Consensus",value:d.avg+" kg"}],
        d.insights,chart,d.breakdowns));
    },80);
    return()=>clearTimeout(t);
  },[sex,h]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Tabs tabs={["Male","Female"]} active={sex==="male"?"Male":"Female"} onChange={v=>setSex(v==="Male"?"male":"female")}/>
        <Sl label="Height" id="iwh" min={100} max={250} step={0.5} value={h} onChange={setH} fmt={v=>`${v} cm`}/>
      </div>
      <div className="sticky-res">
        <Panel result={res} loading={null} label="Ideal Weight"/>
      </div>
    </div>
  );
}

// ── Macro Calculator ─────────────────────────────────────────────────
export function MacroForm(){
  const [cal,setCal]=useState("2000"),[goal,setGoal]=useState("maintain"),[bw,setBw]=useState("70");
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const t=setTimeout(()=>{
      const d=calcMacro({calories:cal,goal,bodyWeight:bw});
      const chart={type:"donut",data:d.pieData};
      setRes(buildResult("Daily Macros",`P:${d.protein}g C:${d.carbs}g F:${d.fat}g`,
        [{label:"Calories",value:d.calories+" kcal",highlight:true},{label:"Protein",value:d.protein+"g"},{label:"Carbs",value:d.carbs+"g"},{label:"Fat",value:d.fat+"g"}],
        d.insights,chart,d.breakdowns));
    },80);
    return()=>clearTimeout(t);
  },[cal,goal,bw]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <N label="Daily Calorie Target" id="mc2" value={cal} onChange={setCal} unit="kcal"/>
        <N label="Body Weight" id="mbw" value={bw} onChange={setBw} unit="kg"/>
        <Sel label="Goal" id="mg" value={goal} onChange={setGoal} opts={[{v:"lose",l:"Lose Weight (−500)"},{v:"maintain",l:"Maintain Weight"},{v:"gain",l:"Lean Gain (+300)"},{v:"aggressive",l:"Aggressive Bulk (+500)"}]}/>
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Macros" shareParams={{cal,goal,bw}}/></div>
    </div>
  );
}

// ── Water Intake (Upgraded — Hydration Visual + 2-col) ──────────────
export function WaterForm(){
  const [w,setW]=useState(70),[act,setAct]=useState("moderate"),[climate,setClimate]=useState("moderate");
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const t=setTimeout(()=>{
      const d=calcWater({weight:w,activity:act,climate});
      setRes({
        ...buildResult("Daily Water Intake",d.total+"L",
          [{label:"Base",value:d.base+"L"},{label:"Total",value:d.total+"L",highlight:true},{label:"In Glasses",value:d.glasses+" × 250ml"},{label:"In ml",value:d.ml+"ml"}],
          d.insights,null,d.breakdowns),
        raw: d
      });
    },80);
    return()=>clearTimeout(t);
  },[w,act,climate]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Sl label="Body Weight" id="ww" min={30} max={150} value={w} onChange={setW} fmt={v=>`${v} kg`}/>
        <Row2>
          <Sel label="Activity Level" id="wact" value={act} onChange={setAct} opts={[{v:"sedentary",l:"Sedentary"},{v:"light",l:"Light"},{v:"moderate",l:"Moderate"},{v:"active",l:"Active"},{v:"veryActive",l:"Very Active"}]}/>
          <Sel label="Climate" id="wclimate" value={climate} onChange={setClimate} opts={[{v:"cool",l:"Cool"},{v:"moderate",l:"Moderate"},{v:"warm",l:"Warm"},{v:"hot",l:"Hot"}]}/>
        </Row2>
        {/* Hydration visual */}
        {res?.raw && (
          <div style={{marginTop:16,padding:"16px",background:"var(--surface2)",borderRadius:"var(--r-lg)",border:"1px solid var(--border)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <span style={{fontSize:12,fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:".05em"}}>💧 Daily Hydration Goal</span>
              <span style={{fontSize:13,fontWeight:800,color:"#2563eb"}}>{res.raw.total}L</span>
            </div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap",justifyContent:"center"}}>
              {Array.from({length: Math.min(+res.raw.glasses || 8, 16)}).map((_,i) => (
                <div key={i} style={{width:28,height:36,borderRadius:"0 0 6px 6px",border:"2px solid #93c5fd",background:"linear-gradient(to top, #3b82f6 80%, transparent 80%)",display:"flex",alignItems:"flex-end",justifyContent:"center",fontSize:8,color:"#fff",fontWeight:700,paddingBottom:2}}>
                  {i+1}
                </div>
              ))}
            </div>
            <p style={{textAlign:"center",fontSize:11,color:"var(--text3)",marginTop:8}}>{res.raw.glasses} glasses of 250ml each</p>
          </div>
        )}
      </div>
      <div className="sticky-res">
        <Panel result={res} loading={null} label="Water Intake"/>
      </div>
    </div>
  );
}

// ── Heart Rate Zones ─────────────────────────────────────────────────
export function HeartRateForm(){
  const [age,setAge]=useState(30),[rhr,setRhr]=useState(60);
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const t=setTimeout(()=>{
      const d=calcHeartRate({age,restingHR:rhr});
      setRes(d);
    },80);
    return()=>clearTimeout(t);
  },[age,rhr]);
  return (
    <div>
      <Row2>
        <Sl label="Age" id="hra" min={10} max={90} value={age} onChange={setAge} fmt={v=>`${v} years`}/>
        <Sl label="Resting Heart Rate" id="hrr" min={40} max={100} value={rhr} onChange={setRhr} fmt={v=>`${v} bpm`}/>
      </Row2>
      {res&&(
        <>
          <div style={{background:"linear-gradient(135deg,var(--brand),var(--p800))",borderRadius:"var(--r-xl)",padding:"16px 20px",textAlign:"center",marginBottom:16}}>
            <p style={{fontSize:10,fontWeight:800,color:"rgba(255,255,255,.5)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}}>Maximum Heart Rate</p>
            <p style={{fontSize:36,fontWeight:800,color:"#fff"}}>{res.maxHR} <span style={{fontSize:16}}>bpm</span></p>
          </div>
          {res.zones.map(z=>(
            <div key={z.zone} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",marginBottom:8,background:`${z.color}18`,border:`1.5px solid ${z.color}40`,borderRadius:"var(--r-md)"}}>
              <div>
                <div style={{fontWeight:700,fontSize:13,color:z.color}}>Zone {z.zone}: {z.label}</div>
                <div style={{fontSize:11,color:"var(--text3)",marginTop:2}}>{z.desc}</div>
              </div>
              <div style={{fontWeight:800,fontSize:16,color:z.color}}>{z.minBPM}–{z.maxBPM} bpm</div>
            </div>
          ))}
          <InsightBox insights={res.insights}/>
        </>
      )}
    </div>
  );
}

// ── One Rep Max ──────────────────────────────────────────────────────
export function OneRMForm(){
  const [w,setW]=useState("100"),[r,setR]=useState("8");
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const t=setTimeout(()=>{
      const d=calcOneRepMax({weight:w,reps:r});
      if(!d){setRes(null);return;}
      setRes({
        ...buildResult("Estimated 1RM",d.avg+" kg",
          [{label:"Epley",value:d.epley+" kg"},{label:"Brzycki",value:d.brzycki+" kg"},{label:"Lander",value:d.lander+" kg"},{label:"Average",value:d.avg+" kg",highlight:true}],
          d.insights,null,d.breakdowns),
        pcts: d.pcts
      });
    },80);
    return()=>clearTimeout(t);
  },[w,r]);
  return (
    <div>
      <Row2><N label="Weight Lifted (kg)" id="ow" value={w} onChange={setW}/><N label="Reps Completed" id="or" value={r} onChange={setR}/></Row2>
      {res&&(
        <>
          <ResultBox label={res.primary.label} value={res.primary.value}/>
          <StatsGrid items={res.stats}/>
          <InsightBox insights={res.insights}/>
          <L t="Training Percentages"/>
          <div className="mob-3col" style={{gap:8,marginTop:8}}>
            {res.pcts?.map(p=>(
              <div key={p.pct} style={{textAlign:"center",padding:"10px 8px",background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"var(--r-md)"}}>
                <div style={{fontSize:10,fontWeight:700,color:"var(--text3)"}}>{p.pct}%</div>
                <div style={{fontSize:15,fontWeight:800,color:"var(--brand)"}}>{p.weight}kg</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Pregnancy Due Date ────────────────────────────────────────────────
export function PregnancyForm(){
  // Default LMP to ~8 weeks ago (realistic starting point)
  const defaultLMP = (() => { const d = new Date(); d.setDate(d.getDate()-56); return d.toISOString().split('T')[0]; })();
  const [lmp,setLmp]=useState(defaultLMP);
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const t=setTimeout(()=>{
      const d=calcPregnancy({lmp});
      if(!d){setRes(null);return;}
      setRes({
        ...buildResult("Due Date",d.edd,
          [{label:"Weeks Pregnant",value:d.weeksPregnant+"wks"},{label:"Trimester",value:d.trimester},{label:"Days Left",value:d.daysLeft}],
          d.insights,null,d.breakdowns),
        milestones: d.milestones
      });
    },80);
    return()=>clearTimeout(t);
  },[lmp]);
  return (
    <div>
      <N label="First Day of Last Menstrual Period (LMP)" id="lmp" value={lmp} onChange={setLmp} type="date" hint="Used to calculate Naegele's Rule due date"/>
      {res&&(
        <>
          <ResultBox label={res.primary.label} value={res.primary.value}/>
          <StatsGrid items={res.stats}/>
          <InsightBox insights={res.insights}/>
          <L t="Pregnancy Milestones"/>
          {res.milestones?.map(m=>(
            <div key={m.week} style={{display:"flex",justifyContent:"space-between",padding:"8px 14px",borderBottom:"1px solid var(--border2)",fontSize:13}}>
              <span style={{color:"var(--text2)"}}>Week {m.week}</span>
              <span style={{color:"var(--text)"}}>{m.label}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// Placeholder for new forms

// ── Calories Burned ───────────────────────────────────────────────────
export function CaloriesBurnedForm(){
  const [weight,setWeight]=useState(70),[duration,setDuration]=useState(30),[actIdx,setActIdx]=useState(0);
  const [res,setRes]=useState(null);
  const activity=MET_ACTIVITIES[actIdx]||MET_ACTIVITIES[0];
  useEffect(()=>{
    const t=setTimeout(()=>{
      const d=calcCaloriesBurned({weight,duration,met:activity.met});
      if(!d){setRes(null);return;}
      const chart={type:"bar",data:MET_ACTIVITIES.slice(0,8).map(a=>({label:a.label.split(" ")[0],value:round(a.met*weight*(duration/60))})),xKey:"label",dataKey:"value"};
      setRes(buildResult("Calories Burned",d.calories+" kcal",
        [{label:"Fat Burned",value:d.fatGrams+"g",highlight:true},{label:"Apples equiv.",value:d.equivalents.apples+""},{label:"Big Macs",value:d.equivalents.bigMacs+""},{label:"Walk Equiv.",value:d.equivalents.walkMins+" min"}],
        d.insights,chart,d.breakdowns));
    },80);
    return()=>clearTimeout(t);
  },[weight,duration,actIdx]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Row2>
          <Sl label="Body Weight" id="cbw" min={30} max={200} step={0.5} value={weight} onChange={setWeight} fmt={v=>`${v} kg`}/>
          <Sl label="Duration" id="cbd" min={5} max={180} step={5} value={duration} onChange={setDuration} fmt={v=>`${v} min`}/>
        </Row2>
        <L t="Select Activity"/>
        <div className="mob-2col" style={{gap:6,maxHeight:260,overflowY:"auto",paddingRight:4}}>
          {MET_ACTIVITIES.map((a,i)=>(
            <button key={i} onClick={()=>setActIdx(i)} style={{padding:"8px 10px",borderRadius:"var(--r-md)",border:actIdx===i?"2px solid var(--brand)":"1px solid var(--border)",background:actIdx===i?"var(--p50)":"var(--surface)",color:actIdx===i?"var(--brand)":"var(--text2)",fontWeight:actIdx===i?700:500,fontSize:11,cursor:"pointer",textAlign:"left",minHeight:36}}>
              {a.label}
            </button>
          ))}
        </div>
        <div style={{marginTop:12,padding:"10px 14px",background:"var(--surface2)",borderRadius:"var(--r-md)",border:"1px solid var(--border)",fontSize:12,color:"var(--text3)"}}>
          MET Value: <strong style={{color:"var(--brand)"}}>{activity.met}</strong> - {activity.label}
        </div>
      </div>
      <div className="sticky-res"><Panel result={res} loading={null} label="Calories Burned"/></div>
    </div>
  );
}

// ── Sleep Calculator ──────────────────────────────────────────────────
export function SleepForm(){
  const [mode,setMode]=useState("wakeup"),[time,setTime]=useState("22:00");
  const [res,setRes]=useState(null);
  useEffect(()=>{ setTime(mode==="wakeup"?"22:00":"07:00"); },[mode]);
  useEffect(()=>{
    const d=calcSleep({mode,time});
    if(!d){setRes(null);return;}
    setRes(d);
  },[mode,time]);
  const CYCLE_COLORS=["#f87171","#34d399","#60a5fa"];
  return (
    <div>
      <Tabs tabs={["Bedtime to Wake","Wake to Bedtime"]} active={mode==="wakeup"?"Bedtime to Wake":"Wake to Bedtime"}
        onChange={v=>setMode(v==="Bedtime to Wake"?"wakeup":"bedtime")}/>
      <N label={mode==="wakeup"?"Bedtime":"Desired Wake-Up Time"} id="sleepTime" value={time} onChange={setTime} type="time"
        hint={mode==="wakeup"?"When you plan to fall asleep":"When you need to wake up"}/>
      {res&&(
        <div style={{marginTop:16}}>
          <L t={mode==="wakeup"?"Optimal Wake-Up Times":"Optimal Bedtimes"}/>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {res.results.map((r,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",borderRadius:"var(--r-lg)",border:`2px solid ${r.cycles===5?"var(--brand)":"var(--border)"}`,background:r.cycles===5?"var(--p50)":"var(--surface2)"}}>
                <div>
                  <div style={{fontWeight:700,fontSize:14,color:r.cycles===5?"var(--brand)":"var(--text)"}}>
                    {mode==="wakeup"?r.wakeup:r.bedtime}
                    {r.cycles===5&&<span style={{marginLeft:8,fontSize:11,fontWeight:800,background:"var(--brand)",color:"#fff",padding:"2px 8px",borderRadius:100}}>Best</span>}
                  </div>
                  <div style={{fontSize:12,color:"var(--text3)",marginTop:3}}>{r.cycles} cycles - {r.hours}h sleep</div>
                </div>
                <div style={{width:12,height:12,borderRadius:"50%",background:CYCLE_COLORS[i]}}/>
              </div>
            ))}
          </div>
          <div style={{marginTop:14,padding:"12px 14px",background:"var(--surface2)",borderRadius:"var(--r-lg)",border:"1px solid var(--border)",fontSize:12,color:"var(--text3)"}}>
            You fall asleep ~{res.onsetMins} min after lying down. Each sleep cycle is approx 90 min.
          </div>
          <InsightBox insights={res.insights}/>
        </div>
      )}
    </div>
  );
}
