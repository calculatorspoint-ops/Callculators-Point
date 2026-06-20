'use client';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
const AllCalculators = dynamic(() => import('@/views/AllCalculators'));
export default function AllCalculatorsClient() {
  return <AllCalculators />;
}
