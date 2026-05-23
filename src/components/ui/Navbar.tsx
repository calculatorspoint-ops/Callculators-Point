import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Moon, Sun, Menu, X, Calculator, ChevronRight, Settings } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { ALL_CALCULATORS, CATEGORIES, POPULAR, CalculatorConfig } from "@/data/calculatorConfigs.js";
import { CurrencySelector } from './CurrencySelector';
import { SettingsModal } from './SettingsModal';
import { useTranslation } from "react-i18next";
// import { signInWithGoogle, logout } from "@/firebase/auth.js";
// import { getAuth, onAuthStateChanged } from "firebase/auth";

// const ENABLE_FIREBASE_AUTH = false; // Feature flag to toggle auth system

/* ── Search aliases: map user intent → calculator IDs ──────────── */
const ALIASES: Record<string, string[]> = {
  "grade needed": ["required-grade", "final-grade", "gpa"],
  "grade required": ["required-grade", "final-grade"],
  "period": ["period", "ovulation", "fertility"],
  "pregnancy": ["pregnancy", "implantation", "ovulation"],
  "fertile": ["fertility", "ovulation", "implantation"],
  "cycle": ["period", "ovulation", "fertility"],
  "mortgage": ["mortgage", "emi", "compound"],
  "home loan": ["mortgage", "emi"],
  "emi": ["emi", "mortgage", "simple-interest"],
  "installment": ["emi", "mortgage"],
  "investment": ["sip", "compound", "ppf", "roi"],
  "calories": ["calorie", "bmr", "macro"],
  "diet": ["calorie", "macro", "bmi"],
  "lose weight": ["bmi", "calorie", "bmr"],
  "body mass": ["bmi", "ideal-weight"],
  "tax": ["tax", "gst", "salary"],
  "vat": ["gst", "tax"],
  "gst": ["gst", "tax", "discount"],
  "salary": ["salary", "tax", "work-hours"],
  "age": ["age", "date-diff", "countdown"],
  "birthday": ["age", "countdown"],
  "timer": ["countdown", "study-timer", "work-hours"],
  "password": ["password", "random", "base64"],
  "secure": ["password", "base64"],
  "convert": ["length", "weight", "temperature", "speed", "data"],
  "length": ["length", "area-conv"],
  "weight": ["weight", "bmi", "ideal-weight"],
  "temperature": ["temperature"],
  "speed": ["speed"],
  "data": ["data"],
  "percentage": ["percentage", "marks-percentage", "discount"],
  "discount": ["discount", "gst", "percentage"],
  "profit": ["profit-margin", "roi", "break-even"],
  "gpa": ["gpa", "target-gpa", "marks-percentage"],
  "cgpa": ["cgpa-to-percent", "gpa", "target-gpa"],
  "ielts": ["ielts", "sat", "study-timer"],
  "sat": ["sat", "ielts", "gpa"],
  "study": ["study-timer", "attendance", "marks-percentage"],
  "attendance": ["attendance", "study-timer"],
  "fuel": ["fuel", "ev-charging"],
  "ev": ["ev-charging", "fuel"],
  "word": ["word-count", "reading-time"],
  "read": ["reading-time", "word-count"],
  "bmi": ["bmi", "ideal-weight", "calorie"],
  "sip": ["sip", "compound", "ppf"],
  "interest": ["compound", "simple-interest", "emi"],
  "loan": ["emi", "mortgage", "simple-interest"],
  "retirement": ["retirement", "sip", "compound"],
  "sleeping": ["sleep"],
  "sleep": ["sleep", "study-timer"],
  "exercise": ["calories-burned", "heart-rate", "bmi"],
  "workout": ["calories-burned", "one-rep-max", "heart-rate"],
};

/* ── Fuzzy-ish search: alias + name + desc + keywords ──────────── */
function searchCalculators(query: string): CalculatorConfig[] {
  if (!query?.trim()) return [];
  const lq = query.toLowerCase().trim();

  // Check aliases first
  const aliasKey = Object.keys(ALIASES).find(k => lq.includes(k) || k.includes(lq));
  const aliasIds = aliasKey ? ALIASES[aliasKey] : [];

  const scored = ALL_CALCULATORS.map(c => {
    const nameL = c.name.toLowerCase();
    const descL = (c.desc || "").toLowerCase();
    let score = 0;

    if (nameL === lq)                         score += 100;
    else if (nameL.startsWith(lq))            score += 60;
    else if (nameL.includes(lq))             score += 40;
    if (descL.includes(lq))                  score += 15;
    if (aliasIds.includes(c.id))             score += 50;
    if (c.popular)                           score += 5;

    return { calc: c, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.calc)
    .slice(0, 8);
}

/* ── Search Dropdown ──────────────────────────────────────────── */
function SearchDropdown({ results, query, activeIdx, listboxId = "search-dropdown-list" }: { results: CalculatorConfig[]; query: string; activeIdx: number; listboxId?: string }) {
  const noResults = query.trim().length > 1 && results.length === 0;
  const suggestions = noResults
    ? POPULAR.slice(0, 4)
    : null;

  return (
    <div className="navbar-search-drop" role="listbox" aria-label="Search results" id={listboxId}>
      {results.map((r, i) => {
        return (
          <Link
            key={r.id}
            id={`${listboxId}-option-${i}`}
            to={`/calculator/${r.slug}`}
            className={`navbar-search-item${i === activeIdx ? " navbar-search-item--active" : ""}`}
            role="option"
            aria-selected={i === activeIdx}
          >
            <span className="navbar-search-item-icon">{r.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="navbar-search-item-name">{r.name}</div>
              <div className="navbar-search-item-desc">{r.desc?.slice(0, 55)}</div>
            </div>
            {r.popular && (
              <span style={{ fontSize: 9, fontWeight: 800, color: "#f59e0b", background: "#fef3c7", padding: "2px 6px", borderRadius: 100, flexShrink: 0 }}>
                HOT
              </span>
            )}
          </Link>
        );
      })}

      {noResults && (
        <div>
          <div style={{ padding: "10px 16px 6px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text3)" }}>
            No results — try these popular tools
          </div>
          {suggestions?.map((r) => (
            <Link key={r.id} to={`/calculator/${r.slug}`} className="navbar-search-item" role="option">
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
  );
}

function SearchBox({ isMobile, isOpen, onClose }: { isMobile: boolean; isOpen?: boolean; onClose?: () => void }) {
  const navigate = useNavigate();
  const { addSearchHistory } = useAppStore();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<CalculatorConfig[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loc = useLocation();

  useEffect(() => { setOpen(false); setQ(""); setActiveIdx(-1); }, [loc.pathname]);
  
  useEffect(() => {
    if (isMobile && isOpen) {
      inputRef.current?.focus();
    }
  }, [isMobile, isOpen]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!q.trim()) {
        setResults([]);
        setOpen(false);
        setActiveIdx(-1);
        return;
      }
      const r = searchCalculators(q);
      setResults(r);
      setOpen(true);
      setActiveIdx(-1);
    }, 120);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [q]);

  // Click outside to close
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIdx(-1);
        if (isMobile && onClose) {
           onClose();
        }
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [isMobile, onClose]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && !isMobile) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setOpen(false);
      setQ("");
      setActiveIdx(-1);
      if (isMobile && onClose) onClose();
    } else if (e.key === "Enter" && activeIdx >= 0 && results[activeIdx]) {
      e.preventDefault();
      addSearchHistory(q);
      navigate(`/calculator/${results[activeIdx].slug}`);
      setOpen(false);
      if (isMobile && onClose) onClose();
    } else if (e.key === "Enter" && q.trim() && results.length > 0 && activeIdx === -1) {
      e.preventDefault();
      addSearchHistory(q);
      navigate(`/calculator/${results[0].slug}`);
      setOpen(false);
      if (isMobile && onClose) onClose();
    }
  }, [open, activeIdx, results, q, addSearchHistory, isMobile, navigate, onClose]);

  if (isMobile && !isOpen) return null;

  if (isMobile) {
    return (
      <div className="navbar-mobile-search" ref={searchRef}>
        <div className="navbar-mobile-search-inner">
          <Search size={15} style={{ color: "var(--text3)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Search ${ALL_CALCULATORS.length}+ calculators…`}
            className="navbar-search-input"
            aria-label="Search calculators"
            aria-expanded={open}
            aria-haspopup="listbox"
            role="combobox"
            aria-controls="mobile-search-dropdown-list"
            aria-activedescendant={open && activeIdx >= 0 ? `mobile-search-dropdown-list-option-${activeIdx}` : undefined}
            autoComplete="off"
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
          <SearchDropdown results={results} query={q} activeIdx={activeIdx} listboxId="mobile-search-dropdown-list" />
        )}
      </div>
    );
  }

  return (
    <div ref={searchRef} className="navbar-search-desktop">
      <div className="navbar-search-box">
        <Search size={14} className="navbar-search-icon" />
        <input
          ref={inputRef}
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => q.trim() && setOpen(true)}
          placeholder="Search calculators…"
          className="navbar-search-input"
          aria-label="Search calculators"
          aria-expanded={open}
          aria-haspopup="listbox"
          role="combobox"
          aria-controls="desktop-search-dropdown-list"
          aria-activedescendant={open && activeIdx >= 0 ? `desktop-search-dropdown-list-option-${activeIdx}` : undefined}
          autoComplete="off"
        />
        {q && (
          <button
            onClick={() => { setQ(""); setOpen(false); inputRef.current?.focus(); }}
            className="navbar-search-clear"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
      {open && (
        <SearchDropdown results={results} query={q} activeIdx={activeIdx} listboxId="desktop-search-dropdown-list" />
      )}
    </div>
  );
}

export function Navbar() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useAppStore();
  const [mob, setMob]         = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => { setMob(false); setSearchOpen(false); }, [loc.pathname]);

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
              Calculators<span style={{ color: "#2563EB" }}>Point</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="navbar-nav" aria-label="Main navigation">
            {CATEGORIES.slice(0, 5).map(c => (
              <Link key={c.id} to={`/category/${c.id}`} className="nav-link">
                {c.icon} {t(`categories.${c.id}`, c.name)}
              </Link>
            ))}
            <Link to="/calculators" className="nav-link nav-link-all">
              {t('nav.calculators', 'All Tools')}
            </Link>
          </nav>

          {/* ── Right controls ── */}
          <div className="navbar-controls">

            {/* Desktop search */}
            <SearchBox isMobile={false} />

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

            {/* Language toggle */}
            <button
              onClick={() => i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es')}
              className="navbar-icon-btn desktop-only"
              aria-label="Toggle language"
              title="Toggle English / Español"
            >
              <span style={{ fontSize: 13, fontWeight: 700 }}>{i18n.language === 'es' ? 'ES' : 'EN'}</span>
            </button>

            {/* Auth toggle (Disabled for now) */}
            {/* ENABLE_FIREBASE_AUTH && (
              user ? (
                <button onClick={logout} className="navbar-icon-btn desktop-only" aria-label="Sign Out" title="Sign Out">
                  <span style={{ fontSize: 13, fontWeight: 700 }}>Out</span>
                </button>
              ) : (
                <button onClick={signInWithGoogle} className="navbar-icon-btn desktop-only" aria-label="Sign In" title="Sign In">
                  <span style={{ fontSize: 13, fontWeight: 700 }}>In</span>
                </button>
              )
            ) */}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="navbar-icon-btn"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Settings toggle */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="navbar-icon-btn desktop-only"
              aria-label="Settings"
            >
              <Settings size={16} />
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
        <SearchBox isMobile={true} isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </header>

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}

      {/* ── Mobile full-screen menu overlay ── */}
      {mob && (
        <div className="mob-overlay" onClick={() => setMob(false)} />
      )}
      <div className={`mob-menu-panel${mob ? " mob-menu-panel--open" : ""}`} aria-hidden={!mob}>
        {/* Category links */}
        <div className="mob-menu-section">
          <p className="mob-menu-section-title">Categories</p>
          {CATEGORIES.map(c => (
            <Link key={c.id} to={`/category/${c.id}`} className="mob-menu-link">
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
            <span>All {ALL_CALCULATORS.length}+ Tools</span>
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
          <button onClick={() => { setSettingsOpen(true); setMob(false); }} className="mob-menu-link" style={{ background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer" }}>
            <span>⚙️</span>
            <span>Settings</span>
            <ChevronRight size={14} style={{ marginLeft: "auto", color: "var(--text3)" }} />
          </button>
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
