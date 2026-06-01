import React, { useState, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
type Scale = '4.0' | '5.0' | '7.0' | '10.0' | 'Percentage';

interface ConversionResult {
  normalized: number;
  gpa4: number;
  gpa5: number;
  gpa7: number;
  gpa10: number;
  percentage: number;
  descriptor: { label: string; grade: string; color: string };
  ausGrade: string;
}

// ─── Country Presets ──────────────────────────────────────────────────────────
const PRESETS: { flag: string; country: string; scale: Scale; example: string; note: string }[] = [
  { flag: '🇺🇸', country: 'USA / Canada', scale: '4.0',        example: '3.7',  note: 'Standard 4.0 GPA scale' },
  { flag: '🇵🇰', country: 'Pakistan (HEC)', scale: '4.0',      example: '3.5',  note: 'HEC 4.0 scale' },
  { flag: '🇩🇪', country: 'Germany',        scale: '5.0',       example: '1.7',  note: 'Inverse: 1.0 = best, 5.0 = fail' },
  { flag: '🇮🇳', country: 'India',          scale: '10.0',      example: '8.5',  note: 'CGPA on 10.0 scale' },
  { flag: '🇦🇺', country: 'Australia',      scale: '7.0',       example: '5.5',  note: 'GPA 4.0+ = HD, 3.0+ = D' },
  { flag: '🇬🇧', country: 'UK',             scale: 'Percentage', example: '72', note: 'Percentage-based grading' },
];

// ─── Grade Descriptors ────────────────────────────────────────────────────────
function getDescriptor(normalized: number): { label: string; grade: string; color: string } {
  if (normalized >= 0.93) return { grade: 'A',  label: 'Excellent',      color: '#15803d' };
  if (normalized >= 0.83) return { grade: 'A−', label: 'Very Good',      color: '#16a34a' };
  if (normalized >= 0.73) return { grade: 'B+', label: 'Good',           color: '#0284c7' };
  if (normalized >= 0.63) return { grade: 'B',  label: 'Above Average',  color: '#7c3aed' };
  if (normalized >= 0.50) return { grade: 'C',  label: 'Average',        color: '#d97706' };
  if (normalized >= 0.33) return { grade: 'D',  label: 'Pass',           color: '#ea580c' };
  return                         { grade: 'F',  label: 'Fail',           color: '#dc2626' };
}

// ─── Australia Grade Label ────────────────────────────────────────────────────
function getAusGrade(gpa7: number): string {
  if (gpa7 >= 4.0) return 'HD — High Distinction';
  if (gpa7 >= 3.0) return 'D — Distinction';
  if (gpa7 >= 2.0) return 'C — Credit';
  if (gpa7 >= 1.0) return 'P — Pass';
  return 'F — Fail';
}

// ─── Core Conversion ──────────────────────────────────────────────────────────
function normalize(value: number, scale: Scale): number {
  // Germany: inverse scale — 1.0 = best, 5.0 = worst (failing < 4.0 for most unis)
  if (scale === '5.0') {
    // Clamp to [1, 5]
    const clamped = Math.min(5, Math.max(1, value));
    return (5 - clamped) / (5 - 1); // 1.0 → 1.0, 5.0 → 0.0
  }
  const maxMap: Record<Scale, number> = {
    '4.0': 4,
    '5.0': 5,   // handled above but keep for fallback
    '7.0': 7,
    '10.0': 10,
    'Percentage': 100,
  };
  const max = maxMap[scale];
  return Math.min(1, Math.max(0, value / max));
}

function convert(value: number, scale: Scale): ConversionResult {
  const normalized = normalize(value, scale);
  const gpa4       = parseFloat((normalized * 4).toFixed(2));
  // Germany result: inverse back — a normalized value → German grade
  const gpa5       = parseFloat((5 - normalized * 4).toFixed(2));   // 1.0–5.0, lower = better
  const gpa7       = parseFloat((normalized * 7).toFixed(2));
  const gpa10      = parseFloat((normalized * 10).toFixed(2));
  const percentage = parseFloat((normalized * 100).toFixed(1));
  const descriptor = getDescriptor(normalized);
  const ausGrade   = getAusGrade(gpa7);

  return { normalized, gpa4, gpa5, gpa7, gpa10, percentage, descriptor, ausGrade };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const SCALE_LABELS: Record<Scale, string> = {
  '4.0': '4.0 Scale',
  '5.0': '5.0 Scale (DE)',
  '7.0': '7.0 Scale (AU)',
  '10.0': '10.0 Scale (IN)',
  'Percentage': 'Percentage (%)',
};

const SCALE_MAX: Record<Scale, number> = {
  '4.0': 4,
  '5.0': 5,
  '7.0': 7,
  '10.0': 10,
  'Percentage': 100,
};

const SCALE_STEP: Record<Scale, number> = {
  '4.0': 0.01,
  '5.0': 0.01,
  '7.0': 0.01,
  '10.0': 0.01,
  'Percentage': 0.1,
};

const SCALE_MIN: Record<Scale, number> = {
  '4.0': 0,
  '5.0': 1,   // German grading starts at 1.0
  '7.0': 0,
  '10.0': 0,
  'Percentage': 0,
};

// ─── Component ────────────────────────────────────────────────────────────────
export function GPAConverterCalculator() {
  const [scale,  setScale]  = useState<Scale>('4.0');
  const [rawVal, setRawVal] = useState('3.70');
  const [result, setResult] = useState<ConversionResult | null>(null);

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
    const v = parseFloat(rawVal);
    if (isNaN(v)) { setResult(null); return; }
    setResult(convert(v, scale));
  }, [rawVal, scale]);

  useEffect(() => { calc(); }, [calc]);

  // When scale changes, clamp the value if needed
  const handleScaleChange = (newScale: Scale) => {
    setScale(newScale);
    const v = parseFloat(rawVal);
    if (!isNaN(v)) {
      const max = SCALE_MAX[newScale];
      const min = SCALE_MIN[newScale];
      if (v > max) setRawVal(String(max));
      if (v < min) setRawVal(String(min));
    }
  };

  const color = result?.descriptor.color ?? '#7c3aed';

  // Conversion table rows — show "Your GPA | 4.0 | 5.0(DE) | 7.0 | 10.0 | %"
  const tableRows = result
    ? [
        { label: 'Your Input', value: rawVal, unit: SCALE_LABELS[scale], highlight: true },
        { label: '4.0 Scale',  value: result.gpa4.toFixed(2),  unit: '/ 4.00', highlight: scale === '4.0' },
        { label: '5.0 (Germany)', value: result.gpa5.toFixed(2), unit: '/ 5.00 (lower=better)', highlight: scale === '5.0' },
        { label: '7.0 (Australia)', value: result.gpa7.toFixed(2), unit: '/ 7.00', highlight: scale === '7.0' },
        { label: '10.0 (India)', value: result.gpa10.toFixed(2), unit: '/ 10.00', highlight: scale === '10.0' },
        { label: 'Percentage', value: `${result.percentage}%`, unit: '/ 100%', highlight: scale === 'Percentage' },
      ]
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Country Presets ─────────────────────────────────────────────────── */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 8 }}>
          Country Presets
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {PRESETS.map((p) => (
            <button
              key={p.country}
              onClick={() => {
                handleScaleChange(p.scale);
                setRawVal(p.example);
              }}
              title={p.note}
              style={{
                padding: '8px 6px',
                borderRadius: 9,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                background: scale === p.scale ? 'var(--brand)' : 'var(--surface2)',
                color: scale === p.scale ? '#fff' : 'var(--text2)',
                border: `1.5px solid ${scale === p.scale ? 'var(--brand)' : 'var(--border)'}`,
                textAlign: 'center',
                lineHeight: 1.4,
                transition: 'all .15s',
              }}
            >
              <div style={{ fontSize: 16 }}>{p.flag}</div>
              <div style={{ fontSize: 10, marginTop: 2 }}>{p.country}</div>
              <div style={{ fontSize: 9, opacity: 0.75, marginTop: 1 }}>{SCALE_LABELS[p.scale]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Scale Toggle ─────────────────────────────────────────────────────── */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 6 }}>
          Input Scale
        </p>
        <div style={{ display: 'flex', gap: 5, background: 'var(--surface2)', padding: 3, borderRadius: 9, border: '1px solid var(--border)', flexWrap: 'wrap' }}>
          {(['4.0', '5.0', '7.0', '10.0', 'Percentage'] as Scale[]).map((s) => (
            <button
              key={s}
              onClick={() => handleScaleChange(s)}
              style={{
                flex: '1 1 auto',
                padding: '7px 6px',
                borderRadius: 7,
                fontSize: 10,
                fontWeight: 700,
                cursor: 'pointer',
                background: scale === s ? 'var(--brand)' : 'transparent',
                color: scale === s ? '#fff' : 'var(--text3)',
                border: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {s === 'Percentage' ? '%' : s}
            </button>
          ))}
        </div>
      </div>

      {/* ── GPA Input ────────────────────────────────────────────────────────── */}
      <div style={{ padding: '14px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12 }}>
        <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
          Your GPA / Grade — {SCALE_LABELS[scale]}
        </label>
        <input
          type="number"
          style={inp}
          value={rawVal}
          onChange={(e) => setRawVal(e.target.value)}
          min={SCALE_MIN[scale]}
          max={SCALE_MAX[scale]}
          step={SCALE_STEP[scale]}
          placeholder={`0 – ${SCALE_MAX[scale]}`}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 10, color: 'var(--text3)' }}>
            Min: {SCALE_MIN[scale]}
          </span>
          <span style={{ fontSize: 10, color: 'var(--text3)' }}>
            Max: {SCALE_MAX[scale]}
          </span>
        </div>
        {scale === '5.0' && (
          <div style={{ marginTop: 8, padding: '6px 10px', background: 'linear-gradient(135deg, #fef9c322, #fef9c30a)', border: '1px solid #fef08a', borderRadius: 8, fontSize: 10, color: '#854d0e', fontWeight: 600 }}>
            🇩🇪 German scale is <strong>inverse</strong>: 1.0 = Excellent, 4.0 = Sufficient (pass), 5.0 = Fail
          </div>
        )}
      </div>

      {/* ── Main Result Card ─────────────────────────────────────────────────── */}
      {result && (
        <>
          <div style={{
            padding: '24px 20px',
            background: `linear-gradient(135deg, ${color}22, ${color}0a)`,
            border: `2px solid ${color}55`,
            borderRadius: 18,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>
              Grade Descriptor
            </div>
            <div style={{ fontSize: 64, fontWeight: 900, color, lineHeight: 1, fontFamily: 'var(--font-display)' }}>
              {result.descriptor.grade}
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color, marginTop: 6 }}>
              {result.descriptor.label}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 6 }}>
              Normalized score: <strong style={{ color }}>{(result.normalized * 100).toFixed(1)}%</strong>
            </div>
          </div>

          {/* ── All-Scale Cards ──────────────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: '4.0 Scale',        value: result.gpa4.toFixed(2),  sub: 'USA / Canada / HEC',  c: '#0284c7',  active: scale === '4.0' },
              { label: '5.0 Scale (DE)',    value: result.gpa5.toFixed(2),  sub: 'Germany (inverse)',   c: '#7c3aed',  active: scale === '5.0' },
              { label: '7.0 Scale (AU)',    value: result.gpa7.toFixed(2),  sub: result.ausGrade,       c: '#15803d',  active: scale === '7.0' },
              { label: '10.0 Scale (IN)',   value: result.gpa10.toFixed(2), sub: 'India (CGPA)',        c: '#d97706',  active: scale === '10.0' },
            ].map(({ label, value, sub, c, active }) => (
              <div
                key={label}
                style={{
                  padding: '14px',
                  background: active ? `${c}18` : 'var(--surface)',
                  border: active ? `2px solid ${c}88` : '1px solid var(--border)',
                  borderRadius: 12,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 4 }}>
                  {label} {active && <span style={{ color: c }}>← Input</span>}
                </div>
                <div style={{ fontSize: 32, fontWeight: 900, color: c, fontFamily: 'var(--font-display)', lineHeight: 1 }}>
                  {value}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 5, fontWeight: 600 }}>{sub}</div>
                {/* Progress bar */}
                <div style={{ width: '100%', height: 4, background: 'var(--border)', borderRadius: 99, marginTop: 8, overflow: 'hidden' }}>
                  <div style={{ width: `${result.normalized * 100}%`, height: '100%', background: c, borderRadius: 99, transition: 'width .4s' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Percentage full-width */}
          <div style={{
            padding: '16px',
            background: scale === 'Percentage' ? '#f0fdf4' : 'var(--surface)',
            border: scale === 'Percentage' ? '2px solid #86efac' : '1px solid var(--border)',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 4 }}>
                Percentage {scale === 'Percentage' && <span style={{ color: '#15803d' }}>← Input</span>}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 600 }}>UK / Percentage-based systems</div>
            </div>
            <div style={{ fontSize: 40, fontWeight: 900, color: '#15803d', fontFamily: 'var(--font-display)' }}>
              {result.percentage}%
            </div>
          </div>

          {/* ── Conversion Table ─────────────────────────────────────────────── */}
          <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 10 }}>
              Conversion Summary Table
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr>
                    {['Scale', 'Value', 'Unit'].map((h) => (
                      <th key={h} style={{ padding: '6px 10px', textAlign: 'left', fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', borderBottom: '1.5px solid var(--border)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, i) => (
                    <tr key={i} style={{ background: row.highlight ? `${color}12` : 'transparent' }}>
                      <td style={{ padding: '7px 10px', fontWeight: row.highlight ? 800 : 600, color: row.highlight ? color : 'var(--text)', borderBottom: '1px solid var(--border)' }}>
                        {row.label} {row.highlight && '★'}
                      </td>
                      <td style={{ padding: '7px 10px', fontWeight: 900, color: row.highlight ? color : 'var(--brand)', borderBottom: '1px solid var(--border)' }}>
                        {row.value}
                      </td>
                      <td style={{ padding: '7px 10px', color: 'var(--text3)', fontWeight: 500, borderBottom: '1px solid var(--border)' }}>
                        {row.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Grade Descriptor Reference ───────────────────────────────────── */}
          <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 10 }}>
              Grade Descriptor Reference
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { grade: 'A',  label: 'Excellent',     pct: '≥ 93%', gpa4: '≥ 3.72', c: '#15803d' },
                { grade: 'A−', label: 'Very Good',     pct: '83–92%', gpa4: '3.32–3.71', c: '#16a34a' },
                { grade: 'B+', label: 'Good',          pct: '73–82%', gpa4: '2.92–3.31', c: '#0284c7' },
                { grade: 'B',  label: 'Above Average', pct: '63–72%', gpa4: '2.52–2.91', c: '#7c3aed' },
                { grade: 'C',  label: 'Average',       pct: '50–62%', gpa4: '2.00–2.51', c: '#d97706' },
                { grade: 'D',  label: 'Pass',          pct: '33–49%', gpa4: '1.32–1.99', c: '#ea580c' },
                { grade: 'F',  label: 'Fail',          pct: '< 33%',  gpa4: '< 1.32',    c: '#dc2626' },
              ].map((row, i, arr) => {
                const isActive = result.descriptor.grade === row.grade;
                return (
                  <div
                    key={row.grade}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '7px 10px',
                      background: isActive ? `${row.c}18` : 'transparent',
                      borderRadius: 8,
                      borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: isActive ? row.c : `${row.c}22`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 900, color: isActive ? '#fff' : row.c,
                      flexShrink: 0,
                    }}>
                      {row.grade}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: isActive ? row.c : 'var(--text)' }}>{row.label}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>4.0: {row.gpa4}</div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textAlign: 'right' }}>
                      {row.pct}
                    </div>
                    {isActive && (
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: row.c, flexShrink: 0 }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Disclaimer ───────────────────────────────────────────────────── */}
          <div style={{
            padding: '12px 14px',
            background: 'linear-gradient(135deg, var(--brand-l), var(--surface))',
            border: '1px solid var(--border)',
            borderRadius: 12,
          }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--brand)', textTransform: 'uppercase', marginBottom: 6 }}>
              ⚠️ Disclaimer — Institutional Variation
            </p>
            <ul style={{ fontSize: 11, color: 'var(--text2)', paddingLeft: 14, display: 'flex', flexDirection: 'column', gap: 4, margin: 0 }}>
              <li>Conversions are <strong>approximations</strong>. Official evaluation by WES, ECE, or NARIC may differ.</li>
              <li>German grades vary by subject and university; a 2.0 in Engineering ≠ 2.0 in Law.</li>
              <li>Australian GPA (7-point) cut-offs may differ between institutions (e.g., UniMelb vs. ANU).</li>
              <li>India CGPA rubrics vary: some use 9.5 or 10 as max; always check your university's scale.</li>
              <li>UK classification: 70%+ = First, 60%+ = Upper Second, 50%+ = Lower Second, 40%+ = Third.</li>
              <li>Always verify with the target institution's official equivalency guidelines.</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
