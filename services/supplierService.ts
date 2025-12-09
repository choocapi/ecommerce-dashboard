import api from "@/lib/axios";
import { createQueryOptions } from "@/lib/query-utils";
import { PageResponse } from "@/types";
import type { IApiResponse } from "@/types/api-response";
import type { ISupplier } from "@/types/supplier";

export interface SupplierListFilters {
  search?: string;
}

const buildFilterParams = (filters?: SupplierListFilters) => {
  if (!filters) {
    return {};
  }

  const params: Record<string, unknown> = {};

  if (filters.search?.trim()) {
    params.search = filters.search.trim();
  }

  return params;
};

export const supplierService = {
  // POST /suppliers
  create: async (request: Partial<ISupplier>): Promise<ISupplier> => {
    const res = await api.post<IApiResponse<ISupplier>>("/suppliers", request);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Create failed");
    }
    return res.data.data;
  },

  // GET /suppliers (with pagination)
  list: async (
    page = 0,
    size = 20,
    filters?: SupplierListFilters,
  ): Promise<PageResponse<ISupplier>> => {
    const res = await api.get<IApiResponse<PageResponse<ISupplier>>>("/suppliers", {
      params: { page, size, sort: "name,asc", ...buildFilterParams(filters) },
    });
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // GET /suppliers (all, no pagination)
  listAll: async (filters?: SupplierListFilters): Promise<ISupplier[]> => {
    const pageResponse = await supplierService.list(0, 1000, filters);
    return pageResponse.content;
  },

  // GET /suppliers/{id}
  get: async (id: number): Promise<ISupplier> => {
    const res = await api.get<IApiResponse<ISupplier>>(`/suppliers/${id}`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // PATCH /suppliers/{id}
  update: async (id: number, request: Partial<ISupplier>): Promise<ISupplier> => {
    const res = await api.patch<IApiResponse<ISupplier>>(`/suppliers/${id}`, request);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Update failed");
    }
    return res.data.data;
  },

  // DELETE /suppliers/{id}
  delete: async (id: number): Promise<void> => {
    await api.delete<IApiResponse<void>>(`/suppliers/${id}`);
  },
};

export const supplierQueryKeys = {
  all: ["suppliers"] as const,
  lists: () => [...supplierQueryKeys.all, "list"] as const,
  list: (params?: { page?: number; size?: number; filters?: SupplierListFilters }) =>
    [...supplierQueryKeys.lists(), params] as const,
  listAll: () => [...supplierQueryKeys.all, "all"] as const,
  details: () => [...supplierQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...supplierQueryKeys.details(), id] as const,
};

type SupplierListParams = {
  page?: number;
  size?: number;
  filters?: SupplierListFilters;
};

export const supplierQueries = {
  list: createQueryOptions(
    supplierQueryKeys.lists(),
    ({ page = 0, size = 20, filters }: SupplierListParams = {}) =>
      supplierService.list(page, size, filters),
  ),
  listAll: createQueryOptions(
    supplierQueryKeys.listAll(),
    (filters?: SupplierListFilters) => supplierService.listAll(filters),
  ),
  detail: createQueryOptions(
    supplierQueryKeys.details(),
    (id: number) => supplierService.get(id),
    {
      enabled: (id) => typeof id === "number" && id > 0,
    },
  ),
};
