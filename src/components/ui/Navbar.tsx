'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Moon, Sun, Menu, X, Calculator, ChevronRight, ChevronDown, Settings } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { ALL_CALCULATORS, CATEGORIES, POPULAR, CalculatorConfig, CALC_COUNT_LABEL } from "@/data/calculatorConfigs";
import { CurrencySelector } from './CurrencySelector';
import { SettingsModal } from './SettingsModal';
import { useFocusTrap } from '@/hooks/useFocusTrap';

/* ── Fuzzy-ish search: name + desc + keywords ──────────── */
function searchCalculators(query: string): CalculatorConfig[] {
  if (!query?.trim()) return [];
  const lq = query.toLowerCase().trim();

  const scored = ALL_CALCULATORS.map(c => {
    const nameL = c.name.toLowerCase();
    const descL = (c.desc || "").toLowerCase();
    let score = 0;

    if (nameL === lq)                         score += 100;
    else if (nameL.startsWith(lq))            score += 60;
    else if (nameL.includes(lq))             score += 40;
    
    if (descL.includes(lq))                  score += 15;
    
    if (c.keywords?.some(kw => lq.includes(kw.toLowerCase()) || kw.toLowerCase().includes(lq))) {
      score += 50;
    }
    
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
            href={`/calculator/${r.slug}`}
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
            <Link key={r.id} href={`/calculator/${r.slug}`} className="navbar-search-item" role="option">
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
  const router = useRouter();
  const { addSearchHistory } = useAppStore();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<CalculatorConfig[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  useEffect(() => { setOpen(false); setQ(""); setActiveIdx(-1); }, [pathname]);
  
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
      router.push(`/calculator/${results[activeIdx].slug}`);
      setOpen(false);
      if (isMobile && onClose) onClose();
    } else if (e.key === "Enter" && q.trim() && results.length > 0 && activeIdx === -1) {
      e.preventDefault();
      addSearchHistory(q);
      router.push(`/calculator/${results[0].slug}`);
      setOpen(false);
      if (isMobile && onClose) onClose();
    }
  }, [open, activeIdx, results, q, addSearchHistory, isMobile, router, onClose]);

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
            placeholder={`Search ${CALC_COUNT_LABEL} calculators…`}
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
              aria-label="Clear search"
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

/* ── Categories Dropdown ─────────────────────────────────────── */
function CategoriesDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Close on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // Close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);

  return (
    <div className="cat-dropdown-wrap" ref={ref}>
      <button
        className={`nav-link cat-dropdown-trigger${open ? ' cat-dropdown-trigger--open' : ''}`}
        onClick={() => setOpen(s => !s)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Browse categories"
      >
        <span aria-hidden="true">🗂️</span>{' '}Categories
        <ChevronDown size={13} className="cat-chevron" />
      </button>

      {open && (
        <div className="cat-dropdown" role="menu" aria-label="Categories menu">
          {/* Header */}
          <div className="cat-dropdown-header">
            <span className="cat-dropdown-title">Browse Categories</span>
            <Link href="/calculators" className="cat-dropdown-all-link" onClick={() => setOpen(false)}>
              All Tools →
            </Link>
          </div>

          {/* Category grid */}
          <div className="cat-dropdown-grid">
            {CATEGORIES.map(c => (
              <Link
                key={c.id}
                href={`/category/${c.id}`}
                className="cat-dropdown-item"
                role="menuitem"
                onClick={() => setOpen(false)}
                style={{ '--cat-color': c.color, '--cat-bg': c.bg } as React.CSSProperties}
              >
                <span className="cat-dropdown-icon">{c.icon}</span>
                <div className="cat-dropdown-info">
                  <span className="cat-dropdown-name">{c.name}</span>
                  <span className="cat-dropdown-desc">{c.desc}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer quick links */}
          <div className="cat-dropdown-footer">
            <Link href="/name-generators" className="cat-dropdown-footer-link" onClick={() => setOpen(false)}>
              <span>✨</span> Name Generators
            </Link>
            <Link href="/calculators" className="cat-dropdown-footer-link cat-dropdown-footer-link--primary" onClick={() => setOpen(false)}>
              <span>📊</span> View All Tools
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const { theme, toggleTheme } = useAppStore();
  const [mob, setMob]         = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Refs for focus management
  const settingsBtnRef  = useRef<HTMLButtonElement>(null);
  const hamburgerBtnRef = useRef<HTMLButtonElement>(null);
  const mobMenuPanelRef = useRef<HTMLDivElement>(null);

  // Focus trap for mobile menu
  useFocusTrap(mobMenuPanelRef, mob, hamburgerBtnRef);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => { setMob(false); setSearchOpen(false); }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle("mob-menu-open", mob);
    return () => { document.documentElement.classList.remove("mob-menu-open"); };
  }, [mob]);

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">

          {/* ── Logo ── */}
          <Link href="/" className="navbar-logo" aria-label="Calculators Point home">
            <div className="navbar-logo-icon">
              <Calculator size={21} color="#fff" strokeWidth={2.5} />
            </div>
            <span className="navbar-logo-text">
              Calculators<span style={{ color: "#2563EB" }}>Point</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="navbar-nav" aria-label="Main navigation">
            {/* Categories dropdown tab */}
            <CategoriesDropdown />
            {/* W6 fix: Name Generators in primary nav for crawl depth + PageRank */}
            <Link href="/name-generators" className="nav-link">
              <span aria-hidden="true">✨</span>{' '}Name Generators
            </Link>
            <Link href="/calculators" className="nav-link nav-link-all">
              All Tools
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


            {/* Theme toggle — render placeholder until mounted to avoid hydration mismatch */}
            <button
              onClick={toggleTheme}
              className="navbar-icon-btn"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {/* Render nothing until mounted so SSR and client initial render match */}
              {mounted ? (theme === "dark" ? <Sun size={16} /> : <Moon size={16} />) : <Moon size={16} />}
            </button>

            {/* Settings toggle */}
            <button
              ref={settingsBtnRef}
              onClick={() => setSettingsOpen(true)}
              className="navbar-icon-btn desktop-only"
              aria-label="Settings"
            >
              <Settings size={16} />
            </button>

            {/* Mobile hamburger */}
            <button
              ref={hamburgerBtnRef}
              className="navbar-icon-btn navbar-hamburger"
              onClick={() => setMob(!mob)}
              aria-label={mob ? "Close menu" : "Open menu"}
              aria-expanded={mob}
              aria-controls="mob-menu-panel"
            >
              {mob ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* ── Mobile search bar (expands below header) ── */}
        <SearchBox isMobile={true} isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </header>

      {settingsOpen && (
        <SettingsModal
          onClose={() => setSettingsOpen(false)}
          triggerRef={settingsBtnRef}
        />
      )}

      {/* ── Mobile full-screen menu overlay ── */}
      {mob && (
        <div className="mob-overlay" onClick={() => setMob(false)} />
      )}
      <div
        id="mob-menu-panel"
        ref={mobMenuPanelRef}
        className={`mob-menu-panel${mob ? " mob-menu-panel--open" : ""}`}
        aria-hidden={!mob}
      >
        {/* Category links */}
        <div className="mob-menu-section">
          <p className="mob-menu-section-title">Categories</p>
          {CATEGORIES.map(c => (
            <Link key={c.id} href={`/category/${c.id}`} className="mob-menu-link">
              <span className="mob-menu-link-icon" aria-hidden="true">{c.icon}</span>
              <span>{c.name}</span>
              <ChevronRight size={14} style={{ marginLeft: "auto", color: "var(--text3)" }} />
            </Link>
          ))}
        </div>

        <div className="mob-menu-divider" />

        {/* Quick links */}
        <div className="mob-menu-section">
          <p className="mob-menu-section-title">Quick Links</p>
          <Link href="/calculators" className="mob-menu-link mob-menu-link--featured">
            <span aria-hidden="true">📊</span>
            <span>All {CALC_COUNT_LABEL} Tools</span>
            <ChevronRight size={14} style={{ marginLeft: "auto" }} />
          </Link>
          <Link href="/name-generators" className="mob-menu-link mob-menu-link--featured">
            <span aria-hidden="true">✨</span>
            <span>Name Generators</span>
            <ChevronRight size={14} style={{ marginLeft: "auto" }} />
          </Link>
          <Link href="/about" className="mob-menu-link">
            <span aria-hidden="true">ℹ️</span>
            <span>About</span>
            <ChevronRight size={14} style={{ marginLeft: "auto", color: "var(--text3)" }} />
          </Link>
          <Link href="/contact" className="mob-menu-link">
            <span aria-hidden="true">✉️</span>
            <span>Contact</span>
            <ChevronRight size={14} style={{ marginLeft: "auto", color: "var(--text3)" }} />
          </Link>
          <button onClick={() => { setSettingsOpen(true); setMob(false); }} className="mob-menu-link" style={{ background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer" }}>
            <span aria-hidden="true">⚙️</span>
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
