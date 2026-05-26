'use client';
import dynamic from 'next/dynamic';
const AllCalculators = dynamic(() => import('@/views/AllCalculators'));
export default function AllCalculatorsClient() { return <AllCalculators />; }
