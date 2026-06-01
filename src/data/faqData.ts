export const BASE_FAQS: { q: string; a: string }[] = [
  { q:"Is this calculator free to use?", a:"Yes — 100% free with no registration, no login, and no hidden fees. All Calculators Point calculators are permanently free." },
  { q:"How accurate are the results?", a:"Our calculators use industry-standard formulas verified against professional tools. Results are for informational purposes — always verify important financial or health decisions with a qualified professional." },
  { q:"Can I share my calculation?", a:"Yes! Click the Share button on any result to copy a shareable link with your exact inputs pre-filled." },
  { q:"Does Calculators Point store my data?", a:"No. All calculations happen locally in your browser. We never transmit your inputs to any server." },
  { q:"Can I use this on mobile?", a:"Absolutely. Calculators Point is mobile-first — sliders, inputs and charts are all optimized for touch screens." },
];

export const CALC_FAQS: Record<string, { q: string; a: string }[]> = {
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
    { q:"How is GPA calculated?", a:"GPA = Sum of (Grade Points × Credit Hours) ÷ Total Credit Hours. Each letter grade corresponds to a point value: A+=4.0, A=4.0, A-=3.7, B+=3.3, B=3.0, B-=2.7, C+=2.3, C=2.0, D=1.0, F=0.0. A 3-credit A and a 3-credit F average to exactly 2.0." },
    { q:"What GPA do I need for Dean's List?", a:"Most universities require a GPA of 3.5–3.7 or higher for Dean's List. Cum Laude typically starts at 3.5, Magna Cum Laude at 3.7, and Summa Cum Laude at 3.9+. Requirements vary by institution — check your university's catalog." },
    { q:"How can I raise my GPA quickly?", a:"Focus on high-credit courses first — a 4-credit A has more impact than a 1-credit A. Retaking a failed course to replace the F can dramatically improve your GPA. Consistent A/A- performance is more sustainable than sporadic excellence." },
    { q:"What is the difference between semester GPA and cumulative GPA?", a:"Semester GPA reflects only that semester's courses. Cumulative GPA is the weighted average across all completed semesters. Cumulative GPA changes slowly the more credits you've earned." },
  ],
  "marks-percentage-calculator": [
    { q:"How do I calculate percentage from marks?", a:"Percentage = (Total Marks Obtained ÷ Total Maximum Marks) × 100. For example, if you scored 420 out of 500, your percentage = (420 ÷ 500) × 100 = 84%." },
    { q:"What is a distinction percentage?", a:"In most Indian and Pakistani university systems, 75%+ is Distinction, 60-74% is First Division, 50-59% is Second Division, 40-49% is Third Division/Pass, and below 40% is Fail. Standards vary by board and institution." },
    { q:"How does the reverse percentage mode work?", a:"Reverse mode calculates how many total marks you need to achieve a specific percentage. For example, to score 75% on a 500-mark exam, you need 375 marks. Useful for setting study targets." },
    { q:"Can I track multiple subjects separately?", a:"Yes! Add each subject with its own marks and total. The calculator shows per-subject percentage, grade classification, and pass/fail status, plus an overall percentage across all subjects combined." },
  ],
  "attendance-calculator": [
    { q:"What is the minimum attendance required?", a:"Most Indian and Pakistani universities require 75% minimum attendance to appear for semester exams. Some institutions require 80-85%. Always verify with your institution's specific policy." },
    { q:"How many classes can I miss safely?", a:"Safe Bunks = floor(Attended × 100 ÷ MinRequired - TotalHeld). For example, with 30/40 classes (75%), you can't skip any more without falling below 75%. With 38/40 (95%), you have room for several absences." },
    { q:"What does the Bunk Planner mode do?", a:"Bunk Planner shows exactly how many classes you can safely skip per subject without falling below your minimum attendance threshold. It also shows how many classes you need to attend to reach your target percentage." },
    { q:"How is attendance percentage calculated?", a:"Attendance % = (Classes Attended ÷ Total Classes Held) × 100. If you attended 36 out of 48 classes, your attendance = 75%. This is calculated per-subject and overall across all subjects." },
  ],
  "final-grade-calculator": [
    { q:"What grade do I need on my final exam?", a:"Required Grade = (Target% × TotalWeight - CompletedPoints) ÷ PendingWeight × 100. If your current weighted average is 78% with assignments worth 60%, and the final exam is 40%, you need 83.5% on the final to achieve 80% overall." },
    { q:"How do weighted grades work?", a:"Weighted grades multiply each component's score by its percentage weight. Example: Assignments (30% × 85) + Midterm (30% × 78) + Final (40% × ?) = overall. This ensures each component contributes proportionally to your final grade." },
    { q:"What is the best/worst case scenario?", a:"Best Case shows your maximum possible grade if you score 100% on all pending work. Worst Case shows your guaranteed minimum if you score 0% on all pending work. Your actual grade will fall between these two values." },
  ],
  "cgpa-percentage-calculator": [
    { q:"How do I convert CGPA to percentage?", a:"The standard formula is Percentage = CGPA × 9.5, used by many Indian universities per UGC guidelines. HEC Pakistan uses CGPA × 10. VTU Bangalore uses (CGPA × 10) - 5. Anna University uses CGPA × 10. Always verify with your specific institution." },
    { q:"Which CGPA formula should I use?", a:"Select your university system from the dropdown. If your university isn't listed, use Standard (×9.5) for most Indian universities, or ×10 for Pakistani universities. Many employers accept the standard ×9.5 formula." },
    { q:"What is the difference between CGPA and SGPA?", a:"CGPA (Cumulative Grade Point Average) is the overall average across all semesters. SGPA (Semester Grade Point Average) is the GPA for a single semester. CGPA is typically the weighted average of all SGPAs considering credits." },
  ],
  "ielts-band-calculator": [
    { q:"How is the IELTS overall band score calculated?", a:"The overall band is the average of the four sections (Listening, Reading, Writing, Speaking) rounded to the nearest 0.5. Averages that are exactly .25 or above round up. For example, an average of 6.625 rounds to 6.5, while 6.75 rounds to 7.0." },
    { q:"What IELTS score do I need for UK universities?", a:"Most UK universities require Band 6.5–7.5 overall with no section below 6.0 for undergraduate. Postgraduate programs and competitive universities typically require Band 7.0+. Oxford and Cambridge often require 7.5." },
    { q:"What is the difference between Academic and General IELTS?", a:"Academic IELTS is for university admission and professional registration. General Training is for work experience, secondary education, and immigration to Australia, Canada, and New Zealand. Both have the same Listening and Speaking tests; Reading and Writing differ." },
    { q:"Can I use raw scores for Listening and Reading?", a:"Yes! Switch to 'Raw Score' mode and enter the number of correct answers out of 40. The calculator converts these to official IELTS band scores using the official conversion table. Writing and Speaking must be entered as band scores (0–9 in 0.5 steps)." },
    { q:"What IELTS score do I need for Canada PR?", a:"For Canada Express Entry (Federal Skilled Worker), you need minimum CLB 7 which corresponds to IELTS 6.0 in all four sections. Higher scores earn more Comprehensive Ranking System (CRS) points." },
  ],
  "sat-score-calculator": [
    { q:"What is a good SAT score?", a:"The national average is around 1010–1060. A 1200 is above average (74th percentile), 1400 is very strong (95th percentile), and 1500+ is elite (98th+). 'Good' depends on your target universities — research average scores for admitted students." },
    { q:"What is the Digital SAT?", a:"The Digital SAT (launched 2024) replaced the paper SAT. It's shorter (2 hours 14 minutes vs. 3 hours), adaptive by section, and scored the same (400–1600). The Math section still covers Algebra, Advanced Math, Problem Solving & Data Analysis, and Geometry." },
    { q:"How is the SAT score converted to a percentile?", a:"Percentile rank shows what percentage of test takers you scored equal to or better than. A 1400 score is approximately the 95th percentile, meaning you scored higher than 95% of test takers. Percentiles are recalculated periodically by College Board." },
    { q:"How do I improve my SAT score?", a:"Targeted practice is most effective: identify weak areas using official practice tests, use Khan Academy's free personalized SAT prep (official College Board partner), and take 3+ full-length practice tests under real test conditions. Most students improve 50–150 points with 8+ weeks of dedicated prep." },
  ],
  "study-timer": [
    { q:"What is the Pomodoro Technique?", a:"Developed by Francesco Cirillo in the 1980s, the Pomodoro Technique uses 25-minute focused work sessions ('Pomodoros') separated by 5-minute breaks. After 4 Pomodoros, take a longer 15-30 minute break. Research shows this rhythm improves sustained attention and reduces mental fatigue." },
    { q:"How many Pomodoros should I do per day?", a:"Most productive people complete 8–12 Pomodoros (4–6 hours of focused work) per day. Quality matters more than quantity — consistent 2-hour daily sessions often outperform irregular 6-hour marathon sessions." },
    { q:"Can I customize the timer durations?", a:"Yes! Select 'Custom' mode to set your own focus, short break, and long break durations. Popular alternatives include 50/10 (Deep Work mode) and 15/3 (Short Burst mode). Research suggests 90-minute ultradian rhythms for complex problem-solving." },
  ],
  "target-gpa-calculator": [
    { q:"How do I calculate my target GPA?", a:"Required Future GPA = (Target × TotalCredits - CurrentGPA × CurrentCredits) ÷ FutureCredits. If your current GPA is 3.0 with 60 credits and you want 3.5 after 90 total credits, you need: (3.5×90 - 3.0×60) ÷ 30 = (315 - 180) ÷ 30 = 4.5 — which exceeds 4.0, making it impossible without more credits." },
    { q:"Can I realistically improve my GPA significantly in my final year?", a:"It depends on how many credits you've already earned. With 30 credits completed at 2.5 GPA, you can potentially reach 3.5 in the remaining 30 credits by earning a 4.5 (impossible). With fewer completed credits, more change is mathematically possible. Earlier action has exponentially more impact." },
    { q:"What GPA do I need for graduate school?", a:"Most graduate programs require a minimum 3.0 GPA. Competitive programs at top universities prefer 3.5+. Some professional programs (MBA, Law) weight undergraduate institution selectivity alongside GPA. A strong upward trend in your final semesters can offset a lower overall GPA." },
  ],
  "required-grade-calculator": [
    { q:"How do I calculate what grade I need on my final?", a:"Required Final Grade = (Target Overall% × TotalWeight - EarnedPoints) ÷ FinalWeight × 100. If you have 75% in a class (which is worth 70% of your grade) and want 80% overall, and your final is worth 30%: you need (80×100% - 75×70) ÷ 30 = (8000 - 5250) ÷ 30 = 91.7%." },
    { q:"What if the required grade exceeds 100%?", a:"If the required score is over 100%, your target grade is mathematically impossible with your current standing. You'll need to either lower your target, or accept that the best case scenario is your new maximum. The Best Case indicator shows your absolute maximum achievable grade." },
    { q:"How do I handle different grading scales?", a:"Select your institution's grading system from the Scale dropdown. US Letter Grade, UK Classification (First/2:1/2:2), German Grading (1–6), and Percentage-Only systems are all supported. The required grade and grade labels update automatically." },
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

  // ── NEW EDUCATION CALCULATOR FAQs ─────────────────────────────────────────
  "weighted-grade-calculator": [
    { q:"How is a weighted grade calculated?", a:"Weighted Grade = Σ(Score% × Weight%) / 100. Each component contributes proportionally based on its weight. For example, if assignments are 30% of your grade and you scored 85%, they contribute 25.5 points to your final grade out of 100." },
    { q:"What if my weights don't add up to 100%?", a:"If weights sum to less than 100%, the calculator shows a 'projected grade' based only on completed items, normalized against the total entered weight. This is useful for tracking your grade mid-semester before all components are assigned." },
    { q:"How does the what-if mode work?", a:"Leave a score blank for any pending assignment and enter a target grade. The calculator shows the exact score you need on that item to achieve your target. If multiple items are blank, the required score is distributed equally among them." },
    { q:"What's the difference between Weighted Grade and Final Grade calculators?", a:"The Weighted Grade Calculator is more general — you define any mix of components with custom weights. The Final Grade / Required Grade calculator focuses specifically on what you need on remaining work to hit a target. They complement each other." },
  ],
  "gre-score-calculator": [
    { q:"What is a good GRE score?", a:"The average GRE score is around 150 Verbal and 153 Quantitative. For competitive PhD programs, aim for 160+ Verbal and 165+ Quant. For professional Master's programs, 155+ in both is generally competitive. Always check median scores for admitted students at your specific program." },
    { q:"How is the GRE scored?", a:"Verbal and Quantitative Reasoning are each scored on a 130–170 scale in 1-point increments. Analytical Writing is scored 0–6 in 0.5-point increments. There is no penalty for wrong answers. Your total is the sum of Verbal + Quantitative (260–340); AWA is reported separately." },
    { q:"What is the difference between GRE raw and scaled scores?", a:"Raw scores are the number of questions you answer correctly. These are converted to scaled scores (130–170) using equating — a statistical process that adjusts for difficulty across test versions, ensuring scores from different test dates are comparable." },
    { q:"How long are GRE scores valid?", a:"GRE scores are valid for 5 years from the test date. You can send scores to up to 4 universities for free on test day; additional score reports cost $35 each. ETS's ScoreSelect option lets you choose which scores to send." },
  ],
  "toefl-score-calculator": [
    { q:"What is a good TOEFL score?", a:"Most US and UK universities require 80–100 for undergraduate and 90–105 for graduate admission. Top universities (MIT, Harvard, Oxbridge) typically require 100–110+. A score of 110+ is considered excellent. Each university sets its own minimum — always check requirements for your specific program." },
    { q:"How is the TOEFL iBT scored?", a:"Each section (Reading, Listening, Speaking, Writing) is scored 0–30. The total iBT score is the sum of all four sections, ranging from 0–120. Universities set their own minimum thresholds for admission — there is no single 'passing' score." },
    { q:"How does TOEFL compare to IELTS?", a:"TOEFL 100 ≈ IELTS 7.0; TOEFL 110 ≈ IELTS 7.5–8.0; TOEFL 80 ≈ IELTS 6.5. TOEFL is computer-based and American English focused; IELTS offers both paper and computer versions with both British and American English. Both are accepted by most universities worldwide." },
    { q:"What is MyBest™ Score?", a:"MyBest™ Score (SuperScore) combines your highest section scores from all TOEFL attempts within the past 2 years. For example, if you scored 24 Reading in one test and 27 Listening in another, your MyBest™ shows both highs. Many universities now accept MyBest™ scores." },
  ],
  "scholarship-gpa-planner": [
    { q:"How do I calculate the GPA I need each semester to qualify for a scholarship?", a:"Required Semester GPA = (Target GPA × Total Credits − Current GPA × Completed Credits) / Remaining Credits. Example: 2.8 GPA over 60 credits, need 3.2 over 120 credits → required = (3.2×120 − 2.8×60) / 60 = (384 − 168) / 60 = 3.6 per remaining semester." },
    { q:"What if the required semester GPA exceeds 4.0?", a:"If the required GPA per semester exceeds 4.0, the target is mathematically impossible with the given number of remaining semesters and credits. Options: enroll in additional semesters, take more credits per semester, or lower your target GPA." },
    { q:"What GPA is required for most scholarships?", a:"Merit scholarships typically require 3.0–3.5 GPA for renewal. Dean's List and honor scholarships usually require 3.5+. Full-ride scholarships at competitive universities often require 3.7–3.9+. Always verify the specific requirement in your scholarship agreement." },
    { q:"Does this calculator account for grade replacement or retakes?", a:"No — this calculator uses your current cumulative GPA as reported. If your school allows grade replacement for retaken courses, the effect is already reflected in your current GPA. The projection assumes future semesters contribute normally to cumulative GPA." },
  ],
  "assignment-grade-calculator": [
    { q:"How do I calculate my course grade from assignments?", a:"Course Grade = Σ(Assignment Score% × Assignment Weight%) across all items. Example: Homework (20% weight, 90%) + Midterm (35% weight, 78%) + Final (45% weight, 85%) = 18 + 27.3 + 38.25 = 83.55%." },
    { q:"What does 'Drop Lowest' do?", a:"Drop Lowest removes the assignment with the worst percentage score from the calculation and redistributes its weight proportionally among remaining items. This is common in courses where instructors drop one quiz or homework. Toggle it to see how your grade improves." },
    { q:"Why don't my weights sum to 100%?", a:"Many courses add assignments throughout the semester, so early in the term your total assigned weight may be less than 100%. In this case the calculator shows a 'projected grade' normalized against the sum of entered weights — your grade based on completed work only." },
    { q:"How do I calculate the impact of a single assignment?", a:"Each assignment's impact = (Score/MaxScore × Weight). The 'Impact' column shows exactly how many grade points each item adds to your final course grade. High-weight items with low scores have the biggest negative impact on your overall grade." },
  ],
  "cumulative-gpa-calculator": [
    { q:"How is cumulative GPA calculated across multiple semesters?", a:"Cumulative GPA = Total Quality Points / Total Credit Hours. Quality Points per semester = Semester GPA × Credit Hours. Example: Fall (3.2 GPA, 15 credits = 48 QP) + Spring (3.8 GPA, 18 credits = 68.4 QP) → Cumulative = 116.4 / 33 = 3.53." },
    { q:"Why is my cumulative GPA different from the average of my semester GPAs?", a:"Simple averaging is wrong unless you took exactly the same credits each semester. A 4.0 semester with 18 credits impacts your cumulative GPA much more than a 4.0 semester with 12 credits. Always weight by credit hours for accuracy." },
    { q:"How can I predict my future cumulative GPA?", a:"Use the 'Add Planned Semester' feature with expected GPA and credit hours for upcoming semesters. Example: current GPA 3.1 with 60 credits, planning 3.8 in 15 more credits → projected cumulative = (3.1×60 + 3.8×15) / 75 = 3.24." },
    { q:"What is the difference between SGPA and CGPA?", a:"SGPA (Semester GPA) reflects only that semester's courses. CGPA (Cumulative GPA) is your running weighted average across all completed semesters. CGPA is what appears on your official transcript and what graduate schools and employers evaluate." },
  ],
  "act-score-calculator": [
    { q:"What is a good ACT score?", a:"The national average ACT composite is around 20–21. A 24+ is above average (73rd percentile). A 30+ is very strong (93rd percentile). For highly selective universities, aim for 32–36. Research average scores for admitted students at your target schools." },
    { q:"How is the ACT composite score calculated?", a:"Composite ACT = average of English + Mathematics + Reading + Science (each 1–36), rounded to the nearest whole number. The optional Writing test (2–12) is NOT included in the composite. Many colleges allow superscoring — combining best section scores from multiple attempts." },
    { q:"What are ACT College Readiness Benchmarks?", a:"ACT's official benchmarks indicate readiness for first-year college courses: English 18 (50% chance of B+ in English Composition), Math 22 (College Algebra), Reading 22 (Social Sciences), Science 23 (Biology). Meeting all four is a strong indicator of college readiness." },
    { q:"Should I take the ACT or SAT?", a:"Both are accepted equally by US colleges. Take both once — most students score relatively higher on one test. ACT suits students stronger in science who prefer straightforward questions with time pressure. SAT suits those stronger in verbal reasoning and reading comprehension." },
  ],
  "test-score-calculator": [
    { q:"How do I convert marks to percentage?", a:"Percentage = (Marks Obtained / Total Maximum Marks) × 100. For multi-subject exams, calculate overall percentage using total obtained across all subjects divided by the total maximum — not the average of individual percentages, which would be mathematically incorrect." },
    { q:"What grading scale should I use?", a:"Select the scale that matches your institution. US Letter Grade is standard for American schools. Pakistani/Indian uses Distinction (80%+), A1 (70%+), A (60%+). UK uses First (70%+), Upper Second (60%+), Lower Second (50%+). Custom lets you set your own pass threshold." },
    { q:"What is a distinction in Pakistani and Indian grading?", a:"In most Pakistani and Indian university systems: Distinction = 80%+, A1 = 70–79%, A = 60–69%, B = 50–59%, C = 40–49%, Fail = below 40%. Standards vary significantly by university and board — always verify with your institution's specific grading policy." },
    { q:"How do I calculate GPA equivalent from a percentage?", a:"Approximate 4.0 scale: A+(97-100%)=4.0, A(93-96%)=4.0, A-(90-92%)=3.7, B+(87-89%)=3.3, B(83-86%)=3.0, B-(80-82%)=2.7, C+(77-79%)=2.3, C(73-76%)=2.0, D(60-69%)=1.0, F(below 60%)=0.0." },
  ],
  "gpa-converter": [
    { q:"How do I convert a 4.0 GPA to a 10-point scale?", a:"Normalize your GPA to a 0–1 range: normalized = GPA / 4.0. Then multiply by 10: 10-point = normalized × 10. Example: 3.5/4.0 = 0.875 × 10 = 8.75. Note: many Indian universities use CGPA × 9.5 for percentage conversion, which is different from this scale conversion." },
    { q:"How does the German grading scale work?", a:"German grades are inverse — 1.0 is the best (equivalent to A+) and 5.0 is fail (equivalent to F). Conversion: normalized = (5 - german_grade) / 4. So a German 1.3 = (5-1.3)/4 = 0.925 normalized ≈ 3.7 on a 4.0 scale." },
    { q:"What is the Australian 7-point GPA scale?", a:"Australian universities use a 7-point scale: 7=High Distinction (85%+), 6=Distinction (75-84%), 5=Credit (65-74%), 4=Pass (50-64%), 1-3=Fail. Approximate conversion: Australian 7 ≈ US 4.0, Australian 5 ≈ US 3.0, Australian 4 ≈ US 2.0." },
    { q:"Is my international GPA accepted by universities abroad?", a:"Most Western universities accept international transcripts and use professional evaluators (WES in North America, NARIC in UK) to assess foreign credentials. Always include both your native GPA on its scale AND the converted equivalent, along with official transcripts." },
  ],
  "class-rank-calculator": [
    { q:"How is class rank estimated?", a:"Class rank estimates how many classmates have a higher GPA than you (students above), then adds 1 (rank = students above + 1). Based on a GPA distribution for your school type, the calculator interpolates within each GPA bucket to provide an estimated rank and percentile." },
    { q:"Do all high schools report class rank?", a:"No — roughly 40% of US high schools no longer report class rank. In that case, this calculator gives an estimated rank for applications to schools that ask. Test scores and GPA matter more than rank at most colleges, especially those with test-optional policies." },
    { q:"What class rank do I need for selective colleges?", a:"Most highly selective universities (top 25) prefer students in the top 10%. State flagship universities often auto-admit the top 10-25%. For top-50 universities, top 25% is generally competitive alongside strong test scores." },
    { q:"How do I find my actual class rank?", a:"Your actual class rank is determined by your school's registrar using official grade data for your entire class. Ask your school counselor — they can provide your official rank or percentile, which carries much more weight than any estimated rank tool." },
  ],
  "study-schedule-planner": [
    { q:"How does the study schedule planner allocate hours?", a:"Hours are allocated proportionally based on a Priority × Difficulty weight matrix (High+Hard=9 down to Low+Easy=1). Each subject's share = (subject weight / total weight) × your weekly available hours. More urgent and harder subjects automatically receive more study time." },
    { q:"How many hours should I study per day?", a:"Research suggests 4–6 hours of focused, high-quality study per day is optimal for most students. More than 6 hours yields diminishing returns. Consistency matters more than volume — 2 hours daily for a month beats 14 hours the night before an exam." },
    { q:"What's the best way to distribute study sessions?", a:"Aim for no more than 2-hour blocks per subject with 10-minute breaks. Study the most difficult subject first when your focus is sharpest. Leave the 1–2 days before each exam for review and practice questions, not new material." },
    { q:"Should I study all subjects every day?", a:"Not necessarily. For subjects with exams far away (>2 weeks), every other day is sufficient. Focus more daily time on subjects with exams within 1 week. Spaced repetition — reviewing material at increasing intervals — significantly improves long-term retention versus daily cramming." },
  ],
  "gmat-score-calculator": [
    { q:"What is the GMAT Focus Edition?", a:"Launched in 2024, the GMAT Focus Edition replaced the legacy GMAT. It's shorter (2 hours 15 minutes), has three sections — Quantitative Reasoning, Verbal Reasoning, Data Insights (each 60–90) — and a total score of 205–805. Integrated Reasoning and Analytical Writing were removed." },
    { q:"What GMAT score do I need for top MBA programs?", a:"M7 programs (Harvard, Wharton, Booth, Kellogg, Sloan, Columbia, Stanford) typically see median GMAT scores of 720–740. Top-25 programs average 680–720. Top-50 programs average 640–680. Always aim to be at or above the published median score for your target school." },
    { q:"How are GMAT Focus Edition scores converted from the legacy GMAT?", a:"GMAC provides an official concordance table. Approximately: Focus 805 ≈ Legacy 800; Focus 755 ≈ Legacy 750; Focus 705 ≈ Legacy 700; Focus 655 ≈ Legacy 650. Always check your target school's stated policy on which format they accept." },
    { q:"How many times can I take the GMAT?", a:"You can take the GMAT up to 5 times in a rolling 12-month period, with a maximum of 8 lifetime attempts. A significant improvement (50+ points) on a retake generally helps your application." },
  ],
  "pass-fail-calculator": [
    { q:"How do I calculate what score I need to pass?", a:"Required Score = (Pass Mark × 100 − Current Average × Completed Weight%) / Remaining Weight% × 100. Example: pass mark 50%, current average 40% on 60% completed weight, remaining 40%: required = (50×100 − 40×60) / 40 = (5000 − 2400) / 40 = 65%." },
    { q:"What if the required score is over 100%?", a:"If the required score exceeds 100%, your current standing makes passing mathematically impossible. Options: speak to your instructor about extra credit, consider course withdrawal before the deadline, or plan to retake the course next semester." },
    { q:"What does 'Guaranteed Pass' mean?", a:"Guaranteed Pass means even if you score 0% on all remaining assessments, you will still pass based on your current standing. It doesn't mean you should stop studying — a higher grade may affect your GPA, scholarship eligibility, or academic standing." },
    { q:"How does assessment weight affect my passing chances?", a:"High-weight assessments (like finals worth 40–50%) dramatically affect your outcome. If a large portion of your grade is still pending, your current average is less predictive. The calculator accounts for the exact weight of remaining work to give an accurate required score." },
  ],
  "reading-level-calculator": [
    { q:"What is the Flesch-Kincaid grade level?", a:"FK Grade Level = 0.39×(words/sentences) + 11.8×(syllables/words) − 15.59. It estimates what US school grade a student needs to understand the text easily. A result of '8' means an 8th grader (age 13-14) should understand it without difficulty." },
    { q:"What is the Flesch Reading Ease score?", a:"Reading Ease scores text 0–100: 90–100 is very easy (5th grade), 60–70 is standard (8th–9th grade), 30–50 is difficult (college level), 0–30 is very confusing (graduate level). Higher scores = easier to read. Most newspapers target 60–70." },
    { q:"How are syllables counted?", a:"The calculator approximates syllables by counting groups of consecutive vowels (a, e, i, o, u) in each word, with adjustments for common patterns. This approximation is accurate enough for Flesch-Kincaid analysis — typically within 3–5% of manual counts." },
    { q:"What reading level should my academic essay be?", a:"Academic writing for college and above typically falls between grade levels 12–16. However, clarity is more important than complexity — even scholarly writing benefits from shorter sentences and precise vocabulary. Grade level 10–13 is considered clear academic writing." },
  ],
  "college-admission-estimator": [
    { q:"How accurate is the college admission estimator?", a:"This tool provides rough estimates only. Real admissions decisions involve dozens of holistic factors including personal essays, letters of recommendation, demonstrated interest, institutional priorities, geographic diversity, first-generation status, and more. Use this as a framework, not a prediction." },
    { q:"What is a Safety, Match, and Reach school?", a:"Safety school: your academic profile exceeds their median admitted student. Match school: your profile aligns with their typical admitted student. Reach school: your profile is below or at their median — admission is possible but uncertain. Aim for 2–3 of each category." },
    { q:"How much do extracurriculars affect college admission?", a:"At highly selective schools (acceptance rate < 20%), extracurriculars can be the differentiating factor among academically similar candidates. Depth matters more than breadth — sustained commitment to 2–3 activities with leadership roles carries more weight than superficial participation in many." },
    { q:"Does legacy status help with college admission?", a:"Studies show legacy status provides a modest advantage at some private universities, though many are moving away from this practice. Even with legacy status, you still need competitive academic credentials. Public universities generally give no advantage for legacy applicants." },
  ],
};
