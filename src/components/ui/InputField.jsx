import { useGeoStore } from "@/core/geo-engine/geoStore.js";

export function InputField({ config, value, onChange, error }) {
  const currencySymbol = useGeoStore(s => s.rules?.currencySymbol ?? '$');
  const locale         = useGeoStore(s => s.rules?.locale         ?? 'en-US');
  const { id, label, type, min, max, step, unit, options, optional } = config;

  if (type === "select") return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-semibold mb-2" style={{ color: "var(--txt2)" }}>
        {label}
      </label>
      <select id={id} value={value} onChange={e => onChange(id, e.target.value)}
        className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
        style={{ background: "var(--bg)", border: `1.5px solid ${error ? "#ef4444" : "var(--border)"}`, color: "var(--txt)" }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  if (type === "radio") return (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-2" style={{ color: "var(--txt2)" }}>{label}</label>
      <div className="flex gap-2">
        {options.map(o => (
          <button key={o.value} onClick={() => onChange(id, o.value)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: value === o.value ? "#16a34a" : "var(--bg)",
              color: value === o.value ? "#fff" : "var(--txt2)",
              border: `1.5px solid ${value === o.value ? "#16a34a" : "var(--border)"}`,
            }}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );

  if (type === "slider") {
    const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100)) || 0;
    return (
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor={id} className="text-sm font-semibold" style={{ color: "var(--txt2)" }}>
            {label} {optional && <span className="text-xs font-normal" style={{ color: "var(--txt3)" }}>(optional)</span>}
          </label>
          <span className="text-sm font-bold" style={{ color: "#16a34a" }}>
            {unit === currencySymbol ? `${currencySymbol}${Number(value).toLocaleString(locale)}` : `${value}${unit}`}
          </span>
        </div>
        <input id={id} type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(id, e.target.value)}
          className="premium-slider"
          style={{ '--slider-val': `${pct}%` }} />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }

  // Default: number or text
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-semibold mb-2" style={{ color: "var(--txt2)" }}>
        {label} {optional && <span className="text-xs font-normal" style={{ color: "var(--txt3)" }}>(optional)</span>}
      </label>
      <div className="relative">
        <input id={id} type="number" value={value} min={min} max={max} step={step}
          onChange={e => onChange(id, e.target.value)} placeholder="0"
          className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
          style={{
            background: "var(--bg)", color: "var(--txt)",
            border: `1.5px solid ${error ? "#ef4444" : "var(--border)"}`,
            paddingRight: unit ? "3rem" : "1rem",
          }}
          onFocus={e => e.currentTarget.style.borderColor = "#16a34a"}
          onBlur={e => e.currentTarget.style.borderColor = error ? "#ef4444" : "var(--border)"} />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: "var(--txt3)" }}>
            {unit}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
