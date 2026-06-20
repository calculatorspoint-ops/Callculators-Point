import React, { useState, useEffect, useCallback } from 'react';
import { FinanceLayout } from '../../../components/calculator-core/forms/SharedComponents';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Semester {
  id: number;
  name: string;
  credits: string;
  gpa: string;
  isPlanned: boolean;
}

interface SemesterResult {
  id: number;
  name: string;
  credits: number;
  gpa: number;
  qualityPoints: number;
  runningCredits: number;
  runningQP: number;
  runningGPA: number;
  trend: 'up' | 'down' | 'same' | 'first';
  isPlanned: boolean;
}

interface CalcResult {
  cumulativeGPA: number;
  totalCredits: number;
  totalQP: number;
  semesters: SemesterResult[];
  actualGPA: number;   // without planned semesters
  projectedGPA: number; // with planned semesters
  hasPlanned: boolean;
  status: { label: string; color: string; icon: string } | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function getStatus(gpa: number): { label: string; color: string; icon: string } | null {
  if (gpa >= 3.5) return { label: "Dean's List", color: '#15803d', icon: '🏆' };
  if (gpa >= 3.0) return { label: 'Honor Roll',  color: '#0284c7', icon: '⭐' };
  if (gpa >= 2.0) return { label: 'Good Standing', color: '#7c3aed', icon: '✅' };
  if (gpa >  0)   return { label: 'Academic Probation', color: '#dc2626', icon: '⚠️' };
  return null;
}

function getGPAColor(gpa: number): string {
  if (gpa >= 3.5) return '#15803d';
  if (gpa >= 3.0) return '#0284c7';
  if (gpa >= 2.0) return '#7c3aed';
  if (gpa >  0)   return '#dc2626';
  return 'var(--text3)';
}

function fmt(n: number, d = 2): string {
  return n.toFixed(d);
}

let nextId = 4;

const DEFAULT_SEMESTERS: Semester[] = [
  { id: 1, name: 'Fall 2022',   credits: '15', gpa: '3.40', isPlanned: false },
  { id: 2, name: 'Spring 2023', credits: '16', gpa: '3.60', isPlanned: false },
  { id: 3, name: 'Fall 2023',   credits: '15', gpa: '3.20', isPlanned: false },
];

// ── Component ─────────────────────────────────────────────────────────────────
export function CumulativeGPACalculator() {
  const [semesters, setSemesters] = useState<Semester[]>(DEFAULT_SEMESTERS);
  const [result, setResult] = useState<CalcResult | null>(null);

  // shared input style
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

  const smallInp: React.CSSProperties = {
    ...inp,
    fontSize: 13,
    padding: '8px 10px',
  };

  // ── Calculation ──────────────────────────────────────────────────────────────
  const calc = useCallback(() => {
    const valid = semesters.filter(s => {
      const c = parseFloat(s.credits);
      const g = parseFloat(s.gpa);
      return !isNaN(c) && c > 0 && !isNaN(g) && g >= 0 && g <= 4.0;
    });

    if (valid.length === 0) {
      setResult(null);
      return;
    }

    let runningCredits = 0;
    let runningQP = 0;
    let prevGPA: number | null = null;

    const semResults: SemesterResult[] = valid.map((s, i) => {
      const credits = parseFloat(s.credits);
      const gpa = parseFloat(s.gpa);
      const qualityPoints = gpa * credits;

      runningCredits += credits;
      runningQP += qualityPoints;
      const runningGPA = runningQP / runningCredits;

      let trend: SemesterResult['trend'] = 'first';
      if (i > 0 && prevGPA !== null) {
        if (gpa > prevGPA + 0.005) trend = 'up';
        else if (gpa < prevGPA - 0.005) trend = 'down';
        else trend = 'same';
      }
      prevGPA = gpa;

      return {
        id: s.id,
        name: s.name || `Semester ${i + 1}`,
        credits,
        gpa,
        qualityPoints,
        runningCredits,
        runningQP,
        runningGPA,
        trend,
        isPlanned: s.isPlanned,
      };
    });

    // Actual (non-planned) stats
    const actual = semResults.filter(s => !s.isPlanned);
    const planned = semResults.filter(s => s.isPlanned);

    const actualCredits = actual.reduce((a, s) => a + s.credits, 0);
    const actualQP = actual.reduce((a, s) => a + s.qualityPoints, 0);
    const actualGPA = actualCredits > 0 ? actualQP / actualCredits : 0;

    const totalCredits = runningCredits;
    const totalQP = runningQP;
    const projectedGPA = totalCredits > 0 ? totalQP / totalCredits : 0;

    const cumulativeGPA = planned.length > 0 ? projectedGPA : actualGPA;

    setResult({
      cumulativeGPA,
      totalCredits,
      totalQP,
      semesters: semResults,
      actualGPA,
      projectedGPA,
      hasPlanned: planned.length > 0,
      status: getStatus(actualGPA > 0 ? actualGPA : cumulativeGPA),
    });
  }, [semesters]);

  useEffect(() => { calc(); }, [calc]);

  // ── Mutations ────────────────────────────────────────────────────────────────
  function updateSemester(id: number, field: keyof Semester, value: string | boolean) {
    setSemesters(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  }

  function addSemester(isPlanned = false) {
    const id = nextId++;
    const idx = semesters.length + 1;
    setSemesters(prev => [
      ...prev,
      { id, name: isPlanned ? 'Planned Semester' : `Semester ${idx}`, credits: '15', gpa: '3.00', isPlanned },
    ]);
  }

  function removeSemester(id: number) {
    setSemesters(prev => prev.filter(s => s.id !== id));
  }

  // ── Trend icon ───────────────────────────────────────────────────────────────
  function trendIcon(trend: SemesterResult['trend']) {
    if (trend === 'up')   return <span style={{ color: '#15803d', fontWeight: 900 }}>▲</span>;
    if (trend === 'down') return <span style={{ color: '#dc2626', fontWeight: 900 }}>▼</span>;
    if (trend === 'same') return <span style={{ color: '#d97706', fontWeight: 900 }}>→</span>;
    return <span style={{ color: 'var(--text3)', fontWeight: 900 }}>–</span>;
  }

  const color = result ? getGPAColor(result.cumulativeGPA) : 'var(--brand)';

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Semesters"
      inputContent={<>

      {/* ── Semester list ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 2 }}>
          Your Semesters
        </p>

        {semesters.map((s, idx) => (
          <div
            key={s.id}
            style={{
              padding: '14px',
              background: s.isPlanned
                ? 'linear-gradient(135deg, #7c3aed11, var(--surface))'
                : 'var(--surface)',
              border: s.isPlanned
                ? '1.5px dashed #7c3aed55'
                : '1px solid var(--border)',
              borderRadius: 12,
            }}
          >
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 99,
                  background: s.isPlanned ? '#7c3aed22' : 'var(--brand-l)',
                  color: s.isPlanned ? '#7c3aed' : 'var(--brand)',
                }}>
                  {s.isPlanned ? '🔮 Planned' : `#${idx + 1}`}
                </span>
              </div>
              <button
                onClick={() => removeSemester(s.id)}
                style={{
                  background: 'none', border: 'none', color: 'var(--text3)',
                  cursor: 'pointer', fontSize: 14, padding: '2px 6px', borderRadius: 6,
                  lineHeight: 1,
                }}
                title="Remove semester"
              >
                ✕
              </button>
            </div>

            {/* Inputs row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8, alignItems: 'end' }}>
              {/* Semester name */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', display: 'block', marginBottom: 5, textTransform: 'uppercase' }}>
                  Semester Name
                </label>
                <input
                  type="text"
                  style={smallInp}
                  value={s.name}
                  onChange={e => updateSemester(s.id, 'name', e.target.value)}
                  placeholder="e.g. Fall 2024"
                />
              </div>
              {/* Credit hours */}
              <div style={{ width: 90 }}>
                <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', display: 'block', marginBottom: 5, textTransform: 'uppercase' }}>
                  Credits
                </label>
                <input
                  type="number"
                  style={smallInp}
                  value={s.credits}
                  onChange={e => updateSemester(s.id, 'credits', e.target.value)}
                  min={0.5}
                  max={30}
                  step={0.5}
                  placeholder="15"
                />
              </div>
              {/* GPA */}
              <div style={{ width: 90 }}>
                <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', display: 'block', marginBottom: 5, textTransform: 'uppercase' }}>
                  GPA
                </label>
                <input
                  type="number"
                  style={smallInp}
                  value={s.gpa}
                  onChange={e => updateSemester(s.id, 'gpa', e.target.value)}
                  min={0}
                  max={4.0}
                  step={0.01}
                  placeholder="3.00"
                />
              </div>
            </div>

            {/* Quality points hint */}
            {(() => {
              const c = parseFloat(s.credits);
              const g = parseFloat(s.gpa);
              if (!isNaN(c) && !isNaN(g) && c > 0 && g >= 0) {
                return (
                  <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text3)', textAlign: 'right' }}>
                    Quality points: <span style={{ fontWeight: 800, color: 'var(--text2)' }}>{fmt(g * c)}</span>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        ))}

        {/* Add buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => addSemester(false)}
            style={{
              flex: 1, padding: '10px 14px', background: 'var(--surface)',
              border: '1.5px dashed var(--border)', borderRadius: 10,
              fontSize: 12, fontWeight: 700, color: 'var(--text2)', cursor: 'pointer',
            }}
          >
            ➕ Add Semester
          </button>
          <button
            onClick={() => addSemester(true)}
            style={{
              flex: 1, padding: '10px 14px', background: 'var(--surface)',
              border: '1.5px dashed #7c3aed55', borderRadius: 10,
              fontSize: 12, fontWeight: 700, color: '#7c3aed', cursor: 'pointer',
            }}
          >
            🔮 Add Planned Semester
          </button>
        </div>
      </div>

      {/* ── Results ── */}
      </>
      }
      resultContent={<>
      {result && (
        <>
          {/* Big cumulative GPA display */}
          <div style={{
            padding: '28px',
            background: `linear-gradient(135deg, ${color}22, ${color}0a)`,
            border: `2px solid ${color}55`,
            borderRadius: 18,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>
              {result.hasPlanned ? 'Projected Cumulative GPA' : 'Cumulative GPA'}
            </div>
            <div style={{ fontSize: 72, fontWeight: 900, color, lineHeight: 1, fontFamily: 'var(--font-display)' }}>
              {fmt(result.cumulativeGPA)}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 6 }}>out of 4.00</div>

            {result.status && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12,
                padding: '6px 18px', borderRadius: 99,
                background: `${result.status.color}22`,
                border: `1.5px solid ${result.status.color}55`,
              }}>
                <span style={{ fontSize: 16 }}>{result.status.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: result.status.color }}>
                  {result.status.label}
                </span>
              </div>
            )}

            {/* If planned semesters exist, show both actual and projected */}
            {result.hasPlanned && result.actualGPA > 0 && (
              <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text3)' }}>
                Current GPA (without planned):&nbsp;
                <span style={{ fontWeight: 800, color: getGPAColor(result.actualGPA) }}>
                  {fmt(result.actualGPA)}
                </span>
              </div>
            )}
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[
              { label: 'Total Credits', value: fmt(result.totalCredits, 1), unit: 'hrs' },
              { label: 'Quality Points', value: fmt(result.totalQP, 2), unit: 'pts' },
              { label: 'Semesters', value: String(result.semesters.length), unit: '' },
            ].map(({ label, value, unit }) => (
              <div key={label} style={{
                padding: '14px', background: 'var(--surface)',
                border: '1px solid var(--border)', borderRadius: 12, textAlign: 'center',
              }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 6 }}>
                  {label}
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--brand)', lineHeight: 1 }}>{value}</div>
                {unit && <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 3 }}>{unit}</div>}
              </div>
            ))}
          </div>

          {/* Standing thresholds */}
          <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 10 }}>
              Academic Standing Reference
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { label: "Dean's List",          min: 3.5, max: 4.0, color: '#15803d', icon: '🏆' },
                { label: 'Honor Roll',            min: 3.0, max: 3.49, color: '#0284c7', icon: '⭐' },
                { label: 'Good Standing',         min: 2.0, max: 2.99, color: '#7c3aed', icon: '✅' },
                { label: 'Academic Probation',    min: 0.0, max: 1.99, color: '#dc2626', icon: '⚠️' },
              ].map(({ label, min, max, color: c, icon }) => {
                const active = result.actualGPA >= min && result.actualGPA <= max;
                return (
                  <div key={label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 10px', borderRadius: 8,
                    background: active ? `${c}15` : 'transparent',
                    border: active ? `1px solid ${c}44` : '1px solid transparent',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14 }}>{icon}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: active ? c : 'var(--text2)' }}>{label}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: active ? c : 'var(--text3)' }}>
                      {min === 0 ? '<2.00' : `${fmt(min)} – ${fmt(max)}`}
                      {active && <span style={{ marginLeft: 6 }}>← You</span>}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Semester progression table */}
          <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 10 }}>
              Semester Progression
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr>
                    {['Semester', 'Credits', 'GPA', 'Trend', 'Qual. Pts', 'Running GPA'].map(h => (
                      <th key={h} style={{
                        fontSize: 10, fontWeight: 800, color: 'var(--text3)',
                        textTransform: 'uppercase', padding: '6px 8px',
                        borderBottom: '1.5px solid var(--border)',
                        textAlign: h === 'Semester' ? 'left' : 'center',
                        whiteSpace: 'nowrap',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.semesters.map((s, i) => {
                    const rc = getGPAColor(s.runningGPA);
                    return (
                      <tr key={s.id} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface2)' }}>
                        <td style={{ padding: '8px 8px', fontWeight: 600, color: s.isPlanned ? '#7c3aed' : 'var(--text)' }}>
                          {s.name}
                          {s.isPlanned && (
                            <span style={{ fontSize: 9, fontWeight: 800, marginLeft: 5, color: '#7c3aed' }}>PLANNED</span>
                          )}
                        </td>
                        <td style={{ padding: '8px 8px', textAlign: 'center', color: 'var(--text2)', fontWeight: 700 }}>
                          {fmt(s.credits, 1)}
                        </td>
                        <td style={{ padding: '8px 8px', textAlign: 'center', fontWeight: 800, color: getGPAColor(s.gpa) }}>
                          {fmt(s.gpa)}
                        </td>
                        <td style={{ padding: '8px 8px', textAlign: 'center', fontSize: 14 }}>
                          {trendIcon(s.trend)}
                        </td>
                        <td style={{ padding: '8px 8px', textAlign: 'center', color: 'var(--text2)', fontWeight: 700 }}>
                          {fmt(s.qualityPoints)}
                        </td>
                        <td style={{ padding: '8px 8px', textAlign: 'center' }}>
                          <span style={{
                            fontSize: 12, fontWeight: 900, color: rc,
                            background: `${rc}18`, padding: '2px 8px', borderRadius: 99,
                          }}>
                            {fmt(s.runningGPA)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* GPA bar visualization */}
          <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 10 }}>
              GPA Trend per Semester
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {result.semesters.map(s => {
                const pct = (s.gpa / 4.0) * 100;
                const c = getGPAColor(s.gpa);
                return (
                  <div key={s.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: s.isPlanned ? '#7c3aed' : 'var(--text2)' }}>
                        {s.name}{s.isPlanned ? ' 🔮' : ''}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 800, color: c }}>{fmt(s.gpa)}</span>
                    </div>
                    <div style={{ height: 7, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${pct}%`,
                        background: s.isPlanned
                          ? 'repeating-linear-gradient(90deg,#7c3aed 0,#7c3aed 8px,transparent 8px,transparent 12px)'
                          : c,
                        borderRadius: 99,
                        transition: 'width 0.4s ease',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ── Informational note ── */}
      <div style={{
        padding: '14px',
        background: 'linear-gradient(135deg, var(--brand-l), var(--surface))',
        border: '1px solid var(--border)',
        borderRadius: 12,
      }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--brand)', textTransform: 'uppercase', marginBottom: 8 }}>
          💡 Understanding Cumulative vs. Semester GPA
        </p>
        <ul style={{ fontSize: 12, color: 'var(--text2)', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 5, margin: 0 }}>
          <li>
            <strong>Semester GPA</strong> reflects your performance in one term only — high-credit courses weigh more.
          </li>
          <li>
            <strong>Cumulative GPA</strong> is a weighted average across <em>all</em> semesters using quality points (GPA × credits).
          </li>
          <li>
            A single bad semester has less impact as total credits grow, but Dean's List / Honor Roll typically require <strong>each semester</strong> to meet the threshold.
          </li>
          <li>
            Use <strong>Planned Semester</strong> (🔮) to forecast how a future term will shift your overall GPA before you enroll.
          </li>
        </ul>
      </div>
      </>
    }
    />
  );
}
