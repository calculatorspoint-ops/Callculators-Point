const TYPES = {
  tip:  { icon: "💡", label: "Smart Tip",  bg: "rgba(5,150,105,.07)",  border: "#86efac", color: "#065f46", darkColor: "#6ee7b7" },
  good: { icon: "✅", label: "Great",       bg: "rgba(5,150,105,.07)",  border: "#86efac", color: "#065f46", darkColor: "#6ee7b7" },
  warn: { icon: "⚠️", label: "Alert",       bg: "rgba(217,119,6,.07)",  border: "#fde68a", color: "#78350f", darkColor: "#fcd34d" },
  bad:  { icon: "🚨", label: "Warning",     bg: "rgba(220,53,69,.08)",  border: "#fca5a5", color: "#7f1d1d", darkColor: "#f87171" },
  info: { icon: "ℹ️", label: "Did You Know",bg: "rgba(67,97,238,.07)", border: "var(--brand-ll)", color: "#1e3a8a", darkColor: "#93c5fd" },
};

export function InsightBox({ insights }) {
  const valid = (insights || []).filter(Boolean);
  if (!valid.length) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 14 }}>
      {valid.map((ins, i) => {
        const t = TYPES[ins.type] || TYPES.info;
        return (
          <div key={i} style={{
            background: t.bg,
            border: "1.5px solid " + t.border,
            borderRadius: "var(--r-lg)", padding: "13px 15px",
            display: "flex", gap: 11, alignItems: "flex-start"
          }}>
            <span style={{ fontSize: 17, flexShrink: 0, lineHeight: 1.3 }}>{t.icon}</span>
            <div>
              <p style={{
                fontSize: 10, fontWeight: 800, textTransform: "uppercase",
                letterSpacing: ".08em", color: t.color, marginBottom: 4
              }}>
                {t.label}
              </p>
              <p style={{ fontSize: 13, color: t.color, lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
                {ins.msg}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
