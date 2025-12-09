import api from "@/lib/axios";
import { createQueryOptions } from "@/lib/query-utils";
import { PageResponse } from "@/types";
import type { IApiResponse } from "@/types/api-response";
import type { IBrand } from "@/types/products";

export interface BrandListFilters {
  search?: string;
}

const buildFilterParams = (filters?: BrandListFilters) => {
  if (!filters) {
    return {};
  }

  const params: Record<string, unknown> = {};

  if (filters.search?.trim()) {
    params.search = filters.search.trim();
  }

  return params;
};

export const brandService = {
  // POST /brands
  create: async (request: Partial<IBrand>): Promise<IBrand> => {
    const res = await api.post<IApiResponse<IBrand>>("/brands", request);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Create failed");
    }
    return res.data.data;
  },

  // GET /brands (with pagination)
  list: async (page = 0, size = 20, filters?: BrandListFilters): Promise<PageResponse<IBrand>> => {
    const res = await api.get<IApiResponse<PageResponse<IBrand>>>("/brands", {
      params: { page, size, sort: "name,asc", ...buildFilterParams(filters) },
    });
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // GET /brands (all, no pagination)
  listAll: async (filters?: BrandListFilters): Promise<IBrand[]> => {
    const pageResponse = await brandService.list(0, 1000, filters);
    return pageResponse.content;
  },

  // GET /brands/{id}
  get: async (id: number): Promise<IBrand> => {
    const res = await api.get<IApiResponse<IBrand>>(`/brands/${id}`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // PATCH /brands/{id}
  update: async (id: number, request: Partial<IBrand>): Promise<IBrand> => {
    const res = await api.patch<IApiResponse<IBrand>>(`/brands/${id}`, request);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Update failed");
    }
    return res.data.data;
  },

  // DELETE /brands/{id}
  delete: async (id: number): Promise<void> => {
    await api.delete<IApiResponse<void>>(`/brands/${id}`);
  },
};

export const brandQueryKeys = {
  all: ["brands"] as const,
  lists: () => [...brandQueryKeys.all, "list"] as const,
  list: (params?: { page?: number; size?: number; filters?: BrandListFilters }) =>
    [...brandQueryKeys.lists(), params] as const,
  listAll: () => [...brandQueryKeys.all, "all"] as const,
  details: () => [...brandQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...brandQueryKeys.details(), id] as const,
};

type BrandListParams = {
  page?: number;
  size?: number;
  filters?: BrandListFilters;
};

export const brandQueries = {
  list: createQueryOptions(
    brandQueryKeys.lists(),
    ({ page = 0, size = 20, filters }: BrandListParams = {}) =>
      brandService.list(page, size, filters),
  ),
  listAll: createQueryOptions(
    brandQueryKeys.listAll(),
    (filters?: BrandListFilters) => brandService.listAll(filters),
  ),
  detail: createQueryOptions(brandQueryKeys.details(), (id: number) => brandService.get(id), {
    enabled: (id) => typeof id === "number" && id > 0,
  }),
};
