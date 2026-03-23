import competitiveDataRaw from "@/data/competitive.json";
import ComparisonTable from "@/components/ComparisonTable";

// Cast JSON data to the types ComparisonTable expects
const competitiveData = competitiveDataRaw as typeof competitiveDataRaw & {
  comparisons: Array<{
    category: string;
    description: string;
    data: Record<string, { rating: "strong" | "moderate" | "weak"; summary: string; highlights: string[] }>;
  }>;
};

export default function CompetitivePage() {
  const { vendors, comparisons, categories } = competitiveData;

  const vendorStrengths = vendors.map((v) => {
    const strong = comparisons.filter(
      (c) => c.data[v.id as keyof typeof c.data]?.rating === "strong"
    ).length;
    return { ...v, strong };
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Competitive Intelligence
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Comparing ExtremeNetworks against Cisco, Juniper, Aruba, and Fortinet
          across {categories.length} key dimensions.
        </p>
      </div>

      {/* Vendor Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
        {vendorStrengths.map((v) => (
          <div key={v.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <div className="w-8 h-1.5 rounded-full mb-3" style={{ backgroundColor: v.color }} />
            <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{v.name}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-tight">{v.tagline}</p>
            <div className="mt-3 flex items-center gap-1">
              <span className="text-xl font-bold" style={{ color: v.color }}>{v.strong}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">/ {comparisons.length} strong</span>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 text-xs text-gray-500 dark:text-gray-400">
        <span className="font-medium text-gray-700 dark:text-gray-300">Rating legend:</span>
        <span className="flex items-center gap-1.5">
          <span className="text-green-500 text-base">●</span> Strong
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-yellow-500 text-base">◑</span> Moderate
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-red-400 text-base">○</span> Limited
        </span>
        <span className="text-gray-400 dark:text-gray-500">
          Click any row to expand detailed comparison
        </span>
      </div>

      <ComparisonTable vendors={vendors} comparisons={comparisons} />
    </div>
  );
}
