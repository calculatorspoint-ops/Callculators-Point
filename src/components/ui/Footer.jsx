import { Link } from "react-router-dom";
import { CATEGORIES, POPULAR, ALL_CALCULATORS } from "@/data/calculatorConfigs.js";
import { Calculator } from "lucide-react";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, fontFamily:"var(--font-hd)", fontSize:22, fontWeight:800, color:"#fff", marginBottom:10, letterSpacing:"-.04em" }}>
              <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#2563eb,#1d4ed8)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(37,99,235,0.35)" }}>
                <Calculator size={18} color="#ffffff" strokeWidth={2.5} />
              </div>
              <div>Calculators<span style={{ color:"#4ade80" }}>Point</span></div>
            </div>
            <p style={{ fontSize:13, lineHeight:1.7, color:"var(--footer-text)", marginBottom:16 }}>
              {ALL_CALCULATORS.length}+ free online calculators for finance, health, math, education and daily life.
              Fast, accurate, and 100% free — always.
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {[["Privacy","/privacy-policy"],["Terms","/terms-of-service"],["Disclaimer","/disclaimer"]].map(([l,h])=>(
                <Link key={h} to={h} style={{ padding:"4px 10px", borderRadius:6, fontSize:11, fontWeight:600, background:"var(--footer-bg-surface)", border:"1px solid var(--footer-bg-border)", color:"var(--footer-text)", transition:"color .15s" }}
                  onMouseEnter={e=>e.currentTarget.style.color="var(--footer-link-hover)"}
                  onMouseLeave={e=>e.currentTarget.style.color="var(--footer-text)"}>
                  {l}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <p className="footer-head">Categories</p>
            {CATEGORIES.map(c=>(
              <Link key={c.id} to={`/category/${c.id}`} className="footer-link" style={{ marginBottom:8 }}>
                <span>{c.icon}</span> {c.name}
              </Link>
            ))}
          </div>

          {/* Popular */}
          <div>
            <p className="footer-head">Popular Tools</p>
            {POPULAR.slice(0,8).map(c=>(
              <Link key={c.id} to={`/calculator/${c.slug}`} className="footer-link" style={{ marginBottom:8 }}>
                {c.name}
              </Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <p className="footer-head">Company</p>
            {[["About Us","/about"],["Contact Us","/contact"],["All Calculators","/calculators"],["Sitemap","/sitemap"]].map(([l,h])=>(
              <Link key={h} to={h} className="footer-link" style={{ marginBottom:8 }}>{l}</Link>
            ))}
            <p className="footer-head" style={{ marginTop:20 }}>Legal</p>
            {[["Privacy Policy","/privacy-policy"],["Terms of Service","/terms-of-service"],["Disclaimer","/disclaimer"]].map(([l,h])=>(
              <Link key={h} to={h} className="footer-link" style={{ marginBottom:8 }}>{l}</Link>
            ))}
          </div>
        </div>

        {/* Ad disclosure */}
        <div className="footer-disc">
          <strong style={{ color:"#94a3b8" }}>Advertising Disclosure:</strong>{" "}
          Calculators Point is free to use and supported by non-intrusive advertising via Google AdSense.
          Ads are clearly labeled and never influence our calculator results or editorial content.
          See our{" "}
          <Link to="/privacy-policy" style={{ color:"var(--footer-link-hover)" }}>Privacy Policy</Link> and{" "}
          <Link to="/disclaimer" style={{ color:"var(--footer-link-hover)" }}>Disclaimer</Link> for details.
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Calculators Point. All rights reserved. Results are for informational purposes only.</span>
          <span>Made with ❤️ · <a href="https://mkinnovexa.vercel.app/" target="_blank" rel="noopener noreferrer" style={{color:"var(--brand)",fontWeight:700,textDecoration:"none"}}>MK INNOVEXA</a></span>
        </div>
      </div>
    </footer>
  );
}
