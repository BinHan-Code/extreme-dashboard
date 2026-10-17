"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

// Manager-only page — not linked from the Navbar.
// Access by navigating directly to /manager.
// Token is stored in sessionStorage (cleared when the tab closes).
export default function ManagerPage() {
  const { t } = useLanguage();
  const [tokenInput, setTokenInput] = useState("");
  const [savedToken, setSavedToken] = useState<string | null>(null);
  const [month, setMonth] = useState("");
  const [status, setStatus] = useState<"idle" | "invalid">("idle");

  useEffect(() => {
    const stored = sessionStorage.getItem("manager_token");
    if (stored) setSavedToken(stored);
    // Default month to current YYYY-MM
    setMonth(new Date().toISOString().slice(0, 7));
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = tokenInput.trim();
    if (!trimmed) return;
    sessionStorage.setItem("manager_token", trimmed);
    setSavedToken(trimmed);
    setTokenInput("");
    setStatus("idle");
  }

  function handleLogout() {
    sessionStorage.removeItem("manager_token");
    setSavedToken(null);
    setStatus("idle");
  }

  async function handleDownload() {
    if (!savedToken || !month) return;
    setStatus("idle");

    const url = `/api/pv?token=${encodeURIComponent(savedToken)}&month=${encodeURIComponent(month)}`;

    // First verify the token is valid before triggering a download
    const res = await fetch(url).catch(() => null);
    if (!res || res.status === 401) {
      setStatus("invalid");
      return;
    }

    // Token is valid — trigger the browser download via hidden anchor
    const a = document.createElement("a");
    a.href = url;
    a.download = `pv_${month}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-8">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {t.manager_title}
        </h1>

        {!savedToken ? (
          // ── Login form ──────────────────────────────────────────
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="token"
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                {t.manager_token_label}
              </label>
              <input
                id="token"
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
            >
              {t.manager_login}
            </button>
          </form>
        ) : (
          // ── Manager dashboard ────────────────────────────────────
          <div className="flex flex-col gap-5">
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              {t.manager_logged_in}
            </p>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="month"
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                {t.manager_month_label}
              </label>
              <input
                id="month"
                type="month"
                value={month}
                onChange={(e) => {
                  setMonth(e.target.value);
                  setStatus("idle");
                }}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {status === "invalid" && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {t.manager_invalid_token}
              </p>
            )}

            <button
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
            >
              {t.manager_download}
            </button>

            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 dark:text-gray-400 hover:underline text-left"
            >
              {t.manager_logout}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
