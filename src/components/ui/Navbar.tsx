'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search, Moon, Sun, X, Calculator,
  ChevronRight, Settings, Sparkles, TrendingUp,
  Heart, FlaskConical, GraduationCap, LayoutGrid
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import {
  ALL_CALCULATORS, CATEGORIES, POPULAR,
  CalculatorConfig, CALC_COUNT_LABEL
} from "@/data/calculatorConfigs";
import { CurrencySelector } from './CurrencySelector';
import { SettingsModal } from './SettingsModal';
import { useFocusTrap } from '@/hooks/useFocusTrap';

/* ── Category icon map ───────────────────────────────────────── */
const CAT_ICONS: Record<string, React.ReactNode> = {
  finance:     <TrendingUp  size={13} strokeWidth={2.2} />,
  health:      <Heart       size={13} strokeWidth={2.2} />,
  math:        <FlaskConical size={13} strokeWidth={2.2} />,
  education:   <GraduationCap size={13} strokeWidth={2.2} />,
};

/* ── Fuzzy search ────────────────────────────────────────────── */
function searchCalculators(query: string): CalculatorConfig[] {
  if (!query?.trim()) return [];
  const lq = query.toLowerCase().trim();
  return ALL_CALCULATORS
    .map(c => {
      const nameL = c.name.toLowerCase();
      const descL = (c.desc || "").toLowerCase();
      let score = 0;
      if (nameL === lq)              score += 100;
      else if (nameL.startsWith(lq)) score += 60;
      else if (nameL.includes(lq))   score += 40;
      if (descL.includes(lq))        score += 15;
      if (c.keywords?.some(kw =>
        lq.includes(kw.toLowerCase()) || kw.toLowerCase().includes(lq)
      )) score += 50;
      if (c.popular) score += 5;
      return { calc: c, score };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.calc)
    .slice(0, 8);
}

/* ── Search Dropdown ─────────────────────────────────────────── */
function SearchDropdown({
  results, query, activeIdx,
  listboxId = "search-dropdown-list",
  dark,
}: {
  results: CalculatorConfig[];
  query: string;
  activeIdx: number;
  listboxId?: string;
  dark?: boolean;
}) {
  const noResults = query.trim().length > 1 && results.length === 0;
  const suggestions = noResults ? POPULAR.slice(0, 4) : null;

  return (
    <div
      className={`xnb-drop${dark ? " xnb-drop--dark" : ""}`}
      role="listbox"
      aria-label="Search results"
      id={listboxId}
    >
      {results.length > 0 && (
        <div className="xnb-drop-header">
          <span>Results for "<strong>{query}</strong>"</span>
          <span className="xnb-drop-count">{results.length} found</span>
        </div>
      )}
      {results.map((r, i) => (
        <Link
          key={r.id}
          id={`${listboxId}-option-${i}`}
          href={`/calculator/${r.slug}`}
          className={`xnb-drop-item${i === activeIdx ? " xnb-drop-item--active" : ""}`}
          role="option"
          aria-selected={i === activeIdx}
        >
          <span className="xnb-drop-icon">{r.icon}</span>
          <div className="xnb-drop-text">
            <div className="xnb-drop-name">{r.name}</div>
            <div className="xnb-drop-desc">{r.desc?.slice(0, 60)}</div>
          </div>
          {r.popular && <span className="xnb-drop-hot">🔥 HOT</span>}
        </Link>
      ))}
      {noResults && (
        <>
          <div className="xnb-drop-empty">No results — try these popular tools</div>
          {suggestions?.map(r => (
            <Link key={r.id} href={`/calculator/${r.slug}`} className="xnb-drop-item" role="option">
              <span className="xnb-drop-icon">{r.icon}</span>
              <div className="xnb-drop-text">
                <div className="xnb-drop-name">{r.name}</div>
                <div className="xnb-drop-desc">{r.desc?.slice(0, 55)}</div>
              </div>
            </Link>
          ))}
        </>
      )}
    </div>
  );
}

/* ── Search Box ──────────────────────────────────────────────── */
function SearchBox({
  isMobile, isOpen, onClose, dark,
}: {
  isMobile: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  dark?: boolean;
}) {
  const router = useRouter();
  const { addSearchHistory } = useAppStore();
  const [q, setQ]           = useState("");
  const [results, setResults] = useState<CalculatorConfig[]>([]);
  const [open, setOpen]     = useState(false);
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
    const h = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false); setActiveIdx(-1);
        if (isMobile && onClose) onClose();
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
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
      <div className="xnb-mob-search" ref={wrapRef}>
        <div className="xnb-mob-search-inner">
          <Search size={16} className="xnb-search-svg" aria-hidden="true" />
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Search ${CALC_COUNT_LABEL} calculators…`}
            className="xnb-search-input"
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
            <button onClick={() => { setQ(""); setOpen(false); }} className="xnb-clear" aria-label="Clear search">
              <X size={14} />
            </button>
          )}
        </div>
        {open && (
          <SearchDropdown results={results} query={q} activeIdx={activeIdx} listboxId={listboxId} />
        )}
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="xnb-search-wrap">
      <div className={`xnb-search-box${open ? " xnb-search-box--active" : ""}${dark ? " xnb-search-box--dark" : ""}`}>
        <Search size={14} className="xnb-search-svg" aria-hidden="true" />
        <input
          ref={inputRef}
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => q.trim() && setOpen(true)}
          placeholder="Search calculators…"
          className="xnb-search-input"
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
          <button
            onClick={() => { setQ(""); setOpen(false); inputRef.current?.focus(); }}
            className="xnb-clear"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        ) : (
          <kbd className="xnb-kbd">⌘K</kbd>
        )}
      </div>
      {open && (
        <SearchDropdown
          results={results}
          query={q}
          activeIdx={activeIdx}
          listboxId={listboxId}
          dark={dark}
        />
      )}
    </div>
  );
}

/* ── Main Navbar ─────────────────────────────────────────────── */
export function Navbar() {
  const { theme, toggleTheme } = useAppStore();
  const [mob, setMob]           = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mounted, setMounted]   = useState(false);
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
    const fn = () => setScrolled(window.scrollY > 6);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape" && mob) setMob(false); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [mob]);

  const isDark   = mounted && theme === "dark";
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════════════════ */}
      <header
        className={`xnb${scrolled ? " xnb--scrolled" : ""}`}
        role="banner"
      >
        {/* Subtle top shimmer line */}
        <div className="xnb-topline" aria-hidden="true" />

        <div className="xnb-inner">

          {/* ── Logo ── */}
          <Link href="/" className="xnb-logo" aria-label="Calculators Point home">
            <div className="xnb-logo-mark" aria-hidden="true">
              <div className="xnb-glow" />
              <Calculator size={18} strokeWidth={2.5} />
            </div>
            <span className="xnb-logo-text">
              Calculators<span className="xnb-logo-hi">Point</span>
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="xnb-nav" aria-label="Main navigation">
            {CATEGORIES.slice(0, 4).map(c => (
              <Link
                key={c.id}
                href={`/category/${c.id}`}
                className={`xnb-link${isActive(`/category/${c.id}`) ? " xnb-link--on" : ""}`}
              >
                <span className="xnb-link-dot" aria-hidden="true" />
                <span className="xnb-link-ico" aria-hidden="true">
                  {CAT_ICONS[c.id] ?? c.icon}
                </span>
                <span>{c.name}</span>
              </Link>
            ))}
            <Link
              href="/name-generators"
              className={`xnb-link${isActive("/name-generators") ? " xnb-link--on" : ""}`}
            >
              <span className="xnb-link-dot" aria-hidden="true" />
              <Sparkles size={12} strokeWidth={2.5} className="xnb-link-ico" aria-hidden="true" />
              <span>Generators</span>
            </Link>
          </nav>

          {/* ── Right controls ── */}
          <div className="xnb-controls">
            {/* Desktop search */}
            <SearchBox isMobile={false} dark={isDark} />

            {/* Currency */}
            <div className="xnb-donly">
              <CurrencySelector />
            </div>

            {/* Theme */}
            <button
              onClick={toggleTheme}
              className="xnb-icon"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Light mode" : "Dark mode"}
            >
              {mounted
                ? (isDark ? <Sun size={15} /> : <Moon size={15} />)
                : <Moon size={15} />}
            </button>

            {/* Settings */}
            <button
              ref={settingsBtnRef}
              onClick={() => setSettingsOpen(true)}
              className="xnb-icon xnb-donly"
              aria-label="Open settings"
              title="Settings"
            >
              <Settings size={15} />
            </button>

            {/* All Tools CTA */}
            <Link
              href="/calculators"
              className="xnb-cta xnb-donly"
              aria-label={`Browse all ${CALC_COUNT_LABEL} calculators`}
            >
              <LayoutGrid size={13} aria-hidden="true" />
              All Tools
            </Link>

            {/* Mobile: search toggle */}
            <button
              className="xnb-icon xnb-monly"
              onClick={() => setSearchOpen(s => !s)}
              aria-label={searchOpen ? "Close search" : "Search calculators"}
              aria-expanded={searchOpen}
            >
              {searchOpen ? <X size={17} /> : <Search size={17} />}
            </button>

            {/* Hamburger */}
            <button
              ref={hamburgerBtnRef}
              className={`xnb-burger${mob ? " xnb-burger--x" : ""}`}
              onClick={() => setMob(!mob)}
              aria-label={mob ? "Close menu" : "Open navigation menu"}
              aria-expanded={mob}
              aria-controls="xnb-panel"
            >
              <span className="xnb-bar" aria-hidden="true" />
              <span className="xnb-bar" aria-hidden="true" />
              <span className="xnb-bar" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <SearchBox
          isMobile={true}
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
        />
      </header>

      {/* Settings modal */}
      {settingsOpen && (
        <SettingsModal onClose={() => setSettingsOpen(false)} triggerRef={settingsBtnRef} />
      )}

      {/* Overlay */}
      <div
        className={`xnb-overlay${mob ? " xnb-overlay--on" : ""}`}
        onClick={() => setMob(false)}
        aria-hidden="true"
      />

      {/* ══════════════════════════════════════════════════════
          MOBILE SLIDE PANEL
      ══════════════════════════════════════════════════════ */}
      <div
        id="xnb-panel"
        ref={mobMenuRef}
        className={`xnb-panel${mob ? " xnb-panel--open" : ""}`}
        aria-hidden={!mob}
      >
        {/* Panel header */}
        <div className="xnb-panel-hd">
          <div>
            <Link href="/" className="xnb-logo" onClick={() => setMob(false)} aria-label="Home">
              <div className="xnb-logo-mark xnb-logo-mark--sm" aria-hidden="true">
                <div className="xnb-glow" />
                <Calculator size={15} strokeWidth={2.5} />
              </div>
              <span className="xnb-logo-text" style={{ fontSize: 15 }}>
                Calculators<span className="xnb-logo-hi">Point</span>
              </span>
            </Link>
            <p className="xnb-panel-tagline">Your go-to calculator suite</p>
          </div>
          <button className="xnb-panel-close" onClick={() => setMob(false)} aria-label="Close menu">
            <X size={17} />
          </button>
        </div>

        {/* Quick CTAs */}
        <div className="xnb-panel-ctas">
          <Link href="/calculators" className="xnb-panel-cta" onClick={() => setMob(false)} style={{ '--i': 0 } as React.CSSProperties}>
            <LayoutGrid size={14} /> All {CALC_COUNT_LABEL} Tools
          </Link>
          <Link href="/name-generators" className="xnb-panel-cta xnb-panel-cta--ghost" onClick={() => setMob(false)} style={{ '--i': 1 } as React.CSSProperties}>
            <Sparkles size={14} /> Generators
          </Link>
        </div>

        {/* Categories */}
        <div className="xnb-panel-section">
          <p className="xnb-panel-label">Categories</p>
          <nav aria-label="Calculator categories">
            {CATEGORIES.map((c, i) => (
              <Link
                key={c.id}
                href={`/category/${c.id}`}
                className={`xnb-panel-link${isActive(`/category/${c.id}`) ? " xnb-panel-link--on" : ""}`}
                onClick={() => setMob(false)}
                style={{ '--i': i + 2 } as React.CSSProperties}
              >
                <span className="xnb-panel-ico" aria-hidden="true">{c.icon}</span>
                <span>{c.name}</span>
                <ChevronRight size={14} className="xnb-panel-arrow" aria-hidden="true" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="xnb-panel-sep" />

        {/* Pages */}
        <div className="xnb-panel-section">
          <p className="xnb-panel-label">Pages</p>
          <nav aria-label="Site pages">
            {[
              { href: "/about",   icon: "ℹ️",  label: "About"   },
              { href: "/contact", icon: "✉️",  label: "Contact" },
              { href: "/blog",    icon: "📝",  label: "Blog"    },
            ].map(({ href, icon, label }, i) => (
              <Link
                key={href}
                href={href}
                className={`xnb-panel-link${isActive(href) ? " xnb-panel-link--on" : ""}`}
                onClick={() => setMob(false)}
                style={{ '--i': i + CATEGORIES.length + 2 } as React.CSSProperties}
              >
                <span className="xnb-panel-ico" aria-hidden="true">{icon}</span>
                <span>{label}</span>
                <ChevronRight size={14} className="xnb-panel-arrow" aria-hidden="true" />
              </Link>
            ))}
            <button
              className="xnb-panel-link"
              onClick={() => { setSettingsOpen(true); setMob(false); }}
              style={{ background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer", font: "inherit" }}
            >
              <span className="xnb-panel-ico" aria-hidden="true">⚙️</span>
              <span>Settings</span>
              <ChevronRight size={14} className="xnb-panel-arrow" aria-hidden="true" />
            </button>
          </nav>
        </div>

        <div className="xnb-panel-sep" />

        {/* Prefs */}
        <div className="xnb-panel-section">
          <p className="xnb-panel-label">Preferences</p>
          <div className="xnb-panel-prefs">
            <div className="xnb-panel-pref">
              <span className="xnb-panel-pref-lbl">Currency</span>
              <CurrencySelector />
            </div>
            <div className="xnb-panel-pref">
              <span className="xnb-panel-pref-lbl">Theme</span>
              <button
                onClick={toggleTheme}
                className="xnb-panel-theme"
                aria-label="Toggle theme"
              >
                {mounted
                  ? (isDark ? <><Sun size={13} /> Light</> : <><Moon size={13} /> Dark</>)
                  : <><Moon size={13} /> Dark</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
