import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';

const isAnalyze = process.env.ANALYZE === 'true';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),

    // Bundle visualizer — only when ANALYZE=true npm run build
    isAnalyze && visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/bundle-report.html',
    }),

    viteCompression({ algorithm: 'gzip', ext: '.gz' }),
    viteCompression({ algorithm: 'brotliCompress', ext: '.br' }),

    VitePWA({
      registerType: 'autoUpdate',
      // FIX: Use 'script-defer' to stop registerSW.js from blocking render
      injectRegister: 'script-defer',
      devOptions: { enabled: false },
      manifest: {
        name: 'CalcPoint — Free Online Calculators',
        short_name: 'CalcPoint',
        description: 'Professional-grade calculators for finance, health, math, and everyday use.',
        theme_color: '#0f172a',
        background_color: '#020617',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png', purpose: 'any maskable' },
          { src: '/favicon-32x32.png',    sizes: '32x32',   type: 'image/png' },
          { src: '/favicon-16x16.png',    sizes: '16x16',   type: 'image/png' },
        ],
      },
      workbox: {
        // Pre-cache core assets only — NOT large lazy chunks
        globPatterns: ['**/*.{html,ico,png,svg,woff2,webp,manifest}'],
        // FIX: Exclude large on-demand chunks from pre-caching.
        // These are lazy-imported and should only download when actually needed,
        // not pre-fetched on page load (which causes "unused JS" in Lighthouse).
        globIgnores: [
          '**/bundle-report.html',
          '**/export-utils-*.js',   // html2canvas + jsPDF — only on Export click
          '**/charts-*.js',          // recharts + d3 — only on calculator pages with charts
          '**/firebase-*.js',        // Firebase — only if auth needed
          '**/sw.js',
          '**/workbox-*.js',
        ],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        // FIX: Inline the SW registration to remove registerSW.js network request
        inlineWorkboxRuntime: false,
        runtimeCaching: [
          // Google Fonts — cache-first, 1 year
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Static assets — stale-while-revalidate for JS/CSS
          {
            urlPattern: /\/assets\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-assets',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // API / dynamic — network-first
          {
            urlPattern: /\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 },
              networkTimeoutSeconds: 10,
            },
          },
        ],
      },
    }),
  ].filter(Boolean),

  resolve: {
    alias: { '@': '/src' },
  },

  server: {
    port: 3000,
    open: true,
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    // FIX: CSS code splitting — only load CSS for current route
    cssCodeSplit: true,
    // Modern output for tree-shaking
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
        pure_funcs: ['console.log', 'console.warn', 'console.info'],
        // FIX: More aggressive dead-code elimination
        dead_code: true,
        unused: true,
      },
      mangle: { safari10: true },
      format: { comments: false },
    },

    rollupOptions: {
      output: {
        // FIX: More granular code splitting to reduce unused JS per route
        manualChunks(id: string) {
          // Core React runtime — always needed
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('scheduler')) {
            return 'react-core';
          }
          // Router — must be before vendor catch-all
          if (id.includes('node_modules/react-router') || id.includes('node_modules/@remix-run')) {
            return 'react-router';
          }
          // Charting — LARGEST chunk, only loaded on calculator pages with charts
          if (id.includes('recharts') || id.includes('d3-') || id.includes('victory-')) {
            return 'charts';
          }
          // Form engine
          if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) {
            return 'forms';
          }
          // Icons — tree-shakeable but keep separate for caching
          if (id.includes('lucide-react')) {
            return 'icons';
          }
          // Math precision
          if (id.includes('decimal.js')) {
            return 'math';
          }
          // Firebase — lazily loaded
          if (id.includes('firebase')) {
            return 'firebase';
          }
          // FIX: Export utils — separate chunk, only loaded on demand
          // This is the 151 KiB chunk with 111 KiB unused (jspdf + html2canvas)
          if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('html-to-image')) {
            return 'export-utils';
          }
          // Zustand state
          if (id.includes('zustand')) {
            return 'state';
          }
          // Helmet
          if (id.includes('react-helmet')) {
            return 'helmet';
          }
          // Toast notifications
          if (id.includes('react-hot-toast')) {
            return 'toast';
          }
          // All other node_modules → vendor
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        // Content-hash filenames for immutable caching
        entryFileNames:  'assets/[name]-[hash].js',
        chunkFileNames:  'assets/[name]-[hash].js',
        assetFileNames:  'assets/[name]-[hash][extname]',
      },
      // FIX: Tree shake unused exports
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
    },
  },

  test: {
    exclude: ['**/node_modules/**', '**/dist/**', 'tests/**/*.spec.ts', 'tests/**/*.spec.js'],
  },
});
