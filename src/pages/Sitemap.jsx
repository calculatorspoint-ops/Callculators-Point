import { Link } from "react-router-dom";

import { ALL_CALCULATORS, CATEGORIES } from "@/data/calculatorConfigs.js";
import { SEO_LANDING_PAGES } from "@/data/seoLandingData.js";

const GROUP = ({ title, icon, color, bg, links }) => (
  <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--r-xl)", overflow:"hidden", marginBottom:16, boxShadow:"var(--sh1)" }}>
    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", background:bg, borderBottom:"1px solid var(--border)" }}>
      <span style={{ fontSize:18 }}>{icon}</span>
      <h2 style={{ fontSize:14, fontWeight:800, color, margin:0 }}>{title}</h2>
      <span style={{ marginLeft:"auto", fontSize:11, fontWeight:700, color, opacity:.6 }}>{links.length} pages</span>
    </div>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px,1fr))" }}>
      {links.map(({ to, label, badge }) => (
        <Link key={to} to={to}
          style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 16px", fontSize:13, color:"var(--text2)", textDecoration:"none", borderBottom:"1px solid var(--bord2)", transition:"all .1s" }}
          onMouseEnter={e=>{ e.currentTarget.style.background="var(--brand-l)"; e.currentTarget.style.color="var(--brand)"; }}
          onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--text2)"; }}>
          <span>→</span>
          <span style={{ flex:1 }}>{label}</span>
          {badge && <span style={{ fontSize:9, fontWeight:800, padding:"1px 6px", borderRadius:100, background:"#fef2f2", color:"#b91c1c", border:"1px solid #fecaca" }}>{badge}</span>}
        </Link>
      ))}
    </div>
  </div>
);

export default function Sitemap() {
  return (
    <>
      

      <div className="page-hero">
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:44, marginBottom:14 }}>🗺️</div>
          <h1>Sitemap</h1>
          <p>A complete map of all pages and calculators on Calculators Point.</p>
        </div>
      </div>

      <div className="page-wrap" style={{ maxWidth:1100 }}>
        {/* Core pages */}
        <GROUP
          title="Core Pages" icon="🏠" color="#1d4ed8" bg="#eff6ff"
          links={[
            { to:"/",               label:"Homepage" },
            { to:"/calculators",    label:"All Calculators" },
            { to:"/about",          label:"About Us" },
            { to:"/contact",        label:"Contact Us" },
            { to:"/privacy-policy", label:"Privacy Policy" },
            { to:"/terms-of-service",label:"Terms of Service" },
            { to:"/disclaimer",     label:"Disclaimer" },
            { to:"/sitemap",        label:"Sitemap (this page)" },
          ]}
        />

        {/* Categories */}
        <GROUP
          title="Calculator Categories" icon="📂" color="#065f46" bg="#f0fdf4"
          links={CATEGORIES.map(cat => ({ to:`/category/${cat.id}`, label:`${cat.icon} ${cat.name}` }))}
        />

        {/* Per-category calculators */}
        {CATEGORIES.map(cat => {
          const calcs = ALL_CALCULATORS.filter(c => c.cat === cat.id);
          return (
            <GROUP key={cat.id}
              title={`${cat.name} Calculators`}
              icon={cat.icon} color={cat.color} bg={cat.bg}
              links={calcs.map(c => ({
                to:`/calculator/${c.slug}`,
                label:`${c.icon} ${c.name}`,
                badge: c.isNew ? "NEW" : null,
              }))}
            />
          );
        })}

        {/* SEO Landing Pages */}
        {SEO_LANDING_PAGES.length > 0 && (
          <GROUP
            title="Specialized Tool Guides" icon="🎯" color="#7c3aed" bg="#f5f3ff"
            links={SEO_LANDING_PAGES.map(p => ({
              to: `/tools/${p.slug}`,
              label: `🎯 ${p.h1}`,
            }))}
          />
        )}

        {/* XML sitemap link */}
        <div style={{ textAlign:"center", padding:"24px", background:"var(--surf2)", border:"1px solid var(--border)", borderRadius:"var(--r-xl)", marginTop:8 }}>
          <p style={{ fontSize:14, color:"var(--text2)", marginBottom:12 }}>
            For search engines: the machine-readable XML sitemap is available at:
          </p>
          <a href="/sitemap.xml" target="_blank"
            style={{ fontFamily:"var(--font-mono)", fontSize:14, color:"var(--brand)", fontWeight:600 }}>
            calculatorspoint.com/sitemap.xml
          </a>
          <p style={{ fontSize:12, color:"var(--text3)", marginTop:8 }}>
            65 URLs · Updated {new Date().toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" })}
          </p>
        </div>
      </div>
    </>
  );
}
