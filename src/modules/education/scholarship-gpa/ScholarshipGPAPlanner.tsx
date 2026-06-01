import React, { useState, useEffect, useCallback } from 'react';

const PRESETS = [
  { label: 'Merit', gpa: 3.0, color: '#3b82f6' },
  { label: "Dean's List", gpa: 3.5, color: '#8b5cf6' },
  { label: 'Full Scholarship', gpa: 3.7, color: '#f59e0b' },
  { label: 'Valedictorian', gpa: 4.0, color: '#10b981' },
];

interface Results {
  totalCredits: number;
  currentQP: number;
  requiredQP: number;
  neededQP: number;
  remainingCredits: number;
  requiredSemGPA: number;
  gapFromCurrent: number;
  feasibility: 'IMPOSSIBLE' | 'VERY HARD' | 'CHALLENGING' | 'ACHIEVABLE';
  feasibilityColor: string;
  feasibilityBg: string;
  feasibilityMessage: string;
}

export function ScholarshipGPAPlanner() {
  const [currentGPA, setCurrentGPA] = useState<string>('3.20');
  const [completedCredits, setCompletedCredits] = useState<string>('60');
  const [targetGPA, setTargetGPA] = useState<string>('3.50');
  const [remainingSemesters, setRemainingSemesters] = useState<number>(4);
  const [creditsPerSemester, setCreditsPerSemester] = useState<string>('15');
  const [results, setResults] = useState<Results | null>(null);

  const calculate = useCallback(() => {
    const cgpa = parseFloat(currentGPA);
    const cc = parseFloat(completedCredits);
    const tgpa = parseFloat(targetGPA);
    const cps = parseFloat(creditsPerSemester);
    const rs = remainingSemesters;

    if (
      isNaN(cgpa) || isNaN(cc) || isNaN(tgpa) || isNaN(cps) ||
      cgpa < 0 || cgpa > 4 || tgpa < 0 || tgpa > 4 ||
      cc < 0 || cps < 1 || rs < 1
    ) {
      setResults(null);
      return;
    }

    const remainingCredits = rs * cps;
    const totalCredits = cc + remainingCredits;
    const currentQP = cgpa * cc;
    const requiredQP = tgpa * totalCredits;
    const neededQP = requiredQP - currentQP;
    const requiredSemGPA = neededQP / remainingCredits;
    const gapFromCurrent = tgpa - cgpa;

    let feasibility: Results['feasibility'];
    let feasibilityColor: string;
    let feasibilityBg: string;
    let feasibilityMessage: string;

    if (requiredSemGPA > 4.0) {
      feasibility = 'IMPOSSIBLE';
      feasibilityColor = '#ef4444';
      feasibilityBg = '#ef444422';
      feasibilityMessage = 'Target is mathematically impossible with remaining semesters.';
    } else if (requiredSemGPA > 3.7) {
      feasibility = 'VERY HARD';
      feasibilityColor = '#f97316';
      feasibilityBg = '#f9731622';
      feasibilityMessage = 'Requires near-perfect grades every remaining semester.';
    } else if (requiredSemGPA > 3.3) {
      feasibility = 'CHALLENGING';
      feasibilityColor = '#eab308';
      feasibilityBg = '#eab30822';
      feasibilityMessage = 'Achievable with consistent strong academic performance.';
    } else {
      feasibility = 'ACHIEVABLE';
      feasibilityColor = '#10b981';
      feasibilityBg = '#10b98122';
      feasibilityMessage = 'You are on a solid path to meet your scholarship GPA.';
    }

    setResults({
      totalCredits,
      currentQP,
      requiredQP,
      neededQP,
      remainingCredits,
      requiredSemGPA,
      gapFromCurrent,
      feasibility,
      feasibilityColor,
      feasibilityBg,
      feasibilityMessage,
    });
  }, [currentGPA, completedCredits, targetGPA, remainingSemesters, creditsPerSemester]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const applyPreset = (gpa: number) => {
    setTargetGPA(gpa.toFixed(2));
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 800,
    color: 'var(--text3)',
    display: 'block',
    marginBottom: 6,
    textTransform: 'uppercase',
  };

  const inputStyle: React.CSSProperties = {
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

  const cardStyle: React.CSSProperties = {
    padding: '14px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
  };

  const sectionHeaderStyle: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 800,
    color: 'var(--text3)',
    textTransform: 'uppercase',
    marginBottom: 6,
  };

  const getProgressWidth = (requiredSemGPA: number) => {
    const clamped = Math.min(Math.max(requiredSemGPA, 0), 4);
    return `${(clamped / 4) * 100}%`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Presets */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>Scholarship Presets</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {PRESETS.map((p) => {
            const active = parseFloat(targetGPA) === p.gpa;
            return (
              <button
                key={p.label}
                onClick={() => applyPreset(p.gpa)}
                style={{
                  flex: 1,
                  minWidth: 100,
                  padding: '8px 10px',
                  borderRadius: 9,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: active ? p.color : 'var(--surface2)',
                  color: active ? '#fff' : 'var(--text3)',
                  border: active ? `1.5px solid ${p.color}` : '1.5px solid var(--border)',
                  transition: 'all 0.18s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <span>{p.label}</span>
                <span style={{ fontSize: 13, fontWeight: 900, color: active ? '#fff' : p.color }}>
                  {p.gpa.toFixed(1)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inputs */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>Your Academic Profile</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

          <div>
            <label style={labelStyle}>Current GPA (0.00 – 4.00)</label>
            <input
              type="number"
              min={0}
              max={4}
              step={0.01}
              value={currentGPA}
              onChange={(e) => setCurrentGPA(e.target.value)}
              style={inputStyle}
              placeholder="e.g. 3.20"
            />
          </div>

          <div>
            <label style={labelStyle}>Completed Credit Hours</label>
            <input
              type="number"
              min={0}
              step={1}
              value={completedCredits}
              onChange={(e) => setCompletedCredits(e.target.value)}
              style={inputStyle}
              placeholder="e.g. 60"
            />
          </div>

          <div>
            <label style={labelStyle}>Scholarship GPA Requirement</label>
            <input
              type="number"
              min={0}
              max={4}
              step={0.01}
              value={targetGPA}
              onChange={(e) => setTargetGPA(e.target.value)}
              style={inputStyle}
              placeholder="e.g. 3.50"
            />
          </div>

          <div>
            <label style={labelStyle}>Credits per Remaining Semester</label>
            <input
              type="number"
              min={1}
              step={1}
              value={creditsPerSemester}
              onChange={(e) => setCreditsPerSemester(e.target.value)}
              style={inputStyle}
              placeholder="e.g. 15"
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Remaining Semesters</label>
            <div
              style={{
                display: 'flex',
                gap: 6,
                background: 'var(--surface2)',
                border: '1.5px solid var(--border)',
                borderRadius: 10,
                padding: 4,
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <button
                  key={n}
                  onClick={() => setRemainingSemesters(n)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 7,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: remainingSemesters === n ? 'var(--brand)' : 'transparent',
                    color: remainingSemesters === n ? '#fff' : 'var(--text3)',
                    border: 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Results */}
      {results && (
        <>
          {/* Feasibility Banner */}
          <div
            style={{
              padding: '16px 20px',
              borderRadius: 14,
              background: `linear-gradient(135deg, ${results.feasibilityColor}22, ${results.feasibilityColor}0a)`,
              border: `2px solid ${results.feasibilityColor}55`,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: results.feasibilityColor, textTransform: 'uppercase', marginBottom: 4 }}>
                Feasibility Assessment
              </div>
              <div style={{ fontSize: 26, fontWeight: 900, color: results.feasibilityColor, lineHeight: 1, fontFamily: 'var(--font-display)', marginBottom: 6 }}>
                {results.feasibility}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>
                {results.feasibilityMessage}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 4 }}>
                Required / Sem
              </div>
              <div style={{ fontSize: 48, fontWeight: 900, color: results.feasibilityColor, lineHeight: 1, fontFamily: 'var(--font-display)' }}>
                {results.requiredSemGPA > 4.0
                  ? '> 4.0'
                  : results.requiredSemGPA < 0
                    ? '—'
                    : results.requiredSemGPA.toFixed(2)}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600 }}>GPA needed</div>
            </div>
          </div>

          {/* Summary Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              {
                label: 'Total Credits',
                value: results.totalCredits.toFixed(0),
                sub: `${completedCredits} done + ${results.remainingCredits} ahead`,
                color: '#6366f1',
              },
              {
                label: 'Quality Points Needed',
                value: results.neededQP.toFixed(1),
                sub: `${results.requiredQP.toFixed(1)} req − ${results.currentQP.toFixed(1)} earned`,
                color: '#f59e0b',
              },
              {
                label: 'GPA Gap',
                value: results.gapFromCurrent >= 0
                  ? `+${results.gapFromCurrent.toFixed(2)}`
                  : results.gapFromCurrent.toFixed(2),
                sub: results.gapFromCurrent > 0
                  ? 'needs to climb'
                  : results.gapFromCurrent < 0
                    ? 'already exceeded'
                    : 'exactly on target',
                color: results.gapFromCurrent > 0 ? '#ef4444' : '#10b981',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  ...cardStyle,
                  background: `linear-gradient(135deg, ${stat.color}22, ${stat.color}0a)`,
                  border: `2px solid ${stat.color}55`,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 6 }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: stat.color, lineHeight: 1, fontFamily: 'var(--font-display)', marginBottom: 4 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 600 }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Required GPA Progress Bar */}
          <div style={cardStyle}>
            <div style={sectionHeaderStyle}>Required Semester GPA vs. Scale</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 700, minWidth: 28 }}>0.0</span>
              <div style={{ flex: 1, height: 14, background: 'var(--surface2)', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <div
                  style={{
                    height: '100%',
                    width: getProgressWidth(Math.min(results.requiredSemGPA, 4)),
                    background: `linear-gradient(90deg, ${results.feasibilityColor}88, ${results.feasibilityColor})`,
                    borderRadius: 8,
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
              <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 700, minWidth: 28, textAlign: 'right' }}>4.0</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text3)', fontWeight: 700 }}>
              <span>C (2.0)</span>
              <span>B (3.0)</span>
              <span style={{ color: '#eab308' }}>B+ (3.3)</span>
              <span style={{ color: '#f97316' }}>A− (3.7)</span>
              <span style={{ color: '#10b981' }}>A (4.0)</span>
            </div>
          </div>

          {/* Semester Roadmap */}
          <div style={cardStyle}>
            <div style={sectionHeaderStyle}>Semester Roadmap</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Array.from({ length: remainingSemesters }, (_, i) => {
                const semNum = i + 1;
                const semCredits = parseFloat(creditsPerSemester) || 15;
                const creditsAfterSem = parseFloat(completedCredits) + semNum * semCredits;
                const qpNeeded = results.requiredQP - results.currentQP;
                const neededThisSem = qpNeeded / remainingSemesters;
                const projectedGPA =
                  (results.currentQP + neededThisSem * semNum) / creditsAfterSem;

                const semColor =
                  results.requiredSemGPA > 4.0
                    ? '#ef4444'
                    : results.requiredSemGPA > 3.7
                      ? '#f97316'
                      : results.requiredSemGPA > 3.3
                        ? '#eab308'
                        : '#10b981';

                return (
                  <div
                    key={semNum}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 14px',
                      background: 'var(--surface2)',
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: `${semColor}22`,
                        border: `2px solid ${semColor}55`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 900,
                        color: semColor,
                        flexShrink: 0,
                      }}
                    >
                      {semNum}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>
                        Semester {semNum}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 600 }}>
                        {creditsAfterSem} total credits after · Projected cumulative: {projectedGPA.toFixed(2)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 2 }}>
                        Need per sem
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 900, color: semColor, lineHeight: 1, fontFamily: 'var(--font-display)' }}>
                        {results.requiredSemGPA > 4.0
                          ? '> 4.0'
                          : results.requiredSemGPA < 0
                            ? '—'
                            : results.requiredSemGPA.toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quality Points Breakdown */}
          <div style={cardStyle}>
            <div style={sectionHeaderStyle}>Quality Points Breakdown</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                {
                  label: 'Current Quality Points',
                  value: results.currentQP.toFixed(2),
                  color: '#6366f1',
                  pct: (results.currentQP / results.requiredQP) * 100,
                },
                {
                  label: 'Still Needed',
                  value: Math.max(results.neededQP, 0).toFixed(2),
                  color: '#f59e0b',
                  pct: (Math.max(results.neededQP, 0) / results.requiredQP) * 100,
                },
              ].map((row) => (
                <div key={row.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text2)' }}>{row.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 900, color: row.color }}>{row.value} QP</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--surface2)', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(Math.max(row.pct, 0), 100)}%`,
                        background: row.color,
                        borderRadius: 6,
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 6, borderTop: '1px solid var(--border)', marginTop: 2 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase' }}>Total Required</span>
                <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--text)' }}>{results.requiredQP.toFixed(2)} QP</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
