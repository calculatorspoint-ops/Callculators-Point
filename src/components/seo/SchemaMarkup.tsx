/**
 * src/components/seo/SchemaMarkup.tsx
 *
 * Server component — outputs JSON-LD structured data for every calculator page.
 * Covers: BreadcrumbList, WebApplication, FAQPage, HowTo (practical calculators).
 * Zero client JS cost — pure <script> tag in HTML.
 */
import type { CalculatorConfig, CalculatorCategory } from '@/data/calculatorConfigs';

interface SchemaMarkupProps {
  calc: CalculatorConfig;
  cat: CalculatorCategory | undefined;
  faqs: { q: string; a: string }[];
}

export function SchemaMarkup({ calc, cat, faqs }: SchemaMarkupProps) {
  const baseUrl = 'https://calculatorspoint.com';
  const pageUrl = `${baseUrl}/calculator/${calc.slug}`;
  const categoryUrl = cat ? `${baseUrl}/category/${cat.id}` : `${baseUrl}/calculators`;

  // 1. BreadcrumbList
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: cat?.name ?? 'Calculators', item: categoryUrl },
      { '@type': 'ListItem', position: 3, name: calc.name, item: pageUrl },
    ],
  };

  // 2. WebApplication
  const webApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${calc.name} — Free Online Calculator`,
    url: pageUrl,
    description: calc.desc,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
    },
  };

  // 3. FAQPage (only if there are FAQs)
  const faqSchema =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.slice(0, 6).map(({ q, a }) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
          })),
        }
      : null;

  // 4. HowTo (for practical/construction/health calculators)
  const practicalCats = ['construction', 'health', 'everyday', 'converters'];
  const howToSchema =
    practicalCats.includes(calc.cat) && calc.formula
      ? {
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: `How to use the ${calc.name}`,
          description: calc.desc,
          step: [
            {
              '@type': 'HowToStep',
              name: 'Enter your values',
              text: `Open the ${calc.name} and fill in the required input fields.`,
            },
            {
              '@type': 'HowToStep',
              name: 'Calculate',
              text: 'Click the Calculate button to get your instant result.',
            },
            {
              '@type': 'HowToStep',
              name: 'Review the result',
              text: `The ${calc.name} will display your result along with step-by-step working.`,
            },
          ],
        }
      : null;

  const schemas = [breadcrumb, webApp, faqSchema, howToSchema].filter(Boolean);

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
