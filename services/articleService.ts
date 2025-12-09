import api from "@/lib/axios";
import { createQueryOptions } from "@/lib/query-utils";
import { PageResponse } from "@/types";
import type { IApiResponse } from "@/types/api-response";
import type { IArticle } from "@/types/article";

export interface ArticleListFilters {
  search?: string;
  isPublished?: boolean;
}

const buildFilterParams = (filters?: ArticleListFilters) => {
  if (!filters) {
    return {};
  }

  const params: Record<string, unknown> = {};

  if (filters.search?.trim()) {
    params.search = filters.search.trim();
  }

  if (typeof filters.isPublished === "boolean") {
    params.isPublished = filters.isPublished;
  }

  return params;
};

export const articleService = {
  // POST /articles
  create: async (request: Partial<IArticle>): Promise<IArticle> => {
    const res = await api.post<IApiResponse<IArticle>>("/articles", request);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Create failed");
    }
    return res.data.data;
  },

  // GET /articles (with pagination)
  list: async (
    page = 0,
    size = 20,
    filters?: ArticleListFilters,
  ): Promise<PageResponse<IArticle>> => {
    const res = await api.get<IApiResponse<PageResponse<IArticle>>>("/articles", {
      params: { page, size, sort: "createdAt,desc", ...buildFilterParams(filters) },
    });
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  listAll: async (filters?: ArticleListFilters): Promise<IArticle[]> => {
    const page = await articleService.list(0, 1000, filters);
    return page.content;
  },

  // GET /articles/{id}
  get: async (id: number): Promise<IArticle> => {
    const res = await api.get<IApiResponse<IArticle>>(`/articles/${id}`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // PATCH /articles/{id}
  update: async (id: number, request: Partial<IArticle>): Promise<IArticle> => {
    const res = await api.patch<IApiResponse<IArticle>>(`/articles/${id}`, request);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Update failed");
    }
    return res.data.data;
  },

  // DELETE /articles/{id}
  delete: async (id: number): Promise<void> => {
    await api.delete<IApiResponse<void>>(`/articles/${id}`);
  },
};

export const articleQueryKeys = {
  all: ["articles"] as const,
  lists: () => [...articleQueryKeys.all, "list"] as const,
  list: (params?: { page?: number; size?: number; filters?: ArticleListFilters }) =>
    [...articleQueryKeys.lists(), params] as const,
  listAll: () => [...articleQueryKeys.all, "all"] as const,
  details: () => [...articleQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...articleQueryKeys.details(), id] as const,
};

type ArticleListParams = {
  page?: number;
  size?: number;
  filters?: ArticleListFilters;
};

export const articleQueries = {
  list: createQueryOptions(
    articleQueryKeys.lists(),
    ({ page = 0, size = 20, filters }: ArticleListParams = {}) =>
      articleService.list(page, size, filters),
  ),
  listAll: createQueryOptions(
    articleQueryKeys.listAll(),
    (filters?: ArticleListFilters) => articleService.listAll(filters),
  ),
  detail: createQueryOptions(
    articleQueryKeys.details(),
    (id: number) => articleService.get(id),
    {
      enabled: (id) => typeof id === "number" && id > 0,
    },
  ),
};
