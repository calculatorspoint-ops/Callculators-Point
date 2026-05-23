export const constructionCalculators = [
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
  ]
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
  isNew: true
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
  isNew: true
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
  isNew: true
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
  isNew: true
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
  ]
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
  isNew: true
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
  ]
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
  isNew: true
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
  ]
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
    'Amperage = Watts / Voltage'
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
  formula: 'Volume = π × (Diameter/2)² × Length'
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
  formula: 'Density = Mass / Volume'
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
  formula: 'Pressure = Force / Area'
},
];
