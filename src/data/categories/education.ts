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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
},
];
