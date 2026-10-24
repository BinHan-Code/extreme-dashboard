# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

Next.js 16.2 with Turbopack — check `node_modules/next/dist/docs/` before writing Next.js-specific code.

## Commands

```bash
npm run dev      # Start dev server (Turbopack)
npm run lint     # ESLint
npm run build    # Production build
node scripts/check-site.mjs <baseUrl> [--external]   # Smoke-check a running site
node scripts/check-links.mjs                         # Check datasheet / reference URLs
```

There are no unit tests. Validate with `npm run lint && npm run build`, then run `check-site.mjs` against `npm start`. CI (`.github/workflows/ci.yml`) runs all of this on every PR.

### Maintenance automation
- **CI** runs lint, build, a check that the matrix JSON matches the spreadsheets, and `check-site.mjs` against a local build. `--external` stays off in CI so outside outages can't fail a PR.
- **`monitor.yml`** and **`links.yml`** run every Sunday at 09:00 JST; `monitor.yml` checks production with `--external`.
- On failure, both keep a single open GitHub issue up to date (labels `monitor` / `links`) and close it once checks pass again. The shared logic is in `.github/scripts/report-issue.sh`.
- **Dependabot** opens monthly npm PRs (minor and patch grouped) and monthly Actions PRs. Merge them when CI is green.
- `check-site.mjs` stubs `/api/track` so monitor visits don't count as page views.

### Matrix data scripts
The switching and AP matrix JSONs are generated from the `.xlsx` files in the repo root. Re-run when the spreadsheets change (CI fails if you forget). `xlsx` is SheetJS's own build from cdn.sheetjs.com, because the npm registry copy is stuck at a vulnerable 0.18.5:

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
5. Add it to `PAGES` in `scripts/check-site.mjs`
6. Link to it with `href()`

### Page notes
- `catalog` — `page.tsx` is a server component that reads `searchParams` and passes them as props to `CatalogClient.tsx` (rather than `useSearchParams`) so the product grid is in the server HTML. Search does substring matching first and falls back to Fuse.js only when there are no direct hits.
- `manga` — chapter content is static HTML in `data/manga-chapters.ts`, rendered with `dangerouslySetInnerHTML`; no runtime fetches.
- Home page site search redirects to Google scoped to `extremenetworks.com`; no local data is queried.

### Layout rules
These come from a review of `/catalog` (October 2026), which shipped with bugs that only showed on phones.

- Check UI changes at 390px, 820px and 1440px, in both `en` and `ja`. Playwright is installed, so you can screenshot each width and confirm that `document.documentElement.scrollWidth` matches the viewport and that no element extends past it.
- Two side-by-side `absolute` + `whitespace-nowrap` callouts overlap each other. Use one callout per group of buttons. On phones, render it inline (`mb-2 sm:absolute ...`) and apply `whitespace-nowrap` only from `sm` up.
- A row with a title and action buttons squeezes the title on phones. Stack it there with `flex-col sm:flex-row`.
- Give Japanese headings `break-keep` so they wrap at spaces, not mid-word (製 / 品).
- Never show raw JSON keys as labels. Spec keys go through `formatSpecKey()` in `components/ProductCard.tsx`; add new acronyms (e.g. `wifi`, `ztna`) to `specKeyWords`.
- The product grid stops at 3 columns. At 4 columns, cards were about 290px wide and spec values wrapped to 5–7 lines.
- Cards show the first 4 specs and tags, and a toggle reveals the rest. The extra items are hidden with the `hidden` class rather than left unrendered, so they stay in the server HTML for SEO. Keep it that way.
- A filter's "no filter" value must not be a possible data value. The segment filter used `"All"`, and Extreme Platform ONE's segment is literally `"All"`, so the dropdown showed the wrong label. Use `""` instead.

Open catalog layout issues (delete each one once it's fixed):
- The page is still about 14,500px tall at 390px (24 cards, each with a full description). Options: line-clamp descriptions on phones (keep the full text in the HTML), or use a more compact phone card.

### Security Advisory widget
`components/SecurityAdvisoryWidget.tsx` shows the 2 latest advisories, fetched from `app/api/security-advisory/route.ts`, which parses the community RSS feed server-side (regex, no XML dependency) and caches for 1 hour.

- Feed: `https://community.extremenetworks.com/zxxfm75553/rss/board?board.id=Security_Advisories`. It needs a browser-like `User-Agent` header; the `/t5/…` path returns 403 from CloudFront.
- Unread dot: the newest `pubDate` is compared with `localStorage` key `lastSeenAdvisoryDate`, which "View All →" updates.

### Deployment
Railway deploys `master` once CI passes (`railway.json`: Nixpacks, `npm start`, healthcheck on `/`). Work on a branch and open a PR. `master` is protected and needs the `ci` check to pass before merging.
