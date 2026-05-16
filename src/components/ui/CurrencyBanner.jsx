import { useState } from "react";
import { ChevronDown, Check, Globe, Info, X } from "lucide-react";
import { useCurrencyStore, CURRENCIES } from "@/store/useCurrencyStore.js";

/* ── Country-specific tax & financial rules ───────────────────────────── */
const COUNTRY_RULES = {
  USD: {
    taxSlabs:    "Federal: 10%–37% (7 brackets). No federal VAT.",
    tipNorm:     "Tipping 15–20% is customary at restaurants.",
    savingsRate: "Average savings rate ~5%. 401(k) limit: $23,000/yr.",
    extras:      ["FICA: 7.65% payroll tax", "Capital gains: 15%–20%"],
  },
  EUR: {
    taxSlabs:    "VAT 19–27% depending on EU country. Income tax varies.",
    tipNorm:     "Tipping 5–10% optional. Service often included.",
    savingsRate: "EU average savings rate ~15%.",
    extras:      ["Social contributions ~20%", "Wealth tax in some countries"],
  },
  GBP: {
    taxSlabs:    "Basic 20%, Higher 40%, Additional 45%. NI: 8%.",
    tipNorm:     "Tipping 10–15% is common. Service charge often added.",
    savingsRate: "ISA allowance: £20,000/yr. NS&I Premium Bonds.",
    extras:      ["National Insurance 8%", "Capital gains allowance: £6,000"],
  },
  PKR: {
    taxSlabs:    "0% up to ₨600K, 5–35% above. Super tax for high earners.",
    tipNorm:     "Tipping 10–15% common at restaurants in cities.",
    savingsRate: "NSS Certificates 12–14% p.a. Provident Fund mandatory.",
    extras:      ["Withholding tax 1–10%", "GST on services 13–16%", "Super tax 4–10% on corporates"],
  },
  INR: {
    taxSlabs:    "New regime: 0–₹3L: nil, ₹3–7L: 5%, ₹7–10L: 10%, ₹10–12L: 15%, above: 20–30%.",
    tipNorm:     "10% tip common in restaurants. Service charge may apply.",
    savingsRate: "PPF: 7.1% p.a. EPF: 8.25%. NPS: market-linked.",
    extras:      ["GST: 5/12/18/28% slabs", "Surcharge on income > ₹50L", "4% Health & Education Cess"],
  },
  AED: {
    taxSlabs:    "No personal income tax in UAE. Corporate tax: 9% (2023).",
    tipNorm:     "10% service charge often included. Extra tip appreciated.",
    savingsRate: "No mandatory social security for expats. DEWS scheme.",
    extras:      ["VAT 5% on most goods", "No capital gains tax", "Excise on tobacco/energy drinks 100%"],
  },
  SAR: {
    taxSlabs:    "No personal income tax for Saudis. Expats pay GOSI 2%.",
    tipNorm:     "Tipping not mandatory but appreciated (10%).",
    savingsRate: "GOSI: 9.75% employer, 9.75% employee for Saudis.",
    extras:      ["VAT 15%", "ZAKAT 2.5% on Muslim business owners", "No capital gains for individuals"],
  },
  CAD: {
    taxSlabs:    "Federal: 15–33%. Provincial adds 5–21% on top.",
    tipNorm:     "15–20% tip is standard. Debit/credit tip prompts common.",
    savingsRate: "TFSA: $7,000/yr. RRSP: 18% of income limit.",
    extras:      ["CPP: 5.95% employee", "EI: 1.66%", "HST/GST: 5–15% by province"],
  },
  AUD: {
    taxSlabs:    "0%: ≤$18,200 · 19%: $18–45K · 32.5%: $45–120K · 37–45% above.",
    tipNorm:     "Tipping not expected but appreciated (10%).",
    savingsRate: "Super: 11% employer mandatory. First Home Super Saver.",
    extras:      ["Medicare levy 2%", "GST 10%", "Capital gains 50% discount if held >1 yr"],
  },
  CNY: {
    taxSlabs:    "3%–45% progressive. No standard deduction; specific allowances.",
    tipNorm:     "Tipping not common or expected in China.",
    savingsRate: "5-yr LPR ~3.95%. Social security contributions ~10%.",
    extras:      ["VAT 6/9/13%", "Social insurance ~10%", "Capital gains on stocks: exempt"],
  },
  JPY: {
    taxSlabs:    "5%–45% national + 10% local = effective 15–55%.",
    tipNorm:     "Tipping is considered rude. Never tip in Japan.",
    savingsRate: "NISA annual limit: ¥3.6M. Pension: Kokumin Nenkin.",
    extras:      ["Consumption tax (CT) 10%", "Social insurance ~15%", "Gift/inheritance tax 10–55%"],
  },
  CHF: {
    taxSlabs:    "Federal: 0–11.5%. Cantonal adds 10–35%. Total ~20–40%.",
    tipNorm:     "Rounding up the bill is common. No strict tipping norm.",
    savingsRate: "Pillar 3a max: CHF 7,056/yr. BVG mandatory pension.",
    extras:      ["VAT 8.1%", "Wealth tax in all cantons", "No capital gains on private assets"],
  },
  BDT: {
    taxSlabs:    "0% up to ৳350K, 5–25% above. 10% surcharge on tax if wealth > ৳50M.",
    tipNorm:     "10% service charge in restaurants. Tip optional.",
    savingsRate: "Sanchaypatra 11.28–11.76% p.a. GPF for government employees.",
    extras:      ["VAT 15%", "AIT on import 5%", "Corporate tax 27.5%"],
  },
  MYR: {
    taxSlabs:    "0%–30% (11 brackets). Chargeable income after relief.",
    tipNorm:     "Service charge 6–10% usually included. No additional tip needed.",
    savingsRate: "EPF: 11% employee + 12–13% employer. ASB: ~5% p.a.",
    extras:      ["SST 6–10%", "SOCSO 0.5%", "Capital gains tax on property (RPGT) 5–30%"],
  },
  SGD: {
    taxSlabs:    "0%–24% progressive. Very low effective rates for most.",
    tipNorm:     "10% service charge + 9% GST usually added (no extra tip).",
    savingsRate: "CPF: 20% employee + 17% employer for <55. OA earns 2.5%.",
    extras:      ["GST 9%", "No capital gains tax", "No inheritance tax"],
  },
  TRY: {
    taxSlabs:    "15%–40% (5 brackets). High inflation impacts real rates.",
    tipNorm:     "Service charge often included. 10% extra appreciated.",
    savingsRate: "High inflation (>50%). TL deposits may lose real value.",
    extras:      ["KDV (VAT) 20%", "SCT on luxury goods 25–50%", "Stamp duty 0.759% on salary"],
  },
  NGN: {
    taxSlabs:    "7%–24% on income. PAYE deducted by employer monthly.",
    tipNorm:     "10% tip is appreciated at restaurants.",
    savingsRate: "Treasury bills 15–18% p.a. Pension: 8% employee + 10% employer.",
    extras:      ["VAT 7.5%", "WHT 5–10%", "CIT 30% corporate"],
  },
  ZAR: {
    taxSlabs:    "18%–45% (7 brackets). Primary rebate R17,235/yr.",
    tipNorm:     "10–15% tip is standard in restaurants.",
    savingsRate: "TFSA: R36,000/yr, lifetime R500,000. RA tax deductible.",
    extras:      ["VAT 15%", "Capital gains inclusion rate 40%", "Skills levy 1%"],
  },
  BRL: {
    taxSlabs:    "0%: ≤R$2,259 · 7.5%: to R$2,826 · 15%: to R$3,751 · 22.5–27.5% above.",
    tipNorm:     "10% gorjeta (service charge) usually on the bill.",
    savingsRate: "Poupança savings ~6%. FGTS 8% employer contribution.",
    extras:      ["ICMS 12–25%", "IOF financial tax 0.38%", "INSS social security 7.5–14%"],
  },
  MXN: {
    taxSlabs:    "1.92%–35% progressive. ISR (income tax) on all income.",
    tipNorm:     "10–15% tip is expected at restaurants.",
    savingsRate: "AFORE pension: 15% total contribution. Cetes ~10.5% p.a.",
    extras:      ["IVA (VAT) 16%", "ISR withholding on wages", "IMSS social security 6.4%"],
  },
};

export function CurrencyBanner({ minimal = false }) {
  const { currency, setCurrency } = useCurrencyStore();
  const [open,    setOpen]    = useState(false);
  const [search,  setSearch]  = useState("");
  const [showInfo, setShowInfo] = useState(false);

  const cur   = CURRENCIES[currency] || CURRENCIES.USD;
  const rules = COUNTRY_RULES[currency] || COUNTRY_RULES.USD;

  const filtered = Object.values(CURRENCIES).filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const select = (code) => { setCurrency(code); setOpen(false); setSearch(""); };

  return (
    <div style={{ position: "relative" }}>
      {/* ── Banner row ── */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #1e3a8a 100%)",
        borderBottom: "1px solid rgba(255,255,255,.1)",
        padding: minimal ? "8px 16px" : "12px 20px",
        display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
      }}>
        {/* Left: currency info */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>{cur.flag}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 13, fontWeight: 700, color: "#fff",
              display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap",
            }}>
              <span>{cur.name}</span>
              <span style={{
                background: "rgba(99,102,241,.25)", border: "1px solid rgba(99,102,241,.4)",
                borderRadius: 100, padding: "1px 8px", fontSize: 11,
                color: "#a5b4fc", fontWeight: 800,
              }}>{cur.symbol} {cur.code}</span>
              {cur.taxRate > 0 && (
                <span style={{
                  background: "rgba(34,197,94,.15)", border: "1px solid rgba(34,197,94,.25)",
                  borderRadius: 100, padding: "1px 8px", fontSize: 11,
                  color: "#4ade80", fontWeight: 700,
                }}>{cur.vatLabel} {cur.taxRate}%</span>
              )}
            </div>
            {!minimal && (
              <p style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginTop: 2 }}>
                Tax/currency rules auto-applied · All calculations use {cur.symbol}
              </p>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
          {/* Info toggle */}
          <button
            onClick={() => setShowInfo(s => !s)}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 10px", borderRadius: 8,
              background: showInfo ? "rgba(99,102,241,.3)" : "rgba(255,255,255,.08)",
              border: "1px solid rgba(255,255,255,.15)",
              color: "rgba(255,255,255,.8)", fontSize: 12, fontWeight: 600,
              cursor: "pointer", transition: "all .15s", fontFamily: "var(--font)",
            }}
            title="View tax &amp; financial rules"
          >
            <Info size={13} />
            {!minimal && <span>Tax Rules</span>}
          </button>

          {/* Currency switcher */}
          <button
            onClick={() => setOpen(s => !s)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 12px", borderRadius: 8,
              background: "rgba(99,102,241,.3)",
              border: "1px solid rgba(99,102,241,.5)",
              color: "#c7d2fe", fontSize: 12, fontWeight: 700,
              cursor: "pointer", transition: "all .15s", fontFamily: "var(--font)",
              whiteSpace: "nowrap",
            }}
          >
            <Globe size={13} />
            Change Currency
            <ChevronDown size={11} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
          </button>
        </div>
      </div>

      {/* ── Tax rules panel ── */}
      {showInfo && (
        <div style={{
          background: "linear-gradient(135deg, #0f172a, #1e1b4b)",
          borderBottom: "1px solid rgba(255,255,255,.1)",
          padding: "14px 20px",
          animation: "fadeSlide .15s ease",
        }}>
          <div style={{
            maxWidth: 900, display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 12,
          }}>
            {/* Tax slabs */}
            <div style={{
              background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
              borderRadius: 10, padding: "12px 14px",
            }}>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "#94a3b8", marginBottom: 6 }}>
                📊 Income Tax
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,.75)", lineHeight: 1.6 }}>
                {rules.taxSlabs}
              </p>
            </div>

            {/* Savings */}
            <div style={{
              background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
              borderRadius: 10, padding: "12px 14px",
            }}>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "#94a3b8", marginBottom: 6 }}>
                🏦 Savings & Investment
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,.75)", lineHeight: 1.6 }}>
                {rules.savingsRate}
              </p>
            </div>

            {/* Tipping / social norms */}
            <div style={{
              background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
              borderRadius: 10, padding: "12px 14px",
            }}>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "#94a3b8", marginBottom: 6 }}>
                🍽️ Tipping & Norms
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,.75)", lineHeight: 1.6 }}>
                {rules.tipNorm}
              </p>
            </div>

            {/* Extra rules */}
            {rules.extras?.length > 0 && (
              <div style={{
                background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
                borderRadius: 10, padding: "12px 14px",
              }}>
                <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "#94a3b8", marginBottom: 6 }}>
                  ⚡ Additional Rules
                </div>
                <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 4 }}>
                  {rules.extras.map((e, i) => (
                    <li key={i} style={{ fontSize: 12, color: "rgba(255,255,255,.7)", lineHeight: 1.5 }}>{e}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <p style={{ fontSize: 10, color: "rgba(255,255,255,.3)", marginTop: 10 }}>
            ⚠️ Tax rules are approximate guidelines. Consult a local financial advisor for precise figures.
          </p>
        </div>
      )}

      {/* ── Currency dropdown ── */}
      {open && (
        <div style={{
          position: "absolute", top: "100%", right: 0,
          width: "min(300px, 94vw)",
          background: "var(--surface)", border: "1.5px solid var(--border)",
          borderRadius: 14, overflow: "hidden", zIndex: 400,
          boxShadow: "0 12px 40px rgba(0,0,0,.25)",
          animation: "fadeSlide .15s ease",
        }}>
          {/* Search */}
          <div style={{ padding: "12px 12px 6px" }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search currencies…"
              autoFocus
              style={{
                width: "100%", padding: "8px 12px",
                background: "var(--surface2)", border: "1.5px solid var(--border)",
                borderRadius: 8, fontSize: 13, color: "var(--text)",
                outline: "none", fontFamily: "var(--font)",
              }}
              onFocus={e => e.target.style.borderColor = "var(--brand)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          {/* List */}
          <div style={{ maxHeight: 260, overflowY: "auto", paddingBottom: 6 }}>
            {filtered.map(c => (
              <button
                key={c.code}
                onClick={() => select(c.code)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 12px",
                  background: c.code === currency ? "var(--brand-l)" : "transparent",
                  border: "none", cursor: "pointer", fontFamily: "var(--font)",
                  transition: "background .1s", textAlign: "left",
                }}
                onMouseEnter={e => { if (c.code !== currency) e.currentTarget.style.background = "var(--surface2)"; }}
                onMouseLeave={e => { if (c.code !== currency) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: 18, width: 24, textAlign: "center", flexShrink: 0 }}>{c.flag}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: c.code === currency ? "var(--brand)" : "var(--text)" }}>
                    {c.code} <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 400 }}>{c.symbol}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {c.name} {c.taxRate > 0 ? `· ${c.vatLabel} ${c.taxRate}%` : "· No VAT"}
                  </div>
                </div>
                {c.code === currency && <Check size={14} style={{ color: "var(--brand)", flexShrink: 0 }} />}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            padding: "8px 12px", borderTop: "1px solid var(--border)",
            background: "var(--surface2)", fontSize: 10, color: "var(--text3)",
            display: "flex", alignItems: "center", gap: 5,
          }}>
            <Globe size={10} /> Currency affects symbols, tax rates &amp; financial rules
          </div>
        </div>
      )}
    </div>
  );
}
