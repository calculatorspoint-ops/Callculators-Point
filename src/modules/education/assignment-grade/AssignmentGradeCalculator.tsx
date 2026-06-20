import React, { useState, useEffect, useCallback } from 'react';
import { FinanceLayout } from '../../../components/calculator-core/forms/SharedComponents';

// ── Grade scale ──────────────────────────────────────────────────────────────
const GRADE_SCALE: { min: number; letter: string; gpa: number; color: string }[] = [
  { min: 97, letter: 'A+', gpa: 4.0,  color: '#15803d' },
  { min: 93, letter: 'A',  gpa: 4.0,  color: '#16a34a' },
  { min: 90, letter: 'A−', gpa: 3.7,  color: '#22c55e' },
  { min: 87, letter: 'B+', gpa: 3.3,  color: '#0284c7' },
  { min: 83, letter: 'B',  gpa: 3.0,  color: '#0ea5e9' },
  { min: 80, letter: 'B−', gpa: 2.7,  color: '#38bdf8' },
  { min: 77, letter: 'C+', gpa: 2.3,  color: '#7c3aed' },
  { min: 73, letter: 'C',  gpa: 2.0,  color: '#8b5cf6' },
  { min: 70, letter: 'C−', gpa: 1.7,  color: '#a78bfa' },
  { min: 67, letter: 'D+', gpa: 1.3,  color: '#d97706' },
  { min: 63, letter: 'D',  gpa: 1.0,  color: '#f59e0b' },
  { min: 60, letter: 'D−', gpa: 0.7,  color: '#fbbf24' },
  { min:  0, letter: 'F',  gpa: 0.0,  color: '#dc2626' },
];

function getGrade(pct: number): { letter: string; gpa: number; color: string } {
  for (const g of GRADE_SCALE) {
    if (pct >= g.min) return g;
  }
  return { letter: 'F', gpa: 0.0, color: '#dc2626' };
}

// ── Types ────────────────────────────────────────────────────────────────────
interface Assignment {
  id: number;
  name: string;
  score: string;
  maxScore: string;
  weight: string;
}

let _nextId = 4;

const DEFAULT_ASSIGNMENTS: Assignment[] = [
  { id: 1, name: 'Homework 1',  score: '88',  maxScore: '100', weight: '20' },
  { id: 2, name: 'Lab Report',  score: '74',  maxScore: '100', weight: '30' },
  { id: 3, name: 'Midterm Exam',score: '91',  maxScore: '100', weight: '50' },
];

// ── Bar colours (rotates) ────────────────────────────────────────────────────
const BAR_COLORS = ['#6366f1','#0ea5e9','#22c55e','#f59e0b','#ef4444','#8b5cf6','#14b8a6','#f97316'];

// ── Component ────────────────────────────────────────────────────────────────
export function AssignmentGradeCalculator() {
  const [assignments, setAssignments] = useState<Assignment[]>(DEFAULT_ASSIGNMENTS);
  const [dropLowest, setDropLowest] = useState(false);
  const [result, setResult] = useState<any>(null);

  // ── Shared input style ─────────────────────────────────────────────────────
  const inp = {
    padding: '8px 10px',
    background: 'var(--surface2)',
    border: '1.5px solid var(--border)',
    borderRadius: 8,
    fontSize: 13,
    color: 'var(--text)',
    outline: 'none',
    width: '100%',
    fontWeight: 700,
  } as React.CSSProperties;

  // ── Calculation ────────────────────────────────────────────────────────────
  const calc = useCallback(() => {
    const items = assignments.map((a) => {
      const score    = parseFloat(a.score)    || 0;
      const maxScore = parseFloat(a.maxScore) || 100;
      const weight   = parseFloat(a.weight)   || 0;
      const pct      = maxScore > 0 ? (score / maxScore) * 100 : 0;
      const contrib  = pct * (weight / 100);
      return { ...a, scoreNum: score, maxNum: maxScore, weightNum: weight, pct, contrib };
    });

    // Drop-lowest: find the item whose pct is the lowest, remove it from calc
    let droppedId: number | null = null;
    if (dropLowest && items.length > 1) {
      const lowest = items.reduce((min, cur) => (cur.pct < min.pct ? cur : min), items[0]);
      droppedId = lowest.id;
    }

    const active = droppedId !== null ? items.filter((i) => i.id !== droppedId) : items;

    const totalWeight = active.reduce((s, i) => s + i.weightNum, 0);
    const rawGrade    = active.reduce((s, i) => s + i.contrib, 0);

    // If weights don't sum to 100, calculate projected grade on completed portion
    const isProjected = Math.abs(totalWeight - 100) > 0.01;
    const finalGrade  = isProjected && totalWeight > 0
      ? (rawGrade / totalWeight) * 100
      : rawGrade;

    const grade = getGrade(finalGrade);

    // Weight sum across all items (including dropped, for display)
    const allWeightSum = items.reduce((s, i) => s + i.weightNum, 0);

    setResult({
      items,
      active,
      droppedId,
      totalWeight,
      allWeightSum,
      rawGrade,
      finalGrade,
      isProjected,
      grade,
    });
  }, [assignments, dropLowest]);

  useEffect(() => { calc(); }, [calc]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  function updateField(id: number, field: keyof Assignment, value: string) {
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
  }

  function addAssignment() {
    setAssignments((prev) => [
      ...prev,
      { id: _nextId++, name: `Assignment ${prev.length + 1}`, score: '0', maxScore: '100', weight: '0' },
    ]);
  }

  function removeAssignment(id: number) {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  }

  // ── Weight-sum colour ──────────────────────────────────────────────────────
  function weightColor(sum: number) {
    if (Math.abs(sum - 100) < 0.01) return '#16a34a';
    if (sum >= 90 && sum < 100) return '#d97706';
    return '#dc2626';
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Assignments"
      inputContent={<>

      {/* ── Controls bar ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        {/* Drop-lowest toggle */}
        <div style={{ display: 'flex', gap: 6, background: 'var(--surface2)', padding: 3, borderRadius: 9, border: '1px solid var(--border)' }}>
          {([false, true] as const).map((v) => (
            <button key={String(v)} onClick={() => setDropLowest(v)}
              style={{
                padding: '7px 14px', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                background: dropLowest === v ? 'var(--brand)' : 'transparent',
                color: dropLowest === v ? '#fff' : 'var(--text3)', border: 'none',
              }}>
              {v ? '🗑 Drop Lowest' : '📋 All Items'}
            </button>
          ))}
        </div>

        {/* Weight sum pill */}
        {result && (
          <div style={{
            padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 800,
            background: `${weightColor(result.allWeightSum)}22`,
            color: weightColor(result.allWeightSum),
            border: `1.5px solid ${weightColor(result.allWeightSum)}55`,
          }}>
            Weights: {result.allWeightSum.toFixed(1)} / 100%
          </div>
        )}
      </div>

      {/* ── Assignment table ──────────────────────────────────────────────── */}
      <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', gap: 8, alignItems: 'center' }}>
          {['Assignment', 'Score', 'Max', 'Weight %', '  %', ''].map((h, i) => (
            <div key={i} style={{ fontSize: 9, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</div>
          ))}
        </div>

        {/* Rows */}
        {assignments.map((a, idx) => {
          const rowResult = result?.items.find((r: any) => r.id === a.id);
          const isDropped = result?.droppedId === a.id;
          const rowPct    = rowResult ? rowResult.pct : 0;
          const pctColor  = getGrade(rowPct).color;

          return (
            <div key={a.id} style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', gap: 8, alignItems: 'center',
              opacity: isDropped ? 0.4 : 1,
              padding: '8px 10px',
              background: isDropped ? 'var(--surface2)' : 'transparent',
              borderRadius: 8,
              border: isDropped ? '1.5px dashed var(--border)' : '1.5px solid transparent',
              position: 'relative',
            }}>
              {/* Name */}
              <input
                type="text" value={a.name} style={inp}
                onChange={(e) => updateField(a.id, 'name', e.target.value)}
                placeholder="Assignment name"
              />
              {/* Score */}
              <input
                type="number" value={a.score} style={inp}
                onChange={(e) => updateField(a.id, 'score', e.target.value)}
                min={0} placeholder="0"
              />
              {/* Max */}
              <input
                type="number" value={a.maxScore} style={inp}
                onChange={(e) => updateField(a.id, 'maxScore', e.target.value)}
                min={1} placeholder="100"
              />
              {/* Weight */}
              <input
                type="number" value={a.weight} style={inp}
                onChange={(e) => updateField(a.id, 'weight', e.target.value)}
                min={0} max={100} placeholder="0"
              />
              {/* Live pct */}
              <div style={{ fontSize: 13, fontWeight: 800, color: pctColor, textAlign: 'center' }}>
                {rowPct.toFixed(1)}%
                {isDropped && <div style={{ fontSize: 9, color: 'var(--text3)', fontWeight: 700 }}>DROPPED</div>}
              </div>
              {/* Remove */}
              <button
                onClick={() => removeAssignment(a.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 14, padding: '2px 4px', borderRadius: 5, lineHeight: 1 }}
                title="Remove"
              >✕</button>
            </div>
          );
        })}

        {/* Add button */}
        <button onClick={addAssignment} style={{
          marginTop: 4, padding: '9px', borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: 'pointer',
          background: 'var(--brand-l)', color: 'var(--brand)', border: '1.5px dashed var(--brand)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          ➕ Add Assignment
        </button>
      </div>

      </>
      }
      resultContent={<>
      {/* ── Result card ───────────────────────────────────────────────────── */}
      {result && (
        <>
          <div style={{
            padding: '28px 24px',
            background: `linear-gradient(135deg, ${result.grade.color}22, ${result.grade.color}0a)`,
            border: `2px solid ${result.grade.color}55`,
            borderRadius: 18, textAlign: 'center',
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: result.grade.color, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>
              {result.isProjected ? '📊 Projected Grade (Partial Weights)' : '🎓 Final Course Grade'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
              {/* Percentage */}
              <div>
                <div style={{ fontSize: 64, fontWeight: 900, color: result.grade.color, lineHeight: 1, fontFamily: 'var(--font-display)' }}>
                  {result.finalGrade.toFixed(1)}%
                </div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>
                  {result.isProjected ? `Based on ${result.totalWeight.toFixed(1)}% of course weight` : 'Course total'}
                </div>
              </div>
              {/* Letter + GPA */}
              <div style={{
                padding: '14px 22px', background: `${result.grade.color}22`,
                border: `2px solid ${result.grade.color}44`, borderRadius: 14,
              }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: result.grade.color, lineHeight: 1, fontFamily: 'var(--font-display)' }}>
                  {result.grade.letter}
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: result.grade.color, marginTop: 4 }}>
                  GPA {result.grade.gpa.toFixed(1)}
                </div>
              </div>
            </div>
          </div>

          {/* ── Visual breakdown bar ─────────────────────────────────────── */}
          <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 10 }}>
              Grade Contribution Breakdown
            </p>
            {/* Stacked bar */}
            <div style={{ display: 'flex', height: 22, borderRadius: 8, overflow: 'hidden', gap: 1, marginBottom: 12 }}>
              {result.active.map((item: any, idx: number) => {
                const totalContrib = result.active.reduce((s: number, i: any) => s + i.contrib, 0) || 1;
                const frac = (item.contrib / totalContrib) * 100;
                const col = BAR_COLORS[assignments.findIndex((a) => a.id === item.id) % BAR_COLORS.length];
                return (
                  <div key={item.id} title={`${item.name}: ${item.contrib.toFixed(2)}% contribution`}
                    style={{ flex: `0 0 ${frac}%`, background: col, minWidth: frac > 2 ? undefined : 1 }} />
                );
              })}
            </div>
            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {result.active.map((item: any, idx: number) => {
                const col = BAR_COLORS[assignments.findIndex((a) => a.id === item.id) % BAR_COLORS.length];
                const totalContrib = result.active.reduce((s: number, i: any) => s + i.contrib, 0) || 1;
                const barPct = (item.contrib / totalContrib) * 100;
                return (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: col, flexShrink: 0 }} />
                    <div style={{ fontSize: 12, color: 'var(--text)', fontWeight: 600, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {item.pct.toFixed(1)}% × {item.weightNum}% wt
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: col, whiteSpace: 'nowrap', minWidth: 52, textAlign: 'right' }}>
                      +{item.contrib.toFixed(2)}%
                    </div>
                    {/* mini bar */}
                    <div style={{ width: 60, height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden', flexShrink: 0 }}>
                      <div style={{ width: `${barPct}%`, height: '100%', background: col, borderRadius: 99 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Impact analysis ──────────────────────────────────────────── */}
          <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 10 }}>
              Per-Item Impact Analysis
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
              {result.items.map((item: any) => {
                const isDropped = result.droppedId === item.id;
                const itemGrade = getGrade(item.pct);
                return (
                  <div key={item.id} style={{
                    padding: '10px 12px',
                    background: isDropped ? 'var(--surface2)' : `${itemGrade.color}10`,
                    border: `1.5px solid ${isDropped ? 'var(--border)' : itemGrade.color + '44'}`,
                    borderRadius: 10,
                    opacity: isDropped ? 0.55 : 1,
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name} {isDropped && '(dropped)'}
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: itemGrade.color, lineHeight: 1, fontFamily: 'var(--font-display)' }}>
                      {item.pct.toFixed(1)}%
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>
                      {item.scoreNum} / {item.maxNum}
                    </div>
                    <div style={{ width: '100%', height: 4, background: 'var(--border)', borderRadius: 99, marginTop: 7, overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(item.pct, 100)}%`, height: '100%', background: itemGrade.color, borderRadius: 99 }} />
                    </div>
                    <div style={{ fontSize: 10, color: itemGrade.color, fontWeight: 700, marginTop: 5 }}>
                      {isDropped ? '—' : `Adds ${item.contrib.toFixed(2)}% to total`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Grade scale reference ─────────────────────────────────────── */}
          <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 10 }}>Grade Scale Reference</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 6 }}>
              {GRADE_SCALE.map((g) => {
                const isActive = result.grade.letter === g.letter;
                return (
                  <div key={g.letter} style={{
                    padding: '7px 10px', borderRadius: 8,
                    background: isActive ? `${g.color}22` : 'var(--surface2)',
                    border: `1.5px solid ${isActive ? g.color : 'var(--border)'}`,
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 15, fontWeight: 900, color: g.color }}>{g.letter}</div>
                    <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 700 }}>
                      {g.min === 0 ? '0' : g.min}%+
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text3)' }}>GPA {g.gpa.toFixed(1)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
      </>
    }
    />
  );
}
