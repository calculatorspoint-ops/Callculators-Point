import React, { useState, useEffect, useCallback } from 'react';
import { FinanceLayout } from '../../../components/calculator-core/forms/SharedComponents';

// GMAT Focus Edition (2024): each section 60-90, total 205-805
// Percentile data (approximate from GMAC)
const GMAT_PERCENTILES: { score: number; pct: number }[] = [
  { score: 90, pct: 96 },
  { score: 85, pct: 81 },
  { score: 80, pct: 61 },
  { score: 75, pct: 42 },
  { score: 70, pct: 26 },
  { score: 65, pct: 15 },
  { score: 60, pct: 5 },
];

const TOTAL_PERCENTILES: { score: number; pct: number }[] = [
  { score: 805, pct: 99 },
  { score: 775, pct: 98 },
  { score: 755, pct: 97 },
  { score: 745, pct: 96 },
  { score: 735, pct: 94 },
  { score: 715, pct: 90 },
  { score: 695, pct: 83 },
  { score: 675, pct: 74 },
  { score: 655, pct: 62 },
  { score: 635, pct: 50 },
  { score: 615, pct: 39 },
  { score: 595, pct: 28 },
  { score: 565, pct: 18 },
  { score: 535, pct: 10 },
  { score: 505, pct: 5 },
  { score: 205, pct: 1 },
];

const BUSINESS_SCHOOLS = [
  { name: 'M7 (Wharton / Booth / HBS / Kellogg / Sloan / Columbia / Tuck)', min: 740, label: 'M7 MBA' },
  { name: 'Top 25 MBA Programs', min: 700, label: 'Top 25 MBA' },
  { name: 'Top 50 MBA Programs', min: 660, label: 'Top 50 MBA' },
  { name: 'General Admission', min: 620, label: 'Admission' },
];

function getSectionPercentile(score: number): number {
  for (const { score: s, pct } of GMAT_PERCENTILES) {
    if (score >= s) return pct;
  }
  return 1;
}

function getTotalPercentile(score: number): number {
  for (const { score: s, pct } of TOTAL_PERCENTILES) {
    if (score >= s) return pct;
  }
  return 1;
}

function clampSection(v: number) {
  return Math.min(90, Math.max(60, v));
}

function getScoreColor(total: number): string {
  if (total >= 750) return '#15803d';
  if (total >= 700) return '#0284c7';
  if (total >= 650) return '#d97706';
  if (total >= 600) return '#ea580c';
  return '#dc2626';
}

function getScoreLabel(total: number): string {
  if (total >= 750) return '🏆 Elite — Top 4%';
  if (total >= 700) return '⭐ Highly Competitive';
  if (total >= 650) return '✅ Competitive';
  if (total >= 600) return '📈 Above Average';
  return '📚 Below Target — Retake Recommended';
}

// Legacy GMAT (approx mapping): new total / 805 * 800 rounded to 10
function legacyApprox(focusTotal: number): number {
  return Math.round((focusTotal / 805) * 800 / 10) * 10;
}

export function GMATScoreCalculator() {
  const [qr, setQr] = useState('75');
  const [vr, setVr] = useState('75');
  const [di, setDi] = useState('75');
  const [result, setResult] = useState<any>(null);

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
  };

  const calc = useCallback(() => {
    const q = clampSection(parseInt(qr) || 60);
    const v = clampSection(parseInt(vr) || 60);
    const d = clampSection(parseInt(di) || 60);
    // Total: sum of 3 sections rounded to nearest 5, range 205-805 (180+25 buffer)
    const rawTotal = q + v + d;
    // GMAT Focus total is NOT simply sum; it's a scaled composite.
    // Approximation: 205 + (rawTotal - 180) / (270 - 180) * 600, rounded to 5
    const totalExact = 205 + ((rawTotal - 180) / 90) * 600;
    const total = Math.round(Math.min(805, Math.max(205, totalExact)) / 5) * 5;

    const pct = getTotalPercentile(total);
    const color = getScoreColor(total);
    const label = getScoreLabel(total);
    const legacy = legacyApprox(total);

    const sections = [
      { key: 'Quantitative Reasoning', score: q, pct: getSectionPercentile(q) },
      { key: 'Verbal Reasoning', score: v, pct: getSectionPercentile(v) },
      { key: 'Data Insights', score: d, pct: getSectionPercentile(d) },
    ];

    setResult({ total, pct, color, label, legacy, sections, q, v, d });
  }, [qr, vr, di]);

  useEffect(() => { calc(); }, [calc]);

  const sections = [
    { label: 'Quantitative Reasoning', value: qr, setter: setQr, abbr: 'QR' },
    { label: 'Verbal Reasoning', value: vr, setter: setVr, abbr: 'VR' },
    { label: 'Data Insights', value: di, setter: setDi, abbr: 'DI' },
  ];

  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Scores"
      inputContent={<>
      {/* Header note */}
      <div style={{ padding: '10px 14px', background: 'linear-gradient(135deg, var(--brand-l), var(--surface))', border: '1px solid var(--border)', borderRadius: 10 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand)', margin: 0 }}>
          📋 GMAT Focus Edition (2024 Format) — Each section scored 60–90, Total 205–805
        </p>
      </div>

      {/* Section Inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {sections.map(({ label, value, setter, abbr }) => (
          <div key={abbr} style={{ padding: '14px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
              {label}
            </label>
            <input
              type="number"
              style={inp}
              value={value}
              onChange={e => setter(e.target.value)}
              min={60}
              max={90}
              step={1}
            />
            <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 5, textAlign: 'center' }}>60 – 90</div>
            {result && (
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--brand)', marginTop: 4, textAlign: 'center' }}>
                {getSectionPercentile(clampSection(parseInt(value) || 60))}th percentile
              </div>
            )}
          </div>
        ))}
      </div>

      </>
      }
      resultContent={<>
      {/* Total Score Result */}
      {result && (
        <>
          <div style={{ padding: '28px', background: `linear-gradient(135deg, ${result.color}22, ${result.color}0a)`, border: `2px solid ${result.color}55`, borderRadius: 18, textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: result.color, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>
              GMAT Focus Edition — Total Score
            </div>
            <div style={{ fontSize: 72, fontWeight: 900, color: result.color, lineHeight: 1, fontFamily: 'var(--font-display)' }}>
              {result.total}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 8 }}>out of 805</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: result.color, marginTop: 10 }}>{result.label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text3)', marginTop: 6 }}>
              Percentile: <span style={{ color: result.color, fontWeight: 900 }}>{result.pct}th</span>
              &nbsp;(better than {result.pct}% of test takers)
            </div>
          </div>

          {/* Section Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {result.sections.map((s: any) => (
              <div key={s.key} style={{ padding: '12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 4 }}>{s.key}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--brand)' }}>{s.score}</div>
                <div style={{ width: '100%', height: 5, background: 'var(--border)', borderRadius: 99, marginTop: 8, overflow: 'hidden' }}>
                  <div style={{ width: `${((s.score - 60) / 30) * 100}%`, height: '100%', background: 'var(--brand)', borderRadius: 99 }} />
                </div>
                <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>{s.pct}th pct</div>
              </div>
            ))}
          </div>

          {/* Legacy GMAT Reference */}
          <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 8 }}>
              🔄 Legacy GMAT Reference (approx. equivalent)
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--text2)', fontFamily: 'var(--font-display)' }}>
                ~{result.legacy}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                Approximate legacy score (205–800 composite scale).<br />
                Useful for comparing with older MBA applicant stats.
              </div>
            </div>
          </div>

          {/* Business School Tiers */}
          <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 10 }}>
              🏫 Business School Competitiveness
            </p>
            {BUSINESS_SCHOOLS.map((b, i) => {
              const meets = result.total >= b.min;
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: i < BUSINESS_SCHOOLS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{b.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--text3)' }}>Min. competitive score: {b.min}+</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 12px', borderRadius: 99, background: meets ? '#dcfce7' : '#fef2f2', color: meets ? '#15803d' : '#dc2626', whiteSpace: 'nowrap', marginLeft: 10 }}>
                    {meets ? `✓ Meets ${b.label}` : `✗ Below ${b.label}`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Score improvement */}
          {result.total < 700 && (
            <div style={{ padding: '14px', background: 'linear-gradient(135deg, var(--brand-l), var(--surface))', border: '1px solid var(--border)', borderRadius: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--brand)', textTransform: 'uppercase', marginBottom: 8 }}>
                💡 Improvement Strategy
              </p>
              <ul style={{ fontSize: 12, color: 'var(--text2)', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 5, margin: 0 }}>
                {result.q < 75 && <li>QR: Practice PS and DS questions; master number properties & algebra</li>}
                {result.v < 75 && <li>VR: Focus on Critical Reasoning and Reading Comprehension techniques</li>}
                {result.d < 75 && <li>DI: Practice Data Sufficiency, Multi-Source Reasoning, and Graphics</li>}
                <li>Aim for 4–6 weeks of structured prep per retake attempt</li>
                <li>Use official GMAC practice exams for score benchmarking</li>
              </ul>
            </div>
          )}
        </>
      )}
      </>
    }
    />
  );
}
