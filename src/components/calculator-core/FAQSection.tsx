export function FAQSection({ faqs }: { faqs?: { q: string; a: string }[] }) {
  if (!faqs?.length) return null;
  return (
    <div>
      <h2 style={{ fontFamily:"var(--font-display)", fontSize:"1.3rem", fontWeight:800, color:"var(--text)", marginBottom:16, letterSpacing:"-.02em" }}>
        Frequently Asked Questions
      </h2>
      {faqs.map((f, i) => (
        <details key={i}>
          <summary>{f.q}</summary>
          <div className="faq-body">{f.a}</div>
        </details>
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context":"https://schema.org","@type":"FAQPage",
        mainEntity: faqs.map(f=>({ "@type":"Question", name:f.q, acceptedAnswer:{"@type":"Answer",text:f.a} }))
      })}} />
    </div>
  );
}
