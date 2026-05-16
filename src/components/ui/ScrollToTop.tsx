import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scroll to top on every route change.
 * Uses the native scrollTo API — no layout thrash.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}
