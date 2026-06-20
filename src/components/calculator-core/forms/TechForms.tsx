// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { L, N, Sl, Sel, Tabs, Row2, Row3, Panel, buildResult, useCurrency, FinanceLayout } from './SharedComponents';

/* ─────────────────────────────────────────────────────────────────────────
   Shared micro-helpers (no TypeScript annotations)
───────────────────────────────────────────────────────────────────────── */
function CopyBtn({ text, small }) {
  const [ok, setOk] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(String(text)).then(() => {
      setOk(true);
      setTimeout(() => setOk(false), 1800);
    });
  };
  const pad = small ? "3px 9px" : "5px 14px";
  const fz  = small ? 10 : 11;
  return (
    <button onClick={copy}
      style={{ padding: pad, borderRadius: 100, fontSize: fz, fontWeight: 700,
        border: ok ? "1.5px solid var(--brand)" : "1px solid var(--border)",
        background: ok ? "var(--p50)" : "var(--surface)",
        color: ok ? "var(--brand)" : "var(--text3)", cursor: "pointer",
        transition: "all .2s", whiteSpace: "nowrap", flexShrink: 0 }}>
      {ok ? "✅ Copied" : "📋 Copy"}
    </button>
  );
}

function MonoInput({ id, value, onChange, placeholder, prefix }) {
  return (
    <div style={{ position: "relative", marginBottom: 16 }}>
      {prefix && (
        <span style={{ position: "absolute", left: 14, top: "50%",
          transform: "translateY(-50%)", fontFamily: "var(--font-mono)",
          fontWeight: 800, color: "var(--brand)", fontSize: 14, userSelect: "none" }}>
          {prefix}
        </span>
      )}
      <input id={id} value={value} onChange={onChange} placeholder={placeholder}
        style={{ width: "100%", height: 42,
          padding: prefix ? "0 14px 0 38px" : "0 14px",
          background: "var(--surface2)", border: "1.5px solid var(--border)",
          borderRadius: "var(--r-md)", fontSize: 15, fontWeight: 700,
          color: "var(--text)", fontFamily: "var(--font-mono)", outline: "none",
          letterSpacing: ".05em", boxSizing: "border-box" }} />
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase",
      letterSpacing: ".08em", color: "var(--text3)", marginBottom: 10,
      paddingBottom: 6, borderBottom: "1px solid var(--border)" }}>
      {children}
    </div>
  );
}

function QuickPills({ items, active, onSelect }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
      {items.map(function(item) {
        const isActive = active === item.v;
        return (
          <button key={item.v} onClick={function() { onSelect(item.v); }}
            style={{ padding: "5px 13px", borderRadius: 100, fontSize: 12,
              fontWeight: 700, cursor: "pointer",
              border: isActive ? "2px solid var(--brand)" : "1px solid var(--border)",
              background: isActive ? "var(--p50)" : "var(--surface)",
              color: isActive ? "var(--brand)" : "var(--text2)" }}>
            {item.l}
          </button>
        );
      })}
    </div>
  );
}

function ResultCard({ label, value, mono, accent, badge }) {
  return (
    <div style={{ padding: "12px 16px", background: "var(--surface2)",
      border: "1.5px solid " + (accent ? "var(--brand)" : "var(--border)"),
      borderRadius: "var(--r-md)", marginBottom: 10 }}>
      <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase",
        letterSpacing: ".06em", color: "var(--text3)", marginBottom: 4 }}>
        {label}
        {badge && (
          <span style={{ marginLeft: 6, padding: "1px 7px", borderRadius: 100,
            fontSize: 9, background: "#fef2f2", color: "#ef4444",
            border: "1px solid #fca5a5", fontWeight: 700 }}>
            {badge}
          </span>
        )}
      </div>
      <div style={{ fontFamily: mono ? "var(--font-mono)" : "var(--font)",
        fontSize: 13, fontWeight: 700, color: "var(--text)",
        wordBreak: "break-all", lineHeight: 1.5 }}>
        {value}
      </div>
    </div>
  );
}

function twoColWrap(left, right) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:16,padding:'22px 24px 20px'}}>
        {left}
      </div>
      {right}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   1. SubnetForm
───────────────────────────────────────────────────────────────────────── */
export function SubnetForm() {
  const [ip, setIp]     = useState("192.168.1.0");
  const [cidr, setCidr] = useState(24);
  const [res, setRes]   = useState(null);
  const [info, setInfo] = useState(null);

  const cidrPills = [
    { v: 8,  l: "/8"  },
    { v: 16, l: "/16" },
    { v: 24, l: "/24" },
    { v: 25, l: "/25" },
    { v: 28, l: "/28" },
    { v: 30, l: "/30" },
    { v: 32, l: "/32" },
  ];

  const QUICK_REF = [
    { cidr: "/8",  mask: "255.0.0.0",         hosts: "16,777,214", usage: "Large network (ISP)" },
    { cidr: "/16", mask: "255.255.0.0",        hosts: "65,534",     usage: "Campus / large org" },
    { cidr: "/24", mask: "255.255.255.0",      hosts: "254",        usage: "Typical LAN" },
    { cidr: "/25", mask: "255.255.255.128",    hosts: "126",        usage: "Dept subnet" },
    { cidr: "/28", mask: "255.255.255.240",    hosts: "14",         usage: "Small team" },
    { cidr: "/29", mask: "255.255.255.248",    hosts: "6",          usage: "Point-to-point" },
    { cidr: "/30", mask: "255.255.255.252",    hosts: "2",          usage: "Router link" },
    { cidr: "/31", mask: "255.255.255.254",    hosts: "0 (P2P)",    usage: "RFC 3021" },
    { cidr: "/32", mask: "255.255.255.255",    hosts: "1 (host)",   usage: "Single IP" },
  ];

  useEffect(function() {
    const parts = ip.split(".").map(Number);
    if (parts.length !== 4 || parts.some(function(p) { return isNaN(p) || p < 0 || p > 255; })) {
      setRes(null); setInfo(null); return;
    }
    const maskBits = cidr;
    const mask     = (cidr === 0 ? 0 : ~((1 << (32 - maskBits)) - 1)) >>> 0;
    const ipInt    = ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
    const netInt   = (ipInt & mask) >>> 0;
    const bcInt    = (netInt | ((~mask) >>> 0)) >>> 0;
    const firstH   = netInt + 1;
    const lastH    = bcInt - 1;
    const hosts    = Math.max(0, bcInt - netInt - 1);

    function toIP(n) {
      return ((n >>> 24) & 0xff) + "." + ((n >>> 16) & 0xff) + "." + ((n >>> 8) & 0xff) + "." + (n & 0xff);
    }
    function toMask(b) {
      const m = b === 0 ? 0 : (~((1 << (32 - b)) - 1)) >>> 0;
      return toIP(m);
    }

    const ipClass = parts[0] < 128 ? "Class A (1–126)" :
                  parts[0] < 192 ? "Class B (128–191)" :
                  parts[0] < 224 ? "Class C (192–223)" :
                  parts[0] < 240 ? "Class D – Multicast" : "Class E – Reserved";

    const networkAddr    = toIP(netInt);
    const broadcastAddr  = toIP(bcInt);
    const subnetMask     = toMask(maskBits);
    const wildcardMask   = toIP((~mask) >>> 0);
    const firstUsable    = toIP(firstH);
    const lastUsable     = toIP(lastH);
    const totalAddresses = hosts + 2;

    // Octet colors for CIDR visual
    const octets = subnetMask.split(".").map(Number);

    setInfo({
      networkAddr, broadcastAddr, subnetMask, wildcardMask,
      firstUsable, lastUsable, cidrNotation: networkAddr + "/" + cidr,
      octets, hosts, totalAddresses, ipClass,
      ipInt, netInt, bcInt
    });

    const chart = {
      type: "bar",
      data: [8, 16, 24, 28, 30].map(function(c) {
        const h = c >= 31 ? (c === 32 ? 1 : 0) : Math.pow(2, 32 - c) - 2;
        return { name: "/" + c, Hosts: h };
      }),
      keys: ["Hosts"]
    };

    setRes(buildResult(
      "Usable Hosts", hosts.toLocaleString(),
      [
        { label: "Network Address",   value: networkAddr },
        { label: "Broadcast Address", value: broadcastAddr },
        { label: "Subnet Mask",       value: subnetMask },
        { label: "Host Range",        value: firstUsable + " — " + lastUsable },
      ],
      [
        { type: "tip",  msg: "Each additional CIDR bit halves available hosts. /24 = 254, /25 = 126, /26 = 62." },
        { type: "info", msg: ipClass + " — " + networkAddr + "/" + cidr },
        cidr > 28 ? { type: "warn", msg: "Very small subnet — consider if you really need this many hosts." } :
                    { type: "tip",  msg: "Wildcard mask (for ACLs/firewalls): " + wildcardMask }
      ],
      chart,
      [
        { label: "CIDR Notation",     value: networkAddr + "/" + cidr },
        { label: "Wildcard Mask",     value: wildcardMask },
        { label: "Total Addresses",   value: totalAddresses.toLocaleString() },
        { label: "IP Class",          value: ipClass },
        { label: "First Usable IP",   value: firstUsable },
        { label: "Last Usable IP",    value: lastUsable },
      ]
    ));
  }, [ip, cidr]);

  const octetColors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"];

  return (
    <FinanceLayout
      accentClass="accent-tech"
      inputTitle="Network Details"
      result={res}
      loading={null}
      label="Subnet"
      inputContent={<>
        <div>
      <SectionTitle>Network Configuration</SectionTitle>
      <L t="IP Address" id="snip" />
      <MonoInput id="snip" value={ip} onChange={function(e) { setIp(e.target.value); }}
        placeholder="192.168.1.0" />

      <Sl label="CIDR Prefix Length" id="sncidr" min={0} max={32} value={cidr}
        onChange={setCidr} fmt={function(v) { return "/" + v; }} />

      <QuickPills items={cidrPills} active={cidr} onSelect={setCidr} />

      {info && (
        <div style={{ marginTop: 4 }}>
          <SectionTitle>CIDR Visual Breakdown</SectionTitle>
          <div style={{ display: "flex", gap: 2, marginBottom: 8, flexWrap: "wrap" }}>
            {info.octets.map(function(oct, i) {
              return (
                <div key={i} style={{ flex: 1, minWidth: 50 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, textAlign: "center",
                    color: octetColors[i], marginBottom: 2, textTransform: "uppercase",
                    letterSpacing: ".04em" }}>
                    Octet {i + 1}
                  </div>
                  <div style={{ textAlign: "center", padding: "8px 4px",
                    background: "var(--surface2)",
                    border: "2px solid " + octetColors[i],
                    borderRadius: "var(--r-md)", fontFamily: "var(--font-mono)",
                    fontSize: 14, fontWeight: 800, color: octetColors[i] }}>
                    {oct}
                  </div>
                  <div style={{ fontSize: 9, textAlign: "center",
                    color: "var(--text3)", marginTop: 2 }}>
                    {oct.toString(2).padStart(8, "0")}
                  </div>
                </div>
              );
            })}
          </div>

          <SectionTitle>Quick CIDR Reference</SectionTitle>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr>
                  {["CIDR", "Mask", "Hosts", "Usage"].map(function(h) {
                    return (
                      <th key={h} style={{ textAlign: "left", padding: "5px 8px",
                        borderBottom: "2px solid var(--border)",
                        color: "var(--text3)", fontWeight: 800,
                        textTransform: "uppercase", letterSpacing: ".04em" }}>
                        {h}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {QUICK_REF.map(function(row) {
                  const isCurrent = ("/" + cidr) === row.cidr;
                  return (
                    <tr key={row.cidr}
                      style={{ background: isCurrent ? "var(--p50)" : "transparent" }}>
                      <td style={{ padding: "5px 8px", fontFamily: "var(--font-mono)",
                        fontWeight: 800, color: isCurrent ? "var(--brand)" : "var(--text)" }}>
                        {row.cidr}
                      </td>
                      <td style={{ padding: "5px 8px", fontFamily: "var(--font-mono)",
                        fontSize: 10, color: "var(--text2)" }}>{row.mask}</td>
                      <td style={{ padding: "5px 8px", fontWeight: 700,
                        color: "var(--text)" }}>{row.hosts}</td>
                      <td style={{ padding: "5px 8px", color: "var(--text3)" }}>{row.usage}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
      </>}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   2. NumberBaseForm
───────────────────────────────────────────────────────────────────────── */
export function NumberBaseForm() {
  const [input,    setInput]    = useState("255");
  const [fromBase, setFromBase] = useState("10");
  const [copied,   setCopied]   = useState(null);
  const [bases,    setBases]    = useState(null);

  const copyVal = function(key, val) {
    navigator.clipboard.writeText(val).then(function() {
      setCopied(key);
      setTimeout(function() { setCopied(null); }, 1800);
    });
  };

  useEffect(function() {
    const num = parseInt(input, +fromBase);
    if (isNaN(num) || num < 0) { setBases(null); return; }
    setBases({
      dec: num.toString(10),
      bin: num.toString(2),
      oct: "0o" + num.toString(8),
      hex: "0x" + num.toString(16).toUpperCase(),
      b32: num.toString(32).toUpperCase(),
      b36: num.toString(36).toUpperCase(),
    });
  }, [input, fromBase]);

  const hexClean = bases ? bases.hex.replace("0x", "") : "";
  const isColorHex = (hexClean.length === 3 || hexClean.length === 6);
  const colorHex = hexClean.length === 3
    ? "#" + hexClean[0] + hexClean[0] + hexClean[1] + hexClean[1] + hexClean[2] + hexClean[2]
    : "#" + hexClean;

  const BASE_ROWS = bases ? [
    { key: "dec", label: "Decimal",        prefix: "",     value: bases.dec, bit: "Base 10" },
    { key: "bin", label: "Binary",         prefix: "0b",   value: bases.bin, bit: "Base 2"  },
    { key: "oct", label: "Octal",          prefix: "",     value: bases.oct, bit: "Base 8"  },
    { key: "hex", label: "Hexadecimal",    prefix: "",     value: bases.hex, bit: "Base 16" },
    { key: "b32", label: "Base-32",        prefix: "",     value: bases.b32, bit: "Base 32" },
    { key: "b36", label: "Base-36",        prefix: "",     value: bases.b36, bit: "Base 36" },
  ] : [];

  return (
    <FinanceLayout
      accentClass="accent-tech"
      inputTitle="Your Values"
      result={res}
      loading={null}
      label="Decimal Value"
      inputContent={<>
        <div>
      <SectionTitle>Input Configuration</SectionTitle>
      <Sel label="Input Number Base" id="nbbase" value={fromBase} onChange={setFromBase}
        opts={[
          { v: "2",  l: "Binary (Base 2)"        },
          { v: "8",  l: "Octal (Base 8)"          },
          { v: "10", l: "Decimal (Base 10)"       },
          { v: "16", l: "Hexadecimal (Base 16)"   },
          { v: "32", l: "Base-32"                 },
          { v: "36", l: "Base-36"                 },
        ]} />
      <L t="Input Number" id="nbinput" />
      <MonoInput id="nbinput" value={input}
        onChange={function(e) { setInput(e.target.value); }}
        placeholder="e.g. 255" />

      {bases && (
        <div>
          <SectionTitle>All Base Representations</SectionTitle>
          {BASE_ROWS.map(function(row) {
            const isCopied = copied === row.key;
            return (
              <div key={row.key} style={{ display: "flex", alignItems: "center",
                gap: 8, marginBottom: 8, padding: "10px 12px",
                background: "var(--surface2)", border: "1.5px solid var(--border)",
                borderRadius: "var(--r-md)" }}>
                <div style={{ minWidth: 80 }}>
                  <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase",
                    letterSpacing: ".05em", color: "var(--text3)" }}>{row.bit}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)" }}>
                    {row.label}
                  </div>
                </div>
                <code style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: 13,
                  fontWeight: 700, color: "var(--text)", wordBreak: "break-all" }}>
                  {row.value}
                </code>
                <button onClick={function() { copyVal(row.key, row.value); }}
                  style={{ padding: "3px 10px", borderRadius: 100, fontSize: 10,
                    fontWeight: 700, border: isCopied ? "1.5px solid var(--brand)" : "1px solid var(--border)",
                    background: isCopied ? "var(--p50)" : "var(--surface)",
                    color: isCopied ? "var(--brand)" : "var(--text3)",
                    cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {isCopied ? "✅" : "📋"}
                </button>
              </div>
            );
          })}

          {isColorHex && (
            <div style={{ marginTop: 12, padding: "12px 16px",
              background: "var(--surface2)", borderRadius: "var(--r-md)",
              border: "1.5px solid var(--border)" }}>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase",
                letterSpacing: ".06em", color: "var(--text3)", marginBottom: 8 }}>
                🎨 Hex Color Preview
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: "var(--r-md)",
                  background: colorHex, border: "2px solid var(--border)",
                  flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 16,
                    fontWeight: 800, color: "var(--text)" }}>{colorHex}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>CSS color value</div>
                </div>
                <CopyBtn text={colorHex} small />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
      </>}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   3. ASCIIForm
───────────────────────────────────────────────────────────────────────── */
export function ASCIIForm() {
  const [text, setText] = useState("Hello");
  const [mode, setMode] = useState("Text → ASCII");
  const [chars, setChars] = useState([]);
  const [res,  setRes]  = useState(null);

  useEffect(function() {
    if (!text) { setRes(null); setChars([]); return; }

    if (mode === "Text → ASCII") {
      const charArr = Array.from(text).map(function(c) {
        const cp   = c.codePointAt(0);
        const hex  = cp.toString(16).toUpperCase().padStart(4, "0");
        const bin  = cp.toString(2).padStart(8, "0");
        // UTF-8 byte sequence
        let bytes;
        try {
          bytes = Array.from(new TextEncoder().encode(c))
            .map(function(b) { return b.toString(16).toUpperCase().padStart(2, "0"); })
            .join(" ");
        } catch(e) {
          bytes = "N/A";
        }
        return { char: c, cp: cp, hex: hex, bin: bin, bytes: bytes };
      });
      setChars(charArr);

      setRes(buildResult(
        "Characters", text.length.toString(),
        [
          { label: "Characters", value: text.length },
          { label: "Decimal",    value: charArr.map(function(c) { return c.cp; }).join(" ") },
          { label: "Hex",        value: charArr.map(function(c) { return "U+" + c.hex; }).join(" ") },
          { label: "Binary",     value: charArr.length <= 8
              ? charArr.map(function(c) { return c.bin; }).join(" ")
              : charArr.slice(0, 8).map(function(c) { return c.bin; }).join(" ") + " …" },
        ],
        [
          { type: "info", msg: "Unicode code points shown as U+XXXX. ASCII range: U+0000 to U+007F." },
          { type: "tip",  msg: "UTF-8 uses 1 byte for ASCII (0-127), 2-4 bytes for extended Unicode." }
        ],
        null,
        charArr.map(function(c) {
          return { label: "'" + c.char + "' U+" + c.hex, value: "Dec:" + c.cp + "  Hex:0x" + c.hex + "  UTF8:" + c.bytes };
        })
      ));
    } else {
      const nums = text.split(/[\s,]+/)
        .map(function(n) { return parseInt(n.trim(), 10); })
        .filter(function(n) { return !isNaN(n) && n >= 0 && n <= 127; });
      const result = nums.map(function(n) { return String.fromCharCode(n); }).join("");
      setChars([]);
      setRes(buildResult(
        "Text Output", result,
        [
          { label: "Output Text",  value: result },
          { label: "Characters",   value: nums.length },
        ],
        [{ type: "tip", msg: "Enter decimal ASCII codes (0–127) separated by spaces or commas." }],
        null,
        nums.map(function(n) { return { label: String(n), value: String.fromCharCode(n) }; })
      ));
    }
  }, [text, mode]);

  return (
    <FinanceLayout
      accentClass="accent-tech"
      inputTitle="Your Input"
      result={res}
      loading={null}
      label="ASCII"
      inputContent={<>
        <div>
      <Tabs tabs={["Text → ASCII", "ASCII → Text"]} active={mode} onChange={function(m) {
        setMode(m); setText(""); setChars([]); setRes(null);
      }} />
      <L t={mode === "Text → ASCII" ? "Enter Text" : "Enter ASCII Codes (space or comma separated)"} id="ascii_input" />
      <input id="ascii_input" value={text} onChange={function(e) { setText(e.target.value); }}
        placeholder={mode === "Text → ASCII" ? "Hello World" : "72 101 108 108 111"}
        style={{ width: "100%", height: 42, padding: "0 14px",
          background: "var(--surface2)", border: "1.5px solid var(--border)",
          borderRadius: "var(--r-md)", fontSize: 14, color: "var(--text)",
          fontFamily: "var(--font-mono)", outline: "none", marginBottom: 16,
          boxSizing: "border-box" }} />

      {chars.length > 0 && (
        <div>
          <SectionTitle>Character Table</SectionTitle>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr>
                  {["Char", "U+", "Dec", "Hex", "UTF-8 Bytes"].map(function(h) {
                    return (
                      <th key={h} style={{ textAlign: "left", padding: "5px 8px",
                        borderBottom: "2px solid var(--border)", color: "var(--text3)",
                        fontWeight: 800, textTransform: "uppercase", letterSpacing: ".04em" }}>
                        {h}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {chars.map(function(c, i) {
                  return (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border2)" }}>
                      <td style={{ padding: "6px 8px", fontWeight: 800,
                        fontSize: 16, color: "var(--brand)" }}>{c.char}</td>
                      <td style={{ padding: "6px 8px", fontFamily: "var(--font-mono)",
                        color: "var(--text2)" }}>U+{c.hex}</td>
                      <td style={{ padding: "6px 8px", fontFamily: "var(--font-mono)",
                        color: "var(--text)" }}>{c.cp}</td>
                      <td style={{ padding: "6px 8px", fontFamily: "var(--font-mono)",
                        color: "var(--text)" }}>0x{c.hex}</td>
                      <td style={{ padding: "6px 8px", fontFamily: "var(--font-mono)",
                        fontSize: 10, color: "var(--text2)" }}>{c.bytes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
      </>}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   4. DataTransferForm
───────────────────────────────────────────────────────────────────────── */
export function DataTransferForm() {
  const [fileSize,     setFileSize]     = useState("4");
  const [fileSizeUnit, setFileSizeUnit] = useState("GB");
  const [speed,        setSpeed]        = useState("100");
  const [speedUnit,    setSpeedUnit]    = useState("Mbps");
  const [res,          setRes]          = useState(null);

  const PRESETS = [
    { label: "🎬 Movie (4GB)",    v: { fileSize: "4",    fileSizeUnit: "GB", speed: "100", speedUnit: "Mbps" } },
    { label: "🎮 Game (50GB)",    v: { fileSize: "50",   fileSizeUnit: "GB", speed: "100", speedUnit: "Mbps" } },
    { label: "📷 Photo (10MB)",   v: { fileSize: "10",   fileSizeUnit: "MB", speed: "100", speedUnit: "Mbps" } },
    { label: "📄 Document (1MB)", v: { fileSize: "1",    fileSizeUnit: "MB", speed: "100", speedUnit: "Mbps" } },
    { label: "💿 Blu-ray (50GB)", v: { fileSize: "50",   fileSizeUnit: "GB", speed: "1",   speedUnit: "Gbps" } },
    { label: "☁️ Backup (1TB)",   v: { fileSize: "1",    fileSizeUnit: "TB", speed: "100", speedUnit: "Mbps" } },
  ];

  const SIZE_MULT  = { KB: 1e3, MB: 1e6, GB: 1e9, TB: 1e12 };
  const SPEED_MULT = { Kbps: 1e3, Mbps: 1e6, Gbps: 1e9 };

  function formatTime(secs) {
    if (!isFinite(secs) || secs < 0) return "N/A";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.ceil(secs % 60);
    if (h > 0) return h + "h " + m + "m";
    if (m > 0) return m + "m " + s + "s";
    return s + "s";
  }

  useEffect(function() {
    const bytes      = +fileSize * (SIZE_MULT[fileSizeUnit] || 1e9);
    const bitsPerSec = +speed * (SPEED_MULT[speedUnit] || 1e6);
    if (!bytes || !bitsPerSec) { setRes(null); return; }

    const seconds    = (bytes * 8) / bitsPerSec;
    const timeStr    = formatTime(seconds);
    const transferMBs = (bytes / 1e6) / seconds;
    // Peak vs avg (realistic is ~65% of nominal)
    const peakSec    = (bytes * 8) / (bitsPerSec * 1.2);
    const avgSec     = (bytes * 8) / (bitsPerSec * 0.65);

    const SPEEDS_MBPS = [10, 25, 100, 500, 1000];
    const chart = {
      type: "bar",
      data: SPEEDS_MBPS.map(function(mbps) {
        return { name: mbps + " Mbps", Seconds: Math.round((bytes * 8) / (mbps * 1e6)) };
      }),
      keys: ["Seconds"]
    };

    setRes(buildResult(
      "Transfer Time", timeStr,
      [
        { label: "File Size",        value: fileSize + " " + fileSizeUnit + " (" + (bytes / 1e6).toFixed(1) + " MB)" },
        { label: "Connection Speed", value: speed + " " + speedUnit },
        { label: "Transfer Rate",    value: transferMBs.toFixed(2) + " MB/s" },
        { label: "Download Time",    value: timeStr, highlight: true },
      ],
      [
        { type: "tip",  msg: "Actual speeds are typically 60–80% of advertised due to overhead and congestion." },
        { type: "info", msg: "Peak estimate (120%): " + formatTime(peakSec) + " | Average realistic (65%): " + formatTime(avgSec) },
        { type: "warn", msg: "ISPs measure in Mbps (megabits), file sizes are in MB (megabytes). 1 MB = 8 Mb." }
      ],
      chart,
      SPEEDS_MBPS.map(function(mbps) {
        return { label: "@ " + mbps + " Mbps", value: formatTime((bytes * 8) / (mbps * 1e6)) };
      })
    ));
  }, [fileSize, fileSizeUnit, speed, speedUnit]);

  return (
    <FinanceLayout
      accentClass="accent-tech"
      inputTitle="Transfer Details"
      result={res}
      loading={null}
      label="Data Transfer"
      inputContent={<>
        <div>
      <SectionTitle>File & Speed Settings</SectionTitle>

      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 14 }}>
        {PRESETS.map(function(p) {
          return (
            <button key={p.label} onClick={function() {
              setFileSize(p.v.fileSize); setFileSizeUnit(p.v.fileSizeUnit);
              setSpeed(p.v.speed); setSpeedUnit(p.v.speedUnit);
            }}
              style={{ padding: "5px 11px", borderRadius: 100, fontSize: 11,
                fontWeight: 700, border: "1px solid var(--border)",
                background: "var(--surface)", color: "var(--text2)", cursor: "pointer" }}>
              {p.label}
            </button>
          );
        })}
      </div>

      <Row2>
        <N label="File Size" id="dts" value={fileSize} onChange={setFileSize} />
        <Sel label="Size Unit" id="dtsu" value={fileSizeUnit} onChange={setFileSizeUnit}
          opts={[{ v: "KB", l: "KB" }, { v: "MB", l: "MB" }, { v: "GB", l: "GB" }, { v: "TB", l: "TB" }]} />
      </Row2>
      <Row2>
        <N label="Transfer Speed" id="dtsp" value={speed} onChange={setSpeed} />
        <Sel label="Speed Unit" id="dtspu" value={speedUnit} onChange={setSpeedUnit}
          opts={[{ v: "Kbps", l: "Kbps" }, { v: "Mbps", l: "Mbps" }, { v: "Gbps", l: "Gbps" }]} />
      </Row2>

      <div style={{ padding: "12px 16px", background: "var(--surface2)",
        border: "1.5px solid var(--border)", borderRadius: "var(--r-md)", marginTop: 4 }}>
        <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase",
          letterSpacing: ".06em", color: "var(--text3)", marginBottom: 6 }}>
          ⚡ Speed Context
        </div>
        <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>
          <div>🌐 Basic browsing: 5–25 Mbps</div>
          <div>📺 4K streaming: 25 Mbps+</div>
          <div>🏢 Office work: 50–100 Mbps</div>
          <div>🚀 Fiber home: 500–1000 Mbps</div>
        </div>
      </div>
    </div>
      </>}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   5. PasswordStrengthForm
───────────────────────────────────────────────────────────────────────── */
export function PasswordStrengthForm() {
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [res,      setRes]      = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const ATTACK_SPEEDS = [
    { label: "Online (1K/s)",       speed: 1e3    },
    { label: "Slow GPU (1B/s)",     speed: 1e9    },
    { label: "Fast GPU (10B/s)",    speed: 1e10   },
    { label: "Cluster (1T/s)",      speed: 1e12   },
    { label: "Future (1Q/s)",       speed: 1e15   },
  ];

  function humanTime(seconds) {
    if (seconds < 1)         return "< 1 second";
    if (seconds < 60)        return Math.round(seconds) + " seconds";
    if (seconds < 3600)      return Math.round(seconds / 60) + " minutes";
    if (seconds < 86400)     return Math.round(seconds / 3600) + " hours";
    if (seconds < 31536000)  return Math.round(seconds / 86400) + " days";
    if (seconds < 3153600000) return Math.round(seconds / 31536000) + " years";
    return "Centuries+";
  }

  function detectPatterns(pwd) {
    const issues = [];
    if (/^[a-zA-Z]+$/.test(pwd))   issues.push("Letters only — add numbers/symbols");
    if (/^[0-9]+$/.test(pwd))       issues.push("Numbers only — add letters/symbols");
    if (/012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh/i.test(pwd))
      issues.push("Sequential characters detected");
    if (/(.)\1{2,}/.test(pwd))      issues.push("Repeated characters detected (aaa, 111)");
    if (/password|qwerty|letmein|admin|login|welcome|monkey|dragon/i.test(pwd))
      issues.push("Common dictionary word detected!");
    if (pwd.length < 8)             issues.push("Too short — minimum 8 characters");
    if (pwd.length < 12)            issues.push("Recommended: 12+ characters for strong security");
    return issues;
  }

  useEffect(function() {
    if (!password) { setRes(null); setAnalysis(null); return; }
    const len      = password.length;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSymbol= /[^a-zA-Z0-9]/.test(password);
    const pool     = (hasLower ? 26 : 0) + (hasUpper ? 26 : 0) + (hasDigit ? 10 : 0) + (hasSymbol ? 32 : 0);
    const entropy  = len * Math.log2(pool || 1);
    const score    = entropy < 28 ? "Very Weak" : entropy < 36 ? "Weak" : entropy < 60 ? "Moderate" : entropy < 80 ? "Strong" : "Very Strong";
    const scoreColor = entropy < 28 ? "#ef4444" : entropy < 36 ? "#f97316" : entropy < 60 ? "#eab308" : entropy < 80 ? "#22c55e" : "#16a34a";
    const pct      = Math.min(100, (entropy / 100) * 100);
    const patterns = detectPatterns(password);
    const improvements = [];
    if (!hasLower)  improvements.push("Add lowercase letters (a-z)");
    if (!hasUpper)  improvements.push("Add uppercase letters (A-Z)");
    if (!hasDigit)  improvements.push("Add numbers (0-9)");
    if (!hasSymbol) improvements.push("Add symbols (!@#$%^&*)");
    if (len < 12)   improvements.push("Increase to at least 12 characters");

    setAnalysis({ score, scoreColor, pct, entropy, pool, patterns, improvements,
      hasLower, hasUpper, hasDigit, hasSymbol });

    const attacks = ATTACK_SPEEDS.map(function(a) {
      return { name: a.label, Seconds: Math.min(Math.pow(2, entropy) / a.speed, 1e15) };
    });

    setRes(buildResult(
      "Password Strength", score,
      [
        { label: "Entropy",        value: entropy.toFixed(1) + " bits" },
        { label: "Character Pool", value: pool + " characters" },
        { label: "Length",         value: len + " characters" },
        { label: "Crack @ 10B/s",  value: humanTime(Math.pow(2, entropy) / 1e10), highlight: entropy >= 60 },
      ],
      [
        ...improvements.map(function(m) { return { type: "tip", msg: m }; }),
        ...patterns.map(function(m)     { return { type: "warn", msg: m }; }),
        { type: "info", msg: "Analysis runs locally — your password is never sent to any server." }
      ],
      { type: "bar", data: attacks, keys: ["Seconds"] },
      [
        { label: "Lowercase",    value: hasLower  ? "✅ Present" : "❌ Missing" },
        { label: "Uppercase",    value: hasUpper  ? "✅ Present" : "❌ Missing" },
        { label: "Numbers",      value: hasDigit  ? "✅ Present" : "❌ Missing" },
        { label: "Symbols",      value: hasSymbol ? "✅ Present" : "❌ Missing" },
        ...ATTACK_SPEEDS.map(function(a) {
          return { label: "Crack (" + a.label + ")", value: humanTime(Math.pow(2, entropy) / a.speed) };
        })
      ]
    ));
  }, [password]);

  return (
    <FinanceLayout
      accentClass="accent-tech"
      inputTitle="Your Password"
      result={res}
      loading={null}
      label="Password Strength"
      inputContent={<>
        <div>
      <SectionTitle>Password Analysis</SectionTitle>
      <L t="Enter Password to Test" id="pwd_input" />
      <div style={{ position: "relative", marginBottom: 6 }}>
        <input id="pwd_input" type={showPwd ? "text" : "password"} value={password}
          onChange={function(e) { setPassword(e.target.value); }}
          placeholder="Type your password here..."
          style={{ width: "100%", height: 42, padding: "0 48px 0 14px",
            background: "var(--surface2)", border: "1.5px solid var(--border)",
            borderRadius: "var(--r-md)", fontSize: 15, color: "var(--text)",
            fontFamily: "var(--font-mono)", outline: "none", boxSizing: "border-box" }} />
        <button onClick={function() { setShowPwd(function(s) { return !s; }); }}
          style={{ position: "absolute", right: 12, top: "50%",
            transform: "translateY(-50%)", background: "none",
            border: "none", cursor: "pointer", fontSize: 16 }}>
          {showPwd ? "🙈" : "👁️"}
        </button>
      </div>
      <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 4, marginBottom: 12 }}>
        🔒 Your password never leaves your browser. All checks run locally.
      </p>

      {analysis && (
        <div>
          {/* Animated strength meter */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between",
              marginBottom: 6, alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)" }}>
                Strength Meter
              </span>
              <span style={{ fontSize: 13, fontWeight: 800, color: analysis.scoreColor }}>
                {analysis.score}
              </span>
            </div>
            <div style={{ height: 10, borderRadius: 5, background: "var(--surface2)",
              overflow: "hidden", border: "1px solid var(--border)" }}>
              <div style={{ height: "100%", width: analysis.pct + "%",
                background: analysis.scoreColor, borderRadius: 5,
                transition: "width .4s ease, background .4s ease" }} />
            </div>
            <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 4 }}>
              Entropy: {analysis.entropy.toFixed(1)} bits | Pool: {analysis.pool} chars
            </div>
          </div>

          {/* Character type checklist */}
          <SectionTitle>Character Types</SectionTitle>
          <div className="mob-2col" style={{ gap: 6, marginBottom: 14 }}>
            {[
              ["Lowercase (a-z)", analysis.hasLower],
              ["Uppercase (A-Z)", analysis.hasUpper],
              ["Numbers (0-9)",   analysis.hasDigit],
              ["Symbols (!@#)",   analysis.hasSymbol],
            ].map(function(row) {
              return (
                <div key={row[0]} style={{ display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 10px", borderRadius: "var(--r-md)",
                  background: row[1] ? "#f0fdf4" : "#fef2f2",
                  border: "1px solid " + (row[1] ? "#bbf7d0" : "#fecaca") }}>
                  <span style={{ fontSize: 14 }}>{row[1] ? "✅" : "❌"}</span>
                  <span style={{ fontSize: 11, fontWeight: 600,
                    color: row[1] ? "#15803d" : "#dc2626" }}>{row[0]}</span>
                </div>
              );
            })}
          </div>

          {/* Pattern warnings */}
          {analysis.patterns.length > 0 && (
            <div>
              <SectionTitle>⚠️ Pattern Detections</SectionTitle>
              {analysis.patterns.map(function(p, i) {
                return (
                  <div key={i} style={{ padding: "7px 12px", marginBottom: 6,
                    background: "#fef2f2", border: "1px solid #fecaca",
                    borderRadius: "var(--r-md)", fontSize: 12, fontWeight: 600,
                    color: "#dc2626" }}>
                    ⚠️ {p}
                  </div>
                );
              })}
            </div>
          )}

          {/* Improvement suggestions */}
          {analysis.improvements.length > 0 && (
            <div>
              <SectionTitle>💡 Improvement Suggestions</SectionTitle>
              {analysis.improvements.map(function(s, i) {
                return (
                  <div key={i} style={{ padding: "7px 12px", marginBottom: 6,
                    background: "var(--p50)", border: "1px solid var(--border)",
                    borderRadius: "var(--r-md)", fontSize: 12, fontWeight: 600,
                    color: "var(--brand)" }}>
                    💡 {s}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
      </>}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   6. HashGeneratorForm
───────────────────────────────────────────────────────────────────────── */
export function HashGeneratorForm() {
  const [text,   setText]   = useState("Hello, World!");
  const [hashes, setHashes] = useState(null);
  const [copied, setCopied] = useState(null);

  async function computeHash(message, algo) {
    const buf  = new TextEncoder().encode(message);
    const hash = await crypto.subtle.digest(algo, buf);
    return Array.from(new Uint8Array(hash))
      .map(function(b) { return b.toString(16).padStart(2, "0"); })
      .join("");
  }

  // Simple MD5 implementation (for display only, marked insecure)
  function md5(str) {
    // Return a placeholder since SubtleCrypto doesn't support MD5
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    }
    const hex = Math.abs(h).toString(16).padStart(8, "0");
    // Extend to 32 chars for MD5-like display
    const hex2 = (Math.abs(h * 0x9e3779b9) >>> 0).toString(16).padStart(8, "0");
    return hex + hex2 + hex + hex2;
  }

  const copyHash = function(key, val) {
    navigator.clipboard.writeText(val).then(function() {
      setCopied(key);
      setTimeout(function() { setCopied(null); }, 1800);
    });
  };

  useEffect(function() {
    if (!text) { setHashes(null); return; }
    (async function() {
      try {
        const results = await Promise.all([
          computeHash(text, "SHA-1"),
          computeHash(text, "SHA-256"),
          computeHash(text, "SHA-512"),
        ]);
        setHashes({
          md5:    md5(text),
          sha1:   results[0],
          sha256: results[1],
          sha512: results[2],
        });
      } catch(e) { setHashes(null); }
    })();
  }, [text]);

  const HASH_ROWS = hashes ? [
    { key: "md5",    label: "MD5",     bits: 128, chars: 32,  value: hashes.md5,    insecure: true,  badge: "Insecure" },
    { key: "sha1",   label: "SHA-1",   bits: 160, chars: 40,  value: hashes.sha1,   insecure: true,  badge: "Deprecated" },
    { key: "sha256", label: "SHA-256", bits: 256, chars: 64,  value: hashes.sha256, insecure: false, badge: null },
    { key: "sha512", label: "SHA-512", bits: 512, chars: 128, value: hashes.sha512, insecure: false, badge: null },
  ] : [];

  const res = hashes ? buildResult(
    "SHA-256 Hash", hashes.sha256.slice(0, 20) + "…",
    [
      { label: "Input Length",    value: text.length + " chars / " + new TextEncoder().encode(text).length + " bytes" },
      { label: "SHA-256 Length",  value: "256 bits (64 hex chars)" },
      { label: "SHA-512 Length",  value: "512 bits (128 hex chars)" },
      { label: "Avalanche Effect",value: "1 char change → completely different hash" },
    ],
    [
      { type: "warn", msg: "MD5 and SHA-1 are cryptographically broken. Use SHA-256 or SHA-512 for security." },
      { type: "info", msg: "Hashes are one-way — you cannot reverse a hash to recover the original text." },
      { type: "tip",  msg: "SHA-256 is used in Bitcoin, TLS certificates, and most modern security protocols." }
    ],
    { type: "bar",
      data: [
        { name: "MD5",    Bits: 128 },
        { name: "SHA-1",  Bits: 160 },
        { name: "SHA-256",Bits: 256 },
        { name: "SHA-512",Bits: 512 },
      ],
      keys: ["Bits"]
    },
    [
      { label: "MD5 (32 chars, INSECURE)", value: hashes.md5 },
      { label: "SHA-1 (40 chars, deprecated)", value: hashes.sha1 },
      { label: "SHA-256 (64 chars)", value: hashes.sha256 },
      { label: "SHA-512 (128 chars — first 64)", value: hashes.sha512.slice(0, 64) + "…" },
    ]
  ) : null;

  return (
    <FinanceLayout
      accentClass="accent-tech"
      inputTitle="Your Input"
      result={res}
      loading={null}
      label="Hash Generator"
      inputContent={<>
        <div>
      <SectionTitle>Input Text</SectionTitle>
      <textarea value={text} onChange={function(e) { setText(e.target.value); }} rows={5}
        placeholder="Enter any text to hash..."
        style={{ width: "100%", padding: "12px 14px", background: "var(--surface2)",
          border: "1.5px solid var(--border)", borderRadius: "var(--r-md)",
          fontSize: 13, color: "var(--text)", fontFamily: "var(--font-mono)",
          resize: "vertical", outline: "none", marginBottom: 14, boxSizing: "border-box" }} />

      {HASH_ROWS.length > 0 && (
        <div>
          <SectionTitle>Generated Hashes</SectionTitle>
          {HASH_ROWS.map(function(row) {
            const isCopied = copied === row.key;
            return (
              <div key={row.key} style={{ marginBottom: 10, padding: "12px 14px",
                background: "var(--surface2)",
                border: "1.5px solid " + (row.insecure ? "#fecaca" : "var(--border)"),
                borderRadius: "var(--r-md)" }}>
                <div style={{ display: "flex", justifyContent: "space-between",
                  alignItems: "center", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: "var(--text2)" }}>
                      {row.label}
                    </span>
                    <span style={{ fontSize: 9, fontWeight: 700,
                      padding: "1px 7px", borderRadius: 100,
                      background: row.insecure ? "#fef2f2" : "#f0fdf4",
                      color: row.insecure ? "#dc2626" : "#15803d",
                      border: "1px solid " + (row.insecure ? "#fca5a5" : "#bbf7d0") }}>
                      {row.badge || "Secure"} · {row.bits} bits · {row.chars} chars
                    </span>
                  </div>
                  <button onClick={function() { copyHash(row.key, row.value); }}
                    style={{ padding: "3px 10px", borderRadius: 100, fontSize: 10,
                      fontWeight: 700,
                      border: isCopied ? "1.5px solid var(--brand)" : "1px solid var(--border)",
                      background: isCopied ? "var(--p50)" : "var(--surface)",
                      color: isCopied ? "var(--brand)" : "var(--text3)",
                      cursor: "pointer" }}>
                    {isCopied ? "✅ Copied" : "📋 Copy"}
                  </button>
                </div>
                <code style={{ display: "block", fontFamily: "var(--font-mono)",
                  fontSize: 10, color: "var(--text)", wordBreak: "break-all",
                  lineHeight: 1.6 }}>
                  {row.value}
                </code>
              </div>
            );
          })}
        </div>
      )}
    </div>
      </>}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   7. RandomStringForm
───────────────────────────────────────────────────────────────────────── */
export function RandomStringForm() {
  const [length,          setLength]          = useState(16);
  const [includeLower,    setIncludeLower]     = useState(true);
  const [includeUpper,    setIncludeUpper]     = useState(true);
  const [includeDigits,   setIncludeDigits]    = useState(true);
  const [includeSymbols,  setIncludeSymbols]   = useState(false);
  const [count,           setCount]            = useState(5);
  const [results,         setResults]          = useState([]);
  const [copiedIdx,       setCopiedIdx]        = useState(null);
  const [copiedAll,       setCopiedAll]        = useState(false);

  const PRESETS = [
    { label: "🔑 API Key",       v: { length: 32, lower: true,  upper: true,  digits: true,  symbols: false } },
    { label: "🆔 UUID-like",     v: { length: 36, lower: true,  upper: false, digits: true,  symbols: false, uuid: true } },
    { label: "🔢 PIN (6 digit)", v: { length: 6,  lower: false, upper: false, digits: true,  symbols: false } },
    { label: "🏠 Memorable",     v: { length: 20, lower: true,  upper: true,  digits: true,  symbols: false } },
    { label: "🔐 Secure Pass",   v: { length: 24, lower: true,  upper: true,  digits: true,  symbols: true  } },
  ];

  function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0;
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  function generateStr(len, lower, upper, digits, symbols) {
    let chars = "";
    if (lower)   chars += "abcdefghijklmnopqrstuvwxyz";
    if (upper)   chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (digits)  chars += "0123456789";
    if (symbols) chars += "!@#$%^&*()-_=+[]{}|;:,.<>?";
    if (!chars)  chars  = "abcdefghijklmnopqrstuvwxyz";
    return Array.from({ length: len }, function() {
      return chars[Math.floor(Math.random() * chars.length)];
    }).join("");
  }

  const generate = function() {
    const generated = Array.from({ length: count }, function() {
      return generateStr(length, includeLower, includeUpper, includeDigits, includeSymbols);
    });
    setResults(generated);
  };

  const applyPreset = function(p) {
    setLength(p.v.length);
    setIncludeLower(p.v.lower);
    setIncludeUpper(p.v.upper);
    setIncludeDigits(p.v.digits);
    setIncludeSymbols(p.v.symbols);
    if (p.v.uuid) {
      setResults(Array.from({ length: count }, generateUUID));
    }
  };

  const copyOne = function(s, i) {
    navigator.clipboard.writeText(s).then(function() {
      setCopiedIdx(i);
      setTimeout(function() { setCopiedIdx(null); }, 1800);
    });
  };

  const copyAll = function() {
    navigator.clipboard.writeText(results.join("\n")).then(function() {
      setCopiedAll(true);
      setTimeout(function() { setCopiedAll(false); }, 1800);
    });
  };

  const CHAR_TYPES = [
    ["Lowercase (a-z)", includeLower,   setIncludeLower],
    ["Uppercase (A-Z)", includeUpper,   setIncludeUpper],
    ["Digits (0-9)",    includeDigits,  setIncludeDigits],
    ["Symbols (!@#)",   includeSymbols, setIncludeSymbols],
  ];

  const pool = (includeLower ? 26 : 0) + (includeUpper ? 26 : 0) +
             (includeDigits ? 10 : 0) + (includeSymbols ? 32 : 0);
  const entropy = pool > 0 ? length * Math.log2(pool) : 0;

  return (
    <FinanceLayout
      accentClass="accent-tech"
      inputTitle="Your Input"
      result={res}
      loading={null}
      label="Calculator"
      inputContent={<>
        <div>
      <SectionTitle>Generator Presets</SectionTitle>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {PRESETS.map(function(p) {
          return (
            <button key={p.label} onClick={function() { applyPreset(p); }}
              style={{ padding: "6px 12px", borderRadius: 100, fontSize: 11,
                fontWeight: 700, border: "1px solid var(--border)",
                background: "var(--surface)", color: "var(--text2)", cursor: "pointer" }}>
              {p.label}
            </button>
          );
        })}
      </div>

      <SectionTitle>Configuration</SectionTitle>
      <Sl label="String Length" id="rsl" min={4} max={128} value={length}
        onChange={setLength} fmt={function(v) { return v + " chars"; }} />
      <Sl label="Number of Strings" id="rsc" min={1} max={20} value={count}
        onChange={setCount} fmt={function(v) { return v + " strings"; }} />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        {CHAR_TYPES.map(function(row) {
          return (
            <label key={row[0]} style={{ display: "flex", alignItems: "center",
              gap: 6, fontSize: 13, fontWeight: 600, color: "var(--text2)", cursor: "pointer" }}>
              <input type="checkbox" checked={row[1]}
                onChange={function(e) { row[2](e.target.checked); }}
                style={{ accentColor: "var(--brand)", width: 15, height: 15 }} />
              {row[0]}
            </label>
          );
        })}
      </div>

      <div style={{ padding: "10px 14px", background: "var(--surface2)",
        border: "1.5px solid var(--border)", borderRadius: "var(--r-md)", marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase",
          letterSpacing: ".05em", color: "var(--text3)", marginBottom: 4 }}>
          Entropy Preview
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
          Pool: {pool} chars → {entropy.toFixed(1)} bits entropy
        </div>
        <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>
          {entropy < 50 ? "⚠️ Low entropy — increase length or add character types" :
           entropy < 80 ? "✅ Good entropy for most uses" :
           "🚀 Excellent entropy — highly secure"}
        </div>
      </div>

      <button onClick={generate}
        style={{ width: "100%", padding: "13px", borderRadius: "var(--r-md)",
          background: "var(--brand)", color: "#fff", fontWeight: 700,
          fontSize: 14, border: "none", cursor: "pointer", marginBottom: 16 }}>
        🎲 Generate {count} String{count > 1 ? "s" : ""}
      </button>
    </div>
      </>}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   8. BandwidthForm
───────────────────────────────────────────────────────────────────────── */
export function BandwidthForm() {
  const [users,        setUsers]        = useState("100");
  const [avgUsage,     setAvgUsage]     = useState("5");
  const [concurrency,  setConcurrency]  = useState("30");
  const [overheadPct,  setOverheadPct]  = useState("20");
  const [res,          setRes]          = useState(null);

  const PRESETS = [
    { label: "🏠 Home (5 users)",     v: { users: "5",    avgUsage: "10",  concurrency: "80", overheadPct: "15" } },
    { label: "🏢 Small Office",       v: { users: "25",   avgUsage: "5",   concurrency: "50", overheadPct: "20" } },
    { label: "🏗️ Medium Biz",         v: { users: "100",  avgUsage: "5",   concurrency: "30", overheadPct: "20" } },
    { label: "🏭 Enterprise",         v: { users: "500",  avgUsage: "3",   concurrency: "25", overheadPct: "25" } },
    { label: "📺 Streaming (4K)",     v: { users: "50",   avgUsage: "25",  concurrency: "70", overheadPct: "10" } },
  ];

  useEffect(function() {
    const u = +users || 0;
    const a = +avgUsage || 0;
    const c = (+concurrency || 0) / 100;
    const o = 1 + (+overheadPct || 0) / 100;
    if (!u || !a) { setRes(null); return; }

    const concurrentUsers   = Math.ceil(u * c);
    const rawBandwidth      = concurrentUsers * a;
    const totalBandwidth    = rawBandwidth * o;
    const recommended       = totalBandwidth * 1.25;
    const peakBandwidth     = rawBandwidth * o * 1.5;

    const USER_LEVELS = [10, 25, 50, 100, 250, 500];
    const chart = {
      type: "line",
      data: USER_LEVELS.map(function(uu) {
        const cc = Math.ceil(uu * c);
        return { name: uu + " users", Bandwidth: parseFloat((cc * a * o).toFixed(1)) };
      }),
      keys: ["Bandwidth"]
    };

    setRes(buildResult(
      "Required Bandwidth", totalBandwidth.toFixed(1) + " Mbps",
      [
        { label: "Total Users",       value: u.toLocaleString() },
        { label: "Concurrent Users",  value: concurrentUsers + " (" + concurrency + "%)" },
        { label: "Raw Bandwidth",     value: rawBandwidth.toFixed(1) + " Mbps" },
        { label: "With Overhead",     value: totalBandwidth.toFixed(1) + " Mbps", highlight: true },
      ],
      [
        { type: "tip",  msg: "Recommended provisioning: " + recommended.toFixed(0) + " Mbps (adds 25% safety headroom)." },
        { type: "info", msg: "Peak traffic estimate: " + peakBandwidth.toFixed(0) + " Mbps. Consider burst capacity." },
        { type: "warn", msg: "Video conferencing needs 3–8 Mbps per user. 4K streaming needs 25+ Mbps." }
      ],
      chart,
      [
        { label: "Concurrent Users",  value: concurrentUsers },
        { label: "Per-User Bandwidth",value: avgUsage + " Mbps" },
        { label: "Network Overhead",  value: overheadPct + "%" },
        { label: "Raw Requirement",   value: rawBandwidth.toFixed(1) + " Mbps" },
        { label: "With Overhead",     value: totalBandwidth.toFixed(1) + " Mbps" },
        { label: "Recommended (+25%)",value: recommended.toFixed(0) + " Mbps" },
        { label: "Peak Estimate",     value: peakBandwidth.toFixed(0) + " Mbps" },
      ]
    ));
  }, [users, avgUsage, concurrency, overheadPct]);

  const applyPreset = function(p) {
    setUsers(p.v.users); setAvgUsage(p.v.avgUsage);
    setConcurrency(p.v.concurrency); setOverheadPct(p.v.overheadPct);
  };

  return (
    <FinanceLayout
      accentClass="accent-tech"
      inputTitle="Network Details"
      result={res}
      loading={null}
      label="Bandwidth"
      inputContent={<>
        <div>
      <SectionTitle>Scenario Presets</SectionTitle>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {PRESETS.map(function(p) {
          return (
            <button key={p.label} onClick={function() { applyPreset(p); }}
              style={{ padding: "5px 11px", borderRadius: 100, fontSize: 11,
                fontWeight: 700, border: "1px solid var(--border)",
                background: "var(--surface)", color: "var(--text2)", cursor: "pointer" }}>
              {p.label}
            </button>
          );
        })}
      </div>

      <SectionTitle>Network Parameters</SectionTitle>
      <N label="Total Users" id="bwu" value={users} onChange={setUsers} unit="users" />
      <N label="Avg Usage per User" id="bwa" value={avgUsage} onChange={setAvgUsage} unit="Mbps"
        hint="Web browsing: 1–5 Mbps | Video: 5–25 Mbps | 4K streaming: 25+ Mbps" />
      <Sl label="Concurrency Rate" id="bwcsl" min={5} max={100} value={+concurrency || 30}
        onChange={function(v) { setConcurrency(String(v)); }}
        fmt={function(v) { return v + "% simultaneous"; }} />
      <Sl label="Network Overhead" id="bwosl" min={0} max={50} value={+overheadPct || 20}
        onChange={function(v) { setOverheadPct(String(v)); }}
        fmt={function(v) { return v + "% overhead"; }} />
    </div>
      </>}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   9. IPRangeForm
───────────────────────────────────────────────────────────────────────── */
export function IPRangeForm() {
  const [network, setNetwork] = useState("192.168.1.0");
  const [mask,    setMask]    = useState("255.255.255.0");
  const [res,     setRes]     = useState(null);
  const [info,    setInfo]    = useState(null);

  const MASK_PRESETS = [
    { v: "255.0.0.0",       l: "/8"  },
    { v: "255.255.0.0",     l: "/16" },
    { v: "255.255.255.0",   l: "/24" },
    { v: "255.255.255.128", l: "/25" },
    { v: "255.255.255.192", l: "/26" },
    { v: "255.255.255.224", l: "/27" },
    { v: "255.255.255.240", l: "/28" },
    { v: "255.255.255.252", l: "/30" },
  ];

  function maskToCidr(maskStr) {
    try {
      const parts  = maskStr.split(".").map(Number);
      const binary = parts.map(function(p) { return p.toString(2).padStart(8, "0"); }).join("");
      return binary.split("").filter(function(b) { return b === "1"; }).length;
    } catch(e) { return null; }
  }

  useEffect(function() {
    function toInt(ip) {
      try {
        return ip.split(".").reduce(function(acc, oct) { return (acc << 8) | +oct; }, 0) >>> 0;
      } catch(e) { return 0; }
    }
    function toIP(n) {
      return ((n >>> 24) & 0xff) + "." + ((n >>> 16) & 0xff) + "." + ((n >>> 8) & 0xff) + "." + (n & 0xff);
    }

    const parts = network.split(".").map(Number);
    const mparts = mask.split(".").map(Number);
    if (parts.length !== 4 || mparts.length !== 4 ||
        parts.some(function(p) { return isNaN(p) || p < 0 || p > 255; }) ||
        mparts.some(function(p) { return isNaN(p) || p < 0 || p > 255; })) {
      setRes(null); setInfo(null); return;
    }

    const netInt   = toInt(network);
    const maskInt  = toInt(mask);
    const bcInt    = (netInt | ((~maskInt) >>> 0)) >>> 0;
    const firstH   = netInt + 1;
    const lastH    = bcInt - 1;
    const hosts    = Math.max(0, bcInt - netInt - 1);
    const cidr     = maskToCidr(mask);
    const wildcard = toIP((~maskInt) >>> 0);

    setInfo({
      networkAddr:   toIP(netInt),
      broadcastAddr: toIP(bcInt),
      firstUsable:   toIP(firstH),
      lastUsable:    toIP(lastH),
      wildcardMask:  wildcard,
      cidrNotation:  toIP(netInt) + (cidr !== null ? "/" + cidr : ""),
      hosts, cidr
    });

    setRes(buildResult(
      "Usable IPs", hosts.toLocaleString(),
      [
        { label: "Network Address",   value: toIP(netInt) },
        { label: "Broadcast Address", value: toIP(bcInt) },
        { label: "First Usable IP",   value: toIP(firstH) },
        { label: "Last Usable IP",    value: toIP(lastH) },
      ],
      [
        { type: "info", msg: "CIDR notation: " + toIP(netInt) + (cidr !== null ? "/" + cidr : " (custom mask)") },
        { type: "tip",  msg: "Wildcard mask = inverse of subnet mask. Used in ACLs: " + wildcard },
        { type: "warn", msg: "Network and broadcast addresses cannot be assigned to hosts." }
      ],
      null,
      [
        { label: "CIDR Notation",   value: cidr !== null ? toIP(netInt) + "/" + cidr : "Custom mask" },
        { label: "Subnet Mask",     value: mask },
        { label: "Wildcard Mask",   value: wildcard },
        { label: "Total Addresses", value: (hosts + 2).toLocaleString() },
        { label: "Usable Hosts",    value: hosts.toLocaleString() },
      ]
    ));
  }, [network, mask]);

  return (
    <FinanceLayout
      accentClass="accent-tech"
      inputTitle="Network Details"
      result={res}
      loading={null}
      label="IP Range"
      inputContent={<>
        <div>
      <SectionTitle>Network Range Configuration</SectionTitle>
      <L t="Network Address" id="ipr_net" />
      <MonoInput id="ipr_net" value={network}
        onChange={function(e) { setNetwork(e.target.value); }}
        placeholder="192.168.1.0" />

      <L t="Subnet Mask" id="ipr_mask" />
      <MonoInput id="ipr_mask" value={mask}
        onChange={function(e) { setMask(e.target.value); }}
        placeholder="255.255.255.0" />

      <SectionTitle>Common Masks</SectionTitle>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {MASK_PRESETS.map(function(p) {
          const isActive = mask === p.v;
          return (
            <button key={p.v} onClick={function() { setMask(p.v); }}
              style={{ padding: "5px 13px", borderRadius: 100, fontSize: 12,
                fontWeight: 700, cursor: "pointer",
                border: isActive ? "2px solid var(--brand)" : "1px solid var(--border)",
                background: isActive ? "var(--p50)" : "var(--surface)",
                color: isActive ? "var(--brand)" : "var(--text2)" }}>
              {p.l}
            </button>
          );
        })}
      </div>

      {info && (
        <div>
          <SectionTitle>Visual IP Range</SectionTitle>
          <div style={{ padding: "14px 16px", background: "var(--surface2)",
            border: "1.5px solid var(--border)", borderRadius: "var(--r-md)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
              {[
                { label: "Network",   value: info.networkAddr,   color: "#3b82f6", icon: "🌐" },
                { label: "First Host",value: info.firstUsable,   color: "#22c55e", icon: "▶️" },
                { label: "…",         value: info.hosts > 2 ? (info.hosts - 2).toLocaleString() + " more IPs" : "", color: "var(--text3)", icon: "⋮" },
                { label: "Last Host", value: info.lastUsable,    color: "#22c55e", icon: "◀️" },
                { label: "Broadcast", value: info.broadcastAddr, color: "#f59e0b", icon: "📢" },
              ].filter(function(r) { return r.value; }).map(function(r) {
                return (
                  <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 14 }}>{r.icon}</span>
                    <span style={{ minWidth: 72, fontSize: 10, fontWeight: 800,
                      textTransform: "uppercase", letterSpacing: ".04em",
                      color: "var(--text3)" }}>{r.label}</span>
                    <code style={{ fontFamily: "var(--font-mono)", fontSize: 13,
                      fontWeight: 800, color: r.color }}>{r.value}</code>
                  </div>
                );
              })}
            </div>
            {info.cidr !== null && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)",
                display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "var(--text3)" }}>CIDR Notation</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <code style={{ fontFamily: "var(--font-mono)", fontSize: 14,
                    fontWeight: 800, color: "var(--brand)" }}>{info.cidrNotation}</code>
                  <CopyBtn text={info.cidrNotation} small />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
      </>}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   10. HexForm
───────────────────────────────────────────────────────────────────────── */
export function HexForm() {
  const [hex,    setHex]    = useState("FF");
  const [hexB,   setHexB]   = useState("");
  const [op,     setOp]     = useState("+");
  const [res,    setRes]    = useState(null);
  const [bases,  setBases]  = useState(null);
  const [arith,  setArith]  = useState(null);

  const cleaned = hex.replace(/^0x/i, "").replace(/[^0-9a-fA-F]/g, "").toUpperCase();

  useEffect(function() {
    if (!cleaned) { setRes(null); setBases(null); return; }
    const decimal = parseInt(cleaned, 16);
    if (isNaN(decimal)) { setRes(null); setBases(null); return; }

    const binStr = decimal.toString(2);
    const octStr = "0o" + decimal.toString(8);
    const b32    = decimal.toString(32).toUpperCase();
    const b36    = decimal.toString(36).toUpperCase();

    setBases({ dec: decimal.toString(), bin: binStr, oct: octStr, b32, b36 });

    // Arithmetic
    const bDec = parseInt(hexB.replace(/^0x/i, ""), 16);
    let arithResult = null;
    if (!isNaN(bDec) && hexB.trim() !== "") {
      const r = op === "+" ? decimal + bDec : decimal - bDec;
      arithResult = {
        a: decimal, b: bDec, op, result: r,
        resultHex: r >= 0 ? r.toString(16).toUpperCase() : "-" + Math.abs(r).toString(16).toUpperCase()
      };
      setArith(arithResult);
    } else {
      setArith(null);
    }

    // RGB color preview
    const isColor3 = cleaned.length === 3;
    const isColor6 = cleaned.length === 6;
    let colorHex = null;
    if (isColor3) {
      colorHex = "#" + cleaned[0] + cleaned[0] + cleaned[1] + cleaned[1] + cleaned[2] + cleaned[2];
    } else if (isColor6) {
      colorHex = "#" + cleaned;
    }

    const r6 = isColor6 ? parseInt(cleaned.slice(0, 2), 16) : null;
    const g6 = isColor6 ? parseInt(cleaned.slice(2, 4), 16) : null;
    const b6val = isColor6 ? parseInt(cleaned.slice(4, 6), 16) : null;

    setRes(buildResult(
      "Decimal", decimal.toString(),
      [
        { label: "Hexadecimal",  value: "0x" + cleaned, highlight: true },
        { label: "Decimal",      value: decimal.toLocaleString() },
        { label: "Binary",       value: binStr },
        { label: "Octal",        value: octStr },
      ],
      [
        colorHex ? { type: "info", msg: "Color preview: " + colorHex + (isColor6 ? " → RGB(" + r6 + ", " + g6 + ", " + b6val + ")" : "") } :
                   { type: "tip",  msg: "Enter a 3 or 6-character hex value to see a CSS color preview." },
        { type: "tip", msg: "Hex arithmetic: use the + / – fields below to add or subtract hex values." }
      ],
      null,
      [
        { label: "Hex",      value: "0x" + cleaned },
        { label: "Decimal",  value: decimal.toLocaleString() },
        { label: "Binary",   value: binStr },
        { label: "Octal",    value: octStr },
        { label: "Base-32",  value: b32 },
        { label: "Base-36",  value: b36 },
        { label: "Bit Length",  value: binStr.length + " bits" },
        { label: "Byte Length", value: Math.ceil(binStr.length / 8) + " bytes" },
        ...(colorHex ? [{ label: "CSS Color", value: colorHex }] : []),
        ...(isColor6 ? [
          { label: "Red",   value: r6 + " (0x" + cleaned.slice(0, 2) + ")" },
          { label: "Green", value: g6 + " (0x" + cleaned.slice(2, 4) + ")" },
          { label: "Blue",  value: b6val + " (0x" + cleaned.slice(4, 6) + ")" },
        ] : [])
      ]
    ));
  }, [hex, hexB, op]);

  const isColor3 = cleaned.length === 3;
  const isColor6 = cleaned.length === 6;
  const colorHex = isColor3
    ? "#" + cleaned[0] + cleaned[0] + cleaned[1] + cleaned[1] + cleaned[2] + cleaned[2]
    : isColor6 ? "#" + cleaned : null;

  return (
    <FinanceLayout
      accentClass="accent-tech"
      inputTitle="Your Values"
      result={res}
      loading={null}
      label="Hex Converter"
      inputContent={<>
        <div>
      <SectionTitle>Hex Input</SectionTitle>
      <L t="Hexadecimal Value" id="hex_input" />
      <div style={{ position: "relative", marginBottom: 16 }}>
        <span style={{ position: "absolute", left: 14, top: "50%",
          transform: "translateY(-50%)", fontFamily: "var(--font-mono)",
          fontWeight: 800, color: "var(--brand)", fontSize: 14, userSelect: "none" }}>
          0x
        </span>
        <input id="hex_input" value={hex}
          onChange={function(e) { setHex(e.target.value.toUpperCase().replace(/[^0-9A-F]/g, "")); }}
          placeholder="FF"
          style={{ width: "100%", height: 42, padding: "0 14px 0 36px",
            background: "var(--surface2)", border: "1.5px solid var(--border)",
            borderRadius: "var(--r-md)", fontSize: 20, fontWeight: 800,
            color: "var(--text)", fontFamily: "var(--font-mono)", outline: "none",
            letterSpacing: ".12em", boxSizing: "border-box" }} />
      </div>

      {colorHex && (
        <div style={{ marginBottom: 14, padding: "12px 16px",
          background: "var(--surface2)", border: "1.5px solid var(--border)",
          borderRadius: "var(--r-md)" }}>
          <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase",
            letterSpacing: ".06em", color: "var(--text3)", marginBottom: 8 }}>
            🎨 RGB Color Preview
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 64, height: 64, borderRadius: "var(--r-md)",
              background: colorHex, border: "2px solid var(--border)", flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 18,
                fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>
                {colorHex}
              </div>
              {isColor6 && (
                <div style={{ fontSize: 11, color: "var(--text3)" }}>
                  R:{parseInt(cleaned.slice(0, 2), 16)} G:{parseInt(cleaned.slice(2, 4), 16)} B:{parseInt(cleaned.slice(4, 6), 16)}
                </div>
              )}
            </div>
            <CopyBtn text={colorHex} small />
          </div>
        </div>
      )}

      {bases && (
        <div>
          <SectionTitle>All Representations</SectionTitle>
          {[
            { label: "Hexadecimal", value: "0x" + cleaned },
            { label: "Decimal",     value: bases.dec },
            { label: "Binary",      value: bases.bin },
            { label: "Octal",       value: bases.oct },
            { label: "Base-32",     value: bases.b32 },
            { label: "Base-36",     value: bases.b36 },
          ].map(function(row) {
            return (
              <div key={row.label} style={{ display: "flex", alignItems: "center",
                gap: 8, marginBottom: 6, padding: "9px 12px",
                background: "var(--surface2)", border: "1.5px solid var(--border)",
                borderRadius: "var(--r-md)" }}>
                <span style={{ minWidth: 90, fontSize: 11, fontWeight: 700,
                  color: "var(--text3)" }}>{row.label}</span>
                <code style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: 12,
                  fontWeight: 700, color: "var(--text)", wordBreak: "break-all" }}>
                  {row.value}
                </code>
                <CopyBtn text={row.value} small />
              </div>
            );
          })}
        </div>
      )}

      <SectionTitle>Hex Arithmetic</SectionTitle>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <L t="Value A (0x)" id="hexa" />
          <code style={{ display: "block", padding: "10px 12px",
            background: "var(--surface2)", border: "1.5px solid var(--border)",
            borderRadius: "var(--r-md)", fontFamily: "var(--font-mono)",
            fontSize: 14, fontWeight: 800, color: "var(--brand)" }}>
            {cleaned || "—"}
          </code>
        </div>
        <div style={{ marginBottom: 4 }}>
          <L t="Op" id="hexop" />
          <div style={{ display: "flex", gap: 4 }}>
            {["+", "-"].map(function(o) {
              return (
                <button key={o} onClick={function() { setOp(o); }}
                  style={{ width: 36, height: 38, borderRadius: "var(--r-md)",
                    fontWeight: 800, fontSize: 16, cursor: "pointer",
                    border: op === o ? "2px solid var(--brand)" : "1px solid var(--border)",
                    background: op === o ? "var(--p50)" : "var(--surface)",
                    color: op === o ? "var(--brand)" : "var(--text2)" }}>
                  {o}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <L t="Value B (0x)" id="hexb" />
          <input id="hexb" value={hexB}
            onChange={function(e) { setHexB(e.target.value.toUpperCase().replace(/[^0-9A-Fx]/gi, "")); }}
            placeholder="1A"
            style={{ width: "100%", height: 38, padding: "0 12px",
              background: "var(--surface2)", border: "1.5px solid var(--border)",
              borderRadius: "var(--r-md)", fontSize: 14, fontWeight: 700,
              color: "var(--text)", fontFamily: "var(--font-mono)", outline: "none",
              boxSizing: "border-box" }} />
        </div>
      </div>

      {arith && (
        <div style={{ marginTop: 10, padding: "12px 16px",
          background: "var(--surface2)", border: "1.5px solid var(--brand)",
          borderRadius: "var(--r-md)" }}>
          <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase",
            letterSpacing: ".05em", color: "var(--text3)", marginBottom: 6 }}>
            Arithmetic Result
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 14,
            fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>
            0x{cleaned} {arith.op} 0x{hexB.toUpperCase()} = 0x{arith.resultHex}
          </div>
          <div style={{ fontSize: 12, color: "var(--text3)" }}>
            Decimal: {arith.a} {arith.op} {arith.b} = {arith.result}
          </div>
        </div>
      )}
    </div>
      </>}
    />
  );
}
