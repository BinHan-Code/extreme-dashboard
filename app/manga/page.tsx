"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface WpPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  link: string;
}

const CHAPTER_SLUGS = [
  "extreme-campus-fabric-short-path-bridging-spb-1",
  "extreme-campus-fabric-short-path-bridging-spb-2",
  "extreme-campus-fabric-short-path-bridging-spb-3",
  "extreme-campus-fabric-short-path-bridging-spb-4",
  "extreme-campus-fabric-short-path-bridging-spb-5",
  "extreme-campus-fabric-short-path-bridging-spb-6",
  "extreme-campus-fabric-short-path-bridging-spb-7",
];

const CHAPTER_COUNT = CHAPTER_SLUGS.length;
const WP_BASE = "https://hantechnote.wordpress.com/wp-json/wp/v2/posts";

function LoadingSkeleton({ label }: { label: string }) {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-20 bg-gray-800 rounded border-4 border-gray-700" />
      <div className="h-4 bg-gray-800 rounded w-3/4" />
      <div className="h-4 bg-gray-800 rounded w-full" />
      <div className="h-4 bg-gray-800 rounded w-5/6" />
      <div className="h-64 bg-gray-800 rounded border-2 border-gray-700" />
      <div className="h-4 bg-gray-800 rounded w-2/3" />
      <div className="h-4 bg-gray-800 rounded w-full" />
      <p className="text-center text-xs text-gray-600 pt-2">{label}</p>
    </div>
  );
}

export default function MangaPage() {
  const { lang, t } = useLanguage();
  const [activeChapter, setActiveChapter] = useState(1);
  const [post, setPost] = useState<WpPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChapter = useCallback(async (n: number) => {
    setLoading(true);
    setError(null);
    setPost(null);
    try {
      const res = await fetch(`${WP_BASE}?slug=${CHAPTER_SLUGS[n - 1]}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: WpPost[] = await res.json();
      if (data.length === 0) {
        setError("Chapter not found.");
      } else {
        setPost(data[0]);
      }
    } catch {
      setError(t.manga_error);
    } finally {
      setLoading(false);
    }
  }, [t.manga_error]);

  useEffect(() => {
    fetchChapter(activeChapter);
  }, [activeChapter, fetchChapter]);

  const handleNav = (n: number) => {
    if (n < 1 || n > CHAPTER_COUNT) return;
    setActiveChapter(n);
  };

  const chapterLabel = lang === "JA"
    ? `第${activeChapter}章`
    : `${t.manga_chapter} ${activeChapter}`;

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-8 bg-gray-950 min-h-[calc(100vh-56px)]">

      {/* HEADER */}
      <div className="bg-gray-950 border-b-4 border-gray-700 px-6 py-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">{t.manga_title}</h1>
            <p className="text-gray-400 text-sm mt-1">{t.manga_subtitle}</p>
          </div>
          {/* Speech-bubble chapter badge */}
          <div className="relative self-start bg-white text-gray-900 font-black text-base px-4 py-2 rounded-lg border-2 border-gray-900 shadow-[4px_4px_0px_#111] whitespace-nowrap">
            {chapterLabel}
            <span
              className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0"
              style={{
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderRight: "8px solid white",
              }}
            />
          </div>
        </div>
      </div>

      {/* CHAPTER NAV STRIP */}
      <div className="bg-gray-900 border-b-2 border-gray-700 px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500 font-medium mr-2 shrink-0">{t.manga_toc}</span>
          {Array.from({ length: CHAPTER_COUNT }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => handleNav(n)}
              className={`w-8 h-8 rounded border text-xs font-bold transition-all ${
                activeChapter === n
                  ? "bg-[#6D1F7E] border-[#6D1F7E] text-white shadow-[2px_2px_0px_#3b0764]"
                  : "bg-gray-800 border-gray-600 text-gray-400 hover:border-[#6D1F7E] hover:text-white"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="max-w-4xl mx-auto px-4 py-8">

        {loading && <LoadingSkeleton label={t.manga_loading} />}

        {error && !loading && (
          <div className="border-2 border-red-800 bg-red-950/30 rounded-lg p-8 text-center space-y-4">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={() => fetchChapter(activeChapter)}
              className="px-4 py-2 bg-[#6D1F7E] text-white text-sm font-medium rounded-lg hover:bg-[#5a1868] transition-colors"
            >
              {t.manga_retry}
            </button>
          </div>
        )}

        {post && !loading && !error && (
          <>
            {/* Chapter title panel */}
            <div className="border-4 border-gray-200 dark:border-gray-600 bg-gradient-to-br from-gray-900 to-gray-950 p-6 mb-1 shadow-[8px_8px_0px_#000]">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-bold text-[#a855f7] uppercase tracking-widest">
                  {chapterLabel}
                </span>
              </div>
              <h2
                className="text-xl sm:text-2xl font-black text-white leading-tight"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
            </div>

            {/* Content panel */}
            <div
              className="manga-content border-2 border-gray-700 bg-gray-950 p-6 sm:p-8 shadow-[4px_4px_0px_#000]"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />

            {/* Scoped styles for WordPress HTML */}
            <style>{`
              .manga-content img {
                max-width: 100%;
                height: auto;
                border: 2px solid #374151;
                margin: 1.25rem auto;
                display: block;
                box-shadow: 4px 4px 0px #000;
              }
              .manga-content p {
                color: #d1d5db;
                line-height: 1.85;
                margin-bottom: 1rem;
              }
              .manga-content h1, .manga-content h2, .manga-content h3,
              .manga-content h4, .manga-content h5, .manga-content h6 {
                color: #f9fafb;
                font-weight: 800;
                border-left: 4px solid #6D1F7E;
                padding-left: 0.75rem;
                margin: 1.75rem 0 0.75rem;
                line-height: 1.3;
              }
              .manga-content a {
                color: #a855f7;
                text-decoration: underline;
              }
              .manga-content a:hover { color: #c084fc; }
              .manga-content ul, .manga-content ol {
                color: #d1d5db;
                padding-left: 1.5rem;
                margin-bottom: 1rem;
              }
              .manga-content li { margin-bottom: 0.35rem; }
              .manga-content blockquote {
                border-left: 4px solid #6D1F7E;
                background: rgba(109, 31, 126, 0.12);
                padding: 0.75rem 1rem;
                margin: 1.25rem 0;
                border-radius: 0 4px 4px 0;
                color: #d1d5db;
              }
              .manga-content pre {
                background: #0f172a;
                color: #a855f7;
                padding: 1rem;
                border-radius: 4px;
                overflow-x: auto;
                font-size: 0.85em;
                margin-bottom: 1rem;
                border: 1px solid #374151;
              }
              .manga-content code {
                background: #111827;
                color: #a855f7;
                padding: 0.15em 0.4em;
                border-radius: 3px;
                font-size: 0.875em;
              }
              .manga-content pre code {
                background: transparent;
                padding: 0;
                color: inherit;
              }
              .manga-content figure { margin: 1.5rem 0; }
              .manga-content figcaption {
                text-align: center;
                font-size: 0.75rem;
                color: #6b7280;
                margin-top: 0.5rem;
                font-style: italic;
              }
              .manga-content table {
                width: 100%;
                border-collapse: collapse;
                margin: 1.25rem 0;
                font-size: 0.875rem;
                color: #d1d5db;
              }
              .manga-content th {
                background: #1f2937;
                color: #f9fafb;
                font-weight: 700;
                padding: 0.5rem 0.75rem;
                border: 1px solid #374151;
                text-align: left;
              }
              .manga-content td {
                padding: 0.5rem 0.75rem;
                border: 1px solid #374151;
              }
              .manga-content tr:nth-child(even) td { background: #111827; }
              .manga-content hr {
                border: none;
                border-top: 2px solid #374151;
                margin: 1.5rem 0;
              }
              /* Override any inline color styles from WordPress */
              .manga-content [style*="color:white"], .manga-content [style*="color: white"] {
                color: #d1d5db !important;
              }
            `}</style>

            {/* View original link */}
            <div className="mt-4 text-right">
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-600 hover:text-[#a855f7] transition-colors"
              >
                {t.manga_source} ↗
              </a>
            </div>
          </>
        )}
      </div>

      {/* BOTTOM NAVIGATION */}
      <div className="border-t-2 border-gray-700 bg-gray-900 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => handleNav(activeChapter - 1)}
            disabled={activeChapter === 1}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all border border-gray-700
              disabled:opacity-30 disabled:cursor-not-allowed
              enabled:bg-gray-800 enabled:text-gray-200 enabled:hover:border-[#6D1F7E] enabled:hover:text-white"
          >
            {t.manga_prev}
          </button>

          <a
            href="https://hantechnote.wordpress.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-[#a855f7] transition-colors"
          >
            {t.manga_source}
          </a>

          <button
            onClick={() => handleNav(activeChapter + 1)}
            disabled={activeChapter === CHAPTER_COUNT}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all border border-gray-700
              disabled:opacity-30 disabled:cursor-not-allowed
              enabled:bg-gray-800 enabled:text-gray-200 enabled:hover:border-[#6D1F7E] enabled:hover:text-white"
          >
            {t.manga_next}
          </button>
        </div>
      </div>

    </div>
  );
}
