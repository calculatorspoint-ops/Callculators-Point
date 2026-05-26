'use client';
import dynamic from 'next/dynamic';
const About = dynamic(() => import('@/views/About'));
export default function AboutClient() { return <About />; }
