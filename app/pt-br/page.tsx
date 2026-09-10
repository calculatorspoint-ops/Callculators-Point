/**
 * app/pt-br/page.tsx — Brazilian Portuguese Homepage (SSG)
 *
 * Portuguese equivalent of app/page.tsx
 * English homepage at / is UNCHANGED.
 * This page lives at /pt-br/
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { CATEGORIES, CALC_COUNT_LABEL, POPULAR, INDEXABLE_CALCULATORS } from '@/data/calculatorConfigs';
import { SITE_URL } from '@/config/site';
import { UI_PT_BR } from '@/data/pt-br/ui';

const PT_BR_URL = `${SITE_URL}/pt-br`;

export const metadata: Metadata = {
  title: {
    absolute: `Calculators Point — ${CALC_COUNT_LABEL} Calculadoras Online Grátis`,
  },
  description: `${CALC_COUNT_LABEL} calculadoras online gratuitas para finanças, saúde, matemática, educação e o dia a dia. Simulador de parcelas, IMC, juros compostos, média escolar — todas rápidas, precisas e gratuitas.`,
  alternates: {
    canonical: PT_BR_URL,
    languages: {
      'en': SITE_URL,
      'pt-BR': PT_BR_URL,
      'x-default': SITE_URL,
    },
  },
  openGraph: {
    title: `Calculators Point — ${CALC_COUNT_LABEL} Calculadoras Online Grátis`,
    description: `Simulador de parcelas, IMC, juros compostos, TDEE e mais de ${CALC_COUNT_LABEL} calculadoras. Rápidas, precisas e sempre gratuitas.`,
    url: PT_BR_URL,
    locale: 'pt_BR',
    type: 'website',
    siteName: 'Calculators Point',
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Calculators Point — Calculadoras Online Grátis' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Calculators Point — ${CALC_COUNT_LABEL} Calculadoras Online Grátis`,
    description: `Simulador de parcelas, IMC, juros compostos e mais de ${CALC_COUNT_LABEL} calculadoras grátis.`,
    images: [`${SITE_URL}/og-image.png`],
  },
};

const PT_BR_CATEGORIES = [
  { id: 'health',       name: UI_PT_BR.categories.health,       icon: '❤️', desc: UI_PT_BR.categoryDescs.health },
  { id: 'finance',      name: UI_PT_BR.categories.finance,      icon: '💰', desc: UI_PT_BR.categoryDescs.finance },
  { id: 'education',    name: UI_PT_BR.categories.education,    icon: '🎓', desc: UI_PT_BR.categoryDescs.education },
  { id: 'construction', name: UI_PT_BR.categories.construction, icon: '🏗️', desc: UI_PT_BR.categoryDescs.construction },
  { id: 'everyday',     name: UI_PT_BR.categories.everyday,     icon: '🏠', desc: UI_PT_BR.categoryDescs.everyday },
  { id: 'converters',   name: UI_PT_BR.categories.converters,   icon: '🔄', desc: UI_PT_BR.categoryDescs.converters },
  { id: 'technology',   name: UI_PT_BR.categories.technology,   icon: '💻', desc: UI_PT_BR.categoryDescs.technology },
  { id: 'business',     name: UI_PT_BR.categories.business,     icon: '📊', desc: UI_PT_BR.categoryDescs.business },
  { id: 'math',         name: UI_PT_BR.categories.math,         icon: '📐', desc: UI_PT_BR.categoryDescs.math },
];

export default function PtBrHomePage() {
  const popularCalcs = POPULAR.slice(0, 12);

  return (
    <div>
      {/* Hero */}
      <section className="hero" aria-label="Hero">
        <div className="hero-inner">
          <div className="hero-badge">
            <span>🇧🇷 Português Brasileiro</span>
            <span style={{ opacity: 0.6, marginLeft: 8 }}>|</span>
            <Link href="/" style={{ color: 'inherit', opacity: 0.7, marginLeft: 8, fontSize: 13 }}>English →</Link>
          </div>
          <h1 className="hero-title">
            Calculadoras Online Grátis
          </h1>
          <p className="hero-sub">
            {CALC_COUNT_LABEL} calculadoras para finanças, saúde, matemática, educação e o dia a dia. Rápidas, precisas e sempre gratuitas.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 24 }}>
            <Link href="/pt-br/calculators" className="btn btn-primary">
              Ver Todas as Calculadoras
            </Link>
            <Link href="/pt-br/category/finance" className="btn btn-secondary">
              Calculadoras Financeiras
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '48px 0' }} aria-label="Categorias">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: 8, fontSize: 28, fontWeight: 800 }}>
            Categorias
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text2)', marginBottom: 32 }}>
            Escolha uma categoria para encontrar a calculadora certa para você
          </p>
          <div className="cat-grid">
            {PT_BR_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/pt-br/category/${cat.id}`}
                className="cat-card"
                aria-label={cat.name}
              >
                <span className="cat-icon" aria-hidden="true">{cat.icon}</span>
                <div>
                  <div className="cat-name">{cat.name}</div>
                  <div className="cat-desc">{cat.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Calculators */}
      <section style={{ padding: '48px 0', background: 'var(--surface)' }} aria-label="Calculadoras Populares">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: 8, fontSize: 28, fontWeight: 800 }}>
            🔥 Calculadoras Mais Usadas
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text2)', marginBottom: 32 }}>
            As ferramentas mais acessadas pelos nossos usuários
          </p>
          <div className="calc-grid">
            {popularCalcs.map((calc) => (
              <Link
                key={calc.id}
                href={`/pt-br/calculator/${calc.slug}`}
                className="calc-card"
              >
                <span style={{ fontSize: 28 }}>{calc.icon}</span>
                <div>
                  <div className="calc-name">{calc.name}</div>
                  <div className="calc-desc">{calc.desc}</div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/pt-br/calculators" className="btn btn-primary">
              Ver Todas as {CALC_COUNT_LABEL} Calculadoras →
            </Link>
          </div>
        </div>
      </section>

      {/* Why Use Us */}
      <section style={{ padding: '48px 0' }} aria-label="Por que usar">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: 32, fontSize: 28, fontWeight: 800 }}>
            Por Que Usar a Calculators Point?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {[
              { icon: '🆓', title: '100% Gratuita', desc: 'Sem cadastro, sem plano premium. Todas as calculadoras são e sempre serão gratuitas.' },
              { icon: '🔒', title: 'Privacidade Garantida', desc: 'Nenhum dado seu é armazenado. Os cálculos ficam no seu dispositivo.' },
              { icon: '✅', title: 'Resultados Precisos', desc: 'Fórmulas verificadas por especialistas. Precisão profissional acessível para todos.' },
              { icon: '⚡', title: 'Super Rápida', desc: 'Carrega em menos de 2 segundos. Funciona até em conexões lentas.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ background: 'var(--surface)', borderRadius: 16, padding: 24, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>{title}</div>
                <div style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
