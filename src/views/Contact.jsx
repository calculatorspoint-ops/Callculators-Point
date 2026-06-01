'use client';
import { useState } from "react";
import Link from "next/link";
import { Mail, AlertCircle, Lightbulb, Bug, HelpCircle, Send, Check } from "lucide-react";
import { submitContactForm } from "@/lib/firebase/firestore";

const INQUIRY_TYPES = [
  { id:"bug",        icon:<Bug size={16}/>,          label:"Bug Report",             desc:"Something isn't working correctly" },
  { id:"suggestion", icon:<Lightbulb size={16}/>,   label:"Feature Suggestion",     desc:"Idea for a new calculator or improvement" },
  { id:"accuracy",   icon:<AlertCircle size={16}/>,  label:"Accuracy Concern",       desc:"A calculation result seems wrong" },
  { id:"general",    icon:<HelpCircle size={16}/>,   label:"General Question",       desc:"Anything else you'd like to ask" },
  { id:"business",   icon:<Mail size={16}/>,          label:"Business / Partnership", desc:"Collaboration, advertising, or licensing" },
];

const FAQ_CONTACT = [
  { q:"How quickly will you respond?",                       a:"We aim to respond within 24–48 business hours. Bug reports and accuracy concerns are given highest priority." },
  { q:"Do you accept calculator requests?",                  a:"Absolutely! We love suggestions. If a calculator gets multiple requests, it jumps to the top of our build queue." },
  { q:"I found a calculation error — what should I do?",     a:"Please use the 'Accuracy Concern' type and include: the calculator name, the inputs you used, the result you got, and what you expected. This helps us fix it quickly." },
  { q:"Can I embed Calculators Point calculators on my website?", a:"We're working on embeddable widgets. Use the Business/Partnership inquiry type to discuss early access." },
  { q:"Is there an API?",                                    a:"Not currently publicly available. Contact us via the Business inquiry type to discuss API access." },
];

function validate(form) {
  const errors = {};
  if (!form.name.trim())    errors.name    = "Name is required";
  if (!form.email.trim())   errors.email   = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "Please enter a valid email";
  if (!form.type)            errors.type    = "Please select an inquiry type";
  if (!form.message.trim()) errors.message = "Message is required";
  else if (form.message.trim().length < 20) errors.message = "Please provide more detail (at least 20 characters)";
  return errors;
}

export default function Contact() {
  const [form, setForm]       = useState({ name:"", email:"", type:"", subject:"", message:"" });
  const [errors, setErrors]   = useState({});
  const [submitted, setSubmitted]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [submitError, setSubmitError] = useState("");

  const update = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setSubmitError("");
    try {
      // Timeout after 10s — prevents infinite loading if Firebase is unreachable
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 10000)
      );
      await Promise.race([
        submitContactForm({
          name:    form.name.trim(),
          email:   form.email.trim(),
          type:    form.type,
          subject: form.subject.trim(),
          message: form.message.trim(),
        }),
        timeout,
      ]);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err?.message === "timeout"
          ? "Request timed out. Please check your connection and try again."
          : "Something went wrong. Please try again in a moment."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    width:"100%", height:44, padding:"0 14px",
    background:"var(--surf2)", color:"var(--text)",
    border:`1.5px solid ${errors[field]?"var(--red)":"var(--border)"}`,
    borderRadius:"var(--r-md)", fontSize:15, fontFamily:"var(--font)",
    outline:"none", transition:"border-color .15s",
  });

  return (
    <>
      <div className="page-hero">
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:44, marginBottom:14 }}>📬</div>
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Bug reports, suggestions, accuracy concerns — all are welcome.</p>
        </div>
      </div>

      <div className="page-wrap" style={{ maxWidth:960 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:28 }} id="contact-grid">
          <style>{`@media(max-width:768px){#contact-grid{grid-template-columns:1fr!important}}`}</style>
          <div style={{ background: "red", color: "white", padding: 10, gridColumn: "1 / -1" }}>
            DEBUG: API KEY START: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 5) || "MISSING"} | PROJECT: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "MISSING"}
          </div>

          {/* ═══ FORM ═══════════════════════════════════════════════ */}
          <div>
            {submitted ? (
              <div style={{ textAlign:"center", padding:"48px 32px", background:"var(--surface)", border:"1px solid var(--green-ll)", borderRadius:"var(--r-2xl)", boxShadow:"var(--sh2)" }}>
                <div style={{ width:64, height:64, borderRadius:"50%", background:"var(--green-l)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
                  <Check size={28} color="var(--green)"/>
                </div>
                <h2 style={{ fontFamily:"var(--font-hd)", fontSize:"1.4rem", fontWeight:900, color:"var(--text)", marginBottom:10 }}>Message Sent! 🎉</h2>
                <p style={{ fontSize:14, color:"var(--text2)", marginBottom:8, lineHeight:1.7 }}>
                  Thanks for reaching out, <strong>{form.name}</strong>! We've received your message and will reply to <strong>{form.email}</strong> within 24–48 hours.
                </p>
                <p style={{ fontSize:13, color:"var(--text3)", marginBottom:24 }}>
                  In the meantime, check out our FAQ below or browse our calculators.
                </p>
                <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
                  <button onClick={()=>{ setSubmitted(false); setForm({name:"",email:"",type:"",subject:"",message:""}); }}
                    className="btn-outline">Send Another Message</button>
                  <Link href="/calculators" className="btn-primary" style={{ fontSize:13 }}>Browse Calculators</Link>
                </div>
              </div>
            ) : (
              <div className="content-card">
                <h2>Send Us a Message</h2>
                <p>Fill in the form below and we'll get back to you as soon as possible.</p>

                <form onSubmit={handleSubmit} noValidate style={{ marginTop:20 }}>
                  {/* Inquiry type */}
                  <div style={{ marginBottom:18 }}>
                    <label style={{ display:"block", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".07em", color:"var(--text3)", marginBottom:8 }}>
                      Inquiry Type <span style={{ color:"var(--red)" }}>*</span>
                    </label>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                      {INQUIRY_TYPES.map(type => (
                        <button key={type.id} type="button" onClick={() => update("type", type.id)}
                          style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"12px 14px", borderRadius:"var(--r-lg)", textAlign:"left", cursor:"pointer", fontFamily:"var(--font)", transition:"all .15s",
                            background: form.type===type.id ? "var(--brand-l)" : "var(--surf2)",
                            border: `1.5px solid ${form.type===type.id ? "var(--brand)" : errors.type ? "var(--red)" : "var(--border)"}`,
                            color: form.type===type.id ? "var(--brand)" : "var(--text2)" }}>
                          <span style={{ flexShrink:0, marginTop:1, color: form.type===type.id ? "var(--brand)" : "var(--text3)" }}>{type.icon}</span>
                          <div>
                            <div style={{ fontSize:13, fontWeight:700 }}>{type.label}</div>
                            <div style={{ fontSize:11, opacity:.7, marginTop:2 }}>{type.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                    {errors.type && <p style={{ fontSize:11, color:"var(--red)", marginTop:5, fontWeight:600 }}>⚠ {errors.type}</p>}
                  </div>

                  {/* Name + Email */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                    <div>
                      <label style={{ display:"block", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".07em", color:"var(--text3)", marginBottom:7 }}>
                        Your Name <span style={{ color:"var(--red)" }}>*</span>
                      </label>
                      <input type="text" value={form.name} onChange={e=>update("name",e.target.value)}
                        placeholder="John Smith" style={inputStyle("name")}
                        onFocus={e=>e.target.style.borderColor="var(--brand)"} onBlur={e=>e.target.style.borderColor=errors.name?"var(--red)":"var(--border)"}/>
                      {errors.name && <p style={{ fontSize:11, color:"var(--red)", marginTop:4, fontWeight:600 }}>⚠ {errors.name}</p>}
                    </div>
                    <div>
                      <label style={{ display:"block", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".07em", color:"var(--text3)", marginBottom:7 }}>
                        Email Address <span style={{ color:"var(--red)" }}>*</span>
                      </label>
                      <input type="email" value={form.email} onChange={e=>update("email",e.target.value)}
                        placeholder="john@example.com" style={inputStyle("email")}
                        onFocus={e=>e.target.style.borderColor="var(--brand)"} onBlur={e=>e.target.style.borderColor=errors.email?"var(--red)":"var(--border)"}/>
                      {errors.email && <p style={{ fontSize:11, color:"var(--red)", marginTop:4, fontWeight:600 }}>⚠ {errors.email}</p>}
                    </div>
                  </div>

                  {/* Subject */}
                  <div style={{ marginBottom:14 }}>
                    <label style={{ display:"block", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".07em", color:"var(--text3)", marginBottom:7 }}>
                      Subject (optional)
                    </label>
                    <input type="text" value={form.subject} onChange={e=>update("subject",e.target.value)}
                      placeholder="e.g. EMI Calculator — wrong result for 20-year tenure" style={inputStyle("subject")}
                      onFocus={e=>e.target.style.borderColor="var(--brand)"} onBlur={e=>e.target.style.borderColor="var(--border)"}/>
                  </div>

                  {/* Message */}
                  <div style={{ marginBottom:20 }}>
                    <label style={{ display:"block", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".07em", color:"var(--text3)", marginBottom:7 }}>
                      Message <span style={{ color:"var(--red)" }}>*</span>
                    </label>
                    <textarea value={form.message} onChange={e=>update("message",e.target.value)}
                      placeholder="Please describe your issue, suggestion, or question in detail..."
                      rows={6}
                      style={{ width:"100%", padding:"12px 14px", background:"var(--surf2)", color:"var(--text)", border:`1.5px solid ${errors.message?"var(--red)":"var(--border)"}`, borderRadius:"var(--r-md)", fontSize:14, fontFamily:"var(--font)", outline:"none", resize:"vertical", lineHeight:1.6, transition:"border-color .15s" }}
                      onFocus={e=>e.target.style.borderColor="var(--brand)"} onBlur={e=>e.target.style.borderColor=errors.message?"var(--red)":"var(--border)"}/>
                    <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                      {errors.message ? <p style={{ fontSize:11, color:"var(--red)", fontWeight:600 }}>⚠ {errors.message}</p> : <span/>}
                      <span style={{ fontSize:11, color:"var(--text3)" }}>{form.message.length} chars</span>
                    </div>
                  </div>

                  {/* Submit error */}
                  {submitError && (
                    <p style={{ fontSize:13, color:"var(--red)", fontWeight:600, marginBottom:12, padding:"10px 14px", background:"rgba(220,53,69,.08)", borderRadius:"var(--r-md)", border:"1px solid var(--red)" }}>
                      ⚠ {submitError}
                    </p>
                  )}

                  <button type="submit" disabled={loading}
                    style={{ width:"100%", padding:"13px 20px", background:loading?"var(--border)":"linear-gradient(135deg,var(--brand),var(--brand-d))", color:"#fff", borderRadius:"var(--r-lg)", fontSize:15, fontWeight:700, border:"none", cursor:loading?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"all .15s", boxShadow:loading?"none":"var(--sh-brand)", fontFamily:"var(--font)" }}>
                    {loading ? (
                      <><div style={{ width:18, height:18, border:"2px solid rgba(255,255,255,.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin .8s linear infinite" }}/> Sending…</>
                    ) : (
                      <><Send size={16}/> Send Message</>
                    )}
                  </button>
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </form>
              </div>
            )}
          </div>

          {/* ═══ SIDEBAR ════════════════════════════════════════════ */}
          <aside>
            <div className="content-card" style={{ marginBottom:16 }}>
              <h2 style={{ fontSize:"1rem" }}>Quick Info</h2>
              {[
                { icon:"⏱️", title:"Response Time",   desc:"Within 24–48 business hours" },
                { icon:"🌍", title:"Language",         desc:"English (primary)" },
                { icon:"📋", title:"What to include",  desc:"For bugs: calculator name, inputs used, and expected vs actual result" },
                { icon:"🔒", title:"Your data",        desc:"Messages are stored securely in Firebase. We never share your email." },
              ].map(item => (
                <div key={item.title} style={{ display:"flex", gap:12, padding:"10px 0", borderBottom:"1px solid var(--bord2)" }}>
                  <span style={{ fontSize:18, flexShrink:0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:"var(--text)", marginBottom:2 }}>{item.title}</div>
                    <div style={{ fontSize:12, color:"var(--text3)" }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="content-card">
              <h2 style={{ fontSize:"1rem" }}>Before You Contact</h2>
              <p style={{ fontSize:13, marginBottom:14 }}>Your answer might already be here:</p>
              {[
                ["Privacy Policy",   "/privacy-policy", "How we handle data"],
                ["Disclaimer",       "/disclaimer",     "About result accuracy"],
                ["All Calculators",  "/calculators",    "Browse all 200+ tools"],
              ].map(([l, h, d]) => (
                <Link key={h} href={h}
                  style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid var(--bord2)", textDecoration:"none", fontSize:13, color:"var(--text2)", transition:"color .15s" }}
                  onMouseEnter={e=>e.currentTarget.style.color="var(--brand)"}
                  onMouseLeave={e=>e.currentTarget.style.color="var(--text2)"}>
                  <div><div style={{ fontWeight:600, color:"inherit" }}>{l}</div><div style={{ fontSize:11, color:"var(--text3)" }}>{d}</div></div>
                  <span style={{ color:"var(--text3)" }}>→</span>
                </Link>
              ))}
            </div>
          </aside>
        </div>

        {/* ═══ FAQ ════════════════════════════════════════════════════ */}
        <div style={{ marginTop:36 }}>
          <h2 style={{ fontFamily:"var(--font-hd)", fontSize:"1.3rem", fontWeight:900, color:"var(--text)", marginBottom:18, letterSpacing:"-.03em" }}>
            Frequently Asked Contact Questions
          </h2>
          {FAQ_CONTACT.map((faq, i) => (
            <details key={i}>
              <summary>{faq.q}</summary>
              <div className="faq-body">{faq.a}</div>
            </details>
          ))}
        </div>
      </div>
    </>
  );
}
