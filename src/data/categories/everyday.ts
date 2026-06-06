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
  ],
  intro: `The Age Calculator tells you your exact age in years, months, days, and even seconds — not just a rough number. It's used by everyone from parents tracking a newborn's milestones to adults checking eligibility for age-restricted applications. Enter your date of birth and get a precise breakdown alongside your zodiac sign and next birthday countdown.`,
  workedExample: {
    title: 'Calculating the exact age of someone born on March 15, 1990',
    inputs: ['Date of Birth: March 15, 1990', 'End Date: June 6, 2026'],
    steps: [
      'Years: From 1990 to 2026 = 36 years (birthday in March already passed in 2026)',
      'Months: From March 15 to June 6 = 2 months and 22 days',
      'Total days: 36 years × 365.25 + extra days = 13,203 days',
      'Total weeks: 13,203 ÷ 7 = 1,886 weeks',
    ],
    result: 'Age is 36 years, 2 months, and 22 days — or 13,203 total days lived.',
  },
  relatedCalculators: ['date-difference-calculator', 'countdown-calculator', 'pregnancy-calculator', 'due-date-calculator', 'period-calculator'],
  about: `Your age isn't just a number on a birthday card — it has legal, medical, and personal significance. This calculator gives you a precise breakdown in years, months, days, hours, and seconds, accounting for leap years and varying month lengths that simple subtraction gets wrong.

Beyond the basics, it shows you your zodiac sign, your upcoming birthday countdown, and how many days, weeks, or hours you've been alive. These figures come up more often than you'd expect — from pension eligibility and school enrollment deadlines to personal milestones.

The calculator works entirely in your browser, processes dates in real time, and handles any birthday from the distant past to the present day without any sign-up required.`,
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
  isNew: false,
  intro: `The Date Difference Calculator finds the exact number of days, weeks, months, and years between any two dates — with an optional business-days mode that skips weekends. It's a practical tool for project planners, HR professionals calculating notice periods, and anyone managing a deadline that runs on calendar or working days.`,
  workedExample: {
    title: 'How many business days between a contract signed May 1, 2026 and a deadline of June 30, 2026?',
    inputs: ['Start date: May 1, 2026 (Friday)', 'End date: June 30, 2026 (Tuesday)', 'Mode: Business days only'],
    steps: [
      'Total calendar days: May has 31 days, June has 30 days → 60 days total',
      'Weekends in May 1–31: 8 full weekend days (Sat/Sun × 4 weekends + partial)',
      'Weekends in June 1–30: 8 full weekend days',
      'Total weekend days to remove: 16',
      'Business days = 60 − 16 = 44 business days',
    ],
    result: '44 business days remain between May 1 and June 30, 2026.',
  },
  relatedCalculators: ['age-calculator', 'countdown-calculator', 'work-hours-calculator', 'time-zone-converter'],
  about: `Counting days between two dates sounds straightforward but quickly gets complicated when you factor in months of different lengths, leap years, and the difference between calendar days and working days. This calculator handles all of that automatically.

Switch to business-days mode and it strips out weekends, giving you the number of actual working days — useful for calculating payment terms, shipping lead times, legal notice periods, and project durations. The result is also broken down into years, months, weeks, and days so you can express the interval in whichever unit makes most sense.

All calculations run locally in your browser with no data sent to any server.`,
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
  isNew: false,
  intro: `The Countdown Calculator shows you a live, ticking countdown to any future event — down to the second. Whether you're tracking days until an exam, a product launch, a wedding, or a vacation, it gives you a real-time display that updates automatically without any page refresh.`,
  workedExample: {
    title: 'Countdown to New Year\'s Day 2027',
    inputs: ['Target date: January 1, 2027, 00:00:00', 'Current date/time: June 6, 2026, 09:41'],
    steps: [
      'Remaining months: June → December = 6 months plus the remaining June days',
      'Days remaining from June 6 to Jan 1: 209 days',
      'Hours: 209 × 24 = 5,016 hours minus elapsed hours today',
      'Live seconds: countdown ticks every second from this value',
    ],
    result: 'Approximately 209 days, 14 hours, 19 minutes, and counting — displayed live.',
  },
  relatedCalculators: ['age-calculator', 'date-difference-calculator', 'study-timer'],
  about: `A countdown timer turns an abstract future date into something you can feel — a live, ticking clock that makes deadlines and events concrete. This tool is built for anyone who wants to stay motivated or simply know how much time remains before something important.

Enter any target date and time and the display updates every second, showing days, hours, minutes, and seconds remaining. It works for personal events like birthdays and anniversaries, professional milestones like product releases and contract deadlines, and even fun uses like counting down to a concert or sports event.

The countdown runs entirely in your browser and continues updating as long as the page is open — no apps or sign-ups needed.`,
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
  isNew: false,
  intro: `The Work Hours Calculator totals your daily, weekly, and monthly working hours after deducting break times, and optionally calculates your earnings based on an hourly rate. It's designed for freelancers tracking billable hours, employees verifying payroll accuracy, and employers doing quick payroll estimates.`,
  workedExample: {
    title: 'Weekly hours and pay for a part-time employee',
    inputs: ['Mon–Fri: 9:00 AM – 5:30 PM each day', 'Lunch break: 45 minutes per day', 'Hourly rate: $18.50'],
    steps: [
      'Raw hours per day: 5:30 PM − 9:00 AM = 8 hours 30 minutes = 8.5 hours',
      'Break deduction per day: 45 min = 0.75 hours',
      'Net hours per day: 8.5 − 0.75 = 7.75 hours',
      'Weekly hours: 7.75 × 5 days = 38.75 hours',
      'Weekly earnings: 38.75 × $18.50 = $717.88',
    ],
    result: '38.75 net hours worked this week, earning $717.88 gross.',
  },
  relatedCalculators: ['time-card-calculator', 'overtime-calculator', 'salary-to-hourly-calculator', 'fuel-cost-calculator'],
  about: `Tracking work hours accurately matters whether you're an employee checking that your payslip adds up, a freelancer billing a client, or a manager running a team payroll. Manual addition of clock-in and clock-out times across five days is surprisingly error-prone — especially when breaks vary day to day.

This calculator lets you enter start and end times for each day of the week, specify break durations, and instantly see your total net hours for the day, week, and extrapolated month. Add an hourly rate and it converts hours directly into gross earnings.

The tool handles overnight shifts, flexible break times, and partial weeks without any special configuration.`,
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
  isNew: false,
  intro: `The Fuel Cost Calculator estimates how much you'll spend on petrol or diesel for any trip, factoring in your vehicle's fuel efficiency and the current price at the pump. It supports round-trip calculations, cost splitting between passengers, and a monthly commute cost estimate — making it useful before road trips and for ongoing budgeting.`,
  workedExample: {
    title: 'Cost of a 350 km round trip shared between 3 people',
    inputs: ['One-way distance: 175 km', 'Round trip: Yes (total 350 km)', 'Fuel efficiency: 14 km/L', 'Fuel price: ₹106/L', 'Passengers: 3'],
    steps: [
      'Total distance: 175 × 2 = 350 km',
      'Fuel consumed: 350 ÷ 14 = 25 litres',
      'Total fuel cost: 25 × ₹106 = ₹2,650',
      'Cost per person: ₹2,650 ÷ 3 = ₹883.33',
    ],
    result: 'Total trip cost is ₹2,650. Each of the 3 passengers pays ₹883.',
  },
  relatedCalculators: ['ev-charging-calculator', 'work-hours-calculator', 'salary-to-hourly-calculator', 'distance-calculator'],
  about: `Fuel expenses are one of the largest recurring costs for car owners, yet most people estimate them by feel rather than calculation. This tool gives you an accurate cost figure before you leave, so you can budget properly, decide whether to carpool, or compare the economics of driving versus other transport options.

Enter your trip distance, your car's fuel efficiency (in km/L or mpg), and the current fuel price. The calculator shows total litres consumed, total cost, and — if you're travelling with others — the cost per passenger. Switch on round-trip mode and it doubles the distance automatically.

For regular commuters, the monthly estimate feature shows the cumulative cost of driving to work every day, which can be a useful figure when comparing a salary offer to your actual take-home pay.`,
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
  isNew: true,
  intro: `The EV Charging Calculator tells you exactly how long it will take to charge your electric vehicle and what it will cost, based on your battery size, current charge level, charger type, and local electricity rate. It's built for EV owners planning overnight home charges, road-trip fast-charge stops, and cost comparisons between charger speeds.`,
  workedExample: {
    title: 'Home charging a Tesla Model 3 (75 kWh) from 20% to 90%',
    inputs: ['Battery capacity: 75 kWh', 'Starting charge: 20%', 'Target charge: 90%', 'Charger power: 7.2 kW (Level 2 home)', 'Electricity rate: $0.14/kWh'],
    steps: [
      'Energy needed: (90% − 20%) × 75 kWh = 70% × 75 = 52.5 kWh',
      'Charging time: 52.5 ÷ 7.2 = 7.29 hours ≈ 7 hours 17 minutes',
      'Charging cost: 52.5 × $0.14 = $7.35',
      'Added range (assuming 4 mi/kWh): 52.5 × 4 = 210 miles of range added',
    ],
    result: 'Charging from 20% to 90% takes approximately 7 hours 17 minutes and costs $7.35.',
  },
  relatedCalculators: ['fuel-cost-calculator', 'distance-calculator'],
  about: `Electric vehicle ownership comes with a new set of calculations that petrol car owners never had to think about: charging time, electricity cost per mile, and how charger speed affects your schedule. This calculator makes those figures instant and concrete.

Enter your battery capacity, current charge percentage, target charge level, and the power output of your charger (Level 1 is a standard household outlet at ~1.4 kW; Level 2 home chargers run at 7–11 kW; DC fast chargers reach 50–350 kW). The result shows charge time, kWh consumed, cost at your local electricity rate, and estimated range added.

The calculator works for any EV — car, motorcycle, or van — as long as you know the battery capacity in kWh.`,
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
  isNew: false,
  intro: `The Random Number Generator produces cryptographically secure random integers or decimals within any range you specify — up to 50 numbers at a time. It's used for lottery picks, raffle draws, classroom activities, statistical sampling, and anywhere you need unbiased, unpredictable numbers without a dice or spreadsheet.`,
  workedExample: {
    title: 'Picking 6 unique lottery numbers between 1 and 49',
    inputs: ['Minimum: 1', 'Maximum: 49', 'Count: 6', 'Allow duplicates: No', 'Type: Integer'],
    steps: [
      'Generator requests 6 unique values from the crypto-random pool',
      'Each number is drawn from the range [1, 49] with equal probability',
      'Duplicates are rejected and redrawn until 6 unique values are collected',
      'Numbers are sorted ascending for easy reading',
    ],
    result: 'Example output: 4, 11, 23, 31, 38, 47 — six unique random integers from 1–49.',
  },
  relatedCalculators: ['password-generator', 'probability-calculator', 'random-number-generator-adv'],
  about: `True randomness is harder to achieve than it sounds. This generator uses the browser's built-in cryptographic random number API (crypto.getRandomValues) rather than simple pseudo-random algorithms, making results unpredictable and unbiased — suitable for security-sensitive applications like key generation and not just games.

You can generate integers or decimals, set any min/max range, choose how many numbers you want (up to 50), and toggle whether duplicates are allowed. Results appear instantly and can be copied with one click.

Common uses include raffle draws, random sampling for research, randomising a class list for presentations, picking teams, and generating test data for software development.`,
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
  isNew: false,
  intro: `The Password Generator creates strong, random passwords built from your choice of uppercase letters, lowercase letters, numbers, and symbols — and shows you the entropy in bits, strength rating, and estimated crack time for each result. It's built for anyone who wants passwords they can trust without a security degree.`,
  workedExample: {
    title: 'Generating a 16-character password with all character types',
    inputs: ['Length: 16 characters', 'Uppercase: Yes (26 chars)', 'Lowercase: Yes (26 chars)', 'Numbers: Yes (10 chars)', 'Symbols: Yes (32 chars)'],
    steps: [
      'Total character pool: 26 + 26 + 10 + 32 = 94 characters',
      'Entropy = Length × log₂(Pool size) = 16 × log₂(94) = 16 × 6.55 = 104.8 bits',
      'At 10¹² guesses/second (modern GPU attack), cracking time ≈ 2⁹² seconds ≈ trillions of years',
      'Strength rating: Very Strong',
    ],
    result: 'A 16-character all-type password has ~105 bits of entropy and is effectively uncrackable.',
  },
  relatedCalculators: ['random-number-generator', 'base64-encoder', 'word-counter'],
  about: `Weak passwords are the most common entry point for account breaches — dictionary attacks and credential stuffing tools can tear through millions of guesses per second. The safest passwords are long, random, and unique to each account.

This generator uses cryptographic randomness (not a predictable algorithm) to build passwords from whichever character sets you enable. The entropy readout shows the mathematical strength of your password: anything above 80 bits is considered strong; above 128 bits is effectively uncrackable with current technology. The estimated crack time gives you an intuitive sense of what that means in practice.

Generated passwords are never transmitted or stored — everything happens in your browser. Pair this with a password manager to store and use strong unique passwords across all your accounts.`,
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
  isNew: false,
  intro: `The Roman Numeral Converter translates any integer from 1 to 3,999 into its Roman numeral form and back again — instantly, in either direction. It's used by students decoding clock faces and movie copyright dates, writers formatting chapter numbers, and history enthusiasts deciphering inscriptions.`,
  workedExample: {
    title: 'Converting the year 1994 to Roman numerals',
    inputs: ['Number: 1994', 'Direction: Integer → Roman'],
    steps: [
      '1000 = M',
      '900 = CM (one hundred before one thousand = subtract)',
      '90 = XC (ten before one hundred = subtract)',
      '4 = IV (one before five = subtract)',
      'Combine: M + CM + XC + IV',
    ],
    result: '1994 = MCMXCIV',
  },
  relatedCalculators: ['binary-calculator', 'base64-encoder', 'length-converter'],
  about: `Roman numerals follow a subtractive notation system — when a smaller value appears before a larger one (like IV or XL), it's subtracted rather than added. That logic makes manual conversion error-prone, especially for numbers in the 800–900 and 1800–1900 ranges where multiple subtractive pairs appear in sequence.

This converter handles the complete valid range of standard Roman numerals (1 through 3,999) in both directions. Type an integer and get the Roman numeral; type Roman numerals and get the integer. It validates input and flags numbers outside the standard range.

Roman numerals still appear regularly in everyday life: film and TV copyright notices, clock faces, book chapter headings, Super Bowl numbering, and architectural inscriptions.`,
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
  isNew: false,
  intro: `The Word Counter analyses any text and instantly shows word count, character count (with and without spaces), sentence count, paragraph count, estimated reading time, and speaking time. It's used by writers hitting submission word limits, students checking essay requirements, and speakers timing a presentation.`,
  workedExample: {
    title: 'Checking if a 500-word essay meets a college application limit',
    inputs: ['Text: A 500-word personal statement', 'Average reading speed: 200 WPM', 'Average speaking speed: 130 WPM'],
    steps: [
      'Word count: 500 words — within the 650-word Common App limit',
      'Character count (with spaces): approximately 2,850 characters',
      'Sentence count: approximately 32 sentences',
      'Reading time: 500 ÷ 200 = 2.5 minutes',
      'Speaking time: 500 ÷ 130 = 3.85 minutes ≈ 3 min 51 sec',
    ],
    result: '500 words, 2 min 30 sec read time, 3 min 51 sec speaking time.',
  },
  relatedCalculators: ['reading-time-calculator', 'reading-level-calculator', 'password-generator'],
  about: `Whether you're writing to a strict word limit or trying to estimate how long a speech will run, manual counting is slow and error-prone. Paste your text into this tool and all the key metrics appear in under a second.

The counter distinguishes between words (space-separated tokens), characters with spaces, and characters without spaces — because different platforms impose different types of limits. Reading time is calculated at 200 words per minute (the adult average); speaking time uses 130 WPM, which is typical for clear, measured speech.

Sentence and paragraph counts are also included, which are useful for checking text structure and density alongside raw length.`,
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
  isNew: true,
  intro: `The Base64 Encoder/Decoder converts text or binary data to and from Base64 format — the encoding scheme used to embed images in HTML, pass data through URLs safely, and store binary content in text-only systems. It supports both encoding and decoding with a single click, making it a practical tool for web developers and system administrators.`,
  workedExample: {
    title: 'Encoding an API key for an HTTP Authorization header',
    inputs: ['Input text: myUsername:secretPassword123', 'Direction: Encode to Base64'],
    steps: [
      'Convert each character to its ASCII byte value',
      'Group bytes into 3-byte (24-bit) chunks',
      'Split each chunk into four 6-bit groups',
      'Map each 6-bit value to its Base64 character (A–Z, a–z, 0–9, +, /)',
      'Add = padding if input length is not divisible by 3',
    ],
    result: '"myUsername:secretPassword123" encodes to "bXlVc2VybmFtZTpzZWNyZXRQYXNzd29yZDEyMw=="',
  },
  relatedCalculators: ['binary-calculator', 'roman-numeral-converter', 'password-generator'],
  about: `Base64 encoding is everywhere in web development and system administration, even though most users never see it directly. It converts binary data into a safe ASCII text format that can be transmitted through systems designed to handle text — email servers, JSON APIs, CSS data URIs, and HTTP headers.

This tool handles both directions: paste plain text or binary data to encode it, or paste a Base64 string to decode it back. The output appears immediately and a copy button puts it on your clipboard. The reverse button swaps input and output so you can quickly validate a round-trip.

Base64 is not encryption — the encoding is fully reversible by anyone. Do not use it to hide sensitive information; use it only to safely transport data between text-based systems.`,
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
  isNew: true,
  intro: `The Time Zone Converter translates a specific date and time from one time zone to any of 50+ time zones worldwide, automatically accounting for Daylight Saving Time where it applies. It's essential for scheduling international calls, planning travel arrivals, or coordinating remote teams spread across multiple continents.`,
  workedExample: {
    title: 'Scheduling a 3:00 PM meeting in New York for participants in London and Mumbai',
    inputs: ['Source time: 3:00 PM EDT (New York, UTC−4)', 'Target zones: London (BST, UTC+1), Mumbai (IST, UTC+5:30)'],
    steps: [
      'New York EDT = UTC−4, so 3:00 PM EDT = 19:00 UTC',
      'London BST = UTC+1: 19:00 + 1 = 20:00 (8:00 PM BST)',
      'Mumbai IST = UTC+5:30: 19:00 + 5:30 = 00:30 next day (12:30 AM IST)',
    ],
    result: '3:00 PM New York = 8:00 PM London = 12:30 AM Mumbai (next day).',
  },
  relatedCalculators: ['date-difference-calculator', 'work-hours-calculator', 'countdown-calculator'],
  about: `Time zones are more complex than a simple offset from UTC. Daylight Saving Time shifts clocks forward or backward on different dates in different countries, and some regions have half-hour or even quarter-hour offsets from the standard UTC grid. Mental arithmetic across these boundaries is a reliable way to schedule a meeting at the wrong time.

This converter takes the guesswork out: select a source time zone, enter a date and time, and choose any number of target zones. The output immediately shows the corresponding local time in each zone, with DST status flagged where relevant.

The tool covers all major time zones across North America, Europe, Asia, Africa, and the Pacific — useful for everything from booking international flights to synchronising a software deployment across distributed teams.`,
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
  isNew: true,
  intro: `The Reading Time Calculator estimates how long it takes to read any piece of text based on word count and a chosen reading speed, from slow and careful to fast skimming. Authors, editors, and content marketers use it to set reader expectations, while students use it to plan study sessions around textbook chapters.`,
  workedExample: {
    title: 'Estimating reading time for a 3,500-word long-form article',
    inputs: ['Word count: 3,500 words', 'Reading speed: 238 WPM (average adult)'],
    steps: [
      'Reading time = Word count ÷ Reading speed',
      '3,500 ÷ 238 = 14.7 minutes',
      'Round to: approximately 15 minutes',
      'For a technical reader at 180 WPM: 3,500 ÷ 180 = 19.4 minutes',
    ],
    result: 'A 3,500-word article takes approximately 15 minutes at average reading speed.',
  },
  relatedCalculators: ['word-counter', 'reading-level-calculator', 'study-timer'],
  about: `The average adult reads around 200–250 words per minute for general content, but reading speed varies significantly by text complexity, familiarity with the topic, and individual ability. A dense academic paper takes much longer than a news article of the same word count.

This calculator lets you input a word count or paste text directly, and choose a reading speed that matches your context — slow and careful for technical material, standard for everyday reading, or fast for skimming. The result shows reading time in minutes and seconds.

Publishers use estimated reading time to set expectations in article headers. Presentation coaches use speaking time (typically 130 WPM) to ensure scripts fit within a time slot. Students use it to block out time for assigned readings before an exam.`,
},
];
