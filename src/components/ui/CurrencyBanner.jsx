/**
 * @file CurrencyBanner.jsx
 * @description Finance-calculator banner that shows auto-detected country
 *   currency + tax rules. Fully powered by the geo-engine store.
 */
import { useState } from 'react';
import { ChevronDown, Check, Globe, Info, X } from 'lucide-react';
import { useGeoStore } from '@/core/geo-engine/geoStore';
import { ALL_COUNTRIES, COUNTRIES_BY_CONTINENT, CONTINENTS } from '@/core/geo-engine/countryRules';

export function CurrencyBanner({ minimal = false }) {
  const countryCode  = useGeoStore(s => s.countryCode);
  const rules        = useGeoStore(s => s.rules);
  const autoDetected = useGeoStore(s => s.autoDetected);
  const userSelected = useGeoStore(s => s.userSelected);
  const detecting    = useGeoStore(s => s.detecting);
  const setCountry   = useGeoStore(s => s.setCountry);
  const resetToAuto  = useGeoStore(s => s.resetToAuto);

  const [open,     setOpen]     = useState(false);
  const [search,   setSearch]   = useState('');
  const [showInfo, setShowInfo] = useState(false);

  const flag           = rules?.flag           ?? '🌐';
  const currency       = rules?.currency       ?? 'USD';
  const currencySymbol = rules?.currencySymbol ?? '$';
  const taxRate        = rules?.taxRate        ?? 0;
  const taxLabel       = rules?.taxLabel       ?? 'Tax';
  const countryName    = rules?.countryName    ?? 'United States';
  const measureSystem  = rules?.measureSystem  ?? 'metric';
  const dateFormat     = rules?.dateFormat     ?? 'MM/DD/YYYY';

  // Filter countries by search
  const filtered = search.trim()
    ? ALL_COUNTRIES.filter(c =>
        c.countryName.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.currency.toLowerCase().includes(search.toLowerCase())
      )
    : null; // null = show grouped view

  const select = (code) => { setCountry(code); setOpen(false); setSearch(''); };

  return (
    <div style={{ position: 'relative' }}>
      {/* ── Banner row ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #1e3a8a 100%)',
        borderBottom: '1px solid rgba(255,255,255,.1)',
        padding: minimal ? '7px 12px' : '9px 16px',
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'nowrap', overflow: 'hidden',
      }}>
        {/* Left: region info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1 }}>
            {detecting ? '🌐' : flag}
          </span>
          <div style={{ minWidth: 0, overflow: 'hidden', flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'nowrap', overflow: 'hidden' }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 1, minWidth: 0 }}>
                {detecting ? 'Detecting…' : countryName}
              </span>
              <span style={{ background: 'rgba(99,102,241,.25)', border: '1px solid rgba(99,102,241,.4)', borderRadius: 100, padding: '1px 7px', fontSize: 10, color: '#a5b4fc', fontWeight: 800, flexShrink: 0, whiteSpace: 'nowrap' }}>
                {currencySymbol} {currency}
              </span>
              {taxRate > 0 && (
                <span className="cb-badge-hide-xs" style={{ background: 'rgba(34,197,94,.15)', border: '1px solid rgba(34,197,94,.25)', borderRadius: 100, padding: '1px 7px', fontSize: 10, color: '#4ade80', fontWeight: 700, flexShrink: 0, whiteSpace: 'nowrap' }}>
                  {taxLabel} {taxRate}%
                </span>
              )}
              {userSelected && (
                <span className="cb-badge-hide-xs" style={{ background: 'rgba(99,102,241,.2)', border: '1px solid rgba(99,102,241,.35)', borderRadius: 100, padding: '1px 6px', fontSize: 10, color: '#a5b4fc', fontWeight: 700, flexShrink: 0, whiteSpace: 'nowrap' }}>
                  Custom
                </span>
              )}
            </div>
            {!minimal && (
              <p className="cb-subtitle" style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {measureSystem === 'imperial' ? 'Imperial units' : 'Metric units'} · {dateFormat} dates · All calculations use {currencySymbol}
              </p>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexShrink: 0 }}>
          {/* Info */}
          <button
            onClick={() => setShowInfo(s => !s)}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 8px', borderRadius: 7, background: showInfo ? 'rgba(99,102,241,.3)' : 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', color: 'rgba(255,255,255,.8)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)', whiteSpace: 'nowrap' }}
            title="View tax & financial rules"
          >
            <Info size={12} />
            <span className="cb-btn-label">Tax Rules</span>
          </button>

          {/* Region switcher */}
          <button
            onClick={() => setOpen(s => !s)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7, background: 'rgba(99,102,241,.3)', border: '1px solid rgba(99,102,241,.5)', color: '#c7d2fe', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)', whiteSpace: 'nowrap' }}
          >
            <Globe size={12} />
            <span className="cb-btn-label">Change Region</span>
            <ChevronDown size={10} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
          </button>
        </div>
      </div>

      {/* ── Tax rules panel ── */}
      {showInfo && rules && (
        <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e1b4b)', borderBottom: '1px solid rgba(255,255,255,.1)', padding: '14px 20px', animation: 'fadeSlide .15s ease' }}>
          <div style={{ maxWidth: 900, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
            <InfoCard icon="📊" title="Tax Rate">
              {taxRate > 0 ? `${taxLabel}: ${taxRate}%` : `No ${taxLabel}`}
            </InfoCard>
            <InfoCard icon="📏" title="Measurement">{measureSystem.charAt(0).toUpperCase() + measureSystem.slice(1)} system</InfoCard>
            <InfoCard icon="📅" title="Date Format">{dateFormat}</InfoCard>
            <InfoCard icon="💰" title="Currency">{currencySymbol} {currency}</InfoCard>
          </div>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', marginTop: 10 }}>
            ⚠️ Tax rules are approximate guidelines. Consult a local financial advisor for precise figures.
          </p>
        </div>
      )}

      {/* ── Region dropdown ── */}
      {open && (
        <div style={{ position: 'absolute', top: '100%', right: 0, width: 'min(300px,96vw)', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 14, overflow: 'hidden', zIndex: 500, boxShadow: '0 12px 40px rgba(0,0,0,.25)', animation: 'fadeSlide .15s ease' }}>

          {/* Header */}
          <div style={{ padding: '10px 12px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>Select Region</span>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 16, lineHeight: 1, padding: 2 }}>×</button>
          </div>

          {/* Search */}
          <div style={{ padding: '8px 10px 4px' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search country or currency…"
              autoFocus
              style={{ width: '100%', padding: '7px 10px', background: 'var(--surface2)', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 12.5, color: 'var(--text)', outline: 'none', fontFamily: 'var(--font)', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = 'var(--brand)'}
              onBlur={e  => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* List */}
          <div style={{ maxHeight: 300, overflowY: 'auto', paddingBottom: 4 }}>
            {filtered ? (
              filtered.length === 0
                ? <p style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text3)', fontSize: 12 }}>No results</p>
                : filtered.map(c => <CountryRow key={c.code} c={c} selected={c.code === countryCode} onSelect={select} />)
            ) : (
              CONTINENTS.map(continent => (
                <div key={continent}>
                  <div style={{ padding: '5px 12px 2px', fontSize: 9.5, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text3)', borderTop: '1px solid var(--border)' }}>
                    {continent}
                  </div>
                  {(COUNTRIES_BY_CONTINENT[continent] || []).map(c => (
                    <CountryRow key={c.code} c={c} selected={c.code === countryCode} onSelect={select} />
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: '6px 12px', borderTop: '1px solid var(--border)', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 4 }}><Globe size={9} /> Auto-detected from your IP</span>
            {userSelected && (
              <button onClick={() => { resetToAuto(); setOpen(false); }} style={{ background: 'none', border: 'none', fontSize: 10, color: 'var(--brand)', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline', padding: 0, fontFamily: 'var(--font)' }}>
                Reset to auto
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ icon, title, children }) {
  return (
    <div style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, padding: '10px 12px' }}>
      <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: '#94a3b8', marginBottom: 4 }}>{icon} {title}</div>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,.75)', lineHeight: 1.5, margin: 0 }}>{children}</p>
    </div>
  );
}

function CountryRow({ c, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(c.code)}
      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', background: selected ? 'var(--brand-l, #eef2ff)' : 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)', textAlign: 'left', transition: 'background .1s' }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = 'var(--surface2)'; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'transparent'; }}
    >
      <span style={{ fontSize: 17, flexShrink: 0 }}>{c.flag}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: selected ? 700 : 500, color: selected ? 'var(--brand)' : 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {c.countryName}
        </div>
        <div style={{ fontSize: 10.5, color: 'var(--text3)' }}>
          {c.currencySymbol} {c.currency} · {c.taxRate > 0 ? `${c.taxLabel} ${c.taxRate}%` : 'No tax'}
        </div>
      </div>
      {selected && <Check size={13} style={{ color: 'var(--brand)', flexShrink: 0 }} />}
    </button>
  );
}

export default CurrencyBanner;
