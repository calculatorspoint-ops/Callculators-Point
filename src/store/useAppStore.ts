import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";
export type UnitSystem = "metric" | "imperial";

export interface SavedCalculation {
  id?: number | string;
  ts?: string;
  [key: string]: any;
}

export interface CalculationHistory {
  id?: number | string;
  ts?: string;
  [key: string]: any;
}

export interface AppState {
  theme: Theme;
  currency: string;
  unitSystem: UnitSystem;
  favorites: string[];
  recent: string[];
  savedLocally: SavedCalculation[];
  activeCalc: unknown | null;
  searchHistory: string[];
  calcHistory: CalculationHistory[];

  toggleTheme: () => void;
  setCurrency: (currency: string) => void;
  setUnitSystem: (system: UnitSystem) => void;
  setActiveCalc: (calc: unknown | null) => void;
  addRecent: (id: string) => void;
  toggleFavorite: (id: string) => void;
  saveLocally: (calc: Omit<SavedCalculation, "id" | "ts">) => void;
  removeSaved: (id: number | string) => void;
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  addCalcHistory: (entry: Omit<CalculationHistory, "id" | "ts">) => void;
  clearCalcHistory: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme:        "light",
      currency:     "USD",   // geo-engine overrides this on first load
      unitSystem:   "metric", // "metric" or "imperial"
      favorites:    [],
      recent:       [],      // recently visited calculator IDs
      savedLocally: [],
      activeCalc:   null,
      searchHistory: [],     // recently searched queries
      calcHistory:  [],      // saved calculation results with inputs

      toggleTheme: () => {
        const next = get().theme === "light" ? "dark" : "light";
        set({ theme: next });
        document.documentElement.classList.toggle("dark", next === "dark");
      },
      setCurrency: (c) => set({ currency: c }),
      setUnitSystem: (system) => set({ unitSystem: system }),
      setActiveCalc: (calc) => set({ activeCalc: calc }),

      addRecent: (id) =>
        set(s => ({ recent: [id, ...s.recent.filter(r => r !== id)].slice(0, 10) })),

      toggleFavorite: (id) =>
        set(s => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter(f => f !== id)
            : [...s.favorites, id],
        })),

      saveLocally: (calc) =>
        set(s => ({
          savedLocally: [{ ...calc, id: Date.now(), ts: new Date().toISOString() }, ...s.savedLocally].slice(0, 50),
        })),

      removeSaved: (id) =>
        set(s => ({ savedLocally: s.savedLocally.filter(c => c.id !== id) })),

      addSearchHistory: (query) => {
        if (!query?.trim()) return;
        set(s => ({
          searchHistory: [query, ...s.searchHistory.filter(q => q !== query)].slice(0, 10),
        }));
      },

      clearSearchHistory: () => set({ searchHistory: [] }),

      addCalcHistory: (entry) =>
        set(s => ({
          calcHistory: [{ ...entry, id: Date.now(), ts: new Date().toISOString() }, ...s.calcHistory].slice(0, 100),
        })),

      clearCalcHistory: () => set({ calcHistory: [] }),
    }),
    {
      name: "CalculatorsPoint-v3",
      partialize: s => ({
        theme:         s.theme,
        currency:      s.currency,
        unitSystem:    s.unitSystem,
        favorites:     s.favorites,
        recent:        s.recent,
        savedLocally:  s.savedLocally,
        searchHistory: s.searchHistory,
        calcHistory:   s.calcHistory,
      }),
    }
  )
);
