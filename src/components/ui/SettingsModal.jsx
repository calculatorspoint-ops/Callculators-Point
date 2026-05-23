import { useAppStore } from "@/store/useAppStore.js";
import { X } from "lucide-react";

export function SettingsModal({ onClose }) {
  const { unitSystem, setUnitSystem, theme, toggleTheme } = useAppStore();
  
  const setTheme = (t) => {
    if (t !== theme) toggleTheme();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[var(--card)] w-full max-w-md rounded-2xl p-6 shadow-xl relative" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--text)]">Settings</h2>
          <button onClick={onClose} className="p-2 text-[var(--text2)] hover:text-[var(--text)] rounded-full hover:bg-[var(--hover)] transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Theme */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[var(--text2)]">Appearance</label>
            <div className="flex gap-2">
              <button 
                onClick={() => setTheme('light')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium border transition-colors ${theme === 'light' ? 'bg-[var(--primary)] text-white border-transparent' : 'bg-transparent text-[var(--text)] border-[var(--border)] hover:bg-[var(--hover)]'}`}
              >
                Light
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium border transition-colors ${theme === 'dark' ? 'bg-[var(--primary)] text-white border-transparent' : 'bg-transparent text-[var(--text)] border-[var(--border)] hover:bg-[var(--hover)]'}`}
              >
                Dark
              </button>
            </div>
          </div>

          {/* Unit System */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[var(--text2)]">Measurement Units</label>
            <div className="flex gap-2">
              <button 
                onClick={() => setUnitSystem('metric')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium border transition-colors ${unitSystem === 'metric' ? 'bg-[var(--primary)] text-white border-transparent' : 'bg-transparent text-[var(--text)] border-[var(--border)] hover:bg-[var(--hover)]'}`}
              >
                Metric (kg/cm)
              </button>
              <button 
                onClick={() => setUnitSystem('imperial')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium border transition-colors ${unitSystem === 'imperial' ? 'bg-[var(--primary)] text-white border-transparent' : 'bg-transparent text-[var(--text)] border-[var(--border)] hover:bg-[var(--hover)]'}`}
              >
                Imperial (lb/in)
              </button>
            </div>
            <p className="text-xs text-[var(--text3)] mt-1">This will be the default for Health & Fitness calculators.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
