/**
 * src/components/seo/SchemaMarkup.tsx
 *
 * Server component — outputs JSON-LD structured data for every calculator page.
 * Zero client JS cost — pure <script> tags in server-rendered HTML.
 *
 * Schema types emitted per page (in one unified @graph block):
 *  1. BreadcrumbList     — 4-level trail: Home › All Calculators › Category › Calculator
 *  2. WebApplication     — Free web app card (applicationCategory, featureList, offers, author)
 *  3. FAQPage            — FAQ accordion rich results (up to 7 Q&As, calc-specific first)
 *  4. HowTo              — Step-by-step rich result (always emitted — every page has steps)
 *  5. WebPage            — Links this page to the site's WebSite entity via isPartOf
 *
 * Why @graph?
 *   All 5 schemas are bundled into one @context + @graph block.
 *   This means @id cross-references (e.g. WebPage.breadcrumb → BreadcrumbList#breadcrumb)
 *   resolve correctly within the same JSON-LD document, and Google's Structured Data
 *   Testing Tool validates them as a coherent knowledge graph rather than disconnected
 *   fragments. One <script> tag instead of 5 also reduces HTML parse overhead.
 *
 * Improvements over the original implementation:
 *  - `<` escaped as `\u003c` to prevent HTML parser from closing <script> early
 *  - HowTo always emits (uses generateCalcContent fallback steps when
 *    calc.howToUse is absent — matches what's visible on the page)
 *  - BreadcrumbList is 4 levels (added /calculators intermediate level)
 *  - WebApplication gains `featureList`, `creator`, and `author` (E-E-A-T)
 *  - WebPage gains `author`, `datePublished`, and `dateModified` (E-E-A-T)
 *  - HowTo name no longer contains awkward "Free … Online" suffix
 *  - FAQ merging: up to 5 calc-specific + up to 2 base = max 7 total
 *  - All schemas consolidated into one @graph per page
 *
 * Validation: https://validator.schema.org / https://search.google.com/test/rich-results
 */
import type { CalculatorConfig, CalculatorCategory } from '@/data/calculatorConfigs';
import { generateCalcContent } from '@/utils/generateCalcContent';
import { JsonLd } from '@/components/JsonLd';
import {
  generateCalculatorBreadcrumbSchema,
  generateWebApplicationSchema,
  generateFAQSchema,
  generateHowToSchema,
  generateWebPageSchema,
  generateGraphSchema,
} from '@/lib/schema';
import { SITE_URL } from '@/config/site';

interface SchemaMarkupProps {
  calc: CalculatorConfig;
  cat: CalculatorCategory | undefined;
  /**
   * Combined FAQ list (calc-specific + base FAQs) passed from page.tsx.
   * These are the same FAQs rendered visibly by FAQSection — schema must
   * match visible content per Google's structured data quality guidelines.
   */
  faqs: { q: string; a: string }[];
}

export function SchemaMarkup({ calc, cat, faqs }: SchemaMarkupProps) {
  const pageUrl = `${SITE_URL}/calculator/${calc.slug}`;

  // ── Resolve how-to steps ─────────────────────────────────────────────────
  // Use generateCalcContent() so the schema steps ALWAYS match the steps
  // rendered by SEOContentSection (which uses the same function as its source).
  const content = generateCalcContent(calc);
  const howToSteps = content.howToUse; // always non-empty (falls back to GENERIC_HOW_TO)

  // ── 1. BreadcrumbList — 4-level hierarchy ─────────────────────────────────
  // Home → All Calculators → Category → Calculator
  const breadcrumb = generateCalculatorBreadcrumbSchema(calc, cat);

  // ── 2. WebApplication ─────────────────────────────────────────────────────
  const webApp = generateWebApplicationSchema(calc, cat, pageUrl);

  // ── 3. FAQPage ────────────────────────────────────────────────────────────
  // Ordering guaranteed by page.tsx: [...(CALC_FAQS[slug] ?? []), ...BASE_FAQS]
  // so calc-specific FAQs always come first.
  const faqSchema = generateFAQSchema(faqs, 7);

  // ── 4. HowTo ──────────────────────────────────────────────────────────────
  // Always emits — every calculator page has a visible "How to Use" section.
  const howToSchema = generateHowToSchema(calc, howToSteps, pageUrl);

  // ── 5. WebPage ────────────────────────────────────────────────────────────
  // Links this page to the WebSite entity defined on the homepage.
  const webPageSchema = generateWebPageSchema(calc, cat, pageUrl);

  // ── Bundle into one @graph block ──────────────────────────────────────────
  // • @id cross-references resolve correctly within one document context
  // • One <script> tag instead of 5 (less HTML parse overhead)
  // • Cleaner output in Google Rich Results Test / validator.schema.org
  const graphSchema = generateGraphSchema([
    breadcrumb,
    webApp,
    faqSchema,
    howToSchema,
    webPageSchema,
  ]);

  return (
    <JsonLd
      data={graphSchema}
      idPrefix={calc.slug}
    />
  );
}
