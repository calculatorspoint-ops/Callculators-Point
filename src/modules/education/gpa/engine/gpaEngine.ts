import { GPAForm } from '../schemas/gpaSchema';

export interface GPAResult {
  gpa: number;
  totalCredits: number;
  deansThreshold: number;
}

const GradePoints: Record<string, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0
};

export function calculateGPA(params: GPAForm): GPAResult {
  let totalPoints = 0;
  let totalCredits = 0;

  params.courses.forEach(c => {
    const pts = GradePoints[c.grade] * c.credits;
    totalPoints += pts;
    totalCredits += c.credits;
  });

  const dt = Math.max(2.0, Math.min(4.0, Number(params.deansThreshold) || 3.5));
  return {
    gpa: totalCredits > 0 ? Number((totalPoints / totalCredits).toFixed(2)) : 0,
    totalCredits,
    deansThreshold: dt,
  };
}
