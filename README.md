# Delta Scaling — website

Next.js 16 (App Router) + Tailwind CSS 4.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Layout

- `src/app/(home)/` — homepage: layout (fonts), `page.tsx`, `ds.css` (brand tokens, dark/light themes)
- `src/app/privacy`, `src/app/terms` — legal pages
- `src/components/ds/` — loader, glass navbar + staggered phone menu, hero, poster orbit, posters
- `src/components/HalftoneReveal.tsx` — React Bits HalftoneReveal, customised (theme-aware dots, tap/click full reveal, intro sweep)
- `src/components/TextLoop.tsx` — React Bits TextLoop (loader tapes)
- `src/components/bits/LiquidGlass.tsx` — liquid-glass surface for the navbar
- `src/content/` — site copy and legal text

Status: loader + hero are built; sections below the hero are still to come.
