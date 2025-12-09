import api from "@/lib/axios";
import { createQueryOptions } from "@/lib/query-utils";
import { PageResponse } from "@/types";
import type { IApiResponse } from "@/types/api-response";
import type { ReturnStatus } from "@/types/enums";
import type { IReturnRequest } from "@/types/return-request";

export interface ReturnRequestListFilters {
  search?: string;
  status?: ReturnStatus;
}

const buildFilterParams = (filters?: ReturnRequestListFilters) => {
  if (!filters) {
    return {};
  }

  const params: Record<string, unknown> = {};

  if (filters.search?.trim()) {
    params.search = filters.search.trim();
  }

  if (filters.status) {
    params.status = filters.status;
  }

  return params;
};

export const returnRequestService = {
  // POST /return-requests
  create: async (request: Partial<IReturnRequest>): Promise<IReturnRequest> => {
    const res = await api.post<IApiResponse<IReturnRequest>>("/return-requests", request);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Create failed");
    }
    return res.data.data;
  },

  // GET /return-requests (admin)
  list: async (
    page = 0,
    size = 20,
    filters?: ReturnRequestListFilters,
  ): Promise<PageResponse<IReturnRequest>> => {
    const res = await api.get<IApiResponse<PageResponse<IReturnRequest>>>("/return-requests", {
      params: { page, size, ...buildFilterParams(filters) },
    });
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // GET /return-requests/:id
  get: async (id: number): Promise<IReturnRequest> => {
    const res = await api.get<IApiResponse<IReturnRequest>>(`/return-requests/${id}`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // PUT /return-requests/:id (admin)
  update: async (id: number, request: Partial<IReturnRequest>): Promise<IReturnRequest> => {
    const res = await api.put<IApiResponse<IReturnRequest>>(`/return-requests/${id}`, request);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Update failed");
    }
    return res.data.data;
  },
};

export const returnRequestQueryKeys = {
  all: ["return-requests"] as const,
  lists: () => [...returnRequestQueryKeys.all, "list"] as const,
  list: (params?: { page?: number; size?: number; filters?: ReturnRequestListFilters }) =>
    [...returnRequestQueryKeys.lists(), params] as const,
  details: () => [...returnRequestQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...returnRequestQueryKeys.details(), id] as const,
};

type ReturnRequestListParams = {
  page?: number;
  size?: number;
  filters?: ReturnRequestListFilters;
};

export const returnRequestQueries = {
  list: createQueryOptions(
    returnRequestQueryKeys.lists(),
    ({ page = 0, size = 20, filters }: ReturnRequestListParams = {}) =>
      returnRequestService.list(page, size, filters),
  ),
  detail: createQueryOptions(
    returnRequestQueryKeys.details(),
    (id: number) => returnRequestService.get(id),
    {
      enabled: (id) => typeof id === "number" && id > 0,
    },
  ),
};
