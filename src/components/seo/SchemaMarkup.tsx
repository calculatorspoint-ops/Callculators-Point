/**
 * src/components/seo/SchemaMarkup.tsx
 *
 * Server component — outputs JSON-LD structured data for every calculator page.
 * Zero client JS cost — pure <script> tags in server-rendered HTML.
 *
 * Schema types emitted per page:
 *  1. BreadcrumbList     — SERP breadcrumb trail (Home › Category › Calculator)
 *  2. WebApplication     — Rich app card in SERPs (free, cross-platform)
 *  3. FAQPage            — FAQ accordion rich results in Google SERPs
 *  4. HowTo              — Step-by-step how-to rich result (practical calculators)
 *
 * Validation: https://validator.schema.org / https://search.google.com/test/rich-results
 */
import type { CalculatorConfig, CalculatorCategory } from '@/data/calculatorConfigs';
import { SITE_URL } from '@/config/site';

interface SchemaMarkupProps {
  calc: CalculatorConfig;
  cat: CalculatorCategory | undefined;
  faqs: { q: string; a: string }[];
}

/** Strip HTML tags and decode basic entities for safe schema text */
function sanitizeText(text: string): string {
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

export function SchemaMarkup({ calc, cat, faqs }: SchemaMarkupProps) {
  const pageUrl = `${SITE_URL}/calculator/${calc.slug}`;
  const categoryUrl = cat ? `${SITE_URL}/category/${cat.id}` : `${SITE_URL}/calculators`;
  const calcDisplayName = /calculator/i.test(calc.name.trim())
    ? calc.name.trim()
    : `${calc.name.trim()} Calculator`;

  // ── 1. BreadcrumbList ────────────────────────────────────────────────────
  // Enables breadcrumb trail in Google SERPs ("Home › Finance › EMI Calculator")
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: cat ? cat.name : 'Calculators',
        item: categoryUrl,
      },
      { '@type': 'ListItem', position: 3, name: calcDisplayName, item: pageUrl },
    ],
  };

  // ── 2. WebApplication ────────────────────────────────────────────────────
  // Signals to Google this is a free web app, enabling app-card rich results.
  // applicationCategory values: https://schema.org/applicationCategory
  const APP_CATEGORY: Record<string, string> = {
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

  const webApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `Free ${calcDisplayName} Online`,
    url: pageUrl,
    description: sanitizeText(calc.desc),
    applicationCategory: APP_CATEGORY[calc.cat] ?? 'UtilitiesApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    provider: {
      '@type': 'Organization',
      name: 'Calculators Point',
      url: SITE_URL,
    },
  };

  // ── 3. FAQPage ───────────────────────────────────────────────────────────
  // Enables FAQ accordion rich results in Google SERPs (can increase CTR 20-40%).
  // Rules: min 1 Q&A, answers must match visible page content, no promotional text.
  // We use calc-specific FAQs first (more relevant), then base FAQs to fill gaps.
  // Cap at 8 — Google shows at most 3 in SERPs but indexes all for featured snippets.
  const faqSchema =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.slice(0, 8).map(({ q, a }) => ({
            '@type': 'Question',
            name: sanitizeText(q),
            acceptedAnswer: {
              '@type': 'Answer',
              text: sanitizeText(a),
            },
          })),
        }
      : null;

  // ── 4. HowTo ─────────────────────────────────────────────────────────────
  // HowTo rich results for calculators with step-by-step usage instructions.
  // Uses calc.howToUse data if available, otherwise generates generic steps.
  // Only emitted for calculators that have practical step instructions.
  const hasHowTo = calc.howToUse && calc.howToUse.length > 0;

  const howToSchema = hasHowTo
    ? {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: `How to use the Free ${calcDisplayName} Online`,
        description: sanitizeText(calc.desc),
        url: pageUrl,
        step: (calc.howToUse as string[]).map((stepText, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: `Step ${index + 1}`,
          text: sanitizeText(stepText),
        })),
        ...(calc.formula
          ? {
              tool: [
                {
                  '@type': 'HowToTool',
                  name: `${calcDisplayName} (free online)`,
                },
              ],
            }
          : {}),
      }
    : null;

  // Collect all non-null schemas and emit them as separate <script> tags.
  // Separate tags (not @graph) are preferred for rich result eligibility per Google docs.
  const schemas = [breadcrumb, webApp, faqSchema, howToSchema].filter(Boolean);

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0),
          }}
        />
      ))}
    </>
  );
}
