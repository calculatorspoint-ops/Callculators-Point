/**
 * app/pt-br/calculators/page.tsx
 * Brazilian Portuguese all-calculators index — /pt-br/calculators
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { CATEGORIES, INDEXABLE_CALCULATORS, CALC_COUNT_LABEL } from '@/data/calculatorConfigs';
import { SITE_URL } from '@/config/site';
import { UI_PT_BR } from '@/data/pt-br/ui';

const PT_BR_BASE = `${SITE_URL}/pt-br`;

export const metadata: Metadata = {
  title: `Todas as Calculadoras — ${CALC_COUNT_LABEL} Grátis | Calculators Point`,
  description: `Explore ${CALC_COUNT_LABEL} calculadoras online gratuitas: finanças, saúde, educação, construção e mais. Todas rápidas, precisas e sem precisar de cadastro.`,
  alternates: {
    canonical: `${PT_BR_BASE}/calculators`,
    languages: {
      'en': `${SITE_URL}/calculators`,
      'pt-BR': `${PT_BR_BASE}/calculators`,
      'x-default': `${SITE_URL}/calculators`,
    },
  },
};

const PT_BR_CAT_NAMES: Record<string, string> = {
  finance: UI_PT_BR.categories.finance,
  health: UI_PT_BR.categories.health,
  math: UI_PT_BR.categories.math,
  education: UI_PT_BR.categories.education,
  converters: UI_PT_BR.categories.converters,
  everyday: UI_PT_BR.categories.everyday,
  construction: UI_PT_BR.categories.construction,
  technology: UI_PT_BR.categories.technology,
  business: UI_PT_BR.categories.business,
};

export default function PtBrAllCalculatorsPage() {
  const byCategory = CATEGORIES.map((cat) => ({
    cat,
    calcs: INDEXABLE_CALCULATORS.filter((c) => c.cat === cat.id),
  }));

  return (
    <div className="all-calcs-page">
      <div className="container" style={{ padding: '48px 16px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
          Todas as Calculadoras
        </h1>
        <p style={{ color: 'var(--text2)', marginBottom: 40 }}>
          {CALC_COUNT_LABEL} calculadoras gratuitas organizadas por categoria
        </p>

        {byCategory.map(({ cat, calcs }) => (
          <section key={cat.id} style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 28 }}>{cat.icon}</span>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
                  {PT_BR_CAT_NAMES[cat.id] ?? cat.name}
                </h2>
                <Link
                  href={`/pt-br/category/${cat.id}`}
                  style={{ fontSize: 13, color: 'var(--brand)', textDecoration: 'none' }}
                >
                  Ver categoria →
                </Link>
              </div>
            </div>
            <div className="calc-grid">
              {calcs.map((calc) => (
                <Link
                  key={calc.id}
                  href={`/pt-br/calculator/${calc.slug}`}
                  className="calc-card"
                >
                  <span style={{ fontSize: 24 }}>{calc.icon}</span>
                  <div>
                    <div className="calc-name">{calc.name}</div>
                    <div className="calc-desc">{calc.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
