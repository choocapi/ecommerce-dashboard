import api from "@/lib/axios";
import { createQueryOptions } from "@/lib/query-utils";
import { PageResponse } from "@/types";
import type { IApiResponse } from "@/types/api-response";
import type { OrderStatus, PaymentMethod } from "@/types/enums";
import type { IOrder } from "@/types/order";

export type OrderStatusFilter = OrderStatus;

export interface OrderListFilters {
  search?: string;
  status?: OrderStatusFilter;
  paymentMethod?: PaymentMethod;
}

const buildFilterParams = (filters?: OrderListFilters) => {
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

  if (filters.paymentMethod) {
    params.paymentMethod = filters.paymentMethod;
  }

  return params;
};

export const orderService = {
  // POST /orders
  create: async (request: Partial<IOrder>): Promise<IOrder> => {
    const res = await api.post<IApiResponse<IOrder>>("/orders", request);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Create failed");
    }
    return res.data.data;
  },

  // GET /orders (with pagination)
  list: async (page = 0, size = 20, filters?: OrderListFilters): Promise<PageResponse<IOrder>> => {
    const res = await api.get<IApiResponse<PageResponse<IOrder>>>("/orders", {
      params: { page, size, sort: "orderedAt,desc", ...buildFilterParams(filters) },
    });
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // GET /orders (all, no pagination)
  listAll: async (filters?: OrderListFilters): Promise<IOrder[]> => {
    const pageResponse = await orderService.list(0, 1000, filters);
    return pageResponse.content;
  },

  // GET /orders/{id}
  get: async (id: string): Promise<IOrder> => {
    const res = await api.get<IApiResponse<IOrder>>(`/orders/${id}`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // PUT /orders/{id}
  update: async (id: string, request: Partial<IOrder>): Promise<IOrder> => {
    const res = await api.put<IApiResponse<IOrder>>(`/orders/${id}`, request);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Update failed");
    }
    return res.data.data;
  },

  // DELETE /orders/{id}
  delete: async (id: string): Promise<void> => {
    await api.delete<IApiResponse<void>>(`/orders/${id}`);
  },

  // POST /orders/{id}/confirm
  confirm: async (id: string): Promise<IOrder> => {
    const res = await api.post<IApiResponse<IOrder>>(`/orders/${id}/confirm`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Confirm failed");
    }
    return res.data.data;
  },

  // POST /orders/{id}/ship
  ship: async (id: string): Promise<IOrder> => {
    const res = await api.post<IApiResponse<IOrder>>(`/orders/${id}/ship`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Ship failed");
    }
    return res.data.data;
  },

  // POST /orders/{id}/cancel
  cancel: async (id: string): Promise<IOrder> => {
    const res = await api.post<IApiResponse<IOrder>>(`/orders/${id}/cancel`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Cancel failed");
    }
    return res.data.data;
  },

  // POST /orders/{id}/confirm-delivery
  confirmDelivery: async (id: string): Promise<IOrder> => {
    const res = await api.post<IApiResponse<IOrder>>(`/orders/${id}/confirm-delivery`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Confirm delivery failed");
    }
    return res.data.data;
  },
};

export const orderQueryKeys = {
  all: ["orders"] as const,
  lists: () => [...orderQueryKeys.all, "list"] as const,
  list: (params?: { page?: number; size?: number; filters?: OrderListFilters }) =>
    [...orderQueryKeys.lists(), params] as const,
  listAll: () => [...orderQueryKeys.all, "all"] as const,
  details: () => [...orderQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...orderQueryKeys.details(), id] as const,
};

type OrderListParams = {
  page?: number;
  size?: number;
  filters?: OrderListFilters;
};

export const orderQueries = {
  list: createQueryOptions(
    orderQueryKeys.lists(),
    ({ page = 0, size = 20, filters }: OrderListParams = {}) =>
      orderService.list(page, size, filters),
  ),
  listAll: createQueryOptions(
    orderQueryKeys.listAll(),
    (filters?: OrderListFilters) => orderService.listAll(filters),
  ),
  detail: createQueryOptions(orderQueryKeys.details(), (id: string) => orderService.get(id), {
    enabled: (id) => !!id,
  }),
};
