import type { NextConfig } from 'next';
import path from 'path';
import withPWAInit from '@ducanh2912/next-pwa';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import webpack from 'webpack';

const withPWA = withPWAInit({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },

  // ── Experimental ──────────────────────────────────────────────────────────
  experimental: {
    // Tree-shake these packages at the import level so only used exports are bundled
    optimizePackageImports: ['lucide-react', 'recharts', 'date-fns'],

    // Inline critical CSS into HTML <head> and defer the rest.
    // This eliminates render-blocking CSS from the critical path.
    optimizeCss: true,

    // Split CSS per-page so each page loads only styles it uses,
    // instead of one 35KB monolithic bundle blocking all pages.
    cssChunking: 'strict',
  },

  // ── Server externals — keep heavy server-only libs out of client bundle ──
  serverExternalPackages: ['firebase'],

  // ── Images ────────────────────────────────────────────────────────────────
  images: {
    remotePatterns: [],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // ── Redirects ─────────────────────────────────────────────────────────────
  // Force www → non-www at the app level so Vercel doesn't add a round-trip.
  // The canonical URL throughout the codebase is https://calculatorspoint.com (no www).
  // This redirect runs on the CDN edge — zero extra server latency.
  async redirects() {
    return [
      // ── www → non-www (canonical domain) ────────────────────────────────
      // Runs on the CDN edge — zero extra server latency.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.calculatorspoint.com' }],
        destination: 'https://calculatorspoint.com/:path*',
        permanent: true, // 308 Permanent Redirect — browsers and crawlers cache it permanently
      },

      // ── Legacy / duplicate URL patterns → canonical /calculator/:slug ───
      // These patterns may exist in Google's index from previous site versions.
      // 301 redirects consolidate PageRank to the canonical URL and eliminate
      // duplicate-content dilution.

      // /in/tools/:slug → /calculator/:slug
      {
        source: '/in/tools/:slug',
        destination: '/calculator/:slug',
        permanent: true,
      },

      // /in/calculator/:slug → /calculator/:slug
      {
        source: '/in/calculator/:slug',
        destination: '/calculator/:slug',
        permanent: true,
      },

      // /convert/:slug → /calculator/:slug
      // (unit-converter landing pages that may appear as /convert/length-converter etc.)
      {
        source: '/convert/:slug',
        destination: '/calculator/:slug',
        permanent: true,
      },

      // /tools/:slug does NOT get a redirect — it's a valid canonical route
      // serving long-form SEO landing pages. Each /tools/ page has its own
      // canonical tag pointing to itself.
    ];
  },

  // ── Headers ───────────────────────────────────────────────────────────────
  async headers() {
    // ── Content Security Policy ────────────────────────────────────────────
    // Designed to be compatible with:
    //   • Google AdSense (pagead2.googlesyndication.com, doubleclick.net)
    //   • Google Analytics (googletagmanager.com, google-analytics.com)
    //   • Google Fonts (fonts.googleapis.com, fonts.gstatic.com)
    //   • Next.js inline scripts (theme init, JSON-LD)
    //
    // TRADEOFF: 'unsafe-inline' for scripts is required by Google AdSense.
    // All major AdSense publishers use it. The CSP still meaningfully prevents:
    //   • object injection (object-src 'none')
    //   • base-tag hijacking (base-uri 'self')
    //   • unexpected frame embeds (frame-ancestors 'self')
    //   • unexpected data exfiltration (connect-src allowlist)
    const ContentSecurityPolicy = [
      "default-src 'self'",
      // Scripts: self + Next.js runtime + Google services + AdSense
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com https://www.gstatic.com https://adservice.google.com https://partner.googleadservices.com https://tpc.googlesyndication.com",
      // Styles: self + Next.js inline styles + Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts: self + Google Fonts CDN
      "font-src 'self' https://fonts.gstatic.com",
      // Images: self + data URIs (inline SVGs) + all HTTPS (og:image, ads)
      "img-src 'self' data: https: blob:",
      // Frames: only Google Ad frames allowed
      "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com",
      // XHR/fetch: self + Google Analytics + AdSense reporting
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com https://firebaseapp.com https://*.firebaseio.com",
      // No plugins, no applets
      "object-src 'none'",
      // Prevent base-tag hijacking
      "base-uri 'self'",
      // Prevent clickjacking via iframes
      "frame-ancestors 'self'",
      // Only upgrade insecure requests (not block them, avoids breaking mixed content)
      "upgrade-insecure-requests",
    ].join('; ');

    // ── Permissions Policy ─────────────────────────────────────────────────
    // Restricts access to powerful browser APIs not used by this site.
    // Keeps the policy minimal to avoid breaking future features.
    const PermissionsPolicy = [
      'camera=()',           // No camera access
      'microphone=()',       // No microphone access
      'geolocation=()',      // No geolocation (calculators use self-entered data)
      'payment=()',          // No payment API
      'usb=()',              // No USB access
      'interest-cohort=()',  // Opt out of Google FLoC (deprecated but safe to keep)
    ].join(', ');

    return [
      // ── Security headers for all pages ────────────────────────────────────
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          // X-Frame-Options is superseded by frame-ancestors in CSP, but kept
          // for older browsers that don't support CSP frame-ancestors
          { key: 'X-Frame-Options',         value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control',   value: 'on' },
          { key: 'Content-Security-Policy',  value: ContentSecurityPolicy },
          { key: 'Permissions-Policy',       value: PermissionsPolicy },
        ],
      },
      // ── Long-lived cache for content-hashed static assets (CSS, JS, fonts, images)
      // These files have unique hashes in their names, so it's safe to cache forever.
      // On repeat visits this eliminates ALL render-blocking CSS/JS (served from cache).
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache fonts for 1 year (they rarely change)
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },


// ── Webpack ───────────────────────────────────────────────────────────────
  webpack(config, { dev, isServer }) {
    // Resolve @/ → src/
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };

    if (!dev && !isServer) {
      config.optimization.minimizer.push(new CssMinimizerPlugin({
        minify: CssMinimizerPlugin.lightningCssMinify,
        minimizerOptions: {
          targets: { safari: (14 << 16) | (1 << 8) },
        },
      }));

      // ── Eliminate core-js polyfills (12KB savings) ──────────────────────
      // jspdf → canvg → core-js pulls in polyfills for Array.at, Object.fromEntries,
      // Object.hasOwn, String.trimStart, etc. — all natively supported in our
      // browserslist targets (Chrome/Firefox/Edge 100+, Safari 15+).
      // Replace all core-js imports with empty modules so they tree-shake to zero.
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /core-js/,
          require.resolve('./src/utils/noop.js')
        )
      );
    }

    return config;
  },
};

export default withPWA(nextConfig);
