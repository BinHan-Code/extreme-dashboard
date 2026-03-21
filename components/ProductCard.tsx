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

const categoryColors: Record<string, string> = {
  Switching: "bg-blue-100 text-blue-800",
  Wireless: "bg-green-100 text-green-800",
  "Cloud Management": "bg-purple-100 text-purple-800",
  "Networking Software": "bg-orange-100 text-orange-800",
  Routing: "bg-red-100 text-red-800",
  Security: "bg-rose-100 text-rose-800",
  Analytics: "bg-teal-100 text-teal-800",
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug">
            {product.name}
          </h3>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
              categoryColors[product.category] ?? "bg-gray-100 text-gray-700"
            }`}
          >
            {product.category}
          </span>
        </div>

        <p className="text-xs text-gray-500 mb-1">
          <span className="font-medium text-gray-600">Segment:</span>{" "}
          {product.segment}
        </p>

        <p className="text-sm text-gray-600 mt-2 mb-4 leading-relaxed">
          {product.description}
        </p>

        <div className="bg-gray-50 rounded-lg p-3 space-y-1">
          {Object.entries(product.specs).map(([key, value]) => (
            <div key={key} className="flex justify-between text-xs">
              <span className="text-gray-500 capitalize">{key}</span>
              <span className="text-gray-800 font-medium text-right max-w-[55%]">
                {value}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          {product.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
          {product.tags.length > 4 && (
            <span className="text-xs text-gray-400">
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
          className="block w-full text-center text-xs font-medium text-[#6D1F7E] border border-[#6D1F7E] rounded-lg py-2 hover:bg-[#6D1F7E] hover:text-white transition-colors"
        >
          View Datasheet →
        </a>
      </div>
    </div>
  );
}
