"use client";

import { cn } from "@/lib/utils";
import { IProductReview, parseImageUrls } from "@/types/products";
import { formatDate } from "@/utils";
import { StarIcon, ThumbsUp } from "lucide-react";
import Image from "next/image";

interface ReviewCardProps {
  review: IProductReview;
  className?: string;
}

export default function ReviewCard({ review, className }: ReviewCardProps) {
  const reviewImages = parseImageUrls(review.imageUrls);
  const userName =
    review.user?.firstName && review.user?.lastName
      ? `${review.user.firstName} ${review.user.lastName}`
      : review.user?.email || "Người dùng";

  return (
    <div
      className={cn(
        "group flex flex-col rounded-xl bg-white border border-gray-200 overflow-hidden",
        "hover:shadow-md transition-all duration-300",
        "p-4",
        className,
      )}
    >
      {/* User Info & Rating */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-gray-900 font-semibold text-sm">{userName}</h3>
            <span className="text-sm text-gray-600 flex items-center gap-1">
              {review.rating.toFixed(1)}{" "}
              <StarIcon fill="currentColor" className="text-yellow-400" size={14} />
            </span>
          </div>
          {review.isPurchased && (
            <div className="flex items-center gap-1 text-xs text-blue-600">
              <ThumbsUp className="h-3 w-3" />
              <span>Đã mua hàng</span>
            </div>
          )}
        </div>
      </div>

      {/* Review Image */}
      {reviewImages.length > 0 && (
        <div className="mb-3">
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <Image src={reviewImages[0]} alt="Review image" fill className="object-cover" />
          </div>
        </div>
      )}

      {/* Review Content */}
      {review.content && (
        <p className="text-sm text-gray-600 leading-relaxed mb-2">{review.content}</p>
      )}

      {/* Review Date */}
      {review.createdAt && <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>}
    </div>
  );
}
