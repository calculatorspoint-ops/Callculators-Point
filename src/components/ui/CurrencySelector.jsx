import { useState, useEffect, useRef } from "react";
import { ChevronDown, MapPin, Check } from "lucide-react";
import { useCurrencyStore, CURRENCIES } from "@/store/useCurrencyStore.js";

export function CurrencySelector() {
  const { currency, setCurrency, detectFromIP, autoDetected } = useCurrencyStore();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref  = useRef(null);
  const cur  = CURRENCIES[currency] || CURRENCIES.USD;

  // Auto-detect on first mount
  useEffect(() => { if (!autoDetected) detectFromIP(); }, []);

  // Close on outside click
  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const filtered = Object.values(CURRENCIES).filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const select = (code) => { setCurrency(code); setOpen(false); setSearch(""); };

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "6px 10px", borderRadius: "var(--r-md)",
          background: "var(--surface2)", border: "1.5px solid var(--border)",
          cursor: "pointer", transition: "var(--t)", fontFamily: "var(--font)",
          color: "var(--text)", fontSize: 13, fontWeight: 700,
          whiteSpace: "nowrap",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--brand)"; e.currentTarget.style.color = "var(--brand)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text)"; }}
        title="Change currency"
      >
        <span style={{ fontSize: 15 }}>{cur.flag}</span>
        <span>{cur.code}</span>
        <span style={{ fontSize: 11, color: "var(--text3)" }}>{cur.symbol}</span>
        <ChevronDown size={12} style={{ color: "var(--text3)", transition: "transform .2s", transform: open ? "rotate(180deg)" : "none" }} />
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0,
          width: 260, background: "var(--surface)",
          border: "1px solid var(--border)", borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,.15)", zIndex: 300,
          overflow: "hidden",
          animation: "fadeSlide .15s ease",
        }}>
          {/* Header */}
          <div style={{ padding: "12px 14px 0" }}>
            <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text3)", marginBottom: 8 }}>
              Select Currency
            </p>
            {/* Search */}
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search currencies…"
              style={{
                width: "100%", padding: "7px 12px", fontSize: 13,
                background: "var(--surface2)", border: "1.5px solid var(--border)",
                borderRadius: 8, color: "var(--text)", outline: "none",
                fontFamily: "var(--font)", marginBottom: 8,
              }}
              onFocus={e => e.target.style.borderColor = "var(--brand)"}
              onBlur={e  => e.target.style.borderColor = "var(--border)"}
              autoFocus
            />
            {/* Privacy note */}
            <p style={{ fontSize: 11, color: "var(--text3)", display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
              <MapPin size={10} /> We use location to improve your experience
            </p>
          </div>

          {/* Currency list */}
          <div style={{ maxHeight: 280, overflowY: "auto", paddingBottom: 8 }}>
            {filtered.map(c => (
              <button key={c.code} onClick={() => select(c.code)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 14px", background: c.code === currency ? "var(--p50)" : "transparent",
                  border: "none", cursor: "pointer", fontFamily: "var(--font)",
                  transition: "background .1s", textAlign: "left",
                }}
                onMouseEnter={e => { if (c.code !== currency) e.currentTarget.style.background = "var(--surface2)"; }}
                onMouseLeave={e => { if (c.code !== currency) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: 18, width: 24, textAlign: "center", flexShrink: 0 }}>{c.flag}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: c.code === currency ? "var(--brand)" : "var(--text)" }}>
                    {c.code}
                    <span style={{ fontSize: 11, fontWeight: 400, color: "var(--text3)", marginLeft: 6 }}>{c.symbol}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {c.name}
                  </div>
                </div>
                {c.code === currency && <Check size={14} style={{ color: "var(--brand)", flexShrink: 0 }} />}
              </button>
            ))}
            {filtered.length === 0 && (
              <p style={{ textAlign: "center", padding: "20px", fontSize: 13, color: "var(--text3)" }}>No results</p>
            )}
          </div>

          {/* Footer note */}
          <div style={{ padding: "8px 14px", borderTop: "1px solid var(--border2)", fontSize: 10, color: "var(--text3)", background: "var(--surface2)" }}>
            Changes currency symbols & tax rules across all calculators
          </div>
        </div>
      )}
    </div>
  );
}
