/**
 * src/components/calculator-core/CalculatorPageClient.ts
 *
 * Re-export of CalculatorPageClient from app/calculator/[slug]/calculator-client.tsx
 * for use in pt-BR pages. TypeScript cannot resolve paths with [slug] in them
 * via relative imports, so we expose it through the @/ alias (src/ directory) instead.
 */
export { CalculatorPageClient } from '../../../app/calculator/[slug]/calculator-client';
