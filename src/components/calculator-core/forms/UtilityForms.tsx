// @ts-nocheck
import { useState, useEffect, useCallback } from "react";
import { 
  calcAge, calcDateDiff, calcCountdown, calcWorkHours, calcFuel, 
  calcRandom, calcPassword, toRoman, fromRoman, calcWordCount, 
  calcBase64, UNIT_DEFS, round, fmtC, fmt 
} from "@/core/calculationEngine";
import { 
  L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency, formatMoney, FinanceLayout, ComingSoon 
} from './SharedComponents';
import { ResultBox } from '@/components/ui/ResultBox';
import { StatsGrid } from '@/components/ui/StatsGrid';
import { InsightBox } from '@/components/ui/InsightBox';
import { Breakdown } from '@/components/ui/Breakdown';

// ── Unit Converters (Omni-Directional) ───────────────────────────────
export function UnitForm({type="length"}){
  const def = UNIT_DEFS[type];
  const [activeIdx, setActiveIdx] = useState(0);
  const [rawVal, setRawVal] = useState("1");
  const [prec, setPrec] = useState(6);

  const units = type === "temp" ? ["Celsius (°C)", "Fahrenheit (°F)", "Kelvin (K)"] : def?.units || [];
  const tempMap = ["C", "F", "K"];

  const fmtN = n => {
    if (isNaN(n)) return "";
    if (n === 0) return "0";
    if (Math.abs(n) < 0.000001 || Math.abs(n) > 1e12) return n.toExponential(prec);
    return parseFloat(n.toFixed(prec)).toString();
  };

  const getBaseVal = () => {
    const v = +rawVal;
    if (isNaN(v)) return 0;
    if (type === "temp") {
      const u = tempMap[activeIdx];
      return u === "C" ? v : u === "F" ? (v - 32) * 5 / 9 : v - 273.15;
    }
    return v * def.factors[activeIdx];
  };

  const baseVal = getBaseVal();

  return (
    <FinanceLayout
      accentClass="accent-utility"
      inputTitle="Your Values"
      inputContent={<>
        <div style={{ marginBottom: 16, padding: "12px 14px", background: "linear-gradient(to right, var(--brand-l), var(--surface))", borderLeft: "4px solid var(--brand)", borderRadius: "var(--r-md)", fontSize: 13, color: "var(--text2)", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span aria-hidden="true" style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
        <span><strong>Omni-Sync Active:</strong> Type a value in <em>any</em> box below, and all other units will instantly synchronize.</span>
      </div>

      <Sl label="Decimal Precision" id="up" min={0} max={10} value={prec} onChange={setPrec} fmt={v=>`${v} places`}/>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginTop: 24 }}>
        {units.map((u, i) => {
          let displayVal = rawVal;
          if (i !== activeIdx) {
            if (rawVal === "") {
              displayVal = "";
            } else if (type === "temp") {
              const uCode = tempMap[i];
              const val = uCode === "C" ? baseVal : uCode === "F" ? baseVal * 9 / 5 + 32 : baseVal + 273.15;
              displayVal = fmtN(val);
            } else {
              displayVal = fmtN(baseVal / def.factors[i]);
            }
          }

          return (
            <N key={i} label={type === "temp" ? u : `${u} (${def.name})`} id={`u-${i}`} value={displayVal} 
              onChange={v => { setActiveIdx(i); setRawVal(v); }} />
          );
        })}
      </div>
      </>}
    />
  );
}

// ── Temperature ──────────────────────────────────────────────────────
export function TemperatureForm(){
  const [c,setC]=useState("25"),[f,setF]=useState("77"),[k,setK]=useState("298.15");
  const fromC=v=>{const n=+v;if(!isNaN(n)){setF((n*9/5+32).toFixed(2));setK((n+273.15).toFixed(2));}};
  const fromF=v=>{const n=+v;if(!isNaN(n)){const cv=(n-32)*5/9;setC(cv.toFixed(2));setK((cv+273.15).toFixed(2));}};
  const fromK=v=>{const n=+v;if(!isNaN(n)){setC((n-273.15).toFixed(2));setF(((n-273.15)*9/5+32).toFixed(2));}};
  return (
    <FinanceLayout
      accentClass="accent-utility"
      inputTitle="Your Temperature"
      inputContent={<>
        <N label="Celsius (°C)" id="tc" value={c} onChange={v=>{setC(v);fromC(v);}}/>
      <N label="Fahrenheit (°F)" id="tf" value={f} onChange={setF} onChange={v=>{setF(v);fromF(v);}}/>
      <N label="Kelvin (K)" id="tk" value={k} onChange={v=>{setK(v);fromK(v);}}/>
      <div style={{padding:"10px 14px",background:"var(--p50)",border:"1px solid var(--p100)",borderRadius:"var(--r-md)",fontSize:13,color:"var(--brand)"}}>
        💡 Type in any field — all others update instantly
      </div>
      </>}
    />
  );
}

// ── Age Calculator (Enhanced with Time) ──────────────────────────────
export function AgeForm() {
  const [dob, setDob] = useState("1995-06-15");
  const [tob, setTob] = useState(""); // time of birth HH:MM
  const [targetDate, setTargetDate] = useState("");
  const [targetTime, setTargetTime] = useState("");
  const [showTime, setShowTime] = useState(false);
  const [tick, setTick] = useState(0);
  const [res, setRes] = useState(null);

  // Live tick every second for real-time age
  useEffect(() => {
    const i = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (!dob) { setRes(null); return; }

    const buildDatetime = (date, time) => {
      if (!date) return null;
      if (time) return new Date(`${date}T${time}:00`);
      return new Date(date);
    };

    const birth = buildDatetime(dob, tob);
    const now = targetDate ? buildDatetime(targetDate, targetTime) : new Date();

    if (!birth || birth > now) { setRes(null); return; }

    const diffMs = now - birth;
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(diffMs / 60000);
    const totalHours   = Math.floor(diffMs / 3600000);
    const totalDays    = Math.floor(diffMs / 86400000);
    const totalWeeks   = Math.floor(totalDays / 7);
    const totalMonths  = Math.floor(totalDays / 30.4375);

    // Precise Y M D H M S
    const s = new Date(birth), e = new Date(now);
    let yrs = e.getFullYear() - s.getFullYear();
    let mos = e.getMonth() - s.getMonth();
    let days = e.getDate() - s.getDate();
    let hrs  = e.getHours() - s.getHours();
    let mins = e.getMinutes() - s.getMinutes();
    let secs = e.getSeconds() - s.getSeconds();

    if (secs < 0) { secs += 60; mins--; }
    if (mins < 0) { mins += 60; hrs--; }
    if (hrs  < 0) { hrs  += 24; days--; }
    if (days < 0) { days += new Date(e.getFullYear(), e.getMonth(), 0).getDate(); mos--; }
    if (mos  < 0) { mos  += 12; yrs--; }

    const nextBday = new Date(e.getFullYear(), s.getMonth(), s.getDate(), s.getHours(), s.getMinutes());
    if (nextBday <= e) nextBday.setFullYear(e.getFullYear() + 1);
    const daysToNext = Math.ceil((nextBday - e) / 86400000);

    const ZODIAC = [
      {e:20,s:"Capricorn"},{e:50,s:"Aquarius"},{e:80,s:"Pisces"},{e:110,s:"Aries"},
      {e:141,s:"Taurus"},{e:172,s:"Gemini"},{e:203,s:"Cancer"},{e:234,s:"Leo"},
      {e:266,s:"Virgo"},{e:296,s:"Libra"},{e:326,s:"Scorpio"},{e:357,s:"Sagittarius"},{e:366,s:"Capricorn"}
    ];
    const doy = Math.floor((s - new Date(s.getFullYear(), 0, 0)) / 86400000);
    const zodiac = ZODIAC.find(z => doy <= z.e)?.s || "Capricorn";

    const timeStr = tob
      ? `${yrs} yrs, ${mos} mo, ${days} d, ${hrs}h ${mins}m ${secs}s`
      : `${yrs} yrs, ${mos} mo, ${days} days`;

    setRes({
      yrs, mos, days, totalDays, totalWeeks, totalMonths, totalHours, totalMinutes, totalSeconds,
      daysToNext, zodiac, birth, timeStr, secs, hrs, mins,
    });
  }, [dob, tob, targetDate, targetTime, tick]);

  const accent = "#6366f1";
  const inputStyle = {
    display: "block", width: "100%", height: 50, padding: "0 14px",
    background: "var(--surface2)", border: "1.5px solid var(--border)",
    borderRadius: 12, fontSize: 15, color: "var(--text)",
    fontFamily: "var(--font)", outline: "none", fontWeight: 600, boxSizing: "border-box",
  };
  const lbl = { display: "block", fontSize: 13, fontWeight: 700, color: "var(--text2)", marginBottom: 8 };

  // Milestones
  const milestones = res ? [
    { days: 1000,  label: "1,000 Days",  done: res.totalDays >= 1000 },
    { days: 5000,  label: "5,000 Days",  done: res.totalDays >= 5000 },
    { days: 10000, label: "10,000 Days", done: res.totalDays >= 10000 },
    { days: 18250, label: "50 Years",    done: res.totalDays >= 18250 },
  ] : [];

  const ZODIAC_EMOJI = {
    Capricorn:"♑", Aquarius:"♒", Pisces:"♓", Aries:"♈", Taurus:"♉",
    Gemini:"♊", Cancer:"♋", Leo:"♌", Virgo:"♍", Libra:"♎", Scorpio:"♏", Sagittarius:"♐"
  };

  return (
    <FinanceLayout
      accentClass="accent-utility"
      inputTitle="Your Details"
      inputContent={<>
        <div style={{ background: "var(--surf2, var(--surface2))", borderRadius: 12, padding: "12px 16px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>🎂</span>
          {tob && !targetDate && (
            <span style={{ marginLeft: "auto", fontSize: 11, color: accent, fontWeight: 700, background: `${accent}15`, padding: "2px 8px", borderRadius: 100, border: `1px solid ${accent}40` }}>⏱ Live</span>
          )}
        </div>

        <div style={{ padding: "22px 28px 20px" }}>
          {/* DOB */}
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="age-dob" style={lbl}>Date of Birth</label>
            <input id="age-dob" type="date" value={dob} onChange={e => setDob(e.target.value)} style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.boxShadow = `0 0 0 4px ${accent}18`; }}
              onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>

          {/* Time toggle */}
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: showTime ? 16 : 18, cursor: "pointer", fontSize: 13, fontWeight: 600, color: accent }}>
            <input type="checkbox" checked={showTime} onChange={e => setShowTime(e.target.checked)}
              style={{ accentColor: accent, width: 15, height: 15 }} />
            ⏱ Include exact time of birth (seconds-accurate)
          </label>

          {showTime && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
              <div>
                <label htmlFor="age-tob" style={lbl}>Time of Birth</label>
                <input id="age-tob" type="time" value={tob} onChange={e => setTob(e.target.value)} style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.boxShadow = `0 0 0 4px ${accent}18`; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>
              <div>
                <label htmlFor="age-tt" style={lbl}>Target Time <span style={{ fontWeight: 400, color: "var(--text3)", fontSize: 11 }}>(optional)</span></label>
                <input id="age-tt" type="time" value={targetTime} onChange={e => setTargetTime(e.target.value)} style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.boxShadow = `0 0 0 4px ${accent}18`; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>
            </div>
          )}

          {/* Target date */}
          <div>
            <label htmlFor="age-td" style={lbl}>
              Calculate Age On <span style={{ fontWeight: 500, color: "var(--text3)", fontSize: 11 }}>(optional — leave blank for today)</span>
            </label>
            <input id="age-td" type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.boxShadow = `0 0 0 4px ${accent}18`; }}
              onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>
        </div>
      </>}
      resultContent={<>
        {res && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* HERO */}
          <div style={{ background: `linear-gradient(135deg,${accent}18,${accent}06)`, border: `2px solid ${accent}30`, borderRadius: 20, padding: "28px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -50, left: "50%", transform: "translateX(-50%)", width: 220, height: 220, background: `radial-gradient(circle,${accent}20,transparent 70%)`, pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em", color: accent, marginBottom: 8 }}>🎂 Exact Age</p>
              <p style={{ fontSize: "clamp(28px,7vw,52px)", fontWeight: 900, color: "var(--text)", lineHeight: 1.05, margin: "0 0 8px", letterSpacing: "-.02em" }}>
                {res.yrs} <span style={{ fontSize: "0.45em", fontWeight: 700, color: "var(--text3)" }}>years</span>
              </p>
              <p style={{ fontSize: 15, color: "var(--text2)", fontWeight: 600, margin: "0 0 10px" }}>
                {res.mos} months, {res.days} days{tob ? `, ${res.hrs}h ${res.mins}m ${res.secs}s` : ""}
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", background: `${accent}20`, borderRadius: 100, border: `1px solid ${accent}40` }}>
                <span>{ZODIAC_EMOJI[res.zodiac] || "⭐"}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: accent }}>{res.zodiac}</span>
              </div>
            </div>
          </div>

          {/* 3-METRIC GRID */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {[
              { icon: "📅", label: "Total Days",   val: res.totalDays.toLocaleString() },
              { icon: "📆", label: "Total Weeks",  val: res.totalWeeks.toLocaleString() },
              { icon: "🗓️", label: "Total Months", val: res.totalMonths.toLocaleString() },
            ].map(m => (
              <div key={m.label} style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 14, padding: "16px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 20, marginBottom: 8 }}>{m.icon}</div>
                <div style={{ fontSize: "clamp(13px,3vw,19px)", fontWeight: 900, color: "var(--text)", lineHeight: 1, wordBreak: "break-word" }}>{m.val}</div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 6, fontWeight: 600 }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* BIRTHDAY COUNTDOWN */}
          <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22 }}>🎉</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", margin: 0 }}>Next Birthday</p>
                <p style={{ fontSize: 11, color: "var(--text3)", margin: "2px 0 0", fontWeight: 600 }}>Turning {res.yrs + 1}</p>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "clamp(18px,4vw,26px)", fontWeight: 900, color: accent, margin: 0, lineHeight: 1 }}>{res.daysToNext}</p>
              <p style={{ fontSize: 11, color: "var(--text3)", margin: "2px 0 0", fontWeight: 600 }}>days away</p>
            </div>
          </div>

          {/* MILESTONE TRACKER */}
          <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", background: "var(--surf2, var(--surface2))" }}>
              <p style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text3)", margin: 0 }}>🏆 Life Milestones</p>
            </div>
            {milestones.map((m, i) => (
              <div key={m.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 20px", borderBottom: i < milestones.length - 1 ? "1px solid var(--border)" : "none", opacity: m.done ? 1 : 0.55 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 16 }}>{m.done ? "✅" : "⬜"}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{m.label}</span>
                </div>
                {m.done
                  ? <span style={{ fontSize: 11, fontWeight: 700, color: "#059669", background: "rgba(5,150,105,.1)", padding: "2px 10px", borderRadius: 100 }}>Achieved!</span>
                  : <span style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600 }}>{(m.days - res.totalDays).toLocaleString()} days left</span>
                }
              </div>
            ))}
          </div>

          {/* EXTRA STATS (hours/minutes/seconds) */}
          {tob && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {[
                { icon: "⏰", label: "Total Hours",   val: res.totalHours.toLocaleString() },
                { icon: "⏱", label: "Total Minutes", val: res.totalMinutes.toLocaleString() },
                { icon: "💓", label: "Total Seconds", val: res.totalSeconds.toLocaleString() },
              ].map(m => (
                <div key={m.label} style={{ background: `${accent}08`, border: `1.5px solid ${accent}25`, borderRadius: 14, padding: "14px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 18, marginBottom: 6 }}>{m.icon}</div>
                  <div style={{ fontSize: "clamp(11px,2.5vw,15px)", fontWeight: 900, color: accent, lineHeight: 1, wordBreak: "break-word" }}>{m.val}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 5, fontWeight: 600 }}>{m.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      </>}
    />
  );
}


// ── Date Difference ──────────────────────────────────────────────────
export function DateDiffForm(){
  const today=new Date().toISOString().split("T")[0];
  const [d1,setD1]=useState("2024-01-01"),[d2,setD2]=useState(today),[excl,setExcl]=useState(false);
  const [holidaysText, setHolidaysText] = useState("");
  const [res,setRes]=useState(null);
  
  useEffect(()=>{
    const t=setTimeout(()=>{
      const holidays = holidaysText.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
      const d=calcDateDiff({date1:d1,date2:d2,excludeWeekends:excl, holidays});
      if(!d){setRes(null);return;}
      
      const stats = [{label:"Weeks",value:d.weeks},{label:"Months",value:d.months},{label:"Years",value:d.years}];
      if (excl) stats.push({label:"Business Days",value:d.businessDays,highlight:true});
      if (excl && d.holidaysHit > 0) stats.push({label:"Holidays Excluded",value:d.holidaysHit});

      setRes(buildResult("Date Difference",d.days+" days", stats, d.insights,null,d.breakdowns));
    },80);
    return()=>clearTimeout(t);
  },[d1,d2,excl, holidaysText]);

  return (
    <FinanceLayout
      accentClass="accent-utility"
      inputTitle="Your Dates"
      resultContent={<>
        {res&&<><ResultBox label={res.primary.label} value={res.primary.value}/><StatsGrid items={res.stats}/><InsightBox insights={res.insights}/></>}
      </>}
      inputContent={<>
        <Row2>
        <N label="Start Date" id="dd1" value={d1} onChange={setD1} type="date"/>
        <N label="End Date" id="dd2" value={d2} onChange={setD2} type="date"/>
      </Row2>
      <label style={{display:"flex",alignItems:"center",gap:7,fontSize:13,fontWeight:600,color:"var(--text2)",cursor:"pointer",marginBottom:12}}>
        <input type="checkbox" checked={excl} onChange={e=>setExcl(e.target.checked)} style={{accentColor:"var(--brand)",width:14,height:14}}/>
        Exclude weekends (count business days only)
      </label>
      {excl && (
        <div style={{marginBottom: 16}}>
          <label style={{display: "block", fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6}}>
            Exclude Holidays (Optional)
          </label>
          <textarea 
            value={holidaysText}
            onChange={e => setHolidaysText(e.target.value)}
            placeholder="Enter dates (YYYY-MM-DD), one per line"
            style={{ width: "100%", padding: "9px 12px", background: "var(--surface2)", border: "1.5px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 13, color: "var(--text)", fontFamily: "var(--font)", outline: "none", minHeight: 60, resize: "vertical" }}
          />
        </div>
      )}
      </>}
    />
  );
}

// ── Countdown ────────────────────────────────────────────────────────
export function CountdownForm(){
  const [targetDate,setTargetDate]=useState(""),[name,setName]=useState("");
  const [res,setRes]=useState(null),[tick,setTick]=useState(0);
  useEffect(()=>{const i=setInterval(()=>setTick(t=>t+1),1000);return()=>clearInterval(i);},[]);
  useEffect(()=>{
    if(!targetDate){setRes(null);return;}
    const d=calcCountdown({targetDate,eventName:name});
    if(!d){setRes(null);return;}
    setRes(buildResult(d.past?"Days Since":"Days Until",d.days+" days",
      [{label:"Hours",value:d.total.hours.toLocaleString()},{label:"Minutes",value:d.total.minutes.toLocaleString()},{label:name||"Event",value:new Date(targetDate).toLocaleDateString("en-GB")}],
      d.insights,null,d.breakdowns));
  },[targetDate,name,tick]);
  return (
    <FinanceLayout
      accentClass="accent-utility"
      inputTitle="Your Event"
      resultContent={<>
        {res&&<><ResultBox label={res.primary.label} value={res.primary.value}/><StatsGrid items={res.stats}/><InsightBox insights={res.insights}/></>}
      </>}
      inputContent={<>
        <N label="Event Name (optional)" id="cn" value={name} onChange={setName} type="text" placeholder="e.g. My Birthday"/>
      <N label="Target Date" id="cd" value={targetDate} onChange={setTargetDate} type="date"/>
      </>}
    />
  );
}

// ── Work Hours ────────────────────────────────────────────────────────
export function WorkHoursForm(){
  const { fm, sym } = useCurrency();
  const [start,setStart]=useState("09:00"),[end,setEnd]=useState("17:00"),[brk,setBrk]=useState("60"),[days,setDays]=useState(5),[rate,setRate]=useState("0");
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const t=setTimeout(()=>{
      const d=calcWorkHours({start,end,breakMins:brk,daysPerWeek:days,hourlyRate:rate});
      if(!d){setRes(null);return;}
      setRes(buildResult("Daily Hours",d.dailyHours+"h",
        [{label:"Weekly",value:d.weeklyHours+"h"},{label:"Monthly",value:d.monthlyHours+"h"},...(+rate?[{label:"Daily Pay",value:fm(d.dailyPay)},{label:"Monthly Pay",value:fm(d.monthlyPay),highlight:true}]:[])],
        d.insights,null,d.breakdowns));
    },80);
    return()=>clearTimeout(t);
  },[start,end,brk,days,rate]);
  return (
    <FinanceLayout
      accentClass="accent-utility"
      inputTitle="Your Hours"
      resultContent={<>
        {res&&<><ResultBox label={res.primary.label} value={res.primary.value}/><StatsGrid items={res.stats}/><InsightBox insights={res.insights}/></>}
      </>}
      inputContent={<>
        <Row2>
        <N label="Start Time" id="ws" value={start} onChange={setStart} type="time"/>
        <N label="End Time" id="we" value={end} onChange={setEnd} type="time"/>
      </Row2>
      <Row2>
        <N label="Break (minutes)" id="wb" value={brk} onChange={setBrk} placeholder="60"/>
        <Sl label="Days per Week" id="wd" min={1} max={7} value={days} onChange={setDays} fmt={v=>`${v} days`}/>
      </Row2>
      <N label="Hourly Rate (optional)" id="wr" value={rate} onChange={setRate} unit={sym} placeholder="0" hint="Add rate to calculate earnings"/>
      </>}
    />
  );
}

// ── Fuel Cost ─────────────────────────────────────────────────────────
export function FuelForm(){
  const { fm, sym } = useCurrency();
  const [d,setD]=useState("100"),[p,setP]=useState("280"),[e,setE]=useState(12),[pax,setPax]=useState(1),[trips,setTrips]=useState(1);
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const t=setTimeout(()=>{
      const data=calcFuel({distance:d,fuelPrice:p,efficiency:e,passengers:pax,trips});
      if(!data){setRes(null);return;}
      setRes(buildResult("Trip Fuel Cost",fm(data.total),
        [{label:"Fuel Needed",value:data.litres+"L"},{label:"Cost/km",value:fm(data.perKm)},{label:"Round Trip",value:fm(data.roundTrip)},...(pax>1?[{label:`Per Person (${pax})`,value:fm(data.perPerson),highlight:true}]:[]),...(trips>1?[{label:`Monthly (${trips} trips)`,value:fm(data.monthly)}]:[])],
        data.insights,null,data.breakdowns));
    },80);
    return()=>clearTimeout(t);
  },[d,p,e,pax,trips]);
  return (
    <FinanceLayout
      accentClass="accent-utility"
      inputTitle="Trip Details"
      result={res}
      loading={null}
      label="Trip Cost"
      inputContent={<>
        <N label="Distance" id="fd" value={d} onChange={setD} unit="km"/>
      <N label={`Fuel Price per Litre`} id="fp" value={p} onChange={setP} unit={sym+"/L"}/>
      <Sl label="Fuel Efficiency" id="fe" min={4} max={30} value={e} onChange={setE} fmt={v=>`${v} km/L`}/>
      <Row2>
        <Sl label="Passengers" id="fpax" min={1} max={10} value={pax} onChange={setPax} fmt={v=>`${v} people`}/>
        <Sl label="Monthly Trips" id="ftrips" min={1} max={60} value={trips} onChange={setTrips} fmt={v=>`${v} trips`}/>
      </Row2>
      </>}
    />
  );
}

// ── Password Generator ────────────────────────────────────────────────
export function PasswordForm(){
  const [len,setLen]=useState(16),[upper,setUpper]=useState(true),[nums,setNums]=useState(true),[syms,setSyms]=useState(true);
  const [res,setRes]=useState(null);
  const gen=useCallback(()=>{
    const d=calcPassword({length:len,upper,numbers:nums,symbols:syms});
    const result = buildResult("Generated Password",d.password,
      [{label:"Length",value:d.length+" chars"},{label:"Entropy",value:d.entropy+" bits"},{label:"Strength",value:d.strength,highlight:d.entropy>=60},{label:"Crack Time",value:d.crackTime}],
      d.insights,null,d.breakdowns);
    result.rawEntropy = d.entropy;
    setRes(result);
  },[len,upper,nums,syms]);
  useEffect(()=>gen(),[gen]);

  const getStrengthColor = (entropy) => {
    if (entropy >= 80) return "#16a34a"; // Very Strong (Green)
    if (entropy >= 60) return "#3b82f6"; // Strong (Blue)
    if (entropy >= 40) return "#f59e0b"; // Good (Yellow)
    return "#ef4444"; // Weak (Red)
  };

  const strengthColor = res?.primary ? getStrengthColor(res.rawEntropy || res.stats[1]?.value.split(' ')[0]) : "#ef4444";
  const pct = res ? Math.min((res.rawEntropy || res.stats[1]?.value.split(' ')[0]) / 100 * 100, 100) : 0;

  return (
    <FinanceLayout
      accentClass="accent-utility"
      inputTitle="Password Options"
      inputContent={<>
        <Sl label="Password Length" id="pl" min={6} max={64} value={len} onChange={setLen} fmt={v=>`${v} characters`}/>
        <div style={{display:"flex",gap:20,marginBottom:18,flexWrap:"wrap"}}>
          {[[upper,setUpper,"Uppercase A–Z"],[nums,setNums,"Numbers 0–9"],[syms,setSyms,"Symbols !@#$"]].map(([val,set,label])=>(
            <label key={label} style={{display:"flex",alignItems:"center",gap:7,fontSize:13,fontWeight:600,color:"var(--text2)",cursor:"pointer"}}>
              <input type="checkbox" checked={val} onChange={e=>set(e.target.checked)} style={{accentColor:"var(--brand)",width:15,height:15}}/>{label}
            </label>
          ))}
        </div>
      </>}
      resultContent={<>
        {res&&(
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,padding:"12px 16px",background:"var(--surface2)",border:"1.5px solid var(--border)",borderRadius:"var(--r-xl)",marginBottom:12,flexWrap:"wrap"}}>
              <code style={{fontFamily:"var(--font-mono)",fontSize:14,fontWeight:600,color:"var(--text)",wordBreak:"break-all",flex:1,minWidth:0}}>{res.primary.value}</code>
              <button onClick={()=>navigator.clipboard.writeText(res.primary.value).catch(()=>{})} style={{flexShrink:0,padding:"8px 18px",borderRadius:"var(--r-md)",background:"var(--brand)",color:"#fff",fontSize:13,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"var(--font)",minHeight:40}}>Copy</button>
            </div>
            <div style={{marginBottom: 16}}>
               <div style={{display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6}}>
                 <span>Strength: {res.stats[2]?.value}</span>
                 <span>Entropy: {res.stats[1]?.value}</span>
               </div>
               <div style={{width: "100%", height: 8, background: "var(--border)", borderRadius: 10, overflow: "hidden"}}>
                 <div style={{width: `${pct}%`, height: "100%", background: strengthColor, transition: "all 0.3s ease"}} />
               </div>
            </div>
            <StatsGrid items={res.stats}/>
            <InsightBox insights={res.insights}/>
            <button onClick={gen} style={{width:"100%",padding:"11px",marginTop:12,background:"var(--surface2)",border:"1.5px solid var(--border)",borderRadius:"var(--r-lg)",fontWeight:700,fontSize:14,cursor:"pointer",color:"var(--text2)",fontFamily:"var(--font)"}}>🔄 Generate New Password</button>
          </>
        )}
      </>}
    />
  );
}

// ── Roman Numerals ────────────────────────────────────────────────────
export function RomanForm(){
  const [n,setN]=useState("2025"),[mode,setMode]=useState("toRoman");
  const result=mode==="toRoman"?toRoman(+n):fromRoman(n).toString();
  const valid=mode==="toRoman"?(+n>=1&&+n<=3999):!isNaN(fromRoman(n));
  return (
    <FinanceLayout
      accentClass="accent-utility"
      inputTitle="Your Number"
      inputContent={<>
        <Tabs tabs={["Number → Roman","Roman → Number"]} active={mode==="toRoman"?"Number → Roman":"Roman → Number"} onChange={v=>setMode(v.includes("→ R")?"toRoman":"fromRoman")}/>
      <N label={mode==="toRoman"?"Number (1–3999)":"Roman Numeral"} id="rn" value={n} onChange={setN} type={mode==="toRoman"?"number":"text"} min={1} max={3999}/>
      {n&&(<div style={{background:"linear-gradient(135deg,var(--brand),var(--p800))",borderRadius:"var(--r-xl)",padding:"20px",textAlign:"center",marginTop:4}}>
        <p style={{fontSize:10,fontWeight:800,color:"rgba(255,255,255,.5)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}}>{mode==="toRoman"?n+" =":"=  "}</p>
        <p style={{fontSize:28,fontWeight:800,color:valid?"#fff":"#fca5a5",fontFamily:"var(--font-mono)"}}>{valid?result:"Invalid input"}</p>
      </div>)}
      </>}
    />
  );
}

// ── Word Counter ──────────────────────────────────────────────────────
export function WordCountForm(){
  const [text,setText]=useState("The quick brown fox jumps over the lazy dog.");
  const [res,setRes]=useState(null);
  useEffect(()=>{
    const t=setTimeout(()=>{
      const d=calcWordCount({text});
      if(!d){setRes(null);return;}
      setRes(buildResult("Word Count",d.words.toLocaleString(),
        [{label:"Characters",value:d.chars.toLocaleString()},{label:"No Spaces",value:d.noSpace.toLocaleString()},{label:"Sentences",value:d.sentences},{label:"Read Time",value:d.readTime+" min"},{label:"Speak Time",value:d.speakTime+" min"},{label:"Paragraphs",value:d.paragraphs}],
        d.insights,null,d.breakdowns));
    },100);
    return()=>clearTimeout(t);
  },[text]);
  return (
    <FinanceLayout
      accentClass="accent-utility"
      inputTitle="Your Text"
      resultContent={<>
        {res&&<><ResultBox label={res.primary.label} value={res.primary.value}/><StatsGrid items={res.stats}/></>}
      </>}
      inputContent={<>
        <L t="Enter Text"/>
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Type or paste your text here…"
        style={{width:"100%",minHeight:150,padding:14,background:"var(--surface2)",border:"1.5px solid var(--border)",borderRadius:"var(--r-md)",fontSize:14,fontFamily:"var(--font)",color:"var(--text)",outline:"none",resize:"vertical",marginBottom:14}}
        onFocus={e=>e.target.style.borderColor="var(--brand)"} onBlur={e=>e.target.style.borderColor="var(--border)"}/>
      </>}
    />
  );
}

// ── Base64 ────────────────────────────────────────────────────────────
export function Base64Form(){
  const [text,setText]=useState("Hello, World!"),[mode,setMode]=useState("encode");
  const [res,setRes]=useState(null);
  useEffect(()=>{const t=setTimeout(()=>setRes(calcBase64({text,mode})),60);return()=>clearTimeout(t);},[text,mode]);
  return (
    <FinanceLayout
      accentClass="accent-utility"
      inputTitle="Your Input"
      resultContent={<>
        {res&&!res.error&&(<>
        <L t="Output"/>
        <div style={{padding:"12px 16px",background:"var(--surface2)",border:"1.5px solid var(--border)",borderRadius:"var(--r-md)",fontFamily:"var(--font-mono)",fontSize:14,color:"var(--text)",wordBreak:"break-all",marginBottom:10}}>
          {res.result}
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>navigator.clipboard.writeText(res.result).catch(()=>{})} style={{flex:1,padding:"9px",borderRadius:"var(--r-md)",background:"var(--brand)",color:"#fff",fontWeight:700,fontSize:13,border:"none",cursor:"pointer",fontFamily:"var(--font)"}}>Copy Output</button>
          <button onClick={()=>{setText(res.result);setMode(mode==="encode"?"decode":"encode");}} style={{flex:1,padding:"9px",borderRadius:"var(--r-md)",background:"var(--surface2)",border:"1.5px solid var(--border)",fontWeight:700,fontSize:13,cursor:"pointer",color:"var(--text2)",fontFamily:"var(--font)"}}>Reverse</button>
        </div>
      </>)}
      {res?.error&&<div style={{padding:"12px 14px",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"var(--r-md)",color:"#b91c1c",fontSize:13}}>⚠️ {res.error}</div>}
      </>}
      inputContent={<>
        <Tabs tabs={["Encode","Decode"]} active={mode==="encode"?"Encode":"Decode"} onChange={v=>setMode(v==="Encode"?"encode":"decode")}/>
      <N label="Input" id="b64in" value={text} onChange={setText} type="text"/>
      </>}
    />
  );
}

// ── Area Calculator ───────────────────────────────────────────────────
export function AreaForm(){
  const [shape,setShape]=useState("rectangle");
  const [a,setA]=useState("10"),[b,setB]=useState("5"),[r,setR]=useState("7");
  const [res,setRes]=useState(null);

  useEffect(()=>{
    const t=setTimeout(()=>{
      const av=+a||0, bv=+b||0, rv=+r||0;
      let area=0, perimeter=0, label="", formula="";
      if(shape==="rectangle"){ area=av*bv; perimeter=2*(av+bv); label="Rectangle"; formula=`Area = ${av} × ${bv}`; }
      else if(shape==="circle"){ area=round(Math.PI*rv*rv,4); perimeter=round(2*Math.PI*rv,4); label="Circle"; formula=`Area = π × ${rv}²`; }
      else if(shape==="triangle"){ area=round(0.5*av*bv,4); perimeter=round(av+bv+Math.sqrt(av*av+bv*bv),4); label="Triangle"; formula=`Area = ½ × ${av} × ${bv}`; }
      else if(shape==="square"){ area=av*av; perimeter=4*av; label="Square"; formula=`Area = ${av}²`; }
      else if(shape==="trapezoid"){ area=round(0.5*(av+bv)*rv,4); perimeter=0; label="Trapezoid"; formula=`Area = ½ × (${av}+${bv}) × ${rv}`; }
      if(!area){setRes(null);return;}
      setRes(buildResult(`${label} Area`, area.toString()+" sq units",
        [{label:"Area",value:area+" sq units",highlight:true},...(perimeter>0?[{label:"Perimeter/Circumference",value:perimeter+" units"}]:[]),{label:"Formula",value:formula}],
        [{type:"info",msg:formula+" = "+area+" sq units"},{type:"good",msg:`${label}: Area = ${area}, Perimeter = ${perimeter||"N/A"} units`}],
        null,[{label:"Shape",value:label},{label:"Area",value:area+" sq units",bold:true},...(perimeter?[{label:"Perimeter",value:perimeter+" units"}]:[])]));
    },80);
    return()=>clearTimeout(t);
  },[shape,a,b,r]);

  return (
    <FinanceLayout
      accentClass="accent-utility"
      inputTitle="Your Shape"
      resultContent={<>
        {res&&<><ResultBox label={res.primary.label} value={res.primary.value}/><StatsGrid items={res.stats}/><InsightBox insights={res.insights}/><Breakdown rows={res.breakdowns}/></>}
      </>}
      inputContent={<>
        <Sel label="Shape" id="ashape" value={shape} onChange={setShape} opts={[
        {v:"rectangle",l:"Rectangle"},{v:"square",l:"Square"},{v:"circle",l:"Circle"},
        {v:"triangle",l:"Right Triangle"},{v:"trapezoid",l:"Trapezoid"}
      ]}/>
      {(shape==="rectangle"||shape==="triangle")&&<Row2><N label="Base (a)" id="aa" value={a} onChange={setA} unit="units"/><N label="Height (b)" id="ab" value={b} onChange={setB} unit="units"/></Row2>}
      {shape==="square"&&<N label="Side Length" id="asq" value={a} onChange={setA} unit="units"/>}
      {shape==="circle"&&<N label="Radius" id="ar" value={r} onChange={setR} unit="units"/>}
      {shape==="trapezoid"&&<><Row2><N label="Parallel Side 1 (a)" id="ata" value={a} onChange={setA} unit="units"/><N label="Parallel Side 2 (b)" id="atb" value={b} onChange={setB} unit="units"/></Row2><N label="Height" id="ath" value={r} onChange={setR} unit="units"/></>}
      </>}
    />
  );
}

// ── Random Number ─────────────────────────────────────────────────────
export function RandomForm(){
  const [min,setMin]=useState("1"),[max,setMax]=useState("100"),[count,setCount]=useState(1),[type,setType]=useState("integer");
  const [res,setRes]=useState(null);
  const gen=()=>{
    const d=calcRandom({min,max,count,type});
    setRes(d);
  };
  return (
    <FinanceLayout
      accentClass="accent-utility"
      inputTitle="Your Options"
      resultContent={<>
        {res&&(
        <>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
            {res.numbers.map((n,i)=>(
              <div key={i} style={{padding:"10px 16px",background:"var(--p50)",border:"1.5px solid var(--p100)",borderRadius:"var(--r-md)",fontFamily:"var(--font-mono)",fontSize:18,fontWeight:800,color:"var(--brand)"}}>{n}</div>
            ))}
          </div>
        </>
      )}
      </>}
      inputContent={<>
        <Row2><N label="Min" id="rmin" value={min} onChange={setMin}/><N label="Max" id="rmax" value={max} onChange={setMax}/></Row2>
      <Row2>
        <Sl label="Count" id="rcount" min={1} max={50} value={count} onChange={setCount} fmt={v=>`${v} numbers`}/>
        <Sel label="Type" id="rtype" value={type} onChange={setType} opts={[{v:"integer",l:"Integers"},{v:"decimal.js",l:"Decimals"}]}/>
      </Row2>
      <button onClick={gen} className="calculate-btn" style={{width:"100%",marginBottom:16}}>
        🎲 Generate Random Numbers
      </button>
      </>}
    />
  );
}

// ── Time Zone ─────────────────────────────────────────────────────────
export function TimeZoneForm() {
  return null;
}
