/**
 * InputField.jsx
 *
 * ACCESSIBILITY:
 *  - Radio type: native <input type="radio"> visually hidden, styled <label> acts as button.
 *    This gives free keyboard support (arrow keys), aria-checked, grouping — without custom ARIA.
 *  - Slider/Number error <p> linked via aria-describedby + aria-invalid.
 *  - Number/text inputs: aria-invalid + aria-describedby wired to error element.
 *
 * INP FIX:
 *  - Removed inline onFocus/onBlur style mutations (forced synchronous style recalculation).
 *    Focus ring is now purely CSS via the .input-focused class + :focus-within.
 */
import { useGeoStore } from "@/core/geo-engine/geoStore";

export function InputField({ config, value, onChange, error }) {
  const currencySymbol = useGeoStore(s => s.rules?.currencySymbol ?? '$');
  const locale         = useGeoStore(s => s.rules?.locale         ?? 'en-US');
  const { id, label, type, min, max, step, unit, options, optional } = config;

  // Unique IDs for aria-describedby linkage
  const errorId = `${id}-error`;

  /* ── Select ────────────────────────────────────────────── */
  if (type === "select") return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-semibold mb-2" style={{ color: "var(--txt2)" }}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={e => onChange(id, e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
        style={{ background: "var(--bg)", border: `1.5px solid ${error ? "#ef4444" : "var(--border)"}`, color: "var(--txt)" }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && (
        <p id={errorId} className="text-xs text-red-500 mt-1" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );

  /* ── Radio ─────────────────────────────────────────────────────────────────
   * Uses visually hidden native <input type="radio"> + visible <label>.
   *
   * WHY THIS APPROACH:
   *  - Native radios give free: arrow-key navigation, aria-checked, grouping,
   *    form submission, and screen reader "1 of 3" position announcements.
   *  - The <input> is visually hidden (sr-only pattern) but remains in the
   *    accessibility tree and keyboard focus order.
   *  - The <label> is styled to look like the existing button, so the UI is
   *    identical to before.
   *  - No custom ARIA is needed — the browser handles everything.
   */
  if (type === "radio") {
    const groupId = `${id}-group`;
    return (
      <div className="mb-4">
        {/* role="group" + aria-labelledby groups the radio buttons under the field label */}
        <div
          role="group"
          aria-labelledby={groupId}
        >
          <p
            id={groupId}
            className="block text-sm font-semibold mb-2"
            style={{ color: "var(--txt2)" }}
          >
            {label}
          </p>
          <div className="flex gap-2">
            {options.map(o => {
              const isSelected = value === o.value;
              const radioId = `${id}-${o.value}`;
              return (
                <label
                  key={o.value}
                  htmlFor={radioId}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer text-center select-none"
                  style={{
                    background: isSelected ? "#16a34a" : "var(--bg)",
                    color:      isSelected ? "#fff"     : "var(--txt2)",
                    border:     `1.5px solid ${isSelected ? "#16a34a" : "var(--border)"}`,
                    /* Ensure the label shows focus ring when inner radio is focused */
                    outline: "none",
                  }}
                >
                  {/* Visually hidden native radio — stays in tab order and accessibility tree */}
                  <input
                    type="radio"
                    id={radioId}
                    name={id}
                    value={o.value}
                    checked={isSelected}
                    onChange={() => onChange(id, o.value)}
                    className="sr-only"
                    /* When focused, show a focus ring on the parent label */
                    onFocus={e => {
                      e.currentTarget.parentElement?.classList.add('radio-label-focused');
                    }}
                    onBlur={e => {
                      e.currentTarget.parentElement?.classList.remove('radio-label-focused');
                    }}
                  />
                  {o.label}
                </label>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ── Slider ────────────────────────────────────────────── */
  if (type === "slider") {
    const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100)) || 0;
    return (
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor={id} className="text-sm font-semibold" style={{ color: "var(--txt2)" }}>
            {label} {optional && <span className="text-xs font-normal" style={{ color: "var(--txt3)" }}>(optional)</span>}
          </label>
          <span
            className="text-sm font-bold"
            style={{ color: "#16a34a" }}
            aria-live="polite"
            aria-atomic="true"
          >
            {unit === currencySymbol ? `${currencySymbol}${Number(value).toLocaleString(locale)}` : `${value}${unit}`}
          </span>
        </div>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(id, e.target.value)}
          className="premium-slider"
          style={{ '--slider-val': `${pct}%` }}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />
        {error && (
          <p id={errorId} className="text-xs text-red-500 mt-1" role="alert" aria-live="polite">
            {error}
          </p>
        )}
      </div>
    );
  }

  /* ── Default: number or text ────────────────────────────── */
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-semibold mb-2" style={{ color: "var(--txt2)" }}>
        {label} {optional && <span className="text-xs font-normal" style={{ color: "var(--txt3)" }}>(optional)</span>}
      </label>
      {/*
       * INP FIX: Removed onFocus/onBlur inline style mutations.
       * Focus ring is now handled purely by CSS:
       *   .calc-input-wrap:focus-within { border-color: #16a34a; }
       * This avoids forced synchronous style recalculation on every focus event.
       */}
      <div className="relative calc-input-wrap" style={{
        border: `1.5px solid ${error ? "#ef4444" : "var(--border)"}`,
        borderRadius: "0.75rem",
        transition: "border-color 0.15s",
      }}>
        <input
          id={id}
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={e => onChange(id, e.target.value)}
          placeholder="0"
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
          style={{
            background: "var(--bg)",
            color: "var(--txt)",
            border: "none",
            paddingRight: unit ? "3rem" : "1rem",
          }}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: "var(--txt3)" }}>
            {unit}
          </span>
        )}
      </div>
      {error && (
        <p id={errorId} className="text-xs text-red-500 mt-1" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}
