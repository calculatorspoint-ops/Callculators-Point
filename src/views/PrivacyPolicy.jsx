
import Link from "next/link";

const LAST_UPDATED = "June 13, 2026";

const Section = ({ id, title, children }) => (
  <div id={id} style={{ marginBottom:32 }}>
    <h2 style={{ fontFamily:"var(--font-hd)", fontSize:"1.15rem", fontWeight:800, color:"var(--text)", marginBottom:12, letterSpacing:"-.02em", paddingTop:8 }}>{title}</h2>
    {children}
  </div>
);

const P = ({ children }) => <p style={{ fontSize:14, color:"var(--text2)", lineHeight:1.8, marginBottom:10 }}>{children}</p>;
const Li = ({ children }) => <li style={{ fontSize:14, color:"var(--text2)", lineHeight:1.8, marginBottom:4 }}>{children}</li>;
const Ul = ({ children }) => <ul style={{ paddingLeft:20, marginBottom:12 }}>{children}</ul>;

const TABLE_OF_CONTENTS = [
  ["#overview",          "Overview"],
  ["#data-collection",   "Information We Collect"],
  ["#data-use",          "How We Use Information"],
  ["#data-share",        "Information Sharing"],
  ["#cookies",           "Cookies & Local Storage"],
  ["#analytics",         "Analytics"],
  ["#advertising",       "Advertising (Google AdSense)"],
  ["#security",          "Data Security"],
  ["#childrens",         "Children's Privacy"],
  ["#rights",            "Your Rights"],
  ["#do-not-sell",       "Do Not Sell (CCPA)"],
  ["#changes",           "Changes to This Policy"],
  ["#contact-pp",        "Contact Us"],
];

export default function PrivacyPolicy() {
  return (
    <>
      

      <div className="page-hero">
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:44, marginBottom:14 }}>🔒</div>
          <h1>Privacy Policy</h1>
          <p>Your privacy is our priority. Calculators Point is designed to collect as little data as possible.</p>
          <p style={{ fontSize:12, color:"rgba(255,255,255,.4)", marginTop:12 }}>Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <div className="page-wrap" style={{ maxWidth:900 }}>
        <div style={{ display:"grid", gridTemplateColumns:"220px 1fr", gap:28, alignItems:"start" }} id="pp-grid">
          <style>{`@media(max-width:768px){#pp-grid{grid-template-columns:1fr!important} .pp-toc{display:none!important}}`}</style>

          {/* Table of contents */}
          <div className="pp-toc" style={{ position:"sticky", top:"calc(var(--nav-h) + 20px)", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--r-xl)", padding:"18px 16px", boxShadow:"var(--sh1)" }}>
            <p style={{ fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:".07em", color:"var(--text3)", marginBottom:12 }}>Contents</p>
            {TABLE_OF_CONTENTS.map(([href, label]) => (
              <a key={href} href={href}
                style={{ display:"block", fontSize:12, color:"var(--text2)", padding:"5px 0", borderBottom:"1px solid var(--bord2)", textDecoration:"none", transition:"color .15s" }}
                onMouseEnter={e=>e.currentTarget.style.color="var(--brand)"}
                onMouseLeave={e=>e.currentTarget.style.color="var(--text2)"}>
                {label}
              </a>
            ))}
          </div>

          {/* Main content */}
          <div>
            {/* Quick summary */}
            <div style={{ padding:"16px 18px", background:"var(--green-l)", border:"1px solid var(--green-ll)", borderRadius:"var(--r-xl)", marginBottom:32 }}>
              <p style={{ fontSize:13, fontWeight:700, color:"var(--green)", marginBottom:8 }}>🎯 The Short Version</p>
              <ul style={{ paddingLeft:18, margin:0 }}>
                {[
                  "All calculations run entirely in your browser — we never see your inputs",
                  "We use Google Analytics for anonymous page view statistics only",
                  "We may display ads through Google AdSense or similar advertising partners after approval",
                  "We use localStorage to save your preferences (theme, currency, recent tools)",
                  "We do not sell, rent, or share your data with third parties",
                  "No account creation required — ever",
                ].map(item => (
                  <li key={item} style={{ fontSize:13, color:"var(--green)", lineHeight:1.7, marginBottom:3 }}>{item}</li>
                ))}
              </ul>
            </div>

            <Section id="overview" title="1. Overview">
              <P>Calculators Point ("we," "us," or "our") operates the website at calculatorspoint.com (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</P>
              <P>Please read this policy carefully. If you disagree with its terms, please discontinue use of the Service.</P>
            </Section>

            <Section id="data-collection" title="2. Information We Collect">
              <p style={{ fontSize:14, fontWeight:700, color:"var(--text)", marginBottom:8 }}>2.1 Information You Do NOT Provide</p>
              <P>
                <strong>Calculator inputs are never transmitted to our servers.</strong> When you enter values into any Calculators Point calculator — loan amounts, health metrics, dates, or any other data — those values are processed entirely within your web browser using JavaScript. They are never sent to Calculators Point or any third party.
              </P>

              <p style={{ fontSize:14, fontWeight:700, color:"var(--text)", marginBottom:8, marginTop:16 }}>2.2 Automatically Collected Information</p>
              <P>When you visit our website, we may automatically receive:</P>
              <Ul>
                <Li><strong>IP address</strong> — used for country-level currency auto-detection via ipapi.co (see Section 5)</Li>
                <Li><strong>Browser type and version</strong> — for debugging and compatibility</Li>
                <Li><strong>Operating system</strong> — for technical optimization</Li>
                <Li><strong>Pages visited and time spent</strong> — via Google Analytics (anonymized)</Li>
                <Li><strong>Referring URLs</strong> — to understand how visitors find us</Li>
                <Li><strong>Device type</strong> (mobile/tablet/desktop) — for responsive design improvement</Li>
              </Ul>

              <p style={{ fontSize:14, fontWeight:700, color:"var(--text)", marginBottom:8, marginTop:16 }}>2.3 Information You Voluntarily Provide</p>
              <P>If you submit our contact form, we collect:</P>
              <Ul>
                <Li>Your name and email address</Li>
                <Li>The message content you provide</Li>
              </Ul>
              <P>This information is used only to respond to your inquiry.</P>
            </Section>

            <Section id="data-use" title="3. How We Use Information">
              <P>We use the information we collect to:</P>
              <Ul>
                <Li>Operate, maintain, and improve the Calculators Point website</Li>
                <Li>Understand which calculators are most used and where improvements are needed</Li>
                <Li>Detect and fix technical issues and errors</Li>
                <Li>Respond to contact form submissions</Li>
                <Li>Comply with legal obligations</Li>
                <Li>Auto-detect your region to pre-select an appropriate currency</Li>
              </Ul>
              <P><strong>We do not use your data for profiling, targeted advertising based on calculator usage, or any form of automated decision-making.</strong></P>
            </Section>

            <Section id="data-share" title="4. Information Sharing">
              <P>We do not sell, trade, or rent your personal information to third parties. We may share information only in the following circumstances:</P>
              <Ul>
                <Li><strong>Service Providers:</strong> Google Analytics (analytics), Google AdSense (advertising). These providers have their own privacy policies.</Li>
                <Li><strong>Legal Requirements:</strong> If required by law, court order, or governmental authority.</Li>
                <Li><strong>Business Transfers:</strong> In the event of a merger or acquisition, user data may be transferred with full privacy protections maintained.</Li>
              </Ul>
            </Section>

            <Section id="cookies" title="5. Cookies & Local Storage">
              <p style={{ fontSize:14, fontWeight:700, color:"var(--text)", marginBottom:8 }}>5.1 Cookies</p>
              <P>We use minimal cookies:</P>
              <div style={{ overflowX:"auto", marginBottom:14 }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                  <thead><tr style={{ background:"var(--surf2)" }}>
                    {["Cookie","Purpose","Duration","Type"].map(h=><th key={h} style={{ padding:"8px 12px", textAlign:"left", border:"1px solid var(--border)", fontWeight:700, color:"var(--text)" }}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {[
                      ["_ga", "Google Analytics visitor tracking", "2 years", "Analytics"],
                      ["_gid", "Google Analytics session tracking", "24 hours", "Analytics"],
                      ["_gat", "Google Analytics request throttle", "1 minute", "Analytics"],
                    ].map(([name, purpose, duration, type]) => (
                      <tr key={name}><td style={{ padding:"8px 12px", border:"1px solid var(--border)", color:"var(--text2)" }}><code>{name}</code></td><td style={{ padding:"8px 12px", border:"1px solid var(--border)", color:"var(--text2)" }}>{purpose}</td><td style={{ padding:"8px 12px", border:"1px solid var(--border)", color:"var(--text2)" }}>{duration}</td><td style={{ padding:"8px 12px", border:"1px solid var(--border)", color:"var(--text2)" }}>{type}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p style={{ fontSize:14, fontWeight:700, color:"var(--text)", marginBottom:8 }}>5.2 Local Storage</p>
              <P>We use your browser's localStorage to save your preferences without cookies:</P>
              <Ul>
                <Li><strong>Theme preference</strong> (light/dark mode)</Li>
                <Li><strong>Currency preference</strong> (your selected currency)</Li>
                <Li><strong>Recently used calculators</strong> (for the "Recently Used" homepage section)</Li>
                <Li><strong>Saved/favorited calculators</strong></Li>
              </Ul>
              <P>This data never leaves your device and can be cleared by clearing your browser's site data.</P>
            </Section>

            <Section id="analytics" title="6. Analytics">
              <P>We use Google Analytics to understand how visitors use Calculators Point. Google Analytics collects anonymized data about page views, session duration, and user flow. We have configured Google Analytics with:</P>
              <Ul>
                <Li>IP anonymization enabled</Li>
                <Li>Data retention set to 14 months</Li>
                <Li>No demographic or interest reporting</Li>
                <Li>No cross-site tracking</Li>
              </Ul>
              <P>You can opt out of Google Analytics by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color:"var(--brand)" }}>Google Analytics Opt-out Browser Add-on</a>.</P>
            </Section>

            <Section id="advertising" title="7. Advertising">
              <P>Calculators Point may display advertisements through Google AdSense or similar advertising partners. If and when ads are active, we serve non-personalized ads by default that do not use cookies for ad personalization.</P>
              <P>If Google AdSense is active, Google may use cookies to serve ads based on your visit to our site and other sites on the internet. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color:"var(--brand)" }}>Google's Ad Settings</a>.</P>
              <P><strong>Advertising Disclosure:</strong> Any advertisements displayed will be clearly labeled and will never influence our calculator results, formulas, or editorial content.</P>
            </Section>

            <Section id="security" title="8. Data Security">
              <P>We implement industry-standard security measures including:</P>
              <Ul>
                <Li>HTTPS encryption for all data in transit (enforced via HSTS)</Li>
                <Li>Content Security Policy (CSP) headers to prevent XSS attacks</Li>
                <Li>No storage of calculator inputs on servers (nothing to breach)</Li>
                <Li>Regular security reviews and dependency updates</Li>
              </Ul>
              <P>No method of transmission over the Internet is 100% secure. However, since your calculation inputs never leave your browser, the primary security concern for your calculator data is the security of your own device.</P>
            </Section>

            <Section id="childrens" title="9. Children's Privacy">
              <P>Calculators Point is not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent and believe your child has provided us with personal information, please contact us and we will delete it immediately.</P>
            </Section>

            <Section id="rights" title="10. Your Rights">
              <P>Depending on your jurisdiction, you may have the right to:</P>
              <Ul>
                <Li><strong>Access</strong> any personal data we hold about you</Li>
                <Li><strong>Rectify</strong> inaccurate personal data</Li>
                <Li><strong>Delete</strong> your personal data ("right to be forgotten")</Li>
                <Li><strong>Restrict</strong> processing of your personal data</Li>
                <Li><strong>Object</strong> to processing of your personal data</Li>
                <Li><strong>Data portability</strong> — receive your data in a portable format</Li>
              </Ul>
              <P>To exercise any of these rights, contact us at the details in Section 12. For localStorage data, you can clear it directly in your browser settings (Settings → Privacy → Clear Site Data).</P>
            </Section>

            <Section id="do-not-sell" title="11. Do Not Sell My Personal Information (CCPA)">
              <P>Calculators Point does <strong>not sell personal information</strong> to third parties. We do not receive money or other consideration in exchange for your personal data.</P>
              <P>However, if you are a California resident, you may have rights under the California Consumer Privacy Act (CCPA), including the right to opt out of certain data sharing with advertising platforms:</P>
              <Ul>
                <Li><strong>Google Analytics:</strong> Click "Necessary Only" in the cookie banner, or install the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand)' }}>Google Analytics Opt-Out Browser Add-on</a>.</Li>
                <Li><strong>Google AdSense (future):</strong> Visit <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand)' }}>Google Ad Settings</a> to opt out of personalized advertising.</Li>
                <Li><strong>Firebase:</strong> Rating data (thumbs up/down) is stored anonymously without any identifier. No personal data is associated.</Li>
              </Ul>
              <P>To exercise your rights or for any CCPA-related requests, contact us at <a href="mailto:contact@calculatorspoint.com" style={{ color: 'var(--brand)' }}>contact@calculatorspoint.com</a> with the subject line "CCPA Request".</P>
            </Section>

            <Section id="changes" title="12. Changes to This Policy">
              <P>We may update this Privacy Policy periodically. We will notify you of significant changes by updating the "Last Updated" date at the top of this page. We encourage you to review this policy regularly.</P>
              <P>Continued use of Calculators Point after changes are posted constitutes your acceptance of the revised policy.</P>
            </Section>

            <Section id="contact-pp" title="12. Contact Us">
              <P>If you have questions, concerns, or requests regarding this Privacy Policy, please contact us:</P>
              <P><strong>Email:</strong> <a href="mailto:contact@calculatorspoint.com" style={{ color:"var(--brand)" }}>contact@calculatorspoint.com</a></P>
              <P><strong>Website:</strong> <Link href="/contact" style={{ color:"var(--brand)" }}>calculatorspoint.com/contact</Link></P>
              <P><strong>Operator:</strong> Calculators Point, Pakistan</P>
              <P>For GDPR-related inquiries, please include "GDPR Request" in your subject line. We aim to respond within 48 business hours.</P>
            </Section>
          </div>
        </div>
      </div>
    </>
  );
}
