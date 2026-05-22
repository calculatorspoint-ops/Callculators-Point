import { useState } from "react";
import { ChevronDown, ChevronUp, TableProperties } from "lucide-react";

export function Breakdown({ rows, title = "Step-by-Step Breakdown" }) {
  const [open, setOpen] = useState(true);
  const [showAll, setShowAll] = useState(false);
  if (!rows?.length) return null;

  const PREVIEW = 6;
  const displayed = open ? (showAll ? rows : rows.slice(0, PREVIEW)) : [];
  const hasMore = rows.length > PREVIEW;

  return (
    <div style={{
      marginTop: 14, border: "1.5px solid var(--border)",
      borderRadius: "var(--r-xl)", overflow: "hidden", boxShadow: "var(--sh1)"
    }}>
      {/* Header */}
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 16px",
        background: "linear-gradient(135deg, var(--surface2), var(--surf2))",
        fontSize: 12.5, fontWeight: 700, color: "var(--text2)",
        cursor: "pointer", transition: "all .15s", textAlign: "left",
        fontFamily: "var(--font)", border: "none", borderBottom: open ? "1px solid var(--border)" : "none"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <TableProperties size={14} color="var(--brand)" />
          <span>{title}</span>
          <span style={{
            fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".05em",
            padding: "2px 8px", borderRadius: 100,
            background: "var(--brand-l)", color: "var(--brand)"
          }}>{rows.length} items</span>
        </div>
        {open ? <ChevronUp size={14} color="var(--text3)" /> : <ChevronDown size={14} color="var(--text3)" />}
      </button>

      {/* Table */}
      {open && (
        <div style={{ background: "var(--surface)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {displayed.map((r, i) => (
                <tr key={i} style={{
                  borderBottom: "1px solid var(--bord2)",
                  background: r.bold
                    ? "linear-gradient(90deg, var(--brand-l), transparent)"
                    : i % 2 === 0 ? "transparent" : "var(--surf2)"
                }}>
                  <td style={{
                    padding: "9px 16px", fontSize: 13, width: "55%",
                    color: r.bold ? "var(--brand)" : "var(--text3)",
                    fontWeight: r.bold ? 700 : 500
                  }}>
                    {r.label}
                  </td>
                  <td style={{
                    padding: "9px 16px", fontSize: 13, textAlign: "right",
                    fontWeight: r.bold ? 800 : 600,
                    color: r.bold ? "var(--brand)" : "var(--text)"
                  }}>
                    {r.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {hasMore && (
            <button onClick={() => setShowAll(!showAll)} style={{
              width: "100%", padding: "10px", fontSize: 12, fontWeight: 700,
              color: "var(--brand)", background: "var(--brand-l)",
              border: "none", borderTop: "1px solid var(--brand-ll)",
              cursor: "pointer", fontFamily: "var(--font)"
            }}>
              {showAll ? "Show Less ↑" : "Show All " + rows.length + " rows ↓"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
