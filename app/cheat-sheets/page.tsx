/**
 * app/cheat-sheets/page.tsx
 *
 * STATUS: PUBLISHED — all three cheat sheets now have real, substantive content.
 *
 * SEO:
 *  - Indexable (removed noindex)
 *  - Canonical: https://calculatorspoint.com/cheat-sheets
 *  - FAQPage schema for FAQ section
 *  - H1 + H2 heading hierarchy
 *  - Internal links to related calculators throughout
 *
 * Content delivered:
 *  1. Finance Formula Sheet — EMI, compound interest, SIP, ROI formulas
 *  2. Student Grading Pack — GPA scales, CGPA, MDCAT/ECAT, conversions
 *  3. Health & Fitness Metrics — BMI, BMR, body fat, macros, heart rate
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/config/site';

export const metadata: Metadata = {
  title: 'Free Formula Cheat Sheets — Finance, GPA & Health | Calculators Point',
  description:
    'Free printable formula reference sheets for finance (EMI, SIP, compound interest), student GPA calculations, and health metrics (BMI, BMR, body fat). Quick-reference guides with worked examples.',
  alternates: { canonical: `${SITE_URL}/cheat-sheets` },
  openGraph: {
    title: 'Free Formula Cheat Sheets — Finance, GPA & Health | Calculators Point',
    description:
      'Free printable formula reference sheets for finance (EMI, SIP), GPA calculations, and health metrics (BMI, BMR). Bookmark or print as PDF.',
    url: `${SITE_URL}/cheat-sheets`,
    type: 'website',
    siteName: 'Calculators Point',
    images: [{
      url: `${SITE_URL}/api/og?title=${encodeURIComponent('Formula Cheat Sheets')}&icon=${encodeURIComponent('📋')}&cat=${encodeURIComponent('Reference')}`,
      width: 1200,
      height: 630,
      alt: 'Free Formula Cheat Sheets — Calculators Point',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Formula Cheat Sheets — Finance, GPA & Health | Calculators Point',
    description: 'Quick-reference formula sheets for EMI, SIP, GPA, BMI, and BMR. Free to bookmark or print.',
  },
};

// FAQPage schema
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the EMI formula?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'EMI = P × r × (1+r)^n / ((1+r)^n − 1), where P = principal, r = monthly interest rate (annual rate ÷ 12), n = tenure in months.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is CGPA calculated?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CGPA = Sum of (Grade Points × Credits) / Total Credits attempted. For percentage, most universities use CGPA × 10 (e.g., HEC Pakistan).',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the Mifflin-St Jeor BMR formula?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For men: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) + 5. For women: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) − 161.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I calculate compound interest?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A = P × (1 + r/n)^(n×t), where P = principal, r = annual interest rate, n = compounding frequency per year, t = time in years. For daily compounding, n = 365.',
      },
    },
  ],
};

// BreadcrumbList schema
const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Cheat Sheets', item: `${SITE_URL}/cheat-sheets` },
  ],
};

// ── Shared styles ────────────────────────────────────────────────────────────
const formula = {
  display: 'block',
  background: 'var(--surf2, #f1f5f9)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '10px 14px',
  fontFamily: 'monospace',
  fontSize: '14px',
  color: 'var(--brand)',
  fontWeight: 700,
  margin: '8px 0 12px',
  overflowX: 'auto' as const,
} as const;

const tag = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 10px',
  background: 'var(--brand-l, #eff6ff)',
  border: '1px solid var(--brand-ll, #dbeafe)',
  borderRadius: '100px',
  fontSize: '11px',
  color: 'var(--brand)',
  fontWeight: 700,
  textDecoration: 'none',
} as const;

const cardStyle = {
  background: 'var(--surface)',
  borderRadius: 'var(--r-xl, 16px)',
  padding: '28px 24px',
  border: '1px solid var(--border)',
  boxShadow: 'var(--sh1)',
} as const;

const sectionHead = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '18px',
  borderBottom: '1px solid var(--border)',
  paddingBottom: '12px',
} as const;

export default function CheatSheetsPage() {
  return (
    <>
      {/* JSON-LD schema — server-rendered */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div style={{ maxWidth: 1040, margin: '0 auto', paddingTop: 40, paddingBottom: 80, paddingLeft: 16, paddingRight: 16 }}>

        {/* ── Header ──────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>📋</div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, marginBottom: 14, color: 'var(--text)', letterSpacing: '-.03em' }}>
            Formula Cheat Sheets
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text3)', maxWidth: 580, margin: '0 auto', lineHeight: 1.65 }}>
            Free, printable formula reference guides for finance, academic grading, and health metrics.
            Bookmark this page or print as a PDF for quick reference.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 20 }}>
            <a href="#finance" style={tag}>💰 Finance Formulas</a>
            <a href="#gpa" style={tag}>🎓 GPA & Grades</a>
            <a href="#health" style={tag}>💪 Health Metrics</a>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* ── 1. FINANCE FORMULA SHEET ──────────────────────────── */}
          <div id="finance" style={cardStyle}>
            <div style={sectionHead}>
              <span style={{ fontSize: 28 }}>💰</span>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)' }}>Finance Formula Master Sheet</h2>
            </div>
            <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 20, lineHeight: 1.65 }}>
              The exact mathematical formulas used by banks and financial institutions. All verified against
              standard actuarial and banking practices.
            </p>

            {/* EMI */}
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
              EMI (Equated Monthly Installment)
            </h3>
            <code style={formula}>EMI = P × r × (1+r)^n / ((1+r)^n − 1)</code>
            <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 16, lineHeight: 1.6 }}>
              Where: <strong>P</strong> = Principal loan amount · <strong>r</strong> = Monthly interest rate (Annual Rate ÷ 12 ÷ 100) ·{' '}
              <strong>n</strong> = Loan tenure in months.{' '}
              <em>Example: ₹5,00,000 at 12% p.a. for 60 months → r = 0.01 → EMI = ₹11,122</em>
            </p>

            {/* Compound Interest */}
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
              Compound Interest
            </h3>
            <code style={formula}>A = P × (1 + r/n)^(n×t)</code>
            <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 16, lineHeight: 1.6 }}>
              Where: <strong>P</strong> = Principal · <strong>r</strong> = Annual rate (decimal) · <strong>n</strong> = Compounding frequency/year ·{' '}
              <strong>t</strong> = Time in years. CI = A − P.{' '}
              <em>Daily: n=365 · Monthly: n=12 · Quarterly: n=4 · Annual: n=1</em>
            </p>

            {/* SIP */}
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
              SIP Future Value (Mutual Fund Monthly Investment)
            </h3>
            <code style={formula}>FV = P × [((1 + r)^n − 1) / r] × (1 + r)</code>
            <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 16, lineHeight: 1.6 }}>
              Where: <strong>P</strong> = Monthly SIP amount · <strong>r</strong> = Monthly return rate (Annual ÷ 12) · <strong>n</strong> = Total months.{' '}
              <em>₹5,000/month at 12% for 10 years → ₹11.6 lakh invested → ~₹23.2 lakh corpus</em>
            </p>

            {/* ROI */}
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
              ROI (Return on Investment)
            </h3>
            <code style={formula}>ROI = ((Final Value − Initial Value) / Initial Value) × 100</code>
            <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 20, lineHeight: 1.6 }}>
              <em>Annualised ROI</em> = ((Final/Initial)^(1/years) − 1) × 100 — use this for multi-year comparisons.
            </p>

            {/* Simple Interest */}
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
              Simple Interest
            </h3>
            <code style={formula}>SI = (P × R × T) / 100</code>
            <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 20, lineHeight: 1.6 }}>
              Where: <strong>P</strong> = Principal · <strong>R</strong> = Rate per annum (%) · <strong>T</strong> = Time in years.
              Total Amount = P + SI.
            </p>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginTop: 8 }}>
              <Link href="/calculator/loan-emi-calculator" style={tag}>Try EMI Calculator →</Link>
              <Link href="/calculator/sip-calculator" style={tag}>Try SIP Calculator →</Link>
              <Link href="/calculator/compound-interest-calculator" style={tag}>Try Compound Interest →</Link>
              <Link href="/category/finance" style={tag}>All Finance Calculators →</Link>
            </div>
          </div>

          {/* ── 2. STUDENT GRADING PACK ────────────────────────────── */}
          <div id="gpa" style={cardStyle}>
            <div style={sectionHead}>
              <span style={{ fontSize: 28 }}>🎓</span>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)' }}>Student Grading & GPA Reference Pack</h2>
            </div>
            <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 20, lineHeight: 1.65 }}>
              Complete reference for GPA calculation, grading scales, aggregate formulas, and percentage conversions.
              Covers US 4.0 scale, Pakistani university systems, and MDCAT/ECAT aggregates.
            </p>

            {/* GPA Formula */}
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
              GPA / CGPA (Weighted Average)
            </h3>
            <code style={formula}>CGPA = Σ(Grade Points × Credit Hours) / Σ(Credit Hours)</code>
            <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 16, lineHeight: 1.6 }}>
              <em>Example: Subject A — 4.0 GP × 3 credits, Subject B — 3.0 GP × 2 credits →
              CGPA = (12 + 6) / (3 + 2) = 3.6</em>
            </p>

            {/* 4.0 Scale */}
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
              Standard 4.0 GPA Grade Scale
            </h3>
            <div style={{ overflowX: 'auto' as const, marginBottom: 16 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'var(--surf2)', borderBottom: '2px solid var(--border)' }}>
                    {['Grade', 'Percentage', 'GPA Points', 'Category'].map(h => (
                      <th key={h} style={{ padding: '8px 10px', textAlign: 'left' as const, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap' as const }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['A+', '97–100%', '4.0', 'Outstanding'],
                    ['A', '93–96%', '4.0', 'Excellent'],
                    ['A−', '90–92%', '3.7', 'Excellent'],
                    ['B+', '87–89%', '3.3', 'Very Good'],
                    ['B', '83–86%', '3.0', 'Good'],
                    ['B−', '80–82%', '2.7', 'Good'],
                    ['C+', '77–79%', '2.3', 'Satisfactory'],
                    ['C', '73–76%', '2.0', 'Satisfactory'],
                    ['D', '60–72%', '1.0', 'Passing'],
                    ['F', 'Below 60%', '0.0', 'Fail'],
                  ].map(([grade, pct, gp, cat]) => (
                    <tr key={grade} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '7px 10px', fontWeight: 700, color: 'var(--brand)' }}>{grade}</td>
                      <td style={{ padding: '7px 10px', color: 'var(--text2)' }}>{pct}</td>
                      <td style={{ padding: '7px 10px', fontWeight: 600, color: 'var(--text)' }}>{gp}</td>
                      <td style={{ padding: '7px 10px', color: 'var(--text3)' }}>{cat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CGPA to % */}
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
              CGPA to Percentage Conversions
            </h3>
            <code style={formula}>HEC Pakistan: Percentage = CGPA × 10</code>
            <code style={{ ...formula, marginTop: -4 }}>VTU/Anna University: Percentage = (CGPA − 0.75) × 10</code>
            <code style={{ ...formula, marginTop: -4 }}>Mumbai University: Percentage = (CGPA − 0.5) × 10</code>

            {/* MDCAT */}
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4, marginTop: 16 }}>
              MDCAT Aggregate Formula (Pakistan)
            </h3>
            <code style={formula}>Aggregate = (FSc % × 0.40) + (MDCAT % × 0.50) + (Matric % × 0.10)</code>

            {/* ECAT */}
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
              ECAT Aggregate Formula (Pakistan)
            </h3>
            <code style={formula}>Aggregate = (FSc % × 0.70) + (ECAT % × 0.20) + (Matric % × 0.10)</code>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginTop: 16 }}>
              <Link href="/calculator/gpa-calculator" style={tag}>Try GPA Calculator →</Link>
              <Link href="/calculator/cgpa-percentage-calculator" style={tag}>CGPA to % →</Link>
              <Link href="/calculator/marks-percentage-calculator" style={tag}>Marks % →</Link>
              <Link href="/category/education" style={tag}>All Education Calculators →</Link>
            </div>
          </div>

          {/* ── 3. HEALTH & FITNESS METRICS ────────────────────────── */}
          <div id="health" style={cardStyle}>
            <div style={sectionHead}>
              <span style={{ fontSize: 28 }}>💪</span>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)' }}>Health & Fitness Metrics Reference</h2>
            </div>
            <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 20, lineHeight: 1.65 }}>
              Clinically validated formulas for BMI, BMR, body fat, daily calorie targets, macros, and heart rate zones.
              Used by doctors, personal trainers, and dietitians worldwide.
            </p>

            {/* BMI */}
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
              BMI (Body Mass Index) — WHO Standard
            </h3>
            <code style={formula}>BMI = Weight (kg) / Height² (m²)</code>
            <div style={{ overflowX: 'auto' as const, marginBottom: 16 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'var(--surf2)', borderBottom: '2px solid var(--border)' }}>
                    {['BMI Range', 'Classification', 'Health Risk'].map(h => (
                      <th key={h} style={{ padding: '7px 10px', textAlign: 'left' as const, fontWeight: 700, color: 'var(--text)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Below 18.5', 'Underweight', 'Moderate'],
                    ['18.5 – 24.9', 'Normal weight', 'Low (healthy range)'],
                    ['25.0 – 29.9', 'Overweight', 'Increased'],
                    ['30.0 – 34.9', 'Obese Class I', 'High'],
                    ['35.0 – 39.9', 'Obese Class II', 'Very High'],
                    ['40.0+', 'Obese Class III', 'Extremely High'],
                  ].map(([range, cls, risk]) => (
                    <tr key={range} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '7px 10px', fontWeight: 700, color: 'var(--brand)' }}>{range}</td>
                      <td style={{ padding: '7px 10px', color: 'var(--text)' }}>{cls}</td>
                      <td style={{ padding: '7px 10px', color: 'var(--text3)' }}>{risk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* BMR */}
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
              BMR — Mifflin-St Jeor Formula (Most Accurate)
            </h3>
            <code style={formula}>Men: BMR = (10 × kg) + (6.25 × cm) − (5 × age) + 5</code>
            <code style={{ ...formula, marginTop: -4 }}>Women: BMR = (10 × kg) + (6.25 × cm) − (5 × age) − 161</code>
            <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 16, lineHeight: 1.6 }}>
              BMR = Basal Metabolic Rate (calories burned at complete rest). Multiply by activity factor (TDEE):
              Sedentary ×1.2 · Light ×1.375 · Moderate ×1.55 · Active ×1.725 · Very Active ×1.9
            </p>

            {/* Body Fat — US Navy */}
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
              Body Fat % — US Navy Tape Method
            </h3>
            <code style={formula}>Men: BF% = 86.01 × log10(abdomen − neck) − 70.041 × log10(height) + 36.76</code>
            <code style={{ ...formula, marginTop: -4 }}>Women: BF% = 163.205 × log10(waist+hip−neck) − 97.684 × log10(height) − 78.387</code>
            <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 16, lineHeight: 1.6 }}>
              All measurements in centimetres. Validated by the US Department of Defense.
            </p>

            {/* Macros */}
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
              Macronutrient Targets (Standard Ratio)
            </h3>
            <code style={formula}>Protein: 1.6–2.2g per kg body weight (for muscle building)</code>
            <code style={{ ...formula, marginTop: -4 }}>Fat: 20–35% of total daily calories (1g fat = 9 kcal)</code>
            <code style={{ ...formula, marginTop: -4 }}>Carbs: Remaining calories (1g carb = 4 kcal · 1g protein = 4 kcal)</code>

            {/* Heart Rate */}
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4, marginTop: 16 }}>
              Target Heart Rate — Karvonen Formula
            </h3>
            <code style={formula}>THR = ((HRmax − HRrest) × Intensity%) + HRrest</code>
            <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 16, lineHeight: 1.6 }}>
              Max HR ≈ 220 − age. Zone guide: Fat Burn 50–65% · Cardio 65–80% · Peak 80–90%.
              <em> Example: Age 30, resting HR 60, moderate (65%) → THR = ((190−60) × 0.65) + 60 = 144.5 bpm</em>
            </p>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginTop: 8 }}>
              <Link href="/calculator/bmi-calculator" style={tag}>Try BMI Calculator →</Link>
              <Link href="/calculator/bmr-calculator" style={tag}>Try BMR Calculator →</Link>
              <Link href="/calculator/body-fat-calculator" style={tag}>Body Fat % →</Link>
              <Link href="/calculator/macro-calculator" style={tag}>Macro Calculator →</Link>
              <Link href="/category/health" style={tag}>All Health Calculators →</Link>
            </div>
          </div>

          {/* ── FAQs ─────────────────────────────────────────────── */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
              {[
                {
                  q: 'Are these formulas accurate?',
                  a: 'Yes. All formulas are sourced from academic publications, official regulatory bodies, and internationally recognised standards (WHO, HEC, FBR, US DoD). We cross-check every formula against multiple authoritative sources.',
                },
                {
                  q: 'Can I print these cheat sheets?',
                  a: 'Yes. Use your browser\'s Print function (Ctrl+P / Cmd+P) and select "Save as PDF" for a clean printable version. The page is styled to print cleanly without navigation.',
                },
                {
                  q: 'Will the formulas be updated?',
                  a: 'Yes. Tax slabs (FBR), grading systems, and medical guidelines are updated when official changes are published. Check the last-modified date in the sitemap or footer for the most recent update.',
                },
              ].map(({ q, a }) => (
                <details key={q} style={{ border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 16px' }}>
                  <summary style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', cursor: 'pointer' }}>{q}</summary>
                  <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 10, lineHeight: 1.65 }}>{a}</p>
                </details>
              ))}
            </div>
          </div>

          {/* ── CTA ───────────────────────────────────────────────── */}
          <div style={{
            padding: '28px 24px',
            background: 'linear-gradient(135deg, var(--brand-l, #eff6ff), var(--brand-ll, #dbeafe))',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-xl, 16px)',
            textAlign: 'center' as const,
          }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>🧮</div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--brand)', marginBottom: 8 }}>
              Use the Formula — Instantly
            </h3>
            <p style={{ color: 'var(--text2)', fontSize: 14, maxWidth: 480, margin: '0 auto 16px' }}>
              All formulas on this page are already powering our free calculators. Enter your numbers
              and get instant results with step-by-step breakdowns.
            </p>
            <Link href="/calculators" style={{
              display: 'inline-block',
              padding: '10px 24px',
              background: 'var(--brand)',
              color: '#fff',
              borderRadius: 'var(--r-lg, 12px)',
              fontWeight: 700,
              fontSize: 14,
              textDecoration: 'none',
            }}>
              Browse All Calculators →
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
