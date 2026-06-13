// @ts-nocheck
import { useState, useEffect } from "react";
import { L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency } from './SharedComponents';

// ── Concrete Calculator ───────────────────────────────────────────────
export function ConcreteForm() {
  const { fm } = useCurrency();
  const [shape, setShape] = useState("Slab");
  const [l, setL] = useState("10");
  const [w, setW] = useState("8");
  const [d, setD] = useState("4");
  const [unit, setUnit] = useState("imperial");
  const [bagSize, setBagSize] = useState("80");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const length = +l, width = +w, depth = +d;
    if (!length || !width || !depth) { setRes(null); return; }
    let volumeCubicFt;
    if (unit === "imperial") {
      volumeCubicFt = length * width * (depth / 12);
    } else {
      volumeCubicFt = length * width * depth * 35.3147;
    }
    const volumeCubicYd = volumeCubicFt / 27;
    const withWaste = volumeCubicFt * 1.1; // 10% waste
    const bags = Math.ceil(withWaste / (+bagSize === 80 ? 0.6 : +bagSize === 60 ? 0.45 : 0.3));
    setRes(buildResult("Concrete Volume", volumeCubicYd.toFixed(2) + " cu yd",
      [
        { label: "Volume (cu ft)", value: volumeCubicFt.toFixed(2) + " cu ft" },
        { label: "Volume (cu yd)", value: volumeCubicYd.toFixed(2) + " cu yd", highlight: true },
        { label: "Volume w/ 10% Waste", value: (withWaste / 27).toFixed(2) + " cu yd" },
        { label: `${bagSize}lb Bags Needed`, value: bags + " bags" },
      ],
      [{ type: "tip", msg: `Always order ${Math.ceil(volumeCubicYd * 1.1 * 10) / 10} cu yd (10% extra for waste). For large pours, ready-mix is more economical than bags.` }],
      null, [
        { label: "Length", value: length + (unit === "imperial" ? " ft" : " m") },
        { label: "Width", value: width + (unit === "imperial" ? " ft" : " m") },
        { label: "Depth", value: depth + (unit === "imperial" ? " in" : " m") },
      ]));
  }, [shape, l, w, d, unit, bagSize]);

  return (
    <div>
      <div style={{background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:16, padding:'24px 28px 20px', marginBottom:20}}>
        <p style={{fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'.09em', color:'var(--text3)', margin:'0 0 18px'}}>
          🏗️ Your Inputs
        </p>
        <Tabs tabs={["Slab", "Wall", "Column"]} active={shape} onChange={setShape} />
        <Tabs tabs={["Imperial (ft/in)", "Metric (m)"]} active={unit === "imperial" ? "Imperial (ft/in)" : "Metric (m)"} onChange={v => setUnit(v.includes("Imperial") ? "imperial" : "metric")} />
        <Row3>
          <N label={`Length (${unit === "imperial" ? "ft" : "m"})`} id="con_l" value={l} onChange={setL} unit={unit === "imperial" ? "ft" : "m"} />
          <N label={`Width (${unit === "imperial" ? "ft" : "m"})`} id="con_w" value={w} onChange={setW} unit={unit === "imperial" ? "ft" : "m"} />
          <N label={`Depth (${unit === "imperial" ? "in" : "m"})`} id="con_d" value={d} onChange={setD} unit={unit === "imperial" ? "in" : "m"} />
        </Row3>
        <Sel label="Bag Size" id="con_bag" value={bagSize} onChange={setBagSize} opts={[
          { v: "80", l: "80 lb bags" }, { v: "60", l: "60 lb bags" }, { v: "40", l: "40 lb bags" },
        ]} />
      </div>
      {res && <Panel result={res} loading={null} label="Concrete" />}
    </div>
  );
}

// ── Paint Calculator ──────────────────────────────────────────────────
export function PaintForm() {
  const { fm, sym } = useCurrency();
  const [rooms, setRooms] = useState([{ name: "Living Room", length: "20", width: "15", height: "9", windows: "2", doors: "1" }]);
  const [coats, setCoats] = useState(2);
  const [coverage, setCoverage] = useState(350);
  const [pricePerGal, setPricePerGal] = useState("30");
  const [res, setRes] = useState(null);

  const updateRoom = (i, k, v) => setRooms(prev => prev.map((r, idx) => idx === i ? { ...r, [k]: v } : r));

  useEffect(() => {
    let totalArea = 0;
    rooms.forEach(r => {
      const l = +r.length, w = +r.width, h = +r.height;
      if (!l || !w || !h) return;
      const wallArea = 2 * (l + w) * h;
      const deductions = (+r.windows || 0) * 15 + (+r.doors || 0) * 20;
      totalArea += wallArea - deductions;
    });
    const gallons = Math.ceil(totalArea * coats / coverage);
    const cost = gallons * (+pricePerGal || 0);
    setRes(buildResult("Paint Needed", gallons + " gallons",
      [
        { label: "Total Wall Area", value: totalArea.toFixed(0) + " sq ft" },
        { label: "Gallons (with " + coats + " coats)", value: gallons, highlight: true },
        { label: "Coverage Rate", value: coverage + " sq ft/gal" },
        { label: "Estimated Cost", value: fm(Math.round(cost)), highlight: pricePerGal !== "0" },
      ],
      [{ type: "tip", msg: `Buy ${Math.ceil(gallons * 1.1)} gallons (+10% extra) to ensure you have enough. Always test with a sample before committing to a color.` }],
      null, rooms.map(r => ({ label: r.name, value: `${(2 * (+r.length + +r.width) * +r.height).toFixed(0)} sq ft` }))));
  }, [rooms, coats, coverage, pricePerGal]);

  return (
    <div style={{display:'flex', flexDirection:'column', gap:20}}>
      <div style={{background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:16, padding:'22px 24px 20px'}}>
        <p style={{fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'.09em', color:'var(--text3)', margin:'0 0 18px'}}>
          🎨 Your Inputs
        </p>
        {rooms.map((r, i) => (
          <div key={i} style={{ marginBottom: 16, padding: 14, background: "var(--surface2)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <input value={r.name} onChange={e => updateRoom(i, "name", e.target.value)}
                style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", background: "transparent", border: "none", outline: "none", flex: "1 1 100%", marginBottom: 8 }} />
              {rooms.length > 1 && <button onClick={() => setRooms(p => p.filter((_, idx) => idx !== i))} style={{ color: "var(--text3)", background: "none", border: "none", cursor: "pointer", flex: "1 1 100%", textAlign: "left", paddingBottom: 8 }}>× Remove Room</button>}
            </div>
            <Row3>
              <N label="Length (ft)" id={`rm_l${i}`} value={r.length} onChange={v => updateRoom(i, "length", v)} unit="ft" />
              <N label="Width (ft)" id={`rm_w${i}`} value={r.width} onChange={v => updateRoom(i, "width", v)} unit="ft" />
              <N label="Height (ft)" id={`rm_h${i}`} value={r.height} onChange={v => updateRoom(i, "height", v)} unit="ft" />
            </Row3>
            <Row2>
              <N label="Windows" id={`rm_win${i}`} value={r.windows} onChange={v => updateRoom(i, "windows", v)} placeholder="0" />
              <N label="Doors" id={`rm_door${i}`} value={r.doors} onChange={v => updateRoom(i, "doors", v)} placeholder="0" />
            </Row2>
          </div>
        ))}
        <button onClick={() => setRooms(p => [...p, { name: `Room ${p.length + 1}`, length: "12", width: "10", height: "9", windows: "1", doors: "1" }])}
          style={{ width: "100%", padding: "10px", borderRadius: "var(--r-md)", border: "2px dashed var(--border)", background: "transparent", color: "var(--brand)", fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: 16 }}>
          + Add Room
        </button>
        <Row3>
          <N label="Coats" id="pcoats" value={String(coats)} onChange={v => setCoats(+v)} placeholder="2" />
          <N label="Coverage (sq ft/gal)" id="pcov" value={String(coverage)} onChange={v => setCoverage(+v)} unit="sq ft" />
          <N label="Price/Gallon" id="pprice" value={pricePerGal} onChange={setPricePerGal} unit={sym} />
        </Row3>
      </div>
      <Panel result={res} loading={null} label="Paint Calculator" />
    </div>
  );
}

// ── Square Footage Calculator ─────────────────────────────────────────
export function SquareFootageForm() {
  const { fm, sym } = useCurrency();
  const [rooms, setRooms] = useState([{ name: "Room 1", length: "15", width: "12", shape: "rectangle" }]);
  const [material, setMaterial] = useState("tile");
  const [pricePerSqft, setPricePerSqft] = useState("2.5");
  const [waste, setWaste] = useState("10");
  const [res, setRes] = useState(null);

  const updateRoom = (i, k, v) => setRooms(prev => prev.map((r, idx) => idx === i ? { ...r, [k]: v } : r));

  useEffect(() => {
    const areas = rooms.map(r => {
      const l = +r.length, w = +r.width;
      if (r.shape === "rectangle") return l * w;
      if (r.shape === "circle") return Math.PI * (l / 2) ** 2;
      if (r.shape === "triangle") return 0.5 * l * w;
      return l * w;
    });
    const totalArea = areas.reduce((s, v) => s + (v || 0), 0);
    const withWaste = totalArea * (1 + (+waste || 0) / 100);
    const cost = withWaste * (+pricePerSqft || 0);
    setRes(buildResult("Total Area", totalArea.toFixed(1) + " sq ft",
      [
        { label: "Base Area", value: totalArea.toFixed(1) + " sq ft" },
        { label: `With ${waste}% Waste`, value: withWaste.toFixed(1) + " sq ft", highlight: true },
        { label: "Material Needed", value: Math.ceil(withWaste) + " sq ft" },
        { label: "Estimated Cost", value: fm(Math.round(cost)) },
      ],
      [{ type: "tip", msg: `Always add ${waste}% waste factor for ${material}. Diagonal installation requires up to 15% extra material.` }],
      null, rooms.map((r, i) => ({ label: r.name, value: areas[i]?.toFixed(1) + " sq ft" }))));
  }, [rooms, material, pricePerSqft, waste]);

  return (
    <div style={{display:'flex', flexDirection:'column', gap:20}}>
      <div style={{background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:16, padding:'22px 24px 20px'}}>
        <p style={{fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'.09em', color:'var(--text3)', margin:'0 0 18px'}}>
          📐 Your Inputs
        </p>
        {rooms.map((r, i) => (
          <div key={i} style={{ marginBottom: 12, padding: 14, background: "var(--surface2)", borderRadius: "var(--r-lg)", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <input value={r.name} onChange={e => updateRoom(i, "name", e.target.value)}
                style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", background: "transparent", border: "none", outline: "none", flex: 1 }} />
              <select value={r.shape} onChange={e => updateRoom(i, "shape", e.target.value)}
                style={{ fontSize: 11, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: "2px 6px", color: "var(--text)" }}>
                <option value="rectangle">Rectangle</option>
                <option value="circle">Circle</option>
                <option value="triangle">Triangle</option>
              </select>
              {rooms.length > 1 && <button onClick={() => setRooms(p => p.filter((_, idx) => idx !== i))} style={{ color: "var(--text3)", background: "none", border: "none", cursor: "pointer", marginLeft: 8 }}>×</button>}
            </div>
            <Row2>
              <N label={r.shape === "circle" ? "Diameter (ft)" : "Length (ft)"} id={`sf_l${i}`} value={r.length} onChange={v => updateRoom(i, "length", v)} unit="ft" />
              {r.shape !== "circle" && <N label="Width (ft)" id={`sf_w${i}`} value={r.width} onChange={v => updateRoom(i, "width", v)} unit="ft" />}
            </Row2>
          </div>
        ))}
        <button onClick={() => setRooms(p => [...p, { name: `Room ${p.length + 1}`, length: "12", width: "10", shape: "rectangle" }])}
          style={{ width: "100%", padding: "10px", borderRadius: "var(--r-md)", border: "2px dashed var(--border)", background: "transparent", color: "var(--brand)", fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: 16 }}>
          + Add Area
        </button>
        <Row3>
          <Sel label="Material" id="sfmat" value={material} onChange={setMaterial} opts={[
            { v: "tile", l: "Tile (10%)" }, { v: "hardwood", l: "Hardwood (10%)" },
            { v: "carpet", l: "Carpet (5%)" }, { v: "laminate", l: "Laminate (10%)" },
          ]} />
          <N label="Waste (%)" id="sfwaste" value={waste} onChange={setWaste} unit="%" />
          <N label="Price/sq ft" id="sfprice" value={pricePerSqft} onChange={setPricePerSqft} unit={sym} />
        </Row3>
      </div>
      <Panel result={res} loading={null} label="Square Footage" />
    </div>
  );
}

// ── Construction Cost Calculator ──────────────────────────────────────
export function ConstructionCostForm() {
  const { fm, sym } = useCurrency();
  const [area, setArea] = useState("1500");
  const [laborRate, setLaborRate] = useState("80");
  const [materialRate, setMaterialRate] = useState("60");
  const [contingency, setContingency] = useState("15");
  const [extras, setExtras] = useState([{ name: "Permits", cost: "2000" }, { name: "Design/Architecture", cost: "5000" }]);
  const [res, setRes] = useState(null);

  useEffect(() => {
    const a = +area, l = +laborRate, m = +materialRate, c = +contingency / 100;
    if (!a) { setRes(null); return; }
    const laborCost = a * l;
    const materialCost = a * m;
    const extraTotal = extras.reduce((s, e) => s + (+e.cost || 0), 0);
    const subtotal = laborCost + materialCost + extraTotal;
    const contingencyAmt = subtotal * c;
    const total = subtotal + contingencyAmt;
    const chart = { type: "donut", data: [
      { name: "Labor", value: laborCost, color: "#3b82f6" },
      { name: "Materials", value: materialCost, color: "#f59e0b" },
      { name: "Extras", value: extraTotal, color: "#8b5cf6" },
      { name: "Contingency", value: contingencyAmt, color: "#ef4444" },
    ]};
    setRes(buildResult("Total Project Cost", fm(Math.round(total)),
      [
        { label: "Labor Cost", value: fm(Math.round(laborCost)) },
        { label: "Material Cost", value: fm(Math.round(materialCost)) },
        { label: "Contingency (" + contingency + "%)", value: fm(Math.round(contingencyAmt)), warn: true },
        { label: "Cost per Sq Ft", value: fm((total / a).toFixed(2)) + "/sq ft" },
      ],
      [{ type: "tip", msg: `Always keep a ${contingency}% contingency budget. Construction projects typically exceed initial estimates by 10-20%.` }],
      chart, [
        { label: "Subtotal", value: fm(Math.round(subtotal)) },
        ...extras.map(e => ({ label: e.name, value: fm(+e.cost || 0) })),
        { label: "Contingency", value: fm(Math.round(contingencyAmt)) },
        { label: "TOTAL", value: fm(Math.round(total)) },
      ]));
  }, [area, laborRate, materialRate, contingency, extras]);

  return (
    <div style={{display:'flex', flexDirection:'column', gap:20}}>
      <div style={{background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:16, padding:'22px 24px 20px'}}>
        <p style={{fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'.09em', color:'var(--text3)', margin:'0 0 18px'}}>
          🏠 Your Inputs
        </p>
        <N label="Project Area (sq ft)" id="cca" value={area} onChange={setArea} unit="sq ft" />
        <Row2>
          <N label="Labor Rate (per sq ft)" id="cclr" value={laborRate} onChange={setLaborRate} unit={sym} />
          <N label="Material Rate (per sq ft)" id="ccmr" value={materialRate} onChange={setMaterialRate} unit={sym} />
        </Row2>
        <N label="Contingency (%)" id="ccc" value={contingency} onChange={setContingency} unit="%" hint="Recommended: 10-20%" />
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text3)", marginBottom: 10 }}>Additional Costs</p>
        {extras.map((e, i) => (
          <div key={i} className="extra-cost-row calc-form-stack" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
            <input value={e.name} onChange={ev => setExtras(p => p.map((x, idx) => idx === i ? { ...x, name: ev.target.value } : x))}
              className="cost-name-input"
              style={{ flex: "1 1 100%", height: 48, padding: "0 10px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 16, color: "var(--text)", fontFamily: "var(--font)" }} />
            <input value={e.cost} onChange={ev => setExtras(p => p.map((x, idx) => idx === i ? { ...x, cost: ev.target.value } : x))} type="number"
              className="cost-value-input"
              style={{ flex: "1 1 calc(100% - 40px)", height: 48, padding: "0 10px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 16, color: "var(--text)", fontFamily: "var(--font)" }} />
            <button onClick={() => setExtras(p => p.filter((_, idx) => idx !== i))} style={{ color: "var(--text3)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", cursor: "pointer", width: 32, height: 48 }}>×</button>
          </div>
        ))}
        <button onClick={() => setExtras(p => [...p, { name: "Item", cost: "0" }])}
          style={{ width: "100%", padding: "8px", borderRadius: "var(--r-md)", border: "2px dashed var(--border)", background: "transparent", color: "var(--brand)", fontWeight: 700, fontSize: 12, cursor: "pointer", marginTop: 8 }}>
          + Add Cost Item
        </button>
      </div>
      <Panel result={res} loading={null} label="Construction Cost" />
    </div>
  );
}

// ── Electrical Load Calculator ────────────────────────────────────────
export function ElectricalLoadForm() {
  const [appliances, setAppliances] = useState([
    { name: "Air Conditioner", watts: "1500", hours: "8" },
    { name: "Refrigerator", watts: "150", hours: "24" },
    { name: "Washing Machine", watts: "500", hours: "1" },
    { name: "TV", watts: "100", hours: "6" },
    { name: "Lighting", watts: "200", hours: "6" },
  ]);
  const [voltage, setVoltage] = useState("230");
  const [res, setRes] = useState(null);

  const updateApp = (i, k, v) => setAppliances(prev => prev.map((a, idx) => idx === i ? { ...a, [k]: v } : a));

  useEffect(() => {
    const items = appliances.map(a => ({ ...a, wh: +a.watts * +a.hours }));
    const totalWatts = appliances.reduce((s, a) => s + (+a.watts || 0), 0);
    const totalKWh = items.reduce((s, a) => s + a.wh / 1000, 0);
    const monthlyKWh = totalKWh * 30;
    const amps = (totalWatts / +voltage).toFixed(1);
    const breaker = totalWatts < 1800 ? "15A" : totalWatts < 2400 ? "20A" : totalWatts < 4800 ? "30A (or split circuits)" : "60A+ (split into multiple circuits)";
    setRes(buildResult("Total Load", totalWatts + " W",
      [
        { label: "Daily Consumption", value: totalKWh.toFixed(2) + " kWh" },
        { label: "Monthly Consumption", value: monthlyKWh.toFixed(1) + " kWh", highlight: true },
        { label: "Current Draw", value: amps + " A at " + voltage + "V" },
        { label: "Recommended Breaker", value: breaker, highlight: true },
      ],
      [{ type: "tip", msg: `Total load is ${totalWatts}W. Never run appliances at 100% breaker capacity — use max 80% of rated breaker (${Math.round(totalWatts / +voltage / 0.8)}A breaker recommended).` }],
      null, items.map(a => ({ label: a.name, value: `${a.watts}W × ${a.hours}h = ${(a.wh / 1000).toFixed(2)} kWh/day` }))));
  }, [appliances, voltage]);

  return (
    <div style={{display:'flex', flexDirection:'column', gap:20}}>
      <div style={{background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:16, padding:'22px 24px 20px'}}>
        <p style={{fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'.09em', color:'var(--text3)', margin:'0 0 18px'}}>
          ⚡ Your Inputs
        </p>
        <Sel label="Voltage" id="elv" value={voltage} onChange={setVoltage} opts={[{ v: "120", l: "120V (US)" }, { v: "230", l: "230V (EU/Asia)" }, { v: "240", l: "240V (UK/AU)" }]} />
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text3)", marginBottom: 10 }}>Appliances</p>
        {appliances.map((a, i) => (
          <div key={i} className="appliance-row calc-form-stack" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8, alignItems: "center" }}>
            <input value={a.name} onChange={e => updateApp(i, "name", e.target.value)}
              style={{ flex: "1 1 100%", height: 48, padding: "0 10px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 16, color: "var(--text)", fontFamily: "var(--font)" }} />
            <div style={{ display: "flex", gap: 8, flex: "1 1 100%" }}>
              <input value={a.watts} onChange={e => updateApp(i, "watts", e.target.value)} type="number" placeholder="Watts"
                className="app-watts"
                style={{ flex: 1, height: 48, padding: "0 8px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 16, color: "var(--text)", fontFamily: "var(--font)" }} />
              <input value={a.hours} onChange={e => updateApp(i, "hours", e.target.value)} type="number" placeholder="hrs/day"
                className="app-hours"
                style={{ flex: 1, height: 48, padding: "0 8px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 16, color: "var(--text)", fontFamily: "var(--font)" }} />
              <button onClick={() => setAppliances(p => p.filter((_, idx) => idx !== i))} style={{ color: "var(--text3)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", cursor: "pointer", width: 48 }}>×</button>
            </div>
          </div>
        ))}
        <button onClick={() => setAppliances(p => [...p, { name: "Appliance", watts: "100", hours: "4" }])}
          style={{ width: "100%", padding: "8px", borderRadius: "var(--r-md)", border: "2px dashed var(--border)", background: "transparent", color: "var(--brand)", fontWeight: 700, fontSize: 12, cursor: "pointer", marginTop: 8 }}>
          + Add Appliance
        </button>
      </div>
      <Panel result={res} loading={null} label="Electrical Load" />
    </div>
  );
}

// ── Density Calculator ────────────────────────────────────────────────
export function DensityForm() {
  const [solve, setSolve] = useState("density");
  const [mass, setMass] = useState("50");
  const [volume, setVolume] = useState("10");
  const [density, setDensity] = useState("5");
  const [res, setRes] = useState(null);

  useEffect(() => {
    let result, label, val;
    if (solve === "density") { result = +mass / +volume; label = "Density"; val = result.toFixed(4) + " kg/m³"; }
    else if (solve === "mass") { result = +density * +volume; label = "Mass"; val = result.toFixed(4) + " kg"; }
    else { result = +mass / +density; label = "Volume"; val = result.toFixed(4) + " m³"; }
    if (!isFinite(result)) { setRes(null); return; }
    const refs = [
      { name: "Water", density: 1000 }, { name: "Aluminum", density: 2700 },
      { name: "Steel", density: 7850 }, { name: "Concrete", density: 2400 },
      { name: "Wood (Oak)", density: 600 }, { name: "Gold", density: 19300 },
    ];
    const closest = refs.reduce((a, b) => Math.abs(a.density - (solve === "density" ? result : +density)) < Math.abs(b.density - (solve === "density" ? result : +density)) ? a : b);
    setRes(buildResult(label, val,
      [
        { label: "Density", value: (solve === "density" ? result : +density).toFixed(2) + " kg/m³" },
        { label: "Mass", value: (solve === "mass" ? result : +mass) + " kg" },
        { label: "Volume", value: (solve === "volume" ? result : +volume) + " m³" },
        { label: "Closest Material", value: closest.name + " (" + closest.density + " kg/m³)" },
      ],
      [{ type: "tip", msg: `This material has a similar density to ${closest.name} (${closest.density} kg/m³).` }],
      null, []));
  }, [solve, mass, volume, density]);

  return (
    <div>
      <div style={{background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:16, padding:'24px 28px 20px', marginBottom:20}}>
        <p style={{fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'.09em', color:'var(--text3)', margin:'0 0 18px'}}>
          ⚖️ Your Inputs
        </p>
        <Tabs tabs={["Solve Density", "Solve Mass", "Solve Volume"]} active={solve === "density" ? "Solve Density" : solve === "mass" ? "Solve Mass" : "Solve Volume"} onChange={v => setSolve(v.split(" ")[1].toLowerCase())} />
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {solve !== "density" && <N label="Density (kg/m³)" id="den_d" value={density} onChange={setDensity} unit="kg/m³" />}
          {solve !== "mass" && <N label="Mass (kg)" id="den_m" value={mass} onChange={setMass} unit="kg" />}
          {solve !== "volume" && <N label="Volume (m³)" id="den_v" value={volume} onChange={setVolume} unit="m³" />}
        </div>
      </div>
      {res && <Panel result={res} loading={null} label="Density" />}
    </div>
  );
}

// ── Pressure Calculator ───────────────────────────────────────────────
export function PressureForm() {
  const [force, setForce] = useState("100");
  const [area, setArea] = useState("10");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const f = +force, a = +area;
    if (!f || !a) { setRes(null); return; }
    const pa = f / a;
    setRes(buildResult("Pressure", pa.toFixed(3) + " Pa",
      [
        { label: "Pascals (Pa)", value: pa.toFixed(3) },
        { label: "Kilopascals (kPa)", value: (pa / 1000).toFixed(6) },
        { label: "PSI (lb/in²)", value: (pa / 6894.76).toFixed(6) },
        { label: "Bar", value: (pa / 100000).toFixed(8) },
        { label: "Atmosphere (atm)", value: (pa / 101325).toFixed(8) },
      ],
      [{ type: "tip", msg: `Standard atmospheric pressure is 101,325 Pa (1 atm, 14.696 PSI, 1.01325 bar).` }],
      null, []));
  }, [force, area]);

  return (
    <div>
      <div style={{background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:16, padding:'24px 28px 20px', marginBottom:20}}>
        <p style={{fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'.09em', color:'var(--text3)', margin:'0 0 18px'}}>
          🌡️ Your Inputs
        </p>
        <Row2>
          <N label="Force (Newtons)" id="pref" value={force} onChange={setForce} unit="N" />
          <N label="Area (m²)" id="prea" value={area} onChange={setArea} unit="m²" />
        </Row2>
      </div>
      {res && <Panel result={res} loading={null} label="Pressure" />}
    </div>
  );
}

// ── Pipe Volume Calculator ─────────────────────────────────────────────
export function PipeVolumeForm() {
  const [diameter, setDiameter] = useState("0.1");
  const [length, setLength] = useState("10");
  const [unit, setUnit] = useState("m");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const d = +diameter, l = +length;
    const r = d / 2;
    const volM3 = Math.PI * r * r * l;
    const volLiters = volM3 * 1000;
    const volGallons = volLiters * 0.264172;
    setRes(buildResult("Pipe Volume", volLiters.toFixed(3) + " L",
      [
        { label: "Volume (m³)", value: volM3.toFixed(6) },
        { label: "Volume (Liters)", value: volLiters.toFixed(3), highlight: true },
        { label: "Volume (US Gallons)", value: volGallons.toFixed(3) },
        { label: "Cross-section Area", value: (Math.PI * r * r).toFixed(6) + " m²" },
      ],
      [], null, []));
  }, [diameter, length, unit]);

  return (
    <div>
      <div style={{background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:16, padding:'24px 28px 20px', marginBottom:20}}>
        <p style={{fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'.09em', color:'var(--text3)', margin:'0 0 18px'}}>
          🔧 Your Inputs
        </p>
        <Row2>
          <N label="Inner Diameter (m)" id="pvd" value={diameter} onChange={setDiameter} unit="m" hint="Inner diameter of pipe" />
          <N label="Length (m)" id="pvl" value={length} onChange={setLength} unit="m" />
        </Row2>
      </div>
      {res && <Panel result={res} loading={null} label="Pipe Volume" />}
    </div>
  );
}

// ── Generic Material Calculators (Sand, Gravel, Cement, Asphalt) ─────
export function MaterialForm({ type = "sand" }) {
  const { fm, sym } = useCurrency();
  const [length, setLength] = useState("20");
  const [width, setWidth] = useState("10");
  const [depth, setDepth] = useState("4");
  const [unit, setUnit] = useState("imperial");
  const [pricePerTon, setPricePerTon] = useState("30");
  const [res, setRes] = useState(null);

  const densities = { sand: 1.7, gravel: 1.4, cement: 1.5, asphalt: 2.4 };
  const density = densities[type] || 1.5;

  useEffect(() => {
    const l = +length, w = +width, d_in = +depth;
    if (!l || !w || !d_in) { setRes(null); return; }
    const volCubicFt = unit === "imperial" ? l * w * (d_in / 12) : l * w * d_in * 35.3147;
    const volCubicYd = volCubicFt / 27;
    const tons = (volCubicYd * density).toFixed(2);
    const cost = +tons * (+pricePerTon || 0);
    setRes(buildResult("Volume Needed", volCubicYd.toFixed(2) + " cu yd",
      [
        { label: "Cubic Feet", value: volCubicFt.toFixed(2) + " cu ft" },
        { label: "Cubic Yards", value: volCubicYd.toFixed(2) + " cu yd", highlight: true },
        { label: "Tons (approx.)", value: tons + " tons" },
        { label: "Estimated Cost", value: fm(Math.round(cost)) },
      ],
      [{ type: "tip", msg: `Order ${(+tons * 1.1).toFixed(1)} tons (+10% waste factor) for your ${type} project.` }],
      null, []));
  }, [length, width, depth, unit, pricePerTon, type]);

  const labels = { sand: "Sand", gravel: "Gravel", cement: "Cement/Concrete", asphalt: "Asphalt" };

  return (
    <div>
      <div style={{background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:16, padding:'24px 28px 20px', marginBottom:20}}>
        <p style={{fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'.09em', color:'var(--text3)', margin:'0 0 18px'}}>
          🧱 Your Inputs
        </p>
        <Tabs tabs={["Imperial (ft/in)", "Metric (m)"]} active={unit === "imperial" ? "Imperial (ft/in)" : "Metric (m)"} onChange={v => setUnit(v.includes("Imperial") ? "imperial" : "metric")} />
        <Row3>
          <N label={`Length (${unit === "imperial" ? "ft" : "m"})`} id={`mat_l`} value={length} onChange={setLength} unit={unit === "imperial" ? "ft" : "m"} />
          <N label={`Width (${unit === "imperial" ? "ft" : "m"})`} id={`mat_w`} value={width} onChange={setWidth} unit={unit === "imperial" ? "ft" : "m"} />
          <N label={`Depth (${unit === "imperial" ? "in" : "m"})`} id={`mat_d`} value={depth} onChange={setDepth} unit={unit === "imperial" ? "in" : "m"} />
        </Row3>
        <N label={`Price per Ton (${sym})`} id={`mat_p`} value={pricePerTon} onChange={setPricePerTon} unit={sym} placeholder="0" hint="Optional: for cost estimate" />
      </div>
      {res && <Panel result={res} loading={null} label={labels[type]} />}
    </div>
  );
}

// ── Cubic Yard Calculator ─────────────────────────────────────────────
export function CubicYardForm() {
  const [l, setL] = useState("10");
  const [w, setW] = useState("8");
  const [d, setD] = useState("3");
  const [unit, setUnit] = useState("feet");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const length = +l, width = +w, depth = +d;
    let volCubicYd;
    if (unit === "feet") volCubicYd = (length * width * depth) / 27;
    else if (unit === "inches") volCubicYd = (length * width * depth) / 46656;
    else volCubicYd = length * width * depth * 1.30795; // meters
    setRes(buildResult("Cubic Yards", volCubicYd.toFixed(3) + " cu yd",
      [
        { label: "Cubic Yards", value: volCubicYd.toFixed(3) + " cu yd", highlight: true },
        { label: "Cubic Feet", value: (volCubicYd * 27).toFixed(2) + " cu ft" },
        { label: "Cubic Meters", value: (volCubicYd / 1.30795).toFixed(3) + " m³" },
        { label: "Cubic Inches", value: Math.round(volCubicYd * 46656).toLocaleString() + " cu in" },
      ],
      [], null, []));
  }, [l, w, d, unit]);

  return (
    <div>
      <div style={{background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:16, padding:'24px 28px 20px', marginBottom:20}}>
        <p style={{fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'.09em', color:'var(--text3)', margin:'0 0 18px'}}>
          📦 Your Inputs
        </p>
        <Sel label="Input Units" id="cyu" value={unit} onChange={setUnit} opts={[{ v: "feet", l: "Feet" }, { v: "inches", l: "Inches" }, { v: "meters", l: "Meters" }]} />
        <Row3>
          <N label="Length" id="cyl" value={l} onChange={setL} unit={unit[0]} />
          <N label="Width" id="cyw" value={w} onChange={setW} unit={unit[0]} />
          <N label="Depth" id="cyd" value={d} onChange={setD} unit={unit[0]} />
        </Row3>
      </div>
      {res && <Panel result={res} loading={null} label="Cubic Yard" />}
    </div>
  );
}

// ── Roofing Calculator ─────────────────────────────────────────────────
export function RoofingForm() {
  const { fm, sym } = useCurrency();
  const [length, setLength] = useState("40");
  const [width, setWidth] = useState("25");
  const [pitch, setPitch] = useState("6");
  const [waste, setWaste] = useState("10");
  const [pricePerBundle, setPricePerBundle] = useState("35");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const l = +length, w = +width, p = +pitch;
    const flatArea = l * w;
    const pitchFactor = Math.sqrt(1 + (p / 12) ** 2);
    const roofArea = flatArea * pitchFactor;
    const withWaste = roofArea * (1 + +waste / 100);
    const squares = withWaste / 100; // 1 square = 100 sq ft
    const bundles = Math.ceil(squares * 3); // ~3 bundles per square
    const cost = bundles * (+pricePerBundle || 0);
    setRes(buildResult("Roofing Area", roofArea.toFixed(0) + " sq ft",
      [
        { label: "Flat Footprint", value: flatArea + " sq ft" },
        { label: "Actual Roof Area", value: roofArea.toFixed(0) + " sq ft", highlight: true },
        { label: "Squares Needed", value: squares.toFixed(1) + " squares" },
        { label: "Bundles Needed", value: bundles + " bundles" },
        { label: "Estimated Cost", value: fm(Math.round(cost)) },
      ],
      [{ type: "tip", msg: `A ${pitch}:12 pitch factor of ${pitchFactor.toFixed(3)} means your actual roof area is ${((pitchFactor - 1) * 100).toFixed(1)}% larger than the footprint.` }],
      null, []));
  }, [length, width, pitch, waste, pricePerBundle]);

  return (
    <div style={{display:'flex', flexDirection:'column', gap:20}}>
      <div style={{background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:16, padding:'22px 24px 20px'}}>
        <p style={{fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'.09em', color:'var(--text3)', margin:'0 0 18px'}}>
          🏠 Your Inputs
        </p>
        <Row2>
          <N label="Length (ft)" id="rfl" value={length} onChange={setLength} unit="ft" />
          <N label="Width (ft)" id="rfw" value={width} onChange={setWidth} unit="ft" />
        </Row2>
        <Sl label="Roof Pitch (x:12)" id="rfp" min={0} max={24} step={1} value={+pitch} onChange={v => setPitch(String(v))} fmt={v => `${v}:12`} />
        <Row3>
          <N label="Waste (%)" id="rfwaste" value={waste} onChange={setWaste} unit="%" />
          <N label="Price/Bundle" id="rfprice" value={pricePerBundle} onChange={setPricePerBundle} unit={sym} />
        </Row3>
      </div>
      <Panel result={res} loading={null} label="Roofing" />
    </div>
  );
}
