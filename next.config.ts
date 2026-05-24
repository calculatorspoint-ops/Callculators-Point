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
  experimental: {
    optimizeCss: true, // Inlines critical CSS to fix render-blocking warnings
  },

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

    if (!dev && !isServer) {
      // 1. Load the official standard minimizer (which does not crash on Tailwind)
      const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
      
      // 2. Add it to optimization using lightningcss which safely handles Tailwind CSS
      config.optimization.minimizer.push(new CssMinimizerPlugin({
        minify: CssMinimizerPlugin.lightningCssMinify,
        minimizerOptions: {
          targets: {
            safari: (14 << 16) | (1 << 8), // Safari 14.1
          },
        },
      }));

      // 3. Strip out the buggy built-in Next.js cssnano-simple
      config.plugins.push({
        apply(compiler: any) {
          compiler.hooks.compilation.tap('NoCssMinimizerPlugin', (compilation: any) => {
            compilation.hooks.processAssets.intercept({
              call() {
                const hook = compilation.hooks.processAssets as any;
                const taps: any[] = hook._taps ?? hook.taps ?? [];
                const before = taps.length;
                // Filter out the built-in Next.js one, keep ours
                const filtered = taps.filter((t: any) => 
                  t.name !== 'CssMinimizerPlugin' || 
                  (t.fn && t.fn.toString().includes('css-minimizer-webpack-plugin'))
                );
                
                // If it's hard to distinguish, just filter by name since our plugin might also be named 'CssMinimizerPlugin'.
                // Actually, css-minimizer-webpack-plugin uses the exact same tap name.
                // It's safer to just let both run? No, Next's one crashes.
                // Let's name our tap differently if we can, but we can't easily.
                // Let's filter out the one whose fn toString DOES NOT include 'css-minimizer-webpack-plugin'.
                const newlyFiltered = taps.filter((t: any) => {
                  if (t.name === 'CssMinimizerPlugin') {
                    const fnStr = t.fn ? t.fn.toString() : '';
                    // The official plugin typically contains 'optimize' or 'cssnano' in its compiled source
                    if (!fnStr.includes('__next_css_remove') && !fnStr.includes('cssnano-simple')) {
                       return true; // keep ours
                    }
                    return false; // remove Next's
                  }
                  return true;
                });
                
                taps.length = 0;
                newlyFiltered.forEach((t: any) => taps.push(t));
                if (newlyFiltered.length < before) {
                  console.log('[build] Built-in Next.js CssMinimizerPlugin removed, using official css-minimizer-webpack-plugin.');
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
