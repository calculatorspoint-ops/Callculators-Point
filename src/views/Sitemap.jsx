'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';

import { ALL_CALCULATORS, CATEGORIES } from '@/data/calculatorConfigs';
import { SEO_LANDING_PAGES } from '@/data/seoLandingData';

/* ─────────────────────────────────────────────────────────────────
   Constants & helpers
   ───────────────────────────────────────────────────────────────── */

const NAME_GENERATOR_LINKS = [
  { to: '/name-generators', label: 'All Name Generators', icon: '✨' },
  { to: '/name-generators/baby-name-generator', label: 'Baby Name Generator', icon: '👶' },
  { to: '/name-generators/islamic-baby-names', label: 'Islamic Baby Names', icon: '🌙' },
  { to: '/name-generators/business-name-generator', label: 'Business Name Generator', icon: '🏢' },
  { to: '/name-generators/brand-name-generator', label: 'Brand Name Generator', icon: '🏷️' },
  { to: '/name-generators/youtube-channel-name-generator', label: 'YouTube Channel Name', icon: '▶️' },
  { to: '/name-generators/instagram-username-generator', label: 'Instagram Username', icon: '📸' },
  { to: '/name-generators/domain-name-generator', label: 'Domain Name Generator', icon: '🌐' },
  { to: '/name-generators/app-name-generator', label: 'App Name Generator', icon: '📱' },
];

const ECOSYSTEM_LINKS = [
  { to: '/ecosystem/finance', label: 'Finance Ecosystem', icon: '💰' },
  { to: '/ecosystem/fitness', label: 'Fitness Ecosystem', icon: '💪' },
  { to: '/ecosystem/education', label: 'Education Ecosystem', icon: '🎓' },
];

const CORE_LINKS = [
  { to: '/', label: 'Homepage', icon: '🏠' },
  { to: '/calculators', label: 'All Calculators', icon: '📊' },
  { to: '/cheat-sheets', label: 'Cheat Sheets', icon: '📝' },
  { to: '/about', label: 'About Us', icon: '👋' },
  { to: '/contact', label: 'Contact Us', icon: '✉️' },
  { to: '/privacy-policy', label: 'Privacy Policy', icon: '🔒' },
  { to: '/terms-of-service', label: 'Terms of Service', icon: '📜' },
  { to: '/disclaimer', label: 'Disclaimer', icon: '⚠️' },
  { to: '/sitemap', label: 'Sitemap (this page)', icon: '🗺️' },
];

function getTotalUrls() {
  const calcCount = ALL_CALCULATORS.filter(
    (c) => c.status !== 'coming-soon' && c.status !== 'draft'
  ).length;
  return (
    CORE_LINKS.length +
    CATEGORIES.length +
    calcCount +
    SEO_LANDING_PAGES.length +
    NAME_GENERATOR_LINKS.length +
    ECOSYSTEM_LINKS.length
  );
}

/* ─────────────────────────────────────────────────────────────────
   CollapsibleSection — Accordion group
   ───────────────────────────────────────────────────────────────── */

function CollapsibleSection({ title, icon, color, bg, links, defaultOpen = true, id }) {
  const [open, setOpen] = useState(defaultOpen);

  if (links.length === 0) return null;

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-xl, 16px)',
      overflow: 'hidden',
      marginBottom: 20,
      boxShadow: 'var(--sh1, 0 1px 3px rgba(0,0,0,.08))',
      transition: 'box-shadow .2s, border-color .2s',
    }} id={id}>
      {/* Header (toggles collapse) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 20px',
          background: bg,
          borderBottom: '1px solid var(--border)',
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'background .15s',
        }}
        onClick={() => setOpen((prev) => !prev)}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-controls={`section-${id}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((prev) => !prev);
          }
        }}
      >
        <span style={{ fontSize: 20 }}>{icon}</span>
        <h2 style={{
          fontSize: 15,
          fontWeight: 800,
          color,
          margin: 0,
          fontFamily: 'var(--font-hd, var(--font-inter, system-ui))',
          letterSpacing: '-.02em',
        }}>{title}</h2>
        <span style={{
          marginLeft: 'auto',
          fontSize: 11,
          fontWeight: 700,
          color,
          opacity: 0.7,
          fontFamily: 'var(--font-mono, monospace)',
          whiteSpace: 'nowrap',
        }}>{links.length} pages</span>
        <span style={{
          fontSize: 12,
          transition: 'transform .2s ease',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          color: 'var(--text3)',
          marginLeft: 8,
        }}>▼</span>
      </div>

      {/* Links grid (collapsible) */}
      {open && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          padding: 0,
          margin: 0,
        }} id={`section-${id}`}>
          {links.map(({ to, label, icon: linkIcon, badge, popular }) => (
            <Link
              key={to}
              href={to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 20px',
                fontSize: 13,
                color: 'var(--text2)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--bord2, rgba(0,0,0,.04))',
                borderRight: '1px solid var(--bord2, rgba(0,0,0,.04))',
                transition: 'all .15s ease',
                lineHeight: 1.4,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--brand-l)';
                e.currentTarget.style.color = 'var(--brand)';
                e.currentTarget.style.paddingLeft = '24px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text2)';
                e.currentTarget.style.paddingLeft = '20px';
              }}
            >
              {linkIcon && <span style={{ fontSize: 15, flexShrink: 0, width: 20, textAlign: 'center' }}>{linkIcon}</span>}
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
              {popular && <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#2563EB', flexShrink: 0,
                boxShadow: '0 0 4px rgba(37,99,235,.4)',
              }} title="Popular" />}
              {badge && <span style={{
                fontSize: 9, fontWeight: 800, padding: '1px 6px',
                borderRadius: 100, background: '#fef2f2', color: '#b91c1c',
                border: '1px solid #fecaca', flexShrink: 0,
                textTransform: 'uppercase', letterSpacing: '.06em',
              }}>{badge}</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Main Sitemap Component
   ───────────────────────────────────────────────────────────────── */

export default function Sitemap() {
  const [search, setSearch] = useState('');
  const q = search.toLowerCase().trim();

  const totalUrls = useMemo(() => getTotalUrls(), []);

  const liveCalculators = useMemo(
    () => ALL_CALCULATORS.filter((c) => c.status !== 'coming-soon' && c.status !== 'draft'),
    []
  );

  // Filtered helper
  const filterLinks = (links) =>
    q ? links.filter((l) => l.label.toLowerCase().includes(q)) : links;

  // Per-category calculator links
  const categoryCalcSections = useMemo(
    () =>
      CATEGORIES.map((cat) => {
        const calcs = liveCalculators.filter((c) => c.cat === cat.id);
        return {
          cat,
          links: calcs.map((c) => ({
            to: `/calculator/${c.slug}`,
            label: c.name,
            icon: c.icon || cat.icon,
            badge: c.isNew ? 'NEW' : null,
            popular: !!c.popular,
          })),
        };
      }),
    [liveCalculators]
  );

  // SEO pages
  const seoLinks = useMemo(
    () =>
      SEO_LANDING_PAGES.map((p) => ({
        to: `/tools/${p.slug}`,
        label: p.h1,
        icon: '🎯',
      })),
    []
  );

  return (
    <>
      {/* ── Hero Section ────────────────────────────────────────── */}
      <div className="page-hero">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🗺️</div>
          <h1>Sitemap</h1>
          <p>
            A complete map of every page on Calculators Point — {totalUrls.toLocaleString()} pages
            across {CATEGORIES.length} categories.
          </p>
        </div>
      </div>

      {/* ── Main Content ────────────────────────────────────────── */}
      <div className="page-wrap" style={{ maxWidth: 1100 }}>
        {/* Stats strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 12,
          marginBottom: 24,
        }}>
          {[
            { num: totalUrls.toLocaleString(), label: 'Total Pages' },
            { num: liveCalculators.length, label: 'Calculators' },
            { num: CATEGORIES.length, label: 'Categories' },
            { num: SEO_LANDING_PAGES.length, label: 'Tool Guides' },
            { num: NAME_GENERATOR_LINKS.length, label: 'Name Generators' },
          ].map(({ num, label }) => (
            <div key={label} style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-lg, 12px)',
              padding: '16px 14px',
              textAlign: 'center',
              boxShadow: 'var(--sh1, 0 1px 3px rgba(0,0,0,.06))',
            }}>
              <div style={{
                fontFamily: 'var(--font-hd, var(--font-inter, system-ui))',
                fontSize: 26, fontWeight: 900,
                color: 'var(--brand, #2563EB)',
                letterSpacing: '-.03em', lineHeight: 1,
              }}>{num}</div>
              <div style={{
                fontSize: 11, fontWeight: 600, color: 'var(--text3)',
                textTransform: 'uppercase', letterSpacing: '.05em', marginTop: 4,
              }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ marginBottom: 20, position: 'relative' }}>
          <span style={{
            position: 'absolute', left: 16, top: '50%',
            transform: 'translateY(-50%)', fontSize: 16,
            color: 'var(--text3)', pointerEvents: 'none',
          }}>🔍</span>
          <input
            type="text"
            placeholder="Search all pages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 44px',
              fontSize: 14,
              border: '2px solid var(--border)',
              borderRadius: 'var(--r-lg, 12px)',
              background: 'var(--surface)',
              color: 'var(--text)',
              outline: 'none',
              transition: 'border-color .15s, box-shadow .15s',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--brand)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,.12)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            aria-label="Search sitemap pages"
            id="sitemap-search"
          />
        </div>

        {/* ── Core Pages ────────────────────────────────────────── */}
        <CollapsibleSection
          id="core"
          title="Core Pages"
          icon="🏠"
          color="#1d4ed8"
          bg="#eff6ff"
          links={filterLinks(CORE_LINKS.map((l) => ({ ...l })))}
        />

        {/* ── Categories Directory ──────────────────────────────── */}
        <CollapsibleSection
          id="categories"
          title="Calculator Categories"
          icon="📂"
          color="#065f46"
          bg="#f0fdf4"
          links={filterLinks(
            CATEGORIES.map((cat) => ({
              to: `/category/${cat.id}`,
              label: cat.name,
              icon: cat.icon,
            }))
          )}
        />

        {/* ── Per-Category Calculators ──────────────────────────── */}
        {categoryCalcSections.map(({ cat, links }) => {
          const filtered = filterLinks(links);
          return (
            <CollapsibleSection
              key={cat.id}
              id={`cat-${cat.id}`}
              title={`${cat.name} Calculators`}
              icon={cat.icon}
              color={cat.color}
              bg={cat.bg}
              links={filtered}
              defaultOpen={!q ? true : filtered.length > 0}
            />
          );
        })}

        {/* ── SEO Landing Pages ─────────────────────────────────── */}
        {SEO_LANDING_PAGES.length > 0 && (
          <CollapsibleSection
            id="seo-tools"
            title="Specialized Tool Guides"
            icon="🎯"
            color="#7c3aed"
            bg="#f5f3ff"
            links={filterLinks(seoLinks)}
          />
        )}

        {/* ── Name Generators ───────────────────────────────────── */}
        <CollapsibleSection
          id="name-generators"
          title="Name Generators"
          icon="✨"
          color="#b45309"
          bg="#fffbeb"
          links={filterLinks(NAME_GENERATOR_LINKS)}
        />

        {/* ── Ecosystem Hubs ────────────────────────────────────── */}
        <CollapsibleSection
          id="ecosystems"
          title="Ecosystem Hubs"
          icon="🌐"
          color="#1e40af"
          bg="#dbeafe"
          links={filterLinks(ECOSYSTEM_LINKS)}
        />

        {/* ── XML Sitemap Banner ────────────────────────────────── */}
        <div style={{
          textAlign: 'center',
          padding: '28px 20px',
          background: 'linear-gradient(135deg, var(--brand-l, #EFF6FF), var(--brand-ll, #DBEAFE))',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-xl, 16px)',
          marginTop: 12,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 80% 50% at 20% 80%, rgba(37,99,235,.06) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 80% 20%, rgba(37,99,235,.05) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🤖</div>
            <p style={{
              fontSize: 14, color: 'var(--text2)',
              marginBottom: 12, fontWeight: 500,
            }}>
              For search engines — the machine-readable XML sitemap:
            </p>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: 14,
                color: '#fff',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                padding: '10px 24px',
                borderRadius: 10,
                textDecoration: 'none',
                boxShadow: '0 2px 12px rgba(37,99,235,.3)',
                transition: 'transform .15s, box-shadow .15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,99,235,.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(37,99,235,.3)';
              }}
            >
              <span>📄</span>
              <span>sitemap.xml</span>
              <span style={{ fontSize: 12, opacity: 0.7 }}>↗</span>
            </a>
            <p style={{
              fontSize: 12, color: 'var(--text3)', marginTop: 12,
              fontFamily: 'var(--font-mono, monospace)',
            }}>
              {totalUrls.toLocaleString()} indexed URLs · Updated{' '}
              {new Date().toLocaleDateString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* ── Search Console Info Banner ─────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 12, marginTop: 16, marginBottom: 8,
        }}>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg, 12px)',
            padding: '16px 20px',
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>✅</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                Search Console Compliant
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.5 }}>
                XML sitemap follows sitemaps.org 0.9 protocol, uses ISO 8601 dates, and includes
                only indexable pages with accurate lastmod timestamps.
              </div>
            </div>
          </div>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg, 12px)',
            padding: '16px 20px',
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>🔄</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                Auto-Synced with Routes
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.5 }}>
                Adding a new calculator or page automatically includes it in both the XML sitemap
                and this human-readable page. Zero manual maintenance.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
