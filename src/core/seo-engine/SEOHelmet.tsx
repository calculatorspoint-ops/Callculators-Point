/**
 * SEOHelmet.tsx — DEPRECATED
 *
 * Previously used react-helmet-async to inject page-level SEO tags.
 * In the Next.js App Router, SEO is handled via generateMetadata() exports
 * in each app/[route]/page.tsx file.
 *
 * This component is kept as a no-op to prevent breaking imports.
 * It can be safely deleted after all usages are removed.
 */

interface SEOHelmetProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  applicationCategory?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SEOHelmet({ title, description, canonicalUrl, applicationCategory }: SEOHelmetProps) {
  // No-op: SEO metadata is now managed by Next.js generateMetadata in app routes
  return null;
}
