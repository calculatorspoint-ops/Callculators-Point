
import { Link } from "react-router-dom";

const LAST_UPDATED = "January 1, 2025";
const S = ({ id, n, title, children }) => (
  <div id={id} style={{ marginBottom:32 }}>
    <h2 style={{ fontFamily:"var(--font-hd)", fontSize:"1.15rem", fontWeight:800, color:"var(--text)", marginBottom:12, letterSpacing:"-.02em" }}>{n}. {title}</h2>
    {children}
  </div>
);
const P = ({ children }) => <p style={{ fontSize:14, color:"var(--text2)", lineHeight:1.8, marginBottom:10 }}>{children}</p>;
const Li = ({ children }) => <li style={{ fontSize:14, color:"var(--text2)", lineHeight:1.8, marginBottom:6 }}>{children}</li>;
const Ul = ({ children }) => <ul style={{ paddingLeft:20, marginBottom:12 }}>{children}</ul>;

export default function TermsOfService() {
  return (
    <>
      

      <div className="page-hero">
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:44, marginBottom:14 }}>📄</div>
          <h1>Terms of Service</h1>
          <p>Please read these terms carefully before using Calculators Point.</p>
          <p style={{ fontSize:12, color:"rgba(255,255,255,.4)", marginTop:12 }}>Last updated: {LAST_UPDATED} · Effective: {LAST_UPDATED}</p>
        </div>
      </div>

      <div className="page-wrap" style={{ maxWidth:840 }}>
        {/* Agreement box */}
        <div style={{ padding:"16px 18px", background:"var(--brand-l)", border:"1px solid var(--brand-ll)", borderRadius:"var(--r-xl)", marginBottom:32 }}>
          <p style={{ fontSize:13, color:"var(--brand)", fontWeight:600, lineHeight:1.7 }}>
            By accessing or using Calculators Point (calculatorspoint.com), you agree to be bound by these Terms of Service and our{" "}
            <Link to="/privacy-policy" style={{ color:"var(--brand)", fontWeight:700 }}>Privacy Policy</Link>. 
            If you do not agree, please do not use our website.
          </p>
        </div>

        <S id="acceptance" n="1" title="Acceptance of Terms">
          <P>These Terms of Service ("Terms") govern your use of the Calculators Point website located at calculatorspoint.com ("Service"). By using the Service, you affirm that you are at least 13 years of age and capable of entering into this agreement.</P>
          <P>We reserve the right to update these Terms at any time. Continued use after changes constitutes acceptance of the revised Terms.</P>
        </S>

        <S id="description" n="2" title="Description of Service">
          <P>Calculators Point provides a free, browser-based calculation platform offering 200+ calculators across multiple categories including finance, health, mathematics, education, unit conversions, and everyday utilities.</P>
          <P>The Service is provided free of charge, supported by advertising. We reserve the right to modify, suspend, or discontinue any part of the Service at any time without notice.</P>
        </S>

        <S id="permitted" n="3" title="Permitted Use">
          <P>You may use Calculators Point for:</P>
          <Ul>
            <Li>Personal, educational, and informational calculations</Li>
            <Li>Professional reference and quick estimates</Li>
            <Li>Sharing calculator links with colleagues, students, or clients</Li>
            <Li>Embedding calculator links (not the site itself) in your content</Li>
          </Ul>
        </S>

        <S id="prohibited" n="4" title="Prohibited Use">
          <P>You may NOT use Calculators Point to:</P>
          <Ul>
            <Li>Scrape, crawl, or systematically download our content or data</Li>
            <Li>Use automated tools to access the Service in ways that could damage or overburden our servers</Li>
            <Li>Frame or mirror the Calculators Point website without written permission</Li>
            <Li>Reverse engineer, decompile, or attempt to extract source code</Li>
            <Li>Use the Service for any illegal purpose or in violation of any applicable laws</Li>
            <Li>Attempt to circumvent security measures or access restricted areas</Li>
            <Li>Reproduce our calculators, formulas, or interface design in competing products</Li>
            <Li>Represent Calculators Point results as output from your own proprietary tool</Li>
          </Ul>
        </S>

        <S id="accuracy" n="5" title="Accuracy & Disclaimer of Warranties">
          <P>While we strive for accuracy, <strong>Calculators Point provides calculators for informational and educational purposes only</strong>. Results should not be relied upon as the sole basis for financial, medical, legal, or any other professional decisions.</P>
          <Ul>
            <Li><strong>Financial calculators</strong> use standard formulas and may not reflect your specific lender's terms, fees, or rounding methods</Li>
            <Li><strong>Health calculators</strong> are screening tools only and not medical advice or diagnosis</Li>
            <Li><strong>Tax calculators</strong> use publicly available tax slabs but may not account for individual deductions, exemptions, or local variations</Li>
            <Li><strong>Currency conversion rates</strong> are indicative and may differ from actual bank or exchange rates</Li>
          </Ul>
          <P>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.</P>
          <P><strong>Always consult qualified professionals — financial advisors, doctors, lawyers, or tax consultants — before making important decisions based on calculator results.</strong></P>
        </S>

        <S id="liability" n="6" title="Limitation of Liability">
          <P>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, Calculators Point SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO:</P>
          <Ul>
            <Li>Your use of or inability to use the Service</Li>
            <Li>Errors, inaccuracies, or omissions in calculator results</Li>
            <Li>Decisions made based on calculator outputs</Li>
            <Li>Service interruptions, bugs, or technical issues</Li>
            <Li>Unauthorized access to or alteration of your data</Li>
          </Ul>
          <P>In jurisdictions that do not allow the exclusion of certain warranties or limitations of liability, our liability is limited to the maximum extent permitted by law.</P>
        </S>

        <S id="ip" n="7" title="Intellectual Property">
          <P>All content on Calculators Point — including but not limited to text, graphics, logos, calculator interfaces, code, and design — is the property of Calculators Point and is protected by applicable intellectual property laws.</P>
          <P>You are granted a limited, non-exclusive, non-transferable license to access and use the Service for personal, non-commercial purposes. This license does not include:</P>
          <Ul>
            <Li>Reproducing or distributing any part of the Service</Li>
            <Li>Creating derivative works based on our calculators</Li>
            <Li>Commercial use without written permission</Li>
          </Ul>
        </S>

        <S id="advertising" n="8" title="Advertising">
          <P>Calculators Point displays advertisements via Google AdSense to fund the free Service. By using Calculators Point, you acknowledge and accept:</P>
          <Ul>
            <Li>Advertisements may appear on pages alongside calculator content</Li>
            <Li>Advertisers do not influence calculator results, formulas, or editorial content</Li>
            <Li>All ads are clearly labeled as "Advertisement"</Li>
            <Li>Use of ad-blocking software is permitted but may affect our ability to provide the free Service</Li>
          </Ul>
        </S>

        <S id="privacy" n="9" title="Privacy">
          <P>Your use of Calculators Point is also governed by our <Link to="/privacy-policy" style={{ color:"var(--brand)" }}>Privacy Policy</Link>, which is incorporated into these Terms by reference. The Privacy Policy explains how we collect, use, and protect your information.</P>
        </S>

        <S id="links" n="10" title="Third-Party Links">
          <P>Calculators Point may contain links to third-party websites. These links are provided for convenience only. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of third-party sites. We encourage you to review the privacy policy of any site you visit.</P>
        </S>

        <S id="termination" n="11" title="Termination">
          <P>We reserve the right to terminate or restrict your access to the Service at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, third parties, or for any other reason.</P>
        </S>

        <S id="governing" n="12" title="Governing Law">
          <P>These Terms shall be governed by and construed in accordance with applicable laws. Any dispute arising under these Terms shall be subject to the exclusive jurisdiction of the competent courts.</P>
          <P>If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect.</P>
        </S>

        <S id="contact-tos" n="13" title="Contact Us">
          <P>If you have questions about these Terms of Service, please contact us via our <Link to="/contact" style={{ color:"var(--brand)" }}>Contact Page</Link>.</P>
        </S>

        {/* Navigation */}
        <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginTop:32, paddingTop:24, borderTop:"1px solid var(--border)" }}>
          <Link to="/privacy-policy" className="btn-outline">Privacy Policy</Link>
          <Link to="/disclaimer"     className="btn-outline">Disclaimer</Link>
          <Link to="/contact"        className="btn-primary" style={{ fontSize:13 }}>Contact Us</Link>
        </div>
      </div>
    </>
  );
}
