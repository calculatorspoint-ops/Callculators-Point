/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useRef } from "react";
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

// ── Label ──────────────────────────────────────────────────────────────
export const L = ({ t, id }) => (
  <label htmlFor={id} style={{
    display: "block", fontSize: 12, fontWeight: 700,
    color: "var(--text2)", marginBottom: 7, letterSpacing: ".01em"
  }}>
    {t}
  </label>
);

// ── Number Input ───────────────────────────────────────────────────────
export function N({ label, id, value, onChange, unit, placeholder = "0", min, max, step, hint, type = "text", icon, prefix }) {
  const [displayValue, setDisplayValue] = useState("");
  const [focused, setFocused] = useState(false);
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
    setFocused(false);
    if (type !== "number" && displayValue !== "") {
      const parsed = parseLocalizedNumber(displayValue);
      setDisplayValue(formatInputNumber(parsed));
      onChange(parsed);
    }
  };

  const hasLeft = icon || prefix;

  return (
    <div style={{ marginBottom: 12 }}>
      {label && <L t={label} id={id} />}
      <div style={{ position: "relative" }}>
        {hasLeft && (
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0,
            width: 44, display: "flex", alignItems: "center", justifyContent: "center",
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
            height: 50,
            paddingLeft: hasLeft ? 52 : 14,
            paddingRight: unit ? 48 : 14,
            background: focused ? "var(--surface)" : "var(--surface2)",
            border: focused ? "2px solid var(--brand)" : "1.5px solid var(--border)",
            borderRadius: "var(--r-md)",
            fontSize: 16,
            fontWeight: 600,
            color: "var(--text)", outline: "none", fontFamily: "var(--font)",
            transition: "all .18s",
            boxShadow: focused ? "0 0 0 4px rgba(67,97,238,.1)" : "none",
            WebkitAppearance: "none",
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
      {hint && <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 4, lineHeight: 1.5 }}>{hint}</p>}
    </div>
  );
}

// ── Slider ─────────────────────────────────────────────────────────────
export function Sl({ label, id, min, max, step = 1, value, onChange, fmt: fmtFn }) {
  const display = fmtFn ? fmtFn(value) : value;
  const pct = Math.round(((value - min) / (max - min)) * 100);

  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        {label && (
          <label htmlFor={id} style={{ fontSize: 14, fontWeight: 700, color: "var(--text2)", letterSpacing: ".01em" }}>
            {label}
          </label>
        )}
        <span style={{
          fontSize: 14, fontWeight: 800, color: "var(--brand)",
          background: "var(--brand-l)", padding: "4px 14px",
          borderRadius: 100, letterSpacing: "-.01em",
          border: "1px solid var(--brand-ll)"
        }}>{display}</span>
      </div>
      <div style={{ position: "relative" }}>
        <div style={{
          position: "absolute", top: "50%", left: 0,
          width: pct + "%", height: 5, borderRadius: 10,
          background: "linear-gradient(90deg, var(--brand-d), var(--brand))",
          transform: "translateY(-50%)", pointerEvents: "none", zIndex: 0,
          transition: "width .1s"
        }} />
        <input
          type="range" id={id} min={min} max={max} step={step} value={value}
          onChange={e => onChange(+e.target.value)}
          aria-label={label}
          style={{ position: "relative", zIndex: 1, background: "transparent" }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontSize: 10, color: "var(--text3)", fontWeight: 600 }}>{fmtFn ? fmtFn(min) : min}</span>
        <span style={{ fontSize: 10, color: "var(--text3)", fontWeight: 600 }}>{fmtFn ? fmtFn(max) : max}</span>
      </div>
    </div>
  );
}

// ── Select ─────────────────────────────────────────────────────────────
export function Sel({ label, id, value, onChange, opts }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <L t={label} id={id} />}
      <select
        id={id} value={value} onChange={e => onChange(e.target.value)}
        aria-label={label} className="f-select"
        style={{ height: 50, fontSize: 16, fontWeight: 600 }}
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
          style={{
            flex: tabs.length > 3 ? "1 1 45%" : 1, padding: "9px 8px", fontSize: 13, fontWeight: 700,
            border: "none", cursor: "pointer", fontFamily: "var(--font)",
            borderRadius: "var(--r-md)",
            transition: "all .18s cubic-bezier(.4,0,.2,1)",
            background: active === t
              ? "linear-gradient(135deg, var(--brand), var(--brand-d))"
              : "transparent",
            color: active === t ? "#fff" : "var(--text3)",
            boxShadow: active === t ? "0 2px 8px rgba(67,97,238,.3)" : "none",
            transform: active === t ? "scale(1)" : "scale(.97)"
          }}
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
    <div className="sc-row2" style={{ gap: 12, marginBottom: 0 }}>
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
    <div style={{
      padding: "10px 12px", background: "var(--surface2)",
      border: "1.5px solid var(--border)", borderRadius: "var(--r-lg)",
      marginBottom: 16
    }}>
      <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--text3)", marginBottom: 8 }}>
        Quick Examples
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        {items.map((p, i) => (
          <button key={i} onClick={() => onApply(p)}
            aria-label={"Apply preset " + p.label}
            style={{
              padding: "8px 14px", borderRadius: "var(--r-md)", fontSize: 12.5,
              fontWeight: 700, border: "1.5px solid var(--border)",
              background: "var(--surface)", color: "var(--text2)",
              cursor: "pointer", transition: "all .18s", lineHeight: 1,
              minHeight: 38, whiteSpace: "nowrap", flexShrink: 0
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "var(--brand)";
              e.currentTarget.style.color = "var(--brand)";
              e.currentTarget.style.background = "var(--brand-l)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--text2)";
              e.currentTarget.style.background = "var(--surface)";
            }}>
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Input Section ──────────────────────────────────────────────────────
// Groups related inputs with a gradient header
export function InputSection({ title, icon, gradient, children }) {
  const grad = gradient || "linear-gradient(135deg, #4361ee 0%, #3451c7 100%)";
  return (
    <div style={{
      border: "1.5px solid var(--border)", borderRadius: "var(--r-xl)",
      overflow: "hidden", marginBottom: 14
    }}>
      <div style={{
        background: grad, padding: "10px 16px",
        display: "flex", alignItems: "center", gap: 9
      }}>
        {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
        <span style={{ fontSize: 12, fontWeight: 800, color: "#fff", letterSpacing: ".02em" }}>
          {title}
        </span>
      </div>
      <div style={{ padding: "16px 16px 6px", background: "var(--surface)" }}>
        {children}
      </div>
    </div>
  );
}

// ── Toggle Switch ──────────────────────────────────────────────────────
export function Toggle({ label, id, checked, onChange, hint }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 44, height: 24, borderRadius: 12, flexShrink: 0,
          background: checked ? "var(--brand)" : "var(--border)",
          position: "relative", cursor: "pointer", transition: "background .2s",
          boxShadow: checked ? "0 0 0 3px rgba(67,97,238,.2)" : "none"
        }}
      >
        <div style={{
          position: "absolute", top: 3, left: checked ? 23 : 3,
          width: 18, height: 18, borderRadius: "50%",
          background: "#fff", transition: "left .2s",
          boxShadow: "0 1px 3px rgba(0,0,0,.25)"
        }} />
      </div>
      <div>
        <label htmlFor={id} style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", cursor: "pointer" }}
          onClick={() => onChange(!checked)}>
          {label}
        </label>
        {hint && <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 2, lineHeight: 1.4 }}>{hint}</p>}
      </div>
    </div>
  );
}

// ── Info Callout ────────────────────────────────────────────────────────
export function InfoBox({ type = "info", children }) {
  const styles = {
    tip:  { bg: "rgba(5,150,105,.07)",  border: "#86efac", icon: "💡", color: "#065f46" },
    warn: { bg: "rgba(217,119,6,.07)",  border: "#fde68a", icon: "⚠️", color: "#78350f" },
    info: { bg: "rgba(67,97,238,.07)",  border: "var(--brand-ll)", icon: "ℹ️", color: "var(--brand-d)" },
    bad:  { bg: "rgba(220,53,69,.07)",  border: "#fca5a5", icon: "❌", color: "#7f1d1d" },
  };
  const s = styles[type] || styles.info;
  return (
    <div style={{
      background: s.bg, border: "1.5px solid " + s.border,
      borderRadius: "var(--r-lg)", padding: "11px 14px",
      display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 14
    }}>
      <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>{s.icon}</span>
      <p style={{ fontSize: 12.5, color: s.color, lineHeight: 1.65, fontWeight: 500 }}>{children}</p>
    </div>
  );
}

// ── SEO Section ─────────────────────────────────────────────────────────
export function SEOSection({ title, children }) {
  return (
    <div style={{
      background: "var(--surface2)", border: "1.5px solid var(--border)",
      borderRadius: "var(--r-xl)", padding: "20px 22px", marginTop: 4
    }}>
      <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 10, letterSpacing: "-.02em" }}>
        {title}
      </h2>
      <div style={{ fontSize: 13.5, color: "var(--text2)", lineHeight: 1.8 }}>
        {children}
      </div>
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
    <div id="calc-result-area" style={{ minWidth: 0, width: "100%", margin: "0 auto", textAlign: "center" }}>
      <ResultBox label={result.primary.label} value={result.primary.value} sub={result.primary.sub} />
      {result.stats?.length > 0 && <StatsGrid items={result.stats} />}
      {result.chart && (
        <div style={{ marginTop: 14 }}>
          <CalcChart chartData={result.chart} />
        </div>
      )}
      {result.insights?.length > 0 && <InsightBox insights={result.insights} />}
      {result.breakdowns?.length > 0 && (
        <Breakdown rows={result.breakdowns} title="Step-by-Step Breakdown" />
      )}

      {/* ── Toolbar ── */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
        <button onClick={handleSaveHistory}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: "var(--surf2)", border: "1px solid var(--border)", color: "var(--text2)", cursor: "pointer", fontFamily: "var(--font)" }}>
          💾 Save Result
        </button>
        {result.breakdowns?.length > 0 && (
          <button onClick={() => exportToCSV(result.breakdowns, (label || "calc").toLowerCase().replace(/\s+/g, "-"))}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: "var(--surf2)", border: "1px solid var(--border)", color: "var(--text2)", cursor: "pointer", fontFamily: "var(--font)" }}>
            📥 Export CSV
          </button>
        )}
        {shareParams && (
          <button onClick={async () => { await copyShareLink(shareParams); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: copied ? "var(--brand)" : "var(--surf2)", border: "1px solid " + (copied ? "var(--brand)" : "var(--border)"), color: copied ? "#fff" : "var(--text2)", cursor: "pointer", fontFamily: "var(--font)", transition: "all .2s" }}>
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
                <div key={h.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "var(--surf2)", borderRadius: "var(--r-md)", fontSize: 12, border: "1px solid var(--border)" }}>
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
