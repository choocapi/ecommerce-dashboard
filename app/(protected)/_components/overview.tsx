"use client";

import { RangeSelector } from "@/components/shared/range-selector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { statisticsQueries } from "@/services/statisticsService";
import { DEFAULT_STATISTICS_RANGE, type StatisticsRange } from "@/types/statistics";
import { formatCurrency, formatNumber } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, Loader, Package, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { RecentSales } from "./recent-sales";
import { StatsCard } from "./stats-card";

export function Overview() {
  const [range, setRange] = useState<StatisticsRange>(DEFAULT_STATISTICS_RANGE);
  const { data: statsData, isLoading: statsLoading } = useQuery(
    statisticsQueries.dashboard(undefined),
  );
  const { data: chartData, isLoading: chartLoading } = useQuery(statisticsQueries.dashboard(range));

  if (statsLoading || chartLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const revenueData = chartData?.revenue || [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Chart & Stats */}
        <div className="space-y-6 lg:col-span-2">
          {/* Revenue Chart */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Biểu đồ doanh thu</CardTitle>
                <RangeSelector value={range} onValueChange={setRange} className="w-[180px]" />
              </div>
            </CardHeader>
            <CardContent className="ps-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={revenueData}>
                  <XAxis
                    dataKey="label"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    direction="ltr"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => {
                      if (value >= 1000000) {
                        return `${(value / 1000000).toFixed(1)}tr`;
                      }
                      if (value >= 1000) {
                        return `${(value / 1000).toFixed(1)}k`;
                      }
                      return value.toString();
                    }}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value: number) => [
                      new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                        value,
                      ),
                      "Doanh thu",
                    ]}
                  />
                  <Bar
                    dataKey="total"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <StatsCard
              title="Tổng doanh thu"
              icon={DollarSign}
              value={
                statsData?.summary?.totalRevenue
                  ? formatCurrency(statsData.summary.totalRevenue)
                  : "—"
              }
              loading={statsLoading}
            />
            <StatsCard
              title="Tổng đơn hàng"
              icon={Package}
              value={
                statsData?.summary?.totalOrders ? formatNumber(statsData.summary.totalOrders) : "—"
              }
              loading={statsLoading}
            />
            <StatsCard
              title="Giá trị đơn hàng trung bình"
              icon={TrendingUp}
              value={
                statsData?.summary?.averageOrderValue
                  ? formatCurrency(statsData.summary.averageOrderValue)
                  : "—"
              }
              loading={statsLoading}
            />
            <StatsCard
              title="Lượng khách hàng"
              icon={Users}
              value={
                statsData?.summary?.newCustomers
                  ? formatNumber(statsData.summary.newCustomers)
                  : "—"
              }
              loading={statsLoading}
            />
          </div>
        </div>

        {/* Right Column: Recent Sales */}
        <div className="lg:col-span-1">
          <Card className="h-full shadow-sm">
            <CardHeader>
              <CardTitle>Đơn hàng gần đây</CardTitle>
              <CardDescription>Các đơn hàng đã hoàn thành</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentSales />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
