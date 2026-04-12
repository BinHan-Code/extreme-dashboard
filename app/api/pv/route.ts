import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

// Node.js runtime required for filesystem access
export const runtime = "nodejs";

interface MonthData {
  month: string;
  pages: Record<string, { total: number; daily: Record<string, number> }>;
}

function safeCompare(a: string, b: string): boolean {
  try {
    // Pad to equal length before comparison to avoid length-based timing leaks
    const maxLen = Math.max(a.length, b.length, 1);
    const ba = Buffer.from(a.padEnd(maxLen));
    const bb = Buffer.from(b.padEnd(maxLen));
    // timingSafeEqual requires same-length buffers
    return crypto.timingSafeEqual(ba, bb) && a.length === b.length;
  } catch {
    return false;
  }
}

function formatReport(data: MonthData): string {
  const sep = "=".repeat(60);
  const lines: string[] = [
    sep,
    `  PAGE VIEW REPORT — ${data.month}`,
    `  Generated: ${new Date().toISOString()}`,
    sep,
    "",
    "MONTHLY TOTALS",
    "-".repeat(30),
  ];

  const entries = Object.entries(data.pages);
  let grand = 0;
  for (const [page, stats] of entries) {
    grand += stats.total;
    lines.push(`${page.padEnd(22)}${String(stats.total).padStart(5)} views`);
  }
  lines.push(" ".repeat(22) + "-".repeat(10));
  lines.push(`${"TOTAL".padEnd(22)}${String(grand).padStart(5)} views`);
  lines.push("");
  lines.push("DAILY BREAKDOWN");
  lines.push("-".repeat(30));

  for (const [page, stats] of entries) {
    lines.push("");
    lines.push(`[ ${page} ]`);
    const sorted = Object.entries(stats.daily).sort(([a], [b]) =>
      a.localeCompare(b)
    );
    if (sorted.length === 0) {
      lines.push("  (no data)");
    } else {
      for (const [day, count] of sorted) {
        lines.push(`  ${day}   ${String(count).padStart(4)}`);
      }
    }
  }

  lines.push("");
  lines.push(sep);
  return lines.join("\n");
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token") ?? "";
  const managerToken = process.env.MANAGER_TOKEN ?? "";

  if (!managerToken || !safeCompare(token, managerToken)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const month =
    searchParams.get("month") ?? new Date().toISOString().slice(0, 7);
  if (!/^\d{4}-\d{2}$/.test(month)) {
    return new NextResponse("Invalid month format. Use YYYY-MM.", {
      status: 400,
    });
  }

  const filePath = path.join(
    process.cwd(),
    "data",
    "pv",
    `${month}.json`
  );

  let data: MonthData;
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    data = JSON.parse(raw) as MonthData;
  } catch {
    // No data recorded yet for this month
    data = { month, pages: {} };
  }

  const report = formatReport(data);

  return new NextResponse(report, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="pv_${month}.txt"`,
    },
  });
}
