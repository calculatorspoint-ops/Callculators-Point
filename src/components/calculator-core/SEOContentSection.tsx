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

// Disclaimer text per category
const DISCLAIMERS: Record<string, string> = {
  health: 'Health Disclaimer: Results provided by this calculator are for informational and educational purposes only. They do not constitute medical advice. Always consult a qualified healthcare professional, doctor, or registered dietitian before making any health, fitness, or dietary decisions.',
  finance: 'Financial Disclaimer: Results are estimates based on the inputs you provide and standard mathematical formulas. They do not constitute financial advice. Please consult a certified financial advisor, accountant, or tax professional before making any investment, loan, or financial decisions.',
  education: 'Academic Disclaimer: GPA, grade, and exam results shown are estimates. Requirements vary by institution. Always verify with your school, university, or examination board for official calculations and eligibility criteria.',
  business: 'Business Disclaimer: Results are projections based on your inputs and may not reflect actual business outcomes. Consult a business advisor or accountant before making financial or operational decisions.',
};

// Categories where a disclaimer is always shown regardless of privacy flag
const DISCLAIMER_CATS = new Set(['health', 'finance', 'education', 'business']);

export function SEOContentSection({ calc }: SEOContentSectionProps) {
  const content = generateCalcContent(calc);
  const cat = CATEGORIES.find(c => c.id === calc.cat);
  // Increase to 6 related calcs for better internal linking density (was 4)
  const relatedCalcs = ALL_CALCULATORS
    .filter(c => c.cat === calc.cat && c.slug !== calc.slug && c.status !== 'coming-soon')
    .slice(0, 6);

  // Show disclaimer for sensitive categories or privacy: 'sensitive'
  const showDisclaimer = DISCLAIMER_CATS.has(calc.cat) || calc.privacy === 'sensitive';
  const disclaimer = DISCLAIMERS[calc.cat] ??
    'Disclaimer: Results are for informational purposes only. Please consult a qualified professional before making any important decisions based on this calculator.';

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

      {/* ── When to Use ── */}
      {content.whenToUse && (
        <div className="seo-block">
          <h2 className="seo-h2">When Should You Use This?</h2>
          <p className="seo-para">{content.whenToUse}</p>
        </div>
      )}

      {/* ── What the Result Means ── */}
      {content.resultMeaning && (
        <div className="seo-block">
          <h2 className="seo-h2">What Does The Result Mean?</h2>
          <p className="seo-para">{content.resultMeaning}</p>
        </div>
      )}

      {/* ── Limitations ── */}
      {content.limitations.length > 0 && (
        <div className="seo-block">
          <h2 className="seo-h2">Limitations of this Calculator</h2>
          <ul className="seo-tips-list" style={{ color: 'var(--red)' }}>
            {content.limitations.map((lim, i) => (
              <li key={i} className="seo-tip-item">
                <span aria-hidden="true" className="seo-tip-icon" style={{ color: 'var(--red)' }}>⚠️</span>
                <span style={{ color: 'var(--text)' }}>{lim}</span>
              </li>
            ))}
          </ul>
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
                <span aria-hidden="true" className="seo-tip-icon">✓</span>
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
                <summary className="seo-faq-question"><h3 style={{ display: "inline", fontSize: "inherit", fontWeight: "inherit", margin: 0 }}>{item.q}</h3></summary>
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

      {/* ── Disclaimer (health, finance, education, business) ── */}
      {showDisclaimer && (
        <div className="seo-block seo-disclaimer-block" role="note" aria-label="Disclaimer">
          <p className="seo-disclaimer-text">
            <strong>⚠️ {disclaimer.split(':')[0]}:</strong>{disclaimer.slice(disclaimer.indexOf(':') + 1)}
          </p>
        </div>
      )}

    </section>
  );
}
