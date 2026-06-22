'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Moon, Sun, Menu, X, Calculator, ChevronRight, Settings, Sparkles } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { ALL_CALCULATORS, CATEGORIES, POPULAR, CalculatorConfig, CALC_COUNT_LABEL } from "@/data/calculatorConfigs";
import { CurrencySelector } from './CurrencySelector';
import { SettingsModal } from './SettingsModal';
import { useFocusTrap } from '@/hooks/useFocusTrap';

/* ─────────────────────────────────────────────────────────────────
   Fuzzy search helper
───────────────────────────────────────────────────────────────── */
function searchCalculators(query: string): CalculatorConfig[] {
  if (!query?.trim()) return [];
  const lq = query.toLowerCase().trim();
  return ALL_CALCULATORS
    .map(c => {
      const nameL = c.name.toLowerCase();
      const descL = (c.desc || "").toLowerCase();
      let score = 0;
      if (nameL === lq)               score += 100;
      else if (nameL.startsWith(lq))  score += 60;
      else if (nameL.includes(lq))    score += 40;
      if (descL.includes(lq))         score += 15;
      if (c.keywords?.some(kw => lq.includes(kw.toLowerCase()) || kw.toLowerCase().includes(lq))) score += 50;
      if (c.popular)                  score += 5;
      return { calc: c, score };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.calc)
    .slice(0, 8);
}

/* ─────────────────────────────────────────────────────────────────
   Search Dropdown
───────────────────────────────────────────────────────────────── */
function SearchDropdown({
  results, query, activeIdx, listboxId = "search-dropdown-list",
}: {
  results: CalculatorConfig[];
  query: string;
  activeIdx: number;
  listboxId?: string;
}) {
  const noResults = query.trim().length > 1 && results.length === 0;
  const suggestions = noResults ? POPULAR.slice(0, 4) : null;

  return (
    <div className="nb-drop" role="listbox" aria-label="Search results" id={listboxId}>
      {results.map((r, i) => (
        <Link
          key={r.id}
          id={`${listboxId}-option-${i}`}
          href={`/calculator/${r.slug}`}
          className={`nb-drop-item${i === activeIdx ? " nb-drop-item--active" : ""}`}
          role="option"
          aria-selected={i === activeIdx}
        >
          <span className="nb-drop-icon">{r.icon}</span>
          <div className="nb-drop-text">
            <div className="nb-drop-name">{r.name}</div>
            <div className="nb-drop-desc">{r.desc?.slice(0, 55)}</div>
          </div>
          {r.popular && <span className="nb-drop-hot">HOT</span>}
        </Link>
      ))}

      {noResults && (
        <>
          <div className="nb-drop-hint">No results — try these</div>
          {suggestions?.map(r => (
            <Link key={r.id} href={`/calculator/${r.slug}`} className="nb-drop-item" role="option">
              <span className="nb-drop-icon">{r.icon}</span>
              <div className="nb-drop-text">
                <div className="nb-drop-name">{r.name}</div>
                <div className="nb-drop-desc">{r.desc?.slice(0, 50)}</div>
              </div>
            </Link>
          ))}
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Search Box (desktop + mobile)
───────────────────────────────────────────────────────────────── */
function SearchBox({
  isMobile, isOpen, onClose,
}: {
  isMobile: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const router = useRouter();
  const { addSearchHistory } = useAppStore();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<CalculatorConfig[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef  = useRef<HTMLDivElement>(null);
  const debRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  useEffect(() => { setOpen(false); setQ(""); setActiveIdx(-1); }, [pathname]);
  useEffect(() => { if (isMobile && isOpen) inputRef.current?.focus(); }, [isMobile, isOpen]);

  useEffect(() => {
    if (debRef.current) clearTimeout(debRef.current);
    debRef.current = setTimeout(() => {
      if (!q.trim()) { setResults([]); setOpen(false); setActiveIdx(-1); return; }
      setResults(searchCalculators(q));
      setOpen(true);
      setActiveIdx(-1);
    }, 120);
    return () => { if (debRef.current) clearTimeout(debRef.current); };
  }, [q]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false); setActiveIdx(-1);
        if (isMobile && onClose) onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isMobile, onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && !isMobile) return;
    if (e.key === "ArrowDown") {
      e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setOpen(false); setQ(""); setActiveIdx(-1);
      if (isMobile && onClose) onClose();
    } else if (e.key === "Enter" && activeIdx >= 0 && results[activeIdx]) {
      e.preventDefault();
      addSearchHistory(q);
      router.push(`/calculator/${results[activeIdx].slug}`);
      setOpen(false); if (isMobile && onClose) onClose();
    } else if (e.key === "Enter" && q.trim() && results.length > 0 && activeIdx === -1) {
      e.preventDefault();
      addSearchHistory(q);
      router.push(`/calculator/${results[0].slug}`);
      setOpen(false); if (isMobile && onClose) onClose();
    }
  }, [open, activeIdx, results, q, addSearchHistory, isMobile, router, onClose]);

  const listboxId = isMobile ? "mob-search-list" : "desk-search-list";

  if (isMobile && !isOpen) return null;

  if (isMobile) {
    return (
      <div className="nb-mob-search" ref={wrapRef}>
        <div className="nb-mob-search-inner">
          <Search size={16} className="nb-search-icon-svg" aria-hidden="true" />
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Search ${CALC_COUNT_LABEL} calculators…`}
            className="nb-search-input"
            aria-label="Search calculators"
            aria-expanded={open}
            aria-haspopup="listbox"
            role="combobox"
            aria-controls={listboxId}
            aria-activedescendant={open && activeIdx >= 0 ? `${listboxId}-option-${activeIdx}` : undefined}
            autoComplete="off"
            spellCheck={false}
          />
          {q && (
            <button onClick={() => { setQ(""); setOpen(false); }} className="nb-search-clear" aria-label="Clear search">
              <X size={14} />
            </button>
          )}
        </div>
        {open && <SearchDropdown results={results} query={q} activeIdx={activeIdx} listboxId={listboxId} />}
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="nb-search-wrap">
      <div className={`nb-search-box${open ? " nb-search-box--open" : ""}`}>
        <Search size={14} className="nb-search-icon-svg" aria-hidden="true" />
        <input
          ref={inputRef}
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => q.trim() && setOpen(true)}
          placeholder="Search calculators…"
          className="nb-search-input"
          aria-label="Search calculators"
          aria-expanded={open}
          aria-haspopup="listbox"
          role="combobox"
          aria-controls={listboxId}
          aria-activedescendant={open && activeIdx >= 0 ? `${listboxId}-option-${activeIdx}` : undefined}
          autoComplete="off"
          spellCheck={false}
        />
        {q ? (
          <button onClick={() => { setQ(""); setOpen(false); inputRef.current?.focus(); }} className="nb-search-clear" aria-label="Clear search">
            <X size={14} />
          </button>
        ) : (
          <kbd className="nb-search-kbd">⌘K</kbd>
        )}
      </div>
      {open && <SearchDropdown results={results} query={q} activeIdx={activeIdx} listboxId={listboxId} />}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Main Navbar
───────────────────────────────────────────────────────────────── */
export function Navbar() {
  const { theme, toggleTheme } = useAppStore();
  const [mob, setMob] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const settingsBtnRef  = useRef<HTMLButtonElement>(null);
  const hamburgerBtnRef = useRef<HTMLButtonElement>(null);
  const mobMenuRef      = useRef<HTMLDivElement>(null);

  useFocusTrap(mobMenuRef, mob, hamburgerBtnRef);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { document.documentElement.classList.toggle("dark", theme === "dark"); }, [theme]);
  useEffect(() => { setMob(false); setSearchOpen(false); }, [pathname]);
  useEffect(() => {
    document.documentElement.classList.toggle("mob-menu-open", mob);
    return () => document.documentElement.classList.remove("mob-menu-open");
  }, [mob]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && mob) setMob(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mob]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ── HEADER ────────────────────────────────────────────── */}
      <header className={`nb${scrolled ? " nb--scrolled" : ""}`} role="banner">
        <div className="nb-inner">

          {/* Logo */}
          <Link href="/" className="nb-logo" aria-label="Calculators Point — home">
            <div className="nb-logo-mark" aria-hidden="true">
              <Calculator size={19} color="#fff" strokeWidth={2.5} />
            </div>
            <span className="nb-logo-text">
              Calculators<span className="nb-logo-accent">Point</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="nb-nav" aria-label="Main navigation">
            {CATEGORIES.slice(0, 4).map(c => (
              <Link
                key={c.id}
                href={`/category/${c.id}`}
                className={`nb-link${isActive(`/category/${c.id}`) ? " nb-link--active" : ""}`}
              >
                <span className="nb-link-icon" aria-hidden="true">{c.icon}</span>
                <span className="nb-link-label">{c.name}</span>
              </Link>
            ))}
            <Link
              href="/name-generators"
              className={`nb-link${isActive("/name-generators") ? " nb-link--active" : ""}`}
            >
              <Sparkles size={13} strokeWidth={2.5} className="nb-link-icon" aria-hidden="true" />
              <span className="nb-link-label">Generators</span>
            </Link>
          </nav>

          {/* Right controls */}
          <div className="nb-controls">
            {/* Desktop search */}
            <SearchBox isMobile={false} />

            {/* Currency — desktop only */}
            <div className="nb-desktop-only">
              <CurrencySelector />
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="nb-icon-btn"
              aria-label={mounted && theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={mounted && theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {mounted ? (theme === "dark" ? <Sun size={16} /> : <Moon size={16} />) : <Moon size={16} />}
            </button>

            {/* Settings — desktop only */}
            <button
              ref={settingsBtnRef}
              onClick={() => setSettingsOpen(true)}
              className="nb-icon-btn nb-desktop-only"
              aria-label="Open settings"
              title="Settings"
            >
              <Settings size={16} />
            </button>

            {/* All Tools CTA — desktop */}
            <Link href="/calculators" className="nb-cta nb-desktop-only" aria-label={`Browse all ${CALC_COUNT_LABEL} calculators`}>
              All Tools
            </Link>

            {/* Mobile search toggle */}
            <button
              className="nb-icon-btn nb-mob-only"
              onClick={() => setSearchOpen(s => !s)}
              aria-label={searchOpen ? "Close search" : "Search calculators"}
              aria-expanded={searchOpen}
            >
              {searchOpen ? <X size={17} /> : <Search size={17} />}
            </button>

            {/* Hamburger */}
            <button
              ref={hamburgerBtnRef}
              className={`nb-hamburger${mob ? " nb-hamburger--open" : ""}`}
              onClick={() => setMob(!mob)}
              aria-label={mob ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mob}
              aria-controls="nb-mob-panel"
            >
              <span className="nb-bar" aria-hidden="true" />
              <span className="nb-bar" aria-hidden="true" />
              <span className="nb-bar" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile search (expands below header bar) */}
        <SearchBox isMobile={true} isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </header>

      {/* Settings modal */}
      {settingsOpen && (
        <SettingsModal onClose={() => setSettingsOpen(false)} triggerRef={settingsBtnRef} />
      )}

      {/* Overlay */}
      <div
        className={`nb-overlay${mob ? " nb-overlay--on" : ""}`}
        onClick={() => setMob(false)}
        aria-hidden="true"
      />

      {/* ── MOBILE PANEL ──────────────────────────────────────── */}
      <div
        id="nb-mob-panel"
        ref={mobMenuRef}
        className={`nb-mob-panel${mob ? " nb-mob-panel--open" : ""}`}
        aria-hidden={!mob}
      >
        {/* Panel header */}
        <div className="nb-mob-hd">
          <Link href="/" className="nb-logo" onClick={() => setMob(false)} aria-label="Home">
            <div className="nb-logo-mark nb-logo-mark--sm" aria-hidden="true">
              <Calculator size={16} color="#fff" strokeWidth={2.5} />
            </div>
            <span className="nb-logo-text" style={{ fontSize: 15 }}>
              Calculators<span className="nb-logo-accent">Point</span>
            </span>
          </Link>
          <button className="nb-mob-close" onClick={() => setMob(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        {/* Quick action buttons */}
        <div className="nb-mob-actions">
          <Link href="/calculators" className="nb-mob-cta" onClick={() => setMob(false)}>
            📊 All {CALC_COUNT_LABEL} Tools
          </Link>
          <Link href="/name-generators" className="nb-mob-cta nb-mob-cta--ghost" onClick={() => setMob(false)}>
            ✨ Generators
          </Link>
        </div>

        {/* Categories */}
        <div className="nb-mob-section">
          <p className="nb-mob-label">Categories</p>
          <nav aria-label="Calculator categories">
            {CATEGORIES.map(c => (
              <Link
                key={c.id}
                href={`/category/${c.id}`}
                className={`nb-mob-link${isActive(`/category/${c.id}`) ? " nb-mob-link--active" : ""}`}
                onClick={() => setMob(false)}
              >
                <span className="nb-mob-ico" aria-hidden="true">{c.icon}</span>
                <span>{c.name}</span>
                <ChevronRight size={14} className="nb-mob-arrow" aria-hidden="true" />
              </Link>
            ))}
          </nav>
        </div>

        <hr className="nb-mob-sep" />

        {/* Pages */}
        <div className="nb-mob-section">
          <p className="nb-mob-label">Pages</p>
          <nav aria-label="Site pages">
            {[
              { href: "/about",   icon: "ℹ️",  label: "About"   },
              { href: "/contact", icon: "✉️",  label: "Contact" },
              { href: "/blog",    icon: "📝",  label: "Blog"    },
            ].map(({ href, icon, label }) => (
              <Link
                key={href}
                href={href}
                className={`nb-mob-link${isActive(href) ? " nb-mob-link--active" : ""}`}
                onClick={() => setMob(false)}
              >
                <span className="nb-mob-ico" aria-hidden="true">{icon}</span>
                <span>{label}</span>
                <ChevronRight size={14} className="nb-mob-arrow" aria-hidden="true" />
              </Link>
            ))}
            <button
              className="nb-mob-link"
              onClick={() => { setSettingsOpen(true); setMob(false); }}
              style={{ background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer", font: "inherit" }}
            >
              <span className="nb-mob-ico" aria-hidden="true">⚙️</span>
              <span>Settings</span>
              <ChevronRight size={14} className="nb-mob-arrow" aria-hidden="true" />
            </button>
          </nav>
        </div>

        <hr className="nb-mob-sep" />

        {/* Preferences */}
        <div className="nb-mob-section">
          <p className="nb-mob-label">Preferences</p>
          <div className="nb-mob-prefs">
            <div className="nb-mob-pref">
              <span className="nb-mob-pref-lbl">Currency</span>
              <CurrencySelector />
            </div>
            <div className="nb-mob-pref">
              <span className="nb-mob-pref-lbl">Theme</span>
              <button onClick={toggleTheme} className="nb-mob-theme-btn" aria-label="Toggle theme">
                {mounted
                  ? (theme === "dark" ? <><Sun size={14} /> Light</> : <><Moon size={14} /> Dark</>)
                  : <><Moon size={14} /> Dark</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
