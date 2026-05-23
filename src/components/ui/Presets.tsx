export interface Preset {
  label: string;
  [key: string]: any;
}

interface PresetsProps {
  presets?: Preset[];
  onApply: (preset: Preset) => void;
}

export function Presets({ presets, onApply }: PresetsProps) {
  if (!presets?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mb-4">
      <span className="text-xs self-center font-semibold" style={{ color:"var(--txt3)" }}>Try:</span>
      {presets.map((p, i) => (
        <button key={i} onClick={() => onApply(p)}
          className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
          style={{ background:"var(--bg2)", color:"var(--txt2)", borderColor:"var(--border)" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor="var(--brand)"; e.currentTarget.style.color="var(--brand)"; e.currentTarget.style.background="var(--brand-l)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--txt2)"; e.currentTarget.style.background="var(--bg2)"; }}>
          {p.label}
        </button>
      ))}
    </div>
  );
}
