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
  intro: `The Concrete Calculator determines the exact volume of concrete needed for slabs, footings, walls, and columns, then converts that volume into the number of pre-mixed bags required based on bag weight. Contractors, DIY builders, and construction students use it to order the right amount of material — avoiding both costly over-ordering and frustrating mid-pour shortages.`,
  workedExample: {
    title: 'Calculating concrete for a 4 m × 3 m × 0.1 m patio slab',
    inputs: ['Length: 4 m', 'Width: 3 m', 'Depth: 0.1 m (100 mm slab)'],
    steps: [
      'Volume = 4 × 3 × 0.1 = 1.2 m³',
      'Add 10% waste: 1.2 × 1.10 = 1.32 m³',
      'Convert to cubic feet: 1.32 × 35.315 = 46.6 ft³',
      '60 lb bags yield ~0.45 ft³ each: 46.6 ÷ 0.45 = 103.6 → 104 bags',
      'Or: 80 lb bags yield ~0.60 ft³ each: 46.6 ÷ 0.60 = 77.7 → 78 bags',
    ],
    result: 'A 4 m × 3 m × 100 mm slab requires approximately 1.32 m³ of concrete — 104 sixty-pound bags or 78 eighty-pound bags, including a 10% waste allowance.',
  },
  relatedCalculators: ['cement-calculator', 'sand-calculator', 'gravel-calculator', 'cubic-yard-calculator', 'square-footage-calculator'],
  about: `Concrete is sold by volume — typically cubic yards in the US or cubic metres elsewhere — but poured in dimensions of length, width, and depth. Converting between the two correctly, and then accounting for waste, form irregularities, and the specific yield of pre-mixed bags, is where most DIY estimates go wrong.

This calculator handles slabs, walls, footings (rectangular or round), and columns separately, because each shape has a different volume formula. For slabs and walls it's simple cuboid math; for round columns and circular footings it uses π × r² × depth. The bag count automatically adjusts based on the bag weight you select.

Before ordering, always round up to the nearest full bag and consider whether your job warrants a ready-mix truck (typically economical over about 0.5 m³). The calculator pairs directly with the Cement, Sand, and Gravel calculators if you're mixing your own concrete rather than using pre-mixed bags.`,
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
  intro: `The Cement Calculator determines how many bags of cement and what quantities of sand and aggregate you need for a custom concrete or mortar mix, based on your chosen mix ratio (such as 1:2:4 or 1:3) and total volume required. It's used by masons, structural engineers, and builders who mix their own concrete on-site rather than using pre-mixed bags.`,
  workedExample: {
    title: 'Calculating materials for a 1:2:4 mix for 1 m³ of concrete',
    inputs: ['Mix ratio: 1 part cement : 2 parts sand : 4 parts aggregate', 'Volume required: 1 m³ (after compaction, use dry volume = 1.54 m³)'],
    steps: [
      'Total parts = 1 + 2 + 4 = 7',
      'Cement volume = (1/7) × 1.54 = 0.22 m³',
      'Convert to bags: 0.22 m³ ÷ 0.035 m³/bag = 6.28 → 7 bags of 50 kg cement',
      'Sand volume = (2/7) × 1.54 = 0.44 m³ (≈ 0.70 tonnes)',
      'Aggregate volume = (4/7) × 1.54 = 0.88 m³ (≈ 1.30 tonnes)',
    ],
    result: 'For 1 m³ of M15 concrete (1:2:4 mix), you need 7 bags of cement (50 kg each), 0.44 m³ of sand, and 0.88 m³ of coarse aggregate.',
  },
  relatedCalculators: ['concrete-calculator', 'sand-calculator', 'gravel-calculator', 'construction-cost-calculator'],
  about: `When mixing concrete or mortar on-site, the mix ratio controls both strength and workability. A 1:1.5:3 ratio (M20 grade) is suitable for structural elements like beams and slabs; a 1:2:4 ratio (M15) works for foundations and mass concrete; a 1:4 cement-to-sand ratio is standard for brickwork mortar. Getting the proportions wrong by even 10% affects final strength noticeably.

The calculator applies the dry volume factor (typically 1.54) that accounts for the voids between aggregate particles before mixing — a common source of error in manual estimates. It then breaks the result into separate quantities for each constituent material, expressed in both volume and weight for easy ordering.

Use this tool when you have specific mix ratio requirements from a structural engineer's specification, or when ready-mixed concrete is unavailable and you're batching by the bag or by the cubic metre with a site mixer.`,
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
  intro: `The Sand Calculator computes the volume and weight of sand needed to fill or cover a defined area and depth, whether you're laying a paver base, filling a sandbox, bedding a pipe trench, or mixing into concrete. It converts between cubic yards, cubic metres, and tonnes to match however your local supplier sells bulk sand.`,
  workedExample: {
    title: 'Sand required for a 5 m × 4 m patio paver base at 50 mm depth',
    inputs: ['Length: 5 m', 'Width: 4 m', 'Depth: 0.05 m (50 mm compacted depth)'],
    steps: [
      'Volume = 5 × 4 × 0.05 = 1.0 m³',
      'Add 15% for compaction and wastage: 1.0 × 1.15 = 1.15 m³',
      'Dry sand bulk density ≈ 1,600 kg/m³',
      'Weight = 1.15 × 1,600 = 1,840 kg = 1.84 tonnes',
    ],
    result: 'A 5 m × 4 m paver base at 50 mm compacted depth requires approximately 1.15 m³ or 1.84 tonnes of sand.',
  },
  relatedCalculators: ['concrete-calculator', 'cement-calculator', 'gravel-calculator', 'cubic-yard-calculator'],
  about: `Sand is used in construction in several distinct forms: sharp sand for concrete mixes and mortar, soft building sand for plastering and pointing, kiln-dried sand for jointing block paving, and coarse grit sand for drainage layers. The bulk density varies between these types, which affects how much a given volume actually weighs — and therefore how many delivery bags or tonnes to order.

This calculator uses standard bulk density values for each sand type and converts your area and depth into the volume and weight figures that bulk suppliers quote. Because sand is typically sold by the tonne (metric), the weight output is the most directly useful number for ordering.

The volume figure is useful when checking whether a hired trailer or tipper truck can carry the full load in one trip. For projects involving concrete, this calculator works in conjunction with the Cement and Gravel calculators so you can estimate all three constituent materials together.`,
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
  intro: `The Gravel Calculator estimates the volume and weight of gravel, crushed stone, or decorative aggregate needed to cover a defined area at a specific depth, expressed in cubic yards, cubic metres, and tonnes. Homeowners planning driveways and landscapers estimating decorative paths use it to order accurately from bulk suppliers and avoid multiple partial deliveries.`,
  workedExample: {
    title: 'Gravel needed for a 10 m × 3 m driveway at 75 mm depth',
    inputs: ['Length: 10 m', 'Width: 3 m', 'Depth: 0.075 m (75 mm)'],
    steps: [
      'Volume = 10 × 3 × 0.075 = 2.25 m³',
      'Add 10% for compaction losses: 2.25 × 1.10 = 2.475 m³',
      'Convert to cubic yards: 2.475 × 1.308 = 3.24 yd³',
      'Gravel density (crushed limestone) ≈ 1,520 kg/m³',
      'Weight = 2.475 × 1,520 = 3,762 kg ≈ 3.76 tonnes',
    ],
    result: 'A 10 m × 3 m driveway at 75 mm depth needs approximately 2.48 m³ (3.24 yd³) or 3.76 tonnes of compacted gravel.',
  },
  relatedCalculators: ['sand-calculator', 'concrete-calculator', 'cubic-yard-calculator', 'asphalt-calculator'],
  about: `Gravel and crushed stone are bulk materials sold by the tonne or cubic yard, but laid out in dimensions of metres and millimetres. The gap between ordering unit and laying unit causes most estimation errors — especially because gravel's bulk density varies significantly between rock types. Pea gravel sits at about 1,400 kg/m³, while crushed granite runs closer to 1,680 kg/m³.

This calculator accounts for the selected material's density and a configurable compaction factor — typically 10% extra for gravel that will be driven over or tamped down. It outputs both the volume (for truck capacity planning) and the weight (for supplier ordering) simultaneously.

For driveway projects, pair this with the Asphalt Calculator if you're deciding between gravel and asphalt surfaces. For drainage layers and soakaway fills, the depth is usually specified by a civil engineer or building code; enter that depth directly and scale the area to your dimensions.`,
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
  intro: `The Asphalt Calculator estimates the weight and approximate material cost of asphalt (hot-mix or cold-lay) needed for a road, car park, or driveway by calculating volume from dimensions and applying the standard asphalt density. Paving contractors and property owners use it to budget projects and verify supplier quotes before committing to an order.`,
  workedExample: {
    title: 'Asphalt for a residential driveway 12 m × 4 m at 50 mm depth',
    inputs: ['Length: 12 m', 'Width: 4 m', 'Thickness: 0.05 m (50 mm compacted depth)'],
    steps: [
      'Area = 12 × 4 = 48 m²',
      'Volume = 48 × 0.05 = 2.4 m³',
      'Add 5% for waste and compaction: 2.4 × 1.05 = 2.52 m³',
      'Asphalt density ≈ 2,300 kg/m³ (standard hot-mix)',
      'Weight = 2.52 × 2,300 = 5,796 kg ≈ 5.8 tonnes',
      'At £80/tonne: estimated material cost = 5.8 × £80 = £464',
    ],
    result: 'A 12 m × 4 m driveway at 50 mm compacted depth requires approximately 5.8 tonnes of asphalt, with material cost around £464 at typical bulk rates.',
  },
  relatedCalculators: ['gravel-calculator', 'construction-cost-calculator', 'square-footage-calculator'],
  about: `Asphalt is almost universally sold by the tonne, but paving jobs are specified in area and thickness. A standard 50 mm residential driveway layer uses roughly 115 kg of asphalt per square metre — a figure most contractors know by experience, but one that trips up homeowners getting their first paving quote.

Hot-mix asphalt (laid by specialist paving contractors) and cold-lay asphalt (available in bags from builders merchants for repairs) have slightly different densities. The calculator defaults to hot-mix density (approximately 2,300 kg/m³) but allows adjustment for different mix types or cold-lay products.

The material cost estimate is a rough baseline — actual project costs include plant hire, labour, sub-base preparation, and any kerb or edging work. Use this calculator to sanity-check contractor quotes: if a quote implies significantly more or fewer tonnes than the calculator suggests, ask for clarification before signing anything.`,
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
  intro: `The Paint Calculator determines how many litres or gallons of paint you need to cover walls and ceilings in a room, accounting for doors, windows, number of coats, and paint coverage rate. Interior decorators, DIY renovators, and painting contractors use it to avoid buying too little (requiring a mid-job store run) or too much (wasting expensive paint).`,
  workedExample: {
    title: 'Painting a bedroom: 4 m × 3.5 m room, 2.4 m ceiling height',
    inputs: ['Room: 4 m × 3.5 m, height 2.4 m', 'Two doors: each 0.9 m × 2.1 m', 'One window: 1.2 m × 1.0 m', 'Two coats of paint, coverage: 12 m²/litre'],
    steps: [
      'Total wall perimeter: 2 × (4 + 3.5) = 15 m',
      'Gross wall area: 15 × 2.4 = 36 m²',
      'Subtract doors: 2 × (0.9 × 2.1) = 3.78 m²',
      'Subtract window: 1 × (1.2 × 1.0) = 1.20 m²',
      'Net wall area: 36 − 3.78 − 1.20 = 31.02 m²',
      'Two coats: 31.02 × 2 = 62.04 m²',
      'Paint needed: 62.04 ÷ 12 = 5.17 litres → buy 6 litres (2 × 2.5 L tins)',
    ],
    result: 'This bedroom requires approximately 5.2 litres of wall paint for two coats. Purchase two 2.5-litre tins (5 litres) and top up with a small can for touch-ups.',
  },
  relatedCalculators: ['square-footage-calculator', 'roofing-calculator', 'construction-cost-calculator'],
  about: `Paint coverage varies significantly between product types: economy emulsions often cover 10–11 m² per litre, premium matt finishes 12–14 m², and specialist paints like wood primers or masonry paint have their own stated coverage rates on the tin. Using the wrong coverage figure is the most common reason paint estimates miss by 20–30%.

The calculator deducts door and window areas before computing paint volume — a step often skipped in quick estimates. For highly porous surfaces like bare plaster or new plasterboard, the first coat acts as a seal and covers significantly less area than the stated rate; the calculator includes a porosity adjustment for this case.

Ceiling paint is almost always white and uses a different product from wall paint, so the calculator separates wall and ceiling quantities. For multi-room projects, add each room separately and sum the totals to get one shopping list that covers the entire job.`,
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
  intro: `The Roofing Calculator computes the true sloped surface area of a roof from the ground footprint and pitch angle, then estimates the number of shingles or roofing sheets needed including a waste allowance for cutting and overlapping. Roofers, building contractors, and homeowners getting replacement quotes use it to cross-check material estimates before purchasing.`,
  workedExample: {
    title: 'Calculating shingles for a 10 m × 8 m house with a 4:12 pitch',
    inputs: ['Roof footprint: 10 m × 8 m (single gable)', 'Pitch: 4:12 (4 inches rise per 12 inches run)', 'Waste factor: 10%'],
    steps: [
      'Pitch multiplier for 4:12: √(1 + (4/12)²) = √(1 + 0.111) = √1.111 = 1.054',
      'Sloped roof area: 10 × 8 × 1.054 = 84.3 m² (both sides of gable)',
      'Add 10% waste: 84.3 × 1.10 = 92.7 m²',
      'One roofing square = 9.29 m² (100 sq ft)',
      'Squares needed: 92.7 ÷ 9.29 = 9.98 → 10 squares',
      'Standard bundle covers ~3.3 m²; bundles needed: 92.7 ÷ 3.3 = 28.1 → 29 bundles',
    ],
    result: 'This gable roof requires 10 roofing squares or approximately 29 shingle bundles, including a 10% waste allowance for cuts at hips, ridges, and valleys.',
  },
  relatedCalculators: ['paint-calculator', 'square-footage-calculator', 'construction-cost-calculator'],
  about: `Roofing materials are ordered by the square (100 square feet or ~9.3 m²), but the sloped surface area is always larger than the footprint you measure on a floor plan. A 4:12 pitch adds about 5.4% to the area; a steep 12:12 pitch (45°) adds over 41%. Applying the pitch multiplier before calculating shingle quantities is essential — it's the single most common mistake in DIY roofing material estimates.

This calculator applies the correct pitch multiplier for both gable and hip roofs, then adds a configurable waste factor (typically 10% for straight cuts, 15–20% for complex roofs with many valleys and dormers). It outputs results in both m² and roofing squares to match different supplier ordering systems.

Roofing costs also include underlayment, ridge caps, flashing, and fasteners — materials not captured here but which typically add 15–25% to the shingle cost. Use the Construction Cost Calculator to build a complete budget estimate once you have the material quantities from this tool.`,
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
  intro: `The Square Footage Calculator finds the area of rectangular, circular, triangular, or L-shaped spaces in square feet, square metres, or square yards. Homeowners measuring for flooring, tiles, or carpets, and tradespeople quoting jobs by the square foot, use it to get accurate area figures without converting between units manually.`,
  workedExample: {
    title: 'Calculating tile quantity for an L-shaped kitchen floor',
    inputs: ['Section A: 4.5 m × 3 m', 'Section B: 2 m × 1.8 m', 'Tile size: 60 cm × 60 cm, waste factor: 10%'],
    steps: [
      'Area A: 4.5 × 3 = 13.5 m²',
      'Area B: 2 × 1.8 = 3.6 m²',
      'Total net area: 13.5 + 3.6 = 17.1 m²',
      'Add 10% for cuts and waste: 17.1 × 1.10 = 18.81 m²',
      'One 60×60 cm tile covers 0.36 m²',
      'Tiles needed: 18.81 ÷ 0.36 = 52.25 → order 53 tiles',
    ],
    result: 'The L-shaped kitchen requires 18.81 m² of tiles — order 53 tiles (600×600 mm) to complete the job with a 10% cutting waste allowance.',
  },
  relatedCalculators: ['area-calculator', 'paint-calculator', 'roofing-calculator', 'concrete-calculator', 'area-converter'],
  about: `Square footage is the most commonly measured quantity in construction and real estate, yet unit confusion — square feet vs. square metres vs. square yards — causes expensive ordering mistakes. A 15 m² room is approximately 161 square feet, but misreading the unit and ordering 15 square feet of flooring covers less than 1.4 m².

This calculator handles common room shapes directly: rectangles, squares, triangles (for diagonal-cut areas), circles (for curved alcoves or pools), and L-shapes without requiring you to sketch the space and add sub-areas manually. Each shape uses the correct geometric formula and converts the result to your preferred output unit.

For flooring and tiling, the calculator includes a waste percentage input — tile cuts along walls and diagonal layouts waste significantly more material than square-on-square layouts. Flooring manufacturers typically recommend 10% overage for straight lay and 15% for diagonal or herringbone patterns.`,
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
  intro: `The Cubic Yard Calculator converts length, width, and depth measurements into cubic yards — the standard unit for ordering bulk materials like concrete, topsoil, mulch, fill dirt, and gravel in the United States. Landscapers, contractors, and homeowners use it to match project dimensions to delivery truck loads and avoid under- or over-ordering.`,
  workedExample: {
    title: 'Cubic yards of topsoil needed for a raised garden bed',
    inputs: ['Length: 12 feet', 'Width: 4 feet', 'Depth: 8 inches (0.667 feet)'],
    steps: [
      'Volume in cubic feet: 12 × 4 × 0.667 = 32 ft³',
      'Convert to cubic yards: 32 ÷ 27 = 1.185 yd³',
      'Add 10% for settling: 1.185 × 1.10 = 1.30 yd³',
      '1 cubic yard of topsoil ≈ 2,000 lbs (≈ 900 kg)',
      'Approximate weight: 1.30 × 2,000 = 2,600 lbs',
    ],
    result: 'This raised garden bed needs approximately 1.3 cubic yards of topsoil — a standard half-scoop delivery is 0.5 yd³, so three deliveries or one 1.5 yd³ order would cover the project.',
  },
  relatedCalculators: ['volume-calculator', 'concrete-calculator', 'gravel-calculator', 'sand-calculator'],
  about: `One cubic yard equals 27 cubic feet — a conversion that seems simple but trips up anyone mixing feet and inches for length and depth. Entering depth in inches without converting to feet first produces an answer off by a factor of 12, which is a common and expensive mistake when ordering truckloads of material.

This calculator handles the inch-to-feet conversion internally, accepting length and width in feet, yards, or metres and depth in inches or centimetres, then outputting the final volume in cubic yards, cubic feet, and cubic metres simultaneously. It also estimates the weight of common materials at that volume for truck capacity planning.

Landscaping projects — topsoil for lawns, mulch for garden beds, fill dirt for levelling — are typically quoted in cubic yards. Ready-mix concrete trucks carry 8–10 cubic yards; a typical landscaping delivery truck carries 1–3 cubic yards. Knowing your required volume in cubic yards first makes it straightforward to plan how many deliveries you need.`,
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
  intro: `The Construction Cost Calculator produces a parametric project budget by combining floor area, labour rate per square foot or metre, material cost estimates, and a contingency percentage into a structured cost breakdown. Project managers, property developers, and homeowners planning extensions or renovations use it to stress-test budgets before committing to contracts.`,
  workedExample: {
    title: 'Estimating cost for a 50 m² single-storey extension',
    inputs: ['Floor area: 50 m²', 'Build cost rate: £1,800/m²', 'Contingency: 15%', 'Professional fees (architect, engineer): 12% of build cost'],
    steps: [
      'Base build cost: 50 m² × £1,800 = £90,000',
      'Contingency (15%): £90,000 × 0.15 = £13,500',
      'Professional fees (12%): £90,000 × 0.12 = £10,800',
      'Total project cost: £90,000 + £13,500 + £10,800 = £114,300',
      'Cost per m² including all extras: £114,300 ÷ 50 = £2,286/m²',
    ],
    result: 'A 50 m² single-storey extension at £1,800/m² base rate has a total all-in project cost of approximately £114,300, including 15% contingency and 12% professional fees.',
  },
  relatedCalculators: ['square-footage-calculator', 'concrete-calculator', 'paint-calculator', 'roi-calculator'],
  about: `Construction budgets routinely overrun because early estimates include only the headline build cost and omit the contingency, professional fees, planning costs, utility connections, and site preparation that together typically add 25–40% to the base construction figure. This calculator makes those line items explicit rather than letting them surface as surprises.

The cost-per-area approach is a starting point, not a final quotation. Regional labour costs, site conditions, material specifications, and structural requirements all drive significant variation. The UK average new-build cost differs substantially from London rates; a timber-frame extension costs differently from masonry. Enter costs from real quotes into the individual fields for a more accurate picture.

The built-in chart breaks the total into material, labour, professional fees, and contingency categories, making it easy to show clients or stakeholders where the budget goes. For comparison analysis, vary the contingency percentage (5% for straightforward projects, 20% for complex conversions) to see the sensitivity of the total to that single assumption.`,
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
  formula: 'Total Load (Watts) = Σ(Appliance Wattage × Daily Hours)\nAmperage = Watts / Voltage',
  intro: `The Electrical Load Calculator totals the wattage of appliances on a circuit or in a property, converts the result to amperage at your supply voltage, and recommends the minimum breaker size to run safely without tripping. Electricians sizing new panels, homeowners adding circuits, and engineers planning building services use it to ensure circuits are neither undersized nor wastefully oversized.`,
  workedExample: {
    title: 'Calculating load for a kitchen circuit at 240 V',
    inputs: ['Refrigerator: 150 W', 'Microwave: 1,200 W', 'Dishwasher: 1,800 W', 'Electric kettle: 2,000 W', 'Supply voltage: 240 V'],
    steps: [
      'Total wattage: 150 + 1,200 + 1,800 + 2,000 = 5,150 W',
      'Note: kettle and microwave rarely run simultaneously; peak load ≈ 3,950 W',
      'Peak amperage: 3,950 ÷ 240 = 16.5 A',
      'Apply 80% NEC derate: required breaker capacity = 16.5 ÷ 0.80 = 20.6 A',
      'Next standard breaker size: 25 A (or 20 A if staggering appliance use)',
    ],
    result: 'This kitchen circuit requires at least a 20–25 A breaker at 240 V. Running the dishwasher and kettle simultaneously would trip a 16 A breaker.',
  },
  relatedCalculators: ['pipe-volume-calculator', 'pressure-calculator', 'density-calculator'],
  about: `Every electrical circuit has a rated capacity, and the National Electrical Code (NEC) and equivalent standards require that circuits be sized so that the calculated load does not exceed 80% of the breaker rating — the "80% derate rule." Overloading a circuit doesn't just trip the breaker; chronic overloads generate heat in wiring, degrading insulation over time and creating a fire risk.

This calculator adds up the wattage of all appliances on a circuit, converts to amperage at the supply voltage (120 V in North America, 230–240 V in Europe and the UK, 415 V for three-phase), and then applies the 80% derate to give the minimum safe breaker rating. It flags when existing circuits are at or near capacity.

For whole-house load calculations used to size a main service panel, sum all individual circuit loads and apply a demand factor (not all circuits run at full load simultaneously). This tool handles the per-circuit calculation; for panel sizing, work with a licensed electrician who will also account for future load growth and local code requirements.`,
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
  intro: `The Pipe Volume Calculator finds the internal volume of a cylindrical pipe or tube from its bore diameter and length, with full unit conversion between litres, gallons, cubic metres, and cubic feet. Plumbers, HVAC engineers, and process piping designers use it to size water storage in pipework, calculate fill/drain times, and determine the mass of fluid-filled pipe runs.`,
  workedExample: {
    title: 'Volume of water in a 50 m run of 100 mm bore pipe',
    inputs: ['Internal diameter: 100 mm (0.1 m)', 'Length: 50 m'],
    steps: [
      'Radius = 0.1 ÷ 2 = 0.05 m',
      'Cross-sectional area = π × 0.05² = π × 0.0025 = 0.007854 m²',
      'Volume = 0.007854 × 50 = 0.3927 m³',
      'Convert to litres: 0.3927 × 1,000 = 392.7 litres',
      'Weight of water: 392.7 × 1 kg/litre = 392.7 kg ≈ 393 kg',
    ],
    result: 'A 50 m run of 100 mm bore pipe holds approximately 392.7 litres (392.7 kg) of water. This must be considered in structural support calculations for horizontal pipe runs.',
  },
  relatedCalculators: ['volume-calculator', 'density-calculator', 'electrical-load-calculator', 'pressure-calculator'],
  about: `The volume of fluid in a pipe run has direct engineering implications: a large-diameter heating main holds hundreds of litres of water, which affects boiler sizing, pressurisation vessels, and the time and energy needed to heat the system from cold. For gas pipelines, the volume determines purge requirements. For fuel lines, it affects priming procedures and pressure loss calculations.

The formula is simple — π × radius² × length — but the practical challenge is keeping units consistent when pipe diameters are often given in millimetres while lengths are in metres or feet. This calculator handles all unit combinations and outputs volume in litres, US gallons, imperial gallons, cubic metres, and cubic feet simultaneously.

Process engineers and facility managers also use the pipe volume to calculate the weight of filled pipe runs for structural loading, the glycol volume needed for freeze protection in HVAC systems, and the water volume for chemical dosing calculations in industrial water treatment.`,
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
  intro: `The Density Calculator solves the Density = Mass / Volume relationship in any direction: give it any two values and it finds the third. Materials engineers, construction estimators, and physics students use it to identify unknown materials from measured mass and volume, convert bulk volume to weight for ordering, or verify that a material specification matches expected density.`,
  workedExample: {
    title: 'Finding the density of a concrete sample from lab measurements',
    inputs: ['Sample mass: 2.35 kg', 'Sample volume: 0.001 m³ (1,000 cm³ cylinder)'],
    steps: [
      'Density = Mass ÷ Volume',
      'Density = 2.35 kg ÷ 0.001 m³ = 2,350 kg/m³',
      'Compare to reference: normal concrete density = 2,300–2,400 kg/m³',
      'Result is within the expected range — sample is unreinforced structural concrete',
      'In g/cm³: 2,350 kg/m³ = 2.35 g/cm³',
    ],
    result: 'The concrete sample has a density of 2,350 kg/m³ (2.35 g/cm³), which falls within the normal range for structural concrete.',
  },
  relatedCalculators: ['pressure-calculator', 'volume-calculator', 'pipe-volume-calculator', 'weight-converter'],
  about: `Density is the bridge between volume and mass — and that bridge is essential for almost every bulk material calculation in construction and engineering. When a supplier quotes sand in tonnes but you've measured your excavation in cubic metres, density converts between the two. When a structural engineer specifies that concrete must reach 2,400 kg/m³, a simple lab measurement and this calculation confirms compliance.

The tool accepts input in any combination of SI and imperial units: kilograms, grams, pounds, tonnes for mass; cubic metres, litres, cubic feet, cubic inches, millilitres for volume. It then outputs density in kg/m³, g/cm³, and lb/ft³ simultaneously, which covers the units used in material data sheets across different engineering standards.

Density lookups are also useful in reverse: if you know a material's tabulated density and can measure its mass, the calculator tells you its volume — useful for irregularly shaped objects that are hard to measure directly but easy to weigh. This is a standard technique in materials science and quality control.`,
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
  intro: `The Pressure Calculator computes pressure from force and area, or solves for force or area when pressure is known, with instant conversion between Pascals, PSI, bar, kPa, MPa, and atmospheres. Civil engineers calculating bearing pressures, HVAC engineers sizing systems, and hydraulics technicians verifying system pressures use it to cross-check specifications and convert between unit systems.`,
  workedExample: {
    title: 'Calculating soil bearing pressure under a column footing',
    inputs: ['Column load: 250 kN (kilonewtons)', 'Footing dimensions: 1.5 m × 1.5 m'],
    steps: [
      'Footing area = 1.5 × 1.5 = 2.25 m²',
      'Pressure = Force ÷ Area = 250,000 N ÷ 2.25 m² = 111,111 Pa',
      'Convert to kPa: 111,111 ÷ 1,000 = 111.1 kPa',
      'Compare to allowable bearing capacity of soil: typical stiff clay ≈ 100–200 kPa',
      'Bearing pressure (111.1 kPa) is within allowable range for stiff clay — footing is adequate',
    ],
    result: 'The 1.5 m × 1.5 m footing under 250 kN column load exerts 111.1 kPa (16.1 PSI) on the soil, which is within acceptable limits for most stiff clay soils.',
  },
  relatedCalculators: ['density-calculator', 'electrical-load-calculator', 'pipe-volume-calculator'],
  about: `Pressure — force distributed over area — appears in structural engineering (soil bearing pressures under foundations), fluid mechanics (pipe system pressures), pneumatics (compressed air systems), and HVAC (duct static pressures). The same physical quantity is expressed in wildly different units depending on the discipline: geotechnical engineers use kPa, pipeline engineers use bar, American mechanical systems use PSI, and physics uses Pascals.

This calculator solves P = F/A in any direction and converts the result to all major pressure units simultaneously. Structural engineers use it to check whether a proposed footing area distributes column loads within the soil's allowable bearing capacity. Hydraulic engineers use it to verify that system operating pressures stay below component pressure ratings.

For fluid pressure specifically, the hydrostatic equation P = ρgh gives pressure from fluid density, gravity, and depth — a separate but related calculation. The Density Calculator provides the ρ (density) input if you're working with non-water fluids, making the two tools complementary for piping and tank design.`,
},
];
