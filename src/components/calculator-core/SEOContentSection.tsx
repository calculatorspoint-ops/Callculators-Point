/**
 * src/components/calculator-core/SEOContentSection.tsx
 *
 * Server component — renders pure static HTML at build time.
 * Contains: About, Formula, How To Use, Examples, Tips, FAQ accordion.
 * Zero client JS. Fully indexed by Google.
 */
import Link from 'next/link';
import { ALL_CALCULATORS, CATEGORIES } from '@/data/calculatorConfigs';
import { generateCalcContent } from '@/utils/generateCalcContent';
import type { CalculatorConfig } from '@/data/calculatorConfigs';

interface SEOContentSectionProps {
  calc: CalculatorConfig;
}

export function SEOContentSection({ calc }: SEOContentSectionProps) {
  const content = generateCalcContent(calc);
  const cat = CATEGORIES.find(c => c.id === calc.cat);
  const relatedCalcs = ALL_CALCULATORS
    .filter(c => c.cat === calc.cat && c.slug !== calc.slug && c.status !== 'coming-soon')
    .slice(0, 4);

  return (
    <section className="seo-content-section" aria-label={`About ${calc.name}`}>

      {/* ── About ── */}
      <div className="seo-block">
        <h2 className="seo-h2">About the {calc.name}</h2>
        {content.about.split('\n\n').map((para, i) => (
          <p key={i} className="seo-para">{para}</p>
        ))}
      </div>

      {/* ── Formula ── */}
      {content.formulaExplained && (
        <div className="seo-block">
          <h2 className="seo-h2">Formula Used</h2>
          <div className="seo-formula-box">
            {content.formulaExplained.split('\n').map((line, i) => (
              <p key={i} className={i === 0 ? 'seo-formula-main' : 'seo-formula-desc'}>{line}</p>
            ))}
          </div>
        </div>
      )}

      {/* ── How to Use ── */}
      <div className="seo-block">
        <h2 className="seo-h2">How to Use the {calc.name}</h2>
        <ol className="seo-steps-list">
          {content.howToUse.map((step, i) => (
            <li key={i} className="seo-step-item">
              <span className="seo-step-num">{i + 1}</span>
              <span className="seo-step-text">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* ── Examples ── */}
      {content.examples.length > 0 && (
        <div className="seo-block">
          <h2 className="seo-h2">Example Use Cases</h2>
          <div className="seo-examples-grid">
            {content.examples.map((ex, i) => (
              <div key={i} className="seo-example-card">
                <div className="seo-example-scenario">📌 {ex.scenario}</div>
                <div className="seo-example-result">💡 {ex.result}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tips ── */}
      {content.tips.length > 0 && (
        <div className="seo-block">
          <h2 className="seo-h2">Tips &amp; Best Practices</h2>
          <ul className="seo-tips-list">
            {content.tips.map((tip, i) => (
              <li key={i} className="seo-tip-item">
                <span className="seo-tip-icon">✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── FAQ ── */}
      {content.faq.length > 0 && (
        <div className="seo-block">
          <h2 className="seo-h2">Frequently Asked Questions</h2>
          <div className="seo-faq-list">
            {content.faq.map((item, i) => (
              <details key={i} className="seo-faq-item">
                <summary className="seo-faq-question">{item.q}</summary>
                <div className="seo-faq-answer">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* ── Related Calculators ── */}
      {relatedCalcs.length > 0 && (
        <div className="seo-block">
          <h2 className="seo-h2">More {cat?.name ?? 'Calculators'}</h2>
          <div className="seo-related-grid">
            {relatedCalcs.map(c => (
              <Link key={c.id} href={`/calculator/${c.slug}`} className="seo-related-card">
                <span className="seo-related-icon">{c.icon}</span>
                <div>
                  <div className="seo-related-name">{c.name}</div>
                  <div className="seo-related-desc">{c.desc}</div>
                </div>
              </Link>
            ))}
          </div>
          <p className="seo-category-link">
            View all{' '}
            <Link href={`/category/${calc.cat}`}>
              {cat?.name ?? ''} Calculators →
            </Link>
          </p>
        </div>
      )}

    </section>
  );
}
