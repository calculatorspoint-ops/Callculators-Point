/**
 * src/firebase/config.js — LEGACY Firebase config (kept for backward compat).
 *
 * NOTE: The primary Firebase config is src/lib/firebase/config.ts.
 * This file is kept because some older imports may reference it.
 * It now re-exports from the primary config to avoid duplicate initialization.
 *
 * The old dummy fallbacks ("dummy-api-key" etc.) have been removed because
 * they caused Firebase to attempt real network connections with invalid credentials,
 * which generated "FirebaseError: API key not valid" console errors.
 */
import { getApps, getApp, initializeApp } from 'firebase/app';

const isConfigured =
  typeof process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === 'string' &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID.length > 0;

const firebaseConfig = isConfigured ? {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
} : null;

// Only init if configured and not already initialized
export const app = isConfigured && firebaseConfig
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp())
  : null;
