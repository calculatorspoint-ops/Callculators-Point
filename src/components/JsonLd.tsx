/**
 * src/components/JsonLd.tsx
 *
 * Safe JSON-LD renderer — outputs one <script type="application/ld+json"> tag
 * per schema object, with proper HTML-parser-safe serialization.
 *
 * Why `\u003c` escaping?
 * If a schema string value contains "</script>", the browser HTML parser
 * interprets it as the end of the <script> block, truncating the JSON and
 * breaking structured data (or worse, creating an XSS vector).
 * Replacing `<` → `\u003c` makes the JSON string opaque to the HTML parser
 * while remaining perfectly valid JSON. This is the same technique Next.js
 * uses internally for its own JSON-LD output.
 *
 * Why stable `id` on each <script>?
 * In Next.js App Router, Server Component output is included in BOTH the
 * initial SSR HTML AND the RSC streaming payload (__next_f.push). Without a
 * stable `id`, React cannot deduplicate the script tags during hydration,
 * causing Google's crawler (which parses the full HTML including RSC payloads)
 * to see each schema TWICE — triggering "Duplicate field FAQPage" errors in
 * Google Search Console and invalidating rich results.
 * Adding a per-page-unique `id` lets React collapse the duplicate into one DOM
 * node, so the schema is only present once in the final rendered document.
 *
 * Usage — single schema:
 *   <JsonLd data={breadcrumbSchema} />
 *
 * Usage — multiple schemas in one call:
 *   <JsonLd data={[breadcrumbSchema, faqSchema, webAppSchema]} />
 *
 * null/undefined items in the array are automatically filtered out,
 * so you can safely pass conditional schemas without extra checks:
 *   <JsonLd data={[breadcrumb, faqSchema ?? null, howToSchema ?? null]} />
 */

interface JsonLdProps {
  /** A single schema object or an array of schema objects to render. */
  data: object | (object | null | undefined)[];
  /**
   * Optional stable page-level prefix for the script `id` attributes.
   * Prevents id collisions when multiple JsonLd components appear on a page.
   * Defaults to "jsonld" when not provided.
   */
  idPrefix?: string;
}

export function JsonLd({ data, idPrefix = 'jsonld' }: JsonLdProps) {
  // Normalise to array, drop any null/undefined items from conditional schemas
  const schemas = (Array.isArray(data) ? data : [data]).filter(
    (s): s is object => s != null,
  );

  if (schemas.length === 0) return null;

  return (
    <>
      {schemas.map((schema, i) => {
        // Derive a stable, human-readable id from the schema @type.
        // e.g. "FAQPage" → "jsonld-faqpage-0", "BreadcrumbList" → "jsonld-breadcrumblist-0"
        const schemaType =
          (schema as Record<string, unknown>)['@type'];
        const typeSlug =
          typeof schemaType === 'string'
            ? schemaType.toLowerCase()
            : String(i);
        const scriptId = `${idPrefix}-${typeSlug}-${i}`;

        return (
          <script
            key={scriptId}
            id={scriptId}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              // Replace `<` with its Unicode escape so the HTML parser never
              // sees `</script>` inside the JSON string value.
              __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
            }}
          />
        );
      })}
    </>
  );
}
