/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from "react";
import { parseLocalizedNumber, formatInputNumber } from "@/utils/validation.js";
import { useCurrencyStore, formatMoney as _fmtMoney } from "@/store/useCurrencyStore.js";
import { useGeoStore } from "@/core/geo-engine/geoStore.js";
import { useAppStore } from "@/store/useAppStore.js";
import { fmt, CURRENCIES } from "@/core/calculationEngine.js";
import { copyShareLink } from "@/utils/urlParams.js";
import { ResultBox } from "@/components/ui/ResultBox.jsx";
import { StatsGrid } from "@/components/ui/StatsGrid.jsx";
import { InsightBox } from "@/components/ui/InsightBox.jsx";
import { Breakdown } from "@/components/ui/Breakdown.jsx";
import { CalcChart } from "@/components/charts/LazyCalcChart.jsx";
import { CalcToolbar, ResultArea, exportToCSV } from "@/components/calculator-core/CalcShell.jsx";

// Currency-aware money formatter
export const formatMoney = (n) => { try { return _fmtMoney(n, useCurrencyStore.getState().currency); } catch { return String(n); } };

export const L = ({t, id}) => <label htmlFor={id} style={{display:"block",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",color:"var(--text3)",marginBottom:6}}>{t}</label>;

export function N({label,id,value,onChange,unit,placeholder="0",min,max,step,hint,type="text"}){
  const [displayValue, setDisplayValue] = useState("");
  useEffect(() => {
    if (document.activeElement?.id !== id) {
      if (value === "" || value === null || value === undefined) {
        setDisplayValue("");
      } else if (type === "number") {
        setDisplayValue(String(value));
      } else {
        const parsed = parseLocalizedNumber(String(value));
        setDisplayValue(parsed === 0 && String(value).trim() !== "0" ? String(value) : formatInputNumber(parsed));
      }
    }
  }, [value, id, type]);

  const handleChange = (e) => {
    const val = e.target.value;
    setDisplayValue(val);
    if (type === "number") {
      onChange(val);
    } else {
      const parsed = parseLocalizedNumber(val);
      onChange(val === "" ? "" : parsed);
    }
  };

  const handleBlur = (e) => {
    if (type !== "number" && displayValue !== "") {
      const parsed = parseLocalizedNumber(displayValue);
      setDisplayValue(formatInputNumber(parsed));
      onChange(parsed);
    }
    e.target.style.borderColor="var(--border)";
    e.target.style.boxShadow="none";
  };

  return (
    <div style={{marginBottom:16}}>
      {label&&<L t={label} id={id}/>}
      <div style={{position:"relative"}}>
        <input id={id} type={type} value={displayValue} onChange={handleChange} placeholder={placeholder} min={min} max={max} step={step}
          aria-label={label || placeholder}
          style={{width:"100%",height:42,padding:unit?"0 44px 0 14px":"0 14px",background:"var(--surface2)",border:"1.5px solid var(--border)",borderRadius:"var(--r-md)",fontSize:14,fontWeight:500,color:"var(--text)",outline:"none",fontFamily:"var(--font)",transition:"border-color .15s,box-shadow .15s"}}
          onFocus={e=>{e.target.style.borderColor="var(--brand)";e.target.style.boxShadow="0 0 0 3px var(--p50)";}}
          onBlur={handleBlur}/>
        {unit&&<span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",fontSize:11,fontWeight:700,color:"var(--text3)",pointerEvents:"none"}}>{unit}</span>}
      </div>
      {hint&&<p style={{fontSize:11,color:"var(--text3)",marginTop:4,lineHeight:1.4}}>{hint}</p>}
    </div>
  );
}

export function Sl({label,id,min,max,step=1,value,onChange,fmt:fmtFn}){
  const display=fmtFn?fmtFn(value):value;
  return (
    <div style={{marginBottom:20}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        {label&&<L t={label} id={id}/>}
        <span style={{fontSize:14,fontWeight:800,color:"var(--brand)",background:"var(--p50)",padding:"1px 10px",borderRadius:"var(--r-sm)"}}>{display}</span>
      </div>
      <input type="range" id={id} min={min} max={max} step={step} value={value} onChange={e=>onChange(+e.target.value)} aria-label={label}/>
    </div>
  );
}

export function Sel({label,id,value,onChange,opts}){
  return (
    <div style={{marginBottom:16}}>
      {label&&<L t={label} id={id}/>}
      <select id={id} value={value} onChange={e=>onChange(e.target.value)} aria-label={label} className="f-select">{opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select>
    </div>
  );
}

export function Tabs({tabs,active,onChange}){
  return (
    <div style={{display:"flex",background:"var(--surface2)",border:"1.5px solid var(--border)",borderRadius:"var(--r-md)",overflow:"hidden",marginBottom:16}}>
      {tabs.map(t=>(
        <button key={t} onClick={()=>onChange(t)} aria-label={`Switch to ${t}`} aria-pressed={active===t} style={{flex:1,padding:"8px 4px",fontSize:13,fontWeight:600,border:"none",cursor:"pointer",fontFamily:"var(--font)",transition:"all .15s",background:active===t?"var(--brand)":"transparent",color:active===t?"#fff":"var(--text3)"}}>
          {t}
        </button>
      ))}
    </div>
  );
}

export function Row2({children}){return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>{children}</div>;}
export function Row3({children}){return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>{children}</div>;}

export function Presets({items,onApply}){
  if(!items?.length) return null;
  return (
    <div style={{display:"flex",flexWrap:"wrap",gap:7,padding:"10px 14px",background:"var(--surface2)",border:"1px solid var(--border2)",borderRadius:"var(--r-md)",marginBottom:18}}>
      <span style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:".06em",color:"var(--text3)",alignSelf:"center"}}>Try:</span>
      {items.map((p,i)=>(
        <button key={i} onClick={()=>onApply(p)} aria-label={`Apply preset ${p.label}`}
          style={{padding:"5px 12px",borderRadius:100,fontSize:12,fontWeight:600,border:"1.5px solid var(--border)",background:"var(--surface)",color:"var(--text2)",cursor:"pointer",transition:"all .15s"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--brand)";e.currentTarget.style.color="var(--brand)";e.currentTarget.style.background="var(--p50)";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--text2)";e.currentTarget.style.background="var(--surface)";}}>
          {p.label}
        </button>
      ))}
    </div>
  );
}

export function Panel({ result, loading, label, shareParams }) {
  const { activeCalc, saveLocally, savedLocally, removeSaved } = useAppStore();
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!result && !loading) return (
    <div className="empty-state">
      <div className="empty-state-icon">🧮</div>
      <p className="empty-state-title">Enter values to calculate</p>
      <p className="empty-state-sub">Your result will appear here instantly</p>
    </div>
  );

  if (loading) return <ResultBox loading />;

  const handleSaveHistory = () => {
    if (result && activeCalc) {
      saveLocally({
        id: Date.now(),
        calcId: activeCalc.id,
        calcName: activeCalc.name,
        result: result.primary.value,
        timestamp: new Date().toISOString(),
        inputs: result.breakdowns?.map(b => `${b.label}: ${b.value}`).join(", ")
      });
    }
  };

  const currentHistory = savedLocally.filter(s => s.calcId === activeCalc?.id).slice(0, 5);

  return (
    <div id="calc-result-area">
      {/* ── Main result card ── */}
      <ResultBox label={result.primary.label} value={result.primary.value} sub={result.primary.sub} />

      {/* ── Stats grid ── */}
      {result.stats?.length > 0 && <StatsGrid items={result.stats} />}

      {/* ── Chart ── */}
      {result.chart && (
        <div style={{ marginTop: 14 }}>
          <CalcChart chartData={result.chart} />
        </div>
      )}

      {/* ── Insights ── */}
      {result.insights?.length > 0 && <InsightBox insights={result.insights} />}

      {/* ── Breakdown table ── */}
      {result.breakdowns?.length > 0 && (
        <Breakdown rows={result.breakdowns} title="Step-by-Step Breakdown" />
      )}

      {/* ── Toolbar: save, export, share ── */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
        <button onClick={handleSaveHistory}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: "var(--surf2)", border: "1px solid var(--border)", color: "var(--text2)", cursor: "pointer", fontFamily: "var(--font)" }}>
          💾 Save Result
        </button>
        {result.breakdowns?.length > 0 && (
          <button onClick={() => exportToCSV(result.breakdowns, label?.toLowerCase().replace(/\s+/g, "-"))}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: "var(--surf2)", border: "1px solid var(--border)", color: "var(--text2)", cursor: "pointer", fontFamily: "var(--font)" }}>
            📥 Export CSV
          </button>
        )}
        {shareParams && (
          <button onClick={async () => { await copyShareLink(shareParams); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: copied ? "var(--brand)" : "var(--surf2)", border: `1px solid ${copied ? "var(--brand)" : "var(--border)"}`, color: copied ? "#fff" : "var(--text2)", cursor: "pointer", fontFamily: "var(--font)", transition: "all .2s" }}>
            {copied ? "✅ Link Copied!" : "🔗 Share Link"}
          </button>
        )}
      </div>

      {/* ── History ── */}
      {currentHistory.length > 0 && (
        <div style={{ marginTop: 14, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <h4 style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--text3)" }}>
              Recent History
            </h4>
            <button onClick={() => setShowHistory(!showHistory)}
              style={{ fontSize: 11, fontWeight: 700, color: "var(--brand)", background: "none", border: "none", cursor: "pointer" }}>
              {showHistory ? "Hide" : "Show"}
            </button>
          </div>
          {showHistory && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {currentHistory.map(h => (
                <div key={h.id}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "var(--surf2)", borderRadius: "var(--r-md)", fontSize: 12, border: "1px solid var(--border)" }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "var(--text)" }}>{h.result}</div>
                    <div style={{ fontSize: 10, color: "var(--text3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.inputs}</div>
                  </div>
                  <button onClick={() => removeSaved(h.id)}
                    style={{ color: "var(--text3)", background: "none", border: "none", padding: 4, cursor: "pointer" }} aria-label="Delete result">×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


export const buildResult = (label, val, stats, insights, chart, breakdowns) => ({
  primary: { label, value: val },
  stats: stats || [],
  insights: insights || [],
  chart: chart || null,
  breakdowns: breakdowns || []
});

export const useCurrency = () => {
  // Read everything from the geo-engine (single source of truth)
  const countryCode    = useGeoStore(s => s.countryCode);
  const rules          = useGeoStore(s => s.rules);

  const currency       = rules?.currency       ?? 'USD';
  const sym            = rules?.currencySymbol  ?? '$';
  const locale         = rules?.locale          ?? 'en-US';
  const vatLabel       = rules?.taxLabel        ?? 'Tax';
  const taxRate        = rules?.taxRate         ?? 0;
  const measureSystem  = rules?.measureSystem   ?? 'metric';
  const dateFormat     = rules?.dateFormat      ?? 'MM/DD/YYYY';

  const fm = (value) => {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      return `${sym}${Number(value).toFixed(2)}`;
    }
  };

  const fmSlider = (v) => {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }).format(v);
    } catch {
      return `${sym}${fmt(v)}`;
    }
  };

  return {
    sym,
    currency,
    locale,
    vatLabel,
    taxRate,
    measureSystem,
    dateFormat,
    countryCode,
    rules,
    fm,
    fmSlider,
    // Legacy aliases
    cur: currency,
  };
};
