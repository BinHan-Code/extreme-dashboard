const API_BASE = "https://fabric-connect-rag.up.railway.app";

export interface ChatSource {
  text: string;
  score: number;
  metadata: Record<string, string | number>;
}

export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
}

export async function sendChatMessage(
  question: string,
  topic: string | null
): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, topic: topic || null }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}
