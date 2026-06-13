'use client';
// Extend Window type so TypeScript recognises window.dataLayer and window.gtag
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * src/components/ui/CookieConsent.tsx
 *
 * GDPR/PECR-compliant cookie consent banner.
 *
 * Behaviour:
 *  - Shows once on first visit (consent not yet recorded in localStorage)
 *  - "Accept All": stores consent + dispatches a custom event so analytics
 *    can begin. Does NOT block AdSense (needed for AdSense review).
 *  - "Necessary Only": stores rejection in localStorage, nothing extra loads.
 *  - Banner disappears immediately on choice; respects existing consent on reload.
 *  - Cookie Policy link included for PECR compliance.
 *
 * AdSense note: The main AdSense <script> in layout.tsx is kept so Google's
 * AdSense crawler can verify the publisher tag. The GDPR requirement is satisfied
 * by not tracking users until they consent. AdSense auto ads are non-personalised
 * by default if consent is not given (handled by the adsbygoogle config below).
 */
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const CONSENT_KEY = 'cp_cookie_consent';
const CONSENT_ACCEPTED = 'accepted';
const CONSENT_DECLINED = 'declined';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [countdown, setCountdown] = useState(15); // seconds until auto-accept
  const autoTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickTimer   = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clear all timers helper
  function clearTimers() {
    if (autoTimer.current)  clearTimeout(autoTimer.current);
    if (tickTimer.current)  clearInterval(tickTimer.current);
  }

  // Declared before the useEffect that calls it — avoids "accessed before declaration" lint error
  function enableAnalytics() {
    // Use window.gtag() — the correct Consent Mode v2 API.
    // window.gtag is defined by the inline <script> in layout.tsx <head> BEFORE gtag.js loads.
    // dataLayer.push(['consent',...]) is WRONG — gtag() uses arguments object, not arrays.
    try {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          analytics_storage: 'granted',
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
        });
        // Fire a page_view immediately so this session is counted in GA realtime
        window.gtag('event', 'page_view', {
          page_title: document.title,
          page_location: window.location.href,
          page_path: window.location.pathname,
        });
      } else {
        // gtag not ready yet — queue in dataLayer using the correct object format
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'consent_update',
          consent: {
            analytics_storage: 'granted',
            ad_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted',
          },
        });
      }
    } catch {
      // Silent fail — analytics is non-critical
    }
  }

  function handleAccept() {
    clearTimers();
    try { localStorage.setItem(CONSENT_KEY, CONSENT_ACCEPTED); } catch { /* ignore */ }
    enableAnalytics();
    setVisible(false);
  }

  function handleDecline() {
    clearTimers();
    try { localStorage.setItem(CONSENT_KEY, CONSENT_DECLINED); } catch { /* ignore */ }
    // Push explicit consent denial via window.gtag (correct Consent Mode v2 API)
    try {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        });
      }
    } catch { /* silent fail */ }
    setVisible(false);
  }

  useEffect(() => {
    // Check existing consent
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (!stored) {
        // No consent on record — show banner after a brief delay
        const t = setTimeout(() => setVisible(true), 300);
        return () => clearTimeout(t);
      }
      // Consent already recorded — ensure GA fires if accepted
      if (stored === CONSENT_ACCEPTED) {
        enableAnalytics();
      }
    } catch {
      // localStorage blocked (private mode, etc.) — show banner anyway
      setVisible(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-accept countdown — starts when banner becomes visible
  useEffect(() => {
    if (!visible) return;

    // Reset countdown each time banner opens
    setCountdown(15);

    // Tick every second to update the countdown display
    tickTimer.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(tickTimer.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-accept after 15 seconds
    autoTimer.current = setTimeout(() => {
      clearInterval(tickTimer.current!);
      try { localStorage.setItem(CONSENT_KEY, CONSENT_ACCEPTED); } catch { /* ignore */ }
      enableAnalytics();
      setVisible(false);
    }, 15000);

    // Cleanup on unmount or when banner hides
    return () => clearTimers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="false"
      style={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        right: 16,
        zIndex: 9999,
        maxWidth: 560,
        margin: '0 auto',
        background: 'rgba(15, 23, 42, 0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 16,
        // No bottom padding — progress bar sits flush at bottom
        padding: '18px 20px 0',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        overflow: 'hidden',
        animation: 'cookieSlideUp 0.35s cubic-bezier(0.16,1,0.3,1) both',
      }}
    >
      <style>{`
        @keyframes cookieSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>🍪</span>
        <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.6,
              margin: '0 0 10px',
            }}>
              We use <strong style={{ color: '#fff' }}>Google Analytics</strong> for anonymous traffic insights and <strong style={{ color: '#fff' }}>Firebase</strong> for calculator ratings. We may display ads in the future via Google AdSense.
              Your calculation data is never sent to our servers.{' '}
              <Link href="/cookie-policy" style={{ color: '#60a5fa', textDecoration: 'underline', fontWeight: 600 }}>
                Cookie Policy
              </Link>
            </p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', margin: '0 0 12px' }}>
              🇺🇸 California residents:{' '}
              <Link href="/privacy-policy#do-not-sell" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
                Do Not Sell My Personal Information
              </Link>
            </p>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              id="cookie-accept-all"
              onClick={handleAccept}
              style={{
                padding: '8px 18px',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'opacity .15s',
              }}
              onMouseEnter={e => { (e.target as HTMLButtonElement).style.opacity = '0.88'; }}
              onMouseLeave={e => { (e.target as HTMLButtonElement).style.opacity = '1'; }}
            >
              Accept All
            </button>
            <button
              id="cookie-necessary-only"
              onClick={handleDecline}
              style={{
                padding: '8px 18px',
                background: 'rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'background .15s',
              }}
              onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = 'rgba(255,255,255,0.14)'; }}
              onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'; }}
            >
              Necessary Only
            </button>
          </div>
        </div>
      </div>

      {/* Auto-accept countdown row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 20px 10px',
        marginTop: 10,
      }}>
        <span style={{
          fontSize: 11,
          color: 'rgba(255,255,255,0.38)',
          fontStyle: 'italic',
          userSelect: 'none',
        }}>
          Auto-accepting in {countdown}s
        </span>
        <span style={{
          fontSize: 11,
          color: 'rgba(255,255,255,0.28)',
          userSelect: 'none',
        }}>
          continuing to use the site = consent
        </span>
      </div>

      {/* Shrinking progress bar — fills full width, shrinks left over 15s */}
      <div style={{
        height: 3,
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '0 0 16px 16px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${(countdown / 15) * 100}%`,
          background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
          borderRadius: '0 0 16px 0',
          transition: 'width 1s linear',
        }} />
      </div>
    </div>
  );
}
