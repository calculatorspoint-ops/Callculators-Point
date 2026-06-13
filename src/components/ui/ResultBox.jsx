import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";

/**
 * ResultBox — Premium hero result card.
 * Styled to match the pregnancy-due-date calculator layout:
 *  - Gradient background with radial ambient glow
 *  - Large centered value with uppercase label
 *  - Copy + Share action buttons
 */
export function ResultBox({ label, value, sub, loading, accentColor = "#4361ee" }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(String(value ?? "")).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: label, text: `${label}: ${value}`, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${label}: ${value}\n${window.location.href}`).catch(() => {});
    }
  };

  if (loading) return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      style={{
        background: `linear-gradient(135deg,${accentColor}18,${accentColor}06)`,
        border: `2px solid ${accentColor}30`,
        borderRadius: 20,
        padding: "30px 24px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        border: `3px solid ${accentColor}40`,
        borderTopColor: accentColor,
        animation: "spin .6s linear infinite",
      }} />
      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text3)" }}>Calculating…</span>
    </div>
  );

  if (!value) return (
    <div style={{
      border: "2px dashed var(--border)", borderRadius: 20,
      padding: "44px 20px", textAlign: "center", background: "var(--surf2)",
    }}>
      <div style={{ fontSize: 44, marginBottom: 14, opacity: 0.55 }}>🧮</div>
      <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text2)", marginBottom: 6 }}>Enter values to calculate</p>
      <p style={{ fontSize: 12, color: "var(--text3)" }}>Your result will appear here instantly</p>
    </div>
  );

  return (
    <div
      style={{
        background: `linear-gradient(135deg,${accentColor}18,${accentColor}06)`,
        border: `2px solid ${accentColor}30`,
        borderRadius: 20,
        padding: "30px 24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient radial glow */}
      <div style={{
        position: "absolute", top: -50, left: "50%", transform: "translateX(-50%)",
        width: 220, height: 220,
        background: `radial-gradient(circle,${accentColor}20,transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Label */}
        <p style={{
          fontSize: 11, fontWeight: 800, textTransform: "uppercase",
          letterSpacing: ".1em", color: accentColor, marginBottom: 10,
        }}>
          🎯 {label}
        </p>

        {/* Main value */}
        <p
          aria-live="polite"
          aria-atomic="true"
          style={{
            fontSize: "clamp(26px,6vw,44px)",
            fontWeight: 900,
            color: "var(--text)",
            lineHeight: 1.1,
            margin: "0 0 10px",
            fontFamily: "var(--font-hd,var(--font))",
            wordBreak: "break-word",
            overflowWrap: "anywhere",
          }}
        >
          {value}
        </p>

        {sub && (
          <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 14, lineHeight: 1.5 }}>{sub}</p>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 14 }}>
          <button
            onClick={copy}
            aria-label={copied ? "Result copied to clipboard" : `Copy result: ${value}`}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 18px", borderRadius: 100,
              fontSize: 12, fontWeight: 700,
              background: `${accentColor}22`,
              border: `1px solid ${accentColor}40`,
              color: accentColor, cursor: "pointer",
              fontFamily: "var(--font)",
              transition: "all .15s",
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
          <button
            onClick={share}
            aria-label={`Share result: ${label} — ${value}`}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 18px", borderRadius: 100,
              fontSize: 12, fontWeight: 700,
              background: `${accentColor}22`,
              border: `1px solid ${accentColor}40`,
              color: accentColor, cursor: "pointer",
              fontFamily: "var(--font)",
              transition: "all .15s",
            }}
          >
            <Share2 size={12} />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
