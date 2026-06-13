import { useEffect, useRef, useState } from "react";

/**
 * Google AdSense ad unit component.
 *
 * Publisher ID: ca-pub-5164672592255197
 * The global AdSense script is loaded once in app/layout.tsx — do NOT add it here.
 *
 * CLS PREVENTION:
 *   Each ad slot reserves explicit minimum height AND width before the ad loads.
 *   The wrapper uses `display: block` and stable CSS dimensions so the browser
 *   knows the space during layout — no shift when the iframe injects.
 *
 * USAGE:
 *   <AdUnit slot="YOUR_SLOT_ID" />
 *   <AdBanner position="afterCalc" />
 *
 * To get slot IDs: Google AdSense Dashboard → Ads → By ad unit → Create ad unit.
 */

const PUBLISHER_ID = "ca-pub-5164672592255197";

/**
 * AdUnit
 *
 * @param {string}  slot        — AdSense 10-digit slot ID
 * @param {string}  [format]    — ad format (default: "auto")
 * @param {boolean} [fullWidth] — data-full-width-responsive
 * @param {string}  [className] — extra CSS classes on the wrapper
 * @param {number}  [minHeight] — reserved height in px (prevents CLS)
 * @param {string}  [position]  — "top" | "bottom" | "sidebar" | "inContent" | "afterCalc"
 */
export function AdUnit({
  slot,
  format = "auto",
  fullWidth = true,
  className = "",
  minHeight = 90,
  position = "generic",
}) {
  const adRef = useRef(null);
  const [pushed, setPushed] = useState(false);

  useEffect(() => {
    // Guard: only push once per mount
    if (pushed) return;

    // Use IntersectionObserver to push ads only when near/in the viewport.
    // rootMargin 200px triggers 200 px before the ad slot enters view.
    if (typeof IntersectionObserver === "undefined") {
      // Fallback for very old browsers: push immediately
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setPushed(true);
      } catch (e) {
        console.warn("AdSense push error:", e.message);
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          try {
            if (typeof window !== "undefined") {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
              setPushed(true);
            }
          } catch (e) {
            console.warn("AdSense push error:", e.message);
          }
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => observer.disconnect();
  }, [pushed]);

  // Guard: don't render anything if the slot ID hasn't been configured yet.
  // This prevents empty grey "Advertisement" boxes during the AdSense review period.
  if (!slot || slot.startsWith('REPLACE_WITH')) return null;

  return (
    /*
     * CLS PREVENTION WRAPPER
     * ─────────────────────
     * - display: block  → participates in block layout (no collapsed inline)
     * - minHeight       → reserves vertical space before iframe injects
     * - width: 100%     → stable horizontal size, no shift when ad expands
     * - overflow:hidden → iframe cannot bleed outside reserved area
     * - box-sizing      → prevents padding from changing reserved size
     */
    <div
      className={`ad-unit ad-unit--${position} ${className}`}
      aria-label="Advertisement"
      style={{
        display: "block",
        width: "100%",
        minHeight: minHeight,
        overflow: "hidden",
        boxSizing: "border-box",
        // Subtle placeholder bg so the reserved area looks intentional, not broken
        background: "var(--surf2, #f8fafc)",
        borderRadius: 8,
        border: "1px solid var(--border, #e2e8f0)",
      }}
    >
      {/* Accessible label — hidden from screen readers once ad has loaded */}
      <p
        aria-hidden="true"
        style={{
          color: "var(--txt3, #94a3b8)",
          letterSpacing: ".05em",
          fontSize: 9,
          fontWeight: 600,
          textAlign: "center",
          margin: "4px 0 2px",
          textTransform: "uppercase",
          lineHeight: 1,
        }}
      >
        Advertisement
      </p>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          // display:block is required by AdSense spec
          display: "block",
          // Ensure the ins element fills the reserved space
          minHeight: minHeight - 20, // subtract label height
          width: "100%",
        }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidth ? "true" : "false"}
      />
    </div>
  );
}

/**
 * Pre-configured ad unit positions.
 *
 * ⚠️ IMPORTANT: Replace these slot IDs with real slot IDs from your AdSense dashboard.
 * Path: AdSense Dashboard → Ads → By ad unit → Display ads → Create ad unit
 * Each slot ID is a 10-digit number.
 *
 * minHeight values match the expected ad unit size per Google's specs to prevent CLS:
 *   - Leaderboard (728×90)  → minHeight 90
 *   - Medium rectangle      → minHeight 250
 *   - In-article / native   → minHeight 100
 */
const AD_SLOTS = {
  top:       { slot: "REPLACE_WITH_TOP_SLOT_ID",       minHeight: 90  },
  bottom:    { slot: "REPLACE_WITH_BOTTOM_SLOT_ID",    minHeight: 90  },
  sidebar:   { slot: "REPLACE_WITH_SIDEBAR_SLOT_ID",   minHeight: 250 },
  inContent: { slot: "REPLACE_WITH_INCONTENT_SLOT_ID", minHeight: 100 },
  afterCalc: { slot: "REPLACE_WITH_AFTERCALC_SLOT_ID", minHeight: 90  },
};

/**
 * AdBanner — convenience wrapper for common placements.
 *
 * CLS notes:
 *  - `minHeight` is passed down to the AdUnit wrapper
 *  - The outer div adds `min-height` via inline style so the space is
 *    reserved even if AdSense script fails to load
 */
export function AdBanner({ position = "top" }) {
  const config = AD_SLOTS[position] || AD_SLOTS.top;
  // Guard: don't render during review period when slot IDs aren't yet configured
  if (!config.slot || config.slot.startsWith('REPLACE_WITH')) return null;
  return (
    // Outer container guarantees the reserved height even before AdUnit renders
    <div
      style={{
        display: "block",
        width: "100%",
        minHeight: config.minHeight + 28, // +28 for label + padding
        margin: "16px 0",
        boxSizing: "border-box",
      }}
    >
      <AdUnit
        slot={config.slot}
        format="auto"
        minHeight={config.minHeight}
        position={position}
        className={position === "sidebar" ? "" : "w-full"}
      />
    </div>
  );
}
