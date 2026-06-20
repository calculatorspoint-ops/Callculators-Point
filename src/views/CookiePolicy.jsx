'use client';
import { useState } from "react";
import Link from "next/link";

const LAST_UPDATED = "June 6, 2026";

const Section = ({ id, title, children }) => (
  <div id={id} style={{ marginBottom: 32, scrollMarginTop: 80 }}>
    <h2 style={{ fontFamily: "var(--font-hd)", fontSize: "clamp(1rem, 4vw, 1.15rem)", fontWeight: 800, color: "var(--text)", marginBottom: 12, letterSpacing: "-.02em", paddingTop: 8 }}>{title}</h2>
    {children}
  </div>
);

const P = ({ children }) => <p style={{ fontSize: "clamp(13px, 3.5vw, 14px)", color: "var(--text2)", lineHeight: 1.8, marginBottom: 10, overflowWrap: "break-word", wordBreak: "break-word" }}>{children}</p>;
const Li = ({ children }) => <li style={{ fontSize: "clamp(13px, 3.5vw, 14px)", color: "var(--text2)", lineHeight: 1.8, marginBottom: 6, overflowWrap: "break-word", wordBreak: "break-word" }}>{children}</li>;
const Ul = ({ children }) => <ul style={{ paddingLeft: 18, marginBottom: 12 }}>{children}</ul>;

const TABLE_OF_CONTENTS = [
  ["#what-are-cookies",  "What Are Cookies?"],
  ["#cookies-we-use",    "Cookies We Use"],
  ["#local-storage",     "Local Storage"],
  ["#third-party",       "Third-Party Cookies"],
  ["#manage-cookies",    "Managing Cookies"],
  ["#do-not-track",      "Do Not Track"],
  ["#updates",           "Updates to This Policy"],
  ["#contact",           "Contact Us"],
];

function MobileTOC() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: "none" }} className="legal-mobile-toc">
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px", background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: open ? "12px 12px 0 0" : 12, cursor: "pointer", fontSize: 13,
          fontWeight: 700, color: "var(--text)", marginBottom: 0,
        }}
        aria-expanded={open}
      >
        <span>📋 Table of Contents</span>
        <span style={{ fontSize: 18, lineHeight: 1, transition: "transform .2s", transform: open ? "rotate(180deg)" : "none" }}>⌄</span>
      </button>
      {open && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderTop: "none", borderRadius: "0 0 12px 12px", padding: "8px 0", marginBottom: 20 }}>
          {TABLE_OF_CONTENTS.map(([href, label]) => (
            <a
              key={href} href={href}
              onClick={() => setOpen(false)}
              style={{ display: "block", fontSize: 13, color: "var(--text2)", padding: "9px 16px", textDecoration: "none", borderBottom: "1px solid var(--bord2)" }}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

const thStyle = { padding: "8px 10px", textAlign: "left", border: "1px solid var(--border)", fontWeight: 700, color: "var(--text)", background: "var(--surf2)", whiteSpace: "nowrap" };
const tdStyle = { padding: "8px 10px", border: "1px solid var(--border)", color: "var(--text2)", wordBreak: "break-word", minWidth: 60 };

export default function CookiePolicy() {
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          #cp-grid { grid-template-columns: 1fr !important; }
          .cp-toc  { display: none !important; }
          .legal-mobile-toc { display: block !important; }
        }
        @media (max-width: 480px) {
          .legal-table-wrap table { font-size: 12px !important; }
          .legal-table-wrap td, .legal-table-wrap th { padding: 6px 8px !important; }
        }
      `}</style>

      <div className="page-hero">
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 44, marginBottom: 14 }}>🍪</div>
          <h1>Cookie Policy</h1>
          <p>Calculators Point uses minimal cookies. Here is exactly what we set, why, and how to control it.</p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.4)", marginTop: 12 }}>Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <div className="page-wrap" style={{ maxWidth: 900, overflowX: "hidden" }}>

        {/* Mobile TOC (visible ≤768px) */}
        <MobileTOC />

        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 28, alignItems: "start" }} id="cp-grid">

          {/* Desktop TOC */}
          <div className="cp-toc" style={{ position: "sticky", top: "calc(var(--nav-h) + 20px)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "18px 16px", boxShadow: "var(--sh1)" }}>
            <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".07em", color: "var(--text3)", marginBottom: 12 }}>Contents</p>
            {TABLE_OF_CONTENTS.map(([href, label]) => (
              <a key={href} href={href}
                style={{ display: "block", fontSize: 12, color: "var(--text2)", padding: "5px 0", borderBottom: "1px solid var(--bord2)", textDecoration: "none", transition: "color .15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--brand)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--text2)"}>
                {label}
              </a>
            ))}
          </div>

          {/* Main Content */}
          <div style={{ minWidth: 0, overflowX: "hidden" }}>
            {/* Quick Summary */}
            <div style={{ padding: "16px 18px", background: "var(--green-l)", border: "1px solid var(--green-ll)", borderRadius: "var(--r-xl)", marginBottom: 32 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--green)", marginBottom: 8 }}>🎯 The Short Version</p>
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                {[
                  "We only use cookies from Google Analytics and Google AdSense — no tracking of what you calculate",
                  "All calculator inputs stay in your browser — nothing is sent to our servers",
                  "We use localStorage (not cookies) to save your theme and preferences",
                  "You can opt out of Google Analytics and personalized ads at any time",
                  "We do not use any marketing, profiling, or third-party advertising cookies beyond Google AdSense",
                ].map(item => (
                  <li key={item} style={{ fontSize: "clamp(12px, 3.5vw, 13px)", color: "var(--green)", lineHeight: 1.75, marginBottom: 4 }}>{item}</li>
                ))}
              </ul>
            </div>

            <Section id="what-are-cookies" title="1. What Are Cookies?">
              <P>Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work properly, remember your preferences, and provide information to site owners.</P>
              <P>Cookies are not programs and cannot carry viruses. They store simple data like a session ID, visitor ID, or preference setting.</P>
            </Section>

            <Section id="cookies-we-use" title="2. Cookies We Use">
              <P>Calculators Point sets a minimal number of cookies — only through Google Analytics and Google AdSense. We do not set any first-party tracking cookies ourselves.</P>

              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 8, marginTop: 16 }}>2.1 Analytics Cookies (Google Analytics)</p>
              <P>We use Google Analytics to understand anonymous, aggregate traffic patterns — which calculators are most used, where visitors come from, and how the site performs. These cookies do not identify you personally.</P>
              <div className="legal-table-wrap" style={{ overflowX: "auto", marginBottom: 14, WebkitOverflowScrolling: "touch" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr>
                      {["Cookie", "Purpose", "Duration", "Type"].map(h => <th key={h} style={thStyle}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["_ga",  "Distinguishes unique visitors for Google Analytics", "2 years",  "Analytics"],
                      ["_gid", "Distinguishes unique visitors for a single session",  "24 hours", "Analytics"],
                      ["_gat", "Throttles request rate to Google Analytics servers",  "1 minute", "Analytics"],
                    ].map(([name, purpose, duration, type]) => (
                      <tr key={name}>
                        <td style={{ ...tdStyle, whiteSpace: "nowrap" }}><code>{name}</code></td>
                        <td style={tdStyle}>{purpose}</td>
                        <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{duration}</td>
                        <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 8, marginTop: 20 }}>2.2 Advertising Cookies (Google AdSense)</p>
              <P>Calculators Point may display advertising through Google AdSense or similar advertising partners after approval. If active, Google may use cookies to serve ads based on your visit to this site and other sites on the internet. These cookies are controlled entirely by Google.</P>
              <div className="legal-table-wrap" style={{ overflowX: "auto", marginBottom: 14, WebkitOverflowScrolling: "touch" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr>
                      {["Cookie", "Purpose", "Duration", "Type"].map(h => <th key={h} style={thStyle}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["IDE",        "Google DoubleClick — records user actions after viewing or clicking an ad", "1–2 years", "Advertising"],
                      ["test_cookie","Google DoubleClick — checks if the browser supports cookies",               "Session",   "Advertising"],
                      ["DSID",       "Google — identifies a signed-in Google user for ad personalization",        "2 weeks",   "Advertising"],
                    ].map(([name, purpose, duration, type]) => (
                      <tr key={name}>
                        <td style={{ ...tdStyle, whiteSpace: "nowrap" }}><code>{name}</code></td>
                        <td style={tdStyle}>{purpose}</td>
                        <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{duration}</td>
                        <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <P>You can review Google&apos;s full list of advertising cookies at <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand)" }}>Google&apos;s Advertising Policies</a>.</P>
            </Section>

            <Section id="local-storage" title="3. Local Storage (Not Cookies)">
              <P>In addition to cookies, we use your browser&apos;s <strong>localStorage</strong> — a separate, cookie-free mechanism — to save your preferences locally on your device. This data never leaves your device and is never transmitted to any server.</P>
              <Ul>
                <Li><strong>Theme preference</strong> — light or dark mode (key: <code>CalculatorsPoint-v3</code>)</Li>
                <Li><strong>Currency preference</strong> — your selected currency for financial calculators</Li>
                <Li><strong>Recently used calculators</strong> — for the &quot;Recently Used&quot; section on the homepage</Li>
                <Li><strong>Saved/favorited calculators</strong> — calculators you have bookmarked</Li>
              </Ul>
              <P>To clear localStorage data, go to your browser settings → Privacy &amp; Security → Clear Site Data, or use your browser&apos;s developer tools (Application → Local Storage).</P>
            </Section>

            <Section id="third-party" title="4. Third-Party Cookies">
              <P>All cookies on Calculators Point are set by third-party services we use — Google Analytics and Google AdSense. We do not set any advertising or analytics cookies ourselves.</P>
              <Ul>
                <Li><strong>Google Analytics</strong> — <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand)" }}>Google Privacy Policy</a></Li>
                <Li><strong>Google AdSense / DoubleClick</strong> — <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand)" }}>Google Advertising Policies</a></Li>
              </Ul>
              <P>These third parties may use cookies, web beacons, and similar technologies to collect or receive information from our website and elsewhere on the internet and use that information to provide measurement services and target ads. Their data practices are governed by their own privacy policies, which we encourage you to review.</P>
            </Section>

            <Section id="manage-cookies" title="5. Managing & Opting Out of Cookies">
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>5.1 Browser Cookie Controls</p>
              <P>Most browsers allow you to control cookies through their settings. You can:</P>
              <Ul>
                <Li>Block all cookies (note: this may affect site functionality)</Li>
                <Li>Block only third-party cookies</Li>
                <Li>Delete all existing cookies</Li>
                <Li>Set cookies to expire when you close the browser</Li>
              </Ul>
              <P>Browser-specific instructions:</P>
              <Ul>
                <Li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand)" }}>Google Chrome</a></Li>
                <Li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand)" }}>Mozilla Firefox</a></Li>
                <Li><a href="https://support.apple.com/en-us/HT201265" target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand)" }}>Apple Safari</a></Li>
                <Li><a href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand)" }}>Microsoft Edge</a></Li>
              </Ul>

              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 8, marginTop: 16 }}>5.2 Opt Out of Google Analytics</p>
              <P>You can prevent Google Analytics from collecting your data by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand)" }}>Google Analytics Opt-out Browser Add-on</a>.</P>

              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 8, marginTop: 16 }}>5.3 Opt Out of Personalized Google Ads</p>
              <P>You can control whether Google shows you personalized ads by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand)" }}>Google&apos;s Ad Settings</a>. You can also opt out of interest-based advertising through the <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand)" }}>Digital Advertising Alliance opt-out tool</a>.</P>

              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 8, marginTop: 16 }}>5.4 EEA, UK &amp; Switzerland Users</p>
              <P>If you are located in the European Economic Area, United Kingdom, or Switzerland, a consent notice will be presented when you first visit the site in accordance with GDPR requirements. You can change your consent preferences at any time by clearing your browser cookies and refreshing the page.</P>
            </Section>

            <Section id="do-not-track" title="6. Do Not Track">
              <P>Some browsers have a &quot;Do Not Track&quot; (DNT) feature that signals websites not to track you. Calculators Point does not currently respond to DNT signals because there is no consistent industry standard for doing so. However, we respect your privacy and provide the opt-out options listed above.</P>
            </Section>

            <Section id="updates" title="7. Updates to This Policy">
              <P>We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our data practices. When we make significant changes, we will update the &quot;Last updated&quot; date at the top of this page.</P>
              <P>We encourage you to review this page periodically to stay informed about how we use cookies.</P>
            </Section>

            <Section id="contact" title="8. Contact Us">
              <P>If you have questions or concerns about this Cookie Policy or how we use cookies, please contact us through our <Link href="/contact" style={{ color: "var(--brand)" }}>Contact Page</Link>.</P>
              <P>For GDPR-related cookie inquiries, please include &quot;Cookie Policy Request&quot; in your subject line.</P>
            </Section>

            {/* Navigation */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 28, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
              <Link href="/privacy-policy" className="btn-outline">Privacy Policy</Link>
              <Link href="/terms-of-service" className="btn-outline">Terms of Service</Link>
              <Link href="/disclaimer" className="btn-outline">Disclaimer</Link>
              <Link href="/contact" className="btn-primary" style={{ fontSize: 13 }}>Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
