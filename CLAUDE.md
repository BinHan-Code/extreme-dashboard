# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Important:** This project runs Next.js 16.2 with Turbopack. APIs and conventions may differ from training data. Check `node_modules/next/dist/docs/` before writing Next.js-specific code and heed deprecation notices.

## Commands

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build — run this to validate before pushing
npm run lint     # ESLint
```

There are no automated tests. Use `npm run build` as the validation step before committing.

### Matrix data scripts
The switching and AP matrix JSONs are generated from `.xlsx` files in the repo root:

```bash
node scripts/convert-switching-matrix.mjs   # → data/switching-matrix.json
node scripts/convert-ap-matrix.mjs          # → data/ap-matrix.json
```

Re-run these when the source spreadsheets are updated.

## Architecture

### Data flow
All product and competitive data lives in static JSON files under `data/`. Pages import these directly — there is no API layer or database.

- `data/products.json` — product catalog (id, name, category, segment, specs, tags, datasheet, dataConfirmUrl?)
- `data/competitive.json` — vendor comparison data (vendors, comparisons, categories)
- `data/switching-matrix.json` / `data/ap-matrix.json` — generated from `.xlsx` spreadsheets via `scripts/`

### Internationalisation
Language state lives in `context/LanguageContext.tsx` (a React context wrapping the whole app). All UI strings are defined in `lib/translations.ts` as `EN` and `JA` objects. Components call `useLanguage()` to get `{ lang, setLang, t }`. The Navbar language selector drives the switch.

When adding new UI strings: add to both `EN` and `JA` in `lib/translations.ts`, then use `t.key` in the component.

### Page structure
- `app/layout.tsx` — root layout; nests providers in order: `LanguageProvider` → `ThemeProvider` → `Navbar` → `<main>`
- `app/page.tsx` — home page with category tiles and Google site search (client component); search redirects to Google scoped to `extremenetworks.com`, no local data queried
- `app/catalog/page.tsx` — product catalog with fuzzy search (Fuse.js), filters, and matrix modals; wrapped in `<Suspense>` because it reads URL search params; search runs substring match first, falls back to Fuse.js only when no direct hits
- `app/competitive/page.tsx` — competitive intelligence; imports data at module level, client component for i18n
- `app/manga/page.tsx` — Fabric Connect SPB manga reader; chapter content is static HTML in `data/manga-chapters.ts` rendered via `dangerouslySetInnerHTML`; no external fetches at runtime

### Path alias
`@/` maps to the repo root (configured in `tsconfig.json`). Use `@/components/...`, `@/data/...`, `@/lib/...`, etc.

### Deployment
Auto-deploys to Railway on every push to `master`. Config is in `railway.json` (Nixpacks builder, `npm start`, healthcheck on `/`).
