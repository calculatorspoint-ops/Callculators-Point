export function StatsGrid({ items }) {
  if (!items?.length) return null;
  const valid = items.filter(Boolean);
  if (!valid.length) return null;

  return (
    <div style={{
      display: "grid",
      gap: 10, marginTop: 14
    }}
      className="sc-stats-grid"
    >
      {valid.map((item, i) => {
        const isHi = item.highlight;
        const isWarn = item.warn;
        return (
          <div key={i} style={{
            background: isHi
              ? "linear-gradient(135deg, #ecfdf5, #d1fae5)"
              : isWarn
                ? "linear-gradient(135deg, #fff5f5, #fed7d7)"
                : "var(--surface)",
            border: "1.5px solid " + (isHi ? "#86efac" : isWarn ? "#fca5a5" : "var(--border)"),
            borderRadius: "var(--r-lg)", padding: "13px 12px 11px",
            textAlign: "center", transition: "all .18s",
            boxShadow: isHi
              ? "0 2px 12px rgba(5,150,105,.1)"
              : isWarn
                ? "0 2px 8px rgba(220,53,69,.08)"
                : "var(--sh1)"
          }}>
            <div style={{
              fontSize: 11, fontWeight: 800, textTransform: "uppercase",
              letterSpacing: ".06em",
              color: isHi ? "#065f46" : isWarn ? "#dc2626" : "var(--text3)",
              marginBottom: 6,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
            }}>
              {item.label}
            </div>
            <div style={{
              fontFamily: "var(--font-hd)", fontSize: "clamp(15px,2.5vw,18px)",
              fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1.15,
              color: isHi ? "#065f46" : isWarn ? "#dc2626" : "var(--text)"
            }}>
              {item.value}
            </div>
            {isHi && (
              <div style={{
                display: "inline-block", marginTop: 4,
                fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".05em",
                padding: "2px 7px", borderRadius: 100,
                background: "rgba(5,150,105,.12)", color: "#065f46"
              }}>
                ↑ Key Result
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
