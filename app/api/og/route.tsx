import { ImageResponse } from 'next/og';
import { SITE_NAME } from '@/config/site';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Sanitize and limit inputs per user instructions to prevent abuse
    const title = searchParams.get('title')?.slice(0, 80) || SITE_NAME;
    const icon = searchParams.get('icon')?.slice(0, 4) || '🧮';
    const cat = searchParams.get('cat')?.slice(0, 40) || 'Calculator';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a', // Tailwind slate-900
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.03) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.03) 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            fontFamily: '"Inter", sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(30, 41, 59, 0.7)', // Tailwind slate-800 with opacity
              border: '2px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '32px',
              padding: '60px 80px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              textAlign: 'center',
              maxWidth: '1000px',
            }}
          >
            <div
              style={{
                fontSize: '96px',
                marginBottom: '24px',
                filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))',
              }}
            >
              {icon}
            </div>
            
            <div
              style={{
                fontSize: '24px',
                color: '#60a5fa', // Tailwind blue-400
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontWeight: 800,
                marginBottom: '20px',
              }}
            >
              {cat}
            </div>

            <div
              style={{
                fontSize: '68px',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                marginBottom: '40px',
              }}
            >
              {title}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 32px',
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: '100px',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                }}
              />
              <span
                style={{
                  fontSize: '26px',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.9)',
                  letterSpacing: '-0.01em',
                }}
              >
                calculatorspoint.com
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          // Cache each unique OG image at the CDN edge for 24 h.
          // stale-while-revalidate gives a 7-day grace window so crawlers
          // never hit a cold-start — the old image is served while the new
          // one generates in the background.
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        },
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
      headers: {
        // Short negative-cache TTL to allow retry — avoids caching broken
        // images for long periods at the CDN while still reducing thundering
        // herd on repeated failures.
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  }
}
