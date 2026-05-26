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
app/
  page.tsx          → Server-rendered home page and SEO metadata
  calculator/       → Statically generated calculator routes
  sitemap.ts        → Search-engine sitemap generation
src/
  components/
    ui/              → Reusable UI atoms (ResultBox, InputField, etc.)
    charts/          → Chart components using Recharts
    calculator-core/ → CalculatorWidget and lazy form registries
  data/
    calculatorConfigs.ts → Master catalog combining all categories
    categories/      → Per-category calculator metadata
  store/
    useAppStore.ts   → Zustand: theme, currency, favorites, recent
  core/
    calculationEngine.js → Shared pure formula functions
  styles/
    index.css        → Tailwind + CSS variables
```

## Adding a New Calculator
1. Add metadata to the relevant file in `src/data/categories/`.
2. Add or reuse formula logic in `src/core/calculationEngine.js`.
3. Add the calculator form to the matching registry under `src/components/calculator-core/registries/`.
4. Run validation and tests before publishing.

## SEO Strategy (Next.js)
- Server-Side Rendering (SSR) and Static Site Generation (SSG) for all calculator pages.
- Native Next.js Metadata API for SEO tags and dynamic Open Graph images.
- JSON-LD structured data and FAQ schema injected natively into server components.
- Vercel Edge caching for immediate global delivery.

## Validation & Testing
Run catalog validation and core formula regression tests before publishing:
```bash
npm run validate:calculators
npm run test:unit
```
