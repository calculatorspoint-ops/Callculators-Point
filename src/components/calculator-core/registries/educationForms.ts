import { lazy } from "react";

const Education = {
  MarksPercentage: lazy(() => import("../../../modules/education/marks-percentage/MarksPercentageCalculator").then((m: any) => ({ default: m.MarksPercentageCalculator || (() => null) }))),
  Attendance: lazy(() => import("../../../modules/education/attendance/AttendanceCalculator").then((m: any) => ({ default: m.AttendanceCalculator || (() => null) }))),
  IELTS: lazy(() => import("../../../modules/education/ielts/IELTSBandCalculator").then((m: any) => ({ default: m.IELTSBandCalculator || (() => null) }))),
  SAT: lazy(() => import("../../../modules/education/sat/SATScoreCalculator").then((m: any) => ({ default: m.SATScoreCalculator || (() => null) }))),
  StudyTimer: lazy(() => import("../../../modules/education/study-timer/StudyTimer").then((m: any) => ({ default: m.StudyTimer || (() => null) }))),
  TargetGPA: lazy(() => import("../../../modules/education/target-gpa/TargetGPACalculator").then((m: any) => ({ default: m.TargetGPACalculator || (() => null) }))),
  RequiredGrade: lazy(() => import("../../../modules/education/required-grade/RequiredGradeCalculator").then((m: any) => ({ default: m.RequiredGradeCalculator || (() => null) }))),
  FinalGrade: lazy(() => import("../../../modules/education/required-grade/RequiredGradeCalculator").then((m: any) => ({ default: m.RequiredGradeCalculator || (() => null) }))),
  GPA: lazy(() => import("../../../modules/education/gpa/GPACalculator").then((m: any) => ({ default: m.GPACalculator || (() => null) }))),
  CGPA: lazy(() => import('../forms/MathForms').then((m: any) => ({ default: m.CGPAForm || (() => null) }))),

  // ── HIGH PRIORITY (New) ───────────────────────────────────────────────────
  WeightedGrade: lazy(() => import("../../../modules/education/weighted-grade/WeightedGradeCalculator").then((m: any) => ({ default: m.WeightedGradeCalculator || (() => null) }))),
  GRE: lazy(() => import("../../../modules/education/gre/GREScoreCalculator").then((m: any) => ({ default: m.GREScoreCalculator || (() => null) }))),
  TOEFL: lazy(() => import("../../../modules/education/toefl/TOEFLScoreCalculator").then((m: any) => ({ default: m.TOEFLScoreCalculator || (() => null) }))),
  ScholarshipGPA: lazy(() => import("../../../modules/education/scholarship-gpa/ScholarshipGPAPlanner").then((m: any) => ({ default: m.ScholarshipGPAPlanner || (() => null) }))),
  AssignmentGrade: lazy(() => import("../../../modules/education/assignment-grade/AssignmentGradeCalculator").then((m: any) => ({ default: m.AssignmentGradeCalculator || (() => null) }))),

  // ── MEDIUM PRIORITY (New) ─────────────────────────────────────────────────
  CumulativeGPA: lazy(() => import("../../../modules/education/cumulative-gpa/CumulativeGPACalculator").then((m: any) => ({ default: m.CumulativeGPACalculator || (() => null) }))),
  ACT: lazy(() => import("../../../modules/education/act/ACTScoreCalculator").then((m: any) => ({ default: m.ACTScoreCalculator || (() => null) }))),
  TestScore: lazy(() => import("../../../modules/education/test-score/TestScoreCalculator").then((m: any) => ({ default: m.TestScoreCalculator || (() => null) }))),
  GPAConverter: lazy(() => import("../../../modules/education/gpa-converter/GPAConverterCalculator").then((m: any) => ({ default: m.GPAConverterCalculator || (() => null) }))),
  ClassRank: lazy(() => import("../../../modules/education/class-rank/ClassRankCalculator").then((m: any) => ({ default: m.ClassRankCalculator || (() => null) }))),
  StudySchedule: lazy(() => import("../../../modules/education/study-schedule/StudySchedulePlanner").then((m: any) => ({ default: m.StudySchedulePlanner || (() => null) }))),

  // ── LOWER PRIORITY (New) ──────────────────────────────────────────────────
  GMAT: lazy(() => import("../../../modules/education/gmat/GMATScoreCalculator").then((m: any) => ({ default: m.GMATScoreCalculator || (() => null) }))),
  PassFail: lazy(() => import("../../../modules/education/pass-fail/PassFailCalculator").then((m: any) => ({ default: m.PassFailCalculator || (() => null) }))),
  ReadingLevel: lazy(() => import("../../../modules/education/reading-level/ReadingLevelCalculator").then((m: any) => ({ default: m.ReadingLevelCalculator || (() => null) }))),
  CollegeAdmission: lazy(() => import("../../../modules/education/college-admission/CollegeAdmissionEstimator").then((m: any) => ({ default: m.CollegeAdmissionEstimator || (() => null) }))),
};

export const educationForms = {
  // ── Existing calculators ──────────────────────────────────────────────────
  "marks-percentage-calculator":       Education.MarksPercentage,
  "attendance-calculator":             Education.Attendance,
  "final-grade-calculator":            Education.FinalGrade,
  "ielts-band-calculator":             Education.IELTS,
  "sat-score-calculator":              Education.SAT,
  "study-timer":                       Education.StudyTimer,
  "target-gpa-calculator":             Education.TargetGPA,
  "required-grade-calculator":         Education.RequiredGrade,
  "gpa-calculator":                    Education.GPA,
  "cgpa-percentage-calculator":        Education.CGPA,

  // ── High Priority (New) ───────────────────────────────────────────────────
  "weighted-grade-calculator":         Education.WeightedGrade,
  "gre-score-calculator":              Education.GRE,
  "toefl-score-calculator":            Education.TOEFL,
  "scholarship-gpa-planner":           Education.ScholarshipGPA,
  "assignment-grade-calculator":       Education.AssignmentGrade,

  // ── Medium Priority (New) ─────────────────────────────────────────────────
  "cumulative-gpa-calculator":         Education.CumulativeGPA,
  "act-score-calculator":              Education.ACT,
  "test-score-calculator":             Education.TestScore,
  "gpa-converter":                     Education.GPAConverter,
  "class-rank-calculator":             Education.ClassRank,
  "study-schedule-planner":            Education.StudySchedule,

  // ── Lower Priority (New) ──────────────────────────────────────────────────
  "gmat-score-calculator":             Education.GMAT,
  "pass-fail-calculator":              Education.PassFail,
  "reading-level-calculator":          Education.ReadingLevel,
  "college-admission-estimator":       Education.CollegeAdmission,
};
