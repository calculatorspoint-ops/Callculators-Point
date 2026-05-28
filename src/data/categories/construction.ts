import type { CalculatorConfig } from '../calculatorConfigs';

export const constructionCalculators: CalculatorConfig[] = [
  {
  id: 'concrete',
  slug: 'concrete-calculator',
  cat: 'construction',
  name: 'Concrete Calculator',
  icon: '🧱',
  desc: 'Concrete volume and bags required for slabs, walls, footings and columns',
  popular: true,
  hasChart: false,
  isNew: true,
  formula: 'Volume = Length × Width × Depth\nBags = Volume(cu ft) × 0.45 / Bag weight',
  tips: [
    'Add 10% waste factor for any concrete pour to account for spillage and overfilling.'
  ],
      about: `Whether you're a professional or just looking for quick answers, the Concrete Calculator provides an instant solution for your needs. It helps you concrete volume and bags required for slabs, walls, footings and columns. This specialized tool is designed to eliminate manual computation errors and streamline your workflow with precise, step-by-step breakdowns.`
},
  {
  id: 'cement',
  slug: 'cement-calculator',
  cat: 'construction',
  name: 'Cement Calculator',
  icon: '🏗️',
  desc: 'Cement bags, sand and aggregate for any mix ratio and volume',
  popular: false,
  hasChart: false,
  isNew: true,
      about: `The Cement Calculator offers a hassle-free way to cement bags, sand and aggregate for any mix ratio and volume. Professionals and students alike rely on this calculator for its accuracy and ease of use. It strips away complicated jargon, letting you find the exact metric you need with just a few simple inputs.`
},
  {
  id: 'sand',
  slug: 'sand-calculator',
  cat: 'construction',
  name: 'Sand Calculator',
  icon: '⛱️',
  desc: 'Sand volume and weight for landscaping, concrete mix and foundation work',
  popular: false,
  hasChart: false,
  isNew: true,
      about: `We built the Sand Calculator specifically to sand volume and weight for landscaping, concrete mix and foundation work. By offering a clean, straightforward interface, it empowers users to generate reliable calculations in seconds. Discover exactly how the numbers align and take advantage of our built-in tips and formulas for complete transparency.`
},
  {
  id: 'gravel',
  slug: 'gravel-calculator',
  cat: 'construction',
  name: 'Gravel Calculator',
  icon: '🪨',
  desc: 'Gravel cubic yards and tons for driveways, paths and drainage',
  popular: false,
  hasChart: false,
  isNew: true,
      about: `The Gravel Calculator is an essential resource for anyone needing to gravel cubic yards and tons for driveways, paths and drainage. Designed with simplicity and speed in mind, it performs the heavy lifting behind the scenes so you can focus on making informed decisions. It's completely free, requires no signups, and works seamlessly on any device.`
},
  {
  id: 'asphalt',
  slug: 'asphalt-calculator',
  cat: 'construction',
  name: 'Asphalt Calculator',
  icon: '🛣️',
  desc: 'Asphalt weight and cost for roads and driveways',
  popular: false,
  hasChart: false,
  isNew: true,
      about: `The Asphalt Calculator is an essential resource for anyone needing to asphalt weight and cost for roads and driveways. Designed with simplicity and speed in mind, it performs the heavy lifting behind the scenes so you can focus on making informed decisions. It's completely free, requires no signups, and works seamlessly on any device.`
},
  {
  id: 'paint',
  slug: 'paint-calculator',
  cat: 'construction',
  name: 'Paint Calculator',
  icon: '🎨',
  desc: 'Paint quantity for walls, ceilings and rooms with coverage rate and cost',
  popular: true,
  hasChart: false,
  isNew: true,
  formula: 'Paint Needed = Wall Area / Coverage Rate per Gallon × Number of Coats',
  tips: [
    'Standard coverage: 1 gallon covers approximately 350-400 sq ft with one coat.'
  ],
      about: `The Paint Calculator is an essential resource for anyone needing to paint quantity for walls, ceilings and rooms with coverage rate and cost. Designed with simplicity and speed in mind, it performs the heavy lifting behind the scenes so you can focus on making informed decisions. It's completely free, requires no signups, and works seamlessly on any device.`
},
  {
  id: 'roofing',
  slug: 'roofing-calculator',
  cat: 'construction',
  name: 'Roofing Calculator',
  icon: '🏠',
  desc: 'Roofing area, shingles and material cost with pitch and waste factor',
  popular: false,
  hasChart: false,
  isNew: true,
      about: `Stop guessing and start using the Roofing Calculator to get immediate, accurate data. Specifically engineered to roofing area, shingles and material cost with pitch and waste factor, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
},
  {
  id: 'sq-footage',
  slug: 'square-footage-calculator',
  cat: 'construction',
  name: 'Square Footage Calculator',
  icon: '📐',
  desc: 'Total square footage for rooms, flooring, tiling and painting projects',
  popular: true,
  hasChart: false,
  isNew: true,
  tips: [
    'Add 10-15% overage when ordering flooring to account for cuts, waste and future repairs.'
  ],
      about: `The Square Footage Calculator offers a hassle-free way to total square footage for rooms, flooring, tiling and painting projects. Professionals and students alike rely on this calculator for its accuracy and ease of use. It strips away complicated jargon, letting you find the exact metric you need with just a few simple inputs.`
},
  {
  id: 'cubic-yard',
  slug: 'cubic-yard-calculator',
  cat: 'construction',
  name: 'Cubic Yard Calculator',
  icon: '📦',
  desc: 'Convert dimensions to cubic yards for bulk material ordering',
  popular: false,
  hasChart: false,
  isNew: true,
      about: `We built the Cubic Yard Calculator specifically to convert dimensions to cubic yards for bulk material ordering. By offering a clean, straightforward interface, it empowers users to generate reliable calculations in seconds. Discover exactly how the numbers align and take advantage of our built-in tips and formulas for complete transparency.`
},
  {
  id: 'construction-cost',
  slug: 'construction-cost-calculator',
  cat: 'construction',
  name: 'Construction Cost',
  icon: '💰',
  desc: 'Project cost estimate with area, labor rate, material cost and contingency',
  popular: true,
  hasChart: true,
  isNew: true,
  tips: [
    'Always add 10-20% contingency to construction budgets for unexpected costs.'
  ],
      about: `If you want to project cost estimate with area, labor rate, material cost and contingency, the Construction Cost is your perfect companion. Our advanced online tool replaces tedious manual spreadsheets by delivering instant outputs based on industry-standard formulas. You can use it repeatedly to test different scenarios and optimize your outcomes.`
},
  {
  id: 'electrical-load',
  slug: 'electrical-load-calculator',
  cat: 'construction',
  name: 'Electrical Load Calculator',
  icon: '⚡',
  desc: 'Total electrical load, recommended breaker size for home appliances',
  popular: false,
  hasChart: false,
  isNew: true,
  formula: 'Total Load (Watts) = Σ(Appliance Wattage × Daily Hours)\n' +
    'Amperage = Watts / Voltage',
      about: `Whether you're a professional or just looking for quick answers, the Electrical Load Calculator provides an instant solution for your needs. It helps you total electrical load, recommended breaker size for home appliances. This specialized tool is designed to eliminate manual computation errors and streamline your workflow with precise, step-by-step breakdowns.`
},
  {
  id: 'pipe-volume',
  slug: 'pipe-volume-calculator',
  cat: 'construction',
  name: 'Pipe Volume Calculator',
  icon: '🔧',
  desc: 'Volume capacity and flow rate of cylindrical pipes with unit conversion',
  popular: false,
  hasChart: false,
  isNew: true,
  formula: 'Volume = π × (Diameter/2)² × Length',
      about: `Stop guessing and start using the Pipe Volume Calculator to get immediate, accurate data. Specifically engineered to volume capacity and flow rate of cylindrical pipes with unit conversion, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
},
  {
  id: 'density',
  slug: 'density-calculator',
  cat: 'construction',
  name: 'Density Calculator',
  icon: '⚖️',
  desc: 'Mass, volume and density — solve for any one given the other two',
  popular: false,
  hasChart: false,
  isNew: true,
  formula: 'Density = Mass / Volume',
      about: `If you want to mass, volume and density — solve for any one given the other two, the Density Calculator is your perfect companion. Our advanced online tool replaces tedious manual spreadsheets by delivering instant outputs based on industry-standard formulas. You can use it repeatedly to test different scenarios and optimize your outcomes.`
},
  {
  id: 'pressure',
  slug: 'pressure-calculator',
  cat: 'construction',
  name: 'Pressure Calculator',
  icon: '🌡️',
  desc: 'Pressure from force and area with unit conversions (Pa, PSI, bar, atm)',
  popular: false,
  hasChart: false,
  isNew: true,
  formula: 'Pressure = Force / Area',
      about: `The Pressure Calculator offers a hassle-free way to pressure from force and area with unit conversions (Pa, PSI, bar, atm). Professionals and students alike rely on this calculator for its accuracy and ease of use. It strips away complicated jargon, letting you find the exact metric you need with just a few simple inputs.`
},
];
