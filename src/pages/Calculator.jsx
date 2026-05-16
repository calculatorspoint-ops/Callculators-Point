import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Bookmark, BookmarkCheck, Share2 } from "lucide-react";

import { CalculatorWidget } from "@/components/calculator-core/CalculatorWidget.jsx";
import { ExportToolbar } from "@/core/export-engine/ExportToolbar";
import { CurrencyBanner } from "@/components/ui/CurrencyBanner.jsx";
import { getCalcBySlug, getRelated, CATEGORIES, ALL_CALCULATORS } from "@/data/calculatorConfigs.js";
import { BASE_FAQS, CALC_FAQS } from "@/data/faqData.js";
import { useAppStore } from "@/store/useAppStore.js";

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



export default function Calculator() {
  const { slug } = useParams();
  const calc = getCalcBySlug(slug);
  const { toggleFavorite, favorites } = useAppStore();
  
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
        <title>{`Free ${calc.name} — ${calc.desc?.slice(0, 55)} | CalculatorsPoint`}</title>
        <meta name="description" content={`Use our free ${calc.name} online. ${calc.desc}. No signup required — instant, accurate, and 100% private.`} />
        <meta property="og:title" content={`${calc.name} — Free Online Calculator | CalculatorsPoint`} />
        <meta property="og:description" content={`Free ${calc.name}: ${calc.desc}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://calculatorspoint.com/calculator/${calc.slug}`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${calc.name} — Free Online Calculator`} />
        <meta name="twitter:description" content={calc.desc} />
        <link rel="canonical" href={`https://calculatorspoint.com/calculator/${calc.slug}`} />
      </Helmet>

      {/* ══════════ PAGE HEADER ══════════ */}
      <div className="calc-page-header">
        <div className="cph-inner">
          {/* Breadcrumb */}
          <nav className="cph-breadcrumb">
            <Link to="/">Home</Link>
            <span className="cph-breadcrumb-sep">/</span>
            <Link to="/calculators">Calculators</Link>
            <span className="cph-breadcrumb-sep">/</span>
            <Link to={`/category/${calc.cat}`}>{cat?.name}</Link>
            <span className="cph-breadcrumb-sep">/</span>
            <span style={{ color:"rgba(255,255,255,.9)", fontWeight:600 }}>{calc.name}</span>
          </nav>

          {/* Title row */}
          <div className="cph-title-row">
            <div className="cph-icon">
              {calc.icon}
            </div>
            <div className="cph-title-content">
              <h1 className="cph-title">{calc.name}</h1>
              <div className="cph-meta">
                <div className="cph-badges">
                  <span className="badge" style={{ background:"rgba(255,255,255,.15)", color:"rgba(255,255,255,.85)", border:"1px solid rgba(255,255,255,.2)", fontSize:11 }}>
                    {cat?.icon} {cat?.name}
                  </span>
                  {calc.popular  && <span className="badge badge-green">⭐ Popular</span>}
                  {calc.isNew    && <span className="badge badge-red">🆕 New</span>}
                  {calc.hasChart && <span className="badge badge-blue">📊 Charts</span>}
                </div>
                <div className="cph-actions">
                  <button onClick={() => toggleFavorite(calc.id)} className="cph-action-btn"
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.22)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.12)"}>
                    {isFav ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
                    <span>{isFav ? "Saved" : "Save"}</span>
                  </button>
                  <button onClick={share} className="cph-action-btn">
                    <Share2 size={13} /> <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tab nav */}
          <div className="calc-tabs" role="tablist" aria-label="Calculator sections">
            {["Calculator","About","FAQ"].map(t => (
              <button key={t} className={`calc-tab${t==="Calculator"?" active":""}`}
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
            </div>
          </div>

          {/* About section */}
          <div id="tab-about" className="content-card" role="tabpanel" aria-label="About">
            <h2>About {calc.name}</h2>
            <p>
              The <strong>{calc.name}</strong> is a free, accurate tool that helps you {calc.desc.toLowerCase()}.
              All calculations are performed instantly in your browser using industry-standard formulas —
              no data is ever sent to a server, and no signup is required.
            </p>
            <p>
              Our {calc.name.toLowerCase()} is designed for students, professionals, business owners and
              everyday users who need quick, reliable answers. Results include visual charts, a step-by-step
              breakdown and smart insights so you don't just get a number — you understand it.
            </p>
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
            <div className="side-card" style={{ borderRadius:"var(--r-xl)", background:"linear-gradient(to bottom, #eff6ff, #ffffff)", borderColor:"#bfdbfe", boxShadow:"0 4px 20px -5px rgba(59, 130, 246, 0.15)" }}>
              <div className="sec-head" style={{ background:"transparent", borderBottom:"1px solid rgba(59, 130, 246, 0.1)" }}>
                <div className="sec-head-icon" style={{ background:"#fff", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>💡</div>
                <span style={{ fontWeight:800, fontSize:13, color:"#1d4ed8", textTransform:"uppercase", letterSpacing:".05em" }}>Pro Tips & Intel</span>
              </div>
              <div style={{ padding:"16px", fontSize:13, color:"var(--text2)", lineHeight:1.6 }}>
                {calc.formula && (
                  <div style={{ marginBottom: calc.tips ? 16 : 0 }}>
                    <span style={{ display:"block", marginBottom:6, color:"#2563eb", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".05em" }}>Core Formula</span>
                    <div style={{ background:"#fff", padding:"10px", borderRadius:8, border:"1px dashed #bfdbfe", fontSize:12, fontFamily:"var(--font-mono)", color:"#334155", whiteSpace:"pre-wrap" }}>
                      {calc.formula}
                    </div>
                  </div>
                )}
                {calc.tips && (
                  <div>
                    <span style={{ display:"block", marginBottom:6, color:"#2563eb", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".05em" }}>Did You Know?</span>
                    <ul style={{ margin:0, paddingLeft:18, display:"flex", flexDirection:"column", gap:8 }}>
                      {calc.tips.map((t, i) => <li key={i} style={{ color:"#334155" }}>{t}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Related tools */}
          {related.length > 0 && (
            <div className="side-card" style={{ borderRadius:"var(--r-xl)" }}>
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
            <div className="side-card" style={{ borderRadius:"var(--r-xl)" }}>
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
          <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--r-xl)", padding:16, textAlign:"center", boxShadow:"var(--s1)" }}>
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

