// Smoke-checks a running copy of the site and exits non-zero on any failure.
//
//   node scripts/check-site.mjs http://localhost:3000
//   node scripts/check-site.mjs https://extreme-dashboard-production.up.railway.app --external
//
// --external also checks things that depend on outside services (the community
// RSS feed and the RAG chat backend). CI leaves it off so a PR never fails
// because someone else's service is down; the daily production monitor turns it on.

import { readFileSync } from "fs";
import { chromium } from "playwright";

const args = process.argv.slice(2);
const base = (args.find((a) => !a.startsWith("--")) ?? "http://localhost:3000").replace(/\/$/, "");
const external = args.includes("--external");

// Keep in sync with PAGES in app/sitemap.ts.
const PAGES = ["/", "/catalog", "/competitive", "/chat", "/manga"];
const products = JSON.parse(readFileSync(new URL("../data/products.json", import.meta.url), "utf-8"));

const failures = [];
const fail = (msg) => failures.push(msg);

async function checkPages() {
  const browser = await chromium.launch();
  try {
    for (const path of [...PAGES, ...PAGES.map((p) => (p === "/" ? "/ja" : `/ja${p}`))]) {
      const page = await browser.newPage();
      // Don't count monitor visits as real page views.
      await page.route("**/api/track", (route) => route.fulfill({ status: 204 }));
      const errors = [];
      page.on("pageerror", (err) => errors.push(err.message));
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
      });

      const res = await page.goto(base + path, { waitUntil: "networkidle", timeout: 45000 }).catch((e) => {
        fail(`${path}: failed to load (${e.message.split("\n")[0]})`);
        return null;
      });
      if (res) {
        if (res.status() !== 200) fail(`${path}: HTTP ${res.status()}`);
        for (const e of errors) fail(`${path}: browser error: ${e.slice(0, 200)}`);
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

async function checkCatalogHtml() {
  // The catalog is server-rendered from searchParams, so every product name
  // should be in the raw HTML without running any JavaScript.
  const html = await (await fetch(`${base}/catalog`)).text();
  const missing = products.filter((p) => !html.includes(p.name.replace(/&/g, "&amp;")));
  if (missing.length) fail(`/catalog: ${missing.length} product(s) missing from server HTML: ${missing.map((p) => p.name).join(", ")}`);
}

async function checkRedirect() {
  const res = await fetch(`${base}/en/catalog`, { redirect: "manual" });
  const location = res.headers.get("location") ?? "";
  if (res.status !== 308 || !/\/catalog$/.test(new URL(location, base).pathname))
    fail(`/en/catalog: expected 308 to /catalog, got ${res.status} ${location}`);
}

async function checkSeo() {
  const sitemap = await fetch(`${base}/sitemap.xml`);
  if (!sitemap.ok) return fail(`/sitemap.xml: HTTP ${sitemap.status}`);
  const xml = await sitemap.text();
  for (const p of ["/catalog", "/competitive", "/manga"]) {
    if (!xml.includes(`${p}</loc>`)) fail(`/sitemap.xml: missing ${p}`);
  }
  const robots = await fetch(`${base}/robots.txt`);
  if (!robots.ok) fail(`/robots.txt: HTTP ${robots.status}`);
}

async function checkAdvisories() {
  const res = await fetch(`${base}/api/security-advisory`);
  if (!res.ok) return fail(`/api/security-advisory: HTTP ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data.advisories)) return fail("/api/security-advisory: response has no advisories array");
  // The route returns an empty list when the RSS fetch fails, so an empty
  // list means the feed is broken, not that there's nothing to show.
  if (external && data.advisories.length === 0)
    fail("/api/security-advisory: no advisories returned — the community RSS feed is probably failing");
}

async function checkChat() {
  const res = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: "What is SPB?", topic: null, mode: null }),
    signal: AbortSignal.timeout(60000),
  }).catch((e) => ({ ok: false, status: e.name }));
  if (!res.ok) fail(`/api/chat: RAG backend returned ${res.status}`);
}

const checks = [checkPages, checkCatalogHtml, checkRedirect, checkSeo, checkAdvisories];
if (external) checks.push(checkChat);

for (const check of checks) {
  try {
    await check();
  } catch (e) {
    fail(`${check.name}: ${e.message}`);
  }
}

if (failures.length) {
  console.log(`${failures.length} check(s) failed on ${base}:\n`);
  for (const f of failures) console.log(`- ${f}`);
  process.exit(1);
}
console.log(`All checks passed on ${base}${external ? " (including external services)" : ""}.`);
