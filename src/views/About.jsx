import Link from "next/link";

import { ALL_CALCULATORS, CATEGORIES, LIVE_CALC_COUNT, CALC_COUNT_LABEL } from "@/data/calculatorConfigs";
import { Shield, Zap, BarChart2, Globe, Lock, Heart, Star, Award, Users, Code } from "lucide-react";

const STATS = [
  { icon:"🧮", num:`${CALC_COUNT_LABEL}`, label:"Free Calculators" },
  { icon:"🌍", num:"20+", label:"Currencies Supported" },
  { icon:"📊", num:"12+", label:"Interactive Charts" },
  { icon:"⚡", num:"<1s", label:"Load Time" },
];

const VALUES = [
  {
    icon:<Shield size={22}/>, color:"#2563eb", bg:"#eff6ff",
    title:"Accuracy First",
    desc:"Every formula is verified against academic sources and professional tools. We use industry-standard methods — Mifflin-St Jeor for BMR, Naegele's Rule for pregnancy, FBR official slabs for tax."
  },
  {
    icon:<Lock size={22}/>, color:"#16a34a", bg:"#f0fdf4",
    title:"100% Private",
    desc:"All calculations run locally in your browser. No inputs are sent to any server. No accounts, no tracking of what you calculate, no data collection beyond anonymous page analytics."
  },
  {
    icon:<Zap size={22}/>, color:"#d97706", bg:"#fffbeb",
    title:"Instant & Free",
    desc:"Results update in real-time as you type — no button clicks needed. And it's completely free, forever. No subscription, no paywalls, no 'Pro version' for basic features."
  },
  {
    icon:<BarChart2 size={22}/>, color:"#7c3aed", bg:"#f5f3ff",
    title:"Visualise, Don't Just Calculate",
    desc:"Numbers alone don't tell the full story. Every relevant calculator includes interactive charts — amortization curves, investment growth projections, calorie goal comparisons — so you understand the result."
  },
  {
    icon:<Globe size={22}/>, color:"#0891b2", bg:"#ecfeff",
    title:"Built for Everyone",
    desc:"Auto-detects your region and currency. Supports 20+ currencies with local formatting. Works flawlessly on mobile, tablet, and desktop. Fully accessible with keyboard navigation and screen reader support."
  },
  {
    icon:<Heart size={22}/>, color:"#dc2626", bg:"#fef2f2",
    title:"Genuinely Helpful",
    desc:"We go beyond numbers. Smart insights tell you what your result means — 'Your EMI-to-income ratio is healthy' or 'Paying ₹500 extra per month saves ₹40,000 in interest.' Context matters."
  },
];

const TECH = [
  { name:"React 18", role:"UI Framework", icon:"⚛️" },
  { name:"Vite 8",   role:"Build Tool",   icon:"⚡" },
  { name:"Recharts", role:"Data Charts",  icon:"📊" },
  { name:"Zustand",  role:"State Mgmt",   icon:"🗃️" },
  { name:"Tailwind", role:"CSS Utility",  icon:"🎨" },
];

const TEAM = [
  { name:"Engineering", icon:"💻", desc:"Built with React and Vite for maximum performance and reliability." },
  { name:"Mathematics", icon:"📐", desc:"Every formula verified by academic papers and professional financial/medical sources." },
  { name:"Design",      icon:"🎨", desc:"Clean, accessible UI that works beautifully on all screen sizes and devices." },
  { name:"Data",        icon:"📊", desc:"Interactive visualizations built with Recharts, optimized for mobile and desktop." },
];

export default function About() {
  return (
    <>
      

      {/* ═══ HERO ═══════════════════════════════════════════════════════ */}
      <div className="page-hero">
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🧮</div>
          <h1>About Calculators Point</h1>
          <p>
            We believe everyone deserves access to professional-grade calculation tools — 
            for free, no subscriptions, no paywalls, no sign-up required.
          </p>
          <div style={{ display:"flex", justifyContent:"center", gap:12, flexWrap:"wrap", marginTop:24 }}>
            <Link href="/calculators" className="btn-primary" style={{ fontSize:13 }}>
              Explore Calculators
            </Link>
            <Link href="/contact" className="btn-ghost" style={{ fontSize:13 }}>
              Get in Touch
            </Link>
          </div>
        </div>
      </div>

      <div className="page-wrap" style={{ maxWidth:900 }}>

        {/* ═══ STATS ═══════════════════════════════════════════════════ */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px,1fr))", gap:16, marginBottom:40 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign:"center", padding:"24px 16px", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--r-xl)", boxShadow:"var(--sh2)" }}>
              <div style={{ fontSize:32, marginBottom:8 }}>{s.icon}</div>
              <div style={{ fontFamily:"var(--font-hd)", fontSize:28, fontWeight:900, color:"var(--brand)", letterSpacing:"-.03em", lineHeight:1 }}>{s.num}</div>
              <div style={{ fontSize:12, fontWeight:600, color:"var(--text3)", marginTop:5, textTransform:"uppercase", letterSpacing:".05em" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ═══ MISSION ════════════════════════════════════════════════ */}
        <div className="content-card">
          <h2>Our Mission</h2>
          <p>
            Calculators Point was created with a simple belief: <strong>powerful calculation tools should be free and accessible to everyone</strong>, 
            not locked behind subscriptions or cluttered with intrusive ads.
          </p>
          <p>
            Whether you're planning a home loan, tracking your fitness goals, solving a math problem, 
            or simply trying to understand how much tax you owe — Calculators Point gives you accurate, 
            instant answers with the context to understand them.
          </p>
          <p>
            We're not just building calculators. We're building tools that help people make better decisions 
            about money, health, and daily life. Every feature is designed with one question in mind: 
            <em>"Does this actually help the user understand and act on their result?"</em>
          </p>
        </div>

        {/* ═══ VALUES ═════════════════════════════════════════════════ */}
        <h2 style={{ fontFamily:"var(--font-hd)", fontSize:"1.4rem", fontWeight:900, color:"var(--text)", marginBottom:20, letterSpacing:"-.03em" }}>
          Our Core Values
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px,1fr))", gap:16, marginBottom:40 }}>
          {VALUES.map(v => (
            <div key={v.title} style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--r-xl)", padding:"22px 20px", boxShadow:"var(--sh1)" }}>
              <div style={{ width:44, height:44, borderRadius:"var(--r-lg)", background:v.bg, display:"flex", alignItems:"center", justifyContent:"center", color:v.color, marginBottom:14 }}>
                {v.icon}
              </div>
              <h3 style={{ fontSize:15, fontWeight:700, color:"var(--text)", marginBottom:8 }}>{v.title}</h3>
              <p style={{ fontSize:13, color:"var(--text2)", lineHeight:1.7 }}>{v.desc}</p>
            </div>
          ))}
        </div>

        {/* ═══ WHAT MAKES US DIFFERENT ════════════════════════════════ */}
        <div className="content-card">
          <h2>What Makes Calculators Point Different</h2>
          <p>
            Most calculator websites give you a form and a number. Calculators Point gives you:
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:16 }}>
            {[
              ["📊 Interactive Charts", "Amortization curves, investment growth, calorie targets — see your data visually, not just as numbers."],
              ["💡 Smart Insights", "Automatic contextual tips: 'Your interest-to-principal ratio is high — consider a shorter tenure' or 'Step-up SIP adds ₹8L more than regular SIP'."],
              ["📋 Step-by-Step Breakdowns", "Every calculation can be expanded to show the exact formula and each step, so you learn while you calculate."],
              ["🔗 Shareable Links", "Every calculation result is shareable via URL. Send a pre-filled EMI calculator link to a friend or save it for later."],
              ["📤 Export Results", "Download any calculation as PDF or CSV for your records or to share with a professional."],
              ["🌍 Multi-Currency", "Auto-detects your region and currency. All financial calculators adapt their formatting and local tax rules accordingly."],
            ].map(([title, desc]) => (
              <div key={title} style={{ display:"flex", gap:14, padding:"12px 16px", background:"var(--surf2)", borderRadius:"var(--r-lg)", border:"1px solid var(--bord2)" }}>
                <div style={{ fontSize:20, flexShrink:0, marginTop:2 }}>{title.split(" ")[0]}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:"var(--text)", marginBottom:3 }}>{title.split(" ").slice(1).join(" ")}</div>
                  <div style={{ fontSize:13, color:"var(--text2)", lineHeight:1.6 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ CALCULATORS WE OFFER ═══════════════════════════════════ */}
        <div className="content-card">
          <h2>Calculators We Offer</h2>
          <p>
            {CALC_COUNT_LABEL} calculators across {CATEGORIES.length} categories — all free, all with real-time updates, charts, and smart insights.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(140px,1fr))", gap:10, marginTop:16 }}>
            {CATEGORIES.map(cat => (
              <Link key={cat.id} href={`/category/${cat.id}`}
                style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, padding:"16px 10px", background:cat.bg, border:`1px solid ${cat.color}30`, borderRadius:"var(--r-lg)", textDecoration:"none", transition:"all .15s" }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="var(--sh3)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>
                <span style={{ fontSize:24 }}>{cat.icon}</span>
                <span style={{ fontSize:12, fontWeight:700, color:cat.color, textAlign:"center" }}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ═══ TECHNOLOGY ════════════════════════════════════════════ */}
        <div className="content-card">
          <h2>Built With Modern Technology</h2>
          <p>
            Calculators Point is built with a modern, performance-first tech stack. All calculations happen entirely 
            in your browser — no server calls, no latency, no privacy concerns.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(130px,1fr))", gap:10, marginTop:16 }}>
            {TECH.map(t => (
              <div key={t.name} style={{ textAlign:"center", padding:"16px 10px", background:"var(--surf2)", border:"1px solid var(--bord2)", borderRadius:"var(--r-lg)" }}>
                <div style={{ fontSize:24, marginBottom:6 }}>{t.icon}</div>
                <div style={{ fontSize:13, fontWeight:700, color:"var(--text)" }}>{t.name}</div>
                <div style={{ fontSize:11, color:"var(--text3)", marginTop:2 }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ ACCURACY COMMITMENT ════════════════════════════════════ */}
        <div className="content-card" style={{ borderLeft:`4px solid var(--brand)` }}>
          <h2>Our Commitment to Accuracy</h2>
          <p>
            Every calculator on Calculators Point uses formulas verified against academic and professional sources:
          </p>
          <ul style={{ paddingLeft:20, marginTop:10, display:"flex", flexDirection:"column", gap:8 }}>
            {[
              "EMI — standard reducing balance method (P × r × (1+r)ⁿ / ((1+r)ⁿ−1))",
              "BMI — WHO standard (kg/m²) with WHO risk classifications",
              "BMR — Mifflin-St Jeor (1990) and Harris-Benedict equations",
              "Body Fat — US Navy tape measurement method",
              "Pregnancy — Naegele's Rule (LMP + 280 days)",
              "Tax — Pakistan FBR official slabs for 2024-25",
              "SIP — standard future value of annuity formula with XIRR",
              "GPA — standard 4.0 scale weighted average",
              "CGPA — HEC Pakistan × 10, VTU, Anna University formulas",
            ].map(item => (
              <li key={item} style={{ fontSize:13, color:"var(--text2)", lineHeight:1.6 }}>
                <strong style={{ color:"var(--text)" }}>{item.split("—")[0]}</strong> — {item.split("—")[1]}
              </li>
            ))}
          </ul>
          <p style={{ marginTop:14, padding:"10px 14px", background:"var(--amber-l)", borderRadius:"var(--r-md)", fontSize:13, color:"var(--amber)", border:"1px solid #fde68a" }}>
            ⚠️ <strong>Disclaimer:</strong> Results are for informational and educational purposes only. 
            Always verify important financial, health, or legal decisions with a qualified professional.
          </p>
        </div>

        {/* ═══ CTA ════════════════════════════════════════════════════ */}
        <div style={{ textAlign:"center", padding:"40px 24px", background:"linear-gradient(135deg,var(--brand),var(--brand-d))", borderRadius:"var(--r-2xl)", boxShadow:"var(--sh-brand)" }}>
          <div style={{ fontSize:36, marginBottom:12 }}>🚀</div>
          <h3 style={{ fontFamily:"var(--font-hd)", fontSize:"1.4rem", fontWeight:900, color:"#fff", marginBottom:8, letterSpacing:"-.03em" }}>Ready to Calculate?</h3>
          <p style={{ fontSize:14, color:"rgba(255,255,255,.65)", marginBottom:20 }}>
            {CALC_COUNT_LABEL} free tools waiting for you. No signup, no credit card.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/calculators" className="btn-ghost">Browse All Calculators</Link>
            <Link href="/contact" style={{ padding:"10px 20px", borderRadius:"var(--r-lg)", background:"rgba(255,255,255,.15)", color:"#fff", fontWeight:600, fontSize:14, textDecoration:"none", border:"1px solid rgba(255,255,255,.2)" }}>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
