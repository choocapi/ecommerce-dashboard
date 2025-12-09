import api from "@/lib/axios";
import { createQueryOptions } from "@/lib/query-utils";
import { PageResponse } from "@/types";
import type { IApiResponse } from "@/types/api-response";
import type { IProduct } from "@/types/products";

export interface ProductListFilters {
  search?: string;
  categoryId?: number;
  brandId?: number;
}

const buildFilterParams = (filters?: ProductListFilters) => {
  if (!filters) {
    return {};
  }

  const params: Record<string, unknown> = {};

  if (filters.search?.trim()) {
    params.search = filters.search.trim();
  }

  if (typeof filters.categoryId === "number") {
    params.categoryId = filters.categoryId;
  }

  if (typeof filters.brandId === "number") {
    params.brandId = filters.brandId;
  }

  return params;
};

export const productService = {
  // POST /products
  create: async (request: Partial<IProduct>): Promise<IProduct> => {
    const res = await api.post<IApiResponse<IProduct>>("/products", request);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Create failed");
    }
    return res.data.data;
  },

  // GET /products (with pagination)
  list: async (
    page = 0,
    size = 20,
    filters?: ProductListFilters,
  ): Promise<PageResponse<IProduct>> => {
    const res = await api.get<IApiResponse<PageResponse<IProduct>>>("/products", {
      params: { page, size, sort: "name,asc", ...buildFilterParams(filters) },
    });
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // GET /products (all, no pagination)
  listAll: async (filters?: ProductListFilters): Promise<IProduct[]> => {
    const page = await productService.list(0, 1000, filters);
    return page.content;
  },

  // GET /products/{id}
  get: async (id: number): Promise<IProduct> => {
    const res = await api.get<IApiResponse<IProduct>>(`/products/${id}`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // PATCH /products/{id}
  update: async (id: number, request: Partial<IProduct>): Promise<IProduct> => {
    const res = await api.patch<IApiResponse<IProduct>>(`/products/${id}`, request);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Update failed");
    }
    return res.data.data;
  },

  // DELETE /products/{id}
  delete: async (id: number): Promise<void> => {
    await api.delete<IApiResponse<void>>(`/products/${id}`);
  },
};

export const productQueryKeys = {
  all: ["products"] as const,
  lists: () => [...productQueryKeys.all, "list"] as const,
  list: (params?: { page?: number; size?: number; filters?: ProductListFilters }) =>
    [...productQueryKeys.lists(), params] as const,
  listAll: () => [...productQueryKeys.all, "all"] as const,
  details: () => [...productQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...productQueryKeys.details(), id] as const,
};

type ProductListParams = {
  page?: number;
  size?: number;
  filters?: ProductListFilters;
};

export const productQueries = {
  list: createQueryOptions(
    productQueryKeys.lists(),
    ({ page = 0, size = 20, filters }: ProductListParams = {}) =>
      productService.list(page, size, filters),
  ),
  listAll: createQueryOptions(
    productQueryKeys.listAll(),
    (filters?: ProductListFilters) => productService.listAll(filters),
  ),
  detail: createQueryOptions(productQueryKeys.details(), (id: number) => productService.get(id), {
    enabled: (id) => typeof id === "number" && id > 0,
  }),
};
