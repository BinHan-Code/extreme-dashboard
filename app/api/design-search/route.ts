import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export const revalidate = 3600;

export interface DesignArticle {
  url: string;
  title: string;
  excerpt: string;
}

async function fetchArticle(url: string): Promise<DesignArticle | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;

    const html = await res.text();

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim().replace(/\s+/g, " ") : url;

    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim();

    return { url, title, excerpt: text.slice(0, 600) };
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const urlsPath = join(process.cwd(), "data", "urls.txt");
    const content = readFileSync(urlsPath, "utf-8");
    const urls = content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("http"));

    if (urls.length === 0) {
      return NextResponse.json({ articles: [] });
    }

    const settled = await Promise.allSettled(urls.map(fetchArticle));
    const articles = settled
      .filter(
        (r): r is PromiseFulfilledResult<DesignArticle> =>
          r.status === "fulfilled" && r.value !== null
      )
      .map((r) => r.value);

    return NextResponse.json({ articles });
  } catch {
    return NextResponse.json({ articles: [] });
  }
}
