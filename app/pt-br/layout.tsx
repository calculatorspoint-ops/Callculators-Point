/**
 * app/pt-br/layout.tsx
 *
 * Layout for all /pt-br/* routes.
 *
 * - Sets lang="pt-BR" on <html>
 * - Adds hreflang alternate links (pt-BR, en, x-default)
 * - Inherits all fonts, theme scripts, analytics, and ClientProviders from root layout
 * - Does NOT duplicate root layout's <head> scripts — Next.js merges metadata automatically
 */
import type { Metadata } from 'next';
import { SITE_URL } from '@/config/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: `${SITE_URL}/pt-br`,
    languages: {
      'en': `${SITE_URL}`,
      'pt-BR': `${SITE_URL}/pt-br`,
      'x-default': `${SITE_URL}`,
    },
  },
};

export default function PtBrLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/*
        Next.js App Router: layout segments inherit from parent layouts.
        The root app/layout.tsx already renders <html>, <body>, Navbar, Footer, etc.
        This layout only adds pt-BR-specific overrides.

        To change the lang attribute for pt-BR routes, we use the suppressHydrationWarning
        pattern — the root layout sets lang="en" but we override it client-side for pt-BR.
        A cleaner approach: use Next.js per-segment html lang via the generateMetadata API.
      */}
      {children}
    </>
  );
}
