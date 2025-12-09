import api from "@/lib/axios";
import { createQueryOptions } from "@/lib/query-utils";
import { PageResponse } from "@/types";
import type { IApiResponse } from "@/types/api-response";
import type { ICoupon } from "@/types/coupon";

export interface CouponListFilters {
  search?: string;
  type?: string;
  isActive?: boolean;
}

const buildFilterParams = (filters?: CouponListFilters) => {
  if (!filters) {
    return {};
  }

  const params: Record<string, unknown> = {};

  if (filters.search?.trim()) {
    params.search = filters.search.trim();
  }

  if (filters.type?.trim()) {
    params.type = filters.type.trim();
  }

  if (typeof filters.isActive === "boolean") {
    params.isActive = filters.isActive;
  }

  return params;
};

export const couponService = {
  // POST /coupons
  create: async (request: Partial<ICoupon>): Promise<ICoupon> => {
    const res = await api.post<IApiResponse<ICoupon>>("/coupons", request);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Create failed");
    }
    return res.data.data;
  },

  // GET /coupons (with pagination)
  list: async (
    page = 0,
    size = 20,
    filters?: CouponListFilters,
  ): Promise<PageResponse<ICoupon>> => {
    const res = await api.get<IApiResponse<PageResponse<ICoupon>>>("/coupons", {
      params: { page, size, sort: "desc", ...buildFilterParams(filters) },
    });
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // GET /coupons (all, no pagination)
  listAll: async (filters?: CouponListFilters): Promise<ICoupon[]> => {
    const page = await couponService.list(0, 1000, filters);
    return page.content;
  },

  // GET /coupons/{id}
  get: async (id: number): Promise<ICoupon> => {
    const res = await api.get<IApiResponse<ICoupon>>(`/coupons/${id}`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // PATCH /coupons/{id}
  update: async (id: number, request: Partial<ICoupon>): Promise<ICoupon> => {
    const res = await api.patch<IApiResponse<ICoupon>>(`/coupons/${id}`, request);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Update failed");
    }
    return res.data.data;
  },

  // DELETE /coupons/{id}
  delete: async (id: number): Promise<void> => {
    await api.delete<IApiResponse<void>>(`/coupons/${id}`);
  },
};

export const couponQueryKeys = {
  all: ["coupons"] as const,
  lists: () => [...couponQueryKeys.all, "list"] as const,
  list: (params?: { page?: number; size?: number; filters?: CouponListFilters }) =>
    [...couponQueryKeys.lists(), params] as const,
  listAll: () => [...couponQueryKeys.all, "all"] as const,
  details: () => [...couponQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...couponQueryKeys.details(), id] as const,
};

type CouponListParams = {
  page?: number;
  size?: number;
  filters?: CouponListFilters;
};

export const couponQueries = {
  list: createQueryOptions(
    couponQueryKeys.lists(),
    ({ page = 0, size = 20, filters }: CouponListParams = {}) =>
      couponService.list(page, size, filters),
  ),
  listAll: createQueryOptions(couponQueryKeys.listAll(), (filters?: CouponListFilters) =>
    couponService.listAll(filters),
  ),
  detail: createQueryOptions(couponQueryKeys.details(), (id: number) => couponService.get(id), {
    enabled: (id) => typeof id === "number" && id > 0,
  }),
};
