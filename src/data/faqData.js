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
};
