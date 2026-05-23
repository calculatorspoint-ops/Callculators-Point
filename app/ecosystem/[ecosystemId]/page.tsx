/**
 * app/ecosystem/[ecosystemId]/page.tsx — Ecosystem Hub page (SSG)
 */
import type { Metadata } from 'next';
import EcosystemClient from './ecosystem-client';

export const metadata: Metadata = {
  title: 'Calculator Ecosystem Hub — CalculatorsPoint',
  description: 'Interconnected calculator suites for finance, health, education and more.',
};

export default async function EcosystemPage({
  params,
}: {
  params: Promise<{ ecosystemId: string }>;
}) {
  const { ecosystemId } = await params;
  return <EcosystemClient ecosystemId={ecosystemId} />;
}
