import type { NextConfig } from 'next';
import path from 'path';
import withPWAInit from '@ducanh2912/next-pwa';

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
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.calculatorspoint.com' }],
        destination: 'https://calculatorspoint.com/:path*',
        permanent: true, // 308 Permanent Redirect — browsers and crawlers cache it permanently
      },
    ];
  },

  // ── Headers ───────────────────────────────────────────────────────────────
  async headers() {
    return [
      // Security headers for all pages
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      // Long-lived cache for content-hashed static assets (CSS, JS, fonts, images)
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
      const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
      
      config.optimization.minimizer.push(new CssMinimizerPlugin({
        minify: CssMinimizerPlugin.lightningCssMinify,
        minimizerOptions: {
          targets: { safari: (14 << 16) | (1 << 8) },
        },
      }));
    }

    return config;
  },
};

export default withPWA(nextConfig);
