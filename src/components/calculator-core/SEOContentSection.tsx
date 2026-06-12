/**
 * src/components/calculator-core/SEOContentSection.tsx
 *
 * Server component — renders pure static HTML at build time.
 * Contains: About, Formula, How To Use, Examples, Worked Example, Tips, Related Calculators.
 * Zero client JS. Fully indexed by Google.
 */
import Link from 'next/link';
import { CATEGORIES, getRelatedCalcs } from '@/data/calculatorConfigs';
import { generateCalcContent } from '@/utils/generateCalcContent';
import type { CalculatorConfig } from '@/data/calculatorConfigs';

interface SEOContentSectionProps {
  calc: CalculatorConfig;
  /** ISO date string (YYYY-MM-DD) shown as "Last Updated" on YMYL pages.
   *  Defaults to the build-time current month if not provided. */
  lastUpdated?: string;
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

// YMYL categories that require author byline + last-updated date (E-E-A-T)
const YMYL_CATS = new Set(['health', 'finance', 'business']);

/**
 * AuthorByline — visible E-E-A-T attribution bar for YMYL pages.
 *
 * WHY VISIBLE TEXT (not just JSON-LD):
 *   Google's quality rater guidelines require E-E-A-T signals to be
 *   discoverable by human reviewers, not just machine-readable schema.
 *   A visible "Reviewed by" line + last-updated date satisfies this.
 */
function AuthorByline({ lastUpdated }: { lastUpdated: string }) {
  return (
    <div
      className="seo-block"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10,
        padding: '10px 16px',
        background: 'var(--surface2, rgba(0,0,0,.04))',
        borderRadius: 10,
        border: '1px solid var(--border)',
        fontSize: 12,
        color: 'var(--text3)',
        marginBottom: 0,
      }}
      aria-label="Content authorship and freshness information"
    >
      <span>
        ✍️{' '}
        <strong style={{ color: 'var(--text2)' }}>Reviewed by</strong>{' '}
        the Calculators Point Editorial Team · Formulas cross-verified against
        academic and professional sources
      </span>
      <span>
        🗓️{' '}
        <strong style={{ color: 'var(--text2)' }}>Last updated:</strong>{' '}
        {lastUpdated}
      </span>
    </div>
  );
}

export function SEOContentSection({ calc, lastUpdated }: SEOContentSectionProps) {
  const content = generateCalcContent(calc);
  const cat = CATEGORIES.find(c => c.id === calc.cat);

  // Use getRelatedCalcs which supports cross-category links via calc.relatedCalculators
  const relatedCalcs = getRelatedCalcs(calc, 6);

  // Show disclaimer for sensitive categories or privacy: 'sensitive'
  const showDisclaimer = DISCLAIMER_CATS.has(calc.cat) || calc.privacy === 'sensitive';
  const disclaimer = DISCLAIMERS[calc.cat] ??
    'Disclaimer: Results are for informational purposes only. Please consult a qualified professional before making any important decisions based on this calculator.';

  // YMYL categories get a visible author byline + last-updated date
  const showByline = YMYL_CATS.has(calc.cat);
  // Default: "Month Year" of the current build date if no explicit date is supplied
  const displayDate = lastUpdated
    ?? new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <section className="seo-content-section" aria-label={`About ${calc.name}`}>

      {/* ── E-E-A-T Byline (YMYL pages only) ── */}
      {showByline && <AuthorByline lastUpdated={displayDate} />}

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

      {/* ── Worked Example ── */}
      {content.workedExample && (
        <div className="seo-block">
          <h2 className="seo-h2">Example Calculation</h2>
          <div className="seo-worked-example">
            <p className="seo-worked-title">{content.workedExample.title}</p>

            {/* Inputs */}
            {content.workedExample.inputs.length > 0 && (
              <div className="seo-worked-group">
                <p className="seo-worked-label">📥 Inputs</p>
                <ul className="seo-worked-list">
                  {content.workedExample.inputs.map((inp, i) => (
                    <li key={i} className="seo-worked-item">{inp}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Steps */}
            {content.workedExample.steps.length > 0 && (
              <div className="seo-worked-group">
                <p className="seo-worked-label">🔢 Calculation Steps</p>
                <ol className="seo-worked-steps">
                  {content.workedExample.steps.map((step, i) => (
                    <li key={i} className="seo-worked-step">
                      <span className="seo-step-num">{i + 1}</span>
                      <span className="seo-step-text">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Result */}
            <div className="seo-worked-result">
              <span aria-hidden="true">✅</span>
              <span>{content.workedExample.result}</span>
            </div>
          </div>
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
      {content.examples.length > 0 && !content.workedExample && (
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

      {/* ── FAQ removed from here ──
           FAQ is rendered by FAQSection in calculator-client.tsx (client UI)
           and covered by SchemaMarkup FAQPage JSON-LD in page.tsx.
           A third FAQ block with different questions (GENERIC_FAQ) caused
           Google's "Duplicate field FAQPage" rich results error.
      */}

      {/* ── Related Calculators ── */}
      {relatedCalcs.length > 0 && (
        <div className="seo-block">
          <h2 className="seo-h2">Related Calculators</h2>
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
