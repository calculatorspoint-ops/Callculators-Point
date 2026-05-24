# CalcPoint – Next.js Calculator Platform

## Tech Stack
- **Next.js 15** (App Router, SSR/SSG, Server Components)
- **React 18**
- **Tailwind CSS** (design system)
- **Recharts** (interactive charts)
- **Zustand** (state management and local storage)
- **Vercel** (deployment and edge caching)

## Quick Start
```bash
npm install
npm run dev
```

## Build & Deploy (Vercel)
The project is optimized for deployment on Vercel. Pushing to the `main` branch will automatically trigger a deployment. To deploy manually:
```bash
npx vercel --prod
```

## Project Structure
```
src/
  app/               → Next.js App Router pages and layouts
  components/
    ui/              → Reusable UI atoms (ResultBox, InputField, etc.)
    charts/          → Chart components using Recharts
    calculator-core/ → CalculatorWidget (the engine renderer)
  data/
    calculatorConfigs.js → Master config for ALL calculators
  hooks/
    useCalculator.js → Core hook: inputs → calculation → outputs
  store/
    useAppStore.js   → Zustand: theme, currency, favorites, recent
  core/
    calculationEngine.js → Pure formula functions
  styles/
    index.css        → Tailwind + CSS variables
```

## Adding a New Calculator
1. Add entry to `src/data/calculatorConfigs.js`
2. Add formula to `src/core/calculationEngine.js`
3. That's it — the engine renders it automatically

## SEO Strategy (Next.js)
- Server-Side Rendering (SSR) and Static Site Generation (SSG) for all calculator pages.
- Native Next.js Metadata API for SEO tags and dynamic Open Graph images.
- JSON-LD structured data and FAQ schema injected natively into server components.
- Vercel Edge caching for immediate global delivery.

## Validation & Testing
We have added scripts to validate the calculator configs and ensure no duplicate slugs exist.
```bash
npm run validate:calculators
```
