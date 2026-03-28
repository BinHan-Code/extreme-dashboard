"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Lang } from "@/lib/translations";

const LANG_OPTIONS: { display: string; value: Lang }[] = [
  { display: "EN", value: "EN" },
  { display: "日本語", value: "JA" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [langOpen, setLangOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setDarkMode(isDark);
  };

  const links = [
    { href: "/", label: t.nav_catalog },
    { href: "/competitive", label: t.nav_competitive },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const selectedDisplay = LANG_OPTIONS.find((o) => o.value === lang)?.display ?? "EN";

  return (
    <nav className="bg-[#6D1F7E] text-white shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-sm overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://github.com/BinHan-Code.png"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-semibold text-sm tracking-tight hidden sm:block">
              Extreme Networks
            </span>
          </Link>

          {/* Nav links + controls */}
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

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={darkMode ? t.nav_theme_light : t.nav_theme_dark}
              className="ml-1 p-2 rounded-md text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              {darkMode ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5" strokeWidth={2}/>
                  <path strokeLinecap="round" strokeWidth={2}
                    d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>

            {/* Language selector */}
            <div className="relative ml-1">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0 0c-2.5 0-4.5-4-4.5-9s2-9 4.5-9 4.5 4 4.5 9-2 9-4.5 9zm-9-9h18" />
                </svg>
                {selectedDisplay}
                <svg className={`w-3 h-3 transition-transform ${langOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 py-1 min-w-[120px]">
                  {LANG_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => { setLang(option.value); setLangOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        lang === option.value
                          ? "text-[#6D1F7E] font-semibold bg-purple-50 dark:bg-purple-900/30"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {option.display}
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
