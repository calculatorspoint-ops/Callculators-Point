import { useEffect, useRef, useState } from "react";

/**
 * Google AdSense ad unit component.
 *
 * Publisher ID: ca-pub-5164672592255197
 * The global AdSense script is loaded once in app/layout.tsx — do NOT add it here.
 *
 * CLS PREVENTION: Each ad slot reserves minimum height via the wrapper style.
 * This prevents layout shift when the ad loads asynchronously.
 *
 * USAGE:
 *   <AdUnit slot="YOUR_SLOT_ID" />
 *   <AdBanner position="afterCalc" />
 *
 * To get slot IDs: Google AdSense Dashboard → Ads → By ad unit → Create ad unit.
 */

const PUBLISHER_ID = "ca-pub-5164672592255197";

export function AdUnit({ slot, format = "auto", fullWidth = true, className = "", minHeight = 90 }) {
  const adRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Guard: only push once, and only when adsbygoogle script has loaded
    if (loaded) return;

    // Use IntersectionObserver so we only push ads that are in/near the viewport
    // This prevents wasted pushes for below-fold ads that may never be seen
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          try {
            if (typeof window !== "undefined") {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
              setLoaded(true);
            }
          } catch (e) {
            console.warn("AdSense push error:", e.message);
          }
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // trigger 200px before entering viewport
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => observer.disconnect();
  }, [loaded]);

  return (
    <div
      className={`ad-unit ${className}`}
      aria-label="Advertisement"
      // CLS PREVENTION: reserve minimum height so content doesn't shift when ad loads
      style={{ minHeight: minHeight, overflow: "hidden" }}
    >
      {/* ARIA label required for accessibility compliance */}
      <p
        className="text-xs font-semibold text-center mb-1"
        style={{ color: "var(--txt3)", letterSpacing: ".05em", fontSize: 10, marginBottom: 4 }}
      >
        ADVERTISEMENT
      </p>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
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
 * minHeight values are set to match the expected ad size to prevent CLS.
 */
const AD_SLOTS = {
  top:       { slot: "REPLACE_WITH_TOP_SLOT_ID",       minHeight: 90  },
  bottom:    { slot: "REPLACE_WITH_BOTTOM_SLOT_ID",    minHeight: 90  },
  sidebar:   { slot: "REPLACE_WITH_SIDEBAR_SLOT_ID",   minHeight: 250 },
  inContent: { slot: "REPLACE_WITH_INCONTENT_SLOT_ID", minHeight: 100 },
  afterCalc: { slot: "REPLACE_WITH_AFTERCALC_SLOT_ID", minHeight: 90  },
};

export function AdBanner({ position = "top" }) {
  const config = AD_SLOTS[position] || AD_SLOTS.top;
  return (
    <AdUnit
      slot={config.slot}
      format="auto"
      minHeight={config.minHeight}
      className={`rounded-xl overflow-hidden my-4 p-3 border ${position === "sidebar" ? "" : "w-full"}`}
      style={{ borderColor: "var(--border)", background: "var(--bg)" }}
    />
  );
}
