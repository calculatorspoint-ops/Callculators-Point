import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }

  reset() {
    this.setState({ hasError: false, error: null, errorInfo: null });
  }

  render() {
    if (this.state.hasError) {
      const errMsg = this.state.error?.message || this.state.error?.toString() || "Unknown error";

      return (
        <div style={{
          minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center",
          padding: "40px 20px",
        }}>
          <div style={{
            background: "var(--surface, #fff)",
            border: "1.5px solid var(--border, #e2e8f0)",
            borderRadius: 20,
            padding: "40px 32px",
            maxWidth: 520,
            width: "100%",
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(15,23,42,0.08)",
          }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>⚠️</div>
            <h2 style={{
              fontSize: 20, fontWeight: 800,
              color: "var(--red, #ef4444)",
              marginBottom: 10, fontFamily: "var(--font)",
            }}>
              Something went wrong
            </h2>
            <p style={{
              color: "var(--text2, #64748b)",
              fontSize: 14, lineHeight: 1.7,
              marginBottom: 8,
            }}>
              The page encountered an unexpected error. You can try resetting or go back to the home page.
            </p>

            {/* Always show a short sanitized error hint */}
            <div style={{
              background: "var(--red-l, #fef2f2)",
              border: "1px solid var(--red-ll, #fecaca)",
              borderRadius: 10, padding: "10px 14px",
              marginBottom: 24, textAlign: "left",
            }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: "var(--red, #ef4444)", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".06em" }}>Error detail</p>
              <code style={{ fontSize: 12, color: "#991b1b", wordBreak: "break-all", fontFamily: "var(--font-mono)" }}>
                {errMsg.length > 200 ? errMsg.slice(0, 200) + "…" : errMsg}
              </code>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={this.reset}
                style={{
                  padding: "10px 22px", borderRadius: 12,
                  background: "var(--brand, #2563eb)", color: "#fff",
                  fontWeight: 700, fontSize: 14, cursor: "pointer",
                  border: "none", fontFamily: "var(--font)",
                  boxShadow: "0 4px 14px rgba(37,99,235,.3)",
                  transition: "background .15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--brand-d, #1D4ED8)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--brand, #2563eb)"}
              >
                🔄 Try Again
              </button>
              <a
                href="/"
                style={{
                  padding: "10px 22px", borderRadius: 12,
                  background: "var(--surf2, #f8fafc)",
                  border: "1.5px solid var(--border, #e2e8f0)",
                  color: "var(--text2, #475569)",
                  fontWeight: 700, fontSize: 14, cursor: "pointer",
                  fontFamily: "var(--font)", textDecoration: "none",
                  display: "inline-flex", alignItems: "center", gap: 6,
                }}
              >
                🏠 Go Home
              </a>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: "10px 22px", borderRadius: 12,
                  background: "transparent",
                  border: "1.5px solid var(--border, #e2e8f0)",
                  color: "var(--text3, #94a3b8)",
                  fontWeight: 600, fontSize: 13, cursor: "pointer",
                  fontFamily: "var(--font)",
                }}
              >
                ↺ Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
