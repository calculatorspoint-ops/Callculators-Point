/**
 * app/category/layout.tsx
 * Imports calculator-layout-fix.css scoped to /category/* pages.
 */
import '../../src/styles/calculator-layout-fix.css';

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
