import api from "@/lib/axios";
import { createQueryOptions } from "@/lib/query-utils";
import { PageResponse } from "@/types";
import type { IApiResponse } from "@/types/api-response";
import type { InventoryTransactionType } from "@/types/enums";
import type { IInventoryTransaction } from "@/types/inventory";

export const inventoryTransactionService = {
  // POST /inventory-transactions
  create: async (
    request: Partial<IInventoryTransaction> & {
      targetQuantity?: number;
      type: InventoryTransactionType;
    },
  ): Promise<IInventoryTransaction> => {
    const res = await api.post<IApiResponse<IInventoryTransaction>>(
      "/inventory-transactions",
      request,
    );
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Create failed");
    }
    return res.data.data;
  },

  // GET /inventory-transactions (with pagination)
  list: async (page = 0, size = 20): Promise<PageResponse<IInventoryTransaction>> => {
    const res = await api.get<IApiResponse<PageResponse<IInventoryTransaction>>>(
      "/inventory-transactions",
      {
        params: { page, size, sort: "createdAt,desc" },
      },
    );
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // GET /inventory-transactions (all, no pagination)
  listAll: async (): Promise<IInventoryTransaction[]> => {
    const res = await api.get<IApiResponse<PageResponse<IInventoryTransaction>>>(
      "/inventory-transactions",
      {
        params: { page: 0, size: 1000, sort: "createdAt,desc" },
      },
    );
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data.content;
  },

  // GET /inventory-transactions/{id}
  get: async (id: number): Promise<IInventoryTransaction> => {
    const res = await api.get<IApiResponse<IInventoryTransaction>>(`/inventory-transactions/${id}`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },

  // GET /inventory-transactions/product/{productId}
  listByProduct: async (
    productId: number,
    page = 0,
    size = 10,
    type?: InventoryTransactionType,
  ): Promise<PageResponse<IInventoryTransaction>> => {
    const params: Record<string, unknown> = {
      page,
      size,
      sort: "createdAt,desc",
    };
    if (type) {
      params.type = type;
    }
    const res = await api.get<IApiResponse<PageResponse<IInventoryTransaction>>>(
      `/inventory-transactions/product/${productId}`,
      { params },
    );
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Fetch failed");
    }
    return res.data.data;
  },
};

export const inventoryTransactionQueryKeys = {
  all: ["inventory-transactions"] as const,
  lists: () => [...inventoryTransactionQueryKeys.all, "list"] as const,
  list: (params?: { page?: number; size?: number }) =>
    [...inventoryTransactionQueryKeys.lists(), params] as const,
  listAll: () => [...inventoryTransactionQueryKeys.all, "all"] as const,
  details: () => [...inventoryTransactionQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...inventoryTransactionQueryKeys.details(), id] as const,
  byProduct: () => [...inventoryTransactionQueryKeys.all, "product"] as const,
  listByProduct: (params: {
    productId: number;
    page?: number;
    size?: number;
    type?: InventoryTransactionType;
  }) => [...inventoryTransactionQueryKeys.byProduct(), params] as const,
};

type InventoryTransactionListParams = {
  page?: number;
  size?: number;
};

type ProductTransactionListParams = {
  productId: number;
  page?: number;
  size?: number;
  type?: InventoryTransactionType;
};

export const inventoryTransactionQueries = {
  list: createQueryOptions(
    inventoryTransactionQueryKeys.lists(),
    ({ page = 0, size = 20 }: InventoryTransactionListParams = {}) =>
      inventoryTransactionService.list(page, size),
  ),
  listAll: createQueryOptions(inventoryTransactionQueryKeys.listAll(), () =>
    inventoryTransactionService.listAll(),
  ),
  detail: createQueryOptions(
    inventoryTransactionQueryKeys.details(),
    (id: number) => inventoryTransactionService.get(id),
    {
      enabled: (id) => typeof id === "number" && id > 0,
    },
  ),
  listByProduct: createQueryOptions(
    inventoryTransactionQueryKeys.byProduct(),
    ({ productId, page = 0, size = 10, type }: ProductTransactionListParams) =>
      inventoryTransactionService.listByProduct(productId, page, size, type),
    {
      enabled: ({ productId }) => typeof productId === "number" && productId > 0,
    },
  ),
};
