# Extreme Networks Dashboard

An internal sales and technical reference tool for Extreme Networks staff — built with **Next.js 16 · TypeScript · Tailwind CSS**, deployed on **Railway**, which deploys `master` after CI passes.

## Features

### Product Catalog
- Full product library across Switching, Wireless, Management, and Routing
- Fuzzy search (Fuse.js) by name, specs, tags, and descriptions
- Filter by category and segment
- Top Seller badges, datasheet links, and per-product データシード確認 links
- Switching Matrix and AP Spec Matrix modals

### Competitive Intelligence
- Side-by-side comparison: Extreme Networks vs Cisco, Juniper, Aruba, Fortinet
- Expandable rows with Strong / Moderate / Limited ratings
- Vendor strength filter to highlight where Extreme leads

### Home Page
- Category tile navigation
- Google-powered site search scoped to extremenetworks.com
- Quick reference links (GTAC Knowledge, Support Policy, HanBin Blog)

### Bilingual (EN / 日本語)
- Language selector in the Navbar. English is served at `/…` and Japanese at `/ja/…`, so both languages are server-rendered and indexable by search engines.

## Tech Stack

| | |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Search | Fuse.js |
| Data | Static JSON (`data/`) |
| Deployment | Railway |
| Repo | `BinHan-Code/extreme-dashboard` |

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Maintenance

Most upkeep runs automatically through GitHub Actions and Dependabot. When something needs attention, you get a GitHub issue or a PR.

| When | What | If it fails |
|---|---|---|
| Every PR | Lint, build, a check that the matrix JSON matches the spreadsheets, and a browser smoke test of all EN/JA pages, the catalog, redirects, sitemap and APIs (`ci.yml`) | The PR shows red and can't be merged |
| Sundays, 09:00 JST | The same checks against production, plus the community RSS feed and the chat (RAG) backend (`monitor.yml`) | An issue labelled `monitor` opens, gets a comment on each later failure, and closes itself when checks pass again |
| Sundays, 09:00 JST | All product datasheet links and the URLs in `data/urls.txt` (`links.yml`) | An issue labelled `links` lists the broken links |
| Monthly | Dependabot dependency-update PRs for npm (minor and patch grouped) and GitHub Actions | CI tests each PR; merge it when it's green |

The production check stubs out `/api/track`, so its visits don't count as page views.

### Making a change
1. Work on a branch and open a PR against `master`.
2. Merge once the `ci` check is green. Railway then deploys `master`.

### Running the checks yourself
```bash
npm run lint && npm run build && npm start
node scripts/check-site.mjs http://localhost:3000
node scripts/check-site.mjs https://extreme-dashboard-production.up.railway.app --external
node scripts/check-links.mjs

# Run the scheduled jobs now instead of waiting for Sunday
gh workflow run monitor.yml
gh workflow run links.yml
```

### Updating the switch / AP matrices
After editing either `.xlsx` file in the repo root, regenerate its JSON and commit both files. CI fails if they're out of sync.
```bash
node scripts/convert-switching-matrix.mjs
node scripts/convert-ap-matrix.mjs
```

### One-time repository settings
- **GitHub branch protection on `master`:** require a PR, and require the `ci` status check to pass.
- **Railway:** turn on *Wait for CI* in the service settings, so deploys only start after CI passes.
- **Railway volume backups** for `/app/data/pv`, which holds the only copy of the page-view history.
- **GitHub notifications** for this repo's issues, so monitor and link alerts reach you by email.
