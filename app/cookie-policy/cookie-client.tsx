'use client';
import dynamic from 'next/dynamic';
const CookiePolicy = dynamic(() => import('@/views/CookiePolicy'));
export default function CookieClient() { return <CookiePolicy />; }
