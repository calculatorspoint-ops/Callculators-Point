'use client';
import dynamic from 'next/dynamic';
const Privacy = dynamic(() => import('@/views/PrivacyPolicy'));
export default function PrivacyClient() { return <Privacy />; }
