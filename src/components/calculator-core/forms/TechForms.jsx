import { useState, useEffect, useRef } from "react";
import { L, N, Sl, Sel, Tabs, Row2, Row3, Panel, buildResult, useCurrency } from "./SharedComponents.jsx";

// ── Subnet Calculator ─────────────────────────────────────────────────
export function SubnetForm() {
  const [ip, setIp] = useState("192.168.1.0");
  const [cidr, setCidr] = useState(24);
  const [res, setRes] = useState(null);

  useEffect(() => {
    const parts = ip.split(".").map(Number);
    if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) { setRes(null); return; }
    const maskBits = cidr;
    const mask = ~((1 << (32 - maskBits)) - 1) >>> 0;
    const ipInt = (parts[0] << 24 | parts[1] << 16 | parts[2] << 8 | parts[3]) >>> 0;
    const networkInt = (ipInt & mask) >>> 0;
    const broadcastInt = (networkInt | ~mask >>> 0) >>> 0;
    const firstHost = networkInt + 1;
    const lastHost = broadcastInt - 1;
    const hosts = Math.max(0, broadcastInt - networkInt - 1);

    const toIP = n => `${(n >>> 24) & 0xff}.${(n >>> 16) & 0xff}.${(n >>> 8) & 0xff}.${n & 0xff}`;
    const toMask = b => { const m = b === 0 ? 0 : ~((1 << (32 - b)) - 1) >>> 0; return toIP(m); };

    setRes(buildResult("Usable Hosts", hosts.toLocaleString(),
      [
        { label: "Network Address", value: toIP(networkInt) },
        { label: "Broadcast Address", value: toIP(broadcastInt) },
        { label: "Subnet Mask", value: toMask(maskBits) },
        { label: "Host Range", value: `${toIP(firstHost)} — ${toIP(lastHost)}` },
      ],
      [{ type: "tip", msg: `/24 = 254 hosts, /16 = 65,534, /8 = 16.7M. Each bit increase halves the available hosts.` }],
      null, [
        { label: "CIDR Notation", value: `${toIP(networkInt)}/${cidr}` },
        { label: "Wildcard Mask", value: toIP(~mask >>> 0) },
        { label: "Total Addresses", value: (hosts + 2).toLocaleString() },
        { label: "IP Class", value: parts[0] < 128 ? "Class A" : parts[0] < 192 ? "Class B" : parts[0] < 224 ? "Class C" : "Class D/E" },
      ]));
  }, [ip, cidr]);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <L t="IP Address" id="snip" />
        <input id="snip" value={ip} onChange={e => setIp(e.target.value)} placeholder="192.168.1.0"
          style={{ width: "100%", height: 42, padding: "0 14px", background: "var(--surface2)", border: "1.5px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 14, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-mono)", outline: "none" }} />
      </div>
      <Sl label="CIDR Prefix Length" id="sncidr" min={0} max={32} value={cidr} onChange={setCidr} fmt={v => `/${v}`} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {[8, 16, 24, 28, 30, 32].map(c => (
          <button key={c} onClick={() => setCidr(c)}
            style={{ padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700, border: cidr === c ? "2px solid var(--brand)" : "1px solid var(--border)", background: cidr === c ? "var(--p50)" : "var(--surface)", color: cidr === c ? "var(--brand)" : "var(--text2)", cursor: "pointer" }}>
            /{c}
          </button>
        ))}
      </div>
      {res && <Panel result={res} loading={null} label="Subnet" />}
    </div>
  );
}

// ── Number Base Converter ─────────────────────────────────────────────
export function NumberBaseForm() {
  const [input, setInput] = useState("255");
  const [fromBase, setFromBase] = useState("10");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const num = parseInt(input, +fromBase);
    if (isNaN(num)) { setRes(null); return; }
    setRes(buildResult("Converted", "0x" + num.toString(16).toUpperCase(),
      [
        { label: "Decimal (Base 10)", value: num.toString(10) },
        { label: "Binary (Base 2)", value: num.toString(2) },
        { label: "Octal (Base 8)", value: "0o" + num.toString(8) },
        { label: "Hexadecimal (Base 16)", value: "0x" + num.toString(16).toUpperCase() },
      ],
      [], null, [
        { label: "Base 32", value: num.toString(32).toUpperCase() },
        { label: "Base 36", value: num.toString(36).toUpperCase() },
      ]));
  }, [input, fromBase]);

  return (
    <div>
      <Sel label="Input Number Base" id="nbbase" value={fromBase} onChange={setFromBase} opts={[
        { v: "2", l: "Binary (Base 2)" }, { v: "8", l: "Octal (Base 8)" },
        { v: "10", l: "Decimal (Base 10)" }, { v: "16", l: "Hexadecimal (Base 16)" },
      ]} />
      <div style={{ marginBottom: 16 }}>
        <L t="Input Number" id="nbinput" />
        <input id="nbinput" value={input} onChange={e => setInput(e.target.value)} placeholder="e.g. 255"
          style={{ width: "100%", height: 42, padding: "0 14px", background: "var(--surface2)", border: "1.5px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 16, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-mono)", outline: "none", letterSpacing: ".05em" }} />
      </div>
      {res && <Panel result={res} loading={null} label="Number Base" />}
    </div>
  );
}

// ── ASCII / Unicode Converter ─────────────────────────────────────────
export function ASCIIForm() {
  const [text, setText] = useState("Hello");
  const [mode, setMode] = useState("Text → ASCII");
  const [res, setRes] = useState(null);

  useEffect(() => {
    if (!text) { setRes(null); return; }
    if (mode === "Text → ASCII") {
      const codes = Array.from(text).map(c => ({
        char: c, dec: c.charCodeAt(0), hex: c.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0"),
        bin: c.charCodeAt(0).toString(2).padStart(8, "0"),
      }));
      setRes(buildResult("ASCII Codes", codes.map(c => c.dec).join(", "),
        [
          { label: "Characters", value: text.length },
          { label: "Decimal", value: codes.map(c => c.dec).join(" ") },
          { label: "Hexadecimal", value: codes.map(c => "0x" + c.hex).join(" ") },
          { label: "Binary", value: codes.map(c => c.bin).join(" ") },
        ],
        [], null, codes.map(c => ({ label: `'${c.char}'`, value: `Dec:${c.dec}  Hex:0x${c.hex}  Bin:${c.bin}` }))));
    } else {
      const nums = text.split(/[\s,]+/).map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n) && n >= 0 && n <= 127);
      const result = nums.map(n => String.fromCharCode(n)).join("");
      setRes(buildResult("Text", result,
        [
          { label: "Output Text", value: result, highlight: true },
          { label: "Characters", value: nums.length },
        ],
        [], null, nums.map((n, i) => ({ label: String(n), value: String.fromCharCode(n) }))));
    }
  }, [text, mode]);

  return (
    <div>
      <Tabs tabs={["Text → ASCII", "ASCII → Text"]} active={mode} onChange={setMode} />
      <div style={{ marginBottom: 16 }}>
        <L t={mode === "Text → ASCII" ? "Enter Text" : "Enter ASCII Codes (space or comma separated)"} id="ascii_input" />
        <input id="ascii_input" value={text} onChange={e => setText(e.target.value)}
          placeholder={mode === "Text → ASCII" ? "Hello World" : "72 101 108 108 111"}
          style={{ width: "100%", height: 42, padding: "0 14px", background: "var(--surface2)", border: "1.5px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 14, color: "var(--text)", fontFamily: "var(--font-mono)", outline: "none" }} />
      </div>
      {res && <Panel result={res} loading={null} label="ASCII" />}
    </div>
  );
}

// ── Data Transfer Calculator ──────────────────────────────────────────
export function DataTransferForm() {
  const [fileSize, setFileSize] = useState("1");
  const [fileSizeUnit, setFileSizeUnit] = useState("GB");
  const [speed, setSpeed] = useState("100");
  const [speedUnit, setSpeedUnit] = useState("Mbps");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const sizeMultipliers = { KB: 1e3, MB: 1e6, GB: 1e9, TB: 1e12 };
    const speedMultipliers = { "Kbps": 1e3, "Mbps": 1e6, "Gbps": 1e9 };
    const bytes = +fileSize * sizeMultipliers[fileSizeUnit];
    const bitsPerSec = +speed * speedMultipliers[speedUnit];
    const seconds = (bytes * 8) / bitsPerSec;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.ceil(seconds % 60);
    const timeStr = hours > 0 ? `${hours}h ${minutes}m ${secs}s` : minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;
    setRes(buildResult("Transfer Time", timeStr,
      [
        { label: "File Size", value: `${fileSize} ${fileSizeUnit} (${(bytes / 1e6).toFixed(1)} MB)` },
        { label: "Connection Speed", value: `${speed} ${speedUnit}` },
        { label: "Download Time", value: timeStr, highlight: true },
        { label: "Transfer Rate", value: ((bytes / 1e6) / seconds).toFixed(2) + " MB/s" },
      ],
      [{ type: "tip", msg: `Actual transfer speeds are typically 60-80% of advertised speeds due to overhead and network conditions.` }],
      null, [
        { label: "At 10 Mbps", value: formatTime(bytes * 8 / 10e6) },
        { label: "At 100 Mbps", value: formatTime(bytes * 8 / 100e6) },
        { label: "At 1 Gbps", value: formatTime(bytes * 8 / 1e9) },
      ]));
  }, [fileSize, fileSizeUnit, speed, speedUnit]);

  function formatTime(secs) {
    const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = Math.ceil(secs % 60);
    return h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m ${s}s` : `${s}s`;
  }

  return (
    <div>
      <Row2>
        <N label="File Size" id="dts" value={fileSize} onChange={setFileSize} unit={fileSizeUnit} />
        <Sel label="Size Unit" id="dtsu" value={fileSizeUnit} onChange={setFileSizeUnit} opts={[{ v: "KB", l: "KB" }, { v: "MB", l: "MB" }, { v: "GB", l: "GB" }, { v: "TB", l: "TB" }]} />
      </Row2>
      <Row2>
        <N label="Transfer Speed" id="dtsp" value={speed} onChange={setSpeed} unit={speedUnit} />
        <Sel label="Speed Unit" id="dtspu" value={speedUnit} onChange={setSpeedUnit} opts={[{ v: "Kbps", l: "Kbps" }, { v: "Mbps", l: "Mbps" }, { v: "Gbps", l: "Gbps" }]} />
      </Row2>
      {res && <Panel result={res} loading={null} label="Data Transfer" />}
    </div>
  );
}

// ── Password Strength Calculator ──────────────────────────────────────
export function PasswordStrengthForm() {
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [res, setRes] = useState(null);

  useEffect(() => {
    if (!password) { setRes(null); return; }
    const len = password.length;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);
    const poolSize = (hasLower ? 26 : 0) + (hasUpper ? 26 : 0) + (hasDigit ? 10 : 0) + (hasSymbol ? 32 : 0);
    const entropy = len * Math.log2(poolSize || 1);
    const cracksPerSec = 1e10; // 10 billion attempts/sec
    const crackSeconds = Math.pow(2, entropy) / cracksPerSec;
    const crackTime = crackSeconds < 60 ? "< 1 minute"
      : crackSeconds < 3600 ? `${Math.round(crackSeconds / 60)} minutes`
      : crackSeconds < 86400 ? `${Math.round(crackSeconds / 3600)} hours`
      : crackSeconds < 31536000 ? `${Math.round(crackSeconds / 86400)} days`
      : crackSeconds < 31536000000 ? `${Math.round(crackSeconds / 31536000)} years`
      : "Centuries+";
    const score = entropy < 28 ? "Very Weak" : entropy < 36 ? "Weak" : entropy < 60 ? "Moderate" : entropy < 80 ? "Strong" : "Very Strong";
    const scoreColor = entropy < 28 ? "#ef4444" : entropy < 36 ? "#f97316" : entropy < 60 ? "#eab308" : entropy < 80 ? "#22c55e" : "#16a34a";
    const improvements = [];
    if (!hasLower) improvements.push("Add lowercase letters");
    if (!hasUpper) improvements.push("Add uppercase letters");
    if (!hasDigit) improvements.push("Add numbers");
    if (!hasSymbol) improvements.push("Add symbols (!@#$%)");
    if (len < 12) improvements.push("Make it at least 12 characters");
    setRes(buildResult("Strength", score,
      [
        { label: "Entropy", value: entropy.toFixed(1) + " bits" },
        { label: "Crack Time", value: crackTime, highlight: entropy >= 60, warn: entropy < 36 },
        { label: "Character Pool", value: poolSize + " characters" },
        { label: "Length", value: len + " characters" },
      ],
      improvements.map(msg => ({ type: "tip", msg })),
      null, [
        { label: "Lowercase", value: hasLower ? "✅" : "❌" },
        { label: "Uppercase", value: hasUpper ? "✅" : "❌" },
        { label: "Numbers", value: hasDigit ? "✅" : "❌" },
        { label: "Symbols", value: hasSymbol ? "✅" : "❌" },
      ]));
  }, [password]);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <L t="Enter Password to Test" id="pwd_input" />
        <div style={{ position: "relative" }}>
          <input id="pwd_input" type={showPwd ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Type your password here..."
            style={{ width: "100%", height: 42, padding: "0 48px 0 14px", background: "var(--surface2)", border: "1.5px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 15, color: "var(--text)", fontFamily: "var(--font-mono)", outline: "none" }} />
          <button onClick={() => setShowPwd(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16 }}>
            {showPwd ? "🙈" : "👁️"}
          </button>
        </div>
        <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>Your password is never sent to any server — all analysis runs locally in your browser.</p>
      </div>
      {password.length > 0 && (() => {
        const pool = (/[a-z]/.test(password) ? 26 : 0) + (/[A-Z]/.test(password) ? 26 : 0) + (/\d/.test(password) ? 10 : 0) + (/[^a-zA-Z0-9]/.test(password) ? 32 : 0);
        const entropyPct = Math.min(100, password.length * Math.log2(Math.max(1, pool)) / 80 * 100);
        const barColor = password.length < 6 ? "#ef4444" : password.length < 10 ? "#f97316" : "#22c55e";
        return (
          <div style={{ marginBottom: 16, height: 8, borderRadius: 4, background: "var(--surface2)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: entropyPct + "%", background: barColor, transition: "all .3s", borderRadius: 4 }} />
          </div>
        );
      })()}
      {res && <Panel result={res} loading={null} label="Password Strength" />}
    </div>
  );
}

// ── Hash Generator ────────────────────────────────────────────────────
export function HashGeneratorForm() {
  const [text, setText] = useState("Hello, World!");
  const [res, setRes] = useState(null);

  async function computeHash(message, algo) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest(algo, msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }

  useEffect(() => {
    if (!text) { setRes(null); return; }
    (async () => {
      try {
        const [sha1, sha256, sha512] = await Promise.all([
          computeHash(text, "SHA-1"),
          computeHash(text, "SHA-256"),
          computeHash(text, "SHA-512"),
        ]);
        setRes(buildResult("SHA-256", sha256.slice(0, 16) + "...",
          [
            { label: "Input Length", value: text.length + " chars" },
            { label: "SHA-256 Length", value: "256 bits (64 hex chars)" },
          ],
          [{ type: "tip", msg: "Cryptographic hashes are one-way — you cannot reverse a hash to get the original text." }],
          null, [
            { label: "SHA-1 (deprecated)", value: sha1 },
            { label: "SHA-256", value: sha256 },
            { label: "SHA-512 (first 64)", value: sha512.slice(0, 64) + "..." },
          ]));
      } catch { setRes(null); }
    })();
  }, [text]);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <L t="Input Text" id="hash_input" />
        <textarea id="hash_input" value={text} onChange={e => setText(e.target.value)} rows={4}
          style={{ width: "100%", padding: "12px 14px", background: "var(--surface2)", border: "1.5px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 13, color: "var(--text)", fontFamily: "var(--font-mono)", resize: "vertical", outline: "none" }} />
      </div>
      {res && <Panel result={res} loading={null} label="Hash Generator" />}
    </div>
  );
}

// ── Random String Generator ───────────────────────────────────────────
export function RandomStringForm() {
  const [length, setLength] = useState(16);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeDigits, setIncludeDigits] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [count, setCount] = useState(5);
  const [results, setResults] = useState([]);

  const generate = () => {
    let chars = "";
    if (includeLower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (includeUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeDigits) chars += "0123456789";
    if (includeSymbols) chars += "!@#$%^&*()-_=+[]{}|;:,.<>?";
    if (!chars) return;
    const generated = Array.from({ length: count }, () =>
      Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join(""));
    setResults(generated);
  };

  return (
    <div>
      <Sl label="String Length" id="rsl" min={4} max={128} value={length} onChange={setLength} fmt={v => `${v} chars`} />
      <Sl label="Number of Strings" id="rsc" min={1} max={20} value={count} onChange={setCount} fmt={v => `${v} strings`} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        {[["Lowercase (a-z)", includeLower, setIncludeLower], ["Uppercase (A-Z)", includeUpper, setIncludeUpper], ["Digits (0-9)", includeDigits, setIncludeDigits], ["Symbols (!@#)", includeSymbols, setIncludeSymbols]].map(([label, val, fn]) => (
          <label key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--text2)", cursor: "pointer" }}>
            <input type="checkbox" checked={val} onChange={e => fn(e.target.checked)} style={{ accentColor: "var(--brand)", width: 15, height: 15 }} />
            {label}
          </label>
        ))}
      </div>
      <button onClick={generate} style={{ width: "100%", padding: "12px", borderRadius: "var(--r-md)", background: "var(--brand)", color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", marginBottom: 16 }}>
        🎲 Generate Strings
      </button>
      {results.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {results.map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--surface2)", borderRadius: "var(--r-md)", border: "1px solid var(--border)" }}>
              <code style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text)", wordBreak: "break-all", flex: 1 }}>{s}</code>
              <button onClick={() => navigator.clipboard.writeText(s)} style={{ marginLeft: 8, padding: "4px 10px", borderRadius: "var(--r-md)", background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text3)", fontSize: 11, cursor: "pointer" }}>Copy</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Bandwidth Calculator ──────────────────────────────────────────────
export function BandwidthForm() {
  const [users, setUsers] = useState("50");
  const [avgUsage, setAvgUsage] = useState("5");
  const [concurrency, setConcurrency] = useState("30");
  const [overheadPct, setOverheadPct] = useState("20");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const u = +users, a = +avgUsage, c = +concurrency / 100, o = 1 + +overheadPct / 100;
    const concurrentUsers = Math.ceil(u * c);
    const rawBandwidth = concurrentUsers * a;
    const totalBandwidth = rawBandwidth * o;
    setRes(buildResult("Required Bandwidth", totalBandwidth.toFixed(1) + " Mbps",
      [
        { label: "Total Users", value: u },
        { label: "Concurrent Users", value: concurrentUsers + " (" + concurrency + "%)" },
        { label: "Raw Bandwidth", value: rawBandwidth.toFixed(1) + " Mbps" },
        { label: "With Overhead", value: totalBandwidth.toFixed(1) + " Mbps", highlight: true },
      ],
      [{ type: "tip", msg: `Plan for ${(totalBandwidth * 1.25).toFixed(0)} Mbps (25% headroom) to handle peak traffic spikes.` }],
      null, []));
  }, [users, avgUsage, concurrency, overheadPct]);

  return (
    <div>
      <N label="Total Users" id="bwu" value={users} onChange={setUsers} unit="users" />
      <N label="Average Usage per User" id="bwa" value={avgUsage} onChange={setAvgUsage} unit="Mbps" hint="Typical: 1-5 Mbps for web browsing, 5-25 for video" />
      <N label="Concurrency Rate (%)" id="bwc" value={concurrency} onChange={setConcurrency} unit="%" hint="Typical: 20-40% of users online simultaneously" />
      <N label="Network Overhead (%)" id="bwo" value={overheadPct} onChange={setOverheadPct} unit="%" hint="TCP/IP overhead, retransmissions etc." />
      {res && <Panel result={res} loading={null} label="Bandwidth" />}
    </div>
  );
}

// ── IP Range Calculator ───────────────────────────────────────────────
export function IPRangeForm() {
  const [network, setNetwork] = useState("192.168.1.0");
  const [mask, setMask] = useState("255.255.255.0");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const toInt = ip => ip.split(".").reduce((acc, oct) => (acc << 8) | +oct, 0) >>> 0;
    const toIP = n => `${(n >>> 24) & 0xff}.${(n >>> 16) & 0xff}.${(n >>> 8) & 0xff}.${n & 0xff}`;
    const netInt = toInt(network), maskInt = toInt(mask);
    const broadcastInt = (netInt | (~maskInt >>> 0)) >>> 0;
    const firstHost = netInt + 1, lastHost = broadcastInt - 1;
    const hosts = Math.max(0, broadcastInt - netInt - 1);
    setRes(buildResult("Usable IPs", hosts.toLocaleString(),
      [
        { label: "Network Address", value: toIP(netInt) },
        { label: "Broadcast Address", value: toIP(broadcastInt) },
        { label: "First Usable IP", value: toIP(firstHost) },
        { label: "Last Usable IP", value: toIP(lastHost) },
      ],
      [], null, [
        { label: "Wildcard Mask", value: toIP(~maskInt >>> 0) },
        { label: "Total Addresses", value: (hosts + 2).toLocaleString() },
      ]));
  }, [network, mask]);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <L t="Network Address" id="ipr_net" />
        <input id="ipr_net" value={network} onChange={e => setNetwork(e.target.value)} placeholder="192.168.1.0"
          style={{ width: "100%", height: 42, padding: "0 14px", background: "var(--surface2)", border: "1.5px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 14, fontFamily: "var(--font-mono)", color: "var(--text)", outline: "none" }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <L t="Subnet Mask" id="ipr_mask" />
        <input id="ipr_mask" value={mask} onChange={e => setMask(e.target.value)} placeholder="255.255.255.0"
          style={{ width: "100%", height: 42, padding: "0 14px", background: "var(--surface2)", border: "1.5px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 14, fontFamily: "var(--font-mono)", color: "var(--text)", outline: "none" }} />
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {[["255.255.255.0", "/24"], ["255.255.0.0", "/16"], ["255.0.0.0", "/8"], ["255.255.255.128", "/25"]].map(([m, label]) => (
          <button key={label} onClick={() => setMask(m)} style={{ padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700, border: "1px solid var(--border)", background: mask === m ? "var(--p50)" : "var(--surface)", color: mask === m ? "var(--brand)" : "var(--text2)", cursor: "pointer" }}>{label}</button>
        ))}
      </div>
      {res && <Panel result={res} loading={null} label="IP Range" />}
    </div>
  );
}

// ── Hexadecimal Calculator ────────────────────────────────────────────
export function HexForm() {
  const [hex, setHex] = useState("FF");
  const [res, setRes] = useState(null);

  useEffect(() => {
    const cleaned = hex.replace(/^0x/i, "").replace(/[^0-9a-fA-F]/g, "");
    if (!cleaned) { setRes(null); return; }
    const decimal = parseInt(cleaned, 16);
    setRes(buildResult("Decimal", decimal.toString(),
      [
        { label: "Hexadecimal", value: "0x" + cleaned.toUpperCase(), highlight: true },
        { label: "Decimal", value: decimal.toString() },
        { label: "Binary", value: decimal.toString(2) },
        { label: "Octal", value: "0o" + decimal.toString(8) },
      ],
      [], null, [
        { label: "Bit Length", value: decimal.toString(2).length + " bits" },
        { label: "Byte Length", value: Math.ceil(decimal.toString(2).length / 8) + " bytes" },
      ]));
  }, [hex]);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <L t="Hexadecimal Value" id="hex_input" />
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontFamily: "var(--font-mono)", fontWeight: 800, color: "var(--brand)", fontSize: 14 }}>0x</span>
          <input id="hex_input" value={hex} onChange={e => setHex(e.target.value.toUpperCase().replace(/[^0-9A-F]/g, ""))} placeholder="FF"
            style={{ width: "100%", height: 42, padding: "0 14px 0 38px", background: "var(--surface2)", border: "1.5px solid var(--border)", borderRadius: "var(--r-md)", fontSize: 16, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-mono)", outline: "none", letterSpacing: ".1em" }} />
        </div>
      </div>
      {res && <Panel result={res} loading={null} label="Hex Converter" />}
    </div>
  );
}
