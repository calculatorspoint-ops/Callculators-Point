export const BASE_FAQS = [
  { q:"Is this calculator free to use?", a:"Yes — 100% free with no registration, no login, and no hidden fees. All Calculators Point calculators are permanently free." },
  { q:"How accurate are the results?", a:"Our calculators use industry-standard formulas verified against professional tools. Results are for informational purposes — always verify important financial or health decisions with a qualified professional." },
  { q:"Can I share my calculation?", a:"Yes! Click the Share button on any result to copy a shareable link with your exact inputs pre-filled." },
  { q:"Does Calculators Point store my data?", a:"No. All calculations happen locally in your browser. We never transmit your inputs to any server." },
  { q:"Can I use this on mobile?", a:"Absolutely. Calculators Point is mobile-first — sliders, inputs and charts are all optimized for touch screens." },
];

export const CALC_FAQS = {
  "loan-emi-calculator": [
    { q:"What is EMI?", a:"EMI (Equated Monthly Installment) is a fixed monthly payment covering both principal repayment and interest. It stays constant throughout the loan tenure when using the reducing balance method." },
    { q:"How is EMI calculated?", a:"EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1), where P = principal, r = monthly interest rate (annual rate ÷ 12), and n = total months. For example, ₹5L at 10% p.a. for 5 years = ₹10,624/month." },
    { q:"What happens if I pay extra every month?", a:"Extra payments reduce the outstanding principal faster, significantly cutting total interest paid. Even ₹500 extra/month on a ₹5L loan at 12% saves ~₹12,000 in interest." },
    { q:"What is an amortization schedule?", a:"A month-by-month table showing how each EMI splits between interest and principal. In early months, most goes to interest; towards the end, most reduces principal." },
    { q:"What EMI-to-income ratio is healthy?", a:"Financial experts recommend keeping total EMIs (all loans combined) below 40-50% of monthly take-home pay to maintain financial stability." },
  ],
  "compound-interest-calculator": [
    { q:"What is compound interest?", a:"Compound interest earns 'interest on interest' — your returns get reinvested and generate further returns. Einstein reportedly called it the 'eighth wonder of the world'." },
    { q:"How does compounding frequency affect returns?", a:"More frequent compounding = slightly higher returns. Daily compounding yields marginally more than monthly, which yields more than annual. The difference grows significantly over long periods." },
    { q:"What is the Rule of 72?", a:"Divide 72 by your annual interest rate to estimate how many years it takes to double your money. At 8% p.a., money doubles in ~9 years (72÷8)." },
  ],
  "sip-calculator": [
    { q:"What is SIP?", a:"SIP (Systematic Investment Plan) lets you invest a fixed amount in mutual funds every month. It benefits from rupee cost averaging and compound growth over time." },
    { q:"What returns should I expect from SIP?", a:"Equity mutual funds have historically delivered 12-15% p.a. over long periods (10+ years) in India, though past performance doesn't guarantee future returns. Debt funds typically return 6-8%." },
    { q:"What is the minimum SIP amount?", a:"Most mutual funds allow SIPs from ₹500/month. Some funds have higher minimums. There's no maximum limit." },
  ],
  "bmi-calculator": [
    { q:"What is BMI?", a:"Body Mass Index (BMI) = weight(kg) ÷ height²(m). It's a screening tool that categorizes adults into Underweight (<18.5), Normal (18.5-24.9), Overweight (25-29.9), and Obese (≥30)." },
    { q:"Is BMI always accurate?", a:"BMI doesn't account for muscle mass, bone density, age or distribution of fat. Athletes may have high BMI despite low body fat. Always consult a doctor for a full health assessment." },
    { q:"What is a healthy BMI for Indians?", a:"Some research suggests Asian populations, including Indians, face health risks at lower BMI values. Many Indian health organizations recommend a normal range of 18.5-22.9 for Indians." },
  ],
  "percentage-calculator": [
    { q:"How do I calculate percentage increase?", a:"Percentage increase = ((New Value - Original Value) / Original Value) × 100. For example, from ₹1000 to ₹1250 is a 25% increase." },
    { q:"What is a percentage point?", a:"A percentage point is the arithmetic difference between two percentages. If interest rates go from 5% to 8%, that's a 3 percentage point increase, but a 60% relative increase." },
  ],
  "mortgage-calculator": [
    { q:"What is a mortgage calculator?", a:"A mortgage calculator estimates your monthly home loan payment based on loan amount, interest rate, and tenure. It also shows total interest payable and an amortization schedule." },
    { q:"What is a good mortgage interest rate?", a:"Rates vary by country and economy. In the US, rates between 6-7% are common in 2024. In India, home loan rates range from 8-10%. Compare offers from multiple lenders." },
    { q:"Should I choose a fixed or floating rate?", a:"Fixed rates offer predictable payments. Floating rates may start lower but fluctuate. If rates are historically high, floating may save money as rates drop." },
  ],
  "salary-calculator": [
    { q:"What is the difference between gross and net salary?", a:"Gross salary is your total earnings before deductions. Net salary (take-home pay) is what you receive after tax, provident fund, insurance, and other deductions." },
    { q:"How do I convert monthly salary to annual?", a:"Multiply your monthly salary by 12. For hourly to annual, multiply hourly rate × 2,080 (40 hours × 52 weeks)." },
  ],
  "tax-calculator": [
    { q:"What is effective tax rate?", a:"Effective tax rate is the actual percentage of your total income paid in taxes. It's usually lower than your marginal tax bracket because lower brackets are taxed at lower rates." },
    { q:"How are tax slabs applied?", a:"Tax slabs are progressive — only the income within each bracket is taxed at that rate. For example, if the first ₹600K is tax-free, you only pay tax on income above that threshold." },
  ],
  "discount-calculator": [
    { q:"How do stacked discounts work?", a:"Stacked discounts are applied sequentially. A 50% off + 20% off means: first 50% off the original, then 20% off the discounted price. Total savings = 60%, not 70%." },
    { q:"How do I find the original price before a discount?", a:"Original Price = Sale Price ÷ (1 - Discount%). For example, if something costs ₹800 after 20% off, original = 800 ÷ 0.80 = ₹1,000." },
  ],
  "gst-calculator": [
    { q:"What is GST?", a:"Goods and Services Tax (GST) is an indirect tax on the supply of goods and services. It replaces multiple cascading taxes with a single unified tax structure." },
    { q:"What is the difference between GST-inclusive and GST-exclusive?", a:"GST-exclusive means tax is added on top of the price. GST-inclusive means the price already contains tax. To extract GST from an inclusive price: GST = Price × Rate ÷ (100 + Rate)." },
  ],
  "profit-margin-calculator": [
    { q:"What is the difference between margin and markup?", a:"Margin = Profit ÷ Revenue × 100. Markup = Profit ÷ Cost × 100. A 50% markup equals a 33.3% margin. Margin is always lower than markup for the same product." },
    { q:"What is a healthy profit margin?", a:"It varies by industry. Retail: 2-5%, Software: 20-40%, Services: 15-25%. Above 20% is generally considered healthy for most businesses." },
  ],
  "break-even-calculator": [
    { q:"What is the break-even point?", a:"The break-even point is where total revenue equals total costs — no profit, no loss. It tells you the minimum units you must sell to cover all fixed and variable costs." },
    { q:"How is break-even calculated?", a:"Break-Even Units = Fixed Costs ÷ (Selling Price per Unit - Variable Cost per Unit). The denominator is called the contribution margin per unit." },
  ],
  "roi-calculator": [
    { q:"What is ROI?", a:"Return on Investment (ROI) measures the profitability of an investment as a percentage. ROI = (Net Profit ÷ Investment Cost) × 100." },
    { q:"What is a good ROI?", a:"A 'good' ROI depends on the investment type. Stock markets historically average 7-10% annually. Real estate averages 8-12%. Any ROI above inflation is considered positive." },
  ],
  "simple-interest-calculator": [
    { q:"What is simple interest?", a:"Simple interest is calculated only on the original principal: SI = P × R × T ÷ 100. Unlike compound interest, it doesn't earn interest on accumulated interest." },
    { q:"Where is simple interest used?", a:"Simple interest is common in short-term personal loans, car loans (flat rate), fixed deposits in some countries, and certain government bonds." },
  ],
  "ppf-calculator": [
    { q:"What is PPF?", a:"Public Provident Fund (PPF) is a government-backed savings scheme offering guaranteed, tax-free returns. It has a 15-year lock-in period with partial withdrawal allowed after 7 years." },
    { q:"Is PPF tax-free?", a:"Yes, PPF enjoys EEE (Exempt-Exempt-Exempt) status — the investment, interest earned, and maturity amount are all tax-free under Section 80C." },
  ],
  "tip-calculator": [
    { q:"How much should I tip?", a:"Tipping norms vary by country. In the US, 15-20% is standard for restaurants. In many Asian and European countries, tipping is optional or included in the bill." },
    { q:"How do I split a bill with tip?", a:"Total with tip = Bill × (1 + Tip%). Then divide by the number of people. For example: ₹2000 bill + 15% tip = ₹2300 ÷ 4 people = ₹575 each." },
  ],
  "calorie-calculator": [
    { q:"What is TDEE?", a:"Total Daily Energy Expenditure (TDEE) is the total calories you burn per day, combining your Basal Metabolic Rate (BMR) with activity level. It's the baseline for any diet plan." },
    { q:"How many calories should I eat to lose weight?", a:"A deficit of 500 calories per day below your TDEE leads to approximately 0.5 kg (1 lb) weight loss per week. Never go below 1,200 calories (women) or 1,500 calories (men) without medical supervision." },
    { q:"What is the difference between BMR and TDEE?", a:"BMR is calories burned at complete rest (just to keep organs functioning). TDEE = BMR × activity multiplier, giving your actual daily burn including movement and exercise." },
  ],
  "bmr-calculator": [
    { q:"What is BMR?", a:"Basal Metabolic Rate (BMR) is the number of calories your body burns at complete rest to maintain vital functions like breathing, circulation, and cell production." },
    { q:"Which BMR formula is most accurate?", a:"The Mifflin-St Jeor equation is considered the most accurate for most adults. Harris-Benedict tends to overestimate by 5-15%. Katch-McArdle is best if you know your body fat percentage." },
  ],
  "body-fat-calculator": [
    { q:"How is body fat calculated with the Navy method?", a:"The US Navy method uses circumference measurements (neck, waist, and hip for women) along with height to estimate body fat percentage using logarithmic formulas." },
    { q:"What is a healthy body fat percentage?", a:"For men: 10-20% is fitness range, 14-24% is acceptable. For women: 18-28% is fitness range, 21-31% is acceptable. Essential fat is 2-5% (men) and 10-13% (women)." },
  ],
  "ideal-weight-calculator": [
    { q:"How is ideal weight calculated?", a:"Multiple formulas exist: Devine, Miller, Robinson, and Hamwi. Each uses height and gender to estimate ideal weight. We show all four plus the BMI-based healthy range (18.5-24.9)." },
    { q:"Is ideal weight the same for everyone of the same height?", a:"No. Frame size, muscle mass, age, and ethnicity all affect ideal weight. These formulas provide estimates — consult a healthcare provider for personalized guidance." },
  ],
  "macro-calculator": [
    { q:"What are macros?", a:"Macronutrients (macros) are protein, carbohydrates, and fat — the three main nutrients that provide calories. Each plays a unique role in body function and performance." },
    { q:"What is the best macro ratio for weight loss?", a:"A common weight loss split is 35% protein, 35% carbs, 30% fat. Higher protein helps preserve muscle during a caloric deficit. Adjust based on activity level and personal response." },
  ],
  "water-intake-calculator": [
    { q:"How much water should I drink daily?", a:"A general guideline is 35ml per kg of body weight. A 70kg person needs about 2.45L daily. Increase by 0.3-1L for exercise and hot climates." },
    { q:"Does coffee count toward water intake?", a:"Yes, moderate coffee and tea consumption contributes to hydration. However, pure water remains the best choice. Heavily caffeinated or sugary drinks are less effective." },
  ],
  "heart-rate-calculator": [
    { q:"How are heart rate training zones calculated?", a:"Using the Karvonen formula: Target HR = Resting HR + (Percentage × Heart Rate Reserve). HRR = Max HR (220 - age) minus Resting HR. This gives more personalized zones than simple percentage of max HR." },
    { q:"Which heart rate zone burns the most fat?", a:"Zone 2 (60-70% of HRR) maximizes fat oxidation as a percentage of fuel. However, higher zones burn more total calories per minute, so overall caloric deficit matters more for weight loss." },
  ],
  "pregnancy-due-date": [
    { q:"How is the due date calculated?", a:"Using Naegele's Rule: add 280 days (40 weeks) to the first day of your last menstrual period (LMP). Only about 5% of babies are born on their exact due date." },
    { q:"What are the trimesters?", a:"First trimester: weeks 1-12 (organ formation). Second trimester: weeks 13-27 (growth and movement). Third trimester: weeks 28-40 (final development and preparation for birth)." },
  ],
  "one-rep-max-calculator": [
    { q:"What is 1RM?", a:"One Rep Max (1RM) is the maximum weight you can lift for a single repetition with proper form. It's used to program training percentages for strength and hypertrophy." },
    { q:"How accurate are 1RM estimations?", a:"Estimates are most accurate with 1-5 reps. Beyond 10 reps, accuracy decreases significantly. The Epley and Brzycki formulas are within 5% accuracy for low rep ranges." },
  ],
  "period-calculator": [
    { q:"How long is a normal menstrual cycle?", a:"Normal cycles range from 21-35 days, with 28 days being the average. Cycle length can vary month to month. Tracking 3+ cycles helps identify your personal pattern." },
    { q:"When is the fertile window?", a:"Ovulation typically occurs about 14 days BEFORE your next period. The fertile window spans approximately 5 days before ovulation through 1 day after." },
  ],
  "gpa-calculator": [
    { q:"How is GPA calculated?", a:"GPA = Sum of (Grade Points × Credit Hours) ÷ Total Credit Hours. Each letter grade corresponds to a point value: A=4.0, B=3.0, C=2.0, D=1.0, F=0." },
    { q:"What GPA do you need for Dean's List?", a:"Most universities require a GPA of 3.5-3.7 or higher for Dean's List. Requirements vary by institution — check your university's specific criteria." },
  ],
  "grade-calculator": [
    { q:"How do I calculate my final grade?", a:"Multiply each assignment grade by its weight (percentage), sum all weighted scores, then divide by the total weight. For example: Midterm (30% × 85) + Final (40% × 90) + Homework (30% × 95) = 90." },
  ],
  "final-grade-calculator": [
    { q:"What grade do I need on my final exam?", a:"Required Grade = (Target Grade - Current Grade × (1 - Final Weight)) ÷ Final Weight. If your current average is 80%, your target is 85%, and the final is worth 30%, you need a 96.7%." },
  ],
  "cgpa-percentage-calculator": [
    { q:"How do I convert CGPA to percentage?", a:"The most common formula is Percentage = CGPA × 9.5. However, different universities use different multipliers. VTU uses (CGPA × 10) - 5. HEC Pakistan uses CGPA × 10." },
  ],
  "scientific-calculator": [
    { q:"What is DEG vs RAD mode?", a:"DEG (degrees) uses the 360° system. RAD (radians) uses the 2π system. Most everyday calculations use degrees. Scientific and engineering formulas often use radians." },
    { q:"What operations does this calculator support?", a:"Basic arithmetic, trigonometric functions (sin, cos, tan), logarithms (log, ln), square root, exponents, constants (π, e), and parenthetical expressions." },
  ],
  "statistics-calculator": [
    { q:"What is the difference between mean and median?", a:"Mean is the arithmetic average. Median is the middle value when sorted. Median is more robust against outliers — use it when data is skewed." },
    { q:"What is standard deviation?", a:"Standard deviation measures how spread out values are from the mean. A low SD means data points cluster near the mean; high SD means they're spread out. About 68% of data falls within 1 SD of the mean." },
  ],
  "quadratic-calculator": [
    { q:"What is the quadratic formula?", a:"x = (-b ± √(b² - 4ac)) / 2a. It solves any equation of the form ax² + bx + c = 0 and gives up to two roots (solutions)." },
    { q:"What is the discriminant?", a:"The discriminant (Δ = b² - 4ac) determines the nature of roots. Δ > 0: two real roots. Δ = 0: one repeated root. Δ < 0: no real roots (complex roots)." },
  ],
  "pythagorean-calculator": [
    { q:"What is the Pythagorean theorem?", a:"a² + b² = c², where c is the hypotenuse (longest side) of a right triangle. It only applies to right-angled triangles (one 90° angle)." },
  ],
  "fraction-calculator": [
    { q:"How do I add fractions with different denominators?", a:"Find a common denominator by multiplying the denominators: a/b + c/d = (ad + bc) / bd. Then simplify by dividing numerator and denominator by their GCD." },
  ],
  "area-calculator": [
    { q:"How do I calculate the area of a circle?", a:"Area = π × r², where r is the radius. For example, a circle with radius 5cm has area = 3.14159 × 25 = 78.54 cm²." },
  ],
  "prime-number-checker": [
    { q:"What is a prime number?", a:"A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself. Examples: 2, 3, 5, 7, 11, 13. The number 2 is the only even prime." },
  ],
  "length-converter": [
    { q:"How do I convert inches to centimeters?", a:"Multiply inches by 2.54. For example, 12 inches = 12 × 2.54 = 30.48 cm. Conversely, divide cm by 2.54 to get inches." },
  ],
  "weight-converter": [
    { q:"How do I convert pounds to kilograms?", a:"Divide pounds by 2.205 (or multiply by 0.4536). For example, 150 lbs = 150 ÷ 2.205 = 68.04 kg." },
  ],
  "temperature-converter": [
    { q:"How do I convert Celsius to Fahrenheit?", a:"°F = (°C × 9/5) + 32. For example, 100°C = (100 × 1.8) + 32 = 212°F. For a quick estimate, double the Celsius and add 30." },
    { q:"What is absolute zero?", a:"Absolute zero is 0 Kelvin (-273.15°C / -459.67°F). It's the theoretical lowest possible temperature where all molecular motion stops." },
  ],
  "speed-converter": [
    { q:"How do I convert km/h to mph?", a:"Divide km/h by 1.609. For example, 100 km/h = 62.14 mph. To go the other way, multiply mph by 1.609." },
  ],
  "data-storage-converter": [
    { q:"What is the difference between KB and KiB?", a:"KB (kilobyte) = 1,000 bytes (decimal). KiB (kibibyte) = 1,024 bytes (binary). This calculator uses binary (1 KB = 1,024 B), which is how operating systems report storage." },
  ],
  "age-calculator": [
    { q:"How is exact age calculated?", a:"We calculate years, months, and days between your date of birth and today, accounting for varying month lengths and leap years for precise results." },
    { q:"How is zodiac sign determined?", a:"Zodiac signs are based on the position of the sun at birth. Each sign spans roughly 30 days. For example, Aries covers March 21 – April 19." },
  ],
  "date-difference-calculator": [
    { q:"How do I calculate business days between two dates?", a:"Count all days excluding Saturdays, Sundays, and public holidays. Our calculator has a business-days-only mode that handles this automatically." },
  ],
  "countdown-calculator": [
    { q:"How does the countdown timer work?", a:"Enter any future date and the calculator shows a live countdown in days, hours, minutes, and seconds — updating in real-time." },
  ],
  "work-hours-calculator": [
    { q:"How do I calculate monthly work hours?", a:"Daily hours × days per week × 52 weeks ÷ 12 months. For a standard 8h/day, 5 days/week: 8 × 5 × 52 ÷ 12 = 173.3 hours/month." },
  ],
  "fuel-cost-calculator": [
    { q:"How is fuel cost calculated?", a:"Fuel Cost = (Distance ÷ Fuel Efficiency) × Price per Litre. For example, a 200km trip at 15km/L with fuel at ₹100/L costs 200÷15×100 = ₹1,333." },
  ],
  "ev-charging-calculator": [
    { q:"How long does it take to charge an EV?", a:"Charge time = Battery Capacity (kWh) ÷ Charger Power (kW). A 60kWh battery on a 7kW home charger takes ~8.5 hours. DC fast chargers (50-150kW) can charge to 80% in 30-60 minutes." },
  ],
  "random-number-generator": [
    { q:"Are these random numbers truly random?", a:"We use the browser's crypto.getRandomValues() API, which provides cryptographically secure pseudo-random numbers suitable for most applications including games and simulations." },
  ],
  "password-generator": [
    { q:"What makes a strong password?", a:"Length (12+ characters), mix of uppercase, lowercase, numbers, and symbols. Our generator uses cryptographically secure randomness. A 16-character password with all character types has ~100 bits of entropy." },
    { q:"What is password entropy?", a:"Entropy measures password strength in bits. Higher = stronger. Entropy = Length × log₂(Character Set Size). 80+ bits is considered strong. 128+ bits is virtually uncrackable." },
  ],
  "roman-numeral-converter": [
    { q:"What is the range for Roman numerals?", a:"Standard Roman numerals represent numbers from 1 (I) to 3,999 (MMMCMXCIX). Numbers above 3,999 require vinculum notation (overline bars) which is not standard." },
  ],
  "word-counter": [
    { q:"How is reading time calculated?", a:"Average reading speed is ~200 words per minute (WPM) for adults. Speaking speed averages ~130 WPM. We calculate both reading and speaking time based on your word count." },
  ],
  "base64-encoder": [
    { q:"What is Base64 encoding?", a:"Base64 converts binary data into ASCII text using 64 characters (A-Z, a-z, 0-9, +, /). It's used to embed images in HTML/CSS, transmit data in URLs, and encode email attachments." },
    { q:"Does Base64 encrypt data?", a:"No. Base64 is encoding, not encryption. It's easily reversible and provides zero security. Anyone can decode Base64 text. Use encryption (AES, RSA) for security." },
  ],
};
