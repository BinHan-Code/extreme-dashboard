import type { MetadataRoute } from "next";
import { localizePath, siteUrl } from "@/lib/i18n";

const PAGES = ["/", "/catalog", "/competitive", "/chat", "/manga"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap((path) => {
    const alternates = {
      languages: {
        en: `${siteUrl}${path === "/" ? "" : path}`,
        ja: `${siteUrl}${localizePath(path, "JA")}`,
      },
    };
    return [
      { url: alternates.languages.en, alternates, priority: path === "/" ? 1 : 0.8 },
      { url: alternates.languages.ja, alternates, priority: path === "/" ? 1 : 0.8 },
    ];
  });
}
