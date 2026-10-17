import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Pages live under app/[lang]. English keeps its unprefixed URLs (/catalog),
// which are rewritten internally to /en/catalog; Japanese is served at /ja/...
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/ja" || pathname.startsWith("/ja/")) return;

  // /en/... is internal only — redirect to the canonical unprefixed URL
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip API routes, Next internals, generated images in app/ and files with an
  // extension (icon.svg, robots.txt, sitemap.xml)
  matcher: ["/((?!api|_next|opengraph-image|apple-icon|.*\\..*).*)"],
};
