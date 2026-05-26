'use client';

interface SEOContentBlockProps {
  howItWorks: string[];
  tips: string[];
  toolName: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export function SEOContentBlock({
  howItWorks,
  tips,
  toolName,
  gradientFrom = '#6366f1',
  gradientTo = '#8b5cf6',
}: SEOContentBlockProps) {
  return (
    <>
      {/* How It Works */}
      <section
        className="ng-seo-section"
        aria-labelledby="how-it-works-title"
        id="how-it-works"
      >
        <div className="ng-container">
          <span className="ng-section-label">Guide</span>
          <h2 className="ng-section-title" id="how-it-works-title">
            How the {toolName} Works
          </h2>
          <p className="ng-section-desc">
            Our {toolName.toLowerCase()} is designed to be simple, fast, and powerful.
            Follow these steps to find the perfect name in seconds.
          </p>

          <div className="ng-steps">
            {howItWorks.map((step, i) => (
              <div key={i} className="ng-step">
                <div
                  className="ng-step-num"
                  style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
                  aria-hidden="true"
                >
                  {i + 1}
                </div>
                <div className="ng-step-title">Step {i + 1}</div>
                <div className="ng-step-desc">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section
        className="ng-seo-section"
        aria-labelledby="tips-title"
        id="tips"
        style={{ background: 'var(--ng-surface-2)' }}
      >
        <div className="ng-container">
          <span className="ng-section-label">Pro Tips</span>
          <h2 className="ng-section-title" id="tips-title">
            Tips for Choosing the Best Name
          </h2>
          <p className="ng-section-desc">
            Expert advice to help you make the perfect naming decision.
          </p>

          <div className="ng-tips">
            {tips.map((tip, i) => (
              <div key={i} className="ng-tip">
                <span className="ng-tip-icon" aria-hidden="true">💡</span>
                <p className="ng-tip-text">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
