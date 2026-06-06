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
