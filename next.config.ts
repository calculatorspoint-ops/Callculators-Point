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

    // ── Kill CssMinimizerPlugin before it can process CSS ─────────────────
    // ROOT CAUSE: cssnano-simple (bundled in Next.js) crashes on Tailwind's
    // modern CSS selectors: .left-1\/2, .bg-black\/50, .dark:hover:...
    //
    // PREVIOUS APPROACH (failed): removing from config.optimization.minimizer
    // — too early. The plugin's apply() had already registered a tap on
    // compilation.hooks.processAssets by the time we removed it from the array.
    //
    // THIS APPROACH: hook into compiler.hooks.compilation, then use
    // compilation.hooks.processAssets.intercept({ call }) to strip the
    // CssMinimizerPlugin tap RIGHT BEFORE processAssets fires — after all
    // plugins have registered their taps but before any tap runs.
    // This is guaranteed to work regardless of plugin registration order.
    if (!dev && !isServer) {
      config.plugins.push({
        apply(compiler: any) {
          compiler.hooks.compilation.tap('NoCssMinimizerPlugin', (compilation: any) => {
            compilation.hooks.processAssets.intercept({
              call() {
                // Fires synchronously when processAssets is about to run.
                // Filter out CssMinimizerPlugin's tap before it executes.
                const hook = compilation.hooks.processAssets as any;
                const taps: any[] = hook._taps ?? hook.taps ?? [];
                const before = taps.length;
                const filtered = taps.filter((t: any) => t.name !== 'CssMinimizerPlugin');
                taps.length = 0;
                filtered.forEach((t: any) => taps.push(t));
                if (filtered.length < before) {
                  console.log('[build] CssMinimizerPlugin tap removed — Tailwind CSS selectors preserved');
                }
              },
            });
          });
        },
      });
    }

    return config;
  },
};

export default withPWA(nextConfig);
