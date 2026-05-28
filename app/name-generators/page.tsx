import type { Metadata } from 'next';
import Link from 'next/link';
import { toolsConfig } from '@/data/name-generators/tools-config';

export const metadata: Metadata = {
  title: 'Free Name Generator Tools — Baby, Business, Brand, YouTube, Instagram & More',
  description:
    'Free online name generators for baby names, Islamic names, business names, brand names, YouTube channels, Instagram usernames, domain names, and app names. Instant results, 100% free.',
  keywords:
    'name generator, baby name generator, business name generator, brand name generator, youtube channel name generator, instagram username generator, domain name generator, app name generator',
  openGraph: {
    title: 'Free Name Generator Tools — 8 Professional Generators',
    description:
      'Generate the perfect name for your baby, business, brand, YouTube channel, Instagram, domain, or app. Free and instant.',
    url: 'https://calculatorspoint.com/name-generators',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Name Generator Tools — Baby, Business, Brand & More',
    description: '8 free name generators: baby names, Islamic names, business, brand, YouTube, Instagram, domain & app names. Instant results.',
    images: ['https://calculatorspoint.com/api/og?title=Name+Generator+Tools&icon=✨&cat=8+Free+Generators'],
  },
  alternates: { canonical: 'https://calculatorspoint.com/name-generators' },
};

const CATEGORY_LABELS: Record<string, string> = {
  personal: '👨‍👩‍👧 Personal Names',
  business: '💼 Business & Brand',
  digital: '🌐 Digital & Social',
};

function resolveGradientColor(color: string): string {
  if (color.includes('pink')) return '#ec4899';
  if (color.includes('emerald')) return '#10b981';
  if (color.includes('blue')) return '#3b82f6';
  if (color.includes('purple')) return '#8b5cf6';
  if (color.includes('red')) return '#ef4444';
  if (color.includes('fuchsia')) return '#d946ef';
  if (color.includes('cyan')) return '#06b6d4';
  return '#f59e0b';
}

export default function NameGeneratorsHub() {
  const categories = ['personal', 'business', 'digital'];

  return (
    <main className="ng-page">
      {/* ── Hero ── */}
      <div className="ng-hub-hero">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: '100px',
              background: 'rgba(99,102,241,.1)',
              border: '1px solid rgba(99,102,241,.3)',
              color: '#6366f1',
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            ✨ 8 Free Generator Tools
          </div>

          <h1 className="ng-hub-title">
            Name Generator
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Tools
            </span>
          </h1>

          <p className="ng-hub-subtitle">
            Professional name generators for every need. Find the perfect name for your baby,
            business, brand, YouTube channel, Instagram profile, domain, or app — all for free.
          </p>

          {/* Trust badges */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              justifyContent: 'center',
              marginBottom: 40,
            }}
          >
            {[
              { icon: '✓', label: '100% Free Forever' },
              { icon: '⚡', label: 'Instant Generation' },
              { icon: '🔒', label: 'No Account Needed' },
              { icon: '📋', label: 'Copy & Export Names' },
              { icon: '❤️', label: 'Save Favorites' },
            ].map((b) => (
              <span key={b.label} className="ng-trust-badge">
                <span>{b.icon}</span> {b.label}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="ng-hub-stats">
          <div className="ng-hub-stat">
            <div className="ng-hub-stat-num">8</div>
            <div className="ng-hub-stat-label">Generator Tools</div>
          </div>
          <div className="ng-hub-stat">
            <div className="ng-hub-stat-num">500+</div>
            <div className="ng-hub-stat-label">Baby Names</div>
          </div>
          <div className="ng-hub-stat">
            <div className="ng-hub-stat-num">∞</div>
            <div className="ng-hub-stat-label">Generated Results</div>
          </div>
          <div className="ng-hub-stat">
            <div className="ng-hub-stat-num">100%</div>
            <div className="ng-hub-stat-label">Free to Use</div>
          </div>
        </div>
      </div>

      {/* ── Tool Categories ── */}
      <div className="ng-container" style={{ paddingBottom: 80 }}>
        {categories.map((cat) => {
          const catTools = toolsConfig.filter((t) => t.category === cat);
          if (catTools.length === 0) return null;

          return (
            <div key={cat} className="ng-hub-category">
              <div className="ng-hub-category-title">{CATEGORY_LABELS[cat]}</div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 20,
                }}
              >
                {catTools.map((tool) => {
                  const accentColor = resolveGradientColor(tool.color);
                  return (
                    <Link
                      key={tool.id}
                      href={`/name-generators/${tool.slug}`}
                      className="ng-tool-card"
                      aria-label={`${tool.title} — ${tool.description}`}
                      style={
                        {
                          textDecoration: 'none',
                          '--tool-accent': accentColor,
                        } as React.CSSProperties
                      }
                    >
                      <span className="ng-tool-icon">{tool.icon}</span>
                      <h2 className="ng-tool-name">{tool.title}</h2>
                      <p className="ng-tool-desc">{tool.description}</p>
                      <div className="ng-tool-tags">
                        {tool.keywords.slice(0, 3).map((kw) => (
                          <span key={kw} className="ng-tool-tag">
                            {kw}
                          </span>
                        ))}
                      </div>
                      <div className="ng-tool-arrow" aria-hidden="true">
                        →
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* ── SEO content block ── */}
        <div
          style={{
            marginTop: 64,
            padding: '48px 0',
            borderTop: '1px solid var(--ng-border)',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
            <span className="ng-section-label">Why Use Our Tools</span>
            <h2
              className="ng-section-title"
              style={{ textAlign: 'center' }}
            >
              Professional Name Generators — Free Forever
            </h2>
            <p
              className="ng-section-desc"
              style={{ textAlign: 'center', margin: '0 auto' }}
            >
              Our name generator tools are designed by experts to help you find the perfect name
              quickly. Whether you need baby names with cultural meanings, professional business
              names, or catchy digital handles — we have a tool for every purpose.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 20,
              marginTop: 40,
            }}
          >
            {[
              {
                icon: '🎯',
                title: 'Targeted Results',
                desc: 'Filter by gender, origin, style, industry, and more to get exactly what you need.',
              },
              {
                icon: '📊',
                title: 'Name Score System',
                desc: 'Every generated name gets a score for memorability, brandability, SEO potential, and more.',
              },
              {
                icon: '❤️',
                title: 'Save Favorites',
                desc: 'Save your favorite names locally and export them as CSV or print your shortlist.',
              },
              {
                icon: '🌍',
                title: 'Multi-Cultural',
                desc: 'Names from Arabic, English, Urdu, Turkish, Persian, Indian, and modern origins.',
              },
            ].map((f) => (
              <div key={f.title} className="ng-step" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
                <div className="ng-step-title" style={{ marginBottom: 8 }}>
                  {f.title}
                </div>
                <div className="ng-step-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
