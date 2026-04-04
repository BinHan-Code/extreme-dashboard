"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import Fuse from "fuse.js";
import productsRaw from "@/data/products.json";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import SwitchingMatrix from "@/components/SwitchingMatrix";
import APMatrix from "@/components/APMatrix";

interface Product {
  id: string;
  name: string;
  category: string;
  segment: string;
  description: string;
  specs: Record<string, string>;
  tags: string[];
  topSeller?: boolean;
  datasheet: string;
}

const products = productsRaw as unknown as Product[];

// Map URL param → category labels in JSON
const CATEGORY_MAP: Record<string, string[]> = {
  switching: ["Switching", "Universal Switching"],
  wireless: ["Wireless"],
  management: ["Cloud Management", "On Premises Management", "Networking Software", "Analytics"],
  router: ["Routing"],
};

const ALL_CATEGORIES = Array.from(new Set(products.map((p) => p.category))).sort();
const ALL_SEGMENTS = Array.from(new Set(products.map((p) => p.segment))).sort();

function CatalogPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category") ?? "";
  const qParam = searchParams.get("q") ?? "";

  // Derive the display label for the active category group
  const activeCategoryGroup = categoryParam.toLowerCase();
  const groupLabel =
    activeCategoryGroup === "switching" ? "Switching"
    : activeCategoryGroup === "wireless" ? "Wireless"
    : activeCategoryGroup === "management" ? "Management"
    : activeCategoryGroup === "router" ? "Router"
    : "";

  const { lang, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSegment, setSelectedSegment] = useState("All");
  const [showMatrix, setShowMatrix] = useState(false);
  const [showCallout, setShowCallout] = useState(true);
  const [showAPMatrix, setShowAPMatrix] = useState(false);
  const [showAPCallout, setShowAPCallout] = useState(true);

  // Sync query from URL param on load
  useEffect(() => {
    setQuery(qParam);
    setSelectedCategory("All");
    setSelectedSegment("All");
  }, [categoryParam, qParam]);

  const fuse = useMemo(
    () => new Fuse(products, {
      keys: ["name", "description", "tags", "category", "segment"],
      threshold: 0.35,
    }),
    []
  );

  const results = useMemo(() => {
    let list: Product[];

    if (query.trim()) {
      const q = query.toLowerCase();
      // Substring match first — reliable for model numbers & exact terms
      const exact = products.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.segment.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
      // Fall back to fuzzy only when no direct hits
      list = exact.length > 0 ? exact : fuse.search(query).map((r) => r.item);
    } else {
      list = products;
    }

    // Apply group filter from URL param
    if (activeCategoryGroup && CATEGORY_MAP[activeCategoryGroup]) {
      const allowed = CATEGORY_MAP[activeCategoryGroup];
      list = list.filter((p) => allowed.includes(p.category));
    }

    // Apply dropdown filters
    if (selectedCategory !== "All") {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (selectedSegment !== "All") {
      list = list.filter((p) => p.segment === selectedSegment);
    }

    // Top sellers first
    return [...list].sort((a, b) => (b.topSeller ? 1 : 0) - (a.topSeller ? 1 : 0));
  }, [query, selectedCategory, selectedSegment, activeCategoryGroup, fuse]);

  return (
    <div>
      {showMatrix && <SwitchingMatrix onClose={() => setShowMatrix(false)} />}
      {showAPMatrix && <APMatrix onClose={() => setShowAPMatrix(false)} />}

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        {groupLabel && (
          <button
            onClick={() => router.push("/catalog")}
            className="text-gray-400 dark:text-gray-500 hover:text-[#6D1F7E] dark:hover:text-purple-400 transition-colors"
            title="Back to all products"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {groupLabel ? `${groupLabel} ${t.catalog_products_suffix}` : t.catalog_title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm">
            {lang === "JA"
              ? `${results.length}件の製品が見つかりました${groupLabel ? `（${groupLabel}）` : ""}`
              : `${results.length} product${results.length !== 1 ? "s" : ""} found${groupLabel ? ` in ${groupLabel}` : ""}`}
          </p>
        </div>
        {(activeCategoryGroup === "switching" || activeCategoryGroup === "") && (
          <div className="relative">
            {showCallout && (
              <div className="absolute bottom-full right-0 mb-2 z-10">
                <div className="relative bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                  {t.catalog_switching_callout}
                  <button onClick={() => setShowCallout(false)} className="ml-2 text-gray-400 hover:text-white" aria-label="Dismiss">✕</button>
                  <div className="absolute top-full right-4 w-0 h-0" style={{ borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid #111827" }} />
                </div>
              </div>
            )}
            <button
              onClick={() => { setShowMatrix(true); setShowCallout(false); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6D1F7E] hover:bg-[#5a1a68] text-white text-sm font-medium transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18M3 14h18M3 18h18" />
              </svg>
              {t.catalog_switching_matrix}
            </button>
          </div>
        )}
        {(activeCategoryGroup === "wireless" || activeCategoryGroup === "") && (
          <div className="relative">
            {showAPCallout && (
              <div className="absolute bottom-full right-0 mb-2 z-10">
                <div className="relative bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                  {t.catalog_ap_callout}
                  <button onClick={() => setShowAPCallout(false)} className="ml-2 text-gray-400 hover:text-white" aria-label="Dismiss">✕</button>
                  <div className="absolute top-full right-4 w-0 h-0" style={{ borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid #111827" }} />
                </div>
              </div>
            )}
            <button
              onClick={() => { setShowAPMatrix(true); setShowAPCallout(false); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1F4F7E] hover:bg-[#1a4068] text-white text-sm font-medium transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
              {t.catalog_ap_matrix}
            </button>
          </div>
        )}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder={t.catalog_search_placeholder}
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6D1F7E]/30 focus:border-[#6D1F7E]"
        >
          <option value="All">{t.catalog_all_categories}</option>
          {ALL_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={selectedSegment}
          onChange={(e) => setSelectedSegment(e.target.value)}
          className="px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6D1F7E]/30 focus:border-[#6D1F7E]"
        >
          <option value="All">{t.catalog_all_segments}</option>
          {ALL_SEGMENTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <p className="text-sm font-medium">{t.catalog_no_products}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-[#6D1F7E] rounded-lg hover:bg-[#5a1a68] transition-colors"
          >
            {t.catalog_go_to_main}
          </button>
        </div>
      )}
    </div>
  );
}

export default function CatalogPageWrapper() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400 text-sm">{/* Loading... */}</div>}>
      <CatalogPage />
    </Suspense>
  );
}
