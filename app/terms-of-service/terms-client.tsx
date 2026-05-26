'use client';
import dynamic from 'next/dynamic';
const Terms = dynamic(() => import('@/views/TermsOfService'));
export default function TermsClient() { return <Terms />; }
