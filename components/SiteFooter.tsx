"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function SiteFooter() {
  const { t } = useLanguage();
  return (
    <footer className="py-3 px-4 text-center text-[11px] text-gray-400 dark:text-gray-500">
      {t.footer_disclaimer}
    </footer>
  );
}
