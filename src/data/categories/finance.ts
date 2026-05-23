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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  tips: [
    "Gross pay is what you earn before taxes and deductions. Net pay is your 'take-home' money after all deductions."
  ]
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
  ]
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
  ]
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
  formula: 'Break-Even Units = Fixed Costs / (Selling Price - Variable Cost per Unit)'
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
  tips: [
    'Effective Tax Rate is the actual percentage of your total income paid in taxes, which is usually lower than your top marginal tax bracket.'
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
},
  {
  id: 'heloc',
  slug: 'heloc-calculator',
  cat: 'finance',
  name: 'HELOC Calculator',
  icon: '🏦',
  desc: 'Home equity line of credit payments — draw period and repayment phase',
  popular: false,
  hasChart: true,
  isNew: true
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
  isNew: true
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
  ]
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
  isNew: true
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
  ]
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
  ]
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
  ]
},
  {
  id: 'debt-consolidation',
  slug: 'debt-consolidation-calculator',
  cat: 'finance',
  name: 'Debt Consolidation',
  icon: '🔗',
  desc: 'Compare consolidation loan vs individual debts — total cost and monthly savings',
  popular: false,
  hasChart: true,
  isNew: true
},
  {
  id: 'auto-lease',
  slug: 'auto-lease-calculator',
  cat: 'finance',
  name: 'Auto Lease Calculator',
  icon: '🚙',
  desc: 'Car lease monthly payment with money factor, residual & total cost vs buy',
  popular: false,
  hasChart: false,
  isNew: true,
  formula: 'Monthly Payment = (Selling Price - Residual + Fees) / Months + (Selling Price + Residual) × Money Factor'
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
  formula: 'PV = FV / (1 + r)^n'
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
  ]
},
  {
  id: 'bond',
  slug: 'bond-calculator',
  cat: 'finance',
  name: 'Bond Calculator',
  icon: '📜',
  desc: 'Bond price, yield to maturity, current yield & duration',
  popular: false,
  hasChart: false,
  isNew: true,
  formula: 'Bond Price = Σ(Coupon / (1+r)^t) + Face Value / (1+r)^n'
},
  {
  id: 'cd',
  slug: 'cd-calculator',
  cat: 'finance',
  name: 'CD / Certificate of Deposit',
  icon: '🏦',
  desc: 'CD maturity value with APY comparison across term lengths',
  popular: false,
  hasChart: true,
  isNew: true
},
  {
  id: 'avg-return',
  slug: 'average-return-calculator',
  cat: 'finance',
  name: 'Average Return Calculator',
  icon: '📊',
  desc: 'Arithmetic vs geometric average return on investment portfolio',
  popular: false,
  hasChart: false,
  isNew: true,
  formula: 'CAGR = (End Value / Start Value)^(1/Years) - 1'
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
  ]
},
  {
  id: 'roth-ira',
  slug: 'roth-ira-calculator',
  cat: 'finance',
  name: 'Roth IRA Calculator',
  icon: '💼',
  desc: 'Roth IRA tax-free growth with contribution limits and income phase-out',
  popular: false,
  hasChart: true,
  isNew: true,
  tips: [
    'Roth IRA contributions are after-tax but withdrawals in retirement are 100% tax-free.'
  ]
},
  {
  id: 'pension',
  slug: 'pension-calculator',
  cat: 'finance',
  name: 'Pension Calculator',
  icon: '👴',
  desc: 'Defined benefit pension monthly income estimate with years of service formula',
  popular: false,
  hasChart: false,
  isNew: true
},
  {
  id: 'annuity',
  slug: 'annuity-calculator',
  cat: 'finance',
  name: 'Annuity Calculator',
  icon: '♾️',
  desc: 'Annuity present value, future value, payment & accumulated value',
  popular: false,
  hasChart: true,
  isNew: true,
  formula: 'PV Annuity = PMT × [1-(1+r)^-n]/r'
},
  {
  id: 'rmd',
  slug: 'rmd-calculator',
  cat: 'finance',
  name: 'RMD Calculator',
  icon: '📋',
  desc: 'Required Minimum Distribution from IRA/401k using IRS life expectancy tables',
  popular: false,
  hasChart: false,
  isNew: true,
  formula: 'RMD = Account Balance / IRS Life Expectancy Factor'
},
  {
  id: 'social-security',
  slug: 'social-security-calculator',
  cat: 'finance',
  name: 'Social Security Calculator',
  icon: '🏛️',
  desc: 'Estimated Social Security benefit based on earnings history and claiming age',
  popular: false,
  hasChart: false,
  isNew: true,
  tips: [
    'Claiming at 70 instead of 62 can increase monthly benefits by up to 77%.'
  ]
},
  {
  id: 'estate-tax',
  slug: 'estate-tax-calculator',
  cat: 'finance',
  name: 'Estate Tax Calculator',
  icon: '📜',
  desc: 'Federal estate tax estimate with exemption threshold and marginal rates',
  popular: false,
  hasChart: false,
  isNew: true
},
  {
  id: 'marriage-tax',
  slug: 'marriage-tax-calculator',
  cat: 'finance',
  name: 'Marriage Tax Calculator',
  icon: '💍',
  desc: 'Marriage tax bonus or penalty — compare single vs married filing status',
  popular: false,
  hasChart: false,
  isNew: true
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
  formula: 'Commission = Sales Amount × Rate / 100'
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
  formula: 'Straight Line: Depreciation = (Cost - Salvage) / Useful Life'
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
  ]
},
  {
  id: 'boat-loan',
  slug: 'boat-loan-calculator',
  cat: 'finance',
  name: 'Boat Loan Calculator',
  icon: '⛵',
  desc: 'Marine loan EMI with insurance cost and total ownership cost analysis',
  popular: false,
  hasChart: false,
  isNew: true
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
  ]
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
  ]
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
  ]
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
  ]
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
  tips: [ 'Compare APY (not APR) across CD terms to find the best return.' ]
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
  ]
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
  isNew: true
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
  ]
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
  tips: [ 'Delaying from 62 to 70 increases monthly benefit by up to 77%.' ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  isNew: true
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
},
];
