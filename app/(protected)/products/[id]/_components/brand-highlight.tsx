"use client";

import { cn } from "@/lib/utils";
import type { IBrand } from "@/types/products";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface BrandHighlightProps {
  brand: IBrand;
  className?: string;
}

export function BrandHighlight({ brand, className }: BrandHighlightProps) {
  const hasLogo = !!brand.logoUrl;

  return (
    <div
      className={cn(
        "flex gap-4 rounded-2xl bg-white border border-gray-200 px-4 py-4",
        "hover:shadow-md transition-all",
        className,
      )}
    >
      {/* Brand avatar / logo */}
      <div className="flex-shrink-0">
        <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
          {hasLogo ? (
            <Image src={brand.logoUrl as string} alt={brand.name} fill className="object-contain" />
          ) : (
            <span className="text-lg font-semibold text-gray-900">
              {brand.name?.charAt(0) || "B"}
            </span>
          )}
        </div>
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-1">
          <p className="text-gray-900 font-semibold text-base truncate">{brand.name}</p>
          <CheckCircle2 className="h-4 w-4 text-sky-500 flex-shrink-0" />
        </div>
        <p className="text-xs text-gray-500 mb-1">
          ACB Computer là nhà bán lẻ chính thức các sản phẩm {brand.name}.
        </p>
        {brand.description && (
          <p className="text-sm text-gray-700 line-clamp-3">{brand.description}</p>
        )}
      </div>
    </div>
  );
}
