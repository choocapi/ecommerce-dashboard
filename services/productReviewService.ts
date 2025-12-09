import api from "@/lib/axios";
import { createQueryOptions } from "@/lib/query-utils";
import { IApiResponse } from "@/types/api-response";
import { IProductReview } from "@/types/products";

interface CreateReviewRequest {
  productId: number;
  rating: number;
  content?: string;
}

export const productReviewService = {
  async create(data: CreateReviewRequest): Promise<IProductReview> {
    const response = await api.post<IApiResponse<IProductReview>>("/product-reviews", data);
    if (!response.data.data) {
      throw new Error("Failed to create review");
    }
    return response.data.data;
  },

  async listByProduct(productId: number): Promise<IProductReview[]> {
    const response = await api.get<IApiResponse<IProductReview[]>>(
      `/product-reviews/product/${productId}`,
    );
    return response.data.data || [];
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/product-reviews/${id}`);
  },
};

export const productReviewQueryKeys = {
  all: ["product-reviews"] as const,
  byProduct: () => [...productReviewQueryKeys.all, "product"] as const,
  listByProduct: (productId: number) =>
    [...productReviewQueryKeys.byProduct(), productId] as const,
};

export const productReviewQueries = {
  byProduct: createQueryOptions(
    productReviewQueryKeys.byProduct(),
    (productId: number) => productReviewService.listByProduct(productId),
    {
      enabled: (productId) => typeof productId === "number" && productId > 0,
    },
  ),
};
