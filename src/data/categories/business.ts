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
      about: `We built the Markup Calculator specifically to calculate selling price from cost and markup percentage or reverse-calculate margin. By offering a clean, straightforward interface, it empowers users to generate reliable calculations in seconds. Discover exactly how the numbers align and take advantage of our built-in tips and formulas for complete transparency.`
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
      about: `If you want to inventory turnover ratio, days in inventory and efficiency vs industry benchmark, the Inventory Turnover is your perfect companion. Our advanced online tool replaces tedious manual spreadsheets by delivering instant outputs based on industry-standard formulas. You can use it repeatedly to test different scenarios and optimize your outcomes.`
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
      about: `The EOQ Calculator is an essential resource for anyone needing to economic Order Quantity for minimum inventory costs with reorder point. Designed with simplicity and speed in mind, it performs the heavy lifting behind the scenes so you can focus on making informed decisions. It's completely free, requires no signups, and works seamlessly on any device.`
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
      about: `The Time Card Calculator is an essential resource for anyone needing to employee hours with break deduction, overtime calculation and weekly totals. Designed with simplicity and speed in mind, it performs the heavy lifting behind the scenes so you can focus on making informed decisions. It's completely free, requires no signups, and works seamlessly on any device.`
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
      about: `The Overtime Calculator offers a hassle-free way to overtime pay with regular/OT/double-time rates and total weekly earnings. Professionals and students alike rely on this calculator for its accuracy and ease of use. It strips away complicated jargon, letting you find the exact metric you need with just a few simple inputs.`
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
      about: `Whether you're a professional or just looking for quick answers, the Salary to Hourly provides an instant solution for your needs. It helps you convert annual salary to hourly, daily, weekly and monthly equivalent rates. This specialized tool is designed to eliminate manual computation errors and streamline your workflow with precise, step-by-step breakdowns.`
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
      about: `We built the Meeting Cost Calculator specifically to real cost of meetings by attendee count, hourly rate and duration. By offering a clean, straightforward interface, it empowers users to generate reliable calculations in seconds. Discover exactly how the numbers align and take advantage of our built-in tips and formulas for complete transparency.`
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
      about: `Stop guessing and start using the Conversion Rate Calculator to get immediate, accurate data. Specifically engineered to marketing conversion rate, leads needed, revenue potential and optimization impact, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
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
      about: `If you want to cLV calculation with average order value, purchase frequency and retention, the Customer Lifetime Value is your perfect companion. Our advanced online tool replaces tedious manual spreadsheets by delivering instant outputs based on industry-standard formulas. You can use it repeatedly to test different scenarios and optimize your outcomes.`
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
      about: `We built the CPC / CPA Calculator specifically to ad campaign cost-per-click, cost-per-acquisition and ROAS metrics. By offering a clean, straightforward interface, it empowers users to generate reliable calculations in seconds. Discover exactly how the numbers align and take advantage of our built-in tips and formulas for complete transparency.`
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
      about: `Stop guessing and start using the Employee Cost Calculator to get immediate, accurate data. Specifically engineered to true cost of employment: salary, benefits, taxes, overhead and productivity, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
},
];
