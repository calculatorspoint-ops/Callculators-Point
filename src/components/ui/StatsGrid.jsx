/**
 * StatsGrid — Pregnancy-style metric cards grid.
 * Each card shows: icon (optional) / value (large) / label (small uppercase).
 * Matches the 3-column mini-card layout in the pregnancy-due-date calculator.
 */
export function StatsGrid({ items }) {
  if (!items?.length) return null;
  const valid = items.filter(Boolean);
  if (!valid.length) return null;

  const cols = valid.length <= 2 ? 2 : valid.length === 3 ? 3 : valid.length <= 4 ? 2 : 3;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 12,
        marginTop: 16,
      }}
      className="sc-stats-grid"
    >
      {valid.map((item, i) => {
        const isHi   = item.highlight;
        const isWarn = item.warn;

        const borderColor = isHi ? "#10b981" : isWarn ? "#ef4444" : "var(--border)";
        const bgColor     = isHi
          ? "rgba(16,185,129,.08)"
          : isWarn
            ? "rgba(239,68,68,.08)"
            : "var(--surface)";
        const valColor    = isHi ? "#059669" : isWarn ? "#dc2626" : "var(--text)";
        const lblColor    = isHi ? "#065f46" : isWarn ? "#b91c1c" : "var(--text3)";

        return (
          <div
            key={i}
            style={{
              background: bgColor,
              border: `1.5px solid ${borderColor}`,
              borderRadius: 14,
              padding: "16px 10px",
              textAlign: "center",
              transition: "all .18s",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              minHeight: 80,
            }}
          >
            {/* Optional icon — shown if item.icon is set */}
            {item.icon && (
              <div style={{ fontSize: 22, marginBottom: 4, lineHeight: 1 }}>{item.icon}</div>
            )}

            {/* Value */}
            <div
              style={{
                fontSize: "clamp(15px,3.5vw,22px)",
                fontWeight: 900,
                color: valColor,
                fontFamily: "var(--font-hd,var(--font))",
                lineHeight: 1,
                wordBreak: "break-word",
              }}
            >
              {item.value}
            </div>

            {/* Label */}
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: ".06em",
                color: lblColor,
                lineHeight: 1.35,
                wordBreak: "break-word",
                marginTop: 4,
              }}
            >
              {item.label}
            </div>

            {isHi && (
              <div
                style={{
                  display: "inline-block",
                  fontSize: 9, fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: ".05em",
                  padding: "2px 7px",
                  borderRadius: 100,
                  background: "rgba(16,185,129,.15)",
                  color: "#065f46",
                  marginTop: 2,
                }}
              >
                ↑ Key Result
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
