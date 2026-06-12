'use client';
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ThumbsUp, ThumbsDown, Flag } from "lucide-react";
import { track } from "@vercel/analytics/react";
// Firebase imported dynamically — the SDK is ~200KB and should NOT be in the
// initial bundle. It loads in useEffect after the calculator is interactive.

// Local type mirror — matches RatingType from firestore.ts
type RatingType = 'up' | 'down';


export function FeedbackWidget({ calcName, calcSlug }: { calcName: string; calcSlug: string }) {
  const [feedback, setFeedback] = useState<RatingType | null>(null);
  const [counts, setCounts]     = useState({ up: 0, down: 0 });
  const [loading, setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load rating counts from Firestore — Firebase SDK loaded dynamically so it
  // doesn't block the initial render or prevent links/tabs from working.
  useEffect(() => {
    let cancelled = false;
    import('@/lib/firebase/firestore').then(({ getRating }) => {
      getRating(calcSlug).then(r => {
        if (!cancelled) {
          setCounts(r);
          setLoading(false);
        }
      });
    }).catch(() => setLoading(false));

    // Restore previous feedback from localStorage
    const saved = localStorage.getItem(`feedback_${calcSlug}`);
    if (saved === 'up' || saved === 'down') setFeedback(saved as RatingType);

    return () => { cancelled = true; };
  }, [calcSlug]);

  const handleFeedback = useCallback(async (type: RatingType) => {
    if (feedback || submitting) return;
    setSubmitting(true);
    setFeedback(type);
    setCounts(prev => ({ ...prev, [type]: prev[type] + 1 }));
    localStorage.setItem(`feedback_${calcSlug}`, type);
    // Load Firebase only when user actually clicks — maximum deferral
    try {
      const { submitRating } = await import('@/lib/firebase/firestore');
      await submitRating(calcSlug, type);
    } catch { /* silently fail */ }
    setSubmitting(false);
    try { track('Feedback', { calculator: calcSlug, helpful: type }); } catch { /* ignore */ }
  }, [feedback, submitting, calcSlug]);

  const total = counts.up + counts.down;
  const pct   = total > 0 ? Math.round((counts.up / total) * 100) : null;

  return (
    <div style={{
      marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border)",
      display: "flex", flexWrap: "wrap", gap: 16,
      alignItems: "center", justifyContent: "space-between"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text2)" }}>
          Was this calculator helpful?
        </span>

        {/* Thumbs Up / Down buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => handleFeedback("up")}
            disabled={!!feedback || submitting}
            aria-label={
              loading
                ? "Rate as helpful"
                : counts.up > 0
                ? `Yes, this was helpful (${counts.up} ${counts.up === 1 ? 'vote' : 'votes'})`
                : "Yes, this was helpful"
            }
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 12px", borderRadius: 100, border: "1px solid",
              borderColor: feedback === "up" ? "var(--brand)" : "var(--border)",
              background:  feedback === "up" ? "var(--brand-l)" : "var(--surface)",
              color:       feedback === "up" ? "var(--brand)"  : "var(--text2)",
              fontSize: 12, fontWeight: 600, cursor: feedback ? "default" : "pointer",
              transition: "all .15s", opacity: feedback && feedback !== "up" ? 0.5 : 1,
            }}
          >
            <ThumbsUp size={14} />
            Yes
            {!loading && counts.up > 0 && (
              <span style={{ fontSize: 11, fontWeight: 700, color: "inherit", opacity: 0.75 }}>
                {counts.up}
              </span>
            )}
          </button>

          <button
            onClick={() => handleFeedback("down")}
            disabled={!!feedback || submitting}
            aria-label={
              loading
                ? "Rate as not helpful"
                : counts.down > 0
                ? `No, this was not helpful (${counts.down} ${counts.down === 1 ? 'vote' : 'votes'})`
                : "No, this was not helpful"
            }
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 12px", borderRadius: 100, border: "1px solid",
              borderColor: feedback === "down" ? "var(--red)"   : "var(--border)",
              background:  feedback === "down" ? "rgba(220,53,69,.08)" : "var(--surface)",
              color:       feedback === "down" ? "var(--red)"   : "var(--text2)",
              fontSize: 12, fontWeight: 600, cursor: feedback ? "default" : "pointer",
              transition: "all .15s", opacity: feedback && feedback !== "down" ? 0.5 : 1,
            }}
          >
            <ThumbsDown size={14} />
            No
            {!loading && counts.down > 0 && (
              <span style={{ fontSize: 11, fontWeight: 700, color: "inherit", opacity: 0.75 }}>
                {counts.down}
              </span>
            )}
          </button>
        </div>

        {/* Thank you message — aria-live announces to screen readers when feedback is submitted */}
        <span
          aria-live="polite"
          aria-atomic="true"
          style={{ fontSize: 12, color: "var(--text3)", animation: feedback ? "fade-in .3s" : undefined }}
        >
          {feedback && `Thanks! ${pct !== null ? `${pct}% of users find this helpful.` : ""}`}
        </span>
      </div>

      <Link
        href={`/contact?type=accuracy&subject=Issue with ${calcName}`}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 12, fontWeight: 600, color: "var(--text3)",
          textDecoration: "none", padding: "6px 12px",
          borderRadius: 100, background: "var(--surf2)",
        }}
      >
        <Flag size={12} /> Report an Issue
      </Link>
    </div>
  );
}
