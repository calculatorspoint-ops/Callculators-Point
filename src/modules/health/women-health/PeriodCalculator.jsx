import { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Calendar, Heart, Info, ChevronDown, ChevronUp, Lock, Zap, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { InfoAlert } from "@/components/ui/InfoAlert";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  predictCycles,
  generateFertilityInsights,
  formatCycleDate,
  getPhaseInfo,
  isIrregularCycle,
  calcAverageCycle,
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
    <div className={`flex items-center gap-3 py-3 border-b border-gray-100 dark:border-slate-800 ${highlight ? 'bg-opacity-10' : ''}`}>
      <div 
        className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-base border`}
        style={{
          background: highlight ? color : "var(--surf2)",
          borderColor: highlight ? `${color}60` : "var(--border)",
        }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-xs font-bold" style={{ color: highlight ? color : "var(--text2)" }}>{label}</div>
        <div className="text-sm font-extrabold text-gray-900 dark:text-white">{date}</div>
      </div>
      {highlight && (
        <Badge style={{ background: `${color}20`, color }}>Next</Badge>
      )}
    </div>
  );
}

/* ── Insight card ── */
function InsightCard({ insight }) {
  const mapType = {
    info: 'info',
    tip: 'success',
    warning: 'warning'
  };
  return (
    <InfoAlert variant={mapType[insight.type] || 'info'} title={insight.title} className="mb-2">
      {insight.message}
    </InfoAlert>
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

    const input = {
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
        <InfoAlert variant="success" className="mb-5 w-max">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Lock size={12} /> 100% Private — All data stays in your browser. Never stored or shared.
          </div>
        </InfoAlert>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* ── LEFT: Input form ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Main input card */}
            <Card>
              <div className="bg-gradient-to-br from-pink-100 to-pink-50 dark:from-pink-900/30 dark:to-pink-900/10 border-b border-pink-200 dark:border-pink-900/50 p-4 flex items-center gap-2">
                <span className="text-xl">🌸</span>
                <div>
                  <div className="text-sm font-extrabold text-pink-900 dark:text-pink-300">Period Tracker</div>
                  <div className="text-xs text-pink-700 dark:text-pink-400">Predict your next cycle with smart analysis</div>
                </div>
                {irregular && (
                  <Badge variant="warning" className="ml-auto">
                    ⚡ Irregular Detected
                  </Badge>
                )}
              </div>

              <CardBody className="flex flex-col gap-4">
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
                    className="flex items-center gap-1.5 w-full py-2 px-3 rounded-lg bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 text-xs font-bold text-blue-600 dark:text-blue-400 cursor-pointer"
                  >
                    <Zap size={13} /> Improve Accuracy with Past Cycles (Smart Prediction)
                    {showPastCycles ? <ChevronUp size={13} className="ml-auto" /> : <ChevronDown size={13} className="ml-auto" />}
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
                  className="btn-primary w-full flex justify-center items-center gap-2 mt-2"
                >
                  <Calendar size={15} /> Predict My Cycle
                </button>
              </CardBody>
            </Card>

            {/* Insights */}
            {insights.length > 0 && (
              <Card>
                <div className="px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 text-xs font-extrabold uppercase tracking-wide flex items-center gap-1.5">
                  <Info size={13} className="text-blue-600 dark:text-blue-400" /> Smart Insights
                </div>
                <CardBody>
                  {insights.map((ins, i) => <InsightCard key={i} insight={ins} />)}
                </CardBody>
              </Card>
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
              <Card>
                <div className="px-4 py-3 bg-gradient-to-br from-slate-900 to-slate-800 border-b border-slate-700 text-sm font-extrabold text-white flex items-center gap-2">
                  <Calendar size={14} className="text-blue-300" /> Key Dates Forecast
                </div>
                <div className="px-4 pb-1">
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
              </Card>

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
              <Card>
                <div className="px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 text-xs font-extrabold uppercase tracking-wide">
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
                  className="w-full py-2.5 bg-transparent border-none text-xs font-bold text-blue-600 dark:text-blue-400 cursor-pointer flex items-center justify-center gap-1.5 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  {showAllCycles ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  {showAllCycles ? "Show less" : "Show all 6 cycles"}
                </button>
              </Card>
            </div>
          )}
        </div>

        {/* Educational content */}
        {/* Educational content */}
        <Card className="mt-6 p-6">
          <SectionHeader title="📚 Understanding Your Cycle" className="!mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { phase: "Menstrual", days: "Days 1–5", icon: "🩸", color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/10", border: "border-red-200 dark:border-red-900/30", desc: "Uterine lining sheds. Progesterone and estrogen are at their lowest." },
              { phase: "Follicular", days: "Days 1–13", icon: "🌱", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/10", border: "border-blue-200 dark:border-blue-900/30", desc: "FSH stimulates follicle growth. Estrogen rises, building the uterine lining." },
              { phase: "Ovulation", days: "Day 14 (±)", icon: "🌸", color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/10", border: "border-green-200 dark:border-green-900/30", desc: "LH surge triggers egg release. Peak fertility. 12–24 hour egg viability window." },
              { phase: "Luteal", days: "Days 15–28", icon: "🌙", color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/10", border: "border-purple-200 dark:border-purple-900/30", desc: "Progesterone rises. Body prepares for potential pregnancy. PMS may occur." },
            ].map(p => (
              <div key={p.phase} className={`p-3.5 rounded-xl border ${p.bg} ${p.border}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{p.icon}</span>
                  <div>
                    <div className={`text-sm font-extrabold ${p.color}`}>{p.phase}</div>
                    <div className="text-xs text-gray-500">{p.days}</div>
                  </div>
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed m-0">{p.desc}</p>
              </div>
            ))}
          </div>
          
          <InfoAlert variant="warning" className="mt-4">
            This calculator is for informational purposes only. It does not constitute medical advice. If you experience irregular periods, severe pain, or other concerns, please consult a qualified gynecologist.
          </InfoAlert>
        </Card>
      </div>
    </>
  );
}
