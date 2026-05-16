import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';

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

    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
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
        // Pre-cache core assets
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,webp}'],
        // Skip large chunks — let them load on demand
        globIgnores: ['**/bundle-report.html'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
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
    // NOTE: Do NOT add Cache-Control headers here — breaks Vite HMR
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    // Raise chunk warning threshold to 600 kB (recharts is large)
    chunkSizeWarningLimit: 600,
    // CSS code splitting
    cssCodeSplit: true,
    // Modern output — ES2020 for tree-shaking and smaller output
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,        // Remove all console.* in production
        drop_debugger: true,
        passes: 2,                 // Double-pass for better compression
        pure_funcs: ['console.log', 'console.warn', 'console.info'],
      },
      mangle: { safari10: true },
      format: { comments: false }, // Strip all comments
    },

    rollupOptions: {
      output: {
        // Fine-grained code splitting
        manualChunks(id: string) {
          // Core React runtime
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('scheduler')) {
            return 'react-core';
          }
          // Router
          if (id.includes('react-router-dom') || id.includes('@remix-run')) {
            return 'react-router';
          }
          // Charting — largest bundle, isolated
          if (id.includes('recharts') || id.includes('d3-') || id.includes('victory-')) {
            return 'charts';
          }
          // Form engine
          if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) {
            return 'forms';
          }
          // UI utilities
          if (id.includes('lucide-react')) {
            return 'icons';
          }
          // Decimal.js — math precision library
          if (id.includes('decimal.js')) {
            return 'math';
          }
          // Firebase — only loaded if user needs auth
          if (id.includes('firebase')) {
            return 'firebase';
          }
          // PDF/Canvas export utilities
          if (id.includes('jspdf') || id.includes('html2canvas')) {
            return 'export-utils';
          }
          // Zustand state
          if (id.includes('zustand')) {
            return 'state';
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
    },
  },

});
