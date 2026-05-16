# CalcPoint – React + Firebase Calculator Platform

## Tech Stack
- **React 18** + **Vite** (SPA with lazy loading)
- **Tailwind CSS** (design system)
- **React Router v6** (client-side routing)
- **Recharts** (interactive charts)
- **Zustand** (state management)
- **Firebase Hosting** (deployment)
- **Firestore** (saved calculations)
- **Firebase Analytics** (usage tracking)

## Quick Start
```bash
npm install
cp .env.example .env.local
# Fill in your Firebase credentials in .env.local
npm run dev
```

## Build & Deploy
```bash
npm run build
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Project Structure
```
src/
  components/
    ui/              → Reusable UI atoms (ResultBox, InputField, etc.)
    charts/          → Chart components using Recharts
    calculator-core/ → CalculatorWidget (the engine renderer)
  calculators/       → Calculator-specific overrides (if needed)
  data/
    calculatorConfigs.js → Master config for ALL calculators
  firebase/
    config.js        → Firebase init
    firestore.js     → DB helpers (save, load calculations)
  hooks/
    useCalculator.js → Core hook: inputs → calculation → outputs
  pages/
    Home.jsx, Calculator.jsx, Category.jsx, AllCalculators.jsx
  store/
    useAppStore.js   → Zustand: theme, currency, favorites, recent
  utils/
    calculationEngine.js → Pure formula functions
  styles/
    index.css        → Tailwind + CSS variables
```

## Adding a New Calculator
1. Add entry to `src/data/calculatorConfigs.js`
2. Add formula to `src/utils/calculationEngine.js`
3. That's it — the engine renders it automatically

## SEO Strategy (React SPA)
- `react-helmet-async` injects per-page meta tags
- JSON-LD structured data on every calculator page
- FAQ schema for rich snippets
- Canonical URLs for all pages
- Firebase Hosting CDN caches assets with aggressive headers
- Optional: `react-snap` for pre-rendering static HTML

## Firebase Setup
1. Create project at console.firebase.google.com
2. Enable Firestore (start in test mode)
3. Enable Analytics
4. Enable Hosting
5. Copy credentials to .env.local
6. `firebase deploy`

## SEO Pre-rendering (Optional but recommended)
```bash
npm install -D react-snap
# Add to package.json: "postbuild": "react-snap"
```
This generates static HTML snapshots for search bots.
