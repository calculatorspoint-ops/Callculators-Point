import React, { useState, useEffect, useCallback } from 'react';

interface AttendanceEntry {
  id: number;
  subject: string;
  held: string;
  attended: string;
}

function getStatus(pct: number): { label: string; color: string; bg: string } {
  if (pct >= 85) return { label: '✅ Safe', color: '#15803d', bg: '#dcfce7' };
  if (pct >= 75) return { label: '⚠️ At Threshold', color: '#b45309', bg: '#fef9c3' };
  if (pct >= 65) return { label: '🔴 Below Minimum', color: '#dc2626', bg: '#fef2f2' };
  return { label: '🚫 Critical', color: '#7f1d1d', bg: '#fee2e2' };
}

export function AttendanceCalculator() {
  const [entries, setEntries] = useState<AttendanceEntry[]>([
    { id: 1, subject: 'Mathematics', held: '40', attended: '32' },
    { id: 2, subject: 'Physics', held: '38', attended: '30' },
    { id: 3, subject: 'Chemistry', held: '35', attended: '28' },
  ]);
  const [targetPct, setTargetPct] = useState('75');
  const [minPct, setMinPct] = useState('75');
  const [mode, setMode] = useState<'tracker' | 'bunk-planner'>('tracker');
  const [results, setResults] = useState<any[]>([]);
  const [overall, setOverall] = useState<any>(null);

  const update = (id: number, field: keyof AttendanceEntry, val: string) =>
    setEntries(prev => prev.map(e => e.id === id ? { ...e, [field]: val } : e));
  const add = () => setEntries(prev => [...prev, { id: Date.now(), subject: `Subject ${prev.length + 1}`, held: '40', attended: '30' }]);
  const remove = (id: number) => setEntries(prev => prev.filter(e => e.id !== id));

  const calc = useCallback(() => {
    const valid = entries.filter(e => {
      const h = parseInt(e.held), a = parseInt(e.attended);
      return !isNaN(h) && !isNaN(a) && h > 0 && a >= 0 && a <= h;
    });
    if (!valid.length) { setResults([]); setOverall(null); return; }
    const min = parseFloat(minPct) || 75;
    const target = parseFloat(targetPct) || 75;

    const res = valid.map(e => {
      const h = parseInt(e.held), a = parseInt(e.attended);
      const pct = (a / h) * 100;
      const status = getStatus(pct);

      // Classes needed to reach target
      let classesNeeded = 0;
      if (pct < target) {
        // (a + x) / (h + x) = target/100 => x = (target*h - 100*a) / (100 - target)
        const x = (target * h - 100 * a) / (100 - target);
        classesNeeded = Math.ceil(Math.max(0, x));
      }

      // Safe bunks without going below minimum
      let safeBunks = 0;
      if (pct >= min) {
        // (a) / (h + x) >= min/100 => x <= a*100/min - h
        const maxExtra = (a * 100 / min) - h;
        safeBunks = Math.max(0, Math.floor(maxExtra));
      }

      return { ...e, pct, status, h, a, classesNeeded, safeBunks, gap: a - Math.ceil(min * h / 100) };
    });

    const totalH = res.reduce((s, r) => s + r.h, 0);
    const totalA = res.reduce((s, r) => s + r.a, 0);
    const overallPct = (totalA / totalH) * 100;
    setResults(res);
    setOverall({ pct: overallPct, status: getStatus(overallPct), totalH, totalA });
  }, [entries, targetPct, minPct]);

  useEffect(() => { const t = setTimeout(calc, 150); return () => clearTimeout(t); }, [calc]);

  const inp = { padding: '8px 10px', background: 'var(--surface2)', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, color: 'var(--text)', outline: 'none', width: '100%' } as React.CSSProperties;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Mode Toggle */}
      <div style={{ display: 'flex', gap: 8, background: 'var(--surface2)', padding: 4, borderRadius: 10, border: '1px solid var(--border)' }}>
        {([['tracker', 'Attendance Tracker'], ['bunk-planner', '🎯 Bunk Planner']] as [string, string][]).map(([v, l]) => (
          <button key={v} onClick={() => setMode(v as any)}
            style={{ flex: 1, padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
              background: mode === v ? 'var(--brand)' : 'transparent',
              color: mode === v ? '#fff' : 'var(--text3)', border: 'none', transition: 'all .2s' }}>
            {l}
          </button>
        ))}
      </div>

      {/* Settings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', display: 'block', marginBottom: 5, textTransform: 'uppercase' }}>Min Required %</label>
          <input type="number" style={inp} value={minPct} onChange={e => setMinPct(e.target.value)} placeholder="75" min="0" max="100" />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', display: 'block', marginBottom: 5, textTransform: 'uppercase' }}>Target %</label>
          <input type="number" style={inp} value={targetPct} onChange={e => setTargetPct(e.target.value)} placeholder="85" min="0" max="100" />
        </div>
      </div>

      {/* Subject table */}
      <div style={{ border: '1.5px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 0, padding: '8px 14px', background: 'linear-gradient(135deg,#0284c7,#075985)' }}>
          {['Subject', 'Classes Held', 'Attended', ''].map(h => (
            <span key={h} style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.7)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</span>
          ))}
        </div>
        {entries.map(e => (
          <div key={e.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, padding: '10px 14px', borderBottom: '1px solid var(--border)', alignItems: 'center', background: 'var(--surface)' }}>
            <input style={inp} value={e.subject} onChange={ev => update(e.id, 'subject', ev.target.value)} placeholder="Subject" />
            <input type="number" style={{ ...inp, textAlign: 'center' }} value={e.held} onChange={ev => update(e.id, 'held', ev.target.value)} min="1" />
            <input type="number" style={{ ...inp, textAlign: 'center' }} value={e.attended} onChange={ev => update(e.id, 'attended', ev.target.value)} min="0" />
            <button onClick={() => remove(e.id)} style={{ color: '#ef4444', fontSize: 16, padding: '4px 8px', background: 'transparent', border: 'none', cursor: 'pointer' }}>✕</button>
          </div>
        ))}
        <button onClick={add} style={{ width: '100%', padding: '10px', fontSize: 12, fontWeight: 700, color: 'var(--brand)', background: 'var(--surface2)', border: 'none', borderTop: '1px solid var(--border)', cursor: 'pointer' }}>
          + Add Subject
        </button>
      </div>

      {/* Overall Result */}
      {overall && (
        <div style={{ padding: '20px', background: overall.status.bg, border: `2px solid ${overall.status.color}44`, borderRadius: 14, textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: overall.status.color, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Overall Attendance</div>
          <div style={{ fontSize: 52, fontWeight: 900, color: overall.status.color, lineHeight: 1 }}>{overall.pct.toFixed(1)}%</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: overall.status.color, marginTop: 6 }}>{overall.status.label}</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{overall.totalA} attended out of {overall.totalH} classes</div>
        </div>
      )}

      {/* Subject breakdown */}
      {results.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Subject Breakdown</p>
          {results.map((r, i) => (
            <div key={i} style={{ padding: '14px', background: 'var(--surface)', border: `1.5px solid ${r.status.color}44`, borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{r.subject}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{r.a} / {r.h} classes</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: r.status.color }}>{r.pct.toFixed(1)}%</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: r.status.color }}>{r.status.label}</div>
                </div>
              </div>
              <div style={{ width: '100%', height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(r.pct, 100)}%`, height: '100%', background: r.status.color, borderRadius: 99, transition: 'width .6s' }} />
              </div>
              {mode === 'bunk-planner' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
                  <div style={{ padding: '8px', background: '#dcfce7', borderRadius: 8, textAlign: 'center' }}>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#15803d' }}>{r.safeBunks}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#15803d', textTransform: 'uppercase' }}>Safe Bunks</div>
                  </div>
                  {r.classesNeeded > 0 ? (
                    <div style={{ padding: '8px', background: '#fef2f2', borderRadius: 8, textAlign: 'center' }}>
                      <div style={{ fontSize: 16, fontWeight: 900, color: '#dc2626' }}>{r.classesNeeded}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase' }}>Classes Needed</div>
                    </div>
                  ) : (
                    <div style={{ padding: '8px', background: '#dbeafe', borderRadius: 8, textAlign: 'center' }}>
                      <div style={{ fontSize: 14, fontWeight: 900, color: '#1d4ed8' }}>✓ On Track</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase' }}>Target Met</div>
                    </div>
                  )}
                </div>
              ) : (
                r.classesNeeded > 0 && (
                  <div style={{ marginTop: 8, fontSize: 11, color: '#dc2626', fontWeight: 600 }}>
                    ⚠ Attend {r.classesNeeded} more consecutive classes to reach {targetPct}%
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
