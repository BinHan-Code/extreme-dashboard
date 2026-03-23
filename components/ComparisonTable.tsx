"use client";

import { useState } from "react";

interface VendorData {
  rating: "strong" | "moderate" | "weak";
  summary: string;
  highlights: string[];
}

interface Comparison {
  category: string;
  description: string;
  data: Record<string, VendorData>;
}

interface Vendor {
  id: string;
  name: string;
  color: string;
  tagline: string;
}

interface ComparisonTableProps {
  vendors: Vendor[];
  comparisons: Comparison[];
}

const ratingConfig = {
  strong: {
    label: "Strong",
    icon: "●",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    dot: "text-green-500",
  },
  moderate: {
    label: "Moderate",
    icon: "◑",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    dot: "text-yellow-500",
  },
  weak: {
    label: "Limited",
    icon: "○",
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
    dot: "text-red-400",
  },
};

export default function ComparisonTable({
  vendors,
  comparisons,
}: ComparisonTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [activeVendor, setActiveVendor] = useState<string | null>(null);

  const filteredComparisons = activeVendor
    ? comparisons.filter((c) => {
        const d = c.data[activeVendor];
        return d?.rating === "strong";
      })
    : comparisons;

  return (
    <div>
      {/* Vendor filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-sm text-gray-500 self-center mr-1">
          Highlight strengths:
        </span>
        {vendors.map((v) => (
          <button
            key={v.id}
            onClick={() =>
              setActiveVendor(activeVendor === v.id ? null : v.id)
            }
            style={
              activeVendor === v.id
                ? { backgroundColor: v.color, borderColor: v.color }
                : {}
            }
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              activeVendor === v.id
                ? "text-white"
                : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-400"
            }`}
          >
            {v.name}
          </button>
        ))}
        {activeVendor && (
          <button
            onClick={() => setActiveVendor(null)}
            className="px-3 py-1 rounded-full text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          >
            Clear
          </button>
        )}
      </div>

      {/* Comparison grid */}
      <div className="space-y-3">
        {filteredComparisons.map((comp) => (
          <div
            key={comp.category}
            className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm"
          >
            {/* Row header */}
            <button
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              onClick={() =>
                setExpandedRow(
                  expandedRow === comp.category ? null : comp.category
                )
              }
            >
              <div>
                <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                  {comp.category}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {comp.description}
                </p>
              </div>

              {/* Rating dots row (collapsed summary) */}
              <div className="flex items-center gap-3 ml-4">
                {vendors.map((v) => {
                  const d = comp.data[v.id];
                  const cfg = ratingConfig[d?.rating ?? "moderate"];
                  return (
                    <div key={v.id} className="flex flex-col items-center gap-0.5">
                      <span className={`text-lg leading-none ${cfg.dot}`}>
                        {cfg.icon}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 hidden md:block">
                        {v.name.split(" ")[0]}
                      </span>
                    </div>
                  );
                })}
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ml-2 ${
                    expandedRow === comp.category ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>

            {/* Expanded detail */}
            {expandedRow === comp.category && (
              <div className="border-t border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-700">
                {vendors.map((v) => {
                  const d = comp.data[v.id];
                  const cfg = ratingConfig[d?.rating ?? "moderate"];
                  return (
                    <div
                      key={v.id}
                      className={`p-4 ${cfg.bg}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="text-xs font-bold"
                          style={{ color: v.color }}
                        >
                          {v.name}
                        </span>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                        >
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                        {d?.summary}
                      </p>
                      <ul className="space-y-1">
                        {d?.highlights.map((h) => (
                          <li key={h} className="flex items-start gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <span className={`mt-0.5 ${cfg.dot}`}>✓</span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
