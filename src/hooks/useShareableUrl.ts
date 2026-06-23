/**
 * src/hooks/useShareableUrl.ts
 *
 * F2 fix: URL-shareable calculator state.
 *
 * USAGE in any calculator form:
 *   const { setParams, shareUrl } = useShareableUrl();
 *   // Call setParams({ principal: '500000', rate: '8' }) on calculation
 *   // The share button will then share a URL with these pre-filled values
 *
 * URL format: /calculator/[slug]?principal=500000&rate=8
 *
 * On load, calculator forms can read initial values from:
 *   const searchParams = useSearchParams();
 *   const initial = searchParams.get('principal') ?? '';
 */
'use client';
import { useCallback, useEffect, useRef } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

export function useShareableUrl() {
  const pathname  = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramsRef = useRef<Record<string, string>>({});

  // Read initial params from URL on mount
  useEffect(() => {
    const initial: Record<string, string> = {};
    searchParams.forEach((v, k) => { initial[k] = v; });
    paramsRef.current = initial;
  }, [searchParams]);

  /**
   * setParams — call this when a calculation completes to push state to the URL.
   * Uses history.replaceState so it doesn't add a browser history entry.
   */
  const setParams = useCallback((params: Record<string, string | number>) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== '' && v !== undefined && v !== null) qs.set(k, String(v));
    });
    paramsRef.current = Object.fromEntries(qs.entries());
    const newUrl = `${pathname}?${qs.toString()}`;
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', newUrl);
    }
  }, [pathname]);

  /**
   * clearParams — call this when the user clears/resets the form.
   */
  const clearParams = useCallback(() => {
    paramsRef.current = {};
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', pathname);
    }
  }, [pathname]);

  /**
   * shareUrl — returns the current full URL with params for sharing.
   */
  const shareUrl = typeof window !== 'undefined' ? window.location.href : pathname;

  return { setParams, clearParams, shareUrl, searchParams };
}
