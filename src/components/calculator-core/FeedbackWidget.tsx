import { useState } from "react";
import { Link } from "react-router-dom";
import { ThumbsUp, ThumbsDown, Flag } from "lucide-react";
import { track } from "@vercel/analytics/react";

export function FeedbackWidget({ calcName, calcSlug }: { calcName: string; calcSlug: string }) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const handleFeedback = (type: "up" | "down") => {
    setFeedback(type);
    try {
      track('Feedback', { calculator: calcSlug, helpful: type });
    } catch {
      // Ignore if analytics is blocked
    }
  };

  return (
    <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border)", display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text2)" }}>Was this calculator helpful?</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => handleFeedback("up")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 100, border: "1px solid", borderColor: feedback === "up" ? "var(--brand)" : "var(--border)", background: feedback === "up" ? "var(--brand-l)" : "var(--surface)", color: feedback === "up" ? "var(--brand)" : "var(--text2)", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .15s" }}>
            <ThumbsUp size={14} /> Yes
          </button>
          <button onClick={() => handleFeedback("down")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 100, border: "1px solid", borderColor: feedback === "down" ? "var(--red)" : "var(--border)", background: feedback === "down" ? "rgba(220,53,69,.08)" : "var(--surface)", color: feedback === "down" ? "var(--red)" : "var(--text2)", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .15s" }}>
            <ThumbsDown size={14} /> No
          </button>
        </div>
        {feedback && <span style={{ fontSize: 12, color: "var(--text3)", animation: "fade-in .3s" }}>Thanks for your feedback!</span>}
      </div>
      
      <Link to={`/contact?type=accuracy&subject=Issue with ${calcName}`} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "var(--text3)", textDecoration: "none", padding: "6px 12px", borderRadius: 100, background: "var(--surf2)" }}>
        <Flag size={12} /> Report an Issue
      </Link>
    </div>
  );
}
