'use client';
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";

import { CATEGORIES, ALL_CALCULATORS, CALC_COUNT_LABEL } from "@/data/calculatorConfigs";
import "@/styles/all-calculators.css";

export default function AllCalculators() {
  // Seed initial query from ?q= URL param — required for SiteLinksSearchBox schema.
  // When Google routes users from the SERP sitelinks search to /calculators?q=bmi,
  // this ensures the search box is pre-populated and results are already filtered.
  const searchParams = useSearchParams();
  const [q, setQ] = useState(() => searchParams.get("q") ?? "");
  const [cat, setCat] = useState("all");

  const filtered = useMemo(() => ALL_CALCULATORS.filter(c => {
    const mc = cat === "all" || c.cat === cat;
    const lq = q.toLowerCase();
    const mq = !q || c.name.toLowerCase().includes(lq) || c.desc.toLowerCase().includes(lq);
    return mc && mq;
  }), [q, cat]);

  return (
    <div className="all-calcs-page">
      

      {/* Hero Section */}
      <section className="hero-premium">
        <div className="hero-premium-inner">
          <h1 className="hero-title-premium">
            <span className="text-gradient">{CALC_COUNT_LABEL} Powerful Tools</span><br/>
            For Everyday Calculations
          </h1>
          <p className="hero-subtitle-premium">
            From complex financial forecasting to quick health checks, Calculators Point provides professional-grade tools with instant, beautiful results.
          </p>
        </div>
      </section>

      {/* Sticky Search & Filter Bar */}
      <div className="toolbar-premium-wrap">
        <div className="toolbar-premium">
          <div className="search-premium">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              value={q} 
              onChange={e => setQ(e.target.value)} 
              placeholder="Search calculators..." 
              aria-label="Search all calculators"
            />
          </div>
          <div className="filters-premium">
            <button 
              onClick={() => setCat("all")} 
              className={`filter-pill-premium ${cat === "all" ? "active" : ""}`}
            >
              <span className="icon">🔢</span> All
            </button>
            {CATEGORIES.map(c => (
              <button 
                key={c.id} 
                onClick={() => setCat(c.id)} 
                className={`filter-pill-premium ${cat === c.id ? "active" : ""}`}
              >
                {c.icon} {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div style={{ paddingBottom: '80px' }}>
        {CATEGORIES.map(category => {
          const calcs = filtered.filter(c => c.cat === category.id);
          if (!calcs.length) return null;
          
          return (
            <section key={category.id}>
              {cat === "all" && (
                <div className="category-header-premium">
                  <h2>
                    <span style={{ fontSize: '24px' }}>{category.icon}</span> 
                    {category.name}
                  </h2>
                  <div className="line" />
                </div>
              )}
              <div className="calc-grid-premium">
                {calcs.map(c => (
                  <Link key={c.id} href={`/calculator/${c.slug}`} className="calc-card-premium">
                    <div className="calc-card-icon">{c.icon}</div>
                    <div className="calc-card-content">
                      <div className="calc-card-title">
                        {c.name}
                        {c.popular && <span className="premium-badge badge-pop">Popular</span>}
                        {c.isNew && <span className="premium-badge badge-new">New</span>}
                      </div>
                      <p className="calc-card-desc">{c.desc}</p>
                    </div>
                    <ArrowRight className="calc-card-arrow" size={20} />
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {filtered.length === 0 && (
          <div className="empty-state-premium">
            <div className="icon">🔍</div>
            <h3>No results found for "{q}"</h3>
            <p>Try adjusting your search or switching categories.</p>
          </div>
        )}

        {/* ═══ NAME GENERATORS SECTION ═══════════════════════════════════════════════ */}
        <div style={{ maxWidth: 1280, margin: "40px auto 0", padding: "0 20px" }}>
          <div style={{
            background: "linear-gradient(135deg, #6366f120 0%, #8b5cf615 50%, #ec489910 100%)",
            border: "1.5px solid #6366f130",
            borderRadius: 20,
            padding: "32px 28px",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 24 }}>✨</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Name Generator Tools</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", background: "#6366f120", border: "1px solid #6366f140", padding: "2px 8px", borderRadius: 100 }}>NEW</span>
                </div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,.6)", maxWidth: 560, lineHeight: 1.6 }}>
                  Discover our brand-new suite of professional name generators — baby names, business names, brand identity, YouTube channels, Instagram usernames, domain names, and app names. All free, all instant.
                </p>
              </div>
              <Link href="/name-generators" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "10px 20px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                borderRadius: 12, color: "#fff", fontWeight: 700, fontSize: 13,
                textDecoration: "none", flexShrink: 0, transition: "all .2s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                View All 8 Generators <ArrowRight size={14} />
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
              {[
                { slug: "baby-name-generator",            icon: "👶", label: "Baby Name Generator",     color: "#ec4899", bg: "rgba(236,72,153,.1)"  },
                { slug: "islamic-baby-names",             icon: "🌙", label: "Islamic Baby Names",      color: "#10b981", bg: "rgba(16,185,129,.1)"  },
                { slug: "business-name-generator",        icon: "💼", label: "Business Name Generator", color: "#3b82f6", bg: "rgba(59,130,246,.1)"  },
                { slug: "brand-name-generator",           icon: "✨", label: "Brand Name Generator",   color: "#8b5cf6", bg: "rgba(139,92,246,.1)"  },
                { slug: "youtube-channel-name-generator", icon: "🎬", label: "YouTube Channel Names",   color: "#ef4444", bg: "rgba(239,68,68,.1)"   },
                { slug: "instagram-username-generator",   icon: "📸", label: "Instagram Username",      color: "#d946ef", bg: "rgba(217,70,239,.1)"  },
                { slug: "domain-name-generator",          icon: "🌐", label: "Domain Name Generator",   color: "#0891b2", bg: "rgba(8,145,178,.1)"   },
                { slug: "app-name-generator",             icon: "📱", label: "App Name Generator",      color: "#f59e0b", bg: "rgba(245,158,11,.1)"  },
              ].map(tool => (
                <Link key={tool.slug} href={`/name-generators/${tool.slug}`} style={{
                  display: "flex", flexDirection: "column", gap: 8,
                  padding: "16px 14px", background: tool.bg,
                  border: `1.5px solid ${tool.color}30`, borderRadius: 14,
                  textDecoration: "none", transition: "all .15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = tool.color; e.currentTarget.style.background = tool.bg.replace("0.1", "0.18"); }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = `${tool.color}30`; e.currentTarget.style.background = tool.bg; }}>
                  <span style={{ fontSize: 26 }}>{tool.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: tool.color, lineHeight: 1.4 }}>{tool.label}</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,.5)", fontWeight: 600 }}>Free →</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
