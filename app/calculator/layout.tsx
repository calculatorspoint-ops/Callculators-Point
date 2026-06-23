/**
 * app/calculator/layout.tsx
 * Imports calculator-layout-fix.css scoped to all /calculator/* pages.
 */
import '../../src/styles/calculator-layout-fix.css';

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
