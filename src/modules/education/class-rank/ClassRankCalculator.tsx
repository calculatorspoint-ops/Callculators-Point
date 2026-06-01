import React, { useState, useEffect, useCallback } from 'react';

type DistributionPreset = 'competitive' | 'average' | 'lenient' | 'custom';

interface Distribution {
  above37: number;  // % with GPA 3.7+
  range33: number;  // % with GPA 3.3–3.69
  range30: number;  // % with GPA 3.0–3.29
  range25: number;  // % with GPA 2.5–2.99
  below25: number;  // % below 2.5
}

const PRESETS: Record<Exclude<DistributionPreset, 'custom'>, { label: string; dist: Distribution }> = {
  competitive: {
    label: 'Competitive School',
    dist: { above37: 30, range33: 25, range30: 20, range25: 15, below25: 10 },
  },
  average: {
    label: 'Average School',
    dist: { above37: 15, range33: 25, range30: 25, range25: 20, below25: 15 },
  },
  lenient: {
    label: 'Lenient Grading',
    dist: { above37: 40, range33: 30, range30: 15, range25: 10, below25: 5 },
  },
};

interface Result {
  studentsAbove: number;
  rank: number;
  percentile: number;
  isTop10: boolean;
  isTop25: boolean;
  isTop50: boolean;
  cumLaude: boolean;
}

function calcStudentsAbove(gpa: number, classSize: number, dist: Distribution): number {
  // GPA >= 3.7 → everyone in above37 is higher (if student < 3.7) or 0 (if student >= 3.7)
  // We treat each bucket's midpoint and calculate fraction above the student's GPA within each bucket.
  let fractionAbove = 0;

  // Bucket: 3.7–4.0 (midpoint 3.85)
  if (gpa < 3.7) {
    fractionAbove += dist.above37 / 100;
  } else {
    // student is within this bucket: fraction above = linear interpolation
    const frac = (4.0 - gpa) / (4.0 - 3.7);
    fractionAbove += (dist.above37 / 100) * (1 - frac);
  }

  // Bucket: 3.3–3.69 (midpoint 3.495)
  if (gpa < 3.3) {
    fractionAbove += dist.range33 / 100;
  } else if (gpa >= 3.3 && gpa < 3.7) {
    const frac = (3.7 - gpa) / (3.7 - 3.3);
    fractionAbove += (dist.range33 / 100) * (1 - frac);
  }

  // Bucket: 3.0–3.29
  if (gpa < 3.0) {
    fractionAbove += dist.range30 / 100;
  } else if (gpa >= 3.0 && gpa < 3.3) {
    const frac = (3.3 - gpa) / (3.3 - 3.0);
    fractionAbove += (dist.range30 / 100) * (1 - frac);
  }

  // Bucket: 2.5–2.99
  if (gpa < 2.5) {
    fractionAbove += dist.range25 / 100;
  } else if (gpa >= 2.5 && gpa < 3.0) {
    const frac = (3.0 - gpa) / (3.0 - 2.5);
    fractionAbove += (dist.range25 / 100) * (1 - frac);
  }

  // Bucket: below 2.5 (0–2.49)
  if (gpa >= 0 && gpa < 2.5) {
    const frac = (2.5 - gpa) / 2.5;
    fractionAbove += (dist.below25 / 100) * (1 - frac);
  }

  return Math.round(fractionAbove * classSize);
}

export function ClassRankCalculator() {
  const [gpa, setGpa] = useState<string>('3.50');
  const [classSize, setClassSize] = useState<string>('250');
  const [preset, setPreset] = useState<DistributionPreset>('average');
  const [customDist, setCustomDist] = useState<Distribution>({
    above37: 15,
    range33: 25,
    range30: 25,
    range25: 20,
    below25: 15,
  });
  const [result, setResult] = useState<Result | null>(null);
  const [customError, setCustomError] = useState<string>('');

  const getActiveDist = useCallback((): Distribution => {
    if (preset === 'custom') return customDist;
    return PRESETS[preset].dist;
  }, [preset, customDist]);

  const calculate = useCallback(() => {
    const gpaVal = parseFloat(gpa);
    const sizeVal = parseInt(classSize, 10);

    if (isNaN(gpaVal) || gpaVal < 0 || gpaVal > 4.0) return;
    if (isNaN(sizeVal) || sizeVal < 2) return;

    if (preset === 'custom') {
      const total = customDist.above37 + customDist.range33 + customDist.range30 + customDist.range25 + customDist.below25;
      if (Math.abs(total - 100) > 0.5) {
        setCustomError(`Percentages must sum to 100 (currently ${total}%)`);
        setResult(null);
        return;
      }
      setCustomError('');
    }

    const dist = getActiveDist();
    const studentsAbove = calcStudentsAbove(gpaVal, sizeVal, dist);
    const rank = studentsAbove + 1;
    const percentile = ((sizeVal - rank + 1) / sizeVal) * 100;

    setResult({
      studentsAbove,
      rank,
      percentile,
      isTop10: percentile >= 90,
      isTop25: percentile >= 75,
      isTop50: percentile >= 50,
      cumLaude: percentile >= 85,
    });
  }, [gpa, classSize, preset, customDist, getActiveDist]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const ordinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const accentColor = result
    ? result.isTop10
      ? '#7c3aed'
      : result.isTop25
      ? '#2563eb'
      : result.isTop50
      ? '#059669'
      : '#d97706'
    : '#2563eb';

  const customTotal = customDist.above37 + customDist.range33 + customDist.range30 + customDist.range25 + customDist.below25;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* GPA + Class Size */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
            Your GPA (0.00 – 4.00)
          </label>
          <input
            type="number"
            min={0}
            max={4.0}
            step={0.01}
            value={gpa}
            onChange={e => setGpa(e.target.value)}
            style={{ padding: '10px 14px', background: 'var(--surface2)', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 15, color: 'var(--text)', outline: 'none', width: '100%', fontWeight: 700, boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
            Class Size
          </label>
          <input
            type="number"
            min={2}
            step={1}
            value={classSize}
            onChange={e => setClassSize(e.target.value)}
            style={{ padding: '10px 14px', background: 'var(--surface2)', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 15, color: 'var(--text)', outline: 'none', width: '100%', fontWeight: 700, boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* Distribution Preset */}
      <div>
        <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>
          GPA Distribution
        </label>
        <div style={{ display: 'flex', background: 'var(--surface2)', borderRadius: 10, padding: 4, gap: 2 }}>
          {(Object.keys(PRESETS) as Exclude<DistributionPreset, 'custom'>[]).map(key => (
            <button
              key={key}
              onClick={() => setPreset(key)}
              style={{ flex: 1, padding: '8px 4px', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer', background: preset === key ? 'var(--brand)' : 'transparent', color: preset === key ? '#fff' : 'var(--text3)', border: 'none', transition: 'all 0.15s' }}
            >
              {PRESETS[key].label}
            </button>
          ))}
          <button
            onClick={() => setPreset('custom')}
            style={{ flex: 1, padding: '8px 4px', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer', background: preset === 'custom' ? 'var(--brand)' : 'transparent', color: preset === 'custom' ? '#fff' : 'var(--text3)', border: 'none', transition: 'all 0.15s' }}
          >
            Custom
          </button>
        </div>
      </div>

      {/* Distribution Preview (always shown) */}
      <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 10 }}>
          {preset === 'custom' ? 'Custom Distribution (must sum to 100%)' : `${PRESETS[preset as Exclude<DistributionPreset, 'custom'>].label} — Distribution`}
        </div>
        {preset !== 'custom' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { label: '3.70 – 4.00', pct: getActiveDist().above37, color: '#7c3aed' },
              { label: '3.30 – 3.69', pct: getActiveDist().range33, color: '#2563eb' },
              { label: '3.00 – 3.29', pct: getActiveDist().range30, color: '#059669' },
              { label: '2.50 – 2.99', pct: getActiveDist().range25, color: '#d97706' },
              { label: 'Below 2.50', pct: getActiveDist().below25, color: '#dc2626' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--text2)', width: 90, flexShrink: 0 }}>{row.label}</span>
                <div style={{ flex: 1, background: 'var(--surface2)', borderRadius: 4, height: 8 }}>
                  <div style={{ width: `${row.pct}%`, background: row.color, borderRadius: 4, height: 8, transition: 'width 0.3s' }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, color: row.color, width: 32, textAlign: 'right' }}>{row.pct}%</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { key: 'above37' as keyof Distribution, label: '3.70 – 4.00 (%)', color: '#7c3aed' },
              { key: 'range33' as keyof Distribution, label: '3.30 – 3.69 (%)', color: '#2563eb' },
              { key: 'range30' as keyof Distribution, label: '3.00 – 3.29 (%)', color: '#059669' },
              { key: 'range25' as keyof Distribution, label: '2.50 – 2.99 (%)', color: '#d97706' },
              { key: 'below25' as keyof Distribution, label: 'Below 2.50 (%)', color: '#dc2626' },
            ].map(field => (
              <div key={field.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ fontSize: 11, color: 'var(--text2)', width: 110, flexShrink: 0 }}>{field.label}</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  value={customDist[field.key]}
                  onChange={e => setCustomDist(prev => ({ ...prev, [field.key]: parseFloat(e.target.value) || 0 }))}
                  style={{ padding: '6px 10px', background: 'var(--surface2)', border: `1.5px solid ${field.color}55`, borderRadius: 8, fontSize: 13, color: 'var(--text)', outline: 'none', width: 70, fontWeight: 700, boxSizing: 'border-box' }}
                />
                <div style={{ flex: 1, background: 'var(--surface2)', borderRadius: 4, height: 6 }}>
                  <div style={{ width: `${Math.min(customDist[field.key], 100)}%`, background: field.color, borderRadius: 4, height: 6, transition: 'width 0.2s' }} />
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: Math.abs(customTotal - 100) < 0.5 ? '#059669' : '#dc2626' }}>
                Total: {customTotal}% {Math.abs(customTotal - 100) < 0.5 ? '✓' : `(need ${100 - customTotal > 0 ? '+' : ''}${(100 - customTotal).toFixed(0)} more)`}
              </span>
            </div>
            {customError && (
              <div style={{ fontSize: 11, color: '#dc2626', fontWeight: 700, marginTop: 2 }}>{customError}</div>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <>
          {/* Main result card */}
          <div style={{ padding: '20px', background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}0a)`, border: `2px solid ${accentColor}55`, borderRadius: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 8 }}>Estimated Class Rank</div>
            <div style={{ fontSize: 56, fontWeight: 900, color: accentColor, lineHeight: 1, fontFamily: 'var(--font-display)' }}>
              {ordinal(result.rank)}
            </div>
            <div style={{ fontSize: 14, color: 'var(--text2)', marginTop: 6 }}>
              out of <strong style={{ color: 'var(--text)' }}>{parseInt(classSize, 10).toLocaleString()}</strong> students
            </div>
            <div style={{ marginTop: 10, fontSize: 13, color: 'var(--text2)' }}>
              ≈ <strong style={{ color: accentColor }}>{result.studentsAbove}</strong> student{result.studentsAbove !== 1 ? 's' : ''} estimated above you
            </div>
          </div>

          {/* Percentile + badges */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 6 }}>Percentile</div>
              <div style={{ fontSize: 42, fontWeight: 900, color: accentColor, lineHeight: 1, fontFamily: 'var(--font-display)' }}>
                {result.percentile.toFixed(1)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>Top {(100 - result.percentile).toFixed(1)}%</div>
            </div>
            <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 10 }}>Standing Badges</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { label: 'Top 10%', active: result.isTop10, color: '#7c3aed' },
                  { label: 'Top 25%', active: result.isTop25, color: '#2563eb' },
                  { label: 'Top 50%', active: result.isTop50, color: '#059669' },
                ].map(badge => (
                  <div key={badge.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px', borderRadius: 8, background: badge.active ? `${badge.color}18` : 'var(--surface2)', border: `1.5px solid ${badge.active ? badge.color + '66' : 'transparent'}` }}>
                    <span style={{ fontSize: 13 }}>{badge.active ? '✅' : '⬜'}</span>
                    <span style={{ fontSize: 11, fontWeight: 800, color: badge.active ? badge.color : 'var(--text3)' }}>{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cum Laude */}
          <div style={{ padding: '14px', background: result.cumLaude ? 'linear-gradient(135deg, #f59e0b22, #f59e0b0a)' : 'var(--surface)', border: `1.5px solid ${result.cumLaude ? '#f59e0b88' : 'var(--border)'}`, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>{result.cumLaude ? '🎓' : '📚'}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: result.cumLaude ? '#d97706' : 'var(--text3)' }}>
                {result.cumLaude ? 'Cum Laude Eligible' : 'Not Yet Cum Laude Eligible'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
                {result.cumLaude
                  ? `You are in the top ${(100 - result.percentile).toFixed(1)}% — typically qualifies for Cum Laude honors (top 10–15%).`
                  : 'Cum Laude typically requires being in the top 10–15% of your class.'}
              </div>
            </div>
          </div>

          {/* College context */}
          <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 10 }}>
              🎓 College Application Context
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                {
                  icon: '🏛️',
                  label: 'Most Selective Universities',
                  note: 'Prefer top 10% of class',
                  met: result.isTop10,
                  color: '#7c3aed',
                },
                {
                  icon: '🎯',
                  label: 'Public Flagship Universities',
                  note: 'Often auto-admit top 25%',
                  met: result.isTop25,
                  color: '#2563eb',
                },
                {
                  icon: '📋',
                  label: 'Selective State Colleges',
                  note: 'Typically prefer top 50%',
                  met: result.isTop50,
                  color: '#059669',
                },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: item.met ? `${item.color}10` : 'var(--surface2)', border: `1px solid ${item.met ? item.color + '44' : 'var(--border)'}` }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: item.met ? item.color : 'var(--text2)' }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>{item.note}</div>
                  </div>
                  <span style={{ fontSize: 16 }}>{item.met ? '✅' : '❌'}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Disclaimer */}
      <div style={{ padding: '10px 14px', background: 'var(--surface2)', borderRadius: 10, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 13, flexShrink: 0 }}>ℹ️</span>
        <p style={{ fontSize: 11, color: 'var(--text3)', margin: 0, lineHeight: 1.5 }}>
          <strong>Disclaimer:</strong> This is an estimate based on typical GPA distributions. Actual class rank depends on your school's specific grading policies and student performance. Contact your school registrar for an official rank.
        </p>
      </div>
    </div>
  );
}
