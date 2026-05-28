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
      about: `Our BMI Calculator offers a straightforward way to check your Body Mass Index against official WHO health risk classifications and ideal weight ranges. Whether you are tracking your fitness journey or working with a healthcare professional, this utility takes the complexity out of finding your healthy range. You can easily plug in your height and weight to instantly see your personalized insights.`
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
      about: `We built the Calorie Calculator specifically to tDEE with 5 goals, 2 formulas, macros & weekly weight projection. By offering a clean, straightforward interface, it empowers users to generate reliable calculations in seconds. Discover exactly how the numbers align and take advantage of our built-in tips and formulas for complete transparency.`
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
      about: `We built the BMR Calculator specifically to mifflin vs Harris-Benedict with TDEE at all 5 activity levels. By offering a clean, straightforward interface, it empowers users to generate reliable calculations in seconds. Discover exactly how the numbers align and take advantage of our built-in tips and formulas for complete transparency.`
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
      about: `If you want to body fat % using US Navy method with category classification, the Body Fat Calculator is your perfect companion. Our advanced online tool replaces tedious manual spreadsheets by delivering instant outputs based on industry-standard formulas. You can use it repeatedly to test different scenarios and optimize your outcomes.`
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
      about: `Whether you're a professional or just looking for quick answers, the Ideal Weight provides an instant solution for your needs. It helps you 4-formula comparison: Devine, Miller, Robinson & Hamwi with BMI range. This specialized tool is designed to eliminate manual computation errors and streamline your workflow with precise, step-by-step breakdowns.`
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
      about: `We built the Macro Calculator specifically to protein/carbs/fat targets by goal with donut chart. By offering a clean, straightforward interface, it empowers users to generate reliable calculations in seconds. Discover exactly how the numbers align and take advantage of our built-in tips and formulas for complete transparency.`
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
      about: `We built the Water Intake specifically to daily water needs by weight, activity & climate. By offering a clean, straightforward interface, it empowers users to generate reliable calculations in seconds. Discover exactly how the numbers align and take advantage of our built-in tips and formulas for complete transparency.`
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
      about: `Stop guessing and start using the Heart Rate Zones to get immediate, accurate data. Specifically engineered to 5 training zones using Karvonen formula, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
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
      about: `The Pregnancy Due Date is an essential resource for anyone needing to due date via Naegeles Rule with milestone tracker. Designed with simplicity and speed in mind, it performs the heavy lifting behind the scenes so you can focus on making informed decisions. It's completely free, requires no signups, and works seamlessly on any device.`
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
      about: `We built the One Rep Max specifically to 1RM via 3 formulas + full training percentage table. By offering a clean, straightforward interface, it empowers users to generate reliable calculations in seconds. Discover exactly how the numbers align and take advantage of our built-in tips and formulas for complete transparency.`
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
      about: `The Period & Cycle Calculator offers a hassle-free way to adaptive cycle prediction with ovulation window, fertile days, phase visualization, irregular cycle detection & health insights. Professionals and students alike rely on this calculator for its accuracy and ease of use. It strips away complicated jargon, letting you find the exact metric you need with just a few simple inputs.`
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
      about: `Stop guessing and start using the Ovulation Calculator to get immediate, accurate data. Specifically engineered to predict your ovulation date and fertile window based on your cycle length, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
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
      about: `The Fertile Window Calculator offers a hassle-free way to calculate your exact fertile days for natural conception planning. Professionals and students alike rely on this calculator for its accuracy and ease of use. It strips away complicated jargon, letting you find the exact metric you need with just a few simple inputs.`
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
      about: `Stop guessing and start using the Implantation Calculator to get immediate, accurate data. Specifically engineered to estimate your implantation window — when a fertilized egg attaches to the uterus, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
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
      about: `The Sleep Calculator offers a hassle-free way to calculate ideal bedtimes and wake times based on 90-min REM sleep cycles. Professionals and students alike rely on this calculator for its accuracy and ease of use. It strips away complicated jargon, letting you find the exact metric you need with just a few simple inputs.`
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
      about: `We built the Calories Burned specifically to calories burned by 30+ exercises using MET values and body weight. By offering a clean, straightforward interface, it empowers users to generate reliable calculations in seconds. Discover exactly how the numbers align and take advantage of our built-in tips and formulas for complete transparency.`
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
      about: `Stop guessing and start using the Body Type Calculator to get immediate, accurate data. Specifically engineered to determine your somatotype (ectomorph, mesomorph, endomorph) with training advice, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
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
      about: `Whether you're a professional or just looking for quick answers, the GFR Calculator provides an instant solution for your needs. It helps you glomerular filtration rate (kidney function) using CKD-EPI formula. This specialized tool is designed to eliminate manual computation errors and streamline your workflow with precise, step-by-step breakdowns.`
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
      about: `Whether you're a professional or just looking for quick answers, the BSA Calculator provides an instant solution for your needs. It helps you body Surface Area using Mosteller, DuBois and Haycock formulas with drug dosage reference. This specialized tool is designed to eliminate manual computation errors and streamline your workflow with precise, step-by-step breakdowns.`
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
      about: `The BAC Calculator is an essential resource for anyone needing to blood Alcohol Content by drink type with legal limits, time-to-sober chart and safety tips. Designed with simplicity and speed in mind, it performs the heavy lifting behind the scenes so you can focus on making informed decisions. It's completely free, requires no signups, and works seamlessly on any device.`
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
      about: `The Lean Body Mass offers a hassle-free way to lean muscle mass using Boer, James and Hume formulas with fat vs lean body composition chart. Professionals and students alike rely on this calculator for its accuracy and ease of use. It strips away complicated jargon, letting you find the exact metric you need with just a few simple inputs.`
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
      about: `We built the Protein Calculator specifically to daily protein needs by body weight, activity level and goal with food source breakdown. By offering a clean, straightforward interface, it empowers users to generate reliable calculations in seconds. Discover exactly how the numbers align and take advantage of our built-in tips and formulas for complete transparency.`
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
      about: `The Healthy Weight Calculator offers a hassle-free way to healthy weight range using BMI, Hamwi, Devine and Miller formulas with BMI zone chart. Professionals and students alike rely on this calculator for its accuracy and ease of use. It strips away complicated jargon, letting you find the exact metric you need with just a few simple inputs.`
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
      about: `The Fat Intake Calculator offers a hassle-free way to daily fat targets with saturated/unsaturated breakdown and full macro distribution chart. Professionals and students alike rely on this calculator for its accuracy and ease of use. It strips away complicated jargon, letting you find the exact metric you need with just a few simple inputs.`
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
      about: `If you want to uS Army body fat using circumference measurements with pass/fail against age-based regulation limits, the Army Body Fat Calculator is your perfect companion. Our advanced online tool replaces tedious manual spreadsheets by delivering instant outputs based on industry-standard formulas. You can use it repeatedly to test different scenarios and optimize your outcomes.`
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
      about: `If you want to estimated conception date from due date or LMP with implantation window and pregnancy milestones, the Conception Calculator is your perfect companion. Our advanced online tool replaces tedious manual spreadsheets by delivering instant outputs based on industry-standard formulas. You can use it repeatedly to test different scenarios and optimize your outcomes.`
},
];
