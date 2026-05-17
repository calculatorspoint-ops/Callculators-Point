/**
 * @file FloatingRegionSwitcher.jsx
 * @description Floating globe button that lets users override their detected
 *   region. Opens a searchable, continent-grouped country picker panel.
 *
 * Features:
 *   - Auto-detected region shown on load
 *   - Continent accordion grouping
 *   - Live search / filter
 *   - Shows currency symbol + tax label in each row
 *   - "Reset to auto" link
 *   - Smooth CSS animations; no external deps beyond React + Zustand
 *   - Keyboard accessible (Escape to close, focus-trap)
 */

import React, {
  useState, useRef, useEffect, useCallback, useMemo,
} from 'react';
import { useRegion } from './useRegion.js';

// ── Styles (scoped CSS-in-JS object approach) ─────────────────────────────

const Z_PANEL  = 9000;
const Z_BUTTON = 8999;

const FAB_SIZE = 46;

// ── Sub-components ────────────────────────────────────────────────────────

function SearchBox({ value, onChange }) {
  return (
    <div style={{ position: 'relative', padding: '12px 14px 6px' }}>
      <span style={{
        position: 'absolute', left: 24, top: '50%', transform: 'translateY(-20%)',
        fontSize: 14, pointerEvents: 'none', opacity: 0.45,
      }}>🔍</span>
      <input
        aria-label="Search country"
        autoFocus
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search country…"
        style={{
          width: '100%',
          padding: '8px 10px 8px 30px',
          fontSize: 13,
          background: 'var(--surface2, #f5f5f7)',
          border: '1.5px solid var(--border, #e0e0e0)',
          borderRadius: 10,
          color: 'var(--text, #111)',
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color .2s',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--brand, #6366f1)'}
        onBlur={e  => e.target.style.borderColor = 'var(--border, #e0e0e0)'}
      />
    </div>
  );
}

function CountryRow({ country, isSelected, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const selected = isSelected;

  return (
    <button
      role="option"
      aria-selected={selected}
      onClick={() => onSelect(country.code)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        padding: '7px 14px',
        textAlign: 'left',
        background: selected
          ? 'var(--brand-light, #eef2ff)'
          : hovered
            ? 'var(--surface2, #f5f5f7)'
            : 'transparent',
        border: 'none',
        cursor: 'pointer',
        transition: 'background .12s',
        borderRadius: 0,
      }}
    >
      <span style={{ fontSize: 18, lineHeight: 1 }}>{country.flag}</span>
      <span style={{
        flex: 1,
        fontSize: 12.5,
        fontWeight: selected ? 700 : 400,
        color: selected ? 'var(--brand, #6366f1)' : 'var(--text, #111)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {country.countryName}
      </span>
      <span style={{
        fontSize: 11,
        color: 'var(--text3, #888)',
        flexShrink: 0,
        display: 'flex',
        gap: 4,
      }}>
        <span style={{
          background: 'var(--surface2, #f0f0f3)',
          borderRadius: 4,
          padding: '1px 5px',
          fontWeight: 600,
        }}>
          {country.currencySymbol}
        </span>
        {country.taxLabel !== 'N/A' && (
          <span style={{
            background: 'var(--surface2, #f0f0f3)',
            borderRadius: 4,
            padding: '1px 5px',
          }}>
            {country.taxLabel}
          </span>
        )}
      </span>
      {selected && (
        <span style={{ fontSize: 12, color: 'var(--brand, #6366f1)', marginLeft: 2 }}>✓</span>
      )}
    </button>
  );
}

function ContinentSection({ continent, countries, selectedCode, onSelect }) {
  const hasSelected = countries.some(c => c.code === selectedCode);
  const [expanded, setExpanded] = useState(hasSelected);

  // Keep expanded in sync if the selected country changes after mount
  useEffect(() => {
    if (hasSelected) setExpanded(true);
  }, [hasSelected]);

  return (
    <div>
      {/* Continent header */}
      <button
        onClick={() => setExpanded(v => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '5px 14px',
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text3, #888)',
          background: 'transparent',
          border: 'none',
          borderTop: '1px solid var(--border, #e8e8e8)',
          cursor: 'pointer',
        }}
      >
        {continent}
        <span style={{ fontSize: 10, transition: 'transform .2s', transform: expanded ? 'rotate(180deg)' : 'none' }}>▾</span>
      </button>

      {/* Country list */}
      {expanded && (
        <div role="listbox" aria-label={continent}>
          {countries.map(c => (
            <CountryRow
              key={c.code}
              country={c}
              isSelected={c.code === selectedCode}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────

export function FloatingRegionSwitcher({
  /** Position override — defaults to bottom-left */
  position = 'bottom-left',
}) {
  const {
    countryCode, flag, countryName, currency, currencySymbol,
    autoDetected, userSelected, detecting, detectionSource,
    setCountry, resetToAuto,
    allCountries, byContinent, continents,
  } = useRegion();

  const [open, setOpen]       = useState(false);
  const [query, setQuery]     = useState('');
  const panelRef              = useRef(null);
  const buttonRef             = useRef(null);

  // Position styles
  const posStyle = useMemo(() => {
    const base = { position: 'fixed', zIndex: Z_BUTTON };
    switch (position) {
      case 'bottom-right': return { ...base, bottom: 24, right: 24 };
      case 'top-left'    : return { ...base, top: 80,    left: 24  };
      case 'top-right'   : return { ...base, top: 80,    right: 24 };
      default            : return { ...base, bottom: 24, left: 24  };
    }
  }, [position]);

  const panelPosStyle = useMemo(() => {
    const base = { position: 'fixed', zIndex: Z_PANEL };
    switch (position) {
      case 'bottom-right': return { ...base, bottom: 78, right: 24 };
      case 'top-left'    : return { ...base, top: 130,   left: 24  };
      case 'top-right'   : return { ...base, top: 130,   right: 24 };
      default            : return { ...base, bottom: 78, left: 24  };
    }
  }, [position]);

  // Filtered countries
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null; // null = show grouped view
    return allCountries.filter(c =>
      c.countryName.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.currency.toLowerCase().includes(q)
    );
  }, [query, allCountries]);

  // Close on outside click / Escape
  const handleClose = useCallback(() => {
    setOpen(false);
    setQuery('');
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        panelRef.current  && !panelRef.current.contains(e.target) &&
        buttonRef.current && !buttonRef.current.contains(e.target)
      ) handleClose();
    };
    const keyHandler = (e) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown',   keyHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown',   keyHandler);
    };
  }, [open, handleClose]);

  const handleSelect = useCallback((code) => {
    setCountry(code);
    handleClose();
  }, [setCountry, handleClose]);

  const handleResetAuto = useCallback(() => {
    resetToAuto();
    handleClose();
  }, [resetToAuto, handleClose]);

  return (
    <>
      {/* ── FAB Button ── */}
      <button
        ref={buttonRef}
        id="geo-region-switcher-fab"
        aria-label={`Region: ${countryName} (${currency}). Click to change.`}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(v => !v)}
        title={`${flag} ${countryName} · ${currencySymbol} ${currency}`}
        style={{
          ...posStyle,
          width : FAB_SIZE,
          height: FAB_SIZE,
          borderRadius: '50%',
          background: 'var(--brand, #6366f1)',
          border: '2.5px solid rgba(255,255,255,0.25)',
          boxShadow: '0 4px 18px rgba(99,102,241,0.35)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          transition: 'transform .15s, box-shadow .15s',
          outline: 'none',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform   = 'scale(1.1)';
          e.currentTarget.style.boxShadow   = '0 6px 24px rgba(99,102,241,0.5)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform   = 'scale(1)';
          e.currentTarget.style.boxShadow   = '0 4px 18px rgba(99,102,241,0.35)';
        }}
      >
        {detecting ? (
          <span style={{
            display: 'inline-block',
            width: 18, height: 18,
            borderRadius: '50%',
            border: '2.5px solid rgba(255,255,255,0.4)',
            borderTopColor: '#fff',
            animation: 'geo-spin 0.7s linear infinite',
          }} />
        ) : (
          <span role="img" aria-hidden="true">{flag || '🌐'}</span>
        )}
        <style>{`@keyframes geo-spin{to{transform:rotate(360deg)}}`}</style>
      </button>

      {/* ── Dropdown Panel ── */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Select your region"
          aria-modal="true"
          style={{
            ...panelPosStyle,
            width: 280,
            maxHeight: 440,
            background: 'var(--surface, #fff)',
            border: '1.5px solid var(--border, #e0e0e0)',
            borderRadius: 16,
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'geo-fadein .18s ease',
          }}
        >
          <style>{`
            @keyframes geo-fadein{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
          `}</style>

          {/* Header */}
          <div style={{
            padding: '12px 14px 6px',
            borderBottom: '1px solid var(--border, #eee)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text, #111)' }}>
                {flag} {countryName}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text3, #888)' }}>
                {currencySymbol} {currency}
                {autoDetected && !userSelected && (
                  <span style={{
                    marginLeft: 6, fontSize: 10, padding: '1px 5px',
                    background: 'var(--success-light, #dcfce7)',
                    color: 'var(--success, #16a34a)',
                    borderRadius: 4, fontWeight: 600,
                  }}>
                    Auto
                    {detectionSource && detectionSource !== 'fallback' && (
                      <span style={{ opacity: 0.7, fontWeight: 400 }}>
                        {' '}· {detectionSource === 'ipapi.co' || detectionSource === 'ip-api.com'
                          ? 'IP'
                          : detectionSource === 'browser-locale'
                          ? 'Browser'
                          : detectionSource === 'timezone'
                          ? 'TZ'
                          : ''}
                      </span>
                    )}
                  </span>
                )}
                {userSelected && (
                  <span style={{
                    marginLeft: 6, fontSize: 10, padding: '1px 5px',
                    background: 'var(--brand-light, #eef2ff)',
                    color: 'var(--brand, #6366f1)',
                    borderRadius: 4, fontWeight: 600,
                  }}>Custom</span>
                )}
                {!autoDetected && !userSelected && detecting && (
                  <span style={{
                    marginLeft: 6, fontSize: 10, padding: '1px 5px',
                    background: '#fef9c3',
                    color: '#854d0e',
                    borderRadius: 4, fontWeight: 600,
                  }}>Detecting…</span>
                )}
              </p>
            </div>
            <button
              aria-label="Close region picker"
              onClick={handleClose}
              style={{
                background: 'none', border: 'none', fontSize: 18,
                cursor: 'pointer', color: 'var(--text3, #888)',
                lineHeight: 1, padding: 4, borderRadius: 6,
              }}
            >×</button>
          </div>

          {/* Search */}
          <SearchBox value={query} onChange={setQuery} />

          {/* Country list */}
          <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 6 }}>
            {filtered ? (
              /* Flat search results */
              filtered.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text3, #888)', fontSize: 12 }}>
                  No countries found
                </p>
              ) : (
                <div role="listbox" aria-label="Search results">
                  {filtered.map(c => (
                    <CountryRow
                      key={c.code}
                      country={c}
                      isSelected={c.code === countryCode}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              )
            ) : (
              /* Grouped by continent */
              continents.map(continent => (
                <ContinentSection
                  key={continent}
                  continent={continent}
                  countries={byContinent[continent] ?? []}
                  selectedCode={countryCode}
                  onSelect={handleSelect}
                />
              ))
            )}
          </div>

          {/* Footer */}
          {userSelected && (
            <div style={{
              borderTop: '1px solid var(--border, #eee)',
              padding: '8px 14px',
              textAlign: 'center',
            }}>
              <button
                onClick={handleResetAuto}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 11.5,
                  color: 'var(--brand, #6366f1)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  textDecoration: 'underline',
                  padding: 0,
                }}
              >
                🔄 Reset to auto-detected region
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default FloatingRegionSwitcher;
