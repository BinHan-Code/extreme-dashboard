import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/i18n";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /manager is kept out of the index via its noindex meta tag instead
      disallow: ["/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
