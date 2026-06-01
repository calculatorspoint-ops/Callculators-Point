import React, { useState, useEffect, useCallback } from 'react';

// ─── Grading Scale Definitions ───────────────────────────────────────────────

type Grade = { label: string; min: number; gpa: number };

const GRADING_SCALES: Record<string, Grade[]> = {
  us: [
    { label: 'A+', min: 97, gpa: 4.0 },
    { label: 'A',  min: 93, gpa: 4.0 },
    { label: 'A-', min: 90, gpa: 3.7 },
    { label: 'B+', min: 87, gpa: 3.3 },
    { label: 'B',  min: 83, gpa: 3.0 },
    { label: 'B-', min: 80, gpa: 2.7 },
    { label: 'C+', min: 77, gpa: 2.3 },
    { label: 'C',  min: 73, gpa: 2.0 },
    { label: 'C-', min: 70, gpa: 1.7 },
    { label: 'D+', min: 67, gpa: 1.3 },
    { label: 'D',  min: 63, gpa: 1.0 },
    { label: 'D-', min: 60, gpa: 0.7 },
    { label: 'F',  min: 0,  gpa: 0.0 },
  ],
  pk: [
    { label: 'Distinction', min: 80, gpa: 4.0 },
    { label: 'A1',          min: 70, gpa: 3.7 },
    { label: 'A',           min: 60, gpa: 3.3 },
    { label: 'B',           min: 50, gpa: 3.0 },
    { label: 'C',           min: 40, gpa: 2.0 },
    { label: 'Fail',        min: 0,  gpa: 0.0 },
  ],
  uk: [
    { label: 'First',        min: 70, gpa: 4.0 },
    { label: 'Upper Second', min: 60, gpa: 3.3 },
    { label: 'Lower Second', min: 50, gpa: 2.7 },
    { label: 'Third',        min: 40, gpa: 2.0 },
    { label: 'Fail',         min: 0,  gpa: 0.0 },
  ],
  custom: [
    { label: 'Pass', min: 50, gpa: 2.0 },
    { label: 'Fail', min: 0,  gpa: 0.0 },
  ],
};

const SCALE_LABELS: Record<string, string> = {
  us:     'US Letter Grade',
  pk:     'Pakistani / Indian',
  uk:     'UK Classification',
  custom: 'Custom Pass Mark',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGrade(pct: number, scale: Grade[]): Grade {
  for (const g of scale) {
    if (pct >= g.min) return g;
  }
  return scale[scale.length - 1];
}

function pctColor(pct: number): string {
  if (pct >= 85) return '#15803d';
  if (pct >= 70) return '#0284c7';
  if (pct >= 55) return '#7c3aed';
  if (pct >= 40) return '#d97706';
  return '#dc2626';
}

function pctLabel(pct: number): string {
  if (pct >= 90) return '🏆 Outstanding';
  if (pct >= 80) return '⭐ Excellent';
  if (pct >= 70) return '✅ Good';
  if (pct >= 55) return '📈 Average';
  if (pct >= 40) return '📊 Below Average';
  return '❌ Fail';
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Subject {
  id: number;
  name: string;
  obtained: string;
  total: string;
}

interface SubjectResult {
  id: number;
  name: string;
  obtained: number;
  total: number;
  pct: number;
  grade: Grade;
}

interface CalcResult {
  pct: number;
  grade: Grade;
  color: string;
  gpa: number;
  isPassing: boolean;
  subjects?: SubjectResult[];
  totalObtained?: number;
  totalMarks?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TestScoreCalculator() {
  const [mode, setMode] = useState<'single' | 'multi'>('single');
  const [scaleKey, setScaleKey] = useState<string>('us');
  const [customPass, setCustomPass] = useState('50');
  const [passMark, setPassMark] = useState('50');

  // Single mode
  const [obtained, setObtained] = useState('75');
  const [total, setTotal] = useState('100');

  // Multi mode
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: 'Mathematics', obtained: '78', total: '100' },
    { id: 2, name: 'English',     obtained: '82', total: '100' },
    { id: 3, name: 'Science',     obtained: '70', total: '100' },
  ]);
  const [nextId, setNextId] = useState(4);

  const [result, setResult] = useState<CalcResult | null>(null);

  // Build the active grading scale (with custom pass mark patched in)
  const activeScale: Grade[] = scaleKey === 'custom'
    ? [
        { label: 'Pass', min: parseFloat(customPass) || 50, gpa: 2.0 },
        { label: 'Fail', min: 0, gpa: 0.0 },
      ]
    : GRADING_SCALES[scaleKey];

  const calc = useCallback(() => {
    const passThreshold = parseFloat(passMark) || 40;

    if (mode === 'single') {
      const obt = parseFloat(obtained) || 0;
      const tot = parseFloat(total) || 100;
      if (tot <= 0) return;
      const pct = Math.min(100, (obt / tot) * 100);
      const grade = getGrade(pct, activeScale);
      setResult({
        pct,
        grade,
        color: pctColor(pct),
        gpa: grade.gpa,
        isPassing: pct >= passThreshold,
      });
    } else {
      const subResults: SubjectResult[] = subjects.map(s => {
        const obt = parseFloat(s.obtained) || 0;
        const tot = parseFloat(s.total) || 100;
        const pct = tot > 0 ? Math.min(100, (obt / tot) * 100) : 0;
        return { id: s.id, name: s.name, obtained: obt, total: tot, pct, grade: getGrade(pct, activeScale) };
      });
      const totalObtained = subResults.reduce((a, s) => a + s.obtained, 0);
      const totalMarks    = subResults.reduce((a, s) => a + s.total, 0);
      const pct = totalMarks > 0 ? Math.min(100, (totalObtained / totalMarks) * 100) : 0;
      const grade = getGrade(pct, activeScale);
      const avgGpa = subResults.reduce((a, s) => a + s.grade.gpa, 0) / (subResults.length || 1);
      setResult({
        pct, grade,
        color: pctColor(pct),
        gpa: Math.round(avgGpa * 100) / 100,
        isPassing: pct >= passThreshold,
        subjects: subResults,
        totalObtained,
        totalMarks,
      });
    }
  }, [mode, obtained, total, subjects, activeScale, passMark]);

  useEffect(() => { calc(); }, [calc]);

  // Subject helpers
  const addSubject = () => {
    setSubjects(s => [...s, { id: nextId, name: `Subject ${nextId}`, obtained: '0', total: '100' }]);
    setNextId(n => n + 1);
  };
  const removeSubject = (id: number) => setSubjects(s => s.filter(x => x.id !== id));
  const updateSubject = (id: number, field: keyof Subject, value: string) =>
    setSubjects(s => s.map(x => x.id === id ? { ...x, [field]: value } : x));

  // Shared style tokens
  const inp: React.CSSProperties = {
    padding: '10px 14px', background: 'var(--surface2)', border: '1.5px solid var(--border)',
    borderRadius: 10, fontSize: 15, color: 'var(--text)', outline: 'none', width: '100%', fontWeight: 700,
  };
  const label: React.CSSProperties = {
    fontSize: 11, fontWeight: 800, color: 'var(--text3)', display: 'block',
    marginBottom: 6, textTransform: 'uppercase',
  };
  const secHeader: React.CSSProperties = {
    fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 6,
  };
  const card: React.CSSProperties = {
    padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12,
  };
  const toggleBtn = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '8px', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer',
    background: active ? 'var(--brand)' : 'transparent',
    color: active ? '#fff' : 'var(--text3)', border: 'none',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Mode Toggle ── */}
      <div>
        <p style={secHeader}>Mode</p>
        <div style={{ display: 'flex', gap: 6, background: 'var(--surface2)', padding: 3, borderRadius: 9, border: '1px solid var(--border)' }}>
          {(['single', 'multi'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={toggleBtn(mode === m)}>
              {m === 'single' ? '📝 Single Subject' : '📚 Multi-Subject'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grading Scale ── */}
      <div>
        <label style={label}>Grading Scale</label>
        <select
          value={scaleKey}
          onChange={e => setScaleKey(e.target.value)}
          style={{ ...inp, appearance: 'none', cursor: 'pointer' }}
        >
          {Object.entries(SCALE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {/* ── Custom Pass Mark (if Custom scale) ── */}
      {scaleKey === 'custom' && (
        <div style={card}>
          <label style={label}>Custom Pass Mark (%)</label>
          <input type="number" style={inp} value={customPass}
            onChange={e => setCustomPass(e.target.value)} min={0} max={100} placeholder="e.g. 50" />
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 5 }}>
            Scores at or above this percentage are considered passing.
          </div>
        </div>
      )}

      {/* ── Min Pass Mark ── */}
      <div style={card}>
        <label style={label}>Minimum Pass Mark (%)</label>
        <input type="number" style={inp} value={passMark}
          onChange={e => setPassMark(e.target.value)} min={0} max={100} placeholder="e.g. 50" />
        <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 5 }}>
          Used for the Pass / Fail badge below.
        </div>
      </div>

      {/* ── Single Subject Inputs ── */}
      {mode === 'single' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={card}>
            <label style={label}>Marks Obtained</label>
            <input type="number" style={inp} value={obtained}
              onChange={e => setObtained(e.target.value)} min={0} placeholder="e.g. 75" />
          </div>
          <div style={card}>
            <label style={label}>Total Marks</label>
            <input type="number" style={inp} value={total}
              onChange={e => setTotal(e.target.value)} min={1} placeholder="e.g. 100" />
          </div>
        </div>
      )}

      {/* ── Multi Subject Inputs ── */}
      {mode === 'multi' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={secHeader}>Subjects</p>
          {subjects.map((s, i) => (
            <div key={s.id} style={{ ...card, display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <div style={{ flex: 2 }}>
                {i === 0 && <label style={label}>Subject Name</label>}
                <input
                  type="text" style={inp} value={s.name}
                  onChange={e => updateSubject(s.id, 'name', e.target.value)}
                  placeholder="Subject name"
                />
              </div>
              <div style={{ flex: 1 }}>
                {i === 0 && <label style={label}>Obtained</label>}
                <input
                  type="number" style={inp} value={s.obtained}
                  onChange={e => updateSubject(s.id, 'obtained', e.target.value)}
                  min={0} placeholder="0"
                />
              </div>
              <div style={{ flex: 1 }}>
                {i === 0 && <label style={label}>Total</label>}
                <input
                  type="number" style={inp} value={s.total}
                  onChange={e => updateSubject(s.id, 'total', e.target.value)}
                  min={1} placeholder="100"
                />
              </div>
              <button
                onClick={() => removeSubject(s.id)}
                disabled={subjects.length <= 1}
                style={{
                  padding: '10px 12px', borderRadius: 9, border: '1.5px solid var(--border)',
                  background: 'var(--surface2)', color: 'var(--text3)', cursor: subjects.length > 1 ? 'pointer' : 'not-allowed',
                  fontSize: 14, lineHeight: 1, marginBottom: 0,
                }}
              >✕</button>
            </div>
          ))}
          <button
            onClick={addSubject}
            style={{
              padding: '10px', borderRadius: 10, border: '1.5px dashed var(--border)',
              background: 'transparent', color: 'var(--brand)', cursor: 'pointer',
              fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 6,
            }}
          >
            ➕ Add Subject
          </button>
        </div>
      )}

      {/* ── Results ── */}
      {result && (
        <>
          {/* Main percentage card */}
          <div style={{
            padding: '28px 24px', textAlign: 'center',
            background: `linear-gradient(135deg, ${result.color}22, ${result.color}0a)`,
            border: `2px solid ${result.color}55`, borderRadius: 18,
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: result.color, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>
              {mode === 'multi' ? 'Overall Percentage' : 'Exam Percentage'}
            </div>
            <div style={{ fontSize: 72, fontWeight: 900, color: result.color, lineHeight: 1, fontFamily: 'var(--font-display)' }}>
              {result.pct.toFixed(1)}%
            </div>
            {mode === 'multi' && result.totalObtained !== undefined && (
              <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 6 }}>
                {result.totalObtained} / {result.totalMarks} total marks
              </div>
            )}
            {mode === 'single' && (
              <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 6 }}>
                {obtained} / {total} marks
              </div>
            )}
            <div style={{ fontSize: 15, fontWeight: 800, color: result.color, marginTop: 10 }}>
              {pctLabel(result.pct)}
            </div>
          </div>

          {/* Visual percentage bar */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase' }}>Score Bar</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: result.color }}>{result.pct.toFixed(1)}%</span>
            </div>
            <div style={{ width: '100%', height: 14, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{
                width: `${result.pct}%`, height: '100%', borderRadius: 99,
                background: `linear-gradient(90deg, ${result.color}88, ${result.color})`,
                transition: 'width 0.4s ease',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
              <span style={{ fontSize: 10, color: 'var(--text3)' }}>0%</span>
              <span style={{ fontSize: 10, color: 'var(--text3)' }}>50%</span>
              <span style={{ fontSize: 10, color: 'var(--text3)' }}>100%</span>
            </div>
          </div>

          {/* Grade + GPA + Pass/Fail row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {/* Grade */}
            <div style={{ ...card, textAlign: 'center' }}>
              <div style={secHeader}>Grade</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: result.color, lineHeight: 1, fontFamily: 'var(--font-display)' }}>
                {result.grade.label}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>
                {SCALE_LABELS[scaleKey]}
              </div>
            </div>
            {/* GPA */}
            <div style={{ ...card, textAlign: 'center' }}>
              <div style={secHeader}>GPA</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#7c3aed', lineHeight: 1, fontFamily: 'var(--font-display)' }}>
                {result.gpa.toFixed(1)}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>4.0 Scale</div>
            </div>
            {/* Pass / Fail */}
            <div style={{
              ...card, textAlign: 'center',
              background: result.isPassing ? '#dcfce7' : '#fef2f2',
              border: `1.5px solid ${result.isPassing ? '#86efac' : '#fca5a5'}`,
            }}>
              <div style={{ ...secHeader, color: result.isPassing ? '#15803d' : '#dc2626' }}>Status</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: result.isPassing ? '#15803d' : '#dc2626', lineHeight: 1, fontFamily: 'var(--font-display)' }}>
                {result.isPassing ? '✓ Pass' : '✗ Fail'}
              </div>
              <div style={{ fontSize: 10, color: result.isPassing ? '#16a34a' : '#dc2626', marginTop: 4 }}>
                Min: {passMark}%
              </div>
            </div>
          </div>

          {/* Grading scale reference */}
          <div style={card}>
            <p style={secHeader}>📋 Grading Scale Reference — {SCALE_LABELS[scaleKey]}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {activeScale.map((g, i) => {
                const isActive = result.grade.label === g.label;
                return (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '7px 10px', borderRadius: 8, marginBottom: 2,
                    background: isActive ? `${pctColor(g.min === 0 ? 0 : g.min)}22` : 'transparent',
                    border: isActive ? `1.5px solid ${pctColor(g.min === 0 ? 0 : g.min)}44` : '1.5px solid transparent',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        fontSize: 12, fontWeight: 800,
                        color: isActive ? pctColor(g.min === 0 ? 0 : g.min) : 'var(--text)',
                        minWidth: 56,
                      }}>
                        {g.label}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text3)' }}>
                        {i < activeScale.length - 1
                          ? `${g.min}% – ${activeScale[i - 1] ? activeScale[i - 1].min - 1 + '%' : '100%'}`
                          : `< ${activeScale[i - 1]?.min ?? 40}%`}
                      </span>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      color: isActive ? pctColor(g.min === 0 ? 0 : g.min) : 'var(--text3)',
                    }}>
                      GPA {g.gpa.toFixed(1)}
                    </span>
                    {isActive && (
                      <span style={{
                        fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 99,
                        background: pctColor(g.min === 0 ? 0 : g.min), color: '#fff',
                      }}>
                        ← You
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Per-subject breakdown (multi mode) */}
          {mode === 'multi' && result.subjects && (
            <div style={card}>
              <p style={secHeader}>📊 Subject-by-Subject Breakdown</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {result.subjects.map((s, i) => {
                  const c = pctColor(s.pct);
                  return (
                    <div key={s.id} style={{
                      padding: '10px 12px', borderRadius: 10,
                      background: 'var(--surface2)', border: '1px solid var(--border)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{s.name}</span>
                          <span style={{ fontSize: 11, color: 'var(--text3)', marginLeft: 8 }}>
                            {s.obtained} / {s.total}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 13, fontWeight: 900, color: c }}>{s.pct.toFixed(1)}%</span>
                          <span style={{
                            fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 99,
                            background: `${c}22`, color: c, border: `1px solid ${c}44`,
                          }}>
                            {s.grade.label}
                          </span>
                        </div>
                      </div>
                      <div style={{ width: '100%', height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{
                          width: `${s.pct}%`, height: '100%', borderRadius: 99,
                          background: `linear-gradient(90deg, ${c}88, ${c})`,
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
