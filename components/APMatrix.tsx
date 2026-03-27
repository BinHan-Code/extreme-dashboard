"use client";

import { useEffect } from "react";
import apData from "@/data/ap-matrix.json";

interface APRow {
  platform: string;
  descriptions: string[];
  dram: string;
  norFlash: string;
  flash: string;
  cpu: string;
  radio: string;
}

const data = apData as APRow[];

const SPEC_COLS: { key: keyof APRow; label: string }[] = [
  { key: "dram",     label: "DRAM Memory" },
  { key: "norFlash", label: "NOR Flash" },
  { key: "flash",    label: "Flash" },
  { key: "cpu",      label: "CPU Type / Speed" },
  { key: "radio",    label: "Radio Card" },
];

const COL_W = 160;

export default function APMatrix({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const totalCols = 1 + 1 + SPEC_COLS.length; // platform + descriptions + specs

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 pt-10 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-[1200px] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col"
        style={{ maxHeight: "85vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Universal AP Spec Matrix
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {data.length} access point platforms
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
              <tr>
                <th style={{ width: COL_W, minWidth: COL_W, maxWidth: COL_W }} className="bg-[#6D1F7E] text-white text-center font-semibold px-3 py-2 border border-purple-800">
                  Platform
                </th>
                <th style={{ width: COL_W * 2, minWidth: COL_W * 2 }} className="bg-[#3B0F4E] text-white text-center font-semibold px-3 py-2 border border-purple-900">
                  Description
                </th>
                {SPEC_COLS.map((c) => (
                  <th key={c.key} style={{ width: COL_W, minWidth: COL_W, maxWidth: COL_W }} className="bg-gray-800 text-white text-center font-semibold px-3 py-2 border border-gray-700">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => {
                const band = i % 2 === 0
                  ? "bg-white dark:bg-gray-900"
                  : "bg-purple-50 dark:bg-purple-950/30";
                return (
                  <tr key={row.platform} className={`${band} hover:bg-yellow-50 dark:hover:bg-yellow-900/10 transition-colors`}>
                    <td style={{ width: COL_W, minWidth: COL_W, maxWidth: COL_W }} title={row.platform} className="px-3 py-2 border border-gray-200 dark:border-gray-700 font-semibold text-[#6D1F7E] dark:text-purple-400 whitespace-nowrap overflow-hidden text-ellipsis">
                      {row.platform}
                    </td>
                    <td style={{ width: COL_W * 2, minWidth: COL_W * 2, maxWidth: COL_W * 2 }} className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                      <ul className="space-y-0.5">
                        {row.descriptions.map((d, j) => (
                          <li key={j} className="flex items-start gap-1">
                            <span className="text-[#6D1F7E] dark:text-purple-400 mt-0.5">·</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    {SPEC_COLS.map((c) => {
                      const val = row[c.key] as string;
                      const isEmpty = !val || val === "N/A";
                      return (
                        <td key={c.key} style={{ width: COL_W, minWidth: COL_W, maxWidth: COL_W }} title={val} className={`px-3 py-2 border border-gray-200 dark:border-gray-700 text-center whitespace-nowrap overflow-hidden text-ellipsis ${isEmpty ? "text-gray-300 dark:text-gray-600" : "text-gray-900 dark:text-gray-100"}`}>
                          {val || "—"}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 text-xs text-gray-400 dark:text-gray-500">
          Scroll horizontally to see all columns
        </div>
      </div>
    </div>
  );
}
