"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const COMMUNITY_URL =
  "https://community.extremenetworks.com/t5/security-advisories-formerly/bg-p/Security_Advisories";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

interface Advisory {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  severity: string | null;
}

const severityClass: Record<string, string> = {
  Critical: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  High: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  Low: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
};

function relativeDate(pubDateStr: string, lang: string): string {
  const diff = Date.now() - new Date(pubDateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (lang === "JA") {
    if (days === 0) return "今日";
    if (days === 1) return "1日前";
    return `${days}日前`;
  }
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function isNew(pubDateStr: string): boolean {
  return Date.now() - new Date(pubDateStr).getTime() < SEVEN_DAYS_MS;
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse divide-y divide-gray-100 dark:divide-gray-700">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between px-4 py-3 gap-4">
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded w-1/4" />
          </div>
          <div className="h-5 w-14 bg-gray-100 dark:bg-gray-800 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default function SecurityAdvisoryWidget() {
  const { t, lang } = useLanguage();
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    fetch("/api/security-advisory")
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json();
      })
      .then((data) => {
        const list: Advisory[] = (data.advisories ?? []).slice(0, 2);
        setAdvisories(list);
        if (list.length > 0) {
          const newestMs = new Date(list[0].pubDate).getTime();
          const lastSeen = localStorage.getItem("lastSeenAdvisoryDate");
          const lastSeenMs = lastSeen ? new Date(lastSeen).getTime() : 0;
          setHasNew(newestMs > lastSeenMs);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  function handleViewAll() {
    if (advisories.length > 0) {
      localStorage.setItem("lastSeenAdvisoryDate", advisories[0].pubDate);
      setHasNew(false);
    }
    window.open(COMMUNITY_URL, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z"
              fill="#6D1F7E"
              opacity="0.15"
              stroke="#6D1F7E"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M9 12l2 2 4-4"
              stroke="#6D1F7E"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight">
              {t.security_title}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{t.security_subtitle}</p>
          </div>
        </div>
        {hasNew && (
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
        )}
      </div>

      {/* Body */}
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <p className="px-4 py-4 text-sm text-gray-400 dark:text-gray-500">{t.security_error}</p>
      ) : advisories.length === 0 ? (
        <p className="px-4 py-4 text-sm text-gray-400 dark:text-gray-500">
          {t.security_no_advisories}
        </p>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-700/60">
          {advisories.map((adv, i) => (
            <li key={i}>
              <a
                href={adv.link || COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start justify-between gap-3 px-4 py-3 hover:bg-purple-50/30 dark:hover:bg-purple-900/10 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {adv.pubDate && isNew(adv.pubDate) && (
                      <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full flex-shrink-0">
                        {t.security_new}
                      </span>
                    )}
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-[#6D1F7E] dark:group-hover:text-purple-400 transition-colors truncate">
                      {adv.title || "Untitled Advisory"}
                    </span>
                  </div>
                  {adv.pubDate && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {relativeDate(adv.pubDate, lang)}
                    </p>
                  )}
                </div>
                {adv.severity && (
                  <span
                    className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full mt-0.5 ${
                      severityClass[adv.severity] ??
                      "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {adv.severity}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700/60 flex justify-end">
        <button
          onClick={handleViewAll}
          className="text-xs font-medium text-[#6D1F7E] dark:text-purple-400 hover:underline"
        >
          {t.security_view_all}
        </button>
      </div>
    </div>
  );
}
