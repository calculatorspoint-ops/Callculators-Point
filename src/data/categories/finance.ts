import type { CalculatorConfig } from '../calculatorConfigs';

export const financeCalculators: CalculatorConfig[] = [
  {
  id: 'emi',
  slug: 'loan-emi-calculator',
  cat: 'finance',
  name: 'EMI Calculator',
  icon: '🏦',
  desc: 'Loan installments with amortization chart, prepayment engine & rate comparison',
  popular: true,
  hasChart: true,
  isNew: false,
  formula: 'EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]\n' +
    'Where P is Principal, R is monthly interest rate, and N is the number of months.',
  tips: [
    'Even a small extra monthly payment goes entirely towards the principal, significantly reducing the loan tenure and total interest paid.',
    'An amortization schedule shows exactly how much of each payment goes to principal vs interest.'
  ],
  whenToUse: 'Use this calculator before applying for any home loan, car loan, or personal loan. It helps you understand exactly what your monthly cash outflow will be so you can budget accordingly.',
  resultMeaning: 'The EMI (Equated Monthly Installment) is the exact amount you must pay the bank every month. The "Total Interest" shows how much extra you are paying the bank over the original borrowed amount.',
  limitations: [
    'Does not account for processing fees, insurance premiums, or hidden bank charges.',
    'Assumes a fixed interest rate for the entire loan tenure. Floating rates will change your actual EMI.'
  ],
  examples: [
    { scenario: 'Taking a ₹50,000,000 home loan at 8.5% for 20 years.', result: 'Your monthly EMI will be ₹433,912. Over 20 years, you will pay ₹54,138,793 in pure interest.' },
    { scenario: 'Paying an extra ₹50,000 every month towards the same loan.', result: 'You will finish the 20-year loan in just 14 years and save over ₹15,000,000 in interest.' }
  ],
  howToUse: [
    'Enter your total loan amount (principal).',
    'Enter the annual interest rate offered by the bank.',
    'Select your loan tenure in years or months.',
    'Click Calculate to see your exact EMI and full payment schedule.'
  ],
      about: `The EMI Calculator is specifically engineered to help you analyze your loan installments with a comprehensive amortization chart, prepayment engine, and rate comparison. Stop guessing your future cash flow and use this tool to discover exactly how much interest you will pay over the life of your mortgage or personal loan. It's built for anyone looking to make informed borrowing decisions without relying on bank spreadsheets.`
},
  {
  id: 'compound',
  slug: 'compound-interest-calculator',
  cat: 'finance',
  name: 'Compound Interest',
  icon: '📈',
  desc: 'Investment growth with inflation adj., tax layer, goal-seeking & real vs nominal',
  popular: true,
  hasChart: true,
  isNew: false,
  formula: 'A = P(1 + r/n)^(nt)\n' +
    'Where A is final amount, P is principal, r is annual rate, n is compounding frequency, t is time in years.',
  tips: [
    'Compound interest is interest calculated on the initial principal AND all accumulated interest.',
    'The more frequently interest is compounded (e.g., daily vs annually), the higher the effective yield.'
  ],
  whenToUse: 'Use this when evaluating fixed deposits, savings accounts, or long-term growth investments to understand the snowball effect of compounding over decades.',
  resultMeaning: 'The final amount is your total wealth at the end of the term. The "Total Interest" is the wealth generated purely by the compounding engine doing the work for you.',
  limitations: [
    'Does not guarantee future returns if the interest rate is variable (e.g., stock market returns).',
    'Real purchasing power will be lower due to inflation unless you use the inflation-adjusted view.'
  ],
  examples: [
    { scenario: 'Investing $10,000 at 8% compounded annually for 30 years.', result: 'Your money grows to $100,626. You made over $90,000 purely from interest without adding another dime.' },
    { scenario: 'Adding $500 monthly to that same investment.', result: 'Your final amount explodes to $780,000.' }
  ],
  howToUse: [
    'Enter your initial starting balance.',
    'Set your expected annual interest rate.',
    'Set the compounding frequency (monthly is standard for most accounts).',
    'Optionally, add a regular monthly contribution to see accelerated growth.'
  ],
      about: `The Compound Interest is an essential resource for anyone needing to investment growth with inflation adj., tax layer, goal-seeking & real vs nominal. Designed with simplicity and speed in mind, it performs the heavy lifting behind the scenes so you can focus on making informed decisions. It's completely free, requires no signups, and works seamlessly on any device.`
},
  {
  id: 'sip',
  slug: 'sip-calculator',
  cat: 'finance',
  name: 'SIP Calculator',
  icon: '💹',
  desc: 'SIP corpus with step-up mode, XIRR & 3-scenario simulation',
  popular: true,
  hasChart: true,
  isNew: false,
  formula: 'FV = P × ({[1 + i]^n - 1} / i) × (1 + i)\n' +
    'Where FV is Future Value, P is SIP amount, i is monthly return rate, and n is number of months.',
  tips: [
    'A step-up SIP automatically increases your monthly investment by a certain percentage every year, aligning with your income growth.',
    'Extended Internal Rate of Return (XIRR) is a method used to calculate returns on investments where there are multiple transactions happening at different times.'
  ],
  whenToUse: 'Use this to plan for retirement, children\'s education, or wealth building via mutual funds or index funds over a 5 to 30 year horizon.',
  resultMeaning: 'The results project your estimated future wealth. It separates your "Total Invested" from the "Wealth Gained" to show the power of long-term equity investing.',
  limitations: [
    'Market returns are never linear. A 12% expected return means it might drop 20% one year and rise 30% the next.',
    'Does not account for exit loads or capital gains taxes upon withdrawal.'
  ],
  examples: [
    { scenario: 'Investing ₹10,000 per month at 12% expected return for 20 years.', result: 'Your total investment is ₹24 Lakhs, but your final corpus will be over ₹1 Crore.' },
    { scenario: 'Applying a 10% annual Step-Up to the same SIP.', result: 'By simply increasing your SIP amount by 10% each year, your final corpus jumps to over ₹2 Crores.' }
  ],
  howToUse: [
    'Enter your monthly SIP investment amount.',
    'Input the expected annual return rate (10-12% is historically common for equity funds).',
    'Enter the time horizon in years.',
    'Toggle the Step-Up option if you plan to increase your SIP amount annually.'
  ],
      about: `The SIP Calculator is an essential resource for anyone needing to sIP corpus with step-up mode, XIRR & 3-scenario simulation. Designed with simplicity and speed in mind, it performs the heavy lifting behind the scenes so you can focus on making informed decisions. It's completely free, requires no signups, and works seamlessly on any device.`
},
  {
  id: 'simple-interest',
  slug: 'simple-interest-calculator',
  cat: 'finance',
  name: 'Simple Interest',
  icon: '💲',
  desc: 'SI with flat vs reducing balance comparison & time conversion',
  popular: false,
  hasChart: true,
  isNew: false,
  formula: 'SI = P × R × T / 100\n' +
    'Where P = Principal, R = Annual Rate (%), T = Time in years',
  tips: [
    'Simple interest charges interest only on the original principal, while compound interest charges on principal + accumulated interest.',
    'Flat-rate loans use simple interest — they cost significantly more than reducing-balance loans at the same stated rate.'
  ],
      about: `Stop guessing and start using the Simple Interest to get immediate, accurate data. Specifically engineered to sI with flat vs reducing balance comparison & time conversion, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
},
  {
  id: 'roi',
  slug: 'roi-calculator',
  cat: 'finance',
  name: 'ROI Calculator',
  icon: '💰',
  desc: 'Total & annual ROI with inflation-adjusted real returns',
  popular: false,
  hasChart: true,
  isNew: false,
  formula: 'ROI = [(Final Value - Initial Investment) / Initial Investment] × 100\n' +
    'Annualized ROI = ((Final/Initial)^(1/Years) - 1) × 100',
  tips: [
    'Always compare annualized ROI, not total ROI, when evaluating investments of different durations.'
  ],
      about: `Stop guessing and start using the ROI Calculator to get immediate, accurate data. Specifically engineered to total & annual ROI with inflation-adjusted real returns, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
},
  {
  id: 'salary',
  slug: 'salary-calculator',
  cat: 'finance',
  name: 'Salary Calculator',
  icon: '💼',
  desc: 'Pay period converter with local tax rules, allowances & net take-home',
  popular: true,
  hasChart: false,
  isNew: false,
  privacy: "sensitive",
  tips: [
    "Gross pay is what you earn before taxes and deductions. Net pay is your 'take-home' money after all deductions."
  ],
      about: `Stop guessing and start using the Salary Calculator to get immediate, accurate data. Specifically engineered to pay period converter with local tax rules, allowances & net take-home, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
},
  {
  id: 'discount',
  slug: 'discount-calculator',
  cat: 'finance',
  name: 'Discount Calculator',
  icon: '🏷️',
  desc: 'Stacked multi-discounts, reverse price & tax integration',
  popular: true,
  hasChart: true,
  isNew: false,
  tips: [
    'A stacked discount is applied to the already discounted price, not the original price. E.g., 50% off + 20% off equals 60% total off, not 70%.'
  ],
      about: `If you want to stacked multi-discounts, reverse price & tax integration, the Discount Calculator is your perfect companion. Our advanced online tool replaces tedious manual spreadsheets by delivering instant outputs based on industry-standard formulas. You can use it repeatedly to test different scenarios and optimize your outcomes.`
},
  {
  id: 'profit-margin',
  slug: 'profit-margin-calculator',
  cat: 'finance',
  name: 'Profit Margin',
  icon: '📊',
  desc: 'Gross margin, markup, health indicator & total profit',
  popular: false,
  hasChart: true,
  isNew: false,
  formula: 'Gross Margin = [(Revenue - Cost) / Revenue] × 100\n' +
    'Markup = [(Revenue - Cost) / Cost] × 100',
  tips: [
    'Margin is profit as a percentage of revenue. Markup is profit as a percentage of cost.'
  ],
      about: `Stop guessing and start using the Profit Margin to get immediate, accurate data. Specifically engineered to gross margin, markup, health indicator & total profit, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
},
  {
  id: 'break-even',
  slug: 'break-even-calculator',
  cat: 'finance',
  name: 'Break-Even Calculator',
  icon: '⚖️',
  desc: 'Break-even units & revenue with contribution margin chart',
  popular: false,
  hasChart: true,
  isNew: false,
  formula: 'Break-Even Units = Fixed Costs / (Selling Price - Variable Cost per Unit)',
      about: `The Break-Even Calculator is an essential resource for anyone needing to break-even units & revenue with contribution margin chart. Designed with simplicity and speed in mind, it performs the heavy lifting behind the scenes so you can focus on making informed decisions. It's completely free, requires no signups, and works seamlessly on any device.`
},
  {
  id: 'tax',
  slug: 'tax-calculator',
  cat: 'finance',
  name: 'Tax Calculator',
  icon: '🧾',
  desc: 'Local tax rules auto-applied based on selected currency region',
  popular: true,
  hasChart: false,
  isNew: false,
  privacy: "sensitive",
  tips: [
    'Effective Tax Rate is the actual percentage of your total income paid in taxes, which is usually lower than your top marginal tax bracket.'
  ],
      about: `Stop guessing and start using the Tax Calculator to get immediate, accurate data. Specifically engineered to local tax rules auto-applied based on selected currency region, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
},
  {
  id: 'tip',
  slug: 'tip-calculator',
  cat: 'finance',
  name: 'Tip Calculator',
  icon: '🍽️',
  desc: 'Tip amount, bill split among any group with rounding options',
  popular: false,
  hasChart: false,
  isNew: false,
  tips: [
    'In the US, 15-20% is standard. Many European and Asian countries include service charges in the bill.',
    "When splitting, round up each person's share to the nearest whole number — the server will appreciate it."
  ],
      about: `Whether you're a professional or just looking for quick answers, the Tip Calculator provides an instant solution for your needs. It helps you tip amount, bill split among any group with rounding options. This specialized tool is designed to eliminate manual computation errors and streamline your workflow with precise, step-by-step breakdowns.`
},
  {
  id: 'gst',
  slug: 'gst-calculator',
  cat: 'finance',
  name: 'GST / VAT Calculator',
  icon: '📋',
  desc: 'Add or extract GST/VAT — label auto-changes by region',
  popular: false,
  hasChart: false,
  isNew: false,
  formula: 'GST (Exclusive) = Amount × Rate / 100\n' +
    'GST (Inclusive): Base = Total × 100 / (100 + Rate)',
  tips: [
    'GST-exclusive means tax is added on top. GST-inclusive means the price already includes tax — use the reverse calculation to find the base amount.'
  ],
      about: `Whether you're a professional or just looking for quick answers, the GST / VAT Calculator provides an instant solution for your needs. It helps you add or extract GST/VAT — label auto-changes by region. This specialized tool is designed to eliminate manual computation errors and streamline your workflow with precise, step-by-step breakdowns.`
},
  {
  id: 'mortgage',
  slug: 'mortgage-calculator',
  cat: 'finance',
  name: 'Mortgage Calculator',
  icon: '🏠',
  desc: 'Home loan EMI with amortization, prepayment & rate comparison',
  popular: true,
  hasChart: true,
  isNew: false,
  formula: 'EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]\n' +
    'Where P = Loan Amount, R = Monthly Rate, N = Total Months',
  tips: [
    'Even small prepayments dramatically reduce total interest — paying just 5% extra per month can cut years off your loan.',
    'The first few years of a mortgage, most of your EMI goes to interest — prepayments are most effective early on.'
  ],
      about: `The Mortgage Calculator is an essential resource for anyone needing to home loan EMI with amortization, prepayment & rate comparison. Designed with simplicity and speed in mind, it performs the heavy lifting behind the scenes so you can focus on making informed decisions. It's completely free, requires no signups, and works seamlessly on any device.`
},
  {
  id: 'ppf',
  slug: 'ppf-calculator',
  cat: 'finance',
  name: 'PPF / Savings Calculator',
  icon: '🏛️',
  desc: 'Fixed savings with compound growth and tax-free return visualization',
  popular: false,
  hasChart: true,
  isNew: false,
  formula: 'Maturity = Σ (Annual Deposit × (1 + r)^(N-year))\n' +
    'Where r = annual interest rate, N = total years',
  tips: [
    'PPF enjoys EEE (Exempt-Exempt-Exempt) tax status — your investment, interest, and maturity are all tax-free.'
  ],
      about: `If you want to fixed savings with compound growth and tax-free return visualization, the PPF / Savings Calculator is your perfect companion. Our advanced online tool replaces tedious manual spreadsheets by delivering instant outputs based on industry-standard formulas. You can use it repeatedly to test different scenarios and optimize your outcomes.`
},
  {
  id: 'loan-compare',
  slug: 'loan-comparison-calculator',
  cat: 'finance',
  name: 'Loan Comparison',
  icon: '⚖️',
  desc: 'Compare up to 3 loans side-by-side — total interest, EMI, and tenure',
  popular: true,
  hasChart: true,
  isNew: true,
  tips: [
    "A lower rate doesn't always mean less total cost — check the full tenure interest paid."
  ],
      about: `Stop guessing and start using the Loan Comparison to get immediate, accurate data. Specifically engineered to compare up to 3 loans side-by-side — total interest, EMI, and tenure, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
},
  {
  id: 'retirement',
  slug: 'retirement-calculator',
  cat: 'finance',
  name: 'Retirement Calculator',
  icon: '🏖️',
  desc: 'Calculate your retirement corpus, savings gap, and monthly savings target',
  popular: true,
  hasChart: true,
  isNew: true,
  formula: 'Required Corpus = Annual Expenses × (1+inflation)^years / (real_rate - inflation)\n' +
    '4% Rule: Corpus = 25 × Annual Expenses',
  tips: [
    'Starting 10 years earlier can cut your required monthly savings by more than half.',
    'The 4% rule: a corpus of 25× annual expenses sustains 30+ years of withdrawals.'
  ],
      about: `Stop guessing and start using the Retirement Calculator to get immediate, accurate data. Specifically engineered to calculate your retirement corpus, savings gap, and monthly savings target, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
},
  {
  id: 'fd',
  slug: 'fd-calculator',
  cat: 'finance',
  name: 'FD / Fixed Deposit',
  icon: '🏛️',
  desc: 'Fixed deposit maturity with compound interest, tax deduction and effective yield',
  popular: false,
  hasChart: true,
  isNew: true,
  formula: 'Maturity = P × (1 + r/n)^(n×t)',
  tips: [
    'FD interest is taxable as income. The effective post-tax yield depends on your tax bracket.'
  ],
      about: `Whether you're a professional or just looking for quick answers, the FD / Fixed Deposit provides an instant solution for your needs. It helps you fixed deposit maturity with compound interest, tax deduction and effective yield. This specialized tool is designed to eliminate manual computation errors and streamline your workflow with precise, step-by-step breakdowns.`
},
  {
  id: 'mortgage-payoff',
  slug: 'mortgage-payoff-calculator',
  cat: 'finance',
  name: 'Mortgage Payoff',
  icon: '🏡',
  desc: 'Early mortgage payoff with extra payments — see interest saved and years cut',
  popular: true,
  hasChart: true,
  isNew: true,
  formula: 'Payoff Date with extra payments: recalculate amortization reducing principal faster each month',
  tips: [
    'Even $100 extra/month can save tens of thousands in interest and years off your mortgage.'
  ],
      about: `Whether you're a professional or just looking for quick answers, the Mortgage Payoff provides an instant solution for your needs. It helps you early mortgage payoff with extra payments — see interest saved and years cut. This specialized tool is designed to eliminate manual computation errors and streamline your workflow with precise, step-by-step breakdowns.`
},
  {
  id: 'house-afford',
  slug: 'house-affordability-calculator',
  cat: 'finance',
  name: 'House Affordability',
  icon: '🏘️',
  desc: 'Max affordable home price based on income, debts & DTI rule (28/36)',
  popular: true,
  hasChart: false,
  isNew: true,
  formula: 'Max Home Price = (Monthly Income × 0.28) × 12 / Annual Rate factor\n' +
    'DTI Rule: Total debts ≤ 36% of gross income',
  tips: [
    'Lenders typically allow housing costs up to 28% and total debt up to 36% of gross monthly income.'
  ],
      about: `The House Affordability is an essential resource for anyone needing to max affordable home price based on income, debts & DTI rule (28/36). Designed with simplicity and speed in mind, it performs the heavy lifting behind the scenes so you can focus on making informed decisions. It's completely free, requires no signups, and works seamlessly on any device.`
},
  {
  id: 'rent-vs-buy',
  slug: 'rent-vs-buy-calculator',
  cat: 'finance',
  name: 'Rent vs. Buy',
  icon: '🔑',
  desc: 'Long-term cost comparison of renting vs buying with break-even year',
  popular: true,
  hasChart: true,
  isNew: true,
  tips: [
    'The break-even point is when total buying costs equal total renting costs — typically 5-7 years.'
  ],
      about: `The Rent vs. Buy is an essential resource for anyone needing to long-term cost comparison of renting vs buying with break-even year. Designed with simplicity and speed in mind, it performs the heavy lifting behind the scenes so you can focus on making informed decisions. It's completely free, requires no signups, and works seamlessly on any device.`
},
  {
  id: 'apr',
  slug: 'apr-calculator',
  cat: 'finance',
  name: 'APR Calculator',
  icon: '💳',
  desc: 'Annual Percentage Rate with fees, points and comparison to nominal rate',
  popular: false,
  hasChart: false,
  isNew: true,
  formula: 'APR = ((Fees + Interest) / Principal) / Loan Term × 365 × 100',
  tips: [
    'APR includes fees while interest rate does not — always compare APRs, not just rates.'
  ],
      about: `If you want to annual Percentage Rate with fees, points and comparison to nominal rate, the APR Calculator is your perfect companion. Our advanced online tool replaces tedious manual spreadsheets by delivering instant outputs based on industry-standard formulas. You can use it repeatedly to test different scenarios and optimize your outcomes.`
},
  {
  id: 'down-payment',
  slug: 'down-payment-calculator',
  cat: 'finance',
  name: 'Down Payment Calculator',
  icon: '💵',
  desc: 'Required down payment, PMI threshold, and time to save goal',
  popular: false,
  hasChart: false,
  isNew: true,
      about: `Stop guessing and start using the Down Payment Calculator to get immediate, accurate data. Specifically engineered to required down payment, PMI threshold, and time to save goal, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
},
  {
  id: 'auto-loan',
  slug: 'auto-loan-calculator',
  cat: 'finance',
  name: 'Auto Loan Calculator',
  icon: '🚗',
  desc: 'Car loan EMI with depreciation curve, total cost & best deal analysis',
  popular: true,
  hasChart: true,
  isNew: true,
  formula: 'EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]',
  tips: [
    'A 60-month loan vs 36-month: lower EMI but significantly more total interest paid.'
  ],
      about: `If you want to car loan EMI with depreciation curve, total cost & best deal analysis, the Auto Loan Calculator is your perfect companion. Our advanced online tool replaces tedious manual spreadsheets by delivering instant outputs based on industry-standard formulas. You can use it repeatedly to test different scenarios and optimize your outcomes.`
},
  {
  id: 'personal-loan',
  slug: 'personal-loan-calculator',
  cat: 'finance',
  name: 'Personal Loan Calculator',
  icon: '💸',
  desc: 'Personal loan EMI, total repayment & early closure savings',
  popular: true,
  hasChart: true,
  isNew: true,
      about: `If you want to personal loan EMI, total repayment & early closure savings, the Personal Loan Calculator is your perfect companion. Our advanced online tool replaces tedious manual spreadsheets by delivering instant outputs based on industry-standard formulas. You can use it repeatedly to test different scenarios and optimize your outcomes.`
},
  {
  id: 'student-loan',
  slug: 'student-loan-calculator',
  cat: 'finance',
  name: 'Student Loan Calculator',
  icon: '🎓',
  desc: 'Student loan monthly payments with income-based repayment comparison',
  popular: true,
  hasChart: true,
  isNew: true,
  tips: [
    'Income-driven repayment caps payments at 10-20% of discretionary income and forgives after 20-25 years.'
  ],
      about: `Stop guessing and start using the Student Loan Calculator to get immediate, accurate data. Specifically engineered to student loan monthly payments with income-based repayment comparison, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
},
  {
  id: 'credit-card',
  slug: 'credit-card-calculator',
  cat: 'finance',
  name: 'Credit Card Calculator',
  icon: '💳',
  desc: 'Credit card payoff time with minimum payment trap visualization',
  popular: true,
  hasChart: true,
  isNew: true,
  formula: 'Payoff Months = -log(1 - balance×rate/payment) / log(1 + rate)',
  tips: [
    'Paying only the minimum on a $5,000 balance at 20% APR takes 15+ years and $6,000 in interest.'
  ],
      about: `The Credit Card Calculator is an essential resource for anyone needing to credit card payoff time with minimum payment trap visualization. Designed with simplicity and speed in mind, it performs the heavy lifting behind the scenes so you can focus on making informed decisions. It's completely free, requires no signups, and works seamlessly on any device.`
},
  {
  id: 'debt-payoff',
  slug: 'debt-payoff-calculator',
  cat: 'finance',
  name: 'Debt Payoff Calculator',
  icon: '⚖️',
  desc: 'Multi-debt snowball vs avalanche strategy comparison with payoff timeline',
  popular: true,
  hasChart: true,
  isNew: true,
  tips: [
    'Avalanche method (highest rate first) saves most interest. Snowball (smallest balance first) provides motivation.'
  ],
      about: `Stop guessing and start using the Debt Payoff Calculator to get immediate, accurate data. Specifically engineered to multi-debt snowball vs avalanche strategy comparison with payoff timeline, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
},
  {
  id: 'pv',
  slug: 'present-value-calculator',
  cat: 'finance',
  name: 'Present Value (PV)',
  icon: '⏮️',
  desc: 'Present value of future cash flows with discount rate',
  popular: false,
  hasChart: false,
  isNew: true,
  formula: 'PV = FV / (1 + r)^n',
      about: `The Present Value (PV) is an essential resource for anyone needing to present value of future cash flows with discount rate. Designed with simplicity and speed in mind, it performs the heavy lifting behind the scenes so you can focus on making informed decisions. It's completely free, requires no signups, and works seamlessly on any device.`
},
  {
  id: 'irr',
  slug: 'irr-calculator',
  cat: 'finance',
  name: 'IRR Calculator',
  icon: '📈',
  desc: 'Internal Rate of Return for a series of cash flows — investment viability',
  popular: false,
  hasChart: false,
  isNew: true,
  formula: 'Solve for r where NPV = Σ(CFt / (1+r)^t) = 0 using iterative Newton-Raphson method',
  tips: [
    'IRR above your cost of capital (WACC) means the investment is profitable.'
  ],
      about: `Stop guessing and start using the IRR Calculator to get immediate, accurate data. Specifically engineered to internal Rate of Return for a series of cash flows — investment viability, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
},
  {
  id: '401k',
  slug: '401k-calculator',
  cat: 'finance',
  name: '401(k) Calculator',
  icon: '🏖️',
  desc: '401k growth with employer match, tax-deferred compounding & withdrawal projections',
  popular: true,
  hasChart: true,
  isNew: true,
  tips: [
    "Always contribute at least enough to get the full employer match — it's free money with 100% instant return.",
    'Tax-deferred growth means you pay taxes on withdrawal, not during accumulation.'
  ],
      about: `The 401(k) Calculator is an essential resource for anyone needing to 401k growth with employer match, tax-deferred compounding & withdrawal projections. Designed with simplicity and speed in mind, it performs the heavy lifting behind the scenes so you can focus on making informed decisions. It's completely free, requires no signups, and works seamlessly on any device.`
},
  {
  id: 'commission',
  slug: 'commission-calculator',
  cat: 'finance',
  name: 'Commission Calculator',
  icon: '🤝',
  desc: 'Sales commission with tiered slabs, base salary and total earnings',
  popular: false,
  hasChart: false,
  isNew: true,
  formula: 'Commission = Sales Amount × Rate / 100',
      about: `If you want to sales commission with tiered slabs, base salary and total earnings, the Commission Calculator is your perfect companion. Our advanced online tool replaces tedious manual spreadsheets by delivering instant outputs based on industry-standard formulas. You can use it repeatedly to test different scenarios and optimize your outcomes.`
},
  {
  id: 'depreciation',
  slug: 'depreciation-calculator',
  cat: 'finance',
  name: 'Depreciation Calculator',
  icon: '📉',
  desc: 'Asset depreciation using straight-line, declining balance & sum-of-years methods',
  popular: false,
  hasChart: true,
  isNew: true,
  formula: 'Straight Line: Depreciation = (Cost - Salvage) / Useful Life',
      about: `The Depreciation Calculator is an essential resource for anyone needing to asset depreciation using straight-line, declining balance & sum-of-years methods. Designed with simplicity and speed in mind, it performs the heavy lifting behind the scenes so you can focus on making informed decisions. It's completely free, requires no signups, and works seamlessly on any device.`
},
  {
  id: 'budget',
  slug: 'budget-calculator',
  cat: 'finance',
  name: 'Budget Calculator',
  icon: '📓',
  desc: 'Monthly budget planner with income, expense categories and savings rate',
  popular: true,
  hasChart: true,
  isNew: true,
  tips: [
    'The 50/30/20 rule: 50% needs, 30% wants, 20% savings — a popular starting framework.'
  ],
      about: `Whether you're a professional or just looking for quick answers, the Budget Calculator provides an instant solution for your needs. It helps you monthly budget planner with income, expense categories and savings rate. This specialized tool is designed to eliminate manual computation errors and streamline your workflow with precise, step-by-step breakdowns.`
},
  {
  id: 'college-cost',
  slug: 'college-cost-calculator',
  cat: 'finance',
  name: 'College Cost Calculator',
  icon: '🎓',
  desc: '4-year college cost with tuition inflation, savings gap and monthly savings needed',
  popular: false,
  hasChart: true,
  isNew: true,
  tips: [
    'College tuition typically inflates at 4-6% per year — start saving early to minimize loans.'
  ],
      about: `Whether you're a professional or just looking for quick answers, the College Cost Calculator provides an instant solution for your needs. It helps you 4-year college cost with tuition inflation, savings gap and monthly savings needed. This specialized tool is designed to eliminate manual computation errors and streamline your workflow with precise, step-by-step breakdowns.`
},
  {
  id: 'heloc',
  slug: 'heloc-calculator',
  cat: 'finance',
  name: 'HELOC Calculator',
  icon: '🏡',
  desc: 'Home Equity Line of Credit: available equity, draw period payments and repayment schedule',
  popular: false,
  hasChart: true,
  isNew: true,
  tips: [
    'HELOC rates are variable — always stress-test at +2-3% above current rate.'
  ],
      about: `Stop guessing and start using the HELOC Calculator to get immediate, accurate data. Specifically engineered to home Equity Line of Credit: available equity, draw period payments and repayment schedule, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
},
  {
  id: 'auto-lease',
  slug: 'auto-lease-calculator',
  cat: 'finance',
  name: 'Auto Lease Calculator',
  icon: '🚗',
  desc: 'Monthly lease payment with money factor, residual value and lease vs buy comparison',
  popular: false,
  hasChart: true,
  isNew: true,
  tips: [
    'Money Factor × 2400 = Equivalent APR. Always negotiate the purchase price, not just the monthly payment.'
  ],
      about: `Stop guessing and start using the Auto Lease Calculator to get immediate, accurate data. Specifically engineered to monthly lease payment with money factor, residual value and lease vs buy comparison, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
},
  {
  id: 'bond',
  slug: 'bond-calculator',
  cat: 'finance',
  name: 'Bond Calculator',
  icon: '📊',
  desc: 'Bond price, yield to maturity, current yield, duration and premium/discount analysis',
  popular: false,
  hasChart: true,
  isNew: true,
  tips: [
    'Bond prices and yields move in opposite directions — when rates rise, existing bond prices fall.'
  ],
      about: `If you want to bond price, yield to maturity, current yield, duration and premium/discount analysis, the Bond Calculator is your perfect companion. Our advanced online tool replaces tedious manual spreadsheets by delivering instant outputs based on industry-standard formulas. You can use it repeatedly to test different scenarios and optimize your outcomes.`
},
  {
  id: 'cd',
  slug: 'cd-calculator',
  cat: 'finance',
  name: 'CD Calculator',
  icon: '🏦',
  desc: 'Certificate of Deposit maturity value, interest earned and multi-term comparison chart',
  popular: false,
  hasChart: true,
  isNew: true,
  tips: [ 'Compare APY (not APR) across CD terms to find the best return.' ],
      about: `We built the CD Calculator specifically to certificate of Deposit maturity value, interest earned and multi-term comparison chart. By offering a clean, straightforward interface, it empowers users to generate reliable calculations in seconds. Discover exactly how the numbers align and take advantage of our built-in tips and formulas for complete transparency.`
},
  {
  id: 'roth-ira',
  slug: 'roth-ira-calculator',
  cat: 'finance',
  name: 'Roth IRA Calculator',
  icon: '💰',
  desc: 'Tax-free retirement growth with 2024 contribution limits, age-based projections and withdrawal income',
  popular: true,
  hasChart: true,
  isNew: true,
  tips: [
    '2024 Roth IRA limit: $7,000/yr ($8,000 if 50+). All growth and qualified withdrawals are tax-FREE.'
  ],
      about: `The Roth IRA Calculator is an essential resource for anyone needing to tax-free retirement growth with 2024 contribution limits, age-based projections and withdrawal income. Designed with simplicity and speed in mind, it performs the heavy lifting behind the scenes so you can focus on making informed decisions. It's completely free, requires no signups, and works seamlessly on any device.`
},
  {
  id: 'annuity',
  slug: 'annuity-calculator',
  cat: 'finance',
  name: 'Annuity Calculator',
  icon: '📅',
  desc: 'Present value and future value of fixed payment annuity streams with period visualization',
  popular: false,
  hasChart: true,
  isNew: true,
      about: `The Annuity Calculator is an essential resource for anyone needing to present value and future value of fixed payment annuity streams with period visualization. Designed with simplicity and speed in mind, it performs the heavy lifting behind the scenes so you can focus on making informed decisions. It's completely free, requires no signups, and works seamlessly on any device.`
},
  {
  id: 'pension',
  slug: 'pension-calculator',
  cat: 'finance',
  name: 'Pension Calculator',
  icon: '👴',
  desc: 'Defined benefit pension income by years of service, salary and benefit multiplier',
  popular: false,
  hasChart: false,
  isNew: true,
  tips: [
    'Most defined benefit plans use 1.5-2.5% multiplier per year of service.'
  ],
      about: `Stop guessing and start using the Pension Calculator to get immediate, accurate data. Specifically engineered to defined benefit pension income by years of service, salary and benefit multiplier, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
},
  {
  id: 'social-security',
  slug: 'social-security-calculator',
  cat: 'finance',
  name: 'Social Security',
  icon: '🏛️',
  desc: 'Estimate Social Security benefits by claiming age with break-even analysis and cumulative comparison',
  popular: false,
  hasChart: true,
  isNew: true,
  tips: [ 'Delaying from 62 to 70 increases monthly benefit by up to 77%.' ],
      about: `Whether you're a professional or just looking for quick answers, the Social Security provides an instant solution for your needs. It helps you estimate Social Security benefits by claiming age with break-even analysis and cumulative comparison. This specialized tool is designed to eliminate manual computation errors and streamline your workflow with precise, step-by-step breakdowns.`
},
  {
  id: 'rmd',
  slug: 'rmd-calculator',
  cat: 'finance',
  name: 'RMD Calculator',
  icon: '⏳',
  desc: 'Required Minimum Distribution from retirement accounts at age 73+ using IRS life expectancy tables',
  popular: false,
  hasChart: true,
  isNew: true,
  tips: [
    'Missing an RMD incurs a 25% penalty. First RMD due April 1 following the year you turn 73.'
  ],
      about: `We built the RMD Calculator specifically to required Minimum Distribution from retirement accounts at age 73+ using IRS life expectancy tables. By offering a clean, straightforward interface, it empowers users to generate reliable calculations in seconds. Discover exactly how the numbers align and take advantage of our built-in tips and formulas for complete transparency.`
},
  {
  id: 'estate-tax',
  slug: 'estate-tax-calculator',
  cat: 'finance',
  name: 'Estate Tax Calculator',
  icon: '⚖️',
  desc: 'Federal estate tax with 2024 exemption, deductions and effective rate calculation',
  popular: false,
  hasChart: false,
  isNew: true,
  tips: [
    '2024 federal estate tax exemption: $13.61M per person. Tax rate above exemption is 40%.'
  ],
      about: `Stop guessing and start using the Estate Tax Calculator to get immediate, accurate data. Specifically engineered to federal estate tax with 2024 exemption, deductions and effective rate calculation, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
},
  {
  id: 'marriage-tax',
  slug: 'marriage-tax-calculator',
  cat: 'finance',
  name: 'Marriage Tax Calculator',
  icon: '💍',
  desc: 'Marriage tax bonus or penalty comparing single vs married filing jointly using 2024 US tax brackets',
  popular: false,
  hasChart: true,
  isNew: true,
  tips: [
    'The marriage penalty hits hardest when both spouses earn similar incomes.'
  ],
      about: `We built the Marriage Tax Calculator specifically to marriage tax bonus or penalty comparing single vs married filing jointly using 2024 US tax brackets. By offering a clean, straightforward interface, it empowers users to generate reliable calculations in seconds. Discover exactly how the numbers align and take advantage of our built-in tips and formulas for complete transparency.`
},
  {
  id: 'boat-loan',
  slug: 'boat-loan-calculator',
  cat: 'finance',
  name: 'Boat Loan Calculator',
  icon: '⛵',
  desc: 'Monthly boat loan payment with total cost breakdown including maintenance and insurance estimates',
  popular: false,
  hasChart: true,
  isNew: true,
  tips: [
    'Total cost of boat ownership is typically 10-15% of the boat value per year.'
  ],
      about: `Whether you're a professional or just looking for quick answers, the Boat Loan Calculator provides an instant solution for your needs. It helps you monthly boat loan payment with total cost breakdown including maintenance and insurance estimates. This specialized tool is designed to eliminate manual computation errors and streamline your workflow with precise, step-by-step breakdowns.`
},
  {
  id: 'debt-consolidation',
  slug: 'debt-consolidation-calculator',
  cat: 'finance',
  name: 'Debt Consolidation',
  icon: '🔄',
  desc: 'Consolidate multiple debts into one loan — compare monthly savings, total interest and break-even timeline',
  popular: false,
  hasChart: true,
  isNew: true,
      about: `The Debt Consolidation is an essential resource for anyone needing to consolidate multiple debts into one loan — compare monthly savings, total interest and break-even timeline. Designed with simplicity and speed in mind, it performs the heavy lifting behind the scenes so you can focus on making informed decisions. It's completely free, requires no signups, and works seamlessly on any device.`
},
  {
  id: 'future-value',
  slug: 'future-value-calculator',
  cat: 'finance',
  name: 'Future Value Calculator',
  icon: '📈',
  desc: 'Future value of an investment with lump sum, recurring contributions and compound growth chart',
  popular: true,
  hasChart: true,
  isNew: true,
  tips: [
    'Starting 10 years earlier can double your final portfolio value thanks to compound growth.'
  ],
      about: `The Future Value Calculator is an essential resource for anyone needing to future value of an investment with lump sum, recurring contributions and compound growth chart. Designed with simplicity and speed in mind, it performs the heavy lifting behind the scenes so you can focus on making informed decisions. It's completely free, requires no signups, and works seamlessly on any device.`
},
  {
  id: 'avg-return',
  slug: 'average-return-calculator',
  cat: 'finance',
  name: 'Average Return (CAGR)',
  icon: '📉',
  desc: 'Compound Annual Growth Rate and arithmetic mean return with visual growth comparison',
  popular: false,
  hasChart: true,
  isNew: true,
  tips: [
    'CAGR is always lower than arithmetic mean for volatile investments — use CAGR for realistic projections.'
  ],
      about: `If you want to compound Annual Growth Rate and arithmetic mean return with visual growth comparison, the Average Return (CAGR) is your perfect companion. Our advanced online tool replaces tedious manual spreadsheets by delivering instant outputs based on industry-standard formulas. You can use it repeatedly to test different scenarios and optimize your outcomes.`
},
  {
  id: 'amortization',
  slug: 'amortization-calculator',
  cat: 'finance',
  name: 'Amortization Calculator',
  icon: '📊',
  desc: 'Full loan amortization schedule with month-by-month payment breakdown, principal vs interest chart and extra payment savings',
  popular: true,
  hasChart: true,
  isNew: true,
  formula: 'Monthly Payment = P × r × (1+r)^n / [(1+r)^n - 1]\n' +
    'Where P = Principal, r = monthly rate, n = number of payments',
  tips: [
    'Each extra dollar paid goes 100% to principal, saving years of interest. Even $100/month extra on a 30-year mortgage can save $30,000+.',
    'In early loan years, most of your payment goes to interest — this is why prepayments are most effective at the start.'
  ],
      about: `We built the Amortization Calculator specifically to full loan amortization schedule with month-by-month payment breakdown, principal vs interest chart and extra payment savings. By offering a clean, straightforward interface, it empowers users to generate reliable calculations in seconds. Discover exactly how the numbers align and take advantage of our built-in tips and formulas for complete transparency.`
},
  {
  id: 'tvm',
  slug: 'tvm-calculator',
  cat: 'finance',
  name: 'TVM Calculator',
  icon: '⏳',
  desc: 'Time Value of Money engine — solve for any of PV, FV, PMT, Rate or Periods given the other four',
  popular: false,
  hasChart: false,
  isNew: true,
  formula: 'FV = PV × (1+r)^n + PMT × [(1+r)^n - 1] / r',
  tips: [
    'The TVM calculator is the universal financial engine. It powers loan payments, investment targets, retirement planning and bond pricing.',
    'A dollar today is worth more than a dollar tomorrow — this is the core principle of time value of money.'
  ],
      about: `If you want to time Value of Money engine — solve for any of PV, FV, PMT, Rate or Periods given the other four, the TVM Calculator is your perfect companion. Our advanced online tool replaces tedious manual spreadsheets by delivering instant outputs based on industry-standard formulas. You can use it repeatedly to test different scenarios and optimize your outcomes.`
},
  {
  id: 'investment',
  slug: 'investment-calculator',
  cat: 'finance',
  name: 'Investment Calculator',
  icon: '💹',
  desc: 'Investment growth with inflation adjustment, contribution step-up, tax on gains and real vs nominal return comparison',
  popular: true,
  hasChart: true,
  isNew: true,
  formula: 'Real Return = [(1 + Nominal Rate) / (1 + Inflation Rate)] - 1\n' +
    'FV = PV × (1+r)^n + PMT × [(1+r)^n - 1] / r',
  tips: [
    'Inflation erodes purchasing power — a 7% return with 3% inflation is only a 3.88% real return.',
    'Annual contribution step-up of just 5% per year can nearly double your retirement corpus compared to flat contributions.'
  ],
      about: `If you want to investment growth with inflation adjustment, contribution step-up, tax on gains and real vs nominal return comparison, the Investment Calculator is your perfect companion. Our advanced online tool replaces tedious manual spreadsheets by delivering instant outputs based on industry-standard formulas. You can use it repeatedly to test different scenarios and optimize your outcomes.`
},
  {
  id: 'loan',
  slug: 'loan-calculator',
  cat: 'finance',
  name: 'Loan Calculator',
  icon: '🏦',
  desc: 'Universal loan calculator for personal, business, student and auto loans — monthly payment, total interest and payoff date',
  popular: true,
  hasChart: true,
  isNew: false,
  formula: 'Monthly Payment = P × r × (1+r)^n / [(1+r)^n - 1]',
  tips: [
    'Compare loans using APR (Annual Percentage Rate), not just the monthly payment — APR includes fees and gives the true cost of borrowing.',
    'Shorter loan terms have higher monthly payments but significantly less total interest paid.'
  ],
      about: `If you want to universal loan calculator for personal, business, student and auto loans — monthly payment, total interest and payoff date, the Loan Calculator is your perfect companion. Our advanced online tool replaces tedious manual spreadsheets by delivering instant outputs based on industry-standard formulas. You can use it repeatedly to test different scenarios and optimize your outcomes.`
},
  {
  id: 'nps',
  slug: 'nps-calculator',
  cat: 'finance',
  name: 'NPS Calculator',
  icon: '🏛️',
  desc: 'National Pension System corpus with Tier-I & Tier-II projections, tax savings and annuity income estimate',
  popular: false,
  hasChart: true,
  isNew: true,
  formula: 'Maturity = Contributions × (1 + r)^n compounded annually\n60% lump sum tax-free; 40% used to purchase annuity',
  tips: [
    'NPS offers an additional ₹50,000 deduction under Section 80CCD(1B) over and above the ₹1.5L limit.'
  ],
      about: `We built the NPS Calculator specifically to national Pension System corpus with Tier-I & Tier-II projections, tax savings and annuity income estimate. By offering a clean, straightforward interface, it empowers users to generate reliable calculations in seconds. Discover exactly how the numbers align and take advantage of our built-in tips and formulas for complete transparency.`
},
  {
  id: 'epf',
  slug: 'epf-calculator',
  cat: 'finance',
  name: 'EPF Calculator',
  icon: '🏢',
  desc: 'Employee Provident Fund maturity with employer & employee contributions, interest compounding and tax-free status',
  popular: false,
  hasChart: true,
  isNew: true,
  formula: 'Employee contribution: 12% of basic salary\nEmployer: 8.33% to EPS + 3.67% to EPF\nInterest compounded monthly',
  tips: [
    'EPF enjoys EEE (Exempt-Exempt-Exempt) tax status — contribution, interest and maturity are all tax-free after 5 years.'
  ],
      about: `Stop guessing and start using the EPF Calculator to get immediate, accurate data. Specifically engineered to employee Provident Fund maturity with employer & employee contributions, interest compounding and tax-free status, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
},
  {
  id: 'stock-return',
  slug: 'stock-return-calculator',
  cat: 'finance',
  name: 'Stock Return Calculator',
  icon: '📈',
  desc: 'Stock investment return with dividend reinvestment, capital gains and annualized CAGR comparison',
  popular: false,
  hasChart: true,
  isNew: true,
  formula: 'Total Return = (End Price - Start Price + Dividends) / Start Price × 100\nCAGR = (End/Start)^(1/Years) - 1',
  tips: [
    'Total return includes both price appreciation and dividend income — always compare total return, not just price change.'
  ],
      about: `Whether you're a professional or just looking for quick answers, the Stock Return Calculator provides an instant solution for your needs. It helps you stock investment return with dividend reinvestment, capital gains and annualized CAGR comparison. This specialized tool is designed to eliminate manual computation errors and streamline your workflow with precise, step-by-step breakdowns.`
},
  {
  id: 'npv',
  slug: 'npv-calculator',
  cat: 'finance',
  name: 'NPV Calculator',
  icon: '📊',
  desc: 'Net Present Value of a series of cash flows with IRR comparison and investment decision signal',
  popular: false,
  hasChart: true,
  isNew: true,
  formula: 'NPV = Σ [CFt / (1 + r)^t] - Initial Investment\nPositive NPV = value-creating investment',
  tips: [
    'NPV > 0 means the investment creates value. NPV < 0 means it destroys value at the given discount rate.'
  ],
      about: `The NPV Calculator is an essential resource for anyone needing to net Present Value of a series of cash flows with IRR comparison and investment decision signal. Designed with simplicity and speed in mind, it performs the heavy lifting behind the scenes so you can focus on making informed decisions. It's completely free, requires no signups, and works seamlessly on any device.`
},
  {
  id: 'portfolio-rebalance',
  slug: 'portfolio-rebalance-calculator',
  cat: 'finance',
  name: 'Portfolio Rebalancer',
  icon: '⚖️',
  desc: 'Rebalance a multi-asset portfolio to target allocations — see exact buy/sell amounts needed',
  popular: false,
  hasChart: true,
  isNew: true,
  tips: [
    'Rebalancing once or twice per year is sufficient for most long-term investors.',
    'Use new contributions to rebalance rather than selling — avoids capital gains taxes.'
  ],
      about: `Whether you're a professional or just looking for quick answers, the Portfolio Rebalancer provides an instant solution for your needs. It helps you rebalance a multi-asset portfolio to target allocations — see exact buy/sell amounts needed. This specialized tool is designed to eliminate manual computation errors and streamline your workflow with precise, step-by-step breakdowns.`
},
  {
  id: 'dividend-yield',
  slug: 'dividend-yield-calculator',
  cat: 'finance',
  name: 'Dividend Yield Calculator',
  icon: '💵',
  desc: 'Dividend yield, annual income, payout ratio and dividend growth rate projection',
  popular: false,
  hasChart: true,
  isNew: true,
  formula: 'Dividend Yield = Annual Dividend per Share / Share Price × 100',
  tips: [
    'A high yield (>6%) may signal a dividend cut risk — always check the payout ratio (should be below 80%).'
  ],
      about: `Whether you're a professional or just looking for quick answers, the Dividend Yield Calculator provides an instant solution for your needs. It helps you dividend yield, annual income, payout ratio and dividend growth rate projection. This specialized tool is designed to eliminate manual computation errors and streamline your workflow with precise, step-by-step breakdowns.`
},
];
