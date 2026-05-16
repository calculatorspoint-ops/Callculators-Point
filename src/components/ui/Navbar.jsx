import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Moon, Sun, Menu, X, Calculator, ChevronRight } from "lucide-react";
import { useAppStore } from "@/store/useAppStore.js";
import { ALL_CALCULATORS, CATEGORIES } from "@/data/calculatorConfigs.js";
import { CurrencySelector } from "./CurrencySelector.jsx";

export function Navbar() {
  const { theme, toggleTheme } = useAppStore();
  const [q, setQ]             = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen]       = useState(false);
  const [mob, setMob]         = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const ref       = useRef(null);
  const searchRef = useRef(null);
  const loc       = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => { setMob(false); setOpen(false); setSearchOpen(false); setQ(""); }, [loc.pathname]);

  useEffect(() => {
    if (!q.trim()) { setResults([]); setOpen(false); return; }
    const lq = q.toLowerCase();
    const r = ALL_CALCULATORS
      .filter(c => c.name.toLowerCase().includes(lq) || c.desc?.toLowerCase().includes(lq))
      .slice(0, 8);
    setResults(r);
    setOpen(r.length > 0);
  }, [q]);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setQ("");
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Prevent body scroll when mobile menu open
  // FIX: Use CSS class instead of style.overflow to avoid forced reflow
  useEffect(() => {
    document.documentElement.classList.toggle("mob-menu-open", mob);
    return () => { document.documentElement.classList.remove("mob-menu-open"); };
  }, [mob]);

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">

          {/* ── Logo ── */}
          <Link to="/" className="navbar-logo" aria-label="CalculatorsPoint home">
            <div className="navbar-logo-icon">
              <Calculator size={19} color="#fff" strokeWidth={2.5} />
            </div>
            <span className="navbar-logo-text">
              Calculators<span style={{ color: "#6366f1" }}>Point</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="navbar-nav" aria-label="Main navigation">
            {CATEGORIES.slice(0, 5).map(c => (
              <Link
                key={c.id}
                to={`/category/${c.id}`}
                className="nav-link"
              >
                {c.icon} {c.name}
              </Link>
            ))}
            <Link to="/calculators" className="nav-link nav-link-all">
              All Tools
            </Link>
          </nav>

          {/* ── Right controls ── */}
          <div className="navbar-controls">

            {/* Desktop search */}
            <div ref={ref} className="navbar-search-desktop">
              <div className="navbar-search-box">
                <Search size={14} className="navbar-search-icon" />
                <input
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  placeholder="Search calculators…"
                  className="navbar-search-input"
                  aria-label="Search calculators"
                />
                {q && (
                  <button
                    onClick={() => { setQ(""); setOpen(false); }}
                    className="navbar-search-clear"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
              {open && (
                <div className="navbar-search-drop">
                  {results.map(r => (
                    <Link
                      key={r.id}
                      to={`/calculator/${r.slug}`}
                      className="navbar-search-item"
                    >
                      <span className="navbar-search-item-icon">{r.icon}</span>
                      <div>
                        <div className="navbar-search-item-name">{r.name}</div>
                        <div className="navbar-search-item-desc">{r.desc?.slice(0, 50)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile search icon */}
            <button
              className="navbar-icon-btn mobile-search-btn"
              onClick={() => setSearchOpen(s => !s)}
              aria-label="Search"
            >
              <Search size={17} />
            </button>

            {/* Currency — desktop only */}
            <div className="desktop-only">
              <CurrencySelector />
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="navbar-icon-btn"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Mobile hamburger */}
            <button
              className="navbar-icon-btn navbar-hamburger"
              onClick={() => setMob(!mob)}
              aria-label={mob ? "Close menu" : "Open menu"}
              aria-expanded={mob}
            >
              {mob ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* ── Mobile search bar (expands below header) ── */}
        {searchOpen && (
          <div className="navbar-mobile-search" ref={searchRef}>
            <div className="navbar-mobile-search-inner">
              <Search size={15} style={{ color: "var(--text3)", flexShrink: 0 }} />
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search 55+ calculators…"
                className="navbar-search-input"
                autoFocus
                aria-label="Search calculators"
              />
              {q && (
                <button
                  onClick={() => { setQ(""); setOpen(false); }}
                  className="navbar-search-clear"
                >
                  ×
                </button>
              )}
            </div>
            {open && (
              <div className="navbar-search-drop navbar-search-drop-mobile">
                {results.map(r => (
                  <Link
                    key={r.id}
                    to={`/calculator/${r.slug}`}
                    className="navbar-search-item"
                  >
                    <span className="navbar-search-item-icon">{r.icon}</span>
                    <div>
                      <div className="navbar-search-item-name">{r.name}</div>
                      <div className="navbar-search-item-desc">{r.desc?.slice(0, 45)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </header>

      {/* ── Mobile full-screen menu overlay ── */}
      {mob && (
        <div className="mob-overlay" onClick={() => setMob(false)} />
      )}
      <div className={`mob-menu-panel${mob ? " mob-menu-panel--open" : ""}`} aria-hidden={!mob}>
        {/* Category links */}
        <div className="mob-menu-section">
          <p className="mob-menu-section-title">Categories</p>
          {CATEGORIES.map(c => (
            <Link
              key={c.id}
              to={`/category/${c.id}`}
              className="mob-menu-link"
            >
              <span className="mob-menu-link-icon">{c.icon}</span>
              <span>{c.name}</span>
              <ChevronRight size={14} style={{ marginLeft: "auto", color: "var(--text3)" }} />
            </Link>
          ))}
        </div>

        <div className="mob-menu-divider" />

        {/* Quick links */}
        <div className="mob-menu-section">
          <p className="mob-menu-section-title">Quick Links</p>
          <Link to="/calculators" className="mob-menu-link mob-menu-link--featured">
            <span>📊</span>
            <span>All 55+ Tools</span>
            <ChevronRight size={14} style={{ marginLeft: "auto" }} />
          </Link>
          <Link to="/about" className="mob-menu-link">
            <span>ℹ️</span>
            <span>About</span>
            <ChevronRight size={14} style={{ marginLeft: "auto", color: "var(--text3)" }} />
          </Link>
          <Link to="/contact" className="mob-menu-link">
            <span>✉️</span>
            <span>Contact</span>
            <ChevronRight size={14} style={{ marginLeft: "auto", color: "var(--text3)" }} />
          </Link>
        </div>

        <div className="mob-menu-divider" />

        {/* Currency in mobile menu */}
        <div className="mob-menu-section">
          <p className="mob-menu-section-title">Currency</p>
          <div style={{ padding: "0 4px" }}>
            <CurrencySelector />
          </div>
        </div>
      </div>
    </>
  );
}
