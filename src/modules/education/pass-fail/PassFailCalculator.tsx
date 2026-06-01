import React, { useState, useEffect, useCallback } from 'react';

type Verdict = {
  needed: number;
  bestCase: number;
  worstCase: number;
  label: string;
  color: string;
  emoji: string;
  feasible: boolean;
};

function getVerdict(needed: number): { label: string; color: string; emoji: string; feasible: boolean } {
  if (needed > 100) return { label: 'FAIL RISK', color: '#dc2626', emoji: '🚨', feasible: false };
  if (needed <= 0) return { label: 'GUARANTEED PASS', color: '#15803d', emoji: '🎉', feasible: true };
  if (needed <= 70) return { label: 'LIKELY PASS', color: '#15803d', emoji: '✅', feasible: true };
  if (needed <= 85) return { label: 'POSSIBLE PASS', color: '#d97706', emoji: '⚠️', feasible: true };
  return { label: 'DIFFICULT PASS', color: '#ea580c', emoji: '😰', feasible: true };
}

export function PassFailCalculator() {
  const [passingScore, setPassingScore] = useState('60');
  const [currentAvg, setCurrentAvg] = useState('55');
  const [remainingCount, setRemainingCount] = useState('3');
  const [remainingWeight, setRemainingWeight] = useState('40');
  const [result, setResult] = useState<Verdict | null>(null);

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
    const target = parseFloat(passingScore) || 60;
    const current = parseFloat(currentAvg) || 0;
    const remWeight = Math.min(100, Math.max(0, parseFloat(remainingWeight) || 0));

    if (remWeight === 0) {
      // No remaining weight — outcome already determined
      const already = current >= target;
      setResult({
        needed: already ? 0 : 101,
        bestCase: current,
        worstCase: current,
        label: already ? 'GUARANTEED PASS' : 'FAIL RISK',
        color: already ? '#15803d' : '#dc2626',
        emoji: already ? '🎉' : '🚨',
        feasible: already,
      });
      return;
    }

    const doneWeight = 1 - remWeight / 100;
    const currentWeightEarned = current * doneWeight;
    const needed = (target - currentWeightEarned) / (remWeight / 100);

    // Best case: score 100 on all remaining
    const bestCase = currentWeightEarned + 100 * (remWeight / 100);
    // Worst case: score 0 on all remaining
    const worstCase = currentWeightEarned;

    const verdict = getVerdict(needed);
    setResult({ needed, bestCase, worstCase, ...verdict });
  }, [passingScore, currentAvg, remainingCount, remainingWeight]);

  useEffect(() => { calc(); }, [calc]);

  const meterFill = result
    ? result.needed > 100
      ? 100
      : result.needed <= 0
      ? 0
      : result.needed
    : 0;

  const meterColor = result?.color ?? '#15803d';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Inputs grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* Minimum Passing Score */}
        <div style={{ padding: '14px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
            Minimum Passing Score
          </label>
          <input type="number" style={inp} value={passingScore} onChange={e => setPassingScore(e.target.value)} min={0} max={100} step={1} />
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 5, textAlign: 'center' }}>Out of 100</div>
        </div>

        {/* Current Average */}
        <div style={{ padding: '14px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
            Current Average
          </label>
          <input type="number" style={inp} value={currentAvg} onChange={e => setCurrentAvg(e.target.value)} min={0} max={100} step={0.1} />
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 5, textAlign: 'center' }}>Your score so far (0–100)</div>
        </div>

        {/* Remaining Assessments */}
        <div style={{ padding: '14px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
            Remaining Assessments
          </label>
          <input type="number" style={inp} value={remainingCount} onChange={e => setRemainingCount(e.target.value)} min={0} max={50} step={1} />
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 5, textAlign: 'center' }}>Number of tests / assignments left</div>
        </div>

        {/* Weight of Remaining */}
        <div style={{ padding: '14px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
            Weight of Remaining (%)
          </label>
          <input type="number" style={inp} value={remainingWeight} onChange={e => setRemainingWeight(e.target.value)} min={0} max={100} step={1} />
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 5, textAlign: 'center' }}>% of final grade remaining</div>
        </div>
      </div>

      {/* Result Card */}
      {result && (
        <>
          <div style={{ padding: '28px', background: `linear-gradient(135deg, ${result.color}22, ${result.color}0a)`, border: `2px solid ${result.color}55`, borderRadius: 18, textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: result.color, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>
              Required Score on Remaining
            </div>
            <div style={{ fontSize: 72, fontWeight: 900, color: result.color, lineHeight: 1, fontFamily: 'var(--font-display)' }}>
              {result.needed > 100
                ? '100+'
                : result.needed <= 0
                ? 'N/A'
                : `${result.needed.toFixed(1)}%`}
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: result.color, marginTop: 12 }}>
              {result.emoji} {result.label}
            </div>
            {result.needed > 100 && (
              <div style={{ fontSize: 13, color: '#dc2626', marginTop: 8, fontWeight: 700 }}>
                You need {result.needed.toFixed(1)}% — mathematically impossible even with a perfect score.
                <br />
                Deficit: {(result.needed - 100).toFixed(1)} points above maximum.
              </div>
            )}
          </div>

          {/* Visual Risk Meter */}
          <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 10 }}>
              📊 Risk Meter — Score Needed
            </p>
            <div style={{ position: 'relative', width: '100%', height: 22, background: 'var(--surface2)', borderRadius: 99, overflow: 'hidden', border: '1px solid var(--border)' }}>
              {/* Zone bands */}
              <div style={{ position: 'absolute', left: 0, top: 0, width: '70%', height: '100%', background: '#15803d18' }} />
              <div style={{ position: 'absolute', left: '70%', top: 0, width: '15%', height: '100%', background: '#d9770618' }} />
              <div style={{ position: 'absolute', left: '85%', top: 0, width: '15%', height: '100%', background: '#dc262618' }} />
              {/* Fill */}
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${Math.min(100, meterFill)}%`, background: meterColor, borderRadius: 99, transition: 'width 0.4s' }} />
              {/* Labels */}
              <div style={{ position: 'absolute', left: '35%', top: '50%', transform: 'translateY(-50%)', fontSize: 9, fontWeight: 700, color: '#15803d' }}>EASY</div>
              <div style={{ position: 'absolute', left: '73%', top: '50%', transform: 'translateY(-50%)', fontSize: 9, fontWeight: 700, color: '#d97706' }}>HARD</div>
              <div style={{ position: 'absolute', left: '87%', top: '50%', transform: 'translateY(-50%)', fontSize: 9, fontWeight: 700, color: '#dc2626' }}>RISKY</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 10, color: 'var(--text3)' }}>0%</span>
              <span style={{ fontSize: 10, color: 'var(--text3)' }}>70%</span>
              <span style={{ fontSize: 10, color: 'var(--text3)' }}>85%</span>
              <span style={{ fontSize: 10, color: 'var(--text3)' }}>100%</span>
            </div>
          </div>

          {/* Best / Worst case */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ padding: '14px', background: 'linear-gradient(135deg, #15803d22, #15803d0a)', border: '2px solid #15803d55', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#15803d', textTransform: 'uppercase', marginBottom: 6 }}>🏆 Best Case</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#15803d', fontFamily: 'var(--font-display)' }}>
                {result.bestCase.toFixed(1)}%
              </div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>If you score 100% on all remaining</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: result.bestCase >= parseFloat(passingScore) ? '#15803d' : '#dc2626', marginTop: 6 }}>
                {result.bestCase >= parseFloat(passingScore) ? '✓ Would PASS' : '✗ Would FAIL'}
              </div>
            </div>
            <div style={{ padding: '14px', background: 'linear-gradient(135deg, #dc262622, #dc26260a)', border: '2px solid #dc262655', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', marginBottom: 6 }}>💔 Worst Case</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#dc2626', fontFamily: 'var(--font-display)' }}>
                {result.worstCase.toFixed(1)}%
              </div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>If you score 0% on all remaining</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: result.worstCase >= parseFloat(passingScore) ? '#15803d' : '#dc2626', marginTop: 6 }}>
                {result.worstCase >= parseFloat(passingScore) ? '✓ Would PASS' : '✗ Would FAIL'}
              </div>
            </div>
          </div>

          {/* Formula explanation */}
          <div style={{ padding: '12px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 6 }}>📐 Formula</p>
            <p style={{ fontSize: 11, color: 'var(--text2)', margin: 0, lineHeight: 1.7 }}>
              <span style={{ fontFamily: 'monospace', background: 'var(--surface2)', padding: '1px 5px', borderRadius: 4 }}>
                Required = (Target − Current × CompletedWeight) ÷ RemainingWeight
              </span>
              <br />
              Completed weight = {((1 - parseFloat(remainingWeight) / 100) * 100).toFixed(0)}% &nbsp;|&nbsp;
              Remaining weight = {remainingWeight}%
            </p>
          </div>
        </>
      )}
    </div>
  );
}
