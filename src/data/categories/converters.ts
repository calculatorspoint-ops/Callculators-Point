import type { CalculatorConfig } from '../calculatorConfigs';

export const convertersCalculators: CalculatorConfig[] = [
  {
  id: 'length',
  slug: 'length-converter',
  cat: 'converters',
  name: 'Length Converter',
  icon: '📏',
  desc: '9 units: mm, cm, m, km, in, ft, yard, mile, nautical mile',
  popular: true,
  hasChart: false,
  isNew: false,
  intro: `The Length Converter converts between nine units of length — from millimetres to nautical miles — instantly and bidirectionally. Engineers switching between metric and imperial measurements, students doing science homework, and travellers converting road distances will all find a use for it.`,
  workedExample: {
    title: 'Converting a 26.2-mile marathon distance to kilometres',
    inputs: ['Input: 26.2 miles', 'Target unit: kilometres'],
    steps: [
      '1 mile = 1.60934 km',
      '26.2 × 1.60934 = 42.164... km',
      'Round to 2 decimal places: 42.16 km',
    ],
    result: '26.2 miles = 42.16 kilometres (the standard marathon distance).',
  },
  relatedCalculators: ['area-converter', 'weight-converter', 'speed-converter', 'distance-calculator'],
  about: `Length is the most fundamental physical measurement, and the world uses two incompatible systems to express it — metric (SI) and imperial. Scientists use metres, engineers often need both, and everyday life constantly mixes the two: a recipe in inches, a road sign in miles, a product spec in millimetres.

This converter handles 9 units: millimetre, centimetre, metre, kilometre, inch, foot, yard, mile, and nautical mile. Enter a value in any field and all others update instantly. The conversion uses precise factors (not rounded approximations) to keep results accurate to many decimal places.

Nautical miles are included because they're still the standard in aviation and maritime navigation — one nautical mile equals exactly one minute of arc along a meridian (1,852 metres).`,
},
  {
  id: 'weight',
  slug: 'weight-converter',
  cat: 'converters',
  name: 'Weight Converter',
  icon: '⚖️',
  desc: '8 units: mg, g, kg, tonne, oz, lb, stone, carat',
  popular: true,
  hasChart: false,
  isNew: false,
  intro: `The Weight Converter converts between eight units of mass — from milligrams to metric tonnes — covering everyday weighing, medical dosing, jewellery measurement, and shipping requirements. It handles both metric and imperial units in one place, updating all fields simultaneously when you type in any one of them.`,
  workedExample: {
    title: 'Converting a 185 lb person\'s weight to kilograms and stone',
    inputs: ['Input: 185 pounds', 'Target units: kilograms and stone'],
    steps: [
      '1 pound = 0.453592 kg',
      '185 × 0.453592 = 83.91 kg',
      '1 stone = 14 pounds',
      '185 ÷ 14 = 13 stone 3 pounds (13.21 stone)',
    ],
    result: '185 lb = 83.91 kg = 13 stone 3 lb.',
  },
  relatedCalculators: ['bmi-calculator', 'ideal-weight-calculator', 'length-converter'],
  about: `Weight conversions come up in surprisingly varied contexts: a doctor prescribing medication in milligrams, a jeweller weighing gold in carats, a shipper calculating freight in tonnes, or someone tracking their body weight across countries that use different units. Getting the conversion wrong in any of these contexts has real consequences.

This converter covers milligrams, grams, kilograms, metric tonnes, ounces, pounds, stone, and carats — the eight units that account for the vast majority of everyday and professional weighing needs. Type in any field and all others update simultaneously.

Note that the tool converts mass (the scientific measure of matter), which equals weight under standard gravity (9.81 m/s²). For everyday purposes, mass and weight are interchangeable.`,
},
  {
  id: 'temperature',
  slug: 'temperature-converter',
  cat: 'converters',
  name: 'Temperature Converter',
  icon: '🌡️',
  desc: 'Bidirectional C/F/K — type any field, all update instantly',
  popular: true,
  hasChart: false,
  isNew: false,
  intro: `The Temperature Converter converts between Celsius, Fahrenheit, and Kelvin in real time — type in any field and the other two update instantly. It's used by cooks adapting international recipes, scientists working across measurement systems, and travellers checking weather in unfamiliar units.`,
  workedExample: {
    title: 'Converting an oven temperature of 375°F for a metric recipe',
    inputs: ['Input: 375°F', 'Target units: Celsius and Kelvin'],
    steps: [
      '°C = (°F − 32) × 5/9',
      '°C = (375 − 32) × 5/9 = 343 × 0.5556 = 190.6°C',
      'Kelvin = °C + 273.15 = 190.6 + 273.15 = 463.75 K',
    ],
    result: '375°F = 190.6°C = 463.75 K. Set the oven to 190°C (fan-forced: 170°C).',
  },
  relatedCalculators: ['length-converter', 'speed-converter', 'weight-converter'],
  about: `Temperature is one of only a handful of physical properties where the world genuinely uses three different scales in active daily use. Celsius is standard for most of the world's weather and cooking. Fahrenheit dominates in the United States. Kelvin is the SI base unit used in physics, chemistry, and engineering.

The conversion formulas are not just multiplication — they involve offsets (the Fahrenheit scale has a different zero point than Celsius, and Kelvin's zero is absolute zero, not freezing water). These nested additions and multiplications make mental conversion unreliable beyond rough estimates.

This tool removes that friction: type a value in any of the three fields and all others update instantly, with no need to select a direction or click Convert.`,
},
  {
  id: 'speed',
  slug: 'speed-converter',
  cat: 'converters',
  name: 'Speed Converter',
  icon: '🚀',
  desc: '6 units: m/s, km/h, mph, knot, ft/s, Mach',
  popular: false,
  hasChart: false,
  isNew: false,
  intro: `The Speed Converter converts between six units of speed — metres per second, kilometres per hour, miles per hour, knots, feet per second, and Mach — making it useful for everything from checking a car's speedometer in different units to calculating airspeed in aeronautics or wind speed in meteorology.`,
  workedExample: {
    title: 'Converting a wind speed of 45 knots to km/h and mph',
    inputs: ['Input: 45 knots', 'Target units: km/h and mph'],
    steps: [
      '1 knot = 1.852 km/h',
      '45 × 1.852 = 83.34 km/h',
      '1 knot = 1.15078 mph',
      '45 × 1.15078 = 51.79 mph',
      'This corresponds to a Category 1 hurricane-force wind',
    ],
    result: '45 knots = 83.34 km/h = 51.8 mph.',
  },
  relatedCalculators: ['length-converter', 'fuel-cost-calculator', 'running-pace-calculator', 'distance-calculator'],
  about: `Speed is expressed differently depending on the field: road vehicles use km/h or mph, aviation uses knots, physics uses m/s, and supersonic speeds use Mach numbers. Each field has its own reasons for its preferred unit, and converting between them manually requires knowing and applying the exact conversion factor — easy to misremember.

This converter handles all six common speed units in one tool. Mach 1 (the speed of sound) varies with altitude and temperature; the converter uses the standard sea-level value of 340.3 m/s (Mach 1 = 1,235 km/h at 15°C). Knots are used in aviation and maritime navigation because they relate directly to nautical miles per hour, which in turn relate to latitude degrees.

Enter any speed in any unit and all five others update instantly.`,
},
  {
  id: 'data',
  slug: 'data-storage-converter',
  cat: 'converters',
  name: 'Data Storage Converter',
  icon: '💾',
  desc: '6 units: B, KB, MB, GB, TB, PB',
  popular: false,
  hasChart: false,
  isNew: false,
  intro: `The Data Storage Converter converts between bytes, kilobytes, megabytes, gigabytes, terabytes, and petabytes — the units you encounter when dealing with file sizes, storage capacity, RAM, and data transfer limits. It uses the binary standard (1 KB = 1,024 bytes) that operating systems use to report storage.`,
  workedExample: {
    title: 'How many GB is a 4,700 MB Blu-ray movie file?',
    inputs: ['Input: 4,700 MB', 'Target unit: GB (binary)', 'Convention: 1 GB = 1,024 MB'],
    steps: [
      '4,700 MB ÷ 1,024 = 4.59 GB',
      'In decimal (1 GB = 1,000 MB): 4,700 ÷ 1,000 = 4.7 GB',
      'OS will report ~4.59 GB; drive manufacturer labels it ~4.7 GB',
    ],
    result: '4,700 MB = 4.59 GB (binary, as shown by your OS).',
  },
  relatedCalculators: ['binary-calculator', 'base64-encoder'],
  about: `Data storage units follow a confusing two-track standard: operating systems and programming tools use binary prefixes where 1 KB = 1,024 bytes, while hard drive manufacturers and internet service providers use decimal prefixes where 1 KB = 1,000 bytes. This discrepancy is why a "1 TB" drive only shows about 931 GB in Windows Explorer.

This converter uses the binary standard (powers of 2) that reflects how operating systems actually measure and report storage — the number that matters when you're managing files, allocating disk space, or understanding RAM specifications. The six units covered — byte, kilobyte, megabyte, gigabyte, terabyte, and petabyte — span the practical range from individual files to enterprise data centres.

Enter any value and all six units update instantly.`,
},
  {
  id: 'area-conv',
  slug: 'area-converter',
  cat: 'converters',
  name: 'Area Converter',
  icon: '🟩',
  desc: '7 units: cm², m², km², ft², acre, hectare, mile²',
  popular: false,
  hasChart: false,
  isNew: false,
  intro: `The Area Converter converts between seven area units — square centimetres, square metres, square kilometres, square feet, acres, hectares, and square miles — covering everything from room dimensions to agricultural land to geographic regions. It's used by real estate professionals, architects, farmers, and geography students.`,
  workedExample: {
    title: 'Converting a 2.5-acre plot of land to square metres and hectares',
    inputs: ['Input: 2.5 acres', 'Target units: square metres and hectares'],
    steps: [
      '1 acre = 4,046.86 m²',
      '2.5 × 4,046.86 = 10,117.14 m²',
      '1 hectare = 10,000 m²',
      '10,117.14 ÷ 10,000 = 1.011 hectares',
    ],
    result: '2.5 acres = 10,117 m² = 1.01 hectares.',
  },
  relatedCalculators: ['length-converter', 'area-calculator', 'volume-calculator'],
  about: `Area measurements mix metric and imperial units in ways that cause frequent confusion — particularly in real estate and agriculture, where acres are still dominant in the US and UK while most of the world uses hectares and square metres. Even within metric, the jump from m² to km² spans six orders of magnitude, making unit selection consequential.

This converter covers the seven area units most commonly encountered: cm², m², km², ft², acre, hectare, and mile². One acre equals 4,047 m² (or 43,560 ft²); one hectare equals exactly 10,000 m². These definitions are precise and the converter uses them without rounding.

Enter an area in any supported unit and all six others update simultaneously — useful for quickly sanity-checking a land area or translating a property listing into familiar units.`,
},
];
