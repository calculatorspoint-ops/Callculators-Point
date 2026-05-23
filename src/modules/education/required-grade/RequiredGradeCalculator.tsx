import React, { useState, useEffect, useCallback } from 'react';

interface Assignment {
  id: number;
  name: string;
  weight: string;
  score: string;
  maxScore: string;
}

type GradingScale = 'us' | 'uk' | 'german' | 'percentage';

const GRADING_SCALES: Record<GradingScale, { label: string; grades: { min: number; grade: string; color: string }[] }> = {
  us: {
    label: 'US Letter Grade',
    grades: [
      { min: 93, grade: 'A', color: '#15803d' }, { min: 90, grade: 'A-', color: '#16a34a' },
      { min: 87, grade: 'B+', color: '#0284c7' }, { min: 83, grade: 'B', color: '#2563eb' },
      { min: 80, grade: 'B-', color: '#7c3aed' }, { min: 77, grade: 'C+', color: '#d97706' },
      { min: 73, grade: 'C', color: '#ea580c' }, { min: 70, grade: 'C-', color: '#dc2626' },
      { min: 67, grade: 'D+', color: '#b91c1c' }, { min: 60, grade: 'D', color: '#991b1b' },
      { min: 0, grade: 'F', color: '#7f1d1d' },
    ],
  },
  uk: {
    label: 'UK Classification',
    grades: [
      { min: 70, grade: 'First (1st)', color: '#15803d' }, { min: 60, grade: 'Upper Second (2:1)', color: '#0284c7' },
      { min: 50, grade: 'Lower Second (2:2)', color: '#7c3aed' }, { min: 40, grade: 'Third (3rd)', color: '#d97706' },
      { min: 0, grade: 'Fail', color: '#dc2626' },
    ],
  },
  german: {
    label: 'German Grade (1–6)',
    grades: [
      { min: 90, grade: '1 (Sehr Gut)', color: '#15803d' }, { min: 75, grade: '2 (Gut)', color: '#0284c7' },
      { min: 60, grade: '3 (Befriedigend)', color: '#7c3aed' }, { min: 50, grade: '4 (Ausreichend)', color: '#d97706' },
      { min: 25, grade: '5 (Mangelhaft)', color: '#ea580c' }, { min: 0, grade: '6 (Ungenügend)', color: '#dc2626' },
    ],
  },
  percentage: {
    label: 'Percentage Only',
    grades: [
      { min: 90, grade: 'Distinction', color: '#15803d' }, { min: 75, grade: 'Merit', color: '#0284c7' },
      { min: 60, grade: 'Pass', color: '#7c3aed' }, { min: 0, grade: 'Fail', color: '#dc2626' },
    ],
  },
};

function getGrade(pct: number, scale: GradingScale) {
  const grades = GRADING_SCALES[scale].grades;
  return grades.find(g => pct >= g.min) ?? grades[grades.length - 1];
}

export function RequiredGradeCalculator() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: 1, name: 'Assignment 1', weight: '20', score: '85', maxScore: '100' },
    { id: 2, name: 'Midterm Exam', weight: '30', score: '78', maxScore: '100' },
    { id: 3, name: 'Final Exam', weight: '50', score: '', maxScore: '100' },
  ]);
  const [targetGrade, setTargetGrade] = useState('80');
  const [scale, setScale] = useState<GradingScale>('us');
  const [result, setResult] = useState<any>(null);

  const add = () => setAssignments(prev => [...prev, { id: Date.now(), name: `Assignment ${prev.length + 1}`, weight: '10', score: '', maxScore: '100' }]);
  const remove = (id: number) => setAssignments(prev => prev.filter(a => a.id !== id));
  const update = (id: number, f: keyof Assignment, v: string) => setAssignments(prev => prev.map(a => a.id === id ? { ...a, [f]: v } : a));

  const calc = useCallback(() => {
    const totalWeight = assignments.reduce((s, a) => s + (parseFloat(a.weight) || 0), 0);
    if (Math.abs(totalWeight - 100) > 0.5 && totalWeight !== 0) {
      // Non-100% weights: normalize
    }

    const completed = assignments.filter(a => a.score !== '' && !isNaN(parseFloat(a.score)));
    const pending = assignments.filter(a => a.score === '' || isNaN(parseFloat(a.score)));

    const earnedPts = completed.reduce((s, a) => {
      const w = parseFloat(a.weight) || 0;
      const sc = parseFloat(a.score) || 0;
      const max = parseFloat(a.maxScore) || 100;
      return s + (sc / max) * w;
    }, 0);

    const completedWeight = completed.reduce((s, a) => s + (parseFloat(a.weight) || 0), 0);
    const pendingWeight = pending.reduce((s, a) => s + (parseFloat(a.weight) || 0), 0);
    const target = parseFloat(targetGrade);

    // If all completed
    if (pendingWeight === 0) {
      const finalPct = totalWeight > 0 ? (earnedPts / totalWeight) * 100 : 0;
      const grade = getGrade(finalPct, scale);
      setResult({ type: 'complete', finalPct, grade, completed: completed.length, earnedPts, totalWeight });
      return;
    }

    // Required on pending: (target * totalWeight/100 - earnedPts) / pendingWeight * 100
    const adjustedTarget = isNaN(target) ? 80 : target;
    const requiredPoints = (adjustedTarget * totalWeight / 100) - earnedPts;
    const requiredPct = pendingWeight > 0 ? (requiredPoints / pendingWeight) * 100 : 0;
    const feasible = requiredPct <= 100 && requiredPct >= 0;
    const currentPct = completedWeight > 0 ? (earnedPts / completedWeight) * 100 : 0;
    const grade = getGrade(requiredPct, scale);
    const worstCase = (earnedPts / totalWeight) * 100; // if all pending are 0
    const bestCase = ((earnedPts + pendingWeight) / totalWeight) * 100; // if all pending are 100%
    const worstGrade = getGrade(worstCase, scale);
    const bestGrade = getGrade(bestCase, scale);

    setResult({
      type: 'pending', requiredPct, feasible, currentPct, grade,
      completed: completed.length, pending: pending.length,
      completedWeight, pendingWeight, earnedPts, totalWeight,
      worstCase, bestCase, worstGrade, bestGrade, adjustedTarget,
      assignments: assignments.map(a => ({
        ...a,
        w: parseFloat(a.weight) || 0,
        sc: a.score !== '' ? (parseFloat(a.score) / (parseFloat(a.maxScore) || 100)) * 100 : null,
        contribution: a.score !== '' ? ((parseFloat(a.score) || 0) / (parseFloat(a.maxScore) || 100)) * (parseFloat(a.weight) || 0) : 0,
      })),
    });
  }, [assignments, targetGrade, scale]);

  useEffect(() => { const t = setTimeout(calc, 150); return () => clearTimeout(t); }, [calc]);

  const inp = { padding: '7px 10px', background: 'var(--surface2)', border: '1.5px solid var(--border)', borderRadius: 7, fontSize: 13, color: 'var(--text)', outline: 'none', width: '100%' } as React.CSSProperties;
  const sel = { ...inp, cursor: 'pointer', appearance: 'none' as const };

  const totalW = assignments.reduce((s, a) => s + (parseFloat(a.weight) || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Settings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', display: 'block', marginBottom: 5, textTransform: 'uppercase' }}>Target Grade (%)</label>
          <input type="number" style={{ ...inp, fontSize: 16, fontWeight: 800, color: 'var(--brand)', textAlign: 'center' }} value={targetGrade} onChange={e => setTargetGrade(e.target.value)} min={0} max={100} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', display: 'block', marginBottom: 5, textTransform: 'uppercase' }}>Grading Scale</label>
          <select style={sel} value={scale} onChange={e => setScale(e.target.value as GradingScale)}>
            {(Object.keys(GRADING_SCALES) as GradingScale[]).map(k => (
              <option key={k} value={k}>{GRADING_SCALES[k].label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Weight indicator */}
      {totalW !== 100 && (
        <div style={{ padding: '8px 12px', background: totalW > 100 ? '#fef2f2' : '#fef3c7', border: `1px solid ${totalW > 100 ? '#fca5a5' : '#fde68a'}`, borderRadius: 8, fontSize: 12, fontWeight: 700, color: totalW > 100 ? '#dc2626' : '#b45309' }}>
          ⚠ Total weight = {totalW}% {totalW > 100 ? '(exceeds 100%)' : '(less than 100%)'}. Adjust weights to equal 100%.
        </div>
      )}

      {/* Assignments table */}
      <div style={{ border: '1.5px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 0, padding: '8px 12px', background: 'linear-gradient(135deg,#c2410c,#9a3412)' }}>
          {['Component', 'Weight %', 'Score', 'Max', ''].map(h => (
            <span key={h} style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.7)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</span>
          ))}
        </div>
        {assignments.map(a => (
          <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 6, padding: '9px 12px', borderBottom: '1px solid var(--border)', alignItems: 'center', background: a.score === '' ? 'linear-gradient(to right, var(--surface), var(--brand-l))' : 'var(--surface)' }}>
            <input style={inp} value={a.name} onChange={e => update(a.id, 'name', e.target.value)} placeholder="Component" />
            <input type="number" style={{ ...inp, textAlign: 'center' }} value={a.weight} onChange={e => update(a.id, 'weight', e.target.value)} min={0} max={100} />
            <input type="number" style={{ ...inp, textAlign: 'center', borderColor: a.score === '' ? 'var(--brand)' : 'var(--border)' }} value={a.score} onChange={e => update(a.id, 'score', e.target.value)} placeholder="TBD" min={0} />
            <input type="number" style={{ ...inp, textAlign: 'center' }} value={a.maxScore} onChange={e => update(a.id, 'maxScore', e.target.value)} min={1} />
            <button onClick={() => remove(a.id)} style={{ color: '#ef4444', fontSize: 14, padding: '4px 6px', background: 'transparent', border: 'none', cursor: 'pointer' }}>✕</button>
          </div>
        ))}
        <button onClick={add} style={{ width: '100%', padding: '10px', fontSize: 12, fontWeight: 700, color: 'var(--brand)', background: 'var(--surface2)', border: 'none', borderTop: '1px solid var(--border)', cursor: 'pointer' }}>
          + Add Component
        </button>
      </div>

      {/* Results */}
      {result && result.type === 'pending' && (
        <>
          <div style={{ padding: '24px', background: result.feasible ? `linear-gradient(135deg, ${result.grade.color}22, ${result.grade.color}0a)` : '#fef2f2', border: `2px solid ${result.feasible ? result.grade.color + '55' : '#fca5a5'}`, borderRadius: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: result.feasible ? result.grade.color : '#dc2626', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>
              {result.feasible ? `Score Needed on Remaining ${result.pending} Component(s)` : 'Target Not Achievable'}
            </div>
            <div style={{ fontSize: 60, fontWeight: 900, color: result.feasible ? result.grade.color : '#dc2626', lineHeight: 1 }}>
              {result.feasible ? `${result.requiredPct.toFixed(1)}%` : `${result.requiredPct.toFixed(0)}%`}
            </div>
            {result.feasible ? (
              <div style={{ fontSize: 13, fontWeight: 700, color: result.grade.color, marginTop: 8 }}>
                ≈ {result.grade.grade} on pending work to achieve {result.adjustedTarget}% overall
              </div>
            ) : (
              <div style={{ fontSize: 12, color: '#dc2626', marginTop: 8 }}>
                Even a perfect score on remaining work reaches only {result.bestCase.toFixed(1)}%
              </div>
            )}
          </div>

          {/* Scenario analysis */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', marginBottom: 4 }}>Worst Case (0% pending)</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#dc2626' }}>{result.worstCase.toFixed(1)}%</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#dc2626' }}>{result.worstGrade.grade}</div>
            </div>
            <div style={{ padding: '12px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#15803d', textTransform: 'uppercase', marginBottom: 4 }}>Best Case (100% pending)</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#15803d' }}>{result.bestCase.toFixed(1)}%</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#15803d' }}>{result.bestGrade.grade}</div>
            </div>
          </div>

          {/* Assignment breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase' }}>Component Contributions</p>
            {result.assignments.map((a: any, i: number) => {
              
              return (
                <div key={i} style={{ padding: '10px 12px', background: a.sc === null ? 'linear-gradient(to right,var(--surface),var(--brand-l))' : 'var(--surface)', border: '1px solid var(--border)', borderRadius: 9 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: a.sc !== null ? 6 : 0 }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{a.name}</span>
                      <span style={{ fontSize: 10, color: 'var(--text3)', marginLeft: 6 }}>Weight: {a.w}%</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {a.sc !== null ? (
                        <><span style={{ fontSize: 14, fontWeight: 800, color: getGrade(a.sc, scale).color }}>{a.sc.toFixed(1)}%</span>
                        <span style={{ fontSize: 10, color: 'var(--text3)', display: 'block' }}>+{a.contribution.toFixed(2)} pts</span></>
                      ) : (
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand)', background: 'var(--brand-l)', padding: '2px 8px', borderRadius: 99 }}>Pending</span>
                      )}
                    </div>
                  </div>
                  {a.sc !== null && (
                    <div style={{ width: '100%', height: 4, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(a.sc, 100)}%`, height: '100%', background: getGrade(a.sc, scale).color, borderRadius: 99 }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {result && result.type === 'complete' && (
        <div style={{ padding: '24px', background: `${result.grade.color}22`, border: `2px solid ${result.grade.color}55`, borderRadius: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: result.grade.color, textTransform: 'uppercase', marginBottom: 6 }}>Final Grade</div>
          <div style={{ fontSize: 60, fontWeight: 900, color: result.grade.color, lineHeight: 1 }}>{result.finalPct.toFixed(1)}%</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: result.grade.color, marginTop: 8 }}>{result.grade.grade}</div>
        </div>
      )}
    </div>
  );
}
