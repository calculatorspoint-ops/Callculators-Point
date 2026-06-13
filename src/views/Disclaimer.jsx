
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

const LAST_UPDATED = "June 6, 2026";
const S = ({ title, icon, color, bg, children }) => (
  <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--r-xl)", padding:"22px 24px", boxShadow:"var(--sh1)", marginBottom:16 }}>
    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
      <div style={{ width:40, height:40, borderRadius:"var(--r-lg)", background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{icon}</div>
      <h2 style={{ fontFamily:"var(--font-hd)", fontSize:"1.05rem", fontWeight:800, color:color||"var(--text)", letterSpacing:"-.02em" }}>{title}</h2>
    </div>
    {children}
  </div>
);
const P = ({ children }) => <p style={{ fontSize:14, color:"var(--text2)", lineHeight:1.8, marginBottom:8 }}>{children}</p>;
const Li = ({ children }) => <li style={{ fontSize:14, color:"var(--text2)", lineHeight:1.8, marginBottom:6 }}>{children}</li>;
const Ul = ({ children }) => <ul style={{ paddingLeft:20, marginBottom:0 }}>{children}</ul>;

export default function Disclaimer() {
  return (
    <>
      

      <div className="page-hero">
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:44, marginBottom:14 }}>⚠️</div>
          <h1>Disclaimer</h1>
          <p>Important information about the accuracy and appropriate use of Calculators Point calculators.</p>
          <p style={{ fontSize:12, color:"rgba(255,255,255,.4)", marginTop:12 }}>Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <div className="page-wrap" style={{ maxWidth:840 }}>

        {/* Main warning box */}
        <div style={{ padding:"20px 22px", background:"var(--amber-l)", border:"2px solid #fde68a", borderRadius:"var(--r-xl)", marginBottom:32, display:"flex", gap:16 }}>
          <AlertTriangle size={24} style={{ color:"var(--amber)", flexShrink:0, marginTop:2 }}/>
          <div>
            <p style={{ fontSize:15, fontWeight:700, color:"var(--amber)", marginBottom:6 }}>General Disclaimer</p>
            <p style={{ fontSize:13, color:"#78350f", lineHeight:1.7 }}>
              The information and results provided by Calculators Point are for <strong>general informational and educational purposes only</strong>. 
              They do not constitute professional financial, medical, legal, or any other type of professional advice. 
              Always consult a qualified professional before making important decisions.
            </p>
          </div>
        </div>

        {/* Section-by-section disclaimers */}
        <S title="Financial Calculator Disclaimer" icon="💰" color="#1d4ed8" bg="#eff6ff">
          <P>Our financial calculators (EMI, SIP, compound interest, tax, salary, ROI, etc.) use standard, publicly documented formulas. However:</P>
          <Ul>
            <Li>Actual loan EMIs may differ based on your lender's specific rounding methods, processing fees, or insurance additions</Li>
            <Li>Investment returns are projections based on assumed rates — actual market returns vary and are not guaranteed</Li>
            <Li>Tax calculations use officially published slabs but cannot account for all individual deductions, exemptions, or local variations</Li>
            <Li>Currency exchange rates shown are indicative only — actual rates from banks and exchanges will differ</Li>
            <Li>PPF/savings projections assume the stated interest rate remains constant — rates may change</Li>
          </Ul>
          <P style={{ marginTop:10 }}>
            <strong>You should not rely solely on our calculators for major financial decisions</strong> such as taking a loan, making investments, or filing taxes. 
            Please consult a Certified Financial Planner (CFP), Chartered Accountant, or other qualified financial professional.
          </P>
        </S>

        <S title="Health & Medical Calculator Disclaimer" icon="❤️" color="#dc2626" bg="#fef2f2">
          <P>Our health calculators (BMI, calories, BMR, body fat, ideal weight, heart rate, pregnancy, etc.) are <strong>screening and estimation tools only</strong>, not medical devices or diagnostic tools.</P>
          <Ul>
            <Li>BMI does not account for muscle mass, bone density, age, or fat distribution — it is a population-level screening tool, not an individual diagnostic</Li>
            <Li>Calorie and macro recommendations are general estimates — individual needs vary significantly</Li>
            <Li>Body fat calculations have a margin of error of ±3-4% and may be less accurate for very lean or very obese individuals</Li>
            <Li>Heart rate zone calculations are estimates — actual zones vary by individual fitness level</Li>
            <Li>Pregnancy due date calculations are estimates — only ~5% of babies are born on their exact due date</Li>
            <Li>One rep max estimates are mathematical approximations — actual 1RM testing should be done safely</Li>
          </Ul>
          <P style={{ marginTop:10 }}>
            <strong>Our health calculators are NOT a substitute for professional medical advice, diagnosis, or treatment.</strong> 
            Always seek the advice of a physician, dietitian, or other qualified health provider with any questions you may have regarding a medical condition or health goal.
          </P>
        </S>

        <S title="Mathematical & Educational Calculator Disclaimer" icon="📐" color="#7c3aed" bg="#f5f3ff">
          <P>Our mathematical calculators (statistics, quadratic formula, area, etc.) use standard mathematical algorithms and are suitable for educational and reference use. However:</P>
          <Ul>
            <Li>Statistical calculations assume the data entered represents the complete dataset (population statistics, not samples unless noted)</Li>
            <Li>Numerical precision may be limited by floating-point arithmetic in JavaScript</Li>
            <Li>Results should be verified for critical academic or professional work</Li>
          </Ul>
        </S>

        <S title="Unit Converter Disclaimer" icon="🔄" color="#065f46" bg="#f0fdf4">
          <P>Our unit converters use accepted conversion factors from international standards (SI, imperial). However:</P>
          <Ul>
            <Li>Some conversions (e.g., currency exchange) are based on approximate indicative rates</Li>
            <Li>Temperature conversions are mathematically exact</Li>
            <Li>Precision is limited to 8 decimal places in display</Li>
          </Ul>
        </S>

        <S title="No Professional Relationship" icon="🤝" color="#b45309" bg="#fffbeb">
          <P>Use of Calculators Point does not create any professional-client relationship between you and Calculators Point. We are not:</P>
          <Ul>
            <Li>Financial advisors or planners</Li>
            <Li>Doctors, dietitians, or medical professionals</Li>
            <Li>Lawyers or legal advisors</Li>
            <Li>Tax consultants or chartered accountants</Li>
          </Ul>
          <P style={{ marginTop:10 }}>
            The formulas used are based on publicly available, peer-reviewed sources and official government publications. 
            However, application of any formula to your specific situation requires professional judgment.
          </P>
        </S>

        <S title="Third-Party Content" icon="🔗" color="#0891b2" bg="#ecfeff">
          <P>Calculators Point may link to third-party resources for reference. We are not responsible for the accuracy, content, or availability of third-party websites and disclaim all liability for damages arising from your use of linked resources.</P>
        </S>

        <S title="Advertising Disclosure" icon="📢" color="#64748b" bg="#f1f5f9">
          <P>Calculators Point may be supported through advertising partnerships, including Google AdSense or similar platforms, after approval. In accordance with FTC guidelines and applicable advertising regulations:</P>
          <Ul>
            <Li>All advertisements are clearly labeled with "Advertisement"</Li>
            <Li>Advertisers have no influence over our calculator formulas, results, or editorial content</Li>
            <Li>We do not accept sponsored content disguised as calculator results or insights</Li>
            <Li>Our financial calculators do not recommend any specific financial products or providers</Li>
          </Ul>
        </S>

        {/* Final */}
        <div style={{ padding:"20px 22px", background:"var(--surf2)", border:"1px solid var(--border)", borderRadius:"var(--r-xl)", marginTop:8 }}>
          <P>By using Calculators Point, you acknowledge that you have read and understood this disclaimer and agree to use the calculator results as one input among many in your decision-making process — not as a sole determinant.</P>
          <P>If you believe any calculator result is inaccurate, please <Link href="/contact" style={{ color:"var(--brand)" }}>contact us</Link> with details, or email <a href="mailto:contact@calculatorspoint.com" style={{ color:"var(--brand)" }}>contact@calculatorspoint.com</a> (Pakistan). We are committed to maintaining accuracy and will investigate all reported issues promptly.</P>
        </div>

        <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginTop:28, paddingTop:24, borderTop:"1px solid var(--border)" }}>
          <Link href="/privacy-policy"   className="btn-outline">Privacy Policy</Link>
          <Link href="/terms-of-service" className="btn-outline">Terms of Service</Link>
          <Link href="/contact"          className="btn-primary" style={{ fontSize:13 }}>Report an Issue</Link>
        </div>
      </div>
    </>
  );
}
