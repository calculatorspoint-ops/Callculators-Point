/**
 * app/ecosystem/[ecosystemId]/ecosystem-client.tsx
 *
 * SSR FIX: EcosystemHub previously called useParams() internally which
 * prevented server-side rendering (client hook). Now we pass ecosystemId
 * as a prop from the server page, so the hub renders on the server.
 *
 * The `dynamic()` import is also removed — EcosystemHub is now a regular
 * import so Next.js can SSR it at build time (generateStaticParams).
 */
import EcosystemHub from '@/views/EcosystemHub';

export default function EcosystemClient({ ecosystemId }: { ecosystemId: string }) {
  return <EcosystemHub ecosystemId={ecosystemId} />;
}
