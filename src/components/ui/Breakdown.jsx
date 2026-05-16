import { useState } from "react";
import { ChevronDown, ChevronUp, List } from "lucide-react";

export function Breakdown({ rows, title = "Step-by-Step Breakdown" }) {
  const [open, setOpen] = useState(true); // default open for better UX
  if (!rows?.length) return null;
  return (
    <div className="breakdown-wrap">
      <button className="breakdown-toggle" onClick={() => setOpen(!open)}>
        <div className="breakdown-toggle-left">
          <List size={14} />
          <span>{title}</span>
          <span className="breakdown-count">{rows.length} items</span>
        </div>
        <div className="breakdown-toggle-right">
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>
      {open && (
        <div className="breakdown-body">
          <table className="breakdown-table">
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className={`brow${r.bold ? " bold-row" : ""}${i % 2 === 0 ? " even" : ""}`}>
                  <td className="brow-label">{r.label}</td>
                  <td className="brow-value" style={r.bold ? { color: "var(--brand)", fontWeight: 800 } : {}}>
                    {r.value}
                    {r.bold && <span className="brow-highlight-dot" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
