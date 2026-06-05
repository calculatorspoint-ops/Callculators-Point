import React, { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDown, Search, Globe, MapPin } from "lucide-react";
import { useRegion } from "@/core/geo-engine/useRegion";

export function CurrencySelector() {
  const { 
    countryCode, setCountry, flag, currency, currencySymbol, 
    allCountries, byContinent, continents, autoDetected, resetToAuto, userSelected
  } = useRegion();
  
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return null;
    const s = search.toLowerCase();
    return allCountries.filter(c => 
      c.countryName.toLowerCase().includes(s) ||
      c.currency.toLowerCase().includes(s) ||
      c.code.toLowerCase().includes(s)
    );
  }, [search, allCountries]);

  const select = (code) => { 
    setCountry(code); 
    setOpen(false); 
    setSearch(""); 
  };

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Change region and currency"
        aria-expanded={open}
        aria-haspopup="listbox"
        className="group currency-trigger"
        data-open={open ? "true" : undefined}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 14px", borderRadius: "100px",
          background: open ? "var(--brand-l, rgba(99,102,241,0.1))" : "var(--surface2)",
          border: open ? "1.5px solid var(--brand)" : "1.5px solid var(--border)",
          cursor: "pointer", transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          fontFamily: "var(--font)",
          color: open ? "var(--brand)" : "var(--text)",
          fontSize: 13, fontWeight: 700,
          whiteSpace: "nowrap",
          boxShadow: open ? "0 0 0 3px var(--p50)" : "0 2px 4px rgba(0,0,0,0.02)",
        }}
        title="Change Region & Currency"
      >
        <span style={{ fontSize: 16, lineHeight: 1 }}>{flag}</span>
        <span>{currency}</span>
        <span style={{ fontSize: 11, opacity: 0.7, marginLeft: -2 }}>{currencySymbol}</span>
        <ChevronDown size={14} style={{ opacity: 0.6, transition: "transform .3s cubic-bezier(0.4, 0, 0.2, 1)", transform: open ? "rotate(180deg)" : "none" }} />
      </button>

      {/* Premium Dropdown */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 12px)", right: 0,
          width: 320, background: "var(--surface)",
          border: "1px solid var(--border)", borderRadius: 20,
          boxShadow: "0 10px 40px -10px rgba(0,0,0,.2), 0 0 20px rgba(0,0,0,.05)", zIndex: 9999,
          overflow: "hidden",
          animation: "fadeSlide .2s cubic-bezier(0.16, 1, 0.3, 1)",
          display: "flex", flexDirection: "column",
        }}>
          {/* Header & Search */}
          <div style={{ padding: "16px 16px 10px", background: "var(--surface)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>
                <Globe size={14} style={{ color: "var(--brand)" }}/> Region & Currency
              </span>
            </div>
            
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search country or currency..."
                aria-label="Search countries and currencies"
                autoFocus
                style={{
                  width: "100%", padding: "10px 12px 10px 34px", fontSize: 13,
                  background: "var(--surface2)", border: "1.5px solid var(--border)",
                  borderRadius: 12, color: "var(--text)", outline: "none",
                  fontFamily: "var(--font)", transition: "all 0.2s",
                  boxSizing: "border-box"
                }}
                onFocus={e => { e.target.style.borderColor = "var(--brand)"; e.target.style.boxShadow = "0 0 0 3px var(--p50)"; }}
                onBlur={e  => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
              />
            </div>
          </div>

          {/* List Area */}
          <div
            className="custom-scrollbar"
            role="listbox"
            aria-label="Select country and currency"
            style={{ maxHeight: 340, overflowY: "auto", padding: "0 8px 8px" }}
          >
            {filtered ? (
              filtered.length === 0 ? (
                <div style={{ padding: "30px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>🔍</div>
                  <p style={{ color: "var(--text)", fontSize: 13, fontWeight: 600 }}>No results found</p>
                  <p style={{ color: "var(--text3)", fontSize: 12, marginTop: 4 }}>Try searching for a different country or currency code.</p>
                </div>
              ) : (
                filtered.map(c => <CountryItem key={c.code} c={c} selected={c.code === countryCode} onSelect={select} />)
              )
            ) : (
              continents.map(continent => {
                const countriesInContinent = byContinent[continent] || [];
                if (countriesInContinent.length === 0) return null;
                return (
                  <div key={continent} style={{ marginBottom: 12 }}>
                    <div style={{ 
                      position: "sticky", top: 0, background: "var(--surface)", zIndex: 2,
                      padding: "8px 12px 6px", fontSize: 10, fontWeight: 800, letterSpacing: ".1em", 
                      textTransform: "uppercase", color: "var(--text3)"
                    }}>
                      {continent}
                    </div>
                    <div>
                      {countriesInContinent.map(c => (
                        <CountryItem key={c.code} c={c} selected={c.code === countryCode} onSelect={select} />
                      ))}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer Info */}
          <div style={{ 
            padding: "10px 16px", borderTop: "1px solid var(--border)", 
            background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "space-between" 
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text3)", fontSize: 11, fontWeight: 600 }}>
              <MapPin size={12} style={{ color: autoDetected && !userSelected ? "var(--brand)" : "var(--text3)" }}/>
              {autoDetected && !userSelected ? "Auto-detected location" : "Custom location set"}
            </div>
            {userSelected && (
              <button
                onClick={() => { resetToAuto(); setOpen(false); }}
                aria-label="Reset to auto-detected location"
                style={{
                  background: "none", border: "none", fontSize: 11, color: "var(--brand)",
                  cursor: "pointer", fontWeight: 700, padding: 0, fontFamily: "var(--font)",
                  transition: "opacity 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                Reset
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CountryItem({ c, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(c.code)}
      role="option"
      aria-selected={selected}
      aria-label={`${c.countryName}, ${c.currency} (${c.currencySymbol})`}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 12,
        padding: "10px 12px", background: selected ? "var(--brand-l, rgba(99,102,241,0.08))" : "transparent",
        border: "none", borderRadius: 12, cursor: "pointer", fontFamily: "var(--font)",
        textAlign: "left", transition: "all 0.15s ease",
        marginBottom: 2
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = "var(--surface2)"; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = "transparent"; }}
    >
      <div style={{ 
        width: 32, height: 32, borderRadius: "50%", background: "var(--surface)", 
        border: "1px solid var(--border)", display: "flex", alignItems: "center", 
        justifyContent: "center", fontSize: 16, flexShrink: 0,
        boxShadow: selected ? "0 2px 8px rgba(99,102,241,0.2)" : "0 2px 4px rgba(0,0,0,0.05)"
      }}>
        {c.flag}
      </div>
      
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 13, fontWeight: selected ? 700 : 600, color: selected ? "var(--brand)" : "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {c.countryName}
          </div>
          <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text2)", background: "var(--surface)", padding: "2px 6px", borderRadius: 6, border: "1px solid var(--border)" }}>
            {c.currency}
          </div>
        </div>
        
        <div style={{ fontSize: 11, color: "var(--text3)", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>{c.currencySymbol}</span>
          <span style={{ opacity: 0.5 }}>•</span>
          <span>{c.taxRate > 0 ? `${c.taxLabel} ${c.taxRate}%` : "No Tax"}</span>
          <span style={{ opacity: 0.5 }}>•</span>
          <span>{c.measureSystem === "metric" ? "Metric" : "Imperial"}</span>
        </div>
      </div>
    </button>
  );
}
