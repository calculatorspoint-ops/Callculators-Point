import React, { useState, useEffect, useCallback } from 'react';

// TOEFL iBT scoring: each section 0–30, total 0–120
// University eligibility thresholds
const UNIVERSITIES: { name: string; min: number; icon: string }[] = [
  { name: 'Top Research Universities (MIT / Harvard / Stanford)', min: 110, icon: '🏛️' },
  { name: 'Ivy League / Top 25', min: 105, icon: '🎓' },
  { name: 'Top 50 Universities', min: 100, icon: '⭐' },
  { name: 'Top 100 Universities', min: 90, icon: '📚' },
  { name: 'Most US / UK Universities', min: 80, icon: '🌍' },
  { name: 'Community College / Pathway Programs', min: 60, icon: '🏫' },
];

// TOEFL → IELTS approximate equivalents
const IELTS_MAP: { toefl: number; ielts: number }[] = [
  { toefl: 120, ielts: 9.0 },
  { toefl: 115, ielts: 8.5 },
  { toefl: 110, ielts: 8.0 },
  { toefl: 102, ielts: 7.5 },
  { toefl: 94,  ielts: 7.0 },
  { toefl: 83,  ielts: 6.5 },
  { toefl: 72,  ielts: 6.0 },
  { toefl: 60,  ielts: 5.5 },
  { toefl: 46,  ielts: 5.0 },
];

function getIELTS(total: number): number {
  for (const { toefl, ielts } of IELTS_MAP) {
    if (total >= toefl) return ielts;
  }
  return 4.5;
}

function getScoreLevel(total: number): { label: string; color: string } {
  if (total >= 110) return { label: '🏆 Advanced', color: '#15803d' };
  if (total >= 90)  return { label: '⭐ High Intermediate', color: '#0284c7' };
  if (total >= 60)  return { label: '📈 Intermediate', color: '#7c3aed' };
  if (total >= 40)  return { label: '📊 Low Intermediate', color: '#d97706' };
  return { label: '📚 Basic', color: '#dc2626' };
}

function getSectionColor(score: number): string {
  if (score >= 26) return '#15803d';
  if (score >= 22) return '#0284c7';
  if (score >= 18) return '#7c3aed';
  if (score >= 14) return '#d97706';
  return '#dc2626';
}

type Section = { label: string; key: string; emoji: string };
const SECTIONS: Section[] = [
  { label: 'Reading',   key: 'reading',   emoji: '📖' },
  { label: 'Listening', key: 'listening', emoji: '🎧' },
  { label: 'Speaking',  key: 'speaking',  emoji: '🗣️' },
  { label: 'Writing',   key: 'writing',   emoji: '✍️' },
];

type Scores = { reading: string; listening: string; speaking: string; writing: string };
type MyBestScores = Scores;

export function TOEFLScoreCalculator() {
  const [mode, setMode] = useState<'ibt' | 'mybest'>('ibt');

  // iBT single-attempt scores
  const [scores, setScores] = useState<Scores>({
    reading: '24', listening: '23', speaking: '22', writing: '24',
  });

  // MyBest (SuperScore) — best from multiple attempts
  const [myBest, setMyBest] = useState<MyBestScores>({
    reading: '27', listening: '26', speaking: '24', writing: '26',
  });

  const [result, setResult] = useState<any>(null);

  const calc = useCallback(() => {
    const src = mode === 'ibt' ? scores : myBest;
    const r = Math.min(30, Math.max(0, parseInt(src.reading)   || 0));
    const l = Math.min(30, Math.max(0, parseInt(src.listening) || 0));
    const s = Math.min(30, Math.max(0, parseInt(src.speaking)  || 0));
    const w = Math.min(30, Math.max(0, parseInt(src.writing)   || 0));
    const total = r + l + s + w;
    const { label, color } = getScoreLevel(total);
    const ielts = getIELTS(total);
    const sectionScores = { reading: r, listening: l, speaking: s, writing: w };
    setResult({ total, label, color, ielts, sectionScores });
  }, [mode, scores, myBest]);

  useEffect(() => { calc(); }, [calc]);

  const inp: React.CSSProperties = {
    padding: '10px 14px', background: 'var(--surface2)', border: '1.5px solid var(--border)',
    borderRadius: 10, fontSize: 15, color: 'var(--text)', outline: 'none',
    width: '100%', fontWeight: 700,
  };

  const currentScores = mode === 'ibt' ? scores : myBest;
  const setCurrentScores = mode === 'ibt' ? setScores : setMyBest;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Mode Toggle */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 6 }}>
          Score Mode
        </p>
        <div style={{ display: 'flex', gap: 6, background: 'var(--surface2)', padding: 3, borderRadius: 9, border: '1px solid var(--border)' }}>
          {([['ibt', '📝 Single iBT Attempt'], ['mybest', '🌟 MyBest™ Score']] as const).map(([v, l]) => (
            <button key={v} onClick={() => setMode(v)}
              style={{
                flex: 1, padding: '8px', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                background: mode === v ? 'var(--brand)' : 'transparent',
                color: mode === v ? '#fff' : 'var(--text3)', border: 'none',
              }}>
              {l}
            </button>
          ))}
        </div>
        {mode === 'mybest' && (
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 6, padding: '8px 12px', background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)' }}>
            💡 <strong>MyBest™</strong> combines your highest section scores across all valid TOEFL iBT attempts. Accepted by many universities worldwide.
          </div>
        )}
      </div>

      {/* Section Score Inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {SECTIONS.map(({ label, key, emoji }) => {
          const val = currentScores[key as keyof Scores];
          const numVal = Math.min(30, Math.max(0, parseInt(val) || 0));
          const color = getSectionColor(numVal);
          return (
            <div key={key} style={{ padding: '14px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
                {emoji} {label}
              </label>
              <input
                type="number" min={0} max={30} step={1} style={inp}
                value={val}
                onChange={e => setCurrentScores(prev => ({ ...prev, [key]: e.target.value }))}
              />
              <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 5, display: 'flex', justifyContent: 'space-between' }}>
                <span>0 – 30</span>
                {numVal >= 26
                  ? <span style={{ color: '#15803d', fontWeight: 700 }}>✓ Strong</span>
                  : <span>Need {26 - numVal} more for strong</span>}
              </div>
              {/* Mini progress bar */}
              <div style={{ width: '100%', height: 4, background: 'var(--border)', borderRadius: 99, marginTop: 6, overflow: 'hidden' }}>
                <div style={{ width: `${(numVal / 30) * 100}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.3s ease' }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Score Result */}
      {result && (
        <>
          <div style={{
            padding: '28px', borderRadius: 18, textAlign: 'center',
            background: `linear-gradient(135deg, ${result.color}22, ${result.color}0a)`,
            border: `2px solid ${result.color}55`,
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: result.color, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>
              TOEFL iBT {mode === 'mybest' ? 'MyBest™ ' : ''}Total Score
            </div>
            <div style={{ fontSize: 72, fontWeight: 900, color: result.color, lineHeight: 1, fontFamily: 'var(--font-display)' }}>
              {result.total}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 8 }}>out of 120</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: result.color, marginTop: 10 }}>
              {result.label}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text3)', marginTop: 8, padding: '8px 16px', background: `${result.color}11`, borderRadius: 8, display: 'inline-block' }}>
              ≈ IELTS <span style={{ color: result.color, fontWeight: 900, fontSize: 16 }}>{result.ielts.toFixed(1)}</span>
            </div>
          </div>

          {/* Section Breakdown */}
          <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 12 }}>
              Section Breakdown
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SECTIONS.map(({ label, key, emoji }) => {
                const score = result.sectionScores[key];
                const color = getSectionColor(score);
                const pct = (score / 30) * 100;
                return (
                  <div key={key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{emoji} {label}</span>
                      <span style={{ fontSize: 14, fontWeight: 900, color }}>
                        {score}<span style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 600 }}>/30</span>
                      </span>
                    </div>
                    <div style={{ width: '100%', height: 8, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.4s ease' }} />
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 3, textAlign: 'right' }}>
                      {score >= 26 ? '🟢 Strong' : score >= 22 ? '🔵 Good' : score >= 18 ? '🟣 Average' : score >= 14 ? '🟡 Below Avg' : '🔴 Needs Work'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* University Eligibility */}
          <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 10 }}>
              University Eligibility
            </p>
            {UNIVERSITIES.map((u, i) => {
              const eligible = result.total >= u.min;
              return (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '9px 0',
                  borderBottom: i < UNIVERSITIES.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>
                      {u.icon} {u.name}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>Min score: {u.min}+</div>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 99, whiteSpace: 'nowrap',
                    background: eligible ? '#dcfce7' : '#fef2f2',
                    color: eligible ? '#15803d' : '#dc2626',
                  }}>
                    {eligible ? '✓ Eligible' : '✗ Below'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* IELTS Conversion Table */}
          <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 10 }}>
              TOEFL → IELTS Equivalency
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {IELTS_MAP.map(({ toefl, ielts }) => {
                const isActive = result.total >= toefl && (
                  IELTS_MAP.indexOf(IELTS_MAP.find(x => x.toefl === toefl)!) === IELTS_MAP.length - 1
                    ? true
                    : result.total < IELTS_MAP[IELTS_MAP.indexOf(IELTS_MAP.find(x => x.toefl === toefl)!) - 1].toefl
                );
                return (
                  <div key={toefl} style={{
                    padding: '8px', borderRadius: 8, textAlign: 'center',
                    background: isActive ? `${result.color}22` : 'var(--surface2)',
                    border: isActive ? `1.5px solid ${result.color}66` : '1px solid var(--border)',
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 900, color: isActive ? result.color : 'var(--text)' }}>{toefl}+</div>
                    <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 700 }}>IELTS {ielts.toFixed(1)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tips Panel */}
          <div style={{ padding: '14px', background: 'linear-gradient(135deg, var(--brand-l), var(--surface))', border: '1px solid var(--border)', borderRadius: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--brand)', textTransform: 'uppercase', marginBottom: 8 }}>
              💡 Score Tips
            </p>
            <ul style={{ fontSize: 12, color: 'var(--text2)', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6, margin: 0 }}>
              <li>Score <strong>26+</strong> in each section signals strong English proficiency for top universities.</li>
              {result.sectionScores.reading < 26 && <li>📖 <strong>Reading:</strong> Practice academic texts and vocabulary in context.</li>}
              {result.sectionScores.listening < 26 && <li>🎧 <strong>Listening:</strong> Listen to TED Talks, podcasts, and academic lectures daily.</li>}
              {result.sectionScores.speaking < 26 && <li>🗣️ <strong>Speaking:</strong> Practice with timed responses (Integrated & Independent tasks).</li>}
              {result.sectionScores.writing < 26 && <li>✍️ <strong>Writing:</strong> Focus on essay structure, coherence, and academic vocabulary.</li>}
              {result.total < 105 && <li>📅 Consider retaking the TOEFL — most universities accept your best score.</li>}
              {mode === 'ibt' && <li>🌟 Use <strong>MyBest™ mode</strong> to see your super-score from multiple attempts.</li>}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
