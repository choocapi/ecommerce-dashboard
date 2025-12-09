"use client";

import { ProductsMutateDrawer } from "@/app/(protected)/products/_components/products-mutate-drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { productQueries } from "@/services/productService";
import { getProductStatusVariant } from "@/types/products";
import { formatCurrency, formatNumber } from "@/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Edit, StarIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { BrandHighlight } from "./_components/brand-highlight";
import { CategoryHighlight } from "./_components/category-highlight";
import ProductDescription from "./_components/product-description";
import ProductImages from "./_components/product-images";
import ProductReviews from "./_components/product-reviews";
import ProductSpecifications from "./_components/product-specifications";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: product, isLoading, error } = useQuery(productQueries.detail(Number(productId)));

  const handleEditDrawerChange = (open: boolean) => {
    setEditDrawerOpen(open);
    if (!open) {
      // Invalidate product detail query when drawer closes after edit
      queryClient.invalidateQueries({
        queryKey: productQueries.detail(Number(productId)).queryKey,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Không tìm thấy sản phẩm</h2>
        <p className="text-gray-600">Sản phẩm có thể đã bị xóa hoặc không tồn tại.</p>
        <Button asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách sản phẩm
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-sm text-gray-600">SKU: {product.sku}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Link>
          </Button>
          <Button onClick={() => setEditDrawerOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Images */}
        <ProductImages product={product} />

        {/* Product Info */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin cơ bản</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant={getProductStatusVariant(product.isPublished || false)}
                  className="font-medium"
                >
                  {product.isPublished ? "Đang bán" : "Ngừng bán"}
                </Badge>
                {product.isFeatured && <Badge variant="secondary">Sản phẩm nổi bật</Badge>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Giá bán</label>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</p>
                </div>
                {product.originalPrice && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Giá gốc</label>
                    <p className="text-lg text-gray-500 line-through">
                      {formatCurrency(product.originalPrice)}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600">Số lượng</label>
                  <p className={`text-lg font-bold text-gray-900`}>
                    {formatNumber(product.quantity || 0)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Đã bán</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatNumber(product.reservedQuantity || 0)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">
                    {product.averageRating?.toFixed(1) || 0}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  ({formatNumber(product.reviewCount || 0)} đánh giá)
                </span>
              </div>

              {product.publishedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Ngày xuất bản</label>
                  <p className="text-sm text-gray-900">
                    {new Date(product.publishedAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Category & Brand */}
          {(product.category || product.brand) && (
            <div className="space-y-4">
              {product.category && <CategoryHighlight category={product.category} />}
              {product.brand && <BrandHighlight brand={product.brand} />}
            </div>
          )}
        </div>
      </div>

      {/* Specifications */}
      <ProductSpecifications product={product} />

      {/* Description */}
      <ProductDescription product={product} />

      {/* Reviews */}
      <ProductReviews product={product} />

      {/* Edit Drawer */}
      <ProductsMutateDrawer
        open={editDrawerOpen}
        onOpenChange={handleEditDrawerChange}
        currentProduct={product}
      />
    </div>
  );
}
