import { Link } from "react-router-dom";

export function CalcCard({ calc }) {
  return (
    <Link to={`/calculator/${calc.slug}`}
      className="block no-underline rounded-2xl border p-5 card-hover"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: "#f0fdf4" }}>
          {calc.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-sm font-bold truncate" style={{ color: "var(--txt)" }}>{calc.name}</h3>
            {calc.popular && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #86efac" }}>
                Popular
              </span>
            )}
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "var(--txt3)" }}>{calc.description}</p>
        </div>
      </div>
    </Link>
  );
}
