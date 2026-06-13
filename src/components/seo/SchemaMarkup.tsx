/**
 * src/components/seo/SchemaMarkup.tsx
 *
 * Server component — outputs JSON-LD structured data for every calculator page.
 * Zero client JS cost — pure <script> tags in server-rendered HTML.
 *
 * Schema types emitted per page:
 *  1. BreadcrumbList     — 4-level trail: Home › All Calculators › Category › Calculator
 *  2. WebApplication     — Free web app card (applicationCategory, featureList, offers)
 *  3. FAQPage            — FAQ accordion rich results (up to 7 Q&As, calc-specific first)
 *  4. HowTo              — Step-by-step rich result (always emitted — every page has steps)
 *  5. WebPage            — Links this page to the site's WebSite entity via isPartOf
 *
 * Bug fixes over the original implementation:
 *  - `<` escaped as `\u003c` to prevent HTML parser from closing <script> early
 *  - HowTo now always emits (uses generateCalcContent fallback steps when
 *    calc.howToUse is absent — matches what's visible on the page)
 *  - BreadcrumbList is now 4 levels (added /calculators intermediate level)
 *  - WebApplication gains `featureList` and `creator`
 *  - HowTo name no longer contains awkward "Free … Online" suffix
 *  - FAQ merging: up to 5 calc-specific + up to 2 base = max 7 total
 *  - WebPage schema added to link calculator pages to WebSite entity
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

  // ── Resolve how-to steps ────────────────────────────────────────────────────
  // Use generateCalcContent() so the schema steps ALWAYS match the steps
  // rendered by SEOContentSection (which uses the same function as its source).
  // Previously the schema only emitted HowTo when calc.howToUse was explicitly
  // set — causing a mismatch because the visible section always shows steps.
  const content = generateCalcContent(calc);
  const howToSteps = content.howToUse; // always non-empty (falls back to GENERIC_HOW_TO)

  // ── 1. BreadcrumbList — 4-level hierarchy ──────────────────────────────────
  // Home → All Calculators → Category → Calculator
  // The extra "All Calculators" level aligns with the category page breadcrumb
  // (Home → All Calculators → Category) and the actual UI navigation.
  const breadcrumb = generateCalculatorBreadcrumbSchema(calc, cat);

  // ── 2. WebApplication ──────────────────────────────────────────────────────
  const webApp = generateWebApplicationSchema(calc, cat, pageUrl);

  // ── 3. FAQPage ─────────────────────────────────────────────────────────────
  // faqs prop already contains both calc-specific and base FAQs concatenated.
  // We re-slice here to give priority to calc-specific FAQs (the first N in
  // the array passed from page.tsx) and limit total to 7.
  //
  // Separate calc-specific from base by using CALC_FAQS directly isn't worth
  // the complexity — instead we rely on the ordering guaranteed by page.tsx:
  //   [...(CALC_FAQS[slug] ?? []), ...BASE_FAQS]
  // So the first items are always calc-specific.
  const faqSchema = generateFAQSchema(faqs, 7);

  // ── 4. HowTo ───────────────────────────────────────────────────────────────
  // Always emits — every calculator page has a visible "How to Use" section.
  const howToSchema = generateHowToSchema(calc, howToSteps, pageUrl);

  // ── 5. WebPage ─────────────────────────────────────────────────────────────
  // Links this page to the WebSite entity defined on the homepage.
  const webPageSchema = generateWebPageSchema(calc, cat, pageUrl);

  return (
    <JsonLd
      data={[breadcrumb, webApp, faqSchema, howToSchema, webPageSchema]}
      idPrefix={calc.slug}
    />
  );
}
