/**
 * Programmatic SEO Landing Page Data
 * 
 * Each entry generates a unique, long-tail optimized landing page
 * targeting specific user intents (e.g. "how to calculate home loan EMI").
 * 
 * These pages pre-fill calculator inputs and provide rich,
 * keyword-targeted educational content for organic search discoverability.
 */

export const SEO_LANDING_PAGES = [
  // ── Finance Long-Tail ───────────────────────────────────────────────
  {
    slug: "home-loan-emi-calculator",
    title: "Home Loan EMI Calculator — Monthly Installment & Amortization",
    h1: "Free Home Loan EMI Calculator Online",
    description: "Calculate your home loan EMI instantly. See monthly installment, total interest payable, and full amortization schedule. Compare rates and plan prepayments.",
    keywords: ["home loan emi calculator", "housing loan calculator", "home mortgage calculator", "house loan emi", "home loan interest calculator"],
    calcSlug: "loan-emi-calculator",
    prefilledParams: { p: 5000000, r: 8.5, y: 20 },
    content: {
      intro: "Planning to buy your dream home? Use our free Home Loan EMI Calculator to instantly determine your monthly payment (EMI), total interest cost, and generate a complete year-by-year amortization schedule. Whether you're a first-time homebuyer or refinancing, this tool helps you make informed decisions.",
      howItWorks: [
        "Enter your home loan amount (principal)",
        "Set the annual interest rate offered by your bank",
        "Choose your preferred loan tenure (5 to 30 years)",
        "See your monthly EMI, total interest, and amortization breakdown instantly",
      ],
      tips: [
        "Keep your EMI below 40% of your monthly income for financial safety.",
        "Making even small extra payments each month significantly reduces total interest paid.",
        "Compare at least 3-4 lenders before finalizing — even 0.25% rate difference saves lakhs over 20 years.",
        "Opt for the longest tenure initially, then aggressively prepay to reduce total interest without risking cash flow.",
      ],
    },
    faq: [
      { q: "How is home loan EMI calculated?", a: "EMI = [P × R × (1+R)^N] / [(1+R)^N – 1], where P is principal, R is monthly interest rate, and N is total number of months." },
      { q: "What is a good home loan EMI ratio?", a: "Financial experts recommend keeping your EMI below 40% of your monthly take-home income. Going above 50% significantly increases financial risk." },
      { q: "Can I reduce my home loan EMI?", a: "Yes — you can reduce EMI by increasing the loan tenure, making a larger down payment, negotiating a lower interest rate, or refinancing with another lender." },
    ],
  },
  {
    slug: "car-loan-emi-calculator",
    title: "Car Loan EMI Calculator — Auto Loan Monthly Payment Estimator",
    h1: "Free Car Loan EMI Calculator",
    description: "Calculate car loan EMI instantly. Compare interest rates, see total cost of ownership, and plan your auto loan budget with our free online calculator.",
    keywords: ["car loan emi calculator", "auto loan calculator", "vehicle loan calculator", "car finance calculator", "car loan interest"],
    calcSlug: "loan-emi-calculator",
    prefilledParams: { p: 1200000, r: 10.5, y: 5 },
    content: {
      intro: "Buying a car? Our Car Loan EMI Calculator helps you estimate your monthly installment, total interest cost, and the true cost of ownership. Plan your auto finance budget with precision.",
      howItWorks: [
        "Enter the car loan amount (ex-showroom price minus down payment)",
        "Input the interest rate from your bank or dealer",
        "Select loan tenure (typically 3 to 7 years for car loans)",
        "View your EMI, total payable, and interest breakdown",
      ],
      tips: [
        "Car loans typically have higher rates than home loans — 8-14% depending on the lender and your credit score.",
        "Shorter tenures (3-5 years) cost less overall interest compared to 7-year terms.",
        "Always negotiate the 'on-road price' before calculating EMI — dealer add-ons can inflate the loan amount.",
        "Consider the total cost of ownership (EMI + insurance + fuel + maintenance) when budgeting.",
      ],
    },
    faq: [
      { q: "What is a typical car loan interest rate?", a: "Car loan rates typically range from 8% to 14% depending on the lender, your credit score, and the car type. New cars generally get lower rates than used cars." },
      { q: "Should I take a 3-year or 5-year car loan?", a: "A 3-year loan has higher EMI but much lower total interest. A 5-year loan reduces monthly burden but costs more overall. Choose based on your cash flow comfort." },
    ],
  },
  {
    slug: "sip-returns-calculator",
    title: "SIP Returns Calculator — Mutual Fund SIP Growth Estimator",
    h1: "Free SIP Returns Calculator with Step-Up",
    description: "Calculate your SIP returns with annual step-up, XIRR, and wealth projections. See how monthly investments grow over 5, 10, 20, or 30 years.",
    keywords: ["sip calculator", "sip returns calculator", "mutual fund calculator", "sip investment calculator", "systematic investment plan"],
    calcSlug: "sip-calculator",
    prefilledParams: { amt: 10000, r: 12, y: 15 },
    content: {
      intro: "A Systematic Investment Plan (SIP) is the most popular way to invest in mutual funds. Use our SIP Calculator to see how your monthly investments compound over time and build serious wealth.",
      howItWorks: [
        "Enter your monthly SIP amount",
        "Set the expected annual return rate (12-15% for equity funds historically)",
        "Choose your investment duration",
        "Optionally add an annual step-up percentage to increase SIP every year",
      ],
      tips: [
        "Start early — even ₹5,000/month at 12% return becomes ₹50+ lakhs in 20 years.",
        "Annual step-up of 10% dramatically boosts final corpus by aligning SIP with income growth.",
        "Never stop SIP during market downturns — you're buying more units at lower prices (rupee cost averaging).",
        "XIRR gives the most accurate measure of your actual returns, accounting for all cash flows.",
      ],
    },
    faq: [
      { q: "What is a good SIP amount for beginners?", a: "Start with an amount you can sustain consistently — even ₹1,000-5,000/month is a great beginning. Consistency matters more than amount." },
      { q: "What returns can I expect from SIP?", a: "Historically, equity mutual funds have returned 12-15% annualized over 10+ year periods. However, past returns don't guarantee future performance." },
    ],
  },
  {
    slug: "compound-interest-calculator-with-monthly-contributions",
    title: "Compound Interest Calculator with Monthly Contributions",
    h1: "Free Compound Interest Calculator with Monthly Deposits",
    description: "Calculate compound interest with regular monthly contributions. See how your savings grow with daily, monthly, or annual compounding. Includes inflation adjustment.",
    keywords: ["compound interest calculator", "compound interest with monthly deposits", "investment growth calculator", "compound interest formula", "savings growth calculator"],
    calcSlug: "compound-interest-calculator",
    prefilledParams: { p: 100000, r: 8, y: 10 },
    content: {
      intro: "Compound interest is the single most powerful wealth-building force. Our calculator shows you exactly how your money grows when interest earns interest — with the added power of regular monthly contributions.",
      howItWorks: [
        "Enter your initial principal amount",
        "Set the annual interest rate",
        "Choose compounding frequency (daily, monthly, quarterly, annually)",
        "Add optional monthly contributions to see accelerated growth",
      ],
      tips: [
        "Daily compounding yields slightly more than monthly over long periods.",
        "The 'Rule of 72' — divide 72 by your interest rate to estimate years to double your money.",
        "Even small monthly contributions dramatically boost final value over 10+ years.",
        "Factor in inflation (3-6%) to see your money's real purchasing power.",
      ],
    },
    faq: [
      { q: "What is the compound interest formula?", a: "A = P(1 + r/n)^(nt), where A is the final amount, P is principal, r is annual rate, n is compounding frequency, and t is time in years." },
      { q: "Is monthly or annual compounding better?", a: "Monthly compounding yields slightly more than annual because interest starts earning interest sooner. Daily compounding is even better, though the difference is marginal." },
    ],
  },

  // ── Health Long-Tail ────────────────────────────────────────────────
  {
    slug: "bmi-calculator-adults",
    title: "BMI Calculator for Adults — Body Mass Index with Health Risk",
    h1: "Free BMI Calculator for Adults",
    description: "Calculate your Body Mass Index instantly. Get WHO risk classification, ideal weight range, and personalized health insights based on age, gender, and body composition.",
    keywords: ["bmi calculator", "body mass index calculator", "bmi for adults", "healthy weight calculator", "bmi check online"],
    calcSlug: "bmi-calculator",
    prefilledParams: { w: 75, h: 170, age: 30 },
    content: {
      intro: "Body Mass Index (BMI) is a simple screening tool used worldwide to categorize weight status. While it doesn't directly measure body fat, it's a reliable first step in assessing health risk related to weight.",
      howItWorks: [
        "Enter your weight in kg or lbs",
        "Enter your height in cm or feet",
        "Optionally add age and gender for body fat estimation",
        "See your BMI, category, health risk, and ideal weight range",
      ],
      tips: [
        "BMI 18.5-24.9 is considered normal weight by WHO standards.",
        "BMI alone doesn't distinguish between muscle and fat — athletes may have high BMI with low body fat.",
        "Waist-to-height ratio is often a better predictor of health risk than BMI alone.",
        "Track BMI trends over time rather than obsessing over a single reading.",
      ],
    },
    faq: [
      { q: "What is a healthy BMI range?", a: "The WHO classifies BMI 18.5-24.9 as normal weight. Below 18.5 is underweight, 25-29.9 is overweight, and 30+ is obese." },
      { q: "Is BMI accurate for muscular people?", a: "No — BMI can overestimate body fat in highly muscular individuals. Use body fat percentage or waist circumference for a more accurate assessment." },
    ],
  },
  {
    slug: "tdee-calorie-calculator",
    title: "TDEE Calculator — Total Daily Energy Expenditure & Calories",
    h1: "Free TDEE & Calorie Calculator",
    description: "Calculate your Total Daily Energy Expenditure (TDEE) based on BMR, activity level, and fitness goals. Get precise calorie targets for weight loss, maintenance, or muscle gain.",
    keywords: ["tdee calculator", "calorie calculator", "daily calorie needs", "how many calories do i need", "calorie deficit calculator"],
    calcSlug: "calorie-calculator",
    prefilledParams: { w: 70, h: 170 },
    content: {
      intro: "TDEE (Total Daily Energy Expenditure) is the total number of calories your body burns each day. Knowing your TDEE is the foundation of any effective nutrition plan — whether you're losing fat, building muscle, or maintaining weight.",
      howItWorks: [
        "Enter your weight, height, age, and gender",
        "Select your activity level (sedentary to very active)",
        "Choose your fitness goal (lose, maintain, or gain weight)",
        "Get your BMR, TDEE, and goal-specific calorie target with macro breakdown",
      ],
      tips: [
        "To lose weight: eat 300-500 calories below your TDEE (moderate deficit).",
        "For muscle gain: eat 200-500 calories above TDEE with adequate protein.",
        "Mifflin-St Jeor is the most clinically accurate BMR formula for most adults.",
        "Recalculate TDEE every 4-6 weeks as your body composition changes.",
      ],
    },
    faq: [
      { q: "What is the difference between BMR and TDEE?", a: "BMR is the calories your body burns at complete rest (just to stay alive). TDEE is BMR multiplied by your activity factor — it's your total daily calorie burn including exercise and daily movement." },
      { q: "How many calories should I eat to lose weight?", a: "Eat 300-500 calories below your TDEE for a moderate, sustainable deficit. This translates to roughly 0.5-1 lb of fat loss per week." },
    ],
  },

  // ── Additional Finance Long-Tail ────────────────────────────────────
  {
    slug: "investment-roi-calculator",
    title: "Investment ROI Calculator — Return on Investment Analyzer",
    h1: "Free Investment ROI Calculator",
    description: "Calculate your return on investment (ROI) with annualized returns, inflation adjustment, and real vs nominal comparison. Perfect for stocks, real estate, and business investments.",
    keywords: ["roi calculator", "return on investment calculator", "investment return calculator", "profit calculator", "annualized roi"],
    calcSlug: "roi-calculator",
    prefilledParams: { inv: 500000, ret: 850000, y: 3 },
    content: {
      intro: "Return on Investment (ROI) is the most fundamental metric for evaluating any investment's performance. Our ROI Calculator computes both total and annualized returns, adjusts for inflation, and shows your real purchasing-power gains.",
      howItWorks: [
        "Enter your total investment (initial capital)",
        "Enter the final return value (exit or current value)",
        "Set the investment duration in years",
        "Optionally add inflation rate for real-return comparison",
      ],
      tips: [
        "Always compare annualized ROI, not total ROI, when evaluating investments of different durations.",
        "Real ROI (inflation-adjusted) is what actually matters for purchasing power.",
        "A 'multiple' of 2x over 5 years equals ~15% annualized — not 20%.",
        "Factor in taxes, fees, and opportunity cost for true net ROI.",
      ],
    },
    faq: [
      { q: "How do you calculate ROI?", a: "ROI = [(Final Value - Initial Investment) / Initial Investment] × 100. For annualized: ((Final/Initial)^(1/Years) - 1) × 100." },
      { q: "What is a good ROI?", a: "A 'good' ROI depends on the asset class. Stocks average 10-12% annually, real estate 8-10%, and savings accounts 3-6%. Always compare against inflation." },
    ],
  },
  {
    slug: "break-even-analysis-calculator",
    title: "Break-Even Analysis Calculator — Find Your Profitability Point",
    h1: "Free Break-Even Analysis Calculator",
    description: "Calculate your break-even point in units and revenue. Visualize the intersection of revenue and costs with interactive charts. Essential for business planning.",
    keywords: ["break even calculator", "break even analysis", "breakeven point calculator", "cost volume profit analysis", "business profitability calculator"],
    calcSlug: "break-even-calculator",
    prefilledParams: { fixed: 100000, price: 250, vCost: 150 },
    content: {
      intro: "Break-even analysis is one of the most critical tools in business planning. It tells you exactly how many units you need to sell — or how much revenue you need to generate — before your business starts turning a profit.",
      howItWorks: [
        "Enter your total fixed costs (rent, salaries, insurance, etc.)",
        "Set your selling price per unit",
        "Enter your variable cost per unit (materials, shipping, etc.)",
        "See your break-even point in units and revenue, with a visual chart",
      ],
      tips: [
        "A lower break-even point means less risk — you start profiting sooner.",
        "Increasing price OR reducing variable costs both lower the break-even point.",
        "The contribution margin (price - variable cost) is your profit per unit above break-even.",
        "Use this analysis before launching any new product or business.",
      ],
    },
    faq: [
      { q: "What is break-even analysis?", a: "Break-even analysis determines the point at which total revenue equals total costs — you're neither making a profit nor a loss. Anything above this point is profit." },
      { q: "How do you calculate break-even point?", a: "Break-Even Units = Fixed Costs / (Selling Price - Variable Cost per Unit). This gives the minimum units needed to cover all costs." },
    ],
  },
  {
    slug: "macro-calculator-weight-loss",
    title: "Macro Calculator for Weight Loss — Protein, Carbs & Fat Targets",
    h1: "Free Macro Calculator for Weight Loss",
    description: "Calculate your optimal protein, carb, and fat intake for weight loss. Get personalized macro targets based on your body weight, calories, and fitness goals.",
    keywords: ["macro calculator", "macros for weight loss", "protein calculator", "macro counting", "iifym calculator"],
    calcSlug: "macro-calculator",
    prefilledParams: { cal: 1800, goal: "lose", bw: 80 },
    content: {
      intro: "Counting macros (macronutrients) is the most effective way to control body composition. Instead of just counting calories, you optimize the ratio of protein, carbohydrates, and fat for your specific goal — whether that's fat loss, muscle gain, or maintenance.",
      howItWorks: [
        "Enter your daily calorie target (calculate from TDEE first)",
        "Input your body weight in kg",
        "Select your goal: lose weight, maintain, or gain muscle",
        "Get your exact protein, carb, and fat targets in grams",
      ],
      tips: [
        "For weight loss, prioritize protein (1.6-2.2g per kg bodyweight) to preserve muscle.",
        "Fat should never go below 0.5g per kg bodyweight — it's essential for hormones.",
        "Protein and carbs have 4 calories per gram. Fat has 9 calories per gram.",
        "Don't fear carbs — they fuel workouts and recovery. Just adjust the ratio to your goals.",
      ],
    },
    faq: [
      { q: "What are good macros for weight loss?", a: "A common weight loss macro split is 40% protein, 30% carbs, 30% fat. However, the ideal split depends on your individual activity level and preferences." },
      { q: "How much protein do I need daily?", a: "For active individuals, 1.6-2.2g of protein per kg of bodyweight is optimal. For sedentary adults, 0.8-1.2g/kg is sufficient." },
    ],
  },
  {
    slug: "mortgage-comparison-calculator",
    title: "Mortgage Comparison Calculator — Compare Home Loan Rates",
    h1: "Free Mortgage Rate Comparison Calculator",
    description: "Compare mortgage rates side by side. See how different interest rates, tenures, and down payments affect your monthly EMI and total interest paid over the life of the loan.",
    keywords: ["mortgage comparison calculator", "home loan comparison", "mortgage rate comparison", "loan comparison calculator", "compare home loans"],
    calcSlug: "mortgage-calculator",
    prefilledParams: { p: 8000000, r: 7.5, y: 25 },
    content: {
      intro: "When shopping for a mortgage, even a 0.25% difference in interest rate can save you hundreds of thousands over the loan's lifetime. Use our Mortgage Comparison Calculator to see the real impact of different rates, tenures, and down payment amounts.",
      howItWorks: [
        "Enter your desired loan amount",
        "Set the interest rate from your primary lender",
        "Choose your preferred tenure",
        "Use the refinance comparison field to compare a second rate side by side",
      ],
      tips: [
        "A 0.5% rate reduction on a 25-year mortgage saves approximately 8-10% in total interest.",
        "Shorter tenures mean higher EMI but dramatically less total interest.",
        "Consider the effective rate (including fees and charges) when comparing lenders.",
        "Pre-approve with multiple lenders to negotiate the best rate.",
      ],
    },
    faq: [
      { q: "How much difference does 0.5% make on a mortgage?", a: "On a $500,000 loan over 25 years, a 0.5% rate difference saves approximately $40,000-50,000 in total interest — a significant amount." },
      { q: "Should I choose a shorter or longer mortgage tenure?", a: "Shorter tenures (15-20 years) save enormous amounts in interest but require higher monthly payments. Choose based on your cash flow and financial security." },
    ],
  },
  {
    slug: "body-fat-percentage-calculator",
    title: "Body Fat Percentage Calculator — US Navy Method",
    h1: "Free Body Fat Percentage Calculator",
    description: "Calculate your body fat percentage using the US Navy method. Get accurate results with just a tape measure — no caliper or DEXA scan required. Includes category classification.",
    keywords: ["body fat calculator", "body fat percentage calculator", "navy body fat calculator", "body composition calculator", "fat percentage calculator"],
    calcSlug: "body-fat-calculator",
    prefilledParams: { h: 175, neck: 38, waist: 85 },
    content: {
      intro: "Body fat percentage is a much better indicator of health and fitness than BMI alone. The US Navy method uses simple tape measurements to estimate body fat with surprising accuracy — within 3-4% of a DEXA scan.",
      howItWorks: [
        "Select your gender",
        "Enter your height in cm",
        "Measure and enter your neck and waist circumference",
        "For women, also enter hip circumference",
      ],
      tips: [
        "Measure at the narrowest point for neck, widest for waist (at navel), widest for hips.",
        "Essential fat: Men 2-5%, Women 10-13%. Don't go below these levels.",
        "Athletic range: Men 6-13%, Women 14-20%. Fitness range: Men 14-17%, Women 21-24%.",
        "Take measurements at the same time of day for consistent tracking.",
      ],
    },
    faq: [
      { q: "How accurate is the Navy body fat method?", a: "The US Navy method is accurate within 3-4% of DEXA scan results for most people. It's the most practical at-home method requiring only a tape measure." },
      { q: "What is a healthy body fat percentage?", a: "For men: 10-20% is healthy, 6-13% is athletic. For women: 18-28% is healthy, 14-20% is athletic. Essential fat minimums are 2-5% (men) and 10-13% (women)." },
    ],
  },
  {
    slug: "college-gpa-calculator",
    title: "College GPA Calculator — Weighted GPA with What-If Simulator",
    h1: "Free College GPA Calculator",
    description: "Calculate your college GPA with weighted credit hours. Simulate what-if scenarios to see what grades you need to reach your target GPA. Supports 4.0 scale and Dean's List detection.",
    keywords: ["gpa calculator", "college gpa calculator", "cumulative gpa calculator", "weighted gpa calculator", "grade point average calculator"],
    calcSlug: "gpa-calculator",
    prefilledParams: {},
    content: {
      intro: "Your GPA is one of the most important numbers in your academic career. Whether you're applying for graduate school, scholarships, or jobs — knowing exactly where you stand and what you need to get there is crucial.",
      howItWorks: [
        "Add your courses with the number of credit hours",
        "Select or enter the grade you received for each course",
        "See your cumulative GPA calculated instantly",
        "Use the what-if simulator to plan future semesters",
      ],
      tips: [
        "A 3.5+ GPA is considered excellent and qualifies for Dean's List at most universities.",
        "Weight your effort towards high-credit-hour courses — they have the biggest impact on GPA.",
        "A 'C' in a 4-credit course hurts more than an 'A' in a 1-credit course helps.",
        "Use the what-if simulator to plan exactly what grades you need next semester.",
      ],
    },
    faq: [
      { q: "How is GPA calculated?", a: "GPA = Σ(Grade Points × Credit Hours) / Σ(Credit Hours). Each letter grade has a point value: A=4.0, B=3.0, C=2.0, D=1.0, F=0.0." },
      { q: "What GPA do I need for Dean's List?", a: "Most universities require a 3.5 GPA or higher for Dean's List. Some require 3.7+. Check your university's specific requirements." },
    ],
  },
];

// ── Utility getters ─────────────────────────────────────────────────
export function getLandingBySlug(slug) {
  return SEO_LANDING_PAGES.find(p => p.slug === slug) || null;
}

export function getLandingsByCalc(calcSlug) {
  return SEO_LANDING_PAGES.filter(p => p.calcSlug === calcSlug);
}

export function getAllLandingSlugs() {
  return SEO_LANDING_PAGES.map(p => p.slug);
}
