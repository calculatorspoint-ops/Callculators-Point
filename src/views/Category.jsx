'use client';
import { useParams } from "next/navigation";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BarChart2, Zap, BookOpen, TrendingUp, Star } from "lucide-react";
import { CATEGORIES, BY_CATEGORY, POPULAR, ALL_CALCULATORS } from "@/data/calculatorConfigs";

/* ─── Per-category rich content ─────────────────────────── */
const CAT_CONTENT = {
  finance: {
    heroBg: "linear-gradient(150deg, #0a0e25 0%, #1a2554 50%, #2f4cb5 100%)",
    intro: "Whether you're planning a home loan, growing your savings through SIP, or understanding your tax liability — our finance calculators are designed to give you complete clarity on your money.",
    ecosystemId: "finance",
    ecosystemLabel: "Open Finance Suite →",
    features: [
      { icon: "🏦", title: "Loan & EMI Tools", desc: "Calculate monthly installments, amortization schedules, and prepayment impact instantly." },
      { icon: "📈", title: "Investment Growth", desc: "SIP, compound interest, PPF — visualize your wealth building over time with interactive charts." },
      { icon: "🧾", title: "Tax & GST", desc: "Region-aware tax calculations. Auto-detects your country and applies correct GST/VAT/Sales Tax rules." },
      { icon: "💼", title: "Income & Salary", desc: "Monthly, annual, hourly conversion with local tax deductions and net take-home pay." },
    ],
    seoContent: `Finance calculators are among the most searched tools online. Our suite covers everything from simple EMI calculations to complex retirement planning, all with region-aware currency support for 50+ countries including India (INR/GST), Pakistan (PKR/GST), USA (USD/Sales Tax), UK (GBP/VAT), and more.`,
  },
  health: {
    heroBg: "linear-gradient(150deg, #0a0e25 0%, #1a1230 50%, #8b1a4a 100%)",
    intro: "Your health deserves precision. Our health and fitness calculators use medically validated formulas to help you understand your body, plan your nutrition, and achieve your fitness goals.",
    ecosystemId: "fitness",
    ecosystemLabel: "Open Fitness Suite →",
    features: [
      { icon: "⚖️", title: "Body Composition", desc: "BMI, body fat %, and ideal weight using 4 clinical formulas — see where you truly stand." },
      { icon: "🔥", title: "Calorie & Nutrition", desc: "TDEE, BMR, macros — complete nutrition planning for any goal from weight loss to muscle gain." },
      { icon: "❤️", title: "Heart & Training", desc: "5 heart rate training zones using the Karvonen formula for optimal cardio and fat burning." },
      { icon: "🌸", title: "Women's Health", desc: "Period tracking, ovulation prediction, and fertile window — 100% private, runs offline." },
    ],
    seoContent: `Health calculators require medical-grade accuracy. All our formulas are based on peer-reviewed research including Mifflin-St Jeor for BMR, WHO guidelines for BMI classification, and the US Navy method for body fat percentage.`,
  },
  math: {
    heroBg: "linear-gradient(150deg, #0a0e25 0%, #160e3a 50%, #4c2a8a 100%)",
    intro: "From quick percentage calculations to solving quadratic equations — our math tools provide step-by-step solutions with visual graphs, making complex calculations understandable for everyone.",
    ecosystemId: null,
    ecosystemLabel: null,
    features: [
      { icon: "💯", title: "Percentage Tools", desc: "6 simultaneous modes: X% of Y, what %, increase, decrease, change, and reverse." },
      { icon: "🔬", title: "Scientific Calculator", desc: "Full expression parser with trig, logarithms, exponents, and calculation history." },
      { icon: "📌", title: "Algebra & Geometry", desc: "Quadratic formula, Pythagorean theorem, area calculator with visual diagrams." },
      { icon: "📉", title: "Statistics", desc: "Mean, median, mode, standard deviation, IQR, quartiles, and histogram visualization." },
    ],
    seoContent: `Math calculators serve students, teachers, engineers, and professionals. Our percentage calculator alone handles 6 simultaneous calculation modes — far beyond what Calculator.net offers.`,
  },
  education: {
    heroBg: "linear-gradient(150deg, #0a0e25 0%, #1a1510 50%, #7a3010 100%)",
    intro: "From calculating your current semester GPA to planning what you need on your final exam — our education tools are designed to help students at every stage of their academic journey.",
    ecosystemId: "education",
    ecosystemLabel: "Open Education Suite →",
    features: [
      { icon: "📚", title: "GPA Planning", desc: "Calculate current GPA, simulate future semesters, and see exactly what it takes to hit Dean's List." },
      { icon: "📅", title: "Attendance Tracker", desc: "Know exactly how many classes you can miss while staying above your university's minimum threshold." },
      { icon: "🌍", title: "International Exams", desc: "IELTS band calculator and SAT score predictor with university eligibility comparison." },
      { icon: "⏱️", title: "Study Productivity", desc: "Pomodoro study timer with streak tracking and focus analytics to optimize your sessions." },
    ],
    seoContent: `Education calculators are used by millions of students worldwide. Our GPA calculator supports all major grading scales, while our IELTS calculator uses official rounding rules for precise band score prediction.`,
  },
  converters: {
    heroBg: "linear-gradient(150deg, #0a0e25 0%, #0a2820 50%, #065f46 100%)",
    intro: "Instant unit conversion across all common measurement systems. All converters update in real-time — type in any field and all others update instantly.",
    ecosystemId: null,
    ecosystemLabel: null,
    features: [
      { icon: "📏", title: "Length & Distance", desc: "9 units from millimeters to nautical miles, with both metric and imperial coverage." },
      { icon: "⚖️", title: "Weight & Mass", desc: "8 units including stone, carat, and tonne — all converting simultaneously." },
      { icon: "🌡️", title: "Temperature", desc: "Bidirectional Celsius/Fahrenheit/Kelvin — type any field, all update instantly." },
      { icon: "💾", title: "Data Storage", desc: "Bytes to Petabytes with precise binary and decimal unit support." },
    ],
    seoContent: `Unit converters are the most frequently searched tools on the internet. Our converters are bidirectional and real-time — every field updates simultaneously as you type.`,
  },
  everyday: {
    heroBg: "linear-gradient(150deg, #0a0e25 0%, #1a1200 50%, #7a4210 100%)",
    intro: "The everyday tools you need, built with precision. Age calculation, date differences, fuel costs, password generation — all fast, free, and private.",
    ecosystemId: null,
    ecosystemLabel: null,
    features: [
      { icon: "🎂", title: "Date & Age Tools", desc: "Exact age with zodiac sign, date differences with business-day mode, and live countdowns." },
      { icon: "⛽", title: "Travel & Transport", desc: "Fuel cost calculator with trip splitting, plus EV charging time and cost estimator." },
      { icon: "🔐", title: "Security Tools", desc: "Cryptographically secure password generator with entropy score and crack time estimate." },
      { icon: "📝", title: "Text & Data Tools", desc: "Word counter, Base64 encoder/decoder, Roman numeral converter and more." },
    ],
    seoContent: `Everyday calculators serve a wide range of daily needs. Our age calculator goes beyond simple birth date math — it shows zodiac sign, exact days/hours/minutes alive, and a live countdown to your next birthday.`,
  },
};

function FeatureCard({ icon, title, desc }) {
  return (
    <div style={{
      padding: 16, background: "var(--surface)", border: "1.5px solid var(--border)",
      borderRadius: "var(--r-xl)", display: "flex", gap: 12, alignItems: "flex-start",
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: "var(--r-md)", background: "var(--surf2)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>{desc}</div>
      </div>
    </div>
  );
}

export default function Category() {
  const { catId } = useParams();
  const cat = CATEGORIES.find(c => c.id === catId);
  const calcs = BY_CATEGORY[catId] || [];
  const content = CAT_CONTENT[catId] || {};

  if (!cat) { redirect('/calculators'); return null; }

  const popular = calcs.filter(c => c.popular);
  const newCalcs = calcs.filter(c => c.isNew);
  const rest = calcs.filter(c => !c.popular && !c.isNew);

  return (
    <>
      {/* SEO metadata handled by generateMetadata in app/category/[catId]/page.tsx */}

      {/* Hero */}
      <div style={{ background: content.heroBg || `linear-gradient(135deg, #0f172a, ${cat.color})`, padding: "48px 20px 44px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 50% 70% at 90% 0%, rgba(255,255,255,.05) 0%, transparent 60%)" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <nav style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 12, color: "rgba(255,255,255,.5)", marginBottom: 16 }}>
            <Link href="/" style={{ color: "rgba(255,255,255,.5)" }}>Home</Link>
            <span>/</span>
            <Link href="/calculators" style={{ color: "rgba(255,255,255,.5)" }}>Calculators</Link>
            <span>/</span>
            <span style={{ color: "rgba(255,255,255,.9)", fontWeight: 600 }}>{cat.name}</span>
          </nav>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "var(--r-xl)", flexShrink: 0,
              background: "rgba(255,255,255,.12)", border: "1.5px solid rgba(255,255,255,.2)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30,
            }}>{cat.icon}</div>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px",
                background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.15)",
                borderRadius: 100, fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.7)",
                marginBottom: 12,
              }}>
                <Zap size={11} /> {calcs.length} Free Tools · Instant Results
              </div>
              <h1 style={{
                fontFamily: "var(--font-hd)", fontSize: "clamp(1.6rem,4vw,2.4rem)",
                fontWeight: 900, color: "#fff", letterSpacing: "-.03em", marginBottom: 10,
              }}>
                Free Online {cat.name} Calculators
              </h1>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,.65)", lineHeight: 1.7, maxWidth: 580, marginBottom: 20 }}>
                {content.intro || cat.desc}
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {content.ecosystemId && (
                  <Link href={`/ecosystem/${content.ecosystemId}`} className="btn-ghost" style={{ fontSize: 13 }}>
                    <TrendingUp size={14} /> {content.ecosystemLabel}
                  </Link>
                )}
                <Link href="/calculators" style={{
                  display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px",
                  background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)",
                  borderRadius: "var(--r-lg)", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.8)",
                }}>All Categories</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="cat-stats-row">
        {[
          { n: calcs.length + "+", l: "Tools" },
          { n: popular.length, l: "Popular" },
          { n: newCalcs.length, l: "New" },
          { n: "100%", l: "Free" },
        ].map(s => (
          <div key={s.l} className="cat-stats-item" style={{ flex: 1, padding: "12px 8px", textAlign: "center", borderRight: "1px solid var(--border)", minWidth: 0 }}>
            <div className="cat-stats-val" style={{ fontFamily: "var(--font-hd)", fontSize: 18, fontWeight: 800, color: cat.color }}>{s.n}</div>
            <div className="cat-stats-lbl" style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px 64px" }}>
        <div className="category-page-layout">

          {/* Main content */}
          <div>
            {/* Popular */}
            {popular.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <Star size={16} style={{ color: "#f59e0b" }} />
                  <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text)" }}>Most Popular</h2>
                </div>
                <div className="cat-calcs-grid">
                  {popular.map(c => (
                    <Link href={`/calculator/${c.slug}`} className="cat-calc-card" style={{ borderColor: `${cat.color}30` }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.boxShadow = `0 4px 16px ${cat.color}25`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = `${cat.color}30`; e.currentTarget.style.boxShadow = "var(--sh1)"; e.currentTarget.style.transform = "none"; }}>
                      <div style={{
                        width: 42, height: 42, borderRadius: "var(--r-md)", background: cat.bg,
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
                      }}>{c.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: "var(--text3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.desc}</div>
                        <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                          <span className="badge badge-green">Popular</span>
                          {c.hasChart && <span className="badge badge-blue">Charts</span>}
                        </div>
                      </div>
                      <ArrowRight size={13} style={{ color: "var(--text3)", flexShrink: 0 }} />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* New */}
            {newCalcs.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 16 }}>🆕</span>
                  <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text)" }}>Recently Added</h2>
                </div>
                <div className="cat-calcs-grid">
                  {newCalcs.map(c => (
                    <Link href={`/calculator/${c.slug}`} className="cat-calc-card"
                      onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.transform = "translateY(-1px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}>
                      <span style={{ fontSize: 22, width: 36, textAlign: "center", flexShrink: 0 }}>{c.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", gap: 5, alignItems: "center", overflow: "hidden" }}>
                          <span style={{ fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                          <span className="badge badge-red" style={{ flexShrink: 0 }}>New</span>
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.desc}</div>
                      </div>
                      <ArrowRight size={13} style={{ color: "var(--text3)", flexShrink: 0 }} />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Rest */}
            {rest.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text)", marginBottom: 14 }}>All {cat.name} Tools</h2>
                <div className="cat-calcs-grid">
                  {rest.map(c => (
                    <Link href={`/calculator/${c.slug}`} className="cat-calc-card"
                      onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}>
                      <span style={{ fontSize: 22, width: 36, textAlign: "center", flexShrink: 0 }}>{c.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: "var(--text3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.desc}</div>
                      </div>
                      <ArrowRight size={13} style={{ color: "var(--text3)", flexShrink: 0 }} />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Why use this category */}
            {content.features && (
              <div style={{
                background: "var(--surface)", border: "1.5px solid var(--border)",
                borderRadius: "var(--r-2xl)", padding: 24, marginBottom: 24,
              }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text)", marginBottom: 16 }}>
                  Why Our {cat.name} Tools?
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                  {content.features.map(f => <FeatureCard key={f.title} {...f} />)}
                </div>
                {content.seoContent && (
                  <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.8, marginTop: 16, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                    {content.seoContent}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {content.ecosystemId && (
              <Link href={`/ecosystem/${content.ecosystemId}`} style={{
                display: "block", padding: 20, textDecoration: "none",
                background: `linear-gradient(135deg, ${cat.color}, ${cat.color}cc)`,
                borderRadius: "var(--r-xl)", boxShadow: `0 4px 20px ${cat.color}40`,
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{cat.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
                  {cat.name} Suite
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", marginBottom: 14, lineHeight: 1.6 }}>
                  All tools interconnected with guided journeys and educational content.
                </div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px",
                  background: "rgba(255,255,255,.2)", border: "1px solid rgba(255,255,255,.25)",
                  borderRadius: 100, fontSize: 12, fontWeight: 700, color: "#fff",
                }}>
                  Explore Suite <ArrowRight size={12} />
                </div>
              </Link>
            )}

            {/* Other categories */}
            <div style={{
              background: "var(--surface)", border: "1.5px solid var(--border)",
              borderRadius: "var(--r-xl)", overflow: "hidden",
            }}>
              <div style={{
                padding: "12px 16px", background: "var(--surf2)", borderBottom: "1px solid var(--border)",
                fontSize: 12, fontWeight: 800, color: "var(--text2)", textTransform: "uppercase", letterSpacing: ".06em",
              }}>Other Categories</div>
              {CATEGORIES.filter(c => c.id !== catId).map(c => (
                <Link href={`/category/${c.id}`} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
                  borderBottom: "1px solid var(--bord2)", textDecoration: "none", color: "var(--text)",
                  transition: "background .1s", fontSize: 13, fontWeight: 600,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--brand-l)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                  <span>{c.icon}</span> {c.name}
                  <ArrowRight size={12} style={{ marginLeft: "auto", color: "var(--text3)" }} />
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
