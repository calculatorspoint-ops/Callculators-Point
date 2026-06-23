/**
 * app/calculators/layout.tsx
 * Imports calculator-layout-fix.css scoped to the /calculators page.
 */
import '../../src/styles/calculator-layout-fix.css';

export default function CalculatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
