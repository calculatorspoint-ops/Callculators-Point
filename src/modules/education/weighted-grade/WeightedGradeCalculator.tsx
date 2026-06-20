import React, { useState, useEffect, useCallback } from 'react';
import { FinanceLayout } from '../../../components/calculator-core/forms/SharedComponents';

interface GradeComponent {
  id: number;
  name: string;
  weight: number;
  score: string; // string to allow blank for what-if mode
}

interface Results {
  currentGrade: number | null;
  letterGrade: string;
  gradeColor: string;
  weightSum: number;
  weightWarning: boolean;
  requiredScores: Record<number, number | null>;
}

const LETTER_GRADES = [
  { letter: 'A+', min: 97, color: '#16a34a' },
  { letter: 'A',  min: 93, color: '#16a34a' },
  { letter: 'A-', min: 90, color: '#16a34a' },
  { letter: 'B+', min: 87, color: '#2563eb' },
  { letter: 'B',  min: 83, color: '#2563eb' },
  { letter: 'B-', min: 80, color: '#2563eb' },
  { letter: 'C+', min: 77, color: '#d97706' },
  { letter: 'C',  min: 73, color: '#d97706' },
  { letter: 'C-', min: 70, color: '#d97706' },
  { letter: 'D',  min: 60, color: '#ea580c' },
  { letter: 'F',  min: 0,  color: '#dc2626' },
];

const TARGET_OPTIONS = [
  { label: 'A  (93%)', value: 93 },
  { label: 'A- (90%)', value: 90 },
  { label: 'B+ (87%)', value: 87 },
  { label: 'B  (83%)', value: 83 },
  { label: 'B- (80%)', value: 80 },
  { label: 'C+ (77%)', value: 77 },
  { label: 'C  (73%)', value: 73 },
  { label: 'D  (63%)', value: 63 },
];

function getLetterGrade(score: number): { letter: string; color: string } {
  for (const g of LETTER_GRADES) {
    if (score >= g.min) return { letter: g.letter, color: g.color };
  }
  return { letter: 'F', color: '#dc2626' };
}

function getProgressColor(score: number): string {
  if (score >= 90) return '#16a34a';
  if (score >= 80) return '#2563eb';
  if (score >= 70) return '#d97706';
  if (score >= 60) return '#ea580c';
  return '#dc2626';
}

let nextId = 5;

const DEFAULT_COMPONENTS: GradeComponent[] = [
  { id: 1, name: 'Assignments', weight: 30, score: '' },
  { id: 2, name: 'Quizzes',     weight: 20, score: '' },
  { id: 3, name: 'Midterm',     weight: 20, score: '' },
  { id: 4, name: 'Final',       weight: 30, score: '' },
];

export function WeightedGradeCalculator() {
  const [components, setComponents] = useState<GradeComponent[]>(DEFAULT_COMPONENTS);
  const [targetGrade, setTargetGrade] = useState<number>(83);
  const [whatIfMode, setWhatIfMode] = useState<boolean>(false);
  const [results, setResults] = useState<Results>({
    currentGrade: null,
    letterGrade: '—',
    gradeColor: 'var(--text3)',
    weightSum: 100,
    weightWarning: false,
    requiredScores: {},
  });

  const calculate = useCallback(() => {
    const weightSum = components.reduce((acc, c) => acc + (c.weight || 0), 0);
    const weightWarning = Math.abs(weightSum - 100) > 0.01;

    const completed = components.filter(c => c.score !== '' && !isNaN(parseFloat(c.score)));
    const blank = components.filter(c => c.score === '' || isNaN(parseFloat(c.score)));

    // Current grade = sum(score * weight) / sum(entered weights)
    const completedWeightSum = completed.reduce((acc, c) => acc + c.weight, 0);
    const completedWeightedScore = completed.reduce(
      (acc, c) => acc + parseFloat(c.score) * c.weight,
      0
    );

    let currentGrade: number | null = null;
    let letterGrade = '—';
    let gradeColor: string = 'var(--text3)';

    if (completedWeightSum > 0) {
      currentGrade = completedWeightedScore / completedWeightSum;
      const lg = getLetterGrade(currentGrade);
      letterGrade = lg.letter;
      gradeColor = lg.color;
    }

    // What-if: Required score on blank items to hit target
    const requiredScores: Record<number, number | null> = {};
    if (whatIfMode && blank.length > 0) {
      const blankWeightSum = blank.reduce((acc, c) => acc + c.weight, 0);
      // target * totalWeight = completedWeightedScore + requiredContribution
      // requiredContribution = target * totalWeight - completedWeightedScore
      // required score per blank item (equal distribution assumption would be wrong;
      // instead we show the single required score IF all blanks score equally)
      // Required = (target * weightSum - completedWeightedScore) / blankWeightSum
      if (blankWeightSum > 0) {
        const needed = ((targetGrade * weightSum) - completedWeightedScore) / blankWeightSum;
        for (const c of blank) {
          requiredScores[c.id] = needed;
        }
      }
    }

    setResults({ currentGrade, letterGrade, gradeColor, weightSum, weightWarning, requiredScores });
  }, [components, targetGrade, whatIfMode]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const addComponent = () => {
    setComponents(prev => [
      ...prev,
      { id: nextId++, name: 'Component', weight: 0, score: '' },
    ]);
  };

  const removeComponent = (id: number) => {
    setComponents(prev => prev.filter(c => c.id !== id));
  };

  const updateComponent = (id: number, field: keyof GradeComponent, value: string | number) => {
    setComponents(prev =>
      prev.map(c => c.id === id ? { ...c, [field]: value } : c)
    );
  };

  const progressPct = results.currentGrade !== null
    ? Math.min(100, Math.max(0, results.currentGrade))
    : 0;
  const progressColor = results.currentGrade !== null
    ? getProgressColor(results.currentGrade)
    : 'var(--border)';

  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Categories"
      inputContent={<>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {/* What-If Toggle */}
        <div style={{
          display: 'flex', alignItems: 'center', background: 'var(--surface2)',
          border: '1.5px solid var(--border)', borderRadius: 10, padding: '4px 6px', gap: 4,
        }}>
          <button
            onClick={() => setWhatIfMode(false)}
            style={{
              flex: 1, padding: '7px 14px', borderRadius: 7, fontSize: 11, fontWeight: 700,
              cursor: 'pointer', border: 'none',
              background: !whatIfMode ? 'var(--brand)' : 'transparent',
              color: !whatIfMode ? '#fff' : 'var(--text3)',
            }}
          >
            Current Grade
          </button>
          <button
            onClick={() => setWhatIfMode(true)}
            style={{
              flex: 1, padding: '7px 14px', borderRadius: 7, fontSize: 11, fontWeight: 700,
              cursor: 'pointer', border: 'none',
              background: whatIfMode ? 'var(--brand)' : 'transparent',
              color: whatIfMode ? '#fff' : 'var(--text3)',
            }}
          >
            What-If Mode
          </button>
        </div>

        {/* Target Grade (shown in what-if mode) */}
        {whatIfMode && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase' }}>
              Target
            </span>
            <select
              value={targetGrade}
              onChange={e => setTargetGrade(Number(e.target.value))}
              style={{
                padding: '8px 12px', background: 'var(--surface2)', border: '1.5px solid var(--border)',
                borderRadius: 10, fontSize: 13, color: 'var(--text)', outline: 'none', fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {TARGET_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      </>
      }
      resultContent={<>
      {/* Grade Result Card */}
      <div style={{
        padding: '22px 24px',
        background: results.currentGrade !== null
          ? `linear-gradient(135deg, ${results.gradeColor}22, ${results.gradeColor}0a)`
          : 'var(--surface)',
        border: results.currentGrade !== null
          ? `2px solid ${results.gradeColor}55`
          : '1px solid var(--border)',
        borderRadius: 16,
        display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
      }}>
        {/* Letter Grade Badge */}
        <div style={{ textAlign: 'center', minWidth: 80 }}>
          <div style={{
            fontSize: 64, fontWeight: 900, color: results.gradeColor, lineHeight: 1,
            fontFamily: 'var(--font-display)',
          }}>
            {results.letterGrade}
          </div>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginTop: 4 }}>
            Letter Grade
          </div>
        </div>

        {/* Numeric Grade + Progress */}
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
            <span style={{
              fontSize: 48, fontWeight: 900, color: results.gradeColor, lineHeight: 1,
              fontFamily: 'var(--font-display)',
            }}>
              {results.currentGrade !== null ? results.currentGrade.toFixed(2) : '—'}
            </span>
            {results.currentGrade !== null && (
              <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text3)' }}>%</span>
            )}
          </div>
          {/* Progress Bar */}
          <div style={{
            height: 10, background: 'var(--surface2)', borderRadius: 999,
            border: '1px solid var(--border)', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${progressPct}%`,
              background: progressColor, borderRadius: 999,
              transition: 'width 0.4s ease, background 0.3s ease',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)' }}>0%</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)' }}>50%</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)' }}>100%</span>
          </div>
        </div>

        {/* Grade Scale Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {[
            { label: 'A+/A/A-', range: '90–100', color: '#16a34a' },
            { label: 'B+/B/B-', range: '80–89',  color: '#2563eb' },
            { label: 'C+/C/C-', range: '70–79',  color: '#d97706' },
            { label: 'D',       range: '60–69',  color: '#ea580c' },
            { label: 'F',       range: 'Below 60', color: '#dc2626' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text2)' }}>
                {item.label}: {item.range}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Weight Warning */}
      {results.weightWarning && (
        <div style={{
          padding: '10px 14px',
          background: 'linear-gradient(135deg, #f5950022, #f595000a)',
          border: '1.5px solid #f5950066',
          borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          <div>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#b45309' }}>
              Weights sum to {results.weightSum.toFixed(1)}%
            </span>
            <span style={{ fontSize: 12, color: '#92400e', marginLeft: 6 }}>
              — adjust to reach exactly 100% for accurate results.
            </span>
          </div>
        </div>
      )}

      {/* Grade Components Table */}
      <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase' }}>
            Grade Components
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontSize: 11, fontWeight: 800,
              color: results.weightWarning ? '#b45309' : '#16a34a',
            }}>
              Σ Weight: {results.weightSum.toFixed(1)}%
            </span>
            <button
              onClick={addComponent}
              style={{
                padding: '6px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                cursor: 'pointer', border: '1.5px solid var(--brand)',
                background: 'transparent', color: 'var(--brand)',
              }}
            >
              ➕ Add
            </button>
          </div>
        </div>

        {/* Column Headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 90px 130px 36px',
          gap: 8, marginBottom: 8, padding: '0 4px',
        }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase' }}>Name</span>
          <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase' }}>Weight %</span>
          <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase' }}>
            Score (0–100){whatIfMode ? ' / Required' : ''}
          </span>
          <span />
        </div>

        {/* Component Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {components.map(comp => {
            const isBlank = comp.score === '' || isNaN(parseFloat(comp.score));
            const requiredScore = results.requiredScores[comp.id];
            const reqDisplay = requiredScore !== undefined && requiredScore !== null
              ? requiredScore.toFixed(1)
              : null;
            const reqColor = reqDisplay !== null
              ? (parseFloat(reqDisplay) > 100 ? '#dc2626' : parseFloat(reqDisplay) < 0 ? '#16a34a' : '#2563eb')
              : undefined;

            return (
              <div
                key={comp.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 90px 130px 36px',
                  gap: 8, alignItems: 'center',
                }}
              >
                {/* Name */}
                <input
                  type="text"
                  value={comp.name}
                  onChange={e => updateComponent(comp.id, 'name', e.target.value)}
                  placeholder="Component name"
                  style={{
                    padding: '10px 14px', background: 'var(--surface2)',
                    border: '1.5px solid var(--border)', borderRadius: 10,
                    fontSize: 14, color: 'var(--text)', outline: 'none',
                    width: '100%', fontWeight: 600, boxSizing: 'border-box',
                  }}
                />

                {/* Weight */}
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={comp.weight}
                    onChange={e => updateComponent(comp.id, 'weight', parseFloat(e.target.value) || 0)}
                    style={{
                      padding: '10px 28px 10px 14px', background: 'var(--surface2)',
                      border: '1.5px solid var(--border)', borderRadius: 10,
                      fontSize: 14, color: 'var(--text)', outline: 'none',
                      width: '100%', fontWeight: 700, boxSizing: 'border-box',
                    }}
                  />
                  <span style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    fontSize: 13, fontWeight: 800, color: 'var(--text3)', pointerEvents: 'none',
                  }}>%</span>
                </div>

                {/* Score / Required */}
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={comp.score}
                    onChange={e => updateComponent(comp.id, 'score', e.target.value)}
                    placeholder={
                      whatIfMode && isBlank && reqDisplay !== null
                        ? `Need: ${reqDisplay}`
                        : 'Enter score'
                    }
                    style={{
                      padding: '10px 14px', background: 'var(--surface2)',
                      border: `1.5px solid ${
                        whatIfMode && isBlank && reqDisplay !== null ? `${reqColor}88` : 'var(--border)'
                      }`,
                      borderRadius: 10, fontSize: 14,
                      color: comp.score !== '' ? 'var(--text)' : 'var(--text3)',
                      outline: 'none', width: '100%', fontWeight: 700, boxSizing: 'border-box',
                    }}
                  />
                  {whatIfMode && isBlank && reqDisplay !== null && (
                    <div style={{
                      position: 'absolute', right: -4, top: -8,
                      background: reqColor, color: '#fff',
                      fontSize: 9, fontWeight: 800, padding: '2px 5px', borderRadius: 5,
                      whiteSpace: 'nowrap',
                    }}>
                      {parseFloat(reqDisplay) > 100
                        ? '> 100 — impossible'
                        : parseFloat(reqDisplay) < 0
                        ? 'Already met!'
                        : `Need ${reqDisplay}%`}
                    </div>
                  )}
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeComponent(comp.id)}
                  disabled={components.length <= 1}
                  style={{
                    width: 32, height: 32, borderRadius: 8, fontSize: 13, fontWeight: 700,
                    cursor: components.length <= 1 ? 'not-allowed' : 'pointer',
                    border: '1.5px solid var(--border)',
                    background: 'transparent',
                    color: components.length <= 1 ? 'var(--text3)' : '#dc2626',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: components.length <= 1 ? 0.4 : 1,
                    flexShrink: 0,
                  }}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* What-If Explanation */}
      {whatIfMode && (
        <div style={{
          padding: '10px 14px',
          background: 'linear-gradient(135deg, #2563eb22, #2563eb0a)',
          border: '1.5px solid #2563eb44',
          borderRadius: 10,
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#1d4ed8', marginBottom: 3 }}>
            💡 What-If Mode Active — Target: {targetGrade}%
          </div>
          <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
            Leave score fields <strong>blank</strong> for items not yet completed.
            The calculator will show the <strong>required score</strong> on those items to reach your target grade.
            Required scores above 100% are impossible; below 0% means you've already exceeded the target.
          </div>
        </div>
      )}

      {/* Breakdown Table */}
      {components.some(c => c.score !== '' && !isNaN(parseFloat(c.score))) && (
        <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 10 }}>
            Score Breakdown
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {components.map(comp => {
              const score = parseFloat(comp.score);
              const hasScore = comp.score !== '' && !isNaN(score);
              const contribution = hasScore ? (score * comp.weight) / 100 : null;
              const barPct = hasScore ? Math.min(100, score) : 0;
              const barColor = hasScore ? getProgressColor(score) : 'var(--border)';

              return (
                <div key={comp.id} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{comp.name}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)' }}>({comp.weight}%)</span>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      {hasScore && (
                        <span style={{ fontSize: 12, fontWeight: 800, color: barColor }}>
                          {score.toFixed(1)}%
                        </span>
                      )}
                      {contribution !== null ? (
                        <span style={{
                          fontSize: 11, fontWeight: 700,
                          color: 'var(--text3)', minWidth: 60, textAlign: 'right',
                        }}>
                          +{contribution.toFixed(2)} pts
                        </span>
                      ) : (
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', fontStyle: 'italic' }}>
                          not entered
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{
                    height: 5, background: 'var(--surface2)', borderRadius: 999,
                    border: '1px solid var(--border)', overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%', width: `${barPct}%`,
                      background: barColor, borderRadius: 999,
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total row */}
          <div style={{
            marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text2)', textTransform: 'uppercase' }}>
              Current Grade
            </span>
            <span style={{ fontSize: 18, fontWeight: 900, color: results.gradeColor, fontFamily: 'var(--font-display)' }}>
              {results.currentGrade !== null ? `${results.currentGrade.toFixed(2)}%` : '—'}
              {results.currentGrade !== null && (
                <span style={{ fontSize: 14, marginLeft: 8, color: results.gradeColor }}>
                  ({results.letterGrade})
                </span>
              )}
            </span>
          </div>
        </div>
      )}

      {/* GPA Reference */}
      <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 10 }}>
          US Grading Scale Reference
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
          gap: 6,
        }}>
          {[
            { letter: 'A+', range: '97–100', gpa: '4.0', color: '#16a34a' },
            { letter: 'A',  range: '93–96',  gpa: '4.0', color: '#16a34a' },
            { letter: 'A-', range: '90–92',  gpa: '3.7', color: '#16a34a' },
            { letter: 'B+', range: '87–89',  gpa: '3.3', color: '#2563eb' },
            { letter: 'B',  range: '83–86',  gpa: '3.0', color: '#2563eb' },
            { letter: 'B-', range: '80–82',  gpa: '2.7', color: '#2563eb' },
            { letter: 'C+', range: '77–79',  gpa: '2.3', color: '#d97706' },
            { letter: 'C',  range: '73–76',  gpa: '2.0', color: '#d97706' },
            { letter: 'C-', range: '70–72',  gpa: '1.7', color: '#d97706' },
            { letter: 'D',  range: '60–69',  gpa: '1.0', color: '#ea580c' },
            { letter: 'F',  range: 'Below 60', gpa: '0.0', color: '#dc2626' },
          ].map(g => (
            <div
              key={g.letter}
              style={{
                padding: '7px 10px',
                background: `${g.color}11`,
                border: `1px solid ${g.color}33`,
                borderRadius: 8,
                display: 'flex', flexDirection: 'column', gap: 1,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 900, color: g.color, fontFamily: 'var(--font-display)' }}>
                {g.letter}
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text2)' }}>{g.range}%</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text3)' }}>GPA {g.gpa}</span>
            </div>
          ))}
        </div>
      </div>

      </>
    }
    />
  );
}
