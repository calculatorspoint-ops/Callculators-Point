/**
 * SettingsModal.jsx
 *
 * ACCESSIBILITY FIXES:
 *  - role="dialog" + aria-modal="true" + aria-labelledby on the panel
 *  - Close button has aria-label="Close settings dialog"
 *  - Theme and Unit toggle buttons have aria-pressed for screen readers
 *  - Focus trap: Tab/Shift+Tab stays inside modal (WCAG 2.1.1)
 *  - Focus moves to dialog on open; returns to trigger on close
 *  - Escape key closes the modal
 */
import { useRef, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { X } from "lucide-react";
import { useFocusTrap } from "@/hooks/useFocusTrap";

export function SettingsModal({ onClose, triggerRef }) {
  const { unitSystem, setUnitSystem, theme, toggleTheme } = useAppStore();
  const panelRef = useRef(null);

  const setTheme = (t) => {
    if (t !== theme) toggleTheme();
  };

  // Focus trap: keeps Tab/Shift+Tab inside the modal while open
  useFocusTrap(panelRef, true, triggerRef);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    /*
     * Backdrop: click outside closes, but the dialog panel stops propagation.
     * aria-hidden on backdrop prevents double-announcement of overlay.
     */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-heading"
        className="bg-[var(--card)] w-full max-w-md rounded-2xl p-6 shadow-xl relative"
        onClick={e => e.stopPropagation()}
        aria-hidden="false"
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            id="settings-modal-heading"
            className="text-xl font-bold text-[var(--text)]"
          >
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-[var(--text2)] hover:text-[var(--text)] rounded-full hover:bg-[var(--hover)] transition-colors"
            aria-label="Close settings dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Theme */}
          <div className="flex flex-col gap-2">
            <p
              id="appearance-label"
              className="text-sm font-semibold text-[var(--text2)]"
            >
              Appearance
            </p>
            {/* role="group" groups the two choices under their label */}
            <div
              role="group"
              aria-labelledby="appearance-label"
              className="flex gap-2"
            >
              <button
                onClick={() => setTheme('light')}
                aria-pressed={theme === 'light'}
                className={`flex-1 py-2 px-4 rounded-lg font-medium border transition-colors ${
                  theme === 'light'
                    ? 'bg-[var(--primary)] text-white border-transparent'
                    : 'bg-transparent text-[var(--text)] border-[var(--border)] hover:bg-[var(--hover)]'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                aria-pressed={theme === 'dark'}
                className={`flex-1 py-2 px-4 rounded-lg font-medium border transition-colors ${
                  theme === 'dark'
                    ? 'bg-[var(--primary)] text-white border-transparent'
                    : 'bg-transparent text-[var(--text)] border-[var(--border)] hover:bg-[var(--hover)]'
                }`}
              >
                Dark
              </button>
            </div>
          </div>

          {/* Unit System */}
          <div className="flex flex-col gap-2">
            <p
              id="units-label"
              className="text-sm font-semibold text-[var(--text2)]"
            >
              Measurement Units
            </p>
            <div
              role="group"
              aria-labelledby="units-label"
              className="flex gap-2"
            >
              <button
                onClick={() => setUnitSystem('metric')}
                aria-pressed={unitSystem === 'metric'}
                className={`flex-1 py-2 px-4 rounded-lg font-medium border transition-colors ${
                  unitSystem === 'metric'
                    ? 'bg-[var(--primary)] text-white border-transparent'
                    : 'bg-transparent text-[var(--text)] border-[var(--border)] hover:bg-[var(--hover)]'
                }`}
              >
                Metric (kg/cm)
              </button>
              <button
                onClick={() => setUnitSystem('imperial')}
                aria-pressed={unitSystem === 'imperial'}
                className={`flex-1 py-2 px-4 rounded-lg font-medium border transition-colors ${
                  unitSystem === 'imperial'
                    ? 'bg-[var(--primary)] text-white border-transparent'
                    : 'bg-transparent text-[var(--text)] border-[var(--border)] hover:bg-[var(--hover)]'
                }`}
              >
                Imperial (lb/in)
              </button>
            </div>
            <p className="text-xs text-[var(--text3)] mt-1">
              This will be the default for Health &amp; Fitness calculators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
