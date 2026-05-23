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
