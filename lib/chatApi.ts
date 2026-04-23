const API_BASE = "https://fabric-connect-rag.up.railway.app";

export interface ChatSource {
  text: string;
  score: number;
  metadata: Record<string, string | number>;
}

export type ChatMode = "knowledge_search" | "design" | "troubleshooting";

export interface ModeOption {
  mode: ChatMode;
  label: string;
  description: string;
}

export interface ModeSelectionResponse {
  type: "mode_selection";
  question: string;
  modes: ModeOption[];
}

export interface ChatAnswerResponse {
  type: "answer";
  answer: string;
  sources: ChatSource[];
}

export type ApiResponse = ModeSelectionResponse | ChatAnswerResponse;

export async function sendChatMessage(
  question: string,
  topic: string | null,
  mode?: ChatMode | null
): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, topic: topic || null, mode: mode || null }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}
