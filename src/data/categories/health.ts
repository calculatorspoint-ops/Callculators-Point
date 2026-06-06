import type { CalculatorConfig } from '../calculatorConfigs';

export const healthCalculators: CalculatorConfig[] = [
  {
  id: 'bmi',
  slug: 'bmi-calculator',
  cat: 'health',
  name: 'BMI Calculator',
  icon: '⚖️',
  desc: 'BMI with WHO risk classification, ideal weight & body fat estimate',
  popular: true,
  hasChart: true,
  isNew: false,
  privacy: "sensitive",
  formula: 'BMI = weight(kg) / height(m)²\n' +
    'For imperial: BMI = 703 × weight(lbs) / height(in)²',
  tips: [
    "BMI does not distinguish between muscle and fat. Highly muscular individuals may be classified as 'overweight' despite having low body fat."
  ],
  whenToUse: 'Use this calculator as a quick, first-step screening tool to determine if your weight falls into a healthy range for your height according to the World Health Organization.',
  resultMeaning: 'Your BMI score places you into a category (Underweight, Normal, Overweight, or Obese). The results indicate your statistical risk for weight-related diseases.',
  limitations: [
    'BMI cannot distinguish between muscle mass and fat mass. Bodybuilders will often score as "Obese".',
    'It does not account for age, bone density, or how fat is distributed (visceral vs subcutaneous fat).'
  ],
  examples: [
    { scenario: 'A person who is 1.75m tall and weighs 70kg.', result: 'Their BMI is 22.9, which is squarely in the "Normal Weight" category.' },
    { scenario: 'The same person gains 15kg of muscle.', result: 'Their BMI jumps to 27.8, classifying them as "Overweight", even though they are healthier.' }
  ],
  howToUse: [
    'Select your preferred measurement system (Metric or Imperial).',
    'Enter your current weight.',
    'Enter your height.',
    'Instantly see your BMI score, WHO category, and ideal weight range.'
  ],
  metaTitle: 'BMI Calculator – Body Mass Index with WHO Classification',
  metaDescription: 'Calculate your BMI instantly with WHO risk categories, ideal weight range, and body fat estimate. Free, accurate, and works in metric or imperial.',
  intro: 'BMI (Body Mass Index) is a widely used screening tool that relates your weight to your height to estimate whether you fall within a healthy weight range. This calculator applies the WHO classification system, giving you both your numeric score and the associated health risk category. It\'s useful for adults tracking weight health, though it works best alongside other measurements like waist circumference or body fat percentage.',
  workedExample: {
    title: 'Calculating BMI for a 35-year-old woman (metric)',
    inputs: ['Weight: 68 kg', 'Height: 1.65 m'],
    steps: [
      'Square the height: 1.65 × 1.65 = 2.7225 m²',
      'Divide weight by height squared: 68 ÷ 2.7225 = 24.98',
      'Round to one decimal: BMI = 25.0',
      'WHO category: Overweight (25.0–29.9) — borderline, just above Normal'
    ],
    result: 'BMI of 25.0 places this individual at the upper boundary of normal weight. A 1–2 kg reduction would move her into the Normal (18.5–24.9) range.'
  },
  relatedCalculators: ['bmr-calculator', 'calorie-calculator', 'ideal-weight-calculator', 'body-fat-calculator', 'macro-calculator'],
  about: `Body Mass Index was developed in the 1830s by mathematician Adolphe Quetelet as a population-level statistical tool — not as a diagnostic for individuals. Despite this, it became a clinical standard because it requires only a scale and a tape measure, making it accessible everywhere from clinics to home use.

The WHO classification thresholds (underweight below 18.5, normal 18.5–24.9, overweight 25–29.9, obese 30+) are based on population-level studies of cardiovascular and metabolic risk. They are a useful starting point, but they don't account for muscle mass, bone density, age, or how fat is distributed across the body.

Use your BMI result as one data point among several. Pairing it with waist circumference (a better predictor of visceral fat) and body fat percentage gives a much fuller picture of your metabolic health.`
},
  {
  id: 'calorie',
  slug: 'calorie-calculator',
  cat: 'health',
  name: 'Calorie Calculator',
  icon: '🔥',
  desc: 'TDEE with 5 goals, 2 formulas, macros & weekly weight projection',
  popular: true,
  hasChart: true,
  isNew: false,
  tips: [
    'Total Daily Energy Expenditure (TDEE) is the total number of calories you burn per day, including basal metabolic rate and physical activity.'
  ],
  metaTitle: 'Calorie Calculator – TDEE, Weight Loss & Macro Targets',
  metaDescription: 'Calculate your daily calorie needs based on TDEE, activity level, and weight goal. Get macro targets and weekly weight projection. Free & accurate.',
  intro: 'This calorie calculator computes your Total Daily Energy Expenditure (TDEE) using either the Mifflin-St Jeor or Harris-Benedict formula, then adjusts it for your specific goal — whether you\'re looking to lose fat, maintain weight, or build muscle. Alongside your calorie target, it breaks down your macronutrient ratios and shows a projected weekly weight change so you can set realistic expectations.',
  workedExample: {
    title: 'Finding daily calories for a 28-year-old man aiming to lose fat',
    inputs: ['Age: 28', 'Sex: Male', 'Weight: 85 kg', 'Height: 178 cm', 'Activity: Moderately active (3–5 days/week exercise)', 'Goal: Lose 0.5 kg/week'],
    steps: [
      'Calculate BMR (Mifflin-St Jeor, male): (10 × 85) + (6.25 × 178) − (5 × 28) + 5 = 850 + 1112.5 − 140 + 5 = 1,827.5 kcal',
      'Apply activity multiplier (1.55 for moderately active): 1827.5 × 1.55 = 2,833 kcal (TDEE)',
      'Subtract 500 kcal/day for 0.5 kg/week loss target: 2,833 − 500 = 2,333 kcal/day',
      'Macro split (40% protein, 30% carbs, 30% fat): Protein = 233 kcal ÷ 4 = 58 g per 10% — so 40% = 233 g protein; Carbs = 30% × 2333 ÷ 4 = 175 g; Fat = 30% × 2333 ÷ 9 = 78 g'
    ],
    result: 'Daily target: 2,333 kcal with approximately 233 g protein, 175 g carbohydrates, and 78 g fat. At this deficit, expected fat loss is ~0.5 kg per week.'
  },
  relatedCalculators: ['bmr-calculator', 'macro-calculator', 'tdee-calculator', 'body-fat-calculator', 'protein-intake-calculator'],
  about: `Your calorie needs change constantly based on age, muscle mass, stress levels, and how much you move. The TDEE framework — BMR multiplied by an activity factor — provides a personalized starting point that's far more accurate than generic "eat 2,000 calories" advice.

This calculator offers two BMR formulas. Mifflin-St Jeor is the current clinical standard and tends to be more accurate for most people. Harris-Benedict, the older formula, can overestimate by 5–10%. If you know your body fat percentage, the Katch-McArdle formula (available in the BMR calculator) is even more precise.

From your TDEE, a deficit creates fat loss and a surplus supports muscle gain. A 500 kcal/day deficit equates to roughly 0.5 kg of fat loss per week — the rate most dietitians recommend as sustainable without triggering significant muscle loss.`
},
  {
  id: 'bmr',
  slug: 'bmr-calculator',
  cat: 'health',
  name: 'BMR Calculator',
  icon: '⚡',
  desc: 'Mifflin vs Harris-Benedict with TDEE at all 5 activity levels',
  popular: false,
  hasChart: false,
  isNew: false,
  formula: 'Mifflin-St Jeor:\n' +
    'Men: BMR = 10×weight(kg) + 6.25×height(cm) - 5×age - 5\n' +
    'Women: BMR = 10×weight(kg) + 6.25×height(cm) - 5×age - 161',
  tips: [
    'Mifflin-St Jeor is considered the most clinically accurate BMR formula for most adults.',
    'BMR accounts for 60-75% of total daily calories — your body burns most energy just staying alive.'
  ],
  metaTitle: 'BMR Calculator – Basal Metabolic Rate (Mifflin & Harris-Benedict)',
  metaDescription: 'Calculate your Basal Metabolic Rate using Mifflin-St Jeor and Harris-Benedict formulas. See TDEE across all 5 activity levels. Free and accurate.',
  intro: 'Your Basal Metabolic Rate (BMR) is the number of calories your body burns at complete rest — the minimum energy required to keep your heart beating, lungs breathing, and organs functioning. This calculator computes your BMR using both the Mifflin-St Jeor and Harris-Benedict equations side by side, and then projects your TDEE across five activity levels so you can identify the right calorie target for your lifestyle.',
  workedExample: {
    title: 'BMR and TDEE for a 42-year-old woman',
    inputs: ['Age: 42', 'Sex: Female', 'Weight: 72 kg', 'Height: 163 cm'],
    steps: [
      'Mifflin-St Jeor (female): (10 × 72) + (6.25 × 163) − (5 × 42) − 161',
      '= 720 + 1018.75 − 210 − 161 = 1,367.75 kcal/day',
      'Harris-Benedict (female): 655.1 + (9.563 × 72) + (1.850 × 163) − (4.676 × 42)',
      '= 655.1 + 688.5 + 301.5 − 196.4 = 1,448.7 kcal/day',
      'TDEE at lightly active (×1.375): Mifflin = 1,880 kcal | Harris-Benedict = 1,992 kcal'
    ],
    result: 'BMR is approximately 1,368–1,449 kcal. At a lightly active level, she needs about 1,880–1,990 kcal/day to maintain current weight. Mifflin is typically the more accurate of the two.'
  },
  relatedCalculators: ['calorie-calculator', 'tdee-calculator', 'macro-calculator', 'bmi-calculator', 'daily-calorie-calculator'],
  about: `BMR represents the largest portion of your total energy expenditure — typically 60–75% of the calories you burn each day. Even while sleeping, your body is consuming energy for cellular repair, temperature regulation, and organ function.

The Mifflin-St Jeor equation, developed in 1990, is validated against indirect calorimetry data and is considered the current gold standard for BMR estimation. The Harris-Benedict formula (1919, revised 1984) is still widely used but tends to overestimate BMR by about 5–10% in most populations.

Both formulas use only height, weight, age, and sex — which means they cannot account for muscle-to-fat ratio. If you have an unusually high or low muscle mass, your actual BMR will differ from these estimates. Pair your BMR with an accurate activity multiplier to find your real maintenance calories.`
},
  {
  id: 'body-fat',
  slug: 'body-fat-calculator',
  cat: 'health',
  name: 'Body Fat Calculator',
  icon: '📏',
  desc: 'Body fat % using US Navy method with category classification',
  popular: false,
  hasChart: true,
  isNew: false,
  privacy: "sensitive",
  formula: 'Men: BF% = 495/(1.0324 - 0.19077×log₁₀(waist-neck) + 0.15456×log₁₀(height)) - 450',
  tips: [
    'The Navy method is surprisingly accurate (within 3-4% of DEXA scans) and requires only a tape measure.'
  ],
  metaTitle: 'Body Fat Calculator – US Navy Method with Category Classification',
  metaDescription: 'Estimate your body fat percentage using the US Navy circumference method. See your fitness category and compare to healthy ranges. Free & accurate.',
  intro: 'This body fat calculator uses the US Navy circumference method, which estimates body fat percentage from measurements of the neck, waist, and hips — no calipers or expensive equipment required. The method is validated to within 3–4% of DEXA scan results for most people, making it one of the most practical field-based assessments available.',
  workedExample: {
    title: 'Body fat estimation for a 30-year-old man',
    inputs: ['Sex: Male', 'Height: 180 cm', 'Waist circumference: 88 cm', 'Neck circumference: 38 cm'],
    steps: [
      'Apply US Navy formula for men:',
      'BF% = 495 / (1.0324 − 0.19077 × log₁₀(waist − neck) + 0.15456 × log₁₀(height)) − 450',
      'Waist − neck = 88 − 38 = 50 cm; log₁₀(50) = 1.6990',
      'log₁₀(180) = 2.2553',
      'Denominator = 1.0324 − (0.19077 × 1.6990) + (0.15456 × 2.2553)',
      '= 1.0324 − 0.3241 + 0.3486 = 1.0569',
      'BF% = 495 / 1.0569 − 450 = 468.4 − 450 = 18.4%'
    ],
    result: 'Body fat of 18.4% falls in the "Fitness" category for men (14–20%). This is a healthy range indicating low metabolic risk.'
  },
  relatedCalculators: ['bmi-calculator', 'ideal-weight-calculator', 'army-body-fat-calculator', 'lean-body-mass-calculator'],
  about: `Body fat percentage is a more direct measure of body composition than BMI because it distinguishes between fat mass and lean mass (muscle, bone, organs, water). Two people with identical BMI scores can have vastly different health profiles if one is muscular and the other has high fat mass.

The US Navy method was developed for military fitness assessments and is a practical alternative to expensive methods like DEXA scanning or hydrostatic weighing. It uses circumference measurements — which correlate with subcutaneous fat distribution — to estimate total body fat using a logarithmic formula.

Accuracy is best when measurements are taken consistently: use a flexible tape measure, measure at the same time of day, and take three readings per site and average them. For women, the formula also incorporates hip circumference since women carry proportionally more fat in the hip region.`
},
  {
  id: 'ideal-weight',
  slug: 'ideal-weight-calculator',
  cat: 'health',
  name: 'Ideal Weight',
  icon: '🎯',
  desc: '4-formula comparison: Devine, Miller, Robinson & Hamwi with BMI range',
  popular: false,
  hasChart: true,
  isNew: false,
  tips: [
    "No single formula is 'correct' — we show all four plus the BMI range so you can see the consensus."
  ],
  metaTitle: 'Ideal Weight Calculator – Devine, Miller, Robinson & Hamwi Formulas',
  metaDescription: 'Find your ideal body weight using 4 clinical formulas (Devine, Miller, Robinson, Hamwi) plus the WHO BMI healthy range. Compare all results side by side.',
  intro: 'There is no single universally agreed definition of "ideal weight" — different clinical formulas developed over decades give different results depending on their intended use. This calculator computes your ideal weight using four established formulas (Devine, Miller, Robinson, and Hamwi) alongside the WHO BMI-based healthy range, letting you see where the consensus lies.',
  workedExample: {
    title: 'Ideal weight estimates for a 5\'10" (178 cm) male',
    inputs: ['Sex: Male', 'Height: 178 cm (5 ft 10 in)'],
    steps: [
      'Devine formula (1974): 50 + 2.3 × (inches over 5 ft) = 50 + 2.3 × 10 = 73.0 kg',
      'Miller formula (1983): 56.2 + 1.41 × (inches over 5 ft) = 56.2 + 14.1 = 70.3 kg',
      'Robinson formula (1983): 52 + 1.9 × (inches over 5 ft) = 52 + 19 = 71.0 kg',
      'Hamwi formula (1964): 48.0 + 2.7 × (inches over 5 ft) = 48 + 27 = 75.0 kg',
      'WHO BMI-based range (18.5–24.9): 58.7 kg – 79.1 kg'
    ],
    result: 'Formula consensus: 70.3–75.0 kg. The WHO BMI range is wider at 58.7–79.1 kg. A reasonable target weight is 70–75 kg, which satisfies all four formulas.'
  },
  relatedCalculators: ['bmi-calculator', 'body-fat-calculator', 'bmr-calculator', 'calorie-calculator'],
  about: `The four ideal weight formulas in this calculator were each developed for different clinical purposes. The Devine formula (1974) was originally created to calculate drug dosing for patients — not as a fitness target. The Hamwi formula is used in clinical nutrition to determine caloric requirements. Robinson and Miller updated these models in 1983 using different population datasets.

Each formula was derived from height-based linear regressions of population samples, which is why they produce slightly different results. None of them account for muscle mass, frame size, or ethnicity — a heavily muscled athlete and a sedentary person of the same height would get the same "ideal weight" from every formula.

Think of these values as a range rather than a fixed target. If all four formulas and the BMI range overlap on a similar number, that convergence is meaningful. Where they diverge, your frame size, fitness goals, and personal health context matter more than any single formula's output.`
},
  {
  id: 'macro',
  slug: 'macro-calculator',
  cat: 'health',
  name: 'Macro Calculator',
  icon: '🥗',
  desc: 'Protein/carbs/fat targets by goal with donut chart',
  popular: false,
  hasChart: true,
  isNew: false,
  tips: [
    'Protein: 4 cal/g · Carbs: 4 cal/g · Fat: 9 cal/g. Fat has more than double the calories per gram.',
    'Most adults need 1.6-2.2g protein per kg bodyweight for optimal muscle maintenance.'
  ],
  intro: 'This macro calculator determines your ideal daily protein, carbohydrate, and fat targets based on your calorie goal and fitness objective. Whether you\'re cutting fat, building muscle, or maintaining weight, it distributes your calories across macronutrients using ratios aligned with sports nutrition research — and displays the result as a donut chart for easy tracking.',
  workedExample: {
    title: 'Macro targets for a 25-year-old woman building muscle at 2,100 kcal/day',
    inputs: ['Daily calorie target: 2,100 kcal', 'Goal: Muscle gain', 'Body weight: 60 kg'],
    steps: [
      'Protein recommendation for muscle gain: 2.0 g/kg = 2.0 × 60 = 120 g protein',
      'Protein calories: 120 × 4 = 480 kcal (23% of total)',
      'Fat recommendation: 25% of calories = 0.25 × 2100 = 525 kcal ÷ 9 = 58 g fat',
      'Remaining calories for carbs: 2100 − 480 − 525 = 1,095 kcal ÷ 4 = 274 g carbs'
    ],
    result: 'Daily macro targets: 120 g protein | 274 g carbohydrates | 58 g fat — providing adequate protein for muscle synthesis and enough carbohydrates to fuel training sessions.'
  },
  relatedCalculators: ['calorie-calculator', 'protein-intake-calculator', 'bmr-calculator', 'tdee-calculator', 'water-intake-calculator'],
  about: `Macronutrients are protein, carbohydrates, and fat — the three nutrients that provide your body with energy. Tracking macros (rather than just calories) gives you more control over your body composition because each macronutrient serves a different physiological role: protein repairs and builds tissue, carbohydrates fuel exercise, and fat supports hormone production and fat-soluble vitamin absorption.

The optimal macro ratio depends on your goal. Muscle gain benefits from higher protein (1.8–2.2 g/kg of body weight) with enough carbohydrates to fuel training. Fat loss works best with high protein to preserve lean mass during a caloric deficit. Endurance athletes often need higher carbohydrate ratios than strength athletes.

These ratios are starting points. Your response to different macro splits is individual — some people thrive on lower carbs while others perform better with higher carbohydrate intake. Track your results over 4–6 weeks before making significant changes.`
},
  {
  id: 'water-intake',
  slug: 'water-intake-calculator',
  cat: 'health',
  name: 'Water Intake',
  icon: '💧',
  desc: 'Daily water needs by weight, activity & climate',
  popular: false,
  hasChart: false,
  isNew: true,
  formula: 'Base = Weight(kg) × 35ml\n' +
    'Adjusted for activity (+300-1000ml) and climate (+300-500ml)',
  tips: [
    'Thirst is a late indicator of dehydration — drink water on schedule, not just when thirsty.'
  ],
  intro: 'Your daily water requirement is not a fixed number — it changes based on your body weight, how much you exercise, and the climate you live in. This calculator uses a weight-proportional base intake (35 ml/kg) and adjusts it upward for physical activity and hot or humid environments, giving you a personalized daily hydration target rather than the generic "8 glasses a day."',
  workedExample: {
    title: 'Daily water intake for a 75 kg man who exercises in a warm climate',
    inputs: ['Body weight: 75 kg', 'Activity level: Moderately active (1 hour exercise daily)', 'Climate: Hot (>25°C average)'],
    steps: [
      'Base intake: 75 kg × 35 ml = 2,625 ml (2.6 L)',
      'Add for moderate exercise (45–60 min): +500 ml',
      'Add for hot climate: +400 ml',
      'Total: 2,625 + 500 + 400 = 3,525 ml'
    ],
    result: 'Recommended daily intake: approximately 3.5 litres (about 14 standard glasses of water). This accounts for exercise sweat loss and elevated ambient temperature.'
  },
  relatedCalculators: ['calorie-calculator', 'bmr-calculator', 'tdee-calculator'],
  about: `Water makes up about 60% of the adult human body and is involved in virtually every physiological process — from nutrient transport and joint lubrication to temperature regulation and waste elimination. Even mild dehydration (1–2% of body weight) measurably impairs cognitive performance, physical endurance, and mood.

The commonly cited "8 glasses a day" is not based on scientific evidence for any specific individual. Actual needs depend on body size, sweat rate, diet (foods contribute roughly 20% of daily water intake), and environment. Athletes in hot conditions can need 3–4 times more water than sedentary people in cool climates.

Urine color is a practical hydration indicator: pale straw yellow means adequate hydration, dark yellow suggests dehydration, and clear usually indicates over-hydration. Aim for pale yellow throughout most of the day.`
},
  {
  id: 'heart-rate',
  slug: 'heart-rate-calculator',
  cat: 'health',
  name: 'Heart Rate Zones',
  icon: '❤️',
  desc: '5 training zones using Karvonen formula',
  popular: false,
  hasChart: false,
  isNew: false,
  formula: 'Target HR = Resting HR + (% × HRR)\nHRR = Max HR (220 - age) - Resting HR',
  tips: [
    'Zone 2 training (60-70% HRR) builds aerobic base and maximizes fat oxidation.',
    'The 220-age formula has ~10 bpm error margin — a lab VO2 max test gives your true max HR.'
  ],
  intro: 'Heart rate training zones help you exercise at the right intensity to achieve specific goals — whether that\'s building aerobic endurance, burning fat efficiently, or improving cardiovascular fitness. This calculator uses the Karvonen formula, which incorporates your resting heart rate for more personalized zones than simple percentage-of-maximum calculations.',
  workedExample: {
    title: 'Heart rate zones for a 32-year-old with resting HR of 58 bpm',
    inputs: ['Age: 32', 'Resting heart rate: 58 bpm'],
    steps: [
      'Estimated max HR: 220 − 32 = 188 bpm',
      'Heart Rate Reserve (HRR): 188 − 58 = 130 bpm',
      'Zone 1 (50–60% HRR): 58 + (0.50×130) to 58 + (0.60×130) = 123–136 bpm',
      'Zone 2 (60–70% HRR): 136–149 bpm — fat-burning / aerobic base',
      'Zone 3 (70–80% HRR): 149–162 bpm — aerobic conditioning',
      'Zone 4 (80–90% HRR): 162–175 bpm — threshold training',
      'Zone 5 (90–100% HRR): 175–188 bpm — VO2 max intervals'
    ],
    result: 'For Zone 2 aerobic base training, this person should keep their heart rate between 136–149 bpm. This is the zone most associated with cardiovascular health improvements and fat oxidation.'
  },
  relatedCalculators: ['running-pace-calculator', 'vo2-max-calculator', 'calories-burned-calculator'],
  about: `Heart rate zones are intensity ranges tied to specific physiological adaptations. Training consistently in the right zone determines whether you\'re building aerobic capacity, burning fat, or developing speed — all at different heart rate intensities.

The Karvonen formula improves on simple max-HR percentage methods by using your Heart Rate Reserve (HRR) — the range between resting and maximum heart rate. Because a fit person with a low resting HR has a different physiological capacity than someone with a high resting HR at the same age, the Karvonen method produces more personalized zone boundaries.

A common mistake is training too hard. Research consistently shows that 80% of training volume should be in Zones 1–2 (low intensity), with only 20% in higher zones. This polarized approach builds aerobic base, reduces injury risk, and leads to better long-term performance improvements.`
},
  {
  id: 'pregnancy',
  slug: 'pregnancy-due-date',
  cat: 'health',
  name: 'Pregnancy Due Date',
  icon: '👶',
  desc: "Due date via Naegele's Rule with milestone tracker",
  popular: false,
  hasChart: false,
  isNew: false,
  formula: 'EDD = LMP + 280 days (40 weeks)\n' +
    "Naegele's Rule: LMP + 1 year - 3 months + 7 days",
  tips: [
    "Only ~5% of babies arrive on their exact due date. A 'normal' full-term delivery is 37-42 weeks."
  ],
  intro: 'This calculator estimates your baby\'s due date using Naegele\'s Rule — the standard obstetric formula that adds 280 days (40 weeks) to the first day of your last menstrual period. Alongside the estimated due date, it shows key pregnancy milestones by trimester so you know what to expect at each stage.',
  workedExample: {
    title: "Calculating due date from last menstrual period",
    inputs: ['Last Menstrual Period (LMP): March 10, 2025', 'Average cycle length: 28 days'],
    steps: [
      "Apply Naegele's Rule: LMP + 280 days",
      "March 10, 2025 + 280 days = December 15, 2025",
      "Alternative method: LMP + 1 year − 3 months + 7 days",
      "= March 10, 2026 − 3 months + 7 days = December 17, 2025 (minor rounding difference)",
      "First trimester ends: ~June 16, 2025 (week 12)",
      "Second trimester ends: ~September 22, 2025 (week 27)",
      "Full term window: November 24 – December 29, 2025 (37–42 weeks)"
    ],
    result: 'Estimated Due Date: December 15–17, 2025. Expect delivery anytime between late November and late December — only about 5% of babies arrive on the exact due date.'
  },
  relatedCalculators: ['ovulation-calculator', 'period-calculator', 'age-calculator'],
  about: `Naegele's Rule has been the standard method for calculating due dates since the 1800s, named after German obstetrician Franz Karl Naegele. The rule assumes a 28-day cycle with ovulation on day 14 — which is an average, not a universal reality. Women with longer or shorter cycles may have due dates that differ slightly from this calculation.

The 40-week timeline is counted from the LMP, not from conception. Since ovulation typically occurs about 14 days into the cycle, fertilization usually happens around the start of week 3. This means a fetus is actually about 38 weeks old at the time of a "40-week" due date.

Most healthcare providers confirm the due date with an early ultrasound (before 14 weeks), which can measure fetal crown-to-rump length to give a more accurate gestational age estimate. The LMP-based calculation and ultrasound measurement together give the most reliable due date.`
},
  {
  id: 'one-rep-max',
  slug: 'one-rep-max-calculator',
  cat: 'health',
  name: 'One Rep Max',
  icon: '🏋️',
  desc: '1RM via 3 formulas + full training percentage table',
  popular: false,
  hasChart: false,
  isNew: false,
  formula: 'Epley: 1RM = Weight × (1 + Reps/30)\nBrzycki: 1RM = Weight × 36/(37 - Reps)',
  tips: [
    'Train at 70-85% of 1RM for hypertrophy (muscle growth) and 85-95% for maximum strength development.'
  ],
  intro: 'Your One Rep Max (1RM) is the maximum weight you can lift for a single repetition with proper form — the gold standard for measuring strength. Rather than attempting a true max lift (which carries injury risk), this calculator estimates it from a submaximal set using three established formulas, then generates a full training percentage table for programming your workouts.',
  workedExample: {
    title: 'Estimating 1RM from a 5-rep set at 100 kg',
    inputs: ['Weight lifted: 100 kg', 'Reps completed: 5'],
    steps: [
      'Epley formula: 1RM = 100 × (1 + 5/30) = 100 × 1.167 = 116.7 kg',
      'Brzycki formula: 1RM = 100 × 36 / (37 − 5) = 100 × 36/32 = 112.5 kg',
      'Lombardi formula: 1RM = 100 × 5^0.10 = 100 × 1.175 = 117.5 kg',
      'Average of three formulas: (116.7 + 112.5 + 117.5) / 3 ≈ 115.6 kg',
      'Training percentages from 115.6 kg: 70% = 80.9 kg | 80% = 92.5 kg | 90% = 104.0 kg'
    ],
    result: 'Estimated 1RM: approximately 115–117 kg. For hypertrophy training (75%), use about 87 kg for working sets.'
  },
  relatedCalculators: ['calories-burned-calculator', 'protein-intake-calculator', 'lean-body-mass-calculator'],
  about: `One Rep Max testing provides the foundation for evidence-based strength programming. Once you know your 1RM, you can prescribe specific training loads as percentages — rather than guessing whether a weight "feels hard enough."

The three formulas (Epley, Brzycki, Lombardi) each produce slightly different estimates. Accuracy is highest when the rep count is 1–5; beyond 10 reps, the formulas diverge significantly and become less reliable. For best results, test with a weight you can lift for 3–6 reps with excellent form.

True 1RM testing should only be performed by experienced lifters with proper warmup and a spotter. Submaximal estimation provides a safer and often sufficient alternative for most training contexts.`
},
  {
  id: 'period',
  slug: 'period-calculator',
  cat: 'health',
  name: 'Period & Cycle Calculator',
  icon: '🌸',
  desc: 'Adaptive cycle prediction with ovulation window, fertile days, phase visualization, irregular cycle detection & health insights',
  popular: true,
  hasChart: false,
  isNew: true,
  tips: [
    'Cycle length varies naturally 21–35 days. 28 days is the statistical average, not the rule.',
    'Tracking 3+ past cycles lets the engine personalize your fertile window prediction.',
    'Ovulation usually occurs 14 days BEFORE your next period — not 14 days after your last one.'
  ],
  intro: 'This period and cycle calculator predicts future menstrual periods, identifies your ovulation window and fertile days, and visualizes each phase of your cycle. It adapts to irregular cycles by analyzing your actual cycle history — giving more accurate predictions for those whose cycles don\'t conform to the textbook 28-day model.',
  workedExample: {
    title: 'Predicting next period and fertile window for a 30-day average cycle',
    inputs: ['Last period start: April 5, 2025', 'Average cycle length: 30 days', 'Average period duration: 5 days'],
    steps: [
      'Next period start: April 5 + 30 days = May 5, 2025',
      'Ovulation estimate: May 5 − 14 days = April 21, 2025',
      'Fertile window: April 16–22 (ovulation day −5 to +1)',
      'Follicular phase: April 10 – April 20 (post-menstruation to ovulation)',
      'Luteal phase: April 22 – May 4 (post-ovulation to next period)'
    ],
    result: 'Next period expected: May 5. Peak fertility around April 21. Fertile window spans April 16–22. The luteal phase (fixed ~14 days) is the most consistent part of every cycle.'
  },
  relatedCalculators: ['ovulation-calculator', 'pregnancy-due-date', 'due-date-calculator'],
  about: `The menstrual cycle is regulated by a complex interplay of hormones — estrogen, progesterone, FSH, and LH — that orchestrate follicle development, ovulation, and either implantation preparation or shedding of the uterine lining. Understanding your cycle phases gives you useful information for fertility planning, recognizing hormonal patterns, and monitoring changes that might warrant medical attention.

Cycle length varies naturally from person to person and from cycle to cycle. A normal range is 21–35 days, with most variation occurring in the follicular phase (before ovulation). The luteal phase — from ovulation to the next period — is remarkably consistent at approximately 14 days across most individuals.

Tracking three or more cycles provides enough data to calculate your personal average and identify irregularities. Cycles consistently outside the 21–35 day range, or periods that are unusually heavy or painful, are worth discussing with a healthcare provider.`
},
  {
  id: 'ovulation',
  slug: 'ovulation-calculator',
  cat: 'health',
  name: 'Ovulation Calculator',
  icon: '🌿',
  desc: 'Predict your ovulation date and fertile window based on your cycle length',
  popular: true,
  hasChart: false,
  isNew: true,
  formula: 'Ovulation Day = LMP + (Cycle Length - 14 days)\n' +
    'Fertile Window = Ovulation Day -5 to +1',
  tips: [
    'Sperm can survive up to 5 days, but eggs only 12–24 hours — the fertile window is wider than ovulation itself.',
    'Ovulation timing varies even in regular cycles — track 3+ months for best accuracy.'
  ],
  intro: 'Ovulation is the release of a mature egg from the ovary — the single event that makes conception possible each cycle. This calculator predicts your estimated ovulation date and the 6-day fertile window surrounding it based on your last period and typical cycle length. It\'s a practical starting point for natural family planning or for couples trying to conceive.',
  workedExample: {
    title: 'Ovulation prediction for a 26-day cycle',
    inputs: ['First day of last period: May 1, 2025', 'Cycle length: 26 days'],
    steps: [
      'Estimated ovulation: LMP + (Cycle Length − 14) = May 1 + (26 − 14) = May 1 + 12 = May 13',
      'Fertile window start: May 13 − 5 days = May 8 (sperm can survive 5 days)',
      'Fertile window end: May 13 + 1 day = May 14 (egg viable 12–24 hours after release)',
      'Peak fertility days: May 12–13 (2 days around ovulation)',
      'Next period expected: May 1 + 26 = May 27, 2025'
    ],
    result: 'Ovulation estimated May 13. Fertile window: May 8–14. For best conception chances, plan intercourse on May 11, 12, and 13.'
  },
  relatedCalculators: ['pregnancy-due-date', 'period-calculator', 'due-date-calculator'],
  about: `Ovulation occurs when a surge in luteinizing hormone (LH) triggers the release of a mature egg from the dominant follicle, usually 12–16 days before the next menstrual period. This timing is more consistent than counting forward from the last period, which is why cycle length matters for accurate prediction.

The fertile window spans about 6 days: five days before ovulation (because sperm can survive in the reproductive tract) plus the day of ovulation itself. The day before and the day of ovulation carry the highest pregnancy probability — roughly 25–30% per cycle in healthy couples.

Calendar-based ovulation prediction works best for women with regular cycles. For more precise timing, ovulation predictor kits (OPKs) detect the LH surge 12–36 hours before ovulation, while basal body temperature (BBT) charting confirms ovulation has occurred after the fact.`
},
  {
  id: 'fertility',
  slug: 'fertility-window-calculator',
  cat: 'health',
  name: 'Fertile Window Calculator',
  icon: '🌱',
  desc: 'Calculate your exact fertile days for natural conception planning',
  popular: false,
  hasChart: false,
  isNew: true,
  tips: [
    'Peak fertility is the 2 days around ovulation. The full fertile window spans up to 6 days.',
    'Use alongside ovulation predictor kits for highest accuracy.'
  ],
  intro: 'The fertile window is the limited number of days each cycle when conception is possible. This calculator identifies your exact fertile days based on your cycle pattern, highlighting peak fertility days separately from the broader window — so you can focus timing on the highest-probability days.',
  workedExample: {
    title: 'Fertile window for a 32-day cycle starting June 1',
    inputs: ['LMP start: June 1, 2025', 'Cycle length: 32 days'],
    steps: [
      'Estimated ovulation: June 1 + (32 − 14) = June 19',
      'Full fertile window: June 14 – June 20 (days 14–20 of cycle)',
      'Peak fertility: June 18–19 (day before + day of ovulation)',
      'Next period: July 3, 2025'
    ],
    result: 'Fertile window: June 14–20. Peak days: June 18–19. Intercourse on June 17, 18, and 19 gives the highest probability of conception.'
  },
  relatedCalculators: ['ovulation-calculator', 'pregnancy-due-date', 'period-calculator'],
  about: `A woman can only conceive during a narrow window each cycle. Sperm viability in the female reproductive tract (up to 5 days) and egg viability after ovulation (12–24 hours) define this window. Understanding it is useful both for those trying to conceive and for those practicing fertility awareness as contraception.

The calculator uses the standard formula: ovulation occurs approximately 14 days before the next expected period, regardless of cycle length. This means that in a 35-day cycle, ovulation happens around day 21 — not day 14 as it would in a 28-day cycle.

For contraception purposes, calendar-based methods alone have a relatively high failure rate (estimated 10–25% typical use per year). They work best when combined with BBT charting, cervical mucus observation, and OPK testing.`
},
  {
  id: 'implantation',
  slug: 'implantation-calculator',
  cat: 'health',
  name: 'Implantation Calculator',
  icon: '🔬',
  desc: 'Estimate your implantation window — when a fertilized egg attaches to the uterus',
  popular: false,
  hasChart: false,
  isNew: true,
  formula: 'Implantation Window = Ovulation Day + 6 to 12 days',
  tips: [
    'Implantation typically occurs 6–12 days after ovulation. Light spotting during this window is normal.'
  ],
  intro: 'Implantation is the process by which a fertilized egg (blastocyst) embeds itself in the uterine wall — a prerequisite for pregnancy. This calculator estimates the implantation window based on your ovulation date, helping you understand when implantation spotting might occur and when a pregnancy test is likely to become positive.',
  workedExample: {
    title: 'Implantation window from a May 15 ovulation date',
    inputs: ['Estimated ovulation date: May 15, 2025'],
    steps: [
      'Implantation window: Ovulation + 6 to 12 days',
      'Earliest possible: May 15 + 6 = May 21',
      'Latest likely: May 15 + 12 = May 27',
      'Most common timing: 8–10 days post-ovulation = May 23–25',
      'hCG detectable (blood test): approximately May 25–27',
      'Home pregnancy test reliable: approximately May 27–29 (12–14 days post-ovulation)'
    ],
    result: 'Implantation window: May 21–27. Earliest reliable pregnancy test: approximately May 27. Testing before this often gives false negatives due to insufficient hCG levels.'
  },
  relatedCalculators: ['ovulation-calculator', 'pregnancy-due-date', 'period-calculator'],
  about: `After fertilization in the fallopian tube, the embryo travels toward the uterus over 5–7 days, developing from a zygote into a blastocyst. Implantation occurs when this blastocyst burrows into the endometrial lining, typically 6–12 days after ovulation.

During implantation, some women experience light spotting or cramping — called implantation bleeding. This is distinct from a menstrual period: it's lighter, shorter (a day or two), and occurs a week or more before a missed period. Not all women experience this, and its absence does not indicate failed implantation.

The pregnancy hormone hCG begins rising after implantation. Home pregnancy tests detect hCG in urine, but levels are often too low to register positive until 12–14 days after ovulation — around the time of a missed period. Testing earlier can produce false negatives even when pregnancy has occurred.`
},
  {
  id: 'sleep',
  slug: 'sleep-calculator',
  cat: 'health',
  name: 'Sleep Calculator',
  icon: '😴',
  desc: 'Calculate ideal bedtimes and wake times based on 90-min REM sleep cycles',
  popular: true,
  hasChart: false,
  isNew: true,
  formula: 'Optimal Wake = Bedtime + (90min × N cycles) + 14min sleep onset\n' +
    'Recommended: 5–6 cycles (7.5–9 hours)',
  tips: [
    'Each sleep cycle is ~90 minutes. Waking mid-cycle causes grogginess.',
    'Adults need 7–9 hours (5–6 cycles). Teens need 8–10 hours.'
  ],
  intro: 'Sleep quality is determined not just by duration, but by when you wake up within your sleep cycle. Waking mid-cycle — when you\'re in deep sleep or REM — causes the grogginess known as sleep inertia. This calculator identifies optimal bedtimes and wake times aligned to complete 90-minute sleep cycles, so you wake at the lightest sleep stage feeling refreshed.',
  workedExample: {
    title: 'Finding the best bedtime to wake up at 6:30 AM',
    inputs: ['Target wake time: 6:30 AM', 'Average sleep onset time: 14 minutes'],
    steps: [
      'Working backwards from 6:30 AM in 90-minute increments + 14 min onset:',
      '6 cycles (9 hours): Bedtime = 6:30 AM − 9 hrs − 14 min = 9:16 PM',
      '5 cycles (7.5 hours): Bedtime = 6:30 AM − 7.5 hrs − 14 min = 10:46 PM',
      '4 cycles (6 hours): Bedtime = 6:30 AM − 6 hrs − 14 min = 12:16 AM',
      'Recommended options: 9:16 PM (ideal) or 10:46 PM (practical for most adults)'
    ],
    result: 'Best bedtimes for a 6:30 AM wake: 9:16 PM (6 cycles, 9 hrs) or 10:46 PM (5 cycles, 7.5 hrs). Waking at 6:30 AM from either of these bedtimes aligns with the end of a complete sleep cycle.'
  },
  relatedCalculators: ['age-calculator', 'running-pace-calculator', 'heart-rate-calculator'],
  about: `Sleep cycles last approximately 90 minutes each and consist of four stages: three non-REM stages (light sleep, deeper sleep, and deep restorative sleep) followed by REM sleep. A full night's sleep for adults cycles through this pattern 5–6 times. The proportion of deep sleep is highest in the first half of the night; REM sleep dominates in the second half.

Waking during deep sleep triggers sleep inertia — the groggy, disoriented feeling that can persist for 30–60 minutes. Timing your alarm to the end of a complete cycle, when you're in the lightest sleep stage, allows you to wake feeling naturally alert. The 14-minute sleep onset estimate is based on average sleep latency data, though individuals vary widely.

Chronotype — whether you\'re naturally a morning or evening person — is partly genetic. Forcing a chronotype to dramatically different sleep times can disrupt circadian rhythms. The most effective sleep improvements usually combine consistent wake times (even on weekends) with light exposure management in the morning.`
},
  {
  id: 'calories-burned',
  slug: 'calories-burned-calculator',
  cat: 'health',
  name: 'Calories Burned',
  icon: '🏃',
  desc: 'Calories burned by 30+ exercises using MET values and body weight',
  popular: true,
  hasChart: true,
  isNew: true,
  formula: 'Calories = MET × Weight(kg) × Duration(hours)',
  tips: [
    'MET (Metabolic Equivalent of Task) measures exercise intensity. Running at 8km/h = MET 8, walking = MET 3.5.'
  ],
  intro: 'The calories burned calculator uses MET (Metabolic Equivalent of Task) values — a standardized measure of exercise intensity — combined with your body weight and workout duration to estimate energy expenditure. With 30+ activities available, it lets you compare the caloric cost of different exercises side by side and plan workouts against your calorie goals.',
  workedExample: {
    title: 'Calories burned during a 45-minute run at moderate pace',
    inputs: ['Exercise: Running at 8 km/h (MET = 8.0)', 'Body weight: 75 kg', 'Duration: 45 minutes (0.75 hours)'],
    steps: [
      'Calories = MET × Weight (kg) × Duration (hours)',
      'Calories = 8.0 × 75 × 0.75',
      '= 450 kcal',
      'Compare: 45 min cycling (MET 6.8): 6.8 × 75 × 0.75 = 382.5 kcal',
      'Compare: 45 min swimming (MET 7.0): 7.0 × 75 × 0.75 = 393.75 kcal'
    ],
    result: 'A 75 kg person burns approximately 450 kcal running at 8 km/h for 45 minutes. Running burns more calories per minute than cycling or swimming at comparable perceived effort.'
  },
  relatedCalculators: ['running-pace-calculator', 'calorie-calculator', 'tdee-calculator', 'heart-rate-calculator'],
  about: `The MET system was developed to standardize the measurement of physical activity across research studies. A MET of 1.0 represents your resting metabolic rate (sitting quietly). An activity with MET = 8 requires 8 times that energy expenditure — which is why running burns far more calories than walking per unit of time.

MET-based calorie estimates include both the exercise calorie burn and the resting metabolic rate during that period. They do not account for the excess post-exercise oxygen consumption (EPOC) — the elevated calorie burn that continues for hours after intense exercise. High-intensity workouts like HIIT can extend EPOC significantly.

Body weight has a direct impact on calorie burn: heavier individuals burn more calories doing the same activity at the same intensity. This is built into the MET formula. As you lose weight, your calorie burn per session decreases — which is one reason weight loss tends to slow over time even with consistent exercise.`
},
  {
  id: 'body-type',
  slug: 'body-type-calculator',
  cat: 'health',
  name: 'Body Type Calculator',
  icon: '🧬',
  desc: 'Determine your somatotype (ectomorph, mesomorph, endomorph) with training advice',
  popular: false,
  hasChart: false,
  isNew: true,
  intro: 'Somatotype theory classifies body types into three categories — ectomorph, mesomorph, and endomorph — each with characteristic metabolic tendencies and responses to training. This calculator identifies your predominant somatotype from physical measurements and provides training and nutrition guidance tailored to your body\'s natural tendencies.',
  workedExample: {
    title: 'Identifying somatotype for a 5\'11" male with typical endomorph measurements',
    inputs: ['Height: 180 cm', 'Wrist circumference: 18 cm (large frame)', 'Weight: 95 kg', 'Difficulty losing weight: Yes', 'Builds strength easily: Yes'],
    steps: [
      'Frame size indicator: wrist/height ratio = 18/180 = 0.10 → large frame',
      'Weight relative to height: 95 kg at 180 cm → above typical range',
      'Self-reported traits: gains fat easily, builds strength readily',
      'Somatotype assessment: Predominantly endomorph with mesomorph secondary'
    ],
    result: 'Endomorph-dominant with mesomorph traits. Training recommendation: higher frequency cardio (3–4x/week), caloric deficit with high protein intake, and compound strength training to preserve and build muscle while reducing fat mass.'
  },
  relatedCalculators: ['bmi-calculator', 'body-fat-calculator', 'calorie-calculator', 'macro-calculator'],
  about: `Somatotype theory was developed by psychologist William Sheldon in the 1940s as a framework for categorizing physiques. While Sheldon's original work (which linked body types to personality traits) has been largely discredited, the three-category physical classification remains a useful heuristic for understanding metabolic tendencies.

Ectomorphs tend to be lean and long-limbed with fast metabolisms — they find it difficult to gain weight or build muscle. Mesomorphs are naturally muscular and respond quickly to both strength training and fat loss. Endomorphs carry more body fat naturally and have slower metabolisms but often build strength readily.

Most people are a blend of two somatotypes. The value of identifying your dominant type is not to set limits, but to inform your starting approach to training and diet. An endomorph and an ectomorph with identical fitness goals will benefit from quite different calorie targets and exercise programming.`
},
  {
  id: 'gfr',
  slug: 'gfr-calculator',
  cat: 'health',
  name: 'GFR Calculator',
  icon: '🫀',
  desc: 'Glomerular filtration rate (kidney function) using CKD-EPI formula',
  popular: false,
  hasChart: false,
  isNew: true,
  intro: 'Glomerular Filtration Rate (GFR) measures how well your kidneys are filtering waste from the blood — the key indicator of kidney function used to stage chronic kidney disease (CKD). This calculator uses the CKD-EPI formula (the current clinical standard) to estimate your eGFR from serum creatinine, age, and sex.',
  workedExample: {
    title: 'eGFR calculation for a 58-year-old woman with creatinine of 1.1 mg/dL',
    inputs: ['Age: 58', 'Sex: Female', 'Serum creatinine: 1.1 mg/dL'],
    steps: [
      'CKD-EPI formula (female, creatinine > 0.7 mg/dL):',
      'eGFR = 142 × (Cr/0.7)^-1.200 × (0.9938)^Age × 1.012',
      '= 142 × (1.1/0.7)^-1.200 × (0.9938)^58 × 1.012',
      '= 142 × (1.571)^-1.200 × 0.6988 × 1.012',
      '= 142 × 0.601 × 0.6988 × 1.012 ≈ 60.3 mL/min/1.73m²'
    ],
    result: 'eGFR ≈ 60 mL/min/1.73m². This places kidney function at CKD Stage G3a (mildly to moderately decreased). Values above 60 are considered adequate; below 15 indicates kidney failure requiring renal replacement therapy.'
  },
  relatedCalculators: ['bmi-calculator', 'age-calculator'],
  about: `The glomerular filtration rate is the volume of fluid filtered by the kidneys per unit time — measured in milliliters per minute per 1.73 m² of body surface area. Because directly measuring GFR requires infusing traceable substances, clinical practice uses estimated GFR (eGFR) derived from serum creatinine, a metabolic waste product the kidneys normally clear.

The CKD-EPI equation (Chronic Kidney Disease Epidemiology Collaboration, 2021 revision) is the current KDIGO guideline-recommended formula. It replaced the older MDRD formula because it's more accurate at higher GFR values (above 60). The 2021 race-free version removed race as a variable, following concerns that the prior coefficient created health disparities.

GFR naturally declines with age — typically by about 1 mL/min/1.73m² per year after age 40. Values above 90 are normal; 60–89 indicates mildly decreased function; below 60 for more than 3 months defines CKD. This calculator is intended for informational awareness, not clinical diagnosis — consult your doctor for interpretation of your creatinine results.`
},
  {
  id: 'bsa',
  slug: 'bsa-calculator',
  cat: 'health',
  name: 'BSA Calculator',
  icon: '👤',
  desc: 'Body Surface Area using Mosteller, DuBois and Haycock formulas with drug dosage reference',
  popular: false,
  hasChart: true,
  isNew: true,
  formula: 'Mosteller: BSA = √(Height(cm) × Weight(kg) / 3600)',
  intro: 'Body Surface Area (BSA) is used in clinical medicine to scale drug doses — particularly chemotherapy, cardiac medications, and pediatric dosing — because it correlates better with many physiological parameters than body weight alone. This calculator computes BSA using three established formulas (Mosteller, DuBois, and Haycock) and displays drug dosage reference information.',
  workedExample: {
    title: 'BSA calculation for a 170 cm, 70 kg adult',
    inputs: ['Height: 170 cm', 'Weight: 70 kg'],
    steps: [
      'Mosteller: BSA = √(170 × 70 / 3600) = √(11900/3600) = √3.306 = 1.818 m²',
      'DuBois: BSA = 0.007184 × 170^0.725 × 70^0.425 = 0.007184 × 58.77 × 6.83 = 1.806 m²',
      'Haycock: BSA = 0.024265 × 170^0.3964 × 70^0.5378 = 0.024265 × 7.08 × 10.71 = 1.841 m²',
      'Average across formulas: ~1.82 m²'
    ],
    result: 'BSA approximately 1.81–1.84 m². The Mosteller formula (1.82 m²) is the simplest to calculate and widely used in oncology dosing. Average adult BSA is approximately 1.73 m² (the value used in GFR normalization).'
  },
  relatedCalculators: ['bmi-calculator', 'gfr-calculator', 'ideal-weight-calculator'],
  about: `Body Surface Area estimation is a staple of clinical pharmacology. The concept was formalized by DuBois and DuBois in 1916, who observed that many physiological variables (cardiac output, renal function, metabolic rate) scale better with surface area than with body weight. Their original formula remains in use today alongside newer derivations.

The Mosteller formula (1987) gained widespread adoption in oncology because it's easy to compute mentally — just multiply height by weight, divide by 3600, and take the square root. The Haycock formula (1978) is particularly accurate for pediatric patients. No formula works perfectly across all body sizes and shapes, particularly in obesity where actual and estimated BSA can diverge significantly.

BSA-based drug dosing is most important for cytotoxic agents with narrow therapeutic windows, where under-dosing reduces efficacy and over-dosing causes serious toxicity. Your oncologist or pharmacist will always verify BSA calculations independently before prescribing.`
},
  {
  id: 'bac',
  slug: 'bac-calculator',
  cat: 'health',
  name: 'BAC Calculator',
  icon: '🍺',
  desc: 'Blood Alcohol Content by drink type with legal limits, time-to-sober chart and safety tips',
  popular: false,
  hasChart: true,
  isNew: true,
  formula: 'BAC = (Alcohol grams / (Body weight × r)) - (0.015 × Hours)\nr = 0.68 for men, 0.55 for women',
  tips: [
    'Your liver clears ~0.015% BAC per hour. A BAC of 0.08% takes 5-6 hours to clear.'
  ],
  intro: 'Blood Alcohol Content (BAC) is the concentration of alcohol in your bloodstream, expressed as a percentage. This calculator estimates your BAC based on the number and type of drinks, your body weight, sex, and time since drinking — and shows you how long until you reach legal driving limits and full sobriety.',
  workedExample: {
    title: 'BAC estimate for a 70 kg man after 3 beers in 2 hours',
    inputs: ['Sex: Male', 'Body weight: 70 kg', 'Drinks: 3 standard beers (355 ml, 5% ABV each)', 'Time elapsed: 2 hours'],
    steps: [
      'Alcohol in each beer: 355 ml × 0.05 × 0.789 g/ml = 14.0 g per beer',
      'Total alcohol: 3 × 14.0 = 42.0 g',
      'Distribution factor (r) for men = 0.68',
      'Widmark formula (peak BAC): 42.0 / (70,000 g × 0.68) = 0.000883 = 0.088%',
      'Subtract elimination: 0.015% × 2 hours = 0.030%',
      'Estimated BAC after 2 hours: 0.088% − 0.030% = 0.058%'
    ],
    result: 'Estimated BAC: 0.058% after 2 hours — below the 0.08% US legal driving limit but still impairing judgment and reaction time. Full sobriety from 0.088% peak takes approximately 5.9 hours from the last drink.'
  },
  relatedCalculators: ['age-calculator', 'calorie-calculator'],
  about: `The Widmark formula, developed by Swedish scientist Erik Widmark in the 1920s, remains the foundation of BAC estimation in forensic science and medicine. It uses a volume of distribution factor (r) that differs between males and females because women generally have proportionally less body water — causing alcohol to be more concentrated in their bloodstream at the same intake.

BAC affects different people differently depending on tolerance, food intake, hydration, genetics, and medications. This calculator provides estimates based on population averages — individual BAC can vary by ±30% from these figures.

Even at BAC levels below legal driving limits, reaction time and judgment are measurably impaired from the very first drink. The "legal limit" defines criminal liability, not the threshold of impairment. The only reliable way to sober up is time — coffee, food, and water do not accelerate alcohol metabolism.`
},
  {
  id: 'lean-body-mass',
  slug: 'lean-body-mass-calculator',
  cat: 'health',
  name: 'Lean Body Mass',
  icon: '💪',
  desc: 'Lean muscle mass using Boer, James and Hume formulas with fat vs lean body composition chart',
  popular: false,
  hasChart: true,
  isNew: true,
  formula: 'LBM = Weight × (1 - Body Fat%)',
  intro: 'Lean Body Mass (LBM) is everything in your body that isn\'t fat — muscle, bone, organs, blood, and water. Knowing your LBM is more actionable than total body weight for fitness goals, since it tells you how much metabolically active tissue you have, informs protein targets, and helps track whether your training is building muscle or just changing scale weight.',
  workedExample: {
    title: 'LBM calculation for a 80 kg man at 20% body fat using multiple formulas',
    inputs: ['Body weight: 80 kg', 'Height: 175 cm', 'Sex: Male', 'Body fat (Navy method): 20%'],
    steps: [
      'Direct method (if body fat % known): LBM = 80 × (1 − 0.20) = 64.0 kg',
      'Boer formula (male): LBM = 0.407 × 80 + 0.267 × 175 − 19.2 = 32.56 + 46.72 − 19.2 = 60.1 kg',
      'James formula (male): LBM = 1.1 × 80 − 128 × (80/175)² = 88 − 128 × 0.209 = 88 − 26.7 = 61.3 kg',
      'Hume formula (male): LBM = 0.3281 × 80 + 0.33929 × 175 − 29.5336 = 26.2 + 59.4 − 29.5 = 56.1 kg'
    ],
    result: 'LBM estimates: 56–64 kg depending on formula. If body fat percentage is known, the direct calculation (64 kg) is most accurate. Formula-based estimates (Boer, James, Hume) are useful when body fat % is unavailable.'
  },
  relatedCalculators: ['body-fat-calculator', 'bmi-calculator', 'protein-intake-calculator', 'ideal-weight-calculator'],
  about: `Lean body mass is one of the most useful metrics for anyone focused on body composition rather than just weight. Because muscle is denser and metabolically more active than fat, two people with the same body weight can have very different LBMs — and very different resting metabolic rates, strength levels, and health risks.

The three formula-based methods (Boer, James, Hume) estimate LBM from height and weight without requiring body fat measurement. They differ in their population validation samples, so results can vary by 3–8 kg between formulas. If you have a reliable body fat percentage from the Navy method or body fat calipers, the direct calculation (Weight × (1 − BF%)) is more accurate than any formula.

Tracking LBM over time — rather than scale weight — is particularly valuable during body recomposition phases where you're building muscle and losing fat simultaneously. Scale weight might stay the same while LBM increases, which represents genuine progress.`
},
  {
  id: 'protein',
  slug: 'protein-calculator',
  cat: 'health',
  name: 'Protein Calculator',
  icon: '🥩',
  desc: 'Daily protein needs by body weight, activity level and goal with food source breakdown',
  popular: false,
  hasChart: true,
  isNew: true,
  formula: 'Protein = Weight(kg) × 1.6-2.2g (active adults)',
  tips: [
    'Athletes need 1.6-2.2g/kg. Aim for 30-40g protein per meal for optimal muscle synthesis.'
  ],
  intro: 'Protein requirements aren\'t one-size-fits-all — they scale with body weight, activity level, age, and your specific goal. This calculator determines your daily protein target in grams using evidence-based ranges, then breaks down how to hit that target across common protein food sources.',
  workedExample: {
    title: 'Daily protein target for a 70 kg woman training for muscle gain',
    inputs: ['Body weight: 70 kg', 'Goal: Muscle gain', 'Activity level: Highly active (5+ days/week resistance training)'],
    steps: [
      'Recommended range for muscle gain: 1.8–2.2 g/kg',
      'Lower target: 1.8 × 70 = 126 g protein/day',
      'Upper target: 2.2 × 70 = 154 g protein/day',
      'Optimal target: 2.0 × 70 = 140 g/day',
      'Distribute across 4 meals: ~35 g per meal',
      'Example: 2 eggs + 150g Greek yogurt (meal 1, ~25g) | 150g chicken breast (meal 2, ~45g) | protein shake (meal 3, ~25g) | 150g salmon (meal 4, ~35g)'
    ],
    result: 'Daily protein target: 126–154 g (aim for 140 g). At 35 g per meal across 4 meals, this fully maximizes muscle protein synthesis throughout the day.'
  },
  relatedCalculators: ['macro-calculator', 'calorie-calculator', 'bmr-calculator', 'tdee-calculator'],
  about: `Protein is the only macronutrient that cannot be stored in a meaningful reserve — the body has no dedicated protein fuel tank the way it stores fat and glycogen. This means daily protein intake needs to be consistent, adequate for your activity level, and ideally distributed across multiple meals to maximize muscle protein synthesis.

The research-backed range of 1.6–2.2 g/kg/day covers most active adults and athletes. Sedentary individuals need less (0.8 g/kg is the minimum RDA), while those in a caloric deficit or older adults benefit from the higher end of the range (2.0–2.4 g/kg) to preserve lean mass. Per-meal distribution matters: 30–40 g per meal optimally stimulates muscle protein synthesis, while eating most protein in one sitting is less efficient.

Plant-based protein sources (legumes, tofu, tempeh, quinoa) are nutritionally adequate but often lower in leucine — the key amino acid triggering muscle synthesis. Vegetarians and vegans typically need to target the upper end of the protein range and combine multiple sources throughout the day.`
},
  {
  id: 'healthy-weight',
  slug: 'healthy-weight-calculator',
  cat: 'health',
  name: 'Healthy Weight Calculator',
  icon: '⚖️',
  desc: 'Healthy weight range using BMI, Hamwi, Devine and Miller formulas with BMI zone chart',
  popular: false,
  hasChart: true,
  isNew: true,
  intro: 'This calculator identifies a healthy weight range for your height using multiple methods — the WHO BMI range (18.5–24.9), and three clinical ideal weight formulas (Hamwi, Devine, and Miller). Showing all methods together helps you understand where there is consensus and where you might set a realistic weight target.',
  workedExample: {
    title: 'Healthy weight range for a 5\'6" (168 cm) woman',
    inputs: ['Sex: Female', 'Height: 168 cm (5 ft 6 in)'],
    steps: [
      'WHO BMI range (18.5–24.9): min = 18.5×(1.68)² = 52.2 kg | max = 24.9×(1.68)² = 70.3 kg',
      'Hamwi formula (female): 45.4 + 2.27 × (inches over 5 ft) = 45.4 + 2.27 × 6 = 59.0 kg',
      'Devine formula (female): 45.5 + 2.3 × (inches over 5 ft) = 45.5 + 13.8 = 59.3 kg',
      'Miller formula (female): 53.1 + 1.36 × (inches over 5 ft) = 53.1 + 8.16 = 61.3 kg'
    ],
    result: 'Healthy weight range: 52–70 kg (WHO BMI). Formula consensus: 59–61 kg as an "ideal" midpoint. A practical target for a 168 cm woman is 56–65 kg, balancing BMI guidelines with formula estimates.'
  },
  relatedCalculators: ['bmi-calculator', 'ideal-weight-calculator', 'body-fat-calculator', 'calorie-calculator'],
  about: `A "healthy weight" is a range, not a single number. The WHO BMI-based range (18.5–24.9) gives a broad window based on population-level cardiovascular risk data. The clinical formulas (Hamwi, Devine, Miller) were developed for specific medical purposes like drug dosing and nutritional planning, and they converge on a narrower midpoint within the BMI range.

None of these approaches are perfect. They don't account for muscle mass distribution, age-related changes in body composition, or ethnicity-based differences in risk thresholds. Some research suggests Asian populations have elevated metabolic risk at BMI values as low as 23, while musculoskeletal athletes may be healthiest at BMI values above 25.

The most practically useful application of this calculator is to establish a target weight range for gradual, sustainable progress. A 1–2 kg monthly change is generally achievable and clinically safe. Dramatic, rapid weight changes — in either direction — carry health risks independent of the goal.`
},
  {
  id: 'fat-intake',
  slug: 'fat-intake-calculator',
  cat: 'health',
  name: 'Fat Intake Calculator',
  icon: '🥑',
  desc: 'Daily fat targets with saturated/unsaturated breakdown and full macro distribution chart',
  popular: false,
  hasChart: true,
  isNew: true,
  tips: [
    '20-35% of total calories from fat is healthy. Keep saturated fat below 10% of calories.'
  ],
  intro: 'Dietary fat plays essential roles in hormone production, brain function, and absorption of fat-soluble vitamins (A, D, E, K) — but not all fats are nutritionally equivalent. This calculator determines your total daily fat target, and breaks it down into saturated, monounsaturated, and polyunsaturated fat recommendations based on your calorie intake and health goals.',
  workedExample: {
    title: 'Daily fat targets for a 2,000 kcal diet',
    inputs: ['Daily calorie target: 2,000 kcal', 'Fat percentage: 30% of calories', 'Health goal: Cardiovascular health'],
    steps: [
      'Total fat calories: 30% × 2000 = 600 kcal from fat',
      'Total fat grams: 600 ÷ 9 kcal/g = 66.7 g total fat',
      'Saturated fat limit (≤10% of calories): ≤200 kcal ÷ 9 = ≤22.2 g saturated fat',
      'Monounsaturated fat (recommended 15–20% of calories): ~333–400 kcal ÷ 9 = 37–44 g',
      'Polyunsaturated fat (remaining): ~55–66 g total − 22 g sat − 37 g MUFA ≈ 7–8 g PUFA'
    ],
    result: 'Daily fat budget: ~67 g total fat. Keep saturated fat under 22 g (avoid butter, fatty red meat, tropical oils in excess). Fill the rest with olive oil, avocado, nuts (MUFA), and fatty fish, walnuts, flaxseed (PUFA/omega-3).'
  },
  relatedCalculators: ['calorie-calculator', 'macro-calculator', 'protein-intake-calculator', 'water-intake-calculator'],
  about: `Dietary fat was once considered primarily harmful, but decades of nutrition research have clarified that fat type matters more than fat quantity. Unsaturated fats — especially omega-3 polyunsaturated fats (found in fatty fish, flaxseed, walnuts) and oleic-acid-rich monounsaturated fats (olive oil, avocados) — are associated with reduced cardiovascular risk and inflammation.

Saturated fats (found in animal products and tropical oils) raise LDL cholesterol in most people, though the effect varies by food source and individual genetics. Trans fats, produced industrially by partial hydrogenation, are the most harmful and have been largely removed from food supplies in many countries following regulatory action.

The WHO recommendation of keeping total fat at 20–35% of calories and saturated fat below 10% is a reasonable guideline for most people. Athletes may benefit from fat intakes at the higher end of this range for sustained energy, while those with specific cardiovascular conditions may be advised to reduce saturated fat further by their physician.`
},
  {
  id: 'army-body-fat',
  slug: 'army-body-fat-calculator',
  cat: 'health',
  name: 'Army Body Fat Calculator',
  icon: '🎖️',
  desc: 'US Army body fat using circumference measurements with pass/fail against age-based regulation limits',
  popular: false,
  hasChart: true,
  isNew: true,
  intro: 'The US Army uses a circumference-based body fat estimation method to assess whether soldiers meet weight and fitness standards as defined in AR 600-9. This calculator applies the official Army formula to compute your body fat percentage and compare it against the age-specific and gender-specific regulatory limits — instantly showing you pass or fail status.',
  workedExample: {
    title: 'Army body fat assessment for a 28-year-old male soldier',
    inputs: ['Age: 28', 'Sex: Male', 'Height: 175 cm (69 in)', 'Neck circumference: 37 cm (14.57 in)', 'Waist circumference: 85 cm (33.46 in)'],
    steps: [
      'Apply Army formula for males:',
      '%BF = 86.010 × log₁₀(waist − neck) − 70.041 × log₁₀(height) + 36.76',
      'Waist − neck = 33.46 − 14.57 = 18.89 in; log₁₀(18.89) = 1.2762',
      'log₁₀(69) = 1.8388',
      '%BF = 86.010 × 1.2762 − 70.041 × 1.8388 + 36.76',
      '= 109.78 − 128.78 + 36.76 = 17.76%'
    ],
    result: 'Body fat: 17.8%. Army standard for males age 22–29: maximum 20%. Result: PASS. Margin: 2.2% under the limit. Males in this age group are considered fully compliant with AR 600-9 at 17.8%.'
  },
  relatedCalculators: ['body-fat-calculator', 'bmi-calculator', 'ideal-weight-calculator', 'waist-hip-ratio-calculator'],
  about: `The US Army body fat assessment is mandated under Army Regulation 600-9 (Army Body Composition Program). Soldiers who exceed height-for-weight screening thresholds are measured using the circumference method, and those who exceed the age- and gender-based body fat limits are entered into a body composition improvement program.

The Army formula is based on the same foundational US Navy research as the standard Navy body fat calculation, with minor coefficient adjustments. It uses neck and waist circumference for men (and adds hip circumference for women) along with height. The logarithmic formula accounts for the non-linear relationship between circumference and actual fat distribution.

Army limits are stricter than general health population norms. For males, limits range from 20% (under 30) to 26% (age 40+). For females, limits range from 30% (under 30) to 36% (40+). These limits are set for readiness and operational performance standards, not minimum health thresholds.`
},
  {
  id: 'conception',
  slug: 'conception-calculator',
  cat: 'health',
  name: 'Conception Calculator',
  icon: '👶',
  desc: 'Estimated conception date from due date or LMP with implantation window and pregnancy milestones',
  popular: false,
  hasChart: false,
  isNew: true,
  intro: 'This calculator works both forward and backward: enter your last menstrual period to estimate when conception likely occurred, or enter your known due date to calculate backward to the probable conception date. It also shows the implantation window and key pregnancy milestones.',
  workedExample: {
    title: 'Estimating conception date from a known due date of February 14, 2026',
    inputs: ['Known due date: February 14, 2026'],
    steps: [
      'Due date − 280 days (Naegele\'s Rule in reverse) = LMP estimate',
      'February 14, 2026 − 280 days = May 10, 2025 (estimated LMP)',
      'Conception date = LMP + 14 days (average ovulation day)',
      'Estimated conception: May 24, 2025',
      'Implantation window: May 30 – June 5, 2025 (6–12 days post-conception)',
      'Earliest positive pregnancy test: approximately June 5–7, 2025'
    ],
    result: 'Estimated conception: around May 24, 2025. LMP estimate: May 10, 2025. Conception dates are estimates — actual conception may differ by several days depending on ovulation timing.'
  },
  relatedCalculators: ['ovulation-calculator', 'pregnancy-due-date', 'period-calculator'],
  about: `Conception occurs when a sperm cell fertilizes an egg, typically within 12–24 hours of ovulation. Because ovulation timing varies and sperm can survive in the reproductive tract for up to 5 days, the exact date of conception is rarely known with certainty — even with timed intercourse.

This calculator estimates conception based on the assumption that ovulation occurred on day 14 of a 28-day cycle. Women with longer or shorter cycles, or irregular ovulation, may have conceptions that fall several days before or after this estimate.

Healthcare providers typically confirm gestational age via ultrasound in the first trimester, which measures fetal crown-to-rump length to determine developmental stage more precisely than calendar methods. The LMP-derived due date and conception estimate are used as starting points until ultrasound data is available.`
},
];
