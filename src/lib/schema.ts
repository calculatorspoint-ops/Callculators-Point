/**
 * src/lib/schema.ts
 *
 * Reusable, pure schema generator functions for all JSON-LD structured data.
 * Each function returns a plain object ready to be serialized as JSON-LD.
 *
 * Usage:
 *   import { generateBreadcrumbSchema, generateWebApplicationSchema } from '@/lib/schema';
 *
 * Safety:
 *   All text goes through sanitizeText() to strip HTML tags and decode entities.
 *   Use serializeSchema() when rendering inside <script> tags — it escapes `<`
 *   as `\u003c` so the browser HTML parser never closes the script tag early.
 *
 * Validation:
 *   https://validator.schema.org
 *   https://search.google.com/test/rich-results
 */

import type { CalculatorConfig, CalculatorCategory } from '@/data/calculatorConfigs';
import { SITE_URL, SITE_NAME } from '@/config/site';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  name: string;
  item: string; // absolute URL
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface HowToStep {
  text: string;
  /** Optional richer name shown in rich results (defaults to "Step N") */
  name?: string;
}

// ── Text Sanitization ─────────────────────────────────────────────────────────

/**
 * Strip HTML tags and decode common HTML entities for safe schema text.
 * JSON-LD answers/names must be plain text — no HTML markup allowed.
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/<[^>]+>/g, '')       // strip HTML tags
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

/**
 * Serialize a schema object to a JSON string safe for embedding inside
 * <script type="application/ld+json"> tags in HTML.
 *
 * The `<` → `\u003c` replacement prevents the browser HTML parser from
 * interpreting `</script>` inside a string value as the closing tag.
 * This is the same technique Next.js uses internally.
 */
export function serializeSchema(schema: object): string {
  return JSON.stringify(schema).replace(/</g, '\\u003c');
}

// ── 1. BreadcrumbList ─────────────────────────────────────────────────────────

/**
 * Generate a BreadcrumbList schema from an ordered array of breadcrumb items.
 *
 * Each item must have an absolute `item` URL.
 * The last item (current page) should still include the URL per Google's
 * recommendation — it helps Google understand the canonical URL.
 *
 * @example
 * generateBreadcrumbSchema([
 *   { name: 'Home', item: 'https://calculatorspoint.com' },
 *   { name: 'All Calculators', item: 'https://calculatorspoint.com/calculators' },
 *   { name: 'Finance & Money', item: 'https://calculatorspoint.com/category/finance' },
 *   { name: 'EMI Calculator', item: 'https://calculatorspoint.com/calculator/loan-emi-calculator' },
 * ])
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: sanitizeText(crumb.name),
      item: crumb.item,
    })),
  };
}

/**
 * Convenience: build the standard 4-level breadcrumb for a calculator page.
 *
 * Hierarchy: Home → All Calculators → Category → Calculator
 */
export function generateCalculatorBreadcrumbSchema(
  calc: CalculatorConfig,
  cat: CalculatorCategory | undefined,
): ReturnType<typeof generateBreadcrumbSchema> {
  const calcDisplayName = /calculator/i.test(calc.name.trim())
    ? calc.name.trim()
    : `${calc.name.trim()} Calculator`;

  const items: BreadcrumbItem[] = [
    { name: 'Home', item: SITE_URL },
    { name: 'All Calculators', item: `${SITE_URL}/calculators` },
  ];

  if (cat) {
    items.push({ name: cat.name, item: `${SITE_URL}/category/${cat.id}` });
  }

  items.push({
    name: calcDisplayName,
    item: `${SITE_URL}/calculator/${calc.slug}`,
  });

  return generateBreadcrumbSchema(items);
}

// ── 2. WebApplication ─────────────────────────────────────────────────────────

/**
 * Map internal category IDs to schema.org applicationCategory values.
 * Reference: https://schema.org/applicationCategory
 */
const APP_CATEGORY_MAP: Record<string, string> = {
  finance:      'FinanceApplication',
  health:       'HealthApplication',
  education:    'EducationApplication',
  math:         'EducationApplication',
  business:     'BusinessApplication',
  technology:   'DeveloperApplication',
  converters:   'UtilitiesApplication',
  everyday:     'UtilitiesApplication',
  construction: 'UtilitiesApplication',
};

/**
 * Build the feature list from available calc config fields.
 * Only includes features that are genuinely present — no invented claims.
 */
function buildFeatureList(calc: CalculatorConfig): string[] {
  const features: string[] = ['Instant results', 'Mobile optimized', 'Free to use'];
  if (calc.hasChart) features.push('Interactive chart');
  if (calc.formula)  features.push('Step-by-step formula');
  if (calc.howToUse && calc.howToUse.length > 0) features.push('Usage guide');
  if (calc.examples && calc.examples.length > 0) features.push('Worked examples');
  return features;
}

/**
 * Generate a WebApplication schema for a calculator page.
 *
 * Important SEO rules followed here:
 * - No fake ratings, reviews, download counts, or pricing claims
 * - `isAccessibleForFree: true` with Offer at $0
 * - `operatingSystem: 'All'` (it's a web app — runs on any OS)
 */
export function generateWebApplicationSchema(
  calc: CalculatorConfig,
  cat: CalculatorCategory | undefined,
  pageUrl: string,
) {
  const calcDisplayName = /calculator/i.test(calc.name.trim())
    ? calc.name.trim()
    : `${calc.name.trim()} Calculator`;

  const organizationRef = {
    '@type': 'Organization' as const,
    name: SITE_NAME,
    url: SITE_URL,
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `Free ${calcDisplayName} Online`,
    url: pageUrl,
    description: sanitizeText(calc.desc),
    applicationCategory: cat
      ? (APP_CATEGORY_MAP[cat.id] ?? 'UtilitiesApplication')
      : 'UtilitiesApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
    featureList: buildFeatureList(calc),
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    provider: organizationRef,
    creator: organizationRef,
  };
}

// ── 3. FAQPage ────────────────────────────────────────────────────────────────

/**
 * Generate a FAQPage schema from an array of Q&A pairs.
 *
 * Google Rich Results rules:
 * - Each Q&A must be visible on the page (not hidden from users)
 * - Minimum 1 Q&A pair required
 * - Answers should be concise — avoid promotional text
 * - Cap at 8 (Google shows at most 3 in SERPs but indexes all for featured snippets)
 *
 * Returns null if no FAQs provided (caller should skip rendering).
 */
export function generateFAQSchema(faqs: FaqItem[], maxItems = 8) {
  if (!faqs || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.slice(0, maxItems).map(({ q, a }) => ({
      '@type': 'Question',
      name: sanitizeText(q),
      acceptedAnswer: {
        '@type': 'Answer',
        text: sanitizeText(a),
      },
    })),
  };
}

/**
 * Merge calc-specific FAQs with BASE_FAQS, respecting a total cap.
 *
 * Priority: calc-specific FAQs first (more relevant to the specific page),
 * then BASE_FAQS to fill remaining slots.
 *
 * Cap: 7 total (Google only shows 3 in SERPs; 7 maximizes featured snippet
 * chances without bloating page weight).
 */
export function mergeCalcFaqs(
  calcSpecificFaqs: FaqItem[],
  baseFaqs: FaqItem[],
  totalCap = 7,
): FaqItem[] {
  // Take up to 5 calc-specific FAQs, then fill remainder from base FAQs
  const specific = calcSpecificFaqs.slice(0, 5);
  const remaining = totalCap - specific.length;
  const base = baseFaqs.slice(0, Math.max(0, remaining));
  return [...specific, ...base];
}

// ── 4. HowTo ─────────────────────────────────────────────────────────────────

/**
 * Generate a HowTo schema from visible how-to steps.
 *
 * Google Rich Results rules:
 * - Steps must match the visible page content exactly
 * - Do NOT create HowTo schema for hidden or fabricated steps
 * - `tool` property is optional — only included if calculator has a formula
 *
 * @param steps - Array of step text strings from calc.howToUse or the
 *                generateCalcContent() fallback — must match what's visible
 */
export function generateHowToSchema(
  calc: CalculatorConfig,
  steps: string[],
  pageUrl: string,
) {
  if (!steps || steps.length === 0) return null;

  // Use calc.name directly (not the "Free … Online" variant) for a clean name
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Use the ${calc.name}`,
    description: sanitizeText(calc.desc),
    url: pageUrl,
    step: steps.map((stepText, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: `Step ${index + 1}`,
      text: sanitizeText(stepText),
    })),
  };

  // Only add `tool` if the calculator has a formula (makes the tool reference meaningful)
  if (calc.formula) {
    schema.tool = [
      {
        '@type': 'HowToTool',
        name: `${calc.name} (free online)`,
      },
    ];
  }

  return schema;
}

// ── 5. WebPage ────────────────────────────────────────────────────────────────

/**
 * Generate a WebPage schema that links this page to the site's WebSite entity.
 *
 * @param dateModified - ISO date string (YYYY-MM-DD) for the schema's dateModified
 *   field. Supply explicitly for pages with known update dates; omit to use the
 *   current build date as a fallback freshness signal.
 */
export function generateWebPageSchema(
  calc: CalculatorConfig,
  cat: CalculatorCategory | undefined,
  pageUrl: string,
  dateModified?: string,
) {
  const calcDisplayName = /calculator/i.test(calc.name.trim())
    ? calc.name.trim()
    : `${calc.name.trim()} Calculator`;

  const resolvedDate = dateModified ?? new Date().toISOString().slice(0, 10);

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: `Free ${calcDisplayName} Online`,
    description: sanitizeText(calc.desc),
    // dateModified: freshness signal — Google uses this to assess content currency.
    // For financial/health tools, keeping this date current is an E-E-A-T signal.
    dateModified: resolvedDate,
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
    about: {
      '@type': 'Thing',
      name: calcDisplayName,
    },
    ...(cat
      ? {
          breadcrumb: {
            '@id': `${pageUrl}#breadcrumb`,
          },
        }
      : {}),
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'ReadAction',
      target: [pageUrl],
    },
  };
}
