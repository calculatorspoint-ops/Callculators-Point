'use client';
/**
 * src/components/ui/BackToTop.tsx
 * A "Back to Top" button that appears after scrolling 400px down.
 * Respects prefers-reduced-motion for the scroll animation.
 */
import { useState, useEffect, useCallback } from 'react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  const handleScroll = useCallback(() => {
    setVisible(window.scrollY > 400);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollUp = () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'instant' : 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollUp}
      aria-label="Scroll back to top"
      title="Back to top"
      style={{
        position: 'fixed',
        bottom: 'calc(24px + env(safe-area-inset-bottom))',
        right: 20,
        zIndex: 400,
        width: 44,
        height: 44,
        borderRadius: '50%',
        border: '1.5px solid var(--border)',
        background: 'linear-gradient(135deg, var(--brand), #7c3aed)',
        color: '#fff',
        fontSize: 18,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(37,99,235,.4)',
        transition: 'all .2s',
        fontFamily: 'var(--font)',
        animation: 'fadeSlide .25s ease',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px) scale(1.08)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; }}
    >
      ↑
    </button>
  );
}
