import api from "@/lib/axios";
import { createQueryOptions } from "@/lib/query-utils";
import { PageResponse } from "@/types";
import type { IApiResponse } from "@/types/api-response";
import type { ICategory } from "@/types/products";

export interface CategoryListFilters {
  search?: string;
}

const buildFilterParams = (filters?: CategoryListFilters) => {
  if (!filters) {
    return {};
  }

  const params: Record<string, unknown> = {};

  if (filters.search?.trim()) {
    params.search = filters.search.trim();
  }

  return params;
};

export const categoryService = {
  // POST /categories
  create: async (request: Partial<ICategory>): Promise<ICategory> => {
    const res = await api.post<IApiResponse<ICategory>>("/categories", request);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Create failed");
    }
    return res.data.data;
  },

  // GET /categories (with pagination)
  list: async (
    page = 0,
    size = 20,
    filters?: CategoryListFilters,
  ): Promise<PageResponse<ICategory>> => {
    const res = await api.get<IApiResponse<PageResponse<ICategory>>>("/categories", {
      params: { page, size, sort: "name,asc", ...buildFilterParams(filters) },
    });
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // GET /categories (all, no pagination)
  listAll: async (filters?: CategoryListFilters): Promise<ICategory[]> => {
    const pageResponse = await categoryService.list(0, 1000, filters);
    return pageResponse.content;
  },

  // GET /categories/{id}
  get: async (id: number): Promise<ICategory> => {
    const res = await api.get<IApiResponse<ICategory>>(`/categories/${id}`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // PATCH /categories/{id}
  update: async (id: number, request: Partial<ICategory>): Promise<ICategory> => {
    const res = await api.patch<IApiResponse<ICategory>>(`/categories/${id}`, request);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Update failed");
    }
    return res.data.data;
  },

  // DELETE /categories/{id}
  delete: async (id: number): Promise<void> => {
    await api.delete<IApiResponse<void>>(`/categories/${id}`);
  },
};

export const categoryQueryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryQueryKeys.all, "list"] as const,
  list: (params?: { page?: number; size?: number; filters?: CategoryListFilters }) =>
    [...categoryQueryKeys.lists(), params] as const,
  listAll: () => [...categoryQueryKeys.all, "all"] as const,
  details: () => [...categoryQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...categoryQueryKeys.details(), id] as const,
};

type CategoryListParams = {
  page?: number;
  size?: number;
  filters?: CategoryListFilters;
};

export const categoryQueries = {
  list: createQueryOptions(
    categoryQueryKeys.lists(),
    ({ page = 0, size = 20, filters }: CategoryListParams = {}) =>
      categoryService.list(page, size, filters),
  ),
  listAll: createQueryOptions(
    categoryQueryKeys.listAll(),
    (filters?: CategoryListFilters) => categoryService.listAll(filters),
  ),
  detail: createQueryOptions(
    categoryQueryKeys.details(),
    (id: number) => categoryService.get(id),
    {
      enabled: (id) => typeof id === "number" && id > 0,
    },
  ),
};
