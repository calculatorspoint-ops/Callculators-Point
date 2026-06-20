import React, { useState, useEffect, useCallback } from 'react';
import { FinanceLayout } from '../../../components/calculator-core/forms/SharedComponents';

interface Subject {
  id: number;
  name: string;
  obtained: string;
  total: string;
}

interface SubjectResult {
  name: string;
  obtained: number;
  total: number;
  percentage: number;
  grade: string;
  gradeColor: string;
  passed: boolean;
}

function getGrade(pct: number): { grade: string; color: string } {
  if (pct >= 90) return { grade: 'A+ (Distinction)', color: '#16a34a' };
  if (pct >= 80) return { grade: 'A (Excellent)', color: '#15803d' };
  if (pct >= 70) return { grade: 'B+ (Very Good)', color: '#0284c7' };
  if (pct >= 60) return { grade: 'B (Good)', color: '#2563eb' };
  if (pct >= 50) return { grade: 'C (Average)', color: '#d97706' };
  if (pct >= 40) return { grade: 'D (Pass)', color: '#ea580c' };
  return { grade: 'F (Fail)', color: '#dc2626' };
}

function PercentBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ width: '100%', height: 8, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
      <div
        style={{
          width: `${Math.min(pct, 100)}%`,
          height: '100%',
          background: color,
          borderRadius: 99,
          transition: 'width 0.6s cubic-bezier(.4,0,.2,1)',
        }}
      />
    </div>
  );
}

export function MarksPercentageCalculator() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: 'Mathematics', obtained: '85', total: '100' },
    { id: 2, name: 'Physics', obtained: '78', total: '100' },
    { id: 3, name: 'Chemistry', obtained: '92', total: '100' },
  ]);
  const [passThreshold, setPassThreshold] = useState('40');
  const [reverseMode, setReverseMode] = useState(false);
  const [targetPct, setTargetPct] = useState('75');
  const [results, setResults] = useState<SubjectResult[]>([]);
  const [overall, setOverall] = useState<{ pct: number; grade: string; color: string; totalObtained: number; totalMax: number } | null>(null);

  const addSubject = () => {
    setSubjects(prev => [...prev, { id: Date.now(), name: `Subject ${prev.length + 1}`, obtained: '0', total: '100' }]);
  };

  const removeSubject = (id: number) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  const updateSubject = (id: number, field: keyof Subject, value: string) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const calc = useCallback(() => {
    const valid = subjects.filter(s => {
      const o = parseFloat(s.obtained); const t = parseFloat(s.total);
      return !isNaN(o) && !isNaN(t) && t > 0 && o >= 0 && o <= t;
    });
    if (valid.length === 0) { setResults([]); setOverall(null); return; }

    const res: SubjectResult[] = valid.map(s => {
      const o = parseFloat(s.obtained); const t = parseFloat(s.total);
      const pct = (o / t) * 100;
      const { grade, color } = getGrade(pct);
      return { name: s.name || 'Subject', obtained: o, total: t, percentage: pct, grade, gradeColor: color, passed: pct >= (parseFloat(passThreshold) || 40) };
    });

    const totalObtained = res.reduce((acc, r) => acc + r.obtained, 0);
    const totalMax = res.reduce((acc, r) => acc + r.total, 0);
    const overallPct = (totalObtained / totalMax) * 100;
    const { grade, color } = getGrade(overallPct);

    setResults(res);
    setOverall({ pct: overallPct, grade, color, totalObtained, totalMax });
  }, [subjects, passThreshold]);

  useEffect(() => { const t = setTimeout(calc, 150); return () => clearTimeout(t); }, [calc]);

  // Reverse mode: how many marks needed for a target percentage
  const reverseCalc = () => {
    if (!overall) return null;
    const target = parseFloat(targetPct);
    if (isNaN(target)) return null;
    const needed = (target / 100) * overall.totalMax;
    return { needed: needed.toFixed(1), gap: (needed - overall.totalObtained).toFixed(1), feasible: needed <= overall.totalMax };
  };

  const rev = reverseMode ? reverseCalc() : null;
  const passCount = results.filter(r => r.passed).length;
  const failCount = results.length - passCount;

  const inp = {
    padding: '8px 10px',
    background: 'var(--surface2)',
    border: '1.5px solid var(--border)',
    borderRadius: 8,
    fontSize: 13,
    color: 'var(--text)',
    outline: 'none',
    width: '100%',
  } as React.CSSProperties;

  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Marks"
      inputContent={<>
        {/* Mode Toggle */}
        <div style={{ display: 'flex', gap: 8, background: 'var(--surface2)', padding: 4, borderRadius: 10, border: '1px solid var(--border)' }}>
          {(['Calculator', 'Reverse Mode'] as const).map(m => (
            <button key={m} onClick={() => setReverseMode(m === 'Reverse Mode')}
              style={{ flex: 1, padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                background: (m === 'Reverse Mode') === reverseMode ? 'var(--brand)' : 'transparent',
                color: (m === 'Reverse Mode') === reverseMode ? '#fff' : 'var(--text3)', border: 'none', transition: 'all .2s' }}>
              {m}
            </button>
          ))}
        </div>

        {/* Subject Table */}
        <div style={{ border: '1.5px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 0, padding: '8px 14px', background: 'linear-gradient(135deg, #c2410c, #9a3412)' }}>
            {['Subject', 'Obtained', 'Total', ''].map(h => (
              <span key={h} style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.7)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</span>
            ))}
          </div>
          {subjects.map((s) => (
            <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, padding: '10px 14px', borderBottom: '1px solid var(--border)', alignItems: 'center', background: 'var(--surface)' }}>
              <input style={inp} value={s.name} onChange={e => updateSubject(s.id, 'name', e.target.value)} placeholder="Subject name" />
              <input type="number" style={{ ...inp, textAlign: 'center' }} value={s.obtained} onChange={e => updateSubject(s.id, 'obtained', e.target.value)} min="0" />
              <input type="number" style={{ ...inp, textAlign: 'center' }} value={s.total} onChange={e => updateSubject(s.id, 'total', e.target.value)} min="1" />
              <button onClick={() => removeSubject(s.id)} style={{ color: '#ef4444', fontSize: 16, padding: '4px 8px', borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
          ))}
          <button onClick={addSubject} style={{ width: '100%', padding: '10px', fontSize: 12, fontWeight: 700, color: 'var(--brand)', background: 'var(--surface2)', border: 'none', borderTop: '1px solid var(--border)', cursor: 'pointer' }}>
            + Add Subject
          </button>
        </div>

        {/* Pass Threshold */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text3)', whiteSpace: 'nowrap' }}>Pass Threshold (%)</label>
          <input type="number" style={{ ...inp, width: 80 }} value={passThreshold} onChange={e => setPassThreshold(e.target.value)} min="0" max="100" />
        </div>

        {/* Reverse Mode Input */}
        {reverseMode && (
          <div style={{ padding: '12px 16px', background: 'var(--surface2)', border: '1px dashed var(--border)', borderRadius: 10 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 8 }}>Target Percentage</p>
            <input type="number" style={inp} value={targetPct} onChange={e => setTargetPct(e.target.value)} placeholder="e.g. 75" min="0" max="100" />
            {rev && (
              <div style={{ marginTop: 10, padding: '10px 14px', background: rev.feasible ? '#dcfce7' : '#fef2f2', border: `1px solid ${rev.feasible ? '#86efac' : '#fca5a5'}`, borderRadius: 8 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: rev.feasible ? '#15803d' : '#dc2626' }}>
                  {rev.feasible
                    ? `You need ${rev.needed} total marks for ${targetPct}% — gap: ${Math.max(0, parseFloat(rev.gap)).toFixed(1)} marks`
                    : `Target ${targetPct}% is not achievable with current total marks.`}
                </p>
              </div>
            )}
          </div>
        )}
      </>}
      resultContent={<>
        {/* Overall Result */}
        {overall && (
          <>
            <div style={{ padding: '24px', background: `linear-gradient(135deg, ${overall.color}22, ${overall.color}11)`, border: `2px solid ${overall.color}44`, borderRadius: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: overall.color, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Overall Percentage</div>
              <div style={{ fontSize: 56, fontWeight: 900, color: overall.color, lineHeight: 1 }}>{overall.pct.toFixed(2)}%</div>
              <div style={{ marginTop: 8, fontSize: 14, fontWeight: 700, color: overall.color, opacity: .85 }}>{overall.grade}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 6 }}>{overall.totalObtained} / {overall.totalMax} marks</div>
            </div>

            {/* Pass/Fail summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ padding: '12px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#15803d' }}>{passCount}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#15803d', textTransform: 'uppercase' }}>Passed</div>
              </div>
              <div style={{ padding: '12px', background: failCount > 0 ? '#fef2f2' : 'var(--surface2)', border: `1px solid ${failCount > 0 ? '#fca5a5' : 'var(--border)'}`, borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: failCount > 0 ? '#dc2626' : 'var(--text3)' }}>{failCount}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: failCount > 0 ? '#dc2626' : 'var(--text3)', textTransform: 'uppercase' }}>Failed</div>
              </div>
            </div>

            {/* Subject-wise breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Subject-wise Analysis</p>
              {results.map((r, i) => (
                <div key={i} style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)' }}>{r.obtained} / {r.total} marks</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: r.gradeColor }}>{r.percentage.toFixed(1)}%</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: r.gradeColor }}>{r.grade}</div>
                    </div>
                  </div>
                  <PercentBar pct={r.percentage} color={r.gradeColor} />
                  {!r.passed && (
                    <div style={{ marginTop: 6, fontSize: 11, color: '#dc2626', fontWeight: 600 }}>
                      ⚠ Need {((parseFloat(passThreshold) / 100) * r.total - r.obtained).toFixed(1)} more marks to pass
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </>}
    />
  );
}
