'use client';
import dynamic from 'next/dynamic';
const Sitemap = dynamic(() => import('@/views/Sitemap'));
export default function SitemapClient() { return <Sitemap />; }
