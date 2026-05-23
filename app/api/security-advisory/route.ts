import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 3600;

const RSS_URL =
  "https://community.extremenetworks.com/zxxfm75553/rss/board?board.id=Security_Advisories";

interface Advisory {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  severity: string | null;
}

function extractField(itemXml: string, tag: string): string {
  const pattern = new RegExp(
    `<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`,
    "i"
  );
  const match = itemXml.match(pattern);
  return match ? match[1].trim() : "";
}

function extractLink(itemXml: string): string {
  // Khoros sometimes uses plain <link>url</link>
  const plain = itemXml.match(/<link>(https?:\/\/[^\s<]+)<\/link>/i);
  if (plain) return plain[1].trim();
  // Atom-style <link href="..." />
  const attr = itemXml.match(/<link[^>]+href="([^"]+)"/i);
  return attr ? attr[1].trim() : "";
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripHtml(text: string): string {
  const decoded = decodeEntities(text);
  return decoded.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function extractSeverity(text: string): string | null {
  const m = text.match(/\b(Critical|High|Medium|Low)\b/i);
  return m ? m[1] : null;
}

function parseItems(xml: string): Advisory[] {
  const advisories: Advisory[] = [];
  const itemPattern = /<item>([\s\S]*?)<\/item>/g;
  let match: RegExpExecArray | null;

  while ((match = itemPattern.exec(xml)) !== null) {
    const item = match[1];
    const title = decodeEntities(extractField(item, "title"));
    const link = extractLink(item);
    const pubDate = extractField(item, "pubDate");
    const rawDesc = extractField(item, "description");
    const description = stripHtml(rawDesc).slice(0, 300);
    const severity = extractSeverity(title + " " + description);

    if (title || link) {
      advisories.push({ title, link, pubDate, description, severity });
    }
  }

  return advisories;
}

export async function GET() {
  const fetchedAt = new Date().toISOString();
  try {
    const res = await fetch(RSS_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "application/rss+xml, application/xml, text/xml, */*",
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);
    const xml = await res.text();
    const advisories = parseItems(xml).slice(0, 20);
    return NextResponse.json({ advisories, fetchedAt });
  } catch {
    return NextResponse.json({ advisories: [], fetchedAt });
  }
}
