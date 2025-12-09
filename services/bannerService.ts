import api from "@/lib/axios";
import { createQueryOptions } from "@/lib/query-utils";
import { PageResponse } from "@/types";
import type { IApiResponse } from "@/types/api-response";
import { IBanner } from "@/types/banner";

export const bannerService = {
  // POST /banners
  create: async (request: Partial<IBanner>): Promise<IBanner> => {
    const res = await api.post<IApiResponse<IBanner>>("/banners", request);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Create failed");
    }
    return res.data.data;
  },

  // GET /banners (with pagination)
  list: async (page = 0, size = 20): Promise<PageResponse<IBanner>> => {
    const res = await api.get<IApiResponse<PageResponse<IBanner>>>("/banners", {
      params: { page, size, sort: "id,asc" },
    });
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // GET /banners (all, no pagination)
  listAll: async (): Promise<IBanner[]> => {
    const pageResponse = await bannerService.list(0, 1000);
    return pageResponse.content;
  },

  // GET /banners/{id}
  get: async (id: number): Promise<IBanner> => {
    const res = await api.get<IApiResponse<IBanner>>(`/banners/${id}`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // PATCH /banners/{id}
  update: async (id: number, request: Partial<IBanner>): Promise<IBanner> => {
    const res = await api.patch<IApiResponse<IBanner>>(`/banners/${id}`, request);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Update failed");
    }
    return res.data.data;
  },

  // DELETE /banners/{id}
  delete: async (id: number): Promise<void> => {
    await api.delete<IApiResponse<void>>(`/banners/${id}`);
  },
};

export const bannerQueryKeys = {
  all: ["banners"] as const,
  lists: () => [...bannerQueryKeys.all, "list"] as const,
  list: (params?: { page?: number; size?: number }) =>
    [...bannerQueryKeys.lists(), params] as const,
  listAll: () => [...bannerQueryKeys.all, "all"] as const,
  details: () => [...bannerQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...bannerQueryKeys.details(), id] as const,
};

type BannerListParams = {
  page?: number;
  size?: number;
};

export const bannerQueries = {
  list: createQueryOptions(
    bannerQueryKeys.lists(),
    ({ page = 0, size = 20 }: BannerListParams = {}) => bannerService.list(page, size),
  ),
  listAll: createQueryOptions(bannerQueryKeys.listAll(), () => bannerService.listAll()),
  detail: createQueryOptions(bannerQueryKeys.details(), (id: number) => bannerService.get(id), {
    enabled: (id) => typeof id === "number" && id > 0,
  }),
};
