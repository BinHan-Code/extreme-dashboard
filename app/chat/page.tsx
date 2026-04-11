"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { sendChatMessage, ChatSource } from "@/lib/chatApi";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Message {
  role: "user" | "assistant";
  text: string;
  sources?: ChatSource[];
  error?: boolean;
}

// ---------------------------------------------------------------------------
// URL linkifier — renders plain text with clickable highlighted URLs
// ---------------------------------------------------------------------------

const URL_REGEX = /(https?:\/\/[^\s)>\]"]+)/g;
const URL_TEST = /^https?:\/\//;

function LinkifiedText({ text }: { text: string }) {
  const parts = text.split(URL_REGEX);
  return (
    <>
      {parts.map((part, i) =>
        URL_TEST.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white/20 hover:bg-white/30 underline underline-offset-2 transition-colors break-all"
          >
            {part}
            <svg className="w-3 h-3 shrink-0 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Topic options
// ---------------------------------------------------------------------------

const TOPICS = [
  { value: "", labelEN: "All Topics", labelJA: "すべてのトピック" },
  { value: "isis", labelEN: "IS-IS", labelJA: "IS-IS" },
  { value: "spbm", labelEN: "SPB / SPBM", labelJA: "SPB / SPBM" },
  { value: "bvlan", labelEN: "B-VLAN", labelJA: "B-VLAN" },
  { value: "isid", labelEN: "I-SID", labelJA: "I-SID" },
  { value: "uni_nni", labelEN: "UNI / NNI", labelJA: "UNI / NNI" },
  { value: "multicast", labelEN: "Multicast", labelJA: "マルチキャスト" },
  { value: "routing", labelEN: "Routing", labelJA: "ルーティング" },
  { value: "resilience", labelEN: "Resilience", labelJA: "レジリエンス" },
  { value: "migration", labelEN: "Migration", labelJA: "移行" },
  { value: "design", labelEN: "Design", labelJA: "設計" },
];

// ---------------------------------------------------------------------------
// Source citation helpers
// ---------------------------------------------------------------------------

function formatSource(meta: Record<string, string | number>): string {
  if (meta.source_type === "pdf") {
    return `${meta.filename ?? "unknown"}, page ${meta.page_number ?? "?"}`;
  }
  if (meta.source_type === "pptx") {
    const title = meta.slide_title ? ` — ${meta.slide_title}` : "";
    return `${meta.filename ?? "unknown"}, slide ${meta.slide_number ?? "?"}${title}`;
  }
  if (meta.source_type === "url") {
    return String(meta.url ?? "unknown URL");
  }
  return String(meta.filename ?? meta.url ?? "unknown");
}

// ---------------------------------------------------------------------------
// SourceList sub-component
// ---------------------------------------------------------------------------

function SourceList({ sources }: { sources: ChatSource[] }) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  // Only show URL sources — PPTX slides are displayed inline in the chat
  const urlSources = sources.filter((s) => s.metadata.source_type === "url");
  if (urlSources.length === 0) return null;

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-xs text-[#6D1F7E] dark:text-purple-400 hover:underline"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {open ? t.chat_sources_hide : `${t.chat_sources} (${urlSources.length})`}
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul className="mt-1.5 space-y-3">
          {urlSources.map((src, i) => (
            <li key={i} className="text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-start gap-1.5">
                <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-900/40 text-[#6D1F7E] dark:text-purple-300 flex items-center justify-center font-semibold text-[10px]">
                  {i + 1}
                </span>
                {src.metadata.source_type === "url" && src.metadata.url ? (
                  <a
                    href={String(src.metadata.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-[#6D1F7E] dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors font-medium"
                  >
                    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {formatSource(src.metadata)}
                  </a>
                ) : (
                  <span>{formatSource(src.metadata)}</span>
                )}
              </div>
              {src.metadata.slide_image_url && (
                <div className="mt-1.5 ml-5.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={String(src.metadata.slide_image_url)}
                    alt={`Slide ${src.metadata.slide_number ?? ""} image`}
                    className="max-w-xs rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm"
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function ChatPage() {
  const { t, lang } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const data = await sendChatMessage(question, topic || null);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.answer, sources: data.sources },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: t.chat_error, error: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-[#6D1F7E] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-4 4v-4z" />
            </svg>
          </span>
          {t.chat_title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.chat_subtitle}</p>
        </div>
        <button
          onClick={handleNewChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-[#6D1F7E] dark:text-purple-400 border border-[#6D1F7E]/30 dark:border-purple-400/30 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>
      </div>

      {/* Topic filter */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm text-gray-600 dark:text-gray-400">{t.chat_topic_label}</span>
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="text-sm border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D1F7E]/40"
        >
          {TOPICS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {lang === "JA" ? opt.labelJA : opt.labelEN}
            </option>
          ))}
        </select>
      </div>

      {/* Message area */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 space-y-4">
        {messages.length === 0 && !loading && (
          <div className="h-full flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
            {t.chat_empty}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] ${msg.role === "user" ? "order-2" : ""}`}>
              {/* Bubble */}
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-[#6D1F7E] text-white rounded-br-sm"
                    : msg.error
                    ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-bl-sm"
                    : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-bl-sm shadow-sm"
                }`}
              >
                <LinkifiedText text={msg.text} />
              </div>

              {/* Inline PPTX slide images */}
              {msg.role === "assistant" && msg.sources && (() => {
                const slideImages = msg.sources
                  .filter((s) => s.metadata.source_type === "pptx" && s.metadata.slide_image_url)
                  .reduce<{ url: string; title: string; slide: number }[]>((acc, s) => {
                    const url = String(s.metadata.slide_image_url);
                    if (!acc.find((x) => x.url === url)) {
                      acc.push({
                        url,
                        title: String(s.metadata.slide_title ?? ""),
                        slide: Number(s.metadata.slide_number ?? 0),
                      });
                    }
                    return acc;
                  }, []);

                if (slideImages.length === 0) return null;
                return (
                  <div className="mt-2 space-y-2">
                    {slideImages.map((img) => (
                      <div key={img.url} className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.url}
                          alt={img.title || `Slide ${img.slide}`}
                          className="w-full"
                        />
                        {img.title && (
                          <div className="px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600">
                            Slide {img.slide}{img.title ? ` — ${img.title}` : ""}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Inline URL references */}
              {msg.role === "assistant" && msg.sources && (() => {
                const urlSrcs = msg.sources.filter((s) => s.metadata.source_type === "url" && s.metadata.url);
                const unique = urlSrcs.filter((s, i, arr) => arr.findIndex((x) => x.metadata.url === s.metadata.url) === i);
                if (unique.length === 0) return null;
                return (
                  <div className="mt-2 flex flex-wrap gap-1.5 px-1">
                    {unique.map((src, i) => (
                      <a
                        key={i}
                        href={String(src.metadata.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-[#6D1F7E] dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors text-xs font-medium"
                      >
                        <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        {String(src.metadata.page_title || src.metadata.url)}
                      </a>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        ))}

        {/* Thinking indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-2">
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#6D1F7E] animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">{t.chat_thinking}</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="mt-3 flex gap-2 items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.chat_placeholder}
          rows={2}
          className="flex-1 resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6D1F7E]/40 placeholder-gray-400 dark:placeholder-gray-500"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="h-[60px] px-5 rounded-xl bg-[#6D1F7E] text-white text-sm font-medium hover:bg-[#5a1a68] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          {t.chat_send}
        </button>
      </div>
    </div>
  );
}
