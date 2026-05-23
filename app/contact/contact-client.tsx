'use client';
import dynamic from 'next/dynamic';
const Contact = dynamic(() => import('@/views/Contact'), { ssr: false });
export default function ContactClient() { return <Contact />; }
