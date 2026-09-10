/**
 * src/components/calculator-core/SEOContentSectionPtBr.tsx
 *
 * Brazilian Portuguese SEO content section.
 * Mirrors SEOContentSection.tsx but renders all headings, labels and
 * disclaimer text in Brazilian Portuguese.
 *
 * Falls back gracefully to English content for any untranslated field.
 */
import Link from 'next/link';
import { CATEGORIES, getRelatedCalcs } from '@/data/calculatorConfigs';
import type { CalculatorConfig } from '@/data/calculatorConfigs';
import { UI_PT_BR } from '@/data/pt-br/ui';

interface SEOContentSectionPtBrProps {
  calc: CalculatorConfig;
  lastUpdated?: string;
}

// Portuguese disclaimers per category
const DISCLAIMERS_PT_BR: Record<string, string> = {
  health: UI_PT_BR.disclaimers.health,
  finance: UI_PT_BR.disclaimers.finance,
  education: UI_PT_BR.disclaimers.education,
  business: UI_PT_BR.disclaimers.business,
};

const DISCLAIMER_CATS = new Set(['health', 'finance', 'education', 'business']);
const YMYL_CATS = new Set(['health', 'finance', 'business']);

function AuthorBylinePtBr({ lastUpdated }: { lastUpdated: string }) {
  return (
    <div
      className="seo-block"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 10, padding: '10px 16px',
        background: 'var(--surface2, rgba(0,0,0,.04))',
        borderRadius: 10, border: '1px solid var(--border)',
        fontSize: 12, color: 'var(--text3)', marginBottom: 0,
      }}
      aria-label="Informações de autoria e atualização do conteúdo"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 16 }}>✍️</span>
        <span>
          <strong style={{ color: 'var(--text2)' }}>Revisado por</strong>{' '}
          <span style={{ color: 'var(--text)' }}>M. Khurram</span>
          <span style={{ color: 'var(--text3)', marginLeft: 4 }}>— Engenheiro de Software &amp; Fundador</span>
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text3)' }}>
        <span style={{ fontSize: 14 }}>📅</span>
        <span>Última atualização: <strong style={{ color: 'var(--text2)' }}>{lastUpdated}</strong></span>
      </div>
    </div>
  );
}

export function SEOContentSectionPtBr({ calc, lastUpdated }: SEOContentSectionPtBrProps) {
  const isYMYL = YMYL_CATS.has(calc.cat);
  const showDisclaimer = DISCLAIMER_CATS.has(calc.cat) || calc.privacy === 'sensitive';
  const disclaimer = DISCLAIMERS_PT_BR[calc.cat] ?? UI_PT_BR.disclaimers.finance;

  const related = getRelatedCalcs(calc, 6);
  const cat = CATEGORIES.find(c => c.id === calc.cat);
  const catNamePtBr = cat ? UI_PT_BR.categories[cat.id as keyof typeof UI_PT_BR.categories] ?? cat.name : '';

  // Build lastUpdated in Portuguese format
  const updatedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' })
    : new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' });

  return (
    <div className="seo-content">
      {/* YMYL Author Byline */}
      {isYMYL && <AuthorBylinePtBr lastUpdated={updatedDate} />}

      {/* About */}
      {calc.about && (
        <section className="seo-block" aria-labelledby="seo-about-heading">
          <h2 id="seo-about-heading" className="seo-h2">
            {UI_PT_BR.seo.aboutThisCalculator}
          </h2>
          {calc.about.split('\n\n').map((para, i) => (
            <p key={i} className="seo-p">{para}</p>
          ))}
        </section>
      )}

      {/* Intro */}
      {calc.intro && (
        <div className="seo-intro">
          <p>{calc.intro}</p>
        </div>
      )}

      {/* How To Use */}
      {calc.howToUse && calc.howToUse.length > 0 && (
        <section className="seo-block" aria-labelledby="seo-how-heading">
          <h2 id="seo-how-heading" className="seo-h2">
            {UI_PT_BR.seo.howToUse}
          </h2>
          <ol className="seo-list">
            {calc.howToUse.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>
      )}

      {/* Formula */}
      {calc.formula && (
        <section className="seo-block" aria-labelledby="seo-formula-heading">
          <h2 id="seo-formula-heading" className="seo-h2">
            {UI_PT_BR.seo.formula}
          </h2>
          <pre className="seo-formula">{calc.formula}</pre>
        </section>
      )}

      {/* Worked Example */}
      {calc.workedExample && (
        <section className="seo-block" aria-labelledby="seo-example-heading">
          <h2 id="seo-example-heading" className="seo-h2">
            {UI_PT_BR.seo.workedExample}
          </h2>
          <div className="seo-worked-example">
            <h3 className="seo-h3">{calc.workedExample.title}</h3>

            {calc.workedExample.inputs.length > 0 && (
              <>
                <p className="seo-label"><strong>{UI_PT_BR.seo.inputs}:</strong></p>
                <ul className="seo-list">
                  {calc.workedExample.inputs.map((inp, i) => <li key={i}>{inp}</li>)}
                </ul>
              </>
            )}

            {calc.workedExample.steps.length > 0 && (
              <>
                <p className="seo-label"><strong>{UI_PT_BR.seo.steps}:</strong></p>
                <ol className="seo-list">
                  {calc.workedExample.steps.map((step, i) => <li key={i}>{step}</li>)}
                </ol>
              </>
            )}

            <div className="seo-result-box">
              <strong>{UI_PT_BR.seo.result}:</strong> {calc.workedExample.result}
            </div>
          </div>
        </section>
      )}

      {/* Tips */}
      {calc.tips && calc.tips.length > 0 && (
        <section className="seo-block" aria-labelledby="seo-tips-heading">
          <h2 id="seo-tips-heading" className="seo-h2">
            {UI_PT_BR.seo.tips}
          </h2>
          <ul className="seo-list">
            {calc.tips.map((tip, i) => <li key={i}>{tip}</li>)}
          </ul>
        </section>
      )}

      {/* Examples */}
      {calc.examples && calc.examples.length > 0 && (
        <section className="seo-block" aria-labelledby="seo-examples-heading">
          <h2 id="seo-examples-heading" className="seo-h2">
            {UI_PT_BR.seo.examples}
          </h2>
          <div className="seo-examples">
            {calc.examples.map((ex, i) => (
              <div key={i} className="seo-example-item">
                <p className="seo-scenario"><strong>Cenário:</strong> {ex.scenario}</p>
                <p className="seo-result-text"><strong>Resultado:</strong> {ex.result}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Limitations */}
      {calc.limitations && calc.limitations.length > 0 && (
        <section className="seo-block" aria-labelledby="seo-limits-heading">
          <h2 id="seo-limits-heading" className="seo-h2">
            {UI_PT_BR.seo.limitations}
          </h2>
          <ul className="seo-list">
            {calc.limitations.map((lim, i) => <li key={i}>{lim}</li>)}
          </ul>
        </section>
      )}

      {/* Disclaimer */}
      {showDisclaimer && (
        <div className="seo-disclaimer" role="note" aria-label="Aviso legal">
          <strong>⚠️ Aviso:</strong> {disclaimer}
        </div>
      )}

      {/* Related Calculators */}
      {related.length > 0 && (
        <section className="seo-block" aria-labelledby="seo-related-heading">
          <h2 id="seo-related-heading" className="seo-h2">
            {UI_PT_BR.seo.relatedCalculators}
          </h2>
          <div className="seo-related-grid">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/pt-br/calculator/${r.slug}`}
                className="seo-related-card"
              >
                <span>{r.icon}</span>
                <span>{r.name}</span>
              </Link>
            ))}
          </div>
          {cat && (
            <p style={{ marginTop: 12 }}>
              <Link href={`/pt-br/category/${calc.cat}`} className="seo-cat-link">
                Ver todas as calculadoras de {catNamePtBr} →
              </Link>
            </p>
          )}
        </section>
      )}
    </div>
  );
}
