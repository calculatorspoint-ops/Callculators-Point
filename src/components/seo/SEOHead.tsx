/**
 * SEOHead.tsx — DEPRECATED
 *
 * This component previously used react-helmet-async to set page metadata.
 * In Next.js App Router, SEO metadata is handled via generateMetadata()
 * in each app/[route]/page.tsx file.
 *
 * This component is retained as a no-op to avoid breaking imports
 * during the migration period. It can be safely deleted once all
 * consumers are removed.
 */
import { CalculatorConfig } from "@/data/calculatorConfigs";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SEOHead({ calc, catName }: { calc: CalculatorConfig; catName: string }) {
  // No-op: metadata is now in app/calculator/[slug]/page.tsx → generateMetadata
  return null;
}
