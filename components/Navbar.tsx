"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const languages = ["EN", "中文", "日本語", "한국어", "Español"];

export default function Navbar() {
  const pathname = usePathname();
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("EN");

  const links = [
    { href: "/catalog", label: "Product Catalog" },
    { href: "/competitive", label: "Competitive Intelligence" },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="bg-[#6D1F7E] text-white shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-white rounded-sm flex items-center justify-center">
              <span className="text-[#6D1F7E] font-black text-xs">EN</span>
            </div>
            <span className="font-semibold text-sm tracking-tight hidden sm:block">
              Extreme Networks
            </span>
          </Link>

          {/* Nav links + Language */}
          <div className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-white text-[#6D1F7E]"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Language selector */}
            <div className="relative ml-2">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                {/* Globe icon */}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0 0c-2.5 0-4.5-4-4.5-9s2-9 4.5-9 4.5 4 4.5 9-2 9-4.5 9zm-9-9h18" />
                </svg>
                {selectedLang}
                <svg className={`w-3 h-3 transition-transform ${langOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 min-w-[120px]">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setSelectedLang(lang); setLangOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        selectedLang === lang
                          ? "text-[#6D1F7E] font-semibold bg-purple-50"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
