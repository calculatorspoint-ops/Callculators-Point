import type { CalculatorConfig } from '../calculatorConfigs';

export const educationCalculators: CalculatorConfig[] = [
  {
  id: 'gpa',
  slug: 'gpa-calculator',
  cat: 'education',
  name: 'GPA Calculator',
  icon: '📚',
  desc: "Weighted GPA with Dean's List detection, semester tracking & what-if simulator",
  popular: true,
  hasChart: false,
  isNew: false,
  formula: 'GPA = Σ(Grade Points × Credit Hours) / Σ Credit Hours',
  tips: [
    'Raising a single 3-credit course from C (2.0) to A (4.0) improves your semester GPA by roughly 0.5 points.',
    "Dean's List typically requires a 3.5+ GPA — focus on your highest-credit courses first for maximum impact.",
    'Graduate programs often require a minimum 3.0 GPA; many top programs look for 3.5+.'
  ],
      about: `The GPA Calculator is an essential resource for anyone needing to weighted GPA with Deans List detection, semester tracking & what-if simulator. Designed with simplicity and speed in mind, it performs the heavy lifting behind the scenes so you can focus on making informed decisions. It's completely free, requires no signups, and works seamlessly on any device.`
},
  {
  id: 'marks-percentage',
  slug: 'marks-percentage-calculator',
  cat: 'education',
  name: 'Marks Percentage Calculator',
  icon: '💯',
  desc: 'Multi-subject percentage with grade estimation, visual charts & reverse mode',
  popular: true,
  hasChart: false,
  isNew: false,
  formula: 'Percentage = (Total Marks Obtained / Total Maximum Marks) × 100',
  tips: [
    '90%+ is generally considered Distinction, 75-89% Merit, 60-74% Credit, 40-59% Pass.',
    'Use Reverse Mode to find how many marks you need to achieve a specific percentage target.',
    'Per-subject analysis helps identify which subjects need the most improvement.'
  ],
      about: `If you want to multi-subject percentage with grade estimation, visual charts & reverse mode, the Marks Percentage Calculator is your perfect companion. Our advanced online tool replaces tedious manual spreadsheets by delivering instant outputs based on industry-standard formulas. You can use it repeatedly to test different scenarios and optimize your outcomes.`
},
  {
  id: 'attendance',
  slug: 'attendance-calculator',
  cat: 'education',
  name: 'Attendance Calculator',
  icon: '📅',
  desc: 'Bunk planner, safe leave estimator & attendance warning system with subject tracker',
  popular: true,
  hasChart: false,
  isNew: false,
  formula: 'Attendance % = (Classes Attended / Total Classes Held) × 100\n' +
    'Safe Bunks = floor(Attended × 100/MinRequired - TotalHeld)',
  tips: [
    'Most universities require 75% minimum attendance to sit for exams.',
    'Safe Bunks = how many classes you can skip without falling below minimum.',
    'Switch to Bunk Planner mode to see subject-wise safe bunk counts.'
  ],
      about: `The Attendance Calculator offers a hassle-free way to bunk planner, safe leave estimator & attendance warning system with subject tracker. Professionals and students alike rely on this calculator for its accuracy and ease of use. It strips away complicated jargon, letting you find the exact metric you need with just a few simple inputs.`
},
  {
  id: 'final-grade',
  slug: 'final-grade-calculator',
  cat: 'education',
  name: 'Final Grade Calculator',
  icon: '🎓',
  desc: 'Weighted final grade with scenario analysis, pass/fail prediction & multiple grading scales',
  popular: false,
  hasChart: false,
  isNew: false,
  formula: 'Final Grade = Σ(Component Score% × Weight%) / 100',
  tips: [
    'Leave the score blank for pending assignments to calculate what you need on them.',
    'Best Case / Worst Case scenarios show your realistic grade range.',
    "Switch grading scale (US/UK/German) to match your institution's system."
  ],
      about: `If you want to weighted final grade with scenario analysis, pass/fail prediction & multiple grading scales, the Final Grade Calculator is your perfect companion. Our advanced online tool replaces tedious manual spreadsheets by delivering instant outputs based on industry-standard formulas. You can use it repeatedly to test different scenarios and optimize your outcomes.`
},
  {
  id: 'cgpa-to-percent',
  slug: 'cgpa-percentage-calculator',
  cat: 'education',
  name: 'CGPA to Percentage',
  icon: '📊',
  desc: 'CGPA conversion with 5 university formulas incl. HEC Pakistan, VTU & Anna University',
  popular: false,
  hasChart: false,
  isNew: false,
  formula: 'Standard: Percentage = CGPA × 9.5\n' +
    'HEC Pakistan: Percentage = CGPA × 10\n' +
    'VTU: Percentage = (CGPA × 10) - 5',
  tips: [
    'Different universities use different CGPA-to-percentage formulas — always verify with your institution.',
    'HEC Pakistan uses CGPA × 10 as the standard formula.',
    'VTU Bangalore uses (SGPA - 0.5) × 10 for their unique formula.'
  ],
      about: `The CGPA to Percentage offers a hassle-free way to cGPA conversion with 5 university formulas incl. HEC Pakistan, VTU & Anna University. Professionals and students alike rely on this calculator for its accuracy and ease of use. It strips away complicated jargon, letting you find the exact metric you need with just a few simple inputs.`
},
  {
  id: 'ielts',
  slug: 'ielts-band-calculator',
  cat: 'education',
  name: 'IELTS Band Calculator',
  icon: '🌍',
  desc: 'Official IELTS band scoring with L/R/W/S section analysis & university eligibility check',
  popular: true,
  hasChart: false,
  isNew: false,
  formula: 'Overall Band = Average of Listening + Reading + Writing + Speaking\n' +
    'Rounded to nearest 0.5 (≥.25 rounds up)',
  tips: [
    'IELTS overall band is rounded to the nearest 0.5 or whole number using official rounding rules.',
    'Band 7.0 is the standard requirement for most UK and Australian universities.',
    'Listening and Reading are marked from raw scores out of 40 — use raw score mode for accuracy.'
  ],
      about: `Stop guessing and start using the IELTS Band Calculator to get immediate, accurate data. Specifically engineered to official IELTS band scoring with L/R/W/S section analysis & university eligibility check, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
},
  {
  id: 'sat',
  slug: 'sat-score-calculator',
  cat: 'education',
  name: 'SAT Score Calculator',
  icon: '🎯',
  desc: 'Digital SAT section scoring with percentile rank & university admission comparison',
  popular: true,
  hasChart: false,
  isNew: false,
  formula: 'Total SAT Score = Math (200–800) + Reading & Writing (200–800)\n' +
    'Total Range: 400–1600',
  tips: [
    'A 1400+ SAT score puts you in the top 6% of test takers globally.',
    'The Digital SAT (2024+) has two modules per section — difficulty adapts based on your Module 1 performance.',
    'Score improvements of 100+ points are common with 6–8 weeks of structured preparation.'
  ],
      about: `Stop guessing and start using the SAT Score Calculator to get immediate, accurate data. Specifically engineered to digital SAT section scoring with percentile rank & university admission comparison, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
},
  {
  id: 'study-timer',
  slug: 'study-timer',
  cat: 'education',
  name: 'Study Timer',
  icon: '⏱️',
  desc: 'Pomodoro timer with focus analytics, streak tracking & productivity insights',
  popular: false,
  hasChart: false,
  isNew: true,
  tips: [
    'The Pomodoro Technique (25-min focus + 5-min break) is backed by research to improve sustained attention.',
    'After 4 Pomodoros, take a longer 15-30 minute break to restore mental energy.',
    'Tracking study sessions builds accountability — consistent 2-hour daily sessions outperform irregular 6-hour marathons.'
  ],
  about: `The Study Timer offers a hassle-free way to pomodoro timer with focus analytics, streak tracking & productivity insights. Professionals and students alike rely on this calculator for its accuracy and ease of use. It strips away complicated jargon, letting you find the exact metric you need with just a few simple inputs.`
},
  {
  id: 'target-gpa',
  slug: 'target-gpa-calculator',
  cat: 'education',
  name: 'Target GPA Calculator',
  icon: '🏆',
  desc: 'GPA goal planner with future semester simulation & feasibility analysis',
  popular: false,
  hasChart: false,
  isNew: true,
  formula: 'Required Future GPA = (Target × TotalCredits - CurrentGPA × CurrentCredits) / FutureCredits',
  tips: [
    "The more credits you've already earned, the harder it is to significantly change your GPA.",
    'Plan multiple semesters to see a realistic GPA trajectory toward your graduation goal.',
    'If required GPA exceeds 4.0, you need to either take more credits or lower your target.'
  ],
  about: `The Target GPA Calculator offers a hassle-free way to gPA goal planner with future semester simulation & feasibility analysis. Professionals and students alike rely on this calculator for its accuracy and ease of use. It strips away complicated jargon, letting you find the exact metric you need with just a few simple inputs.`
},
  {
  id: 'required-grade',
  slug: 'required-grade-calculator',
  cat: 'education',
  name: 'Required Grade Calculator',
  icon: '📝',
  desc: 'Score needed on pending work with weighted assignments & what-if grade scenarios',
  popular: false,
  hasChart: false,
  isNew: true,
  formula: 'Required Score = (Target% × TotalWeight - CompletedPoints) / PendingWeight × 100',
  tips: [
    'Leave any assignment score blank to calculate what you need on it.',
    'Weights must sum to 100% for accurate results.',
    'Best Case shows your maximum possible grade; Worst Case shows your guaranteed minimum.'
  ],
  about: `Stop guessing and start using the Required Grade Calculator to get immediate, accurate data. Specifically engineered to score needed on pending work with weighted assignments & what-if grade scenarios, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
},

  // ── HIGH PRIORITY ──────────────────────────────────────────────────────────
  {
    id: 'weighted-grade',
    slug: 'weighted-grade-calculator',
    cat: 'education',
    name: 'Weighted Grade Calculator',
    icon: '⚖️',
    desc: 'Calculate final grade from assignments, quizzes, midterms & finals with custom weights',
    popular: true,
    hasChart: false,
    isNew: true,
    formula: 'Weighted Grade = Σ(Score% × Weight%) / Σ Weights\nRequired Score = (Target − Σ Completed Weighted Points) / Remaining Weight',
    tips: [
      'Leave a score blank on any pending item to see exactly what you need to earn on it.',
      'Your final exam usually carries the most weight — prioritize it when planning study time.',
      'If weights don\'t sum to 100%, the calculator projects your grade from completed items only.'
    ],
    about: `The Weighted Grade Calculator lets you enter every assignment, quiz, midterm, and final with its own custom weight and instantly see your overall course grade. Unlike a simple average, it respects how much each component actually counts. Use the what-if feature to discover the exact score you need on upcoming work to hit your target grade.`,
    tags: ['grades', 'gpa', 'assignments', 'weighted average', 'course grade'],
    keywords: ['weighted grade calculator', 'final grade calculator', 'course grade calculator', 'assignment grade calculator'],
  },
  {
    id: 'gre-score',
    slug: 'gre-score-calculator',
    cat: 'education',
    name: 'GRE Score Calculator',
    icon: '🧠',
    desc: 'Verbal + Quantitative raw-to-scaled score conversion with percentile rank & grad school comparison',
    popular: true,
    hasChart: false,
    isNew: true,
    formula: 'Total GRE = Verbal (130–170) + Quantitative (130–170)\nAWA: 0–6 in 0.5 increments',
    tips: [
      'A Verbal score of 160+ places you in the top 14% of all test-takers globally.',
      'Many top PhD programs expect Quant 165+ and Verbal 158+ — check your target program\'s median scores.',
      'AWA scores of 4.5+ are considered strong; few programs weigh AWA heavily above 4.0.'
    ],
    about: `The GRE Score Calculator converts raw section scores to the official 130–170 scaled score for Verbal and Quantitative Reasoning, computes your combined total, and maps each section to its percentile rank. It then compares your profile against graduate program tiers from elite PhD programs to general master's admissions — essential for anyone preparing for graduate school applications.`,
    tags: ['GRE', 'graduate school', 'test scores', 'percentile', 'verbal', 'quantitative'],
    keywords: ['GRE score calculator', 'GRE percentile', 'GRE verbal score', 'GRE quant score', 'graduate school admission'],
  },
  {
    id: 'toefl-score',
    slug: 'toefl-score-calculator',
    cat: 'education',
    name: 'TOEFL Score Calculator',
    icon: '🌐',
    desc: 'TOEFL iBT section scores to total band with university eligibility & IELTS equivalent',
    popular: true,
    hasChart: false,
    isNew: true,
    formula: 'Total iBT = Reading + Listening + Speaking + Writing (each 0–30)\nTotal Range: 0–120',
    tips: [
      'Most top US universities require TOEFL 100+ for graduate admission.',
      'A score of 26+ in each section is considered strong by selective universities.',
      'TOEFL 100 is roughly equivalent to IELTS 7.0 — both accepted by most universities worldwide.'
    ],
    about: `The TOEFL Score Calculator totals your Reading, Listening, Speaking, and Writing section scores into a iBT composite (0–120), checks eligibility against university tiers from MIT to community colleges, and shows the approximate IELTS equivalent. Pairs perfectly with our IELTS Band Calculator to compare your options across all major English proficiency tests.`,
    tags: ['TOEFL', 'iBT', 'English test', 'university admission', 'IELTS equivalent'],
    keywords: ['TOEFL score calculator', 'TOEFL iBT score', 'TOEFL total score', 'TOEFL IELTS comparison', 'English proficiency test'],
  },
  {
    id: 'scholarship-gpa',
    slug: 'scholarship-gpa-planner',
    cat: 'education',
    name: 'Scholarship GPA Planner',
    icon: '🏅',
    desc: 'Enter scholarship GPA requirement + current GPA to get a semester-by-semester roadmap',
    popular: true,
    hasChart: false,
    isNew: true,
    formula: 'Required Future GPA = (Target × TotalCredits − CurrentGPA × CompletedCredits) / RemainingCredits',
    tips: [
      'Acting early matters most — the more credits you\'ve already earned, the harder it is to raise your GPA.',
      'If the required GPA per semester exceeds 4.0, you need more credits or must lower your target.',
      'Focus on high-credit courses first — a 4-credit A impacts your GPA more than a 1-credit A.'
    ],
    about: `The Scholarship GPA Planner takes your current GPA, completed credits, GPA requirement for a target scholarship, and remaining semesters to calculate exactly what GPA you need each semester to qualify. A feasibility analysis instantly flags whether your goal is achievable, challenging, or mathematically impossible — then lays out a semester-by-semester roadmap.`,
    tags: ['scholarship', 'GPA requirement', 'GPA goal', 'academic planning', 'merit aid'],
    keywords: ['scholarship GPA calculator', 'GPA planner', 'scholarship eligibility GPA', 'required GPA for scholarship'],
  },
  {
    id: 'assignment-grade',
    slug: 'assignment-grade-calculator',
    cat: 'education',
    name: 'Assignment Grade Calculator',
    icon: '📋',
    desc: 'Add any number of tasks with individual weights — instantly see impact on final course grade',
    popular: true,
    hasChart: false,
    isNew: true,
    formula: 'Course Grade = Σ(Score/MaxScore × Weight) across all tasks\nImpact = (Score/MaxScore × Weight) contribution to total',
    tips: [
      'Each assignment\'s "impact" column shows how many grade points it contributes to your final course grade.',
      'Use "Drop Lowest" to see how your grade changes if your worst score is excluded.',
      'Weights must sum to 100% for a final grade; otherwise the tool projects from completed items.'
    ],
    about: `The Assignment Grade Calculator lets you enter every homework, lab, project, and quiz with its individual score and weight, then instantly shows how each item impacts your final course grade. Add as many tasks as you need, use the "Drop Lowest" toggle, and see the breakdown of every contribution — perfect for tracking exactly where you stand throughout the semester.`,
    tags: ['assignments', 'homework', 'lab', 'project grade', 'course grade', 'grade impact'],
    keywords: ['assignment grade calculator', 'homework grade calculator', 'course grade calculator', 'weighted assignment grades'],
  },

  // ── MEDIUM PRIORITY ────────────────────────────────────────────────────────
  {
    id: 'cumulative-gpa',
    slug: 'cumulative-gpa-calculator',
    cat: 'education',
    name: 'Cumulative GPA Calculator',
    icon: '📈',
    desc: 'Combine multiple semesters with credit hours into an accurate cumulative GPA',
    popular: false,
    hasChart: false,
    isNew: true,
    formula: 'Cumulative GPA = Σ(Semester GPA × Credit Hours) / Σ Credit Hours',
    tips: [
      'Your cumulative GPA changes very slowly once you have many completed credits — start improving early.',
      'Add a planned future semester to see what cumulative GPA you can realistically achieve.',
      'Always track credit-hours weighted GPA — simple averages of semester GPAs are inaccurate.'
    ],
    about: `The Cumulative GPA Calculator combines multiple semester GPAs (each weighted by credit hours) into the accurate overall cumulative GPA that appears on your transcript. Unlike simple averaging, it correctly weights each semester by how many credits you took. Add semesters dynamically, preview future semesters, and see your GPA trend over your academic career.`,
    tags: ['cumulative GPA', 'semester GPA', 'transcript GPA', 'college GPA', 'credit hours'],
    keywords: ['cumulative GPA calculator', 'overall GPA calculator', 'multi-semester GPA', 'college GPA calculator'],
  },
  {
    id: 'act-score',
    slug: 'act-score-calculator',
    cat: 'education',
    name: 'ACT Score Calculator',
    icon: '📝',
    desc: 'Raw-to-composite ACT scoring with section breakdown, percentile & college readiness benchmarks',
    popular: false,
    hasChart: false,
    isNew: true,
    formula: 'Composite ACT = Average of English + Math + Reading + Science (1–36)\nWriting: 2–12 (not included in composite)',
    tips: [
      'A composite of 30+ puts you in the top 7% of ACT test-takers nationwide.',
      'ACT College Readiness Benchmarks: English 18, Math 22, Reading 22, Science 23.',
      'ACT composite 24 ≈ SAT 1160; composite 30 ≈ SAT 1390 — use our SAT calculator to compare.'
    ],
    about: `The ACT Score Calculator converts your English, Math, Reading, and Science section scores into the composite ACT score (1–36), maps it to a percentile rank, checks each section against official ACT College Readiness Benchmarks, and compares your profile against university selectivity tiers. Pairs with our SAT Score Calculator to help you decide which test to prioritize.`,
    tags: ['ACT', 'composite score', 'college readiness', 'test prep', 'percentile'],
    keywords: ['ACT score calculator', 'ACT composite score', 'ACT percentile', 'ACT college readiness', 'ACT SAT comparison'],
  },
  {
    id: 'test-score',
    slug: 'test-score-calculator',
    cat: 'education',
    name: 'Test Score Calculator',
    icon: '✅',
    desc: 'Marks obtained ÷ total marks → percentage + letter grade across US, UK, Pakistani & Indian scales',
    popular: false,
    hasChart: false,
    isNew: true,
    formula: 'Percentage = (Marks Obtained / Total Marks) × 100',
    tips: [
      'Switch to Multi-Subject mode to analyze individual subjects alongside your overall score.',
      'Pakistani/Indian grading: 80%+ is Distinction, 70%+ is A1, 60%+ is A.',
      'Use the custom pass-mark input to set your institution\'s specific minimum passing threshold.'
    ],
    about: `The Test Score Calculator converts raw marks into a percentage and letter grade using your choice of grading scale — US letter grades, UK degree classifications, Pakistani/Indian board grades, or a custom pass threshold. Multi-subject mode lets you track every paper separately and calculate your overall score. Simple, fast, and works for any exam worldwide.`,
    tags: ['test score', 'exam percentage', 'marks percentage', 'letter grade', 'grading scale'],
    keywords: ['test score calculator', 'exam percentage calculator', 'marks to percentage', 'letter grade calculator', 'exam grade calculator'],
  },
  {
    id: 'gpa-converter',
    slug: 'gpa-converter',
    cat: 'education',
    name: 'GPA Converter (International)',
    icon: '🔁',
    desc: 'Convert GPA between 4.0, 5.0, 7.0, 10.0 scales and percentage — with country presets',
    popular: false,
    hasChart: false,
    isNew: true,
    formula: 'Normalized = Input / Input Scale Maximum\nConverted = Normalized × Target Scale Maximum',
    tips: [
      'German grades run inverse (1.0 = excellent, 5.0 = fail) — use the Germany preset for correct conversion.',
      'Australian GPA 4.0 (HD) converts to US 3.7–4.0; Australian 3.0 (D) ≈ US 3.3.',
      'When applying internationally, always include both your native scale and the converted value.'
    ],
    about: `The International GPA Converter translates your GPA between the 4.0 (USA/Pakistan), 5.0, 7.0 (Australia), 10.0 (India), and percentage scales. Country presets auto-configure the input for USA, Germany (inverse grading), India, Australia, and UK. Instantly see your GPA expressed on every major scale in one conversion table — essential for international university applications and global job applications.`,
    tags: ['GPA conversion', 'international GPA', 'grade conversion', '4.0 scale', '10.0 scale', 'CGPA'],
    keywords: ['GPA converter', 'international GPA converter', 'GPA to percentage', 'GPA scale conversion', 'convert GPA'],
  },
  {
    id: 'class-rank',
    slug: 'class-rank-calculator',
    cat: 'education',
    name: 'Class Rank Calculator',
    icon: '🏅',
    desc: 'Estimate class rank from GPA and class size distribution — useful for college applications',
    popular: false,
    hasChart: false,
    isNew: true,
    formula: 'Estimated Rank = Students with Higher GPA + 1\nPercentile = (Class Size − Rank + 1) / Class Size × 100',
    tips: [
      'Most selective universities consider top 10% auto-admit for state flagship schools.',
      'Your class rank matters less at schools with test-optional policies — focus on GPA and essays.',
      'Competitive grading schools often have a tighter GPA distribution — check your school\'s profile.'
    ],
    about: `The Class Rank Calculator estimates your approximate rank and percentile within your graduating class based on your GPA and a typical GPA distribution for your school type. Choose from competitive, average, or lenient grading presets to get a realistic rank estimate. Particularly useful when schools don't officially report class rank for college applications.`,
    tags: ['class rank', 'class percentile', 'GPA rank', 'college application', 'honor roll'],
    keywords: ['class rank calculator', 'GPA class rank', 'class percentile calculator', 'college admission rank', 'rank in class'],
  },
  {
    id: 'study-schedule',
    slug: 'study-schedule-planner',
    cat: 'education',
    name: 'Study Schedule Planner',
    icon: '🗓️',
    desc: 'Input exam dates + subjects + available hours → auto-generate a daily study schedule',
    popular: false,
    hasChart: false,
    isNew: true,
    tips: [
      'Prioritize subjects with the earliest exam dates and highest difficulty first.',
      'Never study more than 4–5 hours on a single subject in one day — space repetition beats cramming.',
      'Leave 1–2 days before each exam for revision, not new material.'
    ],
    about: `The Study Schedule Planner takes your exam dates, subjects, difficulty ratings, and available study hours to auto-generate a prioritized daily and weekly study plan. Hours are allocated proportionally based on exam proximity, priority, and difficulty — so you always know exactly what to study today. Copy the schedule or use it as a study roadmap through exam season.`,
    tags: ['study schedule', 'exam planner', 'study plan', 'exam prep', 'study timetable'],
    keywords: ['study schedule planner', 'exam study plan', 'study timetable generator', 'how to plan for exams', 'study schedule calculator'],
  },

  // ── LOWER PRIORITY ─────────────────────────────────────────────────────────
  {
    id: 'gmat-score',
    slug: 'gmat-score-calculator',
    cat: 'education',
    name: 'GMAT Score Calculator',
    icon: '💼',
    desc: 'GMAT Focus Edition section scores to total composite with percentile & MBA program comparison',
    popular: false,
    hasChart: false,
    isNew: true,
    formula: 'GMAT Focus Total = Quantitative + Verbal + Data Insights (each 60–90)\nTotal Range: 205–805',
    tips: [
      'The GMAT Focus Edition (2024) replaced the legacy GMAT — it\'s shorter and uses three sections.',
      'Top M7 MBA programs (Wharton, HBS, Booth) typically see median scores of 730–740.',
      'GMAT 700+ puts you in roughly the 85th percentile and is competitive for most top-50 MBA programs.'
    ],
    about: `The GMAT Score Calculator covers the GMAT Focus Edition format — Quantitative Reasoning, Verbal Reasoning, and Data Insights (each 60–90) — and computes your total composite (205–805). Percentile ranks and business school tier comparisons from M7 to general admissions help you gauge competitiveness and plan retake strategy.`,
    tags: ['GMAT', 'MBA admission', 'business school', 'GMAT Focus', 'percentile'],
    keywords: ['GMAT score calculator', 'GMAT Focus Edition score', 'GMAT percentile', 'MBA admission score', 'GMAT composite'],
  },
  {
    id: 'pass-fail',
    slug: 'pass-fail-calculator',
    cat: 'education',
    name: 'Pass/Fail Calculator',
    icon: '🎲',
    desc: 'Given minimum passing mark + current average, calculate score needed on remaining assessments',
    popular: false,
    hasChart: false,
    isNew: true,
    formula: 'Required Score = (Pass Mark − Current Weighted Points) / Remaining Weight × 100',
    tips: [
      'If the required score exceeds 100%, your current standing makes it mathematically impossible to pass.',
      'Even a "guaranteed pass" scenario can flip if a high-weight final is still pending.',
      'This calculator is most useful mid-semester before all high-weight assessments are completed.'
    ],
    about: `The Pass/Fail Calculator tells you exactly what score you need on your remaining assessments to pass the course. Enter your minimum passing mark, current average, number of remaining assessments, and their combined weight — and instantly see your required score, feasibility status (Guaranteed Pass → Impossible), and best/worst case outcomes.`,
    tags: ['pass fail', 'passing grade', 'required score', 'exam score needed', 'academic risk'],
    keywords: ['pass fail calculator', 'score needed to pass', 'passing grade calculator', 'minimum score to pass', 'will I pass calculator'],
  },
  {
    id: 'reading-level',
    slug: 'reading-level-calculator',
    cat: 'education',
    name: 'Reading Level Calculator',
    icon: '📖',
    desc: 'Paste text → Flesch-Kincaid grade level + reading ease score for students & educators',
    popular: false,
    hasChart: false,
    isNew: true,
    formula: 'FK Grade Level = 0.39×(Words/Sentences) + 11.8×(Syllables/Words) − 15.59\nReading Ease = 206.835 − 1.015×(W/S) − 84.6×(Syl/W)',
    tips: [
      'A Flesch Reading Ease of 60–70 is ideal for most general audiences — newspapers target this range.',
      'Grade level 8–9 is the sweet spot for widely-read non-fiction and clear academic writing.',
      'Very long sentences and multi-syllable words are the primary drivers of high grade level.'
    ],
    about: `The Reading Level Calculator uses the Flesch-Kincaid formulas to analyze any pasted text and return the grade level equivalent and reading ease score. It counts words, sentences, and syllables to evaluate text complexity — invaluable for students checking essay readability, educators choosing appropriate textbooks, and writers targeting a specific audience.`,
    tags: ['reading level', 'Flesch-Kincaid', 'readability', 'text analysis', 'grade level'],
    keywords: ['reading level calculator', 'Flesch-Kincaid calculator', 'readability calculator', 'text grade level', 'reading ease score'],
  },
  {
    id: 'college-admission',
    slug: 'college-admission-estimator',
    cat: 'education',
    name: 'College Admission Estimator',
    icon: '🎓',
    desc: 'GPA + SAT/ACT + extracurriculars → rough acceptance probability for tiered university types',
    popular: false,
    hasChart: false,
    isNew: true,
    tips: [
      'Apply to a range of schools: 2–3 Reach schools, 3–4 Match schools, and 2–3 Safety schools.',
      'Extracurriculars and essays matter most at highly selective schools where most applicants have similar GPAs.',
      'This is an estimate only — consult a college counselor for personalized advice.'
    ],
    about: `The College Admission Estimator gives a rough sense of acceptance probability across five university selectivity tiers based on GPA, SAT/ACT score, extracurricular strength, and essay quality. It helps students identify Safety, Match, and Reach schools to build a balanced college list. Important: this tool provides estimates only — real admissions decisions involve many holistic factors.`,
    tags: ['college admission', 'acceptance probability', 'university admission', 'SAT GPA', 'safety match reach'],
    keywords: ['college admission calculator', 'college acceptance probability', 'university admission estimator', 'safety match reach colleges'],
  },
];
