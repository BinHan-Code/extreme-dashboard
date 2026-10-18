// Checks every outbound link the site depends on and exits non-zero if any are broken:
// product datasheet / dataConfirmUrl links in data/products.json and the design
// reference URLs in data/urls.txt.
//
//   node scripts/check-links.mjs

import { readFileSync } from "fs";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf-8");

const links = [];
for (const p of JSON.parse(read("data/products.json"))) {
  if (p.datasheet) links.push({ label: `${p.name} — datasheet`, url: p.datasheet });
  if (p.dataConfirmUrl) links.push({ label: `${p.name} — dataConfirmUrl`, url: p.dataConfirmUrl });
}
for (const line of read("data/urls.txt").split(/\r?\n/)) {
  const url = line.trim();
  if (url && !url.startsWith("#")) links.push({ label: "data/urls.txt", url });
}

// Same browser-like User-Agent as app/api/security-advisory/route.ts; several
// vendor sites reject requests that don't look like a browser.
const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
};

async function status(url) {
  for (const method of ["HEAD", "GET"]) {
    try {
      const res = await fetch(url, { method, headers, redirect: "follow", signal: AbortSignal.timeout(20000) });
      if (res.ok) return res.status;
      // Some servers reject HEAD; only GET is authoritative.
      if (method === "GET") return res.status;
    } catch (e) {
      if (method === "GET") return e.name === "TimeoutError" ? "timeout" : e.cause?.code ?? e.message;
    }
  }
}

async function check({ url }) {
  let result = await status(url);
  if (typeof result !== "number" || result >= 400) {
    await new Promise((r) => setTimeout(r, 3000));
    result = await status(url);
  }
  return result;
}

const broken = [];
const results = await Promise.all(links.map(async (link) => ({ ...link, result: await check(link) })));
for (const r of results) {
  if (typeof r.result !== "number" || r.result >= 400) broken.push(r);
}

if (broken.length) {
  console.log(`${broken.length} of ${links.length} link(s) are broken:\n`);
  for (const b of broken) console.log(`- ${b.label}: ${b.url} (${b.result})`);
  process.exit(1);
}
console.log(`All ${links.length} links OK.`);
