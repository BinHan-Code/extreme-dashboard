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

const categoryColors: Record<string, string> = {
  Switching: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  "Universal Switching": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
  Wireless: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  "Cloud Management": "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  "Networking Software": "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  Routing: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  Security: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  Analytics: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border shadow-sm hover:shadow-md transition-shadow flex flex-col relative ${
      product.topSeller ? "border-[#6D1F7E]" : "border-gray-200 dark:border-gray-700"
    }`}>
      {product.topSeller && (
        <div className="absolute -top-3 left-4">
          <span className="inline-flex items-center gap-1 bg-[#6D1F7E] text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
            ★ Top Seller
          </span>
        </div>
      )}

      <div className={`p-5 flex-1 ${product.topSeller ? "pt-6" : ""}`}>
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug">
            {product.name}
          </h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
            categoryColors[product.category] ?? "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          }`}>
            {product.category}
          </span>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span className="font-medium text-gray-600 dark:text-gray-300">Segment:</span>{" "}
          {product.segment}
        </p>

        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 mb-4 leading-relaxed">
          {product.description}
        </p>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-1">
          {Object.entries(product.specs).map(([key, value]) => (
            <div key={key} className="flex justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400 capitalize">{key}</span>
              <span className="text-gray-800 dark:text-gray-200 font-medium text-right max-w-[55%]">
                {value}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          {product.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
          {product.tags.length > 4 && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              +{product.tags.length - 4}
            </span>
          )}
        </div>
      </div>

      <div className="px-5 pb-4">
        <a
          href={product.datasheet}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center text-xs font-medium text-[#6D1F7E] dark:text-purple-400 border border-[#6D1F7E] dark:border-purple-500 rounded-lg py-2 hover:bg-[#6D1F7E] dark:hover:bg-purple-700 hover:text-white transition-colors"
        >
          View Datasheet →
        </a>
      </div>
    </div>
  );
}
