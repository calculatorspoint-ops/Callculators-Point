import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from "react";
import { getLandingBySlug } from "@/data/seoLandingData";
import { getCalcBySlug, CATEGORIES } from "@/data/calculatorConfigs";
import { ArrowRight, ChevronRight, CheckCircle2 } from "lucide-react";

import { CalculatorWidget } from '@/components/calculator-core/CalculatorWidget';
import CurrencyBanner from '@/components/ui/CurrencyBanner';

function Loader() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300, flexDirection: "column", gap: 12 }}>
      <div style={{ width: 28, height: 28, border: "2.5px solid var(--border)", borderTopColor: "var(--brand)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text3)" }}>Loading Calculator...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export default function SEOLandingPage({ slug }) {
  const landing = getLandingBySlug(slug);

  if (!landing) redirect('/calculators'); return null;

  const calc = getCalcBySlug(landing.calcSlug);
  if (!calc) redirect('/calculators'); return null;

  const cat = CATEGORIES.find(c => c.id === calc.cat);

  // Inject prefilled params into URL for the calculator widget
  const prefilledCalc = { ...calc, prefilledParams: landing.prefilledParams };

  return (
    <>
      {/* SEO metadata handled by generateMetadata in the app route */}

      {/* ── Hero Header ── */}
      <div style={{
        background: "linear-gradient(135deg, var(--p900) 0%, var(--brand) 50%, var(--p700) 100%)",
        padding: "48px 20px 40px", textAlign: "center",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          {/* Breadcrumb */}
          <nav style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
            <Link href="/" style={{ fontSize: 12, color: "rgba(255,255,255,.6)", textDecoration: "none" }}>Home</Link>
            <ChevronRight size={12} style={{ color: "rgba(255,255,255,.4)" }} />
            <Link href="/calculators" style={{ fontSize: 12, color: "rgba(255,255,255,.6)", textDecoration: "none" }}>Calculators</Link>
            <ChevronRight size={12} style={{ color: "rgba(255,255,255,.4)" }} />
            <Link href={`/calculator/${calc.slug}`} style={{ fontSize: 12, color: "rgba(255,255,255,.6)", textDecoration: "none" }}>{calc.name}</Link>
            <ChevronRight size={12} style={{ color: "rgba(255,255,255,.4)" }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,.9)", fontWeight: 600 }}>{landing.h1}</span>
          </nav>

          <h1 style={{
            fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 900,
            color: "#fff", lineHeight: 1.2, marginBottom: 14,
            fontFamily: "var(--font-display)", letterSpacing: "-.02em",
          }}>
            {landing.h1}
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,.8)", lineHeight: 1.7, maxWidth: 600, margin: "0 auto 20px" }}>
            {landing.description}
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
            {landing.keywords.slice(0, 3).map(kw => (
              <span key={kw} style={{
                padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 600,
                background: "rgba(255,255,255,.12)", color: "rgba(255,255,255,.75)",
                border: "1px solid rgba(255,255,255,.15)",
              }}>
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Currency Banner (finance only) ── */}
      {calc.cat === "finance" && (
        <Suspense fallback={null}><CurrencyBanner /></Suspense>
      )}

      {/* ── Main Content ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>

        {/* Intro */}
        {landing.content?.intro && (
          <div style={{
            padding: "20px 24px", background: "var(--surface)", border: "1.5px solid var(--border)",
            borderRadius: "var(--r-xl)", marginBottom: 28, fontSize: 15, lineHeight: 1.8,
            color: "var(--text2)", borderLeft: "4px solid var(--brand)",
          }}>
            {landing.content.intro}
          </div>
        )}

        {/* Calculator Widget */}
        <div style={{
          padding: "24px", background: "var(--surface)", border: "1.5px solid var(--border)",
          borderRadius: "var(--r-xl)", boxShadow: "var(--sh2)", marginBottom: 32,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 22 }}>{calc.icon}</span>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", margin: 0 }}>{calc.name}</h2>
              <p style={{ fontSize: 12, color: "var(--text3)", margin: 0 }}>{calc.desc}</p>
            </div>
          </div>
          <Suspense fallback={<Loader />}>
            <CalculatorWidget calc={prefilledCalc} />
          </Suspense>
        </div>

        {/* How It Works */}
        {landing.content?.howItWorks && (
          <div style={{
            padding: "24px", background: "var(--surface)", border: "1.5px solid var(--border)",
            borderRadius: "var(--r-xl)", marginBottom: 28,
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 16, fontFamily: "var(--font-display)" }}>
              How to Use This Calculator
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {landing.content.howItWorks.map((step, i) => (
                <div key={i} style={{
                  display: "flex", gap: 12, alignItems: "flex-start",
                  padding: "12px 14px", background: "var(--surface2)", borderRadius: "var(--r-md)",
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: "var(--brand)", color: "#fff", display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800,
                  }}>
                    {i + 1}
                  </div>
                  <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.6, margin: 0 }}>{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pro Tips */}
        {landing.content?.tips && (
          <div style={{
            padding: "24px", background: "linear-gradient(to bottom, var(--brand-l), var(--surface))",
            border: "1.5px solid var(--border)", borderRadius: "var(--r-xl)", marginBottom: 28,
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 16, fontFamily: "var(--font-display)" }}>
              💡 Expert Tips
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {landing.content.tips.map((tip, i) => (
                <div key={i} style={{
                  display: "flex", gap: 10, alignItems: "flex-start",
                  padding: "10px 14px", background: "var(--surface)", borderRadius: "var(--r-md)",
                  border: "1px solid var(--border)",
                }}>
                  <CheckCircle2 size={16} style={{ color: "var(--brand)", flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, margin: 0 }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        {landing.faq?.length > 0 && (
          <div style={{
            padding: "24px", background: "var(--surface)", border: "1.5px solid var(--border)",
            borderRadius: "var(--r-xl)", marginBottom: 28,
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 16, fontFamily: "var(--font-display)" }}>
              Frequently Asked Questions
            </h2>
            {landing.faq.map((f, i) => (
              <details key={i}>
                <summary>{f.q}</summary>
                <div className="faq-body">{f.a}</div>
              </details>
            ))}
          </div>
        )}

        {/* CTA — Link back to main calculator */}
        <div style={{
          display: "flex", justifyContent: "center", gap: 12, marginTop: 16, marginBottom: 32,
          flexWrap: "wrap",
        }}>
          <Link
            href={`/calculator/${calc.slug}`}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "12px 28px", borderRadius: "var(--r-xl)",
              background: "var(--brand)", color: "#fff", fontWeight: 700, fontSize: 14,
              textDecoration: "none", fontFamily: "var(--font)", boxShadow: "var(--s-brand)",
            }}
          >
            Open Full {calc.name} <ArrowRight size={16} />
          </Link>
          <Link
            href="/calculators"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "12px 28px", borderRadius: "var(--r-xl)",
              background: "var(--surface)", color: "var(--text)", fontWeight: 700, fontSize: 14,
              textDecoration: "none", fontFamily: "var(--font)", border: "1.5px solid var(--border)",
            }}
          >
            Browse All Calculators
          </Link>
        </div>
      </div>
    </>
  );
}
