/**
 * app/pt-br/category/[cat]/page.tsx
 * Brazilian Portuguese category pages — /pt-br/category/[cat]
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES, INDEXABLE_CALCULATORS } from '@/data/calculatorConfigs';
import { SITE_URL } from '@/config/site';
import { UI_PT_BR } from '@/data/pt-br/ui';

const PT_BR_BASE = `${SITE_URL}/pt-br`;

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ cat: cat.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ cat: string }> }
): Promise<Metadata> {
  const { cat: catId } = await params;
  const cat = CATEGORIES.find(c => c.id === catId);
  if (!cat) return { title: 'Categoria não encontrada' };

  const catNamePtBr = UI_PT_BR.categories[catId as keyof typeof UI_PT_BR.categories] ?? cat.name;
  const catDescPtBr = UI_PT_BR.categoryDescs[catId as keyof typeof UI_PT_BR.categoryDescs] ?? cat.desc;
  const count = INDEXABLE_CALCULATORS.filter(c => c.cat === catId).length;

  return {
    title: `Calculadoras de ${catNamePtBr} — ${count}+ Grátis | Calculators Point`,
    description: `${count}+ calculadoras gratuitas de ${catNamePtBr.toLowerCase()}. ${catDescPtBr}. Todas online, sem cadastro.`,
    alternates: {
      canonical: `${PT_BR_BASE}/category/${catId}`,
      languages: {
        'en': `${SITE_URL}/category/${catId}`,
        'pt-BR': `${PT_BR_BASE}/category/${catId}`,
        'x-default': `${SITE_URL}/category/${catId}`,
      },
    },
    openGraph: {
      title: `${catNamePtBr} — Calculadoras Online Grátis`,
      description: `${count}+ calculadoras de ${catNamePtBr.toLowerCase()}: ${catDescPtBr}`,
      locale: 'pt_BR',
      url: `${PT_BR_BASE}/category/${catId}`,
    },
  };
}

export default async function PtBrCategoryPage({
  params,
}: {
  params: Promise<{ cat: string }>;
}) {
  const { cat: catId } = await params;
  const cat = CATEGORIES.find(c => c.id === catId);
  if (!cat) notFound();

  const catNamePtBr = UI_PT_BR.categories[catId as keyof typeof UI_PT_BR.categories] ?? cat.name;
  const catDescPtBr = UI_PT_BR.categoryDescs[catId as keyof typeof UI_PT_BR.categoryDescs] ?? cat.desc;
  const calcs = INDEXABLE_CALCULATORS.filter(c => c.cat === catId);

  return (
    <div>
      {/* Category Hero */}
      <section className="calc-page-head" aria-label={catNamePtBr}>
        <div className="cph-inner">
          <nav className="cph-breadcrumb" aria-label="Breadcrumb">
            <Link href="/pt-br">Início</Link>
            <span className="cph-breadcrumb-sep" aria-hidden="true">›</span>
            <span aria-current="page">{cat.icon} {catNamePtBr}</span>
          </nav>
          <h1 className="cph-title">{cat.icon} {catNamePtBr}</h1>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 15, marginTop: 8 }}>
            {catDescPtBr} — {calcs.length} calculadoras gratuitas
          </p>
        </div>
      </section>

      {/* Calculator Grid */}
      <div className="container" style={{ padding: '40px 16px' }}>
        <div className="calc-grid">
          {calcs.map((calc) => (
            <Link
              key={calc.id}
              href={`/pt-br/calculator/${calc.slug}`}
              className="calc-card"
            >
              <span style={{ fontSize: 28 }}>{calc.icon}</span>
              <div>
                <div className="calc-name">{calc.name}</div>
                <div className="calc-desc">{calc.desc}</div>
                {calc.popular && (
                  <span className="badge badge-amber" style={{ marginTop: 6 }}>
                    {UI_PT_BR.badges.popular}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Back to all categories */}
        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <Link href="/pt-br/calculators" style={{ color: 'var(--brand)', fontWeight: 600 }}>
            ← Ver todas as categorias
          </Link>
        </div>
      </div>
    </div>
  );
}
