import { lazy } from "react";

const Education = {
  MarksPercentage: lazy(() => import("../../../modules/education/marks-percentage/MarksPercentageCalculator.tsx").then((m: any) => ({ default: m.MarksPercentageCalculator }))),
  Attendance: lazy(() => import("../../../modules/education/attendance/AttendanceCalculator.tsx").then((m: any) => ({ default: m.AttendanceCalculator }))),
  IELTS: lazy(() => import("../../../modules/education/ielts/IELTSBandCalculator.tsx").then((m: any) => ({ default: m.IELTSBandCalculator }))),
  SAT: lazy(() => import("../../../modules/education/sat/SATScoreCalculator.tsx").then((m: any) => ({ default: m.SATScoreCalculator }))),
  StudyTimer: lazy(() => import("../../../modules/education/study-timer/StudyTimer.tsx").then((m: any) => ({ default: m.StudyTimer }))),
  TargetGPA: lazy(() => import("../../../modules/education/target-gpa/TargetGPACalculator.tsx").then((m: any) => ({ default: m.TargetGPACalculator }))),
  RequiredGrade: lazy(() => import("../../../modules/education/required-grade/RequiredGradeCalculator.tsx").then((m: any) => ({ default: m.RequiredGradeCalculator }))),
  FinalGrade: lazy(() => import("../../../modules/education/required-grade/RequiredGradeCalculator.tsx").then((m: any) => ({ default: m.RequiredGradeCalculator }))),
};

export const educationForms = {
  "marks-percentage-calculator":       Education.MarksPercentage,
  "attendance-calculator":             Education.Attendance,
  "final-grade-calculator":            Education.FinalGrade,
  "ielts-band-calculator":             Education.IELTS,
  "sat-score-calculator":              Education.SAT,
  "study-timer":                       Education.StudyTimer,
  "target-gpa-calculator":             Education.TargetGPA,
  "required-grade-calculator":         Education.RequiredGrade,
};
