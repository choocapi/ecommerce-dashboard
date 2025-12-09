"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { productReviewQueries } from "@/services/productReviewService";
import { IProduct } from "@/types/products";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, StarIcon } from "lucide-react";
import { useMemo, useState } from "react";
import ReviewCard from "./review-card";

interface ProductReviewsProps {
  product: IProduct;
  className?: string;
}

type ReviewSortOption = "newest" | "rating_desc" | "rating_asc";

const REVIEWS_PER_PAGE = 4;

export default function ProductReviews({ product, className }: ProductReviewsProps) {
  const [displayedCount, setDisplayedCount] = useState(REVIEWS_PER_PAGE);
  const [sortBy, setSortBy] = useState<ReviewSortOption>("newest");

  const { data: reviews = [], isLoading } = useQuery(productReviewQueries.byProduct(product.id));

  // Calculate rating statistics
  const ratingStats = useMemo(() => {
    const stats = {
      average: 0,
      total: reviews.length,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };

    if (reviews.length === 0) return stats;

    let totalRating = 0;
    reviews.forEach((review) => {
      totalRating += review.rating;
      if (review.rating >= 1 && review.rating <= 5) {
        stats.distribution[review.rating as keyof typeof stats.distribution]++;
      }
    });

    stats.average = totalRating / reviews.length;
    return stats;
  }, [reviews]);

  // Sort and limit reviews
  const displayedReviews = useMemo(() => {
    const sorted = [...reviews].sort((a, b) => {
      if (sortBy === "newest") {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      }

      if (sortBy === "rating_desc") {
        return (b.rating || 0) - (a.rating || 0);
      }

      if (sortBy === "rating_asc") {
        return (a.rating || 0) - (b.rating || 0);
      }

      return 0;
    });

    return sorted.slice(0, displayedCount);
  }, [reviews, displayedCount, sortBy]);

  const hasMore = reviews.length > displayedCount;

  const handleLoadMore = () => {
    setDisplayedCount((prev) => prev + REVIEWS_PER_PAGE);
  };

  return (
    <>
      <div className={className}>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
            <div className="flex-1">
              <h2 className="text-gray-900 font-bold text-2xl mb-4">Đánh giá sản phẩm</h2>

              {/* Overall Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl font-bold text-gray-900">
                  {ratingStats.average.toFixed(1)}
                </div>
                <div className="flex-1">
                  <Rating
                    value={Math.round(ratingStats.average)}
                    readOnly
                    className="text-yellow-400 mb-2"
                  >
                    {Array.from({ length: 5 }).map((_, index) => (
                      <RatingButton key={index} size={20} />
                    ))}
                  </Rating>
                  <p className="text-sm text-gray-600">{ratingStats.total} đánh giá</p>
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count =
                    ratingStats.distribution[star as keyof typeof ratingStats.distribution];
                  const percentage = ratingStats.total > 0 ? (count / ratingStats.total) * 100 : 0;

                  return (
                    <div key={star} className="flex items-center ">
                      <span className="text-sm text-gray-600 w-8 flex items-center gap-1">
                        {star}
                        <StarIcon fill="currentColor" className="text-yellow-400" size={14} />{" "}
                      </span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-900 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as ReviewSortOption)}
              >
                <SelectTrigger className="w-48 h-9 rounded-full border-gray-200 text-sm font-medium text-gray-900">
                  <SelectValue placeholder="Mới nhất" />
                </SelectTrigger>
                <SelectContent className="rounded-xl text-sm">
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="rating_desc">Đánh giá cao → thấp</SelectItem>
                  <SelectItem value="rating_asc">Đánh giá thấp → cao</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reviews List */}
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Đang tải đánh giá...</div>
          ) : displayedReviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Chưa có đánh giá nào</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {displayedReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    className="rounded-full border-gray-200 text-gray-900 hover:bg-gray-50 font-semibold px-6"
                  >
                    Xem thêm
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
