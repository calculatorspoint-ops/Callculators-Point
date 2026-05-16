import { useState, useEffect, useCallback } from "react";

// ── Period Calculator Engine ──────────────────────────────────────────
function calcPeriod({ lastPeriodDate, cycleLength, periodDuration, prevCycles = [] }) {
  const last = new Date(lastPeriodDate);
  if (!lastPeriodDate || isNaN(last)) return null;

  // Adaptive cycle length using weighted average
  const avgCycle = prevCycles.length >= 2
    ? Math.round(prevCycles.reduce((a, b) => a + b, 0) / prevCycles.length)
    : cycleLength;

  const variance = prevCycles.length >= 2
    ? Math.round(Math.max(...prevCycles) - Math.min(...prevCycles))
    : 0;

  const cl = avgCycle;
  const pd = periodDuration;

  // Phase dates from last period
  const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
  const fmt = d => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  const nextPeriod     = addDays(last, cl);
  const ovulationDay   = addDays(last, cl - 14);
  const fertileStart   = addDays(last, cl - 17);
  const fertileEnd     = addDays(last, cl - 11);
  const pmsStart       = addDays(last, cl - 7);
  const periodEnd      = addDays(last, pd);
  const follicularEnd  = addDays(last, cl - 14);

  // Cycle phases
  const today = new Date();
  const dayOfCycle = Math.floor((today - last) / 86400000);
  const cycleDay = ((dayOfCycle % cl) + cl) % cl + 1;

  let currentPhase = "Menstrual";
  let phaseEmoji = "🔴";
  let phaseDesc = "Your period is active. Rest, stay hydrated, use heat therapy for cramps.";
  let energyLevel = "Low";
  let moodExpectation = "Introspective, may feel tired or crampy";

  if (cycleDay > pd && cycleDay <= cl - 14) {
    currentPhase = "Follicular"; phaseEmoji = "🌱";
    phaseDesc = "Estrogen is rising. Energy returns. Great time to start new projects.";
    energyLevel = "Building"; moodExpectation = "Optimistic, sociable, motivated";
  } else if (cycleDay > cl - 14 && cycleDay <= cl - 11) {
    currentPhase = "Ovulation"; phaseEmoji = "✨";
    phaseDesc = "Peak fertility. Highest energy and confidence. Ovulation may cause mild pain.";
    energyLevel = "Peak"; moodExpectation = "Confident, social, high libido";
  } else if (cycleDay > cl - 11) {
    currentPhase = "Luteal"; phaseEmoji = "🌕";
    phaseDesc = "Progesterone peaks then drops. PMS symptoms may appear in the final days.";
    energyLevel = "Declining"; moodExpectation = "May feel bloated, moody, or tired";
  }

  // Next 3 cycles
  const upcomingCycles = [1, 2, 3].map(i => ({
    period: fmt(addDays(last, cl * i)),
    ovulation: fmt(addDays(last, cl * i + cl - 14)),
    fertile: `${fmt(addDays(last, cl * i + cl - 17))} – ${fmt(addDays(last, cl * i + cl - 11))}`,
  }));

  // Health flags
  const flags = [];
  if (cl < 21) flags.push({ type: "warn", msg: "Short cycles (<21 days) may indicate hormonal imbalance or thyroid issues." });
  if (cl > 35) flags.push({ type: "warn", msg: "Long cycles (>35 days) can be associated with PCOS or ovulation irregularities." });
  if (pd > 7)  flags.push({ type: "warn", msg: "Periods lasting >7 days may warrant a check for fibroids or clotting conditions." });
  if (variance > 7) flags.push({ type: "info", msg: `Your cycles vary by ${variance} days — irregular patterns may benefit from tracking over 3+ months.` });
  if (flags.length === 0) flags.push({ type: "good", msg: "Your cycle parameters appear within a healthy range. Keep tracking for more personalized insights." });

  const confidenceScore = prevCycles.length >= 3 ? "High" : prevCycles.length >= 1 ? "Moderate" : "Low";

  return {
    nextPeriod: fmt(nextPeriod), ovulationDay: fmt(ovulationDay),
    fertileWindow: `${fmt(fertileStart)} – ${fmt(fertileEnd)}`,
    pmsWindow: `${fmt(pmsStart)} – ${fmt(addDays(last, cl - 1))}`,
    periodEnds: fmt(periodEnd),
    currentPhase, phaseEmoji, phaseDesc, energyLevel, moodExpectation,
    cycleDay, avgCycle, variance, confidenceScore,
    upcomingCycles, flags,
    phases: [
      { name: "Menstrual", days: `Days 1–${pd}`, color: "#ef4444", bg: "#fef2f2", icon: "🔴", desc: "Uterine lining sheds. Estrogen and progesterone are lowest." },
      { name: "Follicular", days: `Days ${pd + 1}–${cl - 14}`, color: "#3b82f6", bg: "#eff6ff", icon: "🌱", desc: "FSH rises, follicles develop, estrogen builds. Energy increases." },
      { name: "Ovulation", days: `Days ${cl - 14}–${cl - 11}`, color: "#f59e0b", bg: "#fffbeb", icon: "✨", desc: "LH surge triggers egg release. Peak fertility window." },
      { name: "Luteal", days: `Days ${cl - 11}–${cl}`, color: "#8b5cf6", bg: "#f5f3ff", icon: "🌕", desc: "Progesterone rises then falls. PMS may occur near end." },
    ],
  };
}

// ── Styles ────────────────────────────────────────────────────────────
const S = {
  label: { display: "block", fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 },
  input: { width: "100%", padding: "9px 12px", background: "var(--surface2)", border: "1.5px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 14, color: "var(--text)", fontFamily: "var(--font)", outline: "none", boxSizing: "border-box" },
  field: { marginBottom: 16 },
  card: (bg, border) => ({ background: bg, border: `1.5px solid ${border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 12 }),
  badge: (color, bg) => ({ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", background: bg, color, borderRadius: 100, fontSize: 12, fontWeight: 700 }),
  sectionTitle: { fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--text3)", marginBottom: 12, marginTop: 4 },
};

// ── Main Period Calculator Form ───────────────────────────────────────
export function PeriodForm() {
  const today = new Date().toISOString().split("T")[0];
  const [lastPeriod, setLastPeriod] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 5); return d.toISOString().split("T")[0];
  });
  const [cycleLen, setCycleLen] = useState(28);
  const [periodDur, setPeriodDur] = useState(5);
  const [prevInput, setPrevInput] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [res, setRes] = useState(null);

  // Persistence for Symptom Logging & Cycle History
  const [symptomLog, setSymptomLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem('period_symptom_log')) || {}; } catch { return {}; }
  });
  
  useEffect(() => {
    localStorage.setItem('period_symptom_log', JSON.stringify(symptomLog));
  }, [symptomLog]);

  const toggleSymptom = (dateStr, symp) => {
    setSymptomLog(prev => {
      const dayLog = prev[dateStr] || [];
      const isThere = dayLog.includes(symp);
      return { ...prev, [dateStr]: isThere ? dayLog.filter(s => s !== symp) : [...dayLog, symp] };
    });
  };

  const parsePrevCycles = useCallback((str) => {
    return str.split(/[,\s]+/).map(Number).filter(n => n >= 15 && n <= 50);
  }, []);

  useEffect(() => {
    if (!lastPeriod) { setRes(null); return; }
    const r = calcPeriod({
      lastPeriodDate: lastPeriod,
      cycleLength: cycleLen,
      periodDuration: periodDur,
      prevCycles: parsePrevCycles(prevInput),
    });
    setRes(r);
  }, [lastPeriod, cycleLen, periodDur, prevInput, parsePrevCycles]);

  const PHASE_COLORS = { Menstrual: "#ef4444", Follicular: "#3b82f6", Ovulation: "#f59e0b", Luteal: "#8b5cf6" };
  const PHASE_BG    = { Menstrual: "#fef2f2", Follicular: "#eff6ff", Ovulation: "#fffbeb", Luteal: "#f5f3ff" };

  const tabs = [
    { id: "overview", label: "📅 Overview" },
    { id: "phases",   label: "🔄 Phases" },
    { id: "symptoms", label: "📝 Symptoms" },
    { id: "forecast", label: "🔮 Forecast" },
    { id: "health",   label: "💊 Health" },
  ];

  const COMMON_SYMPTOMS = [
    { id: 'cramps', icon: '⚡', label: 'Cramps' },
    { id: 'headache', icon: '🤕', label: 'Headache' },
    { id: 'bloating', icon: '🎈', label: 'Bloating' },
    { id: 'fatigue', icon: '🥱', label: 'Fatigue' },
    { id: 'acne', icon: '🔴', label: 'Acne Breakout' },
    { id: 'mood', icon: '🎢', label: 'Mood Swings' },
    { id: 'tender', icon: '🍈', label: 'Tender Breasts' },
    { id: 'spotting', icon: '🩸', label: 'Spotting' },
  ];

  return (
    <div>
      {/* Privacy Notice */}
      <div style={{ ...S.card("#f0fdf4", "#bbf7d0"), display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 18 }}>🔒</span>
        <span style={{ fontSize: 12, color: "#166534", fontWeight: 600 }}>100% Private — all data stays in your browser. Nothing is sent to any server.</span>
      </div>

      {/* Inputs */}
      <div style={S.field}>
        <label style={S.label}>First Day of Last Period</label>
        <input type="date" value={lastPeriod} max={today} onChange={e => setLastPeriod(e.target.value)} style={S.input} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <label style={S.label}>Cycle Length (days)</label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="range" min={15} max={50} value={cycleLen} onChange={e => setCycleLen(+e.target.value)}
              style={{ flex: 1, accentColor: "var(--brand)" }} />
            <span style={{ minWidth: 28, fontWeight: 800, color: "var(--brand)", fontSize: 16 }}>{cycleLen}</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>Normal: 21–35 days</div>
        </div>
        <div>
          <label style={S.label}>Period Duration (days)</label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="range" min={1} max={10} value={periodDur} onChange={e => setPeriodDur(+e.target.value)}
              style={{ flex: 1, accentColor: "#ef4444" }} />
            <span style={{ minWidth: 28, fontWeight: 800, color: "#ef4444", fontSize: 16 }}>{periodDur}</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>Normal: 2–7 days</div>
        </div>
      </div>

      {/* Previous cycles for adaptive prediction */}
      <div style={S.field}>
        <label style={S.label}>Previous Cycle Lengths (optional — improves accuracy)</label>
        <input type="text" value={prevInput} onChange={e => setPrevInput(e.target.value)}
          placeholder="e.g. 28, 30, 27, 29" style={S.input} />
        <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>Separate with commas. More cycles = higher prediction confidence.</div>
      </div>

      {/* Results */}
      {res && (
        <>
          {/* Current Phase Hero */}
          <div style={{ background: PHASE_BG[res.currentPhase], border: `2px solid ${PHASE_COLORS[res.currentPhase]}`, borderRadius: 16, padding: "20px", marginBottom: 16, textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 6 }}>{res.phaseEmoji}</div>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em", color: PHASE_COLORS[res.currentPhase], marginBottom: 4 }}>
              Current Phase · Day {res.cycleDay} of {res.avgCycle}
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: PHASE_COLORS[res.currentPhase], marginBottom: 8 }}>
              {res.currentPhase} Phase
            </div>
            <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, maxWidth: 380, margin: "0 auto 10px" }}>{res.phaseDesc}</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={S.badge(PHASE_COLORS[res.currentPhase], "white")}>⚡ Energy: {res.energyLevel}</span>
              <span style={S.badge(PHASE_COLORS[res.currentPhase], "white")}>🧠 {res.moodExpectation.split(",")[0]}</span>
            </div>
          </div>

          {/* Confidence */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, padding: "8px 14px", background: "var(--surface2)", borderRadius: 10, border: "1px solid var(--border)" }}>
            <span style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600 }}>Prediction Confidence</span>
            <span style={S.badge(res.confidenceScore === "High" ? "#166534" : res.confidenceScore === "Moderate" ? "#92400e" : "#1e40af",
              res.confidenceScore === "High" ? "#f0fdf4" : res.confidenceScore === "Moderate" ? "#fffbeb" : "#eff6ff")}>
              {res.confidenceScore === "High" ? "✅" : res.confidenceScore === "Moderate" ? "⚠️" : "📊"} {res.confidenceScore} Confidence
            </span>
          </div>
          {res.variance > 0 && (
            <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 16, padding: "8px 14px", background: "var(--surface2)", borderRadius: 10, border: "1px solid var(--border)" }}>
              📊 Your cycle varies between <strong>{res.avgCycle - Math.floor(res.variance / 2)}–{res.avgCycle + Math.ceil(res.variance / 2)} days</strong>. Predictions may shift by ±{Math.ceil(res.variance / 2)} days.
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "wrap" }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                padding: "7px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700, cursor: "pointer",
                background: activeTab === t.id ? "var(--brand)" : "var(--surface2)",
                color: activeTab === t.id ? "#fff" : "var(--text2)",
                border: activeTab === t.id ? "none" : "1.5px solid var(--border)",
                fontFamily: "var(--font)", transition: "all .15s"
              }}>{t.label}</button>
            ))}
          </div>

          {/* Tab: Overview */}
          {activeTab === "overview" && (
            <div>
              <p style={S.sectionTitle}>Key Dates</p>
              {[
                { label: "🔴 Next Period", value: res.nextPeriod, color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
                { label: "✨ Ovulation Day", value: res.ovulationDay, color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
                { label: "💚 Fertile Window", value: res.fertileWindow, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
                { label: "🌙 PMS Window", value: res.pmsWindow, color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe" },
                { label: "📅 Period Ends", value: res.periodEnds, color: "var(--text2)", bg: "var(--surface2)", border: "var(--border)" },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: item.bg, border: `1.5px solid ${item.border}`, borderRadius: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 900, color: item.color }}>{item.value}</span>
                </div>
              ))}

              {/* Visual cycle bar */}
              <p style={{ ...S.sectionTitle, marginTop: 16 }}>Cycle Progress</p>
              <div style={{ background: "var(--surface2)", borderRadius: 10, height: 14, overflow: "hidden", marginBottom: 6, border: "1px solid var(--border)" }}>
                <div style={{
                  height: "100%", borderRadius: 10,
                  width: `${Math.min((res.cycleDay / res.avgCycle) * 100, 100)}%`,
                  background: `linear-gradient(to right, #ef4444, #3b82f6, #f59e0b, #8b5cf6)`,
                  transition: "width .5s ease"
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text3)", marginBottom: 16 }}>
                <span>Day 1</span><span>Day {res.cycleDay} / {res.avgCycle}</span>
              </div>
            </div>
          )}

          {/* Tab: Phases */}
          {activeTab === "phases" && (
            <div>
              <p style={S.sectionTitle}>Menstrual Cycle Phases</p>
              {res.phases.map(ph => (
                <div key={ph.name} style={{ ...S.card(ph.bg, "transparent"), borderLeft: `4px solid ${ph.color}`, marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 18 }}>{ph.icon}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: ph.color }}>{ph.name} Phase</div>
                      <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600 }}>{ph.days}</div>
                    </div>
                    {res.currentPhase === ph.name && (
                      <span style={{ marginLeft: "auto", ...S.badge(ph.color, "white"), fontSize: 10 }}>● Now</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>{ph.desc}</div>
                </div>
              ))}

              {/* Hormone education */}
              <p style={{ ...S.sectionTitle, marginTop: 16 }}>What's Happening Hormonally</p>
              {[
                { hormone: "Estrogen", trend: "Rises in follicular, peaks at ovulation, dips in luteal", color: "#ec4899" },
                { hormone: "Progesterone", trend: "Low until ovulation, peaks mid-luteal, drops before period", color: "#8b5cf6" },
                { hormone: "FSH", trend: "Rises to trigger follicle development each cycle", color: "#3b82f6" },
                { hormone: "LH", trend: "Surges at ovulation to trigger egg release", color: "#f59e0b" },
              ].map(h => (
                <div key={h.hormone} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8, padding: "10px 12px", background: "var(--surface2)", borderRadius: 10, border: "1px solid var(--border)" }}>
                  <span style={{ minWidth: 90, fontWeight: 800, fontSize: 12, color: h.color }}>{h.hormone}</span>
                  <span style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>{h.trend}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tab: Symptoms Logging & History */}
          {activeTab === "symptoms" && (
            <div>
              <p style={S.sectionTitle}>Log Symptoms for Today</p>
              <div style={{ ...S.card("var(--surface2)", "var(--border)"), marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>
                  {new Date().toLocaleDateString("en-US", { weekday: 'long', month: 'short', day: 'numeric' })}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8 }}>
                  {COMMON_SYMPTOMS.map(s => {
                    const todayStr = new Date().toISOString().split('T')[0];
                    const isSelected = (symptomLog[todayStr] || []).includes(s.id);
                    return (
                      <button 
                        key={s.id}
                        onClick={() => toggleSymptom(todayStr, s.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px',
                          background: isSelected ? 'var(--brand-l)' : 'var(--surface)',
                          border: `1.5px solid ${isSelected ? 'var(--brand)' : 'var(--border)'}`,
                          borderRadius: 8, cursor: 'pointer', textAlign: 'left', transition: 'all .15s'
                        }}
                      >
                        <span style={{ fontSize: 16 }}>{s.icon}</span>
                        <span style={{ fontSize: 12, fontWeight: isSelected ? 800 : 600, color: isSelected ? 'var(--brand)' : 'var(--text2)' }}>{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <p style={{ ...S.sectionTitle, marginTop: 16 }}>Symptom History</p>
              {Object.keys(symptomLog).length === 0 ? (
                <div style={{ fontSize: 12, color: "var(--text3)", fontStyle: "italic", padding: "12px", background: "var(--surface2)", borderRadius: 10 }}>No symptoms logged yet. Start tracking today to identify patterns!</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {Object.entries(symptomLog).sort((a,b) => new Date(b[0]) - new Date(a[0])).slice(0, 5).map(([date, symps]) => (
                    symps.length > 0 && (
                      <div key={date} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 14px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10 }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text3)", width: 70, paddingTop: 2 }}>{new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, flex: 1 }}>
                          {symps.map(symId => {
                            const sym = COMMON_SYMPTOMS.find(s => s.id === symId);
                            return <span key={symId} style={{ ...S.badge("var(--text)", "var(--surface2)"), fontSize: 11, fontWeight: 600 }}>{sym?.icon} {sym?.label}</span>;
                          })}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Forecast */}
          {activeTab === "forecast" && (
            <div>
              <p style={S.sectionTitle}>Next 3 Cycles Forecast</p>
              {res.upcomingCycles.map((c, i) => (
                <div key={i} style={{ ...S.card("var(--surface2)", "var(--border)"), marginBottom: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "var(--brand)", marginBottom: 8 }}>Cycle {i + 1}</div>
                  {[
                    { label: "🔴 Period starts", value: c.period },
                    { label: "✨ Ovulation", value: c.ovulation },
                    { label: "💚 Fertile window", value: c.fertile },
                  ].map(row => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: "var(--text3)", fontWeight: 600 }}>{row.label}</span>
                      <span style={{ color: "var(--text)", fontWeight: 700 }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              ))}

              {res.variance > 0 && (
                <div style={{ ...S.card("#fffbeb", "#fde68a"), fontSize: 12, color: "#92400e" }}>
                  ⚠️ Due to cycle variability (±{Math.ceil(res.variance / 2)} days), actual dates may differ. Track your cycles for higher accuracy.
                </div>
              )}

              {/* Symptom awareness */}
              <p style={{ ...S.sectionTitle, marginTop: 16 }}>Expect This Week</p>
              {[
                { phase: "Menstrual", symptoms: "Cramps, fatigue, lower back pain, mood dips, headaches" },
                { phase: "Follicular", symptoms: "Improved energy, clearer skin, better mood, increased motivation" },
                { phase: "Ovulation", symptoms: "Peak energy, mild pelvic pain (Mittelschmerz), cervical mucus changes" },
                { phase: "Luteal", symptoms: "Bloating, breast tenderness, mood swings, cravings, fatigue near period" },
              ].find(p => p.phase === res.currentPhase) && (
                <div style={{ ...S.card(PHASE_BG[res.currentPhase], PHASE_COLORS[res.currentPhase] + "40"), fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}>
                  <strong style={{ color: PHASE_COLORS[res.currentPhase] }}>Likely symptoms this phase:</strong><br />
                  {[
                    { phase: "Menstrual", symptoms: "Cramps, fatigue, lower back pain, mood dips, headaches" },
                    { phase: "Follicular", symptoms: "Improved energy, clearer skin, better mood, increased motivation" },
                    { phase: "Ovulation", symptoms: "Peak energy, mild pelvic pain (Mittelschmerz), cervical mucus changes" },
                    { phase: "Luteal", symptoms: "Bloating, breast tenderness, mood swings, cravings, fatigue near period" },
                  ].find(p => p.phase === res.currentPhase)?.symptoms}
                </div>
              )}
            </div>
          )}

          {/* Tab: Health */}
          {activeTab === "health" && (
            <div>
              <p style={S.sectionTitle}>Health Signals</p>
              {res.flags.map((f, i) => (
                <div key={i} style={{
                  ...S.card(f.type === "good" ? "#f0fdf4" : f.type === "warn" ? "#fef2f2" : "#eff6ff",
                    f.type === "good" ? "#bbf7d0" : f.type === "warn" ? "#fecaca" : "#bfdbfe"),
                  display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8
                }}>
                  <span style={{ fontSize: 16 }}>{f.type === "good" ? "✅" : f.type === "warn" ? "⚠️" : "ℹ️"}</span>
                  <span style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>{f.msg}</span>
                </div>
              ))}

              {/* When to see a doctor */}
              <p style={{ ...S.sectionTitle, marginTop: 16 }}>When to Consult a Doctor</p>
              {[
                "Cycles shorter than 21 or longer than 40 days consistently",
                "Periods lasting more than 7 days",
                "Severe pain (dysmenorrhea) that affects daily life",
                "Sudden changes in cycle regularity",
                "Period is more than 2 weeks late",
                "Spotting between periods or after sex",
                "Heavy bleeding (soaking a pad/tampon every hour)",
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 12, color: "var(--text2)" }}>
                  <span style={{ color: "#ef4444", fontWeight: 700, flexShrink: 0 }}>→</span>
                  <span>{s}</span>
                </div>
              ))}

              {/* Educational cards */}
              <p style={{ ...S.sectionTitle, marginTop: 16 }}>Did You Know?</p>
              {[
                { title: "PCOS", body: "Polycystic Ovary Syndrome affects 1 in 10 women and often causes irregular, infrequent, or prolonged periods." },
                { title: "Endometriosis", body: "Tissue similar to uterine lining grows outside — causing severe cramps. It affects ~10% of reproductive-age women." },
                { title: "Cycle & Stress", body: "High cortisol from chronic stress can delay or suppress ovulation, extending or skipping cycles." },
                { title: "Iron Deficiency", body: "Heavy periods are a leading cause of iron-deficiency anemia in women of reproductive age." },
              ].map(card => (
                <div key={card.title} style={{ ...S.card("var(--surface2)", "var(--border)"), marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "var(--brand)", marginBottom: 4 }}>{card.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>{card.body}</div>
                </div>
              ))}

              <div style={{ marginTop: 16, padding: "12px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, fontSize: 11, color: "#7f1d1d", fontStyle: "italic", lineHeight: 1.6 }}>
                ⚠️ This calculator is for educational and planning purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
