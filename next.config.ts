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

  // ── Images ────────────────────────────────────────────────────────────────
  images: {
    remotePatterns: [],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // ── Redirects ─────────────────────────────────────────────────────────────
  async redirects() {
    return [];
  },

  // ── Headers ───────────────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
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

    // ── Remove CssMinimizerPlugin ──────────────────────────────────────────
    // Next.js bundles cssnano-simple which crashes on modern CSS used by
    // Tailwind (e.g. fractional selectors like .left-1\/2, .w-1\/2).
    // The plugin lives in config.optimization.minimizer — we remove it here.
    // CSS is still served correctly; Vercel compresses via Gzip/Brotli.
    if (!dev && !isServer && config.optimization?.minimizer) {
      config.optimization.minimizer = (config.optimization.minimizer as any[]).filter(
        (plugin: any) =>
          !(plugin?.constructor?.name === 'CssMinimizerPlugin') &&
          !(plugin?.__proto__?.constructor?.name === 'CssMinimizerPlugin')
      );
    }

    return config;
  },
};

export default withPWA(nextConfig);
