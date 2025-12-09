"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { statisticsQueries } from "@/services/statisticsService";
import { formatCurrency, formatDateTime, getUserFullName } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";

export function RecentSales() {
  const { data, isLoading } = useQuery(statisticsQueries.recentOrders());

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <div className="text-center text-muted-foreground py-8">Chưa có đơn hàng nào</div>;
  }

  return (
    <div className="space-y-2">
      {data.map((order) => {
        const userName = getUserFullName(order.user) || order.user?.email || "Khách hàng";
        const initials = userName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

        return (
          <div
            key={order.id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={order.user?.avatarUrl} alt={userName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-wrap items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm leading-none font-medium">{userName}</p>
                <p className="text-muted-foreground text-sm">
                  {order.orderedAt ? formatDateTime(order.orderedAt) : "—"}
                </p>
              </div>
              <div className="font-medium">
                {order.totalAmount ? formatCurrency(order.totalAmount) : "—"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
