import { useState } from "react";
import { Copy, Check, Share2, TrendingUp } from "lucide-react";

export function ResultBox({ label, value, sub, loading }) {
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
    <div className="result-card" role="status" aria-live="polite" aria-busy="true">
      <div className="result-loading">
        <div className="result-loading-spinner" />
        <span>Calculating…</span>
      </div>
    </div>
  );

  if (!value) return (
    <div className="empty-state">
      <div className="empty-state-icon">🧮</div>
      <p className="empty-state-title">Enter values to calculate</p>
      <p className="empty-state-sub">Your result will appear here instantly</p>
    </div>
  );

  return (
    <div className="result-card">
      {/* Decorative circles */}
      <div className="result-deco-1" />
      <div className="result-deco-2" />
      <div className="result-deco-3" />

      <div className="result-inner">
        {/* Icon */}
        <div className="result-icon-wrap">
          <TrendingUp size={18} color="rgba(255,255,255,0.8)" />
        </div>

        {/* Label */}
        <p className="result-lbl">{label}</p>

        {/* Main value — aria-live announces to screen readers when result changes */}
        <p
          className="result-val"
          aria-live="polite"
          aria-atomic="true"
        >
          {value}
        </p>

        {sub && <p className="result-sub">{sub}</p>}

        {/* Divider */}
        <div className="result-divider" />

        {/* Actions */}
        <div className="result-actions">
          <button
            className="result-btn"
            onClick={copy}
            aria-label={copied ? "Result copied to clipboard" : `Copy result: ${value}`}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
          <button
            className="result-btn"
            onClick={share}
            aria-label={`Share result: ${label} — ${value}`}
          >
            <Share2 size={12} />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
