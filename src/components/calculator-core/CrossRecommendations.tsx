import Link from "next/link";
import { Lightbulb, ArrowRight } from "lucide-react";
import { getCalcBySlug, CalculatorConfig } from "@/data/calculatorConfigs";

const CROSS_LINKS: Record<string, string[]> = {
  "bmi-calculator": ["calorie-calculator", "body-fat-calculator", "ideal-weight-calculator"],
  "calorie-calculator": ["bmr-calculator", "macro-calculator", "bmi-calculator"],
  "bmr-calculator": ["calorie-calculator", "macro-calculator", "water-intake-calculator"],
  "body-fat-calculator": ["bmi-calculator", "ideal-weight-calculator", "one-rep-max-calculator"],
  "ideal-weight-calculator": ["bmi-calculator", "body-fat-calculator", "calorie-calculator"],
  "macro-calculator": ["calorie-calculator", "bmr-calculator", "water-intake-calculator"],
  "water-intake-calculator": ["calorie-calculator", "bmr-calculator", "macro-calculator"],
  "heart-rate-calculator": ["calorie-calculator", "bmi-calculator", "body-fat-calculator"],
  "one-rep-max-calculator": ["body-fat-calculator", "macro-calculator", "calorie-calculator"],
  "loan-emi-calculator": ["mortgage-calculator", "simple-interest-calculator", "compound-interest-calculator"],
  "mortgage-calculator": ["loan-emi-calculator", "compound-interest-calculator", "tax-calculator"],
  "sip-calculator": ["compound-interest-calculator", "ppf-calculator", "roi-calculator"],
  "compound-interest-calculator": ["sip-calculator", "simple-interest-calculator", "roi-calculator"],
  "simple-interest-calculator": ["compound-interest-calculator", "loan-emi-calculator", "roi-calculator"],
  "roi-calculator": ["compound-interest-calculator", "sip-calculator", "profit-margin-calculator"],
  "salary-calculator": ["tax-calculator", "gst-calculator", "work-hours-calculator"],
  "tax-calculator": ["salary-calculator", "gst-calculator", "roi-calculator"],
  "gst-calculator": ["tax-calculator", "discount-calculator", "profit-margin-calculator"],
  "discount-calculator": ["gst-calculator", "profit-margin-calculator", "percentage-calculator"],
  "profit-margin-calculator": ["break-even-calculator", "roi-calculator", "discount-calculator"],
  "break-even-calculator": ["profit-margin-calculator", "roi-calculator", "discount-calculator"],
  "tip-calculator": ["discount-calculator", "percentage-calculator", "gst-calculator"],
  "ppf-calculator": ["sip-calculator", "compound-interest-calculator", "roi-calculator"],
  "percentage-calculator": ["discount-calculator", "gst-calculator", "statistics-calculator"],
  "gpa-calculator": ["target-gpa-calculator", "cgpa-percentage-calculator", "final-grade-calculator"],
  "grade-calculator": ["required-grade-calculator", "gpa-calculator", "final-grade-calculator"],
  "final-grade-calculator": ["required-grade-calculator", "gpa-calculator", "marks-percentage-calculator"],
  "cgpa-percentage-calculator": ["gpa-calculator", "target-gpa-calculator", "marks-percentage-calculator"],
  "marks-percentage-calculator": ["gpa-calculator", "attendance-calculator", "required-grade-calculator"],
  "attendance-calculator": ["marks-percentage-calculator", "gpa-calculator", "study-timer"],
  "ielts-band-calculator": ["sat-score-calculator", "marks-percentage-calculator", "study-timer"],
  "sat-score-calculator": ["ielts-band-calculator", "target-gpa-calculator", "study-timer"],
  "study-timer": ["marks-percentage-calculator", "attendance-calculator", "target-gpa-calculator"],
  "target-gpa-calculator": ["gpa-calculator", "required-grade-calculator", "cgpa-percentage-calculator"],
  "required-grade-calculator": ["final-grade-calculator", "gpa-calculator", "marks-percentage-calculator"],
  "age-calculator": ["date-difference-calculator", "countdown-calculator", "pregnancy-due-date"],
  "date-difference-calculator": ["age-calculator", "countdown-calculator", "work-hours-calculator"],
  "countdown-calculator": ["date-difference-calculator", "age-calculator", "work-hours-calculator"],
  "password-generator": ["random-number-generator", "base64-encoder", "word-counter"],
  "fuel-cost-calculator": ["ev-charging-calculator", "discount-calculator", "percentage-calculator"],
  "ev-charging-calculator": ["fuel-cost-calculator", "roi-calculator", "percentage-calculator"],
  "quadratic-calculator": ["pythagorean-calculator", "statistics-calculator", "scientific-calculator"],
  "statistics-calculator": ["percentage-calculator", "scientific-calculator", "quadratic-calculator"],
  "scientific-calculator": ["quadratic-calculator", "statistics-calculator", "percentage-calculator"],
};

export function CrossCalcRecommendations({ slug }: { slug?: string }) {
  const links = slug ? CROSS_LINKS[slug] : [];
  if (!links?.length) return null;
  const calcs = links.map(s => getCalcBySlug(s)).filter((c): c is CalculatorConfig => !!c).slice(0, 3);
  if (!calcs.length) return null;
  return (
    <div className="side-card" style={{ borderRadius:"var(--r-xl)", overflow:"hidden" }}>
      <div style={{ padding:"12px 16px", background:"var(--surf2)", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:8 }}>
        <Lightbulb size={14} style={{ color:"var(--text-accent)" }} />
        <span style={{ fontSize:12, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", color:"var(--text-accent)" }}>Recommended Next</span>
      </div>
      {calcs.map(c => (
        <Link key={c.id} href={`/calculator/${c.slug}`} className="side-item" style={{ gap:10, display:"flex", padding:12, alignItems:"center", textDecoration:"none", borderBottom:"1px solid var(--border)" }}>
          <span style={{ fontSize:16, width:28, textAlign:"center", flexShrink:0 }}>{c.icon}</span>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{c.name}</div>
            <div style={{ fontSize:11, color:"var(--text3)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.desc}</div>
          </div>
          <ArrowRight size={13} style={{ color:"var(--text3)", flexShrink:0 }} />
        </Link>
      ))}
    </div>
  );
}
