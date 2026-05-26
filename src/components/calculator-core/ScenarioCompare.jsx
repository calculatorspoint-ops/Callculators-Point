/**
 * Scenario Comparison Engine
 * Allows side-by-side analysis of up to 3 scenarios for financial calculators.
 * Each scenario card captures a snapshot of calculator results for visual comparison.
 */
import { useState, useCallback } from "react";
import { CalcChart } from '@/components/charts/LazyCalcChart';

// ── Scenario Card ─────────────────────────────────────────────────────
function ScenarioCard({ scenario, index, onRemove, isBase, colors }) {
  const color = colors[index % colors.length];
  return (
    <div style={{
      flex: 1, minWidth: 240, padding: "16px", borderRadius: "var(--r-xl)",
      border: `2px solid ${isBase ? color : "var(--border)"}`,
      background: isBase ? `${color}08` : "var(--surface)",
      position: "relative", transition: "all .2s",
    }}>
      {/* Header badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 800,
          background: `${color}15`, color, textTransform: "uppercase", letterSpacing: ".05em",
        }}>
          {isBase ? "📌 Base" : `#${index + 1}`} {scenario.label}
        </span>
        {!isBase && (
          <button
            onClick={() => onRemove(index)}
            style={{ color: "var(--text3)", background: "none", border: "none", fontSize: 14, cursor: "pointer", padding: "2px 6px" }}
            aria-label="Remove scenario"
          >✕</button>
        )}
      </div>

      {/* Primary result */}
      <div style={{
        textAlign: "center", padding: "14px 12px", borderRadius: "var(--r-lg)",
        background: `${color}10`, marginBottom: 14,
      }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>
          {scenario.result?.primary?.label || "Result"}
        </p>
        <p style={{ fontSize: 24, fontWeight: 900, color, fontFamily: "var(--font-display)", letterSpacing: "-.02em" }}>
          {scenario.result?.primary?.value || "—"}
        </p>
      </div>

      {/* Stats comparison */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {scenario.result?.stats?.map((s, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "6px 10px", borderRadius: "var(--r-sm)",
            background: "var(--surface2)", fontSize: 12,
          }}>
            <span style={{ color: "var(--text3)", fontWeight: 500 }}>{s.label}</span>
            <span style={{ fontWeight: 700, color: s.highlight ? color : s.warn ? "#ef4444" : "var(--text)" }}>
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Delta Comparison Bar ─────────────────────────────────────────────
function DeltaBar({ scenarios, statIndex, colors }) {
  if (scenarios.length < 2) return null;
  const base = scenarios[0];
  const baseStat = base.result?.stats?.[statIndex];
  if (!baseStat) return null;

  // Extract numeric value from stat
  const extractNum = (val) => {
    if (typeof val === "number") return val;
    const s = String(val).replace(/[^0-9.-]/g, "");
    return parseFloat(s) || 0;
  };

  const baseVal = extractNum(baseStat.value);
  if (!baseVal) return null;

  return (
    <div style={{
      padding: "10px 14px", background: "var(--surface2)", borderRadius: "var(--r-md)",
      border: "1px solid var(--border)", marginBottom: 8,
    }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>
        {baseStat.label} — Comparison
      </p>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {scenarios.map((sc, i) => {
          const stat = sc.result?.stats?.[statIndex];
          const val = extractNum(stat?.value);
          const pct = baseVal ? ((val / baseVal) * 100).toFixed(0) : 0;
          const delta = val - baseVal;
          const color = colors[i % colors.length];
          return (
            <div key={i} style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                <span style={{ fontWeight: 700, color }}>{sc.label || `#${i + 1}`}</span>
                <span style={{ fontWeight: 600, color: i === 0 ? "var(--text2)" : delta > 0 ? "#16a34a" : delta < 0 ? "#ef4444" : "var(--text2)" }}>
                  {i === 0 ? "Base" : `${delta >= 0 ? "+" : ""}${typeof delta === "number" ? delta.toLocaleString(undefined, { maximumFractionDigits: 0 }) : delta}`}
                </span>
              </div>
              <div style={{ height: 6, background: "var(--border)", borderRadius: 10, overflow: "hidden" }}>
                <div style={{
                  width: `${Math.min(+pct, 150)}%`, height: "100%",
                  background: color, borderRadius: 10, transition: "width .5s ease",
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Scenario Compare Component ──────────────────────────────────
const SCENARIO_COLORS = ["#3b82f6", "#f59e0b", "#16a34a"];

export function ScenarioCompare({ currentResult, currentParams, calcLabel, onRestoreParams }) {
  const [scenarios, setScenarios] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const captureScenario = useCallback(() => {
    if (!currentResult?.primary) return;
    const label = `Scenario ${scenarios.length + 1}`;
    setScenarios(prev => [
      ...prev,
      { label, result: JSON.parse(JSON.stringify(currentResult)), params: { ...currentParams }, timestamp: Date.now() }
    ].slice(0, 3));
    if (!isOpen) setIsOpen(true);
  }, [currentResult, currentParams, scenarios.length, isOpen]);

  const removeScenario = useCallback((idx) => {
    setScenarios(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const clearAll = useCallback(() => {
    setScenarios([]);
    setIsOpen(false);
  }, []);

  if (!currentResult?.primary) return null;

  return (
    <div style={{ marginTop: 16 }}>
      {/* Toggle Bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 14px", background: "var(--surface2)", borderRadius: "var(--r-lg)",
        border: "1.5px solid var(--border)", marginBottom: isOpen ? 14 : 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span aria-hidden="true" style={{ fontSize: 16 }}>⚖️</span>
          <div>
            <p style={{ fontSize: 12, fontWeight: 800, color: "var(--text)", margin: 0 }}>Scenario Comparison</p>
            <p style={{ fontSize: 10, color: "var(--text3)", margin: 0 }}>
              {scenarios.length === 0 ? "Capture up to 3 scenarios for side-by-side analysis" : `${scenarios.length}/3 captured`}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={captureScenario}
            disabled={scenarios.length >= 3}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "6px 14px", borderRadius: 100, fontSize: 11, fontWeight: 700,
              background: scenarios.length >= 3 ? "var(--border)" : "var(--brand)",
              color: scenarios.length >= 3 ? "var(--text3)" : "#fff",
              border: "none", cursor: scenarios.length >= 3 ? "not-allowed" : "pointer",
              fontFamily: "var(--font)", transition: "all .2s",
            }}
          >
            📸 Capture
          </button>
          {scenarios.length > 0 && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{
                padding: "6px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700,
                background: "var(--surface)", border: "1px solid var(--border)",
                color: "var(--text2)", cursor: "pointer", fontFamily: "var(--font)",
              }}
            >
              {isOpen ? "▲ Hide" : "▼ Show"}
            </button>
          )}
          {scenarios.length > 0 && (
            <button
              onClick={clearAll}
              style={{
                padding: "6px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700,
                background: "var(--surface)", border: "1px solid var(--border)",
                color: "#ef4444", cursor: "pointer", fontFamily: "var(--font)",
              }}
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Comparison Panel */}
      {isOpen && scenarios.length > 0 && (
        <div style={{
          padding: 16, background: "var(--surface)", borderRadius: "var(--r-xl)",
          border: "1.5px solid var(--border)", boxShadow: "var(--sh2)",
        }}>
          {/* Scenario Cards */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
            {scenarios.map((sc, i) => (
              <ScenarioCard
                key={sc.timestamp}
                scenario={sc}
                index={i}
                onRemove={removeScenario}
                isBase={i === 0}
                colors={SCENARIO_COLORS}
              />
            ))}
          </div>

          {/* Delta Comparisons */}
          {scenarios.length >= 2 && scenarios[0].result?.stats?.length > 0 && (
            <div>
              <p style={{
                fontSize: 10, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase",
                letterSpacing: ".08em", marginBottom: 10,
              }}>
                📊 Delta Analysis (vs Base)
              </p>
              {scenarios[0].result.stats.slice(0, 4).map((_, i) => (
                <DeltaBar key={i} scenarios={scenarios} statIndex={i} colors={SCENARIO_COLORS} />
              ))}
            </div>
          )}

          {/* Restore buttons */}
          {onRestoreParams && (
            <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
              {scenarios.map((sc, i) => (
                <button
                  key={sc.timestamp}
                  onClick={() => onRestoreParams(sc.params)}
                  style={{
                    padding: "6px 14px", borderRadius: 100, fontSize: 11, fontWeight: 700,
                    background: `${SCENARIO_COLORS[i]}10`, border: `1px solid ${SCENARIO_COLORS[i]}40`,
                    color: SCENARIO_COLORS[i], cursor: "pointer", fontFamily: "var(--font)",
                  }}
                >
                  ↩ Load {sc.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
