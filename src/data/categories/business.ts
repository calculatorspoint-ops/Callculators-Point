import type { CalculatorConfig } from '../calculatorConfigs';

export const businessCalculators: CalculatorConfig[] = [
  {
  id: 'markup',
  slug: 'markup-calculator',
  cat: 'business',
  name: 'Markup Calculator',
  icon: '💹',
  desc: 'Calculate selling price from cost and markup percentage or reverse-calculate margin',
  popular: true,
  hasChart: false,
  isNew: true,
  formula: 'Selling Price = Cost × (1 + Markup%/100)\n' +
    'Margin = Markup / (100 + Markup) × 100',
  tips: [
    'Markup of 50% gives a margin of 33.3% — markup and margin are not the same number.'
  ],
  intro: `The Markup Calculator determines the selling price of a product from its cost and a target markup percentage, or works in reverse to tell you the markup embedded in a known selling price. It also shows the profit margin so you can see exactly how markup and margin differ — a distinction that catches out many small business owners.`,
  workedExample: {
    title: 'Setting a retail price for a product that costs $42 with a 65% markup target',
    inputs: ['Cost price: $42.00', 'Markup: 65%'],
    steps: [
      'Selling Price = Cost × (1 + Markup/100)',
      'Selling Price = $42 × (1 + 0.65) = $42 × 1.65 = $69.30',
      'Gross Profit = $69.30 − $42 = $27.30',
      'Profit Margin = $27.30 ÷ $69.30 × 100 = 39.4%',
    ],
    result: 'Selling price is $69.30. Gross profit is $27.30 (39.4% margin, not 65%).',
  },
  relatedCalculators: ['roi-calculator', 'discount-calculator', 'conversion-rate-calculator', 'profit-calculator'],
  about: `Markup and margin are two different ways to express the same profit — and confusing them is one of the most common pricing mistakes in retail and wholesale businesses. A 50% markup is not the same as a 50% margin. Markup is calculated on cost; margin is calculated on revenue.

This calculator makes the relationship transparent: enter a cost and markup percentage and it shows you the selling price, gross profit, and the corresponding profit margin side by side. You can also reverse the calculation — enter a cost and a selling price to find out what markup percentage was applied.

Whether you're a retailer building a price list, a manufacturer setting wholesale rates, or a freelancer pricing a project, getting this relationship right directly affects profitability.`,
},
  {
  id: 'inventory-turnover',
  slug: 'inventory-turnover-calculator',
  cat: 'business',
  name: 'Inventory Turnover',
  icon: '📦',
  desc: 'Inventory turnover ratio, days in inventory and efficiency vs industry benchmark',
  popular: false,
  hasChart: false,
  isNew: true,
  formula: 'Turnover = COGS / Average Inventory\nDays in Inventory = 365 / Turnover',
  intro: `The Inventory Turnover Calculator measures how many times a business sells and replaces its stock in a given period, and how many days on average products sit in the warehouse before selling. It's a key efficiency metric for retailers, wholesalers, and manufacturers managing cash flow tied up in stock.`,
  workedExample: {
    title: 'Inventory turnover for a clothing retailer with $280,000 COGS',
    inputs: ['COGS: $280,000', 'Opening inventory: $45,000', 'Closing inventory: $55,000'],
    steps: [
      'Average Inventory = (Opening + Closing) ÷ 2 = ($45,000 + $55,000) ÷ 2 = $50,000',
      'Turnover Ratio = COGS ÷ Average Inventory = $280,000 ÷ $50,000 = 5.6×',
      'Days in Inventory = 365 ÷ 5.6 = 65 days',
      'Industry benchmark for clothing retail: typically 4–6× (65 days is within range)',
    ],
    result: 'Turnover of 5.6× means stock sells and is replaced every 65 days — within normal range for clothing.',
  },
  relatedCalculators: ['eoq-calculator', 'markup-calculator', 'roi-calculator'],
  about: `Inventory turnover is one of the clearest signals of operational efficiency in product-based businesses. A high ratio means stock is moving quickly — strong sales relative to the amount of capital tied up in inventory. A low ratio suggests overstocking, slow sales, or potential obsolescence.

The formula divides Cost of Goods Sold by Average Inventory (opening plus closing divided by two). The result tells you how many complete "inventory cycles" the business ran through in the period. Converting to Days in Inventory makes the metric more intuitive — 12× turnover means stock sits for about 30 days before selling.

The calculator shows your ratio alongside typical industry benchmarks so you can gauge whether your turnover is healthy for your sector.`,
},
  {
  id: 'eoq',
  slug: 'eoq-calculator',
  cat: 'business',
  name: 'EOQ Calculator',
  icon: '🔄',
  desc: 'Economic Order Quantity for minimum inventory costs with reorder point',
  popular: false,
  hasChart: false,
  isNew: true,
  formula: 'EOQ = √(2 × Demand × Order Cost / Holding Cost per Unit)',
  intro: `The EOQ Calculator finds the ideal order quantity that minimises the combined cost of ordering and holding inventory, using the Wilson EOQ formula. Supply chain managers, procurement teams, and small business owners use it to eliminate both the excess cost of over-ordering and the stockout risk of under-ordering.`,
  workedExample: {
    title: 'Finding the EOQ for a product with 1,200 units annual demand',
    inputs: ['Annual demand: 1,200 units', 'Order cost (per order): $35', 'Annual holding cost per unit: $4'],
    steps: [
      'EOQ = √(2 × D × S / H)',
      'EOQ = √(2 × 1,200 × 35 / 4)',
      'EOQ = √(84,000 / 4)',
      'EOQ = √21,000 = 144.9 ≈ 145 units per order',
      'Number of orders per year: 1,200 ÷ 145 = 8.3 orders',
      'Reorder point (assuming 7-day lead time): (1,200 ÷ 365) × 7 = 23 units',
    ],
    result: 'Optimal order quantity is 145 units. Reorder when stock reaches 23 units.',
  },
  relatedCalculators: ['inventory-turnover-calculator', 'markup-calculator', 'meeting-cost-calculator'],
  about: `The Economic Order Quantity model, developed by Ford W. Harris in 1913, solves a classic trade-off in inventory management: ordering large quantities reduces per-order costs but increases storage costs; ordering small quantities does the opposite. The EOQ is the mathematically optimal point where total costs are minimised.

The formula requires three inputs: annual demand (units sold per year), the fixed cost of placing one order (administrative, shipping, and receiving costs), and the annual holding cost per unit (storage, insurance, capital tied up, and obsolescence risk). The square root relationship means that doubling demand increases the optimal order size by only about 40%, not 100%.

The calculator also computes your reorder point based on supplier lead time, so you know exactly when to place the next order to avoid stockouts.`,
},
  {
  id: 'time-card',
  slug: 'time-card-calculator',
  cat: 'business',
  name: 'Time Card Calculator',
  icon: '⏱️',
  desc: 'Employee hours with break deduction, overtime calculation and weekly totals',
  popular: false,
  hasChart: false,
  isNew: true,
  intro: `The Time Card Calculator totals an employee's weekly hours from daily clock-in and clock-out times, deducts breaks, identifies overtime hours, and calculates gross pay. It's used by small business owners running payroll without dedicated software, and by employees verifying that their hours and pay are being calculated correctly.`,
  workedExample: {
    title: 'Weekly time card for a retail employee at $16.50/hour',
    inputs: ['Mon–Fri: 8:00 AM – 4:30 PM (same each day)', 'Break deduction: 30 min/day', 'Hourly rate: $16.50', 'Overtime threshold: 40 hours/week at 1.5× rate'],
    steps: [
      'Raw daily hours: 4:30 PM − 8:00 AM = 8.5 hours',
      'Net daily hours after break: 8.5 − 0.5 = 8.0 hours',
      'Total weekly hours: 8.0 × 5 = 40.0 hours',
      'Overtime hours: 40 − 40 = 0 (exactly at threshold, no OT)',
      'Gross pay: 40 × $16.50 = $660.00',
    ],
    result: '40 net hours worked. Gross pay: $660.00 with no overtime this week.',
  },
  relatedCalculators: ['overtime-calculator', 'salary-to-hourly-calculator', 'work-hours-calculator', 'employee-cost-calculator'],
  about: `Manual time tracking is prone to errors — small rounding mistakes on daily hours compound across a five-day week and multiply across an entire workforce. This calculator processes a full week of clock-in/out entries in one place, handling break deductions and identifying when total hours cross the overtime threshold.

Enter start time, end time, and break duration for each working day. The tool calculates net hours per day, weekly total, regular hours, overtime hours (above the configurable threshold), and gross earnings at your hourly rate with the applicable overtime multiplier.

For employers, it's a simple payroll verification tool. For employees, it's a way to confirm that the hours and pay on your payslip match what you actually worked.`,
},
  {
  id: 'overtime',
  slug: 'overtime-calculator',
  cat: 'business',
  name: 'Overtime Calculator',
  icon: '⏰',
  desc: 'Overtime pay with regular/OT/double-time rates and total weekly earnings',
  popular: false,
  hasChart: false,
  isNew: true,
  formula: 'OT Pay = (Hourly Rate × 1.5) × Overtime Hours',
  intro: `The Overtime Calculator computes an employee's total weekly pay when some hours fall under regular time, overtime (1.5×), and double time (2×) rates. It's used by hourly workers checking their expected pay, managers planning shift costs, and HR teams ensuring compliance with labour law overtime thresholds.`,
  workedExample: {
    title: 'Pay for a warehouse worker who clocked 52 hours this week',
    inputs: ['Base hourly rate: $20.00', 'Regular hours (up to 40): 40', 'Overtime hours (40–48, at 1.5×): 8', 'Double-time hours (above 48, at 2×): 4'],
    steps: [
      'Regular pay: 40 × $20.00 = $800.00',
      'Overtime pay (1.5×): 8 × $20.00 × 1.5 = $240.00',
      'Double-time pay (2×): 4 × $20.00 × 2.0 = $160.00',
      'Total gross pay: $800 + $240 + $160 = $1,200.00',
      'Effective hourly rate this week: $1,200 ÷ 52 hours = $23.08/hr average',
    ],
    result: 'Total gross pay for 52 hours is $1,200.00.',
  },
  relatedCalculators: ['time-card-calculator', 'salary-to-hourly-calculator', 'employee-cost-calculator', 'hourly-wage-calculator'],
  about: `Overtime pay rules are mandated by labour law in most countries, but the exact thresholds and multipliers vary by jurisdiction. In the US, federal law (FLSA) requires 1.5× pay for hours over 40 per week, though some states add daily overtime thresholds or double-time requirements above 12 hours in a day.

This calculator handles all three pay tiers — regular time, time-and-a-half, and double time — with configurable thresholds. Enter your base hourly rate and hours worked in each tier to get a full earnings breakdown. It also shows your effective average hourly rate for the week, which can be useful for tax withholding estimates.

Employers can use it to model the cost of extending a shift versus hiring additional staff; employees can verify that their payslip overtime figure is correct.`,
},
  {
  id: 'salary-to-hourly',
  slug: 'salary-to-hourly-calculator',
  cat: 'business',
  name: 'Salary to Hourly',
  icon: '💵',
  desc: 'Convert annual salary to hourly, daily, weekly and monthly equivalent rates',
  popular: true,
  hasChart: false,
  isNew: true,
  intro: `The Salary to Hourly Calculator converts an annual salary into equivalent hourly, daily, weekly, and monthly rates based on your working hours per week. It's used by job seekers comparing a salaried role to an hourly contract, freelancers setting day rates, and employees evaluating whether a pay rise actually improves their hourly rate.`,
  workedExample: {
    title: 'What is $72,000/year equivalent to per hour and per day?',
    inputs: ['Annual salary: $72,000', 'Hours per week: 40', 'Weeks per year: 52'],
    steps: [
      'Total annual hours: 40 × 52 = 2,080 hours',
      'Hourly rate: $72,000 ÷ 2,080 = $34.62/hour',
      'Daily rate (8-hour day): $34.62 × 8 = $276.92/day',
      'Weekly rate: $34.62 × 40 = $1,384.62/week',
      'Monthly rate: $72,000 ÷ 12 = $6,000.00/month',
    ],
    result: '$72,000/year = $34.62/hr = $276.92/day = $6,000/month.',
  },
  relatedCalculators: ['overtime-calculator', 'time-card-calculator', 'income-tax-calculator', 'salary-calculator'],
  about: `A salary number alone doesn't tell you whether a job is well-paid — $60,000 a year is a very different deal depending on whether you work 37.5 hours a week or 55. Converting annual salary to an hourly rate makes comparison immediate and fair across jobs with different hour expectations.

This calculator uses your specified weekly hours and working weeks per year to derive hourly, daily, weekly, and monthly equivalent rates. If you get paid time off, excluding those weeks from the calculation gives you a "true cost to employer" rate; including them gives you the "effective earning rate" from your perspective.

Contractors and freelancers often add a premium of 20–30% to their equivalent hourly rate to account for periods without work, self-employment taxes, and benefits they must provide for themselves.`,
},
  {
  id: 'meeting-cost',
  slug: 'meeting-cost-calculator',
  cat: 'business',
  name: 'Meeting Cost Calculator',
  icon: '🤝',
  desc: 'Real cost of meetings by attendee count, hourly rate and duration',
  popular: false,
  hasChart: false,
  isNew: true,
  tips: [
    'A 1-hour meeting with 10 people at $50/hour average salary costs the company $500 minimum.'
  ],
  intro: `The Meeting Cost Calculator shows the true salary cost of a meeting based on the number of attendees, their average hourly rate, and the meeting's duration. It's a tool for managers and team leads who want to quantify whether a recurring meeting's value justifies its cost — and make more intentional decisions about which meetings actually need to happen.`,
  workedExample: {
    title: 'Cost of a 90-minute weekly status meeting with 8 attendees',
    inputs: ['Attendees: 8 people', 'Average hourly rate: $55', 'Duration: 90 minutes (1.5 hours)', 'Frequency: Weekly (52× per year)'],
    steps: [
      'Cost per meeting: 8 attendees × $55/hr × 1.5 hours = $660',
      'Annual cost: $660 × 52 weeks = $34,320/year',
      'If meeting runs 15 minutes over: 8 × $55 × 1.75 = $770/meeting = $40,040/year',
    ],
    result: 'This weekly meeting costs $660 each time — $34,320 per year in salary cost alone.',
  },
  relatedCalculators: ['time-card-calculator', 'employee-cost-calculator', 'salary-to-hourly-calculator'],
  about: `Meetings have a hidden price tag that rarely appears in any budget line. Every minute of a meeting consumes salary time from every person in the room. A one-hour meeting with 12 people is actually 12 hours of company time — and at even a modest average salary, that cost adds up quickly when you multiply by how often the meeting recurs.

Enter the number of attendees, their average hourly compensation, and the meeting duration. The calculator shows the direct salary cost per meeting and, if you set a recurrence, the annual total. This figure doesn't include opportunity cost — the productive work those people aren't doing while in the meeting — which makes the real cost even higher.

The goal is not to eliminate meetings but to make their cost visible, helping teams decide which meetings genuinely earn their price and which could be an email.`,
},
  {
  id: 'conversion-rate',
  slug: 'conversion-rate-calculator',
  cat: 'business',
  name: 'Conversion Rate Calculator',
  icon: '📈',
  desc: 'Marketing conversion rate, leads needed, revenue potential and optimization impact',
  popular: false,
  hasChart: false,
  isNew: true,
  formula: 'Conversion Rate = (Conversions / Total Visitors) × 100',
  intro: `The Conversion Rate Calculator measures what percentage of your visitors or leads are completing a desired action, and shows how even a small improvement in conversion rate affects total revenue. It's used by digital marketers, e-commerce operators, and growth teams to model the ROI of optimisation efforts before investing in them.`,
  workedExample: {
    title: 'Revenue impact of raising conversion rate from 2.1% to 3.0%',
    inputs: ['Monthly visitors: 25,000', 'Current conversion rate: 2.1%', 'Target conversion rate: 3.0%', 'Average order value: $85'],
    steps: [
      'Current monthly conversions: 25,000 × 0.021 = 525 conversions',
      'Current monthly revenue: 525 × $85 = $44,625',
      'Target monthly conversions: 25,000 × 0.030 = 750 conversions',
      'Target monthly revenue: 750 × $85 = $63,750',
      'Revenue increase: $63,750 − $44,625 = $19,125/month (+42.8%)',
    ],
    result: 'Raising conversion rate by 0.9 percentage points adds $19,125/month in revenue.',
  },
  relatedCalculators: ['cpc-cpa-calculator', 'customer-lifetime-value-calculator', 'roi-calculator'],
  about: `Conversion rate is arguably the most leveraged metric in digital marketing: it multiplies the value of every visitor already arriving at your site. Unlike acquiring more traffic (which costs money), improving conversion rate generates more revenue from the same spend.

The formula is straightforward — divide conversions by total visitors and multiply by 100 — but the downstream implications are what matter. This calculator shows your current performance and models what happens to revenue if you improve conversion by a given percentage, making the ROI of CRO (Conversion Rate Optimisation) projects concrete before you commit budget to them.

The tool also works in reverse: enter a revenue target and average order value to find out how many conversions you need and, therefore, how much traffic or what conversion rate is required to reach it.`,
},
  {
  id: 'clv',
  slug: 'customer-lifetime-value-calculator',
  cat: 'business',
  name: 'Customer Lifetime Value',
  icon: '👤',
  desc: 'CLV calculation with average order value, purchase frequency and retention',
  popular: false,
  hasChart: false,
  isNew: true,
  formula: 'CLV = Average Purchase Value × Purchase Frequency × Customer Lifespan',
  tips: [
    'Increasing customer retention by 5% can increase profits by 25-95%.'
  ],
  intro: `The Customer Lifetime Value Calculator estimates the total revenue a single customer is expected to generate over their entire relationship with your business. It's a foundational metric for e-commerce, SaaS, and subscription businesses — CLV tells you the maximum amount you can profitably spend to acquire a new customer.`,
  workedExample: {
    title: 'CLV for an online coffee subscription service',
    inputs: ['Average order value: $38', 'Purchase frequency: 12 times per year', 'Average customer lifespan: 3.5 years', 'Gross margin: 60%'],
    steps: [
      'Annual revenue per customer: $38 × 12 = $456/year',
      'Total CLV (revenue): $456 × 3.5 years = $1,596',
      'CLV (gross profit): $1,596 × 0.60 = $957.60',
      'Maximum acceptable CAC (Customer Acquisition Cost): $957.60 (at 1:1 LTV:CAC)',
      'Healthy target CAC (3:1 LTV:CAC ratio): $957.60 ÷ 3 = $319.20',
    ],
    result: 'Customer lifetime value (profit) is $957.60. Target CAC should be under $319.',
  },
  relatedCalculators: ['conversion-rate-calculator', 'cpc-cpa-calculator', 'roi-calculator'],
  about: `Customer Lifetime Value (CLV) answers a fundamental business question: how much is a customer actually worth to you? Without this number, acquisition spending decisions are essentially guesswork — you don't know whether a $200 marketing cost to win a customer is a bargain or a disaster.

CLV is the product of average purchase value, purchase frequency, and expected customer lifespan. Applying your gross margin converts the revenue CLV into a profit CLV, which sets the true ceiling for what you can spend on acquisition. The standard benchmark is to keep Customer Acquisition Cost below one-third of profit CLV.

The calculator helps you model how changes in retention (lifespan), order value, or purchase frequency affect CLV — often revealing that investing in loyalty programmes or reducing churn delivers a higher return than simply driving more new customer traffic.`,
},
  {
  id: 'cpc-cpa',
  slug: 'cpc-cpa-calculator',
  cat: 'business',
  name: 'CPC / CPA Calculator',
  icon: '📣',
  desc: 'Ad campaign cost-per-click, cost-per-acquisition and ROAS metrics',
  popular: false,
  hasChart: false,
  isNew: true,
  formula: 'CPA = Total Cost / Conversions\nROAS = Revenue / Ad Spend × 100',
  intro: `The CPC/CPA Calculator analyses the efficiency of paid advertising campaigns by computing cost per click, cost per acquisition, and return on ad spend (ROAS). Digital marketers and media buyers use it to evaluate whether a campaign is profitable, compare the efficiency of different ad channels, and set target bids.`,
  workedExample: {
    title: 'Evaluating a Google Ads campaign: $1,800 spent, 4,200 clicks, 63 conversions',
    inputs: ['Total ad spend: $1,800', 'Total clicks: 4,200', 'Conversions: 63', 'Revenue from conversions: $7,560'],
    steps: [
      'CPC = Total Spend ÷ Clicks = $1,800 ÷ 4,200 = $0.43 per click',
      'CTR (if 210,000 impressions): 4,200 ÷ 210,000 × 100 = 2.0%',
      'Conversion rate: 63 ÷ 4,200 × 100 = 1.5%',
      'CPA = Total Spend ÷ Conversions = $1,800 ÷ 63 = $28.57 per acquisition',
      'ROAS = Revenue ÷ Spend × 100 = $7,560 ÷ $1,800 × 100 = 420%',
    ],
    result: 'CPC: $0.43 | CPA: $28.57 | ROAS: 420% (every $1 spent returned $4.20).',
  },
  relatedCalculators: ['conversion-rate-calculator', 'customer-lifetime-value-calculator', 'roi-calculator', 'markup-calculator'],
  about: `Paid advertising generates a stream of metrics — impressions, clicks, conversions, spend, revenue — but the numbers that actually tell you whether a campaign is working are CPC, CPA, and ROAS. This calculator derives all three from your campaign data in a single place.

Cost Per Click tells you the price of each visitor from your ad. Cost Per Acquisition tells you the price of each customer or lead, which you can compare directly against your Customer Lifetime Value to determine profitability. Return on Ad Spend expresses total revenue divided by ad spend as a percentage, making it easy to compare efficiency across different campaigns and channels.

A ROAS of 100% means you broke even; 300%+ is typically the target for direct-response campaigns, though the right threshold depends on your margin. Enter your campaign data to see immediately whether your spend is generating a positive return.`,
},
  {
  id: 'employee-cost',
  slug: 'employee-cost-calculator',
  cat: 'business',
  name: 'Employee Cost Calculator',
  icon: '👔',
  desc: 'True cost of employment: salary, benefits, taxes, overhead and productivity',
  popular: false,
  hasChart: true,
  isNew: true,
  tips: [
    'The true cost of an employee is typically 1.25-1.4× their base salary when including all costs.'
  ],
  intro: `The Employee Cost Calculator shows the full cost of employing someone beyond their base salary — including employer payroll taxes, benefits, equipment, office overhead, and training — so you can see the true per-employee expense that affects headcount budgets and profitability decisions. It's used by HR managers, finance teams, and small business owners evaluating whether to hire.`,
  workedExample: {
    title: 'True annual cost of hiring a $65,000/year software developer',
    inputs: ['Base salary: $65,000', 'Employer payroll taxes (FICA ~7.65%): $4,973', 'Health insurance (employer share): $6,200/year', 'Equipment & software: $3,500', 'Office overhead (desk, utilities, etc.): $4,800', 'Recruitment & training: $2,500 (amortised)'],
    steps: [
      'Total employer payroll taxes: $65,000 × 7.65% = $4,973',
      'Benefits total: $6,200 (health) + any retirement match',
      'Overhead total: $3,500 + $4,800 + $2,500 = $10,800',
      'Total employment cost: $65,000 + $4,973 + $6,200 + $10,800 = $86,973',
      'Cost multiplier: $86,973 ÷ $65,000 = 1.34× base salary',
    ],
    result: 'The true annual cost is approximately $86,973 — 34% above the base salary.',
  },
  relatedCalculators: ['salary-to-hourly-calculator', 'time-card-calculator', 'overtime-calculator', 'meeting-cost-calculator'],
  about: `The salary you agree on with a new employee is only part of what they cost the business. Employer-side payroll taxes, mandatory and voluntary benefits, the physical cost of a desk and equipment, training time, and management overhead all add up — typically bringing the real cost to 1.25–1.4 times base salary, and higher in countries with mandatory pension contributions or generous benefits packages.

This calculator breaks down every cost component so you can see the full number before making a hiring decision, building a headcount budget, or evaluating whether a contractor rate is actually more expensive than an employee equivalent.

The chart view shows the breakdown visually, making it easy to identify which cost categories are largest and where there might be room to restructure compensation. Understanding total employee cost also helps set client billing rates — if a consultant costs $90,000 all-in, billing them out at $45/hour on a 40-hour week produces zero margin.`,
},
];
