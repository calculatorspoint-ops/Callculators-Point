'use client';
import { useState, useEffect, useCallback, useRef } from "react";

/* ══════════════════════════════════════════════════════════════
   QUICK CALCULATOR — Professional Basic + Scientific modes
   Features: history, memory (M+/M-/MR/MC), keyboard support,
   degree/radian toggle, parentheses, all trig functions,
   mobile-optimized touch targets, smooth animations
══════════════════════════════════════════════════════════════ */

// ── Button layout configs ─────────────────────────────────────
const BASIC_ROWS = [
  [{ l:"MC",s:"mem"},{ l:"MR",s:"mem"},{ l:"M+",s:"mem"},{ l:"M−",s:"mem"}],
  [{ l:"C",s:"clr"},{ l:"±",s:"op"},{ l:"%",s:"op"},{ l:"÷",s:"op"}],
  [{ l:"7"},{ l:"8"},{ l:"9"},{ l:"×",s:"op"}],
  [{ l:"4"},{ l:"5"},{ l:"6"},{ l:"−",s:"op"}],
  [{ l:"1"},{ l:"2"},{ l:"3"},{ l:"+",s:"op"}],
  [{ l:"0",w:2},{ l:"."},{ l:"=",s:"eq"}],
];

const SCI_ROWS = [
  [{ l:"sin",s:"fn"},{ l:"cos",s:"fn"},{ l:"tan",s:"fn"},{ l:"π",s:"fn"}],
  [{ l:"asin",s:"fn"},{ l:"acos",s:"fn"},{ l:"atan",s:"fn"},{ l:"e",s:"fn"}],
  [{ l:"log",s:"fn"},{ l:"ln",s:"fn"},{ l:"√",s:"fn"},{ l:"∛",s:"fn"}],
  [{ l:"x²",s:"fn"},{ l:"x³",s:"fn"},{ l:"xʸ",s:"fn"},{ l:"1/x",s:"fn"}],
  [{ l:"(",s:"op"},{ l:")",s:"op"},{ l:"^",s:"op"},{ l:"⌫",s:"del"}],
  [{ l:"MC",s:"mem"},{ l:"MR",s:"mem"},{ l:"M+",s:"mem"},{ l:"M−",s:"mem"}],
  [{ l:"C",s:"clr"},{ l:"7"},{ l:"8"},{ l:"9"}],
  [{ l:"÷",s:"op"},{ l:"4"},{ l:"5"},{ l:"6"}],
  [{ l:"×",s:"op"},{ l:"1"},{ l:"2"},{ l:"3"}],
  [{ l:"+",s:"op"},{ l:"−",s:"op"},{ l:"0"},{ l:"."}],
  [{ l:"=",s:"eq",w:4}],
];

// ── Expression evaluator ──────────────────────────────────────
function evalExpr(expr, isDeg) {
  try {
    const toRad = isDeg ? (x) => x * Math.PI / 180 : (x) => x;
    const safe = expr
      .replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-")
      .replace(/π/g, String(Math.PI))
      .replace(/\be\b/g, String(Math.E))
      .replace(/sin\(/g,  isDeg ? `(x=>Math.sin(x*${Math.PI}/180))(` : "Math.sin(")
      .replace(/cos\(/g,  isDeg ? `(x=>Math.cos(x*${Math.PI}/180))(` : "Math.cos(")
      .replace(/tan\(/g,  isDeg ? `(x=>Math.tan(x*${Math.PI}/180))(` : "Math.tan(")
      .replace(/asin\(/g, isDeg ? `(x=>Math.asin(x)*180/${Math.PI})(` : "Math.asin(")
      .replace(/acos\(/g, isDeg ? `(x=>Math.acos(x)*180/${Math.PI})(` : "Math.acos(")
      .replace(/atan\(/g, isDeg ? `(x=>Math.atan(x)*180/${Math.PI})(` : "Math.atan(")
      .replace(/log\(/g, "Math.log10(")
      .replace(/ln\(/g,  "Math.log(")
      .replace(/√\(/g,   "Math.sqrt(")
      .replace(/∛\(/g,   "(x=>Math.cbrt(x))(");
    const result = Function('"use strict";return(' + safe + ')')();
    if (!isFinite(result)) return "Error";
    // Clean up floating point noise
    const rounded = parseFloat(result.toPrecision(12));
    return rounded.toString();
  } catch { return "Error"; }
}

export function QuickCalc() {
  const [mode,      setMode]      = useState("basic");
  const [display,   setDisplay]   = useState("0");
  const [expr,      setExpr]      = useState("");
  const [hist,      setHist]      = useState([]);
  const [fresh,     setFresh]     = useState(true);
  const [showHist,  setShowHist]  = useState(false);
  const [memory,    setMemory]    = useState(0);
  const [isDeg,     setIsDeg]     = useState(true);
  const [hasMemory, setHasMemory] = useState(false);
  const [justCalc,  setJustCalc]  = useState(false);
  const containerRef = useRef(null);

  const press = useCallback((label) => {
    // ── Clear ──────────────────────────────────────────────────
    if (label === "C") {
      setDisplay("0"); setExpr(""); setFresh(true); setJustCalc(false); return;
    }
    // ── Delete ─────────────────────────────────────────────────
    if (label === "⌫") {
      setDisplay(d => d.length > 1 ? d.slice(0, -1) : "0");
      setFresh(false); setJustCalc(false); return;
    }
    // ── Memory ops ─────────────────────────────────────────────
    if (label === "MC") { setMemory(0); setHasMemory(false); return; }
    if (label === "MR") { setDisplay(String(memory)); setFresh(true); return; }
    if (label === "M+") { const v = parseFloat(display); if (!isNaN(v)) { setMemory(m => { setHasMemory(true); return m + v; }); } return; }
    if (label === "M−") { const v = parseFloat(display); if (!isNaN(v)) { setMemory(m => { setHasMemory(true); return m - v; }); } return; }
    // ── Equals ────────────────────────────────────────────────
    if (label === "=") {
      const full = expr + display;
      const result = evalExpr(full, isDeg);
      if (result !== "Error") {
        setHist(h => [{ expr: full, result }, ...h].slice(0, 20));
      }
      setDisplay(result); setExpr(""); setFresh(true); setJustCalc(true); return;
    }
    // ── Sign toggle ───────────────────────────────────────────
    if (label === "±") {
      setDisplay(d => d.startsWith("-") ? d.slice(1) : d === "0" ? "0" : "-" + d); return;
    }
    // ── Constants ─────────────────────────────────────────────
    if (label === "π") { setDisplay(String(Math.PI.toPrecision(10))); setFresh(true); return; }
    if (label === "e") { setDisplay(String(Math.E.toPrecision(10)));  setFresh(true); return; }
    // ── Power shortcuts ───────────────────────────────────────
    if (label === "x²") {
      const result = evalExpr(display + "^2", isDeg);
      setHist(h => [{ expr: `(${display})²`, result }, ...h].slice(0, 20));
      setDisplay(result); setFresh(true); return;
    }
    if (label === "x³") {
      const result = evalExpr(display + "^3", isDeg);
      setHist(h => [{ expr: `(${display})³`, result }, ...h].slice(0, 20));
      setDisplay(result); setFresh(true); return;
    }
    if (label === "1/x") {
      const result = evalExpr("1/" + display, isDeg);
      setDisplay(result); setFresh(true); return;
    }
    if (label === "xʸ") {
      setExpr(e => e + display + "^"); setDisplay("0"); setFresh(true); return;
    }
    // ── Functions needing opening paren ───────────────────────
    const fns = ["sin","cos","tan","asin","acos","atan","log","ln","√","∛"];
    if (fns.includes(label)) {
      if (!fresh && display !== "0") setExpr(e => e + display + "*");
      setExpr(e => e + label + "(");
      setDisplay("0"); setFresh(true); return;
    }
    // ── Percentage ────────────────────────────────────────────
    if (label === "%") {
      setDisplay(d => String(parseFloat(d) / 100)); return;
    }
    // ── Operators ─────────────────────────────────────────────
    const ops = ["+","−","×","÷","^","(",")",];
    if (ops.includes(label)) {
      if (label === "(") {
        if (justCalc) { setExpr(""); setJustCalc(false); }
        setExpr(e => e + (fresh ? "" : display) + "(");
        if (!fresh) { setDisplay("0"); setFresh(true); }
        return;
      }
      if (label === ")") {
        setExpr(e => e + display + ")");
        setDisplay("0"); setFresh(true); return;
      }
      if (justCalc) {
        // Allow chaining: 9 * previous result
        setExpr(display + label);
        setDisplay("0"); setFresh(true); setJustCalc(false); return;
      }
      setExpr(e => e + display + label);
      setDisplay("0"); setFresh(true); return;
    }
    // ── Decimal point ─────────────────────────────────────────
    if (label === ".") {
      if (display.includes(".")) return;
      setDisplay(d => d + "."); setFresh(false); setJustCalc(false); return;
    }
    // ── Digit ────────────────────────────────────────────────
    setJustCalc(false);
    if (fresh || display === "0") { setDisplay(label); setFresh(false); }
    else { if (display.length < 16) setDisplay(d => d + label); }
  }, [display, expr, fresh, memory, isDeg, justCalc]);

  // ── Keyboard support (scoped by visibility) ────────────────────────────
  // INP FIX: Only register the global keydown listener when the widget is
  // actually visible in the viewport. When the user scrolls away, we remove
  // the listener — avoiding unnecessary JS execution on every keystroke.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isVisible = false;
    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0.1 }
    );
    observer.observe(container);

    const handler = (e) => {
      if (!isVisible) return;                          // ← skip when off-screen
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const map = {
        "0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9",
        ".":".","+":`+`,"-":"−","*":"×","/":"÷","%":"%","^":"^",
        "Enter":"=","=":"=","Backspace":"⌫","Escape":"C",
        "(":"(", ")":")",
        "s":"sin","c":"cos","t":"tan","l":"log","q":"√",
      };
      const action = map[e.key];
      if (action) { e.preventDefault(); press(action); }
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      observer.disconnect();
    };
  }, [press]);

  // ── Display formatting ────────────────────────────────────────
  const displayFontSize = display.length > 14 ? 14 : display.length > 10 ? 18 : display.length > 7 ? 22 : 28;

  // ── Button styles ─────────────────────────────────────────────
  const getBtnStyle = (s) => {
    const base = {
      borderRadius: 10, border: "none", cursor: "pointer",
      fontFamily: "var(--font-mono)", fontWeight: 700,
      transition: "all .1s ease", WebkitTapHighlightColor: "transparent",
      fontSize: mode === "basic" ? (s === "fn" || s === "mem" ? 11 : 15) : (s === "fn" || s === "mem" ? 10 : 14),
      padding: mode === "basic" ? "14px 4px" : "11px 4px",
      minHeight: mode === "basic" ? 48 : 40,
      display: "flex", alignItems: "center", justifyContent: "center",
    };
    if (s === "eq")  return { ...base, background: "linear-gradient(135deg,#2563EB,#1D4ED8)", color: "#fff", boxShadow: "0 4px 14px rgba(37,99,235,.45)", fontSize: 17 };
    if (s === "op")  return { ...base, background: "rgba(37,99,235,.25)", color: "#93c5fd", fontSize: mode==="basic"?15:13 };
    if (s === "fn")  return { ...base, background: "rgba(16,185,129,.18)", color: "#6ee7b7", fontSize: mode==="basic"?11:10, letterSpacing: "-.01em" };
    if (s === "mem") return { ...base, background: "rgba(245,158,11,.15)", color: "#fcd34d", fontSize: 10.5 };
    if (s === "del") return { ...base, background: "rgba(239,68,68,.22)", color: "#fca5a5" };
    if (s === "clr") return { ...base, background: "rgba(251,191,36,.22)", color: "#fde047" };
    return { ...base, background: "rgba(255,255,255,.1)", color: "rgba(255,255,255,.92)" };
  };

  const rows = mode === "basic" ? BASIC_ROWS : SCI_ROWS;

  return (
    <div
      ref={containerRef}
      className="qcalc"
      style={{
        width: "100%", maxWidth: mode === "basic" ? 300 : 310,
        borderRadius: 20, overflow: "hidden",
        background: "rgba(15,23,42,.92)",
        border: "1.5px solid rgba(255,255,255,.1)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 24px 64px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.08)",
      }}
    >
      {/* ── Header ── */}
      <div style={{ padding: "12px 12px 0" }}>

        {/* Mode + history toggle */}
        <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
          {["basic","scientific"].map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              aria-label={`${m === "basic" ? "Basic" : "Scientific"} mode${mode === m ? " (active)" : ""}`}
              style={{
                flex: 1, padding: "5px 0", borderRadius: 8, border: "none", cursor: "pointer",
                background: mode === m ? "rgba(37,99,235,.35)" : "rgba(255,255,255,.07)",
                color: mode === m ? "#93c5fd" : "rgba(255,255,255,.45)",
                fontSize: 10.5, fontWeight: 700, fontFamily: "var(--font)", letterSpacing: ".04em",
                transition: "all .15s", textTransform: "uppercase",
              }}>
              {m === "basic" ? "🔢 Basic" : "🔬 Scientific"}
            </button>
          ))}
          {/* Degree / Radian toggle (scientific only) */}
          {mode === "scientific" && (
            <button
              onClick={() => setIsDeg(d => !d)}
              aria-label={isDeg ? "Switch to radians" : "Switch to degrees"}
              aria-pressed={isDeg}
              style={{
                padding: "5px 8px", borderRadius: 8, border: "none", cursor: "pointer",
                background: "rgba(6,182,212,.2)", color: "#67e8f9",
                fontSize: 10, fontWeight: 700, fontFamily: "var(--font)",
                whiteSpace: "nowrap", transition: "all .15s",
              }}>
              {isDeg ? "DEG" : "RAD"}
            </button>
          )}
          <button
            onClick={() => setShowHist(s => !s)}
            aria-label={showHist ? "Hide calculation history" : "Show calculation history"}
            aria-expanded={showHist}
            style={{
              padding: "5px 8px", borderRadius: 8, border: "none", cursor: "pointer",
              background: showHist ? "rgba(37,99,235,.3)" : "rgba(255,255,255,.07)",
              color: showHist ? "#93c5fd" : "rgba(255,255,255,.45)",
              fontSize: 12, transition: "all .15s",
            }}>
            🕐
          </button>
        </div>

        {/* History dropdown */}
        {showHist && (
          <div style={{
            background: "rgba(0,0,0,.5)", borderRadius: 10, padding: "6px 8px",
            marginBottom: 8, maxHeight: 130, overflowY: "auto",
            border: "1px solid rgba(255,255,255,.08)",
          }}>
            {hist.length === 0 ? (
              <div style={{ textAlign: "center", padding: "12px 0", fontSize: 11, color: "rgba(255,255,255,.3)" }}>
                No history yet
              </div>
            ) : hist.map((h, i) => (
              <div key={i} onClick={() => { setDisplay(h.result); setFresh(true); setShowHist(false); }}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "4px 6px", cursor: "pointer", borderRadius: 6,
                  fontSize: 11, fontFamily: "var(--font-mono)", color: "rgba(255,255,255,.55)",
                  transition: "background .1s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.07)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "55%" }}>{h.expr}</span>
                <span style={{ color: "#60a5fa", fontWeight: 700, flexShrink: 0 }}>= {h.result}</span>
              </div>
            ))}
          </div>
        )}

        {/* Memory indicator */}
        {hasMemory && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6, padding: "3px 8px", marginBottom: 6,
            background: "rgba(245,158,11,.12)", borderRadius: 6, border: "1px solid rgba(245,158,11,.2)",
          }}>
            <span style={{ fontSize: 9, fontWeight: 800, color: "#fcd34d", letterSpacing: ".08em" }}>M</span>
            <span style={{ fontSize: 11, color: "#fcd34d", fontFamily: "var(--font-mono)" }}>{memory}</span>
          </div>
        )}

        {/* Display */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          aria-label={`Calculator display: ${expr ? expr + " " : ""}${display}`}
          style={{
            background: "rgba(0,0,0,.35)", borderRadius: 12, padding: "12px 14px",
            marginBottom: 10, border: "1px solid rgba(255,255,255,.06)", minHeight: 78,
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
          }}
        >
          <div style={{
            fontSize: 10, color: "rgba(255,255,255,.35)", fontFamily: "var(--font-mono)",
            minHeight: 14, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis",
            whiteSpace: "nowrap", textAlign: "right",
          }}>
            {expr || "\u00A0"}
          </div>
          <div style={{
            fontSize: displayFontSize, fontWeight: 800, color: display === "Error" ? "#f87171" : "rgba(255,255,255,.95)",
            fontFamily: "var(--font-mono)", textAlign: "right", letterSpacing: "-.02em",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            transition: "font-size .15s",
          }}>
            {display}
          </div>
        </div>
      </div>

      {/* ── Keyboard hint ── */}
      <div style={{ textAlign: "center", fontSize: 8.5, color: "rgba(255,255,255,.2)", letterSpacing: ".06em", marginBottom: 6, textTransform: "uppercase" }}>
        ⌨ Keyboard supported · Esc to clear
      </div>

      {/* ── Button grid ── */}
      <div style={{ padding: "0 10px 10px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 5 }}>
        {rows.flat().map((btn, i) => (
          <button
            key={i}
            onClick={() => press(btn.l)}
            style={{ ...getBtnStyle(btn.s || "num"), gridColumn: btn.w ? `span ${btn.w}` : undefined }}
            onPointerDown={e => { e.currentTarget.style.transform = "scale(.92)"; e.currentTarget.style.opacity = ".8"; }}
            onPointerUp={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.opacity = "1"; }}
            onPointerLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.opacity = "1"; }}
            aria-label={btn.l}
          >
            {btn.l}
          </button>
        ))}
      </div>
    </div>
  );
}
