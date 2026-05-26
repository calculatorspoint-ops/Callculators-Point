import type { Metadata } from 'next';
import '../../src/styles/name-generators.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://calculatorspoint.com'),
};

export default function NameGeneratorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
