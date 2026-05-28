'use client';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
const AllCalculators = dynamic(() => import('@/views/AllCalculators'));
export default function AllCalculatorsClient() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a0e25' }} />}>
      <AllCalculators />
    </Suspense>
  );
}
