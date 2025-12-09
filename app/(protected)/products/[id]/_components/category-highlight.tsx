"use client";

import { cn } from "@/lib/utils";
import type { ICategory } from "@/types/products";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface CategoryHighlightProps {
  category: ICategory;
  className?: string;
}

export function CategoryHighlight({ category, className }: CategoryHighlightProps) {
  const hasImage = !!category.imageUrl;

  return (
    <div
      className={cn(
        "flex gap-4 rounded-2xl bg-white border border-gray-200 px-4 py-4",
        "hover:shadow-md transition-all",
        className,
      )}
    >
      {/* Category image */}
      <div className="flex-shrink-0">
        <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
          {hasImage ? (
            <Image src={category.imageUrl as string} alt={category.name} fill className="object-cover" />
          ) : (
            <span className="text-lg font-semibold text-gray-900">
              {category.name?.charAt(0) || "C"}
            </span>
          )}
        </div>
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-1">
          <p className="text-gray-900 font-semibold text-base truncate">{category.name}</p>
          <CheckCircle2 className="h-4 w-4 text-sky-500 flex-shrink-0" />
        </div>
        <p className="text-xs text-gray-500 mb-1">
          Danh mục sản phẩm chất lượng cao.
        </p>
        {category.description && (
          <p className="text-sm text-gray-700 line-clamp-3">{category.description}</p>
        )}
      </div>
    </div>
  );
}
