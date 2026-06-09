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
  { label: 'D+ (1.3)', value: 'D+' }, { label: 'D (1.0)', value: 'D' }, { label: 'F (0.0)', value: 'F' },
];

/* ─────────────────────────────────────────────────────────────────────────
   GPA_COL_TEMPLATE
   Uses a CSS custom property so the same template drives both the
   header row AND every course row — perfect pixel alignment guaranteed.
   Columns: [Course Name flex] [Credits 72px] [Grade 120px] [Delete 38px]
───────────────────────────────────────────────────────────────────────── */
const COL = '1fr 72px 120px 38px';

function GPAFormUI({ control }: { control: any }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'courses' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* ── Column headers ─────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: COL,
          gap: 8,
          padding: '0 12px 0 4px',
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
          Course Name
        </div>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', display: 'flex', alignItems: 'center', gap: 3 }}>
          Credits
          <GlossaryTooltip
            term="Credit Hours"
            explanation="The number of weekly contact hours. Higher-credit courses carry more weight in your GPA."
          />
        </div>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
          Grade
        </div>
        {/* spacer for delete column */}
        <div />
      </div>

      {/* ── Course rows ────────────────────────────────────────────── */}
      {fields.map((field, index) => (
        <div
          key={field.id}
          style={{
            display: 'grid',
            gridTemplateColumns: COL,
            gap: 8,
            alignItems: 'end',
            background: 'var(--surface2)',
            padding: '10px 8px 10px 10px',
            borderRadius: 12,
            border: '1px solid var(--border)',
          }}
        >
          {/* Course name */}
          <div style={{ minWidth: 0 }}>
            <TextInput
              name={`courses.${index}.name`}
              control={control}
              label=""
              placeholder="e.g. Math 101"
            />
          </div>

          {/* Credits */}
          <div style={{ minWidth: 0 }}>
            <NumericInput
              name={`courses.${index}.credits`}
              control={control}
              label=""
              placeholder="3"
              decimals={0}
            />
          </div>

          {/* Grade */}
          <div style={{ minWidth: 0 }}>
            <SelectInput
              name={`courses.${index}.grade`}
              control={control}
              label=""
              options={GRADE_OPTIONS}
            />
          </div>

          {/* Delete */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => remove(index)}
              aria-label={`Remove course ${index + 1}`}
              style={{
                width: 36,
                height: 36,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--red-l, #fee2e2)',
                color: '#ef4444',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 700,
                transition: 'background .15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#fecaca')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--red-l, #fee2e2)')}
            >
              ✕
            </button>
          </div>
        </div>
      ))}

      {/* ── Add course button ──────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => append({ name: '', credits: 3, grade: 'A' })}
        style={{
          padding: '11px 16px',
          background: 'var(--surface2)',
          color: 'var(--text2)',
          border: '1.5px dashed var(--border)',
          borderRadius: 12,
          fontWeight: 700,
          fontSize: 13,
          cursor: 'pointer',
          transition: 'all .15s',
          marginTop: 2,
          fontFamily: 'var(--font)',
          textAlign: 'center',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--brand-l)';
          e.currentTarget.style.color = 'var(--brand)';
          e.currentTarget.style.borderColor = 'var(--brand)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'var(--surface2)';
          e.currentTarget.style.color = 'var(--text2)';
          e.currentTarget.style.borderColor = 'var(--border)';
        }}
      >
        + Add Course
      </button>

      {/* ── Dean's List Threshold ─────────────────────────────────── */}
      <div style={{ marginTop: 8, padding: '12px 14px', background: 'var(--surface2)', borderRadius: 12, border: '1px solid var(--border)' }}>
        <NumericInput
          name="deansThreshold"
          control={control}
          label="Dean's List Threshold (GPA)"
          decimals={1}
          hint="Default: 3.5. Set your institution's required GPA for Dean's List recognition."
        />
      </div>
    </div>
  );
}

const GPA_BANDS = [
  { min: 3.7, label: 'Summa / Magna Cum Laude', color: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800' },
  { min: 3.3, label: 'Cum Laude', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800' },
  { min: 3.0, label: "Dean's List (typical 3.0–3.5 threshold)", color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' },
  { min: 2.0, label: 'Good Standing', color: 'text-yellow-700 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800' },
  { min: 0.0, label: 'Academic Warning', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800' },
];

function getDeansBand(gpa: number, deansThreshold: number) {
  if (gpa >= 3.7) return { label: "Summa / Magna Cum Laude", tier: 'top' };
  if (gpa >= 3.3) return { label: "Cum Laude", tier: 'high' };
  if (gpa >= deansThreshold) return { label: `Dean's List (≥ ${deansThreshold.toFixed(1)})`, tier: 'deans' };
  if (gpa >= 2.0) return { label: "Good Standing", tier: 'ok' };
  return { label: "Academic Warning", tier: 'warn' };
}

function GPAResultUI({ result }: { result: GPAResult }) {
  const dt = result.deansThreshold ?? 3.5;
  const band = GPA_BANDS.find(b => result.gpa >= b.min) ?? GPA_BANDS[GPA_BANDS.length - 1];
  const deansInfo = getDeansBand(result.gpa, dt);

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
        {deansInfo.label}
      </div>
      <div className={`text-xs mt-3 opacity-70 ${band.color}`}>
        Across {result.totalCredits} total credit hours &middot; Dean&apos;s List threshold: {dt.toFixed(1)}
      </div>
    </div>
  );
}

function interpretGPA(result: GPAResult, _form: GPAForm): InterpretationCardProps {
  const { gpa, totalCredits } = result;
  const failedCourses = _form.courses.filter(c => c.grade === 'F');

  if (failedCourses.length > 0) {
    return {
      tone: 'critical',
      headline: `Your GPA of ${gpa.toFixed(2)} is being pulled down by ${failedCourses.length} failed course(s).`,
      detail: `An F (0.0 grade points) has full credit-hour weight in your GPA calculation. Even one failed 3-credit course has a severe impact.`,
      action: 'Consider retaking failed courses — many institutions replace the F grade upon completion, directly improving your GPA.',
    };
  }

  if (gpa >= 3.7) {
    return {
      tone: 'positive',
      headline: `Excellent! A GPA of ${gpa.toFixed(2)} across ${totalCredits} credit hours places you in the top academic tier.`,
      detail: `A 3.7+ GPA typically qualifies for Latin honors (Magna/Summa Cum Laude) and is highly competitive for graduate school applications.`,
      action: 'Maintain this trajectory and ensure your research, internships, or extracurriculars match your academic strength.',
    };
  }

  if (gpa >= 3.0) {
    return {
      tone: 'neutral',
      headline: `A GPA of ${gpa.toFixed(2)} is solid — you're meeting Dean's List thresholds at most institutions.`,
      detail: `Raising your GPA by 0.1 points requires consistently scoring slightly above your current average in upcoming semesters.`,
      action: "Focus on your highest-credit courses first — improving grades in 4-credit subjects has the biggest GPA impact per course.",
    };
  }

  return {
    tone: 'warning',
    headline: `Your GPA of ${gpa.toFixed(2)} may put you below the threshold for many graduate programs and scholarships.`,
    detail: `Most graduate programs require a minimum of 3.0 GPA, and many scholarships require 3.5+.`,
    action: 'Prioritize high-credit courses for grade improvement. A strong upward trend in your final semesters can still make a compelling case.',
  };
}

export const GPACalculator = CalculatorFactory.create({
  id: 'gpa-calculator',
  domain: 'math',
  title: 'GPA Calculator',
  schema: GPASchema,
  defaultValues: { courses: [{ name: '', credits: 3, grade: 'A' }], deansThreshold: 3.5 },
  engine: calculateGPA,
  interpretation: interpretGPA,
  formLayout: GPAFormUI,
  resultLayout: GPAResultUI,
});
