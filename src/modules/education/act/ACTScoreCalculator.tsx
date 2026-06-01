import React, { useState, useEffect, useCallback } from 'react';

// ACT Composite Percentile Ranks (2024 National Norms)
const COMPOSITE_PERCENTILES: Record<number, number> = {
  36: 100, 35: 99, 34: 99, 33: 98, 32: 97, 31: 95,
  30: 93, 29: 90, 28: 87, 27: 84, 26: 80, 25: 77,
  24: 73, 23: 69, 22: 65, 21: 60, 20: 55, 19: 49,
  18: 44, 17: 38, 16: 30, 15: 22, 14: 14, 13: 8,
  12: 4,  11: 2,  10: 1,
};

// ACT College Readiness Benchmarks (official ACT)
const BENCHMARKS: { section: string; key: string; threshold: number; tip: string }[] = [
  {
    section: 'English',
    key: 'english',
    threshold: 18,
    tip: 'Study grammar rules, punctuation, and rhetorical skills. Practice ACT English passages with timed drills.',
  },
  {
    section: 'Mathematics',
    key: 'math',
    threshold: 22,
    tip: 'Focus on Algebra 2, geometry, and trigonometry. Review coordinate geometry and basic statistics.',
  },
  {
    section: 'Reading',
    key: 'reading',
    threshold: 22,
    tip: 'Practice active reading strategies, identifying main ideas, and interpreting evidence in complex passages.',
  },
  {
    section: 'Science',
    key: 'science',
    threshold: 23,
    tip: 'Improve data interpretation skills — read graphs, tables, and experiments critically under time pressure.',
  },
];

// University tier lookup by composite
function getTier(composite: number): { label: string; color: string; detail: string } {
  if (composite >= 34) return { label: '🏆 Elite / Ivy+', color: '#15803d', detail: '34–36 — MIT, Harvard, Princeton, Yale, Stanford' };
  if (composite >= 30) return { label: '⭐ Highly Selective', color: '#0284c7', detail: '30–33 — Top 25 Universities, Ivy-adjacent schools' };
  if (composite >= 26) return { label: '✅ Selective', color: '#7c3aed', detail: '26–29 — Strong state flagships, many top-50 schools' };
  if (composite >= 22) return { label: '📈 Above Average', color: '#d97706', detail: '22–25 — Competitive regional universities' };
  if (composite >= 18) return { label: '📊 Average', color: '#ea580c', detail: '18–21 — Many 4-year colleges within range' };
  return { label: '📚 Below Average', color: '#dc2626', detail: '<18 — Test prep strongly recommended before applying' };
}

// Rough ACT → SAT conversion (College Board concordance approximation)
function actToSAT(composite: number): number {
  // More accurate mapping using ACT-SAT concordance table approximation
  const concordance: Record<number, number> = {
    36: 1590, 35: 1560, 34: 1530, 33: 1500, 32: 1470, 31: 1450,
    30: 1420, 29: 1390, 28: 1360, 27: 1330, 26: 1300, 25: 1260,
    24: 1230, 23: 1200, 22: 1160, 21: 1120, 20: 1080, 19: 1050,
    18: 1010, 17:  970, 16:  930, 15:  880, 14:  830, 13:  780,
    12:  720, 11:  670, 10:  590,
  };
  return concordance[composite] ?? Math.round(composite * 45 + 400);
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

export function ACTScoreCalculator() {
  const [english, setEnglish]   = useState('28');
  const [math, setMath]         = useState('26');
  const [reading, setReading]   = useState('27');
  const [science, setScience]   = useState('25');
  const [writing, setWriting]   = useState('');
  const [showWriting, setShowWriting] = useState(false);

  const [result, setResult] = useState<any>(null);

  const inp: React.CSSProperties = {
    padding: '10px 14px',
    background: 'var(--surface2)',
    border: '1.5px solid var(--border)',
    borderRadius: 10,
    fontSize: 15,
    color: 'var(--text)',
    outline: 'none',
    width: '100%',
    fontWeight: 700,
    boxSizing: 'border-box',
  };

  const calc = useCallback(() => {
    const e = clamp(parseInt(english)  || 1, 1, 36);
    const m = clamp(parseInt(math)     || 1, 1, 36);
    const r = clamp(parseInt(reading)  || 1, 1, 36);
    const s = clamp(parseInt(science)  || 1, 1, 36);

    // Composite = average of 4 sections, rounded to nearest whole number
    const raw = (e + m + r + s) / 4;
    const composite = Math.round(raw);

    const percentile = COMPOSITE_PERCENTILES[composite] ?? 1;
    const tier = getTier(composite);
    const satEq = actToSAT(composite);

    const writingScore = showWriting && writing !== ''
      ? clamp(parseInt(writing) || 2, 2, 12)
      : null;

    // Benchmark pass/fail
    const benchmarkResults = BENCHMARKS.map(b => ({
      ...b,
      score: b.key === 'english' ? e : b.key === 'math' ? m : b.key === 'reading' ? r : s,
      pass: (b.key === 'english' ? e : b.key === 'math' ? m : b.key === 'reading' ? r : s) >= b.threshold,
    }));

    const weakSections = benchmarkResults.filter(b => !b.pass);

    setResult({ e, m, r, s, composite, percentile, tier, satEq, writingScore, benchmarkResults, weakSections });
  }, [english, math, reading, science, writing, showWriting]);

  useEffect(() => { calc(); }, [calc]);

  const sections = [
    { label: 'English',     val: english,  set: setEnglish  },
    { label: 'Mathematics', val: math,     set: setMath     },
    { label: 'Reading',     val: reading,  set: setReading  },
    { label: 'Science',     val: science,  set: setScience  },
  ];

  const sectionScores = result ? [result.e, result.m, result.r, result.s] : [0, 0, 0, 0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Section Score Inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {sections.map(({ label, val, set }, i) => (
          <div key={label} style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
              {label}
            </label>
            <input
              type="number"
              style={inp}
              value={val}
              min={1}
              max={36}
              onChange={e => set(e.target.value)}
            />
            <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 5, textAlign: 'center' }}>
              Scaled 1 – 36
              {result && (
                <span style={{ marginLeft: 6, color: sectionScores[i] >= BENCHMARKS[i].threshold ? '#15803d' : '#dc2626', fontWeight: 800 }}>
                  {sectionScores[i] >= BENCHMARKS[i].threshold ? '✓ Benchmark' : `✗ Need ${BENCHMARKS[i].threshold}+`}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Optional Writing Toggle */}
      <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showWriting ? 12 : 0 }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', margin: 0 }}>
            Writing Score (Optional)
          </p>
          <div style={{ display: 'flex', gap: 6, background: 'var(--surface2)', padding: 3, borderRadius: 9, border: '1px solid var(--border)' }}>
            {(['Include', 'Skip'] as const).map(opt => {
              const active = opt === 'Include' ? showWriting : !showWriting;
              return (
                <button
                  key={opt}
                  onClick={() => setShowWriting(opt === 'Include')}
                  style={{
                    flex: 1, padding: '6px 14px', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                    background: active ? 'var(--brand)' : 'transparent',
                    color: active ? '#fff' : 'var(--text3)', border: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
        {showWriting && (
          <>
            <input
              type="number"
              style={inp}
              value={writing}
              placeholder="Enter writing score (2–12)"
              min={2}
              max={12}
              onChange={e => setWriting(e.target.value)}
            />
            <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 5 }}>
              Writing is scored separately (2–12) and does not affect the composite.
            </div>
          </>
        )}
      </div>

      {/* Composite Score Result */}
      {result && (
        <>
          <div style={{
            padding: '28px',
            background: `linear-gradient(135deg, ${result.tier.color}22, ${result.tier.color}0a)`,
            border: `2px solid ${result.tier.color}55`,
            borderRadius: 18,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: result.tier.color, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>
              ACT Composite Score
            </div>
            <div style={{ fontSize: 72, fontWeight: 900, color: result.tier.color, lineHeight: 1, fontFamily: 'var(--font-display)' }}>
              {result.composite}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 6 }}>out of 36</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: result.tier.color, marginTop: 10 }}>
              {result.tier.label}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{result.tier.detail}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text3)', marginTop: 10 }}>
              Percentile Rank:{' '}
              <span style={{ color: result.tier.color, fontWeight: 900 }}>
                {result.percentile}th percentile
              </span>{' '}
              — better than {result.percentile}% of test takers
            </div>

            {/* Writing badge */}
            {result.writingScore !== null && (
              <div style={{
                display: 'inline-block', marginTop: 12,
                padding: '6px 18px',
                background: 'var(--surface2)', border: '1.5px solid var(--border)',
                borderRadius: 99, fontSize: 12, fontWeight: 800, color: 'var(--text2)',
              }}>
                ✍️ Writing Score: <span style={{ color: 'var(--brand)' }}>{result.writingScore}</span> / 12
              </div>
            )}
          </div>

          {/* Section Breakdown with progress bars */}
          <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 12 }}>
              Section Breakdown
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'English',     score: result.e, benchmark: 18 },
                { label: 'Mathematics', score: result.m, benchmark: 22 },
                { label: 'Reading',     score: result.r, benchmark: 22 },
                { label: 'Science',     score: result.s, benchmark: 23 },
              ].map(({ label, score, benchmark }) => {
                const pct = ((score - 1) / 35) * 100;
                const bpct = ((benchmark - 1) / 35) * 100;
                const color = score >= benchmark ? '#15803d' : '#dc2626';
                return (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)' }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 900, color }}>
                        {score}
                        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text3)', marginLeft: 5 }}>
                          / 36 (Benchmark: {benchmark}+)
                        </span>
                      </span>
                    </div>
                    <div style={{ position: 'relative', width: '100%', height: 8, background: 'var(--border)', borderRadius: 99, overflow: 'visible' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.3s' }} />
                      {/* Benchmark marker */}
                      <div style={{
                        position: 'absolute', top: -4, left: `${bpct}%`,
                        width: 2, height: 16, background: '#94a3b8', borderRadius: 2,
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* College Readiness Benchmarks */}
          <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 10 }}>
              ACT College Readiness Benchmarks
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {result.benchmarkResults.map((b: any, i: number) => (
                <div
                  key={b.section}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 12px',
                    background: b.pass ? '#f0fdf4' : '#fef2f2',
                    border: `1px solid ${b.pass ? '#bbf7d0' : '#fecaca'}`,
                    borderRadius: 10,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{b.section}</div>
                    <div style={{ fontSize: 10, color: 'var(--text3)' }}>Benchmark: {b.threshold}+ · Your Score: {b.score}</div>
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 800, padding: '3px 12px', borderRadius: 99,
                    background: b.pass ? '#dcfce7' : '#fecaca',
                    color: b.pass ? '#15803d' : '#dc2626',
                  }}>
                    {b.pass ? '✓ Met' : '✗ Not Met'}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 10 }}>
              Meeting the benchmark indicates ~50% chance of earning a B or better in related college coursework.
            </div>
          </div>

          {/* SAT Equivalent */}
          <div style={{
            padding: '14px 20px',
            background: 'linear-gradient(135deg, #818cf811, #6366f108)',
            border: '1.5px solid #818cf840',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', marginBottom: 4 }}>
                SAT Score Equivalent
              </div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>Based on ACT–SAT concordance table</div>
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#6366f1', fontFamily: 'var(--font-display)' }}>
              ~{result.satEq}
            </div>
          </div>

          {/* Improvement Suggestions */}
          {result.weakSections.length > 0 && (
            <div style={{
              padding: '14px',
              background: 'linear-gradient(135deg, var(--brand-l), var(--surface))',
              border: '1px solid var(--border)',
              borderRadius: 12,
            }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--brand)', textTransform: 'uppercase', marginBottom: 10 }}>
                💡 Improvement Suggestions
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {result.weakSections.map((b: any) => (
                  <div key={b.section} style={{
                    padding: '10px 12px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#dc2626', marginBottom: 4 }}>
                      {b.section} — {b.score} / 36 (Need {b.threshold - b.score} more points)
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.5 }}>{b.tip}</div>
                  </div>
                ))}
                <div style={{ padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--brand)', marginBottom: 4 }}>
                    General Test Strategy
                  </div>
                  <ul style={{ fontSize: 11, color: 'var(--text2)', paddingLeft: 16, margin: 0, display: 'flex', flexDirection: 'column', gap: 4, lineHeight: 1.5 }}>
                    <li>Take 3–5 full-length official ACT practice tests under timed conditions.</li>
                    <li>Review every wrong answer and identify patterns in your mistakes.</li>
                    <li>Use ACT Academy (free) or The Official ACT Prep Guide.</li>
                    <li>Target 6–8 weeks of structured prep before a retake.</li>
                    <li>Composite typically improves 2–4 points with focused preparation.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
