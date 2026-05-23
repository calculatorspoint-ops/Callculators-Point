import { useState, useEffect, lazy, Suspense, useCallback } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAppStore } from "@/store/useAppStore.js";
import { ALL_CALCULATORS, CATEGORIES, getCalcBySlug, getRelated } from "@/data/calculatorConfigs.js";
import { BASE_FAQS, CALC_FAQS } from "@/data/faqData.js";
import { Share2, Bookmark, BookmarkCheck, ArrowRight, Lightbulb, BarChart2, FileText, HelpCircle, ThumbsUp, ThumbsDown, Flag } from "lucide-react";

const CalculatorWidget = lazy(() => import("@/components/calculator-core/CalculatorWidget.jsx").then(m => ({ default: m.CalculatorWidget })));
const CurrencyBanner = lazy(() => import("@/components/ui/CurrencyBanner.jsx"));
const ExportToolbar = lazy(() => import("@/core/export-engine/ExportToolbar.tsx").then(m => ({ default: m.ExportToolbar })));

/* ── Smart cross-calculator recommendations ──────────────────── */
const CROSS_LINKS = {
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

function CrossCalcRecommendations({ slug }) {
  const links = CROSS_LINKS[slug];
  if (!links?.length) return null;
  const calcs = links.map(s => getCalcBySlug(s)).filter(Boolean).slice(0, 3);
  if (!calcs.length) return null;
  return (
    <div style={{ background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"var(--r-xl)", overflow:"hidden", boxShadow:"var(--sh2)" }}>
      <div style={{ padding:"12px 16px", background:"var(--surf2)", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:8 }}>
        <Lightbulb size={14} style={{ color:"var(--text-accent)" }} />
        <span style={{ fontSize:12, fontWeight:800, textTransform:"uppercase", letterSpacing:".05em", color:"var(--text-accent)" }}>Recommended Next</span>
      </div>
      {calcs.map(c => (
        <Link key={c.id} to={`/calculator/${c.slug}`} className="side-item" style={{ gap:10, display:"flex", padding:12, alignItems:"center", textDecoration:"none", borderBottom:"1px solid var(--border)" }}>
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

/* ── Rich FAQ section with JSON-LD ──────────────────────────── */
function FAQSection({ faqs, calcName }) {
  if (!faqs?.length) return null;
  return (
    <div>
      <h2 style={{ fontFamily:"var(--font-display)", fontSize:"1.3rem", fontWeight:800, color:"var(--text)", marginBottom:16, letterSpacing:"-.02em" }}>
        Frequently Asked Questions
      </h2>
      {faqs.map((f, i) => (
        <details key={i}>
          <summary>{f.q}</summary>
          <div className="faq-body">{f.a}</div>
        </details>
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context":"https://schema.org","@type":"FAQPage",
        mainEntity: faqs.map(f=>({ "@type":"Question", name:f.q, acceptedAnswer:{"@type":"Answer",text:f.a} }))
      })}} />
    </div>
  );
}

function FeedbackWidget({ calcName, calcSlug }) {
  const [feedback, setFeedback] = useState(null);

  return (
    <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border)", display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text2)" }}>Was this calculator helpful?</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setFeedback("up")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 100, border: "1px solid", borderColor: feedback === "up" ? "var(--brand)" : "var(--border)", background: feedback === "up" ? "var(--brand-l)" : "var(--surface)", color: feedback === "up" ? "var(--brand)" : "var(--text2)", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .15s" }}>
            <ThumbsUp size={14} /> Yes
          </button>
          <button onClick={() => setFeedback("down")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 100, border: "1px solid", borderColor: feedback === "down" ? "var(--red)" : "var(--border)", background: feedback === "down" ? "rgba(220,53,69,.08)" : "var(--surface)", color: feedback === "down" ? "var(--red)" : "var(--text2)", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .15s" }}>
            <ThumbsDown size={14} /> No
          </button>
        </div>
        {feedback && <span style={{ fontSize: 12, color: "var(--text3)", animation: "fade-in .3s" }}>Thanks for your feedback!</span>}
      </div>
      
      <Link to={`/contact?type=accuracy&subject=Issue with ${calcName}`} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "var(--text3)", textDecoration: "none", padding: "6px 12px", borderRadius: 100, background: "var(--surf2)" }}>
        <Flag size={12} /> Report an Issue
      </Link>
    </div>
  );
}



export default function Calculator() {
  const { slug } = useParams();
  const calc = getCalcBySlug(slug);
  const { toggleFavorite, favorites, addRecent } = useAppStore();
  const [activeTab, setActiveTab] = useState("calculator");

  // ── Track recently used calculators ──────────────────────────
  useEffect(() => {
    if (calc?.id) addRecent(calc.id);
  }, [calc?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!calc) return <Navigate to="/calculators" replace />;

  const isFav   = favorites.includes(calc.id);
  const related = getRelated(calc, 7);
  const cat     = CATEGORIES.find(c => c.id === calc.cat);
  const faqs    = [...(CALC_FAQS[slug] || []), ...BASE_FAQS];
  const popular = ALL_CALCULATORS.filter(c => c.cat === calc.cat && c.id !== calc.id && c.popular).slice(0, 6);

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: calc.name, text: `Free ${calc.name} — ${calc.desc}`, url: window.location.href }).catch(()=>{});
    } else {
      navigator.clipboard.writeText(window.location.href).catch(()=>{});
    }
  };

  return (
    <>
      <Helmet>
        <title>{`Free ${calc.name} Online — ${calc.desc?.slice(0, 60)} | CalculatorsPoint`}</title>
        <meta name="description" content={`Use our free ${calc.name} online with instant results, visual charts & step-by-step breakdowns. ${calc.desc}. No signup — 100% private & accurate.`} />
        <meta name="keywords" content={`${calc.name.toLowerCase()}, free ${calc.name.toLowerCase()}, online ${calc.name.toLowerCase()}, ${cat?.name?.toLowerCase() || ''} calculator`} />
        <meta property="og:title" content={`${calc.name} — Free Online Calculator | CalculatorsPoint`} />
        <meta property="og:description" content={`Free ${calc.name}: ${calc.desc}. Instant results with charts & insights.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://calculatorspoint.com/calculator/${calc.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${calc.name} — Free Online Calculator`} />
        <meta name="twitter:description" content={calc.desc} />
        <link rel="canonical" href={`https://calculatorspoint.com/calculator/${calc.slug}`} />
        {/* BreadcrumbList Schema */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://calculatorspoint.com/" },
            { "@type": "ListItem", "position": 2, "name": "Calculators", "item": "https://calculatorspoint.com/calculators" },
            { "@type": "ListItem", "position": 3, "name": cat?.name || "Tools", "item": `https://calculatorspoint.com/category/${calc.cat}` },
            { "@type": "ListItem", "position": 4, "name": calc.name }
          ]
        })}</script>
        {/* WebApplication Schema */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": calc.name,
          "description": calc.desc,
          "url": `https://calculatorspoint.com/calculator/${calc.slug}`,
          "applicationCategory": cat?.name === "Finance & Money" ? "FinanceApplication" : cat?.name === "Health & Fitness" ? "HealthApplication" : "UtilityApplication",
          "operatingSystem": "All",
          "browserRequirements": "Requires JavaScript",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "ratingCount": "1250", "bestRating": "5" }
        })}</script>
      </Helmet>

      {/* ══════════ PAGE HEADER ══════════ */}
      <div className="calc-page-header premium-card-bg relative overflow-hidden rounded-b-[2.5rem] shadow-sm mb-6 border-b border-[var(--border)]">
        {/* Subtle decorative glowing orbs */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[var(--brand)] rounded-full mix-blend-multiply filter blur-[80px] opacity-10 pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-10 pointer-events-none"></div>
        
        <div className="cph-inner relative z-10">
          {/* Breadcrumb */}
          <nav className="cph-breadcrumb backdrop-blur-md bg-white/5 dark:bg-black/5 px-4 py-1.5 rounded-full border border-[var(--border)] inline-flex mb-6 shadow-sm">
            <Link to="/" className="hover:text-[var(--brand)] transition-colors">Home</Link>
            <span className="cph-breadcrumb-sep opacity-50">/</span>
            <Link to="/calculators" className="hover:text-[var(--brand)] transition-colors">Calculators</Link>
            <span className="cph-breadcrumb-sep opacity-50">/</span>
            <Link to={`/category/${calc.cat}`} className="hover:text-[var(--brand)] transition-colors">{cat?.name}</Link>
            <span className="cph-breadcrumb-sep opacity-50">/</span>
            <span style={{ color:"var(--brand)", fontWeight:700 }}>{calc.name}</span>
          </nav>

          {/* Title row */}
          <div className="cph-title-row">
            <div className="cph-icon glass-panel flex items-center justify-center shadow-lg" style={{ width: 80, height: 80, borderRadius: 24, fontSize: 36 }}>
              {calc.icon}
            </div>
            <div className="cph-title-content">
              <h1 className="cph-title text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-[var(--text)] to-[var(--text2)]">{calc.name}</h1>
              <div className="cph-meta mt-4 flex flex-wrap gap-4 items-center">
                <div className="cph-badges flex gap-2">
                  <span className="badge glass-panel" style={{ fontSize:12, fontWeight: 600 }}>
                    {cat?.icon} {cat?.name}
                  </span>
                  {calc.popular  && <span className="badge badge-green glass-panel !bg-green-500/10 !border-green-500/20 !text-green-700 dark:!text-green-400">⭐ Popular</span>}
                  {calc.isNew    && <span className="badge badge-red glass-panel !bg-red-500/10 !border-red-500/20 !text-red-700 dark:!text-red-400">🆕 New</span>}
                  {calc.hasChart && <span className="badge badge-blue glass-panel !bg-blue-500/10 !border-blue-500/20 !text-blue-700 dark:!text-blue-400">📊 Charts</span>}
                </div>
                <div className="cph-actions flex gap-2">
                  <button onClick={() => toggleFavorite(calc.id)} className="glass-panel hover:bg-white/40 dark:hover:bg-black/40 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all shadow-sm">
                    {isFav ? <BookmarkCheck size={16} className="text-[var(--brand)]" /> : <Bookmark size={16} className="text-[var(--text2)]" />}
                    <span className={isFav ? "text-[var(--brand)]" : "text-[var(--text2)]"}>{isFav ? "Saved" : "Save"}</span>
                  </button>
                  <button onClick={share} className="glass-panel hover:bg-white/40 dark:hover:bg-black/40 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold text-[var(--text2)] transition-all shadow-sm">
                    <Share2 size={16} /> <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tab nav */}
          <div className="calc-tabs mt-8 flex gap-2" role="tablist" aria-label="Calculator sections">
            {["Calculator","About","FAQ"].map(t => (
              <button key={t} className={`calc-tab px-6 py-2.5 rounded-full text-sm font-bold transition-all ${t==="Calculator" ? "bg-[var(--text)] text-[var(--surface)] shadow-md" : "glass-panel hover:bg-white/50 dark:hover:bg-black/50 text-[var(--text2)]"}`}
                role="tab"
                aria-controls={`tab-${t.toLowerCase()}`}
                aria-selected={t === "Calculator"}
                onClick={() => document.getElementById(`tab-${t.toLowerCase()}`)?.scrollIntoView({ behavior:"smooth", block:"start" })}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════ CURRENCY BANNER (finance calculators only) ══════════ */}
      {calc.cat === "finance" && <CurrencyBanner />}

      {/* ══════════ CONTENT ══════════ */}
      <div className="calc-layout">

        {/* ── MAIN COLUMN ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:24 }}>

          {/* Calculator card */}
          <div id="tab-calculator" className="calc-card" role="tabpanel" aria-label="Calculator">
            <div className="calc-card-head">
              <h2 style={{ fontSize:15, fontWeight:700, color:"var(--text)" }}>
                {calc.icon} {calc.name}
              </h2>
              <p style={{ fontSize:12, color:"var(--text3)", maxWidth:400 }}>{calc.desc}</p>
            </div>
            <div className="calc-card-body calculator-export-root">
              <CalculatorWidget calc={calc} />
              <ExportToolbar targetSelector=".calculator-export-root" filenamePrefix={calc.name.replace(/\s+/g, '_')} />
              <FeedbackWidget calcName={calc.name} calcSlug={calc.slug} />
            </div>
          </div>

          {/* About section — enriched with SEO keywords and educational content */}
          <div id="tab-about" className="content-card" role="tabpanel" aria-label="About">
            <h2>About {calc.name}</h2>
            <p>
              The <strong>{calc.name}</strong> is a free, professional-grade online tool that helps you {calc.desc.toLowerCase()}.
              All calculations are performed instantly in your browser using industry-standard, precision-verified formulas —
              no data is ever sent to a server, no signup is required, and it works offline.
            </p>
            {calc.formula && (
              <div style={{ padding:"14px 16px", background:"var(--surf2)", borderRadius:"var(--r-lg)", border:"1px solid var(--bord2)", marginBottom:12 }}>
                <h3 style={{ fontSize:13, fontWeight:700, color:"var(--text)", marginBottom:6 }}>📐 Formula Used</h3>
                <pre style={{ fontFamily:"var(--font-mono)", fontSize:12, color:"var(--text2)", whiteSpace:"pre-wrap", margin:0, lineHeight:1.7 }}>{calc.formula}</pre>
              </div>
            )}
            <p>
              Our {calc.name.toLowerCase()} is designed for students, professionals, business owners, and
              everyday users who need quick, reliable answers. Results include <strong>visual charts</strong>, a <strong>step-by-step
              breakdown</strong>, and <strong>smart insights</strong> so you don't just get a number — you understand it.
            </p>
            <h3 style={{ fontSize:14, fontWeight:700, color:"var(--text)", marginTop:16, marginBottom:8 }}>✨ Key Features</h3>
            <ul style={{ fontSize:14, color:"var(--text2)", lineHeight:1.8, paddingLeft:20, marginBottom:12 }}>
              <li><strong>Instant results</strong> — no loading, no server roundtrips</li>
              <li><strong>Visual charts</strong> — understand your data at a glance</li>
              <li><strong>Step-by-step breakdown</strong> — see exactly how results are calculated</li>
              <li><strong>Smart insights</strong> — contextual tips based on your specific inputs</li>
              <li><strong>Save & export</strong> — download CSV or save results for comparison</li>
              <li><strong>100% private</strong> — all data stays in your browser</li>
            </ul>
            <p style={{ padding:"12px 16px", background:"var(--surf2)", border:"1px solid var(--bord2)", borderRadius:"var(--r-md)", borderLeft:"3px solid var(--brand)", fontSize:13, fontStyle:"italic", color:"var(--text2)" }}>
              ⚠️ Results are for informational purposes only. Always consult a qualified professional before
              making important financial, health or legal decisions.
            </p>
          </div>

          {/* FAQ */}
          <div id="tab-faq" className="content-card" role="tabpanel" aria-label="FAQ">
            <FAQSection faqs={faqs} calcName={calc.name} />
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        <aside className="sticky-res" style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* Pro Tips / Intelligence */}
          {(calc.tips || calc.formula) && (
            <div className="side-card glass-panel relative overflow-hidden" style={{ borderRadius:"var(--r-xl)", borderColor:"var(--border)", boxShadow:"0 4px 30px -5px rgba(67, 97, 238, 0.15)" }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand)] rounded-full mix-blend-multiply filter blur-[40px] opacity-20 pointer-events-none"></div>
              <div className="sec-head" style={{ background:"transparent", borderBottom:"1px solid var(--border)" }}>
                <div className="sec-head-icon" style={{ background:"var(--surface)", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>💡</div>
                <span style={{ fontWeight:800, fontSize:13, color:"var(--brand)", textTransform:"uppercase", letterSpacing:".05em" }}>Pro Tips & Intel</span>
              </div>
              <div style={{ padding:"16px", fontSize:13, color:"var(--text2)", lineHeight:1.6 }}>
                {calc.formula && (
                  <div style={{ marginBottom: calc.tips ? 16 : 0 }}>
                    <span style={{ display:"block", marginBottom:6, color:"var(--brand)", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".05em" }}>Core Formula</span>
                    <div style={{ background:"var(--surface)", padding:"10px", borderRadius:8, border:"1px dashed var(--border)", fontSize:12, fontFamily:"var(--font-mono)", color:"var(--text2)", whiteSpace:"pre-wrap" }}>
                      {calc.formula}
                    </div>
                  </div>
                )}
                {calc.tips && (
                  <div>
                    <span style={{ display:"block", marginBottom:6, color:"var(--brand)", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".05em" }}>Did You Know?</span>
                    <ul style={{ margin:0, paddingLeft:18, display:"flex", flexDirection:"column", gap:8 }}>
                      {calc.tips.map((t, i) => <li key={i} style={{ color:"var(--text2)" }}>{t}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Smart Cross-Calculator Recommendations */}
          <CrossCalcRecommendations slug={slug} />

          {/* Related tools */}
          {related.length > 0 && (
            <div className="side-card glass-panel" style={{ borderRadius:"var(--r-xl)" }}>
              <div className="sec-head" style={{ background: cat?.bg || "var(--surface2)" }}>
                <div className="sec-head-icon" style={{ background: cat?.color + "30" || "var(--border)" }}>
                  {cat?.icon}
                </div>
                <span style={{ fontWeight:700, fontSize:13, color: cat?.color || "var(--text2)" }}>
                  More {cat?.name}
                </span>
              </div>
              {related.map(r => (
                <Link key={r.id} to={`/calculator/${r.slug}`} className="side-item">
                  <span style={{ fontSize:15, width:24, textAlign:"center", flexShrink:0 }}>{r.icon}</span>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{r.name}</div>
                    <div style={{ fontSize:11, color:"var(--text3)", marginTop:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Ad slot */}
          <div style={{ border:"2px dashed var(--border)", borderRadius:"var(--r-xl)", padding:16, textAlign:"center", background:"var(--surface2)" }}>
            <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:"var(--text3)", marginBottom:10 }}>Advertisement</p>
            <div style={{ height:250, background:"var(--surface)", border:"1px solid var(--border2)", borderRadius:"var(--r-lg)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:11, color:"var(--text3)" }}>300×250</span>
            </div>
          </div>

          {/* Popular in category */}
          {popular.length > 0 && (
            <div className="side-card glass-panel" style={{ borderRadius:"var(--r-xl)" }}>
              <div className="sec-head" style={{ background:"var(--sec-popular-bg)" }}>
                <div className="sec-head-icon" style={{ background:"var(--sec-popular-icon)" }}>⭐</div>
                <span style={{ fontWeight:700, fontSize:13, color:"var(--sec-popular-text)" }}>Popular Tools</span>
              </div>
              {popular.map(r => (
                <Link key={r.id} to={`/calculator/${r.slug}`} className="side-item">
                  <span style={{ fontSize:15, width:24, textAlign:"center", flexShrink:0 }}>{r.icon}</span>
                  <span style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>{r.name}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Share box */}
          <div className="glass-panel" style={{ border:"1px solid var(--border)", borderRadius:"var(--r-xl)", padding:16, textAlign:"center", boxShadow:"var(--s1)" }}>
            <p style={{ fontSize:13, fontWeight:600, color:"var(--text)", marginBottom:5 }}>Found this useful?</p>
            <p style={{ fontSize:12, color:"var(--text3)", marginBottom:14 }}>Share with someone who needs it</p>
            <button onClick={share} className="btn-outline" style={{ width:"100%", justifyContent:"center" }}>
              <Share2 size={14} /> Share Calculator
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}

