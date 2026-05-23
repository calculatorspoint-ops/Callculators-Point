import type { NextConfig } from 'next';
import path from 'path';

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
  webpack(config, { isServer, webpack }) {
    // Resolve @/ → src/
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };

    // Allow .js imports to resolve to .ts files (Vite ESM pattern)
// ── Patch CSS minimizer to handle modern CSS ────────────────────────────
    // Next's built-in cssnano-simple fails on modern CSS features:
    //   - grid-column: span 1 / span 1  (used by Tailwind col-span-*)
    //   - .left-1\/2 selector           (Tailwind fractional utilities)
    // We patch the CssMinimizerPlugin.optimizeAsset to catch parse errors
    // and fall back to unminified CSS rather than crashing the build.
    if (!isServer) {
      config.plugins.push({
        apply(compiler: any) {
          compiler.hooks.afterPlugins.tap('PatchCssMinimizer', () => {
            for (const plugin of compiler.options.plugins || []) {
              // Find the CssMinimizerPlugin by its internal marker
              if (plugin && (plugin as { __next_css_remove?: boolean }).__next_css_remove) {
                const original = (plugin as { optimizeAsset?: Function }).optimizeAsset?.bind(plugin);
                if (original) {
                  (plugin as { optimizeAsset?: Function }).optimizeAsset = async function(file: string, asset: unknown) {
                    try {
                      return await original(file, asset);
                    } catch (err) {
                      console.warn(
                        `[CSS] cssnano-simple failed on ${file} — using unminified fallback. Error: ${(err as Error).message}`
                      );
                      // Return the asset as-is (unminified) rather than crashing
                      const { sources } = require('webpack');
                      const source = (asset as { source: () => string }).source();
                      return new sources.RawSource(source);
                    }
                  };
                }
              }
            }
          });
        },
      });
    }

    return config;
  },
};

export default nextConfig;



