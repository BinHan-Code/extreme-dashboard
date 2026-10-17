import type { Metadata } from "next";
import { Lang, translations } from "@/lib/translations";

// URL locale segments. English is served at unprefixed URLs (proxy.ts
// rewrites them to /en internally); Japanese lives under /ja.
export const LOCALES = ["en", "ja"] as const;
export type Locale = (typeof LOCALES)[number];

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://extreme-dashboard-production.up.railway.app";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function localeToLang(locale: string): Lang {
  return locale === "ja" ? "JA" : "EN";
}

// "/catalog" → "/ja/catalog" for Japanese, unchanged for English.
export function localizePath(path: string, lang: Lang): string {
  if (lang !== "JA") return path;
  return path === "/" ? "/ja" : `/ja${path}`;
}

// "/ja/catalog" → "/catalog"; English paths pass through.
export function stripLocale(pathname: string): string {
  if (pathname === "/ja") return "/";
  return pathname.startsWith("/ja/") ? pathname.slice(3) : pathname;
}

type PageKey = "home" | "catalog" | "competitive" | "chat" | "manga";

// app/opengraph-image.tsx sits above the [lang] root layout, so Next doesn't
// attach it automatically — reference it explicitly.
const ogImage = { url: "/opengraph-image", width: 1200, height: 630, alt: "Extreme Networks Solutions Toolkit" };

// Per-page title, description, canonical URL and hreflang alternates.
export function pageMetadata(locale: string, page: PageKey, path: string): Metadata {
  const lang = localeToLang(locale);
  const t = translations[lang];
  const title = t[`meta_${page}_title`];
  const description = t[`meta_${page}_desc`];
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: localizePath(path, lang),
      languages: {
        en: path,
        ja: localizePath(path, "JA"),
        "x-default": path,
      },
    },
    openGraph: {
      type: "website",
      siteName: t.meta_site_name,
      title,
      description,
      url: localizePath(path, lang),
      locale: lang === "JA" ? "ja_JP" : "en_US",
      alternateLocale: lang === "JA" ? "en_US" : "ja_JP",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
