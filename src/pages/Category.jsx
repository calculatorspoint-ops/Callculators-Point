import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { CATEGORIES, BY_CATEGORY } from "@/data/calculatorConfigs.js";

export default function Category() {
  const { catId } = useParams();
  const cat=CATEGORIES.find(c=>c.id===catId);
  const calcs=BY_CATEGORY[catId]||[];
  if(!cat) return <Navigate to="/calculators" replace/>;
  return (
    <>
      <Helmet>
        <title>{`Free ${cat.name} Calculators — ${calcs.length} Tools | CalculatorsPoint`}</title>
        <meta name="description" content={`Browse ${calcs.length} free ${cat.name} calculators. ${cat.desc}. Instant, accurate, and 100% free online tools.`} />
        <link rel="canonical" href={`https://calculatorspoint.com/category/${cat.id}`} />
      </Helmet>
      
      <div className="cat-page-header" style={{ background:`linear-gradient(135deg, ${cat.color}22, ${cat.color}11)`, borderBottom:"1px solid var(--border)" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"clamp(16px,4vw,36px) clamp(14px,3vw,24px) clamp(14px,3vw,28px)" }}>
          <nav style={{ fontSize:12, color:"var(--text3)", marginBottom:12, display:"flex", gap:6, flexWrap:"wrap" }}>
            <Link to="/" style={{ color:"var(--text3)" }}>Home</Link><span>/</span>
            <Link to="/calculators" style={{ color:"var(--text3)" }}>Calculators</Link><span>/</span>
            <span style={{ color:cat.color, fontWeight:600 }}>{cat.name}</span>
          </nav>
          <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
            <div style={{ width:"clamp(44px,12vw,60px)", height:"clamp(44px,12vw,60px)", borderRadius:"var(--r-xl)", background:cat.bg, border:`2px solid ${cat.color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"clamp(20px,6vw,28px)", flexShrink:0 }}>{cat.icon}</div>
            <div style={{ minWidth:0 }}>
              <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.3rem,5vw,2.2rem)", fontWeight:800, color:"var(--text)", letterSpacing:"-.03em", marginBottom:4 }}>{cat.name} Calculators</h1>
              <p style={{ fontSize:13, color:"var(--text3)" }}>{calcs.length} free tools · {cat.desc}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="page-wrap">
        <div className="cat-grid">
          {calcs.map(c=>(
            <Link key={c.id} to={`/calculator/${c.slug}`}
              style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--r-lg)", transition:"all .15s", color:"var(--text)" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=cat.color;e.currentTarget.style.boxShadow=`0 0 0 1px ${cat.color}`;e.currentTarget.style.transform="translateY(-1px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}>
              <span style={{ fontSize:22, width:36, textAlign:"center", flexShrink:0 }}>{c.icon}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                  <span style={{ fontSize:14, fontWeight:600 }}>{c.name}</span>
                  {c.popular&&<span className="badge badge-green">Popular</span>}
                  {c.isNew&&<span className="badge badge-red">New</span>}
                </div>
                <p style={{ fontSize:12, color:"var(--text3)", marginTop:2 }}>{c.desc}</p>
              </div>
              <span style={{ fontSize:16, color:"var(--text3)", flexShrink:0 }}>→</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

