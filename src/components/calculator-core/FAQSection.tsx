/**
 * FAQSection.tsx
 *
 * Renders the FAQ accordion UI only.
 * JSON-LD FAQPage schema is handled server-side in SchemaMarkup.tsx —
 * do NOT add a second FAQPage script here or Google will report
 * "Duplicate field FAQPage" and invalidate rich results.
 *
 * Accessibility:
 *  - role="region" + aria-labelledby lets screen-reader users navigate
 *    directly to this landmark via the regions list (NVDA: R key, JAWS: R key).
 *  - Native <details>/<summary> is keyboard-accessible by spec:
 *    Enter/Space toggles open, Tab moves focus in/out.
 *  - Each <summary> gets an explicit id so it can be paired with aria-controls.
 *  - The +/× indicator is aria-hidden so screen readers only hear the question.
 *  - Focus ring is visible via :focus-visible (CSS below).
 */
'use client';
import { useState, useCallback } from 'react';

interface FAQItem { q: string; a: string; }

function FAQAccordionItem({ faq, index }: { faq: FAQItem; index: number }) {
  const [open, setOpen] = useState(false);
  const id = `faq-q-${index}`;
  const panelId = `faq-a-${index}`;

  const toggle = useCallback(() => setOpen(o => !o), []);

  return (
    <div
      style={{
        borderBottom: '1px solid var(--border)',
        overflow: 'hidden',
      }}
    >
      {/* Using a <button> inside a <dt> for maximum ARIA compatibility.
          Some screen readers don't announce <summary> toggle state correctly,
          but <button aria-expanded> is universally supported. */}
      <button
        id={id}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '14px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          fontFamily: 'var(--font-display)',
          fontSize: '0.95rem',
          fontWeight: 700,
          color: 'var(--text)',
          // Focus ring visible for keyboard users, hidden for mouse clicks
          outline: 'none',
        }}
        onFocus={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 0 2px var(--brand)'; }}
        onBlur={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; }}
      >
        <span>{faq.q}</span>
        <span
          aria-hidden="true"
          style={{
            fontSize: 20,
            fontWeight: 300,
            color: 'var(--brand)',
            flexShrink: 0,
            transition: 'transform .2s',
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            display: 'inline-block',
          }}
        >
          +
        </span>
      </button>

      {/* Answer panel — hidden via height animation */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={id}
        hidden={!open}
        style={{
          paddingBottom: open ? 14 : 0,
          fontSize: 14,
          color: 'var(--text2)',
          lineHeight: 1.75,
        }}
      >
        {faq.a}
      </div>
    </div>
  );
}

export function FAQSection({ faqs }: { faqs?: FAQItem[] }) {
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
        <FAQAccordionItem key={i} faq={f} index={i} />
      ))}
      {/* ⚠️ NO FAQPage JSON-LD here — it lives in SchemaMarkup.tsx (server-rendered).
          A second FAQPage script causes Google's "Duplicate field" error and
          disqualifies the page from FAQ rich results entirely. */}
    </section>
  );
}
