"use client";

import { cn } from "@/lib/utils";
import { IReturnRequest } from "@/types/return-request";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

interface ReturnRequestImagesProps {
  returnRequest: IReturnRequest;
  className?: string;
}

export default function ReturnRequestImages({
  returnRequest,
  className,
}: ReturnRequestImagesProps) {
  const images = useMemo(() => {
    if (!returnRequest?.imageUrls) return [];
    try {
      const parsed = JSON.parse(returnRequest.imageUrls);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn("Failed to parse return request images", error);
      return [];
    }
  }, [returnRequest?.imageUrls]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div
        className={cn(
          "bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-center",
          className,
        )}
      >
        <div className="text-center text-gray-400">
          <p className="text-sm">Không có ảnh</p>
        </div>
      </div>
    );
  }

  const selectedImage = images[selectedIndex] || images[0];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className={className}>
      <div className="bg-white rounded-xl">
        {/* Main Image */}
        <div className="relative w-full aspect-16/10 mb-2 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center">
          <Image
            src={selectedImage}
            alt="Return request evidence"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 40vw"
            priority
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md hover:bg-gray-100 transition"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md hover:bg-gray-100 transition"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Gallery */}
        <div className="flex gap-2 overflow-x-auto p-1 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative shrink-0 size-16 md:size-20 rounded-md overflow-hidden bg-gray-100 transition-all",
                index === selectedIndex
                  ? "ring-1 ring-black"
                  : "ring-1 ring-transparent hover:ring-gray-300",
              )}
            >
              <Image
                src={image}
                alt={`Evidence ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

