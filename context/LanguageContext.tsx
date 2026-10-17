"use client";

import { createContext, useContext } from "react";
import { Lang, translations, Translations } from "@/lib/translations";
import { localizePath } from "@/lib/i18n";

interface LanguageContextType {
  lang: Lang;
  t: Translations;
  // Prefix an internal path for the current language ("/catalog" → "/ja/catalog").
  href: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "EN",
  t: translations.EN,
  href: (path) => path,
});

// Language comes from the URL (/ja/... vs unprefixed), so the server renders
// the correct language and search engines index both versions.
// Switching language is a navigation — see the language selector in Navbar.
export function LanguageProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], href: (path) => localizePath(path, lang) }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
