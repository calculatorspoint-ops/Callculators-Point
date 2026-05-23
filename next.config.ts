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
    // cssnano-simple (bundled in Next.js) crashes on Tailwind's modern CSS:
    //   - fractional selectors:  .left-1\/2, .top-1\/2
    //   - opacity modifiers:     .bg-black\/50, .dark\:bg-blue-900\/20
    //
    // We use the `afterEnvironment` webpack hook which fires AFTER all
    // webpack plugins have called their apply() method — this is the only
    // guaranteed point where optimization.minimizer is fully populated.
    // Removing it here prevents the build crash on both local and Vercel.
    if (!dev && !isServer) {
      config.plugins.push({
        apply(compiler: any) {
          compiler.hooks.afterEnvironment.tap('RemoveCssMinimizerPlugin', () => {
            const minimizers = compiler.options.optimization?.minimizer;
            if (Array.isArray(minimizers)) {
              compiler.options.optimization.minimizer = minimizers.filter(
                (m: any) => m?.constructor?.name !== 'CssMinimizerPlugin'
              );
              console.log(
                '[build] CssMinimizerPlugin removed — Tailwind fractional selectors preserved'
              );
            }
          });
        },
      });
    }

    return config;
  },
};

export default withPWA(nextConfig);
