"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";

const categories = [
  {
    id: "switching",
    label: "Switching",
    description: "Campus & Enterprise Switches",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
        {/* Switch body */}
        <rect x="6" y="22" width="52" height="20" rx="4" fill="#6D1F7E" opacity="0.15" stroke="#6D1F7E" strokeWidth="2"/>
        {/* Ports row */}
        {[14, 22, 30, 38, 46].map((x) => (
          <rect key={x} x={x} y="28" width="5" height="8" rx="1" fill="#6D1F7E" />
        ))}
        {/* Uplink ports */}
        <rect x="52" y="26" width="4" height="5" rx="1" fill="#a855f7"/>
        <rect x="52" y="33" width="4" height="5" rx="1" fill="#a855f7"/>
        {/* Left arrow in */}
        <path d="M2 32 L8 28 L8 36 Z" fill="#6D1F7E"/>
        {/* Right arrow out */}
        <path d="M62 32 L56 28 L56 36 Z" fill="#6D1F7E"/>
      </svg>
    ),
  },
  {
    id: "wireless",
    label: "Wireless",
    description: "Wi-Fi 6 / 6E Access Points",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
        {/* WiFi arcs */}
        <path d="M12 30 Q32 10 52 30" stroke="#6D1F7E" strokeWidth="4" strokeLinecap="round" fill="none"/>
        <path d="M19 37 Q32 22 45 37" stroke="#6D1F7E" strokeWidth="4" strokeLinecap="round" fill="none"/>
        <path d="M26 44 Q32 36 38 44" stroke="#6D1F7E" strokeWidth="4" strokeLinecap="round" fill="none"/>
        {/* Dot */}
        <circle cx="32" cy="52" r="4" fill="#6D1F7E"/>
        {/* Signal rays on top */}
        <path d="M32 8 L32 2" stroke="#a855f7" strokeWidth="2" strokeLinecap="round"/>
        <path d="M32 8 L26 5" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M32 8 L38 5" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "management",
    label: "Management",
    description: "Cloud & On-Prem NMS",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
        {/* Cloud shape */}
        <path d="M44 38 Q52 38 52 30 Q52 22 44 22 Q42 16 36 16 Q30 16 28 22 Q20 22 20 30 Q20 38 28 38 Z"
          fill="#6D1F7E" opacity="0.15" stroke="#6D1F7E" strokeWidth="2"/>
        {/* Gear inside cloud */}
        <circle cx="36" cy="30" r="4" fill="#6D1F7E"/>
        {[0,45,90,135,180,225,270,315].map((angle, i) => {
          const r = angle * Math.PI / 180;
          const x = 36 + 7 * Math.cos(r);
          const y = 30 + 7 * Math.sin(r);
          return <circle key={i} cx={x} cy={y} r="2" fill="#6D1F7E"/>;
        })}
        {/* Data lines below cloud */}
        <line x1="28" y1="44" x2="28" y2="50" stroke="#6D1F7E" strokeWidth="2" strokeLinecap="round"/>
        <line x1="36" y1="44" x2="36" y2="52" stroke="#6D1F7E" strokeWidth="2" strokeLinecap="round"/>
        <line x1="44" y1="44" x2="44" y2="50" stroke="#6D1F7E" strokeWidth="2" strokeLinecap="round"/>
        <line x1="22" y1="50" x2="50" y2="50" stroke="#a855f7" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "router",
    label: "Router",
    description: "Data Center & SP Routing",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
        {/* Router body */}
        <rect x="10" y="26" width="44" height="16" rx="3" fill="#6D1F7E" opacity="0.15" stroke="#6D1F7E" strokeWidth="2"/>
        {/* Antenna left */}
        <line x1="18" y1="26" x2="14" y2="12" stroke="#6D1F7E" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="14" cy="11" r="2.5" fill="#a855f7"/>
        {/* Antenna right */}
        <line x1="46" y1="26" x2="50" y2="12" stroke="#6D1F7E" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="50" cy="11" r="2.5" fill="#a855f7"/>
        {/* Status LEDs */}
        <circle cx="20" cy="34" r="2.5" fill="#22c55e"/>
        <circle cx="27" cy="34" r="2.5" fill="#22c55e"/>
        <circle cx="34" cy="34" r="2.5" fill="#f59e0b"/>
        {/* Ports right side */}
        <rect x="42" y="30" width="5" height="4" rx="1" fill="#6D1F7E"/>
        <rect x="42" y="36" width="5" height="4" rx="1" fill="#6D1F7E"/>
        {/* Network lines below */}
        <path d="M22 42 L22 50 M32 42 L32 52 M42 42 L42 50" stroke="#6D1F7E" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 50 L48 50" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2"/>
      </svg>
    ),
  },
];

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-56px)]">
      {/* Main content — centered */}
      <div className="flex-1 flex flex-col items-center justify-center w-full px-4 py-12">

        {/* Logo / Title */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-[#6D1F7E] rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <span className="text-white font-black text-2xl">EN</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Extreme Networks</h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Product Dashboard</p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="w-full max-w-xl mb-10">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search products, specs, models..."
          />
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
            Press Enter to search across all products
          </p>
        </form>

        {/* Category tiles */}
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
      </div>

      {/* Reference links — bottom */}
      <div className="w-full border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-4 px-4">
        <div className="max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">References:</span>
          {referenceLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-[#6D1F7E] dark:hover:text-purple-400 transition-colors"
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
