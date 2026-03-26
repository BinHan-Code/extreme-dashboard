"use client";

import { useEffect, useRef } from "react";
import matrixData from "@/data/switching-matrix.json";

interface MatrixRow {
  product: string;
  sku: string;
  competitors: string;
  interfaces: Record<string, string>;
  specs: Record<string, string>;
}

const data = matrixData as MatrixRow[];

const INTERFACE_KEYS = Object.keys(data[0]?.interfaces ?? {});
const SPEC_KEYS = Object.keys(data[0]?.specs ?? {});

const ALL_COLS = ["Product", "SKU", "Competitors", ...INTERFACE_KEYS, ...SPEC_KEYS];

function cellClass(val: string) {
  return val && val !== "" && val !== "N/A"
    ? "text-gray-900 dark:text-gray-100"
    : "text-gray-300 dark:text-gray-600";
}

export default function SwitchingMatrix({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Group rows by product for color banding
  const products = Array.from(new Set(data.map((r) => r.product)));
  const productIndex = Object.fromEntries(products.map((p, i) => [p, i]));

  const bandColors = [
    "bg-white dark:bg-gray-900",
    "bg-purple-50 dark:bg-purple-950/30",
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 pt-10 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-[1400px] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col"
        style={{ maxHeight: "85vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Universal Switching Matrix
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {data.length} SKUs across {products.length} product families
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable table */}
        <div className="overflow-auto flex-1">
          <table className="text-xs border-collapse">
            <thead className="sticky top-0 z-10">
              {/* Group row */}
              <tr>
                <th colSpan={3} className="bg-[#6D1F7E] text-white text-center font-semibold px-3 py-2 border border-purple-800" style={{ width: 120, minWidth: 120, maxWidth: 120 }}>
                  Product Info
                </th>
                <th colSpan={INTERFACE_KEYS.length} className="bg-[#3B0F4E] text-white text-center font-semibold px-3 py-2 border border-purple-900" style={{ width: INTERFACE_KEYS.length * 120, minWidth: INTERFACE_KEYS.length * 120 }}>
                  Interface
                </th>
                <th colSpan={SPEC_KEYS.length} className="bg-gray-800 text-white text-center font-semibold px-3 py-2 border border-gray-700" style={{ width: SPEC_KEYS.length * 120, minWidth: SPEC_KEYS.length * 120 }}>
                  Spec / Scalability
                </th>
              </tr>
              {/* Column headers */}
              <tr>
                {ALL_COLS.map((col) => (
                  <th
                    key={col}
                    style={{ width: 120, minWidth: 120, maxWidth: 120 }}
                    className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium px-3 py-2 border border-gray-200 dark:border-gray-700 text-left overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => {
                const band = bandColors[productIndex[row.product] % 2];
                const isFirstOfProduct = i === 0 || data[i - 1].product !== row.product;
                return (
                  <tr key={row.sku} className={`${band} hover:bg-yellow-50 dark:hover:bg-yellow-900/10 transition-colors`}>
                    <td style={{ width: 120, minWidth: 120, maxWidth: 120 }} title={isFirstOfProduct ? row.product : ""} className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 font-semibold text-[#6D1F7E] dark:text-purple-400 overflow-hidden text-ellipsis whitespace-nowrap">
                      {isFirstOfProduct ? row.product : ""}
                    </td>
                    <td style={{ width: 120, minWidth: 120, maxWidth: 120 }} title={row.sku} className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 font-mono text-gray-800 dark:text-gray-200 overflow-hidden text-ellipsis whitespace-nowrap">
                      {row.sku}
                    </td>
                    <td style={{ width: 120, minWidth: 120, maxWidth: 120 }} title={row.competitors} className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
                      {row.competitors || "—"}
                    </td>
                    {INTERFACE_KEYS.map((k) => (
                      <td key={k} style={{ width: 120, minWidth: 120, maxWidth: 120 }} title={row.interfaces[k] || "—"} className={`px-3 py-1.5 border border-gray-200 dark:border-gray-700 text-center overflow-hidden text-ellipsis whitespace-nowrap ${cellClass(row.interfaces[k])}`}>
                        {row.interfaces[k] || "—"}
                      </td>
                    ))}
                    {SPEC_KEYS.map((k) => (
                      <td key={k} style={{ width: 120, minWidth: 120, maxWidth: 120 }} title={row.specs[k] || "—"} className={`px-3 py-1.5 border border-gray-200 dark:border-gray-700 text-center overflow-hidden text-ellipsis whitespace-nowrap ${cellClass(row.specs[k])}`}>
                        {row.specs[k] || "—"}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 text-xs text-gray-400 dark:text-gray-500">
          Source: Universal_Switches_with_X435_Matrix_20251228.xlsx · Scroll horizontally to see all columns
        </div>
      </div>
    </div>
  );
}
