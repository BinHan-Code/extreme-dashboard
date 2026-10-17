# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

Next.js 16.2 with Turbopack — check `node_modules/next/dist/docs/` before writing Next.js-specific code.

## Commands

```bash
npm run dev      # Start dev server (Turbopack)
npm run lint     # ESLint
npm run build    # Production build
```

There are no automated tests. Run `npm run lint && npm run build` to validate before committing.

### Matrix data scripts
The switching and AP matrix JSONs are generated from the `.xlsx` files in the repo root. Re-run when the spreadsheets change:

```bash
node scripts/convert-switching-matrix.mjs   # → data/switching-matrix.json
node scripts/convert-ap-matrix.mjs          # → data/ap-matrix.json
```

## Architecture

### Data
Catalog and competitive data are static JSON under `data/`, imported directly by pages:

- `data/products.json` — the product catalog (id, name, category, segment, specs, tags, datasheet, dataConfirmUrl?)
- `data/competitive.json` — vendor comparison data
- `data/switching-matrix.json` / `data/ap-matrix.json` — generated; don't hand-edit
- `data/urls.txt` — design reference URLs (one per line, `#` comments) read by `/api/design-search`
- `data/pv/` — **live runtime data, not source.** Page-view counts written by `/api/track`; in production this is a mounted Railway volume. Don't commit or edit the month JSON files.

### API routes (`app/api/`)
- `chat` — proxies to the external Fabric Connect RAG service at `https://fabric-connect-rag.up.railway.app`
- `track` / `pv` — page-view tracking and reports. `track` only counts paths in its hard-coded `TRACKED_PATHS`; `pv` requires `MANAGER_TOKEN`
- `design-search` — fetches and excerpts the articles listed in `data/urls.txt`
- `security-advisory` — see below

### Environment variables
- `MANAGER_TOKEN` — required for `/manager` (the page stores the token in `sessionStorage` and sends it to `/api/pv`)
- `NEXT_PUBLIC_SITE_URL` — canonical/OG base URL; defaults to the Railway production URL (`lib/i18n.ts`)

### Internationalisation
Language is part of the URL so both languages are server-rendered and indexable. All pages live under `app/[lang]/` (`en` | `ja`). `proxy.ts` rewrites unprefixed URLs (`/catalog`) to `/en/...` internally and 308-redirects `/en/...` back to the unprefixed URL; Japanese is served at `/ja/...`.

UI strings live in `lib/translations.ts` as `EN` and `JA` objects — add every new key to both. Components call `useLanguage()` for `{ lang, t, href }`; use `href("/catalog")` for every internal link and `router.push` so the `/ja` prefix is kept.

### SEO
- Per-page title, description, canonical, hreflang and OG tags come from `pageMetadata()` in `lib/i18n.ts`, using the `meta_*` keys in `lib/translations.ts`.
- `app/opengraph-image.tsx` sits outside the `[lang]` root layout, so it is referenced explicitly in `pageMetadata()` and excluded from the proxy matcher (as is `apple-icon`).
- `/manager` is `noindex`.
- Target search terms include エクストリームネットワークス, Extreme Networks and ファブリック. Keep them in Japanese titles and headings.

### Adding a page
1. Create `app/[lang]/<page>/page.tsx` and a `layout.tsx` whose `generateMetadata` calls `pageMetadata()`
2. Add `meta_<page>_title` / `meta_<page>_desc` to both `EN` and `JA`
3. Add the path to `PAGES` in `app/sitemap.ts`
4. Add it to `TRACKED_PATHS` in `app/api/track/route.ts` if page views should be counted
5. Link to it with `href()`

### Page notes
- `catalog` — `page.tsx` is a server component that reads `searchParams` and passes them as props to `CatalogClient.tsx` (rather than `useSearchParams`) so the product grid is in the server HTML. Search does substring matching first and falls back to Fuse.js only when there are no direct hits.
- `manga` — chapter content is static HTML in `data/manga-chapters.ts`, rendered with `dangerouslySetInnerHTML`; no runtime fetches.
- Home page site search redirects to Google scoped to `extremenetworks.com`; no local data is queried.

### Security Advisory widget
`components/SecurityAdvisoryWidget.tsx` shows the 2 latest advisories, fetched from `app/api/security-advisory/route.ts`, which parses the community RSS feed server-side (regex, no XML dependency) and caches for 1 hour.

- Feed: `https://community.extremenetworks.com/zxxfm75553/rss/board?board.id=Security_Advisories`. It needs a browser-like `User-Agent` header; the `/t5/…` path returns 403 from CloudFront.
- Unread dot: the newest `pubDate` is compared with `localStorage` key `lastSeenAdvisoryDate`, which "View All →" updates.

### Deployment
Auto-deploys to Railway on every push to `master` (`railway.json`: Nixpacks, `npm start`, healthcheck on `/`). A push is a production deploy.
