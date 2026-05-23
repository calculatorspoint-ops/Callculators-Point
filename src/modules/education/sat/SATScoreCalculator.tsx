import React, { useState, useEffect, useCallback } from 'react';

// SAT scoring scales (Digital SAT 2024 format)
// Each section: 200–800, total: 400–1600
// Approximate percentile data from College Board
const PERCENTILES: { score: number; pct: number }[] = [
  { score: 1600, pct: 99 }, { score: 1550, pct: 99 }, { score: 1500, pct: 98 },
  { score: 1450, pct: 96 }, { score: 1400, pct: 94 }, { score: 1350, pct: 91 },
  { score: 1300, pct: 87 }, { score: 1250, pct: 81 }, { score: 1200, pct: 74 },
  { score: 1150, pct: 66 }, { score: 1100, pct: 57 }, { score: 1050, pct: 48 },
  { score: 1000, pct: 40 }, { score: 950, pct: 32 }, { score: 900, pct: 24 },
  { score: 850, pct: 17 }, { score: 800, pct: 11 }, { score: 750, pct: 6 },
  { score: 700, pct: 3 }, { score: 650, pct: 2 }, { score: 600, pct: 1 }, { score: 400, pct: 1 },
];

const UNIVERSITIES: { name: string; avg: number; min: number }[] = [
  { name: 'MIT / Harvard / Stanford', avg: 1545, min: 1500 },
  { name: 'Ivy League', avg: 1500, min: 1460 },
  { name: 'Top 25 Universities', avg: 1420, min: 1360 },
  { name: 'Top 50 Universities', avg: 1350, min: 1270 },
  { name: 'Top 100 Universities', avg: 1250, min: 1180 },
  { name: 'State Universities', avg: 1100, min: 980 },
  { name: 'Community College', avg: 900, min: 400 },
];

function getPercentile(score: number): number {
  for (const { score: s, pct } of PERCENTILES) {
    if (score >= s) return pct;
  }
  return 1;
}

function getCompetivenessLabel(score: number): { label: string; color: string } {
  if (score >= 1500) return { label: '🏆 Top 2% — Elite Tier', color: '#15803d' };
  if (score >= 1400) return { label: '⭐ Top 6% — Highly Competitive', color: '#0284c7' };
  if (score >= 1300) return { label: '✅ Top 13% — Competitive', color: '#7c3aed' };
  if (score >= 1200) return { label: '📈 Top 26% — Above Average', color: '#d97706' };
  if (score >= 1000) return { label: '📊 Average Range', color: '#ea580c' };
  return { label: '📚 Below Average — Retake Recommended', color: '#dc2626' };
}

// Digital SAT section score (200–800) conversion from number correct
// Approximate (actual uses adaptive difficulty scoring)
function rawToSection(correct: number, total: number): number {
  if (total <= 0) return 200;
  const ratio = correct / total;
  return Math.round(200 + ratio * 600);
}

export function SATScoreCalculator() {
  const [mode] = useState<'section' | 'total'>('section');
  const [inputType, setInputType] = useState<'raw' | 'scaled'>('scaled');

  // Section scores (scaled 200-800)
  const [mathScore, setMathScore] = useState('720');
  const [rwScore, setRwScore] = useState('680');

  // Raw scores
  const [mathCorrect, setMathCorrect] = useState('40');
  const [mathTotal, setMathTotal] = useState('44');
  const [rwCorrect, setRwCorrect] = useState('43');
  const [rwTotal, setRwTotal] = useState('54');

  const [result, setResult] = useState<any>(null);

  const calc = useCallback(() => {
    let math: number, rw: number;
    if (inputType === 'raw') {
      math = Math.min(800, Math.max(200, rawToSection(parseInt(mathCorrect) || 0, parseInt(mathTotal) || 44)));
      rw = Math.min(800, Math.max(200, rawToSection(parseInt(rwCorrect) || 0, parseInt(rwTotal) || 54)));
    } else {
      math = Math.min(800, Math.max(200, parseInt(mathScore) || 0));
      rw = Math.min(800, Math.max(200, parseInt(rwScore) || 0));
    }
    const total = math + rw;
    const pct = getPercentile(total);
    const comp = getCompetivenessLabel(total);
    setResult({ math, rw, total, pct, ...comp });
  }, [mode, inputType, mathScore, rwScore, mathCorrect, mathTotal, rwCorrect, rwTotal]);

  useEffect(() => { calc(); }, [calc]);

  const inp = { padding: '10px 14px', background: 'var(--surface2)', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 15, color: 'var(--text)', outline: 'none', width: '100%', fontWeight: 700 } as React.CSSProperties;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Input type toggle */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 6 }}>Input Method</p>
        <div style={{ display: 'flex', gap: 6, background: 'var(--surface2)', padding: 3, borderRadius: 9, border: '1px solid var(--border)' }}>
          {([['scaled', 'Scaled Score (200–800)'], ['raw', 'Raw Score (# Correct)']] as const).map(([v, l]) => (
            <button key={v} onClick={() => setInputType(v)}
              style={{ flex: 1, padding: '8px', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                background: inputType === v ? 'var(--brand)' : 'transparent',
                color: inputType === v ? '#fff' : 'var(--text3)', border: 'none' }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      {inputType === 'scaled' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ padding: '14px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Math Score</label>
            <input type="number" style={inp} value={mathScore} onChange={e => setMathScore(e.target.value)} min={200} max={800} step={10} />
            <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 5, textAlign: 'center' }}>200 – 800</div>
          </div>
          <div style={{ padding: '14px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Reading & Writing</label>
            <input type="number" style={inp} value={rwScore} onChange={e => setRwScore(e.target.value)} min={200} max={800} step={10} />
            <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 5, textAlign: 'center' }}>200 – 800</div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Math', correct: mathCorrect, total: mathTotal, setC: setMathCorrect, setT: setMathTotal, def: 44 },
            { label: 'Reading & Writing', correct: rwCorrect, total: rwTotal, setC: setRwCorrect, setT: setRwTotal, def: 54 },
          ].map(({ label, correct, total, setC, setT, def }) => (
            <div key={label} style={{ padding: '14px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>{label}</label>
              <input type="number" style={{ ...inp, marginBottom: 6 }} value={correct} onChange={e => setC(e.target.value)} placeholder="Correct" min={0} />
              <input type="number" style={inp} value={total} onChange={e => setT(e.target.value)} placeholder={`Total (${def})`} min={1} />
              {result && <div style={{ fontSize: 11, color: 'var(--brand)', marginTop: 6, fontWeight: 700, textAlign: 'center' }}>
                Scaled: {label === 'Math' ? result.math : result.rw}
              </div>}
            </div>
          ))}
        </div>
      )}

      {/* Total Score Result */}
      {result && (
        <>
          <div style={{ padding: '28px', background: `linear-gradient(135deg, ${result.color}22, ${result.color}0a)`, border: `2px solid ${result.color}55`, borderRadius: 18, textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: result.color, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>SAT Total Score</div>
            <div style={{ fontSize: 72, fontWeight: 900, color: result.color, lineHeight: 1, fontFamily: 'var(--font-display)' }}>{result.total}</div>
            <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 8 }}>out of 1600</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: result.color, marginTop: 10 }}>{result.label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text3)', marginTop: 6 }}>
              Percentile Rank: <span style={{ color: result.color, fontWeight: 900 }}>Top {100 - result.pct + 1}%</span> (better than {result.pct}% of test takers)
            </div>
          </div>

          {/* Section breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[['Math', result.math], ['Reading & Writing', result.rw]].map(([k, v]) => (
              <div key={k as string} style={{ padding: '12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 4 }}>{k}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--brand)' }}>{v}</div>
                <div style={{ width: '100%', height: 5, background: 'var(--border)', borderRadius: 99, marginTop: 8, overflow: 'hidden' }}>
                  <div style={{ width: `${((v as number - 200) / 600) * 100}%`, height: '100%', background: 'var(--brand)', borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>

          {/* University comparison */}
          <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 10 }}>University Competitiveness</p>
            {UNIVERSITIES.map((u, i) => {
              const meets = result.total >= u.min;
              const isAvg = result.total >= u.avg;
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < UNIVERSITIES.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{u.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--text3)' }}>Avg: {u.avg} | Min: {u.min}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                    {isAvg && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: '#dbeafe', color: '#1d4ed8' }}>Above Avg</span>}
                    <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 99, background: meets ? '#dcfce7' : '#fef2f2', color: meets ? '#15803d' : '#dc2626' }}>
                      {meets ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Improvement tips */}
          {result.total < 1400 && (
            <div style={{ padding: '14px', background: 'linear-gradient(135deg, var(--brand-l), var(--surface))', border: '1px solid var(--border)', borderRadius: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--brand)', textTransform: 'uppercase', marginBottom: 8 }}>💡 Score Improvement Strategy</p>
              <ul style={{ fontSize: 12, color: 'var(--text2)', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 5 }}>
                {result.math < 650 && <li>Math: Focus on Algebra, Advanced Math (Heart of Algebra), and Problem Solving</li>}
                {result.rw < 650 && <li>Reading & Writing: Practice Command of Evidence, Words in Context, and Expression of Ideas</li>}
                <li>Take 3+ full practice tests under timed conditions</li>
                <li>Bluebook app: Review every wrong answer with detailed explanations</li>
                <li>Target 50+ point improvement per retake with 6–8 weeks preparation</li>
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
