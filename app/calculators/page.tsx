import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ALL_CALCULATORS,
  CATEGORIES,
  CALC_COUNT_LABEL,
  LIVE_CALC_COUNT,
  INDEXABLE_CALCULATORS,
} from '@/data/calculatorConfigs';
import { SITE_URL } from '@/config/site';
import { JsonLd } from '@/components/JsonLd';

type SearchParams = Promise<{
  q?: string;
  category?: string;
}>;

export const metadata: Metadata = {
  title: `All ${CALC_COUNT_LABEL} Free Online Calculators`,
  description: `Browse all ${CALC_COUNT_LABEL} free online calculators for finance, health, math, education, converters, and everyday tools. Instant results, step-by-step formulas, no sign-up.`,
  alternates: { canonical: `${SITE_URL}/calculators` },
  openGraph: {
    title: `All ${CALC_COUNT_LABEL} Free Online Calculators | Calculators Point`,
    description: `${CALC_COUNT_LABEL} free calculators for finance, health, math, education, and everyday life.`,
    url: `${SITE_URL}/calculators`,
    type: 'website',
    siteName: 'Calculators Point',
    images: [{
      url: `${SITE_URL}/api/og?title=${encodeURIComponent(`All ${CALC_COUNT_LABEL} Free Calculators`)}&icon=${encodeURIComponent('🧮')}&cat=${encodeURIComponent('All Calculators')}`,
      width: 1200,
      height: 630,
      alt: `All ${CALC_COUNT_LABEL} Free Online Calculators`,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `All ${CALC_COUNT_LABEL} Free Online Calculators | Calculators Point`,
    description: `${CALC_COUNT_LABEL} free calculators for finance, health, math, education, and everyday life.`,
  },
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': `${SITE_URL}/calculators#breadcrumb`,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'All Calculators', item: `${SITE_URL}/calculators` },
  ],
};

const collectionPage = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${SITE_URL}/calculators#webpage`,
  name: `All ${CALC_COUNT_LABEL} Free Online Calculators`,
  description: `A comprehensive collection of ${LIVE_CALC_COUNT} free online calculators covering finance, health, math, education, converters, everyday, construction, technology, and business tools.`,
  url: `${SITE_URL}/calculators`,
  isPartOf: { '@id': `${SITE_URL}/#website` },
  breadcrumb: { '@id': `${SITE_URL}/calculators#breadcrumb` },
  inLanguage: 'en-US',
  dateModified: new Date().toISOString().slice(0, 10),
  numberOfItems: LIVE_CALC_COUNT,
  hasPart: INDEXABLE_CALCULATORS.slice(0, 80).map((c) => ({
    '@type': 'WebApplication',
    name: c.name,
    url: `${SITE_URL}/calculator/${c.slug}`,
    description: c.desc,
    isAccessibleForFree: true,
    applicationCategory: 'UtilitiesApplication',
  })),
};

const pageStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #07111f 0%, #0f172a 44%, #111827 100%)',
  color: '#f8fafc',
} as const;

const wrapStyle = {
  width: 'min(1180px, calc(100% - 32px))',
  margin: '0 auto',
} as const;

const cardStyle = {
  display: 'grid',
  gridTemplateColumns: '44px 1fr auto',
  gap: 14,
  alignItems: 'center',
  padding: 18,
  minHeight: 118,
  borderRadius: 14,
  border: '1px solid rgba(148,163,184,.22)',
  background: 'rgba(15,23,42,.72)',
  color: 'inherit',
  textDecoration: 'none',
  boxShadow: '0 16px 40px rgba(2,6,23,.18)',
} as const;

export default async function AllCalculatorsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const q = (params.q ?? '').trim().toLowerCase();
  const categoryId = params.category ?? 'all';
  const activeCategory = CATEGORIES.some((c) => c.id === categoryId) ? categoryId : 'all';

  const filtered = ALL_CALCULATORS.filter((calc) => {
    const matchesCategory = activeCategory === 'all' || calc.cat === activeCategory;
    const matchesQuery = !q ||
      calc.name.toLowerCase().includes(q) ||
      calc.desc.toLowerCase().includes(q) ||
      calc.slug.toLowerCase().includes(q) ||
      calc.keywords?.some((keyword) => keyword.toLowerCase().includes(q));

    return matchesCategory && matchesQuery && calc.status !== 'coming-soon' && calc.status !== 'draft';
  });

  const queryPrefix = q ? `?q=${encodeURIComponent(q)}&` : '?';

  return (
    <main style={pageStyle}>
      <JsonLd data={[breadcrumb, collectionPage]} idPrefix="all-calcs" />

      <section style={{ ...wrapStyle, padding: '64px 0 30px' }}>
        <p style={{ color: '#38bdf8', fontSize: 13, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', margin: '0 0 12px' }}>
          All tools
        </p>
        <h1 style={{ margin: 0, fontSize: 'clamp(36px, 6vw, 68px)', lineHeight: 1.02, letterSpacing: 0, maxWidth: 820 }}>
          {CALC_COUNT_LABEL} Free Online Calculators
        </h1>
        <p style={{ maxWidth: 760, margin: '18px 0 0', color: 'rgba(226,232,240,.76)', fontSize: 17, lineHeight: 1.7 }}>
          Browse every Calculators Point tool in one crawlable, fast-loading index. Filter by category or search for finance, health, math, education, everyday, construction, technology, and business calculators.
        </p>
      </section>

      <section style={{ ...wrapStyle, position: 'sticky', top: 0, zIndex: 4, padding: '14px 0', background: 'rgba(7,17,31,.92)', backdropFilter: 'blur(12px)' }} aria-label="Calculator search and filters">
        <form action="/calculators" style={{ display: 'grid', gap: 12 }}>
          <label htmlFor="calculator-search" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
            Search calculators
          </label>
          <input
            id="calculator-search"
            name="q"
            type="search"
            defaultValue={params.q ?? ''}
            placeholder="Search calculators..."
            style={{
              width: '100%',
              minHeight: 52,
              borderRadius: 12,
              border: '1px solid rgba(148,163,184,.28)',
              background: 'rgba(15,23,42,.9)',
              color: '#fff',
              padding: '0 16px',
              fontSize: 16,
              outline: 'none',
            }}
          />
          {activeCategory !== 'all' && <input type="hidden" name="category" value={activeCategory} />}
        </form>

        <nav aria-label="Calculator categories" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingTop: 12 }}>
          <Link href={q ? `/calculators?q=${encodeURIComponent(q)}` : '/calculators'} style={filterStyle(activeCategory === 'all')}>
            All
          </Link>
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/calculators${queryPrefix}category=${category.id}`}
              style={filterStyle(activeCategory === category.id)}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </Link>
          ))}
        </nav>
      </section>

      <section style={{ ...wrapStyle, padding: '28px 0 80px' }}>
        <p style={{ color: 'rgba(226,232,240,.7)', margin: '0 0 20px', fontSize: 14 }}>
          Showing {filtered.length} calculators
        </p>

        {CATEGORIES.map((category) => {
          const calcs = filtered.filter((calc) => calc.cat === category.id);
          if (!calcs.length) return null;

          return (
            <section key={category.id} style={{ marginBottom: 44 }}>
              {(activeCategory === 'all') && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <h2 style={{ margin: 0, fontSize: 24, letterSpacing: 0 }}>
                    <span style={{ marginRight: 8 }}>{category.icon}</span>{category.name}
                  </h2>
                  <span style={{ flex: 1, height: 1, background: 'rgba(148,163,184,.24)' }} />
                  <span style={{ color: 'rgba(226,232,240,.62)', fontSize: 13 }}>{calcs.length}</span>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 14 }}>
                {calcs.map((calc) => (
                  <Link key={calc.id} href={`/calculator/${calc.slug}`} style={cardStyle}>
                    <span aria-hidden="true" style={{ fontSize: 28, lineHeight: 1 }}>{calc.icon}</span>
                    <span style={{ minWidth: 0 }}>
                      <strong style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', color: '#fff', fontSize: 16, marginBottom: 6 }}>
                        {calc.name}
                        {calc.popular && <span style={badgeStyle('#f59e0b')}>Popular</span>}
                        {calc.isNew && <span style={badgeStyle('#22c55e')}>New</span>}
                      </strong>
                      <span style={{ display: 'block', color: 'rgba(226,232,240,.68)', fontSize: 13, lineHeight: 1.55 }}>
                        {calc.desc}
                      </span>
                    </span>
                    <span aria-hidden="true" style={{ color: '#38bdf8', fontSize: 22 }}>›</span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {!filtered.length && (
          <div style={{ padding: 32, borderRadius: 14, border: '1px solid rgba(148,163,184,.24)', background: 'rgba(15,23,42,.72)', textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 8px', fontSize: 22 }}>No calculators found</h2>
            <p style={{ margin: 0, color: 'rgba(226,232,240,.7)' }}>Try another search term or choose a different category.</p>
          </div>
        )}
      </section>
    </main>
  );
}

function filterStyle(active: boolean) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    minHeight: 38,
    padding: '0 14px',
    borderRadius: 999,
    border: active ? '1px solid rgba(56,189,248,.72)' : '1px solid rgba(148,163,184,.22)',
    background: active ? 'rgba(56,189,248,.16)' : 'rgba(15,23,42,.72)',
    color: active ? '#e0f2fe' : 'rgba(226,232,240,.72)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    fontSize: 13,
    fontWeight: 700,
  } as const;
}

function badgeStyle(color: string) {
  return {
    color,
    border: `1px solid ${color}55`,
    background: `${color}18`,
    borderRadius: 999,
    padding: '2px 8px',
    fontSize: 10,
    lineHeight: 1.5,
    textTransform: 'uppercase',
    letterSpacing: '.04em',
  } as const;
}
