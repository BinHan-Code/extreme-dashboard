import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Node.js runtime required for filesystem access
export const runtime = "nodejs";

const TRACKED_PATHS = new Set(["/", "/catalog", "/competitive", "/chat", "/manga"]);

interface MonthData {
  month: string;
  pages: Record<string, { total: number; daily: Record<string, number> }>;
}

function getMonthKey(): string {
  return new Date().toISOString().slice(0, 7); // "2026-04"
}

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10); // "2026-04-12"
}

function getFilePath(month: string): string {
  // On Railway, process.cwd() is /app — volume should be mounted at /app/data/pv
  return path.join(process.cwd(), "data", "pv", `${month}.json`);
}

async function recordView(pagePath: string): Promise<void> {
  const month = getMonthKey();
  const today = getTodayKey();
  const filePath = getFilePath(month);

  await fs.mkdir(path.dirname(filePath), { recursive: true });

  let data: MonthData;
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    data = JSON.parse(raw) as MonthData;
  } catch {
    data = { month, pages: {} };
  }

  if (!data.pages[pagePath]) {
    data.pages[pagePath] = { total: 0, daily: {} };
  }
  data.pages[pagePath].total += 1;
  data.pages[pagePath].daily[today] =
    (data.pages[pagePath].daily[today] ?? 0) + 1;

  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// Module-level write serializer to prevent concurrent read-then-write races.
// NOTE: This is safe for a single Railway instance. If horizontal scaling is
// ever enabled, a database or distributed lock would be required instead.
let writeChain: Promise<void> = Promise.resolve();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pagePath: unknown = body?.path;

    if (typeof pagePath !== "string" || !TRACKED_PATHS.has(pagePath)) {
      // Silently ignore unknown paths — bots hitting random URLs won't pollute data
      return NextResponse.json({ ok: true });
    }

    writeChain = writeChain.then(() => recordView(pagePath)).catch(() => {});
    await writeChain;
  } catch {
    // Tracking failures must never surface to the user
  }

  return NextResponse.json({ ok: true });
}
