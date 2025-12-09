export type StatisticsRange = "LAST_7_DAYS" | "LAST_30_DAYS" | "LAST_90_DAYS";

export interface IStatisticsSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  completedOrders: number;
  cancelledOrders: number;
  newCustomers: number;
}

export interface IStatisticsRevenuePoint {
  label: string;
  total: number;
}

export interface IStatisticsResponse {
  range: string | null;
  summary: IStatisticsSummary;
  revenue: IStatisticsRevenuePoint[] | null;
}

export interface ITimePoint {
  label: string;
  count: number;
}

export interface ISalesStatisticsResponse {
  totalSales: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  returnRequests: number;
  returnRate: number;
  paymentMethodBreakdown: Record<string, number>;
  ordersTimeline: ITimePoint[] | null;
}

export interface IProductSales {
  productId: number;
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface ICategorySales {
  categoryId: number;
  categoryName: string;
  totalRevenue: number;
}

export interface IProductsSalesStatisticsResponse {
  topProducts: IProductSales[];
  categoryPerformance: ICategorySales[];
}

export interface IInventoryTransactionStatistics {
  id: number;
  productName: string;
  type: string;
  quantity: number;
  price: number;
  supplierName: string | null;
  createdAt: string;
}

export interface IInventoryStatisticsResponse {
  totalProducts: number;
  publishedProducts: number;
  lowStockProducts: number;
  totalInventoryValue: number;
  recentTransactions: IInventoryTransactionStatistics[];
}

export const DEFAULT_STATISTICS_RANGE: StatisticsRange = "LAST_30_DAYS";

export const STATISTICS_RANGE_OPTIONS: { label: string; value: StatisticsRange }[] = [
  { label: "7 ngày qua", value: "LAST_7_DAYS" },
  { label: "30 ngày qua", value: "LAST_30_DAYS" },
  { label: "90 ngày qua", value: "LAST_90_DAYS" },
];
