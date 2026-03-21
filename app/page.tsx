"use client";

import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import productsRaw from "@/data/products.json";

interface Product {
  id: string;
  name: string;
  category: string;
  segment: string;
  description: string;
  specs: Record<string, string>;
  tags: string[];
  datasheet: string;
}

const products = productsRaw as unknown as Product[];
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";

const ALL_CATEGORIES = Array.from(
  new Set(products.map((p) => p.category))
).sort();
const ALL_SEGMENTS = Array.from(
  new Set(products.map((p) => p.segment))
).sort();

export default function CatalogPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSegment, setSelectedSegment] = useState("All");

  const fuse = useMemo(
    () =>
      new Fuse(products, {
        keys: ["name", "description", "tags", "category", "segment"],
        threshold: 0.35,
      }),
    []
  );

  const results = useMemo(() => {
    let list = query ? fuse.search(query).map((r) => r.item) : products;
    if (selectedCategory !== "All") {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (selectedSegment !== "All") {
      list = list.filter((p) => p.segment === selectedSegment);
    }
    return list;
  }, [query, selectedCategory, selectedSegment, fuse]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {products.length} products across switching, wireless, cloud
          management, routing, security and more.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search products, categories, tags..."
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#6D1F7E]/30 focus:border-[#6D1F7E]"
        >
          <option value="All">All Categories</option>
          {ALL_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={selectedSegment}
          onChange={(e) => setSelectedSegment(e.target.value)}
          className="px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#6D1F7E]/30 focus:border-[#6D1F7E]"
        >
          <option value="All">All Segments</option>
          {ALL_SEGMENTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-400 mb-4">
        Showing {results.length} of {products.length} products
        {query && ` for "${query}"`}
      </p>

      {/* Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <svg
            className="w-12 h-12 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <p className="text-sm font-medium">No products found</p>
          <p className="text-xs mt-1">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setQuery("");
              setSelectedCategory("All");
              setSelectedSegment("All");
            }}
            className="mt-4 text-xs text-[#6D1F7E] hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
