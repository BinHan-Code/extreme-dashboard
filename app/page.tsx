"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import { useLanguage } from "@/context/LanguageContext";

const categoryIcons = {
  switching: (
    <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
      <rect x="6" y="22" width="52" height="20" rx="4" fill="#6D1F7E" opacity="0.15" stroke="#6D1F7E" strokeWidth="2"/>
      {[14, 22, 30, 38, 46].map((x) => (
        <rect key={x} x={x} y="28" width="5" height="8" rx="1" fill="#6D1F7E" />
      ))}
      <rect x="52" y="26" width="4" height="5" rx="1" fill="#a855f7"/>
      <rect x="52" y="33" width="4" height="5" rx="1" fill="#a855f7"/>
      <path d="M2 32 L8 28 L8 36 Z" fill="#6D1F7E"/>
      <path d="M62 32 L56 28 L56 36 Z" fill="#6D1F7E"/>
    </svg>
  ),
  wireless: (
    <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
      <path d="M12 30 Q32 10 52 30" stroke="#6D1F7E" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M19 37 Q32 22 45 37" stroke="#6D1F7E" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M26 44 Q32 36 38 44" stroke="#6D1F7E" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <circle cx="32" cy="52" r="4" fill="#6D1F7E"/>
      <path d="M32 8 L32 2" stroke="#a855f7" strokeWidth="2" strokeLinecap="round"/>
      <path d="M32 8 L26 5" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M32 8 L38 5" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  management: (
    <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
      <path d="M44 38 Q52 38 52 30 Q52 22 44 22 Q42 16 36 16 Q30 16 28 22 Q20 22 20 30 Q20 38 28 38 Z"
        fill="#6D1F7E" opacity="0.15" stroke="#6D1F7E" strokeWidth="2"/>
      <circle cx="36" cy="30" r="4" fill="#6D1F7E"/>
      {[0,45,90,135,180,225,270,315].map((angle, i) => {
        const r = angle * Math.PI / 180;
        const x = 36 + 7 * Math.cos(r);
        const y = 30 + 7 * Math.sin(r);
        return <circle key={i} cx={x} cy={y} r="2" fill="#6D1F7E"/>;
      })}
      <line x1="28" y1="44" x2="28" y2="50" stroke="#6D1F7E" strokeWidth="2" strokeLinecap="round"/>
      <line x1="36" y1="44" x2="36" y2="52" stroke="#6D1F7E" strokeWidth="2" strokeLinecap="round"/>
      <line x1="44" y1="44" x2="44" y2="50" stroke="#6D1F7E" strokeWidth="2" strokeLinecap="round"/>
      <line x1="22" y1="50" x2="50" y2="50" stroke="#a855f7" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  router: (
    <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
      <rect x="10" y="26" width="44" height="16" rx="3" fill="#6D1F7E" opacity="0.15" stroke="#6D1F7E" strokeWidth="2"/>
      <line x1="18" y1="26" x2="14" y2="12" stroke="#6D1F7E" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="14" cy="11" r="2.5" fill="#a855f7"/>
      <line x1="46" y1="26" x2="50" y2="12" stroke="#6D1F7E" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="50" cy="11" r="2.5" fill="#a855f7"/>
      <circle cx="20" cy="34" r="2.5" fill="#22c55e"/>
      <circle cx="27" cy="34" r="2.5" fill="#22c55e"/>
      <circle cx="34" cy="34" r="2.5" fill="#f59e0b"/>
      <rect x="42" y="30" width="5" height="4" rx="1" fill="#6D1F7E"/>
      <rect x="42" y="36" width="5" height="4" rx="1" fill="#6D1F7E"/>
      <path d="M22 42 L22 50 M32 42 L32 52 M42 42 L42 50" stroke="#6D1F7E" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 50 L48 50" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2"/>
    </svg>
  ),
};

const referenceLinks = [
  {
    label: "HanBin Blog",
    url: "https://hantechnote.wordpress.com/",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    label: "Extreme GTAC Knowledge",
    url: "https://gtacknowledge.extremenetworks.com/",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    label: "Support Policy",
    url: "https://www.extremenetworks.com/support/policies/",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { t } = useLanguage();

  const categories = [
    { id: "switching", label: t.cat_switching_label, description: t.cat_switching_desc, icon: categoryIcons.switching },
    { id: "wireless",  label: t.cat_wireless_label,  description: t.cat_wireless_desc,  icon: categoryIcons.wireless },
    { id: "management",label: t.cat_management_label,description: t.cat_management_desc,icon: categoryIcons.management },
    { id: "router",    label: t.cat_router_label,    description: t.cat_router_desc,    icon: categoryIcons.router },
  ];

  const googleUrl = query.trim()
    ? `https://www.google.com/search?q=${encodeURIComponent("extremenetworks.com " + query.trim())}`
    : "";

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-56px)]">
      <div className="flex-1 flex flex-col items-center justify-center w-full px-4 py-12">

        <div className="flex flex-col items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">{t.home_title}</h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">{t.home_subtitle}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => router.push(`/catalog?category=${cat.id}`)}
              className="group flex flex-col items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md hover:border-[#6D1F7E]/40 hover:bg-purple-50/30 dark:hover:bg-purple-900/20 transition-all"
            >
              <div className="group-hover:scale-110 transition-transform duration-200">
                {cat.icon}
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{cat.label}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-tight">{cat.description}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="w-full max-w-xl mt-8">
          <div className="flex gap-2">
            <div className="flex-1">
              <SearchBar
                value={query}
                onChange={setQuery}
                placeholder={t.home_search_placeholder}
              />
            </div>
            <a
              href={googleUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => { if (!query.trim()) e.preventDefault(); }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                query.trim()
                  ? "bg-[#6D1F7E] text-white hover:bg-[#5a1868]"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
              </svg>
              {t.home_search_btn}
            </a>
          </div>
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
            {t.home_search_hint}
          </p>
        </div>
      </div>

      <div className="w-full border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-4 px-4">
        <div className="max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{t.home_useful_url}</span>
          {referenceLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={
                link.label === "HanBin Blog"
                  ? "flex items-center gap-1.5 text-xs font-semibold text-white bg-[#6D1F7E] px-2.5 py-1 rounded-full hover:bg-[#5a1868] transition-colors"
                  : "flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-[#6D1F7E] dark:hover:text-purple-400 transition-colors"
              }
            >
              {link.icon}
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
