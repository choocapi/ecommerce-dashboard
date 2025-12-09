import api from "@/lib/axios";
import { createQueryOptions } from "@/lib/query-utils";
import type { IApiResponse } from "@/types/api-response";
import type { IOrder } from "@/types/order";
import type {
  IInventoryStatisticsResponse,
  IProductsSalesStatisticsResponse,
  ISalesStatisticsResponse,
  IStatisticsResponse,
  StatisticsRange,
} from "@/types/statistics";

const FALLBACK_RANGE: StatisticsRange = "LAST_30_DAYS";

export const statisticsService = {
  getDashboardStats: async (range?: StatisticsRange): Promise<IStatisticsResponse> => {
    const params = range ? { range } : {};
    const res = await api.get<IApiResponse<IStatisticsResponse>>("/statistics", { params });
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Không thể tải thống kê");
    }
    return res.data.data;
  },

  getRecentOrders: async (limit: number = 10): Promise<IOrder[]> => {
    const res = await api.get<IApiResponse<IOrder[]>>("/statistics/recent-orders", {
      params: { limit },
    });
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Không thể tải đơn hàng gần đây");
    }
    return res.data.data;
  },

  getSalesStatistics: async (range?: StatisticsRange): Promise<ISalesStatisticsResponse> => {
    const params = range ? { range } : {};
    const res = await api.get<IApiResponse<ISalesStatisticsResponse>>("/statistics/sales", {
      params,
    });
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Không thể tải thống kê bán hàng");
    }
    return res.data.data;
  },

  getProductsSalesStatistics: async (): Promise<IProductsSalesStatisticsResponse> => {
    const res = await api.get<IApiResponse<IProductsSalesStatisticsResponse>>(
      "/statistics/products/sales",
    );
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Không thể tải thống kê sản phẩm");
    }
    return res.data.data;
  },

  getInventoryStatistics: async (): Promise<IInventoryStatisticsResponse> => {
    const res = await api.get<IApiResponse<IInventoryStatisticsResponse>>("/statistics/inventory");
    if (!res.data.data) {
      throw new Error(res.data.error?.message || "Không thể tải thống kê tồn kho");
    }
    return res.data.data;
  },
};

export const statisticsQueryKeys = {
  all: ["statistics"] as const,
  dashboard: () => [...statisticsQueryKeys.all, "dashboard"] as const,
  dashboardByRange: (range?: StatisticsRange) =>
    [...statisticsQueryKeys.dashboard(), range] as const,
  recentOrders: () => [...statisticsQueryKeys.all, "recent-orders"] as const,
  sales: () => [...statisticsQueryKeys.all, "sales"] as const,
  salesByRange: (range?: StatisticsRange) => [...statisticsQueryKeys.sales(), range] as const,
  productsSales: () => [...statisticsQueryKeys.all, "products-sales"] as const,
  inventory: () => [...statisticsQueryKeys.all, "inventory"] as const,
};

export const statisticsQueries = {
  dashboard: createQueryOptions(statisticsQueryKeys.dashboard(), (range?: StatisticsRange) =>
    statisticsService.getDashboardStats(range),
  ),
  recentOrders: createQueryOptions(statisticsQueryKeys.recentOrders(), () =>
    statisticsService.getRecentOrders(10),
  ),
  sales: createQueryOptions(statisticsQueryKeys.sales(), (range?: StatisticsRange) =>
    statisticsService.getSalesStatistics(range),
  ),
  productsSales: createQueryOptions(statisticsQueryKeys.productsSales(), () =>
    statisticsService.getProductsSalesStatistics(),
  ),
  inventory: createQueryOptions(statisticsQueryKeys.inventory(), () =>
    statisticsService.getInventoryStatistics(),
  ),
};
