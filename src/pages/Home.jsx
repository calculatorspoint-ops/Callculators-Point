import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Zap, BarChart2, Shield, TrendingUp, Star, ChevronRight, Calculator, Sparkles } from "lucide-react";

import { QuickCalc } from "@/components/ui/QuickCalc.jsx";
import { CATEGORIES, BY_CATEGORY, POPULAR, NEW_CALCS, ALL_CALCULATORS } from "@/data/calculatorConfigs.js";
import { useAppStore } from "@/store/useAppStore.js";

/* ── Calculator row item ─────────────────────────────────────────────── */
function CalcRow({ calc }) {
  const cat = CATEGORIES.find(c => c.id === calc.cat);
  return (
    <Link to={`/calculator/${calc.slug}`} className="calc-row" aria-label={`Open ${calc.name} calculator`}>
      <div className="calc-row-icon" style={{ background: cat?.bg || "var(--surf2)", fontSize: 18 }}>
        {calc.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{calc.name}</span>
          {calc.popular && <span className="badge badge-green">Popular</span>}
          {calc.isNew   && <span className="badge badge-red">New</span>}
        </div>
        <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {calc.desc}
        </p>
      </div>
      <ChevronRight size={14} style={{ color: "var(--text3)", flexShrink: 0 }} />
    </Link>
  );
}

/* ── Category block ─────────────────────────────────────────────── */
function CatBlock({ cat }) {
  const calcs = BY_CATEGORY[cat.id] || [];
  const [show, setShow] = useState(false);
  const limit = 6;
  const shown = show ? calcs : calcs.slice(0, limit);
  return (
    <div className="home-cat-block">
      {/* Header */}
      <div className="home-cat-head" style={{ borderLeft: `4px solid ${cat.color}` }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: cat.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
          {cat.icon}
        </div>
        <div style={{ flex: 1 }}>
          <Link to={`/category/${cat.id}`} style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", textDecoration: "none", letterSpacing: "-.02em" }}>
            {cat.name}
          </Link>
          <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{cat.desc}</p>
        </div>
        <Link to={`/category/${cat.id}`} style={{ fontSize: 11, fontWeight: 700, color: cat.color, textDecoration: "none", padding: "4px 10px", background: cat.bg, borderRadius: 100, whiteSpace: "nowrap" }}>
          {calcs.length} tools →
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
export default function Home() {
  const { recent } = useAppStore();
  const recentCalcs = recent.map(id => ALL_CALCULATORS.find(c => c.id === id)).filter(Boolean);

  return (
    <>
      <Helmet>
        <title>{`CalculatorsPoint — ${ALL_CALCULATORS.length}+ Free Online Calculators for Finance, Health & Math`}</title>
        <meta name="description" content={`CalculatorsPoint offers ${ALL_CALCULATORS.length}+ free online calculators for finance, health, math, and everyday use. EMI, BMI, SIP, GST, compound interest, and more. Instant results, 100% private.`} />
        <link rel="canonical" href="https://calculatorspoint.com/" />
      </Helmet>

      {/* ═══ HERO ══════════════════════════════════════════════════════════════ */}
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
                <Link to="/calculators" className="btn-primary" aria-label="Browse all calculators">
                  Explore All Tools <ArrowRight size={16} />
                </Link>
                <Link to="/calculator/loan-emi-calculator" className="btn-ghost">
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

            {/* Right column — Quick calc widget */}
            <div className="hero-widget-col">
              <div className="hero-widget-label">⚡ Quick Calculator</div>
              <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                <QuickCalc />
              </div>
            </div>
          </div>

          {/* Category pills */}
          <div className="hero-pills" role="navigation" aria-label="Calculator categories">
            {CATEGORIES.map(cat => (
              <Link key={cat.id} to={`/category/${cat.id}`} className="hero-pill">
                <span>{cat.icon}</span> {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS STRIP ════════════════════════════════════════════════════════ */}
      <div className="stat-strip" role="complementary">
        {[
          { n: ALL_CALCULATORS.length + "+", l: "Calculators", icon: "🧮" },
          { n: "6",                           l: "Categories",  icon: "📂" },
          { n: "∞",                           l: "Free Always", icon: "🆓" },
          { n: "0",                           l: "Data Stored", icon: "🔒" },
        ].map(({ n, l, icon }) => (
          <div key={l} className="stat-strip-item">
            <div className="stat-strip-icon">{icon}</div>
            <div className="stat-num">{n}</div>
            <div className="stat-lbl">{l}</div>
          </div>
        ))}
      </div>

      {/* ═══ MAIN CONTENT ═══════════════════════════════════════════════════════ */}
      <div className="home-wrap">
        <div className="home-grid">

          {/* ── Left: Calculator lists ── */}
          <main role="main">
            {/* Recently Used */}
            {recentCalcs.length > 0 && (
              <div className="home-cat-block" style={{ marginBottom: 20 }}>
                <div className="home-cat-head" style={{ borderLeft: "4px solid #16a34a" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--green-l)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                    🕐
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text)" }}>Recently Used</div>
                    <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>Jump back in where you left off</p>
                  </div>
                </div>
                <div className="home-cat-grid">
                  {recentCalcs.slice(0, 5).map(c => <CalcRow key={c.id} calc={c} />)}
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
                {POPULAR.map((c, i) => (
                  <Link key={c.id} to={`/calculator/${c.slug}`} className="sidebar-item">
                    <div className="sidebar-item-rank" style={{ background: i < 3 ? "var(--brand)" : "var(--surf2)", color: i < 3 ? "#fff" : "var(--text3)" }}>
                      {i + 1}
                    </div>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{c.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, flex: 1, color: "var(--text)" }}>{c.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* New tools */}
            {NEW_CALCS.length > 0 && (
              <div className="sidebar-card">
                <div className="sidebar-card-head">
                  <span className="sidebar-card-icon" style={{ background: "#fee2e2" }}>🆕</span>
                  <span className="sidebar-card-title">New Additions</span>
                </div>
                <div>
                  {NEW_CALCS.map(c => (
                    <Link key={c.id} to={`/calculator/${c.slug}`} className="sidebar-item">
                      <span style={{ fontSize: 16, flexShrink: 0 }}>{c.icon}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 1 }}>{c.cat}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Browse All CTA */}
            <div className="sidebar-cta">
              <div style={{ fontSize: 32, marginBottom: 10 }}>🔢</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{ALL_CALCULATORS.length}+ Calculators</div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,.65)", marginBottom: 16, lineHeight: 1.5 }}>
                Finance, health, math & more. All free, all instant.
              </p>
              <Link to="/calculators" className="sidebar-cta-btn">
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
              { icon: "📊", color: "#6366f1", title: "Interactive Charts",    desc: "Visual charts that update as you type — growth curves, amortization schedules, scenario comparisons." },
              { icon: "💡", color: "#f59e0b", title: "Smart Insights",        desc: "Automatic tips like 'Pay ₹500 extra/month to save ₹40K in interest'. Actionable, not just numbers." },
              { icon: "📋", color: "#22c55e", title: "Step-by-Step Breakdowns", desc: "Every formula explained clearly. Understand the math behind every result." },
              { icon: "🔒", color: "#8b5cf6", title: "100% Private",          desc: "All calculations run locally in your browser. Nothing is ever sent to any server." },
              { icon: "🌍", color: "#3b82f6", title: "Multi-Currency",        desc: "Auto-detects your region. Switch currency and everything updates instantly." },
              { icon: "🆓", color: "#10b981", title: "Always Free",           desc: "No subscriptions, no paywalls, no tricks. Every tool, free forever." },
            ].map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </section>
      </div>
    </>
  );
}

