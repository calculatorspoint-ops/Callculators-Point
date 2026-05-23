'use client';
import dynamic from 'next/dynamic';
const AllCalculators = dynamic(() => import('@/views/AllCalculators'), { ssr: false });
export default function AllCalculatorsClient() { return <AllCalculators />; }
