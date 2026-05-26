import type { CalculatorConfig } from '../calculatorConfigs';

export const everydayCalculators: CalculatorConfig[] = [
  {
  id: 'age',
  slug: 'age-calculator',
  cat: 'everyday',
  name: 'Age Calculator',
  icon: '🎂',
  desc: 'Exact age with zodiac, next birthday countdown, live seconds & time-of-birth precision mode',
  popular: true,
  hasChart: false,
  isNew: false,
  whenToUse: 'Use this calculator when you need to know exactly how old you are down to the day, hour, or second, or when verifying age eligibility for applications.',
  resultMeaning: 'The results show your chronological age separated into years, months, and days. It also provides alternative formats (e.g., total days alive, total weeks alive) for fun tracking.',
  limitations: [
    'Leap years and different month lengths mean that "months" and "days" are approximated based on the calendar cycle.'
  ],
  examples: [
    { scenario: 'Finding out how old someone is who was born on Jan 1, 2000.', result: 'The calculator instantly gives their exact age today, plus fun facts like their half-birthday and zodiac sign.' }
  ],
  howToUse: [
    'Select your Date of Birth from the calendar.',
    '(Optional) Select your exact Time of Birth for second-by-second precision.',
    'The "End Date" defaults to today, but you can change it to calculate age at a specific point in time.',
    'Click Calculate to see your full age breakdown and next birthday countdown.'
  ]
},
  {
  id: 'date-diff',
  slug: 'date-difference-calculator',
  cat: 'everyday',
  name: 'Date Difference',
  icon: '📆',
  desc: 'Days between dates with business-days-only mode',
  popular: true,
  hasChart: false,
  isNew: false
},
  {
  id: 'countdown',
  slug: 'countdown-calculator',
  cat: 'everyday',
  name: 'Countdown Timer',
  icon: '⏳',
  desc: 'Live countdown to any event with real-time seconds',
  popular: false,
  hasChart: false,
  isNew: false
},
  {
  id: 'work-hours',
  slug: 'work-hours-calculator',
  cat: 'everyday',
  name: 'Work Hours',
  icon: '⏰',
  desc: 'Daily/weekly/monthly hours with break deduction & earnings',
  popular: false,
  hasChart: false,
  isNew: false
},
  {
  id: 'fuel',
  slug: 'fuel-cost-calculator',
  cat: 'everyday',
  name: 'Fuel Cost Calculator',
  icon: '⛽',
  desc: 'Trip cost with passenger split, round trip & monthly estimate',
  popular: false,
  hasChart: false,
  isNew: false
},
  {
  id: 'ev-charging',
  slug: 'ev-charging-calculator',
  cat: 'everyday',
  name: 'EV Charging Calculator',
  icon: '⚡',
  desc: 'Calculate EV battery charge time, added range, and cost with various charger levels',
  popular: false,
  hasChart: false,
  isNew: true
},
  {
  id: 'random',
  slug: 'random-number-generator',
  cat: 'everyday',
  name: 'Random Number Generator',
  icon: '🎲',
  desc: 'Integer or decimal random numbers — up to 50 at once',
  popular: false,
  hasChart: false,
  isNew: false
},
  {
  id: 'password',
  slug: 'password-generator',
  cat: 'everyday',
  name: 'Password Generator',
  icon: '🔐',
  desc: 'Secure passwords with entropy bits, strength rating & crack time',
  popular: true,
  hasChart: false,
  isNew: false
},
  {
  id: 'roman',
  slug: 'roman-numeral-converter',
  cat: 'everyday',
  name: 'Roman Numeral Converter',
  icon: '🏛️',
  desc: 'Bidirectional: numbers to Roman and back (1–3999)',
  popular: false,
  hasChart: false,
  isNew: false
},
  {
  id: 'word-count',
  slug: 'word-counter',
  cat: 'everyday',
  name: 'Word Counter',
  icon: '📝',
  desc: 'Words, chars, sentences, paragraphs, read time & speak time',
  popular: false,
  hasChart: false,
  isNew: false
},
  {
  id: 'base64',
  slug: 'base64-encoder',
  cat: 'everyday',
  name: 'Base64 Encoder/Decoder',
  icon: '🔠',
  desc: 'Encode & decode Base64 with copy and reverse button',
  popular: false,
  hasChart: false,
  isNew: true
},
  {
  id: 'timezone',
  slug: 'time-zone-converter',
  cat: 'everyday',
  name: 'Time Zone Converter',
  icon: '🌍',
  desc: 'Convert time between 50+ world time zones with DST support',
  popular: false,
  hasChart: false,
  isNew: true
},
  {
  id: 'reading-time',
  slug: 'reading-time-calculator',
  cat: 'everyday',
  name: 'Reading Time Calculator',
  icon: '📖',
  desc: 'Estimate reading time for any text, book, or article by word count',
  popular: false,
  hasChart: false,
  isNew: true
},
];
