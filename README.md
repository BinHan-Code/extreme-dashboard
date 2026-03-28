# Extreme Networks Dashboard

An internal sales and technical reference tool for Extreme Networks staff — built with **Next.js 16 · TypeScript · Tailwind CSS**, deployed on **Railway** via GitHub auto-deploy.

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
- Full UI translation toggle in the Navbar — switches instantly, no reload

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
