/**
 * app/api/indexnow/route.ts
 *
 * IndexNow API route — submits URLs to Bing (and other IndexNow-compatible
 * search engines) for instant crawling.
 *
 * POST /api/indexnow          — submit a custom list of URLs (JSON body)
 * GET  /api/indexnow?all=true — submit ALL site URLs from the sitemap
 *
 * Usage:
 *   curl -X GET "https://calculatorspoint.com/api/indexnow?all=true"
 *
 * IndexNow protocol: https://www.indexnow.org/documentation
 */
import { NextResponse } from 'next/server';
import { ALL_CALCULATORS, INDEXABLE_CALCULATORS, CATEGORIES } from '@/data/calculatorConfigs';
import { SEO_LANDING_PAGES } from '@/data/seoLandingData';

const INDEXNOW_KEY = 'b21dafd8307e48edbbeea8902e9e6a6d';
const BASE_URL     = 'https://www.calculatorspoint.com';
const INDEXNOW_API = 'https://api.indexnow.org/indexnow';

/** Build the full list of indexable URLs (mirrors sitemap.ts) */
function getAllUrls(): string[] {
  const urls: string[] = [
    BASE_URL,
    `${BASE_URL}/calculators`,
    `${BASE_URL}/cheat-sheets`,
    `${BASE_URL}/about`,
    `${BASE_URL}/contact`,
    `${BASE_URL}/privacy-policy`,
    `${BASE_URL}/terms-of-service`,
    `${BASE_URL}/disclaimer`,
    `${BASE_URL}/blog`,
  ];

  // Category pages
  CATEGORIES.forEach(cat => {
    urls.push(`${BASE_URL}/category/${cat.id}`);
  });

  // Calculator pages (indexable only)
  INDEXABLE_CALCULATORS.forEach(calc => {
    urls.push(`${BASE_URL}/calculator/${calc.slug}`);
  });

  // SEO landing pages
  SEO_LANDING_PAGES.forEach(page => {
    urls.push(`${BASE_URL}/tools/${page.slug}`);
  });

  // Name generator pages
  const nameGenSlugs = [
    'baby-name-generator',
    'business-name-generator',
    'brand-name-generator',
    'domain-name-generator',
    'app-name-generator',
    'youtube-channel-name-generator',
    'instagram-username-generator',
    'islamic-baby-names',
  ];
  nameGenSlugs.forEach(slug => {
    urls.push(`${BASE_URL}/name-generators/${slug}`);
  });

  // Ecosystem pages
  ['weight-loss', 'financial-planning', 'student-success'].forEach(id => {
    urls.push(`${BASE_URL}/ecosystem/${id}`);
  });

  return urls;
}

/**
 * Submit URLs to IndexNow in batches of 10,000 (protocol limit).
 * Returns a summary of results.
 */
async function submitToIndexNow(urls: string[]): Promise<{
  submitted: number;
  batches: number;
  errors: string[];
}> {
  const BATCH_SIZE = 10_000;
  const errors: string[] = [];
  let batches = 0;

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    batches++;

    try {
      const res = await fetch(INDEXNOW_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          host:    'www.calculatorspoint.com',
          key:     INDEXNOW_KEY,
          keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
          urlList: batch,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => res.status.toString());
        errors.push(`Batch ${batches}: HTTP ${res.status} — ${text}`);
      }
    } catch (err) {
      errors.push(`Batch ${batches}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return { submitted: urls.length, batches, errors };
}

/** GET /api/indexnow?all=true  — submit all site URLs */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  if (searchParams.get('all') !== 'true') {
    return NextResponse.json({
      message: 'Add ?all=true to submit all site URLs to Bing IndexNow',
      keyFile: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
      totalUrls: getAllUrls().length,
    });
  }

  const urls = getAllUrls();
  const result = await submitToIndexNow(urls);

  return NextResponse.json({
    success: result.errors.length === 0,
    submitted: result.submitted,
    batches: result.batches,
    errors: result.errors,
    timestamp: new Date().toISOString(),
  }, { status: result.errors.length === 0 ? 200 : 207 });
}

/** POST /api/indexnow — submit a custom list of URLs */
export async function POST(request: Request) {
  let urls: string[];

  try {
    const body = await request.json();
    if (!Array.isArray(body.urls) || body.urls.length === 0) {
      return NextResponse.json({ error: 'Body must be { "urls": ["https://..."] }' }, { status: 400 });
    }
    urls = body.urls;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const result = await submitToIndexNow(urls);

  return NextResponse.json({
    success: result.errors.length === 0,
    submitted: result.submitted,
    batches: result.batches,
    errors: result.errors,
    timestamp: new Date().toISOString(),
  }, { status: result.errors.length === 0 ? 200 : 207 });
}
