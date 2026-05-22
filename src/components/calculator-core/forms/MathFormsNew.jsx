import { useState, useEffect } from "react";
import { L, N, Sl, Sel, Tabs, Row2, Row3, Panel, buildResult } from "./SharedComponents.jsx";

// ── LCM & GCF Calculator ──────────────────────────────────────────────
export function LCMGCFForm() {
  const [a, setA] = useState("12");
  const [b, setB] = useState("18");
  const [res, setRes] = useState(null);

  const gcd = (x, y) => !y ? Math.abs(x) : gcd(y, x % y);

  useEffect(() => {
    const numA = Math.abs(Math.round(+a)), numB = Math.abs(Math.round(+b));
    if (!numA || !numB) { setRes(null); return; }
    const g = gcd(numA, numB);
    const l = (numA * numB) / g;
    const steps = [];
    let x = numA, y = numB;
    while (y !== 0) { steps.push({ a: x, b: y, q: Math.floor(x / y), r: x % y }); [x, y] = [y, x % y]; }
    setRes(buildResult("LCM", l.toLocaleString(),
      [
        { label: "GCF / GCD", value: g.toLocaleString(), highlight: true },
        { label: "LCM", value: l.toLocaleString(), highlight: true },
        { label: "Numbers", value: `${numA} and ${numB}` },
        { label: "GCF × LCM", value: (g * l).toLocaleString() + " = " + numA + " × " + numB },
      ],
      [{ type: "tip", msg: `GCF(${numA}, ${numB}) = ${g} (Euclidean algorithm). LCM = ${numA} × ${numB} / GCF = ${l}.` }],
      null, steps.map((s, i) => ({ label: `Step ${i + 1}`, value: `${s.a} = ${s.b} × ${s.q} + ${s.r}` }))));
  }, [a, b]);

  return (
    <div>
      <Row2>
        <N label="First Number" id="lcma" value={a} onChange={setA} placeholder="e.g. 12" />
        <N label="Second Number" id="lcmb" value={b} onChange={setB} placeholder="e.g. 18" />
      </Row2>
      {res && <Panel result={res} loading={null} label="LCM & GCF" />}
    </div>
  );
}

// ── Factor Calculator ─────────────────────────────────────────────────
export function FactorForm() {
  const [num, setNum] = useState("360");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const n = Math.abs(Math.round(+num));
    if (!n || n > 1e9) { setRes(null); return; }
    const factors = [];
    for (let i = 1; i <= Math.sqrt(n); i++) {
      if (n % i === 0) { factors.push(i); if (i !== n / i) factors.push(n / i); }
    }
    factors.sort((a, b) => a - b);
    // Prime factorization
    let x = n;
    const primeFactors = {};
    for (let p = 2; p * p <= x; p++) {
      while (x % p === 0) { primeFactors[p] = (primeFactors[p] || 0) + 1; x /= p; }
    }
    if (x > 1) primeFactors[x] = (primeFactors[x] || 0) + 1;
    const primeFacStr = Object.entries(primeFactors).map(([p, e]) => e > 1 ? `${p}^${e}` : p).join(" × ");
    setRes(buildResult("Factor Count", factors.length + " factors",
      [
        { label: "Number", value: n.toLocaleString() },
        { label: "All Factors", value: factors.join(", ") },
        { label: "Prime Factorization", value: primeFacStr, highlight: true },
        { label: "Is Prime", value: factors.length === 2 ? "✅ Yes" : "❌ No" },
      ],
      [], null, factors.map(f => ({ label: `${f} × ${n / f}`, value: String(n) }))));
  }, [num]);

  return (
    <div>
      <N label="Enter a Number" id="facnum" value={num} onChange={setNum} placeholder="e.g. 360" hint="Find all factors and prime factorization" />
      {res && <Panel result={res} loading={null} label="Factor Calculator" />}
    </div>
  );
}

// ── Triangle Calculator ───────────────────────────────────────────────
export function TriangleForm() {
  const [mode, setMode] = useState("SSS");
  const [a, setA] = useState("3");
  const [b, setB] = useState("4");
  const [c, setC] = useState("5");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const A = +a, B = +b, C = +c;
    if (!A || !B || !C) { setRes(null); return; }
    const cosA = (B * B + C * C - A * A) / (2 * B * C);
    const cosB = (A * A + C * C - B * B) / (2 * A * C);
    const cosC = (A * A + B * B - C * C) / (2 * A * B);
    if (Math.abs(cosA) > 1 || Math.abs(cosB) > 1 || Math.abs(cosC) > 1) { setRes(null); return; }
    const angA = Math.acos(cosA) * 180 / Math.PI;
    const angB = Math.acos(cosB) * 180 / Math.PI;
    const angC = Math.acos(cosC) * 180 / Math.PI;
    const s = (A + B + C) / 2;
    const area = Math.sqrt(s * (s - A) * (s - B) * (s - C));
    const perimeter = A + B + C;
    const circumR = (A * B * C) / (4 * area);
    const inR = area / s;
    setRes(buildResult("Area", area.toFixed(4),
      [
        { label: "Area", value: area.toFixed(4) + " sq units", highlight: true },
        { label: "Perimeter", value: perimeter.toFixed(4) },
        { label: "Angle A", value: angA.toFixed(2) + "°" },
        { label: "Angle B", value: angB.toFixed(2) + "°" },
        { label: "Angle C", value: angC.toFixed(2) + "°" },
      ],
      [{ type: "tip", msg: `${angA < 90 && angB < 90 && angC < 90 ? "Acute" : angA === 90 || angB === 90 || angC === 90 ? "Right" : "Obtuse"} triangle. Circumradius: ${circumR.toFixed(3)}, Inradius: ${inR.toFixed(3)}.` }],
      null, []));
  }, [a, b, c, mode]);

  return (
    <div>
      <Tabs tabs={["SSS (3 Sides)", "SAS", "ASA"]} active={mode === "SSS" ? "SSS (3 Sides)" : mode} onChange={v => setMode(v.split(" ")[0])} />
      <Row3>
        <N label="Side a" id="tri_a" value={a} onChange={setA} unit="units" />
        <N label="Side b" id="tri_b" value={b} onChange={setB} unit="units" />
        <N label="Side c" id="tri_c" value={c} onChange={setC} unit="units" />
      </Row3>
      {res && <Panel result={res} loading={null} label="Triangle" />}
    </div>
  );
}

// ── Circle Calculator ─────────────────────────────────────────────────
export function CircleForm() {
  const [input, setInput] = useState("5");
  const [inputType, setInputType] = useState("radius");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const v = +input;
    if (!v) { setRes(null); return; }
    const r = inputType === "radius" ? v : inputType === "diameter" ? v / 2 : inputType === "circumference" ? v / (2 * Math.PI) : Math.sqrt(v / Math.PI);
    const d = 2 * r;
    const circumference = 2 * Math.PI * r;
    const area = Math.PI * r * r;
    setRes(buildResult("Area", area.toFixed(4),
      [
        { label: "Radius", value: r.toFixed(4), highlight: true },
        { label: "Diameter", value: d.toFixed(4) },
        { label: "Circumference", value: circumference.toFixed(4) },
        { label: "Area", value: area.toFixed(4), highlight: true },
      ],
      [], null, [
        { label: "Semi-circle Area", value: (area / 2).toFixed(4) },
        { label: "Quarter-circle Area", value: (area / 4).toFixed(4) },
        { label: "Area / Circumference", value: (area / circumference).toFixed(4) + " = r/2" },
      ]));
  }, [input, inputType]);

  return (
    <div>
      <Sel label="Known Value" id="cirinput" value={inputType} onChange={setInputType} opts={[
        { v: "radius", l: "Radius" }, { v: "diameter", l: "Diameter" },
        { v: "circumference", l: "Circumference" }, { v: "area", l: "Area" },
      ]} />
      <N label={inputType.charAt(0).toUpperCase() + inputType.slice(1)} id="cirval" value={input} onChange={setInput} unit="units" />
      {res && <Panel result={res} loading={null} label="Circle" />}
    </div>
  );
}

// ── Volume Calculator ─────────────────────────────────────────────────
export function VolumeForm() {
  const [shape, setShape] = useState("sphere");
  const [r, setR] = useState("5");
  const [h, setH] = useState("10");
  const [l, setL] = useState("5");
  const [w, setW] = useState("4");
  const [res, setRes] = useState(null);

  useEffect(() => {
    let vol, formula;
    const R = +r, H = +h, L = +l, W = +w;
    if (shape === "sphere") { vol = (4 / 3) * Math.PI * R ** 3; formula = `V = (4/3)π × r³ = (4/3)π × ${R}³`; }
    else if (shape === "cylinder") { vol = Math.PI * R ** 2 * H; formula = `V = π × r² × h = π × ${R}² × ${H}`; }
    else if (shape === "cone") { vol = (1 / 3) * Math.PI * R ** 2 * H; formula = `V = (1/3)π × r² × h`; }
    else if (shape === "cube") { vol = L ** 3; formula = `V = l³ = ${L}³`; }
    else if (shape === "cuboid") { vol = L * W * H; formula = `V = l × w × h = ${L} × ${W} × ${H}`; }
    else if (shape === "pyramid") { vol = (1 / 3) * L * W * H; formula = `V = (1/3) × l × w × h`; }
    if (!vol || !isFinite(vol)) { setRes(null); return; }
    setRes(buildResult("Volume", vol.toFixed(4) + " cu units",
      [
        { label: "Volume", value: vol.toFixed(4) + " cu units", highlight: true },
        { label: "Formula", value: formula },
        { label: "In Liters (if units = cm)", value: (vol / 1000).toFixed(4) + " L" },
      ],
      [], null, []));
  }, [shape, r, h, l, w]);

  const needsRadius = ["sphere", "cylinder", "cone"].includes(shape);
  const needsHeight = ["cylinder", "cone", "cuboid", "pyramid"].includes(shape);
  const needsLength = ["cube", "cuboid", "pyramid"].includes(shape);
  const needsWidth = ["cuboid", "pyramid"].includes(shape);

  return (
    <div>
      <Sel label="Shape" id="vshape" value={shape} onChange={setShape} opts={[
        { v: "sphere", l: "Sphere" }, { v: "cylinder", l: "Cylinder" }, { v: "cone", l: "Cone" },
        { v: "cube", l: "Cube" }, { v: "cuboid", l: "Rectangular Prism (Cuboid)" }, { v: "pyramid", l: "Pyramid" },
      ]} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {needsRadius && <N label="Radius (r)" id="vr" value={r} onChange={setR} unit="units" />}
        {needsHeight && <N label="Height (h)" id="vh" value={h} onChange={setH} unit="units" />}
        {needsLength && <N label={shape === "cube" ? "Side (l)" : "Length (l)"} id="vl" value={l} onChange={setL} unit="units" />}
        {needsWidth && <N label="Width (w)" id="vw" value={w} onChange={setW} unit="units" />}
      </div>
      {res && <Panel result={res} loading={null} label="Volume" />}
    </div>
  );
}

// ── Z-Score Calculator ────────────────────────────────────────────────
export function ZScoreForm() {
  const [x, setX] = useState("75");
  const [mean, setMean] = useState("70");
  const [std, setStd] = useState("10");
  const [res, setRes] = useState(null);

  // Error function approximation
  const erf = z => {
    const t = 1 / (1 + 0.5 * Math.abs(z));
    const tau = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087294)))))))));
    return z >= 0 ? 1 - tau : tau - 1;
  };

  useEffect(() => {
    const X = +x, mu = +mean, sigma = +std;
    if (!sigma || sigma <= 0) { setRes(null); return; }
    const z = (X - mu) / sigma;
    const percentile = (0.5 * (1 + erf(z / Math.sqrt(2))) * 100).toFixed(2);
    setRes(buildResult("Z-Score", z.toFixed(4),
      [
        { label: "Z-Score", value: z.toFixed(4), highlight: true },
        { label: "Percentile", value: percentile + "%", highlight: true },
        { label: "Values Above", value: (100 - +percentile).toFixed(2) + "%" },
        { label: "Interpretation", value: Math.abs(z) < 1 ? "Within 1σ (68%)" : Math.abs(z) < 2 ? "Within 2σ (95%)" : Math.abs(z) < 3 ? "Within 3σ (99.7%)" : "Extreme outlier" },
      ],
      [{ type: "tip", msg: `Z = ${z.toFixed(2)}: the value ${X} is ${Math.abs(z).toFixed(2)} standard deviations ${z >= 0 ? "above" : "below"} the mean of ${mu}.` }],
      null, []));
  }, [x, mean, std]);

  return (
    <div>
      <Row3>
        <N label="Value (X)" id="zsx" value={x} onChange={setX} />
        <N label="Mean (μ)" id="zsmu" value={mean} onChange={setMean} />
        <N label="Std Dev (σ)" id="zssig" value={std} onChange={setStd} hint="Must be > 0" />
      </Row3>
      {res && <Panel result={res} loading={null} label="Z-Score" />}
    </div>
  );
}

// ── Permutation & Combination Calculator ─────────────────────────────
export function PermCombForm() {
  const [n, setN] = useState("10");
  const [r, setR] = useState("3");
  const [res, setRes] = useState(null);

  const fact = x => x <= 1 ? 1 : x * fact(x - 1);

  useEffect(() => {
    const N = Math.round(+n), R = Math.round(+r);
    if (!N || !R || R > N || N > 20) { setRes(null); return; }
    const perm = fact(N) / fact(N - R);
    const comb = fact(N) / (fact(R) * fact(N - R));
    setRes(buildResult("Combinations C(n,r)", comb.toLocaleString(),
      [
        { label: "P(n,r) — Permutations", value: perm.toLocaleString(), highlight: true },
        { label: "C(n,r) — Combinations", value: comb.toLocaleString(), highlight: true },
        { label: "n! = " + N + "!", value: fact(N).toLocaleString() },
        { label: "r! = " + R + "!", value: fact(R).toLocaleString() },
      ],
      [{ type: "tip", msg: `P(${N},${R}) = ${perm.toLocaleString()} (order matters). C(${N},${R}) = ${comb.toLocaleString()} (order doesn't matter).` }],
      null, [
        { label: "P(n,r) Formula", value: `${N}! / (${N}-${R})! = ${perm.toLocaleString()}` },
        { label: "C(n,r) Formula", value: `${N}! / (${R}! × ${N - R}!) = ${comb.toLocaleString()}` },
      ]));
  }, [n, r]);

  return (
    <div>
      <Row2>
        <N label="n (Total Items)" id="pcn" value={n} onChange={setN} hint="Max 20 (factorial overflow above)" />
        <N label="r (Choose)" id="pcr" value={r} onChange={setR} hint="Must be ≤ n" />
      </Row2>
      {res && <Panel result={res} loading={null} label="Permutation & Combination" />}
    </div>
  );
}

// ── Average Calculator ────────────────────────────────────────────────
export function AverageForm() {
  const [data, setData] = useState("10, 20, 30, 40, 50");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const nums = data.split(/[,\s\n]+/).map(Number).filter(n => !isNaN(n));
    if (nums.length === 0) { setRes(null); return; }
    const sorted = [...nums].sort((a, b) => a - b);
    const mean = nums.reduce((s, v) => s + v, 0) / nums.length;
    const median = nums.length % 2 === 0
      ? (sorted[nums.length / 2 - 1] + sorted[nums.length / 2]) / 2
      : sorted[Math.floor(nums.length / 2)];
    const freq = {};
    nums.forEach(v => freq[v] = (freq[v] || 0) + 1);
    const maxFreq = Math.max(...Object.values(freq));
    const modes = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);
    const variance = nums.reduce((s, v) => s + (v - mean) ** 2, 0) / nums.length;
    const stdDev = Math.sqrt(variance);
    setRes(buildResult("Mean", mean.toFixed(4),
      [
        { label: "Mean (Average)", value: mean.toFixed(4), highlight: true },
        { label: "Median", value: median.toFixed(4) },
        { label: "Mode", value: modes.join(", ") },
        { label: "Std Deviation", value: stdDev.toFixed(4) },
        { label: "Range", value: `${sorted[0]} – ${sorted[sorted.length - 1]}` },
        { label: "Count", value: nums.length },
      ],
      [], null, []));
  }, [data]);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <L t="Enter Numbers (comma or space separated)" id="avgdata" />
        <textarea id="avgdata" value={data} onChange={e => setData(e.target.value)} rows={4}
          style={{ width: "100%", padding: "12px 14px", background: "var(--surface2)", border: "1.5px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 14, color: "var(--text)", fontFamily: "var(--font-mono)", resize: "vertical", outline: "none" }} />
      </div>
      {res && <Panel result={res} loading={null} label="Average" />}
    </div>
  );
}

// ── Percent Error Calculator ──────────────────────────────────────────
export function PercentErrorForm() {
  const [experimental, setExperimental] = useState("9.8");
  const [theoretical, setTheoretical] = useState("10");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const exp = +experimental, theo = +theoretical;
    if (!theo) { setRes(null); return; }
    const error = Math.abs(exp - theo) / Math.abs(theo) * 100;
    const absError = Math.abs(exp - theo);
    const relError = absError / Math.abs(theo);
    setRes(buildResult("Percent Error", error.toFixed(4) + "%",
      [
        { label: "Percent Error", value: error.toFixed(4) + "%", highlight: true, warn: error > 10 },
        { label: "Absolute Error", value: absError.toFixed(4) },
        { label: "Relative Error", value: relError.toFixed(6) },
        { label: "Accuracy", value: (100 - error).toFixed(4) + "%" },
      ],
      [{ type: error <= 5 ? "tip" : "warn", msg: `${error.toFixed(2)}% error. ${error <= 1 ? "Excellent accuracy!" : error <= 5 ? "Good accuracy." : error <= 10 ? "Moderate error — check measurement technique." : "High error — significant deviation from expected value."}` }],
      null, [
        { label: "Experimental Value", value: String(exp) },
        { label: "Theoretical Value", value: String(theo) },
        { label: "Difference", value: (exp - theo).toFixed(4) + (exp > theo ? " (over)" : " (under)") },
      ]));
  }, [experimental, theoretical]);

  return (
    <div>
      <Row2>
        <N label="Experimental Value" id="pee" value={experimental} onChange={setExperimental} hint="Your measured result" />
        <N label="Theoretical Value" id="pet" value={theoretical} onChange={setTheoretical} hint="The accepted/expected value" />
      </Row2>
      {res && <Panel result={res} loading={null} label="Percent Error" />}
    </div>
  );
}

// ── Linear Equation Solver ────────────────────────────────────────────
export function LinearEquationForm() {
  const [a, setA] = useState("2");
  const [b, setB] = useState("6");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const A = +a, B = +b;
    if (!A) { setRes(null); return; }
    const x = -B / A;
    setRes(buildResult("Solution", `x = ${x.toFixed(6)}`,
      [
        { label: "Equation", value: `${A}x + ${B} = 0` },
        { label: "Solution", value: `x = ${x}`, highlight: true },
        { label: "Verification", value: `${A}(${x}) + ${B} = ${(A * x + B).toFixed(6)}` },
      ],
      [], null, [
        { label: "Step 1", value: `${A}x = -${B}` },
        { label: "Step 2", value: `x = ${-B} / ${A}` },
        { label: "Step 3", value: `x = ${x}` },
      ]));
  }, [a, b]);

  return (
    <div>
      <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 14 }}>Solve for x in: <strong>ax + b = 0</strong></p>
      <Row2>
        <N label="Coefficient a (of x)" id="lea" value={a} onChange={setA} hint="Must not be 0" />
        <N label="Constant b" id="leb" value={b} onChange={setB} />
      </Row2>
      {res && <Panel result={res} loading={null} label="Linear Equation" />}
    </div>
  );
}

// ── Distance Calculator ───────────────────────────────────────────────
export function DistanceForm() {
  const [x1, setX1] = useState("0");
  const [y1, setY1] = useState("0");
  const [x2, setX2] = useState("3");
  const [y2, setY2] = useState("4");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const X1 = +x1, Y1 = +y1, X2 = +x2, Y2 = +y2;
    const dist = Math.sqrt((X2 - X1) ** 2 + (Y2 - Y1) ** 2);
    const midX = (X1 + X2) / 2, midY = (Y1 + Y2) / 2;
    const slope = X2 !== X1 ? (Y2 - Y1) / (X2 - X1) : Infinity;
    setRes(buildResult("Distance", dist.toFixed(6),
      [
        { label: "Distance", value: dist.toFixed(6), highlight: true },
        { label: "Midpoint", value: `(${midX}, ${midY})` },
        { label: "Slope", value: isFinite(slope) ? slope.toFixed(4) : "Undefined (vertical)" },
        { label: "Δx, Δy", value: `${X2 - X1}, ${Y2 - Y1}` },
      ],
      [{ type: "tip", msg: `Formula: √((${X2}-${X1})² + (${Y2}-${Y1})²) = √(${(X2 - X1) ** 2} + ${(Y2 - Y1) ** 2}) = ${dist.toFixed(4)}` }],
      null, []));
  }, [x1, y1, x2, y2]);

  return (
    <div>
      <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 14 }}>Enter coordinates of two points to calculate distance, midpoint, and slope.</p>
      <Row2>
        <N label="Point 1 — X₁" id="dstx1" value={x1} onChange={setX1} />
        <N label="Point 1 — Y₁" id="dsty1" value={y1} onChange={setY1} />
      </Row2>
      <Row2>
        <N label="Point 2 — X₂" id="dstx2" value={x2} onChange={setX2} />
        <N label="Point 2 — Y₂" id="dsty2" value={y2} onChange={setY2} />
      </Row2>
      {res && <Panel result={res} loading={null} label="Distance" />}
    </div>
  );
}

// Default export
export default { LCMGCFForm, FactorForm, TriangleForm, CircleForm, VolumeForm, ZScoreForm, PermCombForm, AverageForm, PercentErrorForm, LinearEquationForm, DistanceForm };
