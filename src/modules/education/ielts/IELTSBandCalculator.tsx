import React, { useState, useEffect, useCallback } from 'react';
import { FinanceLayout } from '../../../components/calculator-core/forms/SharedComponents';

// Official IELTS band score rounding:
// Average is calculated to the nearest 0.5 (rounds up from .25)
function roundIELTS(avg: number): number {
  // Official rounding: the overall band is reported to the nearest whole or half band
  // anything .25 or above rounds up to the next .5
  const base = Math.floor(avg);
  const frac = avg - base;
  if (frac < 0.25) return base;
  if (frac < 0.75) return base + 0.5;
  return base + 1;
}

function getBandLabel(band: number): { label: string; level: string; color: string; bg: string } {
  if (band >= 9) return { label: 'Expert', level: 'Native-like command', color: '#15803d', bg: '#dcfce7' };
  if (band >= 8) return { label: 'Very Good', level: 'Fully operational', color: '#0284c7', bg: '#dbeafe' };
  if (band >= 7) return { label: 'Good', level: 'Operational command', color: '#7c3aed', bg: '#ede9fe' };
  if (band >= 6) return { label: 'Competent', level: 'Generally effective', color: '#d97706', bg: '#fef3c7' };
  if (band >= 5) return { label: 'Modest', level: 'Partial command', color: '#ea580c', bg: '#fff7ed' };
  if (band >= 4) return { label: 'Limited', level: 'Basic competence', color: '#dc2626', bg: '#fef2f2' };
  return { label: 'Extremely Limited', level: 'No real proficiency', color: '#7f1d1d', bg: '#fee2e2' };
}

const UNI_REQUIREMENTS: { name: string; min: number }[] = [
  { name: 'Harvard / MIT / Oxford', min: 7.5 },
  { name: 'Top UK Universities', min: 7.0 },
  { name: 'Canadian Universities', min: 6.5 },
  { name: 'Australian Universities', min: 6.5 },
  { name: 'US Universities (General)', min: 6.0 },
  { name: 'Community College / Pathway', min: 5.5 },
];

const SECTIONS = [
  { id: 'listening', label: 'Listening', maxRaw: 40, hint: 'Number of correct answers (0–40)' },
  { id: 'reading', label: 'Reading', maxRaw: 40, hint: 'Number of correct answers (0–40)' },
  { id: 'writing', label: 'Writing', maxRaw: null, hint: 'Band score from examiner (0–9)' },
  { id: 'speaking', label: 'Speaking', maxRaw: null, hint: 'Band score from examiner (0–9)' },
];

// Raw score to band conversion for L&R (Academic/General approximately same)
const RAW_TO_BAND_LISTENING = [
  [39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6], [18, 5.5],
  [16, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [0, 1]
];
const RAW_TO_BAND_READING_ACADEMIC = [
  [39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5], [23, 6], [19, 5.5],
  [15, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [0, 1]
];

function rawToIELTS(raw: number, table: number[][]): number {
  for (const [threshold, band] of table) {
    if (raw >= threshold) return band;
  }
  return 1;
}

export function IELTSBandCalculator() {
  const [mode, setMode] = useState<'academic' | 'general'>('academic');
  const [inputMode, setInputMode] = useState<'raw' | 'band'>('raw');
  const [listening, setListening] = useState('32');
  const [reading, setReading] = useState('30');
  const [writing, setWriting] = useState('6.5');
  const [speaking, setSpeaking] = useState('7');
  const [result, setResult] = useState<any>(null);

  const calc = useCallback(() => {
    const lBand = inputMode === 'raw' ? rawToIELTS(parseInt(listening) || 0, RAW_TO_BAND_LISTENING) : (parseFloat(listening) || 0);
    const rBand = inputMode === 'raw' ? rawToIELTS(parseInt(reading) || 0, RAW_TO_BAND_READING_ACADEMIC) : (parseFloat(reading) || 0);
    const wBand = parseFloat(writing) || 0;
    const sBand = parseFloat(speaking) || 0;

    if ([lBand, rBand, wBand, sBand].some(b => b < 0 || b > 9)) { setResult(null); return; }

    const avg = (lBand + rBand + wBand + sBand) / 4;
    const overall = roundIELTS(avg);
    const info = getBandLabel(overall);

    setResult({ lBand, rBand, wBand, sBand, overall, avg, ...info });
  }, [listening, reading, writing, speaking, inputMode]);

  useEffect(() => { calc(); }, [calc]);

  const sectionBandMap: Record<string, [string, React.Dispatch<React.SetStateAction<string>>]> = {
    listening: [listening, setListening],
    reading: [reading, setReading],
    writing: [writing, setWriting],
    speaking: [speaking, setSpeaking],
  };
  const resultBandMap: Record<string, number> = result ? { listening: result.lBand, reading: result.rBand, writing: result.wBand, speaking: result.sBand } : {};

  const inp = { padding: '10px 14px', background: 'var(--surface2)', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 15, color: 'var(--text)', outline: 'none', width: '100%', fontWeight: 700 } as React.CSSProperties;

  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Scores"
      inputContent={<>
        {/* IELTS Disclaimer */}
        <div style={{ padding: '10px 14px', background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 10, fontSize: 12, color: '#15803d', fontWeight: 600 }}>
          📋 <strong>Unofficial Estimate Only.</strong> Band scores are approximations based on published IELTS conversion tables. Official band scores are determined by certified IELTS examiners and can only be obtained through an authorised test centre (British Council, IDP, or Cambridge Assessment English). Raw score to band conversions may vary slightly by test sitting.
        </div>
        {/* Mode Toggles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 5 }}>Test Type</p>
            <div style={{ display: 'flex', gap: 6, background: 'var(--surface2)', padding: 3, borderRadius: 9, border: '1px solid var(--border)' }}>
              {(['academic', 'general'] as const).map(m => (
                <button key={m} onClick={() => setMode(m)}
                  style={{ flex: 1, padding: '7px', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                    background: mode === m ? 'var(--brand)' : 'transparent',
                    color: mode === m ? '#fff' : 'var(--text3)', border: 'none', textTransform: 'capitalize' }}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 5 }}>L&R Input</p>
            <div style={{ display: 'flex', gap: 6, background: 'var(--surface2)', padding: 3, borderRadius: 9, border: '1px solid var(--border)' }}>
              {(['raw', 'band'] as const).map(m => (
                <button key={m} onClick={() => setInputMode(m)}
                  style={{ flex: 1, padding: '7px', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                    background: inputMode === m ? 'var(--brand)' : 'transparent',
                    color: inputMode === m ? '#fff' : 'var(--text3)', border: 'none', textTransform: 'capitalize' }}>
                  {m === 'raw' ? 'Raw Score' : 'Band Score'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {SECTIONS.map(s => {
            const [val, setVal] = sectionBandMap[s.id];
            const bandVal = resultBandMap[s.id];
            const isRawSection = (s.id === 'listening' || s.id === 'reading') && inputMode === 'raw';
            return (
              <div key={s.id} style={{ padding: '14px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12 }}>
                <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
                  {s.label}
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text3)', display: 'block', marginTop: 2, textTransform: 'none' }}>{isRawSection ? s.hint : 'Band 0–9'}</span>
                </label>
                <input type="number" style={inp} value={val} onChange={e => setVal(e.target.value)} min={0} max={isRawSection ? 40 : 9} step={isRawSection ? 1 : 0.5} />
                {result && bandVal !== undefined && (
                  <div style={{ marginTop: 8, textAlign: 'center', fontSize: 20, fontWeight: 900, color: getBandLabel(bandVal).color }}>
                    Band {bandVal}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </>}
      resultContent={<>
        {/* Overall Result */}
        {result && (
          <>
            <div style={{ padding: '28px', background: `linear-gradient(135deg, ${result.color}22, ${result.color}0a)`, border: `2px solid ${result.color}55`, borderRadius: 18, textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: result.color, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>IELTS Overall Band Score</div>
              <div style={{ fontSize: 72, fontWeight: 900, color: result.color, lineHeight: 1, fontFamily: 'var(--font-display)' }}>{result.overall}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: result.color, marginTop: 10 }}>{result.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{result.level}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 6 }}>Exact avg: {result.avg.toFixed(3)} → Rounded to {result.overall}</div>
            </div>

            {/* Band breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              {[['L', result.lBand], ['R', result.rBand], ['W', result.wBand], ['S', result.sBand]].map(([k, b]) => {
                const info = getBandLabel(b as number);
                return (
                  <div key={k as string} style={{ padding: '10px', background: info.bg, border: `1px solid ${info.color}44`, borderRadius: 10, textAlign: 'center' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: info.color, textTransform: 'uppercase' }}>{k}</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: info.color }}>{b}</div>
                  </div>
                );
              })}
            </div>

            {/* University requirements */}
            <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 10 }}>University Admission Comparison</p>
              {UNI_REQUIREMENTS.map((u, i) => {
                const meets = result.overall >= u.min;
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < UNI_REQUIREMENTS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{u.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)' }}>Min: Band {u.min}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 99, background: meets ? '#dcfce7' : '#fef2f2', color: meets ? '#15803d' : '#dc2626' }}>
                      {meets ? '✓ Eligible' : '✗ Below'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Improvement tips */}
            {result.overall < 8 && (
              <div style={{ padding: '14px', background: 'linear-gradient(135deg, var(--brand-l), var(--surface))', border: '1px solid var(--border)', borderRadius: 12 }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--brand)', textTransform: 'uppercase', marginBottom: 8 }}>💡 Score Improvement Tips</p>
                <ul style={{ fontSize: 12, color: 'var(--text2)', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {result.lBand < 7 && <li>Listening: Practice with BBC podcasts, TED Talks, and official IELTS practice tests</li>}
                  {result.rBand < 7 && <li>Reading: Focus on skimming & scanning techniques, expand academic vocabulary</li>}
                  {result.wBand < 7 && <li>Writing: Practice Task 1 & 2, use cohesive devices, vary sentence structures</li>}
                  {result.sBand < 7 && <li>Speaking: Record yourself daily, focus on fluency over accuracy initially</li>}
                  <li>Aim for 0.5 band improvement per section with 4–6 weeks of dedicated practice</li>
                </ul>
              </div>
            )}
          </>
        )}
      </>}
    />
  );
}
