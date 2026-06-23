'use client';
import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BarChart2, Zap, BookOpen, TrendingUp, Star } from "lucide-react";
import { CATEGORIES, BY_CATEGORY, POPULAR, ALL_CALCULATORS } from "@/data/calculatorConfigs";

/**
 * IDs that have a real /ecosystem/[id] page built.
 * Add to this list whenever a new EcosystemHub page is created.
 * If an ID is NOT here the category button falls back to /category/[catId].
 */
const VALID_ECOSYSTEM_IDS = new Set(["finance", "fitness", "education"]);

/** Returns the safest href for an ecosystem button. */
function ecosystemHref(ecosystemId, categoryId) {
  return VALID_ECOSYSTEM_IDS.has(ecosystemId)
    ? `/ecosystem/${ecosystemId}`
    : `/category/${categoryId}`;
}

/* ─── Per-category rich content ─────────────────────────── */
const CAT_CONTENT = {
  finance: {
    heroBg: "linear-gradient(150deg, #0a0e25 0%, #1a2554 50%, #2f4cb5 100%)",
    intro: "Whether you're planning a home loan, growing your savings through SIP, or understanding your tax liability — our finance calculators are designed to give you complete clarity on your money.",
    bodyIntro: `Whether you're comparing home loan offers from two different banks, planning your SIP investment for retirement at 60, or trying to understand why your credit card debt isn't going down despite monthly payments — these finance calculators give you the exact answer in seconds.

Start with the EMI Calculator if you have any active or upcoming loan — it shows your full amortization schedule and the true cost of borrowing. Use the Compound Interest Calculator to see how your savings grow over time, or the SIP Calculator to plan a mutual fund investment with realistic return projections.

Unlike generic calculators, every tool here uses the same reducing-balance and compound-interest formulas that banks and financial institutions actually use. The tax calculator auto-detects your country and applies the correct GST, VAT, or Sales Tax rules. All charts are interactive — drag the sliders and watch every number update instantly, so you can compare scenarios without typing the same values repeatedly. No ads interrupting your calculation, no mandatory sign-up, and your data never leaves your browser.`,
    ecosystemId: "finance",
    ecosystemLabel: "Open Finance Suite →",
    features: [
      { icon: "🏦", title: "Loan & EMI Tools", desc: "Calculate monthly installments, amortization schedules, and prepayment impact instantly." },
      { icon: "📈", title: "Investment Growth", desc: "SIP, compound interest, PPF — visualize your wealth building over time with interactive charts." },
      { icon: "🧾", title: "Tax & GST", desc: "Region-aware tax calculations. Auto-detects your country and applies correct GST/VAT/Sales Tax rules." },
      { icon: "💼", title: "Income & Salary", desc: "Monthly, annual, hourly conversion with local tax deductions and net take-home pay." },
    ],
    seoContent: `Finance calculators are among the most searched tools online. Our suite covers everything from simple EMI calculations to complex retirement planning, all with region-aware currency support for 50+ countries including India (INR/GST), Pakistan (PKR/GST), USA (USD/Sales Tax), UK (GBP/VAT), and more.`,
  },
  health: {
    heroBg: "linear-gradient(150deg, #0a0e25 0%, #1a1230 50%, #8b1a4a 100%)",
    intro: "Your health deserves precision. Our health and fitness calculators use medically validated formulas to help you understand your body, plan your nutrition, and achieve your fitness goals.",
    bodyIntro: `Whether you're a gym-goer tracking body fat percentage, a runner calculating your optimal heart rate training zones, or someone who just wants to know their healthy weight range before a doctor's appointment — these health calculators use the same clinically validated formulas that healthcare professionals rely on.

Start with the BMI Calculator for a quick health screening, or go deeper with the Body Fat Calculator (Navy circumference method) if you want to separate fat mass from muscle. The Calorie & TDEE Calculator is the right starting point for any weight loss or muscle gain plan — it calculates your exact daily calorie needs based on your activity level.

Every formula is sourced from peer-reviewed medical research: Mifflin-St Jeor for BMR (the most accurate equation for non-athletes), WHO-adjusted thresholds for South and East Asian BMI classification, and the Karvonen method for heart rate zones. The women's health tools — period tracker, ovulation calculator, and fertility window predictor — run entirely offline. Not one byte of your health data is ever transmitted to any server.`,
    ecosystemId: "fitness",
    ecosystemLabel: "Open Fitness Suite →",
    features: [
      { icon: "⚖️", title: "Body Composition", desc: "BMI, body fat %, and ideal weight using 4 clinical formulas — see where you truly stand." },
      { icon: "🔥", title: "Calorie & Nutrition", desc: "TDEE, BMR, macros — complete nutrition planning for any goal from weight loss to muscle gain." },
      { icon: "❤️", title: "Heart & Training", desc: "5 heart rate training zones using the Karvonen formula for optimal cardio and fat burning." },
      { icon: "🌸", title: "Women's Health", desc: "Period tracking, ovulation prediction, and fertile window — 100% private, runs offline." },
    ],
    seoContent: `Health calculators require medical-grade accuracy. All our formulas are based on peer-reviewed research including Mifflin-St Jeor for BMR, WHO guidelines for BMI classification, and the US Navy method for body fat percentage.`,
  },
  math: {
    heroBg: "linear-gradient(150deg, #0a0e25 0%, #160e3a 50%, #4c2a8a 100%)",
    intro: "From quick percentage calculations to solving quadratic equations — our math tools provide step-by-step solutions with visual graphs, making complex calculations understandable for everyone.",
    bodyIntro: `Whether you're a student checking your homework, a teacher preparing examples, an engineer verifying a quick calculation, or a business analyst working with percentages — these math tools are built to handle everything from the trivially simple to the genuinely complex.

Start with the Percentage Calculator if you need to find X% of a number, calculate what percentage one number is of another, or work out a percentage increase or decrease — it solves all six common percentage problems simultaneously. The Scientific Calculator handles full mathematical expressions including trigonometry, logarithms, and exponent operations with a running history of your calculations.

What makes these implementations stand out: the Percentage Calculator shows all six calculation modes at once rather than forcing you to select a mode first. The Statistics Calculator produces a complete analysis — mean, median, mode, standard deviation, IQR, and quartile distribution — from a pasted list of numbers in under a second. Every algebraic calculator shows the step-by-step working, not just the final answer — which makes them genuinely useful for students learning the underlying method.`,
    ecosystemId: null,
    ecosystemLabel: null,
    features: [
      { icon: "💯", title: "Percentage Tools", desc: "6 simultaneous modes: X% of Y, what %, increase, decrease, change, and reverse." },
      { icon: "🔬", title: "Scientific Calculator", desc: "Full expression parser with trig, logarithms, exponents, and calculation history." },
      { icon: "📌", title: "Algebra & Geometry", desc: "Quadratic formula, Pythagorean theorem, area calculator with visual diagrams." },
      { icon: "📉", title: "Statistics", desc: "Mean, median, mode, standard deviation, IQR, quartiles, and histogram visualization." },
    ],
    seoContent: `Math calculators serve students, teachers, engineers, and professionals. Our percentage calculator alone handles 6 simultaneous calculation modes — far beyond what Calculator.net offers.`,
  },
  education: {
    heroBg: "linear-gradient(150deg, #0a0e25 0%, #1a1510 50%, #7a3010 100%)",
    intro: "From calculating your current semester GPA to planning what you need on your final exam — our education tools are designed to help students at every stage of their academic journey.",
    bodyIntro: `Whether you're a university student trying to figure out if you can afford to miss another class, a high school senior calculating what IELTS band score you need for your target university, or a graduate student simulating how a retaken exam will affect your cumulative GPA — these tools give you the precise academic answer without guesswork.

Start with the GPA Calculator if you're tracking your academic standing — it calculates your current GPA, lets you simulate future courses, and shows exactly what grades you need across remaining subjects to reach your target. The Attendance Calculator is indispensable at universities with an 85% or 75% minimum attendance rule: enter your total classes and absences and it tells you how many more you can miss before you're barred from exams.

The IELTS Band Calculator uses the official IELTS rounding rules to produce the same score that appears on your real result — most online tools get this wrong by using simple averages. The ACT and SAT score calculators show your percentile ranking and map your score to university admission chances, giving you a realistic picture before you apply.`,
    ecosystemId: "education",
    ecosystemLabel: "Open Education Suite →",
    features: [
      { icon: "📚", title: "GPA Planning", desc: "Calculate current GPA, simulate future semesters, and see exactly what it takes to hit Dean's List." },
      { icon: "📅", title: "Attendance Tracker", desc: "Know exactly how many classes you can miss while staying above your university's minimum threshold." },
      { icon: "🌍", title: "International Exams", desc: "IELTS band calculator and SAT score predictor with university eligibility comparison." },
      { icon: "⏱️", title: "Study Productivity", desc: "Pomodoro study timer with streak tracking and focus analytics to optimize your sessions." },
    ],
    seoContent: `Education calculators are used by millions of students worldwide. Our GPA calculator supports all major grading scales, while our IELTS calculator uses official rounding rules for precise band score prediction.`,
  },
  converters: {
    heroBg: "linear-gradient(150deg, #0a0e25 0%, #0a2820 50%, #065f46 100%)",
    intro: "Instant unit conversion across all common measurement systems. All converters update in real-time — type in any field and all others update instantly.",
    bodyIntro: `Whether you're a student converting between metric and imperial for a physics assignment, an engineer checking tolerance specs across measurement systems, a chef scaling a recipe between grams and ounces, or a traveler quickly converting kilometres to miles — these converters handle every common unit system with real-time bidirectional updates.

Start with the Length Converter for the most common need: centimetres to inches, metres to feet, or kilometres to miles. The Temperature Converter is the fastest way to check Celsius vs Fahrenheit — type in either field and the other updates immediately. The Weight Converter is essential for fitness and nutrition use cases where recipes and nutrition labels mix metric and imperial units.

What makes these converters different from a basic Google unit search: every field updates simultaneously as you type, so you can see all equivalent values at once rather than one at a time. The Data Storage Converter correctly handles both binary units (GiB, MiB — used by operating systems) and decimal units (GB, MB — used by storage manufacturers), which are different values that most basic converters conflate. All conversions happen locally with no round-trips to any server.`,
    ecosystemId: null,
    ecosystemLabel: null,
    features: [
      { icon: "📏", title: "Length & Distance", desc: "9 units from millimeters to nautical miles, with both metric and imperial coverage." },
      { icon: "⚖️", title: "Weight & Mass", desc: "8 units including stone, carat, and tonne — all converting simultaneously." },
      { icon: "🌡️", title: "Temperature", desc: "Bidirectional Celsius/Fahrenheit/Kelvin — type any field, all update instantly." },
      { icon: "💾", title: "Data Storage", desc: "Bytes to Petabytes with precise binary and decimal unit support." },
    ],
    seoContent: `Unit converters are the most frequently searched tools on the internet. Our converters are bidirectional and real-time — every field updates simultaneously as you type.`,
  },
  everyday: {
    heroBg: "linear-gradient(150deg, #0a0e25 0%, #1a1200 50%, #7a4210 100%)",
    intro: "The everyday tools you need, built with precision. Age calculation, date differences, fuel costs, password generation — all fast, free, and private.",
    bodyIntro: `Whether you need to know your exact age in days for a legal document, calculate how many working days are left before a project deadline, figure out the fuel cost for an upcoming road trip, or generate a strong password that won't get cracked — these everyday tools solve practical daily problems with more precision and detail than a simple Google search can.

Start with the Age Calculator if you've ever needed your exact age in years, months, and days — it also shows your zodiac sign, next birthday countdown, and how many days you've been alive. The Date Difference Calculator handles the surprisingly tricky problem of counting business days between two dates, accounting for weekends (and optionally public holidays). The Fuel Cost Calculator is essential for road trips — split costs among passengers and compare petrol vs diesel vs EV running costs.

The Password Generator uses cryptographically secure random generation (window.crypto.getRandomValues) — not the weak Math.random() that most simple password tools use — and shows an entropy score and estimated crack time for the generated password. All tools run entirely in your browser; no data is stored, logged, or transmitted anywhere.`,
    ecosystemId: null,
    ecosystemLabel: null,
    features: [
      { icon: "🎂", title: "Date & Age Tools", desc: "Exact age with zodiac sign, date differences with business-day mode, and live countdowns." },
      { icon: "⛽", title: "Travel & Transport", desc: "Fuel cost calculator with trip splitting, plus EV charging time and cost estimator." },
      { icon: "🔐", title: "Security Tools", desc: "Cryptographically secure password generator with entropy score and crack time estimate." },
      { icon: "📝", title: "Text & Data Tools", desc: "Word counter, Base64 encoder/decoder, Roman numeral converter and more." },
    ],
    seoContent: `Everyday calculators serve a wide range of daily needs. Our age calculator goes beyond simple birth date math — it shows zodiac sign, exact days/hours/minutes alive, and a live countdown to your next birthday.`,
  },
  business: {
    heroBg: "linear-gradient(150deg, #0a0e25 0%, #0a1f0a 50%, #14532d 100%)",
    intro: "From pricing your products to calculating break-even points — our business calculators help entrepreneurs, freelancers, and managers make smarter financial decisions.",
    bodyIntro: `Whether you're a freelancer setting your hourly rate, a small business owner calculating the break-even units for a new product, an e-commerce seller figuring out the maximum discount you can offer without going below your target margin, or a startup founder modeling customer lifetime value — these business calculators replace hours of spreadsheet work with instant answers.

Start with the Profit Margin Calculator if you sell any product or service — it shows the difference between margin and markup (a distinction that trips up even experienced business owners) and lets you reverse-calculate the selling price needed to hit a target margin. The Break-Even Calculator shows exactly how many units you must sell before profitability — with a visual chart mapping revenue vs cost curves.

What sets these tools apart: the Discount Calculator correctly handles stacked discounts (30% off + 20% off ≠ 50% off) and shows how tax interacts with discounted prices. The Customer Lifetime Value calculator uses a cohort-based model rather than a simple average, giving a more realistic CLV for businesses with churn. Every result includes a plain-language explanation of what the number means for your specific business context.`,
    ecosystemId: null,
    ecosystemLabel: null,
    features: [
      { icon: "💰", title: "Pricing & Margins", desc: "Profit margin, markup, break-even — know your numbers before you set a price." },
      { icon: "📊", title: "Business Analytics", desc: "ROI, CLV, inventory turnover — the metrics that actually predict business health." },
      { icon: "🧾", title: "Tax & Invoicing", desc: "GST, VAT, and sales tax calculations with reverse-tax extraction." },
      { icon: "⏱️", title: "Productivity & HR", desc: "Hourly rate calculator, overtime pay, and time-billing tools for freelancers." },
    ],
    seoContent: `Business calculators are used daily by entrepreneurs, accountants, and managers worldwide. Our suite covers the complete financial lifecycle of a small business — from pricing and margins through to customer retention analytics.`,
  },
  construction: {
    heroBg: "linear-gradient(150deg, #0a0e25 0%, #1a1000 50%, #92400e 100%)",
    intro: "Accurate construction calculators for concrete, flooring, roofing, paint, and more — built for contractors, engineers, and confident DIY homeowners.",
    bodyIntro: `Whether you're a contractor estimating concrete for a slab foundation, a homeowner calculating how many tiles to order for a bathroom renovation, a roofer working out shingle quantities for a new build, or a painter estimating paint coverage for a commercial project — these construction calculators give you accurate material quantities with the waste factor already built in, so you order right the first time.

Start with the Concrete Calculator for any slab, column, or footing pour — it calculates volume in cubic metres and cubic yards, adds the recommended 10% waste factor, and estimates bags of premix concrete needed. The Flooring Calculator handles all tile shapes (square, rectangular, hexagonal, herringbone pattern) and adds pattern-specific waste factors automatically.

What makes these tools more useful than a basic area calculator: every result includes a material list with quantities, a cost estimate field where you enter your local price per unit, and a total project cost. The Roof Pitch Calculator outputs both the pitch ratio and the angle in degrees, which is what most roofing material spec sheets require. All calculators use both metric and imperial units — switch between the two without re-entering your measurements.`,
    ecosystemId: null,
    ecosystemLabel: null,
    features: [
      { icon: "🏗️", title: "Concrete & Masonry", desc: "Concrete volume, mix ratios, and bag count for slabs, columns, and footings." },
      { icon: "🪵", title: "Flooring & Tiling", desc: "Area, waste factor, and material cost for all tile shapes and patterns." },
      { icon: "🏠", title: "Roofing", desc: "Shingle quantity, roof pitch, and rafter length calculations." },
      { icon: "🎨", title: "Paint & Finishing", desc: "Paint coverage calculator with primer, undercoat, and top-coat layers." },
    ],
    seoContent: `Construction calculators are used by professionals and DIY homeowners for material estimation. Our suite covers concrete, flooring, roofing, and paint — all with built-in waste factors and dual metric/imperial support.`,
  },
  technology: {
    heroBg: "linear-gradient(150deg, #0a0e25 0%, #0a1020 50%, #0c4a6e 100%)",
    intro: "Developer and tech tools for binary conversion, bandwidth calculation, IP subnetting, and more — precise, fast, and no-nonsense.",
    bodyIntro: `Whether you're a developer debugging a binary data format, a network engineer subnetting a CIDR block, a sysadmin calculating how long a file transfer will take over a given bandwidth, or a computer science student converting between number bases for an assignment — these technology calculators handle the precision tasks that generic online tools get wrong.

Start with the Number Base Converter if you work with binary, hexadecimal, or octal — it converts between all four bases simultaneously and handles both unsigned integers and signed two's complement representation. The IP Subnet Calculator takes any IP address and CIDR notation and returns the network address, broadcast address, usable host range, and subnet mask — essential for network configuration.

What differentiates these tools: the Bandwidth Calculator correctly distinguishes between megabits per second (network speed) and megabytes per second (file size transfer rate) — the source of the most common confusion in data transfer estimation. The Binary Converter shows the step-by-step positional calculation, making it genuinely educational for students learning digital systems. All tools operate entirely client-side — no data is sent to any server, which matters when working with sensitive network configurations.`,
    ecosystemId: null,
    ecosystemLabel: null,
    features: [
      { icon: "🔢", title: "Number Systems", desc: "Binary, octal, decimal, hex — convert between all bases simultaneously." },
      { icon: "🌐", title: "Networking", desc: "IP subnet calculator with CIDR notation, host range, and subnet mask output." },
      { icon: "📡", title: "Bandwidth & Storage", desc: "File transfer time, bandwidth needs, and data storage cost estimators." },
      { icon: "⚙️", title: "Developer Utilities", desc: "Hash generators, Base64 encoder/decoder, color code converter." },
    ],
    seoContent: `Technology calculators serve developers, network engineers, and CS students. Our tools are precision-built for technical use cases — correct unit handling, step-by-step working, and full offline operation.`,
  },
};

function FeatureCard({ icon, title, desc }) {
  return (
    <div style={{
      padding: 16, background: "var(--surface)", border: "1.5px solid var(--border)",
      borderRadius: "var(--r-xl)", display: "flex", gap: 12, alignItems: "flex-start",
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: "var(--r-md)", background: "var(--surf2)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>{desc}</div>
      </div>
    </div>
  );
}

export default function Category() {
  const { catId } = useParams();
  const cat = CATEGORIES.find(c => c.id === catId);
  const calcs = BY_CATEGORY[catId] || [];
  const content = CAT_CONTENT[catId] || {};

  if (!cat) { redirect('/calculators'); return null; }

  const [sortMode, setSortMode] = useState('default'); // 'default' | 'az' | 'new'
  const [filterQ,  setFilterQ]  = useState('');

  // Filter + sort the full calc list
  const sortedCalcs = useMemo(() => {
    let list = filterQ.trim()
      ? calcs.filter(c =>
          c.name.toLowerCase().includes(filterQ.toLowerCase()) ||
          (c.desc || '').toLowerCase().includes(filterQ.toLowerCase())
        )
      : [...calcs];
    if (sortMode === 'az')  list = list.slice().sort((a, b) => a.name.localeCompare(b.name));
    if (sortMode === 'new') list = list.slice().sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    return list;
  }, [calcs, sortMode, filterQ]);

  const popular  = sortMode === 'default' && !filterQ ? calcs.filter(c => c.popular) : [];
  const newCalcs = sortMode === 'default' && !filterQ ? calcs.filter(c => c.isNew && !c.popular) : [];
  const rest     = sortMode === 'default' && !filterQ ? calcs.filter(c => !c.popular && !c.isNew) : sortedCalcs;

  const CalcCard = ({ c, badge }) => (
    <Link
      href={`/calculator/${c.slug}`}
      className="cat-calc-card"
      style={{
        borderColor: 'var(--border)',
        borderRadius: 16,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: 'var(--surface)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'all 0.18s cubic-bezier(0.4,0,0.2,1)',
        textDecoration: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = cat.color;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 8px 24px ${cat.color}25`;
        e.currentTarget.style.background = cat.bg;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
        e.currentTarget.style.background = 'var(--surface)';
      }}
    >
      {/* Icon bubble */}
      <div style={{
        width: 48, height: 48, borderRadius: 14, flexShrink: 0,
        background: `linear-gradient(135deg, ${cat.color}18, ${cat.color}30)`,
        border: `1.5px solid ${cat.color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22,
      }}>
        {c.icon || '🧮'}
      </div>
      {/* Text content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'nowrap', overflow: 'hidden' }}>
          <span style={{
            fontSize: 13, fontWeight: 700, color: 'var(--text)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
          }}>{c.name}</span>
          {badge === 'popular' && <span className="badge badge-green" style={{ flexShrink: 0, fontSize: 10 }}>Popular</span>}
          {badge === 'new' && <span className="badge badge-red" style={{ flexShrink: 0, fontSize: 10 }}>New</span>}
          {c.hasChart && <span className="badge badge-blue" style={{ flexShrink: 0, fontSize: 10 }}>📊</span>}
        </div>
        <div style={{
          fontSize: 11.5, color: 'var(--text3)', lineHeight: 1.45,
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>{c.desc}</div>
      </div>
      {/* Arrow */}
      <ArrowRight size={15} style={{ color: cat.color, flexShrink: 0, opacity: 0.6 }} />
    </Link>
  );

  return (
    <>
      {/* SEO metadata handled by generateMetadata in app/category/[catId]/page.tsx */}

      {/* Hero */}
      <div style={{ background: content.heroBg || `linear-gradient(135deg, #0f172a, ${cat.color})`, padding: "48px 20px 44px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 50% 70% at 90% 0%, rgba(255,255,255,.05) 0%, transparent 60%)" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <nav style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 12, color: "rgba(255,255,255,.5)", marginBottom: 16 }}>
            <Link href="/" style={{ color: "rgba(255,255,255,.5)" }}>Home</Link>
            <span>/</span>
            <Link href="/calculators" style={{ color: "rgba(255,255,255,.5)" }}>Calculators</Link>
            <span>/</span>
            <span style={{ color: "rgba(255,255,255,.9)", fontWeight: 600 }}>{cat.name}</span>
          </nav>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "var(--r-xl)", flexShrink: 0,
              background: "rgba(255,255,255,.12)", border: "1.5px solid rgba(255,255,255,.2)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30,
            }}>{cat.icon}</div>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px",
                background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.15)",
                borderRadius: 100, fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.7)",
                marginBottom: 12,
              }}>
                <Zap size={11} /> {calcs.length} Free Tools · Instant Results
              </div>
              {/* W3 fix: H1 includes count for stronger keyword intent signal */}
              <h1 style={{
                fontFamily: "var(--font-hd)", fontSize: "clamp(1.6rem,4vw,2.4rem)",
                fontWeight: 900, color: "#fff", letterSpacing: "-.03em", marginBottom: 10,
              }}>
                {calcs.length}+ Free {cat.name} Calculators Online
              </h1>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,.65)", lineHeight: 1.7, maxWidth: 580, marginBottom: 20 }}>
                {content.intro || cat.desc}
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {content.ecosystemId && (
                  <Link href={ecosystemHref(content.ecosystemId, catId)} className="btn-ghost" style={{ fontSize: 13 }}>
                    <TrendingUp size={14} /> {content.ecosystemLabel}
                  </Link>
                )}
                <Link href="/calculators" style={{
                  display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px",
                  background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)",
                  borderRadius: "var(--r-lg)", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.8)",
                }}>All Categories</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="cat-stats-row">
        {[
          { n: calcs.length + "+", l: "Tools" },
          { n: popular.length, l: "Popular" },
          { n: newCalcs.length, l: "New" },
          { n: "100%", l: "Free" },
        ].map(s => (
          <div key={s.l} className="cat-stats-item" style={{ flex: 1, padding: "12px 8px", textAlign: "center", borderRight: "1px solid var(--border)", minWidth: 0 }}>
            <div className="cat-stats-val" style={{ fontFamily: "var(--font-hd)", fontSize: 18, fontWeight: 800, color: cat.color }}>{s.n}</div>
            <div className="cat-stats-lbl" style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* ── Category intro — 200-word SEO prose block ── */}
      {/* Rendered above the calculator grid, below H1 + stats strip.          */}
      {/* Paragraphs split on \n\n so the text stays readable in the data file. */}
      {content.bodyIntro && (
        <div style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
          <article
            style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px 24px" }}
            aria-label={`About ${cat.name} calculators`}
          >
            <h2 style={{
              fontSize: "1rem", fontWeight: 800, color: "var(--text)",
              marginBottom: 12, display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 26, height: 26, borderRadius: 8, fontSize: 14,
                background: `${cat.color}18`, border: `1.5px solid ${cat.color}30`,
              }}>{cat.icon}</span>
              About {cat.name} Calculators
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {content.bodyIntro.split("\n\n").map((para, i) => (
                <p key={i} style={{
                  fontSize: 14, color: "var(--text2)", lineHeight: 1.85,
                  margin: 0, maxWidth: 780,
                }}>
                  {para}
                </p>
              ))}
            </div>
          </article>
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px 64px" }}>
        <div className="category-page-layout">
          {/* Main content */}
          <div>
            {/* Filter + Sort bar — #23 fix */}
            <div style={{
              display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap',
              marginBottom: 20, padding: '12px 14px',
              background: 'var(--surface)', border: '1.5px solid var(--border)',
              borderRadius: 14,
            }}>
              {/* Search within category */}
              <div style={{ flex: '1 1 180px', display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <span style={{ fontSize: 14, opacity: 0.5 }}>🔍</span>
                <input
                  value={filterQ}
                  onChange={e => setFilterQ(e.target.value)}
                  placeholder={`Search ${cat.name.toLowerCase()} tools…`}
                  style={{
                    flex: 1, border: 'none', outline: 'none', background: 'transparent',
                    fontSize: 14, color: 'var(--text)', fontFamily: 'var(--font)',
                  }}
                  aria-label={`Filter ${cat.name} calculators`}
                />
                {filterQ && (
                  <button type="button" onClick={() => setFilterQ('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 16, lineHeight: 1 }} aria-label="Clear filter">×</button>
                )}
              </div>
              {/* Sort buttons */}
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {[['default','⭐ Popular'],['az','A → Z'],['new','🆕 Newest']].map(([mode, label]) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setSortMode(mode)}
                    aria-pressed={sortMode === mode}
                    style={{
                      padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                      border: '1.5px solid',
                      borderColor: sortMode === mode ? 'var(--brand)' : 'var(--border)',
                      background: sortMode === mode ? 'var(--brand-l)' : 'transparent',
                      color: sortMode === mode ? 'var(--brand)' : 'var(--text2)',
                      cursor: 'pointer', transition: 'all .15s', fontFamily: 'var(--font)',
                    }}
                  >{label}</button>
                ))}
              </div>
            </div>

            {/* No results message */}
            {filterQ && sortedCalcs.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text3)', fontSize: 14 }}>
                No {cat.name.toLowerCase()} tools match "{filterQ}".
                <button type="button" onClick={() => setFilterQ('')} style={{ marginLeft: 8, color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>Clear</button>
              </div>
            )}

            {/* Popular */}
            {popular.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <Star size={16} style={{ color: "#f59e0b" }} />
                  <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text)" }}>Most Popular</h2>
                </div>
                <div className="cat-calcs-grid">
                  {popular.map(c => (
                    <CalcCard key={c.slug} c={c} badge="popular" />
                  ))}
                </div>
              </div>
            )}

            {/* New */}
            {newCalcs.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 16 }}>🆕</span>
                  <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text)" }}>Recently Added</h2>
                </div>
                <div className="cat-calcs-grid">
                  {newCalcs.map(c => (
                    <CalcCard key={c.slug} c={c} badge="new" />
                  ))}
                </div>
              </div>
            )}

            {/* Rest */}
            {rest.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text)", marginBottom: 14 }}>All {cat.name} Tools</h2>
                <div className="cat-calcs-grid">
                  {rest.map(c => (
                    <CalcCard key={c.slug} c={c} />
                  ))}
                </div>
              </div>
            )}

            {/* Why use this category */}
            {content.features && (
              <div style={{
                background: "var(--surface)", border: "1.5px solid var(--border)",
                borderRadius: "var(--r-2xl)", padding: 24, marginBottom: 24,
              }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text)", marginBottom: 16 }}>
                  Why Our {cat.name} Tools?
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                  {content.features.map(f => <FeatureCard key={f.title} {...f} />)}
                </div>
                {content.seoContent && (
                  <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.8, marginTop: 16, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                    {content.seoContent}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {content.ecosystemId && (
              <Link href={ecosystemHref(content.ecosystemId, catId)} style={{
                display: "block", padding: 20, textDecoration: "none",
                background: `linear-gradient(135deg, ${cat.color}, ${cat.color}cc)`,
                borderRadius: "var(--r-xl)", boxShadow: `0 4px 20px ${cat.color}40`,
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{cat.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
                  {cat.name} Suite
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", marginBottom: 14, lineHeight: 1.6 }}>
                  All tools interconnected with guided journeys and educational content.
                </div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px",
                  background: "rgba(255,255,255,.2)", border: "1px solid rgba(255,255,255,.25)",
                  borderRadius: 100, fontSize: 12, fontWeight: 700, color: "#fff",
                }}>
                  Explore Suite <ArrowRight size={12} />
                </div>
              </Link>
            )}

            {/* Other categories */}
            <div style={{
              background: "var(--surface)", border: "1.5px solid var(--border)",
              borderRadius: "var(--r-xl)", overflow: "hidden",
            }}>
              <div style={{
                padding: "12px 16px", background: "var(--surf2)", borderBottom: "1px solid var(--border)",
                fontSize: 12, fontWeight: 800, color: "var(--text2)", textTransform: "uppercase", letterSpacing: ".06em",
              }}>Other Categories</div>
              {CATEGORIES.filter(c => c.id !== catId).map(c => (
                <Link href={`/category/${c.id}`} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
                  borderBottom: "1px solid var(--bord2)", textDecoration: "none", color: "var(--text)",
                  transition: "background .1s", fontSize: 13, fontWeight: 600,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--brand-l)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                  <span>{c.icon}</span> {c.name}
                  <ArrowRight size={12} style={{ marginLeft: "auto", color: "var(--text3)" }} />
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
