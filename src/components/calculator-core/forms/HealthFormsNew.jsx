import { useState, useEffect } from "react";
import { L, N, Sl, Sel, Tabs, Row2, Row3, Presets, Panel, buildResult, useCurrency } from "./SharedComponents.jsx";

// ─────────────────────────────────────────────────────────────────────────────
// 1. BSA FORM — Body Surface Area
// ─────────────────────────────────────────────────────────────────────────────
export function BSAForm() {
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");
  const [unit, setUnit] = useState("metric");
  const [auc, setAuc] = useState("5");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      let w = parseFloat(weight), h = parseFloat(height);
      if (!w || !h) { setRes(null); return; }
      if (unit === "imperial") { w = w * 0.453592; h = h * 2.54; }

      const mosteller = Math.sqrt((h * w) / 3600);
      const dubois    = 0.007184 * Math.pow(h, 0.725) * Math.pow(w, 0.425);
      const haycock   = 0.024265 * Math.pow(h, 0.3964) * Math.pow(w, 0.5378);
      const avg       = (mosteller + dubois + haycock) / 3;
      const carboDose = mosteller * parseFloat(auc || 5);

      // BSA vs weight curve data (for chart)
      const bsaCurve = [];
      for (let wt = 40; wt <= 120; wt += 10) {
        bsaCurve.push({
          name: wt + "kg",
          Mosteller: parseFloat(Math.sqrt((h * wt) / 3600).toFixed(3)),
          DuBois:    parseFloat((0.007184 * Math.pow(h, 0.725) * Math.pow(wt, 0.425)).toFixed(3)),
          Haycock:   parseFloat((0.024265 * Math.pow(h, 0.3964) * Math.pow(wt, 0.5378)).toFixed(3)),
        });
      }

      const insights = [];
      if (mosteller < 1.5) insights.push({ type: "info", msg: "BSA below 1.5 m² is typical for children or small adults. Pediatric dosing may require further adjustment." });
      else if (mosteller > 2.2) insights.push({ type: "warn", msg: "BSA above 2.2 m² — some oncology protocols cap doses to avoid toxicity. Confirm with physician." });
      else insights.push({ type: "tip", msg: `BSA of ${mosteller.toFixed(3)} m² is within typical adult range. Used in chemotherapy, burn assessment, and kidney function (eGFR).` });

      insights.push({ type: "info", msg: `Carboplatin dose (AUC ${auc}) = BSA × AUC = ${mosteller.toFixed(3)} × ${auc} = ${carboDose.toFixed(1)} mg.` });

      setRes(buildResult(
        "BSA (Mosteller)",
        mosteller.toFixed(3) + " m²",
        [
          { label: "Mosteller (recommended)", value: mosteller.toFixed(3) + " m²", highlight: true },
          { label: "DuBois & DuBois",         value: dubois.toFixed(3) + " m²" },
          { label: "Haycock Formula",          value: haycock.toFixed(3) + " m²" },
          { label: "Average (3 formulas)",     value: avg.toFixed(3) + " m²" },
        ],
        insights,
        { type: "line", data: bsaCurve, keys: ["Mosteller", "DuBois", "Haycock"] },
        [
          { label: "Formula — Mosteller",   value: "√(H×W / 3600)" },
          { label: "Formula — DuBois",      value: "0.007184 × H^0.725 × W^0.425" },
          { label: "Formula — Haycock",     value: "0.024265 × H^0.3964 × W^0.5378" },
          { label: "Your Weight (metric)",  value: w.toFixed(1) + " kg" },
          { label: "Your Height (metric)",  value: h.toFixed(1) + " cm" },
          { label: "Carboplatin Dose",      value: `BSA × AUC ${auc} = ${carboDose.toFixed(1)} mg` },
          { label: "Cisplatin Reference",   value: `${(mosteller * 75).toFixed(0)} mg (75 mg/m²)` },
          { label: "Doxorubicin Reference", value: `${(mosteller * 60).toFixed(0)} mg (60 mg/m²)` },
        ]
      ));
    }, 150);
    return () => clearTimeout(timer);
  }, [weight, height, unit, auc]);

  const presets = [
    { label: "Child 30 kg / 130 cm",      v: { weight: "30",  height: "130", unit: "metric" } },
    { label: "Adult Woman 65 kg / 165 cm", v: { weight: "65",  height: "165", unit: "metric" } },
    { label: "Adult Man 80 kg / 180 cm",   v: { weight: "80",  height: "180", unit: "metric" } },
  ];

  return (
    <div>
      <Presets items={presets} onApply={p => { setWeight(p.v.weight); setHeight(p.v.height); setUnit(p.v.unit); }} />
      <Tabs
        tabs={["Metric (kg/cm)", "Imperial (lb/in)"]}
        active={unit === "metric" ? "Metric (kg/cm)" : "Imperial (lb/in)"}
        onChange={v => setUnit(v.includes("Metric") ? "metric" : "imperial")}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — Inputs */}
        <div>
          <Row2>
            <N label={unit === "metric" ? "Weight (kg)" : "Weight (lb)"} id="bsaw" value={weight} onChange={setWeight} unit={unit === "metric" ? "kg" : "lb"} />
            <N label={unit === "metric" ? "Height (cm)" : "Height (in)"} id="bsah" value={height} onChange={setHeight} unit={unit === "metric" ? "cm" : "in"} />
          </Row2>
          <N label="Carboplatin AUC Target" id="bsaauc" value={auc} onChange={setAuc} unit="AUC" hint="Typical range: 4–6. Used to compute Carboplatin dose = BSA × AUC" />
        </div>
        {/* Right — Result */}
        <div className="sticky-res">
          <Panel result={res} loading={null} label="BSA" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. BAC FORM — Blood Alcohol Content
// ─────────────────────────────────────────────────────────────────────────────
export function BACForm() {
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState("70");
  const [unit, setUnit] = useState("metric");
  const [drinkType, setDrinkType] = useState("beer");
  const [drinks, setDrinks] = useState("3");
  const [hours, setHours] = useState("2");
  const [res, setRes] = useState(null);

  const drinkProfiles = {
    beer:  { label: "Beer (5% ABV, 12 oz)",  abv: 5,  oz: 12 },
    wine:  { label: "Wine (12% ABV, 5 oz)",  abv: 12, oz: 5  },
    shot:  { label: "Shot (40% ABV, 1.5 oz)", abv: 40, oz: 1.5 },
    mixed: { label: "Mixed Drink (10% ABV, 8 oz)", abv: 10, oz: 8 },
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      let w = parseFloat(weight);
      if (!w) { setRes(null); return; }
      if (unit === "imperial") w = w * 0.453592;

      const profile = drinkProfiles[drinkType];
      const r = gender === "male" ? 0.68 : 0.55;
      const alcoholGrams = parseFloat(drinks) * profile.oz * 29.5735 * (profile.abv / 100) * 0.789;
      const peakBac = (alcoholGrams / (w * 1000 * r)) * 100;
      const currentBac = Math.max(0, peakBac - 0.015 * parseFloat(hours));
      const clearTime = currentBac / 0.015;

      // BAC over time chart
      const bacTimeline = [];
      const absorptionHours = 1;
      for (let t = 0; t <= Math.max(10, Math.ceil(peakBac / 0.015) + 2); t++) {
        let bac;
        if (t <= absorptionHours) {
          bac = peakBac * (t / absorptionHours);
        } else {
          bac = Math.max(0, peakBac - 0.015 * (t - absorptionHours));
        }
        bacTimeline.push({
          name: t + "h",
          BAC: parseFloat(bac.toFixed(4)),
          "US Limit (0.08)": 0.08,
          "EU Limit (0.05)": 0.05,
        });
      }

      let status, color, statusMsg;
      if (currentBac === 0) { status = "✅ Sober";       color = "green"; }
      else if (currentBac < 0.05) { status = "😊 Minimal";    color = "green"; }
      else if (currentBac < 0.08) { status = "⚠️ Impaired";   color = "yellow"; }
      else                         { status = "🚫 Over Limit"; color = "red"; }

      const insights = [];
      if (currentBac >= 0.08) insights.push({ type: "warn", msg: `⚠️ BAC of ${currentBac.toFixed(3)}% is OVER the legal limit of 0.08% (US/UK). Do NOT drive. Allow ${clearTime.toFixed(1)} hours to sober up.` });
      else if (currentBac >= 0.05) insights.push({ type: "warn", msg: `BAC of ${currentBac.toFixed(3)}% exceeds 0.05% (EU legal limit). Driving not recommended. Wait ${clearTime.toFixed(1)} hours.` });
      else if (currentBac > 0) insights.push({ type: "info", msg: `BAC of ${currentBac.toFixed(3)}% — mild effects possible. Approximately ${clearTime.toFixed(1)} hours until fully sober.` });
      else insights.push({ type: "tip", msg: "BAC is at 0% — you are sober based on these inputs." });

      setRes(buildResult(
        "Blood Alcohol Content",
        currentBac.toFixed(3) + "%",
        [
          { label: "Current BAC",         value: currentBac.toFixed(3) + "%", highlight: currentBac < 0.05, warn: currentBac >= 0.08 },
          { label: "Peak BAC",            value: peakBac.toFixed(3) + "%"  },
          { label: "Status",              value: status                      },
          { label: "Time to Sober",       value: currentBac > 0 ? clearTime.toFixed(1) + " hrs" : "Already sober" },
        ],
        insights,
        { type: "line", data: bacTimeline, keys: ["BAC", "US Limit (0.08)", "EU Limit (0.05)"] },
        [
          { label: "Drink Type",          value: profile.label },
          { label: "Number of Drinks",    value: drinks },
          { label: "Alcohol (grams)",     value: alcoholGrams.toFixed(1) + " g" },
          { label: "Body Water Ratio (r)",value: r + (gender === "male" ? " (male)" : " (female)") },
          { label: "US Legal Limit",      value: "0.080%" },
          { label: "UK Legal Limit",      value: "0.080%" },
          { label: "EU Legal Limit",      value: "0.050%" },
          { label: "Liver Clearance",     value: "~0.015% per hour" },
          { label: "Formula",             value: "(AlcGrams / (BodyWater × r)) × 100 − (0.015 × hours)" },
        ]
      ));
    }, 150);
    return () => clearTimeout(timer);
  }, [gender, weight, unit, drinkType, drinks, hours]);

  const presets = [
    { label: "2 Beers, 1 hour",   v: { drinkType: "beer",  drinks: "2", hours: "1", weight: "70", gender: "male"   } },
    { label: "3 Wines, 2 hours",  v: { drinkType: "wine",  drinks: "3", hours: "2", weight: "60", gender: "female" } },
    { label: "4 Shots, 3 hours",  v: { drinkType: "shot",  drinks: "4", hours: "3", weight: "80", gender: "male"   } },
  ];

  return (
    <div>
      <Presets items={presets} onApply={p => {
        setDrinkType(p.v.drinkType); setDrinks(p.v.drinks); setHours(p.v.hours);
        setWeight(p.v.weight); setGender(p.v.gender);
      }} />
      <Tabs tabs={["Male", "Female"]} active={gender === "male" ? "Male" : "Female"} onChange={v => setGender(v.toLowerCase())} />
      <Tabs tabs={["Metric (kg)", "Imperial (lb)"]} active={unit === "metric" ? "Metric (kg)" : "Imperial (lb)"} onChange={v => setUnit(v.includes("Metric") ? "metric" : "imperial")} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <N label={unit === "metric" ? "Body Weight (kg)" : "Body Weight (lb)"} id="bacw" value={weight} onChange={setWeight} unit={unit === "metric" ? "kg" : "lb"} />
          <Sel label="Drink Type" id="bacdt" value={drinkType} onChange={setDrinkType} opts={[
            { v: "beer",  l: "🍺 Beer (5% ABV, 12 oz)" },
            { v: "wine",  l: "🍷 Wine (12% ABV, 5 oz)"  },
            { v: "shot",  l: "🥃 Shot (40% ABV, 1.5 oz)" },
            { v: "mixed", l: "🍹 Mixed Drink (10% ABV, 8 oz)" },
          ]} />
          <Row2>
            <N label="Number of Drinks" id="bacd"  value={drinks} onChange={setDrinks} unit="drinks" />
            <N label="Hours Since Drinking" id="bach" value={hours}  onChange={setHours}  unit="hrs"    hint="Time elapsed since first drink" />
          </Row2>
        </div>
        <div className="sticky-res">
          <Panel result={res} loading={null} label="BAC" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. LEAN BODY MASS FORM
// ─────────────────────────────────────────────────────────────────────────────
export function LeanBodyMassForm() {
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");
  const [bodyFat, setBodyFat] = useState(20);
  const [goalLBM, setGoalLBM] = useState("55");
  const [gender, setGender] = useState("male");
  const [unit, setUnit] = useState("metric");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      let w = parseFloat(weight), h = parseFloat(height);
      if (!w || !h) { setRes(null); return; }
      if (unit === "imperial") { w = w * 0.453592; h = h * 2.54; }

      const bf = bodyFat / 100;
      const lbmBF   = w * (1 - bf);
      const fatMass = w - lbmBF;

      // Boer formula
      const boer = gender === "male"
        ? 0.407 * w + 0.267 * h - 19.2
        : 0.252 * w + 0.473 * h - 48.3;

      // James formula
      const james = gender === "male"
        ? 1.1 * w - 128 * Math.pow(w / h, 2)
        : 1.07 * w - 148 * Math.pow(w / h, 2);

      // Hume formula
      const hume = gender === "male"
        ? 0.3281 * w + 0.3393 * h - 29.5336
        : 0.2296 * w + 0.4181 * h - 43.2933;

      const avgLBM = (lbmBF + boer + james + hume) / 4;
      const goalDiff = parseFloat(goalLBM) - lbmBF;

      // Donut chart data
      const donutData = [
        { name: "Lean Mass",  value: parseFloat(lbmBF.toFixed(1)),  fill: "#4ade80" },
        { name: "Fat Mass",   value: parseFloat(fatMass.toFixed(1)), fill: "#f87171" },
      ];

      const insights = [];
      if (bodyFat < 5)  insights.push({ type: "warn", msg: "Body fat below 5% can be dangerous — essential fat is needed for organ protection and hormonal function." });
      else if (bodyFat < 10) insights.push({ type: "info", msg: "Athletic/competition-level body fat. Sustainable short-term but monitor energy levels." });
      else if (bodyFat < 20 && gender === "male") insights.push({ type: "tip", msg: "Excellent fitness range for men (10–20%). Good muscle definition expected." });
      else if (bodyFat < 28 && gender === "female") insights.push({ type: "tip", msg: "Healthy athletic range for women (16–28%). Good cardiovascular and hormonal health." });
      else insights.push({ type: "warn", msg: `Body fat at ${bodyFat}% is above ideal fitness range. Reducing to 15–20% (men) or 22–28% (women) improves health markers.` });

      if (goalDiff > 0) insights.push({ type: "info", msg: `To reach your goal LBM of ${goalLBM} kg, you need to gain ${goalDiff.toFixed(1)} kg of lean mass. Focus on progressive resistance training and adequate protein intake.` });

      setRes(buildResult(
        "Lean Body Mass",
        lbmBF.toFixed(1) + " kg",
        [
          { label: "LBM (from BF%)",    value: lbmBF.toFixed(1)  + " kg", highlight: true },
          { label: "Fat Mass",          value: fatMass.toFixed(1) + " kg", warn: true },
          { label: "LBM (Boer)",        value: boer.toFixed(1)    + " kg" },
          { label: "LBM (James)",       value: james.toFixed(1)   + " kg" },
          { label: "LBM (Hume)",        value: hume.toFixed(1)    + " kg" },
          { label: "LBM (Average)",     value: avgLBM.toFixed(1)  + " kg" },
        ],
        insights,
        { type: "donut", data: donutData, keys: ["value"] },
        [
          { label: "Formula — Boer (Male)",   value: "0.407×W + 0.267×H − 19.2" },
          { label: "Formula — Boer (Female)", value: "0.252×W + 0.473×H − 48.3" },
          { label: "Formula — James (Male)",  value: "1.1×W − 128×(W/H)²" },
          { label: "Formula — Hume (Male)",   value: "0.3281×W + 0.3393×H − 29.5336" },
          { label: "Body Fat %",              value: bodyFat + "%" },
          { label: "Goal LBM",               value: goalLBM + " kg" },
          { label: "LBM to Gain",            value: goalDiff > 0 ? goalDiff.toFixed(1) + " kg" : "Goal already met ✅" },
        ]
      ));
    }, 150);
    return () => clearTimeout(timer);
  }, [weight, height, bodyFat, goalLBM, gender, unit]);

  const presets = [
    { label: "Lean Male Athlete",   v: { weight: "80",  height: "180", bodyFat: 12, gender: "male",   unit: "metric" } },
    { label: "Average Adult Male",  v: { weight: "85",  height: "175", bodyFat: 22, gender: "male",   unit: "metric" } },
    { label: "Fit Female",          v: { weight: "62",  height: "165", bodyFat: 20, gender: "female", unit: "metric" } },
  ];

  return (
    <div>
      <Presets items={presets} onApply={p => {
        setWeight(p.v.weight); setHeight(p.v.height); setBodyFat(p.v.bodyFat);
        setGender(p.v.gender); setUnit(p.v.unit);
      }} />
      <Tabs tabs={["Male", "Female"]} active={gender === "male" ? "Male" : "Female"} onChange={v => setGender(v.toLowerCase())} />
      <Tabs tabs={["Metric", "Imperial"]} active={unit === "metric" ? "Metric" : "Imperial"} onChange={v => setUnit(v.toLowerCase())} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Row2>
            <N label={unit === "metric" ? "Weight (kg)" : "Weight (lb)"} id="lbmw" value={weight} onChange={setWeight} unit={unit === "metric" ? "kg" : "lb"} />
            <N label={unit === "metric" ? "Height (cm)" : "Height (in)"} id="lbmh" value={height} onChange={setHeight} unit={unit === "metric" ? "cm" : "in"} />
          </Row2>
          <Sl label="Body Fat %" id="lbmbf" min={3} max={50} step={0.5} value={bodyFat} onChange={setBodyFat} fmt={v => v + "%"} />
          <N label="Goal LBM (kg)" id="lbmgoal" value={goalLBM} onChange={setGoalLBM} unit="kg" hint="Target lean body mass you want to achieve" />
        </div>
        <div className="sticky-res">
          <Panel result={res} loading={null} label="Lean Body Mass" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PROTEIN FORM
// ─────────────────────────────────────────────────────────────────────────────
export function ProteinForm() {
  const [weight, setWeight] = useState("70");
  const [unit, setUnit] = useState("metric");
  const [activity, setActivity] = useState("moderate");
  const [goal, setGoal] = useState("maintain");
  const [res, setRes] = useState(null);

  const activityMultipliers = {
    sedentary: { mul: 0.8,  label: "Sedentary" },
    light:     { mul: 1.2,  label: "Light Active" },
    moderate:  { mul: 1.6,  label: "Moderately Active" },
    heavy:     { mul: 2.0,  label: "Very Active" },
    athlete:   { mul: 2.2,  label: "Elite Athlete" },
  };
  const goalMultipliers = { lose: 0.9, maintain: 1.0, muscle: 1.1, bulk: 1.2 };

  useEffect(() => {
    const timer = setTimeout(() => {
      let w = parseFloat(weight);
      if (!w) { setRes(null); return; }
      if (unit === "imperial") w = w * 0.453592;

      const base = w * activityMultipliers[activity].mul * goalMultipliers[goal];
      const sedProtein = w * 0.8;
      const activeProtein = w * 1.4;
      const athleteProtein = w * 2.2;

      // Chart: protein needs across weights
      const weightRange = [];
      for (let wt = 50; wt <= 120; wt += 10) {
        weightRange.push({
          name: wt + "kg",
          Sedentary: Math.round(wt * 0.8),
          Active:    Math.round(wt * 1.6),
          Athlete:   Math.round(wt * 2.2),
          Yours:     Math.round(wt * activityMultipliers[activity].mul * goalMultipliers[goal]),
        });
      }

      const perKg = base / w;
      const insights = [
        { type: "tip", msg: `${activityMultipliers[activity].label}: ${Math.round(base)}g/day (${perKg.toFixed(1)}g/kg). Distribute evenly across 4–5 meals for best muscle protein synthesis.` },
        { type: "info", msg: `Food sources: 100g chicken breast = 31g | 1 large egg = 6g | 100g Greek yogurt = 10g | 100g canned tuna = 29g | 1 cup lentils = 18g` },
      ];
      if (goal === "muscle") insights.push({ type: "tip", msg: "For muscle building, aim for 2g+ per kg with a caloric surplus and progressive overload training." });
      if (goal === "lose")   insights.push({ type: "info", msg: "Higher protein during fat loss (1.6–2.2g/kg) preserves lean mass while in a caloric deficit." });

      setRes(buildResult(
        "Daily Protein",
        Math.round(base) + "g",
        [
          { label: "Recommended",          value: Math.round(base) + "g/day",  highlight: true },
          { label: "Per kg Bodyweight",    value: perKg.toFixed(1) + "g/kg"   },
          { label: "Per Meal (4 meals)",   value: Math.round(base / 4) + "g/meal" },
          { label: "Sedentary Minimum",    value: Math.round(sedProtein) + "g/day"    },
          { label: "Active Reference",     value: Math.round(activeProtein) + "g/day" },
          { label: "Athlete Upper",        value: Math.round(athleteProtein) + "g/day" },
        ],
        insights,
        { type: "bar", data: weightRange, keys: ["Sedentary", "Active", "Athlete", "Yours"] },
        [
          { label: "Activity Level",         value: activityMultipliers[activity].label },
          { label: "Fitness Goal",           value: goal },
          { label: "Activity Multiplier",    value: activityMultipliers[activity].mul + "g/kg" },
          { label: "Goal Adjustment",        value: "×" + goalMultipliers[goal] },
          { label: "Chicken Breast (100g)",  value: "31g protein" },
          { label: "Large Egg",              value: "6g protein" },
          { label: "Greek Yogurt (100g)",    value: "10g protein" },
          { label: "Canned Tuna (100g)",     value: "29g protein" },
          { label: "Lentils (cooked, 1 cup)",value: "18g protein" },
          { label: "Protein Powder (scoop)", value: "~25g protein" },
          { label: "Cottage Cheese (100g)",  value: "11g protein" },
        ]
      ));
    }, 150);
    return () => clearTimeout(timer);
  }, [weight, unit, activity, goal]);

  const presets = [
    { label: "Office Worker 70 kg",    v: { weight: "70", activity: "sedentary", goal: "maintain" } },
    { label: "Gym-goer 80 kg",         v: { weight: "80", activity: "moderate",  goal: "muscle"   } },
    { label: "Competitive Athlete 85 kg", v: { weight: "85", activity: "athlete", goal: "bulk"    } },
  ];

  return (
    <div>
      <Presets items={presets} onApply={p => { setWeight(p.v.weight); setActivity(p.v.activity); setGoal(p.v.goal); }} />
      <Tabs tabs={["Metric (kg)", "Imperial (lb)"]} active={unit === "metric" ? "Metric (kg)" : "Imperial (lb)"} onChange={v => setUnit(v.includes("Metric") ? "metric" : "imperial")} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <N label={unit === "metric" ? "Body Weight (kg)" : "Body Weight (lb)"} id="protw" value={weight} onChange={setWeight} unit={unit === "metric" ? "kg" : "lb"} />
          <Sel label="Activity Level" id="prota" value={activity} onChange={setActivity} opts={[
            { v: "sedentary", l: "Sedentary — desk job, no exercise (0.8g/kg)" },
            { v: "light",     l: "Light Active — 1–2 days/week (1.2g/kg)"      },
            { v: "moderate",  l: "Moderate — 3–5 days/week (1.6g/kg)"          },
            { v: "heavy",     l: "Very Active — 6–7 days/week intense (2.0g/kg)"},
            { v: "athlete",   l: "Elite Athlete — twice/day training (2.2g/kg)" },
          ]} />
          <Sel label="Fitness Goal" id="protg" value={goal} onChange={setGoal} opts={[
            { v: "lose",     l: "Fat Loss — preserve muscle while cutting"  },
            { v: "maintain", l: "Maintenance — sustain current composition" },
            { v: "muscle",   l: "Build Muscle — lean bulk"                  },
            { v: "bulk",     l: "Aggressive Bulk — maximize mass gain"      },
          ]} />
        </div>
        <div className="sticky-res">
          <Panel result={res} loading={null} label="Protein Calculator" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. HEALTHY WEIGHT FORM
// ─────────────────────────────────────────────────────────────────────────────
export function HealthyWeightForm() {
  const [height, setHeight] = useState("175");
  const [currentWeight, setCurrentWeight] = useState("80");
  const [gender, setGender] = useState("male");
  const [frameSize, setFrameSize] = useState("medium");
  const [unit, setUnit] = useState("metric");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      let h = parseFloat(height), cw = parseFloat(currentWeight);
      if (!h) { setRes(null); return; }
      if (unit === "imperial") { h = h * 2.54; if (cw) cw = cw * 0.453592; }

      const hM = h / 100;
      const bmiMin = 18.5 * hM * hM;
      const bmiMax = 24.9 * hM * hM;
      const bmiIdeal = 21.7 * hM * hM;

      // Hamwi formula
      const hamwiBase = gender === "male"
        ? 48 + 2.7 * ((h - 152.4) / 2.54)
        : 45.5 + 2.2 * ((h - 152.4) / 2.54);

      const frameAdj = { small: -0.1, medium: 0, large: 0.1 };
      const hamwi = hamwiBase * (1 + frameAdj[frameSize]);

      // Devine formula
      const devine = gender === "male"
        ? 50 + 0.9 * (h - 152.4)
        : 45.5 + 0.9 * (h - 152.4);

      // Miller formula
      const miller = gender === "male"
        ? 56.2 + 1.41 * ((h - 152.4) / 2.54)
        : 53.1 + 1.36 * ((h - 152.4) / 2.54);

      // Current BMI
      const currentBMI = cw ? (cw / (hM * hM)) : null;

      // BMI zone chart
      const bmiChart = [
        { name: "Underweight (<18.5)",  value: bmiMin,          fill: "#60a5fa" },
        { name: "Normal (18.5–24.9)",   value: bmiMax - bmiMin, fill: "#4ade80" },
        { name: "Overweight (25–29.9)", value: 29.9 * hM * hM - bmiMax, fill: "#facc15" },
        { name: "Obese (30+)",          value: 35 * hM * hM - 29.9 * hM * hM,   fill: "#f87171" },
      ];

      const insights = [];
      if (currentBMI !== null) {
        if (currentBMI < 18.5) insights.push({ type: "warn", msg: `Your BMI of ${currentBMI.toFixed(1)} is in the Underweight range. Consider consulting a nutritionist.` });
        else if (currentBMI <= 24.9) insights.push({ type: "tip", msg: `Your BMI of ${currentBMI.toFixed(1)} is in the Normal/Healthy range. Maintain through balanced diet and exercise.` });
        else if (currentBMI <= 29.9) insights.push({ type: "warn", msg: `Your BMI of ${currentBMI.toFixed(1)} is Overweight. Target healthy range: ${bmiMin.toFixed(1)}–${bmiMax.toFixed(1)} kg.` });
        else insights.push({ type: "warn", msg: `Your BMI of ${currentBMI.toFixed(1)} is in the Obese range. Consult a healthcare professional for a structured plan.` });
      }
      insights.push({ type: "info", msg: `Hamwi method adjusts for frame size. ${frameSize} frame gives ideal weight of ${hamwi.toFixed(1)} kg.` });

      const weightToLose = cw && cw > bmiMax ? (cw - bmiMax).toFixed(1) : null;
      const weightToGain = cw && cw < bmiMin ? (bmiMin - cw).toFixed(1) : null;

      setRes(buildResult(
        "Healthy Weight Range",
        `${bmiMin.toFixed(1)} – ${bmiMax.toFixed(1)} kg`,
        [
          { label: "Min (BMI 18.5)",  value: bmiMin.toFixed(1) + " kg" },
          { label: "Max (BMI 24.9)",  value: bmiMax.toFixed(1) + " kg" },
          { label: "Ideal (BMI 21.7)",value: bmiIdeal.toFixed(1) + " kg", highlight: true },
          { label: "Current BMI",     value: currentBMI ? currentBMI.toFixed(1) : "Enter current weight" },
          { label: "Hamwi Ideal",     value: hamwi.toFixed(1) + " kg"   },
          { label: "Devine Ideal",    value: devine.toFixed(1) + " kg"  },
          { label: "Miller Formula",  value: miller.toFixed(1) + " kg"  },
        ],
        insights,
        { type: "bar", data: bmiChart, keys: ["value"] },
        [
          { label: "Height (metric)",    value: h.toFixed(1) + " cm"     },
          { label: "Frame Size",         value: frameSize                  },
          { label: "BMI Range",          value: "18.5 – 24.9"             },
          { label: "Hamwi Base",         value: hamwiBase.toFixed(1) + " kg" },
          { label: "Frame Adjustment",   value: (frameAdj[frameSize] * 100).toFixed(0) + "%" },
          { label: "Weight to Lose",     value: weightToLose ? weightToLose + " kg" : "N/A" },
          { label: "Weight to Gain",     value: weightToGain ? weightToGain + " kg" : "N/A" },
          { label: "Formula — BMI",      value: "Weight / Height(m)²" },
          { label: "Formula — Hamwi M",  value: "48 + 2.7 × (in over 5ft)" },
          { label: "Formula — Hamwi F",  value: "45.5 + 2.2 × (in over 5ft)" },
        ]
      ));
    }, 150);
    return () => clearTimeout(timer);
  }, [height, currentWeight, gender, frameSize, unit]);

  const presets = [
    { label: "Short Female 155 cm",   v: { height: "155", currentWeight: "65",  gender: "female", frameSize: "small"  } },
    { label: "Average Male 175 cm",   v: { height: "175", currentWeight: "85",  gender: "male",   frameSize: "medium" } },
    { label: "Tall Male 190 cm",      v: { height: "190", currentWeight: "100", gender: "male",   frameSize: "large"  } },
  ];

  return (
    <div>
      <Presets items={presets} onApply={p => {
        setHeight(p.v.height); setCurrentWeight(p.v.currentWeight);
        setGender(p.v.gender); setFrameSize(p.v.frameSize);
      }} />
      <Tabs tabs={["Male", "Female"]} active={gender === "male" ? "Male" : "Female"} onChange={v => setGender(v.toLowerCase())} />
      <Tabs tabs={["Metric (cm)", "Imperial (in)"]} active={unit === "metric" ? "Metric (cm)" : "Imperial (in)"} onChange={v => setUnit(v.includes("Metric") ? "metric" : "imperial")} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Row2>
            <N label={unit === "metric" ? "Height (cm)" : "Height (inches)"} id="hwh" value={height} onChange={setHeight} unit={unit === "metric" ? "cm" : "in"} />
            <N label={unit === "metric" ? "Current Weight (kg)" : "Current Weight (lb)"} id="hwcw" value={currentWeight} onChange={setCurrentWeight} unit={unit === "metric" ? "kg" : "lb"} hint="Optional — used to calculate your current BMI" />
          </Row2>
          <Sel label="Frame Size (Hamwi adjustment)" id="hwframe" value={frameSize} onChange={setFrameSize} opts={[
            { v: "small",  l: "Small Frame  (−10% adjustment)" },
            { v: "medium", l: "Medium Frame (no adjustment)"   },
            { v: "large",  l: "Large Frame  (+10% adjustment)" },
          ]} />
        </div>
        <div className="sticky-res">
          <Panel result={res} loading={null} label="Healthy Weight" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. FAT INTAKE FORM
// ─────────────────────────────────────────────────────────────────────────────
export function FatIntakeForm() {
  const [calories, setCalories] = useState("2000");
  const [goal, setGoal] = useState("balanced");
  const [protein, setProtein] = useState("150");
  const [carbs, setCarbs] = useState("200");
  const [res, setRes] = useState(null);

  const goalProfiles = {
    low:      { pct: 0.20, label: "Low Fat",    desc: "Heart disease prevention. AHA recommends <30% total fat." },
    balanced: { pct: 0.30, label: "Balanced",   desc: "Standard dietary guidelines. 30% fat, 40% carbs, 30% protein." },
    high:     { pct: 0.40, label: "High Fat",   desc: "Paleo / primal diet. Emphasizes healthy fats over grains." },
    keto:     { pct: 0.70, label: "Ketogenic",  desc: "Ketosis state. 70% fat, <5% carbs triggers fat burning." },
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const cal = parseFloat(calories);
      const prot = parseFloat(protein) || 0;
      const carb = parseFloat(carbs) || 0;
      if (!cal) { setRes(null); return; }

      const profile = goalProfiles[goal];
      const fatCals   = cal * profile.pct;
      const fatGrams  = fatCals / 9;
      const satFat    = fatGrams * (goal === "keto" ? 0.25 : 0.30);
      const unsat     = fatGrams - satFat;
      const mono      = unsat * 0.60;
      const poly      = unsat * 0.40;

      const protCals = prot * 4;
      const carbCals = carb * 4;
      const fatCalsFull = cal - protCals - carbCals;

      // Macro pie chart
      const macroChart = [
        { name: "Fat",     value: parseFloat(fatCals.toFixed(0)),    fill: "#f59e0b" },
        { name: "Protein", value: parseFloat(protCals.toFixed(0)),   fill: "#3b82f6" },
        { name: "Carbs",   value: parseFloat(carbCals.toFixed(0)),   fill: "#10b981" },
      ];

      const insights = [];
      insights.push({ type: "info", msg: profile.desc });
      if (satFat > 0.10 * cal / 9) insights.push({ type: "warn", msg: `Saturated fat (${satFat.toFixed(0)}g) should stay below 10% of total calories. Prioritize monounsaturated fats (olive oil, avocado).` });
      if (goal === "keto") insights.push({ type: "tip", msg: "Keep net carbs under 20–50g/day to maintain ketosis. Check ketone levels with strips if starting out." });

      setRes(buildResult(
        "Daily Fat Intake",
        Math.round(fatGrams) + "g",
        [
          { label: "Total Fat",              value: Math.round(fatGrams) + "g (" + (profile.pct * 100).toFixed(0) + "% calories)", highlight: true },
          { label: "Saturated Fat (max)",    value: Math.round(satFat) + "g" },
          { label: "Monounsaturated Fat",    value: Math.round(mono) + "g"   },
          { label: "Polyunsaturated Fat",    value: Math.round(poly) + "g"   },
          { label: "Fat Calories",           value: Math.round(fatCals) + " kcal" },
        ],
        insights,
        { type: "donut", data: macroChart, keys: ["value"] },
        [
          { label: "Diet Type",             value: profile.label },
          { label: "Fat % of Calories",     value: (profile.pct * 100).toFixed(0) + "%" },
          { label: "AHA Sat Fat Max",       value: "≤ 10% of calories = " + Math.round(cal * 0.10 / 9) + "g" },
          { label: "Omega-3 Target",        value: "1.1–1.6g/day (EPA+DHA)" },
          { label: "Healthy Fat Sources",   value: "Olive oil, avocado, nuts, salmon, chia" },
          { label: "Avoid",                 value: "Trans fats, hydrogenated oils, fried foods" },
          { label: "Formula",               value: "(Calories × Fat%) ÷ 9 cal/g" },
        ]
      ));
    }, 150);
    return () => clearTimeout(timer);
  }, [calories, goal, protein, carbs]);

  const presets = [
    { label: "Standard 2000 kcal Balanced", v: { calories: "2000", goal: "balanced", protein: "150", carbs: "200" } },
    { label: "Low Fat 1800 kcal",           v: { calories: "1800", goal: "low",      protein: "140", carbs: "225" } },
    { label: "Keto 2200 kcal",              v: { calories: "2200", goal: "keto",     protein: "160", carbs: "20"  } },
  ];

  return (
    <div>
      <Presets items={presets} onApply={p => {
        setCalories(p.v.calories); setGoal(p.v.goal); setProtein(p.v.protein); setCarbs(p.v.carbs);
      }} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <N label="Daily Calorie Intake" id="fical" value={calories} onChange={setCalories} unit="kcal" hint="Total target calories per day" />
          <Sel label="Diet Goal" id="figoal" value={goal} onChange={setGoal} opts={[
            { v: "low",      l: "Low Fat Diet (20%) — Heart health" },
            { v: "balanced", l: "Balanced Diet (30%) — Standard"   },
            { v: "high",     l: "High Fat / Paleo (40%)"           },
            { v: "keto",     l: "Ketogenic Diet (70%) — Ketosis"   },
          ]} />
          <Row2>
            <N label="Protein (g)" id="fiprot" value={protein} onChange={setProtein} unit="g" hint="For macro split chart" />
            <N label="Carbs (g)"   id="ficarb" value={carbs}   onChange={setCarbs}   unit="g" hint="For macro split chart" />
          </Row2>
        </div>
        <div className="sticky-res">
          <Panel result={res} loading={null} label="Fat Intake" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. ARMY BODY FAT FORM
// ─────────────────────────────────────────────────────────────────────────────
export function ArmyBodyFatForm() {
  const [gender, setGender]   = useState("male");
  const [height, setHeight]   = useState("70");
  const [neck, setNeck]       = useState("15");
  const [waist, setWaist]     = useState("33");
  const [hip, setHip]         = useState("38");
  const [age, setAge]         = useState("25");
  const [res, setRes]         = useState(null);

  const armyStandards = {
    male: [
      { label: "17–20", minAge: 17, maxAge: 20, limit: 20 },
      { label: "21–27", minAge: 21, maxAge: 27, limit: 22 },
      { label: "28–39", minAge: 28, maxAge: 39, limit: 24 },
      { label: "40+",   minAge: 40, maxAge: 999, limit: 26 },
    ],
    female: [
      { label: "17–20", minAge: 17, maxAge: 20, limit: 30 },
      { label: "21–27", minAge: 21, maxAge: 27, limit: 32 },
      { label: "28–39", minAge: 28, maxAge: 39, limit: 34 },
      { label: "40+",   minAge: 40, maxAge: 999, limit: 36 },
    ],
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const h = parseFloat(height), n = parseFloat(neck), w = parseFloat(waist),
            p = parseFloat(hip), a = parseFloat(age);
      if (!h || !n || !w) { setRes(null); return; }

      let bf;
      if (gender === "male") {
        bf = 86.010 * Math.log10(w - n) - 70.041 * Math.log10(h) + 36.76;
      } else {
        if (!p) { setRes(null); return; }
        bf = 163.205 * Math.log10(w + p - n) - 97.684 * Math.log10(h) - 78.387;
      }
      bf = Math.max(0, Math.round(bf * 10) / 10);

      const standards = armyStandards[gender];
      const ageGroup = standards.find(s => a >= s.minAge && a <= s.maxAge) || standards[standards.length - 1];
      const limit = ageGroup.limit;
      const passes = bf <= limit;
      const diff = Math.abs(bf - limit).toFixed(1);

      // Chart: BF% vs age group limits
      const chartData = standards.map(s => ({
        name: s.label,
        "Army Limit": s.limit,
        "Your BF%": bf,
      }));

      const insights = [];
      if (passes) {
        insights.push({ type: "tip", msg: `✅ Body fat of ${bf}% PASSES Army standards for age group ${ageGroup.label} (limit ≤${limit}%). You are ${diff}% below the limit.` });
      } else {
        insights.push({ type: "warn", msg: `❌ Body fat of ${bf}% FAILS Army standards. Exceeds the ${ageGroup.label} age group limit of ${limit}% by ${diff}%. Focus on cardio and calorie deficit.` });
        insights.push({ type: "info", msg: `To pass, reduce body fat by at least ${diff}% through cardiovascular training (run 5+ days/week) and a moderate caloric deficit (~500 kcal/day).` });
      }

      setRes(buildResult(
        "Army Body Fat %",
        bf + "%",
        [
          { label: "Body Fat %",              value: bf + "%",                highlight: passes, warn: !passes },
          { label: "Army Limit (Age " + ageGroup.label + ")", value: "≤ " + limit + "%" },
          { label: "Status",                  value: passes ? "✅ PASS" : "❌ FAIL" },
          { label: "Margin",                  value: diff + "% " + (passes ? "below limit" : "over limit") },
        ],
        insights,
        { type: "bar", data: chartData, keys: ["Army Limit", "Your BF%"] },
        [
          { label: "Gender",               value: gender },
          { label: "Age Group",            value: ageGroup.label },
          { label: "Height (in)",          value: h + '"' },
          { label: "Neck (in)",            value: n + '"' },
          { label: "Waist (in)",           value: w + '"' },
          ...(gender === "female" ? [{ label: "Hip (in)", value: p + '"' }] : []),
          { label: "Formula (Male)",       value: "86.010×log10(W−N) − 70.041×log10(H) + 36.76" },
          { label: "Formula (Female)",     value: "163.205×log10(W+H−N) − 97.684×log10(H) − 78.387" },
          { label: "Army Std 17–20 M/F",   value: "≤20% / ≤30%" },
          { label: "Army Std 21–27 M/F",   value: "≤22% / ≤32%" },
          { label: "Army Std 28–39 M/F",   value: "≤24% / ≤34%" },
          { label: "Army Std 40+ M/F",     value: "≤26% / ≤36%" },
        ]
      ));
    }, 150);
    return () => clearTimeout(timer);
  }, [gender, height, neck, waist, hip, age]);

  const presets = [
    { label: "Fit Male 25 yrs",    v: { gender: "male",   height: "70", neck: "15",   waist: "32", hip: "",   age: "25" } },
    { label: "Average Male 35 yrs",v: { gender: "male",   height: "70", neck: "16",   waist: "36", hip: "",   age: "35" } },
    { label: "Fit Female 25 yrs",  v: { gender: "female", height: "64", neck: "13.5", waist: "28", hip: "37", age: "25" } },
  ];

  return (
    <div>
      <Presets items={presets} onApply={p => {
        setGender(p.v.gender); setHeight(p.v.height); setNeck(p.v.neck);
        setWaist(p.v.waist); if (p.v.hip) setHip(p.v.hip); setAge(p.v.age);
      }} />
      <Tabs tabs={["Male", "Female"]} active={gender === "male" ? "Male" : "Female"} onChange={v => setGender(v.toLowerCase())} />
      <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 14 }}>
        All measurements in <strong>inches</strong>. Measure neck at narrowest point; waist at navel level.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Row2>
            <N label="Height (in)"  id="abfh"   value={height} onChange={setHeight} unit='in' />
            <N label="Age (years)"  id="abfage"  value={age}    onChange={setAge}    unit="yrs" />
          </Row2>
          <Row2>
            <N label="Neck Circumference (in)"  id="abfn" value={neck}  onChange={setNeck}  unit='in' hint="Narrowest point" />
            <N label="Waist Circumference (in)" id="abfw" value={waist} onChange={setWaist} unit='in' hint="At navel level"  />
          </Row2>
          {gender === "female" && (
            <N label="Hip Circumference (in)" id="abfhip" value={hip} onChange={setHip} unit='in' hint="Widest point of hips/buttocks" />
          )}
        </div>
        <div className="sticky-res">
          <Panel result={res} loading={null} label="Army Body Fat" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. CONCEPTION FORM
// ─────────────────────────────────────────────────────────────────────────────
export function ConceptionForm() {
  const [mode, setMode] = useState("lmp");
  const [lmpDate, setLmpDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [cycleLength, setCycleLength] = useState("28");
  const [res, setRes] = useState(null);

  const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  };

  const fmtDate = (d) => {
    if (!d || isNaN(d)) return "—";
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const fmtDateShort = (d) => {
    if (!d || isNaN(d)) return "—";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const daysBetween = (a, b) => Math.round((b - a) / (1000 * 60 * 60 * 24));

  useEffect(() => {
    const timer = setTimeout(() => {
      let lmp;
      const cycle = parseInt(cycleLength) || 28;

      if (mode === "lmp") {
        if (!lmpDate) { setRes(null); return; }
        lmp = new Date(lmpDate);
      } else {
        if (!dueDate) { setRes(null); return; }
        const dd = new Date(dueDate);
        lmp = addDays(dd, -280);
      }

      if (isNaN(lmp)) { setRes(null); return; }

      const ovulationDay  = cycle - 14;
      const ovulation     = addDays(lmp, ovulationDay);
      const conceptionWinStart = addDays(ovulation, -5);
      const conceptionWinEnd   = addDays(ovulation, 1);
      const implantation       = addDays(ovulation, 9);
      const implantationEnd    = addDays(ovulation, 12);
      const firstHeartbeat     = addDays(lmp, 42);  // ~6 weeks
      const firstTrimesterEnd  = addDays(lmp, 84);  // 12 weeks
      const secondTrimesterEnd = addDays(lmp, 196); // 28 weeks
      const due                = addDays(lmp, 280);
      const today              = new Date();

      const daysToOvulation   = daysBetween(today, ovulation);
      const daysToConception  = daysBetween(today, conceptionWinStart);
      const gestationalAge    = daysBetween(lmp, today);
      const weeksPregnant     = Math.floor(gestationalAge / 7);
      const daysExtra         = gestationalAge % 7;

      // Timeline chart
      const timeline = [
        { name: "LMP",              day: 0 },
        { name: "Ovulation",        day: ovulationDay },
        { name: "Conception Window",day: ovulationDay - 5 },
        { name: "Implantation",     day: ovulationDay + 9 },
        { name: "First Heartbeat",  day: 42 },
        { name: "12-Week Scan",     day: 84 },
        { name: "Due Date",         day: 280 },
      ];

      const insights = [];
      if (gestationalAge > 0 && gestationalAge < 280) {
        insights.push({ type: "info", msg: `Currently ${weeksPregnant} weeks and ${daysExtra} days into the pregnancy (gestational age from LMP).` });
        if (weeksPregnant < 12) insights.push({ type: "tip", msg: "First trimester: Start prenatal vitamins (folic acid 400–800 mcg/day), schedule first prenatal visit." });
        else if (weeksPregnant < 28) insights.push({ type: "tip", msg: "Second trimester: Anatomy scan typically done at 18–22 weeks. Glucose screening around 24–28 weeks." });
        else insights.push({ type: "info", msg: "Third trimester: Monitor fetal movement. Prepare birth plan. GBS test typically done at 35–37 weeks." });
      } else if (gestationalAge < 0) {
        insights.push({ type: "info", msg: `Conception window starts in approximately ${Math.abs(daysToConception)} days (${fmtDateShort(conceptionWinStart)} – ${fmtDateShort(conceptionWinEnd)}).` });
      }

      setRes(buildResult(
        "Conception & Pregnancy Timeline",
        fmtDate(due),
        [
          { label: "Estimated Due Date",       value: fmtDate(due),                        highlight: true },
          { label: "Ovulation Date",           value: fmtDate(ovulation)                   },
          { label: "Conception Window",        value: fmtDateShort(conceptionWinStart) + " – " + fmtDateShort(conceptionWinEnd) },
          { label: "Implantation Window",      value: fmtDateShort(implantation) + " – " + fmtDateShort(implantationEnd) },
          { label: "First Heartbeat (~6 wks)", value: fmtDate(firstHeartbeat)              },
          { label: "12-Week Scan",             value: fmtDate(firstTrimesterEnd)            },
        ],
        insights,
        { type: "bar", data: timeline, keys: ["day"] },
        [
          { label: "Last Menstrual Period",    value: fmtDate(lmp)                       },
          { label: "Cycle Length",             value: cycle + " days"                    },
          { label: "Ovulation (cycle day)",    value: "Day " + ovulationDay              },
          { label: "Fertile Window",           value: fmtDateShort(conceptionWinStart) + " – " + fmtDateShort(conceptionWinEnd) },
          { label: "Implantation",             value: fmtDateShort(implantation) + " – " + fmtDateShort(implantationEnd) },
          { label: "First Heartbeat",          value: fmtDate(firstHeartbeat) + " (~6 weeks)" },
          { label: "End of 1st Trimester",     value: fmtDate(firstTrimesterEnd)         },
          { label: "End of 2nd Trimester",     value: fmtDate(secondTrimesterEnd)        },
          { label: "Estimated Due Date",       value: fmtDate(due)                       },
          { label: "Gestational Age Today",    value: gestationalAge > 0 ? weeksPregnant + "w " + daysExtra + "d" : "Not yet pregnant" },
          { label: "Note",                     value: "All dates are estimates. Ultrasound dating may differ." },
        ]
      ));
    }, 150);
    return () => clearTimeout(timer);
  }, [mode, lmpDate, dueDate, cycleLength]);

  const presets = [
    { label: "28-day cycle from today", v: { mode: "lmp", lmpDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], cycle: "28" } },
    { label: "30-day cycle",            v: { mode: "lmp", lmpDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], cycle: "30" } },
  ];

  return (
    <div>
      <Presets items={presets} onApply={p => {
        setMode(p.v.mode); setLmpDate(p.v.lmpDate || ""); setCycleLength(p.v.cycle);
      }} />
      <Tabs
        tabs={["From LMP Date", "From Due Date"]}
        active={mode === "lmp" ? "From LMP Date" : "From Due Date"}
        onChange={v => setMode(v.includes("LMP") ? "lmp" : "due")}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {mode === "lmp" ? (
            <N label="First Day of Last Period (LMP)" id="conlmp" value={lmpDate} onChange={setLmpDate} type="number" placeholder="YYYY-MM-DD" hint="Enter date in YYYY-MM-DD format" />
          ) : (
            <N label="Estimated Due Date" id="condue" value={dueDate} onChange={setDueDate} type="number" placeholder="YYYY-MM-DD" hint="Enter your due date in YYYY-MM-DD format" />
          )}
          <Sl label="Cycle Length" id="concycle" min={21} max={45} step={1} value={parseInt(cycleLength) || 28} onChange={v => setCycleLength(String(v))} fmt={v => v + " days"} />
          <div style={{ padding: "12px 14px", background: "var(--surface2)", borderRadius: "var(--r-md)", fontSize: 12, color: "var(--text3)", lineHeight: 1.6, marginTop: 8 }}>
            <strong style={{ color: "var(--text2)" }}>How it works:</strong><br />
            Ovulation occurs ~14 days before your next period. The fertile window is 5 days before ovulation + ovulation day. Implantation happens 6–12 days after ovulation.
          </div>
        </div>
        <div className="sticky-res">
          <Panel result={res} loading={null} label="Conception" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Default export — named components
// ─────────────────────────────────────────────────────────────────────────────
export default { BSAForm, BACForm, LeanBodyMassForm, ProteinForm, HealthyWeightForm, FatIntakeForm, ArmyBodyFatForm, ConceptionForm };
