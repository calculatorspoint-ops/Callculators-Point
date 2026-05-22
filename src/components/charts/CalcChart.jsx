import { useState } from "react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, PieChart, Pie, ReferenceLine,
} from "recharts";
import { Download, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { useGeoStore } from "@/core/geo-engine/geoStore.js";

/* ── Color palette — calm professional ───────────────────────────────── */
const C = {
  principal:"#4361ee", interest:"#dc3545", balance:"#7c3aed",
  nominal:"#4361ee",   invested:"#9aa0ba", real:"#059669",
  corpus:"#4361ee",    gains:"#059669",    afterTax:"#d97706",
  revenue:"#059669",   cost:"#dc3545",     profit:"#4361ee",
  total:"#4361ee",     value:"#4361ee",    y:"#4361ee",
};
const PAL = ["#4361ee","#dc3545","#059669","#d97706","#7c3aed","#0891b2","#ea580c","#65a30d"];

/* ── Smart currency formatter — respects selected region ────────────── */
function useCurrencyFormatter() {
  const sym    = useGeoStore(s => s.rules?.currencySymbol ?? "$");
  const locale = useGeoStore(s => s.rules?.locale         ?? "en-US");

  const fmtCompact = (v) => {
    if (typeof v !== "number") return v;
    const a = Math.abs(v);
    // Use locale-aware compact notation
    if (a >= 1_000_000_000) return sym + (v / 1_000_000_000).toFixed(1) + "B";
    if (a >= 1_000_000)     return sym + (v / 1_000_000).toFixed(1) + "M";
    if (a >= 1_000)         return sym + new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.round(v));
    return v % 1 !== 0 ? v.toFixed(2) : String(v);
  };

  const fmtAxis = (v) => {
    const a = Math.abs(v);
    if (a >= 1_000_000_000) return sym + (a / 1_000_000_000).toFixed(1) + "B";
    if (a >= 1_000_000)     return sym + (a / 1_000_000).toFixed(1) + "M";
    if (a >= 1_000)         return sym + (a / 1_000).toFixed(0) + "K";
    return v % 1 !== 0 ? v.toFixed(2) : String(v);
  };

  return { sym, locale, fmtCompact, fmtAxis };
}

/* ── Tooltip ────────────────────────────────────────────────────────── */
function CustomTip({ active, payload, label, fmtV }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"rgba(255, 255, 255, 0.9)", backdropFilter:"blur(12px)", border:"1px solid rgba(0,0,0,0.05)", borderRadius:12, padding:"12px 16px", boxShadow:"0 10px 40px -10px rgba(0,0,0,0.2)", fontSize:12, minWidth:160 }}>
      <p style={{ fontWeight:800, color:"#64748b", marginBottom:8, fontSize:11, textTransform:"uppercase", letterSpacing:".06em" }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:i < payload.length-1 ? 6 : 0 }}>
          <span style={{ width:10, height:10, borderRadius:"50%", background:p.color||p.fill, flexShrink:0, boxShadow:`0 0 8px ${p.color||p.fill}80` }}/>
          <span style={{ color:"#334155", flex:1, fontWeight: 500 }}>{p.name}</span>
          <strong style={{ color:p.color||p.fill, fontSize:13 }}>{fmtV(p.value)}</strong>
        </div>
      ))}
    </div>
  );
}

/* ── Export chart as PNG ─────────────────────────────────────────────── */
function exportChart(title) {
  const svgEl = document.querySelector(".recharts-wrapper svg");
  if (!svgEl) return;
  const svgData = new XMLSerializer().serializeToString(svgEl);
  const canvas = document.createElement("canvas");
  const ctx    = canvas.getContext("2d");
  const img    = new Image();
  canvas.width  = svgEl.width?.baseVal?.value || 800;
  canvas.height = svgEl.height?.baseVal?.value || 300;
  img.onload = () => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    const a = document.createElement("a");
    a.download = `${title || "chart"}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };
  img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
}

/* ── Shared axis styles ─────────────────────────────────────────────── */
const tickStyle = { fontSize: 10, fill: "var(--text3)" };
const gridStyle = { stroke: "var(--border)", strokeDasharray: "3 3" };

/* ── Chart wrapper with title, zoom, export ─────────────────────────── */
function ChartBox({ title, children, data }) {
  const [zoom, setZoom] = useState(1);
  const MAX_ZOOM = 3, MIN_ZOOM = 1;
  const [sliceStart, setSliceStart] = useState(0);

  const zoomedData = zoom > 1 && data
    ? data.slice(sliceStart, sliceStart + Math.ceil(data.length / zoom))
    : data;

  const handleZoomIn  = () => setZoom(z => Math.min(z + 0.5, MAX_ZOOM));
  const handleZoomOut = () => { setZoom(z => Math.max(z - 0.5, MIN_ZOOM)); setSliceStart(0); };
  const handleReset   = () => { setZoom(1); setSliceStart(0); };

  return (
    <div className="chart-wrap">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <p className="chart-title">📊 {title || "Chart"}</p>
        <div style={{ display:"flex", gap:5 }}>
          {data?.length > 6 && <>
            <button onClick={handleZoomIn}  title="Zoom in"  style={ctrlBtn} disabled={zoom >= MAX_ZOOM}><ZoomIn  size={11}/></button>
            <button onClick={handleZoomOut} title="Zoom out" style={ctrlBtn} disabled={zoom <= MIN_ZOOM}><ZoomOut size={11}/></button>
            {zoom > 1 && <button onClick={handleReset} title="Reset" style={ctrlBtn}><RotateCcw size={11}/></button>}
          </>}
          <button onClick={() => exportChart(title)} title="Download PNG" style={ctrlBtn}><Download size={11}/></button>
        </div>
      </div>
      {/* Pass zoomed data to children via render prop */}
      {typeof children === "function" ? children(zoomedData || data) : children}
    </div>
  );
}

const ctrlBtn = {
  width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center",
  borderRadius:6, background:"var(--surf2)", border:"1px solid var(--border)",
  cursor:"pointer", color:"var(--text3)", transition:"all .15s",
};

/* ══ Main export ════════════════════════════════════════════════════ */
export function CalcChart({ chartData }) {
  const { fmtCompact, fmtAxis } = useCurrencyFormatter();

  if (!chartData) return null;
  const { type, data, keys, xKey, pct, color } = chartData;

  /* ── BMI Gauge ─────────────────────────────────────────────────── */
  if (type === "gauge") {
    const g = Math.min(Math.max(pct || 50, 2), 98);
    return (
      <div className="chart-wrap">
        <p className="chart-title">BMI Scale</p>
        <div style={{ position:"relative", height:22, borderRadius:11, overflow:"hidden",
          background:"linear-gradient(to right,#1e40af 0%,#3b82f6 16%,#22c55e 33%,#f59e0b 55%,#f97316 75%,#dc2626 100%)" }}>
          <div style={{ position:"absolute", top:2, bottom:2, width:8, borderRadius:4,
            background:"#fff", boxShadow:"0 0 0 2px rgba(0,0,0,.3)", left:`calc(${g}% - 4px)`,
            transition:"left .7s cubic-bezier(.4,0,.2,1)" }}/>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
          {["Underweight","Normal","Overweight","Obese"].map(l => (
            <span key={l} style={{ fontSize:9, color:"var(--text3)", fontWeight:600, textAlign:"center" }}>{l}</span>
          ))}
        </div>
        <div style={{ textAlign:"center", marginTop:8 }}>
          <span style={{ fontSize:12, fontWeight:700, color:color||"var(--brand)",
            background:color ? color+"18":"var(--brand-l)", padding:"3px 12px", borderRadius:100 }}>
            BMI marker at {g.toFixed(0)}%
          </span>
        </div>
      </div>
    );
  }

  if (type === "donut" || type === "pie") {
    if (!data?.length) return null;
    return (
      <ChartBox title="Distribution Breakdown">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <defs>
              {data.map((e, i) => (
                <linearGradient key={`grad_${i}`} id={`grad_${i}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%"   stopColor={e.color||PAL[i%PAL.length]} stopOpacity={1}/>
                  <stop offset="100%" stopColor={e.color||PAL[i%PAL.length]} stopOpacity={0.7}/>
                </linearGradient>
              ))}
            </defs>
            <Pie data={data} cx="50%" cy="50%"
              innerRadius={type==="donut"?65:0} outerRadius={90}
              paddingAngle={4} dataKey="value" nameKey="name"
              animationBegin={100} animationDuration={1200}
              label={({name,percent}) => percent > 0.05 ? `${name} ${(percent*100).toFixed(0)}%` : ""}
              labelLine={{ stroke:"var(--text3)", strokeWidth:1, strokeDasharray:"2 2" }}>
              {data.map((e, i) => <Cell key={i} fill={`url(#grad_${i})`} stroke="var(--surface)" strokeWidth={2}/>)}
            </Pie>
            <Tooltip content={<CustomTip fmtV={fmtCompact}/>}/>
            <Legend wrapperStyle={{ fontSize:12, paddingTop:12, fontWeight:600 }}/>
          </PieChart>
        </ResponsiveContainer>
      </ChartBox>
    );
  }

  if (!data?.length) return null;

  /* ── Bar Chart ─────────────────────────────────────────────────── */
  if (type === "bar") {
    const dk = chartData.dataKey || keys?.[0] || "value";
    const xk = xKey || "label";
    return (
      <ChartBox title="Comparison" data={data}>
        {(d) => (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={d} margin={{ top:4, right:4, bottom:20, left:0 }}>
              <CartesianGrid {...gridStyle} vertical={false}/>
              <XAxis dataKey={xk} tick={{ fontSize:9, fill:"var(--text3)" }} tickLine={false} axisLine={false} angle={-20} textAnchor="end" height={40}/>
              <YAxis tick={tickStyle} tickLine={false} axisLine={false} width={52} tickFormatter={fmtAxis}/>
              <Tooltip content={<CustomTip fmtV={fmtCompact}/>} cursor={{ fill:"var(--brand-l)" }}/>
              <Bar dataKey={dk} name={dk} radius={[5,5,0,0]} maxBarSize={60}>
                {d.map((e,i) => <Cell key={i} fill={e.color||PAL[i%PAL.length]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartBox>
    );
  }

  /* ── Line Chart ────────────────────────────────────────────────── */
  if (type === "line") {
    const lKeys = keys || Object.keys(data[0]).filter(k => k !== (xKey||"x") && typeof data[0][k] === "number");
    const xk = xKey || Object.keys(data[0])[0];
    return (
      <ChartBox title="Line Chart" data={data}>
        {(d) => (
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={d} margin={{ top:4, right:8, bottom:4, left:0 }}>
              <CartesianGrid {...gridStyle} vertical={false}/>
              <XAxis dataKey={xk} tick={tickStyle} tickLine={false} axisLine={false}/>
              <YAxis tick={tickStyle} tickLine={false} axisLine={false} width={52} tickFormatter={fmtAxis}/>
              <Tooltip content={<CustomTip fmtV={fmtCompact}/>}/>
              <Legend wrapperStyle={{ fontSize:11, paddingTop:8 }}/>
              {/* Break-even reference line */}
              {data.some(d => d.profit < 0) && data.some(d => d.profit >= 0) && (
                <ReferenceLine y={0} stroke="#dc2626" strokeDasharray="4 4" label={{ value:"Break-even", fontSize:10, fill:"#dc2626" }}/>
              )}
              {lKeys.map((k,i) => (
                <Line key={k} type="monotone" dataKey={k}
                  name={k.charAt(0).toUpperCase()+k.slice(1)}
                  stroke={C[k]||PAL[i%PAL.length]} strokeWidth={2.5}
                  dot={false} activeDot={{ r:5, strokeWidth:0 }}/>
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartBox>
    );
  }

  /* ── Area Chart (default) ──────────────────────────────────────── */
  const aKeys = keys || Object.keys(data[0]).filter(k => !["month","year","x","label"].includes(k) && typeof data[0][k]==="number");
  const xDataKey = "month" in data[0] ? "month" : "year" in data[0] ? "year" : (xKey||Object.keys(data[0])[0]);

  return (
    <ChartBox title="Growth & Projection Chart" data={data}>
      {(d) => (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={d} margin={{ top:10, right:8, bottom:4, left:0 }}>
            <defs>
              {aKeys.map((k,i) => (
                <linearGradient key={k} id={`ag_${k}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor={C[k]||PAL[i%PAL.length]} stopOpacity={0.35}/>
                  <stop offset="100%" stopColor={C[k]||PAL[i%PAL.length]} stopOpacity={0.01}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid {...gridStyle} vertical={false}/>
            <XAxis dataKey={xDataKey} tick={tickStyle} tickLine={false} axisLine={false}/>
            <YAxis tick={tickStyle} tickLine={false} axisLine={false} width={58} tickFormatter={fmtAxis}/>
            <Tooltip content={<CustomTip fmtV={fmtCompact}/>}/>
            <Legend wrapperStyle={{ fontSize:12, paddingTop:12, fontWeight:600 }} iconType="circle"/>
            {aKeys.map((k,i) => (
              <Area key={k} type="monotone" dataKey={k}
                name={k.charAt(0).toUpperCase()+k.slice(1)}
                stroke={C[k]||PAL[i%PAL.length]}
                fill={`url(#ag_${k})`}
                strokeWidth={3} dot={false} activeDot={{ r:6, strokeWidth:0, fill:"#fff", stroke:C[k]||PAL[i%PAL.length] }}/>
            ))}
          </AreaChart>
        </ResponsiveContainer>
      )}
    </ChartBox>
  );
}
