"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Invisible component that reports the current page path to /api/track on
// every navigation. Rendered null — has zero visual impact.
// Placed in the root layout so it fires on every page without exception.
export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Fire-and-forget: tracking failures must never affect the user experience
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
