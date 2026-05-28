import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free Calculator Cheat Sheets & PDF Formulas | Calculators Point',
  description: 'Download free printable cheat sheets for finance formulas, student grading metrics, and everyday math. Perfect for students, teachers, and professionals.',
  robots: 'noindex, nofollow',
};

export default function CheatSheetsPage() {
  return (
    <div className="calc-layout" style={{ maxWidth: 1000, margin: '0 auto', paddingTop: 40, paddingBottom: 80 }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>Math & Finance Cheat Sheets</h1>
        <p style={{ fontSize: 18, color: 'var(--text3)', maxWidth: 600, margin: '0 auto' }}>
          Free, beautifully formatted formula reference guides. Bookmark these pages or print them as PDFs for easy reference.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        
        {/* Finance Cheat Sheet */}
        <div style={{ background: 'var(--surf2)', borderRadius: 16, padding: 24, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>💰</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Finance Formula Master Sheet</h2>
          <p style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
            The exact mathematical formulas banks use to calculate your EMI, Compound Interest, SIP returns, and loan amortization. 
          </p>
          <ul style={{ paddingLeft: 20, marginBottom: 24, color: 'var(--text2)', fontSize: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>EMI Formula (Equated Monthly Installment)</li>
            <li>Compound Interest (Daily/Monthly/Annual)</li>
            <li>SIP Future Value & Step-Up</li>
            <li>Real vs Nominal ROI</li>
          </ul>
          <button style={{ width: '100%', padding: '12px', background: 'var(--brand)', color: 'white', borderRadius: 8, fontWeight: 600, border: 'none', cursor: 'pointer', opacity: 0.7 }} disabled>
            View Cheat Sheet (Coming Soon)
          </button>
        </div>

        {/* Student Cheat Sheet */}
        <div style={{ background: 'var(--surf2)', borderRadius: 16, padding: 24, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🎓</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Student Grading Pack</h2>
          <p style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
            A complete reference for GPA calculation, grading scales, aggregate formulas (MDCAT/ECAT), and percentage conversions.
          </p>
          <ul style={{ paddingLeft: 20, marginBottom: 24, color: 'var(--text2)', fontSize: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>4.0 GPA Weighted Scale</li>
            <li>Pakistani University CGPA Matrix</li>
            <li>MDCAT & ECAT Aggregate Formula</li>
            <li>Percentage to Grade conversions</li>
          </ul>
          <button style={{ width: '100%', padding: '12px', background: 'var(--brand)', color: 'white', borderRadius: 8, fontWeight: 600, border: 'none', cursor: 'pointer', opacity: 0.7 }} disabled>
            View Cheat Sheet (Coming Soon)
          </button>
        </div>

        {/* Health Cheat Sheet */}
        <div style={{ background: 'var(--surf2)', borderRadius: 16, padding: 24, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>💪</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Health & Fitness Metrics</h2>
          <p style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
            The clinical formulas used to determine BMR, TDEE, Body Fat Percentage, and daily macro targets.
          </p>
          <ul style={{ paddingLeft: 20, marginBottom: 24, color: 'var(--text2)', fontSize: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>Mifflin-St Jeor BMR Formula</li>
            <li>US Navy Body Fat Method</li>
            <li>Macronutrient Ratios</li>
            <li>Target Heart Rate (Karvonen)</li>
          </ul>
          <button style={{ width: '100%', padding: '12px', background: 'var(--brand)', color: 'white', borderRadius: 8, fontWeight: 600, border: 'none', cursor: 'pointer', opacity: 0.7 }} disabled>
            View Cheat Sheet (Coming Soon)
          </button>
        </div>

      </div>

      <div style={{ marginTop: 60, padding: 30, background: 'var(--brand-l)', borderRadius: 16, textAlign: 'center' }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--brand)', marginBottom: 12 }}>Link to these resources</h3>
        <p style={{ color: 'var(--text2)', fontSize: 14, maxWidth: 600, margin: '0 auto' }}>
          Are you a teacher, blogger, or financial advisor? Feel free to link to these cheat sheets as a free resource for your students and readers. 
        </p>
      </div>
    </div>
  );
}
