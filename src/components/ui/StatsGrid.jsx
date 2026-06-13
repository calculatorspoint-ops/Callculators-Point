export function StatsGrid({ items }) {
  if (!items?.length) return null;
  const valid = items.filter(Boolean);
  if (!valid.length) return null;
  const cols = valid.length <= 2 ? 2 : valid.length === 3 ? 3 : valid.length <= 4 ? 2 : 3;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(" + cols + ", 1fr)",
        gap: 10,
        marginTop: 14,
      }}
      className="sc-stats-grid"
    >
      {valid.map((item, i) => {
        const isHi   = item.highlight;
        const isWarn = item.warn;
        return (
          <div
            key={i}
            style={{
              background: isHi
                ? "linear-gradient(135deg, #ecfdf5, #d1fae5)"
                : isWarn
                  ? "linear-gradient(135deg, #fff5f5, #fed7d7)"
                  : "var(--surface)",
              border: "1.5px solid " + (isHi ? "#86efac" : isWarn ? "#fca5a5" : "var(--border)"),
              borderRadius: "var(--r-lg)",
              padding: "14px 12px 12px",
              textAlign: "center",
              transition: "all .18s",
              boxShadow: isHi
                ? "0 2px 12px rgba(5,150,105,.1)"
                : isWarn
                  ? "0 2px 8px rgba(220,53,69,.08)"
                  : "var(--sh1)",
              minHeight: 72,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 4,
            }}
          >
            {/* Label — allow wrap, no ellipsis clipping */}
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: ".06em",
                color: isHi ? "#065f46" : isWarn ? "#dc2626" : "var(--text3)",
                lineHeight: 1.35,
                wordBreak: "break-word",
              }}
            >
              {item.label}
            </div>

            {/* Value */}
            <div
              style={{
                fontFamily: "var(--font-hd)",
                fontSize: "clamp(14px, 3vw, 20px)",
                fontWeight: 800,
                letterSpacing: "-.02em",
                lineHeight: 1.1,
                color: isHi ? "#065f46" : isWarn ? "#dc2626" : "var(--text)",
              }}
            >
              {item.value}
            </div>

            {isHi && (
              <div
                style={{
                  display: "inline-block",
                  fontSize: 9,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: ".05em",
                  padding: "2px 7px",
                  borderRadius: 100,
                  background: "rgba(5,150,105,.12)",
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
