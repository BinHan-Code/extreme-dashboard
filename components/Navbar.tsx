"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Lang } from "@/lib/translations";
import { localizePath, stripLocale } from "@/lib/i18n";

const LANG_OPTIONS: { display: string; value: Lang }[] = [
  { display: "EN", value: "EN" },
  { display: "日本語", value: "JA" },
];

export default function Navbar() {
  const router = useRouter();
  // Path without the /ja prefix, so link matching works in both languages
  const pathname = stripLocale(usePathname());
  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { lang, t, href } = useLanguage();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the theme class is only readable after mount
    setDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setDarkMode(isDark);
  };

  const links = [
    { href: "/catalog", label: t.nav_catalog, icon: null },
    { href: "/competitive", label: t.nav_competitive, icon: null },
    { href: "/chat", label: t.nav_chat, icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-4 4v-4z" />
      </svg>
    )},
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  const linkClass = (href: string, mobile: boolean) => {
    const layout = mobile ? "flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium" : "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium";
    if (href === "/chat") return `${layout} bg-white text-[#6D1F7E] hover:bg-white/90 transition-colors`;
    return `${layout} transition-colors ${
      isActive(href) ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
    }`;
  };

  const selectedDisplay = LANG_OPTIONS.find((o) => o.value === lang)?.display ?? "EN";

  return (
    <nav className="bg-[#6D1F7E] text-white shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href={href("/")} className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 shrink-0 rounded-sm overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://github.com/BinHan-Code.png"
                alt="Bin Han"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-semibold text-sm tracking-tight truncate">
              Bin Han · Extreme Toolkit
            </span>
          </Link>

          {/* Nav links + controls */}
          <div className="flex items-center gap-1">
            <div className="hidden lg:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={href(link.href)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={linkClass(link.href, false)}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>

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
                onClick={() => { setLangOpen(!langOpen); setMenuOpen(false); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0 0c-2.5 0-4.5-4-4.5-9s2-9 4.5-9 4.5 4 4.5 9-2 9-4.5 9zm-9-9h18" />
                </svg>
                <span className="hidden sm:inline">{selectedDisplay}</span>
                <svg className={`w-3 h-3 transition-transform ${langOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 py-1 min-w-[120px]">
                  {LANG_OPTIONS.map((option) => {
                    const target = localizePath(pathname, option.value);
                    return (
                      // Each language has its own URL (/ja/... for Japanese)
                      <Link
                        key={option.value}
                        href={target}
                        hrefLang={option.value === "JA" ? "ja" : "en"}
                        onClick={(e) => {
                          // Keep query params (e.g. ?category=wireless) when switching
                          e.preventDefault();
                          setLangOpen(false);
                          router.push(target + window.location.search);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                          lang === option.value
                            ? "text-[#6D1F7E] font-semibold bg-purple-50 dark:bg-purple-900/30"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {option.display}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => { setMenuOpen(!menuOpen); setLangOpen(false); }}
              aria-label={menuOpen ? t.nav_menu_close : t.nav_menu_open}
              aria-expanded={menuOpen}
              className="lg:hidden ml-1 p-2 rounded-md text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={href(link.href)}
              onClick={() => setMenuOpen(false)}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={linkClass(link.href, true)}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
