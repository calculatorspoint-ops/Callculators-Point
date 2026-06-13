const TYPES = {
  tip:  { icon: "💡", label: "Smart Tip",    bg: "rgba(5,150,105,.07)",  border: "#86efac",             color: "#065f46", darkBg: "rgba(52,211,153,.1)" },
  good: { icon: "✅", label: "Great",         bg: "rgba(5,150,105,.07)",  border: "#86efac",             color: "#065f46", darkBg: "rgba(52,211,153,.1)" },
  warn: { icon: "⚠️", label: "Heads Up",      bg: "rgba(217,119,6,.07)",  border: "#fde68a",             color: "#78350f", darkBg: "rgba(251,191,36,.1)" },
  bad:  { icon: "🚨", label: "Warning",       bg: "rgba(220,53,69,.08)",  border: "#fca5a5",             color: "#7f1d1d", darkBg: "rgba(248,113,113,.1)" },
  info: { icon: "ℹ️", label: "Did You Know",  bg: "rgba(67,97,238,.07)",  border: "rgba(67,97,238,.25)", color: "#1e3a8a", darkBg: "rgba(99,102,241,.1)"  },
};

export function InsightBox({ insights }) {
  const valid = (insights || []).filter(Boolean);
  if (!valid.length) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
      {valid.map((ins, i) => {
        const t = TYPES[ins.type] || TYPES.info;
        return (
          <div
            key={i}
            style={{
              background: t.bg,
              border: "1.5px solid " + t.border,
              borderRadius: 12,
              padding: "13px 16px",
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: 17, flexShrink: 0, lineHeight: 1.4, marginTop: 1 }}>{t.icon}</span>
            <div style={{ minWidth: 0 }}>
              <p style={{
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                color: t.color,
                marginBottom: 4,
                lineHeight: 1,
              }}>
                {t.label}
              </p>
              <p style={{
                fontSize: 13,
                color: t.color,
                lineHeight: 1.65,
                margin: 0,
                fontWeight: 500,
                wordBreak: "break-word",
              }}>
                {ins.msg}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
