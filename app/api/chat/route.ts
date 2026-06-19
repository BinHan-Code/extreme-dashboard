import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const RAG_BASE = "https://fabric-connect-rag.up.railway.app";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${RAG_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { error: `Upstream error: ${res.status}`, detail: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
