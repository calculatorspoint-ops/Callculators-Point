import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding:"40px 20px", textAlign:"center", maxWidth:600, margin:"0 auto" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>⚠️</div>
          <h2 style={{ fontSize:22, fontWeight:800, color:"var(--red)", marginBottom:10 }}>
            Something went wrong.
          </h2>
          <p style={{ color:"var(--text2)", marginBottom:20, lineHeight:1.6 }}>
            The calculator encountered an unexpected error. Please try resetting the form or refreshing the page.
          </p>
          {process.env.NODE_ENV !== "production" && (
            <pre style={{ textAlign:"left", background:"#fef2f2", color:"#991b1b", padding:16, borderRadius:8, fontSize:12, overflowX:"auto", border:"1px solid #fecaca", marginBottom:20 }}>
              {this.state.error?.toString()}
            </pre>
          )}
          <button 
            onClick={() => window.location.reload()}
            style={{ padding:"10px 24px", borderRadius:100, background:"var(--brand)", color:"#fff", fontWeight:700, cursor:"pointer" }}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
