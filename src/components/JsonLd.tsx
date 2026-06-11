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
}

export function JsonLd({ data }: JsonLdProps) {
  // Normalise to array, drop any null/undefined items from conditional schemas
  const schemas = (Array.isArray(data) ? data : [data]).filter(
    (s): s is object => s != null,
  );

  if (schemas.length === 0) return null;

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            // Replace `<` with its Unicode escape so the HTML parser never
            // sees `</script>` inside the JSON string value.
            __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
          }}
        />
      ))}
    </>
  );
}
