/**
 * FAQSection.tsx
 *
 * Renders the FAQ accordion UI only.
 * JSON-LD FAQPage schema is handled server-side in SchemaMarkup.tsx —
 * do NOT add a second FAQPage script here or Google will report
 * "Duplicate field FAQPage" and invalidate rich results.
 *
 * Accessibility: role="region" + aria-labelledby lets screen-reader users
 * navigate directly to this landmark. Each <details>/<summary> pair is
 * natively keyboard-accessible (Enter/Space opens, Escape closes in Chrome).
 */
export function FAQSection({ faqs }: { faqs?: { q: string; a: string }[] }) {
  if (!faqs?.length) return null;
  return (
    <section role="region" aria-labelledby="faq-section-heading">
      <h2
        id="faq-section-heading"
        style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', fontWeight:800, color:'var(--text)', marginBottom:16, letterSpacing:'-.02em' }}
      >
        Frequently Asked Questions
      </h2>
      {faqs.map((f, i) => (
        <details key={i}>
          <summary>{f.q}</summary>
          <div className="faq-body">{f.a}</div>
        </details>
      ))}
      {/* ⚠️ NO FAQPage JSON-LD here — it lives in SchemaMarkup.tsx (server-rendered).
          A second FAQPage script causes Google's "Duplicate field" error and
          disqualifies the page from FAQ rich results entirely. */}
    </section>
  );
}
