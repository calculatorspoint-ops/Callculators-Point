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
  intro: 'The GPA Calculator computes your weighted semester GPA using grade points and credit hours — the same method your registrar uses. Enter any number of courses, see your Dean\'s List status instantly, and run what-if scenarios to find out exactly what grades you need to hit your target.',
  metaTitle: 'Free GPA Calculator Online',
  metaDescription: 'Calculate your semester and cumulative GPA instantly. Supports 4.0 and custom grading scales. Track Dean\'s List eligibility and simulate what-if scenarios.',
  workedExample: {
    title: 'Calculating semester GPA for a college sophomore',
    inputs: [
      'Calculus II — 4 credits, grade B+ (3.3)',
      'English Composition — 3 credits, grade A (4.0)',
      'History 101 — 3 credits, grade B (3.0)',
      'Biology Lab — 1 credit, grade A- (3.7)',
    ],
    steps: [
      'Quality points per course: Calculus = 4 × 3.3 = 13.2 | English = 3 × 4.0 = 12.0 | History = 3 × 3.0 = 9.0 | Bio Lab = 1 × 3.7 = 3.7',
      'Total quality points = 13.2 + 12.0 + 9.0 + 3.7 = 37.9',
      'Total credit hours = 4 + 3 + 3 + 1 = 11',
      'GPA = 37.9 ÷ 11 = 3.45',
    ],
    result: 'Semester GPA = 3.45 — just below the 3.5 Dean\'s List threshold. Raising Calculus to an A- (3.7) would push GPA to 3.52 and qualify.',
  },
  relatedCalculators: ['marks-percentage-calculator', 'final-grade-calculator', 'target-gpa-calculator', 'cumulative-gpa-calculator', 'weighted-grade-calculator', 'scholarship-gpa-planner'],
  about: `GPA is the most widely used measure of academic performance in US and many international universities. It weighs each course by credit hours, meaning a 4-credit course has four times the influence of a 1-credit elective on your final number.

This calculator handles the full 4.0 scale — including the plus/minus grades (A-, B+, etc.) that many institutional GPA averagers leave out. Add courses, adjust grades, and the weighted GPA updates instantly. The Dean's List indicator tells you exactly how close you are to the 3.5 threshold.

The what-if simulator is most useful before finals: leave a course grade blank or set it to your target, and the calculator back-solves the GPA impact. Useful for deciding how much effort to put into each remaining course.`,
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
  intro: 'The Marks Percentage Calculator converts raw scores to a percentage and grade classification across Indian, Pakistani, UK, and US grading systems. It handles multi-subject exams, shows per-subject breakdowns, and includes a reverse mode to find the marks needed for a target percentage.',
  metaTitle: 'Free Marks Percentage Calculator Online',
  metaDescription: 'Convert marks to percentage instantly. Multi-subject support, grade estimation, and reverse mode. Works for all school and university exams worldwide.',
  workedExample: {
    title: 'Calculating overall percentage for a 5-subject board exam',
    inputs: [
      'English: 78 / 100',
      'Mathematics: 91 / 100',
      'Physics: 84 / 100',
      'Chemistry: 76 / 100',
      'Biology: 69 / 100',
    ],
    steps: [
      'Total marks obtained = 78 + 91 + 84 + 76 + 69 = 398',
      'Total maximum marks = 5 × 100 = 500',
      'Percentage = (398 / 500) × 100 = 79.6%',
    ],
    result: '79.6% overall — falls in the First Division (Merit) band. Biology at 69% is the weakest subject and the primary target for improvement.',
  },
  relatedCalculators: ['gpa-calculator', 'attendance-calculator', 'final-grade-calculator', 'test-score-calculator'],
  about: `Converting marks to a percentage sounds simple, but multi-subject exams with different maximum marks per subject trip up many students. Adding 85/100 in Physics to 42/50 in a lab isn't the same as averaging percentages — you need to sum both numerators and denominators first before dividing.

This calculator handles that correctly. Add each subject with its own marks and maximum, and the overall percentage is computed from the totals — not by averaging the individual subject percentages, which would be mathematically wrong.

The reverse mode is particularly useful for exam planning: enter a target percentage (say, 75% for a scholarship cut-off) and the tool tells you the minimum total marks you must score. Switch between Indian board, Pakistani HEC, UK, and US grade scales to see the corresponding letter or division grade.`,
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
  intro: 'The Attendance Calculator tells you your current attendance percentage and how many more classes you can safely miss before falling below your university\'s minimum threshold. It works subject-by-subject, flags subjects already in the danger zone, and shows how many classes you need to attend to recover.',
  metaTitle: 'Free Attendance Calculator Online',
  metaDescription: 'Calculate your attendance percentage and find how many classes you can safely miss. Subject-wise bunk planner with 75% attendance warning system.',
  workedExample: {
    title: 'Checking safe bunks for a student with 75% minimum requirement',
    inputs: [
      'Total classes held: 52',
      'Classes attended: 43',
      'Minimum required attendance: 75%',
    ],
    steps: [
      'Current attendance = (43 / 52) × 100 = 82.7%',
      'Minimum attended classes needed = ceil(52 × 0.75) = 39',
      'Safe bunks = floor(43 × 100 / 75 − 52) = floor(57.33 − 52) = 5',
    ],
    result: 'You can safely miss 5 more classes and still maintain 75% attendance. Missing 6 would drop you to 74%.',
  },
  relatedCalculators: ['marks-percentage-calculator', 'gpa-calculator', 'study-timer', 'study-schedule-planner'],
  about: `Most South Asian universities enforce a 75% minimum attendance policy — students who fall below it are barred from semester exams regardless of their academic performance. Knowing exactly where you stand, and how much buffer you have, prevents last-minute surprises.

The safe-bunks formula isn't just a percentage check. It solves for the maximum number of additional absences you can accumulate without crossing the threshold, accounting for the total classes already held.

Switch to the subject-wise Bunk Planner to see each subject independently — because missing five Physics lectures affects your Physics attendance, not your overall average. Subjects already below the minimum are flagged, and the calculator shows how many consecutive classes you must attend to get back into compliance.`,
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
  intro: 'The Final Grade Calculator computes your weighted course grade from assignments, midterms, and finals — each with its own weight. Leave any upcoming component blank and the calculator tells you the exact score needed on it to reach your target grade.',
  workedExample: {
    title: 'Finding the final exam score needed to earn a B in a course',
    inputs: [
      'Assignments (25% weight): scored 88%',
      'Midterm (35% weight): scored 74%',
      'Final Exam (40% weight): score unknown — target overall B (80%)',
    ],
    steps: [
      'Points earned so far = (25 × 88) + (35 × 74) = 2200 + 2590 = 4790',
      'Points needed overall for 80% = 80 × 100 = 8000',
      'Points needed from final = 8000 − 4790 = 3210',
      'Required final exam score = 3210 / 40 = 80.25%',
    ],
    result: 'A score of 80.25% or above on the final exam earns a B (80%) overall. The final is worth 40%, so each percentage point on it moves your course grade by 0.4 points.',
  },
  relatedCalculators: ['gpa-calculator', 'required-grade-calculator', 'weighted-grade-calculator', 'assignment-grade-calculator'],
  about: `Course grades are rarely simple averages — almost every class weights assignments, midterms, and finals differently. The Final Grade Calculator respects those weights and computes your actual standing at any point in the semester.

The most practical feature is the "what score do I need" mode. Enter your target grade, fill in the scores you already have, and leave the final exam (or any pending work) blank. The tool solves for the required score on the missing component instantly.

Best Case and Worst Case scenarios bracket your realistic outcome: Best Case assumes 100% on everything still pending; Worst Case assumes 0%. Your final grade will fall somewhere in between, and knowing that range helps you make smarter decisions about where to focus your remaining study time.`,
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
  intro: 'The CGPA to Percentage Calculator converts your cumulative grade point average to a percentage equivalent using the exact formula your university or regulatory body prescribes. It supports five institutional formulas including UGC (India), HEC Pakistan, VTU, and Anna University.',
  workedExample: {
    title: 'Converting a 3.6 CGPA for a Pakistani engineering graduate',
    inputs: [
      'CGPA: 3.6 (on a 4.0 scale)',
      'University system: HEC Pakistan',
    ],
    steps: [
      'HEC Pakistan formula: Percentage = CGPA × 10',
      'Percentage = 3.6 × 10 = 36.0... wait, that\'s SGPA-based',
      'Correct HEC formula: Percentage = (CGPA / 4.0) × 100 = 90%',
      'Alternative check: standard UGC formula = CGPA × 9.5 = 34.2... ',
      'Using HEC official: Percentage = CGPA × 25 = 90% (4.0 scale → 3.6 × 25 = 90)',
    ],
    result: 'A 3.6 CGPA on a 4.0 scale equals 90% under HEC Pakistan\'s formula — which corresponds to a Distinction grade.',
  },
  relatedCalculators: ['gpa-calculator', 'marks-percentage-calculator', 'cumulative-gpa-calculator', 'gpa-converter'],
  about: `CGPA and percentage measure the same academic performance differently — but the conversion formula isn't universal. Indian universities affiliated with UGC use CGPA × 9.5, Pakistan's HEC uses a different multiplier, and VTU Bangalore has its own formula entirely. Using the wrong conversion on a job application or visa form can misrepresent your actual grades.

This calculator supports the five most common institutional formulas. Select your university system from the dropdown, enter your CGPA, and get the accurate percentage alongside the formula used — so you can cite it if asked.

The result also shows the grade division (Distinction, First Division, etc.) under the relevant system, which is often more meaningful to employers and admission committees than the raw percentage number.`,
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
  intro: 'The IELTS Band Calculator computes your overall band score from Listening, Reading, Writing, and Speaking section scores using the official IELTS rounding rules. It also checks your score against admission requirements for UK, Australian, Canadian, and US universities.',
  metaTitle: 'Free IELTS Band Score Calculator Online',
  metaDescription: 'Calculate your IELTS overall band score from Listening, Reading, Writing, and Speaking. Check eligibility for UK, Australia, and Canada universities.',
  workedExample: {
    title: 'Calculating IELTS overall band for a student applying to UK universities',
    inputs: [
      'Listening: 7.5',
      'Reading: 6.5',
      'Writing: 6.0',
      'Speaking: 7.0',
    ],
    steps: [
      'Sum of all sections = 7.5 + 6.5 + 6.0 + 7.0 = 27.0',
      'Average = 27.0 / 4 = 6.75',
      'Apply official rounding: 6.75 rounds to 7.0 (≥ .25 rounds up to the next half band)',
    ],
    result: 'Overall Band Score = 7.0. This meets the standard requirement for most UK universities. Note: if Writing (6.0) is below a program\'s section minimum, it may still be flagged even with an overall 7.0.',
  },
  relatedCalculators: ['toefl-score-calculator', 'gpa-calculator', 'sat-score-calculator', 'gre-score-calculator'],
  about: `The IELTS overall band score isn't a simple average — it uses a specific rounding rule that rounds to the nearest half-band, with .25 and above rounding up. Many students calculate the wrong overall band because they apply standard decimal rounding instead. This calculator applies the official rule precisely.

Each of the four sections (Listening, Reading, Writing, Speaking) is scored on a 1–9 scale in half-band increments. Listening and Reading scores derive from raw marks out of 40, so the calculator includes a raw-score conversion mode: enter the number of correct answers and get the band equivalent.

The eligibility checker maps your overall band against the published requirements for UK, Australian, Canadian, and US university tiers — from standard undergraduate entry (Band 6.0) to Oxford and Cambridge postgraduate requirements (Band 7.5+). Section minimums are checked separately, since many programs reject candidates with a low Writing score even if overall band qualifies.`,
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
  formula: 'Total SAT Score = Math (200–800) + Reading & Writing (200–800)\nTotal Range: 400–1600',
  tips: [
    'A 1400+ SAT score puts you in the top 6% of test takers globally.',
    'The Digital SAT (2024+) has two modules per section — difficulty adapts based on your Module 1 performance.',
    'Score improvements of 100+ points are common with 6–8 weeks of structured preparation.'
  ],
  intro: 'The SAT Score Calculator converts your Math and Reading & Writing section scores into a total score (400–1600) and maps it to a national percentile rank. It covers the current Digital SAT format and compares your score against admission profiles for university selectivity tiers.',
  workedExample: {
    title: 'Estimating SAT total and percentile for a college-bound junior',
    inputs: [
      'Math section: 690',
      'Reading & Writing section: 720',
    ],
    steps: [
      'Total SAT Score = Math + Reading & Writing = 690 + 720 = 1410',
      'Percentile lookup (College Board data): 1410 ≈ 95th percentile',
      'Comparison: 1410 is above the median admitted score for most top-50 US universities',
    ],
    result: 'Total SAT Score = 1410, approximately 95th percentile. This score is competitive for selective universities and above median for most flagship state universities.',
  },
  relatedCalculators: ['act-score-calculator', 'gpa-calculator', 'college-admission-estimator', 'gre-score-calculator'],
  about: `The SAT has been fully digital since 2024 — it's shorter, adaptive, and scored the same way (400–1600). The total score is the sum of Math (200–800) and Reading & Writing (200–800). There's no penalty for wrong answers, and the test adapts the second module's difficulty based on how well you do in the first.

Percentile rank matters as much as the raw score for college admissions. A 1300 score may be the 87th percentile nationally but below median at a highly selective school. This calculator shows both the national percentile and contextualizes your score against typical admitted-student ranges at different university tiers.

For students also considering the ACT, the comparison table shows approximate ACT equivalents at each SAT score range — useful for deciding which test to prioritize after one attempt at each.`,
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
  intro: 'The Study Timer uses the Pomodoro Technique — 25-minute focused sessions separated by short breaks — to help you study more effectively without burning out. It tracks completed sessions, calculates total focused hours, and shows your daily and weekly streak.',
  workedExample: {
    title: 'Planning a 4-hour study session using the Pomodoro method',
    inputs: [
      'Target study time: 4 hours',
      'Pomodoro duration: 25 minutes',
      'Short break: 5 minutes',
      'Long break after 4 Pomodoros: 20 minutes',
    ],
    steps: [
      '4 Pomodoros × 25 min = 100 min of focus, then a 20-min long break = 120 min (2 hours) per cycle',
      'To study 4 hours of focused time: need 8 Pomodoros (2 cycles of 4)',
      'Total clock time = 8 × 25 min focus + 3 × 5 min short breaks + 1 × 20 min long break = 200 + 15 + 20 = 235 minutes ≈ 3 hr 55 min',
    ],
    result: '8 Pomodoros delivers 3 hours 20 minutes of net focused study within about 4 hours of real time — with regular breaks built in to maintain concentration throughout.',
  },
  relatedCalculators: ['attendance-calculator', 'study-schedule-planner', 'gpa-calculator'],
  about: `The Pomodoro Technique was developed in the 1980s by Francesco Cirillo and has since become one of the most-studied time management methods. Its key insight is that the brain maintains high-quality focus in short bursts better than in extended, unbroken stretches. The mandatory breaks aren't wasted time — they're what makes the next session effective.

This timer tracks more than just time. It logs every completed Pomodoro, calculates your total focused hours for the day and week, and builds a streak counter that makes consistency visible. Research consistently shows that regular, shorter study sessions produce better long-term retention than occasional marathon cramming.

Custom mode lets you adjust the focus and break durations. Common alternatives include 50/10 (Deep Work) for complex problem sets and 15/3 (Short Burst) for review sessions. The default 25/5 works best for most academic subjects.`,
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
  intro: 'The Target GPA Calculator determines what GPA you need to earn in your remaining semesters to reach a specific cumulative GPA at graduation. It accounts for your current GPA, credits completed, and the credits still to be taken — and flags if your goal is mathematically out of reach.',
  workedExample: {
    title: 'Calculating the required future GPA for a 3.3 graduation target',
    inputs: [
      'Current cumulative GPA: 2.9',
      'Credits completed: 72',
      'Remaining credits to graduation: 48',
      'Target graduation GPA: 3.3',
    ],
    steps: [
      'Quality points needed total = Target GPA × Total credits = 3.3 × 120 = 396',
      'Quality points already earned = Current GPA × Completed credits = 2.9 × 72 = 208.8',
      'Quality points needed from remaining semesters = 396 − 208.8 = 187.2',
      'Required future GPA = 187.2 / 48 = 3.9',
    ],
    result: 'You need a 3.9 GPA over your remaining 48 credits to reach a 3.3 cumulative GPA. Challenging but achievable — it means mostly A grades from here on.',
  },
  relatedCalculators: ['gpa-calculator', 'cumulative-gpa-calculator', 'scholarship-gpa-planner', 'weighted-grade-calculator'],
  about: `GPA is cumulative — every course you've already taken is baked into it, and it becomes harder to move the needle the more credits you've completed. A freshman with a 2.5 GPA after 15 credits can realistically graduate with a 3.3 by earning straight A's. A junior with a 2.5 GPA after 90 credits would need above-4.0 performance in the remaining semesters, which is impossible.

The Target GPA Calculator makes this math explicit. Enter your current GPA, credits earned, remaining credits, and target — and it computes the exact GPA you need each semester going forward. A feasibility status (Achievable, Challenging, or Impossible) gives you an honest assessment.

This is particularly useful for students approaching graduate school applications, scholarship renewals, or academic probation requirements, where the target GPA has a specific, meaningful threshold.`,
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
  intro: 'The Required Grade Calculator tells you the exact score you need on each remaining assignment, midterm, or final to achieve your desired course grade. Enter your completed scores with their weights, set your target, and the calculator solves for the missing values instantly.',
  workedExample: {
    title: 'Finding the quiz score needed to earn an A- (90%) in a course',
    inputs: [
      'Homework (20% weight): scored 95%',
      'Midterm (35% weight): scored 82%',
      'Final Quiz (15% weight): score unknown',
      'Final Exam (30% weight): score unknown — will assume 85%',
      'Target grade: 90%',
    ],
    steps: [
      'Points earned: Homework = 0.20 × 95 = 19.0 | Midterm = 0.35 × 82 = 28.7 | Final Exam = 0.30 × 85 = 25.5',
      'Total earned = 19.0 + 28.7 + 25.5 = 73.2',
      'Points needed for 90% overall = 90.0',
      'Points needed from Final Quiz = 90.0 − 73.2 = 16.8',
      'Required Quiz score = 16.8 / 0.15 = 112% — exceeds 100%',
    ],
    result: 'A 90% overall is not achievable even with a perfect quiz score. Adjusting the target to 88% requires: (88 − 73.2) / 0.15 = 98.7% on the quiz — still very high. Realistic target: 85–87%.',
  },
  relatedCalculators: ['final-grade-calculator', 'weighted-grade-calculator', 'gpa-calculator', 'pass-fail-calculator'],
  about: `End-of-semester grade stress usually comes down to one question: what do I need to score on this final to get the grade I want? The Required Grade Calculator answers that precisely, considering the exact weights of every completed and pending component.

The formula works in reverse from the target: it calculates what's still "available" in your course grade, then divides the shortfall by the weight of the pending work. If the result exceeds 100%, the target is mathematically out of reach — the calculator shows this clearly and suggests the highest achievable grade instead.

Best Case and Worst Case brackets are shown alongside the required score: Best Case assumes 100% on all remaining work, Worst Case assumes 0%. The gap between them tells you how much your grade can still realistically move.`,
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
      "If weights don't sum to 100%, the calculator projects your grade from completed items only."
    ],
    intro: 'The Weighted Grade Calculator computes your overall course grade from any number of components — homework, labs, quizzes, midterms, and finals — each with its own custom weight. It shows the grade impact of every item and solves for the score needed on any pending assignment to hit your target.',
    workedExample: {
      title: 'Calculating course grade with mixed assignment types',
      inputs: [
        'Weekly Quizzes (15% total weight): avg 82%',
        'Lab Reports (20% weight): avg 91%',
        'Midterm Exam (25% weight): scored 76%',
        'Final Project (15% weight): scored 88%',
        'Final Exam (25% weight): scored 79%',
      ],
      steps: [
        'Quizzes: 0.15 × 82 = 12.3',
        'Labs: 0.20 × 91 = 18.2',
        'Midterm: 0.25 × 76 = 19.0',
        'Project: 0.15 × 88 = 13.2',
        'Final: 0.25 × 79 = 19.75',
        'Weighted Grade = 12.3 + 18.2 + 19.0 + 13.2 + 19.75 = 82.45%',
      ],
      result: 'Course grade = 82.45% — a solid B. Lab Reports were the strongest component; the Midterm was the weakest and had the biggest negative impact due to its 25% weight.',
    },
    relatedCalculators: ['gpa-calculator', 'final-grade-calculator', 'required-grade-calculator', 'assignment-grade-calculator'],
    about: `Not all grades are created equal. A 90% on a homework worth 5% of your grade matters far less than an 80% on a final worth 40%. The Weighted Grade Calculator makes these differences visible by showing exactly how many course grade points each component contributes.

Enter each course component with its score and percentage weight. The total weighted grade updates instantly, and the "impact" column shows each item's contribution in grade points. High-weight items with low scores stand out immediately as priorities.

The what-if solver is the most-used feature: leave a score blank for any pending item, enter your desired final course grade, and the calculator tells you the exact score needed on that item. If multiple items are pending, you can set individual targets or let the calculator distribute the load.`,
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
      "Many top PhD programs expect Quant 165+ and Verbal 158+ — check your target program's median scores.",
      'AWA scores of 4.5+ are considered strong; few programs weigh AWA heavily above 4.0.'
    ],
    intro: 'The GRE Score Calculator converts Verbal and Quantitative section scores to the official 130–170 scaled range, adds them to a combined total, and maps each to its percentile rank. It then benchmarks your profile against graduate program tiers from elite PhD programs to standard master\'s admissions.',
    workedExample: {
      title: 'Evaluating GRE scores for a PhD application in computer science',
      inputs: [
        'Verbal Reasoning: 156',
        'Quantitative Reasoning: 167',
        'Analytical Writing: 4.5',
      ],
      steps: [
        'Combined Total = 156 + 167 = 323 (out of 340)',
        'Verbal 156 ≈ 73rd percentile among all GRE test-takers',
        'Quantitative 167 ≈ 90th percentile',
        'AWA 4.5 = above average; most CS programs weight Quant much more heavily than Verbal or AWA',
      ],
      result: 'Total 323/340. For CS PhD programs, Quant 167 (90th percentile) is strong and meets or exceeds most program medians. Verbal 156 is acceptable for STEM fields where Verbal is not the primary focus.',
    },
    relatedCalculators: ['gmat-score-calculator', 'gpa-calculator', 'toefl-score-calculator', 'sat-score-calculator'],
    about: `The GRE General Test is the standard graduate school admission test accepted by thousands of programs across disciplines. The Verbal and Quantitative sections each score on a 130–170 scale, and ETS uses statistical equating to make scores comparable across test dates — so a 162 from one administration reflects the same ability level as a 162 from another.

Percentile rank is often more informative than the raw score for admissions decisions. A 160 Quant sounds strong, but at the 76th percentile, it's below median for many engineering and CS PhD programs that see 165+ from most applicants. This calculator shows both the scaled score and the current percentile for context.

Program comparison tiers help you understand whether your score is competitive for your specific field. Physics and math programs weight Quant heavily; humanities programs weight Verbal. The AWA score of 4.0–5.5 is rarely decisive, but a 3.0 or below can be a flag at writing-intensive programs.`,
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
    intro: 'The TOEFL Score Calculator totals your Reading, Listening, Speaking, and Writing iBT section scores into a composite (0–120), checks eligibility against university tiers, and shows the approximate IELTS band equivalent for applicants comparing English proficiency test options.',
    workedExample: {
      title: 'Calculating TOEFL iBT total for a graduate applicant',
      inputs: [
        'Reading: 25',
        'Listening: 27',
        'Speaking: 23',
        'Writing: 24',
      ],
      steps: [
        'Total iBT = 25 + 27 + 23 + 24 = 99',
        'IELTS approximate equivalent: TOEFL 99 ≈ IELTS 7.0',
        'University eligibility: Most US graduate programs require 90–100; score of 99 qualifies',
        'Section check: Speaking 23 may fall below the section minimum (24–26) at some highly selective programs',
      ],
      result: 'Total TOEFL iBT = 99. Competitive for most US graduate programs. Speaking score of 23 may need improvement for programs with a 24+ section minimum.',
    },
    relatedCalculators: ['ielts-band-calculator', 'gpa-calculator', 'gre-score-calculator'],
    about: `The TOEFL iBT (Internet-Based Test) is the most widely accepted English proficiency test for US university admissions. Each of the four sections — Reading, Listening, Speaking, and Writing — is scored from 0 to 30, giving a composite range of 0–120.

Unlike IELTS, which uses a band scale with half-point increments, TOEFL uses integer scores and has no official "pass" — each institution sets its own threshold. Most US graduate programs require 90–105; highly selective programs like MIT or Harvard often require 100+. Section minimums for Speaking and Writing are increasingly common at research universities, since these skills matter for teaching assistantships.

This calculator also provides the approximate IELTS band equivalent at each TOEFL score range using ETS's official concordance, which is useful if you're deciding which test to take or if a university accepts both.`,
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
      "Acting early matters most — the more credits you've already earned, the harder it is to raise your GPA.",
      'If the required GPA per semester exceeds 4.0, you need more credits or must lower your target.',
      'Focus on high-credit courses first — a 4-credit A impacts your GPA more than a 1-credit A.'
    ],
    intro: 'The Scholarship GPA Planner calculates the semester-by-semester GPA you need to qualify or maintain a scholarship with a specific GPA requirement. It factors in your current GPA, credits completed, and semesters remaining — and flags immediately if the target is mathematically out of reach.',
    workedExample: {
      title: 'Planning to qualify for a merit scholarship requiring 3.5 GPA',
      inputs: [
        'Current cumulative GPA: 3.1',
        'Credits completed: 45',
        'Remaining credits to qualify: 30',
        'Scholarship GPA requirement: 3.5',
      ],
      steps: [
        'Total credits at qualification = 45 + 30 = 75',
        'Quality points needed = 3.5 × 75 = 262.5',
        'Quality points already earned = 3.1 × 45 = 139.5',
        'Quality points needed in remaining credits = 262.5 − 139.5 = 123',
        'Required GPA in remaining 30 credits = 123 / 30 = 4.1',
      ],
      result: 'A 4.1 GPA exceeds the 4.0 maximum — the 3.5 target is not achievable in 30 credits from this starting point. Extending by one semester (15 more credits) makes it possible: 123/45 = 2.73 — easily achievable.',
    },
    relatedCalculators: ['gpa-calculator', 'target-gpa-calculator', 'cumulative-gpa-calculator', 'weighted-grade-calculator'],
    about: `Scholarship GPA requirements aren't always intuitive. A student who needs to go from 3.1 to 3.5 might assume that's achievable with a good semester — but with 45 credits already in, it may require impossible performance. The Scholarship GPA Planner makes this calculation transparent upfront, so there are no surprises at the scholarship review deadline.

The semester-by-semester roadmap breaks down exactly what GPA you need each remaining semester, assuming equal credits per semester. If the per-semester required GPA exceeds 4.0, the tool shows how many additional semesters or credits would make the target feasible.

This is also useful for students on scholarship probation: many scholarships require maintaining a 3.0 or 3.25 each semester, and the planner helps model exactly what course performance is needed to stay compliant through graduation.`,
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
      "Each assignment's \"impact\" column shows how many grade points it contributes to your final course grade.",
      'Use "Drop Lowest" to see how your grade changes if your worst score is excluded.',
      'Weights must sum to 100% for a final grade; otherwise the tool projects from completed items.'
    ],
    intro: 'The Assignment Grade Calculator tracks every course component — homework, labs, projects, quizzes — with individual scores and weights, and shows exactly how each item impacts your final course grade. Add unlimited items, use the Drop Lowest toggle, and see your running grade update as results come in.',
    workedExample: {
      title: 'Tracking grade impact across a full semester of assignments',
      inputs: [
        'Problem Sets ×8 (20% total): avg 88% each',
        'Lab Reports ×6 (25% total): avg 79%',
        'Midterm 1 (15%): 84%',
        'Midterm 2 (15%): 71%',
        'Final Exam (25%): 80%',
      ],
      steps: [
        'Problem Sets: 0.20 × 88 = 17.6 grade points',
        'Lab Reports: 0.25 × 79 = 19.75 grade points',
        'Midterm 1: 0.15 × 84 = 12.6 grade points',
        'Midterm 2: 0.15 × 71 = 10.65 grade points',
        'Final Exam: 0.25 × 80 = 20.0 grade points',
        'Course Grade = 17.6 + 19.75 + 12.6 + 10.65 + 20.0 = 80.6%',
      ],
      result: 'Course grade = 80.6% (B). Midterm 2 at 71% had the worst impact per weight. Dropping Midterm 2 (if allowed) would raise the grade to 83.1% by redistributing its weight.',
    },
    relatedCalculators: ['weighted-grade-calculator', 'final-grade-calculator', 'required-grade-calculator', 'gpa-calculator'],
    about: `Most students know their scores but not their standing. The Assignment Grade Calculator bridges that gap by showing not just your current grade, but the specific contribution of each item — making it immediately clear which assignments are dragging your grade down and which ones helped the most.

The "Impact" column is key: it shows each assignment's contribution in course grade points. A homework worth 20% of your grade that you scored 40% on only contributes 8 grade points — but a final exam worth 30% that you scored 90% contributes 27 points. Understanding this distribution helps you allocate study time effectively.

Drop Lowest simulates what happens when an instructor drops the worst quiz or homework score, which is common in many courses. Toggle it to see the grade improvement, and check whether studying hard for an optional extra credit item is worth the time compared to improving the mandatory assignments.`,
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
    intro: 'The Cumulative GPA Calculator combines GPAs from multiple semesters, each weighted by its credit hours, into the accurate overall GPA that appears on your transcript. It also lets you add planned future semesters to project where your cumulative GPA will land at graduation.',
    workedExample: {
      title: 'Computing cumulative GPA after three semesters',
      inputs: [
        'Fall Year 1: 3.4 GPA, 15 credit hours',
        'Spring Year 1: 3.7 GPA, 18 credit hours',
        'Fall Year 2: 3.1 GPA, 16 credit hours',
      ],
      steps: [
        'Quality points: Fall Y1 = 3.4 × 15 = 51.0 | Spring Y1 = 3.7 × 18 = 66.6 | Fall Y2 = 3.1 × 16 = 49.6',
        'Total quality points = 51.0 + 66.6 + 49.6 = 167.2',
        'Total credit hours = 15 + 18 + 16 = 49',
        'Cumulative GPA = 167.2 / 49 = 3.41',
      ],
      result: 'Cumulative GPA after 49 credits = 3.41. Note: simply averaging the three semester GPAs (3.4 + 3.7 + 3.1) / 3 = 3.4 — close but not exact, and the difference grows with more variation in credit hours per semester.',
    },
    relatedCalculators: ['gpa-calculator', 'target-gpa-calculator', 'scholarship-gpa-planner', 'weighted-grade-calculator'],
    about: `Your cumulative GPA on your transcript isn't the average of your semester GPAs — it's a credit-hour weighted average. If you take 18 credits in a strong semester and 12 credits in a weak one, the stronger semester has more influence. Simple averaging of semester GPAs produces the wrong number.

This calculator does the math correctly: multiply each semester's GPA by its credit hours, sum the products, then divide by the total credits. Add as many semesters as you've completed, and the cumulative GPA updates instantly.

The future semester projection is useful for students on the verge of academic milestones — graduation honors, scholarship GPA cutoffs, graduate program minimums. Add a planned next semester with your expected GPA and credit hours to see exactly how it will shift your cumulative number.`,
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
    intro: 'The ACT Score Calculator converts your English, Math, Reading, and Science section scores into the composite (1–36), maps it to a national percentile, and checks each section against the official ACT College Readiness Benchmarks. It also shows the approximate SAT equivalent for students choosing between the two tests.',
    workedExample: {
      title: 'Calculating ACT composite and identifying weak sections',
      inputs: [
        'English: 28',
        'Mathematics: 31',
        'Reading: 26',
        'Science: 30',
      ],
      steps: [
        'Sum of sections = 28 + 31 + 26 + 30 = 115',
        'Composite = 115 / 4 = 28.75, rounded to 29',
        'Percentile: ACT 29 ≈ 91st percentile nationally',
        'College Readiness check: English 28 ≥ 18 ✓ | Math 31 ≥ 22 ✓ | Reading 26 ≥ 22 ✓ | Science 30 ≥ 23 ✓ — all benchmarks met',
        'SAT equivalent: ACT 29 ≈ SAT 1340',
      ],
      result: 'ACT Composite = 29, 91st percentile. All four college readiness benchmarks are met. Reading (26) is the lowest section and the primary area for improvement. ACT 29 ≈ SAT 1340.',
    },
    relatedCalculators: ['sat-score-calculator', 'gpa-calculator', 'college-admission-estimator', 'gre-score-calculator'],
    about: `The ACT composite is the average of four section scores (English, Math, Reading, Science), each ranging from 1–36, rounded to the nearest whole number. Unlike the SAT, the ACT includes a Science section that tests data interpretation and scientific reasoning rather than content knowledge — you don't need to memorize chemistry formulas to score well on it.

ACT College Readiness Benchmarks are score thresholds in each section that indicate a 50% chance of earning a B or better in related first-year college courses. Meeting all four benchmarks is a meaningful indicator of college readiness, separate from how your score compares to admitted students at your specific target schools.

Many students perform differently on the ACT versus the SAT. If you score in the 85th+ percentile on either, most colleges consider them equivalent. The SAT comparison table helps you decide which test gave you the stronger result after one attempt at each.`,
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
      "Use the custom pass-mark input to set your institution's specific minimum passing threshold."
    ],
    intro: 'The Test Score Calculator converts raw marks to a percentage and assigns the corresponding letter grade or division based on your chosen grading system — US, UK, Indian, Pakistani, or custom. Multi-subject mode calculates overall scores correctly by totaling marks across subjects.',
    workedExample: {
      title: 'Grading a Pakistani matric exam across five subjects',
      inputs: [
        'Urdu: 71 / 100',
        'English: 68 / 100',
        'Mathematics: 85 / 100',
        'Physics: 79 / 100',
        'Chemistry: 73 / 100',
      ],
      steps: [
        'Total obtained = 71 + 68 + 85 + 79 + 73 = 376',
        'Total maximum = 500',
        'Overall percentage = (376 / 500) × 100 = 75.2%',
        'Pakistani grade classification: 75.2% = A1 grade (70%+)',
      ],
      result: 'Overall percentage = 75.2%, grade A1 under Pakistani board grading. Mathematics (85%) is the top subject; English (68%, A grade) is the weakest and falls just below A1 threshold.',
    },
    relatedCalculators: ['marks-percentage-calculator', 'gpa-calculator', 'final-grade-calculator', 'pass-fail-calculator'],
    about: `Converting test marks to a grade is straightforward for a single subject, but multi-subject exams require careful handling. Adding up percentage scores from individual subjects and averaging them is mathematically incorrect when subjects have different maximum marks. The right approach is to total all obtained marks and all maximum marks, then compute one percentage.

This calculator handles that correctly in multi-subject mode. It also supports four grading scales — US letter grades, UK degree classifications (First/Upper Second/Lower Second), Pakistani/Indian board grades (Distinction/A1/A), and a custom scale where you set your own thresholds.

For quick single-subject checks, one-subject mode is faster: enter obtained and maximum marks and see the percentage plus grade instantly. The custom pass threshold is useful for professional certifications or university courses with non-standard passing marks.`,
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
    intro: 'The International GPA Converter translates your GPA between the 4.0 (USA, Pakistan), 5.0, 7.0 (Australia), 10.0 (India), and percentage scales. Country presets auto-configure the input system for the USA, Germany (inverse grading), India, Australia, and UK.',
    workedExample: {
      title: 'Converting an Indian 10-point CGPA to a US 4.0 GPA',
      inputs: [
        'CGPA on Indian 10.0 scale: 8.3',
        'Target scale: US 4.0',
      ],
      steps: [
        'Normalize: 8.3 / 10.0 = 0.83',
        'Convert to 4.0 scale: 0.83 × 4.0 = 3.32',
        'Percentage equivalent: 8.3 × 9.5 = 78.85% (UGC standard formula)',
        'Approximate US letter grade: B+ / A-',
      ],
      result: 'Indian CGPA 8.3/10.0 ≈ US GPA 3.32/4.0 ≈ 78.85%. When applying to US graduate schools, report both your native 8.3/10.0 and the 3.32/4.0 equivalent, along with your official transcript.',
    },
    relatedCalculators: ['gpa-calculator', 'cgpa-percentage-calculator', 'cumulative-gpa-calculator', 'marks-percentage-calculator'],
    about: `Academic institutions worldwide use different GPA scales, and most graduate schools and employers reviewing international applications need a conversion to make sense of foreign transcripts. The normalization approach — dividing by the input scale's maximum, then multiplying by the target scale's maximum — is the most widely used method.

Germany complicates things because its grading scale is inverse: 1.0 is the highest grade and 5.0 is failing. The Germany preset handles this automatically by flipping the scale before normalizing.

Always present your original GPA on its native scale alongside any conversion. Evaluators who are familiar with your country's system will often trust the original number more than a conversion, which can vary by methodology. This calculator shows the conversion formula used, so you can cite it if asked.`,
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
      "Competitive grading schools often have a tighter GPA distribution — check your school's profile."
    ],
    intro: 'The Class Rank Calculator estimates your approximate rank and class percentile based on your GPA and a typical GPA distribution for your school\'s grading environment. It\'s useful for college applications when your school doesn\'t report official class rank.',
    workedExample: {
      title: 'Estimating class rank for a high school student at a competitive school',
      inputs: [
        'Student GPA: 3.85 (unweighted)',
        'Class size: 250 students',
        'School type: Competitive (tight GPA distribution)',
      ],
      steps: [
        'Under a competitive school distribution, ~8% of students have GPA above 3.85',
        'Estimated students above = 0.08 × 250 = 20',
        'Estimated rank = 20 + 1 = 21',
        'Percentile = (250 − 21 + 1) / 250 × 100 = 91.6th percentile',
      ],
      result: 'Estimated rank: approximately 21 out of 250, ~92nd percentile. At a competitive school, this typically represents the top 10% — a strong position for selective college applications.',
    },
    relatedCalculators: ['gpa-calculator', 'sat-score-calculator', 'act-score-calculator', 'college-admission-estimator'],
    about: `About 40% of US high schools no longer report class rank on transcripts. For students applying to colleges that still ask for it — or for those trying to gauge competitiveness — an estimated rank provides useful context.

The estimate is based on a GPA distribution model for your school type: competitive schools have a narrower GPA range with more students clustered near the top, while schools with less grade compression have a wider spread. Selecting the right school type significantly affects the estimate.

For official class rank, contact your school counselor — they have the actual data and can provide the real number. This tool is best used as a rough benchmark for setting expectations during the college application process, not as a substitute for the official figure.`,
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
    intro: 'The Study Schedule Planner generates a prioritized daily study plan from your exam dates, subjects, difficulty ratings, and available hours. Study time is allocated proportionally — subjects with closer deadlines and higher difficulty receive more hours per day automatically.',
    workedExample: {
      title: 'Building a 2-week study plan for three upcoming exams',
      inputs: [
        'Statistics exam: in 7 days, difficulty: Hard, priority: High',
        'Literature exam: in 10 days, difficulty: Medium, priority: Medium',
        'History exam: in 14 days, difficulty: Easy, priority: Low',
        'Available study hours per day: 5',
      ],
      steps: [
        'Weight = Priority × Difficulty: Stats = High×Hard = 9 | Literature = Med×Med = 4 | History = Low×Easy = 1',
        'Total weight = 14',
        'Daily allocation: Stats = (9/14)×5 = 3.2 hr | Literature = (4/14)×5 = 1.4 hr | History = (1/14)×5 = 0.4 hr',
        'As Stats exam approaches in final 3 days, increase Stats to 4+ hr/day and drop History temporarily',
      ],
      result: 'Daily plan: ~3.2 hr Statistics, ~1.4 hr Literature, ~0.4 hr History. In the final 3 days before Stats exam, shift to full Statistics focus with Literature maintenance.',
    },
    relatedCalculators: ['study-timer', 'attendance-calculator', 'marks-percentage-calculator'],
    about: `Effective exam preparation isn't about studying harder — it's about studying the right subjects at the right time. The Study Schedule Planner takes the guesswork out by automatically allocating your available hours across subjects based on exam urgency, difficulty, and priority.

The Priority × Difficulty matrix ensures that a hard exam coming up next week gets significantly more of your daily hours than an easy exam three weeks away. As exam dates approach, the allocation adjusts dynamically — subjects within the final week of their exam get maximum priority.

The recommended structure leaves the last 1–2 days before each exam for review of notes and practice questions, not new material. Research on spaced repetition consistently shows that this approach produces better retention and performance than cramming entirely new content the day before.`,
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
      "The GMAT Focus Edition (2024) replaced the legacy GMAT — it's shorter and uses three sections.",
      'Top M7 MBA programs (Wharton, HBS, Booth) typically see median scores of 730–740.',
      'GMAT 700+ puts you in roughly the 85th percentile and is competitive for most top-50 MBA programs.'
    ],
    intro: 'The GMAT Score Calculator covers the current GMAT Focus Edition format — Quantitative Reasoning, Verbal Reasoning, and Data Insights (each 60–90) — and computes your composite (205–805) with percentile rank and business school tier comparison.',
    workedExample: {
      title: 'Calculating GMAT Focus Edition composite for an MBA applicant',
      inputs: [
        'Quantitative Reasoning: 82',
        'Verbal Reasoning: 75',
        'Data Insights: 79',
      ],
      steps: [
        'Total composite = 82 + 75 + 79 = 236... scaled to 205–805 range',
        'GMAT Focus scoring table: each section 60–90, total 205–805',
        'Approximate composite: 730 (based on section average of 78.7)',
        'Percentile: GMAT 730 ≈ 96th percentile',
        'M7 comparison: 730 is at or above median for most M7 programs',
      ],
      result: 'Estimated GMAT Focus composite ≈ 730, ~96th percentile. Competitive for all top-25 MBA programs. M7 programs (Wharton, HBS) see medians of 730–740.',
    },
    relatedCalculators: ['gre-score-calculator', 'gpa-calculator', 'toefl-score-calculator', 'sat-score-calculator'],
    about: `The GMAT Focus Edition launched in 2024 as a shorter, more focused version of the legacy GMAT. It dropped Integrated Reasoning and Analytical Writing in favor of three equal sections: Quantitative Reasoning, Verbal Reasoning, and Data Insights. Each section scores 60–90, and the total composite ranges from 205 to 805.

Percentile rank is the most meaningful number for MBA admissions because it contextualizes your score against the population of test-takers — who are, by definition, self-selected MBA candidates. An 85th-percentile score is competitive for most top-50 programs; 90th+ is generally competitive for top-25; 95th+ for M7 programs.

The legacy-to-Focus concordance is relevant for applicants who have both a legacy GMAT score and are considering a retake on the Focus Edition. The calculator notes approximate equivalences for planning retake strategy.`,
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
      "If the required score exceeds 100%, your current standing makes it mathematically impossible to pass.",
      "Even a \"guaranteed pass\" scenario can flip if a high-weight final is still pending.",
      'This calculator is most useful mid-semester before all high-weight assessments are completed.'
    ],
    intro: 'The Pass/Fail Calculator determines exactly what score you need on your remaining assessments to pass a course. Enter your minimum passing mark, current average, and the weight of pending work — and the calculator returns the required score alongside a feasibility status.',
    workedExample: {
      title: 'Determining if a student can still pass a course mid-semester',
      inputs: [
        'Minimum passing mark: 50%',
        'Completed work (60% total weight): average 42%',
        'Remaining work (40% weight): final exam',
      ],
      steps: [
        'Points earned so far = 0.60 × 42 = 25.2 out of 60',
        'Points needed to pass = 50 (out of 100)',
        'Points needed from final = 50 − 25.2 = 24.8 out of 40',
        'Required final score = 24.8 / 0.40 = 62%',
      ],
      result: 'A final exam score of 62% will exactly pass the course. Scoring above 62% provides a margin; below 62% means failing. Feasibility status: Achievable.',
    },
    relatedCalculators: ['final-grade-calculator', 'required-grade-calculator', 'weighted-grade-calculator', 'attendance-calculator'],
    about: `Mid-semester is when students most often need a reality check: is there any path to passing this course? The Pass/Fail Calculator gives a direct, mathematically precise answer, accounting for the exact weight of all remaining assessments.

The feasibility labels go beyond just the required score number. "Guaranteed Pass" means you pass even if you score zero on everything remaining. "Achievable" means the required score is 100% or below. "Impossible" means you'd need more than 100% on remaining work — which no exam offers.

This tool is most useful when a student knows a high-weight final is still ahead. A seemingly comfortable average can quickly become insufficient if the final exam is worth 40–50% of the course grade. The calculator makes that risk visible before the exam, not after.`,
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
    intro: 'The Reading Level Calculator uses the Flesch-Kincaid formulas to analyze pasted text and return a US grade level equivalent and reading ease score. It counts words, sentences, and syllables to evaluate text complexity — useful for students, teachers, and writers.',
    workedExample: {
      title: 'Analyzing the readability of a college essay draft',
      inputs: [
        'Word count: 650 words',
        'Sentence count: 42 sentences',
        'Syllable count: 910 syllables',
      ],
      steps: [
        'Words per sentence = 650 / 42 = 15.5',
        'Syllables per word = 910 / 650 = 1.40',
        'FK Grade Level = 0.39×15.5 + 11.8×1.40 − 15.59 = 6.05 + 16.52 − 15.59 = 6.98 ≈ Grade 7',
        'Reading Ease = 206.835 − 1.015×15.5 − 84.6×1.40 = 206.835 − 15.73 − 118.44 = 72.7',
      ],
      result: 'Grade level 7, Reading Ease 72.7 — very accessible writing. For a college admissions essay, this is actually appropriate: clear, direct prose tends to read better than overly complex academic language.',
    },
    relatedCalculators: ['study-schedule-planner', 'study-timer', 'test-score-calculator', 'college-admission-estimator'],
    about: `The Flesch-Kincaid readability formulas were developed in the 1970s for the US Navy to evaluate the clarity of training manuals. They've since become the standard readability metric in education, publishing, and government writing guidelines. Two outputs matter: the Grade Level (what US grade a reader needs to understand the text) and Reading Ease (a 0–100 score where higher means easier to read).

Both metrics respond to the same two variables: average sentence length and average syllable count per word. Writing shorter sentences and preferring simpler words directly lowers the grade level and raises the reading ease score. Passive voice, nominalization, and jargon all tend to inflate grade level.

Educators use this tool to evaluate whether assigned texts match students' reading levels. Students use it to check whether their essays are clear and appropriately pitched. Writers targeting a general audience use it to avoid unnecessarily complex language.`,
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
    intro: 'The College Admission Estimator provides a rough acceptance probability across five university selectivity tiers based on GPA, SAT/ACT score, extracurricular strength, and essay quality. It helps students categorize schools as Safety, Match, or Reach to build a balanced college list.',
    workedExample: {
      title: 'Estimating admission chances for a well-rounded applicant',
      inputs: [
        'Unweighted GPA: 3.8',
        'SAT Score: 1380',
        'Extracurriculars: Strong (varsity sport + leadership in 2 clubs)',
        'Essays: Good',
      ],
      steps: [
        'Academic profile: GPA 3.8 + SAT 1380 positions applicant in the 90th+ percentile for most schools',
        'Highly selective (< 15% acceptance): Academic profile is solid but below typical admitted median (3.9+, 1480+) → Reach',
        'Selective (15–35% acceptance): Profile is at or above median → Match',
        'Moderately selective (35–60% acceptance): Profile is well above median → Safety',
      ],
      result: 'Classification: Highly selective schools are Reach. Selective schools are Match. Moderately selective schools are Safety. Recommended list: 2–3 selective Reaches, 3–4 selective Matches, 2 Safety schools.',
    },
    relatedCalculators: ['gpa-calculator', 'sat-score-calculator', 'act-score-calculator', 'class-rank-calculator'],
    about: `College admissions in the US is genuinely holistic at selective schools, which means no calculator can predict outcomes for individual applicants. What this estimator provides is a framework — a way to calibrate whether a school is realistic based on your academic profile, without false precision.

The five selectivity tiers (Highly Selective, Selective, Moderately Selective, Less Selective, Open Admission) each have published ranges of average admitted student GPA and test scores. Your position relative to those ranges — above, at, or below median — is the primary factor in Safety/Match/Reach categorization.

Extracurriculars and essays become differentiating factors only at schools where most applicants are academically similar. At less selective schools, GPA and test scores are decisive. Use this tool to build a college list spread across tiers, then invest your application energy in essays and recommendations regardless of the estimated probability.`,
    tags: ['college admission', 'acceptance probability', 'university admission', 'SAT GPA', 'safety match reach'],
    keywords: ['college admission calculator', 'college acceptance probability', 'university admission estimator', 'safety match reach colleges'],
  },
];
