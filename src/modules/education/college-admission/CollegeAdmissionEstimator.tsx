import React, { useState, useEffect, useCallback } from 'react';

type ECStrength = 'none' | 'some' | 'strong' | 'exceptional';
type EssayStrength = 'not_started' | 'average' | 'strong' | 'exceptional';
type TestType = 'sat' | 'act';
type GPAType = 'unweighted' | 'weighted';

const EC_SCORES: Record<ECStrength, number> = { none: 0, some: 5, strong: 15, exceptional: 25 };
const ESSAY_SCORES: Record<EssayStrength, number> = { not_started: 0, average: 5, strong: 15, exceptional: 25 };

const TIERS = [
  {
    name: 'Tier 1 — Elite',
    examples: 'Harvard, MIT, Stanford, Princeton, Yale, Columbia, UChicago',
    accept: '< 10%',
    minScore: 87,
    safety: 95,
    match: 82,
    reach: 70,
    color: '#7c3aed',
  },
  {
    name: 'Tier 2 — Highly Selective',
    examples: 'Top 10–25 (Duke, Northwestern, Cornell, etc.)',
    accept: '10–20%',
    minScore: 72,
    safety: 80,
    match: 68,
    reach: 55,
    color: '#1d4ed8',
  },
  {
    name: 'Tier 3 — Selective',
    examples: 'Top 25–75 (Tufts, Tulane, Fordham, etc.)',
    accept: '20–35%',
    minScore: 58,
    safety: 65,
    match: 52,
    reach: 40,
    color: '#0284c7',
  },
  {
    name: 'Tier 4 — Competitive',
    examples: 'Top 75–150 (Many state flagships)',
    accept: '35–55%',
    minScore: 42,
    safety: 48,
    match: 35,
    reach: 25,
    color: '#15803d',
  },
  {
    name: 'Tier 5 — Accessible',
    examples: '150+ schools, community colleges',
    accept: '55%+',
    minScore: 0,
    safety: 30,
    match: 15,
    reach: 5,
    color: '#65a30d',
  },
];

function actToSat(act: number): number {
  // Approximate ACT to SAT concordance
  const table: [number, number][] = [
    [36, 1590], [35, 1540], [34, 1500], [33, 1460], [32, 1430],
    [31, 1400], [30, 1370], [29, 1340], [28, 1310], [27, 1280],
    [26, 1240], [25, 1210], [24, 1180], [23, 1140], [22, 1110],
    [21, 1080], [20, 1040], [19, 1010], [18, 970], [17, 930],
    [16, 890], [15, 850], [14, 800], [13, 760], [12, 710],
    [11, 670], [1, 400],
  ];
  for (const [a, s] of table) {
    if (act >= a) return s;
  }
  return 400;
}

function getSatScore(score: number): number {
  return Math.min(35, Math.max(0, ((score - 400) / 1200) * 35));
}

function getGpaScore(gpa: number, type: GPAType): number {
  const normalized = type === 'weighted' ? Math.min(gpa / 5.0, 1) : Math.min(gpa / 4.0, 1);
  return normalized * 35;
}

function calcChance(score: number, tier: typeof TIERS[0]): number {
  // Map score to probability percentage for this tier
  if (score >= tier.safety) return Math.min(85, 50 + (score - tier.safety) * 3.5);
  if (score >= tier.match) return Math.max(20, 30 + (score - tier.match) * 2);
  if (score >= tier.reach) return Math.max(5, 10 + (score - tier.reach) * 1.5);
  return Math.max(2, score / tier.reach * 8);
}

function getCategory(score: number, tier: typeof TIERS[0]): { label: string; color: string; emoji: string } {
  if (score >= tier.safety) return { label: 'Safety', color: '#15803d', emoji: '🟢' };
  if (score >= tier.match) return { label: 'Match', color: '#d97706', emoji: '🟡' };
  if (score >= tier.reach) return { label: 'Reach', color: '#ea580c', emoji: '🟠' };
  return { label: 'Far Reach', color: '#dc2626', emoji: '🔴' };
}

export function CollegeAdmissionEstimator() {
  const [gpa, setGpa] = useState('3.7');
  const [gpaType, setGpaType] = useState<GPAType>('unweighted');
  const [testType, setTestType] = useState<TestType>('sat');
  const [satScore, setSatScore] = useState('1400');
  const [actScore, setActScore] = useState('32');
  const [ec, setEc] = useState<ECStrength>('strong');
  const [essay, setEssay] = useState<EssayStrength>('strong');
  const [legacyAthlete, setLegacyAthlete] = useState(false);
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

  const sel: React.CSSProperties = { ...inp, cursor: 'pointer' };

  const calc = useCallback(() => {
    const gpaVal = Math.min(gpaType === 'weighted' ? 5.0 : 4.0, Math.max(0, parseFloat(gpa) || 0));
    const satVal = testType === 'sat'
      ? Math.min(1600, Math.max(400, parseInt(satScore) || 400))
      : Math.min(1600, Math.max(400, actToSat(Math.min(36, Math.max(1, parseInt(actScore) || 1)))));

    const gpaPoints = getGpaScore(gpaVal, gpaType);
    const satPoints = getSatScore(satVal);
    const ecPoints = EC_SCORES[ec];
    const essayPoints = ESSAY_SCORES[essay];
    const legacyPoints = legacyAthlete ? 10 : 0;

    const totalScore = gpaPoints + satPoints + ecPoints + essayPoints + legacyPoints;

    const tiers = TIERS.map(tier => ({
      ...tier,
      chance: Math.round(calcChance(totalScore, tier)),
      category: getCategory(totalScore, tier),
    }));

    setResult({
      totalScore,
      gpaPoints,
      satPoints,
      ecPoints,
      essayPoints,
      legacyPoints,
      satVal,
      tiers,
    });
  }, [gpa, gpaType, testType, satScore, actScore, ec, essay, legacyAthlete]);

  useEffect(() => { calc(); }, [calc]);

  const toggleBtnStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '8px',
    borderRadius: 7,
    fontSize: 11,
    fontWeight: 700,
    cursor: 'pointer',
    background: active ? 'var(--brand)' : 'transparent',
    color: active ? '#fff' : 'var(--text3)',
    border: 'none',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* DISCLAIMER */}
      <div style={{ padding: '12px 14px', background: '#fef3c722', border: '2px solid #d9770655', borderRadius: 12 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#d97706', margin: 0, lineHeight: 1.5 }}>
          ⚠️ <strong>Disclaimer:</strong> This is a rough estimate for informational purposes only. College admissions involve many factors not captured here — essays, interviews, demographics, application timing, institutional priorities, and more. Use this as a starting point, not a definitive prediction.
        </p>
      </div>

      {/* GPA */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase' }}>GPA</label>
          <div style={{ display: 'flex', gap: 4, background: 'var(--surface2)', padding: 2, borderRadius: 7, border: '1px solid var(--border)' }}>
            {(['unweighted', 'weighted'] as GPAType[]).map(t => (
              <button key={t} onClick={() => setGpaType(t)} style={toggleBtnStyle(gpaType === t)}>
                {t === 'unweighted' ? 'Unweighted (4.0)' : 'Weighted (5.0)'}
              </button>
            ))}
          </div>
        </div>
        <input
          type="number"
          style={inp}
          value={gpa}
          onChange={e => setGpa(e.target.value)}
          min={0}
          max={gpaType === 'weighted' ? 5.0 : 4.0}
          step={0.01}
          placeholder={gpaType === 'weighted' ? '0.0 – 5.0' : '0.0 – 4.0'}
        />
        <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>
          {gpaType === 'weighted' ? 'Weighted GPA scale: 0.0 – 5.0' : 'Unweighted GPA scale: 0.0 – 4.0'}
        </div>
      </div>

      {/* Test Score */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase' }}>Test Score</label>
          <div style={{ display: 'flex', gap: 4, background: 'var(--surface2)', padding: 2, borderRadius: 7, border: '1px solid var(--border)' }}>
            {(['sat', 'act'] as TestType[]).map(t => (
              <button key={t} onClick={() => setTestType(t)} style={toggleBtnStyle(testType === t)}>
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        {testType === 'sat' ? (
          <>
            <input type="number" style={inp} value={satScore} onChange={e => setSatScore(e.target.value)} min={400} max={1600} step={10} />
            <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>SAT: 400 – 1600</div>
          </>
        ) : (
          <>
            <input type="number" style={inp} value={actScore} onChange={e => setActScore(e.target.value)} min={1} max={36} step={1} />
            <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>
              ACT: 1 – 36{result ? ` (≈ SAT ${result.satVal})` : ''}
            </div>
          </>
        )}
      </div>

      {/* EC + Essay */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
            Extracurriculars
          </label>
          <select style={sel} value={ec} onChange={e => setEc(e.target.value as ECStrength)}>
            <option value="none">None</option>
            <option value="some">Some (clubs, basic activities)</option>
            <option value="strong">Strong (leadership roles)</option>
            <option value="exceptional">Exceptional (national awards)</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
            Essays
          </label>
          <select style={sel} value={essay} onChange={e => setEssay(e.target.value as EssayStrength)}>
            <option value="not_started">Not Started / Weak</option>
            <option value="average">Average</option>
            <option value="strong">Strong</option>
            <option value="exceptional">Exceptional</option>
          </select>
        </div>
      </div>

      {/* Legacy / Recruited Athlete */}
      <div style={{ padding: '12px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>Legacy / Recruited Athlete</div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>Parent attended target school or recruited athlete status (+10 pts)</div>
          </div>
          <div style={{ display: 'flex', gap: 6, background: 'var(--surface2)', padding: 3, borderRadius: 9, border: '1px solid var(--border)' }}>
            {[['Yes', true], ['No', false]].map(([l, v]) => (
              <button key={String(l)} onClick={() => setLegacyAthlete(v as boolean)}
                style={toggleBtnStyle(legacyAthlete === v)}>
                {l as string}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Score breakdown */}
      {result && (
        <>
          <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 10 }}>
              📊 Academic Profile Score
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: 'var(--brand)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
                {result.totalScore.toFixed(0)}
              </div>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text3)' }}>out of 120 pts maximum</div>
                <div style={{ width: 180, height: 8, background: 'var(--border)', borderRadius: 99, marginTop: 6, overflow: 'hidden' }}>
                  <div style={{ width: `${(result.totalScore / 120) * 100}%`, height: '100%', background: 'var(--brand)', borderRadius: 99 }} />
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
              {[
                { label: 'GPA', value: result.gpaPoints.toFixed(0), max: 35 },
                { label: testType.toUpperCase(), value: result.satPoints.toFixed(0), max: 35 },
                { label: 'ECs', value: result.ecPoints, max: 25 },
                { label: 'Essays', value: result.essayPoints, max: 25 },
                { label: 'Bonus', value: result.legacyPoints, max: 10 },
              ].map(({ label, value, max }) => (
                <div key={label} style={{ textAlign: 'center', padding: '8px', background: 'var(--surface2)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>{value}</div>
                  <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 1 }}>{label} /{max}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tier Probabilities */}
          <div style={{ padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 10 }}>
              🎓 Admission Probability by Tier
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {result.tiers.map((tier: any) => (
                <div key={tier.name} style={{ padding: '12px', background: 'var(--surface2)', borderRadius: 12, border: `1.5px solid ${tier.color}33` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: tier.color }}>{tier.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{tier.examples}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)' }}>Acceptance rate: {tier.accept}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 28, fontWeight: 900, color: tier.color, lineHeight: 1, fontFamily: 'var(--font-display)' }}>
                        {tier.chance}%
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 99, background: `${tier.category.color}18`, color: tier.category.color }}>
                        {tier.category.emoji} {tier.category.label}
                      </span>
                    </div>
                  </div>
                  <div style={{ width: '100%', height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ width: `${tier.chance}%`, height: '100%', background: tier.color, borderRadius: 99, transition: 'width 0.4s' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div style={{ padding: '12px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 8 }}>
              📖 Category Legend
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
                { emoji: '🟢', label: 'Safety', desc: 'High likelihood (>50% chance at this tier)' },
                { emoji: '🟡', label: 'Match', desc: 'Competitive profile (20–50%)' },
                { emoji: '🟠', label: 'Reach', desc: 'Possible but unlikely (5–20%)' },
                { emoji: '🔴', label: 'Far Reach', desc: 'Very unlikely (<5%)' },
              ].map(({ emoji, label, desc }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text2)', flex: '1 1 200px' }}>
                  <span>{emoji}</span>
                  <strong>{label}:</strong> {desc}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
