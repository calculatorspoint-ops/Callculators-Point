// @ts-nocheck
/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useRef } from "react";
import { parseLocalizedNumber, formatInputNumber } from "@/utils/validation";
import { useCurrencyStore, formatMoney as _fmtMoney } from "@/store/useCurrencyStore";
import { useGeoStore } from "@/core/geo-engine/geoStore";
import { useAppStore } from "@/store/useAppStore";
import { fmt, CURRENCIES } from "@/core/calculationEngine";
import { copyShareLink } from "@/utils/urlParams";
import { ResultBox } from '@/components/ui/ResultBox';
import { StatsGrid } from '@/components/ui/StatsGrid';
import { InsightBox } from '@/components/ui/InsightBox';
import { Breakdown } from '@/components/ui/Breakdown';
import { CalcChart } from '@/components/charts/LazyCalcChart';
import { CalcToolbar, ResultArea, exportToCSV } from '@/components/calculator-core/CalcShell';

// Currency-aware money formatter
export const formatMoney = (n) => { try { return _fmtMoney(n, useCurrencyStore.getState().currency); } catch { return String(n); } };

// ── Label ──────────────────────────────────────────────────────────────
export const L = ({ t, id }) => (
  <label htmlFor={id} style={{
    display: "block", fontSize: 13, fontWeight: 700,
    color: "var(--text2)", marginBottom: 8, letterSpacing: ".01em", lineHeight: 1.4
  }}>
    {t}
  </label>
);

// ── Number Input ───────────────────────────────────────────────────────
export function N({ label, id, value, onChange, unit, placeholder = "0", min, max, step, hint, type = "text", icon, prefix }) {
  const [displayValue, setDisplayValue] = useState("");
  const [focused, setFocused] = useState(false);
  const isRestored = useRef(false);

  useEffect(() => {
    if (!id || isRestored.current) return;
    const saved = localStorage.getItem(`calc_input_${id}`);
    if (saved !== null) {
      isRestored.current = true;
      const parsed = (type === "number" || type === "time" || type === "date") ? saved : parseLocalizedNumber(saved);
      if (String(parsed) !== String(value) && String(parsed) !== "NaN") {
        onChange(parsed);
      }
    }
  }, [id, type, value, onChange]);

  useEffect(() => {
    if (document.activeElement?.id !== id) {
      if (value === "" || value === null || value === undefined) {
        setDisplayValue("");
      } else if (type === "number" || type === "time" || type === "date") {
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
    if (id) localStorage.setItem(`calc_input_${id}`, val);
    if (type === "number" || type === "time" || type === "date") {
      onChange(val);
    } else {
      const parsed = parseLocalizedNumber(val);
      onChange(val === "" ? "" : parsed);
    }
  };

  const handleBlur = (e) => {
    setFocused(false);
    if (type !== "number" && type !== "time" && type !== "date" && displayValue !== "") {
      const parsed = parseLocalizedNumber(displayValue);
      if (!isNaN(parsed)) {
        setDisplayValue(formatInputNumber(parsed));
        if (id) localStorage.setItem(`calc_input_${id}`, parsed);
        onChange(parsed);
      }
    }
  };

  const hasLeft = icon || prefix;

  return (
    <div style={{ marginBottom: 20 }}>
      {label && <L t={label} id={id} />}
      <div style={{ position: "relative" }}>
        {hasLeft && (
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0,
            width: 46, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: prefix ? 13 : 16, color: focused ? "var(--brand)" : "var(--text3)",
            fontWeight: 700, pointerEvents: "none", transition: "color .15s",
            borderRight: "1px solid var(--border)", zIndex: 1
          }}>
            {icon || prefix}
          </div>
        )}
        <input
          id={id} type={type} value={displayValue} onChange={handleChange}
          placeholder={placeholder} min={min} max={max} step={step}
          inputMode={type === "number" ? "decimal" : undefined}
          aria-label={label || placeholder}
          className="N-input"
          style={{
            width: "100%",
            height: 52,
            paddingLeft: hasLeft ? 54 : 16,
            paddingRight: unit ? 52 : 16,
            background: focused ? "var(--surface)" : "var(--surface2)",
            border: focused ? "2px solid var(--brand)" : "1.5px solid var(--border)",
            borderRadius: "var(--r-md)",
            fontSize: 15,
            fontWeight: 600,
            color: "var(--text)", outline: "none", fontFamily: "var(--font)",
            transition: "border-color .18s, box-shadow .18s, background .18s",
            boxShadow: focused ? "0 0 0 4px rgba(67,97,238,.1)" : "none",
            WebkitAppearance: "none",
            boxSizing: "border-box",
          }}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
        />
        {unit && (
          <span style={{
            position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
            fontSize: 12, fontWeight: 700, color: focused ? "var(--brand)" : "var(--text3)",
            pointerEvents: "none", transition: "color .15s"
          }}>{unit}</span>
        )}
      </div>
      {hint && <p style={{ fontSize: 11.5, color: "var(--text3)", marginTop: 6, lineHeight: 1.5 }}>{hint}</p>}
    </div>
  );
}

// ── Slider ─────────────────────────────────────────────────────────────
export function Sl({ label, id, min, max, step = 1, value, onChange, fmt: fmtFn }) {
  const isRestored = useRef(false);
  useEffect(() => {
    if (!id || isRestored.current) return;
    const saved = localStorage.getItem(`calc_input_${id}`);
    if (saved !== null && !isNaN(Number(saved))) {
      isRestored.current = true;
      if (Number(saved) !== value) {
        onChange(Number(saved));
      }
    }
  }, [id, value, onChange]);

  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100)) || 0;
  const unitStr = fmtFn ? fmtFn(1).toString().replace(/[0-9.]/g, '').trim() : "";

  return (
    <div style={{ marginBottom: 28 }} className="mobile-premium-slider">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        {label && (
          <label htmlFor={id} style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", letterSpacing: ".01em" }}>
            {label}
          </label>
        )}
        <div className="glass-panel" style={{
          display: "flex", alignItems: "center", flexShrink: 0,
          borderRadius: "var(--r-md)", border: "1.5px solid var(--border)", overflow: "hidden",
          padding: "2px 10px 2px 2px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          background: "var(--surface2)",
        }}>
          <input
            type="number"
            value={value}
            onChange={e => {
              const v = e.target.value === '' ? '' : Number(e.target.value);
              if (id) localStorage.setItem(`calc_input_${id}`, v);
              onChange(v);
            }}
            onBlur={() => {
              if (value === '' || isNaN(value)) onChange(min);
              else if (value < min) onChange(min);
              else if (value > max) onChange(max);
            }}
            aria-label={label + " input"}
            style={{
              width: 120, background: "transparent", border: "none", outline: "none",
              textAlign: "right", fontSize: 15, fontWeight: 800, color: "var(--brand)",
              padding: "6px 4px 6px 10px", minWidth: 80,
              appearance: "none", MozAppearance: "textfield"
            }}
          />
          {unitStr && <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", marginLeft: 2, pointerEvents: "none", whiteSpace: "nowrap" }}>{unitStr}</span>}
        </div>
      </div>
      
      {/* PREMIUM SLEEK SLIDER */}
      <input
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={value === '' ? min : value}
        onChange={e => {
          const v = +e.target.value;
          if (id) localStorage.setItem(`calc_input_${id}`, v);
          onChange(v);
        }}
        className="premium-slider"
        style={{ '--slider-val': `${pct}%` }}
        aria-label={label}
      />
      
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, padding: "0 4px" }}>
        <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700 }}>{fmtFn ? fmtFn(min) : min}</span>
        <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700 }}>{fmtFn ? fmtFn(max) : max}</span>
      </div>
    </div>
  );
}

// ── Select ─────────────────────────────────────────────────────────────
export function Sel({ label, id, value, onChange, opts }) {
  const isRestored = useRef(false);
  useEffect(() => {
    if (!id || isRestored.current) return;
    const saved = localStorage.getItem(`calc_input_${id}`);
    if (saved !== null && saved !== value) {
      isRestored.current = true;
      if (opts.some(o => String(o.v) === saved)) {
        onChange(saved);
      }
    }
  }, [id, value, onChange, opts]);

  return (
    <div style={{ marginBottom: 20 }}>
      {label && <L t={label} id={id} />}
      <select
        id={id} value={value} onChange={e => {
          const val = e.target.value;
          if (id) localStorage.setItem(`calc_input_${id}`, val);
          onChange(val);
        }}
        aria-label={label} className="f-select"
        style={{ height: 52, fontSize: 15, fontWeight: 600, borderRadius: "var(--r-md)", padding: "0 14px", border: "1.5px solid var(--border)" }}
      >
        {opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}

// ── Tabs ───────────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className={`f-tabs ${tabs.length > 3 ? 'multi-tabs' : ''}`} style={{
      display: "flex", flexWrap: tabs.length > 3 ? "wrap" : "nowrap", background: "var(--surface2)",
      border: "1.5px solid var(--border)", borderRadius: "var(--r-lg)",
      overflow: "hidden", marginBottom: 20, padding: 4, gap: 4
    }}>
      {tabs.map(t => (
        <button
          key={t} onClick={() => onChange(t)}
          aria-label={"Switch to " + t} aria-pressed={active === t}
          className={`f-tab ${active === t ? 'active' : ''}`}
          style={{ flex: tabs.length > 3 ? "1 1 45%" : 1, height: 38, fontSize: 13, fontWeight: 700 }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

// ── Row helpers ────────────────────────────────────────────────────────
export function Row2({ children }) {
  return (
    <div className="sc-row2" style={{ gap: 14, marginBottom: 0 }}>
      {children}
    </div>
  );
}
export function Row3({ children }) {
  return (
    <div className="sc-row3" style={{ gap: 10, marginBottom: 0 }}>
      {children}
    </div>
  );
}

// ── Presets ────────────────────────────────────────────────────────────
export function Presets({ items, onApply }) {
  if (!items?.length) return null;
  return (
    <div className="presets-section">
      <p className="presets-label">Quick Examples</p>
      <div className="presets-row">
        {items.map((p, i) => (
          <button key={i} onClick={() => onApply(p)}
            aria-label={"Apply example: " + p.label}
            className="preset-chip">
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── CalcInputCard ──────────────────────────────────────────────────────
// Premium self-contained input card wrapper.
// Wraps inputs in their own bordered card so labels are NEVER clipped
// by the outer calc-card border-radius + overflow:hidden.
export function CalcInputCard({ title, icon, children, accentColor = "var(--brand)" }) {
  return (
    <div style={{
      background: "var(--surface)",
      border: "1.5px solid var(--border)",
      borderRadius: 16,
      marginBottom: 20,
      overflow: "hidden",
    }}>
      {(title || icon) && (
        <div style={{
          padding: "12px 20px",
          borderBottom: "1px solid var(--border)",
          background: "var(--surf2)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
          {title && <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--text3)", margin: 0 }}>{title}</p>}
        </div>
      )}
      <div style={{ padding: "20px 24px 16px" }}>
        {children}
      </div>
    </div>
  );
}

// ── Input Section ──────────────────────────────────────────────────────
export function InputSection({ title, icon, gradient, accentClass, children }) {
  const gradToAccent: Record<string, string> = {
    "#4361ee": "accent-finance", "#3451c7": "accent-finance",
    "#059669": "accent-invest",  "#047857": "accent-invest",
    "#7c3aed": "accent-violet",  "#5b21b6": "accent-violet",
    "#d97706": "accent-tax",     "#b45309": "accent-tax",
    "#dc2626": "accent-loan",    "#b91c1c": "accent-loan",
    "#0891b2": "accent-math",    "#0e7490": "accent-math",
    "#db2777": "accent-health",  "#be185d": "accent-health",
    "#374151": "accent-tech",    "#1f2937": "accent-tech",
  };
  let detectedAccent = "accent-finance";
  if (gradient) {
    for (const [hex, cls] of Object.entries(gradToAccent)) {
      if (gradient.includes(hex)) { detectedAccent = cls; break; }
    }
  }
  const accent = accentClass || detectedAccent;
  return (
    <div className="input-section-wrap">
      <div className={`input-section-head ${accent}`}>
        {icon && <span className="input-section-icon" aria-hidden="true">{icon}</span>}
        <span className="input-section-title">{title}</span>
      </div>
      <div className="input-section-body">
        {children}
      </div>
    </div>
  );
}

// ── Toggle Switch ──────────────────────────────────────────────────────
export function Toggle({ label, id, checked, onChange, hint }) {
  const isRestored = useRef(false);
  useEffect(() => {
    if (!id || isRestored.current) return;
    const saved = localStorage.getItem(`calc_input_${id}`);
    if (saved !== null) {
      isRestored.current = true;
      const parsed = saved === "true";
      if (parsed !== checked) {
        onChange(parsed);
      }
    }
  }, [id, checked, onChange]);

  const handleChange = (newVal) => {
    if (id) localStorage.setItem(`calc_input_${id}`, newVal);
    onChange(newVal);
  };

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => handleChange(!checked)}
        aria-label={label}
        style={{
          width: 46, height: 26, borderRadius: 13, flexShrink: 0,
          background: checked ? "var(--brand)" : "var(--border)",
          position: "relative", cursor: "pointer", transition: "background .2s",
          boxShadow: checked ? "0 0 0 3px rgba(67,97,238,.2)" : "none",
          border: "none", padding: 0,
        }}
      >
        <span style={{
          position: "absolute", top: 4, left: checked ? 24 : 4,
          width: 18, height: 18, borderRadius: "50%",
          background: "#fff", transition: "left .2s",
          boxShadow: "0 1px 3px rgba(0,0,0,.25)"
        }} />
      </button>
      <div>
        <label htmlFor={id} style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", cursor: "pointer" }}
          onClick={() => handleChange(!checked)}>
          {label}
        </label>
        {hint && <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 3, lineHeight: 1.4 }}>{hint}</p>}
      </div>
    </div>
  );
}

// ── Info Callout ────────────────────────────────────────────────────────
export function InfoBox({ type = "info", children }) {
  const icons = { tip: "💡", warn: "⚠️", info: "ℹ️", bad: "❌" };
  const icon = icons[type] || icons.info;
  return (
    <div className={`info-box info-box-${type}`} role={type === "warn" || type === "bad" ? "alert" : "note"}>
      <span className="info-box-icon" aria-hidden="true">{icon}</span>
      <p className="info-box-text">{children}</p>
    </div>
  );
}

// ── SEO Section ─────────────────────────────────────────────────────────
export function SEOSection({ title, children }) {
  return (
    <div className="seo-section-wrap">
      <h2 className="seo-section-title">📘 {title}</h2>
      <div className="seo-section-body">{children}</div>
    </div>
  );
}

// ── Panel ──────────────────────────────────────────────────────────────
export function Panel({ result, loading, label, shareParams }) {
  const { activeCalc, saveLocally, savedLocally, removeSaved } = useAppStore();
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);
  const prevVal = useRef(null);

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
        inputs: result.breakdowns?.map(b => b.label + ": " + b.value).join(", ")
      });
    }
  };

  const currentHistory = savedLocally.filter(s => s.calcId === activeCalc?.id).slice(0, 5);

  return (
    <div id="calc-result-area" className="result-live-region" aria-live="polite" aria-atomic="false" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Hero result — pregnancy-style gradient card */}
      <ResultBox label={result.primary.label} value={result.primary.value} sub={result.primary.sub} />

      {/* Metrics grid */}
      {result.stats?.length > 0 && (
        <StatsGrid items={result.stats} />
      )}

      {result.chart && (
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 14, padding: "16px 18px" }}>
          <CalcChart chartData={result.chart} />
        </div>
      )}

      {result.insights?.length > 0 && <InsightBox insights={result.insights} />}

      {result.breakdowns?.length > 0 && <Breakdown rows={result.breakdowns} title="Step-by-Step Breakdown" />}

      {result.schedule?.length > 0 && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "var(--surface2)" }}>
            <h4 style={{ fontSize: 12, fontWeight: 800, color: "var(--text)", textTransform: "uppercase", letterSpacing: ".05em", margin: 0 }}>Amortization Schedule</h4>
          </div>
          <div style={{ maxHeight: 300, overflowY: "auto", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, textAlign: "right" }}>
              <thead style={{ position: "sticky", top: 0, background: "var(--surface2)", zIndex: 1, boxShadow: "0 1px 0 var(--border)" }}>
                <tr>
                  <th style={{ padding: "8px 12px", color: "var(--text3)", fontWeight: 700, textAlign: "center" }}>Mo</th>
                  <th style={{ padding: "8px 12px", color: "var(--text3)", fontWeight: 700 }}>Principal</th>
                  <th style={{ padding: "8px 12px", color: "var(--text3)", fontWeight: 700 }}>Interest</th>
                  <th style={{ padding: "8px 12px", color: "var(--text3)", fontWeight: 700 }}>Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.schedule.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "var(--surface)" : "var(--surface2)" }}>
                    <td style={{ padding: "8px 12px", color: "var(--text2)", textAlign: "center", fontWeight: 600 }}>{row.month}</td>
                    <td style={{ padding: "8px 12px", color: "var(--text)" }}>{new Intl.NumberFormat().format(row.principal)}</td>
                    <td style={{ padding: "8px 12px", color: "#f59e0b" }}>{new Intl.NumberFormat().format(row.interest)}</td>
                    <td style={{ padding: "8px 12px", color: "var(--brand)", fontWeight: 700 }}>{new Intl.NumberFormat().format(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {result.steps?.length > 0 && (
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
          <details>
            <summary style={{
              padding: "13px 18px", fontSize: 12, fontWeight: 800, color: "var(--text)",
              textTransform: "uppercase", letterSpacing: ".06em", cursor: "pointer",
              listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "var(--surf2)", borderBottom: "1px solid var(--border)",
            }}>
              <span>📋 Step-by-Step Explanation</span>
              <span style={{ fontSize: 14, color: "var(--text3)" }}>▾</span>
            </summary>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 16 }}>
              {result.steps.map((step, i) => (
                <div key={i} style={{ padding: "10px 14px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", marginBottom: 4 }}>{step.title}</div>
                  <div style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--text)" }}>{step.desc}</div>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}

      <div className="panel-toolbar" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 12, display: "flex", gap: 8 }}>
        <button onClick={handleSaveHistory} className="calc-tool-btn" title="Save this result" aria-label="Save this calculation result">
          💾 Save
        </button>
        {result.breakdowns?.length > 0 && (
          <button onClick={() => exportToCSV(result.breakdowns, (label || "calc").toLowerCase().replace(/\s+/g, "-"))}
            className="calc-tool-btn success" title="Download as CSV" aria-label="Export breakdown data as CSV">
            📥 Export CSV
          </button>
        )}
        {shareParams && (
          <button onClick={async () => { await copyShareLink(shareParams); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className={`calc-tool-btn ${copied ? "active" : ""}`} title="Copy shareable link" aria-label={copied ? "Shareable link copied" : "Copy shareable link"}>
            {copied ? "✅ Copied!" : "🔗 Share"}
          </button>
        )}
      </div>

      {currentHistory.length > 0 && (
        <div style={{ marginTop: 16, borderTop: "1px solid var(--border)", paddingTop: 14, textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <h4 style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--text3)", display: "flex", alignItems: "center", gap: 5 }}>
              🕐 Recent History
            </h4>
            <button onClick={() => setShowHistory(!showHistory)} className="calc-tool-btn" style={{ padding: "4px 10px", fontSize: 11 }}>
              {showHistory ? "Hide" : "Show"}
            </button>
          </div>
          {showHistory && (
            <div>
              {currentHistory.map(h => (
                <div key={h.id} className="history-row">
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="history-val">{h.result}</div>
                    <div className="history-meta">{h.inputs}</div>
                  </div>
                  <button onClick={() => removeSaved(h.id)} className="history-del-btn" aria-label="Remove saved result">×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export const buildResult = (label, val, stats, insights, chart, breakdowns, schedule, steps) => ({
  primary: { label, value: val },
  stats: stats || [],
  insights: insights || [],
  chart: chart || null,
  breakdowns: breakdowns || [],
  schedule: schedule || null,
  steps: steps || null
});

export const useCurrency = () => {
  const countryCode = useGeoStore(s => s.countryCode);
  const rules = useGeoStore(s => s.rules);

  const currency = rules?.currency ?? 'USD';
  const sym = rules?.currencySymbol ?? '$';
  const locale = rules?.locale ?? 'en-US';
  const vatLabel = rules?.taxLabel ?? 'Tax';
  const taxRate = rules?.taxRate ?? 0;
  const measureSystem = rules?.measureSystem ?? 'metric';
  const dateFormat = rules?.dateFormat ?? 'MM/DD/YYYY';

  const fm = (value) => {
    try {
      return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 2 }).format(value);
    } catch {
      return sym + Number(value).toFixed(2);
    }
  };

  const fmSlider = (v) => {
    try {
      return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(v);
    } catch {
      return sym + fmt(v);
    }
  };

  return { sym, currency, locale, vatLabel, taxRate, measureSystem, dateFormat, countryCode, rules, fm, fmSlider, cur: currency };
};

export function ComingSoon({ name }) {
  return (
    <div style={{ padding: 40, textAlign: "center", color: "var(--text2)" }}>
      <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{name} Calculator</h3>
      <p style={{ fontSize: 15, color: "var(--text3)" }}>This calculator is coming soon!</p>
    </div>
  );
}
