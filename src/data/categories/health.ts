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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  isNew: true
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
  isNew: true
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
  formula: 'Mosteller: BSA = √(Height(cm) × Weight(kg) / 3600)'
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
  ]
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
  formula: 'LBM = Weight × (1 - Body Fat%)'
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
  ]
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
  isNew: true
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
  ]
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
  isNew: true
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
  isNew: true
},
];
