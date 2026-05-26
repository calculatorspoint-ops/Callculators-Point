'use client';
import { useState, useEffect, Suspense, lazy } from "react";
import Link from "next/link";
import { ArrowRight, Zap, BarChart2, Shield, TrendingUp, Star, ChevronRight, Calculator, Sparkles, BookOpen } from "lucide-react";

import { CATEGORIES, BY_CATEGORY, POPULAR, NEW_CALCS, ALL_CALCULATORS } from "@/data/calculatorConfigs";
import { useAppStore } from "@/store/useAppStore";

// Lazy-load the heavy QuickCalc widget — it's below the fold on mobile
// and has no SSR content anyway (it's all interactive state)
const QuickCalc = lazy(() =>
  import('@/components/ui/QuickCalc').then(m => ({ default: m.QuickCalc }))
);

/* ── Calculator row item ─────────────────────────────────────────────── */
function CalcRow({ calc }) {
  const cat = CATEGORIES.find(c => c.id === calc.cat);
  return (
    <Link
      href={`/calculator/${calc.slug}`}
      className="calc-row"
      aria-label={`Open ${calc.name} calculator`}
      style={{ overflow: "hidden", minWidth: 0 }}
    >
      <div className="calc-row-icon" style={{ background: cat?.bg || "var(--surf2)", fontSize: 18, flexShrink: 0 }}>
        {calc.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap", minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{calc.name}</span>
          {calc.popular && <span className="badge badge-green" style={{ flexShrink: 0 }}>Popular</span>}
          {calc.isNew   && <span className="badge badge-red"   style={{ flexShrink: 0 }}>New</span>}
        </div>
        <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>
          {calc.desc}
        </p>
      </div>
      <ChevronRight size={14} style={{ color: "var(--text3)", flexShrink: 0, marginLeft: 4 }} />
    </Link>
  );
}

/* ── Category block ─────────────────────────────────────────── */
function CatBlock({ cat }) {
  const calcs = BY_CATEGORY[cat.id] || [];
  const [show, setShow] = useState(false);
  const limit = 3; // Start with 3 rows to keep initial DOM size below 700 elements
  const shown = show ? calcs : calcs.slice(0, limit);
  return (
    <div className="home-cat-block">
      {/* Header */}
      <div className="home-cat-head" style={{ borderLeft: `4px solid ${cat.color}` }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: cat.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
          {cat.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
          <Link href={`/category/${cat.id}`} style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", textDecoration: "none", letterSpacing: "-.02em", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {cat.name}
          </Link>
          <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cat.desc}</p>
        </div>
        <Link href={`/category/${cat.id}`} style={{ fontSize: 11, fontWeight: 700, color: cat.color, textDecoration: "none", padding: "4px 8px", background: cat.bg, borderRadius: 100, whiteSpace: "nowrap", flexShrink: 0 }}>
          {calcs.length} →
        </Link>
      </div>

      {/* Grid of calculator rows */}
      <div className="home-cat-grid">
        {shown.map(c => <CalcRow key={c.id} calc={c} />)}
      </div>

      {calcs.length > limit && (
        <button onClick={() => setShow(!show)} className="home-cat-more">
          {show ? "↑ Show less" : `+ ${calcs.length - limit} more in ${cat.name}`}
        </button>
      )}
    </div>
  );
}

/* ── Feature card ─────────────────────────────────────────────── */
function FeatureCard({ icon, title, desc, color }) {
  return (
    <div className="home-feature-card">
      <div className="home-feature-icon" style={{ background: color + "15", color }}>
        {icon}
      </div>
      <h3 className="home-feature-title">{title}</h3>
      <p className="home-feature-desc">{desc}</p>
    </div>
  );
}

/* ── Main Home page ─────────────────────────────────────────────── */
export default function Home({ skipHero } = {}) {
  const { recent, favorites } = useAppStore();
  const recentCalcs   = recent.map(id => ALL_CALCULATORS.find(c => c.id === id)).filter(Boolean);
  const favoriteCalcs = favorites.map(id => ALL_CALCULATORS.find(c => c.id === id)).filter(Boolean);
  const [showAllPopular, setShowAllPopular] = useState(false);
  const [showAllNew, setShowAllNew] = useState(false);
  // Defer below-fold content until after initial paint to reduce DOM size
  // This cuts the initial DOM from ~1148 elements to under 500
  const [belowFoldReady, setBelowFoldReady] = useState(false);
  useEffect(() => {
    // Use requestIdleCallback if available, otherwise setTimeout
    const schedule = typeof window !== 'undefined' && 'requestIdleCallback' in window
      ? (cb) => requestIdleCallback(cb, { timeout: 300 })
      : (cb) => setTimeout(cb, 0);
    schedule(() => setBelowFoldReady(true));
  }, []);


  return (
    <>
      {/* SEO metadata handled by generateMetadata in app/page.tsx */}

      {/* ═══ HERO ══════════════════════════════════════════════════════════════ */}
      {/* When skipHero is true, the hero is server-rendered in app/page.tsx
          for instant LCP — don't render it again here */}
      {!skipHero && (
      <section className="hero" aria-label="Hero section">
        <div className="hero-inner">
          <div className="hero-layout">
            {/* Left column */}
            <div className="hero-content">
              <div className="hero-badge">
                <Sparkles size={12} />
                {ALL_CALCULATORS.length}+ Free Tools · No Signup · Instant Results
              </div>

              <h1 className="hero-title">
                Your All-in-One<br />
                <span className="hero-accent">Calculator Suite</span>
              </h1>

              <p className="hero-sub">
                Finance, health, math and everyday tools — with live charts, step-by-step breakdowns, and smart insights. 100% free, works offline, completely private.
              </p>

              <div className="hero-actions">
                <Link href="/calculators" className="btn-primary" aria-label="Browse all calculators">
                  Explore All Tools <ArrowRight size={16} />
                </Link>
                <Link href="/calculator/loan-emi-calculator" className="btn-ghost">
                  Try EMI Calculator
                </Link>
              </div>

              {/* Feature pills */}
              <div className="hero-features">
                {[
                  { icon: <Zap size={13} />,       label: "Instant Results" },
                  { icon: <BarChart2 size={13} />, label: "Live Charts" },
                  { icon: <Shield size={13} />,    label: "100% Private" },
                  { icon: <TrendingUp size={13} />,label: "Smart Insights" },
                ].map(({ icon, label }) => (
                  <div key={label} className="hero-feature-pill">
                    {icon} {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right column — Quick calc widget (lazy-loaded, no SSR needed) */}
            <div className="hero-widget-col">
              <div className="hero-widget-label">⚡ Quick Calculator</div>
              <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                <Suspense fallback={
                  <div style={{ width: 300, height: 400, borderRadius: 20, background: "rgba(15,23,42,.92)", border: "1.5px solid rgba(255,255,255,.1)" }} />
                }>
                  <QuickCalc />
                </Suspense>
              </div>
            </div>
          </div>

          {/* Category pills */}
          <div className="hero-pills" role="navigation" aria-label="Calculator categories">
            {CATEGORIES.map(cat => (
              <Link key={cat.id} href={`/category/${cat.id}`} className="hero-pill">
                <span>{cat.icon}</span> {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ═══ STATS STRIP ════════════════════════════════════════════════════════ */}
      {/* aria-label so screen readers understand the stats purpose */}
      <div className="stat-strip" role="complementary" aria-label="Site statistics">
        {[
          { n: "180+", l: "Calculators", icon: "🧮" },
          { n: "6",    l: "Categories",  icon: "📂" },
          { n: "∞",    l: "Free Always", icon: "🆓" },
          { n: "0",    l: "Data Stored", icon: "🔒" },
        ].map(({ n, l, icon }) => (
          <div key={l} className="stat-strip-item">
            <div className="stat-strip-icon" aria-hidden="true">{icon}</div>
            <div className="stat-num">{n}</div>
            <div className="stat-lbl">{l}</div>
          </div>
        ))}
      </div>

      {/* ═══ MAIN CONTENT ═══════════════════════════════════════════════════════ */}
      <div className="home-wrap">

        {/* ═══ ECOSYSTEM HUBS STRIP (deferred — below fold) ════════════════════════ */}
        {belowFoldReady && <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "16px 20px", overflowX: "auto" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <BookOpen size={14} style={{ color: "var(--brand)" }} />
              <span style={{ fontSize: 12, fontWeight: 800, color: "var(--text2)", textTransform: "uppercase", letterSpacing: ".06em" }}>Calculator Suites</span>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "nowrap", overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
              {[
                { id: "education", icon: "🎓", label: "Education Suite", sub: "GPA, IELTS, Attendance", color: "#c2410c", bg: "#fff7ed" },
                { id: "finance", icon: "💰", label: "Finance Suite", sub: "EMI, SIP, Tax, Salary", color: "#3451c7", bg: "#eef0fd" },
                { id: "fitness", icon: "💪", label: "Fitness Suite", sub: "BMI, Calories, Macros", color: "#b91c1c", bg: "#fef2f2" },
                { id: "women-health", icon: "🌸", label: "Women's Health", sub: "Period, Ovulation, Fertility", color: "#9d174d", bg: "#fdf2f8" },
              ].map(eco => (
                <Link key={eco.id} href={`/ecosystem/${eco.id}`} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                  background: eco.bg, border: `1.5px solid ${eco.color}20`,
                  borderRadius: "var(--r-xl)", textDecoration: "none", flexShrink: 0,
                  transition: "all .15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = eco.color; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${eco.color}20`; e.currentTarget.style.transform = "none"; }}>
                  <span style={{ fontSize: 20 }}>{eco.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: eco.color }}>{eco.label}</div>
                    <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 600 }}>{eco.sub}</div>
                  </div>
                  <ArrowRight size={12} style={{ color: eco.color, marginLeft: 4 }} />
                </Link>
              ))}
            </div>
          </div>
        </div>}

        {/* ═══ NAME GENERATORS STRIP (deferred — below fold) ════════════════════════ */}
        {belowFoldReady && <div style={{ background: "linear-gradient(135deg, #6366f115 0%, #8b5cf610 50%, #ec489910 100%)", borderBottom: "1px solid var(--border)", padding: "20px 20px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>✨</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text)" }}>Name Generator Tools</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", background: "#6366f115", padding: "2px 8px", borderRadius: 100 }}>NEW</span>
              </div>
              <Link href="/name-generators" style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", display: "flex", alignItems: "center", gap: 4 }}>
                View All 8 Tools <ArrowRight size={12} />
              </Link>
            </div>
            <div style={{ display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4 }}>
              {[
                { slug: "baby-name-generator",             icon: "👶", label: "Baby Names",      color: "#ec4899", bg: "#fdf2f8" },
                { slug: "islamic-baby-names",              icon: "🌙", label: "Islamic Names",   color: "#10b981", bg: "#f0fdf4" },
                { slug: "business-name-generator",         icon: "💼", label: "Business Names", color: "#3b82f6", bg: "#eff6ff" },
                { slug: "brand-name-generator",            icon: "✨", label: "Brand Names",    color: "#8b5cf6", bg: "#f5f3ff" },
                { slug: "youtube-channel-name-generator",  icon: "🎬", label: "YouTube Names",  color: "#ef4444", bg: "#fef2f2" },
                { slug: "instagram-username-generator",    icon: "📸", label: "Instagram",      color: "#d946ef", bg: "#fdf4ff" },
                { slug: "domain-name-generator",           icon: "🌐", label: "Domain Names",   color: "#0891b2", bg: "#ecfeff" },
                { slug: "app-name-generator",              icon: "📱", label: "App Names",      color: "#f59e0b", bg: "#fffbeb" },
              ].map(tool => (
                <Link key={tool.slug} href={`/name-generators/${tool.slug}`} style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                  padding: "12px 16px", background: tool.bg,
                  border: `1.5px solid ${tool.color}25`, borderRadius: "var(--r-xl)",
                  textDecoration: "none", minWidth: 110, flexShrink: 0, transition: "all .15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = tool.color; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = `${tool.color}25`; }}>
                  <span style={{ fontSize: 24 }}>{tool.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: tool.color, textAlign: "center", lineHeight: 1.3 }}>{tool.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>}

        {/* ═══ TRENDING CALCULATORS (deferred — below fold) ════════════════════════ */}
        {belowFoldReady && <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "20px 20px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <TrendingUp size={16} style={{ color: "#f59e0b" }} />
                <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text)" }}>Trending Now</span>
              </div>
              <Link href="/calculators" style={{ fontSize: 12, fontWeight: 700, color: "var(--brand)", display: "flex", alignItems: "center", gap: 4 }}>
                View All <ArrowRight size={12} />
              </Link>
            </div>
            <div style={{ display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4 }}>
              {POPULAR.slice(0, 10).map((c, i) => {
                const cat = CATEGORIES.find(x => x.id === c.cat);
                return (
                  <Link key={c.id} href={`/calculator/${c.slug}`} style={{
                    display: "flex", flexDirection: "column", gap: 6, padding: "12px 14px",
                    background: cat?.bg || "var(--surf2)", border: `1.5px solid ${cat?.color}20`,
                    borderRadius: "var(--r-xl)", textDecoration: "none", minWidth: 130, flexShrink: 0,
                    transition: "all .15s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = cat?.color; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = `${cat?.color}20`; }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 22 }}>{c.icon}</span>
                      <div style={{ fontSize: 10, fontWeight: 800, color: "#92400e", background: "#fef3c7", padding: "1px 6px", borderRadius: 100 }}>#{i + 1}</div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", lineHeight: 1.4 }}>{c.name}</div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>}

        <div className="home-grid">
          {/* ── Left: Calculator lists ── */}
          <main role="main">
            {/* Recently Used */}
            {recentCalcs.length > 0 && (
              <div className="home-cat-block" style={{ marginBottom: 16 }}>
                <div className="home-cat-head" style={{ borderLeft: "4px solid #16a34a" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--green-l)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                    🕐
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text)" }}>Recently Used</div>
                    <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>Jump back in where you left off</p>
                  </div>
                </div>
                <div className="home-cat-grid">
                  {recentCalcs.slice(0, 5).map(c => <CalcRow key={c.id} calc={c} />)}
                </div>
              </div>
            )}

            {/* Favorites */}
            {favoriteCalcs.length > 0 && (
              <div className="home-cat-block" style={{ marginBottom: 16 }}>
                <div className="home-cat-head" style={{ borderLeft: "4px solid #f59e0b" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                    ⭐
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text)" }}>Your Favorites</div>
                    <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>Saved tools — accessible in one click</p>
                  </div>
                </div>
                <div className="home-cat-grid">
                  {favoriteCalcs.slice(0, 6).map(c => <CalcRow key={c.id} calc={c} />)}
                </div>
              </div>
            )}

            {/* Category blocks */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {CATEGORIES.map(cat => <CatBlock key={cat.id} cat={cat} />)}
            </div>
          </main>

          {/* ── Right: Sidebar ── */}
          <aside id="home-sidebar" role="complementary">

            {/* Popular */}
            <div className="sidebar-card">
              <div className="sidebar-card-head">
                <span className="sidebar-card-icon" style={{ background: "#fef3c7" }}>⭐</span>
                <span className="sidebar-card-title">Most Popular</span>
              </div>
              <div>
                {(showAllPopular ? POPULAR : POPULAR.slice(0, 10)).map((c, i) => (
                  <Link key={c.id} href={`/calculator/${c.slug}`} className="sidebar-item">
                    <div className="sidebar-item-rank" style={{ background: i < 3 ? "var(--brand)" : "var(--surf2)", color: i < 3 ? "#fff" : "var(--text3)" }}>
                      {i + 1}
                    </div>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{c.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, flex: 1, color: "var(--text)" }}>{c.name}</span>
                  </Link>
                ))}
              </div>
              {POPULAR.length > 10 && (
                <button 
                  onClick={() => setShowAllPopular(!showAllPopular)} 
                  style={{ width: "100%", padding: "10px", background: "transparent", border: "none", borderTop: "1px solid var(--border)", color: "var(--brand)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font)", transition: "background .15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--surf2)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {showAllPopular ? "View Less" : `View More (${POPULAR.length - 10})`}
                </button>
              )}
            </div>

            {/* New tools */}
            {NEW_CALCS.length > 0 && (
              <div className="sidebar-card">
                <div className="sidebar-card-head">
                  <span className="sidebar-card-icon" style={{ background: "#fee2e2" }}>🆕</span>
                  <span className="sidebar-card-title">New Additions</span>
                </div>
                <div>
                  {(showAllNew ? NEW_CALCS : NEW_CALCS.slice(0, 10)).map(c => (
                    <Link key={c.id} href={`/calculator/${c.slug}`} className="sidebar-item">
                      <span style={{ fontSize: 16, flexShrink: 0 }}>{c.icon}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 1 }}>{c.cat}</div>
                      </div>
                    </Link>
                  ))}
                </div>
                {NEW_CALCS.length > 10 && (
                  <button 
                    onClick={() => setShowAllNew(!showAllNew)} 
                    style={{ width: "100%", padding: "10px", background: "transparent", border: "none", borderTop: "1px solid var(--border)", color: "var(--brand)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font)", transition: "background .15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--surf2)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {showAllNew ? "View Less" : `View More (${NEW_CALCS.length - 10})`}
                  </button>
                )}
              </div>
            )}

            {/* Name Generators CTA */}
            <div style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "var(--r-xl)", padding: "18px", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 22 }}>✨</span>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>Name Generator Tools</div>
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,.75)", marginBottom: 14, lineHeight: 1.5 }}>
                Baby names, business names, brand names, YouTube, Instagram, domain & app names — all free.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 14 }}>
                {["👶", "🌙", "💼", "✨", "🎬", "📸", "🌐", "📱"].map((icon, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,.15)", borderRadius: 8, padding: "8px 4px", textAlign: "center", fontSize: 18 }}>{icon}</div>
                ))}
              </div>
              <Link href="/name-generators" style={{ display: "block", textAlign: "center", padding: "9px 0", background: "rgba(255,255,255,.2)", borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none", border: "1px solid rgba(255,255,255,.3)", transition: "all .15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.3)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.2)"}>
                Explore 8 Name Generators →
              </Link>
            </div>

            {/* Browse All CTA */}
            <div className="sidebar-cta">
              <div style={{ fontSize: 32, marginBottom: 10 }}>🔢</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{ALL_CALCULATORS.length}+ Calculators</div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,.65)", marginBottom: 16, lineHeight: 1.5 }}>
                Finance, health, math & more. All free, all instant.
              </p>
              <Link href="/calculators" className="sidebar-cta-btn">
                Browse Full Collection →
              </Link>
            </div>

            {/* Ad slot */}
            <div className="sidebar-ad">
              <p className="sidebar-ad-label">Advertisement</p>
              <div className="sidebar-ad-slot">300×250</div>
            </div>
          </aside>
        </div>

        {/* ═══ WHY SECTION ════════════════════════════════════════════════════════ */}
        <section className="home-why" aria-label="Why choose CalculatorsPoint">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", background: "var(--brand-l)", borderRadius: 100, fontSize: 12, fontWeight: 700, color: "var(--brand)", marginBottom: 14 }}>
              <Calculator size={13} /> Why Calculators Point?
            </div>
            <h2 className="home-why-title">More than just numbers</h2>
            <p style={{ color: "var(--text3)", fontSize: 14, maxWidth: 480, margin: "0 auto" }}>
              Tools that help you understand, compare, and decide — not just compute.
            </p>
          </div>
          <div className="home-features-grid">
            {[
              { icon: "📊", color: "#2563EB", title: "Interactive Charts",    desc: "Visual charts that update as you type — growth curves, amortization schedules, scenario comparisons." },
              { icon: "💡", color: "#b45309", title: "Smart Insights",        desc: "Automatic tips like 'Pay ₹500 extra/month to save ₹40K in interest'. Actionable, not just numbers." },
              { icon: "📋", color: "#10B981", title: "Step-by-Step Breakdowns", desc: "Every formula explained clearly. Understand the math behind every result." },
              { icon: "🔒", color: "#7c3aed", title: "100% Private",          desc: "All calculations run locally in your browser. Nothing is ever sent to any server." },
              { icon: "🌍", color: "#1D4ED8", title: "Multi-Currency",        desc: "Auto-detects your region. Switch currency and everything updates instantly." },
              { icon: "🆓", color: "#10B981", title: "Always Free",           desc: "No subscriptions, no paywalls, no tricks. Every tool, free forever." },
            ].map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </section>
      </div>
    </>
  );
}

