/**
 * app/calculators/page.tsx — All Calculators page (SSG)
 */
import type { Metadata } from 'next';
import { ALL_CALCULATORS } from '@/data/calculatorConfigs';
import AllCalculatorsClient from './all-calculators-client';

export const metadata: Metadata = {
  title: `All ${ALL_CALCULATORS.length}+ Free Online Calculators`,
  description: `Browse all ${ALL_CALCULATORS.length}+ free online calculators — finance, health, math, education, converters, and everyday tools.`,
  alternates: { canonical: 'https://calculatorspoint.com/calculators' },
};

export default function AllCalculatorsPage() {
  return <AllCalculatorsClient />;
}
