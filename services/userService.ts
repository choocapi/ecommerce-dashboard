import api from "@/lib/axios";
import { createQueryOptions } from "@/lib/query-utils";
import { PageResponse } from "@/types";
import type { IApiResponse } from "@/types/api-response";
import type { IUser } from "@/types/user";

export interface UserListFilters {
  search?: string;
  role?: string;
  excludeRole?: string;
  status?: boolean;
  verified?: boolean;
}

const buildFilterParams = (filters?: UserListFilters) => {
  if (!filters) {
    return {};
  }

  const params: Record<string, unknown> = {};

  if (filters.search?.trim()) {
    params.search = filters.search.trim();
  }

  if (filters.role?.trim()) {
    params.role = filters.role.trim();
  }

  if (filters.excludeRole?.trim()) {
    params.excludeRole = filters.excludeRole.trim();
  }

  if (typeof filters.status === "boolean") {
    params.status = filters.status;
  }

  if (typeof filters.verified === "boolean") {
    params.verified = filters.verified;
  }

  return params;
};

export const userService = {
  // POST /users
  create: async (request: Partial<IUser>): Promise<IUser> => {
    const res = await api.post<IApiResponse<IUser>>("/users", request);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Create failed");
    }
    return res.data.data;
  },

  // GET /users with pagination + filters
  list: async (page = 0, size = 20, filters?: UserListFilters): Promise<PageResponse<IUser>> => {
    const res = await api.get<IApiResponse<PageResponse<IUser>>>("/users", {
      params: { page, size, sort: "createdAt,desc", ...buildFilterParams(filters) },
    });
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  listAll: async (filters?: UserListFilters): Promise<IUser[]> => {
    const page = await userService.list(0, 1000, filters);
    return page.content;
  },

  // GET /users/{id}
  get: async (id: string): Promise<IUser> => {
    const res = await api.get<IApiResponse<IUser>>(`/users/${id}`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // PATCH /users/{id}
  update: async (id: string, request: Partial<IUser>): Promise<IUser> => {
    const res = await api.patch<IApiResponse<IUser>>(`/users/${id}`, request);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Update failed");
    }
    return res.data.data;
  },

  // DELETE /users/{id}
  delete: async (id: string): Promise<void> => {
    await api.delete<IApiResponse<void>>(`/users/${id}`);
  },

  // GET /users/me
  getMyInfo: async (): Promise<IUser> => {
    const res = await api.get<IApiResponse<IUser>>("/users/me");
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // PATCH /users/me
  updateMyProfile: async (request: Partial<IUser>): Promise<IUser> => {
    const res = await api.patch<IApiResponse<IUser>>("/users/me", request);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Update failed");
    }
    return res.data.data;
  },

  // PATCH /users/change-password
  changePassword: async (request: { oldPassword: string; newPassword: string }): Promise<IUser> => {
    const res = await api.patch<IApiResponse<IUser>>("/users/change-password", request);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Change password failed");
    }
    return res.data.data;
  },
};

export const userQueryKeys = {
  all: ["users"] as const,
  lists: () => [...userQueryKeys.all, "list"] as const,
  list: (params?: { page?: number; size?: number; filters?: UserListFilters }) =>
    [...userQueryKeys.lists(), params] as const,
  listAll: () => [...userQueryKeys.all, "all"] as const,
  details: () => [...userQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...userQueryKeys.details(), id] as const,
};

type UserListParams = {
  page?: number;
  size?: number;
  filters?: UserListFilters;
};

export const userQueries = {
  list: createQueryOptions(
    userQueryKeys.lists(),
    ({ page = 0, size = 20, filters }: UserListParams = {}) =>
      userService.list(page, size, filters),
  ),
  listAll: createQueryOptions(userQueryKeys.listAll(), (filters?: UserListFilters) =>
    userService.listAll(filters),
  ),
  detail: createQueryOptions(userQueryKeys.details(), (id: string) => userService.get(id), {
    enabled: (id) => !!id,
  })
};
