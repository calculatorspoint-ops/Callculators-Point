import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Moon, Sun, Menu, X, Calculator } from "lucide-react";
import { useAppStore } from "@/store/useAppStore.js";
import { ALL_CALCULATORS, CATEGORIES } from "@/data/calculatorConfigs.js";
import { CurrencySelector } from "./CurrencySelector.jsx";

export function Navbar() {
  const { theme, toggleTheme } = useAppStore();
  const [q, setQ]       = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [mob, setMob]   = useState(false);
  const ref  = useRef(null);
  const loc = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => { setMob(false); setOpen(false); setQ(""); }, [loc.pathname]);

  useEffect(() => {
    if (!q.trim()) { setResults([]); setOpen(false); return; }
    const lq = q.toLowerCase();
    const r = ALL_CALCULATORS.filter(c => c.name.toLowerCase().includes(lq) || c.desc?.toLowerCase().includes(lq)).slice(0, 8);
    setResults(r);
    setOpen(r.length > 0);
  }, [q]);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo" style={{ textDecoration: "none" }}>
          <div style={{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,#6366f1,#4f46e5)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(99,102,241,.4)" }}>
            <Calculator size={19} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight:800, fontSize:18, letterSpacing:"-.04em", color:"var(--text)" }}>
            Calculators<span style={{ color:"#6366f1" }}>Point</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar-nav" style={{ display:"flex", gap:4, alignItems:"center" }}>
          {CATEGORIES.slice(0,5).map(c => (
            <Link key={c.id} to={`/category/${c.id}`} className="nav-link"
              style={{ padding:"6px 12px", borderRadius:8, fontSize:13, fontWeight:600, color:"var(--text2)", textDecoration:"none", transition:"all .15s" }}
              onMouseEnter={e=>{e.currentTarget.style.background="var(--surface2)";e.currentTarget.style.color="var(--text)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="";e.currentTarget.style.color="var(--text2)";}}>
              {c.icon} {c.name}
            </Link>
          ))}
          <Link to="/calculators" style={{ padding:"6px 14px", borderRadius:8, fontSize:13, fontWeight:700, color:"var(--brand)", border:"1.5px solid var(--brand)", textDecoration:"none", transition:"all .15s" }}
            onMouseEnter={e=>{e.currentTarget.style.background="var(--p50)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="";}}>
            All Tools
          </Link>
        </nav>

        {/* Search + Controls */}
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {/* Search box */}
          <div ref={ref} style={{ position:"relative" }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 12px", background:"var(--surface2)", border:"1.5px solid var(--border)", borderRadius:10, width:220 }}>
              <Search size={14} style={{ color:"var(--text3)", flexShrink:0 }} />
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search calculators..."
                style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:13, color:"var(--text)", fontFamily:"var(--font)" }}
              />
              {q && <button onClick={()=>{setQ("");setOpen(false);}} style={{ color:"var(--text3)", fontSize:14 }}>×</button>}
            </div>
            {open && (
              <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, right:0, background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:12, overflow:"hidden", zIndex:999, boxShadow:"0 8px 32px rgba(0,0,0,.18)" }}>
                {results.map(r => (
                  <Link key={r.id} to={`/calculator/${r.slug}`} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", fontSize:13, textDecoration:"none", color:"var(--text)", borderBottom:"1px solid var(--border2)", transition:"background .1s" }}
                    onMouseEnter={e=>e.currentTarget.style.background="var(--surface2)"}
                    onMouseLeave={e=>e.currentTarget.style.background=""}>
                    <span style={{ fontSize:18 }}>{r.icon}</span>
                    <div><div style={{ fontWeight:600 }}>{r.name}</div><div style={{ fontSize:11, color:"var(--text3)" }}>{r.desc?.slice(0,50)}</div></div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <CurrencySelector />

          <button onClick={toggleTheme} style={{ padding:8, borderRadius:8, background:"var(--surface2)", border:"1px solid var(--border)", cursor:"pointer", display:"flex", color:"var(--text2)" }}>
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Mobile hamburger */}
          <button className="mob-toggle" onClick={()=>setMob(!mob)} style={{ padding:8, borderRadius:8, background:"var(--surface2)", border:"1px solid var(--border)", cursor:"pointer", display:"none", color:"var(--text2)" }}>
            {mob ? <X size={16}/> : <Menu size={16}/>}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mob && (
        <div style={{ background:"var(--surface)", borderTop:"1px solid var(--border)", padding:"12px 20px" }}>
          {CATEGORIES.map(c => (
            <Link key={c.id} to={`/category/${c.id}`} style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 12px", borderRadius:8, fontSize:14, fontWeight:600, color:"var(--text2)", textDecoration:"none" }}>
              {c.icon} {c.name}
            </Link>
          ))}
          <Link to="/calculators" style={{ display:"block", marginTop:8, padding:"9px 12px", borderRadius:8, fontSize:14, fontWeight:700, color:"var(--brand)", textDecoration:"none" }}>
            📊 All 55+ Tools
          </Link>
        </div>
      )}
    </header>
  );
}
