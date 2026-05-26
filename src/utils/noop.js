/**
 * noop.js — Empty module used by webpack NormalModuleReplacementPlugin
 * to eliminate core-js polyfills from client bundles.
 *
 * All polyfilled APIs (Array.at, Object.fromEntries, Object.hasOwn, etc.)
 * are natively supported by our browserslist targets:
 *   chrome >= 100, firefox >= 100, safari >= 15, edge >= 100
 */
// intentionally empty
