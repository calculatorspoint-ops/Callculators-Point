/**
 * scripts/patch-css-minimizer.cjs
 *
 * Postinstall patch: replaces Next.js's CssMinimizerPlugin with a no-op version
 * that skips CSS minification entirely.
 *
 * WHY: The bundled cssnano-simple in Next.js 15 crashes on modern CSS selectors
 * produced by Tailwind (e.g. .left-1\/2, .bg-black\/50, dark:hover selectors).
 * This is a known upstream issue. CSS is still served correctly and is compressed
 * by Vercel's Brotli/Gzip edge compression — no performance impact.
 *
 * This script runs automatically after every `npm install` (including on Vercel)
 * via the `postinstall` hook in package.json.
 */

const fs = require('fs');
const path = require('path');

const pluginPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'next',
  'dist',
  'build',
  'webpack',
  'plugins',
  'css-minimizer-plugin.js'
);

const noOpPlugin = `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
Object.defineProperty(exports, "CssMinimizerPlugin", { enumerable: true, get: function() { return CssMinimizerPlugin; } });
const _webpack = require("next/dist/compiled/webpack/webpack");
class CssMinimizerPlugin {
    constructor(options){ this.options = options; this.__next_css_remove = true; }
    // No-op: returns original CSS without minification.
    // cssnano-simple crashes on modern Tailwind CSS selectors (e.g. .left-1\\/2).
    // CSS is compressed by Vercel Brotli/Gzip — no performance loss.
    optimizeAsset(file, asset) {
        return Promise.resolve(new _webpack.sources.RawSource(asset.source()));
    }
    apply(compiler) {
        compiler.hooks.compilation.tap('CssMinimizerPlugin', (compilation) => {
            compilation.hooks.processAssets.tapPromise(
                { name: 'CssMinimizerPlugin', stage: _webpack.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE },
                async (assets) => {
                    const files = Object.keys(assets).filter(file => /\\.css(\\?.*)?$/i.test(file));
                    await Promise.all(files.map(async (file) => {
                        const assetSource = compilation.getAsset(file).source;
                        const result = await this.optimizeAsset(file, assetSource);
                        compilation.updateAsset(file, result);
                    }));
                }
            );
        });
    }
}
`;

try {
  if (!fs.existsSync(pluginPath)) {
    console.log('[patch-css-minimizer] Plugin file not found — skipping patch.');
    process.exit(0);
  }

  const current = fs.readFileSync(pluginPath, 'utf8');

  // Already patched (no-op version is short)
  if (current.includes('No-op: returns original CSS')) {
    console.log('[patch-css-minimizer] Already patched — skipping.');
    process.exit(0);
  }

  fs.writeFileSync(pluginPath, noOpPlugin, 'utf8');
  console.log('[patch-css-minimizer] ✓ CssMinimizerPlugin patched — Tailwind CSS selectors preserved.');
} catch (err) {
  console.error('[patch-css-minimizer] Failed to patch:', err.message);
  // Don't fail the install if patch fails
  process.exit(0);
}
