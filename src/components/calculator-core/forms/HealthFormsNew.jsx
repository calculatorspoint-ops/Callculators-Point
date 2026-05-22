import { useState, useEffect } from "react";
import { L, N, Sl, Sel, Tabs, Row2, Row3, Panel, buildResult, useCurrency } from "./SharedComponents.jsx";

// ── Body Surface Area (BSA) ───────────────────────────────────────────
export function BSAForm() {
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");
  const [unit, setUnit] = useState("metric");
  const [res, setRes] = useState(null);

  useEffect(() => {
    let w = +weight, h = +height;
    if (unit === "imperial") { w = w * 0.453592; h = h * 2.54; }
    if (!w || !h) { setRes(null); return; }
    const mosteller = Math.sqrt((h * w) / 3600);
    const dubois = 0.007184 * Math.pow(h, 0.725) * Math.pow(w, 0.425);
    const haycock = 0.024265 * Math.pow(h, 0.3964) * Math.pow(w, 0.5378);
    setRes(buildResult("BSA (Mosteller)", mosteller.toFixed(3) + " m²",
      [
        { label: "Mosteller Formula", value: mosteller.toFixed(3) + " m²", highlight: true },
        { label: "DuBois & DuBois", value: dubois.toFixed(3) + " m²" },
        { label: "Haycock Formula", value: haycock.toFixed(3) + " m²" },
        { label: "Average", value: ((mosteller + dubois + haycock) / 3).toFixed(3) + " m²" },
      ],
      [{ type: "tip", msg: `BSA of ${mosteller.toFixed(2)} m² — used in chemotherapy dosing, burn assessment, and kidney function evaluation.` }],
      null, []));
  }, [weight, height, unit]);

  return (
    <div>
      <Tabs tabs={["Metric (kg/cm)", "Imperial (lb/in)"]} active={unit === "metric" ? "Metric (kg/cm)" : "Imperial (lb/in)"} onChange={v => setUnit(v.includes("Metric") ? "metric" : "imperial")} />
      <Row2>
        <N label={unit === "metric" ? "Weight (kg)" : "Weight (lb)"} id="bsaw" value={weight} onChange={setWeight} unit={unit === "metric" ? "kg" : "lb"} />
        <N label={unit === "metric" ? "Height (cm)" : "Height (in)"} id="bsah" value={height} onChange={setHeight} unit={unit === "metric" ? "cm" : "in"} />
      </Row2>
      {res && <Panel result={res} loading={null} label="BSA" />}
    </div>
  );
}

// ── BAC Calculator ─────────────────────────────────────────────────────
export function BACForm() {
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState("70");
  const [drinks, setDrinks] = useState("3");
  const [abv, setAbv] = useState("5");
  const [oz, setOz] = useState("12");
  const [hours, setHours] = useState("2");
  const [unit, setUnit] = useState("metric");
  const [res, setRes] = useState(null);

  useEffect(() => {
    let w = +weight;
    if (unit === "imperial") w = w * 0.453592;
    const r = gender === "male" ? 0.68 : 0.55;
    const totalOz = +drinks * +oz;
    const alcoholGrams = totalOz * 29.5735 * (+abv / 100) * 0.789;
    const bac = Math.max(0, (alcoholGrams / (w * 1000 * r)) * 100 - (0.015 * +hours));
    const clearTime = bac / 0.015;
    const legal = 0.08;
    setRes(buildResult("Blood Alcohol Content", bac.toFixed(3) + "%",
      [
        { label: "BAC Level", value: bac.toFixed(3) + "%", highlight: bac < legal, warn: bac >= legal },
        { label: "Legal Limit", value: legal + "% (US)" },
        { label: "Time to Sober", value: clearTime.toFixed(1) + " hours" },
        { label: "Status", value: bac === 0 ? "✅ Sober" : bac < 0.04 ? "😊 Mild" : bac < legal ? "⚠️ Impaired" : "🚫 Over Limit" },
      ],
      [{ type: bac >= legal ? "warn" : "tip", msg: bac >= legal ? `⚠️ BAC of ${bac.toFixed(3)}% is OVER the legal limit of ${legal}%. Do NOT drive!` : `BAC of ${bac.toFixed(3)}% — you need approximately ${clearTime.toFixed(1)} hours to sober up completely.` }],
      null, []));
  }, [gender, weight, drinks, abv, oz, hours, unit]);

  return (
    <div>
      <Tabs tabs={["Male", "Female"]} active={gender === "male" ? "Male" : "Female"} onChange={v => setGender(v.toLowerCase())} />
      <Tabs tabs={["Metric (kg)", "Imperial (lb)"]} active={unit === "metric" ? "Metric (kg)" : "Imperial (lb)"} onChange={v => setUnit(v.includes("Metric") ? "metric" : "imperial")} />
      <N label={unit === "metric" ? "Body Weight (kg)" : "Body Weight (lb)"} id="bacw" value={weight} onChange={setWeight} unit={unit === "metric" ? "kg" : "lb"} />
      <Row3>
        <N label="Number of Drinks" id="bacd" value={drinks} onChange={setDrinks} unit="drinks" />
        <N label="Drink Size (oz)" id="bacsz" value={oz} onChange={setOz} unit="oz" />
        <N label="ABV (%)" id="bacabv" value={abv} onChange={setAbv} unit="%" hint="Beer ~5%, Wine ~12%" />
      </Row3>
      <N label="Hours Since Drinking Started" id="bach" value={hours} onChange={setHours} unit="hrs" />
      {res && <Panel result={res} loading={null} label="BAC" />}
    </div>
  );
}

// ── Lean Body Mass Calculator ─────────────────────────────────────────
export function LeanBodyMassForm() {
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");
  const [bodyFat, setBodyFat] = useState("20");
  const [gender, setGender] = useState("male");
  const [unit, setUnit] = useState("metric");
  const [res, setRes] = useState(null);

  useEffect(() => {
    let w = +weight, h = +height;
    if (unit === "imperial") { w = w * 0.453592; h = h * 2.54; }
    const bf = +bodyFat / 100;
    const lbm = w * (1 - bf);
    // Boer formula
    const boer = gender === "male" ? 0.407 * w + 0.267 * h - 19.2 : 0.252 * w + 0.473 * h - 48.3;
    // James formula
    const james = gender === "male" ? 1.1 * w - 128 * (w / h) ** 2 : 1.07 * w - 148 * (w / h) ** 2;
    setRes(buildResult("Lean Body Mass", lbm.toFixed(1) + " kg",
      [
        { label: "LBM (from Body Fat %)", value: lbm.toFixed(1) + " kg", highlight: true },
        { label: "LBM (Boer Formula)", value: boer.toFixed(1) + " kg" },
        { label: "LBM (James Formula)", value: james.toFixed(1) + " kg" },
        { label: "Fat Mass", value: (w - lbm).toFixed(1) + " kg", warn: true },
      ],
      [{ type: "tip", msg: `LBM of ${lbm.toFixed(1)} kg — this includes muscle, bone, organs, and water. A higher LBM generally indicates better fitness.` }],
      null, []));
  }, [weight, height, bodyFat, gender, unit]);

  return (
    <div>
      <Tabs tabs={["Male", "Female"]} active={gender === "male" ? "Male" : "Female"} onChange={v => setGender(v.toLowerCase())} />
      <Tabs tabs={["Metric", "Imperial"]} active={unit === "metric" ? "Metric" : "Imperial"} onChange={v => setUnit(v.toLowerCase())} />
      <Row2>
        <N label={unit === "metric" ? "Weight (kg)" : "Weight (lb)"} id="lbmw" value={weight} onChange={setWeight} unit={unit === "metric" ? "kg" : "lb"} />
        <N label={unit === "metric" ? "Height (cm)" : "Height (in)"} id="lbmh" value={height} onChange={setHeight} unit={unit === "metric" ? "cm" : "in"} />
      </Row2>
      <N label="Body Fat %" id="lbmbf" value={bodyFat} onChange={setBodyFat} unit="%" hint="If unknown, use the Body Fat calculator first" />
      {res && <Panel result={res} loading={null} label="Lean Body Mass" />}
    </div>
  );
}

// ── Protein Calculator ─────────────────────────────────────────────────
export function ProteinForm() {
  const [weight, setWeight] = useState("70");
  const [unit, setUnit] = useState("metric");
  const [activity, setActivity] = useState("moderate");
  const [goal, setGoal] = useState("maintain");
  const [res, setRes] = useState(null);

  useEffect(() => {
    let w = +weight;
    if (unit === "imperial") w = w * 0.453592;
    const activityMultipliers = { sedentary: 0.8, light: 1.2, moderate: 1.6, heavy: 2.0, athlete: 2.2 };
    const goalMultipliers = { lose: 0.9, maintain: 1.0, muscle: 1.1, bulk: 1.2 };
    const base = w * activityMultipliers[activity] * goalMultipliers[goal];
    const lowEnd = w * 1.2, highEnd = w * 2.2;
    setRes(buildResult("Daily Protein", Math.round(base) + "g",
      [
        { label: "Recommended", value: Math.round(base) + "g/day", highlight: true },
        { label: "Range", value: `${Math.round(lowEnd)}g – ${Math.round(highEnd)}g/day` },
        { label: "Per Meal (4 meals)", value: Math.round(base / 4) + "g/meal" },
        { label: "Per kg bodyweight", value: (base / w).toFixed(1) + "g/kg" },
      ],
      [{ type: "tip", msg: `For ${goal === "muscle" ? "muscle building" : goal === "lose" ? "fat loss" : "maintenance"}, aim for ${Math.round(base)}g of protein daily. Good sources: chicken (31g/100g), eggs (13g each), Greek yogurt (10g/100g).` }],
      null, []));
  }, [weight, unit, activity, goal]);

  return (
    <div>
      <Tabs tabs={["Metric (kg)", "Imperial (lb)"]} active={unit === "metric" ? "Metric (kg)" : "Imperial (lb)"} onChange={v => setUnit(v.includes("Metric") ? "metric" : "imperial")} />
      <N label={unit === "metric" ? "Body Weight (kg)" : "Body Weight (lb)"} id="protw" value={weight} onChange={setWeight} unit={unit === "metric" ? "kg" : "lb"} />
      <Sel label="Activity Level" id="prota" value={activity} onChange={setActivity} opts={[
        { v: "sedentary", l: "Sedentary (desk job, no exercise)" },
        { v: "light", l: "Light (1-2 days/week exercise)" },
        { v: "moderate", l: "Moderate (3-5 days/week)" },
        { v: "heavy", l: "Heavy (6-7 days/week intense)" },
        { v: "athlete", l: "Athlete (twice/day training)" },
      ]} />
      <Sel label="Fitness Goal" id="protg" value={goal} onChange={setGoal} opts={[
        { v: "lose", l: "Weight Loss / Fat Loss" },
        { v: "maintain", l: "Maintain Weight" },
        { v: "muscle", l: "Build Muscle" },
        { v: "bulk", l: "Aggressive Bulk" },
      ]} />
      {res && <Panel result={res} loading={null} label="Protein Calculator" />}
    </div>
  );
}

// ── Healthy Weight Range Calculator ───────────────────────────────────
export function HealthyWeightForm() {
  const [height, setHeight] = useState("175");
  const [unit, setUnit] = useState("metric");
  const [res, setRes] = useState(null);

  useEffect(() => {
    let h = +height;
    if (unit === "imperial") h = h * 2.54;
    if (!h) { setRes(null); return; }
    const hM = h / 100;
    const minWeight = 18.5 * hM * hM;
    const maxWeight = 24.9 * hM * hM;
    const idealMale = 50 + 0.9 * (h - 152.4);    // Devine
    const idealFemale = 45.5 + 0.9 * (h - 152.4); // Devine
    setRes(buildResult("Healthy Weight Range",
      `${minWeight.toFixed(1)} – ${maxWeight.toFixed(1)} kg`,
      [
        { label: "Min (BMI 18.5)", value: minWeight.toFixed(1) + " kg" },
        { label: "Max (BMI 24.9)", value: maxWeight.toFixed(1) + " kg" },
        { label: "Ideal (Male)", value: idealMale.toFixed(1) + " kg" },
        { label: "Ideal (Female)", value: idealFemale.toFixed(1) + " kg" },
      ],
      [{ type: "tip", msg: `For ${h}cm height, a healthy BMI of 18.5–24.9 corresponds to ${minWeight.toFixed(1)}–${maxWeight.toFixed(1)} kg.` }],
      null, []));
  }, [height, unit]);

  return (
    <div>
      <Tabs tabs={["Metric (cm)", "Imperial (ft/in)"]} active={unit === "metric" ? "Metric (cm)" : "Imperial (ft/in)"} onChange={v => setUnit(v.includes("Metric") ? "metric" : "imperial")} />
      <N label={unit === "metric" ? "Height (cm)" : "Height (inches)"} id="hwh" value={height} onChange={setHeight} unit={unit === "metric" ? "cm" : "in"} />
      {res && <Panel result={res} loading={null} label="Healthy Weight" />}
    </div>
  );
}

// ── Fat Intake Calculator ─────────────────────────────────────────────
export function FatIntakeForm() {
  const [calories, setCalories] = useState("2000");
  const [goal, setGoal] = useState("balanced");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const cal = +calories;
    const pcts = { low: 0.20, balanced: 0.30, high: 0.40, keto: 0.65 };
    const pct = pcts[goal] || 0.30;
    const fatCals = cal * pct;
    const fatGrams = fatCals / 9;
    const satFat = fatGrams * 0.3;
    const unsat = fatGrams * 0.7;
    setRes(buildResult("Daily Fat Intake", Math.round(fatGrams) + "g",
      [
        { label: "Total Fat", value: Math.round(fatGrams) + "g (" + (pct * 100).toFixed(0) + "% calories)", highlight: true },
        { label: "Saturated Fat (max)", value: Math.round(satFat) + "g (≤" + Math.round(satFat * 9) + " cal)" },
        { label: "Unsaturated Fat", value: Math.round(unsat) + "g" },
        { label: "Fat Calories", value: Math.round(fatCals) + " kcal" },
      ],
      [{ type: "tip", msg: `${goal === "keto" ? "Ketogenic diet: 65% fat for ketosis. Keep carbs under 5%." : `For ${goal} diet: ${(pct * 100).toFixed(0)}% of calories from fat (${Math.round(fatGrams)}g). Prioritize healthy fats: avocado, olive oil, nuts, salmon.`}` }],
      null, []));
  }, [calories, goal]);

  return (
    <div>
      <N label="Daily Calorie Intake" id="fical" value={calories} onChange={setCalories} unit="kcal" />
      <Sel label="Diet Goal" id="figoal" value={goal} onChange={setGoal} opts={[
        { v: "low", l: "Low Fat Diet (20%)" },
        { v: "balanced", l: "Balanced Diet (30%)" },
        { v: "high", l: "High Fat / Paleo (40%)" },
        { v: "keto", l: "Ketogenic Diet (65%)" },
      ]} />
      {res && <Panel result={res} loading={null} label="Fat Intake" />}
    </div>
  );
}

// ── Army Body Fat Calculator ──────────────────────────────────────────
export function ArmyBodyFatForm() {
  const [gender, setGender] = useState("male");
  const [height, setHeight] = useState("70");
  const [neck, setNeck] = useState("15");
  const [waist, setWaist] = useState("33");
  const [hip, setHip] = useState("38");
  const [age, setAge] = useState("25");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const h = +height, n = +neck, w = +waist, p = +hip, a = +age;
    if (!h || !n || !w) { setRes(null); return; }
    let bf;
    if (gender === "male") {
      bf = 86.010 * Math.log10(w - n) - 70.041 * Math.log10(h) + 36.76;
    } else {
      if (!p) { setRes(null); return; }
      bf = 163.205 * Math.log10(w + p - n) - 97.684 * Math.log10(h) - 78.387;
    }
    bf = Math.max(0, Math.round(bf * 10) / 10);
    // Army standards
    const standards = {
      male: [{ age: 20, limit: 20 }, { age: 28, limit: 22 }, { age: 40, limit: 24 }, { age: 999, limit: 26 }],
      female: [{ age: 20, limit: 30 }, { age: 28, limit: 32 }, { age: 40, limit: 34 }, { age: 999, limit: 36 }],
    };
    const limit = standards[gender].find(s => a < s.age)?.limit || 26;
    const passes = bf <= limit;
    setRes(buildResult("Body Fat %", bf + "%",
      [
        { label: "Body Fat %", value: bf + "%", highlight: passes, warn: !passes },
        { label: "Army Standard (Age " + a + ")", value: "≤ " + limit + "%", highlight: true },
        { label: "Status", value: passes ? "✅ PASS" : "❌ FAIL" },
        { label: "Difference", value: (bf - limit).toFixed(1) + "% " + (passes ? "below limit" : "over limit") },
      ],
      [{ type: passes ? "tip" : "warn", msg: passes ? `Body fat of ${bf}% meets Army standards for your age group (limit: ${limit}%).` : `Body fat of ${bf}% exceeds Army standards by ${(bf - limit).toFixed(1)}%. Focus on cardiovascular training and calorie control.` }],
      null, []));
  }, [gender, height, neck, waist, hip, age]);

  return (
    <div>
      <Tabs tabs={["Male", "Female"]} active={gender === "male" ? "Male" : "Female"} onChange={v => setGender(v.toLowerCase())} />
      <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 14 }}>All measurements in inches. Measure at narrowest point for neck and waist.</p>
      <Row2>
        <N label="Height (in)" id="abfh" value={height} onChange={setHeight} unit="in" />
        <N label="Age" id="abfage" value={age} onChange={setAge} unit="yrs" />
      </Row2>
      <Row2>
        <N label="Neck Circumference (in)" id="abfn" value={neck} onChange={setNeck} unit="in" />
        <N label="Waist Circumference (in)" id="abfw" value={waist} onChange={setWaist} unit="in" />
      </Row2>
      {gender === "female" && <N label="Hip Circumference (in)" id="abfhip" value={hip} onChange={setHip} unit="in" />}
      {res && <Panel result={res} loading={null} label="Army Body Fat" />}
    </div>
  );
}

// Default export — this file exports named components
export default { BSAForm, BACForm, LeanBodyMassForm, ProteinForm, HealthyWeightForm, FatIntakeForm, ArmyBodyFatForm };
