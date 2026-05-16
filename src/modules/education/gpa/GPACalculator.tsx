import React from 'react';
import { useFieldArray } from 'react-hook-form';
import { CalculatorFactory } from '../../../core/calculator-factory';
import { TextInput } from '../../../core/form-engine/components/TextInput';
import { NumericInput } from '../../../core/form-engine/components/NumericInput';
import { SelectInput } from '../../../core/form-engine/components/SelectInput';
import { GlossaryTooltip, InterpretationCardProps } from '../../../core/ui-system';
import { GPASchema, GPAForm } from './schemas/gpaSchema';
import { calculateGPA, GPAResult } from './engine/gpaEngine';

const GRADE_OPTIONS = [
  { label: 'A+ (4.0)', value: 'A+' }, { label: 'A (4.0)', value: 'A' }, { label: 'A- (3.7)', value: 'A-' },
  { label: 'B+ (3.3)', value: 'B+' }, { label: 'B (3.0)', value: 'B' }, { label: 'B- (2.7)', value: 'B-' },
  { label: 'C+ (2.3)', value: 'C+' }, { label: 'C (2.0)', value: 'C' }, { label: 'C- (1.7)', value: 'C-' },
  { label: 'D+ (1.3)', value: 'D+' }, { label: 'D (1.0)', value: 'D' }, { label: 'F (0.0)', value: 'F' }
];

function GPAFormUI({ control }: { control: any }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'courses' });

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-12 gap-2 px-1">
        <div className="col-span-5 sm:col-span-6 text-xs font-bold text-[var(--text3)] uppercase tracking-wide">Course</div>
        <div className="col-span-3 sm:col-span-2 text-xs font-bold text-[var(--text3)] uppercase tracking-wide flex items-center gap-1">
          Credits
          <GlossaryTooltip term="Credit Hours" explanation="The number of hours per week the course meets. Higher-credit courses have more weight in your GPA calculation." />
        </div>
        <div className="col-span-3 text-xs font-bold text-[var(--text3)] uppercase tracking-wide">Grade</div>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-12 gap-2 items-end bg-[var(--surface2)] p-3 rounded-xl border border-[var(--border)]">
          <div className="col-span-5 sm:col-span-6">
            <TextInput name={`courses.${index}.name`} control={control} label="" placeholder="e.g. Math 101" />
          </div>
          <div className="col-span-3 sm:col-span-2">
            <NumericInput name={`courses.${index}.credits`} control={control} label="" placeholder="3" decimals={0} />
          </div>
          <div className="col-span-3 sm:col-span-3">
            <SelectInput name={`courses.${index}.grade`} control={control} label="" options={GRADE_OPTIONS} />
          </div>
          <div className="col-span-1">
            <button
              type="button"
              onClick={() => remove(index)}
              className="w-full h-[38px] bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm"
              aria-label={`Remove course ${index + 1}`}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ name: '', credits: 3, grade: 'A' })}
        className="px-4 py-3 bg-[var(--surface2)] text-[var(--text2)] border border-dashed border-[var(--border)] rounded-xl font-bold hover:bg-[var(--surface)] hover:text-[var(--brand)] transition-colors mt-1 text-sm"
      >
        + Add Course
      </button>
    </div>
  );
}

const GPA_BANDS = [
  { min: 3.7, label: 'Summa / Magna Cum Laude', color: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800' },
  { min: 3.3, label: 'Cum Laude', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800' },
  { min: 3.0, label: 'Dean\'s List (typical)', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' },
  { min: 2.0, label: 'Good Standing', color: 'text-yellow-700 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800' },
  { min: 0.0, label: 'Academic Warning', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800' },
];

function GPAResultUI({ result }: { result: GPAResult }) {
  const band = GPA_BANDS.find(b => result.gpa >= b.min) ?? GPA_BANDS[GPA_BANDS.length - 1];

  return (
    <div className={`${band.bg} p-6 rounded-2xl border ${band.border} flex flex-col items-center justify-center text-center shadow-sm`}>
      <div className={`text-xs font-bold uppercase tracking-widest mb-2 opacity-80 ${band.color} flex items-center gap-1`}>
        Cumulative GPA
        <GlossaryTooltip
          term="GPA"
          explanation="Grade Point Average — a weighted average of your grades on a 4.0 scale, where each grade is multiplied by its credit hours."
        />
      </div>
      <div className={`text-7xl font-black ${band.color}`}>{result.gpa.toFixed(2)}</div>
      <div className={`mt-3 font-bold text-sm ${band.color} px-5 py-1.5 rounded-full bg-white/50 dark:bg-black/20 backdrop-blur-sm`}>
        {band.label}
      </div>
      <div className={`text-xs mt-3 opacity-70 ${band.color}`}>
        Across {result.totalCredits} total credit hours
      </div>
    </div>
  );
}

function interpretGPA(result: GPAResult, form: GPAForm): InterpretationCardProps {
  const { gpa, totalCredits } = result;
  const failedCourses = form.courses.filter(c => c.grade === 'F');

  if (failedCourses.length > 0) {
    return {
      tone: 'critical',
      headline: `Your GPA of ${gpa.toFixed(2)} is being pulled down by ${failedCourses.length} failed course(s).`,
      detail: `An F (0.0 grade points) has full credit-hour weight in your GPA calculation. Even one failed 3-credit course has a severe impact.`,
      action: "Consider retaking failed courses — many institutions replace the F grade upon completion, directly improving your GPA."
    };
  }

  if (gpa >= 3.7) {
    return {
      tone: 'positive',
      headline: `Excellent! A GPA of ${gpa.toFixed(2)} across ${totalCredits} credit hours places you in the top academic tier.`,
      detail: `A 3.7+ GPA typically qualifies for Latin honors (Magna/Summa Cum Laude) and is highly competitive for graduate school applications.`,
      action: "Maintain this trajectory and ensure your research, internships, or extracurriculars match your academic strength."
    };
  }

  if (gpa >= 3.0) {
    return {
      tone: 'neutral',
      headline: `A GPA of ${gpa.toFixed(2)} is solid — you're meeting Dean's List thresholds at most institutions.`,
      detail: `Raising your GPA by 0.1 points requires consistently scoring slightly above your current average in upcoming semesters.`,
      action: "Focus on your highest-credit courses first — improving grades in 4-credit subjects has the biggest GPA impact per course."
    };
  }

  return {
    tone: 'warning',
    headline: `Your GPA of ${gpa.toFixed(2)} may put you below the threshold for many graduate programs and scholarships.`,
    detail: `Most graduate programs require a minimum of 3.0 GPA, and many scholarships require 3.5+.`,
    action: "Prioritize high-credit courses for grade improvement. A strong upward trend in your final semesters can still make a compelling case."
  };
}

export const GPACalculator = CalculatorFactory.create({
  id: 'gpa-calculator',
  domain: 'math',
  title: 'GPA Calculator',
  schema: GPASchema,
  defaultValues: { courses: [{ name: '', credits: 3, grade: 'A' }] },
  engine: calculateGPA,
  interpretation: interpretGPA,
  formLayout: GPAFormUI,
  resultLayout: GPAResultUI
});
