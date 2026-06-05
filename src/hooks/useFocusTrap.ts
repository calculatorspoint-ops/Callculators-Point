import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'details > summary',
].join(', ');

/**
 * useFocusTrap
 *
 * Traps keyboard focus inside `containerRef` when `active` is true.
 * On activation: moves focus to the first focusable element inside the container.
 * On deactivation: returns focus to `returnFocusTo` if provided.
 *
 * Usage:
 *   const ref = useRef<HTMLDivElement>(null);
 *   useFocusTrap(ref, isOpen, triggerRef);
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  active: boolean,
  returnFocusRef?: React.RefObject<HTMLElement | null>
) {
  // Track the element focused before the trap was activated
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) {
      // Return focus to the trigger element or the previously focused element
      const returnTarget = returnFocusRef?.current ?? previouslyFocused.current;
      if (returnTarget && document.body.contains(returnTarget)) {
        returnTarget.focus();
      }
      return;
    }

    // Save the element that was focused before opening
    previouslyFocused.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    if (!container) return;

    // Move focus into the container
    const focusables = Array.from(
      container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
    ).filter(el => !el.closest('[aria-hidden="true"]'));

    if (focusables.length > 0) {
      // Small delay to let CSS transitions complete before stealing focus
      const raf = requestAnimationFrame(() => {
        focusables[0].focus();
      });
      return () => cancelAnimationFrame(raf);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const container = containerRef.current;
      if (!container) return;

      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
      ).filter(el => !el.closest('[aria-hidden="true"]'));

      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement;

      if (e.shiftKey) {
        // Shift+Tab: if on first element, wrap to last
        if (active === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab: if on last element, wrap to first
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}
