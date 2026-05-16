const ICON  = { good: "✅", warn: "💡", bad: "⚠️", info: "ℹ️" };
const LABEL = { good: "Great",  warn: "Tip",     bad: "Alert",  info: "Info" };

export function InsightBox({ insights }) {
  const valid = insights?.filter(Boolean) ?? [];
  if (!valid.length) return null;
  return (
    <div className="insights-wrap">
      {valid.map((ins, i) => {
        const type = ins.type || "info";
        return (
          <div key={i} className={`insight-card ins-${type}`}>
            <div className="insight-header">
              <span className="insight-type-icon">{ICON[type]}</span>
              <span className="insight-type-label">{LABEL[type]}</span>
            </div>
            <p className="insight-msg">{ins.msg}</p>
          </div>
        );
      })}
    </div>
  );
}
