"use client";

import { RangeSelector } from "@/components/shared/range-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { statisticsQueries } from "@/services/statisticsService";
import { DEFAULT_STATISTICS_RANGE, type StatisticsRange } from "@/types/statistics";
import { formatCurrency, formatNumber } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock, DollarSign, Loader, Percent, RotateCcw, XCircle } from "lucide-react";
import { useState } from "react";
import { OrdersChart } from "./orders-chart";
import { PaymentMethodsChart } from "./payment-methods-chart";
import { StatsCard } from "./stats-card";

export function SalesOverview() {
  const [range, setRange] = useState<StatisticsRange>(DEFAULT_STATISTICS_RANGE);
  const { data, isLoading } = useQuery(statisticsQueries.sales(range));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Payment Methods & Orders Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Phương thức thanh toán</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentMethodsChart data={data?.paymentMethodBreakdown} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Thống kê đơn hàng</CardTitle>
              <RangeSelector value={range} onValueChange={setRange} className="w-[180px]" />
            </div>
          </CardHeader>
          <CardContent>
            <OrdersChart data={data?.ordersTimeline} />
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Tổng doanh số"
          icon={DollarSign}
          value={data?.totalSales ? formatCurrency(data.totalSales) : "—"}
          loading={isLoading}
        />
        <StatsCard
          title="Đơn đã hoàn thành"
          icon={CheckCircle}
          value={data?.completedOrders ? formatNumber(data.completedOrders) : "—"}
          loading={isLoading}
        />
        <StatsCard
          title="Đơn đang chờ"
          icon={Clock}
          value={data?.pendingOrders ? formatNumber(data.pendingOrders) : "—"}
          loading={isLoading}
        />
        <StatsCard
          title="Đơn đã hủy"
          icon={XCircle}
          value={data?.cancelledOrders ? formatNumber(data.cancelledOrders) : "—"}
          loading={isLoading}
        />
        <StatsCard
          title="Yêu cầu trả hàng"
          icon={RotateCcw}
          value={data?.returnRequests ? formatNumber(data.returnRequests) : "—"}
          loading={isLoading}
        />
        <StatsCard
          title="Tỷ lệ trả hàng"
          icon={Percent}
          value={data?.returnRate !== undefined ? `${data.returnRate.toFixed(2)}%` : "—"}
          loading={isLoading}
        />
      </div>
    </div>
  );
}
