import { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Calendar, Heart, Info, ChevronDown, ChevronUp, Lock, Zap, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  predictCycles,
  generateFertilityInsights,
  formatCycleDate,
  getPhaseInfo,
  isIrregularCycle,
  calcAverageCycle,
  type CycleInput,
} from "./engine/womenHealthEngine.ts";

/* ── Tiny helper ── */
function toDate(s) { return s ? new Date(s) : new Date(); }
function fmt(d) { return d.toISOString().split("T")[0]; }

/* ── Phase pill ── */
function PhasePill({ phase }) {
  const info = getPhaseInfo(phase);
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "10px 18px", borderRadius: 100,
      background: info.bg, border: `1.5px solid ${info.color}30`,
    }}>
      <span style={{ fontSize: 18 }}>{info.icon}</span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 800, color: info.color }}>{info.label}</div>
        <div style={{ fontSize: 11, color: "var(--text3)" }}>Current Phase</div>
      </div>
    </div>
  );
}

/* ── Timeline row ── */
function TimelineRow({ icon, label, date, highlight = false, color = "var(--brand)" }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, padding: "11px 0",
      borderBottom: "1px solid var(--bord2)",
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: highlight ? color : "var(--surf2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16, border: highlight ? `1.5px solid ${color}60` : "1px solid var(--border)",
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: highlight ? color : "var(--text2)" }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)" }}>{date}</div>
      </div>
      {highlight && (
        <div style={{
          padding: "3px 10px", borderRadius: 100,
          background: color + "20", color,
          fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".04em",
        }}>
          Next
        </div>
      )}
    </div>
  );
}

/* ── Insight card ── */
function InsightCard({ insight }) {
  const styles = {
    info: { bg: "var(--brand-l)", border: "#bfdbfe", color: "#1e3a8a" },
    tip: { bg: "var(--green-l)", border: "#86efac", color: "#14532d" },
    warning: { bg: "var(--amber-l)", border: "#fde68a", color: "#78350f" },
  };
  const s = styles[insight.type];
  return (
    <div style={{
      padding: "12px 14px", borderRadius: "var(--r-lg)",
      background: s.bg, border: `1px solid ${s.border}`,
      marginBottom: 8,
    }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: s.color, marginBottom: 4 }}>{insight.title}</div>
      <div style={{ fontSize: 13, color: s.color, opacity: .85, lineHeight: 1.6 }}>{insight.message}</div>
    </div>
  );
}

/* ── Main component ── */
export default function PeriodCalculator() {
  const today = new Date();
  const [lmp, setLmp] = useState(fmt(new Date(today.getTime() - 14 * 86400000)));
  const [cycleLen, setCycleLen] = useState(28);
  const [periodDur, setPeriodDur] = useState(5);
  const [pastCyclesRaw, setPastCyclesRaw] = useState("");
  const [showPastCycles, setShowPastCycles] = useState(false);
  const [result, setResult] = useState(null);
  const [insights, setInsights] = useState([]);
  const [showAllCycles, setShowAllCycles] = useState(false);

  const calculate = useCallback(() => {
    const pastCycles = pastCyclesRaw
      .split(/[,\s]+/)
      .map(Number)
      .filter(n => n >= 15 && n <= 50);

    const input: CycleInput = {
      lastPeriodDate: toDate(lmp),
      cycleLength: cycleLen,
      periodDuration: periodDur,
      pastCycles,
    };

    const r = predictCycles(input, 6);
    const ins = generateFertilityInsights(input, r);
    setResult(r);
    setInsights(ins);
  }, [lmp, cycleLen, periodDur, pastCyclesRaw]);

  // Auto-calculate on mount
  useState(() => { calculate(); });

  const irregular = pastCyclesRaw
    ? isIrregularCycle(pastCyclesRaw.split(/[,\s]+/).map(Number).filter(n => n >= 15 && n <= 50))
    : false;

  const phaseInfo = result ? getPhaseInfo(result.cyclePhase) : null;
  const shownCycles = result ? (showAllCycles ? result.predictions : result.predictions.slice(0, 3)) : [];

  return (
    <>
      <Helmet>
        <title>Period Calculator — Cycle, Ovulation & Fertile Window Predictor | CalculatorsPoint</title>
        <meta name="description" content="Free period calculator with ovulation predictor, fertile window tracker, and cycle phase analysis. AI-powered with irregular cycle detection. 100% private — no data stored." />
        <meta name="keywords" content="period calculator, ovulation calculator, fertile window calculator, menstrual cycle calculator, next period date, period tracker" />
        <link rel="canonical" href="https://calculatorspoint.com/calculator/period-calculator" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "How accurate is this period calculator?", acceptedAnswer: { "@type": "Answer", text: "Accuracy improves with more data. With 6+ tracked cycles, predictions are highly personalized. Single-entry predictions assume a standard 28-day cycle." } },
            { "@type": "Question", name: "What is the fertile window?", acceptedAnswer: { "@type": "Answer", text: "The fertile window spans 5 days before ovulation plus the day of ovulation itself — up to 6 days total when pregnancy is possible." } },
            { "@type": "Question", name: "Is my data private?", acceptedAnswer: { "@type": "Answer", text: "Yes. All calculations run entirely in your browser. No health data is ever sent to any server." } },
          ]
        })}</script>
      </Helmet>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px 60px" }}>

        {/* Privacy banner */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8, padding: "8px 16px",
          background: "var(--green-l)", border: "1px solid #86efac", borderRadius: 100,
          fontSize: 12, fontWeight: 600, color: "#14532d", marginBottom: 20, width: "fit-content",
        }}>
          <Lock size={12} /> 100% Private — All data stays in your browser. Never stored or shared.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* ── LEFT: Input form ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Main input card */}
            <div style={{
              background: "var(--surface)", border: "1.5px solid var(--border)",
              borderRadius: "var(--r-xl)", overflow: "hidden", boxShadow: "var(--sh2)",
            }}>
              <div style={{
                padding: "14px 18px", background: "linear-gradient(135deg, #fce7f3, #fdf2f8)",
                borderBottom: "1px solid #fbcfe8", display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ fontSize: 20 }}>🌸</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#9d174d" }}>Period Tracker</div>
                  <div style={{ fontSize: 11, color: "#be185d" }}>Predict your next cycle with AI precision</div>
                </div>
                {irregular && (
                  <div style={{
                    marginLeft: "auto", padding: "4px 10px", borderRadius: 100,
                    background: "#fef3c7", border: "1px solid #fde68a",
                    fontSize: 10, fontWeight: 800, color: "#92400e",
                  }}>
                    ⚡ Irregular Detected
                  </div>
                )}
              </div>

              <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Last Period */}
                <div>
                  <label className="f-label">First Day of Last Period</label>
                  <input
                    type="date"
                    className="f-input"
                    value={lmp}
                    max={fmt(today)}
                    onChange={e => { setLmp(e.target.value); }}
                    onBlur={calculate}
                  />
                  <div className="f-hint">Enter the first day of your most recent period</div>
                </div>

                {/* Cycle Length */}
                <div>
                  <div className="slider-head">
                    <span className="slider-lbl">Average Cycle Length</span>
                    <span className="slider-val">{cycleLen} days</span>
                  </div>
                  <input
                    type="range" min={21} max={45} value={cycleLen}
                    onChange={e => setCycleLen(+e.target.value)}
                    onMouseUp={calculate} onTouchEnd={calculate}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text3)", marginTop: 4 }}>
                    <span>21 (short)</span><span>28 (average)</span><span>45 (long)</span>
                  </div>
                </div>

                {/* Period Duration */}
                <div>
                  <div className="slider-head">
                    <span className="slider-lbl">Period Duration</span>
                    <span className="slider-val">{periodDur} days</span>
                  </div>
                  <input
                    type="range" min={2} max={10} value={periodDur}
                    onChange={e => setPeriodDur(+e.target.value)}
                    onMouseUp={calculate} onTouchEnd={calculate}
                  />
                </div>

                {/* Advanced: Past Cycles */}
                <div>
                  <button
                    onClick={() => setShowPastCycles(!showPastCycles)}
                    style={{
                      display: "flex", alignItems: "center", gap: 6, width: "100%",
                      padding: "8px 12px", borderRadius: "var(--r-md)",
                      background: "var(--surf2)", border: "1.5px solid var(--border)",
                      fontSize: 12, fontWeight: 700, color: "var(--brand)", cursor: "pointer",
                      fontFamily: "var(--font)",
                    }}
                  >
                    <Zap size={13} /> Improve Accuracy with Past Cycles (AI Mode)
                    {showPastCycles ? <ChevronUp size={13} style={{ marginLeft: "auto" }} /> : <ChevronDown size={13} style={{ marginLeft: "auto" }} />}
                  </button>
                  {showPastCycles && (
                    <div style={{ marginTop: 10 }}>
                      <label className="f-label">Past Cycle Lengths (comma-separated)</label>
                      <input
                        type="text"
                        className="f-input"
                        placeholder="e.g. 28, 27, 30, 29, 28, 31"
                        value={pastCyclesRaw}
                        onChange={e => setPastCyclesRaw(e.target.value)}
                        onBlur={calculate}
                      />
                      <div className="f-hint">
                        Add 3–6 past cycles to activate AI averaging. More data = higher accuracy.
                        {pastCyclesRaw && (() => {
                          const cycles = pastCyclesRaw.split(/[,\s]+/).map(Number).filter(n => n >= 15 && n <= 50);
                          return cycles.length > 0 ? (
                            <span style={{ color: "var(--green)", fontWeight: 700 }}>
                              {" "}Average: {calcAverageCycle(cycles)} days from {cycles.length} cycles.
                            </span>
                          ) : null;
                        })()}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={calculate}
                  className="btn-primary"
                  style={{ justifyContent: "center", gap: 8 }}
                >
                  <Calendar size={15} /> Predict My Cycle
                </button>
              </div>
            </div>

            {/* Insights */}
            {insights.length > 0 && (
              <div style={{
                background: "var(--surface)", border: "1.5px solid var(--border)",
                borderRadius: "var(--r-xl)", overflow: "hidden",
              }}>
                <div style={{
                  padding: "12px 16px", background: "var(--surf2)",
                  borderBottom: "1px solid var(--border)",
                  fontSize: 12, fontWeight: 800, color: "var(--text2)",
                  textTransform: "uppercase", letterSpacing: ".05em",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  <Info size={13} style={{ color: "var(--brand)" }} /> Smart Insights
                </div>
                <div style={{ padding: 16 }}>
                  {insights.map((ins, i) => <InsightCard key={i} insight={ins} />)}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Results ── */}
          {result && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Phase card */}
              <div style={{
                background: `linear-gradient(135deg, ${phaseInfo.bg}, var(--surface))`,
                border: `1.5px solid ${phaseInfo.color}30`,
                borderRadius: "var(--r-xl)", padding: 20,
                boxShadow: `0 4px 20px ${phaseInfo.color}20`,
              }}>
                <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--text3)", marginBottom: 12 }}>
                  Current Cycle Phase
                </div>
                <PhasePill phase={result.cyclePhase} />
                <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 10, lineHeight: 1.6 }}>
                  {phaseInfo.desc}
                </p>

                {/* Confidence indicator */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 6, marginTop: 12,
                  padding: "6px 12px", borderRadius: 100, width: "fit-content",
                  background: result.confidence === 'high' ? "var(--green-l)" : result.confidence === 'medium' ? "var(--amber-l)" : "var(--surf2)",
                  border: `1px solid ${result.confidence === 'high' ? "#86efac" : result.confidence === 'medium' ? "#fde68a" : "var(--border)"}`,
                }}>
                  {result.confidence === 'high' ? <CheckCircle2 size={12} style={{ color: "var(--green)" }} /> : <AlertCircle size={12} style={{ color: result.confidence === 'medium' ? "var(--amber)" : "var(--text3)" }} />}
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: result.confidence === 'high' ? "var(--green)" : result.confidence === 'medium' ? "var(--amber-text)" : "var(--text3)",
                  }}>
                    {result.confidence === 'high' ? 'High accuracy' : result.confidence === 'medium' ? 'Medium accuracy' : 'Add past cycles to improve'} prediction
                  </span>
                </div>
              </div>

              {/* Key dates */}
              <div style={{
                background: "var(--surface)", border: "1.5px solid var(--border)",
                borderRadius: "var(--r-xl)", overflow: "hidden",
              }}>
                <div style={{
                  padding: "12px 18px", background: "linear-gradient(135deg, #0f172a, #1a1040)",
                  borderBottom: "1px solid var(--border)",
                  fontSize: 13, fontWeight: 800, color: "#fff",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <Calendar size={14} style={{ color: "#93c5fd" }} /> Key Dates Forecast
                </div>
                <div style={{ padding: "0 18px 4px" }}>
                  <TimelineRow
                    icon="🩸" label="Next Period Starts"
                    date={formatCycleDate(result.nextPeriodDate)}
                    highlight={result.daysUntilNextPeriod >= 0 && result.daysUntilNextPeriod <= 7}
                    color="#dc2626"
                  />
                  <TimelineRow
                    icon="🌸" label="Ovulation Day"
                    date={formatCycleDate(result.ovulationDate)}
                    highlight={result.isInFertileWindow || result.daysUntilOvulation === 0}
                    color="#16a34a"
                  />
                  <TimelineRow
                    icon="💚" label="Fertile Window Opens"
                    date={formatCycleDate(result.fertileStart)}
                  />
                  <TimelineRow
                    icon="💚" label="Fertile Window Closes"
                    date={formatCycleDate(result.fertileEnd)}
                  />
                  <TimelineRow
                    icon="🔬" label="Implantation Window"
                    date={`${formatCycleDate(result.implantationStart)} – ${formatCycleDate(result.implantationEnd)}`}
                  />
                </div>
              </div>

              {/* Day counters */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  {
                    label: "Days Until Period",
                    value: result.daysUntilNextPeriod < 0 ? "Overdue" : `${result.daysUntilNextPeriod}`,
                    suffix: result.daysUntilNextPeriod < 0 ? "" : " days",
                    icon: "🩸",
                    warn: result.daysUntilNextPeriod < 5,
                  },
                  {
                    label: "Days Until Ovulation",
                    value: result.daysUntilOvulation < 0 ? "Passed" : `${result.daysUntilOvulation}`,
                    suffix: result.daysUntilOvulation < 0 ? "" : " days",
                    icon: "🌸",
                    green: result.isInFertileWindow,
                  },
                ].map(stat => (
                  <div key={stat.label} style={{
                    background: stat.warn ? "var(--red-l)" : stat.green ? "var(--green-l)" : "var(--surf2)",
                    border: `1.5px solid ${stat.warn ? "#fca5a5" : stat.green ? "#86efac" : "var(--border)"}`,
                    borderRadius: "var(--r-lg)", padding: 14, textAlign: "center",
                  }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{stat.icon}</div>
                    <div style={{
                      fontFamily: "var(--font-hd)", fontSize: 26, fontWeight: 900,
                      color: stat.warn ? "#dc2626" : stat.green ? "#16a34a" : "var(--brand)",
                    }}>
                      {stat.value}<span style={{ fontSize: 13, fontWeight: 600 }}>{stat.suffix}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600 }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* 6-cycle forecast */}
              <div style={{
                background: "var(--surface)", border: "1.5px solid var(--border)",
                borderRadius: "var(--r-xl)", overflow: "hidden",
              }}>
                <div style={{
                  padding: "12px 16px", background: "var(--surf2)",
                  borderBottom: "1px solid var(--border)",
                  fontSize: 12, fontWeight: 800, color: "var(--text2)",
                  textTransform: "uppercase", letterSpacing: ".05em",
                }}>
                  📅 6-Month Forecast
                </div>
                {shownCycles.map((c, i) => (
                  <div key={i} style={{
                    padding: "10px 16px", borderBottom: "1px solid var(--bord2)",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: i === 0 ? "var(--brand-l)" : "transparent",
                  }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: i === 0 ? "var(--brand)" : "var(--text2)" }}>
                        {i === 0 ? "Next Period" : `Cycle ${c.cycleNumber}`}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                        {formatCycleDate(c.periodStart)}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: "var(--text3)" }}>Ovulation</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#16a34a" }}>{formatCycleDate(c.ovulationDate)}</div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setShowAllCycles(!showAllCycles)}
                  style={{
                    width: "100%", padding: "10px 16px", background: "transparent",
                    border: "none", fontSize: 12, fontWeight: 700, color: "var(--brand)",
                    cursor: "pointer", fontFamily: "var(--font)", display: "flex",
                    alignItems: "center", justifyContent: "center", gap: 5,
                  }}
                >
                  {showAllCycles ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  {showAllCycles ? "Show less" : "Show all 6 cycles"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Educational content */}
        <div style={{
          background: "var(--surface)", border: "1.5px solid var(--border)",
          borderRadius: "var(--r-xl)", padding: 24, marginTop: 24,
        }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text)", marginBottom: 16 }}>
            📚 Understanding Your Cycle
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {[
              { phase: "Menstrual", days: "Days 1–5", icon: "🩸", color: "#dc2626", desc: "Uterine lining sheds. Progesterone and estrogen are at their lowest." },
              { phase: "Follicular", days: "Days 1–13", icon: "🌱", color: "#2563eb", desc: "FSH stimulates follicle growth. Estrogen rises, building the uterine lining." },
              { phase: "Ovulation", days: "Day 14 (±)", icon: "🌸", color: "#16a34a", desc: "LH surge triggers egg release. Peak fertility. 12–24 hour egg viability window." },
              { phase: "Luteal", days: "Days 15–28", icon: "🌙", color: "#7c3aed", desc: "Progesterone rises. Body prepares for potential pregnancy. PMS may occur." },
            ].map(p => (
              <div key={p.phase} style={{
                padding: 14, borderRadius: "var(--r-lg)",
                border: `1.5px solid ${p.color}30`, background: `${p.color}08`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 18 }}>{p.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: p.color }}>{p.phase}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>{p.days}</div>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
          <p style={{
            fontSize: 12, color: "var(--text3)", marginTop: 16, padding: "10px 14px",
            background: "var(--surf2)", borderRadius: "var(--r-md)", borderLeft: "3px solid var(--border)",
          }}>
            ⚠️ This calculator is for informational purposes only. It does not constitute medical advice. If you experience irregular periods, severe pain, or other concerns, please consult a qualified gynecologist.
          </p>
        </div>
      </div>
    </>
  );
}
