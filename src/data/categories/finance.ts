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
  intro: 'The EMI Calculator computes your exact monthly loan installment using the standard reducing-balance formula used by Indian and international banks. Enter your principal, rate, and tenure to get your EMI, total interest payable, and a full month-by-month amortization schedule. It\'s useful before applying for home loans, car loans, or personal loans to budget your cash flow accurately.',
  metaTitle: 'Free EMI Calculator Online — Loan Installment & Amortization',
  metaDescription: 'Calculate your exact EMI for home, car, and personal loans. Full amortization schedule, prepayment savings, and multi-loan comparison. 100% free.',
  about: `An EMI (Equated Monthly Installment) is the fixed monthly payment you make to a lender until the loan is fully repaid. It is calculated using the reducing-balance method, meaning each payment chips away at the principal, which in turn reduces the interest you owe next month. The standard formula — EMI = [P × R × (1+R)^N] / [(1+R)^N − 1] — is used by virtually all scheduled banks and housing finance companies.\n\nThe amortization schedule is arguably the most valuable output this calculator provides. It shows you, month by month, exactly how much of your payment goes to principal versus interest. In the early months of a long home loan, over 80% of your EMI may go to interest — understanding this helps you see why prepayments are so impactful at the beginning of a loan.\n\nThis calculator also includes a prepayment engine. Enter any lump-sum payment to instantly see how many months it shaves off your tenure and how much total interest you save. Even one prepayment of ₹1–2 lakhs in the first two years of a ₹50L home loan can save ₹4–6 lakhs in interest over the life of the loan.`,
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
  intro: 'The Compound Interest Calculator shows exactly how money grows when interest is earned on both the original principal and the accumulated interest. Set the compounding frequency — daily, monthly, quarterly, or annually — to see how much the schedule alone affects your final balance. It\'s used by investors to evaluate fixed deposits, savings accounts, and long-term wealth-building plans.',
  metaTitle: 'Free Compound Interest Calculator Online',
  metaDescription: 'Calculate compound interest with daily, monthly, or annual compounding. See how ₹1 lakh grows over 10, 20, or 30 years. Inflation-adjusted view included.',
  about: `Compound interest is the process of earning interest on your interest — each period\'s interest is added to the principal and then itself earns interest in the next period. This compounding effect is what Einstein reputedly called the \'eighth wonder of the world,\' and it\'s why the difference between starting to invest at 25 versus 35 can be worth millions of rupees or dollars at retirement.\n\nThe compounding frequency matters significantly. A fixed deposit compounding quarterly at 7% annually produces more interest than one compounding annually at the same rate. This calculator lets you compare any compounding schedule and includes an inflation-adjusted \'real return\' toggle, so you can see what your money will actually be worth in today\'s purchasing power.\n\nThe goal-seeking mode works in reverse: enter your target corpus and it calculates the principal you need to invest today, or the number of years required to reach that goal at a given rate. This makes it practical for retirement planning, college fund projections, and any long-term saving objective.`,
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
  intro: 'The SIP Calculator shows how a fixed monthly investment in a mutual fund grows over time using compound growth. Enter your SIP amount, expected annual return, and investment horizon to see your estimated corpus — plus a step-up option to model annual increases in your SIP amount aligned to income growth.',
  metaTitle: 'Free SIP Calculator Online — Mutual Fund Corpus Planner',
  metaDescription: 'Calculate SIP returns with step-up, XIRR, and 3-scenario simulation. See how ₹5,000/month grows over 10, 20, or 30 years. Free online SIP planner.',
  about: `A Systematic Investment Plan (SIP) allows investors to invest a fixed amount at regular intervals — typically monthly — into a mutual fund scheme. Returns are not guaranteed (equity markets fluctuate), but long-term historical data from Indian equity markets shows that disciplined SIPs in diversified equity funds have generated 10–14% CAGR over 15-year periods.\n\nThe power of a SIP comes from two forces: rupee cost averaging (buying more units when markets fall) and compounding (every unit you hold grows in value over time). This calculator models both. The step-up feature — increasing your SIP by 10% every year — is particularly powerful because it mirrors salary growth and dramatically accelerates corpus accumulation without requiring large lump-sum investments.\n\nThe XIRR (Extended Internal Rate of Return) shown in results is the most accurate way to measure SIP returns because it accounts for the different time horizons of each monthly installment. A 12% XIRR on a 20-year SIP is genuinely excellent long-term performance — it means every rupee you invested earned 12% per year adjusted for timing.`,
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
  examples: [
    { scenario: 'Borrowing ₹2,00,000 at 12% simple interest for 3 years (a typical personal loan flat rate).', result: 'Total interest = ₹72,000. You repay ₹2,72,000. On a reducing-balance basis, 12% flat ≈ 21.5% effective — a major hidden cost.' },
    { scenario: 'Investing ₹50,000 in a 6-month treasury bill at 7% per annum simple interest.', result: 'Interest earned = ₹1,750 (₹50,000 × 7% × 0.5). Total payout at maturity = ₹51,750.' }
  ],
  intro: 'The Simple Interest Calculator computes interest charged or earned only on the original principal, not on accumulated interest. It\'s used for short-term loans, flat-rate agreements, and quick interest comparisons where reducing-balance calculations aren\'t needed.',
  about: `Simple interest is the most straightforward form of interest — it\'s calculated only on the original loan amount (principal), regardless of how much interest has already accrued. The formula SI = P × R × T / 100 makes it easy to compute manually, and it\'s used in short-term personal loans, flat-rate car loans, and trade credit arrangements.\n\nThe key distinction from compound interest is that simple interest does not compound — the interest charge is the same every period because it always refers back to the original principal. This means a 10% simple interest loan for 3 years costs exactly 30% of the principal, no more. Compound interest on the same terms would cost more.\n\nThis calculator also shows the flat-rate vs reducing-balance comparison, which is valuable when comparing loan products. A flat-rate loan at 10% effectively costs about 18–19% on a reducing-balance basis — an important discrepancy that lenders don\'t always make transparent.`,
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
  examples: [
    { scenario: 'You invested $25,000 in a rental property 5 years ago. It sold for $38,000 after expenses.', result: 'Total ROI = 52%. Annualized ROI (CAGR) = 8.8% per year — a solid real estate return in a flat market.' },
    { scenario: 'A $5,000 stock investment turned into $7,200 over 2 years.', result: 'Total ROI = 44%. Annualized ROI = 20% — well above the S&P 500 average. Inflation-adjusted real return at 4% CPI = ~15.4% annually.' }
  ],
  intro: 'The ROI Calculator measures how much you earned (or lost) on an investment relative to what you put in. It calculates both total ROI (the overall percentage gain or loss) and annualized ROI (the equivalent yearly return), which is essential when comparing investments held for different durations.',
  about: `Return on Investment (ROI) is one of the most widely used metrics in business and personal finance. The formula is simple: ROI = [(Final Value − Initial Investment) / Initial Investment] × 100. But its simplicity can be misleading when comparing investments held for different lengths of time — a 50% ROI over 10 years is far less impressive than a 50% ROI over 2 years.\n\nThis is why annualized ROI (CAGR — Compound Annual Growth Rate) is the correct metric for investment comparison. This calculator computes both: total ROI for a snapshot of absolute return, and annualized ROI for fair cross-investment comparison. The inflation-adjusted real return view shows purchasing-power-adjusted outcomes for long-term planning.\n\nROI is used to evaluate stocks, real estate, business projects, marketing campaigns, and virtually any activity where you put money in and expect more back. A positive ROI means the investment earned more than its cost; a negative ROI indicates a loss. This calculator helps you make that judgment quickly, with the right metric for the comparison at hand.`,
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
  examples: [
    { scenario: 'Annual CTC of ₹12,00,000 (₹1 lakh/month gross). Standard deduction ₹50,000. Tax bracket: 20% slab on ₹6L–₹12L income.', result: 'Taxable income ≈ ₹11,50,000. Tax ≈ ₹1,12,500. Net take-home ≈ ₹90,625/month after PF deduction and tax.' },
    { scenario: 'Evaluating a US job offer of $120,000/year gross in California (22% federal + 9.3% state bracket).', result: 'Estimated net take-home ≈ $7,400/month ($88,800/year) after federal, state, Social Security, and Medicare deductions.' }
  ],
  intro: 'The Salary Calculator converts a gross annual or monthly salary into your net take-home pay by applying tax brackets, standard deductions, and allowances. It works across hourly, daily, weekly, bi-weekly, and monthly pay periods so you can understand what any job offer actually puts in your pocket.',
  about: `Understanding the difference between your gross salary (what you earn before deductions) and your net pay (what you actually take home) is essential when evaluating a job offer, negotiating a raise, or building a monthly budget. Tax withholding, provident fund contributions, health insurance premiums, and other deductions can reduce gross pay by 20–40%.\n\nThis calculator applies standard tax rules including income tax slabs, standard deductions, and applicable surcharges to compute your exact net take-home amount. The pay period converter lets you input an annual CTC (Cost to Company) and see the monthly, bi-weekly, weekly, or daily equivalent — useful when comparing job offers quoted in different pay period formats.\n\nSelf-employed users should note that take-home pay calculations are more complex (quarterly estimated taxes, self-employment tax on top of income tax) and this calculator is primarily designed for salaried employees. Use the result as a reference point, and verify with a tax professional for your specific jurisdiction and filing situation.`,
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
  examples: [
    { scenario: 'A ₹8,000 jacket is marked "40% off + extra 25% off" during a sale. What is the final price?', result: 'Step 1: 40% off → ₹4,800. Step 2: 25% off ₹4,800 → ₹3,600. Effective discount = 55%, not 65%. Final price = ₹3,600 + 18% GST = ₹4,248.' },
    { scenario: 'A laptop originally priced at $1,299 is on sale for $899. What is the discount percentage?', result: 'Discount = ($1,299 − $899) / $1,299 × 100 = 30.8%. The retailer rounded down to advertise "30% off" — this tool gives the exact figure.' }
  ],
  intro: 'The Discount Calculator computes the final sale price after one or more percentage discounts, including stacked discounts where a second discount applies to the already-reduced price. It also runs in reverse — enter the original and sale price to find the discount percentage applied.',
  about: `Discount calculations are deceptively tricky because stacked discounts do not simply add together. A product marked "50% off + an extra 20% off" is not 70% off — the second discount applies to the already-reduced price, making the combined discount 60%. This calculator handles stacked discounts correctly and shows the true effective discount percentage.\n\nThe reverse mode (find discount percentage from original and sale price) is useful for retailers analyzing competitor pricing, shoppers verifying that a advertised discount is actually applied, and accountants computing discount rates from invoice data.\n\nTax integration lets you add GST, VAT, or sales tax to the discounted price to find the final checkout amount. This makes the calculator useful for both consumers comparing shopping deals and business owners setting promotional prices that remain profitable after tax.`,
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
  examples: [
    { scenario: 'A restaurant sells a pasta dish for ₹350. Ingredients cost ₹105. No other direct costs.', result: 'Gross margin = (₹350 − ₹105) / ₹350 × 100 = 70%. Markup = (₹350 − ₹105) / ₹105 × 100 = 233%. The 70% margin must cover rent, labour, and utilities before generating net profit.' },
    { scenario: 'An e-commerce seller buys a product for $18 and prices it at $45 with free shipping (shipping costs $6).', result: 'True cost = $24. Gross margin = ($45 − $24) / $45 × 100 = 46.7%. After Amazon fees at 15% ($6.75), net margin drops to ~32% — revealing the real profitability.' }
  ],
  intro: 'The Profit Margin Calculator computes gross margin, net margin, and markup from revenue and cost figures. It distinguishes between margin (profit as a percentage of revenue) and markup (profit as a percentage of cost) — two different metrics that are often confused but produce very different numbers.',
  about: `Profit margin and markup are two related but distinct metrics that confuse even experienced business people. Margin expresses profit as a percentage of revenue: if you sell something for $100 and it costs $60, your margin is 40%. Markup expresses profit as a percentage of cost: the same $100 sale with $60 cost has a markup of 67%. Both are correct — they just measure from different reference points.\n\nGross margin is the most commonly tracked metric in retail and manufacturing. It tells you how much of each revenue dollar remains after covering the direct cost of goods sold (COGS) — the more margin you retain, the more money is available to cover operating expenses and generate profit. Net margin goes further by also subtracting operating expenses, taxes, and interest.\n\nThis calculator also shows a health indicator: margin benchmarks vary significantly by industry (grocery retail runs on 2–5%, software can be 70–90%), so the contextual color-coding helps you judge whether your margin is strong or concerning for your sector.`,
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
  examples: [
    { scenario: 'A food startup sells packaged snacks at ₹150/pack. Ingredients + packaging cost ₹60. Monthly fixed costs (rent, salaries, overheads) = ₹90,000.', result: "Contribution margin = ₹150 − ₹60 = ₹90/unit. Break-even = ₹90,000 / ₹90 = 1,000 units/month. Sell 1,001 packs and you're profitable." },
    { scenario: 'A SaaS startup sells subscriptions at $49/month. Variable cost per customer = $4/month. Monthly fixed costs = $12,000.', result: 'Contribution margin = $45/customer. Break-even = $12,000 / $45 = 267 customers. Below 267 subs = burning cash; above 267 = every new customer is $45/month pure profit.' }
  ],
  intro: 'The Break-Even Calculator finds the sales volume at which total revenue exactly equals total costs — the point where a business neither makes a profit nor a loss. It uses fixed costs, variable cost per unit, and selling price to output the break-even units, revenue, and a contribution margin chart.',
  about: `Break-even analysis is one of the first calculations any entrepreneur or product manager should run before launching a product or scaling operations. It answers a fundamental question: how many units do I need to sell before this business starts making money? At volumes below break-even, you\'re losing money; above it, every additional unit sold generates pure profit.\n\nThe contribution margin (selling price minus variable cost per unit) is the key metric: it tells you how much each sale contributes toward covering your fixed costs. Dividing total fixed costs by the contribution margin gives you break-even units. Break-even revenue is simply break-even units multiplied by the selling price.\n\nThis analysis is especially useful for pricing decisions. If your target volume is 1,000 units and your break-even at current pricing is 1,800 units, you either need to raise prices, reduce variable costs, or expand your addressable market. The chart makes these trade-offs visual and easy to communicate.`,
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
  intro: 'The Down Payment Calculator determines how much you need to save for a home down payment, whether you\'ve crossed the 20% PMI threshold, and how long it will take to reach your savings goal at your current monthly savings rate.',
  about: `The down payment is the largest single upfront cost in a home purchase — and the one with the most financial leverage. Putting down 20% instead of 5% eliminates PMI (Private Mortgage Insurance), reduces your loan amount by 15%, and results in a smaller monthly payment on a smaller balance at a lower effective rate.\n\nPMI typically costs 0.5–1.5% of the loan amount per year. On a $400,000 loan, that\'s $2,000–6,000 per year added to your housing costs until you reach 20% equity. Crossing the 20% threshold is often worth prioritizing, and this calculator shows how much additional savings is needed to hit that threshold.\n\nThe time-to-save projection helps you plan concretely: if your target down payment is $80,000 and you can save $2,000/month, you\'ll reach it in 40 months (including interest on savings). Increasing your monthly saving by $500 cuts that timeline to 32 months — a concrete trade-off this tool makes visible.`,
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
  intro: 'The Debt Payoff Calculator compares the Avalanche (highest interest rate first) and Snowball (smallest balance first) debt elimination strategies across all your debts simultaneously. Enter each debt, and the calculator shows the payoff order, monthly payment allocation, interest saved, and total months to debt-free under each strategy.',
  workedExample: {
    title: 'Comparing Avalanche vs Snowball on three debts totalling $14,500',
    inputs: [
      'Credit card A: $3,200 balance, 24% APR, $80/month minimum',
      'Credit card B: $5,800 balance, 19% APR, $145/month minimum',
      'Auto loan: $5,500 balance, 8% APR, $175/month minimum',
      'Extra monthly payment available: $300',
    ],
    steps: [
      'Avalanche: direct extra $300 to Credit card A (24%). Pay off in 9 months. Then direct freed payment to Credit card B — paid off at month 22. Auto loan clears at month 27.',
      'Snowball: direct extra $300 to Credit card A (smallest balance). Same result in this case — but if balances differed, snowball would target smallest first regardless of rate.',
      'Avalanche total interest: $3,847 | Snowball total interest: $4,012 | Difference: $165',
      'Debt-free month: 27 under both strategies for this scenario',
    ],
    result: 'Both strategies clear all debt in 27 months. Avalanche saves $165 in interest. With a larger rate gap (e.g., 28% vs 8%), avalanche savings are substantially larger — often $500–$2,000 on typical consumer debt portfolios.',
  },

  about: `The debt avalanche and debt snowball are the two most widely recommended debt elimination strategies, and they produce meaningfully different results. The avalanche method — paying minimums on all debts except the highest-interest one, which gets all extra payments — minimizes total interest paid. The snowball method — targeting the smallest balance first — creates faster early wins that help maintain motivation.\n\nMathematically, avalanche always wins on total interest. But behavioral research suggests that many people abandon debt payoff plans that feel too slow — and the snowball\'s early payoffs (eliminating small debts quickly) help keep people on track. The right strategy is ultimately the one you\'ll stick with.\n\nThis calculator shows both strategies side by side: the full payment schedule, which debt gets paid off when, total interest under each approach, and months until completely debt-free. For most people with a mix of credit card, car loan, and student loan debt, the interest difference between strategies is modest compared to the behavioral factor — and seeing the comparison makes the trade-off concrete.`,
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
  intro: 'The Present Value Calculator discounts a future sum of money back to its equivalent value today, using a discount rate that reflects the time value of money and risk. It answers: "What is $100,000 five years from now worth in today\'s dollars if I expect a 7% return?"',
  about: `Present Value (PV) is one of the foundational concepts in finance: a dollar received in the future is worth less than a dollar today, because today\'s dollar can be invested and grow. The discount rate represents the opportunity cost of capital — the return you could earn by investing the money now rather than waiting.\n\nPV calculations are used everywhere: in bond pricing (the price of a bond is the PV of all its future coupon payments and face value), in real estate (the PV of future rental income determines intrinsic property value), in business valuation (DCF analysis sums the PV of all projected future cash flows), and in personal finance (the PV of a lottery lump-sum vs annuity).\n\nThe discount rate selection is critical and often controversial. A higher discount rate reduces PV more aggressively, making future cash flows worth less today. Analysts use WACC (Weighted Average Cost of Capital) for corporate valuations, the risk-free rate for government cash flows, and personal required return for individual investment decisions.`,
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
  intro: 'The IRR Calculator finds the discount rate at which a series of future cash flows has a Net Present Value of exactly zero — in other words, the annualized return the investment earns. If the IRR exceeds your required return or cost of capital, the investment creates value.',
  about: `Internal Rate of Return (IRR) is the single most useful metric for evaluating the profitability of investments with irregular cash flows. Unlike simple ROI (which ignores timing), IRR accounts for when each cash flow occurs by finding the discount rate that makes the net present value of all flows sum to zero.\n\nIn practice, IRR is used by private equity firms, real estate investors, and corporate finance teams to compare projects with different investment amounts, timelines, and cash flow patterns on a single, comparable metric. A real estate development with an IRR of 18% is directly comparable to a bond yielding 5% — the IRR is the annualized return on invested capital.\n\nThe calculation requires iterative numerical methods (like Newton-Raphson) because there\'s no closed-form algebraic solution. This calculator performs those iterations instantly. Important caveat: if a project has multiple sign changes in its cash flow series (e.g., positive then negative then positive), it may have multiple valid IRR values — a known limitation the calculator flags when detected.`,
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
  intro: 'The 401(k) Calculator projects your retirement account balance by modeling your contributions, employer match, investment growth, and tax-deferred compounding over your working years. It shows how much your account will be worth at retirement and estimates sustainable monthly withdrawal income.',
  workedExample: {
    title: 'Projecting 401(k) balance for a 32-year-old planning to retire at 65',
    inputs: [
      'Current age: 32 | Retirement age: 65 | Years to grow: 33',
      'Current salary: $85,000 | Employee contribution: 6% ($425/month)',
      'Employer match: 50% of first 6% → adds $212.50/month',
      'Total monthly contribution: $637.50',
      'Expected annual return: 7%',
    ],
    steps: [
      'Annual contribution (employee + employer): $637.50 × 12 = $7,650/year',
      'FV of $7,650/year at 7% for 33 years: $7,650 × [(1.07^33 − 1) / 0.07] = $7,650 × 118.93 = $909,815',
      'If current balance is $18,000: FV = $18,000 × 1.07^33 = $18,000 × 9.325 = $167,850',
      'Total projected balance: $909,815 + $167,850 = $1,077,665',
      '4% safe withdrawal rate: $1,077,665 × 0.04 / 12 = $3,592/month in retirement income',
    ],
    result: 'Projected balance at 65: $1,077,665. Sustainable monthly withdrawal: $3,592. Capturing the full employer match adds $2,550/year — compounding to approximately $303,000 of the final balance over 33 years.',
  },

  about: `A 401(k) is the most powerful retirement savings vehicle available to most American workers, primarily because of two features: employer matching (essentially a 100% instant return on matched contributions) and tax-deferred growth (no tax on gains until withdrawal, allowing the full pre-tax amount to compound for decades).\n\nThe employer match is universally described as free money — contributing at least enough to capture the full match is the single highest-return financial decision most employees can make. For a $100,000 salary with a 4% match, failing to contribute $4,000 means leaving $4,000 of compensation on the table annually.\n\nThis calculator models the full accumulation phase: annual contributions (with catch-up contributions for those over 50), employer match, and investment growth at a selected expected rate of return. The withdrawal projection uses the 4% safe withdrawal rate to estimate sustainable monthly income in retirement — the key number for retirement readiness planning.`,
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
  intro: 'The Commission Calculator computes earnings from tiered or flat commission structures, including base salary. Enter your total sales, commission rate (or multiple tiered slabs), and base pay to see your total compensation — useful for salespeople projecting monthly income and managers designing incentive structures.',
  about: `Commission structures vary enormously: flat percentage (10% of all sales), tiered slabs (8% on first $50K, 12% on the next $50K, 15% above $100K), residual (ongoing percentage of recurring revenue), or draw-against-commission (monthly advance offset against earned commissions). Understanding your exact compensation under any structure requires calculation.\n\nThis calculator handles all major commission types and shows the income breakdown by slab in tiered structures — making it immediately clear what incremental sales are worth at each level. Knowing that you\'re at 92% of the first slab threshold but would jump to 12% on the next $8,000 in sales changes how you prioritize your week.\n\nManagers designing sales incentive plans should test their structures in this calculator to verify that the compensation at various performance levels is both motivating and financially sustainable. A commission plan that pays 20% at $500K in sales may be competitive; the same plan extended to $1M without tiered adjustment may be unaffordable.`,
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
      about: `The Depreciation Calculator computes how an asset loses value over time using the three most widely recognised accounting methods: straight-line, declining balance, and sum-of-years' digits (SYD).

Straight-line depreciation spreads cost evenly: a $50,000 machine with a $5,000 salvage value over 10 years loses exactly $4,500 per year. This is the simplest method and is required for most tax filings when assets are placed in service evenly throughout the year.

Declining balance (often double-declining) front-loads depreciation — the same machine would lose $10,000 in year one, $8,000 in year two, and so on. This matches the real-world pattern of many assets (vehicles, computers, machinery) that lose value fastest when new. SYD sits between the two, providing accelerated depreciation that smooths out faster than declining balance.

Accountants use these schedules to match the expense of an asset with the revenue it generates. Business owners use them to plan capital expenditure and tax strategy — accelerated depreciation reduces taxable income in early years, improving cash flow when assets are newest and most useful.`
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
      about: `The Budget Calculator organises your income and spending into categories so you can immediately see where your money goes each month and whether your current habits align with your savings goals.

The 50/30/20 framework is the most widely recommended starting point: 50% of after-tax income to needs (rent, groceries, utilities), 30% to wants (dining, entertainment, subscriptions), and 20% to savings and debt repayment. This calculator shows exactly how your current spending compares to those benchmarks — most people discover their "wants" category is significantly higher than 30% until they see the numbers.

Variable expenses like dining out and entertainment are the easiest to cut without affecting quality of life meaningfully. A household spending $600/month on dining out that reduces to $300 frees up $3,600 per year — the equivalent of a 4.5% raise on a $80,000 income. The calculator makes these trade-offs visible in real time as you adjust categories.

Budget surpluses should be directed first to a 3–6 month emergency fund, then to high-interest debt, then to retirement accounts — in that priority order for most households.`
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
      about: `College tuition has risen at roughly 4–6% per year for the past two decades — nearly double the rate of general inflation. For a child born today, a four-year degree at a public university that currently costs $120,000 total will cost approximately $220,000 in 18 years at 3.5% annual tuition inflation. At a private university currently at $280,000, that rises to over $510,000.

The earlier you start saving, the less monthly contribution you need. Saving $200/month from birth in a 529 account growing at 6% annually accumulates to roughly $73,000 by age 18 — covering about 60% of projected in-state costs without loans. Starting the same plan at age 8 requires nearly $450/month to reach the same amount.

529 accounts offer a state tax deduction on contributions in most states, and all growth is tax-free when withdrawn for qualified education expenses. This calculator shows how much you need to save monthly, given your starting balance, expected return, years until enrollment, and target coverage percentage — making the gap between savings and cost concrete enough to act on.`
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
      about: `A Home Equity Line of Credit (HELOC) lets you borrow against the equity in your home at a variable rate, typically during a 10-year draw period, followed by a 20-year repayment period when the full balance must be paid down.

Available equity is calculated as: (Home Value × Lender's LTV cap — typically 80–85%) minus your outstanding mortgage balance. A home worth $500,000 with a $300,000 mortgage balance and an 80% LTV cap gives you $100,000 in available HELOC credit.

During the draw period, you pay interest only on what you borrow. This makes initial payments low — a $60,000 draw at 8% costs just $400/month in interest-only payments. But at the transition to full repayment, the same balance converts to principal-and-interest over 20 years, jumping to $502/month. The calculator shows both phases.

HELOC rates are variable (typically Prime Rate + margin). Stress-testing at prime + 2–3% is essential — a 2% rate increase on a $100,000 balance adds $167/month to your payment. HELOCs are best used for value-adding home improvements that increase your equity rather than lifestyle spending.`
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
      about: `A car lease payment is calculated from three factors: depreciation (the difference between the vehicle's current price and its residual value at lease end), the money factor (the interest component), and taxes and fees.

For a $45,000 vehicle with a 55% residual after 36 months, the depreciated amount is $20,250. Divided by 36 months, that's $562.50/month just for depreciation. The money factor (say 0.00125, equivalent to 3% APR) adds another $81.56/month on the combined $45,000 cap cost and $24,750 residual. Total before tax: ~$644/month.

To decode a money factor: multiply by 2,400 to get the equivalent APR. A money factor of 0.002 equals 4.8% APR. Dealers don't always volunteer the money factor, but you can calculate it from the payment breakdown — knowing this is critical to evaluating whether a lease deal is competitive.

The lease vs. buy comparison this calculator provides matters most for high-depreciation vehicles. If a car loses 50% of value in 3 years, buying means absorbing that depreciation. Leasing transfers residual value risk to the manufacturer — which is why manufacturers sometimes subsidize leases with artificially high residuals on slow-selling models.`
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
      about: `Bond pricing is the inverse of interest rates: when market yields rise, existing bond prices fall, and vice versa. A bond paying a fixed 5% coupon becomes less attractive when new bonds pay 6%, so its price drops until the effective yield matches the market. This calculator computes the exact price and shows the premium or discount from face value.

Yield to Maturity (YTM) is the total annualised return earned by holding a bond to maturity, accounting for the purchase price, coupon payments, and face value at redemption. A bond purchased at $920 with a $1,000 face value and 6% annual coupon maturing in 5 years has a YTM of approximately 8.1% — meaningfully higher than the stated coupon.

Duration measures a bond's sensitivity to interest rate changes. A duration of 7 years means the bond's price will fall approximately 7% for every 1% rise in rates. This is why long-duration bonds are riskier in rising-rate environments.

Credit quality (investment-grade vs. high-yield) determines the spread above the risk-free rate. Investment-grade bonds typically trade at 50–200 basis points above Treasuries; high-yield bonds may trade at 300–800 basis points above, reflecting compensation for default risk.`
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
      about: `A Certificate of Deposit locks your money for a fixed term (typically 3 months to 5 years) at a guaranteed interest rate, making it one of the simplest and safest savings instruments available. Rates are quoted as APY (Annual Percentage Yield), which reflects the effect of compounding.

The compounding frequency matters: a 5% APR compounded daily yields 5.13% APY, while the same 5% compounded annually stays at exactly 5% APY. Banks advertise APY rather than APR because it's the higher number — always compare APY across institutions.

For example: $10,000 in a 12-month CD at 5.25% APY earns $525 at maturity. The same amount in a 5-year CD at 4.80% APY grows to $12,656 — but locks up the money and loses out if rates rise. This calculator's multi-term comparison chart shows exactly that trade-off across all common terms simultaneously.

CD laddering — splitting money across multiple terms (e.g., 1-, 2-, 3-, 4-, and 5-year CDs) — provides both higher average rates than short-term CDs and regular access to maturing funds without early-withdrawal penalties. Use this calculator to model a ladder strategy against a single long-term commitment.`
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
  workedExample: {
    title: 'Comparing Roth IRA vs Traditional IRA net retirement value for a 30-year-old',
    inputs: [
      'Age: 30 | Retirement age: 65 | Years: 35',
      'Annual contribution: $7,000 (2024 limit)',
      'Expected annual return: 7%',
      'Current marginal tax rate: 24% | Estimated retirement tax rate: 22%',
    ],
    steps: [
      'FV of $7,000/year at 7% for 35 years: $7,000 × [(1.07^35 − 1) / 0.07] = $7,000 × 138.24 = $967,676',
      'Roth IRA: withdraw full $967,676 tax-free. Net = $967,676',
      'Traditional IRA: save $7,000 pre-tax (worth $7,000/0.76 = $9,211 gross contribution equivalent). Account value same $967,676, but pay 22% tax on all withdrawals: net = $967,676 × 0.78 = $754,787',
      'Roth advantage: $967,676 − $754,787 = $212,889 more in after-tax spendable retirement income',
    ],
    result: 'Roth IRA produces $212,889 more after-tax retirement wealth assuming tax rates stay similar. Roth wins when retirement tax rate ≥ current rate. Traditional IRA wins if retirement tax rate is significantly lower — e.g., dropping from 32% to 12%.',
  },

      about: `The Roth IRA's defining advantage is tax-free growth: you contribute after-tax dollars, but all growth and qualified withdrawals after age 59½ are completely tax-free. For someone in the 22% bracket who converts $7,000 in annual contributions into $500,000 over 35 years, the tax savings versus a traditional IRA could exceed $100,000.

The 2024 contribution limit is $7,000 per year ($8,000 if you're 50 or older), subject to income phase-out limits starting at $146,000 for single filers and $230,000 for married filing jointly. High earners above the limit can use a backdoor Roth conversion to maintain access.

Unlike Traditional IRAs, Roth IRAs have no Required Minimum Distributions (RMDs) — you can let the money grow tax-free indefinitely and pass it to heirs. This makes the Roth IRA uniquely valuable for estate planning as well as retirement income.

Starting at age 25 vs. age 35 with $7,000/year at 7% annual return produces roughly $1.37M vs. $740K at age 65 — the $70,000 in extra contributions made over the earlier decade more than doubles the final balance through compound growth.`
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
      about: `An annuity is a series of equal, periodic cash flows — either received (ordinary annuity, like a pension) or paid (annuity due, like rent). The two core questions this calculator answers: how much is a series of future payments worth today (present value), and how much will regular contributions grow to in the future (future value)?

Present Value example: a pension that pays $2,000/month for 20 years, discounted at 5% annually, has a present value of approximately $302,000. That's the lump sum you'd need today — invested at 5% — to replicate those payments.

Future Value example: saving $500/month for 30 years at 6% annual return produces a future value of $502,257. The total contributions were $180,000; compounding generated the other $322,257.

Annuities are used to price insurance products, structure lottery payouts vs. lump sums, value pension obligations on corporate balance sheets, and plan structured retirement withdrawals. Understanding whether a lottery's $1M lump sum or $50,000/year for 30 years offers better value requires exactly this calculation — typically the lump sum wins at discount rates above 2–3%.`
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
      about: `A defined benefit (DB) pension promises a fixed monthly income in retirement, calculated using three variables: your final (or average) salary, your years of service, and a benefit multiplier set by the plan.

The standard formula: Annual pension = Final salary × Years of service × Benefit multiplier.

Example: a teacher with a $75,000 final salary, 30 years of service, and a 2% multiplier receives $75,000 × 30 × 0.02 = $45,000 per year ($3,750/month). That's 60% income replacement — the pension industry's gold standard target.

Few private-sector workers have DB pensions today (less than 15% of private employees vs. 86% of government workers), but for those who do, calculating the trade-off between early retirement and maximum benefit is critical. Retiring at 58 instead of 62 might sacrifice 8 years of accrual, potentially reducing monthly income by $800–$1,200 permanently.

The "breakeven age" analysis this calculator provides is essential: if retiring at 58 gives $2,800/month and waiting to 62 gives $3,600/month, you need to collect the higher pension for 7.5 years just to recover the 4 years of foregone payments — meaning you'd need to live past 69.5 for the delay to pay off.`
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
      about: `Your Social Security benefit amount depends on your earnings history and when you choose to claim. Full Retirement Age (FRA) is 67 for anyone born after 1960. Claiming at 62 permanently reduces your monthly benefit by up to 30%; delaying past FRA increases it by 8% for each year up to age 70 — a guaranteed, inflation-protected 8% return available nowhere else.

Example: if your FRA benefit is $2,000/month at age 67, claiming at 62 pays $1,400/month; waiting to 70 pays $2,480/month. The break-even between claiming at 62 vs. 67 occurs at roughly age 79. The break-even between 67 and 70 is around age 82.5.

Married couples have additional optimization options: one spouse can claim early while the other delays to 70, maximizing the survivor benefit (the surviving spouse keeps the higher of the two benefits for life). This strategy often produces significantly more cumulative lifetime income for couples where one spouse is in good health.

This calculator shows the cumulative benefit comparison at each claiming age and computes your personal break-even points — making an informed decision visible rather than based on guesswork.`
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
      about: `Required Minimum Distributions (RMDs) are mandatory annual withdrawals from traditional IRAs and 401(k)s starting at age 73 (as of the SECURE 2.0 Act). The IRS requires this because tax-deferred retirement accounts have never been taxed — RMDs ensure that money eventually enters the taxable income stream.

The calculation uses IRS Uniform Lifetime Table life expectancy factors. At age 73, the factor is 26.5; at 80, it's 20.2; at 85, it's 16.0. Divide your December 31 account balance by the applicable factor: a $500,000 IRA at age 75 (factor 24.6) requires a $20,325 distribution that year.

Missing an RMD triggers a 25% penalty on the amount not withdrawn — one of the harshest penalties in the tax code. The first RMD can be delayed until April 1 of the year after you turn 73, but this means taking two RMDs in one year, which can push you into a higher bracket and affect Medicare IRMAA surcharges.

Qualified Charitable Distributions (QCDs) — up to $105,000/year — count toward your RMD without being included in your taxable income, making them an excellent strategy for charitably inclined retirees who don't need the RMD income.`
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
      about: `The federal estate tax applies only to estates exceeding the lifetime exemption — $13.61 million per individual in 2024 ($27.22 million for a married couple with proper planning). Fewer than 0.2% of estates actually pay federal estate tax, but for those that do, the rate above the exemption is a flat 40%.

Example: an estate worth $20 million with no planning faces a taxable estate of $6.39 million above the exemption, resulting in a federal tax bill of $2,556,000 — payable within nine months of death.

The unlimited marital deduction allows spouses to transfer any amount to each other tax-free. Portability allows a surviving spouse to "inherit" the deceased spouse's unused exemption. Without a portability election on the first spouse's estate return (due nine months after death), that exemption is lost permanently.

Key strategies for large estates: irrevocable life insurance trusts (ILITs), grantor retained annuity trusts (GRATs), qualified personal residence trusts (QPRTs), and annual exclusion gifts ($18,000 per recipient in 2024) that remove assets from the taxable estate without using the lifetime exemption.

Important: the current $13.61M exemption is scheduled to sunset to roughly $7M (inflation-adjusted) in 2026 without Congressional action — making estate planning particularly time-sensitive for those with estates above that threshold.`
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
      about: `The marriage tax penalty or bonus arises because the US income tax system's bracket thresholds for Married Filing Jointly (MFJ) are not exactly double the single thresholds. This asymmetry benefits couples with very different incomes and penalises couples with similar incomes.

Marriage bonus example: one spouse earns $120,000, the other earns $30,000. Filing jointly combines their $150,000 income, but the MFJ brackets are wide enough that their combined tax is less than their two individual tax bills would have been.

Marriage penalty example: two people each earning $200,000 would each pay tax on $200,000 as singles. Married, their $400,000 combined income pushes a larger portion into the 35% bracket, which begins at $487,450 MFJ vs. $243,725 single — nearly the same threshold despite double the income.

In 2024, the penalty is most pronounced for couples in the 32–37% brackets where equal earners face meaningful disadvantage. The standard deduction ($29,200 MFJ vs. $14,600 single in 2024) is exactly doubled, which is neutral. The real penalty concentrates in the upper-middle brackets.

This calculator shows your exact tax liability as single filers vs. married, quantifying the bonus or penalty to the dollar.`
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
      about: `Boat loan payments follow the same formula as car and home loans, but marine lenders often offer longer terms (10–20 years) and higher rates than auto loans. This makes the sticker price deceptive — a $60,000 boat at 8.5% over 15 years costs $86,700 in total interest, nearly 1.5× the purchase price.

Beyond the loan, the "10% rule" for total annual ownership costs is a good benchmark: a $60,000 boat typically costs $5,000–9,000 per year in fuel, insurance, storage (marinas charge $500–$1,500/month in major markets), maintenance, and registration. This ongoing cost is often what surprises first-time buyers.

Loan terms affect cost dramatically: a $50,000 loan at 8% over 10 years costs $607/month and $22,840 total interest. The same loan over 20 years costs $418/month but $50,260 in interest — more than the original loan amount. This calculator makes those comparisons immediate.

Marine lenders (banks, credit unions, and specialist lenders like LightStream) typically require 10–20% down and better credit scores for boats than auto loans. Credit unions frequently offer the best rates — worth checking before accepting dealer financing.

This calculator adds maintenance and insurance estimates to the monthly payment to show the true all-in monthly cost of ownership — the number that actually matters for budgeting.`
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
      about: `Debt consolidation replaces multiple debts (credit cards, medical bills, personal loans) with a single loan at a lower interest rate. The math works when the consolidated rate is meaningfully below the weighted average rate of existing debts and when the borrower doesn't accumulate new debt on the freed-up credit cards.

Example: three credit cards at 22%, 19%, and 24% with a combined $18,000 balance have a weighted average rate of roughly 21.5%. Consolidating to a personal loan at 12% for 48 months reduces monthly payments from $530 (minimums) to $474 — and the debt is actually eliminated in 48 months rather than stretching 7+ years under minimum payments.

Total interest saved in this example: approximately $8,200 — a concrete, significant benefit. But the calculation breaks down if you keep spending on the cards: cardholders who consolidate and continue using credit cards frequently end up with both the consolidation loan and new card balances, doubling their debt.

The break-even analysis shows how many months until the interest savings exceed any upfront fees (origination fees are typically 1–6% of the loan amount). A $18,000 loan with a 3% fee costs $540 upfront — at $171/month in interest savings, you break even in 3.2 months.

Home equity loans and HELOCs often provide the lowest rates for consolidation but put your home at risk. Unsecured personal loans are safer but carry higher rates.`
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
  workedExample: {
    title: 'Growing a $5,000 lump sum with $400/month contributions at 7% for 25 years',
    inputs: [
      'Starting lump sum: $5,000',
      'Monthly contribution: $400',
      'Annual return: 7% (compounded monthly)',
      'Time horizon: 25 years',
    ],
    steps: [
      'FV of lump sum: $5,000 × (1 + 0.07/12)^300 = $5,000 × 5.779 = $28,896',
      'FV of monthly contributions: $400 × [(1.005833^300 − 1) / 0.005833] = $400 × 810.07 = $324,028',
      'Total FV: $28,896 + $324,028 = $352,924',
      'Total contributed: $5,000 + ($400 × 300) = $125,000',
      'Growth from compounding: $352,924 − $125,000 = $227,924',
    ],
    result: '$352,924 after 25 years. Of that, $227,924 (64.6%) is pure compounding — money earned on money, not new contributions. This illustrates why time in market matters more than timing the market.',
  },

      about: `Future Value (FV) answers the question: what will my money be worth later if I invest it now? The power of compound growth means that $10,000 invested today at 7% annually becomes $19,672 in 10 years, $38,697 in 20 years, and $76,123 in 30 years — with no additional contributions.

Add a $300/month contribution to that $10,000 lump sum, and the 30-year balance jumps to $387,000. The $108,000 in contributions grew to $377,000 through compounding alone — demonstrating why starting early matters more than contribution size.

The contribution step-up feature models the realistic scenario where you increase contributions as income grows. Increasing contributions by just 3% per year (roughly matching inflation) raises the 30-year outcome from $387,000 to $477,000 — an extra $90,000 from growing contributions that most planning tools ignore.

Rule of 72: divide 72 by the interest rate to estimate how long your money takes to double. At 6%, money doubles every 12 years (72 ÷ 6). At 9%, every 8 years. This mental model explains why fee differences matter: a 1% fee that reduces your return from 7% to 6% extends doubling time from 10.3 to 12 years — a 16% longer wait compounded over decades.`
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
      about: `CAGR (Compound Annual Growth Rate) is the single most useful metric for comparing investment performance over time because it accounts for compounding. An investment that grows from $10,000 to $18,000 over 6 years has a CAGR of (18,000/10,000)^(1/6) − 1 = 10.3% per year — regardless of how volatile the path was.

The critical difference between CAGR and arithmetic mean: a fund that returns +50% in year 1 and −50% in year 2 has an arithmetic mean of 0% but a CAGR of −13.4%. A $10,000 investment becomes $15,000 after year 1 and then $7,500 after year 2. The arithmetic mean is misleading; CAGR correctly shows the outcome.

This is why CAGR is the industry standard for reporting fund performance. Arithmetic mean always overstates actual returns for volatile assets — the greater the volatility, the larger the overstatement.

Use case: comparing two funds over 10 years where Fund A grew $10,000 to $22,000 (CAGR 8.2%) and Fund B grew to $26,000 (CAGR 10.0%). The 1.8% CAGR difference seems small but means the difference between $22K and $26K over 10 years — and compounds to an $87,000 gap over 30 years on the same investment.

This calculator shows both CAGR and arithmetic mean side by side to make the discrepancy visible, along with a growth chart comparing the two returns over the full holding period.`
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
  workedExample: {
    title: 'Effect of extra $200/month payment on a 30-year $350,000 mortgage at 6.75%',
    inputs: [
      'Loan amount: $350,000',
      'Interest rate: 6.75% APR',
      'Term: 30 years (360 payments)',
      'Extra monthly payment: $200',
    ],
    steps: [
      'Standard monthly payment: $350,000 × 0.005625 × 1.005625^360 / (1.005625^360 − 1) = $2,270',
      'Month 1 breakdown: Interest = $350,000 × 0.005625 = $1,969; Principal = $2,270 − $1,969 = $301',
      'With extra $200: month 1 principal = $501 instead of $301 — 66% more principal reduction',
      'Total interest (standard): $467,200 over 30 years',
      'Total interest (with extra $200): $388,900 — saving $78,300 and paying off in 25.4 years',
    ],
    result: 'Adding $200/month saves $78,300 in interest and cuts 4 years 7 months off the loan. The extra $200 costs $72,000 over 25 years but saves $78,300 in interest — a net gain of $6,300 plus 4+ years of freedom from mortgage payments.',
  },

      about: `Amortization reveals a mathematical reality most borrowers don't see until too late: on a 30-year $400,000 mortgage at 7%, your first payment of $2,661 allocates only $328 to principal and $2,333 to interest — 87.7% of your money goes to the bank in month one. By year 15, you've paid $239,000 but still owe $315,000.

Extra payments radically change this equation because every additional dollar goes 100% to principal, eliminating years of future interest. Adding $200/month to a 30-year mortgage at 7% on a $400,000 loan:
- Saves $83,000 in interest
- Cuts the loan term by 5 years and 4 months
- Pays off in 24 years 8 months instead of 30 years

The full amortization schedule this calculator generates shows exactly how your loan balance, interest paid, and principal paid evolve month by month — making the long-term cost of a mortgage tangible.

Refinancing is worth evaluating when rates drop 0.75–1% below your current rate. The break-even on $4,000 in closing costs at $200/month in payment savings is 20 months — refinance makes sense if you'll keep the home beyond that. This calculator's schedule helps compare current vs. refinanced scenarios side by side.`
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
      about: `The Time Value of Money (TVM) equation is the master formula underlying all of finance: FV = PV × (1+r)^n + PMT × [(1+r)^n − 1] / r. It has five variables — Present Value, Future Value, Payment, Rate, and Periods — and given any four, this calculator solves for the fifth.

Practical uses:
- **Solve for payment**: What monthly payment retires a $30,000 car loan at 6% over 48 months? ($704.55)
- **Solve for rate**: A bond costs $950 today and pays $1,000 in 3 years. What's the annual yield? (1.73%)
- **Solve for time**: How many years to grow $50,000 to $100,000 at 6%? (11.9 years)
- **Solve for PV**: What lump sum invested today at 7% grows to $1,000,000 in 25 years? ($184,249)
- **Solve for FV**: If you save $500/month for 20 years at 8%, what's your final balance? ($294,510)

The TVM calculator is used by loan officers, CFPs, investment bankers, real estate investors, and students — any situation where money changes value over time. Understanding which variable to solve for transforms complex financial questions into one-line calculations.

Beginning vs. end-of-period payments (annuity-due vs. ordinary annuity) changes results slightly: a payment at the start of each period has one extra compounding period, making it worth about (1+r) more. This toggle is included in the calculator for situations like rent (paid at start) vs. mortgage payments (paid at end).`
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
  workedExample: {
    title: 'Real vs nominal growth: $50,000 invested for 20 years at 8% with 3% inflation and 15% tax on gains',
    inputs: [
      'Starting investment: $50,000',
      'Annual contribution: $6,000 (growing 3%/year)',
      'Nominal return: 8%',
      'Inflation rate: 3%',
      'Tax rate on annual gains: 15%',
    ],
    steps: [
      'Nominal FV (no tax, no inflation): $50,000 × 1.08^20 + contributions FV ≈ $558,000',
      'After-tax return: 8% × (1 − 0.15) = 6.8% effective annual return',
      'After-tax FV: ≈ $474,000',
      'Real return: (1.068) / (1.03) − 1 = 3.69% real after-tax return',
      'Real purchasing power: $474,000 / 1.03^20 = $262,600 in today\'s dollars',
    ],
    result: 'Nominal account value: $474,000. Real purchasing power in today\'s dollars: $262,600. The $211,400 difference is the combined cost of inflation and taxes. This is why tax-advantaged accounts (Roth IRA, 401k) are so valuable — eliminating the tax drag brings the real value to ~$340,000.',
  },

      about: `This investment calculator goes beyond basic compound growth to model the four factors that determine what your portfolio is actually worth in purchasing power: nominal return, inflation erosion, tax drag on gains, and contribution growth over time.

Real vs. nominal return: a 7% nominal return with 3% inflation yields only a 3.88% real return (not 4% — inflation compounds too). On $100,000 over 20 years, the difference between what your account statement says ($386,968) and what that money actually buys in today's dollars ($234,965) is $151,000 — more than your original investment.

Tax drag depends on whether the account is taxable, tax-deferred (traditional IRA/401k), or tax-free (Roth). In a taxable account, annual dividends and capital gains distributions are taxed each year, reducing the compounding base. A 20% tax on annual returns turns a 7% nominal return into an effective 5.6% — eliminating $82,000 over 20 years on $100,000.

Contribution step-up of 5%/year reflects the realistic pattern of rising income. A 35-year-old starting with $10,000 and contributing $500/month with a 5% annual step-up reaches $1.47M by 65 vs. $1.06M with flat contributions — a $410,000 difference from a behaviorally realistic assumption.

Use this calculator to set a concrete investment target and work backwards to the monthly contribution you need today.`
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
  workedExample: {
    title: 'Comparing 48-month vs 72-month auto loan on a $28,000 vehicle at 7.9% APR',
    inputs: [
      'Loan amount: $28,000',
      'APR: 7.9%',
      'Option A: 48-month term',
      'Option B: 72-month term',
    ],
    steps: [
      '48-month payment: $28,000 × 0.006583 × 1.006583^48 / (1.006583^48 − 1) = $682/month',
      '48-month total paid: $682 × 48 = $32,736 | Interest: $4,736',
      '72-month payment: $28,000 × 0.006583 × 1.006583^72 / (1.006583^72 − 1) = $484/month',
      '72-month total paid: $484 × 72 = $34,848 | Interest: $6,848',
      'Monthly saving: $198/month for 72-month | Extra interest cost: $2,112',
    ],
    result: 'The 72-month loan saves $198/month but costs $2,112 more in total interest — you pay for that lower payment. Additionally, cars depreciate fast: at month 24 on 72-month loan, you may owe more than the car is worth ("underwater"). The 48-month loan builds equity faster and costs $2,112 less overall.',
  },

      about: `The Loan Calculator computes the monthly payment, total interest paid, and complete payoff schedule for any amortising loan — personal, auto, student, business, or mortgage — using the standard formula: Payment = P × r(1+r)^n / [(1+r)^n − 1].

A $25,000 auto loan at 7.5% over 60 months costs $501/month and $5,060 total interest. Extend to 72 months and the payment drops to $426/month — but total interest rises to $6,688. You save $75/month but pay $1,628 more overall; the trade-off is immediate cash flow vs. long-term cost.

APR vs. interest rate: lenders advertise the interest rate but the Annual Percentage Rate (APR) includes origination fees, points, and other costs. A $200,000 mortgage at 6.5% with $4,000 in fees has an APR of 6.68% — always compare APR for true borrowing cost.

Total interest as a percentage of principal is the most sobering metric: a $300,000 home mortgage at 7% over 30 years costs $418,527 in interest — more than the home itself. Knowing this drives the decision to make extra payments, choose shorter terms, or prioritise paydown vs. investing the surplus.

The payoff date this calculator provides makes the abstract concrete: you can see exactly which month you'll make your last payment and how much sooner you'd finish with an extra $100/month.`
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
      about: `The National Pension System (NPS) is India's market-linked retirement scheme offering a combination of equity, corporate bonds, and government securities based on your chosen allocation. Contributions are tax-deductible under three separate sections — making it one of the most tax-efficient savings vehicles available.

Tax benefits in 2024: Section 80C (up to ₹1.5 lakh, shared with other 80C investments), Section 80CCD(1) (employee's own contribution up to 10% of salary within the 80C limit), and the exclusive Section 80CCD(1B) extra deduction of ₹50,000 — giving high earners a combined potential deduction of ₹2 lakh from NPS alone.

Corpus growth example: contributing ₹5,000/month from age 30 to 60 in an aggressive allocation (75% equity) at an assumed 10% annual return produces a corpus of approximately ₹1.13 crore. Conservative allocation (25% equity) at 7% returns produces ₹61 lakhs. The equity allocation significantly affects outcomes over 30 years.

At age 60, NPS mandates: 60% of the corpus can be withdrawn tax-free as a lump sum; the remaining 40% must be used to purchase an annuity (monthly pension). Higher annuity rates typically reflect higher guaranteed income but lower inflation protection. This calculator shows both the projected corpus and the estimated monthly annuity income.`
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
      about: `The Employee Provident Fund (EPF) is India's most widely used retirement savings instrument, with mandatory contributions for all salaried employees earning up to ₹15,000/month (voluntary for higher earners). Both employee and employer contribute 12% of basic salary each month — effectively giving you a 100% instant return on your own contribution.

Contribution structure: the employee's full 12% goes to EPF. The employer's 12% splits into 8.33% to the Employee Pension Scheme (EPS) — capped at ₹15,000 basic — and 3.67% to EPF. The EPS contribution funds a pension rather than accumulating in your personal EPF account.

Current EPF interest rate: 8.15% per annum (FY 2022-23), compounded monthly. This is a guaranteed, risk-free rate — significantly better than savings accounts (typically 3–4%) and comparable to medium-duration debt mutual funds, without any market risk.

Growth example: a ₹30,000/month basic salary employee contributes ₹3,600/month employee + ₹1,101/month employer EPF contribution = ₹4,701/month total EPF accumulation. Over 30 years at 8.15%, this grows to approximately ₹65 lakhs — entirely tax-free under the EEE (Exempt-Exempt-Exempt) status: contributions are deductible, interest is tax-free, and the maturity amount is tax-free after 5 years of service.

Premature withdrawal before 5 years makes the entire accumulated amount taxable — a significant penalty this calculator's timeline helps you plan around.`
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
      about: `Total stock return has two components: price appreciation (capital gain) and dividend income. Ignoring dividends dramatically understates historical equity returns — dividends have contributed roughly 40% of the S&P 500's total return over the past century.

The power of dividend reinvestment (DRIP): $10,000 invested in a stock at $50/share with a 3% annual dividend and 5% annual price growth. After 20 years, price-only return produces $26,533. With dividends reinvested, the same investment grows to $43,219 — 63% more — because each reinvested dividend purchases new shares that themselves pay future dividends.

CAGR vs. total return: a stock purchased at $45 and sold at $72 after 7 years, while paying $1.20/year in dividends, has a total dollar return of $35.40 ($27 capital gain + $8.40 dividends). The CAGR is approximately 8.7% — the annualized rate that produced that outcome, accounting for both components.

After-tax returns differ significantly between account types: in a taxable account, qualified dividends are taxed at 0%, 15%, or 20% each year, reducing the compounding base. In a Roth IRA, all dividends reinvest tax-free. This calculator shows pre-tax and after-tax return side by side for taxable accounts.

Compare your investment's CAGR against the S&P 500's long-term average of ~10% nominal to benchmark whether your individual stock picks have added value over simply holding an index fund.`
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
      about: `Net Present Value (NPV) is the fundamental tool for investment decision-making: it converts all future cash flows to today's dollars using a discount rate, then subtracts the initial investment. A positive NPV means the investment creates value; a negative NPV means it destroys value at the given discount rate.

Example: a machine costs $80,000 today and generates $25,000 in annual savings for 5 years, after which it has no salvage value. With a discount rate of 10%, the NPV is:
- Year 1: $25,000 / 1.10 = $22,727
- Year 2: $25,000 / 1.21 = $20,661
- Year 3: $25,000 / 1.331 = $18,783
- Year 4: $25,000 / 1.464 = $17,075
- Year 5: $25,000 / 1.611 = $15,521
- Sum of PVs: $94,767 − $80,000 = **NPV +$14,767**

The machine creates value. If the discount rate were 20%, NPV falls to −$2,283 — the investment is not worthwhile at that required return.

The discount rate selection is crucial and often contested: corporate finance typically uses WACC (Weighted Average Cost of Capital), which blends the cost of debt (post-tax) and equity (estimated via CAPM). Personal investors use their expected alternative investment return. The "hurdle rate" above which a project is approved is a management decision that drives capital allocation.

This calculator also shows IRR (Internal Rate of Return) alongside NPV — the two metrics together confirm investment viability more robustly than either alone.`
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
      about: `Portfolio rebalancing restores your asset allocation to target weights after market movements have caused drift. A portfolio originally set to 60% stocks / 40% bonds will be approximately 65%/35% after a strong equity year — meaning you're taking more risk than intended without rebalancing.

Example: starting $100,000 at 60/40. After equities return 20% and bonds return 5%, the portfolio is $72,000 stocks / $42,000 bonds = $114,000 total. The new weights are 63.2%/36.8% — a 3.2% equity overweight. To rebalance to 60/40, sell $3,428 of stocks and buy $3,428 of bonds.

Rebalancing frequency: research shows that annual or semi-annual rebalancing captures most of the benefit without excessive transaction costs. Threshold-based rebalancing (rebalance when any asset drifts more than 5% from target) is often more efficient than calendar-based for volatile markets.

Tax efficiency matters in taxable accounts: selling appreciated assets triggers capital gains. Using new contributions to buy underweighted assets — rather than selling overweighted ones — achieves the same rebalancing effect without taxable events. This approach works when contributions are large relative to the needed rebalance amount.

For retirement accounts, there are no tax consequences to rebalancing, so more frequent rebalancing to tighter tolerances is feasible. This calculator shows the exact dollar amounts to buy or sell for each asset class to restore your target allocation.`
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
      about: `Dividend yield is the annual dividend per share divided by the current share price — a simple measure of the income return on a stock investment. A stock trading at $50 paying $2.00/year in dividends has a 4% yield; the same dividend payment after the stock rises to $60 yields only 3.33%.

Payout ratio — annual dividends divided by earnings per share — is the key metric for dividend sustainability. A company paying $2.00/year while earning $2.50/share has an 80% payout ratio: sustainable but leaving little room for earnings declines. A ratio above 100% means the company is paying out more than it earns — typically unsustainable without dividend cuts or debt.

Dividend growth rate matters as much as current yield for long-term income investors. A stock with a 2% yield growing dividends at 8%/year doubles its income in 9 years. A stock with a 5% yield growing at 2%/year takes 35 years to double. This calculator's growth projection shows the yield-on-cost you'll receive in future years — a metric "dividend growth" investors optimise for.

Tax treatment: qualified dividends (from US corporations held >60 days) are taxed at 0%, 15%, or 20% based on income. Ordinary dividends are taxed as regular income. Foreign dividends may have withholding taxes. REITs and MLPs have distinct tax treatment — dividends may be non-qualified, increasing the effective tax rate.

A yield above 6% should prompt scrutiny: either the stock price has fallen (potential value or distress), or the company is maintaining an unsustainable payout. Check the payout ratio and dividend history before assuming a high yield is attractive.`
},
];
