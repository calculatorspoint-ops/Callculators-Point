import React, { useState, useEffect, useCallback } from 'react';
import { FinanceLayout } from '../../../components/calculator-core/forms/SharedComponents';

// ── Percentile lookup tables ──────────────────────────────────────────────────
const VERBAL_PERCENTILES: Record<number, number> = {
  170: 99, 169: 99, 168: 99, 167: 98, 166: 97,
  165: 96, 164: 95, 163: 93, 162: 91, 161: 89,
  160: 86, 159: 83, 158: 80, 157: 76, 156: 72,
  155: 68, 154: 64, 153: 60, 152: 56, 151: 52,
  150: 48, 149: 44, 148: 40, 147: 36, 146: 32,
  145: 28, 144: 24, 143: 21, 142: 18, 141: 16,
  140: 14, 139: 11, 138: 9,  137: 8,  136: 7,
  135: 6,  134: 4,  133: 3,  132: 2,  131: 1,
  130: 1,
};

const QUANT_PERCENTILES: Record<number, number> = {
  170: 96, 169: 94, 168: 92, 167: 89, 166: 85,
  165: 79, 164: 74, 163: 69, 162: 64, 161: 59,
  160: 59, 159: 53, 158: 48, 157: 43, 156: 38,
  155: 38, 154: 34, 153: 30, 152: 26, 151: 23,
  150: 20, 149: 17, 148: 14, 147: 12, 146: 10,
  145: 9,  144: 7,  143: 6,  142: 5,  141: 4,
  140: 4,  139: 3,  138: 2,  137: 2,  136: 1,
  135: 1,  134: 1,  133: 1,  132: 1,  131: 1,
  130: 1,
};

const AWA_PERCENTILES: Record<number, number> = {
  6.0: 99, 5.5: 98, 5.0: 93, 4.5: 81,
  4.0: 58, 3.5: 37, 3.0: 17, 2.5: 8,
  2.0: 3,  1.5: 1,  1.0: 1,  0.5: 1, 0.0: 1,
};

// ── Program tier definitions ──────────────────────────────────────────────────
const PROGRAM_TIERS = [
  { label: 'Top PhD Programs (Ivy+)',  v: 160, q: 165, awa: 5.0, color: '#7c3aed' },
  { label: 'Top 25 PhD Programs',      v: 155, q: 160, awa: 4.5, color: '#2563eb' },
  { label: 'Top 50 PhD Programs',      v: 150, q: 155, awa: 4.0, color: '#0891b2' },
  { label: 'Professional Masters',     v: 148, q: 150, awa: 3.5, color: '#059669' },
  { label: 'General Masters',          v: 145, q: 145, awa: 3.0, color: '#d97706' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function getPercentile(table: Record<number, number>, score: number): number {
  if (table[score] !== undefined) return table[score];
  const keys = Object.keys(table).map(Number).sort((a, b) => a - b);
  for (let i = 0; i < keys.length - 1; i++) {
    if (score > keys[i] && score < keys[i + 1]) {
      const lo = table[keys[i]];
      const hi = table[keys[i + 1]];
      const t = (score - keys[i]) / (keys[i + 1] - keys[i]);
      return Math.round(lo + t * (hi - lo));
    }
  }
  return score <= keys[0] ? table[keys[0]] : table[keys[keys.length - 1]];
}

function rawToScaled(raw: number, maxRaw: number = 40): number {
  const clamped = Math.max(0, Math.min(raw, maxRaw));
  return Math.round((clamped / maxRaw) * 40 + 130);
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function PercentileBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: color,
            borderRadius: 99,
            transition: 'width 0.4s cubic-bezier(.4,0,.2,1)',
          }}
        />
      </div>
    </div>
  );
}

// ── ScoreCard — defined at module scope to prevent re-creation on every render ──
function ScoreCard({
  label,
  score,
  pct,
  min,
  max,
  color,
  suffix = '',
  cardStyle,
  sectionHeaderStyle,
}: {
  label: string;
  score: number;
  pct: number;
  min: number;
  max: number;
  color: string;
  suffix?: string;
  cardStyle: React.CSSProperties;
  sectionHeaderStyle: React.CSSProperties;
}) {
  const range = max - min;
  const fill = ((score - min) / range) * 100;
  return (
    <div
      style={{
        ...cardStyle,
        background: `linear-gradient(135deg, ${color}22, ${color}0a)`,
        border: `2px solid ${color}55`,
      }}
    >
      <div style={sectionHeaderStyle}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 52, fontWeight: 900, color, lineHeight: 1, fontFamily: 'var(--font-display)' }}>
          {score}{suffix}
        </span>
        <span style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 600 }}>
          / {max}
        </span>
      </div>
      <div style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 700, marginBottom: 4 }}>
        {pct}th Percentile
      </div>
      <PercentileBar pct={fill} color={color} />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function GREScoreCalculator() {
  const [inputMode, setInputMode] = useState<'scaled' | 'raw'>('scaled');

  // Scaled score inputs
  const [vScaled, setVScaled] = useState<number>(155);
  const [qScaled, setQScaled] = useState<number>(158);
  const [awaScore, setAwaScore] = useState<number>(4.0);

  // Raw score inputs
  const [vRaw, setVRaw] = useState<number>(25);
  const [qRaw, setQRaw] = useState<number>(28);

  // Computed
  const [verbal, setVerbal] = useState(155);
  const [quant, setQuant] = useState(158);
  const [awa, setAwa] = useState(4.0);
  const [total, setTotal] = useState(313);
  const [vPct, setVPct] = useState(68);
  const [qPct, setQPct] = useState(48);
  const [awaPct, setAwaPct] = useState(58);

  const calculate = useCallback(() => {
    let v: number, q: number;
    if (inputMode === 'scaled') {
      v = clamp(Math.round(vScaled), 130, 170);
      q = clamp(Math.round(qScaled), 130, 170);
    } else {
      v = rawToScaled(vRaw, 40);
      q = rawToScaled(qRaw, 40);
    }
    const a = awaScore;
    setVerbal(v);
    setQuant(q);
    setAwa(a);
    setTotal(v + q);
    setVPct(getPercentile(VERBAL_PERCENTILES, v));
    setQPct(getPercentile(QUANT_PERCENTILES, q));
    setAwaPct(getPercentile(AWA_PERCENTILES, a));
  }, [inputMode, vScaled, qScaled, vRaw, qRaw, awaScore]);

  useEffect(() => { calculate(); }, [calculate]);

  const awaOptions = [6.0, 5.5, 5.0, 4.5, 4.0, 3.5, 3.0, 2.5, 2.0, 1.5, 1.0, 0.5, 0.0];

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

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 800,
    color: 'var(--text3)',
    display: 'block',
    marginBottom: 6,
    textTransform: 'uppercase',
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

  const qualifiedTier = PROGRAM_TIERS.slice().reverse().find(
    t => verbal >= t.v && quant >= t.q && awa >= t.awa
  );

  return (
    <FinanceLayout
      accentClass="accent-math"
      inputTitle="Your Scores"
      inputContent={<>

      {/* ── Input Mode Toggle ── */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>Input Mode</div>
        <div style={{ display: 'flex', background: 'var(--surface2)', borderRadius: 9, padding: 3, gap: 2 }}>
          {(['scaled', 'raw'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setInputMode(mode)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: 7,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                background: inputMode === mode ? 'var(--brand)' : 'transparent',
                color: inputMode === mode ? '#fff' : 'var(--text3)',
                border: 'none',
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              {mode === 'scaled' ? '🎯 Scaled Score (130–170)' : '📝 Raw Score (# Correct)'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Score Inputs ── */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>Enter Your Scores</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Verbal */}
          <div>
            <label style={labelStyle}>
              📖 Verbal Reasoning {inputMode === 'scaled' ? '(130–170)' : '(0–40 correct)'}
            </label>
            {inputMode === 'scaled' ? (
              <input
                type="number"
                min={130}
                max={170}
                value={vScaled}
                onChange={e => setVScaled(Number(e.target.value))}
                style={inputStyle}
              />
            ) : (
              <input
                type="number"
                min={0}
                max={40}
                value={vRaw}
                onChange={e => setVRaw(Number(e.target.value))}
                style={inputStyle}
                placeholder="0–40"
              />
            )}
          </div>

          {/* Quantitative */}
          <div>
            <label style={labelStyle}>
              🔢 Quantitative Reasoning {inputMode === 'scaled' ? '(130–170)' : '(0–40 correct)'}
            </label>
            {inputMode === 'scaled' ? (
              <input
                type="number"
                min={130}
                max={170}
                value={qScaled}
                onChange={e => setQScaled(Number(e.target.value))}
                style={inputStyle}
              />
            ) : (
              <input
                type="number"
                min={0}
                max={40}
                value={qRaw}
                onChange={e => setQRaw(Number(e.target.value))}
                style={inputStyle}
                placeholder="0–40"
              />
            )}
          </div>

          {/* AWA */}
          <div>
            <label style={labelStyle}>✍️ Analytical Writing Assessment (0–6, 0.5 steps)</label>
            <select
              value={awaScore}
              onChange={e => setAwaScore(Number(e.target.value))}
              style={inputStyle}
            >
              {awaOptions.map(v => (
                <option key={v} value={v}>{v.toFixed(1)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      </>
      }
      resultContent={<>
      {/* ── Total Score Banner ── */}
      <div
        style={{
          ...cardStyle,
          background: 'linear-gradient(135deg, #7c3aed22, #2563eb0a)',
          border: '2px solid #7c3aed55',
          textAlign: 'center',
        }}
      >
        <div style={sectionHeaderStyle}>Total GRE Score (Verbal + Quant)</div>
        <div style={{ fontSize: 72, fontWeight: 900, color: '#7c3aed', lineHeight: 1, fontFamily: 'var(--font-display)' }}>
          {total}
        </div>
        <div style={{ fontSize: 14, color: 'var(--text2)', fontWeight: 600, marginTop: 4 }}>
          out of 340
        </div>
        <PercentileBar pct={((total - 260) / 80) * 100} color="#7c3aed" />
        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 6 }}>
          Score range: 260 – 340
        </div>
      </div>

      {/* ── Section Score Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <ScoreCard label="Verbal" score={verbal} pct={vPct} min={130} max={170} color="#2563eb" cardStyle={cardStyle} sectionHeaderStyle={sectionHeaderStyle} />
        <ScoreCard label="Quant" score={quant} pct={qPct} min={130} max={170} color="#059669" cardStyle={cardStyle} sectionHeaderStyle={sectionHeaderStyle} />
        <ScoreCard label="AWA" score={awa} pct={awaPct} min={0} max={6} color="#d97706" suffix="" cardStyle={cardStyle} sectionHeaderStyle={sectionHeaderStyle} />
      </div>

      {/* ── Raw Score Note ── */}
      {inputMode === 'raw' && (
        <div
          style={{
            ...cardStyle,
            background: 'linear-gradient(135deg, #0891b222, #0891b20a)',
            border: '2px solid #0891b255',
          }}
        >
          <div style={sectionHeaderStyle}>📊 Raw → Scaled Conversion</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 600 }}>
              Verbal: {vRaw}/40 correct → <strong style={{ color: '#2563eb' }}>{verbal}</strong>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 600 }}>
              Quant: {qRaw}/40 correct → <strong style={{ color: '#059669' }}>{quant}</strong>
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 6 }}>
            * Approximation — actual ETS equating may vary by test form.
          </div>
        </div>
      )}

      {/* ── Graduate Program Tier Comparison ── */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>🎓 Graduate Program Tier Comparison</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PROGRAM_TIERS.map(tier => {
            const meetsV = verbal >= tier.v;
            const meetsQ = quant >= tier.q;
            const meetsA = awa >= tier.awa;
            const meetsAll = meetsV && meetsQ && meetsA;
            const isTop = qualifiedTier?.label === tier.label;
            return (
              <div
                key={tier.label}
                style={{
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: `1.5px solid ${meetsAll ? tier.color + '88' : 'var(--border)'}`,
                  background: meetsAll ? `${tier.color}11` : 'var(--surface2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'all 0.3s',
                }}
              >
                <span style={{ fontSize: 18 }}>{meetsAll ? '✅' : '❌'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: meetsAll ? tier.color : 'var(--text2)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {tier.label}
                    {isTop && meetsAll && (
                      <span style={{ fontSize: 10, background: tier.color, color: '#fff', borderRadius: 5, padding: '2px 6px', fontWeight: 800 }}>
                        YOUR LEVEL
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 3 }}>
                    <span style={{ fontSize: 11, color: meetsV ? '#059669' : '#ef4444', fontWeight: 700 }}>
                      V≥{tier.v} {meetsV ? '✓' : `(${verbal})`}
                    </span>
                    <span style={{ fontSize: 11, color: meetsQ ? '#059669' : '#ef4444', fontWeight: 700 }}>
                      Q≥{tier.q} {meetsQ ? '✓' : `(${quant})`}
                    </span>
                    <span style={{ fontSize: 11, color: meetsA ? '#059669' : '#ef4444', fontWeight: 700 }}>
                      AWA≥{tier.awa.toFixed(1)} {meetsA ? '✓' : `(${awa.toFixed(1)})`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {!qualifiedTier && (
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text3)', textAlign: 'center' }}>
            Scores below General Masters thresholds. Aim for V≥145, Q≥145, AWA≥3.0.
          </div>
        )}
      </div>

      {/* ── Score Interpretation ── */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>📈 Score Interpretation</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { label: 'Verbal Score',     val: `${verbal}`, sub: `Top ${100 - vPct}% of test-takers`, color: '#2563eb' },
            { label: 'Quant Score',      val: `${quant}`,  sub: `Top ${100 - qPct}% of test-takers`, color: '#059669' },
            { label: 'AWA Score',        val: `${awa.toFixed(1)}`, sub: `Top ${100 - awaPct}% of test-takers`, color: '#d97706' },
            { label: 'Combined V+Q',     val: `${total}`, sub: `${total - 260} pts above minimum`,  color: '#7c3aed' },
          ].map(item => (
            <div
              key={item.label}
              style={{
                padding: '10px 12px',
                background: `${item.color}11`,
                border: `1px solid ${item.color}33`,
                borderRadius: 10,
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 2 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: item.color, lineHeight: 1.2 }}>
                {item.val}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>
                {item.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      </>
    }
    />
  );
}
