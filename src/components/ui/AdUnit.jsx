import { useEffect, useRef } from "react";

/**
 * Google AdSense ad unit component.
 * Replace XXXXXXXXXXXXXXXX with your actual AdSense publisher ID (ca-pub-XXXXXXXX)
 * and each adSlot with your actual ad unit IDs from AdSense dashboard.
 *
 * IMPORTANT: Remove the data-adtest="on" attribute in production.
 */

const PUBLISHER_ID = "ca-pub-XXXXXXXXXXXXXXXX"; // ← Replace with your Publisher ID

export function AdUnit({ slot, format = "auto", fullWidth = true, className = "" }) {
  const adRef = useRef(null);

  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.warn("AdSense:", e.message);
    }
  }, []);

  return (
    <div className={`ad-unit ${className}`} aria-label="Advertisement">
      {/* ARIA label required for accessibility compliance */}
      <p className="text-xs font-semibold text-center mb-1" style={{ color: "var(--txt3)", letterSpacing: ".05em" }}>
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
        data-adtest="on" /* ← Remove "on" and this comment in production */
      />
    </div>
  );
}

/**
 * Pre-configured ad unit positions.
 * Use these throughout the site.
 */
export function AdBanner({ position = "top" }) {
  const slots = {
    top:          "1234567890", // ← Replace with actual slot IDs
    bottom:       "0987654321",
    sidebar:      "1122334455",
    inContent:    "5544332211",
    afterCalc:    "9988776655",
  };
  return (
    <AdUnit
      slot={slots[position] || slots.top}
      format="auto"
      className={`rounded-xl overflow-hidden my-4 p-3 border ${position === "sidebar" ? "" : "w-full"}`}
      style={{ borderColor: "var(--border)", background: "var(--bg)" }}
    />
  );
}
