'use client';
import { useState } from 'react';
import type { FAQItem } from '@/data/name-generators/faq-data';

interface FAQSectionProps {
  faqs: FAQItem[];
  toolId: string;
  title?: string;
}

export function FAQSection({ faqs, toolId, title = 'Frequently Asked Questions' }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Build JSON-LD FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="ng-faq" id={`faq-${toolId}`} aria-labelledby={`faq-title-${toolId}`}>
      {/* Inject FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="ng-container">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span className="ng-section-label">FAQ</span>
          <h2 className="ng-faq-title" id={`faq-title-${toolId}`}>{title}</h2>
        </div>

        <div style={{ maxWidth: 760, margin: '0 auto' }} role="list">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`ng-faq-item ${isOpen ? 'open' : ''}`}
                role="listitem"
              >
                <button
                  className="ng-faq-question"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${toolId}-${i}`}
                  id={`faq-question-${toolId}-${i}`}
                >
                  <span>{faq.question}</span>
                  <span className="ng-faq-icon" aria-hidden="true">+</span>
                </button>
                <div
                  className="ng-faq-answer"
                  id={`faq-answer-${toolId}-${i}`}
                  role="region"
                  aria-labelledby={`faq-question-${toolId}-${i}`}
                >
                  {faq.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
