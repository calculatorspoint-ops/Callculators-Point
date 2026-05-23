import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";

import { CATEGORIES, ALL_CALCULATORS } from "@/data/calculatorConfigs.js";
import "@/styles/all-calculators.css";

export default function AllCalculators() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");

  const filtered = useMemo(() => ALL_CALCULATORS.filter(c => {
    const mc = cat === "all" || c.cat === cat;
    const lq = q.toLowerCase();
    const mq = !q || c.name.toLowerCase().includes(lq) || c.desc.toLowerCase().includes(lq);
    return mc && mq;
  }), [q, cat]);

  return (
    <div style={{ backgroundColor: '#0a0e25', minHeight: '100vh' }}>
      

      {/* Hero Section */}
      <section className="hero-premium">
        <div className="hero-premium-inner">
          <h1 className="hero-title-premium">
            <span className="text-gradient">{ALL_CALCULATORS.length}+ Powerful Tools</span><br/>
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
                  <Link key={c.id} to={`/calculator/${c.slug}`} className="calc-card-premium">
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
      </div>
    </div>
  );
}
