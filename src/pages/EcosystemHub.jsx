import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, TrendingUp, BookOpen, Zap, ChevronRight } from "lucide-react";
import { CATEGORIES, BY_CATEGORY, ALL_CALCULATORS } from "@/data/calculatorConfigs.js";

/* ─── Ecosystem definitions ──────────────────────────────── */
const ECOSYSTEMS = {
  education: {
    id: "education",
    name: "Education Calculator Suite",
    tagline: "Your complete academic toolkit — from GPA to IELTS",
    icon: "🎓",
    color: "#c2410c",
    bg: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
    heroBg: "linear-gradient(150deg, #0a0e25 0%, #1a1510 40%, #a83510 100%)",
    description: "Master every academic challenge with our interconnected education calculators. From calculating your current GPA to planning the grades you need for your dream scholarship — everything works together.",
    stats: [{ n: "10+", l: "Tools" }, { n: "5", l: "Universities" }, { n: "GPA & IELTS", l: "Covered" }],
    groups: [
      {
        title: "GPA & Grades",
        icon: "📊",
        tools: ["gpa-calculator", "target-gpa-calculator", "cgpa-percentage-calculator", "final-grade-calculator", "required-grade-calculator", "marks-percentage-calculator"],
      },
      {
        title: "Attendance & Planning",
        icon: "📅",
        tools: ["attendance-calculator", "study-timer"],
      },
      {
        title: "International Exams",
        icon: "🌍",
        tools: ["ielts-band-calculator", "sat-score-calculator"],
      },
    ],
    journeys: [
      { title: "Plan for a scholarship", steps: ["gpa-calculator", "target-gpa-calculator", "required-grade-calculator"] },
      { title: "International study prep", steps: ["ielts-band-calculator", "sat-score-calculator", "cgpa-percentage-calculator"] },
      { title: "Optimize this semester", steps: ["marks-percentage-calculator", "attendance-calculator", "final-grade-calculator"] },
    ],
    faq: [
      { q: "How do I raise my CGPA quickly?", a: "Focus on high-credit courses first. Use our Target GPA Calculator to simulate exactly what grades you need each semester to hit your goal." },
      { q: "What IELTS score do I need for UK universities?", a: "Most UK universities require IELTS 6.0–7.0 overall. Use our IELTS Band Calculator to see your current score and gap to target." },
      { q: "How does the attendance calculator work?", a: "Enter your attended and total classes. The calculator tells you how many more classes you can miss while staying above the minimum threshold (usually 75%)." },
    ],
  },
  finance: {
    id: "finance",
    name: "Finance & Money Suite",
    tagline: "Loans, investments, tax — everything in one place",
    icon: "💰",
    color: "#3451c7",
    bg: "linear-gradient(135deg, #eef0fd 0%, #dde3fb 100%)",
    heroBg: "linear-gradient(150deg, #0a0e25 0%, #1a2554 40%, #2f4cb5 100%)",
    description: "From your monthly EMI to long-term SIP wealth building — our financial calculators are designed to work together, giving you a complete picture of your money.",
    stats: [{ n: "14+", l: "Tools" }, { n: "50+", l: "Countries" }, { n: "EMI to SIP", l: "Covered" }],
    groups: [
      {
        title: "Loans & EMI",
        icon: "🏦",
        tools: ["loan-emi-calculator", "mortgage-calculator", "simple-interest-calculator", "compound-interest-calculator"],
      },
      {
        title: "Investments",
        icon: "📈",
        tools: ["sip-calculator", "ppf-calculator", "roi-calculator", "profit-margin-calculator"],
      },
      {
        title: "Tax & Income",
        icon: "🧾",
        tools: ["tax-calculator", "gst-calculator", "salary-calculator", "discount-calculator"],
      },
    ],
    journeys: [
      { title: "Plan a home loan", steps: ["loan-emi-calculator", "mortgage-calculator", "compound-interest-calculator"] },
      { title: "Build wealth via SIP", steps: ["sip-calculator", "roi-calculator", "ppf-calculator"] },
      { title: "Understand your salary", steps: ["salary-calculator", "tax-calculator", "gst-calculator"] },
    ],
    faq: [
      { q: "What is the difference between EMI and mortgage?", a: "An EMI (Equated Monthly Installment) is a generic term for any loan repayment. A Mortgage specifically refers to a home loan. Both use the same formula." },
      { q: "How does SIP compounding work?", a: "With SIP, you invest a fixed amount monthly. Each installment earns compound returns, so money invested early grows the most." },
    ],
  },
  "women-health": {
    id: "women-health",
    name: "Women's Health Suite",
    tagline: "Period tracking, fertility, and cycle insights — all private",
    icon: "🌸",
    color: "#be185d",
    bg: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)",
    heroBg: "linear-gradient(135deg, #1a0010 0%, #4a0526 40%, #be185d 100%)",
    description: "A complete, private women's health toolkit. Track your period, predict ovulation, understand your fertile window, and get AI-powered cycle insights — all entirely in your browser.",
    stats: [{ n: "5+", l: "Tools" }, { n: "100%", l: "Private" }, { n: "AI", l: "Predictions" }],
    groups: [
      {
        title: "Cycle Tracking",
        icon: "📅",
        tools: ["period-calculator", "pregnancy-due-date"],
      },
    ],
    journeys: [
      { title: "Track your cycle", steps: ["period-calculator"] },
      { title: "Pregnancy planning", steps: ["period-calculator", "pregnancy-due-date"] },
    ],
    faq: [
      { q: "Is my health data private?", a: "Yes, 100%. All calculations run in your browser. No data is ever sent to any server, stored, or shared." },
      { q: "How accurate are cycle predictions?", a: "Accuracy depends on how much data you provide. With 6+ tracked past cycles, predictions can be highly personalized." },
    ],
  },
  fitness: {
    id: "fitness",
    name: "Fitness & Health Suite",
    tagline: "BMI, calories, macros, and training zones — together",
    icon: "💪",
    color: "#dc2626",
    bg: "linear-gradient(135deg, #fef2f2 0%, #fecaca20 100%)",
    heroBg: "linear-gradient(150deg, #0a0e25 0%, #1a1230 40%, #8b1a4a 100%)",
    description: "Build your ultimate fitness profile. Start with BMI, calculate your caloric needs, plan your macros, and discover your optimal heart rate training zones.",
    stats: [{ n: "8+", l: "Tools" }, { n: "3", l: "Formulas" }, { n: "BMI to 1RM", l: "Covered" }],
    groups: [
      {
        title: "Body Composition",
        icon: "⚖️",
        tools: ["bmi-calculator", "body-fat-calculator", "ideal-weight-calculator"],
      },
      {
        title: "Nutrition",
        icon: "🥗",
        tools: ["calorie-calculator", "bmr-calculator", "macro-calculator", "water-intake-calculator"],
      },
      {
        title: "Training",
        icon: "🏋️",
        tools: ["heart-rate-calculator", "one-rep-max-calculator"],
      },
    ],
    journeys: [
      { title: "Start a weight loss journey", steps: ["bmi-calculator", "calorie-calculator", "macro-calculator"] },
      { title: "Build muscle effectively", steps: ["bmr-calculator", "macro-calculator", "one-rep-max-calculator"] },
      { title: "Cardio & endurance", steps: ["heart-rate-calculator", "calorie-calculator", "water-intake-calculator"] },
    ],
    faq: [
      { q: "What should I calculate first?", a: "Start with BMI for a baseline, then use the Calorie Calculator to set your daily target, and finally the Macro Calculator for your protein/carb/fat split." },
      { q: "Which calorie formula is most accurate?", a: "The Mifflin-St Jeor formula is the most clinically validated for most adults. Our BMR Calculator compares both Mifflin and Harris-Benedict so you can see the difference." },
    ],
  },
};

export const ECOSYSTEM_IDS = Object.keys(ECOSYSTEMS);

function JourneyCard({ journey }) {
  const calcs = journey.steps.map(s => ALL_CALCULATORS.find(c => c.slug === s)).filter(Boolean);
  return (
    <div style={{
      background: "var(--surface)", border: "1.5px solid var(--border)",
      borderRadius: "var(--r-xl)", padding: 16, display: "flex", flexDirection: "column", gap: 10,
    }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>
        🎯 {journey.title}
      </div>
      {calcs.map((c, i) => (
        <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
            background: "var(--brand)", color: "#fff", display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800,
          }}>{i + 1}</div>
          <Link to={`/calculator/${c.slug}`} style={{
            flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
            background: "var(--surf2)", border: "1px solid var(--border)", borderRadius: "var(--r-md)",
            fontSize: 13, fontWeight: 600, color: "var(--text)", textDecoration: "none",
            transition: "all .15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--brand)"; e.currentTarget.style.background = "var(--brand-l)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--surf2)"; }}>
            <span>{c.icon}</span> {c.name}
            <ArrowRight size={12} style={{ marginLeft: "auto", color: "var(--text3)" }} />
          </Link>
        </div>
      ))}
    </div>
  );
}

export default function EcosystemHub() {
  const { id } = useParams();
  const eco = ECOSYSTEMS[id];
  if (!eco) return <Navigate to="/calculators" replace />;

  const allEcoCalcs = eco.groups.flatMap(g => g.tools).map(s => ALL_CALCULATORS.find(c => c.slug === s)).filter(Boolean);
  const popularInEco = allEcoCalcs.filter(c => c.popular);

  return (
    <>
      <Helmet>
        <title>{eco.name} — Free Online Tools | CalculatorsPoint</title>
        <meta name="description" content={`${eco.description} Free, instant, 100% private.`} />
        <link rel="canonical" href={`https://calculatorspoint.com/ecosystem/${eco.id}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: eco.name,
          description: eco.description,
          url: `https://calculatorspoint.com/ecosystem/${eco.id}`,
          hasPart: allEcoCalcs.map(c => ({
            "@type": "WebApplication",
            name: c.name,
            url: `https://calculatorspoint.com/calculator/${c.slug}`,
          })),
        })}</script>
      </Helmet>

      {/* Hero */}
      <div style={{ background: eco.heroBg, padding: "52px 20px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 60% 80% at 80% 0%, rgba(255,255,255,.06) 0%, transparent 60%)",
        }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <nav style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 12, color: "rgba(255,255,255,.5)", marginBottom: 20 }}>
            <Link to="/" style={{ color: "rgba(255,255,255,.5)" }}>Home</Link>
            <ChevronRight size={12} />
            <Link to="/calculators" style={{ color: "rgba(255,255,255,.5)" }}>Calculators</Link>
            <ChevronRight size={12} />
            <span style={{ color: "rgba(255,255,255,.9)", fontWeight: 600 }}>{eco.name}</span>
          </nav>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px",
                background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.15)",
                borderRadius: 100, fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.7)",
                marginBottom: 16,
              }}>
                <Zap size={11} /> Calculator Ecosystem · {allEcoCalcs.length}+ Tools
              </div>
              <h1 style={{
                fontFamily: "var(--font-hd)", fontSize: "clamp(1.8rem,4vw,2.8rem)",
                fontWeight: 900, color: "#fff", letterSpacing: "-.03em",
                lineHeight: 1.1, marginBottom: 14,
              }}>
                {eco.name}
              </h1>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,.65)", lineHeight: 1.7, maxWidth: 560, marginBottom: 24 }}>
                {eco.description}
              </p>
              {popularInEco.length > 0 && (
                <Link to={`/calculator/${popularInEco[0].slug}`} className="btn-primary" style={{ gap: 8 }}>
                  {popularInEco[0].icon} Start with {popularInEco[0].name} <ArrowRight size={15} />
                </Link>
              )}
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {eco.stats.map(s => (
                <div key={s.l} style={{
                  background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.15)",
                  borderRadius: "var(--r-lg)", padding: "16px 24px", textAlign: "center", minWidth: 90,
                }}>
                  <div style={{ fontFamily: "var(--font-hd)", fontSize: 24, fontWeight: 900, color: "#fff" }}>{s.n}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", fontWeight: 600, marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 64px" }}>

        {/* Tool groups */}
        {eco.groups.map(group => {
          const tools = group.tools.map(s => ALL_CALCULATORS.find(c => c.slug === s)).filter(Boolean);
          return (
            <div key={group.title} style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 20 }}>{group.icon}</span>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text)" }}>{group.title}</h2>
                <span style={{
                  padding: "2px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700,
                  background: "var(--surf2)", color: "var(--text3)", border: "1px solid var(--border)",
                }}>{tools.length} tools</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
                {tools.map(c => (
                  <Link key={c.id} to={`/calculator/${c.slug}`} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: 14,
                    background: "var(--surface)", border: "1.5px solid var(--border)",
                    borderRadius: "var(--r-xl)", textDecoration: "none", color: "var(--text)",
                    transition: "all .15s", boxShadow: "var(--sh1)",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = eco.color; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--sh3)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--sh1)"; }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: "var(--r-md)", flexShrink: 0,
                      background: eco.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                    }}>{c.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.desc}</div>
                      <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                        {c.popular && <span className="badge badge-green">Popular</span>}
                        {c.isNew && <span className="badge badge-red">New</span>}
                        {c.hasChart && <span className="badge badge-blue">Charts</span>}
                      </div>
                    </div>
                    <ArrowRight size={14} style={{ color: "var(--text3)", flexShrink: 0 }} />
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        {/* Guided journeys */}
        <div style={{
          background: "var(--surface)", border: "1.5px solid var(--border)",
          borderRadius: "var(--r-2xl)", padding: 28, marginBottom: 32,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <TrendingUp size={18} style={{ color: "var(--brand)" }} />
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text)" }}>Guided Journeys</h2>
            <div style={{ fontSize: 13, color: "var(--text3)" }}>— Use these tools in order for best results</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {eco.journeys.map((j, i) => <JourneyCard key={i} journey={j} />)}
          </div>
        </div>

        {/* FAQ */}
        {eco.faq?.length > 0 && (
          <div style={{
            background: "var(--surface)", border: "1.5px solid var(--border)",
            borderRadius: "var(--r-2xl)", padding: 28, marginBottom: 32,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <BookOpen size={18} style={{ color: "var(--brand)" }} />
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text)" }}>Frequently Asked Questions</h2>
            </div>
            {eco.faq.map((f, i) => (
              <details key={i}>
                <summary>{f.q}</summary>
                <div className="faq-body">{f.a}</div>
              </details>
            ))}
          </div>
        )}

        {/* Related ecosystems */}
        <div>
          <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text)", marginBottom: 14 }}>Explore Other Suites</h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {Object.values(ECOSYSTEMS).filter(e => e.id !== id).map(e => (
              <Link key={e.id} to={`/ecosystem/${e.id}`} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
                background: "var(--surface)", border: "1.5px solid var(--border)",
                borderRadius: "var(--r-xl)", textDecoration: "none", color: "var(--text)",
                fontSize: 13, fontWeight: 600, transition: "all .15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = eco.color; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}>
                <span style={{ fontSize: 18 }}>{e.icon}</span> {e.name.split(" ").slice(0, 2).join(" ")}
                <ArrowRight size={12} style={{ color: "var(--text3)" }} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
