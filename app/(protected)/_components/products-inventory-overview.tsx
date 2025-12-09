"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { statisticsQueries } from "@/services/statisticsService";
import { formatCurrency, formatNumber } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, DollarSign, Eye, Loader, Package } from "lucide-react";
import { CategoryPerformanceChart } from "./category-performance-chart";
import { ProductsBestSaleChart } from "./products-best-sale-chart";
import { RecentInventoryTransactions } from "./recent-inventory-transactions";
import { StatsCard } from "./stats-card";

export function ProductsInventoryOverview() {
  const { data: productsData, isLoading: productsLoading } = useQuery(
    statisticsQueries.productsSales(),
  );
  const { data: inventoryData, isLoading: inventoryLoading } = useQuery(
    statisticsQueries.inventory(),
  );

  const isLoading = productsLoading || inventoryLoading;

  if (productsLoading || inventoryLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Sản phẩm bán chạy</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductsBestSaleChart data={productsData?.topProducts} />
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Doanh thu theo danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryPerformanceChart data={productsData?.categoryPerformance} />
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards & Recent Transactions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left Column: Stats Cards */}
        <div className="space-y-4 lg:col-span-3">
          <div className="grid gap-4 sm:grid-cols-2">
            <StatsCard
              title="Tổng sản phẩm"
              icon={Package}
              value={inventoryData?.totalProducts ? formatNumber(inventoryData.totalProducts) : "—"}
              loading={isLoading}
            />
            <StatsCard
              title="Sản phẩm đang bán"
              icon={Eye}
              value={
                inventoryData?.publishedProducts
                  ? formatNumber(inventoryData.publishedProducts)
                  : "—"
              }
              loading={isLoading}
            />
            <StatsCard
              title="Sản phẩm sắp hết hàng"
              icon={AlertTriangle}
              value={
                inventoryData?.lowStockProducts ? formatNumber(inventoryData.lowStockProducts) : "—"
              }
              loading={isLoading}
            />
            <StatsCard
              title="Tổng giá trị tồn kho"
              icon={DollarSign}
              value={
                inventoryData?.totalInventoryValue
                  ? formatCurrency(inventoryData.totalInventoryValue)
                  : "—"
              }
              loading={isLoading}
            />
          </div>
        </div>

        {/* Right Column: Recent Transactions */}
        <div className="lg:col-span-2">
          <Card className="h-full shadow-sm">
            <CardHeader>
              <CardTitle>Giao dịch gần đây</CardTitle>
              <CardDescription>Nhập/Xuất kho mới nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentInventoryTransactions data={inventoryData?.recentTransactions} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
