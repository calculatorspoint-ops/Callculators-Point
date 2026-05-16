export function StatsGrid({ items }) {
  if (!items?.length) return null;
  const cols = items.length <= 2 ? 2 : items.length === 3 ? 3 : items.length <= 4 ? 4 : 3;

  return (
    <div className="stats-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {items.map((item, i) => (
        <div key={i} className={`stat-card${item.highlight ? " hi" : item.warn ? " warn" : ""}`}>
          <div className="stat-card-lbl">{item.label}</div>
          <div className="stat-card-val">{item.value}</div>
          {item.highlight && <div className="stat-card-badge">↑ Key Result</div>}
        </div>
      ))}
    </div>
  );
}
