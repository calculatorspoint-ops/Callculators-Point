import React, { useState, useEffect, useCallback } from 'react';

interface FutureSemester {
  id: number;
  credits: string;
  targetGrade: string;
}

const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0
};

function getStatus(gpa: number): { label: string; color: string; bg: string } {
  if (gpa >= 3.9) return { label: "🏆 Summa Cum Laude Territory", color: '#15803d', bg: '#dcfce7' };
  if (gpa >= 3.7) return { label: "🌟 Magna Cum Laude", color: '#0284c7', bg: '#dbeafe' };
  if (gpa >= 3.5) return { label: "⭐ Cum Laude", color: '#7c3aed', bg: '#ede9fe' };
  if (gpa >= 3.0) return { label: "✅ Dean's List (Most Schools)", color: '#d97706', bg: '#fef3c7' };
  if (gpa >= 2.0) return { label: "📊 Good Academic Standing", color: '#64748b', bg: 'var(--surface2)' };
  return { label: "⚠️ Academic Probation Risk", color: '#dc2626', bg: '#fef2f2' };
}

const GRADE_OPTIONS = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];

export function TargetGPACalculator() {
  const [currentGPA, setCurrentGPA] = useState('3.2');
  const [currentCredits, setCurrentCredits] = useState('60');
  const [targetGPA, setTargetGPA] = useState('3.7');
  const [futureSemesters, setFutureSemesters] = useState<FutureSemester[]>([
    { id: 1, credits: '18', targetGrade: 'A' },
  ]);
  const [result, setResult] = useState<any>(null);

  const add = () => setFutureSemesters(prev => [...prev, { id: Date.now(), credits: '18', targetGrade: 'A' }]);
  const remove = (id: number) => setFutureSemesters(prev => prev.filter(s => s.id !== id));
  const update = (id: number, f: keyof FutureSemester, v: string) => setFutureSemesters(prev => prev.map(s => s.id === id ? { ...s, [f]: v } : s));

  const calc = useCallback(() => {
    const cGPA = parseFloat(currentGPA);
    const cCr = parseFloat(currentCredits);
    const tGPA = parseFloat(targetGPA);
    if (isNaN(cGPA) || isNaN(cCr) || isNaN(tGPA) || cGPA < 0 || cGPA > 4 || tGPA < 0 || tGPA > 4 || cCr < 0) { setResult(null); return; }

    const futureCredits = futureSemesters.reduce((s, sem) => s + (parseFloat(sem.credits) || 0), 0);
    const futurePoints = futureSemesters.reduce((s, sem) => s + (parseFloat(sem.credits) || 0) * (GRADE_POINTS[sem.targetGrade] || 0), 0);

    const totalCredits = cCr + futureCredits;
    const projectedGPA = totalCredits > 0 ? ((cGPA * cCr + futurePoints) / totalCredits) : cGPA;

    // Required GPA for remaining semesters to hit target
    const requiredFuturePoints = tGPA * totalCredits - cGPA * cCr;
    const requiredFutureGPA = futureCredits > 0 ? requiredFuturePoints / futureCredits : null;

    const feasible = requiredFutureGPA !== null && requiredFutureGPA <= 4.0 && requiredFutureGPA >= 0;
    const status = getStatus(projectedGPA);
    const targetStatus = getStatus(tGPA);

    // What-if: grade needed per course
    const neededGrade = requiredFutureGPA !== null ? GRADE_OPTIONS.find(g => GRADE_POINTS[g] >= (requiredFutureGPA - 0.05)) ?? 'A+' : null;

    setResult({
      projectedGPA, requiredFutureGPA, feasible, status, targetStatus,
      gap: tGPA - projectedGPA, futureCredits, totalCredits, neededGrade,
      currentPoints: cGPA * cCr, futurePoints,
    });
  }, [currentGPA, currentCredits, targetGPA, futureSemesters]);

  useEffect(() => { const t = setTimeout(calc, 150); return () => clearTimeout(t); }, [calc]);

  const inp = { padding: '8px 12px', background: 'var(--surface2)', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, color: 'var(--text)', outline: 'none', width: '100%', fontWeight: 600 } as React.CSSProperties;
  const sel = { ...inp, cursor: 'pointer', appearance: 'none' as const };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Current Standing */}
      <div style={{ padding: '14px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12 }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 10 }}>Current Academic Standing</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', display: 'block', marginBottom: 5 }}>Current GPA (0–4.0)</label>
            <input type="number" style={inp} value={currentGPA} onChange={e => setCurrentGPA(e.target.value)} min={0} max={4} step={0.01} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', display: 'block', marginBottom: 5 }}>Credits Earned So Far</label>
            <input type="number" style={inp} value={currentCredits} onChange={e => setCurrentCredits(e.target.value)} min={0} />
          </div>
        </div>
      </div>

      {/* Target */}
      <div style={{ padding: '14px', background: 'linear-gradient(135deg, var(--brand-l), var(--surface))', border: '1.5px solid var(--border)', borderRadius: 12 }}>
        <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--brand)', display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>🎯 Target GPA</label>
        <input type="number" style={{ ...inp, fontSize: 20, fontWeight: 900, textAlign: 'center', color: 'var(--brand)' }} value={targetGPA} onChange={e => setTargetGPA(e.target.value)} min={0} max={4} step={0.01} />
        {result && (
          <div style={{ marginTop: 8, textAlign: 'center', fontSize: 11, color: 'var(--brand)', fontWeight: 700 }}>
            {result.targetStatus.label}
          </div>
        )}
      </div>

      {/* Future Semesters */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 8 }}>Planned Semesters</p>
        {futureSemesters.map((sem, i) => (
          <div key={sem.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, marginBottom: 8, padding: '12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, alignItems: 'end' }}>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>Semester {i + 1} Credits</label>
              <input type="number" style={inp} value={sem.credits} onChange={e => update(sem.id, 'credits', e.target.value)} min={1} max={30} />
            </div>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>Expected Grade</label>
              <select style={sel} value={sem.targetGrade} onChange={e => update(sem.id, 'targetGrade', e.target.value)}>
                {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g} ({GRADE_POINTS[g].toFixed(1)})</option>)}
              </select>
            </div>
            <button onClick={() => remove(sem.id)} style={{ color: '#ef4444', fontSize: 16, padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', alignSelf: 'end' }}>✕</button>
          </div>
        ))}
        <button onClick={add} style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1.5px dashed var(--border)', color: 'var(--brand)', fontSize: 12, fontWeight: 700, cursor: 'pointer', background: 'transparent' }}>
          + Add Semester
        </button>
      </div>

      {/* Results */}
      {result && (
        <>
          {/* Projected vs Target */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ padding: '16px', background: result.status.bg, border: `2px solid ${result.status.color}44`, borderRadius: 14, textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: result.status.color, textTransform: 'uppercase', marginBottom: 4 }}>Projected GPA</div>
              <div style={{ fontSize: 38, fontWeight: 900, color: result.status.color, lineHeight: 1 }}>{result.projectedGPA.toFixed(2)}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: result.status.color, marginTop: 6 }}>{result.status.label}</div>
            </div>
            <div style={{ padding: '16px', background: result.feasible ? '#dcfce7' : '#fef2f2', border: `2px solid ${result.feasible ? '#86efac' : '#fca5a5'}`, borderRadius: 14, textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: result.feasible ? '#15803d' : '#dc2626', textTransform: 'uppercase', marginBottom: 4 }}>Required Avg GPA</div>
              <div style={{ fontSize: 38, fontWeight: 900, color: result.feasible ? '#15803d' : '#dc2626', lineHeight: 1 }}>
                {result.requiredFutureGPA !== null ? result.requiredFutureGPA.toFixed(2) : 'N/A'}
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: result.feasible ? '#15803d' : '#dc2626', marginTop: 6 }}>
                {result.feasible ? `≈ ${result.neededGrade} grades needed` : result.requiredFutureGPA! > 4 ? 'Target exceeds 4.0 GPA' : 'Already achieved!'}
              </div>
            </div>
          </div>

          {/* Gap analysis */}
          <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 10 }}>GPA Roadmap</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Current GPA', value: parseFloat(currentGPA).toFixed(2), color: 'var(--text3)' },
                { label: 'Planned Future Credits', value: `${result.futureCredits} cr`, color: 'var(--text2)' },
                { label: 'Total Credits After Plan', value: `${result.totalCredits} cr`, color: 'var(--text2)' },
                { label: 'GPA Gap to Target', value: result.gap > 0 ? `+${result.gap.toFixed(2)} needed` : '🎉 Target Already Met!', color: result.gap <= 0 ? '#15803d' : '#d97706' },
                { label: 'Projected GPA', value: result.projectedGPA.toFixed(2), color: result.status.color },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 12, color: 'var(--text3)' }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Feasibility insight */}
          {result.requiredFutureGPA !== null && (
            <div style={{ padding: '14px', background: result.feasible ? 'linear-gradient(135deg, #dcfce7, #f0fdf4)' : 'linear-gradient(135deg, #fef2f2, #fff5f5)', border: `1px solid ${result.feasible ? '#86efac' : '#fca5a5'}`, borderRadius: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: result.feasible ? '#15803d' : '#dc2626' }}>
                {result.feasible
                  ? `✅ Your target of ${targetGPA} GPA is achievable! Aim for approximately "${result.neededGrade}" grades in your remaining ${result.futureCredits} credits.`
                  : result.requiredFutureGPA > 4.0
                    ? `❌ A ${targetGPA} GPA is mathematically impossible with your current ${currentGPA} GPA and ${currentCredits} credits. Adjust your target or plan more semesters.`
                    : `🎉 You've already surpassed your ${targetGPA} GPA target!`}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
