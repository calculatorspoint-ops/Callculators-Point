export const CATEGORIES = [
  { id:"finance",    name:"Finance & Money",     icon:"💰", color:"#1d4ed8", bg:"#eff6ff", desc:"Loans, investments, savings, tax & more" },
  { id:"health",     name:"Health & Fitness",     icon:"❤️", color:"#dc2626", bg:"#fef2f2", desc:"BMI, calories, BMR, body fat & nutrition" },
  { id:"math",       name:"Math & Science",       icon:"📐", color:"#7c3aed", bg:"#f5f3ff", desc:"Algebra, geometry, statistics & science" },
  { id:"education",  name:"Education & GPA",      icon:"🎓", color:"#c2410c", bg:"#fff7ed", desc:"GPA, grades, marks & academic planning" },
  { id:"converters", name:"Unit Converters",      icon:"🔄", color:"#065f46", bg:"#f0fdf4", desc:"Length, weight, temp, speed, data & more" },
  { id:"everyday",   name:"Everyday Tools",       icon:"🏠", color:"#b45309", bg:"#fffbeb", desc:"Age, dates, fuel, passwords & daily tools" },
];

export const ALL_CALCULATORS = [
  // ── FINANCE (14 — currency converter removed, now in navbar) ──────────
  { id:"emi",             slug:"loan-emi-calculator",            cat:"finance",    name:"EMI Calculator",            icon:"🏦", desc:"Loan installments with amortization chart, prepayment engine & rate comparison",       popular:true,  hasChart:true,  isNew:false,
    formula: "EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]\nWhere P is Principal, R is monthly interest rate, and N is the number of months.",
    tips: ["Even a small extra monthly payment goes entirely towards the principal, significantly reducing the loan tenure and total interest paid.", "An amortization schedule shows exactly how much of each payment goes to principal vs interest."] },
  { id:"compound",        slug:"compound-interest-calculator",   cat:"finance",    name:"Compound Interest",         icon:"📈", desc:"Investment growth with inflation adj., tax layer, goal-seeking & real vs nominal",     popular:true,  hasChart:true,  isNew:false,
    formula: "A = P(1 + r/n)^(nt)\nWhere A is final amount, P is principal, r is annual rate, n is compounding frequency, t is time in years.",
    tips: ["Compound interest is interest calculated on the initial principal AND all accumulated interest.", "The more frequently interest is compounded (e.g., daily vs annually), the higher the effective yield."] },
  { id:"sip",             slug:"sip-calculator",                 cat:"finance",    name:"SIP Calculator",            icon:"💹", desc:"SIP corpus with step-up mode, XIRR & 3-scenario simulation",                          popular:true,  hasChart:true,  isNew:false,
    formula: "FV = P × ({[1 + i]^n - 1} / i) × (1 + i)\nWhere FV is Future Value, P is SIP amount, i is monthly return rate, and n is number of months.",
    tips: ["A step-up SIP automatically increases your monthly investment by a certain percentage every year, aligning with your income growth.", "Extended Internal Rate of Return (XIRR) is a method used to calculate returns on investments where there are multiple transactions happening at different times."] },
  { id:"simple-interest", slug:"simple-interest-calculator",     cat:"finance",    name:"Simple Interest",           icon:"💲", desc:"SI with flat vs reducing balance comparison & time conversion",                        popular:false, hasChart:true,  isNew:false,
    formula: "SI = P × R × T / 100\nWhere P = Principal, R = Annual Rate (%), T = Time in years",
    tips: ["Simple interest charges interest only on the original principal, while compound interest charges on principal + accumulated interest.", "Flat-rate loans use simple interest — they cost significantly more than reducing-balance loans at the same stated rate."] },
  { id:"roi",             slug:"roi-calculator",                 cat:"finance",    name:"ROI Calculator",            icon:"💰", desc:"Total & annual ROI with inflation-adjusted real returns",                              popular:false, hasChart:true,  isNew:false,
    formula: "ROI = [(Final Value - Initial Investment) / Initial Investment] × 100\nAnnualized ROI = ((Final/Initial)^(1/Years) - 1) × 100",
    tips: ["Always compare annualized ROI, not total ROI, when evaluating investments of different durations."] },
  { id:"salary",          slug:"salary-calculator",              cat:"finance",    name:"Salary Calculator",         icon:"💼", desc:"Pay period converter with local tax rules, allowances & net take-home",               popular:true,  hasChart:false, isNew:false,
    tips: ["Gross pay is what you earn before taxes and deductions. Net pay is your 'take-home' money after all deductions."] },
  { id:"discount",        slug:"discount-calculator",            cat:"finance",    name:"Discount Calculator",       icon:"🏷️", desc:"Stacked multi-discounts, reverse price & tax integration",                           popular:true,  hasChart:true,  isNew:false,
    tips: ["A stacked discount is applied to the already discounted price, not the original price. E.g., 50% off + 20% off equals 60% total off, not 70%."] },
  { id:"profit-margin",   slug:"profit-margin-calculator",       cat:"finance",    name:"Profit Margin",             icon:"📊", desc:"Gross margin, markup, health indicator & total profit",                               popular:false, hasChart:true,  isNew:false,
    formula: "Gross Margin = [(Revenue - Cost) / Revenue] × 100\nMarkup = [(Revenue - Cost) / Cost] × 100",
    tips: ["Margin is profit as a percentage of revenue. Markup is profit as a percentage of cost."] },
  { id:"break-even",      slug:"break-even-calculator",          cat:"finance",    name:"Break-Even Calculator",     icon:"⚖️", desc:"Break-even units & revenue with contribution margin chart",                           popular:false, hasChart:true,  isNew:false,
    formula: "Break-Even Units = Fixed Costs / (Selling Price - Variable Cost per Unit)" },
  { id:"tax",             slug:"tax-calculator",                 cat:"finance",    name:"Tax Calculator",            icon:"🧾", desc:"Local tax rules auto-applied based on selected currency region",                      popular:true,  hasChart:false, isNew:false,
    tips: ["Effective Tax Rate is the actual percentage of your total income paid in taxes, which is usually lower than your top marginal tax bracket."] },
  { id:"tip",             slug:"tip-calculator",                 cat:"finance",    name:"Tip Calculator",            icon:"🍽️", desc:"Tip amount, bill split among any group with rounding options",                       popular:false, hasChart:false, isNew:false,
    tips: ["In the US, 15-20% is standard. Many European and Asian countries include service charges in the bill.", "When splitting, round up each person's share to the nearest whole number — the server will appreciate it."] },
  { id:"gst",             slug:"gst-calculator",                 cat:"finance",    name:"GST / VAT Calculator",      icon:"📋", desc:"Add or extract GST/VAT — label auto-changes by region",                              popular:false, hasChart:false, isNew:false,
    formula: "GST (Exclusive) = Amount × Rate / 100\nGST (Inclusive): Base = Total × 100 / (100 + Rate)",
    tips: ["GST-exclusive means tax is added on top. GST-inclusive means the price already includes tax — use the reverse calculation to find the base amount."] },
  { id:"mortgage",        slug:"mortgage-calculator",            cat:"finance",    name:"Mortgage Calculator",       icon:"🏠", desc:"Home loan EMI with amortization, prepayment & rate comparison",                       popular:true,  hasChart:true,  isNew:false,
    formula: "EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]\nWhere P = Loan Amount, R = Monthly Rate, N = Total Months",
    tips: ["Even small prepayments dramatically reduce total interest — paying just 5% extra per month can cut years off your loan.", "The first few years of a mortgage, most of your EMI goes to interest — prepayments are most effective early on."] },
  { id:"ppf",             slug:"ppf-calculator",                 cat:"finance",    name:"PPF / Savings Calculator",  icon:"🏛️", desc:"Fixed savings with compound growth and tax-free return visualization",               popular:false, hasChart:true,  isNew:false,
    formula: "Maturity = Σ (Annual Deposit × (1 + r)^(N-year))\nWhere r = annual interest rate, N = total years",
    tips: ["PPF enjoys EEE (Exempt-Exempt-Exempt) tax status — your investment, interest, and maturity are all tax-free."] },

  // ── HEALTH (10) ───────────────────────────────────────────────────────
  { id:"bmi",             slug:"bmi-calculator",                 cat:"health",     name:"BMI Calculator",            icon:"⚖️", desc:"BMI with WHO risk classification, ideal weight & body fat estimate",                 popular:true,  hasChart:true,  isNew:false,
    formula: "BMI = weight(kg) / height(m)²\nFor imperial: BMI = 703 × weight(lbs) / height(in)²",
    tips: ["BMI does not distinguish between muscle and fat. Highly muscular individuals may be classified as 'overweight' despite having low body fat."] },
  { id:"calorie",         slug:"calorie-calculator",             cat:"health",     name:"Calorie Calculator",        icon:"🔥", desc:"TDEE with 5 goals, 2 formulas, macros & weekly weight projection",                   popular:true,  hasChart:true,  isNew:false,
    tips: ["Total Daily Energy Expenditure (TDEE) is the total number of calories you burn per day, including basal metabolic rate and physical activity."] },
  { id:"bmr",             slug:"bmr-calculator",                 cat:"health",     name:"BMR Calculator",            icon:"⚡", desc:"Mifflin vs Harris-Benedict with TDEE at all 5 activity levels",                     popular:false, hasChart:false, isNew:false,
    formula: "Mifflin-St Jeor:\nMen: BMR = 10×weight(kg) + 6.25×height(cm) - 5×age - 5\nWomen: BMR = 10×weight(kg) + 6.25×height(cm) - 5×age - 161",
    tips: ["Mifflin-St Jeor is considered the most clinically accurate BMR formula for most adults.", "BMR accounts for 60-75% of total daily calories — your body burns most energy just staying alive."] },
  { id:"body-fat",        slug:"body-fat-calculator",            cat:"health",     name:"Body Fat Calculator",       icon:"📏", desc:"Body fat % using US Navy method with category classification",                       popular:false, hasChart:true,  isNew:false,
    formula: "Men: BF% = 495/(1.0324 - 0.19077×log₁₀(waist-neck) + 0.15456×log₁₀(height)) - 450",
    tips: ["The Navy method is surprisingly accurate (within 3-4% of DEXA scans) and requires only a tape measure."] },
  { id:"ideal-weight",    slug:"ideal-weight-calculator",        cat:"health",     name:"Ideal Weight",              icon:"🎯", desc:"4-formula comparison: Devine, Miller, Robinson & Hamwi with BMI range",              popular:false, hasChart:true,  isNew:false,
    tips: ["No single formula is 'correct' — we show all four plus the BMI range so you can see the consensus."] },
  { id:"macro",           slug:"macro-calculator",               cat:"health",     name:"Macro Calculator",          icon:"🥗", desc:"Protein/carbs/fat targets by goal with donut chart",                                 popular:false, hasChart:true,  isNew:false,
    tips: ["Protein: 4 cal/g · Carbs: 4 cal/g · Fat: 9 cal/g. Fat has more than double the calories per gram.", "Most adults need 1.6-2.2g protein per kg bodyweight for optimal muscle maintenance."] },
  { id:"water-intake",    slug:"water-intake-calculator",        cat:"health",     name:"Water Intake",              icon:"💧", desc:"Daily water needs by weight, activity & climate",                                    popular:false, hasChart:false, isNew:true,
    formula: "Base = Weight(kg) × 35ml\nAdjusted for activity (+300-1000ml) and climate (+300-500ml)",
    tips: ["Thirst is a late indicator of dehydration — drink water on schedule, not just when thirsty."] },
  { id:"heart-rate",      slug:"heart-rate-calculator",          cat:"health",     name:"Heart Rate Zones",          icon:"❤️", desc:"5 training zones using Karvonen formula",                                            popular:false, hasChart:false, isNew:false,
    formula: "Target HR = Resting HR + (% × HRR)\nHRR = Max HR (220 - age) - Resting HR",
    tips: ["Zone 2 training (60-70% HRR) builds aerobic base and maximizes fat oxidation.", "The 220-age formula has ~10 bpm error margin — a lab VO2 max test gives your true max HR."] },
  { id:"pregnancy",       slug:"pregnancy-due-date",             cat:"health",     name:"Pregnancy Due Date",        icon:"👶", desc:"Due date via Naegele's Rule with milestone tracker",                                 popular:false, hasChart:false, isNew:false,
    formula: "EDD = LMP + 280 days (40 weeks)\nNaegele's Rule: LMP + 1 year - 3 months + 7 days",
    tips: ["Only ~5% of babies arrive on their exact due date. A 'normal' full-term delivery is 37-42 weeks."] },
  { id:"one-rep-max",     slug:"one-rep-max-calculator",         cat:"health",     name:"One Rep Max",               icon:"🏋️", desc:"1RM via 3 formulas + full training percentage table",                              popular:false, hasChart:false, isNew:false,
    formula: "Epley: 1RM = Weight × (1 + Reps/30)\nBrzycki: 1RM = Weight × 36/(37 - Reps)",
    tips: ["Train at 70-85% of 1RM for hypertrophy (muscle growth) and 85-95% for maximum strength development."] },

  // ── MATH (8) ──────────────────────────────────────────────────────────
  { id:"percentage",      slug:"percentage-calculator",          cat:"math",       name:"Percentage Calculator",     icon:"💯", desc:"6 simultaneous modes: X% of Y, what %, change, increase & decrease",                popular:true,  hasChart:false, isNew:false },
  { id:"scientific",      slug:"scientific-calculator",          cat:"math",       name:"Scientific Calculator",     icon:"🔬", desc:"Expression parser with trig, log, exp, history & DEG/RAD toggle",                   popular:true,  hasChart:false, isNew:false },
  { id:"statistics",      slug:"statistics-calculator",          cat:"math",       name:"Statistics Calculator",     icon:"📉", desc:"Mean, median, mode, std dev, IQR, quartiles & histogram",                           popular:false, hasChart:true,  isNew:false },
  { id:"quadratic",       slug:"quadratic-calculator",           cat:"math",       name:"Quadratic Formula",         icon:"📌", desc:"Solve ax²+bx+c=0 with roots, vertex & parabola chart",                            popular:false, hasChart:true,  isNew:false },
  { id:"pythagoras",      slug:"pythagorean-calculator",         cat:"math",       name:"Pythagorean Theorem",       icon:"📐", desc:"Find any triangle side with area and perimeter",                                    popular:false, hasChart:false, isNew:false },
  { id:"fractions",       slug:"fraction-calculator",            cat:"math",       name:"Fraction Calculator",       icon:"➗", desc:"Add/subtract/multiply/divide with simplified result & mixed number",                 popular:false, hasChart:false, isNew:false },
  { id:"area",            slug:"area-calculator",                cat:"math",       name:"Area Calculator",           icon:"🟦", desc:"Area & perimeter of 5 shapes: rectangle, circle, triangle, square, trapezoid",      popular:false, hasChart:false, isNew:true  },
  { id:"prime-checker",   slug:"prime-number-checker",           cat:"math",       name:"Prime Number Checker",      icon:"🔢", desc:"Instant prime check with factors and first 25 primes reference",                    popular:false, hasChart:false, isNew:true  },

  // ── EDUCATION (4) ─────────────────────────────────────────────────────
  { id:"gpa",             slug:"gpa-calculator",                 cat:"education",  name:"GPA Calculator",            icon:"📚", desc:"Weighted GPA with Dean's List detection & what-if simulator",                       popular:true,  hasChart:false, isNew:false },
  { id:"grade",           slug:"grade-calculator",               cat:"education",  name:"Grade Calculator",          icon:"✏️", desc:"Required score to hit target GPA with what-if simulation",                          popular:true,  hasChart:false, isNew:false },
  { id:"final-grade",     slug:"final-grade-calculator",         cat:"education",  name:"Final Grade Calculator",    icon:"🎓", desc:"Weighted final grade from multiple assignments",                                     popular:false, hasChart:false, isNew:false },
  { id:"cgpa-to-percent", slug:"cgpa-percentage-calculator",     cat:"education",  name:"CGPA to Percentage",        icon:"📊", desc:"CGPA conversion with 5 university formulas incl. HEC Pakistan",                    popular:false, hasChart:false, isNew:true  },

  // ── CONVERTERS (6) ────────────────────────────────────────────────────
  { id:"length",          slug:"length-converter",               cat:"converters", name:"Length Converter",          icon:"📏", desc:"9 units: mm, cm, m, km, in, ft, yard, mile, nautical mile",                         popular:true,  hasChart:false, isNew:false },
  { id:"weight",          slug:"weight-converter",               cat:"converters", name:"Weight Converter",          icon:"⚖️", desc:"8 units: mg, g, kg, tonne, oz, lb, stone, carat",                                  popular:true,  hasChart:false, isNew:false },
  { id:"temperature",     slug:"temperature-converter",          cat:"converters", name:"Temperature Converter",     icon:"🌡️", desc:"Bidirectional C/F/K — type any field, all update instantly",                      popular:true,  hasChart:false, isNew:false },
  { id:"speed",           slug:"speed-converter",                cat:"converters", name:"Speed Converter",           icon:"🚀", desc:"6 units: m/s, km/h, mph, knot, ft/s, Mach",                                        popular:false, hasChart:false, isNew:false },
  { id:"data",            slug:"data-storage-converter",         cat:"converters", name:"Data Storage Converter",    icon:"💾", desc:"6 units: B, KB, MB, GB, TB, PB",                                                   popular:false, hasChart:false, isNew:false },
  { id:"area-conv",       slug:"area-converter",                 cat:"converters", name:"Area Converter",            icon:"🟩", desc:"7 units: cm², m², km², ft², acre, hectare, mile²",                                 popular:false, hasChart:false, isNew:false },

  // ── EVERYDAY (10) ─────────────────────────────────────────────────────
  { id:"age",             slug:"age-calculator",                 cat:"everyday",   name:"Age Calculator",            icon:"🎂", desc:"Exact age with zodiac, next birthday countdown, live seconds & time-of-birth precision mode", popular:true, hasChart:false, isNew:false },
  { id:"date-diff",       slug:"date-difference-calculator",     cat:"everyday",   name:"Date Difference",           icon:"📆", desc:"Days between dates with business-days-only mode",                                   popular:true,  hasChart:false, isNew:false },
  { id:"countdown",       slug:"countdown-calculator",           cat:"everyday",   name:"Countdown Timer",           icon:"⏳", desc:"Live countdown to any event with real-time seconds",                                popular:false, hasChart:false, isNew:false },
  { id:"work-hours",      slug:"work-hours-calculator",          cat:"everyday",   name:"Work Hours",                icon:"⏰", desc:"Daily/weekly/monthly hours with break deduction & earnings",                         popular:false, hasChart:false, isNew:false },
  { id:"fuel",            slug:"fuel-cost-calculator",           cat:"everyday",   name:"Fuel Cost Calculator",      icon:"⛽", desc:"Trip cost with passenger split, round trip & monthly estimate",                     popular:false, hasChart:false, isNew:false },
  { id:"ev-charging",     slug:"ev-charging-calculator",         cat:"everyday",   name:"EV Charging Calculator",    icon:"⚡", desc:"Calculate EV battery charge time, added range, and cost with various charger levels", popular:false, hasChart:false, isNew:true },
  { id:"random",          slug:"random-number-generator",        cat:"everyday",   name:"Random Number Generator",   icon:"🎲", desc:"Integer or decimal random numbers — up to 50 at once",                             popular:false, hasChart:false, isNew:false },
  { id:"password",        slug:"password-generator",             cat:"everyday",   name:"Password Generator",        icon:"🔐", desc:"Secure passwords with entropy bits, strength rating & crack time",                  popular:true,  hasChart:false, isNew:false },
  { id:"roman",           slug:"roman-numeral-converter",        cat:"everyday",   name:"Roman Numeral Converter",   icon:"🏛️", desc:"Bidirectional: numbers to Roman and back (1–3999)",                              popular:false, hasChart:false, isNew:false },
  { id:"word-count",      slug:"word-counter",                   cat:"everyday",   name:"Word Counter",              icon:"📝", desc:"Words, chars, sentences, paragraphs, read time & speak time",                       popular:false, hasChart:false, isNew:false },
  { id:"base64",          slug:"base64-encoder",                 cat:"everyday",   name:"Base64 Encoder/Decoder",    icon:"🔠", desc:"Encode & decode Base64 with copy and reverse button",                               popular:false, hasChart:false, isNew:true  },
  { id:"period",          slug:"period-calculator",              cat:"health",     name:"Period & Cycle Calculator", icon:"🌸", desc:"Adaptive cycle prediction with ovulation window, fertile days, phase visualization, irregular cycle detection & health insights", popular:true, hasChart:false, isNew:true,
    tips: ["Cycle length varies naturally 21–35 days. 28 days is the statistical average, not the rule.", "Tracking 3+ past cycles lets the engine personalize your fertile window prediction.", "Ovulation usually occurs 14 days BEFORE your next period — not 14 days after your last one."] },
];

export const BY_CATEGORY = ALL_CALCULATORS.reduce((acc, c) => {
  if (!acc[c.cat]) acc[c.cat] = [];
  acc[c.cat].push(c);
  return acc;
}, {});

export const POPULAR   = ALL_CALCULATORS.filter(c => c.popular);
export const NEW_CALCS = ALL_CALCULATORS.filter(c => c.isNew);

export function getCalcBySlug(slug) {
  return ALL_CALCULATORS.find(c => c.slug === slug) || null;
}
export function getRelated(calc, limit = 7) {
  return ALL_CALCULATORS.filter(c => c.cat === calc.cat && c.id !== calc.id).slice(0, limit);
}
