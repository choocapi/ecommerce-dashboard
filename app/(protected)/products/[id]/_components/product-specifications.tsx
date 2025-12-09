"use client";

import { IProduct, parseSpecifications } from "@/types/products";

interface ProductSpecificationsProps {
  product: IProduct;
  className?: string;
}

export default function ProductSpecifications({ product, className }: ProductSpecificationsProps) {
  const specifications = parseSpecifications(product.specifications);

  if (Object.keys(specifications).length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Title */}
        <h2 className="text-gray-900 font-bold text-2xl mb-6">Cấu hình & đặc điểm</h2>

        {/* Specifications Table */}
        <div className="space-y-0">
          {Object.entries(specifications).map(([key, value], index, array) => (
            <div
              key={key}
              className={`flex ${
                index < array.length - 1 ? "border-b border-gray-200 pb-4 mb-4" : ""
              }`}
            >
              {/* Label Column */}
              <div className="w-1/3 md:w-1/4 shrink-0">
                <span className="text-sm text-gray-600 font-medium">{key}</span>
              </div>

              {/* Value Column */}
              <div className="flex-1">
                <span className="text-sm text-gray-900">{value || "—"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
