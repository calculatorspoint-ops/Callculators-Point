'use client';
import dynamic from 'next/dynamic';
const Disclaimer = dynamic(() => import('@/views/Disclaimer'), { ssr: false });
export default function DisclaimerClient() { return <Disclaimer />; }
