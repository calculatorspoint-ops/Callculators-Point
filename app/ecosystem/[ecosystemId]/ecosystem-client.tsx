'use client';
import dynamic from 'next/dynamic';
const EcosystemHub = dynamic(() => import('@/views/EcosystemHub'));
export default function EcosystemClient({ ecosystemId }: { ecosystemId: string }) {
  return <EcosystemHub />;
}
