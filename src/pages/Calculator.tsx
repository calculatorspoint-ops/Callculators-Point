import { lazy } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { ALL_CALCULATORS, CATEGORIES, getCalcBySlug, getRelated } from "@/data/calculatorConfigs.js";
import { BASE_FAQS, CALC_FAQS } from "@/data/faqData.js";
import { Share2, Bookmark, BookmarkCheck } from "lucide-react";

import { SEOHead } from "@/components/seo/SEOHead";
import { CrossCalcRecommendations } from "@/components/calculator-core/CrossRecommendations";
import { FAQSection } from "@/components/calculator-core/FAQSection";
import { FeedbackWidget } from "@/components/calculator-core/FeedbackWidget";

const CalculatorWidget = lazy(() => import('@/components/calculator-core/CalculatorWidget').then(m => ({ default: m.CalculatorWidget })));
const CurrencyBanner = lazy(() => import('@/components/ui/CurrencyBanner'));
const ExportToolbar = lazy(() => import("@/core/export-engine/ExportToolbar.tsx").then(m => ({ default: m.ExportToolbar })));

export default function Calculator() {
  const { slug } = useParams();
  const calc = slug ? getCalcBySlug(slug) : null;
  const { toggleFavorite, favorites } = useAppStore();

  if (!calc) return <Navigate to="/calculators" replace />;

  const isFav   = favorites.includes(calc.id);
  const related = getRelated(calc, 7);
  const cat     = CATEGORIES.find(c => c.id === calc.cat);
  const faqs    = [...(slug && (CALC_FAQS as Record<string, { q: string; a: string }[]>)[slug] ? (CALC_FAQS as Record<string, { q: string; a: string }[]>)[slug] : []), ...BASE_FAQS];
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
      <SEOHead calc={calc} catName={cat?.name || "Tools"} />

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

          {/* Section Nav */}
          <div className="calc-tabs mt-8 flex gap-2" aria-label="Calculator sections">
            {["Calculator","About","FAQ"].map(t => (
              <button key={t} className="calc-tab px-6 py-2.5 rounded-full text-sm font-bold transition-all glass-panel hover:bg-white/50 dark:hover:bg-black/50 text-[var(--text2)]"
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
              <div className="calculator-result-zone">
                <CalculatorWidget calc={calc} />
              </div>
              <ExportToolbar targetSelector=".calculator-result-zone" filenamePrefix={calc.name.replace(/\s+/g, '_')} />
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
              everyday users who need quick, reliable answers. 
              {calc.hasChart || calc.hasSteps ? (
                <> Results include {calc.hasChart && <strong>visual charts, </strong>}{calc.hasSteps && <strong>step-by-step breakdowns, </strong>}and <strong>smart insights</strong> so you don't just get a number — you understand it.</>
              ) : (
                <> Results include <strong>smart insights</strong> so you don't just get a number — you understand it.</>
              )}
            </p>
            <h3 style={{ fontSize:14, fontWeight:700, color:"var(--text)", marginTop:16, marginBottom:8 }}>✨ Key Features</h3>
            <ul style={{ fontSize:14, color:"var(--text2)", lineHeight:1.8, paddingLeft:20, marginBottom:12 }}>
              <li><strong>Instant results</strong> — no loading, no server roundtrips</li>
              {calc.hasChart && <li><strong>Visual charts</strong> — understand your data at a glance</li>}
              {calc.hasSteps && <li><strong>Step-by-step breakdown</strong> — see exactly how results are calculated</li>}
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
            <FAQSection faqs={faqs} />
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
